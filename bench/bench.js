'use strict';

const I = require("infestines")
const L = require("../lib/partial.lenses")
const P = require("ramda-lens")
const R = require("ramda")
const O = require("flunc-optics")
const sprintf = require("sprintf-js").sprintf

const xyz = {x: 1, y: 2, z: 3}
const xs = [1,2,3]
const axay = [{x: [{y: 1}]}]
const xs100 = Array(100).fill(1)
const xs1000 = Array(1000).fill(1)
const xs10000 = Array(10000).fill(1)
const xs100000 = Array(100000).fill(1)
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
const l_0x0y = R.lensPath([0, "x", 0, "y"])
const l_xyz = R.lensPath(["x", "y", "z"])
const l_x_y_z = R.compose(l_x, l_y, l_z)

const o_x_y_z = R.compose(O.Lens.atObject('x'),
                          O.Prism._Just,
                          O.Lens.atObject('y'),
                          O.Prism._Just,
                          O.Lens.atObject('z'),
                          O.Prism._Just)

const id = I.id
const always = I.always
const inc = x => x + 1
const add = (x, y) => x+y
const addC = x => y => x+y

const Sum = {empty: () => 0, concat: add}
const List = {empty: always([]), concat: (x, y) => x.concat(y)}
const toList = x => x !== undefined ? [x] : []

const d0x0y = [L.defaults([]), 0, "x", 0, "y"]

const flatten = [L.optional, L.lazy(rec => {
  const nest = L.toFunction([L.sequence, rec])
  return L.choose(x => I.isArray(x) ? nest : L.identity)
})]

const naiveBST = L.rewrite(n => {
  if (undefined !== n.value) return n
  const s = n.smaller, g = n.greater
  if (!s) return g
  if (!g) return s
  return L.set(search(s.key), s, g)
})

const search = key => L.lazy(rec => {
  const smaller = ["smaller", rec]
  const greater = ["greater", rec]
  const insert = L.defaults({key})
  return [naiveBST, L.choose(n => {
    if (!n || key === n.key)
      return insert
    return key < n.key ? smaller : greater
  })]
})

const valueOf = key => [search(key), "value"]

const fromPairs =
  R.reduce((t, kv) => L.set(valueOf(kv[0]), kv[1], t), undefined)

const values = L.lazy(rec => [
  L.optional,
  naiveBST,
  L.branch({smaller: rec,
            value: L.identity,
            greater: rec})])

const bstPairs = [[3, "g"], [2, "a"], [1, "m"], [4, "i"], [5, "c"]]
const bst = fromPairs(bstPairs)

const Benchmark = require("benchmark")
Benchmark.options.maxTime = Number(process.argv[2]) || 10

R.forEach(bs => {
  global.gc()
  const s = new Benchmark.Suite()
  bs.reverse().forEach(b => {
    b = b.replace(/[ \n]+/g, " ")
    s.add(b, eval("() => " + b))
  })
  s.on('complete', complete)
  s.run()
}, [
  [
    `L.foldr(add, 0, L.sequence, xs100)`,
    `O.Fold.foldrOf(O.Traversal.traversed, addC, 0, xs100)`,
  ], [
    `L.foldr(add, 0, L.sequence, xs100000)`,
    `O.Fold.foldrOf(O.Traversal.traversed, addC, 0, xs100000)`,
  ], [
    `L.foldl(add, 0, L.sequence, xs100)`,
    `O.Fold.foldlOf(O.Traversal.traversed, addC, 0, xs100)`,
  ], [
    'L.merge(Sum, L.sequence, xs100)',
    'L.sum(L.sequence, xs100)',
    'O.Fold.sumOf(O.Traversal.traversed, xs100)',
    'P.sumOf(P.traversed, xs100)',
    'R.sum(xs100)',
  ], [
    'L.maximum(L.sequence, xs100)',
    'O.Fold.maximumOf(O.Traversal.traversed, xs100)',
  ], [
    'L.merge(Sum, [L.sequence, L.sequence, L.sequence], xsss100)',
    'L.sum([L.sequence, L.sequence, L.sequence], xsss100)',
    `O.Fold.sumOf(R.compose(O.Traversal.traversed,
                            O.Traversal.traversed,
                            O.Traversal.traversed),
                  xsss100)`,
    'P.sumOf(R.compose(P.traversed, P.traversed, P.traversed), xsss100)',
  ], [
    'L.collect(L.sequence, xs100)',
    'O.Fold.toListOf(O.Traversal.traversed, xs100)',
  ], [
    'L.collect([L.sequence, L.sequence, L.sequence], xsss100)',
    `O.Fold.toListOf(R.compose(O.Traversal.traversed,
                               O.Traversal.traversed,
                               O.Traversal.traversed),
                     xsss100)`,
    'R.chain(R.chain(R.identity), xsss100)',
  ], [
    'L.collect(flatten, xsss100)',
    'R.flatten(xsss100)',
  ], [
    'L.modify(L.sequence, inc, xs100)',
    'O.Setter.over(O.Traversal.traversed, inc, xs100)',
    'P.over(P.traversed, inc, xs100)',
    'R.map(inc, xs100)',
  ], [
    'L.modify([L.sequence, L.sequence, L.sequence], inc, xsss100)',
    `O.Setter.over(R.compose(O.Traversal.traversed,
                             O.Traversal.traversed,
                             O.Traversal.traversed),
                   inc,
                   xsss100)`,
    'P.over(R.compose(P.traversed, P.traversed, P.traversed), inc, xsss100)',
    'R.map(R.map(R.map(inc)), xsss100)',
  ], [
    'L.get(1, xs)',
    'R.nth(1, xs)',
    'R.view(l_1, xs)',
  ], [
    'L.set(1, 0, xs)',
    'R.set(l_1, 0, xs)',
    'R.update(1, 0, xs)',
  ], [
    'L.get("y", xyz)',
    'R.prop("y", xyz)',
    'R.view(l_y, xyz)',
  ], [
    'L.set("y", 0, xyz)',
    'R.assoc("y", 0, xyz)',
    'R.set(l_y, 0, xyz)',
  ], [
    'L.get([0,"x",0,"y"], axay)',
    'R.path([0,"x",0,"y"], axay)',
    'R.view(l_0_x_0_y, axay)',
    'R.view(l_0x0y, axay)',
  ], [
    'L.set([0,"x",0,"y"], 0, axay)',
    'R.assocPath([0,"x",0,"y"], 0, axay)',
    'R.set(l_0_x_0_y, 0, axay)',
    'R.set(l_0x0y, 0, axay)',
  ], [
    'L.modify([0,"x",0,"y"], inc, axay)',
    'R.over(l_0_x_0_y, inc, axay)',
    'R.over(l_0x0y, inc, axay)',
  ], [
    'L.remove(1, xs)',
    'R.remove(1, 1, xs)',
  ], [
    'L.remove("y", xyz)',
    'R.dissoc("y", xyz)',
  ], [
    'L.get(["x","y","z"], xyzn)',
    'O.Getter.view(o_x_y_z, xyzn)',
    'R.path(["x","y","z"], xyzn)',
    'R.view(l_x_y_z, xyzn)',
    'R.view(l_xyz, xyzn)',
  ], [
    'L.set(["x","y","z"], 0, xyzn)',
    'O.Setter.set(o_x_y_z, 0, xyzn)',
    'R.assocPath(["x","y","z"], 0, xyzn)',
    'R.set(l_x_y_z, 0, xyzn)',
    'R.set(l_xyz, 0, xyzn)',
  ], [
    'L.remove(50, xs100)',
    'R.remove(50, 1, xs100)',
  ], [
    'L.set(50, 2, xs100)',
    'R.set(l_50, 2, xs100)',
    'R.update(50, 2, xs100)',
  ], [
    'L.remove(500, xs1000)',
    'R.remove(500, 1, xs1000)',
  ], [
    'L.set(500, 2, xs1000)',
    'R.update(500, 2, xs1000)',
  ], [
    'L.remove(5000, xs10000)',
    'R.remove(5000, 1, xs10000)',
  ], [
    'L.set(5000, 2, xs10000)',
    'R.update(5000, 2, xs10000)',
  ], [
    'L.modify(values, x => x + x, bst)',
  ], [
    'L.collect(values, bst)',
  ], [
    'fromPairs(bstPairs)',
  ], [
    'L.get(L.defaults(1), 2)',
    'L.get(L.defaults(1), undefined)',
  ], [
    'L.get(L.define(1), 2)',
    'L.get(L.define(1), undefined)',
  ], [
    'L.get(L.valueOr(1), 2)',
    'L.get(L.valueOr(1), null)',
    'L.get(L.valueOr(1), undefined)',
  ], [
    'L.concatAs(toList, List, L.sequence, xs100)',
  ], [
    'L.modify(flatten, inc, xsss100)',
  ], [
    'L.get(d0x0y, axay)',
  ], [
    'L.set(d0x0y, 1, undefined)',
  ], [
    'L.set(L.findWith("x"), 2, axay)',
  ], [
    'L.set(L.props("x", "y"), {x:2, y:3}, {x:1, y:2, z:4})',
  ]
])

function complete() {
  const bs = I.seq(this,
                   R.values,
                   R.filter(R.is(Benchmark)),
                   R.sortBy(R.prop("hz")),
                   R.reverse)
  const fastest = I.seq(bs,
                        R.map(R.prop("hz")),
                        R.reduce(R.max, 0))
  bs.forEach(b => {
    console.log(sprintf('%12s/s %8.2fx   %s',
                        Math.round(b.hz).toLocaleString(),
                        fastest/b.hz, b.name))
  })
  console.log()
}
