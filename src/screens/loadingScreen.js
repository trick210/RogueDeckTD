class LoadingScreen {

  constructor() {    

    this.loadingText = new PIXI.Text("Loading...", {fontFamily: 'Arial', fontSize: 72, fill: 'white', align: 'center', stroke: 'black', lineJoin: "bevel", strokeThickness: 5});

    this.loadingText.x = width / 2;
    this.loadingText.y = height / 2 - 200;
    this.loadingText.anchor.set(0.5, 0);

    this.barFrame = new PIXI.Graphics();    
    this.barFrame.lineStyle(6, 0x000000, 1);
    this.barFrame.beginFill(0x000000, 0);
    this.barFrame.drawRect(width / 2 - 250, height / 2, 500, 70);
    this.barFrame.endFill();

    this.progBar = new PIXI.Graphics();    
    this.progBar.beginFill(0xFFFFFF);
    this.progBar.drawRect(0, 0, 500, 70);
    this.progBar.endFill();
    this.progBar.x = width / 2 - 250;
    this.progBar.y = height/ 2;
    this.progBar.width = 0;

    this.container = new PIXI.Container();

    this.container.addChild(this.loadingText);
    this.container.addChild(this.progBar);
    this.container.addChild(this.barFrame);

  }

  progress(loader) {
    
    let prog = loader.progress / 100;
    this.progBar.width = 500 * prog;
  }


}