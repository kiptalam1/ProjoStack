/*
  Warnings:

  - The values [DECLINE] on the enum `InviteStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `sentToId` on the `WorkspaceInvite` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[workspaceId,email]` on the table `WorkspaceInvite` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `WorkspaceInvite` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "InviteStatus_new" AS ENUM ('PENDING', 'ACCEPTED', 'DECLINED');
ALTER TABLE "public"."WorkspaceInvite" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "WorkspaceInvite" ALTER COLUMN "status" TYPE "InviteStatus_new" USING ("status"::text::"InviteStatus_new");
ALTER TYPE "InviteStatus" RENAME TO "InviteStatus_old";
ALTER TYPE "InviteStatus_new" RENAME TO "InviteStatus";
DROP TYPE "public"."InviteStatus_old";
ALTER TABLE "WorkspaceInvite" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- DropForeignKey
ALTER TABLE "WorkspaceInvite" DROP CONSTRAINT "WorkspaceInvite_sentToId_fkey";

-- DropIndex
DROP INDEX "WorkspaceInvite_workspaceId_sentToId_key";

-- AlterTable
ALTER TABLE "WorkspaceInvite" DROP COLUMN "sentToId",
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "expiresAt" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "WorkspaceInvite_workspaceId_email_key" ON "WorkspaceInvite"("workspaceId", "email");
