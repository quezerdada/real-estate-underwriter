# Implementation Roadmap: LTR MVP

## Phase A: Planning & Architecture
- [x] Create project documentation (`/docs`).
- [x] Define architectural constraints (Next.js, Prisma, Integer Cents).
- [x] Establish taxonomy and scope (LTR).
- [x] Define database schema and TS types.

## Phase B: Core Financial Engine
- [ ] Initialize Next.js repository (`npx create-next-app`, setup Prisma, Vitest).
- [ ] Implement `src/domain/finance/utils/money.ts` (cents conversions, PMT).
- [ ] Implement `src/domain/finance/ltr.ts` (Acquisition, Revenue, Expenses, NOI).
- [ ] Implement `src/domain/finance/solver.ts` (Binary search for Max Offer).
- [ ] Write 100% test coverage using fixed, manually calculated reference cases.

## Phase C: Persistence Layer
- [ ] Apply Prisma migrations for User, Property, Deal, InvestmentCriteria, UnderwritingVersion.
- [ ] Implement Next.js Server Actions or API Routes to save and fetch `UnderwritingVersion` JSON objects.
- [ ] Write database integration tests.

## Phase D: UI & Workflows
- [ ] Setup UI library (Tailwind + shadcn/ui).
- [ ] Build guided LTR input forms (Property -> Acquisition -> Income -> Expenses -> Financing).
- [ ] Add Zod validation (prevent negative purchase prices, enforce logical bounds).
- [ ] Connect form state to `src/domain/finance` to calculate real-time results.

## Phase E: Dashboard & Polishing
- [ ] Build Results Dashboard (Scorecard, Break-Evens).
- [ ] Implement Downside Scenario toggles.
- [ ] Run End-to-End Playwright tests verifying full user flow.
