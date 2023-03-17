/*
  Warnings:

  - The values [opened] on the enum `state` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "state_new" AS ENUM ('created', 'started', 'closed');
ALTER TABLE "game" ALTER COLUMN "state" TYPE "state_new" USING ("state"::text::"state_new");
ALTER TYPE "state" RENAME TO "state_old";
ALTER TYPE "state_new" RENAME TO "state";
DROP TYPE "state_old";
COMMIT;
