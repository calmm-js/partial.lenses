import * as I from "infestines"

import * as C from "./contract"

//

const toStringPartial = x => void 0 !== x ? String(x) : ""

const lt = (x, y) => x < y
const gt = (x, y) => x > y

const sliceIndex = (m, l, d, i) =>
  void 0 !== i ? Math.min(Math.max(m, i < 0 ? l + i : i), l) : d

const cpair = xs => x => [x, xs]

const unto = c => x => void 0 !== x ? x : c
const unto0 = /*#__PURE__*/unto(0)

const notPartial = x => void 0 !== x ? !x : x

const singletonPartial = x => void 0 !== x ? [x] : x

const instanceofObject = x => x instanceof Object

const expect = (p, f) => x => p(x) ? f(x) : void 0

function deepFreeze(x) {
  if (Array.isArray(x)) {
    x.forEach(deepFreeze)
    I.freeze(x)
  } else if (I.isObject(x)) {
    for (const k in x)
      deepFreeze(x[k])
    I.freeze(x)
  }
  return x
}

function freezeArrayOfObjects(xs) {
  xs.forEach(I.freeze)
  return I.freeze(xs)
}

const isArrayOrPrimitive = x =>
  !(x instanceof Object) || Array.isArray(x)

const rev = /*#__PURE__*/(process.env.NODE_ENV === "production" ? I.id : C.res(I.freeze))(xs => {
  if (seemsArrayLike(xs)) {
    let n = xs.length, ys = Array(n), i=0
    while (n)
      ys[i++] = xs [--n]
    return ys
  }
})

//

const isEmptyArrayStringOrObject = x =>
  I.acyclicEqualsU(I.array0, x) || I.acyclicEqualsU(I.object0, x) || x === ""

const warnEmpty = (o, v, f) => {
  const msg = `\`${f}(${JSON.stringify(v)})\` is likely unnecessary, because combinators no longer remove empty arrays, objects, or strings by default.  See CHANGELOG for more information.`
  return x => {
    if (I.acyclicEqualsU(v, x))
      warn(o, msg)
    return x
  }
}

//

const mapPartialIndexU = /*#__PURE__*/(process.env.NODE_ENV === "production" ? I.id : C.res(I.freeze))((xi2y, xs) => {
  const n = xs.length, ys = Array(n)
  let j = 0
  for (let i=0, y; i<n; ++i)
    if (void 0 !== (y = xi2y(xs[i], i)))
      ys[j++] = y
  if (j < n)
    ys.length = j
  return ys
})

const mapIfArrayLike = (xi2y, xs) =>
  seemsArrayLike(xs) ? mapPartialIndexU(xi2y, xs) : void 0

const copyToFrom = /*#__PURE__*/(process.env.NODE_ENV === "production" ? I.id : fn => (ys, k, xs, i, j) => (ys.length === k + j - i ? I.freeze(fn(ys, k, xs, i, j)) : fn(ys, k, xs, i, j)))((ys, k, xs, i, j) => {
  while (i < j)
    ys[k++] = xs[i++]
  return ys
})

//

function selectInArrayLike(xi2v, xs) {
  for (let i=0, n=xs.length; i<n; ++i) {
    const v = xi2v(xs[i], i)
    if (void 0 !== v)
      return v
  }
}

//

const Select = {
  map: I.sndU,
  of: () => {},
  ap: (l, r) => void 0 !== l ? l : r
}

const Ident = {map: I.applyU, of: I.id, ap: I.applyU, chain: I.applyU}

const Const = {map: I.sndU}

const ConcatOf = (ap, empty) => ({map: I.sndU, ap, of: I.always(empty)})

const Sum = /*#__PURE__*/ConcatOf((x, y) => x + y, 0)

const mumBy = ord => I.curry((xi2y, t, s) => {
  let minX = void 0, minY = void 0
  traverseU(Select, (x, i) => {
    const y = xi2y(x, i)
    if (void 0 !== y && (void 0 === minY || ord(y, minY))) {
      minX = x
      minY = y
    }
  }, t, s)
  return minX
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

const mkTraverse = (after, toC) => I.curryN(4, (xi2yC, m) =>
  (m = toC(m), (t, s) => after(traverseU(m, xi2yC, t, s))))

//

const cons = t => h => void 0 !== h ? [h, t] : t
const consTo = /*#__PURE__*/(process.env.NODE_ENV === "production" ? I.id : C.res(I.freeze))(n => {
  const xs = []
  while (cons !== n) {
    xs.push(n[0])
    n=n[1]
  }
  return xs.reverse()
})

const traversePartialIndex = /*#__PURE__*/(process.env.NODE_ENV === "production" ? I.id : C.par(0, C.ef(reqApplicative("elems"))))((A, xi2yA, xs) => {
  const {map, ap} = A
  let xsA = A.of(cons)
  const n = xs.length
  if (map === I.sndU) {
    for (let i=0; i<n; ++i)
      xsA = ap(xsA, xi2yA(xs[i], i))
    return xsA
  } else {
    for (let i=0; i<n; ++i)
      xsA = ap(map(cons, xsA), xi2yA(xs[i], i))
    return map(consTo, xsA)
  }
})

//

const lensFrom = (get, set) => i => (x, _i, F, xi2yF) =>
  F.map(v => set(i, v, x), xi2yF(get(i, x), i))

//

const getProp = (k, o) => o instanceof Object ? o[k] : void 0

const setProp = /*#__PURE__*/(process.env.NODE_ENV === "production" ? I.id : C.res(I.freeze))((k, v, o) =>
  void 0 !== v ? I.assocPartialU(k, v, o) : I.dissocPartialU(k, o) || I.object0)

const funProp = /*#__PURE__*/lensFrom(getProp, setProp)

//

const getIndex = (i, xs) => seemsArrayLike(xs) ? xs[i] : void 0

const setIndex = /*#__PURE__*/(process.env.NODE_ENV === "production" ? I.id : C.fn(C.nth(0, C.ef(reqIndex)), I.freeze))((i, x, xs) => {
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
    if (n <= i)
      return copyToFrom(Array(n), 0, xs, 0, n)
    const ys = Array(n-1)
    for (let j=0; j<i; ++j)
      ys[j] = xs[j]
    for (let j=i+1; j<n; ++j)
      ys[j-1] = xs[j]
    return ys
  }
})

const funIndex = /*#__PURE__*/lensFrom(getIndex, setIndex)

//

const composedMiddle = (o, r) => (F, xi2yF) =>
  (xi2yF = r(F, xi2yF), (x, i) => o(x, i, F, xi2yF))

function composed(oi0, os) {
  let n = os.length - oi0
  if (n < 2) {
    return n ? toFunction(os[oi0]) : identity
  } else {
    const last = toFunction(os[oi0 + --n])
    let r = (F, xi2yF) => (x, i) => last(x, i, F, xi2yF)
    while (--n)
      r = composedMiddle(toFunction(os[oi0 + n]), r)
    const first = toFunction(os[oi0])
    return (x, i, F, xi2yF) => first(x, i, F, r(F, xi2yF))
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
  F.map(y => set(y, x, i), xi2yF(get(x, i), i))

const isoU = (bwd, fwd) => (x, i, F, xi2yF) => F.map(fwd, xi2yF(bwd(x), i))

//

const getPick = /*#__PURE__*/(process.env.NODE_ENV === "production" ? I.id : C.res(I.freeze))((template, x) => {
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

const toObject = x => I.constructorOf(x) !== Object ? I.toObject(x) : x

//

const mapPartialObjectU = /*#__PURE__*/(process.env.NODE_ENV === "production" ? I.id : C.res(I.freeze))((xi2y, o) => {
  const r = {}
  for (const k in o) {
    const v = xi2y(o[k], k)
    if (void 0 !== v)
      r[k] = v
  }
  return r
})

const branchOnMerge = /*#__PURE__*/(process.env.NODE_ENV === "production" ? I.id : C.res(C.res(I.freeze)))((x, keys) => xs => {
  const o = {}, n = keys.length
  for (let i=n; i; xs=xs[1]) {
    const v = xs[0]
    o[keys[--i]] = void 0 !== v ? v : o
  }
  const r = {}
  x = toObject(x)
  for (const k in x) {
    const v = o[k]
    if (o !== v) {
      o[k] = o
      r[k] = void 0 !== v ? v : x[k]
    }
  }
  for (let i=0; i<n; ++i) {
    const k = keys[i]
    const v = o[k]
    if (o !== v)
      r[k] = v
  }
  return r
})

const branchOn = /*#__PURE__*/(process.env.NODE_ENV === "production" ? I.id : C.dep(([_keys, vals]) => C.res(C.par(2, C.ef(reqApplicative(vals ? "branch" : "values"))))))((keys, vals) => (x, _i, A, xi2yA) => {
  const {of} = A
  let n = keys.length
  if (!n)
    return of(x)
  if (!(x instanceof Object))
    x = I.object0
  if (Select === A) {
    for (let i=0; i<n; ++i) {
      const k = keys[i], v = x[k]
      const y = vals ? vals[i](v, k, A, xi2yA) : xi2yA(v, k)
      if (void 0 !== y)
        return y
    }
  } else {
    const {map, ap} = A
    let xsA = of(cpair)
    for (let i=0; i<n; ++i) {
      const k = keys[i], v = x[k]
      xsA = ap(map(cpair, xsA), vals ? vals[i](v, k, A, xi2yA) : xi2yA(v, k))
    }
    return map(branchOnMerge(x, keys), xsA)
  }
})

const replaced = (inn, out, x) => I.acyclicEqualsU(x, inn) ? out : x

function findIndexHint(hint, xi2b, xs) {
  let u = hint.hint
  const n = xs.length
  if (n <= u) u = n-1
  if (u < 0) u = 0
  let d = u-1
  for (; 0 <= d && u < n; ++u, --d) {
    if (xi2b(xs[u], u, hint))
      return u
    if (xi2b(xs[d], d, hint))
      return d
  }
  for (; u < n; ++u)
    if (xi2b(xs[u], u, hint))
      return u
  for (; 0 <= d; --d)
    if (xi2b(xs[d], d, hint))
      return d
  return n
}

const partitionIntoIndex = /*#__PURE__*/(process.env.NODE_ENV === "production" ? I.id : C.dep(([_xi2b, _xs, ts, fs]) => C.res(C.ef(() => {I.freeze(ts); I.freeze(fs)}))))((xi2b, xs, ts, fs) => {
  for (let i=0, n=xs.length, x; i<n; ++i)
    (xi2b(x = xs[i], i) ? ts : fs).push(x)
})

const fromReader = wi2x => (w, i, F, xi2yF) =>
  F.map(I.always(w), xi2yF(wi2x(w, i), i))

//

const reValue = m => m[0]
const reIndex = m => m.index

const reNext = /*#__PURE__*/(process.env.NODE_ENV === "production" ? I.id : fn => (m, re) => {
  const res = fn(m, re)
  if ("" === res)
    warn(reNext, `\`matches(${re})\` traversal terminated due to empty match.  \`matches\` traversal shouldn't be used with regular expressions that can produce empty matches.`)
  return res
})((m, re) => {
  const lastIndex = re.lastIndex
  re.lastIndex = reIndex(m) + m[0].length
  const n = re.exec(m.input)
  re.lastIndex = lastIndex
  return n && n[0] && n
})

//

const iterCollect = s => xs => x => [s, x, xs]

const iterToArray = xs => {
  const ys = []
  while (iterCollect !== xs) {
    ys.push(xs[0], xs[1])
    xs = xs[2]
  }
  return ys
}

function iterSelect(xi2y, t, s) {
  while ((s = reNext(s, t))) {
    const y = xi2y(reValue(s), reIndex(s))
    if (void 0 !== y)
      return y
  }
}

function iterEager(map, ap, of, xi2yA, t, s) {
  let r = of(iterCollect)
  while ((s = reNext(s, t)))
    r = ap(ap(map(iterCollect, of(s)), r),
           xi2yA(reValue(s), reIndex(s)))
  return r
}

//

const keyed = /*#__PURE__*/isoU(expect(instanceofObject, (process.env.NODE_ENV === "production" ? I.id : C.res(freezeArrayOfObjects))(x => {
  x = toObject(x)
  const es = []
  for (const key in x)
    es.push([key, x[key]])
  return es
})), expect(I.isArray, (process.env.NODE_ENV === "production" ? I.id : C.res(I.freeze))(es => {
  const o = {}
  for (let i=0, n=es.length; i<n; ++i) {
    const entry = es[i]
    if (entry.length === 2)
      o[entry[0]] = entry[1]
  }
  return o
})))

//

const matchesJoin = input => matchesIn => {
  let result = ""
  let lastIndex = 0
  const matches = iterToArray(matchesIn)
  const n = matches.length
  for (let j=n-2; j !== -2; j += -2) {
    const m = matches[j], i = reIndex(m)
    result += input.slice(lastIndex, i)
    const s = matches[j+1]
    if (void 0 !== s)
      result += s
    lastIndex = i + m[0].length
  }

  result += input.slice(lastIndex)
  return result
}

//

const identity = (x, i, _F, xi2yF) => xi2yF(x, i)

const ifteU = (c, t, e) => (x, i, C, xi2yC) => (c(x, i) ? t : e)(x, i, C, xi2yC)

const orElseU = (back, prim) =>
  (prim = toFunction(prim), back = toFunction(back),
   (x, i, C, xi2yC) => (isDefined(prim, x) ? prim : back)(x, i, C, xi2yC))

function zeroOp(y, i, C, xi2yC, x) {
  const of = C.of
  return of ? of(y) : C.map(I.always(y), xi2yC(x, i))
}

//

const pickInAux = (t, k) => [k, pickIn(t)]

// Auxiliary

export const seemsArrayLike = x =>
  x instanceof Object && (x = x.length, x === (x >> 0) && 0 <= x) ||
  I.isString(x)

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

export const unless = p => ifteU(p, zeroOp, identity)

export const when = p => ifteU(p, identity, zeroOp)

export const optional = /*#__PURE__*/when(I.isDefined)

export const zero = (x, i, C, xi2yC) => zeroOp(x, i, C, xi2yC)

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
      : x => M.chain(loop(M, xi2xM, i, j+1), xMs[j](x, i, M, xi2xM))
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
      :    A === Select ? selectInArrayLike(xi2yA, xs)
      :                   traversePartialIndex(A, xi2yA, xs)
  } else {
    return A.of(xs)
  }
})

export const entries = /*#__PURE__*/toFunction([keyed, elems])

export const flatten =
  /*#__PURE__*/lazy(rec => iftes(Array.isArray, [elems, rec], identity))

export const keys = /*#__PURE__*/toFunction([keyed, elems, 0])

export const matches = /*#__PURE__*/(process.env.NODE_ENV === "production" ? I.id : C.dep(([re]) => re.global ? C.res(C.par(2, C.ef(reqApplicative("matches", re)))) : I.id))(re => {
  return (x, _i, C, xi2yC) => {
    if (I.isString(x)) {
      const {map} = C
      if (re.global) {
        const m0 = [""]
        m0.input = x
        m0.index = 0
        if (Select === C) {
          return iterSelect(xi2yC, re, m0)
        } else {
          const {ap, of} = C
          return map(matchesJoin(x), iterEager(map, ap, of, xi2yC, re, m0))
        }
      } else {
        const m = x.match(re)
        if (m)
          return map(y => x.replace(re, void 0 !== y ? y : ""),
                     xi2yC(m[0], reIndex(m)))
      }
    }
    return zeroOp(x, void 0, C, xi2yC)
  }
})

export const values = /*#__PURE__*/(process.env.NODE_ENV === "production" ? I.id : C.par(2, C.ef(reqApplicative("values"))))((xs, _i, A, xi2yA) => {
  if (xs instanceof Object) {
    return A === Ident ? mapPartialObjectU(xi2yA, toObject(xs))
      :                  branchOn(I.keys(xs), void 0)(xs, void 0, A, xi2yA)
  } else {
    return A.of(xs)
  }
})

// Folds over traversals

export const all = /*#__PURE__*/I.curry((xi2b, t, s) =>
  !traverseU(Select, (x, i) => {
    if (!xi2b(x, i))
      return true
  }, t, s))

export const and = /*#__PURE__*/all(I.id)

export const any = /*#__PURE__*/I.curry((xi2b, t, s) =>
  !!traverseU(Select, (x, i) => {
    if (xi2b(x, i))
      return true
  }, t, s))

export const collectAs = /*#__PURE__*/(process.env.NODE_ENV === "production" ? I.curry : C.res(I.freeze))((xi2y, t, s) => {
  const results = []
  traverseU(Select, (x, i) => {
    const y = xi2y(x, i)
    if (void 0 !== y)
       results.push(y)
  }, t, s)
  return results
})

export const collect = /*#__PURE__*/collectAs(I.id)

export const concatAs =
  /*#__PURE__*/mkTraverse(I.id, m => ConcatOf(m.concat, m.empty()))

export const concat = /*#__PURE__*/concatAs(I.id)

export const countIf = /*#__PURE__*/I.curry((p, t, s) =>
  traverseU(Sum, (x, i) => p(x, i) ? 1 : 0, t, s))

export const count = /*#__PURE__*/countIf(I.isDefined)

export const countsAs = /*#__PURE__*/I.curry((xi2k, t, s) => {
  const counts = new Map()
  traverseU(Select, (x, i) => {
    const k = xi2k(x, i),
          n = counts.get(k)
    counts.set(k, void 0 !== n ? n + 1 : 1)
  }, t, s)
  return counts
})

export const counts = /*#__PURE__*/countsAs(I.id)

export const foldl = /*#__PURE__*/I.curry((f, r, t, s) => {
  traverseU(Select, (x, i) => {r = f(r, x, i)}, t, s)
  return r
})

export const foldr = /*#__PURE__*/I.curry((f, r, t, s) => {
  const is = [], xs = []
  traverseU(Select, (x, i) => {xs.push(x); is.push(i)}, t, s)
  for (let i=xs.length-1; 0<=i; --i)
    r = f(r, xs[i], is[i])
  return r
})

export const forEach = /*#__PURE__*/I.curry((f, t, s) =>
  traverseU(Select, (x, i) => {f(x, i)}, t, s))

export const isDefined = /*#__PURE__*/I.curry((t, s) =>
  void 0 !== traverseU(Select, I.id, t, s))

export const isEmpty = /*#__PURE__*/I.curry((t, s) =>
  !traverseU(Select, I.always(true), t, s))

export const joinAs = /*#__PURE__*/mkTraverse(toStringPartial, (process.env.NODE_ENV === "production" ? I.id : C.par(0, C.ef(reqString("`join` and `joinAs` expect a string delimiter"))))(d => {
  return ConcatOf((x, y) => void 0 !== x ? void 0 !== y ? x + d + y : x : y)
}))

export const join = /*#__PURE__*/joinAs(I.id)

export const maximumBy = /*#__PURE__*/mumBy(gt)

export const maximum = /*#__PURE__*/maximumBy(I.id)

export const meanAs = /*#__PURE__*/I.curry((xi2y, t, s) => {
  let sum = 0
  let num = 0
  traverseU(Select, (x, i) => {
    const y = xi2y(x, i)
    if (void 0 !== y) {
      num += 1
      sum += y
    }
  }, t, s)
  return sum / num
})

export const mean = /*#__PURE__*/meanAs(I.id)

export const minimumBy = /*#__PURE__*/mumBy(lt)

export const minimum = /*#__PURE__*/minimumBy(I.id)

export const none = /*#__PURE__*/I.curry((xi2b, t, s) =>
  !traverseU(Select, (x, i) => {
    if (xi2b(x, i))
      return true
  }, t, s))

export const or = /*#__PURE__*/any(I.id)

export const productAs = /*#__PURE__*/traverse(ConcatOf((x, y) => x * y, 1))

export const product = /*#__PURE__*/productAs(unto(1))

export const selectAs = /*#__PURE__*/traverse(Select)

export const select = /*#__PURE__*/selectAs(I.id)

export const sumAs = /*#__PURE__*/traverse(Sum)

export const sum = /*#__PURE__*/sumAs(unto0)

// Operations on lenses

export function get(l, s) {
  return 1 < arguments.length ? getU(l, s) : s => getU(l, s)
}

// Creating new lenses

export const lens = /*#__PURE__*/I.curry(lensU)

export const setter = /*#__PURE__*/lens(I.id)

export const foldTraversalLens = /*#__PURE__*/I.curry((fold, traversal) =>
  lensU(fold(traversal), set(traversal)))

// Enforcing invariants

export function defaults(out) {
  function o2u(x) {return replaced(out, void 0, x)}
  return (x, i, F, xi2yF) => F.map(o2u, xi2yF(void 0 !== x ? x : out, i))
}

export const define = /*#__PURE__*/(process.env.NODE_ENV === "production" ? I.id : fn => inn => {
  const res = fn(inn)
  if (isEmptyArrayStringOrObject(inn))
    return toFunction([isoU(warnEmpty(fn, inn, "define"), I.id),
                       res,
                       isoU(I.id, warnEmpty(define, inn, "define"))])
  else
    return res
})(v => {
  const untoV = unto(v)
  return (x, i, F, xi2yF) => F.map(untoV, xi2yF(void 0 !== x ? x : v, i))
})

export const normalize = xi2x => [reread(xi2x), rewrite(xi2x)]

export const required = /*#__PURE__*/(process.env.NODE_ENV === "production" ? I.id : fn => inn => {
  const res = fn(inn)
  if (isEmptyArrayStringOrObject(inn))
    return toFunction([res, isoU(I.id, warnEmpty(required, inn, "required"))])
  else
    return res
})(inn => replace(inn, void 0))

export const reread = xi2x => (x, i, _F, xi2yF) =>
  xi2yF(void 0 !== x ? xi2x(x, i) : x, i)

export const rewrite = yi2y => (x, i, F, xi2yF) =>
  F.map(y => void 0 !== y ? yi2y(y, i) : y, xi2yF(x, i))

// Lensing arrays

export function append(xs, _, F, xi2yF) {
  const i = seemsArrayLike(xs) ? xs.length : 0
  return F.map(x => setIndex(i, x, xs), xi2yF(void 0, i))
}

export const filter = /*#__PURE__*/(process.env.NODE_ENV === "production" ? I.id : C.res(lens => toFunction([lens, isoU(I.id, C.ef(reqMaybeArray("`filter` must be set with undefined or an array-like object")))])))(xi2b => (xs, i, F, xi2yF) => {
  let ts, fs
  if (seemsArrayLike(xs))
    partitionIntoIndex(xi2b, xs, ts = [], fs = [])
  return F.map(
    ts => {
      const tsN = ts ? ts.length : 0,
            fsN = fs ? fs.length : 0,
            n = tsN + fsN
      return n === fsN
        ? fs
        : copyToFrom(copyToFrom(Array(n), 0, ts, 0, tsN), tsN, fs, 0, fsN)
    },
    xi2yF(ts, i))
})

export function find(xih2b) {
  const hint = arguments.length > 1 ? arguments[1] : {hint: 0}
  return (xs, _i, F, xi2yF) => {
    const ys = seemsArrayLike(xs) ? xs : "",
          i = hint.hint = findIndexHint(hint, xih2b, ys)
    return F.map(v => setIndex(i, v, ys), xi2yF(ys[i], i))
  }
}

export function findWith(o) {
  const oo = toFunction(o), p = isDefined(oo)
  return [arguments.length > 1 ? find(p, arguments[1]) : find(p), oo]
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
  return F.map(
    zs => {
      const zsN = zs ? zs.length : 0, bPzsN = b + zsN, n = xsN - e + bPzsN
      return copyToFrom(copyToFrom(copyToFrom(Array(n), 0, xs, 0, b),
                                   b,
                                   zs, 0, zsN),
                        bPzsN,
                        xs, e, xsN)
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
  return (x, i, F, xi2yF) => F.map(drop, xi2yF(x, i))
}

// Providing defaults

export const valueOr = v => (x, i, _F, xi2yF) => xi2yF(x != null ? x : v, i)

// Transforming data

export const pick = /*#__PURE__*/(process.env.NODE_ENV === "production" ? I.id : C.par(0, C.ef(reqTemplate("pick"))))(template => {
  return (x, i, F, xi2yF) =>
    F.map(v => setPick(template, v, x), xi2yF(getPick(template, x), i))
})

export const replace = /*#__PURE__*/I.curry((inn, out) => {
  function o2i(x) {return replaced(out, inn, x)}
  return (x, i, F, xi2yF) => F.map(o2i, xi2yF(replaced(inn, out, x), i))
})

// Operations on isomorphisms

export function getInverse(o, s) {
  return 1 < arguments.length ? setU(o, s, void 0) : s => setU(o, s, void 0)
}

// Creating new isomorphisms

export const iso = /*#__PURE__*/I.curry(isoU)

// Isomorphism combinators

export const array = elem => {
  const fwd = getInverse(elem),
        bwd = get(elem),
        mapFwd = x => mapIfArrayLike(fwd, x)
  return (x, i, F, xi2yF) =>
    F.map(mapFwd, xi2yF(mapIfArrayLike(bwd, x), i))
}

export const inverse = iso => (x, i, F, xi2yF) =>
  F.map(x => getU(iso, x), xi2yF(setU(iso, x, void 0), i))

// Basic isomorphisms

export const complement = /*#__PURE__*/isoU(notPartial, notPartial)

export {identity}

export const indexed = /*#__PURE__*/isoU(expect(seemsArrayLike, (process.env.NODE_ENV === "production" ? I.id : C.res(freezeArrayOfObjects))(xs => {
  const n = xs.length, xis = Array(n)
  for (let i=0; i<n; ++i)
    xis[i] = [i, xs[i]]
  return xis
})), expect(I.isArray, (process.env.NODE_ENV === "production" ? I.id : C.res(I.freeze))(xis => {
  let n = xis.length, xs = Array(n)
  for (let i=0; i<n; ++i) {
    const xi = xis[i]
    if (xi.length === 2)
      xs[xi[0]] = xi[1]
  }
  n = xs.length
  let j=0
  for (let i=0; i<n; ++i) {
    const x = xs[i]
    if (void 0 !== x) {
      if (i !== j)
        xs[j] = x
      ++j
    }
  }
  xs.length = j
  return xs
})))

export const is = v =>
  isoU(x => I.acyclicEqualsU(v, x),
       b => true === b ? v : void 0)

export {keyed}

export const reverse = /*#__PURE__*/isoU(rev, rev)

export const singleton = /*#__PURE__*/(process.env.NODE_ENV === "production" ? I.id : iso => toFunction([isoU(I.id, I.freeze), iso]))(
  (x, i, F, xi2yF) =>
    F.map(singletonPartial,
          xi2yF((x instanceof Object || I.isString(x)) && x.length === 1
                ? x[0]
                : void 0,
                i)))

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

// Interop

export const pointer = s => {
  if (s[0] === '#') s = decodeURIComponent(s)
  const ts = s.split('/')
  const n = ts.length
  for (let i=1; i<n; ++i) {
    const t = ts[i]
    ts[i-1] =
      /^0|[1-9]\d*$/.test(t)
        ? iftes(isArrayOrPrimitive, Number(t), t)
        : '-' === t
        ? iftes(isArrayOrPrimitive, append, t)
        : t.replace('~1', '/').replace('~0', '~')
  }
  ts.length = n-1
  return ts
}
