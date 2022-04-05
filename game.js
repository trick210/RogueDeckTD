let gameScreen;
let spaceScreen;
let activeScreen = null;

let player;

let collider = new Bump(PIXI);

let showFrames = false;
let frameText;
let seedText;


let width = 1920;
let height = 1080;
let deltaTime = 0;
let lastTime = 0;

//Aliases
let Application = PIXI.Application,
  loader = PIXI.Loader.shared,
  resources = loader.resources,
  Sprite = PIXI.Sprite;

let app = new PIXI.Application({
  width: width,
  height: height,
  antialias: true,
  resolution: 1,
  backgroundColor: 0x2C3539
});

document.body.appendChild(app.view);
let scale = scaleToWindow(app.renderer.view, '#2C3539');

window.addEventListener("resize", function (event) {
  scale = scaleToWindow(app.renderer.view, '#2C3539');

  seedText.style.margin = app.view.style.margin;
  seedText.style.transform = getScaleMatrix();
});

document.oncontextmenu = document.body.oncontextmenu = function(e) { e.preventDefault(); }

let loadingScreen = new LoadingScreen();

setActiveScreen(loadingScreen);


loader
  .add('walker', 'assets/monster/walker.png')
  .add('baseTower', 'assets/tower/baseTower.png')
  .add('minigunTower', 'assets/tower/minigunTower.png')
  .add('sniperNest', 'assets/tower/sniperNest.png')
  .add('particle', 'assets/particles/particle.png')
  .add('spaceShip', 'assets/spaceShip.png');



loader.onProgress.add(loadingScreen.progress.bind(loadingScreen));
loader.load(setup);


let esc = keyboard("Escape");
esc.press = () => {
  if (activeScreen.keyPress) {
    activeScreen.keyPress("Escape");
  }
};

function setup() {

  seedText = document.getElementById("seedText");

  seedText.style.left = '0';
  seedText.style.top = '0';

  seedText.style.margin = app.view.style.margin;
  seedText.style.transformOrigin = "0 0";
  seedText.style.transform = getScaleMatrix();

  setActiveScreen(new MenuScreen());

  requestAnimationFrame(update);

}

function showFPS() {
  showFrames = true;
  frameText = new PIXI.Text('', { fontFamily: 'Arial', fontSize: 32, fill: 'white', align: 'center', stroke: 'black', strokeThickness: 2 });
  frameText.x = width - 10;
  frameText.y = 10;
  frameText.anchor.set(1, 0);
  app.stage.addChild(frameText);
}

function setActiveScreen(screen) {
  if (activeScreen != null) {
    app.stage.removeChild(activeScreen.container);
  }
  activeScreen = screen;
  app.stage.addChild(activeScreen.container);
}

function update(time) {

  deltaTime = (time - lastTime) % 100;
  lastTime = time;

  activeScreen.update();

  if (showFrames) {
    frameText.text = "FPS: " + Math.floor(1000 / deltaTime);
  }

  requestAnimationFrame(update);
}

function shuffle(a, rand) {
  var j, x, i;
  for (i = a.length - 1; i > 0; i--) {
    j = Math.floor(((rand != null) ? rand() : Math.random()) * (i + 1));
    x = a[i];
    a[i] = a[j];
    a[j] = x;
  }
  return a;
}

function sqr(x) { return x * x }
function dist2(v, w) { return sqr(v.x - w.x) + sqr(v.y - w.y) }
function distToSegmentSquared(p, v, w) {
  var l2 = dist2(v, w);
  if (l2 == 0) return dist2(p, v);
  var t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
  t = Math.max(0, Math.min(1, t));
  return dist2(p, {
    x: v.x + t * (w.x - v.x),
    y: v.y + t * (w.y - v.y)
  });
}
function distToSegment(p, v, w) { return Math.sqrt(distToSegmentSquared(p, v, w)); }

function keyboard(value) {
  let key = {};
  key.value = value;
  key.isDown = false;
  key.isUp = true;
  key.press = undefined;
  key.release = undefined;
  //The `downHandler`
  key.downHandler = event => {
    if (event.key === key.value) {
      if (key.isUp && key.press) key.press();
      key.isDown = true;
      key.isUp = false;
      event.preventDefault();
    }
  };

  //The `upHandler`
  key.upHandler = event => {
    if (event.key === key.value) {
      if (key.isDown && key.release) key.release();
      key.isDown = false;
      key.isUp = true;
      event.preventDefault();
    }
  };

  //Attach event listeners
  const downListener = key.downHandler.bind(key);
  const upListener = key.upHandler.bind(key);

  window.addEventListener(
    "keydown", downListener, false
  );
  window.addEventListener(
    "keyup", upListener, false
  );

  // Detach event listeners
  key.unsubscribe = () => {
    window.removeEventListener("keydown", downListener);
    window.removeEventListener("keyup", upListener);
  };

  return key;
}

function pixiMatrixToCSS(m){
  return 'matrix('+[m.a,m.b,m.c,m.d,m.tx,m.ty].join(',')+')'
}

function getScaleMatrix() {
  let matrix = app.stage.worldTransform.clone();
  let canvas_bounds = app.renderer.view.getBoundingClientRect();
  matrix.scale(canvas_bounds.width / app.renderer.width, canvas_bounds.height / app.renderer.height);

  return pixiMatrixToCSS(matrix);
}

