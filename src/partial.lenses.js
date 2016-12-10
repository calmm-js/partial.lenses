import {
  acyclicEqualsU,
  always,
  assocPartialU,
  curry2,
  curry3,
  curry4,
  dissocPartialU,
  id,
  isArray,
  isDefined,
  isObject,
  mapPartialU,
  unzipObjIntoU,
  values,
  zipObjPartialU
} from "infestines"

//

const apply = (x2y, x) => x2y(x)
const snd = (_, c) => c

//

const Ident = {
  map: apply,
  of: id,
  ap: apply
}

const Const = {
  map: snd,
  of: id
}

const ConstOf = Monoid => {
  const concat = Monoid.concat
  return {
    map: snd,
    of: always(Monoid.empty()),
    ap: (x2yA, xA) => concat(xA, x2yA)
  }
}

const pl_of = x => isDefined(x) ? [x, null] : null
function pl_revConcat(xs, ys) {
  while (xs) {
    ys = [xs[0], ys]
    xs = xs[1]
  }
  return ys
}
const pl_reverse = xs => pl_revConcat(xs, null)
function pl_toArray(xs) {
  const ys = []
  while (xs) {
    ys.push(xs[0])
    xs = xs[1]
  }
  return ys
}

const Collect = ConstOf({
  empty: always(null),
  concat: (xs, ys) => pl_revConcat(pl_reverse(xs), ys)
})

const pl_consr = t => h => isDefined(h) ? [h, t] : t

function pa_traverse(A, x2yA, xs) {
  let s = A.of(null)
  let i = xs.length
  while (i)
    s = A.ap(A.map(pl_consr, s), x2yA(xs[--i]))
  return A.map(pl_toArray, s)
}

//

const warn = process.env.NODE_ENV === "production" ? () => {} : (() => {
  const warned = {}

  return message => {
    if (!(message in warned)) {
      warned[message] = message
      console.warn("partial.lenses:", message)
    }
  }
})()

//

const emptyArray = []
const emptyObject = {}

//

const unArray = x => isArray(x) ? x : undefined

const mkArray = x => isArray(x) ? x : emptyArray

//

const assert = process.env.NODE_ENV === "production" ? id : (x, p, msg) => {
  if (process.env.NODE_ENV === "production" || p(x))
    return x
  throw new Error(msg)
}

//

const emptyArrayToUndefined = xs => xs.length ? xs : undefined

//

const toPartial = x2y => x => isDefined(x) ? x2y(x) : x

//

const isntConst = x => x !== Const
const notGet = A =>
  assert(A, isntConst, "Traversals cannot be `get`. Consider `collect`.")

//

const seemsLens = x => typeof x === "function" && x.length === 3

const lifted = l => assert(l, seemsLens, "Expecting a lens.")

const close = (l, F, x2yF) => x => l(F, x2yF, x)

function composed(ls) {
  switch (ls.length) {
    case 0:  return identity
    case 1:  return lift(ls[0])
    default: return (F, x2yF, x) => {
      let n = ls.length
      x2yF = close(lift(ls[--n]), F, x2yF)
      while (1 < n)
        x2yF = close(lift(ls[--n]), F, x2yF)
      return lift(ls[0])(F, x2yF, x)
    }
  }
}

function lift(l) {
  switch (typeof l) {
    case "string":   return liftProp(l)
    case "number":   return liftIndex(l)
    case "function": return lifted(l)
    default:         return composed(l)
  }
}

export function compose(...lenses) {
  switch (lenses.length) {
    case 0:  return identity
    case 1:  return lenses[0]
    default: return lenses
  }
}

function setU(l, x, s) {
  switch (typeof l) {
    case "string":   return setProp(l, x, s)
    case "number":   return setIndex(l, x, s)
    case "function": return lifted(l)(Ident, always(x), s)
    default:         return modifyComposed(l, always(x), s)
  }
}

function getComposed(ls, s)  {
  for (let i=0, n=ls.length; i<n; ++i)
    s = getU(ls[i], s)
  return s
}

function getU(l, s) {
  switch (typeof l) {
    case "string":   return getProp(l, s)
    case "number":   return getIndex(l, s)
    case "function": return lifted(l)(Const, Const.of, s)
    default:         return getComposed(l, s)
  }
}

const getInverseU = setU

function modifyComposed(ls, x2x, x) {
  let n = ls.length

  const xs = []

  for (let i=0; i<n; ++i) {
    xs.push(x)
    const l = ls[i]
    switch (typeof l) {
      case "string":
        x = getProp(l, x)
        break
      case "number":
        x = getIndex(l, x)
        break
      default:
        x = composed(ls.slice(i))(Ident, x2x, x)
        n = i
        break
    }
  }

  if (n === ls.length)
    x = x2x(x)

  while (0 <= --n) {
    const l = ls[n]
    switch (typeof l) {
      case "string": x = setProp(l, x, xs[n]); break
      case "number": x = setIndex(l, x, xs[n]); break
    }
  }

  return x
}

function modifyU(l, x2x, s) {
  switch (typeof l) {
    case "string":   return setProp(l, x2x(getProp(l, s)), s)
    case "number":   return setIndex(l, x2x(getIndex(l, s)), s)
    case "function": return lifted(l)(Ident, x2x, s)
    default:         return modifyComposed(l, x2x, s)
  }
}

const isoU = (bwd, fwd) => (F, x2yF, x) => F.map(fwd, x2yF(bwd(x)))
const lensU = (get, set) => (F, x2yF, x) => F.map(y => set(y, x), x2yF(get(x)))
const collectU = (l, s) => pl_toArray(lift(l)(Collect, pl_of, s))

export const remove = curry2((l, s) => setU(l, undefined, s))
export const iso = curry2(isoU)
export const lens = curry2(lensU)
export const modify = curry3(modifyU)
export const set = curry3(setU)
export const get = curry2(getU)
export const getInverse = curry2(getInverseU)
export const collect = curry2(collectU)

export const foldMapOf = curry4((m, l, to, s) => lift(l)(ConstOf(m), to, s))

export const inverse = iso => (F, inner, x) =>
  F.map(x => getU(iso, x), inner(getInverseU(iso, x)))

export const chain = curry2((x2yL, xL) =>
  [xL, choose(xO => isDefined(xO) ? x2yL(xO) : nothing)])

export const to = x2y => (F, y2zF, x) => F.map(always(x), y2zF(x2y(x)))
export const just = x => to(always(x))
export const nothing = just(undefined)

export const choose = x2l => (F, x2yF, x) => lift(x2l(x))(F, x2yF, x)

export const orElse =
  curry2((d, l) => choose(x => isDefined(getU(l, x)) ? l : d))

export const choice = (...ls) => choose(x => {
  const i = ls.findIndex(l => isDefined(getU(l, x)))
  return i < 0 ? nothing : ls[i]
})

const replacer = (inn, out) => x => acyclicEqualsU(x, inn) ? out : x
const normalizer = fn => (F, inner, x) => F.map(fn, inner(fn(x)))

export const replace = curry2((inn, out) => (F, x2yF, x) =>
  F.map(replacer(out, inn), x2yF(replacer(inn, out)(x))))

export const defaults = out => (F, x2yF, x) =>
  F.map(replacer(out, undefined), x2yF(isDefined(x) ? x : out))
export const required = inn => replace(inn, undefined)
export const define = v => normalizer(x => isDefined(x) ? x : v)

export const valueOr = v => (_F, x2yF, x) =>
  x2yF(isDefined(x) && x !== null ? x : v)

export const normalize = x2x => normalizer(toPartial(x2x))

export const rewrite = y2y => (F, x2yF, x) => F.map(toPartial(y2y), x2yF(x))

const isProp = x => typeof x === "string"

export const prop = x =>
  assert(x, isProp, "`prop` expects a string.")

const getProp = (k, o) => isObject(o) ? o[k] : undefined
const setProp = (k, v, o) =>
  isDefined(v) ? assocPartialU(k, v, o) : dissocPartialU(k, o)

const liftProp = k => (F, x2yF, x) =>
  F.map(v => setProp(k, v, x), x2yF(getProp(k, x)))

export const find = predicate => choose(xs => {
  if (!isArray(xs))
    return 0
  const i = xs.findIndex(predicate)
  return i < 0 ? append : i
})

export function findWith(...ls) {
  const lls = compose(...ls)
  return [find(x => isDefined(getU(lls, x))), lls]
}

const isIndex = x => Number.isInteger(x) && 0 <= x

export const index = x =>
  assert(x, isIndex, "`index` expects a non-negative integer.")

const nulls = n => Array(n).fill(null)

const getIndex = (i, xs) => isArray(xs) ? xs[i] : undefined
function setIndex(i, x, xs) {
  if (isDefined(x)) {
    if (!isArray(xs))
      return i < 0 ? undefined : nulls(i).concat([x])
    const n = xs.length
    if (n <= i)
      return xs.concat(nulls(i - n), [x])
    if (i < 0)
      return !n ? undefined : xs
    const ys = Array(n)
    for (let j=0; j<n; ++j)
      ys[j] = xs[j]
    ys[i] = x
    return ys
  } else {
    if (isArray(xs)) {
      const n = xs.length
      if (!n)
        return undefined
      if (i < 0 || n <= i)
        return xs
      if (n === 1)
        return undefined
      const ys = Array(n-1)
      for (let j=0; j<i; ++j)
        ys[j] = xs[j]
      for (let j=i+1; j<n; ++j)
        ys[j-1] = xs[j]
      return ys
    }
  }
}
const liftIndex = i => (F, x2yF, xs) =>
  F.map(y => setIndex(i, y, xs), x2yF(getIndex(i, xs)))

export const append = lensU(snd, (x, xs) =>
  isDefined(x) ? isArray(xs) ? xs.concat([x]) : [x] : unArray(xs))

export const filter = p => lensU(xs => unArray(xs) && xs.filter(p), (ys, xs) =>
  emptyArrayToUndefined(mkArray(ys).concat(mkArray(xs).filter(x => !p(x)))))

export const augment = template => lensU(
  x => {
    if (isObject(x)) {
      const z = {...x}
      for (const k in template)
        z[k] = template[k](z)
      return z
    }
  },
  (y, c) => {
    if (isObject(y)) {
      if (!isObject(c))
        c = emptyObject
      let z
      const set = (k, v) => {
        if (!z)
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
    }
  })

function getPick(template, x) {
  let r
  for (const k in template) {
    const v = getU(template[k], x)
    if (isDefined(v)) {
      if (!r)
        r = {}
      r[k] = v
    }
  }
  return r
}
const setPick = (template, x) => value => {
  const o = value || emptyObject
  for (const k in template)
    x = setU(template[k], o[k], x)
  return x
}
export const pick = template => (F, x2yF, x) =>
  F.map(setPick(template, x), x2yF(getPick(template, x)))

export const identity = (_F, x2yF, x) => x2yF(x)

export const props = (...ks) => pick(zipObjPartialU(ks, ks))

const show = (labels, dir) => x => console.log(...labels, dir, x) || x

export const log = (...labels) =>
  isoU(show(labels, "get"), show(labels, "set"))

export function lazy(toLens) {
  let memo = (F, fn, x) => {
    memo = lift(toLens(rec))
    return memo(F, fn, x)
  }
  const rec = (F, fn, x) => memo(F, fn, x)
  return rec
}

export const sequence = (A, x2yA, xs) =>
  notGet(A) === Ident
  ? emptyArrayToUndefined(mapPartialU(x2yA, mkArray(xs)))
  : A.map(emptyArrayToUndefined, pa_traverse(A, x2yA, mkArray(xs)))


export const when = p => (A, x2yA, x) => {
  notGet(A)
  return p(x) ? x2yA(x) : A.of(x)
}

export const optional = when(isDefined)
export const skip = when(always(false))

export function branch(template) {
  const keys = []
  const vals = []
  unzipObjIntoU(template, keys, vals)
  const n = keys.length
  return (A, x2yA, x) => {
    notGet(A)
    const wait = (x, i) => 0 <= i ? y => wait(setU(keys[i], y, x), i-1) : x
    let r = A.of(wait(x, n-1))
    for (let i=n-1; 0<=i; --i)
      r = A.ap(r, vals[i](A, x2yA, getU(keys[i], x)))
    return r
  }
}

export const fromArrayBy = id =>
  warn("`fromArrayBy` is experimental and might be removed, renamed or changed semantically before next major release") ||
  isoU(xs => {
    if (isArray(xs)) {
      const o = {}, n=xs.length
      for (let i=0; i<n; ++i) {
        const x = xs[i]
        o[x[id]] = x
      }
      return o
    }
  },
  o => isObject(o) ? values(o) : undefined)

export default (...ls) =>
  warn("default import will be removed. Use `compose` or array notation `[...]`.") ||
  compose(...ls)
