[![npm version](https://badge.fury.io/js/partial.lenses.svg)](http://badge.fury.io/js/partial.lenses)

This library provides a collection of [Ramda](http://ramdajs.com/) compatible
*partial* lenses.  While an ordinary lens can be used to view and update an
existing part of a data structure, a partial lens can *view* optional data,
*insert* new data, *update* existing data and *delete* existing data.

Index:
* [Examples](#examples)
* [Reference](#reference)
* [Background](#background)

## Examples

TBD

## Reference

### Usage

The lenses and operations on lenses are accessed via the default import:

```js
import L from "partial.lenses"
```

### Operations on lenses

For convenience, you can access basic operations on lenses via the default
import `L`:

* `L.compose(l1, ..., ln)` is the same as `R.compose(l1, ..., lN)` (see [compose](http://ramdajs.com/0.19.0/docs/#compose)).
* `L.lens(get, set)` is the same as `R.lens(get, set)` (see [lens](http://ramdajs.com/0.19.0/docs/#lens)).
* `L.over(l, x2x, s)` is the same as `R.over(l, x2x, s)` (see [over](http://ramdajs.com/0.19.0/docs/#over)).
* `L.set(l, x, s)` is the same as `R.set(l, x, s)` (see [set](http://ramdajs.com/0.19.0/docs/#set)).
* `L.view(l, s)` is the same as `R.view(l, s)` (see [view](http://ramdajs.com/0.19.0/docs/#view)).

For convenience, there is also a shorthand for delete:

* `L.delete(l, s)` is the same as `R.set(l, undefined, s)`.

### Shorthand composition and lifting

The default import, `L`, is also a shorthand function for lens composition (see
[compose](http://ramdajs.com/0.19.0/docs/#compose)) and lifting.  The semantics
can be described as

```
L(l1, ..., lN) === R.compose(lift(l1), ..., lift(lN))
```

where

```js
const lift = l => {
  switch (typeof l) {
  case "string": return L.prop(l)
  case "number": return L.index(l)
  default:       return l
  }
}
```

Note that `L.compose` does not perform lifting.

### Lenses

#### L.prop(string)

`L.prop(string)` is much like `R.lensProp(string)` (see
[lensProp](http://ramdajs.com/0.19.0/docs/#lensProp)), but composes as a partial
lens:
* When viewing an undefined property or an undefined object, the result is
  undefined.
* When setting property to undefined, the property is removed from the result.
  If the result would be an empty object, the whole result will be undefined.

Examples:

```js
> L.set(L("x", "y"), undefined, {x: {y: 1}})
undefined
> L.set(L("x", "y"), 2, {x: {y: 1}})
{ x: { y: 2 } }
> L.set(L("x", "y"), undefined, {x: {y: 1}, z: 3})
{ z: 3 }
> L.set(L("x", "y"), 2, {x: {y: 1}, z: 3})
{ x: { y: 2 }, z: 3 }
> L.view(L("x", "y"), undefined)
undefined
```

#### L.index(integer)

`L.index(integer)` is like `R.lensIndex(integer)` (see
[lensIndex](http://ramdajs.com/0.19.0/docs/#lensIndex)), but composes as a
partial lens:
* When viewing an undefined array index or an undefined array, the result is
  undefined.
* When setting an array index to undefined, the element is removed from the
  resulting array, shifting all higher indices down by one.  If the result would
  be an array without indices (ignoring length), the whole result will be
  undefined.

#### L.find(predicate)

`L.find(predicate)` operates on arrays like `L.index`, but the index to be
viewed is determined by finding the first element from the input array that
matches the given unary predicate.  When no matching element is found the effect
is same as with `R.index` with the index set to the length of the array.

#### L.normalize(transform)

`L.normalize(transform)` maps the value with same given `transform` when viewed
and set and implicitly maps undefined to undefined.  More specifically,
`L.normalize(transform)` is equivalent to `R.lens(toPartial(transform),
toPartial(transform))` where

```js
const toPartial = transform => x => undefined === x ? x : transform(x)
```

The use case for `normalize` is to make it easy to determine whether, after a
change, the data has actually changed.  By keeping the data normalized, a simple
`R.equals` comparison will do.

#### L.replace(inn, out)

`L.replace(inn, out)`, when viewed, replaces the value `inn` with `out` and vice
versa when set.  Values are compared using `R.equals` (see
[equals](http://ramdajs.com/0.19.0/docs/#equals)).

Examples:

```js
> L.view(L(L.replace(undefined, {type: "title", text: ""}),
           "text"),
         undefined)
""
> L.set(L(L.replace(undefined, {type: "title", text: ""}),
          "text"),
        "",
        {type: "title", text: "not empty"})
undefined
```

The use case for `replace` is to handle optional properties and elements.

#### L.default(out)

`L.default(out)` is the same as `L.replace(undefined, out)`.

## Background

### Motivation

Consider the following REPL session using Ramda 0.19.1:

```js
> R.set(R.lensPath(["x", "y"]), 1, {})
{ x: { y: 1 } }
> R.set(R.compose(R.lensProp("x"), R.lensProp("y")), 1, {})
TypeError: Cannot read property 'y' of undefined
> R.view(R.lensPath(["x", "y"]), {})
undefined
> R.view(R.compose(R.lensProp("x"), R.lensProp("y")), {})
TypeError: Cannot read property 'y' of undefined
> R.set(R.lensPath(["x", "y"]), undefined, {x: {y: 1}})
{ x: { y: undefined } }
> R.set(R.compose(R.lensProp("x"), R.lensProp("y")), undefined, {x: {y: 1}})
{ x: { y: undefined } }
```

One might assume that `R.lensPath([p1, ..., pN])` is equivalent to
`R.compose(R.lensProp(p1), ..., R.lensProp(pN))`, but that is not the case.

With partial lenses you can robustly compose a path lens from prop lenses
`R.compose(L.prop(p1), ..., L.prop(pN))` or just use the shorthand notation
`L(p1, ..., pN)`.

### Technical

To illustrate the idea we could give lenses the naive type definition

```haskell
type Lens s a = (s -> a, a -> s -> s)
```

defining a lens as a pair of a getter and a setter.  The type of a partial lens
would then be

```haskell
type PartialLens s a = (s -> Maybe a, Maybe a -> s -> s)
```

which we can simplify to

```haskell
type PartialLens s a = Lens s (Maybe a)
```

This means that partial lenses can be composed, viewed, mapped over and set
using the same operations as with ordinary lenses.  However, primitive partial
lenses (e.g. [L.prop](#lpropstring)) are not necessarily the same as primitive
ordinary lenses (e.g. Ramda's
[lensProp](http://ramdajs.com/0.19.0/docs/#lensProp)).

In Javascript, optional data can be mapped to `undefined`, which is what partial
lenses also do.  When the viewed part of a data structure is missing, the result
is `undefined`.  When a part of a data structure is set to `undefined`, the part
is deleted.  Partial lenses are defined in such a way that operations compose
and one can conveniently and robustly operate on deeply nested data structures.
