/*
  Warnings:

  - A unique constraint covering the columns `[fin]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[idSerial]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[passportId]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "passportId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "users_fin_key" ON "users"("fin");

-- CreateIndex
CREATE UNIQUE INDEX "users_idSerial_key" ON "users"("idSerial");

-- CreateIndex
CREATE UNIQUE INDEX "users_passportId_key" ON "users"("passportId");
