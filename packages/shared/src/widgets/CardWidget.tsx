import type { CardWidgetDef, WidgetRendererProps } from '@app/types';
import React, { useCallback } from 'react';
import { YStack, XStack, H4, Paragraph, Card } from 'tamagui';
import { useWidgetRegistry } from '../registry/WidgetRegistry';
import { WidgetTreeRenderer } from './WidgetTreeRenderer';

export function CardWidget({ definition, screenContext }: WidgetRendererProps<CardWidgetDef>) {
  const registry = useWidgetRegistry();

  const handlePress = useCallback(() => {
    if (definition.link) {
      screenContext.executeLink(definition.link);
    }
  }, [definition.link, screenContext.executeLink]);

  const variantProps = getCardVariantProps(definition.variant);

  return (
    <Card
      bordered
      padding="$4"
      {...variantProps}
      {...(definition.link
        ? {
            pressStyle: { scale: 0.98, opacity: 0.9 },
            cursor: 'pointer',
            onPress: handlePress,
          }
        : {})}
    >
      {/* Image */}
      {definition.image && (
        <Card.Header padded={false} paddingBottom="$3">
          <WidgetTreeRenderer
            widgets={[definition.image]}
            screenContext={screenContext}
            registry={registry}
            useGrid={false}
          />
        </Card.Header>
      )}

      {/* Header text */}
      {definition.header && (
        <H4 marginBottom="$1">{screenContext.resolveString(definition.header)}</H4>
      )}

      {/* Description */}
      {definition.description && (
        <Paragraph color="$gray10" marginBottom="$3">
          {screenContext.resolveString(definition.description)}
        </Paragraph>
      )}

      {/* Nested children */}
      {definition.children && definition.children.length > 0 && (
        <YStack marginBottom="$2">
          <WidgetTreeRenderer
            widgets={definition.children}
            screenContext={screenContext}
            registry={registry}
            useGrid={false}
          />
        </YStack>
      )}

      {/* Buttons */}
      {definition.buttons && definition.buttons.length > 0 && (
        <Card.Footer>
          <XStack gap="$2" flexWrap="wrap">
            <WidgetTreeRenderer
              widgets={definition.buttons}
              screenContext={screenContext}
              registry={registry}
              useGrid={false}
            />
          </XStack>
        </Card.Footer>
      )}
    </Card>
  );
}

function getCardVariantProps(variant?: string): Record<string, unknown> {
  switch (variant) {
    case 'elevated':
      return { elevate: true };
    case 'outlined':
      return { borderWidth: 1, borderColor: '$borderColor' };
    case 'filled':
      return { backgroundColor: '$gray2' };
    default:
      return { elevate: true };
  }
}
