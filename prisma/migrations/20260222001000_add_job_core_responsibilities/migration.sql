-- AlterTable
ALTER TABLE "Job"
ADD COLUMN "core_responsibilities" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];
