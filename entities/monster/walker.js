class Walker extends Monster {

  constructor(posX, posY, hp, armor) {
    super(posX, posY);

    this.texture = new PIXI.Sprite(resources['walker'].texture);
    this.texture.width = 64;
    this.texture.height = 64;
    this.texture.circular = true;
    this.texture.radius = 32;

    this.texture.anchor.set(0.5);

    this.addChild(this.texture);

    this.speed = 150;

    this.damage = 1;

    this.setHP(hp);

    this.setArmor(armor);

 
  }


}