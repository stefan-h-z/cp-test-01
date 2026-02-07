import type { WidgetDefinition, WidgetRenderer } from '@app/types';
import React from 'react';

/**
 * Registry for mapping widget type names to renderer components.
 * Used by DynamicScreen to resolve widget definitions to actual React components.
 */
export class WidgetRegistry {
  private widgets: Map<string, WidgetRenderer> = new Map();

  registerWidget<T extends WidgetDefinition>(type: string, renderer: WidgetRenderer<T>): void {
    this.widgets.set(type, renderer as WidgetRenderer);
  }

  registerWidgets(widgets: Record<string, WidgetRenderer>): void {
    Object.entries(widgets).forEach(([type, renderer]) => {
      this.registerWidget(type, renderer);
    });
  }

  getWidget(type: string): WidgetRenderer | undefined {
    return this.widgets.get(type);
  }

  resolveWidget(type: string): WidgetRenderer {
    const renderer = this.widgets.get(type);
    if (!renderer) {
      throw new Error(
        `Widget type "${type}" not found in registry. Did you forget to register it?`
      );
    }
    return renderer;
  }

  hasWidget(type: string): boolean {
    return this.widgets.has(type);
  }

  getWidgetTypes(): string[] {
    return Array.from(this.widgets.keys());
  }

  clear(): void {
    this.widgets.clear();
  }
}

// React context
const WidgetRegistryContext = React.createContext<WidgetRegistry | null>(null);

interface WidgetRegistryProviderProps {
  children: React.ReactNode;
  registry: WidgetRegistry;
}

export function WidgetRegistryProvider({ children, registry }: WidgetRegistryProviderProps) {
  return React.createElement(WidgetRegistryContext.Provider, { value: registry }, children);
}

export function useWidgetRegistry(): WidgetRegistry {
  const registry = React.useContext(WidgetRegistryContext);
  if (!registry) {
    throw new Error('useWidgetRegistry must be used within a WidgetRegistryProvider');
  }
  return registry;
}

export function useWidget(type: string): WidgetRenderer | undefined {
  const registry = useWidgetRegistry();
  return registry.getWidget(type);
}
