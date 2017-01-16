(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.L = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.inverse = exports.identity = exports.iso = exports.getInverse = exports.replace = exports.pick = exports.just = exports.to = exports.orElse = exports.valueOr = exports.prop = exports.index = exports.find = exports.filter = exports.append = exports.rewrite = exports.normalize = exports.define = exports.required = exports.defaults = exports.augment = exports.lens = exports.get = exports.sum = exports.product = exports.minimum = exports.maximum = exports.foldr = exports.foldl = exports.collect = exports.collectAs = exports.merge = exports.mergeAs = exports.concat = exports.concatAs = exports.log = exports.optional = exports.when = exports.choose = exports.choice = exports.chain = exports.set = exports.remove = exports.modify = undefined;
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

var branchOn = function branchOn(keys, vals) {
  return function (A, xi2yA, x, _) {
    var n = keys.length;
    var ap = A.ap,
        wait = function wait(x, i) {
      return 0 <= i ? function (y) {
        return wait(setProp(keys[i], y, x), i - 1);
      } : x;
    };
    if ("dev" !== "production") reqApplicative(A);
    var r = (0, A.of)(wait(x, n - 1));
    if (!(x instanceof Object)) x = void 0;
    for (var i = n - 1; 0 <= i; --i) {
      var k = keys[i],
          v = x && x[k];
      r = ap(r, vals ? vals[i](A, xi2yA, v, k) : xi2yA(v, k));
    }
    return (0, A.map)(object0ToUndefined, r);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvcGFydGlhbC5sZW5zZXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7UUMrV2dCLFUsR0FBQSxVO1FBc0NBLE8sR0FBQSxPO1FBK0JBLEksR0FBQSxJO1FBT0EsSSxHQUFBLEk7UUFpREEsTSxHQUFBLE07UUFXQSxLLEdBQUEsSztRQVlBLE0sR0FBQSxNO1FBaUdBLFEsR0FBQSxRO1FBbUJBLEssR0FBQSxLOztBQXZuQmhCOztBQWdCQTs7QUFFQSxTQUFTLElBQVQsQ0FBYyxFQUFkLEVBQWtCLEVBQWxCLEVBQXNCO0FBQUMsU0FBTyxDQUFDLEVBQUQsRUFBSyxFQUFMLENBQVA7QUFBZ0I7O0FBRXZDLElBQU0sT0FBTyxTQUFQLElBQU87QUFBQSxTQUFPLFVBQUMsQ0FBRCxFQUFJLENBQUo7QUFBQSxXQUFVLElBQUksQ0FBSixFQUFPLENBQVAsQ0FBVjtBQUFBLEdBQVA7QUFBQSxDQUFiOztBQUVBLElBQU0sT0FBTyxTQUFQLElBQU87QUFBQSxTQUFLO0FBQUEsV0FBSyxLQUFLLENBQUwsS0FBVyxDQUFYLEdBQWUsQ0FBZixHQUFtQixDQUF4QjtBQUFBLEdBQUw7QUFBQSxDQUFiOztBQUVBLElBQU0sUUFBUSxTQUFSLEtBQVE7QUFBQSxTQUFLLE1BQU8sS0FBSyxDQUFaLElBQWtCLEtBQUssQ0FBNUI7QUFBQSxDQUFkOztBQUVBLElBQU0saUJBQWlCLFNBQWpCLGNBQWlCO0FBQUEsU0FDckIsYUFBYSxNQUFiLElBQXVCLE1BQU0sRUFBRSxNQUFSLENBQXZCLElBQTBDLE9BQU8sQ0FBUCxLQUFhLFFBRGxDO0FBQUEsQ0FBdkI7O0FBR0E7O0FBRUEsU0FBUyxnQkFBVCxDQUEwQixJQUExQixFQUFnQyxFQUFoQyxFQUFvQztBQUNsQyxNQUFNLEtBQUssRUFBWDtBQUFBLE1BQWUsSUFBRSxHQUFHLE1BQXBCO0FBQ0EsT0FBSyxJQUFJLElBQUUsQ0FBTixFQUFT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QUFBQSxDQUFqQjs7QUFFQSxJQUFNLDRCQUFVLFNBQVYsT0FBVTtBQUFBLFNBQU8sVUFBQyxDQUFELEVBQUksS0FBSixFQUFXLENBQVgsRUFBYyxDQUFkO0FBQUEsV0FDNUIsQ0FBQyxHQUFFLEVBQUUsR0FBTCxFQUFVO0FBQUEsYUFBSyxLQUFLLEdBQUwsRUFBVSxDQUFWLENBQUw7QUFBQSxLQUFWLEVBQTZCLE1BQU0sS0FBSyxHQUFMLEVBQVUsQ0FBVixDQUFOLEVBQW9CLENBQXBCLENBQTdCLENBRDRCO0FBQUEsR0FBUDtBQUFBLENBQWhCIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCB7XG4gIGFjeWNsaWNFcXVhbHNVLFxuICBhbHdheXMsXG4gIGFwcGx5VSxcbiAgYXJpdHlOLFxuICBhc3NvY1BhcnRpYWxVLFxuICBjdXJyeSxcbiAgY3VycnlOLFxuICBkaXNzb2NQYXJ0aWFsVSxcbiAgaWQsXG4gIGlzRGVmaW5lZCxcbiAgaXNPYmplY3QsXG4gIGtleXMsXG4gIHNuZFVcbn0gZnJvbSBcImluZmVzdGluZXNcIlxuXG4vL1xuXG5mdW5jdGlvbiBwYWlyKHgwLCB4MSkge3JldHVybiBbeDAsIHgxXX1cblxuY29uc3QgZmxpcCA9IGJvcCA9PiAoeCwgeSkgPT4gYm9wKHksIHgpXG5cbmNvbnN0IHVudG8gPSBjID0+IHggPT4gdm9pZCAwICE9PSB4ID8geCA6IGNcblxuY29uc3QgaXNOYXQgPSB4ID0+IHggPT09ICh4ID4+IDApICYmIDAgPD0geFxuXG5jb25zdCBzZWVtc0FycmF5TGlrZSA9IHggPT5cbiAgeCBpbnN0YW5jZW9mIE9iamVjdCAmJiBpc05hdCh4Lmxlbmd0aCkgfHwgdHlwZW9mIHggPT09IFwic3RyaW5nXCJcblxuLy9cblxuZnVuY3Rpb24gbWFwUGFydGlhbEluZGV4VSh4aTJ5LCB4cykge1xuICBjb25zdCB5cyA9IFtdLCBuPXhzLmxlbmd0aFxuICBmb3IgKGxldCBpPTAsIHk7IGk8bjsgKytpKVxuICAgIGlmICh2b2lkIDAgIT09ICh5ID0geGkyeSh4c1tpXSwgaSkpKVxuICAgICAgeXMucHVzaCh5KVxuICByZXR1cm4geXMubGVuZ3RoID8geXMgOiB2b2lkIDBcbn1cblxuZnVuY3Rpb24gY29weVRvRnJvbSh5cywgaywgeHMsIGksIGopIHtcbiAgd2hpbGUgKGkgPCBqKVxuICAgIHlzW2srK10gPSB4c1tpKytdXG4gIHJldHVybiB5c1xufVxuXG5mdW5jdGlvbiBzZXRBdCh4cywgaSwgeCkge1xuICB4c1tpXSA9IHhcbiAgcmV0dXJuIHhzXG59XG5cbmZ1bmN0aW9uIGZyb21BcnJheUxpa2UoeHMpIHtcbiAgaWYgKHhzLmNvbnN0cnVjdG9yID09PSBBcnJheSlcbiAgICByZXR1cm4geHNcbiAgY29uc3QgbiA9IHhzLmxlbmd0aFxuICByZXR1cm4gY29weVRvRnJvbShBcnJheShuKSwgMCwgeHMsIDAsIG4pXG59XG5cbi8vXG5cbmNvbnN0IEFwcGxpY2F0aXZlID0gKG1hcCwgb2YsIGFwKSA9PiAoe21hcCwgb2YsIGFwfSlcblxuY29uc3QgSWRlbnQgPSBBcHBsaWNhdGl2ZShhcHBseVUsIGlkLCBhcHBseVUpXG5cbmNvbnN0IENvbnN0ID0ge21hcDogc25kVX1cblxuY29uc3QgVGFjbm9jT2YgPSAoZW1wdHksIHRhY25vYykgPT4gQXBwbGljYXRpdmUoc25kVSwgYWx3YXlzKGVtcHR5KSwgdGFjbm9jKVxuXG5jb25zdCBNb25vaWQgPSAoZW1wdHksIGNvbmNhdCkgPT4gKHtlbXB0eTogKCkgPT4gZW1wdHksIGNvbmNhdH0pXG5cbmNvbnN0IE11bSA9IG9yZCA9PlxuICBNb25vaWQodm9pZCAwLCAoeSwgeCkgPT4gdm9pZCAwICE9PSB4ICYmICh2b2lkIDAgPT09IHkgfHwgb3JkKHgsIHkpKSA/IHggOiB5KVxuXG4vL1xuXG5jb25zdCBydW4gPSAobywgQywgeGkyeUMsIHMsIGkpID0+IHRvRnVuY3Rpb24obykoQywgeGkyeUMsIHMsIGkpXG5cbmNvbnN0IGNvbnN0QXMgPSB0b0NvbnN0ID0+IGN1cnJ5Tig0LCAoeE1pMnksIG0pID0+IHtcbiAgY29uc3QgQyA9IHRvQ29uc3QobSlcbiAgcmV0dXJuICh0LCBzKSA9PiBydW4odCwgQywgeE1pMnksIHMpXG59KVxuXG4vL1xuXG5mdW5jdGlvbiByZXFBcHBsaWNhdGl2ZShmKSB7XG4gIGlmICghZi5vZilcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJwYXJ0aWFsLmxlbnNlczogVHJhdmVyc2FscyByZXF1aXJlIGFuIGFwcGxpY2F0aXZlLlwiKVxufVxuXG4vL1xuXG5mdW5jdGlvbiBDb25jYXQobCwgcikge3RoaXMubCA9IGw7IHRoaXMuciA9IHJ9XG5cbmNvbnN0IGlzQ29uY2F0ID0gbiA9PiBuLmNvbnN0cnVjdG9yID09PSBDb25jYXRcblxuY29uc3QgYXAgPSAociwgbCkgPT4gdm9pZCAwICE9PSBsID8gdm9pZCAwICE9PSByID8gbmV3IENvbmNhdChsLCByKSA6IGwgOiByXG5cbmNvbnN0IHJjb25jYXQgPSB0ID0+IGggPT4gYXAodCwgaClcblxuZnVuY3Rpb24gcHVzaFRvKG4sIHlzKSB7XG4gIHdoaWxlIChuICYmIGlzQ29uY2F0KG4pKSB7XG4gICAgY29uc3QgbCA9IG4ubFxuICAgIG4gPSBuLnJcbiAgICBpZiAobCAmJiBpc0NvbmNhdChsKSkge1xuICAgICAgcHVzaFRvKGwubCwgeXMpXG4gICAgICBwdXNoVG8obC5yLCB5cylcbiAgICB9IGVsc2VcbiAgICAgIHlzLnB1c2gobClcbiAgfVxuICB5cy5wdXNoKG4pXG59XG5cbmZ1bmN0aW9uIHRvQXJyYXkobikge1xuICBpZiAodm9pZCAwICE9PSBuKSB7XG4gICAgY29uc3QgeXMgPSBbXVxuICAgIHB1c2hUbyhuLCB5cylcbiAgICByZXR1cm4geXNcbiAgfVxufVxuXG5mdW5jdGlvbiBmb2xkUmVjKGYsIHIsIG4pIHtcbiAgd2hpbGUgKGlzQ29uY2F0KG4pKSB7XG4gICAgY29uc3QgbCA9IG4ubFxuICAgIG4gPSBuLnJcbiAgICByID0gaXNDb25jYXQobClcbiAgICAgID8gZm9sZFJlYyhmLCBmb2xkUmVjKGYsIHIsIGwubCksIGwucilcbiAgICAgIDogZihyLCBsWzBdLCBsWzFdKVxuICB9XG4gIHJldHVybiBmKHIsIG5bMF0sIG5bMV0pXG59XG5cbmNvbnN0IGZvbGQgPSAoZiwgciwgbikgPT4gdm9pZCAwICE9PSBuID8gZm9sZFJlYyhmLCByLCBuKSA6IHJcblxuY29uc3QgQ29sbGVjdCA9IFRhY25vY09mKHZvaWQgMCwgYXApXG5cbi8vXG5cbmZ1bmN0aW9uIHRyYXZlcnNlUGFydGlhbEluZGV4KEEsIHhpMnlBLCB4cykge1xuICBjb25zdCBhcCA9IEEuYXAsIG1hcCA9IEEubWFwXG4gIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpXG4gICAgcmVxQXBwbGljYXRpdmUoQSlcbiAgbGV0IHMgPSAoMCxBLm9mKSh2b2lkIDApLCBpID0geHMubGVuZ3RoXG4gIHdoaWxlIChpLS0pXG4gICAgcyA9IGFwKG1hcChyY29uY2F0LCBzKSwgeGkyeUEoeHNbaV0sIGkpKVxuICByZXR1cm4gbWFwKHRvQXJyYXksIHMpXG59XG5cbi8vXG5cbmZ1bmN0aW9uIG9iamVjdDBUb1VuZGVmaW5lZChvKSB7XG4gIGlmICghKG8gaW5zdGFuY2VvZiBPYmplY3QpKVxuICAgIHJldHVybiBvXG4gIGZvciAoY29uc3QgayBpbiBvKVxuICAgIHJldHVybiBvXG59XG5cbi8vXG5cbmNvbnN0IGdldFByb3AgPSAoaywgbykgPT4gbyBpbnN0YW5jZW9mIE9iamVjdCA/IG9ba10gOiB2b2lkIDBcblxuY29uc3Qgc2V0UHJvcCA9IChrLCB2LCBvKSA9PlxuICB2b2lkIDAgIT09IHYgPyBhc3NvY1BhcnRpYWxVKGssIHYsIG8pIDogZGlzc29jUGFydGlhbFUoaywgbylcblxuY29uc3QgZnVuUHJvcCA9IGsgPT4gKEYsIHhpMnlGLCB4LCBfKSA9PlxuICAoMCxGLm1hcCkodiA9PiBzZXRQcm9wKGssIHYsIHgpLCB4aTJ5RihnZXRQcm9wKGssIHgpLCBrKSlcblxuLy9cblxuZnVuY3Rpb24gY2xlYXJSYW5nZSh4cywgaSwgaikge1xuICB3aGlsZSAoaSA8IGopXG4gICAgeHNbaSsrXSA9IG51bGxcbiAgcmV0dXJuIHhzXG59XG5cbmNvbnN0IGdldEluZGV4ID0gKGksIHhzKSA9PiBzZWVtc0FycmF5TGlrZSh4cykgPyB4c1tpXSA6IHZvaWQgMFxuXG5mdW5jdGlvbiBzZXRJbmRleChpLCB4LCB4cykge1xuICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiICYmIGkgPCAwKVxuICAgIHRocm93IG5ldyBFcnJvcihcInBhcnRpYWwubGVuc2VzOiBOZWdhdGl2ZSBpbmRpY2VzIG5vdCBzdXBwb3J0ZWRcIilcbiAgaWYgKHZvaWQgMCAhPT0geCkge1xuICAgIGlmICghc2VlbXNBcnJheUxpa2UoeHMpKVxuICAgICAgcmV0dXJuIHNldEF0KGNsZWFyUmFuZ2UoQXJyYXkoaSsxKSwgMCwgaSksIGksIHgpXG4gICAgY29uc3QgbiA9IHhzLmxlbmd0aFxuICAgIGlmIChuIDw9IGkpXG4gICAgICByZXR1cm4gc2V0QXQoY2xlYXJSYW5nZShjb3B5VG9Gcm9tKEFycmF5KGkrMSksIDAsIHhzLCAwLCBuKSwgbiwgaSksIGksIHgpXG4gICAgY29uc3QgeXMgPSBBcnJheShuKVxuICAgIGZvciAobGV0IGo9MDsgajxuOyArK2opXG4gICAgICB5c1tqXSA9IHhzW2pdXG4gICAgeXNbaV0gPSB4XG4gICAgcmV0dXJuIHlzXG4gIH0gZWxzZSB7XG4gICAgaWYgKHNlZW1zQXJyYXlMaWtlKHhzKSkge1xuICAgICAgY29uc3QgbiA9IHhzLmxlbmd0aFxuICAgICAgaWYgKDAgPCBuKSB7XG4gICAgICAgIGlmIChuIDw9IGkpXG4gICAgICAgICAgcmV0dXJuIGZyb21BcnJheUxpa2UoeHMpXG4gICAgICAgIGlmICgxIDwgbikge1xuICAgICAgICAgIGNvbnN0IHlzID0gQXJyYXkobi0xKVxuICAgICAgICAgIGZvciAobGV0IGo9MDsgajxpOyArK2opXG4gICAgICAgICAgICB5c1tqXSA9IHhzW2pdXG4gICAgICAgICAgZm9yIChsZXQgaj1pKzE7IGo8bjsgKytqKVxuICAgICAgICAgICAgeXNbai0xXSA9IHhzW2pdXG4gICAgICAgICAgcmV0dXJuIHlzXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuY29uc3QgZnVuSW5kZXggPSBpID0+IChGLCB4aTJ5RiwgeHMsIF8pID0+XG4gICgwLEYubWFwKSh5ID0+IHNldEluZGV4KGksIHksIHhzKSwgeGkyeUYoZ2V0SW5kZXgoaSwgeHMpLCBpKSlcblxuLy9cblxuZnVuY3Rpb24gcmVxT3B0aWMobykge1xuICBpZiAoISh0eXBlb2YgbyA9PT0gXCJmdW5jdGlvblwiICYmIG8ubGVuZ3RoID09PSA0KSlcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJwYXJ0aWFsLmxlbnNlczogRXhwZWN0aW5nIGFuIG9wdGljLlwiKVxufVxuXG5jb25zdCBjbG9zZSA9IChvLCBGLCB4aTJ5RikgPT4gKHgsIGkpID0+IG8oRiwgeGkyeUYsIHgsIGkpXG5cbmZ1bmN0aW9uIGNvbXBvc2VkKG9pMCwgb3MpIHtcbiAgc3dpdGNoIChvcy5sZW5ndGggLSBvaTApIHtcbiAgICBjYXNlIDA6ICByZXR1cm4gaWRlbnRpdHlcbiAgICBjYXNlIDE6ICByZXR1cm4gdG9GdW5jdGlvbihvc1tvaTBdKVxuICAgIGRlZmF1bHQ6IHJldHVybiAoRiwgeGkyeUYsIHgsIGkpID0+IHtcbiAgICAgIGxldCBuID0gb3MubGVuZ3RoXG4gICAgICB4aTJ5RiA9IGNsb3NlKHRvRnVuY3Rpb24ob3NbLS1uXSksIEYsIHhpMnlGKVxuICAgICAgd2hpbGUgKG9pMCA8IC0tbilcbiAgICAgICAgeGkyeUYgPSBjbG9zZSh0b0Z1bmN0aW9uKG9zW25dKSwgRiwgeGkyeUYpXG4gICAgICByZXR1cm4gcnVuKG9zW29pMF0sIEYsIHhpMnlGLCB4LCBpKVxuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBzZXRVKG8sIHgsIHMpIHtcbiAgc3dpdGNoICh0eXBlb2Ygbykge1xuICAgIGNhc2UgXCJzdHJpbmdcIjpcbiAgICAgIHJldHVybiBzZXRQcm9wKG8sIHgsIHMpXG4gICAgY2FzZSBcIm51bWJlclwiOlxuICAgICAgcmV0dXJuIHNldEluZGV4KG8sIHgsIHMpXG4gICAgY2FzZSBcImZ1bmN0aW9uXCI6XG4gICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKVxuICAgICAgICByZXFPcHRpYyhvKVxuICAgICAgcmV0dXJuIG8oSWRlbnQsIGFsd2F5cyh4KSwgcywgdm9pZCAwKVxuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gbW9kaWZ5Q29tcG9zZWQobywgYWx3YXlzKHgpLCBzKVxuICB9XG59XG5cbmZ1bmN0aW9uIGdldENvbXBvc2VkKGxzLCBzKSB7XG4gIGZvciAobGV0IGk9MCwgbj1scy5sZW5ndGgsIGw7IGk8bjsgKytpKVxuICAgIHN3aXRjaCAodHlwZW9mIChsID0gbHNbaV0pKSB7XG4gICAgICBjYXNlIFwic3RyaW5nXCI6IHMgPSBnZXRQcm9wKGwsIHMpOyBicmVha1xuICAgICAgY2FzZSBcIm51bWJlclwiOiBzID0gZ2V0SW5kZXgobCwgcyk7IGJyZWFrXG4gICAgICBkZWZhdWx0OiByZXR1cm4gY29tcG9zZWQoaSwgbHMpKENvbnN0LCBpZCwgcywgbHNbaS0xXSlcbiAgICB9XG4gIHJldHVybiBzXG59XG5cbmZ1bmN0aW9uIGdldFUobCwgcykge1xuICBzd2l0Y2ggKHR5cGVvZiBsKSB7XG4gICAgY2FzZSBcInN0cmluZ1wiOlxuICAgICAgcmV0dXJuIGdldFByb3AobCwgcylcbiAgICBjYXNlIFwibnVtYmVyXCI6XG4gICAgICByZXR1cm4gZ2V0SW5kZXgobCwgcylcbiAgICBjYXNlIFwiZnVuY3Rpb25cIjpcbiAgICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpXG4gICAgICAgIHJlcU9wdGljKGwpXG4gICAgICByZXR1cm4gbChDb25zdCwgaWQsIHMsIHZvaWQgMClcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIGdldENvbXBvc2VkKGwsIHMpXG4gIH1cbn1cblxuZnVuY3Rpb24gbW9kaWZ5Q29tcG9zZWQob3MsIHhpMngsIHgpIHtcbiAgbGV0IG4gPSBvcy5sZW5ndGhcbiAgY29uc3QgeHMgPSBbXVxuICBmb3IgKGxldCBpPTAsIG87IGk8bjsgKytpKSB7XG4gICAgeHMucHVzaCh4KVxuICAgIHN3aXRjaCAodHlwZW9mIChvID0gb3NbaV0pKSB7XG4gICAgICBjYXNlIFwic3RyaW5nXCI6XG4gICAgICAgIHggPSBnZXRQcm9wKG8sIHgpXG4gICAgICAgIGJyZWFrXG4gICAgICBjYXNlIFwibnVtYmVyXCI6XG4gICAgICAgIHggPSBnZXRJbmRleChvLCB4KVxuICAgICAgICBicmVha1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgeCA9IGNvbXBvc2VkKGksIG9zKShJZGVudCwgeGkyeCwgeCwgb3NbaS0xXSlcbiAgICAgICAgbiA9IGlcbiAgICAgICAgYnJlYWtcbiAgICB9XG4gIH1cbiAgaWYgKG4gPT09IG9zLmxlbmd0aClcbiAgICB4ID0geGkyeCh4LCBvc1tuLTFdKVxuICB3aGlsZSAoMCA8PSAtLW4pIHtcbiAgICBjb25zdCBvID0gb3Nbbl1cbiAgICBzd2l0Y2ggKHR5cGVvZiBvKSB7XG4gICAgICBjYXNlIFwic3RyaW5nXCI6IHggPSBzZXRQcm9wKG8sIHgsIHhzW25dKTsgYnJlYWtcbiAgICAgIGNhc2UgXCJudW1iZXJcIjogeCA9IHNldEluZGV4KG8sIHgsIHhzW25dKTsgYnJlYWtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHhcbn1cblxuLy9cblxuZnVuY3Rpb24gZ2V0UGljayh0ZW1wbGF0ZSwgeCkge1xuICBsZXQgclxuICBmb3IgKGNvbnN0IGsgaW4gdGVtcGxhdGUpIHtcbiAgICBjb25zdCB2ID0gZ2V0VSh0ZW1wbGF0ZVtrXSwgeClcbiAgICBpZiAodm9pZCAwICE9PSB2KSB7XG4gICAgICBpZiAoIXIpXG4gICAgICAgIHIgPSB7fVxuICAgICAgcltrXSA9IHZcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJcbn1cblxuY29uc3Qgc2V0UGljayA9ICh0ZW1wbGF0ZSwgeCkgPT4gdmFsdWUgPT4ge1xuICBpZiAoIWlzT2JqZWN0KHZhbHVlKSlcbiAgICB2YWx1ZSA9IHZvaWQgMFxuICBmb3IgKGNvbnN0IGsgaW4gdGVtcGxhdGUpXG4gICAgeCA9IHNldFUodGVtcGxhdGVba10sIHZhbHVlICYmIHZhbHVlW2tdLCB4KVxuICByZXR1cm4geFxufVxuXG4vL1xuXG5jb25zdCBzaG93ID0gKGxhYmVscywgZGlyKSA9PiB4ID0+XG4gIGNvbnNvbGUubG9nLmFwcGx5KGNvbnNvbGUsIGxhYmVscy5jb25jYXQoW2RpciwgeF0pKSB8fCB4XG5cbmNvbnN0IGJyYW5jaE9uID0gKGtleXMsIHZhbHMpID0+IChBLCB4aTJ5QSwgeCwgXykgPT4ge1xuICBjb25zdCBuID0ga2V5cy5sZW5ndGhcbiAgY29uc3QgYXAgPSBBLmFwLFxuICAgICAgICB3YWl0ID0gKHgsIGkpID0+IDAgPD0gaSA/IHkgPT4gd2FpdChzZXRQcm9wKGtleXNbaV0sIHksIHgpLCBpLTEpIDogeFxuICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKVxuICAgIHJlcUFwcGxpY2F0aXZlKEEpXG4gIGxldCByID0gKDAsQS5vZikod2FpdCh4LCBuLTEpKVxuICBpZiAoISh4IGluc3RhbmNlb2YgT2JqZWN0KSlcbiAgICB4ID0gdm9pZCAwXG4gIGZvciAobGV0IGk9bi0xOyAwPD1pOyAtLWkpIHtcbiAgICBjb25zdCBrID0ga2V5c1tpXSwgdiA9IHggJiYgeFtrXVxuICAgIHIgPSBhcChyLCAodmFscyA/IHZhbHNbaV0oQSwgeGkyeUEsIHYsIGspIDogeGkyeUEodiwgaykpKVxuICB9XG4gIHJldHVybiAoMCxBLm1hcCkob2JqZWN0MFRvVW5kZWZpbmVkLCByKVxufVxuXG5jb25zdCBub3JtYWxpemVyID0geGkyeCA9PiAoRiwgeGkyeUYsIHgsIGkpID0+XG4gICgwLEYubWFwKSh4ID0+IHhpMngoeCwgaSksIHhpMnlGKHhpMngoeCwgaSksIGkpKVxuXG5jb25zdCByZXBsYWNlZCA9IChpbm4sIG91dCwgeCkgPT4gYWN5Y2xpY0VxdWFsc1UoeCwgaW5uKSA/IG91dCA6IHhcblxuZnVuY3Rpb24gZmluZEluZGV4KHhpMmIsIHhzKSB7XG4gIGZvciAobGV0IGk9MCwgbj14cy5sZW5ndGg7IGk8bjsgKytpKVxuICAgIGlmICh4aTJiKHhzW2ldLCBpKSlcbiAgICAgIHJldHVybiBpXG4gIHJldHVybiAtMVxufVxuXG5mdW5jdGlvbiBwYXJ0aXRpb25JbnRvSW5kZXgoeGkyYiwgeHMsIHRzLCBmcykge1xuICBmb3IgKGxldCBpPTAsIG49eHMubGVuZ3RoLCB4OyBpPG47ICsraSlcbiAgICAoeGkyYih4ID0geHNbaV0sIGkpID8gdHMgOiBmcykucHVzaCh4KVxufVxuXG4vL1xuXG5leHBvcnQgZnVuY3Rpb24gdG9GdW5jdGlvbihvKSB7XG4gIHN3aXRjaCAodHlwZW9mIG8pIHtcbiAgICBjYXNlIFwic3RyaW5nXCI6XG4gICAgICByZXR1cm4gZnVuUHJvcChvKVxuICAgIGNhc2UgXCJudW1iZXJcIjpcbiAgICAgIHJldHVybiBmdW5JbmRleChvKVxuICAgIGNhc2UgXCJmdW5jdGlvblwiOlxuICAgICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIilcbiAgICAgICAgcmVxT3B0aWMobylcbiAgICAgIHJldHVybiBvXG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBjb21wb3NlZCgwLG8pXG4gIH1cbn1cblxuLy8gT3BlcmF0aW9ucyBvbiBvcHRpY3NcblxuZXhwb3J0IGNvbnN0IG1vZGlmeSA9IGN1cnJ5KChvLCB4aTJ4LCBzKSA9PiB7XG4gIHN3aXRjaCAodHlwZW9mIG8pIHtcbiAgICBjYXNlIFwic3RyaW5nXCI6XG4gICAgICByZXR1cm4gc2V0UHJvcChvLCB4aTJ4KGdldFByb3AobywgcyksIG8pLCBzKVxuICAgIGNhc2UgXCJudW1iZXJcIjpcbiAgICAgIHJldHVybiBzZXRJbmRleChvLCB4aTJ4KGdldEluZGV4KG8sIHMpLCBvKSwgcylcbiAgICBjYXNlIFwiZnVuY3Rpb25cIjpcbiAgICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpXG4gICAgICAgIHJlcU9wdGljKG8pXG4gICAgICByZXR1cm4gbyhJZGVudCwgeGkyeCwgcywgdm9pZCAwKVxuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gbW9kaWZ5Q29tcG9zZWQobywgeGkyeCwgcylcbiAgfVxufSlcblxuZXhwb3J0IGNvbnN0IHJlbW92ZSA9IGN1cnJ5KChvLCBzKSA9PiBzZXRVKG8sIHZvaWQgMCwgcykpXG5cbmV4cG9ydCBjb25zdCBzZXQgPSBjdXJyeShzZXRVKVxuXG4vLyBOZXN0aW5nXG5cbmV4cG9ydCBmdW5jdGlvbiBjb21wb3NlKCkge1xuICBzd2l0Y2ggKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICBjYXNlIDA6IHJldHVybiBpZGVudGl0eVxuICAgIGNhc2UgMTogcmV0dXJuIGFyZ3VtZW50c1swXVxuICAgIGRlZmF1bHQ6IHtcbiAgICAgIGNvbnN0IG4gPSBhcmd1bWVudHMubGVuZ3RoLCBsZW5zZXMgPSBBcnJheShuKVxuICAgICAgZm9yIChsZXQgaT0wOyBpPG47ICsraSlcbiAgICAgICAgbGVuc2VzW2ldID0gYXJndW1lbnRzW2ldXG4gICAgICByZXR1cm4gbGVuc2VzXG4gICAgfVxuICB9XG59XG5cbi8vIFF1ZXJ5aW5nXG5cbmV4cG9ydCBjb25zdCBjaGFpbiA9IGN1cnJ5KCh4aTJ5TywgeE8pID0+XG4gIFt4TywgY2hvb3NlKCh4TSwgaSkgPT4gdm9pZCAwICE9PSB4TSA/IHhpMnlPKHhNLCBpKSA6IHplcm8pXSlcblxuZXhwb3J0IGNvbnN0IGNob2ljZSA9ICguLi5scykgPT4gY2hvb3NlKHggPT4ge1xuICBjb25zdCBpID0gZmluZEluZGV4KGwgPT4gdm9pZCAwICE9PSBnZXRVKGwsIHgpLCBscylcbiAgcmV0dXJuIGkgPCAwID8gemVybyA6IGxzW2ldXG59KVxuXG5leHBvcnQgY29uc3QgY2hvb3NlID0geGlNMm8gPT4gKEMsIHhpMnlDLCB4LCBpKSA9PlxuICBydW4oeGlNMm8oeCwgaSksIEMsIHhpMnlDLCB4LCBpKVxuXG5leHBvcnQgY29uc3Qgd2hlbiA9IHAgPT4gKEMsIHhpMnlDLCB4LCBpKSA9PlxuICBwKHgsIGkpID8geGkyeUMoeCwgaSkgOiB6ZXJvKEMsIHhpMnlDLCB4LCBpKVxuXG5leHBvcnQgY29uc3Qgb3B0aW9uYWwgPSB3aGVuKGlzRGVmaW5lZClcblxuZXhwb3J0IGZ1bmN0aW9uIHplcm8oQywgeGkyeUMsIHgsIGkpIHtcbiAgY29uc3Qgb2YgPSBDLm9mXG4gIHJldHVybiBvZiA/IG9mKHgpIDogKDAsQy5tYXApKGFsd2F5cyh4KSwgeGkyeUModm9pZCAwLCBpKSlcbn1cblxuLy8gUmVjdXJzaW5nXG5cbmV4cG9ydCBmdW5jdGlvbiBsYXp5KG8ybykge1xuICBsZXQgbWVtbyA9IChDLCB4aTJ5QywgeCwgaSkgPT4gKG1lbW8gPSB0b0Z1bmN0aW9uKG8ybyhyZWMpKSkoQywgeGkyeUMsIHgsIGkpXG4gIGZ1bmN0aW9uIHJlYyhDLCB4aTJ5QywgeCwgaSkge3JldHVybiBtZW1vKEMsIHhpMnlDLCB4LCBpKX1cbiAgcmV0dXJuIHJlY1xufVxuXG4vLyBEZWJ1Z2dpbmdcblxuZXhwb3J0IGNvbnN0IGxvZyA9ICguLi5sYWJlbHMpID0+IGlzbyhzaG93KGxhYmVscywgXCJnZXRcIiksIHNob3cobGFiZWxzLCBcInNldFwiKSlcblxuLy8gT3BlcmF0aW9ucyBvbiB0cmF2ZXJzYWxzXG5cbmV4cG9ydCBjb25zdCBjb25jYXRBcyA9IGNvbnN0QXMobSA9PiBUYWNub2NPZigoMCxtLmVtcHR5KSgpLCBmbGlwKG0uY29uY2F0KSkpXG5cbmV4cG9ydCBjb25zdCBjb25jYXQgPSBjb25jYXRBcyhpZClcblxuZXhwb3J0IGNvbnN0IG1lcmdlQXMgPSBjb25zdEFzKG0gPT4gVGFjbm9jT2YoKDAsbS5lbXB0eSkoKSwgbS5jb25jYXQpKVxuXG5leHBvcnQgY29uc3QgbWVyZ2UgPSBtZXJnZUFzKGlkKVxuXG4vLyBGb2xkcyBvdmVyIHRyYXZlcnNhbHNcblxuZXhwb3J0IGNvbnN0IGNvbGxlY3RBcyA9IGN1cnJ5KCh4aTJ5LCB0LCBzKSA9PlxuICB0b0FycmF5KHJ1bih0LCBDb2xsZWN0LCB4aTJ5LCBzKSkgfHwgW10pXG5cbmV4cG9ydCBjb25zdCBjb2xsZWN0ID0gY29sbGVjdEFzKGlkKVxuXG5leHBvcnQgY29uc3QgZm9sZGwgPSBjdXJyeSgoZiwgciwgdCwgcykgPT5cbiAgZm9sZChmLCByLCBydW4odCwgQ29sbGVjdCwgcGFpciwgcykpKVxuXG5leHBvcnQgY29uc3QgZm9sZHIgPSBjdXJyeSgoZiwgciwgdCwgcykgPT4ge1xuICBjb25zdCB4cyA9IGNvbGxlY3RBcyhwYWlyLCB0LCBzKVxuICBmb3IgKGxldCBpPXhzLmxlbmd0aC0xOyAwPD1pOyAtLWkpIHtcbiAgICBjb25zdCB4ID0geHNbaV1cbiAgICByID0gZihyLCB4WzBdLCB4WzFdKVxuICB9XG4gIHJldHVybiByXG59KVxuXG5leHBvcnQgY29uc3QgbWF4aW11bSA9IG1lcmdlKE11bSgoeCwgeSkgPT4geCA+IHkpKVxuXG5leHBvcnQgY29uc3QgbWluaW11bSA9IG1lcmdlKE11bSgoeCwgeSkgPT4geCA8IHkpKVxuXG5leHBvcnQgY29uc3QgcHJvZHVjdCA9IG1lcmdlQXModW50bygxKSwgTW9ub2lkKDEsICh5LCB4KSA9PiB4ICogeSkpXG5cbmV4cG9ydCBjb25zdCBzdW0gPSBtZXJnZUFzKHVudG8oMCksIE1vbm9pZCgwLCAoeSwgeCkgPT4geCArIHkpKVxuXG4vLyBDcmVhdGluZyBuZXcgdHJhdmVyc2Fsc1xuXG5leHBvcnQgZnVuY3Rpb24gYnJhbmNoKHRlbXBsYXRlKSB7XG4gIGNvbnN0IGtleXMgPSBbXSwgdmFscyA9IFtdXG4gIGZvciAoY29uc3QgayBpbiB0ZW1wbGF0ZSkge1xuICAgIGtleXMucHVzaChrKVxuICAgIHZhbHMucHVzaCh0b0Z1bmN0aW9uKHRlbXBsYXRlW2tdKSlcbiAgfVxuICByZXR1cm4gYnJhbmNoT24oa2V5cywgdmFscylcbn1cblxuLy8gVHJhdmVyc2FscyBhbmQgY29tYmluYXRvcnNcblxuZXhwb3J0IGZ1bmN0aW9uIGVsZW1zKEEsIHhpMnlBLCB4cywgXykge1xuICBpZiAoc2VlbXNBcnJheUxpa2UoeHMpKSB7XG4gICAgcmV0dXJuIEEgPT09IElkZW50XG4gICAgICA/IG1hcFBhcnRpYWxJbmRleFUoeGkyeUEsIHhzKVxuICAgICAgOiB0cmF2ZXJzZVBhcnRpYWxJbmRleChBLCB4aTJ5QSwgeHMpXG4gIH0gZWxzZSB7XG4gICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIilcbiAgICAgIHJlcUFwcGxpY2F0aXZlKEEpXG4gICAgcmV0dXJuICgwLEEub2YpKHhzKVxuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB2YWx1ZXMoQSwgeGkyeUEsIHhzLCBfKSB7XG4gIGlmICh4cyBpbnN0YW5jZW9mIE9iamVjdCkge1xuICAgIHJldHVybiBicmFuY2hPbihrZXlzKHhzKSkoQSwgeGkyeUEsIHhzKVxuICB9IGVsc2Uge1xuICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpXG4gICAgICByZXFBcHBsaWNhdGl2ZShBKVxuICAgIHJldHVybiAoMCxBLm9mKSh4cylcbiAgfVxufVxuXG4vLyBPcGVyYXRpb25zIG9uIGxlbnNlc1xuXG5leHBvcnQgY29uc3QgZ2V0ID0gY3VycnkoZ2V0VSlcblxuLy8gQ3JlYXRpbmcgbmV3IGxlbnNlc1xuXG5leHBvcnQgY29uc3QgbGVucyA9IGN1cnJ5KChnZXQsIHNldCkgPT4gKEYsIHhpMnlGLCB4LCBpKSA9PlxuICAoMCxGLm1hcCkoeSA9PiBzZXQoeSwgeCwgaSksIHhpMnlGKGdldCh4LCBpKSwgaSkpKVxuXG4vLyBDb21wdXRpbmcgZGVyaXZlZCBwcm9wc1xuXG5leHBvcnQgY29uc3QgYXVnbWVudCA9IHRlbXBsYXRlID0+IGxlbnMoXG4gIHggPT4ge1xuICAgIHggPSBkaXNzb2NQYXJ0aWFsVSgwLCB4KVxuICAgIGlmICh4KVxuICAgICAgZm9yIChjb25zdCBrIGluIHRlbXBsYXRlKVxuICAgICAgICB4W2tdID0gdGVtcGxhdGVba10oeClcbiAgICByZXR1cm4geFxuICB9LFxuICAoeSwgeCkgPT4ge1xuICAgIGlmIChpc09iamVjdCh5KSkge1xuICAgICAgaWYgKCEoeCBpbnN0YW5jZW9mIE9iamVjdCkpXG4gICAgICAgIHggPSB2b2lkIDBcbiAgICAgIGxldCB6XG4gICAgICBjb25zdCBzZXQgPSAoaywgdikgPT4ge1xuICAgICAgICBpZiAoIXopXG4gICAgICAgICAgeiA9IHt9XG4gICAgICAgIHpba10gPSB2XG4gICAgICB9XG4gICAgICBmb3IgKGNvbnN0IGsgaW4geSkge1xuICAgICAgICBpZiAoIShrIGluIHRlbXBsYXRlKSlcbiAgICAgICAgICBzZXQoaywgeVtrXSlcbiAgICAgICAgZWxzZVxuICAgICAgICAgIGlmICh4ICYmIGsgaW4geClcbiAgICAgICAgICAgIHNldChrLCB4W2tdKVxuICAgICAgfVxuICAgICAgcmV0dXJuIHpcbiAgICB9XG4gIH0pXG5cbi8vIEVuZm9yY2luZyBpbnZhcmlhbnRzXG5cbmV4cG9ydCBjb25zdCBkZWZhdWx0cyA9IG91dCA9PiB7XG4gIGNvbnN0IG8ydSA9IHggPT4gcmVwbGFjZWQob3V0LCB2b2lkIDAsIHgpXG4gIHJldHVybiAoRiwgeGkyeUYsIHgsIGkpID0+ICgwLEYubWFwKShvMnUsIHhpMnlGKHZvaWQgMCAhPT0geCA/IHggOiBvdXQsIGkpKVxufVxuXG5leHBvcnQgY29uc3QgcmVxdWlyZWQgPSBpbm4gPT4gcmVwbGFjZShpbm4sIHZvaWQgMClcblxuZXhwb3J0IGNvbnN0IGRlZmluZSA9IHYgPT4gbm9ybWFsaXplcih1bnRvKHYpKVxuXG5leHBvcnQgY29uc3Qgbm9ybWFsaXplID0geGkyeCA9PlxuICBub3JtYWxpemVyKCh4LCBpKSA9PiB2b2lkIDAgIT09IHggPyB4aTJ4KHgsIGkpIDogdm9pZCAwKVxuXG5leHBvcnQgY29uc3QgcmV3cml0ZSA9IHlpMnkgPT4gKEYsIHhpMnlGLCB4LCBpKSA9PlxuICAoMCxGLm1hcCkoeSA9PiB2b2lkIDAgIT09IHkgPyB5aTJ5KHksIGkpIDogdm9pZCAwLCB4aTJ5Rih4LCBpKSlcblxuLy8gTGVuc2luZyBhcnJheXNcblxuZXhwb3J0IGNvbnN0IGFwcGVuZCA9IChGLCB4aTJ5RiwgeHMsIGkpID0+XG4gICgwLEYubWFwKSh4ID0+IHNldEluZGV4KHNlZW1zQXJyYXlMaWtlKHhzKSA/IHhzLmxlbmd0aCA6IDAsIHgsIHhzKSxcbiAgICAgICAgICAgIHhpMnlGKHZvaWQgMCwgaSkpXG5cbmV4cG9ydCBjb25zdCBmaWx0ZXIgPSB4aTJiID0+IChGLCB4aTJ5RiwgeHMsIGkpID0+IHtcbiAgbGV0IHRzLCBmc1xuICBpZiAoc2VlbXNBcnJheUxpa2UoeHMpKVxuICAgIHBhcnRpdGlvbkludG9JbmRleCh4aTJiLCB4cywgdHMgPSBbXSwgZnMgPSBbXSlcbiAgcmV0dXJuICgwLEYubWFwKShcbiAgICB0cyA9PiB7XG4gICAgICBjb25zdCB0c04gPSB0cyA/IHRzLmxlbmd0aCA6IDAsXG4gICAgICAgICAgICBmc04gPSBmcyA/IGZzLmxlbmd0aCA6IDAsXG4gICAgICAgICAgICBuID0gdHNOICsgZnNOXG4gICAgICBpZiAobilcbiAgICAgICAgcmV0dXJuIG4gPT09IGZzTlxuICAgICAgICA/IGZzXG4gICAgICAgIDogY29weVRvRnJvbShjb3B5VG9Gcm9tKEFycmF5KG4pLCAwLCB0cywgMCwgdHNOKSwgdHNOLCBmcywgMCwgZnNOKVxuICAgIH0sXG4gICAgeGkyeUYodHMsIGkpKVxufVxuXG5leHBvcnQgY29uc3QgZmluZCA9IHhpMmIgPT4gY2hvb3NlKHhzID0+IHtcbiAgaWYgKCFzZWVtc0FycmF5TGlrZSh4cykpXG4gICAgcmV0dXJuIDBcbiAgY29uc3QgaSA9IGZpbmRJbmRleCh4aTJiLCB4cylcbiAgcmV0dXJuIGkgPCAwID8gYXBwZW5kIDogaVxufSlcblxuZXhwb3J0IGZ1bmN0aW9uIGZpbmRXaXRoKC4uLmxzKSB7XG4gIGNvbnN0IGxscyA9IGNvbXBvc2UoLi4ubHMpXG4gIHJldHVybiBbZmluZCh4ID0+IHZvaWQgMCAhPT0gZ2V0VShsbHMsIHgpKSwgbGxzXVxufVxuXG5leHBvcnQgY29uc3QgaW5kZXggPSBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gXCJwcm9kdWN0aW9uXCIgPyBpZCA6IHggPT4ge1xuICBpZiAoIU51bWJlci5pc0ludGVnZXIoeCkgfHwgeCA8IDApXG4gICAgdGhyb3cgbmV3IEVycm9yKFwicGFydGlhbC5sZW5zZXM6IGBpbmRleGAgZXhwZWN0cyBhIG5vbi1uZWdhdGl2ZSBpbnRlZ2VyLlwiKVxuICByZXR1cm4geFxufVxuXG4vLyBMZW5zaW5nIG9iamVjdHNcblxuZXhwb3J0IGNvbnN0IHByb3AgPSBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gXCJwcm9kdWN0aW9uXCIgPyBpZCA6IHggPT4ge1xuICBpZiAodHlwZW9mIHggIT09IFwic3RyaW5nXCIpXG4gICAgdGhyb3cgbmV3IEVycm9yKFwicGFydGlhbC5sZW5zZXM6IGBwcm9wYCBleHBlY3RzIGEgc3RyaW5nLlwiKVxuICByZXR1cm4geFxufVxuXG5leHBvcnQgZnVuY3Rpb24gcHJvcHMoKSB7XG4gIGNvbnN0IG4gPSBhcmd1bWVudHMubGVuZ3RoLCB0ZW1wbGF0ZSA9IHt9XG4gIGZvciAobGV0IGk9MCwgazsgaTxuOyArK2kpXG4gICAgdGVtcGxhdGVbayA9IGFyZ3VtZW50c1tpXV0gPSBrXG4gIHJldHVybiBwaWNrKHRlbXBsYXRlKVxufVxuXG4vLyBQcm92aWRpbmcgZGVmYXVsdHNcblxuZXhwb3J0IGNvbnN0IHZhbHVlT3IgPSB2ID0+IChfRiwgeGkyeUYsIHgsIGkpID0+XG4gIHhpMnlGKHZvaWQgMCAhPT0geCAmJiB4ICE9PSBudWxsID8geCA6IHYsIGkpXG5cbi8vIEFkYXB0aW5nIHRvIGRhdGFcblxuZXhwb3J0IGNvbnN0IG9yRWxzZSA9XG4gIGN1cnJ5KChkLCBsKSA9PiBjaG9vc2UoeCA9PiB2b2lkIDAgIT09IGdldFUobCwgeCkgPyBsIDogZCkpXG5cbi8vIFJlYWQtb25seSBtYXBwaW5nXG5cbmV4cG9ydCBjb25zdCB0byA9IHdpMnggPT4gKEYsIHhpMnlGLCB3LCBpKSA9PlxuICAoMCxGLm1hcCkoYWx3YXlzKHcpLCB4aTJ5Rih3aTJ4KHcsIGkpLCBpKSlcblxuZXhwb3J0IGNvbnN0IGp1c3QgPSB4ID0+IHRvKGFsd2F5cyh4KSlcblxuLy8gVHJhbnNmb3JtaW5nIGRhdGFcblxuZXhwb3J0IGNvbnN0IHBpY2sgPSB0ZW1wbGF0ZSA9PiAoRiwgeGkyeUYsIHgsIGkpID0+XG4gICgwLEYubWFwKShzZXRQaWNrKHRlbXBsYXRlLCB4KSwgeGkyeUYoZ2V0UGljayh0ZW1wbGF0ZSwgeCksIGkpKVxuXG5leHBvcnQgY29uc3QgcmVwbGFjZSA9IGN1cnJ5KChpbm4sIG91dCkgPT4ge1xuICBjb25zdCBvMmkgPSB4ID0+IHJlcGxhY2VkKG91dCwgaW5uLCB4KVxuICByZXR1cm4gKEYsIHhpMnlGLCB4LCBpKSA9PiAoMCxGLm1hcCkobzJpLCB4aTJ5RihyZXBsYWNlZChpbm4sIG91dCwgeCksIGkpKVxufSlcblxuLy8gT3BlcmF0aW9ucyBvbiBpc29tb3JwaGlzbXNcblxuZXhwb3J0IGNvbnN0IGdldEludmVyc2UgPSBhcml0eU4oMiwgc2V0VSlcblxuLy8gQ3JlYXRpbmcgbmV3IGlzb21vcnBoaXNtc1xuXG5leHBvcnQgY29uc3QgaXNvID1cbiAgY3VycnkoKGJ3ZCwgZndkKSA9PiAoRiwgeGkyeUYsIHgsIGkpID0+ICgwLEYubWFwKShmd2QsIHhpMnlGKGJ3ZCh4KSwgaSkpKVxuXG4vLyBJc29tb3JwaGlzbXMgYW5kIGNvbWJpbmF0b3JzXG5cbmV4cG9ydCBjb25zdCBpZGVudGl0eSA9IChfRiwgeGkyeUYsIHgsIGkpID0+IHhpMnlGKHgsIGkpXG5cbmV4cG9ydCBjb25zdCBpbnZlcnNlID0gaXNvID0+IChGLCB4aTJ5RiwgeCwgaSkgPT5cbiAgKDAsRi5tYXApKHggPT4gZ2V0VShpc28sIHgpLCB4aTJ5RihzZXRVKGlzbywgeCksIGkpKVxuIl19
