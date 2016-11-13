const L = require("../lib/partial.lenses")
const R = require("ramda")

const xyz = {x: 1, y: 2, z: 3}
const xs = [1,2,3]
const axay = [{x: [{y: 1}]}]

const xyzn = {x: {y: {z: 1}}}

const l_0 = R.lensIndex(0)
const l_1 = R.lensIndex(1)
const l_x = R.lensProp("x")
const l_y = R.lensProp("y")
const l_z = R.lensProp("z")
const l_0_x_0_y = R.compose(l_0, l_x, l_0, l_y)
const l_xyz = R.lensPath(["x", "y", "z"])
const l_x_y_z = R.compose(l_x, l_y, l_z)

const inc = x => x + 1

const bs = [
  'L.get(1, xs)',
  'R.nth(1, xs)',
  'R.view(l_1, xs)',

  'L.set(1, 0, xs)',
  'R.update(1, 0, xs)',
  'R.set(l_1, 0, xs)',

  'L.get("y", xyz)',
  'R.prop("y", xyz)',
  'R.view(l_y, xyz)',

  'L.set("y", 0, xyz)',
  'R.assoc("y", 0, xyz)',
  'R.set(l_y, 0, xyz)',

  'L.get([0,"x",0,"y"], axay)',
  'R.view(l_0_x_0_y, axay)',

  'L.set([0,"x",0,"y"], 0, axay)',
  'R.set(l_0_x_0_y, 0, axay)',

  'L.modify([0,"x",0,"y"], inc, axay)',
  'R.over(l_0_x_0_y, inc, axay)',

  'L.remove(1, xs)',
  'R.remove(1, 1, xs)',

  'L.remove("y", xyz)',
  'R.dissoc("y", xyz)',

  'L.get(["x","y","z"], xyzn)',
  'R.path(["x","y","z"], xyzn)',
  'R.view(l_xyz, xyzn)',
  'R.view(l_x_y_z, xyzn)',

  'L.set(["x","y","z"], 0, xyzn)',
  'R.assocPath(["x","y","z"], 0, xyzn)',
  'R.set(l_xyz, 0, xyzn)',
  'R.set(l_x_y_z, 0, xyzn)',

  'L.get(L.defaults(1), undefined)',
  'L.get(L.defaults(1), 2)',

  'L.get(L.define(1), undefined)',
  'L.get(L.define(1), 2)',

  'L.get(L.valueOr(1), undefined)',
  'L.get(L.valueOr(1), null)',
  'L.get(L.valueOr(1), 2)',
]

const s = new require("benchmark").Suite()
bs.forEach(b => s.add(b, eval("() => " + b)))
s.on('cycle', e => console.log(String(e.target))).run()
