class Refine extends Spell {

  constructor() {
    super();

    this.name = "Refine";

    this.cost = 1;

    this.effect = 0.1;


    this.tags.push(spellTags.PERMANET);
    this.tags.push(spellTags.BUFF);
    this.tags.push(spellTags.TARGET_TOWER);

  }


  getCardText() {
    let text = 
      "Gives a tower\n" +
      (this.effect * 100) + "% bonus\nattack damage";

    return text;
  }

  clickTarget(target) {

    if (!target.tags.includes(towerTags.DAMAGE)) {
      return false;
    }

    let buffEffect = tower => { tower.dmg += tower.baseDmg * this.effect; };

    let statBuff = new Buff(this.name, buffEffect);

    target.addBuff(statBuff);

    return true;
  }

  

}