/**
 * @typedef {import('p5')} p5
 */
/**
 * @param {p5} p
 */
export default function boidsSketch(p, args) {
  /**
   * @type {Boid[]}
   */
  let boids = [];

  const parentDiv = document.getElementById('boids-sim');

  const [amountSlider, amountSliderLabel] = createSliderWithLabel('boids', 0, 200, 100, 1, 20, 10);
  const [speedSlider, speedSliderLabel] = createSliderWithLabel('speed', 0, 10, 5, 0.1, 20, 45);
  const [separationSlider, separationSliderLabel] = createSliderWithLabel('separation', 0, 2, 1, 0.1, 20, 80);
  const [alignmentSlider, alignmentSliderLabel] = createSliderWithLabel('alignment', 0, 1, 0.5, 0.1, 20, 115);
  const [cohesionSlider, cohesionSliderLabel] = createSliderWithLabel('cohesion', 0, 1, 0.5, 0.1, 20, 150);
  const [perceptionRadiusSlider, perceptionRadiusSliderLabel] = createSliderWithLabel(
    'perception radius',
    0,
    200,
    100,
    1,
    20,
    185,
  );
  const showBoidsSightCheckbox = p.createCheckbox('show boids sight radius', false).position(20, 240);

  function createSliderWithLabel(label, min, max, value, step, x, y) {
    const sliderLabel = p.createP(label).position(x, y);
    const slider = p.createSlider(min, max, value, step).position(x, y + 15);
    return [slider, sliderLabel];
  }

  p.setup = () => {
    if (args && !args.showSettings) {
      amountSlider.hide();
      amountSliderLabel.hide();
      speedSlider.hide();
      speedSliderLabel.hide();
      separationSlider.hide();
      separationSliderLabel.hide();
      alignmentSlider.hide();
      alignmentSliderLabel.hide();
      cohesionSlider.hide();
      cohesionSliderLabel.hide();
      perceptionRadiusSlider.hide();
      perceptionRadiusSliderLabel.hide();
      showBoidsSightCheckbox.hide();
    }
    p.createCanvas(parentDiv.clientWidth, parentDiv.clientHeight);
    updateBoidsAmount();
    amountSlider.input(updateBoidsAmount);
  };

  p.draw = () => {
    p.clear();
    for (let boid of boids) {
      boid.update(
        boids,
        perceptionRadiusSlider.value(),
        speedSlider.value(),
        separationSlider.value(),
        alignmentSlider.value(),
        cohesionSlider.value(),
      );
      boid.show(showBoidsSightCheckbox.checked(), perceptionRadiusSlider.value());
    }
  };

  p.windowResized = () => {
    p.resizeCanvas(parentDiv.clientWidth, parentDiv.clientHeight);
  };

  function updateBoidsAmount() {
    const oldValue = boids.length;
    const newValue = amountSlider.value();
    if (oldValue > newValue) {
      for (let i = newValue; i < oldValue; i++) {
        boids.splice(Math.floor(Math.random() * boids.length), 1);
      }
    } else {
      for (let i = 0; i < newValue - oldValue; i++) {
        const boid = new Boid(p, findFreePosition());
        boid.speed = speedSlider.value();
        boids.push(boid);
      }
    }
    amountSliderLabel.html('boids: ' + newValue);
  }

  function spawnBoid() {
    const boid = new Boid(p);
    boid.speed = speedSlider.value();
    boids.push(boid);
  }

  function findFreePosition() {
    const maxAttempts = 1000;
    for (let i = 0; i < maxAttempts; i++) {
      const position = p.createVector(p.random(p.width), p.random(p.height));
      let isFree = true;
      for (let boid of boids) {
        if (p.constructor.Vector.dist(boid.position, position) < 10) {
          isFree = false;
          break;
        }
      }
      if (isFree) return position;
    }
    return null;
  }
}

class Boid {
  /**
   * @param {p5} p
   */
  constructor(p, pos) {
    this.p = p;
    this.position = pos;
    this.direction = p.constructor.Vector.random2D();
    this.maxForce = 0.2;
    this.color = p.color(p.random(255), p.random(255), p.random(255));
    this.drawnAngle = 0;
  }

  separation(boids, perceptionRadius, separationForce, maxSpeed) {
    const separation = this.p.createVector();
    let total = 0;

    for (let other of boids) {
      if (other === this) continue;
      const diff = this.p.constructor.Vector.sub(this.position, other.position);
      const distance = diff.mag();

      if (distance < perceptionRadius - perceptionRadius / 3) {
        diff.div(distance * distance);
        separation.add(diff);
        total++;
      }
    }

    if (total > 0) {
      separation.div(total);
      separation.setMag(maxSpeed);
      separation.sub(this.direction);
    }
    return separation.limit(this.maxForce);
  }

  alignment(boids, perceptionRadius, maxSpeed) {
    const alignment = this.p.createVector();
    let total = 0;

    for (let other of boids) {
      if (other === this) continue;
      const distance = this.p.constructor.Vector.dist(this.position, other.position);
      if (distance < perceptionRadius) {
        alignment.add(other.direction);
        total++;
      }
    }

    if (total > 0) {
      alignment.div(total);
      alignment.setMag(maxSpeed);
      alignment.sub(this.direction);
    }
    return alignment.limit(this.maxForce);
  }

  cohesion(boids, perceptionRadius, maxSpeed) {
    const cohesion = this.p.createVector();
    let total = 0;

    for (let other of boids) {
      if (other === this) continue;
      const distance = this.p.constructor.Vector.dist(this.position, other.position);
      if (distance < perceptionRadius) {
        cohesion.add(other.position);
        total++;
      }
    }

    if (total > 0) {
      cohesion.div(total);
      cohesion.sub(this.position);
      cohesion.setMag(maxSpeed);
      cohesion.sub(this.direction);
    }
    return cohesion.limit(this.maxForce);
  }

  avoidBorders() {
    const borderForce = this.p.createVector();
    const distance = 150; // Increased distance for smoother transitions
    const strength = 0.25; // Strength of the border avoidance force

    if (this.position.x < distance) {
      borderForce.add(this.p.createVector(this.p.map(this.position.x, 0, distance, strength, 0), 0));
    } else if (this.position.x > this.p.width - distance) {
      borderForce.add(
        this.p.createVector(this.p.map(this.position.x, this.p.width, this.p.width - distance, -strength, 0), 0),
      );
    }

    if (this.position.y < distance) {
      borderForce.add(this.p.createVector(0, this.p.map(this.position.y, 0, distance, strength, 0)));
    } else if (this.position.y > this.p.height - distance) {
      borderForce.add(
        this.p.createVector(0, this.p.map(this.position.y, this.p.height, this.p.height - distance, -strength, 0)),
      );
    }

    return borderForce;
  }

  avoidCursor() {
    const avoidCursor = this.p.createVector();
    const cursor = this.p.createVector(this.p.mouseX, this.p.mouseY);
    const diff = this.p.constructor.Vector.sub(this.position, cursor);
    const distance = diff.mag();

    if (distance < 200) {
      const strength = this.p.map(distance, 0, 200, 10, 0);
      diff.normalize();
      diff.mult(strength);
      avoidCursor.add(diff);
    }

    return avoidCursor;
  }

  /**
   * @param {Boid[]} boids
   * @param {number} perceptionRadius
   * @param {number} speed
   * @param {number} separationForce
   * @param {number} alignmentForce
   * @param {number} cohesionForce
   */
  update(boids, perceptionRadius, speed, separationForce, alignmentForce, cohesionForce) {
    const move = this.direction.normalize();
    this.seperationForce = this.separation(boids, perceptionRadius, separationForce, speed).mult(separationForce);
    this.alignmentForce = this.alignment(boids, perceptionRadius, speed).mult(alignmentForce);
    this.cohesionForce = this.cohesion(boids, perceptionRadius, speed).mult(cohesionForce);
    move.add(this.seperationForce);
    move.add(this.alignmentForce);
    move.add(this.cohesionForce);
    move.add(this.avoidBorders());
    move.add(this.avoidCursor(perceptionRadius));
    move.mult(speed).limit(speed);
    this.position.add(move);
  }

  show(showPerceptionRadius, perceptionRadius) {
    this.p.stroke(this.color);
    this.p.strokeWeight(2);
    this.p.fill(0, 0);
    const x = this.position.x;
    const y = this.position.y;
    const angle = this.direction.heading();

    this.p.push();
    this.p.translate(x, y);
    if (this.direction.mag() > 0) {
      this.p.rotate(angle - this.p.HALF_PI);
      this.drawnAngle = angle;
    } else {
      this.p.rotate(this.drawnAngle - this.p.HALF_PI);
    }
    this.p.triangle(6, -7, -6, -7, 0, 14);
    this.p.pop();
    if (showPerceptionRadius) this.p.circle(x, y, perceptionRadius * 2);
  }
}
