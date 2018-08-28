import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Player from './Player.js';
import Enemy from './Enemy.js';
import { drawCanvas, drawPlayer, drawProjectile, drawEnemy } from './helpers/drawers.js';

export default class Game extends Component {
  constructor(props) {
    super(props);
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.state = {
      screen: 0,
      width: width,
      height: height,
      mousePosition: {
        x: 0,
        y: 0,
      },
      canvas: {},
      ctx: {},
      fps: 30,
      player: new Player(width, height, 50, 3),
      enemies: [],
    }
  }

  componentDidMount() {
    const canvas = document.getElementById('game-canvas');
    this.setState({canvas: canvas, ctx: canvas.getContext('2d')});
    const screens = [this.startScreen.bind(this), this.gameScreen.bind(this), this.endScreen.bind(this)];
    this.spawnEnemies(20);
    setInterval(() => {
      // screens[this.state.screen]();
      this.updateCanvas();
    }, 1000/this.state.fps);

  }

  startScreen() {
    const { ctx, width, height } = this.state;
    ctx.fillStyle = "white";
    ctx.font = '60px Arial';
    ctx.fillText('Swarmed', width/2, height/2-100);
    ctx.fillRect(width/4, height/2+100, width/2, 100);
  }

  gameScreen() {
    this.updatePlayer();
  }

  endScreen() {
    
  }

  handleKeyEvent(e) {
    this.state.player.handleKeyEvent(e);
  }

  handleMouseMove(e) {
    const { canvas } = this.state;
    const rect = canvas.getBoundingClientRect();
    this.setState( {mousePosition: { x: e.clientX-rect.left, y: e.clientY-rect.top }} );
    // console.log(this.state.mousePosition.x, this.state.mousePosition.y);
  }

  handleClickEvent(e) {
    this.state.player.handleClickEvent(e);
  }

  updateCanvas() {
    const { canvas, ctx } = this.state;
    drawCanvas(ctx, canvas);
    this.updateProjectiles();
    this.updatePlayer();
    this.updateEnemies();
  }

  updatePlayer() {
    const { ctx, player, mousePosition } = this.state;
    player.update(mousePosition);
    drawPlayer(ctx, player);
  }

  updateProjectiles() {
    const { ctx, player, mousePosition } = this.state;
    player.update(mousePosition);
    player.projectiles.forEach((projectile) => {
      projectile.update();
      drawProjectile(ctx, projectile);
    });
  }

  updateEnemies() {
    const { ctx, enemies, player } = this.state;
    this.killEnemies();
    enemies.forEach((enemy) => {
      enemy.update(player);
      drawEnemy(ctx, enemy);
    });
  }

  spawnEnemies(num) {
    const { enemies, width, height } = this.state
    for(let i = 0; i < num; i++) {
      enemies.push(new Enemy(width, height, 50, 3));
    }
  }

  killEnemies() {
    const { enemies } = this.state;
    enemies.forEach((enemy, i) => {
      if(!enemy.health) enemies.splice(i, 1); 
    });
  }

  render() {
    const { width, height } = this.state;
    return (
      <div className="game">
        <canvas id="game-canvas" ref="canvas" 
          width={ width } 
          height={ height }
          tabIndex="0"
          onKeyDown={(e) => this.handleKeyEvent(e)}
          onKeyUp={(e) => this.handleKeyEvent(e)} 
          onMouseMove={(e) => this.handleMouseMove(e)}
          onMouseDown={(e) => this.handleClickEvent(e)}
          onMouseUp={(e) => this.handleClickEvent(e)}
          />
      </div>
    )
  }
}