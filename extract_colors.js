const { execSync } = require('child_process');
const fs = require('fs');

// Use PowerShell to extract dominant colors from images
const psScript = `
Add-Type -AssemblyName System.Drawing

function Get-DominantColors($path, $count) {
    $img = [System.Drawing.Image]::FromFile($path)
    $bmp = New-Object System.Drawing.Bitmap($img)

    # Sample pixels (every 10th pixel for performance)
    $colors = @{}
    for ($x = 0; $x -lt $bmp.Width; $x += 10) {
        for ($y = 0; $y -lt $bmp.Height; $y += 10) {
            $p = $bmp.GetPixel($x, $y)
            $hex = "#{0:X2}{1:X2}{2:X2}" -f $p.R, $p.G, $p.B
            if ($colors.ContainsKey($hex)) { $colors[$hex]++ } else { $colors[$hex] = 1 }
        }
    }

    $img.Dispose()
    $bmp.Dispose()

    # Sort by frequency
    $sorted = $colors.GetEnumerator() | Sort-Object Value -Descending | Select-Object -First $count
    Write-Host "Dimensions: $($img.Width)x$($img.Height)"
    Write-Host "Top $count colors:"
    foreach ($c in $sorted) {
        Write-Host "  $($c.Key) - $($c.Value) pixels"
    }
}

Write-Host "=== 主视觉风格参考 ==="
Get-DominantColors "C:\\Users\\李梅僖\\Desktop\\ui设计\\主视觉风格参考.png" 10
Write-Host ""
Write-Host "=== logo图 ==="
Get-DominantColors "C:\\Users\\李梅僖\\Desktop\\ui设计\\logo图.png" 10
`;

const result = execSync('powershell -Command "' + psScript.replace(/"/g, '\\"') + '"', { encoding: 'utf8', maxBuffer: 10*1024*1024 });
console.log(result);

// Also get file sizes
const files = ['主视觉风格参考.png', 'logo图.png'];
files.forEach(f => {
    const stats = fs.statSync('C:\\Users\\李梅僖\\Desktop\\ui设计\\' + f);
    console.log(`${f}: ${(stats.size/1024).toFixed(1)} KB`);
});
