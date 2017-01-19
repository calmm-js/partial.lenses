import * as L from "../src/partial.lenses"
import * as R from "ramda"

//

const clamp = (min, max, x) => Math.max(min, Math.min(x, max))

const isNat = x => x === (x >> 0) && 0 <= x

const seemsArrayLike = x =>
  x instanceof Object && isNat(x.length) || typeof x === "string"

const fromArrayLike = xs => R.map(i => xs[i], R.range(0, xs.length))

const isDefined = x => x !== undefined

const Collect = {empty: R.always([]), concat: (x, y) => x.concat(y)}
const toCollect = x => isDefined(x) ? [x] : []

const maxPartial = (x, y) => isDefined(x) && (!isDefined(y) || x > y) ? x : y
const minPartial = (x, y) => isDefined(x) && (!isDefined(y) || x < y) ? x : y

const foldx = concat => R.curry((f, r, t, s) =>
  concatAs((x, i) => r => f(r, x, i), {empty: () => R.identity, concat}, t, s)(r))
const concatDefined = m => R.curry((t, s) => concat(m, [t, optional], s))

// Optics

export const modify = L.modify
export const remove = R.curry((o, s) => set(o, undefined, s))
export const set = R.curry((o, x, s) => modify(o, R.always(x), s))

export const compose = L.compose

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

export const lazy = L.lazy

export const log = L.log

export const toFunction = L.toFunction

// Traversals

export const concatAs = L.concatAs
export const concat = concatAs(R.identity)

export const merge = concat
export const mergeAs = concatAs

export const foldl = foldx(R.pipe)
export const foldr = foldx(R.compose)

export const collect = R.curry((t, s) => collectAs(R.identity, t, s))
export const collectAs = R.curry((to, t, s) =>
  concatAs(R.pipe(to, toCollect), Collect, t, s))

export const maximum = concat({empty: () => {}, concat: maxPartial})
export const minimum = concat({empty: () => {}, concat: minPartial})

export const product = concatDefined({empty: () => 1, concat: R.multiply})
export const sum = concatDefined({empty: () => 0, concat: R.add})

export const branch = L.branch

export const elems = L.elems
export const values = L.values

// Lenses

export const get = L.get

export const lens = L.lens

export const augment = L.augment

export const defaults = v => replace(undefined, v)
export const define = v => [required(v), defaults(v)]
export const normalize = xi2x =>
  lens((x, i) => isDefined(x) ? xi2x(x, i) : x,
       (x, _, i) => isDefined(x) ? xi2x(x, i) : x)
export const required = v => replace(v, undefined)
export const rewrite = xi2x =>
  lens(R.identity, (x, _, i) => isDefined(x) ? xi2x(x, i) : x)

export const append = choose(s => seemsArrayLike(s) ? s.length : 0)
export const filter = p => lens(
  xs => seemsArrayLike(xs)
    ? fromArrayLike(xs).filter((x, i) => p(x, i))
    : undefined,
  (ys, xs) => {
    const zs = [].concat(
      fromArrayLike(ys || []),
      seemsArrayLike(xs) ? fromArrayLike(xs).filter((x, i) => !p(x, i)) : [])
    return zs.length ? zs : undefined
  })
export const find = p => choose(xs => {
  if (!seemsArrayLike(xs))
    return append
  const i = fromArrayLike(xs).findIndex((x, i) => p(x, i))
  return i < 0 ? append : i
})
export const findWith = (...ls) => {
  const lls = compose(...ls)
  return [find(x => isDefined(get(lls, x))), lls]
}
export const index = L.index
export const slice = R.curry((b, e) => lens(
  xs => seemsArrayLike(xs) ? fromArrayLike(xs).slice(b, e) : undefined,
  (ys, xs) => {
    xs = seemsArrayLike(xs) ? fromArrayLike(xs) : []
    return [].concat(xs.slice(0,
                              clamp(0, xs.length,
                                    undefined === b ? 0 :
                                    b < 0 ? xs.length + b :
                                    b)),
                     fromArrayLike(ys || ""),
                     xs.slice(clamp(0, xs.length,
                                    undefined === e ? xs.length :
                                    e < 0 ? xs.length + e :
                                    e)))
  }
))

export const prop = L.prop
export const props = (...ps) => pick(R.zipObj(ps, ps))

export const valueOr = v =>
  lens(s => s === null || s === undefined ? v : s, R.identity)

export const orElse = R.curry((d, l) =>
  choose(x => isDefined(get(l, x)) ? l : d))

export const just = v => to(R.always(v))
export const to = a2b => lens(a2b, (_, s) => s)

export const pick = L.pick
export const replace = R.curry((i, o) =>
  iso(x => R.equals(i, x) ? o : x, x => R.equals(o, x) ? i : x))

// Isomorphisms

export const getInverse = R.curry((i, s) => set(i, s, undefined))

export const iso = lens

export const identity = iso(R.identity, R.identity)
export const inverse = i => iso(getInverse(i), get(i))
