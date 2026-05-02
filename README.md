# 📋 Absensi Digital KUA Ambulu

Sistem absensi digital untuk peserta bimbingan perkawinan calon pengantin di KUA Kecamatan Ambulu.

---

## 🌟 Fitur

- ✅ Form input data calon suami dan istri
- ✅ Validasi real-time dengan pesan error yang jelas
- ✅ Signature canvas untuk tanda tangan digital (background putih, anti dark mode)
- ✅ Custom date picker mobile-friendly dengan dropdown tahun & grid kalender
- ✅ Halaman bukti pendaftaran formal bergaya kop surat KUA
- ✅ Responsive design (mobile & desktop)
- ✅ Integrasi dengan Google Sheets
- ✅ Auto-generate Google Docs biodata
- ✅ Desain modern dengan motif batik

---

## 🚀 Live Demo

**Production URL:** [https://kuaambulu.github.io/absensi-kua-ambulu/](https://kuaambulu.github.io/absensi-kua-ambulu/)

---

## 📁 Struktur File

```
absensi-kua-ambulu/
├── index.html              # Main HTML file (form + halaman bukti pendaftaran)
├── css/
│   └── style.css           # Stylesheet (termasuk style halaman sukses)
├── js/
│   ├── config.js           # Konfigurasi (API URL, timeout, pesan)
│   ├── signature.js        # Signature canvas handler (fixed)
│   ├── validation.js       # Validasi form + custom date picker
│   └── app.js              # Main application logic + halaman sukses
├── README.md               # Dokumentasi
└── .gitignore              # Git ignore file
```

---

## 🔧 Setup & Installation

### 1. Clone Repository

```bash
git clone https://github.com/username/absensi-kua-ambulu.git
cd absensi-kua-ambulu
```

### 2. Konfigurasi API

Edit file `js/config.js`:

```javascript
const CONFIG = {
  API_URL: 'https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec',
  MODE: 'production'
};
```

Ganti `YOUR_DEPLOYMENT_ID` dengan ID deployment Google Apps Script Anda.

### 3. Deploy ke GitHub Pages

1. Push ke GitHub:
```bash
git add .
git commit -m "Update fitur"
git push origin main
```

2. Aktifkan GitHub Pages:
   - Buka repository **Settings**
   - Scroll ke **Pages**
   - Source: Deploy from branch `main`
   - Folder: `/ (root)`
   - Klik **Save**

3. Tunggu 1–2 menit, akses via:
   `https://username.github.io/absensi-kua-ambulu/`

> ⚠️ **Catatan Deploy:** Setelah push, lakukan hard refresh di browser agar file JS/CSS terbaru dimuat. Di Android Chrome: buka tab baru lalu akses ulang URL.

---

## 🔗 Backend Integration

Backend menggunakan Google Apps Script yang terhubung ke Google Sheets.

### Setup Backend:

1. Buat Google Spreadsheet baru
2. Rename sheet menjadi **"HADIR"**
3. Buka **Extensions → Apps Script**
4. Copy kode dari file `backend/Code.gs`
5. Klik **Deploy → New deployment → Web App**
6. Atur akses: **"Who has access: Anyone"**
7. Copy URL deployment ke `js/config.js`

---

## 📊 Data Fields

### Calon Suami & Istri:
- Nama Lengkap
- Tempat Lahir
- Tanggal Lahir
- Alamat Lengkap
- NIK (16 digit)
- No. Telp/HP (10–13 digit)
- Email
- Tanda Tangan (digital signature)

---

## 🖊️ Signature Canvas

Canvas tanda tangan telah diperbaiki dengan beberapa peningkatan:

- **Background putih paksa** — tidak mengikuti mode gelap sistem (`color-scheme: light`, `forced-color-adjust: none`)
- **Warna tinta hitam** — tetap `#000000` di semua kondisi
- **Anti-hilang saat resize** — gambar TTD disimpan sementara sebelum resize lalu dikembalikan
- **Touch support** — mendukung gambar jari di layar sentuh (mobile)
- **Validasi wajib** — jika TTD kosong saat submit, muncul peringatan dan field di-highlight merah

---

## 📅 Custom Date Picker

`input[type="date"]` diganti dengan custom date picker agar lebih ramah di perangkat mobile:

- **Dropdown Tahun** — scroll dari 1930 hingga tahun ini (minimal usia 17 tahun), mudah dipilih tanpa gestur berulang
- **Dropdown Bulan** — nama bulan Bahasa Indonesia
- **Grid Kalender** — tampilan tanggal bergaya kalender dengan highlight hari aktif
- **Preview tanggal** — menampilkan tanggal terpilih sebelum dikonfirmasi
- **Tombol Batal / Pilih** — konfirmasi eksplisit sebelum nilai tersimpan

---

## ✅ Halaman Bukti Pendaftaran

Setelah form berhasil dikirim, halaman form digantikan oleh **halaman bukti pendaftaran formal** yang menampilkan:

- **Kop surat resmi** — logo KUA, nama instansi Kemenag RI, nama kantor, dan alamat
- **Status sukses** — ikon centang hijau besar dengan teks konfirmasi
- **Waktu real-time** — hari, tanggal, bulan, tahun, jam:menit:detik WIB saat data terkirim
- **Nama calon suami & istri** yang baru saja didaftarkan
- **Catatan** Ucapan terimakasih 
- **Tombol "Isi Form Baru"** — kembali ke form kosong untuk peserta berikutnya

---

## 🎨 Customization

### Ubah Warna Tema

Edit `css/style.css`:

```css
/* Hijau Kemenag */
--primary-color: #15803d;
--secondary-color: #22c55e;
```

### Ubah Logo

Ganti URL logo di `index.html`:

```html
<img src="URL_LOGO_BARU" alt="Logo KUA Ambulu" class="logo-image">
```

---

## 🔐 Security

- CORS ditangani dengan `mode: 'no-cors'`
- Data dikirim via HTTPS
- Validasi client-side & server-side
- Tidak ada data sensitif yang disimpan di frontend

---

## 📱 Browser Support

| Browser | Status |
|---|---|
| Chrome (Android/Desktop) | ✅ Recommended |
| Firefox | ✅ |
| Safari (iOS) | ✅ |
| Edge | ✅ |
| Browser mobile lainnya | ✅ |

---

## 🐛 Troubleshooting

### Data tidak masuk ke Google Sheets
1. Cek URL API di `js/config.js`
2. Pastikan Apps Script di-deploy dengan **"Who has access: Anyone"**
3. Buka browser console (F12) untuk melihat error detail

### Tanda tangan menghilang setelah digambar
- Pastikan menggunakan versi `js/signature.js` terbaru (v1.3+)
- Refresh halaman jika terjadi setelah resize browser

### Halaman bukti tidak muncul / error textContent
- Pastikan `index.html` sudah diupdate ke versi terbaru (berisi elemen `id="successPage"`)
- Lakukan hard refresh: buka tab baru → akses ulang URL
- Cek apakah GitHub Pages sudah selesai rebuild (tunggu 1–2 menit setelah push)

### Date picker tidak muncul
- Pastikan `js/validation.js` versi terbaru sudah ter-deploy
- Cek browser console untuk error JavaScript

---

## 📝 Changelog

### v1.3.0 — Mei 2026
- 🆕 Halaman bukti pendaftaran formal bergaya kop surat KUA
- 🆕 Waktu real-time pada halaman bukti (hari, tanggal, jam WIB)
- 🆕 Custom date picker mobile-friendly menggantikan `input[type="date"]`
- 🐛 Fix: canvas TTD hilang setelah digambar akibat resize
- 🐛 Fix: canvas TTD mengikuti dark mode sistem (sekarang selalu putih)
- 🐛 Fix: validasi TTD kosong saat submit tidak terdeteksi
- 🐛 Fix: crash `textContent null` saat index.html & app.js versi berbeda

### v1.2.0 — Januari 2026
- 🆕 Integrasi Google Sheets & Google Docs
- 🆕 Signature canvas dengan touch support
- 🆕 Validasi NIK, No. Telp, dan Email real-time

### v1.1.0
- 🆕 Responsive design mobile & desktop
- 🆕 Desain motif batik

### v1.0.0
- 🎉 Rilis pertama

---

## 📝 License

GNU General Public License v3.0 — lihat file [LICENSE](LICENSE) untuk detail lengkap.

---

## 👨‍💻 Developer

Developed with ❤️ by **Zainur Rozikin** for KUA Kecamatan Ambulu

## 📞 Support

Untuk bantuan teknis, hubungi:
- Email: zrozikin11@gmail.com

---

**Version:** 1.3.0
**Last Updated:** 2 Mei 2026
