/*
  Warnings:

  - You are about to drop the column `rol` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "rol",
ADD COLUMN     "role" TEXT;
