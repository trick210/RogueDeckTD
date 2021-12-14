

const buffTags = {

  TIMED: "Timed",
  STACKS: "Stacks",
  UNIQUE: "Unique",
  CHARGES: "Charges",
  CONCAT_DURATION: "Concat duration",
  REFRESH_DURATION: "Refresh duration",
}

class Buff {
  constructor(name, effect, onApply = (() => { }), onRemove = (() => { })) {
    this.name = name;
    this.effect = (...args) => { effect(this, ...args) };
    this.onApply = (...args) => { onApply(this, ...args) };
    this.onRemove = (...args) => { onRemove(this, ...args) };

    this.stacks = 1;

    this.tags = [];

    this.iconContainer = new PIXI.Container();

    this.icon = new PIXI.Graphics();
    this.icon.beginFill(0xAAFFAA);
    this.icon.drawRect(0, 0, 32, 32);
    this.icon.endFill();
    this.iconContainer.addChild(this.icon);

    this.cdArc = new PIXI.Graphics();
    this.iconContainer.addChild(this.cdArc);

    this.iconFrame = new PIXI.Graphics();
    this.iconFrame.lineStyle(4, 0x000000, 1);
    this.iconFrame.beginFill(0x000000, 0);
    this.iconFrame.drawRect(0, 0, 32, 32);
    this.iconFrame.endFill();
    this.iconContainer.addChild(this.iconFrame);

    this.iconText = new PIXI.Text(this.name.charAt(0), {fontFamily: 'Arial', fontSize: 20, fill: 'black', align: 'center'});
    this.iconText.x = 12;
    this.iconText.y = 12;
    this.iconText.anchor.set(0.5);
    this.iconContainer.addChild(this.iconText);

    this.stackText = new PIXI.Text("", {fontFamily: 'Arial', fontSize: 14, fill: 'red', align: 'center'});
    this.stackText.x = 30;
    this.stackText.y = 30;
    this.stackText.anchor.set(1);
    this.iconContainer.addChild(this.stackText);

    

    let mask = new PIXI.Graphics();
    this.iconContainer.addChild(mask);
    mask.lineStyle(4, 0x000000, 1);
    mask.beginFill(0xAAFFAA);
    mask.drawRect(0, 0, 32, 32);
    mask.endFill();

    this.iconContainer.mask = mask;
  }

  setDuration(duration) {
    this.duration = duration;
    this.baseDuration = duration;
    this.tags.push(buffTags.TIMED);
  }

  makeUnique(uniqueTag) {
    this.uniqueTag = uniqueTag;
    this.tags.push(buffTags.UNIQUE);
  }

  setStacks(stacks) {
    this.stacks = stacks;
    this.tags.push(buffTags.STACKS);
    //let oldEffect = this.effect;
    //this.effect = tower => { oldEffect(tower, this.stacks) };
  }

  setCharges(charges) {
    this.charges = charges;
    this.tags.push(buffTags.CHARGES);
  }

  updateBuffIcon() {
    if (this.tags.includes(buffTags.STACKS) && this.stacks > 1) {
      this.stackText.text = this.stacks;
    }

    if (this.tags.includes(buffTags.CHARGES)) {
      this.stackText.text = this.charges;
    }

    if (this.tags.includes(buffTags.TIMED)) {
      this.cdArc.clear();
      this.cdArc.beginFill(0x808080, 0.5);
      this.cdArc.arc(16, 16, 64, - Math.PI / 2, - Math.PI / 2 + (2 * Math.PI * (this.baseDuration - this.duration) / this.baseDuration) + 0.01, true);
      this.cdArc.lineTo(16, 16);
      this.cdArc.endFill();
    }
  }
}
