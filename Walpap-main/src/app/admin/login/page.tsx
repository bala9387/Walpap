
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { LogIn, ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [error, setError] = useState("");

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  useEffect(() => {
    // If user is already logged in, redirect them away from login page
    if (typeof window !== 'undefined' && localStorage.getItem("walpap_admin_auth") === "true") {
      router.replace('/admin/upload');
    }
  }, [router]);

  function onSubmit(data: z.infer<typeof loginSchema>) {
    setError(""); // Clear previous errors

    if ((data.username === "balascraper" && data.password === "9750797521KV?") ||
      (data.username === "admin" && data.password === "admin")) {
      localStorage.setItem("walpap_admin_auth", "true");
      toast({
        title: "Login Successful",
        description: "Redirecting to dashboard...",
      });
      // Use router.push and then router.refresh to ensure re-render
      router.push("/admin/upload");
    } else {
      setError("Invalid username or password");
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: "Invalid username or password.",
      });
      // Don't reset form so they can correct it
    }
  }

  // No need for isClient state, handled by useEffect
  return (
    <div className="relative flex items-center justify-center min-h-screen bg-background p-4">
      <Button asChild variant="outline" className="absolute top-4 left-4">
        <Link href="/">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>
      </Button>
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-primary">Admin Access</CardTitle>
          <CardDescription>Enter your credentials to manage Walpap.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {error && (
                <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md border border-destructive/20">
                  {error}
                </div>
              )}
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="admin" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                <LogIn className="mr-2 h-4 w-4" />
                Login
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
