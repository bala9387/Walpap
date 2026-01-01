
"use client";

import Image from "next/image";
import { Wallpaper } from "@/lib/placeholder-images";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type WallpaperCardProps = {
  wallpaper: Wallpaper;
  onPreview: () => void;
};

export function WallpaperCard({ wallpaper, onPreview }: WallpaperCardProps) {
  return (
    <div
      className="group relative animate-in fade-in cursor-pointer"
      onClick={onPreview}
    >
      <Card
        className="overflow-hidden transition-transform duration-300 group-hover:scale-105"
      >
        <CardContent className="p-0">
          <div
            className={cn(
              "relative w-full",
              wallpaper.device === 'desktop' ? 'aspect-video' : 'aspect-[9/16]'
            )}
          >
            <Image
              src={wallpaper.imageUrl}
              alt={`Wallpaper for ${wallpaper.category}`}
              fill
              className="object-cover transition-all duration-300"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          </div>
        </CardContent>
      </Card>
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
  );
}
