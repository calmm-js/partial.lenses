import * as I from "infestines"

export const dep = xs2xsyC => xsy => I.arityN(xsy.length, (...xs) =>
  xs2xsyC(xs)(xsy)(...xs))

export const fn = (xsC, yC) => xsy => I.arityN(xsy.length, (...xs) =>
  yC(xsy.apply(null, xsC(xs))))

export const res = yC => fn(I.id, yC)

export const args = xsC => fn(xsC, I.id)

export const nth = (i, xC) => xs => {
  const ys = xs.slice(0)
  ys[i] = xC(ys[i])
  return ys
}

export const par = (i, xC) => args(nth(i, xC))

export const and = (...xCs) => x => {
  for (let i=0, n=xCs.length; i<n; ++i)
    x = xCs[i](x)
  return x
}

export const ef = xE => x => {
  xE(x)
  return x
}

export const tup = (...xCs) => and(...xCs.map((xC, i) => nth(i, xC)))
