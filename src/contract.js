import * as I from './ext/infestines'

export const dep = xs2xsyC => xsy =>
  I.arityN(
    xsy[I.LENGTH],
    I.defineNameU((...xs) => xs2xsyC(...xs)(xsy)(...xs), xsy.name)
  )

export const fn = (xsC, yC) => xsy =>
  I.arityN(
    xsy[I.LENGTH],
    I.defineNameU((...xs) => yC(xsy.apply(null, xsC(xs))), xsy.name)
  )

export const res = yC => fn(I.id, yC)

export const args = xsC => fn(xsC, I.id)

export const nth = (i, xC) => xs => {
  const ys = xs.slice(0)
  ys[i] = xC(ys[i])
  return ys
}

export const par = (i, xC) => args(nth(i, xC))

export const and = (...xCs) => x => {
  for (let i = 0, n = xCs[I.LENGTH]; i < n; ++i) x = xCs[i](x)
  return x
}

export const or = (...xCs) => x => {
  let es = null
  for (let i = 0, n = xCs[I.LENGTH]; i < n; ++i) {
    try {
      return xCs[i](x)
    } catch (e) {
      es = e
    }
  }
  throw es
}

export const ef = xE =>
  I.defineNameU(x => {
    xE(x)
    return x
  }, xE.name)

export const tup = (...xCs) => xs => {
  if (xs[I.LENGTH] !== xCs[I.LENGTH])
    throw Error(
      `Expected array of ${xCs[I.LENGTH]} elements, but got ${xs[I.LENGTH]}`
    )
  return and.apply(null, xCs.map((xC, i) => nth(i, xC)))(xs)
}

export const arr = xC => xs => xs.map(xC)
