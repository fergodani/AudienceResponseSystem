/*
  Warnings:

  - The primary key for the `answer` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "answer" DROP CONSTRAINT "answer_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "answer_pkey" PRIMARY KEY ("id");
