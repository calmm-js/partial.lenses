import {
  acyclicEqualsU,
  always,
  applyU,
  arityN,
  assocPartialU,
  curry,
  curryN,
  dissocPartialU,
  id,
  isDefined,
  isObject,
  keys,
  object0,
  sndU
} from "infestines"

//

const sliceIndex = (m, l, d, i) =>
  void 0 === i ? d : Math.min(Math.max(m, i < 0 ? l + i : i), l)

function pair(x0, x1) {return [x0, x1]}

const flip = bop => (x, y) => bop(y, x)

const unto = c => x => void 0 !== x ? x : c

const isNat = x => x === (x >> 0) && 0 <= x

const seemsArrayLike = x =>
  x instanceof Object && isNat(x.length) || typeof x === "string"

//

function mapPartialIndexU(xi2y, xs) {
  const n = xs.length, ys = Array(n)
  let j = 0
  for (let i=0, y; i<n; ++i)
    if (void 0 !== (y = xi2y(xs[i], i)))
      ys[j++] = y
  if (j) {
    if (j < n)
      ys.length = j
    return ys
  }
}

function copyToFrom(ys, k, xs, i, j) {
  while (i < j)
    ys[k++] = xs[i++]
  return ys
}

function setAt(xs, i, x) {
  xs[i] = x
  return xs
}

//

const Applicative = (map, of, ap) => ({map, of, ap})

const Ident = Applicative(applyU, id, applyU)

const Const = {map: sndU}

const TacnocOf = (empty, tacnoc) => Applicative(sndU, always(empty), tacnoc)

const Monoid = (empty, concat) => ({empty: () => empty, concat})

const Mum = ord =>
  Monoid(void 0, (y, x) => void 0 !== x && (void 0 === y || ord(x, y)) ? x : y)

//

const run = (o, C, xi2yC, s, i) => toFunction(o)(C, xi2yC, s, i)

const constAs = toConst => curryN(4, (xMi2y, m) => {
  const C = toConst(m)
  return (t, s) => run(t, C, xMi2y, s)
})

//

function reqApplicative(f) {
  if (!f.of)
    throw new Error("partial.lenses: Traversals require an applicative.")
}

//

function Concat(l, r) {this.l = l; this.r = r}

const isConcat = n => n.constructor === Concat

const ap = (r, l) => void 0 !== l ? void 0 !== r ? new Concat(l, r) : l : r

const rconcat = t => h => ap(t, h)

function pushTo(n, ys) {
  while (n && isConcat(n)) {
    const l = n.l
    n = n.r
    if (l && isConcat(l)) {
      pushTo(l.l, ys)
      pushTo(l.r, ys)
    } else
      ys.push(l)
  }
  ys.push(n)
}

function toArray(n) {
  if (void 0 !== n) {
    const ys = []
    pushTo(n, ys)
    return ys
  }
}

function foldRec(f, r, n) {
  while (isConcat(n)) {
    const l = n.l
    n = n.r
    r = isConcat(l)
      ? foldRec(f, foldRec(f, r, l.l), l.r)
      : f(r, l[0], l[1])
  }
  return f(r, n[0], n[1])
}

const fold = (f, r, n) => void 0 !== n ? foldRec(f, r, n) : r

const Collect = TacnocOf(void 0, ap)

//

function traversePartialIndex(A, xi2yA, xs) {
  const ap = A.ap, map = A.map
  if (process.env.NODE_ENV !== "production")
    reqApplicative(A)
  let s = (0,A.of)(void 0), i = xs.length
  while (i--)
    s = ap(map(rconcat, s), xi2yA(xs[i], i))
  return map(toArray, s)
}

//

function object0ToUndefined(o) {
  if (!(o instanceof Object))
    return o
  for (const k in o)
    return o
}

//

const getProp = (k, o) => o instanceof Object ? o[k] : void 0

const setProp = (k, v, o) =>
  void 0 !== v ? assocPartialU(k, v, o) : dissocPartialU(k, o)

//

const getIndex = (i, xs) => seemsArrayLike(xs) ? xs[i] : void 0

function setIndex(i, x, xs) {
  if (process.env.NODE_ENV !== "production" && i < 0)
    throw new Error("partial.lenses: Negative indices are not supported by `index`.")
  if (!seemsArrayLike(xs))
    xs = ""
  const n = xs.length
  if (void 0 !== x) {
    if (n <= i)
      return setAt(copyToFrom(Array(i+1), 0, xs, 0, i), i, x)
    const ys = Array(n)
    for (let j=0; j<n; ++j)
      ys[j] = xs[j]
    ys[i] = x
    return ys
  } else {
    if (0 < n) {
      if (n <= i)
        return copyToFrom(Array(n), 0, xs, 0, n)
      if (1 < n) {
        const ys = Array(n-1)
        for (let j=0; j<i; ++j)
          ys[j] = xs[j]
        for (let j=i+1; j<n; ++j)
          ys[j-1] = xs[j]
        return ys
      }
    }
  }
}

//

function reqOptic(o) {
  if (!(typeof o === "function" && o.length === 4))
    throw new Error("partial.lenses: Expecting an optic.")
}

const close = (o, F, xi2yF) => (x, i) => o(F, xi2yF, x, i)

function composed(oi0, os) {
  switch (os.length - oi0) {
    case 0:  return identity
    case 1:  return toFunction(os[oi0])
    default: return (F, xi2yF, x, i) => {
      let n = os.length
      xi2yF = close(toFunction(os[--n]), F, xi2yF)
      while (oi0 < --n)
        xi2yF = close(toFunction(os[n]), F, xi2yF)
      return run(os[oi0], F, xi2yF, x, i)
    }
  }
}

function setU(o, x, s) {
  switch (typeof o) {
    case "string":
      return setProp(o, x, s)
    case "number":
      return setIndex(o, x, s)
    case "function":
      if (process.env.NODE_ENV !== "production")
        reqOptic(o)
      return o(Ident, always(x), s, void 0)
    default:
      return modifyComposed(o, always(x), s)
  }
}

function getU(l, s) {
  switch (typeof l) {
    case "string":
      return getProp(l, s)
    case "number":
      return getIndex(l, s)
    case "object":
      for (let i=0, n=l.length, o; i<n; ++i)
        switch (typeof (o = l[i])) {
          case "string": s = getProp(o, s); break
          case "number": s = getIndex(o, s); break
          default: s = getU(o, s); break
        }
      return s
    default:
      if (process.env.NODE_ENV !== "production")
        reqOptic(l)
      return l(Const, id, s, void 0)
  }
}

function modifyComposed(os, xi2x, x) {
  let n = os.length
  const xs = Array(n)
  for (let i=0, o; i<n; ++i) {
    xs[i] = x
    switch (typeof (o = os[i])) {
      case "string":
        x = getProp(o, x)
        break
      case "number":
        x = getIndex(o, x)
        break
      default:
        x = composed(i, os)(Ident, xi2x, x, os[i-1])
        n = i
        break
    }
  }
  if (n === os.length)
    x = xi2x(x, os[n-1])
  while (0 <= --n) {
    const o = os[n]
    switch (typeof o) {
      case "string": x = setProp(o, x, xs[n]); break
      case "number": x = setIndex(o, x, xs[n]); break
    }
  }
  return x
}

//

function getPick(template, x) {
  let r
  for (const k in template) {
    const v = getU(template[k], x)
    if (void 0 !== v) {
      if (!r)
        r = {}
      r[k] = v
    }
  }
  return r
}

const setPick = (template, x) => value => {
  if (process.env.NODE_ENV !== "production" &&
      !(void 0 === value || value instanceof Object))
    throw new Error("partial.lenses: `pick` must be set with undefined or an object")
  for (const k in template)
    x = setU(template[k], value && value[k], x)
  return x
}

//

const show = (labels, dir) => x =>
  console.log.apply(console, labels.concat([dir, x])) || x

function branchOnMerge(x, keys, xs) {
  const o = {}, n = keys.length
  for (let i=0; i<n; ++i, xs=xs[1]) {
    const v = xs[0]
    o[keys[i]] = void 0 !== v ? v : o
  }
  let r
  if (x.constructor !== Object)
    x = Object.assign({}, x)
  for (const k in x) {
    const v = o[k]
    if (o !== v) {
      o[k] = o
      if (!r)
        r = {}
      r[k] = void 0 !== v ? v : x[k]
    }
  }
  for (let i=0; i<n; ++i) {
    const k = keys[i]
    const v = o[k]
    if (o !== v) {
      if (!r)
        r = {}
      r[k] = v
    }
  }
  return r
}

const branchOn = (keys, vals) => (A, xi2yA, x, _) => {
  if (process.env.NODE_ENV !== "production")
    reqApplicative(A)
  const n = keys.length, of = A.of
  if (!n)
    return of(object0ToUndefined(x))
  if (!(x instanceof Object))
    x = object0
  const ap = A.ap,
        wait = (i, xs) => 0 <= i ? x => wait(i-1, [x, xs])
                                 : branchOnMerge(x, keys, xs)
  let xsA = of(wait(n-1))
  for (let i=n-1; 0<=i; --i) {
    const k = keys[i], v = x[k]
    xsA = ap(xsA, vals ? vals[i](A, xi2yA, v, k) : xi2yA(v, k))
  }
  return xsA
}

const normalizer = xi2x => (F, xi2yF, x, i) =>
  (0,F.map)(x => xi2x(x, i), xi2yF(xi2x(x, i), i))

const replaced = (inn, out, x) => acyclicEqualsU(x, inn) ? out : x

function findIndex(xi2b, xs) {
  for (let i=0, n=xs.length; i<n; ++i)
    if (xi2b(xs[i], i))
      return i
  return -1
}

function partitionIntoIndex(xi2b, xs, ts, fs) {
  for (let i=0, n=xs.length, x; i<n; ++i)
    (xi2b(x = xs[i], i) ? ts : fs).push(x)
}

//

export function toFunction(o) {
  switch (typeof o) {
    case "string":
      return (F, xi2yF, x, _) =>
        (0,F.map)(v => setProp(o, v, x), xi2yF(getProp(o, x), o))
    case "number":
      return (F, xi2yF, xs, _) =>
        (0,F.map)(y => setIndex(o, y, xs), xi2yF(getIndex(o, xs), o))
    case "function":
      if (process.env.NODE_ENV !== "production")
        reqOptic(o)
      return o
    default:
      return composed(0, o)
  }
}

// Operations on optics

export const modify = curry((o, xi2x, s) => {
  switch (typeof o) {
    case "string":
      return setProp(o, xi2x(getProp(o, s), o), s)
    case "number":
      return setIndex(o, xi2x(getIndex(o, s), o), s)
    case "function":
      if (process.env.NODE_ENV !== "production")
        reqOptic(o)
      return o(Ident, xi2x, s, void 0)
    default:
      return modifyComposed(o, xi2x, s)
  }
})

export const remove = curry((o, s) => setU(o, void 0, s))

export const set = curry(setU)

// Nesting

export function compose() {
  switch (arguments.length) {
    case 0: return identity
    case 1: return arguments[0]
    default: {
      const n = arguments.length, lenses = Array(n)
      for (let i=0; i<n; ++i)
        lenses[i] = arguments[i]
      return lenses
    }
  }
}

// Querying

export const chain = curry((xi2yO, xO) =>
  [xO, choose((xM, i) => void 0 !== xM ? xi2yO(xM, i) : zero)])

export const choice = (...ls) => choose(x => {
  const i = findIndex(l => void 0 !== getU(l, x), ls)
  return i < 0 ? zero : ls[i]
})

export const choose = xiM2o => (C, xi2yC, x, i) =>
  run(xiM2o(x, i), C, xi2yC, x, i)

export const when = p => (C, xi2yC, x, i) =>
  p(x, i) ? xi2yC(x, i) : zero(C, xi2yC, x, i)

export const optional = when(isDefined)

export function zero(C, xi2yC, x, i) {
  const of = C.of
  return of ? of(x) : (0,C.map)(always(x), xi2yC(void 0, i))
}

// Recursing

export function lazy(o2o) {
  let memo = (C, xi2yC, x, i) => (memo = toFunction(o2o(rec)))(C, xi2yC, x, i)
  function rec(C, xi2yC, x, i) {return memo(C, xi2yC, x, i)}
  return rec
}

// Debugging

export const log = (...labels) => iso(show(labels, "get"), show(labels, "set"))

// Operations on traversals

export const concatAs = constAs(m => TacnocOf((0,m.empty)(), flip(m.concat)))

export const concat = concatAs(id)

export const mergeAs = constAs(m => TacnocOf((0,m.empty)(), m.concat))

export const merge = mergeAs(id)

// Folds over traversals

export const collectAs = curry((xi2y, t, s) =>
  toArray(run(t, Collect, xi2y, s)) || [])

export const collect = collectAs(id)

export const foldl = curry((f, r, t, s) =>
  fold(f, r, run(t, Collect, pair, s)))

export const foldr = curry((f, r, t, s) => {
  const xs = collectAs(pair, t, s)
  for (let i=xs.length-1; 0<=i; --i) {
    const x = xs[i]
    r = f(r, x[0], x[1])
  }
  return r
})

export const maximum = merge(Mum((x, y) => x > y))

export const minimum = merge(Mum((x, y) => x < y))

export const product = mergeAs(unto(1), Monoid(1, (y, x) => x * y))

export const sum = mergeAs(unto(0), Monoid(0, (y, x) => x + y))

// Creating new traversals

export function branch(template) {
  const keys = [], vals = []
  for (const k in template) {
    keys.push(k)
    vals.push(toFunction(template[k]))
  }
  return branchOn(keys, vals)
}

// Traversals and combinators

export function elems(A, xi2yA, xs, _) {
  if (seemsArrayLike(xs)) {
    return A === Ident
      ? mapPartialIndexU(xi2yA, xs)
      : traversePartialIndex(A, xi2yA, xs)
  } else {
    if (process.env.NODE_ENV !== "production")
      reqApplicative(A)
    return (0,A.of)(xs)
  }
}

export function values(A, xi2yA, xs, _) {
  if (xs instanceof Object) {
    return branchOn(keys(xs))(A, xi2yA, xs)
  } else {
    if (process.env.NODE_ENV !== "production")
      reqApplicative(A)
    return (0,A.of)(xs)
  }
}

// Operations on lenses

export const get = curry(getU)

// Creating new lenses

export const lens = curry((get, set) => (F, xi2yF, x, i) =>
  (0,F.map)(y => set(y, x, i), xi2yF(get(x, i), i)))

// Computing derived props

export const augment = template => {
  if (process.env.NODE_ENV !== "production" && !isObject(template))
    throw new Error("partial.lenses: `augment` expects a plain Object template")
  return lens(
    x => {
      x = dissocPartialU(0, x)
      if (x)
        for (const k in template)
          x[k] = template[k](x)
      return x
    },
    (y, x) => {
      if (process.env.NODE_ENV !== "production" &&
          !(void 0 === y || y instanceof Object))
        throw new Error("partial.lenses: `augment` must be set with undefined or an object")
      if (y && y.constructor !== Object)
        y = Object.assign({}, y)
      if (!(x instanceof Object))
        x = void 0
      let z
      function set(k, v) {
        if (!z)
          z = {}
        z[k] = v
      }
      for (const k in y) {
        if (!(k in template))
          set(k, y[k])
        else
          if (x && k in x)
            set(k, x[k])
      }
      return z
    })
}

// Enforcing invariants

export const defaults = out => {
  const o2u = x => replaced(out, void 0, x)
  return (F, xi2yF, x, i) => (0,F.map)(o2u, xi2yF(void 0 !== x ? x : out, i))
}

export const required = inn => replace(inn, void 0)

export const define = v => normalizer(unto(v))

export const normalize = xi2x =>
  normalizer((x, i) => void 0 !== x ? xi2x(x, i) : void 0)

export const rewrite = yi2y => (F, xi2yF, x, i) =>
  (0,F.map)(y => void 0 !== y ? yi2y(y, i) : void 0, xi2yF(x, i))

// Lensing arrays

export const append = (F, xi2yF, xs, i) =>
  (0,F.map)(x => setIndex(seemsArrayLike(xs) ? xs.length : 0, x, xs),
            xi2yF(void 0, i))

export const filter = xi2b => (F, xi2yF, xs, i) => {
  let ts, fs
  if (seemsArrayLike(xs))
    partitionIntoIndex(xi2b, xs, ts = [], fs = [])
  return (0,F.map)(
    ts => {
      if (process.env.NODE_ENV !== "production" &&
          !(void 0 === ts || seemsArrayLike(ts)))
        throw new Error("partial.lenses: `filter` must be set with undefined or an array-like object")
      const tsN = ts ? ts.length : 0,
            fsN = fs ? fs.length : 0,
            n = tsN + fsN
      if (n)
        return n === fsN
        ? fs
        : copyToFrom(copyToFrom(Array(n), 0, ts, 0, tsN), tsN, fs, 0, fsN)
    },
    xi2yF(ts, i))
}

export const find = xi2b => choose(xs => {
  if (!seemsArrayLike(xs))
    return 0
  const i = findIndex(xi2b, xs)
  return i < 0 ? append : i
})

export function findWith(...ls) {
  const lls = compose(...ls)
  return [find(x => void 0 !== getU(lls, x)), lls]
}

export const index = process.env.NODE_ENV === "production" ? id : x => {
  if (!Number.isInteger(x) || x < 0)
    throw new Error("partial.lenses: `index` expects a non-negative integer.")
  return x
}

export const slice = curry((begin, end) => (F, xsi2yF, xs, i) => {
  const seems = seemsArrayLike(xs),
        xsN = seems && xs.length,
        b = sliceIndex(0, xsN, 0, begin),
        e = sliceIndex(b, xsN, xsN, end)
  return (0,F.map)(
    zs => {
      if (process.env.NODE_ENV !== "production" &&
          !(void 0 === zs || seemsArrayLike(zs)))
        throw new Error("partial.lenses: `slice` must be set with undefined or an array-like object")
      const zsN = zs ? zs.length : 0, bPzsN = b + zsN, n = xsN - e + bPzsN
      return n
        ? copyToFrom(copyToFrom(copyToFrom(Array(n), 0, xs, 0, b),
                                b,
                                zs, 0, zsN),
                     bPzsN,
                     xs, e, xsN)
        : void 0
    },
    xsi2yF(seems ? copyToFrom(Array(Math.max(0, e - b)), 0, xs, b, e) :
           void 0,
           i))
})

// Lensing objects

export const prop = process.env.NODE_ENV === "production" ? id : x => {
  if (typeof x !== "string")
    throw new Error("partial.lenses: `prop` expects a string.")
  return x
}

export function props() {
  const n = arguments.length, template = {}
  for (let i=0, k; i<n; ++i)
    template[k = arguments[i]] = k
  return pick(template)
}

// Providing defaults

export const valueOr = v => (_F, xi2yF, x, i) =>
  xi2yF(void 0 !== x && x !== null ? x : v, i)

// Adapting to data

export const orElse =
  curry((d, l) => choose(x => void 0 !== getU(l, x) ? l : d))

// Read-only mapping

export const to = wi2x => (F, xi2yF, w, i) =>
  (0,F.map)(always(w), xi2yF(wi2x(w, i), i))

export const just = x => to(always(x))

// Transforming data

export const pick = template => {
  if (process.env.NODE_ENV !== "production" && !isObject(template))
    throw new Error("partial.lenses: `pick` expects a plain Object template")
  return (F, xi2yF, x, i) =>
    (0,F.map)(setPick(template, x), xi2yF(getPick(template, x), i))
}

export const replace = curry((inn, out) => {
  const o2i = x => replaced(out, inn, x)
  return (F, xi2yF, x, i) => (0,F.map)(o2i, xi2yF(replaced(inn, out, x), i))
})

// Operations on isomorphisms

export const getInverse = arityN(2, setU)

// Creating new isomorphisms

export const iso =
  curry((bwd, fwd) => (F, xi2yF, x, i) => (0,F.map)(fwd, xi2yF(bwd(x), i)))

// Isomorphisms and combinators

export const identity = (_F, xi2yF, x, i) => xi2yF(x, i)

export const inverse = iso => (F, xi2yF, x, i) =>
  (0,F.map)(x => getU(iso, x), xi2yF(setU(iso, x), i))
