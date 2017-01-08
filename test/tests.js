import * as I from "infestines"
import * as R from "ramda"
import {id} from "infestines"

import P, * as L from "../src/partial.lenses"

import * as BST from "./bst"
import * as C from "./core"
import * as T from "./types"

function show(x) {
  switch (typeof x) {
  case "string":
  case "object":
    return JSON.stringify(x)
  default:
    return `${x}`
  }
}

const a100000 = Array(100000).fill(1)

const run = expr =>
  eval(`(P, L, X, R, id, I, C, T, a100000) => ${expr}`)(
         P, L, L, R, id, I, C, T, a100000)

function testEq(exprIn, expect) {
  const expr = exprIn.replace(/[ \n]+/g, " ")
  it(`${expr} => ${show(expect)}`, () => {
    const actual = run(expr)
    if (!I.acyclicEqualsU(actual, expect))
      throw new Error(`Expected: ${show(expect)}, actual: ${show(actual)}`)

    const exprTy = expr.replace(/\bL\.([a-zA-Z0-9]*)/g, "T.$1(L.$1)")
    const typed = run(exprTy)
    if (!I.acyclicEqualsU(actual, typed))
      throw new Error(`Typed: ${show(typed)}, actual: ${show(actual)}`)

    const core = run(exprTy.replace(/\bL\./g, "C."))
    if (!I.acyclicEqualsU(actual, core))
      throw new Error(`Core: ${show(core)}, actual: ${show(actual)}`)
  })
}

const testThrows = expr => it(`${expr} => throws`, () => {
  let raised
  let result
  try {
    result = run(expr)
    raised = false
  } catch (e) {
    result = e
    raised = true
  }
  if (!raised)
    throw new Error(`Expected ${expr} to throw, returned ${show(result)}`)
})

const empties = [undefined, null, false, true, "a", 0, 0.0/0.0, {}, []]

describe("compose", () => {
  testEq('L.get(L.compose(), "any")', "any")
  testEq('L.compose("x")', "x")
  testEq('L.compose(101)', 101)
  testEq('L.compose(101, "x")', [101, "x"])
})

describe("L.identity", () => {
  testEq('L.get(L.identity, "any")', "any")
  testEq('L.modify(L.identity, R.add(1), 2)', 3)
  testEq('L.modify([], R.add(1), 2)', 3)
  testEq('L.remove(["x", L.identity], {x: 1, y: 2})', {y: 2})
})

describe("arities", () => {
  testEq('L.augment.length', 1)
  testEq('L.branch.length', 1)
  testEq('L.choice.length', 0)
  testEq('L.compose.length', 0)
  testEq('L.defaults.length', 1)
  testEq('L.define.length', 1)
  testEq('L.filter.length', 1)
  testEq('L.find.length', 1)
  testEq('L.findWith.length', 0)
  testEq('L.get.length', 2)
  testEq('L.getInverse.length', 2)
  testEq('L.index.length', 1)
  testEq('L.inverse.length', 1)
  testEq('L.iso.length', 2)
  testEq('L.lazy.length', 1)
  testEq('L.lens.length', 2)
  testEq('L.modify.length', 3)
  testEq('L.normalize.length', 1)
  testEq('L.orElse.length', 2)
  testEq('L.pick.length', 1)
  testEq('L.prop.length', 1)
  testEq('L.props.length', 0)
  testEq('L.remove.length', 2)
  testEq('L.replace.length', 2)
  testEq('L.required.length', 1)
  testEq('L.rewrite.length', 1)
  testEq('L.set.length', 3)
  testEq('L.to.length', 1)
  testEq('L.valueOr.length', 1)
  testEq('L.when.length', 1)
})

describe('L.find', () => {
  testEq('L.set(L.find(R.equals(2)), undefined, [2])', undefined)
  testEq('L.set(L.find(R.equals(2)))(undefined, [1, 2, 3])', [1, 3])
  testEq('L.set(L.find(R.equals(2)))(4)([1, 2, 3])', [1, 4, 3])
  testEq('L.set(L.find(R.equals(2)), 2)([1, 4, 3])', [1, 4, 3, 2])
  testEq('L.set(L.find(R.equals(2)), 2, undefined)', [2])
  testEq('L.set(L.find(R.equals(2)), 2, [])', [2])
  testEq('L.get(L.find(R.equals(2)), undefined)', undefined)
  testEq('L.get(L.find(R.equals(2)), [3])', undefined)
})

describe('L.get', () => {
  testEq('L.get([], [[{x: {y: 101}}]])', [[{x: {y: 101}}]])
  testEq('L.get([0, L.findWith("x"), L.identity, "y", []], [[{x: {y: 101}}]])',
         101)
  testEq('L.get([0, L.findWith("x"), [L.identity, "y"]], [[{x: {y: 101}}]])',
         101)
  testEq(`L.get([[0, L.findWith("x")], [[L.identity], "y"]],
                [[{x: {y: 101}}]])`,
         101)
})

describe('L.index', () => {
  testEq('L.remove(1, "lol")', undefined)
  testEq('L.set(-11, 0, [])', undefined)
  testEq('L.set(-11, 0, [1])', [1])
  testEq('L.set(-1, 0, "lol")', undefined)
  testEq('L.modify(L.index(1), x => x + 1, [1, 2])', [1, 3])
  testEq('L.set([0], undefined, [null])', undefined)
  testEq('L.set([L.required([]), 0], undefined, [null])', [])
  testEq('L.set([1], 4, [1, 2, 3])', [1, 4, 3])
  testEq('L.set(2, 4, undefined)', [null, null, 4])
  testEq('L.set([2], 4, [1])', [1, null, 4])
  testEq('L.remove([0], [1, 2, 3])', [2, 3])
  testEq('L.set([1], undefined, [1, 2, 3])', [1, 3])
  testEq('L.set(2, undefined, [1, 2, 3])', [1, 2])
  testEq('L.set([5], undefined, [1, 2, 3])', [1, 2, 3])
  testEq('L.get(5, undefined)', undefined)
  testEq('L.get([5], [1, 2, 3])', undefined)
  testEq('L.set(1, "2", ["1", "2", "3"])', ["1", "2", "3"])
  empties.forEach(invalid => {
    testEq(`L.get(0, ${show(invalid)})`, undefined)
    testEq(`L.set(0, "f", ${show(invalid)})`, ["f"])
  })
  testEq('L.set(L.index(0), "Hello", "x, world!")', ["Hello"])
  testEq('L.remove(0, [])', undefined)
  testEq('L.remove(1, [])', undefined)
})

describe('L.prop', () => {
  testEq('Object.keys(L.set("y", 1, {x: 2, z: 3}))', ["x", "z", "y"])
  testEq('Object.keys(L.set("y", 1, {x: 2, y: 0, z: 3}))', ["x", "y", "z"])
  testEq('Object.keys(L.remove("y", {z: 2, y: 0, x: 3}))', ["z", "x"])
  testEq('L.modify("x", x => x + 1, {x: 1})', {x: 2})
  testEq('L.set([L.prop("x")], undefined, {x: 1})', undefined)
  testEq('L.set(["x", L.required(null)], undefined, {x: 1})', {x: null})
  testEq('L.set(["x", L.required(null)], 2, {x: 1})', {x: 2})
  testEq('L.remove("y", {x: 1, y: 2})', {x: 1})
  testEq('L.set(["y"], 3, {x: 1, y: 2})', {x: 1, y: 3})
  testEq('L.set("z", 3, {x: 1, y: 2})', {x: 1, y: 2, z: 3})
  testEq('L.set(["z"], 3, undefined)', {z: 3})
  testEq('L.get("z", undefined)', undefined)
  testEq('L.get(["z"], {x: 1})', undefined)
  empties.forEach(invalid => {
    testEq(`L.get("x", ${show(invalid)})`, undefined)
    testEq(`L.set("ex", true, ${show(invalid)})`, {ex: true})
  })
  testEq('L.remove("x", {})', undefined)
})

describe("L.replace", () => {
  testEq('L.get(L.replace(undefined, ""), undefined)', "")
  testEq('L.get(L.replace(undefined, ""), "defined")', "defined")
  testEq('L.set(L.replace(undefined, ""), "", "anything")', undefined)
  testEq('L.set(L.replace(undefined, ""), "defined", "anything")', "defined")
})

describe("L.defaults", () => {
  testEq('L.get(L.defaults(""), undefined)', "")
  testEq('L.get(L.defaults(""), "defined")', "defined")
  testEq('L.set(L.defaults(""), "", "anything")', undefined)
  testEq('L.set(L.defaults(""), "defined", "anything")', "defined")
})

describe("L.define", () => {
  testEq('L.get(["related", L.define([])], {})', [])
  testEq('L.set(L.define([]), undefined, undefined)', [])
})

describe("L.valueOr", () => {
  for (const v of [0, false, true, "", [], {}]) {
    testEq(`L.get(L.valueOr(1), ${show(v)})`, v)
    testEq(`L.set(L.valueOr(1), 1, ${show(v)})`, 1)
  }
  for (const v of [null, undefined]) {
    testEq(`L.get(L.valueOr(1), ${show(v)})`, 1)
    testEq(`L.set(L.valueOr(1), 1, ${show(v)})`, 1)
  }
})

describe("L.normalize", () => {
  testEq('L.get(L.normalize(R.sortBy(R.identity)), [1,3,2,5])', [1,2,3,5])
  testEq(`L.set([L.normalize(R.sortBy(R.identity)), L.find(R.equals(2))],
                4,
                [1,3,2,5])`,
         [1,3,4,5])
  testEq(`L.set([L.normalize(R.sortBy(R.identity)), L.find(R.equals(2))],
                4,
                undefined)`,
         [4])
  testEq(`L.remove([L.normalize(R.sortBy(R.identity)), L.find(R.equals(2))],
                   [2])`,
         undefined)
  testEq(`L.set([L.normalize(R.sortBy(R.identity)), L.find(R.equals(2))],
                undefined,
                [1,3,2,5])`,
         [1,3,5])
})

describe("L.rewrite", () => {
  testEq('L.get(L.rewrite(x => x-1), 1)', 1)
  testEq('L.get(L.rewrite(x => x-1), undefined)', undefined)
  testEq('L.set(L.rewrite(x => x-1), undefined, 1)', undefined)
  testEq('L.set(L.rewrite(x => x-1), 3, 1)', 2)
})

describe("L.zero", () => {
  testEq('L.get(L.zero, "anything")', undefined)
  testEq('L.get([L.zero, L.valueOr("whatever")], "anything")', "whatever")
  testEq('L.set(L.zero, "anything", "original")', "original")
  testEq('L.collect([L.sequence, L.zero], [1,3])', [])
  testEq('L.remove([L.sequence, L.zero], [1,2])', [1,2])
})

describe("L.to", () => {
  testEq('L.get([0, "x", L.to(R.negate)], [{x:-1}])', 1)
  testEq('L.set([0, "x", L.to(R.negate)], 2, [{x:-1}])', [{x:-1}])
})

describe("L.just", () => {
  testEq('L.get(L.just("always"), "anything")', "always")
  testEq('L.set(L.just("always"), "anything", "original")', "original")
})

describe("L.chain", () => {
  testEq(`L.get(L.chain(elems => R.is(Array, elems) ? 0 : L.identity, "elems"),
                {elems: ["x"]})`,
         "x")
  testEq(`L.set(L.chain(elems => R.is(Array, elems) ? 0 : L.identity, "elems"),
                "y",
                {elems: ["x"]})`,
         {elems: ["y"]})
  testEq(`L.get(L.chain(elems => R.is(Array, elems) ? 0 : L.identity, "elems"),
                {notit: true})`,
         undefined)
  testEq(`L.set(L.chain(elems => R.is(Array, elems) ? 0 : L.identity, "elems"),
                false,
                {notit: true})`,
         {notit: true})
})

describe("L.orElse", () => {
  testEq('L.get(L.orElse("b", "a"), {a: 2, b: 1})', 2)
  testEq('L.get(L.orElse("b", "a"), {b: 2})', 2)
  testEq('L.set(L.orElse("b", "a"), 3, {a: 2, b: 1})', {a: 3, b: 1})
  testEq('L.set(L.orElse("b", "a"), 3, {b: 2})', {b: 3})
})

describe("L.choice", () => {
  testEq('L.get(L.choice("x", "y"), {x: "a"})', "a")
  testEq('L.get(L.choice("x", "y"), {y: "b"})', "b")
  testEq('L.get(L.choice("x", "y"), {z: "c"})', undefined)
  testEq('L.set(L.choice("x", "y"), "A", {x: "a"})', {x: "A"})
  testEq('L.set(L.choice("x", "y"), "B", {y: "b"})', {y: "B"})
  testEq('L.set(L.choice("x", "y"), "C", {z: "c"})', {z: "c"})
})

describe("L.findWith", () => {
  testEq('L.get(L.findWith("x", 1), [{x: ["a"]},{x: ["b","c"]}])', "c")
  testEq('L.set(L.findWith("x", 1), "d", [{x: ["a"]},{x: ["b","c"]}])',
         [{x: ["a"]},{x: ["b","d"]}])
  testEq('L.remove(L.findWith("x", 1), [{x: ["a"]},{x: ["b","c"]}])',
         [{x: ["a"]},{x: ["b"]}])
})

describe("L.filter", () => {
  testEq('L.get(L.filter(R.lt(9)), [3,1,4,1,5,9,2])', [])
  testEq('L.get(L.filter(R.lt(2)), undefined)', undefined)
  testEq('L.get(L.filter(R.lt(2)), [3,1,4,1,5,9,2])', [3,4,5,9])
  testEq('L.remove([L.filter(R.lt(2)), 1], [3,1,4,1,5,9,2])', [3,5,9,1,1,2])
  testEq('L.set(L.filter(R.lt(0)), [], [3,1,4,1,5,9,2])', undefined)
  testEq('L.remove(L.filter(R.lt(0)), [3,1,4,1,5,9,2])', undefined)
  testEq('L.remove(L.filter(R.lt(2)), [3,1,4,1,5,9,2])', [1,1,2])
  empties.filter(x => !(x instanceof Array)).forEach(invalid => {
    testEq(`L.get(L.filter(R.always(true)), ${show(invalid)})`, undefined)
    testEq(`L.set(L.filter(R.always(true)), [1,"2",3], ${show(invalid)})`,
           [1,"2",3])
  })
})

describe("L.append", () => {
  testEq('L.remove(L.append, "anything")', undefined)
  empties.forEach(invalid => {
    testEq(`L.set(L.append, "a", ${show(invalid)})`, ["a"])
  })
})

describe("L.augment", () => {
  testEq('L.get(L.augment({y: c => c.x+1, z: c => c.x-1}), {x: 0})',
         {x: 0, y: 1, z: -1})
  testEq('L.get(L.augment({y: c => c.x+1}), {x: 2, y: -1})', {x: 2, y: 3})
  testEq('L.set(L.augment({y: c => c.x+1}), {x: 1, y: 1}, {x: 0})', {x: 1})
  testEq('L.set(L.augment({y: c => c.x+1}), {x: 2, y: 1}, {x: 0, y: -1})',
         {x: 2, y: -1})
  testEq('L.get(L.augment({y: c => c.x+1, z: c => c.y+1}), {x: 1})',
         {x: 1, y: 2, z: 3})
  testEq('L.remove([L.augment({y: () => 1}), "x"], {x:0})', undefined)
  testEq('L.remove(L.augment({z: c => c.x + c.y}), {x: 1, y: 2})', undefined)
  empties.filter(x => !R.equals(x, {})).forEach(invalid => {
    testEq(`L.get(L.augment({x: () => 1}), ${show(invalid)})`, undefined)
  })
  empties.forEach(invalid => {
    testEq(`L.set(L.augment({x: () => 1}), {y: 2}, ${show(invalid)})`, {y: 2})
  })
})

describe("L.sequence", () => {
  testEq('L.modify(L.sequence, R.negate, [])', undefined)
  testEq(`L.modify(["xs", L.sequence, "x", L.sequence],
                   R.add(1),
                   {xs: [{x: [1]}, {x: [2,3,4]}]})`,
         {xs: [{x: [2]}, {x: [3,4,5]}]})
  testEq(`L.set(["xs", L.sequence, "x", L.sequence],
                101,
                {xs: [{x: [1]}, {x: [2,3,4]}]})`,
         {xs: [{x: [101]}, {x: [101,101,101]}]})
  testEq(`L.remove(["xs", L.sequence, "x", L.sequence],
                   {ys: "hip", xs: [{x: [1]}, {x: [2,3,4]}]})`,
         {ys: "hip"})
  testEq(`L.modify(["xs", L.sequence, "x"],
                   x => x < 2 ? undefined : x,
                   {xs: [{x:3},{x:1},{x:4},{x:1,y:0},{x:5},{x:9},{x:2}]})`,
         {xs:[{x:3},{x:4},{y:0},{x:5},{x:9},{x:2}]})
  testEq(`L.modify([L.sequence, ["x", L.sequence]],
                   R.add(1),
                   [{x: [1]}, {}, {x: []}, {x: [2, 3]}])`,
         [{x: [2]}, {x: [3, 4]}])
  testEq(`L.modify([[L.sequence, "x"], L.sequence],
                   R.add(1),
                   [{x: [1]}, {y: "keep"}, {x: [], z: "these"}, {x: [2, 3]}])`,
         [{x: [2]}, {y: "keep"}, {z: "these"}, {x: [3, 4]}])
  testEq('L.modify(L.sequence, R.negate, {x: 11, y: 22})', {x: -11, y: -22})
  testEq(`L.remove([L.sequence, L.when(x => 11 < x && x < 33)],
                   {x: 11, y: 22, z: 33})`,
         {x: 11, z: 33})
  testEq('L.remove(L.sequence, {x: 11, y: 22, z: 33})', undefined)
  testEq('L.modify(L.sequence, R.inc, {})', undefined)
  testEq('L.modify(L.sequence, R.inc, null)', null)
})

describe("L.optional", () => {
  testEq('L.collect(L.optional, undefined)', [])
  testEq('L.collect(L.optional, 0)', [ 0 ])
  testEq('L.collect([L.sequence, L.sequence], [[0, null], [false, NaN]])',
         [0, null, false, NaN])
  testEq(`L.collect([L.sequence, "x", L.optional],
                    [{x: 1}, {y: 2}, {x: 3, z: 1}])`,
         [1, 3])
  testEq(`L.modify([L.sequence, "x", L.optional],
                   R.add(1),
                   [{x: 1}, {y: 2}, {x: 3, z: 1}])`,
         [{x: 2}, {y: 2}, {x: 4, z: 1}])
  testEq(`L.collect([L.sequence, "x", L.optional, L.sequence],
                    [{x: [1, 2]}, {y: 2}, {x: [3], z: 1}])`,
         [1, 2, 3])
  testEq(`L.modify([L.sequence, "x", L.optional, L.sequence],
                   x => x < 2 ? undefined : x-1,
                   [{x: [1, 2]}, {y: 2}, {x: [3], z: 1}])`,
         [{x: [1]}, {y: 2}, {x: [2], z: 1}])
})

describe("L.when", () => {
  testEq('L.get(L.when(x => x > 2), 1)', undefined)
  testEq('L.get([L.when(x => x > 2), L.just(2)], 1)', 2)
  testEq('L.get(L.when(x => x > 2), 3)', 3)
  testEq('L.collect([L.sequence, L.when(x => x > 2)], [1,3,2,4])', [3,4])
  testEq('L.modify([L.sequence, L.when(x => x > 2)], R.negate, [1,3,2,4])',
         [1,-3,2,-4])
})

describe("L.collect", () => {
  testEq(`L.collect(["xs", L.sequence, "x", L.sequence],
                    {xs: [{x:[3,1]},{x:[4,1]},{x:[5,9,2]}]})`,
         [3,1,4,1,5,9,2])
  testEq(`L.collect([L.sequence, "x", L.sequence],
                    [{x: [1]}, {}, {x: []}, {x: [2, 3]}])`,
         [1, 2, 3])
  testEq('L.collect(L.sequence, [])', [])
  testEq('L.collect("x", {x: 101})', [101])
  testEq('L.collect("y", {x: 101})', [])
  testEq(`L.collect(["a", L.sequence, "b", L.sequence, "c", L.sequence],
                    {a:[{b:[]},{b:[{c:[1]}]},{b:[]},{b:[{c:[2]}]}]})`,
         [1,2])
  testEq('X.collect(X.sequence, a100000).length', 100000)
})

describe("L.collectMap", () => {
  testEq('L.collectMap(L.sequence, R.negate, [1,2,3])', [-1,-2,-3])
  testEq('L.collectMap(L.sequence, x => x < 0 ? undefined : x+1, [0,-1,2,-3])',
         [1, 3])
})

export const Sum = {empty: () => 0, concat: (x, y) => x + y}

describe("L.foldMapOf", () => {
  testEq('L.foldMapOf(Sum, L.sequence, x => x+1, null)', 0)
  testEq('L.foldMapOf(Sum, [L.sequence], x => x+1, [])', 0)
  testEq('L.foldMapOf(Sum, L.sequence, x => x+1, [1, 2, 3])', 9)
  testEq(`L.foldMapOf(Sum,
                      [L.sequence, "x", L.optional],
                      x => x+1,
                      [{x:1}, {y:2}, {x:3}])`,
         6)
})

describe("folds", () => {
  testEq(`X.foldOf(Sum, X.sequence, a100000)`, 100000)
  testEq(`L.sumOf([L.sequence, "x"], undefined)`, 0)
  testEq(`L.productOf([L.sequence, "x"], undefined)`, 1)
  testEq(`L.sumOf([L.sequence, "x"], [{x:-2},{y:1},{x:-3}])`, -5)
  testEq(`L.productOf([L.sequence, "x"], [{x:-2},{y:1},{x:-3}])`, 6)
  testEq(`L.foldrOf([L.sequence, L.sequence], (x,y) => [x,y], 0, [])`, 0)
  testEq(`L.foldlOf([L.sequence, L.sequence], (x,y) => [x,y], 0, [])`, 0)
  testEq(`L.foldrOf([L.sequence, L.sequence], (x,y) => [x,y], 0, [[1,2],[3]])`,
         [[[0,3],2],1])
  testEq(`L.foldlOf([L.sequence, L.sequence], (x,y) => [x,y], 0, [[1,2],[3]])`,
         [[[0,1],2],3])
  ;['foldlOf', 'foldrOf'].forEach(fold => {
    testEq(`X.${fold}(X.sequence, (x,y) => x+y, 0, a100000)`,
           100000)
  })
})

describe("L.pick", () => {
  testEq('L.get(L.pick({x: "c"}), {a: [2], b: 1})', undefined)
  testEq('L.set([L.pick({x: "c"}), "x"], 4, {a: [2], b: 1})',
         {a: [2], b: 1, c: 4})
  testEq('L.get(L.pick({x: "b", y: "a"}), {a: [2], b: 1})', {x: 1, y: [2]})
  testEq('L.set([L.pick({x: "b", y: "a"}), "x"], 3, {a: [2], b: 1})',
         {a: [2], b: 3})
  testEq('L.remove([L.pick({x: "b", y: "a"}), "y"], {a: [2], b: 1})', {b: 1})
  testEq('L.remove([L.pick({x: "b"}), "x"], {a: [2], b: 1})', {a: [2]})
  testEq('L.get(L.pick({x: 0, y: 1}), ["a", "b"])', {x: "a", y: "b"})
})

describe("L.props", () => {
  testEq('L.get(L.props("x", "y"), {x: 1, y: 2, z: 3})', {x: 1, y: 2})
  testEq('L.get(L.props("x", "y"), {z: 3})', undefined)
  testEq('L.get(L.props("x", "y"), {x: 2, z: 3})', {x: 2})
  testEq('L.remove(L.props("x", "y"), {x: 1, y: 2, z: 3})', {z: 3})
  testEq('L.set(L.props("x", "y"), {}, {x: 1, y: 2, z: 3})', {z: 3})
  testEq('L.set(L.props("x", "y"), {y: 4}, {x: 1, y: 2, z: 3})', {y: 4, z: 3})
  testEq('L.remove(L.props("x", "y"), {x: 1, y: 2})', undefined)
  testEq('L.set(L.props("a", "b"), {a: 2}, {a: 1, b: 3})', {a: 2})
  testEq('L.set(L.props("length"), "lol", undefined)', undefined)
})

export const numeric = f => x => x !== undefined ? f(x) : undefined
export const offBy1 = L.iso(numeric(R.inc), numeric(R.dec))

describe("L.getInverse", () => {
  testEq('L.getInverse(offBy1, undefined)', undefined)
  testEq('L.getInverse(offBy1, 1)', 0)
})

export const flatten = L.lazy(rec => {
  const nest = [L.sequence, rec]
  return L.choose(x => R.is(Array, x) ? nest : L.identity)
})

describe("L.lazy", () => {
  testEq('L.collect(flatten, [[[1], 2], 3, [4, [[5]], [6]]])',
         [1, 2, 3, 4, 5, 6])
  testEq('L.modify(flatten, x => x+1, [[[1], 2], 3, [4, [[5]], [6]]])',
         [[[2], 3], 4, [5, [[6]], [7]]])
  testEq(`L.modify(flatten,
                   x => 3 <= x && x <= 5 ? undefined : x,
                   [[[1], 2], 3, [4, [[5]], [6]]])`,
         [[[1], 2], [[6]]])
})

describe("L.inverse", () => {
  testEq('L.get(L.inverse(offBy1), undefined)', undefined)
  testEq('L.get(L.inverse(offBy1), 1)', 0)
  testEq('L.getInverse(L.inverse(offBy1), 0)', 1)
  testEq('L.remove(["x", L.inverse(offBy1)], {x:1})', undefined)
})

describe("L.branch", () => {
  testEq('L.modify(L.branch({}), x => x+1, null)', null)
  testEq('L.modify(L.branch({}), x => x+1, "anything")', "anything")
  testEq(`L.modify(L.branch({a: "x", b: [], c: 0, d: L.identity}),
                   x => x+1,
                   {a:{x:1},b:2,c:[3],d:4,extra:"one"})`,
         {"a":{"x":2},"b":3,"c":[4],"d":5,extra:"one"})
  testEq('L.set(L.branch({a: ["x",0], b: []}), 0, null)', {a:{x:[0]},b:0})
})

describe("indexing", () => {
  testEq('L.modify(L.identity, (x, i) => [typeof x, typeof i], 0)',
         ["number", "undefined"])
  testEq('L.modify(["x", 0], (x, i) => [x, i], {x: ["y"]})', {x: [["y", 0]]})
  testEq('L.modify(["x", L.required([])], (x, i) => [x, i], {x: ["y"]})',
         {x: [["y"], "x"]})
  testEq('L.modify(L.sequence, (x, i) => i & 1 ? -x : x, [1,2,3,4])',
         [1,-2,3,-4])
  testEq('L.modify([L.sequence, L.when((_, i) => i & 1)], x => -x, [1,2,3,4])',
         [1,-2,3,-4])
  testEq('L.collectMap(L.sequence, (x, i) => [x, i], ["a", "b"])',
         [["a", 0], ["b", 1]])
  testEq('L.collectMap(L.sequence, (x, i) => [x, i], {x: 101, y: 42})',
         [[101, "x"], [42, "y"]])
})

describe("L.toFunction", () => {
  testEq("typeof L.toFunction(1)", "function")
  testEq("typeof L.toFunction('x')", "function")
  testEq("typeof L.toFunction(L.find(R.identity))", "function")
})

if (process.env.NODE_ENV !== "production") {
  describe("debug", () => {
    testThrows('L.index("x")')
    testThrows('L.index(-1)')
    testThrows('L.index()')

    testThrows('L.prop(2)')
    testThrows('L.prop(x => x)')
    testThrows('L.prop()')

    testThrows('L.get(L.sequence, [])')

    testThrows('L.get(x => x, 0)')
  })
}

describe("BST", () => {
  const randomInt = (min, max) =>
    Math.floor(Math.random() * (max - min)) + min
  const randomPick = (...choices) =>
    choices[randomInt(0, choices.length)]

  it("maintains validity through operations", () => {
    let before
    let after
    let op
    let key

    const error = () => {
      throw new Error("From " + show(before) +
                      " " + op + " with " + key +
                      " gave " + show(after))
    }

    for (let i=0; i<1000; ++i) {
      key = randomInt(0, 10)
      op = randomPick("set", "delete")

      switch (op) {
        case "set":
          after = L.set(BST.valueOf(key), key, before)
          if (undefined === L.get(BST.valueOf(key), after))
            error()
          break
        case "delete":
          after = L.remove(BST.valueOf(key), before)
          if (undefined !== L.get(BST.valueOf(key), after))
            error()
          break
      }

      if (!BST.isValid(after))
        error()

      before = after
    }
  })

  testEq(`I.seq([["m", 1], ["a", 2], ["g", 3], ["i", 4], ["c", 5]],
                BST.fromPairs,
                L.modify(BST.values, x => -x))`,
         I.seq([["m",-1], ["a",-2], ["g",-3], ["i",-4], ["c",-5]],
               BST.fromPairs))
})
