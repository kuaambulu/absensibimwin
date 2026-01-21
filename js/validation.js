// ============================================
// FORM VALIDATION
// ============================================

// Format tanggal ke Bahasa Indonesia
function formatTanggalIndonesia(dateString) {
  const bulanIndo = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  
  const date = new Date(dateString);
  const tanggal = date.getDate();
  const bulan = bulanIndo[date.getMonth()];
  const tahun = date.getFullYear();
  
  return `${tanggal} ${bulan} ${tahun}`;
}

// Check form validity
function checkFormValidity() {
  const suamiValid = 
    document.getElementById('suami_namaLengkap').value &&
    document.getElementById('suami_tempatLahir').value &&
    document.getElementById('suami_tanggalLahir').value &&
    document.getElementById('suami_alamatLengkap').value &&
    document.getElementById('suami_nik').value &&
    document.getElementById('suami_noTelp').value &&
    document.getElementById('suami_email').value &&
    !suamiSignature.isEmpty();

  const istriValid = 
    document.getElementById('istri_namaLengkap').value &&
    document.getElementById('istri_tempatLahir').value &&
    document.getElementById('istri_tanggalLahir').value &&
    document.getElementById('istri_alamatLengkap').value &&
    document.getElementById('istri_nik').value &&
    document.getElementById('istri_noTelp').value &&
    document.getElementById('istri_email').value &&
    !istriSignature.isEmpty();

  const submitBtn = document.getElementById('submitBtn');
  submitBtn.disabled = !(suamiValid && istriValid);
}

// Validasi numeric only untuk NIK dan No Telp
function setupNumericValidation() {
  const numericFields = [
    'suami_nik', 'suami_noTelp',
    'istri_nik', 'istri_noTelp'
  ];

  numericFields.forEach(fieldId => {
    const field = document.getElementById(fieldId);
    
    // Filter input - hanya angka
    field.addEventListener('input', function(e) {
      this.value = this.value.replace(/[^0-9]/g, '');
      checkFormValidity();
    });

    // Prevent paste non-numeric
    field.addEventListener('paste', function(e) {
      e.preventDefault();
      const pastedText = (e.clipboardData || window.clipboardData).getData('text');
      const numericOnly = pastedText.replace(/[^0-9]/g, '');
      this.value = numericOnly;
      checkFormValidity();
    });

    // Prevent non-numeric keypress
    field.addEventListener('keypress', function(e) {
      const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'];
      if (e.key && !/[0-9]/.test(e.key) && !allowedKeys.includes(e.key)) {
        e.preventDefault();
      }
    });
  });
}

// Validasi email format
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Validasi NIK (16 digit)
function validateNIK(nik) {
  return nik.length === CONFIG.VALIDATION.NIK_LENGTH && /^\d+$/.test(nik);
}

// Validasi No Telp (10-13 digit)
function validateTelp(telp) {
  const len = telp.length;
  return len >= CONFIG.VALIDATION.TELP_MIN && 
         len <= CONFIG.VALIDATION.TELP_MAX && 
         /^\d+$/.test(telp);
}

// Initialize validation
document.addEventListener('DOMContentLoaded', function() {
  // Setup numeric validation
  setupNumericValidation();
  
  // Add input listeners untuk semua field
  const inputs = document.querySelectorAll('input, textarea');
  inputs.forEach(input => {
    input.addEventListener('input', checkFormValidity);
    input.addEventListener('change', checkFormValidity);
  });
  
  // Set current year di footer
  document.getElementById('year').textContent = new Date().getFullYear();
});
