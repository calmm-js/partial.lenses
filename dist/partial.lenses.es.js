import { isArray, freeze, isObject, id, acyclicEqualsU, array0, object0, sndU, always, curry, isFunction, isString, curryN, assocPartialU, dissocPartialU, constructorOf, toObject, applyU, isDefined, keys, hasU, assign, arityN } from 'infestines';

var ltU = function ltU(x, y) {
  return x < y;
};
var gtU = function gtU(x, y) {
  return x > y;
};

var isInstanceOf = /*#__PURE__*/curry(function (Class, x) {
  return x instanceof Class;
});

var create = Object.create;
var protoless = function protoless(o) {
  return assign(create(null), o);
};
var protoless0 = /*#__PURE__*/freeze( /*#__PURE__*/protoless(object0));

var dep = function dep(xs2xsyC) {
  return function (xsy) {
    return arityN(xsy.length, function () {
      return xs2xsyC.apply(undefined, arguments)(xsy).apply(undefined, arguments);
    });
  };
};

var fn = function fn(xsC, yC) {
  return function (xsy) {
    return arityN(xsy.length, function () {
      for (var _len = arguments.length, xs = Array(_len), _key = 0; _key < _len; _key++) {
        xs[_key] = arguments[_key];
      }

      return yC(xsy.apply(null, xsC(xs)));
    });
  };
};

var res = function res(yC) {
  return fn(id, yC);
};

var args = function args(xsC) {
  return fn(xsC, id);
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

var and = function and() {
  for (var _len2 = arguments.length, xCs = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    xCs[_key2] = arguments[_key2];
  }

  return function (x) {
    for (var i = 0, n = xCs.length; i < n; ++i) {
      x = xCs[i](x);
    }return x;
  };
};

var or = function or() {
  for (var _len3 = arguments.length, xCs = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
    xCs[_key3] = arguments[_key3];
  }

  return function (x) {
    var es = null;
    for (var i = 0, n = xCs.length; i < n; ++i) {
      try {
        return xCs[i](x);
      } catch (e) {
        es = e;
      }
    }
    throw es;
  };
};

var ef = function ef(xE) {
  return function (x) {
    xE(x);
    return x;
  };
};

var tup = function tup() {
  for (var _len4 = arguments.length, xCs = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
    xCs[_key4] = arguments[_key4];
  }

  return function (xs) {
    if (xs.length !== xCs.length) throw Error('Expected array of ' + xCs.length + ' elements, but got ' + xs.length);
    return and.apply(null, xCs.map(function (xC, i) {
      return nth(i, xC);
    }))(xs);
  };
};

var arr = function arr(xC) {
  return function (xs) {
    return xs.map(xC);
  };
};

//

var toStringPartial = function toStringPartial(x) {
  return void 0 !== x ? String(x) : '';
};

var sliceIndex = function sliceIndex(m, l, d, i) {
  return void 0 !== i ? Math.min(Math.max(m, i < 0 ? l + i : i), l) : d;
};

var cpair = function cpair(xs) {
  return function (x) {
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

var singletonPartial = function singletonPartial(x) {
  return void 0 !== x ? [x] : x;
};

var expect = function expect(p, f) {
  return function (x) {
    return p(x) ? f(x) : void 0;
  };
};

function deepFreeze(x) {
  if (isArray(x)) {
    x.forEach(deepFreeze);
    freeze(x);
  } else if (isObject(x)) {
    for (var k in x) {
      deepFreeze(x[k]);
    }freeze(x);
  }
  return x;
}

function freezeArrayOfObjects(xs) {
  xs.forEach(freeze);
  return freeze(xs);
}

var isArrayOrPrimitive = function isArrayOrPrimitive(x) {
  return !(x instanceof Object) || isArray(x);
};

var rev = /*#__PURE__*/(process.env.NODE_ENV === 'production' ? id : res(freeze))(function (xs) {
  if (seemsArrayLike(xs)) {
    var n = xs.length;
    var ys = Array(n);
    var i = 0;
    while (n) {
      ys[i++] = xs[--n];
    }return ys;
  }
});

//

var isEmptyArrayStringOrObject = function isEmptyArrayStringOrObject(x) {
  return acyclicEqualsU(array0, x) || acyclicEqualsU(object0, x) || x === '';
};

var warnEmpty = function warnEmpty(o, v, f) {
  var msg = '`' + f + '(' + JSON.stringify(v) + ')` is likely unnecessary, because combinators no longer remove empty arrays, objects, or strings by default.  See CHANGELOG for more information.';
  return function (x) {
    if (acyclicEqualsU(v, x)) warn(o, msg);
    return x;
  };
};

//

var mapPartialIndexU = /*#__PURE__*/(process.env.NODE_ENV === 'production' ? id : res(freeze))(function (xi2y, xs) {
  var n = xs.length;
  var ys = Array(n);
  var j = 0;
  for (var i = 0, y; i < n; ++i) {
    if (void 0 !== (y = xi2y(xs[i], i))) ys[j++] = y;
  }if (j < n) ys.length = j;
  return ys;
});

var mapIfArrayLike = function mapIfArrayLike(xi2y, xs) {
  return seemsArrayLike(xs) ? mapPartialIndexU(xi2y, xs) : void 0;
};

var copyToFrom = /*#__PURE__*/(process.env.NODE_ENV === 'production' ? id : function (fn$$1) {
  return function (ys, k, xs, i, j) {
    return ys.length === k + j - i ? freeze(fn$$1(ys, k, xs, i, j)) : fn$$1(ys, k, xs, i, j);
  };
})(function (ys, k, xs, i, j) {
  while (i < j) {
    ys[k++] = xs[i++];
  }return ys;
});

//

function selectInArrayLike(xi2v, xs) {
  for (var i = 0, n = xs.length; i < n; ++i) {
    var v = xi2v(xs[i], i);
    if (void 0 !== v) return v;
  }
}

//

var Select = {
  map: sndU,
  of: function of() {},
  ap: function ap(l, r) {
    return void 0 !== l ? l : r;
  }
};

var ConcatOf = function ConcatOf(ap, empty) {
  return { map: sndU, ap: ap, of: always(empty) };
};

var Sum = /*#__PURE__*/ConcatOf(function (x, y) {
  return x + y;
}, 0);

var mumBy = function mumBy(ord) {
  return curry(function (xi2y, t, s) {
    var minX = void 0;
    var minY = void 0;
    traverseU(Select, function (x, i) {
      var y = xi2y(x, i);
      if (void 0 !== y && (void 0 === minY || ord(y, minY))) {
        minX = x;
        minY = y;
      }
    }, t, s);
    return minX;
  });
};

//

var traverseU = function traverseU(C, xi2yC, t, s) {
  return toFunction(t)(s, void 0, C, xi2yC);
};

//

var expectedOptic = 'Expecting an optic';
var opticIsEither = 'An optic can be either\n- a string,\n- a non-negative integer,\n- a quaternary optic function,\n- an ordinary unary or binary function, or\n- an array of optics.\nSee documentation of `toFunction` and `compose` for details.';
var header = 'partial.lenses: ';

function warn(f, m) {
  if (!f.warned) {
    f.warned = 1;
    console.warn(header + m);
  }
}

function errorGiven(m, o, e) {
  m = header + m + '.';
  e = e ? '\n' + e : '';
  console.error(m, 'Given:', o, e);
  throw Error(m + e);
}

function reqIndex(x) {
  if (!Number.isInteger(x) || x < 0) errorGiven('`index` expects a non-negative integer', x);
}

function reqFunction(o) {
  if (!(isFunction(o) && (o.length === 4 || o.length <= 2))) errorGiven(expectedOptic, o, opticIsEither);
}

function reqFn(x) {
  if (!isFunction(x)) errorGiven('Expected a function', x);
}

function reqArray(o) {
  if (!isArray(o)) errorGiven(expectedOptic, o, opticIsEither);
}

function reqOptic(o) {
  switch (typeof o) {
    case 'string':
      break;
    case 'number':
      reqIndex(o);
      break;
    case 'object':
      reqArray(o);
      for (var i = 0, n = o.length; i < n; ++i) {
        reqOptic(o[i]);
      }break;
    default:
      reqFunction(o);
      break;
  }
}

//

var reqString = function reqString(msg) {
  return function (x) {
    if (!isString(x)) errorGiven(msg, x);
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
    if (!C.of) errorGiven('`' + name + (arg ? '(' + arg + ')' : '') + '` requires an applicative', C, 'Note that you cannot `get` a traversal. Perhaps you wanted to `collect` it?');
  };
};

var reqMonad = function reqMonad(name) {
  return function (C) {
    if (!C.chain) errorGiven('`' + name + '` requires a monad', C, 'Note that you can only `modify`, `remove`, `set`, and `traverse` a transform.');
  };
};

//

var mkTraverse = function mkTraverse(after, toC) {
  return curryN(4, function (xi2yC, m) {
    return m = toC(m), function (t, s) {
      return after(traverseU(m, xi2yC, t, s));
    };
  });
};

//

var cons = function cons(t) {
  return function (h) {
    return void 0 !== h ? [h, t] : t;
  };
};
var consTo = /*#__PURE__*/(process.env.NODE_ENV === 'production' ? id : res(freeze))(function (n) {
  var xs = [];
  while (cons !== n) {
    xs.push(n[0]);
    n = n[1];
  }
  return xs.reverse();
});

function traversePartialIndex(A, xi2yA, xs) {
  var map = A.map,
      ap = A.ap;

  var xsA = A.of(cons);
  var n = xs.length;
  if (map === sndU) {
    for (var i = 0; i < n; ++i) {
      xsA = ap(xsA, xi2yA(xs[i], i));
    }return xsA;
  } else {
    for (var _i2 = 0; _i2 < n; ++_i2) {
      xsA = ap(map(cons, xsA), xi2yA(xs[_i2], _i2));
    }return map(consTo, xsA);
  }
}

//

var lensFrom = function lensFrom(get, set) {
  return function (i) {
    return function (x, _i, F, xi2yF) {
      return F.map(function (v) {
        return set(i, v, x);
      }, xi2yF(get(i, x), i));
    };
  };
};

//

var getProp = function getProp(k, o) {
  return o instanceof Object ? o[k] : void 0;
};

var setProp = /*#__PURE__*/(process.env.NODE_ENV === 'production' ? id : res(freeze))(function (k, v, o) {
  return void 0 !== v ? assocPartialU(k, v, o) : dissocPartialU(k, o) || object0;
});

var funProp = /*#__PURE__*/lensFrom(getProp, setProp);

//

var getIndex = function getIndex(i, xs) {
  return seemsArrayLike(xs) ? xs[i] : void 0;
};

var setIndex = /*#__PURE__*/(process.env.NODE_ENV === 'production' ? id : fn(nth(0, ef(reqIndex)), freeze))(function (i, x, xs) {
  if (!seemsArrayLike(xs)) xs = '';
  var n = xs.length;
  if (void 0 !== x) {
    var m = Math.max(i + 1, n);
    var ys = Array(m);
    for (var j = 0; j < m; ++j) {
      ys[j] = xs[j];
    }ys[i] = x;
    return ys;
  } else {
    if (n <= i) return copyToFrom(Array(n), 0, xs, 0, n);
    var _ys = Array(n - 1);
    for (var _j = 0; _j < i; ++_j) {
      _ys[_j] = xs[_j];
    }for (var _j2 = i + 1; _j2 < n; ++_j2) {
      _ys[_j2 - 1] = xs[_j2];
    }return _ys;
  }
});

var funIndex = /*#__PURE__*/lensFrom(getIndex, setIndex);

//

var composedMiddle = function composedMiddle(o, r) {
  return function (F, xi2yF) {
    return xi2yF = r(F, xi2yF), function (x, i) {
      return o(x, i, F, xi2yF);
    };
  };
};

function composed(oi0, os) {
  var n = os.length - oi0;
  if (n < 2) {
    return n ? toFunction(os[oi0]) : identity;
  } else {
    var _last = toFunction(os[oi0 + --n]);
    var r = function r(F, xi2yF) {
      return function (x, i) {
        return _last(x, i, F, xi2yF);
      };
    };
    while (--n) {
      r = composedMiddle(toFunction(os[oi0 + n]), r);
    }var _first = toFunction(os[oi0]);
    return function (x, i, F, xi2yF) {
      return _first(x, i, F, r(F, xi2yF));
    };
  }
}

var setU = /*#__PURE__*/(process.env.NODE_ENV === 'production' ? id : par(0, ef(reqOptic)))(function (o, x, s) {
  switch (typeof o) {
    case 'string':
      return setProp(o, x, s);
    case 'number':
      return setIndex(o, x, s);
    case 'object':
      return modifyComposed(o, 0, s, x);
    default:
      return o.length === 4 ? o(s, void 0, Identity, always(x)) : s;
  }
});

var modifyU = /*#__PURE__*/(process.env.NODE_ENV === 'production' ? id : par(0, ef(reqOptic)))(function (o, xi2x, s) {
  switch (typeof o) {
    case 'string':
      return setProp(o, xi2x(getProp(o, s), o), s);
    case 'number':
      return setIndex(o, xi2x(getIndex(o, s), o), s);
    case 'object':
      return modifyComposed(o, xi2x, s);
    default:
      return o.length === 4 ? o(s, void 0, Identity, xi2x) : (xi2x(o(s, void 0), void 0), s);
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
      case 'string':
        s = getProp(ix.v = o, s);
        break;
      case 'number':
        s = getIndex(ix.v = o, s);
        break;
      case 'object':
        s = getNestedU(o, s, 0, ix);
        break;
      default:
        s = o(s, ix.v, Constant, ix);
    }
  }return s;
}

var getU = /*#__PURE__*/(process.env.NODE_ENV === 'production' ? id : par(0, ef(reqOptic)))(function (l, s) {
  switch (typeof l) {
    case 'string':
      return getProp(l, s);
    case 'number':
      return getIndex(l, s);
    case 'object':
      for (var i = 0, n = l.length, o; i < n; ++i) {
        switch (typeof (o = l[i])) {
          case 'string':
            s = getProp(o, s);
            break;
          case 'number':
            s = getIndex(o, s);
            break;
          default:
            return getNestedU(l, s, i, makeIx(l[i - 1]));
        }
      }return s;
    default:
      return l(s, void 0, Constant, id);
  }
});

function modifyComposed(os, xi2y, x, y) {
  var n = os.length;
  var xs = Array(n);
  for (var i = 0, o; i < n; ++i) {
    xs[i] = x;
    switch (typeof (o = os[i])) {
      case 'string':
        x = getProp(o, x);
        break;
      case 'number':
        x = getIndex(o, x);
        break;
      default:
        x = composed(i, os)(x, os[i - 1], Identity, xi2y || always(y));
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

var lensU = function lensU(get, set) {
  return function (x, i, F, xi2yF) {
    return F.map(function (y) {
      return set(y, x, i);
    }, xi2yF(get(x, i), i));
  };
};

var isoU = function isoU(bwd, fwd) {
  return function (x, i, F, xi2yF) {
    return F.map(fwd, xi2yF(bwd(x), i));
  };
};

//

var getPick = /*#__PURE__*/(process.env.NODE_ENV === 'production' ? id : res(freeze))(function (template, x) {
  var r = void 0;
  for (var k in template) {
    var t = template[k];
    var v = isObject(t) ? getPick(t, x) : getU(t, x);
    if (void 0 !== v) {
      if (!r) r = {};
      r[k] = v;
    }
  }
  return r;
});

var reqTemplate = function reqTemplate(name) {
  return function (template) {
    if (!isObject(template)) errorGiven('`' + name + '` expects a plain Object template', template);
  };
};

var reqObject = function reqObject(msg) {
  return function (value) {
    if (!(void 0 === value || value instanceof Object)) errorGiven(msg, value);
  };
};

var setPick = /*#__PURE__*/(process.env.NODE_ENV === 'production' ? id : par(1, ef(reqObject('`pick` must be set with undefined or an object'))))(function (template, value, x) {
  for (var k in template) {
    var v = value && value[k];
    var t = template[k];
    x = isObject(t) ? setPick(t, v, x) : setU(t, v, x);
  }
  return x;
});

//

var toObject$1 = function toObject$$1(x) {
  return constructorOf(x) !== Object ? toObject(x) : x;
};

//

var identity = function identity(x, i, _F, xi2yF) {
  return xi2yF(x, i);
};

//

var branchAssemble = /*#__PURE__*/(process.env.NODE_ENV === 'production' ? id : res(res(freeze)))(function (ks) {
  return function (xs) {
    var r = {};
    var i = ks.length;
    while (i--) {
      var v = xs[0];
      if (void 0 !== v) {
        r[ks[i]] = v;
      }
      xs = xs[1];
    }
    return r;
  };
});

var branchOr1Level = function branchOr1Level(otherwise, k2o) {
  return function (x, _i, A, xi2yA) {
    var xO = x instanceof Object ? toObject$1(x) : object0;

    if (Identity === A) {
      var written = void 0;
      var r = {};
      for (var k in k2o) {
        written = 1;
        var y = k2o[k](xO[k], k, A, xi2yA);
        if (void 0 !== y) r[k] = y;
      }
      var t = written;
      for (var _k in xO) {
        if (void 0 === (t && k2o[_k])) {
          written = 1;
          var _y = otherwise(xO[_k], _k, A, xi2yA);
          if (void 0 !== _y) r[_k] = _y;
        }
      }
      return written ? r : x;
    } else if (Select === A) {
      for (var _k2 in k2o) {
        var _y2 = k2o[_k2](xO[_k2], _k2, A, xi2yA);
        if (void 0 !== _y2) return _y2;
      }
      for (var _k3 in xO) {
        if (void 0 === k2o[_k3]) {
          var _y3 = otherwise(xO[_k3], _k3, A, xi2yA);
          if (void 0 !== _y3) return _y3;
        }
      }
    } else {
      var map = A.map,
          ap = A.ap,
          of = A.of;

      var xsA = of(cpair);
      var ks = [];
      for (var _k4 in k2o) {
        ks.push(_k4);
        xsA = ap(map(cpair, xsA), k2o[_k4](xO[_k4], _k4, A, xi2yA));
      }
      var _t2 = ks.length ? true : void 0;
      for (var _k5 in xO) {
        if (void 0 === (_t2 && k2o[_k5])) {
          ks.push(_k5);
          xsA = ap(map(cpair, xsA), otherwise(xO[_k5], _k5, A, xi2yA));
        }
      }
      return ks.length ? map(branchAssemble(ks), xsA) : of(x);
    }
  };
};

function branchOrU(otherwise, template) {
  var k2o = create(null);
  for (var k in template) {
    var v = template[k];
    k2o[k] = isObject(v) ? branchOrU(otherwise, v) : toFunction(v);
  }
  return branchOr1Level(otherwise, k2o);
}

var replaced = function replaced(inn, out, x) {
  return acyclicEqualsU(x, inn) ? out : x;
};

function findIndexHint(hint, xi2b, xs) {
  var u = hint.hint;
  var n = xs.length;
  if (n <= u) u = n - 1;
  if (u < 0) u = 0;
  var d = u - 1;
  for (; 0 <= d && u < n; ++u, --d) {
    if (xi2b(xs[u], u, hint)) return u;
    if (xi2b(xs[d], d, hint)) return d;
  }
  for (; u < n; ++u) {
    if (xi2b(xs[u], u, hint)) return u;
  }for (; 0 <= d; --d) {
    if (xi2b(xs[d], d, hint)) return d;
  }return n;
}

var partitionIntoIndex = /*#__PURE__*/(process.env.NODE_ENV === 'production' ? id : dep(function (_xi2b, _xs, ts, fs) {
  return res(ef(function () {
    freeze(ts);
    freeze(fs);
  }));
}))(function (xi2b, xs, ts, fs) {
  for (var i = 0, n = xs.length, x; i < n; ++i) {
    (xi2b(x = xs[i], i) ? ts : fs).push(x);
  }
});

var fromReader = function fromReader(wi2x) {
  return function (w, i, F, xi2yF) {
    return F.map(always(w), xi2yF(wi2x(w, i), i));
  };
};

//

var reValue = function reValue(m) {
  return m[0];
};
var reIndex = function reIndex(m) {
  return m.index;
};

var reNext = /*#__PURE__*/(process.env.NODE_ENV === 'production' ? id : function (fn$$1) {
  return function (m, re) {
    var res$$1 = fn$$1(m, re);
    if ('' === res$$1) warn(reNext, '`matches(' + re + ')` traversal terminated due to empty match.  `matches` traversal shouldn\'t be used with regular expressions that can produce empty matches.');
    return res$$1;
  };
})(function (m, re) {
  var lastIndex = re.lastIndex;
  re.lastIndex = reIndex(m) + m[0].length;
  var n = re.exec(m.input);
  re.lastIndex = lastIndex;
  return n && n[0] && n;
});

//

var iterCollect = function iterCollect(s) {
  return function (xs) {
    return function (x) {
      return [s, x, xs];
    };
  };
};

var iterToArray = function iterToArray(xs) {
  var ys = [];
  while (iterCollect !== xs) {
    ys.push(xs[0], xs[1]);
    xs = xs[2];
  }
  return ys;
};

function iterSelect(xi2y, t, s) {
  while (s = reNext(s, t)) {
    var y = xi2y(reValue(s), reIndex(s));
    if (void 0 !== y) return y;
  }
}

function iterEager(map, ap, of, xi2yA, t, s) {
  var r = of(iterCollect);
  while (s = reNext(s, t)) {
    r = ap(ap(map(iterCollect, of(s)), r), xi2yA(reValue(s), reIndex(s)));
  }return r;
}

//

var keyed = /*#__PURE__*/isoU( /*#__PURE__*/expect( /*#__PURE__*/isInstanceOf(Object), /*#__PURE__*/(process.env.NODE_ENV === 'production' ? id : res(freezeArrayOfObjects))(function (x) {
  x = toObject$1(x);
  var es = [];
  for (var key in x) {
    es.push([key, x[key]]);
  }return es;
})), /*#__PURE__*/expect(isArray, /*#__PURE__*/(process.env.NODE_ENV === 'production' ? id : res(freeze))(function (es) {
  var o = {};
  for (var i = 0, n = es.length; i < n; ++i) {
    var entry = es[i];
    if (entry.length === 2) o[entry[0]] = entry[1];
  }
  return o;
})));

//

var matchesJoin = function matchesJoin(input) {
  return function (matchesIn) {
    var result = '';
    var lastIndex = 0;
    var matches = iterToArray(matchesIn);
    var n = matches.length;
    for (var j = n - 2; j !== -2; j += -2) {
      var m = matches[j];
      var i = reIndex(m);
      result += input.slice(lastIndex, i);
      var s = matches[j + 1];
      if (void 0 !== s) result += s;
      lastIndex = i + m[0].length;
    }

    result += input.slice(lastIndex);
    return result;
  };
};

//

var eitherU = function eitherU(t, e) {
  return function (c) {
    return function (x, i, C, xi2yC) {
      return (c(x, i) ? t : e)(x, i, C, xi2yC);
    };
  };
};

var orElseU = function orElseU(back, prim) {
  return prim = toFunction(prim), back = toFunction(back), function (x, i, C, xi2yC) {
    return (isDefined$1(prim, x) ? prim : back)(x, i, C, xi2yC);
  };
};

function zeroOp(y, i, C, xi2yC, x) {
  var of = C.of;
  return of ? of(y) : C.map(always(y), xi2yC(x, i));
}

//

var elemsI = function elemsI(xs, _i, A, xi2yA) {
  return A === Identity ? mapPartialIndexU(xi2yA, xs) : A === Select ? selectInArrayLike(xi2yA, xs) : traversePartialIndex(A, xi2yA, xs);
};

//

var seq2U = function seq2U(l, r) {
  return function (x, i, M, xi2yM) {
    return M.chain(function (x) {
      return r(x, i, M, xi2yM);
    }, l(x, i, M, xi2yM));
  };
};

//

var pickInAux = function pickInAux(t, k) {
  return [k, pickIn(t)];
};

//

var condOfDefault = /*#__PURE__*/always(zeroOp);
var condOfCase = function condOfCase(p, o, r) {
  return function (y, j) {
    return p(y, j) ? o : r(y, j);
  };
};

// Auxiliary

var seemsArrayLike = function seemsArrayLike(x) {
  return x instanceof Object && (x = x.length, x === x >> 0 && 0 <= x) || isString(x);
};

// Internals

var Identity = /*#__PURE__*/(process.env.NODE_ENV === 'production' ? id : freeze)({
  map: applyU,
  of: id,
  ap: applyU,
  chain: applyU
});

var Constant = /*#__PURE__*/(process.env.NODE_ENV === 'production' ? id : freeze)({
  map: sndU
});

var toFunction = /*#__PURE__*/(process.env.NODE_ENV === 'production' ? id : par(0, ef(reqOptic)))(function (o) {
  switch (typeof o) {
    case 'string':
      return funProp(o);
    case 'number':
      return funIndex(o);
    case 'object':
      return composed(0, o);
    default:
      return o.length === 4 ? o : fromReader(o);
  }
});

// Operations on optics

var assign$1 = /*#__PURE__*/curry(function (o, x, s) {
  return setU([o, propsOf(x)], x, s);
});

var modify = /*#__PURE__*/curry(modifyU);

var remove = /*#__PURE__*/curry(function (o, s) {
  return setU(o, void 0, s);
});

var set = /*#__PURE__*/curry(setU);

var transform = /*#__PURE__*/curry(function (o, s) {
  return modifyU(o, id, s);
});

var traverse = /*#__PURE__*/curry(traverseU);

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

function flat() {
  var r = [flatten];
  for (var i = 0, n = arguments.length; i < n; ++i) {
    r.push(arguments[i], flatten);
  }return r;
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

var cond = /*#__PURE__*/(process.env.NODE_ENV === 'production' ? id : function (fn$$1) {
  return function () {
    for (var _len2 = arguments.length, cs = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      cs[_key2] = arguments[_key2];
    }

    var pair = tup(ef(reqFn), ef(reqOptic));
    arr(pair)(cs.slice(0, -1));
    arr(or(tup(ef(reqOptic)), pair))(cs.slice(-1));
    return fn$$1.apply(undefined, cs);
  };
})(function () {
  var n = arguments.length;
  var r = zero;
  while (n--) {
    var c = arguments[n];
    r = c.length < 2 ? toFunction(c[0]) : eitherU(toFunction(c[1]), r)(c[0]);
  }
  return r;
});

var condOf = /*#__PURE__*/(process.env.NODE_ENV === 'production' ? id : function (fn$$1) {
  return function (of) {
    for (var _len3 = arguments.length, cs = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
      cs[_key3 - 1] = arguments[_key3];
    }

    var pair = tup(ef(reqFn), ef(reqOptic));
    arr(pair)(cs.slice(0, -1));
    arr(or(tup(ef(reqOptic)), pair))(cs.slice(-1));
    return fn$$1.apply(undefined, [of].concat(cs));
  };
})(function (of) {
  of = toFunction(of);
  var op = condOfDefault;
  var n = arguments.length;
  while (--n) {
    var c = arguments[n];
    op = c.length === 1 ? always(toFunction(c[0])) : condOfCase(c[0], toFunction(c[1]), op);
  }
  return function (x, i, C, xi2yC) {
    return of(x, i, Constant, op)(x, i, C, xi2yC);
  };
});

var ifElse = /*#__PURE__*/curry(function (c, t, e) {
  return eitherU(toFunction(t), toFunction(e))(c);
});

var iftes = /*#__PURE__*/(process.env.NODE_ENV === 'production' ? id : function (fn$$1) {
  return function (_c, _t) {
    warn(iftes, '`iftes` has been obsoleted.  Use `ifElse` or `cond` instead.  See CHANGELOG for details.');
    return fn$$1.apply(null, arguments);
  };
})(function (_c, _t) {
  var n = arguments.length;
  var r = n & 1 ? toFunction(arguments[--n]) : zero;
  while (0 <= (n -= 2)) {
    r = eitherU(toFunction(arguments[n + 1]), r)(arguments[n]);
  }return r;
});

var orElse = /*#__PURE__*/curry(orElseU);

// Querying

var chain = /*#__PURE__*/curry(function (xi2yO, xO) {
  return [xO, choose(function (xM, i) {
    return void 0 !== xM ? xi2yO(xM, i) : zero;
  })];
});

var choice = function choice() {
  for (var _len4 = arguments.length, os = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
    os[_key4] = arguments[_key4];
  }

  return os.reduceRight(orElseU, zero);
};

var unless = /*#__PURE__*/eitherU(zeroOp, identity);

var when = /*#__PURE__*/eitherU(identity, zeroOp);

var optional = /*#__PURE__*/when(isDefined);

var zero = function zero(x, i, C, xi2yC) {
  return zeroOp(x, i, C, xi2yC);
};

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

  var show = curry(function (dir, x) {
    return console.log.apply(console, copyToFrom([], 0, _arguments, 0, _arguments.length).concat([dir, x])), x;
  });
  return isoU(show('get'), show('set'));
}

// Sequencing

var seq = /*#__PURE__*/(process.env.NODE_ENV === 'production' ? id : function (fn$$1) {
  return function () {
    return par(2, ef(reqMonad('seq')))(fn$$1.apply(undefined, arguments));
  };
})(function () {
  var n = arguments.length;
  var r = zero;
  if (n) {
    r = toFunction(arguments[--n]);
    while (n) {
      r = seq2U(toFunction(arguments[--n]), r);
    }
  }
  return r;
});

// Creating new traversals

var branchOr = /*#__PURE__*/(process.env.NODE_ENV === 'production' ? id : par(1, ef(reqTemplate('branchOr'))))( /*#__PURE__*/curryN(2, function (otherwise) {
  return otherwise = toFunction(otherwise), function (template) {
    return branchOrU(otherwise, template);
  };
}));

var branch = /*#__PURE__*/branchOr(zero);

function branches() {
  var n = arguments.length;
  var template = {};
  for (var i = 0; i < n; ++i) {
    template[arguments[i]] = identity;
  }return branch(template);
}

// Traversals and combinators

var elems = /*#__PURE__*/(process.env.NODE_ENV === 'production' ? id : par(2, ef(reqApplicative('elems'))))(function (xs, i, A, xi2yA) {
  return seemsArrayLike(xs) ? elemsI(xs, i, A, xi2yA) : A.of(xs);
});

var entries = /*#__PURE__*/toFunction([keyed, elems]);

var keys$1 = /*#__PURE__*/toFunction([keyed, elems, 0]);

var matches = /*#__PURE__*/(process.env.NODE_ENV === 'production' ? id : dep(function (re) {
  return re.global ? res(par(2, ef(reqApplicative('matches', re)))) : id;
}))(function (re) {
  return function (x, _i, C, xi2yC) {
    if (isString(x)) {
      var map = C.map;

      if (re.global) {
        var m0 = [''];
        m0.input = x;
        m0.index = 0;
        if (Select === C) {
          return iterSelect(xi2yC, re, m0);
        } else {
          var ap = C.ap,
              of = C.of;

          return map(matchesJoin(x), iterEager(map, ap, of, xi2yC, re, m0));
        }
      } else {
        var m = x.match(re);
        if (m) return map(function (y) {
          return x.replace(re, void 0 !== y ? y : '');
        }, xi2yC(m[0], reIndex(m)));
      }
    }
    return zeroOp(x, void 0, C, xi2yC);
  };
});

var values = /*#__PURE__*/(process.env.NODE_ENV === 'production' ? id : par(2, ef(reqApplicative('values'))))( /*#__PURE__*/branchOr1Level(identity, protoless0));

var children = /*#__PURE__*/(process.env.NODE_ENV === 'production' ? id : par(2, ef(reqApplicative('children'))))(function (x, i, C, xi2yC) {
  return isArray(x) ? elemsI(x, i, C, xi2yC) : isObject(x) ? values(x, i, C, xi2yC) : C.of(x);
});

var flatten = /*#__PURE__*/(process.env.NODE_ENV === 'production' ? id : par(2, ef(reqApplicative('flatten'))))(function (x, i, C, xi2yC) {
  var rec = function rec(x, i) {
    return isArray(x) ? elemsI(x, i, C, rec) : void 0 !== x ? xi2yC(x, i) : C.of(x);
  };
  return rec(x, i);
});

function query() {
  var r = [];
  for (var i = 0, n = arguments.length; i < n; ++i) {
    var o = toFunction(arguments[i]);
    r.push(satisfying(isDefined$1(o)), o);
  }
  return r;
}

var satisfying = function satisfying(p) {
  return function (x, i, C, xi2yC) {
    var rec = function rec(x, i) {
      return p(x, i) ? xi2yC(x, i) : children(x, i, C, rec);
    };
    return rec(x, i);
  };
};

var leafs = /*#__PURE__*/satisfying(function (x) {
  return void 0 !== x && !isArray(x) && !isObject(x);
});

// Folds over traversals

var all = /*#__PURE__*/curry(function (xi2b, t, s) {
  return !traverseU(Select, function (x, i) {
    if (!xi2b(x, i)) return true;
  }, t, s);
});

var and$1 = /*#__PURE__*/all(id);

var any = /*#__PURE__*/curry(function (xi2b, t, s) {
  return !!traverseU(Select, function (x, i) {
    if (xi2b(x, i)) return true;
  }, t, s);
});

var collectAs = /*#__PURE__*/(process.env.NODE_ENV === 'production' ? curry : res(freeze))(function (xi2y, t, s) {
  var results = [];
  traverseU(Select, function (x, i) {
    var y = xi2y(x, i);
    if (void 0 !== y) results.push(y);
  }, t, s);
  return results;
});

var collect = /*#__PURE__*/collectAs(id);

var concatAs = /*#__PURE__*/mkTraverse(id, function (m) {
  return ConcatOf(m.concat, m.empty());
});

var concat = /*#__PURE__*/concatAs(id);

var countIf = /*#__PURE__*/curry(function (p, t, s) {
  return traverseU(Sum, function (x, i) {
    return p(x, i) ? 1 : 0;
  }, t, s);
});

var count = /*#__PURE__*/countIf(isDefined);

var countsAs = /*#__PURE__*/curry(function (xi2k, t, s) {
  var counts = new Map();
  traverseU(Select, function (x, i) {
    var k = xi2k(x, i);
    var n = counts.get(k);
    counts.set(k, void 0 !== n ? n + 1 : 1);
  }, t, s);
  return counts;
});

var counts = /*#__PURE__*/countsAs(id);

var foldl = /*#__PURE__*/curry(function (f, r, t, s) {
  traverseU(Select, function (x, i) {
    r = f(r, x, i);
  }, t, s);
  return r;
});

var foldr = /*#__PURE__*/curry(function (f, r, t, s) {
  var is = [];
  var xs = [];
  traverseU(Select, function (x, i) {
    xs.push(x);
    is.push(i);
  }, t, s);
  for (var i = xs.length - 1; 0 <= i; --i) {
    r = f(r, xs[i], is[i]);
  }return r;
});

var forEach = /*#__PURE__*/curry(function (f, t, s) {
  return traverseU(Select, function (x, i) {
    f(x, i);
  }, t, s);
});

var forEachWith = /*#__PURE__*/curry(function (newC, ef$$1, t, s) {
  var c = newC();
  traverseU(Select, function (x, i) {
    ef$$1(c, x, i);
  }, t, s);
  return c;
});

var isDefined$1 = /*#__PURE__*/curry(function (t, s) {
  return void 0 !== traverseU(Select, id, t, s);
});

var isEmpty = /*#__PURE__*/curry(function (t, s) {
  return !traverseU(Select, always(true), t, s);
});

var joinAs = /*#__PURE__*/mkTraverse(toStringPartial, /*#__PURE__*/(process.env.NODE_ENV === 'production' ? id : par(0, ef(reqString('`join` and `joinAs` expect a string delimiter'))))(function (d) {
  return ConcatOf(function (x, y) {
    return void 0 !== x ? void 0 !== y ? x + d + y : x : y;
  });
}));

var join = /*#__PURE__*/joinAs(id);

var maximumBy = /*#__PURE__*/mumBy(gtU);

var maximum = /*#__PURE__*/maximumBy(id);

var meanAs = /*#__PURE__*/curry(function (xi2y, t, s) {
  var sum = 0;
  var num = 0;
  traverseU(Select, function (x, i) {
    var y = xi2y(x, i);
    if (void 0 !== y) {
      num += 1;
      sum += y;
    }
  }, t, s);
  return sum / num;
});

var mean = /*#__PURE__*/meanAs(id);

var minimumBy = /*#__PURE__*/mumBy(ltU);

var minimum = /*#__PURE__*/minimumBy(id);

var none = /*#__PURE__*/curry(function (xi2b, t, s) {
  return !traverseU(Select, function (x, i) {
    if (xi2b(x, i)) return true;
  }, t, s);
});

var or$1 = /*#__PURE__*/any(id);

var productAs = /*#__PURE__*/traverse( /*#__PURE__*/ConcatOf(function (x, y) {
  return x * y;
}, 1));

var product = /*#__PURE__*/productAs( /*#__PURE__*/unto(1));

var selectAs = /*#__PURE__*/traverse(Select);

var select = /*#__PURE__*/selectAs(id);

var sumAs = /*#__PURE__*/traverse(Sum);

var sum = /*#__PURE__*/sumAs(unto0);

// Operations on lenses

function get(l, s) {
  return 1 < arguments.length ? getU(l, s) : function (s) {
    return getU(l, s);
  };
}

// Creating new lenses

var lens = /*#__PURE__*/curry(lensU);

var setter = /*#__PURE__*/lens(id);

var foldTraversalLens = /*#__PURE__*/curry(function (fold, traversal) {
  return lensU(fold(traversal), set(traversal));
});

// Enforcing invariants

function defaults(out) {
  function o2u(x) {
    return replaced(out, void 0, x);
  }
  return function (x, i, F, xi2yF) {
    return F.map(o2u, xi2yF(void 0 !== x ? x : out, i));
  };
}

var define = /*#__PURE__*/(process.env.NODE_ENV === 'production' ? id : function (fn$$1) {
  return function (inn) {
    var res$$1 = fn$$1(inn);
    if (isEmptyArrayStringOrObject(inn)) return toFunction([isoU(warnEmpty(fn$$1, inn, 'define'), id), res$$1, isoU(id, warnEmpty(define, inn, 'define'))]);else return res$$1;
  };
})(function (v) {
  var untoV = unto(v);
  return function (x, i, F, xi2yF) {
    return F.map(untoV, xi2yF(void 0 !== x ? x : v, i));
  };
});

var normalize = function normalize(xi2x) {
  return [reread(xi2x), rewrite(xi2x)];
};

var required = /*#__PURE__*/(process.env.NODE_ENV === 'production' ? id : function (fn$$1) {
  return function (inn) {
    var res$$1 = fn$$1(inn);
    if (isEmptyArrayStringOrObject(inn)) return toFunction([res$$1, isoU(id, warnEmpty(required, inn, 'required'))]);else return res$$1;
  };
})(function (inn) {
  return replace(inn, void 0);
});

var reread = function reread(xi2x) {
  return function (x, i, _F, xi2yF) {
    return xi2yF(void 0 !== x ? xi2x(x, i) : x, i);
  };
};

var rewrite = function rewrite(yi2y) {
  return function (x, i, F, xi2yF) {
    return F.map(function (y) {
      return void 0 !== y ? yi2y(y, i) : y;
    }, xi2yF(x, i));
  };
};

// Lensing arrays

function append(xs, _, F, xi2yF) {
  var i = seemsArrayLike(xs) ? xs.length : 0;
  return F.map(function (x) {
    return setIndex(i, x, xs);
  }, xi2yF(void 0, i));
}

var filter = /*#__PURE__*/(process.env.NODE_ENV === 'production' ? id : res(function (lens) {
  return toFunction([lens, isoU(id, ef(reqMaybeArray('`filter` must be set with undefined or an array-like object')))]);
}))(function (xi2b) {
  return function (xs, i, F, xi2yF) {
    var ts = void 0;
    var fs = array0;
    if (seemsArrayLike(xs)) partitionIntoIndex(xi2b, xs, ts = [], fs = []);
    return F.map(function (ts) {
      var tsN = ts ? ts.length : 0;
      var fsN = fs.length;
      var n = tsN + fsN;
      return n === fsN ? fs : copyToFrom(copyToFrom(Array(n), 0, ts, 0, tsN), tsN, fs, 0, fsN);
    }, xi2yF(ts, i));
  };
});

function find(xih2b) {
  var hint = arguments.length > 1 ? arguments[1] : { hint: 0 };
  return function (xs, _i, F, xi2yF) {
    var ys = seemsArrayLike(xs) ? xs : '';
    var i = hint.hint = findIndexHint(hint, xih2b, ys);
    return F.map(function (v) {
      return setIndex(i, v, ys);
    }, xi2yF(ys[i], i));
  };
}

function findWith(o) {
  var oo = toFunction(o);
  var p = isDefined$1(oo);
  return [arguments.length > 1 ? find(p, arguments[1]) : find(p), oo];
}

var first = 0;

var index = process.env.NODE_ENV !== 'production' ? /*#__PURE__*/ef(reqIndex) : id;

var last = /*#__PURE__*/choose(function (maybeArray) {
  return seemsArrayLike(maybeArray) && maybeArray.length ? maybeArray.length - 1 : 0;
});

var prefix = function prefix(n) {
  return slice(0, n);
};

var slice = /*#__PURE__*/(process.env.NODE_ENV === 'production' ? curry : res(function (lens) {
  return toFunction([lens, isoU(id, ef(reqMaybeArray('`slice` must be set with undefined or an array-like object')))]);
}))(function (begin, end) {
  return function (xs, i, F, xsi2yF) {
    var seems = seemsArrayLike(xs);
    var xsN = seems && xs.length;
    var b = sliceIndex(0, xsN, 0, begin);
    var e = sliceIndex(b, xsN, xsN, end);
    return F.map(function (zs) {
      var zsN = zs ? zs.length : 0;
      var bPzsN = b + zsN;
      var n = xsN - e + bPzsN;
      return copyToFrom(copyToFrom(copyToFrom(Array(n), 0, xs, 0, b), b, zs, 0, zsN), bPzsN, xs, e, xsN);
    }, xsi2yF(seems ? copyToFrom(Array(Math.max(0, e - b)), 0, xs, b, e) : void 0, i));
  };
});

var suffix = function suffix(n) {
  return slice(0 === n ? Infinity : !n ? 0 : -n, void 0);
};

// Lensing objects

var pickIn = function pickIn(t) {
  return isObject(t) ? pick(modify(values, pickInAux, t)) : t;
};

var prop = process.env.NODE_ENV === 'production' ? id : function (x) {
  if (!isString(x)) errorGiven('`prop` expects a string', x);
  return x;
};

function props() {
  var n = arguments.length;
  var template = {};
  for (var i = 0, k; i < n; ++i) {
    template[k = arguments[i]] = k;
  }return pick(template);
}

var propsOf = function propsOf(o) {
  return props.apply(null, keys(o));
};

function removable() {
  for (var _len5 = arguments.length, ps = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
    ps[_key5] = arguments[_key5];
  }

  function drop(y) {
    if (!(y instanceof Object)) return y;
    for (var i = 0, n = ps.length; i < n; ++i) {
      if (hasU(ps[i], y)) return y;
    }
  }
  return function (x, i, F, xi2yF) {
    return F.map(drop, xi2yF(x, i));
  };
}

// Providing defaults

var valueOr = function valueOr(v) {
  return function (x, i, _F, xi2yF) {
    return xi2yF(x != null ? x : v, i);
  };
};

// Transforming data

var pick = /*#__PURE__*/(process.env.NODE_ENV === 'production' ? id : par(0, ef(reqTemplate('pick'))))(function (template) {
  return function (x, i, F, xi2yF) {
    return F.map(function (v) {
      return setPick(template, v, x);
    }, xi2yF(getPick(template, x), i));
  };
});

var replace = /*#__PURE__*/curry(function (inn, out) {
  function o2i(x) {
    return replaced(out, inn, x);
  }
  return function (x, i, F, xi2yF) {
    return F.map(o2i, xi2yF(replaced(inn, out, x), i));
  };
});

// Operations on isomorphisms

function getInverse(o, s) {
  return 1 < arguments.length ? setU(o, s, void 0) : function (s) {
    return setU(o, s, void 0);
  };
}

// Creating new isomorphisms

var iso = /*#__PURE__*/curry(isoU);

// Isomorphism combinators

var array = function array(elem) {
  var fwd = getInverse(elem);
  var bwd = get(elem);
  var mapFwd = function mapFwd(x) {
    return mapIfArrayLike(fwd, x);
  };
  return function (x, i, F, xi2yF) {
    return F.map(mapFwd, xi2yF(mapIfArrayLike(bwd, x), i));
  };
};

var inverse = function inverse(iso) {
  return function (x, i, F, xi2yF) {
    return F.map(function (x) {
      return getU(iso, x);
    }, xi2yF(setU(iso, x, void 0), i));
  };
};

// Basic isomorphisms

var complement = /*#__PURE__*/isoU(notPartial, notPartial);

var indexed = /*#__PURE__*/isoU( /*#__PURE__*/expect(seemsArrayLike, /*#__PURE__*/(process.env.NODE_ENV === 'production' ? id : res(freezeArrayOfObjects))(function (xs) {
  var n = xs.length;
  var xis = Array(n);
  for (var i = 0; i < n; ++i) {
    xis[i] = [i, xs[i]];
  }return xis;
})), /*#__PURE__*/expect(isArray, /*#__PURE__*/(process.env.NODE_ENV === 'production' ? id : res(freeze))(function (xis) {
  var n = xis.length;
  var xs = Array(n);
  for (var i = 0; i < n; ++i) {
    var xi = xis[i];
    if (xi.length === 2) xs[xi[0]] = xi[1];
  }
  n = xs.length;
  var j = 0;
  for (var _i3 = 0; _i3 < n; ++_i3) {
    var x = xs[_i3];
    if (void 0 !== x) {
      if (_i3 !== j) xs[j] = x;
      ++j;
    }
  }
  xs.length = j;
  return xs;
})));

var is = function is(v) {
  return isoU(function (x) {
    return acyclicEqualsU(v, x);
  }, function (b) {
    return true === b ? v : void 0;
  });
};

var reverse = /*#__PURE__*/isoU(rev, rev);

var singleton = /*#__PURE__*/(process.env.NODE_ENV === 'production' ? id : function (iso) {
  return toFunction([isoU(id, freeze), iso]);
})(function (x, i, F, xi2yF) {
  return F.map(singletonPartial, xi2yF((x instanceof Object || isString(x)) && x.length === 1 ? x[0] : void 0, i));
});

// Standard isomorphisms

var uri = /*#__PURE__*/isoU( /*#__PURE__*/expect(isString, decodeURI), /*#__PURE__*/expect(isString, encodeURI));

var uriComponent = /*#__PURE__*/isoU( /*#__PURE__*/expect(isString, decodeURIComponent), /*#__PURE__*/expect(isString, encodeURIComponent));

var json = /*#__PURE__*/(process.env.NODE_ENV === 'production' ? id : res(function (iso) {
  return toFunction([iso, isoU(deepFreeze, id)]);
}))(function (options) {
  var _ref = options || object0,
      reviver = _ref.reviver,
      replacer = _ref.replacer,
      space = _ref.space;

  return isoU(expect(isString, function (text) {
    return JSON.parse(text, reviver);
  }), expect(isDefined, function (value) {
    return JSON.stringify(value, replacer, space);
  }));
});

// Interop

var pointer = function pointer(s) {
  if (s[0] === '#') s = decodeURIComponent(s);
  var ts = s.split('/');
  var n = ts.length;
  for (var i = 1; i < n; ++i) {
    var t = ts[i];
    ts[i - 1] = /^(0|[1-9]\d*)$/.test(t) ? ifElse(isArrayOrPrimitive, Number(t), t) : '-' === t ? ifElse(isArrayOrPrimitive, append, t) : t.replace('~1', '/').replace('~0', '~');
  }
  ts.length = n - 1;
  return ts;
};

export { seemsArrayLike, Identity, Constant, toFunction, assign$1 as assign, modify, remove, set, transform, traverse, compose, flat, lazy, choices, choose, cond, condOf, ifElse, iftes, orElse, chain, choice, unless, when, optional, zero, assignOp, modifyOp, setOp, removeOp, log, seq, branchOr, branch, branches, elems, entries, keys$1 as keys, matches, values, children, flatten, query, satisfying, leafs, all, and$1 as and, any, collectAs, collect, concatAs, concat, countIf, count, countsAs, counts, foldl, foldr, forEach, forEachWith, isDefined$1 as isDefined, isEmpty, joinAs, join, maximumBy, maximum, meanAs, mean, minimumBy, minimum, none, or$1 as or, productAs, product, selectAs, select, sumAs, sum, get, lens, setter, foldTraversalLens, defaults, define, normalize, required, reread, rewrite, append, filter, find, findWith, first, index, last, prefix, slice, suffix, pickIn, prop, props, propsOf, removable, valueOr, pick, replace, getInverse, iso, array, inverse, complement, identity, indexed, is, keyed, reverse, singleton, uri, uriComponent, json, pointer };
