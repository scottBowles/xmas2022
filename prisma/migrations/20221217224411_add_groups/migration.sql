-- CreateTable
CREATE TABLE "GroupOnUsers" (
    "groupId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "GroupOnUsers_pkey" PRIMARY KEY ("groupId","userId")
);

-- CreateTable
CREATE TABLE "Group" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Group_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "GroupOnUsers" ADD CONSTRAINT "GroupOnUsers_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupOnUsers" ADD CONSTRAINT "GroupOnUsers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
