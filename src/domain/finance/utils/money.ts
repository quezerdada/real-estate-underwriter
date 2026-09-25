import type { Cents, MoneyConversionUtils } from '../types';

export const moneyUtils: MoneyConversionUtils = {
  dollarsToCents: (dollars: number): Cents => Math.round(dollars * 100),
  
  centsToDollars: (cents: Cents): number => cents / 100,
  
  formatCentsToCurrencyString: (cents: Cents): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(cents / 100);
  },
};

/**
 * Calculates the standard monthly amortized payment in integer cents.
 */
export function calculateMonthlyAmortizedPayment(
  principalCents: Cents,
  annualInterestRate: number,
  amortizationYears: number
): Cents {
  if (principalCents <= 0) return 0;
  if (amortizationYears <= 0) return 0;
  
  const totalPayments = amortizationYears * 12;
  
  // If interest rate is 0%, just divide principal by total months
  if (annualInterestRate === 0) {
    return Math.round(principalCents / totalPayments);
  }

  const monthlyInterestRate = annualInterestRate / 12;
  const factor = Math.pow(1 + monthlyInterestRate, totalPayments);
  
  const paymentCents = (principalCents * monthlyInterestRate * factor) / (factor - 1);
  
  // Round to nearest cent
  return Math.round(paymentCents);
}

/**
 * Calculates the monthly interest-only payment in integer cents.
 */
export function calculateMonthlyInterestOnlyPayment(
  principalCents: Cents,
  annualInterestRate: number
): Cents {
  if (principalCents <= 0 || annualInterestRate <= 0) return 0;
  return Math.round((principalCents * annualInterestRate) / 12);
}
