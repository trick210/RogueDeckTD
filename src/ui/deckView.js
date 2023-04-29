class DeckView extends PIXI.Container {
    constructor(backFN, cardClickFN) {
        super();

        let uiGraphics = new PIXI.Graphics();

        let titleContainer = new PIXI.Container();

        let uiWidth = 1500;
        let uiHeight = 950;

        titleContainer.x = (width - uiWidth) / 2;
        titleContainer.y = (height - uiHeight) / 2;

        uiGraphics.beginFill(0x202020, 0.8);
        uiGraphics.drawRoundedRect(0, 0, uiWidth, uiHeight, 10);
        uiGraphics.endFill();
        titleContainer.addChild(uiGraphics);

        let text1 = "Deck";

        this.titleText = new PIXI.Text(text1, { fontFamily: 'Arial', fontSize: 24, fill: 'white', stroke: 'black', lineJoin: "bevel", strokeThickness: 3 });

        this.titleText.x = 30;
        this.titleText.y = 10;

        titleContainer.addChild(this.titleText);

        this.addChild(titleContainer);

        let backBtn = new Button("Back", uiWidth - 110, uiHeight - 60, 100, 50, backFN);

        titleContainer.addChild(backBtn);

        let cards = [...player.deck];
        cards.sort();

        for (let i = 0; i < cards.length; i++) {

            let card = new Card((Function('return new ' + cards[i]))());

            card.x = 30 + (i % 7) * 210;
            card.y = 60 + (card.cardHeight + 30) * Math.floor(i / 7);

            card.removeAllListeners();
            card.on('mouseover', () => this.cardEnter(card));
            card.on('mouseout', () => this.cardLeave(card));
            card.on('click', () => cardClickFN(cards[i]));

            titleContainer.addChild(card);
        }
    }

    cardEnter(card) {
        card.cardFrame.tint = 0xFFFF00;
      }
    
      cardLeave(card) {
        card.cardFrame.tint = 0x000000;
      }
}