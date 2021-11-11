class SniperNest extends DamageTower {

  constructor() {
    super();

    this.name = "Sniper Nest";

    this.cost = 5;

    this.setTC(4);

    this.setDMG(400);

    this.setAS(0.5);

    this.setRange(600);

    this.setMissileSpeed(3000);

    this.dmgBuff = 0.5;

    this.towerEffects.push(() => this.dmg += this.dmg * this.dmgBuff);

    this.tags.push(towerTags.STAT_SUPPORT);
    this.tags.push(towerTags.BULLET);

    
    this.texture = new PIXI.Sprite(resources['sniperNest'].texture);
    this.texture.width = 128;
    this.texture.height = 128;
    this.texture.anchor.set(0.5);
    this.texture.circular = true;
    this.texture.radius = 64;
    
    this.addChild(this.texture);

    this.projectileColor = 0x808080;
    
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

      return true;
    }

    return false;
  }


  getCardText() {
    let text = 
      "Damage: " + this.dmg + "\n" +
      "Range: " + this.range + "\n" +
      "Attack speed: " + this.attackSpeed + "\n" +
      "DPS: " + this.getDPS() + "\n\n" +
      "All damage dealt\n" +
      "by this tower\n" +
      "increases by " + this.dmgBuff * 100 + "%";

    return text;
  }

  updateStats() {
    let text = 
      "TC: " + this.TC +
      "\nDamage: " + this.dmg +
      "\nAttack speed: " + this.attackSpeed +
      "\nRange: " + this.range +
      "\nDPS: " + this.getDPS() +
      "\n\nThis tower has " + this.dmgBuff * 100 + "%" +
      "\nincreased damage";

      this.infoText.text = text;
  }

}
