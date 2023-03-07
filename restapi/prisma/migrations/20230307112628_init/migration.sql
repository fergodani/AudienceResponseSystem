-- DropForeignKey
ALTER TABLE "answer" DROP CONSTRAINT "answer_question_id_fkey";

-- AddForeignKey
ALTER TABLE "answer" ADD CONSTRAINT "answer_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "question"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
