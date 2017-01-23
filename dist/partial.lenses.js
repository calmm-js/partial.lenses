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
  var ys = [],
      n = xs.length;
  for (var i = 0, y; i < n; ++i) {
    if (void 0 !== (y = xi2y(xs[i], i))) ys.push(y);
  }return ys.length ? ys : void 0;
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

function fromArrayLike(xs) {
  if (xs.constructor === Array) return xs;
  var n = xs.length;
  return copyToFrom(Array(n), 0, xs, 0, n);
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

var funProp = function funProp(k) {
  return function (F, xi2yF, x, _) {
    return (0, F.map)(function (v) {
      return setProp(k, v, x);
    }, xi2yF(getProp(k, x), k));
  };
};

//

function clearRange(xs, i, j) {
  while (i < j) {
    xs[i++] = null;
  }return xs;
}

var getIndex = function getIndex(i, xs) {
  return seemsArrayLike(xs) ? xs[i] : void 0;
};

function setIndex(i, x, xs) {
  if ("dev" !== "production" && i < 0) throw new Error("partial.lenses: Negative indices not supported");
  if (void 0 !== x) {
    if (!seemsArrayLike(xs)) return setAt(clearRange(Array(i + 1), 0, i), i, x);
    var n = xs.length;
    if (n <= i) return setAt(clearRange(copyToFrom(Array(i + 1), 0, xs, 0, n), n, i), i, x);
    var ys = Array(n);
    for (var j = 0; j < n; ++j) {
      ys[j] = xs[j];
    }ys[i] = x;
    return ys;
  } else {
    if (seemsArrayLike(xs)) {
      var _n = xs.length;
      if (0 < _n) {
        if (_n <= i) return fromArrayLike(xs);
        if (1 < _n) {
          var _ys = Array(_n - 1);
          for (var _j = 0; _j < i; ++_j) {
            _ys[_j] = xs[_j];
          }for (var _j2 = i + 1; _j2 < _n; ++_j2) {
            _ys[_j2 - 1] = xs[_j2];
          }return _ys;
        }
      }
    }
  }
}

var funIndex = function funIndex(i) {
  return function (F, xi2yF, xs, _) {
    return (0, F.map)(function (y) {
      return setIndex(i, y, xs);
    }, xi2yF(getIndex(i, xs), i));
  };
};

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

function getComposed(ls, s) {
  for (var i = 0, n = ls.length, l; i < n; ++i) {
    switch (typeof (l = ls[i])) {
      case "string":
        s = getProp(l, s);break;
      case "number":
        s = getIndex(l, s);break;
      default:
        return composed(i, ls)(Const, _infestines.id, s, ls[i - 1]);
    }
  }return s;
}

function getU(l, s) {
  switch (typeof l) {
    case "string":
      return getProp(l, s);
    case "number":
      return getIndex(l, s);
    case "function":
      if ("dev" !== "production") reqOptic(l);
      return l(Const, _infestines.id, s, void 0);
    default:
      return getComposed(l, s);
  }
}

function modifyComposed(os, xi2x, x) {
  var n = os.length;
  var xs = [];
  for (var i = 0, o; i < n; ++i) {
    xs.push(x);
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
    if (!(0, _infestines.isObject)(value)) value = void 0;
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
      return funProp(o);
    case "number":
      return funIndex(o);
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
  return lens(function (x) {
    x = (0, _infestines.dissocPartialU)(0, x);
    if (x) for (var k in template) {
      x[k] = template[k](x);
    }return x;
  }, function (y, x) {
    if ((0, _infestines.isObject)(y)) {
      var _ret = function () {
        if (!(x instanceof Object)) x = void 0;
        var z = void 0;
        var set = function set(k, v) {
          if (!z) z = {};
          z[k] = v;
        };
        for (var k in y) {
          if (!(k in template)) set(k, y[k]);else if (x && k in x) set(k, x[k]);
        }
        return {
          v: z
        };
      }();

      if (typeof _ret === "object") return _ret.v;
    }
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
      var zsN = zs ? zs.length : 0,
          bPzsN = b + zsN,
          n = xsN - e + bPzsN;
      return n ? copyToFrom(copyToFrom(copyToFrom(Array(n), 0, xs, 0, b), b, zs, 0, zsN), bPzsN, xs, e, xsN) : undefined;
    }, xsi2yF(seems ? copyToFrom(Array(Math.max(0, e - b)), 0, xs, b, e) : undefined, i));
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvcGFydGlhbC5sZW5zZXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7UUNvWmdCLFUsR0FBQSxVO1FBc0NBLE8sR0FBQSxPO1FBK0JBLEksR0FBQSxJO1FBT0EsSSxHQUFBLEk7UUFpREEsTSxHQUFBLE07UUFXQSxLLEdBQUEsSztRQVlBLE0sR0FBQSxNO1FBaUdBLFEsR0FBQSxRO1FBd0NBLEssR0FBQSxLOztBQWpyQmhCOztBQWlCQTs7QUFFQSxJQUFNLGFBQWEsU0FBYixVQUFhLENBQUMsQ0FBRCxFQUFJLENBQUosRUFBTyxDQUFQLEVBQVUsQ0FBVjtBQUFBLFNBQ2pCLEtBQUssQ0FBTCxLQUFXLENBQVgsR0FBZSxDQUFmLEdBQW1CLEtBQUssR0FBTCxDQUFTLEtBQUssR0FBTCxDQUFTLENBQVQsRUFBWSxJQUFJLENBQUosR0FBUSxJQUFJLENBQVosR0FBZ0IsQ0FBNUIsQ0FBVCxFQUF5QyxDQUF6QyxDQURGO0FBQUEsQ0FBbkI7O0FBR0EsU0FBUyxJQUFULENBQWMsRUFBZCxFQUFrQixFQUFsQixFQUFzQjtBQUFDLFNBQU8sQ0FBQyxFQUFELEVBQUssRUFBTCxDQUFQO0FBQWdCOztBQUV2QyxJQUFNLE9BQU8sU0FBUCxJQUFPO0FBQUEsU0FBTyxVQUFDLENBQUQsRUFBSSxDQUFKO0FBQUEsV0FBVSxJQUFJLENBQUosRUFBTyxDQUFQLENBQVY7QUFBQSxHQUFQO0FBQUEsQ0FBYjs7QUFFQSxJQUFNLE9BQU8sU0FBUCxJQUFPO0FBQUEsU0FBSztBQUFBLFdBQUssS0FBSyxDQUFMLEtBQVcsQ0FBWCxHQUFlLENBQWYsR0FBbUIsQ0FBeEI7QUFBQSxHQUFMO0FBQUEsQ0FBYjs7QUFFQSxJQUFNLFFBQVEsU0FBUixLQUFRO0FBQUEsU0FBSyxNQUFPLEtBQUssQ0FBWixJQUFrQixLQUFLLENBQTVCO0FBQUEsQ0FBZDs7QUFFQSxJQUFNLGlCQUFpQixTQUFq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ZDtBQUFBLENBQU4sQ0FESzs7QUFHUDs7QUFFTyxJQUFNLDhCQUFXLFNBQVgsUUFBVyxDQUFDLEVBQUQsRUFBSyxLQUFMLEVBQVksQ0FBWixFQUFlLENBQWY7QUFBQSxTQUFxQixNQUFNLENBQU4sRUFBUyxDQUFULENBQXJCO0FBQUEsQ0FBakI7O0FBRUEsSUFBTSw0QkFBVSxTQUFWLE9BQVU7QUFBQSxTQUFPLFVBQUMsQ0FBRCxFQUFJLEtBQUosRUFBVyxDQUFYLEVBQWMsQ0FBZDtBQUFBLFdBQzVCLENBQUMsR0FBRSxFQUFFLEdBQUwsRUFBVTtBQUFBLGFBQUssS0FBSyxHQUFMLEVBQVUsQ0FBVixDQUFMO0FBQUEsS0FBVixFQUE2QixNQUFNLEtBQUssR0FBTCxFQUFVLENBQVYsQ0FBTixFQUFvQixDQUFwQixDQUE3QixDQUQ0QjtBQUFBLEdBQVA7QUFBQSxDQUFoQiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQge1xuICBhY3ljbGljRXF1YWxzVSxcbiAgYWx3YXlzLFxuICBhcHBseVUsXG4gIGFyaXR5TixcbiAgYXNzb2NQYXJ0aWFsVSxcbiAgY3VycnksXG4gIGN1cnJ5TixcbiAgZGlzc29jUGFydGlhbFUsXG4gIGlkLFxuICBpc0RlZmluZWQsXG4gIGlzT2JqZWN0LFxuICBrZXlzLFxuICBvYmplY3QwLFxuICBzbmRVXG59IGZyb20gXCJpbmZlc3RpbmVzXCJcblxuLy9cblxuY29uc3Qgc2xpY2VJbmRleCA9IChtLCBsLCBkLCBpKSA9PlxuICB2b2lkIDAgPT09IGkgPyBkIDogTWF0aC5taW4oTWF0aC5tYXgobSwgaSA8IDAgPyBsICsgaSA6IGkpLCBsKVxuXG5mdW5jdGlvbiBwYWlyKHgwLCB4MSkge3JldHVybiBbeDAsIHgxXX1cblxuY29uc3QgZmxpcCA9IGJvcCA9PiAoeCwgeSkgPT4gYm9wKHksIHgpXG5cbmNvbnN0IHVudG8gPSBjID0+IHggPT4gdm9pZCAwICE9PSB4ID8geCA6IGNcblxuY29uc3QgaXNOYXQgPSB4ID0+IHggPT09ICh4ID4+IDApICYmIDAgPD0geFxuXG5jb25zdCBzZWVtc0FycmF5TGlrZSA9IHggPT5cbiAgeCBpbnN0YW5jZW9mIE9iamVjdCAmJiBpc05hdCh4Lmxlbmd0aCkgfHwgdHlwZW9mIHggPT09IFwic3RyaW5nXCJcblxuLy9cblxuZnVuY3Rpb24gbWFwUGFydGlhbEluZGV4VSh4aTJ5LCB4cykge1xuICBjb25zdCB5cyA9IFtdLCBuPXhzLmxlbmd0aFxuICBmb3IgKGxldCBpPTAsIHk7IGk8bjsgKytpKVxuICAgIGlmICh2b2lkIDAgIT09ICh5ID0geGkyeSh4c1tpXSwgaSkpKVxuICAgICAgeXMucHVzaCh5KVxuICByZXR1cm4geXMubGVuZ3RoID8geXMgOiB2b2lkIDBcbn1cblxuZnVuY3Rpb24gY29weVRvRnJvbSh5cywgaywgeHMsIGksIGopIHtcbiAgd2hpbGUgKGkgPCBqKVxuICAgIHlzW2srK10gPSB4c1tpKytdXG4gIHJldHVybiB5c1xufVxuXG5mdW5jdGlvbiBzZXRBdCh4cywgaSwgeCkge1xuICB4c1tpXSA9IHhcbiAgcmV0dXJuIHhzXG59XG5cbmZ1bmN0aW9uIGZyb21BcnJheUxpa2UoeHMpIHtcbiAgaWYgKHhzLmNvbnN0cnVjdG9yID09PSBBcnJheSlcbiAgICByZXR1cm4geHNcbiAgY29uc3QgbiA9IHhzLmxlbmd0aFxuICByZXR1cm4gY29weVRvRnJvbShBcnJheShuKSwgMCwgeHMsIDAsIG4pXG59XG5cbi8vXG5cbmNvbnN0IEFwcGxpY2F0aXZlID0gKG1hcCwgb2YsIGFwKSA9PiAoe21hcCwgb2YsIGFwfSlcblxuY29uc3QgSWRlbnQgPSBBcHBsaWNhdGl2ZShhcHBseVUsIGlkLCBhcHBseVUpXG5cbmNvbnN0IENvbnN0ID0ge21hcDogc25kVX1cblxuY29uc3QgVGFjbm9jT2YgPSAoZW1wdHksIHRhY25vYykgPT4gQXBwbGljYXRpdmUoc25kVSwgYWx3YXlzKGVtcHR5KSwgdGFjbm9jKVxuXG5jb25zdCBNb25vaWQgPSAoZW1wdHksIGNvbmNhdCkgPT4gKHtlbXB0eTogKCkgPT4gZW1wdHksIGNvbmNhdH0pXG5cbmNvbnN0IE11bSA9IG9yZCA9PlxuICBNb25vaWQodm9pZCAwLCAoeSwgeCkgPT4gdm9pZCAwICE9PSB4ICYmICh2b2lkIDAgPT09IHkgfHwgb3JkKHgsIHkpKSA/IHggOiB5KVxuXG4vL1xuXG5jb25zdCBydW4gPSAobywgQywgeGkyeUMsIHMsIGkpID0+IHRvRnVuY3Rpb24obykoQywgeGkyeUMsIHMsIGkpXG5cbmNvbnN0IGNvbnN0QXMgPSB0b0NvbnN0ID0+IGN1cnJ5Tig0LCAoeE1pMnksIG0pID0+IHtcbiAgY29uc3QgQyA9IHRvQ29uc3QobSlcbiAgcmV0dXJuICh0LCBzKSA9PiBydW4odCwgQywgeE1pMnksIHMpXG59KVxuXG4vL1xuXG5mdW5jdGlvbiByZXFBcHBsaWNhdGl2ZShmKSB7XG4gIGlmICghZi5vZilcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJwYXJ0aWFsLmxlbnNlczogVHJhdmVyc2FscyByZXF1aXJlIGFuIGFwcGxpY2F0aXZlLlwiKVxufVxuXG4vL1xuXG5mdW5jdGlvbiBDb25jYXQobCwgcikge3RoaXMubCA9IGw7IHRoaXMuciA9IHJ9XG5cbmNvbnN0IGlzQ29uY2F0ID0gbiA9PiBuLmNvbnN0cnVjdG9yID09PSBDb25jYXRcblxuY29uc3QgYXAgPSAociwgbCkgPT4gdm9pZCAwICE9PSBsID8gdm9pZCAwICE9PSByID8gbmV3IENvbmNhdChsLCByKSA6IGwgOiByXG5cbmNvbnN0IHJjb25jYXQgPSB0ID0+IGggPT4gYXAodCwgaClcblxuZnVuY3Rpb24gcHVzaFRvKG4sIHlzKSB7XG4gIHdoaWxlIChuICYmIGlzQ29uY2F0KG4pKSB7XG4gICAgY29uc3QgbCA9IG4ubFxuICAgIG4gPSBuLnJcbiAgICBpZiAobCAmJiBpc0NvbmNhdChsKSkge1xuICAgICAgcHVzaFRvKGwubCwgeXMpXG4gICAgICBwdXNoVG8obC5yLCB5cylcbiAgICB9IGVsc2VcbiAgICAgIHlzLnB1c2gobClcbiAgfVxuICB5cy5wdXNoKG4pXG59XG5cbmZ1bmN0aW9uIHRvQXJyYXkobikge1xuICBpZiAodm9pZCAwICE9PSBuKSB7XG4gICAgY29uc3QgeXMgPSBbXVxuICAgIHB1c2hUbyhuLCB5cylcbiAgICByZXR1cm4geXNcbiAgfVxufVxuXG5mdW5jdGlvbiBmb2xkUmVjKGYsIHIsIG4pIHtcbiAgd2hpbGUgKGlzQ29uY2F0KG4pKSB7XG4gICAgY29uc3QgbCA9IG4ubFxuICAgIG4gPSBuLnJcbiAgICByID0gaXNDb25jYXQobClcbiAgICAgID8gZm9sZFJlYyhmLCBmb2xkUmVjKGYsIHIsIGwubCksIGwucilcbiAgICAgIDogZihyLCBsWzBdLCBsWzFdKVxuICB9XG4gIHJldHVybiBmKHIsIG5bMF0sIG5bMV0pXG59XG5cbmNvbnN0IGZvbGQgPSAoZiwgciwgbikgPT4gdm9pZCAwICE9PSBuID8gZm9sZFJlYyhmLCByLCBuKSA6IHJcblxuY29uc3QgQ29sbGVjdCA9IFRhY25vY09mKHZvaWQgMCwgYXApXG5cbi8vXG5cbmZ1bmN0aW9uIHRyYXZlcnNlUGFydGlhbEluZGV4KEEsIHhpMnlBLCB4cykge1xuICBjb25zdCBhcCA9IEEuYXAsIG1hcCA9IEEubWFwXG4gIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpXG4gICAgcmVxQXBwbGljYXRpdmUoQSlcbiAgbGV0IHMgPSAoMCxBLm9mKSh2b2lkIDApLCBpID0geHMubGVuZ3RoXG4gIHdoaWxlIChpLS0pXG4gICAgcyA9IGFwKG1hcChyY29uY2F0LCBzKSwgeGkyeUEoeHNbaV0sIGkpKVxuICByZXR1cm4gbWFwKHRvQXJyYXksIHMpXG59XG5cbi8vXG5cbmZ1bmN0aW9uIG9iamVjdDBUb1VuZGVmaW5lZChvKSB7XG4gIGlmICghKG8gaW5zdGFuY2VvZiBPYmplY3QpKVxuICAgIHJldHVybiBvXG4gIGZvciAoY29uc3QgayBpbiBvKVxuICAgIHJldHVybiBvXG59XG5cbi8vXG5cbmNvbnN0IGdldFByb3AgPSAoaywgbykgPT4gbyBpbnN0YW5jZW9mIE9iamVjdCA/IG9ba10gOiB2b2lkIDBcblxuY29uc3Qgc2V0UHJvcCA9IChrLCB2LCBvKSA9PlxuICB2b2lkIDAgIT09IHYgPyBhc3NvY1BhcnRpYWxVKGssIHYsIG8pIDogZGlzc29jUGFydGlhbFUoaywgbylcblxuY29uc3QgZnVuUHJvcCA9IGsgPT4gKEYsIHhpMnlGLCB4LCBfKSA9PlxuICAoMCxGLm1hcCkodiA9PiBzZXRQcm9wKGssIHYsIHgpLCB4aTJ5RihnZXRQcm9wKGssIHgpLCBrKSlcblxuLy9cblxuZnVuY3Rpb24gY2xlYXJSYW5nZSh4cywgaSwgaikge1xuICB3aGlsZSAoaSA8IGopXG4gICAgeHNbaSsrXSA9IG51bGxcbiAgcmV0dXJuIHhzXG59XG5cbmNvbnN0IGdldEluZGV4ID0gKGksIHhzKSA9PiBzZWVtc0FycmF5TGlrZSh4cykgPyB4c1tpXSA6IHZvaWQgMFxuXG5mdW5jdGlvbiBzZXRJbmRleChpLCB4LCB4cykge1xuICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiICYmIGkgPCAwKVxuICAgIHRocm93IG5ldyBFcnJvcihcInBhcnRpYWwubGVuc2VzOiBOZWdhdGl2ZSBpbmRpY2VzIG5vdCBzdXBwb3J0ZWRcIilcbiAgaWYgKHZvaWQgMCAhPT0geCkge1xuICAgIGlmICghc2VlbXNBcnJheUxpa2UoeHMpKVxuICAgICAgcmV0dXJuIHNldEF0KGNsZWFyUmFuZ2UoQXJyYXkoaSsxKSwgMCwgaSksIGksIHgpXG4gICAgY29uc3QgbiA9IHhzLmxlbmd0aFxuICAgIGlmIChuIDw9IGkpXG4gICAgICByZXR1cm4gc2V0QXQoY2xlYXJSYW5nZShjb3B5VG9Gcm9tKEFycmF5KGkrMSksIDAsIHhzLCAwLCBuKSwgbiwgaSksIGksIHgpXG4gICAgY29uc3QgeXMgPSBBcnJheShuKVxuICAgIGZvciAobGV0IGo9MDsgajxuOyArK2opXG4gICAgICB5c1tqXSA9IHhzW2pdXG4gICAgeXNbaV0gPSB4XG4gICAgcmV0dXJuIHlzXG4gIH0gZWxzZSB7XG4gICAgaWYgKHNlZW1zQXJyYXlMaWtlKHhzKSkge1xuICAgICAgY29uc3QgbiA9IHhzLmxlbmd0aFxuICAgICAgaWYgKDAgPCBuKSB7XG4gICAgICAgIGlmIChuIDw9IGkpXG4gICAgICAgICAgcmV0dXJuIGZyb21BcnJheUxpa2UoeHMpXG4gICAgICAgIGlmICgxIDwgbikge1xuICAgICAgICAgIGNvbnN0IHlzID0gQXJyYXkobi0xKVxuICAgICAgICAgIGZvciAobGV0IGo9MDsgajxpOyArK2opXG4gICAgICAgICAgICB5c1tqXSA9IHhzW2pdXG4gICAgICAgICAgZm9yIChsZXQgaj1pKzE7IGo8bjsgKytqKVxuICAgICAgICAgICAgeXNbai0xXSA9IHhzW2pdXG4gICAgICAgICAgcmV0dXJuIHlzXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuY29uc3QgZnVuSW5kZXggPSBpID0+IChGLCB4aTJ5RiwgeHMsIF8pID0+XG4gICgwLEYubWFwKSh5ID0+IHNldEluZGV4KGksIHksIHhzKSwgeGkyeUYoZ2V0SW5kZXgoaSwgeHMpLCBpKSlcblxuLy9cblxuZnVuY3Rpb24gcmVxT3B0aWMobykge1xuICBpZiAoISh0eXBlb2YgbyA9PT0gXCJmdW5jdGlvblwiICYmIG8ubGVuZ3RoID09PSA0KSlcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJwYXJ0aWFsLmxlbnNlczogRXhwZWN0aW5nIGFuIG9wdGljLlwiKVxufVxuXG5jb25zdCBjbG9zZSA9IChvLCBGLCB4aTJ5RikgPT4gKHgsIGkpID0+IG8oRiwgeGkyeUYsIHgsIGkpXG5cbmZ1bmN0aW9uIGNvbXBvc2VkKG9pMCwgb3MpIHtcbiAgc3dpdGNoIChvcy5sZW5ndGggLSBvaTApIHtcbiAgICBjYXNlIDA6ICByZXR1cm4gaWRlbnRpdHlcbiAgICBjYXNlIDE6ICByZXR1cm4gdG9GdW5jdGlvbihvc1tvaTBdKVxuICAgIGRlZmF1bHQ6IHJldHVybiAoRiwgeGkyeUYsIHgsIGkpID0+IHtcbiAgICAgIGxldCBuID0gb3MubGVuZ3RoXG4gICAgICB4aTJ5RiA9IGNsb3NlKHRvRnVuY3Rpb24ob3NbLS1uXSksIEYsIHhpMnlGKVxuICAgICAgd2hpbGUgKG9pMCA8IC0tbilcbiAgICAgICAgeGkyeUYgPSBjbG9zZSh0b0Z1bmN0aW9uKG9zW25dKSwgRiwgeGkyeUYpXG4gICAgICByZXR1cm4gcnVuKG9zW29pMF0sIEYsIHhpMnlGLCB4LCBpKVxuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBzZXRVKG8sIHgsIHMpIHtcbiAgc3dpdGNoICh0eXBlb2Ygbykge1xuICAgIGNhc2UgXCJzdHJpbmdcIjpcbiAgICAgIHJldHVybiBzZXRQcm9wKG8sIHgsIHMpXG4gICAgY2FzZSBcIm51bWJlclwiOlxuICAgICAgcmV0dXJuIHNldEluZGV4KG8sIHgsIHMpXG4gICAgY2FzZSBcImZ1bmN0aW9uXCI6XG4gICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKVxuICAgICAgICByZXFPcHRpYyhvKVxuICAgICAgcmV0dXJuIG8oSWRlbnQsIGFsd2F5cyh4KSwgcywgdm9pZCAwKVxuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gbW9kaWZ5Q29tcG9zZWQobywgYWx3YXlzKHgpLCBzKVxuICB9XG59XG5cbmZ1bmN0aW9uIGdldENvbXBvc2VkKGxzLCBzKSB7XG4gIGZvciAobGV0IGk9MCwgbj1scy5sZW5ndGgsIGw7IGk8bjsgKytpKVxuICAgIHN3aXRjaCAodHlwZW9mIChsID0gbHNbaV0pKSB7XG4gICAgICBjYXNlIFwic3RyaW5nXCI6IHMgPSBnZXRQcm9wKGwsIHMpOyBicmVha1xuICAgICAgY2FzZSBcIm51bWJlclwiOiBzID0gZ2V0SW5kZXgobCwgcyk7IGJyZWFrXG4gICAgICBkZWZhdWx0OiByZXR1cm4gY29tcG9zZWQoaSwgbHMpKENvbnN0LCBpZCwgcywgbHNbaS0xXSlcbiAgICB9XG4gIHJldHVybiBzXG59XG5cbmZ1bmN0aW9uIGdldFUobCwgcykge1xuICBzd2l0Y2ggKHR5cGVvZiBsKSB7XG4gICAgY2FzZSBcInN0cmluZ1wiOlxuICAgICAgcmV0dXJuIGdldFByb3AobCwgcylcbiAgICBjYXNlIFwibnVtYmVyXCI6XG4gICAgICByZXR1cm4gZ2V0SW5kZXgobCwgcylcbiAgICBjYXNlIFwiZnVuY3Rpb25cIjpcbiAgICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpXG4gICAgICAgIHJlcU9wdGljKGwpXG4gICAgICByZXR1cm4gbChDb25zdCwgaWQsIHMsIHZvaWQgMClcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIGdldENvbXBvc2VkKGwsIHMpXG4gIH1cbn1cblxuZnVuY3Rpb24gbW9kaWZ5Q29tcG9zZWQob3MsIHhpMngsIHgpIHtcbiAgbGV0IG4gPSBvcy5sZW5ndGhcbiAgY29uc3QgeHMgPSBbXVxuICBmb3IgKGxldCBpPTAsIG87IGk8bjsgKytpKSB7XG4gICAgeHMucHVzaCh4KVxuICAgIHN3aXRjaCAodHlwZW9mIChvID0gb3NbaV0pKSB7XG4gICAgICBjYXNlIFwic3RyaW5nXCI6XG4gICAgICAgIHggPSBnZXRQcm9wKG8sIHgpXG4gICAgICAgIGJyZWFrXG4gICAgICBjYXNlIFwibnVtYmVyXCI6XG4gICAgICAgIHggPSBnZXRJbmRleChvLCB4KVxuICAgICAgICBicmVha1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgeCA9IGNvbXBvc2VkKGksIG9zKShJZGVudCwgeGkyeCwgeCwgb3NbaS0xXSlcbiAgICAgICAgbiA9IGlcbiAgICAgICAgYnJlYWtcbiAgICB9XG4gIH1cbiAgaWYgKG4gPT09IG9zLmxlbmd0aClcbiAgICB4ID0geGkyeCh4LCBvc1tuLTFdKVxuICB3aGlsZSAoMCA8PSAtLW4pIHtcbiAgICBjb25zdCBvID0gb3Nbbl1cbiAgICBzd2l0Y2ggKHR5cGVvZiBvKSB7XG4gICAgICBjYXNlIFwic3RyaW5nXCI6IHggPSBzZXRQcm9wKG8sIHgsIHhzW25dKTsgYnJlYWtcbiAgICAgIGNhc2UgXCJudW1iZXJcIjogeCA9IHNldEluZGV4KG8sIHgsIHhzW25dKTsgYnJlYWtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHhcbn1cblxuLy9cblxuZnVuY3Rpb24gZ2V0UGljayh0ZW1wbGF0ZSwgeCkge1xuICBsZXQgclxuICBmb3IgKGNvbnN0IGsgaW4gdGVtcGxhdGUpIHtcbiAgICBjb25zdCB2ID0gZ2V0VSh0ZW1wbGF0ZVtrXSwgeClcbiAgICBpZiAodm9pZCAwICE9PSB2KSB7XG4gICAgICBpZiAoIXIpXG4gICAgICAgIHIgPSB7fVxuICAgICAgcltrXSA9IHZcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJcbn1cblxuY29uc3Qgc2V0UGljayA9ICh0ZW1wbGF0ZSwgeCkgPT4gdmFsdWUgPT4ge1xuICBpZiAoIWlzT2JqZWN0KHZhbHVlKSlcbiAgICB2YWx1ZSA9IHZvaWQgMFxuICBmb3IgKGNvbnN0IGsgaW4gdGVtcGxhdGUpXG4gICAgeCA9IHNldFUodGVtcGxhdGVba10sIHZhbHVlICYmIHZhbHVlW2tdLCB4KVxuICByZXR1cm4geFxufVxuXG4vL1xuXG5jb25zdCBzaG93ID0gKGxhYmVscywgZGlyKSA9PiB4ID0+XG4gIGNvbnNvbGUubG9nLmFwcGx5KGNvbnNvbGUsIGxhYmVscy5jb25jYXQoW2RpciwgeF0pKSB8fCB4XG5cbmZ1bmN0aW9uIGJyYW5jaE9uTWVyZ2UoeCwga2V5cywgeHMpIHtcbiAgY29uc3QgbyA9IHt9LCBuID0ga2V5cy5sZW5ndGhcbiAgZm9yIChsZXQgaT0wOyBpPG47ICsraSwgeHM9eHNbMV0pIHtcbiAgICBjb25zdCB2ID0geHNbMF1cbiAgICBvW2tleXNbaV1dID0gdm9pZCAwICE9PSB2ID8gdiA6IG9cbiAgfVxuICBsZXQgclxuICBpZiAoeC5jb25zdHJ1Y3RvciAhPT0gT2JqZWN0KVxuICAgIHggPSBPYmplY3QuYXNzaWduKHt9LCB4KVxuICBmb3IgKGNvbnN0IGsgaW4geCkge1xuICAgIGNvbnN0IHYgPSBvW2tdXG4gICAgaWYgKG8gIT09IHYpIHtcbiAgICAgIG9ba10gPSBvXG4gICAgICBpZiAoIXIpXG4gICAgICAgIHIgPSB7fVxuICAgICAgcltrXSA9IHZvaWQgMCAhPT0gdiA/IHYgOiB4W2tdXG4gICAgfVxuICB9XG4gIGZvciAobGV0IGk9MDsgaTxuOyArK2kpIHtcbiAgICBjb25zdCBrID0ga2V5c1tpXVxuICAgIGNvbnN0IHYgPSBvW2tdXG4gICAgaWYgKG8gIT09IHYpIHtcbiAgICAgIGlmICghcilcbiAgICAgICAgciA9IHt9XG4gICAgICByW2tdID0gdlxuICAgIH1cbiAgfVxuICByZXR1cm4gclxufVxuXG5jb25zdCBicmFuY2hPbiA9IChrZXlzLCB2YWxzKSA9PiAoQSwgeGkyeUEsIHgsIF8pID0+IHtcbiAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIilcbiAgICByZXFBcHBsaWNhdGl2ZShBKVxuICBjb25zdCBuID0ga2V5cy5sZW5ndGgsIG9mID0gQS5vZlxuICBpZiAoIW4pXG4gICAgcmV0dXJuIG9mKG9iamVjdDBUb1VuZGVmaW5lZCh4KSlcbiAgaWYgKCEoeCBpbnN0YW5jZW9mIE9iamVjdCkpXG4gICAgeCA9IG9iamVjdDBcbiAgY29uc3QgYXAgPSBBLmFwLFxuICAgICAgICB3YWl0ID0gKGksIHhzKSA9PiAwIDw9IGkgPyB4ID0+IHdhaXQoaS0xLCBbeCwgeHNdKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBicmFuY2hPbk1lcmdlKHgsIGtleXMsIHhzKVxuICBsZXQgeHNBID0gb2Yod2FpdChuLTEpKVxuICBmb3IgKGxldCBpPW4tMTsgMDw9aTsgLS1pKSB7XG4gICAgY29uc3QgayA9IGtleXNbaV0sIHYgPSB4W2tdXG4gICAgeHNBID0gYXAoeHNBLCB2YWxzID8gdmFsc1tpXShBLCB4aTJ5QSwgdiwgaykgOiB4aTJ5QSh2LCBrKSlcbiAgfVxuICByZXR1cm4geHNBXG59XG5cbmNvbnN0IG5vcm1hbGl6ZXIgPSB4aTJ4ID0+IChGLCB4aTJ5RiwgeCwgaSkgPT5cbiAgKDAsRi5tYXApKHggPT4geGkyeCh4LCBpKSwgeGkyeUYoeGkyeCh4LCBpKSwgaSkpXG5cbmNvbnN0IHJlcGxhY2VkID0gKGlubiwgb3V0LCB4KSA9PiBhY3ljbGljRXF1YWxzVSh4LCBpbm4pID8gb3V0IDogeFxuXG5mdW5jdGlvbiBmaW5kSW5kZXgoeGkyYiwgeHMpIHtcbiAgZm9yIChsZXQgaT0wLCBuPXhzLmxlbmd0aDsgaTxuOyArK2kpXG4gICAgaWYgKHhpMmIoeHNbaV0sIGkpKVxuICAgICAgcmV0dXJuIGlcbiAgcmV0dXJuIC0xXG59XG5cbmZ1bmN0aW9uIHBhcnRpdGlvbkludG9JbmRleCh4aTJiLCB4cywgdHMsIGZzKSB7XG4gIGZvciAobGV0IGk9MCwgbj14cy5sZW5ndGgsIHg7IGk8bjsgKytpKVxuICAgICh4aTJiKHggPSB4c1tpXSwgaSkgPyB0cyA6IGZzKS5wdXNoKHgpXG59XG5cbi8vXG5cbmV4cG9ydCBmdW5jdGlvbiB0b0Z1bmN0aW9uKG8pIHtcbiAgc3dpdGNoICh0eXBlb2Ygbykge1xuICAgIGNhc2UgXCJzdHJpbmdcIjpcbiAgICAgIHJldHVybiBmdW5Qcm9wKG8pXG4gICAgY2FzZSBcIm51bWJlclwiOlxuICAgICAgcmV0dXJuIGZ1bkluZGV4KG8pXG4gICAgY2FzZSBcImZ1bmN0aW9uXCI6XG4gICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKVxuICAgICAgICByZXFPcHRpYyhvKVxuICAgICAgcmV0dXJuIG9cbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIGNvbXBvc2VkKDAsbylcbiAgfVxufVxuXG4vLyBPcGVyYXRpb25zIG9uIG9wdGljc1xuXG5leHBvcnQgY29uc3QgbW9kaWZ5ID0gY3VycnkoKG8sIHhpMngsIHMpID0+IHtcbiAgc3dpdGNoICh0eXBlb2Ygbykge1xuICAgIGNhc2UgXCJzdHJpbmdcIjpcbiAgICAgIHJldHVybiBzZXRQcm9wKG8sIHhpMngoZ2V0UHJvcChvLCBzKSwgbyksIHMpXG4gICAgY2FzZSBcIm51bWJlclwiOlxuICAgICAgcmV0dXJuIHNldEluZGV4KG8sIHhpMngoZ2V0SW5kZXgobywgcyksIG8pLCBzKVxuICAgIGNhc2UgXCJmdW5jdGlvblwiOlxuICAgICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIilcbiAgICAgICAgcmVxT3B0aWMobylcbiAgICAgIHJldHVybiBvKElkZW50LCB4aTJ4LCBzLCB2b2lkIDApXG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBtb2RpZnlDb21wb3NlZChvLCB4aTJ4LCBzKVxuICB9XG59KVxuXG5leHBvcnQgY29uc3QgcmVtb3ZlID0gY3VycnkoKG8sIHMpID0+IHNldFUobywgdm9pZCAwLCBzKSlcblxuZXhwb3J0IGNvbnN0IHNldCA9IGN1cnJ5KHNldFUpXG5cbi8vIE5lc3RpbmdcblxuZXhwb3J0IGZ1bmN0aW9uIGNvbXBvc2UoKSB7XG4gIHN3aXRjaCAoYXJndW1lbnRzLmxlbmd0aCkge1xuICAgIGNhc2UgMDogcmV0dXJuIGlkZW50aXR5XG4gICAgY2FzZSAxOiByZXR1cm4gYXJndW1lbnRzWzBdXG4gICAgZGVmYXVsdDoge1xuICAgICAgY29uc3QgbiA9IGFyZ3VtZW50cy5sZW5ndGgsIGxlbnNlcyA9IEFycmF5KG4pXG4gICAgICBmb3IgKGxldCBpPTA7IGk8bjsgKytpKVxuICAgICAgICBsZW5zZXNbaV0gPSBhcmd1bWVudHNbaV1cbiAgICAgIHJldHVybiBsZW5zZXNcbiAgICB9XG4gIH1cbn1cblxuLy8gUXVlcnlpbmdcblxuZXhwb3J0IGNvbnN0IGNoYWluID0gY3VycnkoKHhpMnlPLCB4TykgPT5cbiAgW3hPLCBjaG9vc2UoKHhNLCBpKSA9PiB2b2lkIDAgIT09IHhNID8geGkyeU8oeE0sIGkpIDogemVybyldKVxuXG5leHBvcnQgY29uc3QgY2hvaWNlID0gKC4uLmxzKSA9PiBjaG9vc2UoeCA9PiB7XG4gIGNvbnN0IGkgPSBmaW5kSW5kZXgobCA9PiB2b2lkIDAgIT09IGdldFUobCwgeCksIGxzKVxuICByZXR1cm4gaSA8IDAgPyB6ZXJvIDogbHNbaV1cbn0pXG5cbmV4cG9ydCBjb25zdCBjaG9vc2UgPSB4aU0ybyA9PiAoQywgeGkyeUMsIHgsIGkpID0+XG4gIHJ1bih4aU0ybyh4LCBpKSwgQywgeGkyeUMsIHgsIGkpXG5cbmV4cG9ydCBjb25zdCB3aGVuID0gcCA9PiAoQywgeGkyeUMsIHgsIGkpID0+XG4gIHAoeCwgaSkgPyB4aTJ5Qyh4LCBpKSA6IHplcm8oQywgeGkyeUMsIHgsIGkpXG5cbmV4cG9ydCBjb25zdCBvcHRpb25hbCA9IHdoZW4oaXNEZWZpbmVkKVxuXG5leHBvcnQgZnVuY3Rpb24gemVybyhDLCB4aTJ5QywgeCwgaSkge1xuICBjb25zdCBvZiA9IEMub2ZcbiAgcmV0dXJuIG9mID8gb2YoeCkgOiAoMCxDLm1hcCkoYWx3YXlzKHgpLCB4aTJ5Qyh2b2lkIDAsIGkpKVxufVxuXG4vLyBSZWN1cnNpbmdcblxuZXhwb3J0IGZ1bmN0aW9uIGxhenkobzJvKSB7XG4gIGxldCBtZW1vID0gKEMsIHhpMnlDLCB4LCBpKSA9PiAobWVtbyA9IHRvRnVuY3Rpb24obzJvKHJlYykpKShDLCB4aTJ5QywgeCwgaSlcbiAgZnVuY3Rpb24gcmVjKEMsIHhpMnlDLCB4LCBpKSB7cmV0dXJuIG1lbW8oQywgeGkyeUMsIHgsIGkpfVxuICByZXR1cm4gcmVjXG59XG5cbi8vIERlYnVnZ2luZ1xuXG5leHBvcnQgY29uc3QgbG9nID0gKC4uLmxhYmVscykgPT4gaXNvKHNob3cobGFiZWxzLCBcImdldFwiKSwgc2hvdyhsYWJlbHMsIFwic2V0XCIpKVxuXG4vLyBPcGVyYXRpb25zIG9uIHRyYXZlcnNhbHNcblxuZXhwb3J0IGNvbnN0IGNvbmNhdEFzID0gY29uc3RBcyhtID0+IFRhY25vY09mKCgwLG0uZW1wdHkpKCksIGZsaXAobS5jb25jYXQpKSlcblxuZXhwb3J0IGNvbnN0IGNvbmNhdCA9IGNvbmNhdEFzKGlkKVxuXG5leHBvcnQgY29uc3QgbWVyZ2VBcyA9IGNvbnN0QXMobSA9PiBUYWNub2NPZigoMCxtLmVtcHR5KSgpLCBtLmNvbmNhdCkpXG5cbmV4cG9ydCBjb25zdCBtZXJnZSA9IG1lcmdlQXMoaWQpXG5cbi8vIEZvbGRzIG92ZXIgdHJhdmVyc2Fsc1xuXG5leHBvcnQgY29uc3QgY29sbGVjdEFzID0gY3VycnkoKHhpMnksIHQsIHMpID0+XG4gIHRvQXJyYXkocnVuKHQsIENvbGxlY3QsIHhpMnksIHMpKSB8fCBbXSlcblxuZXhwb3J0IGNvbnN0IGNvbGxlY3QgPSBjb2xsZWN0QXMoaWQpXG5cbmV4cG9ydCBjb25zdCBmb2xkbCA9IGN1cnJ5KChmLCByLCB0LCBzKSA9PlxuICBmb2xkKGYsIHIsIHJ1bih0LCBDb2xsZWN0LCBwYWlyLCBzKSkpXG5cbmV4cG9ydCBjb25zdCBmb2xkciA9IGN1cnJ5KChmLCByLCB0LCBzKSA9PiB7XG4gIGNvbnN0IHhzID0gY29sbGVjdEFzKHBhaXIsIHQsIHMpXG4gIGZvciAobGV0IGk9eHMubGVuZ3RoLTE7IDA8PWk7IC0taSkge1xuICAgIGNvbnN0IHggPSB4c1tpXVxuICAgIHIgPSBmKHIsIHhbMF0sIHhbMV0pXG4gIH1cbiAgcmV0dXJuIHJcbn0pXG5cbmV4cG9ydCBjb25zdCBtYXhpbXVtID0gbWVyZ2UoTXVtKCh4LCB5KSA9PiB4ID4geSkpXG5cbmV4cG9ydCBjb25zdCBtaW5pbXVtID0gbWVyZ2UoTXVtKCh4LCB5KSA9PiB4IDwgeSkpXG5cbmV4cG9ydCBjb25zdCBwcm9kdWN0ID0gbWVyZ2VBcyh1bnRvKDEpLCBNb25vaWQoMSwgKHksIHgpID0+IHggKiB5KSlcblxuZXhwb3J0IGNvbnN0IHN1bSA9IG1lcmdlQXModW50bygwKSwgTW9ub2lkKDAsICh5LCB4KSA9PiB4ICsgeSkpXG5cbi8vIENyZWF0aW5nIG5ldyB0cmF2ZXJzYWxzXG5cbmV4cG9ydCBmdW5jdGlvbiBicmFuY2godGVtcGxhdGUpIHtcbiAgY29uc3Qga2V5cyA9IFtdLCB2YWxzID0gW11cbiAgZm9yIChjb25zdCBrIGluIHRlbXBsYXRlKSB7XG4gICAga2V5cy5wdXNoKGspXG4gICAgdmFscy5wdXNoKHRvRnVuY3Rpb24odGVtcGxhdGVba10pKVxuICB9XG4gIHJldHVybiBicmFuY2hPbihrZXlzLCB2YWxzKVxufVxuXG4vLyBUcmF2ZXJzYWxzIGFuZCBjb21iaW5hdG9yc1xuXG5leHBvcnQgZnVuY3Rpb24gZWxlbXMoQSwgeGkyeUEsIHhzLCBfKSB7XG4gIGlmIChzZWVtc0FycmF5TGlrZSh4cykpIHtcbiAgICByZXR1cm4gQSA9PT0gSWRlbnRcbiAgICAgID8gbWFwUGFydGlhbEluZGV4VSh4aTJ5QSwgeHMpXG4gICAgICA6IHRyYXZlcnNlUGFydGlhbEluZGV4KEEsIHhpMnlBLCB4cylcbiAgfSBlbHNlIHtcbiAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKVxuICAgICAgcmVxQXBwbGljYXRpdmUoQSlcbiAgICByZXR1cm4gKDAsQS5vZikoeHMpXG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHZhbHVlcyhBLCB4aTJ5QSwgeHMsIF8pIHtcbiAgaWYgKHhzIGluc3RhbmNlb2YgT2JqZWN0KSB7XG4gICAgcmV0dXJuIGJyYW5jaE9uKGtleXMoeHMpKShBLCB4aTJ5QSwgeHMpXG4gIH0gZWxzZSB7XG4gICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIilcbiAgICAgIHJlcUFwcGxpY2F0aXZlKEEpXG4gICAgcmV0dXJuICgwLEEub2YpKHhzKVxuICB9XG59XG5cbi8vIE9wZXJhdGlvbnMgb24gbGVuc2VzXG5cbmV4cG9ydCBjb25zdCBnZXQgPSBjdXJyeShnZXRVKVxuXG4vLyBDcmVhdGluZyBuZXcgbGVuc2VzXG5cbmV4cG9ydCBjb25zdCBsZW5zID0gY3VycnkoKGdldCwgc2V0KSA9PiAoRiwgeGkyeUYsIHgsIGkpID0+XG4gICgwLEYubWFwKSh5ID0+IHNldCh5LCB4LCBpKSwgeGkyeUYoZ2V0KHgsIGkpLCBpKSkpXG5cbi8vIENvbXB1dGluZyBkZXJpdmVkIHByb3BzXG5cbmV4cG9ydCBjb25zdCBhdWdtZW50ID0gdGVtcGxhdGUgPT4gbGVucyhcbiAgeCA9PiB7XG4gICAgeCA9IGRpc3NvY1BhcnRpYWxVKDAsIHgpXG4gICAgaWYgKHgpXG4gICAgICBmb3IgKGNvbnN0IGsgaW4gdGVtcGxhdGUpXG4gICAgICAgIHhba10gPSB0ZW1wbGF0ZVtrXSh4KVxuICAgIHJldHVybiB4XG4gIH0sXG4gICh5LCB4KSA9PiB7XG4gICAgaWYgKGlzT2JqZWN0KHkpKSB7XG4gICAgICBpZiAoISh4IGluc3RhbmNlb2YgT2JqZWN0KSlcbiAgICAgICAgeCA9IHZvaWQgMFxuICAgICAgbGV0IHpcbiAgICAgIGNvbnN0IHNldCA9IChrLCB2KSA9PiB7XG4gICAgICAgIGlmICgheilcbiAgICAgICAgICB6ID0ge31cbiAgICAgICAgeltrXSA9IHZcbiAgICAgIH1cbiAgICAgIGZvciAoY29uc3QgayBpbiB5KSB7XG4gICAgICAgIGlmICghKGsgaW4gdGVtcGxhdGUpKVxuICAgICAgICAgIHNldChrLCB5W2tdKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgaWYgKHggJiYgayBpbiB4KVxuICAgICAgICAgICAgc2V0KGssIHhba10pXG4gICAgICB9XG4gICAgICByZXR1cm4gelxuICAgIH1cbiAgfSlcblxuLy8gRW5mb3JjaW5nIGludmFyaWFudHNcblxuZXhwb3J0IGNvbnN0IGRlZmF1bHRzID0gb3V0ID0+IHtcbiAgY29uc3QgbzJ1ID0geCA9PiByZXBsYWNlZChvdXQsIHZvaWQgMCwgeClcbiAgcmV0dXJuIChGLCB4aTJ5RiwgeCwgaSkgPT4gKDAsRi5tYXApKG8ydSwgeGkyeUYodm9pZCAwICE9PSB4ID8geCA6IG91dCwgaSkpXG59XG5cbmV4cG9ydCBjb25zdCByZXF1aXJlZCA9IGlubiA9PiByZXBsYWNlKGlubiwgdm9pZCAwKVxuXG5leHBvcnQgY29uc3QgZGVmaW5lID0gdiA9PiBub3JtYWxpemVyKHVudG8odikpXG5cbmV4cG9ydCBjb25zdCBub3JtYWxpemUgPSB4aTJ4ID0+XG4gIG5vcm1hbGl6ZXIoKHgsIGkpID0+IHZvaWQgMCAhPT0geCA/IHhpMngoeCwgaSkgOiB2b2lkIDApXG5cbmV4cG9ydCBjb25zdCByZXdyaXRlID0geWkyeSA9PiAoRiwgeGkyeUYsIHgsIGkpID0+XG4gICgwLEYubWFwKSh5ID0+IHZvaWQgMCAhPT0geSA/IHlpMnkoeSwgaSkgOiB2b2lkIDAsIHhpMnlGKHgsIGkpKVxuXG4vLyBMZW5zaW5nIGFycmF5c1xuXG5leHBvcnQgY29uc3QgYXBwZW5kID0gKEYsIHhpMnlGLCB4cywgaSkgPT5cbiAgKDAsRi5tYXApKHggPT4gc2V0SW5kZXgoc2VlbXNBcnJheUxpa2UoeHMpID8geHMubGVuZ3RoIDogMCwgeCwgeHMpLFxuICAgICAgICAgICAgeGkyeUYodm9pZCAwLCBpKSlcblxuZXhwb3J0IGNvbnN0IGZpbHRlciA9IHhpMmIgPT4gKEYsIHhpMnlGLCB4cywgaSkgPT4ge1xuICBsZXQgdHMsIGZzXG4gIGlmIChzZWVtc0FycmF5TGlrZSh4cykpXG4gICAgcGFydGl0aW9uSW50b0luZGV4KHhpMmIsIHhzLCB0cyA9IFtdLCBmcyA9IFtdKVxuICByZXR1cm4gKDAsRi5tYXApKFxuICAgIHRzID0+IHtcbiAgICAgIGNvbnN0IHRzTiA9IHRzID8gdHMubGVuZ3RoIDogMCxcbiAgICAgICAgICAgIGZzTiA9IGZzID8gZnMubGVuZ3RoIDogMCxcbiAgICAgICAgICAgIG4gPSB0c04gKyBmc05cbiAgICAgIGlmIChuKVxuICAgICAgICByZXR1cm4gbiA9PT0gZnNOXG4gICAgICAgID8gZnNcbiAgICAgICAgOiBjb3B5VG9Gcm9tKGNvcHlUb0Zyb20oQXJyYXkobiksIDAsIHRzLCAwLCB0c04pLCB0c04sIGZzLCAwLCBmc04pXG4gICAgfSxcbiAgICB4aTJ5Rih0cywgaSkpXG59XG5cbmV4cG9ydCBjb25zdCBmaW5kID0geGkyYiA9PiBjaG9vc2UoeHMgPT4ge1xuICBpZiAoIXNlZW1zQXJyYXlMaWtlKHhzKSlcbiAgICByZXR1cm4gMFxuICBjb25zdCBpID0gZmluZEluZGV4KHhpMmIsIHhzKVxuICByZXR1cm4gaSA8IDAgPyBhcHBlbmQgOiBpXG59KVxuXG5leHBvcnQgZnVuY3Rpb24gZmluZFdpdGgoLi4ubHMpIHtcbiAgY29uc3QgbGxzID0gY29tcG9zZSguLi5scylcbiAgcmV0dXJuIFtmaW5kKHggPT4gdm9pZCAwICE9PSBnZXRVKGxscywgeCkpLCBsbHNdXG59XG5cbmV4cG9ydCBjb25zdCBpbmRleCA9IHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSBcInByb2R1Y3Rpb25cIiA/IGlkIDogeCA9PiB7XG4gIGlmICghTnVtYmVyLmlzSW50ZWdlcih4KSB8fCB4IDwgMClcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJwYXJ0aWFsLmxlbnNlczogYGluZGV4YCBleHBlY3RzIGEgbm9uLW5lZ2F0aXZlIGludGVnZXIuXCIpXG4gIHJldHVybiB4XG59XG5cbmV4cG9ydCBjb25zdCBzbGljZSA9IGN1cnJ5KChiZWdpbiwgZW5kKSA9PiAoRiwgeHNpMnlGLCB4cywgaSkgPT4ge1xuICBjb25zdCBzZWVtcyA9IHNlZW1zQXJyYXlMaWtlKHhzKSxcbiAgICAgICAgeHNOID0gc2VlbXMgJiYgeHMubGVuZ3RoLFxuICAgICAgICBiID0gc2xpY2VJbmRleCgwLCB4c04sIDAsIGJlZ2luKSxcbiAgICAgICAgZSA9IHNsaWNlSW5kZXgoYiwgeHNOLCB4c04sIGVuZClcbiAgcmV0dXJuICgwLEYubWFwKShcbiAgICB6cyA9PiB7XG4gICAgICBjb25zdCB6c04gPSB6cyA/IHpzLmxlbmd0aCA6IDAsIGJQenNOID0gYiArIHpzTiwgbiA9IHhzTiAtIGUgKyBiUHpzTlxuICAgICAgcmV0dXJuIG5cbiAgICAgICAgPyBjb3B5VG9Gcm9tKGNvcHlUb0Zyb20oY29weVRvRnJvbShBcnJheShuKSwgMCwgeHMsIDAsIGIpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB6cywgMCwgenNOKSxcbiAgICAgICAgICAgICAgICAgICAgIGJQenNOLFxuICAgICAgICAgICAgICAgICAgICAgeHMsIGUsIHhzTilcbiAgICAgICAgOiB1bmRlZmluZWRcbiAgICB9LFxuICAgIHhzaTJ5RihzZWVtcyA/IGNvcHlUb0Zyb20oQXJyYXkoTWF0aC5tYXgoMCwgZSAtIGIpKSwgMCwgeHMsIGIsIGUpIDpcbiAgICAgICAgICAgdW5kZWZpbmVkLFxuICAgICAgICAgICBpKSlcbn0pXG5cbi8vIExlbnNpbmcgb2JqZWN0c1xuXG5leHBvcnQgY29uc3QgcHJvcCA9IHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSBcInByb2R1Y3Rpb25cIiA/IGlkIDogeCA9PiB7XG4gIGlmICh0eXBlb2YgeCAhPT0gXCJzdHJpbmdcIilcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJwYXJ0aWFsLmxlbnNlczogYHByb3BgIGV4cGVjdHMgYSBzdHJpbmcuXCIpXG4gIHJldHVybiB4XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwcm9wcygpIHtcbiAgY29uc3QgbiA9IGFyZ3VtZW50cy5sZW5ndGgsIHRlbXBsYXRlID0ge31cbiAgZm9yIChsZXQgaT0wLCBrOyBpPG47ICsraSlcbiAgICB0ZW1wbGF0ZVtrID0gYXJndW1lbnRzW2ldXSA9IGtcbiAgcmV0dXJuIHBpY2sodGVtcGxhdGUpXG59XG5cbi8vIFByb3ZpZGluZyBkZWZhdWx0c1xuXG5leHBvcnQgY29uc3QgdmFsdWVPciA9IHYgPT4gKF9GLCB4aTJ5RiwgeCwgaSkgPT5cbiAgeGkyeUYodm9pZCAwICE9PSB4ICYmIHggIT09IG51bGwgPyB4IDogdiwgaSlcblxuLy8gQWRhcHRpbmcgdG8gZGF0YVxuXG5leHBvcnQgY29uc3Qgb3JFbHNlID1cbiAgY3VycnkoKGQsIGwpID0+IGNob29zZSh4ID0+IHZvaWQgMCAhPT0gZ2V0VShsLCB4KSA/IGwgOiBkKSlcblxuLy8gUmVhZC1vbmx5IG1hcHBpbmdcblxuZXhwb3J0IGNvbnN0IHRvID0gd2kyeCA9PiAoRiwgeGkyeUYsIHcsIGkpID0+XG4gICgwLEYubWFwKShhbHdheXModyksIHhpMnlGKHdpMngodywgaSksIGkpKVxuXG5leHBvcnQgY29uc3QganVzdCA9IHggPT4gdG8oYWx3YXlzKHgpKVxuXG4vLyBUcmFuc2Zvcm1pbmcgZGF0YVxuXG5leHBvcnQgY29uc3QgcGljayA9IHRlbXBsYXRlID0+IChGLCB4aTJ5RiwgeCwgaSkgPT5cbiAgKDAsRi5tYXApKHNldFBpY2sodGVtcGxhdGUsIHgpLCB4aTJ5RihnZXRQaWNrKHRlbXBsYXRlLCB4KSwgaSkpXG5cbmV4cG9ydCBjb25zdCByZXBsYWNlID0gY3VycnkoKGlubiwgb3V0KSA9PiB7XG4gIGNvbnN0IG8yaSA9IHggPT4gcmVwbGFjZWQob3V0LCBpbm4sIHgpXG4gIHJldHVybiAoRiwgeGkyeUYsIHgsIGkpID0+ICgwLEYubWFwKShvMmksIHhpMnlGKHJlcGxhY2VkKGlubiwgb3V0LCB4KSwgaSkpXG59KVxuXG4vLyBPcGVyYXRpb25zIG9uIGlzb21vcnBoaXNtc1xuXG5leHBvcnQgY29uc3QgZ2V0SW52ZXJzZSA9IGFyaXR5TigyLCBzZXRVKVxuXG4vLyBDcmVhdGluZyBuZXcgaXNvbW9ycGhpc21zXG5cbmV4cG9ydCBjb25zdCBpc28gPVxuICBjdXJyeSgoYndkLCBmd2QpID0+IChGLCB4aTJ5RiwgeCwgaSkgPT4gKDAsRi5tYXApKGZ3ZCwgeGkyeUYoYndkKHgpLCBpKSkpXG5cbi8vIElzb21vcnBoaXNtcyBhbmQgY29tYmluYXRvcnNcblxuZXhwb3J0IGNvbnN0IGlkZW50aXR5ID0gKF9GLCB4aTJ5RiwgeCwgaSkgPT4geGkyeUYoeCwgaSlcblxuZXhwb3J0IGNvbnN0IGludmVyc2UgPSBpc28gPT4gKEYsIHhpMnlGLCB4LCBpKSA9PlxuICAoMCxGLm1hcCkoeCA9PiBnZXRVKGlzbywgeCksIHhpMnlGKHNldFUoaXNvLCB4KSwgaSkpXG4iXX0=
