function random(min, max) {
  return Math.random() * (max - min) + min
}

var canvas = document.querySelector('.heart-rain')
var ctx = canvas.getContext('2d')
var particles = [],
  dropHeartParticles = [],
  defaultHeartCount = 52,
  amount = 0,
  isRenderText = false, // 是否渲染文字
  showText = 'L    V E',
  loveDate = '2024/2/8',
  heartList = [
    { url: './img/heart.png', width: 10 },
    { url: './img/heart.png', width: 8 },
    { url: './img/heart.png', width: 6 },
    { url: './img/heart.png', width: 4 },
  ],
  ww = document.documentElement.clientWidth,
  wh = document.documentElement.clientHeight,
  isMobile = ww < 1020
function Particle(x, y, isDrop) {
  this.x = Math.random() * ww
  this.y = Math.random() * wh * (isDrop ? -1.1 : 1)
  this.dest = { x: x, y: y }
  let heartImgObj = heartList[Math.floor(Math.random() * 4)]
  this.heartImg = new Image();
  this.heartImg.src = heartImgObj.url
  this.heartWidth = isMobile ? heartImgObj.width : heartImgObj.width * 2

  // 爱心下落速度
  this.dropVelocity = {
    x: random(-0.35, 0.35),
    y: random(0.75, 1.5)
  }

  // 恢复成文字的速度
  this.vx = (Math.random() - 0.5) * 25
  this.vy = (Math.random() - 0.5) * 25
  this.accX = 0
  this.accY = 0
  this.friction = Math.random() * 0.025 + 0.94
}

Particle.prototype.renderText = function () {
  this.accX = (this.dest.x - this.x) / 1000
  this.accY = (this.dest.y - this.y) / 1000
  this.vx += this.accX
  this.vy += this.accY
  this.vx *= this.friction
  this.vy *= this.friction
  this.x += this.vx
  this.y += this.vy
  ctx.drawImage(this.heartImg, this.x, this.y, this.heartWidth, this.heartWidth)
}

Particle.prototype.drawHeart = function () {
  ctx.drawImage(this.heartImg, this.x, this.y, this.heartWidth, this.heartWidth)
}

Particle.prototype.dropHeart = function () {
  this.x += this.dropVelocity.x
  this.y += this.dropVelocity.y

  if (this.y > wh) {
    this.x = Math.random() * ww
    this.y = 0
  }

  this.drawHeart()
}


function initScene() {
  ww = canvas.width = document.documentElement.clientWidth
  wh = canvas.height = document.documentElement.clientHeight
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  ctx.font = isMobile ? '80px "Abril Fatface"' : '7vw "Abril Fatface"'
  ctx.textAlign = 'center'
  let now = Date.now();
  let togetherDate = new Date(loveDate).getTime();
  let day = parseInt((now - togetherDate) / 24 / 60 / 60 / 1000);
  if (isMobile) {
    ctx.fillText(showText, ww / 2, 100);

    ctx.fillText(`${day} 天`, ww / 2, 200);
  } else {
    ctx.fillText(showText, ww - 380, 340);

    ctx.fillText(`${day} 天`, ww - 380, wh / 2 + 200);
  }

  var data = ctx.getImageData(0, 0, ww, wh).data

  ctx.clearRect(0, 0, canvas.width, canvas.height)
  particles = []

  for (var i = 0; i < ww; i += Math.round(ww / 200)) {
    for (var j = 0; j < wh; j += Math.round(ww / 200)) {
      if (data[(i + j * ww) * 4 + 3] >= 200) {
        particles.push(new Particle(i, j))
      }
    }
  }

  amount = particles.length
  renderHeartRain();
}
function renderHeartRain() {
  requestAnimationFrame(renderHeartRain)
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  let len = isRenderText ? amount : defaultHeartCount
  for (let i = 0; i < len; i++) {
    let p = particles[i]
    if (isRenderText) {
      p.renderText()
    } else {
      p.dropHeart()
    }
  }
}
