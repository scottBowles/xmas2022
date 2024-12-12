-- DropForeignKey
ALTER TABLE "Challenge" DROP CONSTRAINT "Challenge_challengeSetId_fkey";

-- AlterTable
ALTER TABLE "Challenge" ADD COLUMN     "parentId" INTEGER,
ALTER COLUMN "challengeSetId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "CldImage" ADD COLUMN     "order" INTEGER;

-- AddForeignKey
ALTER TABLE "Challenge" ADD CONSTRAINT "Challenge_challengeSetId_fkey" FOREIGN KEY ("challengeSetId") REFERENCES "ChallengeSet"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Challenge" ADD CONSTRAINT "Challenge_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Challenge"("id") ON DELETE SET NULL ON UPDATE CASCADE;
