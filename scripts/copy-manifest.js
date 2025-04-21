import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distPath = path.resolve(__dirname, '../dist');
const manifestPath = path.resolve(__dirname, '../public/manifest.json');
const iconsDir = path.resolve(__dirname, '../public/icons');

// 确保 dist 目录存在
if (!fs.existsSync(distPath)) {
  fs.mkdirSync(distPath, { recursive: true });
}

// 确保 dist/icons 目录存在
const distIconsDir = path.join(distPath, 'icons');
if (!fs.existsSync(distIconsDir)) {
  fs.mkdirSync(distIconsDir, { recursive: true });
}

// 复制 manifest.json 到 dist 目录
fs.copyFileSync(manifestPath, path.join(distPath, 'manifest.json'));

// 复制图标文件
const iconFiles = ['icon16.png', 'icon48.png', 'icon128.png'];
for (const file of iconFiles) {
  const sourcePath = path.join(iconsDir, file);
  const destPath = path.join(distIconsDir, file);
  if (fs.existsSync(sourcePath)) {
    fs.copyFileSync(sourcePath, destPath);
    console.log(`Copied ${file} to dist/icons`);
  }
}

console.log('Manifest and icons copied successfully!'); 