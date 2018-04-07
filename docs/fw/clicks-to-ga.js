;(function() {
  'use strict'

  function clicksToGA() {
    function onclick(e) {
      ga('send', 'event', 'link', 'click', e.target.href)
    }
    Array.prototype.slice
      .call(document.querySelectorAll('a'))
      .forEach(function(elem) {
        elem.onclick = onclick
      })
  }

  window.addEventListener('load', clicksToGA)
})()
