const fs = require('fs');
const path = require('path');

const srcDir = `C:\\Users\\user\\.gemini\\antigravity-ide\\brain\\adb95136-552c-46b8-b8ca-6257e49a0e23`;
const destDir = path.join(__dirname, 'images');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

const imagesToCopy = [
  { srcName: 'service_web_dev_1784803827223.png', destName: 'service-1.png' },
  { srcName: 'service_mobile_app_1784803850864.png', destName: 'service-2.png' },
  { srcName: 'service_ai_automation_1784803871883.png', destName: 'service-3.png' },
  { srcName: 'service_python_automation_1784803894529.png', destName: 'service-4.png' },
  { srcName: 'service_frontend_ui_1784803917577.png', destName: 'service-5.png' },
  { srcName: 'service_backend_db_1784803940249.png', destName: 'service-6.png' },
];

imagesToCopy.forEach(({ srcName, destName }) => {
  const srcPath = path.join(srcDir, srcName);
  const destPath = path.join(destDir, destName);
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
    console.log(`Copied ${srcName} -> ${destName}`);
  } else {
    console.error(`Source file not found: ${srcPath}`);
  }
});
