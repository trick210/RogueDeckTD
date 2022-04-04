class Bullet extends Entity {

  constructor(posX, posY, vx, vy, dmg, speed, range, color, srcTower) {
    super(posX, posY);

    this.type = entityType.PROJECTILE;

    this.layer = 10;
    this.vx = vx;
    this.vy = vy;
    this.dmg = dmg;
    this.range = range;
    this.speed = speed;

    this.srcTower = srcTower;
    this.percentagePen = srcTower.percentagePen;
    this.flatPen = srcTower.flatPen;

    this.tags = [];

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
      
      let dmgObj = {
        amount: this.dmg,
        damageType: "NORMAL",
        percentagePen: this.percentagePen,
        flatPen: this.flatPen
      }
      
      monsterHit.recieveDamage(dmgObj, this.srcTower);

      this.srcTower.onHit(monsterHit);

      if (this.tags.includes(bulletTags.AOE)) {
        this.aoeExplosion(monsterHit);
      }
      this.remove();
    }
    
  }


  aoeExplosion(monsterHit) {
    this.layer = -1;
    let p = {
      x: monsterHit.texture.gx + monsterHit.texture.width / 2 - monsterHit.texture.xAnchorOffset,
      y: monsterHit.texture.gy + monsterHit.texture.width / 2 - monsterHit.texture.yAnchorOffset,
    }

    this.x = p.x;
    this.y = p.y;

    let possibleTargets = gameScreen.entityContainer.children.filter(e => e.type == entityType.MONSTER);

    let rangeCollider = new PIXI.Sprite();
    rangeCollider.circular = true;
    rangeCollider.radius = this.aoeRange;
    this.addChild(rangeCollider);

    possibleTargets.forEach(target => {
      if (collider.hit(rangeCollider, target.texture, false, false, true)) {
        let dmgObj = {
          amount: this.dmg,
          damageType: "NORMAL"
        }
        target.recieveDamage(dmgObj, this.srcTower);
      }
    });

    /*
    let aoeCircle = new PIXI.Graphics();
    aoeCircle.lineStyle(2, 0xFF5050, 0.5);
    aoeCircle.beginFill(0xAAAAAA, 0.3);
    aoeCircle.drawCircle(0, 0, this.aoeRange);
    aoeCircle.endFill();

    this.addChild(aoeCircle);
    */

    gameScreen.explosiveRoundsEmitter.resetPositionTracking();
    gameScreen.explosiveRoundsEmitter.updateOwnerPos(p.x, p.y);
    gameScreen.explosiveRoundsEmitter.emit = true;

  }

}

const bulletTags = {
  AOE: "aoe",
}