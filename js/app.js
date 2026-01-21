// ============================================
// MAIN APPLICATION LOGIC
// ============================================

// Submit form handler
document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('absensiForm');
  
  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Validasi final
    if (!validateFinalForm()) {
      alert('Mohon lengkapi semua data dengan benar.');
      return;
    }
    
    // Collect form data
    const formData = collectFormData();
    
    // Debug log
    if (CONFIG.DEBUG) {
      console.log('Form Data:', formData);
    }
    
    // Show loading
    showLoading(true);
    disableSubmitButton(true);
    
    try {
      // Send to Google Apps Script
      const response = await submitToGoogleScript(formData);
      
      // Handle success
      handleSubmitSuccess(response);
      
    } catch (error) {
      // Handle error
      handleSubmitError(error);
    }
  });
});

// Collect all form data
function collectFormData() {
  return {
    suami: {
      namaLengkap: document.getElementById('suami_namaLengkap').value.trim(),
      tempatLahir: document.getElementById('suami_tempatLahir').value.trim(),
      tanggalLahir: formatTanggalIndonesia(document.getElementById('suami_tanggalLahir').value),
      alamatLengkap: document.getElementById('suami_alamatLengkap').value.trim(),
      nik: document.getElementById('suami_nik').value.trim(),
      noTelp: document.getElementById('suami_noTelp').value.trim(),
      email: document.getElementById('suami_email').value.trim().toLowerCase(),
      tandaTangan: suamiSignature.toDataURL()
    },
    istri: {
      namaLengkap: document.getElementById('istri_namaLengkap').value.trim(),
      tempatLahir: document.getElementById('istri_tempatLahir').value.trim(),
      tanggalLahir: formatTanggalIndonesia(document.getElementById('istri_tanggalLahir').value),
      alamatLengkap: document.getElementById('istri_alamatLengkap').value.trim(),
      nik: document.getElementById('istri_nik').value.trim(),
      noTelp: document.getElementById('istri_noTelp').value.trim(),
      email: document.getElementById('istri_email').value.trim().toLowerCase(),
      tandaTangan: istriSignature.toDataURL()
    },
    timestamp: new Date().toISOString()
  };
}

// Final validation before submit
function validateFinalForm() {
  // Validasi email
  const suamiEmail = document.getElementById('suami_email').value;
  const istriEmail = document.getElementById('istri_email').value;
  
  if (!validateEmail(suamiEmail) || !validateEmail(istriEmail)) {
    alert('Format email tidak valid. Pastikan email mengandung @ dan domain.');
    return false;
  }
  
  // Validasi NIK
  const suamiNIK = document.getElementById('suami_nik').value;
  const istriNIK = document.getElementById('istri_nik').value;
  
  if (!validateNIK(suamiNIK) || !validateNIK(istriNIK)) {
    alert('NIK harus 16 digit angka.');
    return false;
  }
  
  // Validasi No Telp
  const suamiTelp = document.getElementById('suami_noTelp').value;
  const istriTelp = document.getElementById('istri_noTelp').value;
  
  if (!validateTelp(suamiTelp) || !validateTelp(istriTelp)) {
    alert('Nomor telepon harus 10-13 digit angka.');
    return false;
  }
  
  // Validasi signature
  if (suamiSignature.isEmpty() || istriSignature.isEmpty()) {
    alert('Tanda tangan calon suami dan istri harus diisi.');
    return false;
  }
  
  return true;
}

// Submit to Google Apps Script
async function submitToGoogleScript(formData) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), CONFIG.TIMEOUT);
  
  try {
    const response = await fetch(CONFIG.API_URL, {
      method: 'POST',
      mode: 'no-cors', // Required untuk CORS dengan Apps Script
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    // Note: mode 'no-cors' tidak bisa membaca response
    // Jadi kita asumsikan sukses jika tidak ada error
    return { success: true };
    
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error.name === 'AbortError') {
      throw new Error('Request timeout. Silakan coba lagi.');
    }
    
    throw error;
  }
}

// Handle submit success
function handleSubmitSuccess(response) {
  showLoading(false);
  
  // Show success message
  const successMsg = document.getElementById('successMessage');
  successMsg.classList.add('active');
  
  // Reset form
  document.getElementById('absensiForm').reset();
  suamiSignature.clear();
  istriSignature.clear();
  
  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
  
  // Hide success message after 5 seconds
  setTimeout(() => {
    successMsg.classList.remove('active');
    disableSubmitButton(false);
  }, 5000);
  
  // Log success
  if (CONFIG.DEBUG) {
    console.log('Submit success:', response);
  }
}

// Handle submit error
function handleSubmitError(error) {
  showLoading(false);
  disableSubmitButton(false);
  
  console.error('Submit error:', error);
  
  let errorMessage = CONFIG.MESSAGES.ERROR;
  
  if (error.message) {
    errorMessage += '\n\nDetail: ' + error.message;
  }
  
  alert(errorMessage);
}

// Show/hide loading indicator
function showLoading(show) {
  const loading = document.getElementById('loading');
  if (show) {
    loading.classList.add('active');
  } else {
    loading.classList.remove('active');
  }
}

// Enable/disable submit button
function disableSubmitButton(disable) {
  const submitBtn = document.getElementById('submitBtn');
  submitBtn.disabled = disable;
}

// Log app initialization
if (CONFIG.DEBUG) {
  console.log('Absensi Digital KUA Ambulu - Initialized');
  console.log('Environment:', CONFIG.MODE);
  console.log('API URL:', CONFIG.API_URL);
}
