import type {
  WidgetDefinition,
  ScreenContext,
  WidgetRenderer as WidgetRendererType,
  VisibilityCondition,
} from '@app/types';
import React, { Component, useCallback } from 'react';
import type { WidgetRegistry } from '../registry/WidgetRegistry';
import { GridRow, GridColumn } from './GridLayout';

/** Lightweight error boundary that catches per-widget render errors. */
class WidgetErrorBoundary extends Component<
  { widgetType: string; children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { widgetType: string; children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error(`Widget "${this.props.widgetType}" render error:`, error);
  }

  render() {
    if (this.state.hasError) {
      return null;
    }
    return this.props.children;
  }
}

interface WidgetTreeRendererProps {
  widgets: WidgetDefinition[];
  screenContext: ScreenContext;
  registry: WidgetRegistry;
  /** Whether to wrap children in a GridRow */
  useGrid?: boolean;
}

function checkVisibility(
  widget: WidgetDefinition,
  isFeatureEnabled: (flag: string) => boolean
): boolean {
  if (widget.visible === false) return false;
  if (widget.featureFlag && !isFeatureEnabled(widget.featureFlag)) return false;
  if (typeof widget.visible === 'object') {
    const condition = widget.visible as VisibilityCondition;
    if (condition.featureFlag && !isFeatureEnabled(condition.featureFlag)) return false;
  }
  return true;
}

export function WidgetTreeRenderer({
  widgets,
  screenContext,
  registry,
  useGrid = true,
}: WidgetTreeRendererProps) {
  // Simple feature flag check using screen context data
  const isFeatureEnabled = useCallback(
    (flag: string): boolean => {
      const features = screenContext.data['__features'] as Record<string, boolean> | undefined;
      return features ? features[flag] !== false : false;
    },
    [screenContext.data]
  );

  const renderedWidgets = widgets.map((widget, index) => {
    if (!checkVisibility(widget, isFeatureEnabled)) return null;

    const Renderer: WidgetRendererType | undefined = registry.getWidget(widget.type);
    if (!Renderer) {
      console.warn(`No renderer for widget type: ${widget.type}`);
      return null;
    }

    const key = widget.id || `widget-${index}`;
    const element = (
      <WidgetErrorBoundary key={key} widgetType={widget.type}>
        <Renderer definition={widget} screenContext={screenContext} />
      </WidgetErrorBoundary>
    );

    if (useGrid) {
      return (
        <GridColumn key={key} width={widget.width} responsiveWidth={widget.responsiveWidth}>
          {element}
        </GridColumn>
      );
    }

    return element;
  });

  if (useGrid) {
    return <GridRow gap="$2">{renderedWidgets}</GridRow>;
  }

  return <>{renderedWidgets}</>;
}
