// ============================================
// SIGNATURE CANVAS HANDLER - FIXED VERSION
// ============================================

class SignatureCanvas {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.isDrawing = false;
    this.hasSignature = false;
    
    this.init();
  }
  
  init() {
    this.resize();
    this.addEventListeners();
    
    // Re-init after fonts/images load
    window.addEventListener('load', () => this.resize());
    window.addEventListener('resize', () => this.resize());
  }
  
  resize() {
    // Save existing drawing
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    tempCanvas.width = this.canvas.width;
    tempCanvas.height = this.canvas.height;
    tempCtx.drawImage(this.canvas, 0, 0);
    
    // Get actual rendered size
    const rect = this.canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    
    const displayWidth = rect.width || 300;
    const displayHeight = rect.height || 200;
    
    this.canvas.width = displayWidth * dpr;
    this.canvas.height = displayHeight * dpr;
    
    this.ctx.scale(dpr, dpr);
    
    // FIX: Bersihkan area agar menjadi transparan
    this.ctx.clearRect(0, 0, displayWidth, displayHeight);
    
    // Set drawing style
    this.ctx.strokeStyle = '#000000';
    this.ctx.lineWidth = 2;
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
    
    // Restore previous drawing jika ada
    if (this.hasSignature && tempCanvas.width > 0 && tempCanvas.height > 0) {
      this.ctx.drawImage(tempCanvas, 0, 0, displayWidth, displayHeight);
    }
  }
  
  addEventListeners() {
    // Mouse events
    this.canvas.addEventListener('mousedown', (e) => this.startDrawing(e));
    this.canvas.addEventListener('mousemove', (e) => this.draw(e));
    this.canvas.addEventListener('mouseup', () => this.stopDrawing());
    this.canvas.addEventListener('mouseleave', () => this.stopDrawing());
    
    // Touch events
    this.canvas.addEventListener('touchstart', (e) => { e.preventDefault(); this.startDrawing(e); }, { passive: false });
    this.canvas.addEventListener('touchmove', (e) => { e.preventDefault(); this.draw(e); }, { passive: false });
    this.canvas.addEventListener('touchend', () => this.stopDrawing());
  }
  
  getPos(e) {
    const rect = this.canvas.getBoundingClientRect();
    if (e.touches && e.touches.length > 0) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top
      };
    }
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  }
  
  startDrawing(e) {
    this.isDrawing = true;
    const pos = this.getPos(e);
    this.ctx.beginPath();
    this.ctx.moveTo(pos.x, pos.y);
  }
  
  draw(e) {
    if (!this.isDrawing) return;
    const pos = this.getPos(e);
    this.ctx.lineTo(pos.x, pos.y);
    this.ctx.stroke();
    this.hasSignature = true;
    
    // Hapus error styling saat mulai menggambar
    this.canvas.classList.remove('error');
    this.canvas.style.border = '';
    this.canvas.style.boxShadow = '';
  }
  
  stopDrawing() {
    this.isDrawing = false;
  }
  
  clear() {
    const rect = this.canvas.getBoundingClientRect();
    const displayWidth = rect.width || this.canvas.width;
    const displayHeight = rect.height || this.canvas.height;
    
    // FIX: Bersihkan kanvas kembali menjadi transparan
    this.ctx.clearRect(0, 0, displayWidth, displayHeight);
    this.hasSignature = false;
  }
  
  isEmpty() {
    return !this.hasSignature;
  }
  
  toDataURL() {
    return this.canvas.toDataURL('image/png');
  }
}

// Initialize signature canvases
let suamiSignature, istriSignature;

document.addEventListener('DOMContentLoaded', function() {
  suamiSignature = new SignatureCanvas('suamiSignatureCanvas');
  istriSignature = new SignatureCanvas('istriSignatureCanvas');
});

// Clear signature function (called from HTML)
function clearSignature(type) {
  if (type === 'suami') {
    suamiSignature.clear();
  } else if (type === 'istri') {
    istriSignature.clear();
  }
  
  // Remove error styling
  const canvas = type === 'suami' ? 
    document.getElementById('suamiSignatureCanvas') : 
    document.getElementById('istriSignatureCanvas');
  
  if (canvas) {
    canvas.classList.remove('error');
    canvas.style.border = '';
    canvas.style.boxShadow = '';
  }
}
