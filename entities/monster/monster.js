class Monster extends Entity {

  constructor(posX, posY) {
    super(posX, posY);

    this.type = entityType.MONSTER;

    this.tileIndex = 0;

    this.oldvx = 0;
    this.oldvy = 0;

    this.hpBar = new PIXI.Graphics();
    this.hpBar.beginFill(0xFF3030);
    this.hpBar.drawRect(8, -15, 48, 5);
    this.hpBar.endFill();
    this.addChild(this.hpBar);


  }

  update() {

    let tiles = gameScreen.map.tileLocations;
    let gridSize = gameScreen.map.gridSize;

    if (this.tileIndex + 1 < tiles.length) {
      let vx = tiles[this.tileIndex + 1][0] - tiles[this.tileIndex][0];
      let vy = tiles[this.tileIndex + 1][1] - tiles[this.tileIndex][1];

      if (vx != this.oldvx || vy != this.oldvy) {
        this.x = tiles[this.tileIndex][0] * gridSize;
        this.y = tiles[this.tileIndex][1] * gridSize;
      }

      this.oldvx = vx;
      this.oldvy = vy;

      this.x += vx * this.speed * (deltaTime / 20);
      this.y += vy * this.speed * (deltaTime / 20);

      if (-vx * (this.x - tiles[this.tileIndex + 1][0] * gridSize) <= 0 && -vy * (this.y - tiles[this.tileIndex + 1][1] * gridSize) <= 0) {
        this.tileIndex++;
      }

    } else {

      gameScreen.hp -= Math.ceil(this.hp / 100)
      this.remove();
    }

  }

}