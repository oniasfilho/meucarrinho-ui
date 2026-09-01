# MeuCarrinho UI

MeuCarrinho UI is a Next.js application for creating and following shopping sessions. The current slice provides a small, tested journey for listing active sessions, creating a session, opening its summary, and retrieving that same session after a browser reload through a development-only fake BFF.

## Requirements

- Node.js 24.20.0
- npm 11.19.0

## Start locally

```bash
nvm use
npm ci
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Commands

| Command                | Purpose                                                  |
| ---------------------- | -------------------------------------------------------- |
| `npm run dev`          | Starts the Next.js development server.                   |
| `npm run build`        | Creates the optimized production bundle.                 |
| `npm run start`        | Serves a previously built production bundle.             |
| `npm run lint`         | Checks the codebase with ESLint.                         |
| `npm run typecheck`    | Checks TypeScript types without emitting files.          |
| `npm test`             | Runs the Jest unit and integration test suite.           |
| `npm run test:watch`   | Runs Jest in interactive watch mode.                     |
| `npm run test:e2e`     | Runs the Playwright browser smoke journey.               |
| `npm run format`       | Formats supported files with Prettier.                   |
| `npm run format:check` | Verifies formatting without changing files.              |
| `npm run validate`     | Runs type checking, linting, and Jest tests in sequence. |

## Project boundaries

The browser-facing dependency direction is:

```text
app → feature → shared/contracts
```

`app` composes routes and providers. A feature owns its screens, controllers, API endpoints, and UI model. Reusable infrastructure and UI primitives live in `shared`, while transport contracts live in `contracts`.

The server-side fake follows a separate dependency direction:

```text
Route Handler → BFF → fake repository
```

Route Handlers own HTTP concerns, the BFF owns application scenarios and artificial delay, and the repository owns the process-lifetime data store.

## Data boundary

All network responses cross the same explicit boundary:

```text
unknown JSON → Zod validation → DTO → mapper → UI model
```

Transport statuses and ISO date strings are converted only by the mapper. Components receive the UI model and do not parse transport data.

## State ownership

RTK Query owns shopping-session server state and caching. The URL owns the current `sessionId`. Components own only ephemeral UI state; query data is not copied into component state.

## Controller hooks

Feature-level orchestration hooks use the `Controller` suffix. `useSessionsHomeController` and `useShoppingSessionController` translate infrastructure state into screen state and user intentions, and contain no markup.

Data-fetching hooks keep their conventional names. In particular, generated RTK Query hooks do not use the `Controller` suffix; that convention is reserved for feature orchestration.

## Shared UI rule

A UI primitive becomes shared only when reuse, accessibility, or consistent behavior justifies the shared dependency. Feature-specific presentation remains inside its feature.

## Fake BFF scenarios

The local fake BFF reads these server-side environment variables:

| Variable                   | Supported values            | Behavior                                                                                      |
| -------------------------- | --------------------------- | --------------------------------------------------------------------------------------------- |
| `FAKE_BFF_DELAY_MS`        | A non-negative number       | Adds that many milliseconds of delay. Missing, negative, or non-numeric values mean no delay. |
| `FAKE_BFF_LIST_SCENARIO`   | `success`, `empty`, `error` | Returns repository sessions, an empty list, or a `BFF_UNAVAILABLE` response.                  |
| `FAKE_BFF_CREATE_SCENARIO` | `success`, `error`          | Creates a session or returns a `BFF_UNAVAILABLE` response.                                    |

Copy `.env.example` to `.env.local` before local development. Restart `npm run dev` after changing a scenario because the server process reads these values at runtime.

## Fake persistence limitation

The fake repository stores sessions in one process-lifetime `globalThis` map. Created sessions survive route changes and browser reloads, but restarting the development server clears them. This is not durable persistence and is unsuitable for multi-instance deployment.

## Current scope and non-goals

The current scope covers listing active shopping-session summaries, empty/loading/error states, creating a named session, navigating to its detail route, retrieving it after reload, and displaying its status, date, item count, and total.

The current slice does not manage item records, update quantities, derive totals from item source data, display recent or completed-session history, provide authentication, or offer production persistence. Seeded sessions with non-zero counts show only their summary because the item-list contract belongs to the next slice.

## Next slice

Planned, but intentionally not implemented here:

```text
Add item
→ update quantity
→ calculate total from item source data
→ display the item in the active session
```
