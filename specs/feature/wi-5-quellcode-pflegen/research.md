# Research: Enforce English-Only Source Code Comments

**Date**: 2026-03-08
**Feature**: `feature/wi-5-quellcode-pflegen`

## Research Task 1: Current State of Non-English Comments

**Decision**: No translation work is needed at this time.

**Rationale**: A comprehensive scan of all `.ts`, `.tsx`, `.js`, and `.jsx` files in `apps/` and `packages/` directories found **zero non-English code comments**. All existing code comments are already written in English.

**Method**: Searched all source files for inline comments (`//`), block comments (`/* */`), and JSDoc comments (`/** */`) containing non-ASCII characters or German-language patterns.

**Findings**:
- German content exists only in **string values** (not comments):
  - `packages/shared/src/i18n/locales/de.ts` — i18n translation file (intentional, out of scope)
  - `packages/shared/src/config/fallbackConfig.ts` — demo workflow form labels (content, out of scope)

## Research Task 2: Distinguishing Comments from Content

**Decision**: The scope is strictly limited to code comments (`//`, `/* */`, `/** */`). String literals, template literals, and configuration values are excluded.

**Rationale**: i18n locale files and configuration demo data contain legitimate non-English content that serves a functional purpose (multilingual support, demo data).

**Alternatives Considered**:
- Translate all German content including strings → Rejected: would break i18n functionality and remove intentional German demo data
- Only translate comments + German string constants → Rejected: configuration strings are user-facing content, not developer documentation

## Research Task 3: Verification Approach

**Decision**: Use a grep-based scan to verify compliance.

**Rationale**: A simple command can identify all comments and flag any containing non-English text. This provides a repeatable verification method.

**Approach**: Scan all `.ts/.tsx/.js/.jsx` files, extract comments, and verify they contain only English text.
