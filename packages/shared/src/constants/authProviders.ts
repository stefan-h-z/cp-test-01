import type { AuthProviderType } from '@app/types';

/**
 * Human-readable labels for auth providers
 */
export const authProviderLabels: Record<AuthProviderType, string> = {
  google: 'Google',
  entra: 'Microsoft',
  dev: 'Development',
};

/**
 * Brand colors for auth providers
 */
export const authProviderColors: Record<AuthProviderType, string> = {
  google: '#4285F4',
  entra: '#00A4EF',
  dev: '#666666',
};

/**
 * Get the display label for an auth provider
 */
export function getProviderLabel(provider: AuthProviderType): string {
  return authProviderLabels[provider] || provider;
}

/**
 * Get the brand color for an auth provider
 */
export function getProviderColor(provider: AuthProviderType): string {
  return authProviderColors[provider] || '#666666';
}
