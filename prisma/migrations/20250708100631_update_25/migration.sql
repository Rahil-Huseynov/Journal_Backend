/*
  Warnings:

  - Added the required column `Status` to the `subcategory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "global_subcategory" ADD COLUMN     "count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "requireCount" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "subcategory" ADD COLUMN     "Status" TEXT NOT NULL,
ADD COLUMN     "requireCount" INTEGER NOT NULL DEFAULT 0;
