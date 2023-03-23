/*
  Warnings:

  - Made the column `host_id` on table `game` required. This step will fail if there are existing NULL values in that column.
  - Made the column `survey_id` on table `game` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "game" ALTER COLUMN "host_id" SET NOT NULL,
ALTER COLUMN "survey_id" SET NOT NULL;
