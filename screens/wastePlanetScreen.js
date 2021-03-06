class WastePlanetScreen {

  constructor(mapSeed, rewardSeed) {

    this.container = new PIXI.Container();

    this.bg = new Sprite(PIXI.Texture.WHITE);
    this.bg.width = width;
    this.bg.height = height;
    this.bg.tint = 0xA0A0A0;

    this.container.addChild(this.bg);

    this.mapRand = mulberry32(mapSeed);
    this.rewardRand = mulberry32(rewardSeed);

    this.fillBG();
    

    this.ship = new SpaceShip(width / 2 + 300, height / 2 + 300, Math.PI * 0.75);
    this.container.addChild(this.ship);

    this.mainUI = this.getMainUI();
    this.trashUI = this.getCradTrashUI();

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

  clickOK() {
    setActiveScreen(spaceScreen);
  }

  clickRepair() {
    let amount = 5 + Math.round(this.rewardRand() * 5);

    this.repairAmount = player.heal(amount);

    let repairUI = this.getRepairUI();

    this.setUI(repairUI);
  }

  clickTrash() {
    this.setUI(this.trashUI);
  }

  clickBack() {
    this.setUI(this.mainUI);
  }

  clickCard(cardName) {
    player.deck.splice(player.deck.indexOf(cardName), 1);

    setActiveScreen(spaceScreen);
  }

  cardEnter(card) {
    card.cardFrame.tint = 0xFFFF00;
  }

  cardLeave(card) {
    card.cardFrame.tint = 0x000000;
  }

  fillBG() {
    let pdsObj = new PoissonDiskSampling({
      shape: [width, height],
      minDistance: 500,
      maxDistance: 700,
      tries: 20
    }, this.mapRand);

    let g = new PIXI.Graphics();
    g.beginFill(0x808080);
    for (let p of pdsObj.fill()) {
      g.drawCircle(p[0], p[1], this.mapRand() * 128 + 32);
    }
    g.endFill();

    this.container.addChild(g);
  }

  getMainUI() {
    let uiContainer = new PIXI.Container();
    let uiGraphics = new PIXI.Graphics();

    let titleContainer = new PIXI.Container();

    titleContainer.x = 400;
    titleContainer.y = 100;

    uiGraphics.beginFill(0x202020, 0.8);
    uiGraphics.drawRoundedRect(0, 0, 800, 200, 10);
    uiGraphics.endFill();
    titleContainer.addChild(uiGraphics);

    let text1 = "You find yourself on a wasteland.\n\n" +
                "Facing the amounts of trashed spacecraft components you\n" +
                "contemplate what to do...";

    let titleText = new PIXI.Text(text1, { fontFamily: 'Arial', fontSize: 24, fill: 'white', stroke: 'black', strokeThickness: 3 });

    titleText.x = 10;
    titleText.y = 10;

    titleContainer.addChild(titleText);

    uiContainer.addChild(titleContainer);

    let text2 = "...REPAIR\n\n" +
                "your ship using parts\nlying around you.";

    let text3 = "...TRASH\n\n" +
                "a card from your deck.\n" +
                "The additional waste\nwon'tdisturb anyone.";

    let btn1 = new Button("", 400, 350, 300, 150, this.clickRepair.bind(this));
    let btn2 = new Button("", 900, 350, 300, 150, this.clickTrash.bind(this));

    let btn1Text = new PIXI.Text(text2, { fontFamily: 'Arial', fontSize: 24, fill: 'black' });
    let btn2Text = new PIXI.Text(text3, { fontFamily: 'Arial', fontSize: 24, fill: 'black' });

    btn1Text.x = 410;
    btn1Text.y = 360;

    btn2Text.x = 910;
    btn2Text.y = 360;

    uiContainer.addChild(btn1);
    uiContainer.addChild(btn2);

    uiContainer.addChild(btn1Text);
    uiContainer.addChild(btn2Text);

    return uiContainer;
  }

  getRepairUI() {
    let uiContainer = new PIXI.Container();
    let uiGraphics = new PIXI.Graphics();

    let titleContainer = new PIXI.Container();

    titleContainer.x = 400;
    titleContainer.y = 100;

    uiGraphics.beginFill(0x202020, 0.8);
    uiGraphics.drawRoundedRect(0, 0, 800, 200, 10);
    uiGraphics.endFill();
    titleContainer.addChild(uiGraphics);

    let text1 = "You managed to find some useful components.\n\n";
    text1 += (this.repairAmount == 0) ? "Since there was no need for any reparations,\n" +
                "you decided to leave these parts for somebody else to find." :
                "After some tinkering your ship regained " + this.repairAmount + " HP.";

    let titleText = new PIXI.Text(text1, { fontFamily: 'Arial', fontSize: 24, fill: 'white', stroke: 'black', strokeThickness: 3 });

    titleText.x = 10;
    titleText.y = 10;

    titleContainer.addChild(titleText);

    uiContainer.addChild(titleContainer);

    let okBtn = new Button("OK", 1100, 320, 100, 50, this.clickOK.bind(this));

    uiContainer.addChild(okBtn);

    return uiContainer;
  }

  getCradTrashUI() {
    let uiContainer = new PIXI.Container();
    let uiGraphics = new PIXI.Graphics();

    let titleContainer = new PIXI.Container();

    let uiWidth = 1500;
    let uiHeight = 950;

    titleContainer.x = (width - uiWidth) / 2;
    titleContainer.y = (height - uiHeight) / 2;

    uiGraphics.beginFill(0x202020, 0.8);
    uiGraphics.drawRoundedRect(0, 0, uiWidth, uiHeight, 10);
    uiGraphics.endFill();
    titleContainer.addChild(uiGraphics);

    let text1 = "Choose a card.";

    let titleText = new PIXI.Text(text1, { fontFamily: 'Arial', fontSize: 24, fill: 'white', stroke: 'black', strokeThickness: 3 });

    titleText.x = 30;
    titleText.y = 10;

    titleContainer.addChild(titleText);

    uiContainer.addChild(titleContainer);

    let backBtn = new Button("Back", uiWidth - 110, uiHeight - 60, 100, 50, this.clickBack.bind(this));

    titleContainer.addChild(backBtn);

    let cards = [...player.deck];
    cards.sort();

    for (let i = 0; i < cards.length; i++) {
      
      let card = new Card((Function('return new ' + cards[i]))());

      card.x = 30  + (i % 7) * 210;
      card.y = 60 + (card.cardHeight + 30) * Math.floor(i / 7);

      card.removeAllListeners();
      card.on('mouseover', () => this.cardEnter(card));
      card.on('mouseout', () => this.cardLeave(card));
      card.on('click', () => this.clickCard(cards[i]));

      titleContainer.addChild(card);
    }

    return uiContainer;
  }


}