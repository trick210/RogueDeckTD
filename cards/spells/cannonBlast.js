class CannonBlast extends Spell {

  constructor() {
    super();

    this.name = "Cannon-Blast";

    this.cost = 1;

    this.dmg = 200;
    this.radius = 100;


    this.tags.push(spellTags.AOE);
    this.tags.push(spellTags.INSTANT);
    this.tags.push(spellTags.DAMAGE);

  }


  getCardText() {
    let text = 
      "AOE Spell\n\n" +
      "Damage: " + this.dmg + "\n" +
      "Radius: " + this.radius;

    return text;
  }

}