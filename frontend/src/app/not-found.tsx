"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Scissors, Home, ArrowLeft } from "lucide-react";
import { Navbar, Footer } from "@/components/layout";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4 py-16 sm:py-20 lg:py-28">
        <div className="w-full max-w-2xl text-center space-y-8 sm:space-y-12">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="flex h-24 w-24 sm:h-32 sm:w-32 items-center justify-center bg-foreground rounded-full">
              <Scissors
                className="h-12 w-12 sm:h-16 sm:w-16 text-background"
                strokeWidth={2.5}
              />
            </div>
          </div>

          {/* Large 404 Number */}
          <div>
            <h1 className="text-7xl sm:text-8xl md:text-9xl font-black text-brand-accent mb-4">
              404
            </h1>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-foreground mb-4">
              PAGE NOT FOUND
            </h2>
            <p className="text-base sm:text-lg text-foreground max-w-xl mx-auto">
              The page you&apos;re looking for doesn&apos;t exist or has been
              moved.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 pt-4">
            <Link href="/" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="text-sm sm:text-base px-8 sm:px-10 py-5 sm:py-6 font-bold uppercase tracking-wide w-full sm:w-auto"
              >
                <Home className="h-4 w-4 sm:h-5 sm:w-5" />
                Go Home
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="text-sm sm:text-base px-8 sm:px-10 py-5 sm:py-6 font-bold uppercase tracking-wide border-2 w-full sm:w-auto"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
              Go Back
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
