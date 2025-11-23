"use client";

import { Scissors } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { ConfirmDialog, SectionCard, PageHeader } from "@/components/shared";
import {
  BarberAppointmentsList,
  BarberAppointmentFilters,
  BarberEmptyAppointmentsState,
} from "@/components/barber/appointments";
import { StatsCards } from "./StatsCards";
import { BarberTodaySchedule } from "./BarberTodaySchedule";
import { ServicesSection } from "../services";
import { useDashboard } from "../hooks/useDashboard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Scissors as ScissorsIcon, Clock } from "lucide-react";
import { ScheduleSection } from "../schedule";

export function DashboardContent() {
  const { user } = useAuthStore();
  const {
    appointments,
    stats,
    upcomingAppointments,
    pastAppointments,
    todayAppointments,
    statusFilter,
    dateFilter,
    setStatusFilter,
    setDateFilter,
    confirmDialogOpen,
    handleCancelClick,
    handleCancelConfirm,
    handleDialogClose,
    isCancelling,
    cancelError,
  } = useDashboard();

  return (
    <>
      <PageHeader
        title="Dashboard"
        description={
          <>
            Welcome back,{" "}
            <span className="font-semibold text-foreground">
              {user?.name || "Barber"}
            </span>
            ! Manage your barbershop and appointments.
          </>
        }
        icon={Scissors}
      />

      {/* Statistics Cards */}
      <StatsCards stats={stats} />

      {/* Tabs */}
      <Tabs defaultValue="appointments" className="w-full">
        <div className="flex justify-center mb-6">
          <TabsList className="h-auto p-1 bg-muted/50 w-full sm:w-auto">
            <TabsTrigger
              value="appointments"
              className="gap-2 px-4 sm:px-6 py-2.5 sm:py-2 flex-1 sm:flex-initial data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              <Calendar className="h-4 w-4" />
              <span>Appointments</span>
            </TabsTrigger>
            <TabsTrigger
              value="services"
              className="gap-2 px-4 sm:px-6 py-2.5 sm:py-2 flex-1 sm:flex-initial data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              <ScissorsIcon className="h-4 w-4" />
              <span>Services</span>
            </TabsTrigger>
            <TabsTrigger
              value="schedule"
              className="gap-2 px-4 sm:px-6 py-2.5 sm:py-2 flex-1 sm:flex-initial data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              <Clock className="h-4 w-4" />
              <span>Schedule</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="appointments" className="mt-0">
          <SectionCard
            title="Appointments"
            description={`${appointments.length} appointments`}
          >
            <BarberAppointmentFilters
              dateFilter={dateFilter}
              onDateFilterChange={setDateFilter}
              dateFilterOptions={["all", "today", "week", "thisMonth"]}
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
            />

            {/* Today's Schedule */}
            {dateFilter === "today" && todayAppointments.length > 0 && (
              <BarberTodaySchedule
                appointments={todayAppointments}
                onCancel={handleCancelClick}
              />
            )}

            {/* Appointments List */}
            {appointments.length === 0 ? (
              <BarberEmptyAppointmentsState
                title={
                  dateFilter === "today"
                    ? "No appointments today"
                    : dateFilter === "week"
                    ? "No appointments this week"
                    : statusFilter !== "all"
                    ? `No ${statusFilter} appointments`
                    : "No appointments yet"
                }
                description={
                  dateFilter === "today"
                    ? "You don't have any appointments scheduled for today. Enjoy your free time!"
                    : dateFilter === "week"
                    ? "You don't have any appointments scheduled for this week."
                    : statusFilter !== "all"
                    ? `There are no appointments with "${statusFilter}" status. Try adjusting your filters.`
                    : "You don't have any appointments yet. When customers book appointments, they'll appear here."
                }
                hasFilters={dateFilter !== "all" || statusFilter !== "all"}
              />
            ) : (
              <BarberAppointmentsList
                appointments={appointments}
                showSections={true}
                upcomingAppointments={upcomingAppointments}
                pastAppointments={pastAppointments}
                statusFilter={statusFilter}
                dateFilter={dateFilter}
                onCancel={handleCancelClick}
              />
            )}
          </SectionCard>
        </TabsContent>

        <TabsContent value="services" className="mt-0">
          <ServicesSection />
        </TabsContent>

        <TabsContent value="schedule" className="mt-0">
          <ScheduleSection />
        </TabsContent>
      </Tabs>

      {/* Cancel Confirmation Dialog */}
      <ConfirmDialog
        open={confirmDialogOpen}
        onOpenChange={handleDialogClose}
        onConfirm={handleCancelConfirm}
        title="Cancel Appointment?"
        description="Are you sure you want to cancel this appointment? This action cannot be undone."
        confirmText="Yes, Cancel Appointment"
        cancelText="Keep Appointment"
        variant="destructive"
        loading={isCancelling}
        error={cancelError}
      />
    </>
  );
}
