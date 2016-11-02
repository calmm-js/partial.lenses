const L = require("../lib/partial.lenses")
const R = require("ramda")

const xyz = {x: 1, y: 2, z: 3}
const xs = [1,2,3]
const nested = [{x: [{y: 1}]}]

const bs = [
  'L.get([0, "x", 0, "y"], nested)',
  'L.get([0, "x"], nested)',
  'L.set([0, "x"], 2, nested)',
  'L.get(L.defaults(1), undefined)',
  'L.get(L.defaults(1), 2)',
  'L.get(L.define(1), undefined)',
  'L.get(L.define(1), 2)',
  'L.get(L.valueOr(1), undefined)',
  'L.get(L.valueOr(1), null)',
  'L.get(L.valueOr(1), 2)',
  'L.remove(1, xs)',
  'L.remove("y", xyz)',
  'L.get(1, xs)',
  'L.get(1)(xs)',
  'L.set(1, 0, xs)',
  'L.get("y", xyz)',
  'L.get("y")(xyz)',
  'L.set("y", 0, xs)',
  'R.prop("y", xyz)',
  'R.view(R.lensIndex(1), xs)',
  'R.over(R.lensIndex(1), () => 0, xs)',
  'R.view(R.lensIndex("y"), xyz)',
  'R.over(R.lensIndex("y"), () => 0, xyz)',
]

const s = new require("benchmark").Suite()
bs.forEach(b => s.add(b, eval("() => " + b)))
s.on('cycle', e => console.log(String(e.target))).run()
