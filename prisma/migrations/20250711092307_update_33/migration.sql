/*
  Warnings:

  - You are about to drop the `GlobalSubCategoryUserJournal` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "GlobalSubCategoryUserJournal" DROP CONSTRAINT "GlobalSubCategoryUserJournal_globalSubCategoryId_fkey";

-- DropForeignKey
ALTER TABLE "GlobalSubCategoryUserJournal" DROP CONSTRAINT "GlobalSubCategoryUserJournal_userJournalId_fkey";

-- AlterTable
ALTER TABLE "userJournal" ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE "GlobalSubCategoryUserJournal";
