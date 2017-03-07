(function () {
  var gaid = 'UA-52808982-2'

  function initBundle(k) {
    require("babel-polyfill")
    window.L = require("partial.lenses")
    window.Immutable = require("immutable")
    window.R = require("ramda")
    window.moment = require("moment")
    k()
  }

  var hljsLanguages = ["javascript"]

  window.klipse_settings = {
    codemirror_options_in: {
      lineWrapping: true,
      autoCloseBrackets: true,
      cursorBlinkRate: 0
    },
    codemirror_options_out: {
      lineWrapping: true
    },
    selector_eval_js: '.lang-js'
  }

  function hop(op, k) {setTimeout(function() {op(k)}, 0)}
  function ignore() {}
  function queue(op) {hop(op, ignore)}

  function seq(ops) {
    return function(k) {
      var i = 0
      function lp() {
        if (i < ops.length)
          ops[i++](lp)
        else
          k()
      }
      lp()
    }
  }

  function loadScript(url) {
    return function(k) {
      var script = document.createElement("script")
      script.onload = k
      script.type = "text/javascript"
      script.src = url
      document.head.appendChild(script)
    }
  }

  function initHLJS(k) {
    document.querySelectorAll(".hljs").forEach(function (elem) {
      window.hljs.highlightBlock(elem)
    })
    k()
  }

  function addTips() {
    var tips = []

    function headerOf(elem) {
      if (!elem)
        return null
      if (/^H[1-6]$/.test(elem.tagName))
        return elem
      return headerOf(elem.parentElement)
    }

    function removeIds(elem) {
      elem.removeAttribute("id")
      for (var i=0, n=elem.childElementCount; i < n; ++i)
        removeIds(elem.children[i])
      return elem
    }

    document.querySelectorAll('a').forEach(function (link) {
      var href = link.getAttribute("href")
      if (!href || href[0] !== '#')
        return

      var targetHeader = headerOf(document.querySelector(href))
      if (!targetHeader)
        return

      var linkHeader = headerOf(link)
      if (linkHeader === targetHeader)
        return

      var targetSibling = targetHeader.nextElementSibling
      if (!targetSibling)
        return
      if (targetSibling.tagName !== "P")
        return

      targetHeader = removeIds(targetHeader.cloneNode(true))
      targetSibling = removeIds(targetSibling.cloneNode(true))

      tips.push({link: link,
                 targetHeader: targetHeader,
                 targetSibling: targetSibling})
    })

    tips.forEach(function (args) {
      var preview = document.createElement("div")
      preview.setAttribute("class", "preview")
      preview.appendChild(args.targetHeader)
      preview.appendChild(args.targetSibling)
      args.link.setAttribute("class", "preview-anchor")
      args.link.appendChild(preview)
    })
  }

  window.GoogleAnalyticsObject = "ga"
  window.ga = function () {(window.ga.q = window.ga.q || []).push(arguments)}
  window.ga.l = 1 * new Date()
  window.ga('create', gaid, 'auto')
  window.ga('send', 'pageview')

  function clicksToGA() {
    function onclick(e) {
      window.ga('send', 'event', 'link', 'click', e.target.href)
    }
    document.querySelectorAll('a').forEach(function (elem) {
      elem.onclick = onclick
    })
  }

  window.onload = function () {
    clicksToGA()
    addTips()
  }

  queue(seq([].concat(
    [loadScript("https://www.google-analytics.com/analytics.js"),
     loadScript("bundle.js"),
     initBundle,
     loadScript("https://storage.googleapis.com/app.klipse.tech/plugin_prod/js/klipse_plugin.min.js"),
     loadScript("https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.8.0/highlight.min.js")],
    hljsLanguages.map(function (lang) {
      return loadScript("https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.8.0/languages/" + lang + ".min.js")
    }),
    [initHLJS]
  )))
})()
