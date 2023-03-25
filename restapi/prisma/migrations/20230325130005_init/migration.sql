/*
  Warnings:

  - The primary key for the `answerResult` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "answerResult" DROP CONSTRAINT "answerResult_pkey",
ADD CONSTRAINT "answerResult_pkey" PRIMARY KEY ("game_id", "user_id", "question_id");
