class PrechargedAttackSystems extends Accessories {

  constructor() {
    super("Precharged Attack-Systems", "The first Damage Spell played each turn costs one less energy (not less than 0).", "First two Spells")

    this.amount = 1;
    this.upgradeAmount = 2;

    let buffEffect = (buff, gs) => {
      gs.hand.forEach(card => {
        if (card.type == cardType.SPELL && card.cardObject.tags.includes(spellTags.DAMAGE)) {
          card.cost = Math.max(0, card.cost - 1);
        }
      });
    };

    let onCardPlayed = (card, buff, gs) => {
      if (card.type == cardType.SPELL && card.cardObject.tags.includes(spellTags.DAMAGE)) {
        buff.charges--;
        if (buff.charges <= 0) {
          gs.removeBuff(buff);
        } 
      }
    };

    let onApply = (buff, gs) => {
      this.fn = (card) => onCardPlayed(card, buff, gs)
      events.onCardPlayedListener.push(this.fn);
    }

    let onRemove = (buff, gs) => {
      let index = events.onCardPlayedListener.indexOf(this.fn);
      if (index > -1) events.onCardPlayedListener.splice(index, 1);
    }

    this.createBuff = () => {
      let buff = new Buff(this.name, buffEffect, onApply, onRemove);
      return buff;
    }
    
  }

  onClear() {
    gameScreen.removeBuff(this.buff);
  }

  onDrawPhase(gs) {
    this.buff = this.createBuff();
    this.buff.setCharges(this.amount);
    gs.addBuff(this.buff);
  }


  equip() {
    super.equip()
    events.onClearListener.push(this.onClear.bind(this));
    events.onDrawPhaseListener.push(this.onDrawPhase.bind(this));
  }

  upgrade() {
    super.upgrade();
    this.amount = this.upgradeAmount;
  }
}