import type {
  DataGridWidgetDef,
  WidgetRendererProps,
  DataGridColumn,
  DataGridAction,
} from '@app/types';
import React, { useMemo, useCallback } from 'react';
import { YStack, Paragraph } from 'tamagui';

export function DataGridWidget({
  definition,
  screenContext,
}: WidgetRendererProps<DataGridWidgetDef>) {
  const rawData = screenContext.data[definition.dataSource];
  const data = Array.isArray(rawData)
    ? (rawData as Array<{ id: string | number } & Record<string, unknown>>)
    : [];
  const isLoading = screenContext.isLoading[definition.dataSource] || false;

  const columns: DataGridColumn<Record<string, unknown>>[] = useMemo(
    () =>
      definition.columns.map((col) => ({
        key: col.key,
        title: typeof col.title === 'string' ? col.title : col.title.defaultValue || col.title.key,
        width: col.width,
        minWidth: col.minWidth,
        sortable: col.sortable,
        filterable: col.filterable,
        align: col.align,
      })),
    [definition.columns]
  );

  const actions: DataGridAction<Record<string, unknown>>[] | undefined = useMemo(
    () =>
      definition.actions?.map((act) => ({
        id: act.id,
        label: typeof act.label === 'string' ? act.label : act.label.defaultValue || act.label.key,
        icon: act.icon,
        variant: act.variant,
        onPress: (row: Record<string, unknown>) => {
          if (act.link) {
            screenContext.executeLink(act.link);
          }
        },
      })),
    [definition.actions, screenContext.executeLink]
  );

  if (isLoading) {
    return (
      <YStack padding="$4" alignItems="center">
        <Paragraph color="$gray10">Loading...</Paragraph>
      </YStack>
    );
  }

  if (data.length === 0) {
    return (
      <YStack padding="$4" alignItems="center">
        <Paragraph color="$gray10">No data available</Paragraph>
      </YStack>
    );
  }

  // Simple table rendering - can be replaced with the full DataGrid component
  return (
    <YStack borderWidth={1} borderColor="$borderColor" borderRadius="$3" overflow="hidden">
      {/* Header */}
      <YStack flexDirection="row" backgroundColor="$gray3" padding="$3" gap="$2">
        {columns.map((col) => (
          <YStack key={String(col.key)} flex={1} minWidth={col.minWidth}>
            <Paragraph fontWeight="600" fontSize="$2">
              {col.title}
            </Paragraph>
          </YStack>
        ))}
      </YStack>
      {/* Rows */}
      {data.map((row, rowIndex) => (
        <YStack
          key={row.id ?? rowIndex}
          flexDirection="row"
          padding="$3"
          gap="$2"
          borderTopWidth={1}
          borderTopColor="$borderColor"
          backgroundColor={rowIndex % 2 === 0 ? 'transparent' : '$gray1'}
        >
          {columns.map((col) => (
            <YStack key={String(col.key)} flex={1}>
              <Paragraph fontSize="$2">{String(row[String(col.key)] ?? '')}</Paragraph>
            </YStack>
          ))}
        </YStack>
      ))}
    </YStack>
  );
}
