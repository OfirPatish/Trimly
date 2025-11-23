"use client";

import Link from "next/link";
import { useAuthStore } from "@/stores/authStore";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Scissors, LogOut, Menu, Calendar } from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const { user, logout, loginLoading } = useAuthStore();
  const isBarber = user?.role === "barber";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Don't show logged-in state while login is in progress
  const showLoggedIn = user && !loginLoading;

  return (
    <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur-md shadow-sm supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto flex h-16 sm:h-18 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 text-lg sm:text-xl font-bold transition-colors text-foreground hover:text-brand-accent group"
        >
          <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg bg-foreground flex items-center justify-center group-hover:bg-brand-accent transition-colors">
            <Scissors className="h-4 w-4 sm:h-5 sm:w-5 text-background" />
          </div>
          <span className="hidden sm:inline">Trimly</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-3">
          {showLoggedIn ? (
            <>
              {isBarber ? (
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2 font-medium"
                  asChild
                >
                  <Link href="/barber">
                    <Calendar className="h-4 w-4" />
                    <span className="hidden lg:inline">{user.name}</span>
                    <span className="lg:hidden">Dashboard</span>
                  </Link>
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2 font-medium"
                  asChild
                >
                  <Link href="/appointments">
                    <Calendar className="h-4 w-4" />
                    <span className="hidden lg:inline">My Appointments</span>
                    <span className="lg:hidden">Appointments</span>
                  </Link>
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="gap-2 font-medium"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden lg:inline">Logout</span>
              </Button>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" className="font-medium" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
              <Button size="sm" className="font-medium" asChild>
                <Link href="/register">Get Started</Link>
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Menu - Using Shadcn Sheet */}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              aria-label="Toggle menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full sm:w-96">
            <SheetHeader>
              <SheetTitle className="text-left">Menu</SheetTitle>
              <SheetDescription className="sr-only">
                Navigation menu for accessing your account and appointments
              </SheetDescription>
            </SheetHeader>
            <div className="mt-8 space-y-2">
              {showLoggedIn ? (
                <>
                  {isBarber ? (
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-3 h-12 text-base font-medium"
                      size="lg"
                      asChild
                    >
                      <Link
                        href="/barber"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Calendar className="h-5 w-5" />
                        Dashboard
                      </Link>
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-3 h-12 text-base font-medium"
                      size="lg"
                      asChild
                    >
                      <Link
                        href="/appointments"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Calendar className="h-5 w-5" />
                        My Appointments
                      </Link>
                    </Button>
                  )}
                  <div className="pt-2 border-t">
                    <Button
                      variant="outline"
                      onClick={() => {
                        logout();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full justify-start gap-3 h-12 text-base font-medium"
                      size="lg"
                    >
                      <LogOut className="h-5 w-5" />
                      Logout
                    </Button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col gap-2">
                  <Button
                    variant="ghost"
                    className="w-full h-12 text-base font-medium"
                    size="lg"
                    asChild
                  >
                    <Link
                      href="/login"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                  </Button>
                  <Button
                    className="w-full h-12 text-base font-medium"
                    size="lg"
                    asChild
                  >
                    <Link
                      href="/register"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Get Started
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
