import type { ActionType } from '@app/types';

export interface ActionExecutorDeps {
  logout?: () => void;
  toggleTheme?: () => void;
  goBack?: () => void;
  showToast?: (message: string, variant?: string) => void;
  navigate?: (path: string) => void;
  /** Platform-injectable refresh. Falls back to window.location.reload on web. */
  refresh?: () => void;
  /** Platform-injectable clipboard. Falls back to navigator.clipboard on web. */
  copyToClipboard?: (text: string) => Promise<void>;
}

export function createActionExecutor(deps: ActionExecutorDeps) {
  return function executeAction(action: ActionType, payload?: Record<string, unknown>) {
    switch (action) {
      case 'logout':
        deps.logout?.();
        break;
      case 'toggleTheme':
        deps.toggleTheme?.();
        break;
      case 'goBack':
        deps.goBack?.();
        break;
      case 'showToast':
        deps.showToast?.(
          (payload?.message as string) || '',
          payload?.variant as string | undefined
        );
        break;
      case 'refresh':
        if (deps.refresh) {
          deps.refresh();
        } else if (typeof window !== 'undefined') {
          window.location.reload();
        }
        break;
      case 'copyToClipboard':
        if (payload?.text) {
          if (deps.copyToClipboard) {
            deps.copyToClipboard(String(payload.text)).catch(() => {
              deps.showToast?.('Failed to copy to clipboard', 'error');
            });
          } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
            navigator.clipboard.writeText(String(payload.text)).catch(() => {
              deps.showToast?.('Failed to copy to clipboard', 'error');
            });
          }
        }
        break;
      case 'apiCall': {
        const endpoint = payload?.endpoint as string;
        const method = (payload?.method as string) || 'GET';
        if (endpoint) {
          fetch(endpoint, { method }).catch(() => {
            deps.showToast?.('API call failed', 'error');
          });
        }
        break;
      }
      case 'openModal':
      case 'closeModal':
      case 'custom':
        // Extensible - no-op by default
        break;
    }
  };
}
