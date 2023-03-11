/*
  Warnings:

  - You are about to drop the `questionSurvey` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "questionSurvey" DROP CONSTRAINT "questionSurvey_question_id_fkey";

-- DropForeignKey
ALTER TABLE "questionSurvey" DROP CONSTRAINT "questionSurvey_survey_id_fkey";

-- DropTable
DROP TABLE "questionSurvey";

-- CreateTable
CREATE TABLE "_questionTosurvey" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_questionTosurvey_AB_unique" ON "_questionTosurvey"("A", "B");

-- CreateIndex
CREATE INDEX "_questionTosurvey_B_index" ON "_questionTosurvey"("B");

-- AddForeignKey
ALTER TABLE "_questionTosurvey" ADD CONSTRAINT "_questionTosurvey_A_fkey" FOREIGN KEY ("A") REFERENCES "question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_questionTosurvey" ADD CONSTRAINT "_questionTosurvey_B_fkey" FOREIGN KEY ("B") REFERENCES "survey"("id") ON DELETE CASCADE ON UPDATE CASCADE;
