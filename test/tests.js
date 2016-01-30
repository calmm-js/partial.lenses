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
  testEq('L.set(L(1), 4, [1, 2, 3])', () =>
          L.set(L(1), 4, [1, 2, 3]), [1, 4, 3])
  testEq('L.set(L(2), 4, undefined)', () =>
          L.set(L(2), 4, undefined), [,, 4])
  testEq('L.set(L(2), 4, [1])', () =>
          L.set(L(2), 4, [1]), [1,, 4])
  testEq('L.set(L(0), undefined, [1, 2, 3])', () =>
          L.set(L(0), undefined, [1, 2, 3]), [2, 3])
  testEq('L.set(L(1), undefined, [1, 2, 3])', () =>
          L.set(L(1), undefined, [1, 2, 3]), [1, 3])
  testEq('L.set(L(2), undefined, [1, 2, 3])', () =>
          L.set(L(2), undefined, [1, 2, 3]), [1, 2])
  testEq('L.set(L(5), undefined, [1, 2, 3])', () =>
          L.set(L(5), undefined, [1, 2, 3]), [1, 2, 3])
  testEq('L.view(L(5), undefined)', () =>
          L.view(L(5), undefined), undefined)
  testEq('L.view(L(5), [1, 2, 3])', () =>
          L.view(L(5), [1, 2, 3]), undefined)
})

describe('L.prop', () => {
  testEq('L.set(L("y"), undefined, {x: 1, y: 2})', () =>
          L.set(L("y"), undefined, {x: 1, y: 2}), {x: 1})
  testEq('L.set(L("y"), 3, {x: 1, y: 2})', () =>
          L.set(L("y"), 3, {x: 1, y: 2}), {x: 1, y: 3})
  testEq('L.set(L("z"), 3, {x: 1, y: 2})', () =>
          L.set(L("z"), 3, {x: 1, y: 2}), {x: 1, y: 2, z: 3})
  testEq('L.set(L("z"), 3, undefined)', () =>
          L.set(L("z"), 3, undefined), {z: 3})
  testEq('L.view(L("z"), undefined)', () =>
          L.view(L("z"), undefined), undefined)
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
