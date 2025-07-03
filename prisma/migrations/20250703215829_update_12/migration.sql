/*
  Warnings:

  - You are about to drop the `_CategoryToSubCategory` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `categoryId` to the `subcategory` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_CategoryToSubCategory" DROP CONSTRAINT "_CategoryToSubCategory_A_fkey";

-- DropForeignKey
ALTER TABLE "_CategoryToSubCategory" DROP CONSTRAINT "_CategoryToSubCategory_B_fkey";

-- AlterTable
ALTER TABLE "subcategory" ADD COLUMN     "categoryId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "_CategoryToSubCategory";

-- AddForeignKey
ALTER TABLE "subcategory" ADD CONSTRAINT "subcategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
