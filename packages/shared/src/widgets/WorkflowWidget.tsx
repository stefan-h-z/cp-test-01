import type { WorkflowWidgetDef, WidgetRendererProps, LocalizedString } from '@app/types';
import { FormField, Button, WorkflowContainer, WorkflowStep } from '@app/ui';
import React, { useCallback } from 'react';
import { XStack, YStack } from 'tamagui';
import { useAppForm } from '../hooks/useAppForm';
import { useWorkflow, type UseWorkflowReturn } from '../hooks/useWorkflow';
import type { WidgetRegistry } from '../registry/WidgetRegistry';
import { useWidgetRegistry } from '../registry/WidgetRegistry';
import { GridRow, GridColumn } from './GridLayout';
import { WidgetTreeRenderer } from './WidgetTreeRenderer';

export function WorkflowWidget({
  definition,
  screenContext,
}: WidgetRendererProps<WorkflowWidgetDef>) {
  const registry = useWidgetRegistry();
  const { config } = definition;

  const resolveStr = screenContext.resolveString;

  const handleComplete = useCallback(
    (data: Record<string, unknown>) => {
      if (config.onComplete) {
        screenContext.executeLink(config.onComplete);
      }
    },
    [config.onComplete, screenContext]
  );

  const handleCancel = useCallback(() => {
    if (config.onCancel) {
      screenContext.executeLink(config.onCancel);
    }
  }, [config.onCancel, screenContext]);

  const workflow = useWorkflow({
    config,
    onComplete: handleComplete,
    onCancel: handleCancel,
  });

  const stepDisplayData = config.steps.map((step) => ({
    title: resolveStr(step.title),
    description: step.description ? resolveStr(step.description) : undefined,
    icon: step.icon,
  }));

  const handleStepPress = useCallback((index: number) => {
    // Step press from stepper is handled inside WorkflowStepForm
    // since it needs the current form values.
    // For now, this is a no-op; step navigation happens via buttons.
  }, []);

  return (
    <WorkflowContainer
      steps={stepDisplayData}
      currentStep={workflow.currentStep}
      getStepStatus={workflow.getStepStatus}
      canNavigateToStep={workflow.canNavigateToStep}
      onStepPress={handleStepPress}
      stepperVariant={config.variant}
    >
      <WorkflowStepForm
        key={workflow.currentStep}
        workflow={workflow}
        screenContext={screenContext}
        registry={registry}
        config={definition.config}
        resolveString={resolveStr}
      />
    </WorkflowContainer>
  );
}

interface WorkflowStepFormProps {
  workflow: UseWorkflowReturn;
  screenContext: WidgetRendererProps<WorkflowWidgetDef>['screenContext'];
  registry: WidgetRegistry;
  config: WorkflowWidgetDef['config'];
  resolveString: (value: string | LocalizedString) => string;
}

function WorkflowStepForm({
  workflow,
  screenContext,
  registry,
  config,
  resolveString,
}: WorkflowStepFormProps) {
  const { currentStepConfig, currentStepSchema, currentStepDefaultValues } = workflow;

  const form = useAppForm({
    schema: currentStepSchema,
    defaultValues: currentStepDefaultValues as Record<string, string>,
  });

  const handleNext = useCallback(async () => {
    const isValid = await form.trigger();
    if (isValid) {
      const values = form.getValues();
      workflow.goToNextStep(values);
    }
  }, [form, workflow]);

  const handleBack = useCallback(() => {
    const values = form.getValues();
    workflow.goToPreviousStep(values);
  }, [form, workflow]);

  const handleSubmit = useCallback(async () => {
    const isValid = await form.trigger();
    if (isValid) {
      const values = form.getValues();
      await workflow.submitWorkflow(values);
    }
  }, [form, workflow]);

  const handleCancel = useCallback(() => {
    workflow.cancelWorkflow();
  }, [workflow]);

  const nextLabel = config.labels?.next ? resolveString(config.labels.next) : 'Next';
  const backLabel = config.labels?.back ? resolveString(config.labels.back) : 'Back';
  const submitLabel = config.labels?.submit ? resolveString(config.labels.submit) : 'Submit';
  const cancelLabel = config.labels?.cancel ? resolveString(config.labels.cancel) : 'Cancel';

  return (
    <YStack gap="$4">
      <WorkflowStep
        title={resolveString(currentStepConfig.title)}
        description={
          currentStepConfig.description ? resolveString(currentStepConfig.description) : undefined
        }
      >
        <GridRow gap="$2">
          {currentStepConfig.fields.map((field) => {
            const fieldProps = form.getFieldProps(field.name as never);
            return (
              <GridColumn
                key={field.name}
                width={field.width}
                responsiveWidth={field.responsiveWidth}
              >
                <FormField
                  name={field.name}
                  label={field.label ? resolveString(field.label) : undefined}
                  placeholder={field.placeholder ? resolveString(field.placeholder) : undefined}
                  type={field.type}
                  required={field.required}
                  disabled={field.disabled}
                  helperText={field.helperText ? resolveString(field.helperText) : undefined}
                  error={fieldProps.error}
                  options={field.options?.map((opt) => ({
                    value: opt.value,
                    label: typeof opt.label === 'string' ? opt.label : resolveString(opt.label),
                    disabled: opt.disabled,
                  }))}
                  value={fieldProps.value}
                  onChange={fieldProps.onChange}
                  onBlur={fieldProps.onBlur}
                />
              </GridColumn>
            );
          })}
        </GridRow>

        {currentStepConfig.children && currentStepConfig.children.length > 0 && (
          <WidgetTreeRenderer
            widgets={currentStepConfig.children}
            screenContext={screenContext}
            registry={registry}
            useGrid={false}
          />
        )}
      </WorkflowStep>

      <XStack justifyContent="space-between" alignItems="center" gap="$3">
        {config.onCancel ? (
          <Button variant="ghost" onPress={handleCancel}>
            {cancelLabel}
          </Button>
        ) : (
          <XStack />
        )}
        <XStack gap="$3">
          {!workflow.isFirstStep && (config.allowBack ?? true) && (
            <Button variant="outline" onPress={handleBack}>
              {backLabel}
            </Button>
          )}
          <Button
            onPress={workflow.isLastStep ? handleSubmit : handleNext}
            disabled={workflow.isSubmitting}
          >
            {workflow.isLastStep ? submitLabel : nextLabel}
          </Button>
        </XStack>
      </XStack>
    </YStack>
  );
}
