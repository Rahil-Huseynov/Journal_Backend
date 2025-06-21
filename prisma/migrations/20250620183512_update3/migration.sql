/*
  Warnings:

  - You are about to drop the column `title` on the `allJournal` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `userJournal` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "allJournal" DROP COLUMN "title",
ADD COLUMN     "title_az" TEXT,
ADD COLUMN     "title_en" TEXT,
ADD COLUMN     "title_ru" TEXT;

-- AlterTable
ALTER TABLE "userJournal" DROP COLUMN "title",
ADD COLUMN     "title_az" TEXT,
ADD COLUMN     "title_en" TEXT,
ADD COLUMN     "title_ru" TEXT;

-- CreateTable
CREATE TABLE "category" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title_az" TEXT,
    "title_en" TEXT,
    "title_ru" TEXT,
    "description" TEXT,

    CONSTRAINT "category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_JournalCategories" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_JournalCategories_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_JournalCategories_B_index" ON "_JournalCategories"("B");

-- AddForeignKey
ALTER TABLE "_JournalCategories" ADD CONSTRAINT "_JournalCategories_A_fkey" FOREIGN KEY ("A") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_JournalCategories" ADD CONSTRAINT "_JournalCategories_B_fkey" FOREIGN KEY ("B") REFERENCES "userJournal"("id") ON DELETE CASCADE ON UPDATE CASCADE;
