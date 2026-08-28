/**
 * ============================================
 * beta/js/search-nik.js
 * ============================================
 * Fitur pencarian data pendaftaran SIMKAH (sheet "DataBase") via NIK,
 * lalu auto-isi form absensi BimWin di folder beta/.
 *
 * URUTAN LOAD WAJIB di beta/index.html (script ini butuh fungsi dari validation.js):
 *   <script src="js/config.js"></script>
 *   <script src="js/signature.js"></script>
 *   <script src="js/validation.js"></script>
 *   <script src="js/search-nik.js"></script>   <-- taruh SETELAH validation.js
 *   <script src="js/app.js"></script>
 *
 * YANG DIISI OTOMATIS:
 *   suami_namaLengkap, suami_alamatLengkap, suami_nik,
 *   istri_namaLengkap, istri_alamatLengkap, istri_nik,
 *   tgl_akad (hidden input, format ISO YYYY-MM-DD, sama seperti yang dipakai
 *             app.js/validation.js) + teks tampilan di #tgl_akad_display
 *
 * YANG TETAP MANUAL (backend BETA sengaja tidak mengirim nilai untuk ini):
 *   tempatLahir, tanggalLahir (suami & istri), noTelp, email, tandaTangan
 */

(function () {
  // Ganti dengan URL Web App deployment BETA (spreadsheet baru, terpisah dari produksi)
  const BETA_API_URL = 'https://script.google.com/macros/s/GANTI_DENGAN_DEPLOYMENT_ID_BETA/exec';

  function setValue(id, value) {
    const el = document.getElementById(id);
    if (!el || !value) return;
    el.value = value;
    // Bersihkan highlight error kalau sebelumnya field ini pernah invalid
    if (typeof removeErrorStyling === 'function') {
      removeErrorStyling(el);
    }
  }

  function isiTanggalAkad(isoDateStr) {
    // isoDateStr diharapkan 'YYYY-MM-DD' dari backend. Kalau kosong/tidak valid, biarkan manual.
    if (!isoDateStr || !/^\d{4}-\d{2}-\d{2}$/.test(isoDateStr)) return;

    const hidden = document.getElementById('tgl_akad');
    const display = document.getElementById('tgl_akad_display');
    if (!hidden) return;

    hidden.value = isoDateStr;

    if (display) {
      const textEl = display.querySelector('.date-display-text');
      // Pakai fungsi yang sama persis dengan yang dipakai date-picker asli,
      // supaya format tampilan konsisten (contoh: "Senin, 15 September 2026").
      const teks = (typeof formatTanggalDenganHari === 'function')
        ? formatTanggalDenganHari(isoDateStr)
        : isoDateStr;

      if (textEl) textEl.textContent = teks;
      display.classList.add('has-value');
      display.style.color = '#111827';

      if (typeof removeErrorStyling === 'function') {
        removeErrorStyling(display);
        removeErrorStyling(hidden);
      }
    }
  }

  async function cariDataByNik(nik) {
    const statusEl = document.getElementById('statusCariNik');
    const btnCari  = document.getElementById('btnCariNik');

    const nikBersih = (nik || '').trim();

    if (!validateNIKLocal(nikBersih)) {
      if (statusEl) statusEl.textContent = 'NIK harus 16 digit angka.';
      return;
    }

    if (btnCari) btnCari.disabled = true;
    if (statusEl) statusEl.textContent = 'Mencari data pendaftaran...';

    try {
      const url = BETA_API_URL + '?nik=' + encodeURIComponent(nikBersih);
      const res = await fetch(url, { method: 'GET' });
      const json = await res.json();

      if (!json.success) {
        if (statusEl) statusEl.textContent = json.message || 'Data tidak ditemukan.';
        return;
      }

      const { suami, istri, tanggalAkad } = json.data;

      // SUAMI — hanya nama, alamat, NIK. Tempat/Tanggal Lahir TIDAK disentuh sama sekali.
      setValue('suami_namaLengkap', suami.namaLengkap);
      setValue('suami_alamatLengkap', suami.alamatLengkap);
      setValue('suami_nik', suami.nik);

      // ISTRI
      setValue('istri_namaLengkap', istri.namaLengkap);
      setValue('istri_alamatLengkap', istri.alamatLengkap);
      setValue('istri_nik', istri.nik);

      // AKAD
      isiTanggalAkad(tanggalAkad);

      if (statusEl) {
        statusEl.textContent = 'Data ditemukan. Silakan lengkapi Tempat Lahir, Tanggal Lahir, No. Telp, Email, dan Tanda Tangan secara manual.';
      }

    } catch (err) {
      console.error('Gagal mengambil data BETA:', err);
      if (statusEl) statusEl.textContent = 'Terjadi kesalahan saat mengambil data. Coba lagi.';
    } finally {
      if (btnCari) btnCari.disabled = false;
    }
  }

  // Validasi NIK lokal (16 digit) — dipakai sebelum kirim request pencarian,
  // TIDAK menggantikan validateNIK() milik validation.js yang jalan saat submit form.
  function validateNIKLocal(nik) {
    return /^\d{16}$/.test(nik);
  }

  document.addEventListener('DOMContentLoaded', function () {
    const btnCari = document.getElementById('btnCariNik');
    const inputNik = document.getElementById('inputCariNik');

    if (btnCari && inputNik) {
      btnCari.addEventListener('click', function () {
        cariDataByNik(inputNik.value);
      });

      // Batasi input hanya angka, sama seperti perilaku field NIK lain di form ini
      inputNik.addEventListener('input', function () {
        this.value = this.value.replace(/[^0-9]/g, '');
      });
    }
  });

  window.cariDataByNik = cariDataByNik;
})();