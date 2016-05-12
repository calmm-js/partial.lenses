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
Constant.prototype.map = function () {return this}
Constant.prototype.of = Const

//

const warned = {}

const warn = message => {
  if (!(message in warned)) {
    warned[message] = message
    console.warn("partial.lenses:", message)
  }
}

//

const unArray  = x => x && x.constructor === Array  ? x : undefined
const unObject = x => x && x.constructor === Object ? x : undefined

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

export const remove = R.curry((l, s) => setI(toRamda(l), undefined, s))

export const removeAll = R.curry((lens, data) => {
  warn("`removeAll` is deprecated and will be removed in next major version --- use a different approach.")
  while (get(lens, data) !== undefined)
    data = remove(lens, data)
  return data
})

const setI = (l, x, s) => l(() => Ident(x))(s).value
const getI = (l, s) => l(Const)(s).value
const modifyI = (l, x2x, s) => l(y => Ident(x2x(y)))(s).value
const lensI = (getter, setter) => toFn => target =>
  toFn(getter(target)).map(focus => setter(focus, target))

export const lens = R.curry(lensI)
export const modify = R.curry((l, x2x, s) => modifyI(toRamda(l), x2x, s))
export const set = R.curry((l, x, s) => setI(toRamda(l), x, s))
export const get = R.curry((l, s) => getI(toRamda(l), s))

export const chain = R.curry((x2yL, xL) =>
  compose(xL, choose(xO => xO === undefined ? nothing : x2yL(xO))))

export const just = x => lensI(R.always(x), snd)

export const choose = x2yL => toFunctor => target => {
  const l = toRamda(x2yL(target))
  return R.map(focus => setI(l, focus, target), toFunctor(getI(l, target)))
}

export const nothing = lensI(snd, snd)

export const orElse =
  R.curry((d, l) => choose(x => getI(toRamda(l), x) !== undefined ? l : d))

export const choice = (...ls) => choose(x => {
  const i = ls.findIndex(l => getI(toRamda(l), x) !== undefined)
  return 0 <= i ? ls[i] : nothing
})

export const replace = R.curry((inn, out) =>
  lensI(x => R.equals(x, inn) ? out : x,
        toConserve(y => R.equals(y, out) ? inn : y)))

export const defaults = replace(undefined)
export const required = inn => replace(inn, undefined)
export const define = v => R.compose(required(v), defaults(v))

export const normalize = transform =>
  lensI(toPartial(transform), toConserve(toPartial(transform)))

const isProp = x => typeof x === "string"

export const prop = assert("a string", isProp)

const toRamdaProp = k => lensI(o => unObject(o) && o[k], (v, oIn) => {
  const o = unObject(oIn)
  return v === undefined ? deleteKey(k, o) : setKey(k, v, o)
})

export const find = predicate => choose(xs => {
  if (unArray(xs)) {
    const i = xs.findIndex(predicate)
    return i < 0 ? append : i
  } else {
    return append
  }
})

export const findWith = (...ls) => {
  const lls = toRamda(compose(...ls))
  return compose(find(x => getI(lls, x) !== undefined), lls)
}

const isIndex = x => Number.isInteger(x) && 0 <= x

export const index = assert("a non-negative integer", isIndex)

const toRamdaIndex = i => lensI(xs => unArray(xs) && xs[i], (x, xsIn) => {
  const xs = unArray(xsIn)
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

export const append = lensI(snd, (x, xs) =>
  x === undefined ? xs : unArray(xs) ? xs.concat([x]) : [x])

export const filter = p => lensI(xs => unArray(xs) && xs.filter(p), (ys, xsIn) => {
  const xs = unArray(xsIn)
  return conserve(dropped(R.concat(ys || [], (xs || []).filter(R.complement(p)))), xs)
})

export const augment = template => lensI(
  x => {
    if (unObject(x)) {
      const z = {...x}
      for (const k in template)
        z[k] = template[k](x)
      return z
    } else {
      return undefined
    }
  },
  toConserve((y, cIn) => {
    if (unObject(y)) {
      const c = unObject(cIn) || {}
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
  }))

export const pick = template => lensI(
  c => {
    let r
    for (const k in template) {
      const v = getI(toRamda(template[k]), c)
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
      c = setI(toRamda(template[k]), o[k], c)
    return c
  })

export const identity = lensI(id, conserve)

export const props = (...ks) => pick(R.zipObj(ks, ks))

const show = (...labels) => x => console.log(...labels, x) || x

export const log = (...labels) =>
  lensI(show(...labels, "get"), show(...labels, "set"))

export const sequence = toApplicative => target =>
  warn("`sequence` is experimental and might be removed, renamed or changed semantically before next major release") ||
  R.sequence(Ident, R.map(toApplicative, target))
  .map(R.pipe(R.filter(x => x !== undefined), dropped))

export default compose
