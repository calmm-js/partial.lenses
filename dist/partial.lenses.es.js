import { defineNameU, isString, isArray, curry, always, freeze, isObject, Applicative, sndU, isFunction, curryN, assocPartialU, dissocPartialU, object0, Identity, resolve, IdentityAsync, isNumber, constructorOf, toObject, create, acyclicEqualsU, inherit, identicalU, isDefined, array0, keys, hasU, assign, arityN, id, isInstanceOfU } from 'infestines';
export { Identity, IdentityAsync, FantasyFunctor, fromFantasy, fromFantasyApplicative, fromFantasyMonad } from 'infestines';

var LENGTH = 'length';

var addU = function addU(x, y) {
  return x + y;
};
var multiplyU = function multiplyU(x, y) {
  return x * y;
};

var add = /*#__PURE__*/curry(addU);
var multiply = /*#__PURE__*/curry(multiplyU);

var divideBy = /*#__PURE__*/curry(function (d, n) {
  return n / d;
});

var negate = function negate(x) {
  return -x;
};

var ltU = function ltU(x, y) {
  return x < y;
};
var gtU = function gtU(x, y) {
  return x > y;
};

var isInstanceOf = /*#__PURE__*/curry(isInstanceOfU);

var protoless = function protoless(o) {
  return assign(create(null), o);
};
var protoless0 = /*#__PURE__*/freeze( /*#__PURE__*/protoless(object0));

var replace = /*#__PURE__*/curry(function (p, r, s) {
  return s.replace(p, r);
});

function isPrimitiveData(x) {
  switch (typeof x) {
    case 'boolean':
    case 'number':
    case 'string':
      return true;
    default:
      return false;
  }
}

var iterator = Symbol.iterator;

var dep = function dep(xs2xsyC) {
  return function (xsy) {
    return arityN(xsy[LENGTH], defineNameU(function () {
      return xs2xsyC.apply(undefined, arguments)(xsy).apply(undefined, arguments);
    }, xsy.name));
  };
};

var fn = function fn(xsC, yC) {
  return function (xsy) {
    return arityN(xsy[LENGTH], defineNameU(function () {
      for (var _len = arguments.length, xs = Array(_len), _key = 0; _key < _len; _key++) {
        xs[_key] = arguments[_key];
      }

      return yC(xsy.apply(null, xsC(xs)));
    }, xsy.name));
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
    for (var i = 0, n = xCs[LENGTH]; i < n; ++i) {
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
    for (var i = 0, n = xCs[LENGTH]; i < n; ++i) {
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
  return defineNameU(function (x) {
    xE(x);
    return x;
  }, xE.name);
};

var tup = function tup() {
  for (var _len4 = arguments.length, xCs = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
    xCs[_key4] = arguments[_key4];
  }

  return function (xs) {
    if (xs[LENGTH] !== xCs[LENGTH]) throw Error('Expected array of ' + xCs[LENGTH] + ' elements, but got ' + xs[LENGTH]);
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

var id$1 = function id$$1(x) {
  return x;
};

var setName = process.env.NODE_ENV === 'production' ? function (x) {
  return x;
} : defineNameU;

var copyName = process.env.NODE_ENV === 'production' ? function (x) {
  return x;
} : function (to, from) {
  return defineNameU(to, from.name);
};

var toRegExpU = function toRegExpU(str, flags) {
  return isString(str) ? new RegExp(replace(/[|\\{}()[\]^$+*?.]/g, '\\$&', str), flags) : str;
};

//

var isPair = function isPair(x) {
  return isArray(x) && x[LENGTH] === 2;
};

//

var inserterOp = /*#__PURE__*/curry(function (inserter, value) {
  return [inserter, setOp(value)];
});

//

var toGetter = function toGetter(getter) {
  if (typeof getter === 'function' && getter[LENGTH] < 4) return getter;
  getter = toFunction(getter);
  return function (x, i) {
    return getter(x, i, Select, id$1);
  };
};

//

var tryCatch = function tryCatch(fn$$1) {
  return copyName(function (x) {
    try {
      return fn$$1(x);
    } catch (e) {
      return e;
    }
  }, fn$$1);
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

var pairPartial = function pairPartial(k) {
  return function (v) {
    return void 0 !== k && void 0 !== v ? [k, v] : void 0;
  };
};

var unto = function unto(c) {
  return function (x) {
    return void 0 !== x ? x : c;
  };
};
var unto0 = /*#__PURE__*/unto(0);

var toTrue = /*#__PURE__*/always(true);

var notPartial = function complement(x) {
  return void 0 !== x ? !x : x;
};

var expect = function expect(p, f) {
  return copyName(function (x) {
    return p(x) ? f(x) : void 0;
  }, f);
};

var freezeInDev = process.env.NODE_ENV === 'production' ? id$1 : freeze;

var freezeResultInDev = process.env.NODE_ENV === 'production' ? id$1 : /*#__PURE__*/res(freeze);

var deepFreezeInDev = process.env.NODE_ENV === 'production' ? id$1 : function deepFreezeInDev(x) {
  if (isArray(x)) {
    x.forEach(deepFreezeInDev);
    freeze(x);
  } else if (isObject(x)) {
    for (var k in x) {
      deepFreezeInDev(x[k]);
    }freeze(x);
  }
  return x;
};

function freezeObjectOfObjects(xs) {
  if (xs) for (var k in xs) {
    freeze(xs[k]);
  }return freeze(xs);
}

var isArrayOrPrimitive = function isArrayOrPrimitive(x) {
  return !(x instanceof Object) || isArray(x);
};

var rev = /*#__PURE__*/(process.env.NODE_ENV === 'production' ? id$1 : res(freeze))(function reverse(xs) {
  if (seemsArrayLike(xs)) {
    var n = xs[LENGTH];
    var ys = Array(n);
    var i = 0;
    while (n) {
      ys[i++] = xs[--n];
    }return ys;
  }
});

//

var mapPartialIndexU = /*#__PURE__*/(process.env.NODE_ENV === 'production' ? id$1 : function (fn$$1) {
  return function (xi2y, xs, skip) {
    var ys = fn$$1(xi2y, xs, skip);
    if (xs !== ys) freeze(ys);
    return ys;
  };
})(function (xi2y, xs, skip) {
  var n = xs[LENGTH];
  var ys = Array(n);
  var j = 0;
  var same = true;
  for (var i = 0; i < n; ++i) {
    var x = xs[i];
    var y = xi2y(x, i);
    if (skip !== y) {
      ys[j++] = y;
      if (same) same = x === y && (x !== 0 || 1 / x === 1 / y) || x !== x && y !== y;
    }
  }
  if (j !== n) {
    ys[LENGTH] = j;
    return ys;
  } else if (same) {
    return xs;
  } else {
    return ys;
  }
});

var mapIfArrayLike = function mapIfArrayLike(xi2y, xs) {
  return seemsArrayLike(xs) ? mapPartialIndexU(xi2y, xs, void 0) : void 0;
};

var mapsIfArray = /*#__PURE__*/(process.env.NODE_ENV === 'production' ? id$1 : res(freeze))(function (x2y, xs) {
  if (isArray(xs)) {
    var n = xs[LENGTH];
    var ys = Array();
    for (var i = 0; i < n; ++i) {
      if (void 0 === (ys[i] = x2y(xs[i]))) {
        return void 0;
      }
    }
    return ys;
  }
});

var copyToFrom = /*#__PURE__*/(process.env.NODE_ENV === 'production' ? id$1 : function (fn$$1) {
  return function (ys, k, xs, i, j) {
    return ys[LENGTH] === k + j - i ? freeze(fn$$1(ys, k, xs, i, j)) : fn$$1(ys, k, xs, i, j);
  };
})(function (ys, k, xs, i, j) {
  while (i < j) {
    ys[k++] = xs[i++];
  }return ys;
});

//

function selectInArrayLike(xi2v, xs) {
  for (var i = 0, n = xs[LENGTH]; i < n; ++i) {
    var v = xi2v(xs[i], i);
    if (void 0 !== v) return v;
  }
}

//

var ConstantWith = function ConstantWith(ap, empty) {
  return Applicative(sndU, always(empty), ap);
};

var ConstantOf = function ConstantOf(_ref) {
  var concat = _ref.concat,
      empty = _ref.empty;
  return ConstantWith(concat, empty());
};

var Sum = /*#__PURE__*/ConstantWith(addU, 0);

var mumBy = function mumBy(ord) {
  return curry(function mumBy(xi2y, t, s) {
    xi2y = toGetter(xi2y);
    var minX = void 0;
    var minY = void 0;
    getAsU(function (x, i) {
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

var traverseU = function traverse(C, xi2yC, t, s) {
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

var reqIndex = function index(x) {
  if (!Number.isInteger(x) || x < 0) errorGiven('`index` expects a non-negative integer', x);
};

function reqFunction(o) {
  if (!(isFunction(o) && (o[LENGTH] === 4 || o[LENGTH] <= 2))) errorGiven(expectedOptic, o, opticIsEither);
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
      for (var i = 0, n = o[LENGTH]; i < n; ++i) {
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

var reqMonad = function reqMonad(name) {
  return function (C) {
    if (!C.chain) errorGiven('`' + name + '` requires a monad', C, 'Note that you can only `modify`, `remove`, `set`, and `traverse` a transform.');
  };
};

//

var mkTraverse = function mkTraverse(after, toC) {
  return curryN(4, copyName(function (xi2yC, m) {
    return m = toC(m), function (t, s) {
      return after(traverseU(m, xi2yC, t, s));
    };
  }, toC));
};

//

var consExcept = function consExcept(skip) {
  return function (t) {
    return function (h) {
      return skip !== h ? [h, t] : t;
    };
  };
};

var pushTo = function pushTo(n, xs) {
  while (consExcept !== n) {
    xs.push(n[0]);
    n = n[1];
  }
  return xs;
};

var consTo = /*#__PURE__*/(process.env.NODE_ENV === 'production' ? id$1 : res(freeze))(function (n) {
  return pushTo(n, []).reverse();
});

function traversePartialIndex(A, xi2yA, xs, skip) {
  var map = A.map,
      ap = A.ap;

  var xsA = A.of(consExcept);
  var n = xs[LENGTH];
  if (map === sndU) {
    for (var i = 0; i < n; ++i) {
      xsA = ap(xsA, xi2yA(xs[i], i));
    }return xsA;
  } else {
    var cons = consExcept(skip);
    for (var _i2 = 0; _i2 < n; ++_i2) {
      xsA = ap(map(cons, xsA), xi2yA(xs[_i2], _i2));
    }return map(consTo, xsA);
  }
}

//

var SelectLog = /*#__PURE__*/Applicative(function (f, _ref2) {
  var p = _ref2.p,
      x = _ref2.x,
      c = _ref2.c;

  x = f(x);
  if (!isFunction(x)) p = [x, p];
  return { p: p, x: x, c: c };
}, function (x) {
  return { p: [], x: x, c: undefined };
}, function (l, r) {
  var v = undefined !== l.c ? l : r;
  return { p: v.p, x: l.x(r.x), c: v.c };
});

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

var setProp = /*#__PURE__*/(process.env.NODE_ENV === 'production' ? id$1 : res(freeze))(function (k, v, o) {
  return void 0 !== v ? assocPartialU(k, v, o) : dissocPartialU(k, o) || object0;
});

var funProp = /*#__PURE__*/lensFrom(getProp, setProp);

//

var getIndex = function getIndex(i, xs) {
  return seemsArrayLike(xs) ? xs[i] : void 0;
};

var setIndex = /*#__PURE__*/(process.env.NODE_ENV === 'production' ? id$1 : fn(nth(0, ef(reqIndex)), freeze))(function (i, x, xs) {
  if (!seemsArrayLike(xs)) xs = '';
  var n = xs[LENGTH];
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
  var n = os[LENGTH] - oi0;
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

var disperseU = function disperse(traversal, values, data) {
  if (!seemsArrayLike(values)) values = '';
  var i = 0;
  return modifyU(traversal, function () {
    return values[i++];
  }, data);
};

var setU = /*#__PURE__*/(process.env.NODE_ENV === 'production' ? id$1 : par(0, ef(reqOptic)))(function set(o, x, s) {
  switch (typeof o) {
    case 'string':
      return setProp(o, x, s);
    case 'number':
      return setIndex(o, x, s);
    case 'object':
      return modifyComposed(o, 0, s, x);
    default:
      return o[LENGTH] === 4 ? o(s, void 0, Identity, always(x)) : s;
  }
});

var getInverseU = function getInverse(o, x) {
  return setU(o, x, void 0);
};

var modifyU = /*#__PURE__*/(process.env.NODE_ENV === 'production' ? id$1 : par(0, ef(reqOptic)))(function modify(o, xi2x, s) {
  switch (typeof o) {
    case 'string':
      return setProp(o, xi2x(getProp(o, s), o), s);
    case 'number':
      return setIndex(o, xi2x(getIndex(o, s), o), s);
    case 'object':
      return modifyComposed(o, xi2x, s);
    default:
      return o[LENGTH] === 4 ? o(s, void 0, Identity, xi2x) : (xi2x(o(s, void 0), void 0), s);
  }
});

var modifyAsyncU = function modifyAsyncU(o, f, s) {
  return resolve(toFunction(o)(s, void 0, IdentityAsync, f));
};

var getAsU = /*#__PURE__*/(process.env.NODE_ENV === 'production' ? id$1 : par(1, ef(reqOptic)))(function getAs(xi2y, l, s) {
  switch (typeof l) {
    case 'string':
      return xi2y(getProp(l, s), l);
    case 'number':
      return xi2y(getIndex(l, s), l);
    case 'object':
      {
        var n = l[LENGTH];
        for (var i = 0, o; i < n; ++i) {
          switch (typeof (o = l[i])) {
            case 'string':
              s = getProp(o, s);
              break;
            case 'number':
              s = getIndex(o, s);
              break;
            default:
              return composed(i, l)(s, l[i - 1], Select, xi2y);
          }
        }return xi2y(s, l[n - 1]);
      }
    default:
      return xi2y !== id$1 && l[LENGTH] !== 4 ? xi2y(l(s, void 0), void 0) : l(s, void 0, Select, xi2y);
  }
});

var getU = function getU(l, s) {
  return getAsU(id$1, l, s);
};

function modifyComposed(os, xi2y, x, y) {
  var n = os[LENGTH];
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
  if (n === os[LENGTH]) x = xi2y ? xi2y(x, os[n - 1]) : y;
  for (var _o; 0 <= --n;) {
    x = isString(_o = os[n]) ? setProp(_o, x, xs[n]) : setIndex(_o, x, xs[n]);
  }return x;
}

//

var lensU = function lens(get, set) {
  return copyName(function (x, i, F, xi2yF) {
    return F.map(function (y) {
      return set(y, x, i);
    }, xi2yF(get(x, i), i));
  }, get);
};

var isoU = function iso(bwd, fwd) {
  return copyName(function (x, i, F, xi2yF) {
    return F.map(fwd, xi2yF(bwd(x), i));
  }, bwd);
};

var stringIsoU = function stringIsoU(bwd, fwd) {
  return isoU(expect(isString, bwd), expect(isString, fwd));
};

var numberIsoU = function numberIsoU(bwd, fwd) {
  return isoU(expect(isNumber, bwd), expect(isNumber, fwd));
};

//

var getPick = /*#__PURE__*/(process.env.NODE_ENV === 'production' ? id$1 : res(freeze))(function (template, x) {
  var r = void 0;
  for (var k in template) {
    var t = template[k];
    var v = isObject(t) ? getPick(t, x) : getAsU(id$1, t, x);
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

var setPick = /*#__PURE__*/(process.env.NODE_ENV === 'production' ? id$1 : par(1, ef(reqObject('`pick` must be set with undefined or an object'))))(function (template, value, x) {
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

var branchAssemble = /*#__PURE__*/(process.env.NODE_ENV === 'production' ? id$1 : res(res(freeze)))(function (ks) {
  return function (xs) {
    var r = {};
    var i = ks[LENGTH];
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

var branchOr1LevelIdentity = /*#__PURE__*/(process.env.NODE_ENV === 'production' ? id$1 : function (fn$$1) {
  return function (otherwise, k2o, xO, x, A, xi2yA) {
    var y = fn$$1(otherwise, k2o, xO, x, A, xi2yA);
    if (x !== y) freeze(y);
    return y;
  };
})(function (otherwise, k2o, xO, x, A, xi2yA) {
  var written = void 0;
  var same = true;
  var r = {};
  for (var k in k2o) {
    written = 1;
    var _x2 = xO[k];
    var y = k2o[k](_x2, k, A, xi2yA);
    if (void 0 !== y) {
      r[k] = y;
      if (same) same = _x2 === y && (_x2 !== 0 || 1 / _x2 === 1 / y) || _x2 !== _x2 && y !== y;
    } else {
      same = false;
    }
  }
  var t = written;
  for (var _k in xO) {
    if (void 0 === (t && k2o[_k])) {
      written = 1;
      var _x3 = xO[_k];
      var _y = otherwise(_x3, _k, A, xi2yA);
      if (void 0 !== _y) {
        r[_k] = _y;
        if (same) same = _x3 === _y && (_x3 !== 0 || 1 / _x3 === 1 / _y) || _x3 !== _x3 && _y !== _y;
      } else {
        same = false;
      }
    }
  }
  return written ? same && xO === x ? x : r : x;
});

var branchOr1Level = function branchOr1Level(otherwise, k2o) {
  return function (x, _i, A, xi2yA) {
    var xO = x instanceof Object ? toObject$1(x) : object0;

    if (Identity === A) {
      return branchOr1LevelIdentity(otherwise, k2o, xO, x, A, xi2yA);
    } else if (Select === A) {
      for (var k in k2o) {
        var y = k2o[k](xO[k], k, A, xi2yA);
        if (void 0 !== y) return y;
      }
      for (var _k2 in xO) {
        if (void 0 === k2o[_k2]) {
          var _y2 = otherwise(xO[_k2], _k2, A, xi2yA);
          if (void 0 !== _y2) return _y2;
        }
      }
    } else {
      var map = A.map,
          ap = A.ap,
          of = A.of;

      var xsA = of(cpair);
      var ks = [];
      for (var _k3 in k2o) {
        ks.push(_k3);
        xsA = ap(map(cpair, xsA), k2o[_k3](xO[_k3], _k3, A, xi2yA));
      }
      var t = ks[LENGTH] ? true : void 0;
      for (var _k4 in xO) {
        if (void 0 === (t && k2o[_k4])) {
          ks.push(_k4);
          xsA = ap(map(cpair, xsA), otherwise(xO[_k4], _k4, A, xi2yA));
        }
      }
      return ks[LENGTH] ? map(branchAssemble(ks), xsA) : of(x);
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
  var n = xs[LENGTH];
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

var partitionIntoIndex = /*#__PURE__*/(process.env.NODE_ENV === 'production' ? id$1 : dep(function (_xi2b, _xs, ts, fs) {
  return res(ef(function () {
    freeze(ts);
    freeze(fs);
  }));
}))(function (xi2b, xs, ts, fs) {
  for (var i = 0, n = xs[LENGTH], x; i < n; ++i) {
    (xi2b(x = xs[i], i) ? ts : fs).push(x);
  }
});

var fromReader = function fromReader(wi2x) {
  return copyName(function (w, i, F, xi2yF) {
    return F.map(always(w), xi2yF(wi2x(w, i), i));
  }, wi2x);
};

//

var LAST_INDEX = 'lastIndex';
var INDEX = 'index';
var RE_VALUE = 0;

var reLastIndex = function reLastIndex(m) {
  return m[INDEX] + m[0][LENGTH];
};

var reNext = /*#__PURE__*/(process.env.NODE_ENV === 'production' ? id$1 : function (fn$$1) {
  return function (m, re) {
    var res$$1 = fn$$1(m, re);
    if ('' === res$$1) warn(reNext, '`matches(' + re + ')` traversal terminated due to empty match.  `matches` traversal shouldn\'t be used with regular expressions that can produce empty matches.');
    return res$$1;
  };
})(function (m, re) {
  var lastIndex = re[LAST_INDEX];
  re[LAST_INDEX] = reLastIndex(m);
  var n = re.exec(m.input);
  re[LAST_INDEX] = lastIndex;
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
    var y = xi2y(s[RE_VALUE], s[INDEX]);
    if (void 0 !== y) return y;
  }
}

function iterEager(map, ap, of, xi2yA, t, s) {
  var r = of(iterCollect);
  while (s = reNext(s, t)) {
    r = ap(ap(map(iterCollect, of(s)), r), xi2yA(s[RE_VALUE], s[INDEX]));
  }return r;
}

//

var keyed = /*#__PURE__*/isoU( /*#__PURE__*/expect( /*#__PURE__*/isInstanceOf(Object), /*#__PURE__*/(process.env.NODE_ENV === 'production' ? id$1 : res(freezeObjectOfObjects))(function keyed(x) {
  x = toObject$1(x);
  var es = [];
  for (var key in x) {
    es.push([key, x[key]]);
  }return es;
})), /*#__PURE__*/expect(isArray, /*#__PURE__*/(process.env.NODE_ENV === 'production' ? id$1 : res(freeze))(function (es) {
  var o = {};
  for (var i = 0, n = es[LENGTH]; i < n; ++i) {
    var entry = es[i];
    if (entry[LENGTH] === 2) o[entry[0]] = entry[1];
  }
  return o;
})));

//

var matchesJoin = function matchesJoin(input) {
  return function (matchesIn) {
    var result = '';
    var lastIndex = 0;
    var matches = iterToArray(matchesIn);
    var n = matches[LENGTH];
    for (var j = n - 2; j !== -2; j += -2) {
      var m = matches[j];
      result += input.slice(lastIndex, m[INDEX]);
      var s = matches[j + 1];
      if (void 0 !== s) result += s;
      lastIndex = reLastIndex(m);
    }

    result += input.slice(lastIndex);
    return result;
  };
};

//

var disjointBwd = /*#__PURE__*/(process.env.NODE_ENV === 'production' ? id$1 : res(freezeObjectOfObjects))(function (groupOf, x) {
  if (x instanceof Object) {
    var y = {};
    x = toObject$1(x);
    for (var key in x) {
      var group = groupOf(key);
      var g = y[group];
      if (undefined === g) y[group] = g = {};
      g[key] = x[key];
    }
    return y;
  }
});

var disjointFwd = /*#__PURE__*/(process.env.NODE_ENV === 'production' ? id$1 : res(res(freeze)))(function (groupOf) {
  return function (y) {
    if (y instanceof Object) {
      var x = {};
      y = toObject$1(y);
      for (var group in y) {
        var g = y[group];
        if (g instanceof Object) {
          g = toObject$1(g);
          for (var key in g) {
            if (groupOf(key) === group) {
              x[key] = g[key];
            }
          }
        }
      }
      return x;
    }
  };
});

//

var subseqU = function subseq(begin, end, t) {
  t = toFunction(t);
  return copyName(function (x, i, F, xi2yF) {
    var n = -1;
    return t(x, i, F, function (x, i) {
      return begin <= ++n && !(end <= n) ? xi2yF(x, i) : F.of(x);
    });
  }, t);
};

//

var attemptU = function attemptU(fn$$1, x) {
  if (void 0 !== x) {
    var y = fn$$1(x);
    if (void 0 !== y) return y;
  }
  return x;
};

var rewriteAttempt = function rewriteAttempt(fn$$1) {
  return function (x, i, F, xi2yF) {
    return F.map(function (x) {
      return attemptU(fn$$1, x);
    }, xi2yF(x, i));
  };
};

var rereadAttempt = function rereadAttempt(fn$$1) {
  return function (x, i, F, xi2yF) {
    return xi2yF(attemptU(fn$$1, x), i);
  };
};

//

var transformEvery = function transformEvery(optic) {
  return transform(lazy(function (rec) {
    return [optic, children, rec];
  }));
};

var transformSome = function transformSome(fn$$1) {
  return transform(lazy(function (rec) {
    return choices(getter(fn$$1), [children, rec]);
  }));
};

//

var isDefinedAtU = function isDefinedAtU(o, x, i) {
  return void 0 !== o(x, i, Select, id$1);
};

var isDefinedAt = function isDefinedAt(o) {
  return function (x, i) {
    return isDefinedAtU(o, x, i);
  };
};

var eitherU = function eitherU(t, e) {
  return function either(c) {
    return function either(x, i, C, xi2yC) {
      return (c(x, i) ? t : e)(x, i, C, xi2yC);
    };
  };
};

var orElseU = function orElse(back, prim) {
  prim = toFunction(prim);
  back = toFunction(back);
  return function orElse(x, i, C, xi2yC) {
    return (isDefinedAtU(prim, x, i) ? prim : back)(x, i, C, xi2yC);
  };
};

var orAlternativelyU = function orAlternatively(back, prim) {
  prim = toFunction(prim);
  back = toFunction(back);
  var fwd = function fwd(y) {
    y = always(y);
    var yP = prim(void 0, void 0, Identity, y);
    return void 0 === yP ? back(void 0, void 0, Identity, y) : yP;
  };
  return function orAlternatively(x, i, F, xi2yF) {
    var xP = prim(x, i, Select, id$1);
    return F.map(fwd, xi2yF(void 0 === xP ? back(x, i, Select, id$1) : xP, i));
  };
};

var makeSemi = function makeSemi(op) {
  return copyName(function (_) {
    var n = arguments[LENGTH];
    var r = arguments[--n];
    while (n) {
      r = op(r, arguments[--n]);
    }
    return r;
  }, op);
};

var zero = function zero(x, _i, C, _xi2yC) {
  return C.of(x);
};

//

var elemsI = function elemsI(xs, _i, A, xi2yA) {
  return A === Identity ? mapPartialIndexU(xi2yA, xs, void 0) : A === Select ? selectInArrayLike(xi2yA, xs) : traversePartialIndex(A, xi2yA, xs, void 0);
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

var iteratePartial = function iteratePartial(aa) {
  return function iterate(a) {
    var r = a;
    while (a !== undefined) {
      r = a;
      a = aa(a);
    }
    return r;
  };
};

//

var crossPartial = function crossPartial(op, ls, or$$1) {
  return function (xs, ss) {
    var n = ls[LENGTH];
    if (!seemsArrayLike(xs)) return;
    if (!seemsArrayLike(ss)) ss = '';
    var m = Math.max(n, xs[LENGTH], ss[LENGTH]);
    var ys = Array(m);
    for (var i = 0; i < m; ++i) {
      if (void 0 === (ys[i] = op(i < n ? ls[i] : or$$1, xs[i], ss[i]))) return;
    }return ys;
  };
};

var crossOr = /*#__PURE__*/(process.env.NODE_ENV === 'production' ? curry : function (fn$$1) {
  return curry(function crossOr(or$$1, ls) {
    return toFunction([isoU(id$1, freeze), fn$$1(or$$1, ls), isoU(freeze, id$1)]);
  });
})(function crossOr(or$$1, ls) {
  return lensU(crossPartial(getU, ls, or$$1), crossPartial(setU, ls, or$$1));
});

var subsetPartial = function subsetPartial(p) {
  return function subset(x) {
    return void 0 !== x && p(x) ? x : void 0;
  };
};

//

var unfoldPartial = /*#__PURE__*/(process.env.NODE_ENV === 'production' ? id$1 : res(res(function (r) {
  freeze(r);
  freeze(r[1]);
  return r;
})))(function (s2sa) {
  return function unfold(s) {
    var xs = [];
    for (;;) {
      var sa = s2sa(s);
      if (!isPair(sa)) return [s, xs];
      s = sa[0];
      xs.push(sa[1]);
    }
  };
});

var foldPartial = function foldPartial(sa2s) {
  return function (sxs) {
    if (isPair(sxs)) {
      var xs = sxs[1];
      if (isArray(xs)) {
        var s = sxs[0];
        var n = xs[LENGTH];
        while (n--) {
          s = sa2s(freezeInDev([s, xs[n]]));
        }return s;
      }
    }
  };
};

//

var PAYLOAD = '珳襱댎纚䤤鬖罺좴';

var isPayload = function isPayload(k) {
  return isString(k) && k.indexOf(PAYLOAD) === 0;
};

function Spread(i) {
  this[PAYLOAD] = i;
  freeze(this);
}

var isSpread = /*#__PURE__*/isInstanceOf(Spread);

var Variable = /*#__PURE__*/inherit(function Variable(i) {
  this[PAYLOAD + i] = this[PAYLOAD] = freeze([new Spread(i)]);
  freeze(this);
}, Object, /*#__PURE__*/assocPartialU(iterator, function () {
  return this[PAYLOAD][iterator]();
}));
var isVariable = /*#__PURE__*/isInstanceOf(Variable);

var vars = [];
function nVars(n) {
  while (vars[LENGTH] < n) {
    vars.push(new Variable(vars[LENGTH]));
  }return vars;
}

var isPrimitive = function isPrimitive(x) {
  return x == null || typeof x !== 'object';
};

function match1(kinds, i, e, x) {
  if (void 0 !== x) {
    if (i in e) return acyclicEqualsU(e[i], x);
    e[i] = x;
    var k = kinds[i];
    return !k || k(x);
  }
}

function checkKind(kinds, i, kind) {
  if (0 <= i) {
    if (kinds[i]) {
      if (kinds[i] !== kind) throw Error('Spread patterns must be used consistently either as arrays or as objects.');
    } else {
      kinds[i] = kind;
    }
  }
}

var arrayKind = function arrayKind(x) {
  return void 0 === x || isArray(x);
};
var objectKind = function objectKind(x) {
  return void 0 === x || isInstanceOf(Object);
};

function checkPattern(kinds, p) {
  if (isSpread(p)) {
    throw Error('Spread patterns must be inside objects or arrays.');
  } else if (isArray(p)) {
    var nSpread = 0;
    for (var i = 0, n = p[LENGTH]; i < n; ++i) {
      var pi = p[i];
      if (isSpread(pi)) {
        if (nSpread++) throw Error('At most one spread is allowed in an array or object.');
        checkKind(kinds, pi[PAYLOAD], arrayKind);
      } else {
        checkPattern(kinds, pi);
      }
    }
  } else if (isObject(p)) {
    var spread = p[PAYLOAD];
    if (spread) {
      spread = spread[0][PAYLOAD];
      checkKind(kinds, spread, objectKind);
    }
    var _n = 0;
    for (var k in p) {
      if (isPayload(k)) {
        if (2 < ++_n) throw Error('At most one spread is allowed in an array or object.');
      } else {
        checkPattern(kinds, p[k]);
      }
    }
  } else if (!isPrimitive(p) && !isVariable(p)) {
    throw Error('Only plain arrays and objects are allowed in patterns.');
  }
}

var checkPatternInDev = process.env.NODE_ENV === 'production' ? id$1 : function (p) {
  var kinds = [];
  checkPattern(kinds, p);
  return deepFreezeInDev(p);
};

var checkPatternPairInDev = process.env.NODE_ENV === 'production' ? id$1 : function (ps) {
  var kinds = [];
  checkPattern(kinds, ps[0]);
  checkPattern(kinds, ps[1]);
  return deepFreezeInDev(ps);
};

var setDefined = function setDefined(o, k, x) {
  if (void 0 !== x) o[k] = x;
};

var pushDefined = function pushDefined(xs, x) {
  if (void 0 !== x) xs.push(x);
};

function toMatch(kinds, p) {
  if (void 0 === p || all1(isPrimitive, leafs, p)) {
    return function (e, x) {
      return acyclicEqualsU(p, x);
    };
  } else if (isVariable(p)) {
    var i = p[PAYLOAD][0][PAYLOAD];
    return i < 0 ? id$1 : function (e, x) {
      return match1(kinds, i, e, x);
    };
  } else if (isArray(p)) {
    var init = [];
    var rest = [];
    var spread = void 0;
    var n = p[LENGTH];
    for (var _i3 = 0; _i3 < n; ++_i3) {
      var x = p[_i3];
      if (isSpread(x)) {
        spread = x[PAYLOAD];
        kinds[spread] = arrayKind;
      } else {
        var side = void 0 !== spread ? rest : init;
        side.push(toMatch(kinds, x));
      }
    }
    return function (e, x) {
      if (!seemsArrayLike(x)) return;
      var l = x[LENGTH];
      if (void 0 !== spread ? l < n - 1 : l !== n) return;
      var j = init[LENGTH];
      for (var _i4 = 0; _i4 < j; ++_i4) {
        if (!init[_i4](e, x[_i4])) return;
      }var k = rest[LENGTH];
      l -= k;
      for (var _i5 = 0; _i5 < k; ++_i5) {
        if (!rest[_i5](e, x[l + _i5])) return;
      }return !(0 <= spread) || match1(kinds, spread, e, copyToFrom(Array(l - j), 0, x, j, l));
    };
  } else {
    var _spread = p[PAYLOAD];
    if (_spread) {
      _spread = _spread[0][PAYLOAD];
      kinds[_spread] = objectKind;
    }
    p = modify(values, function (p, k) {
      return isPayload(k) ? void 0 : toMatch(kinds, p);
    }, p);
    var _n2 = count(values, p);
    return function (e, x) {
      if (isPrimitive(x) || isArray(x)) return;
      x = toObject$1(x);
      var rest = 0 <= _spread && {};
      var i = 0;
      for (var k in x) {
        var m = p[k];
        if (m) {
          if (!m(e, x[k])) return;
          i++;
        } else if (void 0 !== _spread) {
          if (rest) rest[k] = x[k];
        } else {
          return;
        }
      }
      return i === _n2 && (!rest || match1(kinds, _spread, e, freezeInDev(rest)));
    };
  }
}

function toSubst(p, k) {
  if (isPayload(k)) {
    return void 0;
  } else if (void 0 === p || all1(isPrimitive, leafs, p)) {
    return always(p);
  } else if (isVariable(p)) {
    var i = p[PAYLOAD][0][PAYLOAD];
    return function (e) {
      return e[i];
    };
  } else if (isArray(p)) {
    var init = [];
    var rest = [];
    var spread = void 0;
    var n = p[LENGTH];
    for (var _i6 = 0; _i6 < n; ++_i6) {
      var x = p[_i6];
      if (isSpread(x)) {
        spread = x[PAYLOAD];
      } else {
        var side = void 0 !== spread ? rest : init;
        side.push(toSubst(x));
      }
    }
    return freezeResultInDev(function (e) {
      var r = [];
      for (var _i7 = 0, _n3 = init[LENGTH]; _i7 < _n3; ++_i7) {
        pushDefined(r, init[_i7](e));
      }if (0 <= spread) {
        var xs = e[spread];
        if (xs) for (var _i8 = 0, _n4 = xs[LENGTH]; _i8 < _n4; ++_i8) {
          pushDefined(r, xs[_i8]);
        }
      }
      for (var _i9 = 0, _n5 = rest[LENGTH]; _i9 < _n5; ++_i9) {
        pushDefined(r, rest[_i9](e));
      }return r;
    });
  } else {
    var _spread2 = p[PAYLOAD];
    if (_spread2) _spread2 = _spread2[0][PAYLOAD];
    p = modify(values, toSubst, p);
    return freezeResultInDev(function (e) {
      var r = {};
      for (var _k5 in p) {
        setDefined(r, _k5, p[_k5](e));
      }if (0 <= _spread2) {
        var _x4 = e[_spread2];
        if (_x4) for (var _k6 in _x4) {
          setDefined(r, _k6, _x4[_k6]);
        }
      }
      return r;
    });
  }
}

var oneway = function oneway(n, m, s) {
  return function (x) {
    var e = Array(n);
    if (m(e, x)) return s(e);
  };
};

//

var ungroupByFn = /*#__PURE__*/(process.env.NODE_ENV === 'production' ? id$1 : res(res(freeze)))(function (keyOf) {
  return function ungroupBy(xxs) {
    if (isArray(xxs)) {
      var ys = [];
      for (var i = 0, n = xxs.length; i < n; ++i) {
        var xs = xxs[i];
        if (!isArray(xs)) return;
        var m = xs.length;
        if (!m) return;
        var k = keyOf(xs[0]);
        if (void 0 === k) return;
        for (var j = 0, _m = xs.length; j < _m; ++j) {
          var x = xs[j];
          if (!identicalU(k, keyOf(x))) return;
          ys.push(x);
        }
      }
      return ys;
    }
  };
});

var groupByFn = /*#__PURE__*/(process.env.NODE_ENV === 'production' ? id$1 : res(res(freezeObjectOfObjects)))(function (keyOf) {
  return function groupBy(ys) {
    if (isArray(ys)) {
      var groups = new Map();
      for (var i = 0, n = ys.length; i < n; ++i) {
        var y = ys[i];
        var k = keyOf(y);
        if (void 0 === k) return;
        var xs = groups.get(k);
        if (void 0 !== xs) {
          xs.push(y);
        } else {
          groups.set(k, [y]);
        }
      }
      var xxs = [];
      groups.forEach(function (xs) {
        return xxs.push(xs);
      });
      return xxs;
    }
  };
});

//

var zW1Fn = /*#__PURE__*/(process.env.NODE_ENV === 'production' ? id$1 : res(res(freeze)))(function (fn$$1) {
  return function zipWith1(xys) {
    if (isPair(xys)) {
      var ys = xys[1];
      var n = ys[LENGTH];
      if (n) {
        var x = xys[0];
        var zs = Array(n);
        for (var i = 0; i < n; ++i) {
          if (void 0 === (zs[i] = fn$$1([x, ys[i]]))) return;
        }return zs;
      }
    }
  };
});

var unzW1Fn = /*#__PURE__*/(process.env.NODE_ENV === 'production' ? id$1 : res(res(freezeObjectOfObjects)))(function (fn$$1) {
  return function unzipWith1(zs) {
    if (isArray(zs)) {
      var n = zs[LENGTH];
      if (n) {
        var xy0 = fn$$1(zs[0]);
        if (isPair(xy0)) {
          var ys = Array(n);
          var x = xy0[0];
          ys[0] = xy0[1];
          for (var i = 1; i < n; ++i) {
            var xy = fn$$1(zs[i]);
            if (!isPair(xy) || !acyclicEqualsU(x, xy[0])) return;
            ys[i] = xy[1];
          }
          return [x, ys];
        }
      }
    }
  };
});

// Auxiliary

var seemsArrayLike = function seemsArrayLike(x) {
  return x instanceof Object && (x = x[LENGTH], x === x >> 0 && 0 <= x) || isString(x);
};

var Select = /*#__PURE__*/ConstantWith(function (l, r) {
  return void 0 !== l ? l : r;
});

var toFunction = /*#__PURE__*/(process.env.NODE_ENV === 'production' ? id$1 : par(0, ef(reqOptic)))(function toFunction(o) {
  switch (typeof o) {
    case 'string':
      return funProp(o);
    case 'number':
      return funIndex(o);
    case 'object':
      return composed(0, o);
    default:
      return o[LENGTH] === 4 ? o : fromReader(o);
  }
});

// Operations on optics

var assign$1 = /*#__PURE__*/curry(function assign$$1(o, x, s) {
  return setU([o, assignTo], x, s);
});

var disperse = /*#__PURE__*/curry(disperseU);

var modify = /*#__PURE__*/curry(modifyU);

var modifyAsync = /*#__PURE__*/curry(modifyAsyncU);

var remove = /*#__PURE__*/curry(function remove(o, s) {
  return setU(o, void 0, s);
});

var set = /*#__PURE__*/curry(setU);

var traverse = /*#__PURE__*/curry(traverseU);

// Nesting

function compose() {
  var n = arguments[LENGTH];
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
  for (var i = 0, n = arguments[LENGTH]; i < n; ++i) {
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

var choices = /*#__PURE__*/makeSemi(orElseU);

var choose = function choose(xiM2o) {
  return copyName(function (x, i, C, xi2yC) {
    return toFunction(xiM2o(x, i))(x, i, C, xi2yC);
  }, xiM2o);
};

var cond = /*#__PURE__*/(process.env.NODE_ENV === 'production' ? id$1 : function (fn$$1) {
  return function cond() {
    var pair = tup(ef(reqFn), ef(reqOptic));

    for (var _len = arguments.length, cs = Array(_len), _key = 0; _key < _len; _key++) {
      cs[_key] = arguments[_key];
    }

    arr(pair)(cs.slice(0, -1));
    arr(or(tup(ef(reqOptic)), pair))(cs.slice(-1));
    return fn$$1.apply(undefined, cs);
  };
})(function cond() {
  var n = arguments[LENGTH];
  var r = zero;
  while (n--) {
    var c = arguments[n];
    r = c[LENGTH] < 2 ? toFunction(c[0]) : eitherU(toFunction(c[1]), r)(c[0]);
  }
  return r;
});

var condOf = /*#__PURE__*/(process.env.NODE_ENV === 'production' ? id$1 : function (fn$$1) {
  return function condOf(of) {
    var pair = tup(ef(reqFn), ef(reqOptic));

    for (var _len2 = arguments.length, cs = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      cs[_key2 - 1] = arguments[_key2];
    }

    arr(pair)(cs.slice(0, -1));
    arr(or(tup(ef(reqOptic)), pair))(cs.slice(-1));
    return fn$$1.apply(undefined, [of].concat(cs));
  };
})(function condOf(of) {
  of = toFunction(of);

  var n = arguments[LENGTH] - 1;
  if (!n) return zero;

  var def = arguments[n];
  if (def[LENGTH] === 1) {
    --n;
    def = toFunction(def[0]);
  } else {
    def = zero;
  }

  var ps = Array(n);
  var os = Array(n + 1);
  for (var i = 0; i < n; ++i) {
    var c = arguments[i + 1];
    ps[i] = c[0];
    os[i] = toFunction(c[1]);
  }
  os[n] = def;

  return function condOf(x, i, F, xi2yF) {
    var min = n;
    of(x, i, Select, function (y, j) {
      for (var _i10 = 0; _i10 < min; ++_i10) {
        if (ps[_i10](y, j)) {
          min = _i10;
          if (_i10 === 0) return 0;else break;
        }
      }
    });
    return os[min](x, i, F, xi2yF);
  };
});

var ifElse = /*#__PURE__*/curry(function ifElse(c, t, e) {
  return eitherU(toFunction(t), toFunction(e))(c);
});

var orElse = /*#__PURE__*/curry(orElseU);

// Querying

var chain = /*#__PURE__*/curry(function chain(xi2yO, xO) {
  return [xO, choose(function (xM, i) {
    return void 0 !== xM ? xi2yO(xM, i) : zero;
  })];
});

var choice = function choice() {
  for (var _len3 = arguments.length, os = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
    os[_key3] = arguments[_key3];
  }

  return os.reduceRight(orElseU, zero);
};

var unless = /*#__PURE__*/eitherU(zero, identity);

var when = /*#__PURE__*/eitherU(identity, zero);

var optional = /*#__PURE__*/when(isDefined);

// Indices

var mapIx = function mapIx(ix2j) {
  return function mapIx(x, i, F, xj2yF) {
    return xj2yF(x, ix2j(i, x));
  };
};

var setIx = function setIx(j) {
  return function setIx(x, _i, _F, xj2yF) {
    return xj2yF(x, j);
  };
};

var tieIx = /*#__PURE__*/curry(function tieIx(ij2k, o) {
  o = toFunction(o);
  return copyName(function (x, i, F, yk2zF) {
    return o(x, i, F, function (y, j) {
      return yk2zF(y, ij2k(j, i));
    });
  }, o);
});

var joinIx = /*#__PURE__*/setName( /*#__PURE__*/tieIx(function (j, i) {
  return void 0 !== i ? void 0 !== j ? [i, j] : i : j;
}), 'joinIx');

var reIx = function reIx(o) {
  o = toFunction(o);
  return copyName(function (x, i, F, xi2yF) {
    var j = 0;
    return o(x, i, F, function (x) {
      return xi2yF(x, j++);
    });
  }, o);
};

var skipIx = /*#__PURE__*/setName( /*#__PURE__*/tieIx(sndU), 'skipIx');

// Debugging

function getLog(l, s) {
  var _traverseU = traverseU(SelectLog, function (x) {
    return { p: [x, consExcept], x: x, c: x };
  }, l, s),
      p = _traverseU.p,
      c = _traverseU.c;

  p = pushTo(p, ['%O']);
  for (var i = 2; i < p[LENGTH]; ++i) {
    p[0] += ' <= %O';
  }console.log.apply(console, p);
  return c;
}

function log() {
  var show = curry(function log(dir, x) {
    console.log.apply(console, copyToFrom([], 0, arguments, 0, arguments[LENGTH]).concat([dir, x]));
    return x;
  });
  return isoU(show('get'), show('set'));
}

// Operations on transforms

var transform = /*#__PURE__*/curry(function transform(o, s) {
  return modifyU(o, id$1, s);
});

var transformAsync = /*#__PURE__*/curry(function transformAsync(o, s) {
  return modifyAsyncU(o, id$1, s);
});

// Sequencing

var seq = /*#__PURE__*/(process.env.NODE_ENV === 'production' ? id$1 : function (fn$$1) {
  return function seq() {
    return par(2, ef(reqMonad('seq')))(fn$$1.apply(undefined, arguments));
  };
})(function seq() {
  var n = arguments[LENGTH];
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

var branchOr = /*#__PURE__*/(process.env.NODE_ENV === 'production' ? id$1 : par(1, ef(reqTemplate('branchOr'))))( /*#__PURE__*/curryN(2, function branchOr(otherwise) {
  otherwise = toFunction(otherwise);
  return function branchOr(template) {
    return branchOrU(otherwise, template);
  };
}));

var branch = /*#__PURE__*/branchOr(zero);

function branches() {
  var n = arguments[LENGTH];
  var template = {};
  for (var i = 0; i < n; ++i) {
    template[arguments[i]] = identity;
  }return branch(template);
}

// Traversals and combinators

function elems(xs, i, A, xi2yA) {
  return seemsArrayLike(xs) ? elemsI(xs, i, A, xi2yA) : A.of(xs);
}

var elemsTotal = function elemsTotal(xs, i, A, xi2yA) {
  return seemsArrayLike(xs) ? A === Identity ? mapPartialIndexU(xi2yA, xs, mapPartialIndexU) : A === Select ? selectInArrayLike(xi2yA, xs) : traversePartialIndex(A, xi2yA, xs, traversePartialIndex) : A.of(xs);
};

var entries = /*#__PURE__*/setName( /*#__PURE__*/toFunction([keyed, elems]), 'entries');

var keys$1 = /*#__PURE__*/setName( /*#__PURE__*/toFunction([keyed, elems, 0]), 'keys');

var keysEverywhere = function keysEverywhere(x, i, A, xi2yA) {
  var recEntry = function recEntry(kv, i) {
    return A.ap(A.map(pairPartial, xi2yA(kv[0], i)), recAny(kv[1], i));
  };
  var recAny = function recAny(x, i) {
    return isArray(x) ? elemsI(x, i, A, recAny) : isObject(x) ? entries(x, i, A, recEntry) : A.of(x);
  };
  return recAny(x, i);
};

var subseq = /*#__PURE__*/curry(subseqU);

var limit = /*#__PURE__*/subseq(0);

var offset = /*#__PURE__*/curry(function offset(begin, t) {
  return subseqU(begin, void 0, t);
});

function matches(re) {
  return function matches(x, _i, C, xi2yC) {
    if (isString(x)) {
      var map = C.map;

      if (re.global) {
        var m0 = [''];
        m0.input = x;
        m0[INDEX] = 0;
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
        }, xi2yC(m[0], m[INDEX]));
      }
    }
    return C.of(x);
  };
}

var values = /*#__PURE__*/setName( /*#__PURE__*/branchOr1Level(identity, protoless0), 'values');

function children(x, i, C, xi2yC) {
  return isArray(x) ? elemsI(x, i, C, xi2yC) : isObject(x) ? values(x, i, C, xi2yC) : C.of(x);
}

function flatten(x, i, C, xi2yC) {
  var rec = function rec(x, i) {
    return isArray(x) ? elemsI(x, i, C, rec) : void 0 !== x ? xi2yC(x, i) : C.of(x);
  };
  return rec(x, i);
}

function query() {
  var r = [];
  for (var i = 0, n = arguments[LENGTH]; i < n; ++i) {
    var o = toFunction(arguments[i]);
    r.push(satisfying(isDefinedAt(o)), o);
  }
  return r;
}

var satisfying = function satisfying(p) {
  return function satisfying(x, i, C, xi2yC) {
    var rec = function rec(x, i) {
      return p(x, i) ? xi2yC(x, i) : children(x, i, C, rec);
    };
    return rec(x, i);
  };
};

var leafs = /*#__PURE__*/satisfying(function (x) {
  return void 0 !== x && !isArray(x) && !isObject(x);
});

var whereEq = function whereEq(template) {
  return satisfying(and$1(branch(modify(leafs, is, template))));
};

// Folds over traversals

var all = /*#__PURE__*/curry(function all(xi2b, t, s) {
  return !getAsU(function (x, i) {
    if (!xi2b(x, i)) return true;
  }, t, s);
});

var and$1 = /*#__PURE__*/all(id$1);

var all1 = /*#__PURE__*/curry(function all1(xi2b, t, s) {
  var result = false;
  getAsU(function (x, i) {
    if (xi2b(x, i)) result = true;else return result = false;
  }, t, s);
  return result;
});

var and1 = /*#__PURE__*/all1(id$1);

var any = /*#__PURE__*/curry(function any(xi2b, t, s) {
  return !!getAsU(function (x, i) {
    if (xi2b(x, i)) return true;
  }, t, s);
});

var collectAs = /*#__PURE__*/(process.env.NODE_ENV === 'production' ? curry : res(freeze))(function collectAs(xi2y, t, s) {
  var results = [];
  getAsU(function (x, i) {
    var y = xi2y(x, i);
    if (void 0 !== y) results.push(y);
  }, t, s);
  return results;
});

var collect = /*#__PURE__*/collectAs(id$1);

var collectTotalAs = /*#__PURE__*/(process.env.NODE_ENV === 'production' ? curry : res(freeze))(function collectTotalAs(xi2y, t, s) {
  var results = [];
  getAsU(function (x, i) {
    results.push(xi2y(x, i));
  }, t, s);
  return results;
});

var collectTotal = /*#__PURE__*/collectTotalAs(id$1);

var concatAs = /*#__PURE__*/mkTraverse(id$1, ConstantOf);

var concat = /*#__PURE__*/concatAs(id$1);

var countIf = /*#__PURE__*/curry(function countIf(p, t, s) {
  return traverseU(Sum, function (x, i) {
    return p(x, i) ? 1 : 0;
  }, t, s);
});

var count = /*#__PURE__*/countIf(isDefined);

var countsAs = /*#__PURE__*/curry(function countsAs(xi2k, t, s) {
  var counts = new Map();
  getAsU(function (x, i) {
    var k = xi2k(x, i);
    var n = counts.get(k);
    counts.set(k, void 0 !== n ? n + 1 : 1);
  }, t, s);
  return counts;
});

var counts = /*#__PURE__*/countsAs(id$1);

var foldl = /*#__PURE__*/curry(function foldl(f, r, t, s) {
  getAsU(function (x, i) {
    r = f(r, x, i);
  }, t, s);
  return r;
});

var foldr = /*#__PURE__*/curry(function foldr(f, r, t, s) {
  var is = [];
  var xs = [];
  getAsU(function (x, i) {
    xs.push(x);
    is.push(i);
  }, t, s);
  for (var i = xs[LENGTH] - 1; 0 <= i; --i) {
    r = f(r, xs[i], is[i]);
  }return r;
});

var forEach = /*#__PURE__*/curry(function forEach(f, t, s) {
  return getAsU(function (x, i) {
    f(x, i);
  }, t, s);
});

var forEachWith = /*#__PURE__*/curry(function forEachWith(newC, ef$$1, t, s) {
  var c = newC();
  getAsU(function (x, i) {
    ef$$1(c, x, i);
  }, t, s);
  return c;
});

function get(l, s) {
  return 1 < arguments[LENGTH] ? getAsU(id$1, l, s) : function (s) {
    return getAsU(id$1, l, s);
  };
}

var getAs = /*#__PURE__*/curry(getAsU);

var isDefined$1 = /*#__PURE__*/curry(function isDefined$$1(t, s) {
  return void 0 !== getAsU(id$1, t, s);
});

var isEmpty = /*#__PURE__*/curry(function isEmpty(t, s) {
  return !getAsU(toTrue, t, s);
});

var joinAs = /*#__PURE__*/mkTraverse(toStringPartial, /*#__PURE__*/(process.env.NODE_ENV === 'production' ? id$1 : par(0, ef(reqString('`join` and `joinAs` expect a string delimiter'))))(function joinAs(d) {
  return ConstantWith(function (x, y) {
    return void 0 !== x ? void 0 !== y ? x + d + y : x : y;
  });
}));

var join = /*#__PURE__*/joinAs(id$1);

var maximumBy = /*#__PURE__*/mumBy(gtU);

var maximum = /*#__PURE__*/maximumBy(id$1);

var meanAs = /*#__PURE__*/curry(function meanAs(xi2y, t, s) {
  var sum = 0;
  var num = 0;
  getAsU(function (x, i) {
    var y = xi2y(x, i);
    if (void 0 !== y) {
      num += 1;
      sum += y;
    }
  }, t, s);
  return sum / num;
});

var mean = /*#__PURE__*/meanAs(id$1);

var minimumBy = /*#__PURE__*/mumBy(ltU);

var minimum = /*#__PURE__*/minimumBy(id$1);

var none = /*#__PURE__*/curry(function none(xi2b, t, s) {
  return !getAsU(function (x, i) {
    if (xi2b(x, i)) return true;
  }, t, s);
});

var or$1 = /*#__PURE__*/any(id$1);

var productAs = /*#__PURE__*/traverse( /*#__PURE__*/ConstantWith(multiplyU, 1));

var product = /*#__PURE__*/productAs( /*#__PURE__*/unto(1));

var select = process.env.NODE_ENV === 'production' ? get : /*#__PURE__*/curry(function select(l, s) {
  warn(select, '`select` has been obsoleted.  Just use `get`.  See CHANGELOG for details.');
  return get(l, s);
});

var selectAs = process.env.NODE_ENV === 'production' ? getAs : /*#__PURE__*/curry(function selectAs(f, l, s) {
  warn(selectAs, '`selectAs` has been obsoleted.  Just use `getAs`.  See CHANGELOG for details.');
  return getAs(f, l, s);
});

var sumAs = /*#__PURE__*/traverse(Sum);

var sum = /*#__PURE__*/sumAs(unto0);

// Creating new lenses

var foldTraversalLens = /*#__PURE__*/curry(function foldTraversalLens(fold, traversal) {
  return lensU(fold(traversal), set(traversal));
});

var getter = function getter(get) {
  return function (x, i, F, xi2yF) {
    return xi2yF(get(x, i), i);
  };
};

var lens = /*#__PURE__*/curry(lensU);

function partsOf(t) {
  if (arguments[LENGTH] !== 1) t = toFunction(compose.apply(null, arguments));
  return function partsOf(x, i, F, xi2yF) {
    return F.map(function (y) {
      return disperseU(t, y, x);
    }, xi2yF(collectTotal(t, x), i));
  };
}

var setter = /*#__PURE__*/lens(id$1);

// Enforcing invariants

function defaults(out) {
  function o2u(x) {
    return replaced(out, void 0, x);
  }
  return function defaults(x, i, F, xi2yF) {
    return F.map(o2u, xi2yF(void 0 !== x ? x : out, i));
  };
}

function define(v) {
  var untoV = unto(v);
  return function define(x, i, F, xi2yF) {
    return F.map(untoV, xi2yF(void 0 !== x ? x : v, i));
  };
}

var normalize = function normalize(xi2x) {
  return [reread(xi2x), rewrite(xi2x)];
};

function required(inn) {
  return replace$1(inn, void 0);
}

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

var filter = /*#__PURE__*/(process.env.NODE_ENV === 'production' ? id$1 : res(function (lens) {
  return toFunction([lens, isoU(id$1, ef(reqMaybeArray('`filter` must be set with undefined or an array-like object')))]);
}))(function filter(xi2b) {
  return function filter(xs, i, F, xi2yF) {
    var ts = void 0;
    var fs = array0;
    if (seemsArrayLike(xs)) partitionIntoIndex(xi2b, xs, ts = [], fs = []);
    return F.map(function (ts) {
      var tsN = ts ? ts[LENGTH] : 0;
      var fsN = fs[LENGTH];
      var n = tsN + fsN;
      return n === fsN ? fs : copyToFrom(copyToFrom(Array(n), 0, ts, 0, tsN), tsN, fs, 0, fsN);
    }, xi2yF(ts, i));
  };
});

function find(xih2b) {
  var hint = arguments[LENGTH] > 1 ? arguments[1] : { hint: 0 };
  return function find(xs, _i, F, xi2yF) {
    var ys = seemsArrayLike(xs) ? xs : '';
    var i = hint.hint = findIndexHint(hint, xih2b, ys);
    return F.map(function (v) {
      return setIndex(i, v, ys);
    }, xi2yF(ys[i], i));
  };
}

function findWith(o) {
  var oo = toFunction(o);
  var p = isDefinedAt(oo);
  return [arguments[LENGTH] > 1 ? find(p, arguments[1]) : find(p), oo];
}

var first = 0;

var index = process.env.NODE_ENV !== 'production' ? /*#__PURE__*/ef(reqIndex) : id$1;

var last = /*#__PURE__*/choose(function last(maybeArray) {
  return seemsArrayLike(maybeArray) && maybeArray[LENGTH] ? maybeArray[LENGTH] - 1 : 0;
});

var prefix = function prefix(n) {
  return slice(0, n);
};

var slice = /*#__PURE__*/(process.env.NODE_ENV === 'production' ? curry : res(function (lens) {
  return toFunction([lens, isoU(id$1, ef(reqMaybeArray('`slice` must be set with undefined or an array-like object')))]);
}))(function slice(begin, end) {
  return function slice(xs, i, F, xsi2yF) {
    var seems = seemsArrayLike(xs);
    var xsN = seems && xs[LENGTH];
    var b = sliceIndex(0, xsN, 0, begin);
    var e = sliceIndex(b, xsN, xsN, end);
    return F.map(function (zs) {
      var zsN = zs ? zs[LENGTH] : 0;
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

var prop = process.env.NODE_ENV === 'production' ? id$1 : function (x) {
  if (!isString(x)) errorGiven('`prop` expects a string', x);
  return x;
};

function props() {
  var n = arguments[LENGTH];
  var template = {};
  for (var i = 0, k; i < n; ++i) {
    template[k = arguments[i]] = k;
  }return pick(template);
}

function propsExcept() {
  var setish = create(null);
  for (var i = 0, n = arguments[LENGTH]; i < n; ++i) {
    setish[arguments[i]] = 'd';
  }return [disjoint(function (k) {
    return setish[k] || 't';
  }), 't'];
}

var propsOf = function propsOf(o) {
  warn(propsOf, '`propsOf` has been deprecated and there is no replacement.  See CHANGELOG for details.');
  return props.apply(null, keys(o));
};

function removable() {
  for (var _len4 = arguments.length, ps = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
    ps[_key4] = arguments[_key4];
  }

  function drop(y) {
    if (!(y instanceof Object)) return y;
    for (var i = 0, n = ps[LENGTH]; i < n; ++i) {
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

var pick = /*#__PURE__*/(process.env.NODE_ENV === 'production' ? id$1 : par(0, ef(reqTemplate('pick'))))(function pick(template) {
  return function (x, i, F, xi2yF) {
    return F.map(function (v) {
      return setPick(template, v, x);
    }, xi2yF(getPick(template, x), i));
  };
});

var replace$1 = /*#__PURE__*/curry(function replace$$1(inn, out) {
  function o2i(x) {
    return replaced(out, inn, x);
  }
  return function replace$$1(x, i, F, xi2yF) {
    return F.map(o2i, xi2yF(replaced(inn, out, x), i));
  };
});

// Inserters

function appendTo(xs, _, F, xi2yF) {
  var i = seemsArrayLike(xs) ? xs[LENGTH] : 0;
  return F.map(function (x) {
    return setIndex(i, x, xs);
  }, xi2yF(void 0, i));
}

var append = process.env.NODE_ENV === 'production' ? appendTo : function append(x, i, F, xi2yF) {
  warn(append, '`append` has been renamed to `appendTo`.  See CHANGELOG for details.');
  return appendTo(x, i, F, xi2yF);
};

var assignTo = /*#__PURE__*/(process.env.NODE_ENV === 'production' ? id$1 : function (iso) {
  return copyName(toFunction([isoU(id$1, freeze), iso]), iso);
})(function assignTo(x, i, F, xi2yF) {
  return F.map(function (y) {
    return assign({}, x instanceof Object ? x : null, y);
  }, xi2yF(void 0, i));
});

var prependTo = /*#__PURE__*/setName( /*#__PURE__*/toFunction([/*#__PURE__*/prefix(0), 0]), 'prependTo');

// Transforming

var appendOp = /*#__PURE__*/setName( /*#__PURE__*/inserterOp(appendTo), 'appendOp');

var assignOp = /*#__PURE__*/setName( /*#__PURE__*/inserterOp(assignTo), 'assignOp');

var modifyOp = function modifyOp(xi2y) {
  return function modifyOp(x, i, C, _xi2yC) {
    return C.of(xi2y(x, i));
  };
};

var prependOp = /*#__PURE__*/setName( /*#__PURE__*/inserterOp(prependTo), 'prependOp');

var setOp = function setOp(y) {
  return function setOp(_x, _i, C, _xi2yC) {
    return C.of(y);
  };
};

var removeOp = /*#__PURE__*/setOp();

var cross = /*#__PURE__*/setName( /*#__PURE__*/crossOr(removeOp), 'cross');

// Operations on isomorphisms

function getInverse(o, s) {
  return 1 < arguments[LENGTH] ? getInverseU(o, s) : function (s) {
    return getInverseU(o, s);
  };
}

// Creating new isomorphisms

var iso = /*#__PURE__*/curry(isoU);

var _ = /*#__PURE__*/new Variable(-1);

function mapping(ps) {
  var n = 0;
  if (isFunction(ps)) ps = ps.apply(null, nVars(n = ps[LENGTH]));
  checkPatternPairInDev(ps);
  var kinds = Array(n);
  var ms = ps.map(function (p) {
    return toMatch(kinds, p);
  });
  var ss = ps.map(toSubst);
  return isoU(oneway(n, ms[0], ss[1]), oneway(n, ms[1], ss[0]));
}

function mappings(ps) {
  if (isFunction(ps)) ps = ps.apply(null, nVars(ps[LENGTH]));
  return alternatives.apply(null, ps.map(mapping));
}

function pattern(p) {
  var n = 0;
  if (isFunction(p)) p = p.apply(null, nVars(n = p[LENGTH]));
  checkPatternInDev(p);
  var kinds = Array(n);
  var m = toMatch(kinds, p);
  return subset(function (x) {
    return m(Array(n), x);
  });
}

function patterns(ps) {
  if (isFunction(ps)) ps = ps.apply(null, nVars(ps[LENGTH]));
  return alternatives.apply(null, ps.map(pattern));
}

// Isomorphism combinators

var alternatives = /*#__PURE__*/makeSemi(orAlternativelyU);

var applyAt = /*#__PURE__*/curry(function applyAt(elements, transform) {
  return isoU(modify(elements, get(transform)), modify(elements, getInverse(transform)));
});

var attemptEveryDown = function attemptEveryDown(iso) {
  return isoU(transformEvery(rereadAttempt(get(iso))), transformEvery(rewriteAttempt(getInverse(iso))));
};

var attemptEveryUp = function attemptEveryUp(iso) {
  return isoU(transformEvery(rewriteAttempt(get(iso))), transformEvery(rereadAttempt(getInverse(iso))));
};

var attemptSomeDown = function attemptSomeDown(iso) {
  return isoU(transformSome(get(iso)), transformSome(getInverse(iso)));
};

var conjugate = /*#__PURE__*/curry(function conjugate(outer, inner) {
  return [outer, inner, inverse(outer)];
});

var inverse = function inverse(iso) {
  return function (x, i, F, xi2yF) {
    return F.map(function (x) {
      return getAsU(id$1, iso, x);
    }, xi2yF(setU(iso, x, void 0), i));
  };
};

var iterate = function iterate(aIa) {
  return isoU(iteratePartial(get(aIa)), iteratePartial(getInverse(aIa)));
};

var orAlternatively = /*#__PURE__*/curry(orAlternativelyU);

var fold = function fold(saIs) {
  return isoU(foldPartial(get(saIs)), unfoldPartial(getInverse(saIs)));
};

var unfold = function unfold(sIsa) {
  return isoU(unfoldPartial(get(sIsa)), foldPartial(getInverse(sIsa)));
};

// Basic isomorphisms

var complement = /*#__PURE__*/isoU(notPartial, notPartial);

var is = function is(v) {
  return isoU(function is(x) {
    return acyclicEqualsU(v, x);
  }, function (b) {
    return true === b ? v : void 0;
  });
};

function subset(predicate) {
  var subsetFn = subsetPartial(predicate);
  return isoU(subsetFn, subsetFn);
}

// Array isomorphisms

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

var arrays = function arrays(elem) {
  var fwd = getInverse(elem);
  var bwd = get(elem);
  var mapFwd = function mapFwd(x) {
    return mapsIfArray(fwd, x);
  };
  return function (x, i, F, xi2yF) {
    return F.map(mapFwd, xi2yF(mapsIfArray(bwd, x), i));
  };
};

var indexed = /*#__PURE__*/isoU( /*#__PURE__*/expect(seemsArrayLike, /*#__PURE__*/(process.env.NODE_ENV === 'production' ? id$1 : res(freezeObjectOfObjects))(function indexed(xs) {
  var n = xs[LENGTH];
  var xis = Array(n);
  for (var i = 0; i < n; ++i) {
    xis[i] = [i, xs[i]];
  }return xis;
})), /*#__PURE__*/expect(isArray, /*#__PURE__*/(process.env.NODE_ENV === 'production' ? id$1 : res(freeze))(function (xis) {
  var n = xis[LENGTH];
  var xs = Array(n);
  for (var i = 0; i < n; ++i) {
    var xi = xis[i];
    if (xi[LENGTH] === 2) xs[xi[0]] = xi[1];
  }
  n = xs[LENGTH];
  var j = 0;
  for (var _i11 = 0; _i11 < n; ++_i11) {
    var x = xs[_i11];
    if (void 0 !== x) {
      if (_i11 !== j) xs[j] = x;
      ++j;
    }
  }
  xs[LENGTH] = j;
  return xs;
})));

var reverse = /*#__PURE__*/isoU(rev, rev);

var singleton = /*#__PURE__*/setName( /*#__PURE__*/mapping(function (x) {
  return [[x], x];
}), 'singleton');

var groupBy = function groupBy(keyOf) {
  keyOf = toGetter(keyOf);
  return isoU(groupByFn(keyOf), ungroupByFn(keyOf));
};

var ungroupBy = function ungroupBy(keyOf) {
  keyOf = toGetter(keyOf);
  return isoU(ungroupByFn(keyOf), groupByFn(keyOf));
};

var zipWith1 = function zipWith1(iso) {
  return isoU(zW1Fn(get(iso)), unzW1Fn(getInverse(iso)));
};

var unzipWith1 = function unzipWith1(iso) {
  return isoU(unzW1Fn(get(iso)), zW1Fn(getInverse(iso)));
};

// Object isomorphisms

var disjoint = function disjoint(groupOf) {
  return function disjoint(x, i, F, xi2yF) {
    var fwd = disjointFwd(groupOf);
    return F.map(fwd, xi2yF(disjointBwd(groupOf, x), i));
  };
};

var multikeyed = /*#__PURE__*/isoU( /*#__PURE__*/expect( /*#__PURE__*/isInstanceOf(Object), /*#__PURE__*/(process.env.NODE_ENV === 'production' ? id$1 : res(freezeObjectOfObjects))(function multikeyed(o) {
  o = toObject$1(o);
  var ps = [];
  for (var k in o) {
    var v = o[k];
    if (isArray(v)) for (var i = 0, n = v[LENGTH]; i < n; ++i) {
      ps.push([k, v[i]]);
    } else ps.push([k, v]);
  }
  return ps;
})), /*#__PURE__*/expect(isArray, /*#__PURE__*/(process.env.NODE_ENV === 'production' ? id$1 : res(freezeObjectOfObjects))(function (ps) {
  var o = create(null);
  for (var i = 0, n = ps[LENGTH]; i < n; ++i) {
    var entry = ps[i];
    if (entry[LENGTH] === 2) {
      var k = entry[0];
      var v = entry[1];
      var was = o[k];
      if (was === void 0) o[k] = v;else if (isArray(was)) was.push(v);else o[k] = [was, v];
    }
  }
  return assign({}, o);
})));

// Standard isomorphisms

var json = /*#__PURE__*/(process.env.NODE_ENV === 'production' ? id$1 : res(function (iso) {
  return toFunction([iso, isoU(deepFreezeInDev, id$1)]);
}))(function json(options) {
  var _ref3 = options || object0,
      reviver = _ref3.reviver,
      replacer = _ref3.replacer,
      space = _ref3.space;

  return isoU(expect(isString, tryCatch(function json(text) {
    return JSON.parse(text, reviver);
  })), expect(isDefined, function (value) {
    return JSON.stringify(value, replacer, space);
  }));
});

var uri = /*#__PURE__*/stringIsoU( /*#__PURE__*/tryCatch(decodeURI), encodeURI);

var uriComponent = /*#__PURE__*/isoU( /*#__PURE__*/expect(isString, /*#__PURE__*/tryCatch(decodeURIComponent)), /*#__PURE__*/expect(isPrimitiveData, encodeURIComponent));

// String isomorphisms

var dropPrefix = function dropPrefix(pfx) {
  return stringIsoU(function dropPrefix(x) {
    return x.startsWith(pfx) ? x.slice(pfx[LENGTH]) : undefined;
  }, function (x) {
    return pfx + x;
  });
};

var dropSuffix = function dropSuffix(sfx) {
  return stringIsoU(function dropSuffix(x) {
    return x.endsWith(sfx) ? x.slice(0, x[LENGTH] - sfx[LENGTH]) : undefined;
  }, function (x) {
    return x + sfx;
  });
};

var replaces = /*#__PURE__*/curry(function replaces(i, o) {
  return stringIsoU(replace(toRegExpU(i, 'g'), o), replace(toRegExpU(o, 'g'), i));
});

var split = /*#__PURE__*/(process.env.NODE_ENV === 'production' ? id$1 : function (fn$$1) {
  return function split(_sep) {
    return toFunction([fn$$1.apply(null, arguments), isoU(freeze, id$1)]);
  };
})(function split(sep) {
  var re = arguments[LENGTH] > 1 ? arguments[1] : sep;
  return isoU(expect(isString, function (x) {
    return x.split(re);
  }), expect(isArray, function (xs) {
    return xs.join(sep);
  }));
});

var uncouple = /*#__PURE__*/(process.env.NODE_ENV === 'production' ? id$1 : function (fn$$1) {
  return function uncouple(_sep) {
    return toFunction([fn$$1.apply(null, arguments), isoU(freeze, id$1)]);
  };
})(function uncouple(sep) {
  var re = toRegExpU(arguments[LENGTH] > 1 ? arguments[1] : sep, '');
  return isoU(expect(isString, function (x) {
    var m = re.exec(x);
    return m ? [x.slice(0, m[INDEX]), x.slice(reLastIndex(m))] : [x, ''];
  }), function (kv) {
    if (isPair(kv)) {
      var k = kv[0];
      var v = kv[1];
      return v ? k + sep + v : k;
    }
  });
});

// Standardish isomorphisms

var querystring = /*#__PURE__*/setName( /*#__PURE__*/toFunction([/*#__PURE__*/reread(function (s) {
  return isString(s) ? s.replace(/\+/g, '%20') : s;
}), /*#__PURE__*/split('&'), /*#__PURE__*/array([/*#__PURE__*/uncouple('='), /*#__PURE__*/array(uriComponent)]), /*#__PURE__*/inverse(multikeyed)]), 'querystring');

// Arithmetic isomorphisms

var add$1 = function add$$1(c) {
  return numberIsoU(add(c), add(-c));
};
var divide = function divide(c) {
  return numberIsoU(divideBy(c), multiply(c));
};
var multiply$1 = function multiply$$1(c) {
  return numberIsoU(multiply(c), divideBy(c));
};
var negate$1 = /*#__PURE__*/numberIsoU(negate, negate);
var subtract = function subtract(c) {
  return numberIsoU(add(-c), add(c));
};

var pointer = function pointer(s) {
  if (s[0] === '#') s = decodeURIComponent(s);
  var ts = s.split('/');
  var n = ts[LENGTH];
  for (var i = 1; i < n; ++i) {
    var t = ts[i];
    ts[i - 1] = /^(0|[1-9]\d*)$/.test(t) ? ifElse(isArrayOrPrimitive, Number(t), t) : '-' === t ? ifElse(isArrayOrPrimitive, append, t) : t.replace('~1', '/').replace('~0', '~');
  }
  ts[LENGTH] = n - 1;
  return ts;
};

export { seemsArrayLike, Select, toFunction, assign$1 as assign, disperse, modify, modifyAsync, remove, set, traverse, compose, flat, lazy, choices, choose, cond, condOf, ifElse, orElse, chain, choice, unless, when, optional, zero, mapIx, setIx, tieIx, joinIx, reIx, skipIx, getLog, log, transform, transformAsync, seq, branchOr, branch, branches, elems, elemsTotal, entries, keys$1 as keys, keysEverywhere, subseq, limit, offset, matches, values, children, flatten, query, satisfying, leafs, whereEq, all, and$1 as and, all1, and1, any, collectAs, collect, collectTotalAs, collectTotal, concatAs, concat, countIf, count, countsAs, counts, foldl, foldr, forEach, forEachWith, get, getAs, isDefined$1 as isDefined, isEmpty, joinAs, join, maximumBy, maximum, meanAs, mean, minimumBy, minimum, none, or$1 as or, productAs, product, select, selectAs, sumAs, sum, foldTraversalLens, getter, lens, partsOf, setter, defaults, define, normalize, required, reread, rewrite, filter, find, findWith, first, index, last, prefix, slice, suffix, pickIn, prop, props, propsExcept, propsOf, removable, valueOr, pick, replace$1 as replace, appendTo, append, assignTo, prependTo, appendOp, assignOp, modifyOp, prependOp, setOp, removeOp, cross, getInverse, iso, _, mapping, mappings, pattern, patterns, alternatives, applyAt, attemptEveryDown, attemptEveryUp, attemptSomeDown, conjugate, inverse, iterate, orAlternatively, fold, unfold, complement, identity, is, subset, array, arrays, indexed, reverse, singleton, groupBy, ungroupBy, zipWith1, unzipWith1, disjoint, keyed, multikeyed, json, uri, uriComponent, dropPrefix, dropSuffix, replaces, split, uncouple, querystring, add$1 as add, divide, multiply$1 as multiply, negate$1 as negate, subtract, pointer };
