class Tower extends Entity {

  constructor() {
    super(0, 0);

    this.cardType = cardType.TOWER;
    this.type = entityType.TOWER;

    this.tags = [];

    this.onMap = false;
    this.placed = false;

    this.rangeCollider = new PIXI.Sprite();
    this.rangeCollider.circular = true;
    this.rangeCollider.radius = 0;
    this.addChild(this.rangeCollider);

    this.rangeCircle = new PIXI.Graphics();

    this.layerOffset = 100;
    this.layer += this.layerOffset;

    this.buffs = [];
    this.buffed = false;

  }

  update() {

    this.dmg = this.baseDmg;
    this.attackSpeed = this.baseAS;

    for (let i = this.buffs.length - 1; i >= 0; i--) {
      let buff = this.buffs[i];

      if (buff.tags.includes(buffTags.TIMED)) {
        buff.duration -= deltaTime;
        if (buff.duration <= 0) {
          this.buffs.splice(this.buffs.indexOf(buff), 1);
          continue;
        }
      }

      for (let j = 0; j < buff.stacks; j++) {

        buff.effect(this);
      }

      
    }

    if (this.buffs.length == 0) {
      this.buffed = false;
    } else {
      this.buffed = true;
    }
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
    return monsterHit;
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

    return v;
  }

  enterMap(pos) {
    this.x = pos.x;
    this.y = pos.y;

    this.rangeCircle.clear();
    this.rangeCircle.lineStyle(4, 0x808080, 0.5);
    this.rangeCircle.beginFill(0xFFFFFF, 0.2);
    this.rangeCircle.drawCircle(0, 0, this.range);
    this.rangeCircle.endFill();
    
    let hit = this.canPlace(pos);

    this.rangeCircle.tint = !hit ? 0xFF8080 : 0xAAAAAA;

    this.onMap = true;

    this.addChildAt(this.rangeCircle, 0);
    this.addToStage();

  }

  hoverMap(pos) {

    if (!this.onMap) {
      return;
    }

    this.x = pos.x;
    this.y = pos.y;

    let hit = this.canPlace(pos);

    this.rangeCircle.tint = !hit ? 0xFF8080 : 0xAAAAAA;
  }

  leaveMap() {
    this.removeChild(this.rangeCircle);
    this.remove();
    this.onMap = false;
  }

  clickMap(pos) {
    if (this.canPlace(pos)) {
      this.x = pos.x;
      this.y = pos.y;

      this.removeChild(this.rangeCircle);
      this.placed = true;
      this.layer -= this.layerOffset;
      this.texture.interactive = true;
      this.texture.on('pointerover', this.enter.bind(this));
      this.texture.on("pointerout", this.leave.bind(this));
      return true;
    }

    return false;
  }

  canPlace(pos) {
    let obstacles = gameScreen.map.tileContainer.children.concat(
      gameScreen.entityContainer.children.filter(e => e.type == entityType.TOWER && e != this).map(e => e.texture));

    return !collider.hit(this.texture, obstacles, false, false, true);
  }

  enter() {
    this.addChildAt(this.rangeCircle, 0);
    this.entered = true;
    this.layer += this.layerOffset;
  }

  leave() {
    this.removeChild(this.rangeCircle);
    this.entered = false;
    this.layer -= this.layerOffset;
  }

  setDMG(dmg) {
    this.baseDmg = dmg;
    this.dmg = dmg;
  }

  setAS(as) {
    this.baseAS = as
    this.attackSpeed = as;
  }

  setRange(range) {
    this.baseRange = range;
    this.range = range;
    this.rangeCollider.radius = range;
  }

  setMissileSpeed(speed) {
    this.baseMissileSpeed = speed;
    this.missileSpeed = speed;
  }

}


const towerTags = {
  BULLET: "Tower shots spawn bullets",
  DAMAGE: "Tower deals damage to enemies",
  DEPLOYMENT: "Tower activates an effect upon deployment",
  CRIPPLE: "Tower reduces at least one stat",
  STAT_SUPPORT: "Tower increases at least one stat",
  AOE: "Tower has a round Aoe effect",
  DOT: "Tower has a Dot effect",
  CARD_GENERATOR: "Tower shuffles cards into your hand, draw or discard pile",
  LIFETIME: "Tower has a lifetime counter, that reduces by 1 per clear phase",
  ON_ATTACK: "Tower activates an effect upon commencing an attack",
  ON_HIT: "Tower activates an effect upon hitting an enemy",
  ON_KILL: "Tower activates an effect upon killing an enemy",
  ON_COOLDOWN: "Tower has an effect that activates every X seconds",
  MULTI_SHOT: "Tower can attack multiple targets simultaneously",
}

const buffTags = {

  DAMAGE: "Damage",
  ATTACKSPEED: "Attack speed",
  TIMED: "Timed",
  STACKS: "Stacks",
}

class Buff {
  constructor(name, buffedStat, effect) {
    this.name = name;
    this.buffedStat = buffedStat;
    this.effect = effect;

    this.stacks = 1;

    this.tags = [];
  }

  setDuration(duration) {
    this.duration = duration;
    this.baseDuration = duration;
    this.tags.push(buffTags.TIMED);
  }

  setStacks(stacks, maxStacks) {
    this.stacks = stacks;
    this.maxStacks = maxStacks;
    this.tags.push(buffTags.STACKS);
  }
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

    let distX = this.vx * this.speed * (deltaTime / 1000);
    let distY = this.vy * this.speed * (deltaTime / 1000);

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