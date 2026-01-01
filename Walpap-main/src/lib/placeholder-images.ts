
import data from './placeholder-images.json';
import fs from 'fs';
import path from 'path';

export type Wallpaper = {
  id: string;
  imageUrl: string;
  device: 'desktop' | 'phone';
  category: 'nature' | 'car' | 'warrior' | 'space' | 'anime' | 'other' | 'games';
  width: number;
  height: number;
};

const filePath = path.join(process.cwd(), 'src/lib/placeholder-images.json');

function readWallpapers(): Wallpaper[] {
  try {
    const jsonData = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(jsonData);
    return data.placeholderImages || [];
  } catch (error) {
    console.error("Error reading wallpapers file:", error);
    return [];
  }
}

function writeWallpapers(wallpapers: Wallpaper[]): void {
  try {
    const data = { placeholderImages: wallpapers };
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error("Error writing wallpapers file:", error);
  }
}

export function getAllWallpapers(): Wallpaper[] {
  return readWallpapers();
}

export function addWallpaper(wallpaper: Omit<Wallpaper, 'id'>): Wallpaper {
    const wallpapers = readWallpapers();
    const newId = (Math.max(...wallpapers.map(w => parseInt(w.id, 10)), 0) + 1).toString();
    const newWallpaper: Wallpaper = { ...wallpaper, id: newId };
    
    wallpapers.push(newWallpaper);
    writeWallpapers(wallpapers);
    return newWallpaper;
}

export function addWallpapers(newWallpapersData: Omit<Wallpaper, 'id'>[]): Wallpaper[] {
    const wallpapers = readWallpapers();
    let maxId = Math.max(...wallpapers.map(w => parseInt(w.id, 10)), 0);

    const newWallpapers = newWallpapersData.map((wallpaperData) => {
        maxId++;
        return { ...wallpaperData, id: maxId.toString() };
    });

    const updatedWallpapers = [...wallpapers, ...newWallpapers];
    writeWallpapers(updatedWallpapers);
    return newWallpapers;
}


export function deleteWallpaper(id: string): boolean {
    let wallpapers = readWallpapers();
    const initialLength = wallpapers.length;
    wallpapers = wallpapers.filter(w => w.id !== id);
    if (wallpapers.length < initialLength) {
        writeWallpapers(wallpapers);
        return true;
    }
    return false;
}
