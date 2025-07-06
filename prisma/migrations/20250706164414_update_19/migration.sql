-- DropForeignKey
ALTER TABLE "subcategory" DROP CONSTRAINT "subcategory_categoryId_fkey";

-- AddForeignKey
ALTER TABLE "subcategory" ADD CONSTRAINT "subcategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
