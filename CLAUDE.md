# CLAUDE.md - AI Assistant Guidelines

This file provides guidance for AI assistants working with this repository.

## Repository Overview

**Repository:** Cross-Platform App Monorepo
**Tech Stack:** React, React Native, Expo, Vite, Tamagui, TanStack Query
**Architecture:** Configuration-driven / Metadata-driven
**Primary Branch:** `main`

## Project Structure

```
cp-test-01/
├── apps/
│   ├── web/                    # Web application (Vite + React)
│   │   ├── src/
│   │   │   ├── screens/        # Page components
│   │   │   ├── navigation/     # ConfigurableRouter, RouteWrapper
│   │   │   ├── components/     # ConfigurableSidebar, ConfigurableTabs
│   │   │   ├── App.tsx         # Main app with providers & registry
│   │   │   └── Layout.tsx      # Layout wrapper
│   │   └── vite.config.ts
│   └── mobile/                 # Mobile application (Expo + React Native)
│       ├── app/                # Expo Router pages
│       │   ├── (tabs)/         # Tab navigation (config-driven metadata)
│       │   └── details/        # Detail screens
│       └── app.json            # Expo configuration
├── packages/
│   ├── ui/                     # Shared UI components (Tamagui)
│   │   └── src/
│   │       ├── components/     # Button, Card, Input, ThemeSwitcher, etc.
│   │       └── tamagui.config.ts
│   ├── shared/                 # Shared hooks, providers, utilities
│   │   └── src/
│   │       ├── config/         # ConfigService, ConfigProvider, fallbackConfig
│   │       ├── registry/       # ComponentRegistry for dynamic screens
│   │       ├── hooks/          # useContent, useAppConfig, useThemeMode, etc.
│   │       ├── providers/      # AppProvider, ThemeModeProvider
│   │       └── utils/          # API utilities, storage
│   ├── config/                 # App configuration
│   │   └── src/
│   │       └── index.ts        # defaultAppConfig, createAppConfig
│   └── types/                  # TypeScript types
│       └── src/
│           └── index.ts        # All shared types (incl. RemoteAppConfig)
├── package.json                # Root package.json with workspaces
├── pnpm-workspace.yaml         # pnpm workspace configuration
├── turbo.json                  # Turborepo configuration
└── tsconfig.base.json          # Shared TypeScript config
```

## Development Workflow

### Quick Start

```bash
# Install dependencies
pnpm install

# Start web development server
pnpm dev:web

# Start mobile development server
pnpm dev:mobile

# Build all packages
pnpm build

# Type check all packages
pnpm typecheck
```

### Branch Naming Conventions

- Feature branches: `feature/<description>`
- Bug fixes: `fix/<description>`
- Documentation: `docs/<description>`
- Claude AI branches: `claude/<description>-<session-id>`

### Commit Message Guidelines

Follow conventional commit format:

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

## Code Conventions

### TypeScript

- All code is written in TypeScript with strict mode enabled
- Shared types are defined in `@app/types`
- Use explicit types, avoid `any`

### Component Development

- Use Tamagui components from `@app/ui` for cross-platform compatibility
- Follow the existing component patterns in `packages/ui/src/components/`
- Use styled() for creating styled variants

### DataGrid Component

The `DataGrid` component provides a feature-rich data table:

```typescript
import { DataGrid } from '@app/ui';
import { useDataGrid } from '@app/shared';
import type { DataGridColumn, DataGridAction } from '@app/types';

// Define columns
const columns: DataGridColumn<User>[] = [
  { key: 'name', title: 'Name', sortable: true },
  { key: 'email', title: 'Email', filterable: true },
  { key: 'status', title: 'Status', render: (val) => <Badge>{val}</Badge> },
];

// Define actions
const actions: DataGridAction<User>[] = [
  { id: 'view', label: 'View', icon: 'eye', onPress: (row) => {} },
  { id: 'edit', label: 'Edit', icon: 'pencil', onPress: (row) => {} },
  { id: 'delete', label: 'Delete', icon: 'trash', variant: 'destructive', onPress: (row) => {} },
];

// Use in component
<DataGrid
  data={users}
  columns={columns}
  actions={actions}
  pagination
  sortable
  filterable
/>
```

### Data Fetching

- Use TanStack Query hooks from `@app/shared`
- Define query keys consistently
- Handle loading and error states

### Configuration

- App configuration is defined in `@app/config`
- Use `createAppConfig()` to create custom configurations
- Access config via `useAppConfig()` hook

### Configuration-Driven Architecture

The app uses a metadata-driven architecture where navigation, routes, and UI are configured via remote config (with local fallback).

#### Remote Config System

```typescript
import { useRemoteConfig, useRemoteNavigation, ConfigProvider } from '@app/shared';

// Wrap app with ConfigProvider
<ConfigProvider endpoint="/api/config" refreshInterval={300000}>
  <App />
</ConfigProvider>

// Access config in components
const { config, isLoading, error, refresh } = useRemoteConfig();
const { routes, tabs, sidebar, fallback } = useRemoteNavigation();
```

#### Component Registry

Screens and layouts are resolved dynamically at runtime via the Component Registry:

```typescript
import { useComponentRegistry, RegistryProvider, createComponentRegistry } from '@app/shared';

// Create registry and register screens
const registry = createComponentRegistry();
registry.registerScreen('DashboardScreen', DashboardScreen);
registry.registerScreen('SettingsScreen', SettingsScreen);
registry.registerLayout('AuthLayout', AuthLayout);

// Wrap app
<RegistryProvider registry={registry}>
  <App />
</RegistryProvider>

// Resolve screens dynamically
const registry = useComponentRegistry();
const Screen = registry.getScreen('DashboardScreen');
```

#### Route Configuration

Routes are defined in the remote config with access control, feature flags, and visibility:

```typescript
interface RouteDefinition {
  id: string; // Unique route ID
  path: string; // URL path (e.g., '/dashboard', '/details/:id')
  title: string; // Display title
  icon?: string; // Icon name from @tamagui/lucide-icons
  screen: string; // Screen component name in registry
  layout?: string; // Optional layout wrapper
  access?: {
    type: 'public' | 'authenticated' | 'roles';
    roles?: string[];
  };
  visibility?: {
    showInTabs?: boolean;
    showInSidebar?: boolean;
  };
  featureFlag?: string; // Feature flag to enable/disable route
  params?: Array<{ name: string; type: string; required: boolean }>;
}
```

#### Configurable Navigation (Web)

```typescript
import { ConfigurableRouter } from './navigation/ConfigurableRouter';
import { ConfigurableSidebar } from './components/ConfigurableSidebar';
import { ConfigurableTabs } from './components/ConfigurableTabs';

// Routes generated from config
<ConfigurableRouter defaultLayout={DashboardLayout} />

// Sidebar from config
<ConfigurableSidebar
  isOpen={sidebarOpen}
  onClose={() => setSidebarOpen(false)}
  onNavigate={(path) => navigate(path)}
  currentPath={location.pathname}
/>

// Tab bar from config
<ConfigurableTabs
  onNavigate={(path) => navigate(path)}
  currentPath={location.pathname}
/>
```

#### Fallback Configuration

When remote config is unavailable, the app uses `fallbackConfig.ts`:

```typescript
// packages/shared/src/config/fallbackConfig.ts
export const fallbackConfig: RemoteAppConfig = {
  name: 'FinanceApp',
  navigation: {
    routes: [...],
    tabs: {...},
    sidebar: {...},
  },
  features: {
    darkMode: true,
    qrScanner: true,
  },
  // ...
};
```

#### Theme Mode

Theme switching (light/dark/system) is managed by ThemeModeProvider:

```typescript
import { useThemeMode, ThemeModeProvider } from '@app/shared';

// Wrap app
<ThemeModeProvider defaultMode="system">
  <App />
</ThemeModeProvider>

// Use in components
const { mode, resolvedMode, setMode, toggleMode } = useThemeMode();
```

### Authentication

- Auth is configured in the `auth` section of `AppConfig`
- Supports Google OAuth and Microsoft Entra ID
- Use `useAuth()` hook for auth state and actions
- Auth can be enabled/disabled via `auth.enabled` config
- Configure providers with client IDs from `.env` file

```typescript
// Example: Check if user is authenticated
const { isAuthenticated, user, login, logout } = useAuth();

// Example: Login with a provider
await login('google'); // or 'entra'
```

## Key Files Reference

| File                                                | Purpose                                                              |
| --------------------------------------------------- | -------------------------------------------------------------------- |
| `packages/types/src/index.ts`                       | All shared TypeScript types (incl. RemoteAppConfig, RouteDefinition) |
| `packages/config/src/index.ts`                      | App configuration (including auth)                                   |
| `packages/shared/src/config/ConfigProvider.tsx`     | Remote config context & hooks                                        |
| `packages/shared/src/config/ConfigService.ts`       | Config fetching, caching, validation                                 |
| `packages/shared/src/config/fallbackConfig.ts`      | Local fallback when offline                                          |
| `packages/shared/src/registry/ComponentRegistry.ts` | Dynamic screen/layout resolution                                     |
| `packages/shared/src/theme/ThemeModeProvider.tsx`   | Theme mode (light/dark/system)                                       |
| `packages/ui/src/tamagui.config.ts`                 | Tamagui theme configuration                                          |
| `packages/shared/src/providers/AppProvider.tsx`     | Root provider component                                              |
| `packages/shared/src/auth/AuthContext.tsx`          | Auth provider and hooks                                              |
| `apps/web/src/App.tsx`                              | Web app entry point with registry setup                              |
| `apps/web/src/navigation/ConfigurableRouter.tsx`    | Config-driven React Router                                           |
| `apps/web/src/components/ConfigurableSidebar.tsx`   | Config-driven sidebar menu                                           |
| `apps/web/src/components/ConfigurableTabs.tsx`      | Config-driven tab bar                                                |
| `apps/web/src/auth/WebAuthProvider.tsx`             | Web-specific auth implementation                                     |
| `apps/mobile/app/_layout.tsx`                       | Mobile app root layout                                               |
| `apps/mobile/app/(tabs)/_layout.tsx`                | Mobile tabs with config metadata                                     |
| `apps/mobile/auth/MobileAuthProvider.tsx`           | Mobile-specific auth implementation                                  |
| `.env.example`                                      | Environment variables template                                       |

## Adding New Features

### Adding a New Shared Component

1. Create component in `packages/ui/src/components/`
2. Export from `packages/ui/src/components/index.ts`
3. Use in both web and mobile apps

### Adding a New Screen (Config-Driven)

1. Create screen component in `apps/web/src/screens/` or shared package
2. Register screen in component registry (`apps/web/src/App.tsx`):
   ```typescript
   registry.registerScreen('MyNewScreen', MyNewScreen);
   ```
3. Add route definition to `fallbackConfig.ts` (and backend config):
   ```typescript
   {
     id: 'my-route',
     path: '/my-route',
     title: 'My Route',
     icon: 'Star',
     screen: 'MyNewScreen',
     access: { type: 'authenticated' },
     visibility: { showInTabs: true, showInSidebar: true },
   }
   ```

**Mobile:**

1. Create screen in `apps/mobile/app/`
2. Expo Router handles routing automatically
3. Tab metadata comes from config via `useRemoteNavigation()`

### Adding New Configuration Options

1. Add types to `packages/types/src/index.ts`
2. Update `defaultAppConfig` in `packages/config/src/index.ts`
3. Update `fallbackConfig.ts` in `packages/shared/src/config/`

### Feature Flags

Routes can be conditionally enabled via feature flags:

```typescript
// In route definition
{ id: 'qr-scanner', screen: 'QRScannerScreen', featureFlag: 'qrScanner' }

// In config
features: {
  qrScanner: true,  // Route is visible
  newFeature: false, // Route is hidden
}
```

---

_Last updated: 2026-02-07_
