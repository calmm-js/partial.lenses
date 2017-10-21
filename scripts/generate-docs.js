const user = "calmm-js"
const project = "partial.lenses"

const github = `https://github.com/${user}/${project}`
const site = `https://${user}.github.io/${project}/`
const blob = `${github}/blob/master/`
const hljsStyle = "googlecode"

const targetDefaults = {
  icon: "https://avatars1.githubusercontent.com/u/17234211",
  ga: "UA-52808982-2",
  stripComments: false,
  constToVar: false,
  menu: false,
  tooltips: false,
  klipse: true,
  klipseHeader: true,
  loadingMessage: true
}

const targets = [{
  ...targetDefaults,
  source: "README.md",
  target: "docs/index.html",
  title: "Partial Lenses",
  stripComments: true,
  constToVar: true,
  menu: true,
  tooltips: true
}, {
  ...targetDefaults,
  source: "EXERCISES.md",
  target: "docs/exercises.html",
  title: "Partial Lenses Exercises",
  menu: true
}]

//

const fs = require("fs")
const marked = require("8fold-marked")

marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: false,
  smartLists: true,
  smartypants: false
})

String.prototype.marked = function () { return marked(this) }
String.prototype.replaceIf = function (c, p, r) {
  return c ? this.replace(p, r) : this
}

const esc = s => s.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&")

//

function process({
  icon,
  ga,
  source,
  target,
  title,
  stripComments,
  constToVar,
  menu,
  tooltips,
  klipse,
  klipseHeader,
  loadingMessage
}) {
  const body = fs.readFileSync(source)
    .toString()
    .replace(/\(\/#/g, `(${github}/#`)
    .replaceIf(constToVar, /([^ ])\bconst\b/g, "$1var")
    .replaceIf(stripComments, /\/\/ [^.].*/g, "")
    .replace(/\n{3,}/g, '\n\n')
    .replace(/\[([^\]]*)\]\(\.\/([^)]*)\)/g, `[$1](${blob}$2)`)
    .replace(new RegExp(esc(`[▶](${site}#`) + "([a-zA-Z-]*)" + esc(")"), "g"),
             `[■](${github}#$1)`)
    .replace(new RegExp(esc(site), "g"), "")
    .marked()
    .replace(new RegExp(esc(`a href="${github}/#`), "g"), `a target="_blank" href="${github}/#`)
    .replace(/ id="-[^"]*"/g, "")
    .replace(/<code class="lang-([a-z]*)">/g,
             '<code class="hljs lang-$1">')
    .replace(/ +$/gm, "")

  const headElems = [
    `<meta charset="utf-8">`,
    `<title>${title}</title>`,
    icon && `<link rel="icon" href="${icon}">`,
    `<link rel="stylesheet" type="text/css" href="fw/github.css">`,
    hljsStyle && `<link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.8.0/styles/${hljsStyle}.min.css">`,
    klipse && `<link rel="stylesheet" type="text/css" href="https://storage.googleapis.com/app.klipse.tech/css/codemirror.css">`,
    `<link rel="stylesheet" type="text/css" href="fw/styles.css">`,
    ga && `<script type="text/javascript">startTime = Date.now()</script>`,
    ga && `<script type="text/javascript">(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');ga('create','${ga}','auto');ga('send','pageview');</script>`
  ].filter(x => x)

  const preBodyElems = [
    klipse && loadingMessage && `<div class="loading-message">
      Please wait... The interactive code snippets on this page take a moment to render.
    </div>`,
    menu && `<div class="menu">
      <div class="menu-overlay"></div>
      <div class="menu-body">
        <div class="menu-side">
          <div>≡</div>
          <a id="to-top" href="#" onclick="">▲</a>
        </div>
        <div class="menu-contents"></div>
      </div>
    </div>`,
    klipse && klipseHeader && `<p>
      All the code snippets on this page are <b>live</b> and <b>interactive</b>
      powered by the <a target="_blank" href="https://github.com/viebel/klipse">klipse
      plugin</a>.
    </p>
    <hr>`
  ].filter(x => x)

  const afterLoadStmts = [
    loadingMessage && `document.querySelector('.loading-message').className = "loading-hidden";`,
    ga && `ga('send', 'event', 'completed', 'load', Math.round((Date.now() - startTime)/1000));`,
    klipse && `accelerate_klipse();`
  ].filter(x => x)

  const postBodyElems = [
    afterLoadStmts.length && `<div class="loading-hidden">
      <pre><code class="hljs lang-js">
        ${afterLoadStmts.join("\n        ")}
      </code></pre>
    </div>`
  ].filter(x => x)

  const scripts = [
    klipse && "https://unpkg.com/babel-polyfill/dist/polyfill.min.js",
    klipse && "infestines.min.js",
    klipse && `${project}.js`,
    klipse && "https://unpkg.com/ramda/dist/ramda.min.js",
    klipse && "https://unpkg.com/immutable/dist/immutable.min.js",
    klipse && "https://unpkg.com/moment/min/moment.min.js",
    klipse && "fw/klipse-settings.js",
    klipse && "https://storage.googleapis.com/app.klipse.tech/plugin_prod/js/klipse_plugin.min.js",
    "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.8.0/highlight.min.js",
    "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.8.0/languages/javascript.min.js",
    "fw/init-hljs.js",
    menu && "fw/menu.js",
    tooltips && "fw/tooltips.js",
    ga && "fw/clicks-to-ga.js"
  ].filter(x => x)

  fs.writeFileSync(target,
  `<!DOCTYPE html>
<html>
  <head>
    ${headElems.join("\n    ")}
  </head>
  <body class="markdown-body">
    ${preBodyElems.join("\n    ")}
    ${body}
    ${postBodyElems.join("\n    ")}
    ${scripts
      .map(src => `<script type="text/javascript" src="${src}"></script>`)
      .join("\n    ")}
  </body>
</html>`)
}

//

targets.forEach(process)
