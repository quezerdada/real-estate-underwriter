# Financial Formulas (LTR MVP)

All formulas depend on the `Cents` and `Rate` specifications documented in `types.ts`. Inputs and outputs are processed annually unless otherwise stated.

## Acquisition & Basis
- **Total Acquisition Cost** = Purchase Price + Closing Costs + Inspection + Legal + Lender Fees
- **Total Project Basis** = Total Acquisition Cost + Initial Repairs

## Revenue
- **Gross Potential Rent (GPR)** = Gross Monthly Rent * 12
- **Potential Gross Income (PGI)** = GPR + (Other Monthly Income * 12)
- **Vacancy Loss** = PGI * Vacancy %
- **Credit Loss** = PGI * Credit Loss %
- **Effective Gross Income (EGI)** = PGI - Vacancy Loss - Credit Loss - Concessions

## Expenses
- **Total Operating Expenses (OpEx)** = Taxes + Insurance + HOA + Management + Repairs + Maintenance + Landscaping + Pest + Utilities + Admin + Turnover + Other
- *Note:* Debt service, CapEx reserves, and Income Taxes must NOT be included in OpEx.

## Net Operating Income (NOI)
- **NOI** = EGI - Total Operating Expenses

## Financing
- **Loan Amount** = Explicit amount or Purchase Price * LTV
- **Monthly Debt Service** 
  - *Standard Amortization:* Calculated using standard fixed-rate PMT formula based on Loan Amount, Interest Rate, and Amortization Term.
  - *Interest-Only (Grace Period):* (Loan Amount * Interest Rate) / 12
- **Annual Debt Service (ADS)** = Monthly Debt Service * 12

## Core Metrics
- **DSCR** = NOI / ADS (Handle division by zero gracefully if unleveraged).
- **Debt Yield** = NOI / Loan Amount (Return null/N/A if no loan).
- **Cap Rate** = NOI / Purchase Price
- **Cash Flow Before Tax (CFBT)** = NOI - ADS - CapEx Reserve
- **Initial Cash Invested** = Total Project Basis - Loan Amount + Initial Reserves
- **Cash-on-Cash Return** = CFBT / Initial Cash Invested
