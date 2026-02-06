import type {
  QRScannerState,
  QRScanResult,
  QRScannerOptions,
  QRScannerStatus,
} from '@app/types';
import { useState, useCallback, useRef } from 'react';

const DEFAULT_OPTIONS: Required<QRScannerOptions> = {
  vibrate: true,
  playSound: false,
  autoClose: false,
  scanDelay: 1500,
  maxHistory: 10,
  formats: ['qr_code', 'aztec', 'data_matrix'],
};

export interface UseQRScannerLogicResult {
  /** Current scanner state */
  state: QRScannerState;
  /** Handle a successful scan */
  onScan: (content: string, format?: string) => void;
  /** Handle scan error */
  onError: (error: string) => void;
  /** Start scanning */
  startScanning: () => void;
  /** Stop scanning */
  stopScanning: () => void;
  /** Reset scanner to initial state */
  reset: () => void;
  /** Clear scan history */
  clearHistory: () => void;
  /** Set camera permission status */
  setPermission: (hasPermission: boolean) => void;
  /** Copy result to clipboard */
  copyToClipboard: () => Promise<boolean>;
  /** Check if content is a URL */
  isUrl: (content: string) => boolean;
  /** Format the timestamp for display */
  formatTimestamp: (timestamp: number) => string;
  /** Scanner options */
  options: Required<QRScannerOptions>;
}

/**
 * Shared hook for QR scanner business logic
 * Platform-specific implementations handle the actual camera/scanning
 */
export function useQRScannerLogic(
  userOptions: QRScannerOptions = {}
): UseQRScannerLogicResult {
  const options = { ...DEFAULT_OPTIONS, ...userOptions };
  const lastScanTime = useRef<number>(0);

  const [state, setState] = useState<QRScannerState>({
    status: 'idle',
    result: null,
    error: null,
    hasPermission: null,
    isActive: false,
    history: [],
  });

  const setPermission = useCallback((hasPermission: boolean) => {
    setState((prev) => ({ ...prev, hasPermission }));
  }, []);

  const startScanning = useCallback(() => {
    setState((prev) => ({
      ...prev,
      status: 'scanning',
      isActive: true,
      error: null,
    }));
  }, []);

  const stopScanning = useCallback(() => {
    setState((prev) => ({
      ...prev,
      status: prev.result ? 'success' : 'idle',
      isActive: false,
    }));
  }, []);

  const onScan = useCallback(
    (content: string, format?: string) => {
      const now = Date.now();

      // Prevent duplicate scans within scanDelay
      if (now - lastScanTime.current < options.scanDelay) {
        return;
      }
      lastScanTime.current = now;

      const result: QRScanResult = {
        content,
        format,
        timestamp: now,
      };

      // Vibrate on successful scan (if supported and enabled)
      if (options.vibrate && typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(100);
      }

      setState((prev) => {
        const newHistory = [result, ...prev.history].slice(0, options.maxHistory);
        return {
          ...prev,
          status: 'success',
          result,
          error: null,
          isActive: options.autoClose ? false : prev.isActive,
          history: newHistory,
        };
      });
    },
    [options.scanDelay, options.vibrate, options.autoClose, options.maxHistory]
  );

  const onError = useCallback((error: string) => {
    setState((prev) => ({
      ...prev,
      status: 'error',
      error,
      isActive: false,
    }));
  }, []);

  const reset = useCallback(() => {
    setState((prev) => ({
      ...prev,
      status: 'idle',
      result: null,
      error: null,
      isActive: false,
    }));
    lastScanTime.current = 0;
  }, []);

  const clearHistory = useCallback(() => {
    setState((prev) => ({
      ...prev,
      history: [],
    }));
  }, []);

  const copyToClipboard = useCallback(async (): Promise<boolean> => {
    if (!state.result?.content) return false;

    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(state.result.content);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, [state.result?.content]);

  const isUrl = useCallback((content: string): boolean => {
    try {
      const url = new URL(content);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
      return false;
    }
  }, []);

  const formatTimestamp = useCallback((timestamp: number): string => {
    return new Date(timestamp).toLocaleString();
  }, []);

  return {
    state,
    onScan,
    onError,
    startScanning,
    stopScanning,
    reset,
    clearHistory,
    setPermission,
    copyToClipboard,
    isUrl,
    formatTimestamp,
    options,
  };
}
