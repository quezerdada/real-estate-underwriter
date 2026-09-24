/**
 * Types and Interfaces for the Financial Engine.
 * 
 * IMPORTANT: MONEY REPRESENTATION
 * To avoid floating point precision errors, ALL monetary values in this system 
 * MUST be represented in integer cents.
 * e.g., $1,250.55 = 125055.
 * 
 * Rates are represented as standard floats (e.g., 6.25% = 0.0625).
 */

export type Cents = number;  // Must be an integer. Safe up to Number.MAX_SAFE_INTEGER
export type Rate = number;   // Decimal representation (e.g., 0.05 for 5%)
export type Months = number; // Integer representing months

/**
 * Monetary Conversion Utilities Interface
 */
export interface MoneyConversionUtils {
  dollarsToCents(dollars: number): Cents;
  centsToDollars(cents: Cents): number;
  formatCentsToCurrencyString(cents: Cents): string;
}

/**
 * LTR MVP Inputs
 */
export interface AcquisitionAssumptions {
  purchasePrice: Cents;
  closingCosts: Cents;
  inspectionCosts: Cents;
  legalCosts: Cents;
  initialRepairs: Cents; // Simple make-ready repairs paid out of pocket, not a full rehab
  initialReserves: Cents;
  otherCosts: Cents;
}

export interface FinancingAssumptions {
  useFinancing: boolean;
  loanAmount: Cents;
  interestRate: Rate;
  amortizationYears: number;
  interestOnlyMonths: Months; // Supports Interest-Only grace periods. 0 if fully amortized.
  points: Rate; // Origination points (e.g., 0.01 for 1%)
  fees: Cents;  // Fixed lender fees
}

export interface RevenueAssumptions {
  grossMonthlyRent: Cents;
  otherMonthlyIncome: Cents;
  vacancyRate: Rate;
  creditLossRate: Rate;
  annualConcessions: Cents;
}

export interface ExpenseAssumptions {
  annualPropertyTaxes: Cents;
  annualInsurance: Cents;
  annualHoa: Cents;
  propertyManagementRate: Rate; // Usually % of Effective Gross Income
  annualRepairsMaintenance: Cents;
  annualLandscaping: Cents;
  annualPestControl: Cents;
  annualUtilities: Cents;
  annualAdmin: Cents;
  annualTurnover: Cents;
  otherAnnualOpEx: Cents;
  annualCapExReserve: Cents; // Handled below NOI
}

export interface InvestmentCriteria {
  minCashOnCash: Rate;
  minDscr: Rate;
  maxLtv: Rate;
}

/**
 * LTR MVP Outputs
 */
export interface LtrFinancialMetrics {
  // Basis
  totalAcquisitionCost: Cents;
  totalProjectBasis: Cents;
  initialCashInvested: Cents;
  
  // Income
  grossPotentialRent: Cents;
  effectiveGrossIncome: Cents;
  
  // Expenses & NOI
  totalOperatingExpenses: Cents;
  netOperatingIncome: Cents;
  
  // Debt & Cash Flow
  annualDebtService: Cents;
  monthlyDebtService: Cents;
  annualCapExReserve: Cents;
  cashFlowBeforeTax: Cents;
  
  // Returns & Risk
  capRate: Rate;
  cashOnCash: Rate;
  dscr: Rate | null; // null if all-cash transaction
  debtYield: Rate | null;
  ltv: Rate;
}

export interface MaxOfferResult {
  maxOfferPrice: Cents;
  bindingConstraint: 'Cash-on-Cash' | 'DSCR' | 'LTV' | 'None';
  marginOfSafety: Cents; 
}
