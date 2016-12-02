import {
  acyclicEqualsU,
  assocPartialU,
  curry2,
  curry3,
  curry4,
  dissocPartialU,
  id,
  isArray,
  isObject,
  mapPartialU,
  values,
  zipObjPartialU
} from "infestines"

//

const apply = (x2y, x) => x2y(x)
const always = x => _ => x
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

const ConstOf = Monoid => ({
  map: snd,
  of: always(Monoid.empty()),
  ap: (x2yA, xA) => Monoid.concat(xA, x2yA)
})

const PartialList = {
  of: x => x !== undefined ? [x, null] : null,
  empty: () => null,
  cons: (h, t) => h !== undefined ? [h, t] : t,
  revConcat(xs, ys) {
    while (xs) {
      ys = [xs[0], ys]
      xs = xs[1]
    }
    return ys
  },
  reverse: xs => PartialList.revConcat(xs, null),
  concat: (xs, ys) => PartialList.revConcat(PartialList.reverse(xs), ys),
  toArray(xs) {
    const ys = []
    while (xs) {
      ys.push(xs[0])
      xs = xs[1]
    }
    return ys
  }
}

const Collect = ConstOf(PartialList)

const csnoc = t => h => PartialList.cons(h, t)

const PartialArray = {
  traverse(A, x2yA, xs) {
    let s = A.of(PartialList.empty())
    let i = xs.length
    while (i)
      s = A.ap(A.map(csnoc, s), x2yA(xs[--i]))
    return A.map(PartialList.toArray, s)
  }
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

const unArray = x => isArray(x) ? x : undefined

const mkArray = x => isArray(x) ? x : emptyArray

//

const check = (expected, predicate) => x => {
  if (predicate(x))
    return x
  else
    throw new Error(`Expected ${expected}, but got ${x}.`)
}

const assert = process.env.NODE_ENV === "production" ? () => id : check

//

const emptyArrayToUndefined = xs => xs.length ? xs : undefined

//

const emptyArray = []
const emptyObject = {}

//

const toPartial = transform => x => x !== undefined ? transform(x) : x

//

const seemsLens = x => typeof x === "function" && x.length === 2

const lifted = assert("a lens", seemsLens)

function composed(lenses) {
  switch (lenses.length) {
    case 0:  return identity
    case 1:  return lift(lenses[0])
    default: return (c, x) => {
      let i = lenses.length
      let r = lift(lenses[--i])(c, x)
      do {
        r = lift(lenses[--i])(c, r)
      } while (0 < i)
      return r
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

function setI(l, x, s) {
  switch (typeof l) {
    case "string":   return setProp(l, x, s)
    case "number":   return setIndex(l, x, s)
    case "function": return lifted(l)(Ident, () => x)(s)
    default:         return modifyComposedI(l, () => x, s)
  }
}

function getComposedI(ls, s0)  {
  let s = s0
  for (let i=0, n=ls.length; i<n; ++i)
    s = getI(ls[i], s)
  return s
}

function getI(l, s) {
  switch (typeof l) {
    case "string":   return getProp(l, s)
    case "number":   return getIndex(l, s)
    case "function": return lifted(l)(Const, Const.of)(s)
    default:         return getComposedI(l, s)
  }
}

const getInverseI = (l, x) => setI(l, x, undefined)

function modifyComposedI(ls, x2x, s0) {
  let n = ls.length

  let r = s0
  const ss = []

  for (let i=0; i<n; ++i) {
    ss.push(r)
    const l = ls[i]
    switch (typeof l) {
      case "string":
        r = getProp(l, r)
        break
      case "number":
        r = getIndex(l, r)
        break
      default:
        r = composed(ls.slice(i))(Ident, x2x)(r)
        n = i
        break
    }
  }

  if (n === ls.length)
    r = x2x(r)

  while (0 <= --n) {
    const l = ls[n]
    switch (typeof l) {
      case "string": r = setProp(l, r, ss[n]); break
      case "number": r = setIndex(l, r, ss[n]); break
    }
  }

  return r
}

function modifyI(l, x2x, s) {
  switch (typeof l) {
    case "string":   return setProp(l, x2x(getProp(l, s)), s)
    case "number":   return setIndex(l, x2x(getIndex(l, s)), s)
    case "function": return lifted(l)(Ident, x2x)(s)
    default:         return modifyComposedI(l, x2x, s)
  }
}

const lensI = (getter, setter) => (c, inner) => target =>
  c.map(focus => setter(focus, target), inner(getter(target)))
const collectI = (l, s) =>
  PartialList.toArray(lift(l)(Collect, PartialList.of)(s))

export const remove = curry2((l, s) => setI(l, undefined, s))
export const lens = curry2(lensI)
export const modify = curry3(modifyI)
export const set = curry3(setI)
export const get = curry2(getI)
export const getInverse = curry2(getInverseI)
export const collect = curry2(collectI)

export const foldMapOf = curry4((m, l, to, s) => {
  const Const = ConstOf(m)
  return lift(l)(Const, to)(s)
})

export const inverse = iso => (c, inner) => x =>
  c.map(x => getI(iso, x), inner(getInverseI(iso, x)))

export const chain = curry2((x2yL, xL) =>
  [xL, choose(xO => xO !== undefined ? x2yL(xO) : nothing)])

export const just = x => lensI(always(x), snd)

export const choose = x2yL => (c, inner) => target =>
  lift(x2yL(target))(c, inner)(target)

export const nothing = lensI(snd, snd)

export const orElse =
  curry2((d, l) => choose(x => getI(l, x) !== undefined ? l : d))

export const choice = (...ls) => choose(x => {
  const i = ls.findIndex(l => getI(l, x) !== undefined)
  return 0 <= i ? ls[i] : nothing
})

const replacer = (inn, out) => x => acyclicEqualsU(x, inn) ? out : x
const normalizer = fn => (c, inner) => x => c.map(fn, inner(fn(x)))

export const replace = curry2((inn, out) => (c, inner) => x =>
  c.map(replacer(out, inn), inner(replacer(inn, out)(x))))

export const defaults = out => (c, inner) => x =>
  c.map(replacer(out, undefined), inner(x !== undefined ? x : out))
export const required = inn => replace(inn, undefined)
export const define = v => normalizer(x => x !== undefined ? x : v)

export const valueOr = v => (_c, inner) => x =>
  inner(x !== undefined && x !== null ? x : v)

export const normalize = transform => normalizer(toPartial(transform))

const isProp = x => typeof x === "string"

export const prop = assert("a string", isProp)

const getProp = (k, o) => isObject(o) ? o[k] : undefined
const setProp = (k, v, o) =>
  v !== undefined ? assocPartialU(k, v, o) : dissocPartialU(k, o)

const liftProp = k => (c, inner) => o =>
  c.map(v => setProp(k, v, o), inner(getProp(k, o)))

export const find = predicate => choose(xs => {
  if (isArray(xs)) {
    const i = xs.findIndex(predicate)
    return i < 0 ? append : i
  } else {
    return append
  }
})

export function findWith(...ls) {
  const lls = compose(...ls)
  return [find(x => getI(lls, x) !== undefined), lls]
}

const isIndex = x => Number.isInteger(x) && 0 <= x

export const index = assert("a non-negative integer", isIndex)

const nulls = n => Array(n).fill(null)

const getIndex = (i, xs) => isArray(xs) ? xs[i] : undefined
function setIndex(i, x, xs) {
  if (x !== undefined) {
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
    if (!isArray(xs))
      return undefined
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
const liftIndex = i => (c, inner) => xs =>
  c.map(x => setIndex(i, x, xs), inner(getIndex(i, xs)))

export const append = lensI(snd, (x, xs) =>
  x !== undefined ? isArray(xs) ? xs.concat([x]) : [x] : unArray(xs))

export const filter = p => lensI(xs => unArray(xs) && xs.filter(p), (ys, xs) =>
  emptyArrayToUndefined(mkArray(ys).concat(mkArray(xs).filter(x => !p(x)))))

export const augment = template => lensI(
  x => {
    if (isObject(x)) {
      const z = {...x}
      for (const k in template)
        z[k] = template[k](z)
      return z
    } else {
      return undefined
    }
  },
  (y, cIn) => {
    if (isObject(y)) {
      const c = isObject(cIn) ? cIn : emptyObject
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
    } else {
      return undefined
    }
  })

function getPick(template, target) {
  let r
  for (const k in template) {
    const v = getI(template[k], target)
    if (v !== undefined) {
      if (!r)
        r = {}
      r[k] = v
    }
  }
  return r
}
const setPick = (template, target) => value => {
  const o = value || emptyObject
  let c = target
  for (const k in template)
    c = setI(template[k], o[k], c)
  return c
}
export const pick = template => (c, inner) => target =>
  c.map(setPick(template, target), inner(getPick(template, target)))

export const identity = snd

export const props = (...ks) => pick(zipObjPartialU(ks, ks))

const show = (...labels) => x => console.log(...labels, x) || x

export const log = (...labels) =>
  lensI(show(...labels, "get"), show(...labels, "set"))

export const sequence = (c, inner) => target =>
  c === Ident
  ? emptyArrayToUndefined(mapPartialU(inner, mkArray(target)))
  : c.map(emptyArrayToUndefined, PartialArray.traverse(c, inner, mkArray(target)))

export const optional = (c, inner) => target =>
  target !== undefined ? inner(target) : c.of(undefined)

export const fromArrayBy = id =>
  warn("`fromArrayBy` is experimental and might be removed, renamed or changed semantically before next major release") ||
  lensI(xs => {
    if (isArray(xs)) {
      const o = {}
      for (let i=0, n=xs.length; i<n; ++i) {
        const x = xs[i]
        o[x[id]] = x
      }
      return o
    }
  },
  o => isObject(o) ? values(o) : undefined)

export default compose
