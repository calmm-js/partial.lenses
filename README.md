[ [Contents](#contents) | [Tutorial](#tutorial) | [Reference](#reference) | [Background](#background) | [GitHub](https://github.com/calmm-js/partial.lenses) | [Try Lenses!](http://calmm-js.github.io/partial.lenses/) ]

# Partial Lenses

Lenses are primarily a convenient abstraction for performing updates on
individual elements of immutable data structures.  This library provides a
collection of *partial* lenses for manipulating JSON.  A partial lens can *view*
optional data, *insert* new data, *update* existing data and *remove* existing
data and can, for example, provide *defaults* and maintain *required* data
structure parts.

In JavaScript, missing data can be mapped to `undefined`, which is what partial
lenses also do, because `undefined` is not a valid JSON value.  When a part of a
data structure is missing, an attempt to view it returns `undefined`.  When a
part is missing, setting it to a defined value inserts the new part.  Setting an
existing part to `undefined` removes it.  Partial lenses are defined in such a
way that operations [`compose`](#compose) and one can conveniently and robustly
operate on deeply nested data structures.

Aside from partial lenses, this library also
supports [isomorphisms](#isomorphisms) and [traversals](#traversals).
Isomorphisms have an [`inverse`](#inverse) and traversals can target multiple
elements.

[![npm version](https://badge.fury.io/js/partial.lenses.svg)](http://badge.fury.io/js/partial.lenses) [![Build Status](https://travis-ci.org/calmm-js/partial.lenses.svg?branch=master)](https://travis-ci.org/calmm-js/partial.lenses) [![](https://david-dm.org/calmm-js/partial.lenses.svg)](https://david-dm.org/calmm-js/partial.lenses) [![](https://david-dm.org/calmm-js/partial.lenses/dev-status.svg)](https://david-dm.org/calmm-js/partial.lenses?type=dev)

## Contents

**Protip:** Code link headings have naïve approximate types as tooltips.

* [Tutorial](#tutorial)
  * [Querying data](#querying-data)
  * [Updating data](#updating-data)
  * [Inserting data](#inserting-data)
  * [Removing data](#removing-data)
  * [Exercises](#exercises)
  * [Shorthands](#shorthands)
  * [Systematic decomposition](#systematic-decomposition)
  * [Example: An array of ids as boolean flags](#example-an-array-of-ids-as-boolean-flags)
  * [Food for thought: BST as a lens](#food-for-thought-bst-as-a-lens)
* [Reference](#reference)
  * [Operations on lenses](#operations-on-lenses)
    * [`L.get(lens, maybeData)`](#get "L.get :: PLens s a -> Maybe s -> Maybe a")
    * [`L.modify(lens, maybeValue => maybeValue, maybeData)`](#modify "L.modify :: PLens s a -> (Maybe a -> Maybe a) -> Maybe s -> Maybe s")
    * [`L.remove(lens, maybeData)`](#remove "L.remove :: PLens s a -> Maybe s -> Maybe s")
    * [`L.set(lens, maybeValue, maybeData)`](#set "L.set :: PLens s a -> Maybe a -> Maybe s -> Maybe s")
  * [Creating new lenses](#creating-new-lenses)
    * [`L.lens(maybeData => maybeValue, (maybeValue, maybeData) => maybeData)`](#lens "L.lens :: (Maybe s -> Maybe a) -> ((Maybe a, Maybe s) -> Maybe s) -> PLens s a")
  * [Lenses and combinators](#lenses-and-combinators)
    * [Computing derived props](#computing-derived-props)
      * [`L.augment({prop: object => value, ...props})`](#augment "L.augment :: {p1 :: o -> a1, ...ps} -> PLens {...o} {...o, p1 :: a1, ...ps}")
    * [Enforcing invariants](#enforcing-invariants)
      * [`L.defaults(valueIn)`](#defaults "L.defaults :: s -> PLens s s")
      * [`L.define(value)`](#define "L.define :: s -> PLens s s")
      * [`L.normalize(value => value)`](#normalize "L.normalize :: (s -> s) -> PLens s s")
      * [`L.required(valueOut)`](#required "L.required :: s -> PLens s s")
      * [`L.rewrite(valueOut => valueOut)`](#rewrite "L.rewrite :: (s -> s) -> PLens s s")
    * [Lensing arrays](#lensing-arrays)
      * [`L.append`](#append "L.append :: PLens [a] a")
      * [`L.filter(value => testable)`](#filter "L.filter :: (a -> Boolean) -> PLens [a] [a]")
      * [`L.find(value => testable)`](#find "L.find :: (a -> Boolean) -> PLens [a] a")
      * [`L.findWith(...lenses)`](#findWith "L.findWith :: (PLens s s1, ...PLens sN a) -> PLens [s] a")
      * [`L.index(integer)`](#index "L.index :: Integer -> PLens [a] a")
    * [Lensing objects](#lensing-objects)
      * [`L.prop(propName)`](#prop "L.prop :: (p :: a) -> PLens {p :: a, ...ps} a")
      * [`L.props(...propNames)`](#props "L.props :: (p1 :: a1, ...ps) -> PLens {p1 :: a1, ...ps, ...o} {p1 :: a1, ...ps}")
    * [Nesting](#nesting)
      * [`L.compose(...lenses)`](#compose "L.compose :: (PLens s s1, ...PLens sN a) -> PLens s a")
    * [Providing defaults](#providing-defaults)
      * [`L.valueOr(valueOut)`](#valueOr "L.valueOr :: s -> PLens s s")
    * [Querying and adapting to data](#querying-and-adapting-to-data)
      * [`L.chain(value => lens, lens)`](#chain "L.chain :: (a -> PLens s b) -> PLens s a -> PLens s b")
      * [`L.choice(...lenses)`](#choice "L.choice :: (...PLens s a) -> PLens s a")
      * [`L.choose(maybeValue => lens)`](#choose "L.choose :: (Maybe s -> PLens s a) -> PLens s a")
      * [`L.just(maybeValue)`](#just "L.just :: Maybe a -> PLens s a")
      * [`L.nothing`](#nothing "L.nothing :: PLens s s")
      * [`L.orElse(backupLens, primaryLens)`](#orElse "L.orElse :: (PLens s a, PLens s a) -> PLens s a")
      * [`L.to(maybeValue => maybeValue)`](#to "L.to :: (a -> b) -> PLens a b")
    * [Recursion](#recursion)
      * [`L.lazy(optic => optic)`](#lazy "L.lazy :: POptic s a -> POptic s a")
    * [Transforming data](#transforming-data)
      * [`L.pick({prop: lens, ...props})`](#pick "L.pick :: {p1 :: PLens s a1, ...pls} -> PLens s {p1 :: a1, ...pls}")
      * [`L.replace(maybeValueIn, maybeValueOut)`](#replace "L.replace :: Maybe s -> Maybe s -> PLens s s")
  * [Isomorphisms](#isomorphisms)
    * [Operations on isomorphisms](#operations-on-isomorphisms)
      * [`L.getInverse(isomorphism, maybeData)`](#getInverse "L.getInverse :: PIso a b -> Maybe b -> Maybe a")
    * [Isomorphisms and combinators](#isomorphisms-and-combinators)
      * [`L.fromArrayBy(idPropName)`](#fromArrayBy "L.fromArrayBy :: (p :: String) -> PIso [{p :: String, ...ps}] {String: {p :: String, ...ps}}")
      * [`L.identity`](#identity "L.identity :: PIso s s")
      * [`L.inverse`](#inverse "L.inverse :: PIso a b -> PIso b a")
  * [Traversals](#traversals)
    * [Operations on traversals](#operations-on-traversals)
      * [`L.collect(traversal, maybeData)`](#collect "L.collect :: PTraversal s a -> Maybe s -> [a]")
      * [`L.foldMapOf({empty: value, concat: (value, value) => value}, traversal, maybeValue => value, maybeData)`](#foldMapOf "L.foldMapOf :: {empty: () -> r, concat: (r, r) -> r} -> PTraversal s a -> (Maybe a -> r) -> Maybe s -> r")
    * [Creating new traversals](#creating-new-traversals)
      * [`L.branch({prop: traversal, ...props})`](#branch-op "L.branch :: {p1 :: PTraversal s a, ...pts} -> PTraversal s a")
    * [Traversals and combinators](#traversals-and-combinators)
      * [`L.optional`](#optional "L.optional :: PTraversal a a")
      * [`L.sequence`](#sequence "L.sequence :: PTraversal [a] a")
  * [Debugging](#debugging)
    * [`L.log(...labels)`](#log "L.log :: (...Any) -> Lens s s")
* [Background](#background)
  * [Should I use lenses for...?](#should-i-use-lenses-for)
  * [Motivation](#motivation)
  * [Types](#types)
  * [Performance](#performance)
  * [Related work](#related-work)

## Tutorial

Let's work with the following sample JSON object:

```js
const sampleTexts = {
  contents: [{ language: "en", text: "Title" },
             { language: "sv", text: "Rubrik" }]
}
```

First we import libraries

```jsx
import * as L from "partial.lenses"
import * as R from "ramda"
```

and compose a parameterized lens for accessing texts:

```js
const textIn = language => L.compose(L.prop("contents"),
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
L.get(textIn("sv"), sampleTexts)
// 'Rubrik'
```
```js
L.get(textIn("en"), sampleTexts)
// 'Title'
```

Partial lenses can deal with missing data.  If we use the partial lens to query
a text that does not exist, we get the default:

```js
L.get(textIn("fi"), sampleTexts)
// ''
```

We get this value, rather than `undefined`, thanks to the last
part, [`L.valueOr("")`](#valueOr), of our lens composition, which ensures that
we get the specified value rather than `null` or `undefined`.  We get the
default even if we query from `undefined`:

```js
L.get(textIn("fi"), undefined)
// ''
```

With partial lenses, `undefined` is the equivalent of empty or non-existent.

### Updating data

As with ordinary lenses, we can use the same lens to update texts:

```js
L.set(textIn("en"), "The title", sampleTexts)
// { contents: [ { language: 'en', text: 'The title' },
//               { language: 'sv', text: 'Rubrik' } ] }
```

### Inserting data

The same partial lens also allows us to insert new texts:

```js
L.set(textIn("fi"), "Otsikko", sampleTexts)
// { contents: [ { language: 'en', text: 'Title' },
//               { language: 'fi', text: 'Otsikko' },
//               { language: 'sv', text: 'Rubrik' } ] }
```

Note the position into which the new text was inserted.  The array of texts is
kept sorted thanks to the
[`L.normalize(R.sortBy(R.prop("language")))`](#normalize) part of our lens.

### Removing data

Finally, we can use the same partial lens to remove texts:

```js
L.set(textIn("sv"), undefined, sampleTexts)
// { contents: [ { language: 'en', text: 'Title' } ] }
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
       L.set(textIn("en"), undefined))(sampleTexts)
// { contents: [] }
```

The `contents` property is not removed thanks to the
[`L.required([])`](#required) part of our lens
composition.  [`L.required`](#required) is the dual
of [`L.defaults`](#defaults).  [`L.defaults`](#defaults) replaces `undefined`
values when viewed and [`L.required`](#required) replaces `undefined` values
when set.

Note that unless default and required values are explicitly specified as part of
the lens, they will both be `undefined`.

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
* [`L.compose(...)`](#compose) can be abbreviated as an array
  [`[...]`](#compose),
* [`L.prop(string)`](#prop) can be abbreviated as [`string`](#prop), and
* [`L.set(l, undefined, s)`](#set) can be abbreviated as
  [`L.remove(l, s)`](#remove).

### Systematic decomposition

It is also typical to compose lenses out of short paths following the schema of
the JSON data being manipulated.  Reconsider the lens from the start of the
example:

```jsx
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
const Texts = {
  data: {
    contents: ["contents",
               L.required([]),
               L.normalize(R.sortBy(R.prop("language")))]
  },
  contents: {
    contentIn: language => [L.find(R.whereEq({language})),
                            L.defaults({language})]
  },
  content: {
    text: ["text", L.valueOr("")]
  },
  textIn: language => [Texts.data.contents,
                       Texts.contents.contentIn(language),
                       Texts.content.text]
}
```

We can now say:

```js
L.get(Texts.textIn("sv"), sampleTexts)
// 'Rubrik'
```

This style of organizing lenses is overkill for our toy example.  In a more
realistic case the `sampleTexts` object would contain many more properties.
Also, rather than composing a lens, like `Texts.textIn` above, to access a leaf
property from the root of our object, we might actually compose lenses
incrementally as we inspect the model structure.

### Example: An array of ids as boolean flags

A case that we have run into multiple times is where we have an array of
constant strings such as

```js
const sampleFlags = ["id-19", "id-76"]
```

that we wish to manipulate as if it was a collection of boolean flags.  Here is
a parameterized lens that does just that:

```js
const flag = id => [L.normalize(R.sortBy(R.identity)),
                    L.find(R.equals(id)),
                    L.replace(undefined, false),
                    L.replace(id, true)]
```

Now we can treat individual constants as boolean flags:

```js
L.get(flag("id-69"), sampleFlags)
// false
```
```js
L.get(flag("id-76"), sampleFlags)
// true
```

In both directions:

```js
L.set(flag("id-69"), true, sampleFlags)
// ['id-19', 'id-69', 'id-76']
```
```js
L.set(flag("id-76"), false, sampleFlags)
// ['id-19']
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
const searchAttempt = key => L.lazy(rec => [
  L.defaults({key}),
  L.choose(n => {
    if (key === n.key)
      return L.identity
    return [key < n.key ? "smaller" : "greater", rec]
  })])

const valueOfAttempt = key => [searchAttempt(key), "value"]
```

Note that we also make use of the [`L.lazy`](#lazy) combinator to create a
recursive lens.

This actually works to a degree.  We can use the `valueOfAttempt` lens
constructor to build a binary tree.  Here is a little helper to build a tree
from pairs:

```js
const fromPairs =
  R.reduce((t, [k, v]) => L.set(valueOfAttempt(k), v, t), undefined)
```

Now:

```js
const sampleBST = fromPairs([["c", 1], ["a", 2], ["b", 3]])
sampleBST
// { key: 'c',
//   value: 1,
//   smaller: { key: 'a', value: 2, greater: { key: 'b', value: 3 } } }
```

However, the above `searchAttempt` lens constructor does not maintain the BST
structure when values are being removed:

```js
L.remove(valueOfAttempt('c'), sampleBST)
// { key: 'c',
//   smaller: { key: 'a', value: 2, greater: { key: 'b', value: 3 } } }
```

How do we fix this?  We could check and transform the data structure to a BST
after changes.  The [`L.rewrite`](#rewrite) combinator can be used for that
purpose.  Here is a naïve rewrite to fix a tree after value removal:

```js
const naiveBST = L.rewrite(n => {
  if (undefined !== n.value) return n
  const s = n.smaller, g = n.greater
  if (!s) return g
  if (!g) return s
  return L.set(search(s.key), s, g)
})
```

Here is a working `search` lens and a `valueOf` lens constructor:

```js
const search = key => L.lazy(rec => [
  naiveBST,
  L.defaults({key}),
  L.choose(n => {
    if (key === n.key)
      return L.identity
    return [key < n.key ? "smaller" : "greater", rec]
  })])

const valueOf = key => [search(key), "value"]
```

Now we can also remove values from a binary tree:

```js
L.remove(valueOf('c'), sampleBST)
// { key: 'a', value: 2, greater: { key: 'b', value: 3 } }
```

As an exercise, you could improve the rewrite to better maintain balance.
Perhaps you might even enhance it to maintain a balance condition such
as [AVL](https://en.wikipedia.org/wiki/AVL_tree)
or [Red-Black](https://en.wikipedia.org/wiki/Red%E2%80%93black_tree).  Another
worthy exercise would be to make it so that the empty binary tree is `null`
rather than `undefined`.

See the documentation of [`L.branch`](#branch-op) for a continuation of this
example.

## Reference

The lens combinators are available as named imports.  Typically one just imports
the library as:

```jsx
import * as L from "partial.lenses"
```

The default import

```jsx
import P from "partial.lenses"
```

is an alias for [`L.compose`](#compose).  Typically one just uses the shorthand
array notation [`[...]`](#compose) to denote composition.

### Operations on lenses

Operations on lenses take lenses as parameters, but do not return lenses.

#### <a name="get"></a>[`L.get(lens, maybeData)`](#get "L.get :: PLens s a -> Maybe s -> Maybe a")

`L.get` returns the focused element from a data structure.

For example:

```js
L.get("y", {x: 112, y: 101})
// 101
```

Note that `L.get` does not work on traversals.

#### <a name="modify"></a>[`L.modify(lens, maybeValue => maybeValue, maybeData)`](#modify "L.modify :: PLens s a -> (Maybe a -> Maybe a) -> Maybe s -> Maybe s")

`L.modify` allows one to map over the focused element of a data structure.

For example:

```js
L.modify("elems", R.map(L.remove("x")), {elems: [{x: 1, y: 2}, {x: 3, y: 4}]})
// {elems: [{y: 2}, {y: 4}]}
```

#### <a name="remove"></a>[`L.remove(lens, maybeData)`](#remove "L.remove :: PLens s a -> Maybe s -> Maybe s")

`L.remove` allows one to remove the focused element from a data structure.

For example:

```js
L.remove(["a", "b"], {a: {b: 1}, x: {y: 2}})
// {x: {y: 2}}
```

Note that `L.remove(lens, maybeData)` is equivalent
to [`L.set(lens, undefined, maybeData)`](#set).  With partial lenses, setting to
`undefined` typically has the effect of removing the focused element.

#### <a name="set"></a>[`L.set(lens, maybeValue, maybeData)`](#set "L.set :: PLens s a -> Maybe a -> Maybe s -> Maybe s")

`L.set` allows one to replace the focused element of a data structure.

For example:

```js
L.set(["a", 0, "x"], 11, {id: "z"})
// {a: [{x: 11}], id: 'z'}
```

Note that `L.set(lens, maybeValue, maybeData)` is equivalent
to [`L.modify(lens, R.always(maybeValue), maybeData)`](#modify).

### Creating new lenses

#### <a name="lens"></a>[`L.lens(maybeData => maybeValue, (maybeValue, maybeData) => maybeData)`](#lens "L.lens :: (Maybe s -> Maybe a) -> ((Maybe a, Maybe s) -> Maybe s) -> PLens s a")

`L.lens` creates a new primitive lens.  The first parameter is the *getter* and
the second parameter is the *setter*.  The setter takes two parameters: the
first is the value written and the second is the data structure to write into.

One should think twice before introducing a new primitive lens&mdash;most of the
combinators in this library have been introduced to reduce the need to write new
primitive lenses.  With that said, there are still valid reasons to create new
primitive lenses.  For example, here is a lens that we've used in production,
written with the help of [Moment.js](http://momentjs.com/), to bidirectionally
convert a pair of `start` and `end` times to a duration:

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
      }
    }
  }
)
```

When composed with [`L.pick`](#pick), to flexibly pick the `start` and `end`
times, the above can be adapted to work in a wide variety of cases.  However,
the above lens will never be added to this library, because it would require
adding dependency to [Moment.js](http://momentjs.com/).

### Lenses and combinators

Lens combinators are either lenses or functions that return lenses.

#### Computing derived props

##### <a name="augment"></a>[`L.augment({prop: object => value, ...props})`](#augment "L.augment :: {p1 :: o -> a1, ...ps} -> PLens {...o} {...o, p1 :: a1, ...ps}")

`L.augment` is given a template of functions to compute new properties.  When
not viewing or setting a defined object, the result is `undefined`.  When
viewing a defined object, the object is extended with the computed properties.
When set with a defined object, the extended properties are removed.

For example:

```js
L.modify(L.augment({y: r => r.x + 1}), r => ({x: r.x + r.y, y: 2, z: r.x - r.y}), {x: 1})
// { x: 3, z: -1 }
```

#### Enforcing invariants

##### <a name="defaults"></a>[`L.defaults(valueIn)`](#defaults "L.defaults :: s -> PLens s s")

`L.defaults` is used to specify a default context or value for an element in
case it is missing.  When set with the default value, the effect is to remove
the element.  This can be useful for both making partial lenses with propagating
removal and for avoiding having to check for and provide default values
elsewhere.

For example:

```js
L.get(["items", L.defaults([])], {})
// []
```
```js
L.get(["items", L.defaults([])], {items: [1, 2, 3]})
// [ 1, 2, 3 ]
```
```js
L.set(["items", L.defaults([])], [], {items: [1, 2, 3]})
// undefined
```

Note that `L.defaults(valueIn)` is equivalent
to [`L.replace(undefined, valueIn)`](#replace).

##### <a name="define"></a>[`L.define(value)`](#define "L.define :: s -> PLens s s")

`L.define` is used to specify a value to act as both the default value and the
required value for an element.

```js
L.get(["x", L.define(null)], {y: 10})
// null
```
```js
L.set(["x", L.define(null)], undefined, {y: 10})
// { y: 10, x: null }
```

Note that `L.define(value)` is equivalent to `[L.required(value),
L.defaults(value)]`.

##### <a name="normalize"></a>[`L.normalize(value => value)`](#normalize "L.normalize :: (s -> s) -> PLens s s")

`L.normalize` maps the value with same given transform when viewed and set and
implicitly maps `undefined` to `undefined`.

One use case for `normalize` is to make it easy to determine whether, after a
change, the data has actually changed.  By keeping the data normalized, a
simple [`R.equals`](http://ramdajs.com/docs/#equals) comparison will do.

##### <a name="required"></a>[`L.required(valueOut)`](#required "L.required :: s -> PLens s s")

`L.required` is used to specify that an element is not to be removed; in case it
is removed, the given value will be substituted instead.

For example:

```js
L.remove(["items", 0], {items: [1]})
// undefined
```
```js
L.remove([L.required({}), "items", 0], {items: [1]})
// {}
```
```js
L.remove(["items", L.required([]), 0], {items: [1]})
// { items: [] }
```

Note that `L.required(valueOut)` is equivalent
to [`L.replace(valueOut, undefined)`](#replace).

##### <a name="rewrite"></a>[`L.rewrite(valueOut => valueOut)`](#rewrite "L.rewrite :: (s -> s) -> PLens s s")

`L.rewrite` maps the value with the given transform when set and implicitly maps
`undefined` to `undefined`.  One use case for `rewrite` is to re-establish data
structure invariants after changes.

#### Lensing arrays

##### <a name="append"></a>[`L.append`](#append "L.append :: PLens [a] a")

`L.append` is a write-only lens that can be used to append values to an array.
The view of `L.append` is always `undefined`.

For example:

```js
L.get(L.append, ["x"])
// undefined
```
```js
L.set(L.append, "x", undefined)
// [ 'x' ]
```
```js
L.set(L.append, "x", ["z", "y"])
// [ 'z', 'y', 'x' ]
```

Note that `L.append` is equivalent to [`L.index(i)`](#index) with the index `i`
set to the length of the focused array or 0 in case the focus is not a defined
array.

##### <a name="filter"></a>[`L.filter(value => testable)`](#filter "L.filter :: (a -> Boolean) -> PLens [a] [a]")

`L.filter` operates on arrays.  When not viewing an array, the result is
`undefined`.  When viewing an array, only elements matching the given predicate
will be returned.  When set, the resulting array will be formed by concatenating
the set array and the complement of the filtered context.  If the resulting
array would be empty, the whole result will be `undefined`.

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

##### <a name="find"></a>[`L.find(value => testable)`](#find "L.find :: (a -> Boolean) -> PLens [a] a")

`L.find` operates on arrays like [`L.index`](#index), but the index to be viewed
is determined by finding the first element from the input array that matches the
given predicate.  When no matching element is found the effect is same as
with [`L.append`](#append).

```js
L.remove(L.find(x => x <= 2), [3,1,4,1,5,9,2])
// [ 3, 4, 1, 5, 9, 2 ]
```

##### <a name="findWith"></a>[`L.findWith(...lenses)`](#findWith "L.findWith :: (PLens s s1, ...PLens sN a) -> PLens [s] a")

`L.findWith(...lenses)` chooses an index from an array through which the given
lens, [`[...lenses]`](#compose), focuses on a defined item and then returns a
lens that focuses on that item.

For example:

```js
L.get(L.findWith("x"), [{z: 6}, {x: 9}, {y: 6}])
// 9
```
```js
L.set(L.findWith("x"), 3, [{z: 6}, {x: 9}, {y: 6}])
// [ { z: 6 }, { x: 3 }, { y: 6 } ]
```

##### <a name="index"></a>[`L.index(integer)`](#index "L.index :: Integer -> PLens [a] a")

`L.index(integer)` or just `integer` focuses on the specified array index.

* When not viewing a defined array index, the result is `undefined`.
* When setting to `undefined`, the element is removed from the resulting array,
  shifting all higher indices down by one.  If the result would be an empty
  array, the whole result will be `undefined`.
* When setting a defined value to an index that is higher than the length of the
  array, the missing elements will be filled with `null`.

**NOTE:** There is a gotcha related to removing elements from an array.  Namely,
when the last element is removed, the result is `undefined` rather than an empty
array.  This is by design, because this allows the removal to propagate upwards.
It is not uncommon, however, to have cases where removing the last element from
an array must not remove the array itself.  Consider the following examples
without [`L.required([])`](#required):

```js
L.remove(0, ["a", "b"])
// [ 'b' ]
```
```js
L.remove(0, ["b"])
// undefined
```
```js
L.remove(["elems", 0], {elems: ["b"], some: "thing"})
// { some: 'thing' }
```

Then consider the same examples with [`L.required([])`](#required):

```js
L.remove([L.required([]), 0], ["a", "b"])
// [ 'b' ]
```
```js
L.remove([L.required([]), 0], ["b"])
// []
```
```js
L.remove(["elems", L.required([]), 0], {elems: ["b"], some: "thing"})
// { elems: [], some: 'thing' }
```

There is a related gotcha with [`L.required`](#required).  Consider the
following example:

```js
L.remove(L.required([]), [])
// []
```
```js
L.get(L.required([]), [])
// undefined
```

In other words, [`L.required`](#required) works in both directions.  Thanks to
the handling of `undefined` within partial lenses, this is often not a problem,
but sometimes you need the "default" value both ways.  In that case you can
use [`L.define`](#define).

#### Lensing objects

##### <a name="prop"></a>[`L.prop(propName)`](#prop "L.prop :: (p :: a) -> PLens {p :: a, ...ps} a")

`L.prop(string)` or `string` focuses on the specified object property.

* When not viewing a defined object property, the result is `undefined`.
* When setting property to `undefined`, the property is removed from the result.
  If the result would be an empty object, the whole result will be `undefined`.

When setting or removing properties, the order of keys is preserved.

For example:

```js
L.get("y", {x: 1, y: 2, z: 3})
// 2
```
```js
L.set("y", -2, {x: 1, y: 2, z: 3})
// { x: 1, y: -2, z: 3 }
```

##### <a name="props"></a>[`L.props(...propNames)`](#props "L.props :: (p1 :: a1, ...ps) -> PLens {p1 :: a1, ...ps, ...o} {p1 :: a1, ...ps}")

`L.props` focuses on a subset of properties of an object, allowing one to treat
the subset of properties as a unit.  The view of `L.props` is `undefined` when
none of the properties is defined.  Otherwise the view is an object containing a
subset of the properties.  Setting through `L.props` updates the whole subset of
properties, which means that any missing properties are removed if they did
exists previously.  When set, any extra properties are ignored.

```js
L.set(L.props("x", "y"), {x: 4}, {x: 1, y: 2, z: 3})
// { x: 4, z: 3 }
```

Note that `L.props(k1, ..., kN)` is equivalent to [`L.pick({[k1]: k1, ..., [kN]:
kN})`](#pick).

#### Nesting

##### <a name="compose"></a>[`L.compose(...lenses)`](#compose "L.compose :: (PLens s s1, ...PLens sN a) -> PLens s a")

The default import `P` and `L.compose` refer to the one and same function, which
performs lens composition.  The following equations characterize lens
composition:

```jsx
                  L.compose() = L.identity
                 L.compose(l) = l
   L.get(L.compose(l, ...ls)) = R.pipe(L.get(l), ...ls.map(L.get))
L.modify(L.compose(l, ...ls)) = R.compose(L.modify(l), ...ls.map(L.modify))
```

Furthermore, an array of lenses `[...lenses]` is treated as a composition of
lenses `L.compose(...lenses)`.  Using the array notation, the above equations
can be written as:

```jsx
                  [] = L.identity
                 [l] = l
   L.get([l, ...ls]) = R.pipe(L.get(l), ...ls.map(L.get))
L.modify([l, ...ls]) = R.compose(L.modify(l), ...ls.map(L.modify))
```

For example:

```js
L.get(["a", 1], {a: ["b", "c"]})
// 'c'
```

#### Providing defaults

##### <a name="valueOr"></a>[`L.valueOr(valueOut)`](#valueOr "L.valueOr :: s -> PLens s s")

`L.valueOr` is an asymmetric lens used to specify a default value in case the
focus is `undefined` or `null`.  When set, `L.valueOr` behaves like the identity
lens.

For example:

```js
L.get(L.valueOr(0), null)
// 0
```
```js
L.set(L.valueOr(0), 0, 1)
// 0
```
```js
L.remove(L.valueOr(0), 1)
// undefined
```

#### Querying and adapting to data

##### <a name="chain"></a>[`L.chain(value => lens, lens)`](#chain "L.chain :: (a -> PLens s b) -> PLens s a -> PLens s b")

`L.chain(a2bPLens, aPLens)` is equivalent to

```jsx
L.compose(aPLens, L.choose(aMaybe =>
  aMaybe === undefined
  ? L.nothing
  : a2bPLens(aMaybe)))
```

With the [`L.just`](#just), `L.chain`, [`L.choice`](#choice)
and [`L.nothing`](#nothing) combinators, one can view partial lenses as
subsuming the maybe monad.  Of course, the whole point of lenses is that they
are bidirectional and read-only [`L.just`](#just) and [`L.nothing`](#nothing)
are essentially degenerate.

##### <a name="choice"></a>[`L.choice(...lenses)`](#choice "L.choice :: (...PLens s a) -> PLens s a")

`L.choice` returns a partial lens that acts like the first of the given lenses
whose view is not `undefined` on the given data structure.  When the views of
all of the given lenses are `undefined`, the returned lens acts
like [`L.nothing`](#nothing), which is the identity element of `L.choice`.

##### <a name="choose"></a>[`L.choose(maybeValue => lens)`](#choose "L.choose :: (Maybe s -> PLens s a) -> PLens s a")

`L.choose` creates a lens whose operation is determined by the given function
that maps the underlying view, which can be `undefined`, to a lens.  In other
words, the `L.choose` combinator allows a lens to be constructed *after*
examining the data structure being manipulated.

For example, given:

```js
const majorAxis =
  L.choose(({x, y} = {}) => Math.abs(x) < Math.abs(y) ? "y" : "x")
```

we get:

```js
L.get(majorAxis, {x: 1, y: 2})
// 2
```
```js
L.get(majorAxis, {x: -3, y: 1})
// -3
```
```js
L.modify(majorAxis, R.negate, {x: 2, y: -3})
// { x: 2, y: 3 }

```

##### <a name="just"></a>[`L.just(maybeValue)`](#just "L.just :: Maybe a -> PLens s a")

`L.just` returns a read-only lens whose view is always the given value.  In
other words, for all `x`, `y` and `z`:

```jsx
   L.get(L.just(z), x) = z
L.set(L.just(z), y, x) = x
```

Note that `L.just(x)` is equivalent to [`L.to(_ => x)`](#to).

`L.just` can be seen as the unit function of the monad formed
with [`L.chain`](#chain).

##### <a name="nothing"></a>[`L.nothing`](#nothing "L.nothing :: PLens s s")

`L.nothing` is a read-only lens whose view is always `undefined`.  In other
words, for all `x` and `y`:

```jsx
   L.get(L.nothing, x) = undefined
L.set(L.nothing, y, x) = x
```

`L.nothing` is the identity element of [`L.choice`](#choice).

##### <a name="orElse"></a>[`L.orElse(backupLens, primaryLens)`](#orElse "L.orElse :: (PLens s a, PLens s a) -> PLens s a")

`L.orElse(backupLens, primaryLens)` acts like `primaryLens` when its view is not
`undefined` and otherwise like `backupLens`.  You can use `L.orElse` on its own
with [`R.reduceRight`](http://ramdajs.com/docs/#reduceRight)
(and [`R.reduce`](http://ramdajs.com/docs/#reduce)) to create an associative
choice over lenses or use `L.orElse` to specify a default or backup lens
for [`L.choice`](#choice), for example.

##### <a name="to"></a>[`L.to(maybeValue => maybeValue)`](#to "L.to :: (a -> b) -> PLens a b")

`L.to` creates a read-only lens whose view is determined by the given function.

For example:

```js
L.get(["x", L.to(x => x + 1)], {x: 1})
// 2
```
```js
L.set(["x", L.to(x => x + 1)], 3, {x: 1})
// { x: 1 }
```

#### Recursion

##### <a name="lazy"></a>[`L.lazy(optic => optic)`](#lazy "L.lazy :: POptic s a -> POptic s a")

`L.lazy` can be used to construct optics lazily.  The function given to `L.lazy`
is passed a forwarding proxy to its return value and can also make forward
references to other optics and possibly construct a recursive optic.

For example, here is a traversal that targets all the non-arrays in a data
structure of nested arrays:

```js
const flatten = L.lazy(rec => {
  const nest = [L.sequence, rec]
  return L.choose(x => R.is(Array, x) ? nest : L.identity)
})
```

Note that the above creates a cyclic representation of the traversal.

Now, for example:

```js
L.collect(flatten, [[[1], 2], 3, [4, [[5]], [6]]])
// [ 1, 2, 3, 4, 5, 6 ]
```
```js
L.modify(flatten, x => x+1, [[[1], 2], 3, [4, [[5]], [6]]])
// [ [ [ 2 ], 3 ], 4, [ 5, [ [Object] ], [ 7 ] ] ]
```
```js
L.modify(flatten, x => 3 <= x && x <= 5 ? undefined : x, [[[1], 2], 3, [4, [[5]], [6]]])
// [ [ [ 1 ], 2 ], [ [ 6 ] ] ]
```

#### Transforming data

##### <a name="pick"></a>[`L.pick({prop: lens, ...props})`](#pick "L.pick :: {p1 :: PLens s a1, ...pls} -> PLens s {p1 :: a1, ...pls}")

`L.pick` creates a lens out of the given object template of lenses and allows
one to pick apart a data structure and then put it back together.  When viewed,
an object is created, whose properties are obtained by viewing through the
lenses of the template.  When set with an object, the properties of the object
are set to the context via the lenses of the template.  `undefined` is treated
as the equivalent of empty or non-existent in both directions.

For example, let's say we need to deal with data and schema in need of some
semantic restructuring:

```js
const sampleFlat = {px: 1, py: 2, vx: 1.0, vy: 0.0}
```

We can use `L.pick` to create lenses to pick apart the data and put it back
together into a more meaningful structure:

```js
const asVec = prefix => L.pick({x: prefix + "x", y: prefix + "y"})
const sanitize = L.pick({pos: asVec("p"), vel: asVec("v")})
```

We now have a better structured view of the data:

```js
L.get(sanitize, sampleFlat)
// { pos: { x: 1, y: 2 }, vel: { x: 1, y: 0 } }
```

That works in both directions:

```js
L.modify([sanitize, "pos", "x"], R.add(5), sampleFlat)
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

##### <a name="replace"></a>[`L.replace(maybeValueIn, maybeValueOut)`](#replace "L.replace :: Maybe s -> Maybe s -> PLens s s")

`L.replace(maybeValueIn, maybeValueOut)`, when viewed, replaces the value
`maybeValueIn` with `maybeValueOut` and vice versa when set.

For example:

```js
L.get(L.replace(1, 2), 1)
// 2
```
```js
L.set(L.replace(1, 2), 2, 0)
// 1
```

The main use case for `replace` is to handle optional and required properties
and elements.  In most cases, rather than using `replace`, you will make
selective use of [`defaults`](#defaults), [`required`](#required)
and [`define`](#define).

### Isomorphisms

Aside from lenses, there is support for isomorphisms.  A lens, `iso`, is an
isomorphism iff the following equations hold for all `x` and `y` in the domain
and range, respectively, of the lens:

```jsx
L.set(iso, L.get(iso, x), undefined) = x
L.get(iso, L.set(iso, y, undefined)) = y
```

The above equations mean that `x => L.get(iso, x)` and `y => L.set(iso, y,
undefined)` are inverses of each other.

You can create new isomorphisms using [`L.lens`](#lens) and by composing
existing isomorphism, because the composition of two isomorphisms is also an
isomorphism.

#### Operations on isomorphisms

##### <a name="getInverse"></a>[`L.getInverse(isomorphism, maybeData)`](#getInverse "L.getInverse :: PIso a b -> Maybe b -> Maybe a")

`L.getInverse` views through an isomorphism in the inverse direction.

For example:

```js
L.getInverse(L.fromArrayBy("id"), {'1': {id: 1, value: 2}, '3': {id: 3, value: 4}})
// [ { id: 1, value: 2 }, { id: 3, value: 4 } ]
```

Note that `L.getInverse(iso, data)` is equivalent to `L.set(iso, data,
undefined)`.

Also note that, while `L.getInverse` makes most sense when used with an
isomorphism, it is valid to use `L.getInverse` with lenses in general.  For
example:

```js
L.getInverse([0, "meaning"], 42)
// [ { meaning: 42 } ]
```

#### Isomorphisms and combinators

##### <a name="fromArrayBy"></a>[`L.fromArrayBy(idPropName)`](#fromArrayBy "L.fromArrayBy :: (p :: String) -> PIso [{p :: String, ...ps}] {String: {p :: String, ...ps}}")

**`L.fromArrayBy` is experimental and might be removed, renamed or changed
semantically before next major release.**

`L.fromArrayBy(id)` is an isomorphism that converts an array of objects
containing `id` properties into an object with the `id`s as keys and the array
elements as values.

For example:

```js
L.get(L.fromArrayBy("id"), [{id: 1, value: 2}, {id: 3, value: 4}])
// { '1': { id: 1, value: 2 }, '3': { id: 3, value: 4 } }
```
```js
L.set([L.fromArrayBy("id"), "3", "value"], 5, [{id: 1, value: 2}, {id: 3, value: 4}])
// [ { id: 1, value: 2 }, { id: 3, value: 5 } ]
```

##### <a name="identity"></a>[`L.identity`](#identity "L.identity :: PIso s s")

`L.identity` is the identity element of lens composition and also the identity
isomorphism.  The following equations characterize `L.identity`:

```jsx
      L.get(L.identity, x) = x
L.modify(L.identity, f, x) = f(x)
  L.compose(L.identity, l) = l
  L.compose(l, L.identity) = l
```

##### <a name="inverse"></a>[`L.inverse`](#inverse "L.inverse :: PIso a b -> PIso b a")

`L.inverse(iso)` returns the inverse of the given isomorphism.  Note that this
operation only works on isomorphisms.

For example:

```js
L.get(L.inverse(L.fromArrayBy('id')), {a: {id: "a", x: 1}, b: {id: "b", x: 2}})
// [ { id: 'a', x: 1 }, { id: 'b', x: 2 } ]
```

### Traversals

Aside from lenses, there is support for traversals.  Traversals and lenses can
be composed and the result is a traversal.  A traversal operates over a
collection of focuses and for this reason traversals cannot be viewed
([`get`](#get) does not work on a traversal), but they can
be [collected](#collect), [folded](#foldMapOf), [modified](#modify), [set](#set)
and [removed](#remove).

#### Operations on traversals

##### <a name="collect"></a>[`L.collect(traversal, maybeData)`](#collect "L.collect :: PTraversal s a -> Maybe s -> [a]")

`L.collect` returns an array of the elements focused on by the given traversal
or lens from a data structure.  Given a lens, there will be 0 or 1 elements in
the returned array.  Given a traversal, there can be any number of elements in
the returned array.

For example:

```js
L.collect(["xs", L.sequence, "x"], {xs: [{x: 1}, {x: 2}]})
// [ 1, 2 ]
```

`L.collect(traversal, maybeData)` is equivalent
to [`L.foldMapOf(List, traversal, toList, maybeData)`](#foldMapOf) where `List`
and `toList` are defined as follows:

```js
const List = {empty: R.always([]), concat: R.concat}
const toList = x => x !== undefined ? [x] : []
```

The internal implementation of `L.collect` is optimized and faster than the
above naïve implementation.

##### <a name="foldMapOf"></a>[`L.foldMapOf({empty: value, concat: (value, value) => value}, traversal, maybeValue => value, maybeData)`](#foldMapOf "L.foldMapOf :: {empty: () -> r, concat: (r, r) -> r} -> PTraversal s a -> (Maybe a -> r) -> Maybe s -> r")

`L.foldMapOf({empty, concat}, t, aM2r, s)` performs a map, using given function
`aM2r`, and fold, using the given `concat` and `empty` operations, over the
elements focused on by the given traversal or lens `t` from the given data
structure `s`.  The `concat` operation and the constant returned by `empty()`
should form
a
[monoid](https://github.com/rpominov/static-land/blob/master/docs/spec.md#monoid) over
the values returned by `aM2r`.

For example:

```js
L.foldMapOf({empty: () => 0, concat: (x, y) => x + y}, L.sequence, x => x, [1,2,3])
// 6
```

#### Creating new traversals

##### <a name="branch-op"></a>[`L.branch({prop: traversal, ...props})`](#branch-op "L.branch :: {p1 :: PTraversal s a, ...pts} -> PTraversal s a")

`L.branch` is given a template object of traversals and returns a traversal that
visits all the properties of an object according to the template.

For example, continuing on the [BST example](#food-for-thought-bst-as-a-lens),
here is a traversal that visits all the values of a binary tree in order:

```js
const values = L.lazy(rec => [
  L.optional,
  naiveBST,
  L.branch({smaller: rec,
            value: L.identity,
            greater: rec})])
```

Given a binary tree `sampleBST` we can now:

```js
L.collect(values, sampleBST)
// [ 2, 3, 1 ]
```
```js
L.modify(values, x => -x, sampleBST)
// { key: 'c',
//   value: -1,
//   smaller: { key: 'a', value: -2, greater: { key: 'b', value: -3 } } }
```
```js
L.modify(values, x => x <= 2 ? undefined : x, sampleBST)
// { key: 'b', value: 3 }
```

#### Traversals and combinators

##### <a name="optional"></a>[`L.optional`](#optional "L.optional :: PTraversal a a")

`L.optional` is a traversal over an optional element.  When the focus of
`L.optional` is `undefined`, the traversal is empty.  Otherwise the traversal is
over the focused element.

As an example, consider the difference between:

```js
L.set([L.sequence, "x"], 3, [{x: 1}, {y: 2}])
// [ { x: 3 }, { y: 2, x: 3 } ]
```

and:

```js
L.set([L.sequence, "x", L.optional], 3, [{x: 1}, {y: 2}])
// [ { x: 3 }, { y: 2 } ]
```

##### <a name="sequence"></a>[`L.sequence`](#sequence "L.sequence :: PTraversal [a] a")

`L.sequence` is a traversal over an array.

For example:

```js
L.modify(["xs", L.sequence, "x"], R.add(1), {xs: [{x: 1}, {x: 2}]})
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
L.get(["x", L.log()], {x: 10})
// get 10
// 10
```
```js
L.set(["x", L.log("x")], "11", {x: 10})
// x get 10
// x set 11
// { x: '11' }
```
```js
L.set(["x", L.log("%s x: %j")], "11", {x: 10})
// get x: 10
// set x: "11"
// { x: '11' }
```

## Background

### Should I use lenses for...?

As said in the first sentence of this document, lenses are convenient for
performing updates on "individual elements".  Having abilities such
as [searching](#find), [filtering](#filter) and [restructuring](#pick) data
using lenses makes the notion of an individual element quite flexible and, even
further, [traversals](#traversals) make it possible to target zero or more than
one element in a single operation.  It can be tempting to try to do everything
with lenses, but that will likely only lead to misery.  It is important to
understand that lenses are just one of many functional abstractions for working
with data structures and sometimes other approaches can lead to simpler or
easier solutions.  [Zippers](https://github.com/polytypic/fastener), for
example, are, in some ways, less principled and can implement queries and
transforms that are outside the scope of lenses and traversals.

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
const sampleBloated = {
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
          sampleBloated)
// { just: 'some',
//   that: [ 'we', { want: 'to',
//                   filter: ['out'],
//                   including: {the: 'following'} } ] }
```

### Motivation

Consider the following REPL session using Ramda:

```js
R.set(R.lensPath(["x", "y"]), 1, {})
// { x: { y: 1 } }
```
```js
R.set(R.compose(R.lensProp("x"), R.lensProp("y")), 1, {})
// TypeError: Cannot read property 'y' of undefined
```
```js
R.view(R.lensPath(["x", "y"]), {})
// undefined
```
```js
R.view(R.compose(R.lensProp("x"), R.lensProp("y")), {})
// TypeError: Cannot read property 'y' of undefined
```
```js
R.set(R.lensPath(["x", "y"]), undefined, {x: {y: 1}})
// { x: { y: undefined } }
```
```js
R.set(R.compose(R.lensProp("x"), R.lensProp("y")), undefined, {x: {y: 1}})
// { x: { y: undefined } }
```

One might assume that [`R.lensPath([p0,
...ps])`](http://ramdajs.com/docs/#lensPath) is equivalent to
`R.compose(R.lensProp(p0), ...ps.map(R.lensProp))`, but that is not the case.

With partial lenses you can robustly compose a path lens from prop lenses
`L.compose(L.prop(p0), ...ps.map(L.prop))` or just use the shorthand notation
`[p0, ...ps]`.

### Types

To illustrate the idea we could give lenses the naïve type definition

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

### Performance

Here are a few benchmarks on partial lenses (as `L` version 5.0.1) and some
roughly equivalent operations using [Ramda](http://ramdajs.com/) (as `R` version
0.22.1) and [Ramda Lens](https://github.com/ramda/ramda-lens) (as `P` version
0.1.1).

```jsx
L.foldMapOf(Sum, L.sequence, id, xs100) x    476,883 ops/sec ±1.03% (93 runs sampled)
P.sumOf(P.traversed, xs100)             x     23,755 ops/sec ±0.98% (91 runs sampled)
R.sum(xs100)                            x    139,397 ops/sec ±0.89% (92 runs sampled)

L.collect(L.sequence, xs100)            x    161,682 ops/sec ±0.80% (95 runs sampled)

L.modify(L.sequence, inc, xs100)        x  1,732,584 ops/sec ±0.75% (92 runs sampled)
P.over(P.traversed, inc, xs100)         x     14,075 ops/sec ±0.62% (95 runs sampled)
R.map(inc, xs100)                       x  1,831,699 ops/sec ±0.92% (89 runs sampled)

L.get(1, xs)                            x 31,726,123 ops/sec ±1.05% (93 runs sampled)
R.nth(1, xs)                            x  4,065,038 ops/sec ±0.79% (94 runs sampled)
R.view(l_1, xs)                         x  1,997,804 ops/sec ±0.87% (90 runs sampled)

L.set(1, 0, xs)                         x 20,050,763 ops/sec ±0.84% (93 runs sampled)
R.update(1, 0, xs)                      x  7,204,178 ops/sec ±1.18% (90 runs sampled)
R.set(l_1, 0, xs)                       x  1,327,408 ops/sec ±0.76% (91 runs sampled)

L.get("y", xyz)                         x 28,700,322 ops/sec ±1.26% (91 runs sampled)
R.prop("y", xyz)                        x 28,408,733 ops/sec ±0.80% (93 runs sampled)
R.view(l_y, xyz)                        x  3,887,439 ops/sec ±1.04% (91 runs sampled)

L.set("y", 0, xyz)                      x  7,420,159 ops/sec ±0.91% (91 runs sampled)
R.assoc("y", 0, xyz)                    x 12,093,529 ops/sec ±1.05% (91 runs sampled)
R.set(l_y, 0, xyz)                      x  1,988,868 ops/sec ±1.01% (91 runs sampled)

L.get([0,"x",0,"y"], axay)              x 11,007,154 ops/sec ±1.14% (93 runs sampled)
R.view(l_0_x_0_y, axay)                 x    651,656 ops/sec ±0.88% (85 runs sampled)

L.set([0,"x",0,"y"], 0, axay)           x  2,714,121 ops/sec ±0.99% (87 runs sampled)
R.set(l_0_x_0_y, 0, axay)               x    434,891 ops/sec ±1.10% (87 runs sampled)

L.modify([0,"x",0,"y"], inc, axay)      x  2,921,838 ops/sec ±1.23% (91 runs sampled)
R.over(l_0_x_0_y, inc, axay)            x    448,901 ops/sec ±1.04% (89 runs sampled)

L.remove(1, xs)                         x 19,109,535 ops/sec ±0.89% (91 runs sampled)
R.remove(1, 1, xs)                      x  7,589,976 ops/sec ±1.11% (90 runs sampled)

L.remove("y", xyz)                      x 11,218,180 ops/sec ±0.82% (93 runs sampled)
R.dissoc("y", xyz)                      x 13,798,955 ops/sec ±1.22% (88 runs sampled)

L.get(["x","y","z"], xyzn)              x 10,439,571 ops/sec ±1.03% (90 runs sampled)
R.path(["x","y","z"], xyzn)             x 15,463,478 ops/sec ±1.19% (92 runs sampled)
R.view(l_xyz, xyzn)                     x  3,666,028 ops/sec ±1.00% (89 runs sampled)
R.view(l_x_y_z, xyzn)                   x  1,384,054 ops/sec ±1.09% (92 runs sampled)

L.set(["x","y","z"], 0, xyzn)           x  2,474,972 ops/sec ±1.04% (91 runs sampled)
R.assocPath(["x","y","z"], 0, xyzn)     x  2,414,916 ops/sec ±1.03% (92 runs sampled)
R.set(l_xyz, 0, xyzn)                   x  1,213,748 ops/sec ±0.82% (90 runs sampled)
R.set(l_x_y_z, 0, xyzn)                 x    804,891 ops/sec ±1.24% (89 runs sampled)

L.remove(50, xs100)                     x  4,710,820 ops/sec ±1.71% (91 runs sampled)
R.remove(50, 1, xs100)                  x    973,368 ops/sec ±1.08% (94 runs sampled)

L.set(50, 2, xs100)                     x  4,464,694 ops/sec ±1.09% (89 runs sampled)
R.update(50, 2, xs100)                  x  1,661,162 ops/sec ±0.57% (96 runs sampled)
```

At the time of writing, various operations on *partial lenses have been
optimized for common cases*, but there is definitely a lot of room for
improvement.  The goal is to make partial lenses fast enough that performance
isn't the reason why you might not want to use them.

See [bench.js](./bench/bench.js) for details.

## Related work

Lenses are an old concept and there are dozens of academic papers on lenses and
dozens of lens libraries for various languages.  Here are just a few links:

* [Polymorphic Update with van Laarhoven Lenses](http://r6.ca/blog/20120623T104901Z.html)
* [A clear picture of lens laws](http://sebfisch.github.io/research/pub/Fischer+MPC15.pdf)
* [ramda/ramda-lens](https://github.com/ramda/ramda-lens)
* [ekmett/lens](https://github.com/ekmett/lens)
* [julien-truffaut/Monocle](https://github.com/julien-truffaut/Monocle)
* [xyncro/aether](https://github.com/xyncro/aether)

Feel free to suggest more links!
