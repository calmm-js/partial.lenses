;(function() {
  'use strict'

  function removeIds(elem) {
    elem.removeAttribute('id')
    for (var i = 0, n = elem.childElementCount; i < n; ++i)
      removeIds(elem.children[i])
    return elem
  }

  function addTips() {
    var tips = []

    function headerOf(elem) {
      if (!elem) return null
      if (/^H[1-6]$/.test(elem.tagName)) return elem
      return headerOf(elem.parentElement)
    }

    Array.prototype.slice
      .call(document.querySelectorAll('a'))
      .forEach(function(link) {
        var href = link.getAttribute('href')
        if (!href || href[0] !== '#' || href === '#') return
        if (link.onclick) return

        var targetHeader = headerOf(document.querySelector(href))
        if (!targetHeader) return

        var linkHeader = headerOf(link)
        if (linkHeader === targetHeader) return

        var targetSibling = targetHeader.nextElementSibling
        if (!targetSibling) return
        if (targetSibling.tagName !== 'P') return

        targetHeader = removeIds(targetHeader.cloneNode(true))
        targetSibling = removeIds(targetSibling.cloneNode(true))

        tips.push({
          link: link,
          targetHeader: targetHeader,
          targetSibling: targetSibling
        })
      })

    tips.forEach(function(args) {
      var preview = document.createElement('div')
      preview.setAttribute('class', 'preview')
      preview.appendChild(args.targetHeader)
      preview.appendChild(args.targetSibling)
      args.link.setAttribute('class', 'preview-anchor')
      args.link.appendChild(preview)
    })
  }

  window.addEventListener('load', addTips)
})()
