-- AlterTable
ALTER TABLE "Item" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "RequestOrder" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "RequestOrderItem" ALTER COLUMN "updatedAt" DROP DEFAULT;
