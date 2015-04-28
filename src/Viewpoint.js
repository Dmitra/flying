module.exports = function() {
  var logo = new Image()
  logo.src = 'images/logo.png'
  var self = this

  self.x = Math.random() * 300 - 150
  self.y = Math.random() * 300 - 150
  self.size = 4

  self.name = ''
  self.age = 0

  self.momentum = 0
  self.maxMomentum = 5
  self.angle = Math.PI * 2

  self.targetX = 0
  self.targetY = 0
  self.targetMomentum = 0

  self.messages = []
  self.timeSinceLastActivity = 0

  self.changed = 0

  self.update = function() {

    self.x += Math.cos(self.angle) * self.momentum
    self.y += Math.sin(self.angle) * self.momentum

    if(self.targetX != 0 || self.targetY != 0) {
      self.x += (self.targetX - self.x) / 20
      self.y += (self.targetY - self.y) / 20
    }

    // Update messages
    for (var i = self.messages.length - 1; i >= 0; i--) {
      var msg = self.messages[i]
      msg.update()

      if(msg.age == msg.maxAge) {
        self.messages.splice(i,1)
      }
    }
  }

  self.userUpdate = function(angleTargetX, angleTargetY) {
    self.age++

    var prevState = {
      angle: self.angle,
      momentum: self.momentum,
    }

    // Angle to targetx and targety (mouse position)
    var anglediff = ((Math.atan2(angleTargetY - self.y, angleTargetX - self.x)) - self.angle)
    while(anglediff < -Math.PI) anglediff += Math.PI * 2
    while(anglediff > Math.PI) anglediff -= Math.PI * 2

    self.angle += anglediff / 5

    // Momentum to targetmomentum
    if(self.targetMomentum != self.momentum) {
      self.momentum += (self.targetMomentum - self.momentum) / 20
    }

    if(self.momentum < 0) self.momentum = 0
      
    self.changed += Math.abs((prevState.angle - self.angle)*3) + self.momentum
  }

  self.draw = function(context) {
    context.drawImage(logo, self.x, self.y)
  }
}
