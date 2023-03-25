/*
  Warnings:

  - Added the required column `question_id` to the `answerResult` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "answerResult" ADD COLUMN     "question_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "answerResult" ADD CONSTRAINT "answerResult_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "question"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
