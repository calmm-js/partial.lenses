'use strict'
;(function() {
  var pg = document.querySelector('#playground code')
  if (pg) {
    window.codemirror_options_in = {
      autoCloseBrackets: false,
      autofocus: true,
      cursorBlinkRate: 0,
      lineNumbers: true,
      lineWrapping: false
    }

    var highlightedLines = {}

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
      var params = hash.split('&')
      if (params.length) {
        var text = window.LZString.decompressFromEncodedURIComponent(params[0])
        pg.innerHTML = text.replace(/[\u00A0-\u9999<>&]/gim, function(i) {
          return '&#' + i.charCodeAt(0) + ';'
        })
        updateTitle(text)
        for (var i = 1; i < params.length; ++i) {
          if (params[i][0] === 'L') {
            var linum = Number(params[i].slice(1))
            if (0 <= linum) {
              highlightedLines[linum] = true
            }
          }
        }
      }
    }

    function getCodeMirror() {
      var elem = document.querySelector('.CodeMirror.cm-s-default')
      return elem && elem.CodeMirror
    }

    var highlight = 'background: #fffbdd;'
    function highlightLines() {
      Array.from(
        document.querySelectorAll('.klipse-snippet .CodeMirror-line')
      ).forEach(function(line, indexMinus1) {
        if (highlightedLines[indexMinus1 + 1]) {
          line.style.cssText = highlight
        } else {
          line.style.cssText = ''
        }
      })
    }
    function initialHighlight() {
      const cm = getCodeMirror()
      if (
        cm &&
        document.querySelectorAll('.klipse-snippet .CodeMirror-line').length
      ) {
        cm.on('change', function() {
          highlightLines((highlightedLines = {}))
        })
        highlightLines()
      } else {
        setTimeout(initialHighlight, 100)
      }
    }
    initialHighlight()

    document.onmousedown = function(e) {
      var target = e.target
      if (target.className === 'CodeMirror-linenumber CodeMirror-gutter-elt') {
        const linum = Number(target.textContent)
        if (0 <= linum) {
          if (highlightedLines[linum]) {
            delete highlightedLines[linum]
          } else {
            highlightedLines[linum] = true
          }
          highlightLines()
          updateLocationAndTitle()
        }
      }
    }

    function updateLocationAndTitle() {
      var cm = getCodeMirror()
      if (cm) {
        var text = cm.getValue()
        var compressedText = window.LZString.compressToEncodedURIComponent(
          text.replace(/[ \t]*[\n][ \t]*/g, '\n')
        )
        var lines = Object.keys(highlightedLines)
          .map(function(l) {
            return 'L' + l
          })
          .join('&')
        history.replaceState(
          null,
          '',
          window.location.pathname +
            '#' +
            compressedText +
            (lines ? '&' + lines : '')
        )
        updateTitle(text)
      }
    }

    var to = null
    document.onkeyup = function() {
      clearTimeout(to)
      to = setTimeout(function() {
        highlightLines()
        updateLocationAndTitle()
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
