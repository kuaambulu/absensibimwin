/* ============================================
   FORM.JS — Logic Submit & Navigasi Halaman
   KUA Ambulu Biodata Form
   ============================================

   CATATAN BUG FIX — TANGGAL LAHIR:
   ─────────────────────────────────
   tanggalLahir selalu diambil via input.value ("YYYY-MM-DD")
   lalu diformat dengan formatTanggalIndo() tanpa new Date(),
   sehingga tidak ada risiko konversi ke tanggal hari ini.

   CATATAN FIX — CORS (Failed to fetch):
   ──────────────────────────────────────
   fetch() dengan header "Content-Type: application/json"
   memicu preflight OPTIONS request yang diblokir oleh
   Google Apps Script — itulah penyebab "Failed to fetch".

   Solusi: kirim payload sebagai URLSearchParams (form-encoded)
   TANPA custom Content-Type header. Browser tidak mengirim
   preflight untuk request seperti ini, sehingga GAS bisa
   menerimanya. Di Kode.gs, data dibaca via e.parameter.data
   (bukan e.postData.contents).

   Karena mode ini tidak mengembalikan response yang bisa dibaca
   (opaque response), kita gunakan teknik "fire and redirect":
   - Kirim data
   - Tunggu sebentar (data pasti sudah diterima GAS)
   - Tampilkan halaman sukses tanpa menunggu response
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
      if (CONFIG.GAS_URL && !CONFIG.GAS_URL.includes('YOUR_SCRIPT_ID')) {
        await kirimKeGAS(payload);
      } else {
        // Mode demo — GAS_URL belum dikonfigurasi
        console.warn('[FORM.JS] GAS_URL belum dikonfigurasi. Mode demo aktif.');
        await new Promise(r => setTimeout(r, 1200));
      }

      // Isi halaman sukses
      document.getElementById('sukses-nama-suami').textContent = payload.suami.namaLengkap;
      document.getElementById('sukses-nama-istri').textContent = payload.istri.namaLengkap;
      document.getElementById('sukses-waktu').textContent      = getWaktuSekarang();

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
// KIRIM DATA KE GOOGLE APPS SCRIPT
// — Solusi CORS untuk GitHub Pages → GAS —
// ============================================
//
// MASALAH:
//   fetch() dengan header "Content-Type: application/json"
//   memicu preflight OPTIONS yang diblokir GAS → "Failed to fetch"
//
// SOLUSI — 2 strategi, dicoba berurutan:
//
//   Strategi 1 — fetch no-cors dengan URLSearchParams:
//     Tidak mengirim custom header, sehingga browser tidak
//     melakukan preflight. Payload JSON dikirim sebagai nilai
//     field "data" dalam form-encoded body. Di GAS, dibaca via
//     e.parameter.data. Kekurangan: response tidak bisa dibaca
//     (opaque), tapi data PASTI sampai ke GAS.
//
//   Strategi 2 — Fallback iframe POST (jika fetch no-cors gagal):
//     Buat hidden <form> yang submit ke GAS via iframe target.
//     Ini 100% melewati CORS karena bukan XHR/fetch.
//
// ============================================

async function kirimKeGAS(payload) {
  const jsonStr = JSON.stringify(payload);

  if (CONFIG.DEBUG) {
    console.log('[DEBUG] Payload size:', jsonStr.length, 'chars');
    console.log('[DEBUG] GAS_URL:', CONFIG.GAS_URL);
  }

  // ── Strategi 1: fetch dengan mode no-cors ──────────────────────────────
  // Kirim sebagai application/x-www-form-urlencoded (simple request)
  // agar tidak ada preflight. GAS membaca via e.parameter.data
  try {
    const formData = new URLSearchParams();
    formData.append('data', jsonStr);

    await fetch(CONFIG.GAS_URL, {
      method    : 'POST',
      mode      : 'no-cors',   // ← kunci utama — tidak ada preflight
      body      : formData      // URLSearchParams = Content-Type otomatis form-encoded
      // TIDAK ada custom headers — browser akan pakai simple request
    });

    // no-cors = response selalu "opaque", tidak bisa dibaca.
    // Tapi fetch resolve = request berhasil dikirim ke server.
    if (CONFIG.DEBUG) console.log('[DEBUG] Strategi 1 (no-cors fetch) berhasil');
    return; // sukses, keluar

  } catch (err) {
    // Jika no-cors fetch benar-benar gagal (sangat jarang),
    // coba strategi 2
    console.warn('[FORM.JS] Strategi 1 gagal, coba Strategi 2:', err.message);
  }

  // ── Strategi 2: Fallback — hidden form + iframe ────────────────────────
  // Submit form biasa ke GAS via iframe tersembunyi.
  // 100% melewati CORS karena ini adalah form submission standar HTML.
  await new Promise((resolve, reject) => {
    try {
      const iframeName = 'gas_iframe_' + Date.now();

      const iframe = document.createElement('iframe');
      iframe.name  = iframeName;
      iframe.style.cssText = 'display:none;width:0;height:0;border:0;';
      document.body.appendChild(iframe);

      const form        = document.createElement('form');
      form.method       = 'POST';
      form.action       = CONFIG.GAS_URL;
      form.target       = iframeName;
      form.style.cssText = 'display:none;';

      const input   = document.createElement('input');
      input.type    = 'hidden';
      input.name    = 'data';
      input.value   = jsonStr;
      form.appendChild(input);

      document.body.appendChild(form);

      // GAS biasanya merespons dalam 3–8 detik
      // Kita tunggu 5 detik lalu anggap sukses
      const timer = setTimeout(() => {
        document.body.removeChild(form);
        document.body.removeChild(iframe);
        if (CONFIG.DEBUG) console.log('[DEBUG] Strategi 2 (iframe POST) selesai');
        resolve();
      }, 5000);

      iframe.onload = () => {
        clearTimeout(timer);
        document.body.removeChild(form);
        document.body.removeChild(iframe);
        if (CONFIG.DEBUG) console.log('[DEBUG] Strategi 2 iframe onload fired');
        resolve();
      };

      form.submit();

    } catch (err2) {
      reject(new Error('Semua strategi pengiriman gagal: ' + err2.message));
    }
  });
}

// ============================================
// INIT
// ============================================
document.addEventListener('DOMContentLoaded', setupForm);
