/*
  Warnings:

  - Made the column `user_creator_id` on table `question` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "question" ALTER COLUMN "user_creator_id" SET NOT NULL;
