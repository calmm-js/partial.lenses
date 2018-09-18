window.log = function() {
  var log = console.log
  L.transformAsync(L.elemsTotal, arguments).then(args =>
    log.apply(console, args)
  )
}
