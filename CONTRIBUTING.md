# Contributing to LeaveFlow

Thanks for your interest in contributing! This guide will help you get started.

## Development Setup

1. Fork and clone the repo
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env.local` and fill in values
4. Start the dev server: `npm run dev`

## Branch Naming

- `feat/short-description` — new features
- `fix/short-description` — bug fixes
- `docs/short-description` — documentation changes

## Commit Style

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add email notifications
fix: resolve date formatting bug
docs: update README with screenshots
refactor: simplify auth middleware
```

## Pull Requests

1. Create a feature branch from `main`
2. Make your changes in small, focused commits
3. Run tests and lint before pushing: `npm run test && npm run lint`
4. Open a PR with a clear description of **what** changed and **why**
5. Link any related issues

## Code Style

- TypeScript strict mode — no `any` types
- Follow existing patterns in the codebase
- Keep components focused — one responsibility per file
- Comment the *why*, not the *what*

## Testing

- Write unit tests for utility functions
- Add e2e tests for critical user flows
- Run the full suite before submitting: `npm run test && npm run test:e2e`

## Questions?

Open a [GitHub Discussion](https://github.com/your-username/leaveflow/discussions) or reach out on the Digital Heroes community.
