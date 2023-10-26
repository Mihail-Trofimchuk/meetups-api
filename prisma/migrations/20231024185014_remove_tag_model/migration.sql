/*
  Warnings:

  - You are about to drop the `meetup_tag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tag` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "meetup_tag" DROP CONSTRAINT "meetup_tag_meetup_id_fkey";

-- DropForeignKey
ALTER TABLE "meetup_tag" DROP CONSTRAINT "meetup_tag_tag_id_fkey";

-- AlterTable
ALTER TABLE "meetup" ADD COLUMN     "tags" TEXT[];

-- DropTable
DROP TABLE "meetup_tag";

-- DropTable
DROP TABLE "tag";
