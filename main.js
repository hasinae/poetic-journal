import Card from './src/Scenes/Card.js';

const config = {
  type: Phaser.AUTO,
  width: 1050,
  height: 800,
  backgroundColor: '#f9f5f0',
  parent: 'gameContainer',
  scene: [Card]
};

new Phaser.Game(config);
