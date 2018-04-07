'use strict'

Array.prototype.slice
  .call(document.querySelectorAll('.hljs'))
  .forEach(function(elem) {
    window.hljs.highlightBlock(elem)
  })
