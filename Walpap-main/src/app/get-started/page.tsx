
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { getAllWallpapers } from "@/lib/placeholder-images"

export default async function GetStartedPage() {
    const wallpapers = getAllWallpapers();
    const wallpaperCount = wallpapers.length;

    const heroImage = wallpapers.find(w => w.device === 'desktop' && w.category === 'space') || wallpapers[0];

    return (
        <section className="relative flex-1 flex items-center justify-center text-center text-white px-4">
            {heroImage && (
            <Image
                src={heroImage.imageUrl}
                alt="Hero background"
                fill
                className="object-cover"
                priority
            />
            )}
            <div className="absolute inset-0 bg-black/50" />
            <div className="relative z-10 animate-in fade-in slide-in-from-bottom-12 duration-500">
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-4 text-primary">
                Walpap
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-8">
                Discover your next background from our collection of {wallpaperCount} high-quality wallpapers, curated for your desktop and mobile devices.
            </p>
            <Button asChild size="lg">
                <Link href="/">
                Explore Collection
                </Link>
            </Button>
            </div>
      </section>
    )
}
