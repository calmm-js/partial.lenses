import * as T from "./type"

const T_maybeData = T.any
const T_data = T.def
const T_index = T.or(T.integer, T.string, T.undef)

const T_functor = T.object({
  map: T.fn([T.fn([T.any], T.any), T.any], T.any)
})

const T_applicative = T.object({
  map: T.fn([T.fn([T.any], T.any), T.any], T.any),
  of: T.fn([T.any], T.any),
  ap: T.fn([T.any, T.any], T.any)
})

const T_optic = T.lazy(T_optic => T.or(
  T.integer,
  T.string,
  T.array(T_optic),
  T.fn([T.or(T_applicative, T_functor),
        T.fn([T_maybeData, T_index], T_maybeData),
        T_maybeData,
        T_index],
       T_maybeData)))

const T_traversal = T_optic
const T_lens = T_optic
const T_isomorphism = T_optic

//

export const modify = T.fn([T_optic,
                            T.fn([T_maybeData, T_index], T_maybeData),
                            T_maybeData],
                           T_maybeData)
export const remove = T.fn([T_optic, T_maybeData], T_maybeData)
export const set = T.fn([T_optic, T_maybeData, T_maybeData], T_maybeData)

export const compose = T.fnVar(T_optic, T_optic)

export const chain = T.fn([T.fn([T_data, T_index], T_optic), T_lens], T_optic)
export const choice = T.fnVar(T_lens, T_optic)
export const choose = T.fn([T.fn([T_maybeData, T_index], T_optic)], T_optic)
export const optional = T_optic
export const when = T.fn([T.fn([T_maybeData, T_index], T.any)], T_optic)
export const zero = T_optic

export const lazy = T.fn([T.fn([T_optic], T_optic)], T_optic)

export const log = T.fnVar(T.string, T_optic)

export const collect = T.fn([T_traversal, T_maybeData], T.array(T_data))
export const collectMap = T.fn([T_traversal,
                                T.fn([T_maybeData, T_index], T_maybeData),
                                T_maybeData],
                               T.array(T_data))
export const foldMapOf = T.fn([T.object({empty: T.fn([], T.any),
                                         concat: T.fn([T.any, T.any], T.any)}),
                               T_traversal,
                               T.fn([T_maybeData, T_index], T.any),
                               T_maybeData],
                              T.any)

export const branch = T.fn([T.props(T_traversal)], T_traversal)

export const sequence = T_traversal

export const get = T.fn([T_lens, T_maybeData], T_maybeData)

export const lens =
  T.fn([T.fn([T_maybeData, T_index], T_maybeData),
        T.fn([T_maybeData, T_maybeData, T_index], T_maybeData)],
       lens)

export const augment = T.fn([T.props(T.fn([T.any], T_data))], T_lens)

export const defaults = T.fn([T_data], T_lens)
export const define = T.fn([T_data], T_lens)
export const normalize = T.fn([T.fn([T_data, T_index], T_data)], T_lens)
export const required = T.fn([T_data], T_lens)
export const rewrite = T.fn([T.fn([T_data, T_index], T_data)], T_lens)

export const append = T_lens
export const filter = T.fn([T.fn([T_data, T_index], T.any)], T_lens)
export const find = T.fn([T.fn([T_data, T_index], T.any)], T_lens)
export const findWith = T.fnVar(T_lens, T_lens)
export const index = T.fn([T.integer], T_lens)

export const prop = T.fn([T.string], T_lens)
export const props = T.fnVar(T.string, T_lens)

export const valueOr = T.fn([T.any], T_lens)

export const orElse = T.fn([T_lens, T_lens], T_lens)

export const just = T.fn([T_maybeData], T_lens)
export const to = T.fn([T.fn([T_maybeData, T_index], T_maybeData)], T_lens)

export const pick = T.fn([T.props(T_lens)], T_lens)
export const replace = T.fn([T_maybeData, T_maybeData], T_lens)

export const getInverse = T.fn([T_isomorphism, T_maybeData], T_maybeData)

export const iso = T.fn([T.fn([T_maybeData], T_maybeData),
                         T.fn([T_maybeData], T_maybeData)],
                        T_isomorphism)

export const identity = T_isomorphism
export const inverse = T.fn([T_isomorphism], T_isomorphism)
