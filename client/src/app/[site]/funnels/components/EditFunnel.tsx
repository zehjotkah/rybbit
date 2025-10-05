"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { FunnelStep, useGetFunnel, useSaveFunnel } from "../../../../api/analytics/funnels/useGetFunnel";
import { SavedFunnel } from "../../../../api/analytics/funnels/useGetFunnels";
import { FunnelForm } from "./FunnelForm";

interface EditFunnelDialogProps {
  funnel: SavedFunnel;
  isOpen: boolean;
  onClose: () => void;
}

export function EditFunnelDialog({ funnel, isOpen, onClose }: EditFunnelDialogProps) {
  // Funnel steps state - initialized from funnel
  const [steps, setSteps] = useState<FunnelStep[]>(funnel.steps);

  // Funnel name - initialized from funnel
  const [name, setName] = useState(funnel.name);

  // Funnel analysis query
  const {
    data,
    isError,
    error,
    isLoading: isPending,
  } = useGetFunnel(
    {
      steps,
    },
    true
  );

  // Funnel save mutation
  const { mutate: saveFunnel, isPending: isSaving, error: saveError } = useSaveFunnel();

  // Query funnel without saving
  const handleQueryFunnel = () => {
    // Validate steps have values
    const hasEmptySteps = steps.some(step => !step.value);
    if (hasEmptySteps) {
      alert("All steps must have values");
      return;
    }
  };

  // Update funnel
  const handleUpdateFunnel = () => {
    // Validate name
    if (!name.trim()) {
      alert("Please enter a funnel name");
      return;
    }

    // Validate steps have values
    const hasEmptySteps = steps.some(step => !step.value);
    if (hasEmptySteps) {
      alert("All steps must have values");
      return;
    }

    // Update funnel with the report ID
    saveFunnel(
      {
        steps,
        name,
        reportId: funnel.id,
      },
      {
        onSuccess: () => {
          // Close dialog on successful save
          onClose();
          // Show success message
          toast?.success("Funnel updated successfully");
        },
        onError: error => {
          // Show error but don't close dialog
          toast?.error(`Failed to update funnel: ${error.message}`);
        },
      }
    );
  };

  // Load existing funnel data on first render
  useEffect(() => {
    // Pre-load the funnel visualization
    handleQueryFunnel();
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
      <DialogContent className="max-w-[95vw]">
        <DialogHeader>
          <DialogTitle>Edit Funnel</DialogTitle>
        </DialogHeader>

        <FunnelForm
          name={name}
          setName={setName}
          steps={steps}
          setSteps={setSteps}
          onSave={handleUpdateFunnel}
          onCancel={onClose}
          onQuery={handleQueryFunnel}
          saveButtonText="Update Funnel"
          isSaving={isSaving}
          isError={isError}
          isPending={isPending}
          error={error}
          saveError={saveError}
          funnelData={data}
        />
      </DialogContent>
    </Dialog>
  );
}
