class CannonBlast extends Spell {

  constructor() {
    super();

    this.name = "Cannon-Blast";

    this.cost = 1;

    this.dmg = 200;
    this.radius = 150;


    this.tags.push(spellTags.AOE);
    this.tags.push(spellTags.INSTANT);
    this.tags.push(spellTags.DAMAGE);

    this.targets = null;

  }


  getCardText() {
    let text = 
      "AOE Spell\n\n" +
      "Damage: " + this.dmg + "\n" +
      "Radius: " + this.radius;

    return text;
  }

  update() {
    if (this.targets != null) {
      this.targets.forEach(target => {
        if (target.type == entityType.MONSTER) {
          target.recieveDamage(this.dmg)
        }
      });
      this.targets = null;
      this.remove();
    }
  }

  hitTargets(pos) {
    this.targets = [];
    let possibleTargets = gameScreen.entityContainer.children.filter(e => e.type == entityType.MONSTER);

    this.x = pos.x;
    this.y = pos.y;

    let rangeCollider = new PIXI.Sprite();
    rangeCollider.circular = true;
    rangeCollider.radius = this.radius;
    this.addChild(rangeCollider);

    possibleTargets.forEach(target => {
      if (collider.hit(rangeCollider, target.texture, false, false, true)) {
        this.targets.push(target);
      }
    });

    this.removeChild(rangeCollider);

      
  }

}