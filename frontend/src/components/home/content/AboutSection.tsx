"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

const stats = [
  {
    value: "99%",
    label: "Customer Satisfaction",
  },
  {
    value: "10+",
    label: "Years Experience",
  },
  {
    value: "500+",
    label: "Happy Clients",
  },
];

export function AboutSection() {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <div className="space-y-6 sm:space-y-8 order-2 lg:order-1">
            <div className="space-y-4">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tight text-foreground">
                Professional Barber
                <br />
                <span className="text-brand-accent">Barber Shop</span>
              </h2>
            </div>

            <p className="text-base sm:text-lg leading-relaxed text-muted-foreground max-w-xl">
              Experience premium grooming at our barber shop. Our licensed
              barbers provide professional service, ensuring convenience and
              quality in every appointment.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 sm:gap-6 pt-4">
              {stats.map((stat, index) => (
                <Card
                  key={index}
                  className="border-0 shadow-sm bg-brand-muted-bg"
                >
                  <CardContent className="p-4 sm:p-6 text-center">
                    <p className="text-3xl sm:text-4xl md:text-5xl font-black mb-2 text-brand-accent">
                      {stat.value}
                    </p>
                    <p className="text-xs sm:text-sm font-semibold uppercase tracking-wide text-foreground">
                      {stat.label}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Image */}
          <div className="relative order-1 lg:order-2">
            <div className="relative aspect-[4/5] overflow-hidden rounded-lg shadow-lg">
              <Image
                src="/images/about-barber.webp"
                alt="Professional barber at barber shop"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority={false}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
