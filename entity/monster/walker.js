class Walker extends Monster {

  constructor(posX, posY) {
    super(posX, posY, 64, 64);

    this.addChild(new PIXI.Sprite(resources['walker'].texture));

    this.speed = 3;

    this.damage = 1;

    this.hp = 60;

 
  }


}