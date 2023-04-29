class Topbar extends PIXI.Container {

  static CREATE(playerName) {
    
    Topbar.REMOVE();
    topbar = new Topbar(playerName);
    Topbar.ADD();
    
  }

  static REMOVE() {
    if (topbar != null) {
      app.stage.removeChild(topbar);
    }
  }

  static ADD() {
    app.stage.addChild(topbar);
  }

  constructor(playerName) {
    super();

    this.bg = new PIXI.Graphics();
    this.bg.lineStyle(5, 0x000000);
    this.bg.beginFill(0x303030);

    let barWidth = 1300;
    let barHeight = 60;

    this.x = (width - barWidth) / 2;
    let y = -20

    this.bg.drawRoundedRect(0, y, barWidth, barHeight, 20);
    this.bg.endFill();

    this.bg.interactive = true;

    this.addChild(this.bg);

    this.playerName = new PIXI.Text(playerName, {fontFamily: 'Arial', fontSize: 20, fill: 0xFFFFFF, stroke: 'black', lineJoin: "bevel", strokeThickness: 3});
    this.playerName.x = 10;
    this.playerName.y = 6;

    this.addChild(this.playerName);


    this.stageText = new PIXI.Text("", {fontFamily: 'Arial', align: 'center', fontSize: 20, fill: 0xFFFFFF, stroke: 'black', lineJoin: "bevel", strokeThickness: 3});
    this.stageText.x = barWidth / 2 - 180;
    this.stageText.y = 6;
    this.stageText.anchor.set(0.5, 0);

    this.addChild(this.stageText);

    this.waveText = new PIXI.Text("", {fontFamily: 'Arial', align: 'center', fontSize: 20, fill: 0xFFFFFF, stroke: 'black', lineJoin: "bevel", strokeThickness: 3});
    this.waveText.x = barWidth / 2 + 200;
    this.waveText.y = 6;
    this.waveText.anchor.set(0.5, 0);

    this.addChild(this.waveText);

    this.hpIcon = new PIXI.Graphics();
    this.hpIcon.beginFill(0xFF3030);
    this.hpIcon.lineStyle(1, 0x000000);
    this.hpIcon.drawRect(0, 8, 24, 8);
    this.hpIcon.drawRect(8, 0, 8, 24);
    this.hpIcon.lineStyle(0, 0x000000);
    this.hpIcon.drawRect(7, 9, 10, 6);
    this.hpIcon.endFill();
    this.hpIcon.x = 200;
    this.hpIcon.y = 8;

    this.addChild(this.hpIcon);

    this.hpText = new PIXI.Text("0 / 0", {fontFamily: 'Arial', fontSize: 20, fontWeight: "bold", fill: 0xFF3030, stroke: 'black', lineJoin: "bevel", strokeThickness: 3});
    this.hpText.x = 320;
    this.hpText.y = 6;

    this.hpText.anchor.set(1, 0);

    this.addChild(this.hpText);


    this.moneyText = new PIXI.Text("0 G", {fontFamily: 'Arial', fontSize: 20, fontWeight: "bold", fill: 'gold', stroke: 'black', lineJoin: "bevel", strokeThickness: 3});
    this.moneyText.x = 120;
    this.moneyText.y = 6;

    this.moneyText.anchor.set(0, 0);

    this.addChild(this.moneyText);


    this.gearIcon = new PIXI.Sprite(resources['gearIcon'].texture);
    this.gearIcon.x = barWidth - 40;
    this.gearIcon.y = 2;

    this.gearIcon.width = 32;
    this.gearIcon.height = 32;

    this.gearIcon.interactive = true;
    this.gearIcon.buttonMode = true;

    this.addChild(this.gearIcon);

    this.deckIcon = new PIXI.Sprite(resources['deckIcon'].texture);
    this.deckIcon.x = barWidth - 85;
    this.deckIcon.y = 4;

    this.deckIcon.width = 32;
    this.deckIcon.height = 32;

    this.deckIcon.interactive = true;
    this.deckIcon.buttonMode = true;

    this.deckIcon.on('click', () => { setOverlay(new DeckScreen()); });

    this.addChild(this.deckIcon);

    this.mapIcon = new PIXI.Sprite(resources['mapIcon'].texture);
    this.mapIcon.x = barWidth - 130;
    this.mapIcon.y = 2;

    this.mapIcon.width = 32;
    this.mapIcon.height = 32;

    this.mapIcon.interactive = true;
    this.mapIcon.buttonMode = true;

    //let colorMatrix = new PIXI.filters.ColorMatrixFilter();
    //colorMatrix.desaturate();

    //this.mapIcon.filters = [colorMatrix];


    this.addChild(this.mapIcon);



  }

  update() {
    this.stageText.text = ((player.stage == 0) ? "" : ("Planet " + player.stage + " - ")) + "Galaxy " + player.galaxy;
    this.hpText.text = player.hp + " / " + player.maxHP;

    this.moneyText.text = player.money + " G";

    if (activeScreen == gameScreen) {
      let round = gameScreen.round;
      let waves = gameScreen.waves;
      let currentWave = waves[round - 1];
      let nextWave = waves[round];
      this.waveText.text = "Wave " + round + ": " + currentWave.length + " " + currentWave[0].constructor.name + 
        " - Wave " + (round + 1) + ": " + nextWave[0].constructor.name;
    } else {
      this.waveText.text = "";
    }
  }
}