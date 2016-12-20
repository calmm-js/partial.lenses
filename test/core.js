import * as I from "infestines"
import * as L from "../src/partial.lenses"

//

const Collect = {empty: I.always([]), concat: (x, y) => x.concat(y)}
const toCollect = x => I.isDefined(x) ? [x] : []

// Optics

export const modify = L.modify
export const remove = I.curry2((o, s) => set(o, undefined, s))
export const set = I.curry3((o, x, s) => modify(o, I.always(x), s))

export const compose = L.compose

export const chain = I.curry2((x2yO, xO) => [xO, choose((xM, i) => I.isDefined(xM) ? x2yO(xM, i) : zero)])
export const choice = (...ls) => choose(x => {const i = ls.findIndex(l => I.isDefined(get(l, x))); return 0 <= i ? ls[i] : zero})
export const choose = L.choose
export const when = p => choose((x, i) => p(x, i) ? identity : zero)
export const zero = L.zero

export const lazy = L.lazy

export const log = L.log

// Traversals

export const collect = I.curry2((t, s) => collectMap(t, I.id, s))
export const collectMap = I.curry3((t, to, s) => foldMapOf(Collect, t, I.pipe2(to, toCollect), s))
export const foldMapOf = L.foldMapOf

export const branch = L.branch

export const optional = when(I.isDefined)
export const sequence = L.sequence

// Lenses

export const get = L.get

export const lens = L.lens

export const augment = L.augment

export const defaults = v => replace(undefined, v)
export const define = v => [required(v), defaults(v)]
export const normalize = xi2x => lens((x, i) => I.isDefined(x) ? xi2x(x, i) : x, (x, _, i) => I.isDefined(x) ? xi2x(x, i) : x)
export const required = v => replace(v, undefined)
export const rewrite = xi2x => lens(I.id, (x, _, i) => I.isDefined(x) ? xi2x(x, i) : x)

export const append = choose(s => I.isArray(s) ? s.length : 0)
export const filter = L.filter
export const find = p => choose(xs => {if (!I.isArray(xs)) return append; const i = xs.findIndex((x, i) => p(x, i)); return i < 0 ? append : i})
export const findWith = (...ls) => {const lls = compose(...ls); return [find(x => I.isDefined(get(lls, x))), lls]}
export const index = L.index

export const prop = L.prop
export const props = (...ps) => pick(I.zipObjPartialU(ps, ps))

export const valueOr = v => lens(s => s === null || s === undefined ? v : s, I.id)

export const orElse = I.curry2((d, l) => choose(x => I.isDefined(get(l, x)) ? l : d))

export const just = v => to(I.always(v))
export const to = a2b => lens(a2b, (_, s) => s)

export const pick = L.pick
export const replace = I.curry2((i, o) => iso(x => I.acyclicEqualsU(i, x) ? o : x, x => I.acyclicEqualsU(o, x) ? i : x))

// Isomorphisms

export const getInverse = I.curry2((i, s) => set(i, s, undefined))

export const iso = lens

export const identity = iso(I.id, I.id)
export const inverse = i => iso(getInverse(i), get(i))
