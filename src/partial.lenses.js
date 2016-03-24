import R from "ramda"

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

export const lift = l => {
  switch (typeof l) {
  case "string": return prop(l)
  case "number": return index(l)
  default:       return l
  }
}

export const compose = (...ls) =>
  ls.length === 0 ? identity    :
  ls.length === 1 ? lift(ls[0]) :
  R.compose(...ls.map(lift))

export const remove = R.curry((l, s) => R.set(lift(l), undefined, s))

export const removeAll = R.curry((lens, data) => {
  while (view(lens, data) !== undefined)
    data = remove(lens, data)
  return data
})

export const lens = R.lens
export const over = R.curry((l, x2x, s) => R.over(lift(l), x2x, s))
export const update = R.curry((l, x, s) => R.set(lift(l), x, s))
export const view = R.curry((l, s) => R.view(lift(l), s))

export const choose = x2yL => toFunctor => target => {
  const l = lift(x2yL(target))
  return R.map(focus => R.set(l, focus, target), toFunctor(R.view(l, target)))
}

export const firstOf = (l, ...ls) => choose(x => {
  const lls = [l, ...ls]
  return lls[Math.max(0, lls.findIndex(l => view(l, x) !== undefined))]
})

export const replace = R.curry((inn, out) =>
  R.lens(x => R.equals(x, inn) ? out : x,
         toConserve(y => R.equals(y, out) ? inn : y)))

export const defaults = replace(undefined)
export const required = inn => replace(inn, undefined)
export const define = v => R.compose(required(v), defaults(v))

export const normalize = transform =>
  R.lens(toPartial(transform), toConserve(toPartial(transform)))

export const prop = k =>
  R.lens(o => o && o[k],
         (v, o) => v === undefined ? deleteKey(k, o) : setKey(k, v, o))

export const find = predicate => choose(xs => {
  if (xs === undefined)
    return append
  const i = xs.findIndex(predicate)
  return i < 0 ? append : i
})

export const findWith = (l, ...ls) => {
  const lls = compose(l, ...ls)
  return compose(find(x => R.view(lls, x) !== undefined), lls)
}

export const index = i => R.lens(xs => xs && xs[i], (x, xs) => {
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

export const append = R.lens(() => {}, (x, xs) =>
  x === undefined ? xs : xs === undefined ? [x] : xs.concat([x]))

export const filter = p => R.lens(xs => xs && xs.filter(p), (ys, xs) =>
  conserve(dropped(R.concat(ys || [], (xs || []).filter(R.complement(p)))), xs))

export const augment = template => R.lens(
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

export const pick = template => R.lens(
  c => {
    let r
    for (const k in template) {
      const v = view(template[k], c)
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
      c = update(template[k], o[k], c)
    return c
  })

export const identity = R.lens(R.identity, conserve)

export const props = (k, ...ks) => {
  const kks = [k, ...ks]
  return pick(R.zipObj(kks, kks))
}

export default compose
