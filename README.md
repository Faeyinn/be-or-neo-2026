<p align="center">
  <a href="https://neotelemetri.id/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Neo Telemetri Logo" /></a>
</p>

<h1 align="center">Open Recruitment Neo Telemetri 2026 API</h1>

<p align="center">
  Sistem backend lengkap untuk proses Open Recruitment Neo Telemetri 2026, dibangun menggunakan <b>NestJS</b>, <b>Prisma ORM</b>, dan <b>PostgreSQL</b>.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen" alt="Node Version" />
  <img src="https://img.shields.io/badge/pnpm-%3E%3D8.0.0-blue" alt="pnpm Version" />
  <img src="https://img.shields.io/badge/nestjs-11.x-red" alt="NestJS Version" />
  <img src="https://img.shields.io/badge/prisma-7.x-0c344b" alt="Prisma Version" />
  <img src="https://img.shields.io/badge/license-UNLICENSED-lightgrey" alt="License" />
</p>

---

## 🚀 Overview

Repositori ini berisi API backend untuk mengelola seluruh *recruitment lifecycle* Neo Telemetri 2026. Sistem ini menangani berbagai proses mulai dari *user registration*, *document verification*, *online exam*, *assignment management*, hingga *payment processing*.

## ✨ Key Features

- **🔐 Authentication & Authorization**: Keamanan berbasis JWT dengan *Role-Based Access Control* (RBAC) untuk Admin dan User.
- **👤 Profile Management**: Pengelolaan data profil pengguna yang komprehensif, mencakup data akademik dan preferensi sub-divisi.
- **📊 Recruitment Dashboard**: Pelacakan progres pendaftaran secara *real-time* untuk pendaftar dan administrator.
- **📅 Timeline Management**: Pengelolaan dinamis tahapan rekrutmen dan *deadline* proses.
- **📂 Master Data**: Pengaturan hierarkis untuk Departemen, Divisi, dan Sub-divisi.
- **📚 Learning Modules**: Akses sumber daya edukasi dan materi yang dibatasi berdasarkan *user progress*.
- **📝 Online Exam System**: Platform ujian otomatis yang mendukung tipe soal MCQ, True/False, dan Short Text dengan *auto-scoring*.
- **📤 Assignment Management**: Distribusi tugas, pelacakan *submission*, dan sistem penilaian.
- **💳 Payment Integration**: Pemrosesan biaya pendaftaran secara otomatis melalui Payment Gateway **Midtrans**.
- **✅ Verification System**: Alur verifikasi administratif untuk dokumen persyaratan dan pengumpulan tugas.
- **🕒 Attendance Tracking**: Sistem absensi berbasis kode QR dan *passcode* untuk kegiatan rekrutmen.

## 🛠️ Tech Stack

- **Framework**: [NestJS](https://nestjs.com/) (v11+)
- **ORM**: [Prisma](https://www.prisma.io/) (v7+)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **Documentation**: [Swagger / OpenAPI 3.0](https://swagger.io/)
- **Payment Gateway**: [Midtrans](https://midtrans.com/)
- **Storage**: [Cloudinary](https://cloudinary.com/) (untuk *file upload* dokumen dan foto)
- **Validation**: [Class Validator](https://github.com/typestack/class-validator) & [Class Transformer](https://github.com/typestack/class-transformer)

---

## ⚙️ Project Setup

### Prerequisites

- [Node.js](https://nodejs.org/) (>= 18.x)
- [pnpm](https://pnpm.io/) (>= 8.x)
- Instance database [PostgreSQL](https://www.postgresql.org/)

### 1. Installation

```bash
# Clone the repository
$ git clone https://github.com/neo-telemetri/be-or-neo-2026.git
$ cd be-or-neo-2026

# Install dependencies
$ pnpm install
```

### 2. Environment Configuration

Buat file `.env` di direktori root dan konfigurasi variabel berikut:

```env
# Application
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/dbname?schema=public"

# Authentication
JWT_SECRET=your_super_secret_jwt_key

# Cloudinary Storage
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Midtrans Payment
MIDTRANS_IS_PRODUCTION=false
MIDTRANS_SERVER_KEY=your_server_key
MIDTRANS_CLIENT_KEY=your_client_key
```

### 3. Database Setup

```bash
# Run database migrations
$ npx prisma migrate dev

# Seed database dengan data awal
$ npx prisma db seed
```

---

## 🏃 Running the App

```bash
# Mode development
$ pnpm run start:dev

# Mode produksi
$ pnpm run build
$ pnpm run start:prod
```

Setelah berjalan, API dapat diakses di `http://localhost:3000/api`.

---

## 📚 API Documentation

Proyek ini menggunakan Swagger untuk menyediakan dokumentasi API yang interaktif. Anda dapat mengakses *endpoint* dan melakukan pengujian melalui:

👉 **[http://localhost:3000/docs](http://localhost:3000/docs)**

Dokumentasi mencakup detail *request body*, *response schema*, dan persyaratan autentikasi untuk setiap *endpoint*.

---

## 🧪 Testing

```bash
# Unit tests
$ pnpm run test

# E2E tests
$ pnpm run test:e2e

# Test coverage
$ pnpm run test:cov
```

---

## 📁 Project Structure

```text
src/
├── common/           # Shared guards, decorators, services, dan pipes
├── modules/          # Feature-based modules
│   ├── auth/         # Authentication & Authorization
│   ├── profile/      # User profile management
│   ├── master-data/  # Departments, Divisions, Sub-divisions
│   ├── exam/         # Online examination logic
│   ├── assignment/   # Task submissions & grading
│   ├── payment/      # Midtrans integration
│   └── ...           # Modul fitur lainnya
├── app.module.ts     # Main application module
└── main.ts           # Application entry point
```

---

## 📝 License

Proyek ini berstatus **UNLICENSED**. Seluruh hak cipta dilindungi.

---

<p align="center">
  Made with ❤️ by <b>Neo Telemetri IT Team</b>
</p>
