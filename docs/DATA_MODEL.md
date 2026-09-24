// Initial Prisma Schema Proposal
// File location in project: prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id               String              @id @default(uuid())
  email            String              @unique
  properties       Property[]
  criteria         InvestmentCriteria?
  createdAt        DateTime            @default(now())
  updatedAt        DateTime            @updatedAt
}

model InvestmentCriteria {
  id                     String   @id @default(uuid())
  userId                 String   @unique
  user                   User     @relation(fields: [userId], references: [id])
  targetCoc              Float    // e.g., 0.08 (8%)
  targetDscr             Float    // e.g., 1.25
  maxLtv                 Float    // e.g., 0.80 (80%)
  minOpReserveCents      BigInt   // Stored in cents
}

model Property {
  id          String   @id @default(uuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  address     String
  type        String   // SingleFamily, MultiFamily, Commercial
  units       Int
  sqft        Int?
  yearBuilt   Int?
  deals       Deal[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

// Taxonomy for all 4 strategies, though only LTR is used in MVP
enum StrategyType {
  BUY_AND_HOLD_LTR
  FIX_AND_FLIP
  BRRRR
  SHORT_TERM_RENTAL_STR
}

model Deal {
  id           String       @id @default(uuid())
  propertyId   String
  property     Property     @relation(fields: [propertyId], references: [id])
  strategy     StrategyType // Set to BUY_AND_HOLD_LTR for MVP
  createdAt    DateTime     @default(now())
  updatedAt    DateTime     @updatedAt
  versions     UnderwritingVersion[]
}

model UnderwritingVersion {
  id             String   @id @default(uuid())
  dealId         String
  deal           Deal     @relation(fields: [dealId], references: [id])
  versionName    String   // e.g., "V1 - Initial Screen", "V2 - Downside"
  isBaseCase     Boolean  @default(true)
  
  // JSON blocks for high-velocity iteration in MVP.
  // In Phase C, these will be converted to strongly-typed columns/tables once domain logic is validated.
  acquisition    Json     
  revenue        Json     
  expenses       Json     
  financing      Json

  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
}
