/* ── circles.js — Animated floating circles background ── */

const canvas = document.getElementById('bg-canvas');
const ctx    = canvas.getContext('2d');

// Resize canvas to fill the window
function resize() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

// Circle colors (RGBA prefix, alpha added per circle)
const COLORS = [
  'rgba(74,244,194,',   // green accent
  'rgba(91,143,255,',   // blue accent
  'rgba(255,107,157,',  // pink accent
  'rgba(255,200,80,',   // golden accent
];

// ── Circle class ──
class Circle {
  constructor() {
    this.reset(true); // true = scatter on first load
  }

  reset(initial) {
    this.x         = Math.random() * canvas.width;
    this.y         = initial ? Math.random() * canvas.height : canvas.height + 150;
    this.r         = 30 + Math.random() * 120;
    this.dx        = (Math.random() - 0.5) * 0.4;   // horizontal drift
    this.dy        = -(0.15 + Math.random() * 0.35); // float upward
    this.color     = COLORS[Math.floor(Math.random() * COLORS.length)];
    this.alpha     = 0.04 + Math.random() * 0.1;
    this.pulse     = Math.random() * Math.PI * 2;    // random phase
    this.pulseSpeed= 0.005 + Math.random() * 0.01;
  }

  update() {
    // Move the circle
    this.x    += this.dx;
    this.y    += this.dy;
    this.pulse += this.pulseSpeed;

    // Breathing effect
    const pA = this.alpha + Math.sin(this.pulse) * 0.03;
    const pr = this.r     + Math.sin(this.pulse * 0.7) * 6;

    // Draw radial gradient (glowing circle)
    const grad = ctx.createRadialGradient(
      this.x, this.y, pr * 0.2,
      this.x, this.y, pr
    );
    grad.addColorStop(0, this.color + pA + ')');
    grad.addColorStop(1, this.color + '0)');

    ctx.beginPath();
    ctx.arc(this.x, this.y, pr, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();

    // Reset when it floats off-screen
    if (this.y + this.r < -50) this.reset(false);
  }
}

// Create 28 circles
const circles = Array.from({ length: 28 }, () => new Circle());

// Mouse parallax tracking
let mx = 0, my = 0;
window.addEventListener('mousemove', e => {
  mx = e.clientX;
  my = e.clientY;
});

// ── Main draw loop ──
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Subtle background mesh that follows mouse
  const mesh = ctx.createRadialGradient(
    canvas.width  * 0.3 + mx * 0.02,
    canvas.height * 0.3 + my * 0.02,
    0,
    canvas.width  * 0.5,
    canvas.height * 0.5,
    canvas.width  * 0.9
  );
  mesh.addColorStop(0,   'rgba(30,60,100,0.15)');
  mesh.addColorStop(0.5, 'rgba(10,20,50,0.08)');
  mesh.addColorStop(1,   'rgba(5,10,20,0)');

  ctx.fillStyle = mesh;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Update & draw all circles
  circles.forEach(c => c.update());

  requestAnimationFrame(draw);
}

draw();
