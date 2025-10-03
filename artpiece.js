//Citation: Mix of Garrite's noiseexample lecture recording and coding train youtube channel
//Citation for lantern base inspo:https://www.youtube.com/watch?v=UcdigVaIYAk
let inc = 0.002;
let start = 0;
let lantern = [];

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
    strokeWeight(4);
    stroke(215, 98, 73);
    fill(254, 174, 85);
    ellipse(this.x, this.y, 120, 70);

    noStroke();
    fill(252, 224, 89);
    ellipse(this.x, this.y, 15, 57);
  }
}

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
}

function draw() {
  // background(223, 242, 235);
  background(60, 70, 123);

  const originalY = 200; //the base line
  const divider = 970;
  // noiseSeed(1);

  for (let i = 0; i < 2; i++) {
    let xoff = start + i * 4000;
    let baseY = originalY + i * 100 + noise(xoff) * 110;
    noStroke();

    if (i === 0) {
      //  fill(122, 178, 211);
      fill(99, 108, 203);
    } // dark water
    else if (i === 1) {
      fill(110, 140, 251);
    } // lighter water

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
