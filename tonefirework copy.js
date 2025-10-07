//Citation:https://www.youtube.com/watch?v=DxDn2u7sQuI

let fireworks = [];
function setup() {
  createCanvas(innerWidth, innerHeight);
  colorMode(HSB);
  background(0);
  // fill(255, random(100, 200));
  // for (let i = 0; i < 50; i++) {
  //   let x = random(innerWidth);
  //   let y = random(innerHeight);
  //   ellipse(x + 20, y - 20, 2);

  // create random stars
}

// function setup() {
//   createCanvas(innerWidth, innerHeight);
//   colorMode(HSB);
//   background(0);

// Draw static stars once
//   for (let i = 0; i < 50; i++) {
//     let x = random(innerWidth);
//     let y = random(innerHeight);
//     let size = random(1, 3);
//     let alpha = random(150, 255);
//     stars.push({ x, y, size, alpha });
//   }
//   drawStars();
// }

// Draw stars from the array
// function drawStars() {
//   fill(255);
//   noStroke();
//   for (let s of stars) {
//     fill(255, s.alpha);
//     ellipse(s.x, s.y, s.size);
//   }
// }

function draw() {
  // Faint black background for trails

  background(0, 25);

  // Draw stars on top
  // drawStars();

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

// ---------- Firework class ----------
class Firework {
  constructor(x, y) {
    this.exploded = false;
    this.targetinnerHeight = random(innerHeight / 4, innerHeight / 2);
    this.rocket = new Particle(x, y, true);
    this.explosionParticles = [];
    this.hue = random(360);
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
    for (let i = 0; i < 100; i++) {
      let p = new Particle(
        this.rocket.pos.x,
        this.rocket.pos.y,
        false,
        this.hue
      );
      p.vel.mult(random(0.5, 2));
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

// ---------- Particle class ----------
class Particle {
  constructor(x, y, isRocket, hue = random(360)) {
    this.pos = createVector(x, y);
    this.isRocket = isRocket;
    this.hue = hue;
    // this.vel = isRocket
    //   ? createVector(0, random(-10, -6))
    //   : p5.Vector.random2D().mult(random(2, 8));

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
      this.alpha -= 3;
      this.vel.mult(0.95);
    }
  }

  show() {
    strokeWeight(this.isRocket ? 4 : 3);
    stroke(this.hue, 255, 255, this.alpha);
    point(this.pos.x, this.pos.y);
  }
}
