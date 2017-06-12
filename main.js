var canvasEl, ctx
var NUMBER_OF_PARTICLES = 40
var COLORS = ['#FF1461', '#18FF92', '#5A87FF', '#FBF38C']
var TEXT_COLORS = ['#FF1461', '#18C892', '#5A87FF']

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
  var value = anime.random(80, 600)
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

function shootFireworks(numFireworks) {
  for (var i = 0; i < numFireworks; i++) {
    animateParticles(anime.random(0, window.innerWidth), anime.random(0, window.innerHeight))
  }
}

window.addEventListener('load', function() {
  if (document.documentElement.clientWidth < 961) {
    // Don't want to do any of this stuff for mobile
    return
  }

  var partyBtn = document.getElementById('party-popper')
  var resumeLink = document.getElementById('resume')
  canvasEl = document.getElementById('firework-canvas')
  ctx = canvasEl.getContext('2d')

  window.addEventListener('resize', function() {
    canvasEl.width = window.innerWidth * 2
    canvasEl.height = window.innerHeight * 2
    canvasEl.style.width = window.innerWidth + 'px'
    canvasEl.style.height = window.innerHeight + 'px'
    ctx.scale(2, 2)
  }, false)

  partyBtn.addEventListener('click', function() {
    ga('send', 'event', 'Party Button', 'Click', 'Fireworks')

    shootFireworks(anime.random(2, 6))
    var color = TEXT_COLORS[anime.random(0, TEXT_COLORS.length - 1)]

    var links = document.querySelectorAll('a')
    for (var i = 0, len = links.length; i < len; i++) {
      links[i].style.color = color
    }
  })

  resume.addEventListener('click', function() {
    ga('send', 'event', 'Resume Link', 'Click', 'Resume')
  })

  var animation = anime({
    duration: Infinity,
    update: function() {
      ctx.clearRect(0, 0, canvasEl.width, canvasEl.height)
    }
  })

  setTimeout(function() {
    animation.play()

    shootFireworks(3)
  }, 200)
}, false)