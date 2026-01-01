
"use client";

import type { Wallpaper } from "@/lib/placeholder-images";
import { ManageWallpaperCard } from "./manage-wallpaper-card";
import { cn } from "@/lib/utils";

type ManageWallpaperGridProps = {
  wallpapers: Wallpaper[];
  onDelete: (id: string) => void;
};

export function ManageWallpaperGrid({ wallpapers, onDelete }: ManageWallpaperGridProps) {
  if (!wallpapers || wallpapers.length === 0) {
    return <p className="text-muted-foreground text-center py-8">No wallpapers in this section.</p>;
  }

  const isDesktop = wallpapers[0]?.device === 'desktop';

  return (
      <div className={cn(
        "grid gap-4 md:gap-6",
        isDesktop 
          ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
          : "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
      )}>
        {wallpapers.map((wallpaper) => (
          <ManageWallpaperCard
            key={wallpaper.id}
            wallpaper={wallpaper}
            onDelete={onDelete}
          />
        ))}
      </div>
  );
}
