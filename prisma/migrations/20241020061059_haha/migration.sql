-- AlterTable
ALTER TABLE "Item" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "RequestOrder" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "RequestOrderItem" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;
