/*
  Warnings:

  - You are about to drop the column `tags` on the `meetup` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "meetup" DROP COLUMN "tags";

-- CreateTable
CREATE TABLE "tag" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "meetup_tag" (
    "meetup_id" INTEGER NOT NULL,
    "tag_id" INTEGER NOT NULL,

    CONSTRAINT "meetup_tag_pkey" PRIMARY KEY ("meetup_id","tag_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tag_name_key" ON "tag"("name");

-- AddForeignKey
ALTER TABLE "meetup_tag" ADD CONSTRAINT "meetup_tag_meetup_id_fkey" FOREIGN KEY ("meetup_id") REFERENCES "meetup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meetup_tag" ADD CONSTRAINT "meetup_tag_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
