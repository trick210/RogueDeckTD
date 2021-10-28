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

  addToStage() {
    gameScreen.entityContainer.addChild(this);
  }
}

const entityType = {
  NONE: "none",
  MONSTER: "monster",
  TOWER: "tower",
  PROJECTILE: "projectile",
  SPELL_EFFECT: "spell effect",
}