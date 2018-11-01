import * as I from 'infestines'
import * as R from 'ramda'

export function lazy(ty2ty) {
  let memo = x => {
    memo = ty2ty(rec)
    return memo(x)
  }
  const rec = x => memo(x)
  return rec
}

export const any = I.id

export const and = R.pipe

export const or = (...ps) => x => {
  const es = [],
    n = ps.length
  for (let i = 0; i < n; ++i) {
    try {
      return ps[i](x)
    } catch (e) {
      es.push([ps[i], e])
    }
  }
  throw Error(`or(${ps}): ${x}`)
}

export const fromPredicate = p => x => {
  if (p(x)) return x
  throw Error(`fromPredicate(${p}): ${JSON.stringify(x)}`)
}

const type = t => fromPredicate(x => typeof x === t)
export const instanceOf = c => fromPredicate(x => x instanceof c)

const isFreezable = x =>
  I.isArray(x) ||
  (x instanceof Object &&
    !(x instanceof Promise || x instanceof Int8Array || x instanceof Error))
const isFrozen = x => !isFreezable(x) || Object.isFrozen(x)
const isDeepFrozen = x =>
  !isFreezable(x) ||
  (Object.isFrozen(x) &&
    !Object.getOwnPropertyNames(x).find(k => !isDeepFrozen(x[k])))

export const frozen = fromPredicate(isFrozen)

export const deepFrozen = fromPredicate(isDeepFrozen)

export const deepFreeze = x =>
  isFrozen(x)
    ? x
    : (Object.getOwnPropertyNames(x).forEach(k => deepFreeze(x[k])),
      Object.freeze(x))

export const integer = fromPredicate(Number.isInteger)
export const nonNegative = and(integer, fromPredicate(x => 0 <= x))

export const boolean = type('boolean')
export const number = type('number')
export const string = type('string')
export const undef = fromPredicate(x => x === undefined)
export const def = fromPredicate(x => x !== undefined)

export const array = ty =>
  and(instanceOf(Array), xs => {
    const ys = R.map(ty, xs)
    return Object.isFrozen(xs) ? Object.freeze(ys) : ys
  })

export const arity = n => fromPredicate(x => x.length === n)

export const props = R.map

const isThenable = x => null != x && I.isFunction(x.then)

export const maybeThenable = t => v => (isThenable(v) ? v.then(t) : t(v))

export const thenable = t => v => {
  if (!isThenable(v)) throw Error(`Expected thenable, but got ${v}`)
  return v.then(t)
}

export const object = template => object => {
  const result = {}
  if (!(object instanceof Object)) throw Error(`Expected object, got ${object}`)
  if (!I.hasKeysOfU(template, object))
    throw Error(
      `Expected object with keys ${I.keys(template)}, got ${I.keys(object)}`
    )
  for (const k in template) result[k] = template[k](object[k])
  return result
}

export function fn(argTys, resultTy) {
  if (!(argTys instanceof Array))
    throw Error(`fn arg types must be an array, given ${argTys}`)
  return fn => {
    if (!I.isFunction(fn)) throw Error(`Expected function, got ${fn}`)
    if (argTys.length < fn.length)
      throw Error(`Expected arity ${argTys.length}, but got ${fn.length}`)
    return I.arityN(argTys.length, (...argIns) => {
      const n = argIns.length,
        args = Array(n)
      for (let i = 0; i < n; ++i) args[i] = argTys[i](argIns[i])
      return resultTy(fn.apply(this, args))
    })
  }
}

export const fnVarN = (minArity, argsTy, resultTy) => fn => {
  if (!I.isFunction(fn)) throw Error(`Expected function, got ${fn}`)
  return R.curryN(minArity, (...argIns) => {
    const n = argIns.length,
      args = Array(n)
    for (let i = 0; i < n; ++i) args[i] = argsTy(argIns[i])
    return resultTy(fn.apply(this, args))
  })
}
