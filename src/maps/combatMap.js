class CombatMap {

  static CREATE(mapSeed, conf) {
    return new this(mapSeed, conf);
  }

  constructor(mapSeed, config) {


    this.bg = new Sprite(PIXI.Texture.WHITE);
    this.bg.width = width;
    this.bg.height = height - 275;
    this.bg.tint = config.bgColor;

    this.pathColor = config.pathColor;

    this.path = new PIXI.Graphics();

    let pathGenerator = new PathGenerator(mapSeed);

    let waveSeed = mulberry32(mapSeed)() * 0xFFFFFFFF;

    this.waveRand = mulberry32(waveSeed);

    
    config.width = this.bg.width;
    config.height = this.bg.height;

    this.generatedPath = pathGenerator.createMap(config);

    this.setupMap();

    this.startPos = this.generatedPath.path[0];


    this.container = new PIXI.Container();
    this.container.addChild(this.bg);
    this.container.addChild(this.path);

    this.initialSpawns = [];
    this.maxRounds = 3;
  }


  getWave(round, types) {

    
    let monsterTypes = [Walker, Snail, Swarmer];
    
    if (types != null) {
     monsterTypes = types; 
    }

    let type = monsterTypes[Math.floor(monsterTypes.length * this.waveRand())];

    

    let totalHP = 2000;
    let totalMonster = type.UNIT_COUNT;

    /*
    let armor = Math.round(this.waveRand() * 100);

    if (round != 1) {
      totalMonster = 2 + Math.floor(this.waveRand() * 14);
    }
    */

    switch (round) {
      case 1:
        break;

      case 2:
        totalHP = 3000; 
        break;

      case 3:
        totalHP = 4200;
        break;

      case 4:
        totalHP = 5460;
        break;

      case 5:
        totalHP = 6552;
        break;

      default:
        totalHP = 6552;
        for (let i = 0; i < round - 5; i++) {
          totalHP += Math.floor(totalHP * 0.1);
        }
        break;

    }

    let monster = [];

    let spawnTimer = 0;
    let spawnIntervall = 10000;

    for (let i = 0; i < totalMonster; i++) {
      //let walker = new Walker(this.startPos.x, this.startPos.y, Math.floor((totalHP / totalMonster) / ((armor + 100) / 100)), armor);
      let unit = type.SPAWN(this.startPos.x, this.startPos.y, Math.floor(totalHP / totalMonster), spawnTimer, this.waveRand);
      spawnTimer += spawnIntervall / (totalMonster - 1);
      monster.push(...unit);
    }

    return monster;
  }


  setupMap() {

    this.polygon = this.generatedPath.outlineBot.concat(this.generatedPath.outlineTop.reverse());


    this.path.clear();
    this.path.lineStyle(3, 0x000000);
    this.path.beginFill(this.pathColor);
    this.path.moveTo(this.polygon[this.polygon.length - 1].x, this.polygon[this.polygon.length - 1].y);


    for (let i = 0; i < this.polygon.length; i++) {
      this.path.lineTo(this.polygon[i].x, this.polygon[i].y);
    }

    this.path.endFill();

    this.pathHitbox = new PIXI.Polygon(this.polygon);

    let pos, vec;

    if (this.generatedPath.beziers != null) {
      pos = this.generatedPath.beziers[this.generatedPath.beziers.length - 1].get(0.99);
      vec = this.generatedPath.beziers[this.generatedPath.beziers.length - 1].derivative(0.99);
    } else {
      pos = this.generatedPath.path[this.generatedPath.path.length - 1];
      vec = {
        x: this.generatedPath.path[this.generatedPath.path.length - 1].x - this.generatedPath.path[this.generatedPath.path.length - 2].x,
        y: this.generatedPath.path[this.generatedPath.path.length - 1].y - this.generatedPath.path[this.generatedPath.path.length - 2].y
      };

    }

    let mag = Math.sqrt(vec.x * vec.x + vec.y * vec.y);

    vec.x /= mag;
    vec.y /= mag;

    let rot =  Math.PI / 2 - Math.atan2(vec.x, vec.y);

    this.ship = new SpaceShip(pos.x + 24 * vec.x, pos.y + 24 * vec.y, rot);

  }

  collide(texture) {
    if (!texture.circular) return false;

    let p = texture.getGlobalPosition();

    if (this.pathHitbox.contains(p.x, p.y)) {
      return true;
    }

    for (let i = 0; i < this.polygon.length - 1; i++) {
      if (distToSegment(p, this.polygon[i], this.polygon[(i + 1)]) < texture.radius) {
        return true;
      }
    }

    if (new PIXI.Polygon(this.ship.bounds).contains(p.x, p.y)) {
      return true;
    }

    for (let i = 0; i < this.ship.bounds.length - 1; i++) {
      if (distToSegment(p, this.ship.bounds[i], this.ship.bounds[(i + 1)]) < texture.radius) {
        return true;
      }
    }
    
    return false;
  }

  getPosition(dist) {
    let remainingDist = dist;
    if (this.generatedPath.beziers != null) {

      for (let i = 0; i < this.generatedPath.beziers.length; i++) {
        let len = this.generatedPath.beziers[i].length();
        if (remainingDist < len) {
          let t = remainingDist / len;
          let pos = this.generatedPath.beziers[i].get(t);
          let vec = this.generatedPath.beziers[i].normal(t);
          pos.rot = Math.PI / 2 - Math.atan2(vec.x, vec.y);
          return pos;
        } else {
          remainingDist -= len;
        }
      }
    } else {
      for (let i = 1; i < this.generatedPath.path.length; i++) {
        let len = this.generatedPath.path[i].segLength;
        if (remainingDist < len) {
          let t = remainingDist / len;
          let pos = {
            x: this.generatedPath.path[i - 1].x + t * (this.generatedPath.path[i].x - this.generatedPath.path[i - 1].x),
            y: this.generatedPath.path[i - 1].y + t * (this.generatedPath.path[i].y - this.generatedPath.path[i - 1].y)
          };

          let vec = {
            x: this.generatedPath.path[i].x - this.generatedPath.path[i - 1].x,
            y: this.generatedPath.path[i].y - this.generatedPath.path[i - 1].y
          };

          let mag = Math.sqrt(vec.x * vec.x + vec.y * vec.y);

        vec.x /= mag;
        vec.y /= mag;

        pos.rot =  Math.PI - Math.atan2(vec.x, vec.y);

          return pos;
        } else {
          remainingDist -= len;
        }
      }
    }
  }

  drawShipBounds() {
    let outlineShip = new PIXI.Graphics();
    outlineShip.lineStyle(3, 0x000000);
    outlineShip.moveTo(this.ship.bounds[this.ship.bounds.length - 1].x, this.ship.bounds[this.ship.bounds.length - 1].y);

    for (let i = 0; i < this.ship.bounds.length; i++) {
      outlineShip.lineTo(this.ship.bounds[i].x, this.ship.bounds[i].y);
    }

    this.container.addChild(outlineShip);
  }

}