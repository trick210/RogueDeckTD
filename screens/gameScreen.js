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
    this.map.container.on("pointertap", this.clickMap.bind(this));

    this.round = 1;
    this.hp = 100;
    this.energy = 3;

    this.currentMonsterList = [];

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

      if (this.spawnClock > 1000) {
        
        let monster = this.currentMonsterList.shift();

        if (monster != null) {
          this.entityContainer.addChild(monster);
        }

        this.spawnClock -= 1000;
      }

    }

    for (let i = 0; i < this.entityContainer.children.length; i++) {
      this.entityContainer.children[i].update();
    }

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
      this.currentMonsterList = this.map.level.shift();
      this.levelStarted = true;
      this.ui.startButton.disable();
    }

  }

  setupDeck() {
    for (let i = 0; i < 5; i++) {
      this.deck.push(new Card(new BaseTower()));
      this.deck.push(new Card(new CannonBlast()));
      this.deck.push(new Card(new Overcharge()));
    }

    shuffle(this.deck);
  }

  drawCard() {
    if (this.deck.length == 0) {
      this.reshuffle();
    }

    return this.deck.shift()
    
  }

  drawTurret() {
    if (this.deck.length == 0) {
      this.reshuffle();
    }

    for (let i = 0; i < this.deck.length; i++) {
      if (this.deck[i].type == cardType.TOWER) {
        let card = this.deck[i];
        this.deck.splice(i, 1);
        return card;
      }
    }

    return null;
  }

  drawPhase() {

    this.discardHand();
    this.energy = 3;

    let turretCard = this.drawTurret();
    let remainingCards = 4;

    if (turretCard == null) {
      remainingCards = 5;
    } else {
      this.hand.push(turretCard);
      this.ui.cardToHand(turretCard);
    }

    for (let i = 0; i < remainingCards; i++) {
      let card = this.drawCard();
      this.hand.push(card);
      this.ui.cardToHand(card);
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
    
    this.ui.removeFromHand(card.handIndex);
    this.discardPile.push(card);
    this.hand.splice(this.hand.indexOf(card), 1);

    if (this.selectedCard == card) {
      card.deselect();
      this.selectedCard = null;
    } 
  }

  destroyCard(card) {
    
    this.ui.removeFromHand(card.handIndex);
    this.hand.splice(this.hand.indexOf(card), 1);

    if (this.selectedCard == card) {
      card.deselect();
      this.selectedCard = null;
    } 
  }

  selectCard(card) {
    if (this.selectedCard != null) {
      this.selectedCard.deselect();
    }

    if (card.select()) {
      this.selectedCard = card;
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

    if (this.selectedCard != null) {
      this.selectedCard.enterMap(pos);
    }
  }

  leaveMap() {
    if (this.selectedCard != null) {
      this.selectedCard.leaveMap();
    }
  }

  clickMap(e) {
    let pos = e.data.global;

    if (this.selectedCard != null) {
      this.selectedCard.clickMap(pos);
    }
  }


  sortEntities() {
    this.entityContainer.children.sort((a, b) => (a.layer == b.layer) ? a.y - b.y : a.layer - b.layer);
  }




}