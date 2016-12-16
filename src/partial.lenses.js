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
  keys,
  mapPartialU
} from "infestines"

//

const emptyArray = []

//

const apply = (x2y, x) => x2y(x)

const snd = (_, c) => c

//

const Ident = {map: apply, of: id, ap: apply}

const Const = {map: snd}

function ConstOf(Monoid) {
  const concat = Monoid.concat
  return {
    map: snd,
    of: always((0,Monoid.empty)()),
    ap: (x2yA, xA) => concat(xA, x2yA)
  }
}

//

function Concat(l, r) {this.l = l; this.r = r}

const isConcat = n => n && n.constructor === Concat

const ap = (r, l) => isDefined(l) ? isDefined(r) ? new Concat(l, r) : l : r

const rconcat = t => h => ap(t, h)

function pushTo(n, ys) {
  while (isConcat(n)) {
    const l = n.l
    n = n.r
    if (isConcat(l)) {
      pushTo(l.l, ys)
      pushTo(l.r, ys)
    } else
      ys.push(l)
  }
  ys.push(n)
}

function toArray(n) {
  const ys = []
  if (isDefined(n))
    pushTo(n, ys)
  return ys
}

const Collect = {map: snd, of() {}, ap}

const collectMapU = (t, to, s) => toArray(lift(t)(Collect, to, s))

//

function traverse(A, x2yA, xs) {
  const ap = A.ap, map = A.map
  let s = (0,A.of)(undefined), i = xs.length
  while (i)
    s = ap(map(rconcat, s), x2yA(xs[--i]))
  return map(toArray, s)
}

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

const emptyObjectToUndefined = o => {
  if (!isObject(o))
    return o
  for (const k in o)
    return o
}

//

const toPartial = x2y => x => isDefined(x) ? x2y(x) : x

//

const isntConst = x => x !== Const

const notGet = A =>
  assert(A, isntConst, "Traversals cannot be `get`. Consider `collect`.")

//

const isProp = x => typeof x === "string"

const getProp = (k, o) => isObject(o) ? o[k] : undefined

const setProp = (k, v, o) =>
  isDefined(v) ? assocPartialU(k, v, o) : dissocPartialU(k, o)

const liftProp = k => (F, x2yF, x) =>
  (0,F.map)(v => setProp(k, v, x), x2yF(getProp(k, x)))

//

const isIndex = x => Number.isInteger(x) && 0 <= x

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
  (0,F.map)(y => setIndex(i, y, xs), x2yF(getIndex(i, xs)))

//

const seemsLens = x => typeof x === "function" && x.length === 3

const lifted = l => assert(l, seemsLens, "Expecting a lens.")

const close = (l, F, x2yF) => x => l(F, x2yF, x)

function composed(i, ls) {
  switch (ls.length - i) {
    case 0:  return identity
    case 1:  return lift(ls[i])
    default: return (F, x2yF, x) => {
      let n = ls.length
      x2yF = close(lift(ls[--n]), F, x2yF)
      while (i < --n)
        x2yF = close(lift(ls[n]), F, x2yF)
      return lift(ls[i])(F, x2yF, x)
    }
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
    case "function": return lifted(l)(Const, id, s)
    default:         return getComposed(l, s)
  }
}

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
        x = composed(i, ls)(Ident, x2x, x)
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

//

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
  if (!isObject(value))
    value = undefined
  for (const k in template)
    x = setU(template[k], value && value[k], x)
  return x
}

//

const show = (labels, dir) => x =>
  console.log.apply(console, labels.concat([dir, x])) || x

function branchOn(keys, vals) {
  const n = keys.length
  return (A, x2yA, x) => {
    notGet(A)
    const ap = A.ap,
          wait = (x, i) => 0 <= i ? y => wait(setProp(keys[i], y, x), i-1) : x
    let r = (0,A.of)(wait(x, n-1))
    if (!isObject(x))
      x = undefined
    for (let i=n-1; 0<=i; --i) {
      const v = x && x[keys[i]]
      r = ap(r, (vals ? vals[i](A, x2yA, v) : x2yA(v)))
    }
    return (0,A.map)(emptyObjectToUndefined, r)
  }
}

const normalizer = fn => (F, inner, x) => (0,F.map)(fn, inner(fn(x)))

const replacer = (inn, out) => x => acyclicEqualsU(x, inn) ? out : x

//

export function lift(l) {
  switch (typeof l) {
    case "string":   return liftProp(l)
    case "number":   return liftIndex(l)
    case "function": return lifted(l)
    default:         return composed(0,l)
  }
}

// Operations on optics

export const modify = curry3(modifyU)

export const remove = curry2((l, s) => setU(l, undefined, s))

export const set = curry3(setU)

// Nesting

export function compose() {
  switch (arguments.length) {
    case 0: return identity
    case 1: return arguments[0]
    default: {
      const n = arguments.length, lenses = Array(n)
      for (let i=0; i<n; ++i)
        lenses[i] = arguments[i]
      return lenses
    }
  }
}

// Querying

export const chain = curry2((x2yO, xO) =>
  [xO, choose(xM => isDefined(xM) ? x2yO(xM) : zero)])

export const choice = (...ls) => choose(x => {
  const i = ls.findIndex(l => isDefined(getU(l, x)))
  return i < 0 ? zero : ls[i]
})

export const choose = xM2o => (F, x2yF, x) => lift(xM2o(x))(F, x2yF, x)

export const when = p => (C, x2yC, x) => p(x) ? x2yC(x) : zero(C, x2yC, x)

export const optional = when(isDefined)

export function zero(C, x2yC, x) {
  const of = C.of
  return of ? of(x) : (0,C.map)(always(x), x2yC(undefined))
}

// Recursing

export function lazy(toLens) {
  let memo = (F, fn, x) => {
    memo = lift(toLens(rec))
    return memo(F, fn, x)
  }
  const rec = (F, fn, x) => memo(F, fn, x)
  return rec
}

// Debugging

export const log = (...labels) => iso(show(labels, "get"), show(labels, "set"))

// Operations on traversals

export const collect = curry2((t, s) => collectMapU(t, id, s))

export const collectMap = curry3(collectMapU)

export const foldMapOf = curry4((m, t, to, s) => lift(t)(ConstOf(m), to, s))

// Creating new traversals

export function branch(template) {
  const keys = []
  const vals = []
  for (const k in template) {
    keys.push(k)
    vals.push(lift(template[k]))
  }
  return branchOn(keys, vals)
}

// Traversals and combinators

export function sequence(A, x2yA, xs) {
  notGet(A)
  if (isArray(xs))
    return A === Ident
    ? emptyArrayToUndefined(mapPartialU(x2yA, xs))
    : (0,A.map)(emptyArrayToUndefined, traverse(A, x2yA, xs))
  else if (isObject(xs))
    return branchOn(keys(xs))(A, x2yA, xs)
  else
    return (0,A.of)(xs)
}

// Operations on lenses

export const get = curry2(getU)

// Creating new lenses

export const lens =
  curry2((get, set) => (F, x2yF, x) => (0,F.map)(y => set(y, x), x2yF(get(x))))

// Computing derived props

export const augment = template => lens(
  x => {
    const z = dissocPartialU(0, x)
    if (z)
      for (const k in template)
        z[k] = template[k](z)
    return z
  },
  (y, x) => {
    if (isObject(y)) {
      if (!isObject(x))
        x = undefined
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
          if (x && k in x)
            set(k, x[k])
      }
      return z
    }
  })

// Enforcing invariants

export const defaults = out => (F, x2yF, x) =>
  (0,F.map)(replacer(out, undefined), x2yF(isDefined(x) ? x : out))

export const required = inn => replace(inn, undefined)

export const define = v => normalizer(x => isDefined(x) ? x : v)

export const normalize = x2x => normalizer(toPartial(x2x))

export const rewrite = y2y => (F, x2yF, x) => (0,F.map)(toPartial(y2y), x2yF(x))

// Lensing arrays

export const append = lens(snd, (x, xs) =>
  isDefined(x) ? isArray(xs) ? xs.concat([x]) : [x] : unArray(xs))

export const filter = p => lens(xs => unArray(xs) && xs.filter(p), (ys, xs) =>
  emptyArrayToUndefined(mkArray(ys).concat(mkArray(xs).filter(x => !p(x)))))

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

export const index = x =>
  assert(x, isIndex, "`index` expects a non-negative integer.")

// Lensing objects

export const prop = x =>
  assert(x, isProp, "`prop` expects a string.")

export function props() {
  const n = arguments.length, template = {}
  for (let i=0; i<n; ++i) {
    const k = arguments[i]
    template[k] = k
  }
  return pick(template)
}

// Providing defaults

export const valueOr = v => (_F, x2yF, x) =>
  x2yF(isDefined(x) && x !== null ? x : v)

// Adapting to data

export const orElse =
  curry2((d, l) => choose(x => isDefined(getU(l, x)) ? l : d))

// Read-only mapping

export const to = x2y => (F, y2zF, x) => (0,F.map)(always(x), y2zF(x2y(x)))

export const just = x => to(always(x))

// Transforming data

export const pick = template => (F, x2yF, x) =>
  (0,F.map)(setPick(template, x), x2yF(getPick(template, x)))

export const replace = curry2((inn, out) => (F, x2yF, x) =>
  (0,F.map)(replacer(out, inn), x2yF(replacer(inn, out)(x))))

// Operations on isomorphisms

export const getInverse = curry2(setU)

// Creating new isomorphisms

export const iso =
  curry2((bwd, fwd) => (F, x2yF, x) => (0,F.map)(fwd, x2yF(bwd(x))))

// Isomorphisms and combinators

export const identity = (_F, x2yF, x) => x2yF(x)

export const inverse = iso => (F, inner, x) =>
  (0,F.map)(x => getU(iso, x), inner(setU(iso, x)))
