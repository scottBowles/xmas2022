/*
  Warnings:

  - You are about to drop the column `numCorrect` on the `ChallengeSetResponse` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ChallengeSetResponse" DROP COLUMN "numCorrect",
ADD COLUMN     "points" INTEGER NOT NULL DEFAULT 0;
