import * as R from "ramda"

import P, * as L from "../src/partial.lenses"

function show(x) {
  switch (typeof x) {
  case "string":
  case "object":
    return JSON.stringify(x)
  default:
    return `${x}`
  }
}

const run = expr => eval(`(P, L, R) => ${expr}`)(P, L, R)

const testEq = (expr, expect) => it(`${expr} => ${show(expect)}`, () => {
  const actual = run(expr)
  if (!R.equals(actual, expect))
    throw new Error(`Expected: ${show(expect)}, actual: ${show(actual)}`)
})

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
  testEq("P === L.compose", true)
  testEq('P() === L.identity', true)
  testEq('P("x")', "x")
  testEq('P(101)', 101)
})

describe("L.identity", () => {
  testEq('L.get(L.identity, "any")', "any")
  testEq('L.modify(L.identity, R.add(1), 2)', 3)
  testEq('L.remove(P("x", L.identity), {x: 1, y: 2})', {y: 2})
})

describe("arities", () => {
  testEq('L.augment.length', 1)
  testEq('L.choice.length', 0)
  testEq('L.compose.length', 0)
  testEq('L.defaults.length', 1)
  testEq('L.define.length', 1)
  testEq('L.filter.length', 1)
  testEq('L.find.length', 1)
  testEq('L.findWith.length', 0)
  testEq('L.fromRamda.length', 1)
  testEq('L.get.length', 2)
  testEq('L.index.length', 1)
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
  testEq('L.set.length', 3)
  testEq('L.toRamda.length', 1)
  testEq('L.valueOr.length', 1)
})

describe("interop", () => {
  testEq('R.set(L.toRamda(0), "a", ["b"])', ["a"])
  testEq('L.get(L.fromRamda(R.lensProp("x")), {x: "b"})', "b")
})

describe('L.find', () => {
  testEq('L.set(L.find(R.equals(2)), undefined, [,,2])', undefined)
  testEq('L.set(L.find(R.equals(2)), undefined, [1, 2, 3])', [1, 3])
  testEq('L.set(L.find(R.equals(2)), 4, [1, 2, 3])', [1, 4, 3])
  testEq('L.set(L.find(R.equals(2)), 2, [1, 4, 3])', [1, 4, 3, 2])
  testEq('L.set(L.find(R.equals(2)), 2, undefined)', [2])
  testEq('L.set(L.find(R.equals(2)), 2, [])', [2])
  testEq('L.get(L.find(R.equals(2)), undefined)', undefined)
  testEq('L.get(L.find(R.equals(2)), [3])', undefined)
})

describe('L.index', () => {
  if (process.env.NODE_ENV !== "production") {
    testThrows('L.index("x")')
    testThrows('L.index(-1)')
    testThrows('L.index()')
  }
  testEq('L.set(P(1), undefined, [,,])', undefined)
  testEq('L.set(P(L.required([]), 1), undefined, [,,])', [])
  testEq('L.set(P(1), 4, [1, 2, 3])', [1, 4, 3])
  testEq('L.set(2, 4, undefined)', [,, 4])
  testEq('L.set(P(2), 4, [1])', [1,, 4])
  testEq('L.remove(P(0), [1, 2, 3])', [2, 3])
  testEq('L.set(P(1), undefined, [1, 2, 3])', [1, 3])
  testEq('L.set(2, undefined, [1, 2, 3])', [1, 2])
  testEq('L.set(P(5), undefined, [1, 2, 3])', [1, 2, 3])
  testEq('L.get(5, undefined)', undefined)
  testEq('L.get(P(5), [1, 2, 3])', undefined)
  testEq('L.set(1, "2", ["1", "2", "3"])', ["1", "2", "3"])
  empties.forEach(invalid => testEq(`L.get(0, ${show(invalid)})`, undefined))
  empties.forEach(invalid => testEq(`L.set(0, "f", ${show(invalid)})`, ["f"]))
  testEq('L.set(L.index(0), "Hello", "x, world!")', ["Hello"])
  testEq('L.remove(0, [])', undefined)
  testEq('L.remove(1, [])', undefined)
})

describe('L.prop', () => {
  if (process.env.NODE_ENV !== "production") {
    testThrows('L.prop(2)')
    testThrows('L.prop(x => x)')
    testThrows('L.prop()')
  }
  testEq('L.set(P("x"), undefined, {x: 1})', undefined)
  testEq('L.set(P("x", L.required(null)), undefined, {x: 1})', {x: null})
  testEq('L.set(P("x", L.required(null)), 2, {x: 1})', {x: 2})
  testEq('L.remove("y", {x: 1, y: 2})', {x: 1})
  testEq('L.set(P("y"), 3, {x: 1, y: 2})', {x: 1, y: 3})
  testEq('L.set("z", 3, {x: 1, y: 2})', {x: 1, y: 2, z: 3})
  testEq('L.set(P("z"), 3, undefined)', {z: 3})
  testEq('L.get("z", undefined)', undefined)
  testEq('L.get(P("z"), {x: 1})', undefined)
  empties.forEach(invalid => testEq(`L.get("x", ${show(invalid)})`, undefined))
  empties.forEach(invalid => testEq(`L.set("ex", true, ${show(invalid)})`, {ex: true}))
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
  testEq('L.get(P("related", L.define([])), {})', [])
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
  testEq('L.set(P(L.normalize(R.sortBy(R.identity)), L.find(R.equals(2))), 4, [1,3,2,5])',
         [1,3,4,5])
  testEq('L.set(P(L.normalize(R.sortBy(R.identity)), L.find(R.equals(2))), 4, undefined)',
         [4])
  testEq('L.remove(P(L.normalize(R.sortBy(R.identity)), L.find(R.equals(2))), [2])',
         undefined)
  testEq('L.set(P(L.normalize(R.sortBy(R.identity)), L.find(R.equals(2))), undefined, [1,3,2,5])',
         [1,3,5])
})

describe("L.nothing", () => {
  testEq('L.get(L.nothing, "anything")', undefined)
  testEq('L.set(L.nothing, "anything", "original")', "original")
})

describe("L.just", () => {
  testEq('L.get(L.just("always"), "anything")', "always")
  testEq('L.set(L.just("always"), "anything", "original")', "original")
})

describe("L.chain", () => {
  testEq('L.get(L.chain(elems => elems instanceof Array ? 0 : L.identity, "elems"), {elems: ["x"]})', "x")
  testEq('L.set(L.chain(elems => elems instanceof Array ? 0 : L.identity, "elems"), "y", {elems: ["x"]})', {elems: ["y"]})
  testEq('L.get(L.chain(elems => elems instanceof Array ? 0 : L.identity, "elems"), {notit: true})', undefined)
  testEq('L.set(L.chain(elems => elems instanceof Array ? 0 : L.identity, "elems"), false, {notit: true})', {notit: true})
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
  testEq('L.set(L.findWith("x", 1), "d", [{x: ["a"]},{x: ["b","c"]}])', [{x: ["a"]},{x: ["b","d"]}])
  testEq('L.remove(L.findWith("x", 1), [{x: ["a"]},{x: ["b","c"]}])', [{x: ["a"]},{x: ["b"]}])
})

describe("L.filter", () => {
  testEq('L.get(L.filter(R.lt(9)), [3,1,4,1,5,9,2])', [])
  testEq('L.get(L.filter(R.lt(2)), undefined)', undefined)
  testEq('L.get(L.filter(R.lt(2)), [3,1,4,1,5,9,2])', [3,4,5,9])
  testEq('L.remove(P(L.filter(R.lt(2)), 1), [3,1,4,1,5,9,2])', [3,5,9,1,1,2])
  testEq('L.set(L.filter(R.lt(0)), [], [3,1,4,1,5,9,2])', undefined)
  testEq('L.remove(L.filter(R.lt(0)), [3,1,4,1,5,9,2])', undefined)
  testEq('L.remove(L.filter(R.lt(2)), [3,1,4,1,5,9,2])', [1,1,2])
  empties.filter(x => !(x instanceof Array)).forEach(invalid => testEq(`L.get(L.filter(R.always(true)), ${show(invalid)})`, undefined))
  empties.filter(x => !(x instanceof Array)).forEach(invalid => testEq(`L.set(L.filter(R.always(true)), [1,"2",3], ${show(invalid)})`, [1,"2",3]))
})

describe("L.removeAll", () => {
  testEq('L.removeAll(L.find(x => x < 2), [3,1,4,1,5,9,2])', [3,4,5,9,2])
})

describe("L.append", () => {
  testEq('L.remove(L.append, "anything")', undefined)
  empties.forEach(invalid => testEq(`L.set(L.append, "a", ${show(invalid)})`, ["a"]))
})

describe("L.augment", () => {
  testEq('L.get(L.augment({y: c => c.x+1, z: c => c.x-1}), {x: 0})', {x: 0, y: 1, z: -1})
  testEq('L.get(L.augment({y: c => c.x+1}), {x: 2, y: -1})', {x: 2, y: 3})
  testEq('L.set(L.augment({y: c => c.x+1}), {x: 1, y: 1}, {x: 0})', {x: 1})
  testEq('L.set(L.augment({y: c => c.x+1}), {x: 2, y: 1}, {x: 0, y: -1})', {x: 2, y: -1})
  testEq('L.get(L.augment({y: c => c.x+1, z: c => c.y+1}), {x: 1})', {x: 1, y: 2, z: 3})
  testEq('L.remove(P(L.augment({y: () => 1}), "x"), {x:0})', undefined)
  testEq('L.remove(L.augment({z: c => c.x + c.y}), {x: 1, y: 2})', undefined)
  empties.filter(x => !R.equals(x, {})).forEach(invalid => testEq(`L.get(L.augment({x: () => 1}), ${show(invalid)})`, undefined))
  empties.forEach(invalid => testEq(`L.set(L.augment({x: () => 1}), {y: 2}, ${show(invalid)})`, {y: 2}))
})

describe("L.sequence", () => {
  testEq('L.modify(P("xs", L.sequence, "x", L.sequence), R.add(1), {xs: [{x: [1]}, {x: [2,3,4]}]})', {xs: [{x: [2]}, {x: [3,4,5]}]})
  testEq('L.set(P("xs", L.sequence, "x", L.sequence), 101, {xs: [{x: [1]}, {x: [2,3,4]}]})', {xs: [{x: [101]}, {x: [101,101,101]}]})
  testEq('L.remove(P("xs", L.sequence, "x", L.sequence), {ys: "hip", xs: [{x: [1]}, {x: [2,3,4]}]})', {ys: "hip"})
  testEq('L.modify(P("xs", L.sequence, "x"), x => x < 2 ? undefined : x, {xs: [{x:3},{x:1},{x:4},{x:1,y:0},{x:5},{x:9},{x:2}]})', {xs:[{x:3},{x:4},{y:0},{x:5},{x:9},{x:2}]})
  testEq('L.modify(P(L.sequence, "x", L.sequence), R.add(1), [{x: [1]}, {}, {x: []}, {x: [2, 3]}])', [{x: [2]}, {x: [3, 4]}])
  testEq('L.modify(P(L.sequence, "x", L.sequence), R.add(1), [{x: [1]}, {y: "keep"}, {x: [], z: "these"}, {x: [2, 3]}])', [{x: [2]}, {y: "keep"}, {z: "these"}, {x: [3, 4]}])
})

describe("L.optional", () => {
  testEq('L.collect(L.optional, undefined)', [])
  testEq('L.collect(L.optional, 0)', [ 0 ])
  testEq('L.collect(P(L.sequence, "x", L.optional), [{x: 1}, {y: 2}, {x: 3, z: 1}])', [1, 3])
  testEq('L.modify(P(L.sequence, "x", L.optional), R.add(1), [{x: 1}, {y: 2}, {x: 3, z: 1}])', [{x: 2}, {y: 2}, {x: 4, z: 1}])
  testEq('L.collect(P(L.sequence, "x", L.optional, L.sequence), [{x: [1, 2]}, {y: 2}, {x: [3], z: 1}])', [1, 2, 3])
  testEq('L.modify(P(L.sequence, "x", L.optional, L.sequence), x => x < 2 ? undefined : x-1, [{x: [1, 2]}, {y: 2}, {x: [3], z: 1}])', [{x: [1]}, {y: 2}, {x: [2], z: 1}])
})

describe("L.collect", () => {
  testEq('L.collect(P("xs", L.sequence, "x", L.sequence), {xs: [{x:[3,1]},{x:[4,1]},{x:[5,9,2]}]})', [3,1,4,1,5,9,2])
  testEq('L.collect(P(L.sequence, "x", L.sequence), [{x: [1]}, {}, {x: []}, {x: [2, 3]}])', [1, 2, 3])
  testEq('L.collect(L.sequence, [])', [])
  testEq('L.collect("x", {x: 101})', [101])
  testEq('L.collect("y", {x: 101})', [])
  testEq('L.collect(P("a",L.sequence,"b",L.sequence,"c",L.sequence), {a:[{b:[]},{b:[{c:[1]}]},{b:[]},{b:[{c:[2]}]}]})', [1,2])
})

describe("L.pick", () => {
  testEq('L.get(L.pick({x: "c"}), {a: [2], b: 1})', undefined)
  testEq('L.set(P(L.pick({x: "c"}), "x"), 4, {a: [2], b: 1})', {a: [2], b: 1, c: 4})
  testEq('L.get(L.pick({x: "b", y: "a"}), {a: [2], b: 1})', {x: 1, y: [2]})
  testEq('L.set(P(L.pick({x: "b", y: "a"}), "x"), 3, {a: [2], b: 1})', {a: [2], b: 3})
  testEq('L.remove(P(L.pick({x: "b", y: "a"}), "y"), {a: [2], b: 1})', {b: 1})
  testEq('L.remove(P(L.pick({x: "b"}), "x"), {a: [2], b: 1})', {a: [2]})
  testEq('L.removeAll(P(L.pick({x: "b", y: "a"}), L.choice("y", "x")), {a: [2], b: 1})', undefined)
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

describe("L.fromArrayBy", () => {
  testEq('L.get(L.fromArrayBy(""), undefined)', undefined)
  testEq('L.get(L.fromArrayBy("id"), [{id: 1}, {id: 2}, {id: 3}])', {"1":{"id":1},"2":{"id":2},"3":{"id":3}})
  testEq('L.set(P(L.fromArrayBy("id"), "2", "x"), 1, [{id: 1}, {id: 2}, {id: 3}])', [{id: 1}, {id: 2, x: 1}, {id: 3}])
  testEq('L.remove(P(L.fromArrayBy("id"), "1"), [{id: 1}, {id: 2}, {id: 3}])', [{id: 2}, {id: 3}])
  testEq('L.remove(P(L.fromArrayBy("id"), "3"), [{id: 1}, {id: 2}, {id: 3}])', [{id: 1}, {id: 2}])
  testEq('L.remove(P(L.fromArrayBy("id"), "3"), [{id: 3}])', undefined)
})

const BST = {
  search: key => {
    const rec =
      P(L.normalize(n =>
          undefined !== n.value   ? n         :
          n.smaller && !n.greater ? n.smaller :
          !n.smaller && n.greater ? n.greater :
          L.set(BST.search(n.smaller.key), n.smaller, n.greater)),
        L.defaults({key}),
        L.choose(n => key < n.key ? P("smaller", rec) :
                      n.key < key ? P("greater", rec) :
                                    L.identity))
    return rec
  },

  valueOf: key => P(BST.search(key), "value"),

  isValid: (n, keyPred = () => true) =>
    undefined === n
    || "key" in n
    && "value" in n
    && keyPred(n.key)
    && BST.isValid(n.smaller, key => key < n.key)
    && BST.isValid(n.greater, key => n.key < key)
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
})
