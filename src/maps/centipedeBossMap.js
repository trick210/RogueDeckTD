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
    let monster = super.getWave(round, [CentipedeBossPart]);
    for (let unit of monster) {
      unit.head = this.head;
    }
    
    return monster;

  }


}