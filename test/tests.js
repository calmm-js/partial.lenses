import R from "ramda"

import Ls, * as L from "../src/partial.lenses"

function show(x) {
  switch (typeof x) {
  case "string":
  case "object":
    return JSON.stringify(x)
  default:
    return `${x}`
  }
}

const testEq = (expr, expect) => it(`${expr} => ${show(expect)}`, () => {
  const actual = eval(`(Ls, L, R) => ${expr}`)(Ls, L, R)
  if (!R.equals(actual, expect))
    throw new Error(`Expected: ${show(expect)}, actual: ${show(actual)}`)
})

describe("default === compose", () => {
  it("Ls === L.compose", () => {
     if (Ls !== L.compose)
       throw new Error("Not the same")
  })
})

describe("arities", () => {
  testEq('L.augment.length', 1)
  testEq('L.compose.length', 0)
  testEq('L.defaults.length', 1)
  testEq('L.define.length', 1)
  testEq('L.filter.length', 1)
  testEq('L.find.length', 1)
  testEq('L.findWith.length', 1)
  testEq('L.index.length', 1)
  testEq('L.lens.length', 2)
  testEq('L.normalize.length', 1)
  testEq('L.over.length', 3)
  testEq('L.pick.length', 1)
  testEq('L.prop.length', 1)
  testEq('L.props.length', 1)
  testEq('L.remove.length', 2)
  testEq('L.replace.length', 2)
  testEq('L.required.length', 1)
  testEq('L.update.length', 3)
  testEq('L.view.length', 2)
})

describe('L.find', () => {
  testEq('L.update(L.find(R.equals(2)), undefined, [,,2])', undefined)
  testEq('L.update(L.find(R.equals(2)), undefined, [1, 2, 3])', [1, 3])
  testEq('L.update(L.find(R.equals(2)), 4, [1, 2, 3])', [1, 4, 3])
  testEq('L.update(L.find(R.equals(2)), 2, [1, 4, 3])', [1, 4, 3, 2])
  testEq('L.update(L.find(R.equals(2)), 2, undefined)', [2])
  testEq('L.update(L.find(R.equals(2)), 2, [])', [2])
  testEq('L.view(L.find(R.equals(2)), undefined)', undefined)
  testEq('L.view(L.find(R.equals(2)), [3])', undefined)
})

describe('L.index', () => {
  testEq('L.update(Ls(1), undefined, [,,])', undefined)
  testEq('L.update(Ls(L.required([]), 1), undefined, [,,])', [])
  testEq('L.update(Ls(1), 4, [1, 2, 3])', [1, 4, 3])
  testEq('L.update(2, 4, undefined)', [,, 4])
  testEq('L.update(Ls(2), 4, [1])', [1,, 4])
  testEq('L.remove(Ls(0), [1, 2, 3])', [2, 3])
  testEq('L.update(Ls(1), undefined, [1, 2, 3])', [1, 3])
  testEq('L.update(2, undefined, [1, 2, 3])', [1, 2])
  testEq('L.update(Ls(5), undefined, [1, 2, 3])', [1, 2, 3])
  testEq('L.view(5, undefined)', undefined)
  testEq('L.view(Ls(5), [1, 2, 3])', undefined)
  testEq('L.update(1, "2", ["1", "2", "3"])', ["1", "2", "3"])
})

describe('L.prop', () => {
  testEq('L.update(Ls("x"), undefined, {x: 1})', undefined)
  testEq('L.update(Ls("x", L.required(null)), undefined, {x: 1})', {x: null})
  testEq('L.update(Ls("x", L.required(null)), 2, {x: 1})', {x: 2})
  testEq('L.remove("y", {x: 1, y: 2})', {x: 1})
  testEq('L.update(Ls("y"), 3, {x: 1, y: 2})', {x: 1, y: 3})
  testEq('L.update("z", 3, {x: 1, y: 2})', {x: 1, y: 2, z: 3})
  testEq('L.update(Ls("z"), 3, undefined)', {z: 3})
  testEq('L.view("z", undefined)', undefined)
  testEq('L.view(Ls("z"), {x: 1})', undefined)
})

describe("L.replace", () => {
  testEq('L.view(L.replace(undefined, ""), undefined)', "")
  testEq('L.view(L.replace(undefined, ""), "defined")', "defined")
  testEq('L.update(L.replace(undefined, ""), "", "anything")', undefined)
  testEq('L.update(L.replace(undefined, ""), "defined", "anything")', "defined")
})

describe("L.defaults", () => {
  testEq('L.view(L.defaults(""), undefined)', "")
  testEq('L.view(L.defaults(""), "defined")', "defined")
  testEq('L.update(L.defaults(""), "", "anything")', undefined)
  testEq('L.update(L.defaults(""), "defined", "anything")', "defined")
})

describe("L.normalize", () => {
  testEq('L.view(L.normalize(R.sortBy(R.identity)), [1,3,2,5])', [1,2,3,5])
  testEq('L.update(Ls(L.normalize(R.sortBy(R.identity)), L.find(R.equals(2))), 4, [1,3,2,5])',
         [1,3,4,5])
  testEq('L.update(Ls(L.normalize(R.sortBy(R.identity)), L.find(R.equals(2))), 4, undefined)',
         [4])
  testEq('L.remove(Ls(L.normalize(R.sortBy(R.identity)), L.find(R.equals(2))), [2])',
         undefined)
  testEq('L.update(Ls(L.normalize(R.sortBy(R.identity)), L.find(R.equals(2))), undefined, [1,3,2,5])',
         [1,3,5])
})

describe("L.firstOf", () => {
  testEq('L.view(L.firstOf("x", "y"), {x: 11, y: 12})', 11)
  testEq('L.view(L.firstOf("y", "x"), {x: 11, y: 12})', 12)
  testEq('L.view(L.firstOf("x", "y"), {z: 13})', undefined)
  testEq('L.over(L.firstOf("x", "y"), x => x-2, {x: 11, y: 12})', {x: 9, y: 12})
  testEq('L.over(L.firstOf("y", "x"), x => x-2, {x: 11, y: 12})', {x: 11, y: 10})
  testEq('L.update(L.firstOf("x", "y"), 12, {z: 13})', {x: 12, z: 13})
  testEq('L.update(L.firstOf("y", "x"), 12, {z: 13})', {y: 12, z: 13})
  testEq('L.remove(L.firstOf("x", "y"), {z: 13})', {z: 13})
  testEq('L.remove(L.firstOf("x", "y"), {x: 11, y: 12})', {y: 12})
  testEq('L.remove(L.firstOf("y", "x"), {x: 11, y: 12})', {x: 11})
})

describe("L.findWith", () => {
  testEq('L.view(L.findWith("x", 1), [{x: ["a"]},{x: ["b","c"]}])', "c")
  testEq('L.update(L.findWith("x", 1), "d", [{x: ["a"]},{x: ["b","c"]}])', [{x: ["a"]},{x: ["b","d"]}])
  testEq('L.remove(L.findWith("x", 1), [{x: ["a"]},{x: ["b","c"]}])', [{x: ["a"]},{x: ["b"]}])
})

describe("L.filter", () => {
  testEq('L.view(L.filter(R.lt(9)), [3,1,4,1,5,9,2])', [])
  testEq('L.view(L.filter(R.lt(2)), undefined)', undefined)
  testEq('L.view(L.filter(R.lt(2)), [3,1,4,1,5,9,2])', [3,4,5,9])
  testEq('L.remove(Ls(L.filter(R.lt(2)), 1), [3,1,4,1,5,9,2])', [3,5,9,1,1,2])
  testEq('L.update(L.filter(R.lt(0)), [], [3,1,4,1,5,9,2])', undefined)
  testEq('L.remove(L.filter(R.lt(0)), [3,1,4,1,5,9,2])', undefined)
  testEq('L.remove(L.filter(R.lt(2)), [3,1,4,1,5,9,2])', [1,1,2])
})

describe("L.removeAll", () => {
  testEq('L.removeAll(L.find(x => x < 2), [3,1,4,1,5,9,2])', [3,4,5,9,2])
})

describe("L.augment", () => {
  testEq('L.view(L.augment({y: c => c.x+1, z: c => c.x-1}), {x: 0})', {x: 0, y: 1, z: -1})
  testEq('L.view(L.augment({y: c => c.x+1}), {x: 2, y: -1})', {x: 2, y: 3})
  testEq('L.update(L.augment({y: c => c.x+1}), {x: 1, y: 1}, {x: 0})', {x: 1})
  testEq('L.update(L.augment({y: c => c.x+1}), {x: 2, y: 1}, {x: 0, y: -1})', {x: 2, y: -1})
  testEq('L.remove(Ls(L.augment({y: () => 1}), "x"), {x:0})', undefined)
  testEq('L.remove(L.augment({z: c => c.x + c.y}), {x: 1, y: 2})', undefined)
})

describe("L.pick", () => {
  testEq('L.view(L.pick({x: "c"}), {a: [2], b: 1})', undefined)
  testEq('L.update(Ls(L.pick({x: "c"}), "x"), 4, {a: [2], b: 1})', {a: [2], b: 1, c: 4})
  testEq('L.view(L.pick({x: "b", y: "a"}), {a: [2], b: 1})', {x: 1, y: [2]})
  testEq('L.update(Ls(L.pick({x: "b", y: "a"}), "x"), 3, {a: [2], b: 1})', {a: [2], b: 3})
  testEq('L.remove(Ls(L.pick({x: "b", y: "a"}), "y"), {a: [2], b: 1})', {b: 1})
  testEq('L.remove(Ls(L.pick({x: "b"}), "x"), {a: [2], b: 1})', {a: [2]})
  testEq('L.removeAll(Ls(L.pick({x: "b", y: "a"}), L.firstOf("y", "x")), {a: [2], b: 1})', undefined)
})

describe("L.props", () => {
  testEq('L.view(L.props("x", "y"), {x: 1, y: 2, z: 3})', {x: 1, y: 2})
  testEq('L.view(L.props("x", "y"), {z: 3})', undefined)
  testEq('L.view(L.props("x", "y"), {x: 2, z: 3})', {x: 2})
  testEq('L.remove(L.props("x", "y"), {x: 1, y: 2, z: 3})', {z: 3})
  testEq('L.update(L.props("x", "y"), {}, {x: 1, y: 2, z: 3})', {z: 3})
  testEq('L.update(L.props("x", "y"), {y: 4}, {x: 1, y: 2, z: 3})', {y: 4, z: 3})
  testEq('L.remove(L.props("x", "y"), {x: 1, y: 2})', undefined)
  testEq('L.update(L.props("a", "b"), {a: 2}, {a: 1, b: 3})', {a: 2})
})

const BST = {
  search: key => {
    const rec =
      Ls(L.normalize(n =>
           undefined !== n.value   ? n         :
           n.smaller && !n.greater ? n.smaller :
           !n.smaller && n.greater ? n.greater :
           L.update(BST.search(n.smaller.key), n.smaller, n.greater)),
         L.defaults({key}),
         L.choose(n => key < n.key ? Ls("smaller", rec) :
                       n.key < key ? Ls("greater", rec) :
                                     L.identity))
    return rec
  },

  valueOf: key => Ls(BST.search(key), "value"),

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
          after = L.update(BST.valueOf(key), key, before)
          if (undefined === L.view(BST.valueOf(key), after))
            error()
          break
        case "delete":
          after = L.remove(BST.valueOf(key), before)
          if (undefined !== L.view(BST.valueOf(key), after))
            error()
          break
      }

      if (!BST.isValid(after))
        error()

      before = after
    }
  })
})
