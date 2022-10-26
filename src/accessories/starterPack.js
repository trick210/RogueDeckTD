class StarterPack extends Accessories {

  constructor() {
    super("Starter Pack", "The first Base Tower you place each combat costs 0 energy.", "Also uses no TCs")

    this.amount = 1;

    let buffEffect = (buff, gs) => {
      gs.hand.forEach(card => {
        if (card.name == "Base Tower") {
          card.cost = 0;
        }
      });
    };

    let onCardPlayed = (card, buff, gs) => {
      if (card.name == "Base Tower") {
          gs.removeBuff(buff);
      }
    };

    let onApply = (buff, gs) => {
      this.fn = (card) => onCardPlayed(card, buff, gs)
      events.addListener('onCardPlayed', this.fn);
    }

    let onRemove = (buff, gs) => {
      events.removeListener('onCardPlayed', this.fn);
    }

    this.createBuff = () => {
      let buff = new Buff('Cheap Base Tower', buffEffect, onApply, onRemove);
      return buff;
    }

  }

  onLevelEnd() {
    gameScreen.removeBuff(this.buff);
  }

  onLevelStart(gs) {
    this.buff = this.createBuff();
    gs.addBuff(this.buff);
  }


  equip() {
    super.equip()
    events.addListener('onLevelEnd', this.onLevelEnd.bind(this));
    events.addListener('onLevelStart', this.onLevelStart.bind(this));
  }

}