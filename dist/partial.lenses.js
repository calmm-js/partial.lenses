(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.L = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.inverse = exports.identity = exports.iso = exports.getInverse = exports.replace = exports.pick = exports.just = exports.to = exports.orElse = exports.valueOr = exports.prop = exports.slice = exports.index = exports.find = exports.filter = exports.append = exports.rewrite = exports.normalize = exports.define = exports.required = exports.defaults = exports.augment = exports.lens = exports.get = exports.sum = exports.product = exports.minimum = exports.maximum = exports.foldr = exports.foldl = exports.collect = exports.collectAs = exports.merge = exports.mergeAs = exports.concat = exports.concatAs = exports.optional = exports.when = exports.choose = exports.choice = exports.chain = exports.set = exports.remove = exports.modify = undefined;
exports.toFunction = toFunction;
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
  return void 0 === i ? d : Math.min(Math.max(m, i < 0 ? l + i : i), l);
};

function pair(x0, x1) {
  return [x0, x1];
}
var rpair = function rpair(xs) {
  return function (x) {
    return [x, xs];
  };
};

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

function Join(l, r) {
  this.l = l;this.r = r;
}

var isJoin = function isJoin(n) {
  return n.constructor === Join;
};

var join = function join(r, l) {
  return void 0 !== l ? void 0 !== r ? new Join(l, r) : l : r;
};

var rjoin = function rjoin(t) {
  return function (h) {
    return join(t, h);
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

var Collect = TacnocOf(void 0, join);

//

function traversePartialIndex(A, xi2yA, xs) {
  var ap = A.ap,
      map = A.map;
  if ("dev" !== "production") reqApplicative(A);
  var xsA = (0, A.of)(void 0),
      i = xs.length;
  while (i--) {
    xsA = ap(map(rjoin, xsA), xi2yA(xs[i], i));
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
  if ("dev" !== "production" && i < 0) throw new Error("partial.lenses: Negative indices are not supported by `index`.");
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

function reqOptic(o) {
  if (!((0, _infestines.isFunction)(o) && o.length === 4)) throw new Error("partial.lenses: Expecting an optic.");
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
      return modifyComposed(o, 0, s, x);
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

function modifyComposed(os, xi2y, x, y) {
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
    if ("dev" !== "production" && !(void 0 === value || value instanceof Object)) throw new Error("partial.lenses: `pick` must be set with undefined or an object");
    for (var k in template) {
      x = setU(template[k], value && value[k], x);
    }return x;
  };
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
  };
};

var branchOn = function branchOn(keys, vals) {
  return function (A, xi2yA, x, _) {
    if ("dev" !== "production") reqApplicative(A);
    var of = A.of;
    var i = keys.length;
    if (!i) return of(object0ToUndefined(x));
    if (!(x instanceof Object)) x = _infestines.object0;
    var ap = A.ap,
        map = A.map;
    var xsA = of(0);
    while (i--) {
      var k = keys[i],
          v = x[k];
      xsA = ap(map(rpair, xsA), vals ? vals[i](A, xi2yA, v, k) : xi2yA(v, k));
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
  if (!(0, _infestines.isString)(x)) throw new Error("partial.lenses: `prop` expects a string.");
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvcGFydGlhbC5sZW5zZXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7UUM4WGdCLFUsR0FBQSxVO1FBc0NBLE8sR0FBQSxPO1FBK0JBLEksR0FBQSxJO1FBT0EsSSxHQUFBLEk7UUFRQSxHLEdBQUEsRztRQStDQSxNLEdBQUEsTTtRQVdBLEssR0FBQSxLO1FBWUEsTSxHQUFBLE07UUEyR0EsUSxHQUFBLFE7UUEyQ0EsSyxHQUFBLEs7O0FBOXFCaEI7O0FBbUJBOztBQUVBLElBQU0sYUFBYSxTQUFiLFVBQWEsQ0FBQyxDQUFELEVBQUksQ0FBSixFQUFPLENBQVAsRUFBVSxDQUFWO0FBQUEsU0FDakIsS0FBSyxDQUFMLEtBQVcsQ0FBWCxHQUFlLENBQWYsR0FBbUIsS0FBSyxHQUFMLENBQVMsS0FBSyxHQUFMLENBQVMsQ0FBVCxFQUFZLElBQUksQ0FBSixHQUFRLElBQUksQ0FBWixHQUFnQixDQUE1QixDQUFULEVBQXlDLENBQXpDLENBREY7QUFBQSxDQUFuQjs7QUFHQSxTQUFTLElBQVQsQ0FBYyxFQUFkLEVBQWtCLEVBQWxCLEVBQXNCO0FBQUMsU0FBTyxDQUFDLEVBQUQsRUFBSyxFQUFMLENBQVA7QUFBZ0I7QUFDdkMsSUFBTSxRQUFRLFNBQVIsS0FBUTtBQUFBLFNBQU07QUFBQSxXQUFLLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBTDtBQUFBLEdBQU47QUFBQSxDQUFkOztBQUVBLElBQU0sT0FBTyxTQUFQLElBQU87QUFBQSxTQUFPLFVBQUMsQ0FBRCxFQUFJLENBQUo7QUFBQSxXQUFVLElBQUksQ0FBSixFQUFPLENBQVAsQ0FBVjtBQUFBLEdBQVA7QUFBQSxDQUFiOztBQUVBLElBQU0sT0FBTyxTQUFQLElBQU87QUFBQSxTQUFLO0FBQUEsV0FBSyxLQUFLLENBQUwsS0FBVyxDQUFYLEdBQWUsQ0FBZixHQUFtQixDQUF4QjtBQUFBLEdBQUw7QUFBQSxD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QUFBQSxXQUM1QixDQUFDLEdBQUUsRUFBRSxHQUFMLEVBQVU7QUFBQSxhQUFLLEtBQUssR0FBTCxFQUFVLENBQVYsQ0FBTDtBQUFBLEtBQVYsRUFBNkIsTUFBTSxLQUFLLEdBQUwsRUFBVSxDQUFWLENBQU4sRUFBb0IsQ0FBcEIsQ0FBN0IsQ0FENEI7QUFBQSxHQUFQO0FBQUEsQ0FBaEIiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IHtcbiAgYWN5Y2xpY0VxdWFsc1UsXG4gIGFsd2F5cyxcbiAgYXBwbHlVLFxuICBhcml0eU4sXG4gIGFzc29jUGFydGlhbFUsXG4gIGN1cnJ5LFxuICBjdXJyeU4sXG4gIGRpc3NvY1BhcnRpYWxVLFxuICBpZCxcbiAgaXNEZWZpbmVkLFxuICBpc0Z1bmN0aW9uLFxuICBpc09iamVjdCxcbiAgaXNTdHJpbmcsXG4gIGtleXMsXG4gIG9iamVjdDAsXG4gIHNuZFVcbn0gZnJvbSBcImluZmVzdGluZXNcIlxuXG4vL1xuXG5jb25zdCBzbGljZUluZGV4ID0gKG0sIGwsIGQsIGkpID0+XG4gIHZvaWQgMCA9PT0gaSA/IGQgOiBNYXRoLm1pbihNYXRoLm1heChtLCBpIDwgMCA/IGwgKyBpIDogaSksIGwpXG5cbmZ1bmN0aW9uIHBhaXIoeDAsIHgxKSB7cmV0dXJuIFt4MCwgeDFdfVxuY29uc3QgcnBhaXIgPSB4cyA9PiB4ID0+IFt4LCB4c11cblxuY29uc3QgZmxpcCA9IGJvcCA9PiAoeCwgeSkgPT4gYm9wKHksIHgpXG5cbmNvbnN0IHVudG8gPSBjID0+IHggPT4gdm9pZCAwICE9PSB4ID8geCA6IGNcblxuY29uc3Qgc2VlbXNBcnJheUxpa2UgPSB4ID0+XG4gIHggaW5zdGFuY2VvZiBPYmplY3QgJiYgKHggPSB4Lmxlbmd0aCwgeCA9PT0gKHggPj4gMCkgJiYgMCA8PSB4KSB8fFxuICBpc1N0cmluZyh4KVxuXG4vL1xuXG5mdW5jdGlvbiBtYXBQYXJ0aWFsSW5kZXhVKHhpMnksIHhzKSB7XG4gIGNvbnN0IG4gPSB4cy5sZW5ndGgsIHlzID0gQXJyYXkobilcbiAgbGV0IGogPSAwXG4gIGZvciAobGV0IGk9MCwgeTsgaTxuOyArK2kpXG4gICAgaWYgKHZvaWQgMCAhPT0gKHkgPSB4aTJ5KHhzW2ldLCBpKSkpXG4gICAgICB5c1tqKytdID0geVxuICBpZiAoaikge1xuICAgIGlmIChqIDwgbilcbiAgICAgIHlzLmxlbmd0aCA9IGpcbiAgICByZXR1cm4geXNcbiAgfVxufVxuXG5mdW5jdGlvbiBjb3B5VG9Gcm9tKHlzLCBrLCB4cywgaSwgaikge1xuICB3aGlsZSAoaSA8IGopXG4gICAgeXNbaysrXSA9IHhzW2krK11cbiAgcmV0dXJuIHlzXG59XG5cbi8vXG5cbmNvbnN0IEFwcGxpY2F0aXZlID0gKG1hcCwgb2YsIGFwKSA9PiAoe21hcCwgb2YsIGFwfSlcblxuY29uc3QgSWRlbnQgPSBBcHBsaWNhdGl2ZShhcHBseVUsIGlkLCBhcHBseVUpXG5cbmNvbnN0IENvbnN0ID0ge21hcDogc25kVX1cblxuY29uc3QgVGFjbm9jT2YgPSAoZW1wdHksIHRhY25vYykgPT4gQXBwbGljYXRpdmUoc25kVSwgYWx3YXlzKGVtcHR5KSwgdGFjbm9jKVxuXG5jb25zdCBNb25vaWQgPSAoZW1wdHksIGNvbmNhdCkgPT4gKHtlbXB0eTogKCkgPT4gZW1wdHksIGNvbmNhdH0pXG5cbmNvbnN0IE11bSA9IG9yZCA9PlxuICBNb25vaWQodm9pZCAwLCAoeSwgeCkgPT4gdm9pZCAwICE9PSB4ICYmICh2b2lkIDAgPT09IHkgfHwgb3JkKHgsIHkpKSA/IHggOiB5KVxuXG4vL1xuXG5jb25zdCBydW4gPSAobywgQywgeGkyeUMsIHMsIGkpID0+IHRvRnVuY3Rpb24obykoQywgeGkyeUMsIHMsIGkpXG5cbmNvbnN0IGNvbnN0QXMgPSB0b0NvbnN0ID0+IGN1cnJ5Tig0LCAoeE1pMnksIG0pID0+IHtcbiAgY29uc3QgQyA9IHRvQ29uc3QobSlcbiAgcmV0dXJuICh0LCBzKSA9PiBydW4odCwgQywgeE1pMnksIHMpXG59KVxuXG4vL1xuXG5mdW5jdGlvbiByZXFBcHBsaWNhdGl2ZShmKSB7XG4gIGlmICghZi5vZilcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJwYXJ0aWFsLmxlbnNlczogVHJhdmVyc2FscyByZXF1aXJlIGFuIGFwcGxpY2F0aXZlLlwiKVxufVxuXG4vL1xuXG5mdW5jdGlvbiBKb2luKGwsIHIpIHt0aGlzLmwgPSBsOyB0aGlzLnIgPSByfVxuXG5jb25zdCBpc0pvaW4gPSBuID0+IG4uY29uc3RydWN0b3IgPT09IEpvaW5cblxuY29uc3Qgam9pbiA9IChyLCBsKSA9PiB2b2lkIDAgIT09IGwgPyB2b2lkIDAgIT09IHIgPyBuZXcgSm9pbihsLCByKSA6IGwgOiByXG5cbmNvbnN0IHJqb2luID0gdCA9PiBoID0+IGpvaW4odCwgaClcblxuZnVuY3Rpb24gcHVzaFRvKG4sIHlzKSB7XG4gIHdoaWxlIChuICYmIGlzSm9pbihuKSkge1xuICAgIGNvbnN0IGwgPSBuLmxcbiAgICBuID0gbi5yXG4gICAgaWYgKGwgJiYgaXNKb2luKGwpKSB7XG4gICAgICBwdXNoVG8obC5sLCB5cylcbiAgICAgIHB1c2hUbyhsLnIsIHlzKVxuICAgIH0gZWxzZSB7XG4gICAgICB5cy5wdXNoKGwpXG4gICAgfVxuICB9XG4gIHlzLnB1c2gobilcbn1cblxuZnVuY3Rpb24gdG9BcnJheShuKSB7XG4gIGlmICh2b2lkIDAgIT09IG4pIHtcbiAgICBjb25zdCB5cyA9IFtdXG4gICAgcHVzaFRvKG4sIHlzKVxuICAgIHJldHVybiB5c1xuICB9XG59XG5cbmZ1bmN0aW9uIGZvbGRSZWMoZiwgciwgbikge1xuICB3aGlsZSAoaXNKb2luKG4pKSB7XG4gICAgY29uc3QgbCA9IG4ubFxuICAgIG4gPSBuLnJcbiAgICByID0gaXNKb2luKGwpXG4gICAgICA/IGZvbGRSZWMoZiwgZm9sZFJlYyhmLCByLCBsLmwpLCBsLnIpXG4gICAgICA6IGYociwgbFswXSwgbFsxXSlcbiAgfVxuICByZXR1cm4gZihyLCBuWzBdLCBuWzFdKVxufVxuXG5jb25zdCBmb2xkID0gKGYsIHIsIG4pID0+IHZvaWQgMCAhPT0gbiA/IGZvbGRSZWMoZiwgciwgbikgOiByXG5cbmNvbnN0IENvbGxlY3QgPSBUYWNub2NPZih2b2lkIDAsIGpvaW4pXG5cbi8vXG5cbmZ1bmN0aW9uIHRyYXZlcnNlUGFydGlhbEluZGV4KEEsIHhpMnlBLCB4cykge1xuICBjb25zdCBhcCA9IEEuYXAsIG1hcCA9IEEubWFwXG4gIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpXG4gICAgcmVxQXBwbGljYXRpdmUoQSlcbiAgbGV0IHhzQSA9ICgwLEEub2YpKHZvaWQgMCksIGkgPSB4cy5sZW5ndGhcbiAgd2hpbGUgKGktLSlcbiAgICB4c0EgPSBhcChtYXAocmpvaW4sIHhzQSksIHhpMnlBKHhzW2ldLCBpKSlcbiAgcmV0dXJuIG1hcCh0b0FycmF5LCB4c0EpXG59XG5cbi8vXG5cbmZ1bmN0aW9uIG9iamVjdDBUb1VuZGVmaW5lZChvKSB7XG4gIGlmICghKG8gaW5zdGFuY2VvZiBPYmplY3QpKVxuICAgIHJldHVybiBvXG4gIGZvciAoY29uc3QgayBpbiBvKVxuICAgIHJldHVybiBvXG59XG5cbi8vXG5cbmNvbnN0IGxlbnNGcm9tID0gKGdldCwgc2V0KSA9PiBpID0+IChGLCB4aTJ5RiwgeCwgXykgPT5cbiAgKDAsRi5tYXApKHYgPT4gc2V0KGksIHYsIHgpLCB4aTJ5RihnZXQoaSwgeCksIGkpKVxuXG4vL1xuXG5jb25zdCBnZXRQcm9wID0gKGssIG8pID0+IG8gaW5zdGFuY2VvZiBPYmplY3QgPyBvW2tdIDogdm9pZCAwXG5cbmNvbnN0IHNldFByb3AgPSAoaywgdiwgbykgPT5cbiAgdm9pZCAwICE9PSB2ID8gYXNzb2NQYXJ0aWFsVShrLCB2LCBvKSA6IGRpc3NvY1BhcnRpYWxVKGssIG8pXG5cbmNvbnN0IGZ1blByb3AgPSBsZW5zRnJvbShnZXRQcm9wLCBzZXRQcm9wKVxuXG4vL1xuXG5jb25zdCBnZXRJbmRleCA9IChpLCB4cykgPT4gc2VlbXNBcnJheUxpa2UoeHMpID8geHNbaV0gOiB2b2lkIDBcblxuZnVuY3Rpb24gc2V0SW5kZXgoaSwgeCwgeHMpIHtcbiAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIiAmJiBpIDwgMClcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJwYXJ0aWFsLmxlbnNlczogTmVnYXRpdmUgaW5kaWNlcyBhcmUgbm90IHN1cHBvcnRlZCBieSBgaW5kZXhgLlwiKVxuICBpZiAoIXNlZW1zQXJyYXlMaWtlKHhzKSlcbiAgICB4cyA9IFwiXCJcbiAgY29uc3QgbiA9IHhzLmxlbmd0aFxuICBpZiAodm9pZCAwICE9PSB4KSB7XG4gICAgY29uc3QgbSA9IE1hdGgubWF4KGkrMSwgbiksIHlzID0gQXJyYXkobSlcbiAgICBmb3IgKGxldCBqPTA7IGo8bTsgKytqKVxuICAgICAgeXNbal0gPSB4c1tqXVxuICAgIHlzW2ldID0geFxuICAgIHJldHVybiB5c1xuICB9IGVsc2Uge1xuICAgIGlmICgwIDwgbikge1xuICAgICAgaWYgKG4gPD0gaSlcbiAgICAgICAgcmV0dXJuIGNvcHlUb0Zyb20oQXJyYXkobiksIDAsIHhzLCAwLCBuKVxuICAgICAgaWYgKDEgPCBuKSB7XG4gICAgICAgIGNvbnN0IHlzID0gQXJyYXkobi0xKVxuICAgICAgICBmb3IgKGxldCBqPTA7IGo8aTsgKytqKVxuICAgICAgICAgIHlzW2pdID0geHNbal1cbiAgICAgICAgZm9yIChsZXQgaj1pKzE7IGo8bjsgKytqKVxuICAgICAgICAgIHlzW2otMV0gPSB4c1tqXVxuICAgICAgICByZXR1cm4geXNcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuY29uc3QgZnVuSW5kZXggPSBsZW5zRnJvbShnZXRJbmRleCwgc2V0SW5kZXgpXG5cbi8vXG5cbmZ1bmN0aW9uIHJlcU9wdGljKG8pIHtcbiAgaWYgKCEoaXNGdW5jdGlvbihvKSAmJiBvLmxlbmd0aCA9PT0gNCkpXG4gICAgdGhyb3cgbmV3IEVycm9yKFwicGFydGlhbC5sZW5zZXM6IEV4cGVjdGluZyBhbiBvcHRpYy5cIilcbn1cblxuY29uc3QgY2xvc2UgPSAobywgRiwgeGkyeUYpID0+ICh4LCBpKSA9PiBvKEYsIHhpMnlGLCB4LCBpKVxuXG5mdW5jdGlvbiBjb21wb3NlZChvaTAsIG9zKSB7XG4gIHN3aXRjaCAob3MubGVuZ3RoIC0gb2kwKSB7XG4gICAgY2FzZSAwOiAgcmV0dXJuIGlkZW50aXR5XG4gICAgY2FzZSAxOiAgcmV0dXJuIHRvRnVuY3Rpb24ob3Nbb2kwXSlcbiAgICBkZWZhdWx0OiByZXR1cm4gKEYsIHhpMnlGLCB4LCBpKSA9PiB7XG4gICAgICBsZXQgbiA9IG9zLmxlbmd0aFxuICAgICAgeGkyeUYgPSBjbG9zZSh0b0Z1bmN0aW9uKG9zWy0tbl0pLCBGLCB4aTJ5RilcbiAgICAgIHdoaWxlIChvaTAgPCAtLW4pXG4gICAgICAgIHhpMnlGID0gY2xvc2UodG9GdW5jdGlvbihvc1tuXSksIEYsIHhpMnlGKVxuICAgICAgcmV0dXJuIHJ1bihvc1tvaTBdLCBGLCB4aTJ5RiwgeCwgaSlcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gc2V0VShvLCB4LCBzKSB7XG4gIHN3aXRjaCAodHlwZW9mIG8pIHtcbiAgICBjYXNlIFwic3RyaW5nXCI6XG4gICAgICByZXR1cm4gc2V0UHJvcChvLCB4LCBzKVxuICAgIGNhc2UgXCJudW1iZXJcIjpcbiAgICAgIHJldHVybiBzZXRJbmRleChvLCB4LCBzKVxuICAgIGNhc2UgXCJmdW5jdGlvblwiOlxuICAgICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIilcbiAgICAgICAgcmVxT3B0aWMobylcbiAgICAgIHJldHVybiBvKElkZW50LCBhbHdheXMoeCksIHMsIHZvaWQgMClcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIG1vZGlmeUNvbXBvc2VkKG8sIDAsIHMsIHgpXG4gIH1cbn1cblxuZnVuY3Rpb24gZ2V0VShsLCBzKSB7XG4gIHN3aXRjaCAodHlwZW9mIGwpIHtcbiAgICBjYXNlIFwic3RyaW5nXCI6XG4gICAgICByZXR1cm4gZ2V0UHJvcChsLCBzKVxuICAgIGNhc2UgXCJudW1iZXJcIjpcbiAgICAgIHJldHVybiBnZXRJbmRleChsLCBzKVxuICAgIGNhc2UgXCJvYmplY3RcIjpcbiAgICAgIGZvciAobGV0IGk9MCwgbj1sLmxlbmd0aCwgbzsgaTxuOyArK2kpXG4gICAgICAgIHN3aXRjaCAodHlwZW9mIChvID0gbFtpXSkpIHtcbiAgICAgICAgICBjYXNlIFwic3RyaW5nXCI6IHMgPSBnZXRQcm9wKG8sIHMpOyBicmVha1xuICAgICAgICAgIGNhc2UgXCJudW1iZXJcIjogcyA9IGdldEluZGV4KG8sIHMpOyBicmVha1xuICAgICAgICAgIGRlZmF1bHQ6IHMgPSBnZXRVKG8sIHMpOyBicmVha1xuICAgICAgICB9XG4gICAgICByZXR1cm4gc1xuICAgIGRlZmF1bHQ6XG4gICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKVxuICAgICAgICByZXFPcHRpYyhsKVxuICAgICAgcmV0dXJuIGwoQ29uc3QsIGlkLCBzLCB2b2lkIDApXG4gIH1cbn1cblxuZnVuY3Rpb24gbW9kaWZ5Q29tcG9zZWQob3MsIHhpMnksIHgsIHkpIHtcbiAgbGV0IG4gPSBvcy5sZW5ndGhcbiAgY29uc3QgeHMgPSBBcnJheShuKVxuICBmb3IgKGxldCBpPTAsIG87IGk8bjsgKytpKSB7XG4gICAgeHNbaV0gPSB4XG4gICAgc3dpdGNoICh0eXBlb2YgKG8gPSBvc1tpXSkpIHtcbiAgICAgIGNhc2UgXCJzdHJpbmdcIjpcbiAgICAgICAgeCA9IGdldFByb3AobywgeClcbiAgICAgICAgYnJlYWtcbiAgICAgIGNhc2UgXCJudW1iZXJcIjpcbiAgICAgICAgeCA9IGdldEluZGV4KG8sIHgpXG4gICAgICAgIGJyZWFrXG4gICAgICBkZWZhdWx0OlxuICAgICAgICB4ID0gY29tcG9zZWQoaSwgb3MpKElkZW50LCB4aTJ5IHx8IGFsd2F5cyh5KSwgeCwgb3NbaS0xXSlcbiAgICAgICAgbiA9IGlcbiAgICAgICAgYnJlYWtcbiAgICB9XG4gIH1cbiAgaWYgKG4gPT09IG9zLmxlbmd0aClcbiAgICB4ID0geGkyeSA/IHhpMnkoeCwgb3Nbbi0xXSkgOiB5XG4gIGZvciAobGV0IG87IDAgPD0gLS1uOylcbiAgICB4ID0gaXNTdHJpbmcobyA9IG9zW25dKVxuICAgICAgICA/IHNldFByb3AobywgeCwgeHNbbl0pXG4gICAgICAgIDogc2V0SW5kZXgobywgeCwgeHNbbl0pXG4gIHJldHVybiB4XG59XG5cbi8vXG5cbmZ1bmN0aW9uIGdldFBpY2sodGVtcGxhdGUsIHgpIHtcbiAgbGV0IHJcbiAgZm9yIChjb25zdCBrIGluIHRlbXBsYXRlKSB7XG4gICAgY29uc3QgdiA9IGdldFUodGVtcGxhdGVba10sIHgpXG4gICAgaWYgKHZvaWQgMCAhPT0gdikge1xuICAgICAgaWYgKCFyKVxuICAgICAgICByID0ge31cbiAgICAgIHJba10gPSB2XG4gICAgfVxuICB9XG4gIHJldHVybiByXG59XG5cbmNvbnN0IHNldFBpY2sgPSAodGVtcGxhdGUsIHgpID0+IHZhbHVlID0+IHtcbiAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIiAmJlxuICAgICAgISh2b2lkIDAgPT09IHZhbHVlIHx8IHZhbHVlIGluc3RhbmNlb2YgT2JqZWN0KSlcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJwYXJ0aWFsLmxlbnNlczogYHBpY2tgIG11c3QgYmUgc2V0IHdpdGggdW5kZWZpbmVkIG9yIGFuIG9iamVjdFwiKVxuICBmb3IgKGNvbnN0IGsgaW4gdGVtcGxhdGUpXG4gICAgeCA9IHNldFUodGVtcGxhdGVba10sIHZhbHVlICYmIHZhbHVlW2tdLCB4KVxuICByZXR1cm4geFxufVxuXG4vL1xuXG5jb25zdCBicmFuY2hPbk1lcmdlID0gKHgsIGtleXMpID0+IHhzID0+IHtcbiAgY29uc3QgbyA9IHt9LCBuID0ga2V5cy5sZW5ndGhcbiAgZm9yIChsZXQgaT0wOyBpPG47ICsraSwgeHM9eHNbMV0pIHtcbiAgICBjb25zdCB2ID0geHNbMF1cbiAgICBvW2tleXNbaV1dID0gdm9pZCAwICE9PSB2ID8gdiA6IG9cbiAgfVxuICBsZXQgclxuICBpZiAoeC5jb25zdHJ1Y3RvciAhPT0gT2JqZWN0KVxuICAgIHggPSBPYmplY3QuYXNzaWduKHt9LCB4KVxuICBmb3IgKGNvbnN0IGsgaW4geCkge1xuICAgIGNvbnN0IHYgPSBvW2tdXG4gICAgaWYgKG8gIT09IHYpIHtcbiAgICAgIG9ba10gPSBvXG4gICAgICBpZiAoIXIpXG4gICAgICAgIHIgPSB7fVxuICAgICAgcltrXSA9IHZvaWQgMCAhPT0gdiA/IHYgOiB4W2tdXG4gICAgfVxuICB9XG4gIGZvciAobGV0IGk9MDsgaTxuOyArK2kpIHtcbiAgICBjb25zdCBrID0ga2V5c1tpXVxuICAgIGNvbnN0IHYgPSBvW2tdXG4gICAgaWYgKG8gIT09IHYpIHtcbiAgICAgIGlmICghcilcbiAgICAgICAgciA9IHt9XG4gICAgICByW2tdID0gdlxuICAgIH1cbiAgfVxuICByZXR1cm4gclxufVxuXG5jb25zdCBicmFuY2hPbiA9IChrZXlzLCB2YWxzKSA9PiAoQSwgeGkyeUEsIHgsIF8pID0+IHtcbiAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIilcbiAgICByZXFBcHBsaWNhdGl2ZShBKVxuICBjb25zdCBvZiA9IEEub2ZcbiAgbGV0IGkgPSBrZXlzLmxlbmd0aFxuICBpZiAoIWkpXG4gICAgcmV0dXJuIG9mKG9iamVjdDBUb1VuZGVmaW5lZCh4KSlcbiAgaWYgKCEoeCBpbnN0YW5jZW9mIE9iamVjdCkpXG4gICAgeCA9IG9iamVjdDBcbiAgY29uc3QgYXAgPSBBLmFwLCBtYXAgPSBBLm1hcFxuICBsZXQgeHNBID0gb2YoMClcbiAgd2hpbGUgKGktLSkge1xuICAgIGNvbnN0IGsgPSBrZXlzW2ldLCB2ID0geFtrXVxuICAgIHhzQSA9IGFwKG1hcChycGFpciwgeHNBKSwgdmFscyA/IHZhbHNbaV0oQSwgeGkyeUEsIHYsIGspIDogeGkyeUEodiwgaykpXG4gIH1cbiAgcmV0dXJuIG1hcChicmFuY2hPbk1lcmdlKHgsIGtleXMpLCB4c0EpXG59XG5cbmNvbnN0IG5vcm1hbGl6ZXIgPSB4aTJ4ID0+IChGLCB4aTJ5RiwgeCwgaSkgPT5cbiAgKDAsRi5tYXApKHggPT4geGkyeCh4LCBpKSwgeGkyeUYoeGkyeCh4LCBpKSwgaSkpXG5cbmNvbnN0IHJlcGxhY2VkID0gKGlubiwgb3V0LCB4KSA9PiBhY3ljbGljRXF1YWxzVSh4LCBpbm4pID8gb3V0IDogeFxuXG5mdW5jdGlvbiBmaW5kSW5kZXgoeGkyYiwgeHMpIHtcbiAgZm9yIChsZXQgaT0wLCBuPXhzLmxlbmd0aDsgaTxuOyArK2kpXG4gICAgaWYgKHhpMmIoeHNbaV0sIGkpKVxuICAgICAgcmV0dXJuIGlcbiAgcmV0dXJuIC0xXG59XG5cbmZ1bmN0aW9uIHBhcnRpdGlvbkludG9JbmRleCh4aTJiLCB4cywgdHMsIGZzKSB7XG4gIGZvciAobGV0IGk9MCwgbj14cy5sZW5ndGgsIHg7IGk8bjsgKytpKVxuICAgICh4aTJiKHggPSB4c1tpXSwgaSkgPyB0cyA6IGZzKS5wdXNoKHgpXG59XG5cbi8vXG5cbmV4cG9ydCBmdW5jdGlvbiB0b0Z1bmN0aW9uKG8pIHtcbiAgc3dpdGNoICh0eXBlb2Ygbykge1xuICAgIGNhc2UgXCJzdHJpbmdcIjpcbiAgICAgIHJldHVybiBmdW5Qcm9wKG8pXG4gICAgY2FzZSBcIm51bWJlclwiOlxuICAgICAgcmV0dXJuIGZ1bkluZGV4KG8pXG4gICAgY2FzZSBcImZ1bmN0aW9uXCI6XG4gICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKVxuICAgICAgICByZXFPcHRpYyhvKVxuICAgICAgcmV0dXJuIG9cbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIGNvbXBvc2VkKDAsIG8pXG4gIH1cbn1cblxuLy8gT3BlcmF0aW9ucyBvbiBvcHRpY3NcblxuZXhwb3J0IGNvbnN0IG1vZGlmeSA9IGN1cnJ5KChvLCB4aTJ4LCBzKSA9PiB7XG4gIHN3aXRjaCAodHlwZW9mIG8pIHtcbiAgICBjYXNlIFwic3RyaW5nXCI6XG4gICAgICByZXR1cm4gc2V0UHJvcChvLCB4aTJ4KGdldFByb3AobywgcyksIG8pLCBzKVxuICAgIGNhc2UgXCJudW1iZXJcIjpcbiAgICAgIHJldHVybiBzZXRJbmRleChvLCB4aTJ4KGdldEluZGV4KG8sIHMpLCBvKSwgcylcbiAgICBjYXNlIFwiZnVuY3Rpb25cIjpcbiAgICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpXG4gICAgICAgIHJlcU9wdGljKG8pXG4gICAgICByZXR1cm4gbyhJZGVudCwgeGkyeCwgcywgdm9pZCAwKVxuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gbW9kaWZ5Q29tcG9zZWQobywgeGkyeCwgcylcbiAgfVxufSlcblxuZXhwb3J0IGNvbnN0IHJlbW92ZSA9IGN1cnJ5KChvLCBzKSA9PiBzZXRVKG8sIHZvaWQgMCwgcykpXG5cbmV4cG9ydCBjb25zdCBzZXQgPSBjdXJyeShzZXRVKVxuXG4vLyBOZXN0aW5nXG5cbmV4cG9ydCBmdW5jdGlvbiBjb21wb3NlKCkge1xuICBzd2l0Y2ggKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICBjYXNlIDA6IHJldHVybiBpZGVudGl0eVxuICAgIGNhc2UgMTogcmV0dXJuIGFyZ3VtZW50c1swXVxuICAgIGRlZmF1bHQ6IHtcbiAgICAgIGNvbnN0IG4gPSBhcmd1bWVudHMubGVuZ3RoLCBsZW5zZXMgPSBBcnJheShuKVxuICAgICAgZm9yIChsZXQgaT0wOyBpPG47ICsraSlcbiAgICAgICAgbGVuc2VzW2ldID0gYXJndW1lbnRzW2ldXG4gICAgICByZXR1cm4gbGVuc2VzXG4gICAgfVxuICB9XG59XG5cbi8vIFF1ZXJ5aW5nXG5cbmV4cG9ydCBjb25zdCBjaGFpbiA9IGN1cnJ5KCh4aTJ5TywgeE8pID0+XG4gIFt4TywgY2hvb3NlKCh4TSwgaSkgPT4gdm9pZCAwICE9PSB4TSA/IHhpMnlPKHhNLCBpKSA6IHplcm8pXSlcblxuZXhwb3J0IGNvbnN0IGNob2ljZSA9ICguLi5scykgPT4gY2hvb3NlKHggPT4ge1xuICBjb25zdCBpID0gZmluZEluZGV4KGwgPT4gdm9pZCAwICE9PSBnZXRVKGwsIHgpLCBscylcbiAgcmV0dXJuIGkgPCAwID8gemVybyA6IGxzW2ldXG59KVxuXG5leHBvcnQgY29uc3QgY2hvb3NlID0geGlNMm8gPT4gKEMsIHhpMnlDLCB4LCBpKSA9PlxuICBydW4oeGlNMm8oeCwgaSksIEMsIHhpMnlDLCB4LCBpKVxuXG5leHBvcnQgY29uc3Qgd2hlbiA9IHAgPT4gKEMsIHhpMnlDLCB4LCBpKSA9PlxuICBwKHgsIGkpID8geGkyeUMoeCwgaSkgOiB6ZXJvKEMsIHhpMnlDLCB4LCBpKVxuXG5leHBvcnQgY29uc3Qgb3B0aW9uYWwgPSB3aGVuKGlzRGVmaW5lZClcblxuZXhwb3J0IGZ1bmN0aW9uIHplcm8oQywgeGkyeUMsIHgsIGkpIHtcbiAgY29uc3Qgb2YgPSBDLm9mXG4gIHJldHVybiBvZiA/IG9mKHgpIDogKDAsQy5tYXApKGFsd2F5cyh4KSwgeGkyeUModm9pZCAwLCBpKSlcbn1cblxuLy8gUmVjdXJzaW5nXG5cbmV4cG9ydCBmdW5jdGlvbiBsYXp5KG8ybykge1xuICBsZXQgbWVtbyA9IChDLCB4aTJ5QywgeCwgaSkgPT4gKG1lbW8gPSB0b0Z1bmN0aW9uKG8ybyhyZWMpKSkoQywgeGkyeUMsIHgsIGkpXG4gIGZ1bmN0aW9uIHJlYyhDLCB4aTJ5QywgeCwgaSkge3JldHVybiBtZW1vKEMsIHhpMnlDLCB4LCBpKX1cbiAgcmV0dXJuIHJlY1xufVxuXG4vLyBEZWJ1Z2dpbmdcblxuZXhwb3J0IGZ1bmN0aW9uIGxvZygpIHtcbiAgY29uc3Qgc2hvdyA9IGRpciA9PiB4ID0+XG4gICAgY29uc29sZS5sb2cuYXBwbHkoY29uc29sZSxcbiAgICAgICAgICAgICAgICAgICAgICBjb3B5VG9Gcm9tKFtdLCAwLCBhcmd1bWVudHMsIDAsIGFyZ3VtZW50cy5sZW5ndGgpXG4gICAgICAgICAgICAgICAgICAgICAgLmNvbmNhdChbZGlyLCB4XSkpIHx8IHhcbiAgcmV0dXJuIGlzbyhzaG93KFwiZ2V0XCIpLCBzaG93KFwic2V0XCIpKVxufVxuXG4vLyBPcGVyYXRpb25zIG9uIHRyYXZlcnNhbHNcblxuZXhwb3J0IGNvbnN0IGNvbmNhdEFzID0gY29uc3RBcyhtID0+IFRhY25vY09mKCgwLG0uZW1wdHkpKCksIGZsaXAobS5jb25jYXQpKSlcblxuZXhwb3J0IGNvbnN0IGNvbmNhdCA9IGNvbmNhdEFzKGlkKVxuXG5leHBvcnQgY29uc3QgbWVyZ2VBcyA9IGNvbnN0QXMobSA9PiBUYWNub2NPZigoMCxtLmVtcHR5KSgpLCBtLmNvbmNhdCkpXG5cbmV4cG9ydCBjb25zdCBtZXJnZSA9IG1lcmdlQXMoaWQpXG5cbi8vIEZvbGRzIG92ZXIgdHJhdmVyc2Fsc1xuXG5leHBvcnQgY29uc3QgY29sbGVjdEFzID0gY3VycnkoKHhpMnksIHQsIHMpID0+XG4gIHRvQXJyYXkocnVuKHQsIENvbGxlY3QsIHhpMnksIHMpKSB8fCBbXSlcblxuZXhwb3J0IGNvbnN0IGNvbGxlY3QgPSBjb2xsZWN0QXMoaWQpXG5cbmV4cG9ydCBjb25zdCBmb2xkbCA9IGN1cnJ5KChmLCByLCB0LCBzKSA9PlxuICBmb2xkKGYsIHIsIHJ1bih0LCBDb2xsZWN0LCBwYWlyLCBzKSkpXG5cbmV4cG9ydCBjb25zdCBmb2xkciA9IGN1cnJ5KChmLCByLCB0LCBzKSA9PiB7XG4gIGNvbnN0IHhzID0gY29sbGVjdEFzKHBhaXIsIHQsIHMpXG4gIGZvciAobGV0IGk9eHMubGVuZ3RoLTE7IDA8PWk7IC0taSkge1xuICAgIGNvbnN0IHggPSB4c1tpXVxuICAgIHIgPSBmKHIsIHhbMF0sIHhbMV0pXG4gIH1cbiAgcmV0dXJuIHJcbn0pXG5cbmV4cG9ydCBjb25zdCBtYXhpbXVtID0gbWVyZ2UoTXVtKCh4LCB5KSA9PiB4ID4geSkpXG5cbmV4cG9ydCBjb25zdCBtaW5pbXVtID0gbWVyZ2UoTXVtKCh4LCB5KSA9PiB4IDwgeSkpXG5cbmV4cG9ydCBjb25zdCBwcm9kdWN0ID0gbWVyZ2VBcyh1bnRvKDEpLCBNb25vaWQoMSwgKHksIHgpID0+IHggKiB5KSlcblxuZXhwb3J0IGNvbnN0IHN1bSA9IG1lcmdlQXModW50bygwKSwgTW9ub2lkKDAsICh5LCB4KSA9PiB4ICsgeSkpXG5cbi8vIENyZWF0aW5nIG5ldyB0cmF2ZXJzYWxzXG5cbmV4cG9ydCBmdW5jdGlvbiBicmFuY2godGVtcGxhdGUpIHtcbiAgY29uc3Qga2V5cyA9IFtdLCB2YWxzID0gW11cbiAgZm9yIChjb25zdCBrIGluIHRlbXBsYXRlKSB7XG4gICAga2V5cy5wdXNoKGspXG4gICAgdmFscy5wdXNoKHRvRnVuY3Rpb24odGVtcGxhdGVba10pKVxuICB9XG4gIHJldHVybiBicmFuY2hPbihrZXlzLCB2YWxzKVxufVxuXG4vLyBUcmF2ZXJzYWxzIGFuZCBjb21iaW5hdG9yc1xuXG5leHBvcnQgZnVuY3Rpb24gZWxlbXMoQSwgeGkyeUEsIHhzLCBfKSB7XG4gIGlmIChzZWVtc0FycmF5TGlrZSh4cykpIHtcbiAgICByZXR1cm4gQSA9PT0gSWRlbnRcbiAgICAgID8gbWFwUGFydGlhbEluZGV4VSh4aTJ5QSwgeHMpXG4gICAgICA6IHRyYXZlcnNlUGFydGlhbEluZGV4KEEsIHhpMnlBLCB4cylcbiAgfSBlbHNlIHtcbiAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKVxuICAgICAgcmVxQXBwbGljYXRpdmUoQSlcbiAgICByZXR1cm4gKDAsQS5vZikoeHMpXG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHZhbHVlcyhBLCB4aTJ5QSwgeHMsIF8pIHtcbiAgaWYgKHhzIGluc3RhbmNlb2YgT2JqZWN0KSB7XG4gICAgcmV0dXJuIGJyYW5jaE9uKGtleXMoeHMpKShBLCB4aTJ5QSwgeHMpXG4gIH0gZWxzZSB7XG4gICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIilcbiAgICAgIHJlcUFwcGxpY2F0aXZlKEEpXG4gICAgcmV0dXJuICgwLEEub2YpKHhzKVxuICB9XG59XG5cbi8vIE9wZXJhdGlvbnMgb24gbGVuc2VzXG5cbmV4cG9ydCBjb25zdCBnZXQgPSBjdXJyeShnZXRVKVxuXG4vLyBDcmVhdGluZyBuZXcgbGVuc2VzXG5cbmV4cG9ydCBjb25zdCBsZW5zID0gY3VycnkoKGdldCwgc2V0KSA9PiAoRiwgeGkyeUYsIHgsIGkpID0+XG4gICgwLEYubWFwKSh5ID0+IHNldCh5LCB4LCBpKSwgeGkyeUYoZ2V0KHgsIGkpLCBpKSkpXG5cbi8vIENvbXB1dGluZyBkZXJpdmVkIHByb3BzXG5cbmV4cG9ydCBjb25zdCBhdWdtZW50ID0gdGVtcGxhdGUgPT4ge1xuICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiICYmICFpc09iamVjdCh0ZW1wbGF0ZSkpXG4gICAgdGhyb3cgbmV3IEVycm9yKFwicGFydGlhbC5sZW5zZXM6IGBhdWdtZW50YCBleHBlY3RzIGEgcGxhaW4gT2JqZWN0IHRlbXBsYXRlXCIpXG4gIHJldHVybiBsZW5zKFxuICAgIHggPT4ge1xuICAgICAgeCA9IGRpc3NvY1BhcnRpYWxVKDAsIHgpXG4gICAgICBpZiAoeClcbiAgICAgICAgZm9yIChjb25zdCBrIGluIHRlbXBsYXRlKVxuICAgICAgICAgIHhba10gPSB0ZW1wbGF0ZVtrXSh4KVxuICAgICAgcmV0dXJuIHhcbiAgICB9LFxuICAgICh5LCB4KSA9PiB7XG4gICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiICYmXG4gICAgICAgICAgISh2b2lkIDAgPT09IHkgfHwgeSBpbnN0YW5jZW9mIE9iamVjdCkpXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcInBhcnRpYWwubGVuc2VzOiBgYXVnbWVudGAgbXVzdCBiZSBzZXQgd2l0aCB1bmRlZmluZWQgb3IgYW4gb2JqZWN0XCIpXG4gICAgICBpZiAoeSAmJiB5LmNvbnN0cnVjdG9yICE9PSBPYmplY3QpXG4gICAgICAgIHkgPSBPYmplY3QuYXNzaWduKHt9LCB5KVxuICAgICAgaWYgKCEoeCBpbnN0YW5jZW9mIE9iamVjdCkpXG4gICAgICAgIHggPSB2b2lkIDBcbiAgICAgIGxldCB6XG4gICAgICBmdW5jdGlvbiBzZXQoaywgdikge1xuICAgICAgICBpZiAoIXopXG4gICAgICAgICAgeiA9IHt9XG4gICAgICAgIHpba10gPSB2XG4gICAgICB9XG4gICAgICBmb3IgKGNvbnN0IGsgaW4geSkge1xuICAgICAgICBpZiAoIShrIGluIHRlbXBsYXRlKSlcbiAgICAgICAgICBzZXQoaywgeVtrXSlcbiAgICAgICAgZWxzZVxuICAgICAgICAgIGlmICh4ICYmIGsgaW4geClcbiAgICAgICAgICAgIHNldChrLCB4W2tdKVxuICAgICAgfVxuICAgICAgcmV0dXJuIHpcbiAgICB9KVxufVxuXG4vLyBFbmZvcmNpbmcgaW52YXJpYW50c1xuXG5leHBvcnQgY29uc3QgZGVmYXVsdHMgPSBvdXQgPT4ge1xuICBjb25zdCBvMnUgPSB4ID0+IHJlcGxhY2VkKG91dCwgdm9pZCAwLCB4KVxuICByZXR1cm4gKEYsIHhpMnlGLCB4LCBpKSA9PiAoMCxGLm1hcCkobzJ1LCB4aTJ5Rih2b2lkIDAgIT09IHggPyB4IDogb3V0LCBpKSlcbn1cblxuZXhwb3J0IGNvbnN0IHJlcXVpcmVkID0gaW5uID0+IHJlcGxhY2UoaW5uLCB2b2lkIDApXG5cbmV4cG9ydCBjb25zdCBkZWZpbmUgPSB2ID0+IG5vcm1hbGl6ZXIodW50byh2KSlcblxuZXhwb3J0IGNvbnN0IG5vcm1hbGl6ZSA9IHhpMnggPT5cbiAgbm9ybWFsaXplcigoeCwgaSkgPT4gdm9pZCAwICE9PSB4ID8geGkyeCh4LCBpKSA6IHZvaWQgMClcblxuZXhwb3J0IGNvbnN0IHJld3JpdGUgPSB5aTJ5ID0+IChGLCB4aTJ5RiwgeCwgaSkgPT5cbiAgKDAsRi5tYXApKHkgPT4gdm9pZCAwICE9PSB5ID8geWkyeSh5LCBpKSA6IHZvaWQgMCwgeGkyeUYoeCwgaSkpXG5cbi8vIExlbnNpbmcgYXJyYXlzXG5cbmV4cG9ydCBjb25zdCBhcHBlbmQgPSAoRiwgeGkyeUYsIHhzLCBpKSA9PlxuICAoMCxGLm1hcCkoeCA9PiBzZXRJbmRleChzZWVtc0FycmF5TGlrZSh4cykgPyB4cy5sZW5ndGggOiAwLCB4LCB4cyksXG4gICAgICAgICAgICB4aTJ5Rih2b2lkIDAsIGkpKVxuXG5leHBvcnQgY29uc3QgZmlsdGVyID0geGkyYiA9PiAoRiwgeGkyeUYsIHhzLCBpKSA9PiB7XG4gIGxldCB0cywgZnNcbiAgaWYgKHNlZW1zQXJyYXlMaWtlKHhzKSlcbiAgICBwYXJ0aXRpb25JbnRvSW5kZXgoeGkyYiwgeHMsIHRzID0gW10sIGZzID0gW10pXG4gIHJldHVybiAoMCxGLm1hcCkoXG4gICAgdHMgPT4ge1xuICAgICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIiAmJlxuICAgICAgICAgICEodm9pZCAwID09PSB0cyB8fCBzZWVtc0FycmF5TGlrZSh0cykpKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJwYXJ0aWFsLmxlbnNlczogYGZpbHRlcmAgbXVzdCBiZSBzZXQgd2l0aCB1bmRlZmluZWQgb3IgYW4gYXJyYXktbGlrZSBvYmplY3RcIilcbiAgICAgIGNvbnN0IHRzTiA9IHRzID8gdHMubGVuZ3RoIDogMCxcbiAgICAgICAgICAgIGZzTiA9IGZzID8gZnMubGVuZ3RoIDogMCxcbiAgICAgICAgICAgIG4gPSB0c04gKyBmc05cbiAgICAgIGlmIChuKVxuICAgICAgICByZXR1cm4gbiA9PT0gZnNOXG4gICAgICAgID8gZnNcbiAgICAgICAgOiBjb3B5VG9Gcm9tKGNvcHlUb0Zyb20oQXJyYXkobiksIDAsIHRzLCAwLCB0c04pLCB0c04sIGZzLCAwLCBmc04pXG4gICAgfSxcbiAgICB4aTJ5Rih0cywgaSkpXG59XG5cbmV4cG9ydCBjb25zdCBmaW5kID0geGkyYiA9PiBjaG9vc2UoeHMgPT4ge1xuICBpZiAoIXNlZW1zQXJyYXlMaWtlKHhzKSlcbiAgICByZXR1cm4gMFxuICBjb25zdCBpID0gZmluZEluZGV4KHhpMmIsIHhzKVxuICByZXR1cm4gaSA8IDAgPyBhcHBlbmQgOiBpXG59KVxuXG5leHBvcnQgZnVuY3Rpb24gZmluZFdpdGgoLi4ubHMpIHtcbiAgY29uc3QgbGxzID0gY29tcG9zZSguLi5scylcbiAgcmV0dXJuIFtmaW5kKHggPT4gdm9pZCAwICE9PSBnZXRVKGxscywgeCkpLCBsbHNdXG59XG5cbmV4cG9ydCBjb25zdCBpbmRleCA9IHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSBcInByb2R1Y3Rpb25cIiA/IGlkIDogeCA9PiB7XG4gIGlmICghTnVtYmVyLmlzSW50ZWdlcih4KSB8fCB4IDwgMClcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJwYXJ0aWFsLmxlbnNlczogYGluZGV4YCBleHBlY3RzIGEgbm9uLW5lZ2F0aXZlIGludGVnZXIuXCIpXG4gIHJldHVybiB4XG59XG5cbmV4cG9ydCBjb25zdCBzbGljZSA9IGN1cnJ5KChiZWdpbiwgZW5kKSA9PiAoRiwgeHNpMnlGLCB4cywgaSkgPT4ge1xuICBjb25zdCBzZWVtcyA9IHNlZW1zQXJyYXlMaWtlKHhzKSxcbiAgICAgICAgeHNOID0gc2VlbXMgJiYgeHMubGVuZ3RoLFxuICAgICAgICBiID0gc2xpY2VJbmRleCgwLCB4c04sIDAsIGJlZ2luKSxcbiAgICAgICAgZSA9IHNsaWNlSW5kZXgoYiwgeHNOLCB4c04sIGVuZClcbiAgcmV0dXJuICgwLEYubWFwKShcbiAgICB6cyA9PiB7XG4gICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiICYmXG4gICAgICAgICAgISh2b2lkIDAgPT09IHpzIHx8IHNlZW1zQXJyYXlMaWtlKHpzKSkpXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcInBhcnRpYWwubGVuc2VzOiBgc2xpY2VgIG11c3QgYmUgc2V0IHdpdGggdW5kZWZpbmVkIG9yIGFuIGFycmF5LWxpa2Ugb2JqZWN0XCIpXG4gICAgICBjb25zdCB6c04gPSB6cyA/IHpzLmxlbmd0aCA6IDAsIGJQenNOID0gYiArIHpzTiwgbiA9IHhzTiAtIGUgKyBiUHpzTlxuICAgICAgcmV0dXJuIG5cbiAgICAgICAgPyBjb3B5VG9Gcm9tKGNvcHlUb0Zyb20oY29weVRvRnJvbShBcnJheShuKSwgMCwgeHMsIDAsIGIpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB6cywgMCwgenNOKSxcbiAgICAgICAgICAgICAgICAgICAgIGJQenNOLFxuICAgICAgICAgICAgICAgICAgICAgeHMsIGUsIHhzTilcbiAgICAgICAgOiB2b2lkIDBcbiAgICB9LFxuICAgIHhzaTJ5RihzZWVtcyA/IGNvcHlUb0Zyb20oQXJyYXkoTWF0aC5tYXgoMCwgZSAtIGIpKSwgMCwgeHMsIGIsIGUpIDpcbiAgICAgICAgICAgdm9pZCAwLFxuICAgICAgICAgICBpKSlcbn0pXG5cbi8vIExlbnNpbmcgb2JqZWN0c1xuXG5leHBvcnQgY29uc3QgcHJvcCA9IHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSBcInByb2R1Y3Rpb25cIiA/IGlkIDogeCA9PiB7XG4gIGlmICghaXNTdHJpbmcoeCkpXG4gICAgdGhyb3cgbmV3IEVycm9yKFwicGFydGlhbC5sZW5zZXM6IGBwcm9wYCBleHBlY3RzIGEgc3RyaW5nLlwiKVxuICByZXR1cm4geFxufVxuXG5leHBvcnQgZnVuY3Rpb24gcHJvcHMoKSB7XG4gIGNvbnN0IG4gPSBhcmd1bWVudHMubGVuZ3RoLCB0ZW1wbGF0ZSA9IHt9XG4gIGZvciAobGV0IGk9MCwgazsgaTxuOyArK2kpXG4gICAgdGVtcGxhdGVbayA9IGFyZ3VtZW50c1tpXV0gPSBrXG4gIHJldHVybiBwaWNrKHRlbXBsYXRlKVxufVxuXG4vLyBQcm92aWRpbmcgZGVmYXVsdHNcblxuZXhwb3J0IGNvbnN0IHZhbHVlT3IgPSB2ID0+IChfRiwgeGkyeUYsIHgsIGkpID0+XG4gIHhpMnlGKHZvaWQgMCAhPT0geCAmJiB4ICE9PSBudWxsID8geCA6IHYsIGkpXG5cbi8vIEFkYXB0aW5nIHRvIGRhdGFcblxuZXhwb3J0IGNvbnN0IG9yRWxzZSA9XG4gIGN1cnJ5KChkLCBsKSA9PiBjaG9vc2UoeCA9PiB2b2lkIDAgIT09IGdldFUobCwgeCkgPyBsIDogZCkpXG5cbi8vIFJlYWQtb25seSBtYXBwaW5nXG5cbmV4cG9ydCBjb25zdCB0byA9IHdpMnggPT4gKEYsIHhpMnlGLCB3LCBpKSA9PlxuICAoMCxGLm1hcCkoYWx3YXlzKHcpLCB4aTJ5Rih3aTJ4KHcsIGkpLCBpKSlcblxuZXhwb3J0IGNvbnN0IGp1c3QgPSB4ID0+IHRvKGFsd2F5cyh4KSlcblxuLy8gVHJhbnNmb3JtaW5nIGRhdGFcblxuZXhwb3J0IGNvbnN0IHBpY2sgPSB0ZW1wbGF0ZSA9PiB7XG4gIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIgJiYgIWlzT2JqZWN0KHRlbXBsYXRlKSlcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJwYXJ0aWFsLmxlbnNlczogYHBpY2tgIGV4cGVjdHMgYSBwbGFpbiBPYmplY3QgdGVtcGxhdGVcIilcbiAgcmV0dXJuIChGLCB4aTJ5RiwgeCwgaSkgPT5cbiAgICAoMCxGLm1hcCkoc2V0UGljayh0ZW1wbGF0ZSwgeCksIHhpMnlGKGdldFBpY2sodGVtcGxhdGUsIHgpLCBpKSlcbn1cblxuZXhwb3J0IGNvbnN0IHJlcGxhY2UgPSBjdXJyeSgoaW5uLCBvdXQpID0+IHtcbiAgY29uc3QgbzJpID0geCA9PiByZXBsYWNlZChvdXQsIGlubiwgeClcbiAgcmV0dXJuIChGLCB4aTJ5RiwgeCwgaSkgPT4gKDAsRi5tYXApKG8yaSwgeGkyeUYocmVwbGFjZWQoaW5uLCBvdXQsIHgpLCBpKSlcbn0pXG5cbi8vIE9wZXJhdGlvbnMgb24gaXNvbW9ycGhpc21zXG5cbmV4cG9ydCBjb25zdCBnZXRJbnZlcnNlID0gYXJpdHlOKDIsIHNldFUpXG5cbi8vIENyZWF0aW5nIG5ldyBpc29tb3JwaGlzbXNcblxuZXhwb3J0IGNvbnN0IGlzbyA9XG4gIGN1cnJ5KChid2QsIGZ3ZCkgPT4gKEYsIHhpMnlGLCB4LCBpKSA9PiAoMCxGLm1hcCkoZndkLCB4aTJ5Rihid2QoeCksIGkpKSlcblxuLy8gSXNvbW9ycGhpc21zIGFuZCBjb21iaW5hdG9yc1xuXG5leHBvcnQgY29uc3QgaWRlbnRpdHkgPSAoX0YsIHhpMnlGLCB4LCBpKSA9PiB4aTJ5Rih4LCBpKVxuXG5leHBvcnQgY29uc3QgaW52ZXJzZSA9IGlzbyA9PiAoRiwgeGkyeUYsIHgsIGkpID0+XG4gICgwLEYubWFwKSh4ID0+IGdldFUoaXNvLCB4KSwgeGkyeUYoc2V0VShpc28sIHgpLCBpKSlcbiJdfQ==
