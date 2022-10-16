class BetterPowder extends Accessories {
  constructor() {
    super("Better Powder", "Bullet Towers deal 2 damage on hit.", "4 damage")

    this.damageBuff = 2;
    this.upgradedBuff = 4;
  }

  upgrade() {
    super.upgrade();
    this.damageBuff = this.upgradedBuff;
  }

  equip() {
    super.equip()
    events.onTowerPlacedListener.push((tower) => this.onTowerPlaced(tower));
  }

  onTowerPlaced(tower) {
    if (!tower.tags.includes(towerTags.BULLET)) {
      return;
    }

    let onHitBuff = (target, tower) => {
      let dmgObj = {
        amount: this.damageBuff,
        damageType: "NORMAL"
      }
      target.recieveDamage(dmgObj, tower);
    }

    let buffEffect = (buff, tower) => {
      let modifiedBuff = (target) => { onHitBuff(target, tower) };
      tower.onHitBuffs.push(modifiedBuff);
    };

    let buffName = "Better Powder"
    let buffObj = new Buff(buffName, buffEffect);

    tower.addBuff(buffObj);
  }

}