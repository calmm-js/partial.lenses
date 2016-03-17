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

const conserve = (c0, c1) => R.equals(c0, c1) ? c0 : c1

const toConserve = f => (y, c0) => conserve(c0, f(y, c0))

//

export const lift = l => {
  switch (typeof l) {
  case "string": return L.prop(l)
  case "number": return L.index(l)
  default:       return l
  }
}

const L = (l, ...ls) =>
  ls.length === 0 ? lift(l) : R.compose(lift(l), ...ls.map(lift))

L.compose = L
L.delete = R.curry((l, s) => R.set(lift(l), undefined, s))
L.deleteAll = R.curry((lens, data) => {
  while (L.view(lens, data) !== undefined)
    data = L.delete(lens, data)
  return data
})
L.lens = R.lens
L.over = R.curry((l, x2x, s) => R.over(lift(l), x2x, s))
L.set = R.curry((l, x, s) => R.set(lift(l), x, s))
L.view = R.curry((l, s) => R.view(lift(l), s))

L.choose = x2yL => toFunctor => target => {
  const l = lift(x2yL(target))
  return R.map(focus => R.set(l, focus, target), toFunctor(R.view(l, target)))
}

L.firstOf = (l, ...ls) => L.choose(x => {
  const lls = [l, ...ls]
  return lls[Math.max(0, lls.findIndex(l => L.view(l, x) !== undefined))]
})

L.replace = R.curry((inn, out) =>
  R.lens(x => R.equals(x, inn) ? out : x,
         toConserve(y => R.equals(y, out) ? inn : y)))

L.default = L.replace(undefined)
L.required = inn => L.replace(inn, undefined)
L.define = v => R.compose(L.required(v), L.default(v))

L.normalize = transform =>
  R.lens(toPartial(transform), toConserve(toPartial(transform)))

L.prop = k =>
  R.lens(o => o && o[k],
         (v, o) => v === undefined ? deleteKey(k, o) : setKey(k, v, o))

L.find = predicate => L.choose(xs => {
  if (xs === undefined)
    return L.append
  const i = xs.findIndex(predicate)
  return i < 0 ? L.append : i
})

L.findWith = (l, ...ls) => {
  const lls = L(l, ...ls)
  return L(L.find(x => R.view(lls, x) !== undefined), lls)
}

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

L.append = R.lens(() => {}, (x, xs) =>
  x === undefined ? xs : xs === undefined ? [x] : xs.concat([x]))

L.filter = p => R.lens(xs => xs && xs.filter(p), (ys, xs) =>
  conserve(xs, dropped(R.concat(ys || [], (xs || []).filter(R.complement(p))))))

L.augment = template => R.lens(
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

L.pick = template => R.lens(
  c => {
    let r
    for (const k in template) {
      const v = L.view(template[k], c)
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
      c = L.set(template[k], o[k], c)
    return c
  })

L.identity = R.lens(R.identity, R.identity)

L.props = (k, ...ks) => {
  const kks = [k, ...ks]
  return R.lens(
    (o = empty) => {
      let r
      kks.forEach(k => {
        if (k in o) {
          if (!r)
            r = {}
          r[k] = o[k]
        }
      })
      return r
    },
    toConserve((s = empty, o = empty) => {
      let r
      for (const k in o) {
        if (!R.contains(k, kks)) {
          if (!r)
            r = {}
          r[k] = o[k]
        }
      }
      kks.forEach(k => {
        if (k in s) {
          if (!r)
            r = {}
          r[k] = s[k]
        }
      })
      return r
    }))
}

export default L
