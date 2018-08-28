import Projectile from './Projectile.js';
export default class Player {
  constructor(screenX, screenY, size, speed, health = 50, shotsPerSecond = 5, immuneTime = 1) {
    this.x = screenX/2;
    this.y = screenY/2;
    this.screenX = screenX;
    this.screenY = screenY;
    this.size = size;
    this.radius = size/2;
    this.speed = speed;
    this.health = health;
    this.shotsPerSecond = shotsPerSecond;
    this.immuneTime = immuneTime;
    this.projectileStats = {
      size: 10,
      speed: 10,
      power: 1,
      maxDist: 500,
    }
    this.projectiles = [];
    this.clickState = false;
    this.shoot = this.shoot.bind(this);
    this.canShoot = true;
    this.immune = false;
    this.keyCodes = {
      UP: 38,
      LEFT: 37,
      DOWN: 40,
      RIGHT: 39,
      W: 87,
      A: 65,
      S: 83,
      D: 68,
      SPACE: 32,
      ENTER: 13,
    };
    this.keyState = {
      UP: false,
      LEFT: false,
      DOWN: false,
      RIGHT: false,
      W: false,
      A: false,
      S: false,
      D: false,
      SPACE: false,
      ENTER: false,  
    };
  }

  update(mouseX, mouseY) {
    this.move();
    this.shoot(mouseX, mouseY);
    // for (let i in this.projectiles) {
    //   if(!this.projectiles[i].isLive) this.projectiles.splice(i, 1);
    // }
    this.projectiles.forEach((projectile, i) => {
      if(!projectile.isLive) this.projectiles.splice(i, 1); 
    });
  }

  move() {
    const up = (this.keyState.UP || this.keyState.W);
    const down = (this.keyState.DOWN ||this.keyState.S);
    const left = (this.keyState.LEFT || this.keyState.A);
    const right = (this.keyState.RIGHT || this.keyState.D);
    const xConflict = (left === right);
    const yConflict = (up === down);
    // set diagonal movement velocity to be same as horizontal/vertical
    const velocity = 
      ( (!xConflict && !yConflict) && ((up && (right || left)) || (down && (right || left))) ) ? 
        this.speed*(Math.sqrt(2)/2) :
        this.speed;
    if (up) {
      this.y-=velocity;
    }
    if (down) {
      this.y+=velocity;
    }
    if (left) {
      this.x-=velocity;
    }
    if (right) {
      this.x+=velocity;
    }
    // prevent movement out of bounds
    if(this.x < 0) {
      this.x = 0;
    }
    if(this.y < 0) {
      this.y = 0;
    }
    if(this.x > this.screenX) {
      this.x = this.screenX;
    }
    if(this.y > this.screenY) {
      this.y = this.screenY;
    }
  }

  shoot(mousePosition) {
    if (this.canShoot) {
      const trigger = (this.keyState.SPACE || this.clickState);
      if (trigger) {
        const { size, speed, power, maxDist} = this.projectileStats;
        const projectile = new Projectile(this.x, this.y, mousePosition, size, speed, power, maxDist, 0, this.color);
        this.projectiles.push(projectile);
        this.canShoot = false;
        setTimeout(() => {this.canShoot = true}, 1000/this.shotsPerSecond);
      }
    }
  }

  hit() {
    if(!this.immune) {
      this.health--;
      this.immune = true;
      setTimeout(() => {this.immune = false}, this.immuneTime*100);
    }
  }

  handleKeyEvent(e) {
    for(let key in this.keyCodes) {
      if(this.keyCodes[key] === e.keyCode) {
        this.keyState[key] = e.type == 'keydown';
      }
    }
  }

  handleClickEvent(e) {
    this.clickState = e.type == 'mousedown';
  }
}