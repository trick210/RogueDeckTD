class Button extends PIXI.Container {

  constructor(text, posX, posY, btnWidth, btnHeight, fn, fontSize = 24) {
    super();

    this.text = text;
    this.x = posX;
    this.y = posY;
    this.fn = fn;

    this.isDown = false;
    this.isOver = false;

    this.standardFill = 0xFFFFFF;
    this.hoverFill = 0xDCDCDC;
    this.downFill = 0xC8C8C8;


    this.rect = new PIXI.Graphics();    
   
    this.rect.lineStyle(4, 0x000000, 1);
    this.rect.beginFill(0xFFFFFF);
    this.rect.drawRoundedRect(0, 0, btnWidth, btnHeight, 10);
    this.rect.endFill();

    this.rect.tint = this.standardFill;

    this.addChild(this.rect);

    this.btnText = new PIXI.Text(text, {fontFamily: 'Arial', fontSize: fontSize, fill: 'black', align: 'center'});
    this.btnText.x = btnWidth / 2;
    this.btnText.y = btnHeight / 2;
    this.btnText.anchor.set(0.5);

    this.addChild(this.btnText);


    this.rect.interactive = true;
    this.rect.buttonMode = true;
    this.rect.on('mousedown', this.onButtonDown.bind(this));
    this.rect.on('mouseup', this.onButtonUp.bind(this));
    this.rect.on('mouseupoutside', this.onButtonUp.bind(this));
    this.rect.on('mouseover', this.onButtonOver.bind(this));
    this.rect.on('mouseout', this.onButtonOut.bind(this));
    this.rect.on('click', this.click.bind(this));
    
  }

  onButtonDown() {
    this.isDown = true;
    this.rect.tint = this.downFill;
  }

  onButtonUp() {
    this.isDown = false
    if (this.isOver) {
      this.rect.tint = this.hoverFill;
    } else {
      this.rect.tint = this.standardFill;
    }
  }

  onButtonOver() {
    this.isOver = true;
    if (this.isDown) {
      return;
    }
    this.rect.tint = this.hoverFill;
  }

  onButtonOut() {
    this.isOver = false;
    if (this.isDown) {
      return;
    }
    this.rect.tint = this.standardFill;
  }

  update() {

  }

  click() {
    this.fn();
  }

  enable() {
    this.rect.interactive = true;
    this.rect.tint = this.standardFill;
  }

  disable() {
    this.rect.interactive = false;
    this.rect.tint = 0x808080;
  }


}
