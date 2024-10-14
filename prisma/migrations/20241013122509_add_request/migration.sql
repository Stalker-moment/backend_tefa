/*
  Warnings:

  - The `role` column on the `Account` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'PPIC', 'ADMIN');

-- AlterTable
ALTER TABLE "Account" DROP COLUMN "role",
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'USER';

-- CreateTable
CREATE TABLE "RequestOrder" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RequestOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RequestOrderItem" (
    "id" TEXT NOT NULL,
    "itemId" INTEGER NOT NULL,
    "requestOrderId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "status" "RequestStatus" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "RequestOrderItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "RequestOrder" ADD CONSTRAINT "RequestOrder_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RequestOrderItem" ADD CONSTRAINT "RequestOrderItem_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RequestOrderItem" ADD CONSTRAINT "RequestOrderItem_requestOrderId_fkey" FOREIGN KEY ("requestOrderId") REFERENCES "RequestOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;
