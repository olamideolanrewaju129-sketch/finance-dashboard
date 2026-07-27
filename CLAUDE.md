# CLAUDE.md

Guidance for AI assistants (Cursor, Claude Code, etc.) working in this repository.

## Project
FinanceDash — a fintech dashboard for cash flow, spending insights, and budget tracking.

## Stack
- React (functional components + hooks only)
- Vite as the build tool
- Tailwind CSS for styling
- Context API for global state (see src/context/AppContext.jsx)
- localStorage for persistence

## Conventions
- Components: PascalCase, one component per file, in src/components/
- Commits: Conventional Commits format (feat:, fix:, docs:, chore:, refactor:, style:, test:)
- Prefer functional, declarative code over classes or imperative loops

## Project Rules (learned from AI-assisted workflow drill, FE-03)

1. All currency values must use the Naira symbol (₦) via a UTF-8 safe method, and the rendered output must be visually verified — this encoding has silently broken before and is not caught by default tooling, only by explicit testing or manual inspection.

2. Form validation logic must live in a separate file under src/utils/, never written inline inside a component. This keeps validation testable in isolation and was the clearest structural difference between a rushed implementation and a properly reviewed one.

3. Any list-based form input (e.g. category names in budget settings) must include case-insensitive duplicate detection before saving. Native HTML5 validation does not catch this; custom logic is required.

## AI Assistant Notes
- Always explain non-trivial changes before applying them
- Do not introduce new dependencies without flagging it first
- When building forms, include a verification step (tests or a manual test plan) before reporting the task as complete
