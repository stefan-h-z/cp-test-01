import type { IconWidgetDef, WidgetRendererProps } from '@app/types';
import React from 'react';
import { YStack, Paragraph } from 'tamagui';

export function IconWidget({ definition }: WidgetRendererProps<IconWidgetDef>) {
  // Render icon name as text fallback - platform-specific implementations
  // can override this with actual icon libraries
  return (
    <YStack alignItems="center" justifyContent="center">
      <Paragraph fontSize={definition.size || 24} color={definition.color || '$color'}>
        {definition.name}
      </Paragraph>
    </YStack>
  );
}
