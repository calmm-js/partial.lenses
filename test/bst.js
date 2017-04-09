import * as L from "../dist/partial.lenses.cjs"
import * as R from "ramda"

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

export const valueOf = key => [search(key), "value"]

export const isValid = (n, keyPred = () => true) =>
  undefined === n
  || "key" in n
  && "value" in n
  && keyPred(n.key)
  && isValid(n.smaller, key => key < n.key)
  && isValid(n.greater, key => n.key < key)

export const fromPairs =
  R.reduce((t, [k, v]) => L.set(valueOf(k), v, t), undefined)

export const values = L.lazy(rec => [
  L.optional,
  naiveBST,
  L.branch({smaller: rec,
            value: L.identity,
            greater: rec})])
