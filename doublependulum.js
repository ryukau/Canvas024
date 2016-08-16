const GRAVITY = 9.8

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
  constructor(center, rodLength1, rodLength2, mass1, mass2, theta1, theta2) {
    this.center = center
    this.length1 = rodLength1 // Length of rod.
    this.theta1 = theta1
    this.omega1 = 0
    this.mass1 = mass1
    this.radius1 = 8 * Math.sqrt(this.mass1) / Math.PI
    this.position1 = Vec2.add(this.center, this.rotate(this.theta1, this.length1 * this.scale))

    this.length2 = rodLength2
    this.theta2 = theta2
    this.omega2 = 0
    this.mass2 = mass2
    this.radius2 = 8 * Math.sqrt(this.mass2) / Math.PI
    this.position2 = Vec2.add(this.position1, this.rotate(this.theta2, this.length2 * this.scale))

    this.scale = 100
    this.fill = U.randomColorCode()
    this.stroke = "rgba(68, 68, 68, 0.5)"
  }

  // http://www.myphysicslab.com/pendulum2.html
  move(deltaTime, lapTime) {
    var A = this.theta1 - this.theta2
    var B = this.mass1 + this.mass2
    var C = this.mass1 + B
    var D = this.omega2 * this.omega2 * this.length2
    var E = this.omega1 * this.omega1 * this.length1
    var F = Math.cos(A)
    var G = 2 * Math.sin(A)

    var n1A = GRAVITY * C * Math.sin(this.theta1)
    var n1B = GRAVITY * Math.sin(A - this.theta2)
    var n1C = G * (D + E * F)
    var numer1 = n1A + this.mass2 * (n1B + n1C)

    var n2A = B * (E + GRAVITY * Math.cos(this.theta1))
    var n2B = D * this.mass2 * F
    var numer2 = G * (n2A + n2B)

    var denom = C - this.mass2 * Math.cos(2 * A)

    var omega1 = numer1 / (this.length1 * denom)
    var omega2 = numer2 / (this.length2 * denom)

    this.omega1 -= deltaTime * omega1
    this.omega2 += deltaTime * omega2
    this.theta1 += deltaTime * this.omega1
    this.theta2 += deltaTime * this.omega2

    this.omega1 = 0.9998 * U.clamp(this.omega1, -16, 16)
    this.omega2 = 0.9998 * U.clamp(this.omega2, -16, 16)
    this.theta1 %= 2 * Math.PI
    this.theta2 %= 2 * Math.PI

    this.position1 = Vec2.add(this.center, this.rotate(this.theta1, this.length1 * this.scale))
    this.position2 = Vec2.add(this.position1, this.rotate(this.theta2, this.length2 * this.scale))
  }

  draw() {
    canvas.context.strokeStyle = this.stroke
    canvas.drawLine(this.position1, this.center)

    canvas.context.fillStyle = this.fill
    canvas.drawPoint(this.position1, this.radius1)

    canvas.context.strokeStyle = this.stroke
    canvas.drawLine(this.position2, this.position1)

    canvas.context.fillStyle = this.fill
    canvas.drawPoint(this.position2, this.radius2)
  }

  rotate(theta, r) {
    return new Vec2(r * Math.sin(theta), r * Math.cos(theta))
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
  var ratioRodLength = Math.random()
  var maxMass = 32
  var ratioMass = Math.random()
  var theta1 = 2 * Math.PI * Math.random()
  var theta2 = 2 * Math.PI * Math.random()
  console.log(maxMass * (1 - ratioMass))
  for (var i = 1; i <= numPendulum; ++i) {
    var r = maxRodLength * i / numPendulum
    pendulum.push(new Pendulum(
      new Vec2(canvas.center.x, canvas.center.y),
      r * ratioRodLength,
      r * (1 - ratioRodLength),
      maxMass * ratioMass,
      maxMass * (1 - ratioMass),
      theta1,
      theta2
    ))
  }
  return pendulum
}

function onVisibilityChange() {
  timer.tick() // ここでtickしないとdeltaTimeが大きくなりすぎておかしくなる。
}

function onClickCanvas(event) {
  pendulum = makePendulum()
}