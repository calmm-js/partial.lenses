(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.L = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.inverse = exports.identity = exports.iso = exports.getInverse = exports.replace = exports.pick = exports.just = exports.to = exports.orElse = exports.valueOr = exports.removable = exports.prop = exports.slice = exports.index = exports.find = exports.filter = exports.append = exports.rewrite = exports.normalize = exports.define = exports.required = exports.defaults = exports.augment = exports.lens = exports.get = exports.sum = exports.product = exports.minimum = exports.maximum = exports.foldr = exports.foldl = exports.first = exports.firstAs = exports.collect = exports.collectAs = exports.merge = exports.mergeAs = exports.concat = exports.concatAs = exports.optional = exports.when = exports.choose = exports.choice = exports.chain = exports.set = exports.remove = exports.modify = undefined;
exports.toFunction = toFunction;
exports.seq = seq;
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

function the(v) {
  function result() {
    return result;
  }
  result.v = v;
  return result;
}

var First = ConcatOf(function (l, r) {
  return l && l() || r && r();
}, void 0, _infestines.id);

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

  var show = function show(dir) {
    return function (x) {
      return console.log.apply(console, copyToFrom([], 0, _arguments, 0, _arguments.length).concat([dir, x])) || x;
    };
  };
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

var firstAs = exports.firstAs = (0, _infestines.curry)(function (xi2yM, t, s) {
  if ("dev" !== "production" && !firstAs.warned) {
    firstAs.warned = 1;
    console.warn("partial.lenses: `first` and `firstAs` are experimental features.");
  }
  return s = run(t, First, function (x, i) {
    return x = xi2yM(x, i), void 0 !== x ? the(x) : x;
  }, s), s && (s = s()) && s.v;
});

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvcGFydGlhbC5sZW5zZXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7UUM0YmdCLFUsR0FBQSxVO1FBMENBLEcsR0FBQSxHO1FBZ0JBLE8sR0FBQSxPO1FBOEJBLEksR0FBQSxJO1FBT0EsSSxHQUFBLEk7UUFRQSxHLEdBQUEsRztRQTRFQSxNLEdBQUEsTTtRQVdBLEssR0FBQSxLO1FBWUEsTSxHQUFBLE07UUEwR0EsUSxHQUFBLFE7UUEyQ0EsSyxHQUFBLEs7O0FBM3hCaEI7O0FBcUJBOztBQUVBLElBQU0sYUFBYSxTQUFiLFVBQWEsQ0FBQyxDQUFELEVBQUksQ0FBSixFQUFPLENBQVAsRUFBVSxDQUFWO0FBQUEsU0FDakIsS0FBSyxDQUFMLEtBQVcsQ0FBWCxHQUFlLEtBQUssR0FBTCxDQUFTLEtBQUssR0FBTCxDQUFTLENBQVQsRUFBWSxJQUFJLENBQUosR0FBUSxJQUFJLENBQVosR0FBZ0IsQ0FBNUIsQ0FBVCxFQUF5QyxDQUF6QyxDQUFmLEdBQTZELENBRDVDO0FBQUEsQ0FBbkI7O0FBR0EsU0FBUyxJQUFULENBQWMsRUFBZCxFQUFrQixFQUFsQixFQUFzQjtBQUFDLFNBQU8sQ0FBQyxFQUFELEVBQUssRUFBTCxDQUFQO0FBQWdCO0FBQ3ZDLElBQU0sUUFBUSxTQUFSLEtBQVE7QUFBQSxTQUFLO0FBQUEsV0FBTSxDQUFDLENBQUQsRUFBSSxFQUFKLENBQU47QUFBQSxHQUFMO0FBQUEsQ0FBZDs7QUFFQSxJQUFNLE9BQU8sU0FBUCxJQUFPO0FBQUEsU0FBSztBQUFBLFdBQUssS0FBSyxDQUFMLEtBQVcsQ0FBWCxHQUFlLENBQWYsR0FBbUIsQ0FBeEI7QUFBQSxHQUFMO0FBQUEsQ0FBYjs7QUFFQSxJQUFNLGlCQUFpQixTQUFqQixjQUFpQjtBQUFBLFNBQ3JCLGFBQWEsTUFBYixLQUF3QixJQUFJLEVBQUUsTUFBTixFQUFjLE1BQU8sS0FBSyxDQUFa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LEtBQUosRUFBVyxDQUFYLEVBQWMsQ0FBZDtBQUFBLFdBQzVCLENBQUMsR0FBRSxFQUFFLEdBQUwsRUFBVTtBQUFBLGFBQUssS0FBSyxHQUFMLEVBQVUsQ0FBVixDQUFMO0FBQUEsS0FBVixFQUE2QixNQUFNLEtBQUssR0FBTCxFQUFVLENBQVYsQ0FBTixFQUFvQixDQUFwQixDQUE3QixDQUQ0QjtBQUFBLEdBQVA7QUFBQSxDQUFoQiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQge1xuICBhY3ljbGljRXF1YWxzVSxcbiAgYWx3YXlzLFxuICBhcHBseVUsXG4gIGFyaXR5TixcbiAgYXNzb2NQYXJ0aWFsVSxcbiAgY29uc3RydWN0b3JPZixcbiAgY3VycnksXG4gIGN1cnJ5TixcbiAgZGlzc29jUGFydGlhbFUsXG4gIGhhc1UsXG4gIGlkLFxuICBpc0RlZmluZWQsXG4gIGlzRnVuY3Rpb24sXG4gIGlzT2JqZWN0LFxuICBpc1N0cmluZyxcbiAga2V5cyxcbiAgb2JqZWN0MCxcbiAgc25kVVxufSBmcm9tIFwiaW5mZXN0aW5lc1wiXG5cbi8vXG5cbmNvbnN0IHNsaWNlSW5kZXggPSAobSwgbCwgZCwgaSkgPT5cbiAgdm9pZCAwICE9PSBpID8gTWF0aC5taW4oTWF0aC5tYXgobSwgaSA8IDAgPyBsICsgaSA6IGkpLCBsKSA6IGRcblxuZnVuY3Rpb24gcGFpcih4MCwgeDEpIHtyZXR1cm4gW3gwLCB4MV19XG5jb25zdCBjcGFpciA9IHggPT4geHMgPT4gW3gsIHhzXVxuXG5jb25zdCB1bnRvID0gYyA9PiB4ID0+IHZvaWQgMCAhPT0geCA/IHggOiBjXG5cbmNvbnN0IHNlZW1zQXJyYXlMaWtlID0geCA9PlxuICB4IGluc3RhbmNlb2YgT2JqZWN0ICYmICh4ID0geC5sZW5ndGgsIHggPT09ICh4ID4+IDApICYmIDAgPD0geCkgfHxcbiAgaXNTdHJpbmcoeClcblxuLy9cblxuZnVuY3Rpb24gbWFwUGFydGlhbEluZGV4VSh4aTJ5LCB4cykge1xuICBjb25zdCBuID0geHMubGVuZ3RoLCB5cyA9IEFycmF5KG4pXG4gIGxldCBqID0gMFxuICBmb3IgKGxldCBpPTAsIHk7IGk8bjsgKytpKVxuICAgIGlmICh2b2lkIDAgIT09ICh5ID0geGkyeSh4c1tpXSwgaSkpKVxuICAgICAgeXNbaisrXSA9IHlcbiAgaWYgKGopIHtcbiAgICBpZiAoaiA8IG4pXG4gICAgICB5cy5sZW5ndGggPSBqXG4gICAgcmV0dXJuIHlzXG4gIH1cbn1cblxuZnVuY3Rpb24gY29weVRvRnJvbSh5cywgaywgeHMsIGksIGopIHtcbiAgd2hpbGUgKGkgPCBqKVxuICAgIHlzW2srK10gPSB4c1tpKytdXG4gIHJldHVybiB5c1xufVxuXG4vL1xuXG5jb25zdCBJZGVudCA9IHttYXA6IGFwcGx5VSwgb2Y6IGlkLCBhcDogYXBwbHlVLCBjaGFpbjogYXBwbHlVfVxuXG5jb25zdCBDb25zdCA9IHttYXA6IHNuZFV9XG5cbmZ1bmN0aW9uIENvbmNhdE9mKGFwLCBlbXB0eSwgZGVsYXkpIHtcbiAgY29uc3QgYyA9IHttYXA6IHNuZFUsIGFwLCBvZjogYWx3YXlzKGVtcHR5KX1cbiAgaWYgKGRlbGF5KVxuICAgIGMuZGVsYXkgPSBkZWxheVxuICByZXR1cm4gY1xufVxuXG5jb25zdCBNb25vaWQgPSAoY29uY2F0LCBlbXB0eSkgPT4gKHtjb25jYXQsIGVtcHR5OiAoKSA9PiBlbXB0eX0pXG5cbmNvbnN0IE11bSA9IG9yZCA9PlxuICBNb25vaWQoKHksIHgpID0+IHZvaWQgMCAhPT0geCAmJiAodm9pZCAwID09PSB5IHx8IG9yZCh4LCB5KSkgPyB4IDogeSlcblxuLy9cblxuY29uc3QgcnVuID0gKG8sIEMsIHhpMnlDLCBzLCBpKSA9PiB0b0Z1bmN0aW9uKG8pKEMsIHhpMnlDLCBzLCBpKVxuXG4vL1xuXG5jb25zdCBleHBlY3RlZE9wdGljID0gXCJFeHBlY3RpbmcgYW4gb3B0aWNcIlxuXG5mdW5jdGlvbiBlcnJvckdpdmVuKG0sIG8pIHtcbiAgY29uc29sZS5lcnJvcihcInBhcnRpYWwubGVuc2VzOlwiLCBtLCBcIi0gZ2l2ZW46XCIsIG8pXG4gIHRocm93IG5ldyBFcnJvcihtKVxufVxuXG5mdW5jdGlvbiByZXFGdW5jdGlvbihvKSB7XG4gIGlmICghKGlzRnVuY3Rpb24obykgJiYgKG8ubGVuZ3RoID09PSA0IHx8IG8ubGVuZ3RoIDw9IDIpKSlcbiAgICBlcnJvckdpdmVuKGV4cGVjdGVkT3B0aWMsIG8pXG59XG5cbmZ1bmN0aW9uIHJlcUFycmF5KG8pIHtcbiAgaWYgKCFBcnJheS5pc0FycmF5KG8pKVxuICAgIGVycm9yR2l2ZW4oZXhwZWN0ZWRPcHRpYywgbylcbn1cblxuLy9cblxuZnVuY3Rpb24gcmVxQXBwbGljYXRpdmUoZikge1xuICBpZiAoIWYub2YpXG4gICAgZXJyb3JHaXZlbihcIlRyYXZlcnNhbHMgcmVxdWlyZSBhbiBhcHBsaWNhdGl2ZVwiLCBmKVxufVxuXG4vL1xuXG5mdW5jdGlvbiBKb2luKGwsIHIpIHt0aGlzLmwgPSBsOyB0aGlzLnIgPSByfVxuXG5jb25zdCBpc0pvaW4gPSBuID0+IG4uY29uc3RydWN0b3IgPT09IEpvaW5cblxuY29uc3Qgam9pbiA9IChsLCByKSA9PiB2b2lkIDAgIT09IGwgPyB2b2lkIDAgIT09IHIgPyBuZXcgSm9pbihsLCByKSA6IGwgOiByXG5cbmNvbnN0IGNqb2luID0gaCA9PiB0ID0+IGpvaW4oaCwgdClcblxuZnVuY3Rpb24gcHVzaFRvKG4sIHlzKSB7XG4gIHdoaWxlIChuICYmIGlzSm9pbihuKSkge1xuICAgIGNvbnN0IGwgPSBuLmxcbiAgICBuID0gbi5yXG4gICAgaWYgKGwgJiYgaXNKb2luKGwpKSB7XG4gICAgICBwdXNoVG8obC5sLCB5cylcbiAgICAgIHB1c2hUbyhsLnIsIHlzKVxuICAgIH0gZWxzZSB7XG4gICAgICB5cy5wdXNoKGwpXG4gICAgfVxuICB9XG4gIHlzLnB1c2gobilcbn1cblxuZnVuY3Rpb24gdG9BcnJheShuKSB7XG4gIGlmICh2b2lkIDAgIT09IG4pIHtcbiAgICBjb25zdCB5cyA9IFtdXG4gICAgcHVzaFRvKG4sIHlzKVxuICAgIHJldHVybiB5c1xuICB9XG59XG5cbmZ1bmN0aW9uIGZvbGRSZWMoZiwgciwgbikge1xuICB3aGlsZSAoaXNKb2luKG4pKSB7XG4gICAgY29uc3QgbCA9IG4ubFxuICAgIG4gPSBuLnJcbiAgICByID0gaXNKb2luKGwpXG4gICAgICA/IGZvbGRSZWMoZiwgZm9sZFJlYyhmLCByLCBsLmwpLCBsLnIpXG4gICAgICA6IGYociwgbFswXSwgbFsxXSlcbiAgfVxuICByZXR1cm4gZihyLCBuWzBdLCBuWzFdKVxufVxuXG5jb25zdCBmb2xkID0gKGYsIHIsIG4pID0+IHZvaWQgMCAhPT0gbiA/IGZvbGRSZWMoZiwgciwgbikgOiByXG5cbmNvbnN0IENvbGxlY3QgPSBDb25jYXRPZihqb2luKVxuXG4vL1xuXG5mdW5jdGlvbiB0aGUodikge1xuICBmdW5jdGlvbiByZXN1bHQoKSB7cmV0dXJuIHJlc3VsdH1cbiAgcmVzdWx0LnYgPSB2XG4gIHJldHVybiByZXN1bHRcbn1cblxuY29uc3QgRmlyc3QgPSBDb25jYXRPZigobCwgcikgPT4gbCAmJiBsKCkgfHwgciAmJiByKCksIHZvaWQgMCwgaWQpXG5cbi8vXG5cbmNvbnN0IHRyYXZlcnNlUGFydGlhbEluZGV4TGF6eSA9IChtYXAsIGFwLCB6LCBkZWxheSwgeGkyeUEsIHhzLCBpLCBuKSA9PlxuICBpIDwgblxuICA/IGFwKG1hcChjam9pbiwgeGkyeUEoeHNbaV0sIGkpKSwgZGVsYXkoKCkgPT5cbiAgICAgICB0cmF2ZXJzZVBhcnRpYWxJbmRleExhenkobWFwLCBhcCwgeiwgZGVsYXksIHhpMnlBLCB4cywgaSsxLCBuKSkpXG4gIDogelxuXG5mdW5jdGlvbiB0cmF2ZXJzZVBhcnRpYWxJbmRleChBLCB4aTJ5QSwgeHMpIHtcbiAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIilcbiAgICByZXFBcHBsaWNhdGl2ZShBKVxuICBjb25zdCB7bWFwLCBhcCwgb2YsIGRlbGF5fSA9IEFcbiAgbGV0IHhzQSA9IG9mKHZvaWQgMCksXG4gICAgICBpID0geHMubGVuZ3RoXG4gIGlmIChkZWxheSlcbiAgICB4c0EgPSB0cmF2ZXJzZVBhcnRpYWxJbmRleExhenkobWFwLCBhcCwgeHNBLCBkZWxheSwgeGkyeUEsIHhzLCAwLCBpKVxuICBlbHNlXG4gICAgd2hpbGUgKGktLSlcbiAgICAgIHhzQSA9IGFwKG1hcChjam9pbiwgeGkyeUEoeHNbaV0sIGkpKSwgeHNBKVxuICByZXR1cm4gbWFwKHRvQXJyYXksIHhzQSlcbn1cblxuLy9cblxuZnVuY3Rpb24gb2JqZWN0MFRvVW5kZWZpbmVkKG8pIHtcbiAgaWYgKCEobyBpbnN0YW5jZW9mIE9iamVjdCkpXG4gICAgcmV0dXJuIG9cbiAgZm9yIChjb25zdCBrIGluIG8pXG4gICAgcmV0dXJuIG9cbn1cblxuLy9cblxuY29uc3QgbGVuc0Zyb20gPSAoZ2V0LCBzZXQpID0+IGkgPT4gKEYsIHhpMnlGLCB4LCBfKSA9PlxuICAoMCxGLm1hcCkodiA9PiBzZXQoaSwgdiwgeCksIHhpMnlGKGdldChpLCB4KSwgaSkpXG5cbi8vXG5cbmNvbnN0IGdldFByb3AgPSAoaywgbykgPT4gbyBpbnN0YW5jZW9mIE9iamVjdCA/IG9ba10gOiB2b2lkIDBcblxuY29uc3Qgc2V0UHJvcCA9IChrLCB2LCBvKSA9PlxuICB2b2lkIDAgIT09IHYgPyBhc3NvY1BhcnRpYWxVKGssIHYsIG8pIDogZGlzc29jUGFydGlhbFUoaywgbylcblxuY29uc3QgZnVuUHJvcCA9IGxlbnNGcm9tKGdldFByb3AsIHNldFByb3ApXG5cbi8vXG5cbmNvbnN0IGdldEluZGV4ID0gKGksIHhzKSA9PiBzZWVtc0FycmF5TGlrZSh4cykgPyB4c1tpXSA6IHZvaWQgMFxuXG5mdW5jdGlvbiBzZXRJbmRleChpLCB4LCB4cykge1xuICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiICYmIGkgPCAwKVxuICAgIGVycm9yR2l2ZW4oXCJOZWdhdGl2ZSBpbmRpY2VzIGFyZSBub3Qgc3VwcG9ydGVkIGJ5IGBpbmRleGBcIiwgaSlcbiAgaWYgKCFzZWVtc0FycmF5TGlrZSh4cykpXG4gICAgeHMgPSBcIlwiXG4gIGNvbnN0IG4gPSB4cy5sZW5ndGhcbiAgaWYgKHZvaWQgMCAhPT0geCkge1xuICAgIGNvbnN0IG0gPSBNYXRoLm1heChpKzEsIG4pLCB5cyA9IEFycmF5KG0pXG4gICAgZm9yIChsZXQgaj0wOyBqPG07ICsrailcbiAgICAgIHlzW2pdID0geHNbal1cbiAgICB5c1tpXSA9IHhcbiAgICByZXR1cm4geXNcbiAgfSBlbHNlIHtcbiAgICBpZiAoMCA8IG4pIHtcbiAgICAgIGlmIChuIDw9IGkpXG4gICAgICAgIHJldHVybiBjb3B5VG9Gcm9tKEFycmF5KG4pLCAwLCB4cywgMCwgbilcbiAgICAgIGlmICgxIDwgbikge1xuICAgICAgICBjb25zdCB5cyA9IEFycmF5KG4tMSlcbiAgICAgICAgZm9yIChsZXQgaj0wOyBqPGk7ICsrailcbiAgICAgICAgICB5c1tqXSA9IHhzW2pdXG4gICAgICAgIGZvciAobGV0IGo9aSsxOyBqPG47ICsrailcbiAgICAgICAgICB5c1tqLTFdID0geHNbal1cbiAgICAgICAgcmV0dXJuIHlzXG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbmNvbnN0IGZ1bkluZGV4ID0gbGVuc0Zyb20oZ2V0SW5kZXgsIHNldEluZGV4KVxuXG4vL1xuXG5jb25zdCBjbG9zZSA9IChvLCBGLCB4aTJ5RikgPT4gKHgsIGkpID0+IG8oRiwgeGkyeUYsIHgsIGkpXG5cbmZ1bmN0aW9uIGNvbXBvc2VkKG9pMCwgb3MpIHtcbiAgY29uc3QgbiA9IG9zLmxlbmd0aCAtIG9pMFxuICBsZXQgZnNcbiAgaWYgKG4gPCAyKSB7XG4gICAgcmV0dXJuIG4gPyB0b0Z1bmN0aW9uKG9zW29pMF0pIDogaWRlbnRpdHlcbiAgfSBlbHNlIHtcbiAgICBmcyA9IEFycmF5KG4pXG4gICAgZm9yIChsZXQgaT0wO2k8bjsrK2kpXG4gICAgICBmc1tpXSA9IHRvRnVuY3Rpb24ob3NbaStvaTBdKVxuICAgIHJldHVybiAoRiwgeGkyeUYsIHgsIGkpID0+IHtcbiAgICAgIGxldCBrPW5cbiAgICAgIHdoaWxlICgtLWspXG4gICAgICAgIHhpMnlGID0gY2xvc2UoZnNba10sIEYsIHhpMnlGKVxuICAgICAgcmV0dXJuIGZzWzBdKEYsIHhpMnlGLCB4LCBpKVxuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBzZXRVKG8sIHgsIHMpIHtcbiAgc3dpdGNoICh0eXBlb2Ygbykge1xuICAgIGNhc2UgXCJzdHJpbmdcIjpcbiAgICAgIHJldHVybiBzZXRQcm9wKG8sIHgsIHMpXG4gICAgY2FzZSBcIm51bWJlclwiOlxuICAgICAgcmV0dXJuIHNldEluZGV4KG8sIHgsIHMpXG4gICAgY2FzZSBcIm9iamVjdFwiOlxuICAgICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIilcbiAgICAgICAgcmVxQXJyYXkobylcbiAgICAgIHJldHVybiBtb2RpZnlDb21wb3NlZChvLCAwLCBzLCB4KVxuICAgIGRlZmF1bHQ6XG4gICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKVxuICAgICAgICByZXFGdW5jdGlvbihvKVxuICAgICAgcmV0dXJuIG8ubGVuZ3RoID09PSA0ID8gbyhJZGVudCwgYWx3YXlzKHgpLCBzLCB2b2lkIDApIDogc1xuICB9XG59XG5cbmZ1bmN0aW9uIGdldFUobCwgcykge1xuICBzd2l0Y2ggKHR5cGVvZiBsKSB7XG4gICAgY2FzZSBcInN0cmluZ1wiOlxuICAgICAgcmV0dXJuIGdldFByb3AobCwgcylcbiAgICBjYXNlIFwibnVtYmVyXCI6XG4gICAgICByZXR1cm4gZ2V0SW5kZXgobCwgcylcbiAgICBjYXNlIFwib2JqZWN0XCI6XG4gICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKVxuICAgICAgICByZXFBcnJheShsKVxuICAgICAgZm9yIChsZXQgaT0wLCBuPWwubGVuZ3RoLCBvOyBpPG47ICsraSlcbiAgICAgICAgc3dpdGNoICh0eXBlb2YgKG8gPSBsW2ldKSkge1xuICAgICAgICAgIGNhc2UgXCJzdHJpbmdcIjogcyA9IGdldFByb3Aobywgcyk7IGJyZWFrXG4gICAgICAgICAgY2FzZSBcIm51bWJlclwiOiBzID0gZ2V0SW5kZXgobywgcyk7IGJyZWFrXG4gICAgICAgICAgZGVmYXVsdDogcmV0dXJuIGNvbXBvc2VkKGksIGwpKENvbnN0LCBpZCwgcywgbFtpLTFdKVxuICAgICAgICB9XG4gICAgICByZXR1cm4gc1xuICAgIGRlZmF1bHQ6XG4gICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKVxuICAgICAgICByZXFGdW5jdGlvbihsKVxuICAgICAgcmV0dXJuIGwubGVuZ3RoID09PSA0ID8gbChDb25zdCwgaWQsIHMsIHZvaWQgMCkgOiBsKHMsIHZvaWQgMClcbiAgfVxufVxuXG5mdW5jdGlvbiBtb2RpZnlDb21wb3NlZChvcywgeGkyeSwgeCwgeSkge1xuICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKVxuICAgIHJlcUFycmF5KG9zKVxuICBsZXQgbiA9IG9zLmxlbmd0aFxuICBjb25zdCB4cyA9IEFycmF5KG4pXG4gIGZvciAobGV0IGk9MCwgbzsgaTxuOyArK2kpIHtcbiAgICB4c1tpXSA9IHhcbiAgICBzd2l0Y2ggKHR5cGVvZiAobyA9IG9zW2ldKSkge1xuICAgICAgY2FzZSBcInN0cmluZ1wiOlxuICAgICAgICB4ID0gZ2V0UHJvcChvLCB4KVxuICAgICAgICBicmVha1xuICAgICAgY2FzZSBcIm51bWJlclwiOlxuICAgICAgICB4ID0gZ2V0SW5kZXgobywgeClcbiAgICAgICAgYnJlYWtcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHggPSBjb21wb3NlZChpLCBvcykoSWRlbnQsIHhpMnkgfHwgYWx3YXlzKHkpLCB4LCBvc1tpLTFdKVxuICAgICAgICBuID0gaVxuICAgICAgICBicmVha1xuICAgIH1cbiAgfVxuICBpZiAobiA9PT0gb3MubGVuZ3RoKVxuICAgIHggPSB4aTJ5ID8geGkyeSh4LCBvc1tuLTFdKSA6IHlcbiAgZm9yIChsZXQgbzsgMCA8PSAtLW47KVxuICAgIHggPSBpc1N0cmluZyhvID0gb3Nbbl0pXG4gICAgICAgID8gc2V0UHJvcChvLCB4LCB4c1tuXSlcbiAgICAgICAgOiBzZXRJbmRleChvLCB4LCB4c1tuXSlcbiAgcmV0dXJuIHhcbn1cblxuLy9cblxuZnVuY3Rpb24gZ2V0UGljayh0ZW1wbGF0ZSwgeCkge1xuICBsZXQgclxuICBmb3IgKGNvbnN0IGsgaW4gdGVtcGxhdGUpIHtcbiAgICBjb25zdCB2ID0gZ2V0VSh0ZW1wbGF0ZVtrXSwgeClcbiAgICBpZiAodm9pZCAwICE9PSB2KSB7XG4gICAgICBpZiAoIXIpXG4gICAgICAgIHIgPSB7fVxuICAgICAgcltrXSA9IHZcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJcbn1cblxuY29uc3Qgc2V0UGljayA9ICh0ZW1wbGF0ZSwgeCkgPT4gdmFsdWUgPT4ge1xuICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiICYmXG4gICAgICAhKHZvaWQgMCA9PT0gdmFsdWUgfHwgdmFsdWUgaW5zdGFuY2VvZiBPYmplY3QpKVxuICAgIGVycm9yR2l2ZW4oXCJgcGlja2AgbXVzdCBiZSBzZXQgd2l0aCB1bmRlZmluZWQgb3IgYW4gb2JqZWN0XCIsIHZhbHVlKVxuICBmb3IgKGNvbnN0IGsgaW4gdGVtcGxhdGUpXG4gICAgeCA9IHNldFUodGVtcGxhdGVba10sIHZhbHVlICYmIHZhbHVlW2tdLCB4KVxuICByZXR1cm4geFxufVxuXG4vL1xuXG5jb25zdCB0b09iamVjdCA9IHggPT4gY29uc3RydWN0b3JPZih4KSAhPT0gT2JqZWN0ID8gT2JqZWN0LmFzc2lnbih7fSwgeCkgOiB4XG5cbi8vXG5cbmNvbnN0IGJyYW5jaE9uTWVyZ2UgPSAoeCwga2V5cykgPT4geHMgPT4ge1xuICBjb25zdCBvID0ge30sIG4gPSBrZXlzLmxlbmd0aFxuICBmb3IgKGxldCBpPTA7IGk8bjsgKytpLCB4cz14c1sxXSkge1xuICAgIGNvbnN0IHYgPSB4c1swXVxuICAgIG9ba2V5c1tpXV0gPSB2b2lkIDAgIT09IHYgPyB2IDogb1xuICB9XG4gIGxldCByXG4gIHggPSB0b09iamVjdCh4KVxuICBmb3IgKGNvbnN0IGsgaW4geCkge1xuICAgIGNvbnN0IHYgPSBvW2tdXG4gICAgaWYgKG8gIT09IHYpIHtcbiAgICAgIG9ba10gPSBvXG4gICAgICBpZiAoIXIpXG4gICAgICAgIHIgPSB7fVxuICAgICAgcltrXSA9IHZvaWQgMCAhPT0gdiA/IHYgOiB4W2tdXG4gICAgfVxuICB9XG4gIGZvciAobGV0IGk9MDsgaTxuOyArK2kpIHtcbiAgICBjb25zdCBrID0ga2V5c1tpXVxuICAgIGNvbnN0IHYgPSBvW2tdXG4gICAgaWYgKG8gIT09IHYpIHtcbiAgICAgIGlmICghcilcbiAgICAgICAgciA9IHt9XG4gICAgICByW2tdID0gdlxuICAgIH1cbiAgfVxuICByZXR1cm4gclxufVxuXG5mdW5jdGlvbiBicmFuY2hPbkxhenkoa2V5cywgdmFscywgbWFwLCBhcCwgeiwgZGVsYXksIEEsIHhpMnlBLCB4LCBpKSB7XG4gIGlmIChpIDwga2V5cy5sZW5ndGgpIHtcbiAgICBjb25zdCBrID0ga2V5c1tpXSwgdiA9IHhba11cbiAgICByZXR1cm4gYXAobWFwKGNwYWlyLFxuICAgICAgICAgICAgICAgICAgdmFscyA/IHZhbHNbaV0oQSwgeGkyeUEsIHhba10sIGspIDogeGkyeUEodiwgaykpLCBkZWxheSgoKSA9PlxuICAgICAgICAgICAgICBicmFuY2hPbkxhenkoa2V5cywgdmFscywgbWFwLCBhcCwgeiwgZGVsYXksIEEsIHhpMnlBLCB4LCBpKzEpKSlcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gelxuICB9XG59XG5cbmNvbnN0IGJyYW5jaE9uID0gKGtleXMsIHZhbHMpID0+IChBLCB4aTJ5QSwgeCwgXykgPT4ge1xuICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKVxuICAgIHJlcUFwcGxpY2F0aXZlKEEpXG4gIGNvbnN0IHttYXAsIGFwLCBvZiwgZGVsYXl9ID0gQVxuICBsZXQgaSA9IGtleXMubGVuZ3RoXG4gIGlmICghaSlcbiAgICByZXR1cm4gb2Yob2JqZWN0MFRvVW5kZWZpbmVkKHgpKVxuICBpZiAoISh4IGluc3RhbmNlb2YgT2JqZWN0KSlcbiAgICB4ID0gb2JqZWN0MFxuICBsZXQgeHNBID0gb2YoMClcbiAgaWYgKGRlbGF5KSB7XG4gICAgeHNBID0gYnJhbmNoT25MYXp5KGtleXMsIHZhbHMsIG1hcCwgYXAsIHhzQSwgZGVsYXksIEEsIHhpMnlBLCB4LCAwKVxuICB9IGVsc2Uge1xuICAgIHdoaWxlIChpLS0pIHtcbiAgICAgIGNvbnN0IGsgPSBrZXlzW2ldLCB2ID0geFtrXVxuICAgICAgeHNBID0gYXAobWFwKGNwYWlyLCB2YWxzID8gdmFsc1tpXShBLCB4aTJ5QSwgdiwgaykgOiB4aTJ5QSh2LCBrKSksIHhzQSlcbiAgICB9XG4gIH1cbiAgcmV0dXJuIG1hcChicmFuY2hPbk1lcmdlKHgsIGtleXMpLCB4c0EpXG59XG5cbmNvbnN0IG5vcm1hbGl6ZXIgPSB4aTJ4ID0+IChGLCB4aTJ5RiwgeCwgaSkgPT5cbiAgKDAsRi5tYXApKHggPT4geGkyeCh4LCBpKSwgeGkyeUYoeGkyeCh4LCBpKSwgaSkpXG5cbmNvbnN0IHJlcGxhY2VkID0gKGlubiwgb3V0LCB4KSA9PiBhY3ljbGljRXF1YWxzVSh4LCBpbm4pID8gb3V0IDogeFxuXG5mdW5jdGlvbiBmaW5kSW5kZXgoeGkyYiwgeHMpIHtcbiAgZm9yIChsZXQgaT0wLCBuPXhzLmxlbmd0aDsgaTxuOyArK2kpXG4gICAgaWYgKHhpMmIoeHNbaV0sIGkpKVxuICAgICAgcmV0dXJuIGlcbiAgcmV0dXJuIC0xXG59XG5cbmZ1bmN0aW9uIHBhcnRpdGlvbkludG9JbmRleCh4aTJiLCB4cywgdHMsIGZzKSB7XG4gIGZvciAobGV0IGk9MCwgbj14cy5sZW5ndGgsIHg7IGk8bjsgKytpKVxuICAgICh4aTJiKHggPSB4c1tpXSwgaSkgPyB0cyA6IGZzKS5wdXNoKHgpXG59XG5cbmNvbnN0IGZyb21SZWFkZXIgPSB3aTJ4ID0+IChGLCB4aTJ5RiwgdywgaSkgPT5cbiAgKDAsRi5tYXApKGFsd2F5cyh3KSwgeGkyeUYod2kyeCh3LCBpKSwgaSkpXG5cbi8vXG5cbmV4cG9ydCBmdW5jdGlvbiB0b0Z1bmN0aW9uKG8pIHtcbiAgc3dpdGNoICh0eXBlb2Ygbykge1xuICAgIGNhc2UgXCJzdHJpbmdcIjpcbiAgICAgIHJldHVybiBmdW5Qcm9wKG8pXG4gICAgY2FzZSBcIm51bWJlclwiOlxuICAgICAgcmV0dXJuIGZ1bkluZGV4KG8pXG4gICAgY2FzZSBcIm9iamVjdFwiOlxuICAgICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIilcbiAgICAgICAgcmVxQXJyYXkobylcbiAgICAgIHJldHVybiBjb21wb3NlZCgwLCBvKVxuICAgIGRlZmF1bHQ6XG4gICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKVxuICAgICAgICByZXFGdW5jdGlvbihvKVxuICAgICAgcmV0dXJuIG8ubGVuZ3RoID09PSA0ID8gbyA6IGZyb21SZWFkZXIobylcbiAgfVxufVxuXG4vLyBPcGVyYXRpb25zIG9uIG9wdGljc1xuXG5leHBvcnQgY29uc3QgbW9kaWZ5ID0gY3VycnkoKG8sIHhpMngsIHMpID0+IHtcbiAgc3dpdGNoICh0eXBlb2Ygbykge1xuICAgIGNhc2UgXCJzdHJpbmdcIjpcbiAgICAgIHJldHVybiBzZXRQcm9wKG8sIHhpMngoZ2V0UHJvcChvLCBzKSwgbyksIHMpXG4gICAgY2FzZSBcIm51bWJlclwiOlxuICAgICAgcmV0dXJuIHNldEluZGV4KG8sIHhpMngoZ2V0SW5kZXgobywgcyksIG8pLCBzKVxuICAgIGNhc2UgXCJvYmplY3RcIjpcbiAgICAgIHJldHVybiBtb2RpZnlDb21wb3NlZChvLCB4aTJ4LCBzKVxuICAgIGRlZmF1bHQ6XG4gICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKVxuICAgICAgICByZXFGdW5jdGlvbihvKVxuICAgICAgcmV0dXJuIG8ubGVuZ3RoID09PSA0XG4gICAgICAgID8gbyhJZGVudCwgeGkyeCwgcywgdm9pZCAwKVxuICAgICAgICA6ICh4aTJ4KG8ocywgdm9pZCAwKSwgdm9pZCAwKSwgcylcbiAgfVxufSlcblxuZXhwb3J0IGNvbnN0IHJlbW92ZSA9IGN1cnJ5KChvLCBzKSA9PiBzZXRVKG8sIHZvaWQgMCwgcykpXG5cbmV4cG9ydCBjb25zdCBzZXQgPSBjdXJyeShzZXRVKVxuXG4vLyBTZXF1ZW5jaW5nXG5cbmV4cG9ydCBmdW5jdGlvbiBzZXEoKSB7XG4gIGNvbnN0IG4gPSBhcmd1bWVudHMubGVuZ3RoLCB4TXMgPSBBcnJheShuKVxuICBmb3IgKGxldCBpPTA7IGk8bjsgKytpKVxuICAgIHhNc1tpXSA9IHRvRnVuY3Rpb24oYXJndW1lbnRzW2ldKVxuICBjb25zdCBsb29wID0gKE0sIHhpMnhNLCBpLCBqKSA9PiBqID09PSBuXG4gICAgPyBNLm9mXG4gICAgOiB4ID0+ICgwLCBNLmNoYWluKShsb29wKE0sIHhpMnhNLCBpLCBqKzEpLCB4TXNbal0oTSwgeGkyeE0sIHgsIGkpKVxuICByZXR1cm4gKE0sIHhpMnhNLCB4LCBpKSA9PiB7XG4gICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIiAmJiAhTS5jaGFpbilcbiAgICAgIGVycm9yR2l2ZW4oXCJgc2VxYCByZXF1aXJlcyBhIG1vbmFkXCIsIE0pXG4gICAgcmV0dXJuIGxvb3AoTSwgeGkyeE0sIGksIDApKHgpXG4gIH1cbn1cblxuLy8gTmVzdGluZ1xuXG5leHBvcnQgZnVuY3Rpb24gY29tcG9zZSgpIHtcbiAgbGV0IG4gPSBhcmd1bWVudHMubGVuZ3RoXG4gIGlmIChuIDwgMikge1xuICAgIHJldHVybiBuID8gYXJndW1lbnRzWzBdIDogaWRlbnRpdHlcbiAgfSBlbHNlIHtcbiAgICBjb25zdCBsZW5zZXMgPSBBcnJheShuKVxuICAgIHdoaWxlIChuLS0pXG4gICAgICBsZW5zZXNbbl0gPSBhcmd1bWVudHNbbl1cbiAgICByZXR1cm4gbGVuc2VzXG4gIH1cbn1cblxuLy8gUXVlcnlpbmdcblxuZXhwb3J0IGNvbnN0IGNoYWluID0gY3VycnkoKHhpMnlPLCB4TykgPT5cbiAgW3hPLCBjaG9vc2UoKHhNLCBpKSA9PiB2b2lkIDAgIT09IHhNID8geGkyeU8oeE0sIGkpIDogemVybyldKVxuXG5leHBvcnQgY29uc3QgY2hvaWNlID0gKC4uLmxzKSA9PiBjaG9vc2UoeCA9PiB7XG4gIGNvbnN0IGkgPSBmaW5kSW5kZXgobCA9PiB2b2lkIDAgIT09IGdldFUobCwgeCksIGxzKVxuICByZXR1cm4gaSA8IDAgPyB6ZXJvIDogbHNbaV1cbn0pXG5cbmV4cG9ydCBjb25zdCBjaG9vc2UgPSB4aU0ybyA9PiAoQywgeGkyeUMsIHgsIGkpID0+XG4gIHJ1bih4aU0ybyh4LCBpKSwgQywgeGkyeUMsIHgsIGkpXG5cbmV4cG9ydCBjb25zdCB3aGVuID0gcCA9PiAoQywgeGkyeUMsIHgsIGkpID0+XG4gIHAoeCwgaSkgPyB4aTJ5Qyh4LCBpKSA6IHplcm8oQywgeGkyeUMsIHgsIGkpXG5cbmV4cG9ydCBjb25zdCBvcHRpb25hbCA9IHdoZW4oaXNEZWZpbmVkKVxuXG5leHBvcnQgZnVuY3Rpb24gemVybyhDLCB4aTJ5QywgeCwgaSkge1xuICBjb25zdCBvZiA9IEMub2ZcbiAgcmV0dXJuIG9mID8gb2YoeCkgOiAoMCxDLm1hcCkoYWx3YXlzKHgpLCB4aTJ5Qyh2b2lkIDAsIGkpKVxufVxuXG4vLyBSZWN1cnNpbmdcblxuZXhwb3J0IGZ1bmN0aW9uIGxhenkobzJvKSB7XG4gIGxldCBtZW1vID0gKEMsIHhpMnlDLCB4LCBpKSA9PiAobWVtbyA9IHRvRnVuY3Rpb24obzJvKHJlYykpKShDLCB4aTJ5QywgeCwgaSlcbiAgZnVuY3Rpb24gcmVjKEMsIHhpMnlDLCB4LCBpKSB7cmV0dXJuIG1lbW8oQywgeGkyeUMsIHgsIGkpfVxuICByZXR1cm4gcmVjXG59XG5cbi8vIERlYnVnZ2luZ1xuXG5leHBvcnQgZnVuY3Rpb24gbG9nKCkge1xuICBjb25zdCBzaG93ID0gZGlyID0+IHggPT5cbiAgICBjb25zb2xlLmxvZy5hcHBseShjb25zb2xlLFxuICAgICAgICAgICAgICAgICAgICAgIGNvcHlUb0Zyb20oW10sIDAsIGFyZ3VtZW50cywgMCwgYXJndW1lbnRzLmxlbmd0aClcbiAgICAgICAgICAgICAgICAgICAgICAuY29uY2F0KFtkaXIsIHhdKSkgfHwgeFxuICByZXR1cm4gaXNvKHNob3coXCJnZXRcIiksIHNob3coXCJzZXRcIikpXG59XG5cbi8vIE9wZXJhdGlvbnMgb24gdHJhdmVyc2Fsc1xuXG5leHBvcnQgY29uc3QgY29uY2F0QXMgPSBjdXJyeU4oNCwgKHhNaTJ5LCBtKSA9PiB7XG4gIGNvbnN0IEMgPSBDb25jYXRPZihtLmNvbmNhdCwgKDAsbS5lbXB0eSkoKSwgbS5kZWxheSlcbiAgcmV0dXJuICh0LCBzKSA9PiBydW4odCwgQywgeE1pMnksIHMpXG59KVxuXG5leHBvcnQgY29uc3QgY29uY2F0ID0gY29uY2F0QXMoaWQpXG5cbmV4cG9ydCBjb25zdCBtZXJnZUFzID0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09IFwicHJvZHVjdGlvblwiID8gY29uY2F0QXMgOiAoZiwgbSwgdCwgZCkgPT4ge1xuICBpZiAoIW1lcmdlQXMud2FybmVkKSB7XG4gICAgbWVyZ2VBcy53YXJuZWQgPSAxXG4gICAgY29uc29sZS53YXJuKFwicGFydGlhbC5sZW5zZXM6IGBtZXJnZUFzYCBpcyBvYnNvbGV0ZSwganVzdCB1c2UgYGNvbmNhdEFzYFwiKVxuICB9XG4gIHJldHVybiBjb25jYXRBcyhmLCBtLCB0LCBkKVxufVxuXG5leHBvcnQgY29uc3QgbWVyZ2UgPSBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gXCJwcm9kdWN0aW9uXCIgPyBjb25jYXQgOiAobSwgdCwgZCkgPT4ge1xuICBpZiAoIW1lcmdlLndhcm5lZCkge1xuICAgIG1lcmdlLndhcm5lZCA9IDFcbiAgICBjb25zb2xlLndhcm4oXCJwYXJ0aWFsLmxlbnNlczogYG1lcmdlYCBpcyBvYnNvbGV0ZSwganVzdCB1c2UgYGNvbmNhdGBcIilcbiAgfVxuICByZXR1cm4gY29uY2F0KG0sIHQsIGQpXG59XG5cbi8vIEZvbGRzIG92ZXIgdHJhdmVyc2Fsc1xuXG5leHBvcnQgY29uc3QgY29sbGVjdEFzID0gY3VycnkoKHhpMnksIHQsIHMpID0+XG4gIHRvQXJyYXkocnVuKHQsIENvbGxlY3QsIHhpMnksIHMpKSB8fCBbXSlcblxuZXhwb3J0IGNvbnN0IGNvbGxlY3QgPSBjb2xsZWN0QXMoaWQpXG5cbmV4cG9ydCBjb25zdCBmaXJzdEFzID0gY3VycnkoKHhpMnlNLCB0LCBzKSA9PiB7XG4gIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIgJiYgIWZpcnN0QXMud2FybmVkKSB7XG4gICAgZmlyc3RBcy53YXJuZWQgPSAxXG4gICAgY29uc29sZS53YXJuKFwicGFydGlhbC5sZW5zZXM6IGBmaXJzdGAgYW5kIGBmaXJzdEFzYCBhcmUgZXhwZXJpbWVudGFsIGZlYXR1cmVzLlwiKVxuICB9XG4gIHJldHVybiAocyA9IHJ1bih0LFxuICAgICAgICAgICAgICAgICAgRmlyc3QsXG4gICAgICAgICAgICAgICAgICAoeCwgaSkgPT4gKHggPSB4aTJ5TSh4LCBpKSwgdm9pZCAwICE9PSB4ID8gdGhlKHgpIDogeCksXG4gICAgICAgICAgICAgICAgICBzKSxcbiAgICAgICAgICBzICYmIChzID0gcygpKSAmJiBzLnYpXG59KVxuXG5leHBvcnQgY29uc3QgZmlyc3QgPSBmaXJzdEFzKGlkKVxuXG5leHBvcnQgY29uc3QgZm9sZGwgPSBjdXJyeSgoZiwgciwgdCwgcykgPT5cbiAgZm9sZChmLCByLCBydW4odCwgQ29sbGVjdCwgcGFpciwgcykpKVxuXG5leHBvcnQgY29uc3QgZm9sZHIgPSBjdXJyeSgoZiwgciwgdCwgcykgPT4ge1xuICBjb25zdCB4cyA9IGNvbGxlY3RBcyhwYWlyLCB0LCBzKVxuICBmb3IgKGxldCBpPXhzLmxlbmd0aC0xOyAwPD1pOyAtLWkpIHtcbiAgICBjb25zdCB4ID0geHNbaV1cbiAgICByID0gZihyLCB4WzBdLCB4WzFdKVxuICB9XG4gIHJldHVybiByXG59KVxuXG5leHBvcnQgY29uc3QgbWF4aW11bSA9IGNvbmNhdChNdW0oKHgsIHkpID0+IHggPiB5KSlcblxuZXhwb3J0IGNvbnN0IG1pbmltdW0gPSBjb25jYXQoTXVtKCh4LCB5KSA9PiB4IDwgeSkpXG5cbmV4cG9ydCBjb25zdCBwcm9kdWN0ID0gY29uY2F0QXModW50bygxKSwgTW9ub2lkKCh5LCB4KSA9PiB4ICogeSwgMSkpXG5cbmV4cG9ydCBjb25zdCBzdW0gPSBjb25jYXRBcyh1bnRvKDApLCBNb25vaWQoKHksIHgpID0+IHggKyB5LCAwKSlcblxuLy8gQ3JlYXRpbmcgbmV3IHRyYXZlcnNhbHNcblxuZXhwb3J0IGZ1bmN0aW9uIGJyYW5jaCh0ZW1wbGF0ZSkge1xuICBjb25zdCBrZXlzID0gW10sIHZhbHMgPSBbXVxuICBmb3IgKGNvbnN0IGsgaW4gdGVtcGxhdGUpIHtcbiAgICBrZXlzLnB1c2goaylcbiAgICB2YWxzLnB1c2godG9GdW5jdGlvbih0ZW1wbGF0ZVtrXSkpXG4gIH1cbiAgcmV0dXJuIGJyYW5jaE9uKGtleXMsIHZhbHMpXG59XG5cbi8vIFRyYXZlcnNhbHMgYW5kIGNvbWJpbmF0b3JzXG5cbmV4cG9ydCBmdW5jdGlvbiBlbGVtcyhBLCB4aTJ5QSwgeHMsIF8pIHtcbiAgaWYgKHNlZW1zQXJyYXlMaWtlKHhzKSkge1xuICAgIHJldHVybiBBID09PSBJZGVudFxuICAgICAgPyBtYXBQYXJ0aWFsSW5kZXhVKHhpMnlBLCB4cylcbiAgICAgIDogdHJhdmVyc2VQYXJ0aWFsSW5kZXgoQSwgeGkyeUEsIHhzKVxuICB9IGVsc2Uge1xuICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpXG4gICAgICByZXFBcHBsaWNhdGl2ZShBKVxuICAgIHJldHVybiAoMCxBLm9mKSh4cylcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gdmFsdWVzKEEsIHhpMnlBLCB4cywgXykge1xuICBpZiAoeHMgaW5zdGFuY2VvZiBPYmplY3QpIHtcbiAgICByZXR1cm4gYnJhbmNoT24oa2V5cyh4cykpKEEsIHhpMnlBLCB4cylcbiAgfSBlbHNlIHtcbiAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKVxuICAgICAgcmVxQXBwbGljYXRpdmUoQSlcbiAgICByZXR1cm4gKDAsQS5vZikoeHMpXG4gIH1cbn1cblxuLy8gT3BlcmF0aW9ucyBvbiBsZW5zZXNcblxuZXhwb3J0IGNvbnN0IGdldCA9IGN1cnJ5KGdldFUpXG5cbi8vIENyZWF0aW5nIG5ldyBsZW5zZXNcblxuZXhwb3J0IGNvbnN0IGxlbnMgPSBjdXJyeSgoZ2V0LCBzZXQpID0+IChGLCB4aTJ5RiwgeCwgaSkgPT5cbiAgKDAsRi5tYXApKHkgPT4gc2V0KHksIHgsIGkpLCB4aTJ5RihnZXQoeCwgaSksIGkpKSlcblxuLy8gQ29tcHV0aW5nIGRlcml2ZWQgcHJvcHNcblxuZXhwb3J0IGNvbnN0IGF1Z21lbnQgPSB0ZW1wbGF0ZSA9PiB7XG4gIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIgJiYgIWlzT2JqZWN0KHRlbXBsYXRlKSlcbiAgICBlcnJvckdpdmVuKFwiYGF1Z21lbnRgIGV4cGVjdHMgYSBwbGFpbiBPYmplY3QgdGVtcGxhdGVcIiwgdGVtcGxhdGUpXG4gIHJldHVybiBsZW5zKFxuICAgIHggPT4ge1xuICAgICAgeCA9IGRpc3NvY1BhcnRpYWxVKDAsIHgpXG4gICAgICBpZiAoeClcbiAgICAgICAgZm9yIChjb25zdCBrIGluIHRlbXBsYXRlKVxuICAgICAgICAgIHhba10gPSB0ZW1wbGF0ZVtrXSh4KVxuICAgICAgcmV0dXJuIHhcbiAgICB9LFxuICAgICh5LCB4KSA9PiB7XG4gICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiICYmXG4gICAgICAgICAgISh2b2lkIDAgPT09IHkgfHwgeSBpbnN0YW5jZW9mIE9iamVjdCkpXG4gICAgICAgIGVycm9yR2l2ZW4oXCJgYXVnbWVudGAgbXVzdCBiZSBzZXQgd2l0aCB1bmRlZmluZWQgb3IgYW4gb2JqZWN0XCIsIHkpXG4gICAgICB5ID0gdG9PYmplY3QoeSlcbiAgICAgIGlmICghKHggaW5zdGFuY2VvZiBPYmplY3QpKVxuICAgICAgICB4ID0gdm9pZCAwXG4gICAgICBsZXQgelxuICAgICAgZnVuY3Rpb24gc2V0KGssIHYpIHtcbiAgICAgICAgaWYgKCF6KVxuICAgICAgICAgIHogPSB7fVxuICAgICAgICB6W2tdID0gdlxuICAgICAgfVxuICAgICAgZm9yIChjb25zdCBrIGluIHkpIHtcbiAgICAgICAgaWYgKCFoYXNVKGssIHRlbXBsYXRlKSlcbiAgICAgICAgICBzZXQoaywgeVtrXSlcbiAgICAgICAgZWxzZVxuICAgICAgICAgIGlmICh4ICYmIGhhc1UoaywgeCkpXG4gICAgICAgICAgICBzZXQoaywgeFtrXSlcbiAgICAgIH1cbiAgICAgIHJldHVybiB6XG4gICAgfSlcbn1cblxuLy8gRW5mb3JjaW5nIGludmFyaWFudHNcblxuZXhwb3J0IGNvbnN0IGRlZmF1bHRzID0gb3V0ID0+IHtcbiAgY29uc3QgbzJ1ID0geCA9PiByZXBsYWNlZChvdXQsIHZvaWQgMCwgeClcbiAgcmV0dXJuIChGLCB4aTJ5RiwgeCwgaSkgPT4gKDAsRi5tYXApKG8ydSwgeGkyeUYodm9pZCAwICE9PSB4ID8geCA6IG91dCwgaSkpXG59XG5cbmV4cG9ydCBjb25zdCByZXF1aXJlZCA9IGlubiA9PiByZXBsYWNlKGlubiwgdm9pZCAwKVxuXG5leHBvcnQgY29uc3QgZGVmaW5lID0gdiA9PiBub3JtYWxpemVyKHVudG8odikpXG5cbmV4cG9ydCBjb25zdCBub3JtYWxpemUgPSB4aTJ4ID0+XG4gIG5vcm1hbGl6ZXIoKHgsIGkpID0+IHZvaWQgMCAhPT0geCA/IHhpMngoeCwgaSkgOiB2b2lkIDApXG5cbmV4cG9ydCBjb25zdCByZXdyaXRlID0geWkyeSA9PiAoRiwgeGkyeUYsIHgsIGkpID0+XG4gICgwLEYubWFwKSh5ID0+IHZvaWQgMCAhPT0geSA/IHlpMnkoeSwgaSkgOiB2b2lkIDAsIHhpMnlGKHgsIGkpKVxuXG4vLyBMZW5zaW5nIGFycmF5c1xuXG5leHBvcnQgY29uc3QgYXBwZW5kID0gKEYsIHhpMnlGLCB4cywgaSkgPT5cbiAgKDAsRi5tYXApKHggPT4gc2V0SW5kZXgoc2VlbXNBcnJheUxpa2UoeHMpID8geHMubGVuZ3RoIDogMCwgeCwgeHMpLFxuICAgICAgICAgICAgeGkyeUYodm9pZCAwLCBpKSlcblxuZXhwb3J0IGNvbnN0IGZpbHRlciA9IHhpMmIgPT4gKEYsIHhpMnlGLCB4cywgaSkgPT4ge1xuICBsZXQgdHMsIGZzXG4gIGlmIChzZWVtc0FycmF5TGlrZSh4cykpXG4gICAgcGFydGl0aW9uSW50b0luZGV4KHhpMmIsIHhzLCB0cyA9IFtdLCBmcyA9IFtdKVxuICByZXR1cm4gKDAsRi5tYXApKFxuICAgIHRzID0+IHtcbiAgICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIgJiZcbiAgICAgICAgICAhKHZvaWQgMCA9PT0gdHMgfHwgc2VlbXNBcnJheUxpa2UodHMpKSlcbiAgICAgICAgZXJyb3JHaXZlbihcImBmaWx0ZXJgIG11c3QgYmUgc2V0IHdpdGggdW5kZWZpbmVkIG9yIGFuIGFycmF5LWxpa2Ugb2JqZWN0XCIsIHRzKVxuICAgICAgY29uc3QgdHNOID0gdHMgPyB0cy5sZW5ndGggOiAwLFxuICAgICAgICAgICAgZnNOID0gZnMgPyBmcy5sZW5ndGggOiAwLFxuICAgICAgICAgICAgbiA9IHRzTiArIGZzTlxuICAgICAgaWYgKG4pXG4gICAgICAgIHJldHVybiBuID09PSBmc05cbiAgICAgICAgPyBmc1xuICAgICAgICA6IGNvcHlUb0Zyb20oY29weVRvRnJvbShBcnJheShuKSwgMCwgdHMsIDAsIHRzTiksIHRzTiwgZnMsIDAsIGZzTilcbiAgICB9LFxuICAgIHhpMnlGKHRzLCBpKSlcbn1cblxuZXhwb3J0IGNvbnN0IGZpbmQgPSB4aTJiID0+IGNob29zZSh4cyA9PiB7XG4gIGlmICghc2VlbXNBcnJheUxpa2UoeHMpKVxuICAgIHJldHVybiAwXG4gIGNvbnN0IGkgPSBmaW5kSW5kZXgoeGkyYiwgeHMpXG4gIHJldHVybiBpIDwgMCA/IGFwcGVuZCA6IGlcbn0pXG5cbmV4cG9ydCBmdW5jdGlvbiBmaW5kV2l0aCguLi5scykge1xuICBjb25zdCBsbHMgPSBjb21wb3NlKC4uLmxzKVxuICByZXR1cm4gW2ZpbmQoeCA9PiB2b2lkIDAgIT09IGdldFUobGxzLCB4KSksIGxsc11cbn1cblxuZXhwb3J0IGNvbnN0IGluZGV4ID0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09IFwicHJvZHVjdGlvblwiID8gaWQgOiB4ID0+IHtcbiAgaWYgKCFOdW1iZXIuaXNJbnRlZ2VyKHgpIHx8IHggPCAwKVxuICAgIGVycm9yR2l2ZW4oXCJgaW5kZXhgIGV4cGVjdHMgYSBub24tbmVnYXRpdmUgaW50ZWdlclwiLCB4KVxuICByZXR1cm4geFxufVxuXG5leHBvcnQgY29uc3Qgc2xpY2UgPSBjdXJyeSgoYmVnaW4sIGVuZCkgPT4gKEYsIHhzaTJ5RiwgeHMsIGkpID0+IHtcbiAgY29uc3Qgc2VlbXMgPSBzZWVtc0FycmF5TGlrZSh4cyksXG4gICAgICAgIHhzTiA9IHNlZW1zICYmIHhzLmxlbmd0aCxcbiAgICAgICAgYiA9IHNsaWNlSW5kZXgoMCwgeHNOLCAwLCBiZWdpbiksXG4gICAgICAgIGUgPSBzbGljZUluZGV4KGIsIHhzTiwgeHNOLCBlbmQpXG4gIHJldHVybiAoMCxGLm1hcCkoXG4gICAgenMgPT4ge1xuICAgICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIiAmJlxuICAgICAgICAgICEodm9pZCAwID09PSB6cyB8fCBzZWVtc0FycmF5TGlrZSh6cykpKVxuICAgICAgICBlcnJvckdpdmVuKFwiYHNsaWNlYCBtdXN0IGJlIHNldCB3aXRoIHVuZGVmaW5lZCBvciBhbiBhcnJheS1saWtlIG9iamVjdFwiLCB6cylcbiAgICAgIGNvbnN0IHpzTiA9IHpzID8genMubGVuZ3RoIDogMCwgYlB6c04gPSBiICsgenNOLCBuID0geHNOIC0gZSArIGJQenNOXG4gICAgICByZXR1cm4gblxuICAgICAgICA/IGNvcHlUb0Zyb20oY29weVRvRnJvbShjb3B5VG9Gcm9tKEFycmF5KG4pLCAwLCB4cywgMCwgYiksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHpzLCAwLCB6c04pLFxuICAgICAgICAgICAgICAgICAgICAgYlB6c04sXG4gICAgICAgICAgICAgICAgICAgICB4cywgZSwgeHNOKVxuICAgICAgICA6IHZvaWQgMFxuICAgIH0sXG4gICAgeHNpMnlGKHNlZW1zID8gY29weVRvRnJvbShBcnJheShNYXRoLm1heCgwLCBlIC0gYikpLCAwLCB4cywgYiwgZSkgOlxuICAgICAgICAgICB2b2lkIDAsXG4gICAgICAgICAgIGkpKVxufSlcblxuLy8gTGVuc2luZyBvYmplY3RzXG5cbmV4cG9ydCBjb25zdCBwcm9wID0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09IFwicHJvZHVjdGlvblwiID8gaWQgOiB4ID0+IHtcbiAgaWYgKCFpc1N0cmluZyh4KSlcbiAgICBlcnJvckdpdmVuKFwiYHByb3BgIGV4cGVjdHMgYSBzdHJpbmdcIiwgeClcbiAgcmV0dXJuIHhcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHByb3BzKCkge1xuICBjb25zdCBuID0gYXJndW1lbnRzLmxlbmd0aCwgdGVtcGxhdGUgPSB7fVxuICBmb3IgKGxldCBpPTAsIGs7IGk8bjsgKytpKVxuICAgIHRlbXBsYXRlW2sgPSBhcmd1bWVudHNbaV1dID0ga1xuICByZXR1cm4gcGljayh0ZW1wbGF0ZSlcbn1cblxuZXhwb3J0IGNvbnN0IHJlbW92YWJsZSA9ICguLi5wcykgPT4gKEYsIHhpMnlGLCB4LCBpKSA9PiAoMCxGLm1hcCkoXG4gIHkgPT4ge1xuICAgIGlmICghKHkgaW5zdGFuY2VvZiBPYmplY3QpKVxuICAgICAgcmV0dXJuIHlcbiAgICBmb3IgKGxldCBpPTAsIG49cHMubGVuZ3RoOyBpPG47ICsraSlcbiAgICAgIGlmIChoYXNVKHBzW2ldLCB5KSlcbiAgICAgICAgcmV0dXJuIHlcbiAgfSxcbiAgeGkyeUYoeCwgaSkpXG5cbi8vIFByb3ZpZGluZyBkZWZhdWx0c1xuXG5leHBvcnQgY29uc3QgdmFsdWVPciA9IHYgPT4gKF9GLCB4aTJ5RiwgeCwgaSkgPT5cbiAgeGkyeUYodm9pZCAwICE9PSB4ICYmIHggIT09IG51bGwgPyB4IDogdiwgaSlcblxuLy8gQWRhcHRpbmcgdG8gZGF0YVxuXG5leHBvcnQgY29uc3Qgb3JFbHNlID1cbiAgY3VycnkoKGQsIGwpID0+IGNob29zZSh4ID0+IHZvaWQgMCAhPT0gZ2V0VShsLCB4KSA/IGwgOiBkKSlcblxuLy8gUmVhZC1vbmx5IG1hcHBpbmdcblxuZXhwb3J0IGNvbnN0IHRvID0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09IFwicHJvZHVjdGlvblwiID8gaWQgOiB3aTJ4ID0+IHtcbiAgaWYgKCF0by53YXJuZWQpIHtcbiAgICB0by53YXJuZWQgPSAxXG4gICAgY29uc29sZS53YXJuKFwicGFydGlhbC5sZW5zZXM6IGB0b2AgaXMgb2Jzb2xldGUsIHlvdSBjYW4gZGlyZWN0bHkgYGNvbXBvc2VgIHBsYWluIGZ1bmN0aW9ucyB3aXRoIG9wdGljc1wiKVxuICB9XG4gIHJldHVybiB3aTJ4XG59XG5cbmV4cG9ydCBjb25zdCBqdXN0ID0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09IFwicHJvZHVjdGlvblwiID8gYWx3YXlzIDogeCA9PiB7XG4gIGlmICghanVzdC53YXJuZWQpIHtcbiAgICBqdXN0Lndhcm5lZCA9IDFcbiAgICBjb25zb2xlLndhcm4oXCJwYXJ0aWFsLmxlbnNlczogYGp1c3RgIGlzIG9ic29sZXRlLCBqdXN0IHVzZSBlLmcuIGBSLmFsd2F5c2BcIilcbiAgfVxuICByZXR1cm4gYWx3YXlzKHgpXG59XG5cbi8vIFRyYW5zZm9ybWluZyBkYXRhXG5cbmV4cG9ydCBjb25zdCBwaWNrID0gdGVtcGxhdGUgPT4ge1xuICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiICYmICFpc09iamVjdCh0ZW1wbGF0ZSkpXG4gICAgZXJyb3JHaXZlbihcImBwaWNrYCBleHBlY3RzIGEgcGxhaW4gT2JqZWN0IHRlbXBsYXRlXCIsIHRlbXBsYXRlKVxuICByZXR1cm4gKEYsIHhpMnlGLCB4LCBpKSA9PlxuICAgICgwLEYubWFwKShzZXRQaWNrKHRlbXBsYXRlLCB4KSwgeGkyeUYoZ2V0UGljayh0ZW1wbGF0ZSwgeCksIGkpKVxufVxuXG5leHBvcnQgY29uc3QgcmVwbGFjZSA9IGN1cnJ5KChpbm4sIG91dCkgPT4ge1xuICBjb25zdCBvMmkgPSB4ID0+IHJlcGxhY2VkKG91dCwgaW5uLCB4KVxuICByZXR1cm4gKEYsIHhpMnlGLCB4LCBpKSA9PiAoMCxGLm1hcCkobzJpLCB4aTJ5RihyZXBsYWNlZChpbm4sIG91dCwgeCksIGkpKVxufSlcblxuLy8gT3BlcmF0aW9ucyBvbiBpc29tb3JwaGlzbXNcblxuZXhwb3J0IGNvbnN0IGdldEludmVyc2UgPSBhcml0eU4oMiwgc2V0VSlcblxuLy8gQ3JlYXRpbmcgbmV3IGlzb21vcnBoaXNtc1xuXG5leHBvcnQgY29uc3QgaXNvID1cbiAgY3VycnkoKGJ3ZCwgZndkKSA9PiAoRiwgeGkyeUYsIHgsIGkpID0+ICgwLEYubWFwKShmd2QsIHhpMnlGKGJ3ZCh4KSwgaSkpKVxuXG4vLyBJc29tb3JwaGlzbXMgYW5kIGNvbWJpbmF0b3JzXG5cbmV4cG9ydCBjb25zdCBpZGVudGl0eSA9IChfRiwgeGkyeUYsIHgsIGkpID0+IHhpMnlGKHgsIGkpXG5cbmV4cG9ydCBjb25zdCBpbnZlcnNlID0gaXNvID0+IChGLCB4aTJ5RiwgeCwgaSkgPT5cbiAgKDAsRi5tYXApKHggPT4gZ2V0VShpc28sIHgpLCB4aTJ5RihzZXRVKGlzbywgeCksIGkpKVxuIl19
