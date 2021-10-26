class GameScreen {

  constructor() {


    this.map = new GrassMap();
    this.ui = new UI(this);

    this.container = new PIXI.Container();

    this.entityContainer = new PIXI.Container();
    this.entityContainer.on('childAdded', this.sortEntities.bind(this));

    this.container.addChild(this.map.container);
    this.container.addChild(this.entityContainer);
    this.container.addChild(this.ui.container);

    this.currentMonsterList = [];

    this.deck = [];
    this.hand = [];

    this.selectedCard = null;

    this.levelStarted = false;

    this.spawnClock = 0;

    this.setupDeck();
    this.drawCard();
    this.drawCard();
    this.drawCard();
    this.drawCard();
    this.drawCard();
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

      if (this.currentMonsterList.length == 0 && this.entityContainer.children.filter(e => e.type == entityType.MONSTER).length == 0) {
        this.levelStarted = false;
        this.ui.startButton.enable();
      }

    }

    for (let i = 0; i < this.entityContainer.children.length; i++) {
      this.entityContainer.children[i].update();
    }

    this.sortEntities();

    this.ui.update();
    
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
    let card = this.deck.shift()
    this.hand.push(card);
    this.ui.cardToHand(card)
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