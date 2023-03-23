/*
  Warnings:

  - You are about to drop the column `is_live` on the `game` table. All the data in the column will be lost.
  - You are about to drop the column `is_offline` on the `game` table. All the data in the column will be lost.
  - You are about to drop the column `is_questions_visible` on the `game` table. All the data in the column will be lost.
  - You are about to drop the `asociatedSurvey` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `state` to the `game` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `game` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "game_type" AS ENUM ('offline', 'online');

-- DropForeignKey
ALTER TABLE "asociatedSurvey" DROP CONSTRAINT "asociatedSurvey_survey_id_fkey";

-- DropForeignKey
ALTER TABLE "asociatedSurvey" DROP CONSTRAINT "asociatedSurvey_user_id_fkey";

-- AlterTable
ALTER TABLE "game" DROP COLUMN "is_live",
DROP COLUMN "is_offline",
DROP COLUMN "is_questions_visible",
ADD COLUMN     "are_questions_visible" BOOLEAN,
ADD COLUMN     "state" "state" NOT NULL,
ADD COLUMN     "type" "game_type" NOT NULL;

-- DropTable
DROP TABLE "asociatedSurvey";
