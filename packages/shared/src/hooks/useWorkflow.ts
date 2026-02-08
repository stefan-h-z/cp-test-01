import type { WorkflowConfig, WorkflowStepConfig } from '@app/types';
import { useCallback, useMemo, useRef, useState } from 'react';
import type { z } from 'zod';
import { buildWorkflowSchemas, getStepDefaultValues } from '../utils/buildZodSchema';

export interface UseWorkflowOptions {
  config: WorkflowConfig;
  initialData?: Record<string, unknown>;
  onComplete?: (data: Record<string, unknown>) => void | Promise<void>;
  onCancel?: () => void;
}

export type WorkflowStepStatus = 'pending' | 'active' | 'completed' | 'error';

export interface UseWorkflowReturn {
  currentStep: number;
  totalSteps: number;
  currentStepConfig: WorkflowStepConfig;
  isFirstStep: boolean;
  isLastStep: boolean;
  isSubmitting: boolean;
  isComplete: boolean;
  allFormData: Record<string, unknown>;

  currentStepSchema: z.ZodObject<Record<string, z.ZodTypeAny>>;
  currentStepDefaultValues: Record<string, unknown>;

  goToNextStep: (currentFormValues: Record<string, unknown>) => boolean;
  goToPreviousStep: (currentFormValues: Record<string, unknown>) => void;
  goToStep: (stepIndex: number, currentFormValues: Record<string, unknown>) => void;
  submitWorkflow: (currentFormValues: Record<string, unknown>) => Promise<void>;
  cancelWorkflow: () => void;

  getStepStatus: (stepIndex: number) => WorkflowStepStatus;
  canNavigateToStep: (stepIndex: number) => boolean;
}

export function useWorkflow(options: UseWorkflowOptions): UseWorkflowReturn {
  const { config, initialData, onComplete, onCancel } = options;

  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const accumulatedDataRef = useRef<Record<string, unknown>>(initialData ?? {});

  const totalSteps = config.steps.length;
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;
  const currentStepConfig = config.steps[currentStep];

  const stepSchemas = useMemo(() => buildWorkflowSchemas(config), [config]);

  const currentStepSchema = stepSchemas[currentStep];

  const currentStepDefaultValues = useMemo(() => {
    const fieldDefaults = getStepDefaultValues(currentStepConfig);
    const accumulated = accumulatedDataRef.current;

    const merged: Record<string, unknown> = { ...fieldDefaults };
    for (const field of currentStepConfig.fields) {
      if (accumulated[field.name] !== undefined) {
        merged[field.name] = accumulated[field.name];
      }
    }
    return merged;
  }, [currentStepConfig, currentStep]); // eslint-disable-line react-hooks/exhaustive-deps

  const saveFormValues = useCallback((values: Record<string, unknown>) => {
    accumulatedDataRef.current = { ...accumulatedDataRef.current, ...values };
  }, []);

  const goToNextStep = useCallback(
    (currentFormValues: Record<string, unknown>): boolean => {
      const result = currentStepSchema.safeParse(currentFormValues);
      if (!result.success) {
        return false;
      }

      saveFormValues(currentFormValues);
      setCompletedSteps((prev) => new Set([...prev, currentStep]));
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps - 1));
      return true;
    },
    [currentStepSchema, saveFormValues, currentStep, totalSteps]
  );

  const goToPreviousStep = useCallback(
    (currentFormValues: Record<string, unknown>) => {
      saveFormValues(currentFormValues);
      setCurrentStep((prev) => Math.max(prev - 1, 0));
    },
    [saveFormValues]
  );

  const goToStep = useCallback(
    (stepIndex: number, currentFormValues: Record<string, unknown>) => {
      if (stepIndex < 0 || stepIndex >= totalSteps) return;

      // Can only go to completed steps or the current step
      if (stepIndex > currentStep && !completedSteps.has(stepIndex)) return;

      saveFormValues(currentFormValues);
      setCurrentStep(stepIndex);
    },
    [totalSteps, currentStep, completedSteps, saveFormValues]
  );

  const submitWorkflow = useCallback(
    async (currentFormValues: Record<string, unknown>) => {
      const result = currentStepSchema.safeParse(currentFormValues);
      if (!result.success) return;

      saveFormValues(currentFormValues);
      setCompletedSteps((prev) => new Set([...prev, currentStep]));

      const finalData = { ...accumulatedDataRef.current, ...currentFormValues };

      setIsSubmitting(true);
      try {
        await onComplete?.(finalData);
        setIsComplete(true);
      } finally {
        setIsSubmitting(false);
      }
    },
    [currentStepSchema, saveFormValues, currentStep, onComplete]
  );

  const cancelWorkflow = useCallback(() => {
    onCancel?.();
  }, [onCancel]);

  const getStepStatus = useCallback(
    (stepIndex: number): WorkflowStepStatus => {
      if (stepIndex === currentStep) return 'active';
      if (completedSteps.has(stepIndex)) return 'completed';
      return 'pending';
    },
    [currentStep, completedSteps]
  );

  const canNavigateToStep = useCallback(
    (stepIndex: number): boolean => {
      if (stepIndex === currentStep) return true;
      if (!(config.allowStepClick ?? false)) return false;
      return completedSteps.has(stepIndex) || stepIndex < currentStep;
    },
    [currentStep, completedSteps, config.allowStepClick]
  );

  return {
    currentStep,
    totalSteps,
    currentStepConfig,
    isFirstStep,
    isLastStep,
    isSubmitting,
    isComplete,
    allFormData: accumulatedDataRef.current,

    currentStepSchema,
    currentStepDefaultValues,

    goToNextStep,
    goToPreviousStep,
    goToStep,
    submitWorkflow,
    cancelWorkflow,

    getStepStatus,
    canNavigateToStep,
  };
}
