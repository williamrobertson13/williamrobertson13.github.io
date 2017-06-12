var canvasEl, ctx, partyBtn;
var NUMBER_OF_PARTICLES = 35
var COLORS = ['#FF1461', '#18FF92', '#5A87FF', '#FBF38C']

function createParticle(x, y) {
  var particle = {}

  particle.x = x
  particle.y = y
  particle.color = COLORS[anime.random(0, COLORS.length - 1)]
  particle.radius = anime.random(16, 32)
  particle.endPos = setParticleDirection(particle)
  particle.draw = function() {
    ctx.beginPath()
    ctx.arc(particle.x, particle.y, particle.radius, 0, 2 * Math.PI, true)
    ctx.fillStyle = particle.color
    ctx.fill()
  }

  return particle
}

function setParticleDirection(particle) {
  var angle = anime.random(0, 360) * Math.PI / 180
  var value = anime.random(400, 900)
  var radius = [-1, 1][anime.random(0, 1)] * value

  return {
    x: particle.x + radius * Math.cos(angle),
    y: particle.y + radius * Math.sin(angle)
  }
}

function createCircle(x, y) {
  var circle = {}
  circle.x = x
  circle.y = y
  circle.color = '#000'
  circle.radius = 0.1
  circle.alpha = .5
  circle.lineWidth = 4
  circle.draw = function() {
    ctx.globalAlpha = circle.alpha
    ctx.beginPath()
    ctx.arc(circle.x, circle.y, circle.radius, 0, 2 * Math.PI, true)
    ctx.lineWidth = circle.lineWidth
    ctx.strokeStyle = circle.color
    ctx.stroke()
    ctx.globalAlpha = 1
  }

  return circle
}

function renderParticle(anim) {
  var numAnimatables = anim.animatables.length
  for (var i = 0; i < numAnimatables; i++) {
    anim.animatables[i].target.draw()
  }
}

function animateParticles(x, y) {
  var circle = createCircle(x, y)
  var particles = []

  for (var i = 0; i < NUMBER_OF_PARTICLES; i++) {
    particles.push(createParticle(x, y))
  }

  anime.timeline().add({
    targets: particles,
    x: function(particle) { return particle.endPos.x },
    y: function(particle) { return particle.endPos.y },
    radius: 0.1,
    duration: anime.random(1200, 1800),
    easing: 'easeOutExpo',
    update: renderParticle
  })
  .add({
    targets: circle,
    radius: anime.random(60, 100),
    lineWidth: 0,
    alpha: {
      value: 0,
      easing: 'linear',
      duration: anime.random(600, 800),  
    },
    duration: anime.random(1200, 1800),
    easing: 'easeOutExpo',
    update: renderParticle,
    offset: 0
  });
}

function shootFireworks() {
  animateParticles(1100, 300)
  animateParticles(1200, 200)
  animateParticles(200, 100)
  animateParticles(1300, 100)
  animateParticles(100, 1300)
}

window.addEventListener('load', function() {
  partyBtn = document.getElementById('party-popper')
  canvasEl = document.getElementById('firework-canvas')
  ctx = canvasEl.getContext('2d')

  window.addEventListener('resize', function() {
    canvasEl.width = window.innerWidth * 2
    canvasEl.height = window.innerHeight * 2
    canvasEl.style.width = window.innerWidth + 'px'
    canvasEl.style.height = window.innerHeight + 'px'
    ctx.scale(2, 2)
  }, false)

 partyBtn.addEventListener('click', shootFireworks)

  var animation = anime({
    duration: Infinity,
    update: function() {
      ctx.clearRect(0, 0, canvasEl.width, canvasEl.height)
    }
  })

  setTimeout(function() {
    animation.play()
    animateParticles(1100, 300)
    animateParticles(1200, 200)
    animateParticles(200, 100)
    animateParticles(1300, 100)
    animateParticles(100, 1300)

    var links = document.querySelectorAll('a')
    for (var i = 0, len = links.length; i < len; i++) {
      links[i].classList.add('color');
    }
  }, 150)
}, false)