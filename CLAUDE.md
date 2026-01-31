# CLAUDE.md - AI Assistant Guidelines

This file provides guidance for AI assistants working with this repository.

## Repository Overview

**Repository:** cp-test-01
**Status:** New/Fresh repository
**Primary Branch:** `main` (to be established)

## Project Structure

```
cp-test-01/
├── CLAUDE.md          # AI assistant guidelines (this file)
└── .git/              # Git version control
```

*This section will be updated as the project structure evolves.*

## Development Workflow

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

Example: `feat: add user authentication module`

### Pull Request Process

1. Create a feature branch from main
2. Make changes with clear, atomic commits
3. Push to remote and create PR
4. Ensure all checks pass before merging

## Code Conventions

### General Principles

- Write clean, readable, and maintainable code
- Follow the principle of least surprise
- Keep functions small and focused
- Prefer explicit over implicit behavior
- Add comments only where logic isn't self-evident

### File Organization

- Group related files in logical directories
- Use clear, descriptive file names
- Keep configuration files in the root or a dedicated config directory

## AI Assistant Guidelines

### When Working on This Repository

1. **Read before modifying**: Always read existing files before making changes
2. **Stay focused**: Only make changes that are directly requested
3. **Avoid over-engineering**: Keep solutions simple and minimal
4. **No unnecessary additions**: Don't add features, refactoring, or improvements beyond what's asked
5. **Test changes**: Verify modifications work as expected

### Code Quality Checklist

- [ ] Changes address the specific request
- [ ] No introduction of security vulnerabilities
- [ ] Code follows existing patterns and conventions
- [ ] No extraneous files or changes included

### Communication

- Provide clear explanations of changes made
- Reference specific file paths and line numbers when discussing code
- Ask clarifying questions when requirements are ambiguous

## Build and Test Commands

*Commands will be added as the project tooling is established.*

```bash
# Placeholder - update with actual commands
# npm install       # Install dependencies
# npm run build     # Build the project
# npm run test      # Run tests
# npm run lint      # Run linter
```

## Environment Setup

*Setup instructions will be added as the project develops.*

### Prerequisites

- Git

### Getting Started

```bash
git clone <repository-url>
cd cp-test-01
# Additional setup steps to be added
```

## Key Files Reference

| File | Purpose |
|------|---------|
| `CLAUDE.md` | AI assistant guidelines and project documentation |

*This table will be expanded as key files are added.*

## Notes for Future Updates

- Add language-specific conventions when primary language is established
- Include testing framework guidelines when tests are implemented
- Document API patterns if applicable
- Add deployment procedures when CI/CD is configured

---

*Last updated: 2026-01-31*
