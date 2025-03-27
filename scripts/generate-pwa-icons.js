import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const sizes = [192, 512];
const color = '#4CAF50'; // A nice green color for a budget app

async function generateIcon(size) {
  const svg = `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="${color}"/>
      <text x="50%" y="50%" font-family="Arial" font-size="${size/3}" fill="white" text-anchor="middle" dy=".3em">$</text>
    </svg>
  `;

  const outputPath = join(__dirname, '..', 'public', `pwa-${size}x${size}.png`);
  await sharp(Buffer.from(svg))
    .png()
    .toFile(outputPath);
  
  console.log(`Generated: ${outputPath}`);
}

async function main() {
  // Create public directory if it doesn't exist
  const publicDir = join(__dirname, '..', 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir);
  }

  // Generate icons for all sizes
  for (const size of sizes) {
    await generateIcon(size);
  }
}

main().catch(console.error);
