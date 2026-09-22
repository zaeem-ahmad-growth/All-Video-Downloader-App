param([switch]$Detail)
$dir = $PSScriptRoot
$j = [IO.File]::ReadAllText("$dir\payload.json", [Text.Encoding]::UTF8) | ConvertFrom-Json
$long = [IO.File]::ReadAllText("$dir\tiksta-long.txt", [Text.Encoding]::UTF8).TrimEnd()
function normT($s) { ' ' + (($s.ToLower() -replace '&', ' and ' -replace '[^a-z0-9]+', ' ').Trim()) + ' ' }
function phraseN($text, $p) { $t = normT $text; $n = normT $p; $c = 0; $i = $t.IndexOf($n); while ($i -ge 0) { $c++; $i = $t.IndexOf($n, $i + $n.Length - 1) }; $c }
function words($s) { @((normT $s).Trim().Split(' ') | Where-Object { $_ }) }
function allIn($q, $set) { foreach ($w in (words $q)) { if (-not $set.Contains($w)) { return $false } }; $true }
function cov($q, $f) {
  if (phraseN $f.title $q) { return @('title', 1) }
  $ts = New-Object 'System.Collections.Generic.HashSet[string]'; (words $f.title) | ForEach-Object { [void]$ts.Add($_) }
  if (allIn $q $ts) { return @('titlew', 0.85) }
  if (phraseN $f.short $q) { return @('short', 0.7) }
  (words $f.short) | ForEach-Object { [void]$ts.Add($_) }
  if (allIn $q $ts) { return @('tsw', 0.7) }
  if (phraseN $f.long $q) { return @('long', 0.3) }
  @('none', 0)
}
$brand = '\b(instagram|insta|facebook|fb|tiktok|whatsapp|linkedin|pinterest|twitter|x|vimeo|dailymotion|youtube)\b'
$US = foreach ($r in $j.data.board.US) {
  $o = [pscustomobject]@{ q = $r.q; tier = $r.tier; tm = [bool]$r.tm; R = [double]$r.R; O = [double]$r.O; P = [int]$r.P; entry = $r.entry; c10 = $r.c10 }
  if ($o.tm -and $o.q -match '\breels?\b' -and $o.q -notmatch $brand) { $o.tm = $false; $o.R = [Math]::Round($o.R + 0.165, 3); $o.P = [int][Math]::Round(100 * $o.R * $o.R * $o.O); $o.tier = 'A'; $o | Add-Member cleared $true }
  $o
}
$US = $US | Sort-Object P -Descending
$FIN = @($US | Where-Object { ($_.tier -eq 'A' -or $_.tier -eq 'B') -and $_.R -ge 0.8 -and -not $_.tm -and $_.q -notmatch 'without ads|\bfree\b|\b4k\b' })
"finalized: $($FIN.Count)"
function score($f) {
  $got = 0; $all = 0; $strong = 0; $any = 0
  foreach ($r in $US) { if ($r.tier -eq 'D' -or $r.tm) { continue }; $c = cov $r.q $f; $all += $r.P; $got += $r.P * $c[1] }
  foreach ($r in $FIN) { $c = cov $r.q $f; if ($c[0] -ne 'none') { $any++ }; if ($c[0] -in 'title','titlew','short','tsw') { $strong++ } }
  [pscustomobject]@{ prio = [Math]::Round(100 * $got / $all, 1); fin = $any; strong = $strong }
}
$titles = 'Tiksta: Reels Video Downloader', 'Tiksta Social Video Downloader', 'Tiksta - Reels & Story Saver', 'Reels Downloader - Tiksta', 'Tiksta: Reels & Video Saver', 'Tiksta: Video Downloader', 'Tiksta: Reels Downloader App'
$shorts = @(
  'Save & download reels and social videos in HD from a link. Private saver app',
  'Download & save reels, social videos and stories in HD. Fast, private saver app',
  'Save & download reels and social videos in HD from a link. Fast story saver app',
  'Save & download reels & social videos in HD from any link. Fast, private saver app',
  'Save & download reels and all social videos in HD from a link. Fast saver app',
  'Save & download reels & social videos in HD from a link. Fast, private saver app',
  'Save & download reels & social videos in HD from a link. Private story saver app',
  'Save & download reels, stories & social videos in HD. Fast, private saver app',
  'Save & download reels & all social videos in HD from a link. Private saver app'
)
"long chars: $($long.Length)  words: $((words $long).Count)"
foreach ($t in $titles) { $s = score @{ title = $t; short = ''; long = $long }; "T {0,-34} len {1,2}  prio {2}  fin {3}/{4} strong {5}" -f $t, $t.Length, $s.prio, $s.fin, $FIN.Count, $s.strong }
foreach ($sh in $shorts) { $s = score @{ title = $titles[0]; short = $sh; long = $long }; "S len {0,2} prio {1} fin {2} strong {3} | {4}" -f $sh.Length, $s.prio, $s.fin, $s.strong, $sh }
if ($Detail) {
  $f = @{ title = $titles[0]; short = $shorts[[int]$env:SHORT_I]; long = $long }
  foreach ($r in $US) { if ($r.tier -eq 'D') { continue }; $c = cov $r.q $f; "{0,-4} P{1,-3} R{2,-6} tm={3} entry={4,-8} c10={5} {6,-7} longÃ—{7} | {8}" -f $r.tier, $r.P, $r.R, [int]$r.tm, $r.entry, $r.c10, $c[0], (phraseN $long $r.q), $r.q }
}
