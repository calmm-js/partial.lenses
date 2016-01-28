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

const testEq = (expr, lambda, expected) => it(
  `${expr} equals ${show(expected)}`, () => {
    const actual = lambda()
    if (!R.equals(actual, expected))
      throw new Error(`Expected: ${show(expected)}, actual: ${show(actual)}`)
  })

describe("L.replace", () => {
  testEq('L.view(L.replace(undefined, ""), undefined)', () =>
           L.view(L.replace(undefined, ""), undefined),
         "")
  testEq('L.view(L.replace(undefined, ""), "defined")', () =>
          L.view(L.replace(undefined, ""), "defined"),
         "defined")
  testEq('L.set(L.replace(undefined, ""), "", "anything")', () =>
          L.set(L.replace(undefined, ""), "", "anything"),
         undefined)
  testEq('L.set(L.replace(undefined, ""), "defined", "anything")', () =>
          L.set(L.replace(undefined, ""), "defined", "anything"),
         "defined")
})
