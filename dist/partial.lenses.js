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
  if ("dev" !== "production" && !clearRange.warned) {
    clearRange.warned = 1;
    console.warn("partial.lenses: In the next major version, `index` will not set undefined elements to `null`.");
  }
  while (i < j) {
    xs[i++] = null;
  }return xs;
}

var getIndex = function getIndex(i, xs) {
  return seemsArrayLike(xs) ? xs[i] : void 0;
};

function setIndex(i, x, xs) {
  if ("dev" !== "production" && i < 0) throw new Error("partial.lenses: Negative indices are not supported by `index`.");
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
    if (!(0, _infestines.isObject)(value)) {
      if ("dev" !== "production" && !setPick.warned && !(void 0 === value || value instanceof Object)) {
        setPick.warned = 1;
        console.warn("partial.lenses: In the next major version, `pick` can only be set with `undefined` or an instanceof Object.");
      }
      value = void 0;
    }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvcGFydGlhbC5sZW5zZXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7UUNtYWdCLFUsR0FBQSxVO1FBc0NBLE8sR0FBQSxPO1FBK0JBLEksR0FBQSxJO1FBT0EsSSxHQUFBLEk7UUFpREEsTSxHQUFBLE07UUFXQSxLLEdBQUEsSztRQVlBLE0sR0FBQSxNO1FBaUdBLFEsR0FBQSxRO1FBd0NBLEssR0FBQSxLOztBQWhzQmhCOztBQWlCQTs7QUFFQSxJQUFNLGFBQWEsU0FBYixVQUFhLENBQUMsQ0FBRCxFQUFJLENBQUosRUFBTyxDQUFQLEVBQVUsQ0FBVjtBQUFBLFNBQ2pCLEtBQUssQ0FBTCxLQUFXLENBQVgsR0FBZSxDQUFmLEdBQW1CLEtBQUssR0FBTCxDQUFTLEtBQUssR0FBTCxDQUFTLENBQVQsRUFBWSxJQUFJLENBQUosR0FBUSxJQUFJLENBQVosR0FBZ0IsQ0FBNUIsQ0FBVCxFQUF5QyxDQUF6QyxDQURGO0FBQUEsQ0FBbkI7O0FBR0EsU0FBUyxJQUFULENBQWMsRUFBZCxFQUFrQixFQUFsQixFQUFzQjtBQUFDLFNBQU8sQ0FBQyxFQUFELEVBQUssRUFBTCxDQUFQO0FBQWdCOztBQUV2QyxJQUFNLE9BQU8sU0FBUCxJQUFPO0FBQUEsU0FBTyxVQUFDLENBQUQsRUFBSSxDQUFKO0FBQUEsV0FBVSxJQUFJLENBQUosRUFBTyxDQUFQLENBQVY7QUFBQSxHQUFQO0FBQUEsQ0FBYjs7QUFFQSxJQUFNLE9BQU8sU0FBUCxJQUFPO0FBQUEsU0FBSztBQUFBLFdBQUssS0FBSyxDQUFMLEtBQVcsQ0FBWCxHQUFlLENBQWYsR0FBbUIsQ0FBeEI7QUFBQSxHQUFMO0FBQUEsQ0FBYjs7QUFFQSxJQUFNLFFBQVEsU0FBUixLQUFRO0FBQUEsU0FBSyxNQUFPLEtBQUssQ0FBWixJQUFrQixLQUFLLENBQTVCO0FBQUEsQ0FBZDs7QUFFQSxJQUFNLGlCQUFpQixTQUFq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LEVBQWMsQ0FBZDtBQUFBLFdBQW9CLENBQUMsR0FBRSxFQUFFLEdBQUwsRUFBVSxHQUFWLEVBQWUsTUFBTSxTQUFTLEdBQVQsRUFBYyxHQUFkLEVBQW1CLENBQW5CLENBQU4sRUFBNkIsQ0FBN0IsQ0FBZixDQUFwQjtBQUFBLEdBQVA7QUFDRCxDQUhzQixDQUFoQjs7QUFLUDs7QUFFTyxJQUFNLGtDQUFhLHdCQUFPLENBQVAsRUFBVSxJQUFWLENBQW5COztBQUVQOztBQUVPLElBQU0sb0JBQ1gsdUJBQU0sVUFBQyxHQUFELEVBQU0sR0FBTjtBQUFBLFNBQWMsVUFBQyxDQUFELEVBQUksS0FBSixFQUFXLENBQVgsRUFBYyxDQUFkO0FBQUEsV0FBb0IsQ0FBQyxHQUFFLEVBQUUsR0FBTCxFQUFVLEdBQVYsRUFBZSxNQUFNLElBQUksQ0FBSixDQUFOLEVBQWMsQ0FBZCxDQUFmLENBQXBCO0FBQUEsR0FBZDtBQUFBLENBQU4sQ0FESzs7QUFHUDs7QUFFTyxJQUFNLDhCQUFXLFNBQVgsUUFBVyxDQUFDLEVBQUQsRUFBSyxLQUFMLEVBQVksQ0FBWixFQUFlLENBQWY7QUFBQSxTQUFxQixNQUFNLENBQU4sRUFBUyxDQUFULENBQXJCO0FBQUEsQ0FBakI7O0FBRUEsSUFBTSw0QkFBVSxTQUFWLE9BQVU7QUFBQSxTQUFPLFVBQUMsQ0FBRCxFQUFJLEtBQUosRUFBVyxDQUFYLEVBQWMsQ0FBZDtBQUFBLFdBQzVCLENBQUMsR0FBRSxFQUFFLEdBQUwsRUFBVTtBQUFBLGFBQUssS0FBSyxHQUFMLEVBQVUsQ0FBVixDQUFMO0FBQUEsS0FBVixFQUE2QixNQUFNLEtBQUssR0FBTCxFQUFVLENBQVYsQ0FBTixFQUFvQixDQUFwQixDQUE3QixDQUQ0QjtBQUFBLEdBQVA7QUFBQSxDQUFoQiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQge1xuICBhY3ljbGljRXF1YWxzVSxcbiAgYWx3YXlzLFxuICBhcHBseVUsXG4gIGFyaXR5TixcbiAgYXNzb2NQYXJ0aWFsVSxcbiAgY3VycnksXG4gIGN1cnJ5TixcbiAgZGlzc29jUGFydGlhbFUsXG4gIGlkLFxuICBpc0RlZmluZWQsXG4gIGlzT2JqZWN0LFxuICBrZXlzLFxuICBvYmplY3QwLFxuICBzbmRVXG59IGZyb20gXCJpbmZlc3RpbmVzXCJcblxuLy9cblxuY29uc3Qgc2xpY2VJbmRleCA9IChtLCBsLCBkLCBpKSA9PlxuICB2b2lkIDAgPT09IGkgPyBkIDogTWF0aC5taW4oTWF0aC5tYXgobSwgaSA8IDAgPyBsICsgaSA6IGkpLCBsKVxuXG5mdW5jdGlvbiBwYWlyKHgwLCB4MSkge3JldHVybiBbeDAsIHgxXX1cblxuY29uc3QgZmxpcCA9IGJvcCA9PiAoeCwgeSkgPT4gYm9wKHksIHgpXG5cbmNvbnN0IHVudG8gPSBjID0+IHggPT4gdm9pZCAwICE9PSB4ID8geCA6IGNcblxuY29uc3QgaXNOYXQgPSB4ID0+IHggPT09ICh4ID4+IDApICYmIDAgPD0geFxuXG5jb25zdCBzZWVtc0FycmF5TGlrZSA9IHggPT5cbiAgeCBpbnN0YW5jZW9mIE9iamVjdCAmJiBpc05hdCh4Lmxlbmd0aCkgfHwgdHlwZW9mIHggPT09IFwic3RyaW5nXCJcblxuLy9cblxuZnVuY3Rpb24gbWFwUGFydGlhbEluZGV4VSh4aTJ5LCB4cykge1xuICBjb25zdCBuID0geHMubGVuZ3RoLCB5cyA9IEFycmF5KG4pXG4gIGxldCBqID0gMFxuICBmb3IgKGxldCBpPTAsIHk7IGk8bjsgKytpKVxuICAgIGlmICh2b2lkIDAgIT09ICh5ID0geGkyeSh4c1tpXSwgaSkpKVxuICAgICAgeXNbaisrXSA9IHlcbiAgaWYgKGopIHtcbiAgICBpZiAoaiA8IG4pXG4gICAgICB5cy5sZW5ndGggPSBqXG4gICAgcmV0dXJuIHlzXG4gIH1cbn1cblxuZnVuY3Rpb24gY29weVRvRnJvbSh5cywgaywgeHMsIGksIGopIHtcbiAgd2hpbGUgKGkgPCBqKVxuICAgIHlzW2srK10gPSB4c1tpKytdXG4gIHJldHVybiB5c1xufVxuXG5mdW5jdGlvbiBzZXRBdCh4cywgaSwgeCkge1xuICB4c1tpXSA9IHhcbiAgcmV0dXJuIHhzXG59XG5cbmZ1bmN0aW9uIGZyb21BcnJheUxpa2UoeHMpIHtcbiAgaWYgKHhzLmNvbnN0cnVjdG9yID09PSBBcnJheSlcbiAgICByZXR1cm4geHNcbiAgY29uc3QgbiA9IHhzLmxlbmd0aFxuICByZXR1cm4gY29weVRvRnJvbShBcnJheShuKSwgMCwgeHMsIDAsIG4pXG59XG5cbi8vXG5cbmNvbnN0IEFwcGxpY2F0aXZlID0gKG1hcCwgb2YsIGFwKSA9PiAoe21hcCwgb2YsIGFwfSlcblxuY29uc3QgSWRlbnQgPSBBcHBsaWNhdGl2ZShhcHBseVUsIGlkLCBhcHBseVUpXG5cbmNvbnN0IENvbnN0ID0ge21hcDogc25kVX1cblxuY29uc3QgVGFjbm9jT2YgPSAoZW1wdHksIHRhY25vYykgPT4gQXBwbGljYXRpdmUoc25kVSwgYWx3YXlzKGVtcHR5KSwgdGFjbm9jKVxuXG5jb25zdCBNb25vaWQgPSAoZW1wdHksIGNvbmNhdCkgPT4gKHtlbXB0eTogKCkgPT4gZW1wdHksIGNvbmNhdH0pXG5cbmNvbnN0IE11bSA9IG9yZCA9PlxuICBNb25vaWQodm9pZCAwLCAoeSwgeCkgPT4gdm9pZCAwICE9PSB4ICYmICh2b2lkIDAgPT09IHkgfHwgb3JkKHgsIHkpKSA/IHggOiB5KVxuXG4vL1xuXG5jb25zdCBydW4gPSAobywgQywgeGkyeUMsIHMsIGkpID0+IHRvRnVuY3Rpb24obykoQywgeGkyeUMsIHMsIGkpXG5cbmNvbnN0IGNvbnN0QXMgPSB0b0NvbnN0ID0+IGN1cnJ5Tig0LCAoeE1pMnksIG0pID0+IHtcbiAgY29uc3QgQyA9IHRvQ29uc3QobSlcbiAgcmV0dXJuICh0LCBzKSA9PiBydW4odCwgQywgeE1pMnksIHMpXG59KVxuXG4vL1xuXG5mdW5jdGlvbiByZXFBcHBsaWNhdGl2ZShmKSB7XG4gIGlmICghZi5vZilcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJwYXJ0aWFsLmxlbnNlczogVHJhdmVyc2FscyByZXF1aXJlIGFuIGFwcGxpY2F0aXZlLlwiKVxufVxuXG4vL1xuXG5mdW5jdGlvbiBDb25jYXQobCwgcikge3RoaXMubCA9IGw7IHRoaXMuciA9IHJ9XG5cbmNvbnN0IGlzQ29uY2F0ID0gbiA9PiBuLmNvbnN0cnVjdG9yID09PSBDb25jYXRcblxuY29uc3QgYXAgPSAociwgbCkgPT4gdm9pZCAwICE9PSBsID8gdm9pZCAwICE9PSByID8gbmV3IENvbmNhdChsLCByKSA6IGwgOiByXG5cbmNvbnN0IHJjb25jYXQgPSB0ID0+IGggPT4gYXAodCwgaClcblxuZnVuY3Rpb24gcHVzaFRvKG4sIHlzKSB7XG4gIHdoaWxlIChuICYmIGlzQ29uY2F0KG4pKSB7XG4gICAgY29uc3QgbCA9IG4ubFxuICAgIG4gPSBuLnJcbiAgICBpZiAobCAmJiBpc0NvbmNhdChsKSkge1xuICAgICAgcHVzaFRvKGwubCwgeXMpXG4gICAgICBwdXNoVG8obC5yLCB5cylcbiAgICB9IGVsc2VcbiAgICAgIHlzLnB1c2gobClcbiAgfVxuICB5cy5wdXNoKG4pXG59XG5cbmZ1bmN0aW9uIHRvQXJyYXkobikge1xuICBpZiAodm9pZCAwICE9PSBuKSB7XG4gICAgY29uc3QgeXMgPSBbXVxuICAgIHB1c2hUbyhuLCB5cylcbiAgICByZXR1cm4geXNcbiAgfVxufVxuXG5mdW5jdGlvbiBmb2xkUmVjKGYsIHIsIG4pIHtcbiAgd2hpbGUgKGlzQ29uY2F0KG4pKSB7XG4gICAgY29uc3QgbCA9IG4ubFxuICAgIG4gPSBuLnJcbiAgICByID0gaXNDb25jYXQobClcbiAgICAgID8gZm9sZFJlYyhmLCBmb2xkUmVjKGYsIHIsIGwubCksIGwucilcbiAgICAgIDogZihyLCBsWzBdLCBsWzFdKVxuICB9XG4gIHJldHVybiBmKHIsIG5bMF0sIG5bMV0pXG59XG5cbmNvbnN0IGZvbGQgPSAoZiwgciwgbikgPT4gdm9pZCAwICE9PSBuID8gZm9sZFJlYyhmLCByLCBuKSA6IHJcblxuY29uc3QgQ29sbGVjdCA9IFRhY25vY09mKHZvaWQgMCwgYXApXG5cbi8vXG5cbmZ1bmN0aW9uIHRyYXZlcnNlUGFydGlhbEluZGV4KEEsIHhpMnlBLCB4cykge1xuICBjb25zdCBhcCA9IEEuYXAsIG1hcCA9IEEubWFwXG4gIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpXG4gICAgcmVxQXBwbGljYXRpdmUoQSlcbiAgbGV0IHMgPSAoMCxBLm9mKSh2b2lkIDApLCBpID0geHMubGVuZ3RoXG4gIHdoaWxlIChpLS0pXG4gICAgcyA9IGFwKG1hcChyY29uY2F0LCBzKSwgeGkyeUEoeHNbaV0sIGkpKVxuICByZXR1cm4gbWFwKHRvQXJyYXksIHMpXG59XG5cbi8vXG5cbmZ1bmN0aW9uIG9iamVjdDBUb1VuZGVmaW5lZChvKSB7XG4gIGlmICghKG8gaW5zdGFuY2VvZiBPYmplY3QpKVxuICAgIHJldHVybiBvXG4gIGZvciAoY29uc3QgayBpbiBvKVxuICAgIHJldHVybiBvXG59XG5cbi8vXG5cbmNvbnN0IGdldFByb3AgPSAoaywgbykgPT4gbyBpbnN0YW5jZW9mIE9iamVjdCA/IG9ba10gOiB2b2lkIDBcblxuY29uc3Qgc2V0UHJvcCA9IChrLCB2LCBvKSA9PlxuICB2b2lkIDAgIT09IHYgPyBhc3NvY1BhcnRpYWxVKGssIHYsIG8pIDogZGlzc29jUGFydGlhbFUoaywgbylcblxuY29uc3QgZnVuUHJvcCA9IGsgPT4gKEYsIHhpMnlGLCB4LCBfKSA9PlxuICAoMCxGLm1hcCkodiA9PiBzZXRQcm9wKGssIHYsIHgpLCB4aTJ5RihnZXRQcm9wKGssIHgpLCBrKSlcblxuLy9cblxuZnVuY3Rpb24gY2xlYXJSYW5nZSh4cywgaSwgaikge1xuICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiICYmICFjbGVhclJhbmdlLndhcm5lZCkge1xuICAgIGNsZWFyUmFuZ2Uud2FybmVkPTFcbiAgICBjb25zb2xlLndhcm4oXCJwYXJ0aWFsLmxlbnNlczogSW4gdGhlIG5leHQgbWFqb3IgdmVyc2lvbiwgYGluZGV4YCB3aWxsIG5vdCBzZXQgdW5kZWZpbmVkIGVsZW1lbnRzIHRvIGBudWxsYC5cIilcbiAgfVxuICB3aGlsZSAoaSA8IGopXG4gICAgeHNbaSsrXSA9IG51bGxcbiAgcmV0dXJuIHhzXG59XG5cbmNvbnN0IGdldEluZGV4ID0gKGksIHhzKSA9PiBzZWVtc0FycmF5TGlrZSh4cykgPyB4c1tpXSA6IHZvaWQgMFxuXG5mdW5jdGlvbiBzZXRJbmRleChpLCB4LCB4cykge1xuICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiICYmIGkgPCAwKVxuICAgIHRocm93IG5ldyBFcnJvcihcInBhcnRpYWwubGVuc2VzOiBOZWdhdGl2ZSBpbmRpY2VzIGFyZSBub3Qgc3VwcG9ydGVkIGJ5IGBpbmRleGAuXCIpXG4gIGlmICh2b2lkIDAgIT09IHgpIHtcbiAgICBpZiAoIXNlZW1zQXJyYXlMaWtlKHhzKSlcbiAgICAgIHJldHVybiBzZXRBdChjbGVhclJhbmdlKEFycmF5KGkrMSksIDAsIGkpLCBpLCB4KVxuICAgIGNvbnN0IG4gPSB4cy5sZW5ndGhcbiAgICBpZiAobiA8PSBpKVxuICAgICAgcmV0dXJuIHNldEF0KGNsZWFyUmFuZ2UoY29weVRvRnJvbShBcnJheShpKzEpLCAwLCB4cywgMCwgbiksIG4sIGkpLCBpLCB4KVxuICAgIGNvbnN0IHlzID0gQXJyYXkobilcbiAgICBmb3IgKGxldCBqPTA7IGo8bjsgKytqKVxuICAgICAgeXNbal0gPSB4c1tqXVxuICAgIHlzW2ldID0geFxuICAgIHJldHVybiB5c1xuICB9IGVsc2Uge1xuICAgIGlmIChzZWVtc0FycmF5TGlrZSh4cykpIHtcbiAgICAgIGNvbnN0IG4gPSB4cy5sZW5ndGhcbiAgICAgIGlmICgwIDwgbikge1xuICAgICAgICBpZiAobiA8PSBpKVxuICAgICAgICAgIHJldHVybiBmcm9tQXJyYXlMaWtlKHhzKVxuICAgICAgICBpZiAoMSA8IG4pIHtcbiAgICAgICAgICBjb25zdCB5cyA9IEFycmF5KG4tMSlcbiAgICAgICAgICBmb3IgKGxldCBqPTA7IGo8aTsgKytqKVxuICAgICAgICAgICAgeXNbal0gPSB4c1tqXVxuICAgICAgICAgIGZvciAobGV0IGo9aSsxOyBqPG47ICsrailcbiAgICAgICAgICAgIHlzW2otMV0gPSB4c1tqXVxuICAgICAgICAgIHJldHVybiB5c1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbmNvbnN0IGZ1bkluZGV4ID0gaSA9PiAoRiwgeGkyeUYsIHhzLCBfKSA9PlxuICAoMCxGLm1hcCkoeSA9PiBzZXRJbmRleChpLCB5LCB4cyksIHhpMnlGKGdldEluZGV4KGksIHhzKSwgaSkpXG5cbi8vXG5cbmZ1bmN0aW9uIHJlcU9wdGljKG8pIHtcbiAgaWYgKCEodHlwZW9mIG8gPT09IFwiZnVuY3Rpb25cIiAmJiBvLmxlbmd0aCA9PT0gNCkpXG4gICAgdGhyb3cgbmV3IEVycm9yKFwicGFydGlhbC5sZW5zZXM6IEV4cGVjdGluZyBhbiBvcHRpYy5cIilcbn1cblxuY29uc3QgY2xvc2UgPSAobywgRiwgeGkyeUYpID0+ICh4LCBpKSA9PiBvKEYsIHhpMnlGLCB4LCBpKVxuXG5mdW5jdGlvbiBjb21wb3NlZChvaTAsIG9zKSB7XG4gIHN3aXRjaCAob3MubGVuZ3RoIC0gb2kwKSB7XG4gICAgY2FzZSAwOiAgcmV0dXJuIGlkZW50aXR5XG4gICAgY2FzZSAxOiAgcmV0dXJuIHRvRnVuY3Rpb24ob3Nbb2kwXSlcbiAgICBkZWZhdWx0OiByZXR1cm4gKEYsIHhpMnlGLCB4LCBpKSA9PiB7XG4gICAgICBsZXQgbiA9IG9zLmxlbmd0aFxuICAgICAgeGkyeUYgPSBjbG9zZSh0b0Z1bmN0aW9uKG9zWy0tbl0pLCBGLCB4aTJ5RilcbiAgICAgIHdoaWxlIChvaTAgPCAtLW4pXG4gICAgICAgIHhpMnlGID0gY2xvc2UodG9GdW5jdGlvbihvc1tuXSksIEYsIHhpMnlGKVxuICAgICAgcmV0dXJuIHJ1bihvc1tvaTBdLCBGLCB4aTJ5RiwgeCwgaSlcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gc2V0VShvLCB4LCBzKSB7XG4gIHN3aXRjaCAodHlwZW9mIG8pIHtcbiAgICBjYXNlIFwic3RyaW5nXCI6XG4gICAgICByZXR1cm4gc2V0UHJvcChvLCB4LCBzKVxuICAgIGNhc2UgXCJudW1iZXJcIjpcbiAgICAgIHJldHVybiBzZXRJbmRleChvLCB4LCBzKVxuICAgIGNhc2UgXCJmdW5jdGlvblwiOlxuICAgICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIilcbiAgICAgICAgcmVxT3B0aWMobylcbiAgICAgIHJldHVybiBvKElkZW50LCBhbHdheXMoeCksIHMsIHZvaWQgMClcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIG1vZGlmeUNvbXBvc2VkKG8sIGFsd2F5cyh4KSwgcylcbiAgfVxufVxuXG5mdW5jdGlvbiBnZXRDb21wb3NlZChscywgcykge1xuICBmb3IgKGxldCBpPTAsIG49bHMubGVuZ3RoLCBsOyBpPG47ICsraSlcbiAgICBzd2l0Y2ggKHR5cGVvZiAobCA9IGxzW2ldKSkge1xuICAgICAgY2FzZSBcInN0cmluZ1wiOiBzID0gZ2V0UHJvcChsLCBzKTsgYnJlYWtcbiAgICAgIGNhc2UgXCJudW1iZXJcIjogcyA9IGdldEluZGV4KGwsIHMpOyBicmVha1xuICAgICAgZGVmYXVsdDogcmV0dXJuIGNvbXBvc2VkKGksIGxzKShDb25zdCwgaWQsIHMsIGxzW2ktMV0pXG4gICAgfVxuICByZXR1cm4gc1xufVxuXG5mdW5jdGlvbiBnZXRVKGwsIHMpIHtcbiAgc3dpdGNoICh0eXBlb2YgbCkge1xuICAgIGNhc2UgXCJzdHJpbmdcIjpcbiAgICAgIHJldHVybiBnZXRQcm9wKGwsIHMpXG4gICAgY2FzZSBcIm51bWJlclwiOlxuICAgICAgcmV0dXJuIGdldEluZGV4KGwsIHMpXG4gICAgY2FzZSBcImZ1bmN0aW9uXCI6XG4gICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKVxuICAgICAgICByZXFPcHRpYyhsKVxuICAgICAgcmV0dXJuIGwoQ29uc3QsIGlkLCBzLCB2b2lkIDApXG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBnZXRDb21wb3NlZChsLCBzKVxuICB9XG59XG5cbmZ1bmN0aW9uIG1vZGlmeUNvbXBvc2VkKG9zLCB4aTJ4LCB4KSB7XG4gIGxldCBuID0gb3MubGVuZ3RoXG4gIGNvbnN0IHhzID0gW11cbiAgZm9yIChsZXQgaT0wLCBvOyBpPG47ICsraSkge1xuICAgIHhzLnB1c2goeClcbiAgICBzd2l0Y2ggKHR5cGVvZiAobyA9IG9zW2ldKSkge1xuICAgICAgY2FzZSBcInN0cmluZ1wiOlxuICAgICAgICB4ID0gZ2V0UHJvcChvLCB4KVxuICAgICAgICBicmVha1xuICAgICAgY2FzZSBcIm51bWJlclwiOlxuICAgICAgICB4ID0gZ2V0SW5kZXgobywgeClcbiAgICAgICAgYnJlYWtcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHggPSBjb21wb3NlZChpLCBvcykoSWRlbnQsIHhpMngsIHgsIG9zW2ktMV0pXG4gICAgICAgIG4gPSBpXG4gICAgICAgIGJyZWFrXG4gICAgfVxuICB9XG4gIGlmIChuID09PSBvcy5sZW5ndGgpXG4gICAgeCA9IHhpMngoeCwgb3Nbbi0xXSlcbiAgd2hpbGUgKDAgPD0gLS1uKSB7XG4gICAgY29uc3QgbyA9IG9zW25dXG4gICAgc3dpdGNoICh0eXBlb2Ygbykge1xuICAgICAgY2FzZSBcInN0cmluZ1wiOiB4ID0gc2V0UHJvcChvLCB4LCB4c1tuXSk7IGJyZWFrXG4gICAgICBjYXNlIFwibnVtYmVyXCI6IHggPSBzZXRJbmRleChvLCB4LCB4c1tuXSk7IGJyZWFrXG4gICAgfVxuICB9XG4gIHJldHVybiB4XG59XG5cbi8vXG5cbmZ1bmN0aW9uIGdldFBpY2sodGVtcGxhdGUsIHgpIHtcbiAgbGV0IHJcbiAgZm9yIChjb25zdCBrIGluIHRlbXBsYXRlKSB7XG4gICAgY29uc3QgdiA9IGdldFUodGVtcGxhdGVba10sIHgpXG4gICAgaWYgKHZvaWQgMCAhPT0gdikge1xuICAgICAgaWYgKCFyKVxuICAgICAgICByID0ge31cbiAgICAgIHJba10gPSB2XG4gICAgfVxuICB9XG4gIHJldHVybiByXG59XG5cbmNvbnN0IHNldFBpY2sgPSAodGVtcGxhdGUsIHgpID0+IHZhbHVlID0+IHtcbiAgaWYgKCFpc09iamVjdCh2YWx1ZSkpIHtcbiAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiICYmICFzZXRQaWNrLndhcm5lZCAmJlxuICAgICAgICAhKHZvaWQgMCA9PT0gdmFsdWUgfHwgdmFsdWUgaW5zdGFuY2VvZiBPYmplY3QpKSB7XG4gICAgICBzZXRQaWNrLndhcm5lZD0xXG4gICAgICBjb25zb2xlLndhcm4oXCJwYXJ0aWFsLmxlbnNlczogSW4gdGhlIG5leHQgbWFqb3IgdmVyc2lvbiwgYHBpY2tgIGNhbiBvbmx5IGJlIHNldCB3aXRoIGB1bmRlZmluZWRgIG9yIGFuIGluc3RhbmNlb2YgT2JqZWN0LlwiKVxuICAgIH1cbiAgICB2YWx1ZSA9IHZvaWQgMFxuICB9XG4gIGZvciAoY29uc3QgayBpbiB0ZW1wbGF0ZSlcbiAgICB4ID0gc2V0VSh0ZW1wbGF0ZVtrXSwgdmFsdWUgJiYgdmFsdWVba10sIHgpXG4gIHJldHVybiB4XG59XG5cbi8vXG5cbmNvbnN0IHNob3cgPSAobGFiZWxzLCBkaXIpID0+IHggPT5cbiAgY29uc29sZS5sb2cuYXBwbHkoY29uc29sZSwgbGFiZWxzLmNvbmNhdChbZGlyLCB4XSkpIHx8IHhcblxuZnVuY3Rpb24gYnJhbmNoT25NZXJnZSh4LCBrZXlzLCB4cykge1xuICBjb25zdCBvID0ge30sIG4gPSBrZXlzLmxlbmd0aFxuICBmb3IgKGxldCBpPTA7IGk8bjsgKytpLCB4cz14c1sxXSkge1xuICAgIGNvbnN0IHYgPSB4c1swXVxuICAgIG9ba2V5c1tpXV0gPSB2b2lkIDAgIT09IHYgPyB2IDogb1xuICB9XG4gIGxldCByXG4gIGlmICh4LmNvbnN0cnVjdG9yICE9PSBPYmplY3QpXG4gICAgeCA9IE9iamVjdC5hc3NpZ24oe30sIHgpXG4gIGZvciAoY29uc3QgayBpbiB4KSB7XG4gICAgY29uc3QgdiA9IG9ba11cbiAgICBpZiAobyAhPT0gdikge1xuICAgICAgb1trXSA9IG9cbiAgICAgIGlmICghcilcbiAgICAgICAgciA9IHt9XG4gICAgICByW2tdID0gdm9pZCAwICE9PSB2ID8gdiA6IHhba11cbiAgICB9XG4gIH1cbiAgZm9yIChsZXQgaT0wOyBpPG47ICsraSkge1xuICAgIGNvbnN0IGsgPSBrZXlzW2ldXG4gICAgY29uc3QgdiA9IG9ba11cbiAgICBpZiAobyAhPT0gdikge1xuICAgICAgaWYgKCFyKVxuICAgICAgICByID0ge31cbiAgICAgIHJba10gPSB2XG4gICAgfVxuICB9XG4gIHJldHVybiByXG59XG5cbmNvbnN0IGJyYW5jaE9uID0gKGtleXMsIHZhbHMpID0+IChBLCB4aTJ5QSwgeCwgXykgPT4ge1xuICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKVxuICAgIHJlcUFwcGxpY2F0aXZlKEEpXG4gIGNvbnN0IG4gPSBrZXlzLmxlbmd0aCwgb2YgPSBBLm9mXG4gIGlmICghbilcbiAgICByZXR1cm4gb2Yob2JqZWN0MFRvVW5kZWZpbmVkKHgpKVxuICBpZiAoISh4IGluc3RhbmNlb2YgT2JqZWN0KSlcbiAgICB4ID0gb2JqZWN0MFxuICBjb25zdCBhcCA9IEEuYXAsXG4gICAgICAgIHdhaXQgPSAoaSwgeHMpID0+IDAgPD0gaSA/IHggPT4gd2FpdChpLTEsIFt4LCB4c10pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IGJyYW5jaE9uTWVyZ2UoeCwga2V5cywgeHMpXG4gIGxldCB4c0EgPSBvZih3YWl0KG4tMSkpXG4gIGZvciAobGV0IGk9bi0xOyAwPD1pOyAtLWkpIHtcbiAgICBjb25zdCBrID0ga2V5c1tpXSwgdiA9IHhba11cbiAgICB4c0EgPSBhcCh4c0EsIHZhbHMgPyB2YWxzW2ldKEEsIHhpMnlBLCB2LCBrKSA6IHhpMnlBKHYsIGspKVxuICB9XG4gIHJldHVybiB4c0Fcbn1cblxuY29uc3Qgbm9ybWFsaXplciA9IHhpMnggPT4gKEYsIHhpMnlGLCB4LCBpKSA9PlxuICAoMCxGLm1hcCkoeCA9PiB4aTJ4KHgsIGkpLCB4aTJ5Rih4aTJ4KHgsIGkpLCBpKSlcblxuY29uc3QgcmVwbGFjZWQgPSAoaW5uLCBvdXQsIHgpID0+IGFjeWNsaWNFcXVhbHNVKHgsIGlubikgPyBvdXQgOiB4XG5cbmZ1bmN0aW9uIGZpbmRJbmRleCh4aTJiLCB4cykge1xuICBmb3IgKGxldCBpPTAsIG49eHMubGVuZ3RoOyBpPG47ICsraSlcbiAgICBpZiAoeGkyYih4c1tpXSwgaSkpXG4gICAgICByZXR1cm4gaVxuICByZXR1cm4gLTFcbn1cblxuZnVuY3Rpb24gcGFydGl0aW9uSW50b0luZGV4KHhpMmIsIHhzLCB0cywgZnMpIHtcbiAgZm9yIChsZXQgaT0wLCBuPXhzLmxlbmd0aCwgeDsgaTxuOyArK2kpXG4gICAgKHhpMmIoeCA9IHhzW2ldLCBpKSA/IHRzIDogZnMpLnB1c2goeClcbn1cblxuLy9cblxuZXhwb3J0IGZ1bmN0aW9uIHRvRnVuY3Rpb24obykge1xuICBzd2l0Y2ggKHR5cGVvZiBvKSB7XG4gICAgY2FzZSBcInN0cmluZ1wiOlxuICAgICAgcmV0dXJuIGZ1blByb3AobylcbiAgICBjYXNlIFwibnVtYmVyXCI6XG4gICAgICByZXR1cm4gZnVuSW5kZXgobylcbiAgICBjYXNlIFwiZnVuY3Rpb25cIjpcbiAgICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpXG4gICAgICAgIHJlcU9wdGljKG8pXG4gICAgICByZXR1cm4gb1xuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gY29tcG9zZWQoMCxvKVxuICB9XG59XG5cbi8vIE9wZXJhdGlvbnMgb24gb3B0aWNzXG5cbmV4cG9ydCBjb25zdCBtb2RpZnkgPSBjdXJyeSgobywgeGkyeCwgcykgPT4ge1xuICBzd2l0Y2ggKHR5cGVvZiBvKSB7XG4gICAgY2FzZSBcInN0cmluZ1wiOlxuICAgICAgcmV0dXJuIHNldFByb3AobywgeGkyeChnZXRQcm9wKG8sIHMpLCBvKSwgcylcbiAgICBjYXNlIFwibnVtYmVyXCI6XG4gICAgICByZXR1cm4gc2V0SW5kZXgobywgeGkyeChnZXRJbmRleChvLCBzKSwgbyksIHMpXG4gICAgY2FzZSBcImZ1bmN0aW9uXCI6XG4gICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKVxuICAgICAgICByZXFPcHRpYyhvKVxuICAgICAgcmV0dXJuIG8oSWRlbnQsIHhpMngsIHMsIHZvaWQgMClcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIG1vZGlmeUNvbXBvc2VkKG8sIHhpMngsIHMpXG4gIH1cbn0pXG5cbmV4cG9ydCBjb25zdCByZW1vdmUgPSBjdXJyeSgobywgcykgPT4gc2V0VShvLCB2b2lkIDAsIHMpKVxuXG5leHBvcnQgY29uc3Qgc2V0ID0gY3Vycnkoc2V0VSlcblxuLy8gTmVzdGluZ1xuXG5leHBvcnQgZnVuY3Rpb24gY29tcG9zZSgpIHtcbiAgc3dpdGNoIChhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgY2FzZSAwOiByZXR1cm4gaWRlbnRpdHlcbiAgICBjYXNlIDE6IHJldHVybiBhcmd1bWVudHNbMF1cbiAgICBkZWZhdWx0OiB7XG4gICAgICBjb25zdCBuID0gYXJndW1lbnRzLmxlbmd0aCwgbGVuc2VzID0gQXJyYXkobilcbiAgICAgIGZvciAobGV0IGk9MDsgaTxuOyArK2kpXG4gICAgICAgIGxlbnNlc1tpXSA9IGFyZ3VtZW50c1tpXVxuICAgICAgcmV0dXJuIGxlbnNlc1xuICAgIH1cbiAgfVxufVxuXG4vLyBRdWVyeWluZ1xuXG5leHBvcnQgY29uc3QgY2hhaW4gPSBjdXJyeSgoeGkyeU8sIHhPKSA9PlxuICBbeE8sIGNob29zZSgoeE0sIGkpID0+IHZvaWQgMCAhPT0geE0gPyB4aTJ5Tyh4TSwgaSkgOiB6ZXJvKV0pXG5cbmV4cG9ydCBjb25zdCBjaG9pY2UgPSAoLi4ubHMpID0+IGNob29zZSh4ID0+IHtcbiAgY29uc3QgaSA9IGZpbmRJbmRleChsID0+IHZvaWQgMCAhPT0gZ2V0VShsLCB4KSwgbHMpXG4gIHJldHVybiBpIDwgMCA/IHplcm8gOiBsc1tpXVxufSlcblxuZXhwb3J0IGNvbnN0IGNob29zZSA9IHhpTTJvID0+IChDLCB4aTJ5QywgeCwgaSkgPT5cbiAgcnVuKHhpTTJvKHgsIGkpLCBDLCB4aTJ5QywgeCwgaSlcblxuZXhwb3J0IGNvbnN0IHdoZW4gPSBwID0+IChDLCB4aTJ5QywgeCwgaSkgPT5cbiAgcCh4LCBpKSA/IHhpMnlDKHgsIGkpIDogemVybyhDLCB4aTJ5QywgeCwgaSlcblxuZXhwb3J0IGNvbnN0IG9wdGlvbmFsID0gd2hlbihpc0RlZmluZWQpXG5cbmV4cG9ydCBmdW5jdGlvbiB6ZXJvKEMsIHhpMnlDLCB4LCBpKSB7XG4gIGNvbnN0IG9mID0gQy5vZlxuICByZXR1cm4gb2YgPyBvZih4KSA6ICgwLEMubWFwKShhbHdheXMoeCksIHhpMnlDKHZvaWQgMCwgaSkpXG59XG5cbi8vIFJlY3Vyc2luZ1xuXG5leHBvcnQgZnVuY3Rpb24gbGF6eShvMm8pIHtcbiAgbGV0IG1lbW8gPSAoQywgeGkyeUMsIHgsIGkpID0+IChtZW1vID0gdG9GdW5jdGlvbihvMm8ocmVjKSkpKEMsIHhpMnlDLCB4LCBpKVxuICBmdW5jdGlvbiByZWMoQywgeGkyeUMsIHgsIGkpIHtyZXR1cm4gbWVtbyhDLCB4aTJ5QywgeCwgaSl9XG4gIHJldHVybiByZWNcbn1cblxuLy8gRGVidWdnaW5nXG5cbmV4cG9ydCBjb25zdCBsb2cgPSAoLi4ubGFiZWxzKSA9PiBpc28oc2hvdyhsYWJlbHMsIFwiZ2V0XCIpLCBzaG93KGxhYmVscywgXCJzZXRcIikpXG5cbi8vIE9wZXJhdGlvbnMgb24gdHJhdmVyc2Fsc1xuXG5leHBvcnQgY29uc3QgY29uY2F0QXMgPSBjb25zdEFzKG0gPT4gVGFjbm9jT2YoKDAsbS5lbXB0eSkoKSwgZmxpcChtLmNvbmNhdCkpKVxuXG5leHBvcnQgY29uc3QgY29uY2F0ID0gY29uY2F0QXMoaWQpXG5cbmV4cG9ydCBjb25zdCBtZXJnZUFzID0gY29uc3RBcyhtID0+IFRhY25vY09mKCgwLG0uZW1wdHkpKCksIG0uY29uY2F0KSlcblxuZXhwb3J0IGNvbnN0IG1lcmdlID0gbWVyZ2VBcyhpZClcblxuLy8gRm9sZHMgb3ZlciB0cmF2ZXJzYWxzXG5cbmV4cG9ydCBjb25zdCBjb2xsZWN0QXMgPSBjdXJyeSgoeGkyeSwgdCwgcykgPT5cbiAgdG9BcnJheShydW4odCwgQ29sbGVjdCwgeGkyeSwgcykpIHx8IFtdKVxuXG5leHBvcnQgY29uc3QgY29sbGVjdCA9IGNvbGxlY3RBcyhpZClcblxuZXhwb3J0IGNvbnN0IGZvbGRsID0gY3VycnkoKGYsIHIsIHQsIHMpID0+XG4gIGZvbGQoZiwgciwgcnVuKHQsIENvbGxlY3QsIHBhaXIsIHMpKSlcblxuZXhwb3J0IGNvbnN0IGZvbGRyID0gY3VycnkoKGYsIHIsIHQsIHMpID0+IHtcbiAgY29uc3QgeHMgPSBjb2xsZWN0QXMocGFpciwgdCwgcylcbiAgZm9yIChsZXQgaT14cy5sZW5ndGgtMTsgMDw9aTsgLS1pKSB7XG4gICAgY29uc3QgeCA9IHhzW2ldXG4gICAgciA9IGYociwgeFswXSwgeFsxXSlcbiAgfVxuICByZXR1cm4gclxufSlcblxuZXhwb3J0IGNvbnN0IG1heGltdW0gPSBtZXJnZShNdW0oKHgsIHkpID0+IHggPiB5KSlcblxuZXhwb3J0IGNvbnN0IG1pbmltdW0gPSBtZXJnZShNdW0oKHgsIHkpID0+IHggPCB5KSlcblxuZXhwb3J0IGNvbnN0IHByb2R1Y3QgPSBtZXJnZUFzKHVudG8oMSksIE1vbm9pZCgxLCAoeSwgeCkgPT4geCAqIHkpKVxuXG5leHBvcnQgY29uc3Qgc3VtID0gbWVyZ2VBcyh1bnRvKDApLCBNb25vaWQoMCwgKHksIHgpID0+IHggKyB5KSlcblxuLy8gQ3JlYXRpbmcgbmV3IHRyYXZlcnNhbHNcblxuZXhwb3J0IGZ1bmN0aW9uIGJyYW5jaCh0ZW1wbGF0ZSkge1xuICBjb25zdCBrZXlzID0gW10sIHZhbHMgPSBbXVxuICBmb3IgKGNvbnN0IGsgaW4gdGVtcGxhdGUpIHtcbiAgICBrZXlzLnB1c2goaylcbiAgICB2YWxzLnB1c2godG9GdW5jdGlvbih0ZW1wbGF0ZVtrXSkpXG4gIH1cbiAgcmV0dXJuIGJyYW5jaE9uKGtleXMsIHZhbHMpXG59XG5cbi8vIFRyYXZlcnNhbHMgYW5kIGNvbWJpbmF0b3JzXG5cbmV4cG9ydCBmdW5jdGlvbiBlbGVtcyhBLCB4aTJ5QSwgeHMsIF8pIHtcbiAgaWYgKHNlZW1zQXJyYXlMaWtlKHhzKSkge1xuICAgIHJldHVybiBBID09PSBJZGVudFxuICAgICAgPyBtYXBQYXJ0aWFsSW5kZXhVKHhpMnlBLCB4cylcbiAgICAgIDogdHJhdmVyc2VQYXJ0aWFsSW5kZXgoQSwgeGkyeUEsIHhzKVxuICB9IGVsc2Uge1xuICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpXG4gICAgICByZXFBcHBsaWNhdGl2ZShBKVxuICAgIHJldHVybiAoMCxBLm9mKSh4cylcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gdmFsdWVzKEEsIHhpMnlBLCB4cywgXykge1xuICBpZiAoeHMgaW5zdGFuY2VvZiBPYmplY3QpIHtcbiAgICByZXR1cm4gYnJhbmNoT24oa2V5cyh4cykpKEEsIHhpMnlBLCB4cylcbiAgfSBlbHNlIHtcbiAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKVxuICAgICAgcmVxQXBwbGljYXRpdmUoQSlcbiAgICByZXR1cm4gKDAsQS5vZikoeHMpXG4gIH1cbn1cblxuLy8gT3BlcmF0aW9ucyBvbiBsZW5zZXNcblxuZXhwb3J0IGNvbnN0IGdldCA9IGN1cnJ5KGdldFUpXG5cbi8vIENyZWF0aW5nIG5ldyBsZW5zZXNcblxuZXhwb3J0IGNvbnN0IGxlbnMgPSBjdXJyeSgoZ2V0LCBzZXQpID0+IChGLCB4aTJ5RiwgeCwgaSkgPT5cbiAgKDAsRi5tYXApKHkgPT4gc2V0KHksIHgsIGkpLCB4aTJ5RihnZXQoeCwgaSksIGkpKSlcblxuLy8gQ29tcHV0aW5nIGRlcml2ZWQgcHJvcHNcblxuZXhwb3J0IGNvbnN0IGF1Z21lbnQgPSB0ZW1wbGF0ZSA9PiBsZW5zKFxuICB4ID0+IHtcbiAgICB4ID0gZGlzc29jUGFydGlhbFUoMCwgeClcbiAgICBpZiAoeClcbiAgICAgIGZvciAoY29uc3QgayBpbiB0ZW1wbGF0ZSlcbiAgICAgICAgeFtrXSA9IHRlbXBsYXRlW2tdKHgpXG4gICAgcmV0dXJuIHhcbiAgfSxcbiAgKHksIHgpID0+IHtcbiAgICBpZiAoaXNPYmplY3QoeSkpIHtcbiAgICAgIGlmICghKHggaW5zdGFuY2VvZiBPYmplY3QpKVxuICAgICAgICB4ID0gdm9pZCAwXG4gICAgICBsZXQgelxuICAgICAgY29uc3Qgc2V0ID0gKGssIHYpID0+IHtcbiAgICAgICAgaWYgKCF6KVxuICAgICAgICAgIHogPSB7fVxuICAgICAgICB6W2tdID0gdlxuICAgICAgfVxuICAgICAgZm9yIChjb25zdCBrIGluIHkpIHtcbiAgICAgICAgaWYgKCEoayBpbiB0ZW1wbGF0ZSkpXG4gICAgICAgICAgc2V0KGssIHlba10pXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBpZiAoeCAmJiBrIGluIHgpXG4gICAgICAgICAgICBzZXQoaywgeFtrXSlcbiAgICAgIH1cbiAgICAgIHJldHVybiB6XG4gICAgfVxuICB9KVxuXG4vLyBFbmZvcmNpbmcgaW52YXJpYW50c1xuXG5leHBvcnQgY29uc3QgZGVmYXVsdHMgPSBvdXQgPT4ge1xuICBjb25zdCBvMnUgPSB4ID0+IHJlcGxhY2VkKG91dCwgdm9pZCAwLCB4KVxuICByZXR1cm4gKEYsIHhpMnlGLCB4LCBpKSA9PiAoMCxGLm1hcCkobzJ1LCB4aTJ5Rih2b2lkIDAgIT09IHggPyB4IDogb3V0LCBpKSlcbn1cblxuZXhwb3J0IGNvbnN0IHJlcXVpcmVkID0gaW5uID0+IHJlcGxhY2UoaW5uLCB2b2lkIDApXG5cbmV4cG9ydCBjb25zdCBkZWZpbmUgPSB2ID0+IG5vcm1hbGl6ZXIodW50byh2KSlcblxuZXhwb3J0IGNvbnN0IG5vcm1hbGl6ZSA9IHhpMnggPT5cbiAgbm9ybWFsaXplcigoeCwgaSkgPT4gdm9pZCAwICE9PSB4ID8geGkyeCh4LCBpKSA6IHZvaWQgMClcblxuZXhwb3J0IGNvbnN0IHJld3JpdGUgPSB5aTJ5ID0+IChGLCB4aTJ5RiwgeCwgaSkgPT5cbiAgKDAsRi5tYXApKHkgPT4gdm9pZCAwICE9PSB5ID8geWkyeSh5LCBpKSA6IHZvaWQgMCwgeGkyeUYoeCwgaSkpXG5cbi8vIExlbnNpbmcgYXJyYXlzXG5cbmV4cG9ydCBjb25zdCBhcHBlbmQgPSAoRiwgeGkyeUYsIHhzLCBpKSA9PlxuICAoMCxGLm1hcCkoeCA9PiBzZXRJbmRleChzZWVtc0FycmF5TGlrZSh4cykgPyB4cy5sZW5ndGggOiAwLCB4LCB4cyksXG4gICAgICAgICAgICB4aTJ5Rih2b2lkIDAsIGkpKVxuXG5leHBvcnQgY29uc3QgZmlsdGVyID0geGkyYiA9PiAoRiwgeGkyeUYsIHhzLCBpKSA9PiB7XG4gIGxldCB0cywgZnNcbiAgaWYgKHNlZW1zQXJyYXlMaWtlKHhzKSlcbiAgICBwYXJ0aXRpb25JbnRvSW5kZXgoeGkyYiwgeHMsIHRzID0gW10sIGZzID0gW10pXG4gIHJldHVybiAoMCxGLm1hcCkoXG4gICAgdHMgPT4ge1xuICAgICAgY29uc3QgdHNOID0gdHMgPyB0cy5sZW5ndGggOiAwLFxuICAgICAgICAgICAgZnNOID0gZnMgPyBmcy5sZW5ndGggOiAwLFxuICAgICAgICAgICAgbiA9IHRzTiArIGZzTlxuICAgICAgaWYgKG4pXG4gICAgICAgIHJldHVybiBuID09PSBmc05cbiAgICAgICAgPyBmc1xuICAgICAgICA6IGNvcHlUb0Zyb20oY29weVRvRnJvbShBcnJheShuKSwgMCwgdHMsIDAsIHRzTiksIHRzTiwgZnMsIDAsIGZzTilcbiAgICB9LFxuICAgIHhpMnlGKHRzLCBpKSlcbn1cblxuZXhwb3J0IGNvbnN0IGZpbmQgPSB4aTJiID0+IGNob29zZSh4cyA9PiB7XG4gIGlmICghc2VlbXNBcnJheUxpa2UoeHMpKVxuICAgIHJldHVybiAwXG4gIGNvbnN0IGkgPSBmaW5kSW5kZXgoeGkyYiwgeHMpXG4gIHJldHVybiBpIDwgMCA/IGFwcGVuZCA6IGlcbn0pXG5cbmV4cG9ydCBmdW5jdGlvbiBmaW5kV2l0aCguLi5scykge1xuICBjb25zdCBsbHMgPSBjb21wb3NlKC4uLmxzKVxuICByZXR1cm4gW2ZpbmQoeCA9PiB2b2lkIDAgIT09IGdldFUobGxzLCB4KSksIGxsc11cbn1cblxuZXhwb3J0IGNvbnN0IGluZGV4ID0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09IFwicHJvZHVjdGlvblwiID8gaWQgOiB4ID0+IHtcbiAgaWYgKCFOdW1iZXIuaXNJbnRlZ2VyKHgpIHx8IHggPCAwKVxuICAgIHRocm93IG5ldyBFcnJvcihcInBhcnRpYWwubGVuc2VzOiBgaW5kZXhgIGV4cGVjdHMgYSBub24tbmVnYXRpdmUgaW50ZWdlci5cIilcbiAgcmV0dXJuIHhcbn1cblxuZXhwb3J0IGNvbnN0IHNsaWNlID0gY3VycnkoKGJlZ2luLCBlbmQpID0+IChGLCB4c2kyeUYsIHhzLCBpKSA9PiB7XG4gIGNvbnN0IHNlZW1zID0gc2VlbXNBcnJheUxpa2UoeHMpLFxuICAgICAgICB4c04gPSBzZWVtcyAmJiB4cy5sZW5ndGgsXG4gICAgICAgIGIgPSBzbGljZUluZGV4KDAsIHhzTiwgMCwgYmVnaW4pLFxuICAgICAgICBlID0gc2xpY2VJbmRleChiLCB4c04sIHhzTiwgZW5kKVxuICByZXR1cm4gKDAsRi5tYXApKFxuICAgIHpzID0+IHtcbiAgICAgIGNvbnN0IHpzTiA9IHpzID8genMubGVuZ3RoIDogMCwgYlB6c04gPSBiICsgenNOLCBuID0geHNOIC0gZSArIGJQenNOXG4gICAgICByZXR1cm4gblxuICAgICAgICA/IGNvcHlUb0Zyb20oY29weVRvRnJvbShjb3B5VG9Gcm9tKEFycmF5KG4pLCAwLCB4cywgMCwgYiksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHpzLCAwLCB6c04pLFxuICAgICAgICAgICAgICAgICAgICAgYlB6c04sXG4gICAgICAgICAgICAgICAgICAgICB4cywgZSwgeHNOKVxuICAgICAgICA6IHVuZGVmaW5lZFxuICAgIH0sXG4gICAgeHNpMnlGKHNlZW1zID8gY29weVRvRnJvbShBcnJheShNYXRoLm1heCgwLCBlIC0gYikpLCAwLCB4cywgYiwgZSkgOlxuICAgICAgICAgICB1bmRlZmluZWQsXG4gICAgICAgICAgIGkpKVxufSlcblxuLy8gTGVuc2luZyBvYmplY3RzXG5cbmV4cG9ydCBjb25zdCBwcm9wID0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09IFwicHJvZHVjdGlvblwiID8gaWQgOiB4ID0+IHtcbiAgaWYgKHR5cGVvZiB4ICE9PSBcInN0cmluZ1wiKVxuICAgIHRocm93IG5ldyBFcnJvcihcInBhcnRpYWwubGVuc2VzOiBgcHJvcGAgZXhwZWN0cyBhIHN0cmluZy5cIilcbiAgcmV0dXJuIHhcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHByb3BzKCkge1xuICBjb25zdCBuID0gYXJndW1lbnRzLmxlbmd0aCwgdGVtcGxhdGUgPSB7fVxuICBmb3IgKGxldCBpPTAsIGs7IGk8bjsgKytpKVxuICAgIHRlbXBsYXRlW2sgPSBhcmd1bWVudHNbaV1dID0ga1xuICByZXR1cm4gcGljayh0ZW1wbGF0ZSlcbn1cblxuLy8gUHJvdmlkaW5nIGRlZmF1bHRzXG5cbmV4cG9ydCBjb25zdCB2YWx1ZU9yID0gdiA9PiAoX0YsIHhpMnlGLCB4LCBpKSA9PlxuICB4aTJ5Rih2b2lkIDAgIT09IHggJiYgeCAhPT0gbnVsbCA/IHggOiB2LCBpKVxuXG4vLyBBZGFwdGluZyB0byBkYXRhXG5cbmV4cG9ydCBjb25zdCBvckVsc2UgPVxuICBjdXJyeSgoZCwgbCkgPT4gY2hvb3NlKHggPT4gdm9pZCAwICE9PSBnZXRVKGwsIHgpID8gbCA6IGQpKVxuXG4vLyBSZWFkLW9ubHkgbWFwcGluZ1xuXG5leHBvcnQgY29uc3QgdG8gPSB3aTJ4ID0+IChGLCB4aTJ5RiwgdywgaSkgPT5cbiAgKDAsRi5tYXApKGFsd2F5cyh3KSwgeGkyeUYod2kyeCh3LCBpKSwgaSkpXG5cbmV4cG9ydCBjb25zdCBqdXN0ID0geCA9PiB0byhhbHdheXMoeCkpXG5cbi8vIFRyYW5zZm9ybWluZyBkYXRhXG5cbmV4cG9ydCBjb25zdCBwaWNrID0gdGVtcGxhdGUgPT4gKEYsIHhpMnlGLCB4LCBpKSA9PlxuICAoMCxGLm1hcCkoc2V0UGljayh0ZW1wbGF0ZSwgeCksIHhpMnlGKGdldFBpY2sodGVtcGxhdGUsIHgpLCBpKSlcblxuZXhwb3J0IGNvbnN0IHJlcGxhY2UgPSBjdXJyeSgoaW5uLCBvdXQpID0+IHtcbiAgY29uc3QgbzJpID0geCA9PiByZXBsYWNlZChvdXQsIGlubiwgeClcbiAgcmV0dXJuIChGLCB4aTJ5RiwgeCwgaSkgPT4gKDAsRi5tYXApKG8yaSwgeGkyeUYocmVwbGFjZWQoaW5uLCBvdXQsIHgpLCBpKSlcbn0pXG5cbi8vIE9wZXJhdGlvbnMgb24gaXNvbW9ycGhpc21zXG5cbmV4cG9ydCBjb25zdCBnZXRJbnZlcnNlID0gYXJpdHlOKDIsIHNldFUpXG5cbi8vIENyZWF0aW5nIG5ldyBpc29tb3JwaGlzbXNcblxuZXhwb3J0IGNvbnN0IGlzbyA9XG4gIGN1cnJ5KChid2QsIGZ3ZCkgPT4gKEYsIHhpMnlGLCB4LCBpKSA9PiAoMCxGLm1hcCkoZndkLCB4aTJ5Rihid2QoeCksIGkpKSlcblxuLy8gSXNvbW9ycGhpc21zIGFuZCBjb21iaW5hdG9yc1xuXG5leHBvcnQgY29uc3QgaWRlbnRpdHkgPSAoX0YsIHhpMnlGLCB4LCBpKSA9PiB4aTJ5Rih4LCBpKVxuXG5leHBvcnQgY29uc3QgaW52ZXJzZSA9IGlzbyA9PiAoRiwgeGkyeUYsIHgsIGkpID0+XG4gICgwLEYubWFwKSh4ID0+IGdldFUoaXNvLCB4KSwgeGkyeUYoc2V0VShpc28sIHgpLCBpKSlcbiJdfQ==
