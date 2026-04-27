/* ============================================
   SIGNATURE.JS — Canvas Signature Pad
   KUA Ambulu Biodata Form
   ============================================ */

'use strict';

/**
 * State tanda tangan per orang.
 * Kunci: 'suami' | 'istri'
 */
const signaturePads = {};

/**
 * Inisialisasi signature pad pada canvas.
 * @param {string} who - 'suami' | 'istri'
 */
function initSignature(who) {
  const canvas      = document.getElementById('canvas_' + who);
  const wrap        = document.getElementById('ttd-wrap-' + who);
  const placeholder = document.getElementById('placeholder_' + who);

  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  // Atur resolusi canvas sesuai DPR untuk tampilan tajam di Retina
  function resizeCanvas() {
    const dpr  = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width  = rect.width  * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    ctx.strokeStyle = '#1a2a1f';
    ctx.lineWidth   = 2.2;
    ctx.lineCap     = 'round';
    ctx.lineJoin    = 'round';
  }

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  const state = {
    drawing: false,
    hasDrawing: false,
    lastX: 0,
    lastY: 0,
    ctx,
    canvas,
    wrap,
    placeholder
  };

  signaturePads[who] = state;

  // ---- Helper: koordinat relatif ke canvas ----
  function getPos(e) {
    const rect = canvas.getBoundingClientRect();
    const src  = e.touches ? e.touches[0] : e;
    return {
      x: src.clientX - rect.left,
      y: src.clientY - rect.top
    };
  }

  // ---- Event: mulai menggambar ----
  function onStart(e) {
    e.preventDefault();
    state.drawing = true;
    const pos = getPos(e);
    state.lastX = pos.x;
    state.lastY = pos.y;
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    wrap.classList.add('active');
    placeholder.classList.add('hidden');
  }

  // ---- Event: gerakan menggambar ----
  function onMove(e) {
    if (!state.drawing) return;
    e.preventDefault();
    const pos = getPos(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    state.lastX = pos.x;
    state.lastY = pos.y;
    state.hasDrawing = true;
  }

  // ---- Event: selesai menggambar ----
  function onEnd(e) {
    if (!state.drawing) return;
    e.preventDefault();
    state.drawing = false;
    ctx.beginPath();
    wrap.classList.remove('active');
  }

  // Mouse events
  canvas.addEventListener('mousedown',  onStart);
  canvas.addEventListener('mousemove',  onMove);
  canvas.addEventListener('mouseup',    onEnd);
  canvas.addEventListener('mouseleave', onEnd);

  // Touch events
  canvas.addEventListener('touchstart', onStart, { passive: false });
  canvas.addEventListener('touchmove',  onMove,  { passive: false });
  canvas.addEventListener('touchend',   onEnd,   { passive: false });
}

/**
 * Hapus tanda tangan pada canvas.
 * @param {string} who - 'suami' | 'istri'
 */
function clearSignature(who) {
  const state = signaturePads[who];
  if (!state) return;

  const { ctx, canvas, wrap, placeholder } = state;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  state.hasDrawing = false;
  wrap.classList.remove('error');
  placeholder.classList.remove('hidden');
}

/**
 * Ambil data tanda tangan sebagai base64 PNG.
 * @param {string} who - 'suami' | 'istri'
 * @returns {string|null} - base64 PNG string, atau null jika kosong
 */
function getSignatureData(who) {
  const state = signaturePads[who];
  if (!state || !state.hasDrawing) return null;
  return state.canvas.toDataURL('image/png');
}

/**
 * Cek apakah tanda tangan sudah diisi.
 * @param {string} who - 'suami' | 'istri'
 * @returns {boolean}
 */
function hasSignature(who) {
  return !!(signaturePads[who] && signaturePads[who].hasDrawing);
}

// Inisialisasi saat halaman siap
document.addEventListener('DOMContentLoaded', () => {
  initSignature('suami');
  initSignature('istri');
});
