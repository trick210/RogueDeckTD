class Overcharge extends Spell {

  constructor() {
    super();

    this.name = "Overcharge";

    this.cost = 1;

    this.duration = 3;
    this.buff = 0.5;


    this.tags.push(spellTags.TIMED);
    this.tags.push(spellTags.BUFF);
    this.tags.push(spellTags.TARGETED);

  }


  getCardText() {
    let text = 
      (this.buff * 100) + "% bonus attack\ndamage\n\n" +
      "Duration: " + this.duration + " seconds\n";

    return text;
  }

}