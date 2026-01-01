
"use client";

import { ManageWallpaperGrid } from "@/components/admin/manage-wallpaper-grid"
import { type Wallpaper } from "@/lib/placeholder-images"
import { notFound, useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const validCategories: Wallpaper['category'][] = ["nature", "car", "warrior", "space", "anime", "other"];
const validDevices: Wallpaper['device'][] = ["desktop", "phone"];

export default function ManageDeviceCategoryPage() {
  const params = useParams();
  const category = params.category as Wallpaper['category'];
  const device = params.device as Wallpaper['device'];
  
  const { toast } = useToast();
  const router = useRouter();
  const [wallpapers, setWallpapers] = useState<Wallpaper[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWallpapers() {
      if (!category || !device) return;
      try {
        setLoading(true);
        const res = await fetch('/api/wallpapers', { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to fetch');
        const allWallpapers: Wallpaper[] = await res.json();
        const filtered = allWallpapers.filter(w => w.device === device && w.category === category);
        setWallpapers(filtered);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not load wallpapers for this category.",
        });
      } finally {
        setLoading(false);
      }
    }
    fetchWallpapers();
  }, [category, device, toast]);


  if (!validCategories.includes(category) || !validDevices.includes(device)) {
    notFound();
  }

  const handleDelete = async (wallpaperId: string) => {
     try {
      const response = await fetch(`/api/wallpapers/${wallpaperId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete wallpaper");
      }

      setWallpapers((prevWallpapers) =>
        prevWallpapers.filter((w) => w.id !== wallpaperId)
      );

      toast({
        title: "Wallpaper Deleted",
        description: `The wallpaper has been permanently removed.`,
      });
      router.refresh();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Deletion Failed",
        description: error.message || "An unexpected error occurred.",
      });
    }
  };
  
  if (loading) {
    return <LoadingSkeleton device={device} />;
  }


  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Button asChild variant="outline">
          <Link href="/admin/manage">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Manage Home
          </Link>
        </Button>
      </div>

      <section className="py-8">
        <h1 className="text-4xl font-bold capitalize mb-6 border-l-4 border-accent pl-4">{category} Wallpapers ({device})</h1>
        {wallpapers.length > 0 ? (
          <ManageWallpaperGrid wallpapers={wallpapers} onDelete={handleDelete} />
        ) : (
          <p className="text-center text-muted-foreground py-12">No {device} wallpapers available for this category yet.</p>
        )}
      </section>
    </div>
  );
}

function LoadingSkeleton({ device }: { device: Wallpaper['device'] }) {
  const isDesktop = device === 'desktop';
  return (
     <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-10 w-48 mb-8" />
        <Skeleton className="h-12 w-1/2 mb-12" />
        <div className={`grid gap-4 md:gap-6 ${isDesktop ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"}`}>
          {[...Array(isDesktop ? 4 : 6)].map((_, i) => (
            <Skeleton key={i} className={isDesktop ? 'aspect-video w-full' : 'aspect-[9/16] w-full'} />
          ))}
        </div>
    </div>
  )
}
