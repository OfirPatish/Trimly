"use client";

import { Navbar, Footer } from "@/components/layout";
import { AuthGuard } from "@/components/layout/AuthGuard";
import {
  HeroSection,
  ContactInfoBar,
  AboutSection,
  ServicesSection,
  WhyChooseUsSection,
  MapSection,
} from "@/components/home";

export default function MainPage() {
  return (
    <AuthGuard requireAuth={false}>
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-1">
          <HeroSection />
          <ContactInfoBar />
          <AboutSection />
          <ServicesSection />
          <WhyChooseUsSection />
          <MapSection />
        </main>
        <Footer />
      </div>
    </AuthGuard>
  );
}
