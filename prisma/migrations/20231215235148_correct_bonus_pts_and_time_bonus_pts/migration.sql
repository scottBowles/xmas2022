/*
  Warnings:

  - You are about to drop the column `bonusPoints` on the `ChallengeSet` table. All the data in the column will be lost.
  - You are about to drop the column `timeBonusPoints` on the `ChallengeSet` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ChallengeSet" DROP COLUMN "bonusPoints",
DROP COLUMN "timeBonusPoints";

-- AlterTable
ALTER TABLE "ChallengeSetResponse" ADD COLUMN     "bonusPoints" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "timeBonusPoints" INTEGER NOT NULL DEFAULT 0;
