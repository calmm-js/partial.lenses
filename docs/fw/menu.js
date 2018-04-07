;(function() {
  'use strict'

  function removeIds(elem) {
    elem.removeAttribute('id')
    for (var i = 0, n = elem.childElementCount; i < n; ++i)
      removeIds(elem.children[i])
    return elem
  }

  function createMenu() {
    var menu = document.querySelector('.menu')
    if (!menu) return
    var menuContents = menu.querySelector('.menu-contents')
    if (!menuContents) return
    var contents = document.querySelector('#contents')
    while (
      contents &&
      contents.nextElementSibling &&
      contents.nextElementSibling.tagName !== 'UL'
    )
      contents = contents.parentNode
    if (!contents) return
    var tree = contents.nextElementSibling
    if (!tree) return
    menu.onclick = function(e) {
      menu.className =
        menu.className === 'menu' && e.target.tagName === 'DIV'
          ? 'menu open'
          : 'menu'
      e.stopPropagation()
    }
    menuContents.appendChild(removeIds(tree.cloneNode(true)))
  }

  window.addEventListener('load', createMenu)
})()
