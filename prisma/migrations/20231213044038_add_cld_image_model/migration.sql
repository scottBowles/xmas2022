-- CreateTable
CREATE TABLE "CldImage" (
    "id" SERIAL NOT NULL,
    "publicId" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "height" INTEGER NOT NULL,
    "width" INTEGER NOT NULL,
    "alt" TEXT,

    CONSTRAINT "CldImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ChallengeToCldImage" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "CldImage_publicId_key" ON "CldImage"("publicId");

-- CreateIndex
CREATE UNIQUE INDEX "_ChallengeToCldImage_AB_unique" ON "_ChallengeToCldImage"("A", "B");

-- CreateIndex
CREATE INDEX "_ChallengeToCldImage_B_index" ON "_ChallengeToCldImage"("B");

-- AddForeignKey
ALTER TABLE "_ChallengeToCldImage" ADD CONSTRAINT "_ChallengeToCldImage_A_fkey" FOREIGN KEY ("A") REFERENCES "Challenge"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChallengeToCldImage" ADD CONSTRAINT "_ChallengeToCldImage_B_fkey" FOREIGN KEY ("B") REFERENCES "CldImage"("id") ON DELETE CASCADE ON UPDATE CASCADE;
