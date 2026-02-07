import type { ContainerWidgetDef, WidgetRendererProps } from '@app/types';
import React from 'react';
import { YStack, XStack } from 'tamagui';
import { useWidgetRegistry } from '../registry/WidgetRegistry';
import { WidgetTreeRenderer } from './WidgetTreeRenderer';

export function ContainerWidget({
  definition,
  screenContext,
}: WidgetRendererProps<ContainerWidgetDef>) {
  const registry = useWidgetRegistry();
  const Stack = definition.direction === 'horizontal' ? XStack : YStack;

  return (
    <Stack
      gap={definition.style?.gap || '$3'}
      padding={definition.style?.padding}
      backgroundColor={definition.style?.backgroundColor}
      borderRadius={
        definition.style?.borderRadius ? Number(definition.style.borderRadius) : undefined
      }
    >
      <WidgetTreeRenderer
        widgets={definition.children}
        screenContext={screenContext}
        registry={registry}
        useGrid={definition.direction !== 'horizontal'}
      />
    </Stack>
  );
}
