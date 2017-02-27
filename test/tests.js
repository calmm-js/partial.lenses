import * as I from "infestines"
import * as R from "ramda"
import {id} from "infestines"

import * as L from "../src/partial.lenses"

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

function XYZ(x,y,z) {
  this.x = x
  this.y = y
  this.z = z
}
XYZ.prototype.norm = function () {
  return this.x*this.x + this.y*this.y + this.z*this.z
}

const a100000 = Array(100000).fill(1)

const run = expr =>
  eval(`(L, X, R, id, I, C, T, a100000) => ${expr}`)(
         L, L, R, id, I, C, T, a100000)

const equals = (x, y) =>
  (x && Object.getPrototypeOf(x)) === (y && Object.getPrototypeOf(y)) &&
  R.equals(x, y)

function testEq(exprIn, expect) {
  const expr = exprIn.replace(/[ \n]+/g, " ")
  it(`${expr} => ${show(expect)}`, () => {
    const actual = run(expr)
    if (!equals(actual, expect))
      throw new Error(`Expected: ${show(expect)}, actual: ${show(actual)}`)

    const exprTy = expr.replace(/\bL\.([a-zA-Z0-9]*)/g, "T.$1(L.$1)")
    const typed = run(exprTy)
    if (!equals(actual, typed))
      throw new Error(`Typed: ${show(typed)}, actual: ${show(actual)}`)

    const core = run(exprTy.replace(/\bL\./g, "C."))
    if (!equals(actual, core))
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

const empties = [undefined, null, false, true, "", 0, 0.0/0.0, {}, []]

describe("L.log", () => {
  testEq('L.set(L.log("label"), "out", "in")', "out")
})

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
  testEq('L.append.length', 4)
  testEq('L.augment.length', 1)
  testEq('L.branch.length', 1)
  testEq('L.chain.length', 2)
  testEq('L.choice.length', 0)
  testEq('L.choose.length', 1)
  testEq('L.collect.length', 2)
  testEq('L.collectAs.length', 3)
  testEq('L.compose.length', 0)
  testEq('L.concat.length', 3)
  testEq('L.concatAs.length', 4)
  testEq('L.defaults.length', 1)
  testEq('L.define.length', 1)
  testEq('L.elems.length', 4)
  testEq('L.filter.length', 1)
  testEq('L.find.length', 1)
  testEq('L.findWith.length', 0)
  testEq('L.foldl.length', 4)
  testEq('L.foldr.length', 4)
  testEq('L.get.length', 2)
  testEq('L.getInverse.length', 2)
  testEq('L.identity.length', 4)
  testEq('L.index.length', 1)
  testEq('L.inverse.length', 1)
  testEq('L.iso.length', 2)
  testEq('L.just.length', 1)
  testEq('L.lazy.length', 1)
  testEq('L.lens.length', 2)
  testEq('L.log.length', 0)
  testEq('L.maximum.length', 2)
  testEq('L.merge.length', 3)
  testEq('L.mergeAs.length', 4)
  testEq('L.minimum.length', 2)
  testEq('L.modify.length', 3)
  testEq('L.normalize.length', 1)
  testEq('L.optional.length', 4)
  testEq('L.orElse.length', 2)
  testEq('L.pick.length', 1)
  testEq('L.product.length', 2)
  testEq('L.prop.length', 1)
  testEq('L.props.length', 0)
  testEq('L.removable.length', 0)
  testEq('L.remove.length', 2)
  testEq('L.replace.length', 2)
  testEq('L.required.length', 1)
  testEq('L.rewrite.length', 1)
  testEq('L.seq.length', 0)
  testEq('L.set.length', 3)
  testEq('L.slice.length', 2)
  testEq('L.sum.length', 2)
  testEq('L.to.length', 1)
  testEq('L.toFunction.length', 1)
  testEq('L.valueOr.length', 1)
  testEq('L.values.length', 4)
  testEq('L.when.length', 1)
  testEq('L.zero.length', 4)
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
  testEq(`L.remove([L.rewrite(R.join("")), L.find(R.equals("A"))], "LOLA")`,
         "LOL")
  testEq(`L.set([L.rewrite(R.join("")), L.find(R.equals("O"))], "A-", "LOLA")`,
         "LA-LA")
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
  testEq('L.remove([L.rewrite(R.join("")), 1], "lol")', "ll")
  testEq('L.modify(L.index(1), x => x + 1, [1, 2])', [1, 3])
  testEq('L.set([0], undefined, [null])', undefined)
  testEq('L.set([L.required([]), 0], undefined, [null])', [])
  testEq('L.set([1], 4, [1, 2, 3])', [1, 4, 3])
  testEq('L.set(2, 4, undefined)', [undefined, undefined, 4])
  testEq('L.set([2], 4, [1])', [1, undefined, 4])
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
  testEq('L.set([L.rewrite(R.join("")), L.index(0)], "Hello", "x, world!")',
         "Hello, world!")
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
  testEq('L.collect([L.elems, L.zero], [1,3])', [])
  testEq('L.remove([L.elems, L.zero], [1,2])', [1,2])
})

describe("L.to", () => {
  testEq('L.get(L.to(x => x+1), 2)', 3)
  testEq('L.get(x => x+1, 2)', 3)
  testEq('L.modify(R.inc, R.negate, 1)', 1)
  testEq('L.get(["x", (x,i) => [x, i]], {x:-1})', [-1, "x"])
  testEq('L.collect([L.elems, (x,i) => [x, i]], ["x","y"])', [["x", 0], ["y", 1]])
  testEq('L.collect([L.values, (x,i) => [x, i]], {x:1, y:-1})', [[1, "x"], [-1, "y"]])
  testEq('L.get([0, (x,i) => [x, i]], [-1])', [-1, 0])
  testEq('L.get([0, "x", R.negate], [{x:-1}])', 1)
  testEq('L.set([0, "x", R.negate], 2, [{x:-1}])', [{x:-1}])
})

describe("L.just", () => {
  testEq('L.get(L.just("always"), "anything")', "always")
  testEq('L.get(R.always("always"), "anything")', "always")
  testEq('L.set(R.always("always"), "anything", "original")', "original")
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
  empties.filter(x => !(x instanceof Array || typeof x === "string")).forEach(invalid => {
    testEq(`L.get(L.filter(R.always(true)), ${show(invalid)})`, undefined)
    testEq(`L.set(L.filter(R.always(true)), [1,"2",3], ${show(invalid)})`,
           [1,"2",3])
  })
  testEq('L.remove(L.filter(c => "a" <= c), "JavaScript")', ["J", "S"])
})

describe("L.slice", () => {
  testEq(`L.get(L.slice(undefined, undefined), undefined)`, undefined)
  testEq(`L.get(L.slice(undefined, undefined), 45)`, undefined)
  testEq(`L.get(L.slice(undefined, undefined), [])`, [])
  testEq(`L.get(L.slice(undefined, undefined), "")`, [])
  testEq(`L.set(L.slice(undefined, undefined), [], [101])`, undefined)
  testEq(`L.set(L.slice(undefined, undefined), undefined, [101])`, undefined)
  testEq(`L.get(L.slice(4, 1), "abcde")`, [])
  testEq(`L.set([L.rewrite(R.join("")), L.slice(4, 1)], "xyz", "abcde")`,
         "abcdxyze")
  testEq(`L.set(L.slice(undefined, undefined), "abba", 45)`, ["a","b","b","a"])
  testEq(`L.set([L.rewrite(R.join("")), L.slice(-1, -1)], "world", "Hello, !")`,
         "Hello, world!")
  testEq(`L.modify([L.slice(1,-1), L.elems], R.negate, [1,-2,-3,4])`, [1,2,3,4])
  testEq(`L.modify([L.slice(-3,3), L.elems], R.negate, [1,-2,-3,4])`, [1,2,3,4])
})

describe("L.append", () => {
  testEq('L.remove(L.append, 45)', undefined)
  testEq('L.remove([L.rewrite(R.join("")), L.append], "anything")', "anything")
  empties.forEach(invalid => {
    testEq(`L.set(L.append, "a", ${show(invalid)})`, ["a"])
  })
  testEq('L.set(L.append, 1, Int8Array.of(3,1,4))', [3,1,4,1])
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
  testEq('L.set(L.augment({z: c => c.x + c.y}), new XYZ(3,2,1), {x: 1, y: 2})',
         {x: 3, y: 2})
  testEq('L.set(L.augment({x: () => 1}), {constructor: 1}, {})', {constructor: 1})
  testEq('L.set([L.augment({constructor: () => 1}), "x"], 2, {x: 1})', {x: 2})
  empties.filter(x => !R.contains(x, {})).forEach(invalid => {
    testEq(`L.get(L.augment({x: () => 1}), ${show(invalid)})`, undefined)
  })
  empties.forEach(invalid => {
    testEq(`L.set(L.augment({x: () => 1}), {y: 2}, ${show(invalid)})`, {y: 2})
  })
})

describe("L.elems", () => {
  testEq('L.modify(L.elems, R.negate, [])', undefined)
  testEq(`L.modify(["xs", L.elems, "x", L.elems],
                   R.add(1),
                   {xs: [{x: [1]}, {x: [2,3,4]}]})`,
         {xs: [{x: [2]}, {x: [3,4,5]}]})
  testEq(`L.set(["xs", L.elems, "x", L.elems],
                101,
                {xs: [{x: [1]}, {x: [2,3,4]}]})`,
         {xs: [{x: [101]}, {x: [101,101,101]}]})
  testEq(`L.remove(["xs", L.elems, "x", L.elems],
                   {ys: "hip", xs: [{x: [1]}, {x: [2,3,4]}]})`,
         {ys: "hip"})
  testEq(`L.modify(["xs", L.elems, "x"],
                   x => x < 2 ? undefined : x,
                   {xs: [{x:3},{x:1},{x:4},{x:1,y:0},{x:5},{x:9},{x:2}]})`,
         {xs:[{x:3},{x:4},{y:0},{x:5},{x:9},{x:2}]})
  testEq(`L.modify([L.elems, ["x", L.elems]],
                   R.add(1),
                   [{x: [1]}, {}, {x: []}, {x: [2, 3]}])`,
         [{x: [2]}, {x: [3, 4]}])
  testEq(`L.modify([[L.elems, "x"], L.elems],
                   R.add(1),
                   [{x: [1]}, {y: "keep"}, {x: [], z: "these"}, {x: [2, 3]}])`,
         [{x: [2]}, {y: "keep"}, {z: "these"}, {x: [3, 4]}])
})

describe("L.values", () => {
  testEq('L.modify(L.values, R.negate, {x: 11, y: 22})', {x: -11, y: -22})
  testEq(`L.remove([L.values, L.when(x => 11 < x && x < 33)],
                   {x: 11, y: 22, z: 33})`,
         {x: 11, z: 33})
  testEq('L.remove(L.values, {x: 11, y: 22, z: 33})', undefined)
  testEq('L.modify(L.values, R.inc, {})', undefined)
  testEq('L.modify(L.values, R.inc, null)', null)
  testEq('L.modify(L.values, R.inc, new XYZ(3,1,4))', {x: 4, y: 2, z: 5})
})

describe("L.optional", () => {
  testEq('L.collect(L.optional, undefined)', [])
  testEq('L.collect(L.optional, 0)', [ 0 ])
  testEq('L.collect([L.elems, L.elems], [[0, null], [false, NaN]])',
         [0, null, false, NaN])
  testEq(`L.collect([L.elems, "x", L.optional],
                    [{x: 1}, {y: 2}, {x: 3, z: 1}])`,
         [1, 3])
  testEq(`L.modify([L.elems, "x", L.optional],
                   R.add(1),
                   [{x: 1}, {y: 2}, {x: 3, z: 1}])`,
         [{x: 2}, {y: 2}, {x: 4, z: 1}])
  testEq(`L.collect([L.elems, "x", L.optional, L.elems],
                    [{x: [1, 2]}, {y: 2}, {x: [3], z: 1}])`,
         [1, 2, 3])
  testEq(`L.modify([L.elems, "x", L.optional, L.elems],
                   x => x < 2 ? undefined : x-1,
                   [{x: [1, 2]}, {y: 2}, {x: [3], z: 1}])`,
         [{x: [1]}, {y: 2}, {x: [2], z: 1}])
})

describe("L.when", () => {
  testEq('L.get(L.when(x => x > 2), 1)', undefined)
  testEq('L.get([L.when(x => x > 2), L.just(2)], 1)', 2)
  testEq('L.get(L.when(x => x > 2), 3)', 3)
  testEq('L.collect([L.elems, L.when(x => x > 2)], [1,3,2,4])', [3,4])
  testEq('L.modify([L.elems, L.when(x => x > 2)], R.negate, [1,3,2,4])',
         [1,-3,2,-4])
})

describe("L.collect", () => {
  testEq(`L.collect(["xs", L.elems, "x", L.elems],
                    {xs: [{x:[3,1]},{x:[4,1]},{x:[5,9,2]}]})`,
         [3,1,4,1,5,9,2])
  testEq(`L.collect([L.elems, "x", L.elems],
                    [{x: [1]}, {}, {x: []}, {x: [2, 3]}])`,
         [1, 2, 3])
  testEq('L.collect(L.elems, [])', [])
  testEq('L.collect("x", {x: 101})', [101])
  testEq('L.collect("y", {x: 101})', [])
  testEq(`L.collect(["a", L.elems, "b", L.elems, "c", L.elems],
                    {a:[{b:[]},{b:[{c:[1]}]},{b:[]},{b:[{c:[2]}]}]})`,
         [1,2])
  testEq('X.collect(X.elems, a100000).length', 100000)
})

describe("L.collectAs", () => {
  testEq('L.collectAs(R.negate, L.elems, [1,2,3])', [-1,-2,-3])
  testEq('L.collectAs(x => x < 0 ? undefined : x+1, L.elems, [0,-1,2,-3])',
         [1, 3])
})

export const Sum = {empty: () => 0, concat: (x, y) => x + y}

describe("L.concatAs", () => {
  testEq('L.concatAs(x => x+1, Sum, L.elems, null)', 0)
  testEq('L.concatAs(x => x+1, Sum, [L.elems], [])', 0)
  testEq('L.concatAs(x => x+1, Sum, L.elems, [1, 2, 3])', 9)
  testEq(`L.concatAs(x => x+1,
                     Sum,
                     [L.elems, "x", L.optional],
                     [{x:1}, {y:2}, {x:3}])`,
         6)
})

describe("folds", () => {
  testEq(`X.concat(Sum, X.elems, a100000)`, 100000)
  testEq(`X.concatAs(id, Sum, X.elems, a100000)`, 100000)
  testEq(`X.merge(Sum, X.elems, a100000)`, 100000)
  testEq(`X.mergeAs(id, Sum, X.elems, a100000)`, 100000)
  testEq(`L.maximum([L.elems, "x"], [])`, undefined)
  testEq(`L.minimum([L.elems, "x"], [])`, undefined)
  testEq(`L.maximum(L.elems, "JavaScript")`, "v")
  testEq(`L.maximum(L.elems, [1,2,3])`, 3)
  testEq(`L.minimum(L.elems, [1,2,3])`, 1)
  testEq(`L.sum([L.elems, "x"], undefined)`, 0)
  testEq(`L.product([L.elems, "x"], undefined)`, 1)
  testEq(`L.sum([L.elems, "x"], [{x:-2},{y:1},{x:-3}])`, -5)
  testEq(`L.product([L.elems, "x"], [{x:-2},{y:1},{x:-3}])`, 6)
  testEq(`L.foldr((x,y) => [x,y], 0, [L.elems, L.elems], [])`, 0)
  testEq(`L.foldl((x,y) => [x,y], 0, [L.elems, L.elems], [])`, 0)
  testEq(`L.foldr((x,y) => [x,y], 0, [L.elems, L.elems], [[1,2],[3]])`,
         [[[0,3],2],1])
  testEq(`L.foldl((x,y) => [x,y], 0, [L.elems, L.elems], [[1,2],[3]])`,
         [[[0,1],2],3])
  ;['foldl', 'foldr'].forEach(fold => {
    testEq(`X.${fold}((x,y) => x+y, 0, X.elems, a100000)`,
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
})

export const numeric = f => x => x !== undefined ? f(x) : undefined
export const offBy1 = L.iso(numeric(R.inc), numeric(R.dec))

describe("L.getInverse", () => {
  testEq('L.getInverse(offBy1, undefined)', undefined)
  testEq('L.getInverse(offBy1, 1)', 0)
})

export const flatten = L.lazy(rec => {
  const nest = [L.elems, rec]
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
  testEq('L.modify(L.branch({}), x => x+1, {})', undefined)
  testEq('L.modify(L.branch({}), x => x+1, {x: 1})', {x: 1})
  testEq(`L.modify(L.branch({a: "x", b: [], c: 0, d: L.identity}),
                   x => x+1,
                   {a:{x:1},b:2,c:[3],d:4,extra:"one"})`,
         {"a":{"x":2},"b":3,"c":[4],"d":5,extra:"one"})
  testEq('L.set(L.branch({a: ["x",0], b: []}), 0, null)', {a:{x:[0]},b:0})
  testEq('L.modify(L.branch({y: L.identity}), R.inc, new XYZ(3,1,4))', {x: 3, y: 2, z: 4})
})

describe("removable", () => {
  testEq(`L.set(L.removable("x"), 42, "non object")`, 42)
  testEq(`L.get(L.removable("x"), {x: 1, y: 2})`, {x: 1, y: 2})
  testEq(`L.get([L.removable("y"), "y"], {x: 1, y: 2})`, 2)
  testEq(`L.set([L.removable("y"), "y"], 3, {x: 1, y: 2})`, {x: 1, y: 3})
  testEq(`L.set([L.removable("x"), "x"], undefined, {x: 1, y: 2})`, undefined)
})

describe("indexing", () => {
  testEq('L.modify(L.identity, (x, i) => [typeof x, typeof i], 0)',
         ["number", "undefined"])
  testEq('L.modify(["x", 0], (x, i) => [x, i], {x: ["y"]})', {x: [["y", 0]]})
  testEq('L.modify(["x", L.required([])], (x, i) => [x, i], {x: ["y"]})',
         {x: [["y"], "x"]})
  testEq('L.modify(L.elems, (x, i) => i & 1 ? -x : x, [1,2,3,4])',
         [1,-2,3,-4])
  testEq('L.modify([L.elems, L.when((_, i) => i & 1)], x => -x, [1,2,3,4])',
         [1,-2,3,-4])
  testEq('L.collectAs((x, i) => [x, i], L.elems, ["a", "b"])',
         [["a", 0], ["b", 1]])
  testEq('L.collectAs((x, i) => [x, i], L.values, {x: 101, y: 42})',
         [[101, "x"], [42, "y"]])
})

describe("L.toFunction", () => {
  testEq("typeof L.toFunction(1)", "function")
  testEq("typeof L.toFunction('x')", "function")
  testEq("typeof L.toFunction(L.find(R.identity))", "function")
})

if (process.env.NODE_ENV !== "production") {
  describe("debug", () => {
    testThrows('X.set(-1, 0, 0)')

    testThrows('X.index("x")')
    testThrows('X.index(-1)')
    testThrows('X.index()')

    testThrows('X.prop(2)')
    testThrows('X.prop(x => x)')
    testThrows('X.prop()')

    testThrows('X.get(L.elems, [])')

    testThrows('L.set(L.props("length"), "lol", undefined)')
    testThrows('L.set(L.slice(undefined, undefined), 11, [])')
    testThrows('L.pick(new XYZ(1,2,3))')
    testThrows('L.set(L.filter(undefined, undefined), {x: 11}, [])')
    testThrows('L.augment(new XYZ(1,2,3))')
    testThrows('L.set(L.augment({y: () => 1}), 45, {x: 1})')

    testThrows('L.set(null, 1, 2)')

    testThrows('L.toFunction((one, too, many) => 1)')

    testThrows(`L.get(L.seq(0), ["x"])`)
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

export const everywhere = [L.optional, L.lazy(rec => {
  const elems = [L.elems, rec]
  const values = [L.values, rec]
  return L.seq(L.choose(x => (x instanceof Array ? elems :
                              x instanceof Object ? values :
                              L.zero)),
               L.identity)
})]

export const CollectM = {
  of: x => [x, []],
  map: (x2y, [x, s]) => [x2y(x), s],
  ap: ([x2y, sl], [x, sr]) => [x2y(x), [...sr, ...sl]],
  chain: (x2yM, [x, sr]) => {
    const [y, sl] = x2yM(x)
    return [y, [...sr, ...sl]]
  }
}

export const collectM = (o, s) =>
  L.toFunction(o)(CollectM, x => [x, [x]], s, undefined)[1]

describe("seq", () => {
  testEq(`L.set(L.seq(), "ignored", "anything")`, "anything")
  testEq(`L.set([L.seq(), "x"], "ignored", {x: "anything"})`, {x: "anything"})
  testEq(`L.set(L.seq("x", "y", "z"), 1, undefined)`, {x:1,y:1,z:1})
  testEq(`L.modify(everywhere, x => [x], {x: {y: 1}})`, [{x: [{y: [1]}]}])

  testEq(`collectM(L.seq(1, 0, 2), ["b", "a", "c"])`,
         ["a", "b", "c"])
})
