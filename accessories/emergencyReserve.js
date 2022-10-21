class EmergencyReserve extends Accessories {

  constructor() {
    super("Emergency Reserve", "If you took damage last turn, draw 1 additional card at the start of your turn.", "Also draw 1 card the first time you take damage each turn.")

    this.tookDamage = false;
  }


  onDrawPhase(gs) {
    
    if (this.tookDamage) {
      gs.drawCard();
      this.tookDamage = false;
    }
  }

  onDamage() {
    if (this.upgraded && !this.tookDamage) gameScreen.drawCard();

    this.tookDamage = true;
  }

  onLevelEnd() {
    this.tookDamage = false;
  }


  equip() {
    super.equip()
    events.addListener('onDrawPhase', this.onDrawPhase.bind(this));
    events.addListener('onPlayerDamage', this.onDamage.bind(this));
    events.addListener('onLevelEnd', this.onLevelEnd.bind(this));
  }

}