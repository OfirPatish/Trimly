import prisma from "../../config/database.js";

/**
 * Get all barbers (public)
 */
export const getAllBarbers = async () => {
  const barbers = await prisma.user.findMany({
    where: {
      role: "barber",
    },
    select: {
      id: true,
      name: true,
      email: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  // Return barbers without specialties (users select service type separately)
  return barbers.map((barber) => ({
    id: barber.id,
    name: barber.name,
  }));
};

/**
 * Get appointments for a specific barber
 */
export const getBarberAppointmentsService = async (
  barberId: string,
  filters?: { status?: string; date?: string }
) => {
  const where: any = {
    barberId,
  };

  if (filters?.status) {
    where.status = filters.status;
  }

  if (filters?.date) {
    const requestedDate = new Date(filters.date);
    const startOfDay = new Date(requestedDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(requestedDate);
    endOfDay.setHours(23, 59, 59, 999);

    where.appointmentDate = {
      gte: startOfDay,
      lte: endOfDay,
    };
  }

  const appointments = await prisma.appointment.findMany({
    where,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },
      service: {
        select: {
          serviceId: true,
          name: true,
          price: true,
          duration: true,
        },
      },
    },
    orderBy: {
      appointmentDate: "asc",
    },
  });

  return appointments;
};

/**
 * Update appointment status (barber can mark appointments as completed or cancelled)
 */
export const updateAppointmentStatusService = async (
  appointmentId: string,
  barberId: string,
  status: "cancelled"
) => {
  // Only allow cancelling appointments
  if (status !== "cancelled") {
    throw new Error("Invalid status - can only cancel appointments");
  }

  // Check if appointment exists and belongs to this barber
  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId },
  });

  if (!appointment) {
    throw new Error("Appointment not found");
  }

  if (appointment.barberId !== barberId) {
    throw new Error("You can only update your own appointments");
  }

  // Update appointment
  const updatedAppointment = await prisma.appointment.update({
    where: { id: appointmentId },
    data: { status },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },
    },
  });

  return updatedAppointment;
};
