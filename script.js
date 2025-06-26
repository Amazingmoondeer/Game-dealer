const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
let scoreboard = document.getElementById('scoreboard');

let arrow = { x: 100, y: 300, vx: 0, vy: 0, flying: false };
let bow = { drawStrength: 0, isDrawing: false };
let score = 0;
let level = 1;
let wind = Math.random() * 0.4 - 0.2;

let target = { x: 700, y: 150, r: 30, moving: true };

// Touch & Mouse Handling
let inputStart = { x: 0, y: 0 };

canvas.addEventListener('mousedown', startInput);
canvas.addEventListener('mouseup', endInput);
canvas.addEventListener('touchstart', e => startInput(e.touches[0]));
canvas.addEventListener('touchend', endInput);

function startInput(e) {
  if (!arrow.flying) {
    bow.isDrawing = true;
    inputStart = { x: e.offsetX || e.clientX, y: e.offsetY || e.clientY };
  }
}

function endInput(e) {
  if (!bow.isDrawing) return;
  bow.isDrawing = false;

  let endX = e.offsetX || e.changedTouches?.[0]?.clientX || 0;
  let endY = e.offsetY || e.changedTouches?.[0]?.clientY || 0;
  let dx = inputStart.x - endX;
  let dy = inputStart.y - endY;

  arrow.vx = dx * 0.2 + wind * 50;
  arrow.vy = dy * 0.2;
  arrow.flying = true;
}

function drawTarget() {
  ctx.beginPath();
  ctx.arc(target.x, target.y, target.r, 0, Math.PI * 2);
  ctx.fillStyle = 'red';
  ctx.fill();
  ctx.beginPath();
  ctx.arc(target.x, target.y, target.r * 0.6, 0, Math.PI * 2);
  ctx.fillStyle = 'white';
  ctx.fill();
  ctx.beginPath();
  ctx.arc(target.x, target.y, target.r * 0.3, 0, Math.PI * 2);
  ctx.fillStyle = 'blue';
  ctx.fill();
}

function drawBowAndPower() {
  ctx.beginPath();
  ctx.arc(100, 300, 40, 0, Math.PI * 2);
  ctx.strokeStyle = '#333';
  ctx.stroke();

  if (bow.isDrawing) {
    let strength = Math.min(100, Math.hypot(inputStart.x - arrow.x, inputStart.y - arrow.y));
    ctx.fillStyle = 'green';
    ctx.fillRect(20, 20, strength, 10);
  }
}

function drawArrow() {
  ctx.beginPath();
  ctx.moveTo(arrow.x, arrow.y);
  ctx.lineTo(arrow.x - 30, arrow.y);
  ctx.strokeStyle = 'brown';
  ctx.lineWidth = 4;
  ctx.stroke();
}

function resetArrow() {
  arrow = { x: 100, y: 300, vx: 0, vy: 0, flying: false };
  wind = Math.random() * 0.4 - 0.2;
}

function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawTarget();
  drawBowAndPower();
  drawArrow();

  if (arrow.flying) {
    arrow.vy += 0.3; // gravity
    arrow.x += arrow.vx;
    arrow.y += arrow.vy;

    if (checkHit()) {
      score += 10;
      if (score % 30 === 0) {
        level++;
        target.r = Math.max(10, target.r - 2);
      }
      resetArrow();
    } else if (arrow.y > canvas.height || arrow.x > canvas.width || arrow.x < 0) {
      resetArrow();
    }
  }

  // Move target (side-to-side)
  if (target.moving) {
    target.x += Math.sin(Date.now() * 0.002 + level) * 0.8;
  }

  scoreboard.innerText = `Level: ${level} | Score: ${score}`;
  requestAnimationFrame(update);
}

function checkHit() {
  let dx = arrow.x - target.x;
  let dy = arrow.y - target.y;
  return Math.sqrt(dx * dx + dy * dy) < target.r;
}

update();
