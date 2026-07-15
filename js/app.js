// ============================================
// MAIN APPLICATION LOGIC
// ============================================

document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('absensiForm');
  
  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    if (!validateAndScrollToError()) {
      return;
    }
    
    const formData = collectFormData();
    
    if (CONFIG.DEBUG) {
      console.log('Form Data:', formData);
    }
    
    showLoading(true);
    disableSubmitButton(true);
    
    try {
      const response = await submitToGoogleScript(formData);
      handleSubmitSuccess(response);
    } catch (error) {
      handleSubmitError(error);
    }
  });
});

// Collect all form data
function collectFormData() {
  return {
    tanggalAkad: formatTanggalDenganHari(document.getElementById('tgl_akad').value),
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

// Submit to Google Apps Script
async function submitToGoogleScript(formData) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), CONFIG.TIMEOUT);
  
  try {
    // BUG FIX: Gunakan URLSearchParams agar tidak kena blokir CORS oleh GAS
    const params = new URLSearchParams();
    params.append('data', JSON.stringify(formData));

    const response = await fetch(CONFIG.API_URL, {
      method: 'POST',
      mode: 'no-cors', // Penting agar tidak ada preflight
      body: params,    // Kirim sebagai form-encoded, BUKAN json
      signal: controller.signal
      // Header Content-Type dihapus!
    });
    
    clearTimeout(timeoutId);
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
  
  // Ambil nama suami & istri sebelum form di-reset
  const namaS = document.getElementById('suami_namaLengkap').value.trim();
  const namaI = document.getElementById('istri_namaLengkap').value.trim();
  
  // Reset form
  document.getElementById('absensiForm').reset();
  suamiSignature.clear();
  istriSignature.clear();
  
  // Reset custom date picker displays
  const dateDisplays = ['suami_tanggalLahir_display', 'istri_tanggalLahir_display'];
  dateDisplays.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      const textEl = el.querySelector('.date-display-text');
      if (textEl) textEl.textContent = 'Pilih tanggal lahir';
      el.classList.remove('has-value');
      el.style.color = '#9ca3af';
    }
  });
  
  disableSubmitButton(false);
  
  // Isi data ke halaman sukses
  const now = new Date();
  const hariIndo = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];
  const bulanIndo = ['Januari','Februari','Maret','April','Mei','Juni',
                     'Juli','Agustus','September','Oktober','November','Desember'];
  const waktuStr = hariIndo[now.getDay()] + ', ' +
                   now.getDate() + ' ' + bulanIndo[now.getMonth()] + ' ' + now.getFullYear() +
                   ' — ' +
                   String(now.getHours()).padStart(2,'0') + ':' +
                   String(now.getMinutes()).padStart(2,'0') + ':' +
                   String(now.getSeconds()).padStart(2,'0') + ' WIB';
  
  // Cek apakah halaman sukses tersedia di DOM
  const sp = document.getElementById('successPage');

  if (sp) {
    // Halaman sukses ada — isi dan tampilkan
    const elWaktu  = document.getElementById('buktiWaktu');
    const elSuami  = document.getElementById('bukti_suami_nama');
    const elIstri  = document.getElementById('bukti_istri_nama');
    const elYear   = document.getElementById('buktiYear');

    if (elWaktu)  elWaktu.textContent  = waktuStr;
    if (elSuami)  elSuami.textContent  = namaS;
    if (elIstri)  elIstri.textContent  = namaI;
    if (elYear)   elYear.textContent   = now.getFullYear();

    document.querySelector('.container').style.display = 'none';
    sp.style.display = 'flex';
    window.scrollTo({ top: 0, behavior: 'smooth' });

  } else {
    // Fallback: index.html belum diupdate — tampilkan pesan sukses biasa
    const successMsg = document.getElementById('successMessage');
    if (successMsg) {
      successMsg.innerHTML = '&#10003; Data berhasil disimpan! (' + waktuStr + ')<br>Calon Suami: <strong>' + namaS + '</strong> &nbsp;|&nbsp; Calon Istri: <strong>' + namaI + '</strong>';
      successMsg.classList.add('active');
    } else {
      alert('Data berhasil disimpan!\n\nWaktu: ' + waktuStr + '\nCalon Suami: ' + namaS + '\nCalon Istri: ' + namaI);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  
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
  if (disable) {
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.6';
    submitBtn.style.cursor = 'not-allowed';
  } else {
    submitBtn.disabled = false;
    submitBtn.style.opacity = '';
    submitBtn.style.cursor = '';
  }
}

if (CONFIG.DEBUG) {
  console.log('Absensi Digital KUA Ambulu - Initialized');
  console.log('Environment:', CONFIG.MODE);
  console.log('API URL:', CONFIG.API_URL);
}
