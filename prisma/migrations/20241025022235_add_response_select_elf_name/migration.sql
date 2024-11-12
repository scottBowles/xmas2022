/*
  Warnings:

  - A unique constraint covering the columns `[responseSelectElfNameId]` on the table `ChallengeResponse` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "ChallengeResponse" ADD COLUMN     "responseSelectElfNameId" INTEGER;

-- CreateTable
CREATE TABLE "ResponseSelectElfName" (
    "id" SERIAL NOT NULL,
    "selectedFirstName" VARCHAR(255) NOT NULL,
    "selectedLastName" VARCHAR(255) NOT NULL,

    CONSTRAINT "ResponseSelectElfName_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ChallengeResponse_responseSelectElfNameId_key" ON "ChallengeResponse"("responseSelectElfNameId");

-- AddForeignKey
ALTER TABLE "ChallengeResponse" ADD CONSTRAINT "ChallengeResponse_responseSelectElfNameId_fkey" FOREIGN KEY ("responseSelectElfNameId") REFERENCES "ResponseSelectElfName"("id") ON DELETE SET NULL ON UPDATE CASCADE;
