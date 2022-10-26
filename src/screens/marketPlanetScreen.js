class MarketPlanetScreen {

  constructor(mapSeed, deckSeed) {

    this.container = new PIXI.Container();

    this.bg = new Sprite(PIXI.Texture.WHITE);
    this.bg.width = width;
    this.bg.height = height;
    this.bg.tint = 0x000000;

    this.container.addChild(this.bg);

    this.mapRand = mulberry32(mapSeed);
    this.deckRand = mulberry32(deckSeed);

    this.fillBG();

    this.stationTexture = new PIXI.Sprite(resources['spaceMarket'].texture);
    this.stationTexture.width *= 0.9;
    this.stationTexture.height *= 0.9;
    this.stationTexture.x = (width - this.stationTexture.width) / 2;
    this.stationTexture.y = (height - this.stationTexture.height) / 2;

    this.container.addChild(this.stationTexture);

    this.ship = new SpaceShip(width / 2 + 300, height / 2 + 300, Math.PI * 0.75);
    this.container.addChild(this.ship);

    this.mainUI = this.getMainUI();

    this.setUI(this.mainUI);


  }

  setUI(ui) {
    if (this.currentUI != null) {
      this.container.removeChild(this.currentUI);
    }

    this.currentUI = ui;
    this.container.addChild(this.currentUI);
  }

  update() {

  }

  clickLeave() {
    setActiveScreen(spaceScreen);
  }

  fillBG() {
    let pdsObj = new PoissonDiskSampling({
      shape: [width, height],
      minDistance: 100,
      maxDistance: 200,
      tries: 20
    }, this.mapRand);

    let g = new PIXI.Graphics();
    g.beginFill(0xFFFFFF);
    for (let p of pdsObj.fill()) {
      g.drawCircle(p[0], p[1], this.mapRand() * 2 + 1);
    }
    g.endFill();

    this.container.addChild(g);
  }


  getMainUI() {
    let uiContainer = new PIXI.Container();
    let uiGraphics = new PIXI.Graphics();

    let uiWidth = 1500;
    let uiHeight = 950;

    uiContainer.x = (width - uiWidth) / 2;
    uiContainer.y = (height - uiHeight) / 2;

    uiGraphics.beginFill(0x202020, 0.8);
    uiGraphics.drawRoundedRect(0, 0, uiWidth, uiHeight, 10);
    uiGraphics.endFill();
    uiContainer.addChild(uiGraphics);

    let titleText = new PIXI.Text('Shop', { fontFamily: 'Arial', fontSize: 48, fill: 'white', stroke: 'black', lineJoin: "bevel", strokeThickness: 4 });


    let backButton = new Button("Leave", uiWidth - 150, uiHeight - 100, 100, 50, this.clickLeave.bind(this));

    titleText.x = uiWidth / 2;
    titleText.y = 20;

    titleText.anchor.set(0.5, 0);


    uiContainer.addChild(titleText);
    uiContainer.addChild(backButton);

    let offers = [...marketOffers];

    for (let j = 0; j < 3; j++) {
      let type = null;

      switch (j) {
        case 0:
          type = cardType.TOWER;
          break;

        case 1:
          type = null;
          break;

        case 2:
          type = cardType.SPELL;
          break;

      }

      for (let i = 0; i < 2; i++) {
        let offer = this.pickOffer(type, offers);

        let card = offer.card;
        let cardName = offer.cardName;

        let priceTag = new PIXI.Text(card.marketPrice + " G", { fontFamily: 'Arial', fontSize: 24, fill: 'gold', stroke: 'black', lineJoin: "bevel", strokeThickness: 4 });

        card.x = i * 200 + uiWidth / 2 - card.width - 5 + (j - 1) * 500;
        card.y = 100;

        priceTag.x = i * 200 + uiWidth / 2 - card.width / 2 - 5 + (j - 1) * 500;
        priceTag.y = 360;
        priceTag.anchor.set(0.5, 0);

        card.removeAllListeners();
        card.on('mouseover', () => this.cardEnter(card));
        card.on('mouseout', () => this.cardLeave(card));
        card.on('click', () => this.clickCard(card, cardName, priceTag));

        uiContainer.addChild(card);
        uiContainer.addChild(priceTag);
      }
    }

    let heart1 = this.createMaxHPOffer(5, 100);

    heart1.x = uiWidth / 2 + 405 - 64;
    heart1.y = uiHeight - 400;


    let heart2 = this.createMaxHPOffer(10, 200);

    heart2.x = uiWidth / 2 + 405 - 64 + 200;
    heart2.y = uiHeight - 400;

    uiContainer.addChild(heart1);
    uiContainer.addChild(heart2);


    for (let i = 0; i < 4; i++) {
      let accContainer = this.pickAccessory();

      accContainer.x = 75 + i * 220;
      accContainer.y = uiHeight - 420;

      uiContainer.addChild(accContainer);
    }

    return uiContainer;
  }

  pickOffer(type, offers) {
    let cardFound = false;
    let card;
    let cardName;
    while (!cardFound) {
      cardName = offers.splice(Math.floor(this.deckRand() * offers.length), 1)[0];
      card = new Card((Function('return new ' + cardName))());

      if (type == null || card.type == type) {
        cardFound = true;
      } else {
        offers.push(cardName);
      }
    }

    let price = 20;

    switch (card.type) {
      case cardType.TOWER:
        price = 90 + Math.floor(this.deckRand() * 51);
        break;
      case cardType.SPELL:
        price = 70 + Math.floor(this.deckRand() * 41);
        break;
      default:
        price = 20;
        break;
    }

    card.marketPrice = price;

    return { card, cardName };
  }


  pickAccessory() {
    let accContainer = new PIXI.Container();
    let accType = availableAccessories.splice(Math.floor(this.deckRand() * availableAccessories.length), 1)[0];

    if (accType == null) return accContainer;

    let acc = accType.CREATE();

    let price = 180 + Math.floor(this.deckRand() * 61);

    acc.price = price;

    acc.interactive = true;
    acc.buttonMode = true;

    acc.on('click', () => this.clickAccessory(acc));

    let priceAcc = new PIXI.Text(price + " G", { fontFamily: 'Arial', fontSize: 24, fill: 'gold', stroke: 'black', lineJoin: "bevel", strokeThickness: 4 });

    priceAcc.x = 80;
    priceAcc.y = 160;

    priceAcc.anchor.set(0.5, 0);

    accContainer.addChild(acc);
    accContainer.addChild(priceAcc);

    return accContainer;
  }


  createMaxHPOffer(amount, price) {
    let heartContainer = new PIXI.Container();

    let heart = new PIXI.Sprite(resources['heartIcon'].texture);
    heart.width = 128;
    heart.height = 128;

    heart.interactive = true;
    heart.buttonMode = true;

    heart.on('click', () => this.clickHeart(heart));

    heart.price = price;
    heart.hpIncrease = amount;

    let priceHeart = new PIXI.Text(price + " G", { fontFamily: 'Arial', fontSize: 24, fill: 'gold', stroke: 'black', lineJoin: "bevel", strokeThickness: 4 });

    priceHeart.x = 64;
    priceHeart.y = 140;

    priceHeart.anchor.set(0.5, 0);

    let hpText = new PIXI.Text("+" + amount + " max HP", { fontFamily: 'Arial', fontSize: 16, fill: 'white', stroke: 'black', lineJoin: "bevel", strokeThickness: 2 });

    hpText.x = 64;
    hpText.y = 60;

    hpText.anchor.set(0.5);

    heartContainer.addChild(heart);
    heartContainer.addChild(priceHeart);
    heartContainer.addChild(hpText);

    return heartContainer;
  }

  clickHeart(heart) {
    if (player.money >= heart.price) {
      player.money -= heart.price;
      player.maxHP += heart.hpIncrease;
      player.hp += heart.hpIncrease;
      let heartContainer = heart.parent;
      heartContainer.parent.removeChild(heartContainer);
    }
  }


  clickAccessory(acc) {
    if (player.money >= acc.price) {
      player.money -= acc.price;
      acc.equip();
      let accContainer = acc.parent;
      accContainer.parent.removeChild(accContainer);
    }
  }


  cardEnter(card) {
    card.cardFrame.tint = 0xFFFF00;
  }

  cardLeave(card) {
    card.cardFrame.tint = 0x000000;
  }

  clickCard(card, cardName, priceTag) {
    if (card != null && player.money >= card.marketPrice) {
      player.deck.push(cardName);
      let uiContainer = card.parent;
      uiContainer.removeChild(card);
      uiContainer.removeChild(priceTag);
      player.money -= card.marketPrice;
    }
  }

  static CREATE_OFFERS() {
    availableAccessories = [
      Accumulators,
      BetterPowder,
      PersistentStorage,
      PrechargedAttackSystems,
      EmergencyReserve,
      ProtectiveCharges,
      StarterPack,
      Repairbot,
      HardenedPolish
    ];
  }

}

const marketOffers = [
  "MinigunTower",
  "TempestTower",
  "SniperNest",
  "AmmoRefinery",
  "Adjust",
  "CannonBlast",
  "Overcharge",
  "Refine",
  "BoxOfHollowPoints"
];


let availableAccessories = [ ];
