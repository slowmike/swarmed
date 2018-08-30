export default class Projectile {
  constructor(x, y, mouse, size, speed, power = 1, maxDist = 1000, offset = 0 ) {
    this.x = x;
    this.y = y;
    this.originX = x;
    this.originY = y;
    this.maxDist = maxDist;
    this.distTravelled = 0;
    this.destX = mouse.x;
    this.destY = mouse.y;
    this.size = size;
    this.radius = size / 2;
    [this.velocityX, this.velocityY] = this.calcVelocity(speed);
    this.power = power;
    this.offset = offset;
    this.isLive = 1;
  }

  calcVelocity(speed) {
    const xDiff = this.destX - this.x;
    const yDiff = this.destY - this.y;
    const speedDelimiter = Math.sqrt((xDiff ** 2) + (yDiff ** 2));
    return [speed * (xDiff / speedDelimiter), speed * (yDiff / speedDelimiter)];
  }

  update() {
    this.move();
    this.distTravelled = Math.sqrt(((this.originY - this.y) ** 2) + ((this.originX - this.x) ** 2));
    if (this.distTravelled > this.maxDist) this.isLive = 0;
  }

  kill() {
    this.isLive--;
  }

  move() {
    this.x += this.velocityX;
    this.y += this.velocityY;
  }
}