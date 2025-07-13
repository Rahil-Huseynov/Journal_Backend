/*
  Warnings:

  - You are about to drop the column `about` on the `author` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "author" DROP COLUMN "about",
ADD COLUMN     "country" TEXT,
ADD COLUMN     "workplace" TEXT;
