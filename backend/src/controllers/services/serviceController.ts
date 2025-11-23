import { Request, Response, NextFunction } from "express";
import prisma from "../../config/database.js";
import { formatServicesForResponse } from "../../utils/transformers/serviceTransform.js";

/**
 * Get all available services
 * Public endpoint - anyone can see available services
 * Only returns active services
 */
export const getServices = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const services = await prisma.service.findMany({
      where: {
        isActive: true,
      },
      select: {
        serviceId: true,
        name: true,
        price: true,
        duration: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    const formattedServices = formatServicesForResponse(services);
    res.json({ services: formattedServices });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all services (active and inactive) for barbers
 * Protected endpoint - only barbers can see all services
 */
export const getAllServices = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const services = await prisma.service.findMany({
      select: {
        serviceId: true,
        name: true,
        price: true,
        duration: true,
        isActive: true,
      },
      orderBy: [
        { isActive: "desc" }, // Active services first
        { name: "asc" },
      ],
    });

    const formattedServices = formatServicesForResponse(services);
    res.json({ services: formattedServices });
  } catch (error) {
    next(error);
  }
};
