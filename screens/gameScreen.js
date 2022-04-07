class GameScreen {

  constructor(mapSeed, rewardSeed, stage) {

    this.rewardSeed = rewardSeed;
    this.stage = stage;

    this.map = new GrassMap(mapSeed);
    this.ui = new UI(this);

    this.container = new PIXI.Container();

    this.entityContainer = new PIXI.Container();
    this.entityContainer.on('childAdded', this.sortEntities.bind(this));
    this.entityContainer.on('childRemoved', this.checkEnd.bind(this));

    this.pc = new PIXI.ParticleContainer();
    this.pc.setProperties({
      scale: true,
      position: true,
      rotation: true,
      uvs: true,
      alpha: true,
    });

    this.container.addChild(this.map.container);
    this.container.addChild(this.pc);
    this.container.addChild(this.entityContainer);
    this.container.addChild(this.map.ship);
    this.container.addChild(this.ui.container);

    this.map.container.interactive = true;
    this.map.container.on("pointermove", this.hoverMap.bind(this));
    this.map.container.on('pointerover', this.enterMap.bind(this));
    this.map.container.on("pointerout", this.leaveMap.bind(this));
    this.map.container.on("click", this.clickMap.bind(this));
    this.map.container.on("rightclick", this.rightClickMap.bind(this));

    this.ui.bg.interactive = true;
    this.ui.bg.on("rightclick", this.deselectCard.bind(this));
    this.ui.bg.on("click", this.deselectCard.bind(this));

    this.key1 = keyboard("1");
    this.key2 = keyboard("2");
    this.key3 = keyboard("3");
    this.key4 = keyboard("4");
    this.key5 = keyboard("5");
    this.key6 = keyboard("6");
    this.key7 = keyboard("7");
    this.key8 = keyboard("8");
    this.key9 = keyboard("9");
    this.key0 = keyboard("0");

    this.keySpace = keyboard(" ");

    this.key1.press = () => this.selectCardFromIndex(0);
    this.key2.press = () => this.selectCardFromIndex(1);
    this.key3.press = () => this.selectCardFromIndex(2);
    this.key4.press = () => this.selectCardFromIndex(3);
    this.key5.press = () => this.selectCardFromIndex(4);
    this.key6.press = () => this.selectCardFromIndex(5);
    this.key7.press = () => this.selectCardFromIndex(6);
    this.key8.press = () => this.selectCardFromIndex(7);
    this.key9.press = () => this.selectCardFromIndex(8);
    this.key0.press = () => this.selectCardFromIndex(9);

    this.keySpace.press = () => this.startLevel();

    this.mouseOnMap = false;

    this.maxRounds = 10;
    this.round = 1;
  
    this.energy = player.maxEnergy;

    this.currentTC = 0;

    this.globalBuffs = [];

    this.currentMonsterList = [];
    this.monsterInWave = this.currentMonsterList.length;

    this.deck = [];
    this.hand = [];
    this.discardPile = [];

    this.selectedCard = null;

    this.levelStarted = false;

    this.spawnClock = 0;

    this.setupDeck();

    this.drawPhase();

    this.explosiveRoundsEmitter = new PIXI.particles.Emitter(this.pc, explosiveRoundsParticles);
    this.explosiveRoundsEmitter.emit = false;

    this.cannonBlastEmitter = new PIXI.particles.Emitter(this.pc, cannonBlastParticles);
    this.cannonBlastEmitter.emit = false;
  }

  update() {

    if (this.levelStarted) {
      this.spawnClock += deltaTime;

      if (this.spawnClock > 10000 / (this.monsterInWave - 1)) {

        let monster = this.currentMonsterList.shift();

        if (monster != null) {
          this.entityContainer.addChild(monster);
        }

        this.spawnClock -= 10000 / (this.monsterInWave - 1);
      }

    }

    this.updateBuffs();

    for (let i = 0; i < this.entityContainer.children.length; i++) {
      this.entityContainer.children[i].update();
    }

    this.currentTC = this.entityContainer.children.filter(child => child.type == entityType.TOWER && child.placed).map(t => t.TC).reduce((a, b) => a + b, 0);

    this.sortEntities();

    this.ui.update();

    this.explosiveRoundsEmitter.update(deltaTime / 1000);
    this.cannonBlastEmitter.update(deltaTime / 1000);

  }

  recieveDamage(amount) {
    player.hp -= amount;
    if (player.hp <= 0) {
      this.cleanup();
      setActiveScreen(new DeathScreen(this.round));
    }
  }

  updateBuffs() {
    for (let i = this.globalBuffs.length - 1; i >= 0; i--) {
      let buff = this.globalBuffs[i];

      if (gameScreen.levelStarted) {
        if (buff.tags.includes(buffTags.TIMED)) {
          buff.duration -= deltaTime;
          if (buff.duration <= 0) {
            this.removeBuff(buff);
            continue;
          }
        }
      }


      buff.effect(this);

      buff.updateBuffIcon();

    }
  }

  addBuff(buff) {
    if (buff.tags.includes(buffTags.UNIQUE)) {
      let oldBuff = this.globalBuffs.find(b => b.uniqueTag == buff.uniqueTag);
      if (oldBuff != null) {
        if (oldBuff.tags.includes(buffTags.CONCAT_DURATION)) {
          oldBuff.duration += buff.duration;
          oldBuff.baseDuration += buff.baseDuration;

        } else if (oldBuff.tags.includes(buffTags.REFRESH_DURATION)) {
          oldBuff.duration = buff.duration;
          oldBuff.baseDuration = buff.baseDuration;

        } else if (oldBuff.tags.includes(buffTags.STACKS)) {
          oldBuff.stacks++;

        }
        return;
      }
    }
    buff.onApply(this);
    this.globalBuffs.push(buff);
    //this.buffContainer.addChild(buff.iconContainer);
  }

  removeBuff(buff) {
    buff.onRemove(this);
    this.globalBuffs.splice(this.globalBuffs.indexOf(buff), 1);
    //this.buffContainer.removeChild(buff.iconContainer);
  }

  checkEnd() {

    if (this.levelStarted && this.currentMonsterList.length == 0 && this.entityContainer.children.filter(e => e.type == entityType.MONSTER).length == 0 && player.hp > 0) {
      this.levelStarted = false;
      if (this.round < this.maxRounds) {
        this.removeBuffs();
        this.ui.startButton.enable();
        this.round++;
        this.drawPhase();
      } else {
        this.cleanup();
        setActiveScreen(new RewardScreen(this.rewardSeed, this.stage));
      }
    }
  }

  startLevel() {

    if (!this.levelStarted) {
      this.currentMonsterList = this.map.getWave(this.round);
      this.monsterInWave = this.currentMonsterList.length;
      this.spawnClock = 10000 / (this.monsterInWave - 1);
      this.levelStarted = true;
      this.ui.startButton.disable();
    }

  }

  setupDeck() {
    
    for (let card of player.deck) {
      this.deck.push(new Card((Function('return new ' + card))()));
    }

    shuffle(this.deck, player.deckRand);
  }

  drawCard() {
    if (this.deck.length == 0) {
      this.reshuffle();
    }

    let card = this.deck.shift();

    this.cardToHand(card);

  }

  drawTurret() {
    if (this.deck.length == 0) {
      this.reshuffle();
    }

    for (let i = 0; i < this.deck.length; i++) {
      if (this.deck[i].type == cardType.TOWER && this.deck[i].cardObject.tags.includes(towerTags.DAMAGE)) {
        let card = this.deck[i];
        this.deck.splice(i, 1);

        this.cardToHand(card);

        return true;
      }
    }

    return false;
  }

  cardToHand(card) {
    if (this.hand.length < 10) {
      this.hand.push(card);
      this.ui.cardToHand(card);
    } else {
      if (!card.cardObject.tags.includes(spellTags.DEPLETE)) {
        this.discardPile.push(card);
      }
    }
  }

  drawPhase() {

    this.deselectCard();
    this.discardHand();
    this.energy = player.maxEnergy;

    let remainingCards = this.drawTurret() ? 4 : 5;

    for (let i = 0; i < remainingCards; i++) {
      this.drawCard();

    }

  }

  reshuffle() {
    this.deck = this.discardPile;
    this.discardPile = [];
    shuffle(this.deck, player.deckRand);
  }

  discardHand() {
    while (this.hand.length != 0) {
      let card = this.hand[0];
      if (!card.cardObject.tags.includes(spellTags.DEPLETE)) {
        this.discardCard(card);
      } else {
        this.destroyCard(card);
      }
    }
  }

  discardCard(card) {

    this.hand.splice(this.hand.indexOf(card), 1);
    this.ui.removeFromHand(card);
    this.discardPile.push(card);

    if (this.selectedCard == card) {
      card.deselect();
      this.selectedCard = null;
    }
  }

  destroyCard(card) {

    this.hand.splice(this.hand.indexOf(card), 1);
    this.ui.removeFromHand(card);

    if (this.selectedCard == card) {
      card.deselect();
      this.selectedCard = null;
    }
  }

  selectCard(card) {
    this.deselectCard();

    if (card.select()) {
      this.selectedCard = card;
    }

    this.ui.bringCardToFront(card);

  }

  deselectCard() {
    if (this.selectedCard != null) {
      if (this.mouseOnMap) this.selectedCard.leaveMap();
      this.selectedCard.deselect();
      this.selectedCard = null;
      this.ui.bringCardToFront(null);
    }
  }

  selectCardFromIndex(index) {

    if (index >= this.hand.length) {
      return;
    }

    let card = this.hand[index];

    if (this.mouseOnMap) {
      if (this.selectedCard != null) {
        this.selectedCard.leaveMap();
      }
    }

    this.selectCard(card);

    if (this.mouseOnMap && this.selectedCard != null) {
      this.selectedCard.enterMap(this.mousePos);
    }
  }

  hoverMap(e) {
    let pos = e.data.global;

    if (this.selectedCard != null) {
      this.selectedCard.hoverMap(pos);
    }
  }

  enterMap(e) {
    let pos = e.data.global;

    this.mouseOnMap = true;
    this.mousePos = pos;

    if (this.selectedCard != null) {
      this.selectedCard.enterMap(pos);
    }
  }

  leaveMap() {
    this.mouseOnMap = false;

    if (this.selectedCard != null) {
      this.selectedCard.leaveMap();
    }
  }

  clickMap(e) {

    this.ui.showTowerInfo(null);

    let pos = e.data.global;

    if (this.selectedCard != null) {
      this.selectedCard.clickMap(pos);
    }

  }

  rightClickMap(e) {
    this.deselectCard();
    this.ui.showTowerInfo(null);
  }


  sortEntities() {
    this.entityContainer.children.sort((a, b) => {
      if (a.type == entityType.MONSTER && b.type == entityType.MONSTER) {
        return b.spawnIndex - a.spawnIndex;
      }
      return (a.layer == b.layer) ? a.y - b.y : a.layer - b.layer
    });
  }

  removeBuffs() {
    let towers = this.entityContainer.children.filter(e => e.type == entityType.TOWER);
    towers.forEach(tower => {
      let buffs = tower.buffs.filter(buff => buff.tags.includes(buffTags.TIMED));
      buffs.forEach(b => tower.removeBuff(b));
    });

    this.globalBuffs.filter(buff => buff.tags.includes(buffTags.TIMED)).forEach(buff => {
      this.removeBuff(buff);
    });
  }

  cleanup() {
    this.key1.unsubscribe();
    this.key2.unsubscribe();
    this.key3.unsubscribe();
    this.key4.unsubscribe();
    this.key5.unsubscribe();
    this.key6.unsubscribe();
    this.key7.unsubscribe();
    this.key8.unsubscribe();
    this.key9.unsubscribe();
    this.key0.unsubscribe();

    this.keySpace.unsubscribe();

    this.cannonBlastEmitter.destroy();
    this.explosiveRoundsEmitter.destroy();
  }




}