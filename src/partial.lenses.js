import * as I from "infestines"

import * as C from "./contract"

//

const toStringPartial = x => void 0 !== x ? String(x) : ""

const not = x => !x
const lt = (x, y) => x < y
const gt = (x, y) => x > y

const sliceIndex = (m, l, d, i) =>
  void 0 !== i ? Math.min(Math.max(m, i < 0 ? l + i : i), l) : d

function pair(x0, x1) {return [x0, x1]}
const cpair = x => xs => [x, xs]

const unto = c => x => void 0 !== x ? x : c

const notPartial = x => void 0 !== x ? !x : x

const expect = (p, f) => x => p(x) ? f(x) : undefined

const freeze = x => x && Object.freeze(x)

function deepFreeze(x) {
  if (Array.isArray(x)) {
    x.forEach(deepFreeze)
    freeze(x)
  } else if (I.isObject(x)) {
    for (const k in x)
      deepFreeze(x[k])
    freeze(x)
  }
  return x
}

//

const mapPartialIndexU = /*#__PURE__*/(process.env.NODE_ENV === "production" ? I.id : C.res(freeze))((xi2y, xs) => {
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
})

const copyToFrom = /*#__PURE__*/(process.env.NODE_ENV === "production" ? I.id : fn => (ys, k, xs, i, j) => (ys.length === k + j - i ? freeze(fn(ys, k, xs, i, j)) : fn(ys, k, xs, i, j)))((ys, k, xs, i, j) => {
  while (i < j)
    ys[k++] = xs[i++]
  return ys
})

//

const Ident = {map: I.applyU, of: I.id, ap: I.applyU, chain: I.applyU}

const Const = {map: I.sndU}

function ConcatOf(ap, empty, delay) {
  const c = {map: I.sndU, ap, of: I.always(empty)}
  if (delay)
    c.delay = delay
  return c
}

const Sum = /*#__PURE__*/ConcatOf((x, y) => x + y, 0)

const Mum = ord =>
  ConcatOf((y, x) => void 0 !== x && (void 0 === y || ord(x, y)) ? x : y)

const MumBy = ord => keyOf => ConcatOf((y, x) => {
  const xk = x && keyOf(x[0], x[1])
  if (void 0 === xk)
    return y
  const yk = y && keyOf(y[0], y[1])
  if (void 0 === yk)
    return x
  return ord(xk, yk) ? x : y
})

//

const traverseU = (C, xi2yC, t, s) => toFunction(t)(s, void 0, C, xi2yC)

//

const expectedOptic = "Expecting an optic"
const opticIsEither = `An optic can be either
- a string,
- a non-negative integer,
- a ternary optic function,
- an ordinary unary or binary function, or
- an array of optics.
See documentation of \`toFunction\` and \`compose\` for details.`
const header = "partial.lenses: "

function warn(f, m) {
  if (!f.warned) {
    f.warned = 1
    console.warn(header + m)
  }
}

function errorGiven(m, o, e) {
  m = header + m + "."
  e = e ? "\n" + e : ""
  console.error(m, "Given:", o, e)
  throw Error(m + e)
}

function reqIndex(x) {
  if (!Number.isInteger(x) || x < 0)
    errorGiven("`index` expects a non-negative integer", x)
}

function reqFunction(o) {
  if (!(I.isFunction(o) && (o.length === 4 || o.length <= 2)))
    errorGiven(expectedOptic, o, opticIsEither)
}

function reqArray(o) {
  if (!Array.isArray(o))
    errorGiven(expectedOptic, o, opticIsEither)
}

function reqOptic(o) {
  switch (typeof o) {
    case "string": break
    case "number": reqIndex(o); break
    case "object":
      reqArray(o)
      for (let i=0,n=o.length; i<n; ++i)
        reqOptic(o[i])
      break
    default: reqFunction(o); break
  }
}

//

const reqString = msg => x => {
  if (!I.isString(x))
    errorGiven(msg, x)
}

const reqMaybeArray = msg => zs => {
  if (!(void 0 === zs || seemsArrayLike(zs)))
    errorGiven(msg, zs)
}

//

const reqApplicative = (name, arg) => C => {
  if (!C.of)
    errorGiven(`\`${name}${arg ? `(${arg})` : ""}\` requires an applicative`, C, "Note that you cannot `get` a traversal. Perhaps you wanted to `collect` it?")
}

const reqMonad = name => C => {
  if (!C.chain)
    errorGiven(`\`${name}\` requires a monad`, C, "Note that you can only `modify`, `remove`, `set`, and `traverse` a transform.")
}

//

function Both(l, r) {this.l = l; this.r = r}

const isBoth = n => n.constructor === Both

const both = (l, r) => void 0 !== l ? void 0 !== r ? new Both(l, r) : l : r

const cboth = h => t => both(h, t)

function pushTo(n, ys) {
  while (n && isBoth(n)) {
    const l = n.l
    n = n.r
    if (l && isBoth(l))
      pushTo(l.r, pushTo(l.l, ys))
    else
      ys.push(l)
  }
  ys.push(n)
  return ys
}

const toArray = /*#__PURE__*/(process.env.NODE_ENV === "production" ? I.id : C.res(freeze))(n => {
  if (void 0 !== n)
    return pushTo(n, [])
})

function foldRec(f, r, n) {
  while (isBoth(n)) {
    const l = n.l
    n = n.r
    r = isBoth(l)
      ? foldRec(f, foldRec(f, r, l.l), l.r)
      : f(r, l[0], l[1])
  }
  return f(r, n[0], n[1])
}

const fold = (f, r, n) => void 0 !== n ? foldRec(f, r, n) : r

const Collect = /*#__PURE__*/ConcatOf(both)

//

const U = I.object0
const T = {v:true}

function force(x) {
  while (x.constructor === Function)
    x = x()
  return x
}

function selectElems(xi2yA, xs) {
  for (let i=0, n=xs.length, x; i<n; ++i) {
    x = force(xi2yA(xs[i], i))
    if (U !== x)
      return x
  }
  return U
}

const Select = /*#__PURE__*/ConcatOf(
  (l, r) => void 0 !== (l = force(l)).v ? l : r,
  U,
  I.id)

const mkSelect = toS => (xi2yM, t, s) =>
  force(traverseU(Select, xi2yM ? I.pipe2U(xi2yM, toS) : toS, t, s)).v

const selectAny = /*#__PURE__*/mkSelect(x => x ? T : U)

const mkTraverse = (after, toC) => I.curryN(4, (xi2yC, m) =>
  (m = toC(m), (t, s) => after(traverseU(m, xi2yC, t, s))))

//

const traversePartialIndexLazy = (map, ap, z, delay, xi2yA, xs, i, n) =>
  i < n
  ? ap(map(cboth, xi2yA(xs[i], i)), delay(() =>
       traversePartialIndexLazy(map, ap, z, delay, xi2yA, xs, i+1, n)))
  : z

const traversePartialIndex = /*#__PURE__*/(process.env.NODE_ENV === "production" ? I.id : C.par(0, C.ef(reqApplicative("elems"))))((A, xi2yA, xs) => {
  const {map, ap, of, delay} = A
  let xsA = of(void 0),
      i = xs.length
  if (delay)
    xsA = traversePartialIndexLazy(map, ap, xsA, delay, xi2yA, xs, 0, i)
  else
    while (i--)
      xsA = ap(map(cboth, xi2yA(xs[i], i)), xsA)
  return map(toArray, xsA)
})

//

function object0ToUndefined(o) {
  if (!(o instanceof Object))
    return o
  for (const k in o)
    return o
}

//

const lensFrom = (get, set) => i => (x, _i, F, xi2yF) =>
  (0,F.map)(v => set(i, v, x), xi2yF(get(i, x), i))

//

const getProp = (k, o) => o instanceof Object ? o[k] : void 0

const setProp = /*#__PURE__*/(process.env.NODE_ENV === "production" ? I.id : C.res(freeze))((k, v, o) =>
  void 0 !== v ? I.assocPartialU(k, v, o) : I.dissocPartialU(k, o))

const funProp = /*#__PURE__*/lensFrom(getProp, setProp)

//

const getIndex = (i, xs) => seemsArrayLike(xs) ? xs[i] : void 0

const setIndex = /*#__PURE__*/(process.env.NODE_ENV === "production" ? I.id : C.fn(C.nth(0, C.ef(reqIndex)), freeze))((i, x, xs) => {
  if (!seemsArrayLike(xs))
    xs = ""
  const n = xs.length
  if (void 0 !== x) {
    const m = Math.max(i+1, n), ys = Array(m)
    for (let j=0; j<m; ++j)
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
})

const funIndex = /*#__PURE__*/lensFrom(getIndex, setIndex)

//

const close = (o, F, xi2yF) => (x, i) => o(x, i, F, xi2yF)

function composed(oi0, os) {
  const n = os.length - oi0
  if (n < 2) {
    return n ? toFunction(os[oi0]) : identity
  } else {
    const fs = Array(n)
    for (let i=0;i<n;++i)
      fs[i] = toFunction(os[i+oi0])
    return (x, i, F, xi2yF) => {
      let k=n
      while (--k)
        xi2yF = close(fs[k], F, xi2yF)
      return fs[0](x, i, F, xi2yF)
    }
  }
}

const setU = /*#__PURE__*/(process.env.NODE_ENV === "production" ? I.id : C.par(0, C.ef(reqOptic)))((o, x, s) => {
  switch (typeof o) {
    case "string":
      return setProp(o, x, s)
    case "number":
      return setIndex(o, x, s)
    case "object":
      return modifyComposed(o, 0, s, x)
    default:
      return o.length === 4 ? o(s, void 0, Ident, I.always(x)) : s
  }
})

const modifyU = /*#__PURE__*/(process.env.NODE_ENV === "production" ? I.id : C.par(0, C.ef(reqOptic)))((o, xi2x, s) => {
  switch (typeof o) {
    case "string":
      return setProp(o, xi2x(getProp(o, s), o), s)
    case "number":
      return setIndex(o, xi2x(getIndex(o, s), o), s)
    case "object":
      return modifyComposed(o, xi2x, s)
    default:
      return o.length === 4
        ? o(s, void 0, Ident, xi2x)
        : (xi2x(o(s, void 0), void 0), s)
  }
})

function makeIx(i) {
  const ix = (s, j) => (ix.v = j, s)
  ix.v = i
  return ix
}

function getNestedU(l, s, j, ix) {
  for (let n=l.length, o; j<n; ++j)
    switch (typeof (o = l[j])) {
      case "string":
        s = getProp(ix.v = o, s)
        break
      case "number":
        s = getIndex(ix.v = o, s)
        break
      case "object":
        s = getNestedU(o, s, 0, ix)
        break
      default:
        s = o(s, ix.v, Const, ix)
    }
  return s
}

const getU = /*#__PURE__*/(process.env.NODE_ENV === "production" ? I.id : C.par(0, C.ef(reqOptic)))((l, s) => {
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
          default: return getNestedU(l, s, i, makeIx(l[i-1]))
        }
      return s
    default:
      return l(s, void 0, Const, I.id)
  }
})

function modifyComposed(os, xi2y, x, y) {
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
        x = composed(i, os)(x, os[i-1], Ident, xi2y || I.always(y))
        n = i
        break
    }
  }
  if (n === os.length)
    x = xi2y ? xi2y(x, os[n-1]) : y
  for (let o; 0 <= --n;)
    x = I.isString(o = os[n])
        ? setProp(o, x, xs[n])
        : setIndex(o, x, xs[n])
  return x
}

//

const lensU = (get, set) => (x, i, F, xi2yF) =>
  (0,F.map)(y => set(y, x, i), xi2yF(get(x, i), i))

const isoU = (bwd, fwd) => (x, i, F, xi2yF) => (0,F.map)(fwd, xi2yF(bwd(x), i))

//

const getPick = /*#__PURE__*/(process.env.NODE_ENV === "production" ? I.id : C.res(freeze))((template, x) => {
  let r
  for (const k in template) {
    const t = template[k]
    const v = I.isObject(t) ? getPick(t, x) : getU(t, x)
    if (void 0 !== v) {
      if (!r)
        r = {}
      r[k] = v
    }
  }
  return r
})

const reqTemplate = name => template => {
  if (!I.isObject(template))
    errorGiven(`\`${name}\` expects a plain Object template`, template)
}

const reqObject = msg => value => {
  if (!(void 0 === value || value instanceof Object))
    errorGiven(msg, value)
}

const setPick = /*#__PURE__*/(process.env.NODE_ENV === "production" ? I.id : C.par(1, C.ef(reqObject("`pick` must be set with undefined or an object"))))((template, value, x) => {
  for (const k in template) {
    const v = value && value[k]
    const t = template[k]
    x = I.isObject(t) ? setPick(t, v, x) : setU(t, v, x)
  }
  return x
})

//

const toObject = x => I.constructorOf(x) !== Object ? Object.assign({}, x) : x

//

function mapPartialObjectU(xi2y, o, r) {
  for (const k in o) {
    const v = xi2y(o[k], k)
    if (void 0 !== v) {
      if (!r)
        r = {}
      r[k] = v
    }
  }
  return r
}

const branchOnMerge = /*#__PURE__*/(process.env.NODE_ENV === "production" ? I.id : C.res(C.res(freeze)))((x, keys) => xs => {
  const o = {}, n = keys.length
  for (let i=0; i<n; ++i, xs=xs[1]) {
    const v = xs[0]
    o[keys[i]] = void 0 !== v ? v : o
  }
  let r
  x = toObject(x)
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
})

function branchOnLazy(keys, vals, map, ap, z, delay, A, xi2yA, x, i) {
  if (i < keys.length) {
    const k = keys[i], v = x[k]
    return ap(map(cpair,
                  vals ? vals[i](v, k, A, xi2yA) : xi2yA(v, k)), delay(() =>
              branchOnLazy(keys, vals, map, ap, z, delay, A, xi2yA, x, i+1)))
  } else {
    return z
  }
}

const branchOn = /*#__PURE__*/(process.env.NODE_ENV === "production" ? I.id : C.dep(([_keys, vals]) => C.res(C.par(2, C.ef(reqApplicative(vals ? "branch" : "values"))))))((keys, vals) => (x, _i, A, xi2yA) => {
  const {map, ap, of, delay} = A
  let i = keys.length
  if (!i)
    return of(object0ToUndefined(x))
  if (!(x instanceof Object))
    x = I.object0
  let xsA = of(0)
  if (delay) {
    xsA = branchOnLazy(keys, vals, map, ap, xsA, delay, A, xi2yA, x, 0)
  } else {
    while (i--) {
      const k = keys[i], v = x[k]
      xsA = ap(map(cpair, vals ? vals[i](v, k, A, xi2yA) : xi2yA(v, k)), xsA)
    }
  }
  return map(branchOnMerge(x, keys), xsA)
})

const replaced = (inn, out, x) => I.acyclicEqualsU(x, inn) ? out : x

function findIndex(xi2b, xs) {
  const n = xs.length
  for (let i=0; i<n; ++i)
    if (xi2b(xs[i], i))
      return i
  return n
}

function findIndexHint(hint, xi2b, xs) {
  const n = xs.length
  let u = hint.hint
  if (n <= u) u = n-1
  if (u < 0) u = 0
  let d = u-1
  for (; 0 <= d && u < n; ++u, --d) {
    if (xi2b(xs[u], hint))
      return u
    if (xi2b(xs[d], hint))
      return d
  }
  for (; u < n; ++u)
    if (xi2b(xs[u], hint))
      return u
  for (; 0 <= d; --d)
    if (xi2b(xs[d], hint))
      return d
  return n
}

const partitionIntoIndex = /*#__PURE__*/(process.env.NODE_ENV === "production" ? I.id : C.dep(([_xi2b, _xs, ts, fs]) => C.res(C.ef(() => {freeze(ts); freeze(fs)}))))((xi2b, xs, ts, fs) => {
  for (let i=0, n=xs.length, x; i<n; ++i)
    (xi2b(x = xs[i], i) ? ts : fs).push(x)
})

const fromReader = wi2x => (w, i, F, xi2yF) =>
  (0,F.map)(I.always(w), xi2yF(wi2x(w, i), i))

//

const reValue = m => m[0]
const reIndex = m => m.index

function reNext(m, re) {
  const lastIndex = re.lastIndex
  re.lastIndex = reIndex(m) + m[0].length
  const n = re.exec(m.input)
  re.lastIndex = lastIndex
  if (n) {
    if (n[0])
      return n
    if (process.env.NODE_ENV !== "production")
      warn(reNext, `\`matches(${re})\` traversal terminated at index ${reIndex(n)} in ${JSON.stringify(n.input)} due to empty match.`)
  }
}

//

const iterCollect = s => x => xs => [s, x, xs]

const iterLazy = (map, ap, of, delay, xi2yA, t, s) =>
  (s = reNext(s, t))
  ? ap(ap(map(iterCollect, of(s)),
          xi2yA(reValue(s), reIndex(s))),
       delay(() => iterLazy(map, ap, of, delay, xi2yA, t, s)))
  : of(void 0)

function iterEager(map, ap, of, _, xi2yA, t, s) {
  const ss = []
  while ((s = reNext(s, t)))
    ss.push(s)
  let i = ss.length
  let r = of(void 0)
  while (i--) {
    s = ss[i]
    r = ap(ap(map(iterCollect, of(s)),
              xi2yA(reValue(s), reIndex(s))),
           r)
  }
  return r
}

//

const matchesJoin = input => matches => {
  let result = ""
  let lastIndex = 0
  while (matches) {
    const m = matches[0], i = reIndex(m)
    result += input.slice(lastIndex, i)
    const s = matches[1]
    if (void 0 !== s)
      result += s
    lastIndex = i + m[0].length
    matches = matches[2]
  }
  result += input.slice(lastIndex)
  return result || void 0
}

//

const ifteU = (c, t, e) => (x, i, C, xi2yC) => (c(x, i) ? t : e)(x, i, C, xi2yC)

const orElseU = (back, prim) =>
  (prim = toFunction(prim), back = toFunction(back),
   (x, i, C, xi2yC) => (isDefined(prim, x) ? prim : back)(x, i, C, xi2yC))

function zeroOp(y, i, C, xi2yC, x) {
  const of = C.of
  return of ? of(y) : (0,C.map)(I.always(y), xi2yC(x, i))
}

//

const pickInAux = (t, k) => [k, pickIn(t)]

// Internals

export const toFunction = /*#__PURE__*/(process.env.NODE_ENV === "production" ? I.id : C.par(0, C.ef(reqOptic)))(o => {
  switch (typeof o) {
    case "string":
      return funProp(o)
    case "number":
      return funIndex(o)
    case "object":
      return composed(0, o)
    default:
      return o.length === 4 ? o : fromReader(o)
  }
})

// Operations on optics

export const assign = /*#__PURE__*/I.curry((o, x, s) =>
  setU([o, propsOf(x)], x, s))

export const modify = /*#__PURE__*/I.curry(modifyU)

export const remove = /*#__PURE__*/I.curry((o, s) => setU(o, void 0, s))

export const set = /*#__PURE__*/I.curry(setU)

export const transform = /*#__PURE__*/I.curry((o, s) => modifyU(o, I.id, s))

export const traverse = /*#__PURE__*/I.curry(traverseU)

// Nesting

export function compose() {
  let n = arguments.length
  if (n < 2) {
    return n ? arguments[0] : identity
  } else {
    const os = Array(n)
    while (n--)
      os[n] = arguments[n]
    return os
  }
}

// Recursing

export function lazy(o2o) {
  let memo = (x, i, C, xi2yC) => (memo = toFunction(o2o(rec)))(x, i, C, xi2yC)
  function rec(x, i, C, xi2yC) {return memo(x, i, C, xi2yC)}
  return rec
}

// Adapting

export const choices = (o, ...os) =>
  os.length ? orElseU(os.reduceRight(orElseU), o) : o

export const choose = xiM2o => (x, i, C, xi2yC) =>
  toFunction(xiM2o(x, i))(x, i, C, xi2yC)

export function iftes(_c, _t) {
  let n = arguments.length
  let r = toFunction(n & 1 ? arguments[--n] : zero)
  while (0 <= (n -= 2))
    r = ifteU(arguments[n], toFunction(arguments[n+1]), r)
  return r
}

export const orElse = /*#__PURE__*/I.curry(orElseU)

// Querying

export const chain = /*#__PURE__*/I.curry((xi2yO, xO) =>
  [xO, choose((xM, i) => void 0 !== xM ? xi2yO(xM, i) : zero)])

export const choice = (...os) => os.reduceRight(orElseU, zero)

export const when = p => (x, i, C, xi2yC) =>
  p(x, i) ? xi2yC(x, i) : zeroOp(x, i, C, xi2yC)

export const optional = /*#__PURE__*/when(I.isDefined)

export const zero = (x, i, C, xi2yC) => zeroOp(x, i, C, xi2yC)

// Caching

export const cache = o => {
  o = toFunction(o)
  let x_, i_, C_, xi2yC_, yC_
  return (x, i, C, xi2yC) =>
    I.identicalU(x, x_) && xi2yC === xi2yC_ && C === C_ && i === i_
    ? yC_
    : yC_ = o(x_ = x, i_ = i, C_ = C, xi2yC_ = xi2yC)
}

// Transforming

export const assignOp = x => [propsOf(x), setOp(x)]

export const modifyOp = xi2y => (x, i, C, xi2yC) =>
  zeroOp(x = xi2y(x, i), i, C, xi2yC, x)

export const setOp = y => (_x, i, C, xi2yC) => zeroOp(y, i, C, xi2yC, y)

export const removeOp = /*#__PURE__*/setOp()

// Debugging

export function log() {
  const show = I.curry((dir, x) =>
   (console.log.apply(console,
                      copyToFrom([], 0, arguments, 0, arguments.length)
                      .concat([dir, x])),
    x))
  return isoU(show("get"), show("set"))
}

// Sequencing

export const seq = /*#__PURE__*/(process.env.NODE_ENV === "production" ? I.id : fn => (...xMs) => C.par(2, C.ef(reqMonad("seq")))(fn(...xMs)))(function () {
  const n = arguments.length, xMs = Array(n)
  for (let i=0; i<n; ++i)
    xMs[i] = toFunction(arguments[i])
  function loop(M, xi2xM, i, j) {
    return j === n
      ? M.of
      : x => (0,M.chain)(loop(M, xi2xM, i, j+1), xMs[j](x, i, M, xi2xM))
  }
  return (x, i, M, xi2xM) => loop(M, xi2xM, i, 0)(x)
})

// Creating new traversals

export const branch = /*#__PURE__*/(process.env.NODE_ENV === "production" ? I.id : C.par(0, C.ef(reqTemplate("branch"))))(template => {
  const keys = [], vals = []
  for (const k in template) {
    keys.push(k)
    const t = template[k]
    vals.push(I.isObject(t) ? branch(t) : toFunction(t))
  }
  return branchOn(keys, vals)
})

// Traversals and combinators

export const elems = /*#__PURE__*/(process.env.NODE_ENV === "production" ? I.id : C.par(2, C.ef(reqApplicative("elems"))))((xs, _i, A, xi2yA) => {
  if (seemsArrayLike(xs)) {
    return A === Ident  ? mapPartialIndexU(xi2yA, xs)
      :    A === Select ? selectElems(xi2yA, xs)
      :                   traversePartialIndex(A, xi2yA, xs)
  } else {
    return (0,A.of)(xs)
  }
})

export const values = /*#__PURE__*/(process.env.NODE_ENV === "production" ? I.id : C.par(2, C.ef(reqApplicative("values"))))((xs, _i, A, xi2yA) => {
  if (xs instanceof Object) {
    return A === Ident ? mapPartialObjectU(xi2yA, toObject(xs))
      :                  branchOn(I.keys(xs), void 0)(xs, void 0, A, xi2yA)
  } else {
    return (0,A.of)(xs)
  }
})

export const matches = /*#__PURE__*/(process.env.NODE_ENV === "production" ? I.id : C.dep(([re]) => re.global ? C.res(C.par(2, C.ef(reqApplicative("matches", re)))) : I.id))(re => {
  return (x, _i, C, xi2yC) => {
    if (I.isString(x)) {
      const {map} = C
      if (re.global) {
        const {ap, of, delay} = C
        const m0 = [""]
        m0.input = x
        m0.index = 0
        return map(matchesJoin(x),
                   (delay
                    ? iterLazy
                    : iterEager)(map, ap, of, delay, xi2yC, re, m0))
      } else {
        const m = x.match(re)
        if (m)
          return map(y => x.replace(re, void 0 !== y ? y : "") || void 0,
                     xi2yC(m[0], reIndex(m)))
      }
    }
    return zeroOp(x, void 0, C, xi2yC)
  }
})

// Folds over traversals

export const all = /*#__PURE__*/I.pipe2U(mkSelect(x => x ? U : T), not)

export const and = /*#__PURE__*/all()

export const any = /*#__PURE__*/I.pipe2U(selectAny, Boolean)

export const collectAs = /*#__PURE__*/I.curry((xi2y, t, s) =>
  toArray(traverseU(Collect, xi2y, t, s)) || I.array0)

export const collect = /*#__PURE__*/collectAs(I.id)

export const concatAs =
  /*#__PURE__*/mkTraverse(I.id, m => ConcatOf(m.concat, (0,m.empty)(), m.delay))

export const concat = /*#__PURE__*/concatAs(I.id)

export const countIf = /*#__PURE__*/I.curry((p, t, s) =>
  traverseU(Sum, x => p(x) ? 1 : 0, t, s))

export const count = /*#__PURE__*/countIf(I.isDefined)

export const foldl = /*#__PURE__*/I.curry((f, r, t, s) =>
  fold(f, r, traverseU(Collect, pair, t, s)))

export const foldr = /*#__PURE__*/I.curry((f, r, t, s) => {
  const xs = collectAs(pair, t, s)
  for (let i=xs.length-1; 0<=i; --i) {
    const x = xs[i]
    r = f(r, x[0], x[1])
  }
  return r
})

export const isDefined = /*#__PURE__*/I.pipe2U(mkSelect(x => void 0 !== x ? T : U), Boolean)()

export const isEmpty = /*#__PURE__*/I.pipe2U(mkSelect(I.always(T)), not)()

export const joinAs = /*#__PURE__*/mkTraverse(toStringPartial, (process.env.NODE_ENV === "production" ? I.id : C.par(0, C.ef(reqString("`join` and `joinAs` expect a string delimiter"))))(d => {
  return ConcatOf((x, y) => void 0 !== x ? void 0 !== y ? x + d + y : x : y)
}))

export const join = /*#__PURE__*/joinAs(I.id)

export const maximumBy = /*#__PURE__*/mkTraverse(reValue, MumBy(gt))(pair)

export const maximum = /*#__PURE__*/traverse(Mum(gt), I.id)

export const minimumBy = /*#__PURE__*/mkTraverse(reValue, MumBy(lt))(pair)

export const minimum = /*#__PURE__*/traverse(Mum(lt), I.id)

export const none = /*#__PURE__*/I.pipe2U(selectAny, not)

export const or = /*#__PURE__*/any()

export const productAs = /*#__PURE__*/traverse(ConcatOf((x, y) => x * y, 1))

export const product = /*#__PURE__*/productAs(unto(1))

export const selectAs = /*#__PURE__*/I.curry(mkSelect(v => void 0 !== v ? {v} : U))

export const select = /*#__PURE__*/selectAs()

export const sumAs = /*#__PURE__*/traverse(Sum)

export const sum = /*#__PURE__*/sumAs(unto(0))

// Operations on lenses

export function get(l, s) {
  return 1 < arguments.length ? getU(l, s) : s => getU(l, s)
}

// Creating new lenses

export const lens = /*#__PURE__*/I.curry(lensU)

export const setter = /*#__PURE__*/lens(I.id)

export const foldTraversalLens = /*#__PURE__*/I.curry((fold, traversal) =>
  lensU(fold(traversal), set(traversal)))

// Computing derived props

export const augment = /*#__PURE__*/(process.env.NODE_ENV === "production" ? I.id : C.fn(C.nth(0, C.ef(reqTemplate("augment"))), lens => toFunction([isoU(I.id, freeze), lens, isoU(freeze, C.ef(reqObject("`augment` must be set with undefined or an object")))])))(template => lensU(x => {
  x = I.dissocPartialU(0, x)
  if (x)
    for (const k in template)
      x[k] = template[k](x)
  return x
}, (y, x) => {
  y = toObject(y)
  if (!(x instanceof Object))
    x = void 0
  let z
  for (const k in y) {
    if (!I.hasU(k, template)) {
      if (!z)
        z = {}
      z[k] = y[k]
    } else {
      if (x && I.hasU(k, x)) {
        if (!z)
          z = {}
        z[k] = x[k]
      }
    }
  }
  return z
}))

// Enforcing invariants

export function defaults(out) {
  function o2u(x) {return replaced(out, void 0, x)}
  return (x, i, F, xi2yF) => (0,F.map)(o2u, xi2yF(void 0 !== x ? x : out, i))
}

export function define(v) {
  const untoV = unto(v)
  return (x, i, F, xi2yF) => (0,F.map)(untoV, xi2yF(void 0 !== x ? x : v, i))
}

export const normalize = xi2x => (x, i, F, xi2yF) =>
  (0,F.map)(x => void 0 !== x ? xi2x(x, i) : x,
            xi2yF(void 0 !== x ? xi2x(x, i) : x, i))

export const required = inn => replace(inn, void 0)

export const rewrite = yi2y => (x, i, F, xi2yF) =>
  (0,F.map)(y => void 0 !== y ? yi2y(y, i) : y, xi2yF(x, i))

// Lensing arrays

export function append(xs, _, F, xi2yF) {
  const i = seemsArrayLike(xs) ? xs.length : 0
  return (0,F.map)(x => setIndex(i, x, xs), xi2yF(void 0, i))
}

export const filter = /*#__PURE__*/(process.env.NODE_ENV === "production" ? I.id : C.res(lens => toFunction([lens, isoU(I.id, C.ef(reqMaybeArray("`filter` must be set with undefined or an array-like object")))])))(xi2b => (xs, i, F, xi2yF) => {
  let ts, fs
  if (seemsArrayLike(xs))
    partitionIntoIndex(xi2b, xs, ts = [], fs = [])
  return (0,F.map)(
    ts => {
      const tsN = ts ? ts.length : 0,
            fsN = fs ? fs.length : 0,
            n = tsN + fsN
      if (n)
        return n === fsN
        ? fs
        : copyToFrom(copyToFrom(Array(n), 0, ts, 0, tsN), tsN, fs, 0, fsN)
    },
    xi2yF(ts, i))
})

export const find = xi2b => (xs, _i, F, xi2yF) => {
  const ys = seemsArrayLike(xs) ? xs : "",
        i = findIndex(xi2b, ys)
  return (0,F.map)(v => setIndex(i, v, ys), xi2yF(ys[i], i))
}

export const findHint = /*#__PURE__*/I.curry((xh2b, hint) => {
  return (xs, _i, F, xi2yF) => {
    const ys = seemsArrayLike(xs) ? xs : "",
          i = hint.hint = findIndexHint(hint, xh2b, ys)
    return (0,F.map)(v => setIndex(i, v, ys), xi2yF(ys[i], i))
  }
})

export function findWith(...os) {
  const oos = toFunction(compose(...os))
  return [find(isDefined(oos)), oos]
}

export const index = process.env.NODE_ENV !== "production" ? C.ef(reqIndex) : I.id

export const last = /*#__PURE__*/choose(maybeArray =>
  seemsArrayLike(maybeArray) && maybeArray.length ? maybeArray.length-1 : 0)

export const prefix = n => slice(0, n)

export const slice = /*#__PURE__*/(process.env.NODE_ENV === "production" ? I.curry : C.res(lens => toFunction([lens, isoU(I.id, C.ef(reqMaybeArray("`slice` must be set with undefined or an array-like object")))])))((begin, end) => (xs, i, F, xsi2yF) => {
  const seems = seemsArrayLike(xs),
        xsN = seems && xs.length,
        b = sliceIndex(0, xsN, 0, begin),
        e = sliceIndex(b, xsN, xsN, end)
  return (0,F.map)(
    zs => {
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

export const suffix = n => slice(0 === n ? Infinity : !n ? 0 : -n, void 0)

// Lensing objects

export const pickIn = t =>
  I.isObject(t) ? pick(mapPartialObjectU(pickInAux, t)) : t

export const prop = process.env.NODE_ENV === "production" ? I.id : x => {
  if (!I.isString(x))
    errorGiven("`prop` expects a string", x)
  return x
}

export function props() {
  const n = arguments.length, template = {}
  for (let i=0, k; i<n; ++i)
    template[k = arguments[i]] = k
  return pick(template)
}

export const propsOf = o => props.apply(null, I.keys(o))

export function removable(...ps) {
  function drop(y) {
    if (!(y instanceof Object))
      return y
    for (let i=0, n=ps.length; i<n; ++i)
      if (I.hasU(ps[i], y))
        return y
  }
  return (x, i, F, xi2yF) => (0,F.map)(drop, xi2yF(x, i))
}

// Providing defaults

export const valueOr = v => (x, i, _F, xi2yF) => xi2yF(x != null ? x : v, i)

// Transforming data

export const pick = /*#__PURE__*/(process.env.NODE_ENV === "production" ? I.id : C.par(0, C.ef(reqTemplate("pick"))))(template => {
  return (x, i, F, xi2yF) =>
    (0,F.map)(v => setPick(template, v, x), xi2yF(getPick(template, x), i))
})

export const replace = /*#__PURE__*/I.curry((inn, out) => {
  function o2i(x) {return replaced(out, inn, x)}
  return (x, i, F, xi2yF) => (0,F.map)(o2i, xi2yF(replaced(inn, out, x), i))
})

// Operations on isomorphisms

export const getInverse = /*#__PURE__*/I.curry((o, s) => setU(o, s, void 0))

// Creating new isomorphisms

export const iso = /*#__PURE__*/I.curry(isoU)

// Isomorphism combinators

export const inverse = iso => (x, i, F, xi2yF) =>
  (0,F.map)(x => getU(iso, x), xi2yF(setU(iso, x, void 0), i))

// Basic isomorphisms

export const complement = /*#__PURE__*/isoU(notPartial, notPartial)

export const identity = (x, i, _F, xi2yF) => xi2yF(x, i)

export const is = v =>
  isoU(x => I.acyclicEqualsU(v, x),
       b => true === b ? v : void 0)

// Standard isomorphisms

export const uri =
  /*#__PURE__*/isoU(expect(I.isString, decodeURI),
                    expect(I.isString, encodeURI))

export const uriComponent =
  /*#__PURE__*/isoU(expect(I.isString, decodeURIComponent),
                    expect(I.isString, encodeURIComponent))

export const json = /*#__PURE__*/(process.env.NODE_ENV === "production" ? I.id : C.res(iso => toFunction([iso, isoU(deepFreeze, I.id)])))(options => {
  const {reviver, replacer, space} = options || I.object0
  return isoU(expect(I.isString, text => JSON.parse(text, reviver)),
              expect(I.isDefined, value => JSON.stringify(value, replacer, space)))
})

// Auxiliary

export const seemsArrayLike = x =>
  x instanceof Object && (x = x.length, x === (x >> 0) && 0 <= x) ||
  I.isString(x)
