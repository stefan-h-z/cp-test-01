import React from 'react';
import { YStack, Separator, Card } from 'tamagui';
import type { WorkflowStepInfo, StepStatus } from './WorkflowStepper';
import { WorkflowStepper } from './WorkflowStepper';

export interface WorkflowContainerProps {
  steps: WorkflowStepInfo[];
  currentStep: number;
  getStepStatus: (index: number) => StepStatus;
  canNavigateToStep?: (index: number) => boolean;
  onStepPress?: (index: number) => void;
  stepperVariant?: 'horizontal' | 'vertical' | 'compact';
  children: React.ReactNode;
}

export function WorkflowContainer({
  steps,
  currentStep,
  getStepStatus,
  canNavigateToStep,
  onStepPress,
  stepperVariant = 'horizontal',
  children,
}: WorkflowContainerProps) {
  return (
    <Card bordered padding="$4" width="100%">
      <YStack gap="$4">
        <WorkflowStepper
          steps={steps}
          currentStep={currentStep}
          getStepStatus={getStepStatus}
          onStepPress={onStepPress}
          canNavigateToStep={canNavigateToStep}
          variant={stepperVariant}
        />
        <Separator />
        {children}
      </YStack>
    </Card>
  );
}
