// ============================================
// KONFIGURASI APLIKASI — BETA
// ============================================
// PENTING: API_URL di bawah ini HARUS menunjuk ke deployment Apps Script
// yang terhubung ke SPREADSHEET BARU (khusus percobaan), BUKAN spreadsheet
// produksi. Lihat beta/backend/Code.gs untuk kode backend-nya.

const CONFIG = {
  // GANTI dengan URL deployment Web App Apps Script BETA Anda
  API_URL: 'https://script.google.com/macros/s/AKfycbxC8B9zjAkrXTcsU_JkPdlujaYGXWPXyo5j8DskZfrpLx7RT_YsQncAwHUmBDs6M9d-Lw/exec',

  // Environment
  MODE: 'development', // dibuat 'development' selama tahap uji coba beta

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

  // Debug mode — aktifkan dulu selama beta supaya console.log muncul untuk debugging
  DEBUG: true
};

// Log configuration in development mode
if (CONFIG.MODE === 'development' && CONFIG.DEBUG) {
  console.log('[BETA] App Configuration:', CONFIG);
}

// Freeze config untuk prevent modification
Object.freeze(CONFIG);