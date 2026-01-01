
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function AdminHeader() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("walpap_admin_auth");
    router.replace("/admin/login");
  };

  const navItems = [
    { href: "/admin/upload", label: "Upload" },
    { href: "/admin/manage", label: "Manage" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-card">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <div className="flex gap-6 md:gap-10">
          <Link href="/admin/upload" className="flex items-center space-x-2">
            <span className="inline-block font-bold text-primary">Walpap Admin</span>
          </Link>
          <nav className="hidden gap-6 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center text-lg font-medium transition-colors hover:text-foreground/80 sm:text-sm",
                  pathname === item.href ? "text-foreground" : "text-foreground/60"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
             <Button asChild variant="outline" size="sm">
                <Link href="/">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Site
                </Link>
             </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-foreground/60 hover:text-foreground/80"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
