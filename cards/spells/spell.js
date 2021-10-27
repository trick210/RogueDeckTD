class Spell {

  constructor() {

    this.cardType = cardType.SPELL;

    this.tags = [];

  }


  enterMap(pos) {
    

  }

  hoverMap(pos) {

    
  }

  leaveMap() {
    
  }

  clickMap(pos) {
    return true;
  }

}

const spellTags = {

  DAMAGE: "Damage",
  STAT_BUFF: "Stat buff",
  TIMED: "Timed",
  INSTANT: "instant",
  DELAYED: "Delayed",
  AOE: "AOE",
  DOT: "DOT",
  CRIPPLE: "Cripple",
  TARGETED: "Targeted",
}