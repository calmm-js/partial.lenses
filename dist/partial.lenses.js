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
  if (!((0, _infestines.isFunction)(o) && (o.length === 4 || o.length <= 2))) errorGiven(expectedOptic, o);
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
      return o.length === 4 ? o(Ident, (0, _infestines.always)(x), s, void 0) : s;
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
      return l.length === 4 ? l(Const, _infestines.id, s, void 0) : l(s, void 0);
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

var fromReader = function fromReader(wi2x) {
  return function (F, xi2yF, w, i) {
    return (0, F.map)((0, _infestines.always)(w), xi2yF(wi2x(w, i), i));
  };
};

//

function toFunction(o) {
  switch (typeof o) {
    case "string":
      return funProp(o);
    case "number":
      return funIndex(o);
    case "object":
      if ("dev" !== "production") reqArray(o);
      return composed(0, o);
    default:
      if ("dev" !== "production") reqFunction(o);
      return o.length === 4 ? o : fromReader(o);
  }
}

// Operations on optics

var modify = exports.modify = (0, _infestines.curry)(function (o, xi2x, s) {
  switch (typeof o) {
    case "string":
      return setProp(o, xi2x(getProp(o, s), o), s);
    case "number":
      return setIndex(o, xi2x(getIndex(o, s), o), s);
    case "object":
      return modifyComposed(o, xi2x, s);
    default:
      if ("dev" !== "production") reqFunction(o);
      return o.length === 4 ? o(Ident, xi2x, s, void 0) : (xi2x(o(s, void 0), void 0), s);
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

var to = exports.to = "dev" === "production" ? _infestines.id : function (wi2x) {
  if (!to.warned) {
    to.warned = 1;
    console.warn("partial.lenses: `to` is obsolete, you can directly `compose` plain functions with optics");
  }
  return wi2x;
};

var just = exports.just = "dev" === "production" ? _infestines.always : function (x) {
  if (!just.warned) {
    just.warned = 1;
    console.warn("partial.lenses: `just` is obsolete, just use e.g. `R.always`");
  }
  return (0, _infestines.always)(x);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvcGFydGlhbC5sZW5zZXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7UUMwWmdCLFUsR0FBQSxVO1FBMENBLE8sR0FBQSxPO1FBOEJBLEksR0FBQSxJO1FBT0EsSSxHQUFBLEk7UUFRQSxHLEdBQUEsRztRQTJEQSxNLEdBQUEsTTtRQVdBLEssR0FBQSxLO1FBWUEsTSxHQUFBLE07UUEwR0EsUSxHQUFBLFE7UUEyQ0EsSyxHQUFBLEs7O0FBeHRCaEI7O0FBcUJBOztBQUVBLElBQU0sYUFBYSxTQUFiLFVBQWEsQ0FBQyxDQUFELEVBQUksQ0FBSixFQUFPLENBQVAsRUFBVSxDQUFWO0FBQUEsU0FDakIsS0FBSyxDQUFMLEtBQVcsQ0FBWCxHQUFlLENBQWYsR0FBbUIsS0FBSyxHQUFMLENBQVMsS0FBSyxHQUFMLENBQVMsQ0FBVCxFQUFZLElBQUksQ0FBSixHQUFRLElBQUksQ0FBWixHQUFnQixDQUE1QixDQUFULEVBQXlDLENBQXpDLENBREY7QUFBQSxDQUFuQjs7QUFHQSxTQUFTLElBQVQsQ0FBYyxFQUFkLEVBQWtCLEVBQWxCLEVBQXNCO0FBQUMsU0FBTyxDQUFDLEVBQUQsRUFBSyxFQUFMLENBQVA7QUFBZ0I7QUFDdkMsSUFBTSxRQUFRLFNBQVIsS0FBUTtBQUFBLFNBQUs7QUFBQSxXQUFNLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBTjtBQUFBLEdBQUw7QUFBQSxDQUFkOztBQUVBLElBQU0sT0FBTyxTQUFQLElBQU87QUFBQSxTQUFLO0FBQUEsV0FBSyxLQUFLLENBQUwsS0FBVyxDQUFYLEdBQWUsQ0FBZixHQUFtQixDQUF4QjtBQUFBLEdBQUw7QUFBQSxDQUFiOztBQUVBLElBQU0saUJBQWlCLFNBQWpCLGNBQWlCO0FBQUEsU0FDckIsYUFBYSxNQUFiLEtBQXdCLElBQUksRUFBRSxNQUFOLEVBQWMsTUFBTyxLQUFLLENBQVosSUFBa0IsS0FBSyxDQUE3RCxLQUNBLDBCQUFTLENBQVQsQ0FGcUI7QUFBQSxDQUF2Qjs7QUFJQTs7QUFFQSxTQUFTLGdCQUFULENBQTBCLElBQTFCLEVBQWdDLEVBQWhDLEVBQW9DO0FBQ2xDLE1BQU0sSUFBSSxHQUFHLE1BQWI7QUFBQSxNQUFxQixLQUFLLE1BQU0sQ0FBTixDQUExQjtBQUNBLE1BQUksSUFBSSxDQUFSO0FBQ0EsT0FBSyxJQUFJLElBQUUsQ0FBTixFQUFTLENBQWQsRUFBaUIsSUFBRSxDQUFuQixFQUFzQixFQUFFLENBQXhCO0FBQ0UsUUFBSSxLQUFLLENBQUwsTUFBWSxJQUFJLEtBQUssR0FBRyxDQUFILENBQUwsRUFBWSxDQUFaLENBQWhCLENBQUosRUFDRSxHQUFHLEdBQUgsSUFBVSxDQUFWO0FBRkosR0FHQSxJQUFJLENBQUosRUFBTztBQUNMLFFBQUksSUFBSSxDQUFSLEVBQ0UsR0FBRyxNQUFILEdBQVksQ0FBWjtBQUNGLFdBQU8sRUFBUDtBQUNEO0FBQ0Y7O0FBRUQsU0FBUyxVQUFULENBQW9CLEVBQXBCLEVBQXdCLENBQXhCLEVBQTJCLEVBQTNCLEVBQStCLENBQS9CLEVBQWtDLENBQWxDLEVBQXFDO0FBQ25DLFNBQU8sSUFBSSxDQUFYO0FBQ0UsT0FBRyxHQUFILElBQVUsR0FBRyxHQUFILENBQVY7QUFERixHQUVBLE9BQU8sRUFBUDtBQUNEOztBQUVEOztBQUVBLElBQU0sUUFBUSxFQUFDLHVCQUFELEVBQWMsc0JBQWQsRUFBMEIsa0JBQTFCLEVBQWQ7O0FBRUEsSUFBTSxRQUFRLEVBQUMscUJBQUQsRUFBZDs7QUFFQSxJQUFNLFdBQVcsU0FBWCxRQUFXLENBQUMsRUFBRCxFQUFLLEtBQUw7QUFBQSxTQUFnQixFQUFDLHFCQUFELEVBQVksTUFBWixFQUFnQixJQUFJLHdCQUFPLEtBQVAsQ0FBcEIsRUFBaEI7QUFBQSxDQUFqQjs7QUFFQSxJQUFNLFNBQVMsU0FBVCxNQUFTLENBQUMsTUFBRCxFQUFTLE1BQVQ7QUFBQSxTQUFvQixFQUFDLGNBQUQsRUFBUyxPQUFPO0FBQUEsYUFBTSxNQUFOO0FBQUEsS0FBaEIsRUFBcEI7QUFBQSxDQUFmOztBQUVBLElBQU0sTUFBTSxTQUFOLEdBQU07QUFBQSxTQUNWLE9BQU8sVUFBQyxDQUFELEVBQUksQ0FBSjtBQUFBLFdBQVUsS0FBSyxDQUFMLEtBQVcsQ0FBWCxLQUFpQixLQUFLLENBQUwsS0FBVyxDQUFYLElBQWdCLElBQUksQ0FBSixFQUFPLENBQVAsQ0FBakMsSUFBOEMsQ0FBOUMsR0FBa0QsQ0FBNUQ7QUFBQSxHQUFQLENBRFU7QUFBQSxDQUFaOztBQUdBOztBQUVBLElBQU0sTUFBTSxTQUFOLEdBQU0sQ0FBQyxDQUFELEVBQUksQ0FBSixFQUFPLEtBQVAsRUFBYyxDQUFkLEVBQWlCLENBQWpCO0FBQUEsU0FBdUIsV0FBVyxDQUFYLEVBQWMsQ0FBZCxFQUFpQixLQUFqQixFQUF3QixDQUF4QixFQUEyQixDQUEzQixDQUF2QjtBQUFBLENBQVo7O0FBRUEsSUFBTSxVQUFVLFNBQVYsT0FBVTtBQUFBLFNBQVcsd0JBQU8sQ0FBUCxFQUFVLFVBQUMsS0FBRCxFQUFRLENBQVIsRUFBYztBQUNqRCxRQUFNLElBQUksUUFBUSxDQUFSLENBQVY7QUFDQSxXQUFPLFVBQUMsQ0FBRCxFQUFJLENBQUo7QUFBQSxhQUFVLElBQUksQ0FBSixFQUFPLENBQVAsRUFBVSxLQUFWLEVBQWlCLENBQWpCLENBQVY7QUFBQSxLQUFQO0FBQ0QsR0FIMEIsQ0FBWDtBQUFBLENBQWhCOztBQUtBOztBQUVBLElBQU0sZ0JBQWdCLG9CQUF0Qjs7QUFFQSxTQUFTLFVBQVQsQ0FBb0IsQ0FBcEIsRUFBdUIsQ0FBdkIsRUFBMEI7QUFDeEIsVUFBUSxLQUFSLENBQWMsaUJBQWQsRUFBaUMsQ0FBakMsRUFBb0MsVUFBcEMsRUFBZ0QsQ0FBaEQ7QUFDQSxRQUFNLElBQUksS0FBSixDQUFVLENBQVYsQ0FBTjtBQUNEOztBQUVELFNBQVMsV0FBVCxDQUFxQixDQUFyQixFQUF3QjtBQUN0QixNQUFJLEVBQUUsNEJBQVcsQ0FBWCxNQUFrQixFQUFFLE1BQUYsS0FBYSxDQUFiLElBQWtCLEVBQUUsTUFBRixJQUFZLENBQWhELENBQUYsQ0FBSixFQUNFLFdBQVcsYUFBWCxFQUEwQixDQUExQjtBQUNIOztBQUVELFNBQVMsUUFBVCxDQUFrQixDQUFsQixFQUFxQjtBQUNuQixNQUFJLENBQUMsTUFBTSxPQUFOLENBQWMsQ0FBZCxDQUFMLEVBQ0UsV0FBVyxhQUFYLEVBQTBCLENBQTFCO0FBQ0g7O0FBRUQ7O0FBRUEsU0FBUyxjQUFULENBQXdCLENBQXhCLEVBQTJCO0FBQ3pCLE1BQUksQ0FBQyxFQUFFLEVBQVAsRUFDRSxXQUFXLG1DQUFYLEVBQWdELENBQWhEO0FBQ0g7O0FBRUQ7O0FBRUEsU0FBUyxJQUFULENBQWMsQ0FBZCxFQUFpQixDQUFqQixFQUFvQjtBQUFDLE9BQUssQ0FBTCxHQUFTLENBQVQsQ0FBWSxLQUFLLENBQUwsR0FBUyxDQUFUO0FBQVc7O0FBRTVDLElBQU0sU0FBUyxTQUFULE1BQVM7QUFBQSxTQUFLLEVBQUUsV0FBRixLQUFrQixJQUF2QjtBQUFBLENBQWY7O0FBRUEsSUFBTSxPQUFPLFNBQVAsSUFBTyxDQUFDLENBQUQsRUFBSSxDQUFKO0FBQUEsU0FBVSxLQUFLLENBQUwsS0FBVyxDQUFYLEdBQWUsS0FBSyxDQUFMLEtBQVcsQ0FBWCxHQUFlLElBQUksSUFBSixDQUFTLENBQVQsRUFBWSxDQUFaLENBQWYsR0FBZ0MsQ0FBL0MsR0FBbUQsQ0FBN0Q7QUFBQSxDQUFiOztBQUVBLElBQU0sUUFBUSxTQUFSLEtBQVE7QUFBQSxTQUFLO0FBQUEsV0FBSyxLQUFLLENBQUwsRUFBUSxDQUFSLENBQUw7QUFBQSxHQUFMO0FBQUEsQ0FBZDs7QUFFQSxTQUFTLE1BQVQsQ0FBZ0IsQ0FBaEIsRUFBbUIsRUFBbkIsRUFBdUI7QUFDckIsU0FBTyxLQUFLLE9BQU8sQ0FBUCxDQUFaLEVBQXVCO0FBQ3JCLFFBQU0sSUFBSSxFQUFFLENBQVo7QUFDQSxRQUFJLEVBQUUsQ0FBTjtBQUNBLFFBQUksS0FBSyxPQUFPLENBQVAsQ0FBVCxFQUFvQjtBQUNsQixhQUFPLEVBQUUsQ0FBVCxFQUFZLEVBQVo7QUFDQSxhQUFPLEVBQUUsQ0FBVCxFQUFZLEVBQVo7QUFDRCxLQUhELE1BR087QUFDTCxTQUFHLElBQUgsQ0FBUSxDQUFSO0FBQ0Q7QUFDRjtBQUNELEtBQUcsSUFBSCxDQUFRLENBQVI7QUFDRDs7QUFFRCxTQUFTLE9BQVQsQ0FBaUIsQ0FBakIsRUFBb0I7QUFDbEIsTUFBSSxLQUFLLENBQUwsS0FBVyxDQUFmLEVBQWtCO0FBQ2hCLFFBQU0sS0FBSyxFQUFYO0FBQ0EsV0FBTyxDQUFQLEVBQVUsRUFBVjtBQUNBLFdBQU8sRUFBUDtBQUNEO0FBQ0Y7O0FBRUQsU0FBUyxPQUFULENBQWlCLENBQWpCLEVBQW9CLENBQXBCLEVBQXVCLENBQXZCLEVBQTBCO0FBQ3hCLFNBQU8sT0FBTyxDQUFQLENBQVAsRUFBa0I7QUFDaEIsUUFBTSxJQUFJLEVBQUUsQ0FBWjtBQUNBLFFBQUksRUFBRSxDQUFOO0FBQ0EsUUFBSSxPQUFPLENBQVAsSUFDQSxRQUFRLENBQVIsRUFBVyxRQUFRLENBQVIsRUFBVyxDQUFYLEVBQWMsRUFBRSxDQUFoQixDQUFYLEVBQStCLEVBQUUsQ0FBakMsQ0FEQSxHQUVBLEVBQUUsQ0FBRixFQUFLLEVBQUUsQ0FBRixDQUFMLEVBQVcsRUFBRSxDQUFGLENBQVgsQ0FGSjtBQUdEO0FBQ0QsU0FBTyxFQUFFLENBQUYsRUFBSyxFQUFFLENBQUYsQ0FBTCxFQUFXLEVBQUUsQ0FBRixDQUFYLENBQVA7QUFDRDs7QUFFRCxJQUFNLE9BQU8sU0FBUCxJQUFPLENBQUMsQ0FBRCxFQUFJLENBQUosRUFBTyxDQUFQO0FBQUEsU0FBYSxLQUFLLENBQUwsS0FBVyxDQUFYLEdBQWUsUUFBUSxDQUFSLEVBQVcsQ0FBWCxFQUFjLENBQWQsQ0FBZixHQUFrQyxDQUEvQztBQUFBLENBQWI7O0FBRUEsSUFBTSxVQUFVLFNBQVMsSUFBVCxDQUFoQjs7QUFFQTs7QUFFQSxTQUFTLG9CQUFULENBQThCLENBQTlCLEVBQWlDLEtBQWpDLEVBQXdDLEVBQXhDLEVBQTRDO0FBQzFDLE1BQU0sS0FBSyxFQUFFLEVBQWI7QUFBQSxNQUFpQixNQUFNLEVBQUUsR0FBekI7QUFDQSxNQUFJLFFBQVEsR0FBUixDQUFZLFFBQVosS0FBeUIsWUFBN0IsRUFDRSxlQUFlLENBQWY7QUFDRixNQUFJLE1BQU0sQ0FBQyxHQUFFLEVBQUUsRUFBTCxFQUFTLEtBQUssQ0FBZCxDQUFWO0FBQUEsTUFBNEIsSUFBSSxHQUFHLE1BQW5DO0FBQ0EsU0FBTyxHQUFQO0FBQ0UsVUFBTSxHQUFHLElBQUksS0FBSixFQUFXLE1BQU0sR0FBRyxDQUFILENBQU4sRUFBYSxDQUFiLENBQVgsQ0FBSCxFQUFnQyxHQUFoQyxDQUFOO0FBREYsR0FFQSxPQUFPLElBQUksT0FBSixFQUFhLEdBQWIsQ0FBUDtBQUNEOztBQUVEOztBQUVBLFNBQVMsa0JBQVQsQ0FBNEIsQ0FBNUIsRUFBK0I7QUFDN0IsTUFBSSxFQUFFLGFBQWEsTUFBZixDQUFKLEVBQ0UsT0FBTyxDQUFQO0FBQ0YsT0FBSyxJQUFNLENBQVgsSUFBZ0IsQ0FBaEI7QUFDRSxXQUFPLENBQVA7QUFERjtBQUVEOztBQUVEOztBQUVBLElBQU0sV0FBVyxTQUFYLFFBQVcsQ0FBQyxHQUFELEVBQU0sR0FBTjtBQUFBLFNBQWM7QUFBQSxXQUFLLFVBQUMsQ0FBRCxFQUFJLEtBQUosRUFBVyxDQUFYLEVBQWMsQ0FBZDtBQUFBLGFBQ2xDLENBQUMsR0FBRSxFQUFFLEdBQUwsRUFBVTtBQUFBLGVBQUssSUFBSSxDQUFKLEVBQU8sQ0FBUCxFQUFVLENBQVYsQ0FBTDtBQUFBLE9BQVYsRUFBNkIsTUFBTSxJQUFJLENBQUosRUFBTyxDQUFQLENBQU4sRUFBaUIsQ0FBakIsQ0FBN0IsQ0FEa0M7QUFBQSxLQUFMO0FBQUEsR0FBZDtBQUFBLENBQWpCOztBQUdBOztBQUVBLElBQU0sVUFBVSxTQUFWLE9BQVUsQ0FBQyxDQUFELEVBQUksQ0FBSjtBQUFBLFNBQVUsYUFBYSxNQUFiLEdBQXNCLEVBQUUsQ0FBRixDQUF0QixHQUE2QixLQUFLLENBQTVDO0FBQUEsQ0FBaEI7O0FBRUEsSUFBTSxVQUFVLFNBQVYsT0FBVSxDQUFDLENBQUQsRUFBSSxDQUFKLEVBQU8sQ0FBUDtBQUFBLFNBQ2QsS0FBSyxDQUFMLEtBQVcsQ0FBWCxHQUFlLCtCQUFjLENBQWQsRUFBaUIsQ0FBakIsRUFBb0IsQ0FBcEIsQ0FBZixHQUF3QyxnQ0FBZSxDQUFmLEVBQWtCLENBQWxCLENBRDFCO0FBQUEsQ0FBaEI7O0FBR0EsSUFBTSxVQUFVLFNBQVMsT0FBVCxFQUFrQixPQUFsQixDQUFoQjs7QUFFQTs7QUFFQSxJQUFNLFdBQVcsU0FBWCxRQUFXLENBQUMsQ0FBRCxFQUFJLEVBQUo7QUFBQSxTQUFXLGVBQWUsRUFBZixJQUFxQixHQUFHLENBQUgsQ0FBckIsR0FBNkIsS0FBSyxDQUE3QztBQUFBLENBQWpCOztBQUVBLFNBQVMsUUFBVCxDQUFrQixDQUFsQixFQUFxQixDQUFyQixFQUF3QixFQUF4QixFQUE0QjtBQUMxQixNQUFJLFFBQVEsR0FBUixDQUFZLFFBQVosS0FBeUIsWUFBekIsSUFBeUMsSUFBSSxDQUFqRCxFQUNFLFdBQVcsK0NBQVgsRUFBNEQsQ0FBNUQ7QUFDRixNQUFJLENBQUMsZUFBZSxFQUFmLENBQUwsRUFDRSxLQUFLLEVBQUw7QUFDRixNQUFNLElBQUksR0FBRyxNQUFiO0FBQ0EsTUFBSSxLQUFLLENBQUwsS0FBVyxDQUFmLEVBQWtCO0FBQ2hCLFFBQU0sSUFBSSxLQUFLLEdBQUwsQ0FBUyxJQUFFLENBQVgsRUFBYyxDQUFkLENBQVY7QUFBQSxRQUE0QixLQUFLLE1BQU0sQ0FBTixDQUFqQztBQUNBLFNBQUssSUFBSSxJQUFFLENBQVgsRUFBYyxJQUFFLENBQWhCLEVBQW1CLEVBQUUsQ0FBckI7QUFDRSxTQUFHLENBQUgsSUFBUSxHQUFHLENBQUgsQ0FBUjtBQURGLEtBRUEsR0FBRyxDQUFILElBQVEsQ0FBUjtBQUNBLFdBQU8sRUFBUDtBQUNELEdBTkQsTUFNTztBQUNMLFFBQUksSUFBSSxDQUFSLEVBQVc7QUFDVCxVQUFJLEtBQUssQ0FBVCxFQUNFLE9BQU8sV0FBVyxNQUFNLENBQU4sQ0FBWCxFQUFxQixDQUFyQixFQUF3QixFQUF4QixFQUE0QixDQUE1QixFQUErQixDQUEvQixDQUFQO0FBQ0YsVUFBSSxJQUFJLENBQVIsRUFBVztBQUNULFlBQU0sTUFBSyxNQUFNLElBQUUsQ0FBUixDQUFYO0FBQ0EsYUFBSyxJQUFJLEtBQUUsQ0FBWCxFQUFjLEtBQUUsQ0FBaEIsRUFBbUIsRUFBRSxFQUFyQjtBQUNFLGNBQUcsRUFBSCxJQUFRLEdBQUcsRUFBSCxDQUFSO0FBREYsU0FFQSxLQUFLLElBQUksTUFBRSxJQUFFLENBQWIsRUFBZ0IsTUFBRSxDQUFsQixFQUFxQixFQUFFLEdBQXZCO0FBQ0UsY0FBRyxNQUFFLENBQUwsSUFBVSxHQUFHLEdBQUgsQ0FBVjtBQURGLFNBRUEsT0FBTyxHQUFQO0FBQ0Q7QUFDRjtBQUNGO0FBQ0Y7O0FBRUQsSUFBTSxXQUFXLFNBQVMsUUFBVCxFQUFtQixRQUFuQixDQUFqQjs7QUFFQTs7QUFFQSxJQUFNLFFBQVEsU0FBUixLQUFRLENBQUMsQ0FBRCxFQUFJLENBQUosRUFBTyxLQUFQO0FBQUEsU0FBaUIsVUFBQyxDQUFELEVBQUksQ0FBSjtBQUFBLFdBQVUsRUFBRSxDQUFGLEVBQUssS0FBTCxFQUFZLENBQVosRUFBZSxDQUFmLENBQVY7QUFBQSxHQUFqQjtBQUFBLENBQWQ7O0FBRUEsU0FBUyxRQUFULENBQWtCLEdBQWxCLEVBQXVCLEVBQXZCLEVBQTJCO0FBQ3pCLE1BQU0sSUFBSSxHQUFHLE1BQUgsR0FBWSxHQUF0QjtBQUNBLE1BQUksV0FBSjtBQUNBLE1BQUksSUFBSSxDQUFSLEVBQVc7QUFDVCxXQUFPLElBQUksV0FBVyxHQUFHLEdBQUgsQ0FBWCxDQUFKLEdBQTBCLFFBQWpDO0FBQ0QsR0FGRCxNQUVPO0FBQ0wsU0FBSyxNQUFNLENBQU4sQ0FBTDtBQUNBLFNBQUssSUFBSSxJQUFFLENBQVgsRUFBYSxJQUFFLENBQWYsRUFBaUIsRUFBRSxDQUFuQjtBQUNFLFNBQUcsQ0FBSCxJQUFRLFdBQVcsR0FBRyxJQUFFLEdBQUwsQ0FBWCxDQUFSO0FBREYsS0FFQSxPQUFPLFVBQUMsQ0FBRCxFQUFJLEtBQUosRUFBVyxDQUFYLEVBQWMsQ0FBZCxFQUFvQjtBQUN6QixVQUFJLElBQUUsQ0FBTjtBQUNBLGFBQU8sRUFBRSxDQUFUO0FBQ0UsZ0JBQVEsTUFBTSxHQUFHLENBQUgsQ0FBTixFQUFhLENBQWIsRUFBZ0IsS0FBaEIsQ0FBUjtBQURGLE9BRUEsT0FBTyxHQUFHLENBQUgsRUFBTSxDQUFOLEVBQVMsS0FBVCxFQUFnQixDQUFoQixFQUFtQixDQUFuQixDQUFQO0FBQ0QsS0FMRDtBQU1EO0FBQ0Y7O0FBRUQsU0FBUyxJQUFULENBQWMsQ0FBZCxFQUFpQixDQUFqQixFQUFvQixDQUFwQixFQUF1QjtBQUNyQixVQUFRLE9BQU8sQ0FBZjtBQUNFLFNBQUssUUFBTDtBQUNFLGFBQU8sUUFBUSxDQUFSLEVBQVcsQ0FBWCxFQUFjLENBQWQsQ0FBUDtBQUNGLFNBQUssUUFBTDtBQUNFLGFBQU8sU0FBUyxDQUFULEVBQVksQ0FBWixFQUFlLENBQWYsQ0FBUDtBQUNGLFNBQUssUUFBTDtBQUNFLFVBQUksUUFBUSxHQUFSLENBQVksUUFBWixLQUF5QixZQUE3QixFQUNFLFNBQVMsQ0FBVDtBQUNGLGFBQU8sZUFBZSxDQUFmLEVBQWtCLENBQWxCLEVBQXFCLENBQXJCLEVBQXdCLENBQXhCLENBQVA7QUFDRjtBQUNFLFVBQUksUUFBUSxHQUFSLENBQVksUUFBWixLQUF5QixZQUE3QixFQUNFLFlBQVksQ0FBWjtBQUNGLGFBQU8sRUFBRSxNQUFGLEtBQWEsQ0FBYixHQUFpQixFQUFFLEtBQUYsRUFBUyx3QkFBTyxDQUFQLENBQVQsRUFBb0IsQ0FBcEIsRUFBdUIsS0FBSyxDQUE1QixDQUFqQixHQUFrRCxDQUF6RDtBQVpKO0FBY0Q7O0FBRUQsU0FBUyxJQUFULENBQWMsQ0FBZCxFQUFpQixDQUFqQixFQUFvQjtBQUNsQixVQUFRLE9BQU8sQ0FBZjtBQUNFLFNBQUssUUFBTDtBQUNFLGFBQU8sUUFBUSxDQUFSLEVBQVcsQ0FBWCxDQUFQO0FBQ0YsU0FBSyxRQUFMO0FBQ0UsYUFBTyxTQUFTLENBQVQsRUFBWSxDQUFaLENBQVA7QUFDRixTQUFLLFFBQUw7QUFDRSxVQUFJLFFBQVEsR0FBUixDQUFZLFFBQVosS0FBeUIsWUFBN0IsRUFDRSxTQUFTLENBQVQ7QUFDRixXQUFLLElBQUksSUFBRSxDQUFOLEVBQVMsSUFBRSxFQUFFLE1BQWIsRUFBcUIsQ0FBMUIsRUFBNkIsSUFBRSxDQUEvQixFQUFrQyxFQUFFLENBQXBDO0FBQ0UsZ0JBQVEsUUFBUSxJQUFJLEVBQUUsQ0FBRixDQUFaLENBQVI7QUFDRSxlQUFLLFFBQUw7QUFBZSxnQkFBSSxRQUFRLENBQVIsRUFBVyxDQUFYLENBQUosQ0FBbUI7QUFDbEMsZUFBSyxRQUFMO0FBQWUsZ0JBQUksU0FBUyxDQUFULEVBQVksQ0FBWixDQUFKLENBQW9CO0FBQ25DO0FBQVMsZ0JBQUksS0FBSyxDQUFMLEVBQVEsQ0FBUixDQUFKLENBQWdCO0FBSDNCO0FBREYsT0FNQSxPQUFPLENBQVA7QUFDRjtBQUNFLFVBQUksUUFBUSxHQUFSLENBQVksUUFBWixLQUF5QixZQUE3QixFQUNFLFlBQVksQ0FBWjtBQUNGLGFBQU8sRUFBRSxNQUFGLEtBQWEsQ0FBYixHQUFpQixFQUFFLEtBQUYsa0JBQWEsQ0FBYixFQUFnQixLQUFLLENBQXJCLENBQWpCLEdBQTJDLEVBQUUsQ0FBRixFQUFLLEtBQUssQ0FBVixDQUFsRDtBQWxCSjtBQW9CRDs7QUFFRCxTQUFTLGNBQVQsQ0FBd0IsRUFBeEIsRUFBNEIsSUFBNUIsRUFBa0MsQ0FBbEMsRUFBcUMsQ0FBckMsRUFBd0M7QUFDdEMsTUFBSSxRQUFRLEdBQVIsQ0FBWSxRQUFaLEtBQXlCLFlBQTdCLEVBQ0UsU0FBUyxFQUFUO0FBQ0YsTUFBSSxJQUFJLEdBQUcsTUFBWDtBQUNBLE1BQU0sS0FBSyxNQUFNLENBQU4sQ0FBWDtBQUNBLE9BQUssSUFBSSxJQUFFLENBQU4sRUFBUyxDQUFkLEVBQWlCLElBQUUsQ0FBbkIsRUFBc0IsRUFBRSxDQUF4QixFQUEyQjtBQUN6QixPQUFHLENBQUgsSUFBUSxDQUFSO0FBQ0EsWUFBUSxRQUFRLElBQUksR0FBRyxDQUFILENBQVosQ0FBUjtBQUNFLFdBQUssUUFBTDtBQUNFLFlBQUksUUFBUSxDQUFSLEVBQVcsQ0FBWCxDQUFKO0FBQ0E7QUFDRixXQUFLLFFBQUw7QUFDRSxZQUFJLFNBQVMsQ0FBVCxFQUFZLENBQVosQ0FBSjtBQUNBO0FBQ0Y7QUFDRSxZQUFJLFNBQVMsQ0FBVCxFQUFZLEVBQVosRUFBZ0IsS0FBaEIsRUFBdUIsUUFBUSx3QkFBTyxDQUFQLENBQS9CLEVBQTBDLENBQTFDLEVBQTZDLEdBQUcsSUFBRSxDQUFMLENBQTdDLENBQUo7QUFDQSxZQUFJLENBQUo7QUFDQTtBQVZKO0FBWUQ7QUFDRCxNQUFJLE1BQU0sR0FBRyxNQUFiLEVBQ0UsSUFBSSxPQUFPLEtBQUssQ0FBTCxFQUFRLEdBQUcsSUFBRSxDQUFMLENBQVIsQ0FBUCxHQUEwQixDQUE5QjtBQUNGLE9BQUssSUFBSSxFQUFULEVBQVksS0FBSyxFQUFFLENBQW5CO0FBQ0UsUUFBSSwwQkFBUyxLQUFJLEdBQUcsQ0FBSCxDQUFiLElBQ0UsUUFBUSxFQUFSLEVBQVcsQ0FBWCxFQUFjLEdBQUcsQ0FBSCxDQUFkLENBREYsR0FFRSxTQUFTLEVBQVQsRUFBWSxDQUFaLEVBQWUsR0FBRyxDQUFILENBQWYsQ0FGTjtBQURGLEdBSUEsT0FBTyxDQUFQO0FBQ0Q7O0FBRUQ7O0FBRUEsU0FBUyxPQUFULENBQWlCLFFBQWpCLEVBQTJCLENBQTNCLEVBQThCO0FBQzVCLE1BQUksVUFBSjtBQUNBLE9BQUssSUFBTSxDQUFYLElBQWdCLFFBQWhCLEVBQTBCO0FBQ3hCLFFBQU0sSUFBSSxLQUFLLFNBQVMsQ0FBVCxDQUFMLEVBQWtCLENBQWxCLENBQVY7QUFDQSxRQUFJLEtBQUssQ0FBTCxLQUFXLENBQWYsRUFBa0I7QUFDaEIsVUFBSSxDQUFDLENBQUwsRUFDRSxJQUFJLEVBQUo7QUFDRixRQUFFLENBQUYsSUFBTyxDQUFQO0FBQ0Q7QUFDRjtBQUNELFNBQU8sQ0FBUDtBQUNEOztBQUVELElBQU0sVUFBVSxTQUFWLE9BQVUsQ0FBQyxRQUFELEVBQVcsQ0FBWDtBQUFBLFNBQWlCLGlCQUFTO0FBQ3hDLFFBQUksUUFBUSxHQUFSLENBQVksUUFBWixLQUF5QixZQUF6QixJQUNBLEVBQUUsS0FBSyxDQUFMLEtBQVcsS0FBWCxJQUFvQixpQkFBaUIsTUFBdkMsQ0FESixFQUVFLFdBQVcsZ0RBQVgsRUFBNkQsS0FBN0Q7QUFDRixTQUFLLElBQU0sQ0FBWCxJQUFnQixRQUFoQjtBQUNFLFVBQUksS0FBSyxTQUFTLENBQVQsQ0FBTCxFQUFrQixTQUFTLE1BQU0sQ0FBTixDQUEzQixFQUFxQyxDQUFyQyxDQUFKO0FBREYsS0FFQSxPQUFPLENBQVA7QUFDRCxHQVBlO0FBQUEsQ0FBaEI7O0FBU0E7O0FBRUEsSUFBTSxXQUFXLFNBQVgsUUFBVztBQUFBLFNBQUssK0JBQWMsQ0FBZCxNQUFxQixNQUFyQixHQUE4QixPQUFPLE1BQVAsQ0FBYyxFQUFkLEVBQWtCLENBQWxCLENBQTlCLEdBQXFELENBQTFEO0FBQUEsQ0FBakI7O0FBRUE7O0FBRUEsSUFBTSxnQkFBZ0IsU0FBaEIsYUFBZ0IsQ0FBQyxDQUFELEVBQUksSUFBSjtBQUFBLFNBQWEsY0FBTTtBQUN2QyxRQUFNLElBQUksRUFBVjtBQUFBLFFBQWMsSUFBSSxLQUFLLE1BQXZCO0FBQ0EsU0FBSyxJQUFJLElBQUUsQ0FBWCxFQUFjLElBQUUsQ0FBaEIsRUFBbUIsRUFBRSxDQUFGLEVBQUssS0FBRyxHQUFHLENBQUgsQ0FBM0IsRUFBa0M7QUFDaEMsVUFBTSxJQUFJLEdBQUcsQ0FBSCxDQUFWO0FBQ0EsUUFBRSxLQUFLLENBQUwsQ0FBRixJQUFhLEtBQUssQ0FBTCxLQUFXLENBQVgsR0FBZSxDQUFmLEdBQW1CLENBQWhDO0FBQ0Q7QUFDRCxRQUFJLFVBQUo7QUFDQSxRQUFJLFNBQVMsQ0FBVCxDQUFKO0FBQ0EsU0FBSyxJQUFNLENBQVgsSUFBZ0IsQ0FBaEIsRUFBbUI7QUFDakIsVUFBTSxLQUFJLEVBQUUsQ0FBRixDQUFWO0FBQ0EsVUFBSSxNQUFNLEVBQVYsRUFBYTtBQUNYLFVBQUUsQ0FBRixJQUFPLENBQVA7QUFDQSxZQUFJLENBQUMsQ0FBTCxFQUNFLElBQUksRUFBSjtBQUNGLFVBQUUsQ0FBRixJQUFPLEtBQUssQ0FBTCxLQUFXLEVBQVgsR0FBZSxFQUFmLEdBQW1CLEVBQUUsQ0FBRixDQUExQjtBQUNEO0FBQ0Y7QUFDRCxTQUFLLElBQUksS0FBRSxDQUFYLEVBQWMsS0FBRSxDQUFoQixFQUFtQixFQUFFLEVBQXJCLEVBQXdCO0FBQ3RCLFVBQU0sS0FBSSxLQUFLLEVBQUwsQ0FBVjtBQUNBLFVBQU0sTUFBSSxFQUFFLEVBQUYsQ0FBVjtBQUNBLFVBQUksTUFBTSxHQUFWLEVBQWE7QUFDWCxZQUFJLENBQUMsQ0FBTCxFQUNFLElBQUksRUFBSjtBQUNGLFVBQUUsRUFBRixJQUFPLEdBQVA7QUFDRDtBQUNGO0FBQ0QsV0FBTyxDQUFQO0FBQ0QsR0EzQnFCO0FBQUEsQ0FBdEI7O0FBNkJBLElBQU0sV0FBVyxTQUFYLFFBQVcsQ0FBQyxJQUFELEVBQU8sSUFBUDtBQUFBLFNBQWdCLFVBQUMsQ0FBRCxFQUFJLEtBQUosRUFBVyxDQUFYLEVBQWMsQ0FBZCxFQUFvQjtBQUNuRCxRQUFJLFFBQVEsR0FBUixDQUFZLFFBQVosS0FBeUIsWUFBN0IsRUFDRSxlQUFlLENBQWY7QUFDRixRQUFNLEtBQUssRUFBRSxFQUFiO0FBQ0EsUUFBSSxJQUFJLEtBQUssTUFBYjtBQUNBLFFBQUksQ0FBQyxDQUFMLEVBQ0UsT0FBTyxHQUFHLG1CQUFtQixDQUFuQixDQUFILENBQVA7QUFDRixRQUFJLEVBQUUsYUFBYSxNQUFmLENBQUosRUFDRTtBQUNGLFFBQU0sS0FBSyxFQUFFLEVBQWI7QUFBQSxRQUFpQixNQUFNLEVBQUUsR0FBekI7QUFDQSxRQUFJLE1BQU0sR0FBRyxDQUFILENBQVY7QUFDQSxXQUFPLEdBQVAsRUFBWTtBQUNWLFVBQU0sSUFBSSxLQUFLLENBQUwsQ0FBVjtBQUFBLFVBQW1CLElBQUksRUFBRSxDQUFGLENBQXZCO0FBQ0EsWUFBTSxHQUFHLElBQUksS0FBSixFQUFXLE9BQU8sS0FBSyxDQUFMLEVBQVEsQ0FBUixFQUFXLEtBQVgsRUFBa0IsQ0FBbEIsRUFBcUIsQ0FBckIsQ0FBUCxHQUFpQyxNQUFNLENBQU4sRUFBUyxDQUFULENBQTVDLENBQUgsRUFBNkQsR0FBN0QsQ0FBTjtBQUNEO0FBQ0QsV0FBTyxJQUFJLGNBQWMsQ0FBZCxFQUFpQixJQUFqQixDQUFKLEVBQTRCLEdBQTVCLENBQVA7QUFDRCxHQWhCZ0I7QUFBQSxDQUFqQjs7QUFrQkEsSUFBTSxhQUFhLFNBQWIsVUFBYTtBQUFBLFNBQVEsVUFBQyxDQUFELEVBQUksS0FBSixFQUFXLENBQVgsRUFBYyxDQUFkO0FBQUEsV0FDekIsQ0FBQyxHQUFFLEVBQUUsR0FBTCxFQUFVO0FBQUEsYUFBSyxLQUFLLENBQUwsRUFBUSxDQUFSLENBQUw7QUFBQSxLQUFWLEVBQTJCLE1BQU0sS0FBSyxDQUFMLEVBQVEsQ0FBUixDQUFOLEVBQWtCLENBQWxCLENBQTNCLENBRHlCO0FBQUEsR0FBUjtBQUFBLENBQW5COztBQUdBLElBQU0sV0FBVyxTQUFYLFFBQVcsQ0FBQyxHQUFELEVBQU0sR0FBTixFQUFXLENBQVg7QUFBQSxTQUFpQixnQ0FBZSxDQUFmLEVBQWtCLEdBQWxCLElBQXlCLEdBQXpCLEdBQStCLENBQWhEO0FBQUEsQ0FBakI7O0FBRUEsU0FBUyxTQUFULENBQW1CLElBQW5CLEVBQXlCLEVBQXpCLEVBQTZCO0FBQzNCLE9BQUssSUFBSSxJQUFFLENBQU4sRUFBUyxJQUFFLEdBQUcsTUFBbkIsRUFBMkIsSUFBRSxDQUE3QixFQUFnQyxFQUFFLENBQWxDO0FBQ0UsUUFBSSxLQUFLLEdBQUcsQ0FBSCxDQUFMLEVBQVksQ0FBWixDQUFKLEVBQ0UsT0FBTyxDQUFQO0FBRkosR0FHQSxPQUFPLENBQUMsQ0FBUjtBQUNEOztBQUVELFNBQVMsa0JBQVQsQ0FBNEIsSUFBNUIsRUFBa0MsRUFBbEMsRUFBc0MsRUFBdEMsRUFBMEMsRUFBMUMsRUFBOEM7QUFDNUMsT0FBSyxJQUFJLElBQUUsQ0FBTixFQUFTLElBQUUsR0FBRyxNQUFkLEVBQXNCLENBQTNCLEVBQThCLElBQUUsQ0FBaEMsRUFBbUMsRUFBRSxDQUFyQztBQUNFLEtBQUMsS0FBSyxJQUFJLEdBQUcsQ0FBSCxDQUFULEVBQWdCLENBQWhCLElBQXFCLEVBQXJCLEdBQTBCLEVBQTNCLEVBQStCLElBQS9CLENBQW9DLENBQXBDO0FBREY7QUFFRDs7QUFFRCxJQUFNLGFBQWEsU0FBYixVQUFhO0FBQUEsU0FBUSxVQUFDLENBQUQsRUFBSSxLQUFKLEVBQVcsQ0FBWCxFQUFjLENBQWQ7QUFBQSxXQUN6QixDQUFDLEdBQUUsRUFBRSxHQUFMLEVBQVUsd0JBQU8sQ0FBUCxDQUFWLEVBQXFCLE1BQU0sS0FBSyxDQUFMLEVBQVEsQ0FBUixDQUFOLEVBQWtCLENBQWxCLENBQXJCLENBRHlCO0FBQUEsR0FBUjtBQUFBLENBQW5COztBQUdBOztBQUVPLFNBQVMsVUFBVCxDQUFvQixDQUFwQixFQUF1QjtBQUM1QixVQUFRLE9BQU8sQ0FBZjtBQUNFLFNBQUssUUFBTDtBQUNFLGFBQU8sUUFBUSxDQUFSLENBQVA7QUFDRixTQUFLLFFBQUw7QUFDRSxhQUFPLFNBQVMsQ0FBVCxDQUFQO0FBQ0YsU0FBSyxRQUFMO0FBQ0UsVUFBSSxRQUFRLEdBQVIsQ0FBWSxRQUFaLEtBQXlCLFlBQTdCLEVBQ0UsU0FBUyxDQUFUO0FBQ0YsYUFBTyxTQUFTLENBQVQsRUFBWSxDQUFaLENBQVA7QUFDRjtBQUNFLFVBQUksUUFBUSxHQUFSLENBQVksUUFBWixLQUF5QixZQUE3QixFQUNFLFlBQVksQ0FBWjtBQUNGLGFBQU8sRUFBRSxNQUFGLEtBQWEsQ0FBYixHQUFpQixDQUFqQixHQUFxQixXQUFXLENBQVgsQ0FBNUI7QUFaSjtBQWNEOztBQUVEOztBQUVPLElBQU0sMEJBQVMsdUJBQU0sVUFBQyxDQUFELEVBQUksSUFBSixFQUFVLENBQVYsRUFBZ0I7QUFDMUMsVUFBUSxPQUFPLENBQWY7QUFDRSxTQUFLLFFBQUw7QUFDRSxhQUFPLFFBQVEsQ0FBUixFQUFXLEtBQUssUUFBUSxDQUFSLEVBQVcsQ0FBWCxDQUFMLEVBQW9CLENBQXBCLENBQVgsRUFBbUMsQ0FBbkMsQ0FBUDtBQUNGLFNBQUssUUFBTDtBQUNFLGFBQU8sU0FBUyxDQUFULEVBQVksS0FBSyxTQUFTLENBQVQsRUFBWSxDQUFaLENBQUwsRUFBcUIsQ0FBckIsQ0FBWixFQUFxQyxDQUFyQyxDQUFQO0FBQ0YsU0FBSyxRQUFMO0FBQ0UsYUFBTyxlQUFlLENBQWYsRUFBa0IsSUFBbEIsRUFBd0IsQ0FBeEIsQ0FBUDtBQUNGO0FBQ0UsVUFBSSxRQUFRLEdBQVIsQ0FBWSxRQUFaLEtBQXlCLFlBQTdCLEVBQ0UsWUFBWSxDQUFaO0FBQ0YsYUFBTyxFQUFFLE1BQUYsS0FBYSxDQUFiLEdBQ0gsRUFBRSxLQUFGLEVBQVMsSUFBVCxFQUFlLENBQWYsRUFBa0IsS0FBSyxDQUF2QixDQURHLElBRUYsS0FBSyxFQUFFLENBQUYsRUFBSyxLQUFLLENBQVYsQ0FBTCxFQUFtQixLQUFLLENBQXhCLEdBQTRCLENBRjFCLENBQVA7QUFWSjtBQWNELENBZnFCLENBQWY7O0FBaUJBLElBQU0sMEJBQVMsdUJBQU0sVUFBQyxDQUFELEVBQUksQ0FBSjtBQUFBLFNBQVUsS0FBSyxDQUFMLEVBQVEsS0FBSyxDQUFiLEVBQWdCLENBQWhCLENBQVY7QUFBQSxDQUFOLENBQWY7O0FBRUEsSUFBTSxvQkFBTSx1QkFBTSxJQUFOLENBQVo7O0FBRVA7O0FBRU8sU0FBUyxPQUFULEdBQW1CO0FBQ3hCLE1BQUksSUFBSSxVQUFVLE1BQWxCO0FBQ0EsTUFBSSxJQUFJLENBQVIsRUFBVztBQUNULFdBQU8sSUFBSSxVQUFVLENBQVYsQ0FBSixHQUFtQixRQUExQjtBQUNELEdBRkQsTUFFTztBQUNMLFFBQU0sU0FBUyxNQUFNLENBQU4sQ0FBZjtBQUNBLFdBQU8sR0FBUDtBQUNFLGFBQU8sQ0FBUCxJQUFZLFVBQVUsQ0FBVixDQUFaO0FBREYsS0FFQSxPQUFPLE1BQVA7QUFDRDtBQUNGOztBQUVEOztBQUVPLElBQU0sd0JBQVEsdUJBQU0sVUFBQyxLQUFELEVBQVEsRUFBUjtBQUFBLFNBQ3pCLENBQUMsRUFBRCxFQUFLLE9BQU8sVUFBQyxFQUFELEVBQUssQ0FBTDtBQUFBLFdBQVcsS0FBSyxDQUFMLEtBQVcsRUFBWCxHQUFnQixNQUFNLEVBQU4sRUFBVSxDQUFWLENBQWhCLEdBQStCLElBQTFDO0FBQUEsR0FBUCxDQUFMLENBRHlCO0FBQUEsQ0FBTixDQUFkOztBQUdBLElBQU0sMEJBQVMsU0FBVCxNQUFTO0FBQUEsb0NBQUksRUFBSjtBQUFJLE1BQUo7QUFBQTs7QUFBQSxTQUFXLE9BQU8sYUFBSztBQUMzQyxRQUFNLElBQUksVUFBVTtBQUFBLGFBQUssS0FBSyxDQUFMLEtBQVcsS0FBSyxDQUFMLEVBQVEsQ0FBUixDQUFoQjtBQUFBLEtBQVYsRUFBc0MsRUFBdEMsQ0FBVjtBQUNBLFdBQU8sSUFBSSxDQUFKLEdBQVEsSUFBUixHQUFlLEdBQUcsQ0FBSCxDQUF0QjtBQUNELEdBSGdDLENBQVg7QUFBQSxDQUFmOztBQUtBLElBQU0sMEJBQVMsU0FBVCxNQUFTO0FBQUEsU0FBUyxVQUFDLENBQUQsRUFBSSxLQUFKLEVBQVcsQ0FBWCxFQUFjLENBQWQ7QUFBQSxXQUM3QixJQUFJLE1BQU0sQ0FBTixFQUFTLENBQVQsQ0FBSixFQUFpQixDQUFqQixFQUFvQixLQUFwQixFQUEyQixDQUEzQixFQUE4QixDQUE5QixDQUQ2QjtBQUFBLEdBQVQ7QUFBQSxDQUFmOztBQUdBLElBQU0sc0JBQU8sU0FBUCxJQUFPO0FBQUEsU0FBSyxVQUFDLENBQUQsRUFBSSxLQUFKLEVBQVcsQ0FBWCxFQUFjLENBQWQ7QUFBQSxXQUN2QixFQUFFLENBQUYsRUFBSyxDQUFMLElBQVUsTUFBTSxDQUFOLEVBQVMsQ0FBVCxDQUFWLEdBQXdCLEtBQUssQ0FBTCxFQUFRLEtBQVIsRUFBZSxDQUFmLEVBQWtCLENBQWxCLENBREQ7QUFBQSxHQUFMO0FBQUEsQ0FBYjs7QUFHQSxJQUFNLDhCQUFXLDJCQUFqQjs7QUFFQSxTQUFTLElBQVQsQ0FBYyxDQUFkLEVBQWlCLEtBQWpCLEVBQXdCLENBQXhCLEVBQTJCLENBQTNCLEVBQThCO0FBQ25DLE1BQU0sS0FBSyxFQUFFLEVBQWI7QUFDQSxTQUFPLEtBQUssR0FBRyxDQUFILENBQUwsR0FBYSxDQUFDLEdBQUUsRUFBRSxHQUFMLEVBQVUsd0JBQU8sQ0FBUCxDQUFWLEVBQXFCLE1BQU0sS0FBSyxDQUFYLEVBQWMsQ0FBZCxDQUFyQixDQUFwQjtBQUNEOztBQUVEOztBQUVPLFNBQVMsSUFBVCxDQUFjLEdBQWQsRUFBbUI7QUFDeEIsTUFBSSxRQUFPLGNBQUMsQ0FBRCxFQUFJLEtBQUosRUFBVyxDQUFYLEVBQWMsQ0FBZDtBQUFBLFdBQW9CLENBQUMsUUFBTyxXQUFXLElBQUksR0FBSixDQUFYLENBQVIsRUFBOEIsQ0FBOUIsRUFBaUMsS0FBakMsRUFBd0MsQ0FBeEMsRUFBMkMsQ0FBM0MsQ0FBcEI7QUFBQSxHQUFYO0FBQ0EsV0FBUyxHQUFULENBQWEsQ0FBYixFQUFnQixLQUFoQixFQUF1QixDQUF2QixFQUEwQixDQUExQixFQUE2QjtBQUFDLFdBQU8sTUFBSyxDQUFMLEVBQVEsS0FBUixFQUFlLENBQWYsRUFBa0IsQ0FBbEIsQ0FBUDtBQUE0QjtBQUMxRCxTQUFPLEdBQVA7QUFDRDs7QUFFRDs7QUFFTyxTQUFTLEdBQVQsR0FBZTtBQUFBOztBQUNwQixNQUFNLE9BQU8sU0FBUCxJQUFPO0FBQUEsV0FBTztBQUFBLGFBQ2xCLFFBQVEsR0FBUixDQUFZLEtBQVosQ0FBa0IsT0FBbEIsRUFDa0IsV0FBVyxFQUFYLEVBQWUsQ0FBZixjQUE2QixDQUE3QixFQUFnQyxXQUFVLE1BQTFDLEVBQ0MsTUFERCxDQUNRLENBQUMsR0FBRCxFQUFNLENBQU4sQ0FEUixDQURsQixLQUV3QyxDQUh0QjtBQUFBLEtBQVA7QUFBQSxHQUFiO0FBSUEsU0FBTyxJQUFJLEtBQUssS0FBTCxDQUFKLEVBQWlCLEtBQUssS0FBTCxDQUFqQixDQUFQO0FBQ0Q7O0FBRUQ7O0FBRU8sSUFBTSw4QkFBVyxRQUFRO0FBQUEsU0FBSyxTQUFTLEVBQUUsTUFBWCxFQUFtQixDQUFDLEdBQUUsRUFBRSxLQUFMLEdBQW5CLENBQUw7QUFBQSxDQUFSLENBQWpCOztBQUVBLElBQU0sMEJBQVMsd0JBQWY7O0FBRUEsSUFBTSw0QkFBVSxRQUFRLEdBQVIsQ0FBWSxRQUFaLEtBQXlCLFlBQXpCLEdBQXdDLFFBQXhDLEdBQW1ELFVBQUMsQ0FBRCxFQUFJLENBQUosRUFBTyxDQUFQLEVBQVUsQ0FBVixFQUFnQjtBQUN4RixNQUFJLENBQUMsUUFBUSxNQUFiLEVBQXFCO0FBQ25CLFlBQVEsTUFBUixHQUFpQixDQUFqQjtBQUNBLFlBQVEsSUFBUixDQUFhLDREQUFiO0FBQ0Q7QUFDRCxTQUFPLFNBQVMsQ0FBVCxFQUFZLENBQVosRUFBZSxDQUFmLEVBQWtCLENBQWxCLENBQVA7QUFDRCxDQU5NOztBQVFBLElBQU0sd0JBQVEsUUFBUSxHQUFSLENBQVksUUFBWixLQUF5QixZQUF6QixHQUF3QyxNQUF4QyxHQUFpRCxVQUFDLENBQUQsRUFBSSxDQUFKLEVBQU8sQ0FBUCxFQUFhO0FBQ2pGLE1BQUksQ0FBQyxNQUFNLE1BQVgsRUFBbUI7QUFDakIsVUFBTSxNQUFOLEdBQWUsQ0FBZjtBQUNBLFlBQVEsSUFBUixDQUFhLHdEQUFiO0FBQ0Q7QUFDRCxTQUFPLE9BQU8sQ0FBUCxFQUFVLENBQVYsRUFBYSxDQUFiLENBQVA7QUFDRCxDQU5NOztBQVFQOztBQUVPLElBQU0sZ0NBQVksdUJBQU0sVUFBQyxJQUFELEVBQU8sQ0FBUCxFQUFVLENBQVY7QUFBQSxTQUM3QixRQUFRLElBQUksQ0FBSixFQUFPLE9BQVAsRUFBZ0IsSUFBaEIsRUFBc0IsQ0FBdEIsQ0FBUixLQUFxQyxFQURSO0FBQUEsQ0FBTixDQUFsQjs7QUFHQSxJQUFNLDRCQUFVLHlCQUFoQjs7QUFFQSxJQUFNLHdCQUFRLHVCQUFNLFVBQUMsQ0FBRCxFQUFJLENBQUosRUFBTyxDQUFQLEVBQVUsQ0FBVjtBQUFBLFNBQ3pCLEtBQUssQ0FBTCxFQUFRLENBQVIsRUFBVyxJQUFJLENBQUosRUFBTyxPQUFQLEVBQWdCLElBQWhCLEVBQXNCLENBQXRCLENBQVgsQ0FEeUI7QUFBQSxDQUFOLENBQWQ7O0FBR0EsSUFBTSx3QkFBUSx1QkFBTSxVQUFDLENBQUQsRUFBSSxDQUFKLEVBQU8sQ0FBUCxFQUFVLENBQVYsRUFBZ0I7QUFDekMsTUFBTSxLQUFLLFVBQVUsSUFBVixFQUFnQixDQUFoQixFQUFtQixDQUFuQixDQUFYO0FBQ0EsT0FBSyxJQUFJLElBQUUsR0FBRyxNQUFILEdBQVUsQ0FBckIsRUFBd0IsS0FBRyxDQUEzQixFQUE4QixFQUFFLENBQWhDLEVBQW1DO0FBQ2pDLFFBQU0sSUFBSSxHQUFHLENBQUgsQ0FBVjtBQUNBLFFBQUksRUFBRSxDQUFGLEVBQUssRUFBRSxDQUFGLENBQUwsRUFBVyxFQUFFLENBQUYsQ0FBWCxDQUFKO0FBQ0Q7QUFDRCxTQUFPLENBQVA7QUFDRCxDQVBvQixDQUFkOztBQVNBLElBQU0sNEJBQVUsT0FBTyxJQUFJLFVBQUMsQ0FBRCxFQUFJLENBQUo7QUFBQSxTQUFVLElBQUksQ0FBZDtBQUFBLENBQUosQ0FBUCxDQUFoQjs7QUFFQSxJQUFNLDRCQUFVLE9BQU8sSUFBSSxVQUFDLENBQUQsRUFBSSxDQUFKO0FBQUEsU0FBVSxJQUFJLENBQWQ7QUFBQSxDQUFKLENBQVAsQ0FBaEI7O0FBRUEsSUFBTSw0QkFBVSxTQUFTLEtBQUssQ0FBTCxDQUFULEVBQWtCLE9BQU8sVUFBQyxDQUFELEVBQUksQ0FBSjtBQUFBLFNBQVUsSUFBSSxDQUFkO0FBQUEsQ0FBUCxFQUF3QixDQUF4QixDQUFsQixDQUFoQjs7QUFFQSxJQUFNLG9CQUFNLFNBQVMsS0FBSyxDQUFMLENBQVQsRUFBa0IsT0FBTyxVQUFDLENBQUQsRUFBSSxDQUFKO0FBQUEsU0FBVSxJQUFJLENBQWQ7QUFBQSxDQUFQLEVBQXdCLENBQXhCLENBQWxCLENBQVo7O0FBRVA7O0FBRU8sU0FBUyxNQUFULENBQWdCLFFBQWhCLEVBQTBCO0FBQy9CLE1BQU0sT0FBTyxFQUFiO0FBQUEsTUFBaUIsT0FBTyxFQUF4QjtBQUNBLE9BQUssSUFBTSxDQUFYLElBQWdCLFFBQWhCLEVBQTBCO0FBQ3hCLFNBQUssSUFBTCxDQUFVLENBQVY7QUFDQSxTQUFLLElBQUwsQ0FBVSxXQUFXLFNBQVMsQ0FBVCxDQUFYLENBQVY7QUFDRDtBQUNELFNBQU8sU0FBUyxJQUFULEVBQWUsSUFBZixDQUFQO0FBQ0Q7O0FBRUQ7O0FBRU8sU0FBUyxLQUFULENBQWUsQ0FBZixFQUFrQixLQUFsQixFQUF5QixFQUF6QixFQUE2QixDQUE3QixFQUFnQztBQUNyQyxNQUFJLGVBQWUsRUFBZixDQUFKLEVBQXdCO0FBQ3RCLFdBQU8sTUFBTSxLQUFOLEdBQ0gsaUJBQWlCLEtBQWpCLEVBQXdCLEVBQXhCLENBREcsR0FFSCxxQkFBcUIsQ0FBckIsRUFBd0IsS0FBeEIsRUFBK0IsRUFBL0IsQ0FGSjtBQUdELEdBSkQsTUFJTztBQUNMLFFBQUksUUFBUSxHQUFSLENBQVksUUFBWixLQUF5QixZQUE3QixFQUNFLGVBQWUsQ0FBZjtBQUNGLFdBQU8sQ0FBQyxHQUFFLEVBQUUsRUFBTCxFQUFTLEVBQVQsQ0FBUDtBQUNEO0FBQ0Y7O0FBRU0sU0FBUyxNQUFULENBQWdCLENBQWhCLEVBQW1CLEtBQW5CLEVBQTBCLEVBQTFCLEVBQThCLENBQTlCLEVBQWlDO0FBQ3RDLE1BQUksY0FBYyxNQUFsQixFQUEwQjtBQUN4QixXQUFPLFNBQVMsc0JBQUssRUFBTCxDQUFULEVBQW1CLENBQW5CLEVBQXNCLEtBQXRCLEVBQTZCLEVBQTdCLENBQVA7QUFDRCxHQUZELE1BRU87QUFDTCxRQUFJLFFBQVEsR0FBUixDQUFZLFFBQVosS0FBeUIsWUFBN0IsRUFDRSxlQUFlLENBQWY7QUFDRixXQUFPLENBQUMsR0FBRSxFQUFFLEVBQUwsRUFBUyxFQUFULENBQVA7QUFDRDtBQUNGOztBQUVEOztBQUVPLElBQU0sb0JBQU0sdUJBQU0sSUFBTixDQUFaOztBQUVQOztBQUVPLElBQU0sc0JBQU8sdUJBQU0sVUFBQyxHQUFELEVBQU0sR0FBTjtBQUFBLFNBQWMsVUFBQyxDQUFELEVBQUksS0FBSixFQUFXLENBQVgsRUFBYyxDQUFkO0FBQUEsV0FDdEMsQ0FBQyxHQUFFLEVBQUUsR0FBTCxFQUFVO0FBQUEsYUFBSyxJQUFJLENBQUosRUFBTyxDQUFQLEVBQVUsQ0FBVixDQUFMO0FBQUEsS0FBVixFQUE2QixNQUFNLElBQUksQ0FBSixFQUFPLENBQVAsQ0FBTixFQUFpQixDQUFqQixDQUE3QixDQURzQztBQUFBLEdBQWQ7QUFBQSxDQUFOLENBQWI7O0FBR1A7O0FBRU8sSUFBTSw0QkFBVSxTQUFWLE9BQVUsV0FBWTtBQUNqQyxNQUFJLFFBQVEsR0FBUixDQUFZLFFBQVosS0FBeUIsWUFBekIsSUFBeUMsQ0FBQywwQkFBUyxRQUFULENBQTlDLEVBQ0UsV0FBVywyQ0FBWCxFQUF3RCxRQUF4RDtBQUNGLFNBQU8sS0FDTCxhQUFLO0FBQ0gsUUFBSSxnQ0FBZSxDQUFmLEVBQWtCLENBQWxCLENBQUo7QUFDQSxRQUFJLENBQUosRUFDRSxLQUFLLElBQU0sQ0FBWCxJQUFnQixRQUFoQjtBQUNFLFFBQUUsQ0FBRixJQUFPLFNBQVMsQ0FBVCxFQUFZLENBQVosQ0FBUDtBQURGLEtBRUYsT0FBTyxDQUFQO0FBQ0QsR0FQSSxFQVFMLFVBQUMsQ0FBRCxFQUFJLENBQUosRUFBVTtBQUNSLFFBQUksUUFBUSxHQUFSLENBQVksUUFBWixLQUF5QixZQUF6QixJQUNBLEVBQUUsS0FBSyxDQUFMLEtBQVcsQ0FBWCxJQUFnQixhQUFhLE1BQS9CLENBREosRUFFRSxXQUFXLG1EQUFYLEVBQWdFLENBQWhFO0FBQ0YsUUFBSSxTQUFTLENBQVQsQ0FBSjtBQUNBLFFBQUksRUFBRSxhQUFhLE1BQWYsQ0FBSixFQUNFLElBQUksS0FBSyxDQUFUO0FBQ0YsUUFBSSxVQUFKO0FBQ0EsYUFBUyxHQUFULENBQWEsQ0FBYixFQUFnQixDQUFoQixFQUFtQjtBQUNqQixVQUFJLENBQUMsQ0FBTCxFQUNFLElBQUksRUFBSjtBQUNGLFFBQUUsQ0FBRixJQUFPLENBQVA7QUFDRDtBQUNELFNBQUssSUFBTSxDQUFYLElBQWdCLENBQWhCLEVBQW1CO0FBQ2pCLFVBQUksQ0FBQyxzQkFBSyxDQUFMLEVBQVEsUUFBUixDQUFMLEVBQ0UsSUFBSSxDQUFKLEVBQU8sRUFBRSxDQUFGLENBQVAsRUFERixLQUdFLElBQUksS0FBSyxzQkFBSyxDQUFMLEVBQVEsQ0FBUixDQUFULEVBQ0UsSUFBSSxDQUFKLEVBQU8sRUFBRSxDQUFGLENBQVA7QUFDTDtBQUNELFdBQU8sQ0FBUDtBQUNELEdBN0JJLENBQVA7QUE4QkQsQ0FqQ007O0FBbUNQOztBQUVPLElBQU0sOEJBQVcsU0FBWCxRQUFXLE1BQU87QUFDN0IsTUFBTSxNQUFNLFNBQU4sR0FBTTtBQUFBLFdBQUssU0FBUyxHQUFULEVBQWMsS0FBSyxDQUFuQixFQUFzQixDQUF0QixDQUFMO0FBQUEsR0FBWjtBQUNBLFNBQU8sVUFBQyxDQUFELEVBQUksS0FBSixFQUFXLENBQVgsRUFBYyxDQUFkO0FBQUEsV0FBb0IsQ0FBQyxHQUFFLEVBQUUsR0FBTCxFQUFVLEdBQVYsRUFBZSxNQUFNLEtBQUssQ0FBTCxLQUFXLENBQVgsR0FBZSxDQUFmLEdBQW1CLEdBQXpCLEVBQThCLENBQTlCLENBQWYsQ0FBcEI7QUFBQSxHQUFQO0FBQ0QsQ0FITTs7QUFLQSxJQUFNLDhCQUFXLFNBQVgsUUFBVztBQUFBLFNBQU8sUUFBUSxHQUFSLEVBQWEsS0FBSyxDQUFsQixDQUFQO0FBQUEsQ0FBakI7O0FBRUEsSUFBTSwwQkFBUyxTQUFULE1BQVM7QUFBQSxTQUFLLFdBQVcsS0FBSyxDQUFMLENBQVgsQ0FBTDtBQUFBLENBQWY7O0FBRUEsSUFBTSxnQ0FBWSxTQUFaLFNBQVk7QUFBQSxTQUN2QixXQUFXLFVBQUMsQ0FBRCxFQUFJLENBQUo7QUFBQSxXQUFVLEtBQUssQ0FBTCxLQUFXLENBQVgsR0FBZSxLQUFLLENBQUwsRUFBUSxDQUFSLENBQWYsR0FBNEIsS0FBSyxDQUEzQztBQUFBLEdBQVgsQ0FEdUI7QUFBQSxDQUFsQjs7QUFHQSxJQUFNLDRCQUFVLFNBQVYsT0FBVTtBQUFBLFNBQVEsVUFBQyxDQUFELEVBQUksS0FBSixFQUFXLENBQVgsRUFBYyxDQUFkO0FBQUEsV0FDN0IsQ0FBQyxHQUFFLEVBQUUsR0FBTCxFQUFVO0FBQUEsYUFBSyxLQUFLLENBQUwsS0FBVyxDQUFYLEdBQWUsS0FBSyxDQUFMLEVBQVEsQ0FBUixDQUFmLEdBQTRCLEtBQUssQ0FBdEM7QUFBQSxLQUFWLEVBQW1ELE1BQU0sQ0FBTixFQUFTLENBQVQsQ0FBbkQsQ0FENkI7QUFBQSxHQUFSO0FBQUEsQ0FBaEI7O0FBR1A7O0FBRU8sSUFBTSwwQkFBUyxTQUFULE1BQVMsQ0FBQyxDQUFELEVBQUksS0FBSixFQUFXLEVBQVgsRUFBZSxDQUFmO0FBQUEsU0FDcEIsQ0FBQyxHQUFFLEVBQUUsR0FBTCxFQUFVO0FBQUEsV0FBSyxTQUFTLGVBQWUsRUFBZixJQUFxQixHQUFHLE1BQXhCLEdBQWlDLENBQTFDLEVBQTZDLENBQTdDLEVBQWdELEVBQWhELENBQUw7QUFBQSxHQUFWLEVBQ1UsTUFBTSxLQUFLLENBQVgsRUFBYyxDQUFkLENBRFYsQ0FEb0I7QUFBQSxDQUFmOztBQUlBLElBQU0sMEJBQVMsU0FBVCxNQUFTO0FBQUEsU0FBUSxVQUFDLENBQUQsRUFBSSxLQUFKLEVBQVcsRUFBWCxFQUFlLENBQWYsRUFBcUI7QUFDakQsUUFBSSxXQUFKO0FBQUEsUUFBUSxXQUFSO0FBQ0EsUUFBSSxlQUFlLEVBQWYsQ0FBSixFQUNFLG1CQUFtQixJQUFuQixFQUF5QixFQUF6QixFQUE2QixLQUFLLEVBQWxDLEVBQXNDLEtBQUssRUFBM0M7QUFDRixXQUFPLENBQUMsR0FBRSxFQUFFLEdBQUwsRUFDTCxjQUFNO0FBQ0osVUFBSSxRQUFRLEdBQVIsQ0FBWSxRQUFaLEtBQXlCLFlBQXpCLElBQ0EsRUFBRSxLQUFLLENBQUwsS0FBVyxFQUFYLElBQWlCLGVBQWUsRUFBZixDQUFuQixDQURKLEVBRUUsV0FBVyw2REFBWCxFQUEwRSxFQUExRTtBQUNGLFVBQU0sTUFBTSxLQUFLLEdBQUcsTUFBUixHQUFpQixDQUE3QjtBQUFBLFVBQ00sTUFBTSxLQUFLLEdBQUcsTUFBUixHQUFpQixDQUQ3QjtBQUFBLFVBRU0sSUFBSSxNQUFNLEdBRmhCO0FBR0EsVUFBSSxDQUFKLEVBQ0UsT0FBTyxNQUFNLEdBQU4sR0FDTCxFQURLLEdBRUwsV0FBVyxXQUFXLE1BQU0sQ0FBTixDQUFYLEVBQXFCLENBQXJCLEVBQXdCLEVBQXhCLEVBQTRCLENBQTVCLEVBQStCLEdBQS9CLENBQVgsRUFBZ0QsR0FBaEQsRUFBcUQsRUFBckQsRUFBeUQsQ0FBekQsRUFBNEQsR0FBNUQsQ0FGRjtBQUdILEtBWkksRUFhTCxNQUFNLEVBQU4sRUFBVSxDQUFWLENBYkssQ0FBUDtBQWNELEdBbEJxQjtBQUFBLENBQWY7O0FBb0JBLElBQU0sc0JBQU8sU0FBUCxJQUFPO0FBQUEsU0FBUSxPQUFPLGNBQU07QUFDdkMsUUFBSSxDQUFDLGVBQWUsRUFBZixDQUFMLEVBQ0UsT0FBTyxDQUFQO0FBQ0YsUUFBTSxJQUFJLFVBQVUsSUFBVixFQUFnQixFQUFoQixDQUFWO0FBQ0EsV0FBTyxJQUFJLENBQUosR0FBUSxNQUFSLEdBQWlCLENBQXhCO0FBQ0QsR0FMMkIsQ0FBUjtBQUFBLENBQWI7O0FBT0EsU0FBUyxRQUFULEdBQXlCO0FBQzlCLE1BQU0sTUFBTSxtQ0FBWjtBQUNBLFNBQU8sQ0FBQyxLQUFLO0FBQUEsV0FBSyxLQUFLLENBQUwsS0FBVyxLQUFLLEdBQUwsRUFBVSxDQUFWLENBQWhCO0FBQUEsR0FBTCxDQUFELEVBQXFDLEdBQXJDLENBQVA7QUFDRDs7QUFFTSxJQUFNLHdCQUFRLFFBQVEsR0FBUixDQUFZLFFBQVosS0FBeUIsWUFBekIsb0JBQTZDLGFBQUs7QUFDckUsTUFBSSxDQUFDLE9BQU8sU0FBUCxDQUFpQixDQUFqQixDQUFELElBQXdCLElBQUksQ0FBaEMsRUFDRSxXQUFXLHdDQUFYLEVBQXFELENBQXJEO0FBQ0YsU0FBTyxDQUFQO0FBQ0QsQ0FKTTs7QUFNQSxJQUFNLHdCQUFRLHVCQUFNLFVBQUMsS0FBRCxFQUFRLEdBQVI7QUFBQSxTQUFnQixVQUFDLENBQUQsRUFBSSxNQUFKLEVBQVksRUFBWixFQUFnQixDQUFoQixFQUFzQjtBQUMvRCxRQUFNLFFBQVEsZUFBZSxFQUFmLENBQWQ7QUFBQSxRQUNNLE1BQU0sU0FBUyxHQUFHLE1BRHhCO0FBQUEsUUFFTSxJQUFJLFdBQVcsQ0FBWCxFQUFjLEdBQWQsRUFBbUIsQ0FBbkIsRUFBc0IsS0FBdEIsQ0FGVjtBQUFBLFFBR00sSUFBSSxXQUFXLENBQVgsRUFBYyxHQUFkLEVBQW1CLEdBQW5CLEVBQXdCLEdBQXhCLENBSFY7QUFJQSxXQUFPLENBQUMsR0FBRSxFQUFFLEdBQUwsRUFDTCxjQUFNO0FBQ0osVUFBSSxRQUFRLEdBQVIsQ0FBWSxRQUFaLEtBQXlCLFlBQXpCLElBQ0EsRUFBRSxLQUFLLENBQUwsS0FBVyxFQUFYLElBQWlCLGVBQWUsRUFBZixDQUFuQixDQURKLEVBRUUsV0FBVyw0REFBWCxFQUF5RSxFQUF6RTtBQUNGLFVBQU0sTUFBTSxLQUFLLEdBQUcsTUFBUixHQUFpQixDQUE3QjtBQUFBLFVBQWdDLFFBQVEsSUFBSSxHQUE1QztBQUFBLFVBQWlELElBQUksTUFBTSxDQUFOLEdBQVUsS0FBL0Q7QUFDQSxhQUFPLElBQ0gsV0FBVyxXQUFXLFdBQVcsTUFBTSxDQUFOLENBQVgsRUFBcUIsQ0FBckIsRUFBd0IsRUFBeEIsRUFBNEIsQ0FBNUIsRUFBK0IsQ0FBL0IsQ0FBWCxFQUNXLENBRFgsRUFFVyxFQUZYLEVBRWUsQ0FGZixFQUVrQixHQUZsQixDQUFYLEVBR1csS0FIWCxFQUlXLEVBSlgsRUFJZSxDQUpmLEVBSWtCLEdBSmxCLENBREcsR0FNSCxLQUFLLENBTlQ7QUFPRCxLQWJJLEVBY0wsT0FBTyxRQUFRLFdBQVcsTUFBTSxLQUFLLEdBQUwsQ0FBUyxDQUFULEVBQVksSUFBSSxDQUFoQixDQUFOLENBQVgsRUFBc0MsQ0FBdEMsRUFBeUMsRUFBekMsRUFBNkMsQ0FBN0MsRUFBZ0QsQ0FBaEQsQ0FBUixHQUNBLEtBQUssQ0FEWixFQUVPLENBRlAsQ0FkSyxDQUFQO0FBaUJELEdBdEIwQjtBQUFBLENBQU4sQ0FBZDs7QUF3QlA7O0FBRU8sSUFBTSxzQkFBTyxRQUFRLEdBQVIsQ0FBWSxRQUFaLEtBQXlCLFlBQXpCLG9CQUE2QyxhQUFLO0FBQ3BFLE1BQUksQ0FBQywwQkFBUyxDQUFULENBQUwsRUFDRSxXQUFXLHlCQUFYLEVBQXNDLENBQXRDO0FBQ0YsU0FBTyxDQUFQO0FBQ0QsQ0FKTTs7QUFNQSxTQUFTLEtBQVQsR0FBaUI7QUFDdEIsTUFBTSxJQUFJLFVBQVUsTUFBcEI7QUFBQSxNQUE0QixXQUFXLEVBQXZDO0FBQ0EsT0FBSyxJQUFJLElBQUUsQ0FBTixFQUFTLENBQWQsRUFBaUIsSUFBRSxDQUFuQixFQUFzQixFQUFFLENBQXhCO0FBQ0UsYUFBUyxJQUFJLFVBQVUsQ0FBVixDQUFiLElBQTZCLENBQTdCO0FBREYsR0FFQSxPQUFPLEtBQUssUUFBTCxDQUFQO0FBQ0Q7O0FBRU0sSUFBTSxnQ0FBWSxTQUFaLFNBQVk7QUFBQSxxQ0FBSSxFQUFKO0FBQUksTUFBSjtBQUFBOztBQUFBLFNBQVcsVUFBQyxDQUFELEVBQUksS0FBSixFQUFXLENBQVgsRUFBYyxDQUFkO0FBQUEsV0FBb0IsQ0FBQyxHQUFFLEVBQUUsR0FBTCxFQUN0RCxhQUFLO0FBQ0gsVUFBSSxFQUFFLGFBQWEsTUFBZixDQUFKLEVBQ0UsT0FBTyxDQUFQO0FBQ0YsV0FBSyxJQUFJLE1BQUUsQ0FBTixFQUFTLElBQUUsR0FBRyxNQUFuQixFQUEyQixNQUFFLENBQTdCLEVBQWdDLEVBQUUsR0FBbEM7QUFDRSxZQUFJLHNCQUFLLEdBQUcsR0FBSCxDQUFMLEVBQVksQ0FBWixDQUFKLEVBQ0UsT0FBTyxDQUFQO0FBRko7QUFHRCxLQVBxRCxFQVF0RCxNQUFNLENBQU4sRUFBUyxDQUFULENBUnNELENBQXBCO0FBQUEsR0FBWDtBQUFBLENBQWxCOztBQVVQOztBQUVPLElBQU0sNEJBQVUsU0FBVixPQUFVO0FBQUEsU0FBSyxVQUFDLEVBQUQsRUFBSyxLQUFMLEVBQVksQ0FBWixFQUFlLENBQWY7QUFBQSxXQUMxQixNQUFNLEtBQUssQ0FBTCxLQUFXLENBQVgsSUFBZ0IsTUFBTSxJQUF0QixHQUE2QixDQUE3QixHQUFpQyxDQUF2QyxFQUEwQyxDQUExQyxDQUQwQjtBQUFBLEdBQUw7QUFBQSxDQUFoQjs7QUFHUDs7QUFFTyxJQUFNLDBCQUNYLHVCQUFNLFVBQUMsQ0FBRCxFQUFJLENBQUo7QUFBQSxTQUFVLE9BQU87QUFBQSxXQUFLLEtBQUssQ0FBTCxLQUFXLEtBQUssQ0FBTCxFQUFRLENBQVIsQ0FBWCxHQUF3QixDQUF4QixHQUE0QixDQUFqQztBQUFBLEdBQVAsQ0FBVjtBQUFBLENBQU4sQ0FESzs7QUFHUDs7QUFFTyxJQUFNLGtCQUFLLFFBQVEsR0FBUixDQUFZLFFBQVosS0FBeUIsWUFBekIsb0JBQTZDLGdCQUFRO0FBQ3JFLE1BQUksQ0FBQyxHQUFHLE1BQVIsRUFBZ0I7QUFDZCxPQUFHLE1BQUgsR0FBWSxDQUFaO0FBQ0EsWUFBUSxJQUFSLENBQWEsMEZBQWI7QUFDRDtBQUNELFNBQU8sSUFBUDtBQUNELENBTk07O0FBUUEsSUFBTSxzQkFBTyxRQUFRLEdBQVIsQ0FBWSxRQUFaLEtBQXlCLFlBQXpCLHdCQUFpRCxhQUFLO0FBQ3hFLE1BQUksQ0FBQyxLQUFLLE1BQVYsRUFBa0I7QUFDaEIsU0FBSyxNQUFMLEdBQWMsQ0FBZDtBQUNBLFlBQVEsSUFBUixDQUFhLDhEQUFiO0FBQ0Q7QUFDRCxTQUFPLHdCQUFPLENBQVAsQ0FBUDtBQUNELENBTk07O0FBUVA7O0FBRU8sSUFBTSxzQkFBTyxTQUFQLElBQU8sV0FBWTtBQUM5QixNQUFJLFFBQVEsR0FBUixDQUFZLFFBQVosS0FBeUIsWUFBekIsSUFBeUMsQ0FBQywwQkFBUyxRQUFULENBQTlDLEVBQ0UsV0FBVyx3Q0FBWCxFQUFxRCxRQUFyRDtBQUNGLFNBQU8sVUFBQyxDQUFELEVBQUksS0FBSixFQUFXLENBQVgsRUFBYyxDQUFkO0FBQUEsV0FDTCxDQUFDLEdBQUUsRUFBRSxHQUFMLEVBQVUsUUFBUSxRQUFSLEVBQWtCLENBQWxCLENBQVYsRUFBZ0MsTUFBTSxRQUFRLFFBQVIsRUFBa0IsQ0FBbEIsQ0FBTixFQUE0QixDQUE1QixDQUFoQyxDQURLO0FBQUEsR0FBUDtBQUVELENBTE07O0FBT0EsSUFBTSw0QkFBVSx1QkFBTSxVQUFDLEdBQUQsRUFBTSxHQUFOLEVBQWM7QUFDekMsTUFBTSxNQUFNLFNBQU4sR0FBTTtBQUFBLFdBQUssU0FBUyxHQUFULEVBQWMsR0FBZCxFQUFtQixDQUFuQixDQUFMO0FBQUEsR0FBWjtBQUNBLFNBQU8sVUFBQyxDQUFELEVBQUksS0FBSixFQUFXLENBQVgsRUFBYyxDQUFkO0FBQUEsV0FBb0IsQ0FBQyxHQUFFLEVBQUUsR0FBTCxFQUFVLEdBQVYsRUFBZSxNQUFNLFNBQVMsR0FBVCxFQUFjLEdBQWQsRUFBbUIsQ0FBbkIsQ0FBTixFQUE2QixDQUE3QixDQUFmLENBQXBCO0FBQUEsR0FBUDtBQUNELENBSHNCLENBQWhCOztBQUtQOztBQUVPLElBQU0sa0NBQWEsd0JBQU8sQ0FBUCxFQUFVLElBQVYsQ0FBbkI7O0FBRVA7O0FBRU8sSUFBTSxvQkFDWCx1QkFBTSxVQUFDLEdBQUQsRUFBTSxHQUFOO0FBQUEsU0FBYyxVQUFDLENBQUQsRUFBSSxLQUFKLEVBQVcsQ0FBWCxFQUFjLENBQWQ7QUFBQSxXQUFvQixDQUFDLEdBQUUsRUFBRSxHQUFMLEVBQVUsR0FBVixFQUFlLE1BQU0sSUFBSSxDQUFKLENBQU4sRUFBYyxDQUFkLENBQWYsQ0FBcEI7QUFBQSxHQUFkO0FBQUEsQ0FBTixDQURLOztBQUdQOztBQUVPLElBQU0sOEJBQVcsU0FBWCxRQUFXLENBQUMsRUFBRCxFQUFLLEtBQUwsRUFBWSxDQUFaLEVBQWUsQ0FBZjtBQUFBLFNBQXFCLE1BQU0sQ0FBTixFQUFTLENBQVQsQ0FBckI7QUFBQSxDQUFqQjs7QUFFQSxJQUFNLDRCQUFVLFNBQVYsT0FBVTtBQUFBLFNBQU8sVUFBQyxDQUFELEVBQUksS0FBSixFQUFXLENBQVgsRUFBYyxDQUFkO0FBQUEsV0FDNUIsQ0FBQyxHQUFFLEVBQUUsR0FBTCxFQUFVO0FBQUEsYUFBSyxLQUFLLEdBQUwsRUFBVSxDQUFWLENBQUw7QUFBQSxLQUFWLEVBQTZCLE1BQU0sS0FBSyxHQUFMLEVBQVUsQ0FBVixDQUFOLEVBQW9CLENBQXBCLENBQTdCLENBRDRCO0FBQUEsR0FBUDtBQUFBLENBQWhCIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCB7XG4gIGFjeWNsaWNFcXVhbHNVLFxuICBhbHdheXMsXG4gIGFwcGx5VSxcbiAgYXJpdHlOLFxuICBhc3NvY1BhcnRpYWxVLFxuICBjb25zdHJ1Y3Rvck9mLFxuICBjdXJyeSxcbiAgY3VycnlOLFxuICBkaXNzb2NQYXJ0aWFsVSxcbiAgaGFzVSxcbiAgaWQsXG4gIGlzRGVmaW5lZCxcbiAgaXNGdW5jdGlvbixcbiAgaXNPYmplY3QsXG4gIGlzU3RyaW5nLFxuICBrZXlzLFxuICBvYmplY3QwLFxuICBzbmRVXG59IGZyb20gXCJpbmZlc3RpbmVzXCJcblxuLy9cblxuY29uc3Qgc2xpY2VJbmRleCA9IChtLCBsLCBkLCBpKSA9PlxuICB2b2lkIDAgPT09IGkgPyBkIDogTWF0aC5taW4oTWF0aC5tYXgobSwgaSA8IDAgPyBsICsgaSA6IGkpLCBsKVxuXG5mdW5jdGlvbiBwYWlyKHgwLCB4MSkge3JldHVybiBbeDAsIHgxXX1cbmNvbnN0IGNwYWlyID0geCA9PiB4cyA9PiBbeCwgeHNdXG5cbmNvbnN0IHVudG8gPSBjID0+IHggPT4gdm9pZCAwICE9PSB4ID8geCA6IGNcblxuY29uc3Qgc2VlbXNBcnJheUxpa2UgPSB4ID0+XG4gIHggaW5zdGFuY2VvZiBPYmplY3QgJiYgKHggPSB4Lmxlbmd0aCwgeCA9PT0gKHggPj4gMCkgJiYgMCA8PSB4KSB8fFxuICBpc1N0cmluZyh4KVxuXG4vL1xuXG5mdW5jdGlvbiBtYXBQYXJ0aWFsSW5kZXhVKHhpMnksIHhzKSB7XG4gIGNvbnN0IG4gPSB4cy5sZW5ndGgsIHlzID0gQXJyYXkobilcbiAgbGV0IGogPSAwXG4gIGZvciAobGV0IGk9MCwgeTsgaTxuOyArK2kpXG4gICAgaWYgKHZvaWQgMCAhPT0gKHkgPSB4aTJ5KHhzW2ldLCBpKSkpXG4gICAgICB5c1tqKytdID0geVxuICBpZiAoaikge1xuICAgIGlmIChqIDwgbilcbiAgICAgIHlzLmxlbmd0aCA9IGpcbiAgICByZXR1cm4geXNcbiAgfVxufVxuXG5mdW5jdGlvbiBjb3B5VG9Gcm9tKHlzLCBrLCB4cywgaSwgaikge1xuICB3aGlsZSAoaSA8IGopXG4gICAgeXNbaysrXSA9IHhzW2krK11cbiAgcmV0dXJuIHlzXG59XG5cbi8vXG5cbmNvbnN0IElkZW50ID0ge21hcDogYXBwbHlVLCBhcDogYXBwbHlVLCBvZjogaWR9XG5cbmNvbnN0IENvbnN0ID0ge21hcDogc25kVX1cblxuY29uc3QgQ29uY2F0T2YgPSAoYXAsIGVtcHR5KSA9PiAoe21hcDogc25kVSwgYXAsIG9mOiBhbHdheXMoZW1wdHkpfSlcblxuY29uc3QgTW9ub2lkID0gKGNvbmNhdCwgZW1wdHkpID0+ICh7Y29uY2F0LCBlbXB0eTogKCkgPT4gZW1wdHl9KVxuXG5jb25zdCBNdW0gPSBvcmQgPT5cbiAgTW9ub2lkKCh5LCB4KSA9PiB2b2lkIDAgIT09IHggJiYgKHZvaWQgMCA9PT0geSB8fCBvcmQoeCwgeSkpID8geCA6IHkpXG5cbi8vXG5cbmNvbnN0IHJ1biA9IChvLCBDLCB4aTJ5QywgcywgaSkgPT4gdG9GdW5jdGlvbihvKShDLCB4aTJ5QywgcywgaSlcblxuY29uc3QgY29uc3RBcyA9IHRvQ29uc3QgPT4gY3VycnlOKDQsICh4TWkyeSwgbSkgPT4ge1xuICBjb25zdCBDID0gdG9Db25zdChtKVxuICByZXR1cm4gKHQsIHMpID0+IHJ1bih0LCBDLCB4TWkyeSwgcylcbn0pXG5cbi8vXG5cbmNvbnN0IGV4cGVjdGVkT3B0aWMgPSBcIkV4cGVjdGluZyBhbiBvcHRpY1wiXG5cbmZ1bmN0aW9uIGVycm9yR2l2ZW4obSwgbykge1xuICBjb25zb2xlLmVycm9yKFwicGFydGlhbC5sZW5zZXM6XCIsIG0sIFwiLSBnaXZlbjpcIiwgbylcbiAgdGhyb3cgbmV3IEVycm9yKG0pXG59XG5cbmZ1bmN0aW9uIHJlcUZ1bmN0aW9uKG8pIHtcbiAgaWYgKCEoaXNGdW5jdGlvbihvKSAmJiAoby5sZW5ndGggPT09IDQgfHwgby5sZW5ndGggPD0gMikpKVxuICAgIGVycm9yR2l2ZW4oZXhwZWN0ZWRPcHRpYywgbylcbn1cblxuZnVuY3Rpb24gcmVxQXJyYXkobykge1xuICBpZiAoIUFycmF5LmlzQXJyYXkobykpXG4gICAgZXJyb3JHaXZlbihleHBlY3RlZE9wdGljLCBvKVxufVxuXG4vL1xuXG5mdW5jdGlvbiByZXFBcHBsaWNhdGl2ZShmKSB7XG4gIGlmICghZi5vZilcbiAgICBlcnJvckdpdmVuKFwiVHJhdmVyc2FscyByZXF1aXJlIGFuIGFwcGxpY2F0aXZlXCIsIGYpXG59XG5cbi8vXG5cbmZ1bmN0aW9uIEpvaW4obCwgcikge3RoaXMubCA9IGw7IHRoaXMuciA9IHJ9XG5cbmNvbnN0IGlzSm9pbiA9IG4gPT4gbi5jb25zdHJ1Y3RvciA9PT0gSm9pblxuXG5jb25zdCBqb2luID0gKGwsIHIpID0+IHZvaWQgMCAhPT0gbCA/IHZvaWQgMCAhPT0gciA/IG5ldyBKb2luKGwsIHIpIDogbCA6IHJcblxuY29uc3QgY2pvaW4gPSBoID0+IHQgPT4gam9pbihoLCB0KVxuXG5mdW5jdGlvbiBwdXNoVG8obiwgeXMpIHtcbiAgd2hpbGUgKG4gJiYgaXNKb2luKG4pKSB7XG4gICAgY29uc3QgbCA9IG4ubFxuICAgIG4gPSBuLnJcbiAgICBpZiAobCAmJiBpc0pvaW4obCkpIHtcbiAgICAgIHB1c2hUbyhsLmwsIHlzKVxuICAgICAgcHVzaFRvKGwuciwgeXMpXG4gICAgfSBlbHNlIHtcbiAgICAgIHlzLnB1c2gobClcbiAgICB9XG4gIH1cbiAgeXMucHVzaChuKVxufVxuXG5mdW5jdGlvbiB0b0FycmF5KG4pIHtcbiAgaWYgKHZvaWQgMCAhPT0gbikge1xuICAgIGNvbnN0IHlzID0gW11cbiAgICBwdXNoVG8obiwgeXMpXG4gICAgcmV0dXJuIHlzXG4gIH1cbn1cblxuZnVuY3Rpb24gZm9sZFJlYyhmLCByLCBuKSB7XG4gIHdoaWxlIChpc0pvaW4obikpIHtcbiAgICBjb25zdCBsID0gbi5sXG4gICAgbiA9IG4uclxuICAgIHIgPSBpc0pvaW4obClcbiAgICAgID8gZm9sZFJlYyhmLCBmb2xkUmVjKGYsIHIsIGwubCksIGwucilcbiAgICAgIDogZihyLCBsWzBdLCBsWzFdKVxuICB9XG4gIHJldHVybiBmKHIsIG5bMF0sIG5bMV0pXG59XG5cbmNvbnN0IGZvbGQgPSAoZiwgciwgbikgPT4gdm9pZCAwICE9PSBuID8gZm9sZFJlYyhmLCByLCBuKSA6IHJcblxuY29uc3QgQ29sbGVjdCA9IENvbmNhdE9mKGpvaW4pXG5cbi8vXG5cbmZ1bmN0aW9uIHRyYXZlcnNlUGFydGlhbEluZGV4KEEsIHhpMnlBLCB4cykge1xuICBjb25zdCBhcCA9IEEuYXAsIG1hcCA9IEEubWFwXG4gIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpXG4gICAgcmVxQXBwbGljYXRpdmUoQSlcbiAgbGV0IHhzQSA9ICgwLEEub2YpKHZvaWQgMCksIGkgPSB4cy5sZW5ndGhcbiAgd2hpbGUgKGktLSlcbiAgICB4c0EgPSBhcChtYXAoY2pvaW4sIHhpMnlBKHhzW2ldLCBpKSksIHhzQSlcbiAgcmV0dXJuIG1hcCh0b0FycmF5LCB4c0EpXG59XG5cbi8vXG5cbmZ1bmN0aW9uIG9iamVjdDBUb1VuZGVmaW5lZChvKSB7XG4gIGlmICghKG8gaW5zdGFuY2VvZiBPYmplY3QpKVxuICAgIHJldHVybiBvXG4gIGZvciAoY29uc3QgayBpbiBvKVxuICAgIHJldHVybiBvXG59XG5cbi8vXG5cbmNvbnN0IGxlbnNGcm9tID0gKGdldCwgc2V0KSA9PiBpID0+IChGLCB4aTJ5RiwgeCwgXykgPT5cbiAgKDAsRi5tYXApKHYgPT4gc2V0KGksIHYsIHgpLCB4aTJ5RihnZXQoaSwgeCksIGkpKVxuXG4vL1xuXG5jb25zdCBnZXRQcm9wID0gKGssIG8pID0+IG8gaW5zdGFuY2VvZiBPYmplY3QgPyBvW2tdIDogdm9pZCAwXG5cbmNvbnN0IHNldFByb3AgPSAoaywgdiwgbykgPT5cbiAgdm9pZCAwICE9PSB2ID8gYXNzb2NQYXJ0aWFsVShrLCB2LCBvKSA6IGRpc3NvY1BhcnRpYWxVKGssIG8pXG5cbmNvbnN0IGZ1blByb3AgPSBsZW5zRnJvbShnZXRQcm9wLCBzZXRQcm9wKVxuXG4vL1xuXG5jb25zdCBnZXRJbmRleCA9IChpLCB4cykgPT4gc2VlbXNBcnJheUxpa2UoeHMpID8geHNbaV0gOiB2b2lkIDBcblxuZnVuY3Rpb24gc2V0SW5kZXgoaSwgeCwgeHMpIHtcbiAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIiAmJiBpIDwgMClcbiAgICBlcnJvckdpdmVuKFwiTmVnYXRpdmUgaW5kaWNlcyBhcmUgbm90IHN1cHBvcnRlZCBieSBgaW5kZXhgXCIsIGkpXG4gIGlmICghc2VlbXNBcnJheUxpa2UoeHMpKVxuICAgIHhzID0gXCJcIlxuICBjb25zdCBuID0geHMubGVuZ3RoXG4gIGlmICh2b2lkIDAgIT09IHgpIHtcbiAgICBjb25zdCBtID0gTWF0aC5tYXgoaSsxLCBuKSwgeXMgPSBBcnJheShtKVxuICAgIGZvciAobGV0IGo9MDsgajxtOyArK2opXG4gICAgICB5c1tqXSA9IHhzW2pdXG4gICAgeXNbaV0gPSB4XG4gICAgcmV0dXJuIHlzXG4gIH0gZWxzZSB7XG4gICAgaWYgKDAgPCBuKSB7XG4gICAgICBpZiAobiA8PSBpKVxuICAgICAgICByZXR1cm4gY29weVRvRnJvbShBcnJheShuKSwgMCwgeHMsIDAsIG4pXG4gICAgICBpZiAoMSA8IG4pIHtcbiAgICAgICAgY29uc3QgeXMgPSBBcnJheShuLTEpXG4gICAgICAgIGZvciAobGV0IGo9MDsgajxpOyArK2opXG4gICAgICAgICAgeXNbal0gPSB4c1tqXVxuICAgICAgICBmb3IgKGxldCBqPWkrMTsgajxuOyArK2opXG4gICAgICAgICAgeXNbai0xXSA9IHhzW2pdXG4gICAgICAgIHJldHVybiB5c1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5jb25zdCBmdW5JbmRleCA9IGxlbnNGcm9tKGdldEluZGV4LCBzZXRJbmRleClcblxuLy9cblxuY29uc3QgY2xvc2UgPSAobywgRiwgeGkyeUYpID0+ICh4LCBpKSA9PiBvKEYsIHhpMnlGLCB4LCBpKVxuXG5mdW5jdGlvbiBjb21wb3NlZChvaTAsIG9zKSB7XG4gIGNvbnN0IG4gPSBvcy5sZW5ndGggLSBvaTBcbiAgbGV0IGZzXG4gIGlmIChuIDwgMikge1xuICAgIHJldHVybiBuID8gdG9GdW5jdGlvbihvc1tvaTBdKSA6IGlkZW50aXR5XG4gIH0gZWxzZSB7XG4gICAgZnMgPSBBcnJheShuKVxuICAgIGZvciAobGV0IGk9MDtpPG47KytpKVxuICAgICAgZnNbaV0gPSB0b0Z1bmN0aW9uKG9zW2krb2kwXSlcbiAgICByZXR1cm4gKEYsIHhpMnlGLCB4LCBpKSA9PiB7XG4gICAgICBsZXQgaz1uXG4gICAgICB3aGlsZSAoLS1rKVxuICAgICAgICB4aTJ5RiA9IGNsb3NlKGZzW2tdLCBGLCB4aTJ5RilcbiAgICAgIHJldHVybiBmc1swXShGLCB4aTJ5RiwgeCwgaSlcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gc2V0VShvLCB4LCBzKSB7XG4gIHN3aXRjaCAodHlwZW9mIG8pIHtcbiAgICBjYXNlIFwic3RyaW5nXCI6XG4gICAgICByZXR1cm4gc2V0UHJvcChvLCB4LCBzKVxuICAgIGNhc2UgXCJudW1iZXJcIjpcbiAgICAgIHJldHVybiBzZXRJbmRleChvLCB4LCBzKVxuICAgIGNhc2UgXCJvYmplY3RcIjpcbiAgICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpXG4gICAgICAgIHJlcUFycmF5KG8pXG4gICAgICByZXR1cm4gbW9kaWZ5Q29tcG9zZWQobywgMCwgcywgeClcbiAgICBkZWZhdWx0OlxuICAgICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIilcbiAgICAgICAgcmVxRnVuY3Rpb24obylcbiAgICAgIHJldHVybiBvLmxlbmd0aCA9PT0gNCA/IG8oSWRlbnQsIGFsd2F5cyh4KSwgcywgdm9pZCAwKSA6IHNcbiAgfVxufVxuXG5mdW5jdGlvbiBnZXRVKGwsIHMpIHtcbiAgc3dpdGNoICh0eXBlb2YgbCkge1xuICAgIGNhc2UgXCJzdHJpbmdcIjpcbiAgICAgIHJldHVybiBnZXRQcm9wKGwsIHMpXG4gICAgY2FzZSBcIm51bWJlclwiOlxuICAgICAgcmV0dXJuIGdldEluZGV4KGwsIHMpXG4gICAgY2FzZSBcIm9iamVjdFwiOlxuICAgICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIilcbiAgICAgICAgcmVxQXJyYXkobClcbiAgICAgIGZvciAobGV0IGk9MCwgbj1sLmxlbmd0aCwgbzsgaTxuOyArK2kpXG4gICAgICAgIHN3aXRjaCAodHlwZW9mIChvID0gbFtpXSkpIHtcbiAgICAgICAgICBjYXNlIFwic3RyaW5nXCI6IHMgPSBnZXRQcm9wKG8sIHMpOyBicmVha1xuICAgICAgICAgIGNhc2UgXCJudW1iZXJcIjogcyA9IGdldEluZGV4KG8sIHMpOyBicmVha1xuICAgICAgICAgIGRlZmF1bHQ6IHMgPSBnZXRVKG8sIHMpOyBicmVha1xuICAgICAgICB9XG4gICAgICByZXR1cm4gc1xuICAgIGRlZmF1bHQ6XG4gICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKVxuICAgICAgICByZXFGdW5jdGlvbihsKVxuICAgICAgcmV0dXJuIGwubGVuZ3RoID09PSA0ID8gbChDb25zdCwgaWQsIHMsIHZvaWQgMCkgOiBsKHMsIHZvaWQgMClcbiAgfVxufVxuXG5mdW5jdGlvbiBtb2RpZnlDb21wb3NlZChvcywgeGkyeSwgeCwgeSkge1xuICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKVxuICAgIHJlcUFycmF5KG9zKVxuICBsZXQgbiA9IG9zLmxlbmd0aFxuICBjb25zdCB4cyA9IEFycmF5KG4pXG4gIGZvciAobGV0IGk9MCwgbzsgaTxuOyArK2kpIHtcbiAgICB4c1tpXSA9IHhcbiAgICBzd2l0Y2ggKHR5cGVvZiAobyA9IG9zW2ldKSkge1xuICAgICAgY2FzZSBcInN0cmluZ1wiOlxuICAgICAgICB4ID0gZ2V0UHJvcChvLCB4KVxuICAgICAgICBicmVha1xuICAgICAgY2FzZSBcIm51bWJlclwiOlxuICAgICAgICB4ID0gZ2V0SW5kZXgobywgeClcbiAgICAgICAgYnJlYWtcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHggPSBjb21wb3NlZChpLCBvcykoSWRlbnQsIHhpMnkgfHwgYWx3YXlzKHkpLCB4LCBvc1tpLTFdKVxuICAgICAgICBuID0gaVxuICAgICAgICBicmVha1xuICAgIH1cbiAgfVxuICBpZiAobiA9PT0gb3MubGVuZ3RoKVxuICAgIHggPSB4aTJ5ID8geGkyeSh4LCBvc1tuLTFdKSA6IHlcbiAgZm9yIChsZXQgbzsgMCA8PSAtLW47KVxuICAgIHggPSBpc1N0cmluZyhvID0gb3Nbbl0pXG4gICAgICAgID8gc2V0UHJvcChvLCB4LCB4c1tuXSlcbiAgICAgICAgOiBzZXRJbmRleChvLCB4LCB4c1tuXSlcbiAgcmV0dXJuIHhcbn1cblxuLy9cblxuZnVuY3Rpb24gZ2V0UGljayh0ZW1wbGF0ZSwgeCkge1xuICBsZXQgclxuICBmb3IgKGNvbnN0IGsgaW4gdGVtcGxhdGUpIHtcbiAgICBjb25zdCB2ID0gZ2V0VSh0ZW1wbGF0ZVtrXSwgeClcbiAgICBpZiAodm9pZCAwICE9PSB2KSB7XG4gICAgICBpZiAoIXIpXG4gICAgICAgIHIgPSB7fVxuICAgICAgcltrXSA9IHZcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJcbn1cblxuY29uc3Qgc2V0UGljayA9ICh0ZW1wbGF0ZSwgeCkgPT4gdmFsdWUgPT4ge1xuICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiICYmXG4gICAgICAhKHZvaWQgMCA9PT0gdmFsdWUgfHwgdmFsdWUgaW5zdGFuY2VvZiBPYmplY3QpKVxuICAgIGVycm9yR2l2ZW4oXCJgcGlja2AgbXVzdCBiZSBzZXQgd2l0aCB1bmRlZmluZWQgb3IgYW4gb2JqZWN0XCIsIHZhbHVlKVxuICBmb3IgKGNvbnN0IGsgaW4gdGVtcGxhdGUpXG4gICAgeCA9IHNldFUodGVtcGxhdGVba10sIHZhbHVlICYmIHZhbHVlW2tdLCB4KVxuICByZXR1cm4geFxufVxuXG4vL1xuXG5jb25zdCB0b09iamVjdCA9IHggPT4gY29uc3RydWN0b3JPZih4KSAhPT0gT2JqZWN0ID8gT2JqZWN0LmFzc2lnbih7fSwgeCkgOiB4XG5cbi8vXG5cbmNvbnN0IGJyYW5jaE9uTWVyZ2UgPSAoeCwga2V5cykgPT4geHMgPT4ge1xuICBjb25zdCBvID0ge30sIG4gPSBrZXlzLmxlbmd0aFxuICBmb3IgKGxldCBpPTA7IGk8bjsgKytpLCB4cz14c1sxXSkge1xuICAgIGNvbnN0IHYgPSB4c1swXVxuICAgIG9ba2V5c1tpXV0gPSB2b2lkIDAgIT09IHYgPyB2IDogb1xuICB9XG4gIGxldCByXG4gIHggPSB0b09iamVjdCh4KVxuICBmb3IgKGNvbnN0IGsgaW4geCkge1xuICAgIGNvbnN0IHYgPSBvW2tdXG4gICAgaWYgKG8gIT09IHYpIHtcbiAgICAgIG9ba10gPSBvXG4gICAgICBpZiAoIXIpXG4gICAgICAgIHIgPSB7fVxuICAgICAgcltrXSA9IHZvaWQgMCAhPT0gdiA/IHYgOiB4W2tdXG4gICAgfVxuICB9XG4gIGZvciAobGV0IGk9MDsgaTxuOyArK2kpIHtcbiAgICBjb25zdCBrID0ga2V5c1tpXVxuICAgIGNvbnN0IHYgPSBvW2tdXG4gICAgaWYgKG8gIT09IHYpIHtcbiAgICAgIGlmICghcilcbiAgICAgICAgciA9IHt9XG4gICAgICByW2tdID0gdlxuICAgIH1cbiAgfVxuICByZXR1cm4gclxufVxuXG5jb25zdCBicmFuY2hPbiA9IChrZXlzLCB2YWxzKSA9PiAoQSwgeGkyeUEsIHgsIF8pID0+IHtcbiAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIilcbiAgICByZXFBcHBsaWNhdGl2ZShBKVxuICBjb25zdCBvZiA9IEEub2ZcbiAgbGV0IGkgPSBrZXlzLmxlbmd0aFxuICBpZiAoIWkpXG4gICAgcmV0dXJuIG9mKG9iamVjdDBUb1VuZGVmaW5lZCh4KSlcbiAgaWYgKCEoeCBpbnN0YW5jZW9mIE9iamVjdCkpXG4gICAgeCA9IG9iamVjdDBcbiAgY29uc3QgYXAgPSBBLmFwLCBtYXAgPSBBLm1hcFxuICBsZXQgeHNBID0gb2YoMClcbiAgd2hpbGUgKGktLSkge1xuICAgIGNvbnN0IGsgPSBrZXlzW2ldLCB2ID0geFtrXVxuICAgIHhzQSA9IGFwKG1hcChjcGFpciwgdmFscyA/IHZhbHNbaV0oQSwgeGkyeUEsIHYsIGspIDogeGkyeUEodiwgaykpLCB4c0EpXG4gIH1cbiAgcmV0dXJuIG1hcChicmFuY2hPbk1lcmdlKHgsIGtleXMpLCB4c0EpXG59XG5cbmNvbnN0IG5vcm1hbGl6ZXIgPSB4aTJ4ID0+IChGLCB4aTJ5RiwgeCwgaSkgPT5cbiAgKDAsRi5tYXApKHggPT4geGkyeCh4LCBpKSwgeGkyeUYoeGkyeCh4LCBpKSwgaSkpXG5cbmNvbnN0IHJlcGxhY2VkID0gKGlubiwgb3V0LCB4KSA9PiBhY3ljbGljRXF1YWxzVSh4LCBpbm4pID8gb3V0IDogeFxuXG5mdW5jdGlvbiBmaW5kSW5kZXgoeGkyYiwgeHMpIHtcbiAgZm9yIChsZXQgaT0wLCBuPXhzLmxlbmd0aDsgaTxuOyArK2kpXG4gICAgaWYgKHhpMmIoeHNbaV0sIGkpKVxuICAgICAgcmV0dXJuIGlcbiAgcmV0dXJuIC0xXG59XG5cbmZ1bmN0aW9uIHBhcnRpdGlvbkludG9JbmRleCh4aTJiLCB4cywgdHMsIGZzKSB7XG4gIGZvciAobGV0IGk9MCwgbj14cy5sZW5ndGgsIHg7IGk8bjsgKytpKVxuICAgICh4aTJiKHggPSB4c1tpXSwgaSkgPyB0cyA6IGZzKS5wdXNoKHgpXG59XG5cbmNvbnN0IGZyb21SZWFkZXIgPSB3aTJ4ID0+IChGLCB4aTJ5RiwgdywgaSkgPT5cbiAgKDAsRi5tYXApKGFsd2F5cyh3KSwgeGkyeUYod2kyeCh3LCBpKSwgaSkpXG5cbi8vXG5cbmV4cG9ydCBmdW5jdGlvbiB0b0Z1bmN0aW9uKG8pIHtcbiAgc3dpdGNoICh0eXBlb2Ygbykge1xuICAgIGNhc2UgXCJzdHJpbmdcIjpcbiAgICAgIHJldHVybiBmdW5Qcm9wKG8pXG4gICAgY2FzZSBcIm51bWJlclwiOlxuICAgICAgcmV0dXJuIGZ1bkluZGV4KG8pXG4gICAgY2FzZSBcIm9iamVjdFwiOlxuICAgICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIilcbiAgICAgICAgcmVxQXJyYXkobylcbiAgICAgIHJldHVybiBjb21wb3NlZCgwLCBvKVxuICAgIGRlZmF1bHQ6XG4gICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKVxuICAgICAgICByZXFGdW5jdGlvbihvKVxuICAgICAgcmV0dXJuIG8ubGVuZ3RoID09PSA0ID8gbyA6IGZyb21SZWFkZXIobylcbiAgfVxufVxuXG4vLyBPcGVyYXRpb25zIG9uIG9wdGljc1xuXG5leHBvcnQgY29uc3QgbW9kaWZ5ID0gY3VycnkoKG8sIHhpMngsIHMpID0+IHtcbiAgc3dpdGNoICh0eXBlb2Ygbykge1xuICAgIGNhc2UgXCJzdHJpbmdcIjpcbiAgICAgIHJldHVybiBzZXRQcm9wKG8sIHhpMngoZ2V0UHJvcChvLCBzKSwgbyksIHMpXG4gICAgY2FzZSBcIm51bWJlclwiOlxuICAgICAgcmV0dXJuIHNldEluZGV4KG8sIHhpMngoZ2V0SW5kZXgobywgcyksIG8pLCBzKVxuICAgIGNhc2UgXCJvYmplY3RcIjpcbiAgICAgIHJldHVybiBtb2RpZnlDb21wb3NlZChvLCB4aTJ4LCBzKVxuICAgIGRlZmF1bHQ6XG4gICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKVxuICAgICAgICByZXFGdW5jdGlvbihvKVxuICAgICAgcmV0dXJuIG8ubGVuZ3RoID09PSA0XG4gICAgICAgID8gbyhJZGVudCwgeGkyeCwgcywgdm9pZCAwKVxuICAgICAgICA6ICh4aTJ4KG8ocywgdm9pZCAwKSwgdm9pZCAwKSwgcylcbiAgfVxufSlcblxuZXhwb3J0IGNvbnN0IHJlbW92ZSA9IGN1cnJ5KChvLCBzKSA9PiBzZXRVKG8sIHZvaWQgMCwgcykpXG5cbmV4cG9ydCBjb25zdCBzZXQgPSBjdXJyeShzZXRVKVxuXG4vLyBOZXN0aW5nXG5cbmV4cG9ydCBmdW5jdGlvbiBjb21wb3NlKCkge1xuICBsZXQgbiA9IGFyZ3VtZW50cy5sZW5ndGhcbiAgaWYgKG4gPCAyKSB7XG4gICAgcmV0dXJuIG4gPyBhcmd1bWVudHNbMF0gOiBpZGVudGl0eVxuICB9IGVsc2Uge1xuICAgIGNvbnN0IGxlbnNlcyA9IEFycmF5KG4pXG4gICAgd2hpbGUgKG4tLSlcbiAgICAgIGxlbnNlc1tuXSA9IGFyZ3VtZW50c1tuXVxuICAgIHJldHVybiBsZW5zZXNcbiAgfVxufVxuXG4vLyBRdWVyeWluZ1xuXG5leHBvcnQgY29uc3QgY2hhaW4gPSBjdXJyeSgoeGkyeU8sIHhPKSA9PlxuICBbeE8sIGNob29zZSgoeE0sIGkpID0+IHZvaWQgMCAhPT0geE0gPyB4aTJ5Tyh4TSwgaSkgOiB6ZXJvKV0pXG5cbmV4cG9ydCBjb25zdCBjaG9pY2UgPSAoLi4ubHMpID0+IGNob29zZSh4ID0+IHtcbiAgY29uc3QgaSA9IGZpbmRJbmRleChsID0+IHZvaWQgMCAhPT0gZ2V0VShsLCB4KSwgbHMpXG4gIHJldHVybiBpIDwgMCA/IHplcm8gOiBsc1tpXVxufSlcblxuZXhwb3J0IGNvbnN0IGNob29zZSA9IHhpTTJvID0+IChDLCB4aTJ5QywgeCwgaSkgPT5cbiAgcnVuKHhpTTJvKHgsIGkpLCBDLCB4aTJ5QywgeCwgaSlcblxuZXhwb3J0IGNvbnN0IHdoZW4gPSBwID0+IChDLCB4aTJ5QywgeCwgaSkgPT5cbiAgcCh4LCBpKSA/IHhpMnlDKHgsIGkpIDogemVybyhDLCB4aTJ5QywgeCwgaSlcblxuZXhwb3J0IGNvbnN0IG9wdGlvbmFsID0gd2hlbihpc0RlZmluZWQpXG5cbmV4cG9ydCBmdW5jdGlvbiB6ZXJvKEMsIHhpMnlDLCB4LCBpKSB7XG4gIGNvbnN0IG9mID0gQy5vZlxuICByZXR1cm4gb2YgPyBvZih4KSA6ICgwLEMubWFwKShhbHdheXMoeCksIHhpMnlDKHZvaWQgMCwgaSkpXG59XG5cbi8vIFJlY3Vyc2luZ1xuXG5leHBvcnQgZnVuY3Rpb24gbGF6eShvMm8pIHtcbiAgbGV0IG1lbW8gPSAoQywgeGkyeUMsIHgsIGkpID0+IChtZW1vID0gdG9GdW5jdGlvbihvMm8ocmVjKSkpKEMsIHhpMnlDLCB4LCBpKVxuICBmdW5jdGlvbiByZWMoQywgeGkyeUMsIHgsIGkpIHtyZXR1cm4gbWVtbyhDLCB4aTJ5QywgeCwgaSl9XG4gIHJldHVybiByZWNcbn1cblxuLy8gRGVidWdnaW5nXG5cbmV4cG9ydCBmdW5jdGlvbiBsb2coKSB7XG4gIGNvbnN0IHNob3cgPSBkaXIgPT4geCA9PlxuICAgIGNvbnNvbGUubG9nLmFwcGx5KGNvbnNvbGUsXG4gICAgICAgICAgICAgICAgICAgICAgY29weVRvRnJvbShbXSwgMCwgYXJndW1lbnRzLCAwLCBhcmd1bWVudHMubGVuZ3RoKVxuICAgICAgICAgICAgICAgICAgICAgIC5jb25jYXQoW2RpciwgeF0pKSB8fCB4XG4gIHJldHVybiBpc28oc2hvdyhcImdldFwiKSwgc2hvdyhcInNldFwiKSlcbn1cblxuLy8gT3BlcmF0aW9ucyBvbiB0cmF2ZXJzYWxzXG5cbmV4cG9ydCBjb25zdCBjb25jYXRBcyA9IGNvbnN0QXMobSA9PiBDb25jYXRPZihtLmNvbmNhdCwgKDAsbS5lbXB0eSkoKSkpXG5cbmV4cG9ydCBjb25zdCBjb25jYXQgPSBjb25jYXRBcyhpZClcblxuZXhwb3J0IGNvbnN0IG1lcmdlQXMgPSBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gXCJwcm9kdWN0aW9uXCIgPyBjb25jYXRBcyA6IChmLCBtLCB0LCBkKSA9PiB7XG4gIGlmICghbWVyZ2VBcy53YXJuZWQpIHtcbiAgICBtZXJnZUFzLndhcm5lZCA9IDFcbiAgICBjb25zb2xlLndhcm4oXCJwYXJ0aWFsLmxlbnNlczogYG1lcmdlQXNgIGlzIG9ic29sZXRlLCBqdXN0IHVzZSBgY29uY2F0QXNgXCIpXG4gIH1cbiAgcmV0dXJuIGNvbmNhdEFzKGYsIG0sIHQsIGQpXG59XG5cbmV4cG9ydCBjb25zdCBtZXJnZSA9IHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSBcInByb2R1Y3Rpb25cIiA/IGNvbmNhdCA6IChtLCB0LCBkKSA9PiB7XG4gIGlmICghbWVyZ2Uud2FybmVkKSB7XG4gICAgbWVyZ2Uud2FybmVkID0gMVxuICAgIGNvbnNvbGUud2FybihcInBhcnRpYWwubGVuc2VzOiBgbWVyZ2VgIGlzIG9ic29sZXRlLCBqdXN0IHVzZSBgY29uY2F0YFwiKVxuICB9XG4gIHJldHVybiBjb25jYXQobSwgdCwgZClcbn1cblxuLy8gRm9sZHMgb3ZlciB0cmF2ZXJzYWxzXG5cbmV4cG9ydCBjb25zdCBjb2xsZWN0QXMgPSBjdXJyeSgoeGkyeSwgdCwgcykgPT5cbiAgdG9BcnJheShydW4odCwgQ29sbGVjdCwgeGkyeSwgcykpIHx8IFtdKVxuXG5leHBvcnQgY29uc3QgY29sbGVjdCA9IGNvbGxlY3RBcyhpZClcblxuZXhwb3J0IGNvbnN0IGZvbGRsID0gY3VycnkoKGYsIHIsIHQsIHMpID0+XG4gIGZvbGQoZiwgciwgcnVuKHQsIENvbGxlY3QsIHBhaXIsIHMpKSlcblxuZXhwb3J0IGNvbnN0IGZvbGRyID0gY3VycnkoKGYsIHIsIHQsIHMpID0+IHtcbiAgY29uc3QgeHMgPSBjb2xsZWN0QXMocGFpciwgdCwgcylcbiAgZm9yIChsZXQgaT14cy5sZW5ndGgtMTsgMDw9aTsgLS1pKSB7XG4gICAgY29uc3QgeCA9IHhzW2ldXG4gICAgciA9IGYociwgeFswXSwgeFsxXSlcbiAgfVxuICByZXR1cm4gclxufSlcblxuZXhwb3J0IGNvbnN0IG1heGltdW0gPSBjb25jYXQoTXVtKCh4LCB5KSA9PiB4ID4geSkpXG5cbmV4cG9ydCBjb25zdCBtaW5pbXVtID0gY29uY2F0KE11bSgoeCwgeSkgPT4geCA8IHkpKVxuXG5leHBvcnQgY29uc3QgcHJvZHVjdCA9IGNvbmNhdEFzKHVudG8oMSksIE1vbm9pZCgoeSwgeCkgPT4geCAqIHksIDEpKVxuXG5leHBvcnQgY29uc3Qgc3VtID0gY29uY2F0QXModW50bygwKSwgTW9ub2lkKCh5LCB4KSA9PiB4ICsgeSwgMCkpXG5cbi8vIENyZWF0aW5nIG5ldyB0cmF2ZXJzYWxzXG5cbmV4cG9ydCBmdW5jdGlvbiBicmFuY2godGVtcGxhdGUpIHtcbiAgY29uc3Qga2V5cyA9IFtdLCB2YWxzID0gW11cbiAgZm9yIChjb25zdCBrIGluIHRlbXBsYXRlKSB7XG4gICAga2V5cy5wdXNoKGspXG4gICAgdmFscy5wdXNoKHRvRnVuY3Rpb24odGVtcGxhdGVba10pKVxuICB9XG4gIHJldHVybiBicmFuY2hPbihrZXlzLCB2YWxzKVxufVxuXG4vLyBUcmF2ZXJzYWxzIGFuZCBjb21iaW5hdG9yc1xuXG5leHBvcnQgZnVuY3Rpb24gZWxlbXMoQSwgeGkyeUEsIHhzLCBfKSB7XG4gIGlmIChzZWVtc0FycmF5TGlrZSh4cykpIHtcbiAgICByZXR1cm4gQSA9PT0gSWRlbnRcbiAgICAgID8gbWFwUGFydGlhbEluZGV4VSh4aTJ5QSwgeHMpXG4gICAgICA6IHRyYXZlcnNlUGFydGlhbEluZGV4KEEsIHhpMnlBLCB4cylcbiAgfSBlbHNlIHtcbiAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKVxuICAgICAgcmVxQXBwbGljYXRpdmUoQSlcbiAgICByZXR1cm4gKDAsQS5vZikoeHMpXG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHZhbHVlcyhBLCB4aTJ5QSwgeHMsIF8pIHtcbiAgaWYgKHhzIGluc3RhbmNlb2YgT2JqZWN0KSB7XG4gICAgcmV0dXJuIGJyYW5jaE9uKGtleXMoeHMpKShBLCB4aTJ5QSwgeHMpXG4gIH0gZWxzZSB7XG4gICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIilcbiAgICAgIHJlcUFwcGxpY2F0aXZlKEEpXG4gICAgcmV0dXJuICgwLEEub2YpKHhzKVxuICB9XG59XG5cbi8vIE9wZXJhdGlvbnMgb24gbGVuc2VzXG5cbmV4cG9ydCBjb25zdCBnZXQgPSBjdXJyeShnZXRVKVxuXG4vLyBDcmVhdGluZyBuZXcgbGVuc2VzXG5cbmV4cG9ydCBjb25zdCBsZW5zID0gY3VycnkoKGdldCwgc2V0KSA9PiAoRiwgeGkyeUYsIHgsIGkpID0+XG4gICgwLEYubWFwKSh5ID0+IHNldCh5LCB4LCBpKSwgeGkyeUYoZ2V0KHgsIGkpLCBpKSkpXG5cbi8vIENvbXB1dGluZyBkZXJpdmVkIHByb3BzXG5cbmV4cG9ydCBjb25zdCBhdWdtZW50ID0gdGVtcGxhdGUgPT4ge1xuICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiICYmICFpc09iamVjdCh0ZW1wbGF0ZSkpXG4gICAgZXJyb3JHaXZlbihcImBhdWdtZW50YCBleHBlY3RzIGEgcGxhaW4gT2JqZWN0IHRlbXBsYXRlXCIsIHRlbXBsYXRlKVxuICByZXR1cm4gbGVucyhcbiAgICB4ID0+IHtcbiAgICAgIHggPSBkaXNzb2NQYXJ0aWFsVSgwLCB4KVxuICAgICAgaWYgKHgpXG4gICAgICAgIGZvciAoY29uc3QgayBpbiB0ZW1wbGF0ZSlcbiAgICAgICAgICB4W2tdID0gdGVtcGxhdGVba10oeClcbiAgICAgIHJldHVybiB4XG4gICAgfSxcbiAgICAoeSwgeCkgPT4ge1xuICAgICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIiAmJlxuICAgICAgICAgICEodm9pZCAwID09PSB5IHx8IHkgaW5zdGFuY2VvZiBPYmplY3QpKVxuICAgICAgICBlcnJvckdpdmVuKFwiYGF1Z21lbnRgIG11c3QgYmUgc2V0IHdpdGggdW5kZWZpbmVkIG9yIGFuIG9iamVjdFwiLCB5KVxuICAgICAgeSA9IHRvT2JqZWN0KHkpXG4gICAgICBpZiAoISh4IGluc3RhbmNlb2YgT2JqZWN0KSlcbiAgICAgICAgeCA9IHZvaWQgMFxuICAgICAgbGV0IHpcbiAgICAgIGZ1bmN0aW9uIHNldChrLCB2KSB7XG4gICAgICAgIGlmICgheilcbiAgICAgICAgICB6ID0ge31cbiAgICAgICAgeltrXSA9IHZcbiAgICAgIH1cbiAgICAgIGZvciAoY29uc3QgayBpbiB5KSB7XG4gICAgICAgIGlmICghaGFzVShrLCB0ZW1wbGF0ZSkpXG4gICAgICAgICAgc2V0KGssIHlba10pXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBpZiAoeCAmJiBoYXNVKGssIHgpKVxuICAgICAgICAgICAgc2V0KGssIHhba10pXG4gICAgICB9XG4gICAgICByZXR1cm4gelxuICAgIH0pXG59XG5cbi8vIEVuZm9yY2luZyBpbnZhcmlhbnRzXG5cbmV4cG9ydCBjb25zdCBkZWZhdWx0cyA9IG91dCA9PiB7XG4gIGNvbnN0IG8ydSA9IHggPT4gcmVwbGFjZWQob3V0LCB2b2lkIDAsIHgpXG4gIHJldHVybiAoRiwgeGkyeUYsIHgsIGkpID0+ICgwLEYubWFwKShvMnUsIHhpMnlGKHZvaWQgMCAhPT0geCA/IHggOiBvdXQsIGkpKVxufVxuXG5leHBvcnQgY29uc3QgcmVxdWlyZWQgPSBpbm4gPT4gcmVwbGFjZShpbm4sIHZvaWQgMClcblxuZXhwb3J0IGNvbnN0IGRlZmluZSA9IHYgPT4gbm9ybWFsaXplcih1bnRvKHYpKVxuXG5leHBvcnQgY29uc3Qgbm9ybWFsaXplID0geGkyeCA9PlxuICBub3JtYWxpemVyKCh4LCBpKSA9PiB2b2lkIDAgIT09IHggPyB4aTJ4KHgsIGkpIDogdm9pZCAwKVxuXG5leHBvcnQgY29uc3QgcmV3cml0ZSA9IHlpMnkgPT4gKEYsIHhpMnlGLCB4LCBpKSA9PlxuICAoMCxGLm1hcCkoeSA9PiB2b2lkIDAgIT09IHkgPyB5aTJ5KHksIGkpIDogdm9pZCAwLCB4aTJ5Rih4LCBpKSlcblxuLy8gTGVuc2luZyBhcnJheXNcblxuZXhwb3J0IGNvbnN0IGFwcGVuZCA9IChGLCB4aTJ5RiwgeHMsIGkpID0+XG4gICgwLEYubWFwKSh4ID0+IHNldEluZGV4KHNlZW1zQXJyYXlMaWtlKHhzKSA/IHhzLmxlbmd0aCA6IDAsIHgsIHhzKSxcbiAgICAgICAgICAgIHhpMnlGKHZvaWQgMCwgaSkpXG5cbmV4cG9ydCBjb25zdCBmaWx0ZXIgPSB4aTJiID0+IChGLCB4aTJ5RiwgeHMsIGkpID0+IHtcbiAgbGV0IHRzLCBmc1xuICBpZiAoc2VlbXNBcnJheUxpa2UoeHMpKVxuICAgIHBhcnRpdGlvbkludG9JbmRleCh4aTJiLCB4cywgdHMgPSBbXSwgZnMgPSBbXSlcbiAgcmV0dXJuICgwLEYubWFwKShcbiAgICB0cyA9PiB7XG4gICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiICYmXG4gICAgICAgICAgISh2b2lkIDAgPT09IHRzIHx8IHNlZW1zQXJyYXlMaWtlKHRzKSkpXG4gICAgICAgIGVycm9yR2l2ZW4oXCJgZmlsdGVyYCBtdXN0IGJlIHNldCB3aXRoIHVuZGVmaW5lZCBvciBhbiBhcnJheS1saWtlIG9iamVjdFwiLCB0cylcbiAgICAgIGNvbnN0IHRzTiA9IHRzID8gdHMubGVuZ3RoIDogMCxcbiAgICAgICAgICAgIGZzTiA9IGZzID8gZnMubGVuZ3RoIDogMCxcbiAgICAgICAgICAgIG4gPSB0c04gKyBmc05cbiAgICAgIGlmIChuKVxuICAgICAgICByZXR1cm4gbiA9PT0gZnNOXG4gICAgICAgID8gZnNcbiAgICAgICAgOiBjb3B5VG9Gcm9tKGNvcHlUb0Zyb20oQXJyYXkobiksIDAsIHRzLCAwLCB0c04pLCB0c04sIGZzLCAwLCBmc04pXG4gICAgfSxcbiAgICB4aTJ5Rih0cywgaSkpXG59XG5cbmV4cG9ydCBjb25zdCBmaW5kID0geGkyYiA9PiBjaG9vc2UoeHMgPT4ge1xuICBpZiAoIXNlZW1zQXJyYXlMaWtlKHhzKSlcbiAgICByZXR1cm4gMFxuICBjb25zdCBpID0gZmluZEluZGV4KHhpMmIsIHhzKVxuICByZXR1cm4gaSA8IDAgPyBhcHBlbmQgOiBpXG59KVxuXG5leHBvcnQgZnVuY3Rpb24gZmluZFdpdGgoLi4ubHMpIHtcbiAgY29uc3QgbGxzID0gY29tcG9zZSguLi5scylcbiAgcmV0dXJuIFtmaW5kKHggPT4gdm9pZCAwICE9PSBnZXRVKGxscywgeCkpLCBsbHNdXG59XG5cbmV4cG9ydCBjb25zdCBpbmRleCA9IHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSBcInByb2R1Y3Rpb25cIiA/IGlkIDogeCA9PiB7XG4gIGlmICghTnVtYmVyLmlzSW50ZWdlcih4KSB8fCB4IDwgMClcbiAgICBlcnJvckdpdmVuKFwiYGluZGV4YCBleHBlY3RzIGEgbm9uLW5lZ2F0aXZlIGludGVnZXJcIiwgeClcbiAgcmV0dXJuIHhcbn1cblxuZXhwb3J0IGNvbnN0IHNsaWNlID0gY3VycnkoKGJlZ2luLCBlbmQpID0+IChGLCB4c2kyeUYsIHhzLCBpKSA9PiB7XG4gIGNvbnN0IHNlZW1zID0gc2VlbXNBcnJheUxpa2UoeHMpLFxuICAgICAgICB4c04gPSBzZWVtcyAmJiB4cy5sZW5ndGgsXG4gICAgICAgIGIgPSBzbGljZUluZGV4KDAsIHhzTiwgMCwgYmVnaW4pLFxuICAgICAgICBlID0gc2xpY2VJbmRleChiLCB4c04sIHhzTiwgZW5kKVxuICByZXR1cm4gKDAsRi5tYXApKFxuICAgIHpzID0+IHtcbiAgICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIgJiZcbiAgICAgICAgICAhKHZvaWQgMCA9PT0genMgfHwgc2VlbXNBcnJheUxpa2UoenMpKSlcbiAgICAgICAgZXJyb3JHaXZlbihcImBzbGljZWAgbXVzdCBiZSBzZXQgd2l0aCB1bmRlZmluZWQgb3IgYW4gYXJyYXktbGlrZSBvYmplY3RcIiwgenMpXG4gICAgICBjb25zdCB6c04gPSB6cyA/IHpzLmxlbmd0aCA6IDAsIGJQenNOID0gYiArIHpzTiwgbiA9IHhzTiAtIGUgKyBiUHpzTlxuICAgICAgcmV0dXJuIG5cbiAgICAgICAgPyBjb3B5VG9Gcm9tKGNvcHlUb0Zyb20oY29weVRvRnJvbShBcnJheShuKSwgMCwgeHMsIDAsIGIpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB6cywgMCwgenNOKSxcbiAgICAgICAgICAgICAgICAgICAgIGJQenNOLFxuICAgICAgICAgICAgICAgICAgICAgeHMsIGUsIHhzTilcbiAgICAgICAgOiB2b2lkIDBcbiAgICB9LFxuICAgIHhzaTJ5RihzZWVtcyA/IGNvcHlUb0Zyb20oQXJyYXkoTWF0aC5tYXgoMCwgZSAtIGIpKSwgMCwgeHMsIGIsIGUpIDpcbiAgICAgICAgICAgdm9pZCAwLFxuICAgICAgICAgICBpKSlcbn0pXG5cbi8vIExlbnNpbmcgb2JqZWN0c1xuXG5leHBvcnQgY29uc3QgcHJvcCA9IHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSBcInByb2R1Y3Rpb25cIiA/IGlkIDogeCA9PiB7XG4gIGlmICghaXNTdHJpbmcoeCkpXG4gICAgZXJyb3JHaXZlbihcImBwcm9wYCBleHBlY3RzIGEgc3RyaW5nXCIsIHgpXG4gIHJldHVybiB4XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwcm9wcygpIHtcbiAgY29uc3QgbiA9IGFyZ3VtZW50cy5sZW5ndGgsIHRlbXBsYXRlID0ge31cbiAgZm9yIChsZXQgaT0wLCBrOyBpPG47ICsraSlcbiAgICB0ZW1wbGF0ZVtrID0gYXJndW1lbnRzW2ldXSA9IGtcbiAgcmV0dXJuIHBpY2sodGVtcGxhdGUpXG59XG5cbmV4cG9ydCBjb25zdCByZW1vdmFibGUgPSAoLi4ucHMpID0+IChGLCB4aTJ5RiwgeCwgaSkgPT4gKDAsRi5tYXApKFxuICB5ID0+IHtcbiAgICBpZiAoISh5IGluc3RhbmNlb2YgT2JqZWN0KSlcbiAgICAgIHJldHVybiB5XG4gICAgZm9yIChsZXQgaT0wLCBuPXBzLmxlbmd0aDsgaTxuOyArK2kpXG4gICAgICBpZiAoaGFzVShwc1tpXSwgeSkpXG4gICAgICAgIHJldHVybiB5XG4gIH0sXG4gIHhpMnlGKHgsIGkpKVxuXG4vLyBQcm92aWRpbmcgZGVmYXVsdHNcblxuZXhwb3J0IGNvbnN0IHZhbHVlT3IgPSB2ID0+IChfRiwgeGkyeUYsIHgsIGkpID0+XG4gIHhpMnlGKHZvaWQgMCAhPT0geCAmJiB4ICE9PSBudWxsID8geCA6IHYsIGkpXG5cbi8vIEFkYXB0aW5nIHRvIGRhdGFcblxuZXhwb3J0IGNvbnN0IG9yRWxzZSA9XG4gIGN1cnJ5KChkLCBsKSA9PiBjaG9vc2UoeCA9PiB2b2lkIDAgIT09IGdldFUobCwgeCkgPyBsIDogZCkpXG5cbi8vIFJlYWQtb25seSBtYXBwaW5nXG5cbmV4cG9ydCBjb25zdCB0byA9IHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSBcInByb2R1Y3Rpb25cIiA/IGlkIDogd2kyeCA9PiB7XG4gIGlmICghdG8ud2FybmVkKSB7XG4gICAgdG8ud2FybmVkID0gMVxuICAgIGNvbnNvbGUud2FybihcInBhcnRpYWwubGVuc2VzOiBgdG9gIGlzIG9ic29sZXRlLCB5b3UgY2FuIGRpcmVjdGx5IGBjb21wb3NlYCBwbGFpbiBmdW5jdGlvbnMgd2l0aCBvcHRpY3NcIilcbiAgfVxuICByZXR1cm4gd2kyeFxufVxuXG5leHBvcnQgY29uc3QganVzdCA9IHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSBcInByb2R1Y3Rpb25cIiA/IGFsd2F5cyA6IHggPT4ge1xuICBpZiAoIWp1c3Qud2FybmVkKSB7XG4gICAganVzdC53YXJuZWQgPSAxXG4gICAgY29uc29sZS53YXJuKFwicGFydGlhbC5sZW5zZXM6IGBqdXN0YCBpcyBvYnNvbGV0ZSwganVzdCB1c2UgZS5nLiBgUi5hbHdheXNgXCIpXG4gIH1cbiAgcmV0dXJuIGFsd2F5cyh4KVxufVxuXG4vLyBUcmFuc2Zvcm1pbmcgZGF0YVxuXG5leHBvcnQgY29uc3QgcGljayA9IHRlbXBsYXRlID0+IHtcbiAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIiAmJiAhaXNPYmplY3QodGVtcGxhdGUpKVxuICAgIGVycm9yR2l2ZW4oXCJgcGlja2AgZXhwZWN0cyBhIHBsYWluIE9iamVjdCB0ZW1wbGF0ZVwiLCB0ZW1wbGF0ZSlcbiAgcmV0dXJuIChGLCB4aTJ5RiwgeCwgaSkgPT5cbiAgICAoMCxGLm1hcCkoc2V0UGljayh0ZW1wbGF0ZSwgeCksIHhpMnlGKGdldFBpY2sodGVtcGxhdGUsIHgpLCBpKSlcbn1cblxuZXhwb3J0IGNvbnN0IHJlcGxhY2UgPSBjdXJyeSgoaW5uLCBvdXQpID0+IHtcbiAgY29uc3QgbzJpID0geCA9PiByZXBsYWNlZChvdXQsIGlubiwgeClcbiAgcmV0dXJuIChGLCB4aTJ5RiwgeCwgaSkgPT4gKDAsRi5tYXApKG8yaSwgeGkyeUYocmVwbGFjZWQoaW5uLCBvdXQsIHgpLCBpKSlcbn0pXG5cbi8vIE9wZXJhdGlvbnMgb24gaXNvbW9ycGhpc21zXG5cbmV4cG9ydCBjb25zdCBnZXRJbnZlcnNlID0gYXJpdHlOKDIsIHNldFUpXG5cbi8vIENyZWF0aW5nIG5ldyBpc29tb3JwaGlzbXNcblxuZXhwb3J0IGNvbnN0IGlzbyA9XG4gIGN1cnJ5KChid2QsIGZ3ZCkgPT4gKEYsIHhpMnlGLCB4LCBpKSA9PiAoMCxGLm1hcCkoZndkLCB4aTJ5Rihid2QoeCksIGkpKSlcblxuLy8gSXNvbW9ycGhpc21zIGFuZCBjb21iaW5hdG9yc1xuXG5leHBvcnQgY29uc3QgaWRlbnRpdHkgPSAoX0YsIHhpMnlGLCB4LCBpKSA9PiB4aTJ5Rih4LCBpKVxuXG5leHBvcnQgY29uc3QgaW52ZXJzZSA9IGlzbyA9PiAoRiwgeGkyeUYsIHgsIGkpID0+XG4gICgwLEYubWFwKSh4ID0+IGdldFUoaXNvLCB4KSwgeGkyeUYoc2V0VShpc28sIHgpLCBpKSlcbiJdfQ==
