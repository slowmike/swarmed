const drawCanvas = (ctx, canvas) => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
};

const drawStartScreen = (ctx, width, height) => {
  ctx.fillStyle = 'white';
  ctx.textAlign = 'center';
  ctx.font = '100px Arial';
  ctx.fillText('Swarmed', width / 2, height / 2);

  ctx.fillStyle = 'white';
  const button = [width / 2 - 240, height / 2 + 100, 480, 100];
  ctx.fillRect(...button);

  ctx.fillStyle = 'black';
  ctx.font = '40px Arial';
  ctx.fillText('Click to Start Game!', width / 2, height / 2 + 165);
  return button;
};

const drawPlayer = (ctx, player, color = 'yellow') => {
  const { x, y, radius } = player;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI);
  ctx.fill();
};

const drawProjectile = (ctx, projectile, color = 'yellow') => {
  const {
    x,
    y,
    radius,
    distTravelled,
    maxDist,
  } = projectile;
  ctx.fillStyle = color;
  ctx.beginPath();
  const alpha = (maxDist - distTravelled) / maxDist;
  ctx.globalAlpha = alpha <= 0 ? 0 : alpha;
  ctx.arc(x, y, radius, 0, 2 * Math.PI);
  ctx.fill();
  ctx.stroke();
  ctx.globalAlpha = 1;
};

const drawEnemy = (ctx, enemy, color = 'red') => {
  const { x, y, radius } = enemy;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI);
  ctx.fill();
  ctx.stroke();
};

const drawScoreboard = (ctx, width, player, enemiesKilled, enemiesRemaining, color = 'white') => {
  ctx.fillStyle = color;
  ctx.textAlign = 'left';
  ctx.font = '20px Arial';
  ctx.fillText(`HP: ${player.health}`, 10, 20);
  ctx.fillText(`Enemies Eliminated: ${enemiesKilled}`, width / 2 - 125, 20);
  ctx.fillText(`Enemies Remaining: ${enemiesRemaining.length}`, width - 225, 20);
};

const drawEndScreen = (ctx, width, height, enemiesKilled) => {
  ctx.fillStyle = 'white';
  ctx.textAlign = 'center';
  ctx.font = '100px Arial';
  ctx.fillText('Game Over!', width / 2, height / 2);
  ctx.font = '40px Arial';
  ctx.fillText(`Enemies Killed: ${enemiesKilled}`, width / 2, height / 2 + 100);
};

const drawScores = (ctx, width, highScores) => {
  ctx.fillStyle = 'white';
  ctx.textAlign = 'center';
  ctx.font = '100px Arial';
  ctx.fillText('High Scores:', width / 2, 100);
  ctx.font = '40px Arial';
  highScores.forEach((highScore, i) => {
    const { player, score } = highScore;
    ctx.fillText(`${player}: ${score}`, width / 2, ((i * 50) + 200));
  });
};

module.exports = {
  drawCanvas,
  drawStartScreen,
  drawPlayer,
  drawProjectile,
  drawEnemy,
  drawScoreboard,
  drawEndScreen,
  drawScores,
}