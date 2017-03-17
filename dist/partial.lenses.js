(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.L = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.inverse = exports.identity = exports.complement = exports.iso = exports.getInverse = exports.replace = exports.just = exports.to = exports.orElse = exports.valueOr = exports.removable = exports.prop = exports.slice = exports.last = exports.index = exports.find = exports.filter = exports.append = exports.rewrite = exports.required = exports.normalize = exports.lens = exports.get = exports.sum = exports.first = exports.firstAs = exports.select = exports.selectAs = exports.product = exports.or = exports.minimum = exports.maximum = exports.foldr = exports.foldl = exports.count = exports.collect = exports.collectAs = exports.any = exports.and = exports.all = exports.merge = exports.mergeAs = exports.concat = exports.concatAs = exports.optional = exports.when = exports.choose = exports.choice = exports.chain = exports.set = exports.remove = exports.modify = undefined;
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

var Select = ConcatOf(function (l, r) {
  return l && l() || r && r();
}, void 0, _infestines.id);

var mkSelect = function mkSelect(toM) {
  return function (xi2yM, t, s) {
    if ("dev" !== "production") warn(mkSelect, "Lazy folds over traversals are experimental");
    return s = run(t, Select, (0, _infestines.pipe2U)(xi2yM, toM), s), s && (s = s()) && s.v;
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

var mergeAs = exports.mergeAs = "dev" === "production" ? concatAs : (0, _infestines.curry)(function (f, m, t, d) {
  return warn(mergeAs, "`mergeAs` is obsolete, just use `concatAs`") || concatAs(f, m, t, d);
});

var merge = exports.merge = "dev" === "production" ? concat : (0, _infestines.curry)(function (m, t, d) {
  return warn(merge, "`merge` is obsolete, just use `concat`") || concat(m, t, d);
});

// Folds over traversals

var all = exports.all = (0, _infestines.pipe2U)(mkSelect(function (x) {
  return x ? void 0 : T;
}), not);

var and = exports.and = all(_infestines.id);

var any = exports.any = (0, _infestines.pipe2U)(mkSelect(function (x) {
  return x ? T : void 0;
}), Boolean);

var collectAs = exports.collectAs = (0, _infestines.curry)(function (xi2y, t, s) {
  return toArray(run(t, Collect, xi2y, s)) || [];
});

var collect = exports.collect = collectAs(_infestines.id);

var count = exports.count = concatAs(function (x) {
  return void 0 !== x ? 1 : 0;
}, Sum);

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

var selectAs = exports.selectAs = (0, _infestines.curry)(mkSelect(function (x) {
  return void 0 !== x ? the(x) : x;
}));

var select = exports.select = selectAs(_infestines.id);

var firstAs = exports.firstAs = "dev" === "production" ? selectAs : (0, _infestines.curry)(function (f, t, d) {
  return warn(firstAs, "`firstAs` has been renamed `selectAs`") || selectAs(f, t, d);
});

var first = exports.first = "dev" === "production" ? select : (0, _infestines.curry)(function (t, d) {
  return warn(first, "`first` has been renamed `select`") || select(t, d);
});

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

var last = exports.last = choose(function (maybeArray) {
  return seemsArrayLike(maybeArray) && maybeArray.length ? maybeArray.length - 1 : append;
});

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvcGFydGlhbC5sZW5zZXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7UUNpZGdCLFUsR0FBQSxVO1FBNENBLEcsR0FBQSxHO1FBZ0JBLE8sR0FBQSxPO1FBOEJBLEksR0FBQSxJO1FBT0EsSSxHQUFBLEk7UUFRQSxHLEdBQUEsRztRQTZFQSxNLEdBQUEsTTtRQWFBLEssR0FBQSxLO1FBWUEsTSxHQUFBLE07UUFxQkEsTyxHQUFBLE87UUFxQ0EsUSxHQUFBLFE7UUFLQSxNLEdBQUEsTTtRQStDQSxRLEdBQUEsUTtRQTZDQSxLLEdBQUEsSztRQXdDQSxJLEdBQUEsSTs7QUFuMkJoQjs7QUFzQkE7O0FBRUEsSUFBTSxhQUFhLFNBQWIsVUFBYSxDQUFDLENBQUQsRUFBSSxDQUFKLEVBQU8sQ0FBUCxFQUFVLENBQVY7QUFBQSxTQUNqQixLQUFLLENBQUwsS0FBVyxDQUFYLEdBQWUsS0FBSyxHQUFMLENBQVMsS0FBSyxHQUFMLENBQVMsQ0FBVCxFQUFZLElBQUksQ0FBSixHQUFRLElBQUksQ0FBWixHQUFnQixDQUE1QixDQUFULEVBQXlDLENBQXpDLENBQWYsR0FBNkQsQ0FENUM7QUFBQSxDQUFuQjs7QUFHQSxTQUFTLElBQVQsQ0FBYyxFQUFkLEVBQWtCLEVBQWxCLEVBQXNCO0FBQUMsU0FBTyxDQUFDLEVBQUQsRUFBSyxFQUFMLENBQVA7QUFBZ0I7QUFDdkMsSUFBTSxRQUFRLFNBQVIsS0FBUTtBQUFBLFNBQUs7QUFBQSxXQUFNLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBTjtBQUFBLEdBQUw7QUFBQSxDQUFkOztBQUVBLElBQU0sT0FBTyxTQUFQLElBQU87QUFBQSxTQUFLO0FBQUEsV0FBSyxLQUFLLENBQUwsS0FBVyxDQUFYLEdBQWUsQ0FBZixHQUFtQixDQUF4QjtBQUFBLEdBQUw7QUFBQSxDQUFiOztBQUVBLElBQU0sYUFBYSxTQUFiLFVBQWE7QUFBQSxT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QUFQLEVBQVUsSUFBVixDQUFuQjs7QUFFUDs7QUFFTyxJQUFNLG9CQUNYLHVCQUFNLFVBQUMsR0FBRCxFQUFNLEdBQU47QUFBQSxTQUFjLFVBQUMsQ0FBRCxFQUFJLEtBQUosRUFBVyxDQUFYLEVBQWMsQ0FBZDtBQUFBLFdBQW9CLENBQUMsR0FBRSxFQUFFLEdBQUwsRUFBVSxHQUFWLEVBQWUsTUFBTSxJQUFJLENBQUosQ0FBTixFQUFjLENBQWQsQ0FBZixDQUFwQjtBQUFBLEdBQWQ7QUFBQSxDQUFOLENBREs7O0FBR1A7O0FBRU8sSUFBTSxrQ0FBYSxJQUFJLFVBQUosRUFBZ0IsVUFBaEIsQ0FBbkI7O0FBRUEsSUFBTSw4QkFBVyxTQUFYLFFBQVcsQ0FBQyxFQUFELEVBQUssS0FBTCxFQUFZLENBQVosRUFBZSxDQUFmO0FBQUEsU0FBcUIsTUFBTSxDQUFOLEVBQVMsQ0FBVCxDQUFyQjtBQUFBLENBQWpCOztBQUVBLElBQU0sNEJBQVUsU0FBVixPQUFVO0FBQUEsU0FBTyxVQUFDLENBQUQsRUFBSSxLQUFKLEVBQVcsQ0FBWCxFQUFjLENBQWQ7QUFBQSxXQUM1QixDQUFDLEdBQUUsRUFBRSxHQUFMLEVBQVU7QUFBQSxhQUFLLEtBQUssR0FBTCxFQUFVLENBQVYsQ0FBTDtBQUFBLEtBQVYsRUFBNkIsTUFBTSxLQUFLLEdBQUwsRUFBVSxDQUFWLENBQU4sRUFBb0IsQ0FBcEIsQ0FBN0IsQ0FENEI7QUFBQSxHQUFQO0FBQUEsQ0FBaEIiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IHtcbiAgYWN5Y2xpY0VxdWFsc1UsXG4gIGFsd2F5cyxcbiAgYXBwbHlVLFxuICBhcml0eU4sXG4gIGFzc29jUGFydGlhbFUsXG4gIGNvbnN0cnVjdG9yT2YsXG4gIGN1cnJ5LFxuICBjdXJyeU4sXG4gIGRpc3NvY1BhcnRpYWxVLFxuICBoYXNVLFxuICBpZCxcbiAgaXNEZWZpbmVkLFxuICBpc0Z1bmN0aW9uLFxuICBpc09iamVjdCxcbiAgaXNTdHJpbmcsXG4gIGtleXMsXG4gIG9iamVjdDAsXG4gIHBpcGUyVSxcbiAgc25kVVxufSBmcm9tIFwiaW5mZXN0aW5lc1wiXG5cbi8vXG5cbmNvbnN0IHNsaWNlSW5kZXggPSAobSwgbCwgZCwgaSkgPT5cbiAgdm9pZCAwICE9PSBpID8gTWF0aC5taW4oTWF0aC5tYXgobSwgaSA8IDAgPyBsICsgaSA6IGkpLCBsKSA6IGRcblxuZnVuY3Rpb24gcGFpcih4MCwgeDEpIHtyZXR1cm4gW3gwLCB4MV19XG5jb25zdCBjcGFpciA9IHggPT4geHMgPT4gW3gsIHhzXVxuXG5jb25zdCB1bnRvID0gYyA9PiB4ID0+IHZvaWQgMCAhPT0geCA/IHggOiBjXG5cbmNvbnN0IG5vdFBhcnRpYWwgPSB4ID0+IHZvaWQgMCAhPT0geCA/ICF4IDogeFxuXG5jb25zdCBpc1ZhbGlkSW5kZXggPSB4ID0+IE51bWJlci5pc0ludGVnZXIoeCkgJiYgMCA8PSB4XG5cbmNvbnN0IHNlZW1zQXJyYXlMaWtlID0geCA9PlxuICB4IGluc3RhbmNlb2YgT2JqZWN0ICYmICh4ID0geC5sZW5ndGgsIHggPT09ICh4ID4+IDApICYmIDAgPD0geCkgfHxcbiAgaXNTdHJpbmcoeClcblxuLy9cblxuZnVuY3Rpb24gbWFwUGFydGlhbEluZGV4VSh4aTJ5LCB4cykge1xuICBjb25zdCBuID0geHMubGVuZ3RoLCB5cyA9IEFycmF5KG4pXG4gIGxldCBqID0gMFxuICBmb3IgKGxldCBpPTAsIHk7IGk8bjsgKytpKVxuICAgIGlmICh2b2lkIDAgIT09ICh5ID0geGkyeSh4c1tpXSwgaSkpKVxuICAgICAgeXNbaisrXSA9IHlcbiAgaWYgKGopIHtcbiAgICBpZiAoaiA8IG4pXG4gICAgICB5cy5sZW5ndGggPSBqXG4gICAgcmV0dXJuIHlzXG4gIH1cbn1cblxuZnVuY3Rpb24gY29weVRvRnJvbSh5cywgaywgeHMsIGksIGopIHtcbiAgd2hpbGUgKGkgPCBqKVxuICAgIHlzW2srK10gPSB4c1tpKytdXG4gIHJldHVybiB5c1xufVxuXG4vL1xuXG5jb25zdCBJZGVudCA9IHttYXA6IGFwcGx5VSwgb2Y6IGlkLCBhcDogYXBwbHlVLCBjaGFpbjogYXBwbHlVfVxuXG5jb25zdCBDb25zdCA9IHttYXA6IHNuZFV9XG5cbmZ1bmN0aW9uIENvbmNhdE9mKGFwLCBlbXB0eSwgZGVsYXkpIHtcbiAgY29uc3QgYyA9IHttYXA6IHNuZFUsIGFwLCBvZjogYWx3YXlzKGVtcHR5KX1cbiAgaWYgKGRlbGF5KVxuICAgIGMuZGVsYXkgPSBkZWxheVxuICByZXR1cm4gY1xufVxuXG5jb25zdCBNb25vaWQgPSAoY29uY2F0LCBlbXB0eSkgPT4gKHtjb25jYXQsIGVtcHR5OiAoKSA9PiBlbXB0eX0pXG5jb25zdCBTdW0gPSBNb25vaWQoKHksIHgpID0+IHggKyB5LCAwKVxuXG5jb25zdCBNdW0gPSBvcmQgPT5cbiAgTW9ub2lkKCh5LCB4KSA9PiB2b2lkIDAgIT09IHggJiYgKHZvaWQgMCA9PT0geSB8fCBvcmQoeCwgeSkpID8geCA6IHkpXG5cbi8vXG5cbmNvbnN0IHJ1biA9IChvLCBDLCB4aTJ5QywgcywgaSkgPT4gdG9GdW5jdGlvbihvKShDLCB4aTJ5QywgcywgaSlcblxuLy9cblxuY29uc3QgZXhwZWN0ZWRPcHRpYyA9IFwiRXhwZWN0aW5nIGFuIG9wdGljXCJcbmNvbnN0IGhlYWRlciA9IFwicGFydGlhbC5sZW5zZXM6IFwiXG5cbmZ1bmN0aW9uIHdhcm4oZiwgbSkge1xuICBpZiAoIWYud2FybmVkKSB7XG4gICAgZi53YXJuZWQgPSAxXG4gICAgY29uc29sZS53YXJuKGhlYWRlciArIG0pXG4gIH1cbn1cblxuZnVuY3Rpb24gZXJyb3JHaXZlbihtLCBvKSB7XG4gIGNvbnNvbGUuZXJyb3IoaGVhZGVyICsgbSArIFwiIC0gZ2l2ZW46XCIsIG8pXG4gIHRocm93IG5ldyBFcnJvcihtKVxufVxuXG5mdW5jdGlvbiByZXFGdW5jdGlvbihvKSB7XG4gIGlmICghKGlzRnVuY3Rpb24obykgJiYgKG8ubGVuZ3RoID09PSA0IHx8IG8ubGVuZ3RoIDw9IDIpKSlcbiAgICBlcnJvckdpdmVuKGV4cGVjdGVkT3B0aWMsIG8pXG59XG5cbmZ1bmN0aW9uIHJlcUFycmF5KG8pIHtcbiAgaWYgKCFBcnJheS5pc0FycmF5KG8pKVxuICAgIGVycm9yR2l2ZW4oZXhwZWN0ZWRPcHRpYywgbylcbn1cblxuLy9cblxuZnVuY3Rpb24gcmVxQXBwbGljYXRpdmUoZikge1xuICBpZiAoIWYub2YpXG4gICAgZXJyb3JHaXZlbihcIlRyYXZlcnNhbHMgcmVxdWlyZSBhbiBhcHBsaWNhdGl2ZVwiLCBmKVxufVxuXG4vL1xuXG5mdW5jdGlvbiBKb2luKGwsIHIpIHt0aGlzLmwgPSBsOyB0aGlzLnIgPSByfVxuXG5jb25zdCBpc0pvaW4gPSBuID0+IG4uY29uc3RydWN0b3IgPT09IEpvaW5cblxuY29uc3Qgam9pbiA9IChsLCByKSA9PiB2b2lkIDAgIT09IGwgPyB2b2lkIDAgIT09IHIgPyBuZXcgSm9pbihsLCByKSA6IGwgOiByXG5cbmNvbnN0IGNqb2luID0gaCA9PiB0ID0+IGpvaW4oaCwgdClcblxuZnVuY3Rpb24gcHVzaFRvKG4sIHlzKSB7XG4gIHdoaWxlIChuICYmIGlzSm9pbihuKSkge1xuICAgIGNvbnN0IGwgPSBuLmxcbiAgICBuID0gbi5yXG4gICAgaWYgKGwgJiYgaXNKb2luKGwpKSB7XG4gICAgICBwdXNoVG8obC5sLCB5cylcbiAgICAgIHB1c2hUbyhsLnIsIHlzKVxuICAgIH0gZWxzZSB7XG4gICAgICB5cy5wdXNoKGwpXG4gICAgfVxuICB9XG4gIHlzLnB1c2gobilcbn1cblxuZnVuY3Rpb24gdG9BcnJheShuKSB7XG4gIGlmICh2b2lkIDAgIT09IG4pIHtcbiAgICBjb25zdCB5cyA9IFtdXG4gICAgcHVzaFRvKG4sIHlzKVxuICAgIHJldHVybiB5c1xuICB9XG59XG5cbmZ1bmN0aW9uIGZvbGRSZWMoZiwgciwgbikge1xuICB3aGlsZSAoaXNKb2luKG4pKSB7XG4gICAgY29uc3QgbCA9IG4ubFxuICAgIG4gPSBuLnJcbiAgICByID0gaXNKb2luKGwpXG4gICAgICA/IGZvbGRSZWMoZiwgZm9sZFJlYyhmLCByLCBsLmwpLCBsLnIpXG4gICAgICA6IGYociwgbFswXSwgbFsxXSlcbiAgfVxuICByZXR1cm4gZihyLCBuWzBdLCBuWzFdKVxufVxuXG5jb25zdCBmb2xkID0gKGYsIHIsIG4pID0+IHZvaWQgMCAhPT0gbiA/IGZvbGRSZWMoZiwgciwgbikgOiByXG5cbmNvbnN0IENvbGxlY3QgPSBDb25jYXRPZihqb2luKVxuXG4vL1xuXG5mdW5jdGlvbiB0aGUodikge1xuICBmdW5jdGlvbiByZXN1bHQoKSB7cmV0dXJuIHJlc3VsdH1cbiAgcmVzdWx0LnYgPSB2XG4gIHJldHVybiByZXN1bHRcbn1cblxuY29uc3QgVCA9IHRoZSh0cnVlKVxuY29uc3Qgbm90ID0geCA9PiAheFxuXG5jb25zdCBTZWxlY3QgPSBDb25jYXRPZigobCwgcikgPT4gbCAmJiBsKCkgfHwgciAmJiByKCksIHZvaWQgMCwgaWQpXG5cbmNvbnN0IG1rU2VsZWN0ID0gdG9NID0+ICh4aTJ5TSwgdCwgcykgPT4ge1xuICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKVxuICAgIHdhcm4obWtTZWxlY3QsIFwiTGF6eSBmb2xkcyBvdmVyIHRyYXZlcnNhbHMgYXJlIGV4cGVyaW1lbnRhbFwiKVxuICByZXR1cm4gKHMgPSBydW4odCwgU2VsZWN0LCBwaXBlMlUoeGkyeU0sIHRvTSksIHMpLFxuICAgICAgICAgIHMgJiYgKHMgPSBzKCkpICYmIHMudilcbn1cblxuLy9cblxuY29uc3QgdHJhdmVyc2VQYXJ0aWFsSW5kZXhMYXp5ID0gKG1hcCwgYXAsIHosIGRlbGF5LCB4aTJ5QSwgeHMsIGksIG4pID0+XG4gIGkgPCBuXG4gID8gYXAobWFwKGNqb2luLCB4aTJ5QSh4c1tpXSwgaSkpLCBkZWxheSgoKSA9PlxuICAgICAgIHRyYXZlcnNlUGFydGlhbEluZGV4TGF6eShtYXAsIGFwLCB6LCBkZWxheSwgeGkyeUEsIHhzLCBpKzEsIG4pKSlcbiAgOiB6XG5cbmZ1bmN0aW9uIHRyYXZlcnNlUGFydGlhbEluZGV4KEEsIHhpMnlBLCB4cykge1xuICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKVxuICAgIHJlcUFwcGxpY2F0aXZlKEEpXG4gIGNvbnN0IHttYXAsIGFwLCBvZiwgZGVsYXl9ID0gQVxuICBsZXQgeHNBID0gb2Yodm9pZCAwKSxcbiAgICAgIGkgPSB4cy5sZW5ndGhcbiAgaWYgKGRlbGF5KVxuICAgIHhzQSA9IHRyYXZlcnNlUGFydGlhbEluZGV4TGF6eShtYXAsIGFwLCB4c0EsIGRlbGF5LCB4aTJ5QSwgeHMsIDAsIGkpXG4gIGVsc2VcbiAgICB3aGlsZSAoaS0tKVxuICAgICAgeHNBID0gYXAobWFwKGNqb2luLCB4aTJ5QSh4c1tpXSwgaSkpLCB4c0EpXG4gIHJldHVybiBtYXAodG9BcnJheSwgeHNBKVxufVxuXG4vL1xuXG5mdW5jdGlvbiBvYmplY3QwVG9VbmRlZmluZWQobykge1xuICBpZiAoIShvIGluc3RhbmNlb2YgT2JqZWN0KSlcbiAgICByZXR1cm4gb1xuICBmb3IgKGNvbnN0IGsgaW4gbylcbiAgICByZXR1cm4gb1xufVxuXG4vL1xuXG5jb25zdCBsZW5zRnJvbSA9IChnZXQsIHNldCkgPT4gaSA9PiAoRiwgeGkyeUYsIHgsIF8pID0+XG4gICgwLEYubWFwKSh2ID0+IHNldChpLCB2LCB4KSwgeGkyeUYoZ2V0KGksIHgpLCBpKSlcblxuLy9cblxuY29uc3QgZ2V0UHJvcCA9IChrLCBvKSA9PiBvIGluc3RhbmNlb2YgT2JqZWN0ID8gb1trXSA6IHZvaWQgMFxuXG5jb25zdCBzZXRQcm9wID0gKGssIHYsIG8pID0+XG4gIHZvaWQgMCAhPT0gdiA/IGFzc29jUGFydGlhbFUoaywgdiwgbykgOiBkaXNzb2NQYXJ0aWFsVShrLCBvKVxuXG5jb25zdCBmdW5Qcm9wID0gbGVuc0Zyb20oZ2V0UHJvcCwgc2V0UHJvcClcblxuLy9cblxuY29uc3QgZ2V0SW5kZXggPSAoaSwgeHMpID0+IHNlZW1zQXJyYXlMaWtlKHhzKSA/IHhzW2ldIDogdm9pZCAwXG5cbmZ1bmN0aW9uIHNldEluZGV4KGksIHgsIHhzKSB7XG4gIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIgJiYgaSA8IDApXG4gICAgZXJyb3JHaXZlbihcIk5lZ2F0aXZlIGluZGljZXMgYXJlIG5vdCBzdXBwb3J0ZWQgYnkgYGluZGV4YFwiLCBpKVxuICBpZiAoIXNlZW1zQXJyYXlMaWtlKHhzKSlcbiAgICB4cyA9IFwiXCJcbiAgY29uc3QgbiA9IHhzLmxlbmd0aFxuICBpZiAodm9pZCAwICE9PSB4KSB7XG4gICAgY29uc3QgbSA9IE1hdGgubWF4KGkrMSwgbiksIHlzID0gQXJyYXkobSlcbiAgICBmb3IgKGxldCBqPTA7IGo8bTsgKytqKVxuICAgICAgeXNbal0gPSB4c1tqXVxuICAgIHlzW2ldID0geFxuICAgIHJldHVybiB5c1xuICB9IGVsc2Uge1xuICAgIGlmICgwIDwgbikge1xuICAgICAgaWYgKG4gPD0gaSlcbiAgICAgICAgcmV0dXJuIGNvcHlUb0Zyb20oQXJyYXkobiksIDAsIHhzLCAwLCBuKVxuICAgICAgaWYgKDEgPCBuKSB7XG4gICAgICAgIGNvbnN0IHlzID0gQXJyYXkobi0xKVxuICAgICAgICBmb3IgKGxldCBqPTA7IGo8aTsgKytqKVxuICAgICAgICAgIHlzW2pdID0geHNbal1cbiAgICAgICAgZm9yIChsZXQgaj1pKzE7IGo8bjsgKytqKVxuICAgICAgICAgIHlzW2otMV0gPSB4c1tqXVxuICAgICAgICByZXR1cm4geXNcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuY29uc3QgZnVuSW5kZXggPSBsZW5zRnJvbShnZXRJbmRleCwgc2V0SW5kZXgpXG5cbi8vXG5cbmNvbnN0IGNsb3NlID0gKG8sIEYsIHhpMnlGKSA9PiAoeCwgaSkgPT4gbyhGLCB4aTJ5RiwgeCwgaSlcblxuZnVuY3Rpb24gY29tcG9zZWQob2kwLCBvcykge1xuICBjb25zdCBuID0gb3MubGVuZ3RoIC0gb2kwXG4gIGxldCBmc1xuICBpZiAobiA8IDIpIHtcbiAgICByZXR1cm4gbiA/IHRvRnVuY3Rpb24ob3Nbb2kwXSkgOiBpZGVudGl0eVxuICB9IGVsc2Uge1xuICAgIGZzID0gQXJyYXkobilcbiAgICBmb3IgKGxldCBpPTA7aTxuOysraSlcbiAgICAgIGZzW2ldID0gdG9GdW5jdGlvbihvc1tpK29pMF0pXG4gICAgcmV0dXJuIChGLCB4aTJ5RiwgeCwgaSkgPT4ge1xuICAgICAgbGV0IGs9blxuICAgICAgd2hpbGUgKC0taylcbiAgICAgICAgeGkyeUYgPSBjbG9zZShmc1trXSwgRiwgeGkyeUYpXG4gICAgICByZXR1cm4gZnNbMF0oRiwgeGkyeUYsIHgsIGkpXG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIHNldFUobywgeCwgcykge1xuICBzd2l0Y2ggKHR5cGVvZiBvKSB7XG4gICAgY2FzZSBcInN0cmluZ1wiOlxuICAgICAgcmV0dXJuIHNldFByb3AobywgeCwgcylcbiAgICBjYXNlIFwibnVtYmVyXCI6XG4gICAgICByZXR1cm4gc2V0SW5kZXgobywgeCwgcylcbiAgICBjYXNlIFwib2JqZWN0XCI6XG4gICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKVxuICAgICAgICByZXFBcnJheShvKVxuICAgICAgcmV0dXJuIG1vZGlmeUNvbXBvc2VkKG8sIDAsIHMsIHgpXG4gICAgZGVmYXVsdDpcbiAgICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpXG4gICAgICAgIHJlcUZ1bmN0aW9uKG8pXG4gICAgICByZXR1cm4gby5sZW5ndGggPT09IDQgPyBvKElkZW50LCBhbHdheXMoeCksIHMsIHZvaWQgMCkgOiBzXG4gIH1cbn1cblxuZnVuY3Rpb24gZ2V0VShsLCBzKSB7XG4gIHN3aXRjaCAodHlwZW9mIGwpIHtcbiAgICBjYXNlIFwic3RyaW5nXCI6XG4gICAgICByZXR1cm4gZ2V0UHJvcChsLCBzKVxuICAgIGNhc2UgXCJudW1iZXJcIjpcbiAgICAgIHJldHVybiBnZXRJbmRleChsLCBzKVxuICAgIGNhc2UgXCJvYmplY3RcIjpcbiAgICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpXG4gICAgICAgIHJlcUFycmF5KGwpXG4gICAgICBmb3IgKGxldCBpPTAsIG49bC5sZW5ndGgsIG87IGk8bjsgKytpKVxuICAgICAgICBzd2l0Y2ggKHR5cGVvZiAobyA9IGxbaV0pKSB7XG4gICAgICAgICAgY2FzZSBcInN0cmluZ1wiOiBzID0gZ2V0UHJvcChvLCBzKTsgYnJlYWtcbiAgICAgICAgICBjYXNlIFwibnVtYmVyXCI6IHMgPSBnZXRJbmRleChvLCBzKTsgYnJlYWtcbiAgICAgICAgICBkZWZhdWx0OiByZXR1cm4gY29tcG9zZWQoaSwgbCkoQ29uc3QsIGlkLCBzLCBsW2ktMV0pXG4gICAgICAgIH1cbiAgICAgIHJldHVybiBzXG4gICAgZGVmYXVsdDpcbiAgICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpXG4gICAgICAgIHJlcUZ1bmN0aW9uKGwpXG4gICAgICByZXR1cm4gbC5sZW5ndGggPT09IDQgPyBsKENvbnN0LCBpZCwgcywgdm9pZCAwKSA6IGwocywgdm9pZCAwKVxuICB9XG59XG5cbmZ1bmN0aW9uIG1vZGlmeUNvbXBvc2VkKG9zLCB4aTJ5LCB4LCB5KSB7XG4gIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpXG4gICAgcmVxQXJyYXkob3MpXG4gIGxldCBuID0gb3MubGVuZ3RoXG4gIGNvbnN0IHhzID0gQXJyYXkobilcbiAgZm9yIChsZXQgaT0wLCBvOyBpPG47ICsraSkge1xuICAgIHhzW2ldID0geFxuICAgIHN3aXRjaCAodHlwZW9mIChvID0gb3NbaV0pKSB7XG4gICAgICBjYXNlIFwic3RyaW5nXCI6XG4gICAgICAgIHggPSBnZXRQcm9wKG8sIHgpXG4gICAgICAgIGJyZWFrXG4gICAgICBjYXNlIFwibnVtYmVyXCI6XG4gICAgICAgIHggPSBnZXRJbmRleChvLCB4KVxuICAgICAgICBicmVha1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgeCA9IGNvbXBvc2VkKGksIG9zKShJZGVudCwgeGkyeSB8fCBhbHdheXMoeSksIHgsIG9zW2ktMV0pXG4gICAgICAgIG4gPSBpXG4gICAgICAgIGJyZWFrXG4gICAgfVxuICB9XG4gIGlmIChuID09PSBvcy5sZW5ndGgpXG4gICAgeCA9IHhpMnkgPyB4aTJ5KHgsIG9zW24tMV0pIDogeVxuICBmb3IgKGxldCBvOyAwIDw9IC0tbjspXG4gICAgeCA9IGlzU3RyaW5nKG8gPSBvc1tuXSlcbiAgICAgICAgPyBzZXRQcm9wKG8sIHgsIHhzW25dKVxuICAgICAgICA6IHNldEluZGV4KG8sIHgsIHhzW25dKVxuICByZXR1cm4geFxufVxuXG4vL1xuXG5mdW5jdGlvbiBnZXRQaWNrKHRlbXBsYXRlLCB4KSB7XG4gIGxldCByXG4gIGZvciAoY29uc3QgayBpbiB0ZW1wbGF0ZSkge1xuICAgIGNvbnN0IHYgPSBnZXRVKHRlbXBsYXRlW2tdLCB4KVxuICAgIGlmICh2b2lkIDAgIT09IHYpIHtcbiAgICAgIGlmICghcilcbiAgICAgICAgciA9IHt9XG4gICAgICByW2tdID0gdlxuICAgIH1cbiAgfVxuICByZXR1cm4gclxufVxuXG5jb25zdCBzZXRQaWNrID0gKHRlbXBsYXRlLCB4KSA9PiB2YWx1ZSA9PiB7XG4gIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIgJiZcbiAgICAgICEodm9pZCAwID09PSB2YWx1ZSB8fCB2YWx1ZSBpbnN0YW5jZW9mIE9iamVjdCkpXG4gICAgZXJyb3JHaXZlbihcImBwaWNrYCBtdXN0IGJlIHNldCB3aXRoIHVuZGVmaW5lZCBvciBhbiBvYmplY3RcIiwgdmFsdWUpXG4gIGZvciAoY29uc3QgayBpbiB0ZW1wbGF0ZSlcbiAgICB4ID0gc2V0VSh0ZW1wbGF0ZVtrXSwgdmFsdWUgJiYgdmFsdWVba10sIHgpXG4gIHJldHVybiB4XG59XG5cbi8vXG5cbmNvbnN0IHRvT2JqZWN0ID0geCA9PiBjb25zdHJ1Y3Rvck9mKHgpICE9PSBPYmplY3QgPyBPYmplY3QuYXNzaWduKHt9LCB4KSA6IHhcblxuLy9cblxuY29uc3QgYnJhbmNoT25NZXJnZSA9ICh4LCBrZXlzKSA9PiB4cyA9PiB7XG4gIGNvbnN0IG8gPSB7fSwgbiA9IGtleXMubGVuZ3RoXG4gIGZvciAobGV0IGk9MDsgaTxuOyArK2ksIHhzPXhzWzFdKSB7XG4gICAgY29uc3QgdiA9IHhzWzBdXG4gICAgb1trZXlzW2ldXSA9IHZvaWQgMCAhPT0gdiA/IHYgOiBvXG4gIH1cbiAgbGV0IHJcbiAgeCA9IHRvT2JqZWN0KHgpXG4gIGZvciAoY29uc3QgayBpbiB4KSB7XG4gICAgY29uc3QgdiA9IG9ba11cbiAgICBpZiAobyAhPT0gdikge1xuICAgICAgb1trXSA9IG9cbiAgICAgIGlmICghcilcbiAgICAgICAgciA9IHt9XG4gICAgICByW2tdID0gdm9pZCAwICE9PSB2ID8gdiA6IHhba11cbiAgICB9XG4gIH1cbiAgZm9yIChsZXQgaT0wOyBpPG47ICsraSkge1xuICAgIGNvbnN0IGsgPSBrZXlzW2ldXG4gICAgY29uc3QgdiA9IG9ba11cbiAgICBpZiAobyAhPT0gdikge1xuICAgICAgaWYgKCFyKVxuICAgICAgICByID0ge31cbiAgICAgIHJba10gPSB2XG4gICAgfVxuICB9XG4gIHJldHVybiByXG59XG5cbmZ1bmN0aW9uIGJyYW5jaE9uTGF6eShrZXlzLCB2YWxzLCBtYXAsIGFwLCB6LCBkZWxheSwgQSwgeGkyeUEsIHgsIGkpIHtcbiAgaWYgKGkgPCBrZXlzLmxlbmd0aCkge1xuICAgIGNvbnN0IGsgPSBrZXlzW2ldLCB2ID0geFtrXVxuICAgIHJldHVybiBhcChtYXAoY3BhaXIsXG4gICAgICAgICAgICAgICAgICB2YWxzID8gdmFsc1tpXShBLCB4aTJ5QSwgeFtrXSwgaykgOiB4aTJ5QSh2LCBrKSksIGRlbGF5KCgpID0+XG4gICAgICAgICAgICAgIGJyYW5jaE9uTGF6eShrZXlzLCB2YWxzLCBtYXAsIGFwLCB6LCBkZWxheSwgQSwgeGkyeUEsIHgsIGkrMSkpKVxuICB9IGVsc2Uge1xuICAgIHJldHVybiB6XG4gIH1cbn1cblxuY29uc3QgYnJhbmNoT24gPSAoa2V5cywgdmFscykgPT4gKEEsIHhpMnlBLCB4LCBfKSA9PiB7XG4gIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpXG4gICAgcmVxQXBwbGljYXRpdmUoQSlcbiAgY29uc3Qge21hcCwgYXAsIG9mLCBkZWxheX0gPSBBXG4gIGxldCBpID0ga2V5cy5sZW5ndGhcbiAgaWYgKCFpKVxuICAgIHJldHVybiBvZihvYmplY3QwVG9VbmRlZmluZWQoeCkpXG4gIGlmICghKHggaW5zdGFuY2VvZiBPYmplY3QpKVxuICAgIHggPSBvYmplY3QwXG4gIGxldCB4c0EgPSBvZigwKVxuICBpZiAoZGVsYXkpIHtcbiAgICB4c0EgPSBicmFuY2hPbkxhenkoa2V5cywgdmFscywgbWFwLCBhcCwgeHNBLCBkZWxheSwgQSwgeGkyeUEsIHgsIDApXG4gIH0gZWxzZSB7XG4gICAgd2hpbGUgKGktLSkge1xuICAgICAgY29uc3QgayA9IGtleXNbaV0sIHYgPSB4W2tdXG4gICAgICB4c0EgPSBhcChtYXAoY3BhaXIsIHZhbHMgPyB2YWxzW2ldKEEsIHhpMnlBLCB2LCBrKSA6IHhpMnlBKHYsIGspKSwgeHNBKVxuICAgIH1cbiAgfVxuICByZXR1cm4gbWFwKGJyYW5jaE9uTWVyZ2UoeCwga2V5cyksIHhzQSlcbn1cblxuY29uc3QgcmVwbGFjZWQgPSAoaW5uLCBvdXQsIHgpID0+IGFjeWNsaWNFcXVhbHNVKHgsIGlubikgPyBvdXQgOiB4XG5cbmZ1bmN0aW9uIGZpbmRJbmRleCh4aTJiLCB4cykge1xuICBmb3IgKGxldCBpPTAsIG49eHMubGVuZ3RoOyBpPG47ICsraSlcbiAgICBpZiAoeGkyYih4c1tpXSwgaSkpXG4gICAgICByZXR1cm4gaVxuICByZXR1cm4gLTFcbn1cblxuZnVuY3Rpb24gcGFydGl0aW9uSW50b0luZGV4KHhpMmIsIHhzLCB0cywgZnMpIHtcbiAgZm9yIChsZXQgaT0wLCBuPXhzLmxlbmd0aCwgeDsgaTxuOyArK2kpXG4gICAgKHhpMmIoeCA9IHhzW2ldLCBpKSA/IHRzIDogZnMpLnB1c2goeClcbn1cblxuY29uc3QgZnJvbVJlYWRlciA9IHdpMnggPT4gKEYsIHhpMnlGLCB3LCBpKSA9PlxuICAoMCxGLm1hcCkoYWx3YXlzKHcpLCB4aTJ5Rih3aTJ4KHcsIGkpLCBpKSlcblxuLy9cblxuZXhwb3J0IGZ1bmN0aW9uIHRvRnVuY3Rpb24obykge1xuICBzd2l0Y2ggKHR5cGVvZiBvKSB7XG4gICAgY2FzZSBcInN0cmluZ1wiOlxuICAgICAgcmV0dXJuIGZ1blByb3AobylcbiAgICBjYXNlIFwibnVtYmVyXCI6XG4gICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiICYmICFpc1ZhbGlkSW5kZXgobykpXG4gICAgICAgIGVycm9yR2l2ZW4oXCJPbmx5IG5vbi1uZWdhdGl2ZSBpbnRlZ2VycyBjYW4gYmUgdXNlZCBhcyBsZW5zZXNcIiwgbylcbiAgICAgIHJldHVybiBmdW5JbmRleChvKVxuICAgIGNhc2UgXCJvYmplY3RcIjpcbiAgICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpXG4gICAgICAgIHJlcUFycmF5KG8pXG4gICAgICByZXR1cm4gY29tcG9zZWQoMCwgbylcbiAgICBkZWZhdWx0OlxuICAgICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIilcbiAgICAgICAgcmVxRnVuY3Rpb24obylcbiAgICAgIHJldHVybiBvLmxlbmd0aCA9PT0gNCA/IG8gOiBmcm9tUmVhZGVyKG8pXG4gIH1cbn1cblxuLy8gT3BlcmF0aW9ucyBvbiBvcHRpY3NcblxuZXhwb3J0IGNvbnN0IG1vZGlmeSA9IGN1cnJ5KChvLCB4aTJ4LCBzKSA9PiB7XG4gIHN3aXRjaCAodHlwZW9mIG8pIHtcbiAgICBjYXNlIFwic3RyaW5nXCI6XG4gICAgICByZXR1cm4gc2V0UHJvcChvLCB4aTJ4KGdldFByb3AobywgcyksIG8pLCBzKVxuICAgIGNhc2UgXCJudW1iZXJcIjpcbiAgICAgIHJldHVybiBzZXRJbmRleChvLCB4aTJ4KGdldEluZGV4KG8sIHMpLCBvKSwgcylcbiAgICBjYXNlIFwib2JqZWN0XCI6XG4gICAgICByZXR1cm4gbW9kaWZ5Q29tcG9zZWQobywgeGkyeCwgcylcbiAgICBkZWZhdWx0OlxuICAgICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIilcbiAgICAgICAgcmVxRnVuY3Rpb24obylcbiAgICAgIHJldHVybiBvLmxlbmd0aCA9PT0gNFxuICAgICAgICA/IG8oSWRlbnQsIHhpMngsIHMsIHZvaWQgMClcbiAgICAgICAgOiAoeGkyeChvKHMsIHZvaWQgMCksIHZvaWQgMCksIHMpXG4gIH1cbn0pXG5cbmV4cG9ydCBjb25zdCByZW1vdmUgPSBjdXJyeSgobywgcykgPT4gc2V0VShvLCB2b2lkIDAsIHMpKVxuXG5leHBvcnQgY29uc3Qgc2V0ID0gY3Vycnkoc2V0VSlcblxuLy8gU2VxdWVuY2luZ1xuXG5leHBvcnQgZnVuY3Rpb24gc2VxKCkge1xuICBjb25zdCBuID0gYXJndW1lbnRzLmxlbmd0aCwgeE1zID0gQXJyYXkobilcbiAgZm9yIChsZXQgaT0wOyBpPG47ICsraSlcbiAgICB4TXNbaV0gPSB0b0Z1bmN0aW9uKGFyZ3VtZW50c1tpXSlcbiAgY29uc3QgbG9vcCA9IChNLCB4aTJ4TSwgaSwgaikgPT4gaiA9PT0gblxuICAgID8gTS5vZlxuICAgIDogeCA9PiAoMCxNLmNoYWluKShsb29wKE0sIHhpMnhNLCBpLCBqKzEpLCB4TXNbal0oTSwgeGkyeE0sIHgsIGkpKVxuICByZXR1cm4gKE0sIHhpMnhNLCB4LCBpKSA9PiB7XG4gICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIiAmJiAhTS5jaGFpbilcbiAgICAgIGVycm9yR2l2ZW4oXCJgc2VxYCByZXF1aXJlcyBhIG1vbmFkXCIsIE0pXG4gICAgcmV0dXJuIGxvb3AoTSwgeGkyeE0sIGksIDApKHgpXG4gIH1cbn1cblxuLy8gTmVzdGluZ1xuXG5leHBvcnQgZnVuY3Rpb24gY29tcG9zZSgpIHtcbiAgbGV0IG4gPSBhcmd1bWVudHMubGVuZ3RoXG4gIGlmIChuIDwgMikge1xuICAgIHJldHVybiBuID8gYXJndW1lbnRzWzBdIDogaWRlbnRpdHlcbiAgfSBlbHNlIHtcbiAgICBjb25zdCBsZW5zZXMgPSBBcnJheShuKVxuICAgIHdoaWxlIChuLS0pXG4gICAgICBsZW5zZXNbbl0gPSBhcmd1bWVudHNbbl1cbiAgICByZXR1cm4gbGVuc2VzXG4gIH1cbn1cblxuLy8gUXVlcnlpbmdcblxuZXhwb3J0IGNvbnN0IGNoYWluID0gY3VycnkoKHhpMnlPLCB4TykgPT5cbiAgW3hPLCBjaG9vc2UoKHhNLCBpKSA9PiB2b2lkIDAgIT09IHhNID8geGkyeU8oeE0sIGkpIDogemVybyldKVxuXG5leHBvcnQgY29uc3QgY2hvaWNlID0gKC4uLmxzKSA9PiBjaG9vc2UoeCA9PiB7XG4gIGNvbnN0IGkgPSBmaW5kSW5kZXgobCA9PiB2b2lkIDAgIT09IGdldFUobCwgeCksIGxzKVxuICByZXR1cm4gaSA8IDAgPyB6ZXJvIDogbHNbaV1cbn0pXG5cbmV4cG9ydCBjb25zdCBjaG9vc2UgPSB4aU0ybyA9PiAoQywgeGkyeUMsIHgsIGkpID0+XG4gIHJ1bih4aU0ybyh4LCBpKSwgQywgeGkyeUMsIHgsIGkpXG5cbmV4cG9ydCBjb25zdCB3aGVuID0gcCA9PiAoQywgeGkyeUMsIHgsIGkpID0+XG4gIHAoeCwgaSkgPyB4aTJ5Qyh4LCBpKSA6IHplcm8oQywgeGkyeUMsIHgsIGkpXG5cbmV4cG9ydCBjb25zdCBvcHRpb25hbCA9IHdoZW4oaXNEZWZpbmVkKVxuXG5leHBvcnQgZnVuY3Rpb24gemVybyhDLCB4aTJ5QywgeCwgaSkge1xuICBjb25zdCBvZiA9IEMub2ZcbiAgcmV0dXJuIG9mID8gb2YoeCkgOiAoMCxDLm1hcCkoYWx3YXlzKHgpLCB4aTJ5Qyh2b2lkIDAsIGkpKVxufVxuXG4vLyBSZWN1cnNpbmdcblxuZXhwb3J0IGZ1bmN0aW9uIGxhenkobzJvKSB7XG4gIGxldCBtZW1vID0gKEMsIHhpMnlDLCB4LCBpKSA9PiAobWVtbyA9IHRvRnVuY3Rpb24obzJvKHJlYykpKShDLCB4aTJ5QywgeCwgaSlcbiAgZnVuY3Rpb24gcmVjKEMsIHhpMnlDLCB4LCBpKSB7cmV0dXJuIG1lbW8oQywgeGkyeUMsIHgsIGkpfVxuICByZXR1cm4gcmVjXG59XG5cbi8vIERlYnVnZ2luZ1xuXG5leHBvcnQgZnVuY3Rpb24gbG9nKCkge1xuICBjb25zdCBzaG93ID0gY3VycnkoKGRpciwgeCkgPT5cbiAgIChjb25zb2xlLmxvZy5hcHBseShjb25zb2xlLFxuICAgICAgICAgICAgICAgICAgICAgIGNvcHlUb0Zyb20oW10sIDAsIGFyZ3VtZW50cywgMCwgYXJndW1lbnRzLmxlbmd0aClcbiAgICAgICAgICAgICAgICAgICAgICAuY29uY2F0KFtkaXIsIHhdKSksXG4gICAgeCkpXG4gIHJldHVybiBpc28oc2hvdyhcImdldFwiKSwgc2hvdyhcInNldFwiKSlcbn1cblxuLy8gT3BlcmF0aW9ucyBvbiB0cmF2ZXJzYWxzXG5cbmV4cG9ydCBjb25zdCBjb25jYXRBcyA9IGN1cnJ5Tig0LCAoeE1pMnksIG0pID0+IHtcbiAgY29uc3QgQyA9IENvbmNhdE9mKG0uY29uY2F0LCAoMCxtLmVtcHR5KSgpLCBtLmRlbGF5KVxuICByZXR1cm4gKHQsIHMpID0+IHJ1bih0LCBDLCB4TWkyeSwgcylcbn0pXG5cbmV4cG9ydCBjb25zdCBjb25jYXQgPSBjb25jYXRBcyhpZClcblxuZXhwb3J0IGNvbnN0IG1lcmdlQXMgPSBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gXCJwcm9kdWN0aW9uXCIgPyBjb25jYXRBcyA6IGN1cnJ5KChmLCBtLCB0LCBkKSA9PlxuICB3YXJuKG1lcmdlQXMsIFwiYG1lcmdlQXNgIGlzIG9ic29sZXRlLCBqdXN0IHVzZSBgY29uY2F0QXNgXCIpIHx8XG4gIGNvbmNhdEFzKGYsIG0sIHQsIGQpKVxuXG5leHBvcnQgY29uc3QgbWVyZ2UgPSBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gXCJwcm9kdWN0aW9uXCIgPyBjb25jYXQgOiBjdXJyeSgobSwgdCwgZCkgPT5cbiAgd2FybihtZXJnZSwgXCJgbWVyZ2VgIGlzIG9ic29sZXRlLCBqdXN0IHVzZSBgY29uY2F0YFwiKSB8fFxuICBjb25jYXQobSwgdCwgZCkpXG5cbi8vIEZvbGRzIG92ZXIgdHJhdmVyc2Fsc1xuXG5leHBvcnQgY29uc3QgYWxsID0gcGlwZTJVKG1rU2VsZWN0KHggPT4geCA/IHZvaWQgMCA6IFQpLCBub3QpXG5cbmV4cG9ydCBjb25zdCBhbmQgPSBhbGwoaWQpXG5cbmV4cG9ydCBjb25zdCBhbnkgPSBwaXBlMlUobWtTZWxlY3QoeCA9PiB4ID8gVCA6IHZvaWQgMCksIEJvb2xlYW4pXG5cbmV4cG9ydCBjb25zdCBjb2xsZWN0QXMgPSBjdXJyeSgoeGkyeSwgdCwgcykgPT5cbiAgdG9BcnJheShydW4odCwgQ29sbGVjdCwgeGkyeSwgcykpIHx8IFtdKVxuXG5leHBvcnQgY29uc3QgY29sbGVjdCA9IGNvbGxlY3RBcyhpZClcblxuZXhwb3J0IGNvbnN0IGNvdW50ID0gY29uY2F0QXMoeCA9PiB2b2lkIDAgIT09IHggPyAxIDogMCwgU3VtKVxuXG5leHBvcnQgY29uc3QgZm9sZGwgPSBjdXJyeSgoZiwgciwgdCwgcykgPT5cbiAgZm9sZChmLCByLCBydW4odCwgQ29sbGVjdCwgcGFpciwgcykpKVxuXG5leHBvcnQgY29uc3QgZm9sZHIgPSBjdXJyeSgoZiwgciwgdCwgcykgPT4ge1xuICBjb25zdCB4cyA9IGNvbGxlY3RBcyhwYWlyLCB0LCBzKVxuICBmb3IgKGxldCBpPXhzLmxlbmd0aC0xOyAwPD1pOyAtLWkpIHtcbiAgICBjb25zdCB4ID0geHNbaV1cbiAgICByID0gZihyLCB4WzBdLCB4WzFdKVxuICB9XG4gIHJldHVybiByXG59KVxuXG5leHBvcnQgY29uc3QgbWF4aW11bSA9IGNvbmNhdChNdW0oKHgsIHkpID0+IHggPiB5KSlcblxuZXhwb3J0IGNvbnN0IG1pbmltdW0gPSBjb25jYXQoTXVtKCh4LCB5KSA9PiB4IDwgeSkpXG5cbmV4cG9ydCBjb25zdCBvciA9IGFueShpZClcblxuZXhwb3J0IGNvbnN0IHByb2R1Y3QgPSBjb25jYXRBcyh1bnRvKDEpLCBNb25vaWQoKHksIHgpID0+IHggKiB5LCAxKSlcblxuZXhwb3J0IGNvbnN0IHNlbGVjdEFzID0gY3VycnkobWtTZWxlY3QoeCA9PiB2b2lkIDAgIT09IHggPyB0aGUoeCkgOiB4KSlcblxuZXhwb3J0IGNvbnN0IHNlbGVjdCA9IHNlbGVjdEFzKGlkKVxuXG5leHBvcnQgY29uc3QgZmlyc3RBcyA9IHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSBcInByb2R1Y3Rpb25cIiA/IHNlbGVjdEFzIDogY3VycnkoKGYsIHQsIGQpID0+XG4gIHdhcm4oZmlyc3RBcywgXCJgZmlyc3RBc2AgaGFzIGJlZW4gcmVuYW1lZCBgc2VsZWN0QXNgXCIpIHx8XG4gIHNlbGVjdEFzKGYsIHQsIGQpKVxuXG5leHBvcnQgY29uc3QgZmlyc3QgPSBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gXCJwcm9kdWN0aW9uXCIgPyBzZWxlY3QgOiBjdXJyeSgodCwgZCkgPT5cbiAgd2FybihmaXJzdCwgXCJgZmlyc3RgIGhhcyBiZWVuIHJlbmFtZWQgYHNlbGVjdGBcIikgfHxcbiAgc2VsZWN0KHQsIGQpKVxuXG5leHBvcnQgY29uc3Qgc3VtID0gY29uY2F0QXModW50bygwKSwgU3VtKVxuXG4vLyBDcmVhdGluZyBuZXcgdHJhdmVyc2Fsc1xuXG5leHBvcnQgZnVuY3Rpb24gYnJhbmNoKHRlbXBsYXRlKSB7XG4gIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIgJiYgIWlzT2JqZWN0KHRlbXBsYXRlKSlcbiAgICBlcnJvckdpdmVuKFwiYGJyYW5jaGAgZXhwZWN0cyBhIHBsYWluIE9iamVjdCB0ZW1wbGF0ZVwiLCB0ZW1wbGF0ZSlcbiAgY29uc3Qga2V5cyA9IFtdLCB2YWxzID0gW11cbiAgZm9yIChjb25zdCBrIGluIHRlbXBsYXRlKSB7XG4gICAga2V5cy5wdXNoKGspXG4gICAgdmFscy5wdXNoKHRvRnVuY3Rpb24odGVtcGxhdGVba10pKVxuICB9XG4gIHJldHVybiBicmFuY2hPbihrZXlzLCB2YWxzKVxufVxuXG4vLyBUcmF2ZXJzYWxzIGFuZCBjb21iaW5hdG9yc1xuXG5leHBvcnQgZnVuY3Rpb24gZWxlbXMoQSwgeGkyeUEsIHhzLCBfKSB7XG4gIGlmIChzZWVtc0FycmF5TGlrZSh4cykpIHtcbiAgICByZXR1cm4gQSA9PT0gSWRlbnRcbiAgICAgID8gbWFwUGFydGlhbEluZGV4VSh4aTJ5QSwgeHMpXG4gICAgICA6IHRyYXZlcnNlUGFydGlhbEluZGV4KEEsIHhpMnlBLCB4cylcbiAgfSBlbHNlIHtcbiAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKVxuICAgICAgcmVxQXBwbGljYXRpdmUoQSlcbiAgICByZXR1cm4gKDAsQS5vZikoeHMpXG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHZhbHVlcyhBLCB4aTJ5QSwgeHMsIF8pIHtcbiAgaWYgKHhzIGluc3RhbmNlb2YgT2JqZWN0KSB7XG4gICAgcmV0dXJuIGJyYW5jaE9uKGtleXMoeHMpKShBLCB4aTJ5QSwgeHMpXG4gIH0gZWxzZSB7XG4gICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIilcbiAgICAgIHJlcUFwcGxpY2F0aXZlKEEpXG4gICAgcmV0dXJuICgwLEEub2YpKHhzKVxuICB9XG59XG5cbi8vIE9wZXJhdGlvbnMgb24gbGVuc2VzXG5cbmV4cG9ydCBjb25zdCBnZXQgPSBjdXJyeShnZXRVKVxuXG4vLyBDcmVhdGluZyBuZXcgbGVuc2VzXG5cbmV4cG9ydCBjb25zdCBsZW5zID0gY3VycnkoKGdldCwgc2V0KSA9PiAoRiwgeGkyeUYsIHgsIGkpID0+XG4gICgwLEYubWFwKSh5ID0+IHNldCh5LCB4LCBpKSwgeGkyeUYoZ2V0KHgsIGkpLCBpKSkpXG5cbi8vIENvbXB1dGluZyBkZXJpdmVkIHByb3BzXG5cbmV4cG9ydCBmdW5jdGlvbiBhdWdtZW50KHRlbXBsYXRlKSB7XG4gIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIgJiYgIWlzT2JqZWN0KHRlbXBsYXRlKSlcbiAgICBlcnJvckdpdmVuKFwiYGF1Z21lbnRgIGV4cGVjdHMgYSBwbGFpbiBPYmplY3QgdGVtcGxhdGVcIiwgdGVtcGxhdGUpXG4gIHJldHVybiBsZW5zKFxuICAgIHggPT4ge1xuICAgICAgeCA9IGRpc3NvY1BhcnRpYWxVKDAsIHgpXG4gICAgICBpZiAoeClcbiAgICAgICAgZm9yIChjb25zdCBrIGluIHRlbXBsYXRlKVxuICAgICAgICAgIHhba10gPSB0ZW1wbGF0ZVtrXSh4KVxuICAgICAgcmV0dXJuIHhcbiAgICB9LFxuICAgICh5LCB4KSA9PiB7XG4gICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiICYmXG4gICAgICAgICAgISh2b2lkIDAgPT09IHkgfHwgeSBpbnN0YW5jZW9mIE9iamVjdCkpXG4gICAgICAgIGVycm9yR2l2ZW4oXCJgYXVnbWVudGAgbXVzdCBiZSBzZXQgd2l0aCB1bmRlZmluZWQgb3IgYW4gb2JqZWN0XCIsIHkpXG4gICAgICB5ID0gdG9PYmplY3QoeSlcbiAgICAgIGlmICghKHggaW5zdGFuY2VvZiBPYmplY3QpKVxuICAgICAgICB4ID0gdm9pZCAwXG4gICAgICBsZXQgelxuICAgICAgZnVuY3Rpb24gc2V0KGssIHYpIHtcbiAgICAgICAgaWYgKCF6KVxuICAgICAgICAgIHogPSB7fVxuICAgICAgICB6W2tdID0gdlxuICAgICAgfVxuICAgICAgZm9yIChjb25zdCBrIGluIHkpIHtcbiAgICAgICAgaWYgKCFoYXNVKGssIHRlbXBsYXRlKSlcbiAgICAgICAgICBzZXQoaywgeVtrXSlcbiAgICAgICAgZWxzZVxuICAgICAgICAgIGlmICh4ICYmIGhhc1UoaywgeCkpXG4gICAgICAgICAgICBzZXQoaywgeFtrXSlcbiAgICAgIH1cbiAgICAgIHJldHVybiB6XG4gICAgfSlcbn1cblxuLy8gRW5mb3JjaW5nIGludmFyaWFudHNcblxuZXhwb3J0IGZ1bmN0aW9uIGRlZmF1bHRzKG91dCkge1xuICBjb25zdCBvMnUgPSB4ID0+IHJlcGxhY2VkKG91dCwgdm9pZCAwLCB4KVxuICByZXR1cm4gKEYsIHhpMnlGLCB4LCBpKSA9PiAoMCxGLm1hcCkobzJ1LCB4aTJ5Rih2b2lkIDAgIT09IHggPyB4IDogb3V0LCBpKSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRlZmluZSh2KSB7XG4gIGNvbnN0IHVudG9WID0gdW50byh2KVxuICByZXR1cm4gKEYsIHhpMnlGLCB4LCBpKSA9PiAoMCxGLm1hcCkodW50b1YsIHhpMnlGKHZvaWQgMCAhPT0geCA/IHggOiB2LCBpKSlcbn1cblxuZXhwb3J0IGNvbnN0IG5vcm1hbGl6ZSA9IHhpMnggPT4gKEYsIHhpMnlGLCB4LCBpKSA9PlxuICAoMCxGLm1hcCkoeCA9PiB2b2lkIDAgIT09IHggPyB4aTJ4KHgsIGkpIDogeCxcbiAgICAgICAgICAgIHhpMnlGKHZvaWQgMCAhPT0geCA/IHhpMngoeCwgaSkgOiB4LCBpKSlcblxuZXhwb3J0IGNvbnN0IHJlcXVpcmVkID0gaW5uID0+IHJlcGxhY2UoaW5uLCB2b2lkIDApXG5cbmV4cG9ydCBjb25zdCByZXdyaXRlID0geWkyeSA9PiAoRiwgeGkyeUYsIHgsIGkpID0+XG4gICgwLEYubWFwKSh5ID0+IHZvaWQgMCAhPT0geSA/IHlpMnkoeSwgaSkgOiB5LCB4aTJ5Rih4LCBpKSlcblxuLy8gTGVuc2luZyBhcnJheXNcblxuZXhwb3J0IGNvbnN0IGFwcGVuZCA9IChGLCB4aTJ5RiwgeHMsIGkpID0+XG4gICgwLEYubWFwKSh4ID0+IHNldEluZGV4KHNlZW1zQXJyYXlMaWtlKHhzKSA/IHhzLmxlbmd0aCA6IDAsIHgsIHhzKSxcbiAgICAgICAgICAgIHhpMnlGKHZvaWQgMCwgaSkpXG5cbmV4cG9ydCBjb25zdCBmaWx0ZXIgPSB4aTJiID0+IChGLCB4aTJ5RiwgeHMsIGkpID0+IHtcbiAgbGV0IHRzLCBmc1xuICBpZiAoc2VlbXNBcnJheUxpa2UoeHMpKVxuICAgIHBhcnRpdGlvbkludG9JbmRleCh4aTJiLCB4cywgdHMgPSBbXSwgZnMgPSBbXSlcbiAgcmV0dXJuICgwLEYubWFwKShcbiAgICB0cyA9PiB7XG4gICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiICYmXG4gICAgICAgICAgISh2b2lkIDAgPT09IHRzIHx8IHNlZW1zQXJyYXlMaWtlKHRzKSkpXG4gICAgICAgIGVycm9yR2l2ZW4oXCJgZmlsdGVyYCBtdXN0IGJlIHNldCB3aXRoIHVuZGVmaW5lZCBvciBhbiBhcnJheS1saWtlIG9iamVjdFwiLCB0cylcbiAgICAgIGNvbnN0IHRzTiA9IHRzID8gdHMubGVuZ3RoIDogMCxcbiAgICAgICAgICAgIGZzTiA9IGZzID8gZnMubGVuZ3RoIDogMCxcbiAgICAgICAgICAgIG4gPSB0c04gKyBmc05cbiAgICAgIGlmIChuKVxuICAgICAgICByZXR1cm4gbiA9PT0gZnNOXG4gICAgICAgID8gZnNcbiAgICAgICAgOiBjb3B5VG9Gcm9tKGNvcHlUb0Zyb20oQXJyYXkobiksIDAsIHRzLCAwLCB0c04pLCB0c04sIGZzLCAwLCBmc04pXG4gICAgfSxcbiAgICB4aTJ5Rih0cywgaSkpXG59XG5cbmV4cG9ydCBjb25zdCBmaW5kID0geGkyYiA9PiBjaG9vc2UoeHMgPT4ge1xuICBpZiAoIXNlZW1zQXJyYXlMaWtlKHhzKSlcbiAgICByZXR1cm4gMFxuICBjb25zdCBpID0gZmluZEluZGV4KHhpMmIsIHhzKVxuICByZXR1cm4gaSA8IDAgPyBhcHBlbmQgOiBpXG59KVxuXG5leHBvcnQgZnVuY3Rpb24gZmluZFdpdGgoLi4ubHMpIHtcbiAgY29uc3QgbGxzID0gY29tcG9zZSguLi5scylcbiAgcmV0dXJuIFtmaW5kKHggPT4gdm9pZCAwICE9PSBnZXRVKGxscywgeCkpLCBsbHNdXG59XG5cbmV4cG9ydCBjb25zdCBpbmRleCA9IHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSBcInByb2R1Y3Rpb25cIiA/IGlkIDogeCA9PiB7XG4gIGlmICghaXNWYWxpZEluZGV4KHgpKVxuICAgIGVycm9yR2l2ZW4oXCJgaW5kZXhgIGV4cGVjdHMgYSBub24tbmVnYXRpdmUgaW50ZWdlclwiLCB4KVxuICByZXR1cm4geFxufVxuXG5leHBvcnQgY29uc3QgbGFzdCA9IGNob29zZShtYXliZUFycmF5ID0+IHNlZW1zQXJyYXlMaWtlKG1heWJlQXJyYXkpICYmIG1heWJlQXJyYXkubGVuZ3RoID8gbWF5YmVBcnJheS5sZW5ndGgtMSA6IGFwcGVuZClcblxuZXhwb3J0IGNvbnN0IHNsaWNlID0gY3VycnkoKGJlZ2luLCBlbmQpID0+IChGLCB4c2kyeUYsIHhzLCBpKSA9PiB7XG4gIGNvbnN0IHNlZW1zID0gc2VlbXNBcnJheUxpa2UoeHMpLFxuICAgICAgICB4c04gPSBzZWVtcyAmJiB4cy5sZW5ndGgsXG4gICAgICAgIGIgPSBzbGljZUluZGV4KDAsIHhzTiwgMCwgYmVnaW4pLFxuICAgICAgICBlID0gc2xpY2VJbmRleChiLCB4c04sIHhzTiwgZW5kKVxuICByZXR1cm4gKDAsRi5tYXApKFxuICAgIHpzID0+IHtcbiAgICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIgJiZcbiAgICAgICAgICAhKHZvaWQgMCA9PT0genMgfHwgc2VlbXNBcnJheUxpa2UoenMpKSlcbiAgICAgICAgZXJyb3JHaXZlbihcImBzbGljZWAgbXVzdCBiZSBzZXQgd2l0aCB1bmRlZmluZWQgb3IgYW4gYXJyYXktbGlrZSBvYmplY3RcIiwgenMpXG4gICAgICBjb25zdCB6c04gPSB6cyA/IHpzLmxlbmd0aCA6IDAsIGJQenNOID0gYiArIHpzTiwgbiA9IHhzTiAtIGUgKyBiUHpzTlxuICAgICAgcmV0dXJuIG5cbiAgICAgICAgPyBjb3B5VG9Gcm9tKGNvcHlUb0Zyb20oY29weVRvRnJvbShBcnJheShuKSwgMCwgeHMsIDAsIGIpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB6cywgMCwgenNOKSxcbiAgICAgICAgICAgICAgICAgICAgIGJQenNOLFxuICAgICAgICAgICAgICAgICAgICAgeHMsIGUsIHhzTilcbiAgICAgICAgOiB2b2lkIDBcbiAgICB9LFxuICAgIHhzaTJ5RihzZWVtcyA/IGNvcHlUb0Zyb20oQXJyYXkoTWF0aC5tYXgoMCwgZSAtIGIpKSwgMCwgeHMsIGIsIGUpIDpcbiAgICAgICAgICAgdm9pZCAwLFxuICAgICAgICAgICBpKSlcbn0pXG5cbi8vIExlbnNpbmcgb2JqZWN0c1xuXG5leHBvcnQgY29uc3QgcHJvcCA9IHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSBcInByb2R1Y3Rpb25cIiA/IGlkIDogeCA9PiB7XG4gIGlmICghaXNTdHJpbmcoeCkpXG4gICAgZXJyb3JHaXZlbihcImBwcm9wYCBleHBlY3RzIGEgc3RyaW5nXCIsIHgpXG4gIHJldHVybiB4XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwcm9wcygpIHtcbiAgY29uc3QgbiA9IGFyZ3VtZW50cy5sZW5ndGgsIHRlbXBsYXRlID0ge31cbiAgZm9yIChsZXQgaT0wLCBrOyBpPG47ICsraSlcbiAgICB0ZW1wbGF0ZVtrID0gYXJndW1lbnRzW2ldXSA9IGtcbiAgcmV0dXJuIHBpY2sodGVtcGxhdGUpXG59XG5cbmV4cG9ydCBjb25zdCByZW1vdmFibGUgPSAoLi4ucHMpID0+IHtcbiAgZnVuY3Rpb24gZHJvcCh5KSB7XG4gICAgaWYgKCEoeSBpbnN0YW5jZW9mIE9iamVjdCkpXG4gICAgICByZXR1cm4geVxuICAgIGZvciAobGV0IGk9MCwgbj1wcy5sZW5ndGg7IGk8bjsgKytpKVxuICAgICAgaWYgKGhhc1UocHNbaV0sIHkpKVxuICAgICAgICByZXR1cm4geVxuICB9XG4gIHJldHVybiAoRiwgeGkyeUYsIHgsIGkpID0+ICgwLEYubWFwKShkcm9wLCB4aTJ5Rih4LCBpKSlcbn1cblxuLy8gUHJvdmlkaW5nIGRlZmF1bHRzXG5cbmV4cG9ydCBjb25zdCB2YWx1ZU9yID0gdiA9PiAoX0YsIHhpMnlGLCB4LCBpKSA9PlxuICB4aTJ5Rih2b2lkIDAgIT09IHggJiYgeCAhPT0gbnVsbCA/IHggOiB2LCBpKVxuXG4vLyBBZGFwdGluZyB0byBkYXRhXG5cbmV4cG9ydCBjb25zdCBvckVsc2UgPVxuICBjdXJyeSgoZCwgbCkgPT4gY2hvb3NlKHggPT4gdm9pZCAwICE9PSBnZXRVKGwsIHgpID8gbCA6IGQpKVxuXG4vLyBSZWFkLW9ubHkgbWFwcGluZ1xuXG5leHBvcnQgY29uc3QgdG8gPSBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gXCJwcm9kdWN0aW9uXCIgPyBpZCA6IHdpMnggPT5cbiAgd2Fybih0bywgXCJgdG9gIGlzIG9ic29sZXRlLCB5b3UgY2FuIGRpcmVjdGx5IGBjb21wb3NlYCBwbGFpbiBmdW5jdGlvbnMgd2l0aCBvcHRpY3NcIikgfHxcbiAgd2kyeFxuXG5leHBvcnQgY29uc3QganVzdCA9IHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSBcInByb2R1Y3Rpb25cIiA/IGFsd2F5cyA6IHggPT5cbiAgd2FybihqdXN0LCBcImBqdXN0YCBpcyBvYnNvbGV0ZSwganVzdCB1c2UgZS5nLiBgUi5hbHdheXNgXCIpIHx8XG4gIGFsd2F5cyh4KVxuXG4vLyBUcmFuc2Zvcm1pbmcgZGF0YVxuXG5leHBvcnQgZnVuY3Rpb24gcGljayh0ZW1wbGF0ZSkge1xuICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiICYmICFpc09iamVjdCh0ZW1wbGF0ZSkpXG4gICAgZXJyb3JHaXZlbihcImBwaWNrYCBleHBlY3RzIGEgcGxhaW4gT2JqZWN0IHRlbXBsYXRlXCIsIHRlbXBsYXRlKVxuICByZXR1cm4gKEYsIHhpMnlGLCB4LCBpKSA9PlxuICAgICgwLEYubWFwKShzZXRQaWNrKHRlbXBsYXRlLCB4KSwgeGkyeUYoZ2V0UGljayh0ZW1wbGF0ZSwgeCksIGkpKVxufVxuXG5leHBvcnQgY29uc3QgcmVwbGFjZSA9IGN1cnJ5KChpbm4sIG91dCkgPT4ge1xuICBjb25zdCBvMmkgPSB4ID0+IHJlcGxhY2VkKG91dCwgaW5uLCB4KVxuICByZXR1cm4gKEYsIHhpMnlGLCB4LCBpKSA9PiAoMCxGLm1hcCkobzJpLCB4aTJ5RihyZXBsYWNlZChpbm4sIG91dCwgeCksIGkpKVxufSlcblxuLy8gT3BlcmF0aW9ucyBvbiBpc29tb3JwaGlzbXNcblxuZXhwb3J0IGNvbnN0IGdldEludmVyc2UgPSBhcml0eU4oMiwgc2V0VSlcblxuLy8gQ3JlYXRpbmcgbmV3IGlzb21vcnBoaXNtc1xuXG5leHBvcnQgY29uc3QgaXNvID1cbiAgY3VycnkoKGJ3ZCwgZndkKSA9PiAoRiwgeGkyeUYsIHgsIGkpID0+ICgwLEYubWFwKShmd2QsIHhpMnlGKGJ3ZCh4KSwgaSkpKVxuXG4vLyBJc29tb3JwaGlzbXMgYW5kIGNvbWJpbmF0b3JzXG5cbmV4cG9ydCBjb25zdCBjb21wbGVtZW50ID0gaXNvKG5vdFBhcnRpYWwsIG5vdFBhcnRpYWwpXG5cbmV4cG9ydCBjb25zdCBpZGVudGl0eSA9IChfRiwgeGkyeUYsIHgsIGkpID0+IHhpMnlGKHgsIGkpXG5cbmV4cG9ydCBjb25zdCBpbnZlcnNlID0gaXNvID0+IChGLCB4aTJ5RiwgeCwgaSkgPT5cbiAgKDAsRi5tYXApKHggPT4gZ2V0VShpc28sIHgpLCB4aTJ5RihzZXRVKGlzbywgeCksIGkpKVxuIl19
