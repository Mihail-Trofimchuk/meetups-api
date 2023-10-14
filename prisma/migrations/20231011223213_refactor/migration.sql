/*
  Warnings:

  - You are about to drop the column `created_by` on the `meetup` table. All the data in the column will be lost.
  - You are about to drop the column `isEmailConfirmed` on the `user` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "meetup" DROP CONSTRAINT "meetup_created_by_fkey";

-- AlterTable
ALTER TABLE "meetup" DROP COLUMN "created_by",
ADD COLUMN     "created_by_id" INTEGER;

-- AlterTable
ALTER TABLE "user" DROP COLUMN "isEmailConfirmed",
ADD COLUMN     "is_email_confirmed" BOOLEAN NOT NULL DEFAULT false;

-- AddForeignKey
ALTER TABLE "meetup" ADD CONSTRAINT "meetup_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
