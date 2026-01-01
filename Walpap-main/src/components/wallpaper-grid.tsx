"use client";

import { useState } from "react";
import type { Wallpaper } from "@/lib/placeholder-images";
import { WallpaperCard } from "./wallpaper-card";
import { WallpaperPreviewDialog } from "./wallpaper-preview-dialog";
import { cn } from "@/lib/utils";

type WallpaperGridProps = {
  wallpapers: Wallpaper[];
};

export function WallpaperGrid({ wallpapers }: WallpaperGridProps) {
  const [selectedWallpaper, setSelectedWallpaper] = useState<Wallpaper | null>(null);
  
  if (!wallpapers || wallpapers.length === 0) {
    return <p>No wallpapers in this category.</p>;
  }

  const isDesktop = wallpapers[0]?.device === 'desktop';

  return (
    <>
      <div className={cn(
        "grid gap-4 md:gap-6",
        isDesktop 
          ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
          : "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
      )}>
        {wallpapers.map((wallpaper, index) => (
          <WallpaperCard
            key={wallpaper.id}
            wallpaper={wallpaper}
            onPreview={() => setSelectedWallpaper(wallpaper)}
          />
        ))}
      </div>
      <WallpaperPreviewDialog
        wallpaper={selectedWallpaper}
        open={!!selectedWallpaper}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setSelectedWallpaper(null);
          }
        }}
      />
    </>
  );
}
