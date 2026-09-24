# Architecture

## Technology Stack
- **Frontend / Backend:** Next.js (App Router) + TypeScript
- **Styling / UI:** Tailwind CSS (with Radix UI or shadcn/ui components)
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Validation:** Zod schemas
- **Testing:** Vitest (for domain unit tests) and Playwright (for End-to-End flows)

## Financial Engine Architecture
All financial calculations live inside a pure, dependency-free domain module: `src/domain/finance/`.
- **Pure Functions:** Calculations are deterministic. They take raw input objects and return result objects without mutating state or depending on external APIs.
- **Separation of Concerns:** React UI components must **never** contain financial formulas. They only collect data, pass it to the domain engine, and render the output.

## Money & Rate Representation
- **Strict Integer Cents:** To eliminate floating-point arithmetic errors, ALL monetary values are stored, passed, and calculated as integer cents (e.g., $1,250.50 = `125050`). 
- **Database Storage:** Prisma uses `BigInt` for cents to safely exceed the 32-bit integer limit ($21.4M).
- **Application Logic:** TypeScript uses `number` (safe up to 9 quadrillion).
- **Rates:** Percentages and rates are represented as decimal floats (e.g., 6.25% = `0.0625`).

## Maximum Offer Engine
Implemented via a deterministic numerical solver (Binary Search). For LTR, the solver targets:
- Minimum Cash-on-Cash Return.
- Minimum DSCR.
- Maximum LTV.
The algorithm evaluates purchase prices between $1 and $100M, monotonically iterating to find the exact threshold where all constraints PASS.
