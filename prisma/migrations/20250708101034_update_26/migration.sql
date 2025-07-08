/*
  Warnings:

  - You are about to drop the column `Status` on the `subcategory` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "subcategory" DROP COLUMN "Status",
ADD COLUMN     "status" TEXT;
