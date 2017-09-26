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
    pcc[0].style = 'min-height: ' + pcc[0].getBoundingClientRect().height + 'px;'
    pcc[1].style = ''
    pcc[2].style = ''
  }
  function show(i) {
    const pcc = all[i]
    pcc[0].style = ''
    pcc[1].style = 'display: block;'
    pcc[1].CodeMirror.refresh()
    pcc[2].style = 'display: block;'
    pcc[2].CodeMirror.refresh()
  }
  function hasBeenShown(i) {
    const pcc = all[i]
    return pcc[0].style.length || pcc[1].style.length
  }

  let oldVisStart = 0
  let oldVisStop = 0

  function findVisible(begin, count, height) {
    if (count <= 0)
      return null
    let middle = begin + (count >> 1)
    const m = all[middle][0]
    const r = m.getBoundingClientRect()
    if (r.top < height) {
      if (r.bottom > 0) {
        while (0 < middle && r.top > 0) {
          const m = all[middle-1][0]
          const r = m.getBoundingClientRect()
          if (r.bottom > 0)
            middle = middle-1
          else
            return middle
        }
        return middle
      } else {
        return findVisible(middle + 1, count - 1 - (count >> 1), height)
      }
    } else {
      return findVisible(begin, count >> 1, height)
    }
  }

  let scheduled = 0

  function update() {
    if (0 < scheduled)
      --scheduled

    const height = window.innerHeight
    let vis = findVisible(0, all.length, height)
    if (null === vis)
      return

    const newVisStart = vis

    while (true) {
      show(vis)

      vis++
      if (all.length <= vis)
        break
      if (all[vis][0].getBoundingClientRect().top >= height)
        break
    }

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
