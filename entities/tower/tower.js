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

    this.buffContainer = new PIXI.Container();
    this.buffContainer.on('childAdded', this.sortBuffs.bind(this));
    this.buffContainer.on('childRemoved', this.sortBuffs.bind(this));

    this.infoContainer = new PIXI.Container();
    this.infoText = new PIXI.Text("text", {fontFamily: 'Arial', fontSize: 20, fill: 0x000000});
    this.infoContainer.addChild(this.infoText);

    this.layerOffset = 100;
    this.layer += this.layerOffset;

    this.buffs = [];
    this.buffed = false;

    this.bulletBuffs = [];

    this.towerEffects = [];

    this.clicked = false;
    this.entered = false;

  }

  update() {

    this.dmg = this.baseDmg;
    this.attackSpeed = this.baseAS;
    this.range = this.baseRange;
    this.cooldown = this.baseCooldown;
    this.TC = this.baseTC;

    this.bulletBuffs = [];

    for (let i = this.buffs.length - 1; i >= 0; i--) {
      let buff = this.buffs[i];

      if (this.placed && gameScreen.levelStarted) {
        if (buff.tags.includes(buffTags.TIMED)) {
          buff.duration -= deltaTime;
          if (buff.duration <= 0) {
            this.removeBuff(buff);
            continue;
          }
        }
      }


      buff.effect(this);

      buff.updateBuffIcon();
      
        
    }

    this.attackSpeed *= Math.min(gameScreen.maxTC / gameScreen.currentTC, 1);
    this.cooldown  /= Math.min(gameScreen.maxTC / gameScreen.currentTC, 1);

    this.attackSpeed = Math.round(this.attackSpeed * 100) / 100;
    this.cooldown = Math.round(this.cooldown);

    this.rangeCollider.radius = this.range;

    
    this.buffed = this.buffs.length != 0;

    this.towerEffects.forEach(effect => effect());
    

    if (this.entered) {
      this.rangeCircle.clear();
      this.rangeCircle.lineStyle(4, 0x808080, 0.5);
      this.rangeCircle.beginFill(0xFFFFFF, 0);
      this.rangeCircle.drawCircle(0, 0, this.range);
      this.rangeCircle.endFill();
    }
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
      this.texture.on('mouseover', this.enter.bind(this));
      this.texture.on("mouseout", this.leave.bind(this));
      this.texture.on("click", this.click.bind(this));

      this.enter();
      this.click();
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
    if (!this.clicked) {
      this.addChildAt(this.rangeCircle, 0);
      this.layer += 5;
      this.entered = true;
    }
  }

  leave() {
    if (!this.clicked) {
      this.removeChild(this.rangeCircle);
      this.layer -= 5;
      this.entered = false;
    }
  }

  click() {
    if (!this.clicked) {
      this.clicked = true;
      gameScreen.ui.showTowerInfo(this);
    }
  }

  setTC(tc) {
    this.baseTC = tc;
    this.TC = tc;
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

  setCD(cd) {
    this.baseCooldown = cd;
    this.cooldown = cd;
  }

  getDPS() {
    return Math.round(this.dmg * this.attackSpeed * 100) / 100;
  }

  addBuff(buff) {
    if (buff.tags.includes(buffTags.UNIQUE)) {
      let oldBuff = this.buffs.find(b => b.uniqueTag == buff.uniqueTag);
      if (oldBuff != null) {
        if (oldBuff.tags.includes(buffTags.CONCAT_DURATION)) {
          oldBuff.duration += buff.duration;
          oldBuff.baseDuration += buff.baseDuration;
          return true;
        } else if (oldBuff.tags.includes(buffTags.REFRESH_DURATION)) {
          oldBuff.duration = buff.duration;
          oldBuff.baseDuration = buff.baseDuration;
          return true;
        } else if (oldBuff.tags.includes(buffTags.STACKS)) {
          oldBuff.stacks++;
          return true;
        } else {
          return false;
        }
      }
    }
    buff.onApply(this);
    this.buffs.push(buff);
    this.buffContainer.addChild(buff.iconContainer);
    return true;
  }

  removeBuff(buff) {
    buff.onRemove(this);
    this.buffs.splice(this.buffs.indexOf(buff), 1);
    this.buffContainer.removeChild(buff.iconContainer);
  }

  sortBuffs() {
    for (let i = 0; i < this.buffs.length; i++) {
      let buff = this.buffs[i];
      buff.iconContainer.x = (i % 4) * 40;
      buff.iconContainer.y = Math.floor(i / 4) * 40;
    }
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

  TIMED: "Timed",
  STACKS: "Stacks",
  UNIQUE: "Unique",
  CONCAT_DURATION: "Concat duration",
  REFRESH_DURATION: "Refresh duration",
}

class Buff {
  constructor(name, effect, onApply = (tower => { }), onRemove = (tower => { })) {
    this.name = name;
    this.effect = effect;
    this.onApply = onApply;
    this.onRemove = onRemove;

    this.stacks = 1;

    this.tags = [];

    this.iconContainer = new PIXI.Container();

    this.icon = new PIXI.Graphics();
    this.icon.beginFill(0xAAFFAA);
    this.icon.drawRect(0, 0, 32, 32);
    this.icon.endFill();
    this.iconContainer.addChild(this.icon);

    this.cdArc = new PIXI.Graphics();
    this.iconContainer.addChild(this.cdArc);

    this.iconFrame = new PIXI.Graphics();
    this.iconFrame.lineStyle(4, 0x000000, 1);
    this.iconFrame.beginFill(0x000000, 0);
    this.iconFrame.drawRect(0, 0, 32, 32);
    this.iconFrame.endFill();
    this.iconContainer.addChild(this.iconFrame);

    this.iconText = new PIXI.Text(this.name.charAt(0), {fontFamily: 'Arial', fontSize: 20, fill: 'black', align: 'center'});
    this.iconText.x = 12;
    this.iconText.y = 12;
    this.iconText.anchor.set(0.5);
    this.iconContainer.addChild(this.iconText);

    this.stackText = new PIXI.Text("", {fontFamily: 'Arial', fontSize: 14, fill: 'red', align: 'center'});
    this.stackText.x = 30;
    this.stackText.y = 30;
    this.stackText.anchor.set(1);
    this.iconContainer.addChild(this.stackText);

    

    let mask = new PIXI.Graphics();
    this.iconContainer.addChild(mask);
    mask.lineStyle(4, 0x000000, 1);
    mask.beginFill(0xAAFFAA);
    mask.drawRect(0, 0, 32, 32);
    mask.endFill();

    this.iconContainer.mask = mask;
  }

  setDuration(duration) {
    this.duration = duration;
    this.baseDuration = duration;
    this.tags.push(buffTags.TIMED);
  }

  makeUnique(uniqueTag) {
    this.uniqueTag = uniqueTag;
    this.tags.push(buffTags.UNIQUE);
  }

  setStacks(stacks) {
    this.stacks = stacks;
    this.tags.push(buffTags.STACKS);
    let oldEffect = this.effect;
    this.effect = tower => { oldEffect(tower, this.stacks) };
  }

  updateBuffIcon() {
    if (this.tags.includes(buffTags.STACKS) && this.stacks > 1) {
      this.stackText.text = this.stacks;
    }

    if (this.tags.includes(buffTags.TIMED)) {
      this.cdArc.clear();
      this.cdArc.beginFill(0x808080, 0.5);
      this.cdArc.arc(16, 16, 64, - Math.PI / 2, - Math.PI / 2 + (2 * Math.PI * (this.baseDuration - this.duration) / this.baseDuration) + 0.01, true);
      this.cdArc.lineTo(16, 16);
      this.cdArc.endFill();
    }
  }
}
