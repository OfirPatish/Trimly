"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, Plus } from "lucide-react";
import { useAllServices } from "@/hooks/queries/useServices";
import {
  useCreateService,
  useUpdateService,
  useDeleteService,
  useRestoreService,
} from "../hooks";
import { SectionCard } from "@/components/shared";
import { SERVICE_UI_METADATA } from "@/constants/booking";
import type { Service } from "@/hooks/queries/useServices";
import { ServiceForm, ServiceList } from "./components";

export function ServicesSection() {
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState({
    serviceType: "custom",
    serviceId: "",
    name: "",
    price: "",
    duration: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { data: services, isLoading } = useAllServices();
  const createServiceMutation = useCreateService();
  const updateServiceMutation = useUpdateService();
  const deleteServiceMutation = useDeleteService();
  const restoreServiceMutation = useRestoreService();

  // Calculate active and inactive counts
  const activeCount = services?.filter((s) => s.isActive !== false).length || 0;
  const inactiveCount =
    services?.filter((s) => s.isActive === false).length || 0;

  const handleToggle = async (serviceId: string, isActive: boolean) => {
    try {
      setError("");
      if (isActive) {
        // Restore service
        const result = await restoreServiceMutation.mutateAsync(serviceId);
        setSuccess(result.message || "Service activated successfully!");
      } else {
        // Deactivate service
        await deleteServiceMutation.mutateAsync(serviceId);
        setSuccess("Service deactivated successfully!");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : `Failed to ${isActive ? "activate" : "deactivate"} service`;
      setError(errorMessage);
    }
  };

  const handleEditClick = (service: Service) => {
    setEditingService(service);
    const hasMetadata = service.id in SERVICE_UI_METADATA;
    setFormData({
      serviceType: hasMetadata ? service.id : "custom",
      serviceId: service.id,
      name: service.name,
      price: service.price.toString(),
      duration: service.duration.toString(),
    });
    setShowForm(true);
    setError("");
    setSuccess("");
  };

  const handleCancel = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setShowForm(false);
    setEditingService(null);
    setFormData({
      serviceType: "custom",
      serviceId: "",
      name: "",
      price: "",
      duration: "",
    });
    setError("");
    setSuccess("");
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const price = parseFloat(formData.price);
    const duration = parseInt(formData.duration);

    if (isNaN(price) || price <= 0) {
      setError("Please enter a valid price");
      return;
    }

    if (isNaN(duration) || duration <= 0) {
      setError("Please enter a valid duration");
      return;
    }

    try {
      if (editingService) {
        const result = await updateServiceMutation.mutateAsync({
          serviceId: editingService.id,
          data: {
            name: formData.name,
            price,
            duration,
          },
        });
        setSuccess(result.message || "Service updated successfully!");
      } else {
        const result = await createServiceMutation.mutateAsync({
          serviceId: formData.serviceId || `custom-${Date.now()}`,
          name: formData.name,
          price,
          duration,
        });
        setSuccess(result.message || "Service created successfully!");
      }

      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        handleCancel();
      }, 1500);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to save service";
      setError(errorMessage);
    }
  };

  return (
    <>
      <SectionCard
        title="Services"
        description={
          inactiveCount > 0
            ? `${activeCount} active, ${inactiveCount} inactive`
            : `${activeCount} services`
        }
        headerAction={
          !showForm && (
            <Button
              onClick={() => setShowForm(true)}
              size="sm"
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Service
            </Button>
          )
        }
      >
        {error && (
          <Alert variant="destructive" className="mb-5">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-5 border-green-500/50 bg-green-500/10">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-600 font-medium">
              {success}
            </AlertDescription>
          </Alert>
        )}

        {showForm ? (
          <ServiceForm
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isEditing={!!editingService}
          />
        ) : (
          <ServiceList
            services={services || []}
            isLoading={isLoading}
            onEdit={handleEditClick}
            onToggle={handleToggle}
            isToggling={
              deleteServiceMutation.isPending ||
              restoreServiceMutation.isPending
            }
          />
        )}
      </SectionCard>
    </>
  );
}
