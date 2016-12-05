import * as L from "../src/partial.lenses"
import * as R from "ramda"

const naiveBST = L.rewrite(n =>
  undefined !== n.value   ? n         :
  n.smaller && !n.greater ? n.smaller :
  !n.smaller && n.greater ? n.greater :
  L.set(search(n.smaller.key), n.smaller, n.greater))

const search = key => L.lazy(rec =>
  [naiveBST,
   L.defaults({key}),
   L.choose(n => key < n.key ? ["smaller", rec] :
                 n.key < key ? ["greater", rec] :
                               L.identity)])

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
