class Card extends PIXI.Container {

  constructor(cardObject) {
    super();

    this.cardObject = cardObject;

    this.cardWidth = 175;
    this.cardHeight = 250;

    switch (cardObject.cardType) {
      case cardType.TOWER:
        this.fill = 0xAAFFFF;
        break;

      case cardType.SPELL:
        this.fill = 0xFFFFAA;
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

    let topFrame = new PIXI.Graphics();
    topFrame.beginFill(0x000000);
    topFrame.drawRect(0, 0, this.cardWidth, 40);
    topFrame.endFill();
    this.addChild(topFrame);

    this.cardName = new PIXI.Text(this.name, {fontFamily: 'Arial', fontSize: 20, fill: 0xFFFFFF});
    this.cardName.x = 5;
    this.cardName.y = 5;
    this.addChild(this.cardName);

    this.cardCost = new PIXI.Text(this.cost, {fontFamily: 'Arial', fontSize: 20, fill: 0xFFD700});
    this.cardCost.anchor.set(1, 0);
    this.cardCost.x = this.cardWidth - 5;
    this.cardCost.y = 5;
    this.addChild(this.cardCost);

    this.cardText = new PIXI.Text(this.text, {fontFamily: 'Arial', fontSize: 16, fill: 0x000000});
    this.cardText.x = 10;
    this.cardText.y = 50;
    this.addChild(this.cardText);

    this.typeText = new PIXI.Text(this.type, {fontFamily: 'Arial', fontSize: 12, fill: 0x000000});
    this.typeText.anchor.set(1, 1);
    this.typeText.x = this.cardWidth - 5;
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
    this.on('pointertap', this.click.bind(this));

  }

  click() {
    gameScreen.selectCard(this);
  }

  select() {
    this.cardFrame.tint = 0xFF0000;
  }

  deselect() {
    this.cardFrame.tint = 0x000000;
  }
}

const cardType = {
  SPELL: "Spell",
  TOWER: "Tower",
  CURSE: "Curse",
}

