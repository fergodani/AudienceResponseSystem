/*
  Warnings:

  - You are about to drop the column `resource` on the `course` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "course" DROP COLUMN "resource",
ADD COLUMN     "image" TEXT;
