import type { 
  AcquisitionAssumptions, 
  FinancingAssumptions, 
  RevenueAssumptions, 
  ExpenseAssumptions, 
  LtrFinancialMetrics,
  Cents
} from './types';
import { calculateMonthlyAmortizedPayment, calculateMonthlyInterestOnlyPayment } from './utils/money';

export function underwriteLtr(
  acq: AcquisitionAssumptions,
  fin: FinancingAssumptions,
  rev: RevenueAssumptions,
  exp: ExpenseAssumptions
): LtrFinancialMetrics {
  
  // --- ACQUISITION & BASIS ---
  const lenderPointsCost: Cents = fin.useFinancing 
    ? Math.round(fin.loanAmount * fin.points) 
    : 0;

  const totalAcquisitionCost = 
    acq.purchasePrice + 
    acq.closingCosts + 
    acq.inspectionCosts + 
    acq.legalCosts + 
    (fin.useFinancing ? fin.fees : 0) + 
    lenderPointsCost + 
    acq.otherCosts;

  const totalProjectBasis = totalAcquisitionCost + acq.initialRepairs;
  const loanAmount = fin.useFinancing ? fin.loanAmount : 0;
  const initialCashInvested = totalProjectBasis - loanAmount + acq.initialReserves;

  // --- REVENUE ---
  const grossPotentialRent = rev.grossMonthlyRent * 12;
  const otherIncome = rev.otherMonthlyIncome * 12;
  const potentialGrossIncome = grossPotentialRent + otherIncome;
  
  const vacancyLoss = Math.round(potentialGrossIncome * rev.vacancyRate);
  const creditLoss = Math.round(potentialGrossIncome * rev.creditLossRate);
  
  const effectiveGrossIncome = potentialGrossIncome - vacancyLoss - creditLoss - rev.annualConcessions;

  // --- EXPENSES ---
  const propertyManagementCost = Math.round(effectiveGrossIncome * exp.propertyManagementRate);
  
  const totalOperatingExpenses = 
    exp.annualPropertyTaxes +
    exp.annualInsurance +
    exp.annualHoa +
    propertyManagementCost +
    exp.annualRepairsMaintenance +
    exp.annualLandscaping +
    exp.annualPestControl +
    exp.annualUtilities +
    exp.annualAdmin +
    exp.annualTurnover +
    exp.otherAnnualOpEx;

  // --- NET OPERATING INCOME ---
  const netOperatingIncome = effectiveGrossIncome - totalOperatingExpenses;

  // --- FINANCING & DEBT SERVICE ---
  let monthlyDebtService = 0;
  if (fin.useFinancing && loanAmount > 0) {
    if (fin.interestOnlyMonths >= 12) {
      // Treat as an Interest-Only year
      monthlyDebtService = calculateMonthlyInterestOnlyPayment(loanAmount, fin.interestRate);
    } else {
      // Standard Amortization
      monthlyDebtService = calculateMonthlyAmortizedPayment(loanAmount, fin.interestRate, fin.amortizationYears);
    }
  }
  
  const annualDebtService = monthlyDebtService * 12;

  // --- CASH FLOW & METRICS ---
  const cashFlowBeforeTax = netOperatingIncome - annualDebtService - exp.annualCapExReserve;

  // Handle zero-divisions
  const capRate = acq.purchasePrice > 0 ? (netOperatingIncome / acq.purchasePrice) : 0;
  const cashOnCash = initialCashInvested > 0 ? (cashFlowBeforeTax / initialCashInvested) : 0;
  const dscr = annualDebtService > 0 ? (netOperatingIncome / annualDebtService) : null;
  const debtYield = loanAmount > 0 ? (netOperatingIncome / loanAmount) : null;
  const ltv = acq.purchasePrice > 0 ? (loanAmount / acq.purchasePrice) : 0;

  return {
    totalAcquisitionCost,
    totalProjectBasis,
    initialCashInvested,
    
    grossPotentialRent,
    effectiveGrossIncome,
    
    totalOperatingExpenses,
    netOperatingIncome,
    
    annualDebtService,
    monthlyDebtService,
    annualCapExReserve: exp.annualCapExReserve,
    cashFlowBeforeTax,
    
    capRate,
    cashOnCash,
    dscr,
    debtYield,
    ltv,
  };
}
