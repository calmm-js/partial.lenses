const L = require("../lib/partial.lenses")
const R = require("ramda")

const xyz = {x: 1, y: 2, z: 3}
const xs = [1,2,3]
const nested = [{x: [{y: 1}]}]

const r_1 = R.lensIndex(1)
const r_y = R.lensProp("y")
const r_0_x_0_y = R.compose(R.lensIndex(0), R.lensProp("x"), R.lensIndex(0), R.lensProp("y"))

const bs = [
  'L.get(1, xs)',
  'R.nth(1, xs)',
  'R.view(r_1, xs)',

  'L.set(1, 0, xs)',
  'R.update(1, 0, xs)',
  'R.set(r_1, 0, xs)',

  'L.get("y", xyz)',
  'R.prop("y", xyz)',
  'R.view(r_y, xyz)',

  'L.set("y", 0, xyz)',
  'R.assoc("y", 0, xyz)',
  'R.set(r_y, 0, xyz)',

  'L.get([0, "x", 0, "y"], nested)',
  'R.view(r_0_x_0_y, nested)',

  'L.set([0, "x", 0, "y"], 0, nested)',
  'R.set(r_0_x_0_y, 0, nested)',

  'L.remove("y", xyz)',
  'R.dissoc("y", xyz)',

  'L.get(L.defaults(1), undefined)',
  'L.get(L.defaults(1), 2)',
  'L.get(L.define(1), undefined)',
  'L.get(L.define(1), 2)',
  'L.get(L.valueOr(1), undefined)',
  'L.get(L.valueOr(1), null)',
  'L.get(L.valueOr(1), 2)',

  'L.remove(1, xs)',
]

const s = new require("benchmark").Suite()
bs.forEach(b => s.add(b, eval("() => " + b)))
s.on('cycle', e => console.log(String(e.target))).run()
