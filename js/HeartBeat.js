class Heart {
  speed = 5
  renderIndex = 0
  lineWidth = 2 // 线宽度
  // Sin 曲线属性
  sX = 0
  xOffset = 0 // 波浪x偏移量
  waveSpeed = 0.06
  waveWidth = 0.05
  waveHeight = 2
  nowPercent = 0
  isOver = false
  constructor() {
    this.canvas = document.querySelector('.heart');
    this.ctx = this.canvas.getContext('2d');
    this.cW = this.canvas.width
    this.cH = this.canvas.height
    this.axisLength = this.canvas.width
    this.mH = this.canvas.height * 0.8
    this.points = this.getHeartPoints();
  }
  getHeartPoints() {
    let arr = []

    // t的取值范围是0到2π
    for (let t = 0; t < Math.PI * 2; t += 0.01) {
      // 根据参数方程计算x和y坐标
      const x = 30 * Math.pow(Math.sin(t), 3);
      const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);

      // 因为canvas的原点在左上角，所以要进行适当的平移和缩放
      arr.push({
        x: this.cW / 2 + x,
        y: this.cH / 2 - y
      })
    }
    return arr
  }
  update() {
    let pointLen = this.points.length
    if (this.renderIndex < pointLen) {
      this.renderIndex += this.speed
    } else {
      this.renderIndex = this.points.length - 1
      if (this.nowPercent < 100) {
        this.nowPercent += 1
        this.xOffset += this.waveSpeed
      } else {
        this.nowPercent = 100
        this.isOver = true
      }
    }
  }

  // 画sin 曲线函数
  drawSin() {
    this.ctx.save()

    let points = [] // 用于存放绘制Sin曲线的点

    this.ctx.beginPath()
    let sX = this.sX
    let axisLength = this.axisLength
    // 在整个轴长上取点
    for (let x = sX; x < sX + axisLength; x += 100 / axisLength) {
      // 此处坐标(x,y)的取点，依靠公式 “振幅高*sin(x*振幅宽 + 振幅偏移量)”
      let y = -Math.sin((sX + x) * this.waveWidth + this.xOffset)
      let dY = this.mH * (1 - this.nowPercent / 100)

      points.push([x, dY + y * this.waveHeight])
      this.ctx.lineTo(x, dY + y * this.waveHeight)
    }

    // 封闭路径
    this.ctx.lineTo(axisLength, this.mH)
    this.ctx.lineTo(sX, this.mH)
    this.ctx.lineTo(points[0][0], points[0][1])

    this.ctx.fillStyle = 'rgb(252, 5, 59)'

    this.ctx.fill()

    this.ctx.restore()
  }

  drawHeart() {
    this.ctx.resetTransform();
    this.ctx.save();
    this.ctx.strokeStyle = 'rgb(252, 5, 59)';
    this.ctx.fillStyle = '#000';
    this.ctx.lineWidth = 2;
    this.ctx.lineJoin = 'round';
    this.ctx.lineCap = 'round';

    this.ctx.beginPath();
    let points = this.points.slice(0, this.renderIndex);

    this.ctx.scale(4, 4);
    this.ctx.translate(-115, -58);

    points.forEach(item => {
      this.ctx.lineTo(item.x, item.y)
    })
    this.ctx.stroke();
    this.ctx.fill()
    this.ctx.globalCompositeOperation = "source-atop";
    this.drawSin()
    this.ctx.restore();
  }

  render() {
    this.ctx.clearRect(0, 0, this.cW, this.cH);
    this.update();
    this.drawHeart()
    if (this.isOver) {
      heartDom.className = 'heart-wrapper scale-animate'
    } else {

      requestAnimationFrame(() => {
        this.render()
      })
    }

  }
}

function initHeartBeat() {
  anime({
    targets: '.lmh',
    translateX: 'calc(-50% - 56px)',
    translateY: '-50%',
    opacity: 1,
    duration: 1500
  });
  anime({
    targets: '.ll',
    translateX: 'calc(50% + 8px)',
    translateY: '-50%',
    opacity: 1,
    duration: 1500,
    update: e => {
      if (e.progress > 90) {
        let andEl = document.querySelector('.and')
        andEl.style = 'opacity: 1;'
      }
      if (e.changeCompleted) {
        let heart = new Heart()
        heart.render();
        heartDom.addEventListener('click', () => {
          if (heart.isOver) {
            heartDom.className = 'heart-wrapper move-scale-animate';
            isRenderText = true;
            if (isMobile) {
              FI.PointCloud.changeCamera(0, wh / 2, 1500);
            } else {
              FI.PointCloud.changeCamera(500, 300);
            }
            FI.PointCloud.springToLogo = true;
          }
        })
      }
    }
  });

}
