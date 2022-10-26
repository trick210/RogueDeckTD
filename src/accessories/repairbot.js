class Repairbot extends Accessories {

  constructor() {
    super("Repairbot", "At the end of each wave, during which you have not taken damage, regain 1 health.", "Regain 2 health")

    this.tookDamage = false;

    this.repairAmount = 1;
    this.upgradeAmount = 2;
  }


  onClear() {
    if (this.tookDamage) {
      this.tookDamage = false;
    } else {
      player.heal(this.repairAmount);
    }
  }

  onDamage() {
    this.tookDamage = true;
  }

  equip() {
    super.equip()
    events.addListener('onClear', this.onClear.bind(this));
    events.addListener('onPlayerDamage', this.onDamage.bind(this));
    events.addListener('onLevelEnd', this.onClear.bind(this));
  }

  upgrade() {
    super.upgrade();
    this.repairAmount = this.upgradeAmount;
  }

}