import Journal from './Scenes/Journal.js';

// Game configuration
const config = {
    parent: 'gameContainer',
    type: Phaser.CANVAS,
    render: {
        pixelArt: true 
    },
    width: 1050,
    height: 800,
    backgroundColor: '#39FF14',
    scene: [Journal]
};

const game = new Phaser.Game(config);

