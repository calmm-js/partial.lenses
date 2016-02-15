[ [Examples](#examples) | [Reference](#reference) | [Background](#background) ]

This library provides a collection of [Ramda](http://ramdajs.com/) compatible
*partial* lenses.  While an ordinary lens can be used to view and update an
existing part of a data structure, a partial lens can *view* optional data,
*insert* new data, *update* existing data and *delete* existing data and can
provide *default* values and maintain *required* data structure parts.

In Javascript, missing data can be mapped to `undefined`, which is what partial
lenses also do.  When a part of a data structure is missing, an attempt to view
it returns `undefined`.  When a part is missing, setting it to a defined value
inserts the new part.  Setting an existing part to `undefined` deletes it.
Partial lenses are defined in such a way that operations compose and one can
conveniently and robustly operate on deeply nested data structures.

[![npm version](https://badge.fury.io/js/partial.lenses.svg)](http://badge.fury.io/js/partial.lenses)

## Examples

Let's work with the following sample JSON object:

```js
const data = { contents: [ { language: "en", text: "Title" },
                           { language: "sv", text: "Rubrik" } ] }
```

First we define a parameterized lens for accessing texts:

```js
const textIn = language =>
  L.compose(L.prop("contents"),
            L.required([]),
            L.normalize(R.sortBy(R.prop("language"))),
            L.find(R.whereEq({language})),
            L.default({language}),
            L.prop("text"),
            L.default(""))
```

Like with ordinary lenses, we can now use the partial lens to view or query
texts:

```js
> L.view(textIn("sv"), data)
"Rubrik"
> L.view(textIn("en"), data)
"Title"
```

If we query a text that does not exist, we get the default:

```js
> L.view(textIn("fi"), data)
""
```

With the partial lens we defined, we get the default even if we query from
`undefined`:

```js
> L.view(textIn("fi"), undefined)
""
```

With partial lenses, `undefined` is the equivalent of empty or non-existent.

As with ordinary lenses, we can use the same lens to update texts:

```js
> L.set(textIn("en"), "The title", data)
{ contents: [ { language: "en", text: "The title" },
              { language: "sv", text: "Rubrik" } ] }
```

The same partial lens also allows us to insert new texts:

```js
> L.set(textIn("fi"), "Otsikko", data)
{ contents: [ { language: "en", text: "Title" },
              { language: "fi", text: "Otsikko" },
              { language: "sv", text: "Rubrik" } ] }
```

Note the position into which the new text was inserted.

Finally, we can use the same partial lens to delete texts:

```js
> L.set(textIn("sv"), undefined, data)
{ contents: [ { language: "en", text: "Title" } ] }
```

If we delete all of the texts, we get the required value:

```js
> R.pipe(L.set(textIn("sv"), undefined),
         L.set(textIn("en"), undefined))(data)
{ contents: [] }
```

Note that unless required and default values are explicitly specified as part of
the lens, they will both be undefined.

For clarity, the code snippets in this section avoided some of the shorthands
that this library supports.  In particular,
* `L.compose(...)` can be abbreviated as `L(...)`,
* `L.prop(string)` can be abbreviated as `string`, and
* `L.set(l, undefined, s)` can be abbreviated as `L.delete(l, s)`.

## Reference

### Usage

The lenses and operations on lenses are accessed via the default import:

```js
import L from "partial.lenses"
```

### Operations on lenses

You can access basic operations on lenses via the default import `L`:

* `L(l, ...ls)` and `L.compose(l, ...ls)` both are the same as
  `R.compose(lift(l), ...ls.map(lift))` (see
  [compose](http://ramdajs.com/0.19.0/docs/#compose)).
* `L.lens(get, set)` is the same as `R.lens(get, set)` (see
  [lens](http://ramdajs.com/0.19.0/docs/#lens)).
* `L.over(l, x2x, s)` is the same as `R.over(lift(l), x2x, s)` (see
  [over](http://ramdajs.com/0.19.0/docs/#over)).
* `L.set(l, x, s)` is the same as `R.set(lift(l), x, s)` (see
  [set](http://ramdajs.com/0.19.0/docs/#set)).
* `L.view(l, s)` is the same as `R.view(lift(l), s)` (see
  [view](http://ramdajs.com/0.19.0/docs/#view)).

#### Lifting

The idempotent `lift` operation is defined as

```js
const lift = l => {
  switch (typeof l) {
  case "string": return L.prop(l)
  case "number": return L.index(l)
  default:       return l
  }
}
```

and is available as a non-default export.  All operations in this library that
take lenses as arguments implicitly lift them.

#### L.delete(l, s)

For convenience, there is also a shorthand for delete:

* `L.delete(l, s)` is the same as `R.set(lift(l), undefined, s)`.

### Lenses

In alphabetical order.

#### L.append

`L.append` is a special lens that operates on arrays.  The view of `L.append` is
always undefined.  Setting `L.append` to undefined has no effect by itself.
Setting `L.append` to a defined value appends the value to the end of the
focused array.

#### L.choose(maybeValue => PartialLens)

`L.choose(maybeValue => PartialLens)` creates a lens whose operation is
determined by the given function that maps the underlying view, which can be
undefined, to a lens.

#### L.filter(predicate)

`L.filter(predicate)` operates on arrays.  When viewed, only elements matching
the given predicate will be returned.  When set, the resulting array will be
formed by concatenating the set array and the complement of the filtered
context.  If the resulting array would be empty, the whole result will be
undefined.

*Note:* An alternative design for filter could implement a smarter algorithm to
combine arrays when set.  For example, an algorithm based on
[edit distance](https://en.wikipedia.org/wiki/Edit_distance) could be used to
maintain relative order of elements.  While this would not be difficult to
implement, it doesn't seem to make sense, because in most cases use of
`normalize` would be preferable.

#### L.find(value => boolean)

`L.find(value => boolean)` operates on arrays like `L.index`, but the index to
be viewed is determined by finding the first element from the input array that
matches the given predicate.  When no matching element is found the effect is
same as with `R.index` with the index set to the length of the array.

#### L.firstOf(l, ...ls)

`L.firstOf(l, ...ls)` returns a partial lens that acts like the first of the
given lenses, `l, ...ls`, whose view is not undefined on the given target.  When
the views of all of the given lenses are undefined, the returned lens acts like
`l`.

Note that `L.firstOf` is an associative operation, but there is no identity
element.

#### L.index(integer)

`L.index(integer)` or `L(integer)` is similar to `R.lensIndex(integer)` (see
[lensIndex](http://ramdajs.com/0.19.0/docs/#lensIndex)), but acts as a partial
lens:
* When viewing an undefined array index or an undefined array, the result is
  undefined.
* When setting an array index to undefined, the element is removed from the
  resulting array, shifting all higher indices down by one.  If the result would
  be an array without indices (ignoring length), the whole result will be
  undefined.

#### L.normalize(value => value)

`L.normalize(value => value)` maps the value with same given transform when
viewed and set and implicitly maps undefined to undefined.  More specifically,
`L.normalize(transform)` is equivalent to `R.lens(toPartial(transform),
toPartial(transform))` where

```js
const toPartial = transform => x => undefined === x ? x : transform(x)
```

The main use case for `normalize` is to make it easy to determine whether, after
a change, the data has actually changed.  By keeping the data normalized, a
simple `R.equals` comparison will do.

#### L.prop(string)

`L.prop(string)` or `L(string)` is similar to `R.lensProp(string)` (see
[lensProp](http://ramdajs.com/0.19.0/docs/#lensProp)), but acts as a partial
lens:
* When viewing an undefined property or an undefined object, the result is
  undefined.
* When setting property to undefined, the property is removed from the result.
  If the result would be an empty object, the whole result will be undefined.

#### L.replace(inn, out)

`L.replace(inn, out)`, when viewed, replaces the value `inn` with `out` and vice
versa when set.  Values are compared using `R.equals` (see
[equals](http://ramdajs.com/0.19.0/docs/#equals)).

The main use case for `replace` is to handle optional and required properties
and elements.  In most cases, rather than using `replace`, you will make
selective use of `default` and `required`:

##### L.default(out)

`L.default(out)` is the same as `L.replace(undefined, out)`.

##### L.define(value)

`L.define(value)` is the same as `L(L.required(value), L.default(value))`.

##### L.required(inn)

`L.required(inn)` is the same as `L.replace(inn, undefined)`.

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

One might assume that `R.lensPath([p0, ...ps])` is equivalent to
`R.compose(R.lensProp(p0), ...ps.map(R.lensProp))`, but that is not the case.

With partial lenses you can robustly compose a path lens from prop lenses
`R.compose(L.prop(p0), ...ps.map(L.prop))` or just use the shorthand notation
`L(p0, ...ps)`.

### Types

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
