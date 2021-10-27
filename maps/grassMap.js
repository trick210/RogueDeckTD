class GrassMap {

  constructor() {

    this.gridSize = 64;
    this.mapWidth = 30;
    this.mapHeight = 12;

    this.startPos = [-1, 5];

    this.bg = new Sprite(PIXI.Texture.WHITE);
    this.bg.width = width;
    this.bg.height = height - 300;
    this.bg.tint = 0x00AA00;

    this.tileContainer = new PIXI.Container();

    this.setupMap();

    this.setupMonster();



    this.container = new PIXI.Container();
    this.container.addChild(this.bg);
    this.container.addChild(this.tileContainer);
  }



  setupMonster() {

    this.level = [];

    for (let l = 0; l < 5; l++) {

      let monster = [];

      for (let i = 0; i < 10; i++) {
        monster.push(new Walker(this.startPos[0] * this.gridSize, this.startPos[1] * this.gridSize))
      }

      this.level.push(monster);

    }

  }


  setupMap() {

    this.tileLocations = [];

    this.tileLocations.push( 
      [-1, 5],
      [0, 5],
      [1, 5],
      [2, 5],
      [3, 5],
      [3, 4],
      [3, 3],
      [4, 3],
      [5, 3],
      [6, 3],
      [6, 2],
      [6, 1],
      [7, 1],
      [8, 1],
      [9, 1],
      [10, 1],
      [11, 1],
      [11, 2],
      [11, 3],
      [11, 4],
      [10, 4],
      [9, 4],
      [9, 5],
      [9, 6],
      [9, 7],
      [9, 8],
      [9, 9],
      [10, 9],
      [11, 9],
      [12, 9],
      [13, 9],
      [14, 9],
      [15, 9],
      [16, 9],
      [17, 9],
      [18, 9],
      [18, 8],
      [18, 7],
      [18, 6],
      [18, 5],
      [18, 4],
      [17, 4],
      [16, 4],
      [16, 3],
      [16, 2],
      [16, 1],
      [17, 1],
      [18, 1],
      [19, 1],
      [20, 1],
      [21, 1],
      [22, 1],
      [23, 1],
      [24, 1],
      [24, 2],
      [24, 3],
      [24, 4],
      [24, 5],
      [24, 6],
      [24, 7],
      [25, 7],
      [26, 7],
      [27, 7],
      [28, 7],
      [29, 7],
      [30, 7] );

    for (let i = 0; i < this.tileLocations.length; i++) {

      let pos = this.tileLocations[i];

      let tile = new Sprite(PIXI.Texture.WHITE);

      tile.width = 64;
      tile.height = 64;
      tile.x = pos[0] * this.gridSize;
      tile.y = pos[1] * this.gridSize;
      tile.tint = 0xC2B280;

      this.tileContainer.addChild(tile);


    }
  }

}