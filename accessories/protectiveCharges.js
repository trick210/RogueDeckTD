class ProtectiveCharges extends Accessories {

  constructor() {
    super("Protective Charges", "The first time each combat your ship takes damage it emits a shockwave sweeping over the map and dealing 200 damage to every enemy hit.", "400 damage")

    this.tookDamage = false;
    this.damage = 200;
    this.upgradedDamage = 400;
  }

  onDamage() {

    if (!this.tookDamage) {
      let charge = new ProtCharge(this.damage, this);
      charge.addToStage();
      this.tookDamage = true;
    }
  }

  onLevelEnd(gs) {
    this.tookDamage = false;
  }

  equip() {
    super.equip()
    events.addListener('onPlayerDamage', this.onDamage.bind(this));
    events.addListener('onLevelEnd', this.onLevelEnd.bind(this));
  }

  upgrade() {
    super.upgrade();
    this.damage = this.upgradedDamage;
  }

}

class ProtCharge extends Entity {

  constructor(damage, origin) {
    super(gameScreen.map.ship.x, gameScreen.map.ship.y);

    this.damage = damage;
    this.origin = origin;
    this.collidedEnemies = [];

    this.radius = 0;
    this.speed = 400;

    this.graphics = new PIXI.Graphics();

    this.addChild(this.graphics);

    this.rangeCollider = new PIXI.Sprite();
    this.rangeCollider.circular = true;
    this.rangeCollider.radius = 0;
    this.addChild(this.rangeCollider);
  }

  update() {

    this.radius += this.speed * deltaTime / 1000;

    this.graphics.clear();
    this.graphics.lineStyle(10, 0xFF5050, 1);
    this.graphics.beginFill(0x000000, 0);
    this.graphics.drawCircle(0, 0, this.radius);
    this.graphics.endFill();


    this.rangeCollider.radius = this.radius;

    let monster = gameScreen.entityContainer.children.filter(e => e.type == entityType.MONSTER);
    let monsterHit = [];

    let dmgObj = {
      amount: this.damage,
      damageType: "NORMAL"
    }

    monster.forEach(target => {
      if (collider.hit(this.rangeCollider, target.texture, false, false, true)) {
        monsterHit.push(target);
      }
    });

    monsterHit.forEach(monster => {
      if (!this.collidedEnemies.includes(monster)) {
        this.collidedEnemies.push(monster);
        monster.recieveDamage(dmgObj, this.origin);
      }
    })


    if (this.radius >= width) {
      this.remove();
    }
  }

}
