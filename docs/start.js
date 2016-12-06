require("babel-polyfill")
window.L = require("../lib/partial.lenses")
window.R = require("ramda")
window.moment = require("moment")

window.klipse_settings = {
  codemirror_options_in: {
    lineWrapping: true,
    lineNumbers: true,
    autoCloseBrackets: true,
    cursorBlinkRate: 0
  },
  codemirror_options_out: {
    lineWrapping: true
  },
  selector_eval_js: '.lang-js'
}

const klipse = document.createElement("script")
klipse.type = "text/javascript"
klipse.src = "http://app.klipse.tech/plugin_prod/js/klipse_plugin.min.js"
klipse.async = 1
document.head.appendChild(klipse)
