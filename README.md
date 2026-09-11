# MeuCarrinho UI

MeuCarrinho UI is a Next.js application for creating and following shopping sessions. It provides a small, tested journey for listing active sessions, creating a session, opening its summary, and retrieving that same session after a browser reload. The Next.js BFF forwards every request to the `meucarrinho-api` Spring Boot backend, which owns persistence in PostgreSQL — the browser never calls Spring directly.

## Requirements

- Node.js 24.20.0
- npm 11.19.0
- A running `meucarrinho-api` instance (see its README) with PostgreSQL and LocalStack up via `docker compose up -d` and `./mvnw spring-boot:run`

## Start locally

```bash
nvm use
npm ci
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

`.env.local` must point `MEUCARRINHO_API_URL` at the local Spring API, typically `http://localhost:8080/api/v1`. This value is server-only and must never be exposed with a `NEXT_PUBLIC_` prefix.

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

The server side follows a separate dependency direction:

```text
Route Handler → BFF → HTTP client → Spring API
```

Route Handlers own HTTP concerns and translate `ApiError`/`ProblemDetail` failures into a frontend-safe `{ code, message }` shape. The BFF module (`src/server/shopping-session/shoppingSession.bff.ts`) owns the mapping to Spring endpoints. `src/server/http/apiClient.ts` owns the actual `fetch` call against `MEUCARRINHO_API_URL`, and `src/server/http/apiError.ts` owns parsing Spring's `ProblemDetail` error bodies.

## Data boundary

All network responses cross the same explicit boundary:

```text
unknown JSON → Zod validation → DTO → mapper → UI model
```

Transport statuses are converted by the mapper. Validated ISO date strings remain unchanged in the UI model so RTK Query keeps fully serializable cache data; they are parsed only by the feature date formatter when displayed. Components receive the UI model and do not parse transport data.

## State ownership

RTK Query owns shopping-session server state and caching. The URL owns the current `sessionId`. Components own only ephemeral UI state; query data is not copied into component state.

## Controller hooks

Feature-level orchestration hooks use the `Controller` suffix. `useSessionsHomeController` and `useShoppingSessionController` translate infrastructure state into screen state and user intentions, and contain no markup.

Data-fetching hooks keep their conventional names. In particular, generated RTK Query hooks do not use the `Controller` suffix; that convention is reserved for feature orchestration.

## Shared UI rule

A UI primitive becomes shared only when reuse, accessibility, or consistent behavior justifies the shared dependency. Feature-specific presentation remains inside its feature.

## Known backend issue: `createdAt` on session creation

`POST /sessions` (and `/duplicate`) on `meucarrinho-api` currently returns `createdAt: null` for the new session, because `ShoppingSessionService.create()`/`.duplicate()` build the response from the in-memory entity instead of the one returned by `sessionRepository.save(...)` (a manually-assigned `@Id` with no `@Version`/`Persistable` makes Spring Data JPA merge rather than persist, so the `@PrePersist`-set timestamp never reaches the response). A follow-up `GET` always returns the real value.

`getSessions`/`getSession` on the frontend keep the DTO schema strict (no null `createdAt`), but `createSession`'s `transformResponse` in `src/features/shopping-session/api/shoppingSession.api.ts` uses a schema that tolerates a null `createdAt` and falls back to the client's current time for display. Remove that override once the backend fix lands.

## Current scope and non-goals

The current scope covers listing shopping sessions (filtered to active on the home screen), empty/loading/error states, creating a named session against the real backend, navigating to its detail route, retrieving it after reload or server restart, and displaying its status, date, item count, and total.

The current slice does not render item records, update quantities, derive totals client-side, display recent or completed-session history, upload label photos, provide authentication, or expose store name/budget in the UI yet. The transport and UI-model contracts (`ShoppingSessionSummary`/`ShoppingSessionDetail`/`ShoppingSessionItem`) already carry that data from the backend; only the screens that render it are still pending.

## Next slice: Shopping session items + quantity update

Planned, but intentionally not implemented here:

```text
render session detail items (ShoppingSessionDetail.items)
→ change an item's quantity
→ perform an RTK Query mutation
→ optimistically update the cached session detail
→ request succeeds: keep the optimistic state
  request fails: roll back the optimistic state
→ recalculate and display updated totals
```

This slice is intended to exercise server-state ownership, RTK Query cache behavior, mutations, optimistic updates and rollback, cache invalidation/update strategy, derived totals, controller orchestration, BFF mutation handling, and integration testing.

Adding new items is deliberately deferred to the following slice. The feature sequence is:

```text
Current completed slice
→ Shopping session items + quantity update
→ Add Item workflow
```

### Quantity mutation direction

The expected HTTP direction is:

```http
PATCH /api/bff/sessions/:sessionId/items/:itemId/quantity
```

The exact payload can be decided with that slice. Its RTK Query endpoint should practice an optimistic cache update through `onQueryStarted` and `api.util.updateQueryData(...)`, retaining the patch when `queryFulfilled` succeeds and undoing it when the request fails:

```ts
const patchResult = dispatch(api.util.updateQueryData(/* ... */));

try {
  await queryFulfilled;
} catch {
  patchResult.undo();
}
```

No quantity mutation or Add Item behavior is part of the current cleanup.
