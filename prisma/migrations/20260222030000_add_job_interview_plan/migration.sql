-- AlterTable
ALTER TABLE "Job"
ADD COLUMN "interview_plan" JSONB NOT NULL DEFAULT '[]'::jsonb;
