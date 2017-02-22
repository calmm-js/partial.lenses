(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.L = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.inverse = exports.identity = exports.iso = exports.getInverse = exports.replace = exports.pick = exports.just = exports.to = exports.orElse = exports.valueOr = exports.removable = exports.prop = exports.slice = exports.index = exports.find = exports.filter = exports.append = exports.rewrite = exports.normalize = exports.define = exports.required = exports.defaults = exports.augment = exports.lens = exports.get = exports.sum = exports.product = exports.minimum = exports.maximum = exports.foldr = exports.foldl = exports.collect = exports.collectAs = exports.merge = exports.mergeAs = exports.concat = exports.concatAs = exports.optional = exports.when = exports.choose = exports.choice = exports.chain = exports.set = exports.remove = exports.modify = undefined;
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
  if (!Array.isArray(o)) errorGiven(expectedOptic, o);
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

var toObject = function toObject(x) {
  return (0, _infestines.constructorOf)(x) !== Object ? Object.assign({}, x) : x;
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
    x = toObject(x);
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
    y = toObject(y);
    if (!(x instanceof Object)) x = void 0;
    var z = void 0;
    function set(k, v) {
      if (!z) z = {};
      z[k] = v;
    }
    for (var k in y) {
      if (!(0, _infestines.hasU)(k, template)) set(k, y[k]);else if (x && (0, _infestines.hasU)(k, x)) set(k, x[k]);
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

var removable = exports.removable = function removable() {
  for (var _len2 = arguments.length, ps = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    ps[_key2] = arguments[_key2];
  }

  return function (F, xi2yF, x, i) {
    return (0, F.map)(function (y) {
      if (!(y instanceof Object)) return y;
      for (var _i2 = 0, n = ps.length; _i2 < n; ++_i2) {
        if ((0, _infestines.hasU)(ps[_i2], y)) return y;
      }
    }, xi2yF(x, i));
  };
};

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvcGFydGlhbC5sZW5zZXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7UUN1WmdCLFUsR0FBQSxVO1FBd0NBLE8sR0FBQSxPO1FBOEJBLEksR0FBQSxJO1FBT0EsSSxHQUFBLEk7UUFRQSxHLEdBQUEsRztRQTJEQSxNLEdBQUEsTTtRQVdBLEssR0FBQSxLO1FBWUEsTSxHQUFBLE07UUEwR0EsUSxHQUFBLFE7UUEyQ0EsSyxHQUFBLEs7O0FBbnRCaEI7O0FBcUJBOztBQUVBLElBQU0sYUFBYSxTQUFiLFVBQWEsQ0FBQyxDQUFELEVBQUksQ0FBSixFQUFPLENBQVAsRUFBVSxDQUFWO0FBQUEsU0FDakIsS0FBSyxDQUFMLEtBQVcsQ0FBWCxHQUFlLENBQWYsR0FBbUIsS0FBSyxHQUFMLENBQVMsS0FBSyxHQUFMLENBQVMsQ0FBVCxFQUFZLElBQUksQ0FBSixHQUFRLElBQUksQ0FBWixHQUFnQixDQUE1QixDQUFULEVBQXlDLENBQXpDLENBREY7QUFBQSxDQUFuQjs7QUFHQSxTQUFTLElBQVQsQ0FBYyxFQUFkLEVBQWtCLEVBQWxCLEVBQXNCO0FBQUMsU0FBTyxDQUFDLEVBQUQsRUFBSyxFQUFMLENBQVA7QUFBZ0I7QUFDdkMsSUFBTSxRQUFRLFNBQVIsS0FBUTtBQUFBLFNBQUs7QUFBQSxXQUFNLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBTjtBQUFBLEdBQUw7QUFBQSxDQUFkOztBQUVBLElBQU0sT0FBTyxTQUFQLElBQU87QUFBQSxTQUFLO0FBQUEsV0FBSyxLQUFLLENBQUwsS0FBVyxDQUFYLEdBQWUsQ0FBZixHQUFtQixDQUF4QjtBQUFBLEdBQUw7QUFBQSxDQUFiOztBQUVBLElBQU0saUJBQWlCLFNBQWpCLGNBQWlCO0FBQUEsU0FDckIsYUFBYSxNQUFiLEtBQXdCLElBQUksRUFBRSxNQUFOLEVBQWMsTUFBTyxLQUFLLENBQVosSUFBa0IsS0FBSyxDQUE3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TCxFQUFZLENBQVosRUFBZSxDQUFmO0FBQUEsU0FBcUIsTUFBTSxDQUFOLEVBQVMsQ0FBVCxDQUFyQjtBQUFBLENBQWpCOztBQUVBLElBQU0sNEJBQVUsU0FBVixPQUFVO0FBQUEsU0FBTyxVQUFDLENBQUQsRUFBSSxLQUFKLEVBQVcsQ0FBWCxFQUFjLENBQWQ7QUFBQSxXQUM1QixDQUFDLEdBQUUsRUFBRSxHQUFMLEVBQVU7QUFBQSxhQUFLLEtBQUssR0FBTCxFQUFVLENBQVYsQ0FBTDtBQUFBLEtBQVYsRUFBNkIsTUFBTSxLQUFLLEdBQUwsRUFBVSxDQUFWLENBQU4sRUFBb0IsQ0FBcEIsQ0FBN0IsQ0FENEI7QUFBQSxHQUFQO0FBQUEsQ0FBaEIiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IHtcbiAgYWN5Y2xpY0VxdWFsc1UsXG4gIGFsd2F5cyxcbiAgYXBwbHlVLFxuICBhcml0eU4sXG4gIGFzc29jUGFydGlhbFUsXG4gIGNvbnN0cnVjdG9yT2YsXG4gIGN1cnJ5LFxuICBjdXJyeU4sXG4gIGRpc3NvY1BhcnRpYWxVLFxuICBoYXNVLFxuICBpZCxcbiAgaXNEZWZpbmVkLFxuICBpc0Z1bmN0aW9uLFxuICBpc09iamVjdCxcbiAgaXNTdHJpbmcsXG4gIGtleXMsXG4gIG9iamVjdDAsXG4gIHNuZFVcbn0gZnJvbSBcImluZmVzdGluZXNcIlxuXG4vL1xuXG5jb25zdCBzbGljZUluZGV4ID0gKG0sIGwsIGQsIGkpID0+XG4gIHZvaWQgMCA9PT0gaSA/IGQgOiBNYXRoLm1pbihNYXRoLm1heChtLCBpIDwgMCA/IGwgKyBpIDogaSksIGwpXG5cbmZ1bmN0aW9uIHBhaXIoeDAsIHgxKSB7cmV0dXJuIFt4MCwgeDFdfVxuY29uc3QgY3BhaXIgPSB4ID0+IHhzID0+IFt4LCB4c11cblxuY29uc3QgdW50byA9IGMgPT4geCA9PiB2b2lkIDAgIT09IHggPyB4IDogY1xuXG5jb25zdCBzZWVtc0FycmF5TGlrZSA9IHggPT5cbiAgeCBpbnN0YW5jZW9mIE9iamVjdCAmJiAoeCA9IHgubGVuZ3RoLCB4ID09PSAoeCA+PiAwKSAmJiAwIDw9IHgpIHx8XG4gIGlzU3RyaW5nKHgpXG5cbi8vXG5cbmZ1bmN0aW9uIG1hcFBhcnRpYWxJbmRleFUoeGkyeSwgeHMpIHtcbiAgY29uc3QgbiA9IHhzLmxlbmd0aCwgeXMgPSBBcnJheShuKVxuICBsZXQgaiA9IDBcbiAgZm9yIChsZXQgaT0wLCB5OyBpPG47ICsraSlcbiAgICBpZiAodm9pZCAwICE9PSAoeSA9IHhpMnkoeHNbaV0sIGkpKSlcbiAgICAgIHlzW2orK10gPSB5XG4gIGlmIChqKSB7XG4gICAgaWYgKGogPCBuKVxuICAgICAgeXMubGVuZ3RoID0galxuICAgIHJldHVybiB5c1xuICB9XG59XG5cbmZ1bmN0aW9uIGNvcHlUb0Zyb20oeXMsIGssIHhzLCBpLCBqKSB7XG4gIHdoaWxlIChpIDwgailcbiAgICB5c1trKytdID0geHNbaSsrXVxuICByZXR1cm4geXNcbn1cblxuLy9cblxuY29uc3QgSWRlbnQgPSB7bWFwOiBhcHBseVUsIGFwOiBhcHBseVUsIG9mOiBpZH1cblxuY29uc3QgQ29uc3QgPSB7bWFwOiBzbmRVfVxuXG5jb25zdCBDb25jYXRPZiA9IChhcCwgZW1wdHkpID0+ICh7bWFwOiBzbmRVLCBhcCwgb2Y6IGFsd2F5cyhlbXB0eSl9KVxuXG5jb25zdCBNb25vaWQgPSAoY29uY2F0LCBlbXB0eSkgPT4gKHtjb25jYXQsIGVtcHR5OiAoKSA9PiBlbXB0eX0pXG5cbmNvbnN0IE11bSA9IG9yZCA9PlxuICBNb25vaWQoKHksIHgpID0+IHZvaWQgMCAhPT0geCAmJiAodm9pZCAwID09PSB5IHx8IG9yZCh4LCB5KSkgPyB4IDogeSlcblxuLy9cblxuY29uc3QgcnVuID0gKG8sIEMsIHhpMnlDLCBzLCBpKSA9PiB0b0Z1bmN0aW9uKG8pKEMsIHhpMnlDLCBzLCBpKVxuXG5jb25zdCBjb25zdEFzID0gdG9Db25zdCA9PiBjdXJyeU4oNCwgKHhNaTJ5LCBtKSA9PiB7XG4gIGNvbnN0IEMgPSB0b0NvbnN0KG0pXG4gIHJldHVybiAodCwgcykgPT4gcnVuKHQsIEMsIHhNaTJ5LCBzKVxufSlcblxuLy9cblxuY29uc3QgZXhwZWN0ZWRPcHRpYyA9IFwiRXhwZWN0aW5nIGFuIG9wdGljXCJcblxuZnVuY3Rpb24gZXJyb3JHaXZlbihtLCBvKSB7XG4gIGNvbnNvbGUuZXJyb3IoXCJwYXJ0aWFsLmxlbnNlczpcIiwgbSwgXCItIGdpdmVuOlwiLCBvKVxuICB0aHJvdyBuZXcgRXJyb3IobSlcbn1cblxuZnVuY3Rpb24gcmVxRnVuY3Rpb24obykge1xuICBpZiAoIShpc0Z1bmN0aW9uKG8pICYmIG8ubGVuZ3RoID09PSA0KSlcbiAgICBlcnJvckdpdmVuKGV4cGVjdGVkT3B0aWMsIG8pXG59XG5cbmZ1bmN0aW9uIHJlcUFycmF5KG8pIHtcbiAgaWYgKCFBcnJheS5pc0FycmF5KG8pKVxuICAgIGVycm9yR2l2ZW4oZXhwZWN0ZWRPcHRpYywgbylcbn1cblxuLy9cblxuZnVuY3Rpb24gcmVxQXBwbGljYXRpdmUoZikge1xuICBpZiAoIWYub2YpXG4gICAgZXJyb3JHaXZlbihcIlRyYXZlcnNhbHMgcmVxdWlyZSBhbiBhcHBsaWNhdGl2ZVwiLCBmKVxufVxuXG4vL1xuXG5mdW5jdGlvbiBKb2luKGwsIHIpIHt0aGlzLmwgPSBsOyB0aGlzLnIgPSByfVxuXG5jb25zdCBpc0pvaW4gPSBuID0+IG4uY29uc3RydWN0b3IgPT09IEpvaW5cblxuY29uc3Qgam9pbiA9IChsLCByKSA9PiB2b2lkIDAgIT09IGwgPyB2b2lkIDAgIT09IHIgPyBuZXcgSm9pbihsLCByKSA6IGwgOiByXG5cbmNvbnN0IGNqb2luID0gaCA9PiB0ID0+IGpvaW4oaCwgdClcblxuZnVuY3Rpb24gcHVzaFRvKG4sIHlzKSB7XG4gIHdoaWxlIChuICYmIGlzSm9pbihuKSkge1xuICAgIGNvbnN0IGwgPSBuLmxcbiAgICBuID0gbi5yXG4gICAgaWYgKGwgJiYgaXNKb2luKGwpKSB7XG4gICAgICBwdXNoVG8obC5sLCB5cylcbiAgICAgIHB1c2hUbyhsLnIsIHlzKVxuICAgIH0gZWxzZSB7XG4gICAgICB5cy5wdXNoKGwpXG4gICAgfVxuICB9XG4gIHlzLnB1c2gobilcbn1cblxuZnVuY3Rpb24gdG9BcnJheShuKSB7XG4gIGlmICh2b2lkIDAgIT09IG4pIHtcbiAgICBjb25zdCB5cyA9IFtdXG4gICAgcHVzaFRvKG4sIHlzKVxuICAgIHJldHVybiB5c1xuICB9XG59XG5cbmZ1bmN0aW9uIGZvbGRSZWMoZiwgciwgbikge1xuICB3aGlsZSAoaXNKb2luKG4pKSB7XG4gICAgY29uc3QgbCA9IG4ubFxuICAgIG4gPSBuLnJcbiAgICByID0gaXNKb2luKGwpXG4gICAgICA/IGZvbGRSZWMoZiwgZm9sZFJlYyhmLCByLCBsLmwpLCBsLnIpXG4gICAgICA6IGYociwgbFswXSwgbFsxXSlcbiAgfVxuICByZXR1cm4gZihyLCBuWzBdLCBuWzFdKVxufVxuXG5jb25zdCBmb2xkID0gKGYsIHIsIG4pID0+IHZvaWQgMCAhPT0gbiA/IGZvbGRSZWMoZiwgciwgbikgOiByXG5cbmNvbnN0IENvbGxlY3QgPSBDb25jYXRPZihqb2luKVxuXG4vL1xuXG5mdW5jdGlvbiB0cmF2ZXJzZVBhcnRpYWxJbmRleChBLCB4aTJ5QSwgeHMpIHtcbiAgY29uc3QgYXAgPSBBLmFwLCBtYXAgPSBBLm1hcFxuICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKVxuICAgIHJlcUFwcGxpY2F0aXZlKEEpXG4gIGxldCB4c0EgPSAoMCxBLm9mKSh2b2lkIDApLCBpID0geHMubGVuZ3RoXG4gIHdoaWxlIChpLS0pXG4gICAgeHNBID0gYXAobWFwKGNqb2luLCB4aTJ5QSh4c1tpXSwgaSkpLCB4c0EpXG4gIHJldHVybiBtYXAodG9BcnJheSwgeHNBKVxufVxuXG4vL1xuXG5mdW5jdGlvbiBvYmplY3QwVG9VbmRlZmluZWQobykge1xuICBpZiAoIShvIGluc3RhbmNlb2YgT2JqZWN0KSlcbiAgICByZXR1cm4gb1xuICBmb3IgKGNvbnN0IGsgaW4gbylcbiAgICByZXR1cm4gb1xufVxuXG4vL1xuXG5jb25zdCBsZW5zRnJvbSA9IChnZXQsIHNldCkgPT4gaSA9PiAoRiwgeGkyeUYsIHgsIF8pID0+XG4gICgwLEYubWFwKSh2ID0+IHNldChpLCB2LCB4KSwgeGkyeUYoZ2V0KGksIHgpLCBpKSlcblxuLy9cblxuY29uc3QgZ2V0UHJvcCA9IChrLCBvKSA9PiBvIGluc3RhbmNlb2YgT2JqZWN0ID8gb1trXSA6IHZvaWQgMFxuXG5jb25zdCBzZXRQcm9wID0gKGssIHYsIG8pID0+XG4gIHZvaWQgMCAhPT0gdiA/IGFzc29jUGFydGlhbFUoaywgdiwgbykgOiBkaXNzb2NQYXJ0aWFsVShrLCBvKVxuXG5jb25zdCBmdW5Qcm9wID0gbGVuc0Zyb20oZ2V0UHJvcCwgc2V0UHJvcClcblxuLy9cblxuY29uc3QgZ2V0SW5kZXggPSAoaSwgeHMpID0+IHNlZW1zQXJyYXlMaWtlKHhzKSA/IHhzW2ldIDogdm9pZCAwXG5cbmZ1bmN0aW9uIHNldEluZGV4KGksIHgsIHhzKSB7XG4gIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIgJiYgaSA8IDApXG4gICAgZXJyb3JHaXZlbihcIk5lZ2F0aXZlIGluZGljZXMgYXJlIG5vdCBzdXBwb3J0ZWQgYnkgYGluZGV4YFwiLCBpKVxuICBpZiAoIXNlZW1zQXJyYXlMaWtlKHhzKSlcbiAgICB4cyA9IFwiXCJcbiAgY29uc3QgbiA9IHhzLmxlbmd0aFxuICBpZiAodm9pZCAwICE9PSB4KSB7XG4gICAgY29uc3QgbSA9IE1hdGgubWF4KGkrMSwgbiksIHlzID0gQXJyYXkobSlcbiAgICBmb3IgKGxldCBqPTA7IGo8bTsgKytqKVxuICAgICAgeXNbal0gPSB4c1tqXVxuICAgIHlzW2ldID0geFxuICAgIHJldHVybiB5c1xuICB9IGVsc2Uge1xuICAgIGlmICgwIDwgbikge1xuICAgICAgaWYgKG4gPD0gaSlcbiAgICAgICAgcmV0dXJuIGNvcHlUb0Zyb20oQXJyYXkobiksIDAsIHhzLCAwLCBuKVxuICAgICAgaWYgKDEgPCBuKSB7XG4gICAgICAgIGNvbnN0IHlzID0gQXJyYXkobi0xKVxuICAgICAgICBmb3IgKGxldCBqPTA7IGo8aTsgKytqKVxuICAgICAgICAgIHlzW2pdID0geHNbal1cbiAgICAgICAgZm9yIChsZXQgaj1pKzE7IGo8bjsgKytqKVxuICAgICAgICAgIHlzW2otMV0gPSB4c1tqXVxuICAgICAgICByZXR1cm4geXNcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuY29uc3QgZnVuSW5kZXggPSBsZW5zRnJvbShnZXRJbmRleCwgc2V0SW5kZXgpXG5cbi8vXG5cbmNvbnN0IGNsb3NlID0gKG8sIEYsIHhpMnlGKSA9PiAoeCwgaSkgPT4gbyhGLCB4aTJ5RiwgeCwgaSlcblxuZnVuY3Rpb24gY29tcG9zZWQob2kwLCBvcykge1xuICBjb25zdCBuID0gb3MubGVuZ3RoIC0gb2kwXG4gIGxldCBmc1xuICBpZiAobiA8IDIpIHtcbiAgICByZXR1cm4gbiA/IHRvRnVuY3Rpb24ob3Nbb2kwXSkgOiBpZGVudGl0eVxuICB9IGVsc2Uge1xuICAgIGZzID0gQXJyYXkobilcbiAgICBmb3IgKGxldCBpPTA7aTxuOysraSlcbiAgICAgIGZzW2ldID0gdG9GdW5jdGlvbihvc1tpK29pMF0pXG4gICAgcmV0dXJuIChGLCB4aTJ5RiwgeCwgaSkgPT4ge1xuICAgICAgbGV0IGs9blxuICAgICAgd2hpbGUgKC0taylcbiAgICAgICAgeGkyeUYgPSBjbG9zZShmc1trXSwgRiwgeGkyeUYpXG4gICAgICByZXR1cm4gZnNbMF0oRiwgeGkyeUYsIHgsIGkpXG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIHNldFUobywgeCwgcykge1xuICBzd2l0Y2ggKHR5cGVvZiBvKSB7XG4gICAgY2FzZSBcInN0cmluZ1wiOlxuICAgICAgcmV0dXJuIHNldFByb3AobywgeCwgcylcbiAgICBjYXNlIFwibnVtYmVyXCI6XG4gICAgICByZXR1cm4gc2V0SW5kZXgobywgeCwgcylcbiAgICBjYXNlIFwib2JqZWN0XCI6XG4gICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKVxuICAgICAgICByZXFBcnJheShvKVxuICAgICAgcmV0dXJuIG1vZGlmeUNvbXBvc2VkKG8sIDAsIHMsIHgpXG4gICAgZGVmYXVsdDpcbiAgICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpXG4gICAgICAgIHJlcUZ1bmN0aW9uKG8pXG4gICAgICByZXR1cm4gbyhJZGVudCwgYWx3YXlzKHgpLCBzLCB2b2lkIDApXG4gIH1cbn1cblxuZnVuY3Rpb24gZ2V0VShsLCBzKSB7XG4gIHN3aXRjaCAodHlwZW9mIGwpIHtcbiAgICBjYXNlIFwic3RyaW5nXCI6XG4gICAgICByZXR1cm4gZ2V0UHJvcChsLCBzKVxuICAgIGNhc2UgXCJudW1iZXJcIjpcbiAgICAgIHJldHVybiBnZXRJbmRleChsLCBzKVxuICAgIGNhc2UgXCJvYmplY3RcIjpcbiAgICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpXG4gICAgICAgIHJlcUFycmF5KGwpXG4gICAgICBmb3IgKGxldCBpPTAsIG49bC5sZW5ndGgsIG87IGk8bjsgKytpKVxuICAgICAgICBzd2l0Y2ggKHR5cGVvZiAobyA9IGxbaV0pKSB7XG4gICAgICAgICAgY2FzZSBcInN0cmluZ1wiOiBzID0gZ2V0UHJvcChvLCBzKTsgYnJlYWtcbiAgICAgICAgICBjYXNlIFwibnVtYmVyXCI6IHMgPSBnZXRJbmRleChvLCBzKTsgYnJlYWtcbiAgICAgICAgICBkZWZhdWx0OiBzID0gZ2V0VShvLCBzKTsgYnJlYWtcbiAgICAgICAgfVxuICAgICAgcmV0dXJuIHNcbiAgICBkZWZhdWx0OlxuICAgICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIilcbiAgICAgICAgcmVxRnVuY3Rpb24obClcbiAgICAgIHJldHVybiBsKENvbnN0LCBpZCwgcywgdm9pZCAwKVxuICB9XG59XG5cbmZ1bmN0aW9uIG1vZGlmeUNvbXBvc2VkKG9zLCB4aTJ5LCB4LCB5KSB7XG4gIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpXG4gICAgcmVxQXJyYXkob3MpXG4gIGxldCBuID0gb3MubGVuZ3RoXG4gIGNvbnN0IHhzID0gQXJyYXkobilcbiAgZm9yIChsZXQgaT0wLCBvOyBpPG47ICsraSkge1xuICAgIHhzW2ldID0geFxuICAgIHN3aXRjaCAodHlwZW9mIChvID0gb3NbaV0pKSB7XG4gICAgICBjYXNlIFwic3RyaW5nXCI6XG4gICAgICAgIHggPSBnZXRQcm9wKG8sIHgpXG4gICAgICAgIGJyZWFrXG4gICAgICBjYXNlIFwibnVtYmVyXCI6XG4gICAgICAgIHggPSBnZXRJbmRleChvLCB4KVxuICAgICAgICBicmVha1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgeCA9IGNvbXBvc2VkKGksIG9zKShJZGVudCwgeGkyeSB8fCBhbHdheXMoeSksIHgsIG9zW2ktMV0pXG4gICAgICAgIG4gPSBpXG4gICAgICAgIGJyZWFrXG4gICAgfVxuICB9XG4gIGlmIChuID09PSBvcy5sZW5ndGgpXG4gICAgeCA9IHhpMnkgPyB4aTJ5KHgsIG9zW24tMV0pIDogeVxuICBmb3IgKGxldCBvOyAwIDw9IC0tbjspXG4gICAgeCA9IGlzU3RyaW5nKG8gPSBvc1tuXSlcbiAgICAgICAgPyBzZXRQcm9wKG8sIHgsIHhzW25dKVxuICAgICAgICA6IHNldEluZGV4KG8sIHgsIHhzW25dKVxuICByZXR1cm4geFxufVxuXG4vL1xuXG5mdW5jdGlvbiBnZXRQaWNrKHRlbXBsYXRlLCB4KSB7XG4gIGxldCByXG4gIGZvciAoY29uc3QgayBpbiB0ZW1wbGF0ZSkge1xuICAgIGNvbnN0IHYgPSBnZXRVKHRlbXBsYXRlW2tdLCB4KVxuICAgIGlmICh2b2lkIDAgIT09IHYpIHtcbiAgICAgIGlmICghcilcbiAgICAgICAgciA9IHt9XG4gICAgICByW2tdID0gdlxuICAgIH1cbiAgfVxuICByZXR1cm4gclxufVxuXG5jb25zdCBzZXRQaWNrID0gKHRlbXBsYXRlLCB4KSA9PiB2YWx1ZSA9PiB7XG4gIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIgJiZcbiAgICAgICEodm9pZCAwID09PSB2YWx1ZSB8fCB2YWx1ZSBpbnN0YW5jZW9mIE9iamVjdCkpXG4gICAgZXJyb3JHaXZlbihcImBwaWNrYCBtdXN0IGJlIHNldCB3aXRoIHVuZGVmaW5lZCBvciBhbiBvYmplY3RcIiwgdmFsdWUpXG4gIGZvciAoY29uc3QgayBpbiB0ZW1wbGF0ZSlcbiAgICB4ID0gc2V0VSh0ZW1wbGF0ZVtrXSwgdmFsdWUgJiYgdmFsdWVba10sIHgpXG4gIHJldHVybiB4XG59XG5cbi8vXG5cbmNvbnN0IHRvT2JqZWN0ID0geCA9PiBjb25zdHJ1Y3Rvck9mKHgpICE9PSBPYmplY3QgPyBPYmplY3QuYXNzaWduKHt9LCB4KSA6IHhcblxuLy9cblxuY29uc3QgYnJhbmNoT25NZXJnZSA9ICh4LCBrZXlzKSA9PiB4cyA9PiB7XG4gIGNvbnN0IG8gPSB7fSwgbiA9IGtleXMubGVuZ3RoXG4gIGZvciAobGV0IGk9MDsgaTxuOyArK2ksIHhzPXhzWzFdKSB7XG4gICAgY29uc3QgdiA9IHhzWzBdXG4gICAgb1trZXlzW2ldXSA9IHZvaWQgMCAhPT0gdiA/IHYgOiBvXG4gIH1cbiAgbGV0IHJcbiAgeCA9IHRvT2JqZWN0KHgpXG4gIGZvciAoY29uc3QgayBpbiB4KSB7XG4gICAgY29uc3QgdiA9IG9ba11cbiAgICBpZiAobyAhPT0gdikge1xuICAgICAgb1trXSA9IG9cbiAgICAgIGlmICghcilcbiAgICAgICAgciA9IHt9XG4gICAgICByW2tdID0gdm9pZCAwICE9PSB2ID8gdiA6IHhba11cbiAgICB9XG4gIH1cbiAgZm9yIChsZXQgaT0wOyBpPG47ICsraSkge1xuICAgIGNvbnN0IGsgPSBrZXlzW2ldXG4gICAgY29uc3QgdiA9IG9ba11cbiAgICBpZiAobyAhPT0gdikge1xuICAgICAgaWYgKCFyKVxuICAgICAgICByID0ge31cbiAgICAgIHJba10gPSB2XG4gICAgfVxuICB9XG4gIHJldHVybiByXG59XG5cbmNvbnN0IGJyYW5jaE9uID0gKGtleXMsIHZhbHMpID0+IChBLCB4aTJ5QSwgeCwgXykgPT4ge1xuICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKVxuICAgIHJlcUFwcGxpY2F0aXZlKEEpXG4gIGNvbnN0IG9mID0gQS5vZlxuICBsZXQgaSA9IGtleXMubGVuZ3RoXG4gIGlmICghaSlcbiAgICByZXR1cm4gb2Yob2JqZWN0MFRvVW5kZWZpbmVkKHgpKVxuICBpZiAoISh4IGluc3RhbmNlb2YgT2JqZWN0KSlcbiAgICB4ID0gb2JqZWN0MFxuICBjb25zdCBhcCA9IEEuYXAsIG1hcCA9IEEubWFwXG4gIGxldCB4c0EgPSBvZigwKVxuICB3aGlsZSAoaS0tKSB7XG4gICAgY29uc3QgayA9IGtleXNbaV0sIHYgPSB4W2tdXG4gICAgeHNBID0gYXAobWFwKGNwYWlyLCB2YWxzID8gdmFsc1tpXShBLCB4aTJ5QSwgdiwgaykgOiB4aTJ5QSh2LCBrKSksIHhzQSlcbiAgfVxuICByZXR1cm4gbWFwKGJyYW5jaE9uTWVyZ2UoeCwga2V5cyksIHhzQSlcbn1cblxuY29uc3Qgbm9ybWFsaXplciA9IHhpMnggPT4gKEYsIHhpMnlGLCB4LCBpKSA9PlxuICAoMCxGLm1hcCkoeCA9PiB4aTJ4KHgsIGkpLCB4aTJ5Rih4aTJ4KHgsIGkpLCBpKSlcblxuY29uc3QgcmVwbGFjZWQgPSAoaW5uLCBvdXQsIHgpID0+IGFjeWNsaWNFcXVhbHNVKHgsIGlubikgPyBvdXQgOiB4XG5cbmZ1bmN0aW9uIGZpbmRJbmRleCh4aTJiLCB4cykge1xuICBmb3IgKGxldCBpPTAsIG49eHMubGVuZ3RoOyBpPG47ICsraSlcbiAgICBpZiAoeGkyYih4c1tpXSwgaSkpXG4gICAgICByZXR1cm4gaVxuICByZXR1cm4gLTFcbn1cblxuZnVuY3Rpb24gcGFydGl0aW9uSW50b0luZGV4KHhpMmIsIHhzLCB0cywgZnMpIHtcbiAgZm9yIChsZXQgaT0wLCBuPXhzLmxlbmd0aCwgeDsgaTxuOyArK2kpXG4gICAgKHhpMmIoeCA9IHhzW2ldLCBpKSA/IHRzIDogZnMpLnB1c2goeClcbn1cblxuLy9cblxuZXhwb3J0IGZ1bmN0aW9uIHRvRnVuY3Rpb24obykge1xuICBzd2l0Y2ggKHR5cGVvZiBvKSB7XG4gICAgY2FzZSBcInN0cmluZ1wiOlxuICAgICAgcmV0dXJuIGZ1blByb3AobylcbiAgICBjYXNlIFwibnVtYmVyXCI6XG4gICAgICByZXR1cm4gZnVuSW5kZXgobylcbiAgICBjYXNlIFwiZnVuY3Rpb25cIjpcbiAgICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpXG4gICAgICAgIHJlcUZ1bmN0aW9uKG8pXG4gICAgICByZXR1cm4gb1xuICAgIGRlZmF1bHQ6XG4gICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKVxuICAgICAgICByZXFBcnJheShvKVxuICAgICAgcmV0dXJuIGNvbXBvc2VkKDAsIG8pXG4gIH1cbn1cblxuLy8gT3BlcmF0aW9ucyBvbiBvcHRpY3NcblxuZXhwb3J0IGNvbnN0IG1vZGlmeSA9IGN1cnJ5KChvLCB4aTJ4LCBzKSA9PiB7XG4gIHN3aXRjaCAodHlwZW9mIG8pIHtcbiAgICBjYXNlIFwic3RyaW5nXCI6XG4gICAgICByZXR1cm4gc2V0UHJvcChvLCB4aTJ4KGdldFByb3AobywgcyksIG8pLCBzKVxuICAgIGNhc2UgXCJudW1iZXJcIjpcbiAgICAgIHJldHVybiBzZXRJbmRleChvLCB4aTJ4KGdldEluZGV4KG8sIHMpLCBvKSwgcylcbiAgICBjYXNlIFwiZnVuY3Rpb25cIjpcbiAgICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpXG4gICAgICAgIHJlcUZ1bmN0aW9uKG8pXG4gICAgICByZXR1cm4gbyhJZGVudCwgeGkyeCwgcywgdm9pZCAwKVxuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gbW9kaWZ5Q29tcG9zZWQobywgeGkyeCwgcylcbiAgfVxufSlcblxuZXhwb3J0IGNvbnN0IHJlbW92ZSA9IGN1cnJ5KChvLCBzKSA9PiBzZXRVKG8sIHZvaWQgMCwgcykpXG5cbmV4cG9ydCBjb25zdCBzZXQgPSBjdXJyeShzZXRVKVxuXG4vLyBOZXN0aW5nXG5cbmV4cG9ydCBmdW5jdGlvbiBjb21wb3NlKCkge1xuICBsZXQgbiA9IGFyZ3VtZW50cy5sZW5ndGhcbiAgaWYgKG4gPCAyKSB7XG4gICAgcmV0dXJuIG4gPyBhcmd1bWVudHNbMF0gOiBpZGVudGl0eVxuICB9IGVsc2Uge1xuICAgIGNvbnN0IGxlbnNlcyA9IEFycmF5KG4pXG4gICAgd2hpbGUgKG4tLSlcbiAgICAgIGxlbnNlc1tuXSA9IGFyZ3VtZW50c1tuXVxuICAgIHJldHVybiBsZW5zZXNcbiAgfVxufVxuXG4vLyBRdWVyeWluZ1xuXG5leHBvcnQgY29uc3QgY2hhaW4gPSBjdXJyeSgoeGkyeU8sIHhPKSA9PlxuICBbeE8sIGNob29zZSgoeE0sIGkpID0+IHZvaWQgMCAhPT0geE0gPyB4aTJ5Tyh4TSwgaSkgOiB6ZXJvKV0pXG5cbmV4cG9ydCBjb25zdCBjaG9pY2UgPSAoLi4ubHMpID0+IGNob29zZSh4ID0+IHtcbiAgY29uc3QgaSA9IGZpbmRJbmRleChsID0+IHZvaWQgMCAhPT0gZ2V0VShsLCB4KSwgbHMpXG4gIHJldHVybiBpIDwgMCA/IHplcm8gOiBsc1tpXVxufSlcblxuZXhwb3J0IGNvbnN0IGNob29zZSA9IHhpTTJvID0+IChDLCB4aTJ5QywgeCwgaSkgPT5cbiAgcnVuKHhpTTJvKHgsIGkpLCBDLCB4aTJ5QywgeCwgaSlcblxuZXhwb3J0IGNvbnN0IHdoZW4gPSBwID0+IChDLCB4aTJ5QywgeCwgaSkgPT5cbiAgcCh4LCBpKSA/IHhpMnlDKHgsIGkpIDogemVybyhDLCB4aTJ5QywgeCwgaSlcblxuZXhwb3J0IGNvbnN0IG9wdGlvbmFsID0gd2hlbihpc0RlZmluZWQpXG5cbmV4cG9ydCBmdW5jdGlvbiB6ZXJvKEMsIHhpMnlDLCB4LCBpKSB7XG4gIGNvbnN0IG9mID0gQy5vZlxuICByZXR1cm4gb2YgPyBvZih4KSA6ICgwLEMubWFwKShhbHdheXMoeCksIHhpMnlDKHZvaWQgMCwgaSkpXG59XG5cbi8vIFJlY3Vyc2luZ1xuXG5leHBvcnQgZnVuY3Rpb24gbGF6eShvMm8pIHtcbiAgbGV0IG1lbW8gPSAoQywgeGkyeUMsIHgsIGkpID0+IChtZW1vID0gdG9GdW5jdGlvbihvMm8ocmVjKSkpKEMsIHhpMnlDLCB4LCBpKVxuICBmdW5jdGlvbiByZWMoQywgeGkyeUMsIHgsIGkpIHtyZXR1cm4gbWVtbyhDLCB4aTJ5QywgeCwgaSl9XG4gIHJldHVybiByZWNcbn1cblxuLy8gRGVidWdnaW5nXG5cbmV4cG9ydCBmdW5jdGlvbiBsb2coKSB7XG4gIGNvbnN0IHNob3cgPSBkaXIgPT4geCA9PlxuICAgIGNvbnNvbGUubG9nLmFwcGx5KGNvbnNvbGUsXG4gICAgICAgICAgICAgICAgICAgICAgY29weVRvRnJvbShbXSwgMCwgYXJndW1lbnRzLCAwLCBhcmd1bWVudHMubGVuZ3RoKVxuICAgICAgICAgICAgICAgICAgICAgIC5jb25jYXQoW2RpciwgeF0pKSB8fCB4XG4gIHJldHVybiBpc28oc2hvdyhcImdldFwiKSwgc2hvdyhcInNldFwiKSlcbn1cblxuLy8gT3BlcmF0aW9ucyBvbiB0cmF2ZXJzYWxzXG5cbmV4cG9ydCBjb25zdCBjb25jYXRBcyA9IGNvbnN0QXMobSA9PiBDb25jYXRPZihtLmNvbmNhdCwgKDAsbS5lbXB0eSkoKSkpXG5cbmV4cG9ydCBjb25zdCBjb25jYXQgPSBjb25jYXRBcyhpZClcblxuZXhwb3J0IGNvbnN0IG1lcmdlQXMgPSBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gXCJwcm9kdWN0aW9uXCIgPyBjb25jYXRBcyA6IChmLCBtLCB0LCBkKSA9PiB7XG4gIGlmICghbWVyZ2VBcy53YXJuZWQpIHtcbiAgICBtZXJnZUFzLndhcm5lZCA9IDFcbiAgICBjb25zb2xlLndhcm4oXCJwYXJ0aWFsLmxlbnNlczogYG1lcmdlQXNgIGlzIG9ic29sZXRlLCBqdXN0IHVzZSBgY29uY2F0QXNgXCIpXG4gIH1cbiAgcmV0dXJuIGNvbmNhdEFzKGYsIG0sIHQsIGQpXG59XG5cbmV4cG9ydCBjb25zdCBtZXJnZSA9IHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSBcInByb2R1Y3Rpb25cIiA/IGNvbmNhdCA6IChtLCB0LCBkKSA9PiB7XG4gIGlmICghbWVyZ2Uud2FybmVkKSB7XG4gICAgbWVyZ2Uud2FybmVkID0gMVxuICAgIGNvbnNvbGUud2FybihcInBhcnRpYWwubGVuc2VzOiBgbWVyZ2VgIGlzIG9ic29sZXRlLCBqdXN0IHVzZSBgY29uY2F0YFwiKVxuICB9XG4gIHJldHVybiBjb25jYXQobSwgdCwgZClcbn1cblxuLy8gRm9sZHMgb3ZlciB0cmF2ZXJzYWxzXG5cbmV4cG9ydCBjb25zdCBjb2xsZWN0QXMgPSBjdXJyeSgoeGkyeSwgdCwgcykgPT5cbiAgdG9BcnJheShydW4odCwgQ29sbGVjdCwgeGkyeSwgcykpIHx8IFtdKVxuXG5leHBvcnQgY29uc3QgY29sbGVjdCA9IGNvbGxlY3RBcyhpZClcblxuZXhwb3J0IGNvbnN0IGZvbGRsID0gY3VycnkoKGYsIHIsIHQsIHMpID0+XG4gIGZvbGQoZiwgciwgcnVuKHQsIENvbGxlY3QsIHBhaXIsIHMpKSlcblxuZXhwb3J0IGNvbnN0IGZvbGRyID0gY3VycnkoKGYsIHIsIHQsIHMpID0+IHtcbiAgY29uc3QgeHMgPSBjb2xsZWN0QXMocGFpciwgdCwgcylcbiAgZm9yIChsZXQgaT14cy5sZW5ndGgtMTsgMDw9aTsgLS1pKSB7XG4gICAgY29uc3QgeCA9IHhzW2ldXG4gICAgciA9IGYociwgeFswXSwgeFsxXSlcbiAgfVxuICByZXR1cm4gclxufSlcblxuZXhwb3J0IGNvbnN0IG1heGltdW0gPSBjb25jYXQoTXVtKCh4LCB5KSA9PiB4ID4geSkpXG5cbmV4cG9ydCBjb25zdCBtaW5pbXVtID0gY29uY2F0KE11bSgoeCwgeSkgPT4geCA8IHkpKVxuXG5leHBvcnQgY29uc3QgcHJvZHVjdCA9IGNvbmNhdEFzKHVudG8oMSksIE1vbm9pZCgoeSwgeCkgPT4geCAqIHksIDEpKVxuXG5leHBvcnQgY29uc3Qgc3VtID0gY29uY2F0QXModW50bygwKSwgTW9ub2lkKCh5LCB4KSA9PiB4ICsgeSwgMCkpXG5cbi8vIENyZWF0aW5nIG5ldyB0cmF2ZXJzYWxzXG5cbmV4cG9ydCBmdW5jdGlvbiBicmFuY2godGVtcGxhdGUpIHtcbiAgY29uc3Qga2V5cyA9IFtdLCB2YWxzID0gW11cbiAgZm9yIChjb25zdCBrIGluIHRlbXBsYXRlKSB7XG4gICAga2V5cy5wdXNoKGspXG4gICAgdmFscy5wdXNoKHRvRnVuY3Rpb24odGVtcGxhdGVba10pKVxuICB9XG4gIHJldHVybiBicmFuY2hPbihrZXlzLCB2YWxzKVxufVxuXG4vLyBUcmF2ZXJzYWxzIGFuZCBjb21iaW5hdG9yc1xuXG5leHBvcnQgZnVuY3Rpb24gZWxlbXMoQSwgeGkyeUEsIHhzLCBfKSB7XG4gIGlmIChzZWVtc0FycmF5TGlrZSh4cykpIHtcbiAgICByZXR1cm4gQSA9PT0gSWRlbnRcbiAgICAgID8gbWFwUGFydGlhbEluZGV4VSh4aTJ5QSwgeHMpXG4gICAgICA6IHRyYXZlcnNlUGFydGlhbEluZGV4KEEsIHhpMnlBLCB4cylcbiAgfSBlbHNlIHtcbiAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKVxuICAgICAgcmVxQXBwbGljYXRpdmUoQSlcbiAgICByZXR1cm4gKDAsQS5vZikoeHMpXG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHZhbHVlcyhBLCB4aTJ5QSwgeHMsIF8pIHtcbiAgaWYgKHhzIGluc3RhbmNlb2YgT2JqZWN0KSB7XG4gICAgcmV0dXJuIGJyYW5jaE9uKGtleXMoeHMpKShBLCB4aTJ5QSwgeHMpXG4gIH0gZWxzZSB7XG4gICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIilcbiAgICAgIHJlcUFwcGxpY2F0aXZlKEEpXG4gICAgcmV0dXJuICgwLEEub2YpKHhzKVxuICB9XG59XG5cbi8vIE9wZXJhdGlvbnMgb24gbGVuc2VzXG5cbmV4cG9ydCBjb25zdCBnZXQgPSBjdXJyeShnZXRVKVxuXG4vLyBDcmVhdGluZyBuZXcgbGVuc2VzXG5cbmV4cG9ydCBjb25zdCBsZW5zID0gY3VycnkoKGdldCwgc2V0KSA9PiAoRiwgeGkyeUYsIHgsIGkpID0+XG4gICgwLEYubWFwKSh5ID0+IHNldCh5LCB4LCBpKSwgeGkyeUYoZ2V0KHgsIGkpLCBpKSkpXG5cbi8vIENvbXB1dGluZyBkZXJpdmVkIHByb3BzXG5cbmV4cG9ydCBjb25zdCBhdWdtZW50ID0gdGVtcGxhdGUgPT4ge1xuICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiICYmICFpc09iamVjdCh0ZW1wbGF0ZSkpXG4gICAgZXJyb3JHaXZlbihcImBhdWdtZW50YCBleHBlY3RzIGEgcGxhaW4gT2JqZWN0IHRlbXBsYXRlXCIsIHRlbXBsYXRlKVxuICByZXR1cm4gbGVucyhcbiAgICB4ID0+IHtcbiAgICAgIHggPSBkaXNzb2NQYXJ0aWFsVSgwLCB4KVxuICAgICAgaWYgKHgpXG4gICAgICAgIGZvciAoY29uc3QgayBpbiB0ZW1wbGF0ZSlcbiAgICAgICAgICB4W2tdID0gdGVtcGxhdGVba10oeClcbiAgICAgIHJldHVybiB4XG4gICAgfSxcbiAgICAoeSwgeCkgPT4ge1xuICAgICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIiAmJlxuICAgICAgICAgICEodm9pZCAwID09PSB5IHx8IHkgaW5zdGFuY2VvZiBPYmplY3QpKVxuICAgICAgICBlcnJvckdpdmVuKFwiYGF1Z21lbnRgIG11c3QgYmUgc2V0IHdpdGggdW5kZWZpbmVkIG9yIGFuIG9iamVjdFwiLCB5KVxuICAgICAgeSA9IHRvT2JqZWN0KHkpXG4gICAgICBpZiAoISh4IGluc3RhbmNlb2YgT2JqZWN0KSlcbiAgICAgICAgeCA9IHZvaWQgMFxuICAgICAgbGV0IHpcbiAgICAgIGZ1bmN0aW9uIHNldChrLCB2KSB7XG4gICAgICAgIGlmICgheilcbiAgICAgICAgICB6ID0ge31cbiAgICAgICAgeltrXSA9IHZcbiAgICAgIH1cbiAgICAgIGZvciAoY29uc3QgayBpbiB5KSB7XG4gICAgICAgIGlmICghaGFzVShrLCB0ZW1wbGF0ZSkpXG4gICAgICAgICAgc2V0KGssIHlba10pXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBpZiAoeCAmJiBoYXNVKGssIHgpKVxuICAgICAgICAgICAgc2V0KGssIHhba10pXG4gICAgICB9XG4gICAgICByZXR1cm4gelxuICAgIH0pXG59XG5cbi8vIEVuZm9yY2luZyBpbnZhcmlhbnRzXG5cbmV4cG9ydCBjb25zdCBkZWZhdWx0cyA9IG91dCA9PiB7XG4gIGNvbnN0IG8ydSA9IHggPT4gcmVwbGFjZWQob3V0LCB2b2lkIDAsIHgpXG4gIHJldHVybiAoRiwgeGkyeUYsIHgsIGkpID0+ICgwLEYubWFwKShvMnUsIHhpMnlGKHZvaWQgMCAhPT0geCA/IHggOiBvdXQsIGkpKVxufVxuXG5leHBvcnQgY29uc3QgcmVxdWlyZWQgPSBpbm4gPT4gcmVwbGFjZShpbm4sIHZvaWQgMClcblxuZXhwb3J0IGNvbnN0IGRlZmluZSA9IHYgPT4gbm9ybWFsaXplcih1bnRvKHYpKVxuXG5leHBvcnQgY29uc3Qgbm9ybWFsaXplID0geGkyeCA9PlxuICBub3JtYWxpemVyKCh4LCBpKSA9PiB2b2lkIDAgIT09IHggPyB4aTJ4KHgsIGkpIDogdm9pZCAwKVxuXG5leHBvcnQgY29uc3QgcmV3cml0ZSA9IHlpMnkgPT4gKEYsIHhpMnlGLCB4LCBpKSA9PlxuICAoMCxGLm1hcCkoeSA9PiB2b2lkIDAgIT09IHkgPyB5aTJ5KHksIGkpIDogdm9pZCAwLCB4aTJ5Rih4LCBpKSlcblxuLy8gTGVuc2luZyBhcnJheXNcblxuZXhwb3J0IGNvbnN0IGFwcGVuZCA9IChGLCB4aTJ5RiwgeHMsIGkpID0+XG4gICgwLEYubWFwKSh4ID0+IHNldEluZGV4KHNlZW1zQXJyYXlMaWtlKHhzKSA/IHhzLmxlbmd0aCA6IDAsIHgsIHhzKSxcbiAgICAgICAgICAgIHhpMnlGKHZvaWQgMCwgaSkpXG5cbmV4cG9ydCBjb25zdCBmaWx0ZXIgPSB4aTJiID0+IChGLCB4aTJ5RiwgeHMsIGkpID0+IHtcbiAgbGV0IHRzLCBmc1xuICBpZiAoc2VlbXNBcnJheUxpa2UoeHMpKVxuICAgIHBhcnRpdGlvbkludG9JbmRleCh4aTJiLCB4cywgdHMgPSBbXSwgZnMgPSBbXSlcbiAgcmV0dXJuICgwLEYubWFwKShcbiAgICB0cyA9PiB7XG4gICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiICYmXG4gICAgICAgICAgISh2b2lkIDAgPT09IHRzIHx8IHNlZW1zQXJyYXlMaWtlKHRzKSkpXG4gICAgICAgIGVycm9yR2l2ZW4oXCJgZmlsdGVyYCBtdXN0IGJlIHNldCB3aXRoIHVuZGVmaW5lZCBvciBhbiBhcnJheS1saWtlIG9iamVjdFwiLCB0cylcbiAgICAgIGNvbnN0IHRzTiA9IHRzID8gdHMubGVuZ3RoIDogMCxcbiAgICAgICAgICAgIGZzTiA9IGZzID8gZnMubGVuZ3RoIDogMCxcbiAgICAgICAgICAgIG4gPSB0c04gKyBmc05cbiAgICAgIGlmIChuKVxuICAgICAgICByZXR1cm4gbiA9PT0gZnNOXG4gICAgICAgID8gZnNcbiAgICAgICAgOiBjb3B5VG9Gcm9tKGNvcHlUb0Zyb20oQXJyYXkobiksIDAsIHRzLCAwLCB0c04pLCB0c04sIGZzLCAwLCBmc04pXG4gICAgfSxcbiAgICB4aTJ5Rih0cywgaSkpXG59XG5cbmV4cG9ydCBjb25zdCBmaW5kID0geGkyYiA9PiBjaG9vc2UoeHMgPT4ge1xuICBpZiAoIXNlZW1zQXJyYXlMaWtlKHhzKSlcbiAgICByZXR1cm4gMFxuICBjb25zdCBpID0gZmluZEluZGV4KHhpMmIsIHhzKVxuICByZXR1cm4gaSA8IDAgPyBhcHBlbmQgOiBpXG59KVxuXG5leHBvcnQgZnVuY3Rpb24gZmluZFdpdGgoLi4ubHMpIHtcbiAgY29uc3QgbGxzID0gY29tcG9zZSguLi5scylcbiAgcmV0dXJuIFtmaW5kKHggPT4gdm9pZCAwICE9PSBnZXRVKGxscywgeCkpLCBsbHNdXG59XG5cbmV4cG9ydCBjb25zdCBpbmRleCA9IHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSBcInByb2R1Y3Rpb25cIiA/IGlkIDogeCA9PiB7XG4gIGlmICghTnVtYmVyLmlzSW50ZWdlcih4KSB8fCB4IDwgMClcbiAgICBlcnJvckdpdmVuKFwiYGluZGV4YCBleHBlY3RzIGEgbm9uLW5lZ2F0aXZlIGludGVnZXJcIiwgeClcbiAgcmV0dXJuIHhcbn1cblxuZXhwb3J0IGNvbnN0IHNsaWNlID0gY3VycnkoKGJlZ2luLCBlbmQpID0+IChGLCB4c2kyeUYsIHhzLCBpKSA9PiB7XG4gIGNvbnN0IHNlZW1zID0gc2VlbXNBcnJheUxpa2UoeHMpLFxuICAgICAgICB4c04gPSBzZWVtcyAmJiB4cy5sZW5ndGgsXG4gICAgICAgIGIgPSBzbGljZUluZGV4KDAsIHhzTiwgMCwgYmVnaW4pLFxuICAgICAgICBlID0gc2xpY2VJbmRleChiLCB4c04sIHhzTiwgZW5kKVxuICByZXR1cm4gKDAsRi5tYXApKFxuICAgIHpzID0+IHtcbiAgICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIgJiZcbiAgICAgICAgICAhKHZvaWQgMCA9PT0genMgfHwgc2VlbXNBcnJheUxpa2UoenMpKSlcbiAgICAgICAgZXJyb3JHaXZlbihcImBzbGljZWAgbXVzdCBiZSBzZXQgd2l0aCB1bmRlZmluZWQgb3IgYW4gYXJyYXktbGlrZSBvYmplY3RcIiwgenMpXG4gICAgICBjb25zdCB6c04gPSB6cyA/IHpzLmxlbmd0aCA6IDAsIGJQenNOID0gYiArIHpzTiwgbiA9IHhzTiAtIGUgKyBiUHpzTlxuICAgICAgcmV0dXJuIG5cbiAgICAgICAgPyBjb3B5VG9Gcm9tKGNvcHlUb0Zyb20oY29weVRvRnJvbShBcnJheShuKSwgMCwgeHMsIDAsIGIpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB6cywgMCwgenNOKSxcbiAgICAgICAgICAgICAgICAgICAgIGJQenNOLFxuICAgICAgICAgICAgICAgICAgICAgeHMsIGUsIHhzTilcbiAgICAgICAgOiB2b2lkIDBcbiAgICB9LFxuICAgIHhzaTJ5RihzZWVtcyA/IGNvcHlUb0Zyb20oQXJyYXkoTWF0aC5tYXgoMCwgZSAtIGIpKSwgMCwgeHMsIGIsIGUpIDpcbiAgICAgICAgICAgdm9pZCAwLFxuICAgICAgICAgICBpKSlcbn0pXG5cbi8vIExlbnNpbmcgb2JqZWN0c1xuXG5leHBvcnQgY29uc3QgcHJvcCA9IHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSBcInByb2R1Y3Rpb25cIiA/IGlkIDogeCA9PiB7XG4gIGlmICghaXNTdHJpbmcoeCkpXG4gICAgZXJyb3JHaXZlbihcImBwcm9wYCBleHBlY3RzIGEgc3RyaW5nXCIsIHgpXG4gIHJldHVybiB4XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwcm9wcygpIHtcbiAgY29uc3QgbiA9IGFyZ3VtZW50cy5sZW5ndGgsIHRlbXBsYXRlID0ge31cbiAgZm9yIChsZXQgaT0wLCBrOyBpPG47ICsraSlcbiAgICB0ZW1wbGF0ZVtrID0gYXJndW1lbnRzW2ldXSA9IGtcbiAgcmV0dXJuIHBpY2sodGVtcGxhdGUpXG59XG5cbmV4cG9ydCBjb25zdCByZW1vdmFibGUgPSAoLi4ucHMpID0+IChGLCB4aTJ5RiwgeCwgaSkgPT4gKDAsRi5tYXApKFxuICB5ID0+IHtcbiAgICBpZiAoISh5IGluc3RhbmNlb2YgT2JqZWN0KSlcbiAgICAgIHJldHVybiB5XG4gICAgZm9yIChsZXQgaT0wLCBuPXBzLmxlbmd0aDsgaTxuOyArK2kpXG4gICAgICBpZiAoaGFzVShwc1tpXSwgeSkpXG4gICAgICAgIHJldHVybiB5XG4gIH0sXG4gIHhpMnlGKHgsIGkpKVxuXG4vLyBQcm92aWRpbmcgZGVmYXVsdHNcblxuZXhwb3J0IGNvbnN0IHZhbHVlT3IgPSB2ID0+IChfRiwgeGkyeUYsIHgsIGkpID0+XG4gIHhpMnlGKHZvaWQgMCAhPT0geCAmJiB4ICE9PSBudWxsID8geCA6IHYsIGkpXG5cbi8vIEFkYXB0aW5nIHRvIGRhdGFcblxuZXhwb3J0IGNvbnN0IG9yRWxzZSA9XG4gIGN1cnJ5KChkLCBsKSA9PiBjaG9vc2UoeCA9PiB2b2lkIDAgIT09IGdldFUobCwgeCkgPyBsIDogZCkpXG5cbi8vIFJlYWQtb25seSBtYXBwaW5nXG5cbmV4cG9ydCBjb25zdCB0byA9IHdpMnggPT4gKEYsIHhpMnlGLCB3LCBpKSA9PlxuICAoMCxGLm1hcCkoYWx3YXlzKHcpLCB4aTJ5Rih3aTJ4KHcsIGkpLCBpKSlcblxuZXhwb3J0IGNvbnN0IGp1c3QgPSB4ID0+IHRvKGFsd2F5cyh4KSlcblxuLy8gVHJhbnNmb3JtaW5nIGRhdGFcblxuZXhwb3J0IGNvbnN0IHBpY2sgPSB0ZW1wbGF0ZSA9PiB7XG4gIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIgJiYgIWlzT2JqZWN0KHRlbXBsYXRlKSlcbiAgICBlcnJvckdpdmVuKFwiYHBpY2tgIGV4cGVjdHMgYSBwbGFpbiBPYmplY3QgdGVtcGxhdGVcIiwgdGVtcGxhdGUpXG4gIHJldHVybiAoRiwgeGkyeUYsIHgsIGkpID0+XG4gICAgKDAsRi5tYXApKHNldFBpY2sodGVtcGxhdGUsIHgpLCB4aTJ5RihnZXRQaWNrKHRlbXBsYXRlLCB4KSwgaSkpXG59XG5cbmV4cG9ydCBjb25zdCByZXBsYWNlID0gY3VycnkoKGlubiwgb3V0KSA9PiB7XG4gIGNvbnN0IG8yaSA9IHggPT4gcmVwbGFjZWQob3V0LCBpbm4sIHgpXG4gIHJldHVybiAoRiwgeGkyeUYsIHgsIGkpID0+ICgwLEYubWFwKShvMmksIHhpMnlGKHJlcGxhY2VkKGlubiwgb3V0LCB4KSwgaSkpXG59KVxuXG4vLyBPcGVyYXRpb25zIG9uIGlzb21vcnBoaXNtc1xuXG5leHBvcnQgY29uc3QgZ2V0SW52ZXJzZSA9IGFyaXR5TigyLCBzZXRVKVxuXG4vLyBDcmVhdGluZyBuZXcgaXNvbW9ycGhpc21zXG5cbmV4cG9ydCBjb25zdCBpc28gPVxuICBjdXJyeSgoYndkLCBmd2QpID0+IChGLCB4aTJ5RiwgeCwgaSkgPT4gKDAsRi5tYXApKGZ3ZCwgeGkyeUYoYndkKHgpLCBpKSkpXG5cbi8vIElzb21vcnBoaXNtcyBhbmQgY29tYmluYXRvcnNcblxuZXhwb3J0IGNvbnN0IGlkZW50aXR5ID0gKF9GLCB4aTJ5RiwgeCwgaSkgPT4geGkyeUYoeCwgaSlcblxuZXhwb3J0IGNvbnN0IGludmVyc2UgPSBpc28gPT4gKEYsIHhpMnlGLCB4LCBpKSA9PlxuICAoMCxGLm1hcCkoeCA9PiBnZXRVKGlzbywgeCksIHhpMnlGKHNldFUoaXNvLCB4KSwgaSkpXG4iXX0=
