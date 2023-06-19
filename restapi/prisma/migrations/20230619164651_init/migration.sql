/*
  Warnings:

  - Added the required column `correct_questions` to the `gameResult` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total_questions` to the `gameResult` table without a default value. This is not possible if the table is not empty.
  - Added the required column `wrong_questions` to the `gameResult` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "gameResult" ADD COLUMN     "correct_questions" INTEGER NOT NULL,
ADD COLUMN     "total_questions" INTEGER NOT NULL,
ADD COLUMN     "wrong_questions" INTEGER NOT NULL;
