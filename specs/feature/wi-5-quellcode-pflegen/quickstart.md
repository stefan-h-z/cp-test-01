# Quickstart: Enforce English-Only Source Code Comments

**Feature**: 005-english-comments
**Date**: 2026-03-08

## Overview

This feature ensures all code comments in the repository are written in English. Based on research, the codebase already complies — all comments are in English.

## What to Do

1. **Verify** that all comments in `.ts`, `.tsx`, `.js`, `.jsx` files under `apps/` and `packages/` are in English.
2. **Exclude** from scope:
   - i18n locale string values (e.g., `packages/shared/src/i18n/locales/de.ts`)
   - Configuration content strings (e.g., demo form labels in `fallbackConfig.ts`)
   - License headers
3. **Translate** any non-English comments found to English, preserving original meaning.
4. **Confirm** no i18n strings or config content strings were altered.

## Current State

- **187 source files** scanned
- **0 non-English comments** found
- **13 files** contain German characters in data/content strings (not comments) — these are out of scope

## Verification

After any changes (or confirming no changes needed):
- Run `pnpm typecheck` to ensure no type errors
- Run `pnpm build` to ensure build succeeds
- Manually spot-check files with German content strings to confirm they are unchanged
