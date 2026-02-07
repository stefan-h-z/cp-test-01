import type { SpacerWidgetDef, WidgetRendererProps } from '@app/types';
import React from 'react';
import { YStack } from 'tamagui';

export function SpacerWidget({ definition }: WidgetRendererProps<SpacerWidgetDef>) {
  const size = definition.size || '$4';
  return <YStack height={size} />;
}
