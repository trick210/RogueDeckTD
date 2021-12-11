class PathGenerator {


  createMap(config) {

    let validPath = false
    let iterationCount = 0;

    let totalLength = 0;

    while(!validPath && iterationCount < 100000) {

      this.mapPositions = [];

      totalLength = 0;

      validPath = true;

      let lastPos = this.getStartPosition(config);

      

      this.mapPositions.push(lastPos);

      iterationCount++;


      while (totalLength < config.length.min) {

        
        let length = this.map(Math.random(), 0, 1, config.segmentLength.min, config.segmentLength.max);
        
        let angles = this.getValidAngles(config, length, lastPos, totalLength);

        if (angles.length == 0) {
          validPath = false;
          break;
        }

        let angle = angles[Math.floor(Math.random() * angles.length)];

        let rad = angle * (Math.PI / 180);

        let v = this.rotate(lastPos.vec, rad);
        let newPos = {
          x: lastPos.x + v.x * length,
          y: lastPos.y + v.y * length,
          vec: v,
          segLength: length
        }

        

        this.mapPositions.push(newPos);

        lastPos = newPos;
        totalLength += length;
        
      }

    }
  
    if (!validPath) {
      alert("Path creation failed after 100000 iterations");
      return [];
    }

    this.createOutline(config.pathWidth / 2);

    let result = {
      path: this.mapPositions,
      outlineTop: this.outlineTop,
      outlineBot: this.outlineBot,
    };

    if (config.splines) {
      let controlPoints = this.getCurveControlPoints(this.mapPositions);
      let controlPointsTop = this.getCurveControlPoints(this.outlineTop);
      let controlPointsBot = this.getCurveControlPoints(this.outlineBot);

      let beziers = [];
      let bezierOutlineTop = [];
      let bezierOutlineBot = [];
      for (let i = 0; i < this.mapPositions.length - 1; i++) {
        beziers.push(new Bezier(this.mapPositions[i], controlPoints.firstControlPoints[i], controlPoints.secondControlPoints[i], this.mapPositions[i + 1]));
      }

      result.beziers = beziers;

      let newOutlineTop = [];
      let newOutlineBot = [];

      for (let i = 0; i < beziers.length; i++) {
        let steps = 100;
        let points = beziers[i].getLUT(steps);
        
        for (let j = 1; j < steps - 1; j++) {
          newOutlineTop.push({x: points[j].x + beziers[i].normal(j / steps).x * config.pathWidth / 2, y: points[j].y + beziers[i].normal(j / steps).y * config.pathWidth / 2});
          newOutlineBot.push({x: points[j].x - beziers[i].normal(j / steps).x * config.pathWidth / 2, y: points[j].y - beziers[i].normal(j / steps).y * config.pathWidth / 2});
        }
      }

      result.outlineTop = newOutlineTop;
      result.outlineBot = newOutlineBot;
    }

    console.log(iterationCount);

    return result;
  }

  checkCollision(v, w) {
    
    for (let i = 1; i < this.mapPositions.length - 1; i++) {
      let t = this.mapPositions[i - 1];
      let u = this.mapPositions[i];

      let det = (w.x - v.x) * (u.y - t.y) - (u.x - t.x) * (w.y - v.y);
      if (det != 0) {
        let lambda = ((u.y - t.y) * (u.x - v.x) + (t.x - u.x) * (u.y - v.y)) / det;
        let gamma = ((v.y - w.y) * (u.x - v.x) + (w.x - v.x) * (u.y - v.y)) / det;
        if (0 < lambda && lambda < 1 && 0 < gamma && gamma < 1) return true;
      }
    }

    return false;
  }

  map(val, min1, max1, min2, max2) {
    return min2 + (max2 - min2) * (val - min1) / (max1 - min1);
  }

  rotate(vec, rad) {
    var cos = Math.cos(rad);
    var sin = Math.sin(rad);

    let v2 = {
      x: Math.round(10000 * (vec.x * cos - vec.y * sin)) / 10000,
      y: Math.round(10000 * (vec.x * sin + vec.y * cos)) / 10000
    }
    return v2;
  }

  getValidAngles(config, length, lastPos, totalLength) {
    let validAngles = [];

    config.angles.forEach(range => {
      for (let angle = range.min; angle <= range.max; angle++) {


        let rad = angle * (Math.PI / 180);

        let v = this.rotate(lastPos.vec, rad);
        let newPos = {
          x: lastPos.x + v.x * length,
          y: lastPos.y + v.y * length
        }

        

        if (newPos.x < config.edgeDistance || newPos.y < config.edgeDistance || newPos.x > config.width - config.edgeDistance || newPos.y > config.height - config.edgeDistance) {
          continue;
        }

        let tooClose = false;
        for (let i = 0; i < this.mapPositions.length - Math.ceil(config.pathDistance / config.length.min) - 2; i++) {
          if (distToSegment(newPos, this.mapPositions[i], this.mapPositions[i + 1]) < config.pathDistance) {
            tooClose = true;
            break;
          }
        }

        if (tooClose) {
          continue;
        }


        if (!config.overlap && this.checkCollision(lastPos, newPos)) {
          continue;
        }



        validAngles.push(angle);
      }
    });

    return validAngles;
  }

  createOutline(outlineWidth) {
    this.outlineTop = [];
    this.outlineBot = [];

    let copy = this.mapPositions[this.mapPositions.length - 1];
    this.mapPositions.push(copy);

    for (let i = 0; i < this.mapPositions.length - 1; i++) {
      let p1 = this.mapPositions[i];
      let p2 = this.mapPositions[i + 1];

      let angP1 = Math.atan2(p1.vec.y, p1.vec.x);
      let angP2 = Math.atan2(p2.vec.y, p2.vec.x);

      let ang = (angP1 + angP2) / 2;

      ang += Math.PI / 2;



      let rot = {
        x: Math.cos(ang),
        y: Math.sin(ang)
      };

      let posTop = {
        x: p1.x + rot.x * outlineWidth / Math.cos(ang - angP1 + Math.PI / 2),
        y: p1.y + rot.y * outlineWidth / Math.cos(ang - angP1 + Math.PI / 2)
      };

      let posBot = {
        x: p1.x - rot.x * outlineWidth / Math.cos(ang - angP1 + Math.PI / 2),
        y: p1.y - rot.y * outlineWidth / Math.cos(ang - angP1 + Math.PI / 2)
      };

      this.outlineTop.push(posTop);
      this.outlineBot.push(posBot);

    }

    this.mapPositions.splice(-1);
  }


  getStartPosition(config) {
    let pos = config.start[Math.floor(Math.random() * config.start.length)];
    let rnd = 0;
    let start = {};
    switch(pos) {
      case "LEFT":
        rnd = this.map(Math.random(), 0, 1, config.edgeDistance, config.height - config.edgeDistance);
        start = {
          x: -64,
          y: rnd,
          vec: {
            x: 1,
            y: 0
          },
          segLength: 0
        };
        this.mapPositions.push(start);

        return {
          x: config.edgeDistance,
          y: rnd,
          vec: {
            x: 1,
            y: 0
          },
          segLength: 64 + config.edgeDistance
        };

      case "RIGHT":
        rnd = this.map(Math.random(), 0, 1, config.edgeDistance, config.height - config.edgeDistance);
        start = {
          x: config.width + 64,
          y: rnd,
          vec: {
            x: -1,
            y: 0
          },
          segLength: 0
        }; 
        this.mapPositions.push(start);

        return {
          x: config.width - config.edgeDistance,
          y: rnd,
          vec: {
            x: -1,
            y: 0
          },
          segLength: 64 + config.edgeDistance
        };
 

      case "TOP": 
        rnd = this.map(Math.random(), 0, 1, config.edgeDistance, config.width - config.edgeDistance);
        start = {
          x: rnd,
          y: -64,
          vec: {
            x: 0,
            y: 1
          },
          segLength: 0
        }; 
        this.mapPositions.push(start);

        return {
          x: rnd,
          y: config.edgeDistance,
          vec: {
            x: 0,
            y: 1
          },
          segLength: 64 + config.edgeDistance
        };


      case "BOT": 
        rnd = this.map(Math.random(), 0, 1, config.edgeDistance, config.width - config.edgeDistance);
        start = {
          x: rnd,
          y: config.height + 64,
          vec: {
            x: 0,
            y: -1
          },
          segLength: 0
        }; 
        this.mapPositions.push(start);

        return {
          x: rnd,
          y: config.height - config.edgeDistance,
          vec: {
            x: 0,
            y: -1
          },
          segLength: 64 + config.edgeDistance
        };


    }
  }

  getCurveControlPoints(knots) {
    let n = knots.length - 1;

    let result = {
      firstControlPoints: [],
      secondControlPoints: []
    };

    for (let i = 0; i < n; i++) {
      result.firstControlPoints.push({});
      result.secondControlPoints.push({});
    }

    if (n < 1) {
      return result;
    }

    if (n == 1) {
  
      result.firstControlPoints[0].x = (2 * knots[0].x + knots[1].x) / 3;
      result.firstControlPoints[0].y = (2 * knots[0].y + knots[1].y) / 3;

      result.secondControlPoints[0].x = 2 *
        result.firstControlPoints[0].x - knots[0].x;
      result.secondControlPoints[0].y = 2 *
        result.firstControlPoints[0].y - knots[0].y;
      return result;
    }

    let rhs = [];
    
    for (let i = 1; i < n - 1; i++) {
      rhs[i] = 4 * knots[i].x + 2 * knots[i + 1].x;
    }
    rhs[0] = knots[0].x + 2 * knots[1].x;
    rhs[n - 1] = (8 * knots[n - 1].x + knots[n].x) / 2.0;
    
    let x = this.getFirstControlPoints(rhs);

    for (let i = 1; i < n - 1; i++) {
      rhs[i] = 4 * knots[i].y + 2 * knots[i + 1].y;
    }
    rhs[0] = knots[0].y + 2 * knots[1].y;
    rhs[n - 1] = (8 * knots[n - 1].y + knots[n].y) / 2.0;

    let y = this.getFirstControlPoints(rhs);

    for (let i = 0; i < n; i++) {

      result.firstControlPoints[i].x = x[i];
      result.firstControlPoints[i].y = y[i];
      
      if (i < n - 1) {
        result.secondControlPoints[i].x = 2 * knots[i + 1].x - x[i + 1];
        result.secondControlPoints[i].y = 2 * knots[i + 1].y - y[i + 1];
      }
      else {
        result.secondControlPoints[i].x = (knots[n].x + x[n - 1]) / 2;
        result.secondControlPoints[i].y = (knots[n].y + y[n - 1]) / 2;
      }
    }

    return result;


  }


  getFirstControlPoints(rhs) {
    let n = rhs.length;
    let x = [];
    let tmp = [];

    let b = 2
    x[0] = rhs[0] / b;
    for (let i = 1; i < n; i++) {
      tmp[i] = 1 / b;
      b = (i < n - 1 ? 4.0 : 3.5) - tmp[i];
      x[i] = (rhs[i] - x[i - 1]) / b;
    }
    for (let i = 1; i < n; i++) {
      x[n - i - 1] -= tmp[n - i] * x[n - i];
    }

    return x;
  }
}