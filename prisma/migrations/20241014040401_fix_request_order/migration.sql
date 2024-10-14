/*
  Warnings:

  - You are about to drop the column `userId` on the `RequestOrder` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "RequestOrder" DROP CONSTRAINT "RequestOrder_userId_fkey";

-- AlterTable
ALTER TABLE "RequestOrder" DROP COLUMN "userId";

-- AddForeignKey
ALTER TABLE "RequestOrder" ADD CONSTRAINT "RequestOrder_id_fkey" FOREIGN KEY ("id") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
