-- SQL Schema for Open Recruitment Neo Telemetri 2026 (PostgreSQL Compatible)
-- Updated based on Prisma Migrations (2026-03-19)

-- Create Enums
CREATE TYPE "user_role" AS ENUM ('ADMIN', 'USER');
CREATE TYPE "verification_status" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
CREATE TYPE "payment_status" AS ENUM ('PENDING', 'PAID', 'FAILED', 'EXPIRED', 'REFUNDED');
CREATE TYPE "payment_provider" AS ENUM ('MIDTRANS', 'XENDIT', 'OTHER');
CREATE TYPE "exam_type" AS ENUM ('MCQ', 'TRUE_FALSE', 'SHORT_TEXT');
CREATE TYPE "attempt_status" AS ENUM ('IN_PROGRESS', 'SUBMITTED', 'TIMEOUT');
CREATE TYPE "attendance_status" AS ENUM ('PRESENT', 'LATE', 'EXCUSED', 'ABSENT');

-- Users Table
CREATE TABLE "users" (
    "id" TEXT PRIMARY KEY,
    "email" VARCHAR(255) UNIQUE NOT NULL,
    "password_hash" TEXT NOT NULL,
    "role" "user_role" NOT NULL DEFAULT 'USER',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Departments Table
CREATE TABLE "departments" (
    "id" TEXT PRIMARY KEY,
    "name" VARCHAR(255) UNIQUE NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Recruitment Timelines Table
CREATE TABLE "recruitment_timelines" (
    "id" TEXT PRIMARY KEY,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "start_at" TIMESTAMP(3) NOT NULL,
    "end_at" TIMESTAMP(3) NOT NULL,
    "order_index" INTEGER NOT NULL,
    "attendance_passcode" VARCHAR(50),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Attendances Table
CREATE TABLE "attendances" (
    "id" TEXT PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "timeline_id" TEXT NOT NULL,
    "check_in_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "attendance_status" NOT NULL DEFAULT 'PRESENT',
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE("user_id", "timeline_id"),
    CONSTRAINT "fk_attendance_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE,
    CONSTRAINT "fk_attendance_timeline" FOREIGN KEY ("timeline_id") REFERENCES "recruitment_timelines"("id") ON DELETE CASCADE
);

-- Divisions Table
CREATE TABLE "divisions" (
    "id" TEXT PRIMARY KEY,
    "department_id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE("department_id", "name"),
    CONSTRAINT "fk_division_department" FOREIGN KEY ("department_id") REFERENCES "departments"("id") ON DELETE CASCADE
);

-- Sub Divisions Table
CREATE TABLE "sub_divisions" (
    "id" TEXT PRIMARY KEY,
    "division_id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE("division_id", "name"),
    CONSTRAINT "fk_subdivision_division" FOREIGN KEY ("division_id") REFERENCES "divisions"("id") ON DELETE CASCADE
);

-- Profiles Table
CREATE TABLE "profiles" (
    "id" TEXT PRIMARY KEY,
    "user_id" TEXT UNIQUE NOT NULL,
    "full_name" VARCHAR(255) NOT NULL,
    "nick_name" VARCHAR(255),
    "nim" VARCHAR(50) UNIQUE NOT NULL,
    "whatsapp_number" VARCHAR(20),
    "study_program" VARCHAR(255),
    "department_id" TEXT,
    "division_id" TEXT,
    "sub_division_id" TEXT,
    "avatar_url" TEXT,
    "rejection_reason" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "fk_profile_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE,
    CONSTRAINT "fk_profile_department" FOREIGN KEY ("department_id") REFERENCES "departments"("id") ON DELETE CASCADE,
    CONSTRAINT "fk_profile_division" FOREIGN KEY ("division_id") REFERENCES "divisions"("id") ON DELETE CASCADE,
    CONSTRAINT "fk_profile_subdivision" FOREIGN KEY ("sub_division_id") REFERENCES "sub_divisions"("id") ON DELETE CASCADE
);

-- Submission Verifications Table
CREATE TABLE "submission_verifications" (
    "id" TEXT PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "krs_scan_url" TEXT,
    "formal_photo_url" TEXT,
    "instagram_proof_url" TEXT,
    "instagram_marketing_proof_url" TEXT,
    "twibbon_link" TEXT,
    "status" "verification_status" NOT NULL DEFAULT 'PENDING',
    "rejection_reason" TEXT,
    "reviewed_by_admin_id" TEXT,
    "reviewed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "fk_verif_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE,
    CONSTRAINT "fk_verif_admin" FOREIGN KEY ("reviewed_by_admin_id") REFERENCES "users"("id") ON DELETE SET NULL
);

-- Payments Table
CREATE TABLE "payments" (
    "id" TEXT PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "provider" "payment_provider" NOT NULL,
    "amount" DECIMAL(12, 2) NOT NULL,
    "currency" VARCHAR(10) DEFAULT 'IDR',
    "status" "payment_status" NOT NULL DEFAULT 'PENDING',
    "external_payment_id" VARCHAR(255),
    "payment_url" TEXT,
    "paid_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "fk_payment_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
);

-- Exams Table
CREATE TABLE "exams" (
    "id" TEXT PRIMARY KEY,
    "sub_division_id" TEXT NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "duration_minutes" INTEGER NOT NULL,
    "max_attempts" INTEGER DEFAULT 1,
    "start_at" TIMESTAMP(3),
    "end_at" TIMESTAMP(3),
    "is_active" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "fk_exam_subdivision" FOREIGN KEY ("sub_division_id") REFERENCES "sub_divisions"("id") ON DELETE CASCADE
);

-- Questions Table
CREATE TABLE "questions" (
    "id" TEXT PRIMARY KEY,
    "exam_id" TEXT NOT NULL,
    "type" "exam_type" NOT NULL,
    "prompt" TEXT NOT NULL,
    "correct_text_answer" TEXT,
    "points" INTEGER DEFAULT 0,
    "order_index" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "fk_question_exam" FOREIGN KEY ("exam_id") REFERENCES "exams"("id") ON DELETE CASCADE
);

-- Choices Table
CREATE TABLE "choices" (
    "id" TEXT PRIMARY KEY,
    "question_id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "is_correct" BOOLEAN NOT NULL DEFAULT false,
    "order_index" INTEGER NOT NULL,
    CONSTRAINT "fk_choice_question" FOREIGN KEY ("question_id") REFERENCES "questions"("id") ON DELETE CASCADE
);

-- Exam Attempts Table
CREATE TABLE "exam_attempts" (
    "id" TEXT PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "exam_id" TEXT NOT NULL,
    "started_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "finished_at" TIMESTAMP(3),
    "total_questions" INTEGER DEFAULT 0,
    "score" DECIMAL(5, 2) DEFAULT 0,
    "correct_count" INTEGER DEFAULT 0,
    "wrong_count" INTEGER DEFAULT 0,
    "status" "attempt_status" NOT NULL DEFAULT 'IN_PROGRESS',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "fk_attempt_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE,
    CONSTRAINT "fk_attempt_exam" FOREIGN KEY ("exam_id") REFERENCES "exams"("id") ON DELETE CASCADE
);

-- Exam Answers Table
CREATE TABLE "exam_answers" (
    "id" TEXT PRIMARY KEY,
    "attempt_id" TEXT NOT NULL,
    "question_id" TEXT NOT NULL,
    "chosen_choice_id" TEXT,
    "text_answer" TEXT,
    "is_correct" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "fk_answer_attempt" FOREIGN KEY ("attempt_id") REFERENCES "exam_attempts"("id") ON DELETE CASCADE,
    CONSTRAINT "fk_answer_question" FOREIGN KEY ("question_id") REFERENCES "questions"("id") ON DELETE CASCADE,
    CONSTRAINT "fk_answer_choice" FOREIGN KEY ("chosen_choice_id") REFERENCES "choices"("id") ON DELETE CASCADE
);

-- Learning Modules Table
CREATE TABLE "learning_modules" (
    "id" TEXT PRIMARY KEY,
    "sub_division_id" TEXT NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "file_url" TEXT NOT NULL,
    "created_by_admin_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "fk_module_subdivision" FOREIGN KEY ("sub_division_id") REFERENCES "sub_divisions"("id") ON DELETE CASCADE,
    CONSTRAINT "fk_module_admin" FOREIGN KEY ("created_by_admin_id") REFERENCES "users"("id") ON DELETE CASCADE
);

-- Assignments Table
CREATE TABLE "assignments" (
    "id" TEXT PRIMARY KEY,
    "sub_division_id" TEXT NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "file_url" TEXT,
    "due_at" TIMESTAMP(3) NOT NULL,
    "created_by_admin_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "fk_assignment_subdivision" FOREIGN KEY ("sub_division_id") REFERENCES "sub_divisions"("id") ON DELETE CASCADE,
    CONSTRAINT "fk_assignment_admin" FOREIGN KEY ("created_by_admin_id") REFERENCES "users"("id") ON DELETE CASCADE
);

-- Assignment Submissions Table
CREATE TABLE "assignment_submissions" (
    "id" TEXT PRIMARY KEY,
    "assignment_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "file_url" TEXT NOT NULL,
    "submitted_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "score" DECIMAL(5, 2),
    "feedback" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "fk_submission_assignment" FOREIGN KEY ("assignment_id") REFERENCES "assignments"("id") ON DELETE CASCADE,
    CONSTRAINT "fk_submission_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
);
