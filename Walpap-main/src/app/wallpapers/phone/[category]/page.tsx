
import { WallpaperGrid } from "@/components/wallpaper-grid"
import { getAllWallpapers, type Wallpaper } from "@/lib/placeholder-images"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

const validCategories: Wallpaper['category'][] = ["nature", "car", "warrior", "space", "anime", "other"];

export default function PhoneCategoryPage({ params }: { params: { category: string } }) {
    const category = params.category as Wallpaper['category'];

    if (!validCategories.includes(category)) {
        notFound();
    }

    const allWallpapers = getAllWallpapers();
    const wallpapers = allWallpapers.filter(w => w.device === 'phone' && w.category === category);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <Button asChild variant="outline">
                    <Link href="/">
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        Back to Categories
                    </Link>
                </Button>
            </div>

            <section className="py-8">
                <h1 className="text-4xl font-bold capitalize mb-6 border-l-4 border-accent pl-4">{category} Wallpapers</h1>
                {wallpapers.length > 0 ? (
                    <WallpaperGrid wallpapers={wallpapers} />
                ) : (
                    <p className="text-center text-muted-foreground py-12">No phone wallpapers available for this category yet.</p>
                )}
            </section>
        </div>
    );
}
