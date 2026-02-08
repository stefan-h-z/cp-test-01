import React from 'react';
import { YStack, H4, Paragraph } from 'tamagui';

export interface WorkflowStepProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
}

export function WorkflowStep({ title, description, children }: WorkflowStepProps) {
  return (
    <YStack gap="$4" width="100%">
      {(title || description) && (
        <YStack gap="$1">
          {title && <H4>{title}</H4>}
          {description && (
            <Paragraph color="$gray10" fontSize="$3">
              {description}
            </Paragraph>
          )}
        </YStack>
      )}
      {children}
    </YStack>
  );
}
