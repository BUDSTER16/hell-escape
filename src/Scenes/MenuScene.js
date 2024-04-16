import BaseScene from './BaseScene';

class MenuScene extends BaseScene {

  constructor(config) {
     super('MenuScene', config);

    this.menu = [
      {scene: 'PlayScene', text: 'Play'},
      {scene: null, text: 'Exit'},
    ]
  }

  create() {
    super.create();

    this.createMenu(this.menu, this.setupMenuEvents.bind(this));
    this.createTitle();
  }

  setupMenuEvents(menuItem)
  {
    const textGO = menuItem.textGO;
    textGO.setInteractive();

    textGO.on('pointerover', () => {
      textGO.setStyle({fill: '#ff0'});
    })

    textGO.on('pointerout', () => {
      textGO.setStyle({fill: '#fff'});
    })

    textGO.on('pointerup', () => {
      menuItem.scene && this.scene.start(menuItem.scene);

      if(menuItem.text === 'Exit')
      {
        this.game.destroy(true);
      }
    })
  }

  createTitle()
  {
    this.titleText = this.add.text(this.config.width * 0.5, this.config.height * 0.2, "HELL ESCAPE", { fontSize: '85px', fill: '#000'})
    .setOrigin(0.5,0);
  }
}

export default MenuScene;