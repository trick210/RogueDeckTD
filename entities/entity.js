class Entity extends PIXI.Container {

  constructor(posX, posY) {
    super();

    this.x = posX;
    this.y = posY;

    this.layer = 0;

    this.type = entityType.NONE;
  }

  update() {
    
  }

  remove() {
    gameScreen.entityContainer.removeChild(this);
  }
}

const entityType = {
  NONE: "none",
  MONSTER: "monster",
  TOWER: "tower",
}