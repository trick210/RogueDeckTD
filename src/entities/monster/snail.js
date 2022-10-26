class Snail extends Monster {

  static UNIT_COUNT = 6;
  static HEALTH_MULTIPLIER = 1.5;

  constructor(posX, posY, hp) {
    super(posX, posY, hp * Snail.HEALTH_MULTIPLIER);

    this.texture = new PIXI.Sprite(resources['snail'].texture);
    this.texture.width = 64;
    this.texture.height = 64;
    this.texture.circular = true;
    this.texture.radius = 32;

    this.texture.anchor.set(0.5);

    this.addChild(this.texture);

    this.speed = 50;

    this.damageMultiplier = 0.01;

    this.setArmor(150);

    this.transformed = false;

    this.transformThreshold = 0.5;

    this.transformSpeed = 2;

    this.transformTexture = resources['snail2'].texture;


  }

  update() {
    super.update();

    if (!this.transformed && this.hp <= this.maxHP * this.transformThreshold) {
      this.transformed = true;
      this.setArmor(0);
      this.speed *= this.transformSpeed;
      this.texture.texture = this.transformTexture;
    }
  }

  rotate(rot) {
    this.texture.rotation = rot;
  }


}