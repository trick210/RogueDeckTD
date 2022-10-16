class EventManager {

  constructor() {

    this.onClearListener = [];
    this.onDrawPhaseListener = [];
    this.onTowerPlacedListener = [];
  }

  onClear() {
    this.onClearListener.forEach(e => e());
  }

  onDrawPhase() {
    this.onDrawPhaseListener.forEach(e => e());
  }

  onTowerPlaced(tower) {
    this.onTowerPlacedListener.forEach(e => e(tower));
  }

}