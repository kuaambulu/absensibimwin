// ============================================
// SIGNATURE CANVAS HANDLER
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
    // Set canvas size
    const rect = this.canvas.getBoundingClientRect();
    this.canvas.width = rect.width * 2;
    this.canvas.height = rect.height * 2;
    this.ctx.scale(2, 2);
    
    // Set drawing style
    this.ctx.strokeStyle = '#000';
    this.ctx.lineWidth = 2;
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
    
    // Add event listeners
    this.addEventListeners();
  }
  
  addEventListeners() {
    // Mouse events
    this.canvas.addEventListener('mousedown', (e) => this.startDrawing(e));
    this.canvas.addEventListener('mousemove', (e) => this.draw(e));
    this.canvas.addEventListener('mouseup', () => this.stopDrawing());
    this.canvas.addEventListener('mouseleave', () => this.stopDrawing());
    
    // Touch events
    this.canvas.addEventListener('touchstart', (e) => this.startDrawing(e));
    this.canvas.addEventListener('touchmove', (e) => this.draw(e));
    this.canvas.addEventListener('touchend', () => this.stopDrawing());
  }
  
  startDrawing(e) {
    this.isDrawing = true;
    const rect = this.canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches[0].clientX) - rect.left;
    const y = (e.clientY || e.touches[0].clientY) - rect.top;
    
    this.ctx.beginPath();
    this.ctx.moveTo(x, y);
  }
  
  draw(e) {
    if (!this.isDrawing) return;
    
    e.preventDefault();
    const rect = this.canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches[0].clientX) - rect.left;
    const y = (e.clientY || e.touches[0].clientY) - rect.top;
    
    this.ctx.lineTo(x, y);
    this.ctx.stroke();
    this.hasSignature = true;
  }
  
  stopDrawing() {
    this.isDrawing = false;
  }
  
  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
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
  
  // Remove error styling jika ada
  const canvas = type === 'suami' ? 
    document.getElementById('suamiSignatureCanvas') : 
    document.getElementById('istriSignatureCanvas');
  
  if (canvas) {
    canvas.style.border = '';
    canvas.style.boxShadow = '';
  }
}
