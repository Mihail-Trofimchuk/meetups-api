-- DropForeignKey
ALTER TABLE "meetup" DROP CONSTRAINT "meetup_created_by_id_fkey";

-- DropForeignKey
ALTER TABLE "user" DROP CONSTRAINT "user_avatar_id_fkey";

-- DropForeignKey
ALTER TABLE "user_meetup" DROP CONSTRAINT "user_meetup_meetup_id_fkey";

-- DropForeignKey
ALTER TABLE "user_meetup" DROP CONSTRAINT "user_meetup_user_id_fkey";

-- AddForeignKey
ALTER TABLE "user_meetup" ADD CONSTRAINT "user_meetup_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_meetup" ADD CONSTRAINT "user_meetup_meetup_id_fkey" FOREIGN KEY ("meetup_id") REFERENCES "meetup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_avatar_id_fkey" FOREIGN KEY ("avatar_id") REFERENCES "local_file"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meetup" ADD CONSTRAINT "meetup_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
