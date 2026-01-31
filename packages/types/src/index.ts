// App Configuration Types
export interface AppConfig {
  name: string;
  version: string;
  theme: ThemeConfig;
  navigation: NavigationConfig;
  features: FeatureFlags;
  api: ApiConfig;
  auth: AuthConfig;
}

// Authentication Configuration
export interface AuthConfig {
  enabled: boolean;
  providers: AuthProviderConfig[];
  redirectUri?: string;
  postLogoutRedirectUri?: string;
}

export interface AuthProviderConfig {
  type: AuthProviderType;
  enabled: boolean;
  clientId: string;
  // Google-specific
  iosClientId?: string;
  androidClientId?: string;
  // Entra ID (Azure AD) specific
  tenantId?: string;
  scopes?: string[];
}

export type AuthProviderType = 'google' | 'entra';

// Auth State Types
export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: AuthUser | null;
  accessToken: string | null;
  provider: AuthProviderType | null;
  error: string | null;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  provider: AuthProviderType;
  providerUserId: string;
}

export interface ThemeConfig {
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  darkMode: boolean;
}

export interface NavigationConfig {
  screens: ScreenConfig[];
  initialScreen: string;
}

export interface ScreenConfig {
  id: string;
  title: string;
  icon?: string;
  component: string;
  showInNav: boolean;
}

export interface FeatureFlags {
  [key: string]: boolean;
}

export interface ApiConfig {
  baseUrl: string;
  timeout: number;
}

// Content Types
export interface ContentItem {
  id: string;
  type: ContentType;
  title: string;
  body?: string;
  imageUrl?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export type ContentType = 'article' | 'page' | 'card' | 'list' | 'custom';

export interface ContentSection {
  id: string;
  title: string;
  items: ContentItem[];
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

// Navigation Types
export type RootStackParamList = {
  Home: undefined;
  Details: { id: string };
  Settings: undefined;
  Profile: undefined;
};
