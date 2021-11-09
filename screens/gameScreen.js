class GameScreen {

  constructor() {


    this.map = new GrassMap();
    this.ui = new UI(this);

    this.container = new PIXI.Container();

    this.entityContainer = new PIXI.Container();
    this.entityContainer.on('childAdded', this.sortEntities.bind(this));
    this.entityContainer.on('childRemoved', this.checkEnd.bind(this));

    this.container.addChild(this.map.container);
    this.container.addChild(this.entityContainer);
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

    this.round = 1;
    this.hp = 100;
    this.energy = 5;

    this.currentTC = 0;
    this.maxTC = 12;

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

    for (let i = 0; i < this.entityContainer.children.length; i++) {
      this.entityContainer.children[i].update();
    }

    if (this.hp <= 0) {
      this.cleanup();
      setActiveScreen(new DeathScreen(this.round));
    }

    this.currentTC = this.entityContainer.children.filter(child => child.type == entityType.TOWER && child.placed).map(t => t.TC).reduce((a, b) => a + b, 0);

    this.sortEntities();

    this.ui.update();

    
  }

  checkEnd() {
    if (this.levelStarted && this.currentMonsterList.length == 0 && this.entityContainer.children.filter(e => e.type == entityType.MONSTER).length == 0) {
        this.levelStarted = false;
        this.ui.startButton.enable();
        this.round++;
        this.drawPhase();
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
    for (let i = 0; i < 3; i++) {
      this.deck.push(new Card(new CannonBlast()));
      this.deck.push(new Card(new Overcharge()));
      this.deck.push(new Card(new Refine()));
    }
    this.deck.push(new Card(new MinigunTower()));
    this.deck.push(new Card(new MinigunTower()));
    this.deck.push(new Card(new SniperNest()));
    this.deck.push(new Card(new BaseTower()));
    this.deck.push(new Card(new BaseTower()));
    this.deck.push(new Card(new BaseTower()));

    shuffle(this.deck);
  }

  drawCard() {
    if (this.deck.length == 0) {
      this.reshuffle();
    }

    let card = this.deck.shift();

    if (this.hand.length < 10) {
      this.hand.push(card);
      this.ui.cardToHand(card);
    } else {
      this.discardPile.push(card);
    }
    
  }

  drawTurret() {
    if (this.deck.length == 0) {
      this.reshuffle();
    }

    for (let i = 0; i < this.deck.length; i++) {
      if (this.deck[i].type == cardType.TOWER) {
        let card = this.deck[i];
        this.deck.splice(i, 1);
        
        if (this.hand.length < 10) {
          this.hand.push(card);
          this.ui.cardToHand(card);
        } else {
          this.discardPile.push(card);
        }

        return true;
      }
    }

    return false;
  }

  drawPhase() {

    this.deselectCard();
    this.discardHand();
    this.energy = 5;

    let remainingCards = this.drawTurret() ? 4 : 5;

    for (let i = 0; i < remainingCards; i++) {
      let card = this.drawCard();
      
    }
    
  }

  reshuffle() {
    this.deck = this.discardPile;
    this.discardPile = [];
    shuffle(this.deck);
  }

  discardHand() {
    while (this.hand.length != 0) {
      let card = this.hand[0];
      this.discardCard(card);
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
    this.entityContainer.children.sort((a, b) => (a.layer == b.layer) ? a.y - b.y : a.layer - b.layer);
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
  }




}