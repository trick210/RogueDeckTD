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


  equip() {
    super.equip()
    events.onDrawPhaseListener.push(this.onDrawPhase.bind(this));
    events.onPlayerDamageListener.push(this.onDamage.bind(this));
  }

}