const fs = require('fs');
const path = require('path');

// Tạo thư mục public nếu chưa có
const publicDir = path.join(__dirname, '..', 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Copy demo-img
const demoImgSource = path.join(__dirname, '..', 'demo-img');
const demoImgDest = path.join(publicDir, 'demo-img');
if (fs.existsSync(demoImgSource) && !fs.existsSync(demoImgDest)) {
  fs.mkdirSync(demoImgDest, { recursive: true });
  const files = fs.readdirSync(demoImgSource);
  files.forEach(file => {
    if (file.endsWith('.jpg') || file.endsWith('.jpeg') || file.endsWith('.png')) {
      fs.copyFileSync(
        path.join(demoImgSource, file),
        path.join(demoImgDest, file)
      );
      console.log(`Copied ${file} to public/demo-img/`);
    }
  });
}

// Copy background images
const folders = [
  'Chii-Chobits',
  'conan',
  'Evernight',
  'March 7th',
  'Nefer',
  'Yumemizuki Mizuki'
];

folders.forEach(folder => {
  const sourceFolder = path.join(__dirname, '..', folder);
  const destFolder = path.join(publicDir, folder);
  
  if (fs.existsSync(sourceFolder)) {
    if (!fs.existsSync(destFolder)) {
      fs.mkdirSync(destFolder, { recursive: true });
    }
    
    const bgSource = path.join(sourceFolder, 'bg.jpg');
    const bgDest = path.join(destFolder, 'bg.jpg');
    
    if (fs.existsSync(bgSource)) {
      fs.copyFileSync(bgSource, bgDest);
      console.log(`Copied bg.jpg for ${folder}`);
    }
  }
});

console.log('Image setup completed!');

