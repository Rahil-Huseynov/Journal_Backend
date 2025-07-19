/*
  Warnings:

  - You are about to drop the column `image` on the `news` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "news" DROP COLUMN "image";

-- CreateTable
CREATE TABLE "newsImage" (
    "id" SERIAL NOT NULL,
    "image" TEXT,
    "newsId" INTEGER NOT NULL,

    CONSTRAINT "newsImage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "newsImage" ADD CONSTRAINT "newsImage_newsId_fkey" FOREIGN KEY ("newsId") REFERENCES "news"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
