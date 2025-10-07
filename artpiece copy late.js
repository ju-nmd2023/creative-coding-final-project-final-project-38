//Citation: Mix of Garrite's noiseexample lecture recording and coding train youtube channel
//Citation for lantern base inspo:https://www.youtube.com/watch?v=UcdigVaIYAk
let inc = 0.002;
let start = 0;
let lantern = [];
let backgroundParticles = [];
const numParticles = 100; // reduced for performance
const noiseScale = 0.01; // zoom in on noise

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);

  // Initialize flow field particles
  for (let i = 0; i < numParticles; i++) {
    backgroundParticles.push(createVector(random(width), random(height)));
  }

  background(0); // solid black background
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

    // if (i === 0) {
    //   //  fill(122, 178, 211);
    //   fill(99, 108, 203);
    // } // dark water
    // else if (i === 1) {
    //   fill(110, 140, 251);
    // } // lighter water
    // else if (i === 2) {
    //   fill(227, 203, 172);
    // } // lighter water
    // if (i === 3) {
    //   //  fill(122, 178, 211);
    //   fill(27, 26, 85);
    // } // dark water

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
    fill(255, 231, 151);
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
