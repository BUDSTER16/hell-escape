import Phaser from 'phaser';

import PreloadScene from './Scenes/PreloadScene';
import MenuScene from './Scenes/MenuScene';
import PlayScene from './Scenes/PlayScene';
                                                                       
const WIDTH = 600;
const HEIGHT = 800;

const DEMON_POSITION = {x: WIDTH * 0.45, y: HEIGHT / 2 };

const SHARED_CONFIG = {
    width: WIDTH,
    height: HEIGHT,
    startPosition: DEMON_POSITION
}

const Scenes = [PreloadScene, MenuScene, PlayScene];
const createScene = Scene => new Scene(SHARED_CONFIG)
const initScenes = () => Scenes.map(createScene)

const config = {
    type: Phaser.AUTO,
    ...SHARED_CONFIG,
    physics: {
      default: 'arcade',
      arcade: {
        debug: true,
      }

    },
    scene: initScenes()
  }

  new Phaser.Game(config);