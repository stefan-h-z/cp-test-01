import { useAuth, type LoginHandler, type AuthUser, type AuthProviderConfig } from '@app/shared';
import {
  PublicClientApplication,
  type Configuration,
  type AuthenticationResult,
} from '@azure/msal-browser';
import { MsalProvider, useMsal } from '@azure/msal-react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { useEffect, useCallback, type ReactNode } from 'react';

// Module-scope handler references (instead of window globals)
type GoogleLoginHandler = (
  config: AuthProviderConfig
) => Promise<{ user: AuthUser; accessToken: string }>;
let googleAuthHandler: GoogleLoginHandler | null = null;
let entraAuthHandler: LoginHandler | null = null;
let entraLogoutHandler: (() => Promise<void>) | null = null;

// Create MSAL instance based on config
function createMsalInstance(config: AuthProviderConfig): PublicClientApplication | null {
  if (config.type !== 'entra' || !config.clientId) return null;

  const msalConfig: Configuration = {
    auth: {
      clientId: config.clientId,
      authority: `https://login.microsoftonline.com/${config.tenantId || 'common'}`,
      redirectUri: window.location.origin + '/auth/callback',
      postLogoutRedirectUri: window.location.origin,
    },
    cache: {
      cacheLocation: 'localStorage',
      storeAuthStateInCookie: false,
    },
  };

  return new PublicClientApplication(msalConfig);
}

// Google Auth Handler Component (needs to be inside GoogleOAuthProvider)
function GoogleAuthHandler() {
  const { getProviderConfig } = useAuth();

  const handleGoogleLogin = useCallback(
    async (config: AuthProviderConfig): Promise<{ user: AuthUser; accessToken: string }> => {
      return new Promise((resolve, reject) => {
        // We need to use a different approach since useGoogleLogin hook can't be called dynamically
        // Using the popup approach with custom window
        const googleAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
        googleAuthUrl.searchParams.set('client_id', config.clientId);
        googleAuthUrl.searchParams.set('redirect_uri', window.location.origin + '/auth/callback');
        googleAuthUrl.searchParams.set('response_type', 'token');
        googleAuthUrl.searchParams.set('scope', config.scopes?.join(' ') || 'openid profile email');
        googleAuthUrl.searchParams.set('prompt', 'select_account');

        const width = 500;
        const height = 600;
        const left = window.screenX + (window.outerWidth - width) / 2;
        const top = window.screenY + (window.outerHeight - height) / 2;

        const popup = window.open(
          googleAuthUrl.toString(),
          'google-auth',
          `width=${width},height=${height},left=${left},top=${top}`
        );

        if (!popup) {
          reject(new Error('Failed to open popup window'));
          return;
        }

        const checkPopup = setInterval(async () => {
          try {
            if (popup.closed) {
              clearInterval(checkPopup);
              reject(new Error('Authentication cancelled'));
              return;
            }

            const popupUrl = popup.location.href;
            if (popupUrl.includes('/auth/callback')) {
              clearInterval(checkPopup);
              const hash = popup.location.hash.substring(1);
              const params = new URLSearchParams(hash);
              const accessToken = params.get('access_token');

              popup.close();

              if (!accessToken) {
                reject(new Error('No access token received'));
                return;
              }

              // Fetch user info
              const userInfoResponse = await fetch(
                'https://www.googleapis.com/oauth2/v3/userinfo',
                {
                  headers: { Authorization: `Bearer ${accessToken}` },
                }
              );
              const userInfo = await userInfoResponse.json();

              const user: AuthUser = {
                id: userInfo.sub,
                email: userInfo.email,
                name: userInfo.name,
                avatar: userInfo.picture,
                provider: 'google',
                providerUserId: userInfo.sub,
              };

              resolve({ user, accessToken });
            }
          } catch {
            // Cross-origin error, popup hasn't redirected yet
          }
        }, 500);

        // Timeout after 5 minutes
        setTimeout(
          () => {
            clearInterval(checkPopup);
            if (!popup.closed) popup.close();
            reject(new Error('Authentication timed out'));
          },
          5 * 60 * 1000
        );
      });
    },
    []
  );

  useEffect(() => {
    const googleConfig = getProviderConfig('google');
    if (googleConfig) {
      googleAuthHandler = handleGoogleLogin;
    }
    return () => {
      googleAuthHandler = null;
    };
  }, [getProviderConfig, handleGoogleLogin]);

  return null;
}

// Entra (Azure AD) Auth Handler Component
function EntraAuthHandler({
  msalInstance: _msalInstance,
}: {
  msalInstance: PublicClientApplication;
}) {
  const { instance } = useMsal();
  const { setLoginHandler, setLogoutHandler, getProviderConfig } = useAuth();

  useEffect(() => {
    const entraConfig = getProviderConfig('entra');
    if (!entraConfig) return;

    const loginHandler: LoginHandler = async (_provider, config) => {
      const result: AuthenticationResult = await instance.loginPopup({
        scopes: config.scopes || ['openid', 'profile', 'email', 'User.Read'],
      });

      const user: AuthUser = {
        id: result.account?.localAccountId || result.uniqueId,
        email: result.account?.username || '',
        name: result.account?.name || '',
        avatar: undefined,
        provider: 'entra',
        providerUserId: result.account?.localAccountId || result.uniqueId,
      };

      return { user, accessToken: result.accessToken };
    };

    const logoutHandler = async () => {
      await instance.logoutPopup();
    };

    // Store handlers in module scope
    entraAuthHandler = loginHandler;
    entraLogoutHandler = logoutHandler;

    return () => {
      entraAuthHandler = null;
      entraLogoutHandler = null;
    };
  }, [instance, getProviderConfig, setLoginHandler, setLogoutHandler]);

  return null;
}

// Combined login handler that delegates to the correct provider
function CombinedAuthHandler() {
  const { setLoginHandler, setLogoutHandler } = useAuth();

  useEffect(() => {
    const loginHandler: LoginHandler = async (provider, config) => {
      if (provider === 'dev') {
        // Developer login - creates a mock user immediately
        const user: AuthUser = {
          id: 'dev-user-001',
          email: 'developer@localhost',
          name: 'Developer',
          avatar: undefined,
          provider: 'dev',
          providerUserId: 'dev-user-001',
        };
        return { user, accessToken: 'dev-token-mock' };
      } else if (provider === 'google') {
        if (googleAuthHandler) {
          return googleAuthHandler(config);
        }
        throw new Error('Google auth handler not initialized');
      } else if (provider === 'entra') {
        if (entraAuthHandler) {
          return entraAuthHandler(provider, config);
        }
        throw new Error('Entra auth handler not initialized');
      }
      throw new Error(`Unknown provider: ${provider}`);
    };

    const logoutHandler = async () => {
      if (entraLogoutHandler) {
        try {
          await entraLogoutHandler();
        } catch {
          // Ignore logout errors
        }
      }
    };

    setLoginHandler(loginHandler);
    setLogoutHandler(logoutHandler);
  }, [setLoginHandler, setLogoutHandler]);

  return null;
}

interface WebAuthProviderProps {
  children: ReactNode;
}

export function WebAuthProvider({ children }: WebAuthProviderProps) {
  const { availableProviders } = useAuth();

  const googleConfig = availableProviders.find((p) => p.type === 'google');
  const entraConfig = availableProviders.find((p) => p.type === 'entra');

  const msalInstance = entraConfig ? createMsalInstance(entraConfig) : null;

  // Wrap with Google OAuth Provider if Google is enabled
  let content = (
    <>
      <CombinedAuthHandler />
      <GoogleAuthHandler />
      {children}
    </>
  );

  if (googleConfig) {
    content = <GoogleOAuthProvider clientId={googleConfig.clientId}>{content}</GoogleOAuthProvider>;
  }

  // Wrap with MSAL Provider if Entra is enabled
  if (msalInstance) {
    content = (
      <MsalProvider instance={msalInstance}>
        <EntraAuthHandler msalInstance={msalInstance} />
        {content}
      </MsalProvider>
    );
  }

  return content;
}
