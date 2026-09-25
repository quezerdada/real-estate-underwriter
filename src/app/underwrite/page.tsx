"use client";

import { useState } from "react";
import { processAndSaveLtrDeal } from "../actions/underwrite";

// Note: To provide a smooth UX, the form collects data in standard dollars and percentages.
// It converts them to integer cents (x100) right before submission to adhere to Phase A/B architecture.
export default function UnderwritePage() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);

  // Form State (User-friendly decimals/dollars)
  const [formData, setFormData] = useState({
    address: "123 Main St, Austin TX",
    units: 1,
    
    // Acquisition (Dollars)
    purchasePrice: 1000000,
    closingCosts: 25000,
    initialRepairs: 25000,
    
    // Revenue (Dollars / Percent)
    grossMonthlyRent: 8000,
    vacancyRate: 5, // 5%
    
    // Expenses (Dollars)
    annualPropertyTaxes: 15000,
    annualInsurance: 5000,
    annualRepairsMaintenance: 5000,
    annualUtilities: 5000,
    
    // Financing
    useFinancing: true,
    loanAmount: 650000,
    interestRate: 6, // 6%
    amortizationYears: 30,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : type === "number" ? Number(value) : value,
    }));
  };

  const nextStep = () => setStep((s) => Math.min(s + 1, 6));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Transform UX inputs (dollars/percents) to Engine inputs (cents/decimals)
    const payload = {
      property: {
        address: formData.address,
        units: formData.units,
      },
      acq: {
        purchasePrice: formData.purchasePrice * 100,
        closingCosts: formData.closingCosts * 100,
        inspectionCosts: 0,
        legalCosts: 0,
        initialRepairs: formData.initialRepairs * 100,
        initialReserves: 0,
        otherCosts: 0,
      },
      fin: {
        useFinancing: formData.useFinancing,
        loanAmount: formData.loanAmount * 100,
        interestRate: formData.interestRate / 100, // 6 -> 0.06
        amortizationYears: formData.amortizationYears,
        interestOnlyMonths: 0,
        points: 0,
        fees: 0,
      },
      rev: {
        grossMonthlyRent: formData.grossMonthlyRent * 100,
        otherMonthlyIncome: 0,
        vacancyRate: formData.vacancyRate / 100, // 5 -> 0.05
        creditLossRate: 0,
        annualConcessions: 0,
      },
      exp: {
        annualPropertyTaxes: formData.annualPropertyTaxes * 100,
        annualInsurance: formData.annualInsurance * 100,
        annualHoa: 0,
        propertyManagementRate: 0,
        annualRepairsMaintenance: formData.annualRepairsMaintenance * 100,
        annualLandscaping: 0,
        annualPestControl: 0,
        annualUtilities: formData.annualUtilities * 100,
        annualAdmin: 0,
        annualTurnover: 0,
        otherAnnualOpEx: 0,
        annualCapExReserve: 0,
      }
    };

    const res = await processAndSaveLtrDeal(payload);
    setResult(res);
    setIsSubmitting(false);
    if (res.success) setStep(6); // Move to results step
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        
        {/* Header / Progress */}
        <div className="bg-blue-600 px-6 py-4 text-white flex justify-between items-center">
          <h1 className="text-xl font-bold">LTR Underwriting</h1>
          <span className="text-sm font-medium">Step {step} of 6</span>
        </div>

        <div className="p-8">
          {/* STEP 1: Property */}
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Property Details</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700">Property Address</label>
                <input type="text" name="address" value={formData.address} onChange={handleChange} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Units</label>
                <input type="number" name="units" value={formData.units} onChange={handleChange} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:ring-blue-500" />
              </div>
            </div>
          )}

          {/* STEP 2: Acquisition */}
          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Acquisition Assumptions</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700">Purchase Price ($)</label>
                <input type="number" name="purchasePrice" value={formData.purchasePrice} onChange={handleChange} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Closing Costs ($)</label>
                <input type="number" name="closingCosts" value={formData.closingCosts} onChange={handleChange} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Initial Repairs ($)</label>
                <input type="number" name="initialRepairs" value={formData.initialRepairs} onChange={handleChange} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:ring-blue-500" />
              </div>
            </div>
          )}

          {/* STEP 3: Income */}
          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Revenue Assumptions</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700">Gross Monthly Rent ($)</label>
                <input type="number" name="grossMonthlyRent" value={formData.grossMonthlyRent} onChange={handleChange} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Vacancy Rate (%)</label>
                <input type="number" name="vacancyRate" value={formData.vacancyRate} onChange={handleChange} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:ring-blue-500" />
              </div>
            </div>
          )}

          {/* STEP 4: Expenses */}
          {step === 4 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Operating Expenses (Annual)</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700">Property Taxes ($)</label>
                <input type="number" name="annualPropertyTaxes" value={formData.annualPropertyTaxes} onChange={handleChange} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Insurance ($)</label>
                <input type="number" name="annualInsurance" value={formData.annualInsurance} onChange={handleChange} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Repairs & Maintenance ($)</label>
                <input type="number" name="annualRepairsMaintenance" value={formData.annualRepairsMaintenance} onChange={handleChange} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Utilities ($)</label>
                <input type="number" name="annualUtilities" value={formData.annualUtilities} onChange={handleChange} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:ring-blue-500" />
              </div>
            </div>
          )}

          {/* STEP 5: Financing */}
          {step === 5 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Financing Assumptions</h2>
              <div className="flex items-center mb-4">
                <input type="checkbox" name="useFinancing" checked={formData.useFinancing} onChange={handleChange} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <label className="ml-2 block text-sm font-medium text-gray-900">Use Financing</label>
              </div>
              
              {formData.useFinancing && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Loan Amount ($)</label>
                    <input type="number" name="loanAmount" value={formData.loanAmount} onChange={handleChange} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Interest Rate (%)</label>
                    <input type="number" name="interestRate" value={formData.interestRate} step="0.1" onChange={handleChange} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Amortization (Years)</label>
                    <input type="number" name="amortizationYears" value={formData.amortizationYears} onChange={handleChange} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:ring-blue-500" />
                  </div>
                </>
              )}
            </div>
          )}

          {/* STEP 6: Results */}
          {step === 6 && result?.success && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b pb-4">
                <h2 className="text-2xl font-bold text-gray-900">Underwriting Results</h2>
                <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">Deal Saved</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <p className="text-sm text-gray-500 font-medium">Net Operating Income (NOI)</p>
                  <p className="text-2xl font-bold text-gray-900">${(result.results.netOperatingIncome / 100).toLocaleString()}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <p className="text-sm text-gray-500 font-medium">Annual Cash Flow</p>
                  <p className="text-2xl font-bold text-gray-900">${(result.results.cashFlowBeforeTax / 100).toLocaleString()}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <p className="text-sm text-gray-500 font-medium">Cash-on-Cash Return</p>
                  <p className="text-2xl font-bold text-blue-600">{(result.results.cashOnCash * 100).toFixed(2)}%</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <p className="text-sm text-gray-500 font-medium">DSCR</p>
                  <p className="text-2xl font-bold text-blue-600">{result.results.dscr ? result.results.dscr.toFixed(2) : "N/A"}</p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="mt-8 flex justify-between border-t border-gray-200 pt-6">
            {step > 1 && step < 6 && (
              <button onClick={prevStep} className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
                Back
              </button>
            )}
            
            {step < 5 && (
              <button onClick={nextStep} className="ml-auto rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700">
                Continue
              </button>
            )}

            {step === 5 && (
              <button onClick={handleSubmit} disabled={isSubmitting} className="ml-auto rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 disabled:opacity-50">
                {isSubmitting ? "Calculating..." : "Calculate & Save"}
              </button>
            )}
            
            {step === 6 && (
              <button onClick={() => setStep(1)} className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700">
                Start New Deal
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
