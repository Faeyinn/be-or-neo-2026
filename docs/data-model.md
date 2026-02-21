# Data Model (Open Recruitment UKM)

Dokumen ini merangkum model data inti untuk backend open recruitment. Semua relasi foreign key menggunakan on-delete cascade sesuai permintaan.

## Ringkasan Entitas

- User: akun login/role
- Profile: data profil peserta
- Department: departemen yang diminati
- Division: divisi
- SubDivision: sub divisi
- RecruitmentTimeline: alur/timeline kegiatan
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
- id (PK)
- email (unique)
- passwordHash
- role (enum: ADMIN, USER)
- isActive
- createdAt
- updatedAt

Relasi:
- User 1-1 Profile
- User 1-N SubmissionVerification
- User 1-N Payment
- User 1-N ExamAttempt
- User 1-N AssignmentSubmission

FK rules:
- Profile.userId -> User.id (on delete cascade)
- SubmissionVerification.userId -> User.id (on delete cascade)
- Payment.userId -> User.id (on delete cascade)
- ExamAttempt.userId -> User.id (on delete cascade)
- AssignmentSubmission.userId -> User.id (on delete cascade)

### Profile
- id (PK)
- userId (FK, unique)
- fullName
- nickName
- nim (unique)
- email (sama dengan user)
- whatsappNumber
- studyProgram
- departmentId (FK)
- divisionId (FK)
- subDivisionId (FK)
- avatarUrl (nullable)
- rejectionReason (nullable)
- createdAt
- updatedAt

Relasi:
- Profile N-1 Department
- Profile N-1 Division
- Profile N-1 SubDivision

FK rules:
- Profile.departmentId -> Department.id (on delete cascade)
- Profile.divisionId -> Division.id (on delete cascade)
- Profile.subDivisionId -> SubDivision.id (on delete cascade)

### Department
- id (PK)
- name (unique)
- createdAt
- updatedAt

Relasi:
- Department 1-N Profile
- Department 1-N Division

FK rules:
- Division.departmentId -> Department.id (on delete cascade)

### Division
- id (PK)
- departmentId (FK)
- name (unique within department)
- createdAt
- updatedAt

Relasi:
- Division 1-N SubDivision
- Division 1-N Profile

FK rules:
- SubDivision.divisionId -> Division.id (on delete cascade)

### SubDivision
- id (PK)
- divisionId (FK)
- name (unique within division)
- createdAt
- updatedAt

Relasi:
- SubDivision 1-N Profile
- SubDivision 1-N Exam
- SubDivision 1-N LearningModule
- SubDivision 1-N Assignment

FK rules:
- Exam.subDivisionId -> SubDivision.id (on delete cascade)
- LearningModule.subDivisionId -> SubDivision.id (on delete cascade)
- Assignment.subDivisionId -> SubDivision.id (on delete cascade)

### RecruitmentTimeline
- id (PK)
- title
- description
- startAt
- endAt
- orderIndex
- createdAt
- updatedAt

Catatan: Dipakai untuk alur/timeline dan countdown di dashboard.

### SubmissionVerification
- id (PK)
- userId (FK)
- krsScanUrl
- formalPhotoUrl
- instagramProofUrl
- instagramMarketingProofUrl
- twibbonLink
- status (enum: PENDING, APPROVED, REJECTED)
- rejectionReason (nullable)
- reviewedByAdminId (FK -> User.id, nullable)
- reviewedAt
- createdAt
- updatedAt

FK rules:
- SubmissionVerification.reviewedByAdminId -> User.id (on delete cascade)

### Payment
- id (PK)
- userId (FK)
- provider (enum: MIDTRANS, XENDIT, OTHER)
- amount
- currency
- status (enum: PENDING, PAID, FAILED, EXPIRED, REFUNDED)
- externalPaymentId
- paymentUrl
- paidAt
- createdAt
- updatedAt

### Exam
- id (PK)
- subDivisionId (FK)
- title
- description
- durationMinutes
- maxAttempts (default: 1)
- startAt
- endAt
- isActive
- createdAt
- updatedAt

### Question
- id (PK)
- examId (FK)
- type (enum: MCQ, TRUE_FALSE, SHORT_TEXT)
- prompt
- correctTextAnswer (nullable)
- points
- orderIndex
- createdAt
- updatedAt

### Choice
- id (PK)
- questionId (FK)
- label
- isCorrect
- orderIndex

### ExamAttempt
- id (PK)
- userId (FK)
- examId (FK)
- startedAt
- finishedAt
- totalQuestions
- score
- correctCount
- wrongCount
- status (enum: IN_PROGRESS, SUBMITTED, TIMEOUT)
- createdAt
- updatedAt

### ExamAnswer
- id (PK)
- attemptId (FK)
- questionId (FK)
- chosenChoiceId (FK, nullable)
- textAnswer (nullable)
- isCorrect
- createdAt
- updatedAt

FK rules:
- ExamAnswer.attemptId -> ExamAttempt.id (on delete cascade)
- ExamAnswer.questionId -> Question.id (on delete cascade)
- ExamAnswer.chosenChoiceId -> Choice.id (on delete cascade)

### LearningModule
- id (PK)
- subDivisionId (FK)
- title
- description
- fileUrl
- createdByAdminId (FK -> User.id)
- createdAt
- updatedAt

### Assignment
- id (PK)
- subDivisionId (FK)
- title
- description
- dueAt
- createdByAdminId (FK -> User.id)
- createdAt
- updatedAt

### AssignmentSubmission
- id (PK)
- assignmentId (FK)
- userId (FK)
- fileUrl
- submittedAt
- score (nullable)
- feedback (nullable)
- createdAt
- updatedAt

## Relasi dan Cascade Ringkas

- User -> Profile/SubmissionVerification/Payment/ExamAttempt/AssignmentSubmission (cascade)
- Department -> Division/Profile (cascade)
- Division -> SubDivision/Profile (cascade)
- SubDivision -> Profile/Exam/LearningModule/Assignment (cascade)
- Exam -> Question/ExamAttempt (cascade)
- Question -> Choice/ExamAnswer (cascade)
- ExamAttempt -> ExamAnswer (cascade)
- Assignment -> AssignmentSubmission (cascade)

## Catatan Implementasi

- Database: **PostgreSQL** dengan tipe data **UUID** untuk Primary Key.
- Simpan file upload sebagai URL (Cloudinary).
- Gunakan kolom status untuk verifikasi dan pembayaran agar mudah audit.
- Waktu countdown di dashboard menggunakan RecruitmentTimeline.startAt/endAt.
- Periksa unik: User.email, Profile.nim, Department.name, Division.name+departmentId, SubDivision.name+divisionId.
