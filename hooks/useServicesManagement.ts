"use client";

import { useState, useCallback } from "react";
import { servicesService } from "@/services/web-services";
import { useErrorHandler } from "./useErrorHandler";
import type {
  Service,
  ProcessStep,
  ComplianceItem,
} from "@/types/api/services.types";

export function useServicesManagement() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const { handleError, handleSuccess } = useErrorHandler();

  const fetchServices = useCallback(async () => {
    setLoading(true);
    try {
      const data = await servicesService.getAll();
      setServices(data);
    } catch (error: any) {
      handleError(error.message || "Failed to fetch services");
      throw error;
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  const saveServices = useCallback(async () => {
    setSaving(true);
    try {
      const cleanedServices = services.map(
        ({ id, createdAt, updatedAt, ...service }) => ({
          ...service,
          ...(id.startsWith("temp-") ? {} : { id }),
        }),
      );

      await servicesService.updateAll(cleanedServices);

      handleSuccess("Services updated successfully!");
      await fetchServices();
      return true;
    } catch (error: any) {
      handleError(error.message || "Failed to save services");
      return false;
    } finally {
      setSaving(false);
    }
  }, [services, handleSuccess, handleError, fetchServices]);

  const addService = useCallback(() => {
    const newService = servicesService.createNew(1); // Position 1 for top
    setServices((prev) => {
      // Add at the beginning and update positions
      const updated = [newService, ...prev];
      return updated.map((s, index) => ({ ...s, position: index + 1 }));
    });
    return newService.id;
  }, []);

  const deleteService = useCallback(
    async (id: string) => {
      try {
        if (!id.startsWith("temp-")) {
          await servicesService.delete(id);
        }

        setServices((prev) => {
          const filtered = prev.filter((s) => s.id !== id);
          return filtered.map((s, index) => ({ ...s, position: index + 1 }));
        });
        handleSuccess("Service deleted successfully");
        return true;
      } catch (error: any) {
        handleError(error.message || "Failed to delete service");
        return false;
      }
    },
    [handleSuccess, handleError],
  );

  const updateService = useCallback((id: string, updates: Partial<Service>) => {
    setServices((prev) =>
      prev.map((service) =>
        service.id === id ? { ...service, ...updates } : service,
      ),
    );
  }, []);

  const moveService = useCallback((id: string, direction: "up" | "down") => {
    setServices((prev) => servicesService.moveService(prev, id, direction));
  }, []);

  const addProcessStep = useCallback(
    (serviceId: string) => {
      const service = services.find((s) => s.id === serviceId);
      if (service) {
        const newStep: ProcessStep = {
          step: String((service.processSteps?.length || 0) + 1).padStart(
            2,
            "0",
          ),
          title: "New Process Step",
          description: "Describe this step in detail...",
        };

        updateService(serviceId, {
          processSteps: [...(service.processSteps || []), newStep],
        });
      }
    },
    [services, updateService],
  );

  const updateProcessStep = useCallback(
    (serviceId: string, stepIndex: number, updates: Partial<ProcessStep>) => {
      const service = services.find((s) => s.id === serviceId);
      if (service?.processSteps) {
        const updatedSteps = [...service.processSteps];
        updatedSteps[stepIndex] = { ...updatedSteps[stepIndex], ...updates };
        updateService(serviceId, { processSteps: updatedSteps });
      }
    },
    [services, updateService],
  );

  const removeProcessStep = useCallback(
    (serviceId: string, stepIndex: number) => {
      const service = services.find((s) => s.id === serviceId);
      if (service?.processSteps) {
        const updatedSteps = service.processSteps.filter(
          (_: ProcessStep, i: number) => i !== stepIndex,
        );
        updateService(serviceId, { processSteps: updatedSteps });
      }
    },
    [services, updateService],
  );

  const addComplianceItem = useCallback(
    (serviceId: string) => {
      const service = services.find((s) => s.id === serviceId);
      if (service) {
        const newItem: ComplianceItem = {
          title: "New Compliance Requirement",
          description: "Describe this compliance requirement...",
        };

        updateService(serviceId, {
          complianceItems: [...(service.complianceItems || []), newItem],
        });
      }
    },
    [services, updateService],
  );

  const updateComplianceItem = useCallback(
    (
      serviceId: string,
      itemIndex: number,
      updates: Partial<ComplianceItem>,
    ) => {
      const service = services.find((s) => s.id === serviceId);
      if (service?.complianceItems) {
        const updatedItems = [...service.complianceItems];
        updatedItems[itemIndex] = { ...updatedItems[itemIndex], ...updates };
        updateService(serviceId, { complianceItems: updatedItems });
      }
    },
    [services, updateService],
  );

  const removeComplianceItem = useCallback(
    (serviceId: string, itemIndex: number) => {
      const service = services.find((s) => s.id === serviceId);
      if (service?.complianceItems) {
        const updatedItems = service.complianceItems.filter(
          (_: ComplianceItem, i: number) => i !== itemIndex,
        );
        updateService(serviceId, { complianceItems: updatedItems });
      }
    },
    [services, updateService],
  );

  return {
    services,
    loading,
    saving,
    fetchServices,
    saveServices,
    addService,
    deleteService,
    updateService,
    moveService,
    addProcessStep,
    updateProcessStep,
    removeProcessStep,
    addComplianceItem,
    updateComplianceItem,
    removeComplianceItem,
  };
}
