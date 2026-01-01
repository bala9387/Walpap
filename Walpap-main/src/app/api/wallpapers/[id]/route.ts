
import { NextRequest, NextResponse } from 'next/server';
import { deleteWallpaper } from '@/lib/placeholder-images';

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const id = params.id;
        if (!id) {
            return NextResponse.json({ message: 'Wallpaper ID is required' }, { status: 400 });
        }

        const success = deleteWallpaper(id);

        if (success) {
            return NextResponse.json({ message: `Wallpaper with id ${id} deleted successfully.` }, { status: 200 });
        } else {
            return NextResponse.json({ message: `Wallpaper with id ${id} not found.` }, { status: 404 });
        }
    } catch (error: any) {
        console.error(`API DELETE Error for id ${params.id}:`, error);
        return NextResponse.json({ message: "Failed to delete wallpaper", error: error.message }, { status: 500 });
    }
}
