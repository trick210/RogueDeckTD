class BaseTower extends Tower {

  constructor() {
    super();

    this.name = "Base Tower";

    this.cost = 2;

    this.baseDmg = 50;
    this.dmg = this.baseDmg;
    this.attackSpeed = 2;

    this.range = 200;
    this.rangeCollider.radius = this.range;

    this.missileSpeed = 15;

    this.dps = this.dmg * this.attackSpeed;

    this.tags.push(towerTags.BULLET);
    this.tags.push(towerTags.DAMAGE);

    /*
    this.texture = new PIXI.Graphics();
    this.texture.beginFill(0xFF5050);
    this.texture.drawCircle(this.x, this.y - 40, 20);
    this.texture.endFill();
    this.texture.beginFill(0xAAAAFF);
    this.texture.drawRoundedRect(this.x - 16, this.y - 32, 32, 64, 10);
    this.texture.endFill();
    */
    
    this.texture = new PIXI.Sprite(resources['baseTower'].texture);
    this.texture.width = 48;
    this.texture.height = 96;
    this.texture.anchor.set(0.5, 0.2);
    
    this.addChild(this.texture);

    this.shootCD = 1000 / this.attackSpeed;
    this.projectileColor = 0xFF00FF;
    
  }

  update() {

    if (this.placed && gameScreen.levelStarted) {

      super.update();

      this.projectileColor = this.buffed ? 0xFFFF00 : 0xFF00FF;
      this.texture.tint = this.buffed ? 0xFF00FF : 0xFFFFFF;

      if (this.shootCD < 1000 / this.attackSpeed) {
        this.shootCD += deltaTime;
        return;
      }

      let monster = gameScreen.entityContainer.children.filter(e => e.type == entityType.MONSTER).sort((a, b) => a.spawnIndex - b.spawnIndex);

      let monsterHit = null;
      let vx, vy;

      for (let i = 0; i < monster.length; i++) {
        let collision = collider.hit(this.rangeCollider, monster[i].texture, false, false, true)
        if (collision) {
          monsterHit = monster[i];
          vx = monsterHit.texture.gx + monsterHit.texture.width / 2 - monsterHit.texture.xAnchorOffset - 
            (this.rangeCollider.gx + this.rangeCollider.width / 2 - this.rangeCollider.xAnchorOffset);

          vy = monsterHit.texture.gy + monsterHit.texture.width / 2 - monsterHit.texture.yAnchorOffset - 
            (this.rangeCollider.gy + this.rangeCollider.width / 2 - this.rangeCollider.yAnchorOffset);

          let mag = Math.sqrt(vx * vx + vy * vy);

          vx = vx / mag;
          vy = vy / mag;

          break;
        }
      }

      if (monsterHit != null) {
        
        let missile = new BaseProjectile(this.x, this.y, vx, vy, this.dmg, this.missileSpeed, this.range, this.projectileColor);
        missile.addToStage();

        this.shootCD = deltaTime;
      }
    }
  }


  getCardText() {
    let text = 
      "Damage: " + this.dmg + "\n" +
      "Range: " + this.range + "\n" +
      "Attack speed: " + this.attackSpeed + "\n" +
      "DPS: " + this.dps;

    return text;
  }

}

class BaseProjectile extends Entity {

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
    this.texture.drawCircle(0, 0, 10);
    this.texture.endFill();
    this.addChild(this.texture);

    this.rangeCollider = new PIXI.Sprite();
    this.rangeCollider.circular = true;
    this.rangeCollider.radius = 5;
    this.addChild(this.rangeCollider);

    this.distance = 0;
  }

  update() {

    if (this.distance >= this.range) {
      this.remove();
    }

    let distX = this.vx * this.speed * (deltaTime / 20);
    let distY = this.vy * this.speed * (deltaTime / 20);

    this.x += distX;
    this.y += distY;

    this.distance += Math.sqrt(distX * distX + distY * distY);

    
    let monster = gameScreen.entityContainer.children.filter(e => e.type == entityType.MONSTER).sort((a, b) => a.spawnIndex - b.spawnIndex);

    let monsterHit = null;

    for (let i = 0; i < monster.length; i++) {
      let collision = collider.hit(this.rangeCollider, monster[i].texture, false, false, true)
      if (collision) {
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