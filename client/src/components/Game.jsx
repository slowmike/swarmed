import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Player from './Player.js';
import Enemy from './Enemy.js';
import {
  drawCanvas,
  drawStartScreen,
  drawPlayer,
  drawProjectile,
  drawEnemy,
  drawScoreboard,
  drawEndScreen,
} from './helpers/drawers.js';

export default class Game extends Component {
  constructor(props) {
    super(props);
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.state = {
      screen: 1,
      width: width,
      height: height,
      mousePosition: {
        x: 0,
        y: 0,
      },
      canvas: {},
      ctx: {},
      fps: 30,
      player: {},
      defaultStats: {
        size: 50,
        speed: 3,
        health: 10,
        shotsPerSecond: 3,
        immuneTime: 5,
      },
      enemies: [],
      enemiesKilled: 0,
      enemiesCount: 20,
    }
  }

  componentDidMount() {
    const canvas = document.getElementById('game-canvas');
    const { size, speed, health, shotsPerSecond, immuneTime } = this.state.defaultStats;
    this.setState({
      canvas: canvas,
      ctx: canvas.getContext('2d'),
      player: new Player(this.state.width, this.state.height, size, speed, health, shotsPerSecond, immuneTime),
    });
    const screens = [this.startScreen.bind(this), this.gameScreen.bind(this), this.endScreen.bind(this)];
    setInterval(() => {
      screens[this.state.screen]();
      // this.gameScreen();
    }, 1000/this.state.fps);

  }

  startScreen() {
    const { ctx, width, height } = this.state;
    drawStartScreen(ctx, width, height);
  }

  gameScreen() {
    const { canvas, ctx } = this.state;
    drawCanvas(ctx, canvas);
    this.updateProjectiles();
    this.updatePlayer();
    this.updateEnemies();
    this.updateScoreboard();
  }

  endScreen() {
    const { canvas, ctx, width, height } = this.state;
    drawCanvas(ctx, canvas);
    drawEndScreen(ctx, width, height);
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

  updatePlayer() {
    const { ctx, player, mousePosition } = this.state;
    player.update(mousePosition);
    drawPlayer(ctx, player);
    if(player.health <= 0) {
      this.setState({screen: 2});
    }
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
    const { ctx, enemies, enemiesCount, player } = this.state;
    if(enemies.length === 0) {
      this.spawnEnemies(enemiesCount);
      this.setState({enemiesCount: enemiesCount+10});
    }
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
      if(enemy.health <= 0) {
        enemies.splice(i, 1); 
        this.setState({enemiesKilled: this.state.enemiesKilled+1});
      }
    });
  }

  updateScoreboard() {
    const { ctx, width, height, player, enemiesKilled, enemies } = this.state;
    drawScoreboard(ctx, width, height, player, enemiesKilled, enemies);
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