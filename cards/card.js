class Card extends PIXI.Container {

  constructor(cardObject) {
    super();

    this.cardObject = cardObject;

    this.cardWidth = 180;
    this.cardHeight = 250;

    switch (cardObject.cardType) {
      case cardType.TOWER:
        this.fill = 0xAAFFAA;
        break;

      case cardType.SPELL:
        this.fill = 0xFFAAFF;
        break;

      case cardType.CURSE:
        this.fill = 0xFFAAAA;
        break;

      default:
        this.fill = 0xFFFFFF;
        break;

    }

    this.name = this.cardObject.name;
    this.text = this.cardObject.getCardText();
    this.type = this.cardObject.cardType;

    this.cost = this.cardObject.cost;

    this.cardBG = new PIXI.Graphics();
    this.cardBG.beginFill(this.fill);
    this.cardBG.drawRect(0, 0, this.cardWidth, this.cardHeight);
    this.cardBG.endFill();
    this.addChild(this.cardBG);

    let titleFrame = new PIXI.Graphics();
    titleFrame.beginFill(0x000000);
    titleFrame.drawRect(this.cardWidth - 40, 0, 40, this.height);
    titleFrame.endFill();
    this.addChild(titleFrame);

    this.cardName = new PIXI.Text(this.name, {fontFamily: 'Arial', fontSize: 20, fontWeight: 'bold', fill: 0xFFFFFF});
    this.cardName.x = this.cardWidth - 5;
    this.cardName.y = 40;
    this.cardName.rotation = Math.PI / 2
    this.addChild(this.cardName);

    this.cardCost = new PIXI.Text(this.cost, {fontFamily: 'Arial', fontSize: 24, fontWeight: 'bold', fill: 0xFFD700});
    this.cardCost.anchor.set(1, 0);
    this.cardCost.x = this.cardWidth - 5;
    this.cardCost.y = 5;
    this.addChild(this.cardCost);

    this.cardText = new PIXI.Text(this.text, {fontFamily: 'Arial', fontSize: 14, fill: 0x000000});
    this.cardText.x = 10;
    this.cardText.y = 10;
    this.addChild(this.cardText);

    this.typeText = new PIXI.Text(this.type, {fontFamily: 'Arial', fontSize: 12, fill: 0x000000});
    this.typeText.anchor.set(0, 1);
    this.typeText.x = 5;
    this.typeText.y = this.cardHeight - 5;
    this.addChild(this.typeText);

    this.cardFrame = new PIXI.Graphics();
    this.cardFrame.lineStyle(5, 0xFFFFFF, 1);
    this.cardFrame.beginFill(0xFFFFFF, 0);
    this.cardFrame.drawRect(0, 0, this.cardWidth, this.cardHeight);
    this.cardFrame.endFill();
    this.cardFrame.tint = 0x000000;
    this.addChild(this.cardFrame);



    this.interactive = true;
    this.buttonMode = true;
    this.on('click', this.click.bind(this));
    this.on('mouseover', this.enter.bind(this));
    this.on("mouseout", this.leave.bind(this));

  }

  click() {
    gameScreen.selectCard(this);
  }

  enter() {
    gameScreen.ui.bringCardToFront(this);
  }

  leave() {
    gameScreen.ui.bringCardToFront(gameScreen.selectedCard);
  }

  select() {
    if (gameScreen.energy >= this.cost) {
      this.cardFrame.tint = 0xFF0000;
      gameScreen.entityContainer.interactiveChildren = false;
      gameScreen.entityContainer.children.forEach(entity => {
        if (entity.entered) entity.leave();
      });

      return true;
    }

    return false;
  }

  deselect() {
    this.cardFrame.tint = 0x000000;
    gameScreen.entityContainer.interactiveChildren = true;
  }


  hoverMap(pos) {
    this.cardObject.hoverMap(pos);
  }

  enterMap(pos) {
    this.cardObject.enterMap(pos);
  }

  leaveMap() {
    this.cardObject.leaveMap();
  }

  clickMap(pos) {
    if (this.cardObject.clickMap(pos)) {
      if (this.type == cardType.TOWER) {
        gameScreen.destroyCard(this);
      } else {
        gameScreen.discardCard(this);
      }

      gameScreen.energy -= this.cost;
      
    }
  }
}

const cardType = {
  SPELL: "Spell",
  TOWER: "Tower",
  CURSE: "Curse",
}

