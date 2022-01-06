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

    this.setupSpaceMap();



  }

  update() {

  }

  clickPlanet(planet) {

    
    if (this.lastPlanet != null) {
      this.highlightPath.moveTo(this.lastPlanet.x, this.lastPlanet.y);
      this.highlightPath.lineTo(planet.x, planet.y);
    }

    planet.setVisited();

    for (let p of this.planets) {
      p.setActive(false);
    }

    for (let nextP of planet.nextPlanets) {
      nextP.setActive(true);
    }

    this.lastPlanet = planet;

    gameScreen = new GameScreen();
    setActiveScreen(gameScreen);
  }

  setupSpaceMap() {

    this.graph = createGraph();

    this.pdsObj = new PoissonDiskSampling({
      shape: [width, height],
      minDistance: 100,
      maxDistance: 200,
      tries: 20
    }, Math.random);

    let g = new PIXI.Graphics();
    g.beginFill(0xFFFFFF);
    for (let p of this.pdsObj.fill()) {
      g.drawCircle(p[0], p[1], Math.random() * 2 + 1);
    }
    g.endFill();

    this.container.addChild(g);

    this.pathGraphic = new PIXI.Graphics();
    this.container.addChild(this.pathGraphic);
    this.pathGraphic.lineStyle(2, 0x8080FF);

    this.highlightPath = new PIXI.Graphics();
    this.container.addChild(this.highlightPath);
    this.highlightPath.lineStyle(10, 0x8080FF);

    let grid = [];
    for (let i = 0; i < this.layers; i++) {
      let tempGrid = [];
      for (let j = 0; j < this.pathCount; j++) {
        tempGrid.push([(i + 1) + ((Math.random() * 0.4) - 0.2), j + ((Math.random() * 0.4) - 0.2)]);
      }
      grid.push(tempGrid);
    }

    for (let i = 0; i < this.layers - 1; i++) {
      for (let j = 0; j < this.pathCount; j++) {
        this.graph.addLink(grid[i][j], grid[i + 1][j], {
          weight: 1
        });

        if (j != 0) {
          this.graph.addLink(grid[i][j], grid[i + 1][j - 1], {
            weight: 1.5
          });
        }

        if (j != this.pathCount - 1) {
          this.graph.addLink(grid[i][j], grid[i + 1][j + 1], {
            weight: 1.5
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

      const idx = Math.floor(Math.random() * pathPositions.length);
      const posID = pathPositions.splice(idx, 1)[0] + 1;
      this.graph.removeNode(foundPath[posID].id);

    }

    for (let p of [...new Set(activePoints)]) {
      let posX = (p[0] / (this.layers + 1)) * (width - 200) + 100;
      let posY = (p[1] / (this.pathCount - 1)) * (height - 400) + 200;
      let planet = new Planet(posX, posY, p);
      if (p === this.startPoint) {
        planet.setActive(true);
      }
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


}