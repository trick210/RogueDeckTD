class CentipedeBossMap extends CombatMap {

  constructor(mapSeed, conf) {
    super(mapSeed, conf);

    let startDist = 200
    let headPos = this.getPosition(startDist);
    this.head = new CentipedeBossHead(headPos.x, headPos.y);
    this.head.distTraveled = startDist;
    this.head.rotate(headPos.rot);

    this.initialSpawns.push(this.head);

    this.maxRounds = Number.MAX_SAFE_INTEGER;
  }


  getWave(round) {

    let type = CentipedeBossPart

    let totalHP = 2000;
    let totalMonster = type.UNIT_COUNT;

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
      let unit = type.SPAWN(this.startPos.x, this.startPos.y, Math.floor(totalHP / totalMonster))
      unit.head = this.head;
      monster.push(unit);
    }

    return monster;
  }


}