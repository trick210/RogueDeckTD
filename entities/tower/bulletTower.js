class BulletTower extends Tower {

  constructor() {
    super();

    this.tags.push(towerTags.BULLET);
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
  }

  update() {
    super.update();
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



  canPlace(pos) {
    let obstacles = gameScreen.map.tileContainer.children.concat(
      gameScreen.entityContainer.children.filter(e => e.type == entityType.TOWER && e != this).map(e => e.texture));

    return !collider.hit(this.texture, obstacles, false, false, true);
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

  getStats() {
    let text = 
      "TC: " + this.TC +
      "\nDamage: " + this.dmg +
      "\nAttack speed: " + this.attackSpeed +
      "\nRange: " + this.range +
      "\nDPS: " + this.getDPS();

      return text;
  }



}

const targetOptions = {
  FIRST: 'first',
  LAST: 'last',
  STRONG: 'strong',
  WEAK: 'weak',
}



class Bullet extends Entity {

  constructor(posX, posY, vx, vy, dmg, speed, range, color) {
    super(posX, posY);

    this.type = entityType.PROJECTILE;

    this.layer = 10;
    this.vx = vx;
    this.vy = vy;
    this.dmg = dmg;
    this.range = range;
    this.speed = speed;

    this.texture = new PIXI.Graphics();
    this.texture.lineStyle(2, 0x000000, 1);
    this.texture.beginFill(color);
    this.texture.drawCircle(0, 0, 5);
    this.texture.endFill();
    this.addChild(this.texture);

    this.radius = 5;

    this.distance = 0;

    this.oldX = this.x;
    this.oldY = this.y;
  }

  update() {

    if (this.distance >= this.range) {
      this.remove();
    }

    let distX = this.vx * this.speed * (deltaTime / 1000);
    let distY = this.vy * this.speed * (deltaTime / 1000);

    this.oldX = this.x;
    this.oldY = this.y;

    this.x += distX;
    this.y += distY;

    this.distance += Math.sqrt(distX * distX + distY * distY);

    
    let monster = gameScreen.entityContainer.children.filter(e => e.type == entityType.MONSTER).sort((a, b) => a.spawnIndex - b.spawnIndex);

    let monsterHit = null;

    for (let i = 0; i < monster.length; i++) {      

      let p = {
        x: monster[i].texture.gx + monster[i].texture.width / 2 - monster[i].texture.xAnchorOffset,
        y: monster[i].texture.gy + monster[i].texture.width / 2 - monster[i].texture.yAnchorOffset,
      }

      let v = {
        x: this.x,
        y: this.y,
      }

      let w = {
        x: this.oldX,
        y: this.oldY,
      }

      let dist = distToSegment(p, v, w);

      if (dist < (monster[i].texture.radius + this.radius)) {
        monsterHit = monster[i];
        break;
      }
    }

    if (monsterHit != null) {
      monsterHit.recieveDamage(this.dmg);
      this.remove();
    }
    
  }

}