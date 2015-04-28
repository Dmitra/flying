var Model = require('./Model')
, Viewpoint = require('./Viewpoint')
, Camera = require('./Camera')
, WaterParticle = require('./WaterParticle')

module.exports = function(aSettings, aCanvas) {
  var self = this

  var model
  , canvas
  , context
  , mouse = {x: 0, y: 0, worldx: 0, worldy: 0}

  self.update = function() {
    // Update user viewpoint
    var mvp = getMouseWorldPosition()
    mouse.worldx = mvp.x
    mouse.worldy = mvp.y

    model.viewpoint.userUpdate(mouse.worldx, mouse.worldy)

    if(model.viewpoint.age % 6 == 0 && model.viewpoint.changed > 1) {
      model.viewpoint.changed = 0
    }

    model.camera.update(model)

    model.viewpoint.update()

    // Update waterParticles
    for(i in model.waterParticles) {
      model.waterParticles[i].update(model.camera.getOuterBounds(), model.camera.zoom)
    }

    // Update arrows
    for(i in model.arrows) {
      var cameraBounds = model.camera.getBounds()
      var arrow = model.arrows[i]
      arrow.update()
    }
  }

  self.draw = function() {
    model.camera.setupContext()

    // Draw waterParticles
    for(i in model.waterParticles) {
      model.waterParticles[i].draw(context)
    }

    // Draw viewpoint
    model.viewpoint.draw(context)

    // Start UI layer (reset transform matrix)
    model.camera.startUILayer()

    // Draw arrows
    for(i in model.arrows) {
      model.arrows[i].draw(context, canvas)
    }
  }

  self.mousedown = function(e) {
    mouse.clicking = true

    if(model.viewpoint && e.which == 1) {
      model.viewpoint.momentum = model.viewpoint.targetMomentum = model.viewpoint.maxMomentum
    }
  }

  self.mouseup = function(e) {
    if(model.viewpoint && e.which == 1) {
      model.viewpoint.targetMomentum = 0
    }
  }

  self.mousemove = function(e) {
    mouse.x = e.clientX
    mouse.y = e.clientY
  }

  self.touchstart = function(e) {
    e.preventDefault()
    mouse.clicking = true

    if(model.viewpoint) {
      model.viewpoint.momentum = model.viewpoint.targetMomentum = model.viewpoint.maxMomentum
    }

    var touch = e.changedTouches.item(0)
    if (touch) {
      mouse.x = touch.clientX
      mouse.y = touch.clientY
    }
  }
  self.touchend = function(e) {
    if(model.viewpoint) {
      model.viewpoint.targetMomentum = 0
    }
  }
  self.touchmove = function(e) {
    e.preventDefault()

    var touch = e.changedTouches.item(0)
    if (touch) {
      mouse.x = touch.clientX
      mouse.y = touch.clientY
    }
  }


  self.resize = function(e) {
    resizeCanvas()
  }

  var getMouseWorldPosition = function() {
    return {
      x: (mouse.x + (model.camera.x * model.camera.zoom - canvas.width / 2)) / model.camera.zoom,
      y: (mouse.y + (model.camera.y * model.camera.zoom  - canvas.height / 2)) / model.camera.zoom
    }
  }

  var resizeCanvas = function() {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  }

  // Constructor
  ;(function(){
    canvas = aCanvas
    context = canvas.getContext('2d')
    resizeCanvas()

    model = new Model()
    model.settings = aSettings

    model.viewpoint = new Viewpoint()
    model.viewpoint.id = -1

    model.waterParticles = []
    for(var i = 0; i < 150; i++) {
      model.waterParticles.push(new WaterParticle())
    }

    model.camera = new Camera(canvas, context, model.viewpoint.x, model.viewpoint.y)
    model.arrows = {}
  })()
}
