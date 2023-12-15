/*
  Warnings:

  - The values [WIN_STOP_OR_LOSE] on the enum `ChallengeType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ChallengeType_new" AS ENUM ('OPEN_RESPONSE', 'MULTIPLE_CHOICE', 'WORDLE', 'WORDLE_2023', 'SELECT_ELF_NAME', 'OFFLINE', 'YOUR_ELF_NAME_WORTH', 'MATCH', 'SANTAS_WORKSHOP', 'MULTIPLE_OPEN_RESPONSE', 'WIN_LOSE_OR_STOP');
ALTER TABLE "Challenge" ALTER COLUMN "type" DROP DEFAULT;
ALTER TABLE "Challenge" ALTER COLUMN "type" TYPE "ChallengeType_new" USING ("type"::text::"ChallengeType_new");
ALTER TYPE "ChallengeType" RENAME TO "ChallengeType_old";
ALTER TYPE "ChallengeType_new" RENAME TO "ChallengeType";
DROP TYPE "ChallengeType_old";
ALTER TABLE "Challenge" ALTER COLUMN "type" SET DEFAULT 'OPEN_RESPONSE';
COMMIT;
