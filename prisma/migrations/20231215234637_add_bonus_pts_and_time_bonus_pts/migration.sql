-- AlterTable
ALTER TABLE "ChallengeSet" ADD COLUMN     "bonusPoints" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "timeBonusPoints" INTEGER NOT NULL DEFAULT 0;
