ALTER TABLE "societyInterviews" ALTER COLUMN "status" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "societyInterviews" ALTER COLUMN "status" SET DEFAULT 'scheduled'::text;--> statement-breakpoint
DROP TYPE "public"."interview_status";--> statement-breakpoint
CREATE TYPE "public"."interview_status" AS ENUM('scheduled', 'rescheduled', 'completed', 'cancelled', 'approved', 'rejected');--> statement-breakpoint
ALTER TABLE "societyInterviews" ALTER COLUMN "status" SET DEFAULT 'scheduled'::"public"."interview_status";--> statement-breakpoint
ALTER TABLE "societyInterviews" ALTER COLUMN "status" SET DATA TYPE "public"."interview_status" USING "status"::"public"."interview_status";