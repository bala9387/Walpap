
"use client";

import Image from "next/image";
import { Download } from "lucide-react";
import type { Wallpaper } from "@/lib/placeholder-images";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type WallpaperPreviewDialogProps = {
  wallpaper: Wallpaper | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function WallpaperPreviewDialog({ wallpaper, open, onOpenChange }: WallpaperPreviewDialogProps) {
  if (!wallpaper) return null;

  const handleDownload = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // This is a simple download trigger. For cross-origin images, it may open in a new tab.
    // A more robust solution might involve a server-side route to fetch and serve the image.
    e.currentTarget.href = wallpaper.imageUrl;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-none w-screen h-screen p-0 md:p-0 border-0 rounded-none bg-black/80 backdrop-blur-sm shadow-none flex flex-col items-center justify-center">
        <DialogTitle className="sr-only">{`Wallpaper preview: ${wallpaper.category}`}</DialogTitle>
        <div 
          className="relative flex-grow w-full h-full"
        >
          <Image
            src={wallpaper.imageUrl}
            alt={`Wallpaper for ${wallpaper.category}`}
            fill
            className="object-cover"
            sizes="100vw"
          />
        </div>
        <DialogFooter className="sm:justify-center p-4 bg-transparent absolute bottom-0 left-0 right-0">
          <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
            <a 
              href={wallpaper.imageUrl} 
              onClick={handleDownload} 
              download={`walpap-${wallpaper.id}.jpg`}
            >
              <Download className="mr-2 h-5 w-5" />
              Download
            </a>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
