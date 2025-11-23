/**
 * Utility functions for transforming service data between database and API formats
 */

// Prisma Decimal type can be converted to number
type PriceType =
  | number
  | string
  | { toString(): string }
  | { toNumber(): number };

interface ServiceFromDB {
  serviceId: string;
  name: string;
  price: PriceType;
  duration: number;
  isActive?: boolean;
}

interface ServiceForAPI {
  id: string;
  name: string;
  price: number;
  duration: number;
  isActive?: boolean;
}

/**
 * Transform a single service from database format to API format
 * @param service - Service object from database
 * @returns Service object formatted for API response
 */
export function formatServiceForResponse(
  service: ServiceFromDB
): ServiceForAPI {
  // Handle Prisma Decimal type and other price formats
  let priceValue: number;
  if (typeof service.price === "number") {
    priceValue = service.price;
  } else if (typeof service.price === "string") {
    priceValue = Number(service.price);
  } else if (
    service.price &&
    typeof service.price === "object" &&
    "toNumber" in service.price
  ) {
    priceValue = (service.price as { toNumber(): number }).toNumber();
  } else {
    priceValue = Number(service.price.toString());
  }

  return {
    id: service.serviceId,
    name: service.name,
    price: priceValue,
    duration: service.duration,
    ...(service.isActive !== undefined && { isActive: service.isActive }),
  };
}

/**
 * Transform an array of services from database format to API format
 * @param services - Array of service objects from database
 * @returns Array of service objects formatted for API response
 */
export function formatServicesForResponse(
  services: ServiceFromDB[]
): ServiceForAPI[] {
  return services.map(formatServiceForResponse);
}
