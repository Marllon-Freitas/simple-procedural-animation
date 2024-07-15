const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const PI = Math.PI;
canvas.width = document.body.clientWidth;
canvas.height = document.body.clientHeight;
const WIDTH = canvas.width;
const HEIGHT = canvas.height;
const DESIRED_DISTANCE = 30;
const MAX_ANGLE = Math.PI / 6;

const sizes = [52, 58, 40, 60, 68, 71, 65, 50, 28, 15, 11, 9, 7, 7, 10, 10, 10 , 10 ,10 , 10];

class Point {
  constructor(x, y, size, xSpeed = 0, ySpeed = 0) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.xSpeed = xSpeed;
    this.ySpeed = ySpeed;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 3;
    ctx.stroke();
  }
}

class Line {
  constructor(p1, p2) {
    this.p1 = p1;
    this.p2 = p2;
  }

  draw() {
    ctx.beginPath();
    ctx.moveTo(this.p1.x, this.p1.y);
    ctx.lineTo(this.p2.x, this.p2.y);
    ctx.stroke();
  }
}

const points = [];
for (let i = 0; i < sizes.length; i++) {
  points.push(new Point(WIDTH / 2, HEIGHT / 2, sizes[i], Math.random() * 4 - 2, Math.random() * 4 - 2));
}

const lines = [];
for (let i = 0; i < points.length - 1; i++) {
  lines.push(new Line(points[i], points[i + 1]));
}

function draw() {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
  points.forEach(p => p.draw());
  lines.forEach(l => l.draw());
}

function update() {
  if (points.length > 1) {
    const p0 = points[0];
    const p1 = points[1];
    let newX = p0.x + p0.xSpeed;
    let newY = p0.y + p0.ySpeed;
    let angle = Math.atan2(p1.y - p0.y, p1.x - p0.x);

    p1.x = p0.x + Math.cos(angle) * DESIRED_DISTANCE;
    p1.y = p0.y + Math.sin(angle) * DESIRED_DISTANCE;

    let movementAngle = Math.atan2(p0.ySpeed, p0.xSpeed);

    if (newX - DESIRED_DISTANCE <= 0 || newX + DESIRED_DISTANCE >= WIDTH || newY - DESIRED_DISTANCE <= 0 || newY + DESIRED_DISTANCE >= HEIGHT) {
      let angleAdjustment = Math.PI / 180;
      if (newX - DESIRED_DISTANCE <= 0 || newX + DESIRED_DISTANCE >= WIDTH) {
        movementAngle = Math.PI - movementAngle;
      }
      if (newY - DESIRED_DISTANCE <= 0 || newY + DESIRED_DISTANCE >= HEIGHT) {
        movementAngle = -movementAngle;
      }
      movementAngle += angleAdjustment;

      const speed = Math.sqrt(p0.xSpeed * p0.xSpeed + p0.ySpeed * p0.ySpeed);
      p0.xSpeed = Math.cos(movementAngle) * speed;
      p0.ySpeed = Math.sin(movementAngle) * speed;
    } else {
      p0.x = newX;
      p0.y = newY;
    }
  }
  for (let i = 2; i < points.length; i++) {
    const p0 = points[i - 2];
    const p1 = points[i - 1];
    const p2 = points[i];

    const angle1 = Math.atan2(p1.y - p0.y, p1.x - p0.x);
    const angle2 = Math.atan2(p2.y - p1.y, p2.x - p1.x);
    let diffAngle = angle2 - angle1;
    if (diffAngle > PI) diffAngle -= 2 * PI;
    else if (diffAngle < -PI) diffAngle += 2 * PI;

    if (Math.abs(diffAngle) > MAX_ANGLE) {
      const newAngle = angle1 + Math.sign(diffAngle) * MAX_ANGLE;
      p2.x = p1.x + Math.cos(newAngle) * DESIRED_DISTANCE;
      p2.y = p1.y + Math.sin(newAngle) * DESIRED_DISTANCE;
    } else {
      const dx = p1.x - p2.x;
      const dy = p1.y - p2.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance !== DESIRED_DISTANCE) {
        const angle = Math.atan2(dy, dx);
        p2.x = p1.x - Math.cos(angle) * DESIRED_DISTANCE;
        p2.y = p1.y - Math.sin(angle) * DESIRED_DISTANCE;
      }
    }
  }
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();