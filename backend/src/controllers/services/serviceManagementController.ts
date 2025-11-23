import { Request, Response, NextFunction } from "express";
import prisma from "../../config/database.js";
import {
  ValidationError,
  NotFoundError,
  ConflictError,
} from "../../middleware/errorHandler.js";
import { formatServiceForResponse } from "../../utils/transformers/serviceTransform.js";

/**
 * Create a new service
 * Protected endpoint - only barbers can create services
 */
export const createService = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { serviceId, name, price, duration } = req.body;

    // Check if serviceId already exists
    const existing = await prisma.service.findUnique({
      where: { serviceId },
    });

    // If service exists and is active, return error
    if (existing?.isActive) {
      throw new ConflictError("Service ID already exists");
    }

    // If service exists but is inactive, re-enable it with new data
    if (existing && !existing.isActive) {
      const service = await prisma.service.update({
        where: { serviceId },
        data: {
          name,
          price: Number(price),
          duration: Number(duration),
          isActive: true,
        },
        select: {
          serviceId: true,
          name: true,
          price: true,
          duration: true,
        },
      });

      res.status(200).json({
        service: formatServiceForResponse(service),
        message: "Service restored successfully",
      });
      return;
    }

    // Create new service if it doesn't exist
    const service = await prisma.service.create({
      data: {
        serviceId,
        name,
        price: Number(price),
        duration: Number(duration),
        isActive: true,
      },
      select: {
        serviceId: true,
        name: true,
        price: true,
        duration: true,
      },
    });

    res.status(201).json({
      service: formatServiceForResponse(service),
      message: "Service created successfully",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update a service
 * Protected endpoint - only barbers can update services
 */
export const updateService = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { serviceId } = req.params;
    const { name, price, duration } = req.body;

    if (!serviceId) {
      throw new ValidationError("Service ID is required");
    }

    // Check if service exists
    const existing = await prisma.service.findUnique({
      where: { serviceId },
    });

    if (!existing) {
      throw new NotFoundError("Service not found");
    }

    // Update the service
    const service = await prisma.service.update({
      where: { serviceId },
      data: {
        name: name?.trim(),
        price: price ? Number(price) : undefined,
        duration: duration ? Number(duration) : undefined,
      },
      select: {
        serviceId: true,
        name: true,
        price: true,
        duration: true,
      },
    });

    res.json({
      service: formatServiceForResponse(service),
      message: "Service updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a service (soft delete by setting isActive to false)
 * Protected endpoint - only barbers can delete services
 */
export const deleteService = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { serviceId } = req.params;

    if (!serviceId) {
      throw new ValidationError("Service ID is required");
    }

    // Check if service exists
    const existing = await prisma.service.findUnique({
      where: { serviceId },
    });

    if (!existing) {
      throw new NotFoundError("Service not found");
    }

    // Soft delete by setting isActive to false
    await prisma.service.update({
      where: { serviceId },
      data: { isActive: false },
    });

    res.json({
      message: "Service deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Restore an inactive service (set isActive to true)
 * Protected endpoint - only barbers can restore services
 */
export const restoreService = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { serviceId } = req.params;

    if (!serviceId) {
      throw new ValidationError("Service ID is required");
    }

    // Check if service exists
    const existing = await prisma.service.findUnique({
      where: { serviceId },
    });

    if (!existing) {
      throw new NotFoundError("Service not found");
    }

    if (existing.isActive) {
      throw new ValidationError("Service is already active");
    }

    // Restore by setting isActive to true
    const service = await prisma.service.update({
      where: { serviceId },
      data: { isActive: true },
      select: {
        serviceId: true,
        name: true,
        price: true,
        duration: true,
        isActive: true,
      },
    });

    res.json({
      service: formatServiceForResponse(service),
      message: "Service restored successfully",
    });
  } catch (error) {
    next(error);
  }
};
