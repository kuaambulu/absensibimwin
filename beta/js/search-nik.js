/**
 * ============================================
 * beta/js/search-nik.js
 * ============================================
 * - Tampilan awal: hanya kotak cari NIK (form field disembunyikan).
 * - NIK ditemukan  -> auto-isi field, sembunyikan kotak cari, tampilkan form.
 * - NIK tidak ditemukan -> popup "Periksa Kembali inputan NIK Anda" dengan
 *   tombol "Masukkan Manual" (lanjut isi form kosong) dan
 *   "Kembali Isi NIK" (tutup popup, coba NIK lain).
 *
 * URUTAN LOAD WAJIB di beta/index.html (butuh fungsi dari validation.js):
 *   config.js -> signature.js -> validation.js -> search-nik.js -> app.js
 *
 * YANG DIISI OTOMATIS:
 *   suami/istri: namaLengkap, alamatLengkap, nik, tanggalLahir (estimasi dari NIK)
 *   tgl_akad (tanggal akad nikah)
 *
 * YANG TETAP MANUAL:
 *   tempatLahir (suami & istri), noTelp, email, tandaTangan.
 *   tanggalLahir SUDAH diisi otomatis tapi tetap bisa dikoreksi lewat date-picker
 *   asli kalau hasil estimasi dari NIK kurang tepat.
 */

(function () {
  // Ganti dengan URL Web App deployment BETA (spreadsheet baru, terpisah dari produksi)
  const BETA_API_URL = 'https://script.google.com/macros/s/AKfycbxC8B9zjAkrXTcsU_JkPdlujaYGXWPXyo5j8DskZfrpLx7RT_YsQncAwHUmBDs6M9d-Lw/exec';

  let searchSection, formFields, modal, inputNik, btnCari, statusEl;

  function setValue(id, value) {
    const el = document.getElementById(id);
    if (!el || !value) return;
    el.value = value;
    if (typeof removeErrorStyling === 'function') removeErrorStyling(el);
  }

  // Isi field date-picker (hidden input + span tampilan), dipakai untuk
  // tgl_akad (pakai formatTanggalDenganHari) maupun tanggal lahir (pakai formatTanggalIndonesia).
  function isiDatePicker(hiddenId, isoDateStr, formatterFn) {
    if (!isoDateStr || !/^\d{4}-\d{2}-\d{2}$/.test(isoDateStr)) return;

    const hidden = document.getElementById(hiddenId);
    const display = document.getElementById(hiddenId + '_display');
    if (!hidden) return;

    hidden.value = isoDateStr;

    if (display) {
      const textEl = display.querySelector('.date-display-text');
      const teks = (typeof formatterFn === 'function') ? formatterFn(isoDateStr) : isoDateStr;

      if (textEl) textEl.textContent = teks;
      display.classList.add('has-value');
      display.style.color = '#111827';

      if (typeof removeErrorStyling === 'function') {
        removeErrorStyling(display);
        removeErrorStyling(hidden);
      }
    }
  }

  function tampilkanForm() {
    if (searchSection) searchSection.style.display = 'none';
    if (formFields) formFields.style.display = '';
  }

  function tampilkanPencarian() {
    if (formFields) formFields.style.display = 'none';
    if (searchSection) searchSection.style.display = '';
  }

  function tampilkanModalTidakDitemukan() {
    if (modal) modal.style.display = 'flex';
  }

  function tutupModal() {
    if (modal) modal.style.display = 'none';
  }

  function validateNIKLocal(nik) {
    return /^\d{16}$/.test(nik);
  }

  async function cariDataByNik(nik) {
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
        if (statusEl) statusEl.textContent = '';
        tampilkanModalTidakDitemukan();
        return;
      }

      const { suami, istri, tanggalAkad } = json.data;

      // SUAMI
      setValue('suami_namaLengkap', suami.namaLengkap);
      setValue('suami_alamatLengkap', suami.alamatLengkap);
      setValue('suami_nik', suami.nik);
      isiDatePicker('suami_tanggalLahir', suami.tanggalLahir, formatTanggalIndonesia);

      // ISTRI
      setValue('istri_namaLengkap', istri.namaLengkap);
      setValue('istri_alamatLengkap', istri.alamatLengkap);
      setValue('istri_nik', istri.nik);
      isiDatePicker('istri_tanggalLahir', istri.tanggalLahir, formatTanggalIndonesia);

      // AKAD
      isiDatePicker('tgl_akad', tanggalAkad, formatTanggalDenganHari);

      if (statusEl) statusEl.textContent = '';
      tampilkanForm();

    } catch (err) {
      console.error('Gagal mengambil data BETA:', err);
      if (statusEl) statusEl.textContent = 'Terjadi kesalahan saat mengambil data. Coba lagi.';
    } finally {
      if (btnCari) btnCari.disabled = false;
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    searchSection = document.getElementById('searchSection');
    formFields    = document.getElementById('formFields');
    modal         = document.getElementById('nikNotFoundModal');
    inputNik      = document.getElementById('inputCariNik');
    btnCari       = document.getElementById('btnCariNik');
    statusEl      = document.getElementById('statusCariNik');

    const btnModalManual    = document.getElementById('btnModalManual');
    const btnModalKembali   = document.getElementById('btnModalKembali');

    // Pastikan state awal benar: hanya kotak pencarian yang tampil
    tampilkanPencarian();
    tutupModal();

    if (btnCari && inputNik) {
      btnCari.addEventListener('click', function () {
        cariDataByNik(inputNik.value);
      });

      inputNik.addEventListener('input', function () {
        this.value = this.value.replace(/[^0-9]/g, '');
      });

      inputNik.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          cariDataByNik(inputNik.value);
        }
      });
    }

    // Popup: "Masukkan Manual" -> tutup popup, langsung ke form kosong
    if (btnModalManual) {
      btnModalManual.addEventListener('click', function () {
        tutupModal();
        tampilkanForm();
      });
    }

    // Popup: "Kembali Isi NIK" -> tutup popup, tetap di kotak pencarian, fokuskan input
    if (btnModalKembali) {
      btnModalKembali.addEventListener('click', function () {
        tutupModal();
        if (inputNik) inputNik.focus();
      });
    }
  });

  window.cariDataByNik = cariDataByNik;
})();