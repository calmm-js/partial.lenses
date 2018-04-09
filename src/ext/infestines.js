import * as I from 'infestines'

export * from 'infestines'

export const addU = (x, y) => x + y
export const multiplyU = (x, y) => x * y

export const add = I.curry(addU)
export const multiply = I.curry(multiplyU)

export const divideBy = I.curry((d, n) => n / d)

export const negate = x => -x

export const ltU = (x, y) => x < y
export const gtU = (x, y) => x > y

export const isInstanceOf = I.curry((Class, x) => x instanceof Class)

export const create = Object.create
export const protoless = o => I.assign(create(null), o)
export const protoless0 = I.freeze(protoless(I.object0))

export const replace = I.curry((p, r, s) => s.replace(p, r))
