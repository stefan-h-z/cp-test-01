import type { ScreenComponent, LayoutComponent } from '@app/types';
import React from 'react';

/**
 * Registry for mapping screen/layout names from config to actual React components.
 * This allows the config to reference screens by string name which are then
 * resolved to actual components at runtime.
 */
export class ComponentRegistry {
  private screens: Map<string, ScreenComponent> = new Map();
  private layouts: Map<string, LayoutComponent> = new Map();

  /**
   * Register a screen component
   */
  registerScreen(name: string, component: ScreenComponent): void {
    this.screens.set(name, component);
  }

  /**
   * Register multiple screens at once
   */
  registerScreens(screens: Record<string, ScreenComponent>): void {
    Object.entries(screens).forEach(([name, component]) => {
      this.registerScreen(name, component);
    });
  }

  /**
   * Get a screen component by name
   */
  getScreen(name: string): ScreenComponent | undefined {
    return this.screens.get(name);
  }

  /**
   * Resolve a screen component by name, throwing if not found
   */
  resolveScreen(name: string): ScreenComponent {
    const screen = this.screens.get(name);
    if (!screen) {
      throw new Error(`Screen "${name}" not found in registry. Did you forget to register it?`);
    }
    return screen;
  }

  /**
   * Check if a screen is registered
   */
  hasScreen(name: string): boolean {
    return this.screens.has(name);
  }

  /**
   * Register a layout component
   */
  registerLayout(name: string, component: LayoutComponent): void {
    this.layouts.set(name, component);
  }

  /**
   * Register multiple layouts at once
   */
  registerLayouts(layouts: Record<string, LayoutComponent>): void {
    Object.entries(layouts).forEach(([name, component]) => {
      this.registerLayout(name, component);
    });
  }

  /**
   * Get a layout component by name
   */
  getLayout(name: string): LayoutComponent | undefined {
    return this.layouts.get(name);
  }

  /**
   * Resolve a layout component by name, throwing if not found
   */
  resolveLayout(name: string): LayoutComponent {
    const layout = this.layouts.get(name);
    if (!layout) {
      throw new Error(`Layout "${name}" not found in registry. Did you forget to register it?`);
    }
    return layout;
  }

  /**
   * Check if a layout is registered
   */
  hasLayout(name: string): boolean {
    return this.layouts.has(name);
  }

  /**
   * Get all registered screen names
   */
  getScreenNames(): string[] {
    return Array.from(this.screens.keys());
  }

  /**
   * Get all registered layout names
   */
  getLayoutNames(): string[] {
    return Array.from(this.layouts.keys());
  }

  /**
   * Clear all registrations
   */
  clear(): void {
    this.screens.clear();
    this.layouts.clear();
  }
}

// Create React context for the registry
const RegistryContext = React.createContext<ComponentRegistry | null>(null);

interface RegistryProviderProps {
  children: React.ReactNode;
  registry: ComponentRegistry;
}

/**
 * Provider component for the component registry
 */
export function RegistryProvider({ children, registry }: RegistryProviderProps) {
  return React.createElement(RegistryContext.Provider, { value: registry }, children);
}

/**
 * Hook to access the component registry
 */
export function useComponentRegistry(): ComponentRegistry {
  const registry = React.useContext(RegistryContext);
  if (!registry) {
    throw new Error('useComponentRegistry must be used within a RegistryProvider');
  }
  return registry;
}

/**
 * Hook to get a screen component by name
 */
export function useScreen(name: string): ScreenComponent | undefined {
  const registry = useComponentRegistry();
  return registry.getScreen(name);
}

/**
 * Hook to get a layout component by name
 */
export function useLayout(name: string): LayoutComponent | undefined {
  const registry = useComponentRegistry();
  return registry.getLayout(name);
}

// Default singleton instance
let defaultRegistry: ComponentRegistry | null = null;

/**
 * Get or create the default registry instance
 */
export function getDefaultRegistry(): ComponentRegistry {
  if (!defaultRegistry) {
    defaultRegistry = new ComponentRegistry();
  }
  return defaultRegistry;
}

/**
 * Reset the default registry (useful for testing)
 */
export function resetDefaultRegistry(): void {
  defaultRegistry?.clear();
  defaultRegistry = null;
}
