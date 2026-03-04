-- AlterTable
ALTER TABLE "Document" ADD COLUMN     "backupPath" TEXT,
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;
