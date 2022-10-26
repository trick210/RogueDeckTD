class DeathScreen {

  constructor(wave) {    
    
    this.x = 0;
    this.size = 72;

    this.bg = new Sprite(PIXI.Texture.WHITE);
    this.bg.width = width;
    this.bg.height = height;
    this.bg.tint = 0x2C3539;

    this.deathText = new PIXI.Text('Game Over', {fontFamily: 'Arial', fontSize: 144, fill: 'red', align: 'center', stroke: 'black', lineJoin: "bevel", strokeThickness: 5});
    this.waveText = new PIXI.Text("You died on planet " + player.stage + " on wave " + wave, {fontFamily: 'Arial', fontSize: 72, fill: 'white', align: 'center', stroke: 'black', lineJoin: "bevel", strokeThickness: 5});

    this.returnButton = new Button("Back to Menu", width / 2 - 100, height / 2, 200, 50, this.click.bind(this));

    this.deathText.x = width / 2;
    this.deathText.y = 45;
    this.deathText.anchor.set(0.5, 0);

    this.waveText.x = width / 2;
    this.waveText.y = 250;
    this.waveText.anchor.set(0.5, 0);


    this.container = new PIXI.Container();

    this.container.addChild(this.bg);
    this.container.addChild(this.deathText);
    this.container.addChild(this.waveText);
    this.container.addChild(this.returnButton);
  }

  update() {

  }



  click() {
    spaceScreen.cleanup();
  	setActiveScreen(new MenuScreen());
  }

}