-- AlterTable
ALTER TABLE "_ChallengeToCldImage" ADD CONSTRAINT "_ChallengeToCldImage_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_ChallengeToCldImage_AB_unique";
