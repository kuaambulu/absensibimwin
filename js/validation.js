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

// Check form validity - TIDAK lagi disable button
function checkFormValidity() {
  // Tombol selalu enabled - validasi akan dilakukan saat submit
  const submitBtn = document.getElementById('submitBtn');
  submitBtn.disabled = false;
}

// Validasi dan scroll ke field yang kosong
function validateAndScrollToError() {
  const errors = [];
  
  // Validasi SUAMI
  if (!document.getElementById('suami_namaLengkap').value.trim()) {
    errors.push({
      element: document.getElementById('suami_namaLengkap'),
      message: 'Nama Lengkap Calon Suami harus diisi'
    });
  }
  
  if (!document.getElementById('suami_tempatLahir').value.trim()) {
    errors.push({
      element: document.getElementById('suami_tempatLahir'),
      message: 'Tempat Lahir Calon Suami harus diisi'
    });
  }
  
  if (!document.getElementById('suami_tanggalLahir').value) {
    errors.push({
      element: document.getElementById('suami_tanggalLahir'),
      message: 'Tanggal Lahir Calon Suami harus diisi'
    });
  }
  
  if (!document.getElementById('suami_alamatLengkap').value.trim()) {
    errors.push({
      element: document.getElementById('suami_alamatLengkap'),
      message: 'Alamat Lengkap Calon Suami harus diisi'
    });
  }
  
  if (!document.getElementById('suami_nik').value.trim()) {
    errors.push({
      element: document.getElementById('suami_nik'),
      message: 'NIK Calon Suami harus diisi'
    });
  } else if (!validateNIK(document.getElementById('suami_nik').value.trim())) {
    errors.push({
      element: document.getElementById('suami_nik'),
      message: 'NIK Calon Suami harus 16 digit angka'
    });
  }
  
  if (!document.getElementById('suami_noTelp').value.trim()) {
    errors.push({
      element: document.getElementById('suami_noTelp'),
      message: 'No. Telp/HP Calon Suami harus diisi'
    });
  } else if (!validateTelp(document.getElementById('suami_noTelp').value.trim())) {
    errors.push({
      element: document.getElementById('suami_noTelp'),
      message: 'No. Telp/HP Calon Suami harus 10-13 digit angka'
    });
  }
  
  if (!document.getElementById('suami_email').value.trim()) {
    errors.push({
      element: document.getElementById('suami_email'),
      message: 'Email Calon Suami harus diisi'
    });
  } else if (!validateEmail(document.getElementById('suami_email').value.trim())) {
    errors.push({
      element: document.getElementById('suami_email'),
      message: 'Format email Calon Suami tidak valid'
    });
  }
  
  if (suamiSignature.isEmpty()) {
    errors.push({
      element: document.getElementById('suamiSignatureCanvas'),
      message: 'Tanda Tangan Calon Suami harus diisi'
    });
  }
  
  // Validasi ISTRI
  if (!document.getElementById('istri_namaLengkap').value.trim()) {
    errors.push({
      element: document.getElementById('istri_namaLengkap'),
      message: 'Nama Lengkap Calon Istri harus diisi'
    });
  }
  
  if (!document.getElementById('istri_tempatLahir').value.trim()) {
    errors.push({
      element: document.getElementById('istri_tempatLahir'),
      message: 'Tempat Lahir Calon Istri harus diisi'
    });
  }
  
  if (!document.getElementById('istri_tanggalLahir').value) {
    errors.push({
      element: document.getElementById('istri_tanggalLahir'),
      message: 'Tanggal Lahir Calon Istri harus diisi'
    });
  }
  
  if (!document.getElementById('istri_alamatLengkap').value.trim()) {
    errors.push({
      element: document.getElementById('istri_alamatLengkap'),
      message: 'Alamat Lengkap Calon Istri harus diisi'
    });
  }
  
  if (!document.getElementById('istri_nik').value.trim()) {
    errors.push({
      element: document.getElementById('istri_nik'),
      message: 'NIK Calon Istri harus diisi'
    });
  } else if (!validateNIK(document.getElementById('istri_nik').value.trim())) {
    errors.push({
      element: document.getElementById('istri_nik'),
      message: 'NIK Calon Istri harus 16 digit angka'
    });
  }
  
  if (!document.getElementById('istri_noTelp').value.trim()) {
    errors.push({
      element: document.getElementById('istri_noTelp'),
      message: 'No. Telp/HP Calon Istri harus diisi'
    });
  } else if (!validateTelp(document.getElementById('istri_noTelp').value.trim())) {
    errors.push({
      element: document.getElementById('istri_noTelp'),
      message: 'No. Telp/HP Calon Istri harus 10-13 digit angka'
    });
  }
  
  if (!document.getElementById('istri_email').value.trim()) {
    errors.push({
      element: document.getElementById('istri_email'),
      message: 'Email Calon Istri harus diisi'
    });
  } else if (!validateEmail(document.getElementById('istri_email').value.trim())) {
    errors.push({
      element: document.getElementById('istri_email'),
      message: 'Format email Calon Istri tidak valid'
    });
  }
  
  if (istriSignature.isEmpty()) {
    errors.push({
      element: document.getElementById('istriSignatureCanvas'),
      message: 'Tanda Tangan Calon Istri harus diisi'
    });
  }
  
  // Jika ada error, tampilkan dan scroll ke field pertama yang error
  if (errors.length > 0) {
    const firstError = errors[0];
    
    // Highlight field yang error
    firstError.element.style.border = '2px solid #ef4444';
    firstError.element.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
    
    // Focus ke element
    firstError.element.focus();
    
    // Scroll smooth ke element
    firstError.element.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'center' 
    });
    
    // Tampilkan alert dengan semua error
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
      firstError.element.style.border = '';
      firstError.element.style.boxShadow = '';
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
  const numericFields = [
    'suami_nik', 'suami_noTelp',
    'istri_nik', 'istri_noTelp'
  ];

  numericFields.forEach(fieldId => {
    const field = document.getElementById(fieldId);
    
    // Filter input - hanya angka
    field.addEventListener('input', function(e) {
      this.value = this.value.replace(/[^0-9]/g, '');
      removeErrorStyling(this);
    });

    // Prevent paste non-numeric
    field.addEventListener('paste', function(e) {
      e.preventDefault();
      const pastedText = (e.clipboardData || window.clipboardData).getData('text');
      const numericOnly = pastedText.replace(/[^0-9]/g, '');
      this.value = numericOnly;
      removeErrorStyling(this);
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
  return nik.length === 16 && /^\d+$/.test(nik);
}

// Validasi No Telp (10-13 digit)
function validateTelp(telp) {
  const len = telp.length;
  return len >= 10 && len <= 13 && /^\d+$/.test(telp);
}

// Initialize validation
document.addEventListener('DOMContentLoaded', function() {
  // Setup numeric validation
  setupNumericValidation();
  
  // Add input listeners untuk remove error styling
  const inputs = document.querySelectorAll('input, textarea');
  inputs.forEach(input => {
    input.addEventListener('input', function() {
      removeErrorStyling(this);
    });
    input.addEventListener('change', function() {
      removeErrorStyling(this);
    });
  });
  
  // Set current year di footer
  document.getElementById('year').textContent = new Date().getFullYear();
});
