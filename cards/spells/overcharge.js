class Overcharge extends Spell {

  constructor() {
    super();

    this.name = "Overcharge";

    this.cost = 1;

    this.duration = 3000;
    this.buff = 1;

    this.buffedStat = statTags.DAMAGE;


    this.tags.push(spellTags.TIMED);
    this.tags.push(spellTags.BUFF);
    this.tags.push(spellTags.TARGETED);

  }


  getCardText() {
    let text = 
      (this.buff * 100) + "% bonus attack\ndamage\n\n" +
      "Duration: " + (this.duration / 1000) + " seconds\n";

    return text;
  }

  clickTarget(target) {
    if (target.type != entityType.TOWER) {
      return false;
    }

    if (!target.tags.includes(towerTags.DAMAGE)) {
      return false;
    }


    target.buffs.push(this);

    return true;
  }

  

}