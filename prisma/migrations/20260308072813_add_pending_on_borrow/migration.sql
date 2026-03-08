/*
  Warnings:

  - The values [DUE] on the enum `BorrowStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "BorrowStatus_new" AS ENUM ('ACTIVE', 'RETURNED', 'PENDING');
ALTER TABLE "public"."BorrowTransaction" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "BorrowTransaction" ALTER COLUMN "status" TYPE "BorrowStatus_new" USING ("status"::text::"BorrowStatus_new");
ALTER TYPE "BorrowStatus" RENAME TO "BorrowStatus_old";
ALTER TYPE "BorrowStatus_new" RENAME TO "BorrowStatus";
DROP TYPE "public"."BorrowStatus_old";
ALTER TABLE "BorrowTransaction" ALTER COLUMN "status" SET DEFAULT 'ACTIVE';
COMMIT;
