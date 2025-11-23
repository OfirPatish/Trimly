"use client";

import { useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { Spinner } from "@/components/ui/spinner";

interface AuthGuardProps {
  children: ReactNode;
  requireAuth?: boolean;
  requireRole?: "barber" | "customer";
  redirectTo?: string;
}

export function AuthGuard({
  children,
  requireAuth = true,
  requireRole,
  redirectTo,
}: AuthGuardProps) {
  const { user, loading: authLoading } = useAuthStore();
  const isAuthenticated = !!user;
  const router = useRouter();

  useEffect(() => {
    if (authLoading) return;

    if (requireAuth && !isAuthenticated) {
      router.push(redirectTo || "/login");
      return;
    }

    // Check role requirement
    if (requireRole && isAuthenticated && user?.role !== requireRole) {
      // Redirect to home page if role doesn't match
      router.push(redirectTo || "/");
      return;
    }
  }, [
    isAuthenticated,
    authLoading,
    requireAuth,
    requireRole,
    redirectTo,
    router,
    user?.role,
  ]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <Spinner className="size-8" />
        <p className="mt-4 text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (requireAuth && !isAuthenticated) {
    return null;
  }

  // Don't render if role requirement is not met
  if (requireRole && user?.role !== requireRole) {
    return null;
  }

  return <>{children}</>;
}
