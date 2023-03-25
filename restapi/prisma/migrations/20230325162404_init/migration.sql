/*
  Warnings:

  - You are about to drop the `_questionTosurvey` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_questionTosurvey" DROP CONSTRAINT "_questionTosurvey_A_fkey";

-- DropForeignKey
ALTER TABLE "_questionTosurvey" DROP CONSTRAINT "_questionTosurvey_B_fkey";

-- DropTable
DROP TABLE "_questionTosurvey";

-- CreateTable
CREATE TABLE "questionSurvey" (
    "question_id" INTEGER NOT NULL,
    "survey_id" INTEGER NOT NULL,
    "position" INTEGER NOT NULL,

    CONSTRAINT "questionSurvey_pkey" PRIMARY KEY ("question_id","survey_id")
);

-- AddForeignKey
ALTER TABLE "questionSurvey" ADD CONSTRAINT "questionSurvey_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "question"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "questionSurvey" ADD CONSTRAINT "questionSurvey_survey_id_fkey" FOREIGN KEY ("survey_id") REFERENCES "survey"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
