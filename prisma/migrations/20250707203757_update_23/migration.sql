-- DropForeignKey
ALTER TABLE "global_subcategory" DROP CONSTRAINT "global_subcategory_subCategoryId_fkey";

-- AlterTable
ALTER TABLE "global_subcategory" ALTER COLUMN "subCategoryId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "global_subcategory" ADD CONSTRAINT "global_subcategory_subCategoryId_fkey" FOREIGN KEY ("subCategoryId") REFERENCES "subcategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;
