import { useAuth, type LoginHandler, type AuthUser } from '@app/shared';
import * as AuthSession from 'expo-auth-session';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { useEffect, useCallback, type ReactNode } from 'react';

// Complete auth session for web browser
WebBrowser.maybeCompleteAuthSession();

// Entra ID (Azure AD) discovery document
const entraDiscovery = {
  authorizationEndpoint: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
  tokenEndpoint: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
  revocationEndpoint: 'https://login.microsoftonline.com/common/oauth2/v2.0/logout',
};

interface MobileAuthProviderProps {
  children: ReactNode;
}

export function MobileAuthProvider({ children }: MobileAuthProviderProps) {
  const { setLoginHandler, setLogoutHandler, getProviderConfig } = useAuth();

  const googleConfig = getProviderConfig('google');
  const entraConfig = getProviderConfig('entra');

  // Google Auth Request
  const [_googleRequest, _googleResponse, googlePromptAsync] = Google.useAuthRequest(
    googleConfig
      ? {
          clientId: googleConfig.clientId,
          iosClientId: googleConfig.iosClientId,
          androidClientId: googleConfig.androidClientId,
          scopes: googleConfig.scopes || ['openid', 'profile', 'email'],
        }
      : { clientId: '' },
    { disabled: !googleConfig }
  );

  // Entra Auth Request
  const redirectUri = AuthSession.makeRedirectUri({
    scheme: 'crossplatformapp',
  });

  const [_entraRequest, _entraResponse, entraPromptAsync] = AuthSession.useAuthRequest(
    entraConfig
      ? {
          clientId: entraConfig.clientId,
          scopes: entraConfig.scopes || ['openid', 'profile', 'email', 'User.Read'],
          redirectUri,
          responseType: AuthSession.ResponseType.Token,
          extraParams: {
            tenant: entraConfig.tenantId || 'common',
          },
        }
      : { clientId: '', redirectUri, scopes: [] },
    entraDiscovery
  );

  // Handle Google login
  const handleGoogleLogin = useCallback(async (): Promise<{
    user: AuthUser;
    accessToken: string;
  }> => {
    const result = await googlePromptAsync();

    if (result.type !== 'success') {
      throw new Error(
        result.type === 'cancel' ? 'Authentication cancelled' : 'Authentication failed'
      );
    }

    const accessToken = result.authentication?.accessToken;
    if (!accessToken) {
      throw new Error('No access token received');
    }

    // Fetch user info from Google
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

    return { user, accessToken };
  }, [googlePromptAsync]);

  // Handle Entra login
  const handleEntraLogin = useCallback(async (): Promise<{
    user: AuthUser;
    accessToken: string;
  }> => {
    const result = await entraPromptAsync();

    if (result.type !== 'success') {
      throw new Error(
        result.type === 'cancel' ? 'Authentication cancelled' : 'Authentication failed'
      );
    }

    const accessToken = result.params?.access_token;
    if (!accessToken) {
      throw new Error('No access token received');
    }

    // Fetch user info from Microsoft Graph
    const userInfoResponse = await fetch('https://graph.microsoft.com/v1.0/me', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const userInfo = await userInfoResponse.json();

    const user: AuthUser = {
      id: userInfo.id,
      email: userInfo.mail || userInfo.userPrincipalName,
      name: userInfo.displayName,
      avatar: undefined, // Microsoft Graph requires separate call for photo
      provider: 'entra',
      providerUserId: userInfo.id,
    };

    return { user, accessToken };
  }, [entraPromptAsync]);

  // Set up login handler
  useEffect(() => {
    const loginHandler: LoginHandler = async (provider, _config) => {
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
        return handleGoogleLogin();
      } else if (provider === 'entra') {
        return handleEntraLogin();
      }
      throw new Error(`Unknown provider: ${provider}`);
    };

    const logoutHandler = async () => {
      // For mobile, we just clear the local state
      // OAuth tokens are managed by the auth provider
    };

    setLoginHandler(loginHandler);
    setLogoutHandler(logoutHandler);
  }, [setLoginHandler, setLogoutHandler, handleGoogleLogin, handleEntraLogin]);

  return <>{children}</>;
}
