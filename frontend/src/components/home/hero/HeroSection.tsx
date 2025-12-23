"use client";

import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/authStore";
import { Calendar, Scissors } from "lucide-react";

export function HeroSection() {
  const { user } = useAuthStore();
  const isAuthenticated = !!user;
  const isBarber = user?.role === "barber";

  const handleBookingClick = () => {
    if (!isAuthenticated) {
      window.location.href = "/register";
    } else if (isBarber) {
      window.location.href = "/barber";
    } else {
      window.location.href = "/appointments";
    }
  };

  const handleBrowseServices = () => {
    const servicesSection = document.getElementById("services");
    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative overflow-hidden min-h-[85vh] sm:min-h-[90vh] flex items-center">
      {/* Background Image */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url(/images/barber-hero.webp)",
          backgroundColor: "oklch(var(--foreground))",
        }}
      />
      <div className="absolute inset-0 z-[1] bg-foreground/60" />

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-20 sm:py-24">
        <div className="max-w-3xl space-y-8 sm:space-y-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-background/10 backdrop-blur-sm rounded-full border border-background/20">
            <Scissors className="h-4 w-4 text-background" />
            <span className="text-sm font-semibold text-background uppercase tracking-wide">
              Premium Barber Shop Service
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-background leading-[1.1] tracking-tight">
            Professional Barber
            <br />
            <span className="text-brand-accent">Barber Shop</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl md:text-2xl text-background/90 font-medium max-w-2xl leading-relaxed">
            Book your appointment online. Visit our barber shop for a premium
            grooming experience.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button
              size="lg"
              onClick={handleBookingClick}
              className="group text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 h-auto min-h-[2.75rem] sm:min-h-[3rem] font-semibold uppercase tracking-wide bg-background text-foreground hover:bg-background/90 transition-all active:scale-[0.98]"
            >
              <Calendar className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
              {isBarber ? "Manage Appointments" : "Book Appointment"}
            </Button>
            <Button
              size="lg"
              onClick={handleBrowseServices}
              variant="outline"
              className="text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 h-auto min-h-[2.75rem] sm:min-h-[3rem] font-semibold uppercase tracking-wide border-2 border-background text-background bg-transparent hover:bg-background/10 backdrop-blur-sm transition-all active:scale-[0.98]"
            >
              View Services
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center gap-6 sm:gap-8 pt-8 text-background/80">
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-background" />
              <span className="text-sm font-medium">
                Licensed Professionals
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-background" />
              <span className="text-sm font-medium">99% Satisfaction</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-background" />
              <span className="text-sm font-medium">10+ Years Experience</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
