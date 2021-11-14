class DoubleBarrel extends Spell {

  constructor() {
    super();

    this.name = "Double Barrel";

    this.cost = 2;

    this.effect = 1;
    this.cripple = 1;


    this.tags.push(spellTags.PERMANET);
    this.tags.push(spellTags.BUFF);
    this.tags.push(spellTags.TARGET_TOWER);
    this.tags.push(spellTags.CRIPPLE);

  }


  getCardText() {
    let text = 
      "Gives a tower\n" +
      (this.effect * 100) + "% bonus\nattack speed\nbut the tower uses\n" + (this.cripple * 100) + "% more TCs";

    return text;
  }

  clickTarget(target) {

    if (!target.tags.includes(towerTags.BULLET)) {
      return false;
    }

    let buffEffect = (tower, stacks) => { 
      tower.attackSpeed += stacks * (tower.baseAS * this.effect);
      tower.TC += stacks * (tower.baseTC * this.cripple); 
    };

    let statBuff = new Buff(this.name, buffEffect);

    statBuff.makeUnique(this.name);
    statBuff.setStacks(1);

    target.addBuff(statBuff);

    return true;
  }

  

}