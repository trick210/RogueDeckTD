class SpaceShip extends PIXI.Container {
  constructor(posX, posY, rot) {
    super();

    this.x = posX;
    this.y = posY;

    this.texture = new PIXI.Sprite(resources['spaceShip'].texture);

    this.texture.anchor.set(0.5);
    this.texture.width = 196;
    this.texture.height = 384;

    this.texture.rotation = rot;

    let topLeft = {
      x: this.x - this.texture.width / 2 + 16,
      y: this.y - this.texture.height / 2 + 24
    };
    let topRight = {
      x: this.x + this.texture.width / 2 - 16,
      y: this.y - this.texture.height / 2 + 24
    };
    let bottomRight = {
      x: this.x + this.texture.width / 2 - 64,
      y: this.y + this.texture.height / 2 - 24
    };
    let bottomLeft = {
      x: this.x - this.texture.width / 2 + 64,
      y: this.y + this.texture.height / 2 - 24
    };

    let matrix = new PIXI.Matrix();


    matrix.identity()
      .translate(-this.x, -this.y)
      .rotate(rot)
      .translate(this.x, this.y);
    
    topLeft = matrix.apply(topLeft);
    topRight = matrix.apply(topRight);
    bottomRight = matrix.apply(bottomRight);
    bottomLeft = matrix.apply(bottomLeft);

    this.bounds = [topLeft, topRight, bottomRight, bottomLeft, topLeft];

    this.addChild(this.texture);
  }

}