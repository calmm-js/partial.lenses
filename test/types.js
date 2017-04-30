import * as T from "./type"

const T_deepFrozenOnDev =
  process.env.NODE_ENV === "production" ? T.any : T.deepFrozen

const T_maybeDataI = T.deepFreeze
const T_maybeDataO = T_deepFrozenOnDev

const T_dataI = T.and(T.def, T.deepFreeze)
const T_dataO = T.and(T.def, T_deepFrozenOnDev)

const T_index = T.or(T.nonNegative, T.string, T.undef)
const T_sliceIndex = T.or(T.integer, T.undef)

const T_functor = T.object({
  map: T.fn([T.fn([T.any], T.any), T.any], T.any)
})

const T_applicative = T.or(T.object({
  delay: T.fn([T.any], T.any),
  of: T.fn([T.any], T.any),
  ap: T.fn([T.any, T.any], T.any),
  map: T.fn([T.fn([T.any], T.any), T.any], T.any)
}), T.object({
  of: T.fn([T.any], T.any),
  ap: T.fn([T.any, T.any], T.any),
  map: T.fn([T.fn([T.any], T.any), T.any], T.any)
}))

const T_monad = T.object({
  chain: T.fn([T.fn([T.any], T.any), T.any], T.any),
  of: T.fn([T.any], T.any),
  ap: T.fn([T.any, T.any], T.any),
  map: T.fn([T.fn([T.any], T.any), T.any], T.any)
})

const T_opticFnOf = Category =>
  T.fn([Category,
        T.fn([T_maybeDataO, T_index], T.any),
        T_maybeDataO,
        T_index],
       T.any)

const T_opticOf = Category => T.lazy(T_optic => T.or(
  T.nonNegative,
  T.string,
  T.array(T_optic),
  T.fn([T_maybeDataO, T_index], T_maybeDataI),
  T_opticFnOf(Category)
))

const T_optic = T_opticOf(T.or(T_monad, T_applicative, T_functor))

const T_transform = T_opticOf(T_monad)
const T_traversal = T_opticOf(T.or(T_monad, T_applicative))
const T_lens = T_optic
const T_isomorphism = T_lens

const T_monoid = T.object({empty: T.fn([], T.any),
                           concat: T.fn([T.any, T.any], T.any)})

const hint = T.object({hint: T.number})
//

export const toFunction = T.fn([T_optic],
                               T_opticFnOf(T.or(T_applicative, T_functor)))

// Operations on optics

export const modify = T.fn([T_optic,
                            T.fn([T_maybeDataO, T_index], T_maybeDataI),
                            T_maybeDataI],
                           T_maybeDataO)
export const remove = T.fn([T_optic, T_maybeDataI], T_maybeDataO)
export const set = T.fn([T_optic, T_maybeDataI, T_maybeDataI], T_maybeDataO)
export const traverse = T.fn([T.or(T_monad, T_applicative, T_functor),
                              T.fn([T_maybeDataO, T_index], T.any),
                              T_optic,
                              T_maybeDataI],
                             T.any)

// Sequencing

export const seq = T.fnVar(T_optic, T_transform)

// Nesting

export const compose = T.fnVar(T_optic, T_optic)

// Querying

export const chain = T.fn([T.fn([T_dataO, T_index], T_optic), T_lens], T_optic)
export const choice = T.fnVar(T_lens, T_optic)
export const choose = T.fn([T.fn([T_maybeDataO, T_index], T_optic)], T_optic)
export const optional = T_optic
export const when = T.fn([T.fn([T_maybeDataO, T_index], T.any)], T_optic)
export const zero = T_optic

// Recursing

export const lazy = T.fn([T.fn([T_optic], T_optic)], T_optic)

// Debugging

export const log = T.fnVar(T.string, T_optic)

// Operations on traversals

export const concat = T.fn([T_monoid, T_traversal, T_maybeDataI], T.any)
export const concatAs = T.fn([T.fn([T_maybeDataO, T_index], T.any),
                              T_monoid,
                              T_traversal,
                              T_maybeDataI],
                             T.any)

// Folds over traversals

export const all = T.fn([T.fn([T_maybeDataO, T_index], T.any),
                         T_traversal,
                         T_maybeDataI],
                        T.boolean)
export const and = T.fn([T_traversal, T_maybeDataI], T.boolean)

export const any = T.fn([T.fn([T_maybeDataO, T_index], T.any),
                         T_traversal,
                         T_maybeDataI],
                        T.boolean)

export const collect = T.fn([T_traversal, T_maybeDataI], T.array(T.def))
export const collectAs = T.fn([T.fn([T_maybeDataO, T_index], T.any),
                               T_traversal,
                               T_maybeDataI],
                              T.array(T.def))

export const count = T.fn([T_traversal, T_maybeDataI], T.number)

export const foldl =
  T.fn([T.fn([T.any, T_maybeDataO, T_index], T.any),
        T.any,
        T_traversal,
        T_maybeDataI],
       T.any)
export const foldr = foldl

export const maximum = T.fn([T_traversal, T_maybeDataI], T.any)
export const minimum = T.fn([T_traversal, T_maybeDataI], T.any)

export const or = T.fn([T_traversal, T_maybeDataI], T.boolean)

export const product = count
export const sum = count

export const select = T.fn([T_traversal, T_maybeDataI], T.any)
export const selectAs =
  T.fn([T.fn([T_maybeDataO, T_index], T.any),
        T_traversal,
        T_maybeDataI],
       T.any)

// Creating new traversals

export const branch = T.fn([T.props(T_traversal)], T_traversal)

// Traversals and combinators

export const elems = T_traversal
export const values = T_traversal
export const matches = T.fn([T.instanceOf(RegExp)], T_optic)

// Operations on lenses

export const get = T.fn([T_lens, T_maybeDataI], T_maybeDataO)

// Creating new lenses

export const lens =
  T.fn([T.fn([T_maybeDataO, T_index], T_maybeDataI),
        T.fn([T_maybeDataO, T_maybeDataO, T_index], T_maybeDataI)],
       T_lens)

export const setter =
  T.fn([T.fn([T_maybeDataO, T_maybeDataO, T_index], T_maybeDataI)],
       T_lens)

// Computing derived props

export const augment = T.fn([T.props(T.fn([T.any], T_maybeDataI))], T_lens)

// Enforcing invariants

export const defaults = T.fn([T_dataI], T_lens)
export const define = T.fn([T_dataI], T_lens)
export const normalize = T.fn([T.fn([T_dataO, T_index], T_maybeDataI)], T_lens)
export const required = T.fn([T_dataI], T_lens)
export const rewrite = T.fn([T.fn([T_dataO, T_index], T_maybeDataI)], T_lens)

// Lensing arrays

export const append = T_lens
export const filter = T.fn([T.fn([T_maybeDataO, T_index], T.any)], T_lens)
export const find = T.fn([T.fn([T_maybeDataO, T_index], T.any)], T_lens)
export const findHint = T.fn([T.fn([T_maybeDataO, hint], T.any), hint], T_lens)
export const findWith = T.fnVar(T_lens, T_lens)
export const index = T.fn([T.nonNegative], T_lens)
export const last = T_lens
export const slice = T.fn([T_sliceIndex, T_sliceIndex], T_lens)

// Lensing objects

export const prop = T.fn([T.string], T_lens)
export const props = T.fnVar(T.string, T_lens)
export const removable = T.fnVar(T.string, T_lens)

// Providing defaults

export const valueOr = T.fn([T.any], T_lens)

// Adapting to data

export const orElse = T.fn([T_lens, T_lens], T_lens)

// Transforming data

export const pick = T.fn([T.props(T_lens)], T_lens)
export const replace = T.fn([T_maybeDataI, T_maybeDataI], T_lens)

// Operations on isomorphisms

export const getInverse = T.fn([T_isomorphism, T_maybeDataI], T_maybeDataO)

// Creating new isomorphisms

export const iso = T.fn([T.fn([T_maybeDataO], T_maybeDataI),
                         T.fn([T_maybeDataO], T_maybeDataI)],
                        T_isomorphism)

// Isomorphisms and combinators

export const complement = T_isomorphism
export const identity = T_isomorphism
export const inverse = T.fn([T_isomorphism], T_isomorphism)
