export default class Enemy {
  constructor(screenX, screenY, size, speed, health = 1) {
    [this.x, this.y] = this.random(screenX, screenY);
    this.size = size;
    this.radius = size/2;
    this.speed = speed;
    this.velocityX;
    this.velocityY;
    this.health = health;
  }

  update(player) {
    const { projectiles } = player;
    this.move(player);
    this.attack(player);
    this.hit(projectiles);
  }

  move(player) {
    [this.velocityX, this.velocityY] = this.calcVelocity(player);
    this.x += this.velocityX;
    this.y += this.velocityY;
  }

  attack(player) {
    const dist = Math.sqrt(Math.pow((player.y-this.y), 2) + Math.pow((player.x-this.x), 2));
    const totRadius = player.radius+this.radius;
    if(dist < totRadius) {
      player.hit();
      console.log(player.health);
    }
  }

  calcVelocity(player) {
    const xDiff = player.x - this.x;
    const yDiff = player.y - this.y;
    const speedDelimiter = Math.sqrt(Math.pow(xDiff, 2) + Math.pow(yDiff, 2));
    return [this.speed * (xDiff / speedDelimiter), this.speed * (yDiff / speedDelimiter)];
  }

  hit(projectiles) {
    projectiles.forEach((projectile) => {
      if(projectile.isLive) {
        const dist = Math.sqrt(Math.pow((projectile.y-this.y), 2) + Math.pow((projectile.x-this.x), 2));
        const totRadius = projectile.radius+this.radius;
        if(dist < totRadius) {
          this.health--;
          projectile.isLive = 0;
        }
      }
    })
  }

  random(screenX, screenY) {
    let xLoc = (Math.random()*(screenX+1000))-500;
    let yLoc = (Math.random()*(screenY+1000))-500;
    const outOfScreenX = (x) => ( (x < (this.radius)) || (x > (screenX + this.radius)) );
    const outOfScreenY = (y) => ( (y < (this.radius)) || (y > (screenY + this.radius)) );
    while (outOfScreenX() && outOfScreenY()) {
      xLoc = (Math.random()*(screenX+1000))-500;
      yLoc = (Math.random()*(screenY+1000))-500;
    }
    return [xLoc, yLoc];
  }
}