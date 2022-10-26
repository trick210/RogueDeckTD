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

    let buffEffect = (buff, tower) => { tower.dmg += buff.stacks * (tower.baseDmg * this.effect); };

    let statBuff = new Buff(this.name, buffEffect);

    statBuff.makeUnique(this.name);
    statBuff.setStacks(1);

    target.addBuff(statBuff);

    return true;
  }

  getTargets(entities) {
    let towers = entities.filter(e => e.type == entityType.TOWER);

    return towers.filter(e => e.tags.includes(towerTags.DAMAGE));
    
  }

}