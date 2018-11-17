import * as I from 'infestines'

export * from 'infestines'

export const LENGTH = 'length'

export const addU = (x, y) => x + y
export const multiplyU = (x, y) => x * y

export const add = I.curry(addU)
export const multiply = I.curry(multiplyU)

export const divideBy = I.curry((d, n) => n / d)

export const negate = x => -x

export const not = x => !x

export const ltU = (x, y) => x < y
export const gtU = (x, y) => x > y

export const isInstanceOf = I.curry(I.isInstanceOfU)

export const protoless = o => I.assign(I.create(null), o)
export const protoless0 = I.freeze(protoless(I.object0))

export const replace = I.curry((p, r, s) => s.replace(p, r))

export function isPrimitiveData(x) {
  switch (typeof x) {
    case 'boolean':
    case 'number':
    case 'string':
      return true
    default:
      return false
  }
}

export const iterator = Symbol.iterator

export const thenU = I.Async.chain
export const then = I.curry(thenU)

export const thenIdentityU = I.IdentityAsync.chain

export const thenResolveU = (fn, x) =>
  I.isThenable(x) ? thenU(fn, x) : I.resolve(fn(x))

const EMPTY = 'empty'
const CONCAT = 'concat'

export function Monoid(concat, empty) {
  if (!I.isInstanceOfU(Monoid, this)) return I.freeze(new Monoid(concat, empty))
  this[CONCAT] = concat
  this[EMPTY] = empty
}

export const MonoidWith = (concat, empty) => Monoid(concat, I.always(empty))

export const MonoidAsyncOf = m => {
  const concat = m[CONCAT]
  return Monoid(
    (l, r) =>
      I.isThenable(l)
        ? thenU(
            l => (I.isThenable(r) ? thenU(r => concat(l, r), r) : concat(l, r)),
            l
          )
        : I.isThenable(r)
        ? thenU(r => concat(l, r), r)
        : concat(l, r),
    m[EMPTY]
  )
}

export const ProductMonoid = MonoidWith(multiplyU, 1)

export const SumMonoid = MonoidWith(addU, 0)

export const ConstantWith = (ap, empty) =>
  I.Applicative(I.sndU, I.always(empty), ap)

export const ConstantOf = m => ConstantWith(m[CONCAT], m[EMPTY]())

export const ConstantAsyncOf = I.pipe2U(MonoidAsyncOf, ConstantOf)
