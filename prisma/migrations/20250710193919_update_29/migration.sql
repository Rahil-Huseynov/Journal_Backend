-- AlterTable
ALTER TABLE "message" ADD COLUMN     "subCategoryId" INTEGER;

-- AddForeignKey
ALTER TABLE "message" ADD CONSTRAINT "message_subCategoryId_fkey" FOREIGN KEY ("subCategoryId") REFERENCES "subcategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;
