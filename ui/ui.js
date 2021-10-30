class UI {

  constructor(gs) {

    this.gs = gs;

    this.bg = new Sprite(PIXI.Texture.WHITE);
    this.bg.width = width;
    this.bg.height = 300;
    this.bg.tint = 0x01579B;

    this.buttons = [];

    this.startButton = new Button("Start", width - 240, 20, 200, 75, this.gs.startLevel.bind(this.gs));

    this.buttons.push(this.startButton);

    this.container = new PIXI.Container();

    this.container.y = height - this.bg.height;

    this.container.addChild(this.bg);

    for (let i = 0; i < this.buttons.length; i++) {
      this.container.addChild(this.buttons[i].container);
    }

    this.handContainer = new PIXI.Container();
    this.container.addChild(this.handContainer);


    this.pileSprite = new PIXI.Graphics();
    this.pileSprite.lineStyle(5, 0x000000, 1);
    this.pileSprite.beginFill(0xA0A0A0);
    this.pileSprite.drawRect(width - 660, 20, 175, 250);
    this.pileSprite.drawRect(width - 460, 20, 175, 250);
    this.pileSprite.endFill();
    this.container.addChild(this.pileSprite);

    this.deckText = new PIXI.Text("Deck", {fontFamily: 'Arial', fontSize: 24, fill: 0x000000, align: 'center'});
    this.deckText.anchor.set(0.5);
    this.deckText.x = width - 660 + 87;
    this.deckText.y = 125;
    this.container.addChild(this.deckText);

    this.discardText = new PIXI.Text("Discard Pile", {fontFamily: 'Arial', fontSize: 24, fill: 0x000000, align: 'center'});
    this.discardText.anchor.set(0.5);
    this.discardText.x = width - 460 + 87;
    this.discardText.y = 125;
    this.container.addChild(this.discardText);

    this.roundText = new PIXI.Text("Round: 0", {fontFamily: 'Arial', fontSize: 36, fill: 0xFFFFFF, stroke: 'black', strokeThickness: 5});
    this.roundText.x = width - 240;
    this.roundText.y = 120;
    this.container.addChild(this.roundText);

    this.hpText = new PIXI.Text("HP: 0", {fontFamily: 'Arial', fontSize: 36, fill: 0x00FF00, stroke: 'black', strokeThickness: 5});
    this.hpText.x = width - 240;
    this.hpText.y = 170;
    this.container.addChild(this.hpText);

    this.energyText = new PIXI.Text("Energy: 0", {fontFamily: 'Arial', fontSize: 36, fill: 0xFFD700, stroke: 'black', strokeThickness: 5});
    this.energyText.x = width - 240;
    this.energyText.y = 220;
    this.container.addChild(this.energyText);


  }

  update() {

    for (let i = 0; i < this.buttons.length; i++) {
      this.buttons[i].update();
    }

    this.deckText.text = `Deck\n\n${this.gs.deck.length} cards`
    this.discardText.text = `Discard Pile\n\n${this.gs.discardPile.length} cards`
    this.roundText.text = `Round: ${this.gs.round}`;
    this.hpText.text = `HP: ${this.gs.hp}`;
    this.energyText.text = `Energy: ${this.gs.energy}`;
    

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

      if (cards[i] != this.gs.selectedCard) {
        cards[i].cardFrame.tint = 0x00000;
      }

    }

    this.handContainer.children.sort((a, b) => b.handIndex - a.handIndex);
  }

  bringCardToFront(card) {
    let cards = this.gs.hand;
    for (let i = 0; i < cards.length; i++) {
      cards[i].handIndex = i;
      if (cards[i] != this.gs.selectedCard) {
        cards[i].cardFrame.tint = 0x00000;
      }
    }

    if (card != null) {
      card.handIndex = -1;
      if (card != this.gs.selectedCard) {
        card.cardFrame.tint = 0xFFFF00;
      }
    }

    this.handContainer.children.sort((a, b) => b.handIndex - a.handIndex);
  }


}