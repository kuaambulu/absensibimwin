// ============================================
// FORM VALIDATION - FIXED VERSION
// ============================================

// Format tanggal ke Bahasa Indonesia (dengan nama hari)
function formatTanggalIndonesia(dateString) {
  const bulanIndo = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  if (!dateString) return '';
  const parts = dateString.split('-');
  if (parts.length !== 3) return dateString;

  const tahun   = parseInt(parts[0]);
  const bulan   = parseInt(parts[1]) - 1;
  const tanggal = parseInt(parts[2]);

  return `${tanggal} ${bulanIndo[bulan]} ${tahun}`;
}

// Format tanggal DENGAN nama hari (untuk tanggal akad)
function formatTanggalDenganHari(dateString) {
  const hariIndo  = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];
  const bulanIndo = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  if (!dateString) return '';
  const parts = dateString.split('-');
  if (parts.length !== 3) return dateString;

  const tahun   = parseInt(parts[0]);
  const bulan   = parseInt(parts[1]) - 1;
  const tanggal = parseInt(parts[2]);

  // Gunakan Date hanya untuk menghitung hari — ini aman karena
  // kita pakai UTC agar tidak ada geseran timezone
  const d    = new Date(Date.UTC(tahun, bulan, tanggal));
  const hari = hariIndo[d.getUTCDay()];

  return `${hari}, ${tanggal} ${bulanIndo[bulan]} ${tahun}`;
}

// Check form validity
function checkFormValidity() {
  const submitBtn = document.getElementById('submitBtn');
  submitBtn.disabled = false;
}

// Validasi dan scroll ke field yang kosong
function validateAndScrollToError() {
  const errors = [];

  // Validasi TANGGAL AKAD NIKAH
  if (!document.getElementById('tgl_akad').value) {
    errors.push({ element: document.getElementById('tgl_akad_display'), message: 'Tanggal Akad Nikah harus diisi' });
  }

  // Validasi SUAMI
  if (!document.getElementById('suami_namaLengkap').value.trim()) {
    errors.push({ element: document.getElementById('suami_namaLengkap'), message: 'Nama Lengkap Calon Suami harus diisi' });
  }
  if (!document.getElementById('suami_tempatLahir').value.trim()) {
    errors.push({ element: document.getElementById('suami_tempatLahir'), message: 'Tempat Lahir Calon Suami harus diisi' });
  }
  if (!document.getElementById('suami_tanggalLahir').value) {
    errors.push({ element: document.getElementById('suami_tanggalLahir_display'), message: 'Tanggal Lahir Calon Suami harus diisi' });
  }
  if (!document.getElementById('suami_alamatLengkap').value.trim()) {
    errors.push({ element: document.getElementById('suami_alamatLengkap'), message: 'Alamat Lengkap Calon Suami harus diisi' });
  }
  if (!document.getElementById('suami_nik').value.trim()) {
    errors.push({ element: document.getElementById('suami_nik'), message: 'NIK Calon Suami harus diisi' });
  } else if (!validateNIK(document.getElementById('suami_nik').value.trim())) {
    errors.push({ element: document.getElementById('suami_nik'), message: 'NIK Calon Suami harus 16 digit angka' });
  }
  if (!document.getElementById('suami_noTelp').value.trim()) {
    errors.push({ element: document.getElementById('suami_noTelp'), message: 'No. Telp/HP Calon Suami harus diisi' });
  } else if (!validateTelp(document.getElementById('suami_noTelp').value.trim())) {
    errors.push({ element: document.getElementById('suami_noTelp'), message: 'No. Telp/HP Calon Suami harus 10-13 digit angka' });
  }
  if (!document.getElementById('suami_email').value.trim()) {
    errors.push({ element: document.getElementById('suami_email'), message: 'Email Calon Suami harus diisi' });
  } else if (!validateEmail(document.getElementById('suami_email').value.trim())) {
    errors.push({ element: document.getElementById('suami_email'), message: 'Format email Calon Suami tidak valid' });
  }

  // Validasi TTD Suami
  if (typeof suamiSignature !== 'undefined' && suamiSignature.isEmpty()) {
    const canvas = document.getElementById('suamiSignatureCanvas');
    errors.push({ element: canvas, message: 'Tanda Tangan Calon Suami harus diisi' });
  }

  // Validasi ISTRI
  if (!document.getElementById('istri_namaLengkap').value.trim()) {
    errors.push({ element: document.getElementById('istri_namaLengkap'), message: 'Nama Lengkap Calon Istri harus diisi' });
  }
  if (!document.getElementById('istri_tempatLahir').value.trim()) {
    errors.push({ element: document.getElementById('istri_tempatLahir'), message: 'Tempat Lahir Calon Istri harus diisi' });
  }
  if (!document.getElementById('istri_tanggalLahir').value) {
    errors.push({ element: document.getElementById('istri_tanggalLahir_display'), message: 'Tanggal Lahir Calon Istri harus diisi' });
  }
  if (!document.getElementById('istri_alamatLengkap').value.trim()) {
    errors.push({ element: document.getElementById('istri_alamatLengkap'), message: 'Alamat Lengkap Calon Istri harus diisi' });
  }
  if (!document.getElementById('istri_nik').value.trim()) {
    errors.push({ element: document.getElementById('istri_nik'), message: 'NIK Calon Istri harus diisi' });
  } else if (!validateNIK(document.getElementById('istri_nik').value.trim())) {
    errors.push({ element: document.getElementById('istri_nik'), message: 'NIK Calon Istri harus 16 digit angka' });
  }
  if (!document.getElementById('istri_noTelp').value.trim()) {
    errors.push({ element: document.getElementById('istri_noTelp'), message: 'No. Telp/HP Calon Istri harus diisi' });
  } else if (!validateTelp(document.getElementById('istri_noTelp').value.trim())) {
    errors.push({ element: document.getElementById('istri_noTelp'), message: 'No. Telp/HP Calon Istri harus 10-13 digit angka' });
  }
  if (!document.getElementById('istri_email').value.trim()) {
    errors.push({ element: document.getElementById('istri_email'), message: 'Email Calon Istri harus diisi' });
  } else if (!validateEmail(document.getElementById('istri_email').value.trim())) {
    errors.push({ element: document.getElementById('istri_email'), message: 'Format email Calon Istri tidak valid' });
  }

  // Validasi TTD Istri
  if (typeof istriSignature !== 'undefined' && istriSignature.isEmpty()) {
    const canvas = document.getElementById('istriSignatureCanvas');
    errors.push({ element: canvas, message: 'Tanda Tangan Calon Istri harus diisi' });
  }

  if (errors.length > 0) {
    const firstError = errors[0];

    // Highlight semua field error
    errors.forEach(err => {
      err.element.style.border = '2px solid #ef4444';
      err.element.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
    });

    // Focus & scroll ke error pertama
    firstError.element.focus();
    firstError.element.scrollIntoView({ behavior: 'smooth', block: 'center' });

    let errorMessage = 'Silakan isi kolom dengan benar:\n\n';
    errors.slice(0, 5).forEach((error, index) => {
      errorMessage += `${index + 1}. ${error.message}\n`;
    });
    if (errors.length > 5) {
      errorMessage += `\n... dan ${errors.length - 5} error lainnya`;
    }

    alert(errorMessage);

    // Reset border setelah 3 detik
    setTimeout(() => {
      errors.forEach(err => {
        err.element.style.border = '';
        err.element.style.boxShadow = '';
      });
    }, 3000);

    return false;
  }

  return true;
}

// Remove error styling saat user mulai mengisi
function removeErrorStyling(element) {
  element.style.border = '';
  element.style.boxShadow = '';
}

// Validasi numeric only untuk NIK dan No Telp
function setupNumericValidation() {
  const numericFields = ['suami_nik', 'suami_noTelp', 'istri_nik', 'istri_noTelp'];

  numericFields.forEach(fieldId => {
    const field = document.getElementById(fieldId);

    field.addEventListener('input', function(e) {
      this.value = this.value.replace(/[^0-9]/g, '');
      removeErrorStyling(this);
    });

    field.addEventListener('paste', function(e) {
      e.preventDefault();
      const pastedText = (e.clipboardData || window.clipboardData).getData('text');
      const numericOnly = pastedText.replace(/[^0-9]/g, '');
      this.value = numericOnly;
      removeErrorStyling(this);
    });

    field.addEventListener('keypress', function(e) {
      const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'];
      if (e.key && !/[0-9]/.test(e.key) && !allowedKeys.includes(e.key)) {
        e.preventDefault();
      }
    });
  });
}

// ============================================
// CUSTOM DATE PICKER - Mobile Friendly
// ============================================
function setupCustomDatePickers() {
  // Tanggal lahir (batasan masa lalu, minimal 17 tahun)
  const birthDateFields = [
    { hiddenId: 'suami_tanggalLahir', displayId: 'suami_tanggalLahir_display' },
    { hiddenId: 'istri_tanggalLahir',  displayId: 'istri_tanggalLahir_display'  }
  ];

  birthDateFields.forEach(field => {
    const display = document.getElementById(field.displayId);
    if (display) {
      display.addEventListener('click', () => openDatePicker(field.hiddenId, 'lahir'));
      display.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' || e.key === ' ') openDatePicker(field.hiddenId, 'lahir');
      });
    }
  });

  // Tanggal akad nikah (bisa masa depan, icon berbeda)
  const akadDisplay = document.getElementById('tgl_akad_display');
  if (akadDisplay) {
    akadDisplay.addEventListener('click', () => openDatePicker('tgl_akad', 'akad'));
    akadDisplay.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' || e.key === ' ') openDatePicker('tgl_akad', 'akad');
    });
  }
}

/**
 * Buka custom date picker
 * @param {string} hiddenId - ID hidden input yang menyimpan nilai YYYY-MM-DD
 * @param {string} mode     - 'lahir' (masa lalu, min usia 17) | 'akad' (masa depan)
 */
function openDatePicker(hiddenId, mode) {
  // Tutup picker yang sudah terbuka
  const existing = document.getElementById('customDatePickerOverlay');
  if (existing) existing.remove();

  const hidden     = document.getElementById(hiddenId);
  const currentVal = hidden.value; // "YYYY-MM-DD" or ""

  const today       = new Date();
  const currentYear = today.getFullYear();

  let selYear, selMonth, selDay, minYear, maxYear;

  if (mode === 'akad') {
    // Akad nikah: default ke hari ini, boleh pilih masa depan (5 tahun ke depan)
    selYear  = currentVal ? parseInt(currentVal.split('-')[0]) : currentYear;
    selMonth = currentVal ? parseInt(currentVal.split('-')[1]) - 1 : today.getMonth();
    selDay   = currentVal ? parseInt(currentVal.split('-')[2]) : today.getDate();
    minYear  = currentYear;
    maxYear  = currentYear + 5;
  } else {
    // Tanggal lahir: max = currentYear - 17
    selYear  = currentVal ? parseInt(currentVal.split('-')[0]) : currentYear - 25;
    selMonth = currentVal ? parseInt(currentVal.split('-')[1]) - 1 : today.getMonth();
    selDay   = currentVal ? parseInt(currentVal.split('-')[2]) : today.getDate();
    minYear  = 1930;
    maxYear  = currentYear - 17;
  }

  // Buat overlay
  const overlay = document.createElement('div');
  overlay.id = 'customDatePickerOverlay';
  overlay.style.cssText = `
    position: fixed; top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0,0,0,0.5); z-index: 9999;
    display: flex; align-items: center; justify-content: center;
    padding: 20px;
  `;

  const picker = document.createElement('div');
  picker.style.cssText = `
    background: #fff; border-radius: 16px; padding: 24px;
    width: 100%; max-width: 340px; box-shadow: 0 20px 60px rgba(0,0,0,0.3);
    color: #111; font-family: 'Segoe UI', sans-serif;
  `;

  const judulPicker = mode === 'akad' ? 'Pilih Tanggal Akad Nikah' : 'Pilih Tanggal Lahir';
  const subtitlePicker = mode === 'akad'
    ? 'Pilih hari rencana akad nikah'
    : 'Pilih tahun, bulan, lalu tanggal';

  function renderPicker() {
    const bulanIndo = ['Januari','Februari','Maret','April','Mei','Juni',
                       'Juli','Agustus','September','Oktober','November','Desember'];
    const daysInMonth = new Date(selYear, selMonth + 1, 0).getDate();
    if (selDay > daysInMonth) selDay = daysInMonth;

    // Buat array tahun
    const years = [];
    if (mode === 'akad') {
      for (let y = minYear; y <= maxYear; y++) years.push(y);
    } else {
      for (let y = maxYear; y >= minYear; y--) years.push(y);
    }

    // Header warna berbeda untuk akad
    const headerColor = mode === 'akad' ? '#7c3aed' : '#15803d';
    const headerBorder = mode === 'akad' ? '#ddd6fe' : '#bbf7d0';
    const headerBg     = mode === 'akad' ? '#f5f3ff' : '#f0fdf4';
    const confirmBg    = mode === 'akad'
      ? 'linear-gradient(135deg,#7c3aed,#6d28d9)'
      : 'linear-gradient(135deg,#16a34a,#15803d)';

    picker.innerHTML = `
      <div style="text-align:center; margin-bottom:16px;">
        <div style="font-size:15px; font-weight:700; color:${headerColor}; margin-bottom:4px;">${judulPicker}</div>
        <div style="font-size:13px; color:#6b7280;">${subtitlePicker}</div>
      </div>

      <!-- TAHUN & BULAN -->
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:14px;">
        <div>
          <label style="display:block; font-size:12px; font-weight:600; color:#374151; margin-bottom:4px;">Tahun</label>
          <select id="dp_year" style="width:100%; padding:10px 8px; border:2px solid ${headerBorder}; border-radius:8px; font-size:15px; color:#111; background:#fff; -webkit-appearance:auto;">
            ${years.map(y => `<option value="${y}" ${y === selYear ? 'selected' : ''}>${y}</option>`).join('')}
          </select>
        </div>
        <div>
          <label style="display:block; font-size:12px; font-weight:600; color:#374151; margin-bottom:4px;">Bulan</label>
          <select id="dp_month" style="width:100%; padding:10px 8px; border:2px solid ${headerBorder}; border-radius:8px; font-size:14px; color:#111; background:#fff; -webkit-appearance:auto;">
            ${bulanIndo.map((b, i) => `<option value="${i}" ${i === selMonth ? 'selected' : ''}>${b}</option>`).join('')}
          </select>
        </div>
      </div>

      <!-- GRID TANGGAL -->
      <div style="margin-bottom:16px;">
        <label style="display:block; font-size:12px; font-weight:600; color:#374151; margin-bottom:8px;">Tanggal</label>
        <div id="dp_days" style="display:grid; grid-template-columns:repeat(7,1fr); gap:4px;">
          ${['Min','Sen','Sel','Rab','Kam','Jum','Sab'].map((d, i) => {
            const color = i === 0 ? '#ef4444' : (i === 5 ? '#3b82f6' : '#9ca3af');
            return `<div style="text-align:center; font-size:11px; font-weight:600; color:${color}; padding:4px 0;">${d}</div>`;
          }).join('')}
          ${buildDayGrid(selYear, selMonth, selDay, headerColor, mode)}
        </div>
      </div>

      <!-- PREVIEW -->
      <div id="dp_preview" style="text-align:center; padding:10px; background:${headerBg}; border-radius:8px; margin-bottom:16px; font-size:14px; color:${headerColor}; font-weight:600;">
        ${getPreviewText(selYear, selMonth, selDay, bulanIndo, mode)}
      </div>

      <!-- TOMBOL -->
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
        <button id="dp_cancel" style="padding:12px; border:2px solid #e5e7eb; background:#fff; color:#374151; border-radius:8px; font-size:14px; font-weight:600; cursor:pointer;">Batal</button>
        <button id="dp_confirm" style="padding:12px; border:none; background:${confirmBg}; color:#fff; border-radius:8px; font-size:14px; font-weight:600; cursor:pointer;">Pilih</button>
      </div>
    `;

    // Event listeners
    picker.querySelector('#dp_year').addEventListener('change', (e) => {
      selYear = parseInt(e.target.value);
      renderPicker();
      attachDayListeners();
    });
    picker.querySelector('#dp_month').addEventListener('change', (e) => {
      selMonth = parseInt(e.target.value);
      renderPicker();
      attachDayListeners();
    });
    picker.querySelector('#dp_cancel').addEventListener('click', () => overlay.remove());
    picker.querySelector('#dp_confirm').addEventListener('click', () => {
      const mm = String(selMonth + 1).padStart(2, '0');
      const dd = String(selDay).padStart(2, '0');
      hidden.value = `${selYear}-${mm}-${dd}`;

      // Update display
      const displayId = hiddenId + '_display';
      const displayEl = document.getElementById(displayId);
      if (displayEl) {
        const bulanIndo2 = ['Januari','Februari','Maret','April','Mei','Juni',
                            'Juli','Agustus','September','Oktober','November','Desember'];
        // Untuk akad: tampilkan dengan nama hari
        if (mode === 'akad') {
          displayEl.querySelector('.date-display-text').textContent = formatTanggalDenganHari(`${selYear}-${mm}-${dd}`);
        } else {
          displayEl.querySelector('.date-display-text').textContent = `${selDay} ${bulanIndo2[selMonth]} ${selYear}`;
        }
        displayEl.classList.add('has-value');
        displayEl.style.color = '#111827';
        removeErrorStyling(displayEl);
        removeErrorStyling(hidden);
      }
      overlay.remove();
    });

    attachDayListeners();
  }

  function getPreviewText(year, month, day, bulanIndo, mode) {
    if (mode === 'akad') {
      const hariIndo = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];
      const d = new Date(Date.UTC(year, month, day));
      return `${hariIndo[d.getUTCDay()]}, ${day} ${bulanIndo[month]} ${year}`;
    }
    return `${day} ${bulanIndo[month]} ${year}`;
  }

  function buildDayGrid(year, month, activeDay, activeColor, mode) {
    const firstDay    = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today       = new Date();
    let html = '';

    // Empty cells sebelum hari pertama
    for (let i = 0; i < firstDay; i++) {
      html += '<div></div>';
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const isActive  = d === activeDay;
      const dayOfWeek = new Date(year, month, d).getDay();
      const isSunday  = dayOfWeek === 0;
      const isSaturday = dayOfWeek === 6;

      // Untuk akad: Jumat dan hari libur bisa ditandai berbeda (opsional)
      let textColor = '#374151';
      if (isSunday)   textColor = '#ef4444';
      if (isSaturday) textColor = '#3b82f6';
      if (isActive)   textColor = '#fff';

      html += `<button class="dp_day" data-day="${d}" style="
        padding:7px 2px; border:none; border-radius:6px; font-size:13px; cursor:pointer;
        font-weight:${isActive ? '700' : '400'};
        background:${isActive ? activeColor : 'transparent'};
        color:${textColor};
        transition: background 0.15s;
      ">${d}</button>`;
    }
    return html;
  }

  function attachDayListeners() {
    const activeColor = mode === 'akad' ? '#7c3aed' : '#15803d';
    const hoverColor  = mode === 'akad' ? '#ede9fe' : '#dcfce7';

    picker.querySelectorAll('.dp_day').forEach(btn => {
      btn.addEventListener('click', () => {
        selDay = parseInt(btn.dataset.day);
        renderPicker();
        attachDayListeners();
      });
      btn.addEventListener('mouseover', () => {
        if (parseInt(btn.dataset.day) !== selDay) {
          btn.style.background = hoverColor;
        }
      });
      btn.addEventListener('mouseout', () => {
        if (parseInt(btn.dataset.day) !== selDay) {
          btn.style.background = 'transparent';
        }
      });
    });
  }

  renderPicker();
  overlay.appendChild(picker);
  document.body.appendChild(overlay);

  // Tutup jika klik di luar
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.remove();
  });
}

// Validasi email format
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Validasi NIK (16 digit)
function validateNIK(nik) {
  return nik.length === 16 && /^\d+$/.test(nik);
}

// Validasi No Telp (10-13 digit)
function validateTelp(telp) {
  const len = telp.length;
  return len >= 10 && len <= 13 && /^\d+$/.test(telp);
}

// Initialize validation
document.addEventListener('DOMContentLoaded', function() {
  setupNumericValidation();
  setupCustomDatePickers();

  const inputs = document.querySelectorAll('input, textarea');
  inputs.forEach(input => {
    input.addEventListener('input', function() { removeErrorStyling(this); });
    input.addEventListener('change', function() { removeErrorStyling(this); });
  });

  document.getElementById('year').textContent = new Date().getFullYear();
});