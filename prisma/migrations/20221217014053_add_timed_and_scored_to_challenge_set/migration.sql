-- AlterTable
ALTER TABLE "ChallengeSet" ADD COLUMN     "isScored" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isTimed" BOOLEAN NOT NULL DEFAULT false;
