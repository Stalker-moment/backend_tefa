-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- RenameForeignKey
ALTER TABLE "Item" RENAME CONSTRAINT "Item_id_fkey" TO "Item_rack_fkey";

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_category_fkey" FOREIGN KEY ("id") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
