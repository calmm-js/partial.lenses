(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.L = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.inverse = exports.identity = exports.iso = exports.getInverse = exports.replace = exports.pick = exports.just = exports.to = exports.orElse = exports.valueOr = exports.find = exports.filter = exports.append = exports.rewrite = exports.normalize = exports.define = exports.required = exports.defaults = exports.augment = exports.lens = exports.get = exports.sum = exports.product = exports.minimum = exports.maximum = exports.merge = exports.mergeAs = exports.foldr = exports.foldl = exports.foldMapOf = exports.concat = exports.concatAs = exports.collectMap = exports.collect = exports.collectAs = exports.log = exports.optional = exports.when = exports.choose = exports.choice = exports.chain = exports.set = exports.remove = exports.modify = undefined;
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

var collectAs = exports.collectAs = (0, _infestines.curry)(function (xi2y, t, s) {
  return toArray(run(t, Collect, xi2y, s)) || [];
});

var collect = exports.collect = collectAs(_infestines.id);

var collectMap = exports.collectMap = (0, _infestines.curry)(function (t, xi2y, s) {
  return collectAs(xi2y, t, s);
}); // deprecated

var concatAs = exports.concatAs = constAs(function (m) {
  return TacnocOf((0, m.empty)(), flip(m.concat));
});

var concat = exports.concat = concatAs(_infestines.id);

var foldMapOf = exports.foldMapOf = (0, _infestines.curry)(function (m, t, xMi2y, s) {
  return concatAs(xMi2y, m, t, s);
}); // deprecated

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

var mergeAs = exports.mergeAs = constAs(function (m) {
  return TacnocOf((0, m.empty)(), m.concat);
});

var merge = exports.merge = mergeAs(_infestines.id);

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvcGFydGlhbC5sZW5zZXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7UUNrVmdCLFUsR0FBQSxVO1FBMEJBLE8sR0FBQSxPO1FBK0JBLEksR0FBQSxJO1FBT0EsSSxHQUFBLEk7UUFtREEsTSxHQUFBLE07UUFXQSxRLEdBQUEsUTtRQTBGQSxRLEdBQUEsUTtRQUtBLEssR0FBQSxLO1FBUUEsSSxHQUFBLEk7UUFNQSxLLEdBQUEsSzs7QUE3akJoQjs7QUFrQkE7O0FBRUEsU0FBUyxJQUFULENBQWMsRUFBZCxFQUFrQixFQUFsQixFQUFzQjtBQUFDLFNBQU8sQ0FBQyxFQUFELEVBQUssRUFBTCxDQUFQO0FBQWdCOztBQUV2QyxJQUFNLE9BQU8sU0FBUCxJQUFPO0FBQUEsU0FBTyxVQUFDLENBQUQsRUFBSSxDQUFKO0FBQUEsV0FBVSxJQUFJLENBQUosRUFBTyxDQUFQLENBQVY7QUFBQSxHQUFQO0FBQUEsQ0FBYjs7QUFFQSxJQUFNLE9BQU8sU0FBUCxJQUFPO0FBQUEsU0FBSztBQUFBLFdBQUssMkJBQVUsQ0FBVixJQUFlLENBQWYsR0FBbUIsQ0FBeEI7QUFBQSxHQUFMO0FBQUEsQ0FBYjs7QUFFQTs7QUFFQSxTQUFTLGdCQUFULENBQTBCLElBQTFCLEVBQWdDLEVBQWhDLEVBQW9DO0FBQ2xDLE1BQU0sS0FBSyxFQUFYO0FBQUEsTUFBZSxJQUFFLEdBQUcsTUFBcEI7QUFDQSxPQUFLLElBQUksSUFBRSxDQUFOLEVBQVMsQ0FBZCxFQUFpQixJQUFFLENBQW5CLEVBQXNCLEVBQUUsQ0FBeEI7QUFDRSxRQUFJLDJCQUFVLElBQUksS0FBSyxHQUFHLENBQUgsQ0FBTCxFQUFZLENBQVosQ0FBZCxDQUFKLEVBQ0UsR0FBRyxJQUFILENBQVEsQ0FBUjtBQUZKLEdBR0EsT0FBTyxHQUFHLE1BQUgsR0FBWSxFQUFaLEdBQWlCLEtBQUssQ0FBN0I7QUFDRDs7QUFFRDs7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LEdBQUwsRUFBVSxDQUFWLENBQU4sRUFBb0IsQ0FBcEIsQ0FBN0IsQ0FENEI7QUFBQSxHQUFQO0FBQUEsQ0FBaEIiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IHtcbiAgYWN5Y2xpY0VxdWFsc1UsXG4gIGFsd2F5cyxcbiAgYXBwbHlVLFxuICBhcml0eU4sXG4gIGFycmF5MCxcbiAgYXNzb2NQYXJ0aWFsVSxcbiAgY3VycnksXG4gIGN1cnJ5TixcbiAgZGlzc29jUGFydGlhbFUsXG4gIGlkLFxuICBpc0FycmF5LFxuICBpc0RlZmluZWQsXG4gIGlzT2JqZWN0LFxuICBrZXlzLFxuICBzbmRVXG59IGZyb20gXCJpbmZlc3RpbmVzXCJcblxuLy9cblxuZnVuY3Rpb24gcGFpcih4MCwgeDEpIHtyZXR1cm4gW3gwLCB4MV19XG5cbmNvbnN0IGZsaXAgPSBib3AgPT4gKHgsIHkpID0+IGJvcCh5LCB4KVxuXG5jb25zdCB1bnRvID0gYyA9PiB4ID0+IGlzRGVmaW5lZCh4KSA/IHggOiBjXG5cbi8vXG5cbmZ1bmN0aW9uIG1hcFBhcnRpYWxJbmRleFUoeGkyeSwgeHMpIHtcbiAgY29uc3QgeXMgPSBbXSwgbj14cy5sZW5ndGhcbiAgZm9yIChsZXQgaT0wLCB5OyBpPG47ICsraSlcbiAgICBpZiAoaXNEZWZpbmVkKHkgPSB4aTJ5KHhzW2ldLCBpKSkpXG4gICAgICB5cy5wdXNoKHkpXG4gIHJldHVybiB5cy5sZW5ndGggPyB5cyA6IHZvaWQgMFxufVxuXG4vL1xuXG5jb25zdCBBcHBsaWNhdGl2ZSA9IChtYXAsIG9mLCBhcCkgPT4gKHttYXAsIG9mLCBhcH0pXG5cbmNvbnN0IElkZW50ID0gQXBwbGljYXRpdmUoYXBwbHlVLCBpZCwgYXBwbHlVKVxuXG5jb25zdCBDb25zdCA9IHttYXA6IHNuZFV9XG5cbmNvbnN0IFRhY25vY09mID0gKGVtcHR5LCB0YWNub2MpID0+IEFwcGxpY2F0aXZlKHNuZFUsIGFsd2F5cyhlbXB0eSksIHRhY25vYylcblxuY29uc3QgTW9ub2lkID0gKGVtcHR5LCBjb25jYXQpID0+ICh7ZW1wdHk6ICgpID0+IGVtcHR5LCBjb25jYXR9KVxuXG5jb25zdCBNdW0gPSBvcmQgPT5cbiAgTW9ub2lkKHZvaWQgMCwgKHksIHgpID0+IGlzRGVmaW5lZCh4KSAmJiAoIWlzRGVmaW5lZCh5KSB8fCBvcmQoeCwgeSkpID8geCA6IHkpXG5cbi8vXG5cbmNvbnN0IHJ1biA9IChvLCBDLCB4aTJ5QywgcywgaSkgPT4gdG9GdW5jdGlvbihvKShDLCB4aTJ5QywgcywgaSlcblxuY29uc3QgY29uc3RBcyA9IHRvQ29uc3QgPT4gY3VycnlOKDQsICh4TWkyeSwgbSkgPT4ge1xuICBjb25zdCBDID0gdG9Db25zdChtKVxuICByZXR1cm4gKHQsIHMpID0+IHJ1bih0LCBDLCB4TWkyeSwgcylcbn0pXG5cbi8vXG5cbmZ1bmN0aW9uIHJlcUFwcGxpY2F0aXZlKGYpIHtcbiAgaWYgKFwiZGV2XCIgIT09IFwicHJvZHVjdGlvblwiICYmICFmKVxuICAgIHRocm93IG5ldyBFcnJvcihcIlRyYXZlcnNhbHMgcmVxdWlyZSBhbiBhcHBsaWNhdGl2ZS5cIilcbiAgcmV0dXJuIGZcbn1cblxuLy9cblxuZnVuY3Rpb24gQ29uY2F0KGwsIHIpIHt0aGlzLmwgPSBsOyB0aGlzLnIgPSByfVxuXG5jb25zdCBpc0NvbmNhdCA9IG4gPT4gbi5jb25zdHJ1Y3RvciA9PT0gQ29uY2F0XG5cbmNvbnN0IGFwID0gKHIsIGwpID0+IGlzRGVmaW5lZChsKSA/IGlzRGVmaW5lZChyKSA/IG5ldyBDb25jYXQobCwgcikgOiBsIDogclxuXG5jb25zdCByY29uY2F0ID0gdCA9PiBoID0+IGFwKHQsIGgpXG5cbmZ1bmN0aW9uIHB1c2hUbyhuLCB5cykge1xuICB3aGlsZSAobiAmJiBpc0NvbmNhdChuKSkge1xuICAgIGNvbnN0IGwgPSBuLmxcbiAgICBuID0gbi5yXG4gICAgaWYgKGwgJiYgaXNDb25jYXQobCkpIHtcbiAgICAgIHB1c2hUbyhsLmwsIHlzKVxuICAgICAgcHVzaFRvKGwuciwgeXMpXG4gICAgfSBlbHNlXG4gICAgICB5cy5wdXNoKGwpXG4gIH1cbiAgeXMucHVzaChuKVxufVxuXG5mdW5jdGlvbiB0b0FycmF5KG4pIHtcbiAgaWYgKGlzRGVmaW5lZChuKSkge1xuICAgIGNvbnN0IHlzID0gW11cbiAgICBwdXNoVG8obiwgeXMpXG4gICAgcmV0dXJuIHlzXG4gIH1cbn1cblxuZnVuY3Rpb24gZm9sZFJlYyhmLCByLCBuKSB7XG4gIHdoaWxlIChpc0NvbmNhdChuKSkge1xuICAgIGNvbnN0IGwgPSBuLmxcbiAgICBuID0gbi5yXG4gICAgciA9IGlzQ29uY2F0KGwpXG4gICAgICA/IGZvbGRSZWMoZiwgZm9sZFJlYyhmLCByLCBsLmwpLCBsLnIpXG4gICAgICA6IGYociwgbFswXSwgbFsxXSlcbiAgfVxuICByZXR1cm4gZihyLCBuWzBdLCBuWzFdKVxufVxuXG5jb25zdCBmb2xkID0gKGYsIHIsIG4pID0+IGlzRGVmaW5lZChuKSA/IGZvbGRSZWMoZiwgciwgbikgOiByXG5cbmNvbnN0IENvbGxlY3QgPSBUYWNub2NPZih2b2lkIDAsIGFwKVxuXG4vL1xuXG5mdW5jdGlvbiB0cmF2ZXJzZVBhcnRpYWxJbmRleChBLCB4aTJ5QSwgeHMpIHtcbiAgY29uc3QgYXAgPSBBLmFwLCBtYXAgPSBBLm1hcFxuICBsZXQgcyA9IHJlcUFwcGxpY2F0aXZlKEEub2YpKHZvaWQgMCksIGkgPSB4cy5sZW5ndGhcbiAgd2hpbGUgKGktLSlcbiAgICBzID0gYXAobWFwKHJjb25jYXQsIHMpLCB4aTJ5QSh4c1tpXSwgaSkpXG4gIHJldHVybiBtYXAodG9BcnJheSwgcylcbn1cblxuLy9cblxuY29uc3QgYXJyYXkwVG9VbmRlZmluZWQgPSB4cyA9PiB4cy5sZW5ndGggPyB4cyA6IHZvaWQgMFxuXG5jb25zdCBvYmplY3QwVG9VbmRlZmluZWQgPSBvID0+IHtcbiAgaWYgKCFpc09iamVjdChvKSlcbiAgICByZXR1cm4gb1xuICBmb3IgKGNvbnN0IGsgaW4gbylcbiAgICByZXR1cm4gb1xufVxuXG4vL1xuXG5jb25zdCBpc1Byb3AgPSB4ID0+IHR5cGVvZiB4ID09PSBcInN0cmluZ1wiXG5cbmNvbnN0IGdldFByb3AgPSAoaywgbykgPT4gaXNPYmplY3QobykgPyBvW2tdIDogdm9pZCAwXG5cbmNvbnN0IHNldFByb3AgPSAoaywgdiwgbykgPT5cbiAgaXNEZWZpbmVkKHYpID8gYXNzb2NQYXJ0aWFsVShrLCB2LCBvKSA6IGRpc3NvY1BhcnRpYWxVKGssIG8pXG5cbmNvbnN0IGZ1blByb3AgPSBrID0+IChGLCB4aTJ5RiwgeCwgXykgPT5cbiAgKDAsRi5tYXApKHYgPT4gc2V0UHJvcChrLCB2LCB4KSwgeGkyeUYoZ2V0UHJvcChrLCB4KSwgaykpXG5cbi8vXG5cbmNvbnN0IGlzSW5kZXggPSB4ID0+IE51bWJlci5pc0ludGVnZXIoeCkgJiYgMCA8PSB4XG5cbmNvbnN0IG51bGxzID0gbiA9PiBBcnJheShuKS5maWxsKG51bGwpXG5cbmNvbnN0IGdldEluZGV4ID0gKGksIHhzKSA9PiBpc0FycmF5KHhzKSA/IHhzW2ldIDogdm9pZCAwXG5cbmZ1bmN0aW9uIHNldEluZGV4KGksIHgsIHhzKSB7XG4gIGlmIChpc0RlZmluZWQoeCkpIHtcbiAgICBpZiAoIWlzQXJyYXkoeHMpKVxuICAgICAgcmV0dXJuIGkgPCAwID8gdm9pZCAwIDogbnVsbHMoaSkuY29uY2F0KFt4XSlcbiAgICBjb25zdCBuID0geHMubGVuZ3RoXG4gICAgaWYgKG4gPD0gaSlcbiAgICAgIHJldHVybiB4cy5jb25jYXQobnVsbHMoaSAtIG4pLCBbeF0pXG4gICAgaWYgKGkgPCAwKVxuICAgICAgcmV0dXJuICFuID8gdm9pZCAwIDogeHNcbiAgICBjb25zdCB5cyA9IEFycmF5KG4pXG4gICAgZm9yIChsZXQgaj0wOyBqPG47ICsrailcbiAgICAgIHlzW2pdID0geHNbal1cbiAgICB5c1tpXSA9IHhcbiAgICByZXR1cm4geXNcbiAgfSBlbHNlIHtcbiAgICBpZiAoaXNBcnJheSh4cykpIHtcbiAgICAgIGNvbnN0IG4gPSB4cy5sZW5ndGhcbiAgICAgIGlmICghbilcbiAgICAgICAgcmV0dXJuIHZvaWQgMFxuICAgICAgaWYgKGkgPCAwIHx8IG4gPD0gaSlcbiAgICAgICAgcmV0dXJuIHhzXG4gICAgICBpZiAobiA9PT0gMSlcbiAgICAgICAgcmV0dXJuIHZvaWQgMFxuICAgICAgY29uc3QgeXMgPSBBcnJheShuLTEpXG4gICAgICBmb3IgKGxldCBqPTA7IGo8aTsgKytqKVxuICAgICAgICB5c1tqXSA9IHhzW2pdXG4gICAgICBmb3IgKGxldCBqPWkrMTsgajxuOyArK2opXG4gICAgICAgIHlzW2otMV0gPSB4c1tqXVxuICAgICAgcmV0dXJuIHlzXG4gICAgfVxuICB9XG59XG5cbmNvbnN0IGZ1bkluZGV4ID0gaSA9PiAoRiwgeGkyeUYsIHhzLCBfKSA9PlxuICAoMCxGLm1hcCkoeSA9PiBzZXRJbmRleChpLCB5LCB4cyksIHhpMnlGKGdldEluZGV4KGksIHhzKSwgaSkpXG5cbi8vXG5cbmNvbnN0IHNlZW1zT3B0aWMgPSB4ID0+IHR5cGVvZiB4ID09PSBcImZ1bmN0aW9uXCIgJiYgeC5sZW5ndGggPT09IDRcblxuZnVuY3Rpb24gb3B0aWMobykge1xuICBpZiAoXCJkZXZcIiAhPT0gXCJwcm9kdWN0aW9uXCIgJiYgIXNlZW1zT3B0aWMobykpXG4gICAgdGhyb3cgbmV3IEVycm9yKFwiRXhwZWN0aW5nIGFuIG9wdGljLlwiKVxuICByZXR1cm4gb1xufVxuXG5jb25zdCBjbG9zZSA9IChvLCBGLCB4aTJ5RikgPT4gKHgsIGkpID0+IG8oRiwgeGkyeUYsIHgsIGkpXG5cbmZ1bmN0aW9uIGNvbXBvc2VkKG9pMCwgb3MpIHtcbiAgc3dpdGNoIChvcy5sZW5ndGggLSBvaTApIHtcbiAgICBjYXNlIDA6ICByZXR1cm4gaWRlbnRpdHlcbiAgICBjYXNlIDE6ICByZXR1cm4gdG9GdW5jdGlvbihvc1tvaTBdKVxuICAgIGRlZmF1bHQ6IHJldHVybiAoRiwgeGkyeUYsIHgsIGkpID0+IHtcbiAgICAgIGxldCBuID0gb3MubGVuZ3RoXG4gICAgICB4aTJ5RiA9IGNsb3NlKHRvRnVuY3Rpb24ob3NbLS1uXSksIEYsIHhpMnlGKVxuICAgICAgd2hpbGUgKG9pMCA8IC0tbilcbiAgICAgICAgeGkyeUYgPSBjbG9zZSh0b0Z1bmN0aW9uKG9zW25dKSwgRiwgeGkyeUYpXG4gICAgICByZXR1cm4gcnVuKG9zW29pMF0sIEYsIHhpMnlGLCB4LCBpKVxuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBzZXRVKG8sIHgsIHMpIHtcbiAgc3dpdGNoICh0eXBlb2Ygbykge1xuICAgIGNhc2UgXCJzdHJpbmdcIjogICByZXR1cm4gc2V0UHJvcChvLCB4LCBzKVxuICAgIGNhc2UgXCJudW1iZXJcIjogICByZXR1cm4gc2V0SW5kZXgobywgeCwgcylcbiAgICBjYXNlIFwiZnVuY3Rpb25cIjogcmV0dXJuIG9wdGljKG8pKElkZW50LCBhbHdheXMoeCksIHMsIHZvaWQgMClcbiAgICBkZWZhdWx0OiAgICAgICAgIHJldHVybiBtb2RpZnlDb21wb3NlZChvLCBhbHdheXMoeCksIHMpXG4gIH1cbn1cblxuZnVuY3Rpb24gZ2V0Q29tcG9zZWQobHMsIHMpIHtcbiAgZm9yIChsZXQgaT0wLCBuPWxzLmxlbmd0aCwgbDsgaTxuOyArK2kpXG4gICAgc3dpdGNoICh0eXBlb2YgKGwgPSBsc1tpXSkpIHtcbiAgICAgIGNhc2UgXCJzdHJpbmdcIjogcyA9IGdldFByb3AobCwgcyk7IGJyZWFrXG4gICAgICBjYXNlIFwibnVtYmVyXCI6IHMgPSBnZXRJbmRleChsLCBzKTsgYnJlYWtcbiAgICAgIGRlZmF1bHQ6IHJldHVybiBjb21wb3NlZChpLCBscykoQ29uc3QsIGlkLCBzLCBsc1tpLTFdKVxuICAgIH1cbiAgcmV0dXJuIHNcbn1cblxuZnVuY3Rpb24gZ2V0VShsLCBzKSB7XG4gIHN3aXRjaCAodHlwZW9mIGwpIHtcbiAgICBjYXNlIFwic3RyaW5nXCI6ICAgcmV0dXJuIGdldFByb3AobCwgcylcbiAgICBjYXNlIFwibnVtYmVyXCI6ICAgcmV0dXJuIGdldEluZGV4KGwsIHMpXG4gICAgY2FzZSBcImZ1bmN0aW9uXCI6IHJldHVybiBvcHRpYyhsKShDb25zdCwgaWQsIHMsIHZvaWQgMClcbiAgICBkZWZhdWx0OiAgICAgICAgIHJldHVybiBnZXRDb21wb3NlZChsLCBzKVxuICB9XG59XG5cbmZ1bmN0aW9uIG1vZGlmeUNvbXBvc2VkKG9zLCB4aTJ4LCB4KSB7XG4gIGxldCBuID0gb3MubGVuZ3RoXG4gIGNvbnN0IHhzID0gW11cbiAgZm9yIChsZXQgaT0wLCBvOyBpPG47ICsraSkge1xuICAgIHhzLnB1c2goeClcbiAgICBzd2l0Y2ggKHR5cGVvZiAobyA9IG9zW2ldKSkge1xuICAgICAgY2FzZSBcInN0cmluZ1wiOlxuICAgICAgICB4ID0gZ2V0UHJvcChvLCB4KVxuICAgICAgICBicmVha1xuICAgICAgY2FzZSBcIm51bWJlclwiOlxuICAgICAgICB4ID0gZ2V0SW5kZXgobywgeClcbiAgICAgICAgYnJlYWtcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHggPSBjb21wb3NlZChpLCBvcykoSWRlbnQsIHhpMngsIHgsIG9zW2ktMV0pXG4gICAgICAgIG4gPSBpXG4gICAgICAgIGJyZWFrXG4gICAgfVxuICB9XG4gIGlmIChuID09PSBvcy5sZW5ndGgpXG4gICAgeCA9IHhpMngoeCwgb3Nbbi0xXSlcbiAgd2hpbGUgKDAgPD0gLS1uKSB7XG4gICAgY29uc3QgbyA9IG9zW25dXG4gICAgc3dpdGNoICh0eXBlb2Ygbykge1xuICAgICAgY2FzZSBcInN0cmluZ1wiOiB4ID0gc2V0UHJvcChvLCB4LCB4c1tuXSk7IGJyZWFrXG4gICAgICBjYXNlIFwibnVtYmVyXCI6IHggPSBzZXRJbmRleChvLCB4LCB4c1tuXSk7IGJyZWFrXG4gICAgfVxuICB9XG4gIHJldHVybiB4XG59XG5cbi8vXG5cbmZ1bmN0aW9uIGdldFBpY2sodGVtcGxhdGUsIHgpIHtcbiAgbGV0IHJcbiAgZm9yIChjb25zdCBrIGluIHRlbXBsYXRlKSB7XG4gICAgY29uc3QgdiA9IGdldFUodGVtcGxhdGVba10sIHgpXG4gICAgaWYgKGlzRGVmaW5lZCh2KSkge1xuICAgICAgaWYgKCFyKVxuICAgICAgICByID0ge31cbiAgICAgIHJba10gPSB2XG4gICAgfVxuICB9XG4gIHJldHVybiByXG59XG5cbmNvbnN0IHNldFBpY2sgPSAodGVtcGxhdGUsIHgpID0+IHZhbHVlID0+IHtcbiAgaWYgKCFpc09iamVjdCh2YWx1ZSkpXG4gICAgdmFsdWUgPSB2b2lkIDBcbiAgZm9yIChjb25zdCBrIGluIHRlbXBsYXRlKVxuICAgIHggPSBzZXRVKHRlbXBsYXRlW2tdLCB2YWx1ZSAmJiB2YWx1ZVtrXSwgeClcbiAgcmV0dXJuIHhcbn1cblxuLy9cblxuY29uc3Qgc2hvdyA9IChsYWJlbHMsIGRpcikgPT4geCA9PlxuICBjb25zb2xlLmxvZy5hcHBseShjb25zb2xlLCBsYWJlbHMuY29uY2F0KFtkaXIsIHhdKSkgfHwgeFxuXG5mdW5jdGlvbiBicmFuY2hPbihrZXlzLCB2YWxzKSB7XG4gIGNvbnN0IG4gPSBrZXlzLmxlbmd0aFxuICByZXR1cm4gKEEsIHhpMnlBLCB4LCBfKSA9PiB7XG4gICAgY29uc3QgYXAgPSBBLmFwLFxuICAgICAgICAgIHdhaXQgPSAoeCwgaSkgPT4gMCA8PSBpID8geSA9PiB3YWl0KHNldFByb3Aoa2V5c1tpXSwgeSwgeCksIGktMSkgOiB4XG4gICAgbGV0IHIgPSByZXFBcHBsaWNhdGl2ZShBLm9mKSh3YWl0KHgsIG4tMSkpXG4gICAgaWYgKCFpc09iamVjdCh4KSlcbiAgICAgIHggPSB2b2lkIDBcbiAgICBmb3IgKGxldCBpPW4tMTsgMDw9aTsgLS1pKSB7XG4gICAgICBjb25zdCBrID0ga2V5c1tpXSwgdiA9IHggJiYgeFtrXVxuICAgICAgciA9IGFwKHIsICh2YWxzID8gdmFsc1tpXShBLCB4aTJ5QSwgdiwgaykgOiB4aTJ5QSh2LCBrKSkpXG4gICAgfVxuICAgIHJldHVybiAoMCxBLm1hcCkob2JqZWN0MFRvVW5kZWZpbmVkLCByKVxuICB9XG59XG5cbmNvbnN0IG5vcm1hbGl6ZXIgPSB4aTJ4ID0+IChGLCB4aTJ5RiwgeCwgaSkgPT5cbiAgKDAsRi5tYXApKHggPT4geGkyeCh4LCBpKSwgeGkyeUYoeGkyeCh4LCBpKSwgaSkpXG5cbmNvbnN0IHJlcGxhY2VkID0gKGlubiwgb3V0LCB4KSA9PiBhY3ljbGljRXF1YWxzVSh4LCBpbm4pID8gb3V0IDogeFxuXG5mdW5jdGlvbiBmaW5kSW5kZXgoeGkyYiwgeHMpIHtcbiAgZm9yIChsZXQgaT0wLCBuPXhzLmxlbmd0aDsgaTxuOyArK2kpXG4gICAgaWYgKHhpMmIoeHNbaV0sIGkpKVxuICAgICAgcmV0dXJuIGlcbiAgcmV0dXJuIC0xXG59XG5cbmZ1bmN0aW9uIHBhcnRpdGlvbkludG9JbmRleCh4aTJiLCB4cywgdHMsIGZzKSB7XG4gIGZvciAobGV0IGk9MCwgbj14cy5sZW5ndGgsIHg7IGk8bjsgKytpKVxuICAgICh4aTJiKHggPSB4c1tpXSwgaSkgPyB0cyA6IGZzKS5wdXNoKHgpXG59XG5cbi8vXG5cbmV4cG9ydCBmdW5jdGlvbiB0b0Z1bmN0aW9uKG8pIHtcbiAgc3dpdGNoICh0eXBlb2Ygbykge1xuICAgIGNhc2UgXCJzdHJpbmdcIjogICByZXR1cm4gZnVuUHJvcChvKVxuICAgIGNhc2UgXCJudW1iZXJcIjogICByZXR1cm4gZnVuSW5kZXgobylcbiAgICBjYXNlIFwiZnVuY3Rpb25cIjogcmV0dXJuIG9wdGljKG8pXG4gICAgZGVmYXVsdDogICAgICAgICByZXR1cm4gY29tcG9zZWQoMCxvKVxuICB9XG59XG5cbi8vIE9wZXJhdGlvbnMgb24gb3B0aWNzXG5cbmV4cG9ydCBjb25zdCBtb2RpZnkgPSBjdXJyeSgobywgeGkyeCwgcykgPT4ge1xuICBzd2l0Y2ggKHR5cGVvZiBvKSB7XG4gICAgY2FzZSBcInN0cmluZ1wiOiAgIHJldHVybiBzZXRQcm9wKG8sIHhpMngoZ2V0UHJvcChvLCBzKSwgbyksIHMpXG4gICAgY2FzZSBcIm51bWJlclwiOiAgIHJldHVybiBzZXRJbmRleChvLCB4aTJ4KGdldEluZGV4KG8sIHMpLCBvKSwgcylcbiAgICBjYXNlIFwiZnVuY3Rpb25cIjogcmV0dXJuIG9wdGljKG8pKElkZW50LCB4aTJ4LCBzLCB2b2lkIDApXG4gICAgZGVmYXVsdDogICAgICAgICByZXR1cm4gbW9kaWZ5Q29tcG9zZWQobywgeGkyeCwgcylcbiAgfVxufSlcblxuZXhwb3J0IGNvbnN0IHJlbW92ZSA9IGN1cnJ5KChvLCBzKSA9PiBzZXRVKG8sIHZvaWQgMCwgcykpXG5cbmV4cG9ydCBjb25zdCBzZXQgPSBjdXJyeShzZXRVKVxuXG4vLyBOZXN0aW5nXG5cbmV4cG9ydCBmdW5jdGlvbiBjb21wb3NlKCkge1xuICBzd2l0Y2ggKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICBjYXNlIDA6IHJldHVybiBpZGVudGl0eVxuICAgIGNhc2UgMTogcmV0dXJuIGFyZ3VtZW50c1swXVxuICAgIGRlZmF1bHQ6IHtcbiAgICAgIGNvbnN0IG4gPSBhcmd1bWVudHMubGVuZ3RoLCBsZW5zZXMgPSBBcnJheShuKVxuICAgICAgZm9yIChsZXQgaT0wOyBpPG47ICsraSlcbiAgICAgICAgbGVuc2VzW2ldID0gYXJndW1lbnRzW2ldXG4gICAgICByZXR1cm4gbGVuc2VzXG4gICAgfVxuICB9XG59XG5cbi8vIFF1ZXJ5aW5nXG5cbmV4cG9ydCBjb25zdCBjaGFpbiA9IGN1cnJ5KCh4aTJ5TywgeE8pID0+XG4gIFt4TywgY2hvb3NlKCh4TSwgaSkgPT4gaXNEZWZpbmVkKHhNKSA/IHhpMnlPKHhNLCBpKSA6IHplcm8pXSlcblxuZXhwb3J0IGNvbnN0IGNob2ljZSA9ICguLi5scykgPT4gY2hvb3NlKHggPT4ge1xuICBjb25zdCBpID0gZmluZEluZGV4KGwgPT4gaXNEZWZpbmVkKGdldFUobCwgeCkpLCBscylcbiAgcmV0dXJuIGkgPCAwID8gemVybyA6IGxzW2ldXG59KVxuXG5leHBvcnQgY29uc3QgY2hvb3NlID0geGlNMm8gPT4gKEMsIHhpMnlDLCB4LCBpKSA9PlxuICBydW4oeGlNMm8oeCwgaSksIEMsIHhpMnlDLCB4LCBpKVxuXG5leHBvcnQgY29uc3Qgd2hlbiA9IHAgPT4gKEMsIHhpMnlDLCB4LCBpKSA9PlxuICBwKHgsIGkpID8geGkyeUMoeCwgaSkgOiB6ZXJvKEMsIHhpMnlDLCB4LCBpKVxuXG5leHBvcnQgY29uc3Qgb3B0aW9uYWwgPSB3aGVuKGlzRGVmaW5lZClcblxuZXhwb3J0IGZ1bmN0aW9uIHplcm8oQywgeGkyeUMsIHgsIGkpIHtcbiAgY29uc3Qgb2YgPSBDLm9mXG4gIHJldHVybiBvZiA/IG9mKHgpIDogKDAsQy5tYXApKGFsd2F5cyh4KSwgeGkyeUModm9pZCAwLCBpKSlcbn1cblxuLy8gUmVjdXJzaW5nXG5cbmV4cG9ydCBmdW5jdGlvbiBsYXp5KG8ybykge1xuICBsZXQgbWVtbyA9IChDLCB4aTJ5QywgeCwgaSkgPT4gKG1lbW8gPSB0b0Z1bmN0aW9uKG8ybyhyZWMpKSkoQywgeGkyeUMsIHgsIGkpXG4gIGZ1bmN0aW9uIHJlYyhDLCB4aTJ5QywgeCwgaSkge3JldHVybiBtZW1vKEMsIHhpMnlDLCB4LCBpKX1cbiAgcmV0dXJuIHJlY1xufVxuXG4vLyBEZWJ1Z2dpbmdcblxuZXhwb3J0IGNvbnN0IGxvZyA9ICguLi5sYWJlbHMpID0+IGlzbyhzaG93KGxhYmVscywgXCJnZXRcIiksIHNob3cobGFiZWxzLCBcInNldFwiKSlcblxuLy8gT3BlcmF0aW9ucyBvbiB0cmF2ZXJzYWxzXG5cbmV4cG9ydCBjb25zdCBjb2xsZWN0QXMgPSBjdXJyeSgoeGkyeSwgdCwgcykgPT5cbiAgdG9BcnJheShydW4odCwgQ29sbGVjdCwgeGkyeSwgcykpIHx8IFtdKVxuXG5leHBvcnQgY29uc3QgY29sbGVjdCA9IGNvbGxlY3RBcyhpZClcblxuZXhwb3J0IGNvbnN0IGNvbGxlY3RNYXAgPSBjdXJyeSgodCwgeGkyeSwgcykgPT4gY29sbGVjdEFzKHhpMnksIHQsIHMpKSAvLyBkZXByZWNhdGVkXG5cbmV4cG9ydCBjb25zdCBjb25jYXRBcyA9IGNvbnN0QXMobSA9PiBUYWNub2NPZigoMCxtLmVtcHR5KSgpLCBmbGlwKG0uY29uY2F0KSkpXG5cbmV4cG9ydCBjb25zdCBjb25jYXQgPSBjb25jYXRBcyhpZClcblxuZXhwb3J0IGNvbnN0IGZvbGRNYXBPZiA9IGN1cnJ5KChtLCB0LCB4TWkyeSwgcykgPT4gY29uY2F0QXMoeE1pMnksIG0sIHQsIHMpKSAvLyBkZXByZWNhdGVkXG5cbmV4cG9ydCBjb25zdCBmb2xkbCA9IGN1cnJ5KChmLCByLCB0LCBzKSA9PlxuICBmb2xkKGYsIHIsIHJ1bih0LCBDb2xsZWN0LCBwYWlyLCBzKSkpXG5cbmV4cG9ydCBjb25zdCBmb2xkciA9IGN1cnJ5KChmLCByLCB0LCBzKSA9PiB7XG4gIGNvbnN0IHhzID0gY29sbGVjdEFzKHBhaXIsIHQsIHMpXG4gIGZvciAobGV0IGk9eHMubGVuZ3RoLTE7IDA8PWk7IC0taSkge1xuICAgIGNvbnN0IHggPSB4c1tpXVxuICAgIHIgPSBmKHIsIHhbMF0sIHhbMV0pXG4gIH1cbiAgcmV0dXJuIHJcbn0pXG5cbmV4cG9ydCBjb25zdCBtZXJnZUFzID0gY29uc3RBcyhtID0+IFRhY25vY09mKCgwLG0uZW1wdHkpKCksIG0uY29uY2F0KSlcblxuZXhwb3J0IGNvbnN0IG1lcmdlID0gbWVyZ2VBcyhpZClcblxuZXhwb3J0IGNvbnN0IG1heGltdW0gPSBtZXJnZShNdW0oKHgsIHkpID0+IHggPiB5KSlcblxuZXhwb3J0IGNvbnN0IG1pbmltdW0gPSBtZXJnZShNdW0oKHgsIHkpID0+IHggPCB5KSlcblxuZXhwb3J0IGNvbnN0IHByb2R1Y3QgPSBtZXJnZUFzKHVudG8oMSksIE1vbm9pZCgxLCAoeSwgeCkgPT4geCAqIHkpKVxuXG5leHBvcnQgY29uc3Qgc3VtID0gbWVyZ2VBcyh1bnRvKDApLCBNb25vaWQoMCwgKHksIHgpID0+IHggKyB5KSlcblxuLy8gQ3JlYXRpbmcgbmV3IHRyYXZlcnNhbHNcblxuZXhwb3J0IGZ1bmN0aW9uIGJyYW5jaCh0ZW1wbGF0ZSkge1xuICBjb25zdCBrZXlzID0gW10sIHZhbHMgPSBbXVxuICBmb3IgKGNvbnN0IGsgaW4gdGVtcGxhdGUpIHtcbiAgICBrZXlzLnB1c2goaylcbiAgICB2YWxzLnB1c2godG9GdW5jdGlvbih0ZW1wbGF0ZVtrXSkpXG4gIH1cbiAgcmV0dXJuIGJyYW5jaE9uKGtleXMsIHZhbHMpXG59XG5cbi8vIFRyYXZlcnNhbHMgYW5kIGNvbWJpbmF0b3JzXG5cbmV4cG9ydCBmdW5jdGlvbiBzZXF1ZW5jZShBLCB4aTJ5QSwgeHMsIF8pIHtcbiAgaWYgKGlzQXJyYXkoeHMpKVxuICAgIHJldHVybiBBID09PSBJZGVudFxuICAgID8gbWFwUGFydGlhbEluZGV4VSh4aTJ5QSwgeHMpXG4gICAgOiB0cmF2ZXJzZVBhcnRpYWxJbmRleChBLCB4aTJ5QSwgeHMpXG4gIGVsc2UgaWYgKGlzT2JqZWN0KHhzKSlcbiAgICByZXR1cm4gYnJhbmNoT24oa2V5cyh4cykpKEEsIHhpMnlBLCB4cylcbiAgZWxzZVxuICAgIHJldHVybiByZXFBcHBsaWNhdGl2ZShBLm9mKSh4cylcbn1cblxuLy8gT3BlcmF0aW9ucyBvbiBsZW5zZXNcblxuZXhwb3J0IGNvbnN0IGdldCA9IGN1cnJ5KGdldFUpXG5cbi8vIENyZWF0aW5nIG5ldyBsZW5zZXNcblxuZXhwb3J0IGNvbnN0IGxlbnMgPSBjdXJyeSgoZ2V0LCBzZXQpID0+IChGLCB4aTJ5RiwgeCwgaSkgPT5cbiAgKDAsRi5tYXApKHkgPT4gc2V0KHksIHgsIGkpLCB4aTJ5RihnZXQoeCwgaSksIGkpKSlcblxuLy8gQ29tcHV0aW5nIGRlcml2ZWQgcHJvcHNcblxuZXhwb3J0IGNvbnN0IGF1Z21lbnQgPSB0ZW1wbGF0ZSA9PiBsZW5zKFxuICB4ID0+IHtcbiAgICBjb25zdCB6ID0gZGlzc29jUGFydGlhbFUoMCwgeClcbiAgICBpZiAoeilcbiAgICAgIGZvciAoY29uc3QgayBpbiB0ZW1wbGF0ZSlcbiAgICAgICAgeltrXSA9IHRlbXBsYXRlW2tdKHopXG4gICAgcmV0dXJuIHpcbiAgfSxcbiAgKHksIHgpID0+IHtcbiAgICBpZiAoaXNPYmplY3QoeSkpIHtcbiAgICAgIGlmICghaXNPYmplY3QoeCkpXG4gICAgICAgIHggPSB2b2lkIDBcbiAgICAgIGxldCB6XG4gICAgICBjb25zdCBzZXQgPSAoaywgdikgPT4ge1xuICAgICAgICBpZiAoIXopXG4gICAgICAgICAgeiA9IHt9XG4gICAgICAgIHpba10gPSB2XG4gICAgICB9XG4gICAgICBmb3IgKGNvbnN0IGsgaW4geSkge1xuICAgICAgICBpZiAoIShrIGluIHRlbXBsYXRlKSlcbiAgICAgICAgICBzZXQoaywgeVtrXSlcbiAgICAgICAgZWxzZVxuICAgICAgICAgIGlmICh4ICYmIGsgaW4geClcbiAgICAgICAgICAgIHNldChrLCB4W2tdKVxuICAgICAgfVxuICAgICAgcmV0dXJuIHpcbiAgICB9XG4gIH0pXG5cbi8vIEVuZm9yY2luZyBpbnZhcmlhbnRzXG5cbmV4cG9ydCBjb25zdCBkZWZhdWx0cyA9IG91dCA9PiB7XG4gIGNvbnN0IG8ydSA9IHggPT4gcmVwbGFjZWQob3V0LCB2b2lkIDAsIHgpXG4gIHJldHVybiAoRiwgeGkyeUYsIHgsIGkpID0+ICgwLEYubWFwKShvMnUsIHhpMnlGKGlzRGVmaW5lZCh4KSA/IHggOiBvdXQsIGkpKVxufVxuXG5leHBvcnQgY29uc3QgcmVxdWlyZWQgPSBpbm4gPT4gcmVwbGFjZShpbm4sIHZvaWQgMClcblxuZXhwb3J0IGNvbnN0IGRlZmluZSA9IHYgPT4gbm9ybWFsaXplcih1bnRvKHYpKVxuXG5leHBvcnQgY29uc3Qgbm9ybWFsaXplID0geGkyeCA9PlxuICBub3JtYWxpemVyKCh4LCBpKSA9PiBpc0RlZmluZWQoeCkgPyB4aTJ4KHgsIGkpIDogdm9pZCAwKVxuXG5leHBvcnQgY29uc3QgcmV3cml0ZSA9IHlpMnkgPT4gKEYsIHhpMnlGLCB4LCBpKSA9PlxuICAoMCxGLm1hcCkoeSA9PiBpc0RlZmluZWQoeSkgPyB5aTJ5KHksIGkpIDogdm9pZCAwLCB4aTJ5Rih4LCBpKSlcblxuLy8gTGVuc2luZyBhcnJheXNcblxuZXhwb3J0IGNvbnN0IGFwcGVuZCA9IChGLCB4aTJ5RiwgeHMsIGkpID0+XG4gICgwLEYubWFwKSh4ID0+IGFycmF5MFRvVW5kZWZpbmVkKChpc0FycmF5KHhzKSA/IHhzIDogYXJyYXkwKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuY29uY2F0KGlzRGVmaW5lZCh4KSA/IFt4XSA6IGFycmF5MCkpLFxuICAgICAgICAgICAgeGkyeUYodm9pZCAwLCBpKSlcblxuZXhwb3J0IGNvbnN0IGZpbHRlciA9IHhpMmIgPT4gKEYsIHhpMnlGLCB4cywgaSkgPT4ge1xuICBsZXQgdHMsIGZzID0gYXJyYXkwXG4gIGlmIChpc0FycmF5KHhzKSlcbiAgICBwYXJ0aXRpb25JbnRvSW5kZXgoeGkyYiwgeHMsIHRzID0gW10sIGZzID0gW10pXG4gIHJldHVybiAoMCxGLm1hcCkodHMgPT4gYXJyYXkwVG9VbmRlZmluZWQoaXNBcnJheSh0cyk/dHMuY29uY2F0KGZzKTpmcyksXG4gICAgICAgICAgICAgICAgICAgeGkyeUYodHMsIGkpKVxufVxuXG5leHBvcnQgY29uc3QgZmluZCA9IHhpMmIgPT4gY2hvb3NlKHhzID0+IHtcbiAgaWYgKCFpc0FycmF5KHhzKSlcbiAgICByZXR1cm4gMFxuICBjb25zdCBpID0gZmluZEluZGV4KHhpMmIsIHhzKVxuICByZXR1cm4gaSA8IDAgPyBhcHBlbmQgOiBpXG59KVxuXG5leHBvcnQgZnVuY3Rpb24gZmluZFdpdGgoLi4ubHMpIHtcbiAgY29uc3QgbGxzID0gY29tcG9zZSguLi5scylcbiAgcmV0dXJuIFtmaW5kKHggPT4gaXNEZWZpbmVkKGdldFUobGxzLCB4KSkpLCBsbHNdXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpbmRleCh4KSB7XG4gIGlmIChcImRldlwiICE9PSBcInByb2R1Y3Rpb25cIiAmJiAhaXNJbmRleCh4KSlcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJgaW5kZXhgIGV4cGVjdHMgYSBub24tbmVnYXRpdmUgaW50ZWdlci5cIilcbiAgcmV0dXJuIHhcbn1cblxuLy8gTGVuc2luZyBvYmplY3RzXG5cbmV4cG9ydCBmdW5jdGlvbiBwcm9wKHgpIHtcbiAgaWYgKFwiZGV2XCIgIT09IFwicHJvZHVjdGlvblwiICYmICFpc1Byb3AoeCkpXG4gICAgdGhyb3cgbmV3IEVycm9yKFwiYHByb3BgIGV4cGVjdHMgYSBzdHJpbmcuXCIpXG4gIHJldHVybiB4XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwcm9wcygpIHtcbiAgY29uc3QgbiA9IGFyZ3VtZW50cy5sZW5ndGgsIHRlbXBsYXRlID0ge31cbiAgZm9yIChsZXQgaT0wLCBrOyBpPG47ICsraSlcbiAgICB0ZW1wbGF0ZVtrID0gYXJndW1lbnRzW2ldXSA9IGtcbiAgcmV0dXJuIHBpY2sodGVtcGxhdGUpXG59XG5cbi8vIFByb3ZpZGluZyBkZWZhdWx0c1xuXG5leHBvcnQgY29uc3QgdmFsdWVPciA9IHYgPT4gKF9GLCB4aTJ5RiwgeCwgaSkgPT5cbiAgeGkyeUYoaXNEZWZpbmVkKHgpICYmIHggIT09IG51bGwgPyB4IDogdiwgaSlcblxuLy8gQWRhcHRpbmcgdG8gZGF0YVxuXG5leHBvcnQgY29uc3Qgb3JFbHNlID1cbiAgY3VycnkoKGQsIGwpID0+IGNob29zZSh4ID0+IGlzRGVmaW5lZChnZXRVKGwsIHgpKSA/IGwgOiBkKSlcblxuLy8gUmVhZC1vbmx5IG1hcHBpbmdcblxuZXhwb3J0IGNvbnN0IHRvID0gd2kyeCA9PiAoRiwgeGkyeUYsIHcsIGkpID0+XG4gICgwLEYubWFwKShhbHdheXModyksIHhpMnlGKHdpMngodywgaSksIGkpKVxuXG5leHBvcnQgY29uc3QganVzdCA9IHggPT4gdG8oYWx3YXlzKHgpKVxuXG4vLyBUcmFuc2Zvcm1pbmcgZGF0YVxuXG5leHBvcnQgY29uc3QgcGljayA9IHRlbXBsYXRlID0+IChGLCB4aTJ5RiwgeCwgaSkgPT5cbiAgKDAsRi5tYXApKHNldFBpY2sodGVtcGxhdGUsIHgpLCB4aTJ5RihnZXRQaWNrKHRlbXBsYXRlLCB4KSwgaSkpXG5cbmV4cG9ydCBjb25zdCByZXBsYWNlID0gY3VycnkoKGlubiwgb3V0KSA9PiB7XG4gIGNvbnN0IG8yaSA9IHggPT4gcmVwbGFjZWQob3V0LCBpbm4sIHgpXG4gIHJldHVybiAoRiwgeGkyeUYsIHgsIGkpID0+ICgwLEYubWFwKShvMmksIHhpMnlGKHJlcGxhY2VkKGlubiwgb3V0LCB4KSwgaSkpXG59KVxuXG4vLyBPcGVyYXRpb25zIG9uIGlzb21vcnBoaXNtc1xuXG5leHBvcnQgY29uc3QgZ2V0SW52ZXJzZSA9IGFyaXR5TigyLCBzZXRVKVxuXG4vLyBDcmVhdGluZyBuZXcgaXNvbW9ycGhpc21zXG5cbmV4cG9ydCBjb25zdCBpc28gPVxuICBjdXJyeSgoYndkLCBmd2QpID0+IChGLCB4aTJ5RiwgeCwgaSkgPT4gKDAsRi5tYXApKGZ3ZCwgeGkyeUYoYndkKHgpLCBpKSkpXG5cbi8vIElzb21vcnBoaXNtcyBhbmQgY29tYmluYXRvcnNcblxuZXhwb3J0IGNvbnN0IGlkZW50aXR5ID0gKF9GLCB4aTJ5RiwgeCwgaSkgPT4geGkyeUYoeCwgaSlcblxuZXhwb3J0IGNvbnN0IGludmVyc2UgPSBpc28gPT4gKEYsIHhpMnlGLCB4LCBpKSA9PlxuICAoMCxGLm1hcCkoeCA9PiBnZXRVKGlzbywgeCksIHhpMnlGKHNldFUoaXNvLCB4KSwgaSkpXG4iXX0=
