import R from "ramda"

import L from "../src/partial.lenses"

function show(x) {
  switch (typeof x) {
  case "string":
  case "object":
    return JSON.stringify(x)
  default:
    return `${x}`
  }
}

const testEq = (expr, fn, expect) => it(`${expr} => ${show(expect)}`, () => {
  const actual = fn()
  if (!R.equals(actual, expect))
    throw new Error(`Expected: ${show(expect)}, actual: ${show(actual)}`)
})

describe('L.find', () => {
  testEq('L.set(L.find(R.equals(2)), undefined, [,,2])', () =>
          L.set(L.find(R.equals(2)), undefined, [,,2]), undefined)
  testEq('L.set(L.find(R.equals(2)), undefined, [1, 2, 3])', () =>
          L.set(L.find(R.equals(2)), undefined, [1, 2, 3]), [1, 3])
  testEq('L.set(L.find(R.equals(2)), 4, [1, 2, 3])', () =>
          L.set(L.find(R.equals(2)), 4, [1, 2, 3]), [1, 4, 3])
  testEq('L.set(L.find(R.equals(2)), 2, [1, 4, 3])', () =>
          L.set(L.find(R.equals(2)), 2, [1, 4, 3]), [1, 4, 3, 2])
  testEq('L.set(L.find(R.equals(2)), 2, undefined)', () =>
          L.set(L.find(R.equals(2)), 2, undefined), [2])
  testEq('L.set(L.find(R.equals(2)), 2, [])', () =>
          L.set(L.find(R.equals(2)), 2, []), [2])
  testEq('L.view(L.find(R.equals(2)), undefined)', () =>
          L.view(L.find(R.equals(2)), undefined), undefined)
  testEq('L.view(L.find(R.equals(2)), [3])', () =>
          L.view(L.find(R.equals(2)), [3]), undefined)
})

describe('L.index', () => {
  testEq('L.set(L(1), undefined, [,,])', () =>
          L.set(L(1), undefined, [,,]), undefined)
  testEq('L.set(L.compose(L.required([]), 1), undefined, [,,])', () =>
          L.set(L.compose(L.required([]), 1), undefined, [,,]), [])
  testEq('L.set(L(1), 4, [1, 2, 3])', () =>
          L.set(L(1), 4, [1, 2, 3]), [1, 4, 3])
  testEq('L.set(2, 4, undefined)', () =>
          L.set(2, 4, undefined), [,, 4])
  testEq('L.set(L(2), 4, [1])', () =>
          L.set(L(2), 4, [1]), [1,, 4])
  testEq('L.delete(L(0), [1, 2, 3])', () =>
          L.delete(L(0), [1, 2, 3]), [2, 3])
  testEq('L.set(L(1), undefined, [1, 2, 3])', () =>
          L.set(L(1), undefined, [1, 2, 3]), [1, 3])
  testEq('L.set(2, undefined, [1, 2, 3])', () =>
          L.set(2, undefined, [1, 2, 3]), [1, 2])
  testEq('L.set(L(5), undefined, [1, 2, 3])', () =>
          L.set(L(5), undefined, [1, 2, 3]), [1, 2, 3])
  testEq('L.view(5, undefined)', () =>
          L.view(5, undefined), undefined)
  testEq('L.view(L(5), [1, 2, 3])', () =>
          L.view(L(5), [1, 2, 3]), undefined)
})

describe('L.prop', () => {
  testEq('L.set(L("x"), undefined, {x: 1})', () =>
          L.set(L("x"), undefined, {x: 1}), undefined)
  testEq('L.set(L("x", L.required(null)), undefined, {x: 1})', () =>
          L.set(L("x", L.required(null)), undefined, {x: 1}), {x: null})
  testEq('L.set(L.compose("x", L.required(null)), 2, {x: 1})', () =>
          L.set(L.compose("x", L.required(null)), 2, {x: 1}), {x: 2})
  testEq('L.delete("y", {x: 1, y: 2})', () =>
          L.delete("y", {x: 1, y: 2}), {x: 1})
  testEq('L.set(L("y"), 3, {x: 1, y: 2})', () =>
          L.set(L("y"), 3, {x: 1, y: 2}), {x: 1, y: 3})
  testEq('L.set("z", 3, {x: 1, y: 2})', () =>
          L.set("z", 3, {x: 1, y: 2}), {x: 1, y: 2, z: 3})
  testEq('L.set(L("z"), 3, undefined)', () =>
          L.set(L("z"), 3, undefined), {z: 3})
  testEq('L.view("z", undefined)', () =>
          L.view("z", undefined), undefined)
  testEq('L.view(L("z"), {x: 1})', () =>
          L.view(L("z"), {x: 1}), undefined)
})

describe("L.replace", () => {
  testEq('L.view(L.replace(undefined, ""), undefined)', () =>
          L.view(L.replace(undefined, ""), undefined), "")
  testEq('L.view(L.replace(undefined, ""), "defined")', () =>
          L.view(L.replace(undefined, ""), "defined"), "defined")
  testEq('L.set(L.replace(undefined, ""), "", "anything")', () =>
          L.set(L.replace(undefined, ""), "", "anything"), undefined)
  testEq('L.set(L.replace(undefined, ""), "defined", "anything")', () =>
          L.set(L.replace(undefined, ""), "defined", "anything"), "defined")
})

describe("L.default", () => {
  testEq('L.view(L.default(""), undefined)', () =>
          L.view(L.default(""), undefined), "")
  testEq('L.view(L.default(""), "defined")', () =>
          L.view(L.default(""), "defined"), "defined")
  testEq('L.set(L.default(""), "", "anything")', () =>
          L.set(L.default(""), "", "anything"), undefined)
  testEq('L.set(L.default(""), "defined", "anything")', () =>
          L.set(L.default(""), "defined", "anything"), "defined")
})

describe("L.normalize", () => {
  testEq('L.view(L.normalize(R.sortBy(R.identity)), [1,3,2,5])', () =>
          L.view(L.normalize(R.sortBy(R.identity)), [1,3,2,5]), [1,2,3,5])
  testEq('L.set(L(L.normalize(R.sortBy(R.identity)), L.find(R.equals(2))), 4, [1,3,2,5])', () =>
          L.set(L(L.normalize(R.sortBy(R.identity)), L.find(R.equals(2))), 4, [1,3,2,5]),
         [1,3,4,5])
  testEq('L.set(L(L.normalize(R.sortBy(R.identity)), L.find(R.equals(2))), 4, undefined)', () =>
          L.set(L(L.normalize(R.sortBy(R.identity)), L.find(R.equals(2))), 4, undefined),
         [4])
  testEq('L.delete(L(L.normalize(R.sortBy(R.identity)), L.find(R.equals(2))), [2])', () =>
          L.delete(L(L.normalize(R.sortBy(R.identity)), L.find(R.equals(2))), [2]),
         undefined)
  testEq('L.set(L(L.normalize(R.sortBy(R.identity)), L.find(R.equals(2))), undefined, [1,3,2,5])', () =>
          L.set(L(L.normalize(R.sortBy(R.identity)), L.find(R.equals(2))), undefined, [1,3,2,5]),
         [1,3,5])
})

describe("L.firstOf", () => {
  testEq('L.view(L.firstOf("x", "y"), {x: 11, y: 12})', () =>
          L.view(L.firstOf("x", "y"), {x: 11, y: 12}), 11)
  testEq('L.view(L.firstOf("y", "x"), {x: 11, y: 12})', () =>
          L.view(L.firstOf("y", "x"), {x: 11, y: 12}), 12)
  testEq('L.view(L.firstOf("x", "y"), {z: 13})', () =>
          L.view(L.firstOf("x", "y"), {z: 13}), undefined)
  testEq('L.over(L.firstOf("x", "y"), x => x-2, {x: 11, y: 12})', () =>
          L.over(L.firstOf("x", "y"), x => x-2, {x: 11, y: 12}), {x: 9, y: 12})
  testEq('L.over(L.firstOf("y", "x"), x => x-2, {x: 11, y: 12})', () =>
          L.over(L.firstOf("y", "x"), x => x-2, {x: 11, y: 12}), {x: 11, y: 10})
  testEq('L.set(L.firstOf("x", "y"), 12, {z: 13})', () =>
          L.set(L.firstOf("x", "y"), 12, {z: 13}), {x: 12, z: 13})
  testEq('L.set(L.firstOf("y", "x"), 12, {z: 13})', () =>
          L.set(L.firstOf("y", "x"), 12, {z: 13}), {y: 12, z: 13})
  testEq('L.delete(L.firstOf("x", "y"), {z: 13})', () =>
          L.delete(L.firstOf("x", "y"), {z: 13}), {z: 13})
  testEq('L.delete(L.firstOf("x", "y"), {x: 11, y: 12})', () =>
          L.delete(L.firstOf("x", "y"), {x: 11, y: 12}), {y: 12})
  testEq('L.delete(L.firstOf("y", "x"), {x: 11, y: 12})', () =>
          L.delete(L.firstOf("y", "x"), {x: 11, y: 12}), {x: 11})
})
