class MenuScreen {

  constructor() {

    document.getElementById("seedText").textContent = "";
    Topbar.REMOVE();

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    this.size = 72;

    this.bg = new Sprite(PIXI.Texture.WHITE);
    this.bg.width = width;
    this.bg.height = height;
    this.bg.tint = 0x2C3539;

    this.titleText = new PIXI.Text("RogueDeckTD", { fontFamily: 'Arial', fontSize: 96, fill: 'white', align: 'center', stroke: 'black', strokeThickness: 5 });
    this.startButton = new Button("Start Game", width / 2 - 100, height / 2 - 200, 200, 50, this.click.bind(this));

    this.mapSeedInput = this.createInputBox();

    this.mapSeedInput.placeholder = "Random Map Seed";
    this.mapSeedInput.x = width / 2 + 2;
    this.mapSeedInput.y = height / 2 - 125;

    this.deckSeedInput = this.createInputBox();

    this.deckSeedInput.placeholder = "Random Deck Seed";
    this.deckSeedInput.x = width / 2 + 2;
    this.deckSeedInput.y = height / 2 - 50;

    if (urlParams.has('ms')) {
      this.mapSeedInput.text = urlParams.get('ms').substring(0, 8);
    }

    if (urlParams.has('ds')) {
      this.deckSeedInput.text = urlParams.get('ds').substring(0, 8);
    }



    this.titleText.x = width / 2;
    this.titleText.y = 45;
    this.titleText.anchor.set(0.5, 0);


    this.errorText = new PIXI.Text("Error", { fontFamily: 'Arial', fontSize: 24, fill: 'red', align: 'center', stroke: 'black', strokeThickness: 2 });

    this.errorText.x = width / 2;
    this.errorText.y = height / 2 + 20;
    this.errorText.anchor.set(0.5, 0);

    this.errorText.visible = false;

    this.container = new PIXI.Container();

    this.container.addChild(this.bg);
    this.container.addChild(this.titleText);
    this.container.addChild(this.startButton);
    this.container.addChild(this.mapSeedInput);
    this.container.addChild(this.deckSeedInput);
    this.container.addChild(this.errorText);

  }

  update() {

  }

  click() {

    if (this.mapSeedInput.text != "" && !this.mapSeedInput.text.match('[A-Fa-f0-9]{8}')) {
      this.errorText.text = "Invalid Map Seed"
      this.errorText.visible = true;
      return;
    }

    if (this.deckSeedInput.text != "" && !this.deckSeedInput.text.match('[A-Fa-f0-9]{8}')) {
      this.errorText.text = "Invalid Deck Seed"
      this.errorText.visible = true;
      return;
    }

    let mapSeed = this.mapSeedInput.text == "" ? Math.round(Math.random() * 0xFFFFFFFF) : parseInt(this.mapSeedInput.text, 16);
    let deckSeed = this.deckSeedInput.text == "" ? Math.round(Math.random() * 0xFFFFFFFF) : parseInt(this.deckSeedInput.text, 16);


    this.mapSeedInput.destroy();
    this.deckSeedInput.destroy();
    
    player = new Player("Spaceship", mapSeed, deckSeed);
    spaceScreen = new SpaceScreen();

    events = new EventManager();
    MarketPlanetScreen.CREATE_OFFERS();

    setActiveScreen(spaceScreen);
  }

  createInputBox() {
    let box = new PIXI.TextInput({
      input: {
        fontSize: '20px',
        padding: '8px',
        width: '184px',
        height: '34px',
        color: '#26272E',
        textAlign: 'center',
        fontFamily: 'Consolas',
        resolution: 2
      },
      box: {
        default: { fill: 0xFFFFFF, rounded: 10, stroke: { color: 0x000000, width: 4 } },
        focused: { fill: 0xDCDCDC, rounded: 10, stroke: { color: 0x000000, width: 4 } },
        disabled: { fill: 0xFFFFFF, rounded: 10, stroke: { color: 0x000000, width: 4 } }
      }
    });

    box._surrogate.resolution = 2;

    box.pivot.x = box.width / 2;

    box.maxLength = 8;

    return box;


  }

}