class BaseTower extends DamageTower {

  constructor() {
    super();

    this.name = "Base Tower";

    this.cost = 2;

    this.setTC(2);

    this.setDMG(50);

    this.setAS(2);

    this.setRange(200);

    this.setMissileSpeed(1000);

    this.tags.push(towerTags.BULLET);

    this.texture = new PIXI.Sprite();
    this.texture.circular = true;
    this.texture.radius = 48;
    //this.texture.anchor.set(0.5, 0.5);
    
    this.addChild(this.texture);

    this.graphic = new PIXI.Graphics();
    this.graphic.lineStyle(2, 0x000000, 1);
    this.graphic.beginFill(0x999999);
    this.graphic.drawCircle(0, 0, 32);
    this.graphic.endFill();
    this.graphic.beginFill(0x964B00);
    this.graphic.drawRect(-8, -48, 16, 50);
    this.graphic.endFill();
    this.texture.addChild(this.graphic);

    this.projectileColor = 0xFF00FF;
    
  }

  update() {
    super.update();

  }

  attackTargets(targets) {
    if (targets.length != 0) {

      let v = this.getVector(targets[0]);

      let rot = Math.PI / 2 + Math.atan2(v.vy, v.vx);

      this.texture.rotation = rot;
        
      let bulletX = this.x + this.texture.radius * v.vx;
      let bulletY = this.y + this.texture.radius * v.vy;

      let bulletRange = this.range - this.texture.radius;

      this.createBullet(bulletX, bulletY, v.vx, v.vy, this.dmg, this.missileSpeed, bulletRange, this.projectileColor);

      return [ targets[0] ];
    }

    return [];
  }


  getCardText() {
    let text = 
      "Damage: " + this.dmg + "\n" +
      "Range: " + this.range + "\n" +
      "Attack speed: " + this.attackSpeed + "\n" +
      "DPS: " + this.getDPS();

    return text;
  }

}
