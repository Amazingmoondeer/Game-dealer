const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let arrowX = 50;
let arrowY = 200;
let shooting = false;
let speed = 0;

const target = {
  x: 700,
  y: 150,
  width: 50,
  height: 100
};

function drawArrow() {
  ctx.fillStyle = "brown";
  ctx.fillRect(arrowX, arrowY, 40, 5);
}

function drawTarget() {
  ctx.fillStyle = "red";
  ctx.fillRect(target.x, target.y, target.width, target.height);
}

function checkHit() {
  return (
    arrowX + 40 > target.x &&
    arrowY > target.y &&
    arrowY < target.y + target.height
  );
}

function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawTarget();
  drawArrow();

  if (shooting) {
    arrowX += speed;

    if (checkHit()) {
      alert("🎯 Hit!");
      resetGame();
    } else if (arrowX > canvas.width) {
      alert("❌ Missed!");
      resetGame();
    }
  }

  requestAnimationFrame(update);
}

function resetGame() {
  arrowX = 50;
  arrowY = 200;
  shooting = false;
  speed = 0;
}

canvas.addEventListener("click", () => {
  if (!shooting) {
    shooting = true;
    speed = 5;
  }
});

update();
