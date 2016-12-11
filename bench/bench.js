'use strict';

const L = require("../lib/partial.lenses")
const P = require("ramda-lens")
const R = require("ramda")

const xyz = {x: 1, y: 2, z: 3}
const xs = [1,2,3]
const axay = [{x: [{y: 1}]}]
const xs100 = Array(100).fill(1)
const xs1000 = Array(1000).fill(1)
const xs10000 = Array(10000).fill(1)
const ids = R.range(0, 10000).map(i => ({id: i, value: i}))

const xsss100 = Array(100).fill([[1]])

const xyzn = {x: {y: {z: 1}}}

const l_0 = R.lensIndex(0)
const l_1 = R.lensIndex(1)
const l_50 = R.lensIndex(50)
const l_x = R.lensProp("x")
const l_y = R.lensProp("y")
const l_z = R.lensProp("z")
const l_0_x_0_y = R.compose(l_0, l_x, l_0, l_y)
const l_xyz = R.lensPath(["x", "y", "z"])
const l_x_y_z = R.compose(l_x, l_y, l_z)

const id = x => x
const always = x => _ => x
const inc = x => x + 1
const add = (x, y) => x+y

const Sum = {empty: () => 0, concat: add}
const List = {empty: always([]), concat: (x, y) => x.concat(y)}
const toList = x => x !== undefined ? [x] : []

const d0x0y = [L.defaults([]), 0, "x", 0, "y"]

const bs = [
  'L.foldMapOf(Sum, L.sequence, id, xs100)',
  'P.sumOf(P.traversed, xs100)',
  'R.sum(xs100)',

  'L.collect(L.sequence, xs100)',

  'L.modify(L.sequence, inc, xs100)',
  'P.over(P.traversed, inc, xs100)',
  'R.map(inc, xs100)',
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

  'L.remove(50, xs100)',
  'R.remove(50, 1, xs100)',

  'L.set(50, 2, xs100)',
  'R.set(l_50, 2, xs100)',
  'R.update(50, 2, xs100)',

  'L.remove(500, xs1000)',
  'L.set(500, 2, xs1000)',
  'R.remove(500, 1, xs1000)',
  'R.update(500, 2, xs1000)',

  'L.remove(5000, xs10000)',
  'L.set(5000, 2, xs10000)',
  'R.remove(5000, 1, xs10000)',
  'R.update(5000, 2, xs10000)',

  'L.get(L.defaults(1), undefined)',
  'L.get(L.defaults(1), 2)',

  'L.get(L.define(1), undefined)',
  'L.get(L.define(1), 2)',

  'L.get(L.valueOr(1), undefined)',
  'L.get(L.valueOr(1), null)',
  'L.get(L.valueOr(1), 2)',

  'L.foldMapOf(List, L.sequence, toList, xs100)',

  'L.modify([L.sequence, L.sequence, L.sequence], inc, xsss100)',
  'P.over(R.compose(P.traversed, P.traversed, P.traversed), inc, xsss100)',
  'R.map(R.map(R.map(inc)), xsss100)',

  'L.get(d0x0y, axay)',
  'L.set(d0x0y, 1, undefined)',

  'L.set(L.findWith("x"), 2, axay)',

  'L.set(L.props("x", "y"), {x:2, y:3}, {x:1, y:2, z:4})',

  'L.foldMapOf(Sum, [L.sequence, L.sequence, L.sequence], id, xsss100)',
  'P.sumOf(R.compose(P.traversed, P.traversed, P.traversed), xsss100)',

  'L.get(L.fromArrayBy("id"), ids)'
]

const Benchmark = require("benchmark")
Benchmark.options.maxTime = 10
const s = new Benchmark.Suite()
bs.forEach(b => s.add(b, eval("() => " + b)))
s.on('cycle', e => console.log(String(e.target))).run()
