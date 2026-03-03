# Data Model (Open Recruitment UKM)

Dokumen ini merangkum model data inti untuk backend open recruitment. Semua relasi foreign key menggunakan on-delete cascade sesuai permintaan (kecuali review admin yang menggunakan set-null).

## Ringkasan Entitas

- User: akun login/role
- Profile: data profil peserta
- Department: departemen yang diminati
- Division: divisi
- SubDivision: sub divisi
- RecruitmentTimeline: alur/timeline kegiatan
- Attendance: presensi peserta pada kegiatan di timeline
- SubmissionVerification: verifikasi KRS/IG/twibbon
- Payment: transaksi payment gateway
- Exam: ujian per sub divisi
- Question: soal ujian
- Choice: pilihan jawaban (untuk soal pilihan ganda)
- ExamAttempt: percobaan ujian peserta
- ExamAnswer: jawaban peserta per soal
- LearningModule: modul pembelajaran (admin)
- Assignment: tugas (admin)
- AssignmentSubmission: upload tugas (user)

## Model Detail

### User
- id (PK, UUID String)
- email (unique, VarChar 255)
- passwordHash (Text)
- role (enum: ADMIN, USER)
- isActive (Boolean)
- createdAt (Timestamp)
- updatedAt (Timestamp)

Relasi:
- User 1-1 Profile
- User 1-N SubmissionVerification
- User 1-N Payment
- User 1-N ExamAttempt
- User 1-N AssignmentSubmission
- User 1-N Attendance
- User 1-N SubmissionVerification (as reviewer)
- User 1-N LearningModule (as creator)
- User 1-N Assignment (as creator)

### Profile
- id (PK, UUID String)
- userId (FK, unique)
- fullName (VarChar 255)
- nickName (VarChar 255, nullable)
- nim (unique, VarChar 50)
- whatsappNumber (VarChar 20, nullable)
- studyProgram (VarChar 255, nullable)
- departmentId (FK, nullable)
- divisionId (FK, nullable)
- subDivisionId (FK, nullable)
- avatarUrl (Text, nullable)
- rejectionReason (Text, nullable)
- createdAt (Timestamp)
- updatedAt (Timestamp)

Relasi:
- Profile N-1 Department
- Profile N-1 Division
- Profile N-1 SubDivision

### Department
- id (PK, UUID String)
- name (unique, VarChar 255)
- createdAt (Timestamp)
- updatedAt (Timestamp)

Relasi:
- Department 1-N Profile
- Department 1-N Division

### Division
- id (PK, UUID String)
- departmentId (FK)
- name (VarChar 255)
- createdAt (Timestamp)
- updatedAt (Timestamp)

Relasi:
- Division 1-N SubDivision
- Division 1-N Profile

Unik: (departmentId, name)

### SubDivision
- id (PK, UUID String)
- divisionId (FK)
- name (VarChar 255)
- createdAt (Timestamp)
- updatedAt (Timestamp)

Relasi:
- SubDivision 1-N Profile
- SubDivision 1-N Exam
- SubDivision 1-N LearningModule
- SubDivision 1-N Assignment

Unik: (divisionId, name)

### RecruitmentTimeline
- id (PK, UUID String)
- title (VarChar 255)
- description (Text, nullable)
- startAt (Timestamp)
- endAt (Timestamp)
- orderIndex (Integer)
- attendancePasscode (VarChar 50, nullable)
- createdAt (Timestamp)
- updatedAt (Timestamp)

### Attendance
- id (PK, UUID String)
- userId (FK)
- timelineId (FK)
- checkInTime (Timestamp)
- status (enum: PRESENT, LATE, EXCUSED, ABSENT)
- notes (Text, nullable)
- createdAt (Timestamp)
- updatedAt (Timestamp)

Unik: (userId, timelineId)

### SubmissionVerification
- id (PK, UUID String)
- userId (FK)
- krsScanUrl (Text, nullable)
- formalPhotoUrl (Text, nullable)
- instagramProofUrl (Text, nullable)
- instagramMarketingProofUrl (Text, nullable)
- twibbonLink (Text, nullable)
- status (enum: PENDING, APPROVED, REJECTED)
- rejectionReason (Text, nullable)
- reviewedByAdminId (FK, nullable)
- reviewedAt (Timestamp, nullable)
- createdAt (Timestamp)
- updatedAt (Timestamp)

### Payment
- id (PK, UUID String)
- userId (FK)
- provider (enum: MIDTRANS, XENDIT, OTHER)
- amount (Decimal 12,2)
- currency (VarChar 10, default: IDR)
- status (enum: PENDING, PAID, FAILED, EXPIRED, REFUNDED)
- externalPaymentId (VarChar 255, nullable)
- paymentUrl (Text, nullable)
- paidAt (Timestamp, nullable)
- createdAt (Timestamp)
- updatedAt (Timestamp)

### Exam
- id (PK, UUID String)
- subDivisionId (FK)
- title (VarChar 255)
- description (Text, nullable)
- durationMinutes (Integer)
- maxAttempts (Integer, default: 1)
- startAt (Timestamp, nullable)
- endAt (Timestamp, nullable)
- isActive (Boolean, default: true)
- createdAt (Timestamp)
- updatedAt (Timestamp)

### Question
- id (PK, UUID String)
- examId (FK)
- type (enum: MCQ, TRUE_FALSE, SHORT_TEXT)
- prompt (Text)
- correctTextAnswer (Text, nullable)
- points (Integer, default: 0)
- orderIndex (Integer)
- createdAt (Timestamp)
- updatedAt (Timestamp)

### Choice
- id (PK, UUID String)
- questionId (FK)
- label (Text)
- isCorrect (Boolean, default: false)
- orderIndex (Integer)

### ExamAttempt
- id (PK, UUID String)
- userId (FK)
- examId (FK)
- startedAt (Timestamp, default: now)
- finishedAt (Timestamp, nullable)
- totalQuestions (Integer, default: 0)
- score (Decimal 5,2, default: 0)
- correctCount (Integer, default: 0)
- wrongCount (Integer, default: 0)
- status (enum: IN_PROGRESS, SUBMITTED, TIMEOUT)
- createdAt (Timestamp)
- updatedAt (Timestamp)

### ExamAnswer
- id (PK, UUID String)
- attemptId (FK)
- questionId (FK)
- chosenChoiceId (FK, nullable)
- textAnswer (Text, nullable)
- isCorrect (Boolean, default: false)
- createdAt (Timestamp)
- updatedAt (Timestamp)

### LearningModule
- id (PK, UUID String)
- subDivisionId (FK)
- title (VarChar 255)
- description (Text, nullable)
- fileUrl (Text)
- createdByAdminId (FK)
- createdAt (Timestamp)
- updatedAt (Timestamp)

### Assignment
- id (PK, UUID String)
- subDivisionId (FK)
- title (VarChar 255)
- description (Text, nullable)
- dueAt (Timestamp)
- createdByAdminId (FK)
- createdAt (Timestamp)
- updatedAt (Timestamp)

### AssignmentSubmission
- id (PK, UUID String)
- assignmentId (FK)
- userId (FK)
- fileUrl (Text)
- submittedAt (Timestamp, default: now)
- score (Decimal 5,2, nullable)
- feedback (Text, nullable)
- createdAt (Timestamp)
- updatedAt (Timestamp)

## Relasi dan Cascade Ringkas

- User -> Profile/SubmissionVerification/Payment/ExamAttempt/AssignmentSubmission/Attendance (cascade)
- Department -> Division/Profile (cascade)
- Division -> SubDivision/Profile (cascade)
- SubDivision -> Profile/Exam/LearningModule/Assignment (cascade)
- Exam -> Question/ExamAttempt (cascade)
- Question -> Choice/ExamAnswer (cascade)
- ExamAttempt -> ExamAnswer (cascade)
- Assignment -> AssignmentSubmission (cascade)
- RecruitmentTimeline -> Attendance (cascade)
- SubmissionVerification -> ReviewedByAdmin (set null)

## Catatan Implementasi

- Database: **PostgreSQL** dengan tipe data **TEXT** untuk UUID (Prisma default `uuid()`).
- Simpan file upload sebagai URL (Cloudinary).
- Gunakan kolom status untuk verifikasi dan pembayaran agar mudah audit.
- Waktu countdown di dashboard menggunakan RecruitmentTimeline.startAt/endAt.
- Periksa unik: User.email, Profile.nim, Department.name, Division.name+departmentId, SubDivision.name+divisionId, Attendance.userId+timelineId.
