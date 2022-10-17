class PersistentStorage extends Accessories {

  constructor() {
    super("Persistent Storage", "Retain a random card during Clear Phase.", "Select a card")

    
  }

  onClear() {
    let availableCards = gameScreen.hand.filter(c => !c.cardObject.tags.includes(spellTags.DEPLETE));
    let card = availableCards.splice(Math.floor(player.deckRand() * availableCards.length), 1)[0];
    if (card != null) card.persistentKey = true;
  }


  equip() {
    super.equip()
    events.onClearListener.push(this.onClear.bind(this));
  }

  upgrade() {
    super.upgrade();
  }
}