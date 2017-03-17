(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.L = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.inverse = exports.identity = exports.complement = exports.iso = exports.getInverse = exports.replace = exports.just = exports.to = exports.orElse = exports.valueOr = exports.removable = exports.prop = exports.slice = exports.index = exports.find = exports.filter = exports.append = exports.rewrite = exports.required = exports.normalize = exports.lens = exports.get = exports.sum = exports.product = exports.or = exports.minimum = exports.maximum = exports.foldr = exports.foldl = exports.last = exports.first = exports.firstAs = exports.count = exports.collect = exports.collectAs = exports.any = exports.and = exports.all = exports.merge = exports.mergeAs = exports.concat = exports.concatAs = exports.optional = exports.when = exports.choose = exports.choice = exports.chain = exports.set = exports.remove = exports.modify = undefined;
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

var notPartial = function notPartial(x) {
  return void 0 !== x ? !x : x;
};

var isValidIndex = function isValidIndex(x) {
  return Number.isInteger(x) && 0 <= x;
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
var Sum = Monoid(function (y, x) {
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
      if ("dev" !== "production" && !isValidIndex(o)) errorGiven("Only non-negative integers can be used as lenses", o);
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
    return console.log.apply(console, copyToFrom([], 0, _arguments, 0, _arguments.length).concat([dir, x])), x;
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

var count = exports.count = concatAs(function (x) {
  return void 0 !== x ? 1 : 0;
}, Sum);

var firstAs = exports.firstAs = (0, _infestines.curry)(mkFirst(function (x) {
  return void 0 !== x ? the(x) : x;
}));

var first = exports.first = firstAs(_infestines.id);

var last = exports.last = choose(function (maybeArray) {
  return seemsArrayLike(maybeArray) && maybeArray.length ? maybeArray.length - 1 : append;
});

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

var sum = exports.sum = concatAs(unto(0), Sum);

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
  if (!isValidIndex(x)) errorGiven("`index` expects a non-negative integer", x);
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

var complement = exports.complement = iso(notPartial, notPartial);

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvcGFydGlhbC5sZW5zZXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7UUNpZGdCLFUsR0FBQSxVO1FBNENBLEcsR0FBQSxHO1FBZ0JBLE8sR0FBQSxPO1FBOEJBLEksR0FBQSxJO1FBT0EsSSxHQUFBLEk7UUFRQSxHLEdBQUEsRztRQXVFQSxNLEdBQUEsTTtRQWFBLEssR0FBQSxLO1FBWUEsTSxHQUFBLE07UUFxQkEsTyxHQUFBLE87UUFxQ0EsUSxHQUFBLFE7UUFLQSxNLEdBQUEsTTtRQStDQSxRLEdBQUEsUTtRQTJDQSxLLEdBQUEsSztRQXdDQSxJLEdBQUEsSTs7QUEzMUJoQjs7QUFzQkE7O0FBRUEsSUFBTSxhQUFhLFNBQWIsVUFBYSxDQUFDLENBQUQsRUFBSSxDQUFKLEVBQU8sQ0FBUCxFQUFVLENBQVY7QUFBQSxTQUNqQixLQUFLLENBQUwsS0FBVyxDQUFYLEdBQWUsS0FBSyxHQUFMLENBQVMsS0FBSyxHQUFMLENBQVMsQ0FBVCxFQUFZLElBQUksQ0FBSixHQUFRLElBQUksQ0FBWixHQUFnQixDQUE1QixDQUFULEVBQXlDLENBQXpDLENBQWYsR0FBNkQsQ0FENUM7QUFBQSxDQUFuQjs7QUFHQSxTQUFTLElBQVQsQ0FBYyxFQUFkLEVBQWtCLEVBQWxCLEVBQXNCO0FBQUMsU0FBTyxDQUFDLEVBQUQsRUFBSyxFQUFMLENBQVA7QUFBZ0I7QUFDdkMsSUFBTSxRQUFRLFNBQVIsS0FBUTtBQUFBLFNBQUs7QUFBQSxXQUFNLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBTjtBQUFBLEdBQUw7QUFBQSxDQUFkOztBQUVBLElBQU0sT0FBTyxTQUFQLElBQU87QUFBQSxTQUFLO0FBQUEsV0FBSyxLQUFLLENBQUwsS0FBVyxDQUFYLEdBQWUsQ0FBZixHQUFtQixDQUF4QjtBQUFBLEdBQUw7QUFBQSxDQUFiOztBQUVBLElBQU0sYUFBYSxTQUFiLFVBQWE7QUFBQSxT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QUFBLENBQWpCOztBQUVBLElBQU0sNEJBQVUsU0FBVixPQUFVO0FBQUEsU0FBTyxVQUFDLENBQUQsRUFBSSxLQUFKLEVBQVcsQ0FBWCxFQUFjLENBQWQ7QUFBQSxXQUM1QixDQUFDLEdBQUUsRUFBRSxHQUFMLEVBQVU7QUFBQSxhQUFLLEtBQUssR0FBTCxFQUFVLENBQVYsQ0FBTDtBQUFBLEtBQVYsRUFBNkIsTUFBTSxLQUFLLEdBQUwsRUFBVSxDQUFWLENBQU4sRUFBb0IsQ0FBcEIsQ0FBN0IsQ0FENEI7QUFBQSxHQUFQO0FBQUEsQ0FBaEIiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IHtcbiAgYWN5Y2xpY0VxdWFsc1UsXG4gIGFsd2F5cyxcbiAgYXBwbHlVLFxuICBhcml0eU4sXG4gIGFzc29jUGFydGlhbFUsXG4gIGNvbnN0cnVjdG9yT2YsXG4gIGN1cnJ5LFxuICBjdXJyeU4sXG4gIGRpc3NvY1BhcnRpYWxVLFxuICBoYXNVLFxuICBpZCxcbiAgaXNEZWZpbmVkLFxuICBpc0Z1bmN0aW9uLFxuICBpc09iamVjdCxcbiAgaXNTdHJpbmcsXG4gIGtleXMsXG4gIG9iamVjdDAsXG4gIHBpcGUyVSxcbiAgc25kVVxufSBmcm9tIFwiaW5mZXN0aW5lc1wiXG5cbi8vXG5cbmNvbnN0IHNsaWNlSW5kZXggPSAobSwgbCwgZCwgaSkgPT5cbiAgdm9pZCAwICE9PSBpID8gTWF0aC5taW4oTWF0aC5tYXgobSwgaSA8IDAgPyBsICsgaSA6IGkpLCBsKSA6IGRcblxuZnVuY3Rpb24gcGFpcih4MCwgeDEpIHtyZXR1cm4gW3gwLCB4MV19XG5jb25zdCBjcGFpciA9IHggPT4geHMgPT4gW3gsIHhzXVxuXG5jb25zdCB1bnRvID0gYyA9PiB4ID0+IHZvaWQgMCAhPT0geCA/IHggOiBjXG5cbmNvbnN0IG5vdFBhcnRpYWwgPSB4ID0+IHZvaWQgMCAhPT0geCA/ICF4IDogeFxuXG5jb25zdCBpc1ZhbGlkSW5kZXggPSB4ID0+IE51bWJlci5pc0ludGVnZXIoeCkgJiYgMCA8PSB4XG5cbmNvbnN0IHNlZW1zQXJyYXlMaWtlID0geCA9PlxuICB4IGluc3RhbmNlb2YgT2JqZWN0ICYmICh4ID0geC5sZW5ndGgsIHggPT09ICh4ID4+IDApICYmIDAgPD0geCkgfHxcbiAgaXNTdHJpbmcoeClcblxuLy9cblxuZnVuY3Rpb24gbWFwUGFydGlhbEluZGV4VSh4aTJ5LCB4cykge1xuICBjb25zdCBuID0geHMubGVuZ3RoLCB5cyA9IEFycmF5KG4pXG4gIGxldCBqID0gMFxuICBmb3IgKGxldCBpPTAsIHk7IGk8bjsgKytpKVxuICAgIGlmICh2b2lkIDAgIT09ICh5ID0geGkyeSh4c1tpXSwgaSkpKVxuICAgICAgeXNbaisrXSA9IHlcbiAgaWYgKGopIHtcbiAgICBpZiAoaiA8IG4pXG4gICAgICB5cy5sZW5ndGggPSBqXG4gICAgcmV0dXJuIHlzXG4gIH1cbn1cblxuZnVuY3Rpb24gY29weVRvRnJvbSh5cywgaywgeHMsIGksIGopIHtcbiAgd2hpbGUgKGkgPCBqKVxuICAgIHlzW2srK10gPSB4c1tpKytdXG4gIHJldHVybiB5c1xufVxuXG4vL1xuXG5jb25zdCBJZGVudCA9IHttYXA6IGFwcGx5VSwgb2Y6IGlkLCBhcDogYXBwbHlVLCBjaGFpbjogYXBwbHlVfVxuXG5jb25zdCBDb25zdCA9IHttYXA6IHNuZFV9XG5cbmZ1bmN0aW9uIENvbmNhdE9mKGFwLCBlbXB0eSwgZGVsYXkpIHtcbiAgY29uc3QgYyA9IHttYXA6IHNuZFUsIGFwLCBvZjogYWx3YXlzKGVtcHR5KX1cbiAgaWYgKGRlbGF5KVxuICAgIGMuZGVsYXkgPSBkZWxheVxuICByZXR1cm4gY1xufVxuXG5jb25zdCBNb25vaWQgPSAoY29uY2F0LCBlbXB0eSkgPT4gKHtjb25jYXQsIGVtcHR5OiAoKSA9PiBlbXB0eX0pXG5jb25zdCBTdW0gPSBNb25vaWQoKHksIHgpID0+IHggKyB5LCAwKVxuXG5jb25zdCBNdW0gPSBvcmQgPT5cbiAgTW9ub2lkKCh5LCB4KSA9PiB2b2lkIDAgIT09IHggJiYgKHZvaWQgMCA9PT0geSB8fCBvcmQoeCwgeSkpID8geCA6IHkpXG5cbi8vXG5cbmNvbnN0IHJ1biA9IChvLCBDLCB4aTJ5QywgcywgaSkgPT4gdG9GdW5jdGlvbihvKShDLCB4aTJ5QywgcywgaSlcblxuLy9cblxuY29uc3QgZXhwZWN0ZWRPcHRpYyA9IFwiRXhwZWN0aW5nIGFuIG9wdGljXCJcbmNvbnN0IGhlYWRlciA9IFwicGFydGlhbC5sZW5zZXM6IFwiXG5cbmZ1bmN0aW9uIHdhcm4oZiwgbSkge1xuICBpZiAoIWYud2FybmVkKSB7XG4gICAgZi53YXJuZWQgPSAxXG4gICAgY29uc29sZS53YXJuKGhlYWRlciArIG0pXG4gIH1cbn1cblxuZnVuY3Rpb24gZXJyb3JHaXZlbihtLCBvKSB7XG4gIGNvbnNvbGUuZXJyb3IoaGVhZGVyICsgbSArIFwiIC0gZ2l2ZW46XCIsIG8pXG4gIHRocm93IG5ldyBFcnJvcihtKVxufVxuXG5mdW5jdGlvbiByZXFGdW5jdGlvbihvKSB7XG4gIGlmICghKGlzRnVuY3Rpb24obykgJiYgKG8ubGVuZ3RoID09PSA0IHx8IG8ubGVuZ3RoIDw9IDIpKSlcbiAgICBlcnJvckdpdmVuKGV4cGVjdGVkT3B0aWMsIG8pXG59XG5cbmZ1bmN0aW9uIHJlcUFycmF5KG8pIHtcbiAgaWYgKCFBcnJheS5pc0FycmF5KG8pKVxuICAgIGVycm9yR2l2ZW4oZXhwZWN0ZWRPcHRpYywgbylcbn1cblxuLy9cblxuZnVuY3Rpb24gcmVxQXBwbGljYXRpdmUoZikge1xuICBpZiAoIWYub2YpXG4gICAgZXJyb3JHaXZlbihcIlRyYXZlcnNhbHMgcmVxdWlyZSBhbiBhcHBsaWNhdGl2ZVwiLCBmKVxufVxuXG4vL1xuXG5mdW5jdGlvbiBKb2luKGwsIHIpIHt0aGlzLmwgPSBsOyB0aGlzLnIgPSByfVxuXG5jb25zdCBpc0pvaW4gPSBuID0+IG4uY29uc3RydWN0b3IgPT09IEpvaW5cblxuY29uc3Qgam9pbiA9IChsLCByKSA9PiB2b2lkIDAgIT09IGwgPyB2b2lkIDAgIT09IHIgPyBuZXcgSm9pbihsLCByKSA6IGwgOiByXG5cbmNvbnN0IGNqb2luID0gaCA9PiB0ID0+IGpvaW4oaCwgdClcblxuZnVuY3Rpb24gcHVzaFRvKG4sIHlzKSB7XG4gIHdoaWxlIChuICYmIGlzSm9pbihuKSkge1xuICAgIGNvbnN0IGwgPSBuLmxcbiAgICBuID0gbi5yXG4gICAgaWYgKGwgJiYgaXNKb2luKGwpKSB7XG4gICAgICBwdXNoVG8obC5sLCB5cylcbiAgICAgIHB1c2hUbyhsLnIsIHlzKVxuICAgIH0gZWxzZSB7XG4gICAgICB5cy5wdXNoKGwpXG4gICAgfVxuICB9XG4gIHlzLnB1c2gobilcbn1cblxuZnVuY3Rpb24gdG9BcnJheShuKSB7XG4gIGlmICh2b2lkIDAgIT09IG4pIHtcbiAgICBjb25zdCB5cyA9IFtdXG4gICAgcHVzaFRvKG4sIHlzKVxuICAgIHJldHVybiB5c1xuICB9XG59XG5cbmZ1bmN0aW9uIGZvbGRSZWMoZiwgciwgbikge1xuICB3aGlsZSAoaXNKb2luKG4pKSB7XG4gICAgY29uc3QgbCA9IG4ubFxuICAgIG4gPSBuLnJcbiAgICByID0gaXNKb2luKGwpXG4gICAgICA/IGZvbGRSZWMoZiwgZm9sZFJlYyhmLCByLCBsLmwpLCBsLnIpXG4gICAgICA6IGYociwgbFswXSwgbFsxXSlcbiAgfVxuICByZXR1cm4gZihyLCBuWzBdLCBuWzFdKVxufVxuXG5jb25zdCBmb2xkID0gKGYsIHIsIG4pID0+IHZvaWQgMCAhPT0gbiA/IGZvbGRSZWMoZiwgciwgbikgOiByXG5cbmNvbnN0IENvbGxlY3QgPSBDb25jYXRPZihqb2luKVxuXG4vL1xuXG5mdW5jdGlvbiB0aGUodikge1xuICBmdW5jdGlvbiByZXN1bHQoKSB7cmV0dXJuIHJlc3VsdH1cbiAgcmVzdWx0LnYgPSB2XG4gIHJldHVybiByZXN1bHRcbn1cblxuY29uc3QgVCA9IHRoZSh0cnVlKVxuY29uc3Qgbm90ID0geCA9PiAheFxuXG5jb25zdCBGaXJzdCA9IENvbmNhdE9mKChsLCByKSA9PiBsICYmIGwoKSB8fCByICYmIHIoKSwgdm9pZCAwLCBpZClcblxuY29uc3QgbWtGaXJzdCA9IHRvTSA9PiAoeGkyeU0sIHQsIHMpID0+IHtcbiAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIilcbiAgICB3YXJuKG1rRmlyc3QsIFwiTGF6eSBmb2xkcyBvdmVyIHRyYXZlcnNhbHMgYXJlIGV4cGVyaW1lbnRhbFwiKVxuICByZXR1cm4gKHMgPSBydW4odCwgRmlyc3QsIHBpcGUyVSh4aTJ5TSwgdG9NKSwgcyksXG4gICAgICAgICAgcyAmJiAocyA9IHMoKSkgJiYgcy52KVxufVxuXG4vL1xuXG5jb25zdCB0cmF2ZXJzZVBhcnRpYWxJbmRleExhenkgPSAobWFwLCBhcCwgeiwgZGVsYXksIHhpMnlBLCB4cywgaSwgbikgPT5cbiAgaSA8IG5cbiAgPyBhcChtYXAoY2pvaW4sIHhpMnlBKHhzW2ldLCBpKSksIGRlbGF5KCgpID0+XG4gICAgICAgdHJhdmVyc2VQYXJ0aWFsSW5kZXhMYXp5KG1hcCwgYXAsIHosIGRlbGF5LCB4aTJ5QSwgeHMsIGkrMSwgbikpKVxuICA6IHpcblxuZnVuY3Rpb24gdHJhdmVyc2VQYXJ0aWFsSW5kZXgoQSwgeGkyeUEsIHhzKSB7XG4gIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpXG4gICAgcmVxQXBwbGljYXRpdmUoQSlcbiAgY29uc3Qge21hcCwgYXAsIG9mLCBkZWxheX0gPSBBXG4gIGxldCB4c0EgPSBvZih2b2lkIDApLFxuICAgICAgaSA9IHhzLmxlbmd0aFxuICBpZiAoZGVsYXkpXG4gICAgeHNBID0gdHJhdmVyc2VQYXJ0aWFsSW5kZXhMYXp5KG1hcCwgYXAsIHhzQSwgZGVsYXksIHhpMnlBLCB4cywgMCwgaSlcbiAgZWxzZVxuICAgIHdoaWxlIChpLS0pXG4gICAgICB4c0EgPSBhcChtYXAoY2pvaW4sIHhpMnlBKHhzW2ldLCBpKSksIHhzQSlcbiAgcmV0dXJuIG1hcCh0b0FycmF5LCB4c0EpXG59XG5cbi8vXG5cbmZ1bmN0aW9uIG9iamVjdDBUb1VuZGVmaW5lZChvKSB7XG4gIGlmICghKG8gaW5zdGFuY2VvZiBPYmplY3QpKVxuICAgIHJldHVybiBvXG4gIGZvciAoY29uc3QgayBpbiBvKVxuICAgIHJldHVybiBvXG59XG5cbi8vXG5cbmNvbnN0IGxlbnNGcm9tID0gKGdldCwgc2V0KSA9PiBpID0+IChGLCB4aTJ5RiwgeCwgXykgPT5cbiAgKDAsRi5tYXApKHYgPT4gc2V0KGksIHYsIHgpLCB4aTJ5RihnZXQoaSwgeCksIGkpKVxuXG4vL1xuXG5jb25zdCBnZXRQcm9wID0gKGssIG8pID0+IG8gaW5zdGFuY2VvZiBPYmplY3QgPyBvW2tdIDogdm9pZCAwXG5cbmNvbnN0IHNldFByb3AgPSAoaywgdiwgbykgPT5cbiAgdm9pZCAwICE9PSB2ID8gYXNzb2NQYXJ0aWFsVShrLCB2LCBvKSA6IGRpc3NvY1BhcnRpYWxVKGssIG8pXG5cbmNvbnN0IGZ1blByb3AgPSBsZW5zRnJvbShnZXRQcm9wLCBzZXRQcm9wKVxuXG4vL1xuXG5jb25zdCBnZXRJbmRleCA9IChpLCB4cykgPT4gc2VlbXNBcnJheUxpa2UoeHMpID8geHNbaV0gOiB2b2lkIDBcblxuZnVuY3Rpb24gc2V0SW5kZXgoaSwgeCwgeHMpIHtcbiAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIiAmJiBpIDwgMClcbiAgICBlcnJvckdpdmVuKFwiTmVnYXRpdmUgaW5kaWNlcyBhcmUgbm90IHN1cHBvcnRlZCBieSBgaW5kZXhgXCIsIGkpXG4gIGlmICghc2VlbXNBcnJheUxpa2UoeHMpKVxuICAgIHhzID0gXCJcIlxuICBjb25zdCBuID0geHMubGVuZ3RoXG4gIGlmICh2b2lkIDAgIT09IHgpIHtcbiAgICBjb25zdCBtID0gTWF0aC5tYXgoaSsxLCBuKSwgeXMgPSBBcnJheShtKVxuICAgIGZvciAobGV0IGo9MDsgajxtOyArK2opXG4gICAgICB5c1tqXSA9IHhzW2pdXG4gICAgeXNbaV0gPSB4XG4gICAgcmV0dXJuIHlzXG4gIH0gZWxzZSB7XG4gICAgaWYgKDAgPCBuKSB7XG4gICAgICBpZiAobiA8PSBpKVxuICAgICAgICByZXR1cm4gY29weVRvRnJvbShBcnJheShuKSwgMCwgeHMsIDAsIG4pXG4gICAgICBpZiAoMSA8IG4pIHtcbiAgICAgICAgY29uc3QgeXMgPSBBcnJheShuLTEpXG4gICAgICAgIGZvciAobGV0IGo9MDsgajxpOyArK2opXG4gICAgICAgICAgeXNbal0gPSB4c1tqXVxuICAgICAgICBmb3IgKGxldCBqPWkrMTsgajxuOyArK2opXG4gICAgICAgICAgeXNbai0xXSA9IHhzW2pdXG4gICAgICAgIHJldHVybiB5c1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5jb25zdCBmdW5JbmRleCA9IGxlbnNGcm9tKGdldEluZGV4LCBzZXRJbmRleClcblxuLy9cblxuY29uc3QgY2xvc2UgPSAobywgRiwgeGkyeUYpID0+ICh4LCBpKSA9PiBvKEYsIHhpMnlGLCB4LCBpKVxuXG5mdW5jdGlvbiBjb21wb3NlZChvaTAsIG9zKSB7XG4gIGNvbnN0IG4gPSBvcy5sZW5ndGggLSBvaTBcbiAgbGV0IGZzXG4gIGlmIChuIDwgMikge1xuICAgIHJldHVybiBuID8gdG9GdW5jdGlvbihvc1tvaTBdKSA6IGlkZW50aXR5XG4gIH0gZWxzZSB7XG4gICAgZnMgPSBBcnJheShuKVxuICAgIGZvciAobGV0IGk9MDtpPG47KytpKVxuICAgICAgZnNbaV0gPSB0b0Z1bmN0aW9uKG9zW2krb2kwXSlcbiAgICByZXR1cm4gKEYsIHhpMnlGLCB4LCBpKSA9PiB7XG4gICAgICBsZXQgaz1uXG4gICAgICB3aGlsZSAoLS1rKVxuICAgICAgICB4aTJ5RiA9IGNsb3NlKGZzW2tdLCBGLCB4aTJ5RilcbiAgICAgIHJldHVybiBmc1swXShGLCB4aTJ5RiwgeCwgaSlcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gc2V0VShvLCB4LCBzKSB7XG4gIHN3aXRjaCAodHlwZW9mIG8pIHtcbiAgICBjYXNlIFwic3RyaW5nXCI6XG4gICAgICByZXR1cm4gc2V0UHJvcChvLCB4LCBzKVxuICAgIGNhc2UgXCJudW1iZXJcIjpcbiAgICAgIHJldHVybiBzZXRJbmRleChvLCB4LCBzKVxuICAgIGNhc2UgXCJvYmplY3RcIjpcbiAgICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpXG4gICAgICAgIHJlcUFycmF5KG8pXG4gICAgICByZXR1cm4gbW9kaWZ5Q29tcG9zZWQobywgMCwgcywgeClcbiAgICBkZWZhdWx0OlxuICAgICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIilcbiAgICAgICAgcmVxRnVuY3Rpb24obylcbiAgICAgIHJldHVybiBvLmxlbmd0aCA9PT0gNCA/IG8oSWRlbnQsIGFsd2F5cyh4KSwgcywgdm9pZCAwKSA6IHNcbiAgfVxufVxuXG5mdW5jdGlvbiBnZXRVKGwsIHMpIHtcbiAgc3dpdGNoICh0eXBlb2YgbCkge1xuICAgIGNhc2UgXCJzdHJpbmdcIjpcbiAgICAgIHJldHVybiBnZXRQcm9wKGwsIHMpXG4gICAgY2FzZSBcIm51bWJlclwiOlxuICAgICAgcmV0dXJuIGdldEluZGV4KGwsIHMpXG4gICAgY2FzZSBcIm9iamVjdFwiOlxuICAgICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIilcbiAgICAgICAgcmVxQXJyYXkobClcbiAgICAgIGZvciAobGV0IGk9MCwgbj1sLmxlbmd0aCwgbzsgaTxuOyArK2kpXG4gICAgICAgIHN3aXRjaCAodHlwZW9mIChvID0gbFtpXSkpIHtcbiAgICAgICAgICBjYXNlIFwic3RyaW5nXCI6IHMgPSBnZXRQcm9wKG8sIHMpOyBicmVha1xuICAgICAgICAgIGNhc2UgXCJudW1iZXJcIjogcyA9IGdldEluZGV4KG8sIHMpOyBicmVha1xuICAgICAgICAgIGRlZmF1bHQ6IHJldHVybiBjb21wb3NlZChpLCBsKShDb25zdCwgaWQsIHMsIGxbaS0xXSlcbiAgICAgICAgfVxuICAgICAgcmV0dXJuIHNcbiAgICBkZWZhdWx0OlxuICAgICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIilcbiAgICAgICAgcmVxRnVuY3Rpb24obClcbiAgICAgIHJldHVybiBsLmxlbmd0aCA9PT0gNCA/IGwoQ29uc3QsIGlkLCBzLCB2b2lkIDApIDogbChzLCB2b2lkIDApXG4gIH1cbn1cblxuZnVuY3Rpb24gbW9kaWZ5Q29tcG9zZWQob3MsIHhpMnksIHgsIHkpIHtcbiAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIilcbiAgICByZXFBcnJheShvcylcbiAgbGV0IG4gPSBvcy5sZW5ndGhcbiAgY29uc3QgeHMgPSBBcnJheShuKVxuICBmb3IgKGxldCBpPTAsIG87IGk8bjsgKytpKSB7XG4gICAgeHNbaV0gPSB4XG4gICAgc3dpdGNoICh0eXBlb2YgKG8gPSBvc1tpXSkpIHtcbiAgICAgIGNhc2UgXCJzdHJpbmdcIjpcbiAgICAgICAgeCA9IGdldFByb3AobywgeClcbiAgICAgICAgYnJlYWtcbiAgICAgIGNhc2UgXCJudW1iZXJcIjpcbiAgICAgICAgeCA9IGdldEluZGV4KG8sIHgpXG4gICAgICAgIGJyZWFrXG4gICAgICBkZWZhdWx0OlxuICAgICAgICB4ID0gY29tcG9zZWQoaSwgb3MpKElkZW50LCB4aTJ5IHx8IGFsd2F5cyh5KSwgeCwgb3NbaS0xXSlcbiAgICAgICAgbiA9IGlcbiAgICAgICAgYnJlYWtcbiAgICB9XG4gIH1cbiAgaWYgKG4gPT09IG9zLmxlbmd0aClcbiAgICB4ID0geGkyeSA/IHhpMnkoeCwgb3Nbbi0xXSkgOiB5XG4gIGZvciAobGV0IG87IDAgPD0gLS1uOylcbiAgICB4ID0gaXNTdHJpbmcobyA9IG9zW25dKVxuICAgICAgICA/IHNldFByb3AobywgeCwgeHNbbl0pXG4gICAgICAgIDogc2V0SW5kZXgobywgeCwgeHNbbl0pXG4gIHJldHVybiB4XG59XG5cbi8vXG5cbmZ1bmN0aW9uIGdldFBpY2sodGVtcGxhdGUsIHgpIHtcbiAgbGV0IHJcbiAgZm9yIChjb25zdCBrIGluIHRlbXBsYXRlKSB7XG4gICAgY29uc3QgdiA9IGdldFUodGVtcGxhdGVba10sIHgpXG4gICAgaWYgKHZvaWQgMCAhPT0gdikge1xuICAgICAgaWYgKCFyKVxuICAgICAgICByID0ge31cbiAgICAgIHJba10gPSB2XG4gICAgfVxuICB9XG4gIHJldHVybiByXG59XG5cbmNvbnN0IHNldFBpY2sgPSAodGVtcGxhdGUsIHgpID0+IHZhbHVlID0+IHtcbiAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIiAmJlxuICAgICAgISh2b2lkIDAgPT09IHZhbHVlIHx8IHZhbHVlIGluc3RhbmNlb2YgT2JqZWN0KSlcbiAgICBlcnJvckdpdmVuKFwiYHBpY2tgIG11c3QgYmUgc2V0IHdpdGggdW5kZWZpbmVkIG9yIGFuIG9iamVjdFwiLCB2YWx1ZSlcbiAgZm9yIChjb25zdCBrIGluIHRlbXBsYXRlKVxuICAgIHggPSBzZXRVKHRlbXBsYXRlW2tdLCB2YWx1ZSAmJiB2YWx1ZVtrXSwgeClcbiAgcmV0dXJuIHhcbn1cblxuLy9cblxuY29uc3QgdG9PYmplY3QgPSB4ID0+IGNvbnN0cnVjdG9yT2YoeCkgIT09IE9iamVjdCA/IE9iamVjdC5hc3NpZ24oe30sIHgpIDogeFxuXG4vL1xuXG5jb25zdCBicmFuY2hPbk1lcmdlID0gKHgsIGtleXMpID0+IHhzID0+IHtcbiAgY29uc3QgbyA9IHt9LCBuID0ga2V5cy5sZW5ndGhcbiAgZm9yIChsZXQgaT0wOyBpPG47ICsraSwgeHM9eHNbMV0pIHtcbiAgICBjb25zdCB2ID0geHNbMF1cbiAgICBvW2tleXNbaV1dID0gdm9pZCAwICE9PSB2ID8gdiA6IG9cbiAgfVxuICBsZXQgclxuICB4ID0gdG9PYmplY3QoeClcbiAgZm9yIChjb25zdCBrIGluIHgpIHtcbiAgICBjb25zdCB2ID0gb1trXVxuICAgIGlmIChvICE9PSB2KSB7XG4gICAgICBvW2tdID0gb1xuICAgICAgaWYgKCFyKVxuICAgICAgICByID0ge31cbiAgICAgIHJba10gPSB2b2lkIDAgIT09IHYgPyB2IDogeFtrXVxuICAgIH1cbiAgfVxuICBmb3IgKGxldCBpPTA7IGk8bjsgKytpKSB7XG4gICAgY29uc3QgayA9IGtleXNbaV1cbiAgICBjb25zdCB2ID0gb1trXVxuICAgIGlmIChvICE9PSB2KSB7XG4gICAgICBpZiAoIXIpXG4gICAgICAgIHIgPSB7fVxuICAgICAgcltrXSA9IHZcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJcbn1cblxuZnVuY3Rpb24gYnJhbmNoT25MYXp5KGtleXMsIHZhbHMsIG1hcCwgYXAsIHosIGRlbGF5LCBBLCB4aTJ5QSwgeCwgaSkge1xuICBpZiAoaSA8IGtleXMubGVuZ3RoKSB7XG4gICAgY29uc3QgayA9IGtleXNbaV0sIHYgPSB4W2tdXG4gICAgcmV0dXJuIGFwKG1hcChjcGFpcixcbiAgICAgICAgICAgICAgICAgIHZhbHMgPyB2YWxzW2ldKEEsIHhpMnlBLCB4W2tdLCBrKSA6IHhpMnlBKHYsIGspKSwgZGVsYXkoKCkgPT5cbiAgICAgICAgICAgICAgYnJhbmNoT25MYXp5KGtleXMsIHZhbHMsIG1hcCwgYXAsIHosIGRlbGF5LCBBLCB4aTJ5QSwgeCwgaSsxKSkpXG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHpcbiAgfVxufVxuXG5jb25zdCBicmFuY2hPbiA9IChrZXlzLCB2YWxzKSA9PiAoQSwgeGkyeUEsIHgsIF8pID0+IHtcbiAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIilcbiAgICByZXFBcHBsaWNhdGl2ZShBKVxuICBjb25zdCB7bWFwLCBhcCwgb2YsIGRlbGF5fSA9IEFcbiAgbGV0IGkgPSBrZXlzLmxlbmd0aFxuICBpZiAoIWkpXG4gICAgcmV0dXJuIG9mKG9iamVjdDBUb1VuZGVmaW5lZCh4KSlcbiAgaWYgKCEoeCBpbnN0YW5jZW9mIE9iamVjdCkpXG4gICAgeCA9IG9iamVjdDBcbiAgbGV0IHhzQSA9IG9mKDApXG4gIGlmIChkZWxheSkge1xuICAgIHhzQSA9IGJyYW5jaE9uTGF6eShrZXlzLCB2YWxzLCBtYXAsIGFwLCB4c0EsIGRlbGF5LCBBLCB4aTJ5QSwgeCwgMClcbiAgfSBlbHNlIHtcbiAgICB3aGlsZSAoaS0tKSB7XG4gICAgICBjb25zdCBrID0ga2V5c1tpXSwgdiA9IHhba11cbiAgICAgIHhzQSA9IGFwKG1hcChjcGFpciwgdmFscyA/IHZhbHNbaV0oQSwgeGkyeUEsIHYsIGspIDogeGkyeUEodiwgaykpLCB4c0EpXG4gICAgfVxuICB9XG4gIHJldHVybiBtYXAoYnJhbmNoT25NZXJnZSh4LCBrZXlzKSwgeHNBKVxufVxuXG5jb25zdCByZXBsYWNlZCA9IChpbm4sIG91dCwgeCkgPT4gYWN5Y2xpY0VxdWFsc1UoeCwgaW5uKSA/IG91dCA6IHhcblxuZnVuY3Rpb24gZmluZEluZGV4KHhpMmIsIHhzKSB7XG4gIGZvciAobGV0IGk9MCwgbj14cy5sZW5ndGg7IGk8bjsgKytpKVxuICAgIGlmICh4aTJiKHhzW2ldLCBpKSlcbiAgICAgIHJldHVybiBpXG4gIHJldHVybiAtMVxufVxuXG5mdW5jdGlvbiBwYXJ0aXRpb25JbnRvSW5kZXgoeGkyYiwgeHMsIHRzLCBmcykge1xuICBmb3IgKGxldCBpPTAsIG49eHMubGVuZ3RoLCB4OyBpPG47ICsraSlcbiAgICAoeGkyYih4ID0geHNbaV0sIGkpID8gdHMgOiBmcykucHVzaCh4KVxufVxuXG5jb25zdCBmcm9tUmVhZGVyID0gd2kyeCA9PiAoRiwgeGkyeUYsIHcsIGkpID0+XG4gICgwLEYubWFwKShhbHdheXModyksIHhpMnlGKHdpMngodywgaSksIGkpKVxuXG4vL1xuXG5leHBvcnQgZnVuY3Rpb24gdG9GdW5jdGlvbihvKSB7XG4gIHN3aXRjaCAodHlwZW9mIG8pIHtcbiAgICBjYXNlIFwic3RyaW5nXCI6XG4gICAgICByZXR1cm4gZnVuUHJvcChvKVxuICAgIGNhc2UgXCJudW1iZXJcIjpcbiAgICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIgJiYgIWlzVmFsaWRJbmRleChvKSlcbiAgICAgICAgZXJyb3JHaXZlbihcIk9ubHkgbm9uLW5lZ2F0aXZlIGludGVnZXJzIGNhbiBiZSB1c2VkIGFzIGxlbnNlc1wiLCBvKVxuICAgICAgcmV0dXJuIGZ1bkluZGV4KG8pXG4gICAgY2FzZSBcIm9iamVjdFwiOlxuICAgICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIilcbiAgICAgICAgcmVxQXJyYXkobylcbiAgICAgIHJldHVybiBjb21wb3NlZCgwLCBvKVxuICAgIGRlZmF1bHQ6XG4gICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKVxuICAgICAgICByZXFGdW5jdGlvbihvKVxuICAgICAgcmV0dXJuIG8ubGVuZ3RoID09PSA0ID8gbyA6IGZyb21SZWFkZXIobylcbiAgfVxufVxuXG4vLyBPcGVyYXRpb25zIG9uIG9wdGljc1xuXG5leHBvcnQgY29uc3QgbW9kaWZ5ID0gY3VycnkoKG8sIHhpMngsIHMpID0+IHtcbiAgc3dpdGNoICh0eXBlb2Ygbykge1xuICAgIGNhc2UgXCJzdHJpbmdcIjpcbiAgICAgIHJldHVybiBzZXRQcm9wKG8sIHhpMngoZ2V0UHJvcChvLCBzKSwgbyksIHMpXG4gICAgY2FzZSBcIm51bWJlclwiOlxuICAgICAgcmV0dXJuIHNldEluZGV4KG8sIHhpMngoZ2V0SW5kZXgobywgcyksIG8pLCBzKVxuICAgIGNhc2UgXCJvYmplY3RcIjpcbiAgICAgIHJldHVybiBtb2RpZnlDb21wb3NlZChvLCB4aTJ4LCBzKVxuICAgIGRlZmF1bHQ6XG4gICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKVxuICAgICAgICByZXFGdW5jdGlvbihvKVxuICAgICAgcmV0dXJuIG8ubGVuZ3RoID09PSA0XG4gICAgICAgID8gbyhJZGVudCwgeGkyeCwgcywgdm9pZCAwKVxuICAgICAgICA6ICh4aTJ4KG8ocywgdm9pZCAwKSwgdm9pZCAwKSwgcylcbiAgfVxufSlcblxuZXhwb3J0IGNvbnN0IHJlbW92ZSA9IGN1cnJ5KChvLCBzKSA9PiBzZXRVKG8sIHZvaWQgMCwgcykpXG5cbmV4cG9ydCBjb25zdCBzZXQgPSBjdXJyeShzZXRVKVxuXG4vLyBTZXF1ZW5jaW5nXG5cbmV4cG9ydCBmdW5jdGlvbiBzZXEoKSB7XG4gIGNvbnN0IG4gPSBhcmd1bWVudHMubGVuZ3RoLCB4TXMgPSBBcnJheShuKVxuICBmb3IgKGxldCBpPTA7IGk8bjsgKytpKVxuICAgIHhNc1tpXSA9IHRvRnVuY3Rpb24oYXJndW1lbnRzW2ldKVxuICBjb25zdCBsb29wID0gKE0sIHhpMnhNLCBpLCBqKSA9PiBqID09PSBuXG4gICAgPyBNLm9mXG4gICAgOiB4ID0+ICgwLE0uY2hhaW4pKGxvb3AoTSwgeGkyeE0sIGksIGorMSksIHhNc1tqXShNLCB4aTJ4TSwgeCwgaSkpXG4gIHJldHVybiAoTSwgeGkyeE0sIHgsIGkpID0+IHtcbiAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiICYmICFNLmNoYWluKVxuICAgICAgZXJyb3JHaXZlbihcImBzZXFgIHJlcXVpcmVzIGEgbW9uYWRcIiwgTSlcbiAgICByZXR1cm4gbG9vcChNLCB4aTJ4TSwgaSwgMCkoeClcbiAgfVxufVxuXG4vLyBOZXN0aW5nXG5cbmV4cG9ydCBmdW5jdGlvbiBjb21wb3NlKCkge1xuICBsZXQgbiA9IGFyZ3VtZW50cy5sZW5ndGhcbiAgaWYgKG4gPCAyKSB7XG4gICAgcmV0dXJuIG4gPyBhcmd1bWVudHNbMF0gOiBpZGVudGl0eVxuICB9IGVsc2Uge1xuICAgIGNvbnN0IGxlbnNlcyA9IEFycmF5KG4pXG4gICAgd2hpbGUgKG4tLSlcbiAgICAgIGxlbnNlc1tuXSA9IGFyZ3VtZW50c1tuXVxuICAgIHJldHVybiBsZW5zZXNcbiAgfVxufVxuXG4vLyBRdWVyeWluZ1xuXG5leHBvcnQgY29uc3QgY2hhaW4gPSBjdXJyeSgoeGkyeU8sIHhPKSA9PlxuICBbeE8sIGNob29zZSgoeE0sIGkpID0+IHZvaWQgMCAhPT0geE0gPyB4aTJ5Tyh4TSwgaSkgOiB6ZXJvKV0pXG5cbmV4cG9ydCBjb25zdCBjaG9pY2UgPSAoLi4ubHMpID0+IGNob29zZSh4ID0+IHtcbiAgY29uc3QgaSA9IGZpbmRJbmRleChsID0+IHZvaWQgMCAhPT0gZ2V0VShsLCB4KSwgbHMpXG4gIHJldHVybiBpIDwgMCA/IHplcm8gOiBsc1tpXVxufSlcblxuZXhwb3J0IGNvbnN0IGNob29zZSA9IHhpTTJvID0+IChDLCB4aTJ5QywgeCwgaSkgPT5cbiAgcnVuKHhpTTJvKHgsIGkpLCBDLCB4aTJ5QywgeCwgaSlcblxuZXhwb3J0IGNvbnN0IHdoZW4gPSBwID0+IChDLCB4aTJ5QywgeCwgaSkgPT5cbiAgcCh4LCBpKSA/IHhpMnlDKHgsIGkpIDogemVybyhDLCB4aTJ5QywgeCwgaSlcblxuZXhwb3J0IGNvbnN0IG9wdGlvbmFsID0gd2hlbihpc0RlZmluZWQpXG5cbmV4cG9ydCBmdW5jdGlvbiB6ZXJvKEMsIHhpMnlDLCB4LCBpKSB7XG4gIGNvbnN0IG9mID0gQy5vZlxuICByZXR1cm4gb2YgPyBvZih4KSA6ICgwLEMubWFwKShhbHdheXMoeCksIHhpMnlDKHZvaWQgMCwgaSkpXG59XG5cbi8vIFJlY3Vyc2luZ1xuXG5leHBvcnQgZnVuY3Rpb24gbGF6eShvMm8pIHtcbiAgbGV0IG1lbW8gPSAoQywgeGkyeUMsIHgsIGkpID0+IChtZW1vID0gdG9GdW5jdGlvbihvMm8ocmVjKSkpKEMsIHhpMnlDLCB4LCBpKVxuICBmdW5jdGlvbiByZWMoQywgeGkyeUMsIHgsIGkpIHtyZXR1cm4gbWVtbyhDLCB4aTJ5QywgeCwgaSl9XG4gIHJldHVybiByZWNcbn1cblxuLy8gRGVidWdnaW5nXG5cbmV4cG9ydCBmdW5jdGlvbiBsb2coKSB7XG4gIGNvbnN0IHNob3cgPSBjdXJyeSgoZGlyLCB4KSA9PlxuICAgKGNvbnNvbGUubG9nLmFwcGx5KGNvbnNvbGUsXG4gICAgICAgICAgICAgICAgICAgICAgY29weVRvRnJvbShbXSwgMCwgYXJndW1lbnRzLCAwLCBhcmd1bWVudHMubGVuZ3RoKVxuICAgICAgICAgICAgICAgICAgICAgIC5jb25jYXQoW2RpciwgeF0pKSxcbiAgICB4KSlcbiAgcmV0dXJuIGlzbyhzaG93KFwiZ2V0XCIpLCBzaG93KFwic2V0XCIpKVxufVxuXG4vLyBPcGVyYXRpb25zIG9uIHRyYXZlcnNhbHNcblxuZXhwb3J0IGNvbnN0IGNvbmNhdEFzID0gY3VycnlOKDQsICh4TWkyeSwgbSkgPT4ge1xuICBjb25zdCBDID0gQ29uY2F0T2YobS5jb25jYXQsICgwLG0uZW1wdHkpKCksIG0uZGVsYXkpXG4gIHJldHVybiAodCwgcykgPT4gcnVuKHQsIEMsIHhNaTJ5LCBzKVxufSlcblxuZXhwb3J0IGNvbnN0IGNvbmNhdCA9IGNvbmNhdEFzKGlkKVxuXG5leHBvcnQgY29uc3QgbWVyZ2VBcyA9IHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSBcInByb2R1Y3Rpb25cIiA/IGNvbmNhdEFzIDogKGYsIG0sIHQsIGQpID0+XG4gIHdhcm4obWVyZ2VBcywgXCJgbWVyZ2VBc2AgaXMgb2Jzb2xldGUsIGp1c3QgdXNlIGBjb25jYXRBc2BcIikgfHxcbiAgY29uY2F0QXMoZiwgbSwgdCwgZClcblxuZXhwb3J0IGNvbnN0IG1lcmdlID0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09IFwicHJvZHVjdGlvblwiID8gY29uY2F0IDogKG0sIHQsIGQpID0+XG4gIHdhcm4obWVyZ2UsIFwiYG1lcmdlYCBpcyBvYnNvbGV0ZSwganVzdCB1c2UgYGNvbmNhdGBcIikgfHxcbiAgY29uY2F0KG0sIHQsIGQpXG5cbi8vIEZvbGRzIG92ZXIgdHJhdmVyc2Fsc1xuXG5leHBvcnQgY29uc3QgYWxsID0gcGlwZTJVKG1rRmlyc3QoeCA9PiB4ID8gdm9pZCAwIDogVCksIG5vdClcblxuZXhwb3J0IGNvbnN0IGFuZCA9IGFsbChpZClcblxuZXhwb3J0IGNvbnN0IGFueSA9IHBpcGUyVShta0ZpcnN0KHggPT4geCA/IFQgOiB2b2lkIDApLCBCb29sZWFuKVxuXG5leHBvcnQgY29uc3QgY29sbGVjdEFzID0gY3VycnkoKHhpMnksIHQsIHMpID0+XG4gIHRvQXJyYXkocnVuKHQsIENvbGxlY3QsIHhpMnksIHMpKSB8fCBbXSlcblxuZXhwb3J0IGNvbnN0IGNvbGxlY3QgPSBjb2xsZWN0QXMoaWQpXG5cbmV4cG9ydCBjb25zdCBjb3VudCA9IGNvbmNhdEFzKHggPT4gdm9pZCAwICE9PSB4ID8gMSA6IDAsIFN1bSlcblxuZXhwb3J0IGNvbnN0IGZpcnN0QXMgPSBjdXJyeShta0ZpcnN0KHggPT4gdm9pZCAwICE9PSB4ID8gdGhlKHgpIDogeCkpXG5cbmV4cG9ydCBjb25zdCBmaXJzdCA9IGZpcnN0QXMoaWQpXG5cbmV4cG9ydCBjb25zdCBsYXN0ID0gY2hvb3NlKG1heWJlQXJyYXkgPT4gc2VlbXNBcnJheUxpa2UobWF5YmVBcnJheSkgJiYgbWF5YmVBcnJheS5sZW5ndGggPyBtYXliZUFycmF5Lmxlbmd0aC0xIDogYXBwZW5kKVxuXG5leHBvcnQgY29uc3QgZm9sZGwgPSBjdXJyeSgoZiwgciwgdCwgcykgPT5cbiAgZm9sZChmLCByLCBydW4odCwgQ29sbGVjdCwgcGFpciwgcykpKVxuXG5leHBvcnQgY29uc3QgZm9sZHIgPSBjdXJyeSgoZiwgciwgdCwgcykgPT4ge1xuICBjb25zdCB4cyA9IGNvbGxlY3RBcyhwYWlyLCB0LCBzKVxuICBmb3IgKGxldCBpPXhzLmxlbmd0aC0xOyAwPD1pOyAtLWkpIHtcbiAgICBjb25zdCB4ID0geHNbaV1cbiAgICByID0gZihyLCB4WzBdLCB4WzFdKVxuICB9XG4gIHJldHVybiByXG59KVxuXG5leHBvcnQgY29uc3QgbWF4aW11bSA9IGNvbmNhdChNdW0oKHgsIHkpID0+IHggPiB5KSlcblxuZXhwb3J0IGNvbnN0IG1pbmltdW0gPSBjb25jYXQoTXVtKCh4LCB5KSA9PiB4IDwgeSkpXG5cbmV4cG9ydCBjb25zdCBvciA9IGFueShpZClcblxuZXhwb3J0IGNvbnN0IHByb2R1Y3QgPSBjb25jYXRBcyh1bnRvKDEpLCBNb25vaWQoKHksIHgpID0+IHggKiB5LCAxKSlcblxuZXhwb3J0IGNvbnN0IHN1bSA9IGNvbmNhdEFzKHVudG8oMCksIFN1bSlcblxuLy8gQ3JlYXRpbmcgbmV3IHRyYXZlcnNhbHNcblxuZXhwb3J0IGZ1bmN0aW9uIGJyYW5jaCh0ZW1wbGF0ZSkge1xuICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiICYmICFpc09iamVjdCh0ZW1wbGF0ZSkpXG4gICAgZXJyb3JHaXZlbihcImBicmFuY2hgIGV4cGVjdHMgYSBwbGFpbiBPYmplY3QgdGVtcGxhdGVcIiwgdGVtcGxhdGUpXG4gIGNvbnN0IGtleXMgPSBbXSwgdmFscyA9IFtdXG4gIGZvciAoY29uc3QgayBpbiB0ZW1wbGF0ZSkge1xuICAgIGtleXMucHVzaChrKVxuICAgIHZhbHMucHVzaCh0b0Z1bmN0aW9uKHRlbXBsYXRlW2tdKSlcbiAgfVxuICByZXR1cm4gYnJhbmNoT24oa2V5cywgdmFscylcbn1cblxuLy8gVHJhdmVyc2FscyBhbmQgY29tYmluYXRvcnNcblxuZXhwb3J0IGZ1bmN0aW9uIGVsZW1zKEEsIHhpMnlBLCB4cywgXykge1xuICBpZiAoc2VlbXNBcnJheUxpa2UoeHMpKSB7XG4gICAgcmV0dXJuIEEgPT09IElkZW50XG4gICAgICA/IG1hcFBhcnRpYWxJbmRleFUoeGkyeUEsIHhzKVxuICAgICAgOiB0cmF2ZXJzZVBhcnRpYWxJbmRleChBLCB4aTJ5QSwgeHMpXG4gIH0gZWxzZSB7XG4gICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIilcbiAgICAgIHJlcUFwcGxpY2F0aXZlKEEpXG4gICAgcmV0dXJuICgwLEEub2YpKHhzKVxuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB2YWx1ZXMoQSwgeGkyeUEsIHhzLCBfKSB7XG4gIGlmICh4cyBpbnN0YW5jZW9mIE9iamVjdCkge1xuICAgIHJldHVybiBicmFuY2hPbihrZXlzKHhzKSkoQSwgeGkyeUEsIHhzKVxuICB9IGVsc2Uge1xuICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpXG4gICAgICByZXFBcHBsaWNhdGl2ZShBKVxuICAgIHJldHVybiAoMCxBLm9mKSh4cylcbiAgfVxufVxuXG4vLyBPcGVyYXRpb25zIG9uIGxlbnNlc1xuXG5leHBvcnQgY29uc3QgZ2V0ID0gY3VycnkoZ2V0VSlcblxuLy8gQ3JlYXRpbmcgbmV3IGxlbnNlc1xuXG5leHBvcnQgY29uc3QgbGVucyA9IGN1cnJ5KChnZXQsIHNldCkgPT4gKEYsIHhpMnlGLCB4LCBpKSA9PlxuICAoMCxGLm1hcCkoeSA9PiBzZXQoeSwgeCwgaSksIHhpMnlGKGdldCh4LCBpKSwgaSkpKVxuXG4vLyBDb21wdXRpbmcgZGVyaXZlZCBwcm9wc1xuXG5leHBvcnQgZnVuY3Rpb24gYXVnbWVudCh0ZW1wbGF0ZSkge1xuICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiICYmICFpc09iamVjdCh0ZW1wbGF0ZSkpXG4gICAgZXJyb3JHaXZlbihcImBhdWdtZW50YCBleHBlY3RzIGEgcGxhaW4gT2JqZWN0IHRlbXBsYXRlXCIsIHRlbXBsYXRlKVxuICByZXR1cm4gbGVucyhcbiAgICB4ID0+IHtcbiAgICAgIHggPSBkaXNzb2NQYXJ0aWFsVSgwLCB4KVxuICAgICAgaWYgKHgpXG4gICAgICAgIGZvciAoY29uc3QgayBpbiB0ZW1wbGF0ZSlcbiAgICAgICAgICB4W2tdID0gdGVtcGxhdGVba10oeClcbiAgICAgIHJldHVybiB4XG4gICAgfSxcbiAgICAoeSwgeCkgPT4ge1xuICAgICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIiAmJlxuICAgICAgICAgICEodm9pZCAwID09PSB5IHx8IHkgaW5zdGFuY2VvZiBPYmplY3QpKVxuICAgICAgICBlcnJvckdpdmVuKFwiYGF1Z21lbnRgIG11c3QgYmUgc2V0IHdpdGggdW5kZWZpbmVkIG9yIGFuIG9iamVjdFwiLCB5KVxuICAgICAgeSA9IHRvT2JqZWN0KHkpXG4gICAgICBpZiAoISh4IGluc3RhbmNlb2YgT2JqZWN0KSlcbiAgICAgICAgeCA9IHZvaWQgMFxuICAgICAgbGV0IHpcbiAgICAgIGZ1bmN0aW9uIHNldChrLCB2KSB7XG4gICAgICAgIGlmICgheilcbiAgICAgICAgICB6ID0ge31cbiAgICAgICAgeltrXSA9IHZcbiAgICAgIH1cbiAgICAgIGZvciAoY29uc3QgayBpbiB5KSB7XG4gICAgICAgIGlmICghaGFzVShrLCB0ZW1wbGF0ZSkpXG4gICAgICAgICAgc2V0KGssIHlba10pXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBpZiAoeCAmJiBoYXNVKGssIHgpKVxuICAgICAgICAgICAgc2V0KGssIHhba10pXG4gICAgICB9XG4gICAgICByZXR1cm4gelxuICAgIH0pXG59XG5cbi8vIEVuZm9yY2luZyBpbnZhcmlhbnRzXG5cbmV4cG9ydCBmdW5jdGlvbiBkZWZhdWx0cyhvdXQpIHtcbiAgY29uc3QgbzJ1ID0geCA9PiByZXBsYWNlZChvdXQsIHZvaWQgMCwgeClcbiAgcmV0dXJuIChGLCB4aTJ5RiwgeCwgaSkgPT4gKDAsRi5tYXApKG8ydSwgeGkyeUYodm9pZCAwICE9PSB4ID8geCA6IG91dCwgaSkpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkZWZpbmUodikge1xuICBjb25zdCB1bnRvViA9IHVudG8odilcbiAgcmV0dXJuIChGLCB4aTJ5RiwgeCwgaSkgPT4gKDAsRi5tYXApKHVudG9WLCB4aTJ5Rih2b2lkIDAgIT09IHggPyB4IDogdiwgaSkpXG59XG5cbmV4cG9ydCBjb25zdCBub3JtYWxpemUgPSB4aTJ4ID0+IChGLCB4aTJ5RiwgeCwgaSkgPT5cbiAgKDAsRi5tYXApKHggPT4gdm9pZCAwICE9PSB4ID8geGkyeCh4LCBpKSA6IHgsXG4gICAgICAgICAgICB4aTJ5Rih2b2lkIDAgIT09IHggPyB4aTJ4KHgsIGkpIDogeCwgaSkpXG5cbmV4cG9ydCBjb25zdCByZXF1aXJlZCA9IGlubiA9PiByZXBsYWNlKGlubiwgdm9pZCAwKVxuXG5leHBvcnQgY29uc3QgcmV3cml0ZSA9IHlpMnkgPT4gKEYsIHhpMnlGLCB4LCBpKSA9PlxuICAoMCxGLm1hcCkoeSA9PiB2b2lkIDAgIT09IHkgPyB5aTJ5KHksIGkpIDogeSwgeGkyeUYoeCwgaSkpXG5cbi8vIExlbnNpbmcgYXJyYXlzXG5cbmV4cG9ydCBjb25zdCBhcHBlbmQgPSAoRiwgeGkyeUYsIHhzLCBpKSA9PlxuICAoMCxGLm1hcCkoeCA9PiBzZXRJbmRleChzZWVtc0FycmF5TGlrZSh4cykgPyB4cy5sZW5ndGggOiAwLCB4LCB4cyksXG4gICAgICAgICAgICB4aTJ5Rih2b2lkIDAsIGkpKVxuXG5leHBvcnQgY29uc3QgZmlsdGVyID0geGkyYiA9PiAoRiwgeGkyeUYsIHhzLCBpKSA9PiB7XG4gIGxldCB0cywgZnNcbiAgaWYgKHNlZW1zQXJyYXlMaWtlKHhzKSlcbiAgICBwYXJ0aXRpb25JbnRvSW5kZXgoeGkyYiwgeHMsIHRzID0gW10sIGZzID0gW10pXG4gIHJldHVybiAoMCxGLm1hcCkoXG4gICAgdHMgPT4ge1xuICAgICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIiAmJlxuICAgICAgICAgICEodm9pZCAwID09PSB0cyB8fCBzZWVtc0FycmF5TGlrZSh0cykpKVxuICAgICAgICBlcnJvckdpdmVuKFwiYGZpbHRlcmAgbXVzdCBiZSBzZXQgd2l0aCB1bmRlZmluZWQgb3IgYW4gYXJyYXktbGlrZSBvYmplY3RcIiwgdHMpXG4gICAgICBjb25zdCB0c04gPSB0cyA/IHRzLmxlbmd0aCA6IDAsXG4gICAgICAgICAgICBmc04gPSBmcyA/IGZzLmxlbmd0aCA6IDAsXG4gICAgICAgICAgICBuID0gdHNOICsgZnNOXG4gICAgICBpZiAobilcbiAgICAgICAgcmV0dXJuIG4gPT09IGZzTlxuICAgICAgICA/IGZzXG4gICAgICAgIDogY29weVRvRnJvbShjb3B5VG9Gcm9tKEFycmF5KG4pLCAwLCB0cywgMCwgdHNOKSwgdHNOLCBmcywgMCwgZnNOKVxuICAgIH0sXG4gICAgeGkyeUYodHMsIGkpKVxufVxuXG5leHBvcnQgY29uc3QgZmluZCA9IHhpMmIgPT4gY2hvb3NlKHhzID0+IHtcbiAgaWYgKCFzZWVtc0FycmF5TGlrZSh4cykpXG4gICAgcmV0dXJuIDBcbiAgY29uc3QgaSA9IGZpbmRJbmRleCh4aTJiLCB4cylcbiAgcmV0dXJuIGkgPCAwID8gYXBwZW5kIDogaVxufSlcblxuZXhwb3J0IGZ1bmN0aW9uIGZpbmRXaXRoKC4uLmxzKSB7XG4gIGNvbnN0IGxscyA9IGNvbXBvc2UoLi4ubHMpXG4gIHJldHVybiBbZmluZCh4ID0+IHZvaWQgMCAhPT0gZ2V0VShsbHMsIHgpKSwgbGxzXVxufVxuXG5leHBvcnQgY29uc3QgaW5kZXggPSBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gXCJwcm9kdWN0aW9uXCIgPyBpZCA6IHggPT4ge1xuICBpZiAoIWlzVmFsaWRJbmRleCh4KSlcbiAgICBlcnJvckdpdmVuKFwiYGluZGV4YCBleHBlY3RzIGEgbm9uLW5lZ2F0aXZlIGludGVnZXJcIiwgeClcbiAgcmV0dXJuIHhcbn1cblxuZXhwb3J0IGNvbnN0IHNsaWNlID0gY3VycnkoKGJlZ2luLCBlbmQpID0+IChGLCB4c2kyeUYsIHhzLCBpKSA9PiB7XG4gIGNvbnN0IHNlZW1zID0gc2VlbXNBcnJheUxpa2UoeHMpLFxuICAgICAgICB4c04gPSBzZWVtcyAmJiB4cy5sZW5ndGgsXG4gICAgICAgIGIgPSBzbGljZUluZGV4KDAsIHhzTiwgMCwgYmVnaW4pLFxuICAgICAgICBlID0gc2xpY2VJbmRleChiLCB4c04sIHhzTiwgZW5kKVxuICByZXR1cm4gKDAsRi5tYXApKFxuICAgIHpzID0+IHtcbiAgICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIgJiZcbiAgICAgICAgICAhKHZvaWQgMCA9PT0genMgfHwgc2VlbXNBcnJheUxpa2UoenMpKSlcbiAgICAgICAgZXJyb3JHaXZlbihcImBzbGljZWAgbXVzdCBiZSBzZXQgd2l0aCB1bmRlZmluZWQgb3IgYW4gYXJyYXktbGlrZSBvYmplY3RcIiwgenMpXG4gICAgICBjb25zdCB6c04gPSB6cyA/IHpzLmxlbmd0aCA6IDAsIGJQenNOID0gYiArIHpzTiwgbiA9IHhzTiAtIGUgKyBiUHpzTlxuICAgICAgcmV0dXJuIG5cbiAgICAgICAgPyBjb3B5VG9Gcm9tKGNvcHlUb0Zyb20oY29weVRvRnJvbShBcnJheShuKSwgMCwgeHMsIDAsIGIpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB6cywgMCwgenNOKSxcbiAgICAgICAgICAgICAgICAgICAgIGJQenNOLFxuICAgICAgICAgICAgICAgICAgICAgeHMsIGUsIHhzTilcbiAgICAgICAgOiB2b2lkIDBcbiAgICB9LFxuICAgIHhzaTJ5RihzZWVtcyA/IGNvcHlUb0Zyb20oQXJyYXkoTWF0aC5tYXgoMCwgZSAtIGIpKSwgMCwgeHMsIGIsIGUpIDpcbiAgICAgICAgICAgdm9pZCAwLFxuICAgICAgICAgICBpKSlcbn0pXG5cbi8vIExlbnNpbmcgb2JqZWN0c1xuXG5leHBvcnQgY29uc3QgcHJvcCA9IHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSBcInByb2R1Y3Rpb25cIiA/IGlkIDogeCA9PiB7XG4gIGlmICghaXNTdHJpbmcoeCkpXG4gICAgZXJyb3JHaXZlbihcImBwcm9wYCBleHBlY3RzIGEgc3RyaW5nXCIsIHgpXG4gIHJldHVybiB4XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwcm9wcygpIHtcbiAgY29uc3QgbiA9IGFyZ3VtZW50cy5sZW5ndGgsIHRlbXBsYXRlID0ge31cbiAgZm9yIChsZXQgaT0wLCBrOyBpPG47ICsraSlcbiAgICB0ZW1wbGF0ZVtrID0gYXJndW1lbnRzW2ldXSA9IGtcbiAgcmV0dXJuIHBpY2sodGVtcGxhdGUpXG59XG5cbmV4cG9ydCBjb25zdCByZW1vdmFibGUgPSAoLi4ucHMpID0+IHtcbiAgZnVuY3Rpb24gZHJvcCh5KSB7XG4gICAgaWYgKCEoeSBpbnN0YW5jZW9mIE9iamVjdCkpXG4gICAgICByZXR1cm4geVxuICAgIGZvciAobGV0IGk9MCwgbj1wcy5sZW5ndGg7IGk8bjsgKytpKVxuICAgICAgaWYgKGhhc1UocHNbaV0sIHkpKVxuICAgICAgICByZXR1cm4geVxuICB9XG4gIHJldHVybiAoRiwgeGkyeUYsIHgsIGkpID0+ICgwLEYubWFwKShkcm9wLCB4aTJ5Rih4LCBpKSlcbn1cblxuLy8gUHJvdmlkaW5nIGRlZmF1bHRzXG5cbmV4cG9ydCBjb25zdCB2YWx1ZU9yID0gdiA9PiAoX0YsIHhpMnlGLCB4LCBpKSA9PlxuICB4aTJ5Rih2b2lkIDAgIT09IHggJiYgeCAhPT0gbnVsbCA/IHggOiB2LCBpKVxuXG4vLyBBZGFwdGluZyB0byBkYXRhXG5cbmV4cG9ydCBjb25zdCBvckVsc2UgPVxuICBjdXJyeSgoZCwgbCkgPT4gY2hvb3NlKHggPT4gdm9pZCAwICE9PSBnZXRVKGwsIHgpID8gbCA6IGQpKVxuXG4vLyBSZWFkLW9ubHkgbWFwcGluZ1xuXG5leHBvcnQgY29uc3QgdG8gPSBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gXCJwcm9kdWN0aW9uXCIgPyBpZCA6IHdpMnggPT5cbiAgd2Fybih0bywgXCJgdG9gIGlzIG9ic29sZXRlLCB5b3UgY2FuIGRpcmVjdGx5IGBjb21wb3NlYCBwbGFpbiBmdW5jdGlvbnMgd2l0aCBvcHRpY3NcIikgfHxcbiAgd2kyeFxuXG5leHBvcnQgY29uc3QganVzdCA9IHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSBcInByb2R1Y3Rpb25cIiA/IGFsd2F5cyA6IHggPT5cbiAgd2FybihqdXN0LCBcImBqdXN0YCBpcyBvYnNvbGV0ZSwganVzdCB1c2UgZS5nLiBgUi5hbHdheXNgXCIpIHx8XG4gIGFsd2F5cyh4KVxuXG4vLyBUcmFuc2Zvcm1pbmcgZGF0YVxuXG5leHBvcnQgZnVuY3Rpb24gcGljayh0ZW1wbGF0ZSkge1xuICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiICYmICFpc09iamVjdCh0ZW1wbGF0ZSkpXG4gICAgZXJyb3JHaXZlbihcImBwaWNrYCBleHBlY3RzIGEgcGxhaW4gT2JqZWN0IHRlbXBsYXRlXCIsIHRlbXBsYXRlKVxuICByZXR1cm4gKEYsIHhpMnlGLCB4LCBpKSA9PlxuICAgICgwLEYubWFwKShzZXRQaWNrKHRlbXBsYXRlLCB4KSwgeGkyeUYoZ2V0UGljayh0ZW1wbGF0ZSwgeCksIGkpKVxufVxuXG5leHBvcnQgY29uc3QgcmVwbGFjZSA9IGN1cnJ5KChpbm4sIG91dCkgPT4ge1xuICBjb25zdCBvMmkgPSB4ID0+IHJlcGxhY2VkKG91dCwgaW5uLCB4KVxuICByZXR1cm4gKEYsIHhpMnlGLCB4LCBpKSA9PiAoMCxGLm1hcCkobzJpLCB4aTJ5RihyZXBsYWNlZChpbm4sIG91dCwgeCksIGkpKVxufSlcblxuLy8gT3BlcmF0aW9ucyBvbiBpc29tb3JwaGlzbXNcblxuZXhwb3J0IGNvbnN0IGdldEludmVyc2UgPSBhcml0eU4oMiwgc2V0VSlcblxuLy8gQ3JlYXRpbmcgbmV3IGlzb21vcnBoaXNtc1xuXG5leHBvcnQgY29uc3QgaXNvID1cbiAgY3VycnkoKGJ3ZCwgZndkKSA9PiAoRiwgeGkyeUYsIHgsIGkpID0+ICgwLEYubWFwKShmd2QsIHhpMnlGKGJ3ZCh4KSwgaSkpKVxuXG4vLyBJc29tb3JwaGlzbXMgYW5kIGNvbWJpbmF0b3JzXG5cbmV4cG9ydCBjb25zdCBjb21wbGVtZW50ID0gaXNvKG5vdFBhcnRpYWwsIG5vdFBhcnRpYWwpXG5cbmV4cG9ydCBjb25zdCBpZGVudGl0eSA9IChfRiwgeGkyeUYsIHgsIGkpID0+IHhpMnlGKHgsIGkpXG5cbmV4cG9ydCBjb25zdCBpbnZlcnNlID0gaXNvID0+IChGLCB4aTJ5RiwgeCwgaSkgPT5cbiAgKDAsRi5tYXApKHggPT4gZ2V0VShpc28sIHgpLCB4aTJ5RihzZXRVKGlzbywgeCksIGkpKVxuIl19
