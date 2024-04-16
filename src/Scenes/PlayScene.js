import Phaser from 'phaser';

import BaseScene from './BaseScene';

const PLATFORMS_TO_RENDER = 4;

class PlayScene extends BaseScene {

  constructor(config) {
    super('PlayScene', config);

    this.demon - null;

    this.platHorizontalDistanceRange = [this.config.width *0.6, this.config.width *0.9];
    this.platVerticalDistanceRange = [this.config.height * 0.2, this.config.height * 0.3];

    this.jumpVelocity = 500;
    this.moveSpeed = 200;
    
    this.platformSpeed = 75;

    this.score = 0;
  }

  create() 
  {
    this.createBG();
    this.createDemon();
    this.handleInputs();
    this.createPlatforms();
    this.createScore();
  }

  update()
  {
    this.recyclePlatforms();
    this.checkGameStatus();
  }

  handleInputs()
  {
    this.input.keyboard.on('keydown-SPACE', this.jump, this)
    this.input.keyboard.on('keydown-D', this.right, this)
    this.input.keyboard.on('keydown-A', this.left, this)
    this.input.keyboard.on('keyup-D' && 'keyup-A', this.stop, this)
    this.input.keyboard.on('keyup-A' && 'keyup-D', this.stop, this)
    //this.input.keyboard.on('keyup-A', this.stop, this)
  }

  createBG()
  {
    this.add.image(0, 0, 'sky').setOrigin(0);
  }

  createDemon() 
  {
    this.demon = this.physics.add.sprite(this.config.startPosition.x, this.config.startPosition.y, 'demon')
    .setScale(0.75)
    .setOrigin(0);
    this.demon.body.gravity.y = 600;

    this.demon.setCollideWorldBounds(true);
  }

  createPlatforms()
  {
    this.platforms = this.physics.add.group();

    const midPlatform = this.platforms.create(this.config.width * 0.5, this.config.height * 0.7, 'cloud')
    .setScale(1.5)
    .setImmovable(true);

    for (let i = 0; i < PLATFORMS_TO_RENDER; i++) {
      const leftPlatform = this.platforms.create(0, 600, 'cloud')
        .setScale(1.5)
        .setImmovable(true)
        .setOrigin(0, 1);
      const rightPlatform = this.platforms.create(0, 600, 'cloud')
        .setScale(1.5)
        .setImmovable(true)
        .setOrigin(0, 0);

      this.placePlatform(leftPlatform, rightPlatform)
    }

    this.physics.add.collider(this.demon, this.platforms);
    this.platforms.setVelocityY (this.platformSpeed);
  }

  checkGameStatus() {
    if (this.demon.getBounds().bottom >= this.config.height) {
      this.gameOver();
    }
  }

  gameOver() {
    this.physics.pause();
    this.demon.setTint(0xEE4824);

    this.saveBestScore();

    this.scoreText.setFontSize("72px");
    this.bestScoreText.setFontSize("40px");

    this.scoreText.setPosition(this.config.width * 0.22, this.config.height * 0.4);
    this.bestScoreText.setPosition(this.config.width * 0.25, this.config.height * 0.5);

    this.playAgainText = this.add.text(this.config.width * 0.5, this.config.height * 0.7, "PLAY AGAIN", { fontSize: '92px', fill: '#095'})
    .setOrigin(0.5, 1)
    .setInteractive();

    this.playAgainText.on('pointerover', () => {
      this.playAgainText.setStyle({fill: '#000'});
      this.playAgainText.setColor("#000");
    })

    this.playAgainText.on('pointerout', () => {
      this.playAgainText.setStyle({fill: '#095'});
    })

    this.playAgainText.on('pointerup', () => {
      this.score = 0;
      this.platformSpeed = 75;
      this.scene.restart();
    })
  }

  placePlatform(lPlat, rPlat) {
     const highestY = this.getHighestPlatform();
     const platHorizontalDistance =  Phaser.Math.Between(...this.platHorizontalDistanceRange);
     const platHorizontalPosition = Phaser.Math.Between(-50, 50);
     const platVerticalDistance = Phaser.Math.Between(...this.platVerticalDistanceRange);

     lPlat.y = highestY - platVerticalDistance;
     lPlat.x = platHorizontalPosition;

     rPlat.y = lPlat.y;
     rPlat.x = lPlat.x + platHorizontalDistance;

     this.platforms.setVelocityY (this.platformSpeed);

  }

  recyclePlatforms() {
    const tempPlats = [];
    this.platforms.getChildren().forEach(platform => {
      if (platform.getBounds().bottom >= this.config.height) {
        tempPlats.push(platform);
        if (tempPlats.length === 2) {
          this.placePlatform(...tempPlats);
          this.increaseScore();
          this.saveBestScore();
        }
      }
    })
  }

  increaseScore() {
    this.score++;
    this.scoreText.setText(`Score: ${this.score}`)

    if(this.score % 5 == 0)
    {
      this.platformSpeed = 75 + (25*(this.score/5))
    }

    console.log("current platform speed is: " + this.platformSpeed);
  }

  getHighestPlatform() {
    let highestY = 1000;

    this.platforms.getChildren().forEach(function(platform) {
      highestY = Math.min(platform.y, highestY);
    })

    return highestY;
  }

  jump()
  {
    if(this.demon.body.touching.down){
      this.demon.body.velocity.y = -this.jumpVelocity;
    }
  }

  right()
  {
    this.demon.body.velocity.x = this.moveSpeed;
  }

  left()
  {
    this.demon.body.velocity.x = -this.moveSpeed;
  }

  stop()
  {
    this.demon.body.velocity.x = 0;
  }

  createScore() {
    const bestScore = localStorage.getItem('bestScore');
    this.scoreText = this.add.text(this.config.width * 0.65, this.config.height * 0.03, `Score: ${0}`, { fontSize: '32px', fill: '#000'});
    this.bestScoreText = this.add.text(this.config.width * 0.67, this.config.height * 0.07, `Best score: ${bestScore || 0}`, { fontSize: '18px', fill: '#000'});
  }

  saveBestScore() {
    const bestScoreText = localStorage.getItem('bestScore');
    const bestScore = bestScoreText && parseInt(bestScoreText, 10);

    if (!bestScore || this.score > bestScore) {
      localStorage.setItem('bestScore', this.score);
    }
  }

}



export default PlayScene;
