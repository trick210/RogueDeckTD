class UI {

  constructor(gs) {

    this.gs = gs;

    this.bg = new Sprite(PIXI.Texture.WHITE);
    this.bg.width = width;
    this.bg.height = 300;
    this.bg.tint = 0x01579B;

    this.buttons = [];

    this.startButton = new Button("Start", width - 240, 20, 200, 75, this.gs.startLevel.bind(this.gs));

    this.buttons.push(this.startButton);

    this.container = new PIXI.Container();

    this.container.y = height - this.bg.height;

    this.container.addChild(this.bg);

    for (let i = 0; i < this.buttons.length; i++) {
      this.container.addChild(this.buttons[i].container);
    }

    this.handContainer = [];

    for (let i = 0; i < 5; i++) {
      let ctn = new PIXI.Container();
      ctn.x = 20 + i * 200;
      ctn.y = 20;
      this.handContainer.push(ctn);
      this.container.addChild(ctn);
    }

  }

  update() {

    for (let i = 0; i < this.buttons.length; i++) {
      this.buttons[i].update();
    }

    

  }

  cardToHand(card) {
    for (let i = 0; i < this.handContainer.length; i++) {
      if (this.handContainer[i].children.length == 0) {
        this.handContainer[i].addChild(card);
        break;
      }
    }
  }


}