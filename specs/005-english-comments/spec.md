# Feature Specification: Enforce English-Only Source Code Comments

**Feature Branch**: `005-english-comments`
**Created**: 2026-03-08
**Status**: Draft
**Input**: User description: "Ticket #5: quellcode pflegen – alle kommentare im quellcode sollen auf englisch sein."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Verify All Code Comments Are in English (Priority: P1)

A developer reviews the entire codebase to ensure that all code comments (inline `//`, block `/* */`, and JSDoc `/** */`) are written in English. Any non-English comments are translated to English while preserving their original meaning and context.

**Why this priority**: This is the core requirement — ensuring consistency and readability for an international development team.

**Independent Test**: Can be fully tested by scanning all source files for comments and verifying each comment is in English. Delivers immediate value by establishing a consistent language standard.

**Acceptance Scenarios**:

1. **Given** the full codebase, **When** a reviewer inspects all `.ts`, `.tsx`, `.js`, and `.jsx` files, **Then** every code comment is written in English.
2. **Given** a file with non-English comments, **When** the comments are translated, **Then** the translated comments accurately convey the same meaning as the originals.
3. **Given** the codebase contains i18n/localization files (e.g., `de.ts`), **When** reviewing these files, **Then** translation strings inside locale data are excluded from the English-only rule (they are content, not comments).

---

### User Story 2 - Distinguish Comments from Content Strings (Priority: P2)

A developer ensures that the English-only rule applies strictly to code comments and not to user-facing content strings, configuration values, or i18n locale data that may legitimately contain non-English text.

**Why this priority**: Prevents false positives and avoids breaking intentional multilingual content such as demo data or translations.

**Independent Test**: Can be tested by verifying that i18n locale files, configuration demo strings, and user-facing labels in non-English locales remain unchanged after the cleanup.

**Acceptance Scenarios**:

1. **Given** a German i18n locale file (`de.ts`), **When** the English-only comment rule is applied, **Then** the file's translation strings remain in German (only comments within the file, if any, are in English).
2. **Given** configuration files with German demo content (e.g., `fallbackConfig.ts` workflow labels), **When** the rule is applied, **Then** the demo content strings remain unchanged.

---

### Edge Cases

- What happens when a comment contains mixed languages (e.g., English with a German technical term)? — Keep English as the primary language; German domain-specific terms may remain if no standard English equivalent exists, but should be annotated.
- What happens with TODO/FIXME comments in non-English? — Translate them to English like any other comment.
- What about auto-generated comments or license headers? — Leave license headers as-is; translate auto-generated comments if they are non-English.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: All code comments (`//`, `/* */`, `/** */`) across the entire codebase MUST be written in English.
- **FR-002**: Non-English code comments MUST be translated to English while preserving their original meaning and technical accuracy.
- **FR-003**: i18n/localization string values (e.g., in `de.ts`) MUST NOT be modified — only comments within those files are subject to the English-only rule.
- **FR-004**: Configuration content strings (e.g., demo form labels in `fallbackConfig.ts`) MUST NOT be modified — they are user-facing content, not comments.
- **FR-005**: File types in scope MUST include `.ts`, `.tsx`, `.js`, `.jsx` files across `apps/` and `packages/` directories.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of code comments in the repository are in English after the cleanup is complete.
- **SC-002**: Zero i18n locale strings or configuration content strings are altered during the process.
- **SC-003**: All translated comments accurately preserve the intent and meaning of the original non-English comments.
