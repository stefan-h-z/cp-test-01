import { useState, useEffect, useCallback } from 'react';
import { Platform } from 'react-native';

export interface NetworkStatus {
  isOnline: boolean;
  isOffline: boolean;
  type: 'wifi' | 'cellular' | 'ethernet' | 'unknown' | 'none';
  effectiveType?: 'slow-2g' | '2g' | '3g' | '4g';
}

// For web, we use the Navigator API
function useWebNetworkStatus(): NetworkStatus {
  const [status, setStatus] = useState<NetworkStatus>(() => {
    if (typeof navigator !== 'undefined') {
      const connection = (navigator as Navigator & { connection?: { effectiveType?: string } })
        .connection;
      return {
        isOnline: navigator.onLine,
        isOffline: !navigator.onLine,
        type: 'unknown',
        effectiveType: connection?.effectiveType as NetworkStatus['effectiveType'],
      };
    }
    return { isOnline: true, isOffline: false, type: 'unknown' };
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleOnline = () => {
      setStatus((prev) => ({ ...prev, isOnline: true, isOffline: false }));
    };

    const handleOffline = () => {
      setStatus((prev) => ({ ...prev, isOnline: false, isOffline: true }));
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return status;
}

// Hook for native network status
function useNativeNetworkStatus(): NetworkStatus {
  // For native, we'll need to use @react-native-community/netinfo
  // This is a placeholder that assumes online - the actual implementation
  // would require the netinfo package to be installed
  const [status, setStatus] = useState<NetworkStatus>({
    isOnline: true,
    isOffline: false,
    type: 'unknown',
  });

  useEffect(() => {
    // Note: In a real implementation, you would use:
    // import NetInfo from '@react-native-community/netinfo';
    // const unsubscribe = NetInfo.addEventListener(state => { ... });
    // return () => unsubscribe();

    // For now, we assume online for native
    setStatus({
      isOnline: true,
      isOffline: false,
      type: 'unknown',
    });
  }, []);

  return status;
}

// Hook that works on both web and native
export function useNetworkStatus(): NetworkStatus {
  const isWeb = Platform.OS === 'web';
  const webStatus = useWebNetworkStatus();
  const nativeStatus = useNativeNetworkStatus();

  // Return the appropriate status based on platform
  return isWeb ? webStatus : nativeStatus;
}

// Hook for handling offline actions
export function useOfflineQueue() {
  const [queue, setQueue] = useState<
    Array<{ id: string; action: () => Promise<void>; retries: number }>
  >([]);
  const { isOnline } = useNetworkStatus();

  const addToQueue = useCallback((action: () => Promise<void>) => {
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    setQueue((prev) => [...prev, { id, action, retries: 0 }]);
    return id;
  }, []);

  const removeFromQueue = useCallback((id: string) => {
    setQueue((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const clearQueue = useCallback(() => {
    setQueue([]);
  }, []);

  // Process queue when coming back online
  useEffect(() => {
    if (!isOnline || queue.length === 0) return;

    const processQueue = async () => {
      const itemsToProcess = [...queue];

      for (const item of itemsToProcess) {
        try {
          await item.action();
          removeFromQueue(item.id);
        } catch (_error) {
          // Increment retry count
          setQueue((prev) =>
            prev.map((q) => (q.id === item.id ? { ...q, retries: q.retries + 1 } : q))
          );

          // Remove after max retries
          if (item.retries >= 3) {
            removeFromQueue(item.id);
          }
        }
      }
    };

    processQueue();
  }, [isOnline, queue, removeFromQueue]);

  return {
    queue,
    queueLength: queue.length,
    addToQueue,
    removeFromQueue,
    clearQueue,
  };
}

// Simple hook to check if online
export function useIsOnline(): boolean {
  const { isOnline } = useNetworkStatus();
  return isOnline;
}
