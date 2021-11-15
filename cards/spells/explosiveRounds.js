class ExplosiveRounds extends Spell {

  constructor() {
    super();

    this.name = "Explosive Rounds";

    this.cost = 1;

    this.duration = 3000;

    this.effect = 0.5;
    this.effectRange = 100;

    this.tags.push(spellTags.TIMED);
    this.tags.push(spellTags.BUFF);
    this.tags.push(spellTags.TARGET_TOWER);
    this.tags.push(spellTags.DEPLETE);

  }


  getCardText() {
    let text = 
      "Tower shots deal\n" +
      (this.effect * 100) + "% of the damage" +
      "\nas AOE damage in" +
      "\na 100 radius" +
      "\nfor " + (this.duration / 1000) + "s";

    return text;
  }

  clickTarget(target) {

    if (!target.tags.includes(towerTags.BULLET)) {
      return false;
    }

    let aoeBullet = (bullet => {
      bullet.tags.push(bulletTags.AOE);
      bullet.aoeRange = this.effectRange;
      bullet.aoeDamage = bullet.dmg * this.effect;
      bullet.dmg *= (1 - this.effect);
    }); 

    let buffEffect = ((b, tower) => { 
      tower.bulletBuffs.push(aoeBullet);
    });

    let buffName = "Explosive Rounds";
    let bulletBuff = new Buff(buffName, buffEffect);
    bulletBuff.setDuration(this.duration);
    bulletBuff.makeUnique(buffName);
    bulletBuff.tags.push(buffTags.CONCAT_DURATION);


    target.addBuff(bulletBuff);
    return true;
  }

  

}