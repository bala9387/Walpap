
"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Skeleton } from "../ui/skeleton";
import LoginPage from "@/app/admin/login/page";

function LoadingScreen() {
    return (
        <div className="flex items-center justify-center h-screen">
            <div className="flex flex-col items-center gap-4">
                <p className="text-2xl font-bold text-primary">Walpap</p>
                <Skeleton className="h-4 w-48" />
            </div>
        </div>
    )
}

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

    useEffect(() => {
        try {
            const authStatus = localStorage.getItem("walpap_admin_auth") === "true";
            setIsAuthenticated(authStatus);

            if (authStatus && pathname === '/admin/login') {
                router.replace('/admin/upload');
            } else if (!authStatus && pathname !== '/admin/login') {
                // This scenario is handled by returning the LoginPage below,
                // but good to have the logic clear.
            }

        } catch (error) {
            setIsAuthenticated(false);
        }
    }, [pathname, router]); 

    if (isAuthenticated === null) {
        return <LoadingScreen />;
    }

    if (!isAuthenticated) {
        // If not authenticated and not on login page, render login page
        if (pathname !== "/admin/login") {
            return <LoginPage />;
        }
        // If on login page, let it render
        return <LoginPage />;
    }
    
    // If authenticated and tries to access login, it will be redirected by useEffect.
    // While redirecting, show a loading screen to prevent flashing content.
    if(pathname === '/admin/login') {
        return <LoadingScreen />;
    }

    return <>{children}</>;
}
