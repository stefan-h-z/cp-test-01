import type React from 'react';

// App Configuration Types
export interface AppConfig {
  name: string;
  version: string;
  theme: ThemeConfig;
  navigation: NavigationConfig;
  features: FeatureFlags;
  api: ApiConfig;
  auth: AuthConfig;
  i18n: I18nAppConfig;
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

export type AuthProviderType = 'google' | 'entra' | 'dev';

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

// I18n Types
export interface I18nAppConfig {
  defaultLocale: string;
  fallbackLocale: string;
  supportedLocales: string[];
  detectBrowserLanguage?: boolean;
  persistLocale?: boolean;
}

export interface LocaleInfo {
  code: string;
  name: string;
  nativeName: string;
  flag?: string;
  direction?: 'ltr' | 'rtl';
}

export interface TranslationNamespace {
  common: CommonTranslations;
  auth: AuthTranslations;
  validation: ValidationTranslations;
  form: FormTranslations;
  navigation: NavigationTranslations;
  settings: SettingsTranslations;
  errors: ErrorTranslations;
  dataGrid: DataGridTranslations;
  toast: ToastTranslations;
  contact: ContactTranslations;
}

export interface CommonTranslations {
  loading: string;
  error: string;
  retry: string;
  cancel: string;
  save: string;
  delete: string;
  edit: string;
  view: string;
  create: string;
  submit: string;
  confirm: string;
  back: string;
  next: string;
  previous: string;
  search: string;
  filter: string;
  sort: string;
  clear: string;
  reset: string;
  close: string;
  open: string;
  yes: string;
  no: string;
  ok: string;
  done: string;
  noResults: string;
  noData: string;
  required: string;
  optional: string;
}

export interface AuthTranslations {
  signIn: string;
  signOut: string;
  signUp: string;
  login: string;
  logout: string;
  register: string;
  forgotPassword: string;
  resetPassword: string;
  email: string;
  password: string;
  confirmPassword: string;
  rememberMe: string;
  dontHaveAccount: string;
  alreadyHaveAccount: string;
  signInWith: string;
  continueWith: string;
  orContinueWith: string;
  welcomeBack: string;
  createAccount: string;
  invalidCredentials: string;
  accountCreated: string;
  passwordChanged: string;
}

export interface ValidationTranslations {
  required: string;
  email: string;
  minLength: string;
  maxLength: string;
  passwordMatch: string;
  passwordStrength: string;
  invalidFormat: string;
  invalidPhone: string;
  invalidUrl: string;
}

export interface FormTranslations {
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
  subject: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  company: string;
  website: string;
  bio: string;
}

export interface NavigationTranslations {
  home: string;
  settings: string;
  profile: string;
  about: string;
  contact: string;
  help: string;
  privacy: string;
  terms: string;
}

export interface SettingsTranslations {
  title: string;
  language: string;
  theme: string;
  darkMode: string;
  lightMode: string;
  systemTheme: string;
  notifications: string;
  pushNotifications: string;
  emailNotifications: string;
  account: string;
  security: string;
  changePassword: string;
  deleteAccount: string;
}

export interface ErrorTranslations {
  generic: string;
  network: string;
  notFound: string;
  unauthorized: string;
  forbidden: string;
  serverError: string;
  timeout: string;
  offline: string;
}

export interface DataGridTranslations {
  noData: string;
  loading: string;
  rowsPerPage: string;
  of: string;
  page: string;
  actions: string;
  selected: string;
  deleteSelected: string;
  exportSelected: string;
  filterBy: string;
  sortBy: string;
  ascending: string;
  descending: string;
}

export interface ToastTranslations {
  success: string;
  error: string;
  warning: string;
  info: string;
}

export interface ContactTranslations {
  title: string;
  subtitle: string;
  sendMessage: string;
  messageSent: string;
  messageError: string;
  thankYou: string;
}

// Theme Mode Types
export type ThemeMode = 'light' | 'dark' | 'system';

export interface ThemeModeState {
  mode: ThemeMode;
  resolvedMode: 'light' | 'dark';
  isSystemDark: boolean;
}

export interface ThemeModeContextValue extends ThemeModeState {
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
}

// Modal/Dialog Types
export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  size?: ModalSize;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
  children?: React.ReactNode;
  footer?: React.ReactNode;
}

export type AlertVariant = 'info' | 'success' | 'warning' | 'error';

export interface AlertDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  message: string;
  variant?: AlertVariant;
  confirmLabel?: string;
  onConfirm?: () => void;
}

export interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  message: string;
  variant?: 'default' | 'destructive';
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
}

export interface ModalState {
  id: string;
  type: 'alert' | 'confirm' | 'custom';
  props: Record<string, unknown>;
}

export interface ModalContextValue {
  modals: ModalState[];
  openModal: (modal: Omit<ModalState, 'id'>) => string;
  closeModal: (id: string) => void;
  closeAllModals: () => void;
  alert: (props: Omit<AlertDialogProps, 'open' | 'onClose'>) => Promise<void>;
  confirm: (props: Omit<ConfirmDialogProps, 'open' | 'onClose' | 'onConfirm'>) => Promise<boolean>;
}

// Navigation Types
export interface RouteConfig {
  path: string;
  name: string;
  title: string;
  icon?: string;
  component?: string;
  protected?: boolean;
  roles?: string[];
  showInNav?: boolean;
  showInTabs?: boolean;
  children?: RouteConfig[];
  params?: Record<string, string>;
}

export interface NavigationState {
  currentRoute: string;
  previousRoute: string | null;
  params: Record<string, string>;
  history: string[];
}

export interface NavigationContextValue {
  state: NavigationState;
  navigate: (path: string, params?: Record<string, string>) => void;
  goBack: () => void;
  canGoBack: boolean;
  setParams: (params: Record<string, string>) => void;
  getParam: <T = string>(key: string, defaultValue?: T) => T | undefined;
}

export interface TabConfig {
  name: string;
  title: string;
  icon: string;
  path: string;
  badge?: number | string;
  showBadge?: boolean;
  isFab?: boolean;
  hidden?: boolean;
}

export interface TabBarProps {
  tabs: TabConfig[];
  activeTab: string;
  onTabPress: (tab: TabConfig) => void;
  position?: 'bottom' | 'top';
  showLabels?: boolean;
  variant?: 'default' | 'floating' | 'minimal';
}

export interface SidebarConfig {
  header?: {
    title?: string;
    logo?: string;
    showUserInfo?: boolean;
  };
  items: SidebarItem[];
  footer?: {
    items?: SidebarItem[];
    showVersion?: boolean;
  };
}

export interface SidebarItem {
  id: string;
  title: string;
  icon?: string;
  path?: string;
  badge?: number | string;
  children?: SidebarItem[];
  divider?: boolean;
  action?: () => void;
}

export interface SidebarProps {
  config: SidebarConfig;
  isOpen: boolean;
  onClose: () => void;
  activeItem?: string;
  onItemPress: (item: SidebarItem) => void;
  variant?: 'permanent' | 'temporary' | 'persistent';
  position?: 'left' | 'right';
}

export interface DeepLinkConfig {
  prefixes: string[];
  screens: Record<string, string | DeepLinkScreenConfig>;
}

export interface DeepLinkScreenConfig {
  path: string;
  parse?: Record<string, (value: string) => unknown>;
  stringify?: Record<string, (value: unknown) => string>;
  screens?: Record<string, string | DeepLinkScreenConfig>;
}

export interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirectTo?: string;
  roles?: string[];
  onUnauthorized?: () => void;
}

// Remote Config Types
export interface RemoteAppConfig extends AppConfig {
  navigation: ExtendedNavigationConfig;
  /** Screen definitions keyed by screen code */
  screens?: Record<string, ScreenDefinition>;
  _meta: ConfigMeta;
}

export interface ConfigMeta {
  version: string;
  fetchedAt: number;
  expiresAt: number;
}

// Extended Navigation Config
export interface ExtendedNavigationConfig extends NavigationConfig {
  routes: RouteDefinition[];
  initialRoute: string;
  tabs?: ExtendedTabBarConfig;
  sidebar?: ExtendedSidebarConfig;
  fallback?: NavigationFallback;
}

export interface NavigationFallback {
  notFound: string;
  unauthorized: string;
}

export interface RouteDefinition {
  id: string;
  path: string;
  title: string | LocalizedString;
  icon?: string;
  /** Registered component name (for hardcoded screens like LoginScreen, SettingsScreen) */
  screen: string;
  /** References a screen code from config.screens (takes precedence over screen) */
  screenCode?: string;
  layout?: string;
  access?: RouteAccess;
  visibility?: RouteVisibility;
  featureFlag?: string;
  params?: RouteParam[];
}

export interface LocalizedString {
  key: string;
  defaultValue?: string;
}

export interface RouteAccess {
  type: 'public' | 'authenticated' | 'roles';
  roles?: string[];
}

export interface RouteVisibility {
  showInTabs?: boolean;
  showInSidebar?: boolean;
  showInNav?: boolean;
}

export interface RouteParam {
  name: string;
  type: 'string' | 'number';
  required?: boolean;
}

export interface ExtendedTabBarConfig {
  tabs: TabDefinition[];
  position: 'bottom' | 'top';
  fab?: FabConfig;
  showLabels?: boolean;
  variant?: 'default' | 'floating' | 'minimal';
}

export interface TabDefinition {
  route: string;
  title?: string | LocalizedString;
  icon?: string;
  badge?: number | string;
  hidden?: boolean;
}

export interface FabConfig {
  route: string;
  icon: string;
}

export interface ExtendedSidebarConfig extends SidebarConfig {
  groups?: SidebarGroup[];
  showSearch?: boolean;
  collapsible?: boolean;
}

export interface SidebarGroup {
  id: string;
  title?: string | LocalizedString;
  items: SidebarRouteItem[];
  collapsible?: boolean;
  defaultExpanded?: boolean;
}

export interface SidebarRouteItem {
  route: string;
  title?: string | LocalizedString;
  icon?: string;
  badge?: number | string;
}

// Config Service Types
export interface ConfigServiceOptions {
  endpoint: string;
  cacheKey?: string;
  cacheDuration?: number;
  retryAttempts?: number;
  retryDelay?: number;
}

export interface ConfigState<T> {
  config: T | null;
  isLoading: boolean;
  error: string | null;
  isStale: boolean;
  lastFetched: number | null;
}

// Component Registry Types
export type ScreenComponent = React.ComponentType<unknown>;
export type LayoutComponent = React.ComponentType<{ children: React.ReactNode }>;

export interface ScreenRegistry {
  [name: string]: ScreenComponent;
}

export interface LayoutRegistry {
  [name: string]: LayoutComponent;
}

// QR Scanner Types
export type QRScannerStatus = 'idle' | 'scanning' | 'success' | 'error';

export interface QRScanResult {
  /** The decoded content of the QR code */
  content: string;
  /** Format of the barcode (QR_CODE, EAN_13, etc.) */
  format?: string;
  /** Timestamp when the code was scanned */
  timestamp: number;
  /** Raw data if available */
  rawData?: string;
}

export interface QRScannerState {
  /** Current scanner status */
  status: QRScannerStatus;
  /** The most recent scan result */
  result: QRScanResult | null;
  /** Error message if scanning failed */
  error: string | null;
  /** Whether camera permission is granted */
  hasPermission: boolean | null;
  /** Whether the scanner is currently active */
  isActive: boolean;
  /** Scan history */
  history: QRScanResult[];
}

export interface QRScannerOptions {
  /** Vibrate on successful scan */
  vibrate?: boolean;
  /** Play sound on successful scan */
  playSound?: boolean;
  /** Auto-close scanner after successful scan */
  autoClose?: boolean;
  /** Delay before allowing next scan (ms) */
  scanDelay?: number;
  /** Maximum history items to keep */
  maxHistory?: number;
  /** Supported barcode formats */
  formats?: string[];
}

// ============================================================
// CONFIG-DRIVEN SCREEN TYPES
// ============================================================

/** Top-level screen definition in the config */
export interface ScreenDefinition {
  /** Unique screen code, referenced by routes */
  code: string;
  /** Human-readable title */
  title?: string | LocalizedString;
  /** The component tree that makes up this screen */
  components: WidgetDefinition[];
  /** Optional screen-level styling */
  style?: ScreenStyle;
  /** Optional data sources this screen needs */
  dataSources?: DataSourceDefinition[];
}

export interface ScreenStyle {
  backgroundColor?: string;
  padding?: number | string;
  gap?: number | string;
  maxWidth?: number;
  scrollable?: boolean;
}

/** Data source that a screen can fetch and bind to widgets */
export interface DataSourceDefinition {
  id: string;
  endpoint: string;
  method?: 'GET' | 'POST';
  params?: Record<string, string>;
  refreshInterval?: number;
}

// ============================================================
// WIDGET DEFINITION TYPES
// ============================================================

/** Supported widget types */
export type WidgetType =
  | 'Header'
  | 'Text'
  | 'Card'
  | 'Button'
  | 'Image'
  | 'Spacer'
  | 'Divider'
  | 'QRScanner'
  | 'DataGrid'
  | 'FormField'
  | 'Container'
  | 'Row'
  | 'Icon'
  | 'Badge'
  | 'List';

/** Column width as a number 1-12 */
export type ColumnWidth = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

/** Responsive width overrides per breakpoint */
export interface ResponsiveWidth {
  xs?: ColumnWidth;
  sm?: ColumnWidth;
  md?: ColumnWidth;
  lg?: ColumnWidth;
  xl?: ColumnWidth;
}

export interface VisibilityCondition {
  featureFlag?: string;
  auth?: 'authenticated' | 'unauthenticated' | 'any';
}

export interface WidgetStyle {
  padding?: number | string;
  margin?: number | string;
  marginTop?: number | string;
  marginBottom?: number | string;
  backgroundColor?: string;
  borderRadius?: number | string;
  borderWidth?: number;
  borderColor?: string;
  minHeight?: number;
  maxHeight?: number;
  alignItems?: 'flex-start' | 'center' | 'flex-end' | 'stretch';
  justifyContent?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around';
  gap?: number | string;
}

/** Base for all widget definitions */
export interface WidgetDefinitionBase {
  type: WidgetType;
  id?: string;
  width?: ColumnWidth;
  responsiveWidth?: ResponsiveWidth;
  visible?: boolean | VisibilityCondition;
  featureFlag?: string;
  style?: WidgetStyle;
}

// --- Concrete Widget Definitions ---

export interface HeaderWidgetDef extends WidgetDefinitionBase {
  type: 'Header';
  label: string | LocalizedString;
  level?: 1 | 2 | 3 | 4 | 5;
}

export interface TextWidgetDef extends WidgetDefinitionBase {
  type: 'Text';
  label: string | LocalizedString;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  muted?: boolean;
  color?: string;
  align?: 'left' | 'center' | 'right';
}

export interface CardWidgetDef extends WidgetDefinitionBase {
  type: 'Card';
  header?: string | LocalizedString;
  description?: string | LocalizedString;
  variant?: 'elevated' | 'outlined' | 'filled';
  children?: WidgetDefinition[];
  image?: ImageWidgetDef;
  buttons?: ButtonWidgetDef[];
  link?: LinkDefinition;
}

export interface ButtonWidgetDef extends WidgetDefinitionBase {
  type: 'Button';
  label: string | LocalizedString;
  variant?:
    | 'primary'
    | 'secondary'
    | 'outline'
    | 'ghost'
    | 'destructive'
    | 'success'
    | 'gradient'
    | 'glass';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  icon?: string;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  link?: LinkDefinition;
}

export interface ImageWidgetDef extends WidgetDefinitionBase {
  type: 'Image';
  url: string;
  alt?: string;
  height?: number | string;
  resizeMode?: 'cover' | 'contain' | 'stretch' | 'center';
  borderRadius?: number | string;
}

export interface SpacerWidgetDef extends WidgetDefinitionBase {
  type: 'Spacer';
  size?: number | string;
}

export interface DividerWidgetDef extends WidgetDefinitionBase {
  type: 'Divider';
  color?: string;
  thickness?: number;
}

export interface QRScannerWidgetDef extends WidgetDefinitionBase {
  type: 'QRScanner';
  onScan?: LinkDefinition;
  showHistory?: boolean;
}

export interface DataGridWidgetDef extends WidgetDefinitionBase {
  type: 'DataGrid';
  dataSource: string;
  columns: DataGridColumnDef[];
  actions?: DataGridActionDef[];
  sortable?: boolean;
  filterable?: boolean;
  pagination?: boolean;
  pageSizeOptions?: number[];
}

export interface DataGridColumnDef {
  key: string;
  title: string | LocalizedString;
  width?: number | string;
  minWidth?: number;
  sortable?: boolean;
  filterable?: boolean;
  align?: 'left' | 'center' | 'right';
}

export interface DataGridActionDef {
  id: string;
  label: string | LocalizedString;
  icon?: string;
  variant?: 'primary' | 'secondary' | 'destructive' | 'ghost';
  link?: LinkDefinition;
}

export interface FormFieldWidgetDef extends WidgetDefinitionBase {
  type: 'FormField';
  name: string;
  label?: string | LocalizedString;
  placeholder?: string | LocalizedString;
  fieldType?: FormFieldType;
  required?: boolean;
  disabled?: boolean;
  helperText?: string | LocalizedString;
  options?: Array<{ value: string; label: string | LocalizedString }>;
  submitAction?: LinkDefinition;
}

export interface ContainerWidgetDef extends WidgetDefinitionBase {
  type: 'Container';
  children: WidgetDefinition[];
  direction?: 'vertical' | 'horizontal';
}

export interface RowWidgetDef extends WidgetDefinitionBase {
  type: 'Row';
  children: WidgetDefinition[];
  wrap?: boolean;
}

export interface IconWidgetDef extends WidgetDefinitionBase {
  type: 'Icon';
  name: string;
  size?: number;
  color?: string;
}

export interface BadgeWidgetDef extends WidgetDefinitionBase {
  type: 'Badge';
  label: string | LocalizedString;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info';
}

export interface ListWidgetDef extends WidgetDefinitionBase {
  type: 'List';
  dataSource: string;
  itemTemplate: WidgetDefinition[];
  emptyMessage?: string | LocalizedString;
  dividers?: boolean;
}

/** Discriminated union of all widget definitions */
export type WidgetDefinition =
  | HeaderWidgetDef
  | TextWidgetDef
  | CardWidgetDef
  | ButtonWidgetDef
  | ImageWidgetDef
  | SpacerWidgetDef
  | DividerWidgetDef
  | QRScannerWidgetDef
  | DataGridWidgetDef
  | FormFieldWidgetDef
  | ContainerWidgetDef
  | RowWidgetDef
  | IconWidgetDef
  | BadgeWidgetDef
  | ListWidgetDef;

// ============================================================
// LINK / ACTION SYSTEM
// ============================================================

export type LinkType = 'SCREEN' | 'URL' | 'ACTION';

export type LinkDefinition = ScreenLink | UrlLink | ActionLink;

export interface ScreenLink {
  type: 'SCREEN';
  code: string;
  params?: Record<string, string>;
}

export interface UrlLink {
  type: 'URL';
  url: string;
  external?: boolean;
}

export interface ActionLink {
  type: 'ACTION';
  action: ActionType;
  payload?: Record<string, unknown>;
}

export type ActionType =
  | 'logout'
  | 'toggleTheme'
  | 'openModal'
  | 'closeModal'
  | 'apiCall'
  | 'refresh'
  | 'goBack'
  | 'copyToClipboard'
  | 'showToast'
  | 'custom';

// ============================================================
// WIDGET RENDERER TYPES
// ============================================================

/** Props passed to every widget renderer */
export interface WidgetRendererProps<T extends WidgetDefinition = WidgetDefinition> {
  definition: T;
  screenContext: ScreenContext;
}

/** Context available to all widgets on a screen */
export interface ScreenContext {
  screen: ScreenDefinition;
  data: Record<string, unknown>;
  isLoading: Record<string, boolean>;
  executeLink: (link: LinkDefinition) => void;
  resolveString: (value: string | LocalizedString) => string;
}

/** Widget renderer component type */
export type WidgetRenderer<T extends WidgetDefinition = WidgetDefinition> = React.ComponentType<
  WidgetRendererProps<T>
>;
