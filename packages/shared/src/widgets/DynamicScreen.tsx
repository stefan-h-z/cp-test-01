import type { ScreenDefinition } from '@app/types';
import React from 'react';
import { YStack, ScrollView, Paragraph, H2 } from 'tamagui';
import { useWidgetRegistry } from '../registry/WidgetRegistry';
import { useScreenContext } from './useScreenContext';
import { WidgetTreeRenderer } from './WidgetTreeRenderer';

interface DynamicScreenProps {
  /** The screen definition from config */
  screenDef: ScreenDefinition;
  /** Remote app config for link resolution */
  config: import('@app/types').RemoteAppConfig | null;
  /** Navigation function */
  navigate: (path: string) => void;
  /** Go back function */
  goBack: () => void;
  /** Optional action dependencies (logout, toggleTheme, etc.) */
  actionDeps?: import('./actionExecutor').ActionExecutorDeps;
  /** Platform-injectable URL opener. Falls back to window.open on web. */
  openUrl?: (url: string, external: boolean) => void;
}

export function DynamicScreen({
  screenDef,
  config,
  navigate,
  goBack,
  actionDeps,
  openUrl,
}: DynamicScreenProps) {
  const registry = useWidgetRegistry();

  const screenContext = useScreenContext({
    screen: screenDef,
    config,
    navigate,
    goBack,
    actionDeps,
    openUrl,
  });

  const scrollable = screenDef.style?.scrollable !== false;
  const content = (
    <YStack
      padding={screenDef.style?.padding || '$4'}
      gap={screenDef.style?.gap || '$3'}
      maxWidth={screenDef.style?.maxWidth || 1200}
      width="100%"
      alignSelf="center"
      backgroundColor={screenDef.style?.backgroundColor}
    >
      <WidgetTreeRenderer
        widgets={screenDef.components}
        screenContext={screenContext}
        registry={registry}
      />
    </YStack>
  );

  if (scrollable) {
    return <ScrollView flex={1}>{content}</ScrollView>;
  }

  return content;
}

/**
 * Placeholder shown when a screen code cannot be found in config.
 */
export function ScreenNotFound({ screenCode }: { screenCode: string }) {
  return (
    <YStack padding="$6" alignItems="center" justifyContent="center" flex={1} gap="$3">
      <H2>Screen not found</H2>
      <Paragraph color="$gray10">No screen configuration found for code: "{screenCode}"</Paragraph>
    </YStack>
  );
}
