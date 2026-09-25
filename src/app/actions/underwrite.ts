"use server";

import { prisma } from "../../lib/prisma";
import { underwriteLtr } from "../../domain/finance/ltr";
import type { 
  AcquisitionAssumptions, 
  FinancingAssumptions, 
  RevenueAssumptions, 
  ExpenseAssumptions 
} from "../../domain/finance/types";

export async function processAndSaveLtrDeal(payload: {
  property: { address: string; units: number };
  acq: AcquisitionAssumptions;
  fin: FinancingAssumptions;
  rev: RevenueAssumptions;
  exp: ExpenseAssumptions;
}) {
  try {
    // 1. Run deterministic financial engine (Phase B)
    const results = underwriteLtr(
      payload.acq,
      payload.fin,
      payload.rev,
      payload.exp
    );

    // 2. Ensure a dummy user exists for MVP purposes
    const user = await prisma.user.upsert({
      where: { email: "test-ltr@example.com" },
      update: {},
      create: { email: "test-ltr@example.com" },
    });

    // 3. Persist the Property
    const property = await prisma.property.create({
      data: {
        userId: user.id,
        address: payload.property.address,
        type: "SingleFamily",
        units: payload.property.units,
      },
    });

    // 4. Persist the Deal
    const deal = await prisma.deal.create({
      data: {
        propertyId: property.id,
        strategy: "BUY_AND_HOLD_LTR",
      },
    });

    // 5. Persist the Underwriting Version with JSON blocks
    const version = await prisma.underwritingVersion.create({
      data: {
        dealId: deal.id,
        versionName: "V1 - Initial Screen",
        isBaseCase: true,
        acquisition: payload.acq as any,
        revenue: payload.rev as any,
        expenses: payload.exp as any,
        financing: payload.fin as any,
        results: results as any,
      },
    });

    return {
      success: true,
      dealId: deal.id,
      versionId: version.id,
      results,
    };
  } catch (error: any) {
    console.error("Underwriting Error:", error);
    return { success: false, error: error.message };
  }
}
