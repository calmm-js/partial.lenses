import * as R from "ramda"

//

function Identity(value) {this.value = value}
const Ident = x => new Identity(x)
Identity.prototype.map = function (x2y) {return new Identity(x2y(this.value))}
Identity.prototype.of = Ident
Identity.prototype.ap = function (x) {return new Identity(this.value(x.value))}

//

function Constant(value) {this.value = value}
const Const = x => new Constant(x)
const Single = x => Const([x])
Constant.prototype.map = function () {return this}
Constant.prototype.of = Const
Constant.prototype.ap = function (x) {return new Const(R.concat(this.value, x.value))}

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

const curry2 = fn => function (a, b) {
  switch (arguments.length) {
    case 1:  return b => fn(a, b)
    default: return fn(a, b)
  }
}

const curry3 = fn => function (a, b, c) {
  switch (arguments.length) {
    case 1:  return curry2((b, c) => fn(a, b, c))
    case 2:  return c => fn(a, b, c)
    default: return fn(a, b, c)
  }
}

//

const isArray  = x => x && x.constructor === Array
const isObject = x => x && x.constructor === Object

const unArray  = x =>  isArray(x) ? x : undefined

const mkArray = x => isArray(x) ? x : []

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

const dropped = xs => {
  for (const _ in xs)
    return xs
  return undefined
}

//

const empty = {}

const deleteKey = (k, o) => {
  const r = Object.assign({}, o)
  delete r[k]
  return dropped(r)
}

const setKey = (k, v, o) => {
  const r = Object.assign({}, o)
  r[k] = v
  return r
}

//

const toPartial = transform => x => undefined === x ? x : transform(x)

//

const filtered = toPartial(xs => dropped(xs.filter(x => x !== undefined)))

//

const seemsLens = x => typeof x === "function" && x.length === 1

const lifted = assert("a lens", seemsLens)

const composed = lenses => {
  switch (lenses.length) {
    case 0:  return identity
    case 1:  return lift(lenses[0])
    default: return constructor => x => {
      let i = lenses.length
      let r = lift(lenses[--i])(constructor)(x)
      do {
        r = lift(lenses[--i])(constructor)(r)
      } while (0 < i)
      return r
    }
  }
}

const lift = l => {
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

export const removeAll = curry2((lens, data) => {
  warn("`removeAll` is deprecated and will be removed in next major version --- use a different approach.")
  while (get(lens, data) !== undefined)
    data = remove(lens, data)
  return data
})

const setI = (l, x, s) => {
  switch (typeof l) {
    case "string":   return setProp(l, x, s)
    case "number":   return setIndex(l, x, s)
    case "function": return lifted(l)(Ident)(() => Ident(x))(s).value
    default:         return composed(l)(Ident)(() => Ident(x))(s).value
  }
}

const getI = (l, s) => {
  switch (typeof l) {
    case "string":   return getProp(l, s)
    case "number":   return getIndex(l, s)
    case "function": return lifted(l)(Const)(Const)(s).value
    default: {
      let r = s
      for (let i=0, n=l.length; i<n; ++i)
        r = getI(l[i], r)
      return r
    }
  }
}

const modifyI = (l, x2x, s) => {
  switch (typeof l) {
    case "string":   return setProp(l, x2x(getProp(l, s)), s)
    case "number":   return setIndex(l, x2x(getIndex(l, s)), s)
    case "function": return lifted(l)(Ident)(y => Ident(x2x(y)))(s).value
    default:         return composed(l)(Ident)(y => Ident(x2x(y)))(s).value
  }
}

const lensI = (getter, setter) => _c => inner => target =>
  inner(getter(target)).map(focus => setter(focus, target))
const collectI = (l, s) => l(Const)(Single)(s).value

export const remove = curry2((l, s) => setI(l, undefined, s))
export const lens = curry2(lensI)
export const modify = curry3(modifyI)
export const set = curry3(setI)
export const get = curry2(getI)
export const collect = curry2((l, s) =>
  warn("`collect` is experimental and might be removed, renamed or changed semantically before next major release") ||
  mkArray(filtered(collectI(lift(l), s))))

export const chain = curry2((x2yL, xL) =>
  compose(xL, choose(xO => xO === undefined ? nothing : x2yL(xO))))

export const just = x => lensI(R.always(x), snd)

export const choose = x2yL => constructor => inner => target =>
  lift(x2yL(target))(constructor)(inner)(target)

export const nothing = lensI(snd, snd)

export const orElse =
  curry2((d, l) => choose(x => getI(l, x) !== undefined ? l : d))

export const choice = (...ls) => choose(x => {
  const i = ls.findIndex(l => getI(l, x) !== undefined)
  return 0 <= i ? ls[i] : nothing
})

const replacer = (inn, out) => x => R.equals(x, inn) ? out : x
const normalizer = fn => _c => inner => x => inner(fn(x)).map(fn)

export const replace = curry2((inn, out) => _c => inner => x =>
  inner(replacer(inn, out)(x)).map(replacer(out, inn)))

export const defaults = out => _c => inner => x =>
  inner(x === undefined ? out : x).map(replacer(out, undefined))
export const required = inn => replace(inn, undefined)
export const define = v => normalizer(x => x === undefined ? v : x)

export const valueOr = v => _c => inner => x =>
  inner(x === undefined || x === null ? v : x)

export const normalize = transform => normalizer(toPartial(transform))

const isProp = x => typeof x === "string"

export const prop = assert("a string", isProp)

const getProp = (k, o) => isObject(o) ? o[k] : undefined
const setProp = (k, v, o) => {
  const oOut = isObject(o) ? o : empty
  return v === undefined ? deleteKey(k, oOut) : setKey(k, v, oOut)
}
const liftProp = k => _c => inner => o =>
  inner(getProp(k, o)).map(v => setProp(k, v, o))

export const find = predicate => choose(xs => {
  if (isArray(xs)) {
    const i = xs.findIndex(predicate)
    return i < 0 ? append : i
  } else {
    return append
  }
})

export const findWith = (...ls) => {
  const lls = compose(...ls)
  return compose(find(x => getI(lls, x) !== undefined), lls)
}

const isIndex = x => Number.isInteger(x) && 0 <= x

export const index = assert("a non-negative integer", isIndex)

const getIndex = (i, xs) => isArray(xs) ? xs[i] : undefined
const setIndex = (i, x, xs) => {
  if (x === undefined) {
    if (!isArray(xs))
      return undefined
    if (xs.length <= i)
      return dropped(xs)
    const ys = xs.slice(0)
    ys.splice(i, 1)
    return dropped(ys)
  } else {
    if (!isArray(xs))
      return Array(i).concat([x])
    if (xs.length <= i)
      return xs.concat(Array(i - xs.length), [x])
    const ys = xs.slice(0)
    ys[i] = x
    return ys
  }
}
const liftIndex = i => _c => inner => xs =>
  inner(getIndex(i, xs)).map(x => setIndex(i, x, xs))

export const append = lensI(snd, (x, xs) =>
  x === undefined ? unArray(xs) : isArray(xs) ? xs.concat([x]) : [x])

export const filter = p => lensI(xs => unArray(xs) && xs.filter(p), (ys, xs) =>
  dropped(mkArray(ys).concat(mkArray(xs).filter(x => !p(x)))))

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
      const c = isObject(cIn) ? cIn : empty
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
    } else {
      return undefined
    }
  })

export const pick = template => lensI(
  c => {
    let r
    for (const k in template) {
      const v = getI(template[k], c)
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
      c = setI(template[k], o[k], c)
    return c
  })

export const identity = _c => inner => inner

export const props = (...ks) => pick(R.zipObj(ks, ks))

const show = (...labels) => x => console.log(...labels, x) || x

export const log = (...labels) =>
  lensI(show(...labels, "get"), show(...labels, "set"))

export const sequence = constructor => inner => target =>
  warn("`sequence` is experimental and might be removed, renamed or changed semantically before next major release") ||
  R.traverse(constructor, inner, mkArray(target))
  .map(filtered)

export const optional =
  compose(lensI(toPartial(x => [x]),
                toPartial(([x]) => x)),
          sequence)

export const fromRamda = l => _c => l
const fantasy = () => {throw new Error("Sorry, `toRamda` is only fantasy!")}
export const toRamda = l => lift(l)(fantasy)

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
  o => isObject(o) ? R.values(o) : undefined)

export default compose
