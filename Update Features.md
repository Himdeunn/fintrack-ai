# Avaraé - Update Features Log

Semua pembaruan sistem, perbaikan bug, dan optimasi fitur dicatat di sini untuk transparansi pengembangan.

---

### [2026-05-10 | 12:15] - Auth Stability & Persistence Fix
**Pembaruan:**
- **Mobile Token Lifecycle**: Memperbaiki bug limitasi token JWT yang terkunci di 2 jam menjadi 7 hari (Sesuai kebutuhan Mobile Apps).
- **Middleware Session Refresh**: Implementasi auto-refresh session pada Web Dashboard untuk mencegah logout paksa saat pengguna aktif.
- **Production Cookie Security**: Optimasi atribut cookie (`Secure`, `SameSite: Lax`) untuk stabilitas autentikasi di environment Vercel/Production.
- **Environment Security**: Migrasi `AUTH_SECRET` ke `.env` untuk keamanan tingkat tinggi.

---

### [2026-05-07 | 23:30] - Unified Ecosystem & Profile APIs
**Pembaruan:**
- **Dashboard API**: Pembuatan endpoint `/mobile/dashboard` yang menggabungkan Summary, Chart Data, dan Recent Transactions.
- **Profile API**: Implementasi endpoint `/mobile/profile` (Update Nama/Email) dan `/mobile/profile/password`.
- **API Documentation**: Pembuatan file `AVARAE_MOBILE_API_V1.txt` untuk mempermudah kolaborasi dengan tim Mobile Developer.

---

### [2026-05-06 | 12:10] - Data Standardization & Next.js 15 Fix
**Pembaruan:**
- **Uppercase Standardization**: Migrasi tipe transaksi (`INCOME`/`EXPENSE`) ke format uppercase secara menyeluruh di Database, Web, dan Mobile API.
- **Vercel Build Fix**: Perbaikan error asinkron pada `params` Route Handler untuk mendukung standar Next.js 15+.
- **Transaction CRUD**: Integrasi penuh fitur Tambah, Edit, dan Hapus transaksi pada endpoint Mobile API.

---

### [2026-05-04 | 10:45] - AI Intelligence Naturalization
**Pembaruan:**
- **Natural Output**: Menghilangkan format markdown mentah pada hasil AI dan menggantinya dengan komponen UI Tailwind asli.
- **AI Model Upgrade**: Migrasi ke `gemini-2.5-flash` untuk respon yang lebih cerdas, cepat, dan stabil.
- **Saran & Solusi UI**: Desain ulang kartu rekomendasi AI dengan border-accent dan shadow premium.

---

### [2026-05-02 | 17:00] - PWA & Mobile UX Optimization
**Pembaruan:**
- **Pwa Install Prompt**: Penambahan fitur download aplikasi (PWA) dengan sistem delay agar tidak mengganggu pengguna.
- **Responsive Typography**: Optimasi ukuran font dan spacing dashboard untuk kenyamanan penggunaan di layar HP.
- **Theme Consistency**: Penyeragaman palet warna "Dusk Blue" dan "Azure Mist" di seluruh halaman aplikasi.

---
*Log ini diperbarui secara otomatis setiap kali terjadi perubahan signifikan pada sistem Avaraé.*
