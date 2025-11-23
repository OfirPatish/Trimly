"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertCircle, Home, RefreshCw } from "lucide-react";
import { Navbar, Footer } from "@/components/layout";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to console in development
    if (process.env.NODE_ENV === "development") {
      console.error("Error:", error);
    }
  }, [error]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4 py-16 sm:py-20 lg:py-28">
        <div className="w-full max-w-2xl text-center space-y-8 sm:space-y-12">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="flex h-24 w-24 sm:h-32 sm:w-32 items-center justify-center bg-destructive rounded-full">
              <AlertCircle
                className="h-12 w-12 sm:h-16 sm:w-16 text-background"
                strokeWidth={2.5}
              />
            </div>
          </div>

          {/* Error Message */}
          <div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-foreground mb-4">
              SOMETHING WENT WRONG
            </h1>
            <p className="text-base sm:text-lg text-foreground max-w-xl mx-auto mb-4">
              {error.message ||
                "We're sorry, but something went wrong. Please try again."}
            </p>
            <p className="text-sm sm:text-base text-muted-foreground">
              An unexpected error occurred
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 pt-4">
            <Button
              size="lg"
              onClick={reset}
              className="text-sm sm:text-base px-8 sm:px-10 py-5 sm:py-6 font-bold uppercase tracking-wide w-full sm:w-auto"
            >
              <RefreshCw className="h-4 w-4 sm:h-5 sm:w-5" />
              Try Again
            </Button>
            <Link href="/" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="outline"
                className="text-sm sm:text-base px-8 sm:px-10 py-5 sm:py-6 font-bold uppercase tracking-wide border-2 w-full sm:w-auto"
              >
                <Home className="h-4 w-4 sm:h-5 sm:w-5" />
                Go Home
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
