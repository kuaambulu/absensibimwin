// ============================================
// KONFIGURASI APLIKASI
// ============================================

const CONFIG = {
  // URL Google Apps Script Web App
  // GANTI dengan URL deployment Apps Script Anda
  API_URL: 'https://script.google.com/macros/s/AKfycbyLVqQuDnMuu0XxJTt5GdVq6KlOrAQnftxSShFTjRPUtYADFTRFhmuC1lFFJHgjIIpi/exec',
  
  // Environment
  MODE: 'production', // 'development' atau 'production'
  
  // Validasi
  VALIDATION: {
    NIK_LENGTH: 16,
    TELP_MIN: 10,
    TELP_MAX: 13
  },
  
  // Pesan
  MESSAGES: {
    SUCCESS: 'Data berhasil disimpan! Terima kasih atas partisipasinya.',
    ERROR: 'Terjadi kesalahan saat mengirim data. Silakan coba lagi.',
    LOADING: 'Mengirim data, mohon tunggu...',
    RATE_LIMIT: 'Terlalu banyak percobaan. Silakan coba lagi nanti.'
  },
  
  // Timeout (ms)
  TIMEOUT: 30000, // 30 detik
  
  // Debug mode
  DEBUG: false
};

// Log configuration in development mode
if (CONFIG.MODE === 'development' && CONFIG.DEBUG) {
  console.log('App Configuration:', CONFIG);
}

// Freeze config untuk prevent modification
Object.freeze(CONFIG);
