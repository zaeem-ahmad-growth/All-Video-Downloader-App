Add-Type -AssemblyName System.Drawing
$root = Split-Path $PSScriptRoot -Parent
$srcRoot = Join-Path $root 'avd-graphics-src'
$dst = Join-Path $root 'avd-graphics'
$sheets = Join-Path $root 'avd-contact'
New-Item -ItemType Directory -Force $dst, $sheets | Out-Null
$jpeg = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }

function Save-Jpeg($img, $outPath, $maxLong, $quality) {
    $scale = [Math]::Min(1.0, $maxLong / [Math]::Max($img.Width, $img.Height))
    $w = [int][Math]::Round($img.Width * $scale); $h = [int][Math]::Round($img.Height * $scale)
    $bmp = New-Object System.Drawing.Bitmap($w, $h, [System.Drawing.Imaging.PixelFormat]::Format24bppRgb)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.Clear([System.Drawing.Color]::White)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.DrawImage($img, 0, 0, $w, $h)
    $ep = New-Object System.Drawing.Imaging.EncoderParameters(1)
    $ep.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [long]$quality)
    $bmp.Save($outPath, $jpeg, $ep)
    $g.Dispose(); $bmp.Dispose()
}

$manifest = Get-Content (Join-Path $PSScriptRoot 'graphics-src.json') -Raw | ConvertFrom-Json
# Order by installs, highest first; renumber the folders to match.
$ordered = $manifest | Sort-Object { -[long]$_.installs }
$out = @()
$n = 0
foreach ($m in $ordered) {
    $n++
    $base = $m.slug -replace '^\d+-', ''
    $slug = ('{0:00}-{1}' -f $n, $base)
    $srcDir = Join-Path $srcRoot $m.slug
    $outDir = Join-Path $dst $slug
    New-Item -ItemType Directory -Force $outDir | Out-Null
    $entry = [ordered]@{ num = $n; slug = $slug; id = $m.id; title = $m.title; developer = $m.developer; installsLabel = $m.installsLabel; installs = $m.installs; score = $m.score; ratings = $m.ratings; genre = $m.genre; updated = $m.updated; released = $m.released; video = $m.video; url = $m.url; assets = @() }
    $tiles = @()
    # icon: keep the original file
    if ($m.icon) {
        $f = Join-Path $srcDir $m.icon.file
        $img = [System.Drawing.Image]::FromFile($f)
        Copy-Item $f (Join-Path $outDir $m.icon.file) -Force
        $entry.assets += [ordered]@{ kind = 'icon'; file = "$slug/$($m.icon.file)"; w = $img.Width; h = $img.Height; src = $m.icon.src; label = 'Icon 01' }
        $tiles += $f
        $img.Dispose()
    }
    if ($m.feature) {
        $f = Join-Path $srcDir $m.feature.file
        $img = [System.Drawing.Image]::FromFile($f)
        Save-Jpeg $img (Join-Path $outDir 'feature-graphic-01.jpg') 1024 88
        $entry.assets += [ordered]@{ kind = 'feature-graphic'; file = "$slug/feature-graphic-01.jpg"; w = $img.Width; h = $img.Height; src = $m.feature.src; label = 'Feature Graphic 01' }
        $tiles += $f
        $img.Dispose()
    }
    $k = 0
    foreach ($s in $m.shots) {
        if ($s.error) { continue }
        $k++
        $f = Join-Path $srcDir $s.file
        $img = [System.Drawing.Image]::FromFile($f)
        $name = 'screenshot-{0:00}.jpg' -f $k
        Save-Jpeg $img (Join-Path $outDir $name) 1100 80
        $entry.assets += [ordered]@{ kind = 'screenshot'; file = "$slug/$name"; w = $img.Width; h = $img.Height; src = $s.src; label = ('Screenshot {0:00}' -f $k) }
        if ($tiles.Count -lt 14) { $tiles += $f }
        $img.Dispose()
    }
    # contact sheet: up to 14 tiles, 7 per row, each tile 220 wide, labelled
    $cols = 7; $tw = 220; $th = 300; $pad = 10
    $rows = [Math]::Ceiling($tiles.Count / $cols)
    $sheet = New-Object System.Drawing.Bitmap(($cols * ($tw + $pad) + $pad), ($rows * ($th + $pad + 18) + $pad + 40))
    $g = [System.Drawing.Graphics]::FromImage($sheet)
    $g.Clear([System.Drawing.Color]::FromArgb(240, 240, 240))
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $font = New-Object System.Drawing.Font('Segoe UI', 11)
    $bold = New-Object System.Drawing.Font('Segoe UI', 13, [System.Drawing.FontStyle]::Bold)
    $brush = [System.Drawing.Brushes]::Black
    $g.DrawString(('{0}. {1} - {2} - {3}' -f $n, $m.title, $m.developer, $m.installsLabel), $bold, $brush, $pad, 8)
    $i = 0
    foreach ($t in $tiles) {
        $img = [System.Drawing.Image]::FromFile($t)
        $r = [Math]::Floor($i / $cols); $c = $i % $cols
        $x = $pad + $c * ($tw + $pad); $y = 40 + $pad + $r * ($th + $pad + 18)
        $scale = [Math]::Min($tw / $img.Width, $th / $img.Height)
        $w = [int]($img.Width * $scale); $h = [int]($img.Height * $scale)
        $g.DrawImage($img, $x + [int](($tw - $w) / 2), $y + [int](($th - $h) / 2), $w, $h)
        $g.DrawString([IO.Path]::GetFileNameWithoutExtension($t) + " $($img.Width)x$($img.Height)", $font, $brush, $x, $y + $th + 2)
        $img.Dispose(); $i++
    }
    $ep = New-Object System.Drawing.Imaging.EncoderParameters(1)
    $ep.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [long]82)
    $sheet.Save((Join-Path $sheets ('{0:00}.jpg' -f $n)), $jpeg, $ep)
    $g.Dispose(); $sheet.Dispose()
    $out += $entry
    "{0:00} {1,-34} {2,-14} shots {3,2} · tiles {4}" -f $n, $m.title, $m.installsLabel, $k, $tiles.Count
}
$out | ConvertTo-Json -Depth 6 | Set-Content (Join-Path $PSScriptRoot 'graphics-manifest.json') -Encoding utf8
$all = Get-ChildItem $dst -Recurse -File
"outputs: $($all.Count) files · $([Math]::Round(($all | Measure-Object Length -Sum).Sum / 1MB, 1)) MB"
