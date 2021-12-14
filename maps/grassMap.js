class GrassMap {

  constructor() {

    this.gridSize = 64;
    this.mapWidth = 30;
    this.mapHeight = 12;

    this.bg = new Sprite(PIXI.Texture.WHITE);
    this.bg.width = width;
    this.bg.height = height - 300;
    this.bg.tint = 0x00AA00;

    this.path = new PIXI.Graphics();

    let pathGenerator = new PathGenerator();

    let config = JSON.parse(mapConfig1);
    config.width = this.bg.width;
    config.height = this.bg.height;

    this.generatedPath = pathGenerator.createMap(config);

    this.setupMap();

    this.startPos = this.generatedPath.path[0];


    this.container = new PIXI.Container();
    this.container.addChild(this.bg);
    this.container.addChild(this.path);
  }




  getWave(round) {

    let totalHP = 2000;
    let totalMonster = 10;

    let armor = Math.round(Math.random() * 100);

    if (round != 1) {
      totalMonster = 2 + Math.floor(Math.random() * 14);
    }

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

    for (let i = 0; i < totalMonster; i++) {
      let walker = new Walker(this.startPos.x, this.startPos.y, Math.floor((totalHP / totalMonster) / ((armor + 100) / 100)), armor);
      walker.spawnIndex = i;
      monster.push(walker);
    }

    return monster;
  }


  setupMap() {

    this.polygon = this.generatedPath.outlineBot.concat(this.generatedPath.outlineTop.reverse());


    this.path.clear();
    this.path.lineStyle(3, 0x000000);
    this.path.beginFill(0xC2B280);
    this.path.moveTo(this.polygon[this.polygon.length - 1].x, this.polygon[this.polygon.length - 1].y);


    for (let i = 0; i < this.polygon.length; i++) {
      this.path.lineTo(this.polygon[i].x, this.polygon[i].y);
    }

    this.path.endFill();

    this.pathHitbox = new PIXI.Polygon(this.polygon);

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
    
    return false;
  }

  getPosition(dist) {
    let remainingDist = dist;
    if (this.generatedPath.beziers != null) {

      for (let i = 0; i < this.generatedPath.beziers.length; i++) {
        let len = this.generatedPath.beziers[i].length();
        if (remainingDist < len) {
          let t = remainingDist / len;
          return this.generatedPath.beziers[i].get(t);
        } else {
          remainingDist -= len;
        }
      }
    } else {
      for (let i = 1; i < this.generatedPath.path.length; i++) {
        let len = this.generatedPath.path[i].segLength;
        if (remainingDist < len) {
          let t = remainingDist / len;
          return {
            x: this.generatedPath.path[i - 1].x + t * (this.generatedPath.path[i].x - this.generatedPath.path[i - 1].x),
            y: this.generatedPath.path[i - 1].y + t * (this.generatedPath.path[i].y - this.generatedPath.path[i - 1].y)
          };
        } else {
          remainingDist -= len;
        }
      }
    }
  }

}