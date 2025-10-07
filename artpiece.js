//ALL Citations:
//Mix of Garrite's noiseexample lecture recording and coding train youtube channel
//Lantern base inspo:https://www.youtube.com/watch?v=UcdigVaIYAk
//Firework:https://www.youtube.com/watch?v=DxDn2u7sQuI
// Citation music background copyright free: https://www.youtube.com/watch?v=-CD2G9m7JEw

const size = 160;
const layers = 10;
let musicPlayer;
let fireworkPlayer;
const FIREWORK_COLORS = [
  [255, 100, 100],
  [100, 150, 255],
  [255, 200, 100],
  [200, 100, 255],
  [255, 150, 200],
];
let fireworks = [];
let inc = 0.002;
let start = 0;
let lantern = [];
let backgroundParticles = [];
const numParticles = 100; // reduced for performance
const noiseScale = 0.01; // zoom in on noise

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);

  //load mp3 here-----
  fireworkPlayer = new Tone.Player("sounds/firework.mp3").toDestination();
  musicPlayer = new Tone.Player("sounds/music.mp3").toDestination();
  // Initialize flow field particles
  for (let i = 0; i < numParticles; i++) {
    backgroundParticles.push(createVector(random(width), random(height)));
  }

  background(0); // solid black background
  //muci mp3 background
  let musicStarted = false; // flag to start music only once
  window.addEventListener("click", async () => {
    await Tone.start(); // resume audio context

    if (!musicStarted) {
      //music sound
      musicPlayer.volume.value = -40;
      musicPlayer.loop = true;
      musicPlayer.start();
      musicStarted = true;
    }
  });
}

function draw() {
  // background(223, 242, 235);
  // background(60, 70, 123);
  background(0);
  // -------Flow field background (alive)
  stroke(255, 234, 172); // glowing stars color
  strokeWeight(1);

  for (let p of backgroundParticles) {
    let angle =
      (noise(p.x * noiseScale, p.y * noiseScale, frameCount * 0.01) * PI) / 4;

    let speed = 0.3;
    p.x += cos(angle) * speed;
    p.y += sin(angle) * speed;

    point(p.x, p.y);

    // Wrap around edges
    if (p.x > width) p.x = 0;
    if (p.y < 0) p.y = height;
    if (p.y > height) p.y = 0;
  }

  //------wavesss-----
  const originalY = 200; //the base line
  const divider = 970;
  // noiseSeed(1);

  for (let i = 0; i < 4; i++) {
    let xoff = start + i * 4000;
    let baseY = originalY + i * 100 + noise(xoff) * 110;
    noStroke();
    if (i === 0) {
      //  fill(122, 178, 211);
      fill(3, 42, 89);
    } // #1  wave
    else if (i === 1) {
      //  fill(122, 178, 211);
      fill(18, 74, 140);
    } // #2  wave
    else if (i === 2) {
      fill(32, 103, 189);
    } // #3  wave
    else if (i === 3) {
      fill(227, 203, 172);
    } // Sand

    beginShape();

    for (let x = 0; x < innerWidth; x++) {
      const y = baseY + noise(x / divider) * 400;
      vertex(x, y);
      xoff += inc;
    }

    vertex(innerWidth, innerHeight);
    vertex(0, innerHeight);
    endShape();

    //Moon
    push();
    noStroke();
    // fill(255, 231, 151);
    fill(227, 237, 252);
    // fill(201, 201, 201);
    // fill(180, 180, 180);
    ellipse(300, 100, 150, 150);
    pop();
  }

  // Lanterns
  if (lantern.length < 6 && frameCount % 100 === 0) {
    let l = new Latern();
    lantern.push(l);
  }
  for (let i = 0; i < lantern.length; i++) {
    lantern[i].update();
    lantern[i].show();
    if (lantern[i].finished()) {
      //remove this particle
      lantern.splice(i, 1);
    }
  }
  start += inc;
  // noLoop();

  // Update fireworks
  for (let i = fireworks.length - 1; i >= 0; i--) {
    fireworks[i].update();
    fireworks[i].show();
    if (fireworks[i].isDone()) {
      fireworks.splice(i, 1);
    }
  }
}

// Launch fireworks on mouse press
function mousePressed() {
  fireworks.push(new Firework(mouseX, innerHeight));
}

//flowing lantern
class Latern {
  constructor() {
    this.x = -100;
    this.y = random(height);
    this.vx = 2; //move across x
    this.angle = random(TWO_PI);
  }

  finished() {
    //if off screen
    return this.x > width;
  }
  update() {
    //chaneg location by random amount
    this.x += this.vx;
    //Citation: chatgpt suggestion Line 24-25
    this.y += sin(this.angle) * 0.5; //tiny up and down wave motion
    this.angle += 0.05; //animate wave motion
  }

  //   lantern palette fill(254, 174, 85)(252,224,89)(255,255,125)

  //lantern

  show() {
    //big circle
    strokeWeight(2);
    stroke(79, 32, 13);
    // fill(254, 174, 85);
    fill(255, 255, 180);
    // ellipse(this.x, this.y, 120, 70);
    rect(this.x - 30, this.y - 40, 60, 100, 20);

    push();
    //light inside
    noStroke();

    // Citaion: chatGPT helped me to make my glowing lantern idea work using shadowBlur and shadowColor.
    drawingContext.shadowBlur = 100;
    drawingContext.shadowColor = "rgba(255,255,180,1)";
    fill(252, 230, 149);
    // ellipse(this.x, this.y + 10, 20, 53);
    rect(this.x - 25, this.y, 50, 60, 20);
    drawingContext.shadowBlur = 0;
    pop();

    //bottom part
    fill(79, 32, 13);
    rect(this.x - 15, this.y + 60, 30, 10);

    //top part
    fill(79, 32, 13);
    rect(this.x - 15, this.y - 50, 30, 10);
  }
}

//--------when clicked firework expolsion + sound
//Citation Firework:https://www.youtube.com/watch?v=DxDn2u7sQuI
// ---------- Firework class ----------
class Firework {
  constructor(x, y) {
    this.exploded = false;
    this.targetinnerHeight = random(innerHeight / 4, innerHeight / 2);
    this.color = random(FIREWORK_COLORS);
    this.rocket = new ParticleFire(x, y, true, this.color);
    this.explosionParticles = [];
  }

  update() {
    if (!this.exploded) {
      this.rocket.applyForce(createVector(0, -0.15));
      this.rocket.update();

      if (this.rocket.pos.y <= this.targetinnerHeight) {
        this.exploded = true;
        this.explode();
      }
    }

    for (let p of this.explosionParticles) {
      p.applyForce(createVector(0, 0.05));
      p.update();
    }
  }

  explode() {
    // Play firework sound only
    if (fireworkPlayer) {
      fireworkPlayer.volume.value = -10;
      fireworkPlayer.start();
    }

    for (let i = 0; i < 200; i++) {
      let p = new ParticleFire(
        this.rocket.pos.x,
        this.rocket.pos.y,
        false,
        this.color
      );
      // p.vel.mult(random(0.5, 2));
      p.vel.mult(random(3, 2));
      this.explosionParticles.push(p);
    }
  }

  show() {
    if (!this.exploded) {
      this.rocket.show();
    }
    for (let p of this.explosionParticles) {
      p.show();
    }
  }

  isDone() {
    return this.exploded && this.explosionParticles.every((p) => p.alpha <= 0);
  }
}

// ---------- Fireworks Particle class ----------
class ParticleFire {
  constructor(x, y, isRocket, color = random(FIREWORK_COLORS)) {
    this.pos = createVector(x, y);
    this.isRocket = isRocket;
    // this.hue = hue;
    this.color = color;

    //chatgpt solution
    if (isRocket) {
      this.vel = createVector(0, random(-10, -6));
    } else {
      this.vel = p5.Vector.random2D().mult(random(2, 8));
    }

    this.acc = createVector(0, 0);
    this.alpha = 255;
  }

  applyForce(force) {
    this.acc.add(force);
  }

  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);

    if (!this.isRocket) {
      this.alpha -= 2;
      this.vel.mult(0.95);
    }
  }

  show() {
    strokeWeight(this.isRocket ? 9 : 5);
    // stroke(this.hue, 255, 255, this.alpha);
    stroke(this.color[0], this.color[1], this.color[2], this.alpha);
    point(this.pos.x, this.pos.y);
  }
}
