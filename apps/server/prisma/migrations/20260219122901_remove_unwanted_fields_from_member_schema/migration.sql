/*
  Warnings:

  - You are about to drop the column `createdAt` on the `WorkspaceMember` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `WorkspaceMember` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "WorkspaceMember" DROP COLUMN "createdAt",
DROP COLUMN "role";
