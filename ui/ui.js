class UI {

  constructor(gs) {

    this.gs = gs;

    this.bg = new Sprite(PIXI.Texture.WHITE);
    this.bg.width = width;
    this.bg.height = 300;
    this.bg.tint = 0x01579B;

    this.startButton = new Button("Start", width - 190, 20, 150, 50, this.gs.startLevel.bind(this.gs));

    this.container = new PIXI.Container();

    this.container.y = height - this.bg.height;

    this.highlightContainer =  new PIXI.Container();
    this.highlightContainer.y = -height + this.bg.height;

    this.container.addChild(this.highlightContainer);

    this.highlightGraphics = new PIXI.Graphics();
    this.highlightContainer.addChild(this.highlightGraphics);

    this.container.addChild(this.bg);

    this.container.addChild(this.startButton);

    this.handContainer = new PIXI.Container();
    this.container.addChild(this.handContainer);


    this.currentTower = null;

    this.towerInfoContainer = new PIXI.Container();
    this.towerInfoContainer.x = width - 750;
    this.towerInfoContainer.y = 20;
    this.towerInfoContainer.visible = false;
    this.container.addChild(this.towerInfoContainer);

    this.towerInfo = new PIXI.Graphics();
    this.towerInfo.lineStyle(5, 0x000000, 1);
    this.towerInfo.beginFill(0xA0A0A0);
    this.towerInfo.drawRect(0, 0, 500, 250);
    this.towerInfo.endFill();
    this.towerInfoContainer.addChild(this.towerInfo);

    this.towerInfoName = new PIXI.Text("Name", {fontFamily: 'Arial', fontSize: 24, fill: 0x000000});
    this.towerInfoName.x = 10;
    this.towerInfoName.y = 10;
    this.towerInfoContainer.addChild(this.towerInfoName);

    this.towerInfoTargets = new PIXI.Text("Targets", {fontFamily: 'Arial', fontSize: 20, fill: 0x000000});
    this.towerInfoTargets.x = 410;
    this.towerInfoTargets.y = 10;
    this.towerInfoContainer.addChild(this.towerInfoTargets);

    this.towerInfoDestroy = new Button("Destroy Tower", 240, 200, 160, 40, this.destroyTower.bind(this), 16);
    this.towerInfoContainer.addChild(this.towerInfoDestroy);


    this.roundText = new PIXI.Text("Round: 0", {fontFamily: 'Arial', fontSize: 24, fill: 0xFFFFFF, stroke: 'black', strokeThickness: 3});
    this.roundText.x = width - 190;
    this.roundText.y = 80;
    this.container.addChild(this.roundText);

    this.hpText = new PIXI.Text("HP: 0", {fontFamily: 'Arial', fontSize: 24, fill: 0x00FF00, stroke: 'black', strokeThickness: 3});
    this.hpText.x = width - 190;
    this.hpText.y = 110;
    this.container.addChild(this.hpText);

    this.energyText = new PIXI.Text("Energy: 0", {fontFamily: 'Arial', fontSize: 24, fill: 0xFFD700, stroke: 'black', strokeThickness: 3});
    this.energyText.x = width - 190;
    this.energyText.y = 140;
    this.container.addChild(this.energyText);

    this.deckText = new PIXI.Text("Deck: 0", {fontFamily: 'Arial', fontSize: 24, fill: 0xFFFFFF, stroke: 'black', strokeThickness: 3});
    this.deckText.x = width - 190;
    this.deckText.y = 170;
    this.container.addChild(this.deckText);

    this.discardText = new PIXI.Text("Discard Pile: 0", {fontFamily: 'Arial', fontSize: 24, fill: 0xFFFFFF, stroke: 'black', strokeThickness: 3});
    this.discardText.x = width - 190;
    this.discardText.y = 200;
    this.container.addChild(this.discardText);

    this.TCText = new PIXI.Text("TC: 0 / 0", {fontFamily: 'Arial', fontSize: 24, fill: 0xFFFFFF, stroke: 'black', strokeThickness: 3});
    this.TCText.x = width - 190;
    this.TCText.y = 230;
    this.container.addChild(this.TCText);


  }

  update() {

    this.deckText.text = `Deck: ${this.gs.deck.length}`
    this.discardText.text = `Discard Pile: ${this.gs.discardPile.length}`
    this.roundText.text = `Round: ${this.gs.round}`;
    this.hpText.text = `HP: ${player.hp}`;
    this.energyText.text = `Energy: ${this.gs.energy}`;
    this.TCText.text = `TC: ${this.gs.currentTC} / ${player.maxTC}`
    this.TCText.tint = (this.gs.currentTC > player.maxTC) ? 0xFF0000 : 0xFFFFFF;

    if (this.currentTower != null) {
      this.towerInfoName.text = this.currentTower.name;
      this.currentTower.updateStats();
    }
    

  }

  cardToHand(card) {
    this.handContainer.addChild(card);
    this.redrawCards();
  }

  removeFromHand(card) {
    this.handContainer.removeChild(card);
    this.redrawCards();
  }

  redrawCards() {
    let cards = this.gs.hand;
    let distX = Math.min(200, 1000 / cards.length);
    for (let i = 0; i < cards.length; i++) {

      cards[i].handIndex = i;
      cards[i].x = 20 + i * distX;
      cards[i].y = 20;

    }

    this.bringCardToFront(this.gs.selectedCard);
  }

  bringCardToFront(card) {
    let cards = this.gs.hand;
    for (let i = 0; i < cards.length; i++) {
      cards[i].handIndex = i;
      if (cards[i] != this.gs.selectedCard) {
        cards[i].cardFrame.tint = cards[i].isPlayable(this.gs) ? 0x00FF00 : 0x000000;
        cards[i].y = 20;
      }
    }

    if (card != null) {
      card.handIndex = -1;
      card.y = 10;
      if (card != this.gs.selectedCard) {
        //card.cardFrame.tint = 0xFFFF00;1
      }
    }

    this.handContainer.children.sort((a, b) => b.handIndex - a.handIndex);
  }

  highlightTargets(card) {
    this.highlightGraphics.clear();
    this.highlightGraphics.lineStyle(3, 0x00FF00);

    if (card.type == cardType.SPELL) {
      let targets = card.cardObject.getTargets(this.gs.entityContainer.children);
      for (let target of targets) {
        this.highlightGraphics.drawCircle(target.x, target.y, target.texture.radius);
      }
    }
  }

  clearTargets() {
    this.highlightGraphics.clear();
  }

  showTowerInfo(tower) {

    if (this.currentTower != null) {
      this.currentTower.clicked = false;
      this.currentTower.leave();

      if (this.currentTower.buttonContainer != null) {
        this.towerInfoContainer.removeChild(this.currentTower.buttonContainer);
        this.towerInfoContainer.removeChild(this.towerInfoTargets);
      }

      this.towerInfoContainer.removeChild(this.currentTower.buffContainer);
      this.towerInfoContainer.removeChild(this.currentTower.infoContainer);
    }

    if (tower == null) {
      this.towerInfoContainer.visible = false;
      this.currentTower = null;
      return;
    }

    this.currentTower = tower;
    this.currentTower.updateStats();
    this.towerInfoContainer.visible = true;

    if (this.currentTower.buttonContainer != null) {
      this.towerInfoContainer.addChild(this.currentTower.buttonContainer);
      this.towerInfoContainer.addChild(this.towerInfoTargets);
      this.currentTower.buttonContainer.x = 410;
      this.currentTower.buttonContainer.y = 50;
    }

    this.currentTower.buffContainer.x = 240;
    this.currentTower.buffContainer.y = 10;
    this.towerInfoContainer.addChild(this.currentTower.buffContainer);

    this.currentTower.infoContainer.x = 10;
    this.currentTower.infoContainer.y = 50;
    this.towerInfoContainer.addChild(this.currentTower.infoContainer);


  }

  destroyTower() {
    if (this.currentTower != null) {
      this.currentTower.remove();
      this.showTowerInfo(null);
    }
  }


}