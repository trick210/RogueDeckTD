class Walker extends Entity {

  constructor(posX, posY) {
    super(posX, posY, 64, 64, resources['walker'].texture);

    this.tag = "monster";

    this.speed = 3;

    this.damage = 1;

    this.hp = 60;

    this.tileIndex = 0;

    this.oldvx = 0;
    this.oldvy = 0;
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

      //deal damage
      this.remove();
    }

  }

}