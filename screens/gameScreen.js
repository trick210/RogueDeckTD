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

    this.round = 1;
    this.hp = 100;
    this.energy = 5;

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
    if (this.currentMonsterList.length == 0 && this.entityContainer.children.filter(e => e.type == entityType.MONSTER).length == 0) {
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
    for (let i = 0; i < this.hand.length; i++) {
      let card = this.hand[i];
      card.deselect();
      this.ui.removeFromHand(card.handIndex);
      this.discardPile.push(card);
    }
    this.hand = [];
    this.selectedCard = null;
  }

  selectCard(card) {
    if (this.selectedCard != null) {
      this.selectedCard.deselect();
    }
    this.selectedCard = card;
    this.selectedCard.select();
  }


  sortEntities() {
    this.entityContainer.children.sort((a, b) => (a.layer == b.layer) ? a.y - b.y : a.layer - b.layer);
  }




}