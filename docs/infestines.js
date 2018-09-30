(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.I = {})));
}(this, (function (exports) { 'use strict';

  var AP = 'ap';
  var CHAIN = 'chain';
  var MAP = 'map';
  var OF = 'of';

  var FANTASY_LAND_SLASH = 'fantasy-land/';
  var FANTASY_LAND_SLASH_OF = FANTASY_LAND_SLASH + OF;
  var FANTASY_LAND_SLASH_MAP = FANTASY_LAND_SLASH + MAP;
  var FANTASY_LAND_SLASH_AP = FANTASY_LAND_SLASH + AP;
  var FANTASY_LAND_SLASH_CHAIN = FANTASY_LAND_SLASH + CHAIN;

  var CONSTRUCTOR = 'constructor';
  var PROTOTYPE = 'prototype';

  //

  var id = function id(x) {
    return x;
  };

  //

  function _defineNameU(fn, value) {
    return Object.defineProperty(fn, 'name', { value: value, configurable: true });
  }

  var defineNameU = /*#__PURE__*/function () {
    try {
      return _defineNameU(_defineNameU, 'defineName');
    } catch (_) {
      return function (fn, _) {
        return fn;
      };
    }
  }();

  //

  var setName = function (to, name) {
    return defineNameU(to, name);
  };

  var copyName = function (to, from) {
    return defineNameU(to, from.name);
  };

  var withName = function (ary) {
    return function (fn) {
      return copyName(ary(fn), fn);
    };
  };

  //

  var ary1of2 = /*#__PURE__*/withName(function (fn) {
    return function (x0, x1) {
      return arguments.length < 2 ? fn(x0) : fn(x0)(x1);
    };
  });

  var ary2of2 = /*#__PURE__*/withName(function (fn) {
    return function (x0, x1) {
      return arguments.length < 2 ? copyName(function (x1) {
        return fn(x0, x1);
      }, fn) : fn(x0, x1);
    };
  });

  var ary1of3 = /*#__PURE__*/withName(function (fn) {
    return function (x0, x1, x2) {
      switch (arguments.length) {
        case 0:
        case 1:
          return curryN(2, fn(x0));
        case 2:
          return curryN(2, fn(x0))(x1);
        default:
          return curryN(2, fn(x0))(x1, x2);
      }
    };
  });

  var ary2of3 = /*#__PURE__*/withName(function (fn) {
    return function (x0, x1, x2) {
      switch (arguments.length) {
        case 0:
        case 1:
          return ary1of2(copyName(function (x1) {
            return fn(x0, x1);
          }, fn));
        case 2:
          return fn(x0, x1);
        default:
          return fn(x0, x1)(x2);
      }
    };
  });

  var ary3of3 = /*#__PURE__*/withName(function (fn) {
    return function (x0, x1, x2) {
      switch (arguments.length) {
        case 0:
        case 1:
          return ary2of2(copyName(function (x1, x2) {
            return fn(x0, x1, x2);
          }, fn));
        case 2:
          return copyName(function (x2) {
            return fn(x0, x1, x2);
          }, fn);
        default:
          return fn(x0, x1, x2);
      }
    };
  });

  var ary1of4 = /*#__PURE__*/withName(function (fn) {
    return function (x0, x1, x2, x3) {
      switch (arguments.length) {
        case 0:
        case 1:
          return curryN(3, fn(x0));
        case 2:
          return curryN(3, fn(x0))(x1);
        case 3:
          return curryN(3, fn(x0))(x1, x2);
        default:
          return curryN(3, fn(x0))(x1, x2, x3);
      }
    };
  });

  var ary2of4 = /*#__PURE__*/withName(function (fn) {
    return function (x0, x1, x2, x3) {
      switch (arguments.length) {
        case 0:
        case 1:
          return ary1of3(copyName(function (x1) {
            return fn(x0, x1);
          }, fn));
        case 2:
          return curryN(2, fn(x0, x1));
        case 3:
          return curryN(2, fn(x0, x1))(x2);
        default:
          return curryN(2, fn(x0, x1))(x2, x3);
      }
    };
  });

  var ary3of4 = /*#__PURE__*/withName(function (fn) {
    return function (x0, x1, x2, x3) {
      switch (arguments.length) {
        case 0:
        case 1:
          return ary2of3(copyName(function (x1, x2) {
            return fn(x0, x1, x2);
          }, fn));
        case 2:
          return ary1of2(copyName(function (x2) {
            return fn(x0, x1, x2);
          }, fn));
        case 3:
          return fn(x0, x1, x2);
        default:
          return fn(x0, x1, x2)(x3);
      }
    };
  });

  var ary4of4 = /*#__PURE__*/withName(function (fn) {
    return function (x0, x1, x2, x3) {
      switch (arguments.length) {
        case 0:
        case 1:
          return ary3of3(copyName(function (x1, x2, x3) {
            return fn(x0, x1, x2, x3);
          }, fn));
        case 2:
          return ary2of2(copyName(function (x2, x3) {
            return fn(x0, x1, x2, x3);
          }, fn));
        case 3:
          return copyName(function (x3) {
            return fn(x0, x1, x2, x3);
          }, fn);
        default:
          return fn(x0, x1, x2, x3);
      }
    };
  });

  var ary0of0 = function ary0of0(fn) {
    return fn.length === 0 ? fn : copyName(function () {
      return fn();
    }, fn);
  };
  var ary1of1 = function ary1of1(fn) {
    return fn.length === 1 ? fn : copyName(function (x) {
      return fn(x);
    }, fn);
  };

  var C = [[ary0of0], [ary1of1, ary1of1], [void 0, ary1of2, ary2of2], [void 0, ary1of3, ary2of3, ary3of3], [void 0, ary1of4, ary2of4, ary3of4, ary4of4]];

  var curryN = function curryN(n, f) {
    return C[n][Math.min(n, f.length)](f);
  };
  var arityN = function arityN(n, f) {
    return C[n][n](f);
  };
  var curry = function curry(f) {
    return arityN(f.length, f);
  };

  //

  var create = Object.create;

  var assign = Object.assign;

  var toObject = function toObject(x) {
    return assign({}, x);
  };

  //

  var always = function always(x) {
    return function (_) {
      return x;
    };
  };
  var applyU = function apply(x2y, x) {
    return x2y(x);
  };
  var sndU = function snd(_, y) {
    return y;
  };

  //

  var freeze = function freeze(x) {
    return x && Object.freeze(x);
  };

  var freezeInDev = freeze;

  var array0 = /*#__PURE__*/freeze([]);
  var object0 = /*#__PURE__*/freeze({});

  //

  var isDefined = function isDefined(x) {
    return void 0 !== x;
  };

  //

  var hasOwnProperty = Object[PROTOTYPE].hasOwnProperty;

  var hasU = function has(p, x) {
    return hasOwnProperty.call(x, p);
  };

  //

  var prototypeOf = function prototypeOf(x) {
    return null == x ? x : Object.getPrototypeOf(x);
  };

  var constructorOf = function constructorOf(x) {
    return null == x ? x : (hasU(CONSTRUCTOR, x) ? prototypeOf(x) : x)[CONSTRUCTOR];
  };

  //

  var isFunction = function isFunction(x) {
    return typeof x === 'function';
  };
  var isString = function isString(x) {
    return typeof x === 'string';
  };
  var isNumber = function isNumber(x) {
    return typeof x === 'number';
  };

  var isArray = Array.isArray;

  var object = /*#__PURE__*/prototypeOf({});
  var isObject = function isObject(x) {
    return null != x && typeof x === 'object' && (hasU(CONSTRUCTOR, x) ? prototypeOf(x) === object : x[CONSTRUCTOR] === Object);
  };

  //

  var isInstanceOfU = function isInstanceOf(C, x) {
    return x instanceof C;
  };

  //

  var pipe2U = function pipe2(fn1, fn2) {
    var n = fn1.length;
    return n === 1 ? function (x) {
      return fn2(fn1(x));
    } : arityN(n, function () {
      return fn2(fn1.apply(undefined, arguments));
    });
  };

  var compose2U = function compose2(fn1, fn2) {
    return pipe2U(fn2, fn1);
  };

  //

  function seq(x) {
    for (var _len = arguments.length, fns = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      fns[_key - 1] = arguments[_key];
    }

    for (var i = 0, n = fns.length; i < n; ++i) {
      x = fns[i](x);
    }return x;
  }

  function seqPartial(x) {
    for (var _len2 = arguments.length, fns = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      fns[_key2 - 1] = arguments[_key2];
    }

    for (var i = 0, n = fns.length; isDefined(x) && i < n; ++i) {
      x = fns[i](x);
    }return x;
  }

  //

  var identicalU = function identical(a, b) {
    return a === b && (a !== 0 || 1 / a === 1 / b) || a !== a && b !== b;
  };

  //

  var whereEqU = function whereEq(t, o) {
    for (var k in t) {
      var bk = o[k];
      if (!isDefined(bk) && !hasU(k, o) || !acyclicEqualsU(t[k], bk)) return false;
    }
    return true;
  };

  //

  var hasKeysOfU = function hasKeysOf(t, o) {
    for (var k in t) {
      if (!hasU(k, o)) return false;
    }return true;
  };

  //

  var acyclicEqualsObject = function acyclicEqualsObject(a, b) {
    return whereEqU(a, b) && hasKeysOfU(b, a);
  };

  function acyclicEqualsArray(a, b) {
    var n = a.length;
    if (n !== b.length) return false;
    for (var i = 0; i < n; ++i) {
      if (!acyclicEqualsU(a[i], b[i])) return false;
    }return true;
  }

  var acyclicEqualsU = function acyclicEquals(a, b) {
    if (identicalU(a, b)) return true;
    if (!a || !b) return false;
    var c = constructorOf(a);
    if (c !== constructorOf(b)) return false;
    switch (c) {
      case Array:
        return acyclicEqualsArray(a, b);
      case Object:
        return acyclicEqualsObject(a, b);
      default:
        return isFunction(a.equals) && a.equals(b);
    }
  };

  //

  var unzipObjIntoU = function unzipObjInto(o, ks, vs) {
    for (var k in o) {
      if (ks) ks.push(k);
      if (vs) vs.push(o[k]);
    }
  };

  function keys(o) {
    if (isInstanceOfU(Object, o)) {
      if (isObject(o)) {
        var ks = [];
        unzipObjIntoU(o, ks, 0);
        return ks;
      } else {
        return Object.keys(o);
      }
    }
  }

  function values(o) {
    if (isInstanceOfU(Object, o)) {
      if (isObject(o)) {
        var vs = [];
        unzipObjIntoU(o, 0, vs);
        return vs;
      } else {
        var xs = Object.keys(o);
        var n = xs.length;
        for (var i = 0; i < n; ++i) {
          xs[i] = o[xs[i]];
        }return xs;
      }
    }
  }

  //

  var assocPartialU = function assocPartial(k, v, o) {
    var r = {};
    if (o instanceof Object) {
      if (!isObject(o)) o = toObject(o);
      for (var l in o) {
        if (l !== k) {
          r[l] = o[l];
        } else {
          r[k] = v;
          k = void 0;
        }
      }
    }
    if (isDefined(k)) r[k] = v;
    return r;
  };

  var dissocPartialU = function dissocPartial(k, o) {
    var r = void 0;
    if (o instanceof Object) {
      if (!isObject(o)) o = toObject(o);
      for (var l in o) {
        if (l !== k) {
          if (!r) r = {};
          r[l] = o[l];
        } else {
          k = void 0;
        }
      }
    }
    return r;
  };

  //

  var inherit = function inherit(Derived, Base, protos, statics) {
    return assign(Derived[PROTOTYPE] = create(Base[PROTOTYPE]), protos)[CONSTRUCTOR] = assign(Derived, statics);
  };

  //

  function Functor(map) {
    if (!isInstanceOfU(Functor, this)) return freezeInDev(new Functor(map));
    this[MAP] = map;
  }

  var Applicative = /*#__PURE__*/inherit(function Applicative(map, of, ap) {
    if (!isInstanceOfU(Applicative, this)) return freezeInDev(new Applicative(map, of, ap));
    Functor.call(this, map);
    this[OF] = of;
    this[AP] = ap;
  }, Functor);

  var Monad = /*#__PURE__*/inherit(function Monad(map, of, ap, chain) {
    if (!isInstanceOfU(Monad, this)) return freezeInDev(new Monad(map, of, ap, chain));
    Applicative.call(this, map, of, ap);
    this[CHAIN] = chain;
  }, Applicative);

  //

  var Identity = /*#__PURE__*/Monad(applyU, id, applyU, applyU);

  var IdentityOrU = function IdentityOr(isOther, other) {
    var map = other[MAP];
    var ap = other[AP];
    var of = other[OF];
    var chain = other[CHAIN];
    var mapEither = function mapEither(xy, xM) {
      return isOther(xM) ? map(xy, xM) : xy(xM);
    };
    var toOther = function toOther(x) {
      return isOther(x) ? x : of(x);
    };
    return Monad(mapEither, id, function apEither(xyM, xM) {
      return isOther(xyM) ? isOther(xM) ? ap(xyM, xM) : map(function (xy) {
        return xy(xM);
      }, xyM) : mapEither(xyM, xM);
    }, function chainEither(xyM, xM) {
      return isOther(xM) ? chain(function (x) {
        return toOther(xyM(x));
      }, xM) : xyM(xM);
    });
  };

  //

  var isThenable = function isThenable(xP) {
    return null != xP && isFunction(xP.then);
  };

  var thenU = function then(xyP, xP) {
    return xP.then(xyP);
  };

  var resolve = function resolve(x) {
    return Promise.resolve(x);
  };

  var Async = /*#__PURE__*/Monad(thenU, resolve, function apAsync(xyP, xP) {
    return thenU(function (xy) {
      return thenU(xy, xP);
    }, xyP);
  }, thenU);

  var IdentityAsync = /*#__PURE__*/IdentityOrU(isThenable, Async);

  //

  var fantasyBop = function fantasyBop(m) {
    return setName(function (f, x) {
      return x[m](f);
    }, m);
  };
  var fantasyMap = /*#__PURE__*/fantasyBop(FANTASY_LAND_SLASH_MAP);
  var fantasyAp = /*#__PURE__*/fantasyBop(FANTASY_LAND_SLASH_AP);
  var fantasyChain = /*#__PURE__*/fantasyBop(FANTASY_LAND_SLASH_CHAIN);

  var FantasyFunctor = /*#__PURE__*/Functor(fantasyMap);

  var fromFantasyApplicative = function fromFantasyApplicative(Type) {
    return Applicative(fantasyMap, Type[FANTASY_LAND_SLASH_OF], fantasyAp);
  };
  var fromFantasyMonad = function fromFantasyMonad(Type) {
    return Monad(fantasyMap, Type[FANTASY_LAND_SLASH_OF], fantasyAp, fantasyChain);
  };

  var fromFantasy = function fromFantasy(Type) {
    return Type.prototype[FANTASY_LAND_SLASH_CHAIN] ? fromFantasyMonad(Type) : Type[FANTASY_LAND_SLASH_OF] ? fromFantasyApplicative(Type) : FantasyFunctor;
  };

  exports.id = id;
  exports.defineNameU = defineNameU;
  exports.curryN = curryN;
  exports.arityN = arityN;
  exports.curry = curry;
  exports.create = create;
  exports.assign = assign;
  exports.toObject = toObject;
  exports.always = always;
  exports.applyU = applyU;
  exports.sndU = sndU;
  exports.freeze = freeze;
  exports.array0 = array0;
  exports.object0 = object0;
  exports.isDefined = isDefined;
  exports.hasU = hasU;
  exports.prototypeOf = prototypeOf;
  exports.constructorOf = constructorOf;
  exports.isFunction = isFunction;
  exports.isString = isString;
  exports.isNumber = isNumber;
  exports.isArray = isArray;
  exports.isObject = isObject;
  exports.isInstanceOfU = isInstanceOfU;
  exports.pipe2U = pipe2U;
  exports.compose2U = compose2U;
  exports.seq = seq;
  exports.seqPartial = seqPartial;
  exports.identicalU = identicalU;
  exports.whereEqU = whereEqU;
  exports.hasKeysOfU = hasKeysOfU;
  exports.acyclicEqualsObject = acyclicEqualsObject;
  exports.acyclicEqualsU = acyclicEqualsU;
  exports.unzipObjIntoU = unzipObjIntoU;
  exports.keys = keys;
  exports.values = values;
  exports.assocPartialU = assocPartialU;
  exports.dissocPartialU = dissocPartialU;
  exports.inherit = inherit;
  exports.Functor = Functor;
  exports.Applicative = Applicative;
  exports.Monad = Monad;
  exports.Identity = Identity;
  exports.IdentityOrU = IdentityOrU;
  exports.isThenable = isThenable;
  exports.resolve = resolve;
  exports.Async = Async;
  exports.IdentityAsync = IdentityAsync;
  exports.FantasyFunctor = FantasyFunctor;
  exports.fromFantasyApplicative = fromFantasyApplicative;
  exports.fromFantasyMonad = fromFantasyMonad;
  exports.fromFantasy = fromFantasy;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
