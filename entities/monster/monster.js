class Monster extends Entity {

  static SPAWN(posX, posY, hp) {
    return new this(posX, posY, hp);
  }

  constructor(posX, posY, hp) {
    super(posX, posY);

    this.type = entityType.MONSTER;

    this.distTraveled = 0;

    this.oldvx = 0;
    this.oldvy = 0;
    this.oldhp = 0;



    this.hpBar = new PIXI.Graphics();
    this.addChild(this.hpBar);

    let hpFrame = new PIXI.Graphics();
    hpFrame.lineStyle(1, 0x000000, 1);
    hpFrame.beginFill(0xFFFFFF, 0);
    hpFrame.drawRect(-24, -45, 48, 5);
    hpFrame.endFill();

    this.addChild(hpFrame);


    this.setArmor(0);
    this.setHP(hp);

  }

  update() {


    this.distTraveled += this.speed * deltaTime / 1000;

    let newPos = gameScreen.map.getPosition(this.distTraveled);

    if (newPos == null) {
      gameScreen.recieveDamage(Math.ceil(this.hp * this.damageMultiplier));
      this.remove();
    } else {

      this.x = newPos.x;
      this.y = newPos.y;

      this.rotate(newPos.rot);
    }



    if (this.oldhp != this.hp) {
      this.hpBar.clear();
      this.hpBar.beginFill(0xFF3030);
      this.hpBar.drawRect(-24, -45, 48 * (this.hp / this.maxHP), 5);
      this.hpBar.endFill();

      this.oldhp = this.hp;
    }

  }

  setHP(hp) {
    this.hp = hp;
    this.maxHP = hp;
  }

  setArmor(armor) {
    this.armor = armor;
    this.baseArmor = armor;
  }

  recieveDamage(damageObj, origin) {
    if (damageObj.percentagePen == null) damageObj.percentagePen = 0;
    if (damageObj.flatPen == null) damageObj.flatPen = 0;
    
    let amount = damageObj.amount;

    let effectiveArmor = this.armor * (1 - damageObj.percentagePen);

    effectiveArmor -= damageObj.flatPen;

    if (damageObj.damageType == "NORMAL") {
      amount = 100 / (100 + effectiveArmor) * amount;
    }

    amount = Math.min(this.hp, amount);

    this.hp -= amount;
    
    if (this.hp <= 0) {
      this.remove();
    }

    origin.countDamage(amount);
  }

  rotate(rot) {

  }

}