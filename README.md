# <a id="partial-lenses"></a> Partial Lenses &middot; [![Gitter](https://img.shields.io/gitter/room/calmm-js/chat.js.svg)](https://gitter.im/calmm-js/chat) [![GitHub stars](https://img.shields.io/github/stars/calmm-js/partial.lenses.svg?style=social)](https://github.com/calmm-js/partial.lenses) [![npm](https://img.shields.io/npm/dm/partial.lenses.svg)](https://www.npmjs.com/package/partial.lenses)

Lenses are basically an abstraction for simultaneously specifying operations
to [update](#L-modify) and [query](#L-get) [immutable](#on-immutability) data
structures.  Lenses are [highly composable](#on-composability) and can
be [efficient](#benchmarks).  This library provides
a [rich collection](#on-bundle-size-and-minification)
of [partial](#on-partiality) [isomorphisms](#isomorphisms), [lenses](#lenses),
and [traversals](#traversals), collectively known as [optics](#optics), for
manipulating [JSON](http://json.org/) and
users [can](#L-toFunction) [write](#L-iso) [new](#L-lens) [optics](#L-branch)
for manipulating non-JSON objects, such as [Immutable.js](#interfacing)
collections.  A partial lens can *view* optional data, *insert* new data,
*update* existing data and *remove* existing data and can, for example, provide
*defaults* and maintain *required* data structure
parts.  [Try Lenses!](https://calmm-js.github.io/partial.lenses/playground.html)

[![npm version](https://badge.fury.io/js/partial.lenses.svg)](http://badge.fury.io/js/partial.lenses)
[![Bower version](https://badge.fury.io/bo/partial.lenses.svg)](https://badge.fury.io/bo/partial.lenses)
[![Build Status](https://travis-ci.org/calmm-js/partial.lenses.svg?branch=master)](https://travis-ci.org/calmm-js/partial.lenses)
[![Code Coverage](https://img.shields.io/codecov/c/github/calmm-js/partial.lenses/master.svg)](https://codecov.io/github/calmm-js/partial.lenses?branch=master)
[![](https://david-dm.org/calmm-js/partial.lenses.svg)](https://david-dm.org/calmm-js/partial.lenses)
[![](https://david-dm.org/calmm-js/partial.lenses/dev-status.svg)](https://david-dm.org/calmm-js/partial.lenses?type=dev)

## Contents

* [Tutorial](#tutorial)
* [Reference](#reference)
  * [Stable subset](#stable-subset)
  * [Optics](#optics)
    * [On partiality](#on-partiality)
    * [On immutability](#on-immutability)
    * [On composability](#on-composability)
    * [Operations on optics](#operations-on-optics)
      * [`L.modify(optic, (maybeValue, index) => maybeValue, maybeData) ~> maybeData`](#L-modify "L.modify: POptic s a -> ((Maybe a, Index) -> Maybe a) -> Maybe s -> Maybe s")
      * [`L.remove(optic, maybeData) ~> maybeData`](#L-remove "L.remove: POptic s a -> Maybe s -> Maybe s")
      * [`L.set(optic, maybeValue, maybeData) ~> maybeData`](#L-set "L.set: POptic s a -> Maybe a -> Maybe s -> Maybe s")
      * [`L.traverse(category, (maybeValue, index) => operation, optic, maybeData) ~> operation`](#L-traverse "L.traverse: (Functor|Applicative|Monad) c -> ((Maybe a, Index) -> c b) -> POptic s t a b -> Maybe s -> c t")
    * [Nesting](#nesting)
      * [`L.compose(...optics) ~> optic`](#L-compose "L.compose: (POptic s s1, ...POptic sN a) -> POptic s a") or `[...optics]`
    * [Querying](#querying)
      * [`L.chain((value, index) => optic, optic) ~> optic`](#L-chain "L.chain: ((a, Index) -> POptic s b) -> POptic s a -> POptic s b")
      * [`L.choice(...lenses) ~> optic`](#L-choice "L.choice: (...PLens s a) -> POptic s a")
      * [`L.choose((maybeValue, index) => optic) ~> optic`](#L-choose "L.choose: ((Maybe s, Index) -> POptic s a) -> POptic s a")
      * [`L.optional ~> optic`](#L-optional "L.optional: POptic a a")
      * [`L.when((maybeValue, index) => testable) ~> optic`](#L-when "L.when: ((Maybe a, Index) -> Boolean) -> POptic a a")
      * [`L.zero ~> optic`](#L-zero "L.zero: POptic s a")
    * [Recursing](#recursing)
      * [`L.lazy(optic => optic) ~> optic`](#L-lazy "L.lazy: (POptic s a -> POptic s a) -> POptic s a")
    * [Debugging](#debugging)
      * [`L.log(...labels) ~> optic`](#L-log "L.log: (...Any) -> POptic s s")
    * [Internals](#internals)
      * [`L.toFunction(optic) ~> optic`](#L-toFunction "L.toFunction: POptic s t a b -> (Maybe s, Index, (Functor|Applicative|Monad) c, (Maybe a, Index) -> c b) -> c t")
  * [Transforms](#transforms)
    * [Sequencing](#sequencing)
      * [`L.seq(...optics) ~> transform`](#L-seq "L.seq: (...POptic s a) -> PTransform s a")
  * [Traversals](#traversals)
    * [Operations on traversals](#operations-on-traversals)
      * [`L.concat(monoid, traversal, maybeData) ~> value`](#L-concat "L.concat: Monoid a -> (PTraversal s a -> Maybe s -> a)")
      * [`L.concatAs((maybeValue, index) => value, monoid, traversal, maybeData) ~> value`](#L-concatAs "L.concatAs: ((Maybe a, Index) -> r) -> Monoid r -> (PTraversal s a -> Maybe s -> r)")
    * [Folds over traversals](#folds-over-traversals)
      * [`L.all((maybeValue, index) => testable, traversal, maybeData) ~> boolean`](#L-all "L.all: ((Maybe a, Index) -> Boolean) -> PTraversal s a -> Boolean")
      * [`L.and(traversal, maybeData) ~> boolean`](#L-and "L.or: PTraversal s Boolean -> Boolean")
      * [`L.any((maybeValue, index) => testable, traversal, maybeData) ~> boolean`](#L-any "L.any: ((Maybe a, Index) -> Boolean) -> PTraversal s a -> Boolean")
      * [`L.collect(traversal, maybeData) ~> [...values]`](#L-collect "L.collect: PTraversal s a -> Maybe s -> [a]")
      * [`L.collectAs((maybeValue, index) => maybeValue, traversal, maybeData) ~> [...values]`](#L-collectAs "L.collectAs: ((Maybe a, Index) -> Maybe b) -> PTraversal s a -> Maybe s -> [b]")
      * [`L.count(traversal, maybeData) ~> number`](#L-count "L.count: PTraversal s a -> Number")
      * [`L.countIf((maybeValue, index) => testable, traversal, maybeData) ~> number`](#L-countIf "L.countIf: ((Maybe a, Index) -> Boolean) -> PTraversal s a -> Number")
      * [`L.foldl((value, maybeValue, index) => value, value, traversal, maybeData) ~> value`](#L-foldl "L.foldl: ((r, Maybe a, Index) -> r) -> r -> PTraversal s a -> Maybe s -> r")
      * [`L.foldr((value, maybeValue, index) => value, value, traversal, maybeData) ~> value`](#L-foldr "L.foldr: ((r, Maybe a, Index) -> r) -> r -> PTraversal s a -> Maybe s -> r")
      * [`L.isEmpty(traversal, maybeData) ~> boolean`](#L-isEmpty "L.isEmpty: PTraversal s a -> Maybe s -> Boolean")
      * [`L.join(string, traversal, maybeData) ~> string`](#L-join "L.join: String -> PTraversal s a -> Maybe s -> String")
      * [`L.joinAs((maybeValue, index) => maybeString, string, traversal, maybeData) ~> string`](#L-joinAs "L.joinAs: ((Maybe a, Index) -> Maybe String) -> String -> PTraversal s a -> Maybe s -> String")
      * [`L.maximum(traversal, maybeData) ~> maybeValue`](#L-maximum "L.maximum: Ord a => PTraversal s a -> Maybe s -> Maybe a")
      * [`L.maximumBy((maybeValue, index) => maybeKey, traversal, maybeData) ~> maybeValue`](#L-maximumBy "L.maximumBy: Ord k => ((Maybe a, Index) -> Maybe k) -> PTraversal s a -> Maybe s -> Maybe a")
      * [`L.minimum(traversal, maybeData) ~> maybeValue`](#L-minimum "L.minimum: Ord a => PTraversal s a -> Maybe s -> Maybe a")
      * [`L.minimumBy((maybeValue, index) => maybeKey, traversal, maybeData) ~> maybeValue`](#L-minimumBy "L.minimumBy: Ord k => ((Maybe a, Index) -> Maybe k) -> PTraversal s a -> Maybe s -> Maybe a")
      * [`L.or(traversal, maybeData) ~> boolean`](#L-or "L.or: PTraversal s Boolean -> Boolean")
      * [`L.product(traversal, maybeData) ~> number`](#L-product "L.product: PTraversal s Number -> Maybe s -> Number")
      * [`L.productAs((maybeValue, index) => number, traversal, maybeData) ~> number`](#L-productAs "L.productAs: ((Maybe a, Index) -> Number) -> PTraversal s a -> Maybe s -> Number")
      * [`L.select(traversal, maybeData) ~> maybeValue`](#L-select "L.select: PTraversal s a -> Maybe s -> Maybe a")
      * [`L.selectAs((maybeValue, index) => maybeValue, traversal, maybeData) ~> maybeValue`](#L-selectAs "L.selectAs: ((Maybe a, Index) -> Maybe b) -> PTraversal s a -> Maybe s -> Maybe b")
      * [`L.sum(traversal, maybeData) ~> number`](#L-sum "L.sum: PTraversal s Number -> Maybe s -> Number")
      * [`L.sumAs((maybeValue, index) => number, traversal, maybeData) ~> number`](#L-sumAs "L.sumAs: ((Maybe a, Index) -> Number) -> PTraversal s a -> Maybe s -> Number")
    * [Creating new traversals](#creating-new-traversals)
      * [`L.branch({prop: traversal, ...props}) ~> traversal`](#L-branch "L.branch: {p1: PTraversal s a, ...pts} -> PTraversal s a")
    * [Traversals and combinators](#traversals-and-combinators)
      * [`L.elems ~> traversal`](#L-elems "L.elems: PTraversal [a] a")
      * [`L.values ~> traversal`](#L-values "L.values: PTraversal {p: a, ...ps} a")
      * [`L.matches(/.../g) ~> traversal`](#L-matches-g "L.matches: RegExp -> PTraversal String String")
  * [Lenses](#lenses)
    * [Operations on lenses](#operations-on-lenses)
      * [`L.get(lens, maybeData) ~> maybeValue`](#L-get "L.get: PLens s a -> Maybe s -> Maybe a")
    * [Creating new lenses](#creating-new-lenses)
      * [`L.lens((maybeData, index) => maybeValue, (maybeValue, maybeData, index) => maybeData) ~> lens`](#L-lens "L.lens: ((Maybe s, Index) -> Maybe a) -> ((Maybe a, Maybe s, Index) -> Maybe s) -> PLens s a")
      * [`L.setter((maybeValue, maybeData, index) => maybeData) ~> lens`](#L-setter "L.setter: ((Maybe a, Maybe s, Index) -> Maybe s) -> PLens s a")
      * [`L.lensFromFT((traversal, maybeData) ~> maybeValue, traversal) ~> lens`](#L-lensFromFT "L.lensFromFT: (PTraversal s a -> Maybe s -> Maybe a) -> PTraversal s a -> PLens s a")
    * [Computing derived props](#computing-derived-props)
      * [`L.augment({prop: object => value, ...props}) ~> lens`](#L-augment "L.augment: {p1: o -> a1, ...ps} -> PLens {...o} {...o, p1: a1, ...ps}")
    * [Enforcing invariants](#enforcing-invariants)
      * [`L.defaults(valueIn) ~> lens`](#L-defaults "L.defaults: s -> PLens s s")
      * [`L.define(value) ~> lens`](#L-define "L.define: s -> PLens s s")
      * [`L.normalize((value, index) => maybeValue) ~> lens`](#L-normalize "L.normalize: ((s, Index) -> Maybe s) -> PLens s s")
      * [`L.required(valueOut) ~> lens`](#L-required "L.required: s -> PLens s s")
      * [`L.rewrite((valueOut, index) => maybeValueOut) ~> lens`](#L-rewrite "L.rewrite: ((s, Index) -> Maybe s) -> PLens s s")
    * [Lensing array-like objects](#array-like)
      * [`L.append ~> lens`](#L-append "L.append: PLens [a] a")
      * [`L.filter((maybeValue, index) => testable) ~> lens`](#L-filter "L.filter: ((Maybe a, Index) -> Boolean) -> PLens [a] [a]")
      * [`L.find((maybeValue, index) => testable) ~> lens`](#L-find "L.find: ((Maybe a, Index) -> Boolean) -> PLens [a] a")
      * [`L.findHint((maybeValue, {hint: index}) => testable, {hint: index}) ~> lens`](#L-findHint "L.findHint: ((Maybe a, {hint: Index}) -> Boolean, {hint: Index}) -> PLens [a] a")
      * [`L.findWith(...lenses) ~> lens`](#L-findWith "L.findWith: (PLens s s1, ...PLens sN a) -> PLens [s] a")
      * [`L.index(elemIndex) ~> lens`](#L-index "L.index: Integer -> PLens [a] a") or `elemIndex`
      * [`L.last ~> lens`](#L-last "L.last: PLens [a] a")
      * [`L.slice(maybeBegin, maybeEnd) ~> lens`](#L-slice "L.slice: Maybe Integer -> Maybe Integer -> PLens [a] [a]")
    * [Lensing objects](#lensing-objects)
      * [`L.prop(propName) ~> lens`](#L-prop "L.prop: (p: a) -> PLens {p: a, ...ps} a") or `propName`
      * [`L.props(...propNames) ~> lens`](#L-props "L.props: (p1: a1, ...ps) -> PLens {p1: a1, ...ps, ...o} {p1: a1, ...ps}")
      * [`L.removable(...propNames) ~> lens`](#L-removable "L.removable (p1: a1, ...ps) -> PLens {p1: a1, ...ps, ...o} {p1: a1, ...ps, ...o}")
    * [Lensing strings](#lensing-strings)
      * [`L.matches(/.../) ~> lens`](#L-matches "L.matches: RegExp -> PLens String String")
    * [Providing defaults](#providing-defaults)
      * [`L.valueOr(valueOut) ~> lens`](#L-valueOr "L.valueOr: s -> PLens s s")
    * [Adapting to data](#adapting-to-data)
      * [`L.orElse(backupLens, primaryLens) ~> lens`](#L-orElse "L.orElse: (PLens s a, PLens s a) -> PLens s a")
    * [Transforming data](#transforming-data)
      * [`L.pick({prop: lens, ...props}) ~> lens`](#L-pick "L.pick: {p1: PLens s a1, ...pls} -> PLens s {p1: a1, ...pls}")
      * [`L.replace(maybeValueIn, maybeValueOut) ~> lens`](#L-replace "L.replace: Maybe s -> Maybe s -> PLens s s")
  * [Isomorphisms](#isomorphisms)
    * [Operations on isomorphisms](#operations-on-isomorphisms)
      * [`L.getInverse(isomorphism, maybeData) ~> maybeData`](#L-getInverse "L.getInverse: PIso a b -> Maybe b -> Maybe a")
    * [Creating new isomorphisms](#creating-new-isomorphisms)
      * [`L.iso(maybeData => maybeValue, maybeValue => maybeData) ~> isomorphism`](#L-iso "L.iso: (Maybe s -> Maybe a) -> (Maybe a -> Maybe s) -> PIso s a")
    * [Isomorphism combinators](#isomorphism-combinators)
      * [`L.inverse(isomorphism) ~> isomorphism`](#L-inverse "L.inverse: PIso a b -> PIso b a")
    * [Basic isomorphisms](#basic-isomorphisms)
      * [`L.complement ~> isomorphism`](#L-complement "L.complement: PIso Boolean Boolean")
      * [`L.identity ~> isomorphism`](#L-identity "L.identity: PIso s s")
      * [`L.is(value) ~> isomorphism`](#L-is "L.is: v -> PIso v Boolean")
    * [Standard isomorphisms](#standard-isomorphisms)
      * [`L.uri ~> isomorphism`](#L-uri "L.uri: PIso String String")
      * [`L.uriComponent ~> isomorphism`](#L-uriComponent "L.uriComponent: PIso String String")
      * [`L.json({reviver, replacer, space}) ~> isomorphism`](#L-json "L.json: {reviver, replacer, space} -> PIso String JSON")
  * [Auxiliary](#auxiliary)
    * [`L.seemsArrayLike(anything) ~> boolean`](#L-seemsArrayLike "L.seemsArrayLike: any -> Boolean")
* [Examples](#examples)
  * [An array of ids as boolean flags](#an-array-of-ids-as-boolean-flags)
  * [Dependent fields](#dependent-fields)
  * [Collection toggle](#collection-toggle)
  * [BST as a lens](#bst-as-a-lens)
  * [Interfacing with Immutable.js](#interfacing)
* [Background](#background)
  * [Motivation](#motivation)
  * [Design choices](#design-choices)
  * [On bundle size and minification](#on-bundle-size-and-minification)
  * [Benchmarks](#benchmarks)
  * [Lenses all the way](#lenses-all-the-way)
  * [Related work](#related-work)
* [Contributing](#contributing)

## Tutorial

Let's look at an example that is based on an actual early use case that lead to
the development of this library.  What we have is an external HTTP API that both
produces and consumes JSON objects that include, among many other properties, a
`titles` property:

```js
const sampleTitles = {
  titles: [{ language: "en", text: "Title" },
           { language: "sv", text: "Rubrik" }]
}
```

We ultimately want to present the user with a rich enough editor, with features
such as undo-redo and validation, for manipulating the content represented by
those JSON objects.  The `titles` property is really just one tiny part of the
data model, but, in this tutorial, we only look at it, because it is sufficient
for introducing most of the basic ideas.

So, what we'd like to have is a way to access the `text` of titles in a given
language.  Given a language, we want to be able to

* get the corresponding text,
* update the corresponding text,
* insert a new text and the immediately surrounding object in a new language, and
* remove an existing text and the immediately surrounding object.

Furthermore, when updating, inserting, and removing texts, we'd like the
operations to treat the JSON as [immutable](#on-immutability) and create new
JSON objects with the changes rather than mutate existing JSON objects, because
this makes it trivial to support features such as undo-redo and can also help to
avoid bugs associated with mutable state.

Operations like these are what lenses are good at.  Lenses can be seen as a
simple embedded [DSL](https://en.wikipedia.org/wiki/Domain-specific_language)
for specifying data manipulation and querying functions.  Lenses allow you to
focus on an element in a data structure by specifying a path from the root of
the data structure to the desired element.  Given a lens, one can then perform
operations, like [`get`](#L-get) and [`set`](#L-set), on the element that the
lens focuses on.

### Getting started

Let's first import the libraries

```jsx
import * as L from "partial.lenses"
import * as R from "ramda"
```

and [▶ play](https://calmm-js.github.io/partial.lenses/#getting-started) just a
bit with lenses.

> Note that links with
> the [▶ play](https://calmm-js.github.io/partial.lenses/#getting-started)
> symbol, take you to an interactive version of this page where almost all of
> the code snippets are editable and evaluated in the browser.  Note that due to
> the large number of snippets the interactive version of this page takes awhile
> to render.  There is also a
> separate
> [playground page](https://calmm-js.github.io/partial.lenses/playground.html)
> that allows you to quickly try out lenses.

As mentioned earlier, with lenses we can specify a path to focus on an element.
To specify such a path we use primitive lenses
like [`L.prop(propName)`](#L-prop), to access a named property of an object,
and [`L.index(elemIndex)`](#L-index), to access an element at a given index in
an array, and compose the path using [`L.compose(...lenses)`](#L-compose).

So, to just [get](#L-get) at the `titles` array of the `sampleTitles` we can use
the lens [`L.prop("titles")`](#L-prop):

```js
L.get(L.prop("titles"),
      sampleTitles)
// [{ language: "en", text: "Title" },
//  { language: "sv", text: "Rubrik" }]
```

To focus on the first element of the `titles` array, we compose with
the [`L.index(0)`](#L-index) lens:

```js
L.get(L.compose(L.prop("titles"),
                L.index(0)),
      sampleTitles)
// { language: "en", text: "Title" }
```

Then, to focus on the `text`, we compose with [`L.prop("text")`](#L-prop):

```js
L.get(L.compose(L.prop("titles"),
                L.index(0),
                L.prop("text")),
      sampleTitles)
// "Title"
```

We can then use the same composed lens to also [set](#L-set) the `text`:

```js
L.set(L.compose(L.prop("titles"),
                L.index(0),
                L.prop("text")),
      "New title",
      sampleTitles)
// { titles: [{ language: "en", text: "New title" },
//            { language: "sv", text: "Rubrik" }] }
```

In practise, specifying ad hoc lenses like this is not very useful.  We'd like
to access a text in a given language, so we want a lens parameterized by a given
language.  To create a parameterized lens, we can write a function that returns
a lens.  Such a lens should then [find](#L-find) the title in the desired
language.

Furthermore, while a simple path lens like above allows one to get and set an
existing text, it doesn't know enough about the data structure to be able to
properly insert new and remove existing texts.  So, we will also need to specify
such details along with the path to focus on.

### A partial lens to access title texts

Let's then just [compose](#L-compose) a parameterized lens for accessing the
`text` of titles:

```js
const textIn = language => L.compose(L.prop("titles"),
                                     L.define([]),
                                     L.normalize(R.sortBy(L.get("language"))),
                                     L.find(R.whereEq({language})),
                                     L.valueOr({language, text: ""}),
                                     L.removable("text"),
                                     L.prop("text"))
```

Take a moment to read through the above definition line by line.  Each part
either specifies a step in the path to select the desired element or a way in
which the data structure must be treated at that point.
The [`L.prop(...)`](#L-prop) parts are already familiar.  The other parts we
will mention below.

### Querying data

Thanks to the parameterized search
part, [`L.find(R.whereEq({language}))`](#L-find), of the lens composition, we
can use it to query titles:

```js
L.get(textIn("sv"), sampleTitles)
// 'Rubrik'
```
```js
L.get(textIn("en"), sampleTitles)
// 'Title'
```

The [`L.find`](#L-find) lens is a given a predicate that it then uses to find an
element from an array to focus on.  In this case the predicate is specified with
the help of Ramda's [`R.whereEq`](http://ramdajs.com/docs/#whereEq) function
that creates an equality predicate from a given template object.

#### Missing data can be expected

Partial lenses can generally deal with missing data.  In this case,
when [`L.find`](#L-find) doesn't find an element, it instead works like a lens
to [append](#L-append) a new element into an array.

So, if we use the partial lens to query a title that does not exist, we get the
default:

```js
L.get(textIn("fi"), sampleTitles)
// ''
```

We get this value, rather than `undefined`, thanks to
the [`L.valueOr({language, text: ""})`](#L-valueOr) part of our lens
composition, which ensures that we get the specified value rather than `null` or
`undefined`.  We get the default even if we query from `undefined`:

```js
L.get(textIn("fi"), undefined)
// ''
```

With partial lenses, `undefined` is the equivalent of empty or non-existent.

### Updating data

As with ordinary lenses, we can use the same lens to update titles:

```js
L.set(textIn("en"), "The title", sampleTitles)
// { titles: [ { language: 'en', text: 'The title' },
//             { language: 'sv', text: 'Rubrik' } ] }
```

### Inserting data

The same partial lens also allows us to insert new titles:

```js
L.set(textIn("fi"), "Otsikko", sampleTitles)
// { titles: [ { language: 'en', text: 'Title' },
//             { language: 'fi', text: 'Otsikko' },
//             { language: 'sv', text: 'Rubrik' } ] }
```

There are couple of things here that require attention.

The reason that the newly inserted object not only has the `text` property, but
also the `language` property is due to
the [`L.valueOr({language, text: ""})`](#L-valueOr) part that we used to provide
a default.

Also note the position into which the new title was inserted.  The array of
titles is kept sorted thanks to
the [`L.normalize(R.sortBy(L.get("language")))`](#L-normalize) part of our lens.
The [`L.normalize`](#L-normalize) lens transforms the data when either read or
written with the given function.  In this case we used
Ramda's [`R.sortBy`](http://ramdajs.com/docs/#sortBy) to specify that we want
the titles to be kept sorted by language.

### Removing data

Finally, we can use the same partial lens to remove titles:

```js
L.set(textIn("sv"), undefined, sampleTitles)
// { titles: [ { language: 'en', text: 'Title' } ] }
```

Note that a single title `text` is actually a part of an object.  The key to
having the whole object vanish, rather than just the `text` property, is
the [`L.removable("text")`](#L-removable) part of our lens composition.  It
makes it so that when the `text` property is set to `undefined`, the result will
be `undefined` rather than merely an object without the `text` property.

If we remove all of the titles, we get the required value:

```js
R.pipe(L.set(textIn("sv"), undefined),
       L.set(textIn("en"), undefined))(sampleTitles)
// { titles: [] }
```

The `titles` property is not removed thanks to the [`L.define([])`](#L-define)
part of our lens composition.  It makes it so that when reading or writing
through the lens, `undefined` becomes the given value.

### Exercises

Take out one (or
more)
[`L.define(...)`](#L-define),
[`L.normalize(...)`](#L-normalize), [`L.valueOr(...)`](#L-valueOr)
or [`L.removable(...)`](#L-removable) part(s) from the lens composition and try
to predict what happens when you rerun the examples with the modified lens
composition.  Verify your reasoning by actually rerunning the examples.

### Shorthands

For clarity, the previous code snippets avoided some of the shorthands that this
library supports.  In particular,
* [`L.compose(...)`](#L-compose) can be abbreviated as an array
  [`[...]`](#L-compose),
* [`L.prop(propName)`](#L-prop) can be abbreviated as [`propName`](#L-prop), and
* [`L.set(l, undefined, s)`](#L-set) can be abbreviated
  as [`L.remove(l, s)`](#L-remove).

### Systematic decomposition

It is also typical to compose lenses out of short paths following the schema of
the JSON data being manipulated.  Recall the lens from the start of the
example:

```jsx
L.compose(L.prop("titles"),
          L.define([]),
          L.normalize(R.sortBy(L.get("language"))),
          L.find(R.whereEq({language})),
          L.valueOr({language, text: ""}),
          L.removable("text"),
          L.prop("text"))
```

Following the structure or schema of the JSON, we could break this into three
separate lenses:
* a lens for accessing the titles of a model object,
* a parameterized lens for querying a title object from titles, and
* a lens for accessing the text of a title object.

Furthermore, we could organize the lenses to reflect the structure of the JSON
model:

```js
const Title = {
  text: [L.removable("text"), "text"]
}

const Titles = {
  titleIn: language => [L.find(R.whereEq({language})),
                        L.valueOr({language, text: ""})]
}

const Model = {
  titles: ["titles",
           L.define([]),
           L.normalize(R.sortBy(L.get("language")))],
  textIn: language => [Model.titles,
                       Titles.titleIn(language),
                       Title.text]
}
```

We can now say:

```js
L.get(Model.textIn("sv"), sampleTitles)
// 'Rubrik'
```

This style of organizing lenses is overkill for our toy example.  In a more
realistic case the `sampleTitles` object would contain many more properties.
Also, rather than composing a lens, like `Model.textIn` above, to access a leaf
property from the root of our object, we might actually compose lenses
incrementally as we inspect the model structure.

### Manipulating multiple items

So far we have used a lens to manipulate individual items.  This library also
supports [traversals](#traversals) that compose with lenses and can target
multiple items.  Continuing on the tutorial example, let's define a traversal
that targets all the texts:

```js
const texts = [Model.titles,
               L.elems,
               Title.text]
```

What makes the above a traversal is the [`L.elems`](#L-elems) part.  The result
of composing a traversal with a lens is a traversal.  The other parts of the
above composition should already be familiar from previous examples.  Note how
we were able to use the previously defined `Model.titles` and `Title.text`
lenses.

Now, we can use the above traversal to [`collect`](#L-collect) all the texts:

```js
L.collect(texts, sampleTitles)
// [ 'Title', 'Rubrik' ]
```

More generally, we can [map and fold](#L-concatAs) over texts.  For example, we
could use [`L.maximumBy`](#L-maximumBy) to find a title with the maximum length:

```js
L.maximumBy(R.length, texts, sampleTitles)
// 'Rubrik'
```

Of course, we can also modify texts.  For example, we could uppercase all the
titles:

```js
L.modify(texts, R.toUpper, sampleTitles)
// { contents: [ { language: 'en', text: 'TITLE' },
//               { language: 'sv', text: 'RUBRIK' } ] }
```

We can also manipulate texts selectively.  For example, we could remove all
the texts that are longer than 5 characters:

```js
L.remove([texts, L.when(t => t.length > 5)],
         sampleTitles)
// { contents: [ { language: 'en', text: 'Title' } ] }
```

This concludes the tutorial.  The reference documentation contains lots of tiny
examples and a few [more involved examples](#L-lazy).  The [examples](#examples)
section describes a couple of lens compositions we've found practical as well as
examples that may help to
see [possibilities beyond the immediately obvious](#bst-as-a-lens).

## Reference

The [combinators](https://wiki.haskell.org/Combinator) provided by this library
are available as named imports.  Typically one just imports the library as:

```jsx
import * as L from "partial.lenses"
```

### Stable subset

This library has historically been developed in a fairly aggressive manner so
that features have been marked as obsolete and removed in subsequent major
versions.  This can be particularly burdensome for developers of libraries that
depend on partial lenses.  To help the development of such libraries, this
section specifies a tiny subset of this library as *stable*.  While it is
possible that the stable subset is later extended, nothing in the stable subset
will ever be changed in a backwards incompatible manner.

The following operations, with the below mentioned limitations, constitute the
stable subset:

* [`L.compose(...optics) ~> optic`](#L-compose) is stable with the exception
  that one must not depend on being able to compose optics with ordinary
  functions.  Also, the use of arrays to denote composition is not part of the
  stable subset.  Note that [`L.compose()`](#L-compose) is guaranteed to be
  equivalent to the [`L.identity`](#L-identity) optic.

* [`L.get(lens, maybeData) ~> maybeValue`](#L-get) is stable without limitations.

* [`L.lens(maybeData => maybeValue, (maybeValue, maybeData) => maybeData) ~> lens`](#L-lens) is
  stable with the exception that one must not depend on the user specified
  getter and setter functions being passed more than 1 and 2 arguments,
  respectively, and one must make no assumptions about any extra parameters
  being passed.

* [`L.modify(optic, maybeValue => maybeValue, maybeData) ~> maybeData`](#L-modify) is
  stable with the exception that one must not depend on the user specified
  function being passed more than 1 argument and one must make no assumptions
  about any extra parameters being passed.

* [`L.remove(optic, maybeData) ~> maybeData`](#L-remove) is stable without
  limitations.

* [`L.set(optic, maybeValue, maybeData) ~> maybeData`](#L-set) is stable without
  limitations.

The main intention behind the stable subset is to enable a dependent library to
make basic use of lenses created by client code using the dependent library.

In retrospect, the stable subset has existed since version 2.2.0.

### Optics

The abstractions, [traversals](#traversals), [lenses](#lenses),
and [isomorphisms](#isomorphisms), provided by this library are collectively
known as *optics*.  Traversals can target any number of elements.  Lenses are a
restriction of traversals that target a single element.  Isomorphisms are a
restriction of lenses with an inverse.

In addition to basic optics, this library also supports more
general [transforms](#transforms).  Transforms allow operations, such as
modifying a single focus multiple times or even in a loop, that are not possible
with basic optics.  However, transforms are considerably harder to reason about.

Some optics libraries provide many more abstractions, such as "optionals",
"prisms" and "folds", to name a few, forming a DAG.  Aside from being
conceptually important, many of those abstractions are not only useful but
required in a statically typed setting where data structures have precise
constraints on their shapes, so to speak, and operations on data structures must
respect those constraints at *all* times.  In partial lenses, however, the idea
is to manage without explicitly providing such abstractions.

In a dynamically typed language like JavaScript, the shapes of run-time objects
are naturally *malleable*.  Nothing immediately breaks if a new object is
created as a copy of another object by adding or removing a property, for
example.  We can exploit this to our advantage by considering all optics as
*partial*.  A partial optic, as manifested in this library, may be intended to
operate on data structures of a specific type, such as arrays or objects, but
also accepts the possibility that it may be given any valid JSON object or
`undefined` as input.  When the input does not match the expectation of a
partial lens, the input is treated as being `undefined`.  This allows specific
partial optics, such as the simple [`L.prop`](#L-prop) lens, to be used in a
wider range of situations than corresponding total optics.

#### On partiality

By [definition](https://en.wikipedia.org/wiki/Partial_function), a *total
function*, or just a *function*, is defined for all possible inputs.  A *partial
function*, on the other hand, may not be defined for all inputs.

As an example, consider an operation to return the first element of an array.
Such an operation cannot be total unless the input is restricted to arrays that
have at least one element.  One might think that the operation could be made
total by returning a special value in case the input array is empty, but that is
no longer the same operation&mdash;the special value is not the first element of
the array.

Now, in partial lenses, the idea is that in case the input does not match the
expectation of an optic, then the input is treated as being `undefined`, which
is the equivalent of non-existent: reading through the optic gives `undefined`
and writing through the optic replaces the focus with the written value.  This
makes the optics in this library partial.

Making all optics partial has a number of consequences.  For one thing, it can
potentially hide bugs: an incorrectly specified optic treats the input as
`undefined` and may seem to work without raising an error.  We have not found
this to be a major source of bugs in practice.  However, partiality also has a
number of benefits.  In particular, it allows optics to seamlessly support both
insertion and removal.  It also allows to reduce the number of necessary
abstractions and it tends to make compositions of optics more concise with fewer
required parts, which both help to avoid bugs.

#### On immutability

Starting with version [10.0.0](./CHANGELOG.md#1000), to strongly guide away from
mutating data structures, optics
call
[`Object.freeze`](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze) on
any new objects they create when `NODE_ENV` is not `production`.

Why only non-`production` builds?  Because `Object.freeze` can be quite
expensive and the main benefit is in catching potential bugs early during
development.

Also note that optics do not implicitly "deep freeze" data structures given to
them or freeze data returned by user defined functions.  Only objects newly
created by optic functions themselves are frozen.

#### On composability

A lot of libraries these days claim to
be [composable](https://en.wikipedia.org/wiki/Composability).  Is any collection
of functions composable?  In the opinion of the author of this library, in order
for something to be called "composable", a couple of conditions must be
fulfilled:

1. There must be an operation or operations that perform composition.
2. There must be simple laws on how compositions behave.

Conversely, if there is no operation to perform composition or there are no
useful simplifying laws on how compositions behave, then one should not call
such a thing composable.

Now, optics are composable in several ways and in each of those ways there is a
an operation to perform the composition and laws on how such composed optics
behave.  Here is a table of the means of composition supported by this library:

|                       | Operation(s)                                                        | Semantics
| --------------------- | ------------------------------------------------------------------- | -----------------------------------------------------------------------------------------
| Nesting               | [`L.compose(...os)`](#L-compose)                                    | [Monoid](https://en.wikipedia.org/wiki/Monoid) over [unityped](http://cs.stackexchange.com/questions/18847/if-dynamically-typed-languages-are-truly-statically-typed-unityped-languages-w) optics
| Recursing             | [`L.lazy(o => o)`](#L-lazy)                                         | [Fixed point](https://en.wikipedia.org/wiki/Fixed-point_combinator)
| Adapting              | [`L.orElse(lb, la)`](#L-orElse)                                     | [Semigroup](https://en.wikipedia.org/wiki/Semigroup) over [lenses](#lenses)
| [Querying](#querying) | [`L.choice(...ls)`](#L-choice) and [`L.chain(x => o, o)`](#L-chain) | [MonadPlus](https://en.wikibooks.org/wiki/Haskell/Alternative_and_MonadPlus) over [lenses](#lenses)
| Picking               | [`L.pick({...p:l})`](#L-pick)                                       | <a href="https://en.wikipedia.org/wiki/Product_(category_theory)">Product</a> of [lenses](#lenses)
| Branching             | [`L.branch({...p:t})`](#L-branch)                                   | [Coproduct](https://en.wikipedia.org/wiki/Coproduct) of [traversals](#traversals)
| Sequencing            | [`L.seq(...ts)`](#L-seq)                                            | Sequential application of [transforms](#transforms)

The above table and, in particular, the semantics column is by no means
complete.  In particular, the documentation of this library does not generally
spell out proofs of the semantics.

##### On lens laws

Aside from understanding laws on how forms of composition behave, it is useful
to understand laws that are specific to operations on lenses and optics, in
general.  As described in the
paper
[A clear picture of lens laws](http://sebfisch.github.io/research/pub/Fischer+MPC15.pdf),
many laws have been formulated for lenses and it can be useful to have lenses
that do not necessarily obey some laws.

Here is a snippet that demonstrates that partial lenses can obey the laws of, so
called, *well behaved lenses*:

```js
const elem = 2
const data = {x: 1}
const lens = "x"

const test = (actual, expected) => R.equals(actual, expected) || actual

R.identity({
  GetSet: test( L.set(lens, L.get(lens, data), data), data ),
  SetGet: test( L.get(lens, L.set(lens, elem, data)), elem )
})
// { GetSet: true, SetGet: true }
```

Note, however, that *partial* lenses are not (total) lenses.  You might want
to [▶ play](https://calmm-js.github.io/partial.lenses/#on-lens-laws) with the
laws in your browser.

#### Operations on optics

##### <a id="L-modify"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-modify) [`L.modify(optic, (maybeValue, index) => maybeValue, maybeData) ~> maybeData`](#L-modify "L.modify: POptic s a -> ((Maybe a, Index) -> Maybe a) -> Maybe s -> Maybe s")

`L.modify` allows one to map over the focused element

```js
L.modify(["elems", 0, "x"], R.inc, {elems: [{x: 1, y: 2}, {x: 3, y: 4}]})
// { elems: [ { x: 2, y: 2 }, { x: 3, y: 4 } ] }
```

or, when using a [traversal](#traversals), elements

```js
L.modify(["elems", L.elems, "x"],
         R.dec,
         {elems: [{x: 1, y: 2}, {x: 3, y: 4}]})
// { elems: [ { x: 0, y: 2 }, { x: 2, y: 4 } ] }
```

of a data structure.

##### <a id="L-remove"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-remove) [`L.remove(optic, maybeData) ~> maybeData`](#L-remove "L.remove: POptic s a -> Maybe s -> Maybe s")

`L.remove` allows one to remove the focused element

```js
L.remove([0, "x"], [{x: 1}, {x: 2}, {x: 3}])
// [ { x: 2 }, { x: 3 } ]

```

or, when using a [traversal](#traversals), elements

```js
L.remove([L.elems, "x", L.when(x => x > 1)], [{x: 1}, {x: 2, y: 1}, {x: 3}])
// [ { x: 1 }, { y: 1 } ]
```

from a data structure.

Note that `L.remove(optic, maybeData)` is equivalent
to [`L.set(lens, undefined, maybeData)`](#L-set).  With partial lenses, setting
to `undefined` typically has the effect of removing the focused element.

##### <a id="L-set"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-set) [`L.set(optic, maybeValue, maybeData) ~> maybeData`](#L-set "L.set: POptic s a -> Maybe a -> Maybe s -> Maybe s")

`L.set` allows one to replace the focused element

```js
L.set(["a", 0, "x"], 11, {id: "z"})
// {a: [{x: 11}], id: 'z'}
```

or, when using a [traversal](#traversals), elements

```js
L.set([L.elems, "x", L.when(x => x > 1)], -1, [{x: 1}, {x: 2, y: 1}, {x: 3}])
// [ { x: 1 }, { x: -1, y: 1 }, { x: -1 } ]
```

of a data structure.

Note that `L.set(lens, maybeValue, maybeData)` is equivalent
to [`L.modify(lens, R.always(maybeValue), maybeData)`](#L-modify).

##### <a id="L-traverse"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-traverse) [`L.traverse(category, (maybeValue, index) => operation, optic, maybeData) ~> operation`](#L-traverse "L.traverse: (Functor|Applicative|Monad) c -> ((Maybe a, Index) -> c b) -> POptic s t a b -> Maybe s -> c t")

`L.traverse` maps each focus to an operation and returns an operation that runs
those operations in-order and collects the results.  The `category` argument
must be either
a
[`Functor`](https://github.com/rpominov/static-land/blob/master/docs/spec.md#functor),
[`Applicative`](https://github.com/rpominov/static-land/blob/master/docs/spec.md#applicative),
or
[`Monad`](https://github.com/rpominov/static-land/blob/master/docs/spec.md#monad) depending
on the optic as specified in [`L.toFunction`](#L-toFunction).

Here is a bit involved example that uses the State monad and `L.traverse` to
replace elements in a data structure by the number of times those elements have
appeared at that point in the data structure:

```js
const Monad = ({of, chain}) => ({
  of,
  chain,
  ap: (x2yS, xS) => chain(x2y => chain(x => of(x2y(x)), xS), x2yS),
  map: (x2y, xS) => chain(x => of(x2y(x)), xS)
})

const StateM = Monad({
  of: x => s => [x, s],
  chain: (x2yS, xS) => s1 => {
    const [x, s] = xS(s1)
    return x2yS(x)(s)
  }
})

const countS = x => x2n => {
  const n = (x2n[x] || 0) + 1
  return [n, R.assoc(x, n, x2n)]
}

L.traverse(StateM, countS, L.elems, [1, 2, 1, 1, 2, 3, 4, 3, 4, 5])({})[0]
// [1, 1, 2, 3, 2, 1, 1, 2, 2, 1]
```

#### Nesting

##### <a id="L-compose"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-compose) [`L.compose(...optics) ~> optic`](#L-compose "L.compose: (POptic s s1, ...POptic sN a) -> POptic s a") or `[...optics]`

`L.compose` creates a nested composition of the given optics and ordinary
functions such that in `L.compose(bigger, smaller)` the `smaller` optic can only
see and manipulate the part of the whole as seen through the `bigger` optic.
The following equations characterize composition:

```jsx
                  L.compose() = L.identity
                 L.compose(l) = l
L.modify(L.compose(o, ...os)) = R.compose(L.modify(o), ...os.map(L.modify))
   L.get(L.compose(o, ...os)) = R.pipe(L.get(o), ...os.map(L.get))
```

Furthermore, in this library, an array of optics `[...optics]` is treated as a
composition `L.compose(...optics)`.  Using the array notation, the above
equations can be written as:

```jsx
                  [] = L.identity
                 [l] = l
L.modify([o, ...os]) = R.compose(L.modify(o), ...os.map(L.modify))
   L.get([o, ...os]) = R.pipe(L.get(o), ...os.map(L.get))
```

For example:

```js
L.set(["a", 1], "a", {a: ["b", "c"]})
// { a: [ 'b', 'a' ] }
```
```js
L.get(["a", 1], {a: ["b", "c"]})
// 'c'
```

You can also directly compose optics with ordinary functions.  The result of
such a composition is a read-only optic.

For example:

```js
L.get(["x", x => x + 1], {x: 1})
// 2
```
```js
L.set(["x", x => x + 1], 3, {x: 1})
// { x: 1 }
```

Note that eligible ordinary functions must have a maximum arity of two: the
first argument will be the data and second will be the index.  Both can, of
course, be `undefined`.  Also starting from version [11.0.0](CHANGELOG.md#1100)
it is not guaranteed that such ordinary functions would not be passed other
arguments and therefore such functions should not depend on the number of
arguments being passed nor on any arguments beyond the first two.

Note that [`R.compose`](http://ramdajs.com/docs/#compose) is not the same as
`L.compose`.

#### Querying

##### <a id="L-chain"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-chain) [`L.chain((value, index) => optic, optic) ~> optic`](#L-chain "L.chain: ((a, Index) -> POptic s b) -> POptic s a -> POptic s b")

`L.chain` provides a
monadic
[chain](https://github.com/rpominov/static-land/blob/master/docs/spec.md#chain)
combinator for querying with optics.  `L.chain(toOptic, optic)` is equivalent to

```jsx
L.compose(optic, L.choose((maybeValue, index) =>
  maybeValue === undefined
  ? L.zero
  : toOptic(maybeValue, index)))
```

Note that with the [`R.always`](http://ramdajs.com/docs/#always),
`L.chain`, [`L.choice`](#L-choice) and [`L.zero`](#L-zero) combinators, one can
consider optics as subsuming the maybe monad.

##### <a id="L-choice"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-choice) [`L.choice(...lenses) ~> optic`](#L-choice "L.choice: (...PLens s a) -> POptic s a")

`L.choice` returns a partial optic that acts like the first of the given lenses
whose view is not `undefined` on the given data structure.  When the views of
all of the given lenses are `undefined`, the returned lens acts
like [`L.zero`](#L-zero), which is the identity element of `L.choice`.

For example:

```js
L.modify([L.elems, L.choice("a", "d")], R.inc, [{R: 1}, {a: 1}, {d: 2}])
// [ { R: 1 }, { a: 2 }, { d: 3 } ]
```

##### <a id="L-choose"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-choose) [`L.choose((maybeValue, index) => optic) ~> optic`](#L-choose "L.choose: ((Maybe s, Index) -> POptic s a) -> POptic s a")

`L.choose` creates an optic whose operation is determined by the given function
that maps the underlying view, which can be `undefined`, to an optic.  In other
words, the `L.choose` combinator allows an optic to be constructed *after*
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

##### <a id="L-optional"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-optional) [`L.optional ~> optic`](#L-optional "L.optional: POptic a a")

`L.optional` is an optic over an optional element.  When used as a traversal,
and the focus is `undefined`, the traversal is empty.  When used as a lens, and
the focus is `undefined`, the lens will be read-only.

As an example, consider the difference between:

```js
L.set([L.elems, "x"], 3, [{x: 1}, {y: 2}])
// [ { x: 3 }, { y: 2, x: 3 } ]
```

and:

```js
L.set([L.elems, "x", L.optional], 3, [{x: 1}, {y: 2}])
// [ { x: 3 }, { y: 2 } ]
```

Note that `L.optional` is equivalent
to [`L.when(x => x !== undefined)`](#L-when).

##### <a id="L-when"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-when) [`L.when((maybeValue, index) => testable) ~> optic`](#L-when "L.when: ((Maybe a, Index) -> Boolean) -> POptic a a")

`L.when` allows one to selectively skip elements within a traversal or to
selectively turn a lens into a read-only lens whose view is `undefined`.

For example:

```js
L.modify([L.elems, L.when(x => x > 0)], R.negate, [0, -1, 2, -3, 4])
// [ 0, -1, -2, -3, -4 ]
```

Note that `L.when(p)` is equivalent
to [`L.choose((x, i) => p(x, i) ? L.identity : L.zero)`](#L-choose).

##### <a id="L-zero"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-zero) [`L.zero ~> optic`](#L-zero "L.zero: POptic s a")

`L.zero` is the identity element of [`L.choice`](#L-choice)
and [`L.chain`](#L-chain).  As a traversal, `L.zero` is a traversal of no
elements and as a lens, i.e. when used with [`L.get`](#L-get), `L.zero` is a
read-only lens whose view is always `undefined`.

For example:

```js
L.collect([L.elems,
           L.choose(x => R.is(Array, x)  ? L.elems
                    :    R.is(Object, x) ? "x"
                    :                      L.zero)],
          [1, {x: 2}, [3,4]])
// [ 2, 3, 4 ]
```

#### Recursing

##### <a id="L-lazy"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-lazy) [`L.lazy(optic => optic) ~> optic`](#L-lazy "L.lazy: (POptic s a -> POptic s a) -> POptic s a")

`L.lazy` can be used to construct optics lazily.  The function given to `L.lazy`
is passed a forwarding proxy to its return value and can also make forward
references to other optics and possibly construct a recursive optic.

Note that when using `L.lazy` to construct a recursive optic, it will only work
in a meaningful way when the recursive uses are either [precomposed](#L-compose)
or [presequenced](#L-seq) with some other optic in a way that neither causes
immediate nor unconditional recursion.

For example, here is a traversal that targets all the primitive elements in a
data structure of nested arrays and objects:

```js
const flatten = [L.optional, L.lazy(rec => {
  const elems = [L.elems, rec]
  const values = [L.values, rec]
  return L.choose(x => x instanceof Array  ? elems
                  :    x instanceof Object ? values
                  :                          L.identity)
})]
```

Note that the above creates a cyclic representation of the traversal.

Now, for example:

```js
L.collect(flatten, [[[1], 2], {y: 3}, [{l: 4, r: [5]}, {x: 6}]])
// [ 1, 2, 3, 4, 5, 6 ]
```
```js
L.modify(flatten, x => x+1, [[[1], 2], {y: 3}, [{l: 4, r: [5]}, {x: 6}]])
// [ [ [ 2 ], 3 ], { y: 4 }, [ { l: 5, r: [ 6 ] }, { x: 7 } ] ]
```
```js
L.remove([flatten, L.when(x => 3 <= x && x <= 4)],
         [[[1], 2], {y: 3}, [{l: 4, r: [5]}, {x: 6}]])
// [ [ [ 1 ], 2 ], [ { r: [ 5 ] }, { x: 6 } ] ]
```

#### Debugging

##### <a id="L-log"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-log) [`L.log(...labels) ~> optic`](#L-log "L.log: (...Any) -> POptic s s")

`L.log(...labels)` is an identity optic that
outputs
[`console.log`](https://developer.mozilla.org/en-US/docs/Web/API/Console/log)
messages with the given labels
(or
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

#### Internals

##### <a id="L-toFunction"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-toFunction) [`L.toFunction(optic) ~> optic`](#L-toFunction "L.toFunction: POptic s t a b -> (Maybe s, Index, (Functor|Applicative|Monad) c, (Maybe a, Index) -> c b) -> c t")

`L.toFunction` converts a given optic, which can be a [string](#L-prop),
an [integer](#L-index), an [array](#L-compose), or a function to a function.
This can be useful for implementing new combinators that cannot otherwise be
implemented using the combinators provided by this library.  See
also [`L.traverse`](#L-traverse).

For [isomorphisms](#isomorphisms) and [lenses](#lenses), the returned function
will have the signature

```jsx
(Maybe s, Index, Functor c, (Maybe a, Index) -> c b) -> c t
```

for [traversals](#traversals) the signature will be

```jsx
(Maybe s, Index, Applicative c, (Maybe a, Index) -> c b) -> c t
```

and for [transforms](#transforms) the signature will be

```jsx
(Maybe s, Index, Monad c, (Maybe a, Index) -> c b) -> c t
```

Note that the above signatures are written using the "tupled" parameter notation
`(...) -> ...` to denote that the functions are not curried.

The
[`Functor`](https://github.com/rpominov/static-land/blob/master/docs/spec.md#functor),
[`Applicative`](https://github.com/rpominov/static-land/blob/master/docs/spec.md#applicative),
and
[`Monad`](https://github.com/rpominov/static-land/blob/master/docs/spec.md#monad) arguments
are expected to conform to
their
[Static Land](https://github.com/rpominov/static-land/blob/master/docs/spec.md)
specifications.

Note that, in conjunction with partial optics, it may be advantageous to have
the algebras to allow for partiality.  With traversals it is also possible, for
example, to simply post compose optics with [`L.optional`](#L-optional) to
skip `undefined` elements.

Note that if you simply wish to perform an operation that needs roughly the full
expressive power of the underlying lens encoding, you should
use [`L.traverse`](#L-traverse), because it is independent of the underlying
encoding, while `L.toFunction` essentially exposes the underlying encoding and
it is better to avoid depending on that.

### Transforms

A transform operates over focuses that may overlap and may be visited multiple
times.  This allows operations that are impossible to implement using other
optics, but also potentially makes it much more difficult to reason about the
results.  Transforms can only be [modified](#L-modify), [set](#L-set)
and [removed](#L-remove).

#### Sequencing

##### <a id="L-seq"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-seq) [`L.seq(...optics) ~> transform`](#L-seq "L.seq: (...POptic s a) -> PTransform s a")

`L.seq` creates a transform that modifies the focus with each of the given
optics in sequence.

For example:

```js
L.modify(L.seq(L.identity, L.identity, L.identity), x => [x], 1)
// [ [ [ 1 ] ] ]
```

Here is an example of a bottom-up transform over a data structure of nested
objects and arrays:

```js
const everywhere = [L.optional, L.lazy(rec => {
  const elems = L.seq([L.elems, rec], L.identity)
  const values = L.seq([L.values, rec], L.identity)
  return L.choose(x => x instanceof Array  ? elems
                  :    x instanceof Object ? values
                  :                          L.identity)
})]
```

The above `everywhere` transform is similar to
the [`F.everywhere`](https://github.com/polytypic/fastener#F-everywhere)
transform of the [`fastener`](https://github.com/polytypic/fastener)
zipper-library.  Note that the above `everywhere` and the [`flatten`](#L-lazy)
example differ in that `flatten` only targets the non-object and non-array
elements of the data structure while `everywhere` also targets those.

```js
L.modify(everywhere, x => [x], {xs: [{x: 1}, {x: 2}]})
// [ {xs: [ [ [ { x: [ 1 ] } ], [ { x: [ 2 ] } ] ] ] } ]
```

### Traversals

A traversal operates over a collection of non-overlapping focuses that are
visited only once and can, for example,
be
[collected](#L-collect),
[folded](#L-concatAs), [modified](#L-modify), [set](#L-set)
and [removed](#L-remove).  Put in another way, a traversal specifies a set of
paths to elements in a data structure.

#### Operations on traversals

##### <a id="L-concat"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-concat) [`L.concat(monoid, traversal, maybeData) ~> value`](#L-concat "L.concat: Monoid a -> (PTraversal s a -> Maybe s -> a)")

`L.concat({empty, concat}, t, s)` performs a fold, using the given `concat` and
`empty` operations, over the elements focused on by the given traversal or lens
`t` from the given data structure `s`.  The `concat` operation and the constant
returned by `empty()` should form
a
[monoid](https://github.com/rpominov/static-land/blob/master/docs/spec.md#monoid) over
the values focused on by `t`.

For example:

```js
const Sum = {empty: () => 0, concat: (x, y) => x + y}
L.concat(Sum, L.elems, [1, 2, 3])
// 6
```

Note that `L.concat` is staged so that after given the first argument,
`L.concat(m)`, a computation step is performed.

##### <a id="L-concatAs"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-concatAs) [`L.concatAs((maybeValue, index) => value, monoid, traversal, maybeData) ~> value`](#L-concatAs "L.concatAs: ((Maybe a, Index) -> r) -> Monoid r -> (PTraversal s a -> Maybe s -> r)")

`L.concatAs(xMi2r, {empty, concat}, t, s)` performs a map, using given function
`xMi2r`, and fold, using the given `concat` and `empty` operations, over the
elements focused on by the given traversal or lens `t` from the given data
structure `s`.  The `concat` operation and the constant returned by `empty()`
should form
a
[monoid](https://github.com/rpominov/static-land/blob/master/docs/spec.md#monoid) over
the values returned by `xMi2r`.

For example:

```js
L.concatAs(x => x, Sum, L.elems, [1, 2, 3])
// 6
```

Note that `L.concatAs` is staged so that after given the first two arguments,
`L.concatAs(f, m)`, a computation step is performed.

#### Folds over traversals

##### <a id="L-all"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-all) [`L.all((maybeValue, index) => testable, traversal, maybeData) ~> boolean`](#L-all "L.all: ((Maybe a, Index) -> Boolean) -> PTraversal s a -> Boolean")

`L.all` determines whether all of the elements focused on by the given traversal
satisfy the given predicate.

For example:

```js
L.all(x => 1 <= x && x <= 6,
      flatten,
      [[[1], 2], {y: 3}, [{l: 4, r: [5]}, {x: 6}]])
// true
```

See also: [`L.any`](#L-any) and [`L.selectAs`](#L-selectAs).

##### <a id="L-and"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-and) [`L.and(traversal, maybeData) ~> boolean`](#L-and "L.or: PTraversal s Boolean -> Boolean")

`L.and` determines whether all of the elements focused on by the given traversal
are truthy.

For example:

```js
L.and(L.elems, [])
// true
```

Note that `L.and` is equivalent to [`L.all(R.identity)`](#L-all).  See
also: [`L.or`](#L-or).

##### <a id="L-any"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-any) [`L.any((maybeValue, index) => testable, traversal, maybeData) ~> boolean`](#L-any "L.any: ((Maybe a, Index) -> Boolean) -> PTraversal s a -> Boolean")

`L.any` determines whether any of the elements focused on by the given traversal
satisfy the given predicate.

For example:

```js
L.any(x => x > 5,
      flatten,
      [[[1], 2], {y: 3}, [{l: 4, r: [5]}, {x: 6}]])
// true
```

See also: [`L.all`](#L-all) and [`L.selectAs`](#L-selectAs).

##### <a id="L-collect"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-collect) [`L.collect(traversal, maybeData) ~> [...values]`](#L-collect "L.collect: PTraversal s a -> Maybe s -> [a]")

`L.collect` returns an array of the non-`undefined` elements focused on by the
given traversal or lens from a data structure.

For example:

```js
L.collect(["xs", L.elems, "x"], {xs: [{x: 1}, {x: 2}]})
// [ 1, 2 ]
```

Note that `L.collect` is equivalent
to [`L.collectAs(R.identity)`](#L-collectAs).

##### <a id="L-collectAs"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-collectAs) [`L.collectAs((maybeValue, index) => maybeValue, traversal, maybeData) ~> [...values]`](#L-collectAs "L.collectAs: ((Maybe a, Index) -> Maybe b) -> PTraversal s a -> Maybe s -> [b]")

`L.collectAs` returns an array of the elements focused on by the given traversal
or lens from a data structure and mapped by the given function to a
non-`undefined` value.

For example:

```js
L.collectAs(R.negate, ["xs", L.elems, "x"], {xs: [{x: 1}, {x: 2}]})
// [ -1, -2 ]
```

`L.collectAs(toMaybe, traversal, maybeData)` is equivalent
to
[`L.concatAs(R.pipe(toMaybe, toCollect), Collect, traversal, maybeData)`](#L-concatAs) where
`Collect` and `toCollect` are defined as follows:

```js
const Collect = {empty: R.always([]), concat: R.concat}
const toCollect = x => x !== undefined ? [x] : []
```

So:

```js
L.concatAs(R.pipe(R.negate, toCollect),
           Collect,
           ["xs", L.elems, "x"],
           {xs: [{x: 1}, {x: 2}]})
// [ -1, -2 ]
```

The internal implementation of `L.collectAs` is optimized and faster than the
above naïve implementation.

##### <a id="L-count"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-count) [`L.count(traversal, maybeData) ~> number`](#L-count "L.count: PTraversal s a -> Number")

`L.count` goes through all the elements focused on by the traversal and counts
the number of non-`undefined` elements.

For example:

```js
L.count([L.elems, "x"], [{x: 11}, {y: 12}])
// 1
```

##### <a id="L-countIf"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-countIf) [`L.countIf((maybeValue, index) => testable, traversal, maybeData) ~> number`](#L-countIf "L.countIf: ((Maybe a, Index) -> Boolean) -> PTraversal s a -> Number")

`L.countIf` goes through all the elements focused on by the traversal and counts
the number of elements for which the given predicate returns a truthy value.

For example:

```js
L.countIf(R.has("x"), [L.elems], [{x: 11}, {y: 12}])
// 1
```

##### <a id="L-foldl"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-foldl) [`L.foldl((value, maybeValue, index) => value, value, traversal, maybeData) ~> value`](#L-foldl "L.foldl: ((r, Maybe a, Index) -> r) -> r -> PTraversal s a -> Maybe s -> r")

`L.foldl` performs a fold from left over the elements focused on by the given
traversal.

For example:

```js
L.foldl((x, y) => x + y, 0, L.elems, [1,2,3])
// 6
```

##### <a id="L-foldr"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-foldr) [`L.foldr((value, maybeValue, index) => value, value, traversal, maybeData) ~> value`](#L-foldr "L.foldr: ((r, Maybe a, Index) -> r) -> r -> PTraversal s a -> Maybe s -> r")

`L.foldr` performs a fold from right over the elements focused on by the given
traversal.

For example:

```js
L.foldr((x, y) => x * y, 1, L.elems, [1,2,3])
// 6
```

##### <a id="L-isEmpty"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-isEmpty) [`L.isEmpty(traversal, maybeData) ~> boolean`](#L-isEmpty "L.isEmpty: PTraversal s a -> Maybe s -> Boolean")

`L.isEmpty` determines whether or not the given traversal focuses on any
elements, `undefined` or otherwise, on the given data structure.

```js
L.isEmpty(flatten, [[],[[[],[]],[]]])
// true
```

##### <a id="L-join"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-join) [`L.join(string, traversal, maybeData) ~> string`](#L-join "L.join: String -> PTraversal s a -> Maybe s -> String")

`L.join` creates a string by joining the optional elements targeted by the given
traversal with the given delimiter.

```js
L.join(",", [L.elems, "x"], [{x: 1}, {y: 2}, {x: 3}])
// "1,3"
```

##### <a id="L-joinAs"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-joinAs) [`L.joinAs((maybeValue, index) => maybeString, string, traversal, maybeData) ~> string`](#L-joinAs "L.joinAs: ((Maybe a, Index) -> Maybe String) -> String -> PTraversal s a -> Maybe s -> String")

`L.joinAs` creates a string by converting the elements targeted by the given
traversal to optional strings with the given function and then joining those
strings with the given delimiter.

For example:

```js
L.joinAs(JSON.stringify, ",", L.elems, [{x: 1}, {y: 2}])
// '{"x":1},{"y":2}'
```

##### <a id="L-maximum"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-maximum) [`L.maximum(traversal, maybeData) ~> maybeValue`](#L-maximum "L.maximum: Ord a => PTraversal s a -> Maybe s -> Maybe a")

`L.maximum` computes a maximum of the optional elements targeted by the
traversal.

For example:

```js
L.maximum(L.elems, [1,2,3])
// 3
```

Note that elements are ordered according to the `>` operator.

##### <a id="L-maximumBy"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-maximumBy) [`L.maximumBy((maybeValue, index) => maybeKey, traversal, maybeData) ~> maybeValue`](#L-maximumBy "L.maximumBy: Ord k => ((Maybe a, Index) -> Maybe k) -> PTraversal s a -> Maybe s -> Maybe a")

`L.maximumBy` computes a maximum of the elements targeted by the traversal based
on the optional keys returned by the given function.  Elements for which the
returned key is `undefined` are skipped.

For example:

```js
L.maximumBy(R.length, L.elems, ["first", "second", "--||--", "third"])
// "second"
```

Note that keys are ordered according to the `>` operator.

##### <a id="L-minimum"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-minimum) [`L.minimum(traversal, maybeData) ~> maybeValue`](#L-minimum "L.minimum: Ord a => PTraversal s a -> Maybe s -> Maybe a")

`L.minimum` computes a minimum of the optional elements targeted by the
traversal.

For example:

```js
L.minimum(L.elems, [1,2,3])
// 1
```

Note that elements are ordered according to the `<` operator.

##### <a id="L-minimumBy"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-minimumBy) [`L.minimumBy((maybeValue, index) => maybeKey, traversal, maybeData) ~> maybeValue`](#L-minimumBy "L.minimumBy: Ord k => ((Maybe a, Index) -> Maybe k) -> PTraversal s a -> Maybe s -> Maybe a")

`L.minimumBy` computes a minimum of the elements targeted by the traversal based
on the optional keys returned by the given function.  Elements for which the
returned key is `undefined` are skipped.

For example:

```js
L.minimumBy(L.get("x"), L.elems, [{x: 1}, {x: -3}, {x: 2}])
// {x: -3}
```

Note that keys are ordered according to the `<` operator.

##### <a id="L-or"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-or) [`L.or(traversal, maybeData) ~> boolean`](#L-or "L.or: PTraversal s Boolean -> Boolean")

`L.or` determines whether any of the elements focused on by the given traversal
is truthy.

For example:

```js
L.or(L.elems, [])
// false
```

Note that `L.or` is equivalent to [`L.any(R.identity)`](#L-any).  See
also: [`L.and`](#L-and).

##### <a id="L-product"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#-product) [`L.product(traversal, maybeData) ~> number`](#L-product "L.product: PTraversal s Number -> Maybe s -> Number")

`L.product` computes the product of the optional numbers targeted by the
traversal.

For example:

```js
L.product(L.elems, [1,2,3])
// 6
```

##### <a id="L-productAs"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#-productAs) [`L.productAs((maybeValue, index) => number, traversal, maybeData) ~> number`](#L-productAs "L.productAs: ((Maybe a, Index) -> Number) -> PTraversal s a -> Maybe s -> Number")

`L.productAs` computes the product of the numbers returned by the given function
for the elements targeted by the traversal.

For example:

```js
L.productAs((x, i) => x + i, L.elems, [3,2,1])
// 27
```

##### <a id="L-select"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-select) [`L.select(traversal, maybeData) ~> maybeValue`](#L-select "L.select: PTraversal s a -> Maybe s -> Maybe a")

`L.select` goes lazily over the elements focused on by the given traversal and
returns the first non-`undefined` element.

```js
L.select([L.elems, "y"], [{x:1},{y:2},{z:3}])
// 2
```

Note that `L.select` is equivalent to [`L.selectAs(R.identity)`](#L-selectAs).

##### <a id="L-selectAs"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-selectAs) [`L.selectAs((maybeValue, index) => maybeValue, traversal, maybeData) ~> maybeValue`](#L-selectAs "L.selectAs: ((Maybe a, Index) -> Maybe b) -> PTraversal s a -> Maybe s -> Maybe b")

`L.selectAs` goes lazily over the elements focused on by the given traversal,
applying the given function to each element, and returns the first
non-`undefined` value returned by the function.

```js
L.selectAs(x => x > 3 ? -x : undefined, L.elems, [3,1,4,1,5])
// -4
```

`L.selectAs` operates lazily.  The user specified function is only applied to
elements until the first non-`undefined` value is returned and after that
`L.selectAs` returns without examining more elements.

Note that `L.selectAs` can be used to implement many other operations over
traversals such as finding an element matching a predicate and checking whether
all/any elements match a predicate.  For example, here is how you could
implement a for all predicate over traversals:

```js
const all = R.curry((p, t, s) => !L.selectAs(x => p(x) ? undefined : true, t, s))
```

Now:

```js
all(x => x < 9,
    flatten,
    [[[1], 2], {y: 3}, [{l: 4, r: [5]}, {x: 6}]])
// true
```

##### <a id="L-sum"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-sum) [`L.sum(traversal, maybeData) ~> number`](#L-sum "L.sum: PTraversal s Number -> Maybe s -> Number")

`L.sum` computes the sum of the optional numbers targeted by the traversal.

For example:

```js
L.sum(L.elems, [1,2,3])
// 6
```

##### <a id="L-sumAs"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-sumAs) [`L.sumAs((maybeValue, index) => number, traversal, maybeData) ~> number`](#L-sumAs "L.sumAs: ((Maybe a, Index) -> Number) -> PTraversal s a -> Maybe s -> Number")

`L.sumAs` computes the sum of the numbers returned by the given function for the
elements targeted by the traversal.

For example:

```js
L.sumAs((x, i) => x + i, L.elems, [3,2,1])
// 9
```

#### Creating new traversals

##### <a id="L-branch"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-branch) [`L.branch({prop: traversal, ...props}) ~> traversal`](#L-branch "L.branch: {p1: PTraversal s a, ...pts} -> PTraversal s a")

`L.branch` creates a new traversal from a given template object that specifies
how the new traversal should visit the properties of an object.  If one thinks
of traversals as specifying sets of paths, then the template can be seen as
mapping each property to a set of paths to traverse.

For example:

```js
L.collect(L.branch({first: L.elems, second: L.identity}),
          {first: ["x"], second: "y"})
// [ 'x', 'y' ]
```

The use of [`L.identity`](#L-identity) above might be puzzling at
first.  [`L.identity`](#L-identity) essentially specifies an empty path.  So,
when a property is mapped to [`L.identity`](#L-identity) in the template given
to `L.branch`, it means that the element is to be visited by the resulting
traversal.

Note that you can also compose `L.branch` with other optics.  For example, you
can compose with [`L.pick`](#L-pick) to create a traversal over specific
elements of an array:

```js
L.modify([L.pick({x: 0, z: 2}),
          L.branch({x: L.identity, z: L.identity})],
         R.negate,
         [1, 2, 3])
// [ -1, 2, -3 ]
```

See the [BST traversal](#bst-traversal) section for a more meaningful example.

#### Traversals and combinators

##### <a id="L-elems"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-elems) [`L.elems ~> traversal`](#L-elems "L.elems: PTraversal [a] a")

`L.elems` is a traversal over the elements of an [array-like](#array-like)
object.  When written through, `L.elems` always produces an `Array`.

For example:

```js
L.modify(["xs", L.elems, "x"], R.inc, {xs: [{x: 1}, {x: 2}]})
// { xs: [ { x: 2 }, { x: 3 } ] }
```

Just like with other optics operating on [array-like](#array-like) objects, when
manipulating non-`Array` objects, [`L.rewrite`](#L-rewrite) can be used to
convert the result to the desired type, if necessary:

```js
L.modify([L.rewrite(xs => Int8Array.from(xs)), L.elems],
         R.inc,
         Int8Array.from([-1,4,0,2,4]))
// Int8Array [ 0, 5, 1, 3, 5 ]
```

##### <a id="L-values"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-values) [`L.values ~> traversal`](#L-values "L.values: PTraversal {p: a, ...ps} a")

`L.values` is a traversal over the values of an `instanceof Object`.  When
written through, `L.values` always produces an `Object`.

For example:

```js
L.modify(L.values, R.negate, {a: 1, b: 2, c: 3})
// { a: -1, b: -2, c: -3 }
```

When manipulating objects with a non-`Object` constructor

```js
function XYZ(x,y,z) {
  this.x = x
  this.y = y
  this.z = z
}

XYZ.prototype.norm = function () {
  return (this.x * this.x +
          this.y * this.y +
          this.z * this.z)
}
```

[`L.rewrite`](#L-rewrite) can be used to convert the result to the desired type,
if necessary:

```js
const objectTo = R.curry((C, o) => Object.assign(Object.create(C.prototype), o))

L.modify([L.rewrite(objectTo(XYZ)), L.values],
         R.negate,
         new XYZ(1,2,3))
// XYZ { x: -1, y: -2, z: -3 }
```

##### <a id="L-matches-g"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-matches-g) [`L.matches(/.../g) ~> traversal`](#L-matches-g "L.matches: RegExp -> PTraversal String String")

`L.matches`, when given a regular expression with
the
[`global`](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/RegExp/global) flag,
`/.../g`, is a partial traversal over the matches that the regular expression
gives over the focused string.  See also [`L.matches`](#L-matches).

**WARNING: `L.matches` is experimental and might be removed or changed before
next major release.**

For example:

```js
L.collect([L.matches(/[^&=?]+=[^&=]+/g),
           L.pick({name: L.matches(/^[^=]+/),
                   value: L.matches(/[^=]+$/)})],
           "?first=foo&second=bar")
// [ { name: 'first', value: 'foo' },
//   { name: 'second', value: 'bar' } ]
```

Note that when writing through `L.matches` and the result would be an empty
string, `""`, the result will be `undefined` to support propagating removal.

Note that an empty match terminates the traversal.  It is possible to make use
of that feature, but it is also possible that an empty match is due to an
incorrect regular expression that can match the empty string.

### Lenses

Lenses always have a single focus which can be [viewed](#L-get) directly.  Put
in another way, a lens specific a path to a single element in a data structure.

#### Operations on lenses

##### <a id="L-get"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-get) [`L.get(lens, maybeData) ~> maybeValue`](#L-get "L.get: PLens s a -> Maybe s -> Maybe a")

`L.get` returns the element focused on by a [lens](#lenses) from a data
structure.

For example:

```js
L.get("y", {x: 112, y: 101})
// 101
```

Note that `L.get` does not work on [traversals](#traversals).

#### Creating new lenses

##### <a id="L-lens"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-lens) [`L.lens((maybeData, index) => maybeValue, (maybeValue, maybeData, index) => maybeData) ~> lens`](#L-lens "L.lens: ((Maybe s, Index) -> Maybe a) -> ((Maybe a, Maybe s, Index) -> Maybe s) -> PLens s a")

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

Now, for example:

```js
L.get(timesAsDuration,
      {start: "2016-12-07T09:39:02.451Z",
       end: moment("2016-12-07T09:39:02.451Z").add(10, "hours").toISOString()})
// "PT10H"
```

```js
L.set(timesAsDuration,
      "PT10H",
      {start: "2016-12-07T09:39:02.451Z",
       end: "2016-12-07T09:39:02.451Z"})
// { end: '2016-12-07T19:39:02.451Z',
//   start: '2016-12-07T09:39:02.451Z' }
```

When composed with [`L.pick`](#L-pick), to flexibly pick the `start` and `end`
times, the above can be adapted to work in a wide variety of cases.  However,
the above lens will never be added to this library, because it would require
adding dependency to [Moment.js](http://momentjs.com/).

See the [Interfacing with Immutable.js](#interfacing) section for another
example of using `L.lens`.

##### <a id="L-setter"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-setter) [`L.setter((maybeValue, maybeData, index) => maybeData) ~> lens`](#L-setter "L.setter: ((Maybe a, Maybe s, Index) -> Maybe s) -> PLens s a")

`L.setter(set)` is shorthand for [`L.lens(x => x, set)`](#L-lens).

##### <a id="L-lensFromFT"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-lensFromFT) [`L.lensFromFT((traversal, maybeData) ~> maybeValue, traversal) ~> lens`](#L-lensFromFT "L.lensFromFT: (PTraversal s a -> Maybe s -> Maybe a) -> PTraversal s a -> PLens s a")

`L.lensFromFT` creates a lens from a fold and a traversal.  To make sense, the
fold should compute or pick a representative from the elements focused on by the
traversal such that when all the elements are equal then so is the
representative.

For example:

```js
L.get(L.lensFromFT(L.minimum, L.elems), [3,1,4])
// 1
```

```js
L.set(L.lensFromFT(L.minimum, L.elems), 2, [3,1,4])
// [ 2, 2, 2 ]
```

See the [Collection toggle](#collection-toggle) section for a more interesting
example.

#### Computing derived props

##### <a id="L-augment"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-augment) [`L.augment({prop: object => value, ...props}) ~> lens`](#L-augment "L.augment: {p1: o -> a1, ...ps} -> PLens {...o} {...o, p1: a1, ...ps}")

`L.augment` is given a template of functions to compute new properties.  When
not viewing or setting a defined object, the result is `undefined`.  When
viewing a defined object, the object is extended with the computed properties.
When set with a defined object, the extended properties are removed.

For example:

```js
L.modify(L.augment({y: r => r.x + 1}),
         r => ({x: r.x + r.y, y: 2, z: r.x - r.y}),
         {x: 1})
// { x: 3, z: -1 }
```

#### Enforcing invariants

##### <a id="L-defaults"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-defaults) [`L.defaults(valueIn) ~> lens`](#L-defaults "L.defaults: s -> PLens s s")

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
to [`L.replace(undefined, valueIn)`](#L-replace).

##### <a id="L-define"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-define) [`L.define(value) ~> lens`](#L-define "L.define: s -> PLens s s")

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

##### <a id="L-normalize"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-normalize) [`L.normalize((value, index) => maybeValue) ~> lens`](#L-normalize "L.normalize: ((s, Index) -> Maybe s) -> PLens s s")

`L.normalize` maps the value with same given transform when viewed and set and
implicitly maps `undefined` to `undefined`.

One use case for `normalize` is to make it easy to determine whether, after a
change, the data has actually changed.  By keeping the data normalized, a
simple [`R.equals`](http://ramdajs.com/docs/#equals) comparison will do.

Note that the difference between `L.normalize` and [`L.rewrite`](#L-rewrite) is
that `L.normalize` applies the transform in both directions
while [`L.rewrite`](#L-rewrite) only applies the transform when writing.

##### <a id="L-required"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-required) [`L.required(valueOut) ~> lens`](#L-required "L.required: s -> PLens s s")

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
to [`L.replace(valueOut, undefined)`](#L-replace).

##### <a id="L-rewrite"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-rewrite) [`L.rewrite((valueOut, index) => maybeValueOut) ~> lens`](#L-rewrite "L.rewrite: ((s, Index) -> Maybe s) -> PLens s s")

`L.rewrite` maps the value with the given transform when set and implicitly maps
`undefined` to `undefined`.  One use case for `rewrite` is to re-establish data
structure invariants after changes.

Note that the difference between [`L.normalize`](#L-normalize) and `L.rewrite`
is that [`L.normalize`](#L-normalize) applies the transform in both directions
while `L.rewrite` only applies the transform when writing.

See the [BST as a lens](#bst-as-a-lens) section for a meaningful example.

#### <a id="array-like"></a> Lensing array-like objects

Objects that have a non-negative integer `length` and strings, which are not
considered `Object` instances in JavaScript, are considered *array-like* objects
by partial optics.  See also [`L.seemsArrayLike`](#L-seemsArrayLike).

When writing through an optic that operates on array-like objects, the result is
always either `undefined`, in case the result would be empty, or a plain
`Array`.  For example:

```js
L.set(1, "a", "LoLa")
// [ 'L', 'a', 'L', 'a' ]
```

It may seem like the result should be of the same type as the object being
manipulated, but that is problematic, because the focus of a *partial* optic is
always optional.  Instead, when manipulating strings or array-like non-`Array`
objects, [`L.rewrite`](#L-rewrite) can be used to convert the result to the
desired type, if necessary.  For example:

```js
L.set([L.rewrite(R.join("")), 1], "a", "LoLa")
// 'LaLa'
```

Also, when manipulating array-like objects, partial lenses generally ignore
everything but the `length` property and the integer properties from `0` to
`length-1`.

##### <a id="L-append"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-append) [`L.append ~> lens`](#L-append "L.append: PLens [a] a")

`L.append` is a write-only lens that can be used to append values to
an [array-like](#array-like) object.  The view of `L.append` is always
`undefined`.

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

Note that `L.append` is equivalent to [`L.index(i)`](#L-index) with the index
`i` set to the length of the focused array or 0 in case the focus is not a
defined array.

##### <a id="L-filter"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-filter) [`L.filter((maybeValue, index) => testable) ~> lens`](#L-filter "L.filter: ((Maybe a, Index) -> Boolean) -> PLens [a] [a]")

`L.filter` operates on [array-like](#array-like) objects.  When not viewing an
array-like object, the result is `undefined`.  When viewing an array-like
object, only elements matching the given predicate will be returned.  When set,
the resulting array will be formed by concatenating the elements of the set
array-like object and the elements of the complement of the filtered focus.  If
the resulting array would be empty, the whole result will be `undefined`.

For example:

```js
L.set(L.filter(x => x <= "2"), "abcd", "3141592")
// [ 'a', 'b', 'c', 'd', '3', '4', '5', '9' ]
```

**NOTE**: If you are merely modifying a data structure, and don't need to limit
yourself to lenses, consider using the [`L.elems`](#L-elems) traversal composed
with [`L.when`](#L-when).

An alternative design for filter could implement a smarter algorithm to combine
arrays when set.  For example, an algorithm based
on [edit distance](https://en.wikipedia.org/wiki/Edit_distance) could be used to
maintain relative order of elements.  While this would not be difficult to
implement, it doesn't seem to make sense, because in most cases use
of [`L.normalize`](#L-normalize) or [`L.rewrite`](#L-rewrite) would be
preferable.  Also, the [`L.elems`](#L-elems) traversal composed
with [`L.when`](#L-when) will retain order of elements.

##### <a id="L-find"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-find) [`L.find((maybeValue, index) => testable) ~> lens`](#L-find "L.find: ((Maybe a, Index) -> Boolean) -> PLens [a] a")

`L.find` operates on [array-like](#array-like) objects
like [`L.index`](#L-index), but the index to be viewed is determined by finding
the first element from the focus that matches the given predicate.  When no
matching element is found the effect is same as with [`L.append`](#L-append).

```js
L.remove(L.find(x => x <= 2), [3,1,4,1,5,9,2])
// [ 3, 4, 1, 5, 9, 2 ]
```

##### <a id="L-findHint"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-findHint) [`L.findHint((maybeValue, {hint: index}) => testable, {hint: index}) ~> lens`](#L-findHint "L.findHint: ((Maybe a, {hint: Index}) -> Boolean, {hint: Index}) -> PLens [a] a")

`L.findHint` is much like [`L.find`](#L-find) and determines the index of
an [array-like](#array-like) object to operate on by searching with the given
predicate.  Unlike [`L.find`](#L-find), `L.findHint` is designed to operate
efficiently when used repeatedly on uniquely identifiable targets, such as
objects with unique `id`s.  To this end, `L.findHint` is given an object with a
`hint` property.  The search is started from the closest existing index to the
`hint` and then by increasing distance from that index.  The `hint` is updated
after each search and the `hint` can also be mutated from the outside.  The
`hint` object is also passed to the predicate as the second argument.  This
makes it possible to both practically eliminate the linear search and to
implement the predicate without allocating extra memory for it.

**WARNING: `L.findHint` is experimental and might be removed or changed before
next major release.**

For example:

```js
L.modify([L.findHint(R.whereEq({id: 2}), {hint: 2}), "value"],
         R.toUpper,
         [{id: 3, value: "a"},
          {id: 2, value: "b"},
          {id: 1, value: "c"},
          {id: 4, value: "d"},
          {id: 5, value: "e"}])
// [{id: 3, value: "a"},
//  {id: 2, value: "B"},
//  {id: 1, value: "c"},
//  {id: 4, value: "d"},
//  {id: 5, value: "e"}]
```

##### <a id="L-findWith"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-findWith) [`L.findWith(...lenses) ~> lens`](#L-findWith "L.findWith: (PLens s s1, ...PLens sN a) -> PLens [s] a")

`L.findWith(...lenses)` chooses an index from an [array-like](#array-like)
object through which the given lens, [`[...lenses]`](#L-compose), focuses on a
defined item and then returns a lens that focuses on that item.

For example:

```js
L.get(L.findWith("x"), [{z: 6}, {x: 9}, {y: 6}])
// 9
```
```js
L.set(L.findWith("x"), 3, [{z: 6}, {x: 9}, {y: 6}])
// [ { z: 6 }, { x: 3 }, { y: 6 } ]
```

##### <a id="L-index"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-index) [`L.index(elemIndex) ~> lens`](#L-index "L.index: Integer -> PLens [a] a") or `elemIndex`

`L.index(elemIndex)` or just `elemIndex` focuses on the element at specified
index of an [array-like](#array-like) object.

* When not viewing an index with a defined element, the result is `undefined`.
* When setting to `undefined`, the element is removed from the resulting array,
  shifting all higher indices down by one.  If the result would be an empty
  array, the whole result will be `undefined`.
* When setting a defined value to an index that is higher than the length of the
  array-like object, the missing elements will be filled with `undefined`.

For example:

```js
L.set(2, "z", ["x", "y", "c"])
// [ 'x', 'y', 'z' ]
```

**NOTE:** There is a gotcha related to removing elements from array-like
objects.  Namely, when the last element is removed, the result is `undefined`
rather than an empty array.  This is by design, because this allows the removal
to propagate upwards.  It is not uncommon, however, to have cases where removing
the last element from an array-like object must not remove the array itself.
Consider the following examples without [`L.required([])`](#L-required):

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

Then consider the same examples with [`L.required([])`](#L-required):

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

There is a related gotcha with [`L.required`](#L-required).  Consider the
following example:

```js
L.remove(L.required([]), [])
// []
```
```js
L.get(L.required([]), [])
// undefined
```

In other words, [`L.required`](#L-required) works in both directions.  Thanks to
the handling of `undefined` within partial lenses, this is often not a problem,
but sometimes you need the "default" value both ways.  In that case you can
use [`L.define`](#L-define).

##### <a id="L-last"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-last) [`L.last ~> lens`](#L-last "L.last: PLens [a] a")

`L.last` focuses on the last element of an [array-like](#array-like) object or
works like [`L.append`](#L-append) in case no such element exists.

Focusing on an empty array or `undefined` results in returning `undefined`.  For
example:

```js
L.get(L.last, [1,2,3])
// 3
```
```js
L.get(L.last, [])
// undefined
```

Setting value with `L.last` sets the last element of the object or appends the
value if the focused object is empty or `undefined`.  For example:

```js
L.set(L.last, 5, [1,2,3])
// [1,2,5]
```
```js
L.set(L.last, 1, [])
// [1]
```

##### <a id="L-slice"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-slice) [`L.slice(maybeBegin, maybeEnd) ~> lens`](#L-slice "L.slice: Maybe Integer -> Maybe Integer -> PLens [a] [a]")

`L.slice` focuses on a specified range of elements of
an [array-like](#array-like) object.  The range is determined like with the
standard
[`slice`](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/slice) method
of arrays, basically
- non-negative values are relative to the beginning of the array-like object,
- negative values are relative to the end of the array-like object, and
- `undefined` gives the defaults: 0 for the begin and length for the end.

For example:

```js
L.get(L.slice(1, -1), [1,2,3,4])
// [ 2, 3 ]
```
```js
L.set(L.slice(-2, undefined), [0], [1,2,3,4])
// [ 1, 2, 0 ]
```

#### Lensing objects

Anything that is an `instanceof Object` is considered an object by partial
lenses.

When writing through an optic that operates on objects, the result is always
either `undefined`, in case the result would be empty, or a plain `Object`.  For
example:

```js
function Custom(gold, silver, bronze) {
  this.gold   = gold
  this.silver = silver
  this.bronze = bronze
}

L.set("silver", -2, new Custom(1,2,3))
// { gold: 1, silver: -2, bronze: 3 }
```

When manipulating objects whose constructor is not
`Object`, [`L.rewrite`](#L-rewrite) can be used to convert the result to the
desired type, if necessary:

```js
L.set([L.rewrite(objectTo(Custom)), "silver"], -2, new Custom(1,2,3))
// Custom { gold: 1, silver: -2, bronze: 3 }
```

Partial lenses also generally guarantees that the creation order of keys is
preserved (even though the library used to print out evaluation results from
code snippets might not preserve the creation order).  For example:

```js
for (const k in L.set("silver", -2, new Custom(1,2,3)))
  console.log(k)
// gold
// silver
// bronze
```

When creating new objects, partial lenses generally ignore everything but own
string keys.  In particular, properties from the prototype chain are not copied
and neither are properties with symbol keys.

##### <a id="L-prop"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-prop) [`L.prop(propName) ~> lens`](#L-prop "L.prop: (p: a) -> PLens {p: a, ...ps} a") or `propName`

`L.prop(propName)` or just `propName` focuses on the specified object property.

* When not viewing a defined object property, the result is `undefined`.
* When writing to a property, the result is always an `Object`.
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

When manipulating objects whose constructor is not
`Object`, [`L.rewrite`](#L-rewrite) can be used to convert the result to the
desired type, if necessary:

```js
L.set([L.rewrite(objectTo(XYZ)), "z"], 3, new XYZ(3,1,4))
// XYZ { x: 3, y: 1, z: 3 }
```

##### <a id="L-props"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-props) [`L.props(...propNames) ~> lens`](#L-props "L.props: (p1: a1, ...ps) -> PLens {p1: a1, ...ps, ...o} {p1: a1, ...ps}")

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
kN})`](#L-pick).

##### <a id="L-removable"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-removable) [`L.removable(...propNames) ~> lens`](#L-removable "L.removable (p1: a1, ...ps) -> PLens {p1: a1, ...ps, ...o} {p1: a1, ...ps, ...o}")

`L.removable` creates a lens that, when written through, replaces the whole
result with `undefined` if none of the given properties is defined in the
written object.  `L.removable` is designed for making removal propagate through
objects.

Contrast the following examples:

```js
L.remove("x", {x: 1, y: 2})
// { y: 2 }
```

```js
L.remove([L.removable("x"), "x"], {x: 1, y: 2})
// undefined
```

Note that `L.removable(...ps)` is roughly equivalent
to
[`rewrite(y => y instanceof Object && !R.any(p => R.has(p, y), ps) ? undefined : y)`](#L-rewrite).

Also note that, in a composition, `L.removable` is likely preceded
by [`L.valueOr`](#L-valueOr) (or [`L.defaults`](#L-defaults)) like in
the [tutorial](#tutorial) example.  In such a pair, the preceding lens gives a
default value when reading through the lens, allowing one to use such a lens to
insert new objects.  The following lens then specifies that removing the then
focused property (or properties) should remove the whole object.  In cases where
the shape of the incoming object is know, [`L.defaults`](#L-defaults) can
replace such a pair.

#### Lensing strings

##### <a id="L-matches"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-matches) [`L.matches(/.../) ~> lens`](#L-matches "L.matches: RegExp -> PLens String String")

`L.matches`, when given a regular expression without
the
[`global`](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/RegExp/global) flags,
`/.../`, is a partial lens over the match.  When there is no match, or the
target is not a string, then `L.matches` will be read-only.  See
also [`L.matches`](#L-matches-g).

**WARNING: `L.matches` is experimental and might be removed or changed before
next major release.**

For example:

```js
L.set(L.matches(/\.[^./]+$/),
      ".txt",
      "/dir/file.ext")
// '/dir/file.txt'
```

Note that when writing through `L.matches` and the result would be an empty
string, `""`, the result will be `undefined` to support propagating removal.

#### Providing defaults

##### <a id="L-valueOr"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-valueOr) [`L.valueOr(valueOut) ~> lens`](#L-valueOr "L.valueOr: s -> PLens s s")

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

#### Adapting to data

##### <a id="L-orElse"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-orElse) [`L.orElse(backupLens, primaryLens) ~> lens`](#L-orElse "L.orElse: (PLens s a, PLens s a) -> PLens s a")

`L.orElse(backupLens, primaryLens)` acts like `primaryLens` when its view is not
`undefined` and otherwise like `backupLens`.  You can use `L.orElse` on its own
with [`R.reduceRight`](http://ramdajs.com/docs/#reduceRight)
(and [`R.reduce`](http://ramdajs.com/docs/#reduce)) to create an associative
choice over lenses or use `L.orElse` to specify a default or backup lens
for [`L.choice`](#L-choice), for example.

#### Transforming data

##### <a id="L-pick"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-pick) [`L.pick({prop: lens, ...props}) ~> lens`](#L-pick "L.pick: {p1: PLens s a1, ...pls} -> PLens s {p1: a1, ...pls}")

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

##### <a id="L-replace"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-replace) [`L.replace(maybeValueIn, maybeValueOut) ~> lens`](#L-replace "L.replace: Maybe s -> Maybe s -> PLens s s")

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
selective use of [`defaults`](#L-defaults), [`required`](#L-required)
and [`define`](#L-define).

### Isomorphisms

[Isomorphisms](https://en.wikipedia.org/wiki/Isomorphism) are [lenses](#lenses)
with a kind of [inverse](#L-inverse).  The focus of an isomorphism is the whole
data structure rather than a part of it.

More specifically, a lens, `iso`, is an isomorphism if the following equations
hold for all `x` and `y` in the domain and range, respectively, of the lens:

```jsx
L.set(iso, L.get(iso, x), undefined) = x
L.get(iso, L.set(iso, y, undefined)) = y
```

The above equations mean that `x => L.get(iso, x)` and `y => L.set(iso, y,
undefined)` are inverses of each other.

That is the general idea.  Strictly speaking it is not required that the two
functions are precisely inverses of each other.  It can be useful to have
"isomorphisms" that, when written through, actually change the data structure.
For that reason the name "adapter", rather than "isomorphism", is sometimes used
for the concept.

#### Operations on isomorphisms

##### <a id="L-getInverse"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-getInverse) [`L.getInverse(isomorphism, maybeData) ~> maybeData`](#L-getInverse "L.getInverse: PIso a b -> Maybe b -> Maybe a")

`L.getInverse` views through an isomorphism in the inverse direction.

For example:

```js
const expect = (p, f) => x => p(x) ? f(x) : undefined

const offBy1 = L.iso(expect(R.is(Number), R.inc),
                     expect(R.is(Number), R.dec))

L.getInverse(offBy1, 1)
// 0
```

Note that `L.getInverse(iso, data)` is equivalent
to [`L.set(iso, data, undefined)`](#L-set).

Also note that, while `L.getInverse` makes most sense when used with an
isomorphism, it is valid to use `L.getInverse` with *partial* lenses in general.
Doing so essentially constructs a minimal data structure that contains the given
value.  For example:

```js
L.getInverse("meaning", 42)
// { meaning: 42 }
```

#### Creating new isomorphisms

##### <a id="L-iso"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-iso) [`L.iso(maybeData => maybeValue, maybeValue => maybeData) ~> isomorphism`](#L-iso "L.iso: (Maybe s -> Maybe a) -> (Maybe a -> Maybe s) -> PIso s a")

`L.iso` creates a new primitive isomorphism from the given pair of functions.
Usually the given functions should be inverses of each other, but that isn't
strictly necessary.  The functions should also be partial so that when the input
doesn't match their expectation, the output is mapped to `undefined`.

For example:

```js
const reverseString = L.iso(expect(R.is(String), R.reverse),
                            expect(R.is(String), R.reverse))

L.modify([L.uriComponent,
          L.json(),
          "bottle",
          0,
          reverseString,
          L.rewrite(R.join("")),
          0],
         R.toUpper,
         "%7B%22bottle%22%3A%5B%22egassem%22%5D%7D")
// "%7B%22bottle%22%3A%22egasseM%22%7D"
```

#### Isomorphism combinators

##### <a id="L-inverse"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-inverse) [`L.inverse(isomorphism) ~> isomorphism`](#L-inverse "L.inverse: PIso a b -> PIso b a")

`L.inverse` returns the inverse of the given isomorphism.  Note that this
operation only makes sense on isomorphisms.

For example:

```js
L.get(L.inverse(offBy1), 1)
// 0
```

#### Basic isomorphisms

##### <a id="L-identity"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-identity) [`L.identity ~> isomorphism`](#L-identity "L.identity: PIso s s")

`L.identity` is the identity element of lens composition and also the identity
isomorphism.  `L.identity` can also been seen as specifying an empty path.
Indeed, in this library, when used as an optic, `L.identity` is equivalent to
[`[]`](#L-compose).  The following equations characterize `L.identity`:

```jsx
      L.get(L.identity, x) = x
L.modify(L.identity, f, x) = f(x)
  L.compose(L.identity, l) = l
  L.compose(l, L.identity) = l
```

##### <a id="L-complement"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-complement) [`L.complement ~> isomorphism`](#L-complement "L.complement: PIso Boolean Boolean")

`L.complement` is an isomorphism that performs logical negation of any
non-`undefined` value when either read or written through.

For example:

```js
L.set([L.complement, L.log()],
      "Could be anything truthy",
      "Also converted to bool")
// get false
// set "Could be anything truthy"
// false
```

##### <a id="L-is"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-is) [`L.is(value) ~> isomorphism`](#L-is "L.is: v -> PIso v Boolean")

`L.is` reads the given value as `true` and everything else as `false` and writes
`true` as the given value and everything else as `undefined`.
See [here](#an-array-of-ids-as-boolean-flags) for an example.

#### Standard isomorphisms

##### <a id="L-uri"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-uri) [`L.uri ~> isomorphism`](#L-uri "L.uri: PIso String String")

`L.uri` is an isomorphism based on the
standard
[`decodeURI`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/decodeURI) and
[`encodeURI`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURI) functions.

##### <a id="L-uriComponent"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-uriComponent) [`L.uriComponent ~> isomorphism`](#L-uriComponent "L.uriComponent: PIso String String")

`L.uriComponent` is an isomorphism based on the
standard
[`decodeURIComponent`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/decodeURIComponent) and
[`encodeURIComponent`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent) functions.

##### <a id="L-json"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-json) [`L.json({reviver, replacer, space}) ~> isomorphism`](#L-json "L.json: {reviver, replacer, space} -> PIso String JSON")

`L.json({reviver, replacer, space})` returns an isomorphism based on the
standard
[`JSON.parse`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse) and
[`JSON.stringify`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify) functions.
The optional `reviver` is passed
to
[`JSON.parse`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse) and
the optional `replacer` and `space` are passed
to
[`JSON.stringify`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify).

### Auxiliary

####  <a id="L-seemsArrayLike"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-seemsArrayLike) [`L.seemsArrayLike(anything) ~> boolean`](#L-seemsArrayLike "L.seemsArrayLike: any -> Boolean")

`L.seemsArrayLike` determines whether the given value is an `instanceof Object`
that has a non-negative integer `length` property or a string, which are not
Objects in JavaScript.  In this library, such values are
considered [array-like](#array-like) objects that can be manipulated with
various optics.

Note that this function is intentionally loose, which is also intentionally
apparent from the name of this function.  JavaScript includes many array-like
values, including
normal
[arrays](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array),
[typed arrays](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Typed_arrays),
and
[strings](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/String).
Unfortunately there seems to be no simple way to directly and precisely test for
all of those.  Testing explicitly for every standard variation would be costly
and might not cover user defined types.  Fortunately, optics are targeting
specific paths inside data-structures, rather than completely arbitrary values,
which means that even a loose test can be accurate enough.

## Examples

Note that if you are new to lenses, then you probably want to start with
the [tutorial](#tutorial).

### <a id="an-array-of-ids-as-boolean-flags"></a> [▶](https://calmm-js.github.io/partial.lenses/#an-array-of-ids-as-boolean-flags) An array of ids as boolean flags

A case that we have run into multiple times is where we have an array of
constant strings that we wish to manipulate as if it was a collection of boolean
flags:

```js
const sampleFlags = ["id-19", "id-76"]
```

Here is a parameterized lens that does just that:

```js
const flag = id => [L.normalize(R.sortBy(R.identity)),
                    L.find(R.equals(id)),
                    L.is(id)]
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

### <a id="dependent-fields"></a> [▶](https://calmm-js.github.io/partial.lenses/#dependent-fields) Dependent fields

It is not atypical to have UIs where one selection has an effect on other
selections.  For example, you could have an UI where you can specify `maximum`
and `initial` values for some measure and the idea is that the `initial` value
cannot be greater than the `maximum` value.  One way to deal with this
requirement is to implement it in the lenses that are used to access the
`maximum` and `initial` values.  This way the UI components that allows the user
to edit those values can be dumb and do not need to know about the restrictions.

One way to build such a lens is to use a combination of [`L.props`](#L-props)
(or, in more complex cases, [`L.pick`](#L-pick)) to limit the set of properties
to deal with, and [`L.rewrite`](#L-rewrite) to insert the desired restriction
logic.  Here is how it could look like for the `maximum`:

```js
const maximum =
  [L.props("maximum", "initial"),
   L.rewrite(props => {
     const {maximum, initial} = props
     if (maximum < initial)
       return {maximum, initial: maximum}
     else
       return props
   }),
   "maximum"]
```

Now:

```js
L.set(maximum,
      5,
      {maximum: 10, initial: 8, something: "else"})
// {maximum: 5, initial: 5, something: "else"}
```

### <a id="collection-toggle"></a> [▶](https://calmm-js.github.io/partial.lenses/#collection-toggle) Collection toggle

A typical element of UIs that display a list of selectable items is a checkbox
to select or unselect all items.  For example,
the [TodoMVC](http://todomvc.com/) spec
includes
[such a checkbox](https://github.com/tastejs/todomvc/blob/master/app-spec.md#mark-all-as-complete).
The state of a checkbox is a single boolean.  How do we create a lens that
transforms a collection of booleans into a single boolean?

The state of a todo list contains a boolean `completed` flag per item:

```js
const sampleTodos = [{completed: true}, {completed: false}, {completed: true}]
```

We can address those flags with a traversal:

```js
const completedFlags = [L.elems, "completed"]
```

To compute a single boolean out of a traversal over booleans we can use
the [`L.and`](#L-and) fold and use that to define a lens parameterized over flag
traversals using [`L.lensFromFT`](#L-lensFromFT):

```js
const selectAll = L.lensFromFT(L.and)
```

Now we can say, for example:

```js
L.get(selectAll(completedFlags), sampleTodos)
// false
```
```js
L.set(selectAll(completedFlags), true, sampleTodos)
// [{completed: true}, {completed: true}, {completed: true}]
```

As an exercise define `unselectAll` using the [`L.or`](#L-or) fold.  How does it
differ from `selectAll`?

### <a id="bst-as-a-lens"></a> [▶](https://calmm-js.github.io/partial.lenses/#bst-as-a-lens) BST as a lens

Binary search trees might initially seem to be outside the scope of definable
lenses.  However, given basic BST operations, one could easily wrap them as a
primitive partial lens.  But could we leverage lens combinators to build a BST
lens more compositionally?

We can.  The [`L.choose`](#L-choose) combinator allows for dynamic construction
of lenses based on examining the data structure being manipulated.
Inside [`L.choose`](#L-choose) we can write the ordinary BST logic to pick the
correct branch based on the key in the currently examined node and the key that
we are looking for.  So, here is our first attempt at a BST lens:

```js
const searchAttempt = key => L.lazy(rec => {
  const smaller = ["smaller", rec]
  const greater = ["greater", rec]
  const found = L.defaults({key})
  return L.choose(n => {
    if (!n || key === n.key)
      return found
    return key < n.key ? smaller : greater
  })
})

const valueOfAttempt = key => [searchAttempt(key), "value"]
```

Note that we also make use of the [`L.lazy`](#L-lazy) combinator to create a
recursive lens with a cyclic representation.

This actually works to a degree.  We can use the `valueOfAttempt` lens
constructor to build a binary tree.  Here is a little helper to build a tree
from pairs:

```js
const fromPairs =
  R.reduce((t, [k, v]) => L.set(valueOfAttempt(k), v, t), undefined)
```

Now:

```js
const sampleBST = fromPairs([[3, "g"], [2, "a"], [1, "m"], [4, "i"], [5, "c"]])
sampleBST
// { key: 3,
//   value: 'g',
//   smaller: { key: 2, value: 'a', smaller: { key: 1, value: 'm' } },
//   greater: { key: 4, value: 'i', greater: { key: 5, value: 'c' } } }
```

However, the above `searchAttempt` lens constructor does not maintain the BST
structure when values are being removed:

```js
L.remove(valueOfAttempt(3), sampleBST)
// { key: 3,
//   smaller: { key: 2, value: 'a', smaller: { key: 1, value: 'm' } },
//   greater: { key: 4, value: 'i', greater: { key: 5, value: 'c' } } }
```

How do we fix this?  We could check and transform the data structure to a BST
after changes.  The [`L.rewrite`](#L-rewrite) combinator can be used for that
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
const search = key => L.lazy(rec => {
  const smaller = ["smaller", rec]
  const greater = ["greater", rec]
  const found = L.defaults({key})
  return [naiveBST, L.choose(n => {
    if (!n || key === n.key)
      return found
    return key < n.key ? smaller : greater
  })]
})

const valueOf = key => [search(key), "value"]
```

Now we can also remove values from a binary tree:

```js
L.remove(valueOf(3), sampleBST)
// { key: 4,
//   value: 'i',
//   greater: { key: 5, value: 'c' },
//   smaller: { key: 2, value: 'a', smaller: { key: 1, value: 'm' } } }
```

As an exercise, you could improve the rewrite to better maintain balance.
Perhaps you might even enhance it to maintain a balance condition such
as [AVL](https://en.wikipedia.org/wiki/AVL_tree)
or [Red-Black](https://en.wikipedia.org/wiki/Red%E2%80%93black_tree).  Another
worthy exercise would be to make it so that the empty binary tree is `null`
rather than `undefined`.

#### BST traversal

What about [traversals](#traverals) over BSTs?  We can use
the [`L.branch`](#L-branch) combinator to define an in-order traversal over the
values of a BST:

```js
const values = L.lazy(rec => [
  L.optional,
  naiveBST,
  L.branch({smaller: rec,
            value: L.identity,
            greater: rec})])
```

Given a binary tree `sampleBST` we can now manipulate it as a whole.  For
example:

```js
L.join("-", values, sampleBST)
// 'm-a-g-i-c'
```
```js
L.modify(values, R.toUpper, sampleBST)
// { key: 3,
//   value: 'G',
//   smaller: { key: 2, value: 'A', smaller: { key: 1, value: 'M' } },
//   greater: { key: 4, value: 'I', greater: { key: 5, value: 'C' } } }
```
```js
L.remove([values, L.when(x => x > "e")], sampleBST)
// { key: 5, value: 'c', smaller: { key: 2, value: 'a' } }
```

### <a id="interfacing"></a> [▶](https://calmm-js.github.io/partial.lenses/#interfacing) Interfacing with Immutable.js

[Immutable.js](http://facebook.github.io/immutable-js/) is a popular library
providing immutable data structures.  As argued
in
[Lenses with Immutable.js](https://medium.com/@drboolean/lenses-with-immutable-js-9bda85674780#.kzq41xgw3) it
can be useful to be able to manipulate Immutable.js data structures
using [optics](#optics).

When interfacing external libraries with partial lenses one does need to
consider whether and how to support partiality.  Partial lenses allow one to
insert new and remove existing elements rather than just view and update
existing elements.

#### `List` indexing

Here is a primitive partial lens for
indexing [`List`](http://facebook.github.io/immutable-js/docs/#/List) written
using [`L.lens`](#L-lens):

```js
const getList = i => xs => Immutable.List.isList(xs) ? xs.get(i) : undefined

const setList = i => (x, xs) => {
  if (!Immutable.List.isList(xs))
    xs = Immutable.List()
  if (x !== undefined)
    return xs.set(i, x)
  xs = xs.delete(i)
  return xs.size ? xs : undefined
}

const idxList = i => L.lens(getList(i), setList(i))
```

Note how the above uses `isList` to check the input.  When viewing, in case the
input is not a `List`, the proper result is `undefined`.  When updating the
proper way to handle a non-`List` is to treat it as empty and also to replace a
resulting empty list with `undefined`.  Also, when updating, we treat
`undefined` as a request to `delete` rather than `set`.

We can now view existing elements:

```js
const sampleList = Immutable.List(["a", "l", "i", "s", "t"])
L.get(idxList(2), sampleList)
// 'i'
```

Update existing elements:

```js
L.modify(idxList(1), R.toUpper, sampleList)
// List [ "a", "L", "i", "s", "t" ]
```

Remove existing elements:

```js
L.remove(idxList(0), sampleList)
// List [ "l", "i", "s", "t" ]
```

And removing the last element propagates removal:

```js
L.remove(["elems", idxList(0)],
         {elems: Immutable.List(["x"]), look: "No elems!"})
// { look: 'No elems!' }
```

We can also create lists from non-lists:

```js
L.set(idxList(0), "x", undefined)
// List [ "x" ]
```

And we can also append new elements:

```js
L.set(idxList(5), "!", sampleList)
// List [ "a", "l", "i", "s", "t", "!" ]
```

Consider what happens when the index given to `idxList` points further beyond
the last element.  Both the [`L.index`](#L-index) lens and the above lens add
`undefined` values, which is not ideal with partial lenses, because of the
special treatment of `undefined`.  In practise, however, it is not typical to
`set` elements except to append just after the last element.

#### Interfacing traversals

Fortunately we do not need Immutable.js data structures to provide a compatible
*partial*
[`traverse`](https://github.com/rpominov/static-land/blob/master/docs/spec.md#traversable) function
to support [traversals](#traversals), because it is also possible to implement
traversals simply by providing suitable isomorphisms between Immutable.js data
structures and JSON.  Here is a partial [isomorphism](#isomorphisms) between
`List` and arrays:

```js
const fromList = xs => Immutable.List.isList(xs) ? xs.toArray() : undefined
const toList = xs => R.is(Array, xs) && xs.length ? Immutable.List(xs) : undefined
const isoList = L.iso(fromList, toList)
```

So, now we can [compose](#L-compose) a traversal over `List` as:

```js
const seqList = [isoList, L.elems]
```

And all the usual operations work as one would expect, for example:

```js
L.remove([seqList, L.when(c => c < "i")], sampleList)
// List [ 'l', 's', 't' ]
```

And:

```js
L.joinAs(R.toUpper,
         "",
         [seqList, L.when(c => c <= "i")],
         sampleList)
// 'AI'
```

## Background

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

With partial lenses you can robustly compose a path lens from prop
lenses [`L.compose(L.prop(p0), ...ps.map(L.prop))`](#L-compose) or just use the
shorthand notation [`[p0, ...ps]`](#L-compose).  In JavaScript, missing (and
mismatching) data can be mapped to `undefined`, which is what partial lenses
also do, because `undefined` is not a valid [JSON](http://json.org/) value.
When a part of a data structure is missing, an attempt to view it returns
`undefined`.  When a part is missing, setting it to a defined value inserts the
new part.  Setting an existing part to `undefined` removes it.

### Design choices

There are several lens and optics libraries for JavaScript.  In this section I'd
like to very briefly elaborate on a number design choices made during the course
of developing this library.

#### Partiality

Making all optics partial allows optics to not only view and update existing
elements, but also to insert, replace (as in replace with data of different
type) and remove elements and to do so in a seamless and efficient way.  In a
library based on total lenses, one needs to e.g. explicitly compose lenses with
prisms to deal with partiality.  This not only makes the optic compositions more
complex, but can also have a significant negative effect on performance.

The downside of implicit partiality is the potential to create incorrect optics
that signal errors later than when using total optics.

#### Focus on JSON

JSON is the data-interchange format of choice today.  By being able to
effectively and efficiently manipulate JSON data structures directly, one can
avoid using special internal representations of data and make things simpler
(e.g. no need to convert from JSON to efficient [immutable](#on-immutability)
collections and back).

#### Use of `undefined`

`undefined` is a natural choice in JavaScript, especially when dealing with
JSON, to represent nothingness.  Some libraries use `null`, but that is arguably
a poor choice, because `null` is a valid JSON value.  Some libraries implement
special `Maybe` types, but the benefits do not seem worth the trouble.  First of
all, `undefined` already exists in JavaScript and is not a valid JSON value.
Inventing a new value to represent nothingness doesn't seem to add much.  OTOH,
wrapping values with `Just` objects introduces a significant performance
overhead due to extra allocations.  Operations with optics do not otherwise
necessarily require large numbers of allocations and can be made highly
efficient.

Not having an explicit `Just` object means that dealing with values such as
`Just Nothing` requires special consideration.

#### Allowing [strings](#L-prop) and [integers](#L-index) as optics

Aside from the brevity, allowing strings and non-negative integers to be
directly used as optics allows one to avoid allocating closures for such optics.
This can provide significant time and, more importantly, space savings in
applications that create large numbers of lenses to address elements in data
structures.

The downside of allowing such special values as optics is that the internal
implementation needs to be careful to deal with them at any point a user given
value needs to be interpreted as an optic.

#### Treating an [array of optics as a composition](#L-compose) of optics

Aside from the brevity, treating an array of optics as a composition allows the
library to be optimized to deal with simple paths highly efficiently and
eliminate the need for separate primitives
like [`assocPath`](http://ramdajs.com/docs/#assocPath)
and [`dissocPath`](http://ramdajs.com/docs/#dissocPath) for performance reasons.
Client code can also manipulate such simple paths as data.

#### Applicatives

One interesting consequence of partiality is that it becomes possible
to [invert isomorphisms](#isomorphisms) without explicitly making it possible to
extract the forward and backward functions from an isomorphism.  A simple
internal implementation based on functors and applicatives seems to be expressive
enough for a wide variety of operations.

#### [`L.branch`](#L-branch)

By providing combinators for creating new traversals, lenses and isomorphisms,
client code need not depend on the internal implementation of optics.  The
current version of this library exposes the internal implementation
via [`L.toFunction`](#L-toFunction), but it would not be unreasonable to not
provide such an operation.  Only very few applications need to know the internal
representation of optics.

#### Indexing

Indexing in partial lenses is unnested, very simple and based on the indices and
keys of the underlying data structures.  When indexing was added, it essentially
introduced no performance degradation, but since then a few operations have been
added that do require extra allocations to support indexing.  It is also
possible to compose optics so as to create nested indices or paths, but
currently no combinator is directly provided for that.

#### Static Land

The algebraic structures used in partial lenses follow
the [Static Land](https://github.com/rpominov/static-land) specification rather
than the [Fantasy Land](https://github.com/fantasyland/fantasy-land)
specification.  Static Land does not require wrapping values in objects, which
translates to a significant performance advantage throughout the library,
because fewer allocations are required.

#### Performance

Concern for performance has been a part of the work on partial lenses for some
time.  The basic principles can be summarized in order of importance:

* Minimize overheads
* Micro-optimize for common cases
* Avoid stack overflows
* Avoid [quadratic algorithms](http://accidentallyquadratic.tumblr.com/)
* Avoid optimizations that require large amounts of code
* Run [benchmarks](#benchmarks) continuously to detect performance regressions

### On bundle size and minification

The distribution of this library includes
a
[prebuilt and minified browser bundle](https://unpkg.com/partial.lenses/dist/partial.lenses.min.js).
However, this library is not designed to be primarily used via that bundle.
Rather, this library is bundled with [Rollup](https://rollupjs.org/), uses
`/*#__PURE__*/` annotations to
help [UglifyJS2](https://github.com/mishoo/UglifyJS2) do better dead code
elimination, and uses `process.env.NODE_ENV` to detect `"production"` mode to
discard some warnings and error checks.  This means that when using Rollup
with [replace](https://github.com/rollup/rollup-plugin-replace)
and [uglify](https://github.com/TrySound/rollup-plugin-uglify) plugins to build
browser bundles, the generated bundles will basically only include what you use
from this library.

### Benchmarks

Here are a few benchmark results on partial lenses (as `L` version 11.0.0) and
some roughly equivalent operations using [Ramda](http://ramdajs.com/) (as `R`
version 0.23.0), [Ramda Lens](https://github.com/ramda/ramda-lens) (as `P`
version 0.1.1), [Flunc Optics](https://github.com/flunc/optics) (as `O` version
0.0.2), [Optika](https://github.com/phadej/optika) (as `K` version 0.0.2),
and [lodash.get](https://www.npmjs.com/package/lodash.get) (as `_get` version
4.4.2).  As always with benchmarks, you should take these numbers with a pinch
of salt and preferably try and measure your actual use cases!

```jsx
  21,876,668/s     1.00x   L.get(L_findHint_id_5000, ids)

   6,806,712/s     1.00x   R.reduceRight(add, 0, xs100)
     441,789/s    15.41x   L.foldr(add, 0, L.elems, xs100)
       4,087/s  1665.27x   O.Fold.foldrOf(O.Traversal.traversed, addC, 0, xs100)

      11,325/s     1.00x   R.reduceRight(add, 0, xs100000)
          56/s   202.75x   L.foldr(add, 0, L.elems, xs100000)
           0/s Infinityx   O.Fold.foldrOf(O.Traversal.traversed, addC, 0, xs100000) -- STACK OVERFLOW

     638,209/s     1.00x   L.foldl(add, 0, L.elems, xs100)
     204,008/s     3.13x   R.reduce(add, 0, xs100)
       2,848/s   224.07x   O.Fold.foldlOf(O.Traversal.traversed, addC, 0, xs100)

   3,607,559/s     1.00x   L.sum(L.elems, xs100)
   2,555,771/s     1.41x   K.traversed().sumOf(xs100)
     512,652/s     7.04x   L.concat(Sum, L.elems, xs100)
     188,141/s    19.17x   xs100.reduce((a, b) => a + b, 0)
     121,464/s    29.70x   R.sum(xs100)
      22,213/s   162.41x   P.sumOf(P.traversed, xs100)
       4,273/s   844.20x   O.Fold.sumOf(O.Traversal.traversed, xs100)

     581,077/s     1.00x   L.maximum(L.elems, xs100)
       3,293/s   176.44x   O.Fold.maximumOf(O.Traversal.traversed, xs100)

     139,539/s     1.00x   L.sum([L.elems, L.elems, L.elems], xsss100)
     127,123/s     1.10x   L.concat(Sum, [L.elems, L.elems, L.elems], xsss100)
       4,639/s    30.08x   P.sumOf(R.compose(P.traversed, P.traversed, P.traversed), xsss100)
         864/s   161.51x   O.Fold.sumOf(R.compose(O.Traversal.traversed, O.Traversal.traversed, O.Traversal.traversed), xsss100)

   2,902,399/s     1.00x   K.traversed().arrayOf(xs100)
     236,411/s    12.28x   L.collect(L.elems, xs100)
      27,173/s   106.81x   xs100.map(I.id)
       3,373/s   860.46x   O.Fold.toListOf(O.Traversal.traversed, xs100)

     108,862/s     1.00x   L.collect([L.elems, L.elems, L.elems], xsss100)
      25,379/s     4.29x   (() => { let acc = []; xsss100.forEach(x0 => { x0.forEach(x1 => { acc = acc.concat(x1); })}); return acc; })()
      24,507/s     4.44x   K.traversed().traversed().traversed().arrayOf(xsss100)
       9,238/s    11.78x   R.chain(R.chain(R.identity), xsss100)
         761/s   143.12x   O.Fold.toListOf(R.compose(O.Traversal.traversed, O.Traversal.traversed, O.Traversal.traversed), xsss100)

      63,662/s     1.00x   R.flatten(xsss100)
      32,143/s     1.98x   L.collect(flatten, xsss100)

  16,104,882/s     1.00x   L.modify(L.elems, inc, xs)
   1,789,118/s     9.00x   R.map(inc, xs)
     831,170/s    19.38x   xs.map(inc)
     440,085/s    36.59x   K.traversed().over(xs, inc)
     423,306/s    38.05x   P.over(P.traversed, inc, xs)
     386,846/s    41.63x   O.Setter.over(O.Traversal.traversed, inc, xs)

     423,120/s     1.00x   L.modify(L.elems, inc, xs1000)
     113,767/s     3.72x   R.map(inc, xs1000)
       2,800/s   151.09x   xs1000.map(inc)
       2,771/s   152.70x   K.traversed().over(xs1000, inc)
         399/s  1061.36x   O.Setter.over(O.Traversal.traversed, inc, xs1000) -- QUADRATIC
         363/s  1165.22x   P.over(P.traversed, inc, xs1000) -- QUADRATIC

     154,859/s     1.00x   L.modify([L.elems, L.elems, L.elems], inc, xsss100)
       9,447/s    16.39x   R.map(R.map(R.map(inc)), xsss100)
       7,962/s    19.45x   xsss100.map(x0 => x0.map(x1 => x1.map(inc)))
       7,185/s    21.55x   K.traversed().traversed().traversed().over(xsss100, inc)
       3,393/s    45.64x   P.over(R.compose(P.traversed, P.traversed, P.traversed), inc, xsss100)
       2,997/s    51.67x   O.Setter.over(R.compose(O.Traversal.traversed, O.Traversal.traversed, O.Traversal.traversed), inc, xsss100)

  34,658,528/s     1.00x   L.get(1, xs)
  25,734,470/s     1.35x   _get(xs, 1)
   3,909,877/s     8.86x   R.nth(1, xs)
   1,556,964/s    22.26x   R.view(l_1, xs)
     729,210/s    47.53x   K.idx(1).get(xs)

  55,781,765/s     1.00x   L_get_1(xs)
  20,235,190/s     2.76x   L.get(1)(xs)
   3,867,009/s    14.43x   R_nth_1(xs)
   2,720,772/s    20.50x   R.nth(1)(xs)

  24,191,671/s     1.00x   L.set(1, 0, xs)
   6,525,391/s     3.71x   R.update(1, 0, xs)
   5,733,186/s     4.22x   (() => { let ys = xs.slice(); ys[1] = 0; return ys; })()
     991,546/s    24.40x   R.set(l_1, 0, xs)
     803,114/s    30.12x   xs.map((x, i) => i === 1 ? 0 : x)
     521,747/s    46.37x   K.idx(1).set(xs, 0)

  39,538,327/s     1.00x   L.get("y", xyz)
  26,766,879/s     1.48x   R.prop("y", xyz)
   9,940,328/s     3.98x   _get(xyz, "y")
   2,483,920/s    15.92x   R.view(l_y, xyz)
     710,149/s    55.68x   K.key("y").get(xyz)

  72,553,744/s     1.00x   L_get_y(xyz)
  24,576,964/s     2.95x   R_prop_y(xyz)
  19,305,729/s     3.76x   L.get("y")(xyz)
   9,284,401/s     7.81x   R.prop("y")(xyz)

  11,651,565/s     1.00x   R.assoc("y", 0, xyz)
  11,271,877/s     1.03x   L.set("y", 0, xyz)
   1,380,307/s     8.44x   R.set(l_y, 0, xyz)
     522,711/s    22.29x   K.key("y").set(xyz, 0)

  13,922,815/s     1.00x   L.get([0,"x",0,"y"], axay)
  12,564,236/s     1.11x   R.path([0,"x",0,"y"], axay)
  12,366,963/s     1.13x   _get(axay, [0,"x",0,"y"])
   2,255,816/s     6.17x   R.view(l_0x0y, axay)
     490,729/s    28.37x   R.view(l_0_x_0_y, axay)
     199,855/s    69.66x   K.idx(0).key("x").idx(0).key("y").get(axay)

   3,750,654/s     1.00x   L.set([0,"x",0,"y"], 0, axay)
     910,234/s     4.12x   R.assocPath([0,"x",0,"y"], 0, axay)
     538,218/s     6.97x   R.set(l_0x0y, 0, axay)
     317,651/s    11.81x   R.set(l_0_x_0_y, 0, axay)
     163,006/s    23.01x   K.idx(0).key("x").idx(0).key("y").set(axay, 0)

   3,816,669/s     1.00x   L.modify([0,"x",0,"y"], inc, axay)
     605,709/s     6.30x   R.over(l_0x0y, inc, axay)
     327,803/s    11.64x   R.over(l_0_x_0_y, inc, axay)
     172,131/s    22.17x   K.idx(0).key("x").idx(0).key("y").over(axay, inc)

  24,843,732/s     1.00x   L.remove(1, xs)
   3,284,092/s     7.56x   R.remove(1, 1, xs)

  11,028,902/s     1.00x   L.remove("y", xyz)
   2,679,442/s     4.12x   R.dissoc("y", xyz)

  17,008,748/s     1.00x   L.get(["x","y","z"], xyzn)
  15,568,185/s     1.09x   _get(xyzn, ["x", "y", "z"])
  13,792,152/s     1.23x   R.path(["x","y","z"], xyzn)
   2,313,793/s     7.35x   R.view(l_xyz, xyzn)
     817,547/s    20.80x   R.view(l_x_y_z, xyzn)
     261,525/s    65.04x   K.key("x").key("y").key("z").get(xyzn)
     161,341/s   105.42x   O.Getter.view(o_x_y_z, xyzn)

   4,768,076/s     1.00x   L.set(["x","y","z"], 0, xyzn)
   1,869,460/s     2.55x   R.assocPath(["x","y","z"], 0, xyzn)
     788,072/s     6.05x   R.set(l_xyz, 0, xyzn)
     550,472/s     8.66x   R.set(l_x_y_z, 0, xyzn)
     223,656/s    21.32x   K.key("x").key("y").key("z").set(xyzn, 0)
     209,597/s    22.75x   O.Setter.set(o_x_y_z, 0, xyzn)

   1,057,165/s     1.00x   R.find(x => x > 3, xs100)
     195,970/s     5.39x   L.selectAs(x => x > 3 ? x : undefined, L.elems, xs100)
       2,725/s   387.98x   O.Fold.findOf(O.Traversal.traversed, x => x > 3, xs100)

   3,903,438/s     1.00x   L.selectAs(x => x < 3 ? x : undefined, L.elems, xs100)
   3,550,691/s     1.10x   R.find(x => x < 3, xs100)
       2,812/s  1387.93x   O.Fold.findOf(O.Traversal.traversed, x => x < 3, xs100) -- NO SHORTCUT EVALUATION

   3,875,074/s     1.00x   L.remove(50, xs100)
   1,822,956/s     2.13x   R.remove(50, 1, xs100)

   4,314,809/s     1.00x   L.set(50, 2, xs100)
   1,490,082/s     2.90x   R.update(50, 2, xs100)
     663,729/s     6.50x   R.set(l_50, 2, xs100)
     490,132/s     8.80x   K.idx(50).set(xs100, 2)
```

Various operations on *partial lenses have been optimized for common cases*, but
there is definitely a lot of room for improvement.  The goal is to make partial
lenses fast enough that performance isn't the reason why you might not want to
use them.

See [bench.js](./bench/bench.js) for details.

### Lenses all the way

As said in the first sentence of this document, lenses are convenient for
performing updates on individual elements of [immutable](#on-immutability) data
structures.  Having abilities such
as [nesting](#L-compose), [adapting](#L-choose), [recursing](#L-lazy)
and [restructuring](#L-pick) using lenses makes the notion of an individual
element quite flexible and, even further, [traversals](#traversals) make it
possible to [selectively](#L-when) target zero or more elements
of [non-trivial](#L-branch) data structures in a single operation.  It can be
tempting to try to do everything with lenses, but that will likely only lead to
misery.  It is important to understand that lenses are just one of many
functional abstractions for working with data structures and sometimes other
approaches can lead to simpler or easier
solutions.  [Zippers](https://github.com/polytypic/fastener), for example, are,
in some ways, less principled and can implement queries and transforms that are
outside the scope of lenses and traversals.

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
const descend = (w2w, w) => R.is(Object, w) ? R.map(w2w, w) : w
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
transform(R.ifElse(R.allPass([R.is(Object), R.complement(R.is(Array))]),
                   L.remove(L.props("extra", "fields")),
                   R.identity),
          sampleBloated)
// { just: 'some',
//   that: [ 'we', { want: 'to',
//                   filter: ['out'],
//                   including: {the: 'following'} } ] }
```

### Related work

Lenses are an old concept and there are dozens of academic papers on lenses and
dozens of lens libraries for various languages.  Below are just a few
links&mdash;feel free to suggest more!

#### Papers and other introductory material

* [A clear picture of lens laws](http://sebfisch.github.io/research/pub/Fischer+MPC15.pdf)
* [An Introduction Into Lenses In JavaScript](https://medium.com/javascript-inside/an-introduction-into-lenses-in-javascript-e494948d1ea5#.777juzfcw)
* [Functional Lenses, How Do They Work](https://medium.com/@dtipson/functional-lenses-d1aba9e52254#.qja55h7uh)
* [Lenses with Immutable.js](https://medium.com/@drboolean/lenses-with-immutable-js-9bda85674780#.4irzg5u1q)
* [Polymorphic Update with van Laarhoven Lenses](http://r6.ca/blog/20120623T104901Z.html)
* [Profunctor Optics: Modular Data Accessors](https://arxiv.org/abs/1703.10857)

#### JavaScript / TypeScript / Flow libraries

* [5outh/nanoscope](https://github.com/5outh/nanoscope)
* [DrBoolean/lenses](https://github.com/DrBoolean/lenses)
* [fantasyland/fantasy-lenses](https://github.com/fantasyland/fantasy-lenses)
* [flunc/optics](https://github.com/flunc/optics)
* [gcanti/monocle-ts](https://github.com/gcanti/monocle-ts)
* [hallettj/safety-lens](https://github.com/hallettj/safety-lens)
* [phadej/optika](https://github.com/phadej/optika)
* [ramda/ramda-lens](https://github.com/ramda/ramda-lens)
* [thisismN/lentil](https://github.com/thisismN/lentil)

#### Libraries for other languages

* [ekmett/lens](https://github.com/ekmett/lens)
* [julien-truffaut/Monocle](https://github.com/julien-truffaut/Monocle)
* [purescript-contrib/purescript-profunctor-lenses](https://github.com/purescript-contrib/purescript-profunctor-lenses)
* [xyncro/aether](https://github.com/xyncro/aether)

## Contributing

Contributions in the form of pull requests are welcome!

Before starting work on a major PR, it is a good idea to open an issue or maybe
ask on [gitter](https://gitter.im/calmm-js/chat) whether the contribution sounds
like something that should be added to this library.

If you allow us to make changes to your PR, it can make the process
smoother:
[Allowing changes to a pull request branch created from a fork](https://help.github.com/articles/allowing-changes-to-a-pull-request-branch-created-from-a-fork/).
We also welcome starting the PR sooner, before it is ready to be merged, rather
than later so we know what is going on and can help.

Aside from the code changes, a PR should also include tests, and documentation.

When implementing partial optics it is important to consider the behavior of the
optics when the focus doesn't match the expectation of the optic and also
whether the optic should propagate removal.  Such behavior should also be
tested.

It is best not to commit changes to generated files in PRs.  Some of the files
in `docs`, `lib` and `dist` directories are generated.

### Building

The `prepare` script is the usual way to build after changes:

```bash
npm run prepare
```

It builds the `dist` files and runs the lint rules and tests.  You can also run
the scripts for those subtasks separately.

### Testing

The [tests](./test/tests.js) in this library are written in an atypical manner.

First of all, the tests are written as strings that are `eval`ed.  This way one
doesn't need to invent names or write prose for tests.

There is also a special test that checks the arity of the exports.  You'll
notice it immediately if you add an export.

The [`test/types.js`](./test/types.js) file contains contract or type predicates
for the library primitives.  Those are also used when running tests to check
that the implementation matches the contracts.

When you implement a new combinator, you will need to also add a type contract
and a shadow implementation for the primitive.

### Documentation

The `docs` folder contains the generated documentation.  You can can open the
file locally:

```bash
open docs/index.html
```

After adding something to the library, you need to run

```bash
npm run docs-bundle
```

to update the bundle used by the docs.

To actually build the docs (translate the markdown to html), you can run

```bash
npm run docs
```

or you can use the watch

```bash
npm run docs-watch
```

which builds the docs if you save `README.md` (you will need to manually refresh
browser).
