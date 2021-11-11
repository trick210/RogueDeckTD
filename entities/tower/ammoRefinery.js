class AmmoRefinery extends Tower {

  constructor() {
    super();

    this.name = "Ammo Refinery";

    this.cost = 1;

    this.setTC(1);

    this.setRange(350);

    this.setCD(5000);

    this.effect = 0.25;

    this.buffAmount = 3;

    this.buffedTurrets = [];
    this.appliedBuffs = [];


    this.tags.push(towerTags.STAT_SUPPORT);
    this.tags.push(towerTags.CARD_GENERATOR);
    this.tags.push(towerTags.ON_COOLDOWN);

    
    this.texture = new PIXI.Sprite();
    this.texture.circular = true;
    this.texture.radius = 32;
    //this.texture.anchor.set(0.5, 0.5);
    
    this.addChild(this.texture);

    this.graphic = new PIXI.Graphics();
    this.graphic.lineStyle(2, 0x000000, 1);
    this.graphic.beginFill(0x999999);
    this.graphic.drawCircle(0, 0, 32);
    this.graphic.endFill();
    this.graphic.beginFill(0x80FF80);
    this.graphic.drawRect(-16, -16, 32, 32);
    this.graphic.endFill();
    this.texture.addChild(this.graphic);

    
    
  }

  update() {
    super.update();

    if (this.placed) {

      /*
      for (let i = 0; i < this.buffedTurrets.length; i++) {
        this.buffedTurrets[i].removeBuff(this.appliedBuffs[i]);
      }

      this.buffedTurrets = [];
      this.appliedBuffs = [];
      */

      let towersInRange = this.getTowersInRange();


      for (let i = 0; i < Math.min(3, towersInRange.length); i++) {
        if (towersInRange[i] != this.buffedTurrets[i]) {
          if (this.buffedTurrets[i] != null) {
            this.buffedTurrets[i].removeBuff(this.appliedBuffs[i]);
          }

          let buffEffect = tower => { tower.dmg += tower.baseDmg * this.effect; };
          let buff = new Buff("Better Ammo", buffTags.DAMAGE, buffEffect);

          towersInRange[i].addBuff(buff);
          this.buffedTurrets[i] = towersInRange[i];
          this.appliedBuffs[i] = buff;
        }
      }


      this.texture.rotation += 0.03;

    }

    
  }

  remove() {
    for (let i = 0; i < this.buffedTurrets.length; i++) {
        this.buffedTurrets[i].removeBuff(this.appliedBuffs[i]);
    }

    super.remove();
  }


  getTowersInRange() {
    let towers = gameScreen.entityContainer.children.filter(e => e.type == entityType.TOWER && e != this && e.placed);

    let towersHit = [];

    for (let i = 0; i < towers.length; i++) {
      let collision = collider.hit(this.rangeCollider, towers[i].texture, false, false, true)
      if (collision) {
        towersHit.push(towers[i]);
      }
    }

    
    return towersHit.sort((a, b) => {
      let distA = Math.sqrt(sqr(a.x - this.x) + sqr(a.y - this.y));
      let distB = Math.sqrt(sqr(b.x - this.x) + sqr(b.y - this.y));

      return distA - distB;
    });
      
    
  }


  getCardText() {
    let text = 
      "Range: " + this.range + "\n" +
      "Cooldown: " + (this.cooldown / 1000) + "s\n\n" +
      "Gives up to " + this.buffAmount + "\n" +
      "bullet towers\n" +
      "in range " + this.effect * 100 + "%\n" +
      "bonus damage\n\n" +
      "On-Cooldown:\n" +
      "Add one copy of\n" +
      "Explosive Rounds\n" +
      "to your Hand";

    return text;
  }

  getStats() {
    let text = 
      "TC: " + this.TC +
      "\nRange: " + this.range;
      

      return text;
  }

}
