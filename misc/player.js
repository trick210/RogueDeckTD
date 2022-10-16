class Player {

  constructor(playerName, mapSeed, deckSeed) {
    this.mapSeed = mapSeed;
    this.deckSeed = deckSeed;
    this.playerName = playerName;

    this.deckRand = mulberry32(this.deckSeed);
    this.mapRand = mulberry32(this.mapSeed);

    let rewardSeed = this.deckRand() * 0xFFFFFFFF;
    this.rewardRand = mulberry32(rewardSeed);

    let pad = function(str) {
      let s = "0000000" + str;
      return s.substring(s.length - 8);
    }

    let text = "Map \xa0Seed: " + pad(this.mapSeed.toString(16).toUpperCase()) + "\n" +
               "Deck Seed: " + pad(this.deckSeed.toString(16).toUpperCase());
    seedText.appendChild(document.createTextNode(text));


    this.maxHP = 100;
    this.hp = this.maxHP;
    this.maxEnergy = 5;
    this.maxTC = 12;

    this.galaxy = 1;
    this.stage = 0;

    this.money = 300;

    this.deck = this.createDeck();

    this.accessories = [];

    Topbar.CREATE(this.playerName);


  }

  heal(amount) {
    let oldHP = this.hp;
    this.hp = Math.min(this.hp + amount, this.maxHP);

    return this.hp - oldHP;
  }

  createDeck() {
    let deck = ["BaseTower", "AmmoRefinery", "CannonBlast"];

    let towers = ["BaseTower", "MinigunTower", "TempestTower"];

    for (let i = 0; i < 3; i++) {
      let rnd = this.deckRand();
      deck.push(towers[Math.floor(rnd * towers.length)]);
    }

    let spells = ["Adjust", "CannonBlast", "Overcharge", "Refine", "BoxOfHollowPoints"];

    for (let i = 0; i < 9; i++) {
      let rnd = this.deckRand();
      deck.push(spells[Math.floor(rnd * spells.length)]);
    }

    return deck;
  }

  getNextMapSeed() {
    return Math.round(this.mapRand() * 0xFFFFFFFF);
  }

  getNextRewardSeed() {
    return Math.round(this.rewardRand() * 0xFFFFFFFF);
  }

}