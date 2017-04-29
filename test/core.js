import * as L from "../dist/partial.lenses.cjs"
import * as R from "ramda"

//

const clamp = (min, max, x) => Math.max(min, Math.min(x, max))

const isNat = x => x === (x >> 0) && 0 <= x

const seemsArrayLike = x =>
  x instanceof Object && isNat(x.length) || typeof x === "string"

const fromArrayLike = xs => R.map(i => xs[i], R.range(0, xs.length))

const isDefined = x => x !== undefined

const Collect = {empty: R.always(Object.freeze([])),
                 concat: (x, y) => Object.freeze(x.concat(y))}
const toCollect = x => Object.freeze(isDefined(x) ? [x] : [])

const maxPartial = (x, y) => isDefined(x) && (!isDefined(y) || x > y) ? x : y
const minPartial = (x, y) => isDefined(x) && (!isDefined(y) || x < y) ? x : y

const foldx = concat => R.curry((f, r, t, s) =>
  concatAs((x, i) => r => f(r, x, i), {empty: () => R.identity, concat}, t, s)(r))
const concatDefined = m => R.curry((t, s) => concat(m, [t, optional], s))

const toPartial = f => x => isDefined(x) ? f(x) : x

const Sum = {empty: () => 0, concat: R.add}

// Optics

export const toFunction = L.toFunction

// Operations on optics

export const modify = L.modify
export const remove = R.curry((o, s) => set(o, undefined, s))
export const set = R.curry((o, x, s) => modify(o, R.always(x), s))
export const traverse = L.traverse

// Sequencing

export const seq = L.seq

// Nesting

export const compose = L.compose

// Querying

export const chain = R.curry((x2yO, xO) =>
  [xO, choose((xM, i) => isDefined(xM) ? x2yO(xM, i) : zero)])
export const choice = (...ls) => choose(x => {
  const i = ls.findIndex(l => isDefined(get(l, x)))
  return 0 <= i ? ls[i] : zero
})
export const choose = L.choose
export const when = p => choose((x, i) => p(x, i) ? identity : zero)
export const optional = when(isDefined)
export const zero = L.zero

// Recursing

export const lazy = L.lazy

// Debugging

export const log = L.log

// Operations on traversals

export const concatAs = L.concatAs
export const concat = concatAs(R.identity)

// Folds over traversals

export const all = L.all

export const and = all(R.identity)

export const any = L.any

export const foldl = foldx(R.pipe)
export const foldr = foldx(R.compose)

export const collect = R.curry((t, s) => collectAs(R.identity, t, s))
export const collectAs = R.curry((to, t, s) =>
  concatAs(R.pipe(to, toCollect), Collect, t, s))

export const count = concatAs(x => x !== undefined ? 1 : 0, Sum)

export const maximum = concat({empty: () => {}, concat: maxPartial})
export const minimum = concat({empty: () => {}, concat: minPartial})

export const or = any(R.identity)

export const product = concatDefined({empty: () => 1, concat: R.multiply})
export const sum = concatDefined(Sum)

export const selectAs = L.selectAs
export const select = selectAs(R.identity)

// Creating new traversals

export const branch = L.branch

// Traversals and combinators

export const elems = L.elems
export const values = L.values
export const matches = L.matches

// Operations on lenses

export const get = L.get

// Creating new lenses

export const lens = L.lens

export const setter = lens(R.identity)

// Computing derived props

export const augment = L.augment

// Enforcing invariants

export const defaults = v => replace(undefined, v)
export const define = v => [required(v), defaults(v)]
export const normalize = xi2x =>
  lens((x, i) => isDefined(x) ? xi2x(x, i) : x,
       (x, _, i) => isDefined(x) ? xi2x(x, i) : x)
export const required = v => replace(v, undefined)
export const rewrite = xi2x =>
  lens(R.identity, (x, _, i) => isDefined(x) ? xi2x(x, i) : x)

// Lensing arrays

export const append = choose(s => seemsArrayLike(s) ? s.length : 0)
export const filter = p => lens(
  xs => seemsArrayLike(xs)
    ? Object.freeze(fromArrayLike(xs).filter((x, i) => p(x, i)))
    : undefined,
  (ys, xs) => {
    const zs = [].concat(
      fromArrayLike(ys || []),
      seemsArrayLike(xs) ? fromArrayLike(xs).filter((x, i) => !p(x, i)) : [])
    return zs.length ? Object.freeze(zs) : undefined
  })
export const find = p => choose(xs => {
  if (!seemsArrayLike(xs))
    return append
  const i = fromArrayLike(xs).findIndex((x, i) => p(x, i))
  return i < 0 ? append : i
})
export const findHint = L.findHint
export const findWith = (...ls) => {
  const lls = compose(...ls)
  return [find(x => isDefined(get(lls, x))), lls]
}
export const index = L.index
export const last = L.last
export const slice = R.curry((b, e) => lens(
  xs => seemsArrayLike(xs)
    ? Object.freeze(fromArrayLike(xs).slice(b, e))
    : undefined,
  (ys, xs) => {
    xs = seemsArrayLike(xs) ? fromArrayLike(xs) : []
    const i = clamp(0, xs.length,
                    undefined === b ? 0 :
                    b < 0 ? xs.length + b :
                    b)
    const zs = [].concat(xs.slice(0, i),
                         fromArrayLike(ys || ""),
                         xs.slice(clamp(i, xs.length,
                                        undefined === e ? xs.length :
                                        e < 0 ? xs.length + e :
                                        e)))
    return zs.length ? Object.freeze(zs) : undefined
  }
))

// Lensing objects

export const prop = L.prop
export const props = (...ps) => pick(R.zipObj(ps, ps))
export const removable = (...ps) =>
  rewrite(y => y instanceof Object && !R.any(p => R.has(p, y), ps) ? undefined : y)

// Providing defaults

export const valueOr = v =>
  lens(s => s === null || s === undefined ? v : s, R.identity)

// Adapting to data

export const orElse = R.curry((d, l) =>
  choose(x => isDefined(get(l, x)) ? l : d))

// Transforming data

export const pick = L.pick
export const replace = R.curry((i, o) =>
  iso(x => R.equals(i, x) ? o : x, x => R.equals(o, x) ? i : x))

// Operations on isomorphisms

export const getInverse = R.curry((i, s) => set(i, s, undefined))

// Creating new isomorphisms

export const iso = R.curry((xy, yx) => lens(x => xy(x), y => yx(y)))

// Isomorphisms and combinators

export const complement = iso(toPartial(R.not), toPartial(R.not))
export const identity = iso(R.identity, R.identity)
export const inverse = i => iso(getInverse(i), get(i))
