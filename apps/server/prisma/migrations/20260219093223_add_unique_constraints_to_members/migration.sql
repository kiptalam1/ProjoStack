/*
  Warnings:

  - A unique constraint covering the columns `[userId,workspaceId]` on the table `WorkspaceMember` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "WorkspaceMember_userId_workspaceId_key" ON "WorkspaceMember"("userId", "workspaceId");
