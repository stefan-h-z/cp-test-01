import type { TextWidgetDef, WidgetRendererProps } from '@app/types';
import React from 'react';
import { Paragraph } from 'tamagui';

const sizeMap = {
  xs: '$2',
  sm: '$3',
  md: '$4',
  lg: '$5',
  xl: '$6',
} as const;

export function TextWidget({ definition, screenContext }: WidgetRendererProps<TextWidgetDef>) {
  const text = screenContext.resolveString(definition.label);
  const fontSize = sizeMap[definition.size || 'md'];

  return (
    <Paragraph
      fontSize={fontSize}
      color={definition.muted ? '$gray10' : definition.color || '$color'}
      textAlign={definition.align || 'left'}
    >
      {text}
    </Paragraph>
  );
}
