# Changelog

## 9.0.0

`L.augment`, `L.pick` and `L.props` can now be written with an `instanceof
Object` or `undefined`.  Other values are considered errors.  Previously they
could be written with anything, but only a plain `Object` was considered.

`L.slice` and `L.filter` can now be written with an array-like object or
`undefined`.  Other values are considered errors.  This was the case earlier
already, but now it is asserted in non-production builds.

`L.index` no longer produces `null` for previously undefined elements.
`L.index` was changed in 4.0.0 to produce `null` elements.  In 8.0.0 treatment
of array-like objects was relaxed, but array producing optics did not
consistently produce `null` elements.  With the relaxed semantics it seems that
producing `null` values would complicate treatment of arrays, so it seems best
to just produce arrays with `undefined` for previously undefined elements.

## 8.0.0

Relaxed treatment of objects and array like objects.  Previously various optics
required objects to have either `Object` or `Array` as the constructor.  Now any
`instanceof Object` is allowed where previously `Object` constructor was
required and a `String` or an `Object` with non-negative integer `length` is
allowed where previously `Array` constructor was required.  This addresses
issue [40](https://github.com/calmm-js/partial.lenses/issues/40).  See the
documentation of `L.prop` and `L.index` for more details.  The `L.branch`,
`L.elems` and `L.values` traversals have similarly relaxed treatment.

The previously deprecated `L.sequence` traversal was removed.  You need to
explicitly choose either `L.elems` or `L.values`.

Previously undocumented, but accidentally tested for behavior of index lenses to
allow negative indices was removed.  The old behavior was to ignore negative
indices.  The new behavior is to throw an `Error` in non-`production` builds.
Behaviour in `production` builds is undefined.

Removed deprecated `foldMapOf` and `collectMap`.  Use `concatAs` and `collectAs`
instead.

## 7.4.0

Index lenses previously supported using negative indices so that writing through
a negative index was effectively a no-op.  This behavior will not be supported
in the next major version.

## 7.3.0

Deprecated `L.sequence` and introduced `L.elems`, which operates on arrays, and,
`L.values`, which operates on objects, to be used instead.  `L.sequence`
originally only operated on arrays, but it was generalized to operate on objects
in 6.0.0.  Unfortunately that turned out to be a mistake, because in the next
major version, 8.0.0, the plan is to relax the treatment of objects and array
like objects.  The problem is that, with the generalized semantics, the type of
the result, object or array, when writing through `L.sequence` would depend on
the input in an uncontrollable manner.  Apologies for the inconvenience!

## 7.0.0

Added minimal support for indexing.  Various operations and combinators now
provide an index value, either a number for an array index, or a string for an
object property, or undefined in case there is no meaningful index, for the
immediate index being addressed to the user-defined function taken by the
operation or combinator.

## 6.0.0

Removed `L.fromArrayBy`.  It was introduced as an experiment, but the use cases
I had in mind didn't seem to benefit from it.  If you need it, you can use this:

```js
const fromArrayBy = id =>
  iso(xs => {
    if (R.is(Array, xs)) {
      const o = {}, n=xs.length
      for (let i=0; i<n; ++i) {
        const x = xs[i]
        o[x[id]] = x
      }
      return o
    }
  },
  o => R.is(Object, o) ? R.values(o) : undefined)
```

The lens `L.nothing` and the traversal `L.skip` were merged into a single
`L.zero` optic that works like `L.nothing` when being viewed, using `L.get`, and
otherwise like `L.skip`.  The main benefit of this is that it allows "querying"
combinators `L.chain`, `L.choice`, and `L.when` use the one and same `L.zero`
and work without additional glue as traversals.

Generalized the `L.sequence` traversal to also operate on the values of objects.

Removed the defaul import.  The array notation for composition is recommended as
the shorthand of choice.

## 5.3.0

Marked the default import for removal.  With the array shorthand for composition
the default import is no longer worth keeping.

## 5.0.0

Reimplemented library internals
using [Static Land](https://github.com/rpominov/static-land) style dictionaries,
switched to using `infernals` and dropped Ramda dependency and interop.  These
changes were made for the following reasons:

* `infernals` is, and is supposed to remain, a tiny library.  This is an
  advantage if one wishes to use lenses, but does not wish to use Ramda.

* Performance of traversals, and folds over traversals in particular, is and can
  now be significantly improved, because Static Land does not
  require [wrapping](https://github.com/rpominov/static-land#pros) or boxing
  primitive values.

To interop with Ramda, you can write:

```js
import * as L from "partial.lenses"
import * as R from "ramda"

const fromRamda = ramdaLens => L.lens(R.view(ramdaLens), R.set(ramdaLens))
const toRamda = partialLens => R.lens(L.get(partialLens), L.set(partialLens))
```

## 4.0.0

* Removed previously deprecated functionality: `removeAll`.
* Sparse arrays are no longer supported.

## 3.9.2

Although never explicitly specified in documentation, many of the operations and
combinators were curried using Ramda's `curry`.  Unfortunately Ramda's `curry`
is very slow.  From this version forward partial lenses no longer supports the
special features of Ramda's `curry` like placeholders.

## 3.4.1

Fixed bugs when removing a non-existing property from an object or a
non-existent index from an array.  Previously `L.remove("x", {})` returned `{}`.
Now it returns `undefined` as it was previously documented.  Similarly
`L.remove(index, [])` now returns `undefined` as was documented.

Tightened the semantics of combinators, including `L.index`, `L.filter`,
`L.prop` and `L.augment` (and other combinators whose semantics are defined in
terms of those), that specifically work on objects or arrays.  Previously such
combinators worked asymmetrically when operating on values not in their domain.
Now they consistently treat values that are not in their domain as `undefined`.
For example, `L.get("x", null)` now returns `undefined` (previously `null`) and,
consistently, `L.set("x", 1, null)` now returns `{x: 1}` (previously error).

## 3.4.0

Added minimalistic *experimental* traversal support in the form of the
`sequence` traversal.

## 3.0.0

Dropped *implicit* Ramda compatibility.  To interop with Ramda, one must now
explicitly convert lenses using `L.toRamda` and `L.fromRamda`.  In particular,
`L.compose` no longer necessarily returns a Ramda compatible lens and, in the
future, the implementation may be changed more drastically.  This change was
made, because now a lens returned by `L.compose` can take less memory and it
will also be possible to further optimize the implementation in the future.

Removed deprecated functions `L.view`, `L.over` and `L.firstOf`.

## 2.2.0

Renamed `L.view` and `L.over`:

```diff
-L.view
+L.get
```

```diff
-L.over
+L.modify
```

Calling deprecated functions now results in `console.warn` messages.

## 2.1.0

Deprecated `L.firstOf` and added `L.choice`, `L.nothing` and `L.orElse` that
allows the same (and more) functionality to be expressed more compositionally.

## 2.0.0

Changed from using a single default export to named exports to support dead-code
elimination, aka tree shaking.  A number of combinators were renamed in the
process and the default import is now an alias for `compose` that may help to
keep notation concise.

### Upgrade guide

Now using named exports and default that aliases `compose`:

```diff
-import L from "partial.lenses"
+import P, * as L from "partial.lenses"
```

Module prefix no longer works as `compose`:

```diff
-L(...)
+P(...) or L.compose(...)
```

`default` is a keyword and had to be renamed:

```diff
-L.default
+L.defaults
```

`delete` is a keyword and had to be renamed:

```diff
-L.delete
+L.remove
```

```diff
-L.deleteAll
+L.removeAll
```
