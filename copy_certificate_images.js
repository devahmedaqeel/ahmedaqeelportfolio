const fs = require('fs');
const path = require('path');

const brainDir = 'C:\\Users\\user\\.gemini\\antigravity-ide\\brain\\68c83e8c-011c-4977-9257-33c7907e256a';
const imagesDir = path.join(__dirname, 'images');
const certsDir = path.join(__dirname, 'certificates');

if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}
if (!fs.existsSync(certsDir)) {
  fs.mkdirSync(certsDir, { recursive: true });
}

// Copy generated images
const imageMap = {
  'coursera_meta_react_native_1786968941893.jpg': 'meta-react-native-cert.jpg',
  'codealpha_python_cert_1786968964399.jpg': 'codealpha-python-cert.jpg',
  'codealpha_lor_doc_1786968989229.jpg': 'codealpha-recommendation-letter.jpg'
};

Object.entries(imageMap).forEach(([srcFile, destFile]) => {
  const src = path.join(brainDir, srcFile);
  const dest = path.join(imagesDir, destFile);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`Copied image: ${srcFile} -> images/${destFile}`);
  } else {
    console.warn(`Source not found: ${src}`);
  }
});

// Copy user uploaded original PDFs
const userUploadDir = path.join(brainDir, '.user_uploaded');
const pdfMap = {
  'media_1786968155831.pdf': 'codealpha-python-internship-certificate.pdf',
  'media_1786968179650.pdf': 'codealpha-letter-of-recommendation.pdf'
};

Object.entries(pdfMap).forEach(([srcFile, destFile]) => {
  const src = path.join(userUploadDir, srcFile);
  const dest = path.join(certsDir, destFile);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`Copied PDF: ${srcFile} -> certificates/${destFile}`);
  } else {
    console.warn(`PDF source not found: ${src}`);
  }
});
