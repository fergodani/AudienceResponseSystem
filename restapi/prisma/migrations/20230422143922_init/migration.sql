/*
  Warnings:

  - Made the column `is_correct` on table `answer` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "answer" ALTER COLUMN "is_correct" SET NOT NULL;
