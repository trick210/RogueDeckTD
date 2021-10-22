class GameScreen {

  constructor() {

    this.text = new PIXI.Text("playing", {fontFamily: 'Arial', fontSize: 72, fill: 'white', align: 'center', stroke: 'black', strokeThickness: 5});
    this.text.x = width / 2;
    this.text.y = height / 2;
    this.text.anchor.set(0.5);
    this.container = new PIXI.Container();
    this.container.addChild(this.text);
  }

  update() {
    
  }


}