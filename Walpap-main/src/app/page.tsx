
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getAllWallpapers, type Wallpaper } from "@/lib/placeholder-images"
import { CategoryCard } from "@/components/category-card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

const desktopCategories: Wallpaper['category'][] = ["nature", "car", "warrior", "space", "anime", "other", "games"];
const phoneCategories: Wallpaper['category'][] = ["nature", "car", "warrior", "space", "anime", "other"];

export default async function Home() {
  const wallpapers = getAllWallpapers();

  return (
    <>
      <div id="categories" className="container mx-auto px-4 py-16">
        <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-12 duration-500">
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-4">
            Explore Wallpapers
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
            Browse our collection of high-quality wallpapers for desktop and mobile devices.
          </p>
        </div>
        <Tabs defaultValue="desktop" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto bg-card border">
            <TabsTrigger value="desktop">Desktop</TabsTrigger>
            <TabsTrigger value="phone">Phone</TabsTrigger>
          </TabsList>

          <TabsContent value="desktop" className="mt-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {desktopCategories.map(category => (
                <CategoryCard key={`desktop-${category}`} device="desktop" category={category} wallpapers={wallpapers} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="phone" className="mt-8">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              {phoneCategories.map(category => (
                <CategoryCard key={`phone-${category}`} device="phone" category={category} wallpapers={wallpapers} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
