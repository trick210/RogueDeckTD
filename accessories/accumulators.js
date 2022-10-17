class Accumulators extends Accessories {

  constructor() {
    super("Accumulators", "Retain up to 2 Energy per turn during Clear Phase.", "Retain all Energy")

    this.retainedEnergy = 0;
    this.maxEnergy = 2;
  }

  onClear() {
    this.retainedEnergy = Math.min(this.maxEnergy, gameScreen.energy);
  }

  onDrawPhase(gs) {
    
    gs.energy += this.retainedEnergy;
    
    this.retainedEnergy = 0;
  }

  equip() {
    super.equip()
    events.onClearListener.push(this.onClear.bind(this));
    events.onDrawPhaseListener.push(this.onDrawPhase.bind(this));
  }

  upgrade() {
    super.upgrade();
    this.maxEnergy = Number.MAX_SAFE_INTEGER;
  }
}