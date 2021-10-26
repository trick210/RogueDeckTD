class BaseTower extends Tower {

  constructor() {
    super();

    this.name = "Base Tower";

    this.cost = 1;

    this.dmg = 50;
    this.range = 400;
    this.attackSpeed = 2;

    this.dps = this.dmg * this.attackSpeed;

    this.tags.push(towerTags.MISSILES);
    this.tags.push(towerTags.DAMAGE);
    
  }


  getCardText() {
    let text = 
      "Damage: " + this.dmg + "\n" +
      "Range: " + this.range + "\n" +
      "Attack speed: " + this.attackSpeed + "\n" +
      "DPS: " + this.dps;

    return text;
  }

}