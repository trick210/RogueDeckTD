class Monster extends Entity {

  constructor(posX, posY) {
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


  }

  update() {


    this.distTraveled += this.speed * deltaTime / 1000;

    let newPos = gameScreen.map.getPosition(this.distTraveled);

    if (newPos == null) {
      gameScreen.recieveDamage(Math.ceil(this.hp / 100));
      this.remove();
    } else {

      this.x = newPos.x;
      this.y = newPos.y;
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

  recieveDamage(damageObj) {
    if (damageObj.percentagePen == null) damageObj.percentagePen = 0;
    if (damageObj.flatPen == null) damageObj.flatPen = 0;
    
    let amount = damageObj.amount;

    let effectiveArmor = this.armor * (1 - damageObj.percentagePen);

    effectiveArmor -= damageObj.flatPen;

    if (damageObj.damageType == "NORMAL") {
      this.hp -= 100 / (100 + effectiveArmor) * amount;
    } else {
      this.hp -= amount;
    }


    
    if (this.hp <= 0) {
      this.remove();
    }
  }

}