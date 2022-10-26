class Walker extends Monster {

  static UNIT_COUNT = 10;

  constructor(posX, posY, hp) {
    super(posX, posY, hp);

    this.texture = new PIXI.Sprite(resources['walker'].texture);
    this.texture.width = 64;
    this.texture.height = 64;
    this.texture.circular = true;
    this.texture.radius = 32;

    this.texture.anchor.set(0.5);

    this.addChild(this.texture);

    this.speed = 150;

    this.damageMultiplier = 0.01;

 
  }


}