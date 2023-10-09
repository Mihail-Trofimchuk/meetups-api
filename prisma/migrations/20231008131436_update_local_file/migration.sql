/*
  Warnings:

  - You are about to drop the column `user_id` on the `LocalFile` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[avatar_id]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "LocalFile" DROP CONSTRAINT "LocalFile_user_id_fkey";

-- DropIndex
DROP INDEX "LocalFile_user_id_key";

-- AlterTable
ALTER TABLE "LocalFile" DROP COLUMN "user_id";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "avatar_id" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "User_avatar_id_key" ON "User"("avatar_id");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_avatar_id_fkey" FOREIGN KEY ("avatar_id") REFERENCES "LocalFile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
