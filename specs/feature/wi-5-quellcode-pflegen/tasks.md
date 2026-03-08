# Tasks: Enforce English-Only Source Code Comments

**Input**: Design documents from `specs/feature/wi-5-quellcode-pflegen/`
**Prerequisites**: plan.md, spec.md, research.md

**Tests**: Not requested — no test tasks included.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions

## Phase 1: Setup

**Purpose**: Establish baseline by identifying all files requiring review.

- [ ] T001 Scan all `.ts`, `.tsx`, `.js`, `.jsx` files in `apps/` and `packages/` to produce a complete inventory of files containing code comments
- [ ] T002 Categorize files into: (a) files with English-only comments (no action needed), (b) files with non-English comments (need translation), (c) i18n/locale files excluded from scope

**Checkpoint**: File inventory complete — scope of work is known.

---

## Phase 2: User Story 1 — Verify and Translate All Code Comments to English (Priority: P1) 🎯 MVP

**Goal**: Ensure every code comment (`//`, `/* */`, `/** */`) across the codebase is in English. Translate any non-English comments found.

**Independent Test**: Grep all source files for comments; verify none contain non-English text.

### Implementation for User Story 1

- [ ] T003 [P] [US1] Review and translate any non-English comments in `apps/web/src/` (all `.ts` and `.tsx` files)
- [ ] T004 [P] [US1] Review and translate any non-English comments in `apps/mobile/` (all `.ts` and `.tsx` files)
- [ ] T005 [P] [US1] Review and translate any non-English comments in `packages/ui/src/` (all `.ts` and `.tsx` files)
- [ ] T006 [P] [US1] Review and translate any non-English comments in `packages/shared/src/` (all `.ts` and `.tsx` files), excluding i18n string values in `packages/shared/src/i18n/locales/de.ts`
- [ ] T007 [P] [US1] Review and translate any non-English comments in `packages/config/src/` (all `.ts` files)
- [ ] T008 [P] [US1] Review and translate any non-English comments in `packages/types/src/` (all `.ts` files)
- [ ] T009 [US1] Run a final verification scan across entire `apps/` and `packages/` to confirm zero non-English comments remain

**Checkpoint**: All code comments are verified to be in English. User Story 1 is complete.

---

## Phase 3: User Story 2 — Verify Content Strings Are Unchanged (Priority: P2)

**Goal**: Confirm that i18n locale strings and configuration content strings were not accidentally modified during the comment review.

**Independent Test**: Diff `packages/shared/src/i18n/locales/de.ts` and `packages/shared/src/config/fallbackConfig.ts` against their original versions to verify no content string changes.

### Implementation for User Story 2

- [ ] T010 [P] [US2] Verify `packages/shared/src/i18n/locales/de.ts` — confirm all German translation strings are intact and unchanged
- [ ] T011 [P] [US2] Verify `packages/shared/src/config/fallbackConfig.ts` — confirm all German demo workflow labels and form content strings are intact and unchanged
- [ ] T012 [US2] Document verification results confirming no content strings were altered

**Checkpoint**: Content string integrity confirmed. User Story 2 is complete.

---

## Phase 4: Polish & Cross-Cutting Concerns

**Purpose**: Final validation and documentation.

- [ ] T013 Run full codebase verification: grep all `.ts/.tsx/.js/.jsx` files for non-ASCII characters in comments to catch any remaining non-English text
- [ ] T014 Update spec status from "Draft" to "Complete" in `specs/feature/wi-5-quellcode-pflegen/spec.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **User Story 1 (Phase 2)**: Depends on Phase 1 (file inventory)
- **User Story 2 (Phase 3)**: Depends on User Story 1 completion (verifies nothing was broken)
- **Polish (Phase 4)**: Depends on both user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Setup — core task
- **User Story 2 (P2)**: Should run after US1 to verify no side effects

### Parallel Opportunities

- T003–T008 can all run in parallel (different directories, no dependencies)
- T010–T011 can run in parallel (different files)

---

## Parallel Example: User Story 1

```bash
# Launch all directory reviews in parallel:
Task: "Review and translate comments in apps/web/src/"
Task: "Review and translate comments in apps/mobile/"
Task: "Review and translate comments in packages/ui/src/"
Task: "Review and translate comments in packages/shared/src/"
Task: "Review and translate comments in packages/config/src/"
Task: "Review and translate comments in packages/types/src/"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (file inventory)
2. Complete Phase 2: User Story 1 (review and translate all comments)
3. **STOP and VALIDATE**: Run verification scan
4. Commit changes

### Incremental Delivery

1. Setup → File inventory ready
2. User Story 1 → All comments in English → Commit (MVP!)
3. User Story 2 → Content strings verified intact → Commit
4. Polish → Final validation complete

---

## Notes

- Current codebase scan found **no German code comments** — all comments are already in English
- The primary value of this task is **verification and documentation** that the standard is met
- If non-English comments are found during the detailed review, they should be translated preserving original meaning
- Excluded from scope: i18n locale strings (`de.ts`), configuration demo content (`fallbackConfig.ts`)
- [P] tasks = different files, no dependencies
- Commit after each phase or logical group
