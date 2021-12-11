class DamageTower extends Tower {

  constructor() {
    super();

    this.tags.push(towerTags.DAMAGE);

    this.buttonContainer = new PIXI.Container();

    
    this.targetFirst = new Button("First", 0, 0, 80, 40, this.clickFirst.bind(this), 16);
    this.targetLast = new Button("Last", 0, 50, 80, 40, this.clickLast.bind(this), 16);
    this.targetStrong = new Button("Strong", 0, 100, 80, 40, this.clickStrong.bind(this), 16);
    this.targetWeak = new Button("Weak", 0, 150, 80, 40, this.clickWeak.bind(this), 16);
    this.buttonContainer.addChild(this.targetFirst);
    this.buttonContainer.addChild(this.targetLast);
    this.buttonContainer.addChild(this.targetStrong);
    this.buttonContainer.addChild(this.targetWeak);

    this.clickFirst();

    this.shootCD = 1000 / this.attackSpeed;
  }

  update() {
    super.update();

    if (this.placed && gameScreen.levelStarted) {

      if (this.shootCD < 1000 / this.attackSpeed) {
        this.shootCD += deltaTime;
        return;
      }

      let targets = this.getMonsterInRange();
      let attackedTargets = this.attackTargets(targets);
      if (attackedTargets.length > 0) {
        this.shootCD = 0;
        attackedTargets.forEach(target => this.onAttack(target));
      }
    } else {
      this.shootCD = 1000 / this.attackSpeed;
    }
  }

  attackTargets(targets) {
    return [];
  }



  getMonsterInRange() {
    let monster = gameScreen.entityContainer.children.filter(e => e.type == entityType.MONSTER).sort((a, b) => a.spawnIndex - b.spawnIndex);

    let monsterHit = [];

    for (let i = 0; i < monster.length; i++) {
      let collision = collider.hit(this.rangeCollider, monster[i].texture, false, false, true)
      if (collision) {
        monsterHit.push(monster[i]);
      }
    }

    switch(this.targetOption) {
      case targetOptions.FIRST:
        return monsterHit;
      case targetOptions.LAST:
        return monsterHit.reverse();
      case targetOptions.STRONG:
        return monsterHit.sort((a, b) => b.hp - a.hp);
      case targetOptions.WEAK:
        return monsterHit.sort((a, b) => a.hp - b.hp);
    }
    
  }

  getVector(monster) {
    let v = new Object();

    v.vx = monster.texture.gx + monster.texture.width / 2 - monster.texture.xAnchorOffset - 
      (this.rangeCollider.gx + this.rangeCollider.width / 2 - this.rangeCollider.xAnchorOffset);

    v.vy = monster.texture.gy + monster.texture.width / 2 - monster.texture.yAnchorOffset - 
      (this.rangeCollider.gy + this.rangeCollider.width / 2 - this.rangeCollider.yAnchorOffset);

    let mag = Math.sqrt(v.vx * v.vx + v.vy * v.vy);

    v.vx /= mag;
    v.vy /= mag;

    v.mag = mag;

    return v;
  }

  createBullet(x, y, vx, vy, dmg, missileSpeed, bulletRange, projectileColor) {
    let bullet = new Bullet(x, y, vx, vy, dmg, missileSpeed, bulletRange, projectileColor);
    this.bulletBuffs.forEach(buff => buff(bullet));
    bullet.addToStage();
  }

  clickFirst() {
    this.targetOption = targetOptions.FIRST;

    this.targetFirst.disable();
    this.targetLast.enable();
    this.targetStrong.enable();
    this.targetWeak.enable();
  }

  clickLast() {
    this.targetOption = targetOptions.LAST;

    this.targetFirst.enable();
    this.targetLast.disable();
    this.targetStrong.enable();
    this.targetWeak.enable();
  }

  clickStrong() {
    this.targetOption = targetOptions.STRONG;

    this.targetFirst.enable();
    this.targetLast.enable();
    this.targetStrong.disable();
    this.targetWeak.enable();
  }

  clickWeak() {
    this.targetOption = targetOptions.WEAK;

    this.targetFirst.enable();
    this.targetLast.enable();
    this.targetStrong.enable();
    this.targetWeak.disable();
  }

  updateStats() {
    let text = 
      "TC: " + this.TC +
      "\nDamage: " + this.dmg +
      "\nAttack speed: " + this.attackSpeed +
      "\nRange: " + this.range +
      "\nDPS: " + this.getDPS();

      this.infoText.text = text;
  }



}

const targetOptions = {
  FIRST: 'first',
  LAST: 'last',
  STRONG: 'strong',
  WEAK: 'weak',
}
