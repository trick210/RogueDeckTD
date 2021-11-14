class Monster extends Entity {

  constructor(posX, posY) {
    super(posX, posY);

    this.type = entityType.MONSTER;

    this.tileIndex = 0;

    this.oldvx = 0;
    this.oldvy = 0;
    this.oldhp = 0;;

    this.hpBar = new PIXI.Graphics();
    this.addChild(this.hpBar);

    let hpFrame = new PIXI.Graphics();
    hpFrame.lineStyle(1, 0x000000, 1);
    hpFrame.beginFill(0xFFFFFF, 0);
    hpFrame.drawRect(8, -15, 48, 5);
    hpFrame.endFill();

    this.addChild(hpFrame);


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

      this.x += vx * this.speed * (deltaTime / 1000);
      this.y += vy * this.speed * (deltaTime / 1000);

      if (-vx * (this.x - tiles[this.tileIndex + 1][0] * gridSize) <= 0 && -vy * (this.y - tiles[this.tileIndex + 1][1] * gridSize) <= 0) {
        this.tileIndex++;
      }

    } else {

      gameScreen.recieveDamage(Math.ceil(this.hp / 100));
      this.remove();
    }


    if (this.oldhp != this.hp) {
      this.hpBar.clear();
      this.hpBar.beginFill(0xFF3030);
      this.hpBar.drawRect(8, -15, 48 * (this.hp / this.maxHP), 5);
      this.hpBar.endFill();

      this.oldhp = this.hp;
    }

  }

  setHP(hp) {
    this.hp = hp;
    this.maxHP = hp;
  }

  recieveDamage(amount) {
    this.hp -= amount;
    if (this.hp <= 0) {
      this.remove();
    }
  }

}