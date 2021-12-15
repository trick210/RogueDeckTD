class LightningStrike extends Entity {
  constructor(posX, posY, target, dmg, color, srcTower) {
    super(posX, posY);

    this.layer = 10;

    this.lifeTime = 200;

    let totalLength = Math.sqrt(dist2(this, target));
    let length = 0;
    let points = [];

    while (length <= totalLength) {
      let segment = 10 + (Math.random() * totalLength / 50);
      length += segment;
      points.push({x: length, y: Math.sin(length) * 10});
    }

    points.splice(-1);
    points.push({x: totalLength, y: 0});

    this.texture = new PIXI.Graphics();
    this.texture.lineStyle(5, color);
    this.texture.moveTo(0, 0);
    for (let i = 0; i < points.length; i++) {
      this.texture.lineTo(points[i].x, points[i].y);
    }

    let vec = {
      x: target.x - this.x,
      y: target.y - this.y
    }

    let mag = Math.sqrt(vec.x * vec.x + vec.y * vec.y);

    vec.x /= mag;
    vec.y /= mag;

    let rot = Math.PI / 2 - Math.atan2(vec.x, vec.y);

    this.texture.rotation = rot;

    this.addChild(this.texture);

    let dmgObj = {
      amount: dmg,
      damageType: "LIGHTNING"
    }
    
    target.recieveDamage(dmgObj);

    srcTower.onHit(target);

  } 
  
  update() {
    this.lifeTime -= deltaTime;
    if (this.lifeTime <= 0) {
      this.remove();
    }
  }
}