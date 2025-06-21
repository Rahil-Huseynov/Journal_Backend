/*
  Warnings:

  - Added the required column `image` to the `category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image` to the `subcategory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "category" ADD COLUMN     "image" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "subcategory" ADD COLUMN     "image" TEXT NOT NULL;
