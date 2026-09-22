$ProgressPreference = 'SilentlyContinue'
$dir = $PSScriptRoot
$UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36'
$queries = @(
  'reels downloader', 'reels video downloader', 'reels saver', 'video downloader for reels',
  'insta downloader', 'insta saver', 'tiktok downloader', 'tik tok video downloader',
  'video downloader for tiktok', 'instagram downloader', 'video downloader for instagram',
  'tiksta', 'reels downloader app', 'social video downloader', 'private video downloader', 'save video'
)
$serps = [ordered]@{}
foreach ($q in $queries) {
  $u = 'https://play.google.com/store/search?q=' + [uri]::EscapeDataString($q) + '&c=apps&hl=en&gl=US'
  try {
    $r = Invoke-WebRequest -Uri $u -UseBasicParsing -Headers @{ 'User-Agent' = $UA; 'Accept-Language' = 'en-US,en;q=0.9' } -TimeoutSec 60
    $ids = [regex]::Matches($r.Content, 'details\?id=([A-Za-z0-9_.]+)') | ForEach-Object { $_.Groups[1].Value } | Select-Object -Unique
    $serps[$q] = @($ids)
  } catch { $serps[$q] = @(); Write-Output "search failed: $q $_" }
}
$all = $serps.Values | ForEach-Object { $_ } | Select-Object -Unique
Write-Output "queries: $($queries.Count) unique apps: $($all.Count)"

$pool = [runspacefactory]::CreateRunspacePool(1, 10); $pool.Open()
$work = {
  param($id, $UA)
  $ProgressPreference = 'SilentlyContinue'
  $o = [ordered]@{ id = $id; ok = $false }
  for ($try = 0; $try -lt 3 -and -not $o.ok; $try++) {
    try {
      $r = Invoke-WebRequest -Uri ("https://play.google.com/store/apps/details?id=$id&hl=en&gl=US") -UseBasicParsing -Headers @{ 'User-Agent' = $UA; 'Accept-Language' = 'en-US,en;q=0.9' } -TimeoutSec 60
      $c = $r.Content
      $t = [regex]::Match($c, '<meta property="og:title" content="([^"]*)"').Groups[1].Value
      $o.title = [System.Net.WebUtility]::HtmlDecode(($t -replace ' - Apps on Google Play$', ''))
      $inst = [regex]::Match($c, '"([\d,]+\+)",(\d+),(\d+),"([^"]+)"')
      if ($inst.Success) { $o.band = $inst.Groups[4].Value; $o.min = [int64]$inst.Groups[2].Value; $o.installs = [int64]$inst.Groups[3].Value }
      $ld = [regex]::Match($c, '<script type="application/ld\+json"[^>]*>(.*?)</script>', 'Singleline')
      if ($ld.Success) { try { $j = $ld.Groups[1].Value | ConvertFrom-Json; $o.dev = $j.author.name; if ($j.aggregateRating) { $o.score = $j.aggregateRating.ratingValue; $o.ratings = $j.aggregateRating.ratingCount } } catch {} }
      $dates = [regex]::Matches($c, '\["([A-Z][a-z]{2} \d{1,2}, \d{4})",\[(\d{9,11})') | ForEach-Object { [int64]$_.Groups[2].Value } | Sort-Object -Unique
      if ($dates) { $o.first = ([DateTimeOffset]::FromUnixTimeSeconds(($dates | Select-Object -First 1))).UtcDateTime.ToString('yyyy-MM-dd'); $o.last = ([DateTimeOffset]::FromUnixTimeSeconds(($dates | Select-Object -Last 1))).UtcDateTime.ToString('yyyy-MM-dd') }
      $o.ok = $true
    } catch { $o.err = "$_"; Start-Sleep -Seconds 2 }
  }
  [pscustomobject]$o
}
$jobs = foreach ($id in $all) { $ps = [powershell]::Create(); $ps.RunspacePool = $pool; [void]$ps.AddScript($work).AddArgument($id).AddArgument($UA); [pscustomobject]@{ ps = $ps; h = $ps.BeginInvoke() } }
$apps = foreach ($j in $jobs) { $j.ps.EndInvoke($j.h); $j.ps.Dispose() }
$pool.Close()
$outObj = [ordered]@{ collectedAt = (Get-Date).ToUniversalTime().ToString('o'); serps = $serps; apps = $apps }
[IO.File]::WriteAllText("$dir\playcheck.json", ($outObj | ConvertTo-Json -Depth 6), (New-Object Text.UTF8Encoding($false)))
Write-Output "details ok: $(($apps | Where-Object ok).Count) / $($apps.Count)"
