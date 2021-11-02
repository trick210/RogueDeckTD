class MinigunTower extends BulletTower {

  constructor() {
    super();

    this.name = "Minigun Tower";

    this.cost = 3;

    this.setDMG(20);

    this.setAS(4);

    this.setRange(200);

    this.setMissileSpeed(600);

    
    this.texture = new PIXI.Sprite(resources['minigunTower'].texture);
    this.texture.width = 64;
    this.texture.height = 64;
    this.texture.anchor.set(0.5, 0.2);
    
    this.addChild(this.texture);

    this.shootCD = 1000 / this.attackSpeed;
    this.projectileColor = 0x0000FF;

    this.ASBuff = 1;

    let buffEffect = tower => { tower.attackSpeed += this.ASBuff };

    this.barrelSpeed = new Buff("Barrel Speed", buffTags.ATTACKSPEED, buffEffect);
    this.barrelSpeed.setStacks(0, 6);

    this.buffs.push(this.barrelSpeed);

    this.stackLoss = 4;
    this.stackLossPassive = 1;
    this.stackCD = 500;
    this.stackClock = 0 
    this.oldTarget = null;
    
  }

  update() {
    super.update();

    if (this.placed && gameScreen.levelStarted) {

      //this.projectileColor = this.buffed ? 0x00FFFF : 0x0000FF;
      //this.texture.tint = this.buffed ? 0xFF00FF : 0xFFFFFF;

      if (this.shootCD < 1000 / this.attackSpeed) {
        this.shootCD += deltaTime;
        return;
      }

      let targets = this.getMonsterInRange();

      if (targets.length != 0) {

        if (this.oldTarget == targets[0]) {
          this.barrelSpeed.stacks = Math.min(this.barrelSpeed.maxStacks, this.barrelSpeed.stacks + 1);
        } else {
          this.barrelSpeed.stacks = Math.max(0, this.barrelSpeed.stacks - this.stackLoss);
        }

        this.stackClock = 0;
        this.oldTarget = targets[0];

        let v = this.getVector(targets[0]);
        
        let missile = new Bullet(this.x, this.y, v.vx, v.vy, this.dmg, this.missileSpeed, this.range, this.projectileColor);
        missile.addToStage();

        this.shootCD -= 1000 / this.attackSpeed;
      } else {

        this.stackClock += deltaTime;

        if (this.stackClock >= this.stackCD) {
          this.barrelSpeed.stacks = Math.max(0, this.barrelSpeed.stacks - this.stackLossPassive);
          this.stackClock -= this.stackCD;
        }
      }
    } else {
      this.barrelSpeed.stacks = 0;
    }
  }


  getCardText() {
    let text = 
      "Damage: " + this.dmg + "\n" +
      "Attack speed: " + this.attackSpeed + " - " + (this.attackSpeed + this.barrelSpeed.maxStacks * this.ASBuff) + "\n\n" +
      "Shooting the same\n" +
      "target consecutively\n" +
      "grants a stack of\n" +
      "BarrelSpeed up to " + this.barrelSpeed.maxStacks + ".\n" +
      "Lose " + this.stackLoss + " stacks upon\n" +
      "switching targets.\n" +
      "Lose "+ this.stackLossPassive + " stack each\n" +
      this.stackCD / 1000 + "s of not shooting.\n" + 
      "BarrelSpeed: gain\n" + 
      this.ASBuff + " attack speed."


    return text;
  }

}

