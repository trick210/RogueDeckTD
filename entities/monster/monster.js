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

    this.showBar = true;

    this.barSize = {
      x: -24,
      y: -45,
      width: 48,
      height: 5,
      frameWidth: 1
    };

    this.hpFrame = new PIXI.Graphics();

    this.addChild(this.hpFrame);


    this.setArmor(0);
    this.setHP(hp);

    this.immune = false;

    //this.drawHPBar();

  }

  update() {


    this.distTraveled += this.speed * deltaTime / 1000;

    let newPos = gameScreen.map.getPosition(this.distTraveled);

    if (newPos == null) {
      gameScreen.recieveDamage(Math.ceil(this.hp * this.damageMultiplier));
      this.remove();
      this.onLeak();
    } else {

      this.x = newPos.x;
      this.y = newPos.y;

      this.rotate(newPos.rot);
    }



    if (this.oldhp != this.hp) {

      this.drawHPBar();

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

    if (this.immune) return;

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
      this.onDeath();
    }

    origin.countDamage(amount);
  }

  drawHPBar() {
    this.hpBar.clear();
    this.hpFrame.clear();

    if (this.showBar) {
      this.hpBar.beginFill(0xFF3030);
      this.hpBar.drawRect(this.barSize.x, this.barSize.y, this.barSize.width * (this.hp / this.maxHP), this.barSize.height);
      this.hpBar.endFill();


      this.hpFrame.lineStyle(this.barSize.frameWidth, 0x000000, 1);
      this.hpFrame.drawRect(this.barSize.x, this.barSize.y, this.barSize.width, this.barSize.height);
    }
  }

  onDeath() {

  }

  onLeak() {

  }

  rotate(rot) {

  }

}