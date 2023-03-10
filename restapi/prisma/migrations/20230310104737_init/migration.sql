-- AlterTable
ALTER TABLE "question" ADD COLUMN     "user_creator_id" INTEGER;

-- AddForeignKey
ALTER TABLE "question" ADD CONSTRAINT "question_user_creator_id_fkey" FOREIGN KEY ("user_creator_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
