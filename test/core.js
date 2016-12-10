import * as I from "infestines"
import * as L from "../src/partial.lenses"

//

const toPartial = x2x => s => I.isDefined(s) ? x2x(s) : s
const List = {empty: I.always([]), concat: (x, y) => x.concat(y)}
const toList = x => I.isDefined(x) ? [x] : []

//

export const modify = L.modify
export const remove = I.curry2((o, s) => set(o, undefined, s))
export const set = I.curry3((o, x, s) => modify(o, I.always(x), s))

export const compose = L.compose
export const choose = L.choose
export const lazy = L.lazy
export const log = L.log

export const collect = I.curry2((t, s) => foldMapOf(List, t, toList, s))
export const foldMapOf = L.foldMapOf

export const branch = L.branch

export const when = p => choose(x => p(x) ? identity : skip)
export const optional = when(I.isDefined)
export const sequence = L.sequence
export const skip = L.skip

export const get = I.curry2((l, s) => collect(l, s)[0])

export const lens = L.lens

export const augment = L.augment

export const defaults = v => replace(undefined, v)
export const define = v => [required(v), defaults(v)]
export const normalize = x2x => iso(toPartial(x2x), toPartial(x2x))
export const required = v => replace(v, undefined)
export const rewrite = x2x => iso(I.id, toPartial(x2x))

export const append = choose(s => I.isArray(s) ? s.length : 0)
export const filter = L.filter
export const find = p => choose(xs => {if (!I.isArray(xs)) return append; const i = xs.findIndex(p); return i < 0 ? append : i})
export const findWith = (...ls) => {const lls = compose(...ls); return [find(x => I.isDefined(get(lls, x))), lls]}
export const index = L.index

export const prop = L.prop
export const props = (...ps) => pick(I.zipObjPartialU(ps, ps))

export const valueOr = v => lens(s => s === null || s === undefined ? v : s, I.id)

export const chain = I.curry2((x2yL, xL) => [xL, choose(xO => I.isDefined(xO) ? x2yL(xO) : nothing)])
export const choice = (...ls) => choose(x => {const i = ls.findIndex(l => I.isDefined(get(l, x))); return 0 <= i ? ls[i] : nothing})
export const to = a2b => lens(a2b, (_, s) => s)
export const just = v => to(I.always(v))
export const nothing = just(undefined)
export const orElse = I.curry2((d, l) => choose(x => I.isDefined(get(l, x)) ? l : d))

export const pick = L.pick
export const replace = I.curry2((i, o) => iso(x => I.acyclicEqualsU(i, x) ? o : x, x => I.acyclicEqualsU(o, x) ? i : x))

export const getInverse = I.curry2((i, s) => set(i, s, undefined))

export const iso = lens

export const fromArrayBy = L.fromArrayBy
export const identity = iso(I.id, I.id)
export const inverse = i => iso(getInverse(i), get(i))
