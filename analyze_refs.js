const fs = require('fs');
const path = require('path');
const { PNG } = require('C:/Users/李梅僖/AppData/Local/Temp/ui_ref/node_modules/pngjs');

const baseDir = 'C:/Users/李梅僖/AppData/Local/Temp/ui_ref';

['visual.png', 'logo.png'].forEach(f => {
  const filepath = path.join(baseDir, f);
  if (!fs.existsSync(filepath)) {
    console.log(f + ' not found at ' + filepath);
    return;
  }

  const png = PNG.sync.read(fs.readFileSync(filepath));
  console.log('=== ' + f + ' ===');
  console.log('Dimensions: ' + png.width + 'x' + png.height);

  const colors = {};
  const step = Math.max(1, Math.floor(Math.min(png.width, png.height) / 25));
  let total = 0;

  for (let y = 0; y < png.height; y += step) {
    for (let x = 0; x < png.width; x += step) {
      const idx = (png.width * y + x) << 2;
      // Round to nearest 20 for color grouping
      const hex = '#' + [png.data[idx], png.data[idx+1], png.data[idx+2]]
        .map(c => Math.round(c/20)*20)
        .map(c => c.toString(16).padStart(2,'0').toUpperCase()).join('');
      colors[hex] = (colors[hex] || 0) + 1;
      total++;
    }
  }

  console.log('Dominant colors (rounded to nearest 20):');
  const sorted = Object.entries(colors).sort((a,b) => b[1] - a[1]).slice(0, 12);
  sorted.forEach(([hex, count]) => {
    const pct = (count/total*100).toFixed(1);
    // Simple brightness indicator
    const r = parseInt(hex.slice(1,3), 16);
    const g = parseInt(hex.slice(3,5), 16);
    const b = parseInt(hex.slice(5,7), 16);
    const brightness = Math.round((r+g+b)/3);
    const label = brightness > 200 ? ' (light)' : brightness < 60 ? ' (dark)' : '';
    console.log('  ' + hex + '  ' + pct + '%' + label);
  });

  // Overall brightness
  let totalBrightness = 0;
  let pixelCount = 0;
  for (let y = 0; y < png.height; y += 5) {
    for (let x = 0; x < png.width; x += 5) {
      const idx = (png.width * y + x) << 2;
      totalBrightness += (png.data[idx] + png.data[idx+1] + png.data[idx+2]) / 3;
      pixelCount++;
    }
  }
  const avgBrightness = Math.round(totalBrightness / pixelCount);
  console.log('Average brightness: ' + avgBrightness + ' (' + (avgBrightness > 150 ? 'bright' : avgBrightness > 80 ? 'medium' : 'dark') + ')');
  console.log('');
});
