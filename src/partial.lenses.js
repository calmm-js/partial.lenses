import * as I from './ext/infestines'

import * as C from './contract'

//

const toRegExpU = (str, flags) =>
  I.isString(str)
    ? new RegExp(I.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&', str), flags)
    : str

const toStringPartial = x => (void 0 !== x ? String(x) : '')

const sliceIndex = (m, l, d, i) =>
  void 0 !== i ? Math.min(Math.max(m, i < 0 ? l + i : i), l) : d

const cpair = xs => x => [x, xs]

const unto = c => x => (void 0 !== x ? x : c)
const unto0 = unto(0)

const notPartial = x => (void 0 !== x ? !x : x)

const singletonPartial = x => (void 0 !== x ? [x] : x)

const expect = (p, f) => x => (p(x) ? f(x) : void 0)

function deepFreeze(x) {
  if (I.isArray(x)) {
    x.forEach(deepFreeze)
    I.freeze(x)
  } else if (I.isObject(x)) {
    for (const k in x) deepFreeze(x[k])
    I.freeze(x)
  }
  return x
}

function freezeArrayOfObjects(xs) {
  xs.forEach(I.freeze)
  return I.freeze(xs)
}

const isArrayOrPrimitive = x => !(x instanceof Object) || I.isArray(x)

const rev = (process.env.NODE_ENV === 'production' ? I.id : C.res(I.freeze))(
  xs => {
    if (seemsArrayLike(xs)) {
      let n = xs.length
      const ys = Array(n)
      let i = 0
      while (n) ys[i++] = xs[--n]
      return ys
    }
  }
)

//

const isEmptyArrayStringOrObject = x =>
  I.acyclicEqualsU(I.array0, x) || I.acyclicEqualsU(I.object0, x) || x === ''

const warnEmpty = (o, v, f) => {
  const msg = `\`${f}(${JSON.stringify(
    v
  )})\` is likely unnecessary, because combinators no longer remove empty arrays, objects, or strings by default.  See CHANGELOG for more information.`
  return x => {
    if (I.acyclicEqualsU(v, x)) warn(o, msg)
    return x
  }
}

//

const mapPartialIndexU = (process.env.NODE_ENV === 'production'
  ? I.id
  : C.res(I.freeze))((xi2y, xs) => {
  const n = xs.length
  const ys = Array(n)
  let j = 0
  for (let i = 0, y; i < n; ++i)
    if (void 0 !== (y = xi2y(xs[i], i))) ys[j++] = y
  if (j < n) ys.length = j
  return ys
})

const mapIfArrayLike = (xi2y, xs) =>
  seemsArrayLike(xs) ? mapPartialIndexU(xi2y, xs) : void 0

const copyToFrom = (process.env.NODE_ENV === 'production'
  ? I.id
  : fn => (ys, k, xs, i, j) =>
      ys.length === k + j - i
        ? I.freeze(fn(ys, k, xs, i, j))
        : fn(ys, k, xs, i, j))((ys, k, xs, i, j) => {
  while (i < j) ys[k++] = xs[i++]
  return ys
})

//

function selectInArrayLike(xi2v, xs) {
  for (let i = 0, n = xs.length; i < n; ++i) {
    const v = xi2v(xs[i], i)
    if (void 0 !== v) return v
  }
}

//

const Select = {
  map: I.sndU,
  of: () => {},
  ap: (l, r) => (void 0 !== l ? l : r)
}

const ConcatOf = (ap, empty) => ({map: I.sndU, ap, of: I.always(empty)})

const Sum = ConcatOf(I.addU, 0)

const mumBy = ord =>
  I.curry((xi2y, t, s) => {
    let minX = void 0
    let minY = void 0
    traverseU(
      Select,
      (x, i) => {
        const y = xi2y(x, i)
        if (void 0 !== y && (void 0 === minY || ord(y, minY))) {
          minX = x
          minY = y
        }
      },
      t,
      s
    )
    return minX
  })

//

const traverseU = (C, xi2yC, t, s) => toFunction(t)(s, void 0, C, xi2yC)

//

const expectedOptic = 'Expecting an optic'
const opticIsEither = `An optic can be either
- a string,
- a non-negative integer,
- a quaternary optic function,
- an ordinary unary or binary function, or
- an array of optics.
See documentation of \`toFunction\` and \`compose\` for details.`
const header = 'partial.lenses: '

function warn(f, m) {
  if (!f.warned) {
    f.warned = 1
    console.warn(header + m)
  }
}

function errorGiven(m, o, e) {
  m = header + m + '.'
  e = e ? '\n' + e : ''
  console.error(m, 'Given:', o, e)
  throw Error(m + e)
}

function reqIndex(x) {
  if (!Number.isInteger(x) || x < 0)
    errorGiven('`index` expects a non-negative integer', x)
}

function reqFunction(o) {
  if (!(I.isFunction(o) && (o.length === 4 || o.length <= 2)))
    errorGiven(expectedOptic, o, opticIsEither)
}

function reqFn(x) {
  if (!I.isFunction(x)) errorGiven('Expected a function', x)
}

function reqArray(o) {
  if (!I.isArray(o)) errorGiven(expectedOptic, o, opticIsEither)
}

function reqOptic(o) {
  switch (typeof o) {
    case 'string':
      break
    case 'number':
      reqIndex(o)
      break
    case 'object':
      reqArray(o)
      for (let i = 0, n = o.length; i < n; ++i) reqOptic(o[i])
      break
    default:
      reqFunction(o)
      break
  }
}

//

const reqString = msg => x => {
  if (!I.isString(x)) errorGiven(msg, x)
}

const reqMaybeArray = msg => zs => {
  if (!(void 0 === zs || seemsArrayLike(zs))) errorGiven(msg, zs)
}

//

const reqApplicative = (name, arg) => C => {
  if (!C.of)
    errorGiven(
      `\`${name}${arg ? `(${arg})` : ''}\` requires an applicative`,
      C,
      'Note that you cannot `get` a traversal. Perhaps you wanted to `collect` it?'
    )
}

const reqMonad = name => C => {
  if (!C.chain)
    errorGiven(
      `\`${name}\` requires a monad`,
      C,
      'Note that you can only `modify`, `remove`, `set`, and `traverse` a transform.'
    )
}

//

const mkTraverse = (after, toC) =>
  I.curryN(
    4,
    (xi2yC, m) => ((m = toC(m)), (t, s) => after(traverseU(m, xi2yC, t, s)))
  )

//

const cons = t => h => (void 0 !== h ? [h, t] : t)
const consTo = (process.env.NODE_ENV === 'production' ? I.id : C.res(I.freeze))(
  n => {
    const xs = []
    while (cons !== n) {
      xs.push(n[0])
      n = n[1]
    }
    return xs.reverse()
  }
)

function traversePartialIndex(A, xi2yA, xs) {
  const {map, ap} = A
  let xsA = A.of(cons)
  const n = xs.length
  if (map === I.sndU) {
    for (let i = 0; i < n; ++i) xsA = ap(xsA, xi2yA(xs[i], i))
    return xsA
  } else {
    for (let i = 0; i < n; ++i) xsA = ap(map(cons, xsA), xi2yA(xs[i], i))
    return map(consTo, xsA)
  }
}

//

const lensFrom = (get, set) => i => (x, _i, F, xi2yF) =>
  F.map(v => set(i, v, x), xi2yF(get(i, x), i))

//

const getProp = (k, o) => (o instanceof Object ? o[k] : void 0)

const setProp = (process.env.NODE_ENV === 'production'
  ? I.id
  : C.res(I.freeze))(
  (k, v, o) =>
    void 0 !== v
      ? I.assocPartialU(k, v, o)
      : I.dissocPartialU(k, o) || I.object0
)

const funProp = lensFrom(getProp, setProp)

//

const getIndex = (i, xs) => (seemsArrayLike(xs) ? xs[i] : void 0)

const setIndex = (process.env.NODE_ENV === 'production'
  ? I.id
  : C.fn(C.nth(0, C.ef(reqIndex)), I.freeze))((i, x, xs) => {
  if (!seemsArrayLike(xs)) xs = ''
  const n = xs.length
  if (void 0 !== x) {
    const m = Math.max(i + 1, n)
    const ys = Array(m)
    for (let j = 0; j < m; ++j) ys[j] = xs[j]
    ys[i] = x
    return ys
  } else {
    if (n <= i) return copyToFrom(Array(n), 0, xs, 0, n)
    const ys = Array(n - 1)
    for (let j = 0; j < i; ++j) ys[j] = xs[j]
    for (let j = i + 1; j < n; ++j) ys[j - 1] = xs[j]
    return ys
  }
})

const funIndex = lensFrom(getIndex, setIndex)

//

const composedMiddle = (o, r) => (F, xi2yF) => (
  (xi2yF = r(F, xi2yF)), (x, i) => o(x, i, F, xi2yF)
)

function composed(oi0, os) {
  let n = os.length - oi0
  if (n < 2) {
    return n ? toFunction(os[oi0]) : identity
  } else {
    const last = toFunction(os[oi0 + --n])
    let r = (F, xi2yF) => (x, i) => last(x, i, F, xi2yF)
    while (--n) r = composedMiddle(toFunction(os[oi0 + n]), r)
    const first = toFunction(os[oi0])
    return (x, i, F, xi2yF) => first(x, i, F, r(F, xi2yF))
  }
}

const setU = (process.env.NODE_ENV === 'production'
  ? I.id
  : C.par(0, C.ef(reqOptic)))((o, x, s) => {
  switch (typeof o) {
    case 'string':
      return setProp(o, x, s)
    case 'number':
      return setIndex(o, x, s)
    case 'object':
      return modifyComposed(o, 0, s, x)
    default:
      return o.length === 4 ? o(s, void 0, Identity, I.always(x)) : s
  }
})

const modifyU = (process.env.NODE_ENV === 'production'
  ? I.id
  : C.par(0, C.ef(reqOptic)))((o, xi2x, s) => {
  switch (typeof o) {
    case 'string':
      return setProp(o, xi2x(getProp(o, s), o), s)
    case 'number':
      return setIndex(o, xi2x(getIndex(o, s), o), s)
    case 'object':
      return modifyComposed(o, xi2x, s)
    default:
      return o.length === 4
        ? o(s, void 0, Identity, xi2x)
        : (xi2x(o(s, void 0), void 0), s)
  }
})

function makeIx(i) {
  const ix = (s, j) => ((ix.v = j), s)
  ix.v = i
  return ix
}

function getNestedU(l, s, j, ix) {
  for (let n = l.length, o; j < n; ++j)
    switch (typeof (o = l[j])) {
      case 'string':
        s = getProp((ix.v = o), s)
        break
      case 'number':
        s = getIndex((ix.v = o), s)
        break
      case 'object':
        s = getNestedU(o, s, 0, ix)
        break
      default:
        s = o(s, ix.v, Constant, ix)
    }
  return s
}

const getU = (process.env.NODE_ENV === 'production'
  ? I.id
  : C.par(0, C.ef(reqOptic)))((l, s) => {
  switch (typeof l) {
    case 'string':
      return getProp(l, s)
    case 'number':
      return getIndex(l, s)
    case 'object':
      for (let i = 0, n = l.length, o; i < n; ++i)
        switch (typeof (o = l[i])) {
          case 'string':
            s = getProp(o, s)
            break
          case 'number':
            s = getIndex(o, s)
            break
          default:
            return getNestedU(l, s, i, makeIx(l[i - 1]))
        }
      return s
    default:
      return l(s, void 0, Constant, I.id)
  }
})

function modifyComposed(os, xi2y, x, y) {
  let n = os.length
  const xs = Array(n)
  for (let i = 0, o; i < n; ++i) {
    xs[i] = x
    switch (typeof (o = os[i])) {
      case 'string':
        x = getProp(o, x)
        break
      case 'number':
        x = getIndex(o, x)
        break
      default:
        x = composed(i, os)(x, os[i - 1], Identity, xi2y || I.always(y))
        n = i
        break
    }
  }
  if (n === os.length) x = xi2y ? xi2y(x, os[n - 1]) : y
  for (let o; 0 <= --n; )
    x = I.isString((o = os[n])) ? setProp(o, x, xs[n]) : setIndex(o, x, xs[n])
  return x
}

//

const lensU = (get, set) => (x, i, F, xi2yF) =>
  F.map(y => set(y, x, i), xi2yF(get(x, i), i))

const isoU = (bwd, fwd) => (x, i, F, xi2yF) => F.map(fwd, xi2yF(bwd(x), i))

const stringIsoU = (bwd, fwd) =>
  isoU(expect(I.isString, bwd), expect(I.isString, fwd))

const numberIsoU = (bwd, fwd) =>
  isoU(expect(I.isNumber, bwd), expect(I.isNumber, fwd))

//

const getPick = (process.env.NODE_ENV === 'production'
  ? I.id
  : C.res(I.freeze))((template, x) => {
  let r
  for (const k in template) {
    const t = template[k]
    const v = I.isObject(t) ? getPick(t, x) : getU(t, x)
    if (void 0 !== v) {
      if (!r) r = {}
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
  if (!(void 0 === value || value instanceof Object)) errorGiven(msg, value)
}

const setPick = (process.env.NODE_ENV === 'production'
  ? I.id
  : C.par(
      1,
      C.ef(reqObject('`pick` must be set with undefined or an object'))
    ))((template, value, x) => {
  for (const k in template) {
    const v = value && value[k]
    const t = template[k]
    x = I.isObject(t) ? setPick(t, v, x) : setU(t, v, x)
  }
  return x
})

//

const toObject = x => (I.constructorOf(x) !== Object ? I.toObject(x) : x)

//

const identity = (x, i, _F, xi2yF) => xi2yF(x, i)

//

const branchAssemble = (process.env.NODE_ENV === 'production'
  ? I.id
  : C.res(C.res(I.freeze)))(ks => xs => {
  const r = {}
  let i = ks.length
  while (i--) {
    const v = xs[0]
    if (void 0 !== v) {
      r[ks[i]] = v
    }
    xs = xs[1]
  }
  return r
})

const branchOr1Level = (otherwise, k2o) => (x, _i, A, xi2yA) => {
  const xO = x instanceof Object ? toObject(x) : I.object0

  if (Identity === A) {
    let written = void 0
    const r = {}
    for (const k in k2o) {
      written = 1
      const y = k2o[k](xO[k], k, A, xi2yA)
      if (void 0 !== y) r[k] = y
    }
    const t = written
    for (const k in xO) {
      if (void 0 === (t && k2o[k])) {
        written = 1
        const y = otherwise(xO[k], k, A, xi2yA)
        if (void 0 !== y) r[k] = y
      }
    }
    return written ? r : x
  } else if (Select === A) {
    for (const k in k2o) {
      const y = k2o[k](xO[k], k, A, xi2yA)
      if (void 0 !== y) return y
    }
    for (const k in xO) {
      if (void 0 === k2o[k]) {
        const y = otherwise(xO[k], k, A, xi2yA)
        if (void 0 !== y) return y
      }
    }
  } else {
    const {map, ap, of} = A
    let xsA = of(cpair)
    const ks = []
    for (const k in k2o) {
      ks.push(k)
      xsA = ap(map(cpair, xsA), k2o[k](xO[k], k, A, xi2yA))
    }
    const t = ks.length ? true : void 0
    for (const k in xO) {
      if (void 0 === (t && k2o[k])) {
        ks.push(k)
        xsA = ap(map(cpair, xsA), otherwise(xO[k], k, A, xi2yA))
      }
    }
    return ks.length ? map(branchAssemble(ks), xsA) : of(x)
  }
}

function branchOrU(otherwise, template) {
  const k2o = I.create(null)
  for (const k in template) {
    const v = template[k]
    k2o[k] = I.isObject(v) ? branchOrU(otherwise, v) : toFunction(v)
  }
  return branchOr1Level(otherwise, k2o)
}

const replaced = (inn, out, x) => (I.acyclicEqualsU(x, inn) ? out : x)

function findIndexHint(hint, xi2b, xs) {
  let u = hint.hint
  const n = xs.length
  if (n <= u) u = n - 1
  if (u < 0) u = 0
  let d = u - 1
  for (; 0 <= d && u < n; ++u, --d) {
    if (xi2b(xs[u], u, hint)) return u
    if (xi2b(xs[d], d, hint)) return d
  }
  for (; u < n; ++u) if (xi2b(xs[u], u, hint)) return u
  for (; 0 <= d; --d) if (xi2b(xs[d], d, hint)) return d
  return n
}

const partitionIntoIndex = (process.env.NODE_ENV === 'production'
  ? I.id
  : C.dep((_xi2b, _xs, ts, fs) =>
      C.res(
        C.ef(() => {
          I.freeze(ts)
          I.freeze(fs)
        })
      )
    ))((xi2b, xs, ts, fs) => {
  for (let i = 0, n = xs.length, x; i < n; ++i)
    (xi2b((x = xs[i]), i) ? ts : fs).push(x)
})

const fromReader = wi2x => (w, i, F, xi2yF) =>
  F.map(I.always(w), xi2yF(wi2x(w, i), i))

//

const reValue = m => m[0]
const reIndex = m => m.index
const reLastIndex = m => reIndex(m) + m[0].length

const reNext = (process.env.NODE_ENV === 'production'
  ? I.id
  : fn => (m, re) => {
      const res = fn(m, re)
      if ('' === res)
        warn(
          reNext,
          `\`matches(${re})\` traversal terminated due to empty match.  \`matches\` traversal shouldn't be used with regular expressions that can produce empty matches.`
        )
      return res
    })((m, re) => {
  const lastIndex = re.lastIndex
  re.lastIndex = reLastIndex(m)
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
    if (void 0 !== y) return y
  }
}

function iterEager(map, ap, of, xi2yA, t, s) {
  let r = of(iterCollect)
  while ((s = reNext(s, t)))
    r = ap(ap(map(iterCollect, of(s)), r), xi2yA(reValue(s), reIndex(s)))
  return r
}

//

const keyed = isoU(
  expect(
    I.isInstanceOf(Object),
    (process.env.NODE_ENV === 'production'
      ? I.id
      : C.res(freezeArrayOfObjects))(x => {
      x = toObject(x)
      const es = []
      for (const key in x) es.push([key, x[key]])
      return es
    })
  ),
  expect(
    I.isArray,
    (process.env.NODE_ENV === 'production' ? I.id : C.res(I.freeze))(es => {
      const o = {}
      for (let i = 0, n = es.length; i < n; ++i) {
        const entry = es[i]
        if (entry.length === 2) o[entry[0]] = entry[1]
      }
      return o
    })
  )
)

//

const matchesJoin = input => matchesIn => {
  let result = ''
  let lastIndex = 0
  const matches = iterToArray(matchesIn)
  const n = matches.length
  for (let j = n - 2; j !== -2; j += -2) {
    const m = matches[j]
    result += input.slice(lastIndex, reIndex(m))
    const s = matches[j + 1]
    if (void 0 !== s) result += s
    lastIndex = reLastIndex(m)
  }

  result += input.slice(lastIndex)
  return result
}

//

const eitherU = (t, e) => c => (x, i, C, xi2yC) =>
  (c(x, i) ? t : e)(x, i, C, xi2yC)

const orElseU = (back, prim) => (
  (prim = toFunction(prim)),
  (back = toFunction(back)),
  (x, i, C, xi2yC) => (isDefined(prim, x) ? prim : back)(x, i, C, xi2yC)
)

function zeroOp(y, i, C, xi2yC, x) {
  const of = C.of
  return of ? of(y) : C.map(I.always(y), xi2yC(x, i))
}

//

const elemsI = (xs, _i, A, xi2yA) =>
  A === Identity
    ? mapPartialIndexU(xi2yA, xs)
    : A === Select
      ? selectInArrayLike(xi2yA, xs)
      : traversePartialIndex(A, xi2yA, xs)

//

const seq2U = (l, r) => (x, i, M, xi2yM) =>
  M.chain(x => r(x, i, M, xi2yM), l(x, i, M, xi2yM))

//

const pickInAux = (t, k) => [k, pickIn(t)]

//

const condOfDefault = I.always(zeroOp)
const condOfCase = (p, o, r) => (y, j) => (p(y, j) ? o : r(y, j))

// Auxiliary

export const seemsArrayLike = x =>
  (x instanceof Object && ((x = x.length), x === x >> 0 && 0 <= x)) ||
  I.isString(x)

// Internals

export const Identity = (process.env.NODE_ENV === 'production'
  ? I.id
  : I.freeze)({
  map: I.applyU,
  of: I.id,
  ap: I.applyU,
  chain: I.applyU
})

export const Constant = (process.env.NODE_ENV === 'production'
  ? I.id
  : I.freeze)({
  map: I.sndU
})

export const toFunction = (process.env.NODE_ENV === 'production'
  ? I.id
  : C.par(0, C.ef(reqOptic)))(o => {
  switch (typeof o) {
    case 'string':
      return funProp(o)
    case 'number':
      return funIndex(o)
    case 'object':
      return composed(0, o)
    default:
      return o.length === 4 ? o : fromReader(o)
  }
})

// Operations on optics

export const assign = I.curry((o, x, s) => setU([o, propsOf(x)], x, s))

export const modify = I.curry(modifyU)

export const remove = I.curry((o, s) => setU(o, void 0, s))

export const set = I.curry(setU)

export const transform = I.curry((o, s) => modifyU(o, I.id, s))

export const traverse = I.curry(traverseU)

// Nesting

export function compose() {
  let n = arguments.length
  if (n < 2) {
    return n ? arguments[0] : identity
  } else {
    const os = Array(n)
    while (n--) os[n] = arguments[n]
    return os
  }
}

export function flat() {
  const r = [flatten]
  for (let i = 0, n = arguments.length; i < n; ++i)
    r.push(arguments[i], flatten)
  return r
}

// Recursing

export function lazy(o2o) {
  let memo = (x, i, C, xi2yC) => (memo = toFunction(o2o(rec)))(x, i, C, xi2yC)
  function rec(x, i, C, xi2yC) {
    return memo(x, i, C, xi2yC)
  }
  return rec
}

// Adapting

export const choices = (o, ...os) =>
  os.length ? orElseU(os.reduceRight(orElseU), o) : o

export const choose = xiM2o => (x, i, C, xi2yC) =>
  toFunction(xiM2o(x, i))(x, i, C, xi2yC)

export const cond = (process.env.NODE_ENV === 'production'
  ? I.id
  : fn => (...cs) => {
      const pair = C.tup(C.ef(reqFn), C.ef(reqOptic))
      C.arr(pair)(cs.slice(0, -1))
      C.arr(C.or(C.tup(C.ef(reqOptic)), pair))(cs.slice(-1))
      return fn(...cs)
    })(function() {
  let n = arguments.length
  let r = zero
  while (n--) {
    const c = arguments[n]
    r = c.length < 2 ? toFunction(c[0]) : eitherU(toFunction(c[1]), r)(c[0])
  }
  return r
})

export const condOf = (process.env.NODE_ENV === 'production'
  ? I.id
  : fn => (of, ...cs) => {
      const pair = C.tup(C.ef(reqFn), C.ef(reqOptic))
      C.arr(pair)(cs.slice(0, -1))
      C.arr(C.or(C.tup(C.ef(reqOptic)), pair))(cs.slice(-1))
      return fn(of, ...cs)
    })(function(of) {
  of = toFunction(of)
  let op = condOfDefault
  let n = arguments.length
  while (--n) {
    const c = arguments[n]
    op =
      c.length === 1
        ? I.always(toFunction(c[0]))
        : condOfCase(c[0], toFunction(c[1]), op)
  }
  return (x, i, C, xi2yC) => of(x, i, Constant, op)(x, i, C, xi2yC)
})

export const ifElse = I.curry((c, t, e) =>
  eitherU(toFunction(t), toFunction(e))(c)
)

export const iftes = (process.env.NODE_ENV === 'production'
  ? I.id
  : fn =>
      function(_c, _t) {
        warn(
          iftes,
          '`iftes` has been obsoleted.  Use `ifElse` or `cond` instead.  See CHANGELOG for details.'
        )
        return fn.apply(null, arguments)
      })(function(_c, _t) {
  let n = arguments.length
  let r = n & 1 ? toFunction(arguments[--n]) : zero
  while (0 <= (n -= 2))
    r = eitherU(toFunction(arguments[n + 1]), r)(arguments[n])
  return r
})

export const orElse = I.curry(orElseU)

// Querying

export const chain = I.curry((xi2yO, xO) => [
  xO,
  choose((xM, i) => (void 0 !== xM ? xi2yO(xM, i) : zero))
])

export const choice = (...os) => os.reduceRight(orElseU, zero)

export const unless = eitherU(zeroOp, identity)

export const when = eitherU(identity, zeroOp)

export const optional = when(I.isDefined)

export const zero = (x, i, C, xi2yC) => zeroOp(x, i, C, xi2yC)

// Transforming

export const assignOp = x => [propsOf(x), setOp(x)]

export const modifyOp = xi2y => (x, i, C, xi2yC) =>
  zeroOp((x = xi2y(x, i)), i, C, xi2yC, x)

export const setOp = y => (_x, i, C, xi2yC) => zeroOp(y, i, C, xi2yC, y)

export const removeOp = setOp()

// Debugging

export function log() {
  const show = I.curry(
    (dir, x) => (
      console.log.apply(
        console,
        copyToFrom([], 0, arguments, 0, arguments.length).concat([dir, x])
      ),
      x
    )
  )
  return isoU(show('get'), show('set'))
}

// Sequencing

export const seq = (process.env.NODE_ENV === 'production'
  ? I.id
  : fn => (...xMs) => C.par(2, C.ef(reqMonad('seq')))(fn(...xMs)))(function() {
  let n = arguments.length
  let r = zero
  if (n) {
    r = toFunction(arguments[--n])
    while (n) r = seq2U(toFunction(arguments[--n]), r)
  }
  return r
})

// Creating new traversals

export const branchOr = (process.env.NODE_ENV === 'production'
  ? I.id
  : C.par(1, C.ef(reqTemplate('branchOr'))))(
  I.curryN(
    2,
    otherwise => (
      (otherwise = toFunction(otherwise)),
      template => branchOrU(otherwise, template)
    )
  )
)

export const branch = branchOr(zero)

export function branches() {
  const n = arguments.length
  const template = {}
  for (let i = 0; i < n; ++i) template[arguments[i]] = identity
  return branch(template)
}

// Traversals and combinators

export const elems = (process.env.NODE_ENV === 'production'
  ? I.id
  : C.par(2, C.ef(reqApplicative('elems'))))(
  (xs, i, A, xi2yA) => (seemsArrayLike(xs) ? elemsI(xs, i, A, xi2yA) : A.of(xs))
)

export const entries = toFunction([keyed, elems])

export const keys = toFunction([keyed, elems, 0])

export const matches = (process.env.NODE_ENV === 'production'
  ? I.id
  : C.dep(
      re =>
        re.global ? C.res(C.par(2, C.ef(reqApplicative('matches', re)))) : I.id
    ))(re => {
  return (x, _i, C, xi2yC) => {
    if (I.isString(x)) {
      const {map} = C
      if (re.global) {
        const m0 = ['']
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
          return map(
            y => x.replace(re, void 0 !== y ? y : ''),
            xi2yC(m[0], reIndex(m))
          )
      }
    }
    return zeroOp(x, void 0, C, xi2yC)
  }
})

export const values = (process.env.NODE_ENV === 'production'
  ? I.id
  : C.par(2, C.ef(reqApplicative('values'))))(
  branchOr1Level(identity, I.protoless0)
)

export const children = (process.env.NODE_ENV === 'production'
  ? I.id
  : C.par(2, C.ef(reqApplicative('children'))))(
  (x, i, C, xi2yC) =>
    I.isArray(x)
      ? elemsI(x, i, C, xi2yC)
      : I.isObject(x) ? values(x, i, C, xi2yC) : C.of(x)
)

export const flatten = (process.env.NODE_ENV === 'production'
  ? I.id
  : C.par(2, C.ef(reqApplicative('flatten'))))((x, i, C, xi2yC) => {
  const rec = (x, i) =>
    I.isArray(x) ? elemsI(x, i, C, rec) : void 0 !== x ? xi2yC(x, i) : C.of(x)
  return rec(x, i)
})

export function query() {
  const r = []
  for (let i = 0, n = arguments.length; i < n; ++i) {
    const o = toFunction(arguments[i])
    r.push(satisfying(isDefined(o)), o)
  }
  return r
}

export const satisfying = p => (x, i, C, xi2yC) => {
  const rec = (x, i) => (p(x, i) ? xi2yC(x, i) : children(x, i, C, rec))
  return rec(x, i)
}

export const leafs = satisfying(
  x => void 0 !== x && !I.isArray(x) && !I.isObject(x)
)

// Folds over traversals

export const all = I.curry(
  (xi2b, t, s) =>
    !traverseU(
      Select,
      (x, i) => {
        if (!xi2b(x, i)) return true
      },
      t,
      s
    )
)

export const and = all(I.id)

export const any = I.curry(
  (xi2b, t, s) =>
    !!traverseU(
      Select,
      (x, i) => {
        if (xi2b(x, i)) return true
      },
      t,
      s
    )
)

export const collectAs = (process.env.NODE_ENV === 'production'
  ? I.curry
  : C.res(I.freeze))((xi2y, t, s) => {
  const results = []
  traverseU(
    Select,
    (x, i) => {
      const y = xi2y(x, i)
      if (void 0 !== y) results.push(y)
    },
    t,
    s
  )
  return results
})

export const collect = collectAs(I.id)

export const concatAs = mkTraverse(I.id, m => ConcatOf(m.concat, m.empty()))

export const concat = concatAs(I.id)

export const countIf = I.curry((p, t, s) =>
  traverseU(Sum, (x, i) => (p(x, i) ? 1 : 0), t, s)
)

export const count = countIf(I.isDefined)

export const countsAs = I.curry((xi2k, t, s) => {
  const counts = new Map()
  traverseU(
    Select,
    (x, i) => {
      const k = xi2k(x, i)
      const n = counts.get(k)
      counts.set(k, void 0 !== n ? n + 1 : 1)
    },
    t,
    s
  )
  return counts
})

export const counts = countsAs(I.id)

export const foldl = I.curry((f, r, t, s) => {
  traverseU(
    Select,
    (x, i) => {
      r = f(r, x, i)
    },
    t,
    s
  )
  return r
})

export const foldr = I.curry((f, r, t, s) => {
  const is = []
  const xs = []
  traverseU(
    Select,
    (x, i) => {
      xs.push(x)
      is.push(i)
    },
    t,
    s
  )
  for (let i = xs.length - 1; 0 <= i; --i) r = f(r, xs[i], is[i])
  return r
})

export const forEach = I.curry((f, t, s) =>
  traverseU(
    Select,
    (x, i) => {
      f(x, i)
    },
    t,
    s
  )
)

export const forEachWith = I.curry((newC, ef, t, s) => {
  const c = newC()
  traverseU(
    Select,
    (x, i) => {
      ef(c, x, i)
    },
    t,
    s
  )
  return c
})

export const isDefined = I.curry(
  (t, s) => void 0 !== traverseU(Select, I.id, t, s)
)

export const isEmpty = I.curry(
  (t, s) => !traverseU(Select, I.always(true), t, s)
)

export const joinAs = mkTraverse(
  toStringPartial,
  (process.env.NODE_ENV === 'production'
    ? I.id
    : C.par(
        0,
        C.ef(reqString('`join` and `joinAs` expect a string delimiter'))
      ))(d => {
    return ConcatOf(
      (x, y) => (void 0 !== x ? (void 0 !== y ? x + d + y : x) : y)
    )
  })
)

export const join = joinAs(I.id)

export const maximumBy = mumBy(I.gtU)

export const maximum = maximumBy(I.id)

export const meanAs = I.curry((xi2y, t, s) => {
  let sum = 0
  let num = 0
  traverseU(
    Select,
    (x, i) => {
      const y = xi2y(x, i)
      if (void 0 !== y) {
        num += 1
        sum += y
      }
    },
    t,
    s
  )
  return sum / num
})

export const mean = meanAs(I.id)

export const minimumBy = mumBy(I.ltU)

export const minimum = minimumBy(I.id)

export const none = I.curry(
  (xi2b, t, s) =>
    !traverseU(
      Select,
      (x, i) => {
        if (xi2b(x, i)) return true
      },
      t,
      s
    )
)

export const or = any(I.id)

export const productAs = traverse(ConcatOf(I.multiplyU, 1))

export const product = productAs(unto(1))

export const selectAs = traverse(Select)

export const select = selectAs(I.id)

export const sumAs = traverse(Sum)

export const sum = sumAs(unto0)

// Operations on lenses

export function get(l, s) {
  return 1 < arguments.length ? getU(l, s) : s => getU(l, s)
}

// Creating new lenses

export const lens = I.curry(lensU)

export const setter = lens(I.id)

export const foldTraversalLens = I.curry((fold, traversal) =>
  lensU(fold(traversal), set(traversal))
)

// Enforcing invariants

export function defaults(out) {
  function o2u(x) {
    return replaced(out, void 0, x)
  }
  return (x, i, F, xi2yF) => F.map(o2u, xi2yF(void 0 !== x ? x : out, i))
}

export const define = (process.env.NODE_ENV === 'production'
  ? I.id
  : fn => inn => {
      const res = fn(inn)
      if (isEmptyArrayStringOrObject(inn))
        return toFunction([
          isoU(warnEmpty(fn, inn, 'define'), I.id),
          res,
          isoU(I.id, warnEmpty(define, inn, 'define'))
        ])
      else return res
    })(v => {
  const untoV = unto(v)
  return (x, i, F, xi2yF) => F.map(untoV, xi2yF(void 0 !== x ? x : v, i))
})

export const normalize = xi2x => [reread(xi2x), rewrite(xi2x)]

export const required = (process.env.NODE_ENV === 'production'
  ? I.id
  : fn => inn => {
      const res = fn(inn)
      if (isEmptyArrayStringOrObject(inn))
        return toFunction([
          res,
          isoU(I.id, warnEmpty(required, inn, 'required'))
        ])
      else return res
    })(inn => replace(inn, void 0))

export const reread = xi2x => (x, i, _F, xi2yF) =>
  xi2yF(void 0 !== x ? xi2x(x, i) : x, i)

export const rewrite = yi2y => (x, i, F, xi2yF) =>
  F.map(y => (void 0 !== y ? yi2y(y, i) : y), xi2yF(x, i))

// Lensing arrays

export function append(xs, _, F, xi2yF) {
  const i = seemsArrayLike(xs) ? xs.length : 0
  return F.map(x => setIndex(i, x, xs), xi2yF(void 0, i))
}

export const filter = (process.env.NODE_ENV === 'production'
  ? I.id
  : C.res(lens =>
      toFunction([
        lens,
        isoU(
          I.id,
          C.ef(
            reqMaybeArray(
              '`filter` must be set with undefined or an array-like object'
            )
          )
        )
      ])
    ))(xi2b => (xs, i, F, xi2yF) => {
  let ts
  let fs = I.array0
  if (seemsArrayLike(xs)) partitionIntoIndex(xi2b, xs, (ts = []), (fs = []))
  return F.map(ts => {
    const tsN = ts ? ts.length : 0
    const fsN = fs.length
    const n = tsN + fsN
    return n === fsN
      ? fs
      : copyToFrom(copyToFrom(Array(n), 0, ts, 0, tsN), tsN, fs, 0, fsN)
  }, xi2yF(ts, i))
})

export function find(xih2b) {
  const hint = arguments.length > 1 ? arguments[1] : {hint: 0}
  return (xs, _i, F, xi2yF) => {
    const ys = seemsArrayLike(xs) ? xs : ''
    const i = (hint.hint = findIndexHint(hint, xih2b, ys))
    return F.map(v => setIndex(i, v, ys), xi2yF(ys[i], i))
  }
}

export function findWith(o) {
  const oo = toFunction(o)
  const p = isDefined(oo)
  return [arguments.length > 1 ? find(p, arguments[1]) : find(p), oo]
}

export const first = 0

export const index =
  process.env.NODE_ENV !== 'production' ? C.ef(reqIndex) : I.id

export const last = choose(
  maybeArray =>
    seemsArrayLike(maybeArray) && maybeArray.length ? maybeArray.length - 1 : 0
)

export const prefix = n => slice(0, n)

export const slice = (process.env.NODE_ENV === 'production'
  ? I.curry
  : C.res(lens =>
      toFunction([
        lens,
        isoU(
          I.id,
          C.ef(
            reqMaybeArray(
              '`slice` must be set with undefined or an array-like object'
            )
          )
        )
      ])
    ))((begin, end) => (xs, i, F, xsi2yF) => {
  const seems = seemsArrayLike(xs)
  const xsN = seems && xs.length
  const b = sliceIndex(0, xsN, 0, begin)
  const e = sliceIndex(b, xsN, xsN, end)
  return F.map(zs => {
    const zsN = zs ? zs.length : 0
    const bPzsN = b + zsN
    const n = xsN - e + bPzsN
    return copyToFrom(
      copyToFrom(copyToFrom(Array(n), 0, xs, 0, b), b, zs, 0, zsN),
      bPzsN,
      xs,
      e,
      xsN
    )
  }, xsi2yF(seems ? copyToFrom(Array(Math.max(0, e - b)), 0, xs, b, e) : void 0, i))
})

export const suffix = n => slice(0 === n ? Infinity : !n ? 0 : -n, void 0)

// Lensing objects

export const pickIn = t =>
  I.isObject(t) ? pick(modify(values, pickInAux, t)) : t

export const prop =
  process.env.NODE_ENV === 'production'
    ? I.id
    : x => {
        if (!I.isString(x)) errorGiven('`prop` expects a string', x)
        return x
      }

export function props() {
  const n = arguments.length
  const template = {}
  for (let i = 0, k; i < n; ++i) template[(k = arguments[i])] = k
  return pick(template)
}

export const propsOf = o => props.apply(null, I.keys(o))

export function removable(...ps) {
  function drop(y) {
    if (!(y instanceof Object)) return y
    for (let i = 0, n = ps.length; i < n; ++i) if (I.hasU(ps[i], y)) return y
  }
  return (x, i, F, xi2yF) => F.map(drop, xi2yF(x, i))
}

// Providing defaults

export const valueOr = v => (x, i, _F, xi2yF) => xi2yF(x != null ? x : v, i)

// Transforming data

export const pick = (process.env.NODE_ENV === 'production'
  ? I.id
  : C.par(0, C.ef(reqTemplate('pick'))))(template => {
  return (x, i, F, xi2yF) =>
    F.map(v => setPick(template, v, x), xi2yF(getPick(template, x), i))
})

export const replace = I.curry((inn, out) => {
  function o2i(x) {
    return replaced(out, inn, x)
  }
  return (x, i, F, xi2yF) => F.map(o2i, xi2yF(replaced(inn, out, x), i))
})

// Operations on isomorphisms

export function getInverse(o, s) {
  return 1 < arguments.length ? setU(o, s, void 0) : s => setU(o, s, void 0)
}

// Creating new isomorphisms

export const iso = I.curry(isoU)

// Isomorphism combinators

export const array = elem => {
  const fwd = getInverse(elem)
  const bwd = get(elem)
  const mapFwd = x => mapIfArrayLike(fwd, x)
  return (x, i, F, xi2yF) => F.map(mapFwd, xi2yF(mapIfArrayLike(bwd, x), i))
}

export const inverse = iso => (x, i, F, xi2yF) =>
  F.map(x => getU(iso, x), xi2yF(setU(iso, x, void 0), i))

// Basic isomorphisms

export const complement = isoU(notPartial, notPartial)

export {identity}

export const indexed = isoU(
  expect(
    seemsArrayLike,
    (process.env.NODE_ENV === 'production'
      ? I.id
      : C.res(freezeArrayOfObjects))(xs => {
      const n = xs.length
      const xis = Array(n)
      for (let i = 0; i < n; ++i) xis[i] = [i, xs[i]]
      return xis
    })
  ),
  expect(
    I.isArray,
    (process.env.NODE_ENV === 'production' ? I.id : C.res(I.freeze))(xis => {
      let n = xis.length
      let xs = Array(n)
      for (let i = 0; i < n; ++i) {
        const xi = xis[i]
        if (xi.length === 2) xs[xi[0]] = xi[1]
      }
      n = xs.length
      let j = 0
      for (let i = 0; i < n; ++i) {
        const x = xs[i]
        if (void 0 !== x) {
          if (i !== j) xs[j] = x
          ++j
        }
      }
      xs.length = j
      return xs
    })
  )
)

export const is = v =>
  isoU(x => I.acyclicEqualsU(v, x), b => (true === b ? v : void 0))

export {keyed}

export const reverse = isoU(rev, rev)

export const singleton = (process.env.NODE_ENV === 'production'
  ? I.id
  : iso => toFunction([isoU(I.id, I.freeze), iso]))((x, i, F, xi2yF) =>
  F.map(
    singletonPartial,
    xi2yF(
      (x instanceof Object || I.isString(x)) && x.length === 1 ? x[0] : void 0,
      i
    )
  )
)

// Standard isomorphisms

export const uri = stringIsoU(decodeURI, encodeURI)

export const uriComponent = stringIsoU(decodeURIComponent, encodeURIComponent)

export const json = (process.env.NODE_ENV === 'production'
  ? I.id
  : C.res(iso => toFunction([iso, isoU(deepFreeze, I.id)])))(options => {
  const {reviver, replacer, space} = options || I.object0
  return isoU(
    expect(I.isString, text => JSON.parse(text, reviver)),
    expect(I.isDefined, value => JSON.stringify(value, replacer, space))
  )
})

// String isomorphisms

export const dropPrefix = pfx =>
  stringIsoU(
    x => (x.startsWith(pfx) ? x.slice(pfx.length) : undefined),
    x => pfx + x
  )

export const dropSuffix = sfx =>
  stringIsoU(
    x => (x.endsWith(sfx) ? x.slice(0, x.length - sfx.length) : undefined),
    x => x + sfx
  )

export const replaces = I.curry((i, o) =>
  stringIsoU(I.replace(toRegExpU(i, 'g'), o), I.replace(toRegExpU(o, 'g'), i))
)

export const split = (process.env.NODE_ENV === 'production'
  ? I.id
  : fn =>
      function(_sep) {
        return toFunction([fn.apply(null, arguments), isoU(I.freeze, I.id)])
      })(function(sep) {
  const re = arguments.length > 1 ? arguments[1] : sep
  return isoU(
    expect(I.isString, x => x.split(re)),
    expect(I.isArray, xs => xs.join(sep))
  )
})

export const uncouple = (process.env.NODE_ENV === 'production'
  ? I.id
  : fn =>
      function(_sep) {
        return toFunction([fn.apply(null, arguments), isoU(I.freeze, I.id)])
      })(function(sep) {
  const re = toRegExpU(arguments.length > 1 ? arguments[1] : sep, '')
  return isoU(
    expect(I.isString, x => {
      const m = re.exec(x)
      return m ? [x.slice(0, reIndex(m)), x.slice(reLastIndex(m))] : [x, '']
    }),
    kv => {
      if (I.isArray(kv) && kv.length === 2) {
        const k = kv[0]
        const v = kv[1]
        return v ? k + sep + v : k
      }
    }
  )
})

// Arithmetic isomorphisms

export const add = c => numberIsoU(I.add(c), I.add(-c))
export const divide = c => numberIsoU(I.divideBy(c), I.multiply(c))
export const multiply = c => numberIsoU(I.multiply(c), I.divideBy(c))
export const negate = numberIsoU(I.negate, I.negate)
export const subtract = c => numberIsoU(I.add(-c), I.add(c))

// Interop

export const pointer = s => {
  if (s[0] === '#') s = decodeURIComponent(s)
  const ts = s.split('/')
  const n = ts.length
  for (let i = 1; i < n; ++i) {
    const t = ts[i]
    ts[i - 1] = /^(0|[1-9]\d*)$/.test(t)
      ? ifElse(isArrayOrPrimitive, Number(t), t)
      : '-' === t
        ? ifElse(isArrayOrPrimitive, append, t)
        : t.replace('~1', '/').replace('~0', '~')
  }
  ts.length = n - 1
  return ts
}
