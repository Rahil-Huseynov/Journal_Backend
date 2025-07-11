-- CreateTable
CREATE TABLE "author" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "firstName" TEXT,
    "lastName" TEXT,
    "about" TEXT,

    CONSTRAINT "author_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "news" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title_az" TEXT,
    "title_en" TEXT,
    "title_ru" TEXT,
    "description_az" TEXT,
    "description_en" TEXT,
    "description_ru" TEXT,
    "image" TEXT,

    CONSTRAINT "news_pkey" PRIMARY KEY ("id")
);
