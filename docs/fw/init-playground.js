(function () {
  var pg = document.querySelector("#playground code")
  if (pg) {
    var hash = window.location.hash.slice(1)
    function updateTitle(text) {
      document.title =
        document.title.replace(/(:.*)?$/, ": " + text.replace(/\s+/g, " ").substring(0, 1000).trim())
    }
    if (hash) {
      var text = window.LZString.decompressFromEncodedURIComponent(hash)
      pg.innerHTML = text.replace(/[\u00A0-\u9999<>&]/gim, function (i) {
        return '&#' + i.charCodeAt(0) + ';'
      })
      updateTitle(text)
    }
    var to = null
    document.onkeyup = function () {
      clearTimeout(to)
      to = setTimeout(function () {
        var elem = document.querySelector(".CodeMirror-lines")
        if (elem) {
          history.replaceState(
            null,
            '',
            window.location.pathname +
            window.location.search +
            '#' +
            window.LZString.compressToEncodedURIComponent(
              elem.innerText.replace(/\u200B|^\s*|\s*$/gm, "")))
          updateTitle(elem.innerText)
        }
      }, 250)
    }
  }
})()
