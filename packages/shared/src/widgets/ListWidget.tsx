import type { ListWidgetDef, WidgetRendererProps } from '@app/types';
import React from 'react';
import { YStack, Paragraph, Separator } from 'tamagui';
import { useWidgetRegistry } from '../registry/WidgetRegistry';
import { WidgetTreeRenderer } from './WidgetTreeRenderer';

export function ListWidget({ definition, screenContext }: WidgetRendererProps<ListWidgetDef>) {
  const registry = useWidgetRegistry();
  const rawData = screenContext.data[definition.dataSource];
  const items = Array.isArray(rawData) ? rawData : [];

  if (items.length === 0 && definition.emptyMessage) {
    return (
      <YStack padding="$4" alignItems="center">
        <Paragraph color="$gray10">
          {screenContext.resolveString(definition.emptyMessage)}
        </Paragraph>
      </YStack>
    );
  }

  return (
    <YStack gap="$2">
      {items.map((item, index) => {
        // Inject item data into a per-item screen context
        const itemContext = {
          ...screenContext,
          data: { ...screenContext.data, __item: item, __index: index },
        };

        return (
          <React.Fragment key={item?.id ?? item?.key ?? index}>
            <WidgetTreeRenderer
              widgets={definition.itemTemplate}
              screenContext={itemContext}
              registry={registry}
              useGrid={false}
            />
            {definition.dividers && index < items.length - 1 && <Separator marginVertical="$1" />}
          </React.Fragment>
        );
      })}
    </YStack>
  );
}
