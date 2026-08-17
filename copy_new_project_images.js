const fs = require('fs');
const path = require('path');

const srcDir = 'C:\\Users\\user\\.gemini\\antigravity-ide\\brain\\27a9bad6-3f5b-4aaa-b36b-789d2f4e977c';
const destDir = path.join(__dirname, 'images');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

const map = {
  'blog_preview_1786963991687.jpg': 'engrahmedaqeel-blog-preview.jpg',
  'studentnotes_preview_1786964013421.jpg': 'studentnotesapp-preview.jpg',
  'blindmatch_preview_1786964037318.jpg': 'blindmatch-uk-preview.jpg',
  'restaurant_preview_1786964074976.jpg': 'restaurant-menu-preview.jpg',
  'brightmind_preview_1786964109145.jpg': 'bright-mind-preview.jpg',
  'automation_preview_1786964235546.jpg': 'python-automation-preview.jpg'
};

Object.entries(map).forEach(([srcFile, destFile]) => {
  const src = path.join(srcDir, srcFile);
  const dest = path.join(destDir, destFile);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`Copied ${srcFile} -> ${destFile}`);
  } else {
    console.error(`Source not found: ${src}`);
  }
});
