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
  if ((0, _infestines.isArray)(xs)) {
    return A === Ident ? mapPartialIndexU(xi2yA, xs) : traversePartialIndex(A, xi2yA, xs);
  } else if ((0, _infestines.isObject)(xs)) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvcGFydGlhbC5sZW5zZXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7UUMwVmdCLFUsR0FBQSxVO1FBc0NBLE8sR0FBQSxPO1FBK0JBLEksR0FBQSxJO1FBT0EsSSxHQUFBLEk7UUFpRUEsTSxHQUFBLE07UUFXQSxRLEdBQUEsUTtRQTZGQSxRLEdBQUEsUTtRQW1CQSxLLEdBQUEsSzs7QUFsbUJoQjs7QUFrQkE7O0FBRUEsU0FBUyxJQUFULENBQWMsRUFBZCxFQUFrQixFQUFsQixFQUFzQjtBQUFDLFNBQU8sQ0FBQyxFQUFELEVBQUssRUFBTCxDQUFQO0FBQWdCOztBQUV2QyxJQUFNLE9BQU8sU0FBUCxJQUFPO0FBQUEsU0FBTyxVQUFDLENBQUQsRUFBSSxDQUFKO0FBQUEsV0FBVSxJQUFJLENBQUosRUFBTyxDQUFQLENBQVY7QUFBQSxHQUFQO0FBQUEsQ0FBYjs7QUFFQSxJQUFNLE9BQU8sU0FBUCxJQUFPO0FBQUEsU0FBSztBQUFBLFdBQUssMkJBQVUsQ0FBVixJQUFlLENBQWYsR0FBbUIsQ0FBeEI7QUFBQSxHQUFMO0FBQUEsQ0FBYjs7QUFFQTs7QUFFQSxTQUFTLGdCQUFULENBQTBCLElBQTFCLEVBQWdDLEVBQWhDLEVBQW9DO0FBQ2xDLE1BQU0sS0FBSyxFQUFYO0FBQUEsTUFBZSxJQUFFLEdBQUcsTUFBcEI7QUFDQSxPQUFLLElBQUksSUFBRSxDQUFOLEVBQVMsQ0FBZCxFQUFpQixJQUFFLENBQW5CLEVBQXNCLEVBQUUsQ0FBeEI7QUFDRSxRQUFJLDJCQUFVLElBQUksS0FBSyxHQUFHLENBQUgsQ0FBTCxFQUFZLENBQVosQ0FBZCxDQUFKLEVBQ0UsR0FBRyxJQUFILENBQVEsQ0FBUjtBQUZKLEdBR0EsT0FBTyxHQUFHLE1BQUgsR0FBWSxFQUFaLEdBQWlCLEtBQUssQ0FBN0I7QUFDRDs7QUFFRDs7QUFFQSxJQUFNLGNBQWMsU0FBZCxXQUFjLENB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LEVBQUUsR0FBTCxFQUFVLEdBQVYsRUFBZSxNQUFNLElBQUksQ0FBSixDQUFOLEVBQWMsQ0FBZCxDQUFmLENBQXBCO0FBQUEsR0FBZDtBQUFBLENBQU4sQ0FESzs7QUFHUDs7QUFFTyxJQUFNLDhCQUFXLFNBQVgsUUFBVyxDQUFDLEVBQUQsRUFBSyxLQUFMLEVBQVksQ0FBWixFQUFlLENBQWY7QUFBQSxTQUFxQixNQUFNLENBQU4sRUFBUyxDQUFULENBQXJCO0FBQUEsQ0FBakI7O0FBRUEsSUFBTSw0QkFBVSxTQUFWLE9BQVU7QUFBQSxTQUFPLFVBQUMsQ0FBRCxFQUFJLEtBQUosRUFBVyxDQUFYLEVBQWMsQ0FBZDtBQUFBLFdBQzVCLENBQUMsR0FBRSxFQUFFLEdBQUwsRUFBVTtBQUFBLGFBQUssS0FBSyxHQUFMLEVBQVUsQ0FBVixDQUFMO0FBQUEsS0FBVixFQUE2QixNQUFNLEtBQUssR0FBTCxFQUFVLENBQVYsQ0FBTixFQUFvQixDQUFwQixDQUE3QixDQUQ0QjtBQUFBLEdBQVA7QUFBQSxDQUFoQiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQge1xuICBhY3ljbGljRXF1YWxzVSxcbiAgYWx3YXlzLFxuICBhcHBseVUsXG4gIGFyaXR5TixcbiAgYXJyYXkwLFxuICBhc3NvY1BhcnRpYWxVLFxuICBjdXJyeSxcbiAgY3VycnlOLFxuICBkaXNzb2NQYXJ0aWFsVSxcbiAgaWQsXG4gIGlzQXJyYXksXG4gIGlzRGVmaW5lZCxcbiAgaXNPYmplY3QsXG4gIGtleXMsXG4gIHNuZFVcbn0gZnJvbSBcImluZmVzdGluZXNcIlxuXG4vL1xuXG5mdW5jdGlvbiBwYWlyKHgwLCB4MSkge3JldHVybiBbeDAsIHgxXX1cblxuY29uc3QgZmxpcCA9IGJvcCA9PiAoeCwgeSkgPT4gYm9wKHksIHgpXG5cbmNvbnN0IHVudG8gPSBjID0+IHggPT4gaXNEZWZpbmVkKHgpID8geCA6IGNcblxuLy9cblxuZnVuY3Rpb24gbWFwUGFydGlhbEluZGV4VSh4aTJ5LCB4cykge1xuICBjb25zdCB5cyA9IFtdLCBuPXhzLmxlbmd0aFxuICBmb3IgKGxldCBpPTAsIHk7IGk8bjsgKytpKVxuICAgIGlmIChpc0RlZmluZWQoeSA9IHhpMnkoeHNbaV0sIGkpKSlcbiAgICAgIHlzLnB1c2goeSlcbiAgcmV0dXJuIHlzLmxlbmd0aCA/IHlzIDogdm9pZCAwXG59XG5cbi8vXG5cbmNvbnN0IEFwcGxpY2F0aXZlID0gKG1hcCwgb2YsIGFwKSA9PiAoe21hcCwgb2YsIGFwfSlcblxuY29uc3QgSWRlbnQgPSBBcHBsaWNhdGl2ZShhcHBseVUsIGlkLCBhcHBseVUpXG5cbmNvbnN0IENvbnN0ID0ge21hcDogc25kVX1cblxuY29uc3QgVGFjbm9jT2YgPSAoZW1wdHksIHRhY25vYykgPT4gQXBwbGljYXRpdmUoc25kVSwgYWx3YXlzKGVtcHR5KSwgdGFjbm9jKVxuXG5jb25zdCBNb25vaWQgPSAoZW1wdHksIGNvbmNhdCkgPT4gKHtlbXB0eTogKCkgPT4gZW1wdHksIGNvbmNhdH0pXG5cbmNvbnN0IE11bSA9IG9yZCA9PlxuICBNb25vaWQodm9pZCAwLCAoeSwgeCkgPT4gaXNEZWZpbmVkKHgpICYmICghaXNEZWZpbmVkKHkpIHx8IG9yZCh4LCB5KSkgPyB4IDogeSlcblxuLy9cblxuY29uc3QgcnVuID0gKG8sIEMsIHhpMnlDLCBzLCBpKSA9PiB0b0Z1bmN0aW9uKG8pKEMsIHhpMnlDLCBzLCBpKVxuXG5jb25zdCBjb25zdEFzID0gdG9Db25zdCA9PiBjdXJyeU4oNCwgKHhNaTJ5LCBtKSA9PiB7XG4gIGNvbnN0IEMgPSB0b0NvbnN0KG0pXG4gIHJldHVybiAodCwgcykgPT4gcnVuKHQsIEMsIHhNaTJ5LCBzKVxufSlcblxuLy9cblxuZnVuY3Rpb24gcmVxQXBwbGljYXRpdmUoZikge1xuICBpZiAoIWYub2YpXG4gICAgdGhyb3cgbmV3IEVycm9yKFwiVHJhdmVyc2FscyByZXF1aXJlIGFuIGFwcGxpY2F0aXZlLlwiKVxufVxuXG4vL1xuXG5mdW5jdGlvbiBDb25jYXQobCwgcikge3RoaXMubCA9IGw7IHRoaXMuciA9IHJ9XG5cbmNvbnN0IGlzQ29uY2F0ID0gbiA9PiBuLmNvbnN0cnVjdG9yID09PSBDb25jYXRcblxuY29uc3QgYXAgPSAociwgbCkgPT4gaXNEZWZpbmVkKGwpID8gaXNEZWZpbmVkKHIpID8gbmV3IENvbmNhdChsLCByKSA6IGwgOiByXG5cbmNvbnN0IHJjb25jYXQgPSB0ID0+IGggPT4gYXAodCwgaClcblxuZnVuY3Rpb24gcHVzaFRvKG4sIHlzKSB7XG4gIHdoaWxlIChuICYmIGlzQ29uY2F0KG4pKSB7XG4gICAgY29uc3QgbCA9IG4ubFxuICAgIG4gPSBuLnJcbiAgICBpZiAobCAmJiBpc0NvbmNhdChsKSkge1xuICAgICAgcHVzaFRvKGwubCwgeXMpXG4gICAgICBwdXNoVG8obC5yLCB5cylcbiAgICB9IGVsc2VcbiAgICAgIHlzLnB1c2gobClcbiAgfVxuICB5cy5wdXNoKG4pXG59XG5cbmZ1bmN0aW9uIHRvQXJyYXkobikge1xuICBpZiAoaXNEZWZpbmVkKG4pKSB7XG4gICAgY29uc3QgeXMgPSBbXVxuICAgIHB1c2hUbyhuLCB5cylcbiAgICByZXR1cm4geXNcbiAgfVxufVxuXG5mdW5jdGlvbiBmb2xkUmVjKGYsIHIsIG4pIHtcbiAgd2hpbGUgKGlzQ29uY2F0KG4pKSB7XG4gICAgY29uc3QgbCA9IG4ubFxuICAgIG4gPSBuLnJcbiAgICByID0gaXNDb25jYXQobClcbiAgICAgID8gZm9sZFJlYyhmLCBmb2xkUmVjKGYsIHIsIGwubCksIGwucilcbiAgICAgIDogZihyLCBsWzBdLCBsWzFdKVxuICB9XG4gIHJldHVybiBmKHIsIG5bMF0sIG5bMV0pXG59XG5cbmNvbnN0IGZvbGQgPSAoZiwgciwgbikgPT4gaXNEZWZpbmVkKG4pID8gZm9sZFJlYyhmLCByLCBuKSA6IHJcblxuY29uc3QgQ29sbGVjdCA9IFRhY25vY09mKHZvaWQgMCwgYXApXG5cbi8vXG5cbmZ1bmN0aW9uIHRyYXZlcnNlUGFydGlhbEluZGV4KEEsIHhpMnlBLCB4cykge1xuICBjb25zdCBhcCA9IEEuYXAsIG1hcCA9IEEubWFwXG4gIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpXG4gICAgcmVxQXBwbGljYXRpdmUoQSlcbiAgbGV0IHMgPSAoMCxBLm9mKSh2b2lkIDApLCBpID0geHMubGVuZ3RoXG4gIHdoaWxlIChpLS0pXG4gICAgcyA9IGFwKG1hcChyY29uY2F0LCBzKSwgeGkyeUEoeHNbaV0sIGkpKVxuICByZXR1cm4gbWFwKHRvQXJyYXksIHMpXG59XG5cbi8vXG5cbmNvbnN0IGFycmF5MFRvVW5kZWZpbmVkID0geHMgPT4geHMubGVuZ3RoID8geHMgOiB2b2lkIDBcblxuY29uc3Qgb2JqZWN0MFRvVW5kZWZpbmVkID0gbyA9PiB7XG4gIGlmICghaXNPYmplY3QobykpXG4gICAgcmV0dXJuIG9cbiAgZm9yIChjb25zdCBrIGluIG8pXG4gICAgcmV0dXJuIG9cbn1cblxuLy9cblxuY29uc3QgZ2V0UHJvcCA9IChrLCBvKSA9PiBpc09iamVjdChvKSA/IG9ba10gOiB2b2lkIDBcblxuY29uc3Qgc2V0UHJvcCA9IChrLCB2LCBvKSA9PlxuICBpc0RlZmluZWQodikgPyBhc3NvY1BhcnRpYWxVKGssIHYsIG8pIDogZGlzc29jUGFydGlhbFUoaywgbylcblxuY29uc3QgZnVuUHJvcCA9IGsgPT4gKEYsIHhpMnlGLCB4LCBfKSA9PlxuICAoMCxGLm1hcCkodiA9PiBzZXRQcm9wKGssIHYsIHgpLCB4aTJ5RihnZXRQcm9wKGssIHgpLCBrKSlcblxuLy9cblxuY29uc3QgbnVsbHMgPSBuID0+IEFycmF5KG4pLmZpbGwobnVsbClcblxuY29uc3QgZ2V0SW5kZXggPSAoaSwgeHMpID0+IGlzQXJyYXkoeHMpID8geHNbaV0gOiB2b2lkIDBcblxuZnVuY3Rpb24gc2V0SW5kZXgoaSwgeCwgeHMpIHtcbiAgaWYgKGlzRGVmaW5lZCh4KSkge1xuICAgIGlmICghaXNBcnJheSh4cykpXG4gICAgICByZXR1cm4gaSA8IDAgPyB2b2lkIDAgOiBudWxscyhpKS5jb25jYXQoW3hdKVxuICAgIGNvbnN0IG4gPSB4cy5sZW5ndGhcbiAgICBpZiAobiA8PSBpKVxuICAgICAgcmV0dXJuIHhzLmNvbmNhdChudWxscyhpIC0gbiksIFt4XSlcbiAgICBpZiAoaSA8IDApXG4gICAgICByZXR1cm4gIW4gPyB2b2lkIDAgOiB4c1xuICAgIGNvbnN0IHlzID0gQXJyYXkobilcbiAgICBmb3IgKGxldCBqPTA7IGo8bjsgKytqKVxuICAgICAgeXNbal0gPSB4c1tqXVxuICAgIHlzW2ldID0geFxuICAgIHJldHVybiB5c1xuICB9IGVsc2Uge1xuICAgIGlmIChpc0FycmF5KHhzKSkge1xuICAgICAgY29uc3QgbiA9IHhzLmxlbmd0aFxuICAgICAgaWYgKCFuKVxuICAgICAgICByZXR1cm4gdm9pZCAwXG4gICAgICBpZiAoaSA8IDAgfHwgbiA8PSBpKVxuICAgICAgICByZXR1cm4geHNcbiAgICAgIGlmIChuID09PSAxKVxuICAgICAgICByZXR1cm4gdm9pZCAwXG4gICAgICBjb25zdCB5cyA9IEFycmF5KG4tMSlcbiAgICAgIGZvciAobGV0IGo9MDsgajxpOyArK2opXG4gICAgICAgIHlzW2pdID0geHNbal1cbiAgICAgIGZvciAobGV0IGo9aSsxOyBqPG47ICsrailcbiAgICAgICAgeXNbai0xXSA9IHhzW2pdXG4gICAgICByZXR1cm4geXNcbiAgICB9XG4gIH1cbn1cblxuY29uc3QgZnVuSW5kZXggPSBpID0+IChGLCB4aTJ5RiwgeHMsIF8pID0+XG4gICgwLEYubWFwKSh5ID0+IHNldEluZGV4KGksIHksIHhzKSwgeGkyeUYoZ2V0SW5kZXgoaSwgeHMpLCBpKSlcblxuLy9cblxuZnVuY3Rpb24gcmVxT3B0aWMobykge1xuICBpZiAoISh0eXBlb2YgbyA9PT0gXCJmdW5jdGlvblwiICYmIG8ubGVuZ3RoID09PSA0KSlcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJFeHBlY3RpbmcgYW4gb3B0aWMuXCIpXG59XG5cbmNvbnN0IGNsb3NlID0gKG8sIEYsIHhpMnlGKSA9PiAoeCwgaSkgPT4gbyhGLCB4aTJ5RiwgeCwgaSlcblxuZnVuY3Rpb24gY29tcG9zZWQob2kwLCBvcykge1xuICBzd2l0Y2ggKG9zLmxlbmd0aCAtIG9pMCkge1xuICAgIGNhc2UgMDogIHJldHVybiBpZGVudGl0eVxuICAgIGNhc2UgMTogIHJldHVybiB0b0Z1bmN0aW9uKG9zW29pMF0pXG4gICAgZGVmYXVsdDogcmV0dXJuIChGLCB4aTJ5RiwgeCwgaSkgPT4ge1xuICAgICAgbGV0IG4gPSBvcy5sZW5ndGhcbiAgICAgIHhpMnlGID0gY2xvc2UodG9GdW5jdGlvbihvc1stLW5dKSwgRiwgeGkyeUYpXG4gICAgICB3aGlsZSAob2kwIDwgLS1uKVxuICAgICAgICB4aTJ5RiA9IGNsb3NlKHRvRnVuY3Rpb24ob3Nbbl0pLCBGLCB4aTJ5RilcbiAgICAgIHJldHVybiBydW4ob3Nbb2kwXSwgRiwgeGkyeUYsIHgsIGkpXG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIHNldFUobywgeCwgcykge1xuICBzd2l0Y2ggKHR5cGVvZiBvKSB7XG4gICAgY2FzZSBcInN0cmluZ1wiOlxuICAgICAgcmV0dXJuIHNldFByb3AobywgeCwgcylcbiAgICBjYXNlIFwibnVtYmVyXCI6XG4gICAgICByZXR1cm4gc2V0SW5kZXgobywgeCwgcylcbiAgICBjYXNlIFwiZnVuY3Rpb25cIjpcbiAgICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpXG4gICAgICAgIHJlcU9wdGljKG8pXG4gICAgICByZXR1cm4gbyhJZGVudCwgYWx3YXlzKHgpLCBzLCB2b2lkIDApXG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBtb2RpZnlDb21wb3NlZChvLCBhbHdheXMoeCksIHMpXG4gIH1cbn1cblxuZnVuY3Rpb24gZ2V0Q29tcG9zZWQobHMsIHMpIHtcbiAgZm9yIChsZXQgaT0wLCBuPWxzLmxlbmd0aCwgbDsgaTxuOyArK2kpXG4gICAgc3dpdGNoICh0eXBlb2YgKGwgPSBsc1tpXSkpIHtcbiAgICAgIGNhc2UgXCJzdHJpbmdcIjogcyA9IGdldFByb3AobCwgcyk7IGJyZWFrXG4gICAgICBjYXNlIFwibnVtYmVyXCI6IHMgPSBnZXRJbmRleChsLCBzKTsgYnJlYWtcbiAgICAgIGRlZmF1bHQ6IHJldHVybiBjb21wb3NlZChpLCBscykoQ29uc3QsIGlkLCBzLCBsc1tpLTFdKVxuICAgIH1cbiAgcmV0dXJuIHNcbn1cblxuZnVuY3Rpb24gZ2V0VShsLCBzKSB7XG4gIHN3aXRjaCAodHlwZW9mIGwpIHtcbiAgICBjYXNlIFwic3RyaW5nXCI6XG4gICAgICByZXR1cm4gZ2V0UHJvcChsLCBzKVxuICAgIGNhc2UgXCJudW1iZXJcIjpcbiAgICAgIHJldHVybiBnZXRJbmRleChsLCBzKVxuICAgIGNhc2UgXCJmdW5jdGlvblwiOlxuICAgICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIilcbiAgICAgICAgcmVxT3B0aWMobClcbiAgICAgIHJldHVybiBsKENvbnN0LCBpZCwgcywgdm9pZCAwKVxuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gZ2V0Q29tcG9zZWQobCwgcylcbiAgfVxufVxuXG5mdW5jdGlvbiBtb2RpZnlDb21wb3NlZChvcywgeGkyeCwgeCkge1xuICBsZXQgbiA9IG9zLmxlbmd0aFxuICBjb25zdCB4cyA9IFtdXG4gIGZvciAobGV0IGk9MCwgbzsgaTxuOyArK2kpIHtcbiAgICB4cy5wdXNoKHgpXG4gICAgc3dpdGNoICh0eXBlb2YgKG8gPSBvc1tpXSkpIHtcbiAgICAgIGNhc2UgXCJzdHJpbmdcIjpcbiAgICAgICAgeCA9IGdldFByb3AobywgeClcbiAgICAgICAgYnJlYWtcbiAgICAgIGNhc2UgXCJudW1iZXJcIjpcbiAgICAgICAgeCA9IGdldEluZGV4KG8sIHgpXG4gICAgICAgIGJyZWFrXG4gICAgICBkZWZhdWx0OlxuICAgICAgICB4ID0gY29tcG9zZWQoaSwgb3MpKElkZW50LCB4aTJ4LCB4LCBvc1tpLTFdKVxuICAgICAgICBuID0gaVxuICAgICAgICBicmVha1xuICAgIH1cbiAgfVxuICBpZiAobiA9PT0gb3MubGVuZ3RoKVxuICAgIHggPSB4aTJ4KHgsIG9zW24tMV0pXG4gIHdoaWxlICgwIDw9IC0tbikge1xuICAgIGNvbnN0IG8gPSBvc1tuXVxuICAgIHN3aXRjaCAodHlwZW9mIG8pIHtcbiAgICAgIGNhc2UgXCJzdHJpbmdcIjogeCA9IHNldFByb3AobywgeCwgeHNbbl0pOyBicmVha1xuICAgICAgY2FzZSBcIm51bWJlclwiOiB4ID0gc2V0SW5kZXgobywgeCwgeHNbbl0pOyBicmVha1xuICAgIH1cbiAgfVxuICByZXR1cm4geFxufVxuXG4vL1xuXG5mdW5jdGlvbiBnZXRQaWNrKHRlbXBsYXRlLCB4KSB7XG4gIGxldCByXG4gIGZvciAoY29uc3QgayBpbiB0ZW1wbGF0ZSkge1xuICAgIGNvbnN0IHYgPSBnZXRVKHRlbXBsYXRlW2tdLCB4KVxuICAgIGlmIChpc0RlZmluZWQodikpIHtcbiAgICAgIGlmICghcilcbiAgICAgICAgciA9IHt9XG4gICAgICByW2tdID0gdlxuICAgIH1cbiAgfVxuICByZXR1cm4gclxufVxuXG5jb25zdCBzZXRQaWNrID0gKHRlbXBsYXRlLCB4KSA9PiB2YWx1ZSA9PiB7XG4gIGlmICghaXNPYmplY3QodmFsdWUpKVxuICAgIHZhbHVlID0gdm9pZCAwXG4gIGZvciAoY29uc3QgayBpbiB0ZW1wbGF0ZSlcbiAgICB4ID0gc2V0VSh0ZW1wbGF0ZVtrXSwgdmFsdWUgJiYgdmFsdWVba10sIHgpXG4gIHJldHVybiB4XG59XG5cbi8vXG5cbmNvbnN0IHNob3cgPSAobGFiZWxzLCBkaXIpID0+IHggPT5cbiAgY29uc29sZS5sb2cuYXBwbHkoY29uc29sZSwgbGFiZWxzLmNvbmNhdChbZGlyLCB4XSkpIHx8IHhcblxuZnVuY3Rpb24gYnJhbmNoT24oa2V5cywgdmFscykge1xuICBjb25zdCBuID0ga2V5cy5sZW5ndGhcbiAgcmV0dXJuIChBLCB4aTJ5QSwgeCwgXykgPT4ge1xuICAgIGNvbnN0IGFwID0gQS5hcCxcbiAgICAgICAgICB3YWl0ID0gKHgsIGkpID0+IDAgPD0gaSA/IHkgPT4gd2FpdChzZXRQcm9wKGtleXNbaV0sIHksIHgpLCBpLTEpIDogeFxuICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpXG4gICAgICByZXFBcHBsaWNhdGl2ZShBKVxuICAgIGxldCByID0gKDAsQS5vZikod2FpdCh4LCBuLTEpKVxuICAgIGlmICghaXNPYmplY3QoeCkpXG4gICAgICB4ID0gdm9pZCAwXG4gICAgZm9yIChsZXQgaT1uLTE7IDA8PWk7IC0taSkge1xuICAgICAgY29uc3QgayA9IGtleXNbaV0sIHYgPSB4ICYmIHhba11cbiAgICAgIHIgPSBhcChyLCAodmFscyA/IHZhbHNbaV0oQSwgeGkyeUEsIHYsIGspIDogeGkyeUEodiwgaykpKVxuICAgIH1cbiAgICByZXR1cm4gKDAsQS5tYXApKG9iamVjdDBUb1VuZGVmaW5lZCwgcilcbiAgfVxufVxuXG5jb25zdCBub3JtYWxpemVyID0geGkyeCA9PiAoRiwgeGkyeUYsIHgsIGkpID0+XG4gICgwLEYubWFwKSh4ID0+IHhpMngoeCwgaSksIHhpMnlGKHhpMngoeCwgaSksIGkpKVxuXG5jb25zdCByZXBsYWNlZCA9IChpbm4sIG91dCwgeCkgPT4gYWN5Y2xpY0VxdWFsc1UoeCwgaW5uKSA/IG91dCA6IHhcblxuZnVuY3Rpb24gZmluZEluZGV4KHhpMmIsIHhzKSB7XG4gIGZvciAobGV0IGk9MCwgbj14cy5sZW5ndGg7IGk8bjsgKytpKVxuICAgIGlmICh4aTJiKHhzW2ldLCBpKSlcbiAgICAgIHJldHVybiBpXG4gIHJldHVybiAtMVxufVxuXG5mdW5jdGlvbiBwYXJ0aXRpb25JbnRvSW5kZXgoeGkyYiwgeHMsIHRzLCBmcykge1xuICBmb3IgKGxldCBpPTAsIG49eHMubGVuZ3RoLCB4OyBpPG47ICsraSlcbiAgICAoeGkyYih4ID0geHNbaV0sIGkpID8gdHMgOiBmcykucHVzaCh4KVxufVxuXG4vL1xuXG5leHBvcnQgZnVuY3Rpb24gdG9GdW5jdGlvbihvKSB7XG4gIHN3aXRjaCAodHlwZW9mIG8pIHtcbiAgICBjYXNlIFwic3RyaW5nXCI6XG4gICAgICByZXR1cm4gZnVuUHJvcChvKVxuICAgIGNhc2UgXCJudW1iZXJcIjpcbiAgICAgIHJldHVybiBmdW5JbmRleChvKVxuICAgIGNhc2UgXCJmdW5jdGlvblwiOlxuICAgICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIilcbiAgICAgICAgcmVxT3B0aWMobylcbiAgICAgIHJldHVybiBvXG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBjb21wb3NlZCgwLG8pXG4gIH1cbn1cblxuLy8gT3BlcmF0aW9ucyBvbiBvcHRpY3NcblxuZXhwb3J0IGNvbnN0IG1vZGlmeSA9IGN1cnJ5KChvLCB4aTJ4LCBzKSA9PiB7XG4gIHN3aXRjaCAodHlwZW9mIG8pIHtcbiAgICBjYXNlIFwic3RyaW5nXCI6XG4gICAgICByZXR1cm4gc2V0UHJvcChvLCB4aTJ4KGdldFByb3AobywgcyksIG8pLCBzKVxuICAgIGNhc2UgXCJudW1iZXJcIjpcbiAgICAgIHJldHVybiBzZXRJbmRleChvLCB4aTJ4KGdldEluZGV4KG8sIHMpLCBvKSwgcylcbiAgICBjYXNlIFwiZnVuY3Rpb25cIjpcbiAgICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpXG4gICAgICAgIHJlcU9wdGljKG8pXG4gICAgICByZXR1cm4gbyhJZGVudCwgeGkyeCwgcywgdm9pZCAwKVxuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gbW9kaWZ5Q29tcG9zZWQobywgeGkyeCwgcylcbiAgfVxufSlcblxuZXhwb3J0IGNvbnN0IHJlbW92ZSA9IGN1cnJ5KChvLCBzKSA9PiBzZXRVKG8sIHZvaWQgMCwgcykpXG5cbmV4cG9ydCBjb25zdCBzZXQgPSBjdXJyeShzZXRVKVxuXG4vLyBOZXN0aW5nXG5cbmV4cG9ydCBmdW5jdGlvbiBjb21wb3NlKCkge1xuICBzd2l0Y2ggKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICBjYXNlIDA6IHJldHVybiBpZGVudGl0eVxuICAgIGNhc2UgMTogcmV0dXJuIGFyZ3VtZW50c1swXVxuICAgIGRlZmF1bHQ6IHtcbiAgICAgIGNvbnN0IG4gPSBhcmd1bWVudHMubGVuZ3RoLCBsZW5zZXMgPSBBcnJheShuKVxuICAgICAgZm9yIChsZXQgaT0wOyBpPG47ICsraSlcbiAgICAgICAgbGVuc2VzW2ldID0gYXJndW1lbnRzW2ldXG4gICAgICByZXR1cm4gbGVuc2VzXG4gICAgfVxuICB9XG59XG5cbi8vIFF1ZXJ5aW5nXG5cbmV4cG9ydCBjb25zdCBjaGFpbiA9IGN1cnJ5KCh4aTJ5TywgeE8pID0+XG4gIFt4TywgY2hvb3NlKCh4TSwgaSkgPT4gaXNEZWZpbmVkKHhNKSA/IHhpMnlPKHhNLCBpKSA6IHplcm8pXSlcblxuZXhwb3J0IGNvbnN0IGNob2ljZSA9ICguLi5scykgPT4gY2hvb3NlKHggPT4ge1xuICBjb25zdCBpID0gZmluZEluZGV4KGwgPT4gaXNEZWZpbmVkKGdldFUobCwgeCkpLCBscylcbiAgcmV0dXJuIGkgPCAwID8gemVybyA6IGxzW2ldXG59KVxuXG5leHBvcnQgY29uc3QgY2hvb3NlID0geGlNMm8gPT4gKEMsIHhpMnlDLCB4LCBpKSA9PlxuICBydW4oeGlNMm8oeCwgaSksIEMsIHhpMnlDLCB4LCBpKVxuXG5leHBvcnQgY29uc3Qgd2hlbiA9IHAgPT4gKEMsIHhpMnlDLCB4LCBpKSA9PlxuICBwKHgsIGkpID8geGkyeUMoeCwgaSkgOiB6ZXJvKEMsIHhpMnlDLCB4LCBpKVxuXG5leHBvcnQgY29uc3Qgb3B0aW9uYWwgPSB3aGVuKGlzRGVmaW5lZClcblxuZXhwb3J0IGZ1bmN0aW9uIHplcm8oQywgeGkyeUMsIHgsIGkpIHtcbiAgY29uc3Qgb2YgPSBDLm9mXG4gIHJldHVybiBvZiA/IG9mKHgpIDogKDAsQy5tYXApKGFsd2F5cyh4KSwgeGkyeUModm9pZCAwLCBpKSlcbn1cblxuLy8gUmVjdXJzaW5nXG5cbmV4cG9ydCBmdW5jdGlvbiBsYXp5KG8ybykge1xuICBsZXQgbWVtbyA9IChDLCB4aTJ5QywgeCwgaSkgPT4gKG1lbW8gPSB0b0Z1bmN0aW9uKG8ybyhyZWMpKSkoQywgeGkyeUMsIHgsIGkpXG4gIGZ1bmN0aW9uIHJlYyhDLCB4aTJ5QywgeCwgaSkge3JldHVybiBtZW1vKEMsIHhpMnlDLCB4LCBpKX1cbiAgcmV0dXJuIHJlY1xufVxuXG4vLyBEZWJ1Z2dpbmdcblxuZXhwb3J0IGNvbnN0IGxvZyA9ICguLi5sYWJlbHMpID0+IGlzbyhzaG93KGxhYmVscywgXCJnZXRcIiksIHNob3cobGFiZWxzLCBcInNldFwiKSlcblxuLy8gT3BlcmF0aW9ucyBvbiB0cmF2ZXJzYWxzXG5cbmV4cG9ydCBjb25zdCBjb25jYXRBcyA9IGNvbnN0QXMobSA9PiBUYWNub2NPZigoMCxtLmVtcHR5KSgpLCBmbGlwKG0uY29uY2F0KSkpXG5cbmV4cG9ydCBjb25zdCBjb25jYXQgPSBjb25jYXRBcyhpZClcblxuZXhwb3J0IGNvbnN0IGZvbGRNYXBPZiA9IGN1cnJ5KChtLCB0LCB4TWkyeSwgcykgPT4ge1xuICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiICYmICFmb2xkTWFwT2Yud2FybmVkKSB7XG4gICAgZm9sZE1hcE9mLndhcm5lZCA9IDFcbiAgICBjb25zb2xlLndhcm4oXCJwYXJ0aWFsLmxlbnNlczogYGZvbGRNYXBPZmAgaGFzIGJlZW4gZGVwcmVjYXRlZCBhbmQgd2lsbCBiZSByZW1vdmVkLiAgVXNlIGBjb25jYXRBc2Agb3IgYG1lcmdlQXNgLlwiKVxuICB9XG4gIHJldHVybiBjb25jYXRBcyh4TWkyeSwgbSwgdCwgcylcbn0pXG5cbmV4cG9ydCBjb25zdCBtZXJnZUFzID0gY29uc3RBcyhtID0+IFRhY25vY09mKCgwLG0uZW1wdHkpKCksIG0uY29uY2F0KSlcblxuZXhwb3J0IGNvbnN0IG1lcmdlID0gbWVyZ2VBcyhpZClcblxuLy8gRm9sZHMgb3ZlciB0cmF2ZXJzYWxzXG5cbmV4cG9ydCBjb25zdCBjb2xsZWN0QXMgPSBjdXJyeSgoeGkyeSwgdCwgcykgPT5cbiAgdG9BcnJheShydW4odCwgQ29sbGVjdCwgeGkyeSwgcykpIHx8IFtdKVxuXG5leHBvcnQgY29uc3QgY29sbGVjdCA9IGNvbGxlY3RBcyhpZClcblxuZXhwb3J0IGNvbnN0IGNvbGxlY3RNYXAgPSBjdXJyeSgodCwgeGkyeSwgcykgPT4ge1xuICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiICYmICFjb2xsZWN0TWFwLndhcm5lZCkge1xuICAgIGNvbGxlY3RNYXAud2FybmVkID0gMVxuICAgIGNvbnNvbGUud2FybihcInBhcnRpYWwubGVuc2VzOiBgY29sbGVjdE1hcGAgaGFzIGJlZW4gZGVwcmVjYXRlZCBhbmQgd2lsbCBiZSByZW1vdmVkLiAgVXNlIGBjb2xsZWN0QXNgLlwiKVxuICB9XG4gIHJldHVybiBjb2xsZWN0QXMoeGkyeSwgdCwgcylcbn0pXG5cbmV4cG9ydCBjb25zdCBmb2xkbCA9IGN1cnJ5KChmLCByLCB0LCBzKSA9PlxuICBmb2xkKGYsIHIsIHJ1bih0LCBDb2xsZWN0LCBwYWlyLCBzKSkpXG5cbmV4cG9ydCBjb25zdCBmb2xkciA9IGN1cnJ5KChmLCByLCB0LCBzKSA9PiB7XG4gIGNvbnN0IHhzID0gY29sbGVjdEFzKHBhaXIsIHQsIHMpXG4gIGZvciAobGV0IGk9eHMubGVuZ3RoLTE7IDA8PWk7IC0taSkge1xuICAgIGNvbnN0IHggPSB4c1tpXVxuICAgIHIgPSBmKHIsIHhbMF0sIHhbMV0pXG4gIH1cbiAgcmV0dXJuIHJcbn0pXG5cbmV4cG9ydCBjb25zdCBtYXhpbXVtID0gbWVyZ2UoTXVtKCh4LCB5KSA9PiB4ID4geSkpXG5cbmV4cG9ydCBjb25zdCBtaW5pbXVtID0gbWVyZ2UoTXVtKCh4LCB5KSA9PiB4IDwgeSkpXG5cbmV4cG9ydCBjb25zdCBwcm9kdWN0ID0gbWVyZ2VBcyh1bnRvKDEpLCBNb25vaWQoMSwgKHksIHgpID0+IHggKiB5KSlcblxuZXhwb3J0IGNvbnN0IHN1bSA9IG1lcmdlQXModW50bygwKSwgTW9ub2lkKDAsICh5LCB4KSA9PiB4ICsgeSkpXG5cbi8vIENyZWF0aW5nIG5ldyB0cmF2ZXJzYWxzXG5cbmV4cG9ydCBmdW5jdGlvbiBicmFuY2godGVtcGxhdGUpIHtcbiAgY29uc3Qga2V5cyA9IFtdLCB2YWxzID0gW11cbiAgZm9yIChjb25zdCBrIGluIHRlbXBsYXRlKSB7XG4gICAga2V5cy5wdXNoKGspXG4gICAgdmFscy5wdXNoKHRvRnVuY3Rpb24odGVtcGxhdGVba10pKVxuICB9XG4gIHJldHVybiBicmFuY2hPbihrZXlzLCB2YWxzKVxufVxuXG4vLyBUcmF2ZXJzYWxzIGFuZCBjb21iaW5hdG9yc1xuXG5leHBvcnQgZnVuY3Rpb24gc2VxdWVuY2UoQSwgeGkyeUEsIHhzLCBfKSB7XG4gIGlmIChpc0FycmF5KHhzKSkge1xuICAgIHJldHVybiBBID09PSBJZGVudFxuICAgICAgPyBtYXBQYXJ0aWFsSW5kZXhVKHhpMnlBLCB4cylcbiAgICAgIDogdHJhdmVyc2VQYXJ0aWFsSW5kZXgoQSwgeGkyeUEsIHhzKVxuICB9IGVsc2UgaWYgKGlzT2JqZWN0KHhzKSkge1xuICAgIHJldHVybiBicmFuY2hPbihrZXlzKHhzKSkoQSwgeGkyeUEsIHhzKVxuICB9IGVsc2Uge1xuICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpXG4gICAgICByZXFBcHBsaWNhdGl2ZShBKVxuICAgIHJldHVybiAoMCxBLm9mKSh4cylcbiAgfVxufVxuXG4vLyBPcGVyYXRpb25zIG9uIGxlbnNlc1xuXG5leHBvcnQgY29uc3QgZ2V0ID0gY3VycnkoZ2V0VSlcblxuLy8gQ3JlYXRpbmcgbmV3IGxlbnNlc1xuXG5leHBvcnQgY29uc3QgbGVucyA9IGN1cnJ5KChnZXQsIHNldCkgPT4gKEYsIHhpMnlGLCB4LCBpKSA9PlxuICAoMCxGLm1hcCkoeSA9PiBzZXQoeSwgeCwgaSksIHhpMnlGKGdldCh4LCBpKSwgaSkpKVxuXG4vLyBDb21wdXRpbmcgZGVyaXZlZCBwcm9wc1xuXG5leHBvcnQgY29uc3QgYXVnbWVudCA9IHRlbXBsYXRlID0+IGxlbnMoXG4gIHggPT4ge1xuICAgIGNvbnN0IHogPSBkaXNzb2NQYXJ0aWFsVSgwLCB4KVxuICAgIGlmICh6KVxuICAgICAgZm9yIChjb25zdCBrIGluIHRlbXBsYXRlKVxuICAgICAgICB6W2tdID0gdGVtcGxhdGVba10oeilcbiAgICByZXR1cm4gelxuICB9LFxuICAoeSwgeCkgPT4ge1xuICAgIGlmIChpc09iamVjdCh5KSkge1xuICAgICAgaWYgKCFpc09iamVjdCh4KSlcbiAgICAgICAgeCA9IHZvaWQgMFxuICAgICAgbGV0IHpcbiAgICAgIGNvbnN0IHNldCA9IChrLCB2KSA9PiB7XG4gICAgICAgIGlmICgheilcbiAgICAgICAgICB6ID0ge31cbiAgICAgICAgeltrXSA9IHZcbiAgICAgIH1cbiAgICAgIGZvciAoY29uc3QgayBpbiB5KSB7XG4gICAgICAgIGlmICghKGsgaW4gdGVtcGxhdGUpKVxuICAgICAgICAgIHNldChrLCB5W2tdKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgaWYgKHggJiYgayBpbiB4KVxuICAgICAgICAgICAgc2V0KGssIHhba10pXG4gICAgICB9XG4gICAgICByZXR1cm4gelxuICAgIH1cbiAgfSlcblxuLy8gRW5mb3JjaW5nIGludmFyaWFudHNcblxuZXhwb3J0IGNvbnN0IGRlZmF1bHRzID0gb3V0ID0+IHtcbiAgY29uc3QgbzJ1ID0geCA9PiByZXBsYWNlZChvdXQsIHZvaWQgMCwgeClcbiAgcmV0dXJuIChGLCB4aTJ5RiwgeCwgaSkgPT4gKDAsRi5tYXApKG8ydSwgeGkyeUYoaXNEZWZpbmVkKHgpID8geCA6IG91dCwgaSkpXG59XG5cbmV4cG9ydCBjb25zdCByZXF1aXJlZCA9IGlubiA9PiByZXBsYWNlKGlubiwgdm9pZCAwKVxuXG5leHBvcnQgY29uc3QgZGVmaW5lID0gdiA9PiBub3JtYWxpemVyKHVudG8odikpXG5cbmV4cG9ydCBjb25zdCBub3JtYWxpemUgPSB4aTJ4ID0+XG4gIG5vcm1hbGl6ZXIoKHgsIGkpID0+IGlzRGVmaW5lZCh4KSA/IHhpMngoeCwgaSkgOiB2b2lkIDApXG5cbmV4cG9ydCBjb25zdCByZXdyaXRlID0geWkyeSA9PiAoRiwgeGkyeUYsIHgsIGkpID0+XG4gICgwLEYubWFwKSh5ID0+IGlzRGVmaW5lZCh5KSA/IHlpMnkoeSwgaSkgOiB2b2lkIDAsIHhpMnlGKHgsIGkpKVxuXG4vLyBMZW5zaW5nIGFycmF5c1xuXG5leHBvcnQgY29uc3QgYXBwZW5kID0gKEYsIHhpMnlGLCB4cywgaSkgPT5cbiAgKDAsRi5tYXApKHggPT4gYXJyYXkwVG9VbmRlZmluZWQoKGlzQXJyYXkoeHMpID8geHMgOiBhcnJheTApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5jb25jYXQoaXNEZWZpbmVkKHgpID8gW3hdIDogYXJyYXkwKSksXG4gICAgICAgICAgICB4aTJ5Rih2b2lkIDAsIGkpKVxuXG5leHBvcnQgY29uc3QgZmlsdGVyID0geGkyYiA9PiAoRiwgeGkyeUYsIHhzLCBpKSA9PiB7XG4gIGxldCB0cywgZnMgPSBhcnJheTBcbiAgaWYgKGlzQXJyYXkoeHMpKVxuICAgIHBhcnRpdGlvbkludG9JbmRleCh4aTJiLCB4cywgdHMgPSBbXSwgZnMgPSBbXSlcbiAgcmV0dXJuICgwLEYubWFwKSh0cyA9PiBhcnJheTBUb1VuZGVmaW5lZChpc0FycmF5KHRzKT90cy5jb25jYXQoZnMpOmZzKSxcbiAgICAgICAgICAgICAgICAgICB4aTJ5Rih0cywgaSkpXG59XG5cbmV4cG9ydCBjb25zdCBmaW5kID0geGkyYiA9PiBjaG9vc2UoeHMgPT4ge1xuICBpZiAoIWlzQXJyYXkoeHMpKVxuICAgIHJldHVybiAwXG4gIGNvbnN0IGkgPSBmaW5kSW5kZXgoeGkyYiwgeHMpXG4gIHJldHVybiBpIDwgMCA/IGFwcGVuZCA6IGlcbn0pXG5cbmV4cG9ydCBmdW5jdGlvbiBmaW5kV2l0aCguLi5scykge1xuICBjb25zdCBsbHMgPSBjb21wb3NlKC4uLmxzKVxuICByZXR1cm4gW2ZpbmQoeCA9PiBpc0RlZmluZWQoZ2V0VShsbHMsIHgpKSksIGxsc11cbn1cblxuZXhwb3J0IGNvbnN0IGluZGV4ID0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09IFwicHJvZHVjdGlvblwiID8gaWQgOiB4ID0+IHtcbiAgaWYgKCFOdW1iZXIuaXNJbnRlZ2VyKHgpIHx8IHggPCAwKVxuICAgIHRocm93IG5ldyBFcnJvcihcImBpbmRleGAgZXhwZWN0cyBhIG5vbi1uZWdhdGl2ZSBpbnRlZ2VyLlwiKVxuICByZXR1cm4geFxufVxuXG4vLyBMZW5zaW5nIG9iamVjdHNcblxuZXhwb3J0IGNvbnN0IHByb3AgPSBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gXCJwcm9kdWN0aW9uXCIgPyBpZCA6IHggPT4ge1xuICBpZiAodHlwZW9mIHggIT09IFwic3RyaW5nXCIpXG4gICAgdGhyb3cgbmV3IEVycm9yKFwiYHByb3BgIGV4cGVjdHMgYSBzdHJpbmcuXCIpXG4gIHJldHVybiB4XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwcm9wcygpIHtcbiAgY29uc3QgbiA9IGFyZ3VtZW50cy5sZW5ndGgsIHRlbXBsYXRlID0ge31cbiAgZm9yIChsZXQgaT0wLCBrOyBpPG47ICsraSlcbiAgICB0ZW1wbGF0ZVtrID0gYXJndW1lbnRzW2ldXSA9IGtcbiAgcmV0dXJuIHBpY2sodGVtcGxhdGUpXG59XG5cbi8vIFByb3ZpZGluZyBkZWZhdWx0c1xuXG5leHBvcnQgY29uc3QgdmFsdWVPciA9IHYgPT4gKF9GLCB4aTJ5RiwgeCwgaSkgPT5cbiAgeGkyeUYoaXNEZWZpbmVkKHgpICYmIHggIT09IG51bGwgPyB4IDogdiwgaSlcblxuLy8gQWRhcHRpbmcgdG8gZGF0YVxuXG5leHBvcnQgY29uc3Qgb3JFbHNlID1cbiAgY3VycnkoKGQsIGwpID0+IGNob29zZSh4ID0+IGlzRGVmaW5lZChnZXRVKGwsIHgpKSA/IGwgOiBkKSlcblxuLy8gUmVhZC1vbmx5IG1hcHBpbmdcblxuZXhwb3J0IGNvbnN0IHRvID0gd2kyeCA9PiAoRiwgeGkyeUYsIHcsIGkpID0+XG4gICgwLEYubWFwKShhbHdheXModyksIHhpMnlGKHdpMngodywgaSksIGkpKVxuXG5leHBvcnQgY29uc3QganVzdCA9IHggPT4gdG8oYWx3YXlzKHgpKVxuXG4vLyBUcmFuc2Zvcm1pbmcgZGF0YVxuXG5leHBvcnQgY29uc3QgcGljayA9IHRlbXBsYXRlID0+IChGLCB4aTJ5RiwgeCwgaSkgPT5cbiAgKDAsRi5tYXApKHNldFBpY2sodGVtcGxhdGUsIHgpLCB4aTJ5RihnZXRQaWNrKHRlbXBsYXRlLCB4KSwgaSkpXG5cbmV4cG9ydCBjb25zdCByZXBsYWNlID0gY3VycnkoKGlubiwgb3V0KSA9PiB7XG4gIGNvbnN0IG8yaSA9IHggPT4gcmVwbGFjZWQob3V0LCBpbm4sIHgpXG4gIHJldHVybiAoRiwgeGkyeUYsIHgsIGkpID0+ICgwLEYubWFwKShvMmksIHhpMnlGKHJlcGxhY2VkKGlubiwgb3V0LCB4KSwgaSkpXG59KVxuXG4vLyBPcGVyYXRpb25zIG9uIGlzb21vcnBoaXNtc1xuXG5leHBvcnQgY29uc3QgZ2V0SW52ZXJzZSA9IGFyaXR5TigyLCBzZXRVKVxuXG4vLyBDcmVhdGluZyBuZXcgaXNvbW9ycGhpc21zXG5cbmV4cG9ydCBjb25zdCBpc28gPVxuICBjdXJyeSgoYndkLCBmd2QpID0+IChGLCB4aTJ5RiwgeCwgaSkgPT4gKDAsRi5tYXApKGZ3ZCwgeGkyeUYoYndkKHgpLCBpKSkpXG5cbi8vIElzb21vcnBoaXNtcyBhbmQgY29tYmluYXRvcnNcblxuZXhwb3J0IGNvbnN0IGlkZW50aXR5ID0gKF9GLCB4aTJ5RiwgeCwgaSkgPT4geGkyeUYoeCwgaSlcblxuZXhwb3J0IGNvbnN0IGludmVyc2UgPSBpc28gPT4gKEYsIHhpMnlGLCB4LCBpKSA9PlxuICAoMCxGLm1hcCkoeCA9PiBnZXRVKGlzbywgeCksIHhpMnlGKHNldFUoaXNvLCB4KSwgaSkpXG4iXX0=
