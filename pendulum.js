const G = 9.8

class Timer {
  constructor() {
    this.now = Date.now() * 0.001
    this.delta = 0
  }

  tick() {
    var now = Date.now() * 0.001
    this.delta = now - this.now
    this.now = now
  }
}

class Pendulum {
  constructor(center, rodLength) {
    this.center = center
    this.R = rodLength // Length of rod.
    this.position_ = new Vec2(this.center.x, this.center.y + this.R * 100)
    this.position = this.position_.clone()
    this.theta = Math.PI * 0.44
    this.omega = 0

    this.radius = 10
    this.fill = U.randomColorCode()
    this.stroke = "rgba(68, 68, 68, 0.5)"
  }

  // http://www.maths.surrey.ac.uk/explore/michaelspages/documentation/Simple
  move(deltaTime) {
    this.omega -= deltaTime * (G * Math.sin(this.theta) / this.R)
    // this.omega *= 0.998
    this.theta += deltaTime * this.omega
    this.rotate(this.theta)
  }

  draw() {
    // canvas.context.strokeStyle = this.stroke
    // canvas.drawLine(this.position, this.center)

    canvas.context.fillStyle = this.fill
    canvas.drawPoint(this.position, this.radius)
  }

  rotate(theta) {
    var sub = Vec2.sub(this.position_, this.center)
    var x = sub.x
    var y = sub.y
    var sin = Math.sin(theta)
    var cos = Math.cos(theta)
    sub.x = x * cos - y * sin
    sub.y = x * sin + y * cos
    this.position = sub.add(this.center)
  }
}

window.addEventListener("visibilitychange", onVisibilityChange, false)
var canvas = new Canvas(window.innerWidth, 640)
var timer = new Timer()
var pendulum = makePendulum()

animate()

function animate() {
  timer.tick()
  move()
  draw()
  requestAnimationFrame(animate)
}

function move() {
  for (var i = 0; i < pendulum.length; ++i) {
    pendulum[i].move(timer.delta)
  }
}

function draw() {
  canvas.clearWhite()

  for (var i = 0; i < pendulum.length; ++i) {
    pendulum[i].draw()
  }
}

function makePendulum() {
  var pendulum = []
  var numPendulum = 1000
  var maxRodLength = 5
  for (var i = 1; i <= numPendulum; ++i) {
    var r = maxRodLength * i / numPendulum
    pendulum.push(new Pendulum(new Vec2(canvas.center.x, canvas.center.y / 3), r))
  }
  return pendulum
}

function onVisibilityChange() {
  timer.tick() // ここでtickしないとdeltaTimeが大きくなりすぎておかしくなる。
}
