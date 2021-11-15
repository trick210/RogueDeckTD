class Adjust extends Spell {

  constructor() {
    super();

    this.name = "Adjust";

    this.cost = 0;

    this.effect = 0.1;


    this.tags.push(spellTags.PERMANET);
    this.tags.push(spellTags.BUFF);
    this.tags.push(spellTags.TARGET_TOWER);

  }


  getCardText() {
    let text = 
      "Gives a tower\n" +
      (this.effect * 100) + "% bonus\nrange";

    return text;
  }

  clickTarget(target) {

    let buffEffect = (buff, tower) => { tower.range += buff.stacks * (tower.baseRange * this.effect); };

    let statBuff = new Buff(this.name, buffEffect);

    statBuff.makeUnique(this.name);
    statBuff.setStacks(1);

    target.addBuff(statBuff);

    return true;
  }

  

}