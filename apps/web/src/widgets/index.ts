import type { WidgetRegistry } from '@app/shared';
import { QRScannerWidget } from './QRScannerWidget';

/**
 * Register web-specific widget renderers.
 */
export function registerWebWidgets(registry: WidgetRegistry): void {
  registry.registerWidget('QRScanner', QRScannerWidget);
}
