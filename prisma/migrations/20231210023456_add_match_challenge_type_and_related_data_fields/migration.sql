-- AlterEnum
ALTER TYPE "ChallengeType" ADD VALUE 'MATCH';

-- AlterTable
ALTER TABLE "Challenge" ADD COLUMN     "matchOptions" TEXT[],
ADD COLUMN     "matches" TEXT[];
