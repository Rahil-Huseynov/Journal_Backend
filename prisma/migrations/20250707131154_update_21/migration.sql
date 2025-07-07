/*
  Warnings:

  - You are about to drop the column `file` on the `subcategory` table. All the data in the column will be lost.
  - Added the required column `count` to the `subcategory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "subcategory" DROP COLUMN "file",
ADD COLUMN     "EndDate" TEXT,
ADD COLUMN     "count" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "global_subcategory" (
    "id" SERIAL NOT NULL,
    "title_az" TEXT,
    "title_en" TEXT,
    "title_ru" TEXT,
    "description_az" TEXT,
    "description_en" TEXT,
    "description_ru" TEXT,
    "file" TEXT NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "subCategoryId" INTEGER NOT NULL,

    CONSTRAINT "global_subcategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_JournalGlobalSubcategories" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_JournalGlobalSubcategories_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_JournalGlobalSubcategories_B_index" ON "_JournalGlobalSubcategories"("B");

-- AddForeignKey
ALTER TABLE "global_subcategory" ADD CONSTRAINT "global_subcategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "global_subcategory" ADD CONSTRAINT "global_subcategory_subCategoryId_fkey" FOREIGN KEY ("subCategoryId") REFERENCES "subcategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_JournalGlobalSubcategories" ADD CONSTRAINT "_JournalGlobalSubcategories_A_fkey" FOREIGN KEY ("A") REFERENCES "global_subcategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_JournalGlobalSubcategories" ADD CONSTRAINT "_JournalGlobalSubcategories_B_fkey" FOREIGN KEY ("B") REFERENCES "userJournal"("id") ON DELETE CASCADE ON UPDATE CASCADE;
