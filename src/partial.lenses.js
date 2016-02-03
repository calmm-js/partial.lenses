import R from "ramda"

//

const deleteKey = (k, o) => {
  if (o === undefined || !(k in o))
    return o
  let r
  for (const p in o) {
    if (p !== k) {
      if (undefined === r)
        r = {}
      r[p] = o[p]
    }
  }
  return r
}

const setKey = (k, v, o) => {
  if (o === undefined)
    return {[k]: v}
  if (k in o && R.equals(v, o[k]))
    return o
  const r = {[k]: v}
  for (const p in o)
    if (p !== k)
      r[p] = o[p]
  return r
}

//

const dropped = xs => Object.keys(xs).length === 0 ? undefined : xs

//

const toPartial = transform => x => undefined === x ? x : transform(x)

//

const conserve = f => (n0, o) => {
  const n = f(n0, o)
  return R.equals(n, o) ? o : n
}

//

const lift = l => {
  switch (typeof l) {
  case "string": return L.prop(l)
  case "number": return L.index(l)
  default:       return l
  }
}

const L = (...ls) => ls.length === 1 ? lift(ls[0]) : R.compose(...ls.map(lift))

L.compose = R.compose
L.delete = R.curry((l, s) => R.set(l, undefined, s))
L.lens = R.lens
L.over = R.over
L.set = R.set
L.view = R.view

L.replace = R.curry((inn, out) =>
  R.lens(x => R.equals(x, inn) ? out : x,
         conserve(y => R.equals(y, out) ? inn : y)))

L.default = L.replace(undefined)
L.required = inn => L.replace(inn, undefined)
L.define = v => R.compose(L.required(v), L.default(v))

L.normalize = transform =>
  R.lens(toPartial(transform), conserve(toPartial(transform)))

L.prop = k =>
  R.lens(o => o && o[k],
         (v, o) => v === undefined ? deleteKey(k, o) : setKey(k, v, o))

L.find = predicate => R.lens(xs => xs && xs.find(predicate), (x, xs) => {
  if (x === undefined) {
    if (xs === undefined)
      return undefined
    const i = xs.findIndex(predicate)
    if (i < 0)
      return xs
    return dropped(xs.slice(0, i).concat(xs.slice(i+1)))
  } else {
    if (xs === undefined)
      return [x]
    const i = xs.findIndex(predicate)
    if (i < 0)
      return xs.concat([x])
    if (R.equals(x, xs[i]))
      return xs
    return xs.slice(0, i).concat([x], xs.slice(i+1))
  }
})

L.index = i => R.lens(xs => xs && xs[i], (x, xs) => {
  if (x === undefined) {
    if (xs === undefined)
      return undefined
    if (i < xs.length)
      return dropped(xs.slice(0, i).concat(xs.slice(i+1)))
    return xs
  } else {
    if (xs === undefined)
      return Array(i).concat([x])
    if (xs.length <= i)
      return xs.concat(Array(i - xs.length), [x])
    if (R.equals(x, xs[i]))
      return xs
    return xs.slice(0, i).concat([x], xs.slice(i+1))
  }
})

export default L
