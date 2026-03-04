# Progres Pengembangan Backend Neo Telemetri 2026

## ✅ Dikerjakan (Completed)

### 1. Perencanaan & Data Model

- **Data Model**: Verifikasi dan update `docs/data-model.md` dan `docs/or-neo-2026.sql` untuk mencakup semua fitur (termasuk `formal_photo_url` dan `instagram_marketing_proof_url`).
- **Database Strategy**: Memilih **PostgreSQL** (v15+) dengan deployment via Docker/Native.
- **Storage Strategy**: Memilih **Cloudinary** (SaaS) dengan arsitektur `IStorageService` untuk fleksibilitas.

### 2. Setup Project (Initialization)

- **Framework**: NestJS dengan TypeScript.
- **ORM**: **Prisma v7.4.0** dengan Driver Adapter PostgreSQL.
- **Global Config**: ValidationPipe (class-validator), JWT Strategy, Global Prefix `/api`.
- **Common Module**: PrismaService dan CloudinaryStorageService (Global).
- **Security**: Implementasi **Role-Based Access Control (RBAC)** dengan `@Roles()` decorator dan `RolesGuard`.

### 3. Implementasi Fitur (API)

#### **Autentikasi (Auth Module)**

- `POST /api/auth/register`: Registrasi user baru sekaligus pembuatan profile dasar.
- `POST /api/auth/login`: Autentikasi user dan pengembalian JWT access token.
- `GET /api/auth/me`: Mendapatkan data user yang sedang login (via JWT).

#### **Profil (Profile Module)**

- `GET /api/profile/me`: Mengambil data profil lengkap user.
- `PATCH /api/profile/me`: Update data profil (nama, NIM, wa, dsb).
- `POST /api/profile/me/avatar`: Upload/update foto profil ke Cloudinary.
- `GET /api/profile/departments`: Mengambil daftar departemen.
- `GET /api/profile/divisions/:departmentId`: Mengambil divisi berdasarkan departemen.
- `GET /api/profile/sub-divisions/:divisionId`: Mengambil subdivisi berdasarkan divisi.

#### **Verifikasi (Verification Module)**

- `POST /api/verification/submit`: Upload dokumen verifikasi (KRS, Foto Formal, Bukti IG, Twibbon). Mendukung update jika status masih PENDING.
- `GET /api/verification/me`: Cek status verifikasi saat ini.

#### **Dashboard (Dashboard Module)**

- `GET /api/dashboard/me`: Mendapatkan ringkasan status pendaftaran (progres langkah demi langkah) dan event timeline terdekat.

#### **Manajemen Konten (Admin)**

- `GET /api/timelines`: List semua timeline (Public).
- `POST /api/timelines`: Create timeline baru (Admin Only).
- `PATCH /api/timelines/:id`: Update timeline (Admin Only).
- `DELETE /api/timelines/:id`: Hapus timeline (Admin Only).

#### **Absensi (Attendance Module)**

- `POST /api/attendance/check-in`: Scan QR Code untuk absensi (User).
- `GET /api/attendance/me`: Lihat riwayat kehadiran pribadi (User).
- `POST /api/attendance/passcode`: Generate/Set passcode QR untuk event (Admin).
- `GET /api/attendance/timeline/:timelineId`: Rekapitulasi absensi per event, otomatis mendeteksi status ABSENT bagi yang tidak scan (Admin).
- `PATCH /api/attendance/:id`: Update status kehadiran manual (Admin).

#### **Pembayaran (Payment Module)**

- `POST /api/payments/create`: Pembuatan transaksi pembayaran pendaftaran via **Midtrans Snap**.
- `POST /api/payments/webhook`: Penanganan notifikasi status pembayaran otomatis dari Midtrans.
- `GET /api/payments/admin/list`: Monitoring semua transaksi pembayaran (Admin).

#### **Verifikasi Admin (Verification Module)**

- `GET /api/verification/admin/list`: List semua pendaftar untuk direview.
- `PATCH /api/verification/admin/review/:id`: Menyetujui (Approve) atau menolak (Reject) pendaftaran dengan alasan.

#### **Akademik (Academy Module)**

- `GET /api/learning-modules`: List materi pembelajaran (User: subdivision filters, Admin: all).
- `POST /api/learning-modules`: Create/Upload modul pembelajaran (Admin Only).
- `GET /api/assignments`: List tugas (User: subdivision filters, Admin: all).
- `POST /api/assignments/:id/submit`: Submit tugas dengan file (User).
- `PATCH /api/assignments/submissions/:submissionId/score`: Penilaian & feedback tugas (Admin Only).
- `GET /api/exams/user/available`: List ujian yang tersedia untuk subdivisi user (User).
- `POST /api/exams/user/:id/start`: Memulai pengerjaan ujian (Timer start) (User).
- `POST /api/exams/user/attempts/:attemptId/submit`: Submit pengerjaan ujian (Auto-grading) (User).
- `POST /api/exams`: Manajemen bank soal dan konfigurasi ujian (Admin Only).

#### **Admin Dashboard (Monitoring)**

- `GET /api/dashboard/admin/stats`: Ringkasan statistik pendaftaran, status verifikasi, status pembayaran, dan distribusi subdivisi secara real-time (Admin Only).

#### **Master Data (Admin Only)**

- `POST/PATCH/DELETE /api/master-data/departments`: Manajemen data Departemen.
- `POST/PATCH/DELETE /api/master-data/divisions`: Manajemen data Divisi.
- `POST/PATCH/DELETE /api/master-data/sub-divisions`: Manajemen data Sub-divisi.

#### **Testing (Unit & E2E)**

- **Unit Testing**: Suite lengkap untuk `Auth`, `Profile`, `Verification`, `Dashboard`, `Timeline`, `Payment`, `Attendance`, `Exam`, `Assignment`, `LearningModule`, `MasterData`, dan `AppController` (Passed).
- **E2E Testing**: Integrasi test untuk alur Auth, Profile, Verification, Attendance, Payment, Exam Admin, Master Data, dan Admin Stats (Passed).

### 4. Pemeliharaan & Dokumentasi

- **Migration Cleanup**: Melakukan squash migrasi lama menjadi satu file `init` (20260301000000_init) untuk membersihkan history database.
- **Update Dokumentasi**: Sinkronisasi `data-model.md` dan `or-neo-2026.sql` dengan status terbaru `schema.prisma`.
- **Code Quality**: Semua error linting (`pnpm lint`) pada file `src` dan `test` telah diperbaiki untuk memastikan standar kode yang bersih dan menghindari masalah build.

---

## 🚧 Belum Dikerjakan (To Do)

_Semua fitur utama sesuai MVP telah diimplementasikan._

---

_Dokumen ini diperbarui oleh AI Agent pada 3 Maret 2026._
