/*
  Warnings:

  - The primary key for the `answer` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `answer` table. All the data in the column will be lost.
  - Made the column `question_id` on table `answer` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "answer" DROP CONSTRAINT "answer_pkey",
DROP COLUMN "id",
ALTER COLUMN "question_id" SET NOT NULL,
ADD CONSTRAINT "answer_pkey" PRIMARY KEY ("question_id");
