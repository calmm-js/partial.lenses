function test(name, actual, expect) {
  if (R.equals(actual, expect))
    console.log(name, 'Ok')
  else
    console.log(name, 'Error', actual)
}

function log() {
  console.log.apply(null, arguments)
}

window.klipse_settings = {
  codemirror_options_in: {
    lineWrapping: false,
    autoCloseBrackets: false,
    cursorBlinkRate: 0
  },
  codemirror_options_out: {
    lineWrapping: true
  },
  selector_eval_js: '.lang-js'
}

function accelerate_klipse() {
  const all = Array.prototype.slice.call(document.querySelectorAll('.klipse-container')).map(function (e) {
    const pre = e.parentNode
    const cm1 = pre.children[0]
    const cm2 = pre.children[1]
    return [pre, cm1, cm2]
  })

  function hide(i) {
    const pcc = all[i]
    pcc[0].style.cssText = 'min-height: ' + pcc[0].getBoundingClientRect().height + 'px;'
    pcc[1].style.cssText = ''
    pcc[2].style.cssText = ''
  }
  function show(i) {
    const pcc = all[i]
    pcc[0].style.cssText = ''
    pcc[1].style.cssText = 'display: block;'
    pcc[2].style.cssText = 'display: block;'
    pcc[1].CodeMirror.refresh()
    pcc[2].CodeMirror.refresh()
  }
  function hasBeenShown(i) {
    const pcc = all[i]
    return pcc[0].style.length || pcc[1].style.length
  }

  let oldVisStart = 0
  let oldVisStop = 0

  function visibility(i, height) {
    const pcc = all[i]
    const r = pcc[0].getBoundingClientRect()
    return height <= r.top ? 1 : r.bottom < 0 ? -1 : 0
  }

  function findFirst(i, height) {
    while (0 < i && 0 === visibility(i-1, height))
      --i;
    return i
  }

  function findBinary(begin, count, height) {
    const middle = begin + (count >> 1)
    if (count <= 0)
      return null
    switch (visibility(middle, height)) {
      case 1:
        return findBinary(begin, count >> 1, height)
      case 0:
        return findFirst(middle, height)
      default:
        return findBinary(middle + 1, count - 1 - (count >> 1), height)
    }
  }

  function findVisible(height) {
    const guess = (oldVisStart + oldVisStop) >> 1
    if (0 === visibility(guess, height))
      return findFirst(guess, height)
    else
      return findBinary(0, all.length, height)
  }

  let scheduled = 0

  function update() {
    if (0 < scheduled)
      --scheduled

    const height = window.innerHeight
    let vis = findVisible(height)
    if (null === vis)
      return

    const newVisStart = vis

    do {
      if (vis < oldVisStart || oldVisStop <= vis)
        show(vis)
      ++vis
    } while (vis < all.length && 0 === visibility(vis, height))

    const newVisStop = vis

    for (let i=oldVisStart; i<oldVisStop; ++i)
      if (i < newVisStart || newVisStop <= i)
        hide(i)

    oldVisStart = newVisStart
    oldVisStop = newVisStop
  }

  update()

  function scheduleUpdate() {
    if (0 < scheduled)
      return
    scheduled = 2
    setTimeout(() => {
      if (0 < scheduled)
        --scheduled
    }, 200)
    window.requestAnimationFrame(update)
  }

  window.addEventListener('scroll', scheduleUpdate)
  window.addEventListener('resize', scheduleUpdate)
}
