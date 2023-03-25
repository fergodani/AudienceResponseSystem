-- DropForeignKey
ALTER TABLE "UserCourse" DROP CONSTRAINT "UserCourse_course_id_fkey";

-- DropForeignKey
ALTER TABLE "UserCourse" DROP CONSTRAINT "UserCourse_user_id_fkey";

-- DropForeignKey
ALTER TABLE "answerResult" DROP CONSTRAINT "answerResult_answer_id_fkey";

-- DropForeignKey
ALTER TABLE "answerResult" DROP CONSTRAINT "answerResult_question_id_fkey";

-- DropForeignKey
ALTER TABLE "courseQuestion" DROP CONSTRAINT "courseQuestion_course_id_fkey";

-- DropForeignKey
ALTER TABLE "courseQuestion" DROP CONSTRAINT "courseQuestion_question_id_fkey";

-- DropForeignKey
ALTER TABLE "courseSurvey" DROP CONSTRAINT "courseSurvey_course_id_fkey";

-- DropForeignKey
ALTER TABLE "courseSurvey" DROP CONSTRAINT "courseSurvey_survey_id_fkey";

-- DropForeignKey
ALTER TABLE "gameResult" DROP CONSTRAINT "gameResult_game_id_fkey";

-- DropForeignKey
ALTER TABLE "gameResult" DROP CONSTRAINT "gameResult_user_id_fkey";

-- DropForeignKey
ALTER TABLE "questionSurvey" DROP CONSTRAINT "questionSurvey_question_id_fkey";

-- DropForeignKey
ALTER TABLE "questionSurvey" DROP CONSTRAINT "questionSurvey_survey_id_fkey";

-- AddForeignKey
ALTER TABLE "UserCourse" ADD CONSTRAINT "UserCourse_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "course"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "UserCourse" ADD CONSTRAINT "UserCourse_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "courseQuestion" ADD CONSTRAINT "courseQuestion_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "course"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "courseQuestion" ADD CONSTRAINT "courseQuestion_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "question"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "questionSurvey" ADD CONSTRAINT "questionSurvey_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "question"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "questionSurvey" ADD CONSTRAINT "questionSurvey_survey_id_fkey" FOREIGN KEY ("survey_id") REFERENCES "survey"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "courseSurvey" ADD CONSTRAINT "courseSurvey_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "course"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "courseSurvey" ADD CONSTRAINT "courseSurvey_survey_id_fkey" FOREIGN KEY ("survey_id") REFERENCES "survey"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "gameResult" ADD CONSTRAINT "gameResult_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "gameResult" ADD CONSTRAINT "gameResult_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "game"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "answerResult" ADD CONSTRAINT "answerResult_answer_id_fkey" FOREIGN KEY ("answer_id") REFERENCES "answer"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "answerResult" ADD CONSTRAINT "answerResult_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "question"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
