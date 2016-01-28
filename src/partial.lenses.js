import R from "ramda"

//

const deleteKey = (k, o) => {
  if (o !== undefined && k in o) {
    const r = {}
    for (const p in o)
      if (p !== k)
        r[p] = o[p]
    return r
  } else {
    return o
  }
}

//

const lift = l => {
  switch (typeof l) {
  case "string": return L.prop(l)
  case "number": return L.index(l)
  default:       return l
  }
}

const L = (...ls) => R.compose(...ls.map(lift))

L.lens = R.lens
L.over = R.over
L.set  = R.set
L.view = R.view

L.replace = (inn, out) =>
  R.lens(x => R.equals(x, inn) ? out : x,
         y => R.equals(y, out) ? inn : y)

L.prop = k =>
  R.lens(o => o === undefined ? undefined : o[k],
         (v, o) => v === undefined ? deleteKey(k, o) : ({...o, [k]: v}))

L.find = predicate =>
  R.lens(xs => xs && xs.find(predicate),
         (x, xs) => {
           if (x === undefined) {
             if (xs === undefined) {
               return undefined
             } else {
               const i = xs.findIndex(predicate)
               if (i < 0)
                 return xs
               else
                 return xs.slice(0, i).concat(xs.slice(i+1))
             }
           } else {
             if (xs === undefined) {
               return [x]
             } else {
               const i = xs.findIndex(predicate)
               if (i < 0)
                 return xs.concat([x])
               else
                 return xs.slice(0, i).concat([x], xs.slice(i+1))
             }
           }
         })

L.index = i =>
  R.lens(xs => xs === undefined ? undefined : xs[i],
         (x, xs) => {
           if (x === undefined) {
             if (xs === undefined) {
               return undefined
             } else {
               if (i < xs.length)
                 return xs.slice(0, i).concat(xs.slice(i+1))
               else
                 return xs
             }
           } else {
             if (xs === undefined) {
               const ys = Array(i+1)
               ys[i] = x
               return ys
             } else {
               if (i < xs.length)
                 return xs.slice(0, i).concat([x], xs.slice(i+1))
               else
                 return xs.concat(Array(i - xs.length), [x])
             }
           }
         })

export default L
