import type { BadgeWidgetDef, WidgetRendererProps } from '@app/types';
import React from 'react';
import { XStack, Paragraph } from 'tamagui';

const variantColors: Record<string, { bg: string; text: string }> = {
  default: { bg: '$gray4', text: '$gray11' },
  primary: { bg: '$blue4', text: '$blue11' },
  success: { bg: '$green4', text: '$green11' },
  warning: { bg: '$yellow4', text: '$yellow11' },
  error: { bg: '$red4', text: '$red11' },
  info: { bg: '$blue4', text: '$blue11' },
};

export function BadgeWidget({ definition, screenContext }: WidgetRendererProps<BadgeWidgetDef>) {
  const text = screenContext.resolveString(definition.label);
  const colors = variantColors[definition.variant || 'default'] || variantColors.default;

  return (
    <XStack
      backgroundColor={colors.bg}
      paddingHorizontal="$3"
      paddingVertical="$1"
      borderRadius="$10"
      alignSelf="flex-start"
    >
      <Paragraph fontSize="$2" fontWeight="600" color={colors.text}>
        {text}
      </Paragraph>
    </XStack>
  );
}
