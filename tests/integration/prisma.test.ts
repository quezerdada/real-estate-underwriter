import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { prisma } from "../../src/lib/prisma";

describe("Database Integration: LTR Persistence", () => {
  let testUserId: string;

  beforeAll(async () => {
    await prisma.user.deleteMany({ where: { email: "test-ltr@example.com" } });
  });

  afterAll(async () => {
    if (testUserId) {
      await prisma.user.delete({ where: { id: testUserId } });
    }
    await prisma.$disconnect();
  });

  it("creates an entire LTR underwriting pipeline in the database", async () => {
    const user = await prisma.user.create({
      data: {
        email: "test-ltr@example.com",
        criteria: {
          create: {
            targetCoc: 0.08,
            targetDscr: 1.25,
            maxLtv: 0.80,
            minOpReserveCents: 1000000n,
          },
        },
      },
      include: { criteria: true },
    });
    
    testUserId = user.id;
    expect(user.id).toBeDefined();
    expect(user.criteria?.targetCoc).toBe(0.08);

    const property = await prisma.property.create({
      data: {
        userId: user.id,
        address: "123 Main St, Austin TX",
        type: "SingleFamily",
        units: 1,
        sqft: 1500,
        yearBuilt: 2010,
      },
    });
    
    expect(property.address).toBe("123 Main St, Austin TX");

    const deal = await prisma.deal.create({
      data: {
        propertyId: property.id,
        strategy: "BUY_AND_HOLD_LTR",
      },
    });

    expect(deal.strategy).toBe("BUY_AND_HOLD_LTR");

    const mockResults = {
      netOperatingIncome: 6120000,
      cashFlowBeforeTax: 1443504,
      cashOnCash: 0.03608,
      dscr: 1.308,
    };

    const version = await prisma.underwritingVersion.create({
      data: {
        dealId: deal.id,
        versionName: "V1 - Initial Screen",
        isBaseCase: true,
        acquisition: { purchasePrice: 100000000, closingCosts: 2500000 },
        financing: { useFinancing: true, loanAmount: 65000000, interestRate: 0.06 },
        revenue: { grossMonthlyRent: 800000, vacancyRate: 0.05 },
        expenses: { annualPropertyTaxes: 1500000 },
        results: mockResults as any,
      },
    });

    expect(version.id).toBeDefined();
    expect(version.isBaseCase).toBe(true);
    
    const savedResults = version.results as typeof mockResults;
    expect(savedResults.netOperatingIncome).toBe(6120000);
    expect(savedResults.cashOnCash).toBe(0.03608);

    const savedAcquisition = version.acquisition as { purchasePrice: number };
    expect(savedAcquisition.purchasePrice).toBe(100000000);
  });
});
