class TempestTower extends DamageTower {

  constructor() {
    super();

    this.name = "Tempest Tower";

    this.cost = 2;

    this.setTC(2);

    this.setDMG(75);

    this.setAS(1.5);

    this.setRange(250);

    this.tags.push(towerTags.LIGHTNING);

    this.texture = new PIXI.Sprite();
    this.texture.circular = true;
    this.texture.radius = 48;

    this.buttonContainer = new PIXI.Container();
    let btn = new Button("Random", 0, 0, 80, 40, () => {}, 16);
    btn.disable()
    this.buttonContainer.addChild(btn);

    this.targetOption = targetOptions.RANDOM;


    this.addChild(this.texture);

    this.graphic = new PIXI.Graphics();
    this.graphic.lineStyle(2, 0x000000, 1);
    this.graphic.beginFill(0x999999);
    this.graphic.drawCircle(0, 0, 48);
    this.graphic.endFill();
    this.graphic.beginFill(0x0000FF);
    this.graphic.drawRect(-4, -48, 8, 20);
    this.graphic.drawRect(-48, -4, 20, 8);
    this.graphic.drawRect(-4, 28, 8, 20);
    this.graphic.drawRect(28, -4, 20, 8);
    this.graphic.endFill();
    this.texture.addChild(this.graphic);

  }

  update() {
    super.update();

  }

  attackTargets(targets) {
    if (targets.length != 0) {

      this.createLightningStrike(this.x, this.y, targets[0], this.dmg, 0x00FFFF);

      return [targets[0]];
    }

    return [];
  }


  getCardText() {
    let text =
      "Damage: " + this.dmg + "\n" +
      "Range: " + this.range + "\n" +
      "Attack speed: " + this.attackSpeed + "\n" +
      "DPS: " + this.getDPS() + "\n\n" +
      "This tower only has\n" +
      "the random target\n" +
      "option";

    return text;
  }

}
