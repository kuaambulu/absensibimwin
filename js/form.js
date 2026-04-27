/* ============================================
   FORM.JS — Logic Submit & Navigasi Halaman
   KUA Ambulu Biodata Form
   ============================================
   
   CATATAN BUG FIX — TANGGAL LAHIR:
   ─────────────────────────────────
   Bug lama: tanggalLahir dikirim sebagai objek Date atau 
   hasil `new Date(inputEl.value).toLocaleDateString()` yang 
   mengembalikan tanggal hari ini di beberapa browser/locale.
   
   Fix: Selalu ambil nilai field tanggal via `inputEl.value`
   secara langsung — ini menghasilkan string "YYYY-MM-DD" 
   yang stabil dan tidak bergantung locale. String ini lalu 
   diformat ke "DD Bulan YYYY" menggunakan fungsi pure JS 
   tanpa konstruktor Date, sehingga tidak ada risiko offset 
   timezone yang menggeser hari.
   
   Backend (Kode.gs) menerima string "DD Bulan YYYY" dan 
   memasukkannya ke sheet sebagai teks (bukan Date object),
   sehingga Google Sheets tidak bisa salah-konversi ke 
   tanggal hari ini.
   ============================================ */

'use strict';

// ---- KONFIGURASI ----
const CONFIG = {
  // Ganti dengan URL Google Apps Script Web App Anda
  GAS_URL: 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec',
  DEBUG: false  // set true untuk lihat log di console
};

// ---- NAMA BULAN INDONESIA ----
const NAMA_BULAN = [
  'Januari','Februari','Maret','April','Mei','Juni',
  'Juli','Agustus','September','Oktober','November','Desember'
];

// ============================================
// HELPER TANGGAL — TIDAK PAKAI new Date()
// ============================================

/**
 * Format string "YYYY-MM-DD" → "DD Bulan YYYY"
 * 
 * KRITIS: Fungsi ini TIDAK menggunakan new Date() untuk 
 * menghindari bug konversi timezone yang menyebabkan tanggal 
 * bergeser ke hari ini atau hari sebelumnya.
 * 
 * @param {string} isoString - string dari input[type=date].value, format "YYYY-MM-DD"
 * @returns {string} - contoh: "12 Mei 2000"
 */
function formatTanggalIndo(isoString) {
  if (!isoString || typeof isoString !== 'string') return '';
  
  // Pecah string langsung — JANGAN pakai new Date()
  const parts = isoString.split('-');
  if (parts.length !== 3) return isoString;
  
  const tahun = parts[0];
  const bulan = parseInt(parts[1], 10) - 1; // 0-indexed
  const hari  = parseInt(parts[2], 10);
  
  if (bulan < 0 || bulan > 11 || hari < 1 || hari > 31) return isoString;
  
  return `${hari} ${NAMA_BULAN[bulan]} ${tahun}`;
}

/**
 * Dapatkan timestamp waktu Indonesia (WIB, UTC+7)
 * tanpa bergantung pada locale browser.
 * @returns {string}
 */
function getWaktuSekarang() {
  const now  = new Date();
  const wib  = new Date(now.getTime() + (7 * 60 * 60 * 1000));
  const tgl  = wib.getUTCDate();
  const bln  = wib.getUTCMonth(); // 0-indexed
  const thn  = wib.getUTCFullYear();
  const jam  = String(wib.getUTCHours()).padStart(2, '0');
  const mnt  = String(wib.getUTCMinutes()).padStart(2, '0');
  
  return `${tgl} ${NAMA_BULAN[bln]} ${thn}, ${jam}:${mnt} WIB`;
}

// ============================================
// VALIDASI
// ============================================

function showError(elId, show = true) {
  const el = document.getElementById(elId);
  if (!el) return;
  if (show) el.classList.add('error');
  else      el.classList.remove('error');
}

function validateForm() {
  let valid = true;

  const requiredFields = [
    'nama_suami', 'tempat_lahir_suami', 'tgl_lahir_suami',
    'nik_suami', 'telp_suami', 'alamat_suami', 'email_suami',
    'nama_istri', 'tempat_lahir_istri', 'tgl_lahir_istri',
    'nik_istri', 'telp_istri', 'alamat_istri', 'email_istri'
  ];

  requiredFields.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    const val = el.value.trim();
    if (!val) {
      showError(id, true);
      if (valid) { el.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
      valid = false;
    } else {
      showError(id, false);
    }
  });

  // Validasi NIK (16 digit)
  ['nik_suami', 'nik_istri'].forEach(id => {
    const el = document.getElementById(id);
    if (el && el.value.trim() && !/^\d{16}$/.test(el.value.trim())) {
      showError(id, true);
      valid = false;
    }
  });

  // Validasi tanda tangan
  ['suami', 'istri'].forEach(who => {
    const wrap = document.getElementById('ttd-wrap-' + who);
    if (!hasSignature(who)) {
      if (wrap) wrap.classList.add('error');
      valid = false;
    } else {
      if (wrap) wrap.classList.remove('error');
    }
  });

  return valid;
}

// ============================================
// NAVIGASI HALAMAN
// ============================================

function showPage(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const target = document.getElementById(pageId);
  if (target) {
    target.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

// ============================================
// SETUP FORM
// ============================================

function setupForm() {
  // Set max tanggal = hari ini agar tidak bisa pilih masa depan
  // Gunakan format "YYYY-MM-DD" dari Date.toISOString — ini hanya untuk 
  // atribut max, bukan untuk value yang dikirim ke backend
  const todayISO = new Date().toISOString().split('T')[0];
  document.getElementById('tgl_lahir_suami').setAttribute('max', todayISO);
  document.getElementById('tgl_lahir_istri').setAttribute('max', todayISO);

  // Hapus error saat field mulai diisi
  document.querySelectorAll('input, textarea').forEach(el => {
    el.addEventListener('input', () => showError(el.id, false));
  });

  // Handle submit
  const form   = document.getElementById('form-biodata');
  const btnKirim = document.getElementById('btn-kirim');
  const btnText  = document.getElementById('btn-kirim-text');
  const btnLoad  = document.getElementById('btn-kirim-loading');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // ============================================
    // KRITIS — FIX BUG TANGGAL LAHIR
    // ============================================
    // Selalu ambil .value dari input[type=date] — hasilnya "YYYY-MM-DD"
    // Lalu format dengan formatTanggalIndo() — TIDAK pakai new Date()
    // ============================================
    const tglLahirSuamiRaw  = document.getElementById('tgl_lahir_suami').value; // "YYYY-MM-DD"
    const tglLahirIstriRaw  = document.getElementById('tgl_lahir_istri').value; // "YYYY-MM-DD"

    const tglLahirSuami = formatTanggalIndo(tglLahirSuamiRaw); // "DD Bulan YYYY"
    const tglLahirIstri = formatTanggalIndo(tglLahirIstriRaw); // "DD Bulan YYYY"

    if (CONFIG.DEBUG) {
      console.log('[DEBUG] Tanggal Suami raw:', tglLahirSuamiRaw, '→', tglLahirSuami);
      console.log('[DEBUG] Tanggal Istri  raw:', tglLahirIstriRaw, '→', tglLahirIstri);
    }

    // Susun payload ke backend (Kode.gs)
    const payload = {
      suami: {
        namaLengkap   : document.getElementById('nama_suami').value.trim(),
        tempatLahir   : document.getElementById('tempat_lahir_suami').value.trim(),
        tanggalLahir  : tglLahirSuami,   // ← string stabil "DD Bulan YYYY"
        alamatLengkap : document.getElementById('alamat_suami').value.trim(),
        nik           : document.getElementById('nik_suami').value.trim(),
        noTelp        : document.getElementById('telp_suami').value.trim(),
        email         : document.getElementById('email_suami').value.trim(),
        tandaTangan   : getSignatureData('suami')  // base64 PNG | null
      },
      istri: {
        namaLengkap   : document.getElementById('nama_istri').value.trim(),
        tempatLahir   : document.getElementById('tempat_lahir_istri').value.trim(),
        tanggalLahir  : tglLahirIstri,   // ← string stabil "DD Bulan YYYY"
        alamatLengkap : document.getElementById('alamat_istri').value.trim(),
        nik           : document.getElementById('nik_istri').value.trim(),
        noTelp        : document.getElementById('telp_istri').value.trim(),
        email         : document.getElementById('email_istri').value.trim(),
        tandaTangan   : getSignatureData('istri')  // base64 PNG | null
      }
    };

    // UI loading
    btnKirim.disabled = true;
    btnText.classList.add('hidden');
    btnLoad.classList.remove('hidden');

    try {
      let docUrl = null;

      // Kirim ke Google Apps Script jika URL sudah dikonfigurasi
      if (CONFIG.GAS_URL && !CONFIG.GAS_URL.includes('YOUR_SCRIPT_ID')) {
        const response = await fetch(CONFIG.GAS_URL, {
          method : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body   : JSON.stringify(payload)
        });

        if (!response.ok) {
          throw new Error('Server merespons dengan status ' + response.status);
        }

        const result = await response.json();

        if (!result.success) {
          throw new Error(result.message || 'Gagal menyimpan data di server.');
        }

        docUrl = result.documentUrl || null;
      } else {
        // Mode demo — tanpa koneksi backend
        console.warn('[FORM.JS] GAS_URL belum dikonfigurasi. Berjalan dalam mode demo.');
        await new Promise(r => setTimeout(r, 1200)); // simulasi delay
      }

      // Isi halaman sukses
      document.getElementById('sukses-nama-suami').textContent = payload.suami.namaLengkap;
      document.getElementById('sukses-nama-istri').textContent = payload.istri.namaLengkap;
      document.getElementById('sukses-waktu').textContent      = getWaktuSekarang();

      if (docUrl) {
        const docRow  = document.getElementById('sukses-doc-row');
        const docLink = document.getElementById('sukses-doc-link');
        docRow.style.display  = 'flex';
        docLink.href          = docUrl;
      }

      showPage('page-sukses');

    } catch (err) {
      console.error('[FORM.JS] Submit error:', err);
      alert('Terjadi kesalahan saat mengirim data:\n' + err.message +
            '\n\nSilakan coba lagi atau hubungi petugas.');

      btnKirim.disabled = false;
      btnText.classList.remove('hidden');
      btnLoad.classList.add('hidden');
    }
  });
}

// ============================================
// INIT
// ============================================
document.addEventListener('DOMContentLoaded', setupForm);
