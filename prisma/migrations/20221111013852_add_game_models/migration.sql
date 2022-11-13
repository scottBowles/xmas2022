-- AlterTable
ALTER TABLE "User" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- CreateTable
CREATE TABLE "ChallengeSet" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL DEFAULT '',
    "instructions" TEXT NOT NULL DEFAULT '',
    "imageId" VARCHAR(255) NOT NULL DEFAULT '',
    "timeAvailableStart" TIMESTAMP(3),
    "timeAvailableEnd" TIMESTAMP(3),

    CONSTRAINT "ChallengeSet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Challenge" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL DEFAULT '',
    "prompt" TEXT NOT NULL DEFAULT '',
    "acceptedResponsesIfOpen" TEXT[],
    "scoreOnSubmit" BOOLEAN NOT NULL DEFAULT true,
    "challengeSetId" INTEGER NOT NULL,

    CONSTRAINT "Challenge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Option" (
    "id" SERIAL NOT NULL,
    "text" VARCHAR(255) NOT NULL DEFAULT '',
    "challengeId" INTEGER NOT NULL,
    "isCorrect" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Option_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChallengeResponse" (
    "id" SERIAL NOT NULL,
    "playerId" INTEGER NOT NULL,
    "challengeId" INTEGER NOT NULL,
    "response" TEXT NOT NULL DEFAULT '',
    "pointsEarned" INTEGER,
    "pointsManuallyAwarded" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "submittedBeforeSetStart" BOOLEAN NOT NULL DEFAULT false,
    "submittedAfterSetEnd" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ChallengeResponse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChallengeSetResponse" (
    "id" SERIAL NOT NULL,
    "playerId" INTEGER NOT NULL,
    "challengeSetId" INTEGER NOT NULL,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "clientRecordedTime" INTEGER,

    CONSTRAINT "ChallengeSetResponse_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ChallengeResponse_playerId_challengeId_key" ON "ChallengeResponse"("playerId", "challengeId");

-- CreateIndex
CREATE UNIQUE INDEX "ChallengeSetResponse_playerId_challengeSetId_key" ON "ChallengeSetResponse"("playerId", "challengeSetId");

-- AddForeignKey
ALTER TABLE "Challenge" ADD CONSTRAINT "Challenge_challengeSetId_fkey" FOREIGN KEY ("challengeSetId") REFERENCES "ChallengeSet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Option" ADD CONSTRAINT "Option_challengeId_fkey" FOREIGN KEY ("challengeId") REFERENCES "Challenge"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChallengeResponse" ADD CONSTRAINT "ChallengeResponse_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChallengeResponse" ADD CONSTRAINT "ChallengeResponse_challengeId_fkey" FOREIGN KEY ("challengeId") REFERENCES "Challenge"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChallengeSetResponse" ADD CONSTRAINT "ChallengeSetResponse_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChallengeSetResponse" ADD CONSTRAINT "ChallengeSetResponse_challengeSetId_fkey" FOREIGN KEY ("challengeSetId") REFERENCES "ChallengeSet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
