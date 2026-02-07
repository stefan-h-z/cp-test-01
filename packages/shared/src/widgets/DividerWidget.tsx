import type { DividerWidgetDef, WidgetRendererProps } from '@app/types';
import React from 'react';
import { Separator } from 'tamagui';

export function DividerWidget({ definition }: WidgetRendererProps<DividerWidgetDef>) {
  return (
    <Separator
      borderColor={definition.color || '$borderColor'}
      borderWidth={definition.thickness || 1}
      marginVertical="$2"
    />
  );
}
