class MinigunTower extends DamageTower {

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

    this.tags.push(towerTags.BULLET);

    
    this.texture = new PIXI.Sprite();
    this.texture.circular = true;
    this.texture.radius = 32;
    //this.texture.anchor.set(0.5, 0.5);
    
    this.addChild(this.texture);

    this.graphic = new PIXI.Graphics();
    this.graphic.lineStyle(2, 0x000000, 1);
    this.graphic.beginFill(0x999999);
    this.graphic.drawCircle(0, 0, 24);
    this.graphic.endFill();
    this.graphic.beginFill(0x0000AA);
    this.graphic.drawRect(-4, -32, 8, 40);
    this.graphic.endFill();
    this.texture.addChild(this.graphic);

    this.projectileColor = 0x0000FF;

    this.ASBuff = 1;
    this.stacks = 0;
    this.maxStacks = 6;

    this.stackLoss = 4;
    this.stackLossPassive = 1;
    this.stackCD = 500;
    this.stackClock = 0 
    this.oldTarget = null;
    
  }

  update() {

    this.baseAS = this.initialAS + this.stacks * this.ASBuff;

    super.update();

    if (!this.placed || !gameScreen.levelStarted) {
      this.stacks = 0;
    }
  }

  attackTargets(targets) {
    if (targets.length != 0) {

      if (this.oldTarget == targets[0]) {
        this.stacks = Math.min(this.maxStacks, this.stacks + 1);
      } else {
        this.stacks = Math.max(0, this.stacks - this.stackLoss);
      }

      this.stackClock = 0;
      this.oldTarget = targets[0];

      let v = this.getVector(targets[0]);

      let rot = Math.PI / 2 + Math.atan2(v.vy, v.vx);

      this.texture.rotation = rot;
        
      let bulletX = this.x + this.texture.radius * v.vx;
      let bulletY = this.y + this.texture.radius * v.vy;

      let bulletRange = this.range - this.texture.radius;
        
      this.createBullet(bulletX, bulletY, v.vx, v.vy, this.dmg, this.missileSpeed, bulletRange, this.projectileColor);

      return true;
    } else {

      this.stackClock += deltaTime;

      if (this.stackClock >= this.stackCD) {
        this.stacks = Math.max(0, this.stacks - this.stackLossPassive);
        this.stackClock -= this.stackCD;
      }

      return false;
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

  updateStats() {
    let text = 
      "TC: " + this.TC +
      "\nDamage: " + this.dmg +
      "\nAttack speed: " + this.attackSpeed +
      "\nRange: " + this.range +
      "\nDPS: " + this.getDPS() +
      "\n\nBarrel Speed: " + this.stacks + " stacks"

      this.infoText.text = text;
  }

}

