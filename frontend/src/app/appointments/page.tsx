"use client";

import { Navbar } from "@/components/layout/Navbar";
import { PageContainer } from "@/components/layout/PageContainer";
import { AuthGuard } from "@/components/layout/AuthGuard";
import { UpcomingAppointments } from "@/components/customer/appointments";

export default function AppointmentsPage() {
  return (
    <AuthGuard requireAuth requireRole="customer">
      <div className="min-h-screen bg-background">
        {/* Subtle background gradient */}
        <div className="fixed inset-0 -z-10 bg-gradient-to-b from-background via-background to-muted/20" />

        <Navbar />
        <PageContainer className="py-4 sm:py-6 md:py-8 lg:py-12">
          <UpcomingAppointments />
        </PageContainer>
      </div>
    </AuthGuard>
  );
}
