const { execFileSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const htmlPath = path.resolve(__dirname, 'resume_source.html');
const pdfPath = path.resolve(__dirname, 'Ahmed_Aqeel_Resume.pdf');

console.log('Compiling Resume HTML to PDF...');

try {
  execFileSync(chromePath, [
    '--headless=new',
    '--disable-gpu',
    '--no-pdf-header-footer',
    `--print-to-pdf=${pdfPath}`,
    `file:///${htmlPath.replace(/\\/g, '/')}`
  ]);

  if (fs.existsSync(pdfPath)) {
    const stats = fs.statSync(pdfPath);
    console.log(`Generated: ${pdfPath} (${stats.size} bytes)`);

    const pdfBuffer = fs.readFileSync(pdfPath);
    const pdfText = pdfBuffer.toString('binary');
    const pageMatches = pdfText.match(/\/Type\s*\/Page\b/g);
    const pageCount = pageMatches ? pageMatches.length : 'unknown';
    console.log(`Page count: ${pageCount}`);
  } else {
    console.error('PDF file was not created!');
  }
} catch (e) {
  console.error('Error generating PDF:', e);
}
