(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.L = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.inverse = exports.identity = exports.iso = exports.getInverse = exports.replace = exports.pick = exports.just = exports.to = exports.orElse = exports.valueOr = exports.prop = exports.slice = exports.index = exports.find = exports.filter = exports.append = exports.rewrite = exports.normalize = exports.define = exports.required = exports.defaults = exports.augment = exports.lens = exports.get = exports.sum = exports.product = exports.minimum = exports.maximum = exports.foldr = exports.foldl = exports.collect = exports.collectAs = exports.merge = exports.mergeAs = exports.concat = exports.concatAs = exports.optional = exports.when = exports.choose = exports.choice = exports.chain = exports.set = exports.remove = exports.modify = undefined;
exports.toFunction = toFunction;
exports.compose = compose;
exports.zero = zero;
exports.lazy = lazy;
exports.log = log;
exports.branch = branch;
exports.elems = elems;
exports.values = values;
exports.findWith = findWith;
exports.props = props;

var _infestines = require("infestines");

//

var sliceIndex = function sliceIndex(m, l, d, i) {
  return void 0 === i ? d : Math.min(Math.max(m, i < 0 ? l + i : i), l);
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

var seemsArrayLike = function seemsArrayLike(x) {
  return x instanceof Object && (x = x.length, x === x >> 0 && 0 <= x) || (0, _infestines.isString)(x);
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
    return ys;
  }
}

function copyToFrom(ys, k, xs, i, j) {
  while (i < j) {
    ys[k++] = xs[i++];
  }return ys;
}

//

var Ident = { map: _infestines.applyU, ap: _infestines.applyU, of: _infestines.id };

var Const = { map: _infestines.sndU };

var ConcatOf = function ConcatOf(ap, empty) {
  return { map: _infestines.sndU, ap: ap, of: (0, _infestines.always)(empty) };
};

var Monoid = function Monoid(concat, _empty) {
  return { concat: concat, empty: function empty() {
      return _empty;
    } };
};

var Mum = function Mum(ord) {
  return Monoid(function (y, x) {
    return void 0 !== x && (void 0 === y || ord(x, y)) ? x : y;
  });
};

//

var run = function run(o, C, xi2yC, s, i) {
  return toFunction(o)(C, xi2yC, s, i);
};

var constAs = function constAs(toConst) {
  return (0, _infestines.curryN)(4, function (xMi2y, m) {
    var C = toConst(m);
    return function (t, s) {
      return run(t, C, xMi2y, s);
    };
  });
};

//

var expectedOptic = "Expecting an optic";

function errorGiven(m, o) {
  console.error("partial.lenses:", m, "- given:", o);
  throw new Error(m);
}

function reqFunction(o) {
  if (!((0, _infestines.isFunction)(o) && o.length === 4)) errorGiven(expectedOptic, o);
}

function reqArray(o) {
  if (!(0, _infestines.isArray)(o)) errorGiven(expectedOptic, o);
}

//

function reqApplicative(f) {
  if (!f.of) errorGiven("Traversals require an applicative", f);
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

var Collect = ConcatOf(join);

//

function traversePartialIndex(A, xi2yA, xs) {
  var ap = A.ap,
      map = A.map;
  if ("dev" !== "production") reqApplicative(A);
  var xsA = (0, A.of)(void 0),
      i = xs.length;
  while (i--) {
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

var setProp = function setProp(k, v, o) {
  return void 0 !== v ? (0, _infestines.assocPartialU)(k, v, o) : (0, _infestines.dissocPartialU)(k, o);
};

var funProp = lensFrom(getProp, setProp);

//

var getIndex = function getIndex(i, xs) {
  return seemsArrayLike(xs) ? xs[i] : void 0;
};

function setIndex(i, x, xs) {
  if ("dev" !== "production" && i < 0) errorGiven("Negative indices are not supported by `index`", i);
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
}

var funIndex = lensFrom(getIndex, setIndex);

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
      if ("dev" !== "production") reqArray(o);
      return modifyComposed(o, 0, s, x);
    default:
      if ("dev" !== "production") reqFunction(o);
      return o(Ident, (0, _infestines.always)(x), s, void 0);
  }
}

function getU(l, s) {
  switch (typeof l) {
    case "string":
      return getProp(l, s);
    case "number":
      return getIndex(l, s);
    case "object":
      if ("dev" !== "production") reqArray(l);
      for (var i = 0, n = l.length, o; i < n; ++i) {
        switch (typeof (o = l[i])) {
          case "string":
            s = getProp(o, s);break;
          case "number":
            s = getIndex(o, s);break;
          default:
            s = getU(o, s);break;
        }
      }return s;
    default:
      if ("dev" !== "production") reqFunction(l);
      return l(Const, _infestines.id, s, void 0);
  }
}

function modifyComposed(os, xi2y, x, y) {
  if ("dev" !== "production") reqArray(os);
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
        x = composed(i, os)(Ident, xi2y || (0, _infestines.always)(y), x, os[i - 1]);
        n = i;
        break;
    }
  }
  if (n === os.length) x = xi2y ? xi2y(x, os[n - 1]) : y;
  for (var _o; 0 <= --n;) {
    x = (0, _infestines.isString)(_o = os[n]) ? setProp(_o, x, xs[n]) : setIndex(_o, x, xs[n]);
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
  return r;
}

var setPick = function setPick(template, x) {
  return function (value) {
    if ("dev" !== "production" && !(void 0 === value || value instanceof Object)) errorGiven("`pick` must be set with undefined or an object", value);
    for (var k in template) {
      x = setU(template[k], value && value[k], x);
    }return x;
  };
};

//

var branchOnMerge = function branchOnMerge(x, keys) {
  return function (xs) {
    var o = {},
        n = keys.length;
    for (var i = 0; i < n; ++i, xs = xs[1]) {
      var v = xs[0];
      o[keys[i]] = void 0 !== v ? v : o;
    }
    var r = void 0;
    if (x.constructor !== Object) x = Object.assign({}, x);
    for (var k in x) {
      var _v = o[k];
      if (o !== _v) {
        o[k] = o;
        if (!r) r = {};
        r[k] = void 0 !== _v ? _v : x[k];
      }
    }
    for (var _i = 0; _i < n; ++_i) {
      var _k = keys[_i];
      var _v2 = o[_k];
      if (o !== _v2) {
        if (!r) r = {};
        r[_k] = _v2;
      }
    }
    return r;
  };
};

var branchOn = function branchOn(keys, vals) {
  return function (A, xi2yA, x, _) {
    if ("dev" !== "production") reqApplicative(A);
    var of = A.of;
    var i = keys.length;
    if (!i) return of(object0ToUndefined(x));
    if (!(x instanceof Object)) x = _infestines.object0;
    var ap = A.ap,
        map = A.map;
    var xsA = of(0);
    while (i--) {
      var k = keys[i],
          v = x[k];
      xsA = ap(map(cpair, vals ? vals[i](A, xi2yA, v, k) : xi2yA(v, k)), xsA);
    }
    return map(branchOnMerge(x, keys), xsA);
  };
};

var normalizer = function normalizer(xi2x) {
  return function (F, xi2yF, x, i) {
    return (0, F.map)(function (x) {
      return xi2x(x, i);
    }, xi2yF(xi2x(x, i), i));
  };
};

var replaced = function replaced(inn, out, x) {
  return (0, _infestines.acyclicEqualsU)(x, inn) ? out : x;
};

function findIndex(xi2b, xs) {
  for (var i = 0, n = xs.length; i < n; ++i) {
    if (xi2b(xs[i], i)) return i;
  }return -1;
}

function partitionIntoIndex(xi2b, xs, ts, fs) {
  for (var i = 0, n = xs.length, x; i < n; ++i) {
    (xi2b(x = xs[i], i) ? ts : fs).push(x);
  }
}

//

function toFunction(o) {
  switch (typeof o) {
    case "string":
      return funProp(o);
    case "number":
      return funIndex(o);
    case "function":
      if ("dev" !== "production") reqFunction(o);
      return o;
    default:
      if ("dev" !== "production") reqArray(o);
      return composed(0, o);
  }
}

// Operations on optics

var modify = exports.modify = (0, _infestines.curry)(function (o, xi2x, s) {
  switch (typeof o) {
    case "string":
      return setProp(o, xi2x(getProp(o, s), o), s);
    case "number":
      return setIndex(o, xi2x(getIndex(o, s), o), s);
    case "function":
      if ("dev" !== "production") reqFunction(o);
      return o(Ident, xi2x, s, void 0);
    default:
      return modifyComposed(o, xi2x, s);
  }
});

var remove = exports.remove = (0, _infestines.curry)(function (o, s) {
  return setU(o, void 0, s);
});

var set = exports.set = (0, _infestines.curry)(setU);

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

var chain = exports.chain = (0, _infestines.curry)(function (xi2yO, xO) {
  return [xO, choose(function (xM, i) {
    return void 0 !== xM ? xi2yO(xM, i) : zero;
  })];
});

var choice = exports.choice = function choice() {
  for (var _len = arguments.length, ls = Array(_len), _key = 0; _key < _len; _key++) {
    ls[_key] = arguments[_key];
  }

  return choose(function (x) {
    var i = findIndex(function (l) {
      return void 0 !== getU(l, x);
    }, ls);
    return i < 0 ? zero : ls[i];
  });
};

var choose = exports.choose = function choose(xiM2o) {
  return function (C, xi2yC, x, i) {
    return run(xiM2o(x, i), C, xi2yC, x, i);
  };
};

var when = exports.when = function when(p) {
  return function (C, xi2yC, x, i) {
    return p(x, i) ? xi2yC(x, i) : zero(C, xi2yC, x, i);
  };
};

var optional = exports.optional = when(_infestines.isDefined);

function zero(C, xi2yC, x, i) {
  var of = C.of;
  return of ? of(x) : (0, C.map)((0, _infestines.always)(x), xi2yC(void 0, i));
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

  var show = function show(dir) {
    return function (x) {
      return console.log.apply(console, copyToFrom([], 0, _arguments, 0, _arguments.length).concat([dir, x])) || x;
    };
  };
  return iso(show("get"), show("set"));
}

// Operations on traversals

var concatAs = exports.concatAs = constAs(function (m) {
  return ConcatOf(m.concat, (0, m.empty)());
});

var concat = exports.concat = concatAs(_infestines.id);

var mergeAs = exports.mergeAs = "dev" === "production" ? concatAs : function (f, m, t, d) {
  if (!mergeAs.warned) {
    mergeAs.warned = 1;
    console.warn("partial.lenses: `mergeAs` is obsolete, just use `concatAs`");
  }
  return concatAs(f, m, t, d);
};

var merge = exports.merge = "dev" === "production" ? concat : function (m, t, d) {
  if (!merge.warned) {
    merge.warned = 1;
    console.warn("partial.lenses: `merge` is obsolete, just use `concat`");
  }
  return concat(m, t, d);
};

// Folds over traversals

var collectAs = exports.collectAs = (0, _infestines.curry)(function (xi2y, t, s) {
  return toArray(run(t, Collect, xi2y, s)) || [];
});

var collect = exports.collect = collectAs(_infestines.id);

var foldl = exports.foldl = (0, _infestines.curry)(function (f, r, t, s) {
  return fold(f, r, run(t, Collect, pair, s));
});

var foldr = exports.foldr = (0, _infestines.curry)(function (f, r, t, s) {
  var xs = collectAs(pair, t, s);
  for (var i = xs.length - 1; 0 <= i; --i) {
    var x = xs[i];
    r = f(r, x[0], x[1]);
  }
  return r;
});

var maximum = exports.maximum = concat(Mum(function (x, y) {
  return x > y;
}));

var minimum = exports.minimum = concat(Mum(function (x, y) {
  return x < y;
}));

var product = exports.product = concatAs(unto(1), Monoid(function (y, x) {
  return x * y;
}, 1));

var sum = exports.sum = concatAs(unto(0), Monoid(function (y, x) {
  return x + y;
}, 0));

// Creating new traversals

function branch(template) {
  var keys = [],
      vals = [];
  for (var k in template) {
    keys.push(k);
    vals.push(toFunction(template[k]));
  }
  return branchOn(keys, vals);
}

// Traversals and combinators

function elems(A, xi2yA, xs, _) {
  if (seemsArrayLike(xs)) {
    return A === Ident ? mapPartialIndexU(xi2yA, xs) : traversePartialIndex(A, xi2yA, xs);
  } else {
    if ("dev" !== "production") reqApplicative(A);
    return (0, A.of)(xs);
  }
}

function values(A, xi2yA, xs, _) {
  if (xs instanceof Object) {
    return branchOn((0, _infestines.keys)(xs))(A, xi2yA, xs);
  } else {
    if ("dev" !== "production") reqApplicative(A);
    return (0, A.of)(xs);
  }
}

// Operations on lenses

var get = exports.get = (0, _infestines.curry)(getU);

// Creating new lenses

var lens = exports.lens = (0, _infestines.curry)(function (get, set) {
  return function (F, xi2yF, x, i) {
    return (0, F.map)(function (y) {
      return set(y, x, i);
    }, xi2yF(get(x, i), i));
  };
});

// Computing derived props

var augment = exports.augment = function augment(template) {
  if ("dev" !== "production" && !(0, _infestines.isObject)(template)) errorGiven("`augment` expects a plain Object template", template);
  return lens(function (x) {
    x = (0, _infestines.dissocPartialU)(0, x);
    if (x) for (var k in template) {
      x[k] = template[k](x);
    }return x;
  }, function (y, x) {
    if ("dev" !== "production" && !(void 0 === y || y instanceof Object)) errorGiven("`augment` must be set with undefined or an object", y);
    if (y && y.constructor !== Object) y = Object.assign({}, y);
    if (!(x instanceof Object)) x = void 0;
    var z = void 0;
    function set(k, v) {
      if (!z) z = {};
      z[k] = v;
    }
    for (var k in y) {
      if (!(k in template)) set(k, y[k]);else if (x && k in x) set(k, x[k]);
    }
    return z;
  });
};

// Enforcing invariants

var defaults = exports.defaults = function defaults(out) {
  var o2u = function o2u(x) {
    return replaced(out, void 0, x);
  };
  return function (F, xi2yF, x, i) {
    return (0, F.map)(o2u, xi2yF(void 0 !== x ? x : out, i));
  };
};

var required = exports.required = function required(inn) {
  return replace(inn, void 0);
};

var define = exports.define = function define(v) {
  return normalizer(unto(v));
};

var normalize = exports.normalize = function normalize(xi2x) {
  return normalizer(function (x, i) {
    return void 0 !== x ? xi2x(x, i) : void 0;
  });
};

var rewrite = exports.rewrite = function rewrite(yi2y) {
  return function (F, xi2yF, x, i) {
    return (0, F.map)(function (y) {
      return void 0 !== y ? yi2y(y, i) : void 0;
    }, xi2yF(x, i));
  };
};

// Lensing arrays

var append = exports.append = function append(F, xi2yF, xs, i) {
  return (0, F.map)(function (x) {
    return setIndex(seemsArrayLike(xs) ? xs.length : 0, x, xs);
  }, xi2yF(void 0, i));
};

var filter = exports.filter = function filter(xi2b) {
  return function (F, xi2yF, xs, i) {
    var ts = void 0,
        fs = void 0;
    if (seemsArrayLike(xs)) partitionIntoIndex(xi2b, xs, ts = [], fs = []);
    return (0, F.map)(function (ts) {
      if ("dev" !== "production" && !(void 0 === ts || seemsArrayLike(ts))) errorGiven("`filter` must be set with undefined or an array-like object", ts);
      var tsN = ts ? ts.length : 0,
          fsN = fs ? fs.length : 0,
          n = tsN + fsN;
      if (n) return n === fsN ? fs : copyToFrom(copyToFrom(Array(n), 0, ts, 0, tsN), tsN, fs, 0, fsN);
    }, xi2yF(ts, i));
  };
};

var find = exports.find = function find(xi2b) {
  return choose(function (xs) {
    if (!seemsArrayLike(xs)) return 0;
    var i = findIndex(xi2b, xs);
    return i < 0 ? append : i;
  });
};

function findWith() {
  var lls = compose.apply(undefined, arguments);
  return [find(function (x) {
    return void 0 !== getU(lls, x);
  }), lls];
}

var index = exports.index = "dev" === "production" ? _infestines.id : function (x) {
  if (!Number.isInteger(x) || x < 0) errorGiven("`index` expects a non-negative integer", x);
  return x;
};

var slice = exports.slice = (0, _infestines.curry)(function (begin, end) {
  return function (F, xsi2yF, xs, i) {
    var seems = seemsArrayLike(xs),
        xsN = seems && xs.length,
        b = sliceIndex(0, xsN, 0, begin),
        e = sliceIndex(b, xsN, xsN, end);
    return (0, F.map)(function (zs) {
      if ("dev" !== "production" && !(void 0 === zs || seemsArrayLike(zs))) errorGiven("`slice` must be set with undefined or an array-like object", zs);
      var zsN = zs ? zs.length : 0,
          bPzsN = b + zsN,
          n = xsN - e + bPzsN;
      return n ? copyToFrom(copyToFrom(copyToFrom(Array(n), 0, xs, 0, b), b, zs, 0, zsN), bPzsN, xs, e, xsN) : void 0;
    }, xsi2yF(seems ? copyToFrom(Array(Math.max(0, e - b)), 0, xs, b, e) : void 0, i));
  };
});

// Lensing objects

var prop = exports.prop = "dev" === "production" ? _infestines.id : function (x) {
  if (!(0, _infestines.isString)(x)) errorGiven("`prop` expects a string", x);
  return x;
};

function props() {
  var n = arguments.length,
      template = {};
  for (var i = 0, k; i < n; ++i) {
    template[k = arguments[i]] = k;
  }return pick(template);
}

// Providing defaults

var valueOr = exports.valueOr = function valueOr(v) {
  return function (_F, xi2yF, x, i) {
    return xi2yF(void 0 !== x && x !== null ? x : v, i);
  };
};

// Adapting to data

var orElse = exports.orElse = (0, _infestines.curry)(function (d, l) {
  return choose(function (x) {
    return void 0 !== getU(l, x) ? l : d;
  });
});

// Read-only mapping

var to = exports.to = function to(wi2x) {
  return function (F, xi2yF, w, i) {
    return (0, F.map)((0, _infestines.always)(w), xi2yF(wi2x(w, i), i));
  };
};

var just = exports.just = function just(x) {
  return to((0, _infestines.always)(x));
};

// Transforming data

var pick = exports.pick = function pick(template) {
  if ("dev" !== "production" && !(0, _infestines.isObject)(template)) errorGiven("`pick` expects a plain Object template", template);
  return function (F, xi2yF, x, i) {
    return (0, F.map)(setPick(template, x), xi2yF(getPick(template, x), i));
  };
};

var replace = exports.replace = (0, _infestines.curry)(function (inn, out) {
  var o2i = function o2i(x) {
    return replaced(out, inn, x);
  };
  return function (F, xi2yF, x, i) {
    return (0, F.map)(o2i, xi2yF(replaced(inn, out, x), i));
  };
});

// Operations on isomorphisms

var getInverse = exports.getInverse = (0, _infestines.arityN)(2, setU);

// Creating new isomorphisms

var iso = exports.iso = (0, _infestines.curry)(function (bwd, fwd) {
  return function (F, xi2yF, x, i) {
    return (0, F.map)(fwd, xi2yF(bwd(x), i));
  };
});

// Isomorphisms and combinators

var identity = exports.identity = function identity(_F, xi2yF, x, i) {
  return xi2yF(x, i);
};

var inverse = exports.inverse = function inverse(iso) {
  return function (F, xi2yF, x, i) {
    return (0, F.map)(function (x) {
      return getU(iso, x);
    }, xi2yF(setU(iso, x), i));
  };
};

},{"infestines":undefined}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvcGFydGlhbC5sZW5zZXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7UUNtWmdCLFUsR0FBQSxVO1FBd0NBLE8sR0FBQSxPO1FBOEJBLEksR0FBQSxJO1FBT0EsSSxHQUFBLEk7UUFRQSxHLEdBQUEsRztRQTJEQSxNLEdBQUEsTTtRQVdBLEssR0FBQSxLO1FBWUEsTSxHQUFBLE07UUEyR0EsUSxHQUFBLFE7UUEyQ0EsSyxHQUFBLEs7O0FBaHRCaEI7O0FBb0JBOztBQUVBLElBQU0sYUFBYSxTQUFiLFVBQWEsQ0FBQyxDQUFELEVBQUksQ0FBSixFQUFPLENBQVAsRUFBVSxDQUFWO0FBQUEsU0FDakIsS0FBSyxDQUFMLEtBQVcsQ0FBWCxHQUFlLENBQWYsR0FBbUIsS0FBSyxHQUFMLENBQVMsS0FBSyxHQUFMLENBQVMsQ0FBVCxFQUFZLElBQUksQ0FBSixHQUFRLElBQUksQ0FBWixHQUFnQixDQUE1QixDQUFULEVBQXlDLENBQXpDLENBREY7QUFBQSxDQUFuQjs7QUFHQSxTQUFTLElBQVQsQ0FBYyxFQUFkLEVBQWtCLEVBQWxCLEVBQXNCO0FBQUMsU0FBTyxDQUFDLEVBQUQsRUFBSyxFQUFMLENBQVA7QUFBZ0I7QUFDdkMsSUFBTSxRQUFRLFNBQVIsS0FBUTtBQUFBLFNBQUs7QUFBQSxXQUFNLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBTjtBQUFBLEdBQUw7QUFBQSxDQUFkOztBQUVBLElBQU0sT0FBTyxTQUFQLElBQU87QUFBQSxTQUFLO0FBQUEsV0FBSyxLQUFLLENBQUwsS0FBVyxDQUFYLEdBQWUsQ0FBZixHQUFtQixDQUF4QjtBQUFBLEdBQUw7QUFBQSxDQUFiOztBQUVBLElBQU0saUJBQWlCLFNBQWpCLGNBQWlCO0FBQUEsU0FDckIsYUFBYSxNQUFiLEtBQXdCLElBQUksRUFBRSxNQUFOLEVBQWMsTUFBTyxLQUFLLENBQVosSUFBa0IsS0FBSyxDQUE3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QUFFLEVBQUUsR0FBTCxFQUFVLEdBQVYsRUFBZSxNQUFNLFNBQVMsR0FBVCxFQUFjLEdBQWQsRUFBbUIsQ0FBbkIsQ0FBTixFQUE2QixDQUE3QixDQUFmLENBQXBCO0FBQUEsR0FBUDtBQUNELENBSHNCLENBQWhCOztBQUtQOztBQUVPLElBQU0sa0NBQWEsd0JBQU8sQ0FBUCxFQUFVLElBQVYsQ0FBbkI7O0FBRVA7O0FBRU8sSUFBTSxvQkFDWCx1QkFBTSxVQUFDLEdBQUQsRUFBTSxHQUFOO0FBQUEsU0FBYyxVQUFDLENBQUQsRUFBSSxLQUFKLEVBQVcsQ0FBWCxFQUFjLENBQWQ7QUFBQSxXQUFvQixDQUFDLEdBQUUsRUFBRSxHQUFMLEVBQVUsR0FBVixFQUFlLE1BQU0sSUFBSSxDQUFKLENBQU4sRUFBYyxDQUFkLENBQWYsQ0FBcEI7QUFBQSxHQUFkO0FBQUEsQ0FBTixDQURLOztBQUdQOztBQUVPLElBQU0sOEJBQVcsU0FBWCxRQUFXLENBQUMsRUFBRCxFQUFLLEtBQUwsRUFBWSxDQUFaLEVBQWUsQ0FBZjtBQUFBLFNBQXFCLE1BQU0sQ0FBTixFQUFTLENBQVQsQ0FBckI7QUFBQSxDQUFqQjs7QUFFQSxJQUFNLDRCQUFVLFNBQVYsT0FBVTtBQUFBLFNBQU8sVUFBQyxDQUFELEVBQUksS0FBSixFQUFXLENBQVgsRUFBYyxDQUFkO0FBQUEsV0FDNUIsQ0FBQyxHQUFFLEVBQUUsR0FBTCxFQUFVO0FBQUEsYUFBSyxLQUFLLEdBQUwsRUFBVSxDQUFWLENBQUw7QUFBQSxLQUFWLEVBQTZCLE1BQU0sS0FBSyxHQUFMLEVBQVUsQ0FBVixDQUFOLEVBQW9CLENBQXBCLENBQTdCLENBRDRCO0FBQUEsR0FBUDtBQUFBLENBQWhCIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCB7XG4gIGFjeWNsaWNFcXVhbHNVLFxuICBhbHdheXMsXG4gIGFwcGx5VSxcbiAgYXJpdHlOLFxuICBhc3NvY1BhcnRpYWxVLFxuICBjdXJyeSxcbiAgY3VycnlOLFxuICBkaXNzb2NQYXJ0aWFsVSxcbiAgaWQsXG4gIGlzQXJyYXksXG4gIGlzRGVmaW5lZCxcbiAgaXNGdW5jdGlvbixcbiAgaXNPYmplY3QsXG4gIGlzU3RyaW5nLFxuICBrZXlzLFxuICBvYmplY3QwLFxuICBzbmRVXG59IGZyb20gXCJpbmZlc3RpbmVzXCJcblxuLy9cblxuY29uc3Qgc2xpY2VJbmRleCA9IChtLCBsLCBkLCBpKSA9PlxuICB2b2lkIDAgPT09IGkgPyBkIDogTWF0aC5taW4oTWF0aC5tYXgobSwgaSA8IDAgPyBsICsgaSA6IGkpLCBsKVxuXG5mdW5jdGlvbiBwYWlyKHgwLCB4MSkge3JldHVybiBbeDAsIHgxXX1cbmNvbnN0IGNwYWlyID0geCA9PiB4cyA9PiBbeCwgeHNdXG5cbmNvbnN0IHVudG8gPSBjID0+IHggPT4gdm9pZCAwICE9PSB4ID8geCA6IGNcblxuY29uc3Qgc2VlbXNBcnJheUxpa2UgPSB4ID0+XG4gIHggaW5zdGFuY2VvZiBPYmplY3QgJiYgKHggPSB4Lmxlbmd0aCwgeCA9PT0gKHggPj4gMCkgJiYgMCA8PSB4KSB8fFxuICBpc1N0cmluZyh4KVxuXG4vL1xuXG5mdW5jdGlvbiBtYXBQYXJ0aWFsSW5kZXhVKHhpMnksIHhzKSB7XG4gIGNvbnN0IG4gPSB4cy5sZW5ndGgsIHlzID0gQXJyYXkobilcbiAgbGV0IGogPSAwXG4gIGZvciAobGV0IGk9MCwgeTsgaTxuOyArK2kpXG4gICAgaWYgKHZvaWQgMCAhPT0gKHkgPSB4aTJ5KHhzW2ldLCBpKSkpXG4gICAgICB5c1tqKytdID0geVxuICBpZiAoaikge1xuICAgIGlmIChqIDwgbilcbiAgICAgIHlzLmxlbmd0aCA9IGpcbiAgICByZXR1cm4geXNcbiAgfVxufVxuXG5mdW5jdGlvbiBjb3B5VG9Gcm9tKHlzLCBrLCB4cywgaSwgaikge1xuICB3aGlsZSAoaSA8IGopXG4gICAgeXNbaysrXSA9IHhzW2krK11cbiAgcmV0dXJuIHlzXG59XG5cbi8vXG5cbmNvbnN0IElkZW50ID0ge21hcDogYXBwbHlVLCBhcDogYXBwbHlVLCBvZjogaWR9XG5cbmNvbnN0IENvbnN0ID0ge21hcDogc25kVX1cblxuY29uc3QgQ29uY2F0T2YgPSAoYXAsIGVtcHR5KSA9PiAoe21hcDogc25kVSwgYXAsIG9mOiBhbHdheXMoZW1wdHkpfSlcblxuY29uc3QgTW9ub2lkID0gKGNvbmNhdCwgZW1wdHkpID0+ICh7Y29uY2F0LCBlbXB0eTogKCkgPT4gZW1wdHl9KVxuXG5jb25zdCBNdW0gPSBvcmQgPT5cbiAgTW9ub2lkKCh5LCB4KSA9PiB2b2lkIDAgIT09IHggJiYgKHZvaWQgMCA9PT0geSB8fCBvcmQoeCwgeSkpID8geCA6IHkpXG5cbi8vXG5cbmNvbnN0IHJ1biA9IChvLCBDLCB4aTJ5QywgcywgaSkgPT4gdG9GdW5jdGlvbihvKShDLCB4aTJ5QywgcywgaSlcblxuY29uc3QgY29uc3RBcyA9IHRvQ29uc3QgPT4gY3VycnlOKDQsICh4TWkyeSwgbSkgPT4ge1xuICBjb25zdCBDID0gdG9Db25zdChtKVxuICByZXR1cm4gKHQsIHMpID0+IHJ1bih0LCBDLCB4TWkyeSwgcylcbn0pXG5cbi8vXG5cbmNvbnN0IGV4cGVjdGVkT3B0aWMgPSBcIkV4cGVjdGluZyBhbiBvcHRpY1wiXG5cbmZ1bmN0aW9uIGVycm9yR2l2ZW4obSwgbykge1xuICBjb25zb2xlLmVycm9yKFwicGFydGlhbC5sZW5zZXM6XCIsIG0sIFwiLSBnaXZlbjpcIiwgbylcbiAgdGhyb3cgbmV3IEVycm9yKG0pXG59XG5cbmZ1bmN0aW9uIHJlcUZ1bmN0aW9uKG8pIHtcbiAgaWYgKCEoaXNGdW5jdGlvbihvKSAmJiBvLmxlbmd0aCA9PT0gNCkpXG4gICAgZXJyb3JHaXZlbihleHBlY3RlZE9wdGljLCBvKVxufVxuXG5mdW5jdGlvbiByZXFBcnJheShvKSB7XG4gIGlmICghaXNBcnJheShvKSlcbiAgICBlcnJvckdpdmVuKGV4cGVjdGVkT3B0aWMsIG8pXG59XG5cbi8vXG5cbmZ1bmN0aW9uIHJlcUFwcGxpY2F0aXZlKGYpIHtcbiAgaWYgKCFmLm9mKVxuICAgIGVycm9yR2l2ZW4oXCJUcmF2ZXJzYWxzIHJlcXVpcmUgYW4gYXBwbGljYXRpdmVcIiwgZilcbn1cblxuLy9cblxuZnVuY3Rpb24gSm9pbihsLCByKSB7dGhpcy5sID0gbDsgdGhpcy5yID0gcn1cblxuY29uc3QgaXNKb2luID0gbiA9PiBuLmNvbnN0cnVjdG9yID09PSBKb2luXG5cbmNvbnN0IGpvaW4gPSAobCwgcikgPT4gdm9pZCAwICE9PSBsID8gdm9pZCAwICE9PSByID8gbmV3IEpvaW4obCwgcikgOiBsIDogclxuXG5jb25zdCBjam9pbiA9IGggPT4gdCA9PiBqb2luKGgsIHQpXG5cbmZ1bmN0aW9uIHB1c2hUbyhuLCB5cykge1xuICB3aGlsZSAobiAmJiBpc0pvaW4obikpIHtcbiAgICBjb25zdCBsID0gbi5sXG4gICAgbiA9IG4uclxuICAgIGlmIChsICYmIGlzSm9pbihsKSkge1xuICAgICAgcHVzaFRvKGwubCwgeXMpXG4gICAgICBwdXNoVG8obC5yLCB5cylcbiAgICB9IGVsc2Uge1xuICAgICAgeXMucHVzaChsKVxuICAgIH1cbiAgfVxuICB5cy5wdXNoKG4pXG59XG5cbmZ1bmN0aW9uIHRvQXJyYXkobikge1xuICBpZiAodm9pZCAwICE9PSBuKSB7XG4gICAgY29uc3QgeXMgPSBbXVxuICAgIHB1c2hUbyhuLCB5cylcbiAgICByZXR1cm4geXNcbiAgfVxufVxuXG5mdW5jdGlvbiBmb2xkUmVjKGYsIHIsIG4pIHtcbiAgd2hpbGUgKGlzSm9pbihuKSkge1xuICAgIGNvbnN0IGwgPSBuLmxcbiAgICBuID0gbi5yXG4gICAgciA9IGlzSm9pbihsKVxuICAgICAgPyBmb2xkUmVjKGYsIGZvbGRSZWMoZiwgciwgbC5sKSwgbC5yKVxuICAgICAgOiBmKHIsIGxbMF0sIGxbMV0pXG4gIH1cbiAgcmV0dXJuIGYociwgblswXSwgblsxXSlcbn1cblxuY29uc3QgZm9sZCA9IChmLCByLCBuKSA9PiB2b2lkIDAgIT09IG4gPyBmb2xkUmVjKGYsIHIsIG4pIDogclxuXG5jb25zdCBDb2xsZWN0ID0gQ29uY2F0T2Yoam9pbilcblxuLy9cblxuZnVuY3Rpb24gdHJhdmVyc2VQYXJ0aWFsSW5kZXgoQSwgeGkyeUEsIHhzKSB7XG4gIGNvbnN0IGFwID0gQS5hcCwgbWFwID0gQS5tYXBcbiAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIilcbiAgICByZXFBcHBsaWNhdGl2ZShBKVxuICBsZXQgeHNBID0gKDAsQS5vZikodm9pZCAwKSwgaSA9IHhzLmxlbmd0aFxuICB3aGlsZSAoaS0tKVxuICAgIHhzQSA9IGFwKG1hcChjam9pbiwgeGkyeUEoeHNbaV0sIGkpKSwgeHNBKVxuICByZXR1cm4gbWFwKHRvQXJyYXksIHhzQSlcbn1cblxuLy9cblxuZnVuY3Rpb24gb2JqZWN0MFRvVW5kZWZpbmVkKG8pIHtcbiAgaWYgKCEobyBpbnN0YW5jZW9mIE9iamVjdCkpXG4gICAgcmV0dXJuIG9cbiAgZm9yIChjb25zdCBrIGluIG8pXG4gICAgcmV0dXJuIG9cbn1cblxuLy9cblxuY29uc3QgbGVuc0Zyb20gPSAoZ2V0LCBzZXQpID0+IGkgPT4gKEYsIHhpMnlGLCB4LCBfKSA9PlxuICAoMCxGLm1hcCkodiA9PiBzZXQoaSwgdiwgeCksIHhpMnlGKGdldChpLCB4KSwgaSkpXG5cbi8vXG5cbmNvbnN0IGdldFByb3AgPSAoaywgbykgPT4gbyBpbnN0YW5jZW9mIE9iamVjdCA/IG9ba10gOiB2b2lkIDBcblxuY29uc3Qgc2V0UHJvcCA9IChrLCB2LCBvKSA9PlxuICB2b2lkIDAgIT09IHYgPyBhc3NvY1BhcnRpYWxVKGssIHYsIG8pIDogZGlzc29jUGFydGlhbFUoaywgbylcblxuY29uc3QgZnVuUHJvcCA9IGxlbnNGcm9tKGdldFByb3AsIHNldFByb3ApXG5cbi8vXG5cbmNvbnN0IGdldEluZGV4ID0gKGksIHhzKSA9PiBzZWVtc0FycmF5TGlrZSh4cykgPyB4c1tpXSA6IHZvaWQgMFxuXG5mdW5jdGlvbiBzZXRJbmRleChpLCB4LCB4cykge1xuICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiICYmIGkgPCAwKVxuICAgIGVycm9yR2l2ZW4oXCJOZWdhdGl2ZSBpbmRpY2VzIGFyZSBub3Qgc3VwcG9ydGVkIGJ5IGBpbmRleGBcIiwgaSlcbiAgaWYgKCFzZWVtc0FycmF5TGlrZSh4cykpXG4gICAgeHMgPSBcIlwiXG4gIGNvbnN0IG4gPSB4cy5sZW5ndGhcbiAgaWYgKHZvaWQgMCAhPT0geCkge1xuICAgIGNvbnN0IG0gPSBNYXRoLm1heChpKzEsIG4pLCB5cyA9IEFycmF5KG0pXG4gICAgZm9yIChsZXQgaj0wOyBqPG07ICsrailcbiAgICAgIHlzW2pdID0geHNbal1cbiAgICB5c1tpXSA9IHhcbiAgICByZXR1cm4geXNcbiAgfSBlbHNlIHtcbiAgICBpZiAoMCA8IG4pIHtcbiAgICAgIGlmIChuIDw9IGkpXG4gICAgICAgIHJldHVybiBjb3B5VG9Gcm9tKEFycmF5KG4pLCAwLCB4cywgMCwgbilcbiAgICAgIGlmICgxIDwgbikge1xuICAgICAgICBjb25zdCB5cyA9IEFycmF5KG4tMSlcbiAgICAgICAgZm9yIChsZXQgaj0wOyBqPGk7ICsrailcbiAgICAgICAgICB5c1tqXSA9IHhzW2pdXG4gICAgICAgIGZvciAobGV0IGo9aSsxOyBqPG47ICsrailcbiAgICAgICAgICB5c1tqLTFdID0geHNbal1cbiAgICAgICAgcmV0dXJuIHlzXG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbmNvbnN0IGZ1bkluZGV4ID0gbGVuc0Zyb20oZ2V0SW5kZXgsIHNldEluZGV4KVxuXG4vL1xuXG5jb25zdCBjbG9zZSA9IChvLCBGLCB4aTJ5RikgPT4gKHgsIGkpID0+IG8oRiwgeGkyeUYsIHgsIGkpXG5cbmZ1bmN0aW9uIGNvbXBvc2VkKG9pMCwgb3MpIHtcbiAgY29uc3QgbiA9IG9zLmxlbmd0aCAtIG9pMFxuICBsZXQgZnNcbiAgaWYgKG4gPCAyKSB7XG4gICAgcmV0dXJuIG4gPyB0b0Z1bmN0aW9uKG9zW29pMF0pIDogaWRlbnRpdHlcbiAgfSBlbHNlIHtcbiAgICBmcyA9IEFycmF5KG4pXG4gICAgZm9yIChsZXQgaT0wO2k8bjsrK2kpXG4gICAgICBmc1tpXSA9IHRvRnVuY3Rpb24ob3NbaStvaTBdKVxuICAgIHJldHVybiAoRiwgeGkyeUYsIHgsIGkpID0+IHtcbiAgICAgIGxldCBrPW5cbiAgICAgIHdoaWxlICgtLWspXG4gICAgICAgIHhpMnlGID0gY2xvc2UoZnNba10sIEYsIHhpMnlGKVxuICAgICAgcmV0dXJuIGZzWzBdKEYsIHhpMnlGLCB4LCBpKVxuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBzZXRVKG8sIHgsIHMpIHtcbiAgc3dpdGNoICh0eXBlb2Ygbykge1xuICAgIGNhc2UgXCJzdHJpbmdcIjpcbiAgICAgIHJldHVybiBzZXRQcm9wKG8sIHgsIHMpXG4gICAgY2FzZSBcIm51bWJlclwiOlxuICAgICAgcmV0dXJuIHNldEluZGV4KG8sIHgsIHMpXG4gICAgY2FzZSBcIm9iamVjdFwiOlxuICAgICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIilcbiAgICAgICAgcmVxQXJyYXkobylcbiAgICAgIHJldHVybiBtb2RpZnlDb21wb3NlZChvLCAwLCBzLCB4KVxuICAgIGRlZmF1bHQ6XG4gICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKVxuICAgICAgICByZXFGdW5jdGlvbihvKVxuICAgICAgcmV0dXJuIG8oSWRlbnQsIGFsd2F5cyh4KSwgcywgdm9pZCAwKVxuICB9XG59XG5cbmZ1bmN0aW9uIGdldFUobCwgcykge1xuICBzd2l0Y2ggKHR5cGVvZiBsKSB7XG4gICAgY2FzZSBcInN0cmluZ1wiOlxuICAgICAgcmV0dXJuIGdldFByb3AobCwgcylcbiAgICBjYXNlIFwibnVtYmVyXCI6XG4gICAgICByZXR1cm4gZ2V0SW5kZXgobCwgcylcbiAgICBjYXNlIFwib2JqZWN0XCI6XG4gICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKVxuICAgICAgICByZXFBcnJheShsKVxuICAgICAgZm9yIChsZXQgaT0wLCBuPWwubGVuZ3RoLCBvOyBpPG47ICsraSlcbiAgICAgICAgc3dpdGNoICh0eXBlb2YgKG8gPSBsW2ldKSkge1xuICAgICAgICAgIGNhc2UgXCJzdHJpbmdcIjogcyA9IGdldFByb3Aobywgcyk7IGJyZWFrXG4gICAgICAgICAgY2FzZSBcIm51bWJlclwiOiBzID0gZ2V0SW5kZXgobywgcyk7IGJyZWFrXG4gICAgICAgICAgZGVmYXVsdDogcyA9IGdldFUobywgcyk7IGJyZWFrXG4gICAgICAgIH1cbiAgICAgIHJldHVybiBzXG4gICAgZGVmYXVsdDpcbiAgICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpXG4gICAgICAgIHJlcUZ1bmN0aW9uKGwpXG4gICAgICByZXR1cm4gbChDb25zdCwgaWQsIHMsIHZvaWQgMClcbiAgfVxufVxuXG5mdW5jdGlvbiBtb2RpZnlDb21wb3NlZChvcywgeGkyeSwgeCwgeSkge1xuICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKVxuICAgIHJlcUFycmF5KG9zKVxuICBsZXQgbiA9IG9zLmxlbmd0aFxuICBjb25zdCB4cyA9IEFycmF5KG4pXG4gIGZvciAobGV0IGk9MCwgbzsgaTxuOyArK2kpIHtcbiAgICB4c1tpXSA9IHhcbiAgICBzd2l0Y2ggKHR5cGVvZiAobyA9IG9zW2ldKSkge1xuICAgICAgY2FzZSBcInN0cmluZ1wiOlxuICAgICAgICB4ID0gZ2V0UHJvcChvLCB4KVxuICAgICAgICBicmVha1xuICAgICAgY2FzZSBcIm51bWJlclwiOlxuICAgICAgICB4ID0gZ2V0SW5kZXgobywgeClcbiAgICAgICAgYnJlYWtcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHggPSBjb21wb3NlZChpLCBvcykoSWRlbnQsIHhpMnkgfHwgYWx3YXlzKHkpLCB4LCBvc1tpLTFdKVxuICAgICAgICBuID0gaVxuICAgICAgICBicmVha1xuICAgIH1cbiAgfVxuICBpZiAobiA9PT0gb3MubGVuZ3RoKVxuICAgIHggPSB4aTJ5ID8geGkyeSh4LCBvc1tuLTFdKSA6IHlcbiAgZm9yIChsZXQgbzsgMCA8PSAtLW47KVxuICAgIHggPSBpc1N0cmluZyhvID0gb3Nbbl0pXG4gICAgICAgID8gc2V0UHJvcChvLCB4LCB4c1tuXSlcbiAgICAgICAgOiBzZXRJbmRleChvLCB4LCB4c1tuXSlcbiAgcmV0dXJuIHhcbn1cblxuLy9cblxuZnVuY3Rpb24gZ2V0UGljayh0ZW1wbGF0ZSwgeCkge1xuICBsZXQgclxuICBmb3IgKGNvbnN0IGsgaW4gdGVtcGxhdGUpIHtcbiAgICBjb25zdCB2ID0gZ2V0VSh0ZW1wbGF0ZVtrXSwgeClcbiAgICBpZiAodm9pZCAwICE9PSB2KSB7XG4gICAgICBpZiAoIXIpXG4gICAgICAgIHIgPSB7fVxuICAgICAgcltrXSA9IHZcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJcbn1cblxuY29uc3Qgc2V0UGljayA9ICh0ZW1wbGF0ZSwgeCkgPT4gdmFsdWUgPT4ge1xuICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiICYmXG4gICAgICAhKHZvaWQgMCA9PT0gdmFsdWUgfHwgdmFsdWUgaW5zdGFuY2VvZiBPYmplY3QpKVxuICAgIGVycm9yR2l2ZW4oXCJgcGlja2AgbXVzdCBiZSBzZXQgd2l0aCB1bmRlZmluZWQgb3IgYW4gb2JqZWN0XCIsIHZhbHVlKVxuICBmb3IgKGNvbnN0IGsgaW4gdGVtcGxhdGUpXG4gICAgeCA9IHNldFUodGVtcGxhdGVba10sIHZhbHVlICYmIHZhbHVlW2tdLCB4KVxuICByZXR1cm4geFxufVxuXG4vL1xuXG5jb25zdCBicmFuY2hPbk1lcmdlID0gKHgsIGtleXMpID0+IHhzID0+IHtcbiAgY29uc3QgbyA9IHt9LCBuID0ga2V5cy5sZW5ndGhcbiAgZm9yIChsZXQgaT0wOyBpPG47ICsraSwgeHM9eHNbMV0pIHtcbiAgICBjb25zdCB2ID0geHNbMF1cbiAgICBvW2tleXNbaV1dID0gdm9pZCAwICE9PSB2ID8gdiA6IG9cbiAgfVxuICBsZXQgclxuICBpZiAoeC5jb25zdHJ1Y3RvciAhPT0gT2JqZWN0KVxuICAgIHggPSBPYmplY3QuYXNzaWduKHt9LCB4KVxuICBmb3IgKGNvbnN0IGsgaW4geCkge1xuICAgIGNvbnN0IHYgPSBvW2tdXG4gICAgaWYgKG8gIT09IHYpIHtcbiAgICAgIG9ba10gPSBvXG4gICAgICBpZiAoIXIpXG4gICAgICAgIHIgPSB7fVxuICAgICAgcltrXSA9IHZvaWQgMCAhPT0gdiA/IHYgOiB4W2tdXG4gICAgfVxuICB9XG4gIGZvciAobGV0IGk9MDsgaTxuOyArK2kpIHtcbiAgICBjb25zdCBrID0ga2V5c1tpXVxuICAgIGNvbnN0IHYgPSBvW2tdXG4gICAgaWYgKG8gIT09IHYpIHtcbiAgICAgIGlmICghcilcbiAgICAgICAgciA9IHt9XG4gICAgICByW2tdID0gdlxuICAgIH1cbiAgfVxuICByZXR1cm4gclxufVxuXG5jb25zdCBicmFuY2hPbiA9IChrZXlzLCB2YWxzKSA9PiAoQSwgeGkyeUEsIHgsIF8pID0+IHtcbiAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIilcbiAgICByZXFBcHBsaWNhdGl2ZShBKVxuICBjb25zdCBvZiA9IEEub2ZcbiAgbGV0IGkgPSBrZXlzLmxlbmd0aFxuICBpZiAoIWkpXG4gICAgcmV0dXJuIG9mKG9iamVjdDBUb1VuZGVmaW5lZCh4KSlcbiAgaWYgKCEoeCBpbnN0YW5jZW9mIE9iamVjdCkpXG4gICAgeCA9IG9iamVjdDBcbiAgY29uc3QgYXAgPSBBLmFwLCBtYXAgPSBBLm1hcFxuICBsZXQgeHNBID0gb2YoMClcbiAgd2hpbGUgKGktLSkge1xuICAgIGNvbnN0IGsgPSBrZXlzW2ldLCB2ID0geFtrXVxuICAgIHhzQSA9IGFwKG1hcChjcGFpciwgdmFscyA/IHZhbHNbaV0oQSwgeGkyeUEsIHYsIGspIDogeGkyeUEodiwgaykpLCB4c0EpXG4gIH1cbiAgcmV0dXJuIG1hcChicmFuY2hPbk1lcmdlKHgsIGtleXMpLCB4c0EpXG59XG5cbmNvbnN0IG5vcm1hbGl6ZXIgPSB4aTJ4ID0+IChGLCB4aTJ5RiwgeCwgaSkgPT5cbiAgKDAsRi5tYXApKHggPT4geGkyeCh4LCBpKSwgeGkyeUYoeGkyeCh4LCBpKSwgaSkpXG5cbmNvbnN0IHJlcGxhY2VkID0gKGlubiwgb3V0LCB4KSA9PiBhY3ljbGljRXF1YWxzVSh4LCBpbm4pID8gb3V0IDogeFxuXG5mdW5jdGlvbiBmaW5kSW5kZXgoeGkyYiwgeHMpIHtcbiAgZm9yIChsZXQgaT0wLCBuPXhzLmxlbmd0aDsgaTxuOyArK2kpXG4gICAgaWYgKHhpMmIoeHNbaV0sIGkpKVxuICAgICAgcmV0dXJuIGlcbiAgcmV0dXJuIC0xXG59XG5cbmZ1bmN0aW9uIHBhcnRpdGlvbkludG9JbmRleCh4aTJiLCB4cywgdHMsIGZzKSB7XG4gIGZvciAobGV0IGk9MCwgbj14cy5sZW5ndGgsIHg7IGk8bjsgKytpKVxuICAgICh4aTJiKHggPSB4c1tpXSwgaSkgPyB0cyA6IGZzKS5wdXNoKHgpXG59XG5cbi8vXG5cbmV4cG9ydCBmdW5jdGlvbiB0b0Z1bmN0aW9uKG8pIHtcbiAgc3dpdGNoICh0eXBlb2Ygbykge1xuICAgIGNhc2UgXCJzdHJpbmdcIjpcbiAgICAgIHJldHVybiBmdW5Qcm9wKG8pXG4gICAgY2FzZSBcIm51bWJlclwiOlxuICAgICAgcmV0dXJuIGZ1bkluZGV4KG8pXG4gICAgY2FzZSBcImZ1bmN0aW9uXCI6XG4gICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKVxuICAgICAgICByZXFGdW5jdGlvbihvKVxuICAgICAgcmV0dXJuIG9cbiAgICBkZWZhdWx0OlxuICAgICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIilcbiAgICAgICAgcmVxQXJyYXkobylcbiAgICAgIHJldHVybiBjb21wb3NlZCgwLCBvKVxuICB9XG59XG5cbi8vIE9wZXJhdGlvbnMgb24gb3B0aWNzXG5cbmV4cG9ydCBjb25zdCBtb2RpZnkgPSBjdXJyeSgobywgeGkyeCwgcykgPT4ge1xuICBzd2l0Y2ggKHR5cGVvZiBvKSB7XG4gICAgY2FzZSBcInN0cmluZ1wiOlxuICAgICAgcmV0dXJuIHNldFByb3AobywgeGkyeChnZXRQcm9wKG8sIHMpLCBvKSwgcylcbiAgICBjYXNlIFwibnVtYmVyXCI6XG4gICAgICByZXR1cm4gc2V0SW5kZXgobywgeGkyeChnZXRJbmRleChvLCBzKSwgbyksIHMpXG4gICAgY2FzZSBcImZ1bmN0aW9uXCI6XG4gICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKVxuICAgICAgICByZXFGdW5jdGlvbihvKVxuICAgICAgcmV0dXJuIG8oSWRlbnQsIHhpMngsIHMsIHZvaWQgMClcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIG1vZGlmeUNvbXBvc2VkKG8sIHhpMngsIHMpXG4gIH1cbn0pXG5cbmV4cG9ydCBjb25zdCByZW1vdmUgPSBjdXJyeSgobywgcykgPT4gc2V0VShvLCB2b2lkIDAsIHMpKVxuXG5leHBvcnQgY29uc3Qgc2V0ID0gY3Vycnkoc2V0VSlcblxuLy8gTmVzdGluZ1xuXG5leHBvcnQgZnVuY3Rpb24gY29tcG9zZSgpIHtcbiAgbGV0IG4gPSBhcmd1bWVudHMubGVuZ3RoXG4gIGlmIChuIDwgMikge1xuICAgIHJldHVybiBuID8gYXJndW1lbnRzWzBdIDogaWRlbnRpdHlcbiAgfSBlbHNlIHtcbiAgICBjb25zdCBsZW5zZXMgPSBBcnJheShuKVxuICAgIHdoaWxlIChuLS0pXG4gICAgICBsZW5zZXNbbl0gPSBhcmd1bWVudHNbbl1cbiAgICByZXR1cm4gbGVuc2VzXG4gIH1cbn1cblxuLy8gUXVlcnlpbmdcblxuZXhwb3J0IGNvbnN0IGNoYWluID0gY3VycnkoKHhpMnlPLCB4TykgPT5cbiAgW3hPLCBjaG9vc2UoKHhNLCBpKSA9PiB2b2lkIDAgIT09IHhNID8geGkyeU8oeE0sIGkpIDogemVybyldKVxuXG5leHBvcnQgY29uc3QgY2hvaWNlID0gKC4uLmxzKSA9PiBjaG9vc2UoeCA9PiB7XG4gIGNvbnN0IGkgPSBmaW5kSW5kZXgobCA9PiB2b2lkIDAgIT09IGdldFUobCwgeCksIGxzKVxuICByZXR1cm4gaSA8IDAgPyB6ZXJvIDogbHNbaV1cbn0pXG5cbmV4cG9ydCBjb25zdCBjaG9vc2UgPSB4aU0ybyA9PiAoQywgeGkyeUMsIHgsIGkpID0+XG4gIHJ1bih4aU0ybyh4LCBpKSwgQywgeGkyeUMsIHgsIGkpXG5cbmV4cG9ydCBjb25zdCB3aGVuID0gcCA9PiAoQywgeGkyeUMsIHgsIGkpID0+XG4gIHAoeCwgaSkgPyB4aTJ5Qyh4LCBpKSA6IHplcm8oQywgeGkyeUMsIHgsIGkpXG5cbmV4cG9ydCBjb25zdCBvcHRpb25hbCA9IHdoZW4oaXNEZWZpbmVkKVxuXG5leHBvcnQgZnVuY3Rpb24gemVybyhDLCB4aTJ5QywgeCwgaSkge1xuICBjb25zdCBvZiA9IEMub2ZcbiAgcmV0dXJuIG9mID8gb2YoeCkgOiAoMCxDLm1hcCkoYWx3YXlzKHgpLCB4aTJ5Qyh2b2lkIDAsIGkpKVxufVxuXG4vLyBSZWN1cnNpbmdcblxuZXhwb3J0IGZ1bmN0aW9uIGxhenkobzJvKSB7XG4gIGxldCBtZW1vID0gKEMsIHhpMnlDLCB4LCBpKSA9PiAobWVtbyA9IHRvRnVuY3Rpb24obzJvKHJlYykpKShDLCB4aTJ5QywgeCwgaSlcbiAgZnVuY3Rpb24gcmVjKEMsIHhpMnlDLCB4LCBpKSB7cmV0dXJuIG1lbW8oQywgeGkyeUMsIHgsIGkpfVxuICByZXR1cm4gcmVjXG59XG5cbi8vIERlYnVnZ2luZ1xuXG5leHBvcnQgZnVuY3Rpb24gbG9nKCkge1xuICBjb25zdCBzaG93ID0gZGlyID0+IHggPT5cbiAgICBjb25zb2xlLmxvZy5hcHBseShjb25zb2xlLFxuICAgICAgICAgICAgICAgICAgICAgIGNvcHlUb0Zyb20oW10sIDAsIGFyZ3VtZW50cywgMCwgYXJndW1lbnRzLmxlbmd0aClcbiAgICAgICAgICAgICAgICAgICAgICAuY29uY2F0KFtkaXIsIHhdKSkgfHwgeFxuICByZXR1cm4gaXNvKHNob3coXCJnZXRcIiksIHNob3coXCJzZXRcIikpXG59XG5cbi8vIE9wZXJhdGlvbnMgb24gdHJhdmVyc2Fsc1xuXG5leHBvcnQgY29uc3QgY29uY2F0QXMgPSBjb25zdEFzKG0gPT4gQ29uY2F0T2YobS5jb25jYXQsICgwLG0uZW1wdHkpKCkpKVxuXG5leHBvcnQgY29uc3QgY29uY2F0ID0gY29uY2F0QXMoaWQpXG5cbmV4cG9ydCBjb25zdCBtZXJnZUFzID0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09IFwicHJvZHVjdGlvblwiID8gY29uY2F0QXMgOiAoZiwgbSwgdCwgZCkgPT4ge1xuICBpZiAoIW1lcmdlQXMud2FybmVkKSB7XG4gICAgbWVyZ2VBcy53YXJuZWQgPSAxXG4gICAgY29uc29sZS53YXJuKFwicGFydGlhbC5sZW5zZXM6IGBtZXJnZUFzYCBpcyBvYnNvbGV0ZSwganVzdCB1c2UgYGNvbmNhdEFzYFwiKVxuICB9XG4gIHJldHVybiBjb25jYXRBcyhmLCBtLCB0LCBkKVxufVxuXG5leHBvcnQgY29uc3QgbWVyZ2UgPSBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gXCJwcm9kdWN0aW9uXCIgPyBjb25jYXQgOiAobSwgdCwgZCkgPT4ge1xuICBpZiAoIW1lcmdlLndhcm5lZCkge1xuICAgIG1lcmdlLndhcm5lZCA9IDFcbiAgICBjb25zb2xlLndhcm4oXCJwYXJ0aWFsLmxlbnNlczogYG1lcmdlYCBpcyBvYnNvbGV0ZSwganVzdCB1c2UgYGNvbmNhdGBcIilcbiAgfVxuICByZXR1cm4gY29uY2F0KG0sIHQsIGQpXG59XG5cbi8vIEZvbGRzIG92ZXIgdHJhdmVyc2Fsc1xuXG5leHBvcnQgY29uc3QgY29sbGVjdEFzID0gY3VycnkoKHhpMnksIHQsIHMpID0+XG4gIHRvQXJyYXkocnVuKHQsIENvbGxlY3QsIHhpMnksIHMpKSB8fCBbXSlcblxuZXhwb3J0IGNvbnN0IGNvbGxlY3QgPSBjb2xsZWN0QXMoaWQpXG5cbmV4cG9ydCBjb25zdCBmb2xkbCA9IGN1cnJ5KChmLCByLCB0LCBzKSA9PlxuICBmb2xkKGYsIHIsIHJ1bih0LCBDb2xsZWN0LCBwYWlyLCBzKSkpXG5cbmV4cG9ydCBjb25zdCBmb2xkciA9IGN1cnJ5KChmLCByLCB0LCBzKSA9PiB7XG4gIGNvbnN0IHhzID0gY29sbGVjdEFzKHBhaXIsIHQsIHMpXG4gIGZvciAobGV0IGk9eHMubGVuZ3RoLTE7IDA8PWk7IC0taSkge1xuICAgIGNvbnN0IHggPSB4c1tpXVxuICAgIHIgPSBmKHIsIHhbMF0sIHhbMV0pXG4gIH1cbiAgcmV0dXJuIHJcbn0pXG5cbmV4cG9ydCBjb25zdCBtYXhpbXVtID0gY29uY2F0KE11bSgoeCwgeSkgPT4geCA+IHkpKVxuXG5leHBvcnQgY29uc3QgbWluaW11bSA9IGNvbmNhdChNdW0oKHgsIHkpID0+IHggPCB5KSlcblxuZXhwb3J0IGNvbnN0IHByb2R1Y3QgPSBjb25jYXRBcyh1bnRvKDEpLCBNb25vaWQoKHksIHgpID0+IHggKiB5LCAxKSlcblxuZXhwb3J0IGNvbnN0IHN1bSA9IGNvbmNhdEFzKHVudG8oMCksIE1vbm9pZCgoeSwgeCkgPT4geCArIHksIDApKVxuXG4vLyBDcmVhdGluZyBuZXcgdHJhdmVyc2Fsc1xuXG5leHBvcnQgZnVuY3Rpb24gYnJhbmNoKHRlbXBsYXRlKSB7XG4gIGNvbnN0IGtleXMgPSBbXSwgdmFscyA9IFtdXG4gIGZvciAoY29uc3QgayBpbiB0ZW1wbGF0ZSkge1xuICAgIGtleXMucHVzaChrKVxuICAgIHZhbHMucHVzaCh0b0Z1bmN0aW9uKHRlbXBsYXRlW2tdKSlcbiAgfVxuICByZXR1cm4gYnJhbmNoT24oa2V5cywgdmFscylcbn1cblxuLy8gVHJhdmVyc2FscyBhbmQgY29tYmluYXRvcnNcblxuZXhwb3J0IGZ1bmN0aW9uIGVsZW1zKEEsIHhpMnlBLCB4cywgXykge1xuICBpZiAoc2VlbXNBcnJheUxpa2UoeHMpKSB7XG4gICAgcmV0dXJuIEEgPT09IElkZW50XG4gICAgICA/IG1hcFBhcnRpYWxJbmRleFUoeGkyeUEsIHhzKVxuICAgICAgOiB0cmF2ZXJzZVBhcnRpYWxJbmRleChBLCB4aTJ5QSwgeHMpXG4gIH0gZWxzZSB7XG4gICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIilcbiAgICAgIHJlcUFwcGxpY2F0aXZlKEEpXG4gICAgcmV0dXJuICgwLEEub2YpKHhzKVxuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB2YWx1ZXMoQSwgeGkyeUEsIHhzLCBfKSB7XG4gIGlmICh4cyBpbnN0YW5jZW9mIE9iamVjdCkge1xuICAgIHJldHVybiBicmFuY2hPbihrZXlzKHhzKSkoQSwgeGkyeUEsIHhzKVxuICB9IGVsc2Uge1xuICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpXG4gICAgICByZXFBcHBsaWNhdGl2ZShBKVxuICAgIHJldHVybiAoMCxBLm9mKSh4cylcbiAgfVxufVxuXG4vLyBPcGVyYXRpb25zIG9uIGxlbnNlc1xuXG5leHBvcnQgY29uc3QgZ2V0ID0gY3VycnkoZ2V0VSlcblxuLy8gQ3JlYXRpbmcgbmV3IGxlbnNlc1xuXG5leHBvcnQgY29uc3QgbGVucyA9IGN1cnJ5KChnZXQsIHNldCkgPT4gKEYsIHhpMnlGLCB4LCBpKSA9PlxuICAoMCxGLm1hcCkoeSA9PiBzZXQoeSwgeCwgaSksIHhpMnlGKGdldCh4LCBpKSwgaSkpKVxuXG4vLyBDb21wdXRpbmcgZGVyaXZlZCBwcm9wc1xuXG5leHBvcnQgY29uc3QgYXVnbWVudCA9IHRlbXBsYXRlID0+IHtcbiAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIiAmJiAhaXNPYmplY3QodGVtcGxhdGUpKVxuICAgIGVycm9yR2l2ZW4oXCJgYXVnbWVudGAgZXhwZWN0cyBhIHBsYWluIE9iamVjdCB0ZW1wbGF0ZVwiLCB0ZW1wbGF0ZSlcbiAgcmV0dXJuIGxlbnMoXG4gICAgeCA9PiB7XG4gICAgICB4ID0gZGlzc29jUGFydGlhbFUoMCwgeClcbiAgICAgIGlmICh4KVxuICAgICAgICBmb3IgKGNvbnN0IGsgaW4gdGVtcGxhdGUpXG4gICAgICAgICAgeFtrXSA9IHRlbXBsYXRlW2tdKHgpXG4gICAgICByZXR1cm4geFxuICAgIH0sXG4gICAgKHksIHgpID0+IHtcbiAgICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIgJiZcbiAgICAgICAgICAhKHZvaWQgMCA9PT0geSB8fCB5IGluc3RhbmNlb2YgT2JqZWN0KSlcbiAgICAgICAgZXJyb3JHaXZlbihcImBhdWdtZW50YCBtdXN0IGJlIHNldCB3aXRoIHVuZGVmaW5lZCBvciBhbiBvYmplY3RcIiwgeSlcbiAgICAgIGlmICh5ICYmIHkuY29uc3RydWN0b3IgIT09IE9iamVjdClcbiAgICAgICAgeSA9IE9iamVjdC5hc3NpZ24oe30sIHkpXG4gICAgICBpZiAoISh4IGluc3RhbmNlb2YgT2JqZWN0KSlcbiAgICAgICAgeCA9IHZvaWQgMFxuICAgICAgbGV0IHpcbiAgICAgIGZ1bmN0aW9uIHNldChrLCB2KSB7XG4gICAgICAgIGlmICgheilcbiAgICAgICAgICB6ID0ge31cbiAgICAgICAgeltrXSA9IHZcbiAgICAgIH1cbiAgICAgIGZvciAoY29uc3QgayBpbiB5KSB7XG4gICAgICAgIGlmICghKGsgaW4gdGVtcGxhdGUpKVxuICAgICAgICAgIHNldChrLCB5W2tdKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgaWYgKHggJiYgayBpbiB4KVxuICAgICAgICAgICAgc2V0KGssIHhba10pXG4gICAgICB9XG4gICAgICByZXR1cm4gelxuICAgIH0pXG59XG5cbi8vIEVuZm9yY2luZyBpbnZhcmlhbnRzXG5cbmV4cG9ydCBjb25zdCBkZWZhdWx0cyA9IG91dCA9PiB7XG4gIGNvbnN0IG8ydSA9IHggPT4gcmVwbGFjZWQob3V0LCB2b2lkIDAsIHgpXG4gIHJldHVybiAoRiwgeGkyeUYsIHgsIGkpID0+ICgwLEYubWFwKShvMnUsIHhpMnlGKHZvaWQgMCAhPT0geCA/IHggOiBvdXQsIGkpKVxufVxuXG5leHBvcnQgY29uc3QgcmVxdWlyZWQgPSBpbm4gPT4gcmVwbGFjZShpbm4sIHZvaWQgMClcblxuZXhwb3J0IGNvbnN0IGRlZmluZSA9IHYgPT4gbm9ybWFsaXplcih1bnRvKHYpKVxuXG5leHBvcnQgY29uc3Qgbm9ybWFsaXplID0geGkyeCA9PlxuICBub3JtYWxpemVyKCh4LCBpKSA9PiB2b2lkIDAgIT09IHggPyB4aTJ4KHgsIGkpIDogdm9pZCAwKVxuXG5leHBvcnQgY29uc3QgcmV3cml0ZSA9IHlpMnkgPT4gKEYsIHhpMnlGLCB4LCBpKSA9PlxuICAoMCxGLm1hcCkoeSA9PiB2b2lkIDAgIT09IHkgPyB5aTJ5KHksIGkpIDogdm9pZCAwLCB4aTJ5Rih4LCBpKSlcblxuLy8gTGVuc2luZyBhcnJheXNcblxuZXhwb3J0IGNvbnN0IGFwcGVuZCA9IChGLCB4aTJ5RiwgeHMsIGkpID0+XG4gICgwLEYubWFwKSh4ID0+IHNldEluZGV4KHNlZW1zQXJyYXlMaWtlKHhzKSA/IHhzLmxlbmd0aCA6IDAsIHgsIHhzKSxcbiAgICAgICAgICAgIHhpMnlGKHZvaWQgMCwgaSkpXG5cbmV4cG9ydCBjb25zdCBmaWx0ZXIgPSB4aTJiID0+IChGLCB4aTJ5RiwgeHMsIGkpID0+IHtcbiAgbGV0IHRzLCBmc1xuICBpZiAoc2VlbXNBcnJheUxpa2UoeHMpKVxuICAgIHBhcnRpdGlvbkludG9JbmRleCh4aTJiLCB4cywgdHMgPSBbXSwgZnMgPSBbXSlcbiAgcmV0dXJuICgwLEYubWFwKShcbiAgICB0cyA9PiB7XG4gICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiICYmXG4gICAgICAgICAgISh2b2lkIDAgPT09IHRzIHx8IHNlZW1zQXJyYXlMaWtlKHRzKSkpXG4gICAgICAgIGVycm9yR2l2ZW4oXCJgZmlsdGVyYCBtdXN0IGJlIHNldCB3aXRoIHVuZGVmaW5lZCBvciBhbiBhcnJheS1saWtlIG9iamVjdFwiLCB0cylcbiAgICAgIGNvbnN0IHRzTiA9IHRzID8gdHMubGVuZ3RoIDogMCxcbiAgICAgICAgICAgIGZzTiA9IGZzID8gZnMubGVuZ3RoIDogMCxcbiAgICAgICAgICAgIG4gPSB0c04gKyBmc05cbiAgICAgIGlmIChuKVxuICAgICAgICByZXR1cm4gbiA9PT0gZnNOXG4gICAgICAgID8gZnNcbiAgICAgICAgOiBjb3B5VG9Gcm9tKGNvcHlUb0Zyb20oQXJyYXkobiksIDAsIHRzLCAwLCB0c04pLCB0c04sIGZzLCAwLCBmc04pXG4gICAgfSxcbiAgICB4aTJ5Rih0cywgaSkpXG59XG5cbmV4cG9ydCBjb25zdCBmaW5kID0geGkyYiA9PiBjaG9vc2UoeHMgPT4ge1xuICBpZiAoIXNlZW1zQXJyYXlMaWtlKHhzKSlcbiAgICByZXR1cm4gMFxuICBjb25zdCBpID0gZmluZEluZGV4KHhpMmIsIHhzKVxuICByZXR1cm4gaSA8IDAgPyBhcHBlbmQgOiBpXG59KVxuXG5leHBvcnQgZnVuY3Rpb24gZmluZFdpdGgoLi4ubHMpIHtcbiAgY29uc3QgbGxzID0gY29tcG9zZSguLi5scylcbiAgcmV0dXJuIFtmaW5kKHggPT4gdm9pZCAwICE9PSBnZXRVKGxscywgeCkpLCBsbHNdXG59XG5cbmV4cG9ydCBjb25zdCBpbmRleCA9IHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSBcInByb2R1Y3Rpb25cIiA/IGlkIDogeCA9PiB7XG4gIGlmICghTnVtYmVyLmlzSW50ZWdlcih4KSB8fCB4IDwgMClcbiAgICBlcnJvckdpdmVuKFwiYGluZGV4YCBleHBlY3RzIGEgbm9uLW5lZ2F0aXZlIGludGVnZXJcIiwgeClcbiAgcmV0dXJuIHhcbn1cblxuZXhwb3J0IGNvbnN0IHNsaWNlID0gY3VycnkoKGJlZ2luLCBlbmQpID0+IChGLCB4c2kyeUYsIHhzLCBpKSA9PiB7XG4gIGNvbnN0IHNlZW1zID0gc2VlbXNBcnJheUxpa2UoeHMpLFxuICAgICAgICB4c04gPSBzZWVtcyAmJiB4cy5sZW5ndGgsXG4gICAgICAgIGIgPSBzbGljZUluZGV4KDAsIHhzTiwgMCwgYmVnaW4pLFxuICAgICAgICBlID0gc2xpY2VJbmRleChiLCB4c04sIHhzTiwgZW5kKVxuICByZXR1cm4gKDAsRi5tYXApKFxuICAgIHpzID0+IHtcbiAgICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIgJiZcbiAgICAgICAgICAhKHZvaWQgMCA9PT0genMgfHwgc2VlbXNBcnJheUxpa2UoenMpKSlcbiAgICAgICAgZXJyb3JHaXZlbihcImBzbGljZWAgbXVzdCBiZSBzZXQgd2l0aCB1bmRlZmluZWQgb3IgYW4gYXJyYXktbGlrZSBvYmplY3RcIiwgenMpXG4gICAgICBjb25zdCB6c04gPSB6cyA/IHpzLmxlbmd0aCA6IDAsIGJQenNOID0gYiArIHpzTiwgbiA9IHhzTiAtIGUgKyBiUHpzTlxuICAgICAgcmV0dXJuIG5cbiAgICAgICAgPyBjb3B5VG9Gcm9tKGNvcHlUb0Zyb20oY29weVRvRnJvbShBcnJheShuKSwgMCwgeHMsIDAsIGIpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB6cywgMCwgenNOKSxcbiAgICAgICAgICAgICAgICAgICAgIGJQenNOLFxuICAgICAgICAgICAgICAgICAgICAgeHMsIGUsIHhzTilcbiAgICAgICAgOiB2b2lkIDBcbiAgICB9LFxuICAgIHhzaTJ5RihzZWVtcyA/IGNvcHlUb0Zyb20oQXJyYXkoTWF0aC5tYXgoMCwgZSAtIGIpKSwgMCwgeHMsIGIsIGUpIDpcbiAgICAgICAgICAgdm9pZCAwLFxuICAgICAgICAgICBpKSlcbn0pXG5cbi8vIExlbnNpbmcgb2JqZWN0c1xuXG5leHBvcnQgY29uc3QgcHJvcCA9IHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSBcInByb2R1Y3Rpb25cIiA/IGlkIDogeCA9PiB7XG4gIGlmICghaXNTdHJpbmcoeCkpXG4gICAgZXJyb3JHaXZlbihcImBwcm9wYCBleHBlY3RzIGEgc3RyaW5nXCIsIHgpXG4gIHJldHVybiB4XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwcm9wcygpIHtcbiAgY29uc3QgbiA9IGFyZ3VtZW50cy5sZW5ndGgsIHRlbXBsYXRlID0ge31cbiAgZm9yIChsZXQgaT0wLCBrOyBpPG47ICsraSlcbiAgICB0ZW1wbGF0ZVtrID0gYXJndW1lbnRzW2ldXSA9IGtcbiAgcmV0dXJuIHBpY2sodGVtcGxhdGUpXG59XG5cbi8vIFByb3ZpZGluZyBkZWZhdWx0c1xuXG5leHBvcnQgY29uc3QgdmFsdWVPciA9IHYgPT4gKF9GLCB4aTJ5RiwgeCwgaSkgPT5cbiAgeGkyeUYodm9pZCAwICE9PSB4ICYmIHggIT09IG51bGwgPyB4IDogdiwgaSlcblxuLy8gQWRhcHRpbmcgdG8gZGF0YVxuXG5leHBvcnQgY29uc3Qgb3JFbHNlID1cbiAgY3VycnkoKGQsIGwpID0+IGNob29zZSh4ID0+IHZvaWQgMCAhPT0gZ2V0VShsLCB4KSA/IGwgOiBkKSlcblxuLy8gUmVhZC1vbmx5IG1hcHBpbmdcblxuZXhwb3J0IGNvbnN0IHRvID0gd2kyeCA9PiAoRiwgeGkyeUYsIHcsIGkpID0+XG4gICgwLEYubWFwKShhbHdheXModyksIHhpMnlGKHdpMngodywgaSksIGkpKVxuXG5leHBvcnQgY29uc3QganVzdCA9IHggPT4gdG8oYWx3YXlzKHgpKVxuXG4vLyBUcmFuc2Zvcm1pbmcgZGF0YVxuXG5leHBvcnQgY29uc3QgcGljayA9IHRlbXBsYXRlID0+IHtcbiAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIiAmJiAhaXNPYmplY3QodGVtcGxhdGUpKVxuICAgIGVycm9yR2l2ZW4oXCJgcGlja2AgZXhwZWN0cyBhIHBsYWluIE9iamVjdCB0ZW1wbGF0ZVwiLCB0ZW1wbGF0ZSlcbiAgcmV0dXJuIChGLCB4aTJ5RiwgeCwgaSkgPT5cbiAgICAoMCxGLm1hcCkoc2V0UGljayh0ZW1wbGF0ZSwgeCksIHhpMnlGKGdldFBpY2sodGVtcGxhdGUsIHgpLCBpKSlcbn1cblxuZXhwb3J0IGNvbnN0IHJlcGxhY2UgPSBjdXJyeSgoaW5uLCBvdXQpID0+IHtcbiAgY29uc3QgbzJpID0geCA9PiByZXBsYWNlZChvdXQsIGlubiwgeClcbiAgcmV0dXJuIChGLCB4aTJ5RiwgeCwgaSkgPT4gKDAsRi5tYXApKG8yaSwgeGkyeUYocmVwbGFjZWQoaW5uLCBvdXQsIHgpLCBpKSlcbn0pXG5cbi8vIE9wZXJhdGlvbnMgb24gaXNvbW9ycGhpc21zXG5cbmV4cG9ydCBjb25zdCBnZXRJbnZlcnNlID0gYXJpdHlOKDIsIHNldFUpXG5cbi8vIENyZWF0aW5nIG5ldyBpc29tb3JwaGlzbXNcblxuZXhwb3J0IGNvbnN0IGlzbyA9XG4gIGN1cnJ5KChid2QsIGZ3ZCkgPT4gKEYsIHhpMnlGLCB4LCBpKSA9PiAoMCxGLm1hcCkoZndkLCB4aTJ5Rihid2QoeCksIGkpKSlcblxuLy8gSXNvbW9ycGhpc21zIGFuZCBjb21iaW5hdG9yc1xuXG5leHBvcnQgY29uc3QgaWRlbnRpdHkgPSAoX0YsIHhpMnlGLCB4LCBpKSA9PiB4aTJ5Rih4LCBpKVxuXG5leHBvcnQgY29uc3QgaW52ZXJzZSA9IGlzbyA9PiAoRiwgeGkyeUYsIHgsIGkpID0+XG4gICgwLEYubWFwKSh4ID0+IGdldFUoaXNvLCB4KSwgeGkyeUYoc2V0VShpc28sIHgpLCBpKSlcbiJdfQ==
