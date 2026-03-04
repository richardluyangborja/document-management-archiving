/*
  Warnings:

  - The values [DOCUMENT_REQUESTED] on the enum `AuditLogAction` will be removed. If these variants are still used in the database, this will fail.
  - The values [AVAILABLE] on the enum `DocumentStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "AuditLogAction_new" AS ENUM ('DOCUMENT_CREATED', 'DOCUMENT_MODIFIED', 'DOCUMENT_DELETED', 'DOCUMENT_BACKUP', 'DOCUMENT_RESTORED', 'DOCUMENT_RENEWED', 'DOCUMENT_ARCHIVED', 'DOCUMENT_UNARCHIVED', 'DOCUMENT_BORROWED', 'DOCUMENT_RETURNED', 'DOCUMENT_LOCATION_CHANGE', 'ACCOUNT_CREATED', 'ACCOUNT_MODIFIED', 'ACCOUNT_DELETED', 'ACCOUNT_LOGIN', 'ACCOUNT_LOGOUT');
ALTER TABLE "AuditLog" ALTER COLUMN "action" TYPE "AuditLogAction_new" USING ("action"::text::"AuditLogAction_new");
ALTER TYPE "AuditLogAction" RENAME TO "AuditLogAction_old";
ALTER TYPE "AuditLogAction_new" RENAME TO "AuditLogAction";
DROP TYPE "public"."AuditLogAction_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "DocumentStatus_new" AS ENUM ('ACTIVE', 'BORROWED', 'EXPIRED', 'ARCHIVED');
ALTER TABLE "public"."Document" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Document" ALTER COLUMN "status" TYPE "DocumentStatus_new" USING ("status"::text::"DocumentStatus_new");
ALTER TYPE "DocumentStatus" RENAME TO "DocumentStatus_old";
ALTER TYPE "DocumentStatus_new" RENAME TO "DocumentStatus";
DROP TYPE "public"."DocumentStatus_old";
ALTER TABLE "Document" ALTER COLUMN "status" SET DEFAULT 'ACTIVE';
COMMIT;

-- AlterTable
ALTER TABLE "Document" ALTER COLUMN "status" SET DEFAULT 'ACTIVE';
