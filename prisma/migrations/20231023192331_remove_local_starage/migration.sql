/*
  Warnings:

  - You are about to drop the column `avatar_id` on the `user` table. All the data in the column will be lost.
  - You are about to drop the `local_file` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "user" DROP CONSTRAINT "user_avatar_id_fkey";

-- DropIndex
DROP INDEX "user_avatar_id_key";

-- AlterTable
ALTER TABLE "user" DROP COLUMN "avatar_id";

-- DropTable
DROP TABLE "local_file";
