import { useEffect, useCallback, type ReactNode } from 'react';
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import { PublicClientApplication, type Configuration, type AuthenticationResult } from '@azure/msal-browser';
import { MsalProvider, useMsal } from '@azure/msal-react';
import { useAuth, type LoginHandler, type AuthUser, type AuthProviderConfig, type AuthProviderType } from '@app/shared';

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

// Google Auth Hook
function useGoogleAuth() {
  const { setLoginHandler, setLogoutHandler, getProviderConfig } = useAuth();

  const googleLogin = useGoogleLogin({
    onSuccess: () => {},
    onError: () => {},
    flow: 'implicit',
  });

  useEffect(() => {
    const googleConfig = getProviderConfig('google');
    if (!googleConfig) return;

    const handler: LoginHandler = async (_provider, config) => {
      return new Promise((resolve, reject) => {
        const login = useGoogleLogin({
          onSuccess: async (tokenResponse) => {
            try {
              // Fetch user info from Google
              const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
              });
              const userInfo = await userInfoResponse.json();

              const user: AuthUser = {
                id: userInfo.sub,
                email: userInfo.email,
                name: userInfo.name,
                avatar: userInfo.picture,
                provider: 'google',
                providerUserId: userInfo.sub,
              };

              resolve({ user, accessToken: tokenResponse.access_token });
            } catch (error) {
              reject(error);
            }
          },
          onError: (error) => reject(error),
          flow: 'implicit',
          scope: config.scopes?.join(' ') || 'openid profile email',
        });
        login();
      });
    };

    // Note: Google handler is set in the GoogleAuthHandler component
  }, [getProviderConfig, setLoginHandler]);

  return { googleLogin };
}

// Google Auth Handler Component (needs to be inside GoogleOAuthProvider)
function GoogleAuthHandler() {
  const { setLoginHandler, getProviderConfig } = useAuth();

  const handleGoogleLogin = useCallback(async (config: AuthProviderConfig): Promise<{ user: AuthUser; accessToken: string }> => {
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
            const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
              headers: { Authorization: `Bearer ${accessToken}` },
            });
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
      setTimeout(() => {
        clearInterval(checkPopup);
        if (!popup.closed) popup.close();
        reject(new Error('Authentication timed out'));
      }, 5 * 60 * 1000);
    });
  }, []);

  useEffect(() => {
    const googleConfig = getProviderConfig('google');
    if (googleConfig) {
      // Store the handler reference
      (window as unknown as Record<string, unknown>).__googleAuthHandler = handleGoogleLogin;
    }
  }, [getProviderConfig, handleGoogleLogin]);

  return null;
}

// Entra (Azure AD) Auth Handler Component
function EntraAuthHandler({ msalInstance }: { msalInstance: PublicClientApplication }) {
  const { instance } = useMsal();
  const { setLoginHandler, setLogoutHandler, getProviderConfig } = useAuth();

  useEffect(() => {
    const entraConfig = getProviderConfig('entra');
    if (!entraConfig) return;

    const loginHandler: LoginHandler = async (_provider, config) => {
      try {
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
      } catch (error) {
        throw error;
      }
    };

    const logoutHandler = async () => {
      await instance.logoutPopup();
    };

    // Store handlers
    (window as unknown as Record<string, unknown>).__entraAuthHandler = loginHandler;
    (window as unknown as Record<string, unknown>).__entraLogoutHandler = logoutHandler;
  }, [instance, getProviderConfig, setLoginHandler, setLogoutHandler]);

  return null;
}

// Combined login handler that delegates to the correct provider
function CombinedAuthHandler() {
  const { setLoginHandler, setLogoutHandler, getProviderConfig } = useAuth();

  useEffect(() => {
    const loginHandler: LoginHandler = async (provider, config) => {
      if (provider === 'google') {
        const googleHandler = (window as unknown as Record<string, unknown>).__googleAuthHandler as typeof loginHandler;
        if (googleHandler) {
          return googleHandler(provider, config);
        }
        throw new Error('Google auth handler not initialized');
      } else if (provider === 'entra') {
        const entraHandler = (window as unknown as Record<string, unknown>).__entraAuthHandler as typeof loginHandler;
        if (entraHandler) {
          return entraHandler(provider, config);
        }
        throw new Error('Entra auth handler not initialized');
      }
      throw new Error(`Unknown provider: ${provider}`);
    };

    const logoutHandler = async () => {
      const entraLogout = (window as unknown as Record<string, unknown>).__entraLogoutHandler as () => Promise<void>;
      if (entraLogout) {
        try {
          await entraLogout();
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
  const { authConfig, availableProviders } = useAuth();

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
    content = (
      <GoogleOAuthProvider clientId={googleConfig.clientId}>
        {content}
      </GoogleOAuthProvider>
    );
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
