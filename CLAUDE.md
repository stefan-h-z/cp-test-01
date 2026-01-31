# CLAUDE.md - AI Assistant Guidelines

This file provides guidance for AI assistants working with this repository.

## Repository Overview

**Repository:** Cross-Platform App Monorepo
**Tech Stack:** React, React Native, Expo, Vite, Tamagui, TanStack Query
**Primary Branch:** `main`

## Project Structure

```
cp-test-01/
├── apps/
│   ├── web/                    # Web application (Vite + React)
│   │   ├── src/
│   │   │   ├── screens/        # Page components
│   │   │   ├── App.tsx         # Main app component
│   │   │   └── Layout.tsx      # Layout wrapper
│   │   └── vite.config.ts
│   └── mobile/                 # Mobile application (Expo + React Native)
│       ├── app/                # Expo Router pages
│       │   ├── (tabs)/         # Tab navigation screens
│       │   └── details/        # Detail screens
│       └── app.json            # Expo configuration
├── packages/
│   ├── ui/                     # Shared UI components (Tamagui)
│   │   └── src/
│   │       ├── components/     # Button, Card, Input, etc.
│   │       └── tamagui.config.ts
│   ├── shared/                 # Shared hooks, providers, utilities
│   │   └── src/
│   │       ├── hooks/          # useContent, useAppConfig, etc.
│   │       ├── providers/      # AppProvider
│   │       └── utils/          # API utilities
│   ├── config/                 # App configuration
│   │   └── src/
│   │       └── index.ts        # defaultAppConfig, createAppConfig
│   └── types/                  # TypeScript types
│       └── src/
│           └── index.ts        # All shared types
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

### Data Fetching

- Use TanStack Query hooks from `@app/shared`
- Define query keys consistently
- Handle loading and error states

### Configuration

- App configuration is defined in `@app/config`
- Use `createAppConfig()` to create custom configurations
- Access config via `useAppConfig()` hook

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

| File | Purpose |
|------|---------|
| `packages/types/src/index.ts` | All shared TypeScript types |
| `packages/config/src/index.ts` | App configuration (including auth) |
| `packages/ui/src/tamagui.config.ts` | Tamagui theme configuration |
| `packages/shared/src/providers/AppProvider.tsx` | Root provider component |
| `packages/shared/src/auth/AuthContext.tsx` | Auth provider and hooks |
| `apps/web/src/App.tsx` | Web app entry point |
| `apps/web/src/auth/WebAuthProvider.tsx` | Web-specific auth implementation |
| `apps/mobile/app/_layout.tsx` | Mobile app root layout |
| `apps/mobile/auth/MobileAuthProvider.tsx` | Mobile-specific auth implementation |
| `.env.example` | Environment variables template |

## Adding New Features

### Adding a New Shared Component

1. Create component in `packages/ui/src/components/`
2. Export from `packages/ui/src/components/index.ts`
3. Use in both web and mobile apps

### Adding a New Screen

**Web:**
1. Create screen in `apps/web/src/screens/`
2. Add route in `apps/web/src/App.tsx`

**Mobile:**
1. Create screen in `apps/mobile/app/`
2. Expo Router handles routing automatically

### Adding New Configuration Options

1. Add types to `packages/types/src/index.ts`
2. Update `defaultAppConfig` in `packages/config/src/index.ts`

---

*Last updated: 2026-01-31*
