class CentipedeBossHead extends Monster {

  static HEALTH = 40000;

  constructor(posX, posY) {
    super(posX, posY, CentipedeBossHead.HEALTH);

    this.texture = new PIXI.Sprite(resources['centipedeBossHead2'].texture);
    this.texture.width = 128;
    this.texture.height = 128;
    this.texture.circular = true;
    this.texture.radius = 64;

    this.layer = 1;

    this.texture.anchor.set(0.5);

    this.addChild(this.texture);

    this.speed = 0;
    this.speedIncrease = 15;

    this.immune = true;
    this.ignore = true;

    this.damageMultiplier = 100;

    this.showBar = false;

    this.barSize = {
      x: -48,
      y: -84,
      width: 96,
      height: 16,
      frameWidth: 2
    };

    this.hpText = new PIXI.Text(this.hp, { fontFamily: 'Arial', fontSize: 14, fill: 'white', align: 'center' });
    this.hpText.anchor.set(0.5, 0);
    this.hpText.x = 0;
    this.hpText.y = this.barSize.y;

    this.addChild(this.hpText);

    this.drawHPBar();

    this.oldImmune = true;

    this.next = null;

  }

  onLeak() {
    gameScreen.endLevel();
  }

  onDeath() {
    gameScreen.winRun();
  }

  onDamaged(amount, src) {
    this.distTraveled -= 5;
  }

  update() {
    super.update();


    let parts = gameScreen.entityContainer.children.filter(e => e.type == entityType.MONSTER && e instanceof CentipedeBossPart);
    for (let part of parts) {
      if (part.prev != null) {
        continue;
      }

      let last = this;
      while (last.next != null) {
        last = last.next;
      }

      let dist = last.distTraveled - part.distTraveled;
      if (dist < last.texture.radius + part.texture.radius) {
        last.next = part;
        part.prev = last;
      }
    }

    let length = this.getTailLength();
    this.speed = length * this.speedIncrease;



    this.immune = (this.next != null);

    if (this.oldImmune != this.immune) {
      this.showBar = !this.immune;
      if (this.immune) {
        this.texture.texture = resources['centipedeBossHead1'].texture;
      } else {
        this.texture.texture = resources['centipedeBossHead2'].texture;
      }
      this.drawHPBar();
    }

    this.oldImmune = this.immune;
  }

  rotate(rot) {
    this.texture.rotation = rot + Math.PI;
  }

  getTailLength() {
    let length = 0;
    let last = this;
    while (last.next != null) {
      length++;
      last = last.next;
    }
    return length;
  }

  drawHPBar() {
    super.drawHPBar();

    this.hpText.text = Math.round(this.hp);

    this.hpText.visible = this.showBar;
  }


}


class CentipedeBossPart extends Monster {

  static UNIT_COUNT = 5;

  constructor(posX, posY, hp) {
    super(posX, posY, hp);

    this.texture = new PIXI.Sprite(resources['centipedeBossPart'].texture);
    this.texture.width = 64;
    this.texture.height = 64;
    this.texture.circular = true;
    this.texture.radius = 32;

    this.texture.anchor.set(0.5);

    this.connector = new PIXI.Graphics();
    this.addChildAt(this.connector, 0);

    this.addChild(this.texture);

    this.baseSpeed = 150;
    this.speed = this.baseSpeed;

    this.damageMultiplier = 0.01;

    this.next = null;
    this.prev = null;



  }

  onDeath() {
    super.onDeath();

    if (this.prev != null) {
      this.prev.next = null;
      this.prev = null;
    }

    let current = this;
    while (current.next != null) {
      let next = current.next;
      current.next = null;
      next.prev = null;
      current = next;
    }
  }


  rotate(rot) {
    this.texture.rotation = rot;
  }

  update() {
    super.update();

    if (this.prev != null) {
      this.speed = this.head.getTailLength() * this.head.speedIncrease;
    } else {
      this.speed = this.baseSpeed;
    }

    this.drawConnector();
  }

  drawConnector() {
    this.connector.clear();
    if (this.prev == null) return;

    this.connector.lineStyle(2, 0x000000);
    this.connector.beginFill(0x4B4BFF);
    this.connector.drawRect(0, -16, Math.sqrt(dist2(this, this.prev)), 32);
    this.connector.endFill();

    let v = {
      vx: this.prev.x - this.x,
      vy: this.prev.y - this.y
    };

    let mag = Math.sqrt(v.vx * v.vx + v.vy * v.vy);

    v.vx /= mag;
    v.vy /= mag;
    let rot = Math.atan2(v.vy, v.vx);

    this.connector.rotation = rot;

  }


}