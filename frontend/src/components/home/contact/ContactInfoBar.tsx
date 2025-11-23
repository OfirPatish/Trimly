"use client";

import { MapPin, Phone, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const contactInfo = [
  {
    icon: MapPin,
    title: "Location",
    content: (
      <>
        3696 Lynden Road
        <br />
        Lefroy, Ontario, Canada
      </>
    ),
  },
  {
    icon: Phone,
    title: "Contact",
    content: (
      <>
        +1 (123) 456-7890
        <br />
        +1 (123) 456-7891
      </>
    ),
  },
  {
    icon: Clock,
    title: "Hours",
    content: (
      <>
        Mon - Sat: 8AM - 8PM
        <br />
        Sunday: 8AM - 6PM
      </>
    ),
  },
];

export function ContactInfoBar() {
  return (
    <section className="relative -mt-12 sm:-mt-16 md:-mt-20 z-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="border shadow-lg bg-background">
          <CardContent className="p-6 sm:p-8 lg:p-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">
              {contactInfo.map((info, index) => {
                const Icon = info.icon;
                return (
                  <div
                    key={index}
                    className="flex flex-col items-center text-center gap-4"
                  >
                    <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-foreground flex items-center justify-center flex-shrink-0">
                      <Icon className="h-7 w-7 sm:h-8 sm:w-8 text-background" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold uppercase tracking-wide mb-2 text-foreground">
                        {info.title}
                      </h3>
                      <p className="text-sm sm:text-base leading-relaxed text-muted-foreground">
                        {info.content}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
