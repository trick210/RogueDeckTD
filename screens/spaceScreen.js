class SpaceScreen {

  constructor() {
    this.bg = new Sprite(PIXI.Texture.WHITE);
    this.bg.width = width;
    this.bg.height = height;
    this.bg.tint = 0x000000;

    this.container = new PIXI.Container();

    this.container.addChild(this.bg);

    this.planets = [];
    this.lastPlanet = null;

    this.pathCount = 5; //Should be odd
    this.layers = 7;

    this.startPoint = [0, Math.floor(this.pathCount / 2)];
    this.endPoint = [this.layers + 1, Math.floor(this.pathCount / 2)];

    this.spaceMapSeed = player.getNextMapSeed();
    this.planetMapSeed = player.getNextMapSeed();
    this.starBackgroundSeed = player.getNextMapSeed();

    this.planetSeedRand = mulberry32(this.planetMapSeed);

    this.setupSpaceMap();

    this.currentStage = 0;

    this.spaceShip = new SpaceShip(-200, 0, -Math.PI / 2);
    this.spaceShip.texture.width = 24;
    this.spaceShip.texture.height = 48;
    this.container.addChild(this.spaceShip);

    let holo = this.createHolo();
    holo.y = height - 256;
    this.container.addChild(holo);

  }

  createHolo() {
    let holoContainer = new PIXI.Container();
    let holoBG = new PIXI.Graphics();
    holoBG.beginFill(0x003000);
    holoBG.drawRoundedRect(0, 0, 128, 256, 10);
    holoBG.endFill();
    holoContainer.addChild(holoBG);

    let pTex = [
      new PIXI.Sprite(resources['grassPlanet'].texture),
      new PIXI.Sprite(resources['crystalPlanet'].texture),
      new PIXI.Sprite(resources['gasPlanet'].texture),
      new PIXI.Sprite(resources['wastePlanet'].texture),
      new PIXI.Sprite(resources['spaceMarket'].texture)
    ];

    for (let p of pTex) {
      p.width = 32;
      p.height = 32;
      p.anchor.set(0.5);
      holoBG.addChild(p);
    }

    pTex[0].x = 20;
    pTex[0].y = 50;
    pTex[1].x = 60;
    pTex[1].y = 50;
    pTex[2].x = 100;
    pTex[2].y = 50;
    pTex[3].x = 20;
    pTex[3].y = 130;
    pTex[4].x = 20;
    pTex[4].y = 210;

    let text1 = new PIXI.Text("Inhabited:", { fontFamily: 'Arial', fontSize: 20, fill: 'white' });
    text1.x = 5;
    text1.y = 5;
    holoContainer.addChild(text1);

    let text2 = new PIXI.Text("Uninhabited:", { fontFamily: 'Arial', fontSize: 20, fill: 'white' });
    text2.x = 5;
    text2.y = 85;
    holoContainer.addChild(text2);

    let text3 = new PIXI.Text("Market:", { fontFamily: 'Arial', fontSize: 20, fill: 'white' });
    text3.x = 5;
    text3.y = 165;
    holoContainer.addChild(text3);

    holoContainer.alpha = 0.8;
    return holoContainer;
  }

  update() {
    
  }

  clickPlanet(planet) {

    this.spaceShip.x = planet.x;
    this.spaceShip.y = planet.y - 64;
    
    if (this.lastPlanet != null) {
      this.highlightPath.moveTo(this.lastPlanet.x, this.lastPlanet.y);
      this.highlightPath.lineTo(planet.x, planet.y);
    }

    planet.setVisited();

    this.nextPlanetPath.clear();
    this.nextPlanetPath.lineStyle(3, 0xAAFFAA);

    for (let p of this.planets) {
      p.setActive(false);
    }

    for (let nextP of planet.nextPlanets) {
      nextP.setActive(true);
      this.nextPlanetPath.moveTo(planet.x, planet.y);
      this.nextPlanetPath.lineTo(nextP.x, nextP.y);
    }

    this.lastPlanet = planet;
    this.currentStage++;

    setActiveScreen(planet.getScreen(this.currentStage));
  }

  setupSpaceMap() {

    this.graph = createGraph();

    let starBackgroundRand = mulberry32(this.starBackgroundSeed);
    let spaceMapRand = mulberry32(this.spaceMapSeed);

    this.pdsObj = new PoissonDiskSampling({
      shape: [width, height],
      minDistance: 100,
      maxDistance: 200,
      tries: 20
    }, starBackgroundRand);

    let g = new PIXI.Graphics();
    g.beginFill(0xFFFFFF);
    for (let p of this.pdsObj.fill()) {
      g.drawCircle(p[0], p[1], starBackgroundRand() * 2 + 1);
    }
    g.endFill();

    this.container.addChild(g);

    this.pathGraphic = new PIXI.Graphics();
    this.container.addChild(this.pathGraphic);
    this.pathGraphic.lineStyle(2, 0x8080FF);

    this.highlightPath = new PIXI.Graphics();
    this.container.addChild(this.highlightPath);
    this.highlightPath.lineStyle(3, 0xFFFF80);

    this.nextPlanetPath = new PIXI.Graphics();
    this.container.addChild(this.nextPlanetPath);

    let grid = [];
    for (let i = 0; i < this.layers; i++) {
      let tempGrid = [];
      for (let j = 0; j < this.pathCount; j++) {
        tempGrid.push([(i + 1) + ((spaceMapRand() * 0.4) - 0.2), j + ((spaceMapRand() * 0.4) - 0.2)]);
      }
      grid.push(tempGrid);
    }

    for (let i = 0; i < this.layers - 1; i++) {
      for (let j = 0; j < this.pathCount; j++) {
        this.graph.addLink(grid[i][j], grid[i + 1][j], {
          weight: 1 + Math.abs(j - Math.floor(this.pathCount / 2))
        });

        if (j != 0) {
          this.graph.addLink(grid[i][j], grid[i + 1][j - 1], {
            weight: 1.5 + Math.max(0, Math.floor(this.pathCount / 2) - j)
          });
        }

        if (j != this.pathCount - 1) {
          this.graph.addLink(grid[i][j], grid[i + 1][j + 1], {
            weight: 1.5 + Math.max(0, j - Math.floor(this.pathCount / 2))
          });
        }
      }
    }

    this.graph.addLink(this.startPoint, grid[0][this.startPoint[1]], {
      weight: 1
    });
    this.graph.addLink(this.startPoint, grid[0][this.startPoint[1] - 1], {
      weight: 1.5
    });
    this.graph.addLink(this.startPoint, grid[0][this.startPoint[1] + 1], {
      weight: 1.5
    });

    this.graph.addLink(grid[this.layers - 1][this.endPoint[1]], this.endPoint, {
      weight: 1
    });
    this.graph.addLink(grid[this.layers - 1][this.endPoint[1] - 1], this.endPoint, {
      weight: 1.5
    });
    this.graph.addLink(grid[this.layers - 1][this.endPoint[1] + 1], this.endPoint, {
      weight: 1.5
    });

    /*
    for (let i = 0; i < this.layers; i++) {
      let rnd = Math.floor(Math.random() * this.pathCount);
      this.graph.removeNode(grid[i][rnd]);
    }
    */

    let activePoints = [];
    let pathPositions = [];

    let allPaths = [];

    for (let i = 0; i < this.layers * 1.5; i++) {

      const pathFinder = ngraphPath.aStar(this.graph, {
        distance(fromNode, toNode, link) {
          return link.data.weight;
        }
      });

      const foundPath = pathFinder.find(this.startPoint, this.endPoint);

      if (foundPath.length === 0) {
        break;
      }

      allPaths.push(foundPath);

      activePoints.push(...foundPath.map(obj => obj.id));

      this.pathGraphic.moveTo((this.endPoint[0] / (this.layers + 1)) * (width - 200) + 100, (this.endPoint[1] / (this.pathCount - 1)) * (height - 400) + 200);
      for (let j = 0; j < foundPath.length; j++) {
        let posX = (foundPath[j].id[0] / (this.layers + 1)) * (width - 200) + 100;
        let posY = (foundPath[j].id[1] / (this.pathCount - 1)) * (height - 400) + 200;
        this.pathGraphic.lineTo(posX, posY);
      }

      if (pathPositions.length == 0) {
        pathPositions = Array(this.layers).fill().map((v, i) => i);
      }

      const idx = Math.floor(spaceMapRand() * pathPositions.length);
      const posID = pathPositions.splice(idx, 1)[0] + 1;
      this.graph.removeNode(foundPath[posID].id);

    }

    for (let p of [...new Set(activePoints)]) {
      let posX = (p[0] / (this.layers + 1)) * (width - 200) + 100;
      let posY = (p[1] / (this.pathCount - 1)) * (height - 400) + 200;

      let type = "default";

      if (p == this.startPoint) {
        type = "start";
      }

      if (p == this.endPoint) {
        //TODO: Boss planet
      }

      let planet = new Planet(posX, posY, p, type, this.createPlanetSeed());
      
      this.planets.push(planet);
      this.container.addChild(planet);
    }

    for (let path of allPaths) {
      for (let i = path.length - 1; i > 0; i--) {
        let planet = this.planets.find(p => p.planetID === path[i].id);
        let nextPlanet = this.planets.find(p => p.planetID === path[i - 1].id);

        planet.nextPlanets.push(nextPlanet);
      }
    }

  }

  createPlanetSeed() {
    return Math.round(this.planetSeedRand() * 0xFFFFFFFF);
  }


}