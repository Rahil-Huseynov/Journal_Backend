/*
  Warnings:

  - Added the required column `file` to the `subcategory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "subcategory" ADD COLUMN     "file" TEXT NOT NULL;
