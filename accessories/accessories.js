class Accessories extends PIXI.Container {

  static CREATE() {
    return new this();
  }

  constructor(name, description, upgradeDesc) {
    super();
    this.name = name;
    this.description = description;
    this.upgradeDesc = upgradeDesc;

    this.upgraded = false;

    let graphics = new PIXI.Graphics();

    graphics.beginFill(0xf1c40f);
    graphics.lineStyle(4, 0x000000, 1);

    graphics.drawPolygon([80, 0,
      160, 55,
      130, 150,
      30, 150,
      0, 55
    ]);

    graphics.endFill();

    let letter = new PIXI.Text(name.charAt(0), { fontFamily: 'Arial', fontSize: 36, fill: 'white', stroke: 'black', strokeThickness: 4 });
    letter.x = 80;
    letter.y = 75;

    letter.anchor.set(0.5);

    this.addChild(graphics);
    this.addChild(letter);

    this.interactive = true;

    this.on('mouseover', this.enter.bind(this));
    this.on("mouseout", this.leave.bind(this));
    this.on("pointermove", this.move.bind(this));

    this.tooltip = new PIXI.Container();
    let tooltipBG = new PIXI.Graphics();
    tooltipBG.beginFill(0x303080);
    tooltipBG.drawRoundedRect(0, 0, 200, 300, 10);
    tooltipBG.endFill();

    tooltipBG.beginFill(0x308080);
    tooltipBG.drawRoundedRect(0, 0, 200, 40, 10);
    tooltipBG.endFill();

    tooltipBG.alpha = 0.8;
    this.tooltip.addChild(tooltipBG);

    let nameText = new PIXI.Text(name, { fontFamily: 'Arial', fontSize: 48, fill: 'white', stroke: 'black', strokeThickness: 4 });
    nameText.x = 10;
    nameText.y = 20;
    nameText.anchor.set(0, 0.5);
    let fx = nameText.width / nameText.height;
    let wdh = 180;
    let hgt = 40;
    let gx = wdh / hgt;
    nameText.width = (gx > fx) ? hgt * fx : wdh;
    nameText.height = (fx > gx) ? wdh / fx : hgt;

    let descriptionText = new PIXI.Text(description, { fontFamily: 'Arial', fontSize: 16, fill: 'white', stroke: 'black', strokeThickness: 2 });
    descriptionText.x = 10;
    descriptionText.y = 50;
    descriptionText.style.wordWrap = true;
    descriptionText.style.wordWrapWidth = 180;

    let upgradeText = new PIXI.Text("Upgrade: " + upgradeDesc, { fontFamily: 'Arial', fontSize: 16, fill: 'white', stroke: 'black', strokeThickness: 2 });
    upgradeText.x = 10;
    upgradeText.y = 70 + descriptionText.height;
    upgradeText.style.wordWrap = true;
    upgradeText.style.wordWrapWidth = 180;

    this.tooltip.addChild(nameText);
    this.tooltip.addChild(descriptionText);
    this.tooltip.addChild(upgradeText);

  }

  enter(e) {
    let pos = e.data.global;

    this.tooltip.x = pos.x;
    this.tooltip.y = pos.y;

    app.stage.addChild(this.tooltip);
  }

  leave() {
    app.stage.removeChild(this.tooltip);
  }

  move(e) {
    let pos = e.data.global;

    this.tooltip.x = pos.x;
    this.tooltip.y = pos.y;
  }

  equip() {
    player.accessories.push(this);
    this.leave();
  }

  upgrade() {
    this.upgraded = true;
  }
}
