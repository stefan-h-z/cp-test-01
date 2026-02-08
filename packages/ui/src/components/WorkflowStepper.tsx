import { Check, AlertCircle } from '@tamagui/lucide-icons';
import * as Icons from '@tamagui/lucide-icons';
import React from 'react';
import { XStack, YStack, Text, styled, Stack } from 'tamagui';

export interface WorkflowStepInfo {
  title: string;
  description?: string;
  icon?: string;
}

export type StepStatus = 'pending' | 'active' | 'completed' | 'error';

export interface WorkflowStepperProps {
  steps: WorkflowStepInfo[];
  currentStep: number;
  getStepStatus: (index: number) => StepStatus;
  onStepPress?: (index: number) => void;
  canNavigateToStep?: (index: number) => boolean;
  variant?: 'horizontal' | 'vertical' | 'compact';
}

const StepCircle = styled(Stack, {
  width: 36,
  height: 36,
  borderRadius: 18,
  alignItems: 'center',
  justifyContent: 'center',
  borderWidth: 2,

  variants: {
    status: {
      pending: {
        borderColor: '$gray7',
        backgroundColor: 'transparent',
      },
      active: {
        borderColor: '$blue9',
        backgroundColor: '$blue9',
      },
      completed: {
        borderColor: '$green9',
        backgroundColor: '$green9',
      },
      error: {
        borderColor: '$red9',
        backgroundColor: '$red9',
      },
    },
  } as const,

  defaultVariants: {
    status: 'pending',
  },
});

const ConnectorLine = styled(Stack, {
  height: 2,
  flex: 1,
  marginHorizontal: '$2',

  variants: {
    completed: {
      true: {
        backgroundColor: '$green9',
      },
      false: {
        backgroundColor: '$gray5',
      },
    },
  } as const,

  defaultVariants: {
    completed: false,
  },
});

const VerticalConnector = styled(Stack, {
  width: 2,
  height: 24,
  marginLeft: 17,

  variants: {
    completed: {
      true: {
        backgroundColor: '$green9',
      },
      false: {
        backgroundColor: '$gray5',
      },
    },
  } as const,

  defaultVariants: {
    completed: false,
  },
});

const ProgressBar = styled(Stack, {
  height: 4,
  borderRadius: 2,
  backgroundColor: '$blue9',
});

const ProgressTrack = styled(Stack, {
  height: 4,
  borderRadius: 2,
  backgroundColor: '$gray4',
  width: '100%',
  overflow: 'hidden',
});

function getStepIcon(status: StepStatus, icon?: string) {
  if (status === 'completed') {
    return <Check size={18} color="white" />;
  }
  if (status === 'error') {
    return <AlertCircle size={18} color="white" />;
  }
  if (icon) {
    const IconComponent = (
      Icons as Record<string, React.ComponentType<{ size: number; color: string }>>
    )[icon];
    if (IconComponent) {
      return <IconComponent size={18} color={status === 'active' ? 'white' : '$gray9'} />;
    }
  }
  return null;
}

function HorizontalStepper({
  steps,
  currentStep,
  getStepStatus,
  onStepPress,
  canNavigateToStep,
}: WorkflowStepperProps) {
  return (
    <YStack gap="$2">
      <XStack alignItems="center" width="100%">
        {steps.map((step, index) => {
          const status = getStepStatus(index);
          const isClickable = canNavigateToStep?.(index) && onStepPress;
          const icon = getStepIcon(status, step.icon);

          return (
            <React.Fragment key={index}>
              <YStack alignItems="center" gap="$1">
                <StepCircle
                  status={status}
                  cursor={isClickable ? 'pointer' : 'default'}
                  onPress={isClickable ? () => onStepPress!(index) : undefined}
                  hoverStyle={isClickable ? { opacity: 0.8 } : undefined}
                >
                  {icon || (
                    <Text
                      fontSize="$2"
                      fontWeight="600"
                      color={
                        status === 'active' || status === 'completed' || status === 'error'
                          ? 'white'
                          : '$gray9'
                      }
                    >
                      {index + 1}
                    </Text>
                  )}
                </StepCircle>
              </YStack>
              {index < steps.length - 1 && (
                <ConnectorLine completed={getStepStatus(index) === 'completed'} />
              )}
            </React.Fragment>
          );
        })}
      </XStack>
      <XStack width="100%">
        {steps.map((step, index) => {
          const status = getStepStatus(index);
          return (
            <YStack key={index} flex={1} alignItems="center" paddingHorizontal="$1">
              <Text
                fontSize="$2"
                fontWeight={status === 'active' ? '600' : '400'}
                color={status === 'active' ? '$color' : '$gray9'}
                textAlign="center"
                numberOfLines={1}
              >
                {step.title}
              </Text>
            </YStack>
          );
        })}
      </XStack>
    </YStack>
  );
}

function VerticalStepper({
  steps,
  currentStep,
  getStepStatus,
  onStepPress,
  canNavigateToStep,
}: WorkflowStepperProps) {
  return (
    <YStack>
      {steps.map((step, index) => {
        const status = getStepStatus(index);
        const isClickable = canNavigateToStep?.(index) && onStepPress;
        const icon = getStepIcon(status, step.icon);

        return (
          <React.Fragment key={index}>
            <XStack
              alignItems="center"
              gap="$3"
              cursor={isClickable ? 'pointer' : 'default'}
              onPress={isClickable ? () => onStepPress!(index) : undefined}
              hoverStyle={isClickable ? { opacity: 0.8 } : undefined}
              paddingVertical="$1"
            >
              <StepCircle status={status}>
                {icon || (
                  <Text
                    fontSize="$2"
                    fontWeight="600"
                    color={
                      status === 'active' || status === 'completed' || status === 'error'
                        ? 'white'
                        : '$gray9'
                    }
                  >
                    {index + 1}
                  </Text>
                )}
              </StepCircle>
              <YStack flex={1}>
                <Text
                  fontSize="$3"
                  fontWeight={status === 'active' ? '600' : '400'}
                  color={status === 'active' ? '$color' : '$gray9'}
                >
                  {step.title}
                </Text>
                {step.description && (
                  <Text fontSize="$1" color="$gray9">
                    {step.description}
                  </Text>
                )}
              </YStack>
            </XStack>
            {index < steps.length - 1 && (
              <VerticalConnector completed={getStepStatus(index) === 'completed'} />
            )}
          </React.Fragment>
        );
      })}
    </YStack>
  );
}

function CompactStepper({ steps, currentStep, getStepStatus }: WorkflowStepperProps) {
  const progress = steps.length > 1 ? currentStep / (steps.length - 1) : 0;

  return (
    <YStack gap="$2">
      <XStack justifyContent="space-between" alignItems="center">
        <Text fontSize="$3" fontWeight="600" color="$color">
          {steps[currentStep]?.title}
        </Text>
        <Text fontSize="$2" color="$gray9">
          {currentStep + 1} / {steps.length}
        </Text>
      </XStack>
      <ProgressTrack>
        <ProgressBar width={`${Math.max(progress * 100, 5)}%`} animation="fast" />
      </ProgressTrack>
    </YStack>
  );
}

export function WorkflowStepper(props: WorkflowStepperProps) {
  const { variant = 'horizontal' } = props;

  switch (variant) {
    case 'vertical':
      return <VerticalStepper {...props} />;
    case 'compact':
      return <CompactStepper {...props} />;
    default:
      return <HorizontalStepper {...props} />;
  }
}
