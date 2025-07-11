-- CreateTable
CREATE TABLE "GlobalSubCategoryUserJournal" (
    "id" SERIAL NOT NULL,
    "order" INTEGER NOT NULL,
    "globalSubCategoryId" INTEGER NOT NULL,
    "userJournalId" INTEGER NOT NULL,

    CONSTRAINT "GlobalSubCategoryUserJournal_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GlobalSubCategoryUserJournal_globalSubCategoryId_userJourna_key" ON "GlobalSubCategoryUserJournal"("globalSubCategoryId", "userJournalId");

-- AddForeignKey
ALTER TABLE "GlobalSubCategoryUserJournal" ADD CONSTRAINT "GlobalSubCategoryUserJournal_globalSubCategoryId_fkey" FOREIGN KEY ("globalSubCategoryId") REFERENCES "global_subcategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GlobalSubCategoryUserJournal" ADD CONSTRAINT "GlobalSubCategoryUserJournal_userJournalId_fkey" FOREIGN KEY ("userJournalId") REFERENCES "userJournal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
