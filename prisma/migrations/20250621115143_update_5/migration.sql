/*
  Warnings:

  - You are about to drop the column `description` on the `allJournal` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `category` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `subcategory` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `userJournal` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "allJournal" DROP COLUMN "description",
ADD COLUMN     "description_az" TEXT,
ADD COLUMN     "description_en" TEXT,
ADD COLUMN     "description_ru" TEXT;

-- AlterTable
ALTER TABLE "category" DROP COLUMN "description",
ADD COLUMN     "description_az" TEXT,
ADD COLUMN     "description_en" TEXT,
ADD COLUMN     "description_ru" TEXT;

-- AlterTable
ALTER TABLE "subcategory" DROP COLUMN "description",
ADD COLUMN     "description_az" TEXT,
ADD COLUMN     "description_en" TEXT,
ADD COLUMN     "description_ru" TEXT;

-- AlterTable
ALTER TABLE "userJournal" DROP COLUMN "description",
ADD COLUMN     "description_az" TEXT,
ADD COLUMN     "description_en" TEXT,
ADD COLUMN     "description_ru" TEXT;
