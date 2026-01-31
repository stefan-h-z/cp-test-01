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

// DataGrid Types
export interface DataGridColumn<T> {
  key: keyof T | string;
  title: string;
  width?: number | string;
  minWidth?: number;
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: unknown, row: T, index: number) => React.ReactNode;
  align?: 'left' | 'center' | 'right';
}

export interface DataGridAction<T> {
  id: string;
  label: string;
  icon?: string;
  variant?: 'primary' | 'secondary' | 'destructive' | 'ghost';
  onPress: (row: T, index: number) => void;
  isVisible?: (row: T) => boolean;
  isDisabled?: (row: T) => boolean;
}

export type SortDirection = 'asc' | 'desc' | null;

export interface SortState {
  column: string | null;
  direction: SortDirection;
}

export interface FilterState {
  [key: string]: string;
}

export interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
}

export interface DataGridProps<T extends { id: string | number }> {
  data: T[];
  columns: DataGridColumn<T>[];
  actions?: DataGridAction<T>[];
  // Sorting
  sortable?: boolean;
  sortState?: SortState;
  onSortChange?: (sort: SortState) => void;
  // Filtering
  filterable?: boolean;
  filterState?: FilterState;
  onFilterChange?: (filters: FilterState) => void;
  filterPlaceholder?: string;
  // Pagination
  pagination?: boolean;
  paginationState?: PaginationState;
  onPaginationChange?: (pagination: PaginationState) => void;
  pageSizeOptions?: number[];
  // Loading & Empty states
  isLoading?: boolean;
  emptyMessage?: string;
  // Selection
  selectable?: boolean;
  selectedIds?: (string | number)[];
  onSelectionChange?: (ids: (string | number)[]) => void;
  // Styling
  striped?: boolean;
  hoverable?: boolean;
  compact?: boolean;
}

// Form Types
export interface FormFieldConfig {
  name: string;
  label?: string;
  placeholder?: string;
  type?: FormFieldType;
  required?: boolean;
  disabled?: boolean;
  helperText?: string;
  options?: SelectOption[];
}

export type FormFieldType =
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'tel'
  | 'url'
  | 'textarea'
  | 'select'
  | 'checkbox'
  | 'radio'
  | 'date';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface FormState<T> {
  values: T;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
  isValid: boolean;
  isDirty: boolean;
}

export interface FormFieldProps {
  name: string;
  label?: string;
  placeholder?: string;
  type?: FormFieldType;
  disabled?: boolean;
  helperText?: string;
  error?: string;
  required?: boolean;
  options?: SelectOption[];
}
