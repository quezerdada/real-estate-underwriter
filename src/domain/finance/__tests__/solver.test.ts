import { describe, it, expect } from 'vitest';
import { calculateMaximumOffer } from '../solver';
import { underwriteLtr } from '../ltr';
import type { AcquisitionAssumptions, FinancingAssumptions, RevenueAssumptions, ExpenseAssumptions, InvestmentCriteria } from '../types';

describe('Maximum Offer Solver', () => {
  const acq: AcquisitionAssumptions = { purchasePrice: 100000000, closingCosts: 2500000, inspectionCosts: 0, legalCosts: 0, initialRepairs: 2500000, initialReserves: 0, otherCosts: 0 };
  const fin: FinancingAssumptions = { useFinancing: true, loanAmount: 65000000, interestRate: 0.06, amortizationYears: 30, interestOnlyMonths: 0, points: 0, fees: 0 };
  const rev: RevenueAssumptions = { grossMonthlyRent: 800000, otherMonthlyIncome: 0, vacancyRate: 0.05, creditLossRate: 0, annualConcessions: 0 };
  const exp: ExpenseAssumptions = { annualPropertyTaxes: 1500000, annualInsurance: 500000, annualHoa: 0, propertyManagementRate: 0, annualRepairsMaintenance: 500000, annualLandscaping: 0, annualPestControl: 0, annualUtilities: 500000, annualAdmin: 0, annualTurnover: 0, otherAnnualOpEx: 0, annualCapExReserve: 0 };

  it('finds the maximum offer price constrained by Cash-on-Cash', () => {
    const criteria: InvestmentCriteria = {
      minCashOnCash: 0.08, // Wants 8% CoC
      minDscr: 1.10,       // Very loose DSCR
      maxLtv: 0.70         // Fixed 70% LTV strategy
    };

    const result = calculateMaximumOffer(acq, fin, rev, exp, criteria);
    
    // Result should be notably less than $1M because $1M only produced ~3.6% CoC
    expect(result.maxOfferPrice).toBeLessThan(100000000);
    expect(result.bindingConstraint).toBe('Cash-on-Cash');

    // Verify the math by running the engine at the solver's suggested max price
    const testAcq = { ...acq, purchasePrice: result.maxOfferPrice };
    const testFin = { ...fin, loanAmount: Math.round(result.maxOfferPrice * criteria.maxLtv) };
    const testMetrics = underwriteLtr(testAcq, testFin, rev, exp);

    // Assert that the resulting CoC is extremely close to the 8% target
    expect(testMetrics.cashOnCash).toBeGreaterThanOrEqual(0.08);
    expect(testMetrics.cashOnCash).toBeLessThan(0.081); // Within tight tolerance
  });

  it('finds the maximum offer price constrained by DSCR', () => {
    const criteria: InvestmentCriteria = {
      minCashOnCash: 0.02, // Very loose CoC
      minDscr: 1.50,       // Requires strong 1.50 DSCR
      maxLtv: 0.70
    };

    const result = calculateMaximumOffer(acq, fin, rev, exp, criteria);
    expect(result.bindingConstraint).toBe('DSCR');

    // Verify the math
    const testAcq = { ...acq, purchasePrice: result.maxOfferPrice };
    const testFin = { ...fin, loanAmount: Math.round(result.maxOfferPrice * criteria.maxLtv) };
    const testMetrics = underwriteLtr(testAcq, testFin, rev, exp);

    expect(testMetrics.dscr).toBeGreaterThanOrEqual(1.50);
    expect(testMetrics.dscr).toBeLessThan(1.51); 
  });
});
