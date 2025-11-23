import prisma from "../../config/database.js";

/**
 * Enrich an appointment with barber information
 * @param appointment - The appointment object (with barberId)
 * @returns Appointment with barber information added
 */
export const enrichAppointmentWithBarber = async (appointment: any) => {
  try {
    const barber = await prisma.user.findUnique({
      where: { id: appointment.barberId },
      select: {
        id: true,
        name: true,
      },
    });

    return {
      ...appointment,
      barber: barber || {
        id: appointment.barberId,
        name: "Unknown Barber",
      },
    };
  } catch {
    return {
      ...appointment,
      barber: {
        id: appointment.barberId,
        name: "Unknown Barber",
      },
    };
  }
};
