/*
  Warnings:

  - The values [pending,watched,dropped,watching] on the enum `WatchStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "WatchStatus_new" AS ENUM ('PENDING', 'WATCHING', 'COMPLETED', 'DROPPED');
ALTER TABLE "public"."WatchList" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "WatchList" ALTER COLUMN "status" TYPE "WatchStatus_new" USING ("status"::text::"WatchStatus_new");
ALTER TYPE "WatchStatus" RENAME TO "WatchStatus_old";
ALTER TYPE "WatchStatus_new" RENAME TO "WatchStatus";
DROP TYPE "public"."WatchStatus_old";
ALTER TABLE "WatchList" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- AlterTable
ALTER TABLE "WatchList" ALTER COLUMN "status" SET DEFAULT 'PENDING';
