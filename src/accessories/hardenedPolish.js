class HardenedPolish extends Accessories {

  constructor() {
    super("Hardened Polish", "Gain 1 Max Health after each combat.", "Gain 2 Max Health")

    this.hpIncrease = 1;
    this.upgradedIncrease = 2;
    
  }

  onLevelEnd() {
    player.maxHP += this.hpIncrease;
    player.hp += this.hpIncrease;
  }


  equip() {
    super.equip()
    events.addListener('onLevelEnd', this.onLevelEnd.bind(this));
  }

  upgrade() {
    super.upgrade();
    this.hpIncrease = this.upgradedIncrease;
  }
}