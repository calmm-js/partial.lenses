import * as I from 'infestines'

export * from 'infestines'

export const ltU = (x, y) => x < y
export const gtU = (x, y) => x > y

export const isInstanceOf = I.curry((Class, x) => x instanceof Class)
