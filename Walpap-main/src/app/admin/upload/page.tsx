
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { UploadCloud, X } from "lucide-react";
import { useRouter } from "next/navigation";

const wallpaperSchema = z.object({
  device: z.enum(["desktop", "phone"], {
    required_error: "You need to select a device type.",
  }),
  category: z.enum(["nature", "car", "warrior", "space", "anime", "other"], {
    required_error: "Please select a category.",
  }),
  imageFiles: z
    .instanceof(FileList)
    .refine((files) => files.length > 0, "At least one image is required."),
});

const categories: z.infer<typeof wallpaperSchema>['category'][] = ["nature", "car", "warrior", "space", "anime", "other"];

export default function UploadPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [previews, setPreviews] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<z.infer<typeof wallpaperSchema>>({
    resolver: zodResolver(wallpaperSchema),
  });

  const imageFiles = form.watch("imageFiles");

  useEffect(() => {
    if (imageFiles && imageFiles.length > 0) {
      const newPreviews: string[] = [];
      const fileReaders: FileReader[] = [];

      Array.from(imageFiles).forEach(file => {
        const reader = new FileReader();
        fileReaders.push(reader);
        reader.onloadend = () => {
          newPreviews.push(reader.result as string);
          if (newPreviews.length === imageFiles.length) {
            setPreviews(newPreviews);
          }
        };
        reader.readAsDataURL(file);
      });
      
      return () => {
        fileReaders.forEach(reader => {
          if (reader.readyState === 1) {
            reader.abort();
          }
        });
      };
    } else {
      setPreviews([]);
    }
  }, [imageFiles]);

  const handleRemovePreview = (indexToRemove: number) => {
    const currentFiles = Array.from(imageFiles || []);
    const newFiles = currentFiles.filter((_, index) => index !== indexToRemove);
    
    // Since FileList is immutable, we create a new DataTransfer object
    // to build a new FileList.
    const dataTransfer = new DataTransfer();
    newFiles.forEach(file => dataTransfer.items.add(file));
    
    form.setValue("imageFiles", dataTransfer.files, { shouldValidate: true });
  };


  async function onSubmit(data: z.infer<typeof wallpaperSchema>) {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('device', data.device);
      formData.append('category', data.category);
      Array.from(data.imageFiles).forEach(file => {
        formData.append('imageFiles', file);
      })

      const response = await fetch('/api/wallpapers', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to upload wallpapers");
      }

      const result = await response.json();
      const uploadCount = result.newWallpapers?.length || 0;

      toast({
        title: "Upload Successful",
        description: `${uploadCount} wallpaper(s) have been added. Redirecting...`,
      });

      // Redirect to the manage page for the uploaded category
      router.push(`/admin/manage/${data.device}/${data.category}`);
      
    } catch (error: any) {
       toast({
        variant: "destructive",
        title: "Upload Failed",
        description: error.message || "An unexpected error occurred.",
      });
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Upload Wallpapers</h1>
      <Card>
        <CardHeader>
          <CardTitle>New Wallpaper Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-8">
                  <FormField
                    control={form.control}
                    name="device"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Device Type</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex space-x-4"
                          >
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="desktop" />
                              </FormControl>
                              <FormLabel className="font-normal">Desktop</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="phone" />
                              </FormControl>
                              <FormLabel className="font-normal">Phone</FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.map(cat => (
                                <SelectItem key={cat} value={cat} className="capitalize">{cat}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Choose the category for the wallpaper.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="space-y-2">
                   <FormField
                    control={form.control}
                    name="imageFiles"
                    render={({ field: { onChange, value, ...rest } }) => (
                      <FormItem>
                        <FormLabel>Image Files</FormLabel>
                        <FormDescription>
                          Select one or more image files from your computer.
                        </FormDescription>
                        <FormControl>
                          <Input 
                            type="file" 
                            accept="image/png, image/jpeg, image/jpg"
                            multiple
                            onChange={(e) => onChange(e.target.files)}
                            {...rest}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {previews.length > 0 && (
                    <div className="relative border-2 border-dashed rounded-lg p-4 mt-4">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {previews.map((src, index) => (
                           <div key={index} className="relative group aspect-video">
                            <Image
                              src={src}
                              alt={`Preview ${index + 1}`}
                              fill
                              className="w-full h-auto object-contain rounded-md"
                            />
                             <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => handleRemovePreview(index)}
                            >
                              <X className="h-4 w-4" />
                              <span className="sr-only">Remove image</span>
                            </Button>
                           </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <Button type="submit" size="lg" disabled={isUploading}>
                <UploadCloud className="mr-2 h-5 w-5"/>
                {isUploading ? `Uploading ${imageFiles?.length || ''} image(s)...` : `Add ${imageFiles?.length || ''} Wallpaper(s)`}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
