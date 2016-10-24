[ [Tutorial](#tutorial) | [Reference](#reference) | [Background](#background) ]

Lenses are primarily a convenient abstraction for performing updates on
individual elements of immutable data structures.  This library provides a
collection of *partial* lenses.  A partial lens can *view* optional data,
*insert* new data, *update* existing data and *remove* existing data and can,
for example, provide *defaults* and maintain *required* data structure parts.

In JavaScript, missing data can be mapped to `undefined`, which is what partial
lenses also do.  When a part of a data structure is missing, an attempt to view
it returns `undefined`.  When a part is missing, setting it to a defined value
inserts the new part.  Setting an existing part to `undefined` removes it.
Partial lenses are defined in such a way that operations [`compose`](#compose)
and one can conveniently and robustly operate on deeply nested data structures.

[![npm version](https://badge.fury.io/js/partial.lenses.svg)](http://badge.fury.io/js/partial.lenses) [![Build Status](https://travis-ci.org/calmm-js/partial.lenses.svg?branch=master)](https://travis-ci.org/calmm-js/partial.lenses) [![](https://david-dm.org/calmm-js/partial.lenses.svg)](https://david-dm.org/calmm-js/partial.lenses) [![](https://david-dm.org/calmm-js/partial.lenses/dev-status.svg)](https://david-dm.org/calmm-js/partial.lenses?type=dev)

## Tutorial

Let's work with the following sample JSON object:

```js
const data = { contents: [ { language: "en", text: "Title" },
                           { language: "sv", text: "Rubrik" } ] }
```

First we import libraries

```js
import * as L from "partial.lenses"
import * as R from "ramda"
```

and compose a parameterized lens for accessing texts:

```js
const textIn = language =>
  L.compose(L.prop("contents"),
            L.required([]),
            L.normalize(R.sortBy(R.prop("language"))),
            L.find(R.whereEq({language})),
            L.defaults({language}),
            L.prop("text"),
            L.valueOr(""))
```

Take a moment to read through the above definition line by line.  Each line has
a specific purpose.  The purpose of the [`L.prop(...)`](#prop) lines is probably
obvious.  The other lines we will mention below.

### Querying data

Thanks to the parameterized search part,
[`L.find(R.whereEq({language}))`](#find), of the lens composition, we can use it
to query texts:

```js
L.get(textIn("sv"), data)
// "Rubrik"
L.get(textIn("en"), data)
// "Title"
```

Partial lenses can deal with missing data.  If we use the partial lens to query
a text that does not exist, we get the default:

```js
L.get(textIn("fi"), data)
// ""
```

We get this value, rather than undefined, thanks to the last part,
[`L.valueOr("")`](#valueOr), of our lens composition, which ensures that we get
the specified value rather than `null` or `undefined`.  We get the default even
if we query from `undefined`:

```js
L.get(textIn("fi"), undefined)
// ""
```

With partial lenses, `undefined` is the equivalent of empty or non-existent.

### Updating data

As with ordinary lenses, we can use the same lens to update texts:

```js
L.set(textIn("en"), "The title", data)
// { contents: [ { language: "en", text: "The title" },
//               { language: "sv", text: "Rubrik" } ] }
```

### Inserting data

The same partial lens also allows us to insert new texts:

```js
L.set(textIn("fi"), "Otsikko", data)
// { contents: [ { language: "en", text: "Title" },
//               { language: "fi", text: "Otsikko" },
//               { language: "sv", text: "Rubrik" } ] }
```

Note the position into which the new text was inserted.  The array of texts is
kept sorted thanks to the
[`L.normalize(R.sortBy(R.prop("language")))`](#normalize) part of our lens.

### Removing data

Finally, we can use the same partial lens to remove texts:

```js
L.set(textIn("sv"), undefined, data)
// { contents: [ { language: "en", text: "Title" } ] }
```

Note that a single text is actually a part of an object.  The key to having the
whole object vanish, rather than just the `text` property, is the
[`L.defaults({language})`](#defaults) part of our lens composition.  A
[`L.defaults(value)`](#defaults) lens works *symmetrically*.  When set with
`value`, the result is `undefined`, which means that the focus of the lens is to
be removed.

If we remove all of the texts, we get the required value:

```js
R.pipe(L.set(textIn("sv"), undefined),
       L.set(textIn("en"), undefined))(data)
// { contents: [] }
```

The `contents` property is not removed thanks to the
[`L.required([])`](#required) part of our lens composition.
[`L.required`](#required) is the dual of [`L.defaults`](#defaults).
[`L.defaults`](#defaults) replaces undefined values when viewed and
[`L.required`](#required) replaces undefined values when set.

Note that unless default and required values are explicitly specified as part of
the lens, they will both be undefined.

### Exercises

Take out one (or more) [`L.required(...)`](#required),
[`L.normalize(...)`](#normalize), [`L.defaults(...)`](#defaults) or
[`L.valueOr(...)`](#valueOr) part(s) from the lens composition and try to
predict what happens when you rerun the examples with the modified lens
composition.  Verify your reasoning by actually rerunning the examples.

Replace [`L.defaults(...)`](#defaults) with [`L.valueOr(...)`](#valueOr) or vice
verse and try to predict what happens when you rerun the examples with the
modified lens composition.  Verify your reasoning by actually rerunning the
examples.

### Shorthands

For clarity, the previous code snippets avoided some of the shorthands that this
library supports.  In particular,
* [`L.compose(...)`](#compose) can be abbreviated to use the default import,
  e.g. [`P(...)`](#compose),
* [`L.prop(string)`](#prop) can be abbreviated as [`string`](#prop), and
* [`L.set(l, undefined, s)`](#set) can be abbreviated as
  [`L.remove(l, s)`](#remove).

### Systematic decomposition

It is also typical to compose lenses out of short paths following the schema of
the JSON data being manipulated.  Reconsider the lens from the start of the
example:

```js
const textIn = language =>
  L.compose(L.prop("contents"),
            L.required([]),
            L.normalize(R.sortBy(R.prop("language"))),
            L.find(R.whereEq({language})),
            L.defaults({language}),
            L.prop("text"),
            L.valueOr(""))
```

Following the structure or schema of the JSON, we could break this into three
separate lenses:
* a lens for accessing the contents of a data object,
* a parameterized lens for querying a content object from contents, and
* a lens for accessing the text of a content object.

Furthermore, we could organize the lenses into an object following the structure
of the JSON:

```js
const M = {
  data: {
    contents: P("contents",
                L.required([]),
                L.normalize(R.sortBy(R.prop("language"))))
  },
  contents: {
    contentIn: language => P(L.find(R.whereEq({language})),
                             L.defaults({language}))
  },
  content: {
    text: P("text", L.valueOr(""))
  }
}
```

Using the above object, we could rewrite the parameterized `textIn` lens as:

```js
const textIn = language => P(M.data.contents,
                             M.contents.contentIn(language),
                             M.content.text)
```

This style of organizing lenses is overkill for our toy example.  In a more
realistic case the `data` object would contain many more properties.  Also,
rather than composing a lens, like `textIn` above, to access a leaf property
from the root of our object, we might actually compose lenses incrementally as
we inspect the model structure.

### Example: An array of ids as boolean flags

A case that we have run into multiple times is where we have an array of
constant strings such as

```js
const data = ["id-19", "id-76"]
```

that we wish to manipulate as if it was a collection of boolean flags.  Here is
a parameterized lens that does just that:

```js
const flag = id =>
  P(L.normalize(R.sortBy(R.identity)),
    L.find(R.equals(id)),
    L.replace(undefined, false),
    L.replace(id, true))
```

Now we can treat individual constants as boolean flags:

```js
L.get(flag("id-69"), data)
// false
L.get(flag("id-76"), data)
// true
```

In both directions:

```js
L.set(flag("id-69"), true, data)
// ["id-19", "id-69", "id-76"]
L.set(flag("id-76"), false, data)
// ["id-19"]
```

### Food for thought: BST as a lens

The previous examples are based on actual use cases.  In this section we look at
a more involved example: BST, binary search tree, as a lens.

Binary search might initially seem to be outside the scope of definable lenses.
However, given basic BST operations, one could easily wrap them as a primitive
partial lens.  But could we leverage lens combinators to build a BST lens more
directly?  We can.  The [`L.choose`](#choose) combinator allows for dynamic
construction of lenses based on examining the data structure being manipulated.
Inside [`L.choose`](#choose) we can write the ordinary BST logic to pick the
correct branch based on the key in the currently examined node and the key that
we are looking for.  So, here is our first attempt at a BST lens:

```js
const search = key =>
  P(L.defaults({key}),
    L.choose(n => key < n.key ? P("smaller", search(key)) :
                  n.key < key ? P("greater", search(key)) :
                                L.identity))

const valueOf = key => P(search(key), "value")
```

This actually works to a degree.  We can use the `valueOf` lens constructor to
build a binary tree:

```js
const t = R.reduce(
  (tree, {key, value}) => L.set(valueOf(key), value, tree),
  undefined,
  [{key: "c", value: 1},
   {key: "a", value: 2},
   {key: "b", value: 3}])
t
// { smaller: { greater: { value: 3, key: 'b' }, value: 2, key: 'a' },
//   value: 1,
//   key: 'c' }
```

However, the above `search` lens constructor does not maintain the BST structure
when values are being removed:

```js
L.remove(valueOf('c'), t)
// { smaller: { greater: { value: 3, key: 'b' },
//              value: 2,
//              key: 'a' },
//   key: 'c' }
```

How do we fix this?  We could check and transform the data structure to a BST
after changes.  The [`L.normalize`](#normalize) combinator can be used for that
purpose.  Here is the updated `search` definition:

```js
const search = key =>
  P(L.normalize(n =>
      undefined !== n.value   ? n         :
      n.smaller && !n.greater ? n.smaller :
      !n.smaller && n.greater ? n.greater :
      L.set(search(n.smaller.key), n.smaller, n.greater)),
    L.defaults({key}),
    L.choose(n => key < n.key ? P("smaller", search(key)) :
                  n.key < key ? P("greater", search(key)) :
                                L.identity))
```

Now we can also remove values from a binary tree:

```js
L.remove(valueOf('c'), t)
// { greater: { value: 3, key: 'b' }, value: 2, key: 'a' }
```

As an exercise, you could improve the normalization to better maintain balance.
Perhaps you might even enhance it to maintain a balance condition such as
[AVL](https://en.wikipedia.org/wiki/AVL_tree) or
[Red-Black](https://en.wikipedia.org/wiki/Red%E2%80%93black_tree).  Another
worthy exercise would be to make it so that the empty binary tree is `null`
rather than `undefined`.

## Reference

**Protip:** The link headings for functions in this reference have naive
approximate types as tooltips.

### Usage

The lens combinators are available as named imports.  Typically one just imports
the library as:

```js
import P, * as L from "partial.lenses"
```

Use of the default import, [`P`](#compose), is optional and is an alias for
[`L.compose`](#compose).

### Operations on lenses

In alphabetical order.  Operations on lenses take lenses as parameters, but do
not return lenses.

#### <a name="get"></a>[`L.get(l, s)`](#get "L.get :: PLens s a -> Maybe s -> Maybe a")

`L.get(l, s)` returns the focused element from a data structure.

For example:

```js
L.get("y", {x: 112, y: 101})
// 101
```

#### <a name="modify"></a>[`L.modify(l, x2x, s)`](#modify "L.modify :: PLens s a -> (Maybe a -> Maybe a) -> Maybe s -> Maybe s")

`L.modify(l, x2x, s)` allows one to map over the focused element of a data
structure.

For example:

```js
L.modify("elems", R.map(L.remove("x")), {elems: [{x: 1, y: 2}, {x: 3, y: 4}]})
// {elems: [{y: 2}, {y: 4}]}
```

#### <a name="remove"></a>[`L.remove(l, s)`](#remove "L.remove :: PLens s a -> Maybe s -> Maybe s")

`L.remove(l, s)` is equivalent to [`L.set(l, undefined, s)`](#set).  With
partial lenses, setting to undefined typically has the effect of removing the
focused element.

For example:

```js
L.remove(P("a", "b"), {a: {b: 1}, x: {y: 2}})
// {x: {y: 2}}
```

#### <a name="removeAll"></a>[`L.removeAll(l, s)`](#removeAll "L.removeAll :: PLens s a -> Maybe s -> Maybe s")

**`L.removeAll` is deprecated and will be removed.  Use a different
[approach](#should-i-use-lenses-for).**

`L.removeAll(l, s)` removes all the non `undefined` items targeted by the lens
`l` from `s`.  This only makes sense for a lens that
* can potentially focus on more than one item and
* will focus on `undefined` when it doesn't find an item to focus on.

For example:

```js
L.removeAll(L.findWith("a"), [{x: 1}, {a: 2}, {a: 3, y: 4}, {z: 5}])
// [{x: 1}, {y: 4}, {z: 5}]
```

#### <a name="set"></a>[`L.set(l, x, s)`](#set "L.set :: PLens s a -> Maybe a -> Maybe s -> Maybe s")

`L.set(l, x, s)` is equivalent to [`L.modify(l, () => x, s)`](#modify).

For example:

```js
L.set(P("a", 0, "x"), 11, {id: "z"})
// {a: [{x: 11}], id: "z"}
```

### Lens combinators

In alphabetical order.  Lens combinators are either lenses or functions that
return lenses.

#### <a name="append"></a>[`L.append`](#append "L.append :: PLens [a] a")

`L.append` is a special semi-degenerate lens that operates on arrays and is
equivalent to `L.index(i)` with the index `i` set to the length of the focused
array or 0 in case the focus is not a defined array.

For example:

```js
L.set(L.append, "x", undefined)
// [ 'x' ]
```

#### <a name="augment"></a>[`L.augment({prop: obj => val, ...props})`](#augment "L.augment :: {p1 :: o -> a1, ...ps} -> PLens {...o} {...o, p1 :: a1, ...ps}")

`L.augment({prop: obj => val, ...props})` is given a template of functions to
compute new properties.  When not viewing or setting a defined object, the
result is undefined.  When viewing a defined object, the object is extended with
the computed properties.  When set with a defined object, the extended
properties are removed.

For example:

```js
L.modify(L.augment({y: r => r.x + 1}), r => ({x: r.x + r.y, y: 2, z: r.x - r.y}), {x: 1})
// { x: 3, z: -1 }
```

#### <a name="chain"></a>[`L.chain(a2bPLens, aPLens)`](#chain "L.chain :: (a -> PLens s b) -> PLens s a -> PLens s b")

`L.chain(a2bPLens, aPLens)` is equivalent to

```js
L.compose(aPLens, L.choose(aMaybe =>
  aMaybe === undefined
  ? L.nothing
  : a2bPLens(aMaybe)))
```

With the [`L.just`](#just), `L.chain`, [`L.choice`](#choice) and
[`L.nothing`](#nothing) combinators, one can view partial lenses as subsuming
the maybe monad.  Of course, the whole point of lenses is that they are
bidirectional and the special lenses [`L.just`](#just) and
[`L.nothing`](#nothing) are essentially degenerate.

#### <a name="choose"></a>[`L.choose(maybeValue => PLens)`](#choose "L.choose :: (Maybe s -> PLens s a) -> PLens s a")

`L.choose(maybeValue => PLens)` creates a lens whose operation is determined by
the given function that maps the underlying view, which can be undefined, to a
lens.  In other words, the `L.choose` combinator allows a lens to be constructed
*after* examining the data structure being manipulated.

For example, given:

```js
const majorAxis = L.choose(({x, y} = {}) =>
  Math.abs(x) < Math.abs(y) ? "y" : "x")
```

we get:

```js
L.get(majorAxis, {x: 1, y: 2})
// 2
L.get(majorAxis, {x: -3, y: 1})
// -3
L.modify(majorAxis, R.negate, {x: 2, y: -3})
// { y: 3, x: 2 }
```

#### <a name="choice"></a>[`L.choice(...ls)`](#choice "L.choice :: (...PLens s a) -> PLens s a")

`L.choice(...ls)` returns a partial lens that acts like the first of the given
lenses, `ls`, whose view is not undefined on the given target.  When the views
of all of the given lenses are undefined, the returned lens acts like
[`L.nothing`](#nothing), which is the identity element of `L.choice`.

#### <a name="compose"></a>[`L.compose(...ls)`](#compose "L.compose :: (PLens s s1, ...PLens sN a) -> PLens s a")

The default import `P` and `L.compose` refer to the one and same function, which
performs lens composition.  The following equations characterize lens
composition:

```js
                  L.compose() = L.identity
                 L.compose(l) = l
   L.get(L.compose(l, ...ls)) = R.pipe(L.get(l), ...ls.map(L.get))
L.modify(L.compose(l, ...ls)) = R.pipe(L.modify(l), ...ls.map(L.modify))
```

For example:

```js
L.get(P("a", 1), {a: ["b", "c"]})
// "c"
```

*Note:* In versions of this library before 3.6.1 `L.compose` happened to be
almost equivalent to `R.compose` and partial lenses were internally nearly
directly compatible with Ramda's lenses.  Implicit Ramda compatibility was
already dropped in version [3.0.0](CHANGELOG.md#300).  In version 3.6.1 the
internal implementation was changed to make it possible to support traversals
properly.

#### <a name="defaults"></a>[`L.defaults(out)`](#defaults "L.defaults :: s -> PLens s s")

`L.defaults(out)` is the same as [`L.replace(undefined, out)`](#replace).
`L.defaults` is used to specify a default context or value for an element in
case it is missing.  When set with the default value, the effect is to remove
the element.  This can be useful for both making partial lenses with propagating
removal and for avoiding having to check for and provide default values
elsewhere.

For example:

```js
L.get(P("items", L.defaults([])), {})
// []
L.get(P("items", L.defaults([])), {items: [1, 2, 3]})
// [ 1, 2, 3 ]
L.set(P("items", L.defaults([])), [], {items: [1, 2, 3]})
// undefined
```

#### <a name="define"></a>[`L.define(value)`](#define "L.define :: s -> PLens s s")

`L.define(value)` is the same as `P(L.required(value), L.defaults(value))`.
`L.define` is used to specify a value to act as both the default value and the
required value for an element.

#### <a name="filter"></a>[`L.filter(predicate)`](#filter "L.filter :: (a -> Boolean) -> PLens [a] [a]")

`L.filter(predicate)` operates on arrays.  When not viewing an array, the result
is undefined.  When viewing an array, only elements matching the given predicate
will be returned.  When set, the resulting array will be formed by concatenating
the set array and the complement of the filtered context.  If the resulting
array would be empty, the whole result will be undefined.

For example:

```js
L.remove(L.filter(x => x <= 2), [3,1,4,1,5,9,2])
// [ 3, 4, 5, 9 ]
```

*Note:* An alternative design for filter could implement a smarter algorithm to
combine arrays when set.  For example, an algorithm based on
[edit distance](https://en.wikipedia.org/wiki/Edit_distance) could be used to
maintain relative order of elements.  While this would not be difficult to
implement, it doesn't seem to make sense, because in most cases use of
[`L.normalize`](#normalize) would be preferable.

#### <a name="find"></a>[`L.find(predicate)`](#find "L.find :: (a -> Boolean) -> PLens [a] a")

`L.find(predicate)` operates on arrays like [`L.index`](#index), but the index
to be viewed is determined by finding the first element from the input array
that matches the given predicate.  When no matching element is found the effect
is same as with [`L.append`](#append).

```js
L.remove(L.find(x => x <= 2), [3,1,4,1,5,9,2])
// [ 3, 4, 1, 5, 9, 2 ]
```

#### <a name="findWith"></a>[`L.findWith(...ls)`](#findWith "L.findWith :: (PLens s s1, ...PLens sN a) -> PLens [s] a")

`L.findWith(...ls)` chooses an index from an array through which the given lens,
[`P(...ls)`](#compose), focuses on a defined item and then returns a lens that
focuses on that item.

For example:

```js
L.get(L.findWith("x"), [{z: 6}, {x: 9}, {y: 6}])
// 9
L.set(L.findWith("x"), 3, [{z: 6}, {x: 9}, {y: 6}])
// [ { z: 6 }, { x: 3 }, { y: 6 } ]
```

#### <a name="identity"></a>[`L.identity`](#identity "L.identity :: PLens s s")

`L.identity` is the identity element of lens composition.  The following
equations characterize `L.identity`:

```js
      L.get(L.identity, x) = x
L.modify(L.identity, f, x) = f(x)
  L.compose(L.identity, l) = l
  L.compose(l, L.identity) = l
```

#### <a name="index"></a>[`L.index(integer)`](#index "L.index :: Integer -> PLens [a] a")

`L.index(integer)` or `integer` focuses on the specified array index.

* When not viewing a defined array index, the result is undefined.
* When setting to undefined, the element is removed from the resulting array,
  shifting all higher indices down by one.  If the result would be an array
  without indices (ignoring length), the whole result will be undefined.

**NOTE:** There is a gotcha related to removing elements from an array.  Namely,
when the last element is removed, the result is `undefined` rather than an empty
array.  This is by design, because this allows the removal to propagate upwards.
It is not uncommon, however, to have cases where removing the last element from
an array must not remove the array itself.  Consider the following examples
without [`L.required([])`](#required):

```js
L.remove(0, ["a", "b"])
// [ 'b' ]
L.remove(0, ["b"])
// undefined
L.remove(P("elems", 0), {elems: ["b"], some: "thing"})
// { some: 'thing' }
```

Then consider the same examples with [`L.required([])`](#required):

```js
L.remove(P(L.required([]), 0), ["a", "b"])
// [ 'b' ]
L.remove(P(L.required([]), 0), ["b"])
// []
L.remove(P("elems", L.required([]), 0), {elems: ["b"], some: "thing"})
// { elems: [], some: 'thing' }
```

There is a related gotcha with [`L.required`](#required).  Consider the
following example:

```js
L.remove(L.required([]), [])
// []
L.get(L.required([]), [])
// undefined
```

In other words, [`L.required`](#required) works in both directions.  Thanks to
the handling of `undefined` within partial lenses, this is often not a problem,
but sometimes you need the "default" value both ways.  In that case you can
use [`L.define`](#define).

#### <a name="just"></a>[`L.just(value)`](#just "L.just :: a -> PLens s a")

`L.just(x)` is equivalent to `L.compose(L.nothing, L.defaults(x))` and is a
special degenerate lens whose view is always `x` and writing through the lens
has no effect.  In other words, for all `x`, `y` and `z`:

```js
   L.get(L.just(z), x) = z
L.set(L.just(z), y, x) = x
```

`L.just` can be seen as the unit function of the monad formed with
[`L.chain`](#chain).

#### <a name="lens"></a>[`L.lens(get, set)`](#lens "L.lens :: (Maybe s -> Maybe a) -> (Maybe a -> Maybe s -> Maybe s) -> PLens s a")

`L.lens(get, set)` creates a new primitive lens.  One should think twice before
introducing a new primitive lens&mdash;most of the combinators in this library
have been introduced to reduce the need to write new primitive lenses.  With
that said, there are still valid reasons to create new primitive lenses.  For
example, here is a lens that we've used in production, written with the help of
[Moment.js](http://momentjs.com/), to bidirectionally convert a pair of `start`
and `end` times to a duration:

```js
const timesAsDuration = L.lens(
  ({start, end} = {}) => {
    if (undefined === start)
      return undefined
    if (undefined === end)
      return "Infinity"
    return moment.duration(moment(end).diff(moment(start))).toJSON()
  },
  (duration, {start = moment().toJSON()} = {}) => {
    if (undefined === duration || "Infinity" === duration) {
      return {start}
    } else {
      return {
        start,
        end: moment(start).add(moment.duration(duration)).toJSON()
      };
    }
  }
)
```

When composed with [`L.pick`](#pick), to flexibly pick the `start` and `end`
times, the above can be adapted to work in a wide variety of cases.  However,
the above lens will never be added to this library, because it would require
adding dependency to [Moment.js](http://momentjs.com/).

#### <a name="normalize"></a>[`L.normalize(value => value)`](#normalize "L.normalize :: (s -> s) -> PLens s s")

`L.normalize(value => value)` maps the value with same given transform when
viewed and set and implicitly maps undefined to undefined.

The main use case for `normalize` is to make it easy to determine whether, after
a change, the data has actually changed.  By keeping the data normalized, a
simple [`R.equals`](http://ramdajs.com/docs/#equals) comparison will do.

#### <a name="nothing"></a>[`L.nothing`](#nothing "L.nothing :: PLens s s")

`L.nothing` is a special degenerate lens whose view is always undefined and
setting through `L.nothing` has no effect.  In other words, for all `x` and `y`:

```js
   L.get(L.nothing, x) = undefined
L.set(L.nothing, y, x) = x
```

`L.nothing` is the identity element of [`L.choice`](#choice).

#### <a name="orElse"></a>[`L.orElse(backup, primary)`](#orElse "L.orElse :: (PLens s a, PLens s a) -> PLens s a")

`L.orElse(backup, primary)` acts like `primary` when its view is not undefined
and otherwise like `backup`.  You can use `L.orElse` on its own
with [`R.reduceRight`](http://ramdajs.com/docs/#reduceRight)
(and [`R.reduce`](http://ramdajs.com/docs/#reduce)) to create an associative
choice over lenses or use `L.orElse` to specify a default or backup lens
for [`L.choice`](#choice), for example.

#### <a name="pick"></a>[`L.pick({p1: l1, ...pls})`](#pick "L.pick :: {p1 :: PLens s a1, ...pls} -> PLens s {p1 :: a1, ...pls}")

`L.pick({p1: l1, ...pls})` creates a lens out of the given object template of
lenses and allows one to pick apart a data structure and then put it back
together.  When viewed, an object is created, whose properties are obtained by
viewing through the lenses of the template.  When set with an object, the
properties of the object are set to the context via the lenses of the template.
`undefined` is treated as the equivalent of empty or non-existent in both
directions.

For example, let's say we need to deal with data and schema in need of some
semantic restructuring:

```js
const data = {px: 1, py: 2, vx: 1.0, vy: 0.0}
```

We can use `L.pick` to create lenses to pick apart the data and put it back
together into a more meaningful structure:

```js
const asVec = prefix => L.pick({x: prefix + "x", y: prefix + "y"})
const sanitize = L.pick({pos: asVec("p"), vel: asVec("v")})
```

We now have a better structured view of the data:

```js
L.get(sanitize, data)
// { pos: { x: 1, y: 2 }, vel: { x: 1, y: 0 } }
```

That works in both directions:

```js
L.modify(P(sanitize, "pos", "x"), R.add(5), data)
// { px: 6, py: 2, vx: 1, vy: 0 }
```

**NOTE:** In order for a lens created with `L.pick` to work in a predictable
manner, the given lenses must operate on independent parts of the data
structure.  As a trivial example, in `L.pick({x: "same", y: "same"})` both of
the resulting object properties, `x` and `y`, address the same property of the
underlying object, so writing through the lens will give unpredictable results.

Note that, when set, `L.pick` simply ignores any properties that the given
template doesn't mention.  Also note that the underlying data structure need not
be an object.

#### <a name="prop"></a>[`L.prop(string)`](#prop "L.prop :: (p :: a) -> PLens {p :: a, ...ps} a")

`L.prop(string)` or `string` focuses on the specified object property.

* When not viewing a defined object property, the result is undefined.
* When setting property to undefined, the property is removed from the result.
  If the result would be an empty object, the whole result will be undefined.

#### <a name="props"></a>[`L.props(...strings)`](#props "L.props :: (p1 :: a1, ...ps) -> PLens {p1 :: a1, ...ps, ...o} {p1 :: a1, ...ps}")

`L.props(k1, ..., kN)` is equivalent to [`L.pick({[k1]: k1, ..., [kN]:
kN})`](#pick) and focuses on a subset of properties of an object,
allowing one to treat the subset of properties as a unit.  The view of `L.props`
is undefined when none of the properties is defined.  Otherwise the view is an
object containing a subset of the properties.  Setting through `L.props` updates
the whole subset of properties, which means that any undefined properties are
removed if they did exists previously.  When set, any extra properties are
ignored.

```js
L.set(L.props("x", "y"), {x: 4}, {x: 1, y: 2, z: 3})
// { z: 3, x: 4 }
```

#### <a name="replace"></a>[`L.replace(inn, out)`](#replace "L.replace :: Maybe s -> Maybe s -> PLens s s")

`L.replace(inn, out)`, when viewed, replaces the value `inn` with `out` and vice
versa when set.  Values are compared
using [`R.equals`](http://ramdajs.com/docs/#equals).

For example:

```js
L.get(L.replace(1, 2), 1)
// 2
L.set(L.replace(1, 2), 2, 0)
// 1
```

The main use case for `replace` is to handle optional and required properties
and elements.  In most cases, rather than using `replace`, you will make
selective use of [`defaults`](#defaults), [`required`](#required)
and [`define`](#define).

#### <a name="required"></a>[`L.required(inn)`](#required "L.required :: s -> PLens s s")

`L.required(inn)` is the same as [`L.replace(inn, undefined)`](#replace).
`L.required` is used to specify that an element is not to be removed; in case it
is removed, the given value will be substituted instead.

For example:

```js
L.remove(P("items", 0), {items: [1]})
// undefined
L.remove(P(L.required({}), "items", 0), {items: [1]})
// {}
L.remove(P("items", L.required([]), 0), {items: [1]})
// { items: [] }
```

#### <a name="valueOr"></a>[`L.valueOr(out)`](#valueOr "L.valueOr :: s -> PLens s s")

`L.valueOr(out)` is an asymmetric lens used to specify a default value in case
the focus is undefined or `null`.  When set, `L.valueOr` behaves like the
identity lens.

For example:

```js
L.get(L.valueOr(0), null)
// 0
L.set(L.valueOr(0), 0, 1)
// 0
L.remove(L.valueOr(0), 1)
// undefined
```

### Interop

Conversions between lens libraries.

#### <a name="fromRamda"></a>[`L.fromRamda(lens)`](#fromRamda "L.fromRamda :: Lens s a -> PLens s a")

`L.fromRamda(lens)` converts the given Ramda lens to a partial lens.  Note that
this does not change the behavior of the lens on undefined values.

#### <a name="toRamda"></a>[`L.toRamda(plens)`](#toRamda "L.toRamda :: PLens s a -> Lens s a")

`L.toRamda(plens)` converts the given partial lens to a Ramda lens.  Note that
this does not change the behavior of the lens on undefined values.  Also note
that traversals are not compatible with Ramda.

### Traversal combinators and operations

Aside from lenses, there is experimental support for traversals.  Traversals and
lenses can be composed and the result is a traversal.  A traversal operates over
a collection of focuses and for this reason traversals cannot be viewed
([`get`](#get) does not work on a traversal), but they can be collected,
modified, set and removed.

#### <a name="collect"></a>[`L.collect(t, s)`](#collect "L.collect :: PTraversal s a -> Maybe s -> [a]")

**`L.collect` is experimental and might be removed, renamed or changed
semantically before next major release.**

`L.collect(t, s)` returns an array of the elements focused on by the given
traversal or lens from a data structure.  Given a lens, there will be 0 or 1
elements in the returned array.  Given a traversal, there can be any number of
elements in the returned array.

For example:

```js
L.collect(P("xs", L.sequence, "x"), {xs: [{x: 1}, {x: 2}]})
// [ 1, 2 ]
```

#### <a name="optional"></a>[`L.optional`](#optional "L.optional :: PTraversal a a")

**`L.optional` is experimental and might be removed, renamed or changed
semantically before next major release.**

`L.optional` is a traversal (rather than a lens) over an optional element.  When
the focus of `L.optional` is undefined, the traversal is empty.  Otherwise the
traversal is over the focused element.

As an example, consider the difference between:

```js
L.set(P(L.sequence, "x"), 3, [{x: 1}, {y: 2}])
// [ { x: 3 }, { x: 3, y: 2 } ]
```

and:

```js
L.set(P(L.sequence, "x", L.optional), 3, [{x: 1}, {y: 2}])
// [ { x: 3 }, { y: 2 } ]
```

#### <a name="sequence"></a>[`L.sequence`](#sequence "L.sequence :: PTraversal [a] a")

**`L.sequence` is experimental and might be removed, renamed or changed
semantically before next major release.**

`L.sequence` is a traversal (rather than a lens) over an array.

For example:

```js
L.modify(P("xs", L.sequence, "x"), R.add(1), {xs: [{x: 1}, {x: 2}]})
// { xs: [ { x: 2 }, { x: 3 } ] }
```

### Debugging

#### <a name="log"></a>[`L.log(...labels)`](#log "L.log :: (...Any) -> Lens s s")

`L.log(...labels)` is an identity lens that outputs
[`console.log`](https://developer.mozilla.org/en-US/docs/Web/API/Console/log)
messages with the given labels (or
[format in Node.js](https://nodejs.org/api/console.html#console_console_log_data))
when data flows in either direction, `get` or `set`, through the lens.

For example:

```js
L.get(P("x", L.log()), {x: 10})
// get 10
// 10
L.set(P("x", L.log("x")), "11", {x: 10})
// x get 10
// x set 11
// { x: '11' }
L.set(P("x", L.log("%s x: %j")), "11", {x: 10})
// get x: 10
// set x: "11"
// { x: '11' }
```

## Background

### Should I use lenses for...?

As said in the first sentence of this document, lenses are convenient for
performing updates on "individual elements".  Having abilities such as
[searching](#find), [filtering](#filter) and [restructuring](#pick) data using
lenses makes the notion of an individual element quite flexible and makes it all
the more important to understand that lenses are just one of many functional
abstractions for working with data structures.

One type of use case which we've ran into multiple times and falls out of the
sweet spot of lenses is performing uniform transforms over data structures.  For
example, we've run into the following use cases:

* Eliminate all references to an object with a particular id.
* Transform all instances of certain objects over many paths.
* Filter out extra fields from objects of varying shapes and paths.

One approach to making such whole data structure spanning updates is to use a
simple bottom-up transform.  Here is a simple implementation for JSON based on
ideas from the [Uniplate](https://github.com/ndmitchell/uniplate) library:

``` js
const isObject = x => x && x.constructor === Object
const isArray = x => x && x.constructor === Array
const isAggregate = R.anyPass([isObject, isArray])

const descend = (w2w, w) => isAggregate(w) ? R.map(w2w, w) : w
const substUp = (h2h, w) => descend(h2h, descend(w => substUp(h2h, w), w))

const transform = (w2w, w) => w2w(substUp(w2w, w))
```

`transform(w2w, w)` basically just performs a single-pass bottom-up transform
using the given function `w2w` over the given data structure `w`.  Suppose we
are given the following data:

``` js
const data = {
  just: "some",
  extra: "crap",
  that: [
    "we",
    {want: "to",
     filter: ["out"],
     including: {the: "following",
                 extra: true,
                 fields: 1}}]
}
```

We can now remove the `extra` `fields` like this:

``` js
transform(R.ifElse(isObject,
                   L.remove(L.props("extra", "fields")),
                   R.identity),
          data)
// { just: 'some',
//   that: [ 'we', { want: 'to',
//                   filter: ["out"],
//                   including: {the: 'following'} } ] }
```

### Motivation

Consider the following REPL session using Ramda 0.19.1:

```js
R.set(R.lensPath(["x", "y"]), 1, {})
// { x: { y: 1 } }
R.set(R.compose(R.lensProp("x"), R.lensProp("y")), 1, {})
// TypeError: Cannot read property 'y' of undefined
R.view(R.lensPath(["x", "y"]), {})
// undefined
R.view(R.compose(R.lensProp("x"), R.lensProp("y")), {})
// TypeError: Cannot read property 'y' of undefined
R.set(R.lensPath(["x", "y"]), undefined, {x: {y: 1}})
// { x: { y: undefined } }
R.set(R.compose(R.lensProp("x"), R.lensProp("y")), undefined, {x: {y: 1}})
// { x: { y: undefined } }
```

One might assume that [`R.lensPath([p0,
...ps])`](http://ramdajs.com/docs/#lensPath) is equivalent to
`R.compose(R.lensProp(p0), ...ps.map(R.lensProp))`, but that is not the case.

With partial lenses you can robustly compose a path lens from prop lenses
`L.compose(L.prop(p0), ...ps.map(L.prop))` or just use the shorthand notation
`P(p0, ...ps)`.

### Types

To illustrate the idea we could give lenses the naive type definition

```haskell
type Lens s a = (s -> a, a -> s -> s)
```

defining a lens as a pair of a getter and a setter.  The type of a partial lens
would then be

```haskell
type PLens s a = (Maybe s -> Maybe a, Maybe a -> Maybe s -> Maybe s)
```

which we can simplify to

```haskell
type PLens s a = Lens (Maybe s) (Maybe a)
```

This means that partial lenses can be composed, viewed, mapped over and set
using the same operations as with ordinary lenses.  However, primitive partial
lenses (e.g. [`L.prop`](#prop)) are not necessarily the same as primitive
ordinary lenses
(e.g. Ramda's [`R.lensProp`](http://ramdajs.com/docs/#lensProp)).
