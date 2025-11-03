class Card extends Phaser.Scene {
  constructor() {
    super('Card');
  }

  preload() {
    this.load.image('envelope', 'assets/envelope.png');
    this.load.image('flap', 'assets/flap.png');
    this.load.image('bunny', 'assets/bunny.png');
    this.load.image('ribbon', 'assets/ribbon.png');
    this.load.image('heart', 'assets/heart.png');
  }

  create() {
    const cx = this.cameras.main.centerX;
    const cy = this.cameras.main.centerY;

    // -------------------------
    // Cute background with gradient + sparkles
    // -------------------------
    const bg = this.add.graphics();
    
    // pastel gradient
    const gradientHeight = this.cameras.main.height;
    for (let y = 0; y < gradientHeight; y++) {
      const t = y / gradientHeight;
      const color = Phaser.Display.Color.Interpolate.ColorWithColor(
        new Phaser.Display.Color(255, 228, 225), // top: misty rose
        new Phaser.Display.Color(255, 240, 245), // bottom: lavender blush
        1,
        t
      );
      bg.lineStyle(1, Phaser.Display.Color.GetColor(color.r, color.g, color.b), 1);
      bg.beginPath();
      bg.moveTo(0, y);
      bg.lineTo(this.cameras.main.width, y);
      bg.strokePath();
    }

    // sparkles
    for (let i = 0; i < 80; i++) {
      const x = Phaser.Math.Between(0, this.cameras.main.width);
      const y = Phaser.Math.Between(0, this.cameras.main.height);
      const size = Phaser.Math.Between(2, 6);
      const color = Phaser.Display.Color.RandomRGB().color;
      bg.fillStyle(color, 0.7);
      bg.fillCircle(x, y, size);
    }

    // -------------------------
    // Envelope
    // -------------------------
    this.envelope = this.add.image(cx, cy - 50, 'envelope').setScale(1.3);

    // Flap (centered horizontally, below envelope)
    this.flap = this.add.image(cx, cy + 50, 'flap')
      .setOrigin(0.55, 0.55)
      .setScale(1.1)
      .setVisible(false);

    // -------------------------
    // Letter box
    // -------------------------
    const letterWidth = 450;
    const letterHeight = 300;
    this.letterBox = this.add.graphics();
    // this.letterBox.fillStyle(0x000000, 1); // black letter box
    this.letterBox.fillRoundedRect(cx - letterWidth / 2, cy - 150, letterWidth, letterHeight, 16);
    this.letterBox.lineStyle(3, 0xffffff, 1); // white border
    this.letterBox.strokeRoundedRect(cx - letterWidth / 2, cy - 150, letterWidth, letterHeight, 16);
    this.letterBox.alpha = 0;

    // Letter text
    this.letter = this.add.text(cx, cy - 50, 'Happy Birthday! 💌', {
      fontFamily: 'Parisienne, cursive',
      fontSize: '36px',
      color: '#000000', // black text
      align: 'center',
      wordWrap: { width: letterWidth - 40 }
    }).setOrigin(0.5).setAlpha(0);

    // Decorations
    this.bunny = this.add.image(cx - 180, cy + 130, 'bunny').setScale(0.5);
    this.heart = this.add.image(cx + 180, cy + 130, 'heart').setScale(0.3);
    this.ribbon = this.add.image(cx + 150, cy - 60, 'ribbon').setScale(0.5);

    // Floating animations for decorations
    [this.bunny, this.heart, this.ribbon].forEach(obj => {
      this.tweens.add({
        targets: obj,
        y: obj.y + 10,
        yoyo: true,
        repeat: -1,
        duration: 2000,
        ease: 'Sine.easeInOut'
      });
    });

    // -------------------------
    // State tracking
    // -------------------------
    this.state = 'envelopeVisible';

    // Click interaction
    this.input.on('pointerdown', () => {
      if (this.state === 'envelopeVisible') {
        this.showFlap();
      } else if (this.state === 'flapVisible') {
        this.showLetter();
      }
    });
  }

  showFlap() {
    this.state = 'flapVisible';
    this.envelope.setVisible(false);
    this.flap.setVisible(true);
  }

  showLetter() {
    this.state = 'letterVisible';
    this.flap.setVisible(false);

    this.tweens.add({
      targets: [this.letterBox, this.letter],
      alpha: 1,
      duration: 800,
      ease: 'Sine.easeInOut'
    });

    // subtle wiggle animation
    this.tweens.add({
      targets: this.letter,
      x: this.letter.x + 5,
      yoyo: true,
      repeat: 3,
      duration: 100,
      ease: 'Sine.easeInOut'
    });
  }
}

export default Card;
