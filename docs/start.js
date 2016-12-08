function initBundle(k) {
  require("babel-polyfill")
  window.L = require("partial.lenses")
  window.R = require("ramda")
  window.moment = require("moment")
  k()
}

var hljsLanguages = ["javascript", "haskell"]

window.klipse_settings = {
  codemirror_options_in: {
    lineWrapping: true,
    autoCloseBrackets: true,
    cursorBlinkRate: 0
  },
  codemirror_options_out: {
    lineWrapping: true
  },
  selector_eval_js: '.lang-js'
}

function hop(op, k) {setTimeout(function() {op(k)}, 0)}
function ignore() {}
function queue(op) {hop(op, ignore)}

function seq(ops) {
  return function(k) {
    var i = 0
    function lp() {
      if (i < ops.length)
        ops[i++](lp)
      else
        k()
    }
    lp()
  }
}

function loadScript(url) {
  return function(k) {
    var script = document.createElement("script")
    script.onload = k
    script.type = "text/javascript"
    script.src = url
    document.head.appendChild(script)
  }
}

function initHLJS(k) {
  document.querySelectorAll(".hljs")
  .forEach(function (elem) {
    hljs.highlightBlock(elem)
  })
  k()
}

queue(seq([].concat(
  [loadScript("bundle.js"),
   initBundle,
   loadScript("https://storage.googleapis.com/app.klipse.tech/plugin_prod/js/klipse_plugin.min.js"),
   loadScript("https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.8.0/highlight.min.js")],
  hljsLanguages.map(function (lang) {
    return loadScript("https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.8.0/languages/" + lang + ".min.js")
  }),
  [initHLJS]
)))
