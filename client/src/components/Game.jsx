import React, { Component } from 'react';
import axios from 'axios';
import Player from './Player';
import Enemy from './Enemy';
import {
  drawCanvas,
  drawStartScreen,
  drawPlayer,
  drawProjectile,
  drawEnemy,
  drawScoreboard,
  drawEndScreen,
  drawScores,
} from './helpers/drawers';

export default class Game extends Component {
  constructor(props) {
    super(props);
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.state = {
      screen: 0,
      width,
      height,
      mousePosition: {
        x: 0,
        y: 0,
      },
      canvas: {},
      ctx: {},
      fps: 30,
      player: {},
      startButton: {},
      defaultStats: {
        name: 'Michael',
        size: 50,
        speed: 3,
        health: 10,
        shotsPerSecond: 3,
        immuneTime: 5,
      },
      enemies: [],
      enemiesKilled: 0,
      enemiesCount: 20,
      highScores: [],
    };
  }

  componentDidMount() {
    const canvas = document.getElementById('game-canvas');
    this.setState({
      canvas,
      ctx: canvas.getContext('2d'),
    });
    const screens = [
      this.startScreen.bind(this),
      this.gameScreen.bind(this),
      this.endScreen.bind(this),
      this.highScoresScreen.bind(this),
    ];
    const { screen, fps } = this.state;
    setInterval(() => {
      screens[screen]();
      // this.gameScreen();
    }, 1000 / fps);
  }

  startScreen() {
    const { ctx, width, height } = this.state;
    const startButton = drawStartScreen(ctx, width, height);
    this.setState({ startButton });
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
    const {
      canvas,
      ctx,
      width,
      height,
      enemiesKilled,
    } = this.state;
    drawCanvas(ctx, canvas);
    drawEndScreen(ctx, width, height, enemiesKilled);
  }

  highScoresScreen() {
    const {
      ctx,
      canvas,
      width,
      highScores,
    } = this.state;
    drawCanvas(ctx, canvas);
    drawScores(ctx, width, highScores);
  }

  handleKeyEvent(e) {
    const { player } = this.state;
    player.handleKeyEvent(e);
  }

  handleMouseMove(e) {
    const { canvas } = this.state;
    const rect = canvas.getBoundingClientRect();
    this.setState({ mousePosition: { x: e.clientX - rect.left, y: e.clientY - rect.top } });
    // console.log(this.state.mousePosition.x, this.state.mousePosition.y);
  }

  handleClickEvent(e) {
    const {
      screen,
      mousePosition,
      player,
      startButton,
      enemiesKilled,
    } = this.state;
    const mosX = mousePosition.x;
    const mosY = mousePosition.y;
    if (screen === 0) {
      const inX = (mosX >= startButton[0] && mosX <= startButton[0] + startButton[2]);
      const inY = (mosY >= startButton[1] && mosY <= startButton[1] + startButton[3]);
      if (inX && inY) {
        this.initializePlayer();
      }
    } else if (screen === 1) {
      player.handleClickEvent(e);
    } else if (screen === 2) {
      axios.post('/api/score', { player: player.name, score: enemiesKilled })
        .then(() => {
          axios.get('/api/highScores')
            .then(({ data }) => {
              this.setState({ highScores: data });
            });
          this.setState({ screen: 3 });
        });
    }
  }

  initializePlayer() {
    const { width, height, defaultStats } = this.state;
    const {
      name,
      size,
      speed,
      health,
      shotsPerSecond,
      immuneTime,
    } = defaultStats;
    const newName = prompt('What is your Name?');
    this.setState(prevState => ({
      defaultStats: {
        ...prevState.defaultStats,
        name: newName,
      },
    }));
    this.setState({
      screen: 1,
      player: new Player(name, width, height, size, speed, health, shotsPerSecond, immuneTime),
    });
  }

  updatePlayer() {
    const { ctx, player, mousePosition } = this.state;
    player.update(mousePosition);
    drawPlayer(ctx, player);
    if (player.health <= 0) {
      this.setState({ screen: 2 });
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
    const {
      ctx,
      enemies,
      enemiesCount,
      player,
    } = this.state;
    if (enemies.length === 0) {
      this.spawnEnemies(enemiesCount);
      this.setState({ enemiesCount: enemiesCount + 10 });
    }
    this.killEnemies();
    enemies.forEach((enemy) => {
      enemy.update(player);
      drawEnemy(ctx, enemy);
    });
  }

  spawnEnemies(num) {
    const { enemies, width, height } = this.state;
    for (let i = 0; i < num; i++) {
      enemies.push(new Enemy(width, height, 50, 3));
    }
  }

  killEnemies() {
    const { enemies, enemiesKilled } = this.state;
    enemies.forEach((enemy, i) => {
      if (enemy.health <= 0) {
        enemies.splice(i, 1);
        this.setState({ enemiesKilled: enemiesKilled + 1 });
      }
    });
  }

  updateScoreboard() {
    const { ctx, width, player, enemiesKilled, enemies } = this.state;
    console.log(player);
    drawScoreboard(ctx, width, player, enemiesKilled, enemies);
  }

  render() {
    const { width, height } = this.state;
    return (
      <div className="game">
        <canvas
          id="game-canvas"
          ref="canvas" 
          width={width}
          height={height}
          tabIndex="0"
          onKeyDown={e => this.handleKeyEvent(e)}
          onKeyUp={e => this.handleKeyEvent(e)}
          onMouseMove={e => this.handleMouseMove(e)}
          onMouseDown={e => this.handleClickEvent(e)}
          onMouseUp={e => this.handleClickEvent(e)}
        />
      </div>
    );
  }
}
