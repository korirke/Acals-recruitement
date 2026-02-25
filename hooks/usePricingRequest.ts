"use client";

import { useState } from "react";
import { pricingService, PricingRequestData } from "@/services/pricingService";
import { useErrorHandler } from "./useErrorHandler";

export function usePricingRequest() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { handleError, handleSuccess } = useErrorHandler();

  const submitPricingRequest = async (
    data: PricingRequestData,
  ): Promise<boolean> => {
    try {
      setIsSubmitting(true);
      const success = await pricingService.submitPricingRequest(data);

      if (success) {
        setIsSubmitted(true);
        handleSuccess(
          "Quote request submitted successfully! Our team will contact you within 24 hours.",
        );
        return true;
      } else {
        handleError("Failed to submit quote request. Please try again.");
        return false;
      }
    } catch (error: any) {
      handleError(error);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetSubmission = () => {
    setIsSubmitted(false);
  };

  return {
    isSubmitting,
    isSubmitted,
    submitPricingRequest,
    resetSubmission,
  };
}
