
"use client";

import { useState, useEffect } from "react";
import { type Wallpaper } from "@/lib/placeholder-images";
import { ManageWallpaperGrid } from "@/components/admin/manage-wallpaper-grid";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const categories: Wallpaper["category"][] = ["nature", "car", "warrior", "space", "anime", "other"];

export default function ManagePage() {
  const { toast } = useToast();
  const router = useRouter();
  const [wallpapers, setWallpapers] = useState<Wallpaper[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWallpapers() {
      try {
        setLoading(true);
        const res = await fetch('/api/wallpapers', { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setWallpapers(data);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not load wallpapers.",
        });
      } finally {
        setLoading(false);
      }
    }
    fetchWallpapers();
  }, [toast]);

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

  const getWallpapersForCategory = (category: Wallpaper['category'], device: Wallpaper['device']) => {
    return wallpapers.filter(w => w.category === category && w.device === device);
  };

  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 border-l-4 border-accent pl-4">Manage Wallpapers</h1>

      <Tabs defaultValue="desktop" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto bg-card border">
          <TabsTrigger value="desktop">Desktop</TabsTrigger>
          <TabsTrigger value="phone">Phone</TabsTrigger>
        </TabsList>

        <TabsContent value="desktop" className="mt-8">
          <Accordion type="single" collapsible className="w-full space-y-4">
            {categories.map((category) => (
              <AccordionItem value={`desktop-${category}`} key={`desktop-${category}`} className="border rounded-lg">
                <AccordionTrigger className="flex justify-between items-center p-4 hover:no-underline">
                  <h2 className="text-2xl font-bold capitalize">{category}</h2>
                  <Button asChild variant="outline" onClick={(e) => e.stopPropagation()}>
                      <Link href={`/admin/manage/desktop/${category}`}>View All</Link>
                  </Button>
                </AccordionTrigger>
                <AccordionContent className="p-4 pt-0">
                  <ManageWallpaperGrid
                    wallpapers={getWallpapersForCategory(category, 'desktop')}
                    onDelete={handleDelete}
                  />
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </TabsContent>

        <TabsContent value="phone" className="mt-8">
           <Accordion type="single" collapsible className="w-full space-y-4">
            {categories.map((category) => (
              <AccordionItem value={`phone-${category}`} key={`phone-${category}`} className="border rounded-lg">
                <AccordionTrigger className="flex justify-between items-center p-4 hover:no-underline">
                  <h2 className="text-2xl font-bold capitalize">{category}</h2>
                  <Button asChild variant="outline" onClick={(e) => e.stopPropagation()}>
                      <Link href={`/admin/manage/phone/${category}`}>View All</Link>
                  </Button>
                </AccordionTrigger>
                <AccordionContent className="p-4 pt-0">
                  <ManageWallpaperGrid
                    wallpapers={getWallpapersForCategory(category, 'phone')}
                    onDelete={handleDelete}
                  />
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </TabsContent>
      </Tabs>
    </div>
  );
}


function LoadingSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Skeleton className="h-12 w-1/2 mb-8" />
      <div className="max-w-md mx-auto mb-8">
          <Skeleton className="h-10 w-full" />
      </div>
      <div className="space-y-4">
        {categories.map(cat => (
          <Skeleton key={cat} className="h-20 w-full" />
        ))}
      </div>
    </div>
  )
}
