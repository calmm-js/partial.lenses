(function () {
  var pg = document.getElementById("playground")
  if (pg) {
    var hash = window.location.hash.slice(1)
    function updateTitle(text) {
      document.title =
        "Partial Lenses Playground: " + text.replace(/\s+/g, " ").trim()
    }
    if (hash) {
      var text = window.LZString.decompressFromEncodedURIComponent(hash)
      pg.innerHTML = text
      updateTitle(text)
    }
    var to = null
    document.onkeyup = function () {
      clearTimeout(to)
      to = setTimeout(function () {
        var elem = document.querySelector(".CodeMirror-lines")
        if (elem) {
          window.location.hash =
            window.LZString.compressToEncodedURIComponent(
              elem.innerText.replace(/\u200B|^\s*|\s*$/gm, ""))
          updateTitle(elem.innerText)
        }
      }, 250)
    }
  }
})()
