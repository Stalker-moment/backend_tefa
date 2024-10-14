/*
  Warnings:

  - You are about to drop the column `pictures` on the `Item` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Item" DROP COLUMN "pictures";

-- CreateTable
CREATE TABLE "Picture" (
    "id" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "itemId" INTEGER NOT NULL,

    CONSTRAINT "Picture_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Picture" ADD CONSTRAINT "Picture_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;
