module.exports = function (aCanvas, aContext, x, y) {
  var self = this
  , canvas = aCanvas
  , context = aContext

  //var lobby_image = new Image()
  //lobby_image.src = '/images/logo.png'

  self.x = x
  self.y = y

  self.minZoom = 0.6
  self.maxZoom = 1
  self.zoom = self.minZoom

  // var backgroundColor = Math.random()*360
  var backgroundColor = 250

  self.setupContext = function () {
    var translateX = canvas.width / 2 - self.x * self.zoom
    var translateY = canvas.height / 2 - self.y * self.zoom

    // Reset transform matrix
    context.setTransform(1,0,0,1,0,0)
    context.fillStyle = '#eee'
    context.fillRect(0,0,canvas.width, canvas.height)

    context.translate(translateX, translateY)

    // Draw lobby image before zooming
    //context.drawImage(lobby_image, 0, 0)

    context.scale(self.zoom, self.zoom)

    if(debug) {
      drawDebug()
    }
  }

  self.update = function (model) {
    // backgroundColor += 0.08
    // backgroundColor = backgroundColor > 360 ? 0 : backgroundColor

    var targetZoom = (model.camera.maxZoom + (model.camera.minZoom - model.camera.maxZoom) * Math.min(model.viewpoint.momentum, model.viewpoint.maxMomentum) / model.viewpoint.maxMomentum)
    model.camera.zoom += (targetZoom - model.camera.zoom) / 60

    var delta = {
      x: (model.viewpoint.x - model.camera.x) / 30
    , y: (model.viewpoint.y - model.camera.y) / 30
    }

    if(Math.abs(delta.x) + Math.abs(delta.y) > 0.1) {
      model.camera.x += delta.x
      model.camera.y += delta.y

      for(var i = 0, len = model.waterParticles.length; i < len; i++) {
        var wp = model.waterParticles[i]
        wp.x -= (wp.z - 1) * delta.x
        wp.y -= (wp.z - 1) * delta.y
      }
    }
  }

  // Gets bounds of current zoom level of current position
  self.getBounds = function () {
    return [
      {x: self.x - canvas.width / 2 / self.zoom, y: self.y - canvas.height / 2 / self.zoom},
      {x: self.x + canvas.width / 2 / self.zoom, y: self.y + canvas.height / 2 / self.zoom}
    ]
  }

  // Gets bounds of minimum zoom level of current position
  self.getOuterBounds = function () {
    return [
      {x: self.x - canvas.width / 2 / self.minZoom, y: self.y - canvas.height / 2 / self.minZoom},
      {x: self.x + canvas.width / 2 / self.minZoom, y: self.y + canvas.height / 2 / self.minZoom}
    ]
  }

  // Gets bounds of maximum zoom level of current position
  self.getInnerBounds = function () {
    return [
      {x: self.x - canvas.width / 2 / self.maxZoom, y: self.y - canvas.height / 2 / self.maxZoom},
      {x: self.x + canvas.width / 2 / self.maxZoom, y: self.y + canvas.height / 2 / self.maxZoom}
    ]
  }

  self.startUILayer = function () {
    context.setTransform(1,0,0,1,0,0)
  }

  var debugBounds = function (bounds, text) {
    context.strokeStyle   = '#fff'
    context.beginPath()
    context.moveTo(bounds[0].x, bounds[0].y)
    context.lineTo(bounds[0].x, bounds[1].y)
    context.lineTo(bounds[1].x, bounds[1].y)
    context.lineTo(bounds[1].x, bounds[0].y)
    context.closePath()
    context.stroke()		
    context.fillText(text, bounds[0].x + 10, bounds[0].y + 10)		
  }

  var drawDebug = function () {
    debugBounds(self.getInnerBounds(), 'Maximum zoom self bounds')
    debugBounds(self.getOuterBounds(), 'Minimum zoom self bounds')
    debugBounds(self.getBounds(), 'Current zoom self bounds')
  }
}
