ALTER TABLE "admin_profiles" DROP CONSTRAINT "admin_profiles_admin_id_members_id_fk";
--> statement-breakpoint
ALTER TABLE "admin_profiles_to_admin_titles" DROP CONSTRAINT "admin_profiles_to_admin_titles_admin_profile_id_admin_profiles_id_fk";
--> statement-breakpoint
ALTER TABLE "admin_profiles_to_admin_titles" DROP CONSTRAINT "admin_profiles_to_admin_titles_admin_title_id_admin_titles_id_fk";
--> statement-breakpoint
ALTER TABLE "societies_to_admins" DROP CONSTRAINT "societies_to_admins_society_id_societies_id_fk";
--> statement-breakpoint
ALTER TABLE "societies_to_admins" DROP CONSTRAINT "societies_to_admins_admin_id_admin_profiles_id_fk";
--> statement-breakpoint
ALTER TABLE "societyInterviews" DROP CONSTRAINT "societyInterviews_application_id_society_application_id_fk";
--> statement-breakpoint
ALTER TABLE "societyInterviews" DROP CONSTRAINT "societyInterviews_interviewer_id_admin_profiles_id_fk";
--> statement-breakpoint
ALTER TABLE "societyInterviews" DROP CONSTRAINT "societyInterviews_interviewee_id_members_id_fk";
--> statement-breakpoint
ALTER TABLE "societyInterviews" DROP CONSTRAINT "societyInterviews_associated_society_id_societies_id_fk";
--> statement-breakpoint
ALTER TABLE "societyInterviews" DROP CONSTRAINT "societyInterviews_time_slot_id_time_slots_id_fk";
--> statement-breakpoint
ALTER TABLE "time_slots" DROP CONSTRAINT "time_slots_admin_id_admin_profiles_id_fk";
--> statement-breakpoint
ALTER TABLE "admin_profiles" ALTER COLUMN "linkedin_url" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "admin_profiles_to_admin_titles" ALTER COLUMN "admin_profile_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "admin_profiles_to_admin_titles" ALTER COLUMN "admin_title_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "societyInterviews" ALTER COLUMN "interviewer_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "admin_profiles" ADD CONSTRAINT "admin_profiles_admin_id_members_id_fk" FOREIGN KEY ("admin_id") REFERENCES "public"."members"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "admin_profiles_to_admin_titles" ADD CONSTRAINT "admin_profiles_to_admin_titles_admin_profile_id_admin_profiles_id_fk" FOREIGN KEY ("admin_profile_id") REFERENCES "public"."admin_profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "admin_profiles_to_admin_titles" ADD CONSTRAINT "admin_profiles_to_admin_titles_admin_title_id_admin_titles_id_fk" FOREIGN KEY ("admin_title_id") REFERENCES "public"."admin_titles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "societies_to_admins" ADD CONSTRAINT "societies_to_admins_society_id_societies_id_fk" FOREIGN KEY ("society_id") REFERENCES "public"."societies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "societies_to_admins" ADD CONSTRAINT "societies_to_admins_admin_id_admin_profiles_id_fk" FOREIGN KEY ("admin_id") REFERENCES "public"."admin_profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "societyInterviews" ADD CONSTRAINT "societyInterviews_application_id_society_application_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."society_application"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "societyInterviews" ADD CONSTRAINT "societyInterviews_interviewer_id_admin_profiles_id_fk" FOREIGN KEY ("interviewer_id") REFERENCES "public"."admin_profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "societyInterviews" ADD CONSTRAINT "societyInterviews_interviewee_id_members_id_fk" FOREIGN KEY ("interviewee_id") REFERENCES "public"."members"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "societyInterviews" ADD CONSTRAINT "societyInterviews_associated_society_id_societies_id_fk" FOREIGN KEY ("associated_society_id") REFERENCES "public"."societies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "societyInterviews" ADD CONSTRAINT "societyInterviews_time_slot_id_time_slots_id_fk" FOREIGN KEY ("time_slot_id") REFERENCES "public"."time_slots"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "time_slots" ADD CONSTRAINT "time_slots_admin_id_admin_profiles_id_fk" FOREIGN KEY ("admin_id") REFERENCES "public"."admin_profiles"("id") ON DELETE cascade ON UPDATE no action;