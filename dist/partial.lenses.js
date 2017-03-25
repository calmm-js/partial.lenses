(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.L = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.inverse = exports.identity = exports.complement = exports.iso = exports.getInverse = exports.replace = exports.orElse = exports.valueOr = exports.removable = exports.prop = exports.slice = exports.last = exports.index = exports.find = exports.filter = exports.append = exports.rewrite = exports.required = exports.normalize = exports.lens = exports.get = exports.sum = exports.select = exports.selectAs = exports.product = exports.or = exports.minimum = exports.maximum = exports.foldr = exports.foldl = exports.count = exports.collect = exports.collectAs = exports.any = exports.and = exports.all = exports.concat = exports.concatAs = exports.optional = exports.when = exports.choose = exports.choice = exports.chain = exports.set = exports.remove = exports.modify = undefined;
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

//function warn(f, m) {
//  if (!f.warned) {
//    f.warned = 1
//    console.warn(header + m)
//  }
//}

function errorGiven(m, o) {
  console.error(header + m + " - given:", o);
  throw new Error(m);
}

function checkIndex(x) {
  if (!Number.isInteger(x) || x < 0) errorGiven("`index` expects a non-negative integer", x);
  return x;
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

var U = {};
var T = { v: true };

var Select = ConcatOf(function (l, r) {
  while (l.constructor === Function) {
    l = l();
  }return void 0 !== l.v ? l : r;
}, U, _infestines.id);

var mkSelect = function mkSelect(toM) {
  return function (xi2yM, t, s) {
    s = run(t, Select, (0, _infestines.pipe2U)(xi2yM, toM), s);
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
  if ("dev" !== "production") checkIndex(i);
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
      if ("dev" !== "production") checkIndex(o);
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

// Folds over traversals

var all = exports.all = (0, _infestines.pipe2U)(mkSelect(function (x) {
  return x ? U : T;
}), not);

var and = exports.and = all(_infestines.id);

var any = exports.any = (0, _infestines.pipe2U)(mkSelect(function (x) {
  return x ? T : U;
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

var selectAs = exports.selectAs = (0, _infestines.curry)(mkSelect(function (v) {
  return void 0 !== v ? { v: v } : U;
}));

var select = exports.select = selectAs(_infestines.id);

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

var index = exports.index = "dev" === "production" ? _infestines.id : checkIndex;

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvcGFydGlhbC5sZW5zZXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7UUN3ZGdCLFUsR0FBQSxVO1FBNENBLEcsR0FBQSxHO1FBZ0JBLE8sR0FBQSxPO1FBOEJBLEksR0FBQSxJO1FBT0EsSSxHQUFBLEk7UUFRQSxHLEdBQUEsRztRQTZEQSxNLEdBQUEsTTtRQWFBLEssR0FBQSxLO1FBWUEsTSxHQUFBLE07UUFxQkEsTyxHQUFBLE87UUFxQ0EsUSxHQUFBLFE7UUFLQSxNLEdBQUEsTTtRQStDQSxRLEdBQUEsUTtRQXlDQSxLLEdBQUEsSztRQThCQSxJLEdBQUEsSTs7QUE1MEJoQjs7QUFzQkE7O0FBRUEsSUFBTSxNQUFNLFNBQU4sR0FBTTtBQUFBLFNBQUssQ0FBQyxDQUFOO0FBQUEsQ0FBWjs7QUFFQSxJQUFNLGFBQWEsU0FBYixVQUFhLENBQUMsQ0FBRCxFQUFJLENBQUosRUFBTyxDQUFQLEVBQVUsQ0FBVjtBQUFBLFNBQ2pCLEtBQUssQ0FBTCxLQUFXLENBQVgsR0FBZSxLQUFLLEdBQUwsQ0FBUyxLQUFLLEdBQUwsQ0FBUyxDQUFULEVBQVksSUFBSSxDQUFKLEdBQVEsSUFBSSxDQUFaLEdBQWdCLENBQTVCLENBQVQsRUFBeUMsQ0FBekMsQ0FBZixHQUE2RCxDQUQ1QztBQUFBLENBQW5COztBQUdBLFNBQVMsSUFBVCxDQUFjLEVBQWQsRUFBa0IsRUFBbEIsRUFBc0I7QUFBQyxTQUFPLENBQUMsRUFBRCxFQUFLLEVBQUwsQ0FBUDtBQUFnQjtBQUN2QyxJQUFNLFFBQVEsU0FBUixLQUFRO0FBQUEsU0FBSztBQUFBLFdBQU0sQ0FBQyxDQUFELEVBQUksRUFBSixDQUFOO0FBQUEsR0FBTDtBQUFBLENBQWQ7O0FBRUEsSUFBTSxPQUFPLFNBQVAsSUFBTztBQUFBLFNBQUs7QUFBQSxXQUFLLEtBQUssQ0FBTCxLQUFXLENBQVgsR0FBZSxDQUFmLEdBQW1CLENB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QjtBQUFBLENBQWpCOztBQUVBLElBQU0sNEJBQVUsU0FBVixPQUFVO0FBQUEsU0FBTyxVQUFDLENBQUQsRUFBSSxLQUFKLEVBQVcsQ0FBWCxFQUFjLENBQWQ7QUFBQSxXQUM1QixDQUFDLEdBQUUsRUFBRSxHQUFMLEVBQVU7QUFBQSxhQUFLLEtBQUssR0FBTCxFQUFVLENBQVYsQ0FBTDtBQUFBLEtBQVYsRUFBNkIsTUFBTSxLQUFLLEdBQUwsRUFBVSxDQUFWLENBQU4sRUFBb0IsQ0FBcEIsQ0FBN0IsQ0FENEI7QUFBQSxHQUFQO0FBQUEsQ0FBaEIiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IHtcbiAgYWN5Y2xpY0VxdWFsc1UsXG4gIGFsd2F5cyxcbiAgYXBwbHlVLFxuICBhcml0eU4sXG4gIGFzc29jUGFydGlhbFUsXG4gIGNvbnN0cnVjdG9yT2YsXG4gIGN1cnJ5LFxuICBjdXJyeU4sXG4gIGRpc3NvY1BhcnRpYWxVLFxuICBoYXNVLFxuICBpZCxcbiAgaXNEZWZpbmVkLFxuICBpc0Z1bmN0aW9uLFxuICBpc09iamVjdCxcbiAgaXNTdHJpbmcsXG4gIGtleXMsXG4gIG9iamVjdDAsXG4gIHBpcGUyVSxcbiAgc25kVVxufSBmcm9tIFwiaW5mZXN0aW5lc1wiXG5cbi8vXG5cbmNvbnN0IG5vdCA9IHggPT4gIXhcblxuY29uc3Qgc2xpY2VJbmRleCA9IChtLCBsLCBkLCBpKSA9PlxuICB2b2lkIDAgIT09IGkgPyBNYXRoLm1pbihNYXRoLm1heChtLCBpIDwgMCA/IGwgKyBpIDogaSksIGwpIDogZFxuXG5mdW5jdGlvbiBwYWlyKHgwLCB4MSkge3JldHVybiBbeDAsIHgxXX1cbmNvbnN0IGNwYWlyID0geCA9PiB4cyA9PiBbeCwgeHNdXG5cbmNvbnN0IHVudG8gPSBjID0+IHggPT4gdm9pZCAwICE9PSB4ID8geCA6IGNcblxuY29uc3Qgbm90UGFydGlhbCA9IHggPT4gdm9pZCAwICE9PSB4ID8gIXggOiB4XG5cbmNvbnN0IHNlZW1zQXJyYXlMaWtlID0geCA9PlxuICB4IGluc3RhbmNlb2YgT2JqZWN0ICYmICh4ID0geC5sZW5ndGgsIHggPT09ICh4ID4+IDApICYmIDAgPD0geCkgfHxcbiAgaXNTdHJpbmcoeClcblxuLy9cblxuZnVuY3Rpb24gbWFwUGFydGlhbEluZGV4VSh4aTJ5LCB4cykge1xuICBjb25zdCBuID0geHMubGVuZ3RoLCB5cyA9IEFycmF5KG4pXG4gIGxldCBqID0gMFxuICBmb3IgKGxldCBpPTAsIHk7IGk8bjsgKytpKVxuICAgIGlmICh2b2lkIDAgIT09ICh5ID0geGkyeSh4c1tpXSwgaSkpKVxuICAgICAgeXNbaisrXSA9IHlcbiAgaWYgKGopIHtcbiAgICBpZiAoaiA8IG4pXG4gICAgICB5cy5sZW5ndGggPSBqXG4gICAgcmV0dXJuIHlzXG4gIH1cbn1cblxuZnVuY3Rpb24gY29weVRvRnJvbSh5cywgaywgeHMsIGksIGopIHtcbiAgd2hpbGUgKGkgPCBqKVxuICAgIHlzW2srK10gPSB4c1tpKytdXG4gIHJldHVybiB5c1xufVxuXG4vL1xuXG5jb25zdCBJZGVudCA9IHttYXA6IGFwcGx5VSwgb2Y6IGlkLCBhcDogYXBwbHlVLCBjaGFpbjogYXBwbHlVfVxuXG5jb25zdCBDb25zdCA9IHttYXA6IHNuZFV9XG5cbmZ1bmN0aW9uIENvbmNhdE9mKGFwLCBlbXB0eSwgZGVsYXkpIHtcbiAgY29uc3QgYyA9IHttYXA6IHNuZFUsIGFwLCBvZjogYWx3YXlzKGVtcHR5KX1cbiAgaWYgKGRlbGF5KVxuICAgIGMuZGVsYXkgPSBkZWxheVxuICByZXR1cm4gY1xufVxuXG5jb25zdCBNb25vaWQgPSAoY29uY2F0LCBlbXB0eSkgPT4gKHtjb25jYXQsIGVtcHR5OiAoKSA9PiBlbXB0eX0pXG5jb25zdCBTdW0gPSBNb25vaWQoKHksIHgpID0+IHggKyB5LCAwKVxuXG5jb25zdCBNdW0gPSBvcmQgPT5cbiAgTW9ub2lkKCh5LCB4KSA9PiB2b2lkIDAgIT09IHggJiYgKHZvaWQgMCA9PT0geSB8fCBvcmQoeCwgeSkpID8geCA6IHkpXG5cbi8vXG5cbmNvbnN0IHJ1biA9IChvLCBDLCB4aTJ5QywgcywgaSkgPT4gdG9GdW5jdGlvbihvKShDLCB4aTJ5QywgcywgaSlcblxuLy9cblxuY29uc3QgZXhwZWN0ZWRPcHRpYyA9IFwiRXhwZWN0aW5nIGFuIG9wdGljXCJcbmNvbnN0IGhlYWRlciA9IFwicGFydGlhbC5sZW5zZXM6IFwiXG5cbi8vZnVuY3Rpb24gd2FybihmLCBtKSB7XG4vLyAgaWYgKCFmLndhcm5lZCkge1xuLy8gICAgZi53YXJuZWQgPSAxXG4vLyAgICBjb25zb2xlLndhcm4oaGVhZGVyICsgbSlcbi8vICB9XG4vL31cblxuZnVuY3Rpb24gZXJyb3JHaXZlbihtLCBvKSB7XG4gIGNvbnNvbGUuZXJyb3IoaGVhZGVyICsgbSArIFwiIC0gZ2l2ZW46XCIsIG8pXG4gIHRocm93IG5ldyBFcnJvcihtKVxufVxuXG5mdW5jdGlvbiBjaGVja0luZGV4KHgpIHtcbiAgaWYgKCFOdW1iZXIuaXNJbnRlZ2VyKHgpIHx8IHggPCAwKVxuICAgIGVycm9yR2l2ZW4oXCJgaW5kZXhgIGV4cGVjdHMgYSBub24tbmVnYXRpdmUgaW50ZWdlclwiLCB4KVxuICByZXR1cm4geFxufVxuXG5mdW5jdGlvbiByZXFGdW5jdGlvbihvKSB7XG4gIGlmICghKGlzRnVuY3Rpb24obykgJiYgKG8ubGVuZ3RoID09PSA0IHx8IG8ubGVuZ3RoIDw9IDIpKSlcbiAgICBlcnJvckdpdmVuKGV4cGVjdGVkT3B0aWMsIG8pXG59XG5cbmZ1bmN0aW9uIHJlcUFycmF5KG8pIHtcbiAgaWYgKCFBcnJheS5pc0FycmF5KG8pKVxuICAgIGVycm9yR2l2ZW4oZXhwZWN0ZWRPcHRpYywgbylcbn1cblxuLy9cblxuZnVuY3Rpb24gcmVxQXBwbGljYXRpdmUoZikge1xuICBpZiAoIWYub2YpXG4gICAgZXJyb3JHaXZlbihcIlRyYXZlcnNhbHMgcmVxdWlyZSBhbiBhcHBsaWNhdGl2ZVwiLCBmKVxufVxuXG4vL1xuXG5mdW5jdGlvbiBKb2luKGwsIHIpIHt0aGlzLmwgPSBsOyB0aGlzLnIgPSByfVxuXG5jb25zdCBpc0pvaW4gPSBuID0+IG4uY29uc3RydWN0b3IgPT09IEpvaW5cblxuY29uc3Qgam9pbiA9IChsLCByKSA9PiB2b2lkIDAgIT09IGwgPyB2b2lkIDAgIT09IHIgPyBuZXcgSm9pbihsLCByKSA6IGwgOiByXG5cbmNvbnN0IGNqb2luID0gaCA9PiB0ID0+IGpvaW4oaCwgdClcblxuZnVuY3Rpb24gcHVzaFRvKG4sIHlzKSB7XG4gIHdoaWxlIChuICYmIGlzSm9pbihuKSkge1xuICAgIGNvbnN0IGwgPSBuLmxcbiAgICBuID0gbi5yXG4gICAgaWYgKGwgJiYgaXNKb2luKGwpKSB7XG4gICAgICBwdXNoVG8obC5sLCB5cylcbiAgICAgIHB1c2hUbyhsLnIsIHlzKVxuICAgIH0gZWxzZSB7XG4gICAgICB5cy5wdXNoKGwpXG4gICAgfVxuICB9XG4gIHlzLnB1c2gobilcbn1cblxuZnVuY3Rpb24gdG9BcnJheShuKSB7XG4gIGlmICh2b2lkIDAgIT09IG4pIHtcbiAgICBjb25zdCB5cyA9IFtdXG4gICAgcHVzaFRvKG4sIHlzKVxuICAgIHJldHVybiB5c1xuICB9XG59XG5cbmZ1bmN0aW9uIGZvbGRSZWMoZiwgciwgbikge1xuICB3aGlsZSAoaXNKb2luKG4pKSB7XG4gICAgY29uc3QgbCA9IG4ubFxuICAgIG4gPSBuLnJcbiAgICByID0gaXNKb2luKGwpXG4gICAgICA/IGZvbGRSZWMoZiwgZm9sZFJlYyhmLCByLCBsLmwpLCBsLnIpXG4gICAgICA6IGYociwgbFswXSwgbFsxXSlcbiAgfVxuICByZXR1cm4gZihyLCBuWzBdLCBuWzFdKVxufVxuXG5jb25zdCBmb2xkID0gKGYsIHIsIG4pID0+IHZvaWQgMCAhPT0gbiA/IGZvbGRSZWMoZiwgciwgbikgOiByXG5cbmNvbnN0IENvbGxlY3QgPSBDb25jYXRPZihqb2luKVxuXG4vL1xuXG5jb25zdCBVID0ge31cbmNvbnN0IFQgPSB7djp0cnVlfVxuXG5jb25zdCBTZWxlY3QgPSBDb25jYXRPZihcbiAgKGwsIHIpID0+IHtcbiAgICB3aGlsZSAobC5jb25zdHJ1Y3RvciA9PT0gRnVuY3Rpb24pXG4gICAgICBsID0gbCgpXG4gICAgcmV0dXJuIHZvaWQgMCAhPT0gbC52ID8gbCA6IHJcbiAgfSxcbiAgVSxcbiAgaWQpXG5cbmNvbnN0IG1rU2VsZWN0ID0gdG9NID0+ICh4aTJ5TSwgdCwgcykgPT4ge1xuICBzID0gcnVuKHQsIFNlbGVjdCwgcGlwZTJVKHhpMnlNLCB0b00pLCBzKVxuICB3aGlsZSAocy5jb25zdHJ1Y3RvciA9PT0gRnVuY3Rpb24pXG4gICAgcyA9IHMoKVxuICByZXR1cm4gcy52XG59XG5cbi8vXG5cbmNvbnN0IHRyYXZlcnNlUGFydGlhbEluZGV4TGF6eSA9IChtYXAsIGFwLCB6LCBkZWxheSwgeGkyeUEsIHhzLCBpLCBuKSA9PlxuICBpIDwgblxuICA/IGFwKG1hcChjam9pbiwgeGkyeUEoeHNbaV0sIGkpKSwgZGVsYXkoKCkgPT5cbiAgICAgICB0cmF2ZXJzZVBhcnRpYWxJbmRleExhenkobWFwLCBhcCwgeiwgZGVsYXksIHhpMnlBLCB4cywgaSsxLCBuKSkpXG4gIDogelxuXG5mdW5jdGlvbiB0cmF2ZXJzZVBhcnRpYWxJbmRleChBLCB4aTJ5QSwgeHMpIHtcbiAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIilcbiAgICByZXFBcHBsaWNhdGl2ZShBKVxuICBjb25zdCB7bWFwLCBhcCwgb2YsIGRlbGF5fSA9IEFcbiAgbGV0IHhzQSA9IG9mKHZvaWQgMCksXG4gICAgICBpID0geHMubGVuZ3RoXG4gIGlmIChkZWxheSlcbiAgICB4c0EgPSB0cmF2ZXJzZVBhcnRpYWxJbmRleExhenkobWFwLCBhcCwgeHNBLCBkZWxheSwgeGkyeUEsIHhzLCAwLCBpKVxuICBlbHNlXG4gICAgd2hpbGUgKGktLSlcbiAgICAgIHhzQSA9IGFwKG1hcChjam9pbiwgeGkyeUEoeHNbaV0sIGkpKSwgeHNBKVxuICByZXR1cm4gbWFwKHRvQXJyYXksIHhzQSlcbn1cblxuLy9cblxuZnVuY3Rpb24gb2JqZWN0MFRvVW5kZWZpbmVkKG8pIHtcbiAgaWYgKCEobyBpbnN0YW5jZW9mIE9iamVjdCkpXG4gICAgcmV0dXJuIG9cbiAgZm9yIChjb25zdCBrIGluIG8pXG4gICAgcmV0dXJuIG9cbn1cblxuLy9cblxuY29uc3QgbGVuc0Zyb20gPSAoZ2V0LCBzZXQpID0+IGkgPT4gKEYsIHhpMnlGLCB4LCBfKSA9PlxuICAoMCxGLm1hcCkodiA9PiBzZXQoaSwgdiwgeCksIHhpMnlGKGdldChpLCB4KSwgaSkpXG5cbi8vXG5cbmNvbnN0IGdldFByb3AgPSAoaywgbykgPT4gbyBpbnN0YW5jZW9mIE9iamVjdCA/IG9ba10gOiB2b2lkIDBcblxuY29uc3Qgc2V0UHJvcCA9IChrLCB2LCBvKSA9PlxuICB2b2lkIDAgIT09IHYgPyBhc3NvY1BhcnRpYWxVKGssIHYsIG8pIDogZGlzc29jUGFydGlhbFUoaywgbylcblxuY29uc3QgZnVuUHJvcCA9IGxlbnNGcm9tKGdldFByb3AsIHNldFByb3ApXG5cbi8vXG5cbmNvbnN0IGdldEluZGV4ID0gKGksIHhzKSA9PiBzZWVtc0FycmF5TGlrZSh4cykgPyB4c1tpXSA6IHZvaWQgMFxuXG5mdW5jdGlvbiBzZXRJbmRleChpLCB4LCB4cykge1xuICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKVxuICAgIGNoZWNrSW5kZXgoaSlcbiAgaWYgKCFzZWVtc0FycmF5TGlrZSh4cykpXG4gICAgeHMgPSBcIlwiXG4gIGNvbnN0IG4gPSB4cy5sZW5ndGhcbiAgaWYgKHZvaWQgMCAhPT0geCkge1xuICAgIGNvbnN0IG0gPSBNYXRoLm1heChpKzEsIG4pLCB5cyA9IEFycmF5KG0pXG4gICAgZm9yIChsZXQgaj0wOyBqPG07ICsrailcbiAgICAgIHlzW2pdID0geHNbal1cbiAgICB5c1tpXSA9IHhcbiAgICByZXR1cm4geXNcbiAgfSBlbHNlIHtcbiAgICBpZiAoMCA8IG4pIHtcbiAgICAgIGlmIChuIDw9IGkpXG4gICAgICAgIHJldHVybiBjb3B5VG9Gcm9tKEFycmF5KG4pLCAwLCB4cywgMCwgbilcbiAgICAgIGlmICgxIDwgbikge1xuICAgICAgICBjb25zdCB5cyA9IEFycmF5KG4tMSlcbiAgICAgICAgZm9yIChsZXQgaj0wOyBqPGk7ICsrailcbiAgICAgICAgICB5c1tqXSA9IHhzW2pdXG4gICAgICAgIGZvciAobGV0IGo9aSsxOyBqPG47ICsrailcbiAgICAgICAgICB5c1tqLTFdID0geHNbal1cbiAgICAgICAgcmV0dXJuIHlzXG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbmNvbnN0IGZ1bkluZGV4ID0gbGVuc0Zyb20oZ2V0SW5kZXgsIHNldEluZGV4KVxuXG4vL1xuXG5jb25zdCBjbG9zZSA9IChvLCBGLCB4aTJ5RikgPT4gKHgsIGkpID0+IG8oRiwgeGkyeUYsIHgsIGkpXG5cbmZ1bmN0aW9uIGNvbXBvc2VkKG9pMCwgb3MpIHtcbiAgY29uc3QgbiA9IG9zLmxlbmd0aCAtIG9pMFxuICBsZXQgZnNcbiAgaWYgKG4gPCAyKSB7XG4gICAgcmV0dXJuIG4gPyB0b0Z1bmN0aW9uKG9zW29pMF0pIDogaWRlbnRpdHlcbiAgfSBlbHNlIHtcbiAgICBmcyA9IEFycmF5KG4pXG4gICAgZm9yIChsZXQgaT0wO2k8bjsrK2kpXG4gICAgICBmc1tpXSA9IHRvRnVuY3Rpb24ob3NbaStvaTBdKVxuICAgIHJldHVybiAoRiwgeGkyeUYsIHgsIGkpID0+IHtcbiAgICAgIGxldCBrPW5cbiAgICAgIHdoaWxlICgtLWspXG4gICAgICAgIHhpMnlGID0gY2xvc2UoZnNba10sIEYsIHhpMnlGKVxuICAgICAgcmV0dXJuIGZzWzBdKEYsIHhpMnlGLCB4LCBpKVxuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBzZXRVKG8sIHgsIHMpIHtcbiAgc3dpdGNoICh0eXBlb2Ygbykge1xuICAgIGNhc2UgXCJzdHJpbmdcIjpcbiAgICAgIHJldHVybiBzZXRQcm9wKG8sIHgsIHMpXG4gICAgY2FzZSBcIm51bWJlclwiOlxuICAgICAgcmV0dXJuIHNldEluZGV4KG8sIHgsIHMpXG4gICAgY2FzZSBcIm9iamVjdFwiOlxuICAgICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIilcbiAgICAgICAgcmVxQXJyYXkobylcbiAgICAgIHJldHVybiBtb2RpZnlDb21wb3NlZChvLCAwLCBzLCB4KVxuICAgIGRlZmF1bHQ6XG4gICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKVxuICAgICAgICByZXFGdW5jdGlvbihvKVxuICAgICAgcmV0dXJuIG8ubGVuZ3RoID09PSA0ID8gbyhJZGVudCwgYWx3YXlzKHgpLCBzLCB2b2lkIDApIDogc1xuICB9XG59XG5cbmZ1bmN0aW9uIGdldFUobCwgcykge1xuICBzd2l0Y2ggKHR5cGVvZiBsKSB7XG4gICAgY2FzZSBcInN0cmluZ1wiOlxuICAgICAgcmV0dXJuIGdldFByb3AobCwgcylcbiAgICBjYXNlIFwibnVtYmVyXCI6XG4gICAgICByZXR1cm4gZ2V0SW5kZXgobCwgcylcbiAgICBjYXNlIFwib2JqZWN0XCI6XG4gICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKVxuICAgICAgICByZXFBcnJheShsKVxuICAgICAgZm9yIChsZXQgaT0wLCBuPWwubGVuZ3RoLCBvOyBpPG47ICsraSlcbiAgICAgICAgc3dpdGNoICh0eXBlb2YgKG8gPSBsW2ldKSkge1xuICAgICAgICAgIGNhc2UgXCJzdHJpbmdcIjogcyA9IGdldFByb3Aobywgcyk7IGJyZWFrXG4gICAgICAgICAgY2FzZSBcIm51bWJlclwiOiBzID0gZ2V0SW5kZXgobywgcyk7IGJyZWFrXG4gICAgICAgICAgZGVmYXVsdDogcmV0dXJuIGNvbXBvc2VkKGksIGwpKENvbnN0LCBpZCwgcywgbFtpLTFdKVxuICAgICAgICB9XG4gICAgICByZXR1cm4gc1xuICAgIGRlZmF1bHQ6XG4gICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKVxuICAgICAgICByZXFGdW5jdGlvbihsKVxuICAgICAgcmV0dXJuIGwubGVuZ3RoID09PSA0ID8gbChDb25zdCwgaWQsIHMsIHZvaWQgMCkgOiBsKHMsIHZvaWQgMClcbiAgfVxufVxuXG5mdW5jdGlvbiBtb2RpZnlDb21wb3NlZChvcywgeGkyeSwgeCwgeSkge1xuICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKVxuICAgIHJlcUFycmF5KG9zKVxuICBsZXQgbiA9IG9zLmxlbmd0aFxuICBjb25zdCB4cyA9IEFycmF5KG4pXG4gIGZvciAobGV0IGk9MCwgbzsgaTxuOyArK2kpIHtcbiAgICB4c1tpXSA9IHhcbiAgICBzd2l0Y2ggKHR5cGVvZiAobyA9IG9zW2ldKSkge1xuICAgICAgY2FzZSBcInN0cmluZ1wiOlxuICAgICAgICB4ID0gZ2V0UHJvcChvLCB4KVxuICAgICAgICBicmVha1xuICAgICAgY2FzZSBcIm51bWJlclwiOlxuICAgICAgICB4ID0gZ2V0SW5kZXgobywgeClcbiAgICAgICAgYnJlYWtcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHggPSBjb21wb3NlZChpLCBvcykoSWRlbnQsIHhpMnkgfHwgYWx3YXlzKHkpLCB4LCBvc1tpLTFdKVxuICAgICAgICBuID0gaVxuICAgICAgICBicmVha1xuICAgIH1cbiAgfVxuICBpZiAobiA9PT0gb3MubGVuZ3RoKVxuICAgIHggPSB4aTJ5ID8geGkyeSh4LCBvc1tuLTFdKSA6IHlcbiAgZm9yIChsZXQgbzsgMCA8PSAtLW47KVxuICAgIHggPSBpc1N0cmluZyhvID0gb3Nbbl0pXG4gICAgICAgID8gc2V0UHJvcChvLCB4LCB4c1tuXSlcbiAgICAgICAgOiBzZXRJbmRleChvLCB4LCB4c1tuXSlcbiAgcmV0dXJuIHhcbn1cblxuLy9cblxuZnVuY3Rpb24gZ2V0UGljayh0ZW1wbGF0ZSwgeCkge1xuICBsZXQgclxuICBmb3IgKGNvbnN0IGsgaW4gdGVtcGxhdGUpIHtcbiAgICBjb25zdCB2ID0gZ2V0VSh0ZW1wbGF0ZVtrXSwgeClcbiAgICBpZiAodm9pZCAwICE9PSB2KSB7XG4gICAgICBpZiAoIXIpXG4gICAgICAgIHIgPSB7fVxuICAgICAgcltrXSA9IHZcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJcbn1cblxuY29uc3Qgc2V0UGljayA9ICh0ZW1wbGF0ZSwgeCkgPT4gdmFsdWUgPT4ge1xuICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiICYmXG4gICAgICAhKHZvaWQgMCA9PT0gdmFsdWUgfHwgdmFsdWUgaW5zdGFuY2VvZiBPYmplY3QpKVxuICAgIGVycm9yR2l2ZW4oXCJgcGlja2AgbXVzdCBiZSBzZXQgd2l0aCB1bmRlZmluZWQgb3IgYW4gb2JqZWN0XCIsIHZhbHVlKVxuICBmb3IgKGNvbnN0IGsgaW4gdGVtcGxhdGUpXG4gICAgeCA9IHNldFUodGVtcGxhdGVba10sIHZhbHVlICYmIHZhbHVlW2tdLCB4KVxuICByZXR1cm4geFxufVxuXG4vL1xuXG5jb25zdCB0b09iamVjdCA9IHggPT4gY29uc3RydWN0b3JPZih4KSAhPT0gT2JqZWN0ID8gT2JqZWN0LmFzc2lnbih7fSwgeCkgOiB4XG5cbi8vXG5cbmNvbnN0IGJyYW5jaE9uTWVyZ2UgPSAoeCwga2V5cykgPT4geHMgPT4ge1xuICBjb25zdCBvID0ge30sIG4gPSBrZXlzLmxlbmd0aFxuICBmb3IgKGxldCBpPTA7IGk8bjsgKytpLCB4cz14c1sxXSkge1xuICAgIGNvbnN0IHYgPSB4c1swXVxuICAgIG9ba2V5c1tpXV0gPSB2b2lkIDAgIT09IHYgPyB2IDogb1xuICB9XG4gIGxldCByXG4gIHggPSB0b09iamVjdCh4KVxuICBmb3IgKGNvbnN0IGsgaW4geCkge1xuICAgIGNvbnN0IHYgPSBvW2tdXG4gICAgaWYgKG8gIT09IHYpIHtcbiAgICAgIG9ba10gPSBvXG4gICAgICBpZiAoIXIpXG4gICAgICAgIHIgPSB7fVxuICAgICAgcltrXSA9IHZvaWQgMCAhPT0gdiA/IHYgOiB4W2tdXG4gICAgfVxuICB9XG4gIGZvciAobGV0IGk9MDsgaTxuOyArK2kpIHtcbiAgICBjb25zdCBrID0ga2V5c1tpXVxuICAgIGNvbnN0IHYgPSBvW2tdXG4gICAgaWYgKG8gIT09IHYpIHtcbiAgICAgIGlmICghcilcbiAgICAgICAgciA9IHt9XG4gICAgICByW2tdID0gdlxuICAgIH1cbiAgfVxuICByZXR1cm4gclxufVxuXG5mdW5jdGlvbiBicmFuY2hPbkxhenkoa2V5cywgdmFscywgbWFwLCBhcCwgeiwgZGVsYXksIEEsIHhpMnlBLCB4LCBpKSB7XG4gIGlmIChpIDwga2V5cy5sZW5ndGgpIHtcbiAgICBjb25zdCBrID0ga2V5c1tpXSwgdiA9IHhba11cbiAgICByZXR1cm4gYXAobWFwKGNwYWlyLFxuICAgICAgICAgICAgICAgICAgdmFscyA/IHZhbHNbaV0oQSwgeGkyeUEsIHhba10sIGspIDogeGkyeUEodiwgaykpLCBkZWxheSgoKSA9PlxuICAgICAgICAgICAgICBicmFuY2hPbkxhenkoa2V5cywgdmFscywgbWFwLCBhcCwgeiwgZGVsYXksIEEsIHhpMnlBLCB4LCBpKzEpKSlcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gelxuICB9XG59XG5cbmNvbnN0IGJyYW5jaE9uID0gKGtleXMsIHZhbHMpID0+IChBLCB4aTJ5QSwgeCwgXykgPT4ge1xuICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKVxuICAgIHJlcUFwcGxpY2F0aXZlKEEpXG4gIGNvbnN0IHttYXAsIGFwLCBvZiwgZGVsYXl9ID0gQVxuICBsZXQgaSA9IGtleXMubGVuZ3RoXG4gIGlmICghaSlcbiAgICByZXR1cm4gb2Yob2JqZWN0MFRvVW5kZWZpbmVkKHgpKVxuICBpZiAoISh4IGluc3RhbmNlb2YgT2JqZWN0KSlcbiAgICB4ID0gb2JqZWN0MFxuICBsZXQgeHNBID0gb2YoMClcbiAgaWYgKGRlbGF5KSB7XG4gICAgeHNBID0gYnJhbmNoT25MYXp5KGtleXMsIHZhbHMsIG1hcCwgYXAsIHhzQSwgZGVsYXksIEEsIHhpMnlBLCB4LCAwKVxuICB9IGVsc2Uge1xuICAgIHdoaWxlIChpLS0pIHtcbiAgICAgIGNvbnN0IGsgPSBrZXlzW2ldLCB2ID0geFtrXVxuICAgICAgeHNBID0gYXAobWFwKGNwYWlyLCB2YWxzID8gdmFsc1tpXShBLCB4aTJ5QSwgdiwgaykgOiB4aTJ5QSh2LCBrKSksIHhzQSlcbiAgICB9XG4gIH1cbiAgcmV0dXJuIG1hcChicmFuY2hPbk1lcmdlKHgsIGtleXMpLCB4c0EpXG59XG5cbmNvbnN0IHJlcGxhY2VkID0gKGlubiwgb3V0LCB4KSA9PiBhY3ljbGljRXF1YWxzVSh4LCBpbm4pID8gb3V0IDogeFxuXG5mdW5jdGlvbiBmaW5kSW5kZXgoeGkyYiwgeHMpIHtcbiAgZm9yIChsZXQgaT0wLCBuPXhzLmxlbmd0aDsgaTxuOyArK2kpXG4gICAgaWYgKHhpMmIoeHNbaV0sIGkpKVxuICAgICAgcmV0dXJuIGlcbiAgcmV0dXJuIC0xXG59XG5cbmZ1bmN0aW9uIHBhcnRpdGlvbkludG9JbmRleCh4aTJiLCB4cywgdHMsIGZzKSB7XG4gIGZvciAobGV0IGk9MCwgbj14cy5sZW5ndGgsIHg7IGk8bjsgKytpKVxuICAgICh4aTJiKHggPSB4c1tpXSwgaSkgPyB0cyA6IGZzKS5wdXNoKHgpXG59XG5cbmNvbnN0IGZyb21SZWFkZXIgPSB3aTJ4ID0+IChGLCB4aTJ5RiwgdywgaSkgPT5cbiAgKDAsRi5tYXApKGFsd2F5cyh3KSwgeGkyeUYod2kyeCh3LCBpKSwgaSkpXG5cbi8vXG5cbmV4cG9ydCBmdW5jdGlvbiB0b0Z1bmN0aW9uKG8pIHtcbiAgc3dpdGNoICh0eXBlb2Ygbykge1xuICAgIGNhc2UgXCJzdHJpbmdcIjpcbiAgICAgIHJldHVybiBmdW5Qcm9wKG8pXG4gICAgY2FzZSBcIm51bWJlclwiOlxuICAgICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIilcbiAgICAgICAgY2hlY2tJbmRleChvKVxuICAgICAgcmV0dXJuIGZ1bkluZGV4KG8pXG4gICAgY2FzZSBcIm9iamVjdFwiOlxuICAgICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIilcbiAgICAgICAgcmVxQXJyYXkobylcbiAgICAgIHJldHVybiBjb21wb3NlZCgwLCBvKVxuICAgIGRlZmF1bHQ6XG4gICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKVxuICAgICAgICByZXFGdW5jdGlvbihvKVxuICAgICAgcmV0dXJuIG8ubGVuZ3RoID09PSA0ID8gbyA6IGZyb21SZWFkZXIobylcbiAgfVxufVxuXG4vLyBPcGVyYXRpb25zIG9uIG9wdGljc1xuXG5leHBvcnQgY29uc3QgbW9kaWZ5ID0gY3VycnkoKG8sIHhpMngsIHMpID0+IHtcbiAgc3dpdGNoICh0eXBlb2Ygbykge1xuICAgIGNhc2UgXCJzdHJpbmdcIjpcbiAgICAgIHJldHVybiBzZXRQcm9wKG8sIHhpMngoZ2V0UHJvcChvLCBzKSwgbyksIHMpXG4gICAgY2FzZSBcIm51bWJlclwiOlxuICAgICAgcmV0dXJuIHNldEluZGV4KG8sIHhpMngoZ2V0SW5kZXgobywgcyksIG8pLCBzKVxuICAgIGNhc2UgXCJvYmplY3RcIjpcbiAgICAgIHJldHVybiBtb2RpZnlDb21wb3NlZChvLCB4aTJ4LCBzKVxuICAgIGRlZmF1bHQ6XG4gICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKVxuICAgICAgICByZXFGdW5jdGlvbihvKVxuICAgICAgcmV0dXJuIG8ubGVuZ3RoID09PSA0XG4gICAgICAgID8gbyhJZGVudCwgeGkyeCwgcywgdm9pZCAwKVxuICAgICAgICA6ICh4aTJ4KG8ocywgdm9pZCAwKSwgdm9pZCAwKSwgcylcbiAgfVxufSlcblxuZXhwb3J0IGNvbnN0IHJlbW92ZSA9IGN1cnJ5KChvLCBzKSA9PiBzZXRVKG8sIHZvaWQgMCwgcykpXG5cbmV4cG9ydCBjb25zdCBzZXQgPSBjdXJyeShzZXRVKVxuXG4vLyBTZXF1ZW5jaW5nXG5cbmV4cG9ydCBmdW5jdGlvbiBzZXEoKSB7XG4gIGNvbnN0IG4gPSBhcmd1bWVudHMubGVuZ3RoLCB4TXMgPSBBcnJheShuKVxuICBmb3IgKGxldCBpPTA7IGk8bjsgKytpKVxuICAgIHhNc1tpXSA9IHRvRnVuY3Rpb24oYXJndW1lbnRzW2ldKVxuICBjb25zdCBsb29wID0gKE0sIHhpMnhNLCBpLCBqKSA9PiBqID09PSBuXG4gICAgPyBNLm9mXG4gICAgOiB4ID0+ICgwLE0uY2hhaW4pKGxvb3AoTSwgeGkyeE0sIGksIGorMSksIHhNc1tqXShNLCB4aTJ4TSwgeCwgaSkpXG4gIHJldHVybiAoTSwgeGkyeE0sIHgsIGkpID0+IHtcbiAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiICYmICFNLmNoYWluKVxuICAgICAgZXJyb3JHaXZlbihcImBzZXFgIHJlcXVpcmVzIGEgbW9uYWRcIiwgTSlcbiAgICByZXR1cm4gbG9vcChNLCB4aTJ4TSwgaSwgMCkoeClcbiAgfVxufVxuXG4vLyBOZXN0aW5nXG5cbmV4cG9ydCBmdW5jdGlvbiBjb21wb3NlKCkge1xuICBsZXQgbiA9IGFyZ3VtZW50cy5sZW5ndGhcbiAgaWYgKG4gPCAyKSB7XG4gICAgcmV0dXJuIG4gPyBhcmd1bWVudHNbMF0gOiBpZGVudGl0eVxuICB9IGVsc2Uge1xuICAgIGNvbnN0IGxlbnNlcyA9IEFycmF5KG4pXG4gICAgd2hpbGUgKG4tLSlcbiAgICAgIGxlbnNlc1tuXSA9IGFyZ3VtZW50c1tuXVxuICAgIHJldHVybiBsZW5zZXNcbiAgfVxufVxuXG4vLyBRdWVyeWluZ1xuXG5leHBvcnQgY29uc3QgY2hhaW4gPSBjdXJyeSgoeGkyeU8sIHhPKSA9PlxuICBbeE8sIGNob29zZSgoeE0sIGkpID0+IHZvaWQgMCAhPT0geE0gPyB4aTJ5Tyh4TSwgaSkgOiB6ZXJvKV0pXG5cbmV4cG9ydCBjb25zdCBjaG9pY2UgPSAoLi4ubHMpID0+IGNob29zZSh4ID0+IHtcbiAgY29uc3QgaSA9IGZpbmRJbmRleChsID0+IHZvaWQgMCAhPT0gZ2V0VShsLCB4KSwgbHMpXG4gIHJldHVybiBpIDwgMCA/IHplcm8gOiBsc1tpXVxufSlcblxuZXhwb3J0IGNvbnN0IGNob29zZSA9IHhpTTJvID0+IChDLCB4aTJ5QywgeCwgaSkgPT5cbiAgcnVuKHhpTTJvKHgsIGkpLCBDLCB4aTJ5QywgeCwgaSlcblxuZXhwb3J0IGNvbnN0IHdoZW4gPSBwID0+IChDLCB4aTJ5QywgeCwgaSkgPT5cbiAgcCh4LCBpKSA/IHhpMnlDKHgsIGkpIDogemVybyhDLCB4aTJ5QywgeCwgaSlcblxuZXhwb3J0IGNvbnN0IG9wdGlvbmFsID0gd2hlbihpc0RlZmluZWQpXG5cbmV4cG9ydCBmdW5jdGlvbiB6ZXJvKEMsIHhpMnlDLCB4LCBpKSB7XG4gIGNvbnN0IG9mID0gQy5vZlxuICByZXR1cm4gb2YgPyBvZih4KSA6ICgwLEMubWFwKShhbHdheXMoeCksIHhpMnlDKHZvaWQgMCwgaSkpXG59XG5cbi8vIFJlY3Vyc2luZ1xuXG5leHBvcnQgZnVuY3Rpb24gbGF6eShvMm8pIHtcbiAgbGV0IG1lbW8gPSAoQywgeGkyeUMsIHgsIGkpID0+IChtZW1vID0gdG9GdW5jdGlvbihvMm8ocmVjKSkpKEMsIHhpMnlDLCB4LCBpKVxuICBmdW5jdGlvbiByZWMoQywgeGkyeUMsIHgsIGkpIHtyZXR1cm4gbWVtbyhDLCB4aTJ5QywgeCwgaSl9XG4gIHJldHVybiByZWNcbn1cblxuLy8gRGVidWdnaW5nXG5cbmV4cG9ydCBmdW5jdGlvbiBsb2coKSB7XG4gIGNvbnN0IHNob3cgPSBjdXJyeSgoZGlyLCB4KSA9PlxuICAgKGNvbnNvbGUubG9nLmFwcGx5KGNvbnNvbGUsXG4gICAgICAgICAgICAgICAgICAgICAgY29weVRvRnJvbShbXSwgMCwgYXJndW1lbnRzLCAwLCBhcmd1bWVudHMubGVuZ3RoKVxuICAgICAgICAgICAgICAgICAgICAgIC5jb25jYXQoW2RpciwgeF0pKSxcbiAgICB4KSlcbiAgcmV0dXJuIGlzbyhzaG93KFwiZ2V0XCIpLCBzaG93KFwic2V0XCIpKVxufVxuXG4vLyBPcGVyYXRpb25zIG9uIHRyYXZlcnNhbHNcblxuZXhwb3J0IGNvbnN0IGNvbmNhdEFzID0gY3VycnlOKDQsICh4TWkyeSwgbSkgPT4ge1xuICBjb25zdCBDID0gQ29uY2F0T2YobS5jb25jYXQsICgwLG0uZW1wdHkpKCksIG0uZGVsYXkpXG4gIHJldHVybiAodCwgcykgPT4gcnVuKHQsIEMsIHhNaTJ5LCBzKVxufSlcblxuZXhwb3J0IGNvbnN0IGNvbmNhdCA9IGNvbmNhdEFzKGlkKVxuXG4vLyBGb2xkcyBvdmVyIHRyYXZlcnNhbHNcblxuZXhwb3J0IGNvbnN0IGFsbCA9IHBpcGUyVShta1NlbGVjdCh4ID0+IHggPyBVIDogVCksIG5vdClcblxuZXhwb3J0IGNvbnN0IGFuZCA9IGFsbChpZClcblxuZXhwb3J0IGNvbnN0IGFueSA9IHBpcGUyVShta1NlbGVjdCh4ID0+IHggPyBUIDogVSksIEJvb2xlYW4pXG5cbmV4cG9ydCBjb25zdCBjb2xsZWN0QXMgPSBjdXJyeSgoeGkyeSwgdCwgcykgPT5cbiAgdG9BcnJheShydW4odCwgQ29sbGVjdCwgeGkyeSwgcykpIHx8IFtdKVxuXG5leHBvcnQgY29uc3QgY29sbGVjdCA9IGNvbGxlY3RBcyhpZClcblxuZXhwb3J0IGNvbnN0IGNvdW50ID0gY29uY2F0QXMoeCA9PiB2b2lkIDAgIT09IHggPyAxIDogMCwgU3VtKVxuXG5leHBvcnQgY29uc3QgZm9sZGwgPSBjdXJyeSgoZiwgciwgdCwgcykgPT5cbiAgZm9sZChmLCByLCBydW4odCwgQ29sbGVjdCwgcGFpciwgcykpKVxuXG5leHBvcnQgY29uc3QgZm9sZHIgPSBjdXJyeSgoZiwgciwgdCwgcykgPT4ge1xuICBjb25zdCB4cyA9IGNvbGxlY3RBcyhwYWlyLCB0LCBzKVxuICBmb3IgKGxldCBpPXhzLmxlbmd0aC0xOyAwPD1pOyAtLWkpIHtcbiAgICBjb25zdCB4ID0geHNbaV1cbiAgICByID0gZihyLCB4WzBdLCB4WzFdKVxuICB9XG4gIHJldHVybiByXG59KVxuXG5leHBvcnQgY29uc3QgbWF4aW11bSA9IGNvbmNhdChNdW0oKHgsIHkpID0+IHggPiB5KSlcblxuZXhwb3J0IGNvbnN0IG1pbmltdW0gPSBjb25jYXQoTXVtKCh4LCB5KSA9PiB4IDwgeSkpXG5cbmV4cG9ydCBjb25zdCBvciA9IGFueShpZClcblxuZXhwb3J0IGNvbnN0IHByb2R1Y3QgPSBjb25jYXRBcyh1bnRvKDEpLCBNb25vaWQoKHksIHgpID0+IHggKiB5LCAxKSlcblxuZXhwb3J0IGNvbnN0IHNlbGVjdEFzID0gY3VycnkobWtTZWxlY3QodiA9PiB2b2lkIDAgIT09IHYgPyB7dn0gOiBVKSlcblxuZXhwb3J0IGNvbnN0IHNlbGVjdCA9IHNlbGVjdEFzKGlkKVxuXG5leHBvcnQgY29uc3Qgc3VtID0gY29uY2F0QXModW50bygwKSwgU3VtKVxuXG4vLyBDcmVhdGluZyBuZXcgdHJhdmVyc2Fsc1xuXG5leHBvcnQgZnVuY3Rpb24gYnJhbmNoKHRlbXBsYXRlKSB7XG4gIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIgJiYgIWlzT2JqZWN0KHRlbXBsYXRlKSlcbiAgICBlcnJvckdpdmVuKFwiYGJyYW5jaGAgZXhwZWN0cyBhIHBsYWluIE9iamVjdCB0ZW1wbGF0ZVwiLCB0ZW1wbGF0ZSlcbiAgY29uc3Qga2V5cyA9IFtdLCB2YWxzID0gW11cbiAgZm9yIChjb25zdCBrIGluIHRlbXBsYXRlKSB7XG4gICAga2V5cy5wdXNoKGspXG4gICAgdmFscy5wdXNoKHRvRnVuY3Rpb24odGVtcGxhdGVba10pKVxuICB9XG4gIHJldHVybiBicmFuY2hPbihrZXlzLCB2YWxzKVxufVxuXG4vLyBUcmF2ZXJzYWxzIGFuZCBjb21iaW5hdG9yc1xuXG5leHBvcnQgZnVuY3Rpb24gZWxlbXMoQSwgeGkyeUEsIHhzLCBfKSB7XG4gIGlmIChzZWVtc0FycmF5TGlrZSh4cykpIHtcbiAgICByZXR1cm4gQSA9PT0gSWRlbnRcbiAgICAgID8gbWFwUGFydGlhbEluZGV4VSh4aTJ5QSwgeHMpXG4gICAgICA6IHRyYXZlcnNlUGFydGlhbEluZGV4KEEsIHhpMnlBLCB4cylcbiAgfSBlbHNlIHtcbiAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKVxuICAgICAgcmVxQXBwbGljYXRpdmUoQSlcbiAgICByZXR1cm4gKDAsQS5vZikoeHMpXG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHZhbHVlcyhBLCB4aTJ5QSwgeHMsIF8pIHtcbiAgaWYgKHhzIGluc3RhbmNlb2YgT2JqZWN0KSB7XG4gICAgcmV0dXJuIGJyYW5jaE9uKGtleXMoeHMpKShBLCB4aTJ5QSwgeHMpXG4gIH0gZWxzZSB7XG4gICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIilcbiAgICAgIHJlcUFwcGxpY2F0aXZlKEEpXG4gICAgcmV0dXJuICgwLEEub2YpKHhzKVxuICB9XG59XG5cbi8vIE9wZXJhdGlvbnMgb24gbGVuc2VzXG5cbmV4cG9ydCBjb25zdCBnZXQgPSBjdXJyeShnZXRVKVxuXG4vLyBDcmVhdGluZyBuZXcgbGVuc2VzXG5cbmV4cG9ydCBjb25zdCBsZW5zID0gY3VycnkoKGdldCwgc2V0KSA9PiAoRiwgeGkyeUYsIHgsIGkpID0+XG4gICgwLEYubWFwKSh5ID0+IHNldCh5LCB4LCBpKSwgeGkyeUYoZ2V0KHgsIGkpLCBpKSkpXG5cbi8vIENvbXB1dGluZyBkZXJpdmVkIHByb3BzXG5cbmV4cG9ydCBmdW5jdGlvbiBhdWdtZW50KHRlbXBsYXRlKSB7XG4gIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIgJiYgIWlzT2JqZWN0KHRlbXBsYXRlKSlcbiAgICBlcnJvckdpdmVuKFwiYGF1Z21lbnRgIGV4cGVjdHMgYSBwbGFpbiBPYmplY3QgdGVtcGxhdGVcIiwgdGVtcGxhdGUpXG4gIHJldHVybiBsZW5zKFxuICAgIHggPT4ge1xuICAgICAgeCA9IGRpc3NvY1BhcnRpYWxVKDAsIHgpXG4gICAgICBpZiAoeClcbiAgICAgICAgZm9yIChjb25zdCBrIGluIHRlbXBsYXRlKVxuICAgICAgICAgIHhba10gPSB0ZW1wbGF0ZVtrXSh4KVxuICAgICAgcmV0dXJuIHhcbiAgICB9LFxuICAgICh5LCB4KSA9PiB7XG4gICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiICYmXG4gICAgICAgICAgISh2b2lkIDAgPT09IHkgfHwgeSBpbnN0YW5jZW9mIE9iamVjdCkpXG4gICAgICAgIGVycm9yR2l2ZW4oXCJgYXVnbWVudGAgbXVzdCBiZSBzZXQgd2l0aCB1bmRlZmluZWQgb3IgYW4gb2JqZWN0XCIsIHkpXG4gICAgICB5ID0gdG9PYmplY3QoeSlcbiAgICAgIGlmICghKHggaW5zdGFuY2VvZiBPYmplY3QpKVxuICAgICAgICB4ID0gdm9pZCAwXG4gICAgICBsZXQgelxuICAgICAgZnVuY3Rpb24gc2V0KGssIHYpIHtcbiAgICAgICAgaWYgKCF6KVxuICAgICAgICAgIHogPSB7fVxuICAgICAgICB6W2tdID0gdlxuICAgICAgfVxuICAgICAgZm9yIChjb25zdCBrIGluIHkpIHtcbiAgICAgICAgaWYgKCFoYXNVKGssIHRlbXBsYXRlKSlcbiAgICAgICAgICBzZXQoaywgeVtrXSlcbiAgICAgICAgZWxzZVxuICAgICAgICAgIGlmICh4ICYmIGhhc1UoaywgeCkpXG4gICAgICAgICAgICBzZXQoaywgeFtrXSlcbiAgICAgIH1cbiAgICAgIHJldHVybiB6XG4gICAgfSlcbn1cblxuLy8gRW5mb3JjaW5nIGludmFyaWFudHNcblxuZXhwb3J0IGZ1bmN0aW9uIGRlZmF1bHRzKG91dCkge1xuICBjb25zdCBvMnUgPSB4ID0+IHJlcGxhY2VkKG91dCwgdm9pZCAwLCB4KVxuICByZXR1cm4gKEYsIHhpMnlGLCB4LCBpKSA9PiAoMCxGLm1hcCkobzJ1LCB4aTJ5Rih2b2lkIDAgIT09IHggPyB4IDogb3V0LCBpKSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRlZmluZSh2KSB7XG4gIGNvbnN0IHVudG9WID0gdW50byh2KVxuICByZXR1cm4gKEYsIHhpMnlGLCB4LCBpKSA9PiAoMCxGLm1hcCkodW50b1YsIHhpMnlGKHZvaWQgMCAhPT0geCA/IHggOiB2LCBpKSlcbn1cblxuZXhwb3J0IGNvbnN0IG5vcm1hbGl6ZSA9IHhpMnggPT4gKEYsIHhpMnlGLCB4LCBpKSA9PlxuICAoMCxGLm1hcCkoeCA9PiB2b2lkIDAgIT09IHggPyB4aTJ4KHgsIGkpIDogeCxcbiAgICAgICAgICAgIHhpMnlGKHZvaWQgMCAhPT0geCA/IHhpMngoeCwgaSkgOiB4LCBpKSlcblxuZXhwb3J0IGNvbnN0IHJlcXVpcmVkID0gaW5uID0+IHJlcGxhY2UoaW5uLCB2b2lkIDApXG5cbmV4cG9ydCBjb25zdCByZXdyaXRlID0geWkyeSA9PiAoRiwgeGkyeUYsIHgsIGkpID0+XG4gICgwLEYubWFwKSh5ID0+IHZvaWQgMCAhPT0geSA/IHlpMnkoeSwgaSkgOiB5LCB4aTJ5Rih4LCBpKSlcblxuLy8gTGVuc2luZyBhcnJheXNcblxuZXhwb3J0IGNvbnN0IGFwcGVuZCA9IChGLCB4aTJ5RiwgeHMsIGkpID0+XG4gICgwLEYubWFwKSh4ID0+IHNldEluZGV4KHNlZW1zQXJyYXlMaWtlKHhzKSA/IHhzLmxlbmd0aCA6IDAsIHgsIHhzKSxcbiAgICAgICAgICAgIHhpMnlGKHZvaWQgMCwgaSkpXG5cbmV4cG9ydCBjb25zdCBmaWx0ZXIgPSB4aTJiID0+IChGLCB4aTJ5RiwgeHMsIGkpID0+IHtcbiAgbGV0IHRzLCBmc1xuICBpZiAoc2VlbXNBcnJheUxpa2UoeHMpKVxuICAgIHBhcnRpdGlvbkludG9JbmRleCh4aTJiLCB4cywgdHMgPSBbXSwgZnMgPSBbXSlcbiAgcmV0dXJuICgwLEYubWFwKShcbiAgICB0cyA9PiB7XG4gICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiICYmXG4gICAgICAgICAgISh2b2lkIDAgPT09IHRzIHx8IHNlZW1zQXJyYXlMaWtlKHRzKSkpXG4gICAgICAgIGVycm9yR2l2ZW4oXCJgZmlsdGVyYCBtdXN0IGJlIHNldCB3aXRoIHVuZGVmaW5lZCBvciBhbiBhcnJheS1saWtlIG9iamVjdFwiLCB0cylcbiAgICAgIGNvbnN0IHRzTiA9IHRzID8gdHMubGVuZ3RoIDogMCxcbiAgICAgICAgICAgIGZzTiA9IGZzID8gZnMubGVuZ3RoIDogMCxcbiAgICAgICAgICAgIG4gPSB0c04gKyBmc05cbiAgICAgIGlmIChuKVxuICAgICAgICByZXR1cm4gbiA9PT0gZnNOXG4gICAgICAgID8gZnNcbiAgICAgICAgOiBjb3B5VG9Gcm9tKGNvcHlUb0Zyb20oQXJyYXkobiksIDAsIHRzLCAwLCB0c04pLCB0c04sIGZzLCAwLCBmc04pXG4gICAgfSxcbiAgICB4aTJ5Rih0cywgaSkpXG59XG5cbmV4cG9ydCBjb25zdCBmaW5kID0geGkyYiA9PiBjaG9vc2UoeHMgPT4ge1xuICBpZiAoIXNlZW1zQXJyYXlMaWtlKHhzKSlcbiAgICByZXR1cm4gMFxuICBjb25zdCBpID0gZmluZEluZGV4KHhpMmIsIHhzKVxuICByZXR1cm4gaSA8IDAgPyBhcHBlbmQgOiBpXG59KVxuXG5leHBvcnQgZnVuY3Rpb24gZmluZFdpdGgoLi4ubHMpIHtcbiAgY29uc3QgbGxzID0gY29tcG9zZSguLi5scylcbiAgcmV0dXJuIFtmaW5kKHggPT4gdm9pZCAwICE9PSBnZXRVKGxscywgeCkpLCBsbHNdXG59XG5cbmV4cG9ydCBjb25zdCBpbmRleCA9IHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSBcInByb2R1Y3Rpb25cIiA/IGlkIDogY2hlY2tJbmRleFxuXG5leHBvcnQgY29uc3QgbGFzdCA9IGNob29zZShtYXliZUFycmF5ID0+IHNlZW1zQXJyYXlMaWtlKG1heWJlQXJyYXkpICYmIG1heWJlQXJyYXkubGVuZ3RoID8gbWF5YmVBcnJheS5sZW5ndGgtMSA6IGFwcGVuZClcblxuZXhwb3J0IGNvbnN0IHNsaWNlID0gY3VycnkoKGJlZ2luLCBlbmQpID0+IChGLCB4c2kyeUYsIHhzLCBpKSA9PiB7XG4gIGNvbnN0IHNlZW1zID0gc2VlbXNBcnJheUxpa2UoeHMpLFxuICAgICAgICB4c04gPSBzZWVtcyAmJiB4cy5sZW5ndGgsXG4gICAgICAgIGIgPSBzbGljZUluZGV4KDAsIHhzTiwgMCwgYmVnaW4pLFxuICAgICAgICBlID0gc2xpY2VJbmRleChiLCB4c04sIHhzTiwgZW5kKVxuICByZXR1cm4gKDAsRi5tYXApKFxuICAgIHpzID0+IHtcbiAgICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIgJiZcbiAgICAgICAgICAhKHZvaWQgMCA9PT0genMgfHwgc2VlbXNBcnJheUxpa2UoenMpKSlcbiAgICAgICAgZXJyb3JHaXZlbihcImBzbGljZWAgbXVzdCBiZSBzZXQgd2l0aCB1bmRlZmluZWQgb3IgYW4gYXJyYXktbGlrZSBvYmplY3RcIiwgenMpXG4gICAgICBjb25zdCB6c04gPSB6cyA/IHpzLmxlbmd0aCA6IDAsIGJQenNOID0gYiArIHpzTiwgbiA9IHhzTiAtIGUgKyBiUHpzTlxuICAgICAgcmV0dXJuIG5cbiAgICAgICAgPyBjb3B5VG9Gcm9tKGNvcHlUb0Zyb20oY29weVRvRnJvbShBcnJheShuKSwgMCwgeHMsIDAsIGIpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB6cywgMCwgenNOKSxcbiAgICAgICAgICAgICAgICAgICAgIGJQenNOLFxuICAgICAgICAgICAgICAgICAgICAgeHMsIGUsIHhzTilcbiAgICAgICAgOiB2b2lkIDBcbiAgICB9LFxuICAgIHhzaTJ5RihzZWVtcyA/IGNvcHlUb0Zyb20oQXJyYXkoTWF0aC5tYXgoMCwgZSAtIGIpKSwgMCwgeHMsIGIsIGUpIDpcbiAgICAgICAgICAgdm9pZCAwLFxuICAgICAgICAgICBpKSlcbn0pXG5cbi8vIExlbnNpbmcgb2JqZWN0c1xuXG5leHBvcnQgY29uc3QgcHJvcCA9IHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSBcInByb2R1Y3Rpb25cIiA/IGlkIDogeCA9PiB7XG4gIGlmICghaXNTdHJpbmcoeCkpXG4gICAgZXJyb3JHaXZlbihcImBwcm9wYCBleHBlY3RzIGEgc3RyaW5nXCIsIHgpXG4gIHJldHVybiB4XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwcm9wcygpIHtcbiAgY29uc3QgbiA9IGFyZ3VtZW50cy5sZW5ndGgsIHRlbXBsYXRlID0ge31cbiAgZm9yIChsZXQgaT0wLCBrOyBpPG47ICsraSlcbiAgICB0ZW1wbGF0ZVtrID0gYXJndW1lbnRzW2ldXSA9IGtcbiAgcmV0dXJuIHBpY2sodGVtcGxhdGUpXG59XG5cbmV4cG9ydCBjb25zdCByZW1vdmFibGUgPSAoLi4ucHMpID0+IHtcbiAgZnVuY3Rpb24gZHJvcCh5KSB7XG4gICAgaWYgKCEoeSBpbnN0YW5jZW9mIE9iamVjdCkpXG4gICAgICByZXR1cm4geVxuICAgIGZvciAobGV0IGk9MCwgbj1wcy5sZW5ndGg7IGk8bjsgKytpKVxuICAgICAgaWYgKGhhc1UocHNbaV0sIHkpKVxuICAgICAgICByZXR1cm4geVxuICB9XG4gIHJldHVybiAoRiwgeGkyeUYsIHgsIGkpID0+ICgwLEYubWFwKShkcm9wLCB4aTJ5Rih4LCBpKSlcbn1cblxuLy8gUHJvdmlkaW5nIGRlZmF1bHRzXG5cbmV4cG9ydCBjb25zdCB2YWx1ZU9yID0gdiA9PiAoX0YsIHhpMnlGLCB4LCBpKSA9PlxuICB4aTJ5Rih2b2lkIDAgIT09IHggJiYgeCAhPT0gbnVsbCA/IHggOiB2LCBpKVxuXG4vLyBBZGFwdGluZyB0byBkYXRhXG5cbmV4cG9ydCBjb25zdCBvckVsc2UgPVxuICBjdXJyeSgoZCwgbCkgPT4gY2hvb3NlKHggPT4gdm9pZCAwICE9PSBnZXRVKGwsIHgpID8gbCA6IGQpKVxuXG4vLyBUcmFuc2Zvcm1pbmcgZGF0YVxuXG5leHBvcnQgZnVuY3Rpb24gcGljayh0ZW1wbGF0ZSkge1xuICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiICYmICFpc09iamVjdCh0ZW1wbGF0ZSkpXG4gICAgZXJyb3JHaXZlbihcImBwaWNrYCBleHBlY3RzIGEgcGxhaW4gT2JqZWN0IHRlbXBsYXRlXCIsIHRlbXBsYXRlKVxuICByZXR1cm4gKEYsIHhpMnlGLCB4LCBpKSA9PlxuICAgICgwLEYubWFwKShzZXRQaWNrKHRlbXBsYXRlLCB4KSwgeGkyeUYoZ2V0UGljayh0ZW1wbGF0ZSwgeCksIGkpKVxufVxuXG5leHBvcnQgY29uc3QgcmVwbGFjZSA9IGN1cnJ5KChpbm4sIG91dCkgPT4ge1xuICBjb25zdCBvMmkgPSB4ID0+IHJlcGxhY2VkKG91dCwgaW5uLCB4KVxuICByZXR1cm4gKEYsIHhpMnlGLCB4LCBpKSA9PiAoMCxGLm1hcCkobzJpLCB4aTJ5RihyZXBsYWNlZChpbm4sIG91dCwgeCksIGkpKVxufSlcblxuLy8gT3BlcmF0aW9ucyBvbiBpc29tb3JwaGlzbXNcblxuZXhwb3J0IGNvbnN0IGdldEludmVyc2UgPSBhcml0eU4oMiwgc2V0VSlcblxuLy8gQ3JlYXRpbmcgbmV3IGlzb21vcnBoaXNtc1xuXG5leHBvcnQgY29uc3QgaXNvID1cbiAgY3VycnkoKGJ3ZCwgZndkKSA9PiAoRiwgeGkyeUYsIHgsIGkpID0+ICgwLEYubWFwKShmd2QsIHhpMnlGKGJ3ZCh4KSwgaSkpKVxuXG4vLyBJc29tb3JwaGlzbXMgYW5kIGNvbWJpbmF0b3JzXG5cbmV4cG9ydCBjb25zdCBjb21wbGVtZW50ID0gaXNvKG5vdFBhcnRpYWwsIG5vdFBhcnRpYWwpXG5cbmV4cG9ydCBjb25zdCBpZGVudGl0eSA9IChfRiwgeGkyeUYsIHgsIGkpID0+IHhpMnlGKHgsIGkpXG5cbmV4cG9ydCBjb25zdCBpbnZlcnNlID0gaXNvID0+IChGLCB4aTJ5RiwgeCwgaSkgPT5cbiAgKDAsRi5tYXApKHggPT4gZ2V0VShpc28sIHgpLCB4aTJ5RihzZXRVKGlzbywgeCksIGkpKVxuIl19
