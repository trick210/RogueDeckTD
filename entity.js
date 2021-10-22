class Entity extends PIXI.Sprite {

  constructor(posX, posY, entityWidth, entityHeight, texture) {
    super(texture);

    this.x = posX;
    this.y = posY;
    this.width = entityWidth;
    this.height = entityHeight;

    this.layer = 0;

    this.tag = "entity";
  }

  update() {
    
  }

  remove() {
    gameScreen.entityContainer.removeChild(this);
  }
}