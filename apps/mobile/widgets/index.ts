import type { WidgetRegistry } from '@app/shared';
import { QRScannerWidget } from './QRScannerWidget';

/**
 * Register mobile-specific widget renderers.
 */
export function registerMobileWidgets(registry: WidgetRegistry): void {
  registry.registerWidget('QRScanner', QRScannerWidget);
}
