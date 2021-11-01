class Overcharge extends Spell {

  constructor() {
    super();

    this.name = "Overcharge";

    this.cost = 1;

    this.duration = 3000;
    this.effect = 1;

    this.buffedStat = buffTags.DAMAGE;


    this.tags.push(spellTags.TIMED);
    this.tags.push(spellTags.BUFF);
    this.tags.push(spellTags.TARGET_TOWER);

  }


  getCardText() {
    let text = 
      "Gives a tower\n" +
      (this.effect * 100) + "% bonus\nattack damage\n" +
      "for " + (this.duration / 1000) + " seconds";

    return text;
  }

  clickTarget(target) {

    if (!target.tags.includes(towerTags.DAMAGE)) {
      return false;
    }

    let buffEffect = tower => { tower.dmg += tower.baseDmg * this.effect; };

    let statBuff = new Buff("Overcharge", this.buffedStat, buffEffect);
    statBuff.setDuration(this.duration);


    target.buffs.push(statBuff);

    return true;
  }

  

}