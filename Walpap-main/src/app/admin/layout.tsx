
"use client";

import { AdminHeader } from "@/components/admin/admin-header";
import ProtectedRoute from "@/components/admin/protected-route";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col">
        <AdminHeader />
        <main className="flex-1 container mx-auto py-8 px-4">{children}</main>
      </div>
    </ProtectedRoute>
  );
}
