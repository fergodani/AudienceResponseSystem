/*
  Warnings:

  - You are about to drop the column `survey_id` on the `question` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "question" DROP CONSTRAINT "question_survey_id_fkey";

-- AlterTable
ALTER TABLE "question" DROP COLUMN "survey_id";

-- CreateTable
CREATE TABLE "questionSurvey" (
    "question_id" INTEGER NOT NULL,
    "survey_id" INTEGER NOT NULL,

    CONSTRAINT "questionSurvey_pkey" PRIMARY KEY ("question_id","survey_id")
);

-- AddForeignKey
ALTER TABLE "questionSurvey" ADD CONSTRAINT "questionSurvey_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "question"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "questionSurvey" ADD CONSTRAINT "questionSurvey_survey_id_fkey" FOREIGN KEY ("survey_id") REFERENCES "survey"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
