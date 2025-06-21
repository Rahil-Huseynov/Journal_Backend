-- CreateTable
CREATE TABLE "subcategory" (
    "id" SERIAL NOT NULL,
    "title_az" TEXT,
    "title_en" TEXT,
    "title_ru" TEXT,
    "description" TEXT,

    CONSTRAINT "subcategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CategoryToSubCategory" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_CategoryToSubCategory_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_JournalSubcategories" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_JournalSubcategories_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_CategoryToSubCategory_B_index" ON "_CategoryToSubCategory"("B");

-- CreateIndex
CREATE INDEX "_JournalSubcategories_B_index" ON "_JournalSubcategories"("B");

-- AddForeignKey
ALTER TABLE "_CategoryToSubCategory" ADD CONSTRAINT "_CategoryToSubCategory_A_fkey" FOREIGN KEY ("A") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToSubCategory" ADD CONSTRAINT "_CategoryToSubCategory_B_fkey" FOREIGN KEY ("B") REFERENCES "subcategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_JournalSubcategories" ADD CONSTRAINT "_JournalSubcategories_A_fkey" FOREIGN KEY ("A") REFERENCES "subcategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_JournalSubcategories" ADD CONSTRAINT "_JournalSubcategories_B_fkey" FOREIGN KEY ("B") REFERENCES "userJournal"("id") ON DELETE CASCADE ON UPDATE CASCADE;
