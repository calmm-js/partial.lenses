(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.L = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.inverse = exports.identity = exports.iso = exports.getInverse = exports.replace = exports.pick = exports.just = exports.to = exports.orElse = exports.valueOr = exports.prop = exports.slice = exports.index = exports.find = exports.filter = exports.append = exports.rewrite = exports.normalize = exports.define = exports.required = exports.defaults = exports.augment = exports.lens = exports.get = exports.sum = exports.product = exports.minimum = exports.maximum = exports.foldr = exports.foldl = exports.collect = exports.collectAs = exports.merge = exports.mergeAs = exports.concat = exports.concatAs = exports.log = exports.optional = exports.when = exports.choose = exports.choice = exports.chain = exports.set = exports.remove = exports.modify = undefined;
exports.toFunction = toFunction;
exports.compose = compose;
exports.zero = zero;
exports.lazy = lazy;
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

var flip = function flip(bop) {
  return function (x, y) {
    return bop(y, x);
  };
};

var unto = function unto(c) {
  return function (x) {
    return void 0 !== x ? x : c;
  };
};

var isNat = function isNat(x) {
  return x === x >> 0 && 0 <= x;
};

var seemsArrayLike = function seemsArrayLike(x) {
  return x instanceof Object && isNat(x.length) || typeof x === "string";
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

function setAt(xs, i, x) {
  xs[i] = x;
  return xs;
}

//

var Applicative = function Applicative(map, of, ap) {
  return { map: map, of: of, ap: ap };
};

var Ident = Applicative(_infestines.applyU, _infestines.id, _infestines.applyU);

var Const = { map: _infestines.sndU };

var TacnocOf = function TacnocOf(empty, tacnoc) {
  return Applicative(_infestines.sndU, (0, _infestines.always)(empty), tacnoc);
};

var Monoid = function Monoid(_empty, concat) {
  return { empty: function empty() {
      return _empty;
    }, concat: concat };
};

var Mum = function Mum(ord) {
  return Monoid(void 0, function (y, x) {
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

function reqApplicative(f) {
  if (!f.of) throw new Error("partial.lenses: Traversals require an applicative.");
}

//

function Concat(l, r) {
  this.l = l;this.r = r;
}

var isConcat = function isConcat(n) {
  return n.constructor === Concat;
};

var ap = function ap(r, l) {
  return void 0 !== l ? void 0 !== r ? new Concat(l, r) : l : r;
};

var rconcat = function rconcat(t) {
  return function (h) {
    return ap(t, h);
  };
};

function pushTo(n, ys) {
  while (n && isConcat(n)) {
    var l = n.l;
    n = n.r;
    if (l && isConcat(l)) {
      pushTo(l.l, ys);
      pushTo(l.r, ys);
    } else ys.push(l);
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
  while (isConcat(n)) {
    var l = n.l;
    n = n.r;
    r = isConcat(l) ? foldRec(f, foldRec(f, r, l.l), l.r) : f(r, l[0], l[1]);
  }
  return f(r, n[0], n[1]);
}

var fold = function fold(f, r, n) {
  return void 0 !== n ? foldRec(f, r, n) : r;
};

var Collect = TacnocOf(void 0, ap);

//

function traversePartialIndex(A, xi2yA, xs) {
  var ap = A.ap,
      map = A.map;
  if ("dev" !== "production") reqApplicative(A);
  var s = (0, A.of)(void 0),
      i = xs.length;
  while (i--) {
    s = ap(map(rconcat, s), xi2yA(xs[i], i));
  }return map(toArray, s);
}

//

function object0ToUndefined(o) {
  if (!(o instanceof Object)) return o;
  for (var k in o) {
    return o;
  }
}

//

var getProp = function getProp(k, o) {
  return o instanceof Object ? o[k] : void 0;
};

var setProp = function setProp(k, v, o) {
  return void 0 !== v ? (0, _infestines.assocPartialU)(k, v, o) : (0, _infestines.dissocPartialU)(k, o);
};

//

var getIndex = function getIndex(i, xs) {
  return seemsArrayLike(xs) ? xs[i] : void 0;
};

function setIndex(i, x, xs) {
  if ("dev" !== "production" && i < 0) throw new Error("partial.lenses: Negative indices are not supported by `index`.");
  if (!seemsArrayLike(xs)) xs = "";
  var n = xs.length;
  if (void 0 !== x) {
    if (n <= i) return setAt(copyToFrom(Array(i + 1), 0, xs, 0, i), i, x);
    var ys = Array(n);
    for (var j = 0; j < n; ++j) {
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

//

function reqOptic(o) {
  if (!(typeof o === "function" && o.length === 4)) throw new Error("partial.lenses: Expecting an optic.");
}

var close = function close(o, F, xi2yF) {
  return function (x, i) {
    return o(F, xi2yF, x, i);
  };
};

function composed(oi0, os) {
  switch (os.length - oi0) {
    case 0:
      return identity;
    case 1:
      return toFunction(os[oi0]);
    default:
      return function (F, xi2yF, x, i) {
        var n = os.length;
        xi2yF = close(toFunction(os[--n]), F, xi2yF);
        while (oi0 < --n) {
          xi2yF = close(toFunction(os[n]), F, xi2yF);
        }return run(os[oi0], F, xi2yF, x, i);
      };
  }
}

function setU(o, x, s) {
  switch (typeof o) {
    case "string":
      return setProp(o, x, s);
    case "number":
      return setIndex(o, x, s);
    case "function":
      if ("dev" !== "production") reqOptic(o);
      return o(Ident, (0, _infestines.always)(x), s, void 0);
    default:
      return modifyComposed(o, (0, _infestines.always)(x), s);
  }
}

function getU(l, s) {
  switch (typeof l) {
    case "string":
      return getProp(l, s);
    case "number":
      return getIndex(l, s);
    case "object":
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
      if ("dev" !== "production") reqOptic(l);
      return l(Const, _infestines.id, s, void 0);
  }
}

function modifyComposed(os, xi2x, x) {
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
        x = composed(i, os)(Ident, xi2x, x, os[i - 1]);
        n = i;
        break;
    }
  }
  if (n === os.length) x = xi2x(x, os[n - 1]);
  while (0 <= --n) {
    var _o = os[n];
    switch (typeof _o) {
      case "string":
        x = setProp(_o, x, xs[n]);break;
      case "number":
        x = setIndex(_o, x, xs[n]);break;
    }
  }
  return x;
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
    if ("dev" !== "production" && !(void 0 === value || value instanceof Object)) throw new Error("partial.lenses: `pick` must be set with undefined or an object");
    for (var k in template) {
      x = setU(template[k], value && value[k], x);
    }return x;
  };
};

//

var show = function show(labels, dir) {
  return function (x) {
    return console.log.apply(console, labels.concat([dir, x])) || x;
  };
};

function branchOnMerge(x, keys, xs) {
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
}

var branchOn = function branchOn(keys, vals) {
  return function (A, xi2yA, x, _) {
    if ("dev" !== "production") reqApplicative(A);
    var n = keys.length,
        of = A.of;
    if (!n) return of(object0ToUndefined(x));
    if (!(x instanceof Object)) x = _infestines.object0;
    var ap = A.ap,
        wait = function wait(i, xs) {
      return 0 <= i ? function (x) {
        return wait(i - 1, [x, xs]);
      } : branchOnMerge(x, keys, xs);
    };
    var xsA = of(wait(n - 1));
    for (var i = n - 1; 0 <= i; --i) {
      var k = keys[i],
          v = x[k];
      xsA = ap(xsA, vals ? vals[i](A, xi2yA, v, k) : xi2yA(v, k));
    }
    return xsA;
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
      return function (F, xi2yF, x, _) {
        return (0, F.map)(function (v) {
          return setProp(o, v, x);
        }, xi2yF(getProp(o, x), o));
      };
    case "number":
      return function (F, xi2yF, xs, _) {
        return (0, F.map)(function (y) {
          return setIndex(o, y, xs);
        }, xi2yF(getIndex(o, xs), o));
      };
    case "function":
      if ("dev" !== "production") reqOptic(o);
      return o;
    default:
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
      if ("dev" !== "production") reqOptic(o);
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
  switch (arguments.length) {
    case 0:
      return identity;
    case 1:
      return arguments[0];
    default:
      {
        var n = arguments.length,
            lenses = Array(n);
        for (var i = 0; i < n; ++i) {
          lenses[i] = arguments[i];
        }return lenses;
      }
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

var log = exports.log = function log() {
  for (var _len2 = arguments.length, labels = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    labels[_key2] = arguments[_key2];
  }

  return iso(show(labels, "get"), show(labels, "set"));
};

// Operations on traversals

var concatAs = exports.concatAs = constAs(function (m) {
  return TacnocOf((0, m.empty)(), flip(m.concat));
});

var concat = exports.concat = concatAs(_infestines.id);

var mergeAs = exports.mergeAs = constAs(function (m) {
  return TacnocOf((0, m.empty)(), m.concat);
});

var merge = exports.merge = mergeAs(_infestines.id);

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

var maximum = exports.maximum = merge(Mum(function (x, y) {
  return x > y;
}));

var minimum = exports.minimum = merge(Mum(function (x, y) {
  return x < y;
}));

var product = exports.product = mergeAs(unto(1), Monoid(1, function (y, x) {
  return x * y;
}));

var sum = exports.sum = mergeAs(unto(0), Monoid(0, function (y, x) {
  return x + y;
}));

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
  if ("dev" !== "production" && !(0, _infestines.isObject)(template)) throw new Error("partial.lenses: `augment` expects a plain Object template");
  return lens(function (x) {
    x = (0, _infestines.dissocPartialU)(0, x);
    if (x) for (var k in template) {
      x[k] = template[k](x);
    }return x;
  }, function (y, x) {
    if ("dev" !== "production" && !(void 0 === y || y instanceof Object)) throw new Error("partial.lenses: `augment` must be set with undefined or an object");
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
      if ("dev" !== "production" && !(void 0 === ts || seemsArrayLike(ts))) throw new Error("partial.lenses: `filter` must be set with undefined or an array-like object");
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
  if (!Number.isInteger(x) || x < 0) throw new Error("partial.lenses: `index` expects a non-negative integer.");
  return x;
};

var slice = exports.slice = (0, _infestines.curry)(function (begin, end) {
  return function (F, xsi2yF, xs, i) {
    var seems = seemsArrayLike(xs),
        xsN = seems && xs.length,
        b = sliceIndex(0, xsN, 0, begin),
        e = sliceIndex(b, xsN, xsN, end);
    return (0, F.map)(function (zs) {
      if ("dev" !== "production" && !(void 0 === zs || seemsArrayLike(zs))) throw new Error("partial.lenses: `slice` must be set with undefined or an array-like object");
      var zsN = zs ? zs.length : 0,
          bPzsN = b + zsN,
          n = xsN - e + bPzsN;
      return n ? copyToFrom(copyToFrom(copyToFrom(Array(n), 0, xs, 0, b), b, zs, 0, zsN), bPzsN, xs, e, xsN) : void 0;
    }, xsi2yF(seems ? copyToFrom(Array(Math.max(0, e - b)), 0, xs, b, e) : void 0, i));
  };
});

// Lensing objects

var prop = exports.prop = "dev" === "production" ? _infestines.id : function (x) {
  if (typeof x !== "string") throw new Error("partial.lenses: `prop` expects a string.");
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
  if ("dev" !== "production" && !(0, _infestines.isObject)(template)) throw new Error("partial.lenses: `pick` expects a plain Object template");
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvcGFydGlhbC5sZW5zZXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7UUNnWWdCLFUsR0FBQSxVO1FBd0NBLE8sR0FBQSxPO1FBK0JBLEksR0FBQSxJO1FBT0EsSSxHQUFBLEk7UUFpREEsTSxHQUFBLE07UUFXQSxLLEdBQUEsSztRQVlBLE0sR0FBQSxNO1FBMkdBLFEsR0FBQSxRO1FBMkNBLEssR0FBQSxLOztBQTVxQmhCOztBQWlCQTs7QUFFQSxJQUFNLGFBQWEsU0FBYixVQUFhLENBQUMsQ0FBRCxFQUFJLENBQUosRUFBTyxDQUFQLEVBQVUsQ0FBVjtBQUFBLFNBQ2pCLEtBQUssQ0FBTCxLQUFXLENBQVgsR0FBZSxDQUFmLEdBQW1CLEtBQUssR0FBTCxDQUFTLEtBQUssR0FBTCxDQUFTLENBQVQsRUFBWSxJQUFJLENBQUosR0FBUSxJQUFJLENBQVosR0FBZ0IsQ0FBNUIsQ0FBVCxFQUF5QyxDQUF6QyxDQURGO0FBQUEsQ0FBbkI7O0FBR0EsU0FBUyxJQUFULENBQWMsRUFBZCxFQUFrQixFQUFsQixFQUFzQjtBQUFDLFNBQU8sQ0FBQyxFQUFELEVBQUssRUFBTCxDQUFQO0FBQWdCOztBQUV2QyxJQUFNLE9BQU8sU0FBUCxJQUFPO0FBQUEsU0FBTyxVQUFDLENBQUQsRUFBSSxDQUFKO0FBQUEsV0FBVSxJQUFJLENBQUosRUFBTyxDQUFQLENBQVY7QUFBQSxHQUFQO0FBQUEsQ0FBYjs7QUFFQSxJQUFNLE9BQU8sU0FBUCxJQUFPO0FBQUEsU0FBSztBQUFBLFdBQUssS0FBSyxDQUFMLEtBQVcsQ0FBWCxHQUFlLENBQWYsR0FBbUIsQ0FBeEI7QUFBQSxHQUFMO0FBQUEsQ0FBYjs7QUFFQSxJQUFNLFFBQVEsU0FBUixLQUFRO0FBQUEsU0FBSyxNQUFPLEtBQUssQ0FBWixJQUFrQixLQUFLLENBQTVCO0FBQUEsQ0FBZDs7QUFFQSxJQUFNLGlCQUFpQixTQUFqQixjQUFpQjtBQUFBLFNBQ3JCLGFBQWEsTUFBYixJQUF1QixNQUFNLEVBQUUsTUFBUixDQUF2QixJQUEwQyxPQUFPLENBQVAsS0FBYSxRQURsQztBQUFBLENBQXZCOztBQUdBOztBQUVBLFNBQVMsZ0JBQVQsQ0FBMEIsSUFBMUIsRUFBZ0MsRUFBaEMsRUFBb0M7QUFDbEMsTUFBTSxJQUFJLEdBQUcsTUFBYjtBQUFBLE1BQXFCLEtBQUssTUFBTSxDQUFOLENBQTFCO0FBQ0EsTUFBSSxJQUFJLENBQVI7QUFDQSxPQUFLLElBQUksSUFBRSxDQUFOLEVBQVMsQ0FBZCxFQUFpQixJQUFFLENBQW5CLEVBQXNCLEVBQUUsQ0FBeEI7QUFDRSxRQUFJLEtBQUssQ0FBTCxNQUFZLElBQUksS0FBSyxHQUFHLENBQUgsQ0FBTCxFQUFZLENBQVosQ0FBaEIsQ0FBSixFQUNFLEdBQUcsR0FBSCxJQUFVLENBQVY7QUFGSixHQUdBLElBQUksQ0FBSixFQUFPO0FBQ0wsUUFBSSxJQUFJLENBQVIsRUFDRSxHQUFHLE1BQUgsR0FBWSxDQUFaO0FBQ0YsV0FBTyxFQUFQO0FBQ0Q7QUFDRjs7QUFFRCxTQUFTLFVBQVQsQ0FBb0IsRUFBcEIsRUFBd0IsQ0FBeEIsRUFBMkIsRUFBM0IsRUFBK0IsQ0FBL0IsRUFBa0MsQ0FBbEMsRUFBcUM7QUFDbkMsU0FBTyxJQUFJLENBQVg7QUFDRSxPQUFHLEdBQUgsSUFBVSxHQUFHLEdBQUgsQ0FBVjtBQURGLEdBRUEsT0FBTyxFQUFQO0FBQ0Q7O0FBRUQsU0FBUyxLQUFULENBQWUsRUFBZixFQUFtQixDQUFuQixFQUFzQixDQUF0QixFQUF5QjtBQUN2QixLQUFHLENBQUgsSUFBUSxDQUFSO0FBQ0EsU0FBTyxFQUFQO0FBQ0Q7O0FBRUQ7O0FBRUEsSUFBTSxjQUFjLFNBQWQsV0FBYyxDQUFDLEdBQUQsRUFBTSxFQUFOLEVBQVUsRUFBVjtBQUFBLFNBQWtCLEVBQUMsUUFBRCxFQUFNLE1BQU4sRUFBVSxNQUFWLEVBQWxCO0FBQUEsQ0FBcEI7O0FBRUEsSUFBTSxRQUFRLG1FQUFkOztBQUVBLElBQU0sUUFBUSxFQUFDLHFCQUFELEVBQWQ7O0FBRUEsSUFBTSxXQUFXLFNBQVgsUUFBVyxDQUFDLEtBQUQsRUFBUSxNQUFSO0FBQUEsU0FBbUIsOEJBQWtCLHdCQUFPLEtBQVAsQ0FBbEIsRUFBaUMsTUFBakMsQ0FBbkI7QUFBQSxDQUFqQjs7QUFFQSxJQUFNLFNBQVMsU0FBVCxNQUFTLENBQUMsTUFBRCxFQUFRLE1BQVI7QUFBQSxTQUFvQixFQUFDLE9BQU87QUFBQSxhQUFNLE1BQU47QUFBQSxLQUFSLEVBQXFCLGNBQXJCLEVBQXBCO0FBQUEsQ0FBZjs7QUFFQSxJQUFNLE1BQU0sU0FBTixHQUFNO0FBQUEsU0FDVixPQUFPLEtBQUssQ0FBWixFQUFlLFVBQUMsQ0FBRCxFQUFJLENBQUo7QUFBQSxXQUFVLEtBQUssQ0FBTCxLQUFXLENBQVgsS0FBaUIsS0FBSyxDQUFMLEtBQVcsQ0FBWCxJQUFnQixJQUFJLENBQUosRUFBTyxDQUFQLENBQWpDLElBQThDLENBQTlDLEdBQWtELENBQTVEO0FBQUEsR0FBZixDQURVO0FBQUEsQ0FBWjs7QUFHQTs7QUFFQSxJQUFNLE1BQU0sU0FBTixHQUFNLENBQUMsQ0FBRCxFQUFJLENBQUosRUFBTyxLQUFQLEVBQWMsQ0FBZCxFQUFpQixDQUFqQjtBQUFBLFNBQXVCLFdBQVcsQ0FBWCxFQUFjLENBQWQsRUFBaUIsS0FBakIsRUFBd0IsQ0FBeEIsRUFBMkIsQ0FBM0IsQ0FBdkI7QUFBQSxDQUFaOztBQUVBLElBQU0sVUFBVSxTQUFWLE9BQVU7QUFBQSxTQUFXLHdCQUFPLENBQVAsRUFBVSxVQUFDLEtBQUQsRUFBUSxDQUFSLEVBQWM7QUFDakQsUUFBTSxJQUFJLFFBQVEsQ0FBUixDQUFWO0FBQ0EsV0FBTyxVQUFDLENBQUQsRUFBSSxDQUFKO0FBQUEsYUFBVSxJQUFJLENBQUosRUFBTyxDQUFQLEVBQVUsS0FBVixFQUFpQixDQUFqQixDQUFWO0FBQUEsS0FBUDtBQUNELEdBSDBCLENBQVg7QUFBQSxDQUFoQjs7QUFLQTs7QUFFQSxTQUFTLGNBQVQsQ0FBd0IsQ0FBeEIsRUFBMkI7QUFDekIsTUFBSSxDQUFDLEVBQUUsRUFBUCxFQUNFLE1BQU0sSUFBSSxLQUFKLENBQVUsb0RBQVYsQ0FBTjtBQUNIOztBQUVEOztBQUVBLFNBQVMsTUFBVCxDQUFnQixDQUFoQixFQUFtQixDQUFuQixFQUFzQjtBQUFDLE9BQUssQ0FBTCxHQUFTLENBQVQsQ0FBWSxLQUFLLENBQUwsR0FBUyxDQUFUO0FBQVc7O0FBRTlDLElBQU0sV0FBVyxTQUFYLFFBQVc7QUFBQSxTQUFLLEVBQUUsV0FBRixLQUFrQixNQUF2QjtBQUFBLENBQWpCOztBQUVBLElBQU0sS0FBSyxTQUFMLEVBQUssQ0FBQyxDQUFELEVBQUksQ0FBSjtBQUFBLFNBQVUsS0FBSyxDQUFMLEtBQVcsQ0FBWCxHQUFlLEtBQUssQ0FBTCxLQUFXLENBQVgsR0FBZSxJQUFJLE1BQUosQ0FBVyxDQUFYLEVBQWMsQ0FBZCxDQUFmLEdBQWtDLENBQWpELEdBQXFELENBQS9EO0FBQUEsQ0FBWDs7QUFFQSxJQUFNLFVBQVUsU0FBVixPQUFVO0FBQUEsU0FBSztBQUFBLFdBQUssR0FBRyxDQUFILEVBQU0sQ0FBTixDQUFMO0FBQUEsR0FBTDtBQUFBLENBQWhCOztBQUVBLFNBQVMsTUFBVCxDQUFnQixDQUFoQixFQUFtQixFQUFuQixFQUF1QjtBQUNyQixTQUFPLEtBQUssU0FBUyxDQUFULENBQVosRUFBeUI7QUFDdkIsUUFBTSxJQUFJLEVBQUUsQ0FBWjtBQUNBLFFBQUksRUFBRSxDQUFOO0FBQ0EsUUFBSSxLQUFLLFNBQVMsQ0FBVCxDQUFULEVBQXNCO0FBQ3BCLGFBQU8sRUFBRSxDQUFULEVBQVksRUFBWjtBQUNBLGFBQU8sRUFBRSxDQUFULEVBQVksRUFBWjtBQUNELEtBSEQsTUFJRSxHQUFHLElBQUgsQ0FBUSxDQUFSO0FBQ0g7QUFDRCxLQUFHLElBQUgsQ0FBUSxDQUFSO0FBQ0Q7O0FBRUQsU0FBUyxPQUFULENBQWlCLENBQWpCLEVBQW9CO0FBQ2xCLE1BQUksS0FBSyxDQUFMLEtBQVcsQ0FBZixFQUFrQjtBQUNoQixRQUFNLEtBQUssRUFBWDtBQUNBLFdBQU8sQ0FBUCxFQUFVLEVBQVY7QUFDQSxXQUFPLEVBQVA7QUFDRDtBQUNGOztBQUVELFNBQVMsT0FBVCxDQUFpQixDQUFqQixFQUFvQixDQUFwQixFQUF1QixDQUF2QixFQUEwQjtBQUN4QixTQUFPLFNBQVMsQ0FBVCxDQUFQLEVBQW9CO0FBQ2xCLFFBQU0sSUFBSSxFQUFFLENBQVo7QUFDQSxRQUFJLEVBQUUsQ0FBTjtBQUNBLFFBQUksU0FBUyxDQUFULElBQ0EsUUFBUSxDQUFSLEVBQVcsUUFBUSxDQUFSLEVBQVcsQ0FBWCxFQUFjLEVBQUUsQ0FBaEIsQ0FBWCxFQUErQixFQUFFLENBQWpDLENBREEsR0FFQSxFQUFFLENBQUYsRUFBSyxFQUFFLENBQUYsQ0FBTCxFQUFXLEVBQUUsQ0FBRixDQUFYLENBRko7QUFHRDtBQUNELFNBQU8sRUFBRSxDQUFGLEVBQUssRUFBRSxDQUFGLENBQUwsRUFBVyxFQUFFLENBQUYsQ0FBWCxDQUFQO0FBQ0Q7O0FBRUQsSUFBTSxPQUFPLFNBQVAsSUFBTyxDQUFDLENBQUQsRUFBSSxDQUFKLEVBQU8sQ0FBUDtBQUFBLFNBQWEsS0FBSyxDQUFMLEtBQVcsQ0FBWCxHQUFlLFFBQVEsQ0FBUixFQUFXLENBQVgsRUFBYyxDQUFkLENBQWYsR0FBa0MsQ0FBL0M7QUFBQSxDQUFiOztBQUVBLElBQU0sVUFBVSxTQUFTLEtBQUssQ0FBZCxFQUFpQixFQUFqQixDQUFoQjs7QUFFQTs7QUFFQSxTQUFTLG9CQUFULENBQThCLENBQTlCLEVBQWlDLEtBQWpDLEVBQXdDLEVBQXhDLEVBQTRDO0FBQzFDLE1BQU0sS0FBSyxFQUFFLEVBQWI7QUFBQSxNQUFpQixNQUFNLEVBQUUsR0FBekI7QUFDQSxNQUFJLFFBQVEsR0FBUixDQUFZLFFBQVosS0FBeUIsWUFBN0IsRUFDRSxlQUFlLENBQWY7QUFDRixNQUFJLElBQUksQ0FBQyxHQUFFLEVBQUUsRUFBTCxFQUFTLEtBQUssQ0FBZCxDQUFSO0FBQUEsTUFBMEIsSUFBSSxHQUFHLE1BQWpDO0FBQ0EsU0FBTyxHQUFQO0FBQ0UsUUFBSSxHQUFHLElBQUksT0FBSixFQUFhLENBQWIsQ0FBSCxFQUFvQixNQUFNLEdBQUcsQ0FBSCxDQUFOLEVBQWEsQ0FBYixDQUFwQixDQUFKO0FBREYsR0FFQSxPQUFPLElBQUksT0FBSixFQUFhLENBQWIsQ0FBUDtBQUNEOztBQUVEOztBQUVBLFNBQVMsa0JBQVQsQ0FBNEIsQ0FBNUIsRUFBK0I7QUFDN0IsTUFBSSxFQUFFLGFBQWEsTUFBZixDQUFKLEVBQ0UsT0FBTyxDQUFQO0FBQ0YsT0FBSyxJQUFNLENBQVgsSUFBZ0IsQ0FBaEI7QUFDRSxXQUFPLENBQVA7QUFERjtBQUVEOztBQUVEOztBQUVBLElBQU0sVUFBVSxTQUFWLE9BQVUsQ0FBQyxDQUFELEVBQUksQ0FBSjtBQUFBLFNBQVUsYUFBYSxNQUFiLEdBQXNCLEVBQUUsQ0FBRixDQUF0QixHQUE2QixLQUFLLENBQTVDO0FBQUEsQ0FBaEI7O0FBRUEsSUFBTSxVQUFVLFNBQVYsT0FBVSxDQUFDLENBQUQsRUFBSSxDQUFKLEVBQU8sQ0FBUDtBQUFBLFNBQ2QsS0FBSyxDQUFMLEtBQVcsQ0FBWCxHQUFlLCtCQUFjLENBQWQsRUFBaUIsQ0FBakIsRUFBb0IsQ0FBcEIsQ0FBZixHQUF3QyxnQ0FBZSxDQUFmLEVBQWtCLENBQWxCLENBRDFCO0FBQUEsQ0FBaEI7O0FBR0E7O0FBRUEsSUFBTSxXQUFXLFNBQVgsUUFBVyxDQUFDLENBQUQsRUFBSSxFQUFKO0FBQUEsU0FBVyxlQUFlLEVBQWYsSUFBcUIsR0FBRyxDQUFILENBQXJCLEdBQTZCLEtBQUssQ0FBN0M7QUFBQSxDQUFqQjs7QUFFQSxTQUFTLFFBQVQsQ0FBa0IsQ0FBbEIsRUFBcUIsQ0FBckIsRUFBd0IsRUFBeEIsRUFBNEI7QUFDMUIsTUFBSSxRQUFRLEdBQVIsQ0FBWSxRQUFaLEtBQXlCLFlBQXpCLElBQXlDLElBQUksQ0FBakQsRUFDRSxNQUFNLElBQUksS0FBSixDQUFVLGdFQUFWLENBQU47QUFDRixNQUFJLENBQUMsZUFBZSxFQUFmLENBQUwsRUFDRSxLQUFLLEVBQUw7QUFDRixNQUFNLElBQUksR0FBRyxNQUFiO0FBQ0EsTUFBSSxLQUFLLENBQUwsS0FBVyxDQUFmLEVBQWtCO0FBQ2hCLFFBQUksS0FBSyxDQUFULEVBQ0UsT0FBTyxNQUFNLFdBQVcsTUFBTSxJQUFFLENBQVIsQ0FBWCxFQUF1QixDQUF2QixFQUEwQixFQUExQixFQUE4QixDQUE5QixFQUFpQyxDQUFqQyxDQUFOLEVBQTJDLENBQTNDLEVBQThDLENBQTlDLENBQVA7QUFDRixRQUFNLEtBQUssTUFBTSxDQUFOLENBQVg7QUFDQSxTQUFLLElBQUksSUFBRSxDQUFYLEVBQWMsSUFBRSxDQUFoQixFQUFtQixFQUFFLENBQXJCO0FBQ0UsU0FBRyxDQUFILElBQVEsR0FBRyxDQUFILENBQVI7QUFERixLQUVBLEdBQUcsQ0FBSCxJQUFRLENBQVI7QUFDQSxXQUFPLEVBQVA7QUFDRCxHQVJELE1BUU87QUFDTCxRQUFJLElBQUksQ0FBUixFQUFXO0FBQ1QsVUFBSSxLQUFLLENBQVQsRUFDRSxPQUFPLFdBQVcsTUFBTSxDQUFOLENBQVgsRUFBcUIsQ0FBckIsRUFBd0IsRUFBeEIsRUFBNEIsQ0FBNUIsRUFBK0IsQ0FBL0IsQ0FBUDtBQUNGLFVBQUksSUFBSSxDQUFSLEVBQVc7QUFDVCxZQUFNLE1BQUssTUFBTSxJQUFFLENBQVIsQ0FBWDtBQUNBLGFBQUssSUFBSSxLQUFFLENBQVgsRUFBYyxLQUFFLENBQWhCLEVBQW1CLEVBQUUsRUFBckI7QUFDRSxjQUFHLEVBQUgsSUFBUSxHQUFHLEVBQUgsQ0FBUjtBQURGLFNBRUEsS0FBSyxJQUFJLE1BQUUsSUFBRSxDQUFiLEVBQWdCLE1BQUUsQ0FBbEIsRUFBcUIsRUFBRSxHQUF2QjtBQUNFLGNBQUcsTUFBRSxDQUFMLElBQVUsR0FBRyxHQUFILENBQVY7QUFERixTQUVBLE9BQU8sR0FBUDtBQUNEO0FBQ0Y7QUFDRjtBQUNGOztBQUVEOztBQUVBLFNBQVMsUUFBVCxDQUFrQixDQUFsQixFQUFxQjtBQUNuQixNQUFJLEVBQUUsT0FBTyxDQUFQLEtBQWEsVUFBYixJQUEyQixFQUFFLE1BQUYsS0FBYSxDQUExQyxDQUFKLEVBQ0UsTUFBTSxJQUFJLEtBQUosQ0FBVSxxQ0FBVixDQUFOO0FBQ0g7O0FBRUQsSUFBTSxRQUFRLFNBQVIsS0FBUSxDQUFDLENBQUQsRUFBSSxDQUFKLEVBQU8sS0FBUDtBQUFBLFNBQWlCLFVBQUMsQ0FBRCxFQUFJLENBQUo7QUFBQSxXQUFVLEVBQUUsQ0FBRixFQUFLLEtBQUwsRUFBWSxDQUFaLEVBQWUsQ0FBZixDQUFWO0FBQUEsR0FBakI7QUFBQSxDQUFkOztBQUVBLFNBQVMsUUFBVCxDQUFrQixHQUFsQixFQUF1QixFQUF2QixFQUEyQjtBQUN6QixVQUFRLEdBQUcsTUFBSCxHQUFZLEdBQXBCO0FBQ0UsU0FBSyxDQUFMO0FBQVMsYUFBTyxRQUFQO0FBQ1QsU0FBSyxDQUFMO0FBQVMsYUFBTyxXQUFXLEdBQUcsR0FBSCxDQUFYLENBQVA7QUFDVDtBQUFTLGFBQU8sVUFBQyxDQUFELEVBQUksS0FBSixFQUFXLENBQVgsRUFBYyxDQUFkLEVBQW9CO0FBQ2xDLFlBQUksSUFBSSxHQUFHLE1BQVg7QUFDQSxnQkFBUSxNQUFNLFdBQVcsR0FBRyxFQUFFLENBQUwsQ0FBWCxDQUFOLEVBQTJCLENBQTNCLEVBQThCLEtBQTlCLENBQVI7QUFDQSxlQUFPLE1BQU0sRUFBRSxDQUFmO0FBQ0Usa0JBQVEsTUFBTSxXQUFXLEdBQUcsQ0FBSCxDQUFYLENBQU4sRUFBeUIsQ0FBekIsRUFBNEIsS0FBNUIsQ0FBUjtBQURGLFNBRUEsT0FBTyxJQUFJLEdBQUcsR0FBSCxDQUFKLEVBQWEsQ0FBYixFQUFnQixLQUFoQixFQUF1QixDQUF2QixFQUEwQixDQUExQixDQUFQO0FBQ0QsT0FOUTtBQUhYO0FBV0Q7O0FBRUQsU0FBUyxJQUFULENBQWMsQ0FBZCxFQUFpQixDQUFqQixFQUFvQixDQUFwQixFQUF1QjtBQUNyQixVQUFRLE9BQU8sQ0FBZjtBQUNFLFNBQUssUUFBTDtBQUNFLGFBQU8sUUFBUSxDQUFSLEVBQVcsQ0FBWCxFQUFjLENBQWQsQ0FBUDtBQUNGLFNBQUssUUFBTDtBQUNFLGFBQU8sU0FBUyxDQUFULEVBQVksQ0FBWixFQUFlLENBQWYsQ0FBUDtBQUNGLFNBQUssVUFBTDtBQUNFLFVBQUksUUFBUSxHQUFSLENBQVksUUFBWixLQUF5QixZQUE3QixFQUNFLFNBQVMsQ0FBVDtBQUNGLGFBQU8sRUFBRSxLQUFGLEVBQVMsd0JBQU8sQ0FBUCxDQUFULEVBQW9CLENBQXBCLEVBQXVCLEtBQUssQ0FBNUIsQ0FBUDtBQUNGO0FBQ0UsYUFBTyxlQUFlLENBQWYsRUFBa0Isd0JBQU8sQ0FBUCxDQUFsQixFQUE2QixDQUE3QixDQUFQO0FBVko7QUFZRDs7QUFFRCxTQUFTLElBQVQsQ0FBYyxDQUFkLEVBQWlCLENBQWpCLEVBQW9CO0FBQ2xCLFVBQVEsT0FBTyxDQUFmO0FBQ0UsU0FBSyxRQUFMO0FBQ0UsYUFBTyxRQUFRLENBQVIsRUFBVyxDQUFYLENBQVA7QUFDRixTQUFLLFFBQUw7QUFDRSxhQUFPLFNBQVMsQ0FBVCxFQUFZLENBQVosQ0FBUDtBQUNGLFNBQUssUUFBTDtBQUNFLFdBQUssSUFBSSxJQUFFLENBQU4sRUFBUyxJQUFFLEVBQUUsTUFBYixFQUFxQixDQUExQixFQUE2QixJQUFFLENBQS9CLEVBQWtDLEVBQUUsQ0FBcEM7QUFDRSxnQkFBUSxRQUFRLElBQUksRUFBRSxDQUFGLENBQVosQ0FBUjtBQUNFLGVBQUssUUFBTDtBQUFlLGdCQUFJLFFBQVEsQ0FBUixFQUFXLENBQVgsQ0FBSixDQUFtQjtBQUNsQyxlQUFLLFFBQUw7QUFBZSxnQkFBSSxTQUFTLENBQVQsRUFBWSxDQUFaLENBQUosQ0FBb0I7QUFDbkM7QUFBUyxnQkFBSSxLQUFLLENBQUwsRUFBUSxDQUFSLENBQUosQ0FBZ0I7QUFIM0I7QUFERixPQU1BLE9BQU8sQ0FBUDtBQUNGO0FBQ0UsVUFBSSxRQUFRLEdBQVIsQ0FBWSxRQUFaLEtBQXlCLFlBQTdCLEVBQ0UsU0FBUyxDQUFUO0FBQ0YsYUFBTyxFQUFFLEtBQUYsa0JBQWEsQ0FBYixFQUFnQixLQUFLLENBQXJCLENBQVA7QUFoQko7QUFrQkQ7O0FBRUQsU0FBUyxjQUFULENBQXdCLEVBQXhCLEVBQTRCLElBQTVCLEVBQWtDLENBQWxDLEVBQXFDO0FBQ25DLE1BQUksSUFBSSxHQUFHLE1BQVg7QUFDQSxNQUFNLEtBQUssTUFBTSxDQUFOLENBQVg7QUFDQSxPQUFLLElBQUksSUFBRSxDQUFOLEVBQVMsQ0FBZCxFQUFpQixJQUFFLENBQW5CLEVBQXNCLEVBQUUsQ0FBeEIsRUFBMkI7QUFDekIsT0FBRyxDQUFILElBQVEsQ0FBUjtBQUNBLFlBQVEsUUFBUSxJQUFJLEdBQUcsQ0FBSCxDQUFaLENBQVI7QUFDRSxXQUFLLFFBQUw7QUFDRSxZQUFJLFFBQVEsQ0FBUixFQUFXLENBQVgsQ0FBSjtBQUNBO0FBQ0YsV0FBSyxRQUFMO0FBQ0UsWUFBSSxTQUFTLENBQVQsRUFBWSxDQUFaLENBQUo7QUFDQTtBQUNGO0FBQ0UsWUFBSSxTQUFTLENBQVQsRUFBWSxFQUFaLEVBQWdCLEtBQWhCLEVBQXVCLElBQXZCLEVBQTZCLENBQTdCLEVBQWdDLEdBQUcsSUFBRSxDQUFMLENBQWhDLENBQUo7QUFDQSxZQUFJLENBQUo7QUFDQTtBQVZKO0FBWUQ7QUFDRCxNQUFJLE1BQU0sR0FBRyxNQUFiLEVBQ0UsSUFBSSxLQUFLLENBQUwsRUFBUSxHQUFHLElBQUUsQ0FBTCxDQUFSLENBQUo7QUFDRixTQUFPLEtBQUssRUFBRSxDQUFkLEVBQWlCO0FBQ2YsUUFBTSxLQUFJLEdBQUcsQ0FBSCxDQUFWO0FBQ0EsWUFBUSxPQUFPLEVBQWY7QUFDRSxXQUFLLFFBQUw7QUFBZSxZQUFJLFFBQVEsRUFBUixFQUFXLENBQVgsRUFBYyxHQUFHLENBQUgsQ0FBZCxDQUFKLENBQTBCO0FBQ3pDLFdBQUssUUFBTDtBQUFlLFlBQUksU0FBUyxFQUFULEVBQVksQ0FBWixFQUFlLEdBQUcsQ0FBSCxDQUFmLENBQUosQ0FBMkI7QUFGNUM7QUFJRDtBQUNELFNBQU8sQ0FBUDtBQUNEOztBQUVEOztBQUVBLFNBQVMsT0FBVCxDQUFpQixRQUFqQixFQUEyQixDQUEzQixFQUE4QjtBQUM1QixNQUFJLFVBQUo7QUFDQSxPQUFLLElBQU0sQ0FBWCxJQUFnQixRQUFoQixFQUEwQjtBQUN4QixRQUFNLElBQUksS0FBSyxTQUFTLENBQVQsQ0FBTCxFQUFrQixDQUFsQixDQUFWO0FBQ0EsUUFBSSxLQUFLLENBQUwsS0FBVyxDQUFmLEVBQWtCO0FBQ2hCLFVBQUksQ0FBQyxDQUFMLEVBQ0UsSUFBSSxFQUFKO0FBQ0YsUUFBRSxDQUFGLElBQU8sQ0FBUDtBQUNEO0FBQ0Y7QUFDRCxTQUFPLENBQVA7QUFDRDs7QUFFRCxJQUFNLFVBQVUsU0FBVixPQUFVLENBQUMsUUFBRCxFQUFXLENBQVg7QUFBQSxTQUFpQixpQkFBUztBQUN4QyxRQUFJLFFBQVEsR0FBUixDQUFZLFFBQVosS0FBeUIsWUFBekIsSUFDQSxFQUFFLEtBQUssQ0FBTCxLQUFXLEtBQVgsSUFBb0IsaUJBQWlCLE1BQXZDLENBREosRUFFRSxNQUFNLElBQUksS0FBSixDQUFVLGdFQUFWLENBQU47QUFDRixTQUFLLElBQU0sQ0FBWCxJQUFnQixRQUFoQjtBQUNFLFVBQUksS0FBSyxTQUFTLENBQVQsQ0FBTCxFQUFrQixTQUFTLE1BQU0sQ0FBTixDQUEzQixFQUFxQyxDQUFyQyxDQUFKO0FBREYsS0FFQSxPQUFPLENBQVA7QUFDRCxHQVBlO0FBQUEsQ0FBaEI7O0FBU0E7O0FBRUEsSUFBTSxPQUFPLFNBQVAsSUFBTyxDQUFDLE1BQUQsRUFBUyxHQUFUO0FBQUEsU0FBaUI7QUFBQSxXQUM1QixRQUFRLEdBQVIsQ0FBWSxLQUFaLENBQWtCLE9BQWxCLEVBQTJCLE9BQU8sTUFBUCxDQUFjLENBQUMsR0FBRCxFQUFNLENBQU4sQ0FBZCxDQUEzQixLQUF1RCxDQUQzQjtBQUFBLEdBQWpCO0FBQUEsQ0FBYjs7QUFHQSxTQUFTLGFBQVQsQ0FBdUIsQ0FBdkIsRUFBMEIsSUFBMUIsRUFBZ0MsRUFBaEMsRUFBb0M7QUFDbEMsTUFBTSxJQUFJLEVBQVY7QUFBQSxNQUFjLElBQUksS0FBSyxNQUF2QjtBQUNBLE9BQUssSUFBSSxJQUFFLENBQVgsRUFBYyxJQUFFLENBQWhCLEVBQW1CLEVBQUUsQ0FBRixFQUFLLEtBQUcsR0FBRyxDQUFILENBQTNCLEVBQWtDO0FBQ2hDLFFBQU0sSUFBSSxHQUFHLENBQUgsQ0FBVjtBQUNBLE1BQUUsS0FBSyxDQUFMLENBQUYsSUFBYSxLQUFLLENBQUwsS0FBVyxDQUFYLEdBQWUsQ0FBZixHQUFtQixDQUFoQztBQUNEO0FBQ0QsTUFBSSxVQUFKO0FBQ0EsTUFBSSxFQUFFLFdBQUYsS0FBa0IsTUFBdEIsRUFDRSxJQUFJLE9BQU8sTUFBUCxDQUFjLEVBQWQsRUFBa0IsQ0FBbEIsQ0FBSjtBQUNGLE9BQUssSUFBTSxDQUFYLElBQWdCLENBQWhCLEVBQW1CO0FBQ2pCLFFBQU0sS0FBSSxFQUFFLENBQUYsQ0FBVjtBQUNBLFFBQUksTUFBTSxFQUFWLEVBQWE7QUFDWCxRQUFFLENBQUYsSUFBTyxDQUFQO0FBQ0EsVUFBSSxDQUFDLENBQUwsRUFDRSxJQUFJLEVBQUo7QUFDRixRQUFFLENBQUYsSUFBTyxLQUFLLENBQUwsS0FBVyxFQUFYLEdBQWUsRUFBZixHQUFtQixFQUFFLENBQUYsQ0FBMUI7QUFDRDtBQUNGO0FBQ0QsT0FBSyxJQUFJLEtBQUUsQ0FBWCxFQUFjLEtBQUUsQ0FBaEIsRUFBbUIsRUFBRSxFQUFyQixFQUF3QjtBQUN0QixRQUFNLEtBQUksS0FBSyxFQUFMLENBQVY7QUFDQSxRQUFNLE1BQUksRUFBRSxFQUFGLENBQVY7QUFDQSxRQUFJLE1BQU0sR0FBVixFQUFhO0FBQ1gsVUFBSSxDQUFDLENBQUwsRUFDRSxJQUFJLEVBQUo7QUFDRixRQUFFLEVBQUYsSUFBTyxHQUFQO0FBQ0Q7QUFDRjtBQUNELFNBQU8sQ0FBUDtBQUNEOztBQUVELElBQU0sV0FBVyxTQUFYLFFBQVcsQ0FBQyxJQUFELEVBQU8sSUFBUDtBQUFBLFNBQWdCLFVBQUMsQ0FBRCxFQUFJLEtBQUosRUFBVyxDQUFYLEVBQWMsQ0FBZCxFQUFvQjtBQUNuRCxRQUFJLFFBQVEsR0FBUixDQUFZLFFBQVosS0FBeUIsWUFBN0IsRUFDRSxlQUFlLENBQWY7QUFDRixRQUFNLElBQUksS0FBSyxNQUFmO0FBQUEsUUFBdUIsS0FBSyxFQUFFLEVBQTlCO0FBQ0EsUUFBSSxDQUFDLENBQUwsRUFDRSxPQUFPLEdBQUcsbUJBQW1CLENBQW5CLENBQUgsQ0FBUDtBQUNGLFFBQUksRUFBRSxhQUFhLE1BQWYsQ0FBSixFQUNFO0FBQ0YsUUFBTSxLQUFLLEVBQUUsRUFBYjtBQUFBLFFBQ00sT0FBTyxTQUFQLElBQU8sQ0FBQyxDQUFELEVBQUksRUFBSjtBQUFBLGFBQVcsS0FBSyxDQUFMLEdBQVM7QUFBQSxlQUFLLEtBQUssSUFBRSxDQUFQLEVBQVUsQ0FBQyxDQUFELEVBQUksRUFBSixDQUFWLENBQUw7QUFBQSxPQUFULEdBQ1MsY0FBYyxDQUFkLEVBQWlCLElBQWpCLEVBQXVCLEVBQXZCLENBRHBCO0FBQUEsS0FEYjtBQUdBLFFBQUksTUFBTSxHQUFHLEtBQUssSUFBRSxDQUFQLENBQUgsQ0FBVjtBQUNBLFNBQUssSUFBSSxJQUFFLElBQUUsQ0FBYixFQUFnQixLQUFHLENBQW5CLEVBQXNCLEVBQUUsQ0FBeEIsRUFBMkI7QUFDekIsVUFBTSxJQUFJLEtBQUssQ0FBTCxDQUFWO0FBQUEsVUFBbUIsSUFBSSxFQUFFLENBQUYsQ0FBdkI7QUFDQSxZQUFNLEdBQUcsR0FBSCxFQUFRLE9BQU8sS0FBSyxDQUFMLEVBQVEsQ0FBUixFQUFXLEtBQVgsRUFBa0IsQ0FBbEIsRUFBcUIsQ0FBckIsQ0FBUCxHQUFpQyxNQUFNLENBQU4sRUFBUyxDQUFULENBQXpDLENBQU47QUFDRDtBQUNELFdBQU8sR0FBUDtBQUNELEdBakJnQjtBQUFBLENBQWpCOztBQW1CQSxJQUFNLGFBQWEsU0FBYixVQUFhO0FBQUEsU0FBUSxVQUFDLENBQUQsRUFBSSxLQUFKLEVBQVcsQ0FBWCxFQUFjLENBQWQ7QUFBQSxXQUN6QixDQUFDLEdBQUUsRUFBRSxHQUFMLEVBQVU7QUFBQSxhQUFLLEtBQUssQ0FBTCxFQUFRLENBQVIsQ0FBTDtBQUFBLEtBQVYsRUFBMkIsTUFBTSxLQUFLLENBQUwsRUFBUSxDQUFSLENBQU4sRUFBa0IsQ0FBbEIsQ0FBM0IsQ0FEeUI7QUFBQSxHQUFSO0FBQUEsQ0FBbkI7O0FBR0EsSUFBTSxXQUFXLFNBQVgsUUFBVyxDQUFDLEdBQUQsRUFBTSxHQUFOLEVBQVcsQ0FBWDtBQUFBLFNBQWlCLGdDQUFlLENBQWYsRUFBa0IsR0FBbEIsSUFBeUIsR0FBekIsR0FBK0IsQ0FBaEQ7QUFBQSxDQUFqQjs7QUFFQSxTQUFTLFNBQVQsQ0FBbUIsSUFBbkIsRUFBeUIsRUFBekIsRUFBNkI7QUFDM0IsT0FBSyxJQUFJLElBQUUsQ0FBTixFQUFTLElBQUUsR0FBRyxNQUFuQixFQUEyQixJQUFFLENBQTdCLEVBQWdDLEVBQUUsQ0FBbEM7QUFDRSxRQUFJLEtBQUssR0FBRyxDQUFILENBQUwsRUFBWSxDQUFaLENBQUosRUFDRSxPQUFPLENBQVA7QUFGSixHQUdBLE9BQU8sQ0FBQyxDQUFSO0FBQ0Q7O0FBRUQsU0FBUyxrQkFBVCxDQUE0QixJQUE1QixFQUFrQyxFQUFsQyxFQUFzQyxFQUF0QyxFQUEwQyxFQUExQyxFQUE4QztBQUM1QyxPQUFLLElBQUksSUFBRSxDQUFOLEVBQVMsSUFBRSxHQUFHLE1BQWQsRUFBc0IsQ0FBM0IsRUFBOEIsSUFBRSxDQUFoQyxFQUFtQyxFQUFFLENBQXJDO0FBQ0UsS0FBQyxLQUFLLElBQUksR0FBRyxDQUFILENBQVQsRUFBZ0IsQ0FBaEIsSUFBcUIsRUFBckIsR0FBMEIsRUFBM0IsRUFBK0IsSUFBL0IsQ0FBb0MsQ0FBcEM7QUFERjtBQUVEOztBQUVEOztBQUVPLFNBQVMsVUFBVCxDQUFvQixDQUFwQixFQUF1QjtBQUM1QixVQUFRLE9BQU8sQ0FBZjtBQUNFLFNBQUssUUFBTDtBQUNFLGFBQU8sVUFBQyxDQUFELEVBQUksS0FBSixFQUFXLENBQVgsRUFBYyxDQUFkO0FBQUEsZUFDTCxDQUFDLEdBQUUsRUFBRSxHQUFMLEVBQVU7QUFBQSxpQkFBSyxRQUFRLENBQVIsRUFBVyxDQUFYLEVBQWMsQ0FBZCxDQUFMO0FBQUEsU0FBVixFQUFpQyxNQUFNLFFBQVEsQ0FBUixFQUFXLENBQVgsQ0FBTixFQUFxQixDQUFyQixDQUFqQyxDQURLO0FBQUEsT0FBUDtBQUVGLFNBQUssUUFBTDtBQUNFLGFBQU8sVUFBQyxDQUFELEVBQUksS0FBSixFQUFXLEVBQVgsRUFBZSxDQUFmO0FBQUEsZUFDTCxDQUFDLEdBQUUsRUFBRSxHQUFMLEVBQVU7QUFBQSxpQkFBSyxTQUFTLENBQVQsRUFBWSxDQUFaLEVBQWUsRUFBZixDQUFMO0FBQUEsU0FBVixFQUFtQyxNQUFNLFNBQVMsQ0FBVCxFQUFZLEVBQVosQ0FBTixFQUF1QixDQUF2QixDQUFuQyxDQURLO0FBQUEsT0FBUDtBQUVGLFNBQUssVUFBTDtBQUNFLFVBQUksUUFBUSxHQUFSLENBQVksUUFBWixLQUF5QixZQUE3QixFQUNFLFNBQVMsQ0FBVDtBQUNGLGFBQU8sQ0FBUDtBQUNGO0FBQ0UsYUFBTyxTQUFTLENBQVQsRUFBWSxDQUFaLENBQVA7QUFaSjtBQWNEOztBQUVEOztBQUVPLElBQU0sMEJBQVMsdUJBQU0sVUFBQyxDQUFELEVBQUksSUFBSixFQUFVLENBQVYsRUFBZ0I7QUFDMUMsVUFBUSxPQUFPLENBQWY7QUFDRSxTQUFLLFFBQUw7QUFDRSxhQUFPLFFBQVEsQ0FBUixFQUFXLEtBQUssUUFBUSxDQUFSLEVBQVcsQ0FBWCxDQUFMLEVBQW9CLENBQXBCLENBQVgsRUFBbUMsQ0FBbkMsQ0FBUDtBQUNGLFNBQUssUUFBTDtBQUNFLGFBQU8sU0FBUyxDQUFULEVBQVksS0FBSyxTQUFTLENBQVQsRUFBWSxDQUFaLENBQUwsRUFBcUIsQ0FBckIsQ0FBWixFQUFxQyxDQUFyQyxDQUFQO0FBQ0YsU0FBSyxVQUFMO0FBQ0UsVUFBSSxRQUFRLEdBQVIsQ0FBWSxRQUFaLEtBQXlCLFlBQTdCLEVBQ0UsU0FBUyxDQUFUO0FBQ0YsYUFBTyxFQUFFLEtBQUYsRUFBUyxJQUFULEVBQWUsQ0FBZixFQUFrQixLQUFLLENBQXZCLENBQVA7QUFDRjtBQUNFLGFBQU8sZUFBZSxDQUFmLEVBQWtCLElBQWxCLEVBQXdCLENBQXhCLENBQVA7QUFWSjtBQVlELENBYnFCLENBQWY7O0FBZUEsSUFBTSwwQkFBUyx1QkFBTSxVQUFDLENBQUQsRUFBSSxDQUFKO0FBQUEsU0FBVSxLQUFLLENBQUwsRUFBUSxLQUFLLENBQWIsRUFBZ0IsQ0FBaEIsQ0FBVjtBQUFBLENBQU4sQ0FBZjs7QUFFQSxJQUFNLG9CQUFNLHVCQUFNLElBQU4sQ0FBWjs7QUFFUDs7QUFFTyxTQUFTLE9BQVQsR0FBbUI7QUFDeEIsVUFBUSxVQUFVLE1BQWxCO0FBQ0UsU0FBSyxDQUFMO0FBQVEsYUFBTyxRQUFQO0FBQ1IsU0FBSyxDQUFMO0FBQVEsYUFBTyxVQUFVLENBQVYsQ0FBUDtBQUNSO0FBQVM7QUFDUCxZQUFNLElBQUksVUFBVSxNQUFwQjtBQUFBLFlBQTRCLFNBQVMsTUFBTSxDQUFOLENBQXJDO0FBQ0EsYUFBSyxJQUFJLElBQUUsQ0FBWCxFQUFjLElBQUUsQ0FBaEIsRUFBbUIsRUFBRSxDQUFyQjtBQUNFLGlCQUFPLENBQVAsSUFBWSxVQUFVLENBQVYsQ0FBWjtBQURGLFNBRUEsT0FBTyxNQUFQO0FBQ0Q7QUFSSDtBQVVEOztBQUVEOztBQUVPLElBQU0sd0JBQVEsdUJBQU0sVUFBQyxLQUFELEVBQVEsRUFBUjtBQUFBLFNBQ3pCLENBQUMsRUFBRCxFQUFLLE9BQU8sVUFBQyxFQUFELEVBQUssQ0FBTDtBQUFBLFdBQVcsS0FBSyxDQUFMLEtBQVcsRUFBWCxHQUFnQixNQUFNLEVBQU4sRUFBVSxDQUFWLENBQWhCLEdBQStCLElBQTFDO0FBQUEsR0FBUCxDQUFMLENBRHlCO0FBQUEsQ0FBTixDQUFkOztBQUdBLElBQU0sMEJBQVMsU0FBVCxNQUFTO0FBQUEsb0NBQUksRUFBSjtBQUFJLE1BQUo7QUFBQTs7QUFBQSxTQUFXLE9BQU8sYUFBSztBQUMzQyxRQUFNLElBQUksVUFBVTtBQUFBLGFBQUssS0FBSyxDQUFMLEtBQVcsS0FBSyxDQUFMLEVBQVEsQ0FBUixDQUFoQjtBQUFBLEtBQVYsRUFBc0MsRUFBdEMsQ0FBVjtBQUNBLFdBQU8sSUFBSSxDQUFKLEdBQVEsSUFBUixHQUFlLEdBQUcsQ0FBSCxDQUF0QjtBQUNELEdBSGdDLENBQVg7QUFBQSxDQUFmOztBQUtBLElBQU0sMEJBQVMsU0FBVCxNQUFTO0FBQUEsU0FBUyxVQUFDLENBQUQsRUFBSSxLQUFKLEVBQVcsQ0FBWCxFQUFjLENBQWQ7QUFBQSxXQUM3QixJQUFJLE1BQU0sQ0FBTixFQUFTLENBQVQsQ0FBSixFQUFpQixDQUFqQixFQUFvQixLQUFwQixFQUEyQixDQUEzQixFQUE4QixDQUE5QixDQUQ2QjtBQUFBLEdBQVQ7QUFBQSxDQUFmOztBQUdBLElBQU0sc0JBQU8sU0FBUCxJQUFPO0FBQUEsU0FBSyxVQUFDLENBQUQsRUFBSSxLQUFKLEVBQVcsQ0FBWCxFQUFjLENBQWQ7QUFBQSxXQUN2QixFQUFFLENBQUYsRUFBSyxDQUFMLElBQVUsTUFBTSxDQUFOLEVBQVMsQ0FBVCxDQUFWLEdBQXdCLEtBQUssQ0FBTCxFQUFRLEtBQVIsRUFBZSxDQUFmLEVBQWtCLENBQWxCLENBREQ7QUFBQSxHQUFMO0FBQUEsQ0FBYjs7QUFHQSxJQUFNLDhCQUFXLDJCQUFqQjs7QUFFQSxTQUFTLElBQVQsQ0FBYyxDQUFkLEVBQWlCLEtBQWpCLEVBQXdCLENBQXhCLEVBQTJCLENBQTNCLEVBQThCO0FBQ25DLE1BQU0sS0FBSyxFQUFFLEVBQWI7QUFDQSxTQUFPLEtBQUssR0FBRyxDQUFILENBQUwsR0FBYSxDQUFDLEdBQUUsRUFBRSxHQUFMLEVBQVUsd0JBQU8sQ0FBUCxDQUFWLEVBQXFCLE1BQU0sS0FBSyxDQUFYLEVBQWMsQ0FBZCxDQUFyQixDQUFwQjtBQUNEOztBQUVEOztBQUVPLFNBQVMsSUFBVCxDQUFjLEdBQWQsRUFBbUI7QUFDeEIsTUFBSSxRQUFPLGNBQUMsQ0FBRCxFQUFJLEtBQUosRUFBVyxDQUFYLEVBQWMsQ0FBZDtBQUFBLFdBQW9CLENBQUMsUUFBTyxXQUFXLElBQUksR0FBSixDQUFYLENBQVIsRUFBOEIsQ0FBOUIsRUFBaUMsS0FBakMsRUFBd0MsQ0FBeEMsRUFBMkMsQ0FBM0MsQ0FBcEI7QUFBQSxHQUFYO0FBQ0EsV0FBUyxHQUFULENBQWEsQ0FBYixFQUFnQixLQUFoQixFQUF1QixDQUF2QixFQUEwQixDQUExQixFQUE2QjtBQUFDLFdBQU8sTUFBSyxDQUFMLEVBQVEsS0FBUixFQUFlLENBQWYsRUFBa0IsQ0FBbEIsQ0FBUDtBQUE0QjtBQUMxRCxTQUFPLEdBQVA7QUFDRDs7QUFFRDs7QUFFTyxJQUFNLG9CQUFNLFNBQU4sR0FBTTtBQUFBLHFDQUFJLE1BQUo7QUFBSSxVQUFKO0FBQUE7O0FBQUEsU0FBZSxJQUFJLEtBQUssTUFBTCxFQUFhLEtBQWIsQ0FBSixFQUF5QixLQUFLLE1BQUwsRUFBYSxLQUFiLENBQXpCLENBQWY7QUFBQSxDQUFaOztBQUVQOztBQUVPLElBQU0sOEJBQVcsUUFBUTtBQUFBLFNBQUssU0FBUyxDQUFDLEdBQUUsRUFBRSxLQUFMLEdBQVQsRUFBd0IsS0FBSyxFQUFFLE1BQVAsQ0FBeEIsQ0FBTDtBQUFBLENBQVIsQ0FBakI7O0FBRUEsSUFBTSwwQkFBUyx3QkFBZjs7QUFFQSxJQUFNLDRCQUFVLFFBQVE7QUFBQSxTQUFLLFNBQVMsQ0FBQyxHQUFFLEVBQUUsS0FBTCxHQUFULEVBQXdCLEVBQUUsTUFBMUIsQ0FBTDtBQUFBLENBQVIsQ0FBaEI7O0FBRUEsSUFBTSx3QkFBUSx1QkFBZDs7QUFFUDs7QUFFTyxJQUFNLGdDQUFZLHVCQUFNLFVBQUMsSUFBRCxFQUFPLENBQVAsRUFBVSxDQUFWO0FBQUEsU0FDN0IsUUFBUSxJQUFJLENBQUosRUFBTyxPQUFQLEVBQWdCLElBQWhCLEVBQXNCLENBQXRCLENBQVIsS0FBcUMsRUFEUjtBQUFBLENBQU4sQ0FBbEI7O0FBR0EsSUFBTSw0QkFBVSx5QkFBaEI7O0FBRUEsSUFBTSx3QkFBUSx1QkFBTSxVQUFDLENBQUQsRUFBSSxDQUFKLEVBQU8sQ0FBUCxFQUFVLENBQVY7QUFBQSxTQUN6QixLQUFLLENBQUwsRUFBUSxDQUFSLEVBQVcsSUFBSSxDQUFKLEVBQU8sT0FBUCxFQUFnQixJQUFoQixFQUFzQixDQUF0QixDQUFYLENBRHlCO0FBQUEsQ0FBTixDQUFkOztBQUdBLElBQU0sd0JBQVEsdUJBQU0sVUFBQyxDQUFELEVBQUksQ0FBSixFQUFPLENBQVAsRUFBVSxDQUFWLEVBQWdCO0FBQ3pDLE1BQU0sS0FBSyxVQUFVLElBQVYsRUFBZ0IsQ0FBaEIsRUFBbUIsQ0FBbkIsQ0FBWDtBQUNBLE9BQUssSUFBSSxJQUFFLEdBQUcsTUFBSCxHQUFVLENBQXJCLEVBQXdCLEtBQUcsQ0FBM0IsRUFBOEIsRUFBRSxDQUFoQyxFQUFtQztBQUNqQyxRQUFNLElBQUksR0FBRyxDQUFILENBQVY7QUFDQSxRQUFJLEVBQUUsQ0FBRixFQUFLLEVBQUUsQ0FBRixDQUFMLEVBQVcsRUFBRSxDQUFGLENBQVgsQ0FBSjtBQUNEO0FBQ0QsU0FBTyxDQUFQO0FBQ0QsQ0FQb0IsQ0FBZDs7QUFTQSxJQUFNLDRCQUFVLE1BQU0sSUFBSSxVQUFDLENBQUQsRUFBSSxDQUFKO0FBQUEsU0FBVSxJQUFJLENBQWQ7QUFBQSxDQUFKLENBQU4sQ0FBaEI7O0FBRUEsSUFBTSw0QkFBVSxNQUFNLElBQUksVUFBQyxDQUFELEVBQUksQ0FBSjtBQUFBLFNBQVUsSUFBSSxDQUFkO0FBQUEsQ0FBSixDQUFOLENBQWhCOztBQUVBLElBQU0sNEJBQVUsUUFBUSxLQUFLLENBQUwsQ0FBUixFQUFpQixPQUFPLENBQVAsRUFBVSxVQUFDLENBQUQsRUFBSSxDQUFKO0FBQUEsU0FBVSxJQUFJLENBQWQ7QUFBQSxDQUFWLENBQWpCLENBQWhCOztBQUVBLElBQU0sb0JBQU0sUUFBUSxLQUFLLENBQUwsQ0FBUixFQUFpQixPQUFPLENBQVAsRUFBVSxVQUFDLENBQUQsRUFBSSxDQUFKO0FBQUEsU0FBVSxJQUFJLENBQWQ7QUFBQSxDQUFWLENBQWpCLENBQVo7O0FBRVA7O0FBRU8sU0FBUyxNQUFULENBQWdCLFFBQWhCLEVBQTBCO0FBQy9CLE1BQU0sT0FBTyxFQUFiO0FBQUEsTUFBaUIsT0FBTyxFQUF4QjtBQUNBLE9BQUssSUFBTSxDQUFYLElBQWdCLFFBQWhCLEVBQTBCO0FBQ3hCLFNBQUssSUFBTCxDQUFVLENBQVY7QUFDQSxTQUFLLElBQUwsQ0FBVSxXQUFXLFNBQVMsQ0FBVCxDQUFYLENBQVY7QUFDRDtBQUNELFNBQU8sU0FBUyxJQUFULEVBQWUsSUFBZixDQUFQO0FBQ0Q7O0FBRUQ7O0FBRU8sU0FBUyxLQUFULENBQWUsQ0FBZixFQUFrQixLQUFsQixFQUF5QixFQUF6QixFQUE2QixDQUE3QixFQUFnQztBQUNyQyxNQUFJLGVBQWUsRUFBZixDQUFKLEVBQXdCO0FBQ3RCLFdBQU8sTUFBTSxLQUFOLEdBQ0gsaUJBQWlCLEtBQWpCLEVBQXdCLEVBQXhCLENBREcsR0FFSCxxQkFBcUIsQ0FBckIsRUFBd0IsS0FBeEIsRUFBK0IsRUFBL0IsQ0FGSjtBQUdELEdBSkQsTUFJTztBQUNMLFFBQUksUUFBUSxHQUFSLENBQVksUUFBWixLQUF5QixZQUE3QixFQUNFLGVBQWUsQ0FBZjtBQUNGLFdBQU8sQ0FBQyxHQUFFLEVBQUUsRUFBTCxFQUFTLEVBQVQsQ0FBUDtBQUNEO0FBQ0Y7O0FBRU0sU0FBUyxNQUFULENBQWdCLENBQWhCLEVBQW1CLEtBQW5CLEVBQTBCLEVBQTFCLEVBQThCLENBQTlCLEVBQWlDO0FBQ3RDLE1BQUksY0FBYyxNQUFsQixFQUEwQjtBQUN4QixXQUFPLFNBQVMsc0JBQUssRUFBTCxDQUFULEVBQW1CLENBQW5CLEVBQXNCLEtBQXRCLEVBQTZCLEVBQTdCLENBQVA7QUFDRCxHQUZELE1BRU87QUFDTCxRQUFJLFFBQVEsR0FBUixDQUFZLFFBQVosS0FBeUIsWUFBN0IsRUFDRSxlQUFlLENBQWY7QUFDRixXQUFPLENBQUMsR0FBRSxFQUFFLEVBQUwsRUFBUyxFQUFULENBQVA7QUFDRDtBQUNGOztBQUVEOztBQUVPLElBQU0sb0JBQU0sdUJBQU0sSUFBTixDQUFaOztBQUVQOztBQUVPLElBQU0sc0JBQU8sdUJBQU0sVUFBQyxHQUFELEVBQU0sR0FBTjtBQUFBLFNBQWMsVUFBQyxDQUFELEVBQUksS0FBSixFQUFXLENBQVgsRUFBYyxDQUFkO0FBQUEsV0FDdEMsQ0FBQyxHQUFFLEVBQUUsR0FBTCxFQUFVO0FBQUEsYUFBSyxJQUFJLENBQUosRUFBTyxDQUFQLEVBQVUsQ0FBVixDQUFMO0FBQUEsS0FBVixFQUE2QixNQUFNLElBQUksQ0FBSixFQUFPLENBQVAsQ0FBTixFQUFpQixDQUFqQixDQUE3QixDQURzQztBQUFBLEdBQWQ7QUFBQSxDQUFOLENBQWI7O0FBR1A7O0FBRU8sSUFBTSw0QkFBVSxTQUFWLE9BQVUsV0FBWTtBQUNqQyxNQUFJLFFBQVEsR0FBUixDQUFZLFFBQVosS0FBeUIsWUFBekIsSUFBeUMsQ0FBQywwQkFBUyxRQUFULENBQTlDLEVBQ0UsTUFBTSxJQUFJLEtBQUosQ0FBVSwyREFBVixDQUFOO0FBQ0YsU0FBTyxLQUNMLGFBQUs7QUFDSCxRQUFJLGdDQUFlLENBQWYsRUFBa0IsQ0FBbEIsQ0FBSjtBQUNBLFFBQUksQ0FBSixFQUNFLEtBQUssSUFBTSxDQUFYLElBQWdCLFFBQWhCO0FBQ0UsUUFBRSxDQUFGLElBQU8sU0FBUyxDQUFULEVBQVksQ0FBWixDQUFQO0FBREYsS0FFRixPQUFPLENBQVA7QUFDRCxHQVBJLEVBUUwsVUFBQyxDQUFELEVBQUksQ0FBSixFQUFVO0FBQ1IsUUFBSSxRQUFRLEdBQVIsQ0FBWSxRQUFaLEtBQXlCLFlBQXpCLElBQ0EsRUFBRSxLQUFLLENBQUwsS0FBVyxDQUFYLElBQWdCLGFBQWEsTUFBL0IsQ0FESixFQUVFLE1BQU0sSUFBSSxLQUFKLENBQVUsbUVBQVYsQ0FBTjtBQUNGLFFBQUksS0FBSyxFQUFFLFdBQUYsS0FBa0IsTUFBM0IsRUFDRSxJQUFJLE9BQU8sTUFBUCxDQUFjLEVBQWQsRUFBa0IsQ0FBbEIsQ0FBSjtBQUNGLFFBQUksRUFBRSxhQUFhLE1BQWYsQ0FBSixFQUNFLElBQUksS0FBSyxDQUFUO0FBQ0YsUUFBSSxVQUFKO0FBQ0EsYUFBUyxHQUFULENBQWEsQ0FBYixFQUFnQixDQUFoQixFQUFtQjtBQUNqQixVQUFJLENBQUMsQ0FBTCxFQUNFLElBQUksRUFBSjtBQUNGLFFBQUUsQ0FBRixJQUFPLENBQVA7QUFDRDtBQUNELFNBQUssSUFBTSxDQUFYLElBQWdCLENBQWhCLEVBQW1CO0FBQ2pCLFVBQUksRUFBRSxLQUFLLFFBQVAsQ0FBSixFQUNFLElBQUksQ0FBSixFQUFPLEVBQUUsQ0FBRixDQUFQLEVBREYsS0FHRSxJQUFJLEtBQUssS0FBSyxDQUFkLEVBQ0UsSUFBSSxDQUFKLEVBQU8sRUFBRSxDQUFGLENBQVA7QUFDTDtBQUNELFdBQU8sQ0FBUDtBQUNELEdBOUJJLENBQVA7QUErQkQsQ0FsQ007O0FBb0NQOztBQUVPLElBQU0sOEJBQVcsU0FBWCxRQUFXLE1BQU87QUFDN0IsTUFBTSxNQUFNLFNBQU4sR0FBTTtBQUFBLFdBQUssU0FBUyxHQUFULEVBQWMsS0FBSyxDQUFuQixFQUFzQixDQUF0QixDQUFMO0FBQUEsR0FBWjtBQUNBLFNBQU8sVUFBQyxDQUFELEVBQUksS0FBSixFQUFXLENBQVgsRUFBYyxDQUFkO0FBQUEsV0FBb0IsQ0FBQyxHQUFFLEVBQUUsR0FBTCxFQUFVLEdBQVYsRUFBZSxNQUFNLEtBQUssQ0FBTCxLQUFXLENBQVgsR0FBZSxDQUFmLEdBQW1CLEdBQXpCLEVBQThCLENBQTlCLENBQWYsQ0FBcEI7QUFBQSxHQUFQO0FBQ0QsQ0FITTs7QUFLQSxJQUFNLDhCQUFXLFNBQVgsUUFBVztBQUFBLFNBQU8sUUFBUSxHQUFSLEVBQWEsS0FBSyxDQUFsQixDQUFQO0FBQUEsQ0FBakI7O0FBRUEsSUFBTSwwQkFBUyxTQUFULE1BQVM7QUFBQSxTQUFLLFdBQVcsS0FBSyxDQUFMLENBQVgsQ0FBTDtBQUFBLENBQWY7O0FBRUEsSUFBTSxnQ0FBWSxTQUFaLFNBQVk7QUFBQSxTQUN2QixXQUFXLFVBQUMsQ0FBRCxFQUFJLENBQUo7QUFBQSxXQUFVLEtBQUssQ0FBTCxLQUFXLENBQVgsR0FBZSxLQUFLLENBQUwsRUFBUSxDQUFSLENBQWYsR0FBNEIsS0FBSyxDQUEzQztBQUFBLEdBQVgsQ0FEdUI7QUFBQSxDQUFsQjs7QUFHQSxJQUFNLDRCQUFVLFNBQVYsT0FBVTtBQUFBLFNBQVEsVUFBQyxDQUFELEVBQUksS0FBSixFQUFXLENBQVgsRUFBYyxDQUFkO0FBQUEsV0FDN0IsQ0FBQyxHQUFFLEVBQUUsR0FBTCxFQUFVO0FBQUEsYUFBSyxLQUFLLENBQUwsS0FBVyxDQUFYLEdBQWUsS0FBSyxDQUFMLEVBQVEsQ0FBUixDQUFmLEdBQTRCLEtBQUssQ0FBdEM7QUFBQSxLQUFWLEVBQW1ELE1BQU0sQ0FBTixFQUFTLENBQVQsQ0FBbkQsQ0FENkI7QUFBQSxHQUFSO0FBQUEsQ0FBaEI7O0FBR1A7O0FBRU8sSUFBTSwwQkFBUyxTQUFULE1BQVMsQ0FBQyxDQUFELEVBQUksS0FBSixFQUFXLEVBQVgsRUFBZSxDQUFmO0FBQUEsU0FDcEIsQ0FBQyxHQUFFLEVBQUUsR0FBTCxFQUFVO0FBQUEsV0FBSyxTQUFTLGVBQWUsRUFBZixJQUFxQixHQUFHLE1BQXhCLEdBQWlDLENBQTFDLEVBQTZDLENBQTdDLEVBQWdELEVBQWhELENBQUw7QUFBQSxHQUFWLEVBQ1UsTUFBTSxLQUFLLENBQVgsRUFBYyxDQUFkLENBRFYsQ0FEb0I7QUFBQSxDQUFmOztBQUlBLElBQU0sMEJBQVMsU0FBVCxNQUFTO0FBQUEsU0FBUSxVQUFDLENBQUQsRUFBSSxLQUFKLEVBQVcsRUFBWCxFQUFlLENBQWYsRUFBcUI7QUFDakQsUUFBSSxXQUFKO0FBQUEsUUFBUSxXQUFSO0FBQ0EsUUFBSSxlQUFlLEVBQWYsQ0FBSixFQUNFLG1CQUFtQixJQUFuQixFQUF5QixFQUF6QixFQUE2QixLQUFLLEVBQWxDLEVBQXNDLEtBQUssRUFBM0M7QUFDRixXQUFPLENBQUMsR0FBRSxFQUFFLEdBQUwsRUFDTCxjQUFNO0FBQ0osVUFBSSxRQUFRLEdBQVIsQ0FBWSxRQUFaLEtBQXlCLFlBQXpCLElBQ0EsRUFBRSxLQUFLLENBQUwsS0FBVyxFQUFYLElBQWlCLGVBQWUsRUFBZixDQUFuQixDQURKLEVBRUUsTUFBTSxJQUFJLEtBQUosQ0FBVSw2RUFBVixDQUFOO0FBQ0YsVUFBTSxNQUFNLEtBQUssR0FBRyxNQUFSLEdBQWlCLENBQTdCO0FBQUEsVUFDTSxNQUFNLEtBQUssR0FBRyxNQUFSLEdBQWlCLENBRDdCO0FBQUEsVUFFTSxJQUFJLE1BQU0sR0FGaEI7QUFHQSxVQUFJLENBQUosRUFDRSxPQUFPLE1BQU0sR0FBTixHQUNMLEVBREssR0FFTCxXQUFXLFdBQVcsTUFBTSxDQUFOLENBQVgsRUFBcUIsQ0FBckIsRUFBd0IsRUFBeEIsRUFBNEIsQ0FBNUIsRUFBK0IsR0FBL0IsQ0FBWCxFQUFnRCxHQUFoRCxFQUFxRCxFQUFyRCxFQUF5RCxDQUF6RCxFQUE0RCxHQUE1RCxDQUZGO0FBR0gsS0FaSSxFQWFMLE1BQU0sRUFBTixFQUFVLENBQVYsQ0FiSyxDQUFQO0FBY0QsR0FsQnFCO0FBQUEsQ0FBZjs7QUFvQkEsSUFBTSxzQkFBTyxTQUFQLElBQU87QUFBQSxTQUFRLE9BQU8sY0FBTTtBQUN2QyxRQUFJLENBQUMsZUFBZSxFQUFmLENBQUwsRUFDRSxPQUFPLENBQVA7QUFDRixRQUFNLElBQUksVUFBVSxJQUFWLEVBQWdCLEVBQWhCLENBQVY7QUFDQSxXQUFPLElBQUksQ0FBSixHQUFRLE1BQVIsR0FBaUIsQ0FBeEI7QUFDRCxHQUwyQixDQUFSO0FBQUEsQ0FBYjs7QUFPQSxTQUFTLFFBQVQsR0FBeUI7QUFDOUIsTUFBTSxNQUFNLG1DQUFaO0FBQ0EsU0FBTyxDQUFDLEtBQUs7QUFBQSxXQUFLLEtBQUssQ0FBTCxLQUFXLEtBQUssR0FBTCxFQUFVLENBQVYsQ0FBaEI7QUFBQSxHQUFMLENBQUQsRUFBcUMsR0FBckMsQ0FBUDtBQUNEOztBQUVNLElBQU0sd0JBQVEsUUFBUSxHQUFSLENBQVksUUFBWixLQUF5QixZQUF6QixvQkFBNkMsYUFBSztBQUNyRSxNQUFJLENBQUMsT0FBTyxTQUFQLENBQWlCLENBQWpCLENBQUQsSUFBd0IsSUFBSSxDQUFoQyxFQUNFLE1BQU0sSUFBSSxLQUFKLENBQVUseURBQVYsQ0FBTjtBQUNGLFNBQU8sQ0FBUDtBQUNELENBSk07O0FBTUEsSUFBTSx3QkFBUSx1QkFBTSxVQUFDLEtBQUQsRUFBUSxHQUFSO0FBQUEsU0FBZ0IsVUFBQyxDQUFELEVBQUksTUFBSixFQUFZLEVBQVosRUFBZ0IsQ0FBaEIsRUFBc0I7QUFDL0QsUUFBTSxRQUFRLGVBQWUsRUFBZixDQUFkO0FBQUEsUUFDTSxNQUFNLFNBQVMsR0FBRyxNQUR4QjtBQUFBLFFBRU0sSUFBSSxXQUFXLENBQVgsRUFBYyxHQUFkLEVBQW1CLENBQW5CLEVBQXNCLEtBQXRCLENBRlY7QUFBQSxRQUdNLElBQUksV0FBVyxDQUFYLEVBQWMsR0FBZCxFQUFtQixHQUFuQixFQUF3QixHQUF4QixDQUhWO0FBSUEsV0FBTyxDQUFDLEdBQUUsRUFBRSxHQUFMLEVBQ0wsY0FBTTtBQUNKLFVBQUksUUFBUSxHQUFSLENBQVksUUFBWixLQUF5QixZQUF6QixJQUNBLEVBQUUsS0FBSyxDQUFMLEtBQVcsRUFBWCxJQUFpQixlQUFlLEVBQWYsQ0FBbkIsQ0FESixFQUVFLE1BQU0sSUFBSSxLQUFKLENBQVUsNEVBQVYsQ0FBTjtBQUNGLFVBQU0sTUFBTSxLQUFLLEdBQUcsTUFBUixHQUFpQixDQUE3QjtBQUFBLFVBQWdDLFFBQVEsSUFBSSxHQUE1QztBQUFBLFVBQWlELElBQUksTUFBTSxDQUFOLEdBQVUsS0FBL0Q7QUFDQSxhQUFPLElBQ0gsV0FBVyxXQUFXLFdBQVcsTUFBTSxDQUFOLENBQVgsRUFBcUIsQ0FBckIsRUFBd0IsRUFBeEIsRUFBNEIsQ0FBNUIsRUFBK0IsQ0FBL0IsQ0FBWCxFQUNXLENBRFgsRUFFVyxFQUZYLEVBRWUsQ0FGZixFQUVrQixHQUZsQixDQUFYLEVBR1csS0FIWCxFQUlXLEVBSlgsRUFJZSxDQUpmLEVBSWtCLEdBSmxCLENBREcsR0FNSCxLQUFLLENBTlQ7QUFPRCxLQWJJLEVBY0wsT0FBTyxRQUFRLFdBQVcsTUFBTSxLQUFLLEdBQUwsQ0FBUyxDQUFULEVBQVksSUFBSSxDQUFoQixDQUFOLENBQVgsRUFBc0MsQ0FBdEMsRUFBeUMsRUFBekMsRUFBNkMsQ0FBN0MsRUFBZ0QsQ0FBaEQsQ0FBUixHQUNBLEtBQUssQ0FEWixFQUVPLENBRlAsQ0FkSyxDQUFQO0FBaUJELEdBdEIwQjtBQUFBLENBQU4sQ0FBZDs7QUF3QlA7O0FBRU8sSUFBTSxzQkFBTyxRQUFRLEdBQVIsQ0FBWSxRQUFaLEtBQXlCLFlBQXpCLG9CQUE2QyxhQUFLO0FBQ3BFLE1BQUksT0FBTyxDQUFQLEtBQWEsUUFBakIsRUFDRSxNQUFNLElBQUksS0FBSixDQUFVLDBDQUFWLENBQU47QUFDRixTQUFPLENBQVA7QUFDRCxDQUpNOztBQU1BLFNBQVMsS0FBVCxHQUFpQjtBQUN0QixNQUFNLElBQUksVUFBVSxNQUFwQjtBQUFBLE1BQTRCLFdBQVcsRUFBdkM7QUFDQSxPQUFLLElBQUksSUFBRSxDQUFOLEVBQVMsQ0FBZCxFQUFpQixJQUFFLENBQW5CLEVBQXNCLEVBQUUsQ0FBeEI7QUFDRSxhQUFTLElBQUksVUFBVSxDQUFWLENBQWIsSUFBNkIsQ0FBN0I7QUFERixHQUVBLE9BQU8sS0FBSyxRQUFMLENBQVA7QUFDRDs7QUFFRDs7QUFFTyxJQUFNLDRCQUFVLFNBQVYsT0FBVTtBQUFBLFNBQUssVUFBQyxFQUFELEVBQUssS0FBTCxFQUFZLENBQVosRUFBZSxDQUFmO0FBQUEsV0FDMUIsTUFBTSxLQUFLLENBQUwsS0FBVyxDQUFYLElBQWdCLE1BQU0sSUFBdEIsR0FBNkIsQ0FBN0IsR0FBaUMsQ0FBdkMsRUFBMEMsQ0FBMUMsQ0FEMEI7QUFBQSxHQUFMO0FBQUEsQ0FBaEI7O0FBR1A7O0FBRU8sSUFBTSwwQkFDWCx1QkFBTSxVQUFDLENBQUQsRUFBSSxDQUFKO0FBQUEsU0FBVSxPQUFPO0FBQUEsV0FBSyxLQUFLLENBQUwsS0FBVyxLQUFLLENBQUwsRUFBUSxDQUFSLENBQVgsR0FBd0IsQ0FBeEIsR0FBNEIsQ0FBakM7QUFBQSxHQUFQLENBQVY7QUFBQSxDQUFOLENBREs7O0FBR1A7O0FBRU8sSUFBTSxrQkFBSyxTQUFMLEVBQUs7QUFBQSxTQUFRLFVBQUMsQ0FBRCxFQUFJLEtBQUosRUFBVyxDQUFYLEVBQWMsQ0FBZDtBQUFBLFdBQ3hCLENBQUMsR0FBRSxFQUFFLEdBQUwsRUFBVSx3QkFBTyxDQUFQLENBQVYsRUFBcUIsTUFBTSxLQUFLLENBQUwsRUFBUSxDQUFSLENBQU4sRUFBa0IsQ0FBbEIsQ0FBckIsQ0FEd0I7QUFBQSxHQUFSO0FBQUEsQ0FBWDs7QUFHQSxJQUFNLHNCQUFPLFNBQVAsSUFBTztBQUFBLFNBQUssR0FBRyx3QkFBTyxDQUFQLENBQUgsQ0FBTDtBQUFBLENBQWI7O0FBRVA7O0FBRU8sSUFBTSxzQkFBTyxTQUFQLElBQU8sV0FBWTtBQUM5QixNQUFJLFFBQVEsR0FBUixDQUFZLFFBQVosS0FBeUIsWUFBekIsSUFBeUMsQ0FBQywwQkFBUyxRQUFULENBQTlDLEVBQ0UsTUFBTSxJQUFJLEtBQUosQ0FBVSx3REFBVixDQUFOO0FBQ0YsU0FBTyxVQUFDLENBQUQsRUFBSSxLQUFKLEVBQVcsQ0FBWCxFQUFjLENBQWQ7QUFBQSxXQUNMLENBQUMsR0FBRSxFQUFFLEdBQUwsRUFBVSxRQUFRLFFBQVIsRUFBa0IsQ0FBbEIsQ0FBVixFQUFnQyxNQUFNLFFBQVEsUUFBUixFQUFrQixDQUFsQixDQUFOLEVBQTRCLENBQTVCLENBQWhDLENBREs7QUFBQSxHQUFQO0FBRUQsQ0FMTTs7QUFPQSxJQUFNLDRCQUFVLHVCQUFNLFVBQUMsR0FBRCxFQUFNLEdBQU4sRUFBYztBQUN6QyxNQUFNLE1BQU0sU0FBTixHQUFNO0FBQUEsV0FBSyxTQUFTLEdBQVQsRUFBYyxHQUFkLEVBQW1CLENBQW5CLENBQUw7QUFBQSxHQUFaO0FBQ0EsU0FBTyxVQUFDLENBQUQsRUFBSSxLQUFKLEVBQVcsQ0FBWCxFQUFjLENBQWQ7QUFBQSxXQUFvQixDQUFDLEdBQUUsRUFBRSxHQUFMLEVBQVUsR0FBVixFQUFlLE1BQU0sU0FBUyxHQUFULEVBQWMsR0FBZCxFQUFtQixDQUFuQixDQUFOLEVBQTZCLENBQTdCLENBQWYsQ0FBcEI7QUFBQSxHQUFQO0FBQ0QsQ0FIc0IsQ0FBaEI7O0FBS1A7O0FBRU8sSUFBTSxrQ0FBYSx3QkFBTyxDQUFQLEVBQVUsSUFBVixDQUFuQjs7QUFFUDs7QUFFTyxJQUFNLG9CQUNYLHVCQUFNLFVBQUMsR0FBRCxFQUFNLEdBQU47QUFBQSxTQUFjLFVBQUMsQ0FBRCxFQUFJLEtBQUosRUFBVyxDQUFYLEVBQWMsQ0FBZDtBQUFBLFdBQW9CLENBQUMsR0FBRSxFQUFFLEdBQUwsRUFBVSxHQUFWLEVBQWUsTUFBTSxJQUFJLENBQUosQ0FBTixFQUFjLENBQWQsQ0FBZixDQUFwQjtBQUFBLEdBQWQ7QUFBQSxDQUFOLENBREs7O0FBR1A7O0FBRU8sSUFBTSw4QkFBVyxTQUFYLFFBQVcsQ0FBQyxFQUFELEVBQUssS0FBTCxFQUFZLENBQVosRUFBZSxDQUFmO0FBQUEsU0FBcUIsTUFBTSxDQUFOLEVBQVMsQ0FBVCxDQUFyQjtBQUFBLENBQWpCOztBQUVBLElBQU0sNEJBQVUsU0FBVixPQUFVO0FBQUEsU0FBTyxVQUFDLENBQUQsRUFBSSxLQUFKLEVBQVcsQ0FBWCxFQUFjLENBQWQ7QUFBQSxXQUM1QixDQUFDLEdBQUUsRUFBRSxHQUFMLEVBQVU7QUFBQSxhQUFLLEtBQUssR0FBTCxFQUFVLENBQVYsQ0FBTDtBQUFBLEtBQVYsRUFBNkIsTUFBTSxLQUFLLEdBQUwsRUFBVSxDQUFWLENBQU4sRUFBb0IsQ0FBcEIsQ0FBN0IsQ0FENEI7QUFBQSxHQUFQO0FBQUEsQ0FBaEIiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IHtcbiAgYWN5Y2xpY0VxdWFsc1UsXG4gIGFsd2F5cyxcbiAgYXBwbHlVLFxuICBhcml0eU4sXG4gIGFzc29jUGFydGlhbFUsXG4gIGN1cnJ5LFxuICBjdXJyeU4sXG4gIGRpc3NvY1BhcnRpYWxVLFxuICBpZCxcbiAgaXNEZWZpbmVkLFxuICBpc09iamVjdCxcbiAga2V5cyxcbiAgb2JqZWN0MCxcbiAgc25kVVxufSBmcm9tIFwiaW5mZXN0aW5lc1wiXG5cbi8vXG5cbmNvbnN0IHNsaWNlSW5kZXggPSAobSwgbCwgZCwgaSkgPT5cbiAgdm9pZCAwID09PSBpID8gZCA6IE1hdGgubWluKE1hdGgubWF4KG0sIGkgPCAwID8gbCArIGkgOiBpKSwgbClcblxuZnVuY3Rpb24gcGFpcih4MCwgeDEpIHtyZXR1cm4gW3gwLCB4MV19XG5cbmNvbnN0IGZsaXAgPSBib3AgPT4gKHgsIHkpID0+IGJvcCh5LCB4KVxuXG5jb25zdCB1bnRvID0gYyA9PiB4ID0+IHZvaWQgMCAhPT0geCA/IHggOiBjXG5cbmNvbnN0IGlzTmF0ID0geCA9PiB4ID09PSAoeCA+PiAwKSAmJiAwIDw9IHhcblxuY29uc3Qgc2VlbXNBcnJheUxpa2UgPSB4ID0+XG4gIHggaW5zdGFuY2VvZiBPYmplY3QgJiYgaXNOYXQoeC5sZW5ndGgpIHx8IHR5cGVvZiB4ID09PSBcInN0cmluZ1wiXG5cbi8vXG5cbmZ1bmN0aW9uIG1hcFBhcnRpYWxJbmRleFUoeGkyeSwgeHMpIHtcbiAgY29uc3QgbiA9IHhzLmxlbmd0aCwgeXMgPSBBcnJheShuKVxuICBsZXQgaiA9IDBcbiAgZm9yIChsZXQgaT0wLCB5OyBpPG47ICsraSlcbiAgICBpZiAodm9pZCAwICE9PSAoeSA9IHhpMnkoeHNbaV0sIGkpKSlcbiAgICAgIHlzW2orK10gPSB5XG4gIGlmIChqKSB7XG4gICAgaWYgKGogPCBuKVxuICAgICAgeXMubGVuZ3RoID0galxuICAgIHJldHVybiB5c1xuICB9XG59XG5cbmZ1bmN0aW9uIGNvcHlUb0Zyb20oeXMsIGssIHhzLCBpLCBqKSB7XG4gIHdoaWxlIChpIDwgailcbiAgICB5c1trKytdID0geHNbaSsrXVxuICByZXR1cm4geXNcbn1cblxuZnVuY3Rpb24gc2V0QXQoeHMsIGksIHgpIHtcbiAgeHNbaV0gPSB4XG4gIHJldHVybiB4c1xufVxuXG4vL1xuXG5jb25zdCBBcHBsaWNhdGl2ZSA9IChtYXAsIG9mLCBhcCkgPT4gKHttYXAsIG9mLCBhcH0pXG5cbmNvbnN0IElkZW50ID0gQXBwbGljYXRpdmUoYXBwbHlVLCBpZCwgYXBwbHlVKVxuXG5jb25zdCBDb25zdCA9IHttYXA6IHNuZFV9XG5cbmNvbnN0IFRhY25vY09mID0gKGVtcHR5LCB0YWNub2MpID0+IEFwcGxpY2F0aXZlKHNuZFUsIGFsd2F5cyhlbXB0eSksIHRhY25vYylcblxuY29uc3QgTW9ub2lkID0gKGVtcHR5LCBjb25jYXQpID0+ICh7ZW1wdHk6ICgpID0+IGVtcHR5LCBjb25jYXR9KVxuXG5jb25zdCBNdW0gPSBvcmQgPT5cbiAgTW9ub2lkKHZvaWQgMCwgKHksIHgpID0+IHZvaWQgMCAhPT0geCAmJiAodm9pZCAwID09PSB5IHx8IG9yZCh4LCB5KSkgPyB4IDogeSlcblxuLy9cblxuY29uc3QgcnVuID0gKG8sIEMsIHhpMnlDLCBzLCBpKSA9PiB0b0Z1bmN0aW9uKG8pKEMsIHhpMnlDLCBzLCBpKVxuXG5jb25zdCBjb25zdEFzID0gdG9Db25zdCA9PiBjdXJyeU4oNCwgKHhNaTJ5LCBtKSA9PiB7XG4gIGNvbnN0IEMgPSB0b0NvbnN0KG0pXG4gIHJldHVybiAodCwgcykgPT4gcnVuKHQsIEMsIHhNaTJ5LCBzKVxufSlcblxuLy9cblxuZnVuY3Rpb24gcmVxQXBwbGljYXRpdmUoZikge1xuICBpZiAoIWYub2YpXG4gICAgdGhyb3cgbmV3IEVycm9yKFwicGFydGlhbC5sZW5zZXM6IFRyYXZlcnNhbHMgcmVxdWlyZSBhbiBhcHBsaWNhdGl2ZS5cIilcbn1cblxuLy9cblxuZnVuY3Rpb24gQ29uY2F0KGwsIHIpIHt0aGlzLmwgPSBsOyB0aGlzLnIgPSByfVxuXG5jb25zdCBpc0NvbmNhdCA9IG4gPT4gbi5jb25zdHJ1Y3RvciA9PT0gQ29uY2F0XG5cbmNvbnN0IGFwID0gKHIsIGwpID0+IHZvaWQgMCAhPT0gbCA/IHZvaWQgMCAhPT0gciA/IG5ldyBDb25jYXQobCwgcikgOiBsIDogclxuXG5jb25zdCByY29uY2F0ID0gdCA9PiBoID0+IGFwKHQsIGgpXG5cbmZ1bmN0aW9uIHB1c2hUbyhuLCB5cykge1xuICB3aGlsZSAobiAmJiBpc0NvbmNhdChuKSkge1xuICAgIGNvbnN0IGwgPSBuLmxcbiAgICBuID0gbi5yXG4gICAgaWYgKGwgJiYgaXNDb25jYXQobCkpIHtcbiAgICAgIHB1c2hUbyhsLmwsIHlzKVxuICAgICAgcHVzaFRvKGwuciwgeXMpXG4gICAgfSBlbHNlXG4gICAgICB5cy5wdXNoKGwpXG4gIH1cbiAgeXMucHVzaChuKVxufVxuXG5mdW5jdGlvbiB0b0FycmF5KG4pIHtcbiAgaWYgKHZvaWQgMCAhPT0gbikge1xuICAgIGNvbnN0IHlzID0gW11cbiAgICBwdXNoVG8obiwgeXMpXG4gICAgcmV0dXJuIHlzXG4gIH1cbn1cblxuZnVuY3Rpb24gZm9sZFJlYyhmLCByLCBuKSB7XG4gIHdoaWxlIChpc0NvbmNhdChuKSkge1xuICAgIGNvbnN0IGwgPSBuLmxcbiAgICBuID0gbi5yXG4gICAgciA9IGlzQ29uY2F0KGwpXG4gICAgICA/IGZvbGRSZWMoZiwgZm9sZFJlYyhmLCByLCBsLmwpLCBsLnIpXG4gICAgICA6IGYociwgbFswXSwgbFsxXSlcbiAgfVxuICByZXR1cm4gZihyLCBuWzBdLCBuWzFdKVxufVxuXG5jb25zdCBmb2xkID0gKGYsIHIsIG4pID0+IHZvaWQgMCAhPT0gbiA/IGZvbGRSZWMoZiwgciwgbikgOiByXG5cbmNvbnN0IENvbGxlY3QgPSBUYWNub2NPZih2b2lkIDAsIGFwKVxuXG4vL1xuXG5mdW5jdGlvbiB0cmF2ZXJzZVBhcnRpYWxJbmRleChBLCB4aTJ5QSwgeHMpIHtcbiAgY29uc3QgYXAgPSBBLmFwLCBtYXAgPSBBLm1hcFxuICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKVxuICAgIHJlcUFwcGxpY2F0aXZlKEEpXG4gIGxldCBzID0gKDAsQS5vZikodm9pZCAwKSwgaSA9IHhzLmxlbmd0aFxuICB3aGlsZSAoaS0tKVxuICAgIHMgPSBhcChtYXAocmNvbmNhdCwgcyksIHhpMnlBKHhzW2ldLCBpKSlcbiAgcmV0dXJuIG1hcCh0b0FycmF5LCBzKVxufVxuXG4vL1xuXG5mdW5jdGlvbiBvYmplY3QwVG9VbmRlZmluZWQobykge1xuICBpZiAoIShvIGluc3RhbmNlb2YgT2JqZWN0KSlcbiAgICByZXR1cm4gb1xuICBmb3IgKGNvbnN0IGsgaW4gbylcbiAgICByZXR1cm4gb1xufVxuXG4vL1xuXG5jb25zdCBnZXRQcm9wID0gKGssIG8pID0+IG8gaW5zdGFuY2VvZiBPYmplY3QgPyBvW2tdIDogdm9pZCAwXG5cbmNvbnN0IHNldFByb3AgPSAoaywgdiwgbykgPT5cbiAgdm9pZCAwICE9PSB2ID8gYXNzb2NQYXJ0aWFsVShrLCB2LCBvKSA6IGRpc3NvY1BhcnRpYWxVKGssIG8pXG5cbi8vXG5cbmNvbnN0IGdldEluZGV4ID0gKGksIHhzKSA9PiBzZWVtc0FycmF5TGlrZSh4cykgPyB4c1tpXSA6IHZvaWQgMFxuXG5mdW5jdGlvbiBzZXRJbmRleChpLCB4LCB4cykge1xuICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiICYmIGkgPCAwKVxuICAgIHRocm93IG5ldyBFcnJvcihcInBhcnRpYWwubGVuc2VzOiBOZWdhdGl2ZSBpbmRpY2VzIGFyZSBub3Qgc3VwcG9ydGVkIGJ5IGBpbmRleGAuXCIpXG4gIGlmICghc2VlbXNBcnJheUxpa2UoeHMpKVxuICAgIHhzID0gXCJcIlxuICBjb25zdCBuID0geHMubGVuZ3RoXG4gIGlmICh2b2lkIDAgIT09IHgpIHtcbiAgICBpZiAobiA8PSBpKVxuICAgICAgcmV0dXJuIHNldEF0KGNvcHlUb0Zyb20oQXJyYXkoaSsxKSwgMCwgeHMsIDAsIGkpLCBpLCB4KVxuICAgIGNvbnN0IHlzID0gQXJyYXkobilcbiAgICBmb3IgKGxldCBqPTA7IGo8bjsgKytqKVxuICAgICAgeXNbal0gPSB4c1tqXVxuICAgIHlzW2ldID0geFxuICAgIHJldHVybiB5c1xuICB9IGVsc2Uge1xuICAgIGlmICgwIDwgbikge1xuICAgICAgaWYgKG4gPD0gaSlcbiAgICAgICAgcmV0dXJuIGNvcHlUb0Zyb20oQXJyYXkobiksIDAsIHhzLCAwLCBuKVxuICAgICAgaWYgKDEgPCBuKSB7XG4gICAgICAgIGNvbnN0IHlzID0gQXJyYXkobi0xKVxuICAgICAgICBmb3IgKGxldCBqPTA7IGo8aTsgKytqKVxuICAgICAgICAgIHlzW2pdID0geHNbal1cbiAgICAgICAgZm9yIChsZXQgaj1pKzE7IGo8bjsgKytqKVxuICAgICAgICAgIHlzW2otMV0gPSB4c1tqXVxuICAgICAgICByZXR1cm4geXNcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuLy9cblxuZnVuY3Rpb24gcmVxT3B0aWMobykge1xuICBpZiAoISh0eXBlb2YgbyA9PT0gXCJmdW5jdGlvblwiICYmIG8ubGVuZ3RoID09PSA0KSlcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJwYXJ0aWFsLmxlbnNlczogRXhwZWN0aW5nIGFuIG9wdGljLlwiKVxufVxuXG5jb25zdCBjbG9zZSA9IChvLCBGLCB4aTJ5RikgPT4gKHgsIGkpID0+IG8oRiwgeGkyeUYsIHgsIGkpXG5cbmZ1bmN0aW9uIGNvbXBvc2VkKG9pMCwgb3MpIHtcbiAgc3dpdGNoIChvcy5sZW5ndGggLSBvaTApIHtcbiAgICBjYXNlIDA6ICByZXR1cm4gaWRlbnRpdHlcbiAgICBjYXNlIDE6ICByZXR1cm4gdG9GdW5jdGlvbihvc1tvaTBdKVxuICAgIGRlZmF1bHQ6IHJldHVybiAoRiwgeGkyeUYsIHgsIGkpID0+IHtcbiAgICAgIGxldCBuID0gb3MubGVuZ3RoXG4gICAgICB4aTJ5RiA9IGNsb3NlKHRvRnVuY3Rpb24ob3NbLS1uXSksIEYsIHhpMnlGKVxuICAgICAgd2hpbGUgKG9pMCA8IC0tbilcbiAgICAgICAgeGkyeUYgPSBjbG9zZSh0b0Z1bmN0aW9uKG9zW25dKSwgRiwgeGkyeUYpXG4gICAgICByZXR1cm4gcnVuKG9zW29pMF0sIEYsIHhpMnlGLCB4LCBpKVxuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBzZXRVKG8sIHgsIHMpIHtcbiAgc3dpdGNoICh0eXBlb2Ygbykge1xuICAgIGNhc2UgXCJzdHJpbmdcIjpcbiAgICAgIHJldHVybiBzZXRQcm9wKG8sIHgsIHMpXG4gICAgY2FzZSBcIm51bWJlclwiOlxuICAgICAgcmV0dXJuIHNldEluZGV4KG8sIHgsIHMpXG4gICAgY2FzZSBcImZ1bmN0aW9uXCI6XG4gICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKVxuICAgICAgICByZXFPcHRpYyhvKVxuICAgICAgcmV0dXJuIG8oSWRlbnQsIGFsd2F5cyh4KSwgcywgdm9pZCAwKVxuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gbW9kaWZ5Q29tcG9zZWQobywgYWx3YXlzKHgpLCBzKVxuICB9XG59XG5cbmZ1bmN0aW9uIGdldFUobCwgcykge1xuICBzd2l0Y2ggKHR5cGVvZiBsKSB7XG4gICAgY2FzZSBcInN0cmluZ1wiOlxuICAgICAgcmV0dXJuIGdldFByb3AobCwgcylcbiAgICBjYXNlIFwibnVtYmVyXCI6XG4gICAgICByZXR1cm4gZ2V0SW5kZXgobCwgcylcbiAgICBjYXNlIFwib2JqZWN0XCI6XG4gICAgICBmb3IgKGxldCBpPTAsIG49bC5sZW5ndGgsIG87IGk8bjsgKytpKVxuICAgICAgICBzd2l0Y2ggKHR5cGVvZiAobyA9IGxbaV0pKSB7XG4gICAgICAgICAgY2FzZSBcInN0cmluZ1wiOiBzID0gZ2V0UHJvcChvLCBzKTsgYnJlYWtcbiAgICAgICAgICBjYXNlIFwibnVtYmVyXCI6IHMgPSBnZXRJbmRleChvLCBzKTsgYnJlYWtcbiAgICAgICAgICBkZWZhdWx0OiBzID0gZ2V0VShvLCBzKTsgYnJlYWtcbiAgICAgICAgfVxuICAgICAgcmV0dXJuIHNcbiAgICBkZWZhdWx0OlxuICAgICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIilcbiAgICAgICAgcmVxT3B0aWMobClcbiAgICAgIHJldHVybiBsKENvbnN0LCBpZCwgcywgdm9pZCAwKVxuICB9XG59XG5cbmZ1bmN0aW9uIG1vZGlmeUNvbXBvc2VkKG9zLCB4aTJ4LCB4KSB7XG4gIGxldCBuID0gb3MubGVuZ3RoXG4gIGNvbnN0IHhzID0gQXJyYXkobilcbiAgZm9yIChsZXQgaT0wLCBvOyBpPG47ICsraSkge1xuICAgIHhzW2ldID0geFxuICAgIHN3aXRjaCAodHlwZW9mIChvID0gb3NbaV0pKSB7XG4gICAgICBjYXNlIFwic3RyaW5nXCI6XG4gICAgICAgIHggPSBnZXRQcm9wKG8sIHgpXG4gICAgICAgIGJyZWFrXG4gICAgICBjYXNlIFwibnVtYmVyXCI6XG4gICAgICAgIHggPSBnZXRJbmRleChvLCB4KVxuICAgICAgICBicmVha1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgeCA9IGNvbXBvc2VkKGksIG9zKShJZGVudCwgeGkyeCwgeCwgb3NbaS0xXSlcbiAgICAgICAgbiA9IGlcbiAgICAgICAgYnJlYWtcbiAgICB9XG4gIH1cbiAgaWYgKG4gPT09IG9zLmxlbmd0aClcbiAgICB4ID0geGkyeCh4LCBvc1tuLTFdKVxuICB3aGlsZSAoMCA8PSAtLW4pIHtcbiAgICBjb25zdCBvID0gb3Nbbl1cbiAgICBzd2l0Y2ggKHR5cGVvZiBvKSB7XG4gICAgICBjYXNlIFwic3RyaW5nXCI6IHggPSBzZXRQcm9wKG8sIHgsIHhzW25dKTsgYnJlYWtcbiAgICAgIGNhc2UgXCJudW1iZXJcIjogeCA9IHNldEluZGV4KG8sIHgsIHhzW25dKTsgYnJlYWtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHhcbn1cblxuLy9cblxuZnVuY3Rpb24gZ2V0UGljayh0ZW1wbGF0ZSwgeCkge1xuICBsZXQgclxuICBmb3IgKGNvbnN0IGsgaW4gdGVtcGxhdGUpIHtcbiAgICBjb25zdCB2ID0gZ2V0VSh0ZW1wbGF0ZVtrXSwgeClcbiAgICBpZiAodm9pZCAwICE9PSB2KSB7XG4gICAgICBpZiAoIXIpXG4gICAgICAgIHIgPSB7fVxuICAgICAgcltrXSA9IHZcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJcbn1cblxuY29uc3Qgc2V0UGljayA9ICh0ZW1wbGF0ZSwgeCkgPT4gdmFsdWUgPT4ge1xuICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiICYmXG4gICAgICAhKHZvaWQgMCA9PT0gdmFsdWUgfHwgdmFsdWUgaW5zdGFuY2VvZiBPYmplY3QpKVxuICAgIHRocm93IG5ldyBFcnJvcihcInBhcnRpYWwubGVuc2VzOiBgcGlja2AgbXVzdCBiZSBzZXQgd2l0aCB1bmRlZmluZWQgb3IgYW4gb2JqZWN0XCIpXG4gIGZvciAoY29uc3QgayBpbiB0ZW1wbGF0ZSlcbiAgICB4ID0gc2V0VSh0ZW1wbGF0ZVtrXSwgdmFsdWUgJiYgdmFsdWVba10sIHgpXG4gIHJldHVybiB4XG59XG5cbi8vXG5cbmNvbnN0IHNob3cgPSAobGFiZWxzLCBkaXIpID0+IHggPT5cbiAgY29uc29sZS5sb2cuYXBwbHkoY29uc29sZSwgbGFiZWxzLmNvbmNhdChbZGlyLCB4XSkpIHx8IHhcblxuZnVuY3Rpb24gYnJhbmNoT25NZXJnZSh4LCBrZXlzLCB4cykge1xuICBjb25zdCBvID0ge30sIG4gPSBrZXlzLmxlbmd0aFxuICBmb3IgKGxldCBpPTA7IGk8bjsgKytpLCB4cz14c1sxXSkge1xuICAgIGNvbnN0IHYgPSB4c1swXVxuICAgIG9ba2V5c1tpXV0gPSB2b2lkIDAgIT09IHYgPyB2IDogb1xuICB9XG4gIGxldCByXG4gIGlmICh4LmNvbnN0cnVjdG9yICE9PSBPYmplY3QpXG4gICAgeCA9IE9iamVjdC5hc3NpZ24oe30sIHgpXG4gIGZvciAoY29uc3QgayBpbiB4KSB7XG4gICAgY29uc3QgdiA9IG9ba11cbiAgICBpZiAobyAhPT0gdikge1xuICAgICAgb1trXSA9IG9cbiAgICAgIGlmICghcilcbiAgICAgICAgciA9IHt9XG4gICAgICByW2tdID0gdm9pZCAwICE9PSB2ID8gdiA6IHhba11cbiAgICB9XG4gIH1cbiAgZm9yIChsZXQgaT0wOyBpPG47ICsraSkge1xuICAgIGNvbnN0IGsgPSBrZXlzW2ldXG4gICAgY29uc3QgdiA9IG9ba11cbiAgICBpZiAobyAhPT0gdikge1xuICAgICAgaWYgKCFyKVxuICAgICAgICByID0ge31cbiAgICAgIHJba10gPSB2XG4gICAgfVxuICB9XG4gIHJldHVybiByXG59XG5cbmNvbnN0IGJyYW5jaE9uID0gKGtleXMsIHZhbHMpID0+IChBLCB4aTJ5QSwgeCwgXykgPT4ge1xuICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKVxuICAgIHJlcUFwcGxpY2F0aXZlKEEpXG4gIGNvbnN0IG4gPSBrZXlzLmxlbmd0aCwgb2YgPSBBLm9mXG4gIGlmICghbilcbiAgICByZXR1cm4gb2Yob2JqZWN0MFRvVW5kZWZpbmVkKHgpKVxuICBpZiAoISh4IGluc3RhbmNlb2YgT2JqZWN0KSlcbiAgICB4ID0gb2JqZWN0MFxuICBjb25zdCBhcCA9IEEuYXAsXG4gICAgICAgIHdhaXQgPSAoaSwgeHMpID0+IDAgPD0gaSA/IHggPT4gd2FpdChpLTEsIFt4LCB4c10pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IGJyYW5jaE9uTWVyZ2UoeCwga2V5cywgeHMpXG4gIGxldCB4c0EgPSBvZih3YWl0KG4tMSkpXG4gIGZvciAobGV0IGk9bi0xOyAwPD1pOyAtLWkpIHtcbiAgICBjb25zdCBrID0ga2V5c1tpXSwgdiA9IHhba11cbiAgICB4c0EgPSBhcCh4c0EsIHZhbHMgPyB2YWxzW2ldKEEsIHhpMnlBLCB2LCBrKSA6IHhpMnlBKHYsIGspKVxuICB9XG4gIHJldHVybiB4c0Fcbn1cblxuY29uc3Qgbm9ybWFsaXplciA9IHhpMnggPT4gKEYsIHhpMnlGLCB4LCBpKSA9PlxuICAoMCxGLm1hcCkoeCA9PiB4aTJ4KHgsIGkpLCB4aTJ5Rih4aTJ4KHgsIGkpLCBpKSlcblxuY29uc3QgcmVwbGFjZWQgPSAoaW5uLCBvdXQsIHgpID0+IGFjeWNsaWNFcXVhbHNVKHgsIGlubikgPyBvdXQgOiB4XG5cbmZ1bmN0aW9uIGZpbmRJbmRleCh4aTJiLCB4cykge1xuICBmb3IgKGxldCBpPTAsIG49eHMubGVuZ3RoOyBpPG47ICsraSlcbiAgICBpZiAoeGkyYih4c1tpXSwgaSkpXG4gICAgICByZXR1cm4gaVxuICByZXR1cm4gLTFcbn1cblxuZnVuY3Rpb24gcGFydGl0aW9uSW50b0luZGV4KHhpMmIsIHhzLCB0cywgZnMpIHtcbiAgZm9yIChsZXQgaT0wLCBuPXhzLmxlbmd0aCwgeDsgaTxuOyArK2kpXG4gICAgKHhpMmIoeCA9IHhzW2ldLCBpKSA/IHRzIDogZnMpLnB1c2goeClcbn1cblxuLy9cblxuZXhwb3J0IGZ1bmN0aW9uIHRvRnVuY3Rpb24obykge1xuICBzd2l0Y2ggKHR5cGVvZiBvKSB7XG4gICAgY2FzZSBcInN0cmluZ1wiOlxuICAgICAgcmV0dXJuIChGLCB4aTJ5RiwgeCwgXykgPT5cbiAgICAgICAgKDAsRi5tYXApKHYgPT4gc2V0UHJvcChvLCB2LCB4KSwgeGkyeUYoZ2V0UHJvcChvLCB4KSwgbykpXG4gICAgY2FzZSBcIm51bWJlclwiOlxuICAgICAgcmV0dXJuIChGLCB4aTJ5RiwgeHMsIF8pID0+XG4gICAgICAgICgwLEYubWFwKSh5ID0+IHNldEluZGV4KG8sIHksIHhzKSwgeGkyeUYoZ2V0SW5kZXgobywgeHMpLCBvKSlcbiAgICBjYXNlIFwiZnVuY3Rpb25cIjpcbiAgICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpXG4gICAgICAgIHJlcU9wdGljKG8pXG4gICAgICByZXR1cm4gb1xuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gY29tcG9zZWQoMCwgbylcbiAgfVxufVxuXG4vLyBPcGVyYXRpb25zIG9uIG9wdGljc1xuXG5leHBvcnQgY29uc3QgbW9kaWZ5ID0gY3VycnkoKG8sIHhpMngsIHMpID0+IHtcbiAgc3dpdGNoICh0eXBlb2Ygbykge1xuICAgIGNhc2UgXCJzdHJpbmdcIjpcbiAgICAgIHJldHVybiBzZXRQcm9wKG8sIHhpMngoZ2V0UHJvcChvLCBzKSwgbyksIHMpXG4gICAgY2FzZSBcIm51bWJlclwiOlxuICAgICAgcmV0dXJuIHNldEluZGV4KG8sIHhpMngoZ2V0SW5kZXgobywgcyksIG8pLCBzKVxuICAgIGNhc2UgXCJmdW5jdGlvblwiOlxuICAgICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIilcbiAgICAgICAgcmVxT3B0aWMobylcbiAgICAgIHJldHVybiBvKElkZW50LCB4aTJ4LCBzLCB2b2lkIDApXG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBtb2RpZnlDb21wb3NlZChvLCB4aTJ4LCBzKVxuICB9XG59KVxuXG5leHBvcnQgY29uc3QgcmVtb3ZlID0gY3VycnkoKG8sIHMpID0+IHNldFUobywgdm9pZCAwLCBzKSlcblxuZXhwb3J0IGNvbnN0IHNldCA9IGN1cnJ5KHNldFUpXG5cbi8vIE5lc3RpbmdcblxuZXhwb3J0IGZ1bmN0aW9uIGNvbXBvc2UoKSB7XG4gIHN3aXRjaCAoYXJndW1lbnRzLmxlbmd0aCkge1xuICAgIGNhc2UgMDogcmV0dXJuIGlkZW50aXR5XG4gICAgY2FzZSAxOiByZXR1cm4gYXJndW1lbnRzWzBdXG4gICAgZGVmYXVsdDoge1xuICAgICAgY29uc3QgbiA9IGFyZ3VtZW50cy5sZW5ndGgsIGxlbnNlcyA9IEFycmF5KG4pXG4gICAgICBmb3IgKGxldCBpPTA7IGk8bjsgKytpKVxuICAgICAgICBsZW5zZXNbaV0gPSBhcmd1bWVudHNbaV1cbiAgICAgIHJldHVybiBsZW5zZXNcbiAgICB9XG4gIH1cbn1cblxuLy8gUXVlcnlpbmdcblxuZXhwb3J0IGNvbnN0IGNoYWluID0gY3VycnkoKHhpMnlPLCB4TykgPT5cbiAgW3hPLCBjaG9vc2UoKHhNLCBpKSA9PiB2b2lkIDAgIT09IHhNID8geGkyeU8oeE0sIGkpIDogemVybyldKVxuXG5leHBvcnQgY29uc3QgY2hvaWNlID0gKC4uLmxzKSA9PiBjaG9vc2UoeCA9PiB7XG4gIGNvbnN0IGkgPSBmaW5kSW5kZXgobCA9PiB2b2lkIDAgIT09IGdldFUobCwgeCksIGxzKVxuICByZXR1cm4gaSA8IDAgPyB6ZXJvIDogbHNbaV1cbn0pXG5cbmV4cG9ydCBjb25zdCBjaG9vc2UgPSB4aU0ybyA9PiAoQywgeGkyeUMsIHgsIGkpID0+XG4gIHJ1bih4aU0ybyh4LCBpKSwgQywgeGkyeUMsIHgsIGkpXG5cbmV4cG9ydCBjb25zdCB3aGVuID0gcCA9PiAoQywgeGkyeUMsIHgsIGkpID0+XG4gIHAoeCwgaSkgPyB4aTJ5Qyh4LCBpKSA6IHplcm8oQywgeGkyeUMsIHgsIGkpXG5cbmV4cG9ydCBjb25zdCBvcHRpb25hbCA9IHdoZW4oaXNEZWZpbmVkKVxuXG5leHBvcnQgZnVuY3Rpb24gemVybyhDLCB4aTJ5QywgeCwgaSkge1xuICBjb25zdCBvZiA9IEMub2ZcbiAgcmV0dXJuIG9mID8gb2YoeCkgOiAoMCxDLm1hcCkoYWx3YXlzKHgpLCB4aTJ5Qyh2b2lkIDAsIGkpKVxufVxuXG4vLyBSZWN1cnNpbmdcblxuZXhwb3J0IGZ1bmN0aW9uIGxhenkobzJvKSB7XG4gIGxldCBtZW1vID0gKEMsIHhpMnlDLCB4LCBpKSA9PiAobWVtbyA9IHRvRnVuY3Rpb24obzJvKHJlYykpKShDLCB4aTJ5QywgeCwgaSlcbiAgZnVuY3Rpb24gcmVjKEMsIHhpMnlDLCB4LCBpKSB7cmV0dXJuIG1lbW8oQywgeGkyeUMsIHgsIGkpfVxuICByZXR1cm4gcmVjXG59XG5cbi8vIERlYnVnZ2luZ1xuXG5leHBvcnQgY29uc3QgbG9nID0gKC4uLmxhYmVscykgPT4gaXNvKHNob3cobGFiZWxzLCBcImdldFwiKSwgc2hvdyhsYWJlbHMsIFwic2V0XCIpKVxuXG4vLyBPcGVyYXRpb25zIG9uIHRyYXZlcnNhbHNcblxuZXhwb3J0IGNvbnN0IGNvbmNhdEFzID0gY29uc3RBcyhtID0+IFRhY25vY09mKCgwLG0uZW1wdHkpKCksIGZsaXAobS5jb25jYXQpKSlcblxuZXhwb3J0IGNvbnN0IGNvbmNhdCA9IGNvbmNhdEFzKGlkKVxuXG5leHBvcnQgY29uc3QgbWVyZ2VBcyA9IGNvbnN0QXMobSA9PiBUYWNub2NPZigoMCxtLmVtcHR5KSgpLCBtLmNvbmNhdCkpXG5cbmV4cG9ydCBjb25zdCBtZXJnZSA9IG1lcmdlQXMoaWQpXG5cbi8vIEZvbGRzIG92ZXIgdHJhdmVyc2Fsc1xuXG5leHBvcnQgY29uc3QgY29sbGVjdEFzID0gY3VycnkoKHhpMnksIHQsIHMpID0+XG4gIHRvQXJyYXkocnVuKHQsIENvbGxlY3QsIHhpMnksIHMpKSB8fCBbXSlcblxuZXhwb3J0IGNvbnN0IGNvbGxlY3QgPSBjb2xsZWN0QXMoaWQpXG5cbmV4cG9ydCBjb25zdCBmb2xkbCA9IGN1cnJ5KChmLCByLCB0LCBzKSA9PlxuICBmb2xkKGYsIHIsIHJ1bih0LCBDb2xsZWN0LCBwYWlyLCBzKSkpXG5cbmV4cG9ydCBjb25zdCBmb2xkciA9IGN1cnJ5KChmLCByLCB0LCBzKSA9PiB7XG4gIGNvbnN0IHhzID0gY29sbGVjdEFzKHBhaXIsIHQsIHMpXG4gIGZvciAobGV0IGk9eHMubGVuZ3RoLTE7IDA8PWk7IC0taSkge1xuICAgIGNvbnN0IHggPSB4c1tpXVxuICAgIHIgPSBmKHIsIHhbMF0sIHhbMV0pXG4gIH1cbiAgcmV0dXJuIHJcbn0pXG5cbmV4cG9ydCBjb25zdCBtYXhpbXVtID0gbWVyZ2UoTXVtKCh4LCB5KSA9PiB4ID4geSkpXG5cbmV4cG9ydCBjb25zdCBtaW5pbXVtID0gbWVyZ2UoTXVtKCh4LCB5KSA9PiB4IDwgeSkpXG5cbmV4cG9ydCBjb25zdCBwcm9kdWN0ID0gbWVyZ2VBcyh1bnRvKDEpLCBNb25vaWQoMSwgKHksIHgpID0+IHggKiB5KSlcblxuZXhwb3J0IGNvbnN0IHN1bSA9IG1lcmdlQXModW50bygwKSwgTW9ub2lkKDAsICh5LCB4KSA9PiB4ICsgeSkpXG5cbi8vIENyZWF0aW5nIG5ldyB0cmF2ZXJzYWxzXG5cbmV4cG9ydCBmdW5jdGlvbiBicmFuY2godGVtcGxhdGUpIHtcbiAgY29uc3Qga2V5cyA9IFtdLCB2YWxzID0gW11cbiAgZm9yIChjb25zdCBrIGluIHRlbXBsYXRlKSB7XG4gICAga2V5cy5wdXNoKGspXG4gICAgdmFscy5wdXNoKHRvRnVuY3Rpb24odGVtcGxhdGVba10pKVxuICB9XG4gIHJldHVybiBicmFuY2hPbihrZXlzLCB2YWxzKVxufVxuXG4vLyBUcmF2ZXJzYWxzIGFuZCBjb21iaW5hdG9yc1xuXG5leHBvcnQgZnVuY3Rpb24gZWxlbXMoQSwgeGkyeUEsIHhzLCBfKSB7XG4gIGlmIChzZWVtc0FycmF5TGlrZSh4cykpIHtcbiAgICByZXR1cm4gQSA9PT0gSWRlbnRcbiAgICAgID8gbWFwUGFydGlhbEluZGV4VSh4aTJ5QSwgeHMpXG4gICAgICA6IHRyYXZlcnNlUGFydGlhbEluZGV4KEEsIHhpMnlBLCB4cylcbiAgfSBlbHNlIHtcbiAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKVxuICAgICAgcmVxQXBwbGljYXRpdmUoQSlcbiAgICByZXR1cm4gKDAsQS5vZikoeHMpXG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHZhbHVlcyhBLCB4aTJ5QSwgeHMsIF8pIHtcbiAgaWYgKHhzIGluc3RhbmNlb2YgT2JqZWN0KSB7XG4gICAgcmV0dXJuIGJyYW5jaE9uKGtleXMoeHMpKShBLCB4aTJ5QSwgeHMpXG4gIH0gZWxzZSB7XG4gICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIilcbiAgICAgIHJlcUFwcGxpY2F0aXZlKEEpXG4gICAgcmV0dXJuICgwLEEub2YpKHhzKVxuICB9XG59XG5cbi8vIE9wZXJhdGlvbnMgb24gbGVuc2VzXG5cbmV4cG9ydCBjb25zdCBnZXQgPSBjdXJyeShnZXRVKVxuXG4vLyBDcmVhdGluZyBuZXcgbGVuc2VzXG5cbmV4cG9ydCBjb25zdCBsZW5zID0gY3VycnkoKGdldCwgc2V0KSA9PiAoRiwgeGkyeUYsIHgsIGkpID0+XG4gICgwLEYubWFwKSh5ID0+IHNldCh5LCB4LCBpKSwgeGkyeUYoZ2V0KHgsIGkpLCBpKSkpXG5cbi8vIENvbXB1dGluZyBkZXJpdmVkIHByb3BzXG5cbmV4cG9ydCBjb25zdCBhdWdtZW50ID0gdGVtcGxhdGUgPT4ge1xuICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiICYmICFpc09iamVjdCh0ZW1wbGF0ZSkpXG4gICAgdGhyb3cgbmV3IEVycm9yKFwicGFydGlhbC5sZW5zZXM6IGBhdWdtZW50YCBleHBlY3RzIGEgcGxhaW4gT2JqZWN0IHRlbXBsYXRlXCIpXG4gIHJldHVybiBsZW5zKFxuICAgIHggPT4ge1xuICAgICAgeCA9IGRpc3NvY1BhcnRpYWxVKDAsIHgpXG4gICAgICBpZiAoeClcbiAgICAgICAgZm9yIChjb25zdCBrIGluIHRlbXBsYXRlKVxuICAgICAgICAgIHhba10gPSB0ZW1wbGF0ZVtrXSh4KVxuICAgICAgcmV0dXJuIHhcbiAgICB9LFxuICAgICh5LCB4KSA9PiB7XG4gICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiICYmXG4gICAgICAgICAgISh2b2lkIDAgPT09IHkgfHwgeSBpbnN0YW5jZW9mIE9iamVjdCkpXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcInBhcnRpYWwubGVuc2VzOiBgYXVnbWVudGAgbXVzdCBiZSBzZXQgd2l0aCB1bmRlZmluZWQgb3IgYW4gb2JqZWN0XCIpXG4gICAgICBpZiAoeSAmJiB5LmNvbnN0cnVjdG9yICE9PSBPYmplY3QpXG4gICAgICAgIHkgPSBPYmplY3QuYXNzaWduKHt9LCB5KVxuICAgICAgaWYgKCEoeCBpbnN0YW5jZW9mIE9iamVjdCkpXG4gICAgICAgIHggPSB2b2lkIDBcbiAgICAgIGxldCB6XG4gICAgICBmdW5jdGlvbiBzZXQoaywgdikge1xuICAgICAgICBpZiAoIXopXG4gICAgICAgICAgeiA9IHt9XG4gICAgICAgIHpba10gPSB2XG4gICAgICB9XG4gICAgICBmb3IgKGNvbnN0IGsgaW4geSkge1xuICAgICAgICBpZiAoIShrIGluIHRlbXBsYXRlKSlcbiAgICAgICAgICBzZXQoaywgeVtrXSlcbiAgICAgICAgZWxzZVxuICAgICAgICAgIGlmICh4ICYmIGsgaW4geClcbiAgICAgICAgICAgIHNldChrLCB4W2tdKVxuICAgICAgfVxuICAgICAgcmV0dXJuIHpcbiAgICB9KVxufVxuXG4vLyBFbmZvcmNpbmcgaW52YXJpYW50c1xuXG5leHBvcnQgY29uc3QgZGVmYXVsdHMgPSBvdXQgPT4ge1xuICBjb25zdCBvMnUgPSB4ID0+IHJlcGxhY2VkKG91dCwgdm9pZCAwLCB4KVxuICByZXR1cm4gKEYsIHhpMnlGLCB4LCBpKSA9PiAoMCxGLm1hcCkobzJ1LCB4aTJ5Rih2b2lkIDAgIT09IHggPyB4IDogb3V0LCBpKSlcbn1cblxuZXhwb3J0IGNvbnN0IHJlcXVpcmVkID0gaW5uID0+IHJlcGxhY2UoaW5uLCB2b2lkIDApXG5cbmV4cG9ydCBjb25zdCBkZWZpbmUgPSB2ID0+IG5vcm1hbGl6ZXIodW50byh2KSlcblxuZXhwb3J0IGNvbnN0IG5vcm1hbGl6ZSA9IHhpMnggPT5cbiAgbm9ybWFsaXplcigoeCwgaSkgPT4gdm9pZCAwICE9PSB4ID8geGkyeCh4LCBpKSA6IHZvaWQgMClcblxuZXhwb3J0IGNvbnN0IHJld3JpdGUgPSB5aTJ5ID0+IChGLCB4aTJ5RiwgeCwgaSkgPT5cbiAgKDAsRi5tYXApKHkgPT4gdm9pZCAwICE9PSB5ID8geWkyeSh5LCBpKSA6IHZvaWQgMCwgeGkyeUYoeCwgaSkpXG5cbi8vIExlbnNpbmcgYXJyYXlzXG5cbmV4cG9ydCBjb25zdCBhcHBlbmQgPSAoRiwgeGkyeUYsIHhzLCBpKSA9PlxuICAoMCxGLm1hcCkoeCA9PiBzZXRJbmRleChzZWVtc0FycmF5TGlrZSh4cykgPyB4cy5sZW5ndGggOiAwLCB4LCB4cyksXG4gICAgICAgICAgICB4aTJ5Rih2b2lkIDAsIGkpKVxuXG5leHBvcnQgY29uc3QgZmlsdGVyID0geGkyYiA9PiAoRiwgeGkyeUYsIHhzLCBpKSA9PiB7XG4gIGxldCB0cywgZnNcbiAgaWYgKHNlZW1zQXJyYXlMaWtlKHhzKSlcbiAgICBwYXJ0aXRpb25JbnRvSW5kZXgoeGkyYiwgeHMsIHRzID0gW10sIGZzID0gW10pXG4gIHJldHVybiAoMCxGLm1hcCkoXG4gICAgdHMgPT4ge1xuICAgICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIiAmJlxuICAgICAgICAgICEodm9pZCAwID09PSB0cyB8fCBzZWVtc0FycmF5TGlrZSh0cykpKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJwYXJ0aWFsLmxlbnNlczogYGZpbHRlcmAgbXVzdCBiZSBzZXQgd2l0aCB1bmRlZmluZWQgb3IgYW4gYXJyYXktbGlrZSBvYmplY3RcIilcbiAgICAgIGNvbnN0IHRzTiA9IHRzID8gdHMubGVuZ3RoIDogMCxcbiAgICAgICAgICAgIGZzTiA9IGZzID8gZnMubGVuZ3RoIDogMCxcbiAgICAgICAgICAgIG4gPSB0c04gKyBmc05cbiAgICAgIGlmIChuKVxuICAgICAgICByZXR1cm4gbiA9PT0gZnNOXG4gICAgICAgID8gZnNcbiAgICAgICAgOiBjb3B5VG9Gcm9tKGNvcHlUb0Zyb20oQXJyYXkobiksIDAsIHRzLCAwLCB0c04pLCB0c04sIGZzLCAwLCBmc04pXG4gICAgfSxcbiAgICB4aTJ5Rih0cywgaSkpXG59XG5cbmV4cG9ydCBjb25zdCBmaW5kID0geGkyYiA9PiBjaG9vc2UoeHMgPT4ge1xuICBpZiAoIXNlZW1zQXJyYXlMaWtlKHhzKSlcbiAgICByZXR1cm4gMFxuICBjb25zdCBpID0gZmluZEluZGV4KHhpMmIsIHhzKVxuICByZXR1cm4gaSA8IDAgPyBhcHBlbmQgOiBpXG59KVxuXG5leHBvcnQgZnVuY3Rpb24gZmluZFdpdGgoLi4ubHMpIHtcbiAgY29uc3QgbGxzID0gY29tcG9zZSguLi5scylcbiAgcmV0dXJuIFtmaW5kKHggPT4gdm9pZCAwICE9PSBnZXRVKGxscywgeCkpLCBsbHNdXG59XG5cbmV4cG9ydCBjb25zdCBpbmRleCA9IHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSBcInByb2R1Y3Rpb25cIiA/IGlkIDogeCA9PiB7XG4gIGlmICghTnVtYmVyLmlzSW50ZWdlcih4KSB8fCB4IDwgMClcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJwYXJ0aWFsLmxlbnNlczogYGluZGV4YCBleHBlY3RzIGEgbm9uLW5lZ2F0aXZlIGludGVnZXIuXCIpXG4gIHJldHVybiB4XG59XG5cbmV4cG9ydCBjb25zdCBzbGljZSA9IGN1cnJ5KChiZWdpbiwgZW5kKSA9PiAoRiwgeHNpMnlGLCB4cywgaSkgPT4ge1xuICBjb25zdCBzZWVtcyA9IHNlZW1zQXJyYXlMaWtlKHhzKSxcbiAgICAgICAgeHNOID0gc2VlbXMgJiYgeHMubGVuZ3RoLFxuICAgICAgICBiID0gc2xpY2VJbmRleCgwLCB4c04sIDAsIGJlZ2luKSxcbiAgICAgICAgZSA9IHNsaWNlSW5kZXgoYiwgeHNOLCB4c04sIGVuZClcbiAgcmV0dXJuICgwLEYubWFwKShcbiAgICB6cyA9PiB7XG4gICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiICYmXG4gICAgICAgICAgISh2b2lkIDAgPT09IHpzIHx8IHNlZW1zQXJyYXlMaWtlKHpzKSkpXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcInBhcnRpYWwubGVuc2VzOiBgc2xpY2VgIG11c3QgYmUgc2V0IHdpdGggdW5kZWZpbmVkIG9yIGFuIGFycmF5LWxpa2Ugb2JqZWN0XCIpXG4gICAgICBjb25zdCB6c04gPSB6cyA/IHpzLmxlbmd0aCA6IDAsIGJQenNOID0gYiArIHpzTiwgbiA9IHhzTiAtIGUgKyBiUHpzTlxuICAgICAgcmV0dXJuIG5cbiAgICAgICAgPyBjb3B5VG9Gcm9tKGNvcHlUb0Zyb20oY29weVRvRnJvbShBcnJheShuKSwgMCwgeHMsIDAsIGIpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB6cywgMCwgenNOKSxcbiAgICAgICAgICAgICAgICAgICAgIGJQenNOLFxuICAgICAgICAgICAgICAgICAgICAgeHMsIGUsIHhzTilcbiAgICAgICAgOiB2b2lkIDBcbiAgICB9LFxuICAgIHhzaTJ5RihzZWVtcyA/IGNvcHlUb0Zyb20oQXJyYXkoTWF0aC5tYXgoMCwgZSAtIGIpKSwgMCwgeHMsIGIsIGUpIDpcbiAgICAgICAgICAgdm9pZCAwLFxuICAgICAgICAgICBpKSlcbn0pXG5cbi8vIExlbnNpbmcgb2JqZWN0c1xuXG5leHBvcnQgY29uc3QgcHJvcCA9IHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSBcInByb2R1Y3Rpb25cIiA/IGlkIDogeCA9PiB7XG4gIGlmICh0eXBlb2YgeCAhPT0gXCJzdHJpbmdcIilcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJwYXJ0aWFsLmxlbnNlczogYHByb3BgIGV4cGVjdHMgYSBzdHJpbmcuXCIpXG4gIHJldHVybiB4XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwcm9wcygpIHtcbiAgY29uc3QgbiA9IGFyZ3VtZW50cy5sZW5ndGgsIHRlbXBsYXRlID0ge31cbiAgZm9yIChsZXQgaT0wLCBrOyBpPG47ICsraSlcbiAgICB0ZW1wbGF0ZVtrID0gYXJndW1lbnRzW2ldXSA9IGtcbiAgcmV0dXJuIHBpY2sodGVtcGxhdGUpXG59XG5cbi8vIFByb3ZpZGluZyBkZWZhdWx0c1xuXG5leHBvcnQgY29uc3QgdmFsdWVPciA9IHYgPT4gKF9GLCB4aTJ5RiwgeCwgaSkgPT5cbiAgeGkyeUYodm9pZCAwICE9PSB4ICYmIHggIT09IG51bGwgPyB4IDogdiwgaSlcblxuLy8gQWRhcHRpbmcgdG8gZGF0YVxuXG5leHBvcnQgY29uc3Qgb3JFbHNlID1cbiAgY3VycnkoKGQsIGwpID0+IGNob29zZSh4ID0+IHZvaWQgMCAhPT0gZ2V0VShsLCB4KSA/IGwgOiBkKSlcblxuLy8gUmVhZC1vbmx5IG1hcHBpbmdcblxuZXhwb3J0IGNvbnN0IHRvID0gd2kyeCA9PiAoRiwgeGkyeUYsIHcsIGkpID0+XG4gICgwLEYubWFwKShhbHdheXModyksIHhpMnlGKHdpMngodywgaSksIGkpKVxuXG5leHBvcnQgY29uc3QganVzdCA9IHggPT4gdG8oYWx3YXlzKHgpKVxuXG4vLyBUcmFuc2Zvcm1pbmcgZGF0YVxuXG5leHBvcnQgY29uc3QgcGljayA9IHRlbXBsYXRlID0+IHtcbiAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIiAmJiAhaXNPYmplY3QodGVtcGxhdGUpKVxuICAgIHRocm93IG5ldyBFcnJvcihcInBhcnRpYWwubGVuc2VzOiBgcGlja2AgZXhwZWN0cyBhIHBsYWluIE9iamVjdCB0ZW1wbGF0ZVwiKVxuICByZXR1cm4gKEYsIHhpMnlGLCB4LCBpKSA9PlxuICAgICgwLEYubWFwKShzZXRQaWNrKHRlbXBsYXRlLCB4KSwgeGkyeUYoZ2V0UGljayh0ZW1wbGF0ZSwgeCksIGkpKVxufVxuXG5leHBvcnQgY29uc3QgcmVwbGFjZSA9IGN1cnJ5KChpbm4sIG91dCkgPT4ge1xuICBjb25zdCBvMmkgPSB4ID0+IHJlcGxhY2VkKG91dCwgaW5uLCB4KVxuICByZXR1cm4gKEYsIHhpMnlGLCB4LCBpKSA9PiAoMCxGLm1hcCkobzJpLCB4aTJ5RihyZXBsYWNlZChpbm4sIG91dCwgeCksIGkpKVxufSlcblxuLy8gT3BlcmF0aW9ucyBvbiBpc29tb3JwaGlzbXNcblxuZXhwb3J0IGNvbnN0IGdldEludmVyc2UgPSBhcml0eU4oMiwgc2V0VSlcblxuLy8gQ3JlYXRpbmcgbmV3IGlzb21vcnBoaXNtc1xuXG5leHBvcnQgY29uc3QgaXNvID1cbiAgY3VycnkoKGJ3ZCwgZndkKSA9PiAoRiwgeGkyeUYsIHgsIGkpID0+ICgwLEYubWFwKShmd2QsIHhpMnlGKGJ3ZCh4KSwgaSkpKVxuXG4vLyBJc29tb3JwaGlzbXMgYW5kIGNvbWJpbmF0b3JzXG5cbmV4cG9ydCBjb25zdCBpZGVudGl0eSA9IChfRiwgeGkyeUYsIHgsIGkpID0+IHhpMnlGKHgsIGkpXG5cbmV4cG9ydCBjb25zdCBpbnZlcnNlID0gaXNvID0+IChGLCB4aTJ5RiwgeCwgaSkgPT5cbiAgKDAsRi5tYXApKHggPT4gZ2V0VShpc28sIHgpLCB4aTJ5RihzZXRVKGlzbywgeCksIGkpKVxuIl19
