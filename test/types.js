import * as T from './type'

const T_deepFrozenOnDev =
  process.env.NODE_ENV === 'production' ? T.any : T.deepFrozen

const T_maybeDataI = T.deepFreeze
const T_maybeDataO = T_deepFrozenOnDev

const T_dataI = T.and(T.def, T.deepFreeze)
const T_dataO = T.and(T.def, T_deepFrozenOnDev)

const T_index = T.or(T.nonNegative, T.string, T.undef)
const T_sliceIndex = T.or(T.number, T.undef)

const T_functor = T.object({
  map: T.fn([T.fn([T.any], T.any), T.any], T.any)
})

const T_applicative = T.object({
  of: T.fn([T.any], T.any),
  ap: T.fn([T.any, T.any], T.any),
  map: T.fn([T.fn([T.any], T.any), T.any], T.any)
})

const T_monad = T.object({
  chain: T.fn([T.fn([T.any], T.any), T.any], T.any),
  of: T.fn([T.any], T.any),
  ap: T.fn([T.any, T.any], T.any),
  map: T.fn([T.fn([T.any], T.any), T.any], T.any)
})

const T_opticFnOf = Category =>
  T.fn(
    [T_maybeDataO, T_index, Category, T.fn([T_maybeDataO, T_index], T.any)],
    T.any
  )

const T_opticOf = Category =>
  T.lazy(T_optic =>
    T.or(
      T.nonNegative,
      T.string,
      T.array(T_optic),
      T.fn([T_maybeDataO, T_index], T_maybeDataI),
      T_opticFnOf(Category)
    )
  )

const T_optic = T_opticOf(T.or(T_monad, T_applicative, T_functor))

const T_transform = T_opticOf(T_monad)
const T_traversal = T_opticOf(T.or(T_monad, T_applicative))
const T_lens = T_optic
const T_isomorphism = T_lens

const T_monoid = T.object({
  empty: T.fn([], T.any),
  concat: T.fn([T.any, T.any], T.any)
})

const template = c => T.lazy(rec => T.props(T.or(c, rec)))

// Internals

export const Constant = T_functor

export const Identity = T_monad

export const IdentityAsync = T_monad

export const toFunction = T.fn(
  [T_optic],
  T_opticFnOf(T.or(T_monad, T_applicative, T_functor))
)

// Operations on optics

export const assign = T.fn(
  [T_optic, T.instanceOf(Object), T_maybeDataI],
  T_maybeDataO
)
export const modify = T.fn(
  [T_optic, T.fn([T_maybeDataO, T_index], T_maybeDataI), T_maybeDataI],
  T_maybeDataO
)
export const modifyAsync = modify
export const remove = T.fn([T_optic, T_maybeDataI], T_maybeDataO)
export const set = T.fn([T_optic, T_maybeDataI, T_maybeDataI], T_maybeDataO)
export const transform = T.fn([T_optic, T_maybeDataI], T_maybeDataO)
export const transformAsync = transform
export const traverse = T.fn(
  [
    T.or(T_monad, T_applicative, T_functor),
    T.fn([T_maybeDataO, T_index], T.any),
    T_optic,
    T_maybeDataI
  ],
  T.any
)

// Nesting

export const compose = T.fnVarN(0, T_optic, T_optic)
export const flat = T.fnVarN(0, T_optic, T_optic)

// Recursing

export const lazy = T.fn([T.fn([T_optic], T_optic)], T_optic)

// Adapting

export const choices = T.fnVarN(1, T_optic, T_optic)
export const choose = T.fn([T.fn([T_maybeDataO, T_index], T_optic)], T_optic)
export const cond = T.fnVarN(0, T.any, T_optic)
export const condOf = T.fnVarN(1, T.any, T_optic)
export const ifElse = T.fn(
  [T.fn([T_maybeDataO, T_index], T.any), T_optic, T_optic],
  T_optic
)
export const iftes = T.fnVarN(2, T.any, T_optic)
export const orElse = T.fn([T_optic, T_optic], T_optic)

// Querying

export const chain = T.fn([T.fn([T_dataO, T_index], T_optic), T_lens], T_optic)
export const choice = T.fnVarN(0, T_optic, T_optic)
export const optional = T_optic
export const unless = T.fn([T.fn([T_maybeDataO, T_index], T.any)], T_optic)
export const when = T.fn([T.fn([T_maybeDataO, T_index], T.any)], T_optic)
export const zero = T_optic

// Transforming

export const assignOp = T.fn([T.instanceOf(Object)], T_optic)
export const modifyOp = T.fn(
  [T.fn([T_maybeDataO, T_index], T_maybeDataI)],
  T_optic
)
export const removeOp = T_optic
export const setOp = T.fn([T_maybeDataI], T_optic)

// Debugging

export const log = T.fnVarN(0, T.string, T_optic)

// Sequencing

export const seq = T.fnVarN(0, T_optic, T_transform)

// Creating new traversals

export const branchOr = T.fn([T_optic, template(T_traversal)], T_traversal)
export const branch = T.fn([template(T_traversal)], T_traversal)
export const branches = T.fnVarN(0, T.string, T_optic)

// Traversals and combinators

export const children = T_traversal
export const elems = T_traversal
export const elemsTotal = T_traversal
export const entries = T_traversal
export const flatten = T_traversal
export const keys = T_traversal
export const leafs = T_traversal
export const matches = T.fn([T.instanceOf(RegExp)], T_optic)
export const query = T.fnVarN(0, T_optic, T_optic)
export const satisfying = T.fn(
  [T.fn([T_maybeDataI, T_index], T.any)],
  T_traversal
)
export const values = T_traversal

// Folds over traversals

export const all = T.fn(
  [T.fn([T_maybeDataO, T_index], T.any), T_traversal, T_maybeDataI],
  T.boolean
)
export const and = T.fn([T_traversal, T_maybeDataI], T.boolean)

export const any = all

export const collect = T.fn([T_traversal, T_maybeDataI], T.array(T.def))
export const collectAs = T.fn(
  [T.fn([T_maybeDataO, T_index], T.any), T_traversal, T_maybeDataI],
  T.array(T.def)
)

export const concat = T.fn([T_monoid, T_traversal, T_maybeDataI], T.any)
export const concatAs = T.fn(
  [T.fn([T_maybeDataO, T_index], T.any), T_monoid, T_traversal, T_maybeDataI],
  T.any
)

export const countIf = T.fn(
  [T.fn([T_maybeDataO, T_index], T.any), T_traversal, T_maybeDataI],
  T.number
)
export const count = T.fn([T_traversal, T_maybeDataI], T.number)

export const countsAs = T.fn(
  [T.fn([T_maybeDataO, T_index], T.any), T_traversal, T_maybeDataI],
  T.instanceOf(Map)
)
export const counts = T.fn([T_traversal, T_maybeDataI], T.instanceOf(Map))

export const foldl = T.fn(
  [
    T.fn([T.any, T_maybeDataO, T_index], T.any),
    T.any,
    T_traversal,
    T_maybeDataI
  ],
  T.any
)
export const foldr = foldl

export const forEach = T.fn(
  [T.fn([T_maybeDataO, T_index], T.any), T_traversal, T_maybeDataI],
  T.undef
)

export const forEachWith = T.fn(
  [
    T.fn([], T.any),
    T.fn([T.any, T_maybeDataO, T_index], T.any),
    T_traversal,
    T_maybeDataI
  ],
  T.any
)

export const isDefined = T.fn([T_traversal, T_maybeDataI], T.boolean)
export const isEmpty = T.fn([T_traversal, T_maybeDataI], T.boolean)

export const joinAs = T.fn(
  [
    T.fn([T_maybeDataO, T_index], T.or(T.string, T.undef)),
    T.string,
    T_traversal,
    T_maybeDataI
  ],
  T.string
)

export const join = T.fn([T.string, T_traversal, T_maybeDataI], T.string)

export const maximumBy = T.fn(
  [T.fn([T_maybeDataO, T_index], T.any), T_traversal, T_maybeDataI],
  T.any
)
export const maximum = T.fn([T_traversal, T_maybeDataI], T.any)

export const mean = T.fn([T_traversal, T_maybeDataI], T.number)
export const meanAs = T.fn(
  [
    T.fn([T_maybeDataO, T_index], T.or(T.number, T.undef)),
    T_traversal,
    T_maybeDataI
  ],
  T.number
)

export const minimumBy = maximumBy
export const minimum = maximum

export const none = all

export const or = and

export const productAs = T.fn(
  [T.fn([T_maybeDataO, T_index], T.number), T_traversal, T_maybeDataI],
  T.number
)
export const product = count

export const sumAs = productAs
export const sum = product

export const select = T.fn([T_traversal, T_maybeDataI], T.any)
export const selectAs = T.fn(
  [T.fn([T_maybeDataO, T_index], T.any), T_traversal, T_maybeDataI],
  T.any
)

// Operations on lenses

export const get = T.fn([T_lens, T_maybeDataI], T_maybeDataO)

// Creating new lenses

export const lens = T.fn(
  [
    T.fn([T_maybeDataO, T_index], T_maybeDataI),
    T.fn([T_maybeDataO, T_maybeDataO, T_index], T_maybeDataI)
  ],
  T_lens
)

export const setter = T.fn(
  [T.fn([T_maybeDataO, T_maybeDataO, T_index], T_maybeDataI)],
  T_lens
)

export const foldTraversalLens = T.fn(
  [T.fn([T_traversal, T_maybeDataO], T.any), T_traversal],
  T_lens
)

// Enforcing invariants

export const defaults = T.fn([T_dataI], T_lens)
export const define = T.fn([T_dataI], T_lens)
export const normalize = T.fn([T.fn([T_dataO, T_index], T_maybeDataI)], T_lens)
export const required = T.fn([T_dataI], T_lens)
export const reread = T.fn([T.fn([T_dataO, T_index], T_maybeDataI)], T_lens)
export const rewrite = T.fn([T.fn([T_dataO, T_index], T_maybeDataI)], T_lens)

// Lensing arrays

export const append = T_lens
export const filter = T.fn([T.fn([T_maybeDataO, T_index], T.any)], T_lens)
export const find = T.fn([T.fn([T_maybeDataO, T_index], T.any)], T_lens)
export const findWith = T.fn([T_optic], T_optic)
export const first = T_lens
export const index = T.fn([T.nonNegative], T_lens)
export const last = T_lens
export const prefix = T.fn([T_sliceIndex], T_lens)
export const slice = T.fn([T_sliceIndex, T_sliceIndex], T_lens)
export const suffix = T.fn([T_sliceIndex], T_lens)

// Lensing objects

export const pickIn = T.fn([template(T_lens)], T_lens)
export const prop = T.fn([T.string], T_lens)
export const props = T.fnVarN(0, T.string, T_lens)
export const propsOf = T.fn([T.instanceOf(Object)], T_lens)
export const removable = T.fnVarN(0, T.string, T_lens)

// Providing defaults

export const valueOr = T.fn([T.any], T_lens)

// Transforming data

export const pick = T.fn([template(T_lens)], T_lens)
export const replace = T.fn([T_maybeDataI, T_maybeDataI], T_lens)

// Operations on isomorphisms

export const getInverse = T.fn([T_isomorphism, T_maybeDataI], T_maybeDataO)

// Creating new isomorphisms

export const iso = T.fn(
  [T.fn([T_maybeDataO], T_maybeDataI), T.fn([T_maybeDataO], T_maybeDataI)],
  T_isomorphism
)

// Isomorphism combinators

export const array = T.fn([T_isomorphism], T_isomorphism)
export const inverse = T.fn([T_isomorphism], T_isomorphism)

// Basic isomorphisms

export const complement = T_isomorphism
export const identity = T_isomorphism
export const is = T.fn([T.def], T_lens)

// Array isomorphisms

export const indexed = T_isomorphism
export const reverse = T_isomorphism
export const singleton = T_isomorphism

// Object isomorphisms

export const disjoint = T.fn([T.fn([T.string], T.string)], T_isomorphism)
export const keyed = T_isomorphism

// Standard isomorphisms

export const uri = T_isomorphism
export const uriComponent = T_isomorphism
export const json = T.fn([T.any], T_isomorphism)

// String isomorphisms

export const dropPrefix = T.fn([T.string], T_isomorphism)
export const dropSuffix = T.fn([T.string], T_isomorphism)
export const replaces = T.fn([T.string, T.string], T_isomorphism)
export const split = T.fn([T.string], T_isomorphism)
export const uncouple = T.fn([T.string], T_isomorphism)

// Arithmetic isomorphisms

export const add = T.fn([T.number], T_isomorphism)
export const divide = T.fn([T.number], T_isomorphism)
export const multiply = T.fn([T.number], T_isomorphism)
export const negate = T_isomorphism
export const subtract = T.fn([T.number], T_isomorphism)

// Interop

export const pointer = T.fn([T.string], T_lens)

// Auxiliary

export const seemsArrayLike = T.fn([T.any], T.boolean)
