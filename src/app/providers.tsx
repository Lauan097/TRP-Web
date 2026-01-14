"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "@/components/ui/sonner";
import { ToastProvider } from "@/app/components/ToastContext";
import AuthGuard from "@/app/components/AuthGuard";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AuthGuard>
        <ToastProvider>
          {children}
          <Toaster />
        </ToastProvider>
      </AuthGuard>
    </SessionProvider>
  );
}
