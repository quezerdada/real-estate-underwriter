import { describe, it, expect } from 'vitest';
import { moneyUtils, calculateMonthlyAmortizedPayment, calculateMonthlyInterestOnlyPayment } from '../utils/money';

describe('Money Conversion Utils', () => {
  it('converts dollars to cents safely', () => {
    expect(moneyUtils.dollarsToCents(12.34)).toBe(1234);
    expect(moneyUtils.dollarsToCents(1000000)).toBe(100000000);
  });

  it('converts cents to dollars safely', () => {
    expect(moneyUtils.centsToDollars(1234)).toBe(12.34);
    expect(moneyUtils.centsToDollars(100000000)).toBe(1000000);
  });
});

describe('Amortization & Debt Math', () => {
  it('calculates correct amortized PMT (matches standard formulas)', () => {
    // Excel PMT(6%/12, 360, 650000) = 3897.08
    const principalCents = 65000000;
    const rate = 0.06;
    const years = 30;
    
    const pmt = calculateMonthlyAmortizedPayment(principalCents, rate, years);
    expect(pmt).toBe(389708); // $3,897.08
  });

  it('calculates correct interest-only PMT', () => {
    // 650,000 * 6% / 12 = 3250
    const pmt = calculateMonthlyInterestOnlyPayment(65000000, 0.06);
    expect(pmt).toBe(325000); // $3,250.00
  });

  it('handles zero principal gracefully', () => {
    expect(calculateMonthlyAmortizedPayment(0, 0.06, 30)).toBe(0);
    expect(calculateMonthlyInterestOnlyPayment(0, 0.06)).toBe(0);
  });
});
