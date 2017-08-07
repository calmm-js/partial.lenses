'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var I = require('infestines');

var dep = function dep(xs2xsyC) {
  return function (xsy) {
    return I.arityN(xsy.length, function () {
      for (var _len = arguments.length, xs = Array(_len), _key = 0; _key < _len; _key++) {
        xs[_key] = arguments[_key];
      }

      return xs2xsyC(xs)(xsy).apply(undefined, xs);
    });
  };
};

var fn = function fn(xsC, yC) {
  return function (xsy) {
    return I.arityN(xsy.length, function () {
      for (var _len2 = arguments.length, xs = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        xs[_key2] = arguments[_key2];
      }

      return yC(xsy.apply(null, xsC(xs)));
    });
  };
};

var res = function res(yC) {
  return fn(I.id, yC);
};

var args = function args(xsC) {
  return fn(xsC, I.id);
};

var nth = function nth(i, xC) {
  return function (xs) {
    var ys = xs.slice(0);
    ys[i] = xC(ys[i]);
    return ys;
  };
};

var par = function par(i, xC) {
  return args(nth(i, xC));
};



var ef = function ef(xE) {
  return function (x) {
    xE(x);
    return x;
  };
};

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

//

var pipeO = function pipeO(f, g) {
  return f ? I.pipe2U(f, g) : g;
};

var toStringPartial = function toStringPartial(x) {
  return void 0 !== x ? String(x) : "";
};

var not = function not(x) {
  return !x;
};
var lt = function lt(x, y) {
  return x < y;
};
var gt = function gt(x, y) {
  return x > y;
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
var unto0 = /*#__PURE__*/unto(0);

var notPartial = function notPartial(x) {
  return void 0 !== x ? !x : x;
};

var expect = function expect(p, f) {
  return function (x) {
    return p(x) ? f(x) : undefined;
  };
};

var freeze = function freeze(x) {
  return x && Object.freeze(x);
};

function deepFreeze(x) {
  if (Array.isArray(x)) {
    x.forEach(deepFreeze);
    freeze(x);
  } else if (I.isObject(x)) {
    for (var k in x) {
      deepFreeze(x[k]);
    }freeze(x);
  }
  return x;
}

//

var mapPartialIndexU = /*#__PURE__*/(process.env.NODE_ENV === "production" ? I.id : res(freeze))(function (xi2y, xs) {
  var n = xs.length,
      ys = Array(n);
  var j = 0;
  for (var i = 0, y; i < n; ++i) {
    if (void 0 !== (y = xi2y(xs[i], i))) ys[j++] = y;
  }if (j) {
    if (j < n) ys.length = j;
    return ys;
  }
});

var copyToFrom = /*#__PURE__*/(process.env.NODE_ENV === "production" ? I.id : function (fn$$1) {
  return function (ys, k, xs, i, j) {
    return ys.length === k + j - i ? freeze(fn$$1(ys, k, xs, i, j)) : fn$$1(ys, k, xs, i, j);
  };
})(function (ys, k, xs, i, j) {
  while (i < j) {
    ys[k++] = xs[i++];
  }return ys;
});

//

var Ident = { map: I.applyU, of: I.id, ap: I.applyU, chain: I.applyU };

var Const = { map: I.sndU };

function ConcatOf(ap, empty, delay) {
  var c = { map: I.sndU, ap: ap, of: I.always(empty) };
  if (delay) c.delay = delay;
  return c;
}

var Sum = /*#__PURE__*/ConcatOf(function (x, y) {
  return x + y;
}, 0);

var Mum = function Mum(ord) {
  return ConcatOf(function (y, x) {
    return void 0 !== x && (void 0 === y || ord(x, y)) ? x : y;
  });
};

var MumBy = function MumBy(ord) {
  return function (keyOf) {
    return ConcatOf(function (y, x) {
      var xk = x && keyOf(x[0], x[1]);
      if (void 0 === xk) return y;
      var yk = y && keyOf(y[0], y[1]);
      if (void 0 === yk) return x;
      return ord(xk, yk) ? x : y;
    });
  };
};

//

var traverseU = function traverseU(C, xi2yC, t, s) {
  return toFunction(t)(s, void 0, C, xi2yC);
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

function reqIndex(x) {
  if (!Number.isInteger(x) || x < 0) errorGiven("`index` expects a non-negative integer", x);
}

function reqFunction(o) {
  if (!(I.isFunction(o) && (o.length === 4 || o.length <= 2))) errorGiven(expectedOptic, o, opticIsEither);
}

function reqArray(o) {
  if (!Array.isArray(o)) errorGiven(expectedOptic, o, opticIsEither);
}

function reqOptic(o) {
  switch (typeof o) {
    case "string":
      break;
    case "number":
      reqIndex(o);break;
    case "object":
      reqArray(o);
      for (var i = 0, n = o.length; i < n; ++i) {
        reqOptic(o[i]);
      }break;
    default:
      reqFunction(o);break;
  }
}

//

var reqString = function reqString(msg) {
  return function (x) {
    if (!I.isString(x)) errorGiven(msg, x);
  };
};

var reqMaybeArray = function reqMaybeArray(msg) {
  return function (zs) {
    if (!(void 0 === zs || seemsArrayLike(zs))) errorGiven(msg, zs);
  };
};

//

var reqApplicative = function reqApplicative(name, arg) {
  return function (C) {
    if (!C.of) errorGiven("`" + name + (arg ? "(" + arg + ")" : "") + "` requires an applicative", C, "Note that you cannot `get` a traversal. Perhaps you wanted to `collect` it?");
  };
};

var reqMonad = function reqMonad(name) {
  return function (C) {
    if (!C.chain) errorGiven("`" + name + "` requires a monad", C, "Note that you can only `modify`, `remove`, `set`, and `traverse` a transform.");
  };
};

//

function Both(l, r) {
  this.l = l;this.r = r;
}

var isBoth = function isBoth(n) {
  return n.constructor === Both;
};

var both = function both(l, r) {
  return void 0 !== l ? void 0 !== r ? new Both(l, r) : l : r;
};

function pushTo(n, ys) {
  while (n && isBoth(n)) {
    var l = n.l;
    n = n.r;
    if (l && isBoth(l)) pushTo(l.r, pushTo(l.l, ys));else ys.push(l);
  }
  ys.push(n);
  return ys;
}

var toArray = /*#__PURE__*/(process.env.NODE_ENV === "production" ? I.id : res(freeze))(function (n) {
  if (void 0 !== n) return pushTo(n, []);
});

function foldRec(f, r, n) {
  while (isBoth(n)) {
    var l = n.l;
    n = n.r;
    r = isBoth(l) ? foldRec(f, foldRec(f, r, l.l), l.r) : f(r, l[0], l[1]);
  }
  return f(r, n[0], n[1]);
}

var fold = function fold(f, r, n) {
  return void 0 !== n ? foldRec(f, r, n) : r;
};

var Collect = /*#__PURE__*/ConcatOf(both);

//

var U = I.object0;
var T = { v: true };

function force(x) {
  while (x.constructor === Function) {
    x = x();
  }return x;
}

function selectElems(xi2yA, xs) {
  for (var i = 0, n = xs.length, x; i < n; ++i) {
    x = force(xi2yA(xs[i], i));
    if (U !== x) return x;
  }
  return U;
}

var Select = /*#__PURE__*/ConcatOf(function (l, r) {
  return void 0 !== (l = force(l)).v ? l : r;
}, U, I.id);

var mkSelect = function mkSelect(toS) {
  return function (xi2yM, t, s) {
    return force(traverseU(Select, pipeO(xi2yM, toS), t, s)).v;
  };
};

var selectAny = /*#__PURE__*/mkSelect(function (x) {
  return x ? T : U;
});

var mkTraverse = function mkTraverse(after, toC) {
  return I.curryN(4, function (xi2yC, m) {
    return m = toC(m), function (t, s) {
      return after(traverseU(m, xi2yC, t, s));
    };
  });
};

//

var cons = function cons(h) {
  return function (t) {
    return void 0 !== h ? [h, t] : t;
  };
};
var consTo = /*#__PURE__*/(process.env.NODE_ENV === "production" ? I.id : res(freeze))(function (n) {
  if (cons !== n) {
    var xs = [];
    do {
      xs.push(n[0]);
      n = n[1];
    } while (cons !== n);
    return xs;
  }
});

var traversePartialIndexLazy = function traversePartialIndexLazy(map, ap, z, delay, xi2yA, xs, i, n) {
  return i < n ? ap(map(cons, xi2yA(xs[i], i)), delay(function () {
    return traversePartialIndexLazy(map, ap, z, delay, xi2yA, xs, i + 1, n);
  })) : z;
};

var traversePartialIndex = /*#__PURE__*/(process.env.NODE_ENV === "production" ? I.id : par(0, ef(reqApplicative("elems"))))(function (A, xi2yA, xs) {
  var map = A.map,
      ap = A.ap,
      of = A.of,
      delay = A.delay;

  var xsA = of(cons),
      i = xs.length;
  if (delay) xsA = traversePartialIndexLazy(map, ap, xsA, delay, xi2yA, xs, 0, i);else while (i--) {
    xsA = ap(map(cons, xi2yA(xs[i], i)), xsA);
  }return map(consTo, xsA);
});

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
    return function (x, _i, F, xi2yF) {
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

var setProp = /*#__PURE__*/(process.env.NODE_ENV === "production" ? I.id : res(freeze))(function (k, v, o) {
  return void 0 !== v ? I.assocPartialU(k, v, o) : I.dissocPartialU(k, o);
});

var funProp = /*#__PURE__*/lensFrom(getProp, setProp);

//

var getIndex = function getIndex(i, xs) {
  return seemsArrayLike(xs) ? xs[i] : void 0;
};

var setIndex = /*#__PURE__*/(process.env.NODE_ENV === "production" ? I.id : fn(nth(0, ef(reqIndex)), freeze))(function (i, x, xs) {
  if (!seemsArrayLike(xs)) xs = "";
  var n = xs.length;
  if (void 0 !== x) {
    var m = Math.max(i + 1, n),
        ys = Array(m);
    for (var j = 0; j < m; ++j) {
      ys[j] = xs[j];
    }ys[i] = x;
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
        }return _ys;
      }
    }
  }
});

var funIndex = /*#__PURE__*/lensFrom(getIndex, setIndex);

//

var close = function close(o, F, xi2yF) {
  return function (x, i) {
    return o(x, i, F, xi2yF);
  };
};

function composed(oi0, os) {
  var n = os.length - oi0;
  if (n < 2) {
    return n ? toFunction(os[oi0]) : identity;
  } else {
    var fs = Array(n);
    for (var i = 0; i < n; ++i) {
      fs[i] = toFunction(os[i + oi0]);
    }return function (x, i, F, xi2yF) {
      var k = n;
      while (--k) {
        xi2yF = close(fs[k], F, xi2yF);
      }return fs[0](x, i, F, xi2yF);
    };
  }
}

var setU = /*#__PURE__*/(process.env.NODE_ENV === "production" ? I.id : par(0, ef(reqOptic)))(function (o, x, s) {
  switch (typeof o) {
    case "string":
      return setProp(o, x, s);
    case "number":
      return setIndex(o, x, s);
    case "object":
      return modifyComposed(o, 0, s, x);
    default:
      return o.length === 4 ? o(s, void 0, Ident, I.always(x)) : s;
  }
});

var modifyU = /*#__PURE__*/(process.env.NODE_ENV === "production" ? I.id : par(0, ef(reqOptic)))(function (o, xi2x, s) {
  switch (typeof o) {
    case "string":
      return setProp(o, xi2x(getProp(o, s), o), s);
    case "number":
      return setIndex(o, xi2x(getIndex(o, s), o), s);
    case "object":
      return modifyComposed(o, xi2x, s);
    default:
      return o.length === 4 ? o(s, void 0, Ident, xi2x) : (xi2x(o(s, void 0), void 0), s);
  }
});

function makeIx(i) {
  var ix = function ix(s, j) {
    return ix.v = j, s;
  };
  ix.v = i;
  return ix;
}

function getNestedU(l, s, j, ix) {
  for (var n = l.length, o; j < n; ++j) {
    switch (typeof (o = l[j])) {
      case "string":
        s = getProp(ix.v = o, s);
        break;
      case "number":
        s = getIndex(ix.v = o, s);
        break;
      case "object":
        s = getNestedU(o, s, 0, ix);
        break;
      default:
        s = o(s, ix.v, Const, ix);
    }
  }return s;
}

var getU = /*#__PURE__*/(process.env.NODE_ENV === "production" ? I.id : par(0, ef(reqOptic)))(function (l, s) {
  switch (typeof l) {
    case "string":
      return getProp(l, s);
    case "number":
      return getIndex(l, s);
    case "object":
      for (var i = 0, n = l.length, o; i < n; ++i) {
        switch (typeof (o = l[i])) {
          case "string":
            s = getProp(o, s);break;
          case "number":
            s = getIndex(o, s);break;
          default:
            return getNestedU(l, s, i, makeIx(l[i - 1]));
        }
      }return s;
    default:
      return l(s, void 0, Const, I.id);
  }
});

function modifyComposed(os, xi2y, x, y) {
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
        x = composed(i, os)(x, os[i - 1], Ident, xi2y || I.always(y));
        n = i;
        break;
    }
  }
  if (n === os.length) x = xi2y ? xi2y(x, os[n - 1]) : y;
  for (var _o; 0 <= --n;) {
    x = I.isString(_o = os[n]) ? setProp(_o, x, xs[n]) : setIndex(_o, x, xs[n]);
  }return x;
}

//

var lensU = function lensU(get, set) {
  return function (x, i, F, xi2yF) {
    return (0, F.map)(function (y) {
      return set(y, x, i);
    }, xi2yF(get(x, i), i));
  };
};

var isoU = function isoU(bwd, fwd) {
  return function (x, i, F, xi2yF) {
    return (0, F.map)(fwd, xi2yF(bwd(x), i));
  };
};

//

var getPick = /*#__PURE__*/(process.env.NODE_ENV === "production" ? I.id : res(freeze))(function (template, x) {
  var r = void 0;
  for (var k in template) {
    var t = template[k];
    var v = I.isObject(t) ? getPick(t, x) : getU(t, x);
    if (void 0 !== v) {
      if (!r) r = {};
      r[k] = v;
    }
  }
  return r;
});

var reqTemplate = function reqTemplate(name) {
  return function (template) {
    if (!I.isObject(template)) errorGiven("`" + name + "` expects a plain Object template", template);
  };
};

var reqObject = function reqObject(msg) {
  return function (value) {
    if (!(void 0 === value || value instanceof Object)) errorGiven(msg, value);
  };
};

var setPick = /*#__PURE__*/(process.env.NODE_ENV === "production" ? I.id : par(1, ef(reqObject("`pick` must be set with undefined or an object"))))(function (template, value, x) {
  for (var k in template) {
    var v = value && value[k];
    var t = template[k];
    x = I.isObject(t) ? setPick(t, v, x) : setU(t, v, x);
  }
  return x;
});

//

var toObject = function toObject(x) {
  return I.constructorOf(x) !== Object ? Object.assign({}, x) : x;
};

//

function mapPartialObjectU(xi2y, o, r) {
  for (var k in o) {
    var v = xi2y(o[k], k);
    if (void 0 !== v) {
      if (!r) r = {};
      r[k] = v;
    }
  }
  return r;
}

var branchOnMerge = /*#__PURE__*/(process.env.NODE_ENV === "production" ? I.id : res(res(freeze)))(function (x, keys$$1) {
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
    return r;
  };
});

function branchOnLazy(keys$$1, vals, map, ap, z, delay, A, xi2yA, x, i) {
  if (i < keys$$1.length) {
    var k = keys$$1[i],
        v = x[k];
    return ap(map(cpair, vals ? vals[i](v, k, A, xi2yA) : xi2yA(v, k)), delay(function () {
      return branchOnLazy(keys$$1, vals, map, ap, z, delay, A, xi2yA, x, i + 1);
    }));
  } else {
    return z;
  }
}

var branchOn = /*#__PURE__*/(process.env.NODE_ENV === "production" ? I.id : dep(function (_ref) {
  var _ref2 = _slicedToArray(_ref, 2),
      _keys = _ref2[0],
      vals = _ref2[1];

  return res(par(2, ef(reqApplicative(vals ? "branch" : "values"))));
}))(function (keys$$1, vals) {
  return function (x, _i, A, xi2yA) {
    var map = A.map,
        ap = A.ap,
        of = A.of,
        delay = A.delay;

    var i = keys$$1.length;
    if (!i) return of(object0ToUndefined(x));
    if (!(x instanceof Object)) x = I.object0;
    var xsA = of(cpair);
    if (delay) {
      xsA = branchOnLazy(keys$$1, vals, map, ap, xsA, delay, A, xi2yA, x, 0);
    } else {
      while (i--) {
        var k = keys$$1[i],
            v = x[k];
        xsA = ap(map(cpair, vals ? vals[i](v, k, A, xi2yA) : xi2yA(v, k)), xsA);
      }
    }
    return map(branchOnMerge(x, keys$$1), xsA);
  };
});

var replaced = function replaced(inn, out, x) {
  return I.acyclicEqualsU(x, inn) ? out : x;
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

var partitionIntoIndex = /*#__PURE__*/(process.env.NODE_ENV === "production" ? I.id : dep(function (_ref3) {
  var _ref4 = _slicedToArray(_ref3, 4),
      _xi2b = _ref4[0],
      _xs = _ref4[1],
      ts = _ref4[2],
      fs = _ref4[3];

  return res(ef(function () {
    freeze(ts);freeze(fs);
  }));
}))(function (xi2b, xs, ts, fs) {
  for (var i = 0, n = xs.length, x; i < n; ++i) {
    (xi2b(x = xs[i], i) ? ts : fs).push(x);
  }
});

var fromReader = function fromReader(wi2x) {
  return function (w, i, F, xi2yF) {
    return (0, F.map)(I.always(w), xi2yF(wi2x(w, i), i));
  };
};

//

var reValue = function reValue(m) {
  return m[0];
};
var reIndex = function reIndex(m) {
  return m.index;
};

function reNext(m, re) {
  var lastIndex = re.lastIndex;
  re.lastIndex = reIndex(m) + m[0].length;
  var n = re.exec(m.input);
  re.lastIndex = lastIndex;
  if (n) {
    if (n[0]) return n;
    if (process.env.NODE_ENV !== "production") warn(reNext, "`matches(" + re + ")` traversal terminated at index " + reIndex(n) + " in " + JSON.stringify(n.input) + " due to empty match.");
  }
}

//

var iterCollect = function iterCollect(s) {
  return function (x) {
    return function (xs) {
      return [s, x, xs];
    };
  };
};

var iterLazy = function iterLazy(map, ap, of, delay, xi2yA, t, s) {
  return (s = reNext(s, t)) ? ap(ap(map(iterCollect, of(s)), xi2yA(reValue(s), reIndex(s))), delay(function () {
    return iterLazy(map, ap, of, delay, xi2yA, t, s);
  })) : of(iterCollect);
};

function iterEager(map, ap, of, _, xi2yA, t, s) {
  var ss = [];
  while (s = reNext(s, t)) {
    ss.push(s);
  }var i = ss.length;
  var r = of(iterCollect);
  while (i--) {
    s = ss[i];
    r = ap(ap(map(iterCollect, of(s)), xi2yA(reValue(s), reIndex(s))), r);
  }
  return r;
}

//

var matchesJoin = function matchesJoin(input) {
  return function (matches) {
    var result = "";
    var lastIndex = 0;
    while (iterCollect !== matches) {
      var m = matches[0],
          i = reIndex(m);
      result += input.slice(lastIndex, i);
      var s = matches[1];
      if (void 0 !== s) result += s;
      lastIndex = i + m[0].length;
      matches = matches[2];
    }
    result += input.slice(lastIndex);
    return result || void 0;
  };
};

//

var ifteU = function ifteU(c, t, e) {
  return function (x, i, C, xi2yC) {
    return (c(x, i) ? t : e)(x, i, C, xi2yC);
  };
};

var orElseU = function orElseU(back, prim) {
  return prim = toFunction(prim), back = toFunction(back), function (x, i, C, xi2yC) {
    return (isDefined$1(prim, x) ? prim : back)(x, i, C, xi2yC);
  };
};

function zeroOp(y, i, C, xi2yC, x) {
  var of = C.of;
  return of ? of(y) : (0, C.map)(I.always(y), xi2yC(x, i));
}

//

var pickInAux = function pickInAux(t, k) {
  return [k, pickIn(t)];
};

// Internals

var toFunction = /*#__PURE__*/(process.env.NODE_ENV === "production" ? I.id : par(0, ef(reqOptic)))(function (o) {
  switch (typeof o) {
    case "string":
      return funProp(o);
    case "number":
      return funIndex(o);
    case "object":
      return composed(0, o);
    default:
      return o.length === 4 ? o : fromReader(o);
  }
});

// Operations on optics

var assign = /*#__PURE__*/I.curry(function (o, x, s) {
  return setU([o, propsOf(x)], x, s);
});

var modify = /*#__PURE__*/I.curry(modifyU);

var remove = /*#__PURE__*/I.curry(function (o, s) {
  return setU(o, void 0, s);
});

var set = /*#__PURE__*/I.curry(setU);

var transform = /*#__PURE__*/I.curry(function (o, s) {
  return modifyU(o, I.id, s);
});

var traverse = /*#__PURE__*/I.curry(traverseU);

// Nesting

function compose() {
  var n = arguments.length;
  if (n < 2) {
    return n ? arguments[0] : identity;
  } else {
    var os = Array(n);
    while (n--) {
      os[n] = arguments[n];
    }return os;
  }
}

// Recursing

function lazy(o2o) {
  var _memo = function memo(x, i, C, xi2yC) {
    return (_memo = toFunction(o2o(rec)))(x, i, C, xi2yC);
  };
  function rec(x, i, C, xi2yC) {
    return _memo(x, i, C, xi2yC);
  }
  return rec;
}

// Adapting

var choices = function choices(o) {
  for (var _len = arguments.length, os = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    os[_key - 1] = arguments[_key];
  }

  return os.length ? orElseU(os.reduceRight(orElseU), o) : o;
};

var choose = function choose(xiM2o) {
  return function (x, i, C, xi2yC) {
    return toFunction(xiM2o(x, i))(x, i, C, xi2yC);
  };
};

function iftes(_c, _t) {
  var n = arguments.length;
  var r = toFunction(n & 1 ? arguments[--n] : zero);
  while (0 <= (n -= 2)) {
    r = ifteU(arguments[n], toFunction(arguments[n + 1]), r);
  }return r;
}

var orElse = /*#__PURE__*/I.curry(orElseU);

// Querying

var chain = /*#__PURE__*/I.curry(function (xi2yO, xO) {
  return [xO, choose(function (xM, i) {
    return void 0 !== xM ? xi2yO(xM, i) : zero;
  })];
});

var choice = function choice() {
  for (var _len2 = arguments.length, os = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    os[_key2] = arguments[_key2];
  }

  return os.reduceRight(orElseU, zero);
};

var when = function when(p) {
  return function (x, i, C, xi2yC) {
    return p(x, i) ? xi2yC(x, i) : zeroOp(x, i, C, xi2yC);
  };
};

var optional = /*#__PURE__*/when(I.isDefined);

var zero = function zero(x, i, C, xi2yC) {
  return zeroOp(x, i, C, xi2yC);
};

// Caching

function cache(o) {
  if (process.env.NODE_ENV !== "production") warn(cache, "`L.cache` is experimental and might be removed or changed before next major release.");
  var map = arguments[1] || new Map();
  var C_ = void 0,
      xi2yC_ = void 0;
  o = toFunction(o);
  return function (x, i, C, xi2yC) {
    var entry = map.get(i);
    entry || map.set(i, entry = [zeroOp]);
    return I.identicalU(entry[0], x) && xi2yC_ === xi2yC && C_ === C ? entry[1] : entry[1] = o(entry[0] = x, i, C_ = C, xi2yC_ = xi2yC);
  };
}

// Transforming

var assignOp = function assignOp(x) {
  return [propsOf(x), setOp(x)];
};

var modifyOp = function modifyOp(xi2y) {
  return function (x, i, C, xi2yC) {
    return zeroOp(x = xi2y(x, i), i, C, xi2yC, x);
  };
};

var setOp = function setOp(y) {
  return function (_x, i, C, xi2yC) {
    return zeroOp(y, i, C, xi2yC, y);
  };
};

var removeOp = /*#__PURE__*/setOp();

// Debugging

function log() {
  var _arguments = arguments;

  var show = I.curry(function (dir, x) {
    return console.log.apply(console, copyToFrom([], 0, _arguments, 0, _arguments.length).concat([dir, x])), x;
  });
  return isoU(show("get"), show("set"));
}

// Sequencing

var seq = /*#__PURE__*/(process.env.NODE_ENV === "production" ? I.id : function (fn$$1) {
  return function () {
    return par(2, ef(reqMonad("seq")))(fn$$1.apply(undefined, arguments));
  };
})(function () {
  var n = arguments.length,
      xMs = Array(n);
  for (var i = 0; i < n; ++i) {
    xMs[i] = toFunction(arguments[i]);
  }function loop(M, xi2xM, i, j) {
    return j === n ? M.of : function (x) {
      return (0, M.chain)(loop(M, xi2xM, i, j + 1), xMs[j](x, i, M, xi2xM));
    };
  }
  return function (x, i, M, xi2xM) {
    return loop(M, xi2xM, i, 0)(x);
  };
});

// Creating new traversals

var branch = /*#__PURE__*/(process.env.NODE_ENV === "production" ? I.id : par(0, ef(reqTemplate("branch"))))(function (template) {
  var keys$$1 = [],
      vals = [];
  for (var k in template) {
    keys$$1.push(k);
    var t = template[k];
    vals.push(I.isObject(t) ? branch(t) : toFunction(t));
  }
  return branchOn(keys$$1, vals);
});

// Traversals and combinators

var elems = /*#__PURE__*/(process.env.NODE_ENV === "production" ? I.id : par(2, ef(reqApplicative("elems"))))(function (xs, _i, A, xi2yA) {
  if (seemsArrayLike(xs)) {
    return A === Ident ? mapPartialIndexU(xi2yA, xs) : A === Select ? selectElems(xi2yA, xs) : traversePartialIndex(A, xi2yA, xs);
  } else {
    return (0, A.of)(xs);
  }
});

var flatten =
/*#__PURE__*/lazy(function (rec) {
  return iftes(Array.isArray, [elems, rec], identity);
});

var values = /*#__PURE__*/(process.env.NODE_ENV === "production" ? I.id : par(2, ef(reqApplicative("values"))))(function (xs, _i, A, xi2yA) {
  if (xs instanceof Object) {
    return A === Ident ? mapPartialObjectU(xi2yA, toObject(xs)) : branchOn(I.keys(xs), void 0)(xs, void 0, A, xi2yA);
  } else {
    return (0, A.of)(xs);
  }
});

var matches = /*#__PURE__*/(process.env.NODE_ENV === "production" ? I.id : dep(function (_ref5) {
  var _ref6 = _slicedToArray(_ref5, 1),
      re = _ref6[0];

  return re.global ? res(par(2, ef(reqApplicative("matches", re)))) : I.id;
}))(function (re) {
  return function (x, _i, C, xi2yC) {
    if (I.isString(x)) {
      var map = C.map;

      if (re.global) {
        var ap = C.ap,
            of = C.of,
            delay = C.delay;

        var m0 = [""];
        m0.input = x;
        m0.index = 0;
        return map(matchesJoin(x), (delay ? iterLazy : iterEager)(map, ap, of, delay, xi2yC, re, m0));
      } else {
        var m = x.match(re);
        if (m) return map(function (y) {
          return x.replace(re, void 0 !== y ? y : "") || void 0;
        }, xi2yC(m[0], reIndex(m)));
      }
    }
    return zeroOp(x, void 0, C, xi2yC);
  };
});

// Folds over traversals

var all = /*#__PURE__*/I.pipe2U(mkSelect(function (x) {
  return x ? U : T;
}), not);

var and = /*#__PURE__*/all();

var any = /*#__PURE__*/I.pipe2U(selectAny, Boolean);

var collectAs = /*#__PURE__*/I.curry(function (xi2y, t, s) {
  return toArray(traverseU(Collect, xi2y, t, s)) || I.array0;
});

var collect = /*#__PURE__*/collectAs(I.id);

var concatAs =
/*#__PURE__*/mkTraverse(I.id, function (m) {
  return ConcatOf(m.concat, (0, m.empty)(), m.delay);
});

var concat = /*#__PURE__*/concatAs(I.id);

var countIf = /*#__PURE__*/I.curry(function (p, t, s) {
  return traverseU(Sum, function (x, i) {
    return p(x, i) ? 1 : 0;
  }, t, s);
});

var count = /*#__PURE__*/countIf(I.isDefined);

var foldl = /*#__PURE__*/I.curry(function (f, r, t, s) {
  return fold(f, r, traverseU(Collect, pair, t, s));
});

var foldr = /*#__PURE__*/I.curry(function (f, r, t, s) {
  var xs = collectAs(pair, t, s);
  for (var i = xs.length - 1; 0 <= i; --i) {
    var x = xs[i];
    r = f(r, x[0], x[1]);
  }
  return r;
});

var isDefined$1 = /*#__PURE__*/I.pipe2U(mkSelect(function (x) {
  return void 0 !== x ? T : U;
}), Boolean)();

var isEmpty = /*#__PURE__*/I.pipe2U(mkSelect(I.always(T)), not)();

var joinAs = /*#__PURE__*/mkTraverse(toStringPartial, (process.env.NODE_ENV === "production" ? I.id : par(0, ef(reqString("`join` and `joinAs` expect a string delimiter"))))(function (d) {
  return ConcatOf(function (x, y) {
    return void 0 !== x ? void 0 !== y ? x + d + y : x : y;
  });
}));

var join = /*#__PURE__*/joinAs(I.id);

var maximumBy = /*#__PURE__*/mkTraverse(reValue, MumBy(gt))(pair);

var maximum = /*#__PURE__*/traverse(Mum(gt), I.id);

var meanAs = /*#__PURE__*/I.curry(function (xi2y, t, s) {
  return sumAs(pipeO(xi2y, unto0), t, s) / sumAs(pipeO(xi2y, I.isDefined), t, s);
});

var mean = /*#__PURE__*/meanAs();

var minimumBy = /*#__PURE__*/mkTraverse(reValue, MumBy(lt))(pair);

var minimum = /*#__PURE__*/traverse(Mum(lt), I.id);

var none = /*#__PURE__*/I.pipe2U(selectAny, not);

var or = /*#__PURE__*/any();

var productAs = /*#__PURE__*/traverse(ConcatOf(function (x, y) {
  return x * y;
}, 1));

var product = /*#__PURE__*/productAs(unto(1));

var selectAs = /*#__PURE__*/I.curry(mkSelect(function (v) {
  return void 0 !== v ? { v: v } : U;
}));

var select = /*#__PURE__*/selectAs();

var sumAs = /*#__PURE__*/traverse(Sum);

var sum = /*#__PURE__*/sumAs(unto0);

// Operations on lenses

function get(l, s) {
  return 1 < arguments.length ? getU(l, s) : function (s) {
    return getU(l, s);
  };
}

// Creating new lenses

var lens = /*#__PURE__*/I.curry(lensU);

var setter = /*#__PURE__*/lens(I.id);

var foldTraversalLens = /*#__PURE__*/I.curry(function (fold, traversal) {
  return lensU(fold(traversal), set(traversal));
});

// Computing derived props

var augment = /*#__PURE__*/(process.env.NODE_ENV === "production" ? I.id : fn(nth(0, ef(reqTemplate("augment"))), function (lens) {
  return toFunction([isoU(I.id, freeze), lens, isoU(freeze, ef(reqObject("`augment` must be set with undefined or an object")))]);
}))(function (template) {
  return lensU(function (x) {
    x = I.dissocPartialU(0, x);
    if (x) for (var k in template) {
      x[k] = template[k](x);
    }return x;
  }, function (y, x) {
    y = toObject(y);
    if (!(x instanceof Object)) x = void 0;
    var z = void 0;
    for (var k in y) {
      if (!I.hasU(k, template)) {
        if (!z) z = {};
        z[k] = y[k];
      } else {
        if (x && I.hasU(k, x)) {
          if (!z) z = {};
          z[k] = x[k];
        }
      }
    }
    return z;
  });
});

// Enforcing invariants

function defaults(out) {
  function o2u(x) {
    return replaced(out, void 0, x);
  }
  return function (x, i, F, xi2yF) {
    return (0, F.map)(o2u, xi2yF(void 0 !== x ? x : out, i));
  };
}

function define(v) {
  var untoV = unto(v);
  return function (x, i, F, xi2yF) {
    return (0, F.map)(untoV, xi2yF(void 0 !== x ? x : v, i));
  };
}

var normalize = function normalize(xi2x) {
  return function (x, i, F, xi2yF) {
    return (0, F.map)(function (x) {
      return void 0 !== x ? xi2x(x, i) : x;
    }, xi2yF(void 0 !== x ? xi2x(x, i) : x, i));
  };
};

var required = function required(inn) {
  return replace(inn, void 0);
};

var rewrite = function rewrite(yi2y) {
  return function (x, i, F, xi2yF) {
    return (0, F.map)(function (y) {
      return void 0 !== y ? yi2y(y, i) : y;
    }, xi2yF(x, i));
  };
};

// Lensing arrays

function append(xs, _, F, xi2yF) {
  var i = seemsArrayLike(xs) ? xs.length : 0;
  return (0, F.map)(function (x) {
    return setIndex(i, x, xs);
  }, xi2yF(void 0, i));
}

var filter = /*#__PURE__*/(process.env.NODE_ENV === "production" ? I.id : res(function (lens) {
  return toFunction([lens, isoU(I.id, ef(reqMaybeArray("`filter` must be set with undefined or an array-like object")))]);
}))(function (xi2b) {
  return function (xs, i, F, xi2yF) {
    var ts = void 0,
        fs = void 0;
    if (seemsArrayLike(xs)) partitionIntoIndex(xi2b, xs, ts = [], fs = []);
    return (0, F.map)(function (ts) {
      var tsN = ts ? ts.length : 0,
          fsN = fs ? fs.length : 0,
          n = tsN + fsN;
      if (n) return n === fsN ? fs : copyToFrom(copyToFrom(Array(n), 0, ts, 0, tsN), tsN, fs, 0, fsN);
    }, xi2yF(ts, i));
  };
});

var find = function find(xi2b) {
  return function (xs, _i, F, xi2yF) {
    var ys = seemsArrayLike(xs) ? xs : "",
        i = findIndex(xi2b, ys);
    return (0, F.map)(function (v) {
      return setIndex(i, v, ys);
    }, xi2yF(ys[i], i));
  };
};

var findHint = /*#__PURE__*/I.curry(function (xh2b, hint) {
  return function (xs, _i, F, xi2yF) {
    var ys = seemsArrayLike(xs) ? xs : "",
        i = hint.hint = findIndexHint(hint, xh2b, ys);
    return (0, F.map)(function (v) {
      return setIndex(i, v, ys);
    }, xi2yF(ys[i], i));
  };
});

function findWith() {
  var oos = toFunction(compose.apply(undefined, arguments));
  return [find(isDefined$1(oos)), oos];
}

var index = process.env.NODE_ENV !== "production" ? ef(reqIndex) : I.id;

var last = /*#__PURE__*/choose(function (maybeArray) {
  return seemsArrayLike(maybeArray) && maybeArray.length ? maybeArray.length - 1 : 0;
});

var prefix = function prefix(n) {
  return slice(0, n);
};

var slice = /*#__PURE__*/(process.env.NODE_ENV === "production" ? I.curry : res(function (lens) {
  return toFunction([lens, isoU(I.id, ef(reqMaybeArray("`slice` must be set with undefined or an array-like object")))]);
}))(function (begin, end) {
  return function (xs, i, F, xsi2yF) {
    var seems = seemsArrayLike(xs),
        xsN = seems && xs.length,
        b = sliceIndex(0, xsN, 0, begin),
        e = sliceIndex(b, xsN, xsN, end);
    return (0, F.map)(function (zs) {
      var zsN = zs ? zs.length : 0,
          bPzsN = b + zsN,
          n = xsN - e + bPzsN;
      return n ? copyToFrom(copyToFrom(copyToFrom(Array(n), 0, xs, 0, b), b, zs, 0, zsN), bPzsN, xs, e, xsN) : void 0;
    }, xsi2yF(seems ? copyToFrom(Array(Math.max(0, e - b)), 0, xs, b, e) : void 0, i));
  };
});

var suffix = function suffix(n) {
  return slice(0 === n ? Infinity : !n ? 0 : -n, void 0);
};

// Lensing objects

var pickIn = function pickIn(t) {
  return I.isObject(t) ? pick(mapPartialObjectU(pickInAux, t)) : t;
};

var prop = process.env.NODE_ENV === "production" ? I.id : function (x) {
  if (!I.isString(x)) errorGiven("`prop` expects a string", x);
  return x;
};

function props() {
  var n = arguments.length,
      template = {};
  for (var i = 0, k; i < n; ++i) {
    template[k = arguments[i]] = k;
  }return pick(template);
}

var propsOf = function propsOf(o) {
  return props.apply(null, I.keys(o));
};

function removable() {
  for (var _len3 = arguments.length, ps = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
    ps[_key3] = arguments[_key3];
  }

  function drop(y) {
    if (!(y instanceof Object)) return y;
    for (var i = 0, n = ps.length; i < n; ++i) {
      if (I.hasU(ps[i], y)) return y;
    }
  }
  return function (x, i, F, xi2yF) {
    return (0, F.map)(drop, xi2yF(x, i));
  };
}

// Providing defaults

var valueOr = function valueOr(v) {
  return function (x, i, _F, xi2yF) {
    return xi2yF(x != null ? x : v, i);
  };
};

// Transforming data

var pick = /*#__PURE__*/(process.env.NODE_ENV === "production" ? I.id : par(0, ef(reqTemplate("pick"))))(function (template) {
  return function (x, i, F, xi2yF) {
    return (0, F.map)(function (v) {
      return setPick(template, v, x);
    }, xi2yF(getPick(template, x), i));
  };
});

var replace = /*#__PURE__*/I.curry(function (inn, out) {
  function o2i(x) {
    return replaced(out, inn, x);
  }
  return function (x, i, F, xi2yF) {
    return (0, F.map)(o2i, xi2yF(replaced(inn, out, x), i));
  };
});

// Operations on isomorphisms

var getInverse = /*#__PURE__*/I.curry(function (o, s) {
  return setU(o, s, void 0);
});

// Creating new isomorphisms

var iso = /*#__PURE__*/I.curry(isoU);

// Isomorphism combinators

var inverse = function inverse(iso) {
  return function (x, i, F, xi2yF) {
    return (0, F.map)(function (x) {
      return getU(iso, x);
    }, xi2yF(setU(iso, x, void 0), i));
  };
};

// Basic isomorphisms

var complement = /*#__PURE__*/isoU(notPartial, notPartial);

var identity = function identity(x, i, _F, xi2yF) {
  return xi2yF(x, i);
};

var is = function is(v) {
  return isoU(function (x) {
    return I.acyclicEqualsU(v, x);
  }, function (b) {
    return true === b ? v : void 0;
  });
};

// Standard isomorphisms

var uri =
/*#__PURE__*/isoU(expect(I.isString, decodeURI), expect(I.isString, encodeURI));

var uriComponent =
/*#__PURE__*/isoU(expect(I.isString, decodeURIComponent), expect(I.isString, encodeURIComponent));

var json = /*#__PURE__*/(process.env.NODE_ENV === "production" ? I.id : res(function (iso) {
  return toFunction([iso, isoU(deepFreeze, I.id)]);
}))(function (options) {
  var _ref7 = options || I.object0,
      reviver = _ref7.reviver,
      replacer = _ref7.replacer,
      space = _ref7.space;

  return isoU(expect(I.isString, function (text) {
    return JSON.parse(text, reviver);
  }), expect(I.isDefined, function (value) {
    return JSON.stringify(value, replacer, space);
  }));
});

// Auxiliary

var seemsArrayLike = function seemsArrayLike(x) {
  return x instanceof Object && (x = x.length, x === x >> 0 && 0 <= x) || I.isString(x);
};

exports.toFunction = toFunction;
exports.assign = assign;
exports.modify = modify;
exports.remove = remove;
exports.set = set;
exports.transform = transform;
exports.traverse = traverse;
exports.compose = compose;
exports.lazy = lazy;
exports.choices = choices;
exports.choose = choose;
exports.iftes = iftes;
exports.orElse = orElse;
exports.chain = chain;
exports.choice = choice;
exports.when = when;
exports.optional = optional;
exports.zero = zero;
exports.cache = cache;
exports.assignOp = assignOp;
exports.modifyOp = modifyOp;
exports.setOp = setOp;
exports.removeOp = removeOp;
exports.log = log;
exports.seq = seq;
exports.branch = branch;
exports.elems = elems;
exports.flatten = flatten;
exports.values = values;
exports.matches = matches;
exports.all = all;
exports.and = and;
exports.any = any;
exports.collectAs = collectAs;
exports.collect = collect;
exports.concatAs = concatAs;
exports.concat = concat;
exports.countIf = countIf;
exports.count = count;
exports.foldl = foldl;
exports.foldr = foldr;
exports.isDefined = isDefined$1;
exports.isEmpty = isEmpty;
exports.joinAs = joinAs;
exports.join = join;
exports.maximumBy = maximumBy;
exports.maximum = maximum;
exports.meanAs = meanAs;
exports.mean = mean;
exports.minimumBy = minimumBy;
exports.minimum = minimum;
exports.none = none;
exports.or = or;
exports.productAs = productAs;
exports.product = product;
exports.selectAs = selectAs;
exports.select = select;
exports.sumAs = sumAs;
exports.sum = sum;
exports.get = get;
exports.lens = lens;
exports.setter = setter;
exports.foldTraversalLens = foldTraversalLens;
exports.augment = augment;
exports.defaults = defaults;
exports.define = define;
exports.normalize = normalize;
exports.required = required;
exports.rewrite = rewrite;
exports.append = append;
exports.filter = filter;
exports.find = find;
exports.findHint = findHint;
exports.findWith = findWith;
exports.index = index;
exports.last = last;
exports.prefix = prefix;
exports.slice = slice;
exports.suffix = suffix;
exports.pickIn = pickIn;
exports.prop = prop;
exports.props = props;
exports.propsOf = propsOf;
exports.removable = removable;
exports.valueOr = valueOr;
exports.pick = pick;
exports.replace = replace;
exports.getInverse = getInverse;
exports.iso = iso;
exports.inverse = inverse;
exports.complement = complement;
exports.identity = identity;
exports.is = is;
exports.uri = uri;
exports.uriComponent = uriComponent;
exports.json = json;
exports.seemsArrayLike = seemsArrayLike;
