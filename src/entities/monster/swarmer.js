class Swarmer extends Monster {

  static SPAWN(posX, posY, hp, spawnCD, rand) {
    let count = 5 + Math.floor(11 * rand());
    let swarmers = [];
    for (let i = 0; i < count; i++) {
      let unit = new this(posX, posY, Math.floor(hp / count));
      unit.spawnCD = spawnCD + i * 50;
      swarmers.push(unit);

    }
    return swarmers
  }

  static UNIT_COUNT = 6;
  static HEALTH_MULTIPLIER = 1.2;

  constructor(posX, posY, hp) {
    super(posX, posY, hp * Swarmer.HEALTH_MULTIPLIER);

    this.texture = new PIXI.Sprite(resources['swarmer'].texture);
    this.texture.width = 64;
    this.texture.height = 64;
    this.texture.circular = true;
    this.texture.radius = 32;

    this.texture.anchor.set(0.5);

    this.addChild(this.texture);

    this.speed = 250;

    this.damageMultiplier = 0.01;

    this.setArmor(30);

  }

  rotate(rot) {
    this.texture.rotation = rot;
  }


}