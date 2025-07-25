CREATE TYPE "public"."application_status" AS ENUM('pending', 'approved', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."club_role" AS ENUM('member', 'admin');--> statement-breakpoint
CREATE TYPE "public"."interview_status" AS ENUM('scheduled', 'rescheduled', 'completed', 'cancelled', 'approved', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."year" AS ENUM('preparatory', 'freshman', 'sophomore', 'junior', 'senior', 'graduate');--> statement-breakpoint
CREATE TABLE "admin_profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"admin_id" uuid,
	"img_id" varchar,
	"img_url" text,
	"linkedin_url" text,
	"public_email" varchar NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "admin_profiles_to_admin_titles" (
	"admin_profile_id" uuid NOT NULL,
	"admin_title_id" uuid NOT NULL,
	CONSTRAINT "admin_profiles_to_admin_titles_admin_profile_id_admin_title_id_pk" PRIMARY KEY("admin_profile_id","admin_title_id")
);
--> statement-breakpoint
CREATE TABLE "admin_titles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar NOT NULL,
	"title_en" varchar NOT NULL,
	"title_tr" varchar NOT NULL,
	"society_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "club_settings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"are_new_member_registrations_open" boolean DEFAULT false NOT NULL,
	"are_society_applications_open" boolean DEFAULT false NOT NULL,
	"society_applications_open_date" timestamp,
	"society_applications_close_date" timestamp,
	"are_society_interviews_open" boolean DEFAULT false NOT NULL,
	"society_interviews_open_date" timestamp,
	"society_interviews_close_date" timestamp,
	"are_open_position_applications_open" boolean DEFAULT false NOT NULL,
	"open_position_applications_open_date" timestamp,
	"open_position_applications_close_date" timestamp,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "members" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clerk_user_id" varchar NOT NULL,
	"name" varchar NOT NULL,
	"surname" varchar NOT NULL,
	"student_id" varchar NOT NULL,
	"faculty" varchar NOT NULL,
	"department" varchar NOT NULL,
	"email" varchar NOT NULL,
	"phone_number" varchar NOT NULL,
	"is_previous_year" boolean DEFAULT false NOT NULL,
	"year" "year" NOT NULL,
	"expectations" text NOT NULL,
	"club_role" "club_role" DEFAULT 'member' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "members_clerk_user_id_unique" UNIQUE("clerk_user_id")
);
--> statement-breakpoint
CREATE TABLE "open_position_applications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar NOT NULL,
	"surname" varchar NOT NULL,
	"student_id" varchar NOT NULL,
	"faculty" varchar NOT NULL,
	"department" varchar NOT NULL,
	"email" varchar NOT NULL,
	"phone_number" varchar NOT NULL,
	"year" "year" NOT NULL,
	"motivation" text NOT NULL,
	"weekly_commitment_hours" varchar NOT NULL,
	"references" text NOT NULL,
	"status" "application_status" DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar NOT NULL,
	"surname" varchar NOT NULL,
	"student_id" varchar NOT NULL,
	"faculty" varchar NOT NULL,
	"department" varchar NOT NULL,
	"email" varchar NOT NULL,
	"phone_number" varchar NOT NULL,
	"is_previous_year" boolean DEFAULT false NOT NULL,
	"year" "year" NOT NULL,
	"expectations" text NOT NULL,
	"status" "application_status" DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "societies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar NOT NULL,
	"slug" varchar NOT NULL,
	"description_tr" text NOT NULL,
	"description_en" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "societies_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "societies_to_admins" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"society_id" uuid NOT NULL,
	"admin_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "societies_to_members" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"society_id" uuid NOT NULL,
	"member_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "society_application" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"applicant_id" uuid NOT NULL,
	"associated_society_id" uuid NOT NULL,
	"motivation" text NOT NULL,
	"status" "application_status" DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "societyInterviews" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"application_id" uuid NOT NULL,
	"interviewer_id" uuid,
	"interviewee_id" uuid NOT NULL,
	"associated_society_id" uuid NOT NULL,
	"time_slot_id" uuid NOT NULL,
	"notes" text NOT NULL,
	"status" "interview_status" DEFAULT 'scheduled' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "time_slots" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"admin_id" uuid NOT NULL,
	"start_time" timestamp NOT NULL,
	"end_time" timestamp NOT NULL,
	"is_available" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
ALTER TABLE "admin_profiles" ADD CONSTRAINT "admin_profiles_admin_id_members_id_fk" FOREIGN KEY ("admin_id") REFERENCES "public"."members"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "admin_profiles_to_admin_titles" ADD CONSTRAINT "admin_profiles_to_admin_titles_admin_profile_id_admin_profiles_id_fk" FOREIGN KEY ("admin_profile_id") REFERENCES "public"."admin_profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "admin_profiles_to_admin_titles" ADD CONSTRAINT "admin_profiles_to_admin_titles_admin_title_id_admin_titles_id_fk" FOREIGN KEY ("admin_title_id") REFERENCES "public"."admin_titles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "admin_titles" ADD CONSTRAINT "admin_titles_society_id_societies_id_fk" FOREIGN KEY ("society_id") REFERENCES "public"."societies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "societies_to_admins" ADD CONSTRAINT "societies_to_admins_society_id_societies_id_fk" FOREIGN KEY ("society_id") REFERENCES "public"."societies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "societies_to_admins" ADD CONSTRAINT "societies_to_admins_admin_id_admin_profiles_id_fk" FOREIGN KEY ("admin_id") REFERENCES "public"."admin_profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "societies_to_members" ADD CONSTRAINT "societies_to_members_society_id_societies_id_fk" FOREIGN KEY ("society_id") REFERENCES "public"."societies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "societies_to_members" ADD CONSTRAINT "societies_to_members_member_id_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."members"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "society_application" ADD CONSTRAINT "society_application_applicant_id_members_id_fk" FOREIGN KEY ("applicant_id") REFERENCES "public"."members"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "society_application" ADD CONSTRAINT "society_application_associated_society_id_societies_id_fk" FOREIGN KEY ("associated_society_id") REFERENCES "public"."societies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "societyInterviews" ADD CONSTRAINT "societyInterviews_application_id_society_application_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."society_application"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "societyInterviews" ADD CONSTRAINT "societyInterviews_interviewer_id_admin_profiles_id_fk" FOREIGN KEY ("interviewer_id") REFERENCES "public"."admin_profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "societyInterviews" ADD CONSTRAINT "societyInterviews_interviewee_id_members_id_fk" FOREIGN KEY ("interviewee_id") REFERENCES "public"."members"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "societyInterviews" ADD CONSTRAINT "societyInterviews_associated_society_id_societies_id_fk" FOREIGN KEY ("associated_society_id") REFERENCES "public"."societies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "societyInterviews" ADD CONSTRAINT "societyInterviews_time_slot_id_time_slots_id_fk" FOREIGN KEY ("time_slot_id") REFERENCES "public"."time_slots"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "time_slots" ADD CONSTRAINT "time_slots_admin_id_admin_profiles_id_fk" FOREIGN KEY ("admin_id") REFERENCES "public"."admin_profiles"("id") ON DELETE cascade ON UPDATE no action;