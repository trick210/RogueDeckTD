class Spell {

  constructor() {

    this.cardType = cardType.SPELL;

    this.tags = [];

  }


  enterMap(pos) {
    
    

  }

  hoverMap(pos) {

    if (this.tags.includes(spellTags.TARGETED)) {
      let clickable = gameScreen.entityContainer.children.filter(e => e.type == entityType.TOWER);
      let target = null;
      for (let i = 0; i < clickable.length; i++) {
        if (collider.hitTestPoint(pos, clickable[i].texture)) {
          target = clickable[i];
          break;
        }
      }

      if (target != null) {
        gameScreen.map.container.buttonMode = true;
      } else {
        gameScreen.map.container.buttonMode = false;
      }
    }
    
  }

  leaveMap() {

    
    
  }

  clickMap(pos) {

    if (this.tags.includes(spellTags.TARGETED)) {
      let clickable = gameScreen.entityContainer.children.filter(e => e.type == entityType.TOWER || e.type == entityType.MONSTER);
      let target = null;
      for (let i = 0; i < clickable.length; i++) {
        if (collider.hitTestPoint(pos, clickable[i].texture)) {
          target = clickable[i];
          break;
        }
      }

      if (target != null) {
        let result = this.clickTarget(target);

        if (result) {
          gameScreen.map.container.buttonMode = false;
          return true;
        }
      }

      return false;
      
    }

    return false;;
  }



}

const spellTags = {

  DAMAGE: "Damage",
  BUFF: "Buff",
  TIMED: "Timed",
  INSTANT: "instant",
  DELAYED: "Delayed",
  AOE: "AOE",
  DOT: "DOT",
  CRIPPLE: "Cripple",
  TARGETED: "Targeted",
}

const statTags = {

  DAMAGE: "Damage",
}