class MinigunTower extends BulletTower {

  constructor() {
    super();

    this.name = "Minigun Tower";

    this.cost = 3;

    this.setTC(4);

    this.setDMG(20);

    this.setAS(4);

    this.initialAS = this.baseAS;

    this.setRange(200);

    this.setMissileSpeed(1200);

    
    this.texture = new PIXI.Sprite(resources['minigunTower'].texture);
    this.texture.width = 64;
    this.texture.height = 64;
    this.texture.anchor.set(0.5, 0.2);
    
    this.addChild(this.texture);

    this.shootCD = 1000 / this.attackSpeed;
    this.projectileColor = 0x0000FF;

    this.ASBuff = 1;
    this.stacks = 0;
    this.maxStacks = 6;

    /*
    let buffEffect = tower => { tower.attackSpeed += this.ASBuff };

    this.barrelSpeed = new Buff("Barrel Speed", buffTags.ATTACKSPEED, buffEffect);
    this.barrelSpeed.setStacks(0, 6);

    this.addBuff(this.barrelSpeed);
    */

    this.stackLoss = 4;
    this.stackLossPassive = 1;
    this.stackCD = 500;
    this.stackClock = 0 
    this.oldTarget = null;
    
  }

  update() {

    this.baseAS = this.initialAS + this.stacks * this.ASBuff;

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
          this.stacks = Math.min(this.maxStacks, this.stacks + 1);
        } else {
          this.stacks = Math.max(0, this.stacks - this.stackLoss);
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
          this.stacks = Math.max(0, this.stacks - this.stackLossPassive);
          this.stackClock -= this.stackCD;
        }
      }
    } else {
      this.stacks = 0;
    }
  }


  getCardText() {
    let text = 
      "Damage: " + this.dmg + "\n" +
      "Attack speed: " + this.attackSpeed + " - " + (this.attackSpeed + this.maxStacks * this.ASBuff) + "\n\n" +
      "Shooting the same\n" +
      "target consecutively\n" +
      "grants a stack of\n" +
      "BarrelSpeed up to " + this.maxStacks + ".\n" +
      "Lose " + this.stackLoss + " stacks upon\n" +
      "switching targets.\n" +
      "Lose "+ this.stackLossPassive + " stack each\n" +
      this.stackCD / 1000 + "s of not shooting.\n" + 
      "BarrelSpeed: gain\n" + 
      this.ASBuff + " attack speed."


    return text;
  }

  getStats() {
    let text = 
      "TC: " + this.TC +
      "\nDamage: " + this.dmg +
      "\nAttack speed: " + this.attackSpeed +
      "\nRange: " + this.range +
      "\nDPS: " + this.getDPS() +
      "\n\nBarrel Speed: " + this.stacks + " stacks"

      return text;
  }

}
