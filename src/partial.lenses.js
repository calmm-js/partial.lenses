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
  empty: always(null),
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

const emptyArray = []
const emptyObject = {}

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

const assert = process.env.NODE_ENV === "production" ? always(id) : check

//

const emptyArrayToUndefined = xs => xs.length ? xs : undefined

//

const toPartial = x2y => x => x !== undefined ? x2y(x) : x

//

const seemsLens = x => typeof x === "function" && x.length === 3

const lifted = assert("a lens", seemsLens)

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

const getInverseU = (l, x) => setU(l, x, undefined)

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

const lensU = (get, set) => (F, x2yF, x) => F.map(y => set(y, x), x2yF(get(x)))
const collectU = (l, s) =>
  PartialList.toArray(lift(l)(Collect, PartialList.of, s))

export const remove = curry2((l, s) => setU(l, undefined, s))
export const lens = curry2(lensU)
export const modify = curry3(modifyU)
export const set = curry3(setU)
export const get = curry2(getU)
export const getInverse = curry2(getInverseU)
export const collect = curry2(collectU)

export const foldMapOf = curry4((m, l, to, s) => {
  const Const = ConstOf(m)
  return lift(l)(Const, to, s)
})

export const inverse = iso => (F, inner, x) =>
  F.map(x => getU(iso, x), inner(getInverseU(iso, x)))

export const chain = curry2((x2yL, xL) =>
  [xL, choose(xO => xO !== undefined ? x2yL(xO) : nothing)])

export const just = x => lensU(always(x), snd)

export const choose = x2l => (F, x2yF, x) => lift(x2l(x))(F, x2yF, x)

export const nothing = lensU(snd, snd)

export const orElse =
  curry2((d, l) => choose(x => getU(l, x) !== undefined ? l : d))

export const choice = (...ls) => choose(x => {
  const i = ls.findIndex(l => getU(l, x) !== undefined)
  return 0 <= i ? ls[i] : nothing
})

const replacer = (inn, out) => x => acyclicEqualsU(x, inn) ? out : x
const normalizer = fn => (F, inner, x) => F.map(fn, inner(fn(x)))

export const replace = curry2((inn, out) => (F, x2yF, x) =>
  F.map(replacer(out, inn), x2yF(replacer(inn, out)(x))))

export const defaults = out => (F, x2yF, x) =>
  F.map(replacer(out, undefined), x2yF(x !== undefined ? x : out))
export const required = inn => replace(inn, undefined)
export const define = v => normalizer(x => x !== undefined ? x : v)

export const valueOr = v => (_F, x2yF, x) =>
  x2yF(x !== undefined && x !== null ? x : v)

export const normalize = transform => normalizer(toPartial(transform))

const isProp = x => typeof x === "string"

export const prop = assert("a string", isProp)

const getProp = (k, o) => isObject(o) ? o[k] : undefined
const setProp = (k, v, o) =>
  v !== undefined ? assocPartialU(k, v, o) : dissocPartialU(k, o)

const liftProp = k => (F, x2yF, x) =>
  F.map(v => setProp(k, v, x), x2yF(getProp(k, x)))

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
  return [find(x => getU(lls, x) !== undefined), lls]
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
const liftIndex = i => (F, x2yF, xs) =>
  F.map(y => setIndex(i, y, xs), x2yF(getIndex(i, xs)))

export const append = lensU(snd, (x, xs) =>
  x !== undefined ? isArray(xs) ? xs.concat([x]) : [x] : unArray(xs))

export const filter = p => lensU(xs => unArray(xs) && xs.filter(p), (ys, xs) =>
  emptyArrayToUndefined(mkArray(ys).concat(mkArray(xs).filter(x => !p(x)))))

export const augment = template => lensU(
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
    } else {
      return undefined
    }
  })

function getPick(template, x) {
  let r
  for (const k in template) {
    const v = getU(template[k], x)
    if (v !== undefined) {
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
  lensU(show(labels, "get"), show(labels, "set"))

export const sequence = (A, x2yA, xs) =>
  A === Ident
  ? emptyArrayToUndefined(mapPartialU(x2yA, mkArray(xs)))
  : A.map(emptyArrayToUndefined, PartialArray.traverse(A, x2yA, mkArray(xs)))

export const optional = (A, x2yA, x) =>
  x !== undefined ? x2yA(x) : A.of(undefined)

export const fromArrayBy = id =>
  warn("`fromArrayBy` is experimental and might be removed, renamed or changed semantically before next major release") ||
  lensU(xs => {
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

export default compose
