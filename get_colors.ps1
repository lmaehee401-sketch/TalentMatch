Add-Type -AssemblyName System.Drawing

function Get-DominantColors($path, $label) {
    $img = [System.Drawing.Image]::FromFile($path)
    $bmp = New-Object System.Drawing.Bitmap($img)
    $w = $img.Width
    $h = $img.Height

    $colors = @{}
    $step = [Math]::Max(1, [Math]::Min($w, $h) / 50)
    for ($x = 0; $x -lt $w; $x += $step) {
        for ($y = 0; $y -lt $h; $y += $step) {
            $p = $bmp.GetPixel($x, $y)
            $hex = "#{0:X2}{1:X2}{2:X2}" -f $p.R, $p.G, $p.B
            if ($colors.ContainsKey($hex)) { $colors[$hex]++ } else { $colors[$hex] = 1 }
        }
    }

    Write-Host "=== $label ==="
    Write-Host "Size: ${w}x${h}"
    Write-Host "Top 12 colors:"
    $sorted = $colors.GetEnumerator() | Sort-Object Value -Descending | Select-Object -First 12
    $total = 0
    foreach ($c in $sorted) { $total += $c.Value }
    foreach ($c in $sorted) {
        $pct = [Math]::Round($c.Value / $total * 100, 1)
        Write-Host "  $($c.Key)  ${pct}%"
    }
    $img.Dispose()
    $bmp.Dispose()
}

Get-DominantColors "C:\Users\李梅僖\Desktop\ui设计\主视觉风格参考.png" "主视觉风格参考"
Write-Host ""
Get-DominantColors "C:\Users\李梅僖\Desktop\ui设计\logo图.png" "logo图"
