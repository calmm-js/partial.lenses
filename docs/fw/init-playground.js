'use strict'
;(function() {
  var pg = document.querySelector('#playground code')
  if (pg) {
    window.codemirror_options_in = {
      lineWrapping: false,
      lineNumbers: true,
      autoCloseBrackets: false,
      cursorBlinkRate: 0
    }

    var hash = window.location.hash.slice(1)
    function updateTitle(text) {
      document.title = document.title.replace(
        /(:.*)?$/,
        ': ' +
          text
            .replace(/\s+/g, ' ')
            .substring(0, 1000)
            .trim()
      )
    }
    if (hash) {
      var text = window.LZString.decompressFromEncodedURIComponent(hash)
      pg.innerHTML = text.replace(/[\u00A0-\u9999<>&]/gim, function(i) {
        return '&#' + i.charCodeAt(0) + ';'
      })
      updateTitle(text)
    }
    var to = null
    document.onkeyup = function() {
      clearTimeout(to)
      to = setTimeout(function() {
        var cm = document.querySelector('.CodeMirror.cm-s-default').CodeMirror
        if (cm) {
          var text = cm.getValue()
          history.replaceState(
            null,
            '',
            window.location.pathname +
              '#' +
              window.LZString.compressToEncodedURIComponent(
                text.replace(/[ \t]*[\n][ \t]*/g, '\n')
              )
          )
          updateTitle(text)
        }
      }, 250)
    }

    var copyToClipboard = document.querySelector('#copy-to-clipboard')
    if (copyToClipboard) {
      function copyTextToClipboard(text) {
        var textArea = document.createElement('textarea')
        textArea.value = text
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        try {
          document.execCommand('copy')
        } finally {
          document.body.removeChild(textArea)
        }
      }
      copyToClipboard.onclick = function(e) {
        e.preventDefault()
        e.stopPropagation()
        copyTextToClipboard(window.location.href)
      }
    }
  }
})()
