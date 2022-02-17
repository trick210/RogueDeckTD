class Planet extends PIXI.Container {

  constructor(x, y, id, planetSeed) {
    super();

    this.x = x;
    this.y = y;

    this.planetID = id;

    this.planetSeed = planetSeed;

    this.defaultBorder = 0xFF0000;
    this.defaultFill = 0xAA6060;

    this.texture = new PIXI.Graphics();
    
    this.setActive(false);

    this.addChild(this.texture);

    this.texture.on('click', this.click);


    this.nextPlanets = [];
  }

  setActive(state) {
    if (state) {
      this.interactive = true;
      this.buttonMode = true;

      this.texture.clear();
      this.texture.lineStyle(3, 0x00FF00);
      this.texture.beginFill(0x60AA60);
      this.texture.drawCircle(0, 0, 20);
      this.texture.endFill();

    } else {
      this.interactive = false;
      this.buttonMode = false;

      this.texture.clear();
      this.texture.lineStyle(3, this.defaultBorder);
      this.texture.beginFill(this.defaultFill);
      this.texture.drawCircle(0, 0, 10);
      this.texture.endFill();
    }
  }

  setVisited() {
    this.defaultBorder = 0x0000FF;
    this.defaultFill = 0x6060FF;
  }

  click() {
    spaceScreen.clickPlanet(this);
  }

}