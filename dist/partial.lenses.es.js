import { acyclicEqualsU, always, applyU, arityN, array0, assocPartialU, constructorOf, curry, curryN, dissocPartialU, hasU, id, isDefined, isFunction, isObject, isString, keys, object0, pipe2U, sndU } from 'infestines';
import * as I from 'infestines';

//

var not = function not(x) {
  return !x;
};

var sliceIndex = function sliceIndex(m, l, d, i) {
  return void 0 !== i ? Math.min(Math.max(m, i < 0 ? l + i : i), l) : d;
};

function pair(x0, x1) {
  return [x0, x1];
}
var cpair = function cpair(x) {
  return function (xs) {
    return [x, xs];
  };
};

var unto = function unto(c) {
  return function (x) {
    return void 0 !== x ? x : c;
  };
};

var notPartial = function notPartial(x) {
  return void 0 !== x ? !x : x;
};

var seemsArrayLike = function seemsArrayLike(x) {
  return x instanceof Object && (x = x.length, x === x >> 0 && 0 <= x) || isString(x);
};

//

function mapPartialIndexU(xi2y, xs) {
  var n = xs.length,
      ys = Array(n);
  var j = 0;
  for (var i = 0, y; i < n; ++i) {
    if (void 0 !== (y = xi2y(xs[i], i))) ys[j++] = y;
  }if (j) {
    if (j < n) ys.length = j;
    if (process.env.NODE_ENV !== "production") Object.freeze(ys);
    return ys;
  }
}

function copyToFrom(ys, k, xs, i, j) {
  while (i < j) {
    ys[k++] = xs[i++];
  }if (process.env.NODE_ENV !== "production") if (ys.length === k) Object.freeze(ys);
  return ys;
}

//

var Ident = { map: applyU, of: id, ap: applyU, chain: applyU };

var Const = { map: sndU };

function ConcatOf(ap, empty, delay) {
  var c = { map: sndU, ap: ap, of: always(empty) };
  if (delay) c.delay = delay;
  return c;
}

var Monoid = function Monoid(concat, _empty) {
  return { concat: concat, empty: function empty() {
      return _empty;
    } };
};
var Sum = /*#__PURE__*/Monoid(function (y, x) {
  return x + y;
}, 0);

var Mum = function Mum(ord) {
  return Monoid(function (y, x) {
    return void 0 !== x && (void 0 === y || ord(x, y)) ? x : y;
  });
};

//

var run = function run(o, C, xi2yC, s, i) {
  return toFunction(o)(C, xi2yC, s, i);
};

//

var expectedOptic = "Expecting an optic";
var opticIsEither = "An optic can be either\n- a string,\n- a non-negative integer,\n- a ternary optic function,\n- an ordinary unary or binary function, or\n- an array of optics.\nSee documentation of `toFunction` and `compose` for details.";
var header = "partial.lenses: ";

function warn(f, m) {
  if (!f.warned) {
    f.warned = 1;
    console.warn(header + m);
  }
}

function errorGiven(m, o, e) {
  m = header + m + ".";
  e = e ? "\n" + e : "";
  console.error(m, "Given:", o, e);
  throw Error(m + e);
}

function checkIndex(x) {
  if (!Number.isInteger(x) || x < 0) errorGiven("`index` expects a non-negative integer", x);
  return x;
}

function reqFunction(o) {
  if (!(isFunction(o) && (o.length === 4 || o.length <= 2))) errorGiven(expectedOptic, o, opticIsEither);
}

function reqArray(o) {
  if (!Array.isArray(o)) errorGiven(expectedOptic, o, opticIsEither);
}

//

function reqApplicative(C, name) {
  if (!C.of) errorGiven("`" + name + "` requires an applicative", C, "Note that you cannot `get` a traversal. Perhaps you wanted to `collect` it?");
}

//

function Join(l, r) {
  this.l = l;this.r = r;
}

var isJoin = function isJoin(n) {
  return n.constructor === Join;
};

var join = function join(l, r) {
  return void 0 !== l ? void 0 !== r ? new Join(l, r) : l : r;
};

var cjoin = function cjoin(h) {
  return function (t) {
    return join(h, t);
  };
};

function pushTo(n, ys) {
  while (n && isJoin(n)) {
    var l = n.l;
    n = n.r;
    if (l && isJoin(l)) {
      pushTo(l.l, ys);
      pushTo(l.r, ys);
    } else {
      ys.push(l);
    }
  }
  ys.push(n);
}

function toArray(n) {
  if (void 0 !== n) {
    var ys = [];
    pushTo(n, ys);
    if (process.env.NODE_ENV !== "production") Object.freeze(ys);
    return ys;
  }
}

function foldRec(f, r, n) {
  while (isJoin(n)) {
    var l = n.l;
    n = n.r;
    r = isJoin(l) ? foldRec(f, foldRec(f, r, l.l), l.r) : f(r, l[0], l[1]);
  }
  return f(r, n[0], n[1]);
}

var fold = function fold(f, r, n) {
  return void 0 !== n ? foldRec(f, r, n) : r;
};

var Collect = /*#__PURE__*/ConcatOf(join);

//

var U = {};
var T = { v: true };

var Select = /*#__PURE__*/ConcatOf(function (l, r) {
  while (l.constructor === Function) {
    l = l();
  }return void 0 !== l.v ? l : r;
}, U, id);

var mkSelect = function mkSelect(toM) {
  return function (xi2yM, t, s) {
    s = run(t, Select, pipe2U(xi2yM, toM), s);
    while (s.constructor === Function) {
      s = s();
    }return s.v;
  };
};

//

var traversePartialIndexLazy = function traversePartialIndexLazy(map, ap, z, delay, xi2yA, xs, i, n) {
  return i < n ? ap(map(cjoin, xi2yA(xs[i], i)), delay(function () {
    return traversePartialIndexLazy(map, ap, z, delay, xi2yA, xs, i + 1, n);
  })) : z;
};

function traversePartialIndex(A, xi2yA, xs) {
  if (process.env.NODE_ENV !== "production") reqApplicative(A, "elems");
  var map = A.map,
      ap = A.ap,
      of = A.of,
      delay = A.delay;

  var xsA = of(void 0),
      i = xs.length;
  if (delay) xsA = traversePartialIndexLazy(map, ap, xsA, delay, xi2yA, xs, 0, i);else while (i--) {
    xsA = ap(map(cjoin, xi2yA(xs[i], i)), xsA);
  }return map(toArray, xsA);
}

//

function object0ToUndefined(o) {
  if (!(o instanceof Object)) return o;
  for (var k in o) {
    return o;
  }
}

//

var lensFrom = function lensFrom(get, set) {
  return function (i) {
    return function (F, xi2yF, x, _) {
      return (0, F.map)(function (v) {
        return set(i, v, x);
      }, xi2yF(get(i, x), i));
    };
  };
};

//

var getProp = function getProp(k, o) {
  return o instanceof Object ? o[k] : void 0;
};

function setProp(k, v, o) {
  var r = void 0 !== v ? assocPartialU(k, v, o) : dissocPartialU(k, o);
  if (process.env.NODE_ENV !== "production") if (r) Object.freeze(r);
  return r;
}

var funProp = /*#__PURE__*/lensFrom(getProp, setProp);

//

var getIndex = function getIndex(i, xs) {
  return seemsArrayLike(xs) ? xs[i] : void 0;
};

function setIndex(i, x, xs) {
  if (process.env.NODE_ENV !== "production") checkIndex(i);
  if (!seemsArrayLike(xs)) xs = "";
  var n = xs.length;
  if (void 0 !== x) {
    var m = Math.max(i + 1, n),
        ys = Array(m);
    for (var j = 0; j < m; ++j) {
      ys[j] = xs[j];
    }ys[i] = x;
    if (process.env.NODE_ENV !== "production") Object.freeze(ys);
    return ys;
  } else {
    if (0 < n) {
      if (n <= i) return copyToFrom(Array(n), 0, xs, 0, n);
      if (1 < n) {
        var _ys = Array(n - 1);
        for (var _j = 0; _j < i; ++_j) {
          _ys[_j] = xs[_j];
        }for (var _j2 = i + 1; _j2 < n; ++_j2) {
          _ys[_j2 - 1] = xs[_j2];
        }if (process.env.NODE_ENV !== "production") Object.freeze(_ys);
        return _ys;
      }
    }
  }
}

var funIndex = /*#__PURE__*/lensFrom(getIndex, setIndex);

//

var close = function close(o, F, xi2yF) {
  return function (x, i) {
    return o(F, xi2yF, x, i);
  };
};

function composed(oi0, os) {
  var n = os.length - oi0;
  var fs = void 0;
  if (n < 2) {
    return n ? toFunction(os[oi0]) : identity;
  } else {
    fs = Array(n);
    for (var i = 0; i < n; ++i) {
      fs[i] = toFunction(os[i + oi0]);
    }return function (F, xi2yF, x, i) {
      var k = n;
      while (--k) {
        xi2yF = close(fs[k], F, xi2yF);
      }return fs[0](F, xi2yF, x, i);
    };
  }
}

function setU(o, x, s) {
  switch (typeof o) {
    case "string":
      return setProp(o, x, s);
    case "number":
      return setIndex(o, x, s);
    case "object":
      if (process.env.NODE_ENV !== "production") reqArray(o);
      return modifyComposed(o, 0, s, x);
    default:
      if (process.env.NODE_ENV !== "production") reqFunction(o);
      return o.length === 4 ? o(Ident, always(x), s, void 0) : s;
  }
}

function getU(l, s) {
  switch (typeof l) {
    case "string":
      return getProp(l, s);
    case "number":
      return getIndex(l, s);
    case "object":
      if (process.env.NODE_ENV !== "production") reqArray(l);
      for (var i = 0, n = l.length, o; i < n; ++i) {
        switch (typeof (o = l[i])) {
          case "string":
            s = getProp(o, s);break;
          case "number":
            s = getIndex(o, s);break;
          default:
            return composed(i, l)(Const, id, s, l[i - 1]);
        }
      }return s;
    default:
      if (process.env.NODE_ENV !== "production") reqFunction(l);
      return l.length === 4 ? l(Const, id, s, void 0) : l(s, void 0);
  }
}

function modifyComposed(os, xi2y, x, y) {
  if (process.env.NODE_ENV !== "production") reqArray(os);
  var n = os.length;
  var xs = Array(n);
  for (var i = 0, o; i < n; ++i) {
    xs[i] = x;
    switch (typeof (o = os[i])) {
      case "string":
        x = getProp(o, x);
        break;
      case "number":
        x = getIndex(o, x);
        break;
      default:
        x = composed(i, os)(Ident, xi2y || always(y), x, os[i - 1]);
        n = i;
        break;
    }
  }
  if (n === os.length) x = xi2y ? xi2y(x, os[n - 1]) : y;
  for (var _o; 0 <= --n;) {
    x = isString(_o = os[n]) ? setProp(_o, x, xs[n]) : setIndex(_o, x, xs[n]);
  }return x;
}

//

function getPick(template, x) {
  var r = void 0;
  for (var k in template) {
    var v = getU(template[k], x);
    if (void 0 !== v) {
      if (!r) r = {};
      r[k] = v;
    }
  }
  if (process.env.NODE_ENV !== "production") if (r) Object.freeze(r);
  return r;
}

var setPick = function setPick(template, x) {
  return function (value) {
    if (process.env.NODE_ENV !== "production") if (!(void 0 === value || value instanceof Object)) errorGiven("`pick` must be set with undefined or an object", value);
    for (var k in template) {
      x = setU(template[k], value && value[k], x);
    }return x;
  };
};

//

var toObject = function toObject(x) {
  return constructorOf(x) !== Object ? Object.assign({}, x) : x;
};

//

var branchOnMerge = function branchOnMerge(x, keys$$1) {
  return function (xs) {
    var o = {},
        n = keys$$1.length;
    for (var i = 0; i < n; ++i, xs = xs[1]) {
      var v = xs[0];
      o[keys$$1[i]] = void 0 !== v ? v : o;
    }
    var r = void 0;
    x = toObject(x);
    for (var k in x) {
      var _v = o[k];
      if (o !== _v) {
        o[k] = o;
        if (!r) r = {};
        r[k] = void 0 !== _v ? _v : x[k];
      }
    }
    for (var _i2 = 0; _i2 < n; ++_i2) {
      var _k = keys$$1[_i2];
      var _v2 = o[_k];
      if (o !== _v2) {
        if (!r) r = {};
        r[_k] = _v2;
      }
    }
    if (process.env.NODE_ENV !== "production") if (r) Object.freeze(r);
    return r;
  };
};

function branchOnLazy(keys$$1, vals, map, ap, z, delay, A, xi2yA, x, i) {
  if (i < keys$$1.length) {
    var k = keys$$1[i],
        v = x[k];
    return ap(map(cpair, vals ? vals[i](A, xi2yA, x[k], k) : xi2yA(v, k)), delay(function () {
      return branchOnLazy(keys$$1, vals, map, ap, z, delay, A, xi2yA, x, i + 1);
    }));
  } else {
    return z;
  }
}

var branchOn = function branchOn(keys$$1, vals) {
  return function (A, xi2yA, x, _) {
    if (process.env.NODE_ENV !== "production") reqApplicative(A, vals ? "branch" : "values");
    var map = A.map,
        ap = A.ap,
        of = A.of,
        delay = A.delay;

    var i = keys$$1.length;
    if (!i) return of(object0ToUndefined(x));
    if (!(x instanceof Object)) x = object0;
    var xsA = of(0);
    if (delay) {
      xsA = branchOnLazy(keys$$1, vals, map, ap, xsA, delay, A, xi2yA, x, 0);
    } else {
      while (i--) {
        var k = keys$$1[i],
            v = x[k];
        xsA = ap(map(cpair, vals ? vals[i](A, xi2yA, v, k) : xi2yA(v, k)), xsA);
      }
    }
    return map(branchOnMerge(x, keys$$1), xsA);
  };
};

var replaced = function replaced(inn, out, x) {
  return acyclicEqualsU(x, inn) ? out : x;
};

function findIndex(xi2b, xs) {
  var n = xs.length;
  for (var i = 0; i < n; ++i) {
    if (xi2b(xs[i], i)) return i;
  }return n;
}

function findIndexHint(hint, xi2b, xs) {
  var n = xs.length;
  var u = hint.hint;
  if (n <= u) u = n - 1;
  if (u < 0) u = 0;
  var d = u - 1;
  for (; 0 <= d && u < n; ++u, --d) {
    if (xi2b(xs[u], hint)) return u;
    if (xi2b(xs[d], hint)) return d;
  }
  for (; u < n; ++u) {
    if (xi2b(xs[u], hint)) return u;
  }for (; 0 <= d; --d) {
    if (xi2b(xs[d], hint)) return d;
  }return n;
}

function partitionIntoIndex(xi2b, xs, ts, fs) {
  for (var i = 0, n = xs.length, x; i < n; ++i) {
    (xi2b(x = xs[i], i) ? ts : fs).push(x);
  }if (process.env.NODE_ENV !== "production") {
    Object.freeze(ts);
    Object.freeze(fs);
  }
}

var fromReader = function fromReader(wi2x) {
  return function (F, xi2yF, w, i) {
    return (0, F.map)(always(w), xi2yF(wi2x(w, i), i));
  };
};

//

function toFunction(o) {
  switch (typeof o) {
    case "string":
      return funProp(o);
    case "number":
      if (process.env.NODE_ENV !== "production") checkIndex(o);
      return funIndex(o);
    case "object":
      if (process.env.NODE_ENV !== "production") reqArray(o);
      return composed(0, o);
    default:
      if (process.env.NODE_ENV !== "production") reqFunction(o);
      return o.length === 4 ? o : fromReader(o);
  }
}

// Operations on optics

var modify = /*#__PURE__*/curry(function (o, xi2x, s) {
  switch (typeof o) {
    case "string":
      return setProp(o, xi2x(getProp(o, s), o), s);
    case "number":
      return setIndex(o, xi2x(getIndex(o, s), o), s);
    case "object":
      return modifyComposed(o, xi2x, s);
    default:
      if (process.env.NODE_ENV !== "production") reqFunction(o);
      return o.length === 4 ? o(Ident, xi2x, s, void 0) : (xi2x(o(s, void 0), void 0), s);
  }
});

var remove = /*#__PURE__*/curry(function (o, s) {
  return setU(o, void 0, s);
});

var set = /*#__PURE__*/curry(setU);

var traverse = /*#__PURE__*/curry(function (C, xMi2yC, t, s) {
  return run(t, C, xMi2yC, s);
});

// Sequencing

function seq() {
  var n = arguments.length,
      xMs = Array(n);
  for (var i = 0; i < n; ++i) {
    xMs[i] = toFunction(arguments[i]);
  }var loop = function loop(M, xi2xM, i, j) {
    return j === n ? M.of : function (x) {
      return (0, M.chain)(loop(M, xi2xM, i, j + 1), xMs[j](M, xi2xM, x, i));
    };
  };
  return function (M, xi2xM, x, i) {
    if (process.env.NODE_ENV !== "production") if (!M.chain) errorGiven("`seq` requires a monad", M, "Note that you can only `modify`, `remove`, `set`, and `traverse` a transform.");
    return loop(M, xi2xM, i, 0)(x);
  };
}

// Nesting

function compose() {
  var n = arguments.length;
  if (n < 2) {
    return n ? arguments[0] : identity;
  } else {
    var lenses = Array(n);
    while (n--) {
      lenses[n] = arguments[n];
    }return lenses;
  }
}

// Querying

var chain = /*#__PURE__*/curry(function (xi2yO, xO) {
  return [xO, choose(function (xM, i) {
    return void 0 !== xM ? xi2yO(xM, i) : zero;
  })];
});

var choice = function choice() {
  for (var _len = arguments.length, ls = Array(_len), _key = 0; _key < _len; _key++) {
    ls[_key] = arguments[_key];
  }

  return choose(function (x) {
    var l = ls[findIndex(function (l) {
      return void 0 !== getU(l, x);
    }, ls)];
    return void 0 !== l ? l : zero;
  });
};

var choose = function choose(xiM2o) {
  return function (C, xi2yC, x, i) {
    return run(xiM2o(x, i), C, xi2yC, x, i);
  };
};

var when = function when(p) {
  return function (C, xi2yC, x, i) {
    return p(x, i) ? xi2yC(x, i) : zero(C, xi2yC, x, i);
  };
};

var optional = /*#__PURE__*/when(isDefined);

function zero(C, xi2yC, x, i) {
  var of = C.of;
  return of ? of(x) : (0, C.map)(always(x), xi2yC(void 0, i));
}

// Recursing

function lazy(o2o) {
  var _memo = function memo(C, xi2yC, x, i) {
    return (_memo = toFunction(o2o(rec)))(C, xi2yC, x, i);
  };
  function rec(C, xi2yC, x, i) {
    return _memo(C, xi2yC, x, i);
  }
  return rec;
}

// Debugging

function log() {
  var _arguments = arguments;

  var show = curry(function (dir, x) {
    return console.log.apply(console, copyToFrom([], 0, _arguments, 0, _arguments.length).concat([dir, x])), x;
  });
  return iso(show("get"), show("set"));
}

// Operations on traversals

var concatAs = /*#__PURE__*/curryN(4, function (xMi2y, m) {
  var C = ConcatOf(m.concat, (0, m.empty)(), m.delay);
  return function (t, s) {
    return run(t, C, xMi2y, s);
  };
});

var concat = /*#__PURE__*/concatAs(id);

// Folds over traversals

var all = /*#__PURE__*/pipe2U(mkSelect(function (x) {
  return x ? U : T;
}), not);

var and = /*#__PURE__*/all(id);

var any = /*#__PURE__*/pipe2U(mkSelect(function (x) {
  return x ? T : U;
}), Boolean);

var collectAs = /*#__PURE__*/curry(function (xi2y, t, s) {
  return toArray(run(t, Collect, xi2y, s)) || array0;
});

var collect = /*#__PURE__*/collectAs(id);

var count = /*#__PURE__*/concatAs(function (x) {
  return void 0 !== x ? 1 : 0;
}, Sum);

var foldl = /*#__PURE__*/curry(function (f, r, t, s) {
  return fold(f, r, run(t, Collect, pair, s));
});

var foldr = /*#__PURE__*/curry(function (f, r, t, s) {
  var xs = collectAs(pair, t, s);
  for (var i = xs.length - 1; 0 <= i; --i) {
    var x = xs[i];
    r = f(r, x[0], x[1]);
  }
  return r;
});

var maximum = /*#__PURE__*/concat(Mum(function (x, y) {
  return x > y;
}));

var minimum = /*#__PURE__*/concat(Mum(function (x, y) {
  return x < y;
}));

var or = /*#__PURE__*/any(id);

var product = /*#__PURE__*/concatAs(unto(1), Monoid(function (y, x) {
  return x * y;
}, 1));

var selectAs = /*#__PURE__*/curry(mkSelect(function (v) {
  return void 0 !== v ? { v: v } : U;
}));

var select = /*#__PURE__*/selectAs(id);

var sum = /*#__PURE__*/concatAs(unto(0), Sum);

// Creating new traversals

function branch(template) {
  if (process.env.NODE_ENV !== "production") if (!isObject(template)) errorGiven("`branch` expects a plain Object template", template);
  var keys$$1 = [],
      vals = [];
  for (var k in template) {
    keys$$1.push(k);
    vals.push(toFunction(template[k]));
  }
  return branchOn(keys$$1, vals);
}

// Traversals and combinators

function elems(A, xi2yA, xs, _) {
  if (seemsArrayLike(xs)) {
    return A === Ident ? mapPartialIndexU(xi2yA, xs) : traversePartialIndex(A, xi2yA, xs);
  } else {
    if (process.env.NODE_ENV !== "production") reqApplicative(A, "elems");
    return (0, A.of)(xs);
  }
}

function values(A, xi2yA, xs, _) {
  if (xs instanceof Object) {
    return branchOn(keys(xs))(A, xi2yA, xs);
  } else {
    if (process.env.NODE_ENV !== "production") reqApplicative(A, "values");
    return (0, A.of)(xs);
  }
}

// Operations on lenses

function get(l, s) {
  return 1 < arguments.length ? getU(l, s) : function (s) {
    return getU(l, s);
  };
}

// Creating new lenses

var lens = /*#__PURE__*/curry(function (get, set) {
  return function (F, xi2yF, x, i) {
    return (0, F.map)(function (y) {
      return set(y, x, i);
    }, xi2yF(get(x, i), i));
  };
});

var setter = /*#__PURE__*/lens(id);

// Computing derived props

function augment(template) {
  if (process.env.NODE_ENV !== "production") if (!isObject(template)) errorGiven("`augment` expects a plain Object template", template);
  return lens(function (x) {
    x = dissocPartialU(0, x);
    if (x) for (var k in template) {
      x[k] = template[k](x);
    }if (process.env.NODE_ENV !== "production") if (x) Object.freeze(x);
    return x;
  }, function (y, x) {
    if (process.env.NODE_ENV !== "production") if (!(void 0 === y || y instanceof Object)) errorGiven("`augment` must be set with undefined or an object", y);
    y = toObject(y);
    if (!(x instanceof Object)) x = void 0;
    var z = void 0;
    function set(k, v) {
      if (!z) z = {};
      z[k] = v;
    }
    for (var k in y) {
      if (!hasU(k, template)) set(k, y[k]);else if (x && hasU(k, x)) set(k, x[k]);
    }
    if (process.env.NODE_ENV !== "production") if (z) Object.freeze(z);
    return z;
  });
}

// Enforcing invariants

function defaults(out) {
  var o2u = function o2u(x) {
    return replaced(out, void 0, x);
  };
  return function (F, xi2yF, x, i) {
    return (0, F.map)(o2u, xi2yF(void 0 !== x ? x : out, i));
  };
}

function define(v) {
  var untoV = unto(v);
  return function (F, xi2yF, x, i) {
    return (0, F.map)(untoV, xi2yF(void 0 !== x ? x : v, i));
  };
}

var normalize = function normalize(xi2x) {
  return function (F, xi2yF, x, i) {
    return (0, F.map)(function (x) {
      return void 0 !== x ? xi2x(x, i) : x;
    }, xi2yF(void 0 !== x ? xi2x(x, i) : x, i));
  };
};

var required = function required(inn) {
  return replace(inn, void 0);
};

var rewrite = function rewrite(yi2y) {
  return function (F, xi2yF, x, i) {
    return (0, F.map)(function (y) {
      return void 0 !== y ? yi2y(y, i) : y;
    }, xi2yF(x, i));
  };
};

// Lensing arrays

function append(F, xi2yF, xs, _) {
  var i = seemsArrayLike(xs) ? xs.length : 0;
  return (0, F.map)(function (x) {
    return setIndex(i, x, xs);
  }, xi2yF(void 0, i));
}

var filter = function filter(xi2b) {
  return function (F, xi2yF, xs, i) {
    var ts = void 0,
        fs = void 0;
    if (seemsArrayLike(xs)) partitionIntoIndex(xi2b, xs, ts = [], fs = []);
    return (0, F.map)(function (ts) {
      if (process.env.NODE_ENV !== "production") if (!(void 0 === ts || seemsArrayLike(ts))) errorGiven("`filter` must be set with undefined or an array-like object", ts);
      var tsN = ts ? ts.length : 0,
          fsN = fs ? fs.length : 0,
          n = tsN + fsN;
      if (n) return n === fsN ? fs : copyToFrom(copyToFrom(Array(n), 0, ts, 0, tsN), tsN, fs, 0, fsN);
    }, xi2yF(ts, i));
  };
};

var find = function find(xi2b) {
  return function (F, xi2yF, xs, _i) {
    var ys = seemsArrayLike(xs) ? xs : "",
        i = findIndex(xi2b, ys);
    return (0, F.map)(function (v) {
      return setIndex(i, v, ys);
    }, xi2yF(ys[i], i));
  };
};

var findHint = /*#__PURE__*/curry(function (xh2b, hint) {
  if (process.env.NODE_ENV !== "production") warn(findHint, "`findHint` is experimental and might be removed or changed before next major release.");
  return function (F, xi2yF, xs, _i) {
    var ys = seemsArrayLike(xs) ? xs : "",
        i = hint.hint = findIndexHint(hint, xh2b, ys);
    return (0, F.map)(function (v) {
      return setIndex(i, v, ys);
    }, xi2yF(ys[i], i));
  };
});

function findWith() {
  var lls = compose.apply(undefined, arguments);
  return [find(function (x) {
    return void 0 !== getU(lls, x);
  }), lls];
}

var index = process.env.NODE_ENV === "production" ? id : checkIndex;

var last = /*#__PURE__*/choose(function (maybeArray) {
  return seemsArrayLike(maybeArray) && maybeArray.length ? maybeArray.length - 1 : 0;
});

var slice = /*#__PURE__*/curry(function (begin, end) {
  return function (F, xsi2yF, xs, i) {
    var seems = seemsArrayLike(xs),
        xsN = seems && xs.length,
        b = sliceIndex(0, xsN, 0, begin),
        e = sliceIndex(b, xsN, xsN, end);
    return (0, F.map)(function (zs) {
      if (process.env.NODE_ENV !== "production") if (!(void 0 === zs || seemsArrayLike(zs))) errorGiven("`slice` must be set with undefined or an array-like object", zs);
      var zsN = zs ? zs.length : 0,
          bPzsN = b + zsN,
          n = xsN - e + bPzsN;
      return n ? copyToFrom(copyToFrom(copyToFrom(Array(n), 0, xs, 0, b), b, zs, 0, zsN), bPzsN, xs, e, xsN) : void 0;
    }, xsi2yF(seems ? copyToFrom(Array(Math.max(0, e - b)), 0, xs, b, e) : void 0, i));
  };
});

// Lensing objects

var prop = process.env.NODE_ENV === "production" ? id : function (x) {
  if (!isString(x)) errorGiven("`prop` expects a string", x);
  return x;
};

function props() {
  var n = arguments.length,
      template = {};
  for (var i = 0, k; i < n; ++i) {
    template[k = arguments[i]] = k;
  }return pick(template);
}

function removable() {
  for (var _len2 = arguments.length, ps = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    ps[_key2] = arguments[_key2];
  }

  function drop(y) {
    if (!(y instanceof Object)) return y;
    for (var i = 0, n = ps.length; i < n; ++i) {
      if (hasU(ps[i], y)) return y;
    }
  }
  return function (F, xi2yF, x, i) {
    return (0, F.map)(drop, xi2yF(x, i));
  };
}

// Providing defaults

var valueOr = function valueOr(v) {
  return function (_F, xi2yF, x, i) {
    return xi2yF(void 0 !== x && x !== null ? x : v, i);
  };
};

// Adapting to data

var orElse = /*#__PURE__*/curry(function (d, l) {
  return choose(function (x) {
    return void 0 !== getU(l, x) ? l : d;
  });
});

// Transforming data

function pick(template) {
  if (process.env.NODE_ENV !== "production") if (!isObject(template)) errorGiven("`pick` expects a plain Object template", template);
  return function (F, xi2yF, x, i) {
    return (0, F.map)(setPick(template, x), xi2yF(getPick(template, x), i));
  };
}

var replace = /*#__PURE__*/curry(function (inn, out) {
  var o2i = function o2i(x) {
    return replaced(out, inn, x);
  };
  return function (F, xi2yF, x, i) {
    return (0, F.map)(o2i, xi2yF(replaced(inn, out, x), i));
  };
});

// Operations on isomorphisms

var getInverse = /*#__PURE__*/arityN(2, setU);

// Creating new isomorphisms

var iso = /*#__PURE__*/curry(function (bwd, fwd) {
  return function (F, xi2yF, x, i) {
    return (0, F.map)(fwd, xi2yF(bwd(x), i));
  };
});

// Isomorphisms and combinators

var complement = /*#__PURE__*/iso(notPartial, notPartial);

var identity = function identity(_F, xi2yF, x, i) {
  return xi2yF(x, i);
};

var inverse = function inverse(iso) {
  return function (F, xi2yF, x, i) {
    return (0, F.map)(function (x) {
      return getU(iso, x);
    }, xi2yF(setU(iso, x), i));
  };
};

export { toFunction, modify, remove, set, traverse, seq, compose, chain, choice, choose, when, optional, zero, lazy, log, concatAs, concat, all, and, any, collectAs, collect, count, foldl, foldr, maximum, minimum, or, product, selectAs, select, sum, branch, elems, values, get, lens, setter, augment, defaults, define, normalize, required, rewrite, append, filter, find, findHint, findWith, index, last, slice, prop, props, removable, valueOr, orElse, pick, replace, getInverse, iso, complement, identity, inverse };
