const fs = require('fs');
const path = require('path');

const srcDir = 'C:\\Users\\user\\Downloads\\devorbittech-main (2)\\devorbittech-main\\images';
const destDir = path.join(__dirname, 'images');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

const filesToCopy = [
  'medireport-ai-preview.png',
  'devorbittech-platform-preview.png',
  'blissfulblinds-preview.png',
  'portfolio-banner-preview.png',
  'devsync-ai-preview.png',
  'ofm-preview.png'
];

filesToCopy.forEach(file => {
  const src = path.join(srcDir, file);
  const dest = path.join(destDir, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`Successfully copied ${file} to portfolio/images/`);
  } else {
    console.warn(`Source image not found: ${src}`);
  }
});
