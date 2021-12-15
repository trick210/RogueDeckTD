class BoxOfHollowPoints extends Spell {

  constructor() {
    super();

    this.name = "Box of Hollow Points";

    this.cost = 1;

    this.effect = 100;

    this.charges = 20;


    this.tags.push(spellTags.PERMANET);
    this.tags.push(spellTags.TARGET_TOWER);
    this.tags.push(spellTags.CHARGES);

  }


  getCardText() {
    let text =
      "Gives a tower\n" +
      (this.effect) + " on-hit damage\n" +
      "for " + (this.charges) + " shots.";

    return text;
  }

  clickTarget(target) {

    if (!target.tags.includes(towerTags.BULLET)) {
      return false;
    }

    let onHitBuff = (target, buff, tower) => {
      let dmgObj = {
        amount: this.effect,
        damageType: "NORMAL"
      }
      target.recieveDamage(dmgObj);
      buff.charges--;
      if (buff.charges <= 0) {
        tower.removeBuff(buff);
      }
    };

    let buffEffect = (buff, tower) => {
      let modifiedBuff = (target) => { onHitBuff(target, buff, tower) };
      tower.onHitBuffs.push(modifiedBuff);
    };

    let buffName = "Hollow Point Rounds"
    let buffObj = new Buff(buffName, buffEffect);

    buffObj.makeUnique(buffName);
    buffObj.setCharges(this.charges);

    target.addBuff(buffObj);

    return true;
  }



}