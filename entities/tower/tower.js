class Tower extends Entity {

  constructor() {
    super(0, 0);

    this.cardType = cardType.TOWER;
    this.type = entityType.TOWER;

    this.range = 0;

    this.tags = [];

    this.onMap = false;
    this.placed = false;

    this.rangeCollider = new PIXI.Sprite();
    this.rangeCollider.circular = true;
    this.rangeCollider.radius = this.range;
    this.addChild(this.rangeCollider);

    this.rangeCircle = new PIXI.Graphics();

    this.layerOffset = 100;
    this.layer += this.layerOffset;

    this.buffs = [];
    this.buffed = false;

  }

  update() {

    this.dmg = this.baseDmg;

    for (let i = this.buffs.length - 1; i >= 0; i--) {
      let buff = this.buffs[i];

      if (buff.tags.includes(spellTags.TIMED)) {
        buff.duration -= deltaTime;
        if (buff.duration <= 0) {
          this.buffs.splice(this.buffs.indexOf(buff), 1);
          continue;
        }
      }

      switch(buff.buffedStat) {
        case statTags.DAMAGE:
          this.dmg += this.baseDmg * buff.effect;
          break;

        default:
      }

      
    }

    if (this.buffs.length == 0) {
      this.buffed = false;
    } else {
      this.buffed = true;
    }
  }

  enterMap(pos) {
    this.x = pos.x;
    this.y = pos.Y;

    this.rangeCircle.clear();
    this.rangeCircle.lineStyle(4, 0x808080, 0.5);
    this.rangeCircle.beginFill(0xFFFFFF, 0.2);
    this.rangeCircle.drawCircle(0, 0, this.range);
    this.rangeCircle.endFill();
    this.rangeCircle.tint = 0xAAAAAA;

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
    this.layer += this.layerOffset;
  }

  leave() {
    this.removeChild(this.rangeCircle);
    this.layer -= this.layerOffset;
  }

}


const towerTags = {
  MISSILE: "Tower shots spawn missiles",
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