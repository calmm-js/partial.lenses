(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.L = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.inverse = exports.identity = exports.iso = exports.getInverse = exports.replace = exports.pick = exports.just = exports.to = exports.orElse = exports.valueOr = exports.prop = exports.index = exports.find = exports.filter = exports.append = exports.rewrite = exports.normalize = exports.define = exports.required = exports.defaults = exports.augment = exports.lens = exports.get = exports.sum = exports.product = exports.minimum = exports.maximum = exports.foldr = exports.foldl = exports.collectMap = exports.collect = exports.collectAs = exports.merge = exports.mergeAs = exports.foldMapOf = exports.concat = exports.concatAs = exports.log = exports.optional = exports.when = exports.choose = exports.choice = exports.chain = exports.set = exports.remove = exports.modify = undefined;
exports.toFunction = toFunction;
exports.compose = compose;
exports.zero = zero;
exports.lazy = lazy;
exports.branch = branch;
exports.elems = elems;
exports.values = values;
exports.sequence = sequence;
exports.findWith = findWith;
exports.props = props;

var _infestines = require("infestines");

//

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

//

function mapPartialIndexU(xi2y, xs) {
  var ys = [],
      n = xs.length;
  for (var i = 0, y; i < n; ++i) {
    if (void 0 !== (y = xi2y(xs[i], i))) ys.push(y);
  }return ys.length ? ys : void 0;
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
  if (!f.of) throw new Error("Traversals require an applicative.");
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

var array0ToUndefined = function array0ToUndefined(xs) {
  return xs.length ? xs : void 0;
};

var object0ToUndefined = function object0ToUndefined(o) {
  if (!(0, _infestines.isObject)(o)) return o;
  for (var k in o) {
    return o;
  }
};

//

var getProp = function getProp(k, o) {
  return (0, _infestines.isObject)(o) ? o[k] : void 0;
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

var nulls = function nulls(n) {
  return Array(n).fill(null);
};

var getIndex = function getIndex(i, xs) {
  return (0, _infestines.isArray)(xs) ? xs[i] : void 0;
};

function setIndex(i, x, xs) {
  if (void 0 !== x) {
    if (!(0, _infestines.isArray)(xs)) return i < 0 ? void 0 : nulls(i).concat([x]);
    var n = xs.length;
    if (n <= i) return xs.concat(nulls(i - n), [x]);
    if (i < 0) return !n ? void 0 : xs;
    var ys = Array(n);
    for (var j = 0; j < n; ++j) {
      ys[j] = xs[j];
    }ys[i] = x;
    return ys;
  } else {
    if ((0, _infestines.isArray)(xs)) {
      var _n = xs.length;
      if (!_n) return void 0;
      if (i < 0 || _n <= i) return xs;
      if (_n === 1) return void 0;
      var _ys = Array(_n - 1);
      for (var _j = 0; _j < i; ++_j) {
        _ys[_j] = xs[_j];
      }for (var _j2 = i + 1; _j2 < _n; ++_j2) {
        _ys[_j2 - 1] = xs[_j2];
      }return _ys;
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
  if (!(typeof o === "function" && o.length === 4)) throw new Error("Expecting an optic.");
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

function branchOn(keys, vals) {
  var n = keys.length;
  return function (A, xi2yA, x, _) {
    var ap = A.ap,
        wait = function wait(x, i) {
      return 0 <= i ? function (y) {
        return wait(setProp(keys[i], y, x), i - 1);
      } : x;
    };
    if ("dev" !== "production") reqApplicative(A);
    var r = (0, A.of)(wait(x, n - 1));
    if (!(0, _infestines.isObject)(x)) x = void 0;
    for (var i = n - 1; 0 <= i; --i) {
      var k = keys[i],
          v = x && x[k];
      r = ap(r, vals ? vals[i](A, xi2yA, v, k) : xi2yA(v, k));
    }
    return (0, A.map)(object0ToUndefined, r);
  };
}

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

var foldMapOf = exports.foldMapOf = (0, _infestines.curry)(function (m, t, xMi2y, s) {
  if ("dev" !== "production" && !foldMapOf.warned) {
    foldMapOf.warned = 1;
    console.warn("partial.lenses: `foldMapOf` has been deprecated and will be removed.  Use `concatAs` or `mergeAs`.");
  }
  return concatAs(xMi2y, m, t, s);
});

var mergeAs = exports.mergeAs = constAs(function (m) {
  return TacnocOf((0, m.empty)(), m.concat);
});

var merge = exports.merge = mergeAs(_infestines.id);

// Folds over traversals

var collectAs = exports.collectAs = (0, _infestines.curry)(function (xi2y, t, s) {
  return toArray(run(t, Collect, xi2y, s)) || [];
});

var collect = exports.collect = collectAs(_infestines.id);

var collectMap = exports.collectMap = (0, _infestines.curry)(function (t, xi2y, s) {
  if ("dev" !== "production" && !collectMap.warned) {
    collectMap.warned = 1;
    console.warn("partial.lenses: `collectMap` has been deprecated and will be removed.  Use `collectAs`.");
  }
  return collectAs(xi2y, t, s);
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
  if ((0, _infestines.isArray)(xs)) {
    return A === Ident ? mapPartialIndexU(xi2yA, xs) : traversePartialIndex(A, xi2yA, xs);
  } else {
    if ("dev" !== "production") reqApplicative(A);
    return (0, A.of)(xs);
  }
}

function values(A, xi2yA, xs, _) {
  if ((0, _infestines.isObject)(xs)) {
    return branchOn((0, _infestines.keys)(xs))(A, xi2yA, xs);
  } else {
    if ("dev" !== "production") reqApplicative(A);
    return (0, A.of)(xs);
  }
}

function sequence(A, xi2yA, xs, i) {
  if ("dev" !== "production" && !sequence.warned) {
    sequence.warned = 1;
    console.warn("partial.lenses: `sequence` has been deprecated and will be removed in the next major version.  Use `elems` when operating on arrays and `values` when operating on (other) objects.");
  }
  return ((0, _infestines.isArray)(xs) ? elems : values)(A, xi2yA, xs, i);
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
    var z = (0, _infestines.dissocPartialU)(0, x);
    if (z) for (var k in template) {
      z[k] = template[k](z);
    }return z;
  }, function (y, x) {
    if ((0, _infestines.isObject)(y)) {
      var _ret = function () {
        if (!(0, _infestines.isObject)(x)) x = void 0;
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
    return array0ToUndefined(((0, _infestines.isArray)(xs) ? xs : _infestines.array0).concat(void 0 !== x ? [x] : _infestines.array0));
  }, xi2yF(void 0, i));
};

var filter = exports.filter = function filter(xi2b) {
  return function (F, xi2yF, xs, i) {
    var ts = void 0,
        fs = _infestines.array0;
    if ((0, _infestines.isArray)(xs)) partitionIntoIndex(xi2b, xs, ts = [], fs = []);
    return (0, F.map)(function (ts) {
      return array0ToUndefined((0, _infestines.isArray)(ts) ? ts.concat(fs) : fs);
    }, xi2yF(ts, i));
  };
};

var find = exports.find = function find(xi2b) {
  return choose(function (xs) {
    if (!(0, _infestines.isArray)(xs)) return 0;
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
  if (!Number.isInteger(x) || x < 0) throw new Error("`index` expects a non-negative integer.");
  return x;
};

// Lensing objects

var prop = exports.prop = "dev" === "production" ? _infestines.id : function (x) {
  if (typeof x !== "string") throw new Error("`prop` expects a string.");
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvcGFydGlhbC5sZW5zZXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7UUMwVmdCLFUsR0FBQSxVO1FBc0NBLE8sR0FBQSxPO1FBK0JBLEksR0FBQSxJO1FBT0EsSSxHQUFBLEk7UUFpRUEsTSxHQUFBLE07UUFXQSxLLEdBQUEsSztRQVlBLE0sR0FBQSxNO1FBVUEsUSxHQUFBLFE7UUF1RkEsUSxHQUFBLFE7UUFtQkEsSyxHQUFBLEs7O0FBbG5CaEI7O0FBa0JBOztBQUVBLFNBQVMsSUFBVCxDQUFjLEVBQWQsRUFBa0IsRUFBbEIsRUFBc0I7QUFBQyxTQUFPLENBQUMsRUFBRCxFQUFLLEVBQUwsQ0FBUDtBQUFnQjs7QUFFdkMsSUFBTSxPQUFPLFNBQVAsSUFBTztBQUFBLFNBQU8sVUFBQyxDQUFELEVBQUksQ0FBSjtBQUFBLFdBQVUsSUFBSSxDQUFKLEVBQU8sQ0FBUCxDQUFWO0FBQUEsR0FBUDtBQUFBLENBQWI7O0FBRUEsSUFBTSxPQUFPLFNBQVAsSUFBTztBQUFBLFNBQUs7QUFBQSxXQUFLLEtBQUssQ0FBTCxLQUFXLENBQVgsR0FBZSxDQUFmLEdBQW1CLENBQXhCO0FBQUEsR0FBTDtBQUFBLENBQWI7O0FBRUE7O0FBRUEsU0FBUyxnQkFBVCxDQUEwQixJQUExQixFQUFnQyxFQUFoQyxFQUFvQztBQUNsQyxNQUFNLEtBQUssRUFBWDtBQUFBLE1BQWUsSUFBRSxHQUFHLE1BQXBCO0FBQ0EsT0FBSyxJQUFJLElBQUUsQ0FBTixFQUFTLENBQWQsRUFBaUIsSUFBRSxDQUFuQixFQUFzQixFQUFFLENBQXhCO0FBQ0UsUUFBSSxLQUFLLENBQUwsTUFBWSxJQUFJLEtBQUssR0FBRyxDQUFILENBQUwsRUFBWSxDQUFaLENBQWhCLENBQUosRUFDRSxHQUFHLElBQUgsQ0FBUSxDQUFSO0FBRkosR0FHQSxPQUFPLEdBQUcsTUFBSCxHQUFZLEVBQVosR0FBaUIsS0FB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QVYsT0FBVTtBQUFBLFNBQU8sVUFBQyxDQUFELEVBQUksS0FBSixFQUFXLENBQVgsRUFBYyxDQUFkO0FBQUEsV0FDNUIsQ0FBQyxHQUFFLEVBQUUsR0FBTCxFQUFVO0FBQUEsYUFBSyxLQUFLLEdBQUwsRUFBVSxDQUFWLENBQUw7QUFBQSxLQUFWLEVBQTZCLE1BQU0sS0FBSyxHQUFMLEVBQVUsQ0FBVixDQUFOLEVBQW9CLENBQXBCLENBQTdCLENBRDRCO0FBQUEsR0FBUDtBQUFBLENBQWhCIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCB7XG4gIGFjeWNsaWNFcXVhbHNVLFxuICBhbHdheXMsXG4gIGFwcGx5VSxcbiAgYXJpdHlOLFxuICBhcnJheTAsXG4gIGFzc29jUGFydGlhbFUsXG4gIGN1cnJ5LFxuICBjdXJyeU4sXG4gIGRpc3NvY1BhcnRpYWxVLFxuICBpZCxcbiAgaXNBcnJheSxcbiAgaXNEZWZpbmVkLFxuICBpc09iamVjdCxcbiAga2V5cyxcbiAgc25kVVxufSBmcm9tIFwiaW5mZXN0aW5lc1wiXG5cbi8vXG5cbmZ1bmN0aW9uIHBhaXIoeDAsIHgxKSB7cmV0dXJuIFt4MCwgeDFdfVxuXG5jb25zdCBmbGlwID0gYm9wID0+ICh4LCB5KSA9PiBib3AoeSwgeClcblxuY29uc3QgdW50byA9IGMgPT4geCA9PiB2b2lkIDAgIT09IHggPyB4IDogY1xuXG4vL1xuXG5mdW5jdGlvbiBtYXBQYXJ0aWFsSW5kZXhVKHhpMnksIHhzKSB7XG4gIGNvbnN0IHlzID0gW10sIG49eHMubGVuZ3RoXG4gIGZvciAobGV0IGk9MCwgeTsgaTxuOyArK2kpXG4gICAgaWYgKHZvaWQgMCAhPT0gKHkgPSB4aTJ5KHhzW2ldLCBpKSkpXG4gICAgICB5cy5wdXNoKHkpXG4gIHJldHVybiB5cy5sZW5ndGggPyB5cyA6IHZvaWQgMFxufVxuXG4vL1xuXG5jb25zdCBBcHBsaWNhdGl2ZSA9IChtYXAsIG9mLCBhcCkgPT4gKHttYXAsIG9mLCBhcH0pXG5cbmNvbnN0IElkZW50ID0gQXBwbGljYXRpdmUoYXBwbHlVLCBpZCwgYXBwbHlVKVxuXG5jb25zdCBDb25zdCA9IHttYXA6IHNuZFV9XG5cbmNvbnN0IFRhY25vY09mID0gKGVtcHR5LCB0YWNub2MpID0+IEFwcGxpY2F0aXZlKHNuZFUsIGFsd2F5cyhlbXB0eSksIHRhY25vYylcblxuY29uc3QgTW9ub2lkID0gKGVtcHR5LCBjb25jYXQpID0+ICh7ZW1wdHk6ICgpID0+IGVtcHR5LCBjb25jYXR9KVxuXG5jb25zdCBNdW0gPSBvcmQgPT5cbiAgTW9ub2lkKHZvaWQgMCwgKHksIHgpID0+IHZvaWQgMCAhPT0geCAmJiAodm9pZCAwID09PSB5IHx8IG9yZCh4LCB5KSkgPyB4IDogeSlcblxuLy9cblxuY29uc3QgcnVuID0gKG8sIEMsIHhpMnlDLCBzLCBpKSA9PiB0b0Z1bmN0aW9uKG8pKEMsIHhpMnlDLCBzLCBpKVxuXG5jb25zdCBjb25zdEFzID0gdG9Db25zdCA9PiBjdXJyeU4oNCwgKHhNaTJ5LCBtKSA9PiB7XG4gIGNvbnN0IEMgPSB0b0NvbnN0KG0pXG4gIHJldHVybiAodCwgcykgPT4gcnVuKHQsIEMsIHhNaTJ5LCBzKVxufSlcblxuLy9cblxuZnVuY3Rpb24gcmVxQXBwbGljYXRpdmUoZikge1xuICBpZiAoIWYub2YpXG4gICAgdGhyb3cgbmV3IEVycm9yKFwiVHJhdmVyc2FscyByZXF1aXJlIGFuIGFwcGxpY2F0aXZlLlwiKVxufVxuXG4vL1xuXG5mdW5jdGlvbiBDb25jYXQobCwgcikge3RoaXMubCA9IGw7IHRoaXMuciA9IHJ9XG5cbmNvbnN0IGlzQ29uY2F0ID0gbiA9PiBuLmNvbnN0cnVjdG9yID09PSBDb25jYXRcblxuY29uc3QgYXAgPSAociwgbCkgPT4gdm9pZCAwICE9PSBsID8gdm9pZCAwICE9PSByID8gbmV3IENvbmNhdChsLCByKSA6IGwgOiByXG5cbmNvbnN0IHJjb25jYXQgPSB0ID0+IGggPT4gYXAodCwgaClcblxuZnVuY3Rpb24gcHVzaFRvKG4sIHlzKSB7XG4gIHdoaWxlIChuICYmIGlzQ29uY2F0KG4pKSB7XG4gICAgY29uc3QgbCA9IG4ubFxuICAgIG4gPSBuLnJcbiAgICBpZiAobCAmJiBpc0NvbmNhdChsKSkge1xuICAgICAgcHVzaFRvKGwubCwgeXMpXG4gICAgICBwdXNoVG8obC5yLCB5cylcbiAgICB9IGVsc2VcbiAgICAgIHlzLnB1c2gobClcbiAgfVxuICB5cy5wdXNoKG4pXG59XG5cbmZ1bmN0aW9uIHRvQXJyYXkobikge1xuICBpZiAodm9pZCAwICE9PSBuKSB7XG4gICAgY29uc3QgeXMgPSBbXVxuICAgIHB1c2hUbyhuLCB5cylcbiAgICByZXR1cm4geXNcbiAgfVxufVxuXG5mdW5jdGlvbiBmb2xkUmVjKGYsIHIsIG4pIHtcbiAgd2hpbGUgKGlzQ29uY2F0KG4pKSB7XG4gICAgY29uc3QgbCA9IG4ubFxuICAgIG4gPSBuLnJcbiAgICByID0gaXNDb25jYXQobClcbiAgICAgID8gZm9sZFJlYyhmLCBmb2xkUmVjKGYsIHIsIGwubCksIGwucilcbiAgICAgIDogZihyLCBsWzBdLCBsWzFdKVxuICB9XG4gIHJldHVybiBmKHIsIG5bMF0sIG5bMV0pXG59XG5cbmNvbnN0IGZvbGQgPSAoZiwgciwgbikgPT4gdm9pZCAwICE9PSBuID8gZm9sZFJlYyhmLCByLCBuKSA6IHJcblxuY29uc3QgQ29sbGVjdCA9IFRhY25vY09mKHZvaWQgMCwgYXApXG5cbi8vXG5cbmZ1bmN0aW9uIHRyYXZlcnNlUGFydGlhbEluZGV4KEEsIHhpMnlBLCB4cykge1xuICBjb25zdCBhcCA9IEEuYXAsIG1hcCA9IEEubWFwXG4gIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpXG4gICAgcmVxQXBwbGljYXRpdmUoQSlcbiAgbGV0IHMgPSAoMCxBLm9mKSh2b2lkIDApLCBpID0geHMubGVuZ3RoXG4gIHdoaWxlIChpLS0pXG4gICAgcyA9IGFwKG1hcChyY29uY2F0LCBzKSwgeGkyeUEoeHNbaV0sIGkpKVxuICByZXR1cm4gbWFwKHRvQXJyYXksIHMpXG59XG5cbi8vXG5cbmNvbnN0IGFycmF5MFRvVW5kZWZpbmVkID0geHMgPT4geHMubGVuZ3RoID8geHMgOiB2b2lkIDBcblxuY29uc3Qgb2JqZWN0MFRvVW5kZWZpbmVkID0gbyA9PiB7XG4gIGlmICghaXNPYmplY3QobykpXG4gICAgcmV0dXJuIG9cbiAgZm9yIChjb25zdCBrIGluIG8pXG4gICAgcmV0dXJuIG9cbn1cblxuLy9cblxuY29uc3QgZ2V0UHJvcCA9IChrLCBvKSA9PiBpc09iamVjdChvKSA/IG9ba10gOiB2b2lkIDBcblxuY29uc3Qgc2V0UHJvcCA9IChrLCB2LCBvKSA9PlxuICB2b2lkIDAgIT09IHYgPyBhc3NvY1BhcnRpYWxVKGssIHYsIG8pIDogZGlzc29jUGFydGlhbFUoaywgbylcblxuY29uc3QgZnVuUHJvcCA9IGsgPT4gKEYsIHhpMnlGLCB4LCBfKSA9PlxuICAoMCxGLm1hcCkodiA9PiBzZXRQcm9wKGssIHYsIHgpLCB4aTJ5RihnZXRQcm9wKGssIHgpLCBrKSlcblxuLy9cblxuY29uc3QgbnVsbHMgPSBuID0+IEFycmF5KG4pLmZpbGwobnVsbClcblxuY29uc3QgZ2V0SW5kZXggPSAoaSwgeHMpID0+IGlzQXJyYXkoeHMpID8geHNbaV0gOiB2b2lkIDBcblxuZnVuY3Rpb24gc2V0SW5kZXgoaSwgeCwgeHMpIHtcbiAgaWYgKHZvaWQgMCAhPT0geCkge1xuICAgIGlmICghaXNBcnJheSh4cykpXG4gICAgICByZXR1cm4gaSA8IDAgPyB2b2lkIDAgOiBudWxscyhpKS5jb25jYXQoW3hdKVxuICAgIGNvbnN0IG4gPSB4cy5sZW5ndGhcbiAgICBpZiAobiA8PSBpKVxuICAgICAgcmV0dXJuIHhzLmNvbmNhdChudWxscyhpIC0gbiksIFt4XSlcbiAgICBpZiAoaSA8IDApXG4gICAgICByZXR1cm4gIW4gPyB2b2lkIDAgOiB4c1xuICAgIGNvbnN0IHlzID0gQXJyYXkobilcbiAgICBmb3IgKGxldCBqPTA7IGo8bjsgKytqKVxuICAgICAgeXNbal0gPSB4c1tqXVxuICAgIHlzW2ldID0geFxuICAgIHJldHVybiB5c1xuICB9IGVsc2Uge1xuICAgIGlmIChpc0FycmF5KHhzKSkge1xuICAgICAgY29uc3QgbiA9IHhzLmxlbmd0aFxuICAgICAgaWYgKCFuKVxuICAgICAgICByZXR1cm4gdm9pZCAwXG4gICAgICBpZiAoaSA8IDAgfHwgbiA8PSBpKVxuICAgICAgICByZXR1cm4geHNcbiAgICAgIGlmIChuID09PSAxKVxuICAgICAgICByZXR1cm4gdm9pZCAwXG4gICAgICBjb25zdCB5cyA9IEFycmF5KG4tMSlcbiAgICAgIGZvciAobGV0IGo9MDsgajxpOyArK2opXG4gICAgICAgIHlzW2pdID0geHNbal1cbiAgICAgIGZvciAobGV0IGo9aSsxOyBqPG47ICsrailcbiAgICAgICAgeXNbai0xXSA9IHhzW2pdXG4gICAgICByZXR1cm4geXNcbiAgICB9XG4gIH1cbn1cblxuY29uc3QgZnVuSW5kZXggPSBpID0+IChGLCB4aTJ5RiwgeHMsIF8pID0+XG4gICgwLEYubWFwKSh5ID0+IHNldEluZGV4KGksIHksIHhzKSwgeGkyeUYoZ2V0SW5kZXgoaSwgeHMpLCBpKSlcblxuLy9cblxuZnVuY3Rpb24gcmVxT3B0aWMobykge1xuICBpZiAoISh0eXBlb2YgbyA9PT0gXCJmdW5jdGlvblwiICYmIG8ubGVuZ3RoID09PSA0KSlcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJFeHBlY3RpbmcgYW4gb3B0aWMuXCIpXG59XG5cbmNvbnN0IGNsb3NlID0gKG8sIEYsIHhpMnlGKSA9PiAoeCwgaSkgPT4gbyhGLCB4aTJ5RiwgeCwgaSlcblxuZnVuY3Rpb24gY29tcG9zZWQob2kwLCBvcykge1xuICBzd2l0Y2ggKG9zLmxlbmd0aCAtIG9pMCkge1xuICAgIGNhc2UgMDogIHJldHVybiBpZGVudGl0eVxuICAgIGNhc2UgMTogIHJldHVybiB0b0Z1bmN0aW9uKG9zW29pMF0pXG4gICAgZGVmYXVsdDogcmV0dXJuIChGLCB4aTJ5RiwgeCwgaSkgPT4ge1xuICAgICAgbGV0IG4gPSBvcy5sZW5ndGhcbiAgICAgIHhpMnlGID0gY2xvc2UodG9GdW5jdGlvbihvc1stLW5dKSwgRiwgeGkyeUYpXG4gICAgICB3aGlsZSAob2kwIDwgLS1uKVxuICAgICAgICB4aTJ5RiA9IGNsb3NlKHRvRnVuY3Rpb24ob3Nbbl0pLCBGLCB4aTJ5RilcbiAgICAgIHJldHVybiBydW4ob3Nbb2kwXSwgRiwgeGkyeUYsIHgsIGkpXG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIHNldFUobywgeCwgcykge1xuICBzd2l0Y2ggKHR5cGVvZiBvKSB7XG4gICAgY2FzZSBcInN0cmluZ1wiOlxuICAgICAgcmV0dXJuIHNldFByb3AobywgeCwgcylcbiAgICBjYXNlIFwibnVtYmVyXCI6XG4gICAgICByZXR1cm4gc2V0SW5kZXgobywgeCwgcylcbiAgICBjYXNlIFwiZnVuY3Rpb25cIjpcbiAgICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpXG4gICAgICAgIHJlcU9wdGljKG8pXG4gICAgICByZXR1cm4gbyhJZGVudCwgYWx3YXlzKHgpLCBzLCB2b2lkIDApXG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBtb2RpZnlDb21wb3NlZChvLCBhbHdheXMoeCksIHMpXG4gIH1cbn1cblxuZnVuY3Rpb24gZ2V0Q29tcG9zZWQobHMsIHMpIHtcbiAgZm9yIChsZXQgaT0wLCBuPWxzLmxlbmd0aCwgbDsgaTxuOyArK2kpXG4gICAgc3dpdGNoICh0eXBlb2YgKGwgPSBsc1tpXSkpIHtcbiAgICAgIGNhc2UgXCJzdHJpbmdcIjogcyA9IGdldFByb3AobCwgcyk7IGJyZWFrXG4gICAgICBjYXNlIFwibnVtYmVyXCI6IHMgPSBnZXRJbmRleChsLCBzKTsgYnJlYWtcbiAgICAgIGRlZmF1bHQ6IHJldHVybiBjb21wb3NlZChpLCBscykoQ29uc3QsIGlkLCBzLCBsc1tpLTFdKVxuICAgIH1cbiAgcmV0dXJuIHNcbn1cblxuZnVuY3Rpb24gZ2V0VShsLCBzKSB7XG4gIHN3aXRjaCAodHlwZW9mIGwpIHtcbiAgICBjYXNlIFwic3RyaW5nXCI6XG4gICAgICByZXR1cm4gZ2V0UHJvcChsLCBzKVxuICAgIGNhc2UgXCJudW1iZXJcIjpcbiAgICAgIHJldHVybiBnZXRJbmRleChsLCBzKVxuICAgIGNhc2UgXCJmdW5jdGlvblwiOlxuICAgICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIilcbiAgICAgICAgcmVxT3B0aWMobClcbiAgICAgIHJldHVybiBsKENvbnN0LCBpZCwgcywgdm9pZCAwKVxuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gZ2V0Q29tcG9zZWQobCwgcylcbiAgfVxufVxuXG5mdW5jdGlvbiBtb2RpZnlDb21wb3NlZChvcywgeGkyeCwgeCkge1xuICBsZXQgbiA9IG9zLmxlbmd0aFxuICBjb25zdCB4cyA9IFtdXG4gIGZvciAobGV0IGk9MCwgbzsgaTxuOyArK2kpIHtcbiAgICB4cy5wdXNoKHgpXG4gICAgc3dpdGNoICh0eXBlb2YgKG8gPSBvc1tpXSkpIHtcbiAgICAgIGNhc2UgXCJzdHJpbmdcIjpcbiAgICAgICAgeCA9IGdldFByb3AobywgeClcbiAgICAgICAgYnJlYWtcbiAgICAgIGNhc2UgXCJudW1iZXJcIjpcbiAgICAgICAgeCA9IGdldEluZGV4KG8sIHgpXG4gICAgICAgIGJyZWFrXG4gICAgICBkZWZhdWx0OlxuICAgICAgICB4ID0gY29tcG9zZWQoaSwgb3MpKElkZW50LCB4aTJ4LCB4LCBvc1tpLTFdKVxuICAgICAgICBuID0gaVxuICAgICAgICBicmVha1xuICAgIH1cbiAgfVxuICBpZiAobiA9PT0gb3MubGVuZ3RoKVxuICAgIHggPSB4aTJ4KHgsIG9zW24tMV0pXG4gIHdoaWxlICgwIDw9IC0tbikge1xuICAgIGNvbnN0IG8gPSBvc1tuXVxuICAgIHN3aXRjaCAodHlwZW9mIG8pIHtcbiAgICAgIGNhc2UgXCJzdHJpbmdcIjogeCA9IHNldFByb3AobywgeCwgeHNbbl0pOyBicmVha1xuICAgICAgY2FzZSBcIm51bWJlclwiOiB4ID0gc2V0SW5kZXgobywgeCwgeHNbbl0pOyBicmVha1xuICAgIH1cbiAgfVxuICByZXR1cm4geFxufVxuXG4vL1xuXG5mdW5jdGlvbiBnZXRQaWNrKHRlbXBsYXRlLCB4KSB7XG4gIGxldCByXG4gIGZvciAoY29uc3QgayBpbiB0ZW1wbGF0ZSkge1xuICAgIGNvbnN0IHYgPSBnZXRVKHRlbXBsYXRlW2tdLCB4KVxuICAgIGlmICh2b2lkIDAgIT09IHYpIHtcbiAgICAgIGlmICghcilcbiAgICAgICAgciA9IHt9XG4gICAgICByW2tdID0gdlxuICAgIH1cbiAgfVxuICByZXR1cm4gclxufVxuXG5jb25zdCBzZXRQaWNrID0gKHRlbXBsYXRlLCB4KSA9PiB2YWx1ZSA9PiB7XG4gIGlmICghaXNPYmplY3QodmFsdWUpKVxuICAgIHZhbHVlID0gdm9pZCAwXG4gIGZvciAoY29uc3QgayBpbiB0ZW1wbGF0ZSlcbiAgICB4ID0gc2V0VSh0ZW1wbGF0ZVtrXSwgdmFsdWUgJiYgdmFsdWVba10sIHgpXG4gIHJldHVybiB4XG59XG5cbi8vXG5cbmNvbnN0IHNob3cgPSAobGFiZWxzLCBkaXIpID0+IHggPT5cbiAgY29uc29sZS5sb2cuYXBwbHkoY29uc29sZSwgbGFiZWxzLmNvbmNhdChbZGlyLCB4XSkpIHx8IHhcblxuZnVuY3Rpb24gYnJhbmNoT24oa2V5cywgdmFscykge1xuICBjb25zdCBuID0ga2V5cy5sZW5ndGhcbiAgcmV0dXJuIChBLCB4aTJ5QSwgeCwgXykgPT4ge1xuICAgIGNvbnN0IGFwID0gQS5hcCxcbiAgICAgICAgICB3YWl0ID0gKHgsIGkpID0+IDAgPD0gaSA/IHkgPT4gd2FpdChzZXRQcm9wKGtleXNbaV0sIHksIHgpLCBpLTEpIDogeFxuICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpXG4gICAgICByZXFBcHBsaWNhdGl2ZShBKVxuICAgIGxldCByID0gKDAsQS5vZikod2FpdCh4LCBuLTEpKVxuICAgIGlmICghaXNPYmplY3QoeCkpXG4gICAgICB4ID0gdm9pZCAwXG4gICAgZm9yIChsZXQgaT1uLTE7IDA8PWk7IC0taSkge1xuICAgICAgY29uc3QgayA9IGtleXNbaV0sIHYgPSB4ICYmIHhba11cbiAgICAgIHIgPSBhcChyLCAodmFscyA/IHZhbHNbaV0oQSwgeGkyeUEsIHYsIGspIDogeGkyeUEodiwgaykpKVxuICAgIH1cbiAgICByZXR1cm4gKDAsQS5tYXApKG9iamVjdDBUb1VuZGVmaW5lZCwgcilcbiAgfVxufVxuXG5jb25zdCBub3JtYWxpemVyID0geGkyeCA9PiAoRiwgeGkyeUYsIHgsIGkpID0+XG4gICgwLEYubWFwKSh4ID0+IHhpMngoeCwgaSksIHhpMnlGKHhpMngoeCwgaSksIGkpKVxuXG5jb25zdCByZXBsYWNlZCA9IChpbm4sIG91dCwgeCkgPT4gYWN5Y2xpY0VxdWFsc1UoeCwgaW5uKSA/IG91dCA6IHhcblxuZnVuY3Rpb24gZmluZEluZGV4KHhpMmIsIHhzKSB7XG4gIGZvciAobGV0IGk9MCwgbj14cy5sZW5ndGg7IGk8bjsgKytpKVxuICAgIGlmICh4aTJiKHhzW2ldLCBpKSlcbiAgICAgIHJldHVybiBpXG4gIHJldHVybiAtMVxufVxuXG5mdW5jdGlvbiBwYXJ0aXRpb25JbnRvSW5kZXgoeGkyYiwgeHMsIHRzLCBmcykge1xuICBmb3IgKGxldCBpPTAsIG49eHMubGVuZ3RoLCB4OyBpPG47ICsraSlcbiAgICAoeGkyYih4ID0geHNbaV0sIGkpID8gdHMgOiBmcykucHVzaCh4KVxufVxuXG4vL1xuXG5leHBvcnQgZnVuY3Rpb24gdG9GdW5jdGlvbihvKSB7XG4gIHN3aXRjaCAodHlwZW9mIG8pIHtcbiAgICBjYXNlIFwic3RyaW5nXCI6XG4gICAgICByZXR1cm4gZnVuUHJvcChvKVxuICAgIGNhc2UgXCJudW1iZXJcIjpcbiAgICAgIHJldHVybiBmdW5JbmRleChvKVxuICAgIGNhc2UgXCJmdW5jdGlvblwiOlxuICAgICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIilcbiAgICAgICAgcmVxT3B0aWMobylcbiAgICAgIHJldHVybiBvXG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBjb21wb3NlZCgwLG8pXG4gIH1cbn1cblxuLy8gT3BlcmF0aW9ucyBvbiBvcHRpY3NcblxuZXhwb3J0IGNvbnN0IG1vZGlmeSA9IGN1cnJ5KChvLCB4aTJ4LCBzKSA9PiB7XG4gIHN3aXRjaCAodHlwZW9mIG8pIHtcbiAgICBjYXNlIFwic3RyaW5nXCI6XG4gICAgICByZXR1cm4gc2V0UHJvcChvLCB4aTJ4KGdldFByb3AobywgcyksIG8pLCBzKVxuICAgIGNhc2UgXCJudW1iZXJcIjpcbiAgICAgIHJldHVybiBzZXRJbmRleChvLCB4aTJ4KGdldEluZGV4KG8sIHMpLCBvKSwgcylcbiAgICBjYXNlIFwiZnVuY3Rpb25cIjpcbiAgICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpXG4gICAgICAgIHJlcU9wdGljKG8pXG4gICAgICByZXR1cm4gbyhJZGVudCwgeGkyeCwgcywgdm9pZCAwKVxuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gbW9kaWZ5Q29tcG9zZWQobywgeGkyeCwgcylcbiAgfVxufSlcblxuZXhwb3J0IGNvbnN0IHJlbW92ZSA9IGN1cnJ5KChvLCBzKSA9PiBzZXRVKG8sIHZvaWQgMCwgcykpXG5cbmV4cG9ydCBjb25zdCBzZXQgPSBjdXJyeShzZXRVKVxuXG4vLyBOZXN0aW5nXG5cbmV4cG9ydCBmdW5jdGlvbiBjb21wb3NlKCkge1xuICBzd2l0Y2ggKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICBjYXNlIDA6IHJldHVybiBpZGVudGl0eVxuICAgIGNhc2UgMTogcmV0dXJuIGFyZ3VtZW50c1swXVxuICAgIGRlZmF1bHQ6IHtcbiAgICAgIGNvbnN0IG4gPSBhcmd1bWVudHMubGVuZ3RoLCBsZW5zZXMgPSBBcnJheShuKVxuICAgICAgZm9yIChsZXQgaT0wOyBpPG47ICsraSlcbiAgICAgICAgbGVuc2VzW2ldID0gYXJndW1lbnRzW2ldXG4gICAgICByZXR1cm4gbGVuc2VzXG4gICAgfVxuICB9XG59XG5cbi8vIFF1ZXJ5aW5nXG5cbmV4cG9ydCBjb25zdCBjaGFpbiA9IGN1cnJ5KCh4aTJ5TywgeE8pID0+XG4gIFt4TywgY2hvb3NlKCh4TSwgaSkgPT4gdm9pZCAwICE9PSB4TSA/IHhpMnlPKHhNLCBpKSA6IHplcm8pXSlcblxuZXhwb3J0IGNvbnN0IGNob2ljZSA9ICguLi5scykgPT4gY2hvb3NlKHggPT4ge1xuICBjb25zdCBpID0gZmluZEluZGV4KGwgPT4gdm9pZCAwICE9PSBnZXRVKGwsIHgpLCBscylcbiAgcmV0dXJuIGkgPCAwID8gemVybyA6IGxzW2ldXG59KVxuXG5leHBvcnQgY29uc3QgY2hvb3NlID0geGlNMm8gPT4gKEMsIHhpMnlDLCB4LCBpKSA9PlxuICBydW4oeGlNMm8oeCwgaSksIEMsIHhpMnlDLCB4LCBpKVxuXG5leHBvcnQgY29uc3Qgd2hlbiA9IHAgPT4gKEMsIHhpMnlDLCB4LCBpKSA9PlxuICBwKHgsIGkpID8geGkyeUMoeCwgaSkgOiB6ZXJvKEMsIHhpMnlDLCB4LCBpKVxuXG5leHBvcnQgY29uc3Qgb3B0aW9uYWwgPSB3aGVuKGlzRGVmaW5lZClcblxuZXhwb3J0IGZ1bmN0aW9uIHplcm8oQywgeGkyeUMsIHgsIGkpIHtcbiAgY29uc3Qgb2YgPSBDLm9mXG4gIHJldHVybiBvZiA/IG9mKHgpIDogKDAsQy5tYXApKGFsd2F5cyh4KSwgeGkyeUModm9pZCAwLCBpKSlcbn1cblxuLy8gUmVjdXJzaW5nXG5cbmV4cG9ydCBmdW5jdGlvbiBsYXp5KG8ybykge1xuICBsZXQgbWVtbyA9IChDLCB4aTJ5QywgeCwgaSkgPT4gKG1lbW8gPSB0b0Z1bmN0aW9uKG8ybyhyZWMpKSkoQywgeGkyeUMsIHgsIGkpXG4gIGZ1bmN0aW9uIHJlYyhDLCB4aTJ5QywgeCwgaSkge3JldHVybiBtZW1vKEMsIHhpMnlDLCB4LCBpKX1cbiAgcmV0dXJuIHJlY1xufVxuXG4vLyBEZWJ1Z2dpbmdcblxuZXhwb3J0IGNvbnN0IGxvZyA9ICguLi5sYWJlbHMpID0+IGlzbyhzaG93KGxhYmVscywgXCJnZXRcIiksIHNob3cobGFiZWxzLCBcInNldFwiKSlcblxuLy8gT3BlcmF0aW9ucyBvbiB0cmF2ZXJzYWxzXG5cbmV4cG9ydCBjb25zdCBjb25jYXRBcyA9IGNvbnN0QXMobSA9PiBUYWNub2NPZigoMCxtLmVtcHR5KSgpLCBmbGlwKG0uY29uY2F0KSkpXG5cbmV4cG9ydCBjb25zdCBjb25jYXQgPSBjb25jYXRBcyhpZClcblxuZXhwb3J0IGNvbnN0IGZvbGRNYXBPZiA9IGN1cnJ5KChtLCB0LCB4TWkyeSwgcykgPT4ge1xuICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiICYmICFmb2xkTWFwT2Yud2FybmVkKSB7XG4gICAgZm9sZE1hcE9mLndhcm5lZCA9IDFcbiAgICBjb25zb2xlLndhcm4oXCJwYXJ0aWFsLmxlbnNlczogYGZvbGRNYXBPZmAgaGFzIGJlZW4gZGVwcmVjYXRlZCBhbmQgd2lsbCBiZSByZW1vdmVkLiAgVXNlIGBjb25jYXRBc2Agb3IgYG1lcmdlQXNgLlwiKVxuICB9XG4gIHJldHVybiBjb25jYXRBcyh4TWkyeSwgbSwgdCwgcylcbn0pXG5cbmV4cG9ydCBjb25zdCBtZXJnZUFzID0gY29uc3RBcyhtID0+IFRhY25vY09mKCgwLG0uZW1wdHkpKCksIG0uY29uY2F0KSlcblxuZXhwb3J0IGNvbnN0IG1lcmdlID0gbWVyZ2VBcyhpZClcblxuLy8gRm9sZHMgb3ZlciB0cmF2ZXJzYWxzXG5cbmV4cG9ydCBjb25zdCBjb2xsZWN0QXMgPSBjdXJyeSgoeGkyeSwgdCwgcykgPT5cbiAgdG9BcnJheShydW4odCwgQ29sbGVjdCwgeGkyeSwgcykpIHx8IFtdKVxuXG5leHBvcnQgY29uc3QgY29sbGVjdCA9IGNvbGxlY3RBcyhpZClcblxuZXhwb3J0IGNvbnN0IGNvbGxlY3RNYXAgPSBjdXJyeSgodCwgeGkyeSwgcykgPT4ge1xuICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiICYmICFjb2xsZWN0TWFwLndhcm5lZCkge1xuICAgIGNvbGxlY3RNYXAud2FybmVkID0gMVxuICAgIGNvbnNvbGUud2FybihcInBhcnRpYWwubGVuc2VzOiBgY29sbGVjdE1hcGAgaGFzIGJlZW4gZGVwcmVjYXRlZCBhbmQgd2lsbCBiZSByZW1vdmVkLiAgVXNlIGBjb2xsZWN0QXNgLlwiKVxuICB9XG4gIHJldHVybiBjb2xsZWN0QXMoeGkyeSwgdCwgcylcbn0pXG5cbmV4cG9ydCBjb25zdCBmb2xkbCA9IGN1cnJ5KChmLCByLCB0LCBzKSA9PlxuICBmb2xkKGYsIHIsIHJ1bih0LCBDb2xsZWN0LCBwYWlyLCBzKSkpXG5cbmV4cG9ydCBjb25zdCBmb2xkciA9IGN1cnJ5KChmLCByLCB0LCBzKSA9PiB7XG4gIGNvbnN0IHhzID0gY29sbGVjdEFzKHBhaXIsIHQsIHMpXG4gIGZvciAobGV0IGk9eHMubGVuZ3RoLTE7IDA8PWk7IC0taSkge1xuICAgIGNvbnN0IHggPSB4c1tpXVxuICAgIHIgPSBmKHIsIHhbMF0sIHhbMV0pXG4gIH1cbiAgcmV0dXJuIHJcbn0pXG5cbmV4cG9ydCBjb25zdCBtYXhpbXVtID0gbWVyZ2UoTXVtKCh4LCB5KSA9PiB4ID4geSkpXG5cbmV4cG9ydCBjb25zdCBtaW5pbXVtID0gbWVyZ2UoTXVtKCh4LCB5KSA9PiB4IDwgeSkpXG5cbmV4cG9ydCBjb25zdCBwcm9kdWN0ID0gbWVyZ2VBcyh1bnRvKDEpLCBNb25vaWQoMSwgKHksIHgpID0+IHggKiB5KSlcblxuZXhwb3J0IGNvbnN0IHN1bSA9IG1lcmdlQXModW50bygwKSwgTW9ub2lkKDAsICh5LCB4KSA9PiB4ICsgeSkpXG5cbi8vIENyZWF0aW5nIG5ldyB0cmF2ZXJzYWxzXG5cbmV4cG9ydCBmdW5jdGlvbiBicmFuY2godGVtcGxhdGUpIHtcbiAgY29uc3Qga2V5cyA9IFtdLCB2YWxzID0gW11cbiAgZm9yIChjb25zdCBrIGluIHRlbXBsYXRlKSB7XG4gICAga2V5cy5wdXNoKGspXG4gICAgdmFscy5wdXNoKHRvRnVuY3Rpb24odGVtcGxhdGVba10pKVxuICB9XG4gIHJldHVybiBicmFuY2hPbihrZXlzLCB2YWxzKVxufVxuXG4vLyBUcmF2ZXJzYWxzIGFuZCBjb21iaW5hdG9yc1xuXG5leHBvcnQgZnVuY3Rpb24gZWxlbXMoQSwgeGkyeUEsIHhzLCBfKSB7XG4gIGlmIChpc0FycmF5KHhzKSkge1xuICAgIHJldHVybiBBID09PSBJZGVudFxuICAgICAgPyBtYXBQYXJ0aWFsSW5kZXhVKHhpMnlBLCB4cylcbiAgICAgIDogdHJhdmVyc2VQYXJ0aWFsSW5kZXgoQSwgeGkyeUEsIHhzKVxuICB9IGVsc2Uge1xuICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpXG4gICAgICByZXFBcHBsaWNhdGl2ZShBKVxuICAgIHJldHVybiAoMCxBLm9mKSh4cylcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gdmFsdWVzKEEsIHhpMnlBLCB4cywgXykge1xuICBpZiAoaXNPYmplY3QoeHMpKSB7XG4gICAgcmV0dXJuIGJyYW5jaE9uKGtleXMoeHMpKShBLCB4aTJ5QSwgeHMpXG4gIH0gZWxzZSB7XG4gICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIilcbiAgICAgIHJlcUFwcGxpY2F0aXZlKEEpXG4gICAgcmV0dXJuICgwLEEub2YpKHhzKVxuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzZXF1ZW5jZShBLCB4aTJ5QSwgeHMsIGkpIHtcbiAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIiAmJiAhc2VxdWVuY2Uud2FybmVkKSB7XG4gICAgc2VxdWVuY2Uud2FybmVkID0gMVxuICAgIGNvbnNvbGUud2FybihcInBhcnRpYWwubGVuc2VzOiBgc2VxdWVuY2VgIGhhcyBiZWVuIGRlcHJlY2F0ZWQgYW5kIHdpbGwgYmUgcmVtb3ZlZCBpbiB0aGUgbmV4dCBtYWpvciB2ZXJzaW9uLiAgVXNlIGBlbGVtc2Agd2hlbiBvcGVyYXRpbmcgb24gYXJyYXlzIGFuZCBgdmFsdWVzYCB3aGVuIG9wZXJhdGluZyBvbiAob3RoZXIpIG9iamVjdHMuXCIpXG4gIH1cbiAgcmV0dXJuIChpc0FycmF5KHhzKSA/IGVsZW1zIDogdmFsdWVzKShBLCB4aTJ5QSwgeHMsIGkpXG59XG5cbi8vIE9wZXJhdGlvbnMgb24gbGVuc2VzXG5cbmV4cG9ydCBjb25zdCBnZXQgPSBjdXJyeShnZXRVKVxuXG4vLyBDcmVhdGluZyBuZXcgbGVuc2VzXG5cbmV4cG9ydCBjb25zdCBsZW5zID0gY3VycnkoKGdldCwgc2V0KSA9PiAoRiwgeGkyeUYsIHgsIGkpID0+XG4gICgwLEYubWFwKSh5ID0+IHNldCh5LCB4LCBpKSwgeGkyeUYoZ2V0KHgsIGkpLCBpKSkpXG5cbi8vIENvbXB1dGluZyBkZXJpdmVkIHByb3BzXG5cbmV4cG9ydCBjb25zdCBhdWdtZW50ID0gdGVtcGxhdGUgPT4gbGVucyhcbiAgeCA9PiB7XG4gICAgY29uc3QgeiA9IGRpc3NvY1BhcnRpYWxVKDAsIHgpXG4gICAgaWYgKHopXG4gICAgICBmb3IgKGNvbnN0IGsgaW4gdGVtcGxhdGUpXG4gICAgICAgIHpba10gPSB0ZW1wbGF0ZVtrXSh6KVxuICAgIHJldHVybiB6XG4gIH0sXG4gICh5LCB4KSA9PiB7XG4gICAgaWYgKGlzT2JqZWN0KHkpKSB7XG4gICAgICBpZiAoIWlzT2JqZWN0KHgpKVxuICAgICAgICB4ID0gdm9pZCAwXG4gICAgICBsZXQgelxuICAgICAgY29uc3Qgc2V0ID0gKGssIHYpID0+IHtcbiAgICAgICAgaWYgKCF6KVxuICAgICAgICAgIHogPSB7fVxuICAgICAgICB6W2tdID0gdlxuICAgICAgfVxuICAgICAgZm9yIChjb25zdCBrIGluIHkpIHtcbiAgICAgICAgaWYgKCEoayBpbiB0ZW1wbGF0ZSkpXG4gICAgICAgICAgc2V0KGssIHlba10pXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBpZiAoeCAmJiBrIGluIHgpXG4gICAgICAgICAgICBzZXQoaywgeFtrXSlcbiAgICAgIH1cbiAgICAgIHJldHVybiB6XG4gICAgfVxuICB9KVxuXG4vLyBFbmZvcmNpbmcgaW52YXJpYW50c1xuXG5leHBvcnQgY29uc3QgZGVmYXVsdHMgPSBvdXQgPT4ge1xuICBjb25zdCBvMnUgPSB4ID0+IHJlcGxhY2VkKG91dCwgdm9pZCAwLCB4KVxuICByZXR1cm4gKEYsIHhpMnlGLCB4LCBpKSA9PiAoMCxGLm1hcCkobzJ1LCB4aTJ5Rih2b2lkIDAgIT09IHggPyB4IDogb3V0LCBpKSlcbn1cblxuZXhwb3J0IGNvbnN0IHJlcXVpcmVkID0gaW5uID0+IHJlcGxhY2UoaW5uLCB2b2lkIDApXG5cbmV4cG9ydCBjb25zdCBkZWZpbmUgPSB2ID0+IG5vcm1hbGl6ZXIodW50byh2KSlcblxuZXhwb3J0IGNvbnN0IG5vcm1hbGl6ZSA9IHhpMnggPT5cbiAgbm9ybWFsaXplcigoeCwgaSkgPT4gdm9pZCAwICE9PSB4ID8geGkyeCh4LCBpKSA6IHZvaWQgMClcblxuZXhwb3J0IGNvbnN0IHJld3JpdGUgPSB5aTJ5ID0+IChGLCB4aTJ5RiwgeCwgaSkgPT5cbiAgKDAsRi5tYXApKHkgPT4gdm9pZCAwICE9PSB5ID8geWkyeSh5LCBpKSA6IHZvaWQgMCwgeGkyeUYoeCwgaSkpXG5cbi8vIExlbnNpbmcgYXJyYXlzXG5cbmV4cG9ydCBjb25zdCBhcHBlbmQgPSAoRiwgeGkyeUYsIHhzLCBpKSA9PlxuICAoMCxGLm1hcCkoeCA9PiBhcnJheTBUb1VuZGVmaW5lZCgoaXNBcnJheSh4cykgPyB4cyA6IGFycmF5MClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmNvbmNhdCh2b2lkIDAgIT09IHggPyBbeF0gOiBhcnJheTApKSxcbiAgICAgICAgICAgIHhpMnlGKHZvaWQgMCwgaSkpXG5cbmV4cG9ydCBjb25zdCBmaWx0ZXIgPSB4aTJiID0+IChGLCB4aTJ5RiwgeHMsIGkpID0+IHtcbiAgbGV0IHRzLCBmcyA9IGFycmF5MFxuICBpZiAoaXNBcnJheSh4cykpXG4gICAgcGFydGl0aW9uSW50b0luZGV4KHhpMmIsIHhzLCB0cyA9IFtdLCBmcyA9IFtdKVxuICByZXR1cm4gKDAsRi5tYXApKHRzID0+IGFycmF5MFRvVW5kZWZpbmVkKGlzQXJyYXkodHMpP3RzLmNvbmNhdChmcyk6ZnMpLFxuICAgICAgICAgICAgICAgICAgIHhpMnlGKHRzLCBpKSlcbn1cblxuZXhwb3J0IGNvbnN0IGZpbmQgPSB4aTJiID0+IGNob29zZSh4cyA9PiB7XG4gIGlmICghaXNBcnJheSh4cykpXG4gICAgcmV0dXJuIDBcbiAgY29uc3QgaSA9IGZpbmRJbmRleCh4aTJiLCB4cylcbiAgcmV0dXJuIGkgPCAwID8gYXBwZW5kIDogaVxufSlcblxuZXhwb3J0IGZ1bmN0aW9uIGZpbmRXaXRoKC4uLmxzKSB7XG4gIGNvbnN0IGxscyA9IGNvbXBvc2UoLi4ubHMpXG4gIHJldHVybiBbZmluZCh4ID0+IHZvaWQgMCAhPT0gZ2V0VShsbHMsIHgpKSwgbGxzXVxufVxuXG5leHBvcnQgY29uc3QgaW5kZXggPSBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gXCJwcm9kdWN0aW9uXCIgPyBpZCA6IHggPT4ge1xuICBpZiAoIU51bWJlci5pc0ludGVnZXIoeCkgfHwgeCA8IDApXG4gICAgdGhyb3cgbmV3IEVycm9yKFwiYGluZGV4YCBleHBlY3RzIGEgbm9uLW5lZ2F0aXZlIGludGVnZXIuXCIpXG4gIHJldHVybiB4XG59XG5cbi8vIExlbnNpbmcgb2JqZWN0c1xuXG5leHBvcnQgY29uc3QgcHJvcCA9IHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSBcInByb2R1Y3Rpb25cIiA/IGlkIDogeCA9PiB7XG4gIGlmICh0eXBlb2YgeCAhPT0gXCJzdHJpbmdcIilcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJgcHJvcGAgZXhwZWN0cyBhIHN0cmluZy5cIilcbiAgcmV0dXJuIHhcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHByb3BzKCkge1xuICBjb25zdCBuID0gYXJndW1lbnRzLmxlbmd0aCwgdGVtcGxhdGUgPSB7fVxuICBmb3IgKGxldCBpPTAsIGs7IGk8bjsgKytpKVxuICAgIHRlbXBsYXRlW2sgPSBhcmd1bWVudHNbaV1dID0ga1xuICByZXR1cm4gcGljayh0ZW1wbGF0ZSlcbn1cblxuLy8gUHJvdmlkaW5nIGRlZmF1bHRzXG5cbmV4cG9ydCBjb25zdCB2YWx1ZU9yID0gdiA9PiAoX0YsIHhpMnlGLCB4LCBpKSA9PlxuICB4aTJ5Rih2b2lkIDAgIT09IHggJiYgeCAhPT0gbnVsbCA/IHggOiB2LCBpKVxuXG4vLyBBZGFwdGluZyB0byBkYXRhXG5cbmV4cG9ydCBjb25zdCBvckVsc2UgPVxuICBjdXJyeSgoZCwgbCkgPT4gY2hvb3NlKHggPT4gdm9pZCAwICE9PSBnZXRVKGwsIHgpID8gbCA6IGQpKVxuXG4vLyBSZWFkLW9ubHkgbWFwcGluZ1xuXG5leHBvcnQgY29uc3QgdG8gPSB3aTJ4ID0+IChGLCB4aTJ5RiwgdywgaSkgPT5cbiAgKDAsRi5tYXApKGFsd2F5cyh3KSwgeGkyeUYod2kyeCh3LCBpKSwgaSkpXG5cbmV4cG9ydCBjb25zdCBqdXN0ID0geCA9PiB0byhhbHdheXMoeCkpXG5cbi8vIFRyYW5zZm9ybWluZyBkYXRhXG5cbmV4cG9ydCBjb25zdCBwaWNrID0gdGVtcGxhdGUgPT4gKEYsIHhpMnlGLCB4LCBpKSA9PlxuICAoMCxGLm1hcCkoc2V0UGljayh0ZW1wbGF0ZSwgeCksIHhpMnlGKGdldFBpY2sodGVtcGxhdGUsIHgpLCBpKSlcblxuZXhwb3J0IGNvbnN0IHJlcGxhY2UgPSBjdXJyeSgoaW5uLCBvdXQpID0+IHtcbiAgY29uc3QgbzJpID0geCA9PiByZXBsYWNlZChvdXQsIGlubiwgeClcbiAgcmV0dXJuIChGLCB4aTJ5RiwgeCwgaSkgPT4gKDAsRi5tYXApKG8yaSwgeGkyeUYocmVwbGFjZWQoaW5uLCBvdXQsIHgpLCBpKSlcbn0pXG5cbi8vIE9wZXJhdGlvbnMgb24gaXNvbW9ycGhpc21zXG5cbmV4cG9ydCBjb25zdCBnZXRJbnZlcnNlID0gYXJpdHlOKDIsIHNldFUpXG5cbi8vIENyZWF0aW5nIG5ldyBpc29tb3JwaGlzbXNcblxuZXhwb3J0IGNvbnN0IGlzbyA9XG4gIGN1cnJ5KChid2QsIGZ3ZCkgPT4gKEYsIHhpMnlGLCB4LCBpKSA9PiAoMCxGLm1hcCkoZndkLCB4aTJ5Rihid2QoeCksIGkpKSlcblxuLy8gSXNvbW9ycGhpc21zIGFuZCBjb21iaW5hdG9yc1xuXG5leHBvcnQgY29uc3QgaWRlbnRpdHkgPSAoX0YsIHhpMnlGLCB4LCBpKSA9PiB4aTJ5Rih4LCBpKVxuXG5leHBvcnQgY29uc3QgaW52ZXJzZSA9IGlzbyA9PiAoRiwgeGkyeUYsIHgsIGkpID0+XG4gICgwLEYubWFwKSh4ID0+IGdldFUoaXNvLCB4KSwgeGkyeUYoc2V0VShpc28sIHgpLCBpKSlcbiJdfQ==
