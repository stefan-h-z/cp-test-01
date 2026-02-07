import type {
  ScreenDefinition,
  ScreenContext,
  LinkDefinition,
  LocalizedString,
  RemoteAppConfig,
} from '@app/types';
import { useCallback, useMemo, useRef } from 'react';
import { createActionExecutor, type ActionExecutorDeps } from './actionExecutor';

interface UseScreenContextOptions {
  screen: ScreenDefinition;
  config: RemoteAppConfig | null;
  data?: Record<string, unknown>;
  isLoading?: Record<string, boolean>;
  navigate: (path: string) => void;
  goBack: () => void;
  actionDeps?: ActionExecutorDeps;
  /** Platform-injectable URL opener. Falls back to window.open on web. */
  openUrl?: (url: string, external: boolean) => void;
}

export function useScreenContext({
  screen,
  config,
  data = {},
  isLoading = {},
  navigate,
  goBack,
  actionDeps,
  openUrl,
}: UseScreenContextOptions): ScreenContext {
  const features = config?.features || {};

  // Inject feature flags into data so WidgetTreeRenderer can check them
  const enrichedData = useMemo(
    () => ({
      ...data,
      __features: features,
    }),
    [data, features]
  );

  const executeAction = useMemo(
    () => createActionExecutor({ navigate, goBack, ...actionDeps }),
    [navigate, goBack, actionDeps]
  );

  // Keep latest callbacks in refs so the returned ScreenContext stays stable
  const executeLinkRef = useRef<(link: LinkDefinition) => void>(() => {});
  const resolveStringRef = useRef<(value: string | LocalizedString) => string>((v) =>
    typeof v === 'string' ? v : v.defaultValue || v.key
  );

  // Update the ref'd implementation whenever deps change
  executeLinkRef.current = (link: LinkDefinition) => {
    switch (link.type) {
      case 'SCREEN': {
        // Find the route whose screenCode matches the link code
        const route = config?.navigation?.routes?.find((r) => r.screenCode === link.code);
        if (route) {
          let path = route.path;
          if (link.params) {
            Object.entries(link.params).forEach(([key, value]) => {
              path = path.replace(`:${key}`, value);
            });
          }
          navigate(path);
        } else {
          console.warn(`No route found for screen code: ${link.code}`);
        }
        break;
      }
      case 'URL': {
        if (openUrl) {
          openUrl(link.url, link.external !== false);
        } else if (typeof window !== 'undefined') {
          if (link.external !== false) {
            window.open(link.url, '_blank', 'noopener,noreferrer');
          } else {
            window.location.href = link.url;
          }
        }
        break;
      }
      case 'ACTION': {
        executeAction(link.action, link.payload);
        break;
      }
    }
  };

  resolveStringRef.current = (value: string | LocalizedString): string => {
    if (typeof value === 'string') return value;
    return value.defaultValue || value.key;
  };

  // Stable wrapper functions that delegate to refs
  const executeLink = useCallback((link: LinkDefinition) => {
    executeLinkRef.current(link);
  }, []);

  const resolveString = useCallback((value: string | LocalizedString): string => {
    return resolveStringRef.current(value);
  }, []);

  return useMemo(
    () => ({
      screen,
      data: enrichedData,
      isLoading,
      executeLink,
      resolveString,
    }),
    [screen, enrichedData, isLoading, executeLink, resolveString]
  );
}
