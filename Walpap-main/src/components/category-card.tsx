
"use client";

import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import type { Wallpaper } from "@/lib/placeholder-images";
import { Car, Leaf, Rocket, Shield, Wand, MoreHorizontal, Gamepad2 } from 'lucide-react';
import { cn } from "@/lib/utils";

type CategoryCardProps = {
  category: Wallpaper['category'];
  device: Wallpaper['device'];
  wallpapers: Wallpaper[];
};

const categoryDetails: Record<Wallpaper['category'], { icon: React.ElementType; hint: string }> = {
  nature: { icon: Leaf, hint: 'nature forest' },
  car: { icon: Car, hint: 'car sportscar' },
  warrior: { icon: Shield, hint: 'warrior knight' },
  space: { icon: Rocket, hint: 'space nebula' },
  anime: { icon: Wand, hint: 'anime fantasy' },
  other: { icon: MoreHorizontal, hint: 'abstract geometric' },
  games: { icon: Gamepad2, hint: 'gaming videogames' },
};

export function CategoryCard({ category, device, wallpapers }: CategoryCardProps) {
  const details = categoryDetails[category];
  const Icon = details.icon;

  const sampleImage = wallpapers.find(img => img.category === category && img.device === device) || wallpapers.find(img => img.category === category);

  return (
    <Link href={`/wallpapers/${device}/${category}`} className="group block">
      <Card className="overflow-hidden transition-all duration-300 ease-in-out group-hover:shadow-xl group-hover:shadow-primary/20 group-hover:-translate-y-1">
        <CardContent className="p-0 relative">
          {sampleImage ? (
            <Image
              src={sampleImage.imageUrl}
              alt={`${category} category`}
              width={sampleImage.device === 'desktop' ? 800 : 540}
              height={sampleImage.device === 'desktop' ? 450 : 960}
              className={cn("object-cover transition-transform duration-300 group-hover:scale-105",
                device === 'desktop' ? 'aspect-video' : 'aspect-[9/16]'
              )}
            />
          ) : (
            <div className={cn("bg-muted flex items-center justify-center", device === 'desktop' ? 'aspect-video' : 'aspect-[9/16]')}>
              <Icon className="w-16 h-16 text-muted-foreground" />
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          <div className="absolute bottom-0 left-0 p-4 md:p-6 text-white">
            <Icon className="w-8 h-8 mb-2" />
            <h3 className="text-2xl font-bold capitalize">{category}</h3>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
