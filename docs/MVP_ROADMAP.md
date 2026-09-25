# Implementation Roadmap: LTR MVP

## Phase A: Planning & Architecture
- [x] Create project documentation (`/docs`).
- [x] Define architectural constraints (Next.js, Prisma, Integer Cents).
- [x] Establish taxonomy and scope (LTR).
- [x] Define database schema and TS types.

## Phase B: Core Financial Engine
- [x] Initialize Next.js repository (`package.json`, Vitest setup).
- [x] Implement `src/domain/finance/utils/money.ts` (cents conversions, PMT).
- [x] Implement `src/domain/finance/ltr.ts` (Acquisition, Revenue, Expenses, NOI).
- [x] Implement `src/domain/finance/solver.ts` (Binary search for Max Offer).
- [x] Write 100% test coverage using fixed, manually calculated reference cases (`npx vitest run`).

## Phase C: Persistence Layer
- [ ] Apply Prisma migrations for User, Property, Deal, InvestmentCriteria, UnderwritingVersion.
- [ ] Implement Next.js Server Actions or API Routes to save and fetch `UnderwritingVersion` JSON objects.
- [ ] Write database integration tests.

## Phase E: Dashboard & Polishing
- [ ] Build Results Dashboard (Scorecard, Break-Evens).
- [ ] Implement Downside Scenario toggles.
- [ ] Run End-to-End Playwright tests verifying full user flow.
