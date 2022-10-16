class RewardScreen {

  constructor(rewardSeed) {

    this.container = new PIXI.Container();

    this.bg = new Sprite(PIXI.Texture.WHITE);
    this.bg.width = width;
    this.bg.height = height;
    this.bg.tint = 0x2C3539;

    this.stageText = new PIXI.Text("You cleared planet " + player.stage, { fontFamily: 'Arial', fontSize: 64, fill: 'white', align: 'center', stroke: 'black', strokeThickness: 5 });
    this.rewardText = new PIXI.Text('Pick a reward', { fontFamily: 'Arial', fontSize: 48, fill: 'lime', align: 'center', stroke: 'black', strokeThickness: 5 });

    this.moneyText = new PIXI.Text('+ x G', { fontFamily: 'Arial', fontSize: 32, fill: 'gold', align: 'center', stroke: 'black', strokeThickness: 5 });
    

    this.skipButton = new Button("Skip", width / 2 - 100, height / 2 + 100, 200, 50, this.click.bind(this));

    this.rewardText.x = width / 2;
    this.rewardText.y = 180;
    this.rewardText.anchor.set(0.5, 0);

    this.stageText.x = width / 2;
    this.stageText.y = 50;
    this.stageText.anchor.set(0.5, 0);

    this.moneyText.x = width / 2;
    this.moneyText.y = height / 2 + 200;
    this.moneyText.anchor.set(0.5, 0);


    this.container.addChild(this.bg);
    this.container.addChild(this.rewardText);
    this.container.addChild(this.stageText);
    this.container.addChild(this.skipButton);
    this.container.addChild(this.moneyText);

    let rand = mulberry32(rewardSeed);

    let rewards = [...rewardPool];

    for (let i = 0; i < 3; i++) {
      let cardName = rewards.splice(Math.floor(rand() * rewards.length), 1)[0];

      let card = new Card((Function('return new ' + cardName))());

      card.x = width / 2 - card.cardWidth / 2 + (i - 1) * 250;
      card.y = 300;

      card.on('mouseover', () => this.cardEnter(card));
      card.on('mouseout', () => this.cardLeave(card));
      card.on('click', () => this.click(cardName));

      this.container.addChild(card);
    }

    let money = 20 + Math.floor(rand() * 11);
    this.moneyText.text = "+ " + money + " G";
    player.money += money;

  }

  update() {

  }

  cardEnter(card) {
    card.cardFrame.tint = 0xFFFF00;
  }

  cardLeave(card) {
    card.cardFrame.tint = 0x000000;
  }

  click(cardName) {
    if (cardName != null) {
      player.deck.push(cardName)
    }
    setActiveScreen(spaceScreen);
  }

}

const rewardPool = [
  "AmmoRefinery", 
  "MinigunTower", 
  "TempestTower", 
  "SniperNest", 
  "Adjust", 
  "CannonBlast", 
  "Overcharge", 
  "Refine", 
  "BoxOfHollowPoints"
];