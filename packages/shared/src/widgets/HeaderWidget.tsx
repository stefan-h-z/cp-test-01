import type { HeaderWidgetDef, WidgetRendererProps } from '@app/types';
import React from 'react';
import { H1, H2, H3, H4, H5 } from 'tamagui';

const headingComponents = { 1: H1, 2: H2, 3: H3, 4: H4, 5: H5 } as const;

export function HeaderWidget({ definition, screenContext }: WidgetRendererProps<HeaderWidgetDef>) {
  const level = definition.level || 1;
  const HeadingComponent = headingComponents[level] || H1;
  const text = screenContext.resolveString(definition.label);

  return <HeadingComponent>{text}</HeadingComponent>;
}
