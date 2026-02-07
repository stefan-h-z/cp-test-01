export { GridRow, GridColumn } from './GridLayout';
export { WidgetTreeRenderer } from './WidgetTreeRenderer';
export { DynamicScreen, ScreenNotFound } from './DynamicScreen';
export { useScreenContext } from './useScreenContext';
export { createActionExecutor, type ActionExecutorDeps } from './actionExecutor';

import type { WidgetRegistry } from '../registry/WidgetRegistry';
import { BadgeWidget } from './BadgeWidget';
import { ButtonWidget } from './ButtonWidget';
import { CardWidget } from './CardWidget';
import { ContainerWidget } from './ContainerWidget';
import { RowWidget } from './RowWidget';
import { ListWidget } from './ListWidget';
import { DataGridWidget } from './DataGridWidget';
import { DividerWidget } from './DividerWidget';
import { FormFieldWidget } from './FormFieldWidget';
import { HeaderWidget } from './HeaderWidget';
import { IconWidget } from './IconWidget';
import { ImageWidget } from './ImageWidget';
import { SpacerWidget } from './SpacerWidget';
import { TextWidget } from './TextWidget';

export {
  HeaderWidget,
  TextWidget,
  CardWidget,
  ButtonWidget,
  ImageWidget,
  SpacerWidget,
  DividerWidget,
  IconWidget,
  BadgeWidget,
  ContainerWidget,
  RowWidget,
  ListWidget,
  DataGridWidget,
  FormFieldWidget,
};

/**
 * Register all shared (platform-agnostic) widget renderers.
 * Platform-specific widgets (e.g., QRScanner) should be registered separately.
 */
export function registerDefaultWidgets(registry: WidgetRegistry): void {
  registry.registerWidget('Header', HeaderWidget);
  registry.registerWidget('Text', TextWidget);
  registry.registerWidget('Card', CardWidget);
  registry.registerWidget('Button', ButtonWidget);
  registry.registerWidget('Image', ImageWidget);
  registry.registerWidget('Spacer', SpacerWidget);
  registry.registerWidget('Divider', DividerWidget);
  registry.registerWidget('Icon', IconWidget);
  registry.registerWidget('Badge', BadgeWidget);
  registry.registerWidget('Container', ContainerWidget);
  registry.registerWidget('Row', RowWidget);
  registry.registerWidget('List', ListWidget);
  registry.registerWidget('DataGrid', DataGridWidget);
  registry.registerWidget('FormField', FormFieldWidget);
}
