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

#### **Testing (Unit & E2E)**
- **Unit Testing**: Suite untuk `DashboardService` dan `TimelineService` (Passed).
- **E2E Testing**: Integrasi test untuk alur Dashboard dan validasi keamanan RBAC (Passed).

---

## 🚧 Belum Dikerjakan (To Do)

### 1. Fitur User (Pendaftar)
- [x] **Pembayaran**: Integrasi **Midtrans Snap** untuk biaya pendaftaran. Mendukung pembuatan transaksi dan penanganan status otomatis via Webhook.
- [ ] **Ujian (Exam)**:
    - [ ] List ujian tersedia per subdivisi.
    - [ ] Sistem pengerjaan (Timer & Auto-submit).
    - [ ] Auto-grading untuk pilihan ganda.
- [ ] **Modul & Tugas**:
    - [ ] Download materi pembelajaran.
    - [ ] Submit tugas subdivisi.

### 2. Fitur Admin
- [x] **Verifikasi Pendaftar**: Panel untuk Approve/Reject dokumen verifikasi. Mendukung filter status dan pencatatan alasan penolakan.
- [ ] **Manajemen Konten**:
    - [ ] CRUD Departemen/Divisi/Subdivisi (Saat ini baru Timeline).
- [ ] **Manajemen Akademik**:
    - [ ] Bank soal ujian.
    - [ ] Penilaian tugas (Assignment scoring).
- [ ] **Monitoring & Statistik**: Dashboard ringkasan jumlah pendaftar per status.

---

_Dokumen ini diperbarui oleh AI Agent pada 17 Februari 2026._
