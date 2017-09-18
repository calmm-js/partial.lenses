function test(name, actual, expect) {
  if (R.equals(actual, expect))
    console.log(name, 'Ok')
  else
    console.log(name, 'Error', actual)
}

function log() {
  console.log.apply(null, arguments)
}

window.klipse_settings = {
  codemirror_options_in: {
    lineWrapping: true,
    autoCloseBrackets: false,
    cursorBlinkRate: 0
  },
  codemirror_options_out: {
    lineWrapping: true
  },
  selector_eval_js: '.lang-js'
}
