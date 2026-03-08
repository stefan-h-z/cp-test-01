# Implementation Plan: Enforce English-Only Source Code Comments

**Branch**: `feature/wi-5-quellcode-pflegen` | **Date**: 2026-03-08 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `specs/feature/wi-5-quellcode-pflegen/spec.md`

## Summary

Ensure all code comments in the repository are written in English. Research confirms that all existing comments are already in English — no translation is needed. The implementation focuses on verifying compliance and documenting the English-only comment standard.

## Technical Context

**Language/Version**: TypeScript 5.x
**Primary Dependencies**: React, React Native, Expo, Vite, Tamagui, TanStack Query
**Storage**: N/A (no data changes)
**Testing**: Manual verification via codebase scan
**Target Platform**: Web (Vite + React) and Mobile (Expo + React Native)
**Project Type**: Cross-platform app monorepo
**Performance Goals**: N/A (code quality/maintenance task)
**Constraints**: Must not modify i18n locale strings or configuration content strings
**Scale/Scope**: All `.ts`, `.tsx`, `.js`, `.jsx` files in `apps/` and `packages/` directories

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

The project constitution is not yet configured (template placeholders only). No gates to evaluate. **PASS** — no violations possible.

## Project Structure

### Documentation (this feature)

```text
specs/feature/wi-5-quellcode-pflegen/
├── plan.md              # This file
├── research.md          # Phase 0 output (complete)
├── spec.md              # Feature specification
└── checklists/
    └── requirements.md  # Spec quality checklist
```

### Source Code (repository root)

```text
apps/
├── web/src/             # Web application source files
└── mobile/              # Mobile application source files

packages/
├── ui/src/              # Shared UI components
├── shared/src/          # Shared hooks, providers, utilities
│   ├── config/          # ConfigService, fallbackConfig (German demo content - DO NOT MODIFY)
│   └── i18n/locales/    # Locale files including de.ts (DO NOT MODIFY)
├── config/src/          # App configuration
└── types/src/           # TypeScript types
```

**Structure Decision**: No new files or directories are created in the source code. This is a verification-only task that confirms existing compliance.

## Implementation Approach

### Current State

Research (see [research.md](research.md)) confirms:
- **Zero non-English code comments found** in the entire codebase
- All existing inline (`//`), block (`/* */`), and JSDoc (`/** */`) comments are in English
- German content exists only in i18n locale files and configuration demo strings (excluded from scope per FR-003/FR-004)

### Required Actions

1. **Verify compliance**: Perform a final scan to confirm all comments are in English
2. **Document the standard**: The English-only comment requirement is now documented in the spec for future reference

### Files Excluded from Scope

| File | Reason |
|------|--------|
| `packages/shared/src/i18n/locales/de.ts` | i18n translation strings (FR-003) |
| `packages/shared/src/config/fallbackConfig.ts` | Demo content strings (FR-004) |

## Complexity Tracking

No complexity violations — this is a straightforward verification task with no architectural changes.
