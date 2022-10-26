class UI {

  constructor(gs) {

    this.gs = gs;

    this.bg = new Sprite(PIXI.Texture.WHITE);
    this.bg.width = width;
    this.bg.height = 275;
    this.bg.tint = 0x01579B;

    this.bgLine = new PIXI.Graphics();
    this.bgLine.lineStyle(5, 0x000000);
    this.bgLine.moveTo(0, 0);
    this.bgLine.lineTo(width, 0);

    this.startButton = new Button("Start", width - 190, 20, 150, 40, this.gs.startLevel.bind(this.gs));

    this.slowButton = new Button(">", width - 190, 70, 70, 40, this.clickSlowButton.bind(this));
    this.fastButton = new Button(">>>", width - 110, 70, 70, 40, this.clickFastButton.bind(this));

    this.slowButton.disable();

    this.container = new PIXI.Container();

    this.container.y = height - this.bg.height;

    this.highlightContainer =  new PIXI.Container();
    this.highlightContainer.y = -height + this.bg.height;

    this.container.addChild(this.highlightContainer);

    this.highlightGraphics = new PIXI.Graphics();
    this.highlightContainer.addChild(this.highlightGraphics);

    this.container.addChild(this.bg);
    this.container.addChild(this.bgLine);

    this.container.addChild(this.startButton);
    this.container.addChild(this.slowButton);
    this.container.addChild(this.fastButton);

    this.handContainer = new PIXI.Container();
    this.container.addChild(this.handContainer);

    this.globalBuffInfoContainer = new PIXI.Container();
    this.globalBuffInfoContainer.x = width - 750;
    this.globalBuffInfoContainer.y = 20;
    this.container.addChild(this.globalBuffInfoContainer);

    this.buffContainerBG = new PIXI.Graphics();
    this.buffContainerBG.lineStyle(5, 0x000000, 1);
    this.buffContainerBG.beginFill(0xA0A0A0);
    this.buffContainerBG.drawRect(0, 0, 230, 250);
    this.buffContainerBG.drawRect(270, 0, 230, 250);
    this.buffContainerBG.endFill();
    this.globalBuffInfoContainer.addChild(this.buffContainerBG);

    this.accessoriesText = new PIXI.Text("Accessories", {fontFamily: 'Arial', fontSize: 24, fill: 0x000000});
    this.accessoriesText.x = 10;
    this.accessoriesText.y = 10;
    this.globalBuffInfoContainer.addChild(this.accessoriesText);

    this.globalBuffsText = new PIXI.Text("Global Buffs", {fontFamily: 'Arial', fontSize: 24, fill: 0x000000});
    this.globalBuffsText.x = 280;
    this.globalBuffsText.y = 10;
    this.globalBuffInfoContainer.addChild(this.globalBuffsText);

    this.accessoriesIconContainer = new PIXI.Container();
    this.accessoriesIconContainer.x = 10;
    this.accessoriesIconContainer.y = 50;
    this.globalBuffInfoContainer.addChild(this.accessoriesIconContainer);

    this.addAccessoriesIcons();

    this.globalBuffIconContainer = new PIXI.Container();
    this.globalBuffIconContainer.x = 280;
    this.globalBuffIconContainer.y = 50;
    this.globalBuffInfoContainer.addChild(this.globalBuffIconContainer);

    this.globalBuffIconContainer.on('childAdded', this.sortGlobalBuffs.bind(this));
    this.globalBuffIconContainer.on('childRemoved', this.sortGlobalBuffs.bind(this));


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


    this.roundText = new PIXI.Text("Round: 0", {fontFamily: 'Arial', fontSize: 24, fill: 0xFFFFFF, stroke: 'black', lineJoin: "bevel", strokeThickness: 3});
    this.roundText.x = width - 190;
    this.roundText.y = 120;
    this.container.addChild(this.roundText);

    this.energyText = new PIXI.Text("Energy: 0", {fontFamily: 'Arial', fontSize: 24, fill: 0xFFD700, stroke: 'black', lineJoin: "bevel", strokeThickness: 3});
    this.energyText.x = width - 190;
    this.energyText.y = 150;
    this.container.addChild(this.energyText);

    this.deckText = new PIXI.Text("Deck: 0", {fontFamily: 'Arial', fontSize: 24, fill: 0xFFFFFF, stroke: 'black', lineJoin: "bevel", strokeThickness: 3});
    this.deckText.x = width - 190;
    this.deckText.y = 180;
    this.container.addChild(this.deckText);

    this.discardText = new PIXI.Text("Discard Pile: 0", {fontFamily: 'Arial', fontSize: 24, fill: 0xFFFFFF, stroke: 'black', lineJoin: "bevel", strokeThickness: 3});
    this.discardText.x = width - 190;
    this.discardText.y = 210;
    this.container.addChild(this.discardText);

    this.TCText = new PIXI.Text("TC: 0 / 0", {fontFamily: 'Arial', fontSize: 24, fill: 0xFFFFFF, stroke: 'black', lineJoin: "bevel", strokeThickness: 3});
    this.TCText.x = width - 190;
    this.TCText.y = 240;
    this.container.addChild(this.TCText);


  }

  update() {

    this.gs.hand.forEach(card => card.update());

    this.deckText.text = `Deck: ${this.gs.deck.length}`
    this.discardText.text = `Discard Pile: ${this.gs.discardPile.length}`
    this.roundText.text = `Round: ${this.gs.round}`;
    this.energyText.text = `Energy: ${this.gs.energy}`;
    this.TCText.text = `TC: ${this.gs.currentTC} / ${player.maxTC}`
    this.TCText.tint = (this.gs.currentTC > player.maxTC) ? 0xFF0000 : 0xFFFFFF;

    if (this.currentTower != null) {
      this.towerInfoName.text = this.currentTower.name;
      this.currentTower.updateStats();
    }
    

  }

  sortGlobalBuffs() {
    for (let i = 0; i < this.gs.globalBuffs.length; i++) {
      let buff = this.gs.globalBuffs[i];
      buff.iconContainer.x = (i % 5) * 40;
      buff.iconContainer.y = Math.floor(i / 5) * 40;
    }
  }

  addAccessoriesIcons() {
    for (let i = 0; i < player.accessories.length; i++) {
      let acc = player.accessories[i];
      acc.x = (i % 5) * 40;
      acc.y = Math.floor(i / 5) * 40;
      acc.width = 32;
      acc.height = 32;
      this.accessoriesIconContainer.addChild(acc);
    }
  }

  clickFastButton() {
    this.slowButton.enable();
    this.fastButton.disable();

    speed = 2;
  }

  clickSlowButton() {
    this.slowButton.disable();
    this.fastButton.enable();

    speed = 1;
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
      this.globalBuffInfoContainer.visible = true;
      this.currentTower = null;
      return;
    }

    this.currentTower = tower;
    this.currentTower.updateStats();
    this.towerInfoContainer.visible = true;
    this.globalBuffInfoContainer.visible = false;

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