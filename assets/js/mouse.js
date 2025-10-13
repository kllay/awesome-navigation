const canvas = document.getElementById('mouse-trail-canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

let particles = [];

function createParticle(x, y) {
  const colors = ['#ffcc00', '#ffffff', '#66ccff', '#ff99cc'];
  particles.push({
    x,
    y,
    size: Math.random() * 6 + 4,
    alpha: 1,
    dx: (Math.random() - 0.5) * 2,
    dy: (Math.random() - 0.5) * 2,
    color: colors[Math.floor(Math.random() * colors.length)]
  });
}

function drawParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach((p, i) => {
    ctx.globalAlpha = p.alpha;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fillStyle = p.color;
    ctx.fill();
    p.x += p.dx;
    p.y += p.dy;
    p.alpha -= 0.01;
    if (p.alpha <= 0) particles.splice(i, 1);
  });
  ctx.globalAlpha = 1;
  requestAnimationFrame(drawParticles);
}

document.addEventListener('mousemove', (e) => {
  for (let i = 0; i < 5; i++) {
    createParticle(e.clientX, e.clientY);
  }
});

drawParticles();
// 隐藏鼠标轨迹画布
