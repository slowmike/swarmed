const drawCanvas = (ctx, canvas) => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

const drawPlayer = (ctx, player) => {
  const {x, y, radius, color} = player;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2*Math.PI);
  ctx.fill();
}

const drawProjectile = (ctx, projectile) => {
  const {x, y, radius, color, distTravelled, maxDist } = projectile;
  ctx.fillStyle = color;
  ctx.beginPath();
  const alpha = (maxDist-distTravelled)/maxDist;
  ctx.globalAlpha = alpha <= 0 ? 0 : alpha;
  ctx.arc(x, y, radius, 0, 2*Math.PI);
  ctx.fill();
  ctx.stroke();
  ctx.globalAlpha = 1;
}

const drawEnemy = (ctx, enemy) => {
  const { x, y, radius, color } = enemy;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2*Math.PI);
  ctx.fill();
  ctx.stroke();
}

module.exports = {
  drawPlayer,
  drawCanvas,
  drawProjectile,
  drawEnemy,
}