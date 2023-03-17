/*
  Warnings:

  - Added the required column `point_type` to the `game` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "point_type" AS ENUM ('standard', 'double', 'no_points');

-- AlterTable
ALTER TABLE "game" ADD COLUMN     "point_type" "point_type" NOT NULL;
