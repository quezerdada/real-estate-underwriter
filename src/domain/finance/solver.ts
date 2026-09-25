import type { 
  AcquisitionAssumptions, 
  FinancingAssumptions, 
  RevenueAssumptions, 
  ExpenseAssumptions, 
  InvestmentCriteria,
  MaxOfferResult,
  Cents
} from './types';
import { underwriteLtr } from './ltr';

export function calculateMaximumOffer(
  acq: AcquisitionAssumptions,
  fin: FinancingAssumptions,
  rev: RevenueAssumptions,
  exp: ExpenseAssumptions,
  criteria: InvestmentCriteria
): MaxOfferResult {
  
  // Binary Search Bounds (in cents)
  let low: Cents = 100; // $1
  let high: Cents = 10000000000; // $100,000,000
  let bestPassingPrice: Cents = 0;
  let lastBindingConstraint: MaxOfferResult['bindingConstraint'] = 'None';
  
  // Tolerance of $10 (1000 cents) prevents infinite loops and guarantees fast convergence
  while (high - low > 1000) {
    const testPrice = Math.floor((low + high) / 2);
    
    // Maintain Leverage Strategy: Adjust test loan amount to strictly respect maxLTV
    const testLoanAmount = fin.useFinancing ? Math.round(testPrice * criteria.maxLtv) : 0;
    
    const testAcq: AcquisitionAssumptions = { ...acq, purchasePrice: testPrice };
    const testFin: FinancingAssumptions = { ...fin, loanAmount: testLoanAmount };
    
    const metrics = underwriteLtr(testAcq, testFin, rev, exp);
    
    let pass = true;
    let failedOn: MaxOfferResult['bindingConstraint'] = 'None';

    // Check Constraints
    if (metrics.cashOnCash < criteria.minCashOnCash) {
      pass = false;
      failedOn = 'Cash-on-Cash';
    } 
    else if (metrics.dscr !== null && metrics.dscr < criteria.minDscr) {
      pass = false;
      failedOn = 'DSCR';
    }
    // LTV is strictly controlled by our testLoanAmount definition, so it always passes.
    
    if (pass) {
      bestPassingPrice = testPrice;
      low = testPrice; // Can we pay more? Move low bound up.
    } else {
      lastBindingConstraint = failedOn;
      high = testPrice; // We paid too much. Move high bound down.
    }
  }

  const marginOfSafety = acq.purchasePrice > bestPassingPrice 
    ? acq.purchasePrice - bestPassingPrice 
    : 0;

  return {
    maxOfferPrice: bestPassingPrice,
    bindingConstraint: lastBindingConstraint,
    marginOfSafety
  };
}
