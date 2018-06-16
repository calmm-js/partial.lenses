(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.I = {})));
}(this, (function (exports) { 'use strict';

  var id = function id(x) {
    return x;
  };

  //

  var defineNameU = /*#__PURE__*/function () {
    var _defineNameU = function _defineNameU(fn, value) {
      return Object.defineProperty(fn, 'name', { value: value });
    };
    try {
      return _defineNameU(_defineNameU, _defineNameU.name.slice(1));
    } catch (_) {
      return function (fn, _) {
        return fn;
      };
    }
  }();

  var copyName = function (to, from) {
    return defineNameU(to, from.name);
  };

  var withName = function (ary) {
    return function (fn) {
      return copyName(ary(fn), fn);
    };
  };

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
  var applyU = function applyU(x2y, x) {
    return x2y(x);
  };
  var sndU = function sndU(_, y) {
    return y;
  };

  //

  var freeze = function freeze(x) {
    return x && Object.freeze(x);
  };

  var array0 = /*#__PURE__*/freeze([]);
  var object0 = /*#__PURE__*/freeze({});

  //

  var isDefined = function isDefined(x) {
    return void 0 !== x;
  };

  //

  var hasU = function hasU(p, x) {
    return Object.prototype.hasOwnProperty.call(x, p);
  };

  //

  var prototypeOf = function prototypeOf(x) {
    return null == x ? x : Object.getPrototypeOf(x);
  };

  var constructorOf = function constructorOf(x) {
    return null == x ? x : (hasU('constructor', x) ? prototypeOf(x) : x).constructor;
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
    return null != x && typeof x === 'object' && (hasU('constructor', x) ? prototypeOf(x) === object : x.constructor === Object);
  };

  //

  function pipe2U(fn1, fn2) {
    var n = fn1.length;
    return n === 1 ? function (x) {
      return fn2(fn1(x));
    } : arityN(n, function () {
      return fn2(fn1.apply(undefined, arguments));
    });
  }

  var compose2U = function compose2U(fn1, fn2) {
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

  var identicalU = function identicalU(a, b) {
    return a === b && (a !== 0 || 1 / a === 1 / b) || a !== a && b !== b;
  };

  //

  function whereEqU(t, o) {
    for (var k in t) {
      var bk = o[k];
      if (!isDefined(bk) && !hasU(k, o) || !acyclicEqualsU(t[k], bk)) return false;
    }
    return true;
  }

  //

  function hasKeysOfU(t, o) {
    for (var k in t) {
      if (!hasU(k, o)) return false;
    }return true;
  }

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

  function acyclicEqualsU(a, b) {
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
  }

  //

  function unzipObjIntoU(o, ks, vs) {
    for (var k in o) {
      if (ks) ks.push(k);
      if (vs) vs.push(o[k]);
    }
  }

  function keys(o) {
    if (o instanceof Object) {
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
    if (o instanceof Object) {
      if (isObject(o)) {
        var vs = [];
        unzipObjIntoU(o, 0, vs);
        return vs;
      } else {
        var xs = Object.keys(o),
            n = xs.length;
        for (var i = 0; i < n; ++i) {
          xs[i] = o[xs[i]];
        }return xs;
      }
    }
  }

  //

  function assocPartialU(k, v, o) {
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
  }

  function dissocPartialU(k, o) {
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
  }

  //

  var inherit = function inherit(Derived, Base, protos, statics) {
    return assign(Derived.prototype = Object.create(Base.prototype), protos).constructor = assign(Derived, statics);
  };

  exports.id = id;
  exports.defineNameU = defineNameU;
  exports.curryN = curryN;
  exports.arityN = arityN;
  exports.curry = curry;
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

  Object.defineProperty(exports, '__esModule', { value: true });

})));
