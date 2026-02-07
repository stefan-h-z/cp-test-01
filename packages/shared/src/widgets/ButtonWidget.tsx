import type { ButtonWidgetDef, WidgetRendererProps } from '@app/types';
import React, { useCallback } from 'react';
import { Button } from 'tamagui';

export function ButtonWidget({ definition, screenContext }: WidgetRendererProps<ButtonWidgetDef>) {
  const text = screenContext.resolveString(definition.label);

  const handlePress = useCallback(() => {
    if (definition.link) {
      screenContext.executeLink(definition.link);
    }
  }, [definition.link, screenContext.executeLink]);

  const variantProps = getVariantProps(definition.variant);
  const sizeProps = getSizeProps(definition.size);

  return (
    <Button
      onPress={handlePress}
      width={definition.fullWidth ? '100%' : undefined}
      {...variantProps}
      {...sizeProps}
    >
      {text}
    </Button>
  );
}

function getVariantProps(variant?: string): Record<string, unknown> {
  switch (variant) {
    case 'primary':
      return { backgroundColor: '$blue9', color: 'white' };
    case 'secondary':
      return { backgroundColor: '$gray4', color: '$color' };
    case 'outline':
      return { backgroundColor: 'transparent', borderWidth: 1, borderColor: '$borderColor' };
    case 'ghost':
      return { backgroundColor: 'transparent', color: '$color' };
    case 'destructive':
      return { backgroundColor: '$red9', color: 'white' };
    case 'success':
      return { backgroundColor: '$green9', color: 'white' };
    default:
      return { backgroundColor: '$blue9', color: 'white' };
  }
}

function getSizeProps(size?: string): Record<string, unknown> {
  switch (size) {
    case 'xs':
      return { size: '$2', fontSize: '$1' };
    case 'sm':
      return { size: '$3', fontSize: '$2' };
    case 'lg':
      return { size: '$5', fontSize: '$5' };
    case 'xl':
      return { size: '$6', fontSize: '$6' };
    default:
      return { size: '$4', fontSize: '$3' };
  }
}
