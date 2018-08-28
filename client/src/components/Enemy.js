export default class Enemy {
  constructor(screenX, screenY, size, speed, health = 1, color = 'red') {
    this.x = this.random(screenX);
    this.y = this.random(screenY);
    this.size = size;
    this.radius = size/2;
    this.speed = speed;
    this.velocityX;
    this.velocityY;
    this.color = color;
    this.health = health;
  }

  update(player) {
    const { projectiles } = player;
    this.move(player);
    this.hit(projectiles);
  }

  move(player) {
    [this.velocityX, this.velocityY] = this.calcVelocity(player);
    this.x += this.velocityX;
    this.y += this.velocityY;
  }

  calcVelocity(player) {
    const xDiff = player.x - this.x;
    const yDiff = player.y - this.y;
    const speedDelimiter = Math.sqrt(Math.pow(xDiff, 2) + Math.pow(yDiff, 2));
    return [this.speed * (xDiff / speedDelimiter), this.speed * (yDiff / speedDelimiter)];
  }

  hit(projectiles) {
    projectiles.forEach((projectile) => {
      const dist = Math.sqrt(Math.pow((projectile.y-this.y), 2) + Math.pow((projectile.x-this.x), 2));
      const totRadius = projectile.radius+this.radius;
      if(dist < totRadius) {
        this.health--;
      }
    })
  }

  random(screenSize) {
    const randomLoc = ((Math.random()*1000)-500);
    return randomLoc > 0 ? randomLoc + screenSize : randomLoc;
  }
}