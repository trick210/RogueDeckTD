class EventManager {

  constructor() {

    this.onClearListener = [];
    this.onDrawPhaseListener = [];
    this.onTowerPlacedListener = [];
    this.onCardPlayedListener = [];
    this.onPlayerDamageListener = [];
    this.onLevelEndListener = [];
  }

  onClear() {
    this.onClearListener.forEach(e => e());
  }

  onDrawPhase(gs) {
    this.onDrawPhaseListener.forEach(e => e(gs));
  }

  onTowerPlaced(tower) {
    this.onTowerPlacedListener.forEach(e => e(tower));
  }

  onCardPlayed(card) {
    this.onCardPlayedListener.forEach(e => e(card));
  }

  onPlayerDamage(amount) {
    this.onPlayerDamageListener.forEach(e => e(amount));
  }

  onLevelEnd() {
    this.onLevelEndListener.forEach(e=> e());
  }

}