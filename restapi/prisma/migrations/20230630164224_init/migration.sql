-- AlterTable
ALTER TABLE "course" ADD COLUMN     "resource" TEXT;

-- AlterTable
ALTER TABLE "game" ALTER COLUMN "date" SET DATA TYPE TIMESTAMP(3);
