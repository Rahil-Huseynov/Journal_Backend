-- CreateTable
CREATE TABLE "_AuthorCategories" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_AuthorCategories_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_AuthorCategories_B_index" ON "_AuthorCategories"("B");

-- AddForeignKey
ALTER TABLE "_AuthorCategories" ADD CONSTRAINT "_AuthorCategories_A_fkey" FOREIGN KEY ("A") REFERENCES "author"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AuthorCategories" ADD CONSTRAINT "_AuthorCategories_B_fkey" FOREIGN KEY ("B") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
