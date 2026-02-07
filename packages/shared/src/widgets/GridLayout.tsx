import type { ColumnWidth, ResponsiveWidth } from '@app/types';
import React from 'react';
import { XStack, YStack } from 'tamagui';

interface GridRowProps {
  children: React.ReactNode;
  gap?: number | string;
}

export function GridRow({ children, gap }: GridRowProps) {
  return (
    <XStack flexWrap="wrap" width="100%" gap={gap}>
      {children}
    </XStack>
  );
}

interface GridColumnProps {
  children: React.ReactNode;
  width?: ColumnWidth;
  responsiveWidth?: ResponsiveWidth;
}

export function GridColumn({ children, width, responsiveWidth }: GridColumnProps) {
  const columns = width || 12;
  const baseWidth = `${(columns / 12) * 100}%` as const;

  const responsiveProps: Record<string, { width?: string }> = {};

  if (responsiveWidth?.xs) {
    responsiveProps['$xs'] = { width: `${(responsiveWidth.xs / 12) * 100}%` };
  }
  if (responsiveWidth?.sm) {
    responsiveProps['$sm'] = { width: `${(responsiveWidth.sm / 12) * 100}%` };
  }
  if (responsiveWidth?.md) {
    responsiveProps['$md'] = { width: `${(responsiveWidth.md / 12) * 100}%` };
  }
  if (responsiveWidth?.lg) {
    responsiveProps['$lg'] = { width: `${(responsiveWidth.lg / 12) * 100}%` };
  }

  return (
    <YStack width={baseWidth} padding="$2" {...responsiveProps}>
      {children}
    </YStack>
  );
}
