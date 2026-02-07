import type { ImageWidgetDef, WidgetRendererProps } from '@app/types';
import React from 'react';
import { Image, YStack } from 'tamagui';

export function ImageWidget({ definition }: WidgetRendererProps<ImageWidgetDef>) {
  return (
    <YStack>
      <Image
        source={{ uri: definition.url }}
        alt={definition.alt || ''}
        width="100%"
        height={definition.height ? Number(definition.height) : 200}
        objectFit={(definition.resizeMode || 'cover') as 'cover' | 'contain'}
        borderRadius={definition.borderRadius ? Number(definition.borderRadius) : 0}
      />
    </YStack>
  );
}
