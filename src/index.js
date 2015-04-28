var App = require('./App')
, app 
window.debug = false

var runLoop = function() {
  app.update()
  app.draw()
}
var initApp = function() {
  if (app!=null) return
  app = new App({}, document.getElementById('canvas'))

  window.addEventListener('resize', app.resize, false)

  document.addEventListener('mousemove', 		app.mousemove, false)
  document.addEventListener('mousedown', 		app.mousedown, false)
  document.addEventListener('mouseup',			app.mouseup, false)

  document.addEventListener('touchstart',   app.touchstart, false)
  document.addEventListener('touchend',     app.touchend, false)
  document.addEventListener('touchcancel',  app.touchend, false)
  document.addEventListener('touchmove',    app.touchmove, false)

  setInterval(runLoop,30)
}

initApp()

document.body.onselectstart = function() { return false }
