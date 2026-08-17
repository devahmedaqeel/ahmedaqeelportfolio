const fs = require('fs');
const path = require('path');

const mappings = [
  { src: "C:\\Users\\user\\.gemini\\antigravity-ide\\brain\\19d6ae22-1420-4a35-bbef-77e05cb09a01\\service_web_dev_new_1784890102667.png", dest: "images/service-1.png" },
  { src: "C:\\Users\\user\\.gemini\\antigravity-ide\\brain\\19d6ae22-1420-4a35-bbef-77e05cb09a01\\service_mobile_app_new_1784890117040.png", dest: "images/service-2.png" },
  { src: "C:\\Users\\user\\.gemini\\antigravity-ide\\brain\\19d6ae22-1420-4a35-bbef-77e05cb09a01\\service_ai_automation_new_1784890133379.png", dest: "images/service-3.png" },
  { src: "C:\\Users\\user\\.gemini\\antigravity-ide\\brain\\19d6ae22-1420-4a35-bbef-77e05cb09a01\\service_python_automation_new_1784890148883.png", dest: "images/service-4.png" },
  { src: "C:\\Users\\user\\.gemini\\antigravity-ide\\brain\\19d6ae22-1420-4a35-bbef-77e05cb09a01\\service_frontend_ui_new_1784890165253.png", dest: "images/service-5.png" },
  { src: "C:\\Users\\user\\.gemini\\antigravity-ide\\brain\\19d6ae22-1420-4a35-bbef-77e05cb09a01\\service_backend_db_new_1784890179631.png", dest: "images/service-6.png" },
];

mappings.forEach(m => {
  if (fs.existsSync(m.src)) {
    fs.copyFileSync(m.src, m.dest);
    console.log(`Copied ${m.src} -> ${m.dest}`);
  } else {
    console.error(`Source not found: ${m.src}`);
  }
});
