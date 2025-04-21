import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sizes = [16, 48, 128];
const inputPath = path.resolve(__dirname, '../public/icons/icon.svg');
const outputDir = path.resolve(__dirname, '../public/icons');

async function generateIcons() {
  for (const size of sizes) {
    await sharp(inputPath)
      .resize(size, size)
      .png()
      .toFile(path.join(outputDir, `icon${size}.png`));
    console.log(`Generated ${size}x${size} icon`);
  }
}

generateIcons().catch(console.error); 