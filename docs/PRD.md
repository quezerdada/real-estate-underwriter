# Product Requirements Document (PRD)

## Core Product Goal
A real-estate investment underwriting platform that deterministically calculates what an investment produces (returns, risks, metrics) and the maximum price an investor should pay to satisfy their unique requirements. 

## Core Investment Strategies Taxonomy
The platform structurally supports four primary real estate strategies:
1. **Buy & Hold (Long-Term Rentals — LTR)**
2. **Fix and Flip (Renovate and Resell)**
3. **BRRRR (Buy, Rehab, Rent, Refinance, Repeat)**
4. **Short-Term Rentals (STR — Vacation / Temporary Stays)**

## Scope: First Vertical Slice (MVP)
The MVP will focus **exclusively on the Buy & Hold (LTR) strategy**. 
By building the core LTR engine first, we establish the fundamental acquisition, operations, financing, scenario, and maximum-offer engines. These engines will be extended (not replaced) in later phases to support the multi-phase timelines of BRRRR/Flips and the daily-rate models of STRs.

## Five Investment Gates (LTR Context)
1. **Quick Screen:** High-level feasibility check (Estimated NOI, Cap Rate, CoC).
2. **Full Underwriting:** Detailed assumptions (Acquisition, Revenue, Expenses, Financing).
3. **Stress Test:** Base Case, Downside Case (e.g., lower rent, higher vacancy, higher expenses).
4. **Maximum Offer:** Back-solving for the highest purchase price that yields the target "Minimum Cash-on-Cash", "Minimum DSCR", and "Maximum LTV."
5. **Final Review:** Summary dashboard of economics, risks, break-even metrics, and downside resilience.

## Exclusions & Non-Goals for MVP
- **NO AI-based core financial math:** All financial calculations must run through deterministic, testable application code.
- **NO external financial integrations:** Do not integrate external bank or brokerage accounts during the MVP.
- **NO subjective Deal Scores:** Do not generate a subjective 0–100 score. Criteria must be explicit PASS/FAIL checks.
