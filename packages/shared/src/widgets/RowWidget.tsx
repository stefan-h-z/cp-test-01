import type { RowWidgetDef, WidgetRendererProps } from '@app/types';
import React from 'react';
import { XStack } from 'tamagui';
import { useWidgetRegistry } from '../registry/WidgetRegistry';
import { WidgetTreeRenderer } from './WidgetTreeRenderer';

export function RowWidget({ definition, screenContext }: WidgetRendererProps<RowWidgetDef>) {
  const registry = useWidgetRegistry();

  return (
    <XStack
      flexWrap={definition.wrap !== false ? 'wrap' : 'nowrap'}
      gap={definition.style?.gap || '$3'}
      width="100%"
    >
      <WidgetTreeRenderer
        widgets={definition.children}
        screenContext={screenContext}
        registry={registry}
        useGrid={true}
      />
    </XStack>
  );
}
