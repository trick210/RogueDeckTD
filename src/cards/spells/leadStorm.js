class LeadStorm extends Spell {

  constructor() {
    super();

    this.name = "Lead Storm";

    this.cost = 3;

    this.duration = 10000;


    this.tags.push(spellTags.TIMED);
    this.tags.push(spellTags.BUFF);
    this.tags.push(spellTags.GLOBAL);

  }


  getCardText() {
    let text = 
      "ALL bullet towers\nshoot three times\nas many bullets\nin an arc around\ntheir target for " +
      (this.duration / 1000) + "s";

    return text;
  }

  useSpell() {

    let onApply = (buff, tower) => {
      buff.createBullet = tower.createBullet;
      tower.createBullet = (x, y, vx, vy, dmg, missileSpeed, bulletRange, projectileColor) => {
        buff.createBullet.call(tower, x, y, vx, vy, dmg, missileSpeed, bulletRange, projectileColor);

        let angle = Math.atan2(vy, vx);
        let b2vx = Math.cos(angle + 0.15);
        let b2vy = Math.sin(angle + 0.15);
        let b3vx = Math.cos(angle - 0.15);
        let b3vy = Math.sin(angle - 0.15);

        buff.createBullet.call(tower, x, y, b2vx, b2vy, dmg, missileSpeed, bulletRange, projectileColor);
        buff.createBullet.call(tower, x, y, b3vx, b3vy, dmg, missileSpeed, bulletRange, projectileColor);
      };
    };

    let onRemove = (buff, tower) => {
      tower.createBullet = buff.createBullet;
    };


    let buffEffect = (buff, gs) => {
      let towers = gs.entityContainer.children.filter(e => e.type == entityType.TOWER && e.tags.includes(towerTags.BULLET) && e.placed);

      towers.forEach(tower => {
        if (!buff.buffedTurrets.includes(tower)) {
          let towerBuff = new Buff(this.name, (b, t) => { }, onApply, onRemove);
          towerBuff.setDuration(this.duration);
          towerBuff.duration = buff.duration;
          tower.addBuff(towerBuff);
          buff.buffedTurrets.push(tower);
          buff.appliedBuffs.push(towerBuff);
        }
      });
    }

    let onGlobalBuffApply = (buff, gs) => {
      buff.buffedTurrets = [];
      buff.appliedBuffs = [];
    };

    let onGlobalBuffRemove = (buff, gs) => {
      /*
      for (let i = 0; i < buff.buffedTurrets.length; i++) {
        buff.buffedTurrets[i].removeBuff(buff.appliedBuffs[i]);
      }
      */
    };

    let globalBuff = new Buff(this.name, buffEffect, onGlobalBuffApply, onGlobalBuffRemove);
    globalBuff.setDuration(this.duration);
    globalBuff.makeUnique(this.name);

    gameScreen.addBuff(globalBuff);
    
  }

  

}