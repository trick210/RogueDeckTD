class MenuScreen {

  constructor() {    
    
    this.x = 0;
    this.size = 72;

    this.bg = new Sprite(PIXI.Texture.WHITE);
    this.bg.width = width;
    this.bg.height = height;
    this.bg.tint = 0x2C3539;
    this.bg.interactive = true;
    this.bg.on('pointertap', this.click);

    this.titleText = new PIXI.Text("RogueDeckTD", {fontFamily: 'Arial', fontSize: 96, fill: 'white', align: 'center', stroke: 'black', strokeThickness: 5});
    //this.subtitleText = new PIXI.Text("subtitle", {fontFamily: 'Arial', fontSize: 72, fill: 'white', align: 'center', stroke: 'black', strokeThickness: 5});
    this.clickText = new PIXI.Text("click to play", {fontFamily: 'Arial', fontSize: this.size, fill: 'white', align: 'center', stroke: 'black', strokeThickness: 5});

    this.titleText.x = width / 2;
    this.titleText.y = 45;
    this.titleText.anchor.set(0.5, 0);

    //this.subtitleText.x = width / 2;
    //this.subtitleText.y = 180;
    //this.subtitleText.anchor.set(0.5, 0);

    this.clickText.x = width / 2;
    this.clickText.y = height / 2;
    this.clickText.anchor.set(0.5);

    this.container = new PIXI.Container();

    this.container.addChild(this.bg);
    this.container.addChild(this.titleText);
    //this.container.addChild(this.subtitleText);
    this.container.addChild(this.clickText);

  }

  update() {
    this.x = (this.x + (Math.PI / 32) * (deltaTime / 16)) % (2 * Math.PI);

    this.size = 72 + 8 * Math.sin(this.x);
    this.clickText.style.fontSize = this.size;
  }

  click() {
    //setActiveScreen(gameScreen);
    setActiveScreen(spaceScreen);
  }

}