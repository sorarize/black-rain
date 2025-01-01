import p5 from 'p5'
import './style.scss'

new p5((p) => {
  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight)
  }

  p.draw = () => {
    p.background(220)
    p.ellipse(p.width/2, p.height/2, 80, 80)
  }

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight)
  }
})
