# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

A TypeScript modulith: one codebase and one Docker image, but multiple independently deployable processes — an HTTP API and separate Kafka consumers. The API handles HTTP traffic and publishes domain events to Kafka; consumers subscribe to topics and run side effects asynchronously. In production each process runs as a separate ECS service from the same ECR image with a different command.

```
Client --> API --> Kafka --> user-marketing-consumer
                          --> product-restocked-consumer
```

## Commands

- `npm run dev` — start the full stack via `docker compose up --build` (API on :3000, both consumers, Kafka, topic init). This is the primary way to run the app locally.
- `npm run compose:down` — tear down compose, including volumes. Run this after adding npm packages locally, then `npm run dev` again to rebuild.
- `npm run compile` — `tsc -p tsconfig.build.json` + `tsc-alias` → `dist/` (resolves path aliases in compiled output).
- `npm run lint` / `npm run lint:fix` — ESLint.
- `npm run format` / `npm run format:check` — Prettier.
- `npm test` — `vitest run` (all tests, single run).
- `npm run test:watch` — vitest watch mode.
- Single test file: `npx vitest run src/api/__tests__/product.service.test.ts`.

Lint and test can run outside Docker (needs Node 22). Running the app itself needs Docker (Kafka + compose topology).

## Architecture

| Process                      | Role                                  | Entrypoint                                       |
| ---------------------------- | ------------------------------------- | ------------------------------------------------ |
| API                          | HTTP server, publishes events         | `src/api/app.ts`                                 |
| `user-marketing-consumer`    | Handles marketing consent updates     | `src/consumers/user-marketing-consumer/index.ts` |
| `product-restocked-consumer` | Handles product restock notifications | `src/consumers/product-restocked/index.ts`       |

Path aliases (see `tsconfig.json`): `@api/*` → `src/api`, `@consumers/*` → `src/consumers`, `@shared/*` → `src/shared`.

**Kafka topics** — the contract between API and consumers, defined as the `Topics` enum in `src/shared/kafka/topics.ts`:

| Topic                    | Published by                           | Consumed by                  |
| ------------------------ | -------------------------------------- | ---------------------------- |
| `user-marketing-consent` | `POST /api/user/:id/marketing-consent` | `user-marketing-consumer`    |
| `product-restocked`      | `POST /api/product/:id/restock`        | `product-restocked-consumer` |

Topics are created on compose startup by `scripts/kafka/create-topics.sh`. When adding a new topic, keep three things in sync: the `Topics` enum, this script, and a new message model under `src/shared/kafka/messages/`.

## Code patterns

**API module structure** — each feature lives in `src/api/modules/<feature>/` as `router → controller → service → repository → model`. Every class is exported as a singleton instance (e.g. `export const productService = new ProductService()`); services take their repository as a constructor default argument (`constructor(repository = productRepository)`) so tests can inject a fake. Follow this shape for new features rather than introducing a different pattern.

**Error handling** — controllers wrap logic in try/catch and call `next(err)`. Use `AppError(status, message)` (`src/api/middlewares/error.middleware.ts`) for expected HTTP errors (e.g. 404); anything else bubbles up as an unhandled 500 through `errorMiddleware`, which is mounted centrally rather than per-route.

**Kafka wiring** — `src/shared/kafka/producer.ts` and `consumer.ts` are thin, generic wrappers over kafkajs (`KafkaProducer`/`KafkaConsumer`, JSON-serialize/parse messages, typed via generics). Each process instantiates its own client in a local `lib/kafka.ts` (e.g. `src/api/lib/kafka.ts`, `src/consumers/product-restocked/lib/kafka.ts`) — clients are not shared across processes.

**Consumer process shape** — each consumer under `src/consumers/<name>/` follows: `index.ts` (entrypoint; connects, subscribes, and handles `SIGINT`/`SIGTERM` for graceful shutdown) → `lib/setup-consumer.ts` (connect + subscribe wiring) → `handle-message.ts` (business logic, unit-tested in isolation) → `lib/kafka.ts` (client instance) → `env-constants.ts` (reads `process.env` once at module load for that process).

**Tests** — live in a `__tests__/` folder per deployable unit (`src/api/__tests__/`, `src/consumers/<name>/__tests__/`), colocated at that level rather than next to individual files. `tsconfig.json` includes tests (for editor support); `tsconfig.build.json` excludes them from the compiled `dist/` output.

**Import order** is enforced by ESLint (`eslint.config.mts`): builtin → external → internal (with `@shared` before `@api` before `@consumers`) → parent/sibling/index → type, alphabetized within groups. Let `lint:fix` sort imports rather than ordering by hand.

## CI/CD

On every push/PR to `main`: lint and test run in parallel. On push to `main`, after both pass: a production Docker image (`runtime` stage) is built and pushed to ECR, tagged with the git SHA. Compilation happens inside the Docker `build` stage — there is no separate compile job in CI. See `docs/deployment.md` for the full production picture (ECR → ECS, MSK, per-service command overrides).
