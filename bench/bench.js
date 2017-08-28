'use strict';

function tryRequire(name) {
  try {
    return require(name)
  } catch (_) {
    console.warn(`Skipping '${name}'`)
  }
}

const I = require("infestines")
const L = require("../dist/partial.lenses.cjs")
const P = tryRequire("ramda-lens")
const R = require("ramda")
const O = tryRequire("flunc-optics")
const K = tryRequire("optika")
const sprintf = require("sprintf-js").sprintf
const _get = tryRequire('lodash.get')

const xyz = {x: 1, y: 2, z: 3}
const xs = [1,2,3]
const axay = [{x: [{y: 1}]}]
const xs10 = Array(10).fill(1)
const xs100 = Array(100).fill(1)
const xs1000 = Array(1000).fill(1)
const xs10000 = Array(10000).fill(1)
const xs100000 = Array(100000).fill(1)
const ids = R.range(0, 10000).map(i => ({id: i, value: i}))

const L_findHint_id_5000 = L.findHint(o => o.id === 5000, {hint: 5000})

const xs10o = Object.assign(xs10)
const xs100o = Object.assign(xs100)
const xs1000o = Object.assign(xs1000)
const xs10000o = Object.assign(xs10000)

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
const K_0_x_0_y = K && K.idx(0).key("x").idx(0).key("y")
const K_xyz = K && K.key("x").key("y").key("z")

const o_x_y_z = O && R.compose(O.Lens.atObject('x'),
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

const L_get_1 = L.get(1)
const R_nth_1 = R.nth(1)

const L_get_y = L.get("y")
const R_prop_y = R.prop("y")

const Sum = {empty: () => 0, concat: add}
const List = {empty: always([]), concat: (x, y) => x.concat(y)}
const toList = x => x !== undefined ? [x] : []

const valueOr1 = L.valueOr(1)
const define1 = L.define(1)
const defaults1 = L.defaults(1)

const valueOr0x0y = [L.valueOr([]), 0, "x", 0, "y"]
const define0x0y = [L.define([]), 0, "x", 0, "y"]
const defaults0x0y = [L.defaults([]), 0, "x", 0, "y"]

const flatten = [L.optional, L.lazy(rec => {
  const elems = L.toFunction([L.elems, rec])
  const values = L.toFunction([L.values, rec])
  return L.choose(x => x instanceof Array  ? elems
                  :    x instanceof Object ? values
                  :                          L.identity)
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

const incNum = x => typeof x === "number" ? x + 1 : x
const nested = [{x:1,y:[2,{d:3},4],z:{a:5}}]
const everywhere = [L.optional, L.lazy(rec => {
  const elems = L.seq([L.elems, rec], L.identity)
  const values = L.seq([L.values, rec], L.identity)
  return L.choose(x => x instanceof Array  ? elems
                  :    x instanceof Object ? values
                  :                          L.identity)
})]

const xyzs = L.seq("x","y","z")

const pi = [3,1,4,1,5]

const aEb = L.orElse("b", "a")
const aEbEc = L.orElse(L.orElse("c", "b"), "a")
const abM = L.choice("a", "b")
const abS = L.choices("a", "b")
const abcM = L.choice("a", "b", "c")
const abcS = L.choices("a", "b", "c")

const EffectA = {
  map: (x2y, xE) => xE,
  ap: (x2yE, xE) => () => {x2yE(); xE()},
  of: I.always(() => {}),
  delay: th => () => th()()
}

const forEach = (xi2u, t, s) => L.traverse(EffectA, (x, i) => () => xi2u(x, i), t, s)()

const Benchmark = require("benchmark")
Benchmark.options.maxTime = Number(process.argv[2]) || Benchmark.options.maxTime

const pattern = new RegExp(process.argv[3] || "")

const dropped = [
  P    ? "" : "P",
  O    ? "" : "O",
  K    ? "" : "K",
  _get ? "" : "_get"
].filter(I.id)

R.forEach(bs => {
  if (bs.find(s => pattern.test(s))) {
    global.gc()
    const s = new Benchmark.Suite()
    bs.reverse().forEach(b => {
      b = b instanceof Array ? b : [b]
      const code = b[0].replace(/[ \n]+/g, " ")
      const note = b[1] || ""
      if (-1 === dropped.findIndex(p => code.indexOf(p) === 0))
        s.add(code, eval("() => " + code), {note})
    })
    s.on('complete', complete)
    s.run()
  }
}, [
  [
    `L.get(L_findHint_id_5000, ids)`,
  ], [
    `L.foldr(add, 0, L.elems, xs100)`,
    `O.Fold.foldrOf(O.Traversal.traversed, addC, 0, xs100)`,
    `R.reduceRight(add, 0, xs100)`,
  ], [
    `L.foldr(add, 0, L.elems, xs100000)`,
    [`O.Fold.foldrOf(O.Traversal.traversed, addC, 0, xs100000)`, "STACK OVERFLOW"],
    `R.reduceRight(add, 0, xs100000)`,
  ], [
    `L.foldl(add, 0, L.elems, xs100)`,
    `O.Fold.foldlOf(O.Traversal.traversed, addC, 0, xs100)`,
    `R.reduce(add, 0, xs100)`,
  ], [
    'xs100.reduce((a, b) => a + b, 0)',
    'L.concat(Sum, L.elems, xs100)',
    'L.sum(L.elems, xs100)',
    'O.Fold.sumOf(O.Traversal.traversed, xs100)',
    'P.sumOf(P.traversed, xs100)',
    'R.sum(xs100)',
    'K.traversed().sumOf(xs100)',
  ], [
    `L.maximum(L.elems, xs100)`,
    `O.Fold.maximumOf(O.Traversal.traversed, xs100)`,
  ], [
    `L.concat(Sum, [L.elems, L.elems, L.elems], xsss100)`,
    `L.sum([L.elems, L.elems, L.elems], xsss100)`,
    `O.Fold.sumOf(R.compose(O.Traversal.traversed,
                            O.Traversal.traversed,
                            O.Traversal.traversed),
                  xsss100)`,
    `P.sumOf(R.compose(P.traversed, P.traversed, P.traversed), xsss100)`,
  ], [
    `xs100.map(I.id)`,
    `L.collect(L.elems, xs100)`,
    `O.Fold.toListOf(O.Traversal.traversed, xs100)`,
    `K.traversed().arrayOf(xs100)`,
  ], [
    `L.collect([L.elems, L.elems, L.elems], xsss100)`,
    `O.Fold.toListOf(R.compose(O.Traversal.traversed,
                               O.Traversal.traversed,
                               O.Traversal.traversed),
                     xsss100)`,
    `R.chain(R.chain(R.identity), xsss100)`,
    `K.traversed().traversed().traversed().arrayOf(xsss100)`,
    `(() => { let acc = []; xsss100.forEach(x0 => { x0.forEach(x1 => { acc = acc.concat(x1); })}); return acc; })()`,
  ], [
    `L.collect(L.flatten, xsss100)`,
    `R.flatten(xsss100)`,
  ], [
    `xs.map(inc)`,
    `L.modify(L.elems, inc, xs)`,
    `O.Setter.over(O.Traversal.traversed, inc, xs)`,
    `P.over(P.traversed, inc, xs)`,
    `R.map(inc, xs)`,
    `K.traversed().over(xs, inc)`,
  ], [
    `xs1000.map(inc)`,
    `L.modify(L.elems, inc, xs1000)`,
    [`O.Setter.over(O.Traversal.traversed, inc, xs1000)`, "QUADRATIC"],
    [`P.over(P.traversed, inc, xs1000)`, "QUADRATIC"],
    `R.map(inc, xs1000)`,
    `K.traversed().over(xs1000, inc)`,
  ], [
    `xsss100.map(x0 => x0.map(x1 => x1.map(inc)))`,
    `L.modify([L.elems, L.elems, L.elems], inc, xsss100)`,
    `O.Setter.over(R.compose(O.Traversal.traversed,
                             O.Traversal.traversed,
                             O.Traversal.traversed),
                   inc,
                   xsss100)`,
    `P.over(R.compose(P.traversed, P.traversed, P.traversed), inc, xsss100)`,
    `R.map(R.map(R.map(inc)), xsss100)`,
    `K.traversed().traversed().traversed().over(xsss100, inc)`,
  ], [
    `L.get(1, xs)`,
    `R.nth(1, xs)`,
    `R.view(l_1, xs)`,
    `K.idx(1).get(xs)`,
    `_get(xs, 1)`,
  ], [
    `L.get(1)(xs)`,
    `L_get_1(xs)`,
    `R.nth(1)(xs)`,
    `R_nth_1(xs)`,
  ], [
    `xs.map((x, i) => i === 1 ? 0 : x)`,
    `(() => { let ys = xs.slice(); ys[1] = 0; return ys; })()`,
    `L.set(1, 0, xs)`,
    `R.set(l_1, 0, xs)`,
    `R.update(1, 0, xs)`,
    `K.idx(1).set(xs, 0)`,
  ], [
    `L.get("y", xyz)`,
    `R.prop("y", xyz)`,
    `R.view(l_y, xyz)`,
    `K.key("y").get(xyz)`,
    `_get(xyz, "y")`,
  ], [
    `L.get("y")(xyz)`,
    `L_get_y(xyz)`,
    `R.prop("y")(xyz)`,
    `R_prop_y(xyz)`,
  ], [
    `L.set("y", 0, xyz)`,
    `R.assoc("y", 0, xyz)`,
    `R.set(l_y, 0, xyz)`,
    `K.key("y").set(xyz, 0)`,
  ], [
    `K_0_x_0_y.get(axay)`,
    `L.get([0,"x",0,"y"], axay)`,
    `R.path([0,"x",0,"y"], axay)`,
    `R.view(l_0_x_0_y, axay)`,
    `R.view(l_0x0y, axay)`,
    `_get(axay, [0,"x",0,"y"])`,
  ], [
    `K_0_x_0_y.set(axay, 0)`,
    `L.set([0,"x",0,"y"], 0, axay)`,
    `R.assocPath([0,"x",0,"y"], 0, axay)`,
    `R.set(l_0_x_0_y, 0, axay)`,
    `R.set(l_0x0y, 0, axay)`,
  ], [
    `K_0_x_0_y.over(axay, inc)`,
    `L.modify([0,"x",0,"y"], inc, axay)`,
    `R.over(l_0_x_0_y, inc, axay)`,
    `R.over(l_0x0y, inc, axay)`,
  ], [
    `L.remove(1, xs)`,
    `R.remove(1, 1, xs)`,
  ], [
    `L.remove("y", xyz)`,
    `R.dissoc("y", xyz)`,
  ], [
    `K_xyz.get(xyzn)`,
    `L.get(["x","y","z"], xyzn)`,
    `O.Getter.view(o_x_y_z, xyzn)`,
    `R.path(["x","y","z"], xyzn)`,
    `R.view(l_x_y_z, xyzn)`,
    `R.view(l_xyz, xyzn)`,
    `_get(xyzn, ["x", "y", "z"])`,
  ], [
    `K_xyz.set(xyzn, 0)`,
    `L.set(["x","y","z"], 0, xyzn)`,
    `O.Setter.set(o_x_y_z, 0, xyzn)`,
    `R.assocPath(["x","y","z"], 0, xyzn)`,
    `R.set(l_x_y_z, 0, xyzn)`,
    `R.set(l_xyz, 0, xyzn)`,
  ], [
    `L.selectAs(x => x > 3 ? x : undefined, L.elems, xs100)`,
    `R.find(x => x > 3, xs100)`,
    `O.Fold.findOf(O.Traversal.traversed, x => x > 3, xs100)`,
  ], [
    `L.selectAs(x => x < 3 ? x : undefined, L.elems, xs100)`,
    `R.find(x => x < 3, xs100)`,
    [`O.Fold.findOf(O.Traversal.traversed, x => x < 3, xs100)`, "NO SHORTCUT EVALUATION"],
  ], [
    `L.sum([L.elems, x => x+1, x => x*2, L.when(x => x%2 === 0)], xs1000)`,
    `R.pipe(R.map(x => x+1), R.map(x => x*2), R.filter(x => x%2 === 0), R.sum)(xs1000)`,
    `R.transduce(R.compose(R.map(x => x+1), R.map(x => x*2), R.filter(x => x%2 === 0)), (x, y) => x+y, 0, xs1000)`,
  ], [
    `L.forEach(I.id, [L.elems, L.elems, L.elems], xsss100)`,
    `R.forEach(R.forEach(R.forEach(I.id)), xsss100)`,
    `forEach(I.id, [L.elems, L.elems, L.elems], xsss100)`,
    `xsss100.forEach(xss100 => xss100.forEach(xs100 => xs100.forEach(I.id)))`,
  ], [
    `L.remove(50, xs100)`,
    `R.remove(50, 1, xs100)`,
  ], [
    `L.set(50, 2, xs100)`,
    `R.set(l_50, 2, xs100)`,
    `R.update(50, 2, xs100)`,
    `K.idx(50).set(xs100, 2)`,
  ], [
    `L.remove(500, xs1000)`,
    `R.remove(500, 1, xs1000)`,
  ], [
    `L.set(500, 2, xs1000)`,
    `R.update(500, 2, xs1000)`,
    `K.idx(500).set(xs1000, 2)`,
  ], [
    `L.remove(5000, xs10000)`,
    `R.remove(5000, 1, xs10000)`,
  ], [
    `L.set(5000, 2, xs10000)`,
    `R.update(5000, 2, xs10000)`,
  ], [
    `L.modify(L.values, inc, xyz)`,
  ], [
    `L.modify(L.values, inc, xs10o)`,
    `L.modify(L.values, inc, xs100o)`,
    `L.modify(L.values, inc, xs1000o)`,
    `L.modify(L.values, inc, xs10000o)`,
  ], [
    `L.modify(everywhere, incNum, nested)`,
    `L.modify(flatten, inc, nested)`,
  ], [
    `L.modify(everywhere, incNum, xs10)`,
    `L.modify(flatten, inc, xs10)`,
  ], [
    `L.modify(everywhere, incNum, xs100)`,
    `L.modify(flatten, inc, xs100)`,
  ], [
    `L.modify(everywhere, incNum, xs1000)`,
    `L.modify(flatten, inc, xs1000)`,
  ], [
    `L.set(L.seq("x","y","z"), 1, undefined)`,
    `L.set(xyzs, 1, undefined)`,
  ], [
    `L.modify(values, x => x + x, bst)`,
  ], [
    `L.collect(values, bst)`,
  ], [
    `fromPairs(bstPairs)`,
  ], [
    `L.get(L.slice(100, -100), xs10000)`,
    `R.slice(100, -100, xs10000)`,
  ], [
    `L.get(L.slice(1, -1), xs)`,
    `R.slice(1, -1, xs)`,
  ], [
    `L.get(L.slice(10, -10), xs100)`,
    `R.slice(10, -10, xs100)`,
  ], [
    `L.get(L.defaults(1), 2)`,
    `L.get(L.defaults(1), undefined)`,
  ], [
    `L.get(defaults1, 2)`,
    `L.get(defaults1, undefined)`,
  ], [
    `L.get(L.define(1), 2)`,
    `L.get(L.define(1), undefined)`,
  ], [
    `L.get(define1, 2)`,
    `L.get(define1, undefined)`,
  ], [
    `L.get(L.valueOr(1), 2)`,
    `L.get(L.valueOr(1), null)`,
    `L.get(L.valueOr(1), undefined)`,
  ], [
    `L.get(valueOr1, 2)`,
    `L.get(valueOr1, null)`,
    `L.get(valueOr1, undefined)`,
  ], [
    `L.concatAs(toList, List, L.elems, xs100)`,
  ], [
    `L.modify(L.flatten, inc, xsss100)`,
  ], [
    `L.selectAs(x => x > 3 ? x : undefined, L.elems, pi)`,
    `R.find(x => x > 3, pi)`,
    `O.Fold.findOf(O.Traversal.traversed, x => x > 3, pi)`,
  ], [
    `L.get(L.findHint(x => x !== 1, {hint: 0}), xs)`,
    `L.get(L.find(x => x !== 1), xs)`,
    `R.find(x => x !== 1, xs)`,
  ], [
    `L.get(L.findHint(x => x !== 1, {hint: 0}), xs100)`,
    `L.get(L.find(x => x !== 1), xs100)`,
    `R.find(x => x !== 1, xs100)`,
  ], [
    `L.get(L.findHint(x => x !== 1, {hint: 0}), xs1000)`,
    `L.get(L.find(x => x !== 1), xs1000)`,
    `R.find(x => x !== 1, xs1000)`,
  ], [
    `L.get(defaults0x0y, axay)`,
    `L.get(define0x0y, axay)`,
    `L.get(valueOr0x0y, axay)`,
  ], [
    `L.set(defaults0x0y, 1, undefined)`,
    `L.set(define0x0y, 1, undefined)`,
    `L.set(valueOr0x0y, 1, undefined)`,
  ], [
    `L.set(L.findWith("x"), 2, axay)`,
  ], [
    `L.get(L.orElse("a", "b"), {x: 1})`,
    `L.get(L.choices("a", "b"), {x: 1})`,
    `L.get(abS, {x: 1})`,
    `L.get(abM, {x: 1})`,
    `L.get(aEb, {x: 1})`,
  ], [
    `L.get(L.choice("a", "b", "c"), {x: 1})`,
    `L.get(L.choices("a", "b", "c"), {x: 1})`,
    `L.get(aEbEc, {x: 1})`,
    `L.get(abcM, {x: 1})`,
    `L.get(abcS, {x: 1})`,
  ], [
    `L.set(L.props("x", "y"), {x:2, y:3}, {x:1, y:2, z:4})`,
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
    console.log(sprintf("%12s/s %8.2fx   %s%s%s",
                        Math.round(b.hz).toLocaleString(),
                        fastest/b.hz,
                        b.name,
                        b.options.note && " -- ",
                        b.options.note))
  })
  console.log()
}
