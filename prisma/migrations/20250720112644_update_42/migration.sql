/*
  Warnings:

  - You are about to drop the column `image` on the `subcategory` table. All the data in the column will be lost.
  - Added the required column `image` to the `category` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "category" ADD COLUMN     "image" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "subcategory" DROP COLUMN "image";
