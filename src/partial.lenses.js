import * as R from "ramda"

//

const id = x => x
const snd = (_, c) => c

//

const check = (expected, predicate) => x => {
  if (predicate(x))
    return x
  else
    throw new Error(`Expected ${expected}, but got ${x}.`)
}

const assert = process.env.NODE_ENV === "production" ? () => id : check

//

const empty = {}

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

const conserve = (c1, c0) => R.equals(c1, c0) ? c0 : c1

const toConserve = f => (y, c0) => conserve(f(y, c0), c0)

//

const seemsLens = x => typeof x === "function" && x.length === 1

export const fromRamda = assert("a lens", seemsLens)

export const toRamda = l => {
  if (isProp(l))  return toRamdaProp(l)
  if (isIndex(l)) return toRamdaIndex(l)
  return fromRamda(l)
}

export const compose = (...ls) =>
  ls.length === 0 ? identity :
  ls.length === 1 ? ls[0] :
  R.compose(...ls.map(toRamda))

export const remove = R.curry((l, s) => R.set(toRamda(l), undefined, s))

export const removeAll = R.curry((lens, data) => {
  while (get(lens, data) !== undefined)
    data = remove(lens, data)
  return data
})

export const lens = R.lens
export const modify = R.curry((l, x2x, s) => R.over(toRamda(l), x2x, s))
export const set = R.curry((l, x, s) => R.set(toRamda(l), x, s))
export const get = R.curry((l, s) => R.view(toRamda(l), s))

export const chain = R.curry((x2yL, xL) =>
  compose(xL, choose(xO => xO === undefined ? nothing : x2yL(xO))))

export const just = x => lens(R.always(x), snd)

export const choose = x2yL => toFunctor => target => {
  const l = toRamda(x2yL(target))
  return R.map(focus => R.set(l, focus, target), toFunctor(R.view(l, target)))
}

export const nothing = lens(snd, snd)

export const orElse =
  R.curry((d, l) => choose(x => get(l, x) !== undefined ? l : d))

export const choice = (...ls) => choose(x => {
  const i = ls.findIndex(l => get(l, x) !== undefined)
  return 0 <= i ? ls[i] : nothing
})

export const replace = R.curry((inn, out) =>
  lens(x => R.equals(x, inn) ? out : x,
       toConserve(y => R.equals(y, out) ? inn : y)))

export const defaults = replace(undefined)
export const required = inn => replace(inn, undefined)
export const define = v => R.compose(required(v), defaults(v))

export const normalize = transform =>
  lens(toPartial(transform), toConserve(toPartial(transform)))

const isProp = x => typeof x === "string"

export const prop = assert("a string", isProp)

const toRamdaProp = k =>
  lens(o => o && o[k],
       (v, o) => v === undefined ? deleteKey(k, o) : setKey(k, v, o))

export const find = predicate => choose(xs => {
  if (xs === undefined)
    return append
  const i = xs.findIndex(predicate)
  return i < 0 ? append : i
})

export const findWith = (...ls) => {
  const lls = toRamda(compose(...ls))
  return compose(find(x => R.view(lls, x) !== undefined), lls)
}

const isIndex = x => Number.isInteger(x) && 0 <= x

export const index = assert("a non-negative integer", isIndex)

const toRamdaIndex = i => lens(xs => xs && xs[i], (x, xs) => {
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

export const append = lens(snd, (x, xs) =>
  x === undefined ? xs : xs === undefined ? [x] : xs.concat([x]))

export const filter = p => lens(xs => xs && xs.filter(p), (ys, xs) =>
  conserve(dropped(R.concat(ys || [], (xs || []).filter(R.complement(p)))), xs))

export const augment = template => lens(
  toPartial(x => {
    const z = {...x}
    for (const k in template)
      z[k] = template[k](x)
    return z
  }),
  toConserve((y, c) => {
    if (y === undefined)
      return undefined
    let z
    const set = (k, v) => {
      if (undefined === z)
        z = {}
      z[k] = v
    }
    for (const k in y) {
      if (!(k in template))
        set(k, y[k])
      else
        if (k in c)
          set(k, c[k])
    }
    return z
  }))

export const pick = template => lens(
  c => {
    let r
    for (const k in template) {
      const v = get(template[k], c)
      if (v !== undefined) {
        if (r === undefined)
          r = {}
        r[k] = v
      }
    }
    return r
  },
  (o = empty, cIn) => {
    let c = cIn
    for (const k in template)
      c = set(template[k], o[k], c)
    return c
  })

export const identity = lens(id, conserve)

export const props = (...ks) => pick(R.zipObj(ks, ks))

const show = (...labels) => x => console.log(...labels, x) || x

export const log = (...labels) => lens(show(...labels, "get"), show(...labels, "set"))

export default compose
