-- CreateEnum
CREATE TYPE "role" AS ENUM ('student', 'professor', 'admin');

-- CreateEnum
CREATE TYPE "state" AS ENUM ('created', 'opened', 'closed');

-- CreateEnum
CREATE TYPE "type" AS ENUM ('multioption', 'true_false', 'short');

-- CreateTable
CREATE TABLE "UserCourse" (
    "user_id" INTEGER NOT NULL,
    "course_id" INTEGER NOT NULL,

    CONSTRAINT "UserCourse_pkey" PRIMARY KEY ("user_id","course_id")
);

-- CreateTable
CREATE TABLE "answer" (
    "id" INTEGER NOT NULL,
    "description" VARCHAR NOT NULL,
    "is_correct" BOOLEAN,
    "question_id" INTEGER,

    CONSTRAINT "answer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "asociatedSurvey" (
    "user_id" INTEGER NOT NULL,
    "survey_id" INTEGER NOT NULL,
    "mark" INTEGER NOT NULL,

    CONSTRAINT "asociatedSurvey_pkey" PRIMARY KEY ("user_id","survey_id")
);

-- CreateTable
CREATE TABLE "course" (
    "id" INTEGER NOT NULL,
    "description" VARCHAR NOT NULL,
    "created_at" TIMESTAMP(6),

    CONSTRAINT "course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "courseQuestion" (
    "question_id" INTEGER NOT NULL,
    "course_id" INTEGER NOT NULL,

    CONSTRAINT "courseQuestion_pkey" PRIMARY KEY ("question_id","course_id")
);

-- CreateTable
CREATE TABLE "courseSurvey" (
    "survey_id" INTEGER NOT NULL,
    "course_id" INTEGER NOT NULL,

    CONSTRAINT "courseSurvey_pkey" PRIMARY KEY ("survey_id","course_id")
);

-- CreateTable
CREATE TABLE "game" (
    "id" SERIAL NOT NULL,
    "host_id" INTEGER,
    "survey_id" INTEGER,
    "is_live" BOOLEAN,
    "is_offline" BOOLEAN,
    "is_questions_visible" BOOLEAN,
    "date" TIMESTAMP(6),

    CONSTRAINT "game_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "question" (
    "id" INTEGER NOT NULL,
    "description" VARCHAR NOT NULL,
    "subject" VARCHAR NOT NULL,
    "type" "type" NOT NULL,
    "answer_time" INTEGER NOT NULL,
    "created_at" TIMESTAMP(6),
    "survey_id" INTEGER,

    CONSTRAINT "question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "survey" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL,
    "end_date" TIMESTAMP(6) NOT NULL,
    "user_creator_id" INTEGER,
    "state" "state",

    CONSTRAINT "survey_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "username" VARCHAR NOT NULL,
    "password" VARCHAR NOT NULL,
    "created_at" TIMESTAMP(6),
    "role" "role" NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UserCourse" ADD CONSTRAINT "UserCourse_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "course"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "UserCourse" ADD CONSTRAINT "UserCourse_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "answer" ADD CONSTRAINT "answer_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "question"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "asociatedSurvey" ADD CONSTRAINT "asociatedSurvey_survey_id_fkey" FOREIGN KEY ("survey_id") REFERENCES "survey"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "asociatedSurvey" ADD CONSTRAINT "asociatedSurvey_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "courseQuestion" ADD CONSTRAINT "courseQuestion_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "course"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "courseQuestion" ADD CONSTRAINT "courseQuestion_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "question"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "courseSurvey" ADD CONSTRAINT "courseSurvey_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "course"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "courseSurvey" ADD CONSTRAINT "courseSurvey_survey_id_fkey" FOREIGN KEY ("survey_id") REFERENCES "survey"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "game" ADD CONSTRAINT "game_host_id_fkey" FOREIGN KEY ("host_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "game" ADD CONSTRAINT "game_survey_id_fkey" FOREIGN KEY ("survey_id") REFERENCES "survey"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "question" ADD CONSTRAINT "question_survey_id_fkey" FOREIGN KEY ("survey_id") REFERENCES "survey"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "survey" ADD CONSTRAINT "survey_user_creator_id_fkey" FOREIGN KEY ("user_creator_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
