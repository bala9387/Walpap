const fs = require('fs');
const path = require('path');

const uploadsDir = path.join(__dirname, '..');
const jsonFile = path.join(__dirname, '..', 'src', 'lib', 'placeholder-images.json');

function getImageFiles(dir) {
  const files = [];
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      files.push(...getImageFiles(fullPath));
    } else if (stat.isFile() && /\.(jpg|jpeg|png|gif|webp)$/i.test(item)) {
      files.push(fullPath);
    }
  }
  return files;
}

function parseCategoryAndDevice(folderName) {
  const parts = folderName.split('_');
  if (parts.length === 2) {
    const [category, device] = parts;
    return { category, device };
  }
  return null;
}

function populateImages() {
  const imageFiles = getImageFiles(uploadsDir);
  const wallpapers = [];

  for (const filePath of imageFiles) {
    const relativePath = path.relative(uploadsDir, filePath);
    const folderName = path.dirname(relativePath);
    const fileName = path.basename(filePath);
    const parsed = parseCategoryAndDevice(folderName);

    if (parsed) {
      const { category, device } = parsed;
      const imageBuffer = fs.readFileSync(filePath);
      const base64 = imageBuffer.toString('base64');
      const mimeType = path.extname(filePath).toLowerCase() === '.jpg' ? 'image/jpeg' : `image/${path.extname(filePath).slice(1)}`;
      const imageUrl = `data:${mimeType};base64,${base64}`;

      const wallpaper = {
        id: `${category}_${device}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        imageUrl,
        device,
        category,
        width: 1920, // placeholder, you can adjust or detect
        height: 1080 // placeholder
      };
      wallpapers.push(wallpaper);
    }
  }

  const data = { placeholderImages: wallpapers };
  fs.writeFileSync(jsonFile, JSON.stringify(data, null, 2));
  console.log(`Populated ${wallpapers.length} wallpapers.`);
}

populateImages();
