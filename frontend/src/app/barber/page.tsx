"use client";

import { Navbar } from "@/components/layout/Navbar";
import { PageContainer } from "@/components/layout/PageContainer";
import { AuthGuard } from "@/components/layout/AuthGuard";
import { DashboardContent } from "@/components/barber";

export default function BarberPage() {
  return (
    <AuthGuard requireAuth requireRole="barber">
      <div className="min-h-screen bg-background">
        <Navbar />
        <PageContainer className="py-8">
          <DashboardContent />
        </PageContainer>
      </div>
    </AuthGuard>
  );
}
