const G = 9.8

class Timer {
  constructor() {
    this.start = Date.now() * 0.001
    this.now = this.start
    this.delta = 0
    this.lap = 0
  }

  tick() {
    var now = Date.now() * 0.001
    this.delta = now - this.now
    this.now = now
    this.lap = this.now - this.start
  }
}

class Pendulum {
  constructor(center, rodLength) {
    this.center = center
    this.R = rodLength // Length of rod.
    this.position_ = new Vec2(this.center.x, this.center.y + this.R * 100)
    this.position = this.position_.clone()
    this.theta = Math.PI * 0.84
    this.omega = 0
    this.mass = 10
    this.friction = 4
    this.amplitude = 100
    this.drivingForce = 1

    this.radius = this.mass
    this.fill = U.randomColorCode()
    this.stroke = "rgba(68, 68, 68, 0.5)"
  }

  // http://www.myphysicslab.com/pendulum2.html
  move(deltaTime, lapTime) {
    var A = G * Math.sin(this.theta) / this.R
    var kt = this.drivingForce * lapTime
    var numer = this.amplitude * Math.cos(kt) - this.friction * this.omega
    var denom = this.mass * this.R * this.R
    var omega_d = numer / denom - A

    this.omega += deltaTime * omega_d
    this.theta += deltaTime * this.omega
    this.rotate(this.theta)
  }

  draw() {
    canvas.context.strokeStyle = this.stroke
    canvas.drawLine(this.position, this.center)

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
var canvas = new Canvas(640, 640)
canvas.canvas.addEventListener("click", onClickCanvas, false)
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
    pendulum[i].move(timer.delta, timer.lap)
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
  var numPendulum = 100
  var maxRodLength = 3
  for (var i = 1; i <= numPendulum; ++i) {
    var r = maxRodLength * i / numPendulum
    pendulum.push(new Pendulum(new Vec2(canvas.center.x, canvas.center.y), r))
  }
  return pendulum
}

function onVisibilityChange() {
  timer.tick() // ここでtickしないとdeltaTimeが大きくなりすぎておかしくなる。
}

function onClickCanvas(event) {
  for (var i = 0; i < pendulum.length; ++i) {
    pendulum[i].omega += Math.random()
  }
}