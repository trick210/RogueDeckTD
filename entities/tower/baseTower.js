class BaseTower extends BulletTower {

  constructor() {
    super();

    this.name = "Base Tower";

    this.cost = 2;

    this.setDMG(50);

    this.setAS(2);

    this.setRange(200);

    this.setMissileSpeed(500);

    /*
    this.texture = new PIXI.Graphics();
    this.texture.beginFill(0xFF5050);
    this.texture.drawCircle(this.x, this.y - 40, 20);
    this.texture.endFill();
    this.texture.beginFill(0xAAAAFF);
    this.texture.drawRoundedRect(this.x - 16, this.y - 32, 32, 64, 10);
    this.texture.endFill();
    */
    
    this.texture = new PIXI.Sprite(resources['baseTower'].texture);
    this.texture.width = 48;
    this.texture.height = 96;
    this.texture.anchor.set(0.5, 0.2);
    
    this.addChild(this.texture);

    this.shootCD = 1000 / this.attackSpeed;
    this.projectileColor = 0xFF00FF;
    
  }

  update() {
    super.update();

    if (this.placed && gameScreen.levelStarted) {

      this.projectileColor = this.buffed ? 0xFFFF00 : 0xFF00FF;
      this.texture.tint = this.buffed ? 0xFF00FF : 0xFFFFFF;

      if (this.shootCD < 1000 / this.attackSpeed) {
        this.shootCD += deltaTime;
        return;
      }

      let targets = this.getMonsterInRange();

      if (targets.length != 0) {

        let v = this.getVector(targets[0]);
        
        let missile = new Bullet(this.x, this.y, v.vx, v.vy, this.dmg, this.missileSpeed, this.range, this.projectileColor);
        missile.addToStage();

        this.shootCD -= 1000 / this.attackSpeed;
      }
    }
  }


  getCardText() {
    let text = 
      "Damage: " + this.dmg + "\n" +
      "Range: " + this.range + "\n" +
      "Attack speed: " + this.attackSpeed + "\n" +
      "DPS: " + this.dps;

    return text;
  }

}
