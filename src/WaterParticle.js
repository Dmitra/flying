module.exports = function() {
  var self = this
  var colors = ["193,3,3", "91,188,71", "0,139,254", "255,206,11"]
  var colors = ["#c10303", "#5BBC47", "#008BFE", "#ffce0b"]
  // Tetrad complimentary colors
  //var colors = ["#ff4e4e", "#ffab4e", "#56ccff", "#4eff4e"]

  self.x = 0
  self.y = 0
  self.z = Math.random() * 1 + 0.3
  self.size = Math.random()*5
  //self.opacity = Math.random() * 0.8 + 0.1
  self.color = colors[Math.floor(Math.random()*4)]


  self.update = function(bounds) {
    if(self.x == 0 || self.y == 0) {
      self.x = Math.random() * (bounds[1].x - bounds[0].x) + bounds[0].x
      self.y = Math.random() * (bounds[1].y - bounds[0].y) + bounds[0].y
    }

    // Wrap around screen
    self.x = self.x < bounds[0].x ? bounds[1].x : self.x
    self.y = self.y < bounds[0].y ? bounds[1].y : self.y
    self.x = self.x > bounds[1].x ? bounds[0].x : self.x
    self.y = self.y > bounds[1].y ? bounds[0].y : self.y
  }

  self.draw = function(context) {

    var gradient = context.createRadialGradient(self.x,self.y,0, self.x,self.y,self.size)
    gradient.addColorStop(0, self.color)
    gradient.addColorStop(0.5, self.color)
    gradient.addColorStop(0.85, 'rgb(238,238,238)')
    gradient.addColorStop(1, 'rgb(238,238,238)')

    context.fillStyle = gradient
    //context.fillRect(0,0,canvas.height,canvas.width)

    //Draw circle
    //context.fillStyle = 'rgb('+self.color+')'
    //context.fillStyle = '#fff'
    context.beginPath()
    context.arc(self.x, self.y, self.z * self.size, 0, Math.PI*2, true)
    context.closePath()
    context.fill()
  }
}
