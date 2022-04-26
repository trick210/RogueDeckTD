class Planet extends PIXI.Container {

  constructor(x, y, id, type, planetSeed) {
    super();

    this.x = x;
    this.y = y;

    this.planetID = id;

    this.planetRand = mulberry32(planetSeed);

    this.defaultBorder = 0xFF0000;
    this.defaultSize = (type == "boss") ? 196 : (48 + Math.round(this.planetRand() * 32));

    this.planetType = this.getType(type);

    this.texture = this.planetType.texture;

    this.texture.anchor.set(0.5);

    this.texture.width = this.defaultSize;
    this.texture.height = this.defaultSize;

    this.border = new PIXI.Graphics();

    this.setActive(type == "start");

    this.addChild(this.texture);
    this.addChild(this.border)

    this.texture.on('click', this.click);


    this.nextPlanets = [];
  }

  setActive(state) {
    if (state) {
      this.interactive = true;
      this.buttonMode = true;

      this.border.clear();

      //this.texture.width = 64;
      //this.texture.height = 64;

      this.border.lineStyle(3, 0x00FF00);
      this.border.drawCircle(0, 0, this.defaultSize / 2);

    } else {
      this.interactive = false;
      this.buttonMode = false;

      this.border.clear();
      //this.border.lineStyle(3, this.defaultBorder);
      //this.border.drawCircle(0, 0, 32);
    }
  }

  setVisited() {
    //this.defaultSize = 64;
  }

  click() {
    spaceScreen.clickPlanet(this);
  }

  getType(type) {
    let types = [
      {
        name: "combat",
        percentage: 20,
        texture: new PIXI.Sprite(resources['grassPlanet'].texture),
        config: grassConfig,
        mapType: CombatMap
      },
      {
        name: "combat2",
        percentage: 20,
        texture: new PIXI.Sprite(resources['crystalPlanet'].texture),
        config: crystalConfig,
        mapType: CombatMap
      },
      {
        name: "combat3",
        percentage: 20,
        texture: new PIXI.Sprite(resources['gasPlanet'].texture),
        config: gasConfig,
        mapType: CombatMap
      },
      {
        name: "market",
        percentage: 20,
        texture: new PIXI.Sprite(resources['spaceMarket'].texture)
      },
      {
        name: "waste",
        percentage: 20,
        texture: new PIXI.Sprite(resources['wastePlanet'].texture)
      }
    ];

    if (type == "start") {
      let names = ["combat", "combat2", "combat3"];
      let name = names[Math.floor(this.planetRand() * 3)];
      return types.find(t => t.name == name);
    }

    if (type == "boss") {
      return {
        name: "boss",
        texture: new PIXI.Sprite(resources['bossPlanet'].texture),
        config: bossConfig,
        mapType: CentipedeBossMap
      };
    }

    let rand = this.planetRand() * 100;
    let counter = 0;

    for (let t of types) {
      counter += t.percentage;
      if (rand < counter) {
        let unkown = this.planetRand() * 100;
        if (unkown < 15) {
          t.texture = new PIXI.Sprite(resources['unknownPlanet'].texture);
          this.defaultSize = 64;
        }
        return t;
      }
    }


  }

  getScreen() {
    if (this.planetType.name == "market") {
      return new MarketPlanetScreen(this.planetRand() * 0xFFFFFFFF, player.getNextRewardSeed());
    }

    if (this.planetType.name == "waste") {
      return new WastePlanetScreen(this.planetRand() * 0xFFFFFFFF, player.getNextRewardSeed());
    }

    gameScreen = new GameScreen(this.planetType.config, this.planetType.mapType, this.planetRand() * 0xFFFFFFFF, player.getNextRewardSeed());
    return gameScreen;
  }


}