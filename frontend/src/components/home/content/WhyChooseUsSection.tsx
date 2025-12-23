"use client";

import { Award, Users, CheckCircle2, Shield, Clock, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: Shield,
    title: "Licensed & Insured",
    description:
      "All our barbers are fully licensed and insured, following strict hygiene protocols for your safety.",
  },
  {
    icon: Users,
    title: "Expert Barbers",
    description:
      "Experienced professionals passionate about delivering high-quality, personalized grooming services.",
  },
  {
    icon: Star,
    title: "Trusted Service",
    description:
      "Rated 5 stars by hundreds of satisfied customers. Your satisfaction is our priority.",
  },
  {
    icon: Clock,
    title: "Flexible Scheduling",
    description:
      "Book appointments that fit your schedule. We work around your time, not the other way around.",
  },
  {
    icon: Award,
    title: "Premium Quality",
    description:
      "We use only the finest tools and products to ensure exceptional results every time.",
  },
  {
    icon: CheckCircle2,
    title: "Convenience",
    description:
      "Visit our barber shop. Get professional barber service in a comfortable setting.",
  },
];

export function WhyChooseUsSection() {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-4 text-foreground">
            Why Choose Us
          </h2>
          <p className="text-base sm:text-lg max-w-2xl mx-auto text-muted-foreground">
            Experience the difference of professional barber shop service with
            unmatched convenience and quality.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={index}
                className="border shadow-sm hover:shadow-md transition-shadow bg-background"
              >
                <CardContent className="p-6 sm:p-8">
                  <div className="space-y-4">
                    {/* Icon */}
                    <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-lg bg-foreground flex items-center justify-center">
                      <Icon
                        className="h-6 w-6 sm:h-7 sm:w-7 text-background"
                        strokeWidth={2}
                      />
                    </div>

                    {/* Content */}
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold mb-2 text-foreground">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
