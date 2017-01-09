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

function of(f) {
  if ("dev" !== "production" && !f.of) throw new Error("Traversals require an applicative.");
  return f.of;
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
  var s = of(A)(void 0),
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

function optic(o) {
  if ("dev" !== "production" && !(typeof o === "function" && o.length === 4)) throw new Error("Expecting an optic.");
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
    var r = of(A)(wait(x, n - 1));
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
  if ((0, _infestines.isArray)(xs)) return A === Ident ? mapPartialIndexU(xi2yA, xs) : traversePartialIndex(A, xi2yA, xs);else if ((0, _infestines.isObject)(xs)) return branchOn((0, _infestines.keys)(xs))(A, xi2yA, xs);else return of(A)(xs);
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
  if ("dev" !== "production" && !(Number.isInteger(x) && 0 <= x)) throw new Error("`index` expects a non-negative integer.");
  return x;
}

// Lensing objects

function prop(x) {
  if ("dev" !== "production" && typeof x !== "string") throw new Error("`prop` expects a string.");
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvcGFydGlhbC5sZW5zZXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7UUM2VWdCLFUsR0FBQSxVO1FBMEJBLE8sR0FBQSxPO1FBK0JBLEksR0FBQSxJO1FBT0EsSSxHQUFBLEk7UUFpRUEsTSxHQUFBLE07UUFXQSxRLEdBQUEsUTtRQTBGQSxRLEdBQUEsUTtRQUtBLEssR0FBQSxLO1FBUUEsSSxHQUFBLEk7UUFNQSxLLEdBQUEsSzs7QUF0a0JoQjs7QUFrQkE7O0FBRUEsU0FBUyxJQUFULENBQWMsRUFBZCxFQUFrQixFQUFsQixFQUFzQjtBQUFDLFNBQU8sQ0FBQyxFQUFELEVBQUssRUFBTCxDQUFQO0FBQWdCOztBQUV2QyxJQUFNLE9BQU8sU0FBUCxJQUFPO0FBQUEsU0FBTyxVQUFDLENBQUQsRUFBSSxDQUFKO0FBQUEsV0FBVSxJQUFJLENBQUosRUFBTyxDQUFQLENBQVY7QUFBQSxHQUFQO0FBQUEsQ0FBYjs7QUFFQSxJQUFNLE9BQU8sU0FBUCxJQUFPO0FBQUEsU0FBSztBQUFBLFdBQUssMkJBQVUsQ0FBVixJQUFlLENBQWYsR0FBbUIsQ0FBeEI7QUFBQSxHQUFMO0FBQUEsQ0FBYjs7QUFFQTs7QUFFQSxTQUFTLGdCQUFULENBQTBCLElBQTFCLEVBQWdDLEVBQWhDLEVBQW9DO0FBQ2xDLE1BQU0sS0FBSyxFQUFYO0FBQUEsTUFBZSxJQUFFLEdBQUcsTUFBcEI7QUFDQSxPQUFLLElBQUksSUFBRSxDQUFOLEVBQVMsQ0FBZCxFQUFpQixJQUFFLENBQW5CLEVBQXNCLEVBQUUsQ0FBeEI7QUFDRSxRQUFJLDJCQUFVLElBQUksS0FBSyxHQUFHLENBQUgsQ0FBTCxFQUFZLENBQVosQ0FBZCxDQUFKLEVBQ0UsR0FBRyxJQUFILENBQVEsQ0FBUjtBQUZKLEdBR0EsT0FBTyxHQUFHLE1BQUgsR0FBWSxFQUFaLEdBQWlCLEtBQUssQ0FBN0I7QUFDRDs7QUFFRDs7QUFFQSxJQUFNLGNBQWMsU0FBZCxXQUFjLENBQUMsR0FBRCxFQUFNLEVBQU4sRUFBVSxFQUFWO0FBQUEsU0FBa0IsRUFBQyxRQUFELEVBQU0sTUFBTixFQUFVLE1BQVYsRUFBbEI7QUFBQSxDQUFwQjs7QUFFQSxJQUFNLFFBQVEsbUVBQWQ7O0FBRUEsSUFBTSxRQUFRLEVBQUMscUJBQUQsRUFBZDs7QUFFQSxJQUFNLFdBQVcsU0FBWCxRQUFXLENBQUMsS0FBRCxFQUFRLE1BQVI7QUFBQSxTQUFtQiw4QkFBa0Isd0JBQU8sS0FBUCxDQUFsQixFQUFpQyxNQUFqQyxDQUFuQjtBQUFBLENBQWpCOztBQUVBLElBQU0sU0FBUyxTQUFULE1BQVMsQ0FBQyxNQUFELEVBQVEsTUFBUjtBQUFBLFNBQW9CLEVBQUMsT0FBTztBQUFBLGFBQU0sTUFBTjtBQUFBLEtBQVIsRUFBcUIsY0FBckIsRUFBcEI7QUFBQSxDQUFmOztBQUVBLElBQU0sTUFBTSxTQUFOLEdBQU07QUFBQSxTQUNWLE9BQU8sS0FBSyxDQUFaLEVBQWUsVUFBQyxDQUFELEVBQUksQ0FBSjtBQUFBLFdBQVUsMkJBQVUsQ0FBVixNQUFpQixDQUFDLDJCQUFVLENBQVYsQ0FBRCxJQUFpQixJQUFJLENBQUosRUFBTyxDQUFQLENBQWxDLElBQStDLENBQS9DLEdBQW1ELENBQTdEO0FBQUEsR0FBZixDQURVO0FBQUEsQ0FBWjs7QUFHQTs7QUFFQSxJQUFNLE1BQU0sU0FBTixHQUFNLENBQUMsQ0FBRCxFQUFJLENBQUosRUFBTyxLQUFQLEVBQWMsQ0FBZCxFQUFpQixDQUFqQjtBQUFBLFNBQXVCLFdBQVcsQ0FBWCxFQUFjLENBQWQsRUFBaUIsS0FBakIsRUFBd0IsQ0FBeEIsRUFBMkIsQ0FBM0IsQ0FBdkI7QUFBQSxDQUFaOztBQUVBLElBQU0sVUFBVSxTQUFWLE9BQVU7QUFBQSxTQUFXLHdCQUFPLENBQVAsRUFBVSxVQUFDLEtBQUQsRUFBUSxDQUFSLEVBQWM7QUFDakQsUUFBTSxJQUFJLFFBQVEsQ0FBUixDQUFWO0FBQ0EsV0FBTyxVQUFDLENBQUQsRUFBSSxDQUFKO0FBQUEsYUFBVSxJQUFJLENBQUosRUFBTyxDQUFQLEVBQVUsS0FBVixFQUFpQixDQUFqQixDQUFWO0FBQUEsS0FBUDtBQUNELEdBSDBCLENBQVg7QUFBQSxDQUFoQjs7QUFLQTs7QUFFQSxTQUFTLEVBQVQsQ0FBWSxDQUFaLEVBQWU7QUFDYixNQUFJLFFBQVEsR0FBUixDQUFZLFFBQVosS0FBeUIsWUFBekIsSUFBeUMsQ0FBQyxFQUFFLEVBQWhELEVBQ0UsTUFBTSxJQUFJLEtBQUosQ0FBVSxvQ0FBVixDQUFOO0FBQ0YsU0FBTyxFQUFFLEVBQVQ7QUFDRDs7QUFFRDs7QUFFQSxTQUFTLE1BQVQsQ0FBZ0IsQ0FBaEIsRUFBbUIsQ0FBbkIsRUFBc0I7QUFBQyxPQUFLLENBQUwsR0FBUyxDQUFULENBQVksS0FBSyxDQUFMLEdBQVMsQ0FBVDtBQUFXOztBQUU5QyxJQUFNLFdBQVcsU0FBWCxRQUFXO0FBQUEsU0FBSyxFQUFFLFdBQUYsS0FBa0IsTUFBdkI7QUFBQSxDQUFqQjs7QUFFQSxJQUFNLEtBQUssU0FBTCxFQUFLLENBQUMsQ0FBRCxFQUFJLENBQUo7QUFBQSxTQUFVLDJCQUFVLENBQVYsSUFBZSwyQkFBVSxDQUFWLElBQWUsSUFBSSxNQUFKLENBQVcsQ0FBWCxFQUFjLENBQWQsQ0FBZixHQUFrQyxDQUFqRCxHQUFxRCxDQUEvRDtBQUFBLENBQVg7O0FBRUEsSUFBTSxVQUFVLFNBQVYsT0FBVTtBQUFBLFNBQUs7QUFBQSxXQUFLLEdBQUcsQ0FBSCxFQUFNLENBQU4sQ0FBTDtBQUFBLEdBQUw7QUFBQSxDQUFoQjs7QUFFQSxTQUFTLE1BQVQsQ0FBZ0IsQ0FBaEIsRUFBbUIsRUFBbkIsRUFBdUI7QUFDckIsU0FBTyxLQUFLLFNBQVMsQ0FBVCxDQUFaLEVBQXlCO0FBQ3ZCLFFBQU0sSUFBSSxFQUFFLENBQVo7QUFDQSxRQUFJLEVBQUUsQ0FBTjtBQUNBLFFBQUksS0FBSyxTQUFTLENBQVQsQ0FBVCxFQUFzQjtBQUNwQixhQUFPLEVBQUUsQ0FBVCxFQUFZLEVBQVo7QUFDQSxhQUFPLEVBQUUsQ0FBVCxFQUFZLEVBQVo7QUFDRCxLQUhELE1BSUUsR0FBRyxJQUFILENBQVEsQ0FBUjtBQUNIO0FBQ0QsS0FBRyxJQUFILENBQVEsQ0FBUjtBQUNEOztBQUVELFNBQVMsT0FBVCxDQUFpQixDQUFqQixFQUFvQjtBQUNsQixNQUFJLDJCQUFVLENBQVYsQ0FBSixFQUFrQjtBQUNoQixRQUFNLEtBQUssRUFBWDtBQUNBLFdBQU8sQ0FBUCxFQUFVLEVBQVY7QUFDQSxXQUFPLEVBQVA7QUFDRDtBQUNGOztBQUVELFNBQVMsT0FBVCxDQUFpQixDQUFqQixFQUFvQixDQUFwQixFQUF1QixDQUF2QixFQUEwQjtBQUN4QixTQUFPLFNBQVMsQ0FBVCxDQUFQLEVBQW9CO0FBQ2xCLFFBQU0sSUFBSSxFQUFFLENBQVo7QUFDQSxRQUFJLEVBQUUsQ0FBTjtBQUNBLFFBQUksU0FBUyxDQUFULElBQ0EsUUFBUSxDQUFSLEVBQVcsUUFBUSxDQUFSLEVBQVcsQ0FBWCxFQUFjLEVBQUUsQ0FBaEIsQ0FBWCxFQUErQixFQUFFLENBQWpDLENBREEsR0FFQSxFQUFFLENBQUYsRUFBSyxFQUFFLENBQUYsQ0FBTCxFQUFXLEVBQUUsQ0FBRixDQUFYLENBRko7QUFHRDtBQUNELFNBQU8sRUFBRSxDQUFGLEVBQUssRUFBRSxDQUFGLENBQUwsRUFBVyxFQUFFLENBQUYsQ0FBWCxDQUFQO0FBQ0Q7O0FBRUQsSUFBTSxPQUFPLFNBQVAsSUFBTyxDQUFDLENBQUQsRUFBSSxDQUFKLEVBQU8sQ0FBUDtBQUFBLFNBQWEsMkJBQVUsQ0FBVixJQUFlLFFBQVEsQ0FBUixFQUFXLENBQVgsRUFBYyxDQUFkLENBQWYsR0FBa0MsQ0FBL0M7QUFBQSxDQUFiOztBQUVBLElBQU0sVUFBVSxTQUFTLEtBQUssQ0FBZCxFQUFpQixFQUFqQixDQUFoQjs7QUFFQTs7QUFFQSxTQUFTLG9CQUFULENBQThCLENBQTlCLEVBQWlDLEtBQWpDLEVBQXdDLEVBQXhDLEVBQTRDO0FBQzFDLE1BQU0sS0FBSyxFQUFFLEVBQWI7QUFBQSxNQUFpQixNQUFNLEVBQUUsR0FBekI7QUFDQSxNQUFJLElBQUksR0FBRyxDQUFILEVBQU0sS0FBSyxDQUFYLENBQVI7QUFBQSxNQUF1QixJQUFJLEdBQUcsTUFBOUI7QUFDQSxTQUFPLEdBQVA7QUFDRSxRQUFJLEdBQUcsSUFBSSxPQUFKLEVBQWEsQ0FBYixDQUFILEVBQW9CLE1BQU0sR0FBRyxDQUFILENBQU4sRUFBYSxDQUFiLENBQXBCLENBQUo7QUFERixHQUVBLE9BQU8sSUFBSSxPQUFKLEVBQWEsQ0FBYixDQUFQO0FBQ0Q7O0FBRUQ7O0FBRUEsSUFBTSxvQkFBb0IsU0FBcEIsaUJBQW9CO0FBQUEsU0FBTSxHQUFHLE1BQUgsR0FBWSxFQUFaLEdBQWlCLEtBQUssQ0FBNUI7QUFBQSxDQUExQjs7QUFFQSxJQUFNLHFCQUFxQixTQUFyQixrQkFBcUIsSUFBSztBQUM5QixNQUFJLENBQUMsMEJBQVMsQ0FBVCxDQUFMLEVBQ0UsT0FBTyxDQUFQO0FBQ0YsT0FBSyxJQUFNLENBQVgsSUFBZ0IsQ0FBaEI7QUFDRSxXQUFPLENBQVA7QUFERjtBQUVELENBTEQ7O0FBT0E7O0FBRUEsSUFBTSxVQUFVLFNBQVYsT0FBVSxDQUFDLENBQUQsRUFBSSxDQUFKO0FBQUEsU0FBVSwwQkFBUyxDQUFULElBQWMsRUFBRSxDQUFGLENBQWQsR0FBcUIsS0FBSyxDQUFwQztBQUFBLENBQWhCOztBQUVBLElBQU0sVUFBVSxTQUFWLE9BQVUsQ0FBQyxDQUFELEVBQUksQ0FBSixFQUFPLENBQVA7QUFBQSxTQUNkLDJCQUFVLENBQVYsSUFBZSwrQkFBYyxDQUFkLEVBQWlCLENBQWpCLEVBQW9CLENBQXBCLENBQWYsR0FBd0MsZ0NBQWUsQ0FBZixFQUFrQixDQUFsQixDQUQxQjtBQUFBLENBQWhCOztBQUdBLElBQU0sVUFBVSxTQUFWLE9BQVU7QUFBQSxTQUFLLFVBQUMsQ0FBRCxFQUFJLEtBQUosRUFBVyxDQUFYLEVBQWMsQ0FBZDtBQUFBLFdBQ25CLENBQUMsR0FBRSxFQUFFLEdBQUwsRUFBVTtBQUFBLGFBQUssUUFBUSxDQUFSLEVBQVcsQ0FBWCxFQUFjLENBQWQsQ0FBTDtBQUFBLEtBQVYsRUFBaUMsTUFBTSxRQUFRLENBQVIsRUFBVyxDQUFYLENBQU4sRUFBcUIsQ0FBckIsQ0FBakMsQ0FEbUI7QUFBQSxHQUFMO0FBQUEsQ0FBaEI7O0FBR0E7O0FBRUEsSUFBTSxRQUFRLFNBQVIsS0FBUTtBQUFBLFNBQUssTUFBTSxDQUFOLEVBQVMsSUFBVCxDQUFjLElBQWQsQ0FBTDtBQUFBLENBQWQ7O0FBRUEsSUFBTSxXQUFXLFNBQVgsUUFBVyxDQUFDLENBQUQsRUFBSSxFQUFKO0FBQUEsU0FBVyx5QkFBUSxFQUFSLElBQWMsR0FBRyxDQUFILENBQWQsR0FBc0IsS0FBSyxDQUF0QztBQUFBLENBQWpCOztBQUVBLFNBQVMsUUFBVCxDQUFrQixDQUFsQixFQUFxQixDQUFyQixFQUF3QixFQUF4QixFQUE0QjtBQUMxQixNQUFJLDJCQUFVLENBQVYsQ0FBSixFQUFrQjtBQUNoQixRQUFJLENBQUMseUJBQVEsRUFBUixDQUFMLEVBQ0UsT0FBTyxJQUFJLENBQUosR0FBUSxLQUFLLENBQWIsR0FBaUIsTUFBTSxDQUFOLEVBQVMsTUFBVCxDQUFnQixDQUFDLENBQUQsQ0FBaEIsQ0FBeEI7QUFDRixRQUFNLElBQUksR0FBRyxNQUFiO0FBQ0EsUUFBSSxLQUFLLENBQVQsRUFDRSxPQUFPLEdBQUcsTUFBSCxDQUFVLE1BQU0sSUFBSSxDQUFWLENBQVYsRUFBd0IsQ0FBQyxDQUFELENBQXhCLENBQVA7QUFDRixRQUFJLElBQUksQ0FBUixFQUNFLE9BQU8sQ0FBQyxDQUFELEdBQUssS0FBSyxDQUFWLEdBQWMsRUFBckI7QUFDRixRQUFNLEtBQUssTUFBTSxDQUFOLENBQVg7QUFDQSxTQUFLLElBQUksSUFBRSxDQUFYLEVBQWMsSUFBRSxDQUFoQixFQUFtQixFQUFFLENBQXJCO0FBQ0UsU0FBRyxDQUFILElBQVEsR0FBRyxDQUFILENBQVI7QUFERixLQUVBLEdBQUcsQ0FBSCxJQUFRLENBQVI7QUFDQSxXQUFPLEVBQVA7QUFDRCxHQWJELE1BYU87QUFDTCxRQUFJLHlCQUFRLEVBQVIsQ0FBSixFQUFpQjtBQUNmLFVBQU0sS0FBSSxHQUFHLE1BQWI7QUFDQSxVQUFJLENBQUMsRUFBTCxFQUNFLE9BQU8sS0FBSyxDQUFaO0FBQ0YsVUFBSSxJQUFJLENBQUosSUFBUyxNQUFLLENBQWxCLEVBQ0UsT0FBTyxFQUFQO0FBQ0YsVUFBSSxPQUFNLENBQVYsRUFDRSxPQUFPLEtBQUssQ0FBWjtBQUNGLFVBQU0sTUFBSyxNQUFNLEtBQUUsQ0FBUixDQUFYO0FBQ0EsV0FBSyxJQUFJLEtBQUUsQ0FBWCxFQUFjLEtBQUUsQ0FBaEIsRUFBbUIsRUFBRSxFQUFyQjtBQUNFLFlBQUcsRUFBSCxJQUFRLEdBQUcsRUFBSCxDQUFSO0FBREYsT0FFQSxLQUFLLElBQUksTUFBRSxJQUFFLENBQWIsRUFBZ0IsTUFBRSxFQUFsQixFQUFxQixFQUFFLEdBQXZCO0FBQ0UsWUFBRyxNQUFFLENBQUwsSUFBVSxHQUFHLEdBQUgsQ0FBVjtBQURGLE9BRUEsT0FBTyxHQUFQO0FBQ0Q7QUFDRjtBQUNGOztBQUVELElBQU0sV0FBVyxTQUFYLFFBQVc7QUFBQSxTQUFLLFVBQUMsQ0FBRCxFQUFJLEtBQUosRUFBVyxFQUFYLEVBQWUsQ0FBZjtBQUFBLFdBQ3BCLENBQUMsR0FBRSxFQUFFLEdBQUwsRUFBVTtBQUFBLGFBQUssU0FBUyxDQUFULEVBQVksQ0FBWixFQUFlLEVBQWYsQ0FBTDtBQUFBLEtBQVYsRUFBbUMsTUFBTSxTQUFTLENBQVQsRUFBWSxFQUFaLENBQU4sRUFBdUIsQ0FBdkIsQ0FBbkMsQ0FEb0I7QUFBQSxHQUFMO0FBQUEsQ0FBakI7O0FBR0E7O0FBRUEsU0FBUyxLQUFULENBQWUsQ0FBZixFQUFrQjtBQUNoQixNQUFJLFFBQVEsR0FBUixDQUFZLFFBQVosS0FBeUIsWUFBekIsSUFDQSxFQUFFLE9BQU8sQ0FBUCxLQUFhLFVBQWIsSUFBMkIsRUFBRSxNQUFGLEtBQWEsQ0FBMUMsQ0FESixFQUVFLE1BQU0sSUFBSSxLQUFKLENBQVUscUJBQVYsQ0FBTjtBQUNGLFNBQU8sQ0FBUDtBQUNEOztBQUVELElBQU0sUUFBUSxTQUFSLEtBQVEsQ0FBQyxDQUFELEVBQUksQ0FBSixFQUFPLEtBQVA7QUFBQSxTQUFpQixVQUFDLENBQUQsRUFBSSxDQUFKO0FBQUEsV0FBVSxFQUFFLENBQUYsRUFBSyxLQUFMLEVBQVksQ0FBWixFQUFlLENBQWYsQ0FBVjtBQUFBLEdBQWpCO0FBQUEsQ0FBZDs7QUFFQSxTQUFTLFFBQVQsQ0FBa0IsR0FBbEIsRUFBdUIsRUFBdkIsRUFBMkI7QUFDekIsVUFBUSxHQUFHLE1BQUgsR0FBWSxHQUFwQjtBQUNFLFNBQUssQ0FBTDtBQUFTLGFBQU8sUUFBUDtBQUNULFNBQUssQ0FBTDtBQUFTLGFBQU8sV0FBVyxHQUFHLEdBQUgsQ0FBWCxDQUFQO0FBQ1Q7QUFBUyxhQUFPLFVBQUMsQ0FBRCxFQUFJLEtBQUosRUFBVyxDQUFYLEVBQWMsQ0FBZCxFQUFvQjtBQUNsQyxZQUFJLElBQUksR0FBRyxNQUFYO0FBQ0EsZ0JBQVEsTUFBTSxXQUFXLEdBQUcsRUFBRSxDQUFMLENBQVgsQ0FBTixFQUEyQixDQUEzQixFQUE4QixLQUE5QixDQUFSO0FBQ0EsZUFBTyxNQUFNLEVBQUUsQ0FBZjtBQUNFLGtCQUFRLE1BQU0sV0FBVyxHQUFHLENBQUgsQ0FBWCxDQUFOLEVBQXlCLENBQXpCLEVBQTRCLEtBQTVCLENBQVI7QUFERixTQUVBLE9BQU8sSUFBSSxHQUFHLEdBQUgsQ0FBSixFQUFhLENBQWIsRUFBZ0IsS0FBaEIsRUFBdUIsQ0FBdkIsRUFBMEIsQ0FBMUIsQ0FBUDtBQUNELE9BTlE7QUFIWDtBQVdEOztBQUVELFNBQVMsSUFBVCxDQUFjLENBQWQsRUFBaUIsQ0FBakIsRUFBb0IsQ0FBcEIsRUFBdUI7QUFDckIsVUFBUSxPQUFPLENBQWY7QUFDRSxTQUFLLFFBQUw7QUFBaUIsYUFBTyxRQUFRLENBQVIsRUFBVyxDQUFYLEVBQWMsQ0FBZCxDQUFQO0FBQ2pCLFNBQUssUUFBTDtBQUFpQixhQUFPLFNBQVMsQ0FBVCxFQUFZLENBQVosRUFBZSxDQUFmLENBQVA7QUFDakIsU0FBSyxVQUFMO0FBQWlCLGFBQU8sTUFBTSxDQUFOLEVBQVMsS0FBVCxFQUFnQix3QkFBTyxDQUFQLENBQWhCLEVBQTJCLENBQTNCLEVBQThCLEtBQUssQ0FBbkMsQ0FBUDtBQUNqQjtBQUFpQixhQUFPLGVBQWUsQ0FBZixFQUFrQix3QkFBTyxDQUFQLENBQWxCLEVBQTZCLENBQTdCLENBQVA7QUFKbkI7QUFNRDs7QUFFRCxTQUFTLFdBQVQsQ0FBcUIsRUFBckIsRUFBeUIsQ0FBekIsRUFBNEI7QUFDMUIsT0FBSyxJQUFJLElBQUUsQ0FBTixFQUFTLElBQUUsR0FBRyxNQUFkLEVBQXNCLENBQTNCLEVBQThCLElBQUUsQ0FBaEMsRUFBbUMsRUFBRSxDQUFyQztBQUNFLFlBQVEsUUFBUSxJQUFJLEdBQUcsQ0FBSCxDQUFaLENBQVI7QUFDRSxXQUFLLFFBQUw7QUFBZSxZQUFJLFFBQVEsQ0FBUixFQUFXLENBQVgsQ0FBSixDQUFtQjtBQUNsQyxXQUFLLFFBQUw7QUFBZSxZQUFJLFNBQVMsQ0FBVCxFQUFZLENBQVosQ0FBSixDQUFvQjtBQUNuQztBQUFTLGVBQU8sU0FBUyxDQUFULEVBQVksRUFBWixFQUFnQixLQUFoQixrQkFBMkIsQ0FBM0IsRUFBOEIsR0FBRyxJQUFFLENBQUwsQ0FBOUIsQ0FBUDtBQUhYO0FBREYsR0FNQSxPQUFPLENBQVA7QUFDRDs7QUFFRCxTQUFTLElBQVQsQ0FBYyxDQUFkLEVBQWlCLENBQWpCLEVBQW9CO0FBQ2xCLFVBQVEsT0FBTyxDQUFmO0FBQ0UsU0FBSyxRQUFMO0FBQWlCLGFBQU8sUUFBUSxDQUFSLEVBQVcsQ0FBWCxDQUFQO0FBQ2pCLFNBQUssUUFBTDtBQUFpQixhQUFPLFNBQVMsQ0FBVCxFQUFZLENBQVosQ0FBUDtBQUNqQixTQUFLLFVBQUw7QUFBaUIsYUFBTyxNQUFNLENBQU4sRUFBUyxLQUFULGtCQUFvQixDQUFwQixFQUF1QixLQUFLLENBQTVCLENBQVA7QUFDakI7QUFBaUIsYUFBTyxZQUFZLENBQVosRUFBZSxDQUFmLENBQVA7QUFKbkI7QUFNRDs7QUFFRCxTQUFTLGNBQVQsQ0FBd0IsRUFBeEIsRUFBNEIsSUFBNUIsRUFBa0MsQ0FBbEMsRUFBcUM7QUFDbkMsTUFBSSxJQUFJLEdBQUcsTUFBWDtBQUNBLE1BQU0sS0FBSyxFQUFYO0FBQ0EsT0FBSyxJQUFJLElBQUUsQ0FBTixFQUFTLENBQWQsRUFBaUIsSUFBRSxDQUFuQixFQUFzQixFQUFFLENBQXhCLEVBQTJCO0FBQ3pCLE9BQUcsSUFBSCxDQUFRLENBQVI7QUFDQSxZQUFRLFFBQVEsSUFBSSxHQUFHLENBQUgsQ0FBWixDQUFSO0FBQ0UsV0FBSyxRQUFMO0FBQ0UsWUFBSSxRQUFRLENBQVIsRUFBVyxDQUFYLENBQUo7QUFDQTtBQUNGLFdBQUssUUFBTDtBQUNFLFlBQUksU0FBUyxDQUFULEVBQVksQ0FBWixDQUFKO0FBQ0E7QUFDRjtBQUNFLFlBQUksU0FBUyxDQUFULEVBQVksRUFBWixFQUFnQixLQUFoQixFQUF1QixJQUF2QixFQUE2QixDQUE3QixFQUFnQyxHQUFHLElBQUUsQ0FBTCxDQUFoQyxDQUFKO0FBQ0EsWUFBSSxDQUFKO0FBQ0E7QUFWSjtBQVlEO0FBQ0QsTUFBSSxNQUFNLEdBQUcsTUFBYixFQUNFLElBQUksS0FBSyxDQUFMLEVBQVEsR0FBRyxJQUFFLENBQUwsQ0FBUixDQUFKO0FBQ0YsU0FBTyxLQUFLLEVBQUUsQ0FBZCxFQUFpQjtBQUNmLFFBQU0sS0FBSSxHQUFHLENBQUgsQ0FBVjtBQUNBLFlBQVEsT0FBTyxFQUFmO0FBQ0UsV0FBSyxRQUFMO0FBQWUsWUFBSSxRQUFRLEVBQVIsRUFBVyxDQUFYLEVBQWMsR0FBRyxDQUFILENBQWQsQ0FBSixDQUEwQjtBQUN6QyxXQUFLLFFBQUw7QUFBZSxZQUFJLFNBQVMsRUFBVCxFQUFZLENBQVosRUFBZSxHQUFHLENBQUgsQ0FBZixDQUFKLENBQTJCO0FBRjVDO0FBSUQ7QUFDRCxTQUFPLENBQVA7QUFDRDs7QUFFRDs7QUFFQSxTQUFTLE9BQVQsQ0FBaUIsUUFBakIsRUFBMkIsQ0FBM0IsRUFBOEI7QUFDNUIsTUFBSSxVQUFKO0FBQ0EsT0FBSyxJQUFNLENBQVgsSUFBZ0IsUUFBaEIsRUFBMEI7QUFDeEIsUUFBTSxJQUFJLEtBQUssU0FBUyxDQUFULENBQUwsRUFBa0IsQ0FBbEIsQ0FBVjtBQUNBLFFBQUksMkJBQVUsQ0FBVixDQUFKLEVBQWtCO0FBQ2hCLFVBQUksQ0FBQyxDQUFMLEVBQ0UsSUFBSSxFQUFKO0FBQ0YsUUFBRSxDQUFGLElBQU8sQ0FBUDtBQUNEO0FBQ0Y7QUFDRCxTQUFPLENBQVA7QUFDRDs7QUFFRCxJQUFNLFVBQVUsU0FBVixPQUFVLENBQUMsUUFBRCxFQUFXLENBQVg7QUFBQSxTQUFpQixpQkFBUztBQUN4QyxRQUFJLENBQUMsMEJBQVMsS0FBVCxDQUFMLEVBQ0UsUUFBUSxLQUFLLENBQWI7QUFDRixTQUFLLElBQU0sQ0FBWCxJQUFnQixRQUFoQjtBQUNFLFVBQUksS0FBSyxTQUFTLENBQVQsQ0FBTCxFQUFrQixTQUFTLE1BQU0sQ0FBTixDQUEzQixFQUFxQyxDQUFyQyxDQUFKO0FBREYsS0FFQSxPQUFPLENBQVA7QUFDRCxHQU5lO0FBQUEsQ0FBaEI7O0FBUUE7O0FBRUEsSUFBTSxPQUFPLFNBQVAsSUFBTyxDQUFDLE1BQUQsRUFBUyxHQUFUO0FBQUEsU0FBaUI7QUFBQSxXQUM1QixRQUFRLEdBQVIsQ0FBWSxLQUFaLENBQWtCLE9BQWxCLEVBQTJCLE9BQU8sTUFBUCxDQUFjLENBQUMsR0FBRCxFQUFNLENBQU4sQ0FBZCxDQUEzQixLQUF1RCxDQUQzQjtBQUFBLEdBQWpCO0FBQUEsQ0FBYjs7QUFHQSxTQUFTLFFBQVQsQ0FBa0IsSUFBbEIsRUFBd0IsSUFBeEIsRUFBOEI7QUFDNUIsTUFBTSxJQUFJLEtBQUssTUFBZjtBQUNBLFNBQU8sVUFBQyxDQUFELEVBQUksS0FBSixFQUFXLENBQVgsRUFBYyxDQUFkLEVBQW9CO0FBQ3pCLFFBQU0sS0FBSyxFQUFFLEVBQWI7QUFBQSxRQUNNLE9BQU8sU0FBUCxJQUFPLENBQUMsQ0FBRCxFQUFJLENBQUo7QUFBQSxhQUFVLEtBQUssQ0FBTCxHQUFTO0FBQUEsZUFBSyxLQUFLLFFBQVEsS0FBSyxDQUFMLENBQVIsRUFBaUIsQ0FBakIsRUFBb0IsQ0FBcEIsQ0FBTCxFQUE2QixJQUFFLENBQS9CLENBQUw7QUFBQSxPQUFULEdBQWtELENBQTVEO0FBQUEsS0FEYjtBQUVBLFFBQUksSUFBSSxHQUFHLENBQUgsRUFBTSxLQUFLLENBQUwsRUFBUSxJQUFFLENBQVYsQ0FBTixDQUFSO0FBQ0EsUUFBSSxDQUFDLDBCQUFTLENBQVQsQ0FBTCxFQUNFLElBQUksS0FBSyxDQUFUO0FBQ0YsU0FBSyxJQUFJLElBQUUsSUFBRSxDQUFiLEVBQWdCLEtBQUcsQ0FBbkIsRUFBc0IsRUFBRSxDQUF4QixFQUEyQjtBQUN6QixVQUFNLElBQUksS0FBSyxDQUFMLENBQVY7QUFBQSxVQUFtQixJQUFJLEtBQUssRUFBRSxDQUFGLENBQTVCO0FBQ0EsVUFBSSxHQUFHLENBQUgsRUFBTyxPQUFPLEtBQUssQ0FBTCxFQUFRLENBQVIsRUFBVyxLQUFYLEVBQWtCLENBQWxCLEVBQXFCLENBQXJCLENBQVAsR0FBaUMsTUFBTSxDQUFOLEVBQVMsQ0FBVCxDQUF4QyxDQUFKO0FBQ0Q7QUFDRCxXQUFPLENBQUMsR0FBRSxFQUFFLEdBQUwsRUFBVSxrQkFBVixFQUE4QixDQUE5QixDQUFQO0FBQ0QsR0FYRDtBQVlEOztBQUVELElBQU0sYUFBYSxTQUFiLFVBQWE7QUFBQSxTQUFRLFVBQUMsQ0FBRCxFQUFJLEtBQUosRUFBVyxDQUFYLEVBQWMsQ0FBZDtBQUFBLFdBQ3pCLENBQUMsR0FBRSxFQUFFLEdBQUwsRUFBVTtBQUFBLGFBQUssS0FBSyxDQUFMLEVBQVEsQ0FBUixDQUFMO0FBQUEsS0FBVixFQUEyQixNQUFNLEtBQUssQ0FBTCxFQUFRLENBQVIsQ0FBTixFQUFrQixDQUFsQixDQUEzQixDQUR5QjtBQUFBLEdBQVI7QUFBQSxDQUFuQjs7QUFHQSxJQUFNLFdBQVcsU0FBWCxRQUFXLENBQUMsR0FBRCxFQUFNLEdBQU4sRUFBVyxDQUFYO0FBQUEsU0FBaUIsZ0NBQWUsQ0FBZixFQUFrQixHQUFsQixJQUF5QixHQUF6QixHQUErQixDQUFoRDtBQUFBLENBQWpCOztBQUVBLFNBQVMsU0FBVCxDQUFtQixJQUFuQixFQUF5QixFQUF6QixFQUE2QjtBQUMzQixPQUFLLElBQUksSUFBRSxDQUFOLEVBQVMsSUFBRSxHQUFHLE1BQW5CLEVBQTJCLElBQUUsQ0FBN0IsRUFBZ0MsRUFBRSxDQUFsQztBQUNFLFFBQUksS0FBSyxHQUFHLENBQUgsQ0FBTCxFQUFZLENBQVosQ0FBSixFQUNFLE9BQU8sQ0FBUDtBQUZKLEdBR0EsT0FBTyxDQUFDLENBQVI7QUFDRDs7QUFFRCxTQUFTLGtCQUFULENBQTRCLElBQTVCLEVBQWtDLEVBQWxDLEVBQXNDLEVBQXRDLEVBQTBDLEVBQTFDLEVBQThDO0FBQzVDLE9BQUssSUFBSSxJQUFFLENBQU4sRUFBUyxJQUFFLEdBQUcsTUFBZCxFQUFzQixDQUEzQixFQUE4QixJQUFFLENBQWhDLEVBQW1DLEVBQUUsQ0FBckM7QUFDRSxLQUFDLEtBQUssSUFBSSxHQUFHLENBQUgsQ0FBVCxFQUFnQixDQUFoQixJQUFxQixFQUFyQixHQUEwQixFQUEzQixFQUErQixJQUEvQixDQUFvQyxDQUFwQztBQURGO0FBRUQ7O0FBRUQ7O0FBRU8sU0FBUyxVQUFULENBQW9CLENBQXBCLEVBQXVCO0FBQzVCLFVBQVEsT0FBTyxDQUFmO0FBQ0UsU0FBSyxRQUFMO0FBQWlCLGFBQU8sUUFBUSxDQUFSLENBQVA7QUFDakIsU0FBSyxRQUFMO0FBQWlCLGFBQU8sU0FBUyxDQUFULENBQVA7QUFDakIsU0FBSyxVQUFMO0FBQWlCLGFBQU8sTUFBTSxDQUFOLENBQVA7QUFDakI7QUFBaUIsYUFBTyxTQUFTLENBQVQsRUFBVyxDQUFYLENBQVA7QUFKbkI7QUFNRDs7QUFFRDs7QUFFTyxJQUFNLDBCQUFTLHVCQUFNLFVBQUMsQ0FBRCxFQUFJLElBQUosRUFBVSxDQUFWLEVBQWdCO0FBQzFDLFVBQVEsT0FBTyxDQUFmO0FBQ0UsU0FBSyxRQUFMO0FBQWlCLGFBQU8sUUFBUSxDQUFSLEVBQVcsS0FBSyxRQUFRLENBQVIsRUFBVyxDQUFYLENBQUwsRUFBb0IsQ0FBcEIsQ0FBWCxFQUFtQyxDQUFuQyxDQUFQO0FBQ2pCLFNBQUssUUFBTDtBQUFpQixhQUFPLFNBQVMsQ0FBVCxFQUFZLEtBQUssU0FBUyxDQUFULEVBQVksQ0FBWixDQUFMLEVBQXFCLENBQXJCLENBQVosRUFBcUMsQ0FBckMsQ0FBUDtBQUNqQixTQUFLLFVBQUw7QUFBaUIsYUFBTyxNQUFNLENBQU4sRUFBUyxLQUFULEVBQWdCLElBQWhCLEVBQXNCLENBQXRCLEVBQXlCLEtBQUssQ0FBOUIsQ0FBUDtBQUNqQjtBQUFpQixhQUFPLGVBQWUsQ0FBZixFQUFrQixJQUFsQixFQUF3QixDQUF4QixDQUFQO0FBSm5CO0FBTUQsQ0FQcUIsQ0FBZjs7QUFTQSxJQUFNLDBCQUFTLHVCQUFNLFVBQUMsQ0FBRCxFQUFJLENBQUo7QUFBQSxTQUFVLEtBQUssQ0FBTCxFQUFRLEtBQUssQ0FBYixFQUFnQixDQUFoQixDQUFWO0FBQUEsQ0FBTixDQUFmOztBQUVBLElBQU0sb0JBQU0sdUJBQU0sSUFBTixDQUFaOztBQUVQOztBQUVPLFNBQVMsT0FBVCxHQUFtQjtBQUN4QixVQUFRLFVBQVUsTUFBbEI7QUFDRSxTQUFLLENBQUw7QUFBUSxhQUFPLFFBQVA7QUFDUixTQUFLLENBQUw7QUFBUSxhQUFPLFVBQVUsQ0FBVixDQUFQO0FBQ1I7QUFBUztBQUNQLFlBQU0sSUFBSSxVQUFVLE1BQXBCO0FBQUEsWUFBNEIsU0FBUyxNQUFNLENBQU4sQ0FBckM7QUFDQSxhQUFLLElBQUksSUFBRSxDQUFYLEVBQWMsSUFBRSxDQUFoQixFQUFtQixFQUFFLENBQXJCO0FBQ0UsaUJBQU8sQ0FBUCxJQUFZLFVBQVUsQ0FBVixDQUFaO0FBREYsU0FFQSxPQUFPLE1BQVA7QUFDRDtBQVJIO0FBVUQ7O0FBRUQ7O0FBRU8sSUFBTSx3QkFBUSx1QkFBTSxVQUFDLEtBQUQsRUFBUSxFQUFSO0FBQUEsU0FDekIsQ0FBQyxFQUFELEVBQUssT0FBTyxVQUFDLEVBQUQsRUFBSyxDQUFMO0FBQUEsV0FBVywyQkFBVSxFQUFWLElBQWdCLE1BQU0sRUFBTixFQUFVLENBQVYsQ0FBaEIsR0FBK0IsSUFBMUM7QUFBQSxHQUFQLENBQUwsQ0FEeUI7QUFBQSxDQUFOLENBQWQ7O0FBR0EsSUFBTSwwQkFBUyxTQUFULE1BQVM7QUFBQSxvQ0FBSSxFQUFKO0FBQUksTUFBSjtBQUFBOztBQUFBLFNBQVcsT0FBTyxhQUFLO0FBQzNDLFFBQU0sSUFBSSxVQUFVO0FBQUEsYUFBSywyQkFBVSxLQUFLLENBQUwsRUFBUSxDQUFSLENBQVYsQ0FBTDtBQUFBLEtBQVYsRUFBc0MsRUFBdEMsQ0FBVjtBQUNBLFdBQU8sSUFBSSxDQUFKLEdBQVEsSUFBUixHQUFlLEdBQUcsQ0FBSCxDQUF0QjtBQUNELEdBSGdDLENBQVg7QUFBQSxDQUFmOztBQUtBLElBQU0sMEJBQVMsU0FBVCxNQUFTO0FBQUEsU0FBUyxVQUFDLENBQUQsRUFBSSxLQUFKLEVBQVcsQ0FBWCxFQUFjLENBQWQ7QUFBQSxXQUM3QixJQUFJLE1BQU0sQ0FBTixFQUFTLENBQVQsQ0FBSixFQUFpQixDQUFqQixFQUFvQixLQUFwQixFQUEyQixDQUEzQixFQUE4QixDQUE5QixDQUQ2QjtBQUFBLEdBQVQ7QUFBQSxDQUFmOztBQUdBLElBQU0sc0JBQU8sU0FBUCxJQUFPO0FBQUEsU0FBSyxVQUFDLENBQUQsRUFBSSxLQUFKLEVBQVcsQ0FBWCxFQUFjLENBQWQ7QUFBQSxXQUN2QixFQUFFLENBQUYsRUFBSyxDQUFMLElBQVUsTUFBTSxDQUFOLEVBQVMsQ0FBVCxDQUFWLEdBQXdCLEtBQUssQ0FBTCxFQUFRLEtBQVIsRUFBZSxDQUFmLEVBQWtCLENBQWxCLENBREQ7QUFBQSxHQUFMO0FBQUEsQ0FBYjs7QUFHQSxJQUFNLDhCQUFXLDJCQUFqQjs7QUFFQSxTQUFTLElBQVQsQ0FBYyxDQUFkLEVBQWlCLEtBQWpCLEVBQXdCLENBQXhCLEVBQTJCLENBQTNCLEVBQThCO0FBQ25DLE1BQU0sS0FBSyxFQUFFLEVBQWI7QUFDQSxTQUFPLEtBQUssR0FBRyxDQUFILENBQUwsR0FBYSxDQUFDLEdBQUUsRUFBRSxHQUFMLEVBQVUsd0JBQU8sQ0FBUCxDQUFWLEVBQXFCLE1BQU0sS0FBSyxDQUFYLEVBQWMsQ0FBZCxDQUFyQixDQUFwQjtBQUNEOztBQUVEOztBQUVPLFNBQVMsSUFBVCxDQUFjLEdBQWQsRUFBbUI7QUFDeEIsTUFBSSxRQUFPLGNBQUMsQ0FBRCxFQUFJLEtBQUosRUFBVyxDQUFYLEVBQWMsQ0FBZDtBQUFBLFdBQW9CLENBQUMsUUFBTyxXQUFXLElBQUksR0FBSixDQUFYLENBQVIsRUFBOEIsQ0FBOUIsRUFBaUMsS0FBakMsRUFBd0MsQ0FBeEMsRUFBMkMsQ0FBM0MsQ0FBcEI7QUFBQSxHQUFYO0FBQ0EsV0FBUyxHQUFULENBQWEsQ0FBYixFQUFnQixLQUFoQixFQUF1QixDQUF2QixFQUEwQixDQUExQixFQUE2QjtBQUFDLFdBQU8sTUFBSyxDQUFMLEVBQVEsS0FBUixFQUFlLENBQWYsRUFBa0IsQ0FBbEIsQ0FBUDtBQUE0QjtBQUMxRCxTQUFPLEdBQVA7QUFDRDs7QUFFRDs7QUFFTyxJQUFNLG9CQUFNLFNBQU4sR0FBTTtBQUFBLHFDQUFJLE1BQUo7QUFBSSxVQUFKO0FBQUE7O0FBQUEsU0FBZSxJQUFJLEtBQUssTUFBTCxFQUFhLEtBQWIsQ0FBSixFQUF5QixLQUFLLE1BQUwsRUFBYSxLQUFiLENBQXpCLENBQWY7QUFBQSxDQUFaOztBQUVQOztBQUVPLElBQU0sOEJBQVcsUUFBUTtBQUFBLFNBQUssU0FBUyxDQUFDLEdBQUUsRUFBRSxLQUFMLEdBQVQsRUFBd0IsS0FBSyxFQUFFLE1BQVAsQ0FBeEIsQ0FBTDtBQUFBLENBQVIsQ0FBakI7O0FBRUEsSUFBTSwwQkFBUyx3QkFBZjs7QUFFQSxJQUFNLGdDQUFZLHVCQUFNLFVBQUMsQ0FBRCxFQUFJLENBQUosRUFBTyxLQUFQLEVBQWMsQ0FBZCxFQUFvQjtBQUNqRCxNQUFJLFFBQVEsR0FBUixDQUFZLFFBQVosS0FBeUIsWUFBekIsSUFBeUMsQ0FBQyxVQUFVLE1BQXhELEVBQWdFO0FBQzlELGNBQVUsTUFBVixHQUFtQixDQUFuQjtBQUNBLFlBQVEsSUFBUixDQUFhLG9HQUFiO0FBQ0Q7QUFDRCxTQUFPLFNBQVMsS0FBVCxFQUFnQixDQUFoQixFQUFtQixDQUFuQixFQUFzQixDQUF0QixDQUFQO0FBQ0QsQ0FOd0IsQ0FBbEI7O0FBUUEsSUFBTSw0QkFBVSxRQUFRO0FBQUEsU0FBSyxTQUFTLENBQUMsR0FBRSxFQUFFLEtBQUwsR0FBVCxFQUF3QixFQUFFLE1BQTFCLENBQUw7QUFBQSxDQUFSLENBQWhCOztBQUVBLElBQU0sd0JBQVEsdUJBQWQ7O0FBRVA7O0FBRU8sSUFBTSxnQ0FBWSx1QkFBTSxVQUFDLElBQUQsRUFBTyxDQUFQLEVBQVUsQ0FBVjtBQUFBLFNBQzdCLFFBQVEsSUFBSSxDQUFKLEVBQU8sT0FBUCxFQUFnQixJQUFoQixFQUFzQixDQUF0QixDQUFSLEtBQXFDLEVBRFI7QUFBQSxDQUFOLENBQWxCOztBQUdBLElBQU0sNEJBQVUseUJBQWhCOztBQUVBLElBQU0sa0NBQWEsdUJBQU0sVUFBQyxDQUFELEVBQUksSUFBSixFQUFVLENBQVYsRUFBZ0I7QUFDOUMsTUFBSSxRQUFRLEdBQVIsQ0FBWSxRQUFaLEtBQXlCLFlBQXpCLElBQXlDLENBQUMsV0FBVyxNQUF6RCxFQUFpRTtBQUMvRCxlQUFXLE1BQVgsR0FBb0IsQ0FBcEI7QUFDQSxZQUFRLElBQVIsQ0FBYSx5RkFBYjtBQUNEO0FBQ0QsU0FBTyxVQUFVLElBQVYsRUFBZ0IsQ0FBaEIsRUFBbUIsQ0FBbkIsQ0FBUDtBQUNELENBTnlCLENBQW5COztBQVFBLElBQU0sd0JBQVEsdUJBQU0sVUFBQyxDQUFELEVBQUksQ0FBSixFQUFPLENBQVAsRUFBVSxDQUFWO0FBQUEsU0FDekIsS0FBSyxDQUFMLEVBQVEsQ0FBUixFQUFXLElBQUksQ0FBSixFQUFPLE9BQVAsRUFBZ0IsSUFBaEIsRUFBc0IsQ0FBdEIsQ0FBWCxDQUR5QjtBQUFBLENBQU4sQ0FBZDs7QUFHQSxJQUFNLHdCQUFRLHVCQUFNLFVBQUMsQ0FBRCxFQUFJLENBQUosRUFBTyxDQUFQLEVBQVUsQ0FBVixFQUFnQjtBQUN6QyxNQUFNLEtBQUssVUFBVSxJQUFWLEVBQWdCLENBQWhCLEVBQW1CLENBQW5CLENBQVg7QUFDQSxPQUFLLElBQUksSUFBRSxHQUFHLE1BQUgsR0FBVSxDQUFyQixFQUF3QixLQUFHLENBQTNCLEVBQThCLEVBQUUsQ0FBaEMsRUFBbUM7QUFDakMsUUFBTSxJQUFJLEdBQUcsQ0FBSCxDQUFWO0FBQ0EsUUFBSSxFQUFFLENBQUYsRUFBSyxFQUFFLENBQUYsQ0FBTCxFQUFXLEVBQUUsQ0FBRixDQUFYLENBQUo7QUFDRDtBQUNELFNBQU8sQ0FBUDtBQUNELENBUG9CLENBQWQ7O0FBU0EsSUFBTSw0QkFBVSxNQUFNLElBQUksVUFBQyxDQUFELEVBQUksQ0FBSjtBQUFBLFNBQVUsSUFBSSxDQUFkO0FBQUEsQ0FBSixDQUFOLENBQWhCOztBQUVBLElBQU0sNEJBQVUsTUFBTSxJQUFJLFVBQUMsQ0FBRCxFQUFJLENBQUo7QUFBQSxTQUFVLElBQUksQ0FBZDtBQUFBLENBQUosQ0FBTixDQUFoQjs7QUFFQSxJQUFNLDRCQUFVLFFBQVEsS0FBSyxDQUFMLENBQVIsRUFBaUIsT0FBTyxDQUFQLEVBQVUsVUFBQyxDQUFELEVBQUksQ0FBSjtBQUFBLFNBQVUsSUFBSSxDQUFkO0FBQUEsQ0FBVixDQUFqQixDQUFoQjs7QUFFQSxJQUFNLG9CQUFNLFFBQVEsS0FBSyxDQUFMLENBQVIsRUFBaUIsT0FBTyxDQUFQLEVBQVUsVUFBQyxDQUFELEVBQUksQ0FBSjtBQUFBLFNBQVUsSUFBSSxDQUFkO0FBQUEsQ0FBVixDQUFqQixDQUFaOztBQUVQOztBQUVPLFNBQVMsTUFBVCxDQUFnQixRQUFoQixFQUEwQjtBQUMvQixNQUFNLE9BQU8sRUFBYjtBQUFBLE1BQWlCLE9BQU8sRUFBeEI7QUFDQSxPQUFLLElBQU0sQ0FBWCxJQUFnQixRQUFoQixFQUEwQjtBQUN4QixTQUFLLElBQUwsQ0FBVSxDQUFWO0FBQ0EsU0FBSyxJQUFMLENBQVUsV0FBVyxTQUFTLENBQVQsQ0FBWCxDQUFWO0FBQ0Q7QUFDRCxTQUFPLFNBQVMsSUFBVCxFQUFlLElBQWYsQ0FBUDtBQUNEOztBQUVEOztBQUVPLFNBQVMsUUFBVCxDQUFrQixDQUFsQixFQUFxQixLQUFyQixFQUE0QixFQUE1QixFQUFnQyxDQUFoQyxFQUFtQztBQUN4QyxNQUFJLHlCQUFRLEVBQVIsQ0FBSixFQUNFLE9BQU8sTUFBTSxLQUFOLEdBQ0wsaUJBQWlCLEtBQWpCLEVBQXdCLEVBQXhCLENBREssR0FFTCxxQkFBcUIsQ0FBckIsRUFBd0IsS0FBeEIsRUFBK0IsRUFBL0IsQ0FGRixDQURGLEtBSUssSUFBSSwwQkFBUyxFQUFULENBQUosRUFDSCxPQUFPLFNBQVMsc0JBQUssRUFBTCxDQUFULEVBQW1CLENBQW5CLEVBQXNCLEtBQXRCLEVBQTZCLEVBQTdCLENBQVAsQ0FERyxLQUdILE9BQU8sR0FBRyxDQUFILEVBQU0sRUFBTixDQUFQO0FBQ0g7O0FBRUQ7O0FBRU8sSUFBTSxvQkFBTSx1QkFBTSxJQUFOLENBQVo7O0FBRVA7O0FBRU8sSUFBTSxzQkFBTyx1QkFBTSxVQUFDLEdBQUQsRUFBTSxHQUFOO0FBQUEsU0FBYyxVQUFDLENBQUQsRUFBSSxLQUFKLEVBQVcsQ0FBWCxFQUFjLENBQWQ7QUFBQSxXQUN0QyxDQUFDLEdBQUUsRUFBRSxHQUFMLEVBQVU7QUFBQSxhQUFLLElBQUksQ0FBSixFQUFPLENBQVAsRUFBVSxDQUFWLENBQUw7QUFBQSxLQUFWLEVBQTZCLE1BQU0sSUFBSSxDQUFKLEVBQU8sQ0FBUCxDQUFOLEVBQWlCLENBQWpCLENBQTdCLENBRHNDO0FBQUEsR0FBZDtBQUFBLENBQU4sQ0FBYjs7QUFHUDs7QUFFTyxJQUFNLDRCQUFVLFNBQVYsT0FBVTtBQUFBLFNBQVksS0FDakMsYUFBSztBQUNILFFBQU0sSUFBSSxnQ0FBZSxDQUFmLEVBQWtCLENBQWxCLENBQVY7QUFDQSxRQUFJLENBQUosRUFDRSxLQUFLLElBQU0sQ0FBWCxJQUFnQixRQUFoQjtBQUNFLFFBQUUsQ0FBRixJQUFPLFNBQVMsQ0FBVCxFQUFZLENBQVosQ0FBUDtBQURGLEtBRUYsT0FBTyxDQUFQO0FBQ0QsR0FQZ0MsRUFRakMsVUFBQyxDQUFELEVBQUksQ0FBSixFQUFVO0FBQ1IsUUFBSSwwQkFBUyxDQUFULENBQUosRUFBaUI7QUFBQTtBQUNmLFlBQUksQ0FBQywwQkFBUyxDQUFULENBQUwsRUFDRSxJQUFJLEtBQUssQ0FBVDtBQUNGLFlBQUksVUFBSjtBQUNBLFlBQU0sTUFBTSxTQUFOLEdBQU0sQ0FBQyxDQUFELEVBQUksQ0FBSixFQUFVO0FBQ3BCLGNBQUksQ0FBQyxDQUFMLEVBQ0UsSUFBSSxFQUFKO0FBQ0YsWUFBRSxDQUFGLElBQU8sQ0FBUDtBQUNELFNBSkQ7QUFLQSxhQUFLLElBQU0sQ0FBWCxJQUFnQixDQUFoQixFQUFtQjtBQUNqQixjQUFJLEVBQUUsS0FBSyxRQUFQLENBQUosRUFDRSxJQUFJLENBQUosRUFBTyxFQUFFLENBQUYsQ0FBUCxFQURGLEtBR0UsSUFBSSxLQUFLLEtBQUssQ0FBZCxFQUNFLElBQUksQ0FBSixFQUFPLEVBQUUsQ0FBRixDQUFQO0FBQ0w7QUFDRDtBQUFBLGFBQU87QUFBUDtBQWhCZTs7QUFBQTtBQWlCaEI7QUFDRixHQTNCZ0MsQ0FBWjtBQUFBLENBQWhCOztBQTZCUDs7QUFFTyxJQUFNLDhCQUFXLFNBQVgsUUFBVyxNQUFPO0FBQzdCLE1BQU0sTUFBTSxTQUFOLEdBQU07QUFBQSxXQUFLLFNBQVMsR0FBVCxFQUFjLEtBQUssQ0FBbkIsRUFBc0IsQ0FBdEIsQ0FBTDtBQUFBLEdBQVo7QUFDQSxTQUFPLFVBQUMsQ0FBRCxFQUFJLEtBQUosRUFBVyxDQUFYLEVBQWMsQ0FBZDtBQUFBLFdBQW9CLENBQUMsR0FBRSxFQUFFLEdBQUwsRUFBVSxHQUFWLEVBQWUsTUFBTSwyQkFBVSxDQUFWLElBQWUsQ0FBZixHQUFtQixHQUF6QixFQUE4QixDQUE5QixDQUFmLENBQXBCO0FBQUEsR0FBUDtBQUNELENBSE07O0FBS0EsSUFBTSw4QkFBVyxTQUFYLFFBQVc7QUFBQSxTQUFPLFFBQVEsR0FBUixFQUFhLEtBQUssQ0FBbEIsQ0FBUDtBQUFBLENBQWpCOztBQUVBLElBQU0sMEJBQVMsU0FBVCxNQUFTO0FBQUEsU0FBSyxXQUFXLEtBQUssQ0FBTCxDQUFYLENBQUw7QUFBQSxDQUFmOztBQUVBLElBQU0sZ0NBQVksU0FBWixTQUFZO0FBQUEsU0FDdkIsV0FBVyxVQUFDLENBQUQsRUFBSSxDQUFKO0FBQUEsV0FBVSwyQkFBVSxDQUFWLElBQWUsS0FBSyxDQUFMLEVBQVEsQ0FBUixDQUFmLEdBQTRCLEtBQUssQ0FBM0M7QUFBQSxHQUFYLENBRHVCO0FBQUEsQ0FBbEI7O0FBR0EsSUFBTSw0QkFBVSxTQUFWLE9BQVU7QUFBQSxTQUFRLFVBQUMsQ0FBRCxFQUFJLEtBQUosRUFBVyxDQUFYLEVBQWMsQ0FBZDtBQUFBLFdBQzdCLENBQUMsR0FBRSxFQUFFLEdBQUwsRUFBVTtBQUFBLGFBQUssMkJBQVUsQ0FBVixJQUFlLEtBQUssQ0FBTCxFQUFRLENBQVIsQ0FBZixHQUE0QixLQUFLLENBQXRDO0FBQUEsS0FBVixFQUFtRCxNQUFNLENBQU4sRUFBUyxDQUFULENBQW5ELENBRDZCO0FBQUEsR0FBUjtBQUFBLENBQWhCOztBQUdQOztBQUVPLElBQU0sMEJBQVMsU0FBVCxNQUFTLENBQUMsQ0FBRCxFQUFJLEtBQUosRUFBVyxFQUFYLEVBQWUsQ0FBZjtBQUFBLFNBQ3BCLENBQUMsR0FBRSxFQUFFLEdBQUwsRUFBVTtBQUFBLFdBQUssa0JBQWtCLENBQUMseUJBQVEsRUFBUixJQUFjLEVBQWQscUJBQUQsRUFDQyxNQURELENBQ1EsMkJBQVUsQ0FBVixJQUFlLENBQUMsQ0FBRCxDQUFmLHFCQURSLENBQWxCLENBQUw7QUFBQSxHQUFWLEVBRVUsTUFBTSxLQUFLLENBQVgsRUFBYyxDQUFkLENBRlYsQ0FEb0I7QUFBQSxDQUFmOztBQUtBLElBQU0sMEJBQVMsU0FBVCxNQUFTO0FBQUEsU0FBUSxVQUFDLENBQUQsRUFBSSxLQUFKLEVBQVcsRUFBWCxFQUFlLENBQWYsRUFBcUI7QUFDakQsUUFBSSxXQUFKO0FBQUEsUUFBUSx1QkFBUjtBQUNBLFFBQUkseUJBQVEsRUFBUixDQUFKLEVBQ0UsbUJBQW1CLElBQW5CLEVBQXlCLEVBQXpCLEVBQTZCLEtBQUssRUFBbEMsRUFBc0MsS0FBSyxFQUEzQztBQUNGLFdBQU8sQ0FBQyxHQUFFLEVBQUUsR0FBTCxFQUFVO0FBQUEsYUFBTSxrQkFBa0IseUJBQVEsRUFBUixJQUFZLEdBQUcsTUFBSCxDQUFVLEVBQVYsQ0FBWixHQUEwQixFQUE1QyxDQUFOO0FBQUEsS0FBVixFQUNVLE1BQU0sRUFBTixFQUFVLENBQVYsQ0FEVixDQUFQO0FBRUQsR0FOcUI7QUFBQSxDQUFmOztBQVFBLElBQU0sc0JBQU8sU0FBUCxJQUFPO0FBQUEsU0FBUSxPQUFPLGNBQU07QUFDdkMsUUFBSSxDQUFDLHlCQUFRLEVBQVIsQ0FBTCxFQUNFLE9BQU8sQ0FBUDtBQUNGLFFBQU0sSUFBSSxVQUFVLElBQVYsRUFBZ0IsRUFBaEIsQ0FBVjtBQUNBLFdBQU8sSUFBSSxDQUFKLEdBQVEsTUFBUixHQUFpQixDQUF4QjtBQUNELEdBTDJCLENBQVI7QUFBQSxDQUFiOztBQU9BLFNBQVMsUUFBVCxHQUF5QjtBQUM5QixNQUFNLE1BQU0sbUNBQVo7QUFDQSxTQUFPLENBQUMsS0FBSztBQUFBLFdBQUssMkJBQVUsS0FBSyxHQUFMLEVBQVUsQ0FBVixDQUFWLENBQUw7QUFBQSxHQUFMLENBQUQsRUFBcUMsR0FBckMsQ0FBUDtBQUNEOztBQUVNLFNBQVMsS0FBVCxDQUFlLENBQWYsRUFBa0I7QUFDdkIsTUFBSSxRQUFRLEdBQVIsQ0FBWSxRQUFaLEtBQXlCLFlBQXpCLElBQXlDLEVBQUUsT0FBTyxTQUFQLENBQWlCLENBQWpCLEtBQXVCLEtBQUssQ0FBOUIsQ0FBN0MsRUFDRSxNQUFNLElBQUksS0FBSixDQUFVLHlDQUFWLENBQU47QUFDRixTQUFPLENBQVA7QUFDRDs7QUFFRDs7QUFFTyxTQUFTLElBQVQsQ0FBYyxDQUFkLEVBQWlCO0FBQ3RCLE1BQUksUUFBUSxHQUFSLENBQVksUUFBWixLQUF5QixZQUF6QixJQUF5QyxPQUFPLENBQVAsS0FBYSxRQUExRCxFQUNFLE1BQU0sSUFBSSxLQUFKLENBQVUsMEJBQVYsQ0FBTjtBQUNGLFNBQU8sQ0FBUDtBQUNEOztBQUVNLFNBQVMsS0FBVCxHQUFpQjtBQUN0QixNQUFNLElBQUksVUFBVSxNQUFwQjtBQUFBLE1BQTRCLFdBQVcsRUFBdkM7QUFDQSxPQUFLLElBQUksSUFBRSxDQUFOLEVBQVMsQ0FBZCxFQUFpQixJQUFFLENBQW5CLEVBQXNCLEVBQUUsQ0FBeEI7QUFDRSxhQUFTLElBQUksVUFBVSxDQUFWLENBQWIsSUFBNkIsQ0FBN0I7QUFERixHQUVBLE9BQU8sS0FBSyxRQUFMLENBQVA7QUFDRDs7QUFFRDs7QUFFTyxJQUFNLDRCQUFVLFNBQVYsT0FBVTtBQUFBLFNBQUssVUFBQyxFQUFELEVBQUssS0FBTCxFQUFZLENBQVosRUFBZSxDQUFmO0FBQUEsV0FDMUIsTUFBTSwyQkFBVSxDQUFWLEtBQWdCLE1BQU0sSUFBdEIsR0FBNkIsQ0FBN0IsR0FBaUMsQ0FBdkMsRUFBMEMsQ0FBMUMsQ0FEMEI7QUFBQSxHQUFMO0FBQUEsQ0FBaEI7O0FBR1A7O0FBRU8sSUFBTSwwQkFDWCx1QkFBTSxVQUFDLENBQUQsRUFBSSxDQUFKO0FBQUEsU0FBVSxPQUFPO0FBQUEsV0FBSywyQkFBVSxLQUFLLENBQUwsRUFBUSxDQUFSLENBQVYsSUFBd0IsQ0FBeEIsR0FBNEIsQ0FBakM7QUFBQSxHQUFQLENBQVY7QUFBQSxDQUFOLENBREs7O0FBR1A7O0FBRU8sSUFBTSxrQkFBSyxTQUFMLEVBQUs7QUFBQSxTQUFRLFVBQUMsQ0FBRCxFQUFJLEtBQUosRUFBVyxDQUFYLEVBQWMsQ0FBZDtBQUFBLFdBQ3hCLENBQUMsR0FBRSxFQUFFLEdBQUwsRUFBVSx3QkFBTyxDQUFQLENBQVYsRUFBcUIsTUFBTSxLQUFLLENBQUwsRUFBUSxDQUFSLENBQU4sRUFBa0IsQ0FBbEIsQ0FBckIsQ0FEd0I7QUFBQSxHQUFSO0FBQUEsQ0FBWDs7QUFHQSxJQUFNLHNCQUFPLFNBQVAsSUFBTztBQUFBLFNBQUssR0FBRyx3QkFBTyxDQUFQLENBQUgsQ0FBTDtBQUFBLENBQWI7O0FBRVA7O0FBRU8sSUFBTSxzQkFBTyxTQUFQLElBQU87QUFBQSxTQUFZLFVBQUMsQ0FBRCxFQUFJLEtBQUosRUFBVyxDQUFYLEVBQWMsQ0FBZDtBQUFBLFdBQzlCLENBQUMsR0FBRSxFQUFFLEdBQUwsRUFBVSxRQUFRLFFBQVIsRUFBa0IsQ0FBbEIsQ0FBVixFQUFnQyxNQUFNLFFBQVEsUUFBUixFQUFrQixDQUFsQixDQUFOLEVBQTRCLENBQTVCLENBQWhDLENBRDhCO0FBQUEsR0FBWjtBQUFBLENBQWI7O0FBR0EsSUFBTSw0QkFBVSx1QkFBTSxVQUFDLEdBQUQsRUFBTSxHQUFOLEVBQWM7QUFDekMsTUFBTSxNQUFNLFNBQU4sR0FBTTtBQUFBLFdBQUssU0FBUyxHQUFULEVBQWMsR0FBZCxFQUFtQixDQUFuQixDQUFMO0FBQUEsR0FBWjtBQUNBLFNBQU8sVUFBQyxDQUFELEVBQUksS0FBSixFQUFXLENBQVgsRUFBYyxDQUFkO0FBQUEsV0FBb0IsQ0FBQyxHQUFFLEVBQUUsR0FBTCxFQUFVLEdBQVYsRUFBZSxNQUFNLFNBQVMsR0FBVCxFQUFjLEdBQWQsRUFBbUIsQ0FBbkIsQ0FBTixFQUE2QixDQUE3QixDQUFmLENBQXBCO0FBQUEsR0FBUDtBQUNELENBSHNCLENBQWhCOztBQUtQOztBQUVPLElBQU0sa0NBQWEsd0JBQU8sQ0FBUCxFQUFVLElBQVYsQ0FBbkI7O0FBRVA7O0FBRU8sSUFBTSxvQkFDWCx1QkFBTSxVQUFDLEdBQUQsRUFBTSxHQUFOO0FBQUEsU0FBYyxVQUFDLENBQUQsRUFBSSxLQUFKLEVBQVcsQ0FBWCxFQUFjLENBQWQ7QUFBQSxXQUFvQixDQUFDLEdBQUUsRUFBRSxHQUFMLEVBQVUsR0FBVixFQUFlLE1BQU0sSUFBSSxDQUFKLENBQU4sRUFBYyxDQUFkLENBQWYsQ0FBcEI7QUFBQSxHQUFkO0FBQUEsQ0FBTixDQURLOztBQUdQOztBQUVPLElBQU0sOEJBQVcsU0FBWCxRQUFXLENBQUMsRUFBRCxFQUFLLEtBQUwsRUFBWSxDQUFaLEVBQWUsQ0FBZjtBQUFBLFNBQXFCLE1BQU0sQ0FBTixFQUFTLENBQVQsQ0FBckI7QUFBQSxDQUFqQjs7QUFFQSxJQUFNLDRCQUFVLFNBQVYsT0FBVTtBQUFBLFNBQU8sVUFBQyxDQUFELEVBQUksS0FBSixFQUFXLENBQVgsRUFBYyxDQUFkO0FBQUEsV0FDNUIsQ0FBQyxHQUFFLEVBQUUsR0FBTCxFQUFVO0FBQUEsYUFBSyxLQUFLLEdBQUwsRUFBVSxDQUFWLENBQUw7QUFBQSxLQUFWLEVBQTZCLE1BQU0sS0FBSyxHQUFMLEVBQVUsQ0FBVixDQUFOLEVBQW9CLENBQXBCLENBQTdCLENBRDRCO0FBQUEsR0FBUDtBQUFBLENBQWhCIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCB7XG4gIGFjeWNsaWNFcXVhbHNVLFxuICBhbHdheXMsXG4gIGFwcGx5VSxcbiAgYXJpdHlOLFxuICBhcnJheTAsXG4gIGFzc29jUGFydGlhbFUsXG4gIGN1cnJ5LFxuICBjdXJyeU4sXG4gIGRpc3NvY1BhcnRpYWxVLFxuICBpZCxcbiAgaXNBcnJheSxcbiAgaXNEZWZpbmVkLFxuICBpc09iamVjdCxcbiAga2V5cyxcbiAgc25kVVxufSBmcm9tIFwiaW5mZXN0aW5lc1wiXG5cbi8vXG5cbmZ1bmN0aW9uIHBhaXIoeDAsIHgxKSB7cmV0dXJuIFt4MCwgeDFdfVxuXG5jb25zdCBmbGlwID0gYm9wID0+ICh4LCB5KSA9PiBib3AoeSwgeClcblxuY29uc3QgdW50byA9IGMgPT4geCA9PiBpc0RlZmluZWQoeCkgPyB4IDogY1xuXG4vL1xuXG5mdW5jdGlvbiBtYXBQYXJ0aWFsSW5kZXhVKHhpMnksIHhzKSB7XG4gIGNvbnN0IHlzID0gW10sIG49eHMubGVuZ3RoXG4gIGZvciAobGV0IGk9MCwgeTsgaTxuOyArK2kpXG4gICAgaWYgKGlzRGVmaW5lZCh5ID0geGkyeSh4c1tpXSwgaSkpKVxuICAgICAgeXMucHVzaCh5KVxuICByZXR1cm4geXMubGVuZ3RoID8geXMgOiB2b2lkIDBcbn1cblxuLy9cblxuY29uc3QgQXBwbGljYXRpdmUgPSAobWFwLCBvZiwgYXApID0+ICh7bWFwLCBvZiwgYXB9KVxuXG5jb25zdCBJZGVudCA9IEFwcGxpY2F0aXZlKGFwcGx5VSwgaWQsIGFwcGx5VSlcblxuY29uc3QgQ29uc3QgPSB7bWFwOiBzbmRVfVxuXG5jb25zdCBUYWNub2NPZiA9IChlbXB0eSwgdGFjbm9jKSA9PiBBcHBsaWNhdGl2ZShzbmRVLCBhbHdheXMoZW1wdHkpLCB0YWNub2MpXG5cbmNvbnN0IE1vbm9pZCA9IChlbXB0eSwgY29uY2F0KSA9PiAoe2VtcHR5OiAoKSA9PiBlbXB0eSwgY29uY2F0fSlcblxuY29uc3QgTXVtID0gb3JkID0+XG4gIE1vbm9pZCh2b2lkIDAsICh5LCB4KSA9PiBpc0RlZmluZWQoeCkgJiYgKCFpc0RlZmluZWQoeSkgfHwgb3JkKHgsIHkpKSA/IHggOiB5KVxuXG4vL1xuXG5jb25zdCBydW4gPSAobywgQywgeGkyeUMsIHMsIGkpID0+IHRvRnVuY3Rpb24obykoQywgeGkyeUMsIHMsIGkpXG5cbmNvbnN0IGNvbnN0QXMgPSB0b0NvbnN0ID0+IGN1cnJ5Tig0LCAoeE1pMnksIG0pID0+IHtcbiAgY29uc3QgQyA9IHRvQ29uc3QobSlcbiAgcmV0dXJuICh0LCBzKSA9PiBydW4odCwgQywgeE1pMnksIHMpXG59KVxuXG4vL1xuXG5mdW5jdGlvbiBvZihmKSB7XG4gIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIgJiYgIWYub2YpXG4gICAgdGhyb3cgbmV3IEVycm9yKFwiVHJhdmVyc2FscyByZXF1aXJlIGFuIGFwcGxpY2F0aXZlLlwiKVxuICByZXR1cm4gZi5vZlxufVxuXG4vL1xuXG5mdW5jdGlvbiBDb25jYXQobCwgcikge3RoaXMubCA9IGw7IHRoaXMuciA9IHJ9XG5cbmNvbnN0IGlzQ29uY2F0ID0gbiA9PiBuLmNvbnN0cnVjdG9yID09PSBDb25jYXRcblxuY29uc3QgYXAgPSAociwgbCkgPT4gaXNEZWZpbmVkKGwpID8gaXNEZWZpbmVkKHIpID8gbmV3IENvbmNhdChsLCByKSA6IGwgOiByXG5cbmNvbnN0IHJjb25jYXQgPSB0ID0+IGggPT4gYXAodCwgaClcblxuZnVuY3Rpb24gcHVzaFRvKG4sIHlzKSB7XG4gIHdoaWxlIChuICYmIGlzQ29uY2F0KG4pKSB7XG4gICAgY29uc3QgbCA9IG4ubFxuICAgIG4gPSBuLnJcbiAgICBpZiAobCAmJiBpc0NvbmNhdChsKSkge1xuICAgICAgcHVzaFRvKGwubCwgeXMpXG4gICAgICBwdXNoVG8obC5yLCB5cylcbiAgICB9IGVsc2VcbiAgICAgIHlzLnB1c2gobClcbiAgfVxuICB5cy5wdXNoKG4pXG59XG5cbmZ1bmN0aW9uIHRvQXJyYXkobikge1xuICBpZiAoaXNEZWZpbmVkKG4pKSB7XG4gICAgY29uc3QgeXMgPSBbXVxuICAgIHB1c2hUbyhuLCB5cylcbiAgICByZXR1cm4geXNcbiAgfVxufVxuXG5mdW5jdGlvbiBmb2xkUmVjKGYsIHIsIG4pIHtcbiAgd2hpbGUgKGlzQ29uY2F0KG4pKSB7XG4gICAgY29uc3QgbCA9IG4ubFxuICAgIG4gPSBuLnJcbiAgICByID0gaXNDb25jYXQobClcbiAgICAgID8gZm9sZFJlYyhmLCBmb2xkUmVjKGYsIHIsIGwubCksIGwucilcbiAgICAgIDogZihyLCBsWzBdLCBsWzFdKVxuICB9XG4gIHJldHVybiBmKHIsIG5bMF0sIG5bMV0pXG59XG5cbmNvbnN0IGZvbGQgPSAoZiwgciwgbikgPT4gaXNEZWZpbmVkKG4pID8gZm9sZFJlYyhmLCByLCBuKSA6IHJcblxuY29uc3QgQ29sbGVjdCA9IFRhY25vY09mKHZvaWQgMCwgYXApXG5cbi8vXG5cbmZ1bmN0aW9uIHRyYXZlcnNlUGFydGlhbEluZGV4KEEsIHhpMnlBLCB4cykge1xuICBjb25zdCBhcCA9IEEuYXAsIG1hcCA9IEEubWFwXG4gIGxldCBzID0gb2YoQSkodm9pZCAwKSwgaSA9IHhzLmxlbmd0aFxuICB3aGlsZSAoaS0tKVxuICAgIHMgPSBhcChtYXAocmNvbmNhdCwgcyksIHhpMnlBKHhzW2ldLCBpKSlcbiAgcmV0dXJuIG1hcCh0b0FycmF5LCBzKVxufVxuXG4vL1xuXG5jb25zdCBhcnJheTBUb1VuZGVmaW5lZCA9IHhzID0+IHhzLmxlbmd0aCA/IHhzIDogdm9pZCAwXG5cbmNvbnN0IG9iamVjdDBUb1VuZGVmaW5lZCA9IG8gPT4ge1xuICBpZiAoIWlzT2JqZWN0KG8pKVxuICAgIHJldHVybiBvXG4gIGZvciAoY29uc3QgayBpbiBvKVxuICAgIHJldHVybiBvXG59XG5cbi8vXG5cbmNvbnN0IGdldFByb3AgPSAoaywgbykgPT4gaXNPYmplY3QobykgPyBvW2tdIDogdm9pZCAwXG5cbmNvbnN0IHNldFByb3AgPSAoaywgdiwgbykgPT5cbiAgaXNEZWZpbmVkKHYpID8gYXNzb2NQYXJ0aWFsVShrLCB2LCBvKSA6IGRpc3NvY1BhcnRpYWxVKGssIG8pXG5cbmNvbnN0IGZ1blByb3AgPSBrID0+IChGLCB4aTJ5RiwgeCwgXykgPT5cbiAgKDAsRi5tYXApKHYgPT4gc2V0UHJvcChrLCB2LCB4KSwgeGkyeUYoZ2V0UHJvcChrLCB4KSwgaykpXG5cbi8vXG5cbmNvbnN0IG51bGxzID0gbiA9PiBBcnJheShuKS5maWxsKG51bGwpXG5cbmNvbnN0IGdldEluZGV4ID0gKGksIHhzKSA9PiBpc0FycmF5KHhzKSA/IHhzW2ldIDogdm9pZCAwXG5cbmZ1bmN0aW9uIHNldEluZGV4KGksIHgsIHhzKSB7XG4gIGlmIChpc0RlZmluZWQoeCkpIHtcbiAgICBpZiAoIWlzQXJyYXkoeHMpKVxuICAgICAgcmV0dXJuIGkgPCAwID8gdm9pZCAwIDogbnVsbHMoaSkuY29uY2F0KFt4XSlcbiAgICBjb25zdCBuID0geHMubGVuZ3RoXG4gICAgaWYgKG4gPD0gaSlcbiAgICAgIHJldHVybiB4cy5jb25jYXQobnVsbHMoaSAtIG4pLCBbeF0pXG4gICAgaWYgKGkgPCAwKVxuICAgICAgcmV0dXJuICFuID8gdm9pZCAwIDogeHNcbiAgICBjb25zdCB5cyA9IEFycmF5KG4pXG4gICAgZm9yIChsZXQgaj0wOyBqPG47ICsrailcbiAgICAgIHlzW2pdID0geHNbal1cbiAgICB5c1tpXSA9IHhcbiAgICByZXR1cm4geXNcbiAgfSBlbHNlIHtcbiAgICBpZiAoaXNBcnJheSh4cykpIHtcbiAgICAgIGNvbnN0IG4gPSB4cy5sZW5ndGhcbiAgICAgIGlmICghbilcbiAgICAgICAgcmV0dXJuIHZvaWQgMFxuICAgICAgaWYgKGkgPCAwIHx8IG4gPD0gaSlcbiAgICAgICAgcmV0dXJuIHhzXG4gICAgICBpZiAobiA9PT0gMSlcbiAgICAgICAgcmV0dXJuIHZvaWQgMFxuICAgICAgY29uc3QgeXMgPSBBcnJheShuLTEpXG4gICAgICBmb3IgKGxldCBqPTA7IGo8aTsgKytqKVxuICAgICAgICB5c1tqXSA9IHhzW2pdXG4gICAgICBmb3IgKGxldCBqPWkrMTsgajxuOyArK2opXG4gICAgICAgIHlzW2otMV0gPSB4c1tqXVxuICAgICAgcmV0dXJuIHlzXG4gICAgfVxuICB9XG59XG5cbmNvbnN0IGZ1bkluZGV4ID0gaSA9PiAoRiwgeGkyeUYsIHhzLCBfKSA9PlxuICAoMCxGLm1hcCkoeSA9PiBzZXRJbmRleChpLCB5LCB4cyksIHhpMnlGKGdldEluZGV4KGksIHhzKSwgaSkpXG5cbi8vXG5cbmZ1bmN0aW9uIG9wdGljKG8pIHtcbiAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIiAmJlxuICAgICAgISh0eXBlb2YgbyA9PT0gXCJmdW5jdGlvblwiICYmIG8ubGVuZ3RoID09PSA0KSlcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJFeHBlY3RpbmcgYW4gb3B0aWMuXCIpXG4gIHJldHVybiBvXG59XG5cbmNvbnN0IGNsb3NlID0gKG8sIEYsIHhpMnlGKSA9PiAoeCwgaSkgPT4gbyhGLCB4aTJ5RiwgeCwgaSlcblxuZnVuY3Rpb24gY29tcG9zZWQob2kwLCBvcykge1xuICBzd2l0Y2ggKG9zLmxlbmd0aCAtIG9pMCkge1xuICAgIGNhc2UgMDogIHJldHVybiBpZGVudGl0eVxuICAgIGNhc2UgMTogIHJldHVybiB0b0Z1bmN0aW9uKG9zW29pMF0pXG4gICAgZGVmYXVsdDogcmV0dXJuIChGLCB4aTJ5RiwgeCwgaSkgPT4ge1xuICAgICAgbGV0IG4gPSBvcy5sZW5ndGhcbiAgICAgIHhpMnlGID0gY2xvc2UodG9GdW5jdGlvbihvc1stLW5dKSwgRiwgeGkyeUYpXG4gICAgICB3aGlsZSAob2kwIDwgLS1uKVxuICAgICAgICB4aTJ5RiA9IGNsb3NlKHRvRnVuY3Rpb24ob3Nbbl0pLCBGLCB4aTJ5RilcbiAgICAgIHJldHVybiBydW4ob3Nbb2kwXSwgRiwgeGkyeUYsIHgsIGkpXG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIHNldFUobywgeCwgcykge1xuICBzd2l0Y2ggKHR5cGVvZiBvKSB7XG4gICAgY2FzZSBcInN0cmluZ1wiOiAgIHJldHVybiBzZXRQcm9wKG8sIHgsIHMpXG4gICAgY2FzZSBcIm51bWJlclwiOiAgIHJldHVybiBzZXRJbmRleChvLCB4LCBzKVxuICAgIGNhc2UgXCJmdW5jdGlvblwiOiByZXR1cm4gb3B0aWMobykoSWRlbnQsIGFsd2F5cyh4KSwgcywgdm9pZCAwKVxuICAgIGRlZmF1bHQ6ICAgICAgICAgcmV0dXJuIG1vZGlmeUNvbXBvc2VkKG8sIGFsd2F5cyh4KSwgcylcbiAgfVxufVxuXG5mdW5jdGlvbiBnZXRDb21wb3NlZChscywgcykge1xuICBmb3IgKGxldCBpPTAsIG49bHMubGVuZ3RoLCBsOyBpPG47ICsraSlcbiAgICBzd2l0Y2ggKHR5cGVvZiAobCA9IGxzW2ldKSkge1xuICAgICAgY2FzZSBcInN0cmluZ1wiOiBzID0gZ2V0UHJvcChsLCBzKTsgYnJlYWtcbiAgICAgIGNhc2UgXCJudW1iZXJcIjogcyA9IGdldEluZGV4KGwsIHMpOyBicmVha1xuICAgICAgZGVmYXVsdDogcmV0dXJuIGNvbXBvc2VkKGksIGxzKShDb25zdCwgaWQsIHMsIGxzW2ktMV0pXG4gICAgfVxuICByZXR1cm4gc1xufVxuXG5mdW5jdGlvbiBnZXRVKGwsIHMpIHtcbiAgc3dpdGNoICh0eXBlb2YgbCkge1xuICAgIGNhc2UgXCJzdHJpbmdcIjogICByZXR1cm4gZ2V0UHJvcChsLCBzKVxuICAgIGNhc2UgXCJudW1iZXJcIjogICByZXR1cm4gZ2V0SW5kZXgobCwgcylcbiAgICBjYXNlIFwiZnVuY3Rpb25cIjogcmV0dXJuIG9wdGljKGwpKENvbnN0LCBpZCwgcywgdm9pZCAwKVxuICAgIGRlZmF1bHQ6ICAgICAgICAgcmV0dXJuIGdldENvbXBvc2VkKGwsIHMpXG4gIH1cbn1cblxuZnVuY3Rpb24gbW9kaWZ5Q29tcG9zZWQob3MsIHhpMngsIHgpIHtcbiAgbGV0IG4gPSBvcy5sZW5ndGhcbiAgY29uc3QgeHMgPSBbXVxuICBmb3IgKGxldCBpPTAsIG87IGk8bjsgKytpKSB7XG4gICAgeHMucHVzaCh4KVxuICAgIHN3aXRjaCAodHlwZW9mIChvID0gb3NbaV0pKSB7XG4gICAgICBjYXNlIFwic3RyaW5nXCI6XG4gICAgICAgIHggPSBnZXRQcm9wKG8sIHgpXG4gICAgICAgIGJyZWFrXG4gICAgICBjYXNlIFwibnVtYmVyXCI6XG4gICAgICAgIHggPSBnZXRJbmRleChvLCB4KVxuICAgICAgICBicmVha1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgeCA9IGNvbXBvc2VkKGksIG9zKShJZGVudCwgeGkyeCwgeCwgb3NbaS0xXSlcbiAgICAgICAgbiA9IGlcbiAgICAgICAgYnJlYWtcbiAgICB9XG4gIH1cbiAgaWYgKG4gPT09IG9zLmxlbmd0aClcbiAgICB4ID0geGkyeCh4LCBvc1tuLTFdKVxuICB3aGlsZSAoMCA8PSAtLW4pIHtcbiAgICBjb25zdCBvID0gb3Nbbl1cbiAgICBzd2l0Y2ggKHR5cGVvZiBvKSB7XG4gICAgICBjYXNlIFwic3RyaW5nXCI6IHggPSBzZXRQcm9wKG8sIHgsIHhzW25dKTsgYnJlYWtcbiAgICAgIGNhc2UgXCJudW1iZXJcIjogeCA9IHNldEluZGV4KG8sIHgsIHhzW25dKTsgYnJlYWtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHhcbn1cblxuLy9cblxuZnVuY3Rpb24gZ2V0UGljayh0ZW1wbGF0ZSwgeCkge1xuICBsZXQgclxuICBmb3IgKGNvbnN0IGsgaW4gdGVtcGxhdGUpIHtcbiAgICBjb25zdCB2ID0gZ2V0VSh0ZW1wbGF0ZVtrXSwgeClcbiAgICBpZiAoaXNEZWZpbmVkKHYpKSB7XG4gICAgICBpZiAoIXIpXG4gICAgICAgIHIgPSB7fVxuICAgICAgcltrXSA9IHZcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJcbn1cblxuY29uc3Qgc2V0UGljayA9ICh0ZW1wbGF0ZSwgeCkgPT4gdmFsdWUgPT4ge1xuICBpZiAoIWlzT2JqZWN0KHZhbHVlKSlcbiAgICB2YWx1ZSA9IHZvaWQgMFxuICBmb3IgKGNvbnN0IGsgaW4gdGVtcGxhdGUpXG4gICAgeCA9IHNldFUodGVtcGxhdGVba10sIHZhbHVlICYmIHZhbHVlW2tdLCB4KVxuICByZXR1cm4geFxufVxuXG4vL1xuXG5jb25zdCBzaG93ID0gKGxhYmVscywgZGlyKSA9PiB4ID0+XG4gIGNvbnNvbGUubG9nLmFwcGx5KGNvbnNvbGUsIGxhYmVscy5jb25jYXQoW2RpciwgeF0pKSB8fCB4XG5cbmZ1bmN0aW9uIGJyYW5jaE9uKGtleXMsIHZhbHMpIHtcbiAgY29uc3QgbiA9IGtleXMubGVuZ3RoXG4gIHJldHVybiAoQSwgeGkyeUEsIHgsIF8pID0+IHtcbiAgICBjb25zdCBhcCA9IEEuYXAsXG4gICAgICAgICAgd2FpdCA9ICh4LCBpKSA9PiAwIDw9IGkgPyB5ID0+IHdhaXQoc2V0UHJvcChrZXlzW2ldLCB5LCB4KSwgaS0xKSA6IHhcbiAgICBsZXQgciA9IG9mKEEpKHdhaXQoeCwgbi0xKSlcbiAgICBpZiAoIWlzT2JqZWN0KHgpKVxuICAgICAgeCA9IHZvaWQgMFxuICAgIGZvciAobGV0IGk9bi0xOyAwPD1pOyAtLWkpIHtcbiAgICAgIGNvbnN0IGsgPSBrZXlzW2ldLCB2ID0geCAmJiB4W2tdXG4gICAgICByID0gYXAociwgKHZhbHMgPyB2YWxzW2ldKEEsIHhpMnlBLCB2LCBrKSA6IHhpMnlBKHYsIGspKSlcbiAgICB9XG4gICAgcmV0dXJuICgwLEEubWFwKShvYmplY3QwVG9VbmRlZmluZWQsIHIpXG4gIH1cbn1cblxuY29uc3Qgbm9ybWFsaXplciA9IHhpMnggPT4gKEYsIHhpMnlGLCB4LCBpKSA9PlxuICAoMCxGLm1hcCkoeCA9PiB4aTJ4KHgsIGkpLCB4aTJ5Rih4aTJ4KHgsIGkpLCBpKSlcblxuY29uc3QgcmVwbGFjZWQgPSAoaW5uLCBvdXQsIHgpID0+IGFjeWNsaWNFcXVhbHNVKHgsIGlubikgPyBvdXQgOiB4XG5cbmZ1bmN0aW9uIGZpbmRJbmRleCh4aTJiLCB4cykge1xuICBmb3IgKGxldCBpPTAsIG49eHMubGVuZ3RoOyBpPG47ICsraSlcbiAgICBpZiAoeGkyYih4c1tpXSwgaSkpXG4gICAgICByZXR1cm4gaVxuICByZXR1cm4gLTFcbn1cblxuZnVuY3Rpb24gcGFydGl0aW9uSW50b0luZGV4KHhpMmIsIHhzLCB0cywgZnMpIHtcbiAgZm9yIChsZXQgaT0wLCBuPXhzLmxlbmd0aCwgeDsgaTxuOyArK2kpXG4gICAgKHhpMmIoeCA9IHhzW2ldLCBpKSA/IHRzIDogZnMpLnB1c2goeClcbn1cblxuLy9cblxuZXhwb3J0IGZ1bmN0aW9uIHRvRnVuY3Rpb24obykge1xuICBzd2l0Y2ggKHR5cGVvZiBvKSB7XG4gICAgY2FzZSBcInN0cmluZ1wiOiAgIHJldHVybiBmdW5Qcm9wKG8pXG4gICAgY2FzZSBcIm51bWJlclwiOiAgIHJldHVybiBmdW5JbmRleChvKVxuICAgIGNhc2UgXCJmdW5jdGlvblwiOiByZXR1cm4gb3B0aWMobylcbiAgICBkZWZhdWx0OiAgICAgICAgIHJldHVybiBjb21wb3NlZCgwLG8pXG4gIH1cbn1cblxuLy8gT3BlcmF0aW9ucyBvbiBvcHRpY3NcblxuZXhwb3J0IGNvbnN0IG1vZGlmeSA9IGN1cnJ5KChvLCB4aTJ4LCBzKSA9PiB7XG4gIHN3aXRjaCAodHlwZW9mIG8pIHtcbiAgICBjYXNlIFwic3RyaW5nXCI6ICAgcmV0dXJuIHNldFByb3AobywgeGkyeChnZXRQcm9wKG8sIHMpLCBvKSwgcylcbiAgICBjYXNlIFwibnVtYmVyXCI6ICAgcmV0dXJuIHNldEluZGV4KG8sIHhpMngoZ2V0SW5kZXgobywgcyksIG8pLCBzKVxuICAgIGNhc2UgXCJmdW5jdGlvblwiOiByZXR1cm4gb3B0aWMobykoSWRlbnQsIHhpMngsIHMsIHZvaWQgMClcbiAgICBkZWZhdWx0OiAgICAgICAgIHJldHVybiBtb2RpZnlDb21wb3NlZChvLCB4aTJ4LCBzKVxuICB9XG59KVxuXG5leHBvcnQgY29uc3QgcmVtb3ZlID0gY3VycnkoKG8sIHMpID0+IHNldFUobywgdm9pZCAwLCBzKSlcblxuZXhwb3J0IGNvbnN0IHNldCA9IGN1cnJ5KHNldFUpXG5cbi8vIE5lc3RpbmdcblxuZXhwb3J0IGZ1bmN0aW9uIGNvbXBvc2UoKSB7XG4gIHN3aXRjaCAoYXJndW1lbnRzLmxlbmd0aCkge1xuICAgIGNhc2UgMDogcmV0dXJuIGlkZW50aXR5XG4gICAgY2FzZSAxOiByZXR1cm4gYXJndW1lbnRzWzBdXG4gICAgZGVmYXVsdDoge1xuICAgICAgY29uc3QgbiA9IGFyZ3VtZW50cy5sZW5ndGgsIGxlbnNlcyA9IEFycmF5KG4pXG4gICAgICBmb3IgKGxldCBpPTA7IGk8bjsgKytpKVxuICAgICAgICBsZW5zZXNbaV0gPSBhcmd1bWVudHNbaV1cbiAgICAgIHJldHVybiBsZW5zZXNcbiAgICB9XG4gIH1cbn1cblxuLy8gUXVlcnlpbmdcblxuZXhwb3J0IGNvbnN0IGNoYWluID0gY3VycnkoKHhpMnlPLCB4TykgPT5cbiAgW3hPLCBjaG9vc2UoKHhNLCBpKSA9PiBpc0RlZmluZWQoeE0pID8geGkyeU8oeE0sIGkpIDogemVybyldKVxuXG5leHBvcnQgY29uc3QgY2hvaWNlID0gKC4uLmxzKSA9PiBjaG9vc2UoeCA9PiB7XG4gIGNvbnN0IGkgPSBmaW5kSW5kZXgobCA9PiBpc0RlZmluZWQoZ2V0VShsLCB4KSksIGxzKVxuICByZXR1cm4gaSA8IDAgPyB6ZXJvIDogbHNbaV1cbn0pXG5cbmV4cG9ydCBjb25zdCBjaG9vc2UgPSB4aU0ybyA9PiAoQywgeGkyeUMsIHgsIGkpID0+XG4gIHJ1bih4aU0ybyh4LCBpKSwgQywgeGkyeUMsIHgsIGkpXG5cbmV4cG9ydCBjb25zdCB3aGVuID0gcCA9PiAoQywgeGkyeUMsIHgsIGkpID0+XG4gIHAoeCwgaSkgPyB4aTJ5Qyh4LCBpKSA6IHplcm8oQywgeGkyeUMsIHgsIGkpXG5cbmV4cG9ydCBjb25zdCBvcHRpb25hbCA9IHdoZW4oaXNEZWZpbmVkKVxuXG5leHBvcnQgZnVuY3Rpb24gemVybyhDLCB4aTJ5QywgeCwgaSkge1xuICBjb25zdCBvZiA9IEMub2ZcbiAgcmV0dXJuIG9mID8gb2YoeCkgOiAoMCxDLm1hcCkoYWx3YXlzKHgpLCB4aTJ5Qyh2b2lkIDAsIGkpKVxufVxuXG4vLyBSZWN1cnNpbmdcblxuZXhwb3J0IGZ1bmN0aW9uIGxhenkobzJvKSB7XG4gIGxldCBtZW1vID0gKEMsIHhpMnlDLCB4LCBpKSA9PiAobWVtbyA9IHRvRnVuY3Rpb24obzJvKHJlYykpKShDLCB4aTJ5QywgeCwgaSlcbiAgZnVuY3Rpb24gcmVjKEMsIHhpMnlDLCB4LCBpKSB7cmV0dXJuIG1lbW8oQywgeGkyeUMsIHgsIGkpfVxuICByZXR1cm4gcmVjXG59XG5cbi8vIERlYnVnZ2luZ1xuXG5leHBvcnQgY29uc3QgbG9nID0gKC4uLmxhYmVscykgPT4gaXNvKHNob3cobGFiZWxzLCBcImdldFwiKSwgc2hvdyhsYWJlbHMsIFwic2V0XCIpKVxuXG4vLyBPcGVyYXRpb25zIG9uIHRyYXZlcnNhbHNcblxuZXhwb3J0IGNvbnN0IGNvbmNhdEFzID0gY29uc3RBcyhtID0+IFRhY25vY09mKCgwLG0uZW1wdHkpKCksIGZsaXAobS5jb25jYXQpKSlcblxuZXhwb3J0IGNvbnN0IGNvbmNhdCA9IGNvbmNhdEFzKGlkKVxuXG5leHBvcnQgY29uc3QgZm9sZE1hcE9mID0gY3VycnkoKG0sIHQsIHhNaTJ5LCBzKSA9PiB7XG4gIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIgJiYgIWZvbGRNYXBPZi53YXJuZWQpIHtcbiAgICBmb2xkTWFwT2Yud2FybmVkID0gMVxuICAgIGNvbnNvbGUud2FybihcInBhcnRpYWwubGVuc2VzOiBgZm9sZE1hcE9mYCBoYXMgYmVlbiBkZXByZWNhdGVkIGFuZCB3aWxsIGJlIHJlbW92ZWQuICBVc2UgYGNvbmNhdEFzYCBvciBgbWVyZ2VBc2AuXCIpXG4gIH1cbiAgcmV0dXJuIGNvbmNhdEFzKHhNaTJ5LCBtLCB0LCBzKVxufSlcblxuZXhwb3J0IGNvbnN0IG1lcmdlQXMgPSBjb25zdEFzKG0gPT4gVGFjbm9jT2YoKDAsbS5lbXB0eSkoKSwgbS5jb25jYXQpKVxuXG5leHBvcnQgY29uc3QgbWVyZ2UgPSBtZXJnZUFzKGlkKVxuXG4vLyBGb2xkcyBvdmVyIHRyYXZlcnNhbHNcblxuZXhwb3J0IGNvbnN0IGNvbGxlY3RBcyA9IGN1cnJ5KCh4aTJ5LCB0LCBzKSA9PlxuICB0b0FycmF5KHJ1bih0LCBDb2xsZWN0LCB4aTJ5LCBzKSkgfHwgW10pXG5cbmV4cG9ydCBjb25zdCBjb2xsZWN0ID0gY29sbGVjdEFzKGlkKVxuXG5leHBvcnQgY29uc3QgY29sbGVjdE1hcCA9IGN1cnJ5KCh0LCB4aTJ5LCBzKSA9PiB7XG4gIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIgJiYgIWNvbGxlY3RNYXAud2FybmVkKSB7XG4gICAgY29sbGVjdE1hcC53YXJuZWQgPSAxXG4gICAgY29uc29sZS53YXJuKFwicGFydGlhbC5sZW5zZXM6IGBjb2xsZWN0TWFwYCBoYXMgYmVlbiBkZXByZWNhdGVkIGFuZCB3aWxsIGJlIHJlbW92ZWQuICBVc2UgYGNvbGxlY3RBc2AuXCIpXG4gIH1cbiAgcmV0dXJuIGNvbGxlY3RBcyh4aTJ5LCB0LCBzKVxufSlcblxuZXhwb3J0IGNvbnN0IGZvbGRsID0gY3VycnkoKGYsIHIsIHQsIHMpID0+XG4gIGZvbGQoZiwgciwgcnVuKHQsIENvbGxlY3QsIHBhaXIsIHMpKSlcblxuZXhwb3J0IGNvbnN0IGZvbGRyID0gY3VycnkoKGYsIHIsIHQsIHMpID0+IHtcbiAgY29uc3QgeHMgPSBjb2xsZWN0QXMocGFpciwgdCwgcylcbiAgZm9yIChsZXQgaT14cy5sZW5ndGgtMTsgMDw9aTsgLS1pKSB7XG4gICAgY29uc3QgeCA9IHhzW2ldXG4gICAgciA9IGYociwgeFswXSwgeFsxXSlcbiAgfVxuICByZXR1cm4gclxufSlcblxuZXhwb3J0IGNvbnN0IG1heGltdW0gPSBtZXJnZShNdW0oKHgsIHkpID0+IHggPiB5KSlcblxuZXhwb3J0IGNvbnN0IG1pbmltdW0gPSBtZXJnZShNdW0oKHgsIHkpID0+IHggPCB5KSlcblxuZXhwb3J0IGNvbnN0IHByb2R1Y3QgPSBtZXJnZUFzKHVudG8oMSksIE1vbm9pZCgxLCAoeSwgeCkgPT4geCAqIHkpKVxuXG5leHBvcnQgY29uc3Qgc3VtID0gbWVyZ2VBcyh1bnRvKDApLCBNb25vaWQoMCwgKHksIHgpID0+IHggKyB5KSlcblxuLy8gQ3JlYXRpbmcgbmV3IHRyYXZlcnNhbHNcblxuZXhwb3J0IGZ1bmN0aW9uIGJyYW5jaCh0ZW1wbGF0ZSkge1xuICBjb25zdCBrZXlzID0gW10sIHZhbHMgPSBbXVxuICBmb3IgKGNvbnN0IGsgaW4gdGVtcGxhdGUpIHtcbiAgICBrZXlzLnB1c2goaylcbiAgICB2YWxzLnB1c2godG9GdW5jdGlvbih0ZW1wbGF0ZVtrXSkpXG4gIH1cbiAgcmV0dXJuIGJyYW5jaE9uKGtleXMsIHZhbHMpXG59XG5cbi8vIFRyYXZlcnNhbHMgYW5kIGNvbWJpbmF0b3JzXG5cbmV4cG9ydCBmdW5jdGlvbiBzZXF1ZW5jZShBLCB4aTJ5QSwgeHMsIF8pIHtcbiAgaWYgKGlzQXJyYXkoeHMpKVxuICAgIHJldHVybiBBID09PSBJZGVudFxuICAgID8gbWFwUGFydGlhbEluZGV4VSh4aTJ5QSwgeHMpXG4gICAgOiB0cmF2ZXJzZVBhcnRpYWxJbmRleChBLCB4aTJ5QSwgeHMpXG4gIGVsc2UgaWYgKGlzT2JqZWN0KHhzKSlcbiAgICByZXR1cm4gYnJhbmNoT24oa2V5cyh4cykpKEEsIHhpMnlBLCB4cylcbiAgZWxzZVxuICAgIHJldHVybiBvZihBKSh4cylcbn1cblxuLy8gT3BlcmF0aW9ucyBvbiBsZW5zZXNcblxuZXhwb3J0IGNvbnN0IGdldCA9IGN1cnJ5KGdldFUpXG5cbi8vIENyZWF0aW5nIG5ldyBsZW5zZXNcblxuZXhwb3J0IGNvbnN0IGxlbnMgPSBjdXJyeSgoZ2V0LCBzZXQpID0+IChGLCB4aTJ5RiwgeCwgaSkgPT5cbiAgKDAsRi5tYXApKHkgPT4gc2V0KHksIHgsIGkpLCB4aTJ5RihnZXQoeCwgaSksIGkpKSlcblxuLy8gQ29tcHV0aW5nIGRlcml2ZWQgcHJvcHNcblxuZXhwb3J0IGNvbnN0IGF1Z21lbnQgPSB0ZW1wbGF0ZSA9PiBsZW5zKFxuICB4ID0+IHtcbiAgICBjb25zdCB6ID0gZGlzc29jUGFydGlhbFUoMCwgeClcbiAgICBpZiAoeilcbiAgICAgIGZvciAoY29uc3QgayBpbiB0ZW1wbGF0ZSlcbiAgICAgICAgeltrXSA9IHRlbXBsYXRlW2tdKHopXG4gICAgcmV0dXJuIHpcbiAgfSxcbiAgKHksIHgpID0+IHtcbiAgICBpZiAoaXNPYmplY3QoeSkpIHtcbiAgICAgIGlmICghaXNPYmplY3QoeCkpXG4gICAgICAgIHggPSB2b2lkIDBcbiAgICAgIGxldCB6XG4gICAgICBjb25zdCBzZXQgPSAoaywgdikgPT4ge1xuICAgICAgICBpZiAoIXopXG4gICAgICAgICAgeiA9IHt9XG4gICAgICAgIHpba10gPSB2XG4gICAgICB9XG4gICAgICBmb3IgKGNvbnN0IGsgaW4geSkge1xuICAgICAgICBpZiAoIShrIGluIHRlbXBsYXRlKSlcbiAgICAgICAgICBzZXQoaywgeVtrXSlcbiAgICAgICAgZWxzZVxuICAgICAgICAgIGlmICh4ICYmIGsgaW4geClcbiAgICAgICAgICAgIHNldChrLCB4W2tdKVxuICAgICAgfVxuICAgICAgcmV0dXJuIHpcbiAgICB9XG4gIH0pXG5cbi8vIEVuZm9yY2luZyBpbnZhcmlhbnRzXG5cbmV4cG9ydCBjb25zdCBkZWZhdWx0cyA9IG91dCA9PiB7XG4gIGNvbnN0IG8ydSA9IHggPT4gcmVwbGFjZWQob3V0LCB2b2lkIDAsIHgpXG4gIHJldHVybiAoRiwgeGkyeUYsIHgsIGkpID0+ICgwLEYubWFwKShvMnUsIHhpMnlGKGlzRGVmaW5lZCh4KSA/IHggOiBvdXQsIGkpKVxufVxuXG5leHBvcnQgY29uc3QgcmVxdWlyZWQgPSBpbm4gPT4gcmVwbGFjZShpbm4sIHZvaWQgMClcblxuZXhwb3J0IGNvbnN0IGRlZmluZSA9IHYgPT4gbm9ybWFsaXplcih1bnRvKHYpKVxuXG5leHBvcnQgY29uc3Qgbm9ybWFsaXplID0geGkyeCA9PlxuICBub3JtYWxpemVyKCh4LCBpKSA9PiBpc0RlZmluZWQoeCkgPyB4aTJ4KHgsIGkpIDogdm9pZCAwKVxuXG5leHBvcnQgY29uc3QgcmV3cml0ZSA9IHlpMnkgPT4gKEYsIHhpMnlGLCB4LCBpKSA9PlxuICAoMCxGLm1hcCkoeSA9PiBpc0RlZmluZWQoeSkgPyB5aTJ5KHksIGkpIDogdm9pZCAwLCB4aTJ5Rih4LCBpKSlcblxuLy8gTGVuc2luZyBhcnJheXNcblxuZXhwb3J0IGNvbnN0IGFwcGVuZCA9IChGLCB4aTJ5RiwgeHMsIGkpID0+XG4gICgwLEYubWFwKSh4ID0+IGFycmF5MFRvVW5kZWZpbmVkKChpc0FycmF5KHhzKSA/IHhzIDogYXJyYXkwKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuY29uY2F0KGlzRGVmaW5lZCh4KSA/IFt4XSA6IGFycmF5MCkpLFxuICAgICAgICAgICAgeGkyeUYodm9pZCAwLCBpKSlcblxuZXhwb3J0IGNvbnN0IGZpbHRlciA9IHhpMmIgPT4gKEYsIHhpMnlGLCB4cywgaSkgPT4ge1xuICBsZXQgdHMsIGZzID0gYXJyYXkwXG4gIGlmIChpc0FycmF5KHhzKSlcbiAgICBwYXJ0aXRpb25JbnRvSW5kZXgoeGkyYiwgeHMsIHRzID0gW10sIGZzID0gW10pXG4gIHJldHVybiAoMCxGLm1hcCkodHMgPT4gYXJyYXkwVG9VbmRlZmluZWQoaXNBcnJheSh0cyk/dHMuY29uY2F0KGZzKTpmcyksXG4gICAgICAgICAgICAgICAgICAgeGkyeUYodHMsIGkpKVxufVxuXG5leHBvcnQgY29uc3QgZmluZCA9IHhpMmIgPT4gY2hvb3NlKHhzID0+IHtcbiAgaWYgKCFpc0FycmF5KHhzKSlcbiAgICByZXR1cm4gMFxuICBjb25zdCBpID0gZmluZEluZGV4KHhpMmIsIHhzKVxuICByZXR1cm4gaSA8IDAgPyBhcHBlbmQgOiBpXG59KVxuXG5leHBvcnQgZnVuY3Rpb24gZmluZFdpdGgoLi4ubHMpIHtcbiAgY29uc3QgbGxzID0gY29tcG9zZSguLi5scylcbiAgcmV0dXJuIFtmaW5kKHggPT4gaXNEZWZpbmVkKGdldFUobGxzLCB4KSkpLCBsbHNdXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpbmRleCh4KSB7XG4gIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIgJiYgIShOdW1iZXIuaXNJbnRlZ2VyKHgpICYmIDAgPD0geCkpXG4gICAgdGhyb3cgbmV3IEVycm9yKFwiYGluZGV4YCBleHBlY3RzIGEgbm9uLW5lZ2F0aXZlIGludGVnZXIuXCIpXG4gIHJldHVybiB4XG59XG5cbi8vIExlbnNpbmcgb2JqZWN0c1xuXG5leHBvcnQgZnVuY3Rpb24gcHJvcCh4KSB7XG4gIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIgJiYgdHlwZW9mIHggIT09IFwic3RyaW5nXCIpXG4gICAgdGhyb3cgbmV3IEVycm9yKFwiYHByb3BgIGV4cGVjdHMgYSBzdHJpbmcuXCIpXG4gIHJldHVybiB4XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwcm9wcygpIHtcbiAgY29uc3QgbiA9IGFyZ3VtZW50cy5sZW5ndGgsIHRlbXBsYXRlID0ge31cbiAgZm9yIChsZXQgaT0wLCBrOyBpPG47ICsraSlcbiAgICB0ZW1wbGF0ZVtrID0gYXJndW1lbnRzW2ldXSA9IGtcbiAgcmV0dXJuIHBpY2sodGVtcGxhdGUpXG59XG5cbi8vIFByb3ZpZGluZyBkZWZhdWx0c1xuXG5leHBvcnQgY29uc3QgdmFsdWVPciA9IHYgPT4gKF9GLCB4aTJ5RiwgeCwgaSkgPT5cbiAgeGkyeUYoaXNEZWZpbmVkKHgpICYmIHggIT09IG51bGwgPyB4IDogdiwgaSlcblxuLy8gQWRhcHRpbmcgdG8gZGF0YVxuXG5leHBvcnQgY29uc3Qgb3JFbHNlID1cbiAgY3VycnkoKGQsIGwpID0+IGNob29zZSh4ID0+IGlzRGVmaW5lZChnZXRVKGwsIHgpKSA/IGwgOiBkKSlcblxuLy8gUmVhZC1vbmx5IG1hcHBpbmdcblxuZXhwb3J0IGNvbnN0IHRvID0gd2kyeCA9PiAoRiwgeGkyeUYsIHcsIGkpID0+XG4gICgwLEYubWFwKShhbHdheXModyksIHhpMnlGKHdpMngodywgaSksIGkpKVxuXG5leHBvcnQgY29uc3QganVzdCA9IHggPT4gdG8oYWx3YXlzKHgpKVxuXG4vLyBUcmFuc2Zvcm1pbmcgZGF0YVxuXG5leHBvcnQgY29uc3QgcGljayA9IHRlbXBsYXRlID0+IChGLCB4aTJ5RiwgeCwgaSkgPT5cbiAgKDAsRi5tYXApKHNldFBpY2sodGVtcGxhdGUsIHgpLCB4aTJ5RihnZXRQaWNrKHRlbXBsYXRlLCB4KSwgaSkpXG5cbmV4cG9ydCBjb25zdCByZXBsYWNlID0gY3VycnkoKGlubiwgb3V0KSA9PiB7XG4gIGNvbnN0IG8yaSA9IHggPT4gcmVwbGFjZWQob3V0LCBpbm4sIHgpXG4gIHJldHVybiAoRiwgeGkyeUYsIHgsIGkpID0+ICgwLEYubWFwKShvMmksIHhpMnlGKHJlcGxhY2VkKGlubiwgb3V0LCB4KSwgaSkpXG59KVxuXG4vLyBPcGVyYXRpb25zIG9uIGlzb21vcnBoaXNtc1xuXG5leHBvcnQgY29uc3QgZ2V0SW52ZXJzZSA9IGFyaXR5TigyLCBzZXRVKVxuXG4vLyBDcmVhdGluZyBuZXcgaXNvbW9ycGhpc21zXG5cbmV4cG9ydCBjb25zdCBpc28gPVxuICBjdXJyeSgoYndkLCBmd2QpID0+IChGLCB4aTJ5RiwgeCwgaSkgPT4gKDAsRi5tYXApKGZ3ZCwgeGkyeUYoYndkKHgpLCBpKSkpXG5cbi8vIElzb21vcnBoaXNtcyBhbmQgY29tYmluYXRvcnNcblxuZXhwb3J0IGNvbnN0IGlkZW50aXR5ID0gKF9GLCB4aTJ5RiwgeCwgaSkgPT4geGkyeUYoeCwgaSlcblxuZXhwb3J0IGNvbnN0IGludmVyc2UgPSBpc28gPT4gKEYsIHhpMnlGLCB4LCBpKSA9PlxuICAoMCxGLm1hcCkoeCA9PiBnZXRVKGlzbywgeCksIHhpMnlGKHNldFUoaXNvLCB4KSwgaSkpXG4iXX0=
