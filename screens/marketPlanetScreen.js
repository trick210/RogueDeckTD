class MarketPlanetScreen {

  constructor(mapSeed, deckSeed) {

    this.container = new PIXI.Container();

    this.bg = new Sprite(PIXI.Texture.WHITE);
    this.bg.width = width;
    this.bg.height = height;
    this.bg.tint = 0x000000;

    this.container.addChild(this.bg);

    this.mapRand = mulberry32(mapSeed);
    this.deckRand = mulberry32(deckSeed);

    this.fillBG();

    this.stationTexture = new PIXI.Sprite(resources['spaceMarket'].texture);
    this.stationTexture.x = (width - this.stationTexture.width) / 2;
    this.stationTexture.y = (height - this.stationTexture.width) / 2;

    this.container.addChild(this.stationTexture);

    this.ship = new SpaceShip(width / 2 + 300, height / 2 + 300, Math.PI * 0.75);
    this.container.addChild(this.ship);

    this.text = new PIXI.Text('Market coming soon', { fontFamily: 'Arial', fontSize: 48, fill: 'white', stroke: 'black', strokeThickness: 4 });


    this.backButton = new Button("Back", 50, 250, 100, 50, this.click.bind(this));

    this.text.x = 50;
    this.text.y = 180;

    
    this.container.addChild(this.text);
    this.container.addChild(this.backButton);


  }

  update() {

  }

  click() {
    setActiveScreen(spaceScreen);
  }

  fillBG() {
    let pdsObj = new PoissonDiskSampling({
      shape: [width, height],
      minDistance: 100,
      maxDistance: 200,
      tries: 20
    }, this.mapRand);

    let g = new PIXI.Graphics();
    g.beginFill(0xFFFFFF);
    for (let p of pdsObj.fill()) {
      g.drawCircle(p[0], p[1], this.mapRand() * 2 + 1);
    }
    g.endFill();

    this.container.addChild(g);
  }


}