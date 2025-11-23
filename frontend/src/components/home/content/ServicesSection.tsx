"use client";

import { Loader2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useServices } from "@/hooks/queries/useServices";
import { mergeServicesWithUI } from "@/constants/booking";
import { useAuthStore } from "@/stores/authStore";

export function ServicesSection() {
  const { data: services = [], isLoading } = useServices();
  const servicesWithUI = mergeServicesWithUI(services);
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

  return (
    <section
      id="services"
      className="py-16 sm:py-20 lg:py-24 bg-brand-muted-bg"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-4 text-foreground">
            Our Services
          </h2>
          <p className="text-base sm:text-lg max-w-2xl mx-auto text-muted-foreground">
            Professional grooming services delivered to your home. Choose from
            our range of premium barber services.
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : servicesWithUI.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground">
              No services available at the moment.
            </p>
          </div>
        ) : (
          <>
            {/* Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12">
              {servicesWithUI.map((service) => {
                const Icon = service.icon;

                return (
                  <Card
                    key={service.id}
                    className="border shadow-sm hover:shadow-md transition-shadow bg-background"
                  >
                    <CardContent className="p-6 sm:p-8">
                      <div className="space-y-4">
                        {/* Icon */}
                        <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-lg bg-foreground flex items-center justify-center">
                          <Icon className="h-6 w-6 sm:h-7 sm:w-7 text-background" />
                        </div>

                        {/* Service Info */}
                        <div>
                          <h3 className="text-lg sm:text-xl font-bold mb-2 text-foreground">
                            {service.label}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                            Professional {service.label.toLowerCase()} service
                            tailored to your needs.
                          </p>

                          {/* Price & Duration */}
                          <div className="flex items-center justify-between pt-2 border-t">
                            {service.price && (
                              <span className="text-xl sm:text-2xl font-black text-foreground">
                                ${service.price.toFixed(0)}
                              </span>
                            )}
                            {service.duration && (
                              <Badge
                                variant="secondary"
                                className="flex items-center gap-1"
                              >
                                <Clock className="h-3 w-3" />
                                {service.duration}min
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* CTA Button */}
            <div className="text-center">
              <Button
                size="lg"
                onClick={handleBookingClick}
                className="text-base sm:text-lg px-8 sm:px-10 py-6 sm:py-7 font-semibold uppercase tracking-wide"
              >
                {isBarber ? "Manage Appointments" : "Book Appointment"}
              </Button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
