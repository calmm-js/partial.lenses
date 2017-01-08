(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.L = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.inverse = exports.identity = exports.iso = exports.getInverse = exports.replace = exports.pick = exports.just = exports.to = exports.orElse = exports.valueOr = exports.find = exports.filter = exports.append = exports.rewrite = exports.normalize = exports.define = exports.required = exports.defaults = exports.augment = exports.lens = exports.get = exports.sum = exports.product = exports.minimum = exports.maximum = exports.foldr = exports.foldl = exports.collectMap = exports.collect = exports.collectAs = exports.merge = exports.mergeAs = exports.foldMapOf = exports.concat = exports.concatAs = exports.log = exports.optional = exports.when = exports.choose = exports.choice = exports.chain = exports.set = exports.remove = exports.modify = undefined;
exports.toFunction = toFunction;
exports.compose = compose;
exports.zero = zero;
exports.lazy = lazy;
exports.branch = branch;
exports.sequence = sequence;
exports.findWith = findWith;
exports.index = index;
exports.prop = prop;
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
    return (0, _infestines.isDefined)(x) ? x : c;
  };
};

//

function mapPartialIndexU(xi2y, xs) {
  var ys = [],
      n = xs.length;
  for (var i = 0, y; i < n; ++i) {
    if ((0, _infestines.isDefined)(y = xi2y(xs[i], i))) ys.push(y);
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
    return (0, _infestines.isDefined)(x) && (!(0, _infestines.isDefined)(y) || ord(x, y)) ? x : y;
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
  if ("dev" !== "production" && !f) throw new Error("Traversals require an applicative.");
  return f;
}

//

function Concat(l, r) {
  this.l = l;this.r = r;
}

var isConcat = function isConcat(n) {
  return n.constructor === Concat;
};

var ap = function ap(r, l) {
  return (0, _infestines.isDefined)(l) ? (0, _infestines.isDefined)(r) ? new Concat(l, r) : l : r;
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
  if ((0, _infestines.isDefined)(n)) {
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
  return (0, _infestines.isDefined)(n) ? foldRec(f, r, n) : r;
};

var Collect = TacnocOf(void 0, ap);

//

function traversePartialIndex(A, xi2yA, xs) {
  var ap = A.ap,
      map = A.map;
  var s = reqApplicative(A.of)(void 0),
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

var isProp = function isProp(x) {
  return typeof x === "string";
};

var getProp = function getProp(k, o) {
  return (0, _infestines.isObject)(o) ? o[k] : void 0;
};

var setProp = function setProp(k, v, o) {
  return (0, _infestines.isDefined)(v) ? (0, _infestines.assocPartialU)(k, v, o) : (0, _infestines.dissocPartialU)(k, o);
};

var funProp = function funProp(k) {
  return function (F, xi2yF, x, _) {
    return (0, F.map)(function (v) {
      return setProp(k, v, x);
    }, xi2yF(getProp(k, x), k));
  };
};

//

var isIndex = function isIndex(x) {
  return Number.isInteger(x) && 0 <= x;
};

var nulls = function nulls(n) {
  return Array(n).fill(null);
};

var getIndex = function getIndex(i, xs) {
  return (0, _infestines.isArray)(xs) ? xs[i] : void 0;
};

function setIndex(i, x, xs) {
  if ((0, _infestines.isDefined)(x)) {
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

var seemsOptic = function seemsOptic(x) {
  return typeof x === "function" && x.length === 4;
};

function optic(o) {
  if ("dev" !== "production" && !seemsOptic(o)) throw new Error("Expecting an optic.");
  return o;
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
      return optic(o)(Ident, (0, _infestines.always)(x), s, void 0);
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
      return optic(l)(Const, _infestines.id, s, void 0);
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
    if ((0, _infestines.isDefined)(v)) {
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
    var r = reqApplicative(A.of)(wait(x, n - 1));
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
      return optic(o);
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
      return optic(o)(Ident, xi2x, s, void 0);
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
    return (0, _infestines.isDefined)(xM) ? xi2yO(xM, i) : zero;
  })];
});

var choice = exports.choice = function choice() {
  for (var _len = arguments.length, ls = Array(_len), _key = 0; _key < _len; _key++) {
    ls[_key] = arguments[_key];
  }

  return choose(function (x) {
    var i = findIndex(function (l) {
      return (0, _infestines.isDefined)(getU(l, x));
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

function sequence(A, xi2yA, xs, _) {
  if ((0, _infestines.isArray)(xs)) return A === Ident ? mapPartialIndexU(xi2yA, xs) : traversePartialIndex(A, xi2yA, xs);else if ((0, _infestines.isObject)(xs)) return branchOn((0, _infestines.keys)(xs))(A, xi2yA, xs);else return reqApplicative(A.of)(xs);
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
    return (0, F.map)(o2u, xi2yF((0, _infestines.isDefined)(x) ? x : out, i));
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
    return (0, _infestines.isDefined)(x) ? xi2x(x, i) : void 0;
  });
};

var rewrite = exports.rewrite = function rewrite(yi2y) {
  return function (F, xi2yF, x, i) {
    return (0, F.map)(function (y) {
      return (0, _infestines.isDefined)(y) ? yi2y(y, i) : void 0;
    }, xi2yF(x, i));
  };
};

// Lensing arrays

var append = exports.append = function append(F, xi2yF, xs, i) {
  return (0, F.map)(function (x) {
    return array0ToUndefined(((0, _infestines.isArray)(xs) ? xs : _infestines.array0).concat((0, _infestines.isDefined)(x) ? [x] : _infestines.array0));
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
    return (0, _infestines.isDefined)(getU(lls, x));
  }), lls];
}

function index(x) {
  if ("dev" !== "production" && !isIndex(x)) throw new Error("`index` expects a non-negative integer.");
  return x;
}

// Lensing objects

function prop(x) {
  if ("dev" !== "production" && !isProp(x)) throw new Error("`prop` expects a string.");
  return x;
}

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
    return xi2yF((0, _infestines.isDefined)(x) && x !== null ? x : v, i);
  };
};

// Adapting to data

var orElse = exports.orElse = (0, _infestines.curry)(function (d, l) {
  return choose(function (x) {
    return (0, _infestines.isDefined)(getU(l, x)) ? l : d;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvcGFydGlhbC5sZW5zZXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7UUNrVmdCLFUsR0FBQSxVO1FBMEJBLE8sR0FBQSxPO1FBK0JBLEksR0FBQSxJO1FBT0EsSSxHQUFBLEk7UUFpRUEsTSxHQUFBLE07UUFXQSxRLEdBQUEsUTtRQTBGQSxRLEdBQUEsUTtRQUtBLEssR0FBQSxLO1FBUUEsSSxHQUFBLEk7UUFNQSxLLEdBQUEsSzs7QUEza0JoQjs7QUFrQkE7O0FBRUEsU0FBUyxJQUFULENBQWMsRUFBZCxFQUFrQixFQUFsQixFQUFzQjtBQUFDLFNBQU8sQ0FBQyxFQUFELEVBQUssRUFBTCxDQUFQO0FBQWdCOztBQUV2QyxJQUFNLE9BQU8sU0FBUCxJQUFPO0FBQUEsU0FBTyxVQUFDLENBQUQsRUFBSSxDQUFKO0FBQUEsV0FBVSxJQUFJLENBQUosRUFBTyxDQUFQLENBQVY7QUFBQSxHQUFQO0FBQUEsQ0FBYjs7QUFFQSxJQUFNLE9BQU8sU0FBUCxJQUFPO0FBQUEsU0FBSztBQUFBLFdBQUssMkJBQVUsQ0FBVixJQUFlLENBQWYsR0FBbUIsQ0FBeEI7QUFBQSxHQUFMO0FBQUEsQ0FBYjs7QUFFQTs7QUFFQSxTQUFTLGdCQUFULENBQTBCLElBQTFCLEVBQWdDLEVBQWhDLEVBQW9DO0FBQ2xDLE1BQU0sS0FBSyxFQUFYO0FBQUEsTUFBZSxJQUFFLEdBQUcsTUFBcEI7QUFDQSxPQUFLLElBQUksSUFBRSxDQUFOLEVBQVMsQ0FBZCxFQUFpQixJQUFFLENBQW5CLEVBQXNCLEVBQUUsQ0FBeEI7QUFDRSxRQUFJLDJCQUFVLElBQUksS0FBSyxHQUFHLENBQUgsQ0FBTCxFQUFZLENBQVosQ0FBZCxDQUFKLEVBQ0UsR0FBRyxJQUFILENBQVEsQ0FBUjtBQUZKLEdBR0EsT0FBTyxHQUFHLE1BQUgsR0FBWSxFQUFaLEdBQWlCLEtBQUssQ0FBN0I7QUFDRDs7QUFFRDs7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QXFCLE1BQU0sQ0FBTixFQUFTLENBQVQsQ0FBckI7QUFBQSxDQUFqQjs7QUFFQSxJQUFNLDRCQUFVLFNBQVYsT0FBVTtBQUFBLFNBQU8sVUFBQyxDQUFELEVBQUksS0FBSixFQUFXLENBQVgsRUFBYyxDQUFkO0FBQUEsV0FDNUIsQ0FBQyxHQUFFLEVBQUUsR0FBTCxFQUFVO0FBQUEsYUFBSyxLQUFLLEdBQUwsRUFBVSxDQUFWLENBQUw7QUFBQSxLQUFWLEVBQTZCLE1BQU0sS0FBSyxHQUFMLEVBQVUsQ0FBVixDQUFOLEVBQW9CLENBQXBCLENBQTdCLENBRDRCO0FBQUEsR0FBUDtBQUFBLENBQWhCIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCB7XG4gIGFjeWNsaWNFcXVhbHNVLFxuICBhbHdheXMsXG4gIGFwcGx5VSxcbiAgYXJpdHlOLFxuICBhcnJheTAsXG4gIGFzc29jUGFydGlhbFUsXG4gIGN1cnJ5LFxuICBjdXJyeU4sXG4gIGRpc3NvY1BhcnRpYWxVLFxuICBpZCxcbiAgaXNBcnJheSxcbiAgaXNEZWZpbmVkLFxuICBpc09iamVjdCxcbiAga2V5cyxcbiAgc25kVVxufSBmcm9tIFwiaW5mZXN0aW5lc1wiXG5cbi8vXG5cbmZ1bmN0aW9uIHBhaXIoeDAsIHgxKSB7cmV0dXJuIFt4MCwgeDFdfVxuXG5jb25zdCBmbGlwID0gYm9wID0+ICh4LCB5KSA9PiBib3AoeSwgeClcblxuY29uc3QgdW50byA9IGMgPT4geCA9PiBpc0RlZmluZWQoeCkgPyB4IDogY1xuXG4vL1xuXG5mdW5jdGlvbiBtYXBQYXJ0aWFsSW5kZXhVKHhpMnksIHhzKSB7XG4gIGNvbnN0IHlzID0gW10sIG49eHMubGVuZ3RoXG4gIGZvciAobGV0IGk9MCwgeTsgaTxuOyArK2kpXG4gICAgaWYgKGlzRGVmaW5lZCh5ID0geGkyeSh4c1tpXSwgaSkpKVxuICAgICAgeXMucHVzaCh5KVxuICByZXR1cm4geXMubGVuZ3RoID8geXMgOiB2b2lkIDBcbn1cblxuLy9cblxuY29uc3QgQXBwbGljYXRpdmUgPSAobWFwLCBvZiwgYXApID0+ICh7bWFwLCBvZiwgYXB9KVxuXG5jb25zdCBJZGVudCA9IEFwcGxpY2F0aXZlKGFwcGx5VSwgaWQsIGFwcGx5VSlcblxuY29uc3QgQ29uc3QgPSB7bWFwOiBzbmRVfVxuXG5jb25zdCBUYWNub2NPZiA9IChlbXB0eSwgdGFjbm9jKSA9PiBBcHBsaWNhdGl2ZShzbmRVLCBhbHdheXMoZW1wdHkpLCB0YWNub2MpXG5cbmNvbnN0IE1vbm9pZCA9IChlbXB0eSwgY29uY2F0KSA9PiAoe2VtcHR5OiAoKSA9PiBlbXB0eSwgY29uY2F0fSlcblxuY29uc3QgTXVtID0gb3JkID0+XG4gIE1vbm9pZCh2b2lkIDAsICh5LCB4KSA9PiBpc0RlZmluZWQoeCkgJiYgKCFpc0RlZmluZWQoeSkgfHwgb3JkKHgsIHkpKSA/IHggOiB5KVxuXG4vL1xuXG5jb25zdCBydW4gPSAobywgQywgeGkyeUMsIHMsIGkpID0+IHRvRnVuY3Rpb24obykoQywgeGkyeUMsIHMsIGkpXG5cbmNvbnN0IGNvbnN0QXMgPSB0b0NvbnN0ID0+IGN1cnJ5Tig0LCAoeE1pMnksIG0pID0+IHtcbiAgY29uc3QgQyA9IHRvQ29uc3QobSlcbiAgcmV0dXJuICh0LCBzKSA9PiBydW4odCwgQywgeE1pMnksIHMpXG59KVxuXG4vL1xuXG5mdW5jdGlvbiByZXFBcHBsaWNhdGl2ZShmKSB7XG4gIGlmIChcImRldlwiICE9PSBcInByb2R1Y3Rpb25cIiAmJiAhZilcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJUcmF2ZXJzYWxzIHJlcXVpcmUgYW4gYXBwbGljYXRpdmUuXCIpXG4gIHJldHVybiBmXG59XG5cbi8vXG5cbmZ1bmN0aW9uIENvbmNhdChsLCByKSB7dGhpcy5sID0gbDsgdGhpcy5yID0gcn1cblxuY29uc3QgaXNDb25jYXQgPSBuID0+IG4uY29uc3RydWN0b3IgPT09IENvbmNhdFxuXG5jb25zdCBhcCA9IChyLCBsKSA9PiBpc0RlZmluZWQobCkgPyBpc0RlZmluZWQocikgPyBuZXcgQ29uY2F0KGwsIHIpIDogbCA6IHJcblxuY29uc3QgcmNvbmNhdCA9IHQgPT4gaCA9PiBhcCh0LCBoKVxuXG5mdW5jdGlvbiBwdXNoVG8obiwgeXMpIHtcbiAgd2hpbGUgKG4gJiYgaXNDb25jYXQobikpIHtcbiAgICBjb25zdCBsID0gbi5sXG4gICAgbiA9IG4uclxuICAgIGlmIChsICYmIGlzQ29uY2F0KGwpKSB7XG4gICAgICBwdXNoVG8obC5sLCB5cylcbiAgICAgIHB1c2hUbyhsLnIsIHlzKVxuICAgIH0gZWxzZVxuICAgICAgeXMucHVzaChsKVxuICB9XG4gIHlzLnB1c2gobilcbn1cblxuZnVuY3Rpb24gdG9BcnJheShuKSB7XG4gIGlmIChpc0RlZmluZWQobikpIHtcbiAgICBjb25zdCB5cyA9IFtdXG4gICAgcHVzaFRvKG4sIHlzKVxuICAgIHJldHVybiB5c1xuICB9XG59XG5cbmZ1bmN0aW9uIGZvbGRSZWMoZiwgciwgbikge1xuICB3aGlsZSAoaXNDb25jYXQobikpIHtcbiAgICBjb25zdCBsID0gbi5sXG4gICAgbiA9IG4uclxuICAgIHIgPSBpc0NvbmNhdChsKVxuICAgICAgPyBmb2xkUmVjKGYsIGZvbGRSZWMoZiwgciwgbC5sKSwgbC5yKVxuICAgICAgOiBmKHIsIGxbMF0sIGxbMV0pXG4gIH1cbiAgcmV0dXJuIGYociwgblswXSwgblsxXSlcbn1cblxuY29uc3QgZm9sZCA9IChmLCByLCBuKSA9PiBpc0RlZmluZWQobikgPyBmb2xkUmVjKGYsIHIsIG4pIDogclxuXG5jb25zdCBDb2xsZWN0ID0gVGFjbm9jT2Yodm9pZCAwLCBhcClcblxuLy9cblxuZnVuY3Rpb24gdHJhdmVyc2VQYXJ0aWFsSW5kZXgoQSwgeGkyeUEsIHhzKSB7XG4gIGNvbnN0IGFwID0gQS5hcCwgbWFwID0gQS5tYXBcbiAgbGV0IHMgPSByZXFBcHBsaWNhdGl2ZShBLm9mKSh2b2lkIDApLCBpID0geHMubGVuZ3RoXG4gIHdoaWxlIChpLS0pXG4gICAgcyA9IGFwKG1hcChyY29uY2F0LCBzKSwgeGkyeUEoeHNbaV0sIGkpKVxuICByZXR1cm4gbWFwKHRvQXJyYXksIHMpXG59XG5cbi8vXG5cbmNvbnN0IGFycmF5MFRvVW5kZWZpbmVkID0geHMgPT4geHMubGVuZ3RoID8geHMgOiB2b2lkIDBcblxuY29uc3Qgb2JqZWN0MFRvVW5kZWZpbmVkID0gbyA9PiB7XG4gIGlmICghaXNPYmplY3QobykpXG4gICAgcmV0dXJuIG9cbiAgZm9yIChjb25zdCBrIGluIG8pXG4gICAgcmV0dXJuIG9cbn1cblxuLy9cblxuY29uc3QgaXNQcm9wID0geCA9PiB0eXBlb2YgeCA9PT0gXCJzdHJpbmdcIlxuXG5jb25zdCBnZXRQcm9wID0gKGssIG8pID0+IGlzT2JqZWN0KG8pID8gb1trXSA6IHZvaWQgMFxuXG5jb25zdCBzZXRQcm9wID0gKGssIHYsIG8pID0+XG4gIGlzRGVmaW5lZCh2KSA/IGFzc29jUGFydGlhbFUoaywgdiwgbykgOiBkaXNzb2NQYXJ0aWFsVShrLCBvKVxuXG5jb25zdCBmdW5Qcm9wID0gayA9PiAoRiwgeGkyeUYsIHgsIF8pID0+XG4gICgwLEYubWFwKSh2ID0+IHNldFByb3AoaywgdiwgeCksIHhpMnlGKGdldFByb3AoaywgeCksIGspKVxuXG4vL1xuXG5jb25zdCBpc0luZGV4ID0geCA9PiBOdW1iZXIuaXNJbnRlZ2VyKHgpICYmIDAgPD0geFxuXG5jb25zdCBudWxscyA9IG4gPT4gQXJyYXkobikuZmlsbChudWxsKVxuXG5jb25zdCBnZXRJbmRleCA9IChpLCB4cykgPT4gaXNBcnJheSh4cykgPyB4c1tpXSA6IHZvaWQgMFxuXG5mdW5jdGlvbiBzZXRJbmRleChpLCB4LCB4cykge1xuICBpZiAoaXNEZWZpbmVkKHgpKSB7XG4gICAgaWYgKCFpc0FycmF5KHhzKSlcbiAgICAgIHJldHVybiBpIDwgMCA/IHZvaWQgMCA6IG51bGxzKGkpLmNvbmNhdChbeF0pXG4gICAgY29uc3QgbiA9IHhzLmxlbmd0aFxuICAgIGlmIChuIDw9IGkpXG4gICAgICByZXR1cm4geHMuY29uY2F0KG51bGxzKGkgLSBuKSwgW3hdKVxuICAgIGlmIChpIDwgMClcbiAgICAgIHJldHVybiAhbiA/IHZvaWQgMCA6IHhzXG4gICAgY29uc3QgeXMgPSBBcnJheShuKVxuICAgIGZvciAobGV0IGo9MDsgajxuOyArK2opXG4gICAgICB5c1tqXSA9IHhzW2pdXG4gICAgeXNbaV0gPSB4XG4gICAgcmV0dXJuIHlzXG4gIH0gZWxzZSB7XG4gICAgaWYgKGlzQXJyYXkoeHMpKSB7XG4gICAgICBjb25zdCBuID0geHMubGVuZ3RoXG4gICAgICBpZiAoIW4pXG4gICAgICAgIHJldHVybiB2b2lkIDBcbiAgICAgIGlmIChpIDwgMCB8fCBuIDw9IGkpXG4gICAgICAgIHJldHVybiB4c1xuICAgICAgaWYgKG4gPT09IDEpXG4gICAgICAgIHJldHVybiB2b2lkIDBcbiAgICAgIGNvbnN0IHlzID0gQXJyYXkobi0xKVxuICAgICAgZm9yIChsZXQgaj0wOyBqPGk7ICsrailcbiAgICAgICAgeXNbal0gPSB4c1tqXVxuICAgICAgZm9yIChsZXQgaj1pKzE7IGo8bjsgKytqKVxuICAgICAgICB5c1tqLTFdID0geHNbal1cbiAgICAgIHJldHVybiB5c1xuICAgIH1cbiAgfVxufVxuXG5jb25zdCBmdW5JbmRleCA9IGkgPT4gKEYsIHhpMnlGLCB4cywgXykgPT5cbiAgKDAsRi5tYXApKHkgPT4gc2V0SW5kZXgoaSwgeSwgeHMpLCB4aTJ5RihnZXRJbmRleChpLCB4cyksIGkpKVxuXG4vL1xuXG5jb25zdCBzZWVtc09wdGljID0geCA9PiB0eXBlb2YgeCA9PT0gXCJmdW5jdGlvblwiICYmIHgubGVuZ3RoID09PSA0XG5cbmZ1bmN0aW9uIG9wdGljKG8pIHtcbiAgaWYgKFwiZGV2XCIgIT09IFwicHJvZHVjdGlvblwiICYmICFzZWVtc09wdGljKG8pKVxuICAgIHRocm93IG5ldyBFcnJvcihcIkV4cGVjdGluZyBhbiBvcHRpYy5cIilcbiAgcmV0dXJuIG9cbn1cblxuY29uc3QgY2xvc2UgPSAobywgRiwgeGkyeUYpID0+ICh4LCBpKSA9PiBvKEYsIHhpMnlGLCB4LCBpKVxuXG5mdW5jdGlvbiBjb21wb3NlZChvaTAsIG9zKSB7XG4gIHN3aXRjaCAob3MubGVuZ3RoIC0gb2kwKSB7XG4gICAgY2FzZSAwOiAgcmV0dXJuIGlkZW50aXR5XG4gICAgY2FzZSAxOiAgcmV0dXJuIHRvRnVuY3Rpb24ob3Nbb2kwXSlcbiAgICBkZWZhdWx0OiByZXR1cm4gKEYsIHhpMnlGLCB4LCBpKSA9PiB7XG4gICAgICBsZXQgbiA9IG9zLmxlbmd0aFxuICAgICAgeGkyeUYgPSBjbG9zZSh0b0Z1bmN0aW9uKG9zWy0tbl0pLCBGLCB4aTJ5RilcbiAgICAgIHdoaWxlIChvaTAgPCAtLW4pXG4gICAgICAgIHhpMnlGID0gY2xvc2UodG9GdW5jdGlvbihvc1tuXSksIEYsIHhpMnlGKVxuICAgICAgcmV0dXJuIHJ1bihvc1tvaTBdLCBGLCB4aTJ5RiwgeCwgaSlcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gc2V0VShvLCB4LCBzKSB7XG4gIHN3aXRjaCAodHlwZW9mIG8pIHtcbiAgICBjYXNlIFwic3RyaW5nXCI6ICAgcmV0dXJuIHNldFByb3AobywgeCwgcylcbiAgICBjYXNlIFwibnVtYmVyXCI6ICAgcmV0dXJuIHNldEluZGV4KG8sIHgsIHMpXG4gICAgY2FzZSBcImZ1bmN0aW9uXCI6IHJldHVybiBvcHRpYyhvKShJZGVudCwgYWx3YXlzKHgpLCBzLCB2b2lkIDApXG4gICAgZGVmYXVsdDogICAgICAgICByZXR1cm4gbW9kaWZ5Q29tcG9zZWQobywgYWx3YXlzKHgpLCBzKVxuICB9XG59XG5cbmZ1bmN0aW9uIGdldENvbXBvc2VkKGxzLCBzKSB7XG4gIGZvciAobGV0IGk9MCwgbj1scy5sZW5ndGgsIGw7IGk8bjsgKytpKVxuICAgIHN3aXRjaCAodHlwZW9mIChsID0gbHNbaV0pKSB7XG4gICAgICBjYXNlIFwic3RyaW5nXCI6IHMgPSBnZXRQcm9wKGwsIHMpOyBicmVha1xuICAgICAgY2FzZSBcIm51bWJlclwiOiBzID0gZ2V0SW5kZXgobCwgcyk7IGJyZWFrXG4gICAgICBkZWZhdWx0OiByZXR1cm4gY29tcG9zZWQoaSwgbHMpKENvbnN0LCBpZCwgcywgbHNbaS0xXSlcbiAgICB9XG4gIHJldHVybiBzXG59XG5cbmZ1bmN0aW9uIGdldFUobCwgcykge1xuICBzd2l0Y2ggKHR5cGVvZiBsKSB7XG4gICAgY2FzZSBcInN0cmluZ1wiOiAgIHJldHVybiBnZXRQcm9wKGwsIHMpXG4gICAgY2FzZSBcIm51bWJlclwiOiAgIHJldHVybiBnZXRJbmRleChsLCBzKVxuICAgIGNhc2UgXCJmdW5jdGlvblwiOiByZXR1cm4gb3B0aWMobCkoQ29uc3QsIGlkLCBzLCB2b2lkIDApXG4gICAgZGVmYXVsdDogICAgICAgICByZXR1cm4gZ2V0Q29tcG9zZWQobCwgcylcbiAgfVxufVxuXG5mdW5jdGlvbiBtb2RpZnlDb21wb3NlZChvcywgeGkyeCwgeCkge1xuICBsZXQgbiA9IG9zLmxlbmd0aFxuICBjb25zdCB4cyA9IFtdXG4gIGZvciAobGV0IGk9MCwgbzsgaTxuOyArK2kpIHtcbiAgICB4cy5wdXNoKHgpXG4gICAgc3dpdGNoICh0eXBlb2YgKG8gPSBvc1tpXSkpIHtcbiAgICAgIGNhc2UgXCJzdHJpbmdcIjpcbiAgICAgICAgeCA9IGdldFByb3AobywgeClcbiAgICAgICAgYnJlYWtcbiAgICAgIGNhc2UgXCJudW1iZXJcIjpcbiAgICAgICAgeCA9IGdldEluZGV4KG8sIHgpXG4gICAgICAgIGJyZWFrXG4gICAgICBkZWZhdWx0OlxuICAgICAgICB4ID0gY29tcG9zZWQoaSwgb3MpKElkZW50LCB4aTJ4LCB4LCBvc1tpLTFdKVxuICAgICAgICBuID0gaVxuICAgICAgICBicmVha1xuICAgIH1cbiAgfVxuICBpZiAobiA9PT0gb3MubGVuZ3RoKVxuICAgIHggPSB4aTJ4KHgsIG9zW24tMV0pXG4gIHdoaWxlICgwIDw9IC0tbikge1xuICAgIGNvbnN0IG8gPSBvc1tuXVxuICAgIHN3aXRjaCAodHlwZW9mIG8pIHtcbiAgICAgIGNhc2UgXCJzdHJpbmdcIjogeCA9IHNldFByb3AobywgeCwgeHNbbl0pOyBicmVha1xuICAgICAgY2FzZSBcIm51bWJlclwiOiB4ID0gc2V0SW5kZXgobywgeCwgeHNbbl0pOyBicmVha1xuICAgIH1cbiAgfVxuICByZXR1cm4geFxufVxuXG4vL1xuXG5mdW5jdGlvbiBnZXRQaWNrKHRlbXBsYXRlLCB4KSB7XG4gIGxldCByXG4gIGZvciAoY29uc3QgayBpbiB0ZW1wbGF0ZSkge1xuICAgIGNvbnN0IHYgPSBnZXRVKHRlbXBsYXRlW2tdLCB4KVxuICAgIGlmIChpc0RlZmluZWQodikpIHtcbiAgICAgIGlmICghcilcbiAgICAgICAgciA9IHt9XG4gICAgICByW2tdID0gdlxuICAgIH1cbiAgfVxuICByZXR1cm4gclxufVxuXG5jb25zdCBzZXRQaWNrID0gKHRlbXBsYXRlLCB4KSA9PiB2YWx1ZSA9PiB7XG4gIGlmICghaXNPYmplY3QodmFsdWUpKVxuICAgIHZhbHVlID0gdm9pZCAwXG4gIGZvciAoY29uc3QgayBpbiB0ZW1wbGF0ZSlcbiAgICB4ID0gc2V0VSh0ZW1wbGF0ZVtrXSwgdmFsdWUgJiYgdmFsdWVba10sIHgpXG4gIHJldHVybiB4XG59XG5cbi8vXG5cbmNvbnN0IHNob3cgPSAobGFiZWxzLCBkaXIpID0+IHggPT5cbiAgY29uc29sZS5sb2cuYXBwbHkoY29uc29sZSwgbGFiZWxzLmNvbmNhdChbZGlyLCB4XSkpIHx8IHhcblxuZnVuY3Rpb24gYnJhbmNoT24oa2V5cywgdmFscykge1xuICBjb25zdCBuID0ga2V5cy5sZW5ndGhcbiAgcmV0dXJuIChBLCB4aTJ5QSwgeCwgXykgPT4ge1xuICAgIGNvbnN0IGFwID0gQS5hcCxcbiAgICAgICAgICB3YWl0ID0gKHgsIGkpID0+IDAgPD0gaSA/IHkgPT4gd2FpdChzZXRQcm9wKGtleXNbaV0sIHksIHgpLCBpLTEpIDogeFxuICAgIGxldCByID0gcmVxQXBwbGljYXRpdmUoQS5vZikod2FpdCh4LCBuLTEpKVxuICAgIGlmICghaXNPYmplY3QoeCkpXG4gICAgICB4ID0gdm9pZCAwXG4gICAgZm9yIChsZXQgaT1uLTE7IDA8PWk7IC0taSkge1xuICAgICAgY29uc3QgayA9IGtleXNbaV0sIHYgPSB4ICYmIHhba11cbiAgICAgIHIgPSBhcChyLCAodmFscyA/IHZhbHNbaV0oQSwgeGkyeUEsIHYsIGspIDogeGkyeUEodiwgaykpKVxuICAgIH1cbiAgICByZXR1cm4gKDAsQS5tYXApKG9iamVjdDBUb1VuZGVmaW5lZCwgcilcbiAgfVxufVxuXG5jb25zdCBub3JtYWxpemVyID0geGkyeCA9PiAoRiwgeGkyeUYsIHgsIGkpID0+XG4gICgwLEYubWFwKSh4ID0+IHhpMngoeCwgaSksIHhpMnlGKHhpMngoeCwgaSksIGkpKVxuXG5jb25zdCByZXBsYWNlZCA9IChpbm4sIG91dCwgeCkgPT4gYWN5Y2xpY0VxdWFsc1UoeCwgaW5uKSA/IG91dCA6IHhcblxuZnVuY3Rpb24gZmluZEluZGV4KHhpMmIsIHhzKSB7XG4gIGZvciAobGV0IGk9MCwgbj14cy5sZW5ndGg7IGk8bjsgKytpKVxuICAgIGlmICh4aTJiKHhzW2ldLCBpKSlcbiAgICAgIHJldHVybiBpXG4gIHJldHVybiAtMVxufVxuXG5mdW5jdGlvbiBwYXJ0aXRpb25JbnRvSW5kZXgoeGkyYiwgeHMsIHRzLCBmcykge1xuICBmb3IgKGxldCBpPTAsIG49eHMubGVuZ3RoLCB4OyBpPG47ICsraSlcbiAgICAoeGkyYih4ID0geHNbaV0sIGkpID8gdHMgOiBmcykucHVzaCh4KVxufVxuXG4vL1xuXG5leHBvcnQgZnVuY3Rpb24gdG9GdW5jdGlvbihvKSB7XG4gIHN3aXRjaCAodHlwZW9mIG8pIHtcbiAgICBjYXNlIFwic3RyaW5nXCI6ICAgcmV0dXJuIGZ1blByb3AobylcbiAgICBjYXNlIFwibnVtYmVyXCI6ICAgcmV0dXJuIGZ1bkluZGV4KG8pXG4gICAgY2FzZSBcImZ1bmN0aW9uXCI6IHJldHVybiBvcHRpYyhvKVxuICAgIGRlZmF1bHQ6ICAgICAgICAgcmV0dXJuIGNvbXBvc2VkKDAsbylcbiAgfVxufVxuXG4vLyBPcGVyYXRpb25zIG9uIG9wdGljc1xuXG5leHBvcnQgY29uc3QgbW9kaWZ5ID0gY3VycnkoKG8sIHhpMngsIHMpID0+IHtcbiAgc3dpdGNoICh0eXBlb2Ygbykge1xuICAgIGNhc2UgXCJzdHJpbmdcIjogICByZXR1cm4gc2V0UHJvcChvLCB4aTJ4KGdldFByb3AobywgcyksIG8pLCBzKVxuICAgIGNhc2UgXCJudW1iZXJcIjogICByZXR1cm4gc2V0SW5kZXgobywgeGkyeChnZXRJbmRleChvLCBzKSwgbyksIHMpXG4gICAgY2FzZSBcImZ1bmN0aW9uXCI6IHJldHVybiBvcHRpYyhvKShJZGVudCwgeGkyeCwgcywgdm9pZCAwKVxuICAgIGRlZmF1bHQ6ICAgICAgICAgcmV0dXJuIG1vZGlmeUNvbXBvc2VkKG8sIHhpMngsIHMpXG4gIH1cbn0pXG5cbmV4cG9ydCBjb25zdCByZW1vdmUgPSBjdXJyeSgobywgcykgPT4gc2V0VShvLCB2b2lkIDAsIHMpKVxuXG5leHBvcnQgY29uc3Qgc2V0ID0gY3Vycnkoc2V0VSlcblxuLy8gTmVzdGluZ1xuXG5leHBvcnQgZnVuY3Rpb24gY29tcG9zZSgpIHtcbiAgc3dpdGNoIChhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgY2FzZSAwOiByZXR1cm4gaWRlbnRpdHlcbiAgICBjYXNlIDE6IHJldHVybiBhcmd1bWVudHNbMF1cbiAgICBkZWZhdWx0OiB7XG4gICAgICBjb25zdCBuID0gYXJndW1lbnRzLmxlbmd0aCwgbGVuc2VzID0gQXJyYXkobilcbiAgICAgIGZvciAobGV0IGk9MDsgaTxuOyArK2kpXG4gICAgICAgIGxlbnNlc1tpXSA9IGFyZ3VtZW50c1tpXVxuICAgICAgcmV0dXJuIGxlbnNlc1xuICAgIH1cbiAgfVxufVxuXG4vLyBRdWVyeWluZ1xuXG5leHBvcnQgY29uc3QgY2hhaW4gPSBjdXJyeSgoeGkyeU8sIHhPKSA9PlxuICBbeE8sIGNob29zZSgoeE0sIGkpID0+IGlzRGVmaW5lZCh4TSkgPyB4aTJ5Tyh4TSwgaSkgOiB6ZXJvKV0pXG5cbmV4cG9ydCBjb25zdCBjaG9pY2UgPSAoLi4ubHMpID0+IGNob29zZSh4ID0+IHtcbiAgY29uc3QgaSA9IGZpbmRJbmRleChsID0+IGlzRGVmaW5lZChnZXRVKGwsIHgpKSwgbHMpXG4gIHJldHVybiBpIDwgMCA/IHplcm8gOiBsc1tpXVxufSlcblxuZXhwb3J0IGNvbnN0IGNob29zZSA9IHhpTTJvID0+IChDLCB4aTJ5QywgeCwgaSkgPT5cbiAgcnVuKHhpTTJvKHgsIGkpLCBDLCB4aTJ5QywgeCwgaSlcblxuZXhwb3J0IGNvbnN0IHdoZW4gPSBwID0+IChDLCB4aTJ5QywgeCwgaSkgPT5cbiAgcCh4LCBpKSA/IHhpMnlDKHgsIGkpIDogemVybyhDLCB4aTJ5QywgeCwgaSlcblxuZXhwb3J0IGNvbnN0IG9wdGlvbmFsID0gd2hlbihpc0RlZmluZWQpXG5cbmV4cG9ydCBmdW5jdGlvbiB6ZXJvKEMsIHhpMnlDLCB4LCBpKSB7XG4gIGNvbnN0IG9mID0gQy5vZlxuICByZXR1cm4gb2YgPyBvZih4KSA6ICgwLEMubWFwKShhbHdheXMoeCksIHhpMnlDKHZvaWQgMCwgaSkpXG59XG5cbi8vIFJlY3Vyc2luZ1xuXG5leHBvcnQgZnVuY3Rpb24gbGF6eShvMm8pIHtcbiAgbGV0IG1lbW8gPSAoQywgeGkyeUMsIHgsIGkpID0+IChtZW1vID0gdG9GdW5jdGlvbihvMm8ocmVjKSkpKEMsIHhpMnlDLCB4LCBpKVxuICBmdW5jdGlvbiByZWMoQywgeGkyeUMsIHgsIGkpIHtyZXR1cm4gbWVtbyhDLCB4aTJ5QywgeCwgaSl9XG4gIHJldHVybiByZWNcbn1cblxuLy8gRGVidWdnaW5nXG5cbmV4cG9ydCBjb25zdCBsb2cgPSAoLi4ubGFiZWxzKSA9PiBpc28oc2hvdyhsYWJlbHMsIFwiZ2V0XCIpLCBzaG93KGxhYmVscywgXCJzZXRcIikpXG5cbi8vIE9wZXJhdGlvbnMgb24gdHJhdmVyc2Fsc1xuXG5leHBvcnQgY29uc3QgY29uY2F0QXMgPSBjb25zdEFzKG0gPT4gVGFjbm9jT2YoKDAsbS5lbXB0eSkoKSwgZmxpcChtLmNvbmNhdCkpKVxuXG5leHBvcnQgY29uc3QgY29uY2F0ID0gY29uY2F0QXMoaWQpXG5cbmV4cG9ydCBjb25zdCBmb2xkTWFwT2YgPSBjdXJyeSgobSwgdCwgeE1pMnksIHMpID0+IHtcbiAgaWYgKFwiZGV2XCIgIT09IFwicHJvZHVjdGlvblwiICYmICFmb2xkTWFwT2Yud2FybmVkKSB7XG4gICAgZm9sZE1hcE9mLndhcm5lZCA9IDFcbiAgICBjb25zb2xlLndhcm4oXCJwYXJ0aWFsLmxlbnNlczogYGZvbGRNYXBPZmAgaGFzIGJlZW4gZGVwcmVjYXRlZCBhbmQgd2lsbCBiZSByZW1vdmVkLiAgVXNlIGBjb25jYXRBc2Agb3IgYG1lcmdlQXNgLlwiKVxuICB9XG4gIHJldHVybiBjb25jYXRBcyh4TWkyeSwgbSwgdCwgcylcbn0pXG5cbmV4cG9ydCBjb25zdCBtZXJnZUFzID0gY29uc3RBcyhtID0+IFRhY25vY09mKCgwLG0uZW1wdHkpKCksIG0uY29uY2F0KSlcblxuZXhwb3J0IGNvbnN0IG1lcmdlID0gbWVyZ2VBcyhpZClcblxuLy8gRm9sZHMgb3ZlciB0cmF2ZXJzYWxzXG5cbmV4cG9ydCBjb25zdCBjb2xsZWN0QXMgPSBjdXJyeSgoeGkyeSwgdCwgcykgPT5cbiAgdG9BcnJheShydW4odCwgQ29sbGVjdCwgeGkyeSwgcykpIHx8IFtdKVxuXG5leHBvcnQgY29uc3QgY29sbGVjdCA9IGNvbGxlY3RBcyhpZClcblxuZXhwb3J0IGNvbnN0IGNvbGxlY3RNYXAgPSBjdXJyeSgodCwgeGkyeSwgcykgPT4ge1xuICBpZiAoXCJkZXZcIiAhPT0gXCJwcm9kdWN0aW9uXCIgJiYgIWNvbGxlY3RNYXAud2FybmVkKSB7XG4gICAgY29sbGVjdE1hcC53YXJuZWQgPSAxXG4gICAgY29uc29sZS53YXJuKFwicGFydGlhbC5sZW5zZXM6IGBjb2xsZWN0TWFwYCBoYXMgYmVlbiBkZXByZWNhdGVkIGFuZCB3aWxsIGJlIHJlbW92ZWQuICBVc2UgYGNvbGxlY3RBc2AuXCIpXG4gIH1cbiAgcmV0dXJuIGNvbGxlY3RBcyh4aTJ5LCB0LCBzKVxufSlcblxuZXhwb3J0IGNvbnN0IGZvbGRsID0gY3VycnkoKGYsIHIsIHQsIHMpID0+XG4gIGZvbGQoZiwgciwgcnVuKHQsIENvbGxlY3QsIHBhaXIsIHMpKSlcblxuZXhwb3J0IGNvbnN0IGZvbGRyID0gY3VycnkoKGYsIHIsIHQsIHMpID0+IHtcbiAgY29uc3QgeHMgPSBjb2xsZWN0QXMocGFpciwgdCwgcylcbiAgZm9yIChsZXQgaT14cy5sZW5ndGgtMTsgMDw9aTsgLS1pKSB7XG4gICAgY29uc3QgeCA9IHhzW2ldXG4gICAgciA9IGYociwgeFswXSwgeFsxXSlcbiAgfVxuICByZXR1cm4gclxufSlcblxuZXhwb3J0IGNvbnN0IG1heGltdW0gPSBtZXJnZShNdW0oKHgsIHkpID0+IHggPiB5KSlcblxuZXhwb3J0IGNvbnN0IG1pbmltdW0gPSBtZXJnZShNdW0oKHgsIHkpID0+IHggPCB5KSlcblxuZXhwb3J0IGNvbnN0IHByb2R1Y3QgPSBtZXJnZUFzKHVudG8oMSksIE1vbm9pZCgxLCAoeSwgeCkgPT4geCAqIHkpKVxuXG5leHBvcnQgY29uc3Qgc3VtID0gbWVyZ2VBcyh1bnRvKDApLCBNb25vaWQoMCwgKHksIHgpID0+IHggKyB5KSlcblxuLy8gQ3JlYXRpbmcgbmV3IHRyYXZlcnNhbHNcblxuZXhwb3J0IGZ1bmN0aW9uIGJyYW5jaCh0ZW1wbGF0ZSkge1xuICBjb25zdCBrZXlzID0gW10sIHZhbHMgPSBbXVxuICBmb3IgKGNvbnN0IGsgaW4gdGVtcGxhdGUpIHtcbiAgICBrZXlzLnB1c2goaylcbiAgICB2YWxzLnB1c2godG9GdW5jdGlvbih0ZW1wbGF0ZVtrXSkpXG4gIH1cbiAgcmV0dXJuIGJyYW5jaE9uKGtleXMsIHZhbHMpXG59XG5cbi8vIFRyYXZlcnNhbHMgYW5kIGNvbWJpbmF0b3JzXG5cbmV4cG9ydCBmdW5jdGlvbiBzZXF1ZW5jZShBLCB4aTJ5QSwgeHMsIF8pIHtcbiAgaWYgKGlzQXJyYXkoeHMpKVxuICAgIHJldHVybiBBID09PSBJZGVudFxuICAgID8gbWFwUGFydGlhbEluZGV4VSh4aTJ5QSwgeHMpXG4gICAgOiB0cmF2ZXJzZVBhcnRpYWxJbmRleChBLCB4aTJ5QSwgeHMpXG4gIGVsc2UgaWYgKGlzT2JqZWN0KHhzKSlcbiAgICByZXR1cm4gYnJhbmNoT24oa2V5cyh4cykpKEEsIHhpMnlBLCB4cylcbiAgZWxzZVxuICAgIHJldHVybiByZXFBcHBsaWNhdGl2ZShBLm9mKSh4cylcbn1cblxuLy8gT3BlcmF0aW9ucyBvbiBsZW5zZXNcblxuZXhwb3J0IGNvbnN0IGdldCA9IGN1cnJ5KGdldFUpXG5cbi8vIENyZWF0aW5nIG5ldyBsZW5zZXNcblxuZXhwb3J0IGNvbnN0IGxlbnMgPSBjdXJyeSgoZ2V0LCBzZXQpID0+IChGLCB4aTJ5RiwgeCwgaSkgPT5cbiAgKDAsRi5tYXApKHkgPT4gc2V0KHksIHgsIGkpLCB4aTJ5RihnZXQoeCwgaSksIGkpKSlcblxuLy8gQ29tcHV0aW5nIGRlcml2ZWQgcHJvcHNcblxuZXhwb3J0IGNvbnN0IGF1Z21lbnQgPSB0ZW1wbGF0ZSA9PiBsZW5zKFxuICB4ID0+IHtcbiAgICBjb25zdCB6ID0gZGlzc29jUGFydGlhbFUoMCwgeClcbiAgICBpZiAoeilcbiAgICAgIGZvciAoY29uc3QgayBpbiB0ZW1wbGF0ZSlcbiAgICAgICAgeltrXSA9IHRlbXBsYXRlW2tdKHopXG4gICAgcmV0dXJuIHpcbiAgfSxcbiAgKHksIHgpID0+IHtcbiAgICBpZiAoaXNPYmplY3QoeSkpIHtcbiAgICAgIGlmICghaXNPYmplY3QoeCkpXG4gICAgICAgIHggPSB2b2lkIDBcbiAgICAgIGxldCB6XG4gICAgICBjb25zdCBzZXQgPSAoaywgdikgPT4ge1xuICAgICAgICBpZiAoIXopXG4gICAgICAgICAgeiA9IHt9XG4gICAgICAgIHpba10gPSB2XG4gICAgICB9XG4gICAgICBmb3IgKGNvbnN0IGsgaW4geSkge1xuICAgICAgICBpZiAoIShrIGluIHRlbXBsYXRlKSlcbiAgICAgICAgICBzZXQoaywgeVtrXSlcbiAgICAgICAgZWxzZVxuICAgICAgICAgIGlmICh4ICYmIGsgaW4geClcbiAgICAgICAgICAgIHNldChrLCB4W2tdKVxuICAgICAgfVxuICAgICAgcmV0dXJuIHpcbiAgICB9XG4gIH0pXG5cbi8vIEVuZm9yY2luZyBpbnZhcmlhbnRzXG5cbmV4cG9ydCBjb25zdCBkZWZhdWx0cyA9IG91dCA9PiB7XG4gIGNvbnN0IG8ydSA9IHggPT4gcmVwbGFjZWQob3V0LCB2b2lkIDAsIHgpXG4gIHJldHVybiAoRiwgeGkyeUYsIHgsIGkpID0+ICgwLEYubWFwKShvMnUsIHhpMnlGKGlzRGVmaW5lZCh4KSA/IHggOiBvdXQsIGkpKVxufVxuXG5leHBvcnQgY29uc3QgcmVxdWlyZWQgPSBpbm4gPT4gcmVwbGFjZShpbm4sIHZvaWQgMClcblxuZXhwb3J0IGNvbnN0IGRlZmluZSA9IHYgPT4gbm9ybWFsaXplcih1bnRvKHYpKVxuXG5leHBvcnQgY29uc3Qgbm9ybWFsaXplID0geGkyeCA9PlxuICBub3JtYWxpemVyKCh4LCBpKSA9PiBpc0RlZmluZWQoeCkgPyB4aTJ4KHgsIGkpIDogdm9pZCAwKVxuXG5leHBvcnQgY29uc3QgcmV3cml0ZSA9IHlpMnkgPT4gKEYsIHhpMnlGLCB4LCBpKSA9PlxuICAoMCxGLm1hcCkoeSA9PiBpc0RlZmluZWQoeSkgPyB5aTJ5KHksIGkpIDogdm9pZCAwLCB4aTJ5Rih4LCBpKSlcblxuLy8gTGVuc2luZyBhcnJheXNcblxuZXhwb3J0IGNvbnN0IGFwcGVuZCA9IChGLCB4aTJ5RiwgeHMsIGkpID0+XG4gICgwLEYubWFwKSh4ID0+IGFycmF5MFRvVW5kZWZpbmVkKChpc0FycmF5KHhzKSA/IHhzIDogYXJyYXkwKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuY29uY2F0KGlzRGVmaW5lZCh4KSA/IFt4XSA6IGFycmF5MCkpLFxuICAgICAgICAgICAgeGkyeUYodm9pZCAwLCBpKSlcblxuZXhwb3J0IGNvbnN0IGZpbHRlciA9IHhpMmIgPT4gKEYsIHhpMnlGLCB4cywgaSkgPT4ge1xuICBsZXQgdHMsIGZzID0gYXJyYXkwXG4gIGlmIChpc0FycmF5KHhzKSlcbiAgICBwYXJ0aXRpb25JbnRvSW5kZXgoeGkyYiwgeHMsIHRzID0gW10sIGZzID0gW10pXG4gIHJldHVybiAoMCxGLm1hcCkodHMgPT4gYXJyYXkwVG9VbmRlZmluZWQoaXNBcnJheSh0cyk/dHMuY29uY2F0KGZzKTpmcyksXG4gICAgICAgICAgICAgICAgICAgeGkyeUYodHMsIGkpKVxufVxuXG5leHBvcnQgY29uc3QgZmluZCA9IHhpMmIgPT4gY2hvb3NlKHhzID0+IHtcbiAgaWYgKCFpc0FycmF5KHhzKSlcbiAgICByZXR1cm4gMFxuICBjb25zdCBpID0gZmluZEluZGV4KHhpMmIsIHhzKVxuICByZXR1cm4gaSA8IDAgPyBhcHBlbmQgOiBpXG59KVxuXG5leHBvcnQgZnVuY3Rpb24gZmluZFdpdGgoLi4ubHMpIHtcbiAgY29uc3QgbGxzID0gY29tcG9zZSguLi5scylcbiAgcmV0dXJuIFtmaW5kKHggPT4gaXNEZWZpbmVkKGdldFUobGxzLCB4KSkpLCBsbHNdXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpbmRleCh4KSB7XG4gIGlmIChcImRldlwiICE9PSBcInByb2R1Y3Rpb25cIiAmJiAhaXNJbmRleCh4KSlcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJgaW5kZXhgIGV4cGVjdHMgYSBub24tbmVnYXRpdmUgaW50ZWdlci5cIilcbiAgcmV0dXJuIHhcbn1cblxuLy8gTGVuc2luZyBvYmplY3RzXG5cbmV4cG9ydCBmdW5jdGlvbiBwcm9wKHgpIHtcbiAgaWYgKFwiZGV2XCIgIT09IFwicHJvZHVjdGlvblwiICYmICFpc1Byb3AoeCkpXG4gICAgdGhyb3cgbmV3IEVycm9yKFwiYHByb3BgIGV4cGVjdHMgYSBzdHJpbmcuXCIpXG4gIHJldHVybiB4XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwcm9wcygpIHtcbiAgY29uc3QgbiA9IGFyZ3VtZW50cy5sZW5ndGgsIHRlbXBsYXRlID0ge31cbiAgZm9yIChsZXQgaT0wLCBrOyBpPG47ICsraSlcbiAgICB0ZW1wbGF0ZVtrID0gYXJndW1lbnRzW2ldXSA9IGtcbiAgcmV0dXJuIHBpY2sodGVtcGxhdGUpXG59XG5cbi8vIFByb3ZpZGluZyBkZWZhdWx0c1xuXG5leHBvcnQgY29uc3QgdmFsdWVPciA9IHYgPT4gKF9GLCB4aTJ5RiwgeCwgaSkgPT5cbiAgeGkyeUYoaXNEZWZpbmVkKHgpICYmIHggIT09IG51bGwgPyB4IDogdiwgaSlcblxuLy8gQWRhcHRpbmcgdG8gZGF0YVxuXG5leHBvcnQgY29uc3Qgb3JFbHNlID1cbiAgY3VycnkoKGQsIGwpID0+IGNob29zZSh4ID0+IGlzRGVmaW5lZChnZXRVKGwsIHgpKSA/IGwgOiBkKSlcblxuLy8gUmVhZC1vbmx5IG1hcHBpbmdcblxuZXhwb3J0IGNvbnN0IHRvID0gd2kyeCA9PiAoRiwgeGkyeUYsIHcsIGkpID0+XG4gICgwLEYubWFwKShhbHdheXModyksIHhpMnlGKHdpMngodywgaSksIGkpKVxuXG5leHBvcnQgY29uc3QganVzdCA9IHggPT4gdG8oYWx3YXlzKHgpKVxuXG4vLyBUcmFuc2Zvcm1pbmcgZGF0YVxuXG5leHBvcnQgY29uc3QgcGljayA9IHRlbXBsYXRlID0+IChGLCB4aTJ5RiwgeCwgaSkgPT5cbiAgKDAsRi5tYXApKHNldFBpY2sodGVtcGxhdGUsIHgpLCB4aTJ5RihnZXRQaWNrKHRlbXBsYXRlLCB4KSwgaSkpXG5cbmV4cG9ydCBjb25zdCByZXBsYWNlID0gY3VycnkoKGlubiwgb3V0KSA9PiB7XG4gIGNvbnN0IG8yaSA9IHggPT4gcmVwbGFjZWQob3V0LCBpbm4sIHgpXG4gIHJldHVybiAoRiwgeGkyeUYsIHgsIGkpID0+ICgwLEYubWFwKShvMmksIHhpMnlGKHJlcGxhY2VkKGlubiwgb3V0LCB4KSwgaSkpXG59KVxuXG4vLyBPcGVyYXRpb25zIG9uIGlzb21vcnBoaXNtc1xuXG5leHBvcnQgY29uc3QgZ2V0SW52ZXJzZSA9IGFyaXR5TigyLCBzZXRVKVxuXG4vLyBDcmVhdGluZyBuZXcgaXNvbW9ycGhpc21zXG5cbmV4cG9ydCBjb25zdCBpc28gPVxuICBjdXJyeSgoYndkLCBmd2QpID0+IChGLCB4aTJ5RiwgeCwgaSkgPT4gKDAsRi5tYXApKGZ3ZCwgeGkyeUYoYndkKHgpLCBpKSkpXG5cbi8vIElzb21vcnBoaXNtcyBhbmQgY29tYmluYXRvcnNcblxuZXhwb3J0IGNvbnN0IGlkZW50aXR5ID0gKF9GLCB4aTJ5RiwgeCwgaSkgPT4geGkyeUYoeCwgaSlcblxuZXhwb3J0IGNvbnN0IGludmVyc2UgPSBpc28gPT4gKEYsIHhpMnlGLCB4LCBpKSA9PlxuICAoMCxGLm1hcCkoeCA9PiBnZXRVKGlzbywgeCksIHhpMnlGKHNldFUoaXNvLCB4KSwgaSkpXG4iXX0=
