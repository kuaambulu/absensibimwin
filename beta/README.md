# 🧪 Absensi BimWin — BETA (Auto-fill dari SIMKAH via NIK)

Folder ini **terpisah dari produksi** (`/index.html`, `/css`, `/js` di root repo)
supaya tidak mengganggu absensi yang sudah berjalan. `css/style.css`,
`js/signature.js`, `js/validation.js`, `js/app.js` di-*reference* langsung dari
produksi (`../css/...`, `../js/...`) — tidak diduplikasi.

## Struktur

```
beta/
├── index.html          # Form beta (ada kotak "Cari Data via NIK")
├── js/
│   ├── config.js        # API_URL KHUSUS BETA — spreadsheet terpisah
│   └── search-nik.js     # Logic fetch ke sheet "DataBase" & auto-isi form
├── backend/
│   └── Code.gs           # Kode Apps Script — deploy ke spreadsheet BARU
└── README.md              # File ini
```

## Setup

### 1. Backend (Google Apps Script)

1. Buat **Google Spreadsheet baru** (jangan pakai yang produksi).
2. Buat sheet bernama **`DataBase`**, isi header persis:
   ```
   No | Provinsi | Kabupaten / Kota | Kecamatan | KUA | Nomor Daftar | Tanggal Daftar |
   Nama Suami | Nama Istri | NIK Suami | NIK Istri | Alamat Suami | Alamat Istri |
   No HP Suami | Email Suami | No HP Istri | Email Istri | Status Wali | Nama Wali |
   Pekerjaan Wali | Alamat Wali | Hari Akad | Tanggal Akad | Jam Akad | Nikah Di |
   Penghulu | Nomor Akta Nikah | Nomor Porporasi
   ```
   Lalu isi/import data laporan pendaftaran dari SIMKAH Gen 4 di baris-baris berikutnya.
3. Sheet `HADIR` dan `LAPORAN_BULANAN` akan dibuat otomatis oleh script saat
   ada submit pertama — tidak perlu dibuat manual.
4. Buka **Extensions → Apps Script**, hapus isi default, paste isi `backend/Code.gs`.
5. **Deploy → New deployment → Web app**:
   - Execute as: **Me**
   - Who has access: **Anyone**
6. Salin URL deployment yang muncul.

### 2. Frontend

1. Buka `js/config.js`, ganti nilai `API_URL` dengan URL deployment dari langkah 1.6.
2. Push folder `beta/` ini ke repo `kuaambulu/absensibimwin` (branch `main`, sejajar
   dengan `index.html`, `css/`, `js/` produksi).
3. Karena GitHub Pages men-deploy seluruh branch `main`, folder ini otomatis bisa
   diakses di:
   ```
   https://kuaambulu.github.io/absensi-kua-ambulu/beta/
   ```
   tanpa perlu setting tambahan di GitHub Pages.

## Cara pakai fitur pencarian NIK

1. Masukkan salah satu NIK (suami **atau** istri) di kotak "🔍 Cari Data Pendaftaran (SIMKAH)".
2. Klik **Cari & Isi Otomatis**.
3. Yang terisi otomatis: **Nama Lengkap, Alamat Lengkap, NIK** (suami & istri),
   dan **Tanggal Akad**.
4. Yang **tetap harus diisi manual**: Tempat Lahir, Tanggal Lahir, No. Telp/HP,
   Email, dan Tanda Tangan (keduanya) — sengaja tidak diambil otomatis.
5. Submit seperti biasa; data tersimpan ke sheet `HADIR` di spreadsheet BETA
   (bukan spreadsheet produksi).

## Catatan

- Field NIK di kotak pencarian membatasi input ke 16 digit angka, sama seperti
  validasi NIK di form aslinya.
- Kalau NIK tidak ditemukan di sheet `DataBase`, pesan error akan muncul dan
  form tetap bisa diisi manual seperti biasa.
- Setelah puas dengan hasil uji coba, migrasi ke produksi dilakukan manual
  (pindahkan perubahan yang relevan ke `index.html` / `js/` root, ganti
  `API_URL` ke deployment produksi) — folder `beta/` ini tidak otomatis
  menggantikan produksi.