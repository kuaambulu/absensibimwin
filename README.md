# 📋 Absensi Digital KUA Ambulu

Sistem absensi digital untuk peserta bimbingan perkawinan calon pengantin di KUA Kecamatan Ambulu.

## 🌟 Fitur

- ✅ Form input data calon suami dan istri
- ✅ Validasi real-time
- ✅ Signature canvas untuk tanda tangan digital
- ✅ Responsive design (mobile & desktop)
- ✅ Integrasi dengan Google Sheets
- ✅ Auto-generate Google Docs biodata
- ✅ Desain modern dengan motif batik

## 🚀 Live Demo

**Production URL:** [https://username.github.io/absensi-kua-ambulu/](https://username.github.io/absensi-kua-ambulu/)

## 📁 Struktur File

```
absensi-kua-ambulu/
├── index.html              # Main HTML file
├── css/
│   └── style.css          # Stylesheet
├── js/
│   ├── config.js          # Configuration
│   ├── signature.js       # Signature canvas handler
│   ├── validation.js      # Form validation
│   └── app.js             # Main application logic
├── README.md              # Documentation
└── .gitignore             # Git ignore file
```

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
git commit -m "Initial commit"
git push origin main
```

2. Aktifkan GitHub Pages:
   - Buka repository Settings
   - Scroll ke Pages
   - Source: Deploy from branch `main`
   - Folder: `/ (root)`
   - Save

3. Tunggu 1-2 menit, akses via:
   `https://username.github.io/absensi-kua-ambulu/`

## 🔗 Backend Integration

Backend menggunakan Google Apps Script. File backend tersedia di:
- [Google Apps Script Code](https://script.google.com/home)

### Setup Backend:

1. Buat Google Spreadsheet baru
2. Rename sheet menjadi "HADIR"
3. Extensions → Apps Script
4. Copy kode dari file `backend/Code.gs`
5. Deploy sebagai Web App
6. Copy URL deployment ke `js/config.js`

## 📊 Data Fields

### Calon Suami & Istri:
- Nama Lengkap
- Tempat Lahir
- Tanggal Lahir
- Alamat Lengkap
- NIK (16 digit)
- No. Telp/HP (10-13 digit)
- Email
- Tanda Tangan (digital signature)

## 🎨 Customization

### Ubah Warna Tema

Edit `css/style.css`:

```css
/* Hijau Kemenag */
--primary-color: #15803d;
--secondary-color: #22c55e;
```

### Ubah Logo

Edit HTML atau tambahkan file logo di `assets/logo.png`

## 🔐 Security

- CORS handled dengan `mode: 'no-cors'`
- Data dikirim via HTTPS
- Validasi client-side & server-side
- No sensitive data di frontend

## 📱 Browser Support

- ✅ Chrome (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Mobile browsers

## 🐛 Troubleshooting

### Data tidak masuk ke Google Sheets

1. Cek URL API di `config.js`
2. Pastikan Apps Script deployed dengan "Who has access: Anyone"
3. Cek browser console untuk error

### Signature tidak berfungsi

1. Cek browser support untuk Canvas API
2. Clear browser cache
3. Test di browser lain

## 📝 License

© 2025 KUA Kecamatan Ambulu. All Rights Reserved.

## 👨‍💻 Developer

Developed with ❤️ for KUA Kecamatan Ambulu

## 📞 Support

Untuk bantuan teknis, hubungi:
- Email: support@kuaambulu.go.id
- Phone: (0331) xxx-xxx

---

**Version:** 1.0.0  
**Last Updated:** January 2025
