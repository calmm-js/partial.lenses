(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.L = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.inverse = exports.identity = exports.iso = exports.getInverse = exports.replace = exports.just = exports.to = exports.orElse = exports.valueOr = exports.removable = exports.prop = exports.slice = exports.index = exports.find = exports.filter = exports.append = exports.rewrite = exports.required = exports.normalize = exports.lens = exports.get = exports.sum = exports.product = exports.or = exports.minimum = exports.maximum = exports.foldr = exports.foldl = exports.first = exports.firstAs = exports.collect = exports.collectAs = exports.any = exports.and = exports.all = exports.merge = exports.mergeAs = exports.concat = exports.concatAs = exports.optional = exports.when = exports.choose = exports.choice = exports.chain = exports.set = exports.remove = exports.modify = undefined;
exports.toFunction = toFunction;
exports.seq = seq;
exports.compose = compose;
exports.zero = zero;
exports.lazy = lazy;
exports.log = log;
exports.branch = branch;
exports.elems = elems;
exports.values = values;
exports.augment = augment;
exports.defaults = defaults;
exports.define = define;
exports.findWith = findWith;
exports.props = props;
exports.pick = pick;

var _infestines = require("infestines");

//

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

var Ident = { map: _infestines.applyU, of: _infestines.id, ap: _infestines.applyU, chain: _infestines.applyU };

var Const = { map: _infestines.sndU };

function ConcatOf(ap, empty, delay) {
  var c = { map: _infestines.sndU, ap: ap, of: (0, _infestines.always)(empty) };
  if (delay) c.delay = delay;
  return c;
}

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

//

var expectedOptic = "Expecting an optic";
var header = "partial.lenses: ";

function warn(f, m) {
  if (!f.warned) {
    f.warned = 1;
    console.warn(header + m);
  }
}

function errorGiven(m, o) {
  console.error(header + m + " - given:", o);
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

function the(v) {
  function result() {
    return result;
  }
  result.v = v;
  return result;
}

var T = the(true);
var not = function not(x) {
  return !x;
};

var First = ConcatOf(function (l, r) {
  return l && l() || r && r();
}, void 0, _infestines.id);

var mkFirst = function mkFirst(toM) {
  return function (xi2yM, t, s) {
    if ("dev" !== "production") warn(mkFirst, "Lazy folds over traversals are experimental");
    return s = run(t, First, (0, _infestines.pipe2U)(xi2yM, toM), s), s && (s = s()) && s.v;
  };
};

//

var traversePartialIndexLazy = function traversePartialIndexLazy(map, ap, z, delay, xi2yA, xs, i, n) {
  return i < n ? ap(map(cjoin, xi2yA(xs[i], i)), delay(function () {
    return traversePartialIndexLazy(map, ap, z, delay, xi2yA, xs, i + 1, n);
  })) : z;
};

function traversePartialIndex(A, xi2yA, xs) {
  if ("dev" !== "production") reqApplicative(A);
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
            return composed(i, l)(Const, _infestines.id, s, l[i - 1]);
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

function branchOnLazy(keys, vals, map, ap, z, delay, A, xi2yA, x, i) {
  if (i < keys.length) {
    var k = keys[i],
        v = x[k];
    return ap(map(cpair, vals ? vals[i](A, xi2yA, x[k], k) : xi2yA(v, k)), delay(function () {
      return branchOnLazy(keys, vals, map, ap, z, delay, A, xi2yA, x, i + 1);
    }));
  } else {
    return z;
  }
}

var branchOn = function branchOn(keys, vals) {
  return function (A, xi2yA, x, _) {
    if ("dev" !== "production") reqApplicative(A);
    var map = A.map,
        ap = A.ap,
        of = A.of,
        delay = A.delay;

    var i = keys.length;
    if (!i) return of(object0ToUndefined(x));
    if (!(x instanceof Object)) x = _infestines.object0;
    var xsA = of(0);
    if (delay) {
      xsA = branchOnLazy(keys, vals, map, ap, xsA, delay, A, xi2yA, x, 0);
    } else {
      while (i--) {
        var k = keys[i],
            v = x[k];
        xsA = ap(map(cpair, vals ? vals[i](A, xi2yA, v, k) : xi2yA(v, k)), xsA);
      }
    }
    return map(branchOnMerge(x, keys), xsA);
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
    if ("dev" !== "production" && !M.chain) errorGiven("`seq` requires a monad", M);
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

  var show = (0, _infestines.curry)(function (dir, x) {
    return console.log.apply(console, copyToFrom([], 0, _arguments, 0, _arguments.length).concat([dir, x])) || x;
  });
  return iso(show("get"), show("set"));
}

// Operations on traversals

var concatAs = exports.concatAs = (0, _infestines.curryN)(4, function (xMi2y, m) {
  var C = ConcatOf(m.concat, (0, m.empty)(), m.delay);
  return function (t, s) {
    return run(t, C, xMi2y, s);
  };
});

var concat = exports.concat = concatAs(_infestines.id);

var mergeAs = exports.mergeAs = "dev" === "production" ? concatAs : function (f, m, t, d) {
  return warn(mergeAs, "`mergeAs` is obsolete, just use `concatAs`") || concatAs(f, m, t, d);
};

var merge = exports.merge = "dev" === "production" ? concat : function (m, t, d) {
  return warn(merge, "`merge` is obsolete, just use `concat`") || concat(m, t, d);
};

// Folds over traversals

var all = exports.all = (0, _infestines.pipe2U)(mkFirst(function (x) {
  return x ? void 0 : T;
}), not);

var and = exports.and = all(_infestines.id);

var any = exports.any = (0, _infestines.pipe2U)(mkFirst(function (x) {
  return x ? T : void 0;
}), Boolean);

var collectAs = exports.collectAs = (0, _infestines.curry)(function (xi2y, t, s) {
  return toArray(run(t, Collect, xi2y, s)) || [];
});

var collect = exports.collect = collectAs(_infestines.id);

var firstAs = exports.firstAs = (0, _infestines.curry)(mkFirst(function (x) {
  return void 0 !== x ? the(x) : x;
}));

var first = exports.first = firstAs(_infestines.id);

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

var or = exports.or = any(_infestines.id);

var product = exports.product = concatAs(unto(1), Monoid(function (y, x) {
  return x * y;
}, 1));

var sum = exports.sum = concatAs(unto(0), Monoid(function (y, x) {
  return x + y;
}, 0));

// Creating new traversals

function branch(template) {
  if ("dev" !== "production" && !(0, _infestines.isObject)(template)) errorGiven("`branch` expects a plain Object template", template);
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

function augment(template) {
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

var normalize = exports.normalize = function normalize(xi2x) {
  return function (F, xi2yF, x, i) {
    return (0, F.map)(function (x) {
      return void 0 !== x ? xi2x(x, i) : x;
    }, xi2yF(void 0 !== x ? xi2x(x, i) : x, i));
  };
};

var required = exports.required = function required(inn) {
  return replace(inn, void 0);
};

var rewrite = exports.rewrite = function rewrite(yi2y) {
  return function (F, xi2yF, x, i) {
    return (0, F.map)(function (y) {
      return void 0 !== y ? yi2y(y, i) : y;
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

  function drop(y) {
    if (!(y instanceof Object)) return y;
    for (var i = 0, n = ps.length; i < n; ++i) {
      if ((0, _infestines.hasU)(ps[i], y)) return y;
    }
  }
  return function (F, xi2yF, x, i) {
    return (0, F.map)(drop, xi2yF(x, i));
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
  return warn(to, "`to` is obsolete, you can directly `compose` plain functions with optics") || wi2x;
};

var just = exports.just = "dev" === "production" ? _infestines.always : function (x) {
  return warn(just, "`just` is obsolete, just use e.g. `R.always`") || (0, _infestines.always)(x);
};

// Transforming data

function pick(template) {
  if ("dev" !== "production" && !(0, _infestines.isObject)(template)) errorGiven("`pick` expects a plain Object template", template);
  return function (F, xi2yF, x, i) {
    return (0, F.map)(setPick(template, x), xi2yF(getPick(template, x), i));
  };
}

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvcGFydGlhbC5sZW5zZXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7UUM0Y2dCLFUsR0FBQSxVO1FBMENBLEcsR0FBQSxHO1FBZ0JBLE8sR0FBQSxPO1FBOEJBLEksR0FBQSxJO1FBT0EsSSxHQUFBLEk7UUFRQSxHLEdBQUEsRztRQWtFQSxNLEdBQUEsTTtRQWFBLEssR0FBQSxLO1FBWUEsTSxHQUFBLE07UUFxQkEsTyxHQUFBLE87UUFxQ0EsUSxHQUFBLFE7UUFLQSxNLEdBQUEsTTtRQStDQSxRLEdBQUEsUTtRQTJDQSxLLEdBQUEsSztRQXdDQSxJLEdBQUEsSTs7QUEvMEJoQjs7QUFzQkE7O0FBRUEsSUFBTSxhQUFhLFNBQWIsVUFBYSxDQUFDLENBQUQsRUFBSSxDQUFKLEVBQU8sQ0FBUCxFQUFVLENBQVY7QUFBQSxTQUNqQixLQUFLLENBQUwsS0FBVyxDQUFYLEdBQWUsS0FBSyxHQUFMLENBQVMsS0FBSyxHQUFMLENBQVMsQ0FBVCxFQUFZLElBQUksQ0FBSixHQUFRLElBQUksQ0FBWixHQUFnQixDQUE1QixDQUFULEVBQXlDLENBQXpDLENBQWYsR0FBNkQsQ0FENUM7QUFBQSxDQUFuQjs7QUFHQSxTQUFTLElBQVQsQ0FBYyxFQUFkLEVBQWtCLEVBQWxCLEVBQXNCO0FBQUMsU0FBTyxDQUFDLEVBQUQsRUFBSyxFQUFMLENBQVA7QUFBZ0I7QUFDdkMsSUFBTSxRQUFRLFNBQVIsS0FBUTtBQUFBLFNBQUs7QUFBQSxXQUFNLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBTjtBQUFBLEdBQUw7QUFBQSxDQUFkOztBQUVBLElBQU0sT0FBTyxTQUFQLElBQU87QUFBQSxTQUFLO0FBQUEsV0FBSyxLQUFLLENBQUwsS0FBVyxDQUFYLEdBQWUsQ0FBZixHQUFtQixDQUF4QjtBQUFBLEdBQUw7QUFBQSxDQUFiOztBQUVBLElBQU0saUJBQWlCLFNBQWpCLGNBQWlCO0FB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QUFLUDs7QUFFTyxJQUFNLGtDQUFhLHdCQUFPLENBQVAsRUFBVSxJQUFWLENBQW5COztBQUVQOztBQUVPLElBQU0sb0JBQ1gsdUJBQU0sVUFBQyxHQUFELEVBQU0sR0FBTjtBQUFBLFNBQWMsVUFBQyxDQUFELEVBQUksS0FBSixFQUFXLENBQVgsRUFBYyxDQUFkO0FBQUEsV0FBb0IsQ0FBQyxHQUFFLEVBQUUsR0FBTCxFQUFVLEdBQVYsRUFBZSxNQUFNLElBQUksQ0FBSixDQUFOLEVBQWMsQ0FBZCxDQUFmLENBQXBCO0FBQUEsR0FBZDtBQUFBLENBQU4sQ0FESzs7QUFHUDs7QUFFTyxJQUFNLDhCQUFXLFNBQVgsUUFBVyxDQUFDLEVBQUQsRUFBSyxLQUFMLEVBQVksQ0FBWixFQUFlLENBQWY7QUFBQSxTQUFxQixNQUFNLENBQU4sRUFBUyxDQUFULENBQXJCO0FBQUEsQ0FBakI7O0FBRUEsSUFBTSw0QkFBVSxTQUFWLE9BQVU7QUFBQSxTQUFPLFVBQUMsQ0FBRCxFQUFJLEtBQUosRUFBVyxDQUFYLEVBQWMsQ0FBZDtBQUFBLFdBQzVCLENBQUMsR0FBRSxFQUFFLEdBQUwsRUFBVTtBQUFBLGFBQUssS0FBSyxHQUFMLEVBQVUsQ0FBVixDQUFMO0FBQUEsS0FBVixFQUE2QixNQUFNLEtBQUssR0FBTCxFQUFVLENBQVYsQ0FBTixFQUFvQixDQUFwQixDQUE3QixDQUQ0QjtBQUFBLEdBQVA7QUFBQSxDQUFoQiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQge1xuICBhY3ljbGljRXF1YWxzVSxcbiAgYWx3YXlzLFxuICBhcHBseVUsXG4gIGFyaXR5TixcbiAgYXNzb2NQYXJ0aWFsVSxcbiAgY29uc3RydWN0b3JPZixcbiAgY3VycnksXG4gIGN1cnJ5TixcbiAgZGlzc29jUGFydGlhbFUsXG4gIGhhc1UsXG4gIGlkLFxuICBpc0RlZmluZWQsXG4gIGlzRnVuY3Rpb24sXG4gIGlzT2JqZWN0LFxuICBpc1N0cmluZyxcbiAga2V5cyxcbiAgb2JqZWN0MCxcbiAgcGlwZTJVLFxuICBzbmRVXG59IGZyb20gXCJpbmZlc3RpbmVzXCJcblxuLy9cblxuY29uc3Qgc2xpY2VJbmRleCA9IChtLCBsLCBkLCBpKSA9PlxuICB2b2lkIDAgIT09IGkgPyBNYXRoLm1pbihNYXRoLm1heChtLCBpIDwgMCA/IGwgKyBpIDogaSksIGwpIDogZFxuXG5mdW5jdGlvbiBwYWlyKHgwLCB4MSkge3JldHVybiBbeDAsIHgxXX1cbmNvbnN0IGNwYWlyID0geCA9PiB4cyA9PiBbeCwgeHNdXG5cbmNvbnN0IHVudG8gPSBjID0+IHggPT4gdm9pZCAwICE9PSB4ID8geCA6IGNcblxuY29uc3Qgc2VlbXNBcnJheUxpa2UgPSB4ID0+XG4gIHggaW5zdGFuY2VvZiBPYmplY3QgJiYgKHggPSB4Lmxlbmd0aCwgeCA9PT0gKHggPj4gMCkgJiYgMCA8PSB4KSB8fFxuICBpc1N0cmluZyh4KVxuXG4vL1xuXG5mdW5jdGlvbiBtYXBQYXJ0aWFsSW5kZXhVKHhpMnksIHhzKSB7XG4gIGNvbnN0IG4gPSB4cy5sZW5ndGgsIHlzID0gQXJyYXkobilcbiAgbGV0IGogPSAwXG4gIGZvciAobGV0IGk9MCwgeTsgaTxuOyArK2kpXG4gICAgaWYgKHZvaWQgMCAhPT0gKHkgPSB4aTJ5KHhzW2ldLCBpKSkpXG4gICAgICB5c1tqKytdID0geVxuICBpZiAoaikge1xuICAgIGlmIChqIDwgbilcbiAgICAgIHlzLmxlbmd0aCA9IGpcbiAgICByZXR1cm4geXNcbiAgfVxufVxuXG5mdW5jdGlvbiBjb3B5VG9Gcm9tKHlzLCBrLCB4cywgaSwgaikge1xuICB3aGlsZSAoaSA8IGopXG4gICAgeXNbaysrXSA9IHhzW2krK11cbiAgcmV0dXJuIHlzXG59XG5cbi8vXG5cbmNvbnN0IElkZW50ID0ge21hcDogYXBwbHlVLCBvZjogaWQsIGFwOiBhcHBseVUsIGNoYWluOiBhcHBseVV9XG5cbmNvbnN0IENvbnN0ID0ge21hcDogc25kVX1cblxuZnVuY3Rpb24gQ29uY2F0T2YoYXAsIGVtcHR5LCBkZWxheSkge1xuICBjb25zdCBjID0ge21hcDogc25kVSwgYXAsIG9mOiBhbHdheXMoZW1wdHkpfVxuICBpZiAoZGVsYXkpXG4gICAgYy5kZWxheSA9IGRlbGF5XG4gIHJldHVybiBjXG59XG5cbmNvbnN0IE1vbm9pZCA9IChjb25jYXQsIGVtcHR5KSA9PiAoe2NvbmNhdCwgZW1wdHk6ICgpID0+IGVtcHR5fSlcblxuY29uc3QgTXVtID0gb3JkID0+XG4gIE1vbm9pZCgoeSwgeCkgPT4gdm9pZCAwICE9PSB4ICYmICh2b2lkIDAgPT09IHkgfHwgb3JkKHgsIHkpKSA/IHggOiB5KVxuXG4vL1xuXG5jb25zdCBydW4gPSAobywgQywgeGkyeUMsIHMsIGkpID0+IHRvRnVuY3Rpb24obykoQywgeGkyeUMsIHMsIGkpXG5cbi8vXG5cbmNvbnN0IGV4cGVjdGVkT3B0aWMgPSBcIkV4cGVjdGluZyBhbiBvcHRpY1wiXG5jb25zdCBoZWFkZXIgPSBcInBhcnRpYWwubGVuc2VzOiBcIlxuXG5mdW5jdGlvbiB3YXJuKGYsIG0pIHtcbiAgaWYgKCFmLndhcm5lZCkge1xuICAgIGYud2FybmVkID0gMVxuICAgIGNvbnNvbGUud2FybihoZWFkZXIgKyBtKVxuICB9XG59XG5cbmZ1bmN0aW9uIGVycm9yR2l2ZW4obSwgbykge1xuICBjb25zb2xlLmVycm9yKGhlYWRlciArIG0gKyBcIiAtIGdpdmVuOlwiLCBvKVxuICB0aHJvdyBuZXcgRXJyb3IobSlcbn1cblxuZnVuY3Rpb24gcmVxRnVuY3Rpb24obykge1xuICBpZiAoIShpc0Z1bmN0aW9uKG8pICYmIChvLmxlbmd0aCA9PT0gNCB8fCBvLmxlbmd0aCA8PSAyKSkpXG4gICAgZXJyb3JHaXZlbihleHBlY3RlZE9wdGljLCBvKVxufVxuXG5mdW5jdGlvbiByZXFBcnJheShvKSB7XG4gIGlmICghQXJyYXkuaXNBcnJheShvKSlcbiAgICBlcnJvckdpdmVuKGV4cGVjdGVkT3B0aWMsIG8pXG59XG5cbi8vXG5cbmZ1bmN0aW9uIHJlcUFwcGxpY2F0aXZlKGYpIHtcbiAgaWYgKCFmLm9mKVxuICAgIGVycm9yR2l2ZW4oXCJUcmF2ZXJzYWxzIHJlcXVpcmUgYW4gYXBwbGljYXRpdmVcIiwgZilcbn1cblxuLy9cblxuZnVuY3Rpb24gSm9pbihsLCByKSB7dGhpcy5sID0gbDsgdGhpcy5yID0gcn1cblxuY29uc3QgaXNKb2luID0gbiA9PiBuLmNvbnN0cnVjdG9yID09PSBKb2luXG5cbmNvbnN0IGpvaW4gPSAobCwgcikgPT4gdm9pZCAwICE9PSBsID8gdm9pZCAwICE9PSByID8gbmV3IEpvaW4obCwgcikgOiBsIDogclxuXG5jb25zdCBjam9pbiA9IGggPT4gdCA9PiBqb2luKGgsIHQpXG5cbmZ1bmN0aW9uIHB1c2hUbyhuLCB5cykge1xuICB3aGlsZSAobiAmJiBpc0pvaW4obikpIHtcbiAgICBjb25zdCBsID0gbi5sXG4gICAgbiA9IG4uclxuICAgIGlmIChsICYmIGlzSm9pbihsKSkge1xuICAgICAgcHVzaFRvKGwubCwgeXMpXG4gICAgICBwdXNoVG8obC5yLCB5cylcbiAgICB9IGVsc2Uge1xuICAgICAgeXMucHVzaChsKVxuICAgIH1cbiAgfVxuICB5cy5wdXNoKG4pXG59XG5cbmZ1bmN0aW9uIHRvQXJyYXkobikge1xuICBpZiAodm9pZCAwICE9PSBuKSB7XG4gICAgY29uc3QgeXMgPSBbXVxuICAgIHB1c2hUbyhuLCB5cylcbiAgICByZXR1cm4geXNcbiAgfVxufVxuXG5mdW5jdGlvbiBmb2xkUmVjKGYsIHIsIG4pIHtcbiAgd2hpbGUgKGlzSm9pbihuKSkge1xuICAgIGNvbnN0IGwgPSBuLmxcbiAgICBuID0gbi5yXG4gICAgciA9IGlzSm9pbihsKVxuICAgICAgPyBmb2xkUmVjKGYsIGZvbGRSZWMoZiwgciwgbC5sKSwgbC5yKVxuICAgICAgOiBmKHIsIGxbMF0sIGxbMV0pXG4gIH1cbiAgcmV0dXJuIGYociwgblswXSwgblsxXSlcbn1cblxuY29uc3QgZm9sZCA9IChmLCByLCBuKSA9PiB2b2lkIDAgIT09IG4gPyBmb2xkUmVjKGYsIHIsIG4pIDogclxuXG5jb25zdCBDb2xsZWN0ID0gQ29uY2F0T2Yoam9pbilcblxuLy9cblxuZnVuY3Rpb24gdGhlKHYpIHtcbiAgZnVuY3Rpb24gcmVzdWx0KCkge3JldHVybiByZXN1bHR9XG4gIHJlc3VsdC52ID0gdlxuICByZXR1cm4gcmVzdWx0XG59XG5cbmNvbnN0IFQgPSB0aGUodHJ1ZSlcbmNvbnN0IG5vdCA9IHggPT4gIXhcblxuY29uc3QgRmlyc3QgPSBDb25jYXRPZigobCwgcikgPT4gbCAmJiBsKCkgfHwgciAmJiByKCksIHZvaWQgMCwgaWQpXG5cbmNvbnN0IG1rRmlyc3QgPSB0b00gPT4gKHhpMnlNLCB0LCBzKSA9PiB7XG4gIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpXG4gICAgd2Fybihta0ZpcnN0LCBcIkxhenkgZm9sZHMgb3ZlciB0cmF2ZXJzYWxzIGFyZSBleHBlcmltZW50YWxcIilcbiAgcmV0dXJuIChzID0gcnVuKHQsIEZpcnN0LCBwaXBlMlUoeGkyeU0sIHRvTSksIHMpLFxuICAgICAgICAgIHMgJiYgKHMgPSBzKCkpICYmIHMudilcbn1cblxuLy9cblxuY29uc3QgdHJhdmVyc2VQYXJ0aWFsSW5kZXhMYXp5ID0gKG1hcCwgYXAsIHosIGRlbGF5LCB4aTJ5QSwgeHMsIGksIG4pID0+XG4gIGkgPCBuXG4gID8gYXAobWFwKGNqb2luLCB4aTJ5QSh4c1tpXSwgaSkpLCBkZWxheSgoKSA9PlxuICAgICAgIHRyYXZlcnNlUGFydGlhbEluZGV4TGF6eShtYXAsIGFwLCB6LCBkZWxheSwgeGkyeUEsIHhzLCBpKzEsIG4pKSlcbiAgOiB6XG5cbmZ1bmN0aW9uIHRyYXZlcnNlUGFydGlhbEluZGV4KEEsIHhpMnlBLCB4cykge1xuICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKVxuICAgIHJlcUFwcGxpY2F0aXZlKEEpXG4gIGNvbnN0IHttYXAsIGFwLCBvZiwgZGVsYXl9ID0gQVxuICBsZXQgeHNBID0gb2Yodm9pZCAwKSxcbiAgICAgIGkgPSB4cy5sZW5ndGhcbiAgaWYgKGRlbGF5KVxuICAgIHhzQSA9IHRyYXZlcnNlUGFydGlhbEluZGV4TGF6eShtYXAsIGFwLCB4c0EsIGRlbGF5LCB4aTJ5QSwgeHMsIDAsIGkpXG4gIGVsc2VcbiAgICB3aGlsZSAoaS0tKVxuICAgICAgeHNBID0gYXAobWFwKGNqb2luLCB4aTJ5QSh4c1tpXSwgaSkpLCB4c0EpXG4gIHJldHVybiBtYXAodG9BcnJheSwgeHNBKVxufVxuXG4vL1xuXG5mdW5jdGlvbiBvYmplY3QwVG9VbmRlZmluZWQobykge1xuICBpZiAoIShvIGluc3RhbmNlb2YgT2JqZWN0KSlcbiAgICByZXR1cm4gb1xuICBmb3IgKGNvbnN0IGsgaW4gbylcbiAgICByZXR1cm4gb1xufVxuXG4vL1xuXG5jb25zdCBsZW5zRnJvbSA9IChnZXQsIHNldCkgPT4gaSA9PiAoRiwgeGkyeUYsIHgsIF8pID0+XG4gICgwLEYubWFwKSh2ID0+IHNldChpLCB2LCB4KSwgeGkyeUYoZ2V0KGksIHgpLCBpKSlcblxuLy9cblxuY29uc3QgZ2V0UHJvcCA9IChrLCBvKSA9PiBvIGluc3RhbmNlb2YgT2JqZWN0ID8gb1trXSA6IHZvaWQgMFxuXG5jb25zdCBzZXRQcm9wID0gKGssIHYsIG8pID0+XG4gIHZvaWQgMCAhPT0gdiA/IGFzc29jUGFydGlhbFUoaywgdiwgbykgOiBkaXNzb2NQYXJ0aWFsVShrLCBvKVxuXG5jb25zdCBmdW5Qcm9wID0gbGVuc0Zyb20oZ2V0UHJvcCwgc2V0UHJvcClcblxuLy9cblxuY29uc3QgZ2V0SW5kZXggPSAoaSwgeHMpID0+IHNlZW1zQXJyYXlMaWtlKHhzKSA/IHhzW2ldIDogdm9pZCAwXG5cbmZ1bmN0aW9uIHNldEluZGV4KGksIHgsIHhzKSB7XG4gIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIgJiYgaSA8IDApXG4gICAgZXJyb3JHaXZlbihcIk5lZ2F0aXZlIGluZGljZXMgYXJlIG5vdCBzdXBwb3J0ZWQgYnkgYGluZGV4YFwiLCBpKVxuICBpZiAoIXNlZW1zQXJyYXlMaWtlKHhzKSlcbiAgICB4cyA9IFwiXCJcbiAgY29uc3QgbiA9IHhzLmxlbmd0aFxuICBpZiAodm9pZCAwICE9PSB4KSB7XG4gICAgY29uc3QgbSA9IE1hdGgubWF4KGkrMSwgbiksIHlzID0gQXJyYXkobSlcbiAgICBmb3IgKGxldCBqPTA7IGo8bTsgKytqKVxuICAgICAgeXNbal0gPSB4c1tqXVxuICAgIHlzW2ldID0geFxuICAgIHJldHVybiB5c1xuICB9IGVsc2Uge1xuICAgIGlmICgwIDwgbikge1xuICAgICAgaWYgKG4gPD0gaSlcbiAgICAgICAgcmV0dXJuIGNvcHlUb0Zyb20oQXJyYXkobiksIDAsIHhzLCAwLCBuKVxuICAgICAgaWYgKDEgPCBuKSB7XG4gICAgICAgIGNvbnN0IHlzID0gQXJyYXkobi0xKVxuICAgICAgICBmb3IgKGxldCBqPTA7IGo8aTsgKytqKVxuICAgICAgICAgIHlzW2pdID0geHNbal1cbiAgICAgICAgZm9yIChsZXQgaj1pKzE7IGo8bjsgKytqKVxuICAgICAgICAgIHlzW2otMV0gPSB4c1tqXVxuICAgICAgICByZXR1cm4geXNcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuY29uc3QgZnVuSW5kZXggPSBsZW5zRnJvbShnZXRJbmRleCwgc2V0SW5kZXgpXG5cbi8vXG5cbmNvbnN0IGNsb3NlID0gKG8sIEYsIHhpMnlGKSA9PiAoeCwgaSkgPT4gbyhGLCB4aTJ5RiwgeCwgaSlcblxuZnVuY3Rpb24gY29tcG9zZWQob2kwLCBvcykge1xuICBjb25zdCBuID0gb3MubGVuZ3RoIC0gb2kwXG4gIGxldCBmc1xuICBpZiAobiA8IDIpIHtcbiAgICByZXR1cm4gbiA/IHRvRnVuY3Rpb24ob3Nbb2kwXSkgOiBpZGVudGl0eVxuICB9IGVsc2Uge1xuICAgIGZzID0gQXJyYXkobilcbiAgICBmb3IgKGxldCBpPTA7aTxuOysraSlcbiAgICAgIGZzW2ldID0gdG9GdW5jdGlvbihvc1tpK29pMF0pXG4gICAgcmV0dXJuIChGLCB4aTJ5RiwgeCwgaSkgPT4ge1xuICAgICAgbGV0IGs9blxuICAgICAgd2hpbGUgKC0taylcbiAgICAgICAgeGkyeUYgPSBjbG9zZShmc1trXSwgRiwgeGkyeUYpXG4gICAgICByZXR1cm4gZnNbMF0oRiwgeGkyeUYsIHgsIGkpXG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIHNldFUobywgeCwgcykge1xuICBzd2l0Y2ggKHR5cGVvZiBvKSB7XG4gICAgY2FzZSBcInN0cmluZ1wiOlxuICAgICAgcmV0dXJuIHNldFByb3AobywgeCwgcylcbiAgICBjYXNlIFwibnVtYmVyXCI6XG4gICAgICByZXR1cm4gc2V0SW5kZXgobywgeCwgcylcbiAgICBjYXNlIFwib2JqZWN0XCI6XG4gICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKVxuICAgICAgICByZXFBcnJheShvKVxuICAgICAgcmV0dXJuIG1vZGlmeUNvbXBvc2VkKG8sIDAsIHMsIHgpXG4gICAgZGVmYXVsdDpcbiAgICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpXG4gICAgICAgIHJlcUZ1bmN0aW9uKG8pXG4gICAgICByZXR1cm4gby5sZW5ndGggPT09IDQgPyBvKElkZW50LCBhbHdheXMoeCksIHMsIHZvaWQgMCkgOiBzXG4gIH1cbn1cblxuZnVuY3Rpb24gZ2V0VShsLCBzKSB7XG4gIHN3aXRjaCAodHlwZW9mIGwpIHtcbiAgICBjYXNlIFwic3RyaW5nXCI6XG4gICAgICByZXR1cm4gZ2V0UHJvcChsLCBzKVxuICAgIGNhc2UgXCJudW1iZXJcIjpcbiAgICAgIHJldHVybiBnZXRJbmRleChsLCBzKVxuICAgIGNhc2UgXCJvYmplY3RcIjpcbiAgICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpXG4gICAgICAgIHJlcUFycmF5KGwpXG4gICAgICBmb3IgKGxldCBpPTAsIG49bC5sZW5ndGgsIG87IGk8bjsgKytpKVxuICAgICAgICBzd2l0Y2ggKHR5cGVvZiAobyA9IGxbaV0pKSB7XG4gICAgICAgICAgY2FzZSBcInN0cmluZ1wiOiBzID0gZ2V0UHJvcChvLCBzKTsgYnJlYWtcbiAgICAgICAgICBjYXNlIFwibnVtYmVyXCI6IHMgPSBnZXRJbmRleChvLCBzKTsgYnJlYWtcbiAgICAgICAgICBkZWZhdWx0OiByZXR1cm4gY29tcG9zZWQoaSwgbCkoQ29uc3QsIGlkLCBzLCBsW2ktMV0pXG4gICAgICAgIH1cbiAgICAgIHJldHVybiBzXG4gICAgZGVmYXVsdDpcbiAgICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpXG4gICAgICAgIHJlcUZ1bmN0aW9uKGwpXG4gICAgICByZXR1cm4gbC5sZW5ndGggPT09IDQgPyBsKENvbnN0LCBpZCwgcywgdm9pZCAwKSA6IGwocywgdm9pZCAwKVxuICB9XG59XG5cbmZ1bmN0aW9uIG1vZGlmeUNvbXBvc2VkKG9zLCB4aTJ5LCB4LCB5KSB7XG4gIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpXG4gICAgcmVxQXJyYXkob3MpXG4gIGxldCBuID0gb3MubGVuZ3RoXG4gIGNvbnN0IHhzID0gQXJyYXkobilcbiAgZm9yIChsZXQgaT0wLCBvOyBpPG47ICsraSkge1xuICAgIHhzW2ldID0geFxuICAgIHN3aXRjaCAodHlwZW9mIChvID0gb3NbaV0pKSB7XG4gICAgICBjYXNlIFwic3RyaW5nXCI6XG4gICAgICAgIHggPSBnZXRQcm9wKG8sIHgpXG4gICAgICAgIGJyZWFrXG4gICAgICBjYXNlIFwibnVtYmVyXCI6XG4gICAgICAgIHggPSBnZXRJbmRleChvLCB4KVxuICAgICAgICBicmVha1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgeCA9IGNvbXBvc2VkKGksIG9zKShJZGVudCwgeGkyeSB8fCBhbHdheXMoeSksIHgsIG9zW2ktMV0pXG4gICAgICAgIG4gPSBpXG4gICAgICAgIGJyZWFrXG4gICAgfVxuICB9XG4gIGlmIChuID09PSBvcy5sZW5ndGgpXG4gICAgeCA9IHhpMnkgPyB4aTJ5KHgsIG9zW24tMV0pIDogeVxuICBmb3IgKGxldCBvOyAwIDw9IC0tbjspXG4gICAgeCA9IGlzU3RyaW5nKG8gPSBvc1tuXSlcbiAgICAgICAgPyBzZXRQcm9wKG8sIHgsIHhzW25dKVxuICAgICAgICA6IHNldEluZGV4KG8sIHgsIHhzW25dKVxuICByZXR1cm4geFxufVxuXG4vL1xuXG5mdW5jdGlvbiBnZXRQaWNrKHRlbXBsYXRlLCB4KSB7XG4gIGxldCByXG4gIGZvciAoY29uc3QgayBpbiB0ZW1wbGF0ZSkge1xuICAgIGNvbnN0IHYgPSBnZXRVKHRlbXBsYXRlW2tdLCB4KVxuICAgIGlmICh2b2lkIDAgIT09IHYpIHtcbiAgICAgIGlmICghcilcbiAgICAgICAgciA9IHt9XG4gICAgICByW2tdID0gdlxuICAgIH1cbiAgfVxuICByZXR1cm4gclxufVxuXG5jb25zdCBzZXRQaWNrID0gKHRlbXBsYXRlLCB4KSA9PiB2YWx1ZSA9PiB7XG4gIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIgJiZcbiAgICAgICEodm9pZCAwID09PSB2YWx1ZSB8fCB2YWx1ZSBpbnN0YW5jZW9mIE9iamVjdCkpXG4gICAgZXJyb3JHaXZlbihcImBwaWNrYCBtdXN0IGJlIHNldCB3aXRoIHVuZGVmaW5lZCBvciBhbiBvYmplY3RcIiwgdmFsdWUpXG4gIGZvciAoY29uc3QgayBpbiB0ZW1wbGF0ZSlcbiAgICB4ID0gc2V0VSh0ZW1wbGF0ZVtrXSwgdmFsdWUgJiYgdmFsdWVba10sIHgpXG4gIHJldHVybiB4XG59XG5cbi8vXG5cbmNvbnN0IHRvT2JqZWN0ID0geCA9PiBjb25zdHJ1Y3Rvck9mKHgpICE9PSBPYmplY3QgPyBPYmplY3QuYXNzaWduKHt9LCB4KSA6IHhcblxuLy9cblxuY29uc3QgYnJhbmNoT25NZXJnZSA9ICh4LCBrZXlzKSA9PiB4cyA9PiB7XG4gIGNvbnN0IG8gPSB7fSwgbiA9IGtleXMubGVuZ3RoXG4gIGZvciAobGV0IGk9MDsgaTxuOyArK2ksIHhzPXhzWzFdKSB7XG4gICAgY29uc3QgdiA9IHhzWzBdXG4gICAgb1trZXlzW2ldXSA9IHZvaWQgMCAhPT0gdiA/IHYgOiBvXG4gIH1cbiAgbGV0IHJcbiAgeCA9IHRvT2JqZWN0KHgpXG4gIGZvciAoY29uc3QgayBpbiB4KSB7XG4gICAgY29uc3QgdiA9IG9ba11cbiAgICBpZiAobyAhPT0gdikge1xuICAgICAgb1trXSA9IG9cbiAgICAgIGlmICghcilcbiAgICAgICAgciA9IHt9XG4gICAgICByW2tdID0gdm9pZCAwICE9PSB2ID8gdiA6IHhba11cbiAgICB9XG4gIH1cbiAgZm9yIChsZXQgaT0wOyBpPG47ICsraSkge1xuICAgIGNvbnN0IGsgPSBrZXlzW2ldXG4gICAgY29uc3QgdiA9IG9ba11cbiAgICBpZiAobyAhPT0gdikge1xuICAgICAgaWYgKCFyKVxuICAgICAgICByID0ge31cbiAgICAgIHJba10gPSB2XG4gICAgfVxuICB9XG4gIHJldHVybiByXG59XG5cbmZ1bmN0aW9uIGJyYW5jaE9uTGF6eShrZXlzLCB2YWxzLCBtYXAsIGFwLCB6LCBkZWxheSwgQSwgeGkyeUEsIHgsIGkpIHtcbiAgaWYgKGkgPCBrZXlzLmxlbmd0aCkge1xuICAgIGNvbnN0IGsgPSBrZXlzW2ldLCB2ID0geFtrXVxuICAgIHJldHVybiBhcChtYXAoY3BhaXIsXG4gICAgICAgICAgICAgICAgICB2YWxzID8gdmFsc1tpXShBLCB4aTJ5QSwgeFtrXSwgaykgOiB4aTJ5QSh2LCBrKSksIGRlbGF5KCgpID0+XG4gICAgICAgICAgICAgIGJyYW5jaE9uTGF6eShrZXlzLCB2YWxzLCBtYXAsIGFwLCB6LCBkZWxheSwgQSwgeGkyeUEsIHgsIGkrMSkpKVxuICB9IGVsc2Uge1xuICAgIHJldHVybiB6XG4gIH1cbn1cblxuY29uc3QgYnJhbmNoT24gPSAoa2V5cywgdmFscykgPT4gKEEsIHhpMnlBLCB4LCBfKSA9PiB7XG4gIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpXG4gICAgcmVxQXBwbGljYXRpdmUoQSlcbiAgY29uc3Qge21hcCwgYXAsIG9mLCBkZWxheX0gPSBBXG4gIGxldCBpID0ga2V5cy5sZW5ndGhcbiAgaWYgKCFpKVxuICAgIHJldHVybiBvZihvYmplY3QwVG9VbmRlZmluZWQoeCkpXG4gIGlmICghKHggaW5zdGFuY2VvZiBPYmplY3QpKVxuICAgIHggPSBvYmplY3QwXG4gIGxldCB4c0EgPSBvZigwKVxuICBpZiAoZGVsYXkpIHtcbiAgICB4c0EgPSBicmFuY2hPbkxhenkoa2V5cywgdmFscywgbWFwLCBhcCwgeHNBLCBkZWxheSwgQSwgeGkyeUEsIHgsIDApXG4gIH0gZWxzZSB7XG4gICAgd2hpbGUgKGktLSkge1xuICAgICAgY29uc3QgayA9IGtleXNbaV0sIHYgPSB4W2tdXG4gICAgICB4c0EgPSBhcChtYXAoY3BhaXIsIHZhbHMgPyB2YWxzW2ldKEEsIHhpMnlBLCB2LCBrKSA6IHhpMnlBKHYsIGspKSwgeHNBKVxuICAgIH1cbiAgfVxuICByZXR1cm4gbWFwKGJyYW5jaE9uTWVyZ2UoeCwga2V5cyksIHhzQSlcbn1cblxuY29uc3QgcmVwbGFjZWQgPSAoaW5uLCBvdXQsIHgpID0+IGFjeWNsaWNFcXVhbHNVKHgsIGlubikgPyBvdXQgOiB4XG5cbmZ1bmN0aW9uIGZpbmRJbmRleCh4aTJiLCB4cykge1xuICBmb3IgKGxldCBpPTAsIG49eHMubGVuZ3RoOyBpPG47ICsraSlcbiAgICBpZiAoeGkyYih4c1tpXSwgaSkpXG4gICAgICByZXR1cm4gaVxuICByZXR1cm4gLTFcbn1cblxuZnVuY3Rpb24gcGFydGl0aW9uSW50b0luZGV4KHhpMmIsIHhzLCB0cywgZnMpIHtcbiAgZm9yIChsZXQgaT0wLCBuPXhzLmxlbmd0aCwgeDsgaTxuOyArK2kpXG4gICAgKHhpMmIoeCA9IHhzW2ldLCBpKSA/IHRzIDogZnMpLnB1c2goeClcbn1cblxuY29uc3QgZnJvbVJlYWRlciA9IHdpMnggPT4gKEYsIHhpMnlGLCB3LCBpKSA9PlxuICAoMCxGLm1hcCkoYWx3YXlzKHcpLCB4aTJ5Rih3aTJ4KHcsIGkpLCBpKSlcblxuLy9cblxuZXhwb3J0IGZ1bmN0aW9uIHRvRnVuY3Rpb24obykge1xuICBzd2l0Y2ggKHR5cGVvZiBvKSB7XG4gICAgY2FzZSBcInN0cmluZ1wiOlxuICAgICAgcmV0dXJuIGZ1blByb3AobylcbiAgICBjYXNlIFwibnVtYmVyXCI6XG4gICAgICByZXR1cm4gZnVuSW5kZXgobylcbiAgICBjYXNlIFwib2JqZWN0XCI6XG4gICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKVxuICAgICAgICByZXFBcnJheShvKVxuICAgICAgcmV0dXJuIGNvbXBvc2VkKDAsIG8pXG4gICAgZGVmYXVsdDpcbiAgICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpXG4gICAgICAgIHJlcUZ1bmN0aW9uKG8pXG4gICAgICByZXR1cm4gby5sZW5ndGggPT09IDQgPyBvIDogZnJvbVJlYWRlcihvKVxuICB9XG59XG5cbi8vIE9wZXJhdGlvbnMgb24gb3B0aWNzXG5cbmV4cG9ydCBjb25zdCBtb2RpZnkgPSBjdXJyeSgobywgeGkyeCwgcykgPT4ge1xuICBzd2l0Y2ggKHR5cGVvZiBvKSB7XG4gICAgY2FzZSBcInN0cmluZ1wiOlxuICAgICAgcmV0dXJuIHNldFByb3AobywgeGkyeChnZXRQcm9wKG8sIHMpLCBvKSwgcylcbiAgICBjYXNlIFwibnVtYmVyXCI6XG4gICAgICByZXR1cm4gc2V0SW5kZXgobywgeGkyeChnZXRJbmRleChvLCBzKSwgbyksIHMpXG4gICAgY2FzZSBcIm9iamVjdFwiOlxuICAgICAgcmV0dXJuIG1vZGlmeUNvbXBvc2VkKG8sIHhpMngsIHMpXG4gICAgZGVmYXVsdDpcbiAgICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpXG4gICAgICAgIHJlcUZ1bmN0aW9uKG8pXG4gICAgICByZXR1cm4gby5sZW5ndGggPT09IDRcbiAgICAgICAgPyBvKElkZW50LCB4aTJ4LCBzLCB2b2lkIDApXG4gICAgICAgIDogKHhpMngobyhzLCB2b2lkIDApLCB2b2lkIDApLCBzKVxuICB9XG59KVxuXG5leHBvcnQgY29uc3QgcmVtb3ZlID0gY3VycnkoKG8sIHMpID0+IHNldFUobywgdm9pZCAwLCBzKSlcblxuZXhwb3J0IGNvbnN0IHNldCA9IGN1cnJ5KHNldFUpXG5cbi8vIFNlcXVlbmNpbmdcblxuZXhwb3J0IGZ1bmN0aW9uIHNlcSgpIHtcbiAgY29uc3QgbiA9IGFyZ3VtZW50cy5sZW5ndGgsIHhNcyA9IEFycmF5KG4pXG4gIGZvciAobGV0IGk9MDsgaTxuOyArK2kpXG4gICAgeE1zW2ldID0gdG9GdW5jdGlvbihhcmd1bWVudHNbaV0pXG4gIGNvbnN0IGxvb3AgPSAoTSwgeGkyeE0sIGksIGopID0+IGogPT09IG5cbiAgICA/IE0ub2ZcbiAgICA6IHggPT4gKDAsTS5jaGFpbikobG9vcChNLCB4aTJ4TSwgaSwgaisxKSwgeE1zW2pdKE0sIHhpMnhNLCB4LCBpKSlcbiAgcmV0dXJuIChNLCB4aTJ4TSwgeCwgaSkgPT4ge1xuICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIgJiYgIU0uY2hhaW4pXG4gICAgICBlcnJvckdpdmVuKFwiYHNlcWAgcmVxdWlyZXMgYSBtb25hZFwiLCBNKVxuICAgIHJldHVybiBsb29wKE0sIHhpMnhNLCBpLCAwKSh4KVxuICB9XG59XG5cbi8vIE5lc3RpbmdcblxuZXhwb3J0IGZ1bmN0aW9uIGNvbXBvc2UoKSB7XG4gIGxldCBuID0gYXJndW1lbnRzLmxlbmd0aFxuICBpZiAobiA8IDIpIHtcbiAgICByZXR1cm4gbiA/IGFyZ3VtZW50c1swXSA6IGlkZW50aXR5XG4gIH0gZWxzZSB7XG4gICAgY29uc3QgbGVuc2VzID0gQXJyYXkobilcbiAgICB3aGlsZSAobi0tKVxuICAgICAgbGVuc2VzW25dID0gYXJndW1lbnRzW25dXG4gICAgcmV0dXJuIGxlbnNlc1xuICB9XG59XG5cbi8vIFF1ZXJ5aW5nXG5cbmV4cG9ydCBjb25zdCBjaGFpbiA9IGN1cnJ5KCh4aTJ5TywgeE8pID0+XG4gIFt4TywgY2hvb3NlKCh4TSwgaSkgPT4gdm9pZCAwICE9PSB4TSA/IHhpMnlPKHhNLCBpKSA6IHplcm8pXSlcblxuZXhwb3J0IGNvbnN0IGNob2ljZSA9ICguLi5scykgPT4gY2hvb3NlKHggPT4ge1xuICBjb25zdCBpID0gZmluZEluZGV4KGwgPT4gdm9pZCAwICE9PSBnZXRVKGwsIHgpLCBscylcbiAgcmV0dXJuIGkgPCAwID8gemVybyA6IGxzW2ldXG59KVxuXG5leHBvcnQgY29uc3QgY2hvb3NlID0geGlNMm8gPT4gKEMsIHhpMnlDLCB4LCBpKSA9PlxuICBydW4oeGlNMm8oeCwgaSksIEMsIHhpMnlDLCB4LCBpKVxuXG5leHBvcnQgY29uc3Qgd2hlbiA9IHAgPT4gKEMsIHhpMnlDLCB4LCBpKSA9PlxuICBwKHgsIGkpID8geGkyeUMoeCwgaSkgOiB6ZXJvKEMsIHhpMnlDLCB4LCBpKVxuXG5leHBvcnQgY29uc3Qgb3B0aW9uYWwgPSB3aGVuKGlzRGVmaW5lZClcblxuZXhwb3J0IGZ1bmN0aW9uIHplcm8oQywgeGkyeUMsIHgsIGkpIHtcbiAgY29uc3Qgb2YgPSBDLm9mXG4gIHJldHVybiBvZiA/IG9mKHgpIDogKDAsQy5tYXApKGFsd2F5cyh4KSwgeGkyeUModm9pZCAwLCBpKSlcbn1cblxuLy8gUmVjdXJzaW5nXG5cbmV4cG9ydCBmdW5jdGlvbiBsYXp5KG8ybykge1xuICBsZXQgbWVtbyA9IChDLCB4aTJ5QywgeCwgaSkgPT4gKG1lbW8gPSB0b0Z1bmN0aW9uKG8ybyhyZWMpKSkoQywgeGkyeUMsIHgsIGkpXG4gIGZ1bmN0aW9uIHJlYyhDLCB4aTJ5QywgeCwgaSkge3JldHVybiBtZW1vKEMsIHhpMnlDLCB4LCBpKX1cbiAgcmV0dXJuIHJlY1xufVxuXG4vLyBEZWJ1Z2dpbmdcblxuZXhwb3J0IGZ1bmN0aW9uIGxvZygpIHtcbiAgY29uc3Qgc2hvdyA9IGN1cnJ5KChkaXIsIHgpID0+XG4gICAgY29uc29sZS5sb2cuYXBwbHkoY29uc29sZSxcbiAgICAgICAgICAgICAgICAgICAgICBjb3B5VG9Gcm9tKFtdLCAwLCBhcmd1bWVudHMsIDAsIGFyZ3VtZW50cy5sZW5ndGgpXG4gICAgICAgICAgICAgICAgICAgICAgLmNvbmNhdChbZGlyLCB4XSkpIHx8IHgpXG4gIHJldHVybiBpc28oc2hvdyhcImdldFwiKSwgc2hvdyhcInNldFwiKSlcbn1cblxuLy8gT3BlcmF0aW9ucyBvbiB0cmF2ZXJzYWxzXG5cbmV4cG9ydCBjb25zdCBjb25jYXRBcyA9IGN1cnJ5Tig0LCAoeE1pMnksIG0pID0+IHtcbiAgY29uc3QgQyA9IENvbmNhdE9mKG0uY29uY2F0LCAoMCxtLmVtcHR5KSgpLCBtLmRlbGF5KVxuICByZXR1cm4gKHQsIHMpID0+IHJ1bih0LCBDLCB4TWkyeSwgcylcbn0pXG5cbmV4cG9ydCBjb25zdCBjb25jYXQgPSBjb25jYXRBcyhpZClcblxuZXhwb3J0IGNvbnN0IG1lcmdlQXMgPSBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gXCJwcm9kdWN0aW9uXCIgPyBjb25jYXRBcyA6IChmLCBtLCB0LCBkKSA9PlxuICB3YXJuKG1lcmdlQXMsIFwiYG1lcmdlQXNgIGlzIG9ic29sZXRlLCBqdXN0IHVzZSBgY29uY2F0QXNgXCIpIHx8XG4gIGNvbmNhdEFzKGYsIG0sIHQsIGQpXG5cbmV4cG9ydCBjb25zdCBtZXJnZSA9IHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSBcInByb2R1Y3Rpb25cIiA/IGNvbmNhdCA6IChtLCB0LCBkKSA9PlxuICB3YXJuKG1lcmdlLCBcImBtZXJnZWAgaXMgb2Jzb2xldGUsIGp1c3QgdXNlIGBjb25jYXRgXCIpIHx8XG4gIGNvbmNhdChtLCB0LCBkKVxuXG4vLyBGb2xkcyBvdmVyIHRyYXZlcnNhbHNcblxuZXhwb3J0IGNvbnN0IGFsbCA9IHBpcGUyVShta0ZpcnN0KHggPT4geCA/IHZvaWQgMCA6IFQpLCBub3QpXG5cbmV4cG9ydCBjb25zdCBhbmQgPSBhbGwoaWQpXG5cbmV4cG9ydCBjb25zdCBhbnkgPSBwaXBlMlUobWtGaXJzdCh4ID0+IHggPyBUIDogdm9pZCAwKSwgQm9vbGVhbilcblxuZXhwb3J0IGNvbnN0IGNvbGxlY3RBcyA9IGN1cnJ5KCh4aTJ5LCB0LCBzKSA9PlxuICB0b0FycmF5KHJ1bih0LCBDb2xsZWN0LCB4aTJ5LCBzKSkgfHwgW10pXG5cbmV4cG9ydCBjb25zdCBjb2xsZWN0ID0gY29sbGVjdEFzKGlkKVxuXG5leHBvcnQgY29uc3QgZmlyc3RBcyA9IGN1cnJ5KG1rRmlyc3QoeCA9PiB2b2lkIDAgIT09IHggPyB0aGUoeCkgOiB4KSlcblxuZXhwb3J0IGNvbnN0IGZpcnN0ID0gZmlyc3RBcyhpZClcblxuZXhwb3J0IGNvbnN0IGZvbGRsID0gY3VycnkoKGYsIHIsIHQsIHMpID0+XG4gIGZvbGQoZiwgciwgcnVuKHQsIENvbGxlY3QsIHBhaXIsIHMpKSlcblxuZXhwb3J0IGNvbnN0IGZvbGRyID0gY3VycnkoKGYsIHIsIHQsIHMpID0+IHtcbiAgY29uc3QgeHMgPSBjb2xsZWN0QXMocGFpciwgdCwgcylcbiAgZm9yIChsZXQgaT14cy5sZW5ndGgtMTsgMDw9aTsgLS1pKSB7XG4gICAgY29uc3QgeCA9IHhzW2ldXG4gICAgciA9IGYociwgeFswXSwgeFsxXSlcbiAgfVxuICByZXR1cm4gclxufSlcblxuZXhwb3J0IGNvbnN0IG1heGltdW0gPSBjb25jYXQoTXVtKCh4LCB5KSA9PiB4ID4geSkpXG5cbmV4cG9ydCBjb25zdCBtaW5pbXVtID0gY29uY2F0KE11bSgoeCwgeSkgPT4geCA8IHkpKVxuXG5leHBvcnQgY29uc3Qgb3IgPSBhbnkoaWQpXG5cbmV4cG9ydCBjb25zdCBwcm9kdWN0ID0gY29uY2F0QXModW50bygxKSwgTW9ub2lkKCh5LCB4KSA9PiB4ICogeSwgMSkpXG5cbmV4cG9ydCBjb25zdCBzdW0gPSBjb25jYXRBcyh1bnRvKDApLCBNb25vaWQoKHksIHgpID0+IHggKyB5LCAwKSlcblxuLy8gQ3JlYXRpbmcgbmV3IHRyYXZlcnNhbHNcblxuZXhwb3J0IGZ1bmN0aW9uIGJyYW5jaCh0ZW1wbGF0ZSkge1xuICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiICYmICFpc09iamVjdCh0ZW1wbGF0ZSkpXG4gICAgZXJyb3JHaXZlbihcImBicmFuY2hgIGV4cGVjdHMgYSBwbGFpbiBPYmplY3QgdGVtcGxhdGVcIiwgdGVtcGxhdGUpXG4gIGNvbnN0IGtleXMgPSBbXSwgdmFscyA9IFtdXG4gIGZvciAoY29uc3QgayBpbiB0ZW1wbGF0ZSkge1xuICAgIGtleXMucHVzaChrKVxuICAgIHZhbHMucHVzaCh0b0Z1bmN0aW9uKHRlbXBsYXRlW2tdKSlcbiAgfVxuICByZXR1cm4gYnJhbmNoT24oa2V5cywgdmFscylcbn1cblxuLy8gVHJhdmVyc2FscyBhbmQgY29tYmluYXRvcnNcblxuZXhwb3J0IGZ1bmN0aW9uIGVsZW1zKEEsIHhpMnlBLCB4cywgXykge1xuICBpZiAoc2VlbXNBcnJheUxpa2UoeHMpKSB7XG4gICAgcmV0dXJuIEEgPT09IElkZW50XG4gICAgICA/IG1hcFBhcnRpYWxJbmRleFUoeGkyeUEsIHhzKVxuICAgICAgOiB0cmF2ZXJzZVBhcnRpYWxJbmRleChBLCB4aTJ5QSwgeHMpXG4gIH0gZWxzZSB7XG4gICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIilcbiAgICAgIHJlcUFwcGxpY2F0aXZlKEEpXG4gICAgcmV0dXJuICgwLEEub2YpKHhzKVxuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB2YWx1ZXMoQSwgeGkyeUEsIHhzLCBfKSB7XG4gIGlmICh4cyBpbnN0YW5jZW9mIE9iamVjdCkge1xuICAgIHJldHVybiBicmFuY2hPbihrZXlzKHhzKSkoQSwgeGkyeUEsIHhzKVxuICB9IGVsc2Uge1xuICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpXG4gICAgICByZXFBcHBsaWNhdGl2ZShBKVxuICAgIHJldHVybiAoMCxBLm9mKSh4cylcbiAgfVxufVxuXG4vLyBPcGVyYXRpb25zIG9uIGxlbnNlc1xuXG5leHBvcnQgY29uc3QgZ2V0ID0gY3VycnkoZ2V0VSlcblxuLy8gQ3JlYXRpbmcgbmV3IGxlbnNlc1xuXG5leHBvcnQgY29uc3QgbGVucyA9IGN1cnJ5KChnZXQsIHNldCkgPT4gKEYsIHhpMnlGLCB4LCBpKSA9PlxuICAoMCxGLm1hcCkoeSA9PiBzZXQoeSwgeCwgaSksIHhpMnlGKGdldCh4LCBpKSwgaSkpKVxuXG4vLyBDb21wdXRpbmcgZGVyaXZlZCBwcm9wc1xuXG5leHBvcnQgZnVuY3Rpb24gYXVnbWVudCh0ZW1wbGF0ZSkge1xuICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiICYmICFpc09iamVjdCh0ZW1wbGF0ZSkpXG4gICAgZXJyb3JHaXZlbihcImBhdWdtZW50YCBleHBlY3RzIGEgcGxhaW4gT2JqZWN0IHRlbXBsYXRlXCIsIHRlbXBsYXRlKVxuICByZXR1cm4gbGVucyhcbiAgICB4ID0+IHtcbiAgICAgIHggPSBkaXNzb2NQYXJ0aWFsVSgwLCB4KVxuICAgICAgaWYgKHgpXG4gICAgICAgIGZvciAoY29uc3QgayBpbiB0ZW1wbGF0ZSlcbiAgICAgICAgICB4W2tdID0gdGVtcGxhdGVba10oeClcbiAgICAgIHJldHVybiB4XG4gICAgfSxcbiAgICAoeSwgeCkgPT4ge1xuICAgICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIiAmJlxuICAgICAgICAgICEodm9pZCAwID09PSB5IHx8IHkgaW5zdGFuY2VvZiBPYmplY3QpKVxuICAgICAgICBlcnJvckdpdmVuKFwiYGF1Z21lbnRgIG11c3QgYmUgc2V0IHdpdGggdW5kZWZpbmVkIG9yIGFuIG9iamVjdFwiLCB5KVxuICAgICAgeSA9IHRvT2JqZWN0KHkpXG4gICAgICBpZiAoISh4IGluc3RhbmNlb2YgT2JqZWN0KSlcbiAgICAgICAgeCA9IHZvaWQgMFxuICAgICAgbGV0IHpcbiAgICAgIGZ1bmN0aW9uIHNldChrLCB2KSB7XG4gICAgICAgIGlmICgheilcbiAgICAgICAgICB6ID0ge31cbiAgICAgICAgeltrXSA9IHZcbiAgICAgIH1cbiAgICAgIGZvciAoY29uc3QgayBpbiB5KSB7XG4gICAgICAgIGlmICghaGFzVShrLCB0ZW1wbGF0ZSkpXG4gICAgICAgICAgc2V0KGssIHlba10pXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBpZiAoeCAmJiBoYXNVKGssIHgpKVxuICAgICAgICAgICAgc2V0KGssIHhba10pXG4gICAgICB9XG4gICAgICByZXR1cm4gelxuICAgIH0pXG59XG5cbi8vIEVuZm9yY2luZyBpbnZhcmlhbnRzXG5cbmV4cG9ydCBmdW5jdGlvbiBkZWZhdWx0cyhvdXQpIHtcbiAgY29uc3QgbzJ1ID0geCA9PiByZXBsYWNlZChvdXQsIHZvaWQgMCwgeClcbiAgcmV0dXJuIChGLCB4aTJ5RiwgeCwgaSkgPT4gKDAsRi5tYXApKG8ydSwgeGkyeUYodm9pZCAwICE9PSB4ID8geCA6IG91dCwgaSkpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkZWZpbmUodikge1xuICBjb25zdCB1bnRvViA9IHVudG8odilcbiAgcmV0dXJuIChGLCB4aTJ5RiwgeCwgaSkgPT4gKDAsRi5tYXApKHVudG9WLCB4aTJ5Rih2b2lkIDAgIT09IHggPyB4IDogdiwgaSkpXG59XG5cbmV4cG9ydCBjb25zdCBub3JtYWxpemUgPSB4aTJ4ID0+IChGLCB4aTJ5RiwgeCwgaSkgPT5cbiAgKDAsRi5tYXApKHggPT4gdm9pZCAwICE9PSB4ID8geGkyeCh4LCBpKSA6IHgsXG4gICAgICAgICAgICB4aTJ5Rih2b2lkIDAgIT09IHggPyB4aTJ4KHgsIGkpIDogeCwgaSkpXG5cbmV4cG9ydCBjb25zdCByZXF1aXJlZCA9IGlubiA9PiByZXBsYWNlKGlubiwgdm9pZCAwKVxuXG5leHBvcnQgY29uc3QgcmV3cml0ZSA9IHlpMnkgPT4gKEYsIHhpMnlGLCB4LCBpKSA9PlxuICAoMCxGLm1hcCkoeSA9PiB2b2lkIDAgIT09IHkgPyB5aTJ5KHksIGkpIDogeSwgeGkyeUYoeCwgaSkpXG5cbi8vIExlbnNpbmcgYXJyYXlzXG5cbmV4cG9ydCBjb25zdCBhcHBlbmQgPSAoRiwgeGkyeUYsIHhzLCBpKSA9PlxuICAoMCxGLm1hcCkoeCA9PiBzZXRJbmRleChzZWVtc0FycmF5TGlrZSh4cykgPyB4cy5sZW5ndGggOiAwLCB4LCB4cyksXG4gICAgICAgICAgICB4aTJ5Rih2b2lkIDAsIGkpKVxuXG5leHBvcnQgY29uc3QgZmlsdGVyID0geGkyYiA9PiAoRiwgeGkyeUYsIHhzLCBpKSA9PiB7XG4gIGxldCB0cywgZnNcbiAgaWYgKHNlZW1zQXJyYXlMaWtlKHhzKSlcbiAgICBwYXJ0aXRpb25JbnRvSW5kZXgoeGkyYiwgeHMsIHRzID0gW10sIGZzID0gW10pXG4gIHJldHVybiAoMCxGLm1hcCkoXG4gICAgdHMgPT4ge1xuICAgICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIiAmJlxuICAgICAgICAgICEodm9pZCAwID09PSB0cyB8fCBzZWVtc0FycmF5TGlrZSh0cykpKVxuICAgICAgICBlcnJvckdpdmVuKFwiYGZpbHRlcmAgbXVzdCBiZSBzZXQgd2l0aCB1bmRlZmluZWQgb3IgYW4gYXJyYXktbGlrZSBvYmplY3RcIiwgdHMpXG4gICAgICBjb25zdCB0c04gPSB0cyA/IHRzLmxlbmd0aCA6IDAsXG4gICAgICAgICAgICBmc04gPSBmcyA/IGZzLmxlbmd0aCA6IDAsXG4gICAgICAgICAgICBuID0gdHNOICsgZnNOXG4gICAgICBpZiAobilcbiAgICAgICAgcmV0dXJuIG4gPT09IGZzTlxuICAgICAgICA/IGZzXG4gICAgICAgIDogY29weVRvRnJvbShjb3B5VG9Gcm9tKEFycmF5KG4pLCAwLCB0cywgMCwgdHNOKSwgdHNOLCBmcywgMCwgZnNOKVxuICAgIH0sXG4gICAgeGkyeUYodHMsIGkpKVxufVxuXG5leHBvcnQgY29uc3QgZmluZCA9IHhpMmIgPT4gY2hvb3NlKHhzID0+IHtcbiAgaWYgKCFzZWVtc0FycmF5TGlrZSh4cykpXG4gICAgcmV0dXJuIDBcbiAgY29uc3QgaSA9IGZpbmRJbmRleCh4aTJiLCB4cylcbiAgcmV0dXJuIGkgPCAwID8gYXBwZW5kIDogaVxufSlcblxuZXhwb3J0IGZ1bmN0aW9uIGZpbmRXaXRoKC4uLmxzKSB7XG4gIGNvbnN0IGxscyA9IGNvbXBvc2UoLi4ubHMpXG4gIHJldHVybiBbZmluZCh4ID0+IHZvaWQgMCAhPT0gZ2V0VShsbHMsIHgpKSwgbGxzXVxufVxuXG5leHBvcnQgY29uc3QgaW5kZXggPSBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gXCJwcm9kdWN0aW9uXCIgPyBpZCA6IHggPT4ge1xuICBpZiAoIU51bWJlci5pc0ludGVnZXIoeCkgfHwgeCA8IDApXG4gICAgZXJyb3JHaXZlbihcImBpbmRleGAgZXhwZWN0cyBhIG5vbi1uZWdhdGl2ZSBpbnRlZ2VyXCIsIHgpXG4gIHJldHVybiB4XG59XG5cbmV4cG9ydCBjb25zdCBzbGljZSA9IGN1cnJ5KChiZWdpbiwgZW5kKSA9PiAoRiwgeHNpMnlGLCB4cywgaSkgPT4ge1xuICBjb25zdCBzZWVtcyA9IHNlZW1zQXJyYXlMaWtlKHhzKSxcbiAgICAgICAgeHNOID0gc2VlbXMgJiYgeHMubGVuZ3RoLFxuICAgICAgICBiID0gc2xpY2VJbmRleCgwLCB4c04sIDAsIGJlZ2luKSxcbiAgICAgICAgZSA9IHNsaWNlSW5kZXgoYiwgeHNOLCB4c04sIGVuZClcbiAgcmV0dXJuICgwLEYubWFwKShcbiAgICB6cyA9PiB7XG4gICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiICYmXG4gICAgICAgICAgISh2b2lkIDAgPT09IHpzIHx8IHNlZW1zQXJyYXlMaWtlKHpzKSkpXG4gICAgICAgIGVycm9yR2l2ZW4oXCJgc2xpY2VgIG11c3QgYmUgc2V0IHdpdGggdW5kZWZpbmVkIG9yIGFuIGFycmF5LWxpa2Ugb2JqZWN0XCIsIHpzKVxuICAgICAgY29uc3QgenNOID0genMgPyB6cy5sZW5ndGggOiAwLCBiUHpzTiA9IGIgKyB6c04sIG4gPSB4c04gLSBlICsgYlB6c05cbiAgICAgIHJldHVybiBuXG4gICAgICAgID8gY29weVRvRnJvbShjb3B5VG9Gcm9tKGNvcHlUb0Zyb20oQXJyYXkobiksIDAsIHhzLCAwLCBiKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgenMsIDAsIHpzTiksXG4gICAgICAgICAgICAgICAgICAgICBiUHpzTixcbiAgICAgICAgICAgICAgICAgICAgIHhzLCBlLCB4c04pXG4gICAgICAgIDogdm9pZCAwXG4gICAgfSxcbiAgICB4c2kyeUYoc2VlbXMgPyBjb3B5VG9Gcm9tKEFycmF5KE1hdGgubWF4KDAsIGUgLSBiKSksIDAsIHhzLCBiLCBlKSA6XG4gICAgICAgICAgIHZvaWQgMCxcbiAgICAgICAgICAgaSkpXG59KVxuXG4vLyBMZW5zaW5nIG9iamVjdHNcblxuZXhwb3J0IGNvbnN0IHByb3AgPSBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gXCJwcm9kdWN0aW9uXCIgPyBpZCA6IHggPT4ge1xuICBpZiAoIWlzU3RyaW5nKHgpKVxuICAgIGVycm9yR2l2ZW4oXCJgcHJvcGAgZXhwZWN0cyBhIHN0cmluZ1wiLCB4KVxuICByZXR1cm4geFxufVxuXG5leHBvcnQgZnVuY3Rpb24gcHJvcHMoKSB7XG4gIGNvbnN0IG4gPSBhcmd1bWVudHMubGVuZ3RoLCB0ZW1wbGF0ZSA9IHt9XG4gIGZvciAobGV0IGk9MCwgazsgaTxuOyArK2kpXG4gICAgdGVtcGxhdGVbayA9IGFyZ3VtZW50c1tpXV0gPSBrXG4gIHJldHVybiBwaWNrKHRlbXBsYXRlKVxufVxuXG5leHBvcnQgY29uc3QgcmVtb3ZhYmxlID0gKC4uLnBzKSA9PiB7XG4gIGZ1bmN0aW9uIGRyb3AoeSkge1xuICAgIGlmICghKHkgaW5zdGFuY2VvZiBPYmplY3QpKVxuICAgICAgcmV0dXJuIHlcbiAgICBmb3IgKGxldCBpPTAsIG49cHMubGVuZ3RoOyBpPG47ICsraSlcbiAgICAgIGlmIChoYXNVKHBzW2ldLCB5KSlcbiAgICAgICAgcmV0dXJuIHlcbiAgfVxuICByZXR1cm4gKEYsIHhpMnlGLCB4LCBpKSA9PiAoMCxGLm1hcCkoZHJvcCwgeGkyeUYoeCwgaSkpXG59XG5cbi8vIFByb3ZpZGluZyBkZWZhdWx0c1xuXG5leHBvcnQgY29uc3QgdmFsdWVPciA9IHYgPT4gKF9GLCB4aTJ5RiwgeCwgaSkgPT5cbiAgeGkyeUYodm9pZCAwICE9PSB4ICYmIHggIT09IG51bGwgPyB4IDogdiwgaSlcblxuLy8gQWRhcHRpbmcgdG8gZGF0YVxuXG5leHBvcnQgY29uc3Qgb3JFbHNlID1cbiAgY3VycnkoKGQsIGwpID0+IGNob29zZSh4ID0+IHZvaWQgMCAhPT0gZ2V0VShsLCB4KSA/IGwgOiBkKSlcblxuLy8gUmVhZC1vbmx5IG1hcHBpbmdcblxuZXhwb3J0IGNvbnN0IHRvID0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09IFwicHJvZHVjdGlvblwiID8gaWQgOiB3aTJ4ID0+XG4gIHdhcm4odG8sIFwiYHRvYCBpcyBvYnNvbGV0ZSwgeW91IGNhbiBkaXJlY3RseSBgY29tcG9zZWAgcGxhaW4gZnVuY3Rpb25zIHdpdGggb3B0aWNzXCIpIHx8XG4gIHdpMnhcblxuZXhwb3J0IGNvbnN0IGp1c3QgPSBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gXCJwcm9kdWN0aW9uXCIgPyBhbHdheXMgOiB4ID0+XG4gIHdhcm4oanVzdCwgXCJganVzdGAgaXMgb2Jzb2xldGUsIGp1c3QgdXNlIGUuZy4gYFIuYWx3YXlzYFwiKSB8fFxuICBhbHdheXMoeClcblxuLy8gVHJhbnNmb3JtaW5nIGRhdGFcblxuZXhwb3J0IGZ1bmN0aW9uIHBpY2sodGVtcGxhdGUpIHtcbiAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIiAmJiAhaXNPYmplY3QodGVtcGxhdGUpKVxuICAgIGVycm9yR2l2ZW4oXCJgcGlja2AgZXhwZWN0cyBhIHBsYWluIE9iamVjdCB0ZW1wbGF0ZVwiLCB0ZW1wbGF0ZSlcbiAgcmV0dXJuIChGLCB4aTJ5RiwgeCwgaSkgPT5cbiAgICAoMCxGLm1hcCkoc2V0UGljayh0ZW1wbGF0ZSwgeCksIHhpMnlGKGdldFBpY2sodGVtcGxhdGUsIHgpLCBpKSlcbn1cblxuZXhwb3J0IGNvbnN0IHJlcGxhY2UgPSBjdXJyeSgoaW5uLCBvdXQpID0+IHtcbiAgY29uc3QgbzJpID0geCA9PiByZXBsYWNlZChvdXQsIGlubiwgeClcbiAgcmV0dXJuIChGLCB4aTJ5RiwgeCwgaSkgPT4gKDAsRi5tYXApKG8yaSwgeGkyeUYocmVwbGFjZWQoaW5uLCBvdXQsIHgpLCBpKSlcbn0pXG5cbi8vIE9wZXJhdGlvbnMgb24gaXNvbW9ycGhpc21zXG5cbmV4cG9ydCBjb25zdCBnZXRJbnZlcnNlID0gYXJpdHlOKDIsIHNldFUpXG5cbi8vIENyZWF0aW5nIG5ldyBpc29tb3JwaGlzbXNcblxuZXhwb3J0IGNvbnN0IGlzbyA9XG4gIGN1cnJ5KChid2QsIGZ3ZCkgPT4gKEYsIHhpMnlGLCB4LCBpKSA9PiAoMCxGLm1hcCkoZndkLCB4aTJ5Rihid2QoeCksIGkpKSlcblxuLy8gSXNvbW9ycGhpc21zIGFuZCBjb21iaW5hdG9yc1xuXG5leHBvcnQgY29uc3QgaWRlbnRpdHkgPSAoX0YsIHhpMnlGLCB4LCBpKSA9PiB4aTJ5Rih4LCBpKVxuXG5leHBvcnQgY29uc3QgaW52ZXJzZSA9IGlzbyA9PiAoRiwgeGkyeUYsIHgsIGkpID0+XG4gICgwLEYubWFwKSh4ID0+IGdldFUoaXNvLCB4KSwgeGkyeUYoc2V0VShpc28sIHgpLCBpKSlcbiJdfQ==
