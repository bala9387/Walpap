
import { NextRequest, NextResponse } from 'next/server';
import { getAllWallpapers, addWallpapers, type Wallpaper } from '@/lib/placeholder-images';
import fs from 'fs/promises';
import path from 'path';

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        const wallpapers = getAllWallpapers();
        return NextResponse.json(wallpapers);
    } catch (error) {
        console.error("API GET Error:", error);
        return NextResponse.json({ message: "Failed to fetch wallpapers" }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const device = formData.get('device') as Wallpaper['device'] | null;
        const category = formData.get('category') as Wallpaper['category'] | null;
        const imageFiles = formData.getAll('imageFiles') as File[];
        
        if (!imageFiles || imageFiles.length === 0 || !device || !category) {
            return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
        }

        const newWallpapersData: Omit<Wallpaper, 'id'>[] = [];
        const wallpapersDir = path.join(process.cwd(), 'public', 'wallpapers');
        
        // Ensure the wallpapers directory exists
        await fs.mkdir(wallpapersDir, { recursive: true });

        for (const imageFile of imageFiles) {
            const buffer = Buffer.from(await imageFile.arrayBuffer());
            // Create a unique filename
            const filename = `${Date.now()}-${imageFile.name.replace(/\s+/g, '_')}`;
            const filepath = path.join(wallpapersDir, filename);

            // Save the file to the public/wallpapers directory
            await fs.writeFile(filepath, buffer);
            
            // The URL will be the public path
            const imageUrl = `/wallpapers/${filename}`;

            newWallpapersData.push({
                imageUrl,
                device,
                category,
                width: device === 'desktop' ? 1920 : 1080, // Default widths
                height: device === 'desktop' ? 1080 : 1920, // Default heights
            });
        }
        
        const newWallpapers = addWallpapers(newWallpapersData);

        return NextResponse.json({ message: `${newWallpapers.length} wallpapers added successfully`, newWallpapers }, { status: 201 });
    } catch (error) {
        console.error("API POST Error:", error);
        return NextResponse.json({ message: "Failed to add wallpaper(s)", error: (error as Error).message }, { status: 500 });
    }
}
