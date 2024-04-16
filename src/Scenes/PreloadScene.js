import Phaser from 'phaser';

class PreloadScene extends Phaser.Scene {

  constructor() {
    super('PreloadScene');
  }

  preload() {
    this.load.image('demon', 'assets/LittleDemon.png');
    this.load.image('sky', 'assets/sky.png');
    this.load.image('cloud', 'assets/Cloud.png');
  }

  create() {
    this.scene.start('MenuScene');
  }
}

export default PreloadScene;
