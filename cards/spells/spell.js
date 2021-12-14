class Spell extends Entity {

  constructor() {
    super(0, 0);

    this.cardType = cardType.SPELL;
    this.entityType = entityType.SPELL_EFFECT

    this.tags = [];

    this.onMap = false;
    this.rangeCircle = new PIXI.Graphics();

    this.layer = 1000;

  }


  enterMap(pos) {
    
    if (this.tags.includes(spellTags.AOE)) {
      this.x = pos.x;
      this.y = pos.y;

      this.rangeCircle.clear();
      this.rangeCircle.lineStyle(4, 0xFF5050, 1);
      this.rangeCircle.beginFill(0xAAAAAA, 0.4);
      this.rangeCircle.drawCircle(0, 0, this.radius);
      this.rangeCircle.endFill();

      this.onMap = true;

      this.addChildAt(this.rangeCircle, 0);
      this.addToStage();
    }

  }

  hoverMap(pos) {

    if (this.tags.includes(spellTags.AOE)) {
      if (!this.onMap) {
        return;
      }

      this.x = pos.x;
      this.y = pos.y;
    }
    
  }

  leaveMap() {
    this.removeChild(this.rangeCircle);
    this.remove();
    this.onMap = false;    
  }

  clickMap(pos) {

    if (this.tags.includes(spellTags.TARGET_TOWER)) {
      let clickable = gameScreen.entityContainer.children.filter(e => e.type == entityType.TOWER);
      let target = null;
      for (let i = 0; i < clickable.length; i++) {
        if (collider.hitTestPoint(pos, clickable[i].texture)) {
          target = clickable[i];
          break;
        }
      }

      if (target != null) {
        let result = this.clickTarget(target);
        
        target.enter();
        target.click();
        return result;
        
      }

      return false;
      
    }

    if (this.tags.includes(spellTags.AOE)) {

      this.removeChild(this.rangeCircle);

      this.hitTargets(pos);

      return true;

    }

    if (this.tags.includes(spellTags.GLOBAL)) {
      this.useSpell();
      return true;
    }

    return false;;
  }



}

const spellTags = {

  DAMAGE: "Damage",
  BUFF: "Buff",
  TIMED: "Timed",
  PERMANENT: "Permanent",
  INSTANT: "Instant",
  DELAYED: "Delayed",
  AOE: "AOE",
  DOT: "DOT",
  CRIPPLE: "Cripple",
  TARGET_TOWER: "Target tower",
  TARGET_MONSTER: "Target tower",
  DEPLETE: "Deplete",
  CHARGES: "Charges"
}