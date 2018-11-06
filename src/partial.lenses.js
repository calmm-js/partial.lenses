import * as I from './ext/infestines'

import * as C from './contract'

//

const id = x => x

const setName = process.env.NODE_ENV === 'production' ? x => x : I.defineNameU

const copyName =
  process.env.NODE_ENV === 'production'
    ? x => x
    : (to, from) => I.defineNameU(to, from.name)

const toRegExpU = (str, flags) =>
  I.isString(str)
    ? new RegExp(I.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&', str), flags)
    : str

//

const isPair = x => I.isArray(x) && x[I.LENGTH] === 2

//

const inserterOp = I.curry((inserter, value) => [inserter, setOp(value)])

//

const toGetter = getter => {
  if (typeof getter === 'function' && getter[I.LENGTH] < 4) return getter
  getter = toFunction(getter)
  return (x, i) => getter(x, i, Select, id)
}

//

const tryCatch = fn =>
  copyName(x => {
    try {
      return fn(x)
    } catch (e) {
      return e
    }
  }, fn)

//

const toStringPartial = x => (void 0 !== x ? String(x) : '')

const sliceIndex = (m, l, d, i) =>
  void 0 !== i ? Math.min(Math.max(m, i < 0 ? l + i : i), l) : d

const cpair = xs => x => [x, xs]

const pairPartial = k => v => (void 0 !== k && void 0 !== v ? [k, v] : void 0)

const unto = c => x => (void 0 !== x ? x : c)
const unto0 = unto(0)

const toTrue = I.always(true)

const notPartial = function complement(x) {
  return void 0 !== x ? !x : x
}

const expect = (p, f) => copyName(x => (p(x) ? f(x) : void 0), f)

const freezeInDev = process.env.NODE_ENV === 'production' ? id : I.freeze

const freezeResultInDev =
  process.env.NODE_ENV === 'production' ? id : C.res(I.freeze)

const deepFreezeInDev =
  process.env.NODE_ENV === 'production'
    ? id
    : function deepFreezeInDev(x) {
        if (I.isArray(x)) {
          x.forEach(deepFreezeInDev)
          I.freeze(x)
        } else if (I.isObject(x)) {
          for (const k in x) deepFreezeInDev(x[k])
          I.freeze(x)
        }
        return x
      }

function freezeObjectOfObjects(xs) {
  if (xs) for (const k in xs) I.freeze(xs[k])
  return I.freeze(xs)
}

const isArrayOrPrimitive = x => !(x instanceof Object) || I.isArray(x)

const rev = (process.env.NODE_ENV === 'production' ? id : C.res(I.freeze))(
  function reverse(xs) {
    if (seemsArrayLike(xs)) {
      let n = xs[I.LENGTH]
      const ys = Array(n)
      let i = 0
      while (n) ys[i++] = xs[--n]
      return ys
    }
  }
)

//

const mapPartialIndexU = (process.env.NODE_ENV === 'production'
  ? id
  : fn => (xi2y, xs, skip) => {
      const ys = fn(xi2y, xs, skip)
      if (xs !== ys) I.freeze(ys)
      return ys
    })((xi2y, xs, skip) => {
  const n = xs[I.LENGTH]
  const ys = Array(n)
  let j = 0
  let same = true
  for (let i = 0; i < n; ++i) {
    const x = xs[i]
    const y = xi2y(x, i)
    if (skip !== y) {
      ys[j++] = y
      if (same)
        same = (x === y && (x !== 0 || 1 / x === 1 / y)) || (x !== x && y !== y)
    }
  }
  if (j !== n) {
    ys[I.LENGTH] = j
    return ys
  } else if (same) {
    return xs
  } else {
    return ys
  }
})

const mapIfArrayLike = (xi2y, xs) =>
  seemsArrayLike(xs) ? mapPartialIndexU(xi2y, xs, void 0) : void 0

const mapsIfArray = (process.env.NODE_ENV === 'production'
  ? id
  : C.res(I.freeze))((x2y, xs) => {
  if (I.isArray(xs)) {
    const n = xs[I.LENGTH]
    const ys = Array()
    for (let i = 0; i < n; ++i) {
      if (void 0 === (ys[i] = x2y(xs[i]))) {
        return void 0
      }
    }
    return ys
  }
})

const copyToFrom = (process.env.NODE_ENV === 'production'
  ? id
  : fn => (ys, k, xs, i, j) =>
      ys[I.LENGTH] === k + j - i
        ? I.freeze(fn(ys, k, xs, i, j))
        : fn(ys, k, xs, i, j))((ys, k, xs, i, j) => {
  while (i < j) ys[k++] = xs[i++]
  return ys
})

//

function selectInArrayLike(xi2v, xs) {
  for (let i = 0, n = xs[I.LENGTH]; i < n; ++i) {
    const v = xi2v(xs[i], i)
    if (void 0 !== v) return v
  }
}

//

const ConstantWith = (ap, empty) => I.Applicative(I.sndU, I.always(empty), ap)

const ConstantOf = ({concat, empty}) => ConstantWith(concat, empty())

const Sum = ConstantWith(I.addU, 0)

const mumBy = ord =>
  I.curry(function mumBy(xi2y, t, s) {
    xi2y = toGetter(xi2y)
    let minX = void 0
    let minY = void 0
    getAsU(
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

const traverseU = function traverse(C, xi2yC, t, s) {
  return toFunction(t)(s, void 0, C, xi2yC)
}

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

const reqIndex = function index(x) {
  if (!Number.isInteger(x) || x < 0)
    errorGiven('`index` expects a non-negative integer', x)
}

function reqFunction(o) {
  if (!(I.isFunction(o) && (o[I.LENGTH] === 4 || o[I.LENGTH] <= 2)))
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
      for (let i = 0, n = o[I.LENGTH]; i < n; ++i) reqOptic(o[i])
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
    copyName(
      (xi2yC, m) => ((m = toC(m)), (t, s) => after(traverseU(m, xi2yC, t, s))),
      toC
    )
  )

//

const consExcept = skip => t => h => (skip !== h ? [h, t] : t)

const pushTo = (n, xs) => {
  while (consExcept !== n) {
    xs.push(n[0])
    n = n[1]
  }
  return xs
}

const consTo = (process.env.NODE_ENV === 'production' ? id : C.res(I.freeze))(
  n => pushTo(n, []).reverse()
)

function traversePartialIndex(A, xi2yA, xs, skip) {
  const {map, ap} = A
  let xsA = A.of(consExcept)
  const n = xs[I.LENGTH]
  if (map === I.sndU) {
    for (let i = 0; i < n; ++i) xsA = ap(xsA, xi2yA(xs[i], i))
    return xsA
  } else {
    const cons = consExcept(skip)
    for (let i = 0; i < n; ++i) xsA = ap(map(cons, xsA), xi2yA(xs[i], i))
    return map(consTo, xsA)
  }
}

//

const SelectLog = I.Applicative(
  (f, {p, x, c}) => {
    x = f(x)
    if (!I.isFunction(x)) p = [x, p]
    return {p, x, c}
  },
  x => ({p: [], x, c: undefined}),
  (l, r) => {
    const v = undefined !== l.c ? l : r
    return {p: v.p, x: l.x(r.x), c: v.c}
  }
)

//

const lensFrom = (get, set) => i => (x, _i, F, xi2yF) =>
  F.map(v => set(i, v, x), xi2yF(get(i, x), i))

//

const getProp = (k, o) => (o instanceof Object ? o[k] : void 0)

const setProp = (process.env.NODE_ENV === 'production' ? id : C.res(I.freeze))(
  (k, v, o) =>
    void 0 !== v
      ? I.assocPartialU(k, v, o)
      : I.dissocPartialU(k, o) || I.object0
)

const funProp = lensFrom(getProp, setProp)

//

const getIndex = (i, xs) => (seemsArrayLike(xs) ? xs[i] : void 0)

const setIndex = (process.env.NODE_ENV === 'production'
  ? id
  : C.fn(C.nth(0, C.ef(reqIndex)), I.freeze))((i, x, xs) => {
  if (!seemsArrayLike(xs)) xs = ''
  const n = xs[I.LENGTH]
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
  let n = os[I.LENGTH] - oi0
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

const disperseU = function disperse(traversal, values, data) {
  if (!seemsArrayLike(values)) values = ''
  let i = 0
  return modifyU(traversal, () => values[i++], data)
}

const setU = (process.env.NODE_ENV === 'production'
  ? id
  : C.par(0, C.ef(reqOptic)))(function set(o, x, s) {
  switch (typeof o) {
    case 'string':
      return setProp(o, x, s)
    case 'number':
      return setIndex(o, x, s)
    case 'object':
      return modifyComposed(o, 0, s, x)
    default:
      return o[I.LENGTH] === 4 ? o(s, void 0, I.Identity, I.always(x)) : s
  }
})

const getInverseU = function getInverse(o, x) {
  return setU(o, x, void 0)
}

const modifyU = (process.env.NODE_ENV === 'production'
  ? id
  : C.par(0, C.ef(reqOptic)))(function modify(o, xi2x, s) {
  switch (typeof o) {
    case 'string':
      return setProp(o, xi2x(getProp(o, s), o), s)
    case 'number':
      return setIndex(o, xi2x(getIndex(o, s), o), s)
    case 'object':
      return modifyComposed(o, xi2x, s)
    default:
      return o[I.LENGTH] === 4
        ? o(s, void 0, I.Identity, xi2x)
        : (xi2x(o(s, void 0), void 0), s)
  }
})

const modifyAsyncU = (o, f, s) =>
  I.resolve(toFunction(o)(s, void 0, I.IdentityAsync, f))

const getAsU = (process.env.NODE_ENV === 'production'
  ? id
  : C.par(1, C.ef(reqOptic)))(function getAs(xi2y, l, s) {
  switch (typeof l) {
    case 'string':
      return xi2y(getProp(l, s), l)
    case 'number':
      return xi2y(getIndex(l, s), l)
    case 'object': {
      const n = l[I.LENGTH]
      for (let i = 0, o; i < n; ++i)
        switch (typeof (o = l[i])) {
          case 'string':
            s = getProp(o, s)
            break
          case 'number':
            s = getIndex(o, s)
            break
          default:
            return composed(i, l)(s, l[i - 1], Select, xi2y)
        }
      return xi2y(s, l[n - 1])
    }
    default:
      return xi2y !== id && l[I.LENGTH] !== 4
        ? xi2y(l(s, void 0), void 0)
        : l(s, void 0, Select, xi2y)
  }
})

const getU = (l, s) => getAsU(id, l, s)

function modifyComposed(os, xi2y, x, y) {
  let n = os[I.LENGTH]
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
        x = composed(i, os)(x, os[i - 1], I.Identity, xi2y || I.always(y))
        n = i
        break
    }
  }
  if (n === os[I.LENGTH]) x = xi2y ? xi2y(x, os[n - 1]) : y
  for (let o; 0 <= --n; )
    x = I.isString((o = os[n])) ? setProp(o, x, xs[n]) : setIndex(o, x, xs[n])
  return x
}

//

const lensU = function lens(get, set) {
  return copyName(
    (x, i, F, xi2yF) => F.map(y => set(y, x, i), xi2yF(get(x, i), i)),
    get
  )
}

const isoU = function iso(bwd, fwd) {
  return copyName((x, i, F, xi2yF) => F.map(fwd, xi2yF(bwd(x), i)), bwd)
}

const stringIsoU = (bwd, fwd) =>
  isoU(expect(I.isString, bwd), expect(I.isString, fwd))

const numberIsoU = (bwd, fwd) =>
  isoU(expect(I.isNumber, bwd), expect(I.isNumber, fwd))

//

const getPick = (process.env.NODE_ENV === 'production' ? id : C.res(I.freeze))(
  (template, x) => {
    let r
    for (const k in template) {
      const t = template[k]
      const v = I.isObject(t) ? getPick(t, x) : getAsU(id, t, x)
      if (void 0 !== v) {
        if (!r) r = {}
        r[k] = v
      }
    }
    return r
  }
)

const reqTemplate = name => template => {
  if (!I.isObject(template))
    errorGiven(`\`${name}\` expects a plain Object template`, template)
}

const reqObject = msg => value => {
  if (!(void 0 === value || value instanceof Object)) errorGiven(msg, value)
}

const setPick = (process.env.NODE_ENV === 'production'
  ? id
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
  ? id
  : C.res(C.res(I.freeze)))(ks => xs => {
  const r = {}
  let i = ks[I.LENGTH]
  while (i--) {
    const v = xs[0]
    if (void 0 !== v) {
      r[ks[i]] = v
    }
    xs = xs[1]
  }
  return r
})

const branchOr1LevelIdentity = (process.env.NODE_ENV === 'production'
  ? id
  : fn => (otherwise, k2o, xO, x, A, xi2yA) => {
      const y = fn(otherwise, k2o, xO, x, A, xi2yA)
      if (x !== y) I.freeze(y)
      return y
    })((otherwise, k2o, xO, x, A, xi2yA) => {
  let written = void 0
  let same = true
  const r = {}
  for (const k in k2o) {
    written = 1
    const x = xO[k]
    const y = k2o[k](x, k, A, xi2yA)
    if (void 0 !== y) {
      r[k] = y
      if (same)
        same = (x === y && (x !== 0 || 1 / x === 1 / y)) || (x !== x && y !== y)
    } else {
      same = false
    }
  }
  const t = written
  for (const k in xO) {
    if (void 0 === (t && k2o[k])) {
      written = 1
      const x = xO[k]
      const y = otherwise(x, k, A, xi2yA)
      if (void 0 !== y) {
        r[k] = y
        if (same)
          same =
            (x === y && (x !== 0 || 1 / x === 1 / y)) || (x !== x && y !== y)
      } else {
        same = false
      }
    }
  }
  return written ? (same && xO === x ? x : r) : x
})

const branchOr1Level = (otherwise, k2o) => (x, _i, A, xi2yA) => {
  const xO = x instanceof Object ? toObject(x) : I.object0

  if (I.Identity === A) {
    return branchOr1LevelIdentity(otherwise, k2o, xO, x, A, xi2yA)
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
    const t = ks[I.LENGTH] ? true : void 0
    for (const k in xO) {
      if (void 0 === (t && k2o[k])) {
        ks.push(k)
        xsA = ap(map(cpair, xsA), otherwise(xO[k], k, A, xi2yA))
      }
    }
    return ks[I.LENGTH] ? map(branchAssemble(ks), xsA) : of(x)
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
  const n = xs[I.LENGTH]
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
  ? id
  : C.dep((_xi2b, _xs, ts, fs) =>
      C.res(
        C.ef(() => {
          I.freeze(ts)
          I.freeze(fs)
        })
      )
    ))((xi2b, xs, ts, fs) => {
  for (let i = 0, n = xs[I.LENGTH], x; i < n; ++i)
    (xi2b((x = xs[i]), i) ? ts : fs).push(x)
})

const fromReader = wi2x =>
  copyName((w, i, F, xi2yF) => F.map(I.always(w), xi2yF(wi2x(w, i), i)), wi2x)

//

const LAST_INDEX = 'lastIndex'
const INDEX = 'index'
const RE_VALUE = 0

const reLastIndex = m => m[INDEX] + m[0][I.LENGTH]

const reNext = (process.env.NODE_ENV === 'production'
  ? id
  : fn => (m, re) => {
      const res = fn(m, re)
      if ('' === res)
        warn(
          reNext,
          `\`matches(${re})\` traversal terminated due to empty match.  \`matches\` traversal shouldn't be used with regular expressions that can produce empty matches.`
        )
      return res
    })((m, re) => {
  const lastIndex = re[LAST_INDEX]
  re[LAST_INDEX] = reLastIndex(m)
  const n = re.exec(m.input)
  re[LAST_INDEX] = lastIndex
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
    const y = xi2y(s[RE_VALUE], s[INDEX])
    if (void 0 !== y) return y
  }
}

function iterEager(map, ap, of, xi2yA, t, s) {
  let r = of(iterCollect)
  while ((s = reNext(s, t)))
    r = ap(ap(map(iterCollect, of(s)), r), xi2yA(s[RE_VALUE], s[INDEX]))
  return r
}

//

const keyed = isoU(
  expect(
    I.isInstanceOf(Object),
    (process.env.NODE_ENV === 'production' ? id : C.res(freezeObjectOfObjects))(
      function keyed(x) {
        x = toObject(x)
        const es = []
        for (const key in x) es.push([key, x[key]])
        return es
      }
    )
  ),
  expect(
    I.isArray,
    (process.env.NODE_ENV === 'production' ? id : C.res(I.freeze))(es => {
      const o = {}
      for (let i = 0, n = es[I.LENGTH]; i < n; ++i) {
        const entry = es[i]
        if (entry[I.LENGTH] === 2) o[entry[0]] = entry[1]
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
  const n = matches[I.LENGTH]
  for (let j = n - 2; j !== -2; j += -2) {
    const m = matches[j]
    result += input.slice(lastIndex, m[INDEX])
    const s = matches[j + 1]
    if (void 0 !== s) result += s
    lastIndex = reLastIndex(m)
  }

  result += input.slice(lastIndex)
  return result
}

//

const disjointBwd = (process.env.NODE_ENV === 'production'
  ? id
  : C.res(freezeObjectOfObjects))((groupOf, x) => {
  if (x instanceof Object) {
    const y = {}
    x = toObject(x)
    for (const key in x) {
      const group = groupOf(key)
      let g = y[group]
      if (undefined === g) y[group] = g = {}
      g[key] = x[key]
    }
    return y
  }
})

const disjointFwd = (process.env.NODE_ENV === 'production'
  ? id
  : C.res(C.res(I.freeze)))(groupOf => y => {
  if (y instanceof Object) {
    const x = {}
    y = toObject(y)
    for (const group in y) {
      let g = y[group]
      if (g instanceof Object) {
        g = toObject(g)
        for (const key in g) {
          if (groupOf(key) === group) {
            x[key] = g[key]
          }
        }
      }
    }
    return x
  }
})

//

const subseqU = function subseq(begin, end, t) {
  t = toFunction(t)
  return copyName((x, i, F, xi2yF) => {
    let n = -1
    return t(
      x,
      i,
      F,
      (x, i) => (begin <= ++n && !(end <= n) ? xi2yF(x, i) : F.of(x))
    )
  }, t)
}

//

const attemptU = (fn, x) => {
  if (void 0 !== x) {
    const y = fn(x)
    if (void 0 !== y) return y
  }
  return x
}

const rewriteAttempt = fn => (x, i, F, xi2yF) =>
  F.map(x => attemptU(fn, x), xi2yF(x, i))

const rereadAttempt = fn => (x, i, F, xi2yF) => xi2yF(attemptU(fn, x), i)

//

const transformEvery = optic => transform(lazy(rec => [optic, children, rec]))

const transformSome = fn =>
  transform(lazy(rec => choices(getter(fn), [children, rec])))

//

const isDefinedAtU = (o, x, i) => void 0 !== o(x, i, Select, id)

const isDefinedAt = o => (x, i) => isDefinedAtU(o, x, i)

const eitherU = (t, e) =>
  function either(c) {
    return function either(x, i, C, xi2yC) {
      return (c(x, i) ? t : e)(x, i, C, xi2yC)
    }
  }

const orElseU = function orElse(back, prim) {
  prim = toFunction(prim)
  back = toFunction(back)
  return function orElse(x, i, C, xi2yC) {
    return (isDefinedAtU(prim, x, i) ? prim : back)(x, i, C, xi2yC)
  }
}

const orAlternativelyU = function orAlternatively(back, prim) {
  prim = toFunction(prim)
  back = toFunction(back)
  const fwd = y => {
    y = I.always(y)
    const yP = prim(void 0, void 0, I.Identity, y)
    return void 0 === yP ? back(void 0, void 0, I.Identity, y) : yP
  }
  return function orAlternatively(x, i, F, xi2yF) {
    const xP = prim(x, i, Select, id)
    return F.map(fwd, xi2yF(void 0 === xP ? back(x, i, Select, id) : xP, i))
  }
}

const makeSemi = op =>
  copyName(function(_) {
    let n = arguments[I.LENGTH]
    let r = arguments[--n]
    while (n) {
      r = op(r, arguments[--n])
    }
    return r
  }, op)

const zero = (x, _i, C, _xi2yC) => C.of(x)

//

const elemsI = (xs, _i, A, xi2yA) =>
  A === I.Identity
    ? mapPartialIndexU(xi2yA, xs, void 0)
    : A === Select
      ? selectInArrayLike(xi2yA, xs)
      : traversePartialIndex(A, xi2yA, xs, void 0)

//

const seq2U = (l, r) => (x, i, M, xi2yM) =>
  M.chain(x => r(x, i, M, xi2yM), l(x, i, M, xi2yM))

//

const pickInAux = (t, k) => [k, pickIn(t)]

//

const iteratePartial = aa =>
  function iterate(a) {
    let r = a
    while (a !== undefined) {
      r = a
      a = aa(a)
    }
    return r
  }

//

const crossPartial = (op, ls, or) => (xs, ss) => {
  const n = ls[I.LENGTH]
  if (!seemsArrayLike(xs)) return
  if (!seemsArrayLike(ss)) ss = ''
  const m = Math.max(n, xs[I.LENGTH], ss[I.LENGTH])
  const ys = Array(m)
  for (let i = 0; i < m; ++i)
    if (void 0 === (ys[i] = op(i < n ? ls[i] : or, xs[i], ss[i]))) return
  return ys
}

const crossOr = (process.env.NODE_ENV === 'production'
  ? I.curry
  : fn =>
      I.curry(function crossOr(or, ls) {
        return toFunction([isoU(id, I.freeze), fn(or, ls), isoU(I.freeze, id)])
      }))(function crossOr(or, ls) {
  return lensU(crossPartial(getU, ls, or), crossPartial(setU, ls, or))
})

const subsetPartial = p =>
  function subset(x) {
    return void 0 !== x && p(x) ? x : void 0
  }

//

const unfoldPartial = (process.env.NODE_ENV === 'production'
  ? id
  : C.res(
      C.res(r => {
        I.freeze(r)
        I.freeze(r[1])
        return r
      })
    ))(
  s2sa =>
    function unfold(s) {
      const xs = []
      for (;;) {
        const sa = s2sa(s)
        if (!isPair(sa)) return [s, xs]
        s = sa[0]
        xs.push(sa[1])
      }
    }
)

const foldPartial = sa2s => sxs => {
  if (isPair(sxs)) {
    const xs = sxs[1]
    if (I.isArray(xs)) {
      let s = sxs[0]
      let n = xs[I.LENGTH]
      while (n--) s = sa2s(freezeInDev([s, xs[n]]))
      return s
    }
  }
}

//

const PAYLOAD = '珳襱댎纚䤤鬖罺좴'

const isPayload = k => I.isString(k) && k.indexOf(PAYLOAD) === 0

function Spread(i) {
  this[PAYLOAD] = i
  I.freeze(this)
}

const isSpread = I.isInstanceOf(Spread)

const Variable = I.inherit(
  function Variable(i) {
    this[PAYLOAD + i] = this[PAYLOAD] = I.freeze([new Spread(i)])
    I.freeze(this)
  },
  Object,
  I.assocPartialU(I.iterator, function() {
    return this[PAYLOAD][I.iterator]()
  })
)
const isVariable = I.isInstanceOf(Variable)

const vars = []
function nVars(n) {
  while (vars[I.LENGTH] < n) vars.push(new Variable(vars[I.LENGTH]))
  return vars
}

const isPrimitive = x => x == null || typeof x !== 'object'

function match1(kinds, i, e, x) {
  if (void 0 !== x) {
    if (i in e) return I.acyclicEqualsU(e[i], x)
    e[i] = x
    const k = kinds[i]
    return !k || k(x)
  }
}

function checkKind(kinds, i, kind) {
  if (0 <= i) {
    if (kinds[i]) {
      if (kinds[i] !== kind)
        throw Error(
          'Spread patterns must be used consistently either as arrays or as objects.'
        )
    } else {
      kinds[i] = kind
    }
  }
}

const arrayKind = x => void 0 === x || I.isArray(x)
const objectKind = x => void 0 === x || I.isInstanceOf(Object)

function checkPattern(kinds, p) {
  if (isSpread(p)) {
    throw Error('Spread patterns must be inside objects or arrays.')
  } else if (I.isArray(p)) {
    let nSpread = 0
    for (let i = 0, n = p[I.LENGTH]; i < n; ++i) {
      const pi = p[i]
      if (isSpread(pi)) {
        if (nSpread++)
          throw Error('At most one spread is allowed in an array or object.')
        checkKind(kinds, pi[PAYLOAD], arrayKind)
      } else {
        checkPattern(kinds, pi)
      }
    }
  } else if (I.isObject(p)) {
    let spread = p[PAYLOAD]
    if (spread) {
      spread = spread[0][PAYLOAD]
      checkKind(kinds, spread, objectKind)
    }
    let n = 0
    for (const k in p) {
      if (isPayload(k)) {
        if (2 < ++n)
          throw Error('At most one spread is allowed in an array or object.')
      } else {
        checkPattern(kinds, p[k])
      }
    }
  } else if (!isPrimitive(p) && !isVariable(p)) {
    throw Error('Only plain arrays and objects are allowed in patterns.')
  }
}

const checkPatternInDev =
  process.env.NODE_ENV === 'production'
    ? id
    : p => {
        const kinds = []
        checkPattern(kinds, p)
        return deepFreezeInDev(p)
      }

const checkPatternPairInDev =
  process.env.NODE_ENV === 'production'
    ? id
    : ps => {
        const kinds = []
        checkPattern(kinds, ps[0])
        checkPattern(kinds, ps[1])
        return deepFreezeInDev(ps)
      }

const setDefined = (o, k, x) => {
  if (void 0 !== x) o[k] = x
}

const pushDefined = (xs, x) => {
  if (void 0 !== x) xs.push(x)
}

function toMatch(kinds, p) {
  if (void 0 === p || all1(isPrimitive, leafs, p)) {
    return (e, x) => I.acyclicEqualsU(p, x)
  } else if (isVariable(p)) {
    const i = p[PAYLOAD][0][PAYLOAD]
    return i < 0 ? id : (e, x) => match1(kinds, i, e, x)
  } else if (I.isArray(p)) {
    const init = []
    const rest = []
    let spread = void 0
    const n = p[I.LENGTH]
    for (let i = 0; i < n; ++i) {
      const x = p[i]
      if (isSpread(x)) {
        spread = x[PAYLOAD]
        kinds[spread] = arrayKind
      } else {
        const side = void 0 !== spread ? rest : init
        side.push(toMatch(kinds, x))
      }
    }
    return (e, x) => {
      if (!seemsArrayLike(x)) return
      let l = x[I.LENGTH]
      if (void 0 !== spread ? l < n - 1 : l !== n) return
      const j = init[I.LENGTH]
      for (let i = 0; i < j; ++i) if (!init[i](e, x[i])) return
      const k = rest[I.LENGTH]
      l -= k
      for (let i = 0; i < k; ++i) if (!rest[i](e, x[l + i])) return
      return (
        !(0 <= spread) ||
        match1(kinds, spread, e, copyToFrom(Array(l - j), 0, x, j, l))
      )
    }
  } else {
    let spread = p[PAYLOAD]
    if (spread) {
      spread = spread[0][PAYLOAD]
      kinds[spread] = objectKind
    }
    p = modify(values, (p, k) => (isPayload(k) ? void 0 : toMatch(kinds, p)), p)
    const n = count(values, p)
    return (e, x) => {
      if (isPrimitive(x) || I.isArray(x)) return
      x = toObject(x)
      const rest = 0 <= spread && {}
      let i = 0
      for (const k in x) {
        const m = p[k]
        if (m) {
          if (!m(e, x[k])) return
          i++
        } else if (void 0 !== spread) {
          if (rest) rest[k] = x[k]
        } else {
          return
        }
      }
      return i === n && (!rest || match1(kinds, spread, e, freezeInDev(rest)))
    }
  }
}

function toSubst(p, k) {
  if (isPayload(k)) {
    return void 0
  } else if (void 0 === p || all1(isPrimitive, leafs, p)) {
    return I.always(p)
  } else if (isVariable(p)) {
    const i = p[PAYLOAD][0][PAYLOAD]
    return e => e[i]
  } else if (I.isArray(p)) {
    const init = []
    const rest = []
    let spread = void 0
    const n = p[I.LENGTH]
    for (let i = 0; i < n; ++i) {
      const x = p[i]
      if (isSpread(x)) {
        spread = x[PAYLOAD]
      } else {
        const side = void 0 !== spread ? rest : init
        side.push(toSubst(x))
      }
    }
    return freezeResultInDev(e => {
      const r = []
      for (let i = 0, n = init[I.LENGTH]; i < n; ++i) pushDefined(r, init[i](e))
      if (0 <= spread) {
        const xs = e[spread]
        if (xs)
          for (let i = 0, n = xs[I.LENGTH]; i < n; ++i) pushDefined(r, xs[i])
      }
      for (let i = 0, n = rest[I.LENGTH]; i < n; ++i) pushDefined(r, rest[i](e))
      return r
    })
  } else {
    let spread = p[PAYLOAD]
    if (spread) spread = spread[0][PAYLOAD]
    p = modify(values, toSubst, p)
    return freezeResultInDev(e => {
      const r = {}
      for (const k in p) setDefined(r, k, p[k](e))
      if (0 <= spread) {
        const x = e[spread]
        if (x) for (const k in x) setDefined(r, k, x[k])
      }
      return r
    })
  }
}

const oneway = (n, m, s) => x => {
  const e = Array(n)
  if (m(e, x)) return s(e)
}

//

const ungroupByFn = (process.env.NODE_ENV === 'production'
  ? id
  : C.res(C.res(I.freeze)))(
  keyOf =>
    function ungroupBy(xxs) {
      if (I.isArray(xxs)) {
        const ys = []
        for (let i = 0, n = xxs.length; i < n; ++i) {
          const xs = xxs[i]
          if (!I.isArray(xs)) return
          const m = xs.length
          if (!m) return
          const k = keyOf(xs[0])
          if (void 0 === k) return
          for (let j = 0, m = xs.length; j < m; ++j) {
            const x = xs[j]
            if (!I.identicalU(k, keyOf(x))) return
            ys.push(x)
          }
        }
        return ys
      }
    }
)

const groupByFn = (process.env.NODE_ENV === 'production'
  ? id
  : C.res(C.res(freezeObjectOfObjects)))(
  keyOf =>
    function groupBy(ys) {
      if (I.isArray(ys)) {
        const groups = new Map()
        for (let i = 0, n = ys.length; i < n; ++i) {
          const y = ys[i]
          const k = keyOf(y)
          if (void 0 === k) return
          const xs = groups.get(k)
          if (void 0 !== xs) {
            xs.push(y)
          } else {
            groups.set(k, [y])
          }
        }
        const xxs = []
        groups.forEach(xs => xxs.push(xs))
        return xxs
      }
    }
)

//

const zW1Fn = (process.env.NODE_ENV === 'production'
  ? id
  : C.res(C.res(I.freeze)))(
  fn =>
    function zipWith1(xys) {
      if (isPair(xys)) {
        const ys = xys[1]
        const n = ys[I.LENGTH]
        if (n) {
          const x = xys[0]
          const zs = Array(n)
          for (let i = 0; i < n; ++i)
            if (void 0 === (zs[i] = fn([x, ys[i]]))) return
          return zs
        }
      }
    }
)

const unzW1Fn = (process.env.NODE_ENV === 'production'
  ? id
  : C.res(C.res(freezeObjectOfObjects)))(
  fn =>
    function unzipWith1(zs) {
      if (I.isArray(zs)) {
        const n = zs[I.LENGTH]
        if (n) {
          const xy0 = fn(zs[0])
          if (isPair(xy0)) {
            const ys = Array(n)
            const x = xy0[0]
            ys[0] = xy0[1]
            for (let i = 1; i < n; ++i) {
              const xy = fn(zs[i])
              if (!isPair(xy) || !I.acyclicEqualsU(x, xy[0])) return
              ys[i] = xy[1]
            }
            return [x, ys]
          }
        }
      }
    }
)

// Auxiliary

export const seemsArrayLike = x =>
  (x instanceof Object && ((x = x[I.LENGTH]), x === x >> 0 && 0 <= x)) ||
  I.isString(x)

// Internals

export {Identity, IdentityAsync} from './ext/infestines'

export const Select = ConstantWith((l, r) => (void 0 !== l ? l : r))

export const toFunction = (process.env.NODE_ENV === 'production'
  ? id
  : C.par(0, C.ef(reqOptic)))(function toFunction(o) {
  switch (typeof o) {
    case 'string':
      return funProp(o)
    case 'number':
      return funIndex(o)
    case 'object':
      return composed(0, o)
    default:
      return o[I.LENGTH] === 4 ? o : fromReader(o)
  }
})

// Operations on optics

export const assign = I.curry(function assign(o, x, s) {
  return setU([o, assignTo], x, s)
})

export const disperse = I.curry(disperseU)

export const modify = I.curry(modifyU)

export const modifyAsync = I.curry(modifyAsyncU)

export const remove = I.curry(function remove(o, s) {
  return setU(o, void 0, s)
})

export const set = I.curry(setU)

export const traverse = I.curry(traverseU)

// Nesting

export function compose() {
  let n = arguments[I.LENGTH]
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
  for (let i = 0, n = arguments[I.LENGTH]; i < n; ++i)
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

export const choices = makeSemi(orElseU)

export const choose = xiM2o =>
  copyName((x, i, C, xi2yC) => toFunction(xiM2o(x, i))(x, i, C, xi2yC), xiM2o)

export const cond = (process.env.NODE_ENV === 'production'
  ? id
  : fn =>
      function cond(...cs) {
        const pair = C.tup(C.ef(reqFn), C.ef(reqOptic))
        C.arr(pair)(cs.slice(0, -1))
        C.arr(C.or(C.tup(C.ef(reqOptic)), pair))(cs.slice(-1))
        return fn(...cs)
      })(function cond() {
  let n = arguments[I.LENGTH]
  let r = zero
  while (n--) {
    const c = arguments[n]
    r = c[I.LENGTH] < 2 ? toFunction(c[0]) : eitherU(toFunction(c[1]), r)(c[0])
  }
  return r
})

export const condOf = (process.env.NODE_ENV === 'production'
  ? id
  : fn =>
      function condOf(of, ...cs) {
        const pair = C.tup(C.ef(reqFn), C.ef(reqOptic))
        C.arr(pair)(cs.slice(0, -1))
        C.arr(C.or(C.tup(C.ef(reqOptic)), pair))(cs.slice(-1))
        return fn(of, ...cs)
      })(function condOf(of) {
  of = toFunction(of)

  let n = arguments[I.LENGTH] - 1
  if (!n) return zero

  let def = arguments[n]
  if (def[I.LENGTH] === 1) {
    --n
    def = toFunction(def[0])
  } else {
    def = zero
  }

  const ps = Array(n)
  const os = Array(n + 1)
  for (let i = 0; i < n; ++i) {
    const c = arguments[i + 1]
    ps[i] = c[0]
    os[i] = toFunction(c[1])
  }
  os[n] = def

  return function condOf(x, i, F, xi2yF) {
    let min = n
    of(x, i, Select, (y, j) => {
      for (let i = 0; i < min; ++i) {
        if (ps[i](y, j)) {
          min = i
          if (i === 0) return 0
          else break
        }
      }
    })
    return os[min](x, i, F, xi2yF)
  }
})

export const ifElse = I.curry(function ifElse(c, t, e) {
  return eitherU(toFunction(t), toFunction(e))(c)
})

export const orElse = I.curry(orElseU)

// Querying

export const chain = I.curry(function chain(xi2yO, xO) {
  return [xO, choose((xM, i) => (void 0 !== xM ? xi2yO(xM, i) : zero))]
})

export const choice = (...os) => os.reduceRight(orElseU, zero)

export const unless = eitherU(zero, identity)

export const when = eitherU(identity, zero)

export const optional = when(I.isDefined)

export {zero}

// Indices

export const mapIx = ix2j =>
  function mapIx(x, i, F, xj2yF) {
    return xj2yF(x, ix2j(i, x))
  }

export const setIx = j =>
  function setIx(x, _i, _F, xj2yF) {
    return xj2yF(x, j)
  }

export const tieIx = I.curry(function tieIx(ij2k, o) {
  o = toFunction(o)
  return copyName(
    (x, i, F, yk2zF) => o(x, i, F, (y, j) => yk2zF(y, ij2k(j, i))),
    o
  )
})

export const joinIx = setName(
  tieIx((j, i) => (void 0 !== i ? (void 0 !== j ? [i, j] : i) : j)),
  'joinIx'
)

export const reIx = o => {
  o = toFunction(o)
  return copyName((x, i, F, xi2yF) => {
    let j = 0
    return o(x, i, F, x => xi2yF(x, j++))
  }, o)
}

export const skipIx = setName(tieIx(I.sndU), 'skipIx')

// Debugging

export function getLog(l, s) {
  let {p, c} = traverseU(SelectLog, x => ({p: [x, consExcept], x, c: x}), l, s)
  p = pushTo(p, ['%O'])
  for (let i = 2; i < p[I.LENGTH]; ++i) p[0] += ' <= %O'
  console.log.apply(console, p)
  return c
}

export function log() {
  const show = I.curry(function log(dir, x) {
    console.log.apply(
      console,
      copyToFrom([], 0, arguments, 0, arguments[I.LENGTH]).concat([dir, x])
    )
    return x
  })
  return isoU(show('get'), show('set'))
}

// Operations on transforms

export const transform = I.curry(function transform(o, s) {
  return modifyU(o, id, s)
})

export const transformAsync = I.curry(function transformAsync(o, s) {
  return modifyAsyncU(o, id, s)
})

// Sequencing

export const seq = (process.env.NODE_ENV === 'production'
  ? id
  : fn =>
      function seq(...xMs) {
        return C.par(2, C.ef(reqMonad('seq')))(fn(...xMs))
      })(function seq() {
  let n = arguments[I.LENGTH]
  let r = zero
  if (n) {
    r = toFunction(arguments[--n])
    while (n) r = seq2U(toFunction(arguments[--n]), r)
  }
  return r
})

// Creating new traversals

export const branchOr = (process.env.NODE_ENV === 'production'
  ? id
  : C.par(1, C.ef(reqTemplate('branchOr'))))(
  I.curryN(2, function branchOr(otherwise) {
    otherwise = toFunction(otherwise)
    return function branchOr(template) {
      return branchOrU(otherwise, template)
    }
  })
)

export const branch = branchOr(zero)

export function branches() {
  const n = arguments[I.LENGTH]
  const template = {}
  for (let i = 0; i < n; ++i) template[arguments[i]] = identity
  return branch(template)
}

// Traversals and combinators

export function elems(xs, i, A, xi2yA) {
  return seemsArrayLike(xs) ? elemsI(xs, i, A, xi2yA) : A.of(xs)
}

export const elemsTotal = (xs, i, A, xi2yA) =>
  seemsArrayLike(xs)
    ? A === I.Identity
      ? mapPartialIndexU(xi2yA, xs, mapPartialIndexU)
      : A === Select
        ? selectInArrayLike(xi2yA, xs)
        : traversePartialIndex(A, xi2yA, xs, traversePartialIndex)
    : A.of(xs)

export const entries = setName(toFunction([keyed, elems]), 'entries')

export const keys = setName(toFunction([keyed, elems, 0]), 'keys')

export const keysEverywhere = (x, i, A, xi2yA) => {
  const recEntry = (kv, i) =>
    A.ap(A.map(pairPartial, xi2yA(kv[0], i)), recAny(kv[1], i))
  const recAny = (x, i) =>
    I.isArray(x)
      ? elemsI(x, i, A, recAny)
      : I.isObject(x)
        ? entries(x, i, A, recEntry)
        : A.of(x)
  return recAny(x, i)
}

export const subseq = I.curry(subseqU)

export const limit = subseq(0)

export const offset = I.curry(function offset(begin, t) {
  return subseqU(begin, void 0, t)
})

export function matches(re) {
  return function matches(x, _i, C, xi2yC) {
    if (I.isString(x)) {
      const {map} = C
      if (re.global) {
        const m0 = ['']
        m0.input = x
        m0[INDEX] = 0
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
            xi2yC(m[0], m[INDEX])
          )
      }
    }
    return C.of(x)
  }
}

export const values = setName(branchOr1Level(identity, I.protoless0), 'values')

export function children(x, i, C, xi2yC) {
  return I.isArray(x)
    ? elemsI(x, i, C, xi2yC)
    : I.isObject(x)
      ? values(x, i, C, xi2yC)
      : C.of(x)
}

export function flatten(x, i, C, xi2yC) {
  const rec = (x, i) =>
    I.isArray(x) ? elemsI(x, i, C, rec) : void 0 !== x ? xi2yC(x, i) : C.of(x)
  return rec(x, i)
}

export function query() {
  const r = []
  for (let i = 0, n = arguments[I.LENGTH]; i < n; ++i) {
    const o = toFunction(arguments[i])
    r.push(satisfying(isDefinedAt(o)), o)
  }
  return r
}

export const satisfying = p =>
  function satisfying(x, i, C, xi2yC) {
    const rec = (x, i) => (p(x, i) ? xi2yC(x, i) : children(x, i, C, rec))
    return rec(x, i)
  }

export const leafs = satisfying(
  x => void 0 !== x && !I.isArray(x) && !I.isObject(x)
)

export const whereEq = template =>
  satisfying(and(branch(modify(leafs, is, template))))

// Folds over traversals

export const all = I.curry(function all(xi2b, t, s) {
  return !getAsU(
    (x, i) => {
      if (!xi2b(x, i)) return true
    },
    t,
    s
  )
})

export const and = all(id)

export const all1 = I.curry(function all1(xi2b, t, s) {
  let result = false
  getAsU(
    (x, i) => {
      if (xi2b(x, i)) result = true
      else return (result = false)
    },
    t,
    s
  )
  return result
})

export const and1 = all1(id)

export const any = I.curry(function any(xi2b, t, s) {
  return !!getAsU(
    (x, i) => {
      if (xi2b(x, i)) return true
    },
    t,
    s
  )
})

export const collectAs = (process.env.NODE_ENV === 'production'
  ? I.curry
  : C.res(I.freeze))(function collectAs(xi2y, t, s) {
  const results = []
  getAsU(
    (x, i) => {
      const y = xi2y(x, i)
      if (void 0 !== y) results.push(y)
    },
    t,
    s
  )
  return results
})

export const collect = collectAs(id)

export const collectTotalAs = (process.env.NODE_ENV === 'production'
  ? I.curry
  : C.res(I.freeze))(function collectTotalAs(xi2y, t, s) {
  const results = []
  getAsU(
    (x, i) => {
      results.push(xi2y(x, i))
    },
    t,
    s
  )
  return results
})

export const collectTotal = collectTotalAs(id)

export const concatAs = mkTraverse(id, ConstantOf)

export const concat = concatAs(id)

export const countIf = I.curry(function countIf(p, t, s) {
  return traverseU(Sum, (x, i) => (p(x, i) ? 1 : 0), t, s)
})

export const count = countIf(I.isDefined)

export const countsAs = I.curry(function countsAs(xi2k, t, s) {
  const counts = new Map()
  getAsU(
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

export const counts = countsAs(id)

export const foldl = I.curry(function foldl(f, r, t, s) {
  getAsU(
    (x, i) => {
      r = f(r, x, i)
    },
    t,
    s
  )
  return r
})

export const foldr = I.curry(function foldr(f, r, t, s) {
  const is = []
  const xs = []
  getAsU(
    (x, i) => {
      xs.push(x)
      is.push(i)
    },
    t,
    s
  )
  for (let i = xs[I.LENGTH] - 1; 0 <= i; --i) r = f(r, xs[i], is[i])
  return r
})

export const forEach = I.curry(function forEach(f, t, s) {
  return getAsU(
    (x, i) => {
      f(x, i)
    },
    t,
    s
  )
})

export const forEachWith = I.curry(function forEachWith(newC, ef, t, s) {
  const c = newC()
  getAsU(
    (x, i) => {
      ef(c, x, i)
    },
    t,
    s
  )
  return c
})

export function get(l, s) {
  return 1 < arguments[I.LENGTH] ? getAsU(id, l, s) : s => getAsU(id, l, s)
}

export const getAs = I.curry(getAsU)

export const isDefined = I.curry(function isDefined(t, s) {
  return void 0 !== getAsU(id, t, s)
})

export const isEmpty = I.curry(function isEmpty(t, s) {
  return !getAsU(toTrue, t, s)
})

export const joinAs = mkTraverse(
  toStringPartial,
  (process.env.NODE_ENV === 'production'
    ? id
    : C.par(
        0,
        C.ef(reqString('`join` and `joinAs` expect a string delimiter'))
      ))(function joinAs(d) {
    return ConstantWith(
      (x, y) => (void 0 !== x ? (void 0 !== y ? x + d + y : x) : y)
    )
  })
)

export const join = joinAs(id)

export const maximumBy = mumBy(I.gtU)

export const maximum = maximumBy(id)

export const meanAs = I.curry(function meanAs(xi2y, t, s) {
  let sum = 0
  let num = 0
  getAsU(
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

export const mean = meanAs(id)

export const minimumBy = mumBy(I.ltU)

export const minimum = minimumBy(id)

export const none = I.curry(function none(xi2b, t, s) {
  return !getAsU(
    (x, i) => {
      if (xi2b(x, i)) return true
    },
    t,
    s
  )
})

export const or = any(id)

export const productAs = traverse(ConstantWith(I.multiplyU, 1))

export const product = productAs(unto(1))

export const select =
  process.env.NODE_ENV === 'production'
    ? get
    : I.curry(function select(l, s) {
        warn(
          select,
          '`select` has been obsoleted.  Just use `get`.  See CHANGELOG for details.'
        )
        return get(l, s)
      })

export const selectAs =
  process.env.NODE_ENV === 'production'
    ? getAs
    : I.curry(function selectAs(f, l, s) {
        warn(
          selectAs,
          '`selectAs` has been obsoleted.  Just use `getAs`.  See CHANGELOG for details.'
        )
        return getAs(f, l, s)
      })

export const sumAs = traverse(Sum)

export const sum = sumAs(unto0)

// Creating new lenses

export const foldTraversalLens = I.curry(function foldTraversalLens(
  fold,
  traversal
) {
  return lensU(fold(traversal), set(traversal))
})

export const getter = get => (x, i, F, xi2yF) => xi2yF(get(x, i), i)

export const lens = I.curry(lensU)

export function partsOf(t) {
  if (arguments[I.LENGTH] !== 1) t = toFunction(compose.apply(null, arguments))
  return function partsOf(x, i, F, xi2yF) {
    return F.map(y => disperseU(t, y, x), xi2yF(collectTotal(t, x), i))
  }
}

export const setter = lens(id)

// Enforcing invariants

export function defaults(out) {
  function o2u(x) {
    return replaced(out, void 0, x)
  }
  return function defaults(x, i, F, xi2yF) {
    return F.map(o2u, xi2yF(void 0 !== x ? x : out, i))
  }
}

export function define(v) {
  const untoV = unto(v)
  return function define(x, i, F, xi2yF) {
    return F.map(untoV, xi2yF(void 0 !== x ? x : v, i))
  }
}

export const normalize = xi2x => [reread(xi2x), rewrite(xi2x)]

export function required(inn) {
  return replace(inn, void 0)
}

export const reread = xi2x => (x, i, _F, xi2yF) =>
  xi2yF(void 0 !== x ? xi2x(x, i) : x, i)

export const rewrite = yi2y => (x, i, F, xi2yF) =>
  F.map(y => (void 0 !== y ? yi2y(y, i) : y), xi2yF(x, i))

// Lensing arrays

export const filter = (process.env.NODE_ENV === 'production'
  ? id
  : C.res(lens =>
      toFunction([
        lens,
        isoU(
          id,
          C.ef(
            reqMaybeArray(
              '`filter` must be set with undefined or an array-like object'
            )
          )
        )
      ])
    ))(function filter(xi2b) {
  return function filter(xs, i, F, xi2yF) {
    let ts
    let fs = I.array0
    if (seemsArrayLike(xs)) partitionIntoIndex(xi2b, xs, (ts = []), (fs = []))
    return F.map(ts => {
      const tsN = ts ? ts[I.LENGTH] : 0
      const fsN = fs[I.LENGTH]
      const n = tsN + fsN
      return n === fsN
        ? fs
        : copyToFrom(copyToFrom(Array(n), 0, ts, 0, tsN), tsN, fs, 0, fsN)
    }, xi2yF(ts, i))
  }
})

export function find(xih2b) {
  const hint = arguments[I.LENGTH] > 1 ? arguments[1] : {hint: 0}
  return function find(xs, _i, F, xi2yF) {
    const ys = seemsArrayLike(xs) ? xs : ''
    const i = (hint.hint = findIndexHint(hint, xih2b, ys))
    return F.map(v => setIndex(i, v, ys), xi2yF(ys[i], i))
  }
}

export function findWith(o) {
  const oo = toFunction(o)
  const p = isDefinedAt(oo)
  return [arguments[I.LENGTH] > 1 ? find(p, arguments[1]) : find(p), oo]
}

export const first = 0

export const index = process.env.NODE_ENV !== 'production' ? C.ef(reqIndex) : id

export const last = choose(function last(maybeArray) {
  return seemsArrayLike(maybeArray) && maybeArray[I.LENGTH]
    ? maybeArray[I.LENGTH] - 1
    : 0
})

export const prefix = n => slice(0, n)

export const slice = (process.env.NODE_ENV === 'production'
  ? I.curry
  : C.res(lens =>
      toFunction([
        lens,
        isoU(
          id,
          C.ef(
            reqMaybeArray(
              '`slice` must be set with undefined or an array-like object'
            )
          )
        )
      ])
    ))(function slice(begin, end) {
  return function slice(xs, i, F, xsi2yF) {
    const seems = seemsArrayLike(xs)
    const xsN = seems && xs[I.LENGTH]
    const b = sliceIndex(0, xsN, 0, begin)
    const e = sliceIndex(b, xsN, xsN, end)
    return F.map(zs => {
      const zsN = zs ? zs[I.LENGTH] : 0
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
  }
})

export const suffix = n => slice(0 === n ? Infinity : !n ? 0 : -n, void 0)

// Lensing objects

export const pickIn = t =>
  I.isObject(t) ? pick(modify(values, pickInAux, t)) : t

export const prop =
  process.env.NODE_ENV === 'production'
    ? id
    : x => {
        if (!I.isString(x)) errorGiven('`prop` expects a string', x)
        return x
      }

export function props() {
  const n = arguments[I.LENGTH]
  const template = {}
  for (let i = 0, k; i < n; ++i) template[(k = arguments[i])] = k
  return pick(template)
}

export function propsExcept() {
  const setish = I.create(null)
  for (let i = 0, n = arguments[I.LENGTH]; i < n; ++i)
    setish[arguments[i]] = 'd'
  return [disjoint(k => setish[k] || 't'), 't']
}

export const propsOf = o => {
  warn(
    propsOf,
    '`propsOf` has been deprecated and there is no replacement.  See CHANGELOG for details.'
  )
  return props.apply(null, I.keys(o))
}

export function removable(...ps) {
  function drop(y) {
    if (!(y instanceof Object)) return y
    for (let i = 0, n = ps[I.LENGTH]; i < n; ++i) if (I.hasU(ps[i], y)) return y
  }
  return (x, i, F, xi2yF) => F.map(drop, xi2yF(x, i))
}

// Providing defaults

export const valueOr = v => (x, i, _F, xi2yF) => xi2yF(x != null ? x : v, i)

// Transforming data

export const pick = (process.env.NODE_ENV === 'production'
  ? id
  : C.par(0, C.ef(reqTemplate('pick'))))(function pick(template) {
  return (x, i, F, xi2yF) =>
    F.map(v => setPick(template, v, x), xi2yF(getPick(template, x), i))
})

export const replace = I.curry(function replace(inn, out) {
  function o2i(x) {
    return replaced(out, inn, x)
  }
  return function replace(x, i, F, xi2yF) {
    return F.map(o2i, xi2yF(replaced(inn, out, x), i))
  }
})

// Inserters

export function appendTo(xs, _, F, xi2yF) {
  const i = seemsArrayLike(xs) ? xs[I.LENGTH] : 0
  return F.map(x => setIndex(i, x, xs), xi2yF(void 0, i))
}

export const append =
  process.env.NODE_ENV === 'production'
    ? appendTo
    : function append(x, i, F, xi2yF) {
        warn(
          append,
          '`append` has been renamed to `appendTo`.  See CHANGELOG for details.'
        )
        return appendTo(x, i, F, xi2yF)
      }

export const assignTo = (process.env.NODE_ENV === 'production'
  ? id
  : iso => copyName(toFunction([isoU(id, I.freeze), iso]), iso))(
  function assignTo(x, i, F, xi2yF) {
    return F.map(
      y => I.assign({}, x instanceof Object ? x : null, y),
      xi2yF(void 0, i)
    )
  }
)

export const prependTo = setName(toFunction([prefix(0), 0]), 'prependTo')

// Transforming

export const appendOp = setName(inserterOp(appendTo), 'appendOp')

export const assignOp = setName(inserterOp(assignTo), 'assignOp')

export const modifyOp = xi2y =>
  function modifyOp(x, i, C, _xi2yC) {
    return C.of(xi2y(x, i))
  }

export const prependOp = setName(inserterOp(prependTo), 'prependOp')

export const setOp = y =>
  function setOp(_x, _i, C, _xi2yC) {
    return C.of(y)
  }

export const removeOp = setOp()

export const cross = setName(crossOr(removeOp), 'cross')

// Operations on isomorphisms

export function getInverse(o, s) {
  return 1 < arguments[I.LENGTH] ? getInverseU(o, s) : s => getInverseU(o, s)
}

// Creating new isomorphisms

export const iso = I.curry(isoU)

export const _ = new Variable(-1)

export function mapping(ps) {
  let n = 0
  if (I.isFunction(ps)) ps = ps.apply(null, nVars((n = ps[I.LENGTH])))
  checkPatternPairInDev(ps)
  const kinds = Array(n)
  const ms = ps.map(p => toMatch(kinds, p))
  const ss = ps.map(toSubst)
  return isoU(oneway(n, ms[0], ss[1]), oneway(n, ms[1], ss[0]))
}

export function mappings(ps) {
  if (I.isFunction(ps)) ps = ps.apply(null, nVars(ps[I.LENGTH]))
  return alternatives.apply(null, ps.map(mapping))
}

export function pattern(p) {
  let n = 0
  if (I.isFunction(p)) p = p.apply(null, nVars((n = p[I.LENGTH])))
  checkPatternInDev(p)
  const kinds = Array(n)
  const m = toMatch(kinds, p)
  return subset(x => m(Array(n), x))
}

export function patterns(ps) {
  if (I.isFunction(ps)) ps = ps.apply(null, nVars(ps[I.LENGTH]))
  return alternatives.apply(null, ps.map(pattern))
}

// Isomorphism combinators

export const alternatives = makeSemi(orAlternativelyU)

export const applyAt = I.curry(function applyAt(elements, transform) {
  return isoU(
    modify(elements, get(transform)),
    modify(elements, getInverse(transform))
  )
})

export const attemptEveryDown = iso =>
  isoU(
    transformEvery(rereadAttempt(get(iso))),
    transformEvery(rewriteAttempt(getInverse(iso)))
  )

export const attemptEveryUp = iso =>
  isoU(
    transformEvery(rewriteAttempt(get(iso))),
    transformEvery(rereadAttempt(getInverse(iso)))
  )

export const attemptSomeDown = iso =>
  isoU(transformSome(get(iso)), transformSome(getInverse(iso)))

export const conjugate = I.curry(function conjugate(outer, inner) {
  return [outer, inner, inverse(outer)]
})

export const inverse = iso => (x, i, F, xi2yF) =>
  F.map(x => getAsU(id, iso, x), xi2yF(setU(iso, x, void 0), i))

export const iterate = aIa =>
  isoU(iteratePartial(get(aIa)), iteratePartial(getInverse(aIa)))

export const orAlternatively = I.curry(orAlternativelyU)

export const fold = saIs =>
  isoU(foldPartial(get(saIs)), unfoldPartial(getInverse(saIs)))

export const unfold = sIsa =>
  isoU(unfoldPartial(get(sIsa)), foldPartial(getInverse(sIsa)))

// Basic isomorphisms

export const complement = isoU(notPartial, notPartial)

export {identity}

export const is = v =>
  isoU(
    function is(x) {
      return I.acyclicEqualsU(v, x)
    },
    b => (true === b ? v : void 0)
  )

export function subset(predicate) {
  const subsetFn = subsetPartial(predicate)
  return isoU(subsetFn, subsetFn)
}

// Array isomorphisms

export const array = elem => {
  const fwd = getInverse(elem)
  const bwd = get(elem)
  const mapFwd = x => mapIfArrayLike(fwd, x)
  return (x, i, F, xi2yF) => F.map(mapFwd, xi2yF(mapIfArrayLike(bwd, x), i))
}

export const arrays = elem => {
  const fwd = getInverse(elem)
  const bwd = get(elem)
  const mapFwd = x => mapsIfArray(fwd, x)
  return (x, i, F, xi2yF) => F.map(mapFwd, xi2yF(mapsIfArray(bwd, x), i))
}

export const indexed = isoU(
  expect(
    seemsArrayLike,
    (process.env.NODE_ENV === 'production' ? id : C.res(freezeObjectOfObjects))(
      function indexed(xs) {
        const n = xs[I.LENGTH]
        const xis = Array(n)
        for (let i = 0; i < n; ++i) xis[i] = [i, xs[i]]
        return xis
      }
    )
  ),
  expect(
    I.isArray,
    (process.env.NODE_ENV === 'production' ? id : C.res(I.freeze))(xis => {
      let n = xis[I.LENGTH]
      let xs = Array(n)
      for (let i = 0; i < n; ++i) {
        const xi = xis[i]
        if (xi[I.LENGTH] === 2) xs[xi[0]] = xi[1]
      }
      n = xs[I.LENGTH]
      let j = 0
      for (let i = 0; i < n; ++i) {
        const x = xs[i]
        if (void 0 !== x) {
          if (i !== j) xs[j] = x
          ++j
        }
      }
      xs[I.LENGTH] = j
      return xs
    })
  )
)

export const reverse = isoU(rev, rev)

export const singleton = setName(mapping(x => [[x], x]), 'singleton')

export const groupBy = keyOf => {
  keyOf = toGetter(keyOf)
  return isoU(groupByFn(keyOf), ungroupByFn(keyOf))
}

export const ungroupBy = keyOf => {
  keyOf = toGetter(keyOf)
  return isoU(ungroupByFn(keyOf), groupByFn(keyOf))
}

export const zipWith1 = iso => isoU(zW1Fn(get(iso)), unzW1Fn(getInverse(iso)))

export const unzipWith1 = iso => isoU(unzW1Fn(get(iso)), zW1Fn(getInverse(iso)))

// Object isomorphisms

export const disjoint = groupOf =>
  function disjoint(x, i, F, xi2yF) {
    const fwd = disjointFwd(groupOf)
    return F.map(fwd, xi2yF(disjointBwd(groupOf, x), i))
  }

export {keyed}

export const multikeyed = isoU(
  expect(
    I.isInstanceOf(Object),
    (process.env.NODE_ENV === 'production' ? id : C.res(freezeObjectOfObjects))(
      function multikeyed(o) {
        o = toObject(o)
        const ps = []
        for (const k in o) {
          const v = o[k]
          if (I.isArray(v))
            for (let i = 0, n = v[I.LENGTH]; i < n; ++i) ps.push([k, v[i]])
          else ps.push([k, v])
        }
        return ps
      }
    )
  ),
  expect(
    I.isArray,
    (process.env.NODE_ENV === 'production' ? id : C.res(freezeObjectOfObjects))(
      ps => {
        const o = I.create(null)
        for (let i = 0, n = ps[I.LENGTH]; i < n; ++i) {
          const entry = ps[i]
          if (entry[I.LENGTH] === 2) {
            const k = entry[0]
            const v = entry[1]
            const was = o[k]
            if (was === void 0) o[k] = v
            else if (I.isArray(was)) was.push(v)
            else o[k] = [was, v]
          }
        }
        return I.assign({}, o)
      }
    )
  )
)

// Standard isomorphisms

export const json = (process.env.NODE_ENV === 'production'
  ? id
  : C.res(iso => toFunction([iso, isoU(deepFreezeInDev, id)])))(function json(
  options
) {
  const {reviver, replacer, space} = options || I.object0
  return isoU(
    expect(
      I.isString,
      tryCatch(function json(text) {
        return JSON.parse(text, reviver)
      })
    ),
    expect(I.isDefined, value => JSON.stringify(value, replacer, space))
  )
})

export const uri = stringIsoU(tryCatch(decodeURI), encodeURI)

export const uriComponent = isoU(
  expect(I.isString, tryCatch(decodeURIComponent)),
  expect(I.isPrimitiveData, encodeURIComponent)
)

// String isomorphisms

export const dropPrefix = pfx =>
  stringIsoU(
    function dropPrefix(x) {
      return x.startsWith(pfx) ? x.slice(pfx[I.LENGTH]) : undefined
    },
    x => pfx + x
  )

export const dropSuffix = sfx =>
  stringIsoU(
    function dropSuffix(x) {
      return x.endsWith(sfx)
        ? x.slice(0, x[I.LENGTH] - sfx[I.LENGTH])
        : undefined
    },
    x => x + sfx
  )

export const replaces = I.curry(function replaces(i, o) {
  return stringIsoU(
    I.replace(toRegExpU(i, 'g'), o),
    I.replace(toRegExpU(o, 'g'), i)
  )
})

export const split = (process.env.NODE_ENV === 'production'
  ? id
  : fn =>
      function split(_sep) {
        return toFunction([fn.apply(null, arguments), isoU(I.freeze, id)])
      })(function split(sep) {
  const re = arguments[I.LENGTH] > 1 ? arguments[1] : sep
  return isoU(
    expect(I.isString, x => x.split(re)),
    expect(I.isArray, xs => xs.join(sep))
  )
})

export const uncouple = (process.env.NODE_ENV === 'production'
  ? id
  : fn =>
      function uncouple(_sep) {
        return toFunction([fn.apply(null, arguments), isoU(I.freeze, id)])
      })(function uncouple(sep) {
  const re = toRegExpU(arguments[I.LENGTH] > 1 ? arguments[1] : sep, '')
  return isoU(
    expect(I.isString, x => {
      const m = re.exec(x)
      return m ? [x.slice(0, m[INDEX]), x.slice(reLastIndex(m))] : [x, '']
    }),
    kv => {
      if (isPair(kv)) {
        const k = kv[0]
        const v = kv[1]
        return v ? k + sep + v : k
      }
    }
  )
})

// Standardish isomorphisms

export const querystring = setName(
  toFunction([
    reread(s => (I.isString(s) ? s.replace(/\+/g, '%20') : s)),
    split('&'),
    array([uncouple('='), array(uriComponent)]),
    inverse(multikeyed)
  ]),
  'querystring'
)

// Arithmetic isomorphisms

export const add = c => numberIsoU(I.add(c), I.add(-c))
export const divide = c => numberIsoU(I.divideBy(c), I.multiply(c))
export const multiply = c => numberIsoU(I.multiply(c), I.divideBy(c))
export const negate = numberIsoU(I.negate, I.negate)
export const subtract = c => numberIsoU(I.add(-c), I.add(c))

// Interop

export {
  FantasyFunctor,
  fromFantasy,
  fromFantasyApplicative,
  fromFantasyMonad
} from './ext/infestines'

export const pointer = s => {
  if (s[0] === '#') s = decodeURIComponent(s)
  const ts = s.split('/')
  const n = ts[I.LENGTH]
  for (let i = 1; i < n; ++i) {
    const t = ts[i]
    ts[i - 1] = /^(0|[1-9]\d*)$/.test(t)
      ? ifElse(isArrayOrPrimitive, Number(t), t)
      : '-' === t
        ? ifElse(isArrayOrPrimitive, append, t)
        : t.replace('~1', '/').replace('~0', '~')
  }
  ts[I.LENGTH] = n - 1
  return ts
}
