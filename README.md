# Form Biodata Peserta — Bimbingan Perkawinan KUA Ambulu

Aplikasi web pengisian biodata calon pengantin untuk kegiatan **Bimbingan Perkawinan Mandiri** di KUA Kecamatan Ambulu, Kantor Kementerian Agama Kabupaten Jember.

---

## Fitur Utama

- Form pengisian biodata calon suami dan istri
- Kolom tanda tangan digital langsung di browser (canvas)
- Integrasi otomatis ke **Google Sheets** (sheet HADIR & LAPORAN_BULANAN)
- Generate dokumen **Google Docs** dari template biodata
- Halaman konfirmasi setelah data berhasil dikirim
- Desain responsif — bisa digunakan di HP maupun laptop

---

## Struktur File

```
kua-absensi/
├── index.html          # Halaman utama (form + halaman sukses)
├── css/
│   └── style.css       # Tampilan — skema warna hijau Kemenag + emas
├── js/
│   ├── form.js         # Logic submit, validasi, navigasi halaman
│   └── signature.js    # Signature pad berbasis canvas HTML5
├── Kode.gs             # Google Apps Script backend
└── README.md           # Dokumentasi ini
```

---

## Bug Fix — Tanggal Lahir Selalu Menjadi Hari Ini

### Akar Masalah

Bug ini menyebabkan kolom **Tanggal Lahir Suami** dan **Tanggal Lahir Istri** di Google Sheets terisi dengan tanggal pada saat peserta mengisi form, bukan tanggal lahir sebenarnya.

Ada tiga lapisan bug yang saling berkaitan:

#### Bug 1 — Frontend: konversi `new Date()` saat submit

```js
// ❌ KODE LAMA (bug) — membuat Date object baru dari value input,
//    lalu memanggil .toLocaleDateString() yang menghasilkan format
//    berbeda-beda tergantung locale browser. Di beberapa konfigurasi,
//    ini mengembalikan tanggal hari ini atau hari yang salah.
const tglLahir = new Date(document.getElementById('tgl_lahir_suami').value)
                   .toLocaleDateString('id-ID');

// ✅ FIX — ambil .value langsung, format manual tanpa konstruktor Date
const raw = document.getElementById('tgl_lahir_suami').value; // "YYYY-MM-DD"
const tglLahir = formatTanggalIndo(raw); // "12 Mei 2000" — stabil, tidak bergantung locale
```

Fungsi `formatTanggalIndo()` memecah string `"YYYY-MM-DD"` menggunakan `.split('-')` dan menyusun kembali dengan nama bulan Indonesia — **tanpa menyentuh konstruktor `new Date()`** sama sekali.

#### Bug 2 — Backend `Kode.gs`: Google Sheets auto-parse string tanggal

```js
// ❌ KODE LAMA (bug) — Google Sheets mendeteksi string tanggal seperti
//    "2000-05-12" atau "12/05/2000" dan secara otomatis mengkonversinya
//    ke objek Date internal Sheets, lalu menampilkannya sesuai format
//    locale spreadsheet — kadang jadi tanggal hari ini jika parse gagal.
sheet.getRange(row, 4).setValue(personData.tanggalLahir);

// ✅ FIX — dua lapisan perlindungan:
// Lapisan 1: paksa format plain text agar Sheets tidak auto-parse
sheet.getRange(row, 4).setNumberFormat('@STRING@');
// Lapisan 2: simpan nilai — karena format sudah @STRING@, tidak ada konversi
sheet.getRange(row, 4).setValue(personData.tanggalLahir); // "12 Mei 2000"
```

Selain itu, `setupHeaderTemplate()` kini juga mengeset format `@STRING@` pada seluruh kolom 4 (100 baris) sejak awal, sebagai perlindungan global.

#### Bug 3 — Template header Sheet: kolom Tanggal Lahir tidak diproteksi

Format kolom 4 pada sheet `HADIR` tidak di-set dari awal, sehingga setiap sel baru di kolom tersebut mengikuti format default Sheets (Auto) yang memungkinkan auto-parse.

**Fix:** Tambahkan `setNumberFormat('@STRING@')` pada 100 baris pertama kolom 4 di dalam `setupHeaderTemplate()`.

---

## Cara Setup

### 1. Google Apps Script

1. Buka [script.google.com](https://script.google.com) → buat project baru
2. Salin isi `Kode.gs` ke editor
3. Sesuaikan konfigurasi di bagian atas:

```js
const CONFIG_BACKEND = {
  SHEET_NAME     : 'HADIR',
  SHEET_LAPORAN  : 'LAPORAN_BULANAN',
  TEMPLATE_DOC_ID: 'ID_TEMPLATE_GOOGLE_DOCS_ANDA',
  FOLDER_ID      : 'ID_FOLDER_GOOGLE_DRIVE_ANDA'
};
```

4. Klik **Deploy → New Deployment** → tipe: **Web App**
   - Execute as: **Me**
   - Who has access: **Anyone**
5. Salin URL deployment

### 2. Frontend

Buka `js/form.js` dan ganti URL di bagian konfigurasi:

```js
const CONFIG = {
  GAS_URL: 'https://script.google.com/macros/s/SCRIPT_ID_ANDA/exec',
  DEBUG  : false
};
```

### 3. Template Google Docs

Template harus mengandung placeholder berikut (persis, termasuk kurung kurawal ganda):

| Placeholder         | Keterangan               |
|---------------------|--------------------------|
| `{{NAMA_SUAMI}}`    | Nama lengkap suami       |
| `{{TEMPAT_LAHIR_SUAMI}}` | Tempat lahir suami  |
| `{{TGL_LAHIR_SUAMI}}`    | Tanggal lahir suami |
| `{{ALAMAT_SUAMI}}`  | Alamat suami             |
| `{{NIK_SUAMI}}`     | NIK suami                |
| `{{TELP_SUAMI}}`    | No HP suami              |
| `{{EMAIL_SUAMI}}`   | Email suami              |
| `[TTD_SUAMI]`       | Gambar tanda tangan suami|
| `{{NAMA_ISTRI}}`    | Nama lengkap istri       |
| `{{TEMPAT_LAHIR_ISTRI}}` | Tempat lahir istri  |
| `{{TGL_LAHIR_ISTRI}}`    | Tanggal lahir istri |
| `{{ALAMAT_ISTRI}}`  | Alamat istri             |
| `{{NIK_ISTRI}}`     | NIK istri                |
| `{{TELP_ISTRI}}`    | No HP istri              |
| `{{EMAIL_ISTRI}}`   | Email istri              |
| `[TTD_ISTRI]`       | Gambar tanda tangan istri|

---

## Format Data yang Dikirim ke Backend

```json
{
  "suami": {
    "namaLengkap"  : "Ahmad Fauzi",
    "tempatLahir"  : "Jember",
    "tanggalLahir" : "12 Mei 2000",
    "alamatLengkap": "Jl. Ambulu No.10, RT 01/02, Desa Ambulu",
    "nik"          : "3509012345670001",
    "noTelp"       : "081234567890",
    "email"        : "ahmad@email.com",
    "tandaTangan"  : "data:image/png;base64,..."
  },
  "istri": { ... }
}
```

> **Catatan penting:** `tanggalLahir` selalu dikirim sebagai string `"DD Bulan YYYY"` (contoh: `"12 Mei 2000"`), **bukan** sebagai objek Date, ISO string, atau timestamp. Ini adalah bagian inti dari fix bug.

---

## Dependensi

Tidak ada dependensi npm. Semua berjalan dengan:

- HTML5 Canvas API (tanda tangan)
- Vanilla JavaScript (ES2017+)
- Google Fonts — Plus Jakarta Sans (via CDN, opsional)
- Google Apps Script (backend, deploy terpisah)

---

## Catatan Pengembang

- Set `DEBUG: true` di `js/form.js` untuk melihat log nilai tanggal lahir di console browser
- Jika `GAS_URL` belum dikonfigurasi (`YOUR_SCRIPT_ID` masih ada), form berjalan dalam **mode demo** — data tidak dikirim ke mana-mana, tapi halaman sukses tetap muncul
- File `Kode.gs` adalah versi **v2.0.0** dengan semua bug fix sudah diterapkan

---

## Lisensi

Dikembangkan untuk keperluan internal KUA Kecamatan Ambulu — Kementerian Agama Kabupaten Jember.

---

## Troubleshooting — "Failed to fetch" (Error CORS)

### Penyebab
`fetch()` dengan header `Content-Type: application/json` memicu **preflight OPTIONS request** yang tidak didukung Google Apps Script → seluruh request diblokir browser.

### Solusi yang Diterapkan (v2.1.0)

`js/form.js` menggunakan fungsi `kirimKeGAS()` dengan **2 strategi berlapis**:

**Strategi 1 — `fetch no-cors` + `URLSearchParams`**

Tanpa custom header, browser menganggap ini *simple request* — tidak ada preflight. GAS membaca data via `e.parameter.data`.

```js
const formData = new URLSearchParams();
formData.append('data', JSON.stringify(payload));
await fetch(GAS_URL, { method: 'POST', mode: 'no-cors', body: formData });
```

**Strategi 2 — Hidden `<form>` + `<iframe>` (fallback otomatis)**

Form HTML biasa di-submit via iframe tersembunyi. CORS tidak berlaku untuk form submission HTML standar.

### Perubahan `Kode.gs` (v2.1.0)

`doPost()` kini membaca dari dua sumber:

```js
if (e.parameter && e.parameter.data) {
  rawData = e.parameter.data;          // dari fetch no-cors
} else if (e.postData && e.postData.contents) {
  rawData = e.postData.contents;       // dari fetch JSON (fallback)
}
```

> **Penting:** Setelah update `Kode.gs`, buat **New Deployment** baru di Google Apps Script (bukan edit deployment lama). Salin URL deployment baru ke `CONFIG.GAS_URL` di `js/form.js`.
