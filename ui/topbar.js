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

    let barWidth = 1200;
    let barHeight = 60;

    this.x = (width - barWidth) / 2;
    let y = -20

    this.bg.drawRoundedRect(0, y, barWidth, barHeight, 20);
    this.bg.endFill();

    this.bg.interactive = true;

    this.addChild(this.bg);

    this.playerName = new PIXI.Text(playerName, {fontFamily: 'Arial', fontSize: 20, fill: 0xFFFFFF, stroke: 'black', strokeThickness: 3});
    this.playerName.x = 10;
    this.playerName.y = 6;

    this.addChild(this.playerName);


    this.stageText = new PIXI.Text("", {fontFamily: 'Arial', align: 'center', fontSize: 20, fill: 0xFFFFFF, stroke: 'black', strokeThickness: 3});
    this.stageText.x = barWidth / 2;
    this.stageText.y = 6;
    this.stageText.anchor.set(0.5, 0);

    this.addChild(this.stageText);

    this.hpIcon = new PIXI.Graphics();
    this.hpIcon.beginFill(0xFF3030);
    this.hpIcon.lineStyle(1, 0x000000);
    this.hpIcon.drawRect(0, 8, 24, 8);
    this.hpIcon.drawRect(8, 0, 8, 24);
    this.hpIcon.lineStyle(0, 0x000000);
    this.hpIcon.drawRect(7, 9, 10, 6);
    this.hpIcon.endFill();
    this.hpIcon.x = 180;
    this.hpIcon.y = 8;

    this.addChild(this.hpIcon);

    this.hpText = new PIXI.Text("0 / 0", {fontFamily: 'Arial', fontSize: 20, fontWeight: "bold", fill: 0xFF3030, stroke: 'black', strokeThickness: 3});
    this.hpText.x = 300;
    this.hpText.y = 6;

    this.hpText.anchor.set(1, 0);

    this.addChild(this.hpText);

  }

  update() {
    this.stageText.text = ((player.stage == 0) ? "" : ("Planet " + player.stage + " - ")) + "Galaxy " + player.galaxy;
    this.hpText.text = player.hp + " / " + player.maxHP
  }
}