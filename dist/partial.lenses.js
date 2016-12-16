(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.partialLenses = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.inverse = exports.identity = exports.iso = exports.getInverse = exports.replace = exports.pick = exports.just = exports.to = exports.orElse = exports.valueOr = exports.prop = exports.index = exports.find = exports.filter = exports.append = exports.rewrite = exports.normalize = exports.define = exports.required = exports.defaults = exports.augment = exports.lens = exports.get = exports.foldMapOf = exports.collectMap = exports.collect = exports.log = exports.optional = exports.when = exports.choose = exports.choice = exports.chain = exports.set = exports.remove = exports.modify = undefined;
exports.lift = lift;
exports.compose = compose;
exports.zero = zero;
exports.lazy = lazy;
exports.branch = branch;
exports.sequence = sequence;
exports.findWith = findWith;
exports.props = props;

var _infestines = require("infestines");

//

var emptyArray = [];

//

var apply = function apply(x2y, x) {
  return x2y(x);
};

var snd = function snd(_, c) {
  return c;
};

//

var Ident = { map: apply, of: _infestines.id, ap: apply };

var Const = { map: snd };

function ConstOf(Monoid) {
  var concat = Monoid.concat;
  return {
    map: snd,
    of: (0, _infestines.always)((0, Monoid.empty)()),
    ap: function ap(x2yA, xA) {
      return concat(xA, x2yA);
    }
  };
}

//

function Concat(l, r) {
  this.l = l;this.r = r;
}

var isConcat = function isConcat(n) {
  return n && n.constructor === Concat;
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
  while (isConcat(n)) {
    var l = n.l;
    n = n.r;
    if (isConcat(l)) {
      pushTo(l.l, ys);
      pushTo(l.r, ys);
    } else ys.push(l);
  }
  ys.push(n);
}

function toArray(n) {
  var ys = [];
  if ((0, _infestines.isDefined)(n)) pushTo(n, ys);
  return ys;
}

var Collect = { map: snd, of: function of() {},
  ap: ap };

var collectMapU = function collectMapU(t, to, s) {
  return toArray(lift(t)(Collect, to, s));
};

//

function traverse(A, x2yA, xs) {
  var ap = A.ap,
      map = A.map;
  var s = (0, A.of)(undefined),
      i = xs.length;
  while (i) {
    s = ap(map(rconcat, s), x2yA(xs[--i]));
  }return map(toArray, s);
}

//

var unArray = function unArray(x) {
  return (0, _infestines.isArray)(x) ? x : undefined;
};

var mkArray = function mkArray(x) {
  return (0, _infestines.isArray)(x) ? x : emptyArray;
};

//

var assert = "production" === "production" ? _infestines.id : function (x, p, msg) {
  if ("production" === "production" || p(x)) return x;
  throw new Error(msg);
};

//

var emptyArrayToUndefined = function emptyArrayToUndefined(xs) {
  return xs.length ? xs : undefined;
};

var emptyObjectToUndefined = function emptyObjectToUndefined(o) {
  if (!(0, _infestines.isObject)(o)) return o;
  for (var k in o) {
    return o;
  }
};

//

var toPartial = function toPartial(x2y) {
  return function (x) {
    return (0, _infestines.isDefined)(x) ? x2y(x) : x;
  };
};

//

var isntConst = function isntConst(x) {
  return x !== Const;
};

var notGet = function notGet(A) {
  return assert(A, isntConst, "Traversals cannot be `get`. Consider `collect`.");
};

//

var isProp = function isProp(x) {
  return typeof x === "string";
};

var getProp = function getProp(k, o) {
  return (0, _infestines.isObject)(o) ? o[k] : undefined;
};

var setProp = function setProp(k, v, o) {
  return (0, _infestines.isDefined)(v) ? (0, _infestines.assocPartialU)(k, v, o) : (0, _infestines.dissocPartialU)(k, o);
};

var liftProp = function liftProp(k) {
  return function (F, x2yF, x) {
    return (0, F.map)(function (v) {
      return setProp(k, v, x);
    }, x2yF(getProp(k, x)));
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
  return (0, _infestines.isArray)(xs) ? xs[i] : undefined;
};

function setIndex(i, x, xs) {
  if ((0, _infestines.isDefined)(x)) {
    if (!(0, _infestines.isArray)(xs)) return i < 0 ? undefined : nulls(i).concat([x]);
    var n = xs.length;
    if (n <= i) return xs.concat(nulls(i - n), [x]);
    if (i < 0) return !n ? undefined : xs;
    var ys = Array(n);
    for (var j = 0; j < n; ++j) {
      ys[j] = xs[j];
    }ys[i] = x;
    return ys;
  } else {
    if ((0, _infestines.isArray)(xs)) {
      var _n = xs.length;
      if (!_n) return undefined;
      if (i < 0 || _n <= i) return xs;
      if (_n === 1) return undefined;
      var _ys = Array(_n - 1);
      for (var _j = 0; _j < i; ++_j) {
        _ys[_j] = xs[_j];
      }for (var _j2 = i + 1; _j2 < _n; ++_j2) {
        _ys[_j2 - 1] = xs[_j2];
      }return _ys;
    }
  }
}

var liftIndex = function liftIndex(i) {
  return function (F, x2yF, xs) {
    return (0, F.map)(function (y) {
      return setIndex(i, y, xs);
    }, x2yF(getIndex(i, xs)));
  };
};

//

var seemsLens = function seemsLens(x) {
  return typeof x === "function" && x.length === 3;
};

var lifted = function lifted(l) {
  return assert(l, seemsLens, "Expecting a lens.");
};

var close = function close(l, F, x2yF) {
  return function (x) {
    return l(F, x2yF, x);
  };
};

function composed(i, ls) {
  switch (ls.length - i) {
    case 0:
      return identity;
    case 1:
      return lift(ls[i]);
    default:
      return function (F, x2yF, x) {
        var n = ls.length;
        x2yF = close(lift(ls[--n]), F, x2yF);
        while (i < --n) {
          x2yF = close(lift(ls[n]), F, x2yF);
        }return lift(ls[i])(F, x2yF, x);
      };
  }
}

function setU(l, x, s) {
  switch (typeof l) {
    case "string":
      return setProp(l, x, s);
    case "number":
      return setIndex(l, x, s);
    case "function":
      return lifted(l)(Ident, (0, _infestines.always)(x), s);
    default:
      return modifyComposed(l, (0, _infestines.always)(x), s);
  }
}

function getComposed(ls, s) {
  for (var i = 0, n = ls.length; i < n; ++i) {
    s = getU(ls[i], s);
  }return s;
}

function getU(l, s) {
  switch (typeof l) {
    case "string":
      return getProp(l, s);
    case "number":
      return getIndex(l, s);
    case "function":
      return lifted(l)(Const, _infestines.id, s);
    default:
      return getComposed(l, s);
  }
}

function modifyComposed(ls, x2x, x) {
  var n = ls.length;

  var xs = [];

  for (var i = 0; i < n; ++i) {
    xs.push(x);
    var l = ls[i];
    switch (typeof l) {
      case "string":
        x = getProp(l, x);
        break;
      case "number":
        x = getIndex(l, x);
        break;
      default:
        x = composed(i, ls)(Ident, x2x, x);
        n = i;
        break;
    }
  }

  if (n === ls.length) x = x2x(x);

  while (0 <= --n) {
    var _l = ls[n];
    switch (typeof _l) {
      case "string":
        x = setProp(_l, x, xs[n]);break;
      case "number":
        x = setIndex(_l, x, xs[n]);break;
    }
  }

  return x;
}

function modifyU(l, x2x, s) {
  switch (typeof l) {
    case "string":
      return setProp(l, x2x(getProp(l, s)), s);
    case "number":
      return setIndex(l, x2x(getIndex(l, s)), s);
    case "function":
      return lifted(l)(Ident, x2x, s);
    default:
      return modifyComposed(l, x2x, s);
  }
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
    if (!(0, _infestines.isObject)(value)) value = undefined;
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
  return function (A, x2yA, x) {
    notGet(A);
    var ap = A.ap,
        wait = function wait(x, i) {
      return 0 <= i ? function (y) {
        return wait(setProp(keys[i], y, x), i - 1);
      } : x;
    };
    var r = (0, A.of)(wait(x, n - 1));
    if (!(0, _infestines.isObject)(x)) x = undefined;
    for (var i = n - 1; 0 <= i; --i) {
      var v = x && x[keys[i]];
      r = ap(r, vals ? vals[i](A, x2yA, v) : x2yA(v));
    }
    return (0, A.map)(emptyObjectToUndefined, r);
  };
}

var normalizer = function normalizer(fn) {
  return function (F, inner, x) {
    return (0, F.map)(fn, inner(fn(x)));
  };
};

var replacer = function replacer(inn, out) {
  return function (x) {
    return (0, _infestines.acyclicEqualsU)(x, inn) ? out : x;
  };
};

//

function lift(l) {
  switch (typeof l) {
    case "string":
      return liftProp(l);
    case "number":
      return liftIndex(l);
    case "function":
      return lifted(l);
    default:
      return composed(0, l);
  }
}

// Operations on optics

var modify = exports.modify = (0, _infestines.curry3)(modifyU);

var remove = exports.remove = (0, _infestines.curry2)(function (l, s) {
  return setU(l, undefined, s);
});

var set = exports.set = (0, _infestines.curry3)(setU);

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

var chain = exports.chain = (0, _infestines.curry2)(function (x2yO, xO) {
  return [xO, choose(function (xM) {
    return (0, _infestines.isDefined)(xM) ? x2yO(xM) : zero;
  })];
});

var choice = exports.choice = function choice() {
  for (var _len = arguments.length, ls = Array(_len), _key = 0; _key < _len; _key++) {
    ls[_key] = arguments[_key];
  }

  return choose(function (x) {
    var i = ls.findIndex(function (l) {
      return (0, _infestines.isDefined)(getU(l, x));
    });
    return i < 0 ? zero : ls[i];
  });
};

var choose = exports.choose = function choose(xM2o) {
  return function (F, x2yF, x) {
    return lift(xM2o(x))(F, x2yF, x);
  };
};

var when = exports.when = function when(p) {
  return function (C, x2yC, x) {
    return p(x) ? x2yC(x) : zero(C, x2yC, x);
  };
};

var optional = exports.optional = when(_infestines.isDefined);

function zero(C, x2yC, x) {
  var of = C.of;
  return of ? of(x) : (0, C.map)((0, _infestines.always)(x), x2yC(undefined));
}

// Recursing

function lazy(toLens) {
  var _memo = function memo(F, fn, x) {
    _memo = lift(toLens(rec));
    return _memo(F, fn, x);
  };
  var rec = function rec(F, fn, x) {
    return _memo(F, fn, x);
  };
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

var collect = exports.collect = (0, _infestines.curry2)(function (t, s) {
  return collectMapU(t, _infestines.id, s);
});

var collectMap = exports.collectMap = (0, _infestines.curry3)(collectMapU);

var foldMapOf = exports.foldMapOf = (0, _infestines.curry4)(function (m, t, to, s) {
  return lift(t)(ConstOf(m), to, s);
});

// Creating new traversals

function branch(template) {
  var keys = [];
  var vals = [];
  for (var k in template) {
    keys.push(k);
    vals.push(lift(template[k]));
  }
  return branchOn(keys, vals);
}

// Traversals and combinators

function sequence(A, x2yA, xs) {
  notGet(A);
  if ((0, _infestines.isArray)(xs)) return A === Ident ? emptyArrayToUndefined((0, _infestines.mapPartialU)(x2yA, xs)) : (0, A.map)(emptyArrayToUndefined, traverse(A, x2yA, xs));else if ((0, _infestines.isObject)(xs)) return branchOn((0, _infestines.keys)(xs))(A, x2yA, xs);else return (0, A.of)(xs);
}

// Operations on lenses

var get = exports.get = (0, _infestines.curry2)(getU);

// Creating new lenses

var lens = exports.lens = (0, _infestines.curry2)(function (get, set) {
  return function (F, x2yF, x) {
    return (0, F.map)(function (y) {
      return set(y, x);
    }, x2yF(get(x)));
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
        if (!(0, _infestines.isObject)(x)) x = undefined;
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
  return function (F, x2yF, x) {
    return (0, F.map)(replacer(out, undefined), x2yF((0, _infestines.isDefined)(x) ? x : out));
  };
};

var required = exports.required = function required(inn) {
  return replace(inn, undefined);
};

var define = exports.define = function define(v) {
  return normalizer(function (x) {
    return (0, _infestines.isDefined)(x) ? x : v;
  });
};

var normalize = exports.normalize = function normalize(x2x) {
  return normalizer(toPartial(x2x));
};

var rewrite = exports.rewrite = function rewrite(y2y) {
  return function (F, x2yF, x) {
    return (0, F.map)(toPartial(y2y), x2yF(x));
  };
};

// Lensing arrays

var append = exports.append = lens(snd, function (x, xs) {
  return (0, _infestines.isDefined)(x) ? (0, _infestines.isArray)(xs) ? xs.concat([x]) : [x] : unArray(xs);
});

var filter = exports.filter = function filter(p) {
  return lens(function (xs) {
    return unArray(xs) && xs.filter(p);
  }, function (ys, xs) {
    return emptyArrayToUndefined(mkArray(ys).concat(mkArray(xs).filter(function (x) {
      return !p(x);
    })));
  });
};

var find = exports.find = function find(predicate) {
  return choose(function (xs) {
    if (!(0, _infestines.isArray)(xs)) return 0;
    var i = xs.findIndex(predicate);
    return i < 0 ? append : i;
  });
};

function findWith() {
  var lls = compose.apply(undefined, arguments);
  return [find(function (x) {
    return (0, _infestines.isDefined)(getU(lls, x));
  }), lls];
}

var index = exports.index = function index(x) {
  return assert(x, isIndex, "`index` expects a non-negative integer.");
};

// Lensing objects

var prop = exports.prop = function prop(x) {
  return assert(x, isProp, "`prop` expects a string.");
};

function props() {
  var n = arguments.length,
      template = {};
  for (var i = 0; i < n; ++i) {
    var k = arguments[i];
    template[k] = k;
  }
  return pick(template);
}

// Providing defaults

var valueOr = exports.valueOr = function valueOr(v) {
  return function (_F, x2yF, x) {
    return x2yF((0, _infestines.isDefined)(x) && x !== null ? x : v);
  };
};

// Adapting to data

var orElse = exports.orElse = (0, _infestines.curry2)(function (d, l) {
  return choose(function (x) {
    return (0, _infestines.isDefined)(getU(l, x)) ? l : d;
  });
});

// Read-only mapping

var to = exports.to = function to(x2y) {
  return function (F, y2zF, x) {
    return (0, F.map)((0, _infestines.always)(x), y2zF(x2y(x)));
  };
};

var just = exports.just = function just(x) {
  return to((0, _infestines.always)(x));
};

// Transforming data

var pick = exports.pick = function pick(template) {
  return function (F, x2yF, x) {
    return (0, F.map)(setPick(template, x), x2yF(getPick(template, x)));
  };
};

var replace = exports.replace = (0, _infestines.curry2)(function (inn, out) {
  return function (F, x2yF, x) {
    return (0, F.map)(replacer(out, inn), x2yF(replacer(inn, out)(x)));
  };
});

// Operations on isomorphisms

var getInverse = exports.getInverse = (0, _infestines.curry2)(setU);

// Creating new isomorphisms

var iso = exports.iso = (0, _infestines.curry2)(function (bwd, fwd) {
  return function (F, x2yF, x) {
    return (0, F.map)(fwd, x2yF(bwd(x)));
  };
});

// Isomorphisms and combinators

var identity = exports.identity = function identity(_F, x2yF, x) {
  return x2yF(x);
};

var inverse = exports.inverse = function inverse(iso) {
  return function (F, inner, x) {
    return (0, F.map)(function (x) {
      return getU(iso, x);
    }, inner(setU(iso, x)));
  };
};

},{"infestines":undefined}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvcGFydGlhbC5sZW5zZXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7UUMrVGdCLEksR0FBQSxJO1FBbUJBLE8sR0FBQSxPO1FBNkJBLEksR0FBQSxJO1FBT0EsSSxHQUFBLEk7UUF1QkEsTSxHQUFBLE07UUFZQSxRLEdBQUEsUTtRQWdGQSxRLEdBQUEsUTtRQWFBLEssR0FBQSxLOztBQXRmaEI7O0FBZ0JBOztBQUVBLElBQU0sYUFBYSxFQUFuQjs7QUFFQTs7QUFFQSxJQUFNLFFBQVEsU0FBUixLQUFRLENBQUMsR0FBRCxFQUFNLENBQU47QUFBQSxTQUFZLElBQUksQ0FBSixDQUFaO0FBQUEsQ0FBZDs7QUFFQSxJQUFNLE1BQU0sU0FBTixHQUFNLENBQUMsQ0FBRCxFQUFJLENBQUo7QUFBQSxTQUFVLENBQVY7QUFBQSxDQUFaOztBQUVBOztBQUVBLElBQU0sUUFBUSxFQUFDLEtBQUssS0FBTixFQUFhLGtCQUFiLEVBQXFCLElBQUksS0FBekIsRUFBZDs7QUFFQSxJQUFNLFFBQVEsRUFBQyxLQUFLLEdBQU4sRUFBZDs7QUFFQSxTQUFTLE9BQVQsQ0FBaUIsTUFBakIsRUFBeUI7QUFDdkIsTUFBTSxTQUFTLE9BQU8sTUFBdEI7QUFDQSxTQUFPO0FBQ0wsU0FBSyxHQURBO0FBRUwsUUFBSSx3QkFBTyxDQUFDLEdBQUUsT0FBTyxLQUFWLEdBQVAsQ0FGQztBQUdMLFFBQUksWUFBQyxJQUFELEVBQU8sRUFBUDtBQUFBLGFBQWMsT0FBTyxFQUFQLEVBQVcsSUFBWCxDQUFkO0FBQUE7QUFIQyxHQUFQO0FBS0Q7O0FBRUQ7O0FBRUEsU0FBUyxNQUFULENBQWdCLENBQWhCLEVBQW1CLENBQW5CLEVBQXNCO0FBQUMsT0FBSyxDQUFMLEdBQVMsQ0FBVCxDQUFZLEtBQUssQ0FBTCxHQUFTLENBQVQ7QUFBVzs7QUFFOUMsSUFBTSxXQUFXLFNBQVgsUUFBVztBQUFBLFNB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QVcsQ0FBWDtBQUFBLFdBQzVCLENBQUMsR0FBRSxFQUFFLEdBQUwsRUFBVTtBQUFBLGFBQUssS0FBSyxHQUFMLEVBQVUsQ0FBVixDQUFMO0FBQUEsS0FBVixFQUE2QixNQUFNLEtBQUssR0FBTCxFQUFVLENBQVYsQ0FBTixDQUE3QixDQUQ0QjtBQUFBLEdBQVA7QUFBQSxDQUFoQiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQge1xuICBhY3ljbGljRXF1YWxzVSxcbiAgYWx3YXlzLFxuICBhc3NvY1BhcnRpYWxVLFxuICBjdXJyeTIsXG4gIGN1cnJ5MyxcbiAgY3Vycnk0LFxuICBkaXNzb2NQYXJ0aWFsVSxcbiAgaWQsXG4gIGlzQXJyYXksXG4gIGlzRGVmaW5lZCxcbiAgaXNPYmplY3QsXG4gIGtleXMsXG4gIG1hcFBhcnRpYWxVXG59IGZyb20gXCJpbmZlc3RpbmVzXCJcblxuLy9cblxuY29uc3QgZW1wdHlBcnJheSA9IFtdXG5cbi8vXG5cbmNvbnN0IGFwcGx5ID0gKHgyeSwgeCkgPT4geDJ5KHgpXG5cbmNvbnN0IHNuZCA9IChfLCBjKSA9PiBjXG5cbi8vXG5cbmNvbnN0IElkZW50ID0ge21hcDogYXBwbHksIG9mOiBpZCwgYXA6IGFwcGx5fVxuXG5jb25zdCBDb25zdCA9IHttYXA6IHNuZH1cblxuZnVuY3Rpb24gQ29uc3RPZihNb25vaWQpIHtcbiAgY29uc3QgY29uY2F0ID0gTW9ub2lkLmNvbmNhdFxuICByZXR1cm4ge1xuICAgIG1hcDogc25kLFxuICAgIG9mOiBhbHdheXMoKDAsTW9ub2lkLmVtcHR5KSgpKSxcbiAgICBhcDogKHgyeUEsIHhBKSA9PiBjb25jYXQoeEEsIHgyeUEpXG4gIH1cbn1cblxuLy9cblxuZnVuY3Rpb24gQ29uY2F0KGwsIHIpIHt0aGlzLmwgPSBsOyB0aGlzLnIgPSByfVxuXG5jb25zdCBpc0NvbmNhdCA9IG4gPT4gbiAmJiBuLmNvbnN0cnVjdG9yID09PSBDb25jYXRcblxuY29uc3QgYXAgPSAociwgbCkgPT4gaXNEZWZpbmVkKGwpID8gaXNEZWZpbmVkKHIpID8gbmV3IENvbmNhdChsLCByKSA6IGwgOiByXG5cbmNvbnN0IHJjb25jYXQgPSB0ID0+IGggPT4gYXAodCwgaClcblxuZnVuY3Rpb24gcHVzaFRvKG4sIHlzKSB7XG4gIHdoaWxlIChpc0NvbmNhdChuKSkge1xuICAgIGNvbnN0IGwgPSBuLmxcbiAgICBuID0gbi5yXG4gICAgaWYgKGlzQ29uY2F0KGwpKSB7XG4gICAgICBwdXNoVG8obC5sLCB5cylcbiAgICAgIHB1c2hUbyhsLnIsIHlzKVxuICAgIH0gZWxzZVxuICAgICAgeXMucHVzaChsKVxuICB9XG4gIHlzLnB1c2gobilcbn1cblxuZnVuY3Rpb24gdG9BcnJheShuKSB7XG4gIGNvbnN0IHlzID0gW11cbiAgaWYgKGlzRGVmaW5lZChuKSlcbiAgICBwdXNoVG8obiwgeXMpXG4gIHJldHVybiB5c1xufVxuXG5jb25zdCBDb2xsZWN0ID0ge21hcDogc25kLCBvZigpIHt9LCBhcH1cblxuY29uc3QgY29sbGVjdE1hcFUgPSAodCwgdG8sIHMpID0+IHRvQXJyYXkobGlmdCh0KShDb2xsZWN0LCB0bywgcykpXG5cbi8vXG5cbmZ1bmN0aW9uIHRyYXZlcnNlKEEsIHgyeUEsIHhzKSB7XG4gIGNvbnN0IGFwID0gQS5hcCwgbWFwID0gQS5tYXBcbiAgbGV0IHMgPSAoMCxBLm9mKSh1bmRlZmluZWQpLCBpID0geHMubGVuZ3RoXG4gIHdoaWxlIChpKVxuICAgIHMgPSBhcChtYXAocmNvbmNhdCwgcyksIHgyeUEoeHNbLS1pXSkpXG4gIHJldHVybiBtYXAodG9BcnJheSwgcylcbn1cblxuLy9cblxuY29uc3QgdW5BcnJheSA9IHggPT4gaXNBcnJheSh4KSA/IHggOiB1bmRlZmluZWRcblxuY29uc3QgbWtBcnJheSA9IHggPT4gaXNBcnJheSh4KSA/IHggOiBlbXB0eUFycmF5XG5cbi8vXG5cbmNvbnN0IGFzc2VydCA9IFwicHJvZHVjdGlvblwiID09PSBcInByb2R1Y3Rpb25cIiA/IGlkIDogKHgsIHAsIG1zZykgPT4ge1xuICBpZiAoXCJwcm9kdWN0aW9uXCIgPT09IFwicHJvZHVjdGlvblwiIHx8IHAoeCkpXG4gICAgcmV0dXJuIHhcbiAgdGhyb3cgbmV3IEVycm9yKG1zZylcbn1cblxuLy9cblxuY29uc3QgZW1wdHlBcnJheVRvVW5kZWZpbmVkID0geHMgPT4geHMubGVuZ3RoID8geHMgOiB1bmRlZmluZWRcblxuY29uc3QgZW1wdHlPYmplY3RUb1VuZGVmaW5lZCA9IG8gPT4ge1xuICBpZiAoIWlzT2JqZWN0KG8pKVxuICAgIHJldHVybiBvXG4gIGZvciAoY29uc3QgayBpbiBvKVxuICAgIHJldHVybiBvXG59XG5cbi8vXG5cbmNvbnN0IHRvUGFydGlhbCA9IHgyeSA9PiB4ID0+IGlzRGVmaW5lZCh4KSA/IHgyeSh4KSA6IHhcblxuLy9cblxuY29uc3QgaXNudENvbnN0ID0geCA9PiB4ICE9PSBDb25zdFxuXG5jb25zdCBub3RHZXQgPSBBID0+XG4gIGFzc2VydChBLCBpc250Q29uc3QsIFwiVHJhdmVyc2FscyBjYW5ub3QgYmUgYGdldGAuIENvbnNpZGVyIGBjb2xsZWN0YC5cIilcblxuLy9cblxuY29uc3QgaXNQcm9wID0geCA9PiB0eXBlb2YgeCA9PT0gXCJzdHJpbmdcIlxuXG5jb25zdCBnZXRQcm9wID0gKGssIG8pID0+IGlzT2JqZWN0KG8pID8gb1trXSA6IHVuZGVmaW5lZFxuXG5jb25zdCBzZXRQcm9wID0gKGssIHYsIG8pID0+XG4gIGlzRGVmaW5lZCh2KSA/IGFzc29jUGFydGlhbFUoaywgdiwgbykgOiBkaXNzb2NQYXJ0aWFsVShrLCBvKVxuXG5jb25zdCBsaWZ0UHJvcCA9IGsgPT4gKEYsIHgyeUYsIHgpID0+XG4gICgwLEYubWFwKSh2ID0+IHNldFByb3AoaywgdiwgeCksIHgyeUYoZ2V0UHJvcChrLCB4KSkpXG5cbi8vXG5cbmNvbnN0IGlzSW5kZXggPSB4ID0+IE51bWJlci5pc0ludGVnZXIoeCkgJiYgMCA8PSB4XG5cbmNvbnN0IG51bGxzID0gbiA9PiBBcnJheShuKS5maWxsKG51bGwpXG5cbmNvbnN0IGdldEluZGV4ID0gKGksIHhzKSA9PiBpc0FycmF5KHhzKSA/IHhzW2ldIDogdW5kZWZpbmVkXG5cbmZ1bmN0aW9uIHNldEluZGV4KGksIHgsIHhzKSB7XG4gIGlmIChpc0RlZmluZWQoeCkpIHtcbiAgICBpZiAoIWlzQXJyYXkoeHMpKVxuICAgICAgcmV0dXJuIGkgPCAwID8gdW5kZWZpbmVkIDogbnVsbHMoaSkuY29uY2F0KFt4XSlcbiAgICBjb25zdCBuID0geHMubGVuZ3RoXG4gICAgaWYgKG4gPD0gaSlcbiAgICAgIHJldHVybiB4cy5jb25jYXQobnVsbHMoaSAtIG4pLCBbeF0pXG4gICAgaWYgKGkgPCAwKVxuICAgICAgcmV0dXJuICFuID8gdW5kZWZpbmVkIDogeHNcbiAgICBjb25zdCB5cyA9IEFycmF5KG4pXG4gICAgZm9yIChsZXQgaj0wOyBqPG47ICsrailcbiAgICAgIHlzW2pdID0geHNbal1cbiAgICB5c1tpXSA9IHhcbiAgICByZXR1cm4geXNcbiAgfSBlbHNlIHtcbiAgICBpZiAoaXNBcnJheSh4cykpIHtcbiAgICAgIGNvbnN0IG4gPSB4cy5sZW5ndGhcbiAgICAgIGlmICghbilcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZFxuICAgICAgaWYgKGkgPCAwIHx8IG4gPD0gaSlcbiAgICAgICAgcmV0dXJuIHhzXG4gICAgICBpZiAobiA9PT0gMSlcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZFxuICAgICAgY29uc3QgeXMgPSBBcnJheShuLTEpXG4gICAgICBmb3IgKGxldCBqPTA7IGo8aTsgKytqKVxuICAgICAgICB5c1tqXSA9IHhzW2pdXG4gICAgICBmb3IgKGxldCBqPWkrMTsgajxuOyArK2opXG4gICAgICAgIHlzW2otMV0gPSB4c1tqXVxuICAgICAgcmV0dXJuIHlzXG4gICAgfVxuICB9XG59XG5cbmNvbnN0IGxpZnRJbmRleCA9IGkgPT4gKEYsIHgyeUYsIHhzKSA9PlxuICAoMCxGLm1hcCkoeSA9PiBzZXRJbmRleChpLCB5LCB4cyksIHgyeUYoZ2V0SW5kZXgoaSwgeHMpKSlcblxuLy9cblxuY29uc3Qgc2VlbXNMZW5zID0geCA9PiB0eXBlb2YgeCA9PT0gXCJmdW5jdGlvblwiICYmIHgubGVuZ3RoID09PSAzXG5cbmNvbnN0IGxpZnRlZCA9IGwgPT4gYXNzZXJ0KGwsIHNlZW1zTGVucywgXCJFeHBlY3RpbmcgYSBsZW5zLlwiKVxuXG5jb25zdCBjbG9zZSA9IChsLCBGLCB4MnlGKSA9PiB4ID0+IGwoRiwgeDJ5RiwgeClcblxuZnVuY3Rpb24gY29tcG9zZWQoaSwgbHMpIHtcbiAgc3dpdGNoIChscy5sZW5ndGggLSBpKSB7XG4gICAgY2FzZSAwOiAgcmV0dXJuIGlkZW50aXR5XG4gICAgY2FzZSAxOiAgcmV0dXJuIGxpZnQobHNbaV0pXG4gICAgZGVmYXVsdDogcmV0dXJuIChGLCB4MnlGLCB4KSA9PiB7XG4gICAgICBsZXQgbiA9IGxzLmxlbmd0aFxuICAgICAgeDJ5RiA9IGNsb3NlKGxpZnQobHNbLS1uXSksIEYsIHgyeUYpXG4gICAgICB3aGlsZSAoaSA8IC0tbilcbiAgICAgICAgeDJ5RiA9IGNsb3NlKGxpZnQobHNbbl0pLCBGLCB4MnlGKVxuICAgICAgcmV0dXJuIGxpZnQobHNbaV0pKEYsIHgyeUYsIHgpXG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIHNldFUobCwgeCwgcykge1xuICBzd2l0Y2ggKHR5cGVvZiBsKSB7XG4gICAgY2FzZSBcInN0cmluZ1wiOiAgIHJldHVybiBzZXRQcm9wKGwsIHgsIHMpXG4gICAgY2FzZSBcIm51bWJlclwiOiAgIHJldHVybiBzZXRJbmRleChsLCB4LCBzKVxuICAgIGNhc2UgXCJmdW5jdGlvblwiOiByZXR1cm4gbGlmdGVkKGwpKElkZW50LCBhbHdheXMoeCksIHMpXG4gICAgZGVmYXVsdDogICAgICAgICByZXR1cm4gbW9kaWZ5Q29tcG9zZWQobCwgYWx3YXlzKHgpLCBzKVxuICB9XG59XG5cbmZ1bmN0aW9uIGdldENvbXBvc2VkKGxzLCBzKSAge1xuICBmb3IgKGxldCBpPTAsIG49bHMubGVuZ3RoOyBpPG47ICsraSlcbiAgICBzID0gZ2V0VShsc1tpXSwgcylcbiAgcmV0dXJuIHNcbn1cblxuZnVuY3Rpb24gZ2V0VShsLCBzKSB7XG4gIHN3aXRjaCAodHlwZW9mIGwpIHtcbiAgICBjYXNlIFwic3RyaW5nXCI6ICAgcmV0dXJuIGdldFByb3AobCwgcylcbiAgICBjYXNlIFwibnVtYmVyXCI6ICAgcmV0dXJuIGdldEluZGV4KGwsIHMpXG4gICAgY2FzZSBcImZ1bmN0aW9uXCI6IHJldHVybiBsaWZ0ZWQobCkoQ29uc3QsIGlkLCBzKVxuICAgIGRlZmF1bHQ6ICAgICAgICAgcmV0dXJuIGdldENvbXBvc2VkKGwsIHMpXG4gIH1cbn1cblxuZnVuY3Rpb24gbW9kaWZ5Q29tcG9zZWQobHMsIHgyeCwgeCkge1xuICBsZXQgbiA9IGxzLmxlbmd0aFxuXG4gIGNvbnN0IHhzID0gW11cblxuICBmb3IgKGxldCBpPTA7IGk8bjsgKytpKSB7XG4gICAgeHMucHVzaCh4KVxuICAgIGNvbnN0IGwgPSBsc1tpXVxuICAgIHN3aXRjaCAodHlwZW9mIGwpIHtcbiAgICAgIGNhc2UgXCJzdHJpbmdcIjpcbiAgICAgICAgeCA9IGdldFByb3AobCwgeClcbiAgICAgICAgYnJlYWtcbiAgICAgIGNhc2UgXCJudW1iZXJcIjpcbiAgICAgICAgeCA9IGdldEluZGV4KGwsIHgpXG4gICAgICAgIGJyZWFrXG4gICAgICBkZWZhdWx0OlxuICAgICAgICB4ID0gY29tcG9zZWQoaSwgbHMpKElkZW50LCB4MngsIHgpXG4gICAgICAgIG4gPSBpXG4gICAgICAgIGJyZWFrXG4gICAgfVxuICB9XG5cbiAgaWYgKG4gPT09IGxzLmxlbmd0aClcbiAgICB4ID0geDJ4KHgpXG5cbiAgd2hpbGUgKDAgPD0gLS1uKSB7XG4gICAgY29uc3QgbCA9IGxzW25dXG4gICAgc3dpdGNoICh0eXBlb2YgbCkge1xuICAgICAgY2FzZSBcInN0cmluZ1wiOiB4ID0gc2V0UHJvcChsLCB4LCB4c1tuXSk7IGJyZWFrXG4gICAgICBjYXNlIFwibnVtYmVyXCI6IHggPSBzZXRJbmRleChsLCB4LCB4c1tuXSk7IGJyZWFrXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHhcbn1cblxuZnVuY3Rpb24gbW9kaWZ5VShsLCB4MngsIHMpIHtcbiAgc3dpdGNoICh0eXBlb2YgbCkge1xuICAgIGNhc2UgXCJzdHJpbmdcIjogICByZXR1cm4gc2V0UHJvcChsLCB4MngoZ2V0UHJvcChsLCBzKSksIHMpXG4gICAgY2FzZSBcIm51bWJlclwiOiAgIHJldHVybiBzZXRJbmRleChsLCB4MngoZ2V0SW5kZXgobCwgcykpLCBzKVxuICAgIGNhc2UgXCJmdW5jdGlvblwiOiByZXR1cm4gbGlmdGVkKGwpKElkZW50LCB4MngsIHMpXG4gICAgZGVmYXVsdDogICAgICAgICByZXR1cm4gbW9kaWZ5Q29tcG9zZWQobCwgeDJ4LCBzKVxuICB9XG59XG5cbi8vXG5cbmZ1bmN0aW9uIGdldFBpY2sodGVtcGxhdGUsIHgpIHtcbiAgbGV0IHJcbiAgZm9yIChjb25zdCBrIGluIHRlbXBsYXRlKSB7XG4gICAgY29uc3QgdiA9IGdldFUodGVtcGxhdGVba10sIHgpXG4gICAgaWYgKGlzRGVmaW5lZCh2KSkge1xuICAgICAgaWYgKCFyKVxuICAgICAgICByID0ge31cbiAgICAgIHJba10gPSB2XG4gICAgfVxuICB9XG4gIHJldHVybiByXG59XG5cbmNvbnN0IHNldFBpY2sgPSAodGVtcGxhdGUsIHgpID0+IHZhbHVlID0+IHtcbiAgaWYgKCFpc09iamVjdCh2YWx1ZSkpXG4gICAgdmFsdWUgPSB1bmRlZmluZWRcbiAgZm9yIChjb25zdCBrIGluIHRlbXBsYXRlKVxuICAgIHggPSBzZXRVKHRlbXBsYXRlW2tdLCB2YWx1ZSAmJiB2YWx1ZVtrXSwgeClcbiAgcmV0dXJuIHhcbn1cblxuLy9cblxuY29uc3Qgc2hvdyA9IChsYWJlbHMsIGRpcikgPT4geCA9PlxuICBjb25zb2xlLmxvZy5hcHBseShjb25zb2xlLCBsYWJlbHMuY29uY2F0KFtkaXIsIHhdKSkgfHwgeFxuXG5mdW5jdGlvbiBicmFuY2hPbihrZXlzLCB2YWxzKSB7XG4gIGNvbnN0IG4gPSBrZXlzLmxlbmd0aFxuICByZXR1cm4gKEEsIHgyeUEsIHgpID0+IHtcbiAgICBub3RHZXQoQSlcbiAgICBjb25zdCBhcCA9IEEuYXAsXG4gICAgICAgICAgd2FpdCA9ICh4LCBpKSA9PiAwIDw9IGkgPyB5ID0+IHdhaXQoc2V0UHJvcChrZXlzW2ldLCB5LCB4KSwgaS0xKSA6IHhcbiAgICBsZXQgciA9ICgwLEEub2YpKHdhaXQoeCwgbi0xKSlcbiAgICBpZiAoIWlzT2JqZWN0KHgpKVxuICAgICAgeCA9IHVuZGVmaW5lZFxuICAgIGZvciAobGV0IGk9bi0xOyAwPD1pOyAtLWkpIHtcbiAgICAgIGNvbnN0IHYgPSB4ICYmIHhba2V5c1tpXV1cbiAgICAgIHIgPSBhcChyLCAodmFscyA/IHZhbHNbaV0oQSwgeDJ5QSwgdikgOiB4MnlBKHYpKSlcbiAgICB9XG4gICAgcmV0dXJuICgwLEEubWFwKShlbXB0eU9iamVjdFRvVW5kZWZpbmVkLCByKVxuICB9XG59XG5cbmNvbnN0IG5vcm1hbGl6ZXIgPSBmbiA9PiAoRiwgaW5uZXIsIHgpID0+ICgwLEYubWFwKShmbiwgaW5uZXIoZm4oeCkpKVxuXG5jb25zdCByZXBsYWNlciA9IChpbm4sIG91dCkgPT4geCA9PiBhY3ljbGljRXF1YWxzVSh4LCBpbm4pID8gb3V0IDogeFxuXG4vL1xuXG5leHBvcnQgZnVuY3Rpb24gbGlmdChsKSB7XG4gIHN3aXRjaCAodHlwZW9mIGwpIHtcbiAgICBjYXNlIFwic3RyaW5nXCI6ICAgcmV0dXJuIGxpZnRQcm9wKGwpXG4gICAgY2FzZSBcIm51bWJlclwiOiAgIHJldHVybiBsaWZ0SW5kZXgobClcbiAgICBjYXNlIFwiZnVuY3Rpb25cIjogcmV0dXJuIGxpZnRlZChsKVxuICAgIGRlZmF1bHQ6ICAgICAgICAgcmV0dXJuIGNvbXBvc2VkKDAsbClcbiAgfVxufVxuXG4vLyBPcGVyYXRpb25zIG9uIG9wdGljc1xuXG5leHBvcnQgY29uc3QgbW9kaWZ5ID0gY3VycnkzKG1vZGlmeVUpXG5cbmV4cG9ydCBjb25zdCByZW1vdmUgPSBjdXJyeTIoKGwsIHMpID0+IHNldFUobCwgdW5kZWZpbmVkLCBzKSlcblxuZXhwb3J0IGNvbnN0IHNldCA9IGN1cnJ5MyhzZXRVKVxuXG4vLyBOZXN0aW5nXG5cbmV4cG9ydCBmdW5jdGlvbiBjb21wb3NlKCkge1xuICBzd2l0Y2ggKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICBjYXNlIDA6IHJldHVybiBpZGVudGl0eVxuICAgIGNhc2UgMTogcmV0dXJuIGFyZ3VtZW50c1swXVxuICAgIGRlZmF1bHQ6IHtcbiAgICAgIGNvbnN0IG4gPSBhcmd1bWVudHMubGVuZ3RoLCBsZW5zZXMgPSBBcnJheShuKVxuICAgICAgZm9yIChsZXQgaT0wOyBpPG47ICsraSlcbiAgICAgICAgbGVuc2VzW2ldID0gYXJndW1lbnRzW2ldXG4gICAgICByZXR1cm4gbGVuc2VzXG4gICAgfVxuICB9XG59XG5cbi8vIFF1ZXJ5aW5nXG5cbmV4cG9ydCBjb25zdCBjaGFpbiA9IGN1cnJ5MigoeDJ5TywgeE8pID0+XG4gIFt4TywgY2hvb3NlKHhNID0+IGlzRGVmaW5lZCh4TSkgPyB4MnlPKHhNKSA6IHplcm8pXSlcblxuZXhwb3J0IGNvbnN0IGNob2ljZSA9ICguLi5scykgPT4gY2hvb3NlKHggPT4ge1xuICBjb25zdCBpID0gbHMuZmluZEluZGV4KGwgPT4gaXNEZWZpbmVkKGdldFUobCwgeCkpKVxuICByZXR1cm4gaSA8IDAgPyB6ZXJvIDogbHNbaV1cbn0pXG5cbmV4cG9ydCBjb25zdCBjaG9vc2UgPSB4TTJvID0+IChGLCB4MnlGLCB4KSA9PiBsaWZ0KHhNMm8oeCkpKEYsIHgyeUYsIHgpXG5cbmV4cG9ydCBjb25zdCB3aGVuID0gcCA9PiAoQywgeDJ5QywgeCkgPT4gcCh4KSA/IHgyeUMoeCkgOiB6ZXJvKEMsIHgyeUMsIHgpXG5cbmV4cG9ydCBjb25zdCBvcHRpb25hbCA9IHdoZW4oaXNEZWZpbmVkKVxuXG5leHBvcnQgZnVuY3Rpb24gemVybyhDLCB4MnlDLCB4KSB7XG4gIGNvbnN0IG9mID0gQy5vZlxuICByZXR1cm4gb2YgPyBvZih4KSA6ICgwLEMubWFwKShhbHdheXMoeCksIHgyeUModW5kZWZpbmVkKSlcbn1cblxuLy8gUmVjdXJzaW5nXG5cbmV4cG9ydCBmdW5jdGlvbiBsYXp5KHRvTGVucykge1xuICBsZXQgbWVtbyA9IChGLCBmbiwgeCkgPT4ge1xuICAgIG1lbW8gPSBsaWZ0KHRvTGVucyhyZWMpKVxuICAgIHJldHVybiBtZW1vKEYsIGZuLCB4KVxuICB9XG4gIGNvbnN0IHJlYyA9IChGLCBmbiwgeCkgPT4gbWVtbyhGLCBmbiwgeClcbiAgcmV0dXJuIHJlY1xufVxuXG4vLyBEZWJ1Z2dpbmdcblxuZXhwb3J0IGNvbnN0IGxvZyA9ICguLi5sYWJlbHMpID0+IGlzbyhzaG93KGxhYmVscywgXCJnZXRcIiksIHNob3cobGFiZWxzLCBcInNldFwiKSlcblxuLy8gT3BlcmF0aW9ucyBvbiB0cmF2ZXJzYWxzXG5cbmV4cG9ydCBjb25zdCBjb2xsZWN0ID0gY3VycnkyKCh0LCBzKSA9PiBjb2xsZWN0TWFwVSh0LCBpZCwgcykpXG5cbmV4cG9ydCBjb25zdCBjb2xsZWN0TWFwID0gY3VycnkzKGNvbGxlY3RNYXBVKVxuXG5leHBvcnQgY29uc3QgZm9sZE1hcE9mID0gY3Vycnk0KChtLCB0LCB0bywgcykgPT4gbGlmdCh0KShDb25zdE9mKG0pLCB0bywgcykpXG5cbi8vIENyZWF0aW5nIG5ldyB0cmF2ZXJzYWxzXG5cbmV4cG9ydCBmdW5jdGlvbiBicmFuY2godGVtcGxhdGUpIHtcbiAgY29uc3Qga2V5cyA9IFtdXG4gIGNvbnN0IHZhbHMgPSBbXVxuICBmb3IgKGNvbnN0IGsgaW4gdGVtcGxhdGUpIHtcbiAgICBrZXlzLnB1c2goaylcbiAgICB2YWxzLnB1c2gobGlmdCh0ZW1wbGF0ZVtrXSkpXG4gIH1cbiAgcmV0dXJuIGJyYW5jaE9uKGtleXMsIHZhbHMpXG59XG5cbi8vIFRyYXZlcnNhbHMgYW5kIGNvbWJpbmF0b3JzXG5cbmV4cG9ydCBmdW5jdGlvbiBzZXF1ZW5jZShBLCB4MnlBLCB4cykge1xuICBub3RHZXQoQSlcbiAgaWYgKGlzQXJyYXkoeHMpKVxuICAgIHJldHVybiBBID09PSBJZGVudFxuICAgID8gZW1wdHlBcnJheVRvVW5kZWZpbmVkKG1hcFBhcnRpYWxVKHgyeUEsIHhzKSlcbiAgICA6ICgwLEEubWFwKShlbXB0eUFycmF5VG9VbmRlZmluZWQsIHRyYXZlcnNlKEEsIHgyeUEsIHhzKSlcbiAgZWxzZSBpZiAoaXNPYmplY3QoeHMpKVxuICAgIHJldHVybiBicmFuY2hPbihrZXlzKHhzKSkoQSwgeDJ5QSwgeHMpXG4gIGVsc2VcbiAgICByZXR1cm4gKDAsQS5vZikoeHMpXG59XG5cbi8vIE9wZXJhdGlvbnMgb24gbGVuc2VzXG5cbmV4cG9ydCBjb25zdCBnZXQgPSBjdXJyeTIoZ2V0VSlcblxuLy8gQ3JlYXRpbmcgbmV3IGxlbnNlc1xuXG5leHBvcnQgY29uc3QgbGVucyA9XG4gIGN1cnJ5MigoZ2V0LCBzZXQpID0+IChGLCB4MnlGLCB4KSA9PiAoMCxGLm1hcCkoeSA9PiBzZXQoeSwgeCksIHgyeUYoZ2V0KHgpKSkpXG5cbi8vIENvbXB1dGluZyBkZXJpdmVkIHByb3BzXG5cbmV4cG9ydCBjb25zdCBhdWdtZW50ID0gdGVtcGxhdGUgPT4gbGVucyhcbiAgeCA9PiB7XG4gICAgY29uc3QgeiA9IGRpc3NvY1BhcnRpYWxVKDAsIHgpXG4gICAgaWYgKHopXG4gICAgICBmb3IgKGNvbnN0IGsgaW4gdGVtcGxhdGUpXG4gICAgICAgIHpba10gPSB0ZW1wbGF0ZVtrXSh6KVxuICAgIHJldHVybiB6XG4gIH0sXG4gICh5LCB4KSA9PiB7XG4gICAgaWYgKGlzT2JqZWN0KHkpKSB7XG4gICAgICBpZiAoIWlzT2JqZWN0KHgpKVxuICAgICAgICB4ID0gdW5kZWZpbmVkXG4gICAgICBsZXQgelxuICAgICAgY29uc3Qgc2V0ID0gKGssIHYpID0+IHtcbiAgICAgICAgaWYgKCF6KVxuICAgICAgICAgIHogPSB7fVxuICAgICAgICB6W2tdID0gdlxuICAgICAgfVxuICAgICAgZm9yIChjb25zdCBrIGluIHkpIHtcbiAgICAgICAgaWYgKCEoayBpbiB0ZW1wbGF0ZSkpXG4gICAgICAgICAgc2V0KGssIHlba10pXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBpZiAoeCAmJiBrIGluIHgpXG4gICAgICAgICAgICBzZXQoaywgeFtrXSlcbiAgICAgIH1cbiAgICAgIHJldHVybiB6XG4gICAgfVxuICB9KVxuXG4vLyBFbmZvcmNpbmcgaW52YXJpYW50c1xuXG5leHBvcnQgY29uc3QgZGVmYXVsdHMgPSBvdXQgPT4gKEYsIHgyeUYsIHgpID0+XG4gICgwLEYubWFwKShyZXBsYWNlcihvdXQsIHVuZGVmaW5lZCksIHgyeUYoaXNEZWZpbmVkKHgpID8geCA6IG91dCkpXG5cbmV4cG9ydCBjb25zdCByZXF1aXJlZCA9IGlubiA9PiByZXBsYWNlKGlubiwgdW5kZWZpbmVkKVxuXG5leHBvcnQgY29uc3QgZGVmaW5lID0gdiA9PiBub3JtYWxpemVyKHggPT4gaXNEZWZpbmVkKHgpID8geCA6IHYpXG5cbmV4cG9ydCBjb25zdCBub3JtYWxpemUgPSB4MnggPT4gbm9ybWFsaXplcih0b1BhcnRpYWwoeDJ4KSlcblxuZXhwb3J0IGNvbnN0IHJld3JpdGUgPSB5MnkgPT4gKEYsIHgyeUYsIHgpID0+ICgwLEYubWFwKSh0b1BhcnRpYWwoeTJ5KSwgeDJ5Rih4KSlcblxuLy8gTGVuc2luZyBhcnJheXNcblxuZXhwb3J0IGNvbnN0IGFwcGVuZCA9IGxlbnMoc25kLCAoeCwgeHMpID0+XG4gIGlzRGVmaW5lZCh4KSA/IGlzQXJyYXkoeHMpID8geHMuY29uY2F0KFt4XSkgOiBbeF0gOiB1bkFycmF5KHhzKSlcblxuZXhwb3J0IGNvbnN0IGZpbHRlciA9IHAgPT4gbGVucyh4cyA9PiB1bkFycmF5KHhzKSAmJiB4cy5maWx0ZXIocCksICh5cywgeHMpID0+XG4gIGVtcHR5QXJyYXlUb1VuZGVmaW5lZChta0FycmF5KHlzKS5jb25jYXQobWtBcnJheSh4cykuZmlsdGVyKHggPT4gIXAoeCkpKSkpXG5cbmV4cG9ydCBjb25zdCBmaW5kID0gcHJlZGljYXRlID0+IGNob29zZSh4cyA9PiB7XG4gIGlmICghaXNBcnJheSh4cykpXG4gICAgcmV0dXJuIDBcbiAgY29uc3QgaSA9IHhzLmZpbmRJbmRleChwcmVkaWNhdGUpXG4gIHJldHVybiBpIDwgMCA/IGFwcGVuZCA6IGlcbn0pXG5cbmV4cG9ydCBmdW5jdGlvbiBmaW5kV2l0aCguLi5scykge1xuICBjb25zdCBsbHMgPSBjb21wb3NlKC4uLmxzKVxuICByZXR1cm4gW2ZpbmQoeCA9PiBpc0RlZmluZWQoZ2V0VShsbHMsIHgpKSksIGxsc11cbn1cblxuZXhwb3J0IGNvbnN0IGluZGV4ID0geCA9PlxuICBhc3NlcnQoeCwgaXNJbmRleCwgXCJgaW5kZXhgIGV4cGVjdHMgYSBub24tbmVnYXRpdmUgaW50ZWdlci5cIilcblxuLy8gTGVuc2luZyBvYmplY3RzXG5cbmV4cG9ydCBjb25zdCBwcm9wID0geCA9PlxuICBhc3NlcnQoeCwgaXNQcm9wLCBcImBwcm9wYCBleHBlY3RzIGEgc3RyaW5nLlwiKVxuXG5leHBvcnQgZnVuY3Rpb24gcHJvcHMoKSB7XG4gIGNvbnN0IG4gPSBhcmd1bWVudHMubGVuZ3RoLCB0ZW1wbGF0ZSA9IHt9XG4gIGZvciAobGV0IGk9MDsgaTxuOyArK2kpIHtcbiAgICBjb25zdCBrID0gYXJndW1lbnRzW2ldXG4gICAgdGVtcGxhdGVba10gPSBrXG4gIH1cbiAgcmV0dXJuIHBpY2sodGVtcGxhdGUpXG59XG5cbi8vIFByb3ZpZGluZyBkZWZhdWx0c1xuXG5leHBvcnQgY29uc3QgdmFsdWVPciA9IHYgPT4gKF9GLCB4MnlGLCB4KSA9PlxuICB4MnlGKGlzRGVmaW5lZCh4KSAmJiB4ICE9PSBudWxsID8geCA6IHYpXG5cbi8vIEFkYXB0aW5nIHRvIGRhdGFcblxuZXhwb3J0IGNvbnN0IG9yRWxzZSA9XG4gIGN1cnJ5MigoZCwgbCkgPT4gY2hvb3NlKHggPT4gaXNEZWZpbmVkKGdldFUobCwgeCkpID8gbCA6IGQpKVxuXG4vLyBSZWFkLW9ubHkgbWFwcGluZ1xuXG5leHBvcnQgY29uc3QgdG8gPSB4MnkgPT4gKEYsIHkyekYsIHgpID0+ICgwLEYubWFwKShhbHdheXMoeCksIHkyekYoeDJ5KHgpKSlcblxuZXhwb3J0IGNvbnN0IGp1c3QgPSB4ID0+IHRvKGFsd2F5cyh4KSlcblxuLy8gVHJhbnNmb3JtaW5nIGRhdGFcblxuZXhwb3J0IGNvbnN0IHBpY2sgPSB0ZW1wbGF0ZSA9PiAoRiwgeDJ5RiwgeCkgPT5cbiAgKDAsRi5tYXApKHNldFBpY2sodGVtcGxhdGUsIHgpLCB4MnlGKGdldFBpY2sodGVtcGxhdGUsIHgpKSlcblxuZXhwb3J0IGNvbnN0IHJlcGxhY2UgPSBjdXJyeTIoKGlubiwgb3V0KSA9PiAoRiwgeDJ5RiwgeCkgPT5cbiAgKDAsRi5tYXApKHJlcGxhY2VyKG91dCwgaW5uKSwgeDJ5RihyZXBsYWNlcihpbm4sIG91dCkoeCkpKSlcblxuLy8gT3BlcmF0aW9ucyBvbiBpc29tb3JwaGlzbXNcblxuZXhwb3J0IGNvbnN0IGdldEludmVyc2UgPSBjdXJyeTIoc2V0VSlcblxuLy8gQ3JlYXRpbmcgbmV3IGlzb21vcnBoaXNtc1xuXG5leHBvcnQgY29uc3QgaXNvID1cbiAgY3VycnkyKChid2QsIGZ3ZCkgPT4gKEYsIHgyeUYsIHgpID0+ICgwLEYubWFwKShmd2QsIHgyeUYoYndkKHgpKSkpXG5cbi8vIElzb21vcnBoaXNtcyBhbmQgY29tYmluYXRvcnNcblxuZXhwb3J0IGNvbnN0IGlkZW50aXR5ID0gKF9GLCB4MnlGLCB4KSA9PiB4MnlGKHgpXG5cbmV4cG9ydCBjb25zdCBpbnZlcnNlID0gaXNvID0+IChGLCBpbm5lciwgeCkgPT5cbiAgKDAsRi5tYXApKHggPT4gZ2V0VShpc28sIHgpLCBpbm5lcihzZXRVKGlzbywgeCkpKVxuIl19
