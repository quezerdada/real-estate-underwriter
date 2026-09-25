import { describe, it, expect } from 'vitest';
import { underwriteLtr } from '../ltr';
import type { AcquisitionAssumptions, FinancingAssumptions, RevenueAssumptions, ExpenseAssumptions } from '../types';

describe('LTR Engine - Deterministic Calculations', () => {
  // Transparent Reference Case
  const acq: AcquisitionAssumptions = {
    purchasePrice: 100000000, // $1M
    closingCosts: 2500000,    // $25k
    inspectionCosts: 0,
    legalCosts: 0,
    initialRepairs: 2500000,  // $25k
    initialReserves: 0,
    otherCosts: 0,
  };

  const fin: FinancingAssumptions = {
    useFinancing: true,
    loanAmount: 65000000,     // $650k
    interestRate: 0.06,       // 6%
    amortizationYears: 30,
    interestOnlyMonths: 0,
    points: 0,
    fees: 0
  };

  const rev: RevenueAssumptions = {
    grossMonthlyRent: 800000, // $8k/mo -> $96k/yr
    otherMonthlyIncome: 0,
    vacancyRate: 0.05,        // 5% -> $4,800
    creditLossRate: 0,
    annualConcessions: 0
  };

  const exp: ExpenseAssumptions = {
    annualPropertyTaxes: 1500000,
    annualInsurance: 500000,
    annualHoa: 0,
    propertyManagementRate: 0, 
    annualRepairsMaintenance: 500000,
    annualLandscaping: 0,
    annualPestControl: 0,
    annualUtilities: 500000,
    annualAdmin: 0,
    annualTurnover: 0,
    otherAnnualOpEx: 0,
    annualCapExReserve: 0
  }; // Total OpEx: $30k

  it('calculates metrics matching the transparent reference case', () => {
    const metrics = underwriteLtr(acq, fin, rev, exp);

    // Basis checks
    expect(metrics.totalAcquisitionCost).toBe(102500000); // $1.025M
    expect(metrics.totalProjectBasis).toBe(105000000);    // $1.05M
    expect(metrics.initialCashInvested).toBe(40000000);   // 1.05M - 650k = $400k

    // Income checks
    expect(metrics.grossPotentialRent).toBe(9600000);     // $96k
    expect(metrics.effectiveGrossIncome).toBe(9120000);   // $91.2k (96k - 5%)
    
    // Expense checks
    expect(metrics.totalOperatingExpenses).toBe(3000000); // $30k
    expect(metrics.netOperatingIncome).toBe(6120000);     // $61.2k
    
    // Financing checks (PMT = $3,897.08/mo)
    expect(metrics.monthlyDebtService).toBe(389708);      
    expect(metrics.annualDebtService).toBe(4676496);      // $46,764.96

    // Cash flow checks
    expect(metrics.cashFlowBeforeTax).toBe(1443504);      // 61.2k - 46,764.96 = $14,435.04

    // Ratios
    expect(metrics.capRate).toBeCloseTo(0.0612, 4);       // 6.12%
    expect(metrics.cashOnCash).toBeCloseTo(0.03608, 4);   // ~3.6%
    expect(metrics.dscr).toBeCloseTo(1.30867, 4);           // 61.2k / 46.76k
  });

  it('handles unleveraged (all-cash) deals correctly', () => {
    const cashFin = { ...fin, useFinancing: false, loanAmount: 0 };
    const metrics = underwriteLtr(acq, cashFin, rev, exp);

    expect(metrics.initialCashInvested).toBe(105000000);  // Entire project basis
    expect(metrics.annualDebtService).toBe(0);
    expect(metrics.cashFlowBeforeTax).toBe(6120000);      // Equal to NOI
    expect(metrics.dscr).toBeNull();
    expect(metrics.debtYield).toBeNull();
  });
});
