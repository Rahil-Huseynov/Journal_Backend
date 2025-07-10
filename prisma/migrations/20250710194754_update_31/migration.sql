/*
  Warnings:

  - You are about to drop the `message` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "message" DROP CONSTRAINT "message_userJournalId_fkey";

-- DropTable
DROP TABLE "message";

-- CreateTable
CREATE TABLE "messages" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "problems" TEXT,
    "userJournalId" INTEGER NOT NULL,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_userJournalId_fkey" FOREIGN KEY ("userJournalId") REFERENCES "userJournal"("id") ON DELETE CASCADE ON UPDATE CASCADE;
