import prisma from "../../config/database.js";
import {
  checkAppointmentConflict,
  checkCustomerAppointmentConflict,
} from "./conflicts.js";
import { enrichAppointmentWithBarber } from "./enrichment.js";
import {
  validateAdvanceBooking,
  findAndVerifyAppointmentOwnership,
  canCancelAppointment,
  checkMaxAppointmentsPerDay,
} from "./business-rules.js";
import { CreateAppointmentRequest } from "../../types/requests.js";

/**
 * Get all appointments for a user
 */
export const getUserAppointments = async (userId: string) => {
  const appointments = await prisma.appointment.findMany({
    where: {
      userId,
    },
    orderBy: {
      appointmentDate: "asc",
    },
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
  });

  // Fetch barber information for each appointment
  const appointmentsWithBarbers = await Promise.all(
    appointments.map((appointment) => enrichAppointmentWithBarber(appointment))
  );

  return appointmentsWithBarbers;
};

/**
 * Validate and prepare service data for appointment creation
 */
export const validateAndPrepareService = async (
  serviceId?: string,
  providedPrice?: number
) => {
  if (!serviceId) {
    return {
      serviceType: null,
      price: null,
      serviceId: null,
      duration: null,
    };
  }

  // Look up service in database
  const service = await prisma.service.findUnique({
    where: { serviceId },
    select: {
      id: true,
      serviceId: true,
      name: true,
      price: true,
      duration: true,
      isActive: true,
    },
  });

  if (!service) {
    throw new Error("Invalid service ID");
  }

  if (!service.isActive) {
    throw new Error("Service is not available");
  }

  // Validate price matches service
  const expectedPrice = Number(service.price);
  if (providedPrice !== undefined && providedPrice !== expectedPrice) {
    throw new Error(
      `Price ${providedPrice} does not match service ${service.name} (expected ${expectedPrice})`
    );
  }

  return {
    serviceType: service.name,
    price: expectedPrice,
    serviceId: service.id, // Database UUID
    duration: service.duration, // Store duration snapshot so updates don't affect existing appointments
  };
};

/**
 * Validate barber exists and has barber role
 */
const validateBarber = async (barberId: string) => {
  if (!barberId) {
    throw new Error("Barber selection is required");
  }

  const barber = await prisma.user.findUnique({
    where: { id: barberId },
    select: { id: true, role: true },
  });

  if (!barber) {
    throw new Error("Invalid barber ID");
  }

  if (barber.role !== "barber") {
    throw new Error("Selected user is not a barber");
  }
};

/**
 * Validate all appointment creation requirements
 */
const validateAppointmentCreation = async (
  userId: string,
  requestedDate: Date,
  barberId: string,
  serviceId: string | undefined,
  serviceData: { duration: number | null }
) => {
  // Validate advance booking requirement
  const advanceBookingValidation = validateAdvanceBooking(requestedDate);
  if (!advanceBookingValidation.isValid) {
    throw new Error(advanceBookingValidation.error);
  }

  // Check maximum appointments per day
  const maxAppointmentsCheck = await checkMaxAppointmentsPerDay(
    userId,
    requestedDate
  );
  if (!maxAppointmentsCheck.isValid) {
    throw new Error(maxAppointmentsCheck.error);
  }

  // Check for customer overlapping appointments
  const customerConflictCheck = await checkCustomerAppointmentConflict(
    userId,
    requestedDate,
    serviceData.duration || 0
  );
  if (customerConflictCheck.hasConflict) {
    throw new Error(
      "You already have an appointment that overlaps with this time slot. Please select a different time."
    );
  }

  // Check for conflicts (per barber)
  const conflictCheck = await checkAppointmentConflict(
    requestedDate,
    barberId,
    undefined,
    serviceId
  );
  if (conflictCheck.hasConflict) {
    throw new Error(
      "This time slot is already booked for this barber. Please choose another time or barber."
    );
  }
};

/**
 * Create a new appointment
 */
export const createAppointmentService = async (
  userId: string,
  data: CreateAppointmentRequest
) => {
  const { appointmentDate, barberId, serviceId, price, notes } = data;

  // Validate barber
  await validateBarber(barberId);

  // Use transaction to prevent race conditions in concurrent booking
  return await prisma.$transaction(async (tx) => {
    // Validate and prepare service data
    const serviceData = await validateAndPrepareService(serviceId, price);
    const requestedDate = new Date(appointmentDate);

    // Validate all appointment creation requirements
    await validateAppointmentCreation(
      userId,
      requestedDate,
      barberId,
      serviceId,
      serviceData
    );

    // Create appointment within transaction
    const appointment = await tx.appointment.create({
      data: {
        userId,
        barberId,
        appointmentDate: requestedDate,
        serviceId: serviceData.serviceId || undefined,
        serviceType: serviceData.serviceType,
        price: serviceData.price,
        duration: serviceData.duration, // Store duration snapshot so service updates don't affect existing appointments
        notes: notes || null,
        status: null, // Active appointments have no status, only cancelled ones do
      },
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
    });

    return appointment;
  });
};

/**
 * Delete an appointment
 */
export const deleteAppointmentService = async (
  appointmentId: string,
  userId: string
) => {
  // Find and verify appointment ownership
  const { appointment, error } = await findAndVerifyAppointmentOwnership(
    appointmentId,
    userId
  );

  if (error) {
    throw new Error(error);
  }

  // Check cancellation deadline (must cancel at least 1 hour before)
  const cancellationCheck = canCancelAppointment(
    new Date(appointment!.appointmentDate)
  );
  if (!cancellationCheck.canCancel) {
    throw new Error(cancellationCheck.error);
  }

  await prisma.appointment.delete({
    where: { id: appointmentId },
  });
};
