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

1. **Tampilan awal** hanya kotak "🔍 Cari Data Pendaftaran (SIMKAH)" — form absensi
   belum terlihat sama sekali.
2. Masukkan salah satu NIK (suami **atau** istri), klik **Cari & Isi Otomatis**
   (atau tekan Enter).
3. **Kalau data ditemukan**: kotak pencarian otomatis hilang, form absensi
   muncul dan terisi otomatis untuk:
   - Nama Lengkap, Alamat Lengkap, NIK (suami & istri)
   - Tanggal Akad
   - Tanggal Lahir (suami & istri) — **hasil estimasi dari NIK** (digit ke-7–12
     NIK = tanggal lahir sesuai aturan NIK Indonesia). Kalau ternyata kurang
     tepat, catin/user tinggal klik ulang date-picker-nya dan pilih tanggal
     yang benar — tidak ada validasi ketat yang mengunci nilai ini.
4. **Kalau NIK tidak ditemukan**: muncul popup "Periksa Kembali inputan NIK Anda"
   dengan dua tombol:
   - **Masukkan Manual** → langsung ke form kosong, isi semua secara manual.
   - **Kembali Isi NIK** → popup tertutup, kembali ke kotak pencarian untuk
     coba NIK lain.
5. Ada juga link kecil "Atau isi form secara manual tanpa pencarian" di bawah
   kotak NIK, dan tombol "← Cari NIK lain / ulangi pencarian" di dalam form —
   keduanya untuk berpindah tampilan tanpa harus lewat pencarian/popup.
6. Yang **tetap harus diisi manual** apa pun jalurnya: Tempat Lahir (suami &
   istri), No. Telp/HP, Email, dan Tanda Tangan (keduanya).
7. Submit seperti biasa; data tersimpan ke sheet `HADIR` di spreadsheet BETA
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