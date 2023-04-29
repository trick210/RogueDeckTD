class DeckScreen {
    constructor() {
        this.container = new PIXI.Container();

        let deck = new DeckView(this.back.bind(this), () => { });

        this.container.addChild(deck);
    }
    
    update() {

    }

    back() {
        setOverlay(null);
    }
}