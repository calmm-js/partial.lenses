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
* [The why of optics](#the-why-of-optics)
* [Reference](#reference)
  * [Stable subset](#stable-subset)
  * [Optics](#optics)
    * [On partiality](#on-partiality)
    * [On immutability](#on-immutability)
    * [On composability](#on-composability)
    * [On lens laws](#on-lens-laws)
    * [Operations on optics](#operations-on-optics)
      * [`L.assign(optic, object, maybeData) ~> maybeData`](#L-assign "L.assign: PLens s {p1: a1, ...ps, ...o} -> {p1: a1, ...ps} -> Maybe s -> Maybe s") <small><sup>v11.13.0</sup></small>
      * [`L.modify(optic, (maybeValue, index) => maybeValue, maybeData) ~> maybeData`](#L-modify "L.modify: POptic s a -> ((Maybe a, Index) -> Maybe a) -> Maybe s -> Maybe s") <small><sup>v2.2.0</sup></small>
      * [`L.remove(optic, maybeData) ~> maybeData`](#L-remove "L.remove: POptic s a -> Maybe s -> Maybe s") <small><sup>v2.0.0</sup></small>
      * [`L.set(optic, maybeValue, maybeData) ~> maybeData`](#L-set "L.set: POptic s a -> Maybe a -> Maybe s -> Maybe s") <small><sup>v1.0.0</sup></small>
      * [`L.traverse(category, (maybeValue, index) => operation, optic, maybeData) ~> operation`](#L-traverse "L.traverse: (Functor|Applicative|Monad) c -> ((Maybe a, Index) -> c b) -> POptic s t a b -> Maybe s -> c t") <small><sup>v10.0.0</sup></small>
    * [Nesting](#nesting)
      * [`L.compose(...optics) ~> optic`](#L-compose "L.compose: (POptic s s1, ...POptic sN a) -> POptic s a") or `[...optics]` <small><sup>v1.0.0</sup></small>
    * [Recursing](#recursing)
      * [`L.lazy(optic => optic) ~> optic`](#L-lazy "L.lazy: (POptic s a -> POptic s a) -> POptic s a") <small><sup>v5.1.0</sup></small>
    * [Adapting](#adapting)
      * [`L.choose((maybeValue, index) => optic) ~> optic`](#L-choose "L.choose: ((Maybe s, Index) -> POptic s a) -> POptic s a") <small><sup>v1.0.0</sup></small>
      * [`L.choices(optic, ...optics) ~> optic`](#L-choices "L.choices: (POptic s a, ...POptic s a) -> POptic s a") <small><sup>v11.10.0</sup></small>
      * [`L.iftes((maybeValue, index) => testable, consequentOptic, ...[, alternativeOptic]) ~> optic`](#L-iftes "L.iftes: ((Maybe s, Index) -> Boolean) -> PLens s a -> PLens s a -> PLens s a") <small><sup>v11.14.0</sup></small>
      * [`L.orElse(backupOptic, primaryOptic) ~> optic`](#L-orElse "L.orElse: (POptic s a, POptic s a) -> POptic s a") <small><sup>v2.1.0</sup></small>
    * [Querying](#querying)
      * [`L.chain((value, index) => optic, optic) ~> optic`](#L-chain "L.chain: ((a, Index) -> POptic s b) -> POptic s a -> POptic s b") <small><sup>v3.1.0</sup></small>
      * [`L.choice(...optics) ~> optic`](#L-choice "L.choice: (...POptic s a) -> POptic s a") <small><sup>v2.1.0</sup></small>
      * [`L.optional ~> optic`](#L-optional "L.optional: POptic a a") <small><sup>v3.7.0</sup></small>
      * [`L.when((maybeValue, index) => testable) ~> optic`](#L-when "L.when: ((Maybe a, Index) -> Boolean) -> POptic a a") <small><sup>v5.2.0</sup></small>
      * [`L.zero ~> optic`](#L-zero "L.zero: POptic s a") <small><sup>v6.0.0</sup></small>
    * [Caching](#caching)
      * [`L.cache(optic[, map]) ~> optic`](#L-cache "L.cache: (POptic s a[, Map]) -> POptic s a") <small><sup>v11.15.0</sup></small>
    * [Debugging](#debugging)
      * [`L.log(...labels) ~> optic`](#L-log "L.log: (...Any) -> POptic s s") <small><sup>v3.2.0</sup></small>
    * [Internals](#internals)
      * [`L.toFunction(optic) ~> optic`](#L-toFunction "L.toFunction: POptic s t a b -> (Maybe s, Index, (Functor|Applicative|Monad) c, (Maybe a, Index) -> c b) -> c t") <small><sup>v7.0.0</sup></small>
  * [Transforms](#transforms)
    * [Operations on transforms](#operations-on-transforms)
      * [`L.transform(optic, maybeData) ~> maybeData`](#L-transform "L.transform: POptic s a -> Maybe s -> Maybe s") <small><sup>v11.7.0</sup></small>
    * [Sequencing](#sequencing)
      * [`L.seq(...transforms) ~> transform`](#L-seq "L.seq: (...PTransform s a) -> PTransform s a") <small><sup>v9.4.0</sup></small>
    * [Transforming](#transforming)
      * [`L.assignOp(object) ~> optic`](#L-assignOp "L.assignOp: {p1: a1, ...ps} -> POptic {p1: a1, ...ps, ...o} {p1: a1, ...ps}") <small><sup>v11.13.0</sup></small>
      * [`L.modifyOp((maybeValue, index) => maybeValue) ~> optic`](#L-modifyOp "L.modifyOp: ((Maybe a, Index) -> Maybe a) -> POptic a a") <small><sup>v11.7.0</sup></small>
      * [`L.removeOp ~> optic`](#L-removeOp "L.removeOp: POptic a a") <small><sup>v11.7.0</sup></small>
      * [`L.setOp(maybeValue) ~> optic`](#L-setOp "L.setOp: Maybe a -> POptic a a") <small><sup>v11.7.0</sup></small>
  * [Traversals](#traversals)
    * [Creating new traversals](#creating-new-traversals)
      * [`L.branch({prop: traversal, ...props}) ~> traversal`](#L-branch "L.branch: {p1: PTraversal s a, ...pts} -> PTraversal s a") <small><sup>v5.1.0</sup></small>
    * [Traversals and combinators](#traversals-and-combinators)
      * [`L.elems ~> traversal`](#L-elems "L.elems: PTraversal [a] a") <small><sup>v7.3.0</sup></small>
      * [`L.flatten ~> traversal`](#L-flatten "L.flatten: PTraversal [...[a]...] a") <small><sup>v11.16.0</sup></small>
      * [`L.values ~> traversal`](#L-values "L.values: PTraversal {p: a, ...ps} a") <small><sup>v7.3.0</sup></small>
      * [`L.matches(/.../g) ~> traversal`](#L-matches-g "L.matches: RegExp -> PTraversal String String") <small><sup>v10.4.0</sup></small>
    * [Folds over traversals](#folds-over-traversals)
      * [`L.all((maybeValue, index) => testable, traversal, maybeData) ~> boolean`](#L-all "L.all: ((Maybe a, Index) -> Boolean) -> PTraversal s a -> Boolean") <small><sup>v9.6.0</sup></small>
      * [`L.and(traversal, maybeData) ~> boolean`](#L-and "L.and: PTraversal s Boolean -> Boolean") <small><sup>v9.6.0</sup></small>
      * [`L.any((maybeValue, index) => testable, traversal, maybeData) ~> boolean`](#L-any "L.any: ((Maybe a, Index) -> Boolean) -> PTraversal s a -> Boolean") <small><sup>v9.6.0</sup></small>
      * [`L.collect(traversal, maybeData) ~> [...values]`](#L-collect "L.collect: PTraversal s a -> Maybe s -> [a]") <small><sup>v3.6.0</sup></small>
      * [`L.collectAs((maybeValue, index) => maybeValue, traversal, maybeData) ~> [...values]`](#L-collectAs "L.collectAs: ((Maybe a, Index) -> Maybe b) -> PTraversal s a -> Maybe s -> [b]") <small><sup>v7.2.0</sup></small>
      * [`L.concat(monoid, traversal, maybeData) ~> value`](#L-concat "L.concat: Monoid a -> (PTraversal s a -> Maybe s -> a)") <small><sup>v7.2.0</sup></small>
      * [`L.concatAs((maybeValue, index) => value, monoid, traversal, maybeData) ~> value`](#L-concatAs "L.concatAs: ((Maybe a, Index) -> r) -> Monoid r -> (PTraversal s a -> Maybe s -> r)") <small><sup>v7.2.0</sup></small>
      * [`L.count(traversal, maybeData) ~> number`](#L-count "L.count: PTraversal s a -> Number") <small><sup>v9.7.0</sup></small>
      * [`L.countIf((maybeValue, index) => testable, traversal, maybeData) ~> number`](#L-countIf "L.countIf: ((Maybe a, Index) -> Boolean) -> PTraversal s a -> Number") <small><sup>v11.2.0</sup></small>
      * [`L.foldl((value, maybeValue, index) => value, value, traversal, maybeData) ~> value`](#L-foldl "L.foldl: ((r, Maybe a, Index) -> r) -> r -> PTraversal s a -> Maybe s -> r") <small><sup>v7.2.0</sup></small>
      * [`L.foldr((value, maybeValue, index) => value, value, traversal, maybeData) ~> value`](#L-foldr "L.foldr: ((r, Maybe a, Index) -> r) -> r -> PTraversal s a -> Maybe s -> r") <small><sup>v7.2.0</sup></small>
      * [`L.isDefined(traversal, maybeData) ~> boolean`](#L-isDefined "L.isDefined: PTraversal s a -> Maybe s -> Boolean") <small><sup>v11.8.0</sup></small>
      * [`L.isEmpty(traversal, maybeData) ~> boolean`](#L-isEmpty "L.isEmpty: PTraversal s a -> Maybe s -> Boolean") <small><sup>v11.5.0</sup></small>
      * [`L.join(string, traversal, maybeData) ~> string`](#L-join "L.join: String -> PTraversal s a -> Maybe s -> String") <small><sup>v11.2.0</sup></small>
      * [`L.joinAs((maybeValue, index) => maybeString, string, traversal, maybeData) ~> string`](#L-joinAs "L.joinAs: ((Maybe a, Index) -> Maybe String) -> String -> PTraversal s a -> Maybe s -> String") <small><sup>v11.2.0</sup></small>
      * [`L.maximum(traversal, maybeData) ~> maybeValue`](#L-maximum "L.maximum: Ord a => PTraversal s a -> Maybe s -> Maybe a") <small><sup>v7.2.0</sup></small>
      * [`L.maximumBy((maybeValue, index) => maybeKey, traversal, maybeData) ~> maybeValue`](#L-maximumBy "L.maximumBy: Ord k => ((Maybe a, Index) -> Maybe k) -> PTraversal s a -> Maybe s -> Maybe a") <small><sup>v11.2.0</sup></small>
      * [`L.mean(traversal, maybeData) ~> number`](#L-mean "L.mean: PTraversal s Number -> Maybe s -> Number") <small><sup>v11.17.0</sup></small>
      * [`L.meanAs((maybeValue, index) => maybeNumber, traversal, maybeData) ~> number`](#L-meanAs "L.meanAs: ((Maybe a, Index) -> Maybe Number) -> PTraversal s a -> Maybe s -> Number") <small><sup>v11.17.0</sup></small>
      * [`L.minimum(traversal, maybeData) ~> maybeValue`](#L-minimum "L.minimum: Ord a => PTraversal s a -> Maybe s -> Maybe a") <small><sup>v7.2.0</sup></small>
      * [`L.minimumBy((maybeValue, index) => maybeKey, traversal, maybeData) ~> maybeValue`](#L-minimumBy "L.minimumBy: Ord k => ((Maybe a, Index) -> Maybe k) -> PTraversal s a -> Maybe s -> Maybe a") <small><sup>v11.2.0</sup></small>
      * [`L.none((maybeValue, index) => testable, traversal, maybeData) ~> boolean`](#L-none "L.none: ((Maybe a, Index) -> Boolean) -> PTraversal s a -> Boolean") <small><sup>v11.6.0</sup></small>
      * [`L.or(traversal, maybeData) ~> boolean`](#L-or "L.or: PTraversal s Boolean -> Boolean") <small><sup>v9.6.0</sup></small>
      * [`L.product(traversal, maybeData) ~> number`](#L-product "L.product: PTraversal s Number -> Maybe s -> Number") <small><sup>v7.2.0</sup></small>
      * [`L.productAs((maybeValue, index) => number, traversal, maybeData) ~> number`](#L-productAs "L.productAs: ((Maybe a, Index) -> Number) -> PTraversal s a -> Maybe s -> Number") <small><sup>v11.2.0</sup></small>
      * [`L.select(traversal, maybeData) ~> maybeValue`](#L-select "L.select: PTraversal s a -> Maybe s -> Maybe a") <small><sup>v9.8.0</sup></small>
      * [`L.selectAs((maybeValue, index) => maybeValue, traversal, maybeData) ~> maybeValue`](#L-selectAs "L.selectAs: ((Maybe a, Index) -> Maybe b) -> PTraversal s a -> Maybe s -> Maybe b") <small><sup>v9.8.0</sup></small>
      * [`L.sum(traversal, maybeData) ~> number`](#L-sum "L.sum: PTraversal s Number -> Maybe s -> Number") <small><sup>v7.2.0</sup></small>
      * [`L.sumAs((maybeValue, index) => number, traversal, maybeData) ~> number`](#L-sumAs "L.sumAs: ((Maybe a, Index) -> Number) -> PTraversal s a -> Maybe s -> Number") <small><sup>v11.2.0</sup></small>
  * [Lenses](#lenses)
    * [Operations on lenses](#operations-on-lenses)
      * [`L.get(lens, maybeData) ~> maybeValue`](#L-get "L.get: PLens s a -> Maybe s -> Maybe a") <small><sup>v2.2.0</sup></small>
    * [Creating new lenses](#creating-new-lenses)
      * [`L.lens((maybeData, index) => maybeValue, (maybeValue, maybeData, index) => maybeData) ~> lens`](#L-lens "L.lens: ((Maybe s, Index) -> Maybe a) -> ((Maybe a, Maybe s, Index) -> Maybe s) -> PLens s a") <small><sup>v1.0.0</sup></small>
      * [`L.setter((maybeValue, maybeData, index) => maybeData) ~> lens`](#L-setter "L.setter: ((Maybe a, Maybe s, Index) -> Maybe s) -> PLens s a") <small><sup>v10.3.0</sup></small>
      * [`L.foldTraversalLens((traversal, maybeData) ~> maybeValue, traversal) ~> lens`](#L-foldTraversalLens "L.foldTraversalLens: (PTraversal s a -> Maybe s -> Maybe a) -> PTraversal s a -> PLens s a") <small><sup>v11.5.0</sup></small>
    * [Computing derived props](#computing-derived-props)
      * [`L.augment({prop: object => value, ...props}) ~> lens`](#L-augment "L.augment: {p1: o -> a1, ...ps} -> PLens {...o} {...o, p1: a1, ...ps}") <small><sup>v1.1.0</sup></small>
    * [Enforcing invariants](#enforcing-invariants)
      * [`L.defaults(valueIn) ~> lens`](#L-defaults "L.defaults: s -> PLens s s") <small><sup>v2.0.0</sup></small>
      * [`L.define(value) ~> lens`](#L-define "L.define: s -> PLens s s") <small><sup>v1.0.0</sup></small>
      * [`L.normalize((value, index) => maybeValue) ~> lens`](#L-normalize "L.normalize: ((s, Index) -> Maybe s) -> PLens s s") <small><sup>v1.0.0</sup></small>
      * [`L.required(valueOut) ~> lens`](#L-required "L.required: s -> PLens s s") <small><sup>v1.0.0</sup></small>
      * [`L.rewrite((valueOut, index) => maybeValueOut) ~> lens`](#L-rewrite "L.rewrite: ((s, Index) -> Maybe s) -> PLens s s") <small><sup>v5.1.0</sup></small>
    * [Lensing array-like objects](#array-like)
      * [`L.append ~> lens`](#L-append "L.append: PLens [a] a") <small><sup>v1.0.0</sup></small>
      * [`L.filter((maybeValue, index) => testable) ~> lens`](#L-filter "L.filter: ((Maybe a, Index) -> Boolean) -> PLens [a] [a]") <small><sup>v1.0.0</sup></small>
      * [`L.find((maybeValue, index) => testable) ~> lens`](#L-find "L.find: ((Maybe a, Index) -> Boolean) -> PLens [a] a") <small><sup>v1.0.0</sup></small>
      * [`L.findHint((maybeValue, {hint: index}) => testable, {hint: index}) ~> lens`](#L-findHint "L.findHint: ((Maybe a, {hint: Index}) -> Boolean, {hint: Index}) -> PLens [a] a") <small><sup>v10.1.0</sup></small>
      * [`L.findWith(...optics) ~> optic`](#L-findWith "L.findWith: (POptic s s1, ...POptic sN a) -> POptic [s] a") <small><sup>v1.0.0</sup></small>
      * [`L.index(elemIndex) ~> lens`](#L-index "L.index: Integer -> PLens [a] a") or `elemIndex` <small><sup>v1.0.0</sup></small>
      * [`L.last ~> lens`](#L-last "L.last: PLens [a] a") <small><sup>v9.8.0</sup></small>
      * [`L.prefix(maybeBegin) ~> lens`](#L-prefix "L.prefix: Maybe Number -> PLens [a] [a]") <small><sup>v11.12.0</sup></small>
      * [`L.slice(maybeBegin, maybeEnd) ~> lens`](#L-slice "L.slice: Maybe Number -> Maybe Number -> PLens [a] [a]") <small><sup>v8.1.0</sup></small>
      * [`L.suffix(maybeEnd) ~> lens`](#L-suffix "L.suffix: Maybe Number -> PLens [a] [a]") <small><sup>v11.12.0</sup></small>
    * [Lensing objects](#lensing-objects)
      * [`L.pickIn({prop: lens, ...props}) ~> lens`](#L-pickIn "L.pickIn: {p1: PLens s1 a1, ...pls} -> PLens {p1: s1, ...pls} {p1: a1, ...pls}") <small><sup>v11.11.0</sup></small>
      * [`L.prop(propName) ~> lens`](#L-prop "L.prop: (p: a) -> PLens {p: a, ...ps} a") or `propName` <small><sup>v1.0.0</sup></small>
      * [`L.props(...propNames) ~> lens`](#L-props "L.props: (p1: a1, ...ps) -> PLens {p1: a1, ...ps, ...o} {p1: a1, ...ps}") <small><sup>v1.4.0</sup></small>
      * [`L.propsOf(object) ~> lens`](#L-propsOf "L.propsOf: {p1: a1, ...ps} -> PLens {p1: a1, ...ps, ...o} {p1: a1, ...ps}") <small><sup>v11.13.0</sup></small>
      * [`L.removable(...propNames) ~> lens`](#L-removable "L.removable: (p1: a1, ...ps) -> PLens {p1: a1, ...ps, ...o} {p1: a1, ...ps, ...o}") <small><sup>v9.2.0</sup></small>
    * [Lensing strings](#lensing-strings)
      * [`L.matches(/.../) ~> lens`](#L-matches "L.matches: RegExp -> PLens String String") <small><sup>v10.4.0</sup></small>
    * [Providing defaults](#providing-defaults)
      * [`L.valueOr(valueOut) ~> lens`](#L-valueOr "L.valueOr: s -> PLens s s") <small><sup>v3.5.0</sup></small>
    * [Transforming data](#transforming-data)
      * [`L.pick({prop: lens, ...props}) ~> lens`](#L-pick "L.pick: {p1: PLens s a1, ...pls} -> PLens s {p1: a1, ...pls}") <small><sup>v1.2.0</sup></small>
      * [`L.replace(maybeValueIn, maybeValueOut) ~> lens`](#L-replace "L.replace: Maybe s -> Maybe s -> PLens s s") <small><sup>v1.0.0</sup></small>
  * [Isomorphisms](#isomorphisms)
    * [Operations on isomorphisms](#operations-on-isomorphisms)
      * [`L.getInverse(isomorphism, maybeData) ~> maybeData`](#L-getInverse "L.getInverse: PIso a b -> Maybe b -> Maybe a") <small><sup>v5.0.0</sup></small>
    * [Creating new isomorphisms](#creating-new-isomorphisms)
      * [`L.iso(maybeData => maybeValue, maybeValue => maybeData) ~> isomorphism`](#L-iso "L.iso: (Maybe s -> Maybe a) -> (Maybe a -> Maybe s) -> PIso s a") <small><sup>v5.3.0</sup></small>
    * [Isomorphism combinators](#isomorphism-combinators)
      * [`L.inverse(isomorphism) ~> isomorphism`](#L-inverse "L.inverse: PIso a b -> PIso b a") <small><sup>v4.1.0</sup></small>
    * [Basic isomorphisms](#basic-isomorphisms)
      * [`L.complement ~> isomorphism`](#L-complement "L.complement: PIso Boolean Boolean") <small><sup>v9.7.0</sup></small>
      * [`L.identity ~> isomorphism`](#L-identity "L.identity: PIso s s") <small><sup>v1.3.0</sup></small>
      * [`L.is(value) ~> isomorphism`](#L-is "L.is: v -> PIso v Boolean") <small><sup>v11.1.0</sup></small>
    * [Standard isomorphisms](#standard-isomorphisms)
      * [`L.uri ~> isomorphism`](#L-uri "L.uri: PIso String String") <small><sup>v11.3.0</sup></small>
      * [`L.uriComponent ~> isomorphism`](#L-uriComponent "L.uriComponent: PIso String String") <small><sup>v11.3.0</sup></small>
      * [`L.json({reviver, replacer, space}) ~> isomorphism`](#L-json "L.json: {reviver, replacer, space} -> PIso String JSON") <small><sup>v11.3.0</sup></small>
  * [Auxiliary](#auxiliary)
    * [`L.seemsArrayLike(anything) ~> boolean`](#L-seemsArrayLike "L.seemsArrayLike: any -> Boolean") <small><sup>v11.4.0</sup></small>
* [Examples](#examples)
  * [An array of ids as boolean flags](#an-array-of-ids-as-boolean-flags)
  * [Dependent fields](#dependent-fields)
  * [Collection toggle](#collection-toggle)
  * [BST as a lens](#bst-as-a-lens)
  * [Interfacing with Immutable.js](#interfacing)
* [Advanced topics](#advanced-topics)
  * [Performance tips](#performance-tips)
  * [On bundle size and minification](#on-bundle-size-and-minification)
* [Background](#background)
  * [Motivation](#motivation)
  * [Design choices](#design-choices)
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
const sampleTitles = {titles: [{language: "en", text: "Title"},
                               {language: "sv", text: "Rubrik"}]}
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
L.set(L.seq(textIn("sv"),
            textIn("en")),
      undefined,
      sampleTitles)
// { titles: [] }
```

Above we use [`L.seq`](#L-seq) to run the [`L.set`](#L-set) operation over both
of the focused titles.  The `titles` property is not removed thanks to the
[`L.define([])`](#L-define) part of our lens composition.  It makes it so that
when reading or writing through the lens, `undefined` becomes the given value.

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
// { titles: [ { language: 'en', text: 'TITLE' },
//             { language: 'sv', text: 'RUBRIK' } ] }
```

We can also manipulate texts selectively.  For example, we could remove all
the texts that are longer than 5 characters:

```js
L.remove([texts, L.when(t => t.length > 5)],
         sampleTitles)
// { titles: [ { language: 'en', text: 'Title' } ] }
```

This concludes the tutorial.  The reference documentation contains lots of tiny
examples and a few [more involved examples](#L-lazy).  The [examples](#examples)
section describes a couple of lens compositions we've found practical as well as
examples that may help to
see [possibilities beyond the immediately obvious](#bst-as-a-lens).

## The why of optics

Optics provide a way to decouple the operation to perform on an element or
elements of a data structure from the details of selecting the element or
elements and the details of maintaining the integrity of the data structure.  In
other words, a selection algorithm and data structure invariant maintenance can
be expressed as a composition of optics and used with many different operations.

Consider how one might approach the [tutorial](#tutorial) problem without
optics.  One could, for example, write a collection of operations like
`getText`, `setText`, `addText`, and `remText`:

```js
const getEntry = R.curry((language, data) =>
                         data.titles.find(R.whereEq({language})))
const hasText = R.pipe(getEntry, Boolean)
const getText = R.pipe(getEntry, R.defaultTo({}), R.prop("text"))
const mapProp = R.curry((fn, prop, obj) =>
                        R.assoc(prop, fn(R.prop(prop, obj)), obj))
const mapText = R.curry((language, fn, data) =>
                        mapProp(R.map(R.ifElse(R.whereEq({language}),
                                               mapProp(fn, "text"),
                                               R.identity)),
                                "titles",
                                data))
const remText = R.curry((language, data) =>
                        mapProp(R.filter(R.complement(R.whereEq({language}))),
                                "titles"))
const addText = R.curry((language, text, data) =>
                        mapProp(R.append({language, text}), "titles", data))
const setText = R.curry((language, text, data) =>
                        mapText(language, R.always(text), data))
```

You can definitely make the above operations both cleaner and more robust.  For
example, consider maintaining the ordering of texts and the handling of cases
such as using `addText` when there already is a text in the specified language
and `setText` when there isn't.  With partial optics, however, you separate the
selection and data structure invariant maintenance from the operations as
illustrated in the [tutorial](#tutorial) and due to the separation of concerns
that tends to give you a lot of robust functionality
in [a small amount of code](#a-partial-lens-to-access-title-texts).

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
restriction of lenses with an [inverse](#L-inverse).

In addition to basic bidirectional optics, this library also supports more
arbitrary [transforms](#transforms) using optics with [sequencing](#L-seq)
and [transform ops](#transforming).  Transforms allow operations, such as
modifying a part of data structure multiple times or even in a loop, that are
not possible with basic optics.

Some optics libraries provide many more abstractions, such as "optionals",
"prisms" and "folds", to name a few, forming a DAG.  Aside from being
conceptually important, many of those abstractions are not only useful but
required in a statically typed setting where data structures have precise
constraints on their shapes, so to speak, and operations on data structures must
respect those constraints at *all* times.

On the other hand, in a dynamically typed language like JavaScript, the shapes
of run-time objects are naturally *malleable*.  Nothing immediately breaks if a
new object is created as a copy of another object by adding or removing a
property, for example.  We can exploit this to our advantage by considering all
optics as *partial* and manage with a smaller amount of distinct classes of
optics.

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
makes the optics in this library partial and allows specific partial optics,
such as the simple [`L.prop`](#L-prop) lens, to be used in a wider range of
situations than corresponding total optics.

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

Now, optics are composable in several ways and in each of those ways there is an
operation to perform the composition and laws on how such composed optics
behave.  Here is a table of the means of composition supported by this library:

|                           | Operation(s)                                                                        | Semantics
| ------------------------- | ----------------------------------------------------------------------------------- | -----------------------------------------------------------------------------------------
| [Nesting](#nesting)       | [`L.compose(...optics)`](#L-compose) or `[...optics]`                               | [Monoid](https://en.wikipedia.org/wiki/Monoid) over [unityped](http://cs.stackexchange.com/questions/18847/if-dynamically-typed-languages-are-truly-statically-typed-unityped-languages-w) [optics](#optics)
| [Recursing](#recursing)   | [`L.lazy(optic => optic)`](#L-lazy)                                                 | [Fixed point](https://en.wikipedia.org/wiki/Fixed-point_combinator)
| [Adapting](#adapting)     | [`L.choices(optic, ...optics)`](#L-choices)                                         | [Semigroup](https://en.wikipedia.org/wiki/Semigroup) over [optics](#optics)
| [Querying](#querying)     | [`L.choice(...optics)`](#L-choice) and [`L.chain(value => optic, optic)`](#L-chain) | [MonadPlus](https://en.wikibooks.org/wiki/Haskell/Alternative_and_MonadPlus) over [optics](#optics)
| Picking                   | [`L.pick({...prop:lens})`](#L-pick)                                                 | <a href="https://en.wikipedia.org/wiki/Product_(category_theory)">Product</a> of [lenses](#lenses)
| Branching                 | [`L.branch({...prop:traversal})`](#L-branch)                                        | [Coproduct](https://en.wikipedia.org/wiki/Coproduct) of [traversals](#traversals)
| [Sequencing](#sequencing) | [`L.seq(...transforms)`](#L-seq)                                                    | <a href="https://en.wikipedia.org/wiki/Monad_(functional_programming)">Monad</a> over [transforms](#transforms)

The above table and, in particular, the semantics column is by no means
complete.  In particular, the documentation of this library does not generally
spell out proofs of the semantics.

#### On lens laws

Aside from understanding laws on how forms of composition behave, it is useful
to understand laws that are specific to operations on lenses and optics, in
general.  As described in the
paper
[A clear picture of lens laws](http://sebfisch.github.io/research/pub/Fischer+MPC15.pdf),
many laws have been formulated for lenses and it can be useful to have lenses
that do not necessarily obey some laws.

Here is a snippet that demonstrates that partial lenses can obey the laws of, so
called, *very well-behaved lenses*:

```js
const elemA = 2
const elemB = 3
const data = {x: 1}
const lens = "x"

const test = (actual, expected) => R.equals(actual, expected) || actual

R.identity({
  GetSet: test(L.set(lens, L.get(lens, data), data), data),
  SetGet: test(L.get(lens, L.set(lens, elemA, data)), elemA),
  SetSet: test(L.set(lens, elemB, L.set(lens, elemA, data)),
               L.set(lens, elemB, data))
})
// { GetSet: true, SetGet: true, SetSet: true }
```

You might want to [▶
play](https://calmm-js.github.io/partial.lenses/#on-lens-laws) with the laws in
your browser.

*Note*, however, that *partial* lenses are not (total) lenses.  To support
propagating removal, partial lenses treat empty objects, `{}`, and empty arrays,
`[]`, as equivalent to `undefined` in certain contexts.  You need to account for
this behaviour in laws or adjust the behaviour using combinators like
[`L.define`](#L-define).

##### Myth: Partial Lenses are not lawful

For some reason there seems to be a persistent myth that partial lenses cannot
obey [lens laws](http://sebfisch.github.io/research/pub/Fischer+MPC15.pdf).  The
issue a little more interesting than a simple yes or no.  The short answer is
that partial lenses can obey lens laws.  However, for practical reasons there
are many combinators in this library that, alone, do not obey lens laws.
Nevertheless even such combinators can be used in lens compositions that obey
lens laws.

Consider the [`L.find`](#L-find) combinator.  The truth is that it doesn't
by itself obey lens laws.  Here is an example:

```js
L.get(L.find(R.equals(1)),
      L.set(L.find(R.equals(1)), 2, []))
// undefined
```

As you can see, `L.find(R.equals(1))` does not obey the `SetGet` aka `Put-Get`
law.  Does this make the [`L.find`](#L-find) combinator useless?  Far from it.

Consider the following lens:

```js
const valOf = key => [L.define([]),
                      L.find(R.whereEq({key})),
                      L.defaults({key}),
                      "val"]
```

The `valOf` lens constructor is for accessing association arrays that contain
`{id, val}` pairs.  For example:

```js
const sampleAssoc = [{key: "x", val: 42}, {key: "y", val: 24}]
console.log(L.set(valOf("x"), 101, [])) // [{key: "x", val: 101}]
console.log(L.get(valOf("x"), sampleAssoc)) // 42
console.log(L.get(valOf("z"), sampleAssoc)) // undefined
console.log(L.set(valOf("x"), undefined, sampleAssoc)) // [{key: "y", val: 24}]
console.log(L.set(valOf("x"), 13, sampleAssoc))
// [{key: "x", val: 13}, {key: "y", val: 24}]
```

It obeys lens laws.  Before you try to break it, note that a lens returned by
`valOf(key)` is only supposed to work on valid association arrays.  A valid
association array must not contain duplicate keys, `undefined` is not valid
`val`, and the order of elements is not significant.  (Note that you could also
add [`L.rewrite(R.sortBy(L.get("key")))`](#L-rewrite) to the composition after
`L.define([])` to ensure that elements stay in the same order.)

The gist of this example is important.  Even if it is the case that not all
parts of a lens composition obey lens laws, it can be that a composition taken
as a whole obeys lens laws.  The reason why this use of [`L.find`](#L-find)
results in a lawful partial lens is that the lenses composed after it restrict
the domain of the lens so that one cannot modify the `key`.

#### Operations on optics

##### <a id="L-assign"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-assign) [`L.assign(optic, object, maybeData) ~> maybeData`](#L-assign "L.assign: PLens s {p1: a1, ...ps, ...o} -> {p1: a1, ...ps} -> Maybe s -> Maybe s") <small><sup>v11.13.0</sup></small>

`L.assign` allows one to merge the given object into the object or objects
focused on by the given optic.

For example:

```js
L.assign(L.elems, {y: 1}, [{x: 3, y: 2}, {x: 4}])
// [ { x: 3, y: 1 }, { x: 4, y: 1 } ]
```

##### <a id="L-modify"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-modify) [`L.modify(optic, (maybeValue, index) => maybeValue, maybeData) ~> maybeData`](#L-modify "L.modify: POptic s a -> ((Maybe a, Index) -> Maybe a) -> Maybe s -> Maybe s") <small><sup>v2.2.0</sup></small>

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

##### <a id="L-remove"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-remove) [`L.remove(optic, maybeData) ~> maybeData`](#L-remove "L.remove: POptic s a -> Maybe s -> Maybe s") <small><sup>v2.0.0</sup></small>

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

##### <a id="L-set"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-set) [`L.set(optic, maybeValue, maybeData) ~> maybeData`](#L-set "L.set: POptic s a -> Maybe a -> Maybe s -> Maybe s") <small><sup>v1.0.0</sup></small>

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

##### <a id="L-traverse"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-traverse) [`L.traverse(category, (maybeValue, index) => operation, optic, maybeData) ~> operation`](#L-traverse "L.traverse: (Functor|Applicative|Monad) c -> ((Maybe a, Index) -> c b) -> POptic s t a b -> Maybe s -> c t") <small><sup>v10.0.0</sup></small>

`L.traverse` maps each focus to an operation and returns an operation that runs
those operations in-order and collects the results.  The `category` argument
must be either
a
[`Functor`](https://github.com/rpominov/static-land/blob/master/docs/spec.md#functor),
[`Applicative`](https://github.com/rpominov/static-land/blob/master/docs/spec.md#applicative),
or
[`Monad`](https://github.com/rpominov/static-land/blob/master/docs/spec.md#monad) depending
on the optic as specified in [`L.toFunction`](#L-toFunction).

Here is a bit involved example that uses the State applicative and `L.traverse`
to replace elements in a data structure by the number of times those elements
have appeared at that point in the data structure:

```js
const State = {
  of: result => state => ({state, result}),
  ap: (x2yS, xS) => state0 => {
    const {state: state1, result: x2y} = x2yS(state0)
    const {state, result: x} = xS(state1)
    return {state, result: x2y(x)}
  },
  map: (x2y, xS) => State.ap(State.of(x2y), xS),
  run: (s, xS) => xS(s).result
}

const count = x => x2n => {
  const k = `${x}`
  const n = (x2n[k] || 0) + 1
  return {result: n, state: L.set(k, n, x2n)}
}

State.run({}, L.traverse(State, count, L.elems, [1, 2, 1, 1, 2, 3, 4, 3, 4, 5]))
// [1, 1, 2, 3, 2, 1, 1, 2, 2, 1]
```

#### Nesting

The [`L.compose`](#L-compose) combinator allows one to build optics that deal
with nested data structures.

##### <a id="L-compose"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-compose) [`L.compose(...optics) ~> optic`](#L-compose "L.compose: (POptic s s1, ...POptic sN a) -> POptic s a") or `[...optics]` <small><sup>v1.0.0</sup></small>

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

#### Recursing

The [`L.lazy`](#L-lazy) combinator allows one to build optics that deal with
nested or recursive data structures of arbitrary depth.  It also allows one to
build [transforms](#transforms) with loops.

##### <a id="L-lazy"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-lazy) [`L.lazy(optic => optic) ~> optic`](#L-lazy "L.lazy: (POptic s a -> POptic s a) -> POptic s a") <small><sup>v5.1.0</sup></small>

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
const primitives = [
  L.optional,
  L.lazy(rec => L.iftes(R.is(Array),  [L.elems, rec],
                        R.is(Object), [L.values, rec],
                        L.identity))]
```

Note that the above creates a cyclic representation of the traversal.

Now, for example:

```js
L.collect(primitives, [[[1], 2], {y: 3}, [{l: 4, r: [5]}, {x: 6}]])
// [ 1, 2, 3, 4, 5, 6 ]
```
```js
L.modify(primitives, x => x+1, [[[1], 2], {y: 3}, [{l: 4, r: [5]}, {x: 6}]])
// [ [ [ 2 ], 3 ], { y: 4 }, [ { l: 5, r: [ 6 ] }, { x: 7 } ] ]
```
```js
L.remove([primitives, L.when(x => 3 <= x && x <= 4)],
         [[[1], 2], {y: 3}, [{l: 4, r: [5]}, {x: 6}]])
// [ [ [ 1 ], 2 ], [ { r: [ 5 ] }, { x: 6 } ] ]
```

#### Adapting

Adapting combinators allow one to build optics that adapt to their input.

##### <a id="L-choices"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-choices) [`L.choices(optic, ...optics) ~> optic`](#L-choices "L.choices: (POptic s a, ...POptic s a) -> POptic s a") <small><sup>v11.10.0</sup></small>

`L.choices` returns a partial optic that acts like the first of the given optics
whose view is not `undefined` on the given data structure.  When the views of
all of the given optics are `undefined`, the returned optic acts like the last
of the given optics.  See also [`L.choice`](#L-choice).

For example:

```js
L.set([L.elems, L.choices("a", "d")], 3, [{R: 1}, {a: 1}, {d: 2}])
// [ { R: 1, d: 3 }, { a: 3 }, { d: 3 } ]
```

##### <a id="L-choose"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-choose) [`L.choose((maybeValue, index) => optic) ~> optic`](#L-choose "L.choose: ((Maybe s, Index) -> POptic s a) -> POptic s a") <small><sup>v1.0.0</sup></small>

`L.choose` creates an optic whose operation is determined by the given function
that maps the underlying view, which can be `undefined`, to an optic.  In other
words, the `L.choose` combinator allows an optic to be constructed *after*
examining the data structure being manipulated.  See also [`L.iftes`](#L-iftes).

For example:

```js
const majorAxis =
  L.choose(({x, y} = {}) => Math.abs(x) < Math.abs(y) ? "y" : "x")

L.get(majorAxis, {x: -3, y: 1})
// -3
```
```js
L.modify(majorAxis, R.negate, {x: -3, y: 1})
// { x: 3, y: 1 }
```

##### <a id="L-iftes"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-iftes) [`L.iftes((maybeValue, index) => testable, consequentOptic, ...[, alternativeOptic]) ~> optic`](#L-iftes "L.iftes: ((Maybe s, Index) -> Boolean) -> PLens s a -> PLens s a -> PLens s a") <small><sup>v11.14.0</sup></small>

`L.iftes` creates an optic whose operation is selected from the given optics and
predicates on the underlying view.

```jsx
L.iftes( predicate, consequent
     [ , ... ]
     [ , alternative ] )
```

`L.iftes` is not curried unlike most functions in this library.  `L.iftes`
requires at least two arguments and successive arguments form *predicate* -
*consequent* pairs.  The predicates are functions on the underlying view and are
tested sequentially.  The consequences are optics and `L.iftes` acts like the
consequent corresponding to the first predicate that returns true.  If `L.iftes`
is given an odd number of arguments, the last argument is the *alternative*
taken in case none of the predicates returns true.  If all predicates return
false and there is no alternative, `L.iftes` acts like [`L.zero`](#L-zero).

For example:

```js
const minorAxis =
  L.iftes(({x, y} = {}) => Math.abs(y) < Math.abs(x), "y", "x")

L.get(minorAxis, {x: -3, y: 1})
// 1
```
```js
L.modify(minorAxis, R.negate, {x: -3, y: 1})
// { x: -3, y: -1 }
```

Note that `L.iftes` can be implemented using [`L.choose`](#L-choose).

##### <a id="L-orElse"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-orElse) [`L.orElse(backupOptic, primaryOptic) ~> optic`](#L-orElse "L.orElse: (POptic s a, POptic s a) -> POptic s a") <small><sup>v2.1.0</sup></small>

`L.orElse(backupOptic, primaryOptic)` acts like `primaryOptic` when its view is
not `undefined` and otherwise like `backupOptic`.

Note that [`L.choice(...optics)`](#L-choice) is equivalent to
`optics.reduceRight(L.orElse, L.zero)` and [`L.choices(...optics)`](#L-choices)
is equivalent to `optics.reduce(L.orElse)`.

#### Querying

Querying combinators allow one to use optics to query data structures.  Querying
is distinguished from [adapting](#adapting) in that querying defaults to an
empty or read-only [zero](#L-zero).

##### <a id="L-chain"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-chain) [`L.chain((value, index) => optic, optic) ~> optic`](#L-chain "L.chain: ((a, Index) -> POptic s b) -> POptic s a -> POptic s b") <small><sup>v3.1.0</sup></small>

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

##### <a id="L-choice"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-choice) [`L.choice(...optics) ~> optic`](#L-choice "L.choice: (...POptic s a) -> POptic s a") <small><sup>v2.1.0</sup></small>

`L.choice` returns a partial optic that acts like the first of the given optics
whose view is not `undefined` on the given data structure.  When the views of
all of the given optics are `undefined`, the returned optic acts
like [`L.zero`](#L-zero), which is the identity element of `L.choice`.  See
also [`L.choices`](#L-choices).

For example:

```js
L.modify([L.elems, L.choice("a", "d")], R.inc, [{R: 1}, {a: 1}, {d: 2}])
// [ { R: 1 }, { a: 2 }, { d: 3 } ]
```

##### <a id="L-optional"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-optional) [`L.optional ~> optic`](#L-optional "L.optional: POptic a a") <small><sup>v3.7.0</sup></small>

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

##### <a id="L-when"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-when) [`L.when((maybeValue, index) => testable) ~> optic`](#L-when "L.when: ((Maybe a, Index) -> Boolean) -> POptic a a") <small><sup>v5.2.0</sup></small>

`L.when` allows one to selectively skip elements within a traversal or to
selectively turn a lens into a read-only lens whose view is `undefined`.

For example:

```js
L.modify([L.elems, L.when(x => x > 0)], R.negate, [0, -1, 2, -3, 4])
// [ 0, -1, -2, -3, -4 ]
```

Note that `L.when(p)` is equivalent
to [`L.choose((x, i) => p(x, i) ? L.identity : L.zero)`](#L-choose).

##### <a id="L-zero"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-zero) [`L.zero ~> optic`](#L-zero "L.zero: POptic s a") <small><sup>v6.0.0</sup></small>

`L.zero` is the identity element of [`L.choice`](#L-choice)
and [`L.chain`](#L-chain).  As a traversal, `L.zero` is a traversal of no
elements and as a lens, i.e. when used with [`L.get`](#L-get), `L.zero` is a
read-only lens whose view is always `undefined`.

For example:

```js
L.collect([L.elems,
           L.iftes(R.is(Array),  L.elems,
                   R.is(Object), "x",
                   L.zero)],
          [1, {x: 2}, [3,4]])
// [ 2, 3, 4 ]
```

#### Caching

#### <a id="L-cache"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-cache) [`L.cache(optic[, map]) ~> optic`](#L-cache "L.cache: (POptic s a[, Map]) -> POptic s a") <small><sup>v11.15.0</sup></small>

`L.cache` wraps a given optic so that the last operation, inputs, and the result
are cached and when used repeatedly with the same operation and inputs, the
cached result is used without recomputing it.  `L.cache` stores the cached
results by index and also works with indexed traversals such as
[`L.elems`](#L-elems) and [`L.values`](#L-values).  The second argument to
`L.cache` is optional and can be used to give the
[`Map`](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Map)
to use for caching results explicitly.  When not given, a `Map` is created
internally by `L.cache`.

**WARNING: `L.cache` is experimental and might be removed or changed before next
major release.**

Here is a contrived example

```js
const incOp = L.cache(L.choose(_ => console.log("incOp") || L.modifyOp(R.inc)))

R.identity({
  fst: L.transform(L.branch({x: incOp, y: incOp}), {x: 1, y: 2}),
  snd: L.transform(L.branch({x: incOp, y: incOp}), {x: 1, y: 2})
})
// incOp
// incOp
// { fst: { x: 2, y: 3 }, snd: { x: 2, y: 3 } }
```

that demonstrates that the cached `incOp` is only performed twice instead of
four times.

Note that simply wrapping optics with `L.cache` does not generally improve
performance and may even cause memory usage issues.  When used on an optic that
appears after `L.elems`, for example, a cache entry is recorded for each element
in the operated array, which may take a significant amount of memory.  However,
when used strategically, `L.cache` can be used to make complex transforms
operate [incrementally](https://en.wikipedia.org/wiki/Incremental_computing).

#### Debugging

##### <a id="L-log"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-log) [`L.log(...labels) ~> optic`](#L-log "L.log: (...Any) -> POptic s s") <small><sup>v3.2.0</sup></small>

`L.log(...labels)` is an identity optic that
outputs
[`console.log`](https://developer.mozilla.org/en-US/docs/Web/API/Console/log)
messages with the given labels
(or
[format in Node.js](https://nodejs.org/api/console.html#console_console_log_data))
when data flows in either direction, `get` or `set`, through the lens.

For example:

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

##### <a id="L-toFunction"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-toFunction) [`L.toFunction(optic) ~> optic`](#L-toFunction "L.toFunction: POptic s t a b -> (Maybe s, Index, (Functor|Applicative|Monad) c, (Maybe a, Index) -> c b) -> c t") <small><sup>v7.0.0</sup></small>

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

Ordinary [optics](#optics) are passive and bidirectional in such a way that the
same optic can be both read and written through.  The underlying implementation
of this library also allows one to implement active operations that don't quite
provide the same kind of passive bidirectionality, but can be used to
flexibly [modify](#L-modifyOp) data structures.  Such operations are called
*transforms* in this library.

Unlike ordinary optics, transforms allow for monadic [sequencing](#L-seq), which
makes it possible to operate on a part of data structure multiple times.  This
allows operations that are impossible to implement using ordinary optics, but
also potentially makes it more difficult to reason about the results.  This
ability also makes it impossible to read through transforms in the same sense as
with ordinary optics.

Recall that [lenses](#lenses) have a single focus and [traversals](#traversals)
have multiple focuses that can then be operated upon using various operations
such as [`L.modify`](#L-modify).  Although it is not strictly enforced by this
library, it is perhaps clearest to think that transforms have no focuses.  A
transform using [transform ops](#transforming), that act as traversals of no
elements, can, and perhaps preferably should, be [empty](#L-isEmpty) and should
be executed using [`L.transform`](#L-transform), which,
unlike [`L.modify`](#L-modify), takes no user defined operation to apply to
focuses.

The line between transforms and optics is not entirely clear cut in the sense
that it is technically possible to use various [transform ops](#transforming)
within an ordinary optic definition.  Furthermore, it is also possible to
use [sequencing](#L-seq) to create transforms that have focuses that can then be
operated upon.  The results of such uses don't quite follow the laws of ordinary
optics, but may sometimes be useful.

#### Operations on transforms

##### <a id="L-transform"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-transform) [`L.transform(optic, maybeData) ~> maybeData`](#L-transform "L.transform: POptic s a -> Maybe s -> Maybe s") <small><sup>v11.7.0</sup></small>

`L.transform(o, s)` is shorthand for [`L.modify(o, x => x, s)`](#L-modify) and
is intended for running [transforms](#transforms) defined
using [transform ops](#transforming).

Note that

* [`L.assign(o, x, s)`](#L-assign) is equivalent to [`L.transform([o,
  L.assignOp(x)], s)`](#L-assignOp),
* [`L.modify(o, f, s)`](#L-modify) is equivalent to [`L.transform([o,
  L.modifyOp(f)], s)`](#L-modifyOp),
* [`L.set(o, x, s)`](#L-set) is equivalent to [`L.transform([o, L.setOp(x)],
  s)`](#L-setOp), and
* [`L.remove(o, s)`](#L-remove) is equivalent to [`L.transform([o, L.removeOp],
  s)`](#L-removeOp).

#### Sequencing

The [`L.seq`](#L-seq) combinator allows one to build [transforms](#transforms)
that modify their focus more than once.

##### <a id="L-seq"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-seq) [`L.seq(...transforms) ~> transform`](#L-seq "L.seq: (...PTransform s a) -> PTransform s a") <small><sup>v9.4.0</sup></small>

`L.seq` creates a transform that modifies the focus with each of the given
transforms in sequence.

Here is an example of a bottom-up transform over a data structure of nested
objects and arrays:

```js
const everywhere = [
  L.optional,
  L.lazy(rec => L.iftes(R.is(Array),  L.seq([L.elems, rec], L.identity),
                        R.is(Object), L.seq([L.values, rec], L.identity),
                        L.identity))]
```

The above `everywhere` transform is similar to the
[`F.everywhere`](https://github.com/polytypic/fastener#F-everywhere) transform
of the [`fastener`](https://github.com/polytypic/fastener) zipper-library.  Note
that the above `everywhere` and the [`primitives`](#L-lazy) example differ in
that `primitives` only targets the non-object and non-array elements of the data
structure while `everywhere` also targets those.

```js
L.modify(everywhere, x => [x], {xs: [{x: 1}, {x: 2}]})
// [ {xs: [ [ [ { x: [ 1 ] } ], [ { x: [ 2 ] } ] ] ] } ]
```

Note that `L.seq`, [`L.choose`](#L-choose), and [`L.setOp`](#L-setOp) can be
combined together as
a
[`Monad`](https://github.com/rpominov/static-land/blob/master/docs/spec.md#monad)

```jsx
chain(x2t, t) = L.seq(t, L.choose(x2t))
        of(x) = L.setOp(x)
```

which is not the same as the [querying monad](#L-chain).

#### Transforming

##### <a id="L-assignOp"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-assignOp) [`L.assignOp(object) ~> optic`](#L-assignOp "L.assignOp: {p1: a1, ...ps} -> POptic {p1: a1, ...ps, ...o} {p1: a1, ...ps}") <small><sup>v11.13.0</sup></small>

`L.assignOp` creates an optic that merges the given object into the object in
focus.

For example:

```js
L.transform([L.elems, L.assignOp({y: 1})], [{x: 3}, {x: 4, y: 5}])
// [ { x: 3, y: 1 }, { x: 4, y: 1 } ]
```

##### <a id="L-modifyOp"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-modifyOp) [`L.modifyOp((maybeValue, index) => maybeValue) ~> optic`](#L-modifyOp "L.modifyOp: ((Maybe a, Index) -> Maybe a) -> POptic a a") <small><sup>v11.7.0</sup></small>

`L.modifyOp` creates an optic that maps the focus with the given function.  When
used as a traversal, `L.modifyOp` acts as a traversal of no elements.  When used
as a lens, `L.modifyOp` acts as a read-only lens whose view is the mapped focus.
Usually, however, `L.modifyOp` is used within [transforms](#transforms).

For example:

```js
L.transform(L.branch({xs: [L.elems, L.modifyOp(R.inc)],
                      z: [L.optional, L.modifyOp(R.negate)],
                      ys: [L.elems, L.modifyOp(R.dec)]}),
            {xs: [1, 2, 3],
             ys: [1, 2, 3]})
// { xs: [ 2, 3, 4 ],
//   ys: [ 0, 1, 2 ] }
```

##### <a id="L-removeOp"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-removeOp) [`L.removeOp ~> optic`](#L-removeOp "L.removeOp: POptic a a") <small><sup>v11.7.0</sup></small>

`L.removeOp` is shorthand for [`L.setOp(undefined)`](#L-setOp).

Here is an example based on a question from a user:

```js
const sampleToFilter = {elements: [{time: 1, subelements: [1, 2, 3, 4]},
                                   {time: 2, subelements: [1, 2, 3, 4]},
                                   {time: 3, subelements: [1, 2, 3, 4]}]}

L.transform(['elements',
             L.elems,
             L.seq([L.when(elem => elem.time < 2), L.removeOp],
                   ['subelements', L.elems, L.when(i => i < 3), L.removeOp])],
            sampleToFilter)
// { elements: [ { time: 2, subelements: [ 3, 4 ] },
//               { time: 3, subelements: [ 3, 4 ] } ] }
```

The idea is to filter the data both by `time` and by `subelements`.

##### <a id="L-setOp"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-setOp) [`L.setOp(maybeValue) ~> optic`](#L-setOp "L.setOp: Maybe a -> POptic a a") <small><sup>v11.7.0</sup></small>

`L.setOp(x)` is shorthand for [`L.modifyOp(R.always(x))`](#L-modifyOp).

### Traversals

A traversal operates over a collection of non-overlapping focuses that are
visited only once and can, for example,
be
[collected](#L-collect),
[folded](#L-concatAs), [modified](#L-modify), [set](#L-set)
and [removed](#L-remove).  Put in another way, a traversal specifies a set of
paths to elements in a data structure.


#### Creating new traversals

##### <a id="L-branch"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-branch) [`L.branch({prop: traversal, ...props}) ~> traversal`](#L-branch "L.branch: {p1: PTraversal s a, ...pts} -> PTraversal s a") <small><sup>v5.1.0</sup></small>

`L.branch` creates a new traversal from a given possibly nested template object
that specifies how the new traversal should visit the properties of an object.
If one thinks of traversals as specifying sets of paths, then the template can
be seen as mapping each property to a set of paths to traverse.

For example:

```js
L.collect(L.branch({first: L.elems, second: {value: L.identity}}),
          {first: ["x"], second: {value: "y"}})
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
L.modify([L.pick({z: 2, x: 0}),
          L.branch({x: L.identity, z: L.identity})],
         R.negate,
         [1, 2, 3])
// [ -1, 2, -3 ]
```

See the [BST traversal](#bst-traversal) section for a more meaningful example.

#### Traversals and combinators

##### <a id="L-elems"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-elems) [`L.elems ~> traversal`](#L-elems "L.elems: PTraversal [a] a") <small><sup>v7.3.0</sup></small>

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

##### <a id="L-flatten"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-flatten) [`L.flatten ~> traversal`](#L-flatten "L.flatten: PTraversal [...[a]...] a") <small><sup>v11.16.0</sup></small>

`L.flatten` is a traversal over the elements of arbitrarily nested arrays.
Other [array-like](#array-like) objects are treated as elements by `L.flatten`.
In case the immediate target of `L.flatten` is not an array, it is traversed.

For example:

```js
L.join(" ", L.flatten, [[[1]], ["2"], 3])
// "1 2 3"
```

##### <a id="L-values"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-values) [`L.values ~> traversal`](#L-values "L.values: PTraversal {p: a, ...ps} a") <small><sup>v7.3.0</sup></small>

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
const objectTo = C => o => Object.assign(Object.create(C.prototype), o)

L.modify([L.rewrite(objectTo(XYZ)), L.values],
         R.negate,
         new XYZ(1,2,3))
// XYZ { x: -1, y: -2, z: -3 }
```

##### <a id="L-matches-g"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-matches-g) [`L.matches(/.../g) ~> traversal`](#L-matches-g "L.matches: RegExp -> PTraversal String String") <small><sup>v10.4.0</sup></small>

`L.matches`, when given a regular expression with
the
[`global`](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/RegExp/global) flag,
`/.../g`, is a partial traversal over the matches that the regular expression
gives over the focused string.  See also [`L.matches`](#L-matches).

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

#### Folds over traversals

##### <a id="L-all"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-all) [`L.all((maybeValue, index) => testable, traversal, maybeData) ~> boolean`](#L-all "L.all: ((Maybe a, Index) -> Boolean) -> PTraversal s a -> Boolean") <small><sup>v9.6.0</sup></small>

`L.all` determines whether all of the elements focused on by the given traversal
satisfy the given predicate.

For example:

```js
L.all(x => 1 <= x && x <= 6,
      primitives,
      [[[1], 2], {y: 3}, [{l: 4, r: [5]}, {x: 6}]])
// true
```

See also: [`L.any`](#L-any), [`L.none`](#L-none), and [`L.selectAs`](#L-selectAs).

##### <a id="L-and"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-and) [`L.and(traversal, maybeData) ~> boolean`](#L-and "L.and: PTraversal s Boolean -> Boolean") <small><sup>v9.6.0</sup></small>

`L.and` determines whether all of the elements focused on by the given traversal
are truthy.

For example:

```js
L.and(L.elems, [])
// true
```

Note that `L.and` is equivalent to [`L.all(x => x)`](#L-all).  See
also: [`L.or`](#L-or).

##### <a id="L-any"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-any) [`L.any((maybeValue, index) => testable, traversal, maybeData) ~> boolean`](#L-any "L.any: ((Maybe a, Index) -> Boolean) -> PTraversal s a -> Boolean") <small><sup>v9.6.0</sup></small>

`L.any` determines whether any of the elements focused on by the given traversal
satisfy the given predicate.

For example:

```js
L.any(x => x > 5,
      primitives,
      [[[1], 2], {y: 3}, [{l: 4, r: [5]}, {x: 6}]])
// true
```

See also: [`L.all`](#L-all), [`L.none`](#L-none), and [`L.selectAs`](#L-selectAs).

##### <a id="L-collect"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-collect) [`L.collect(traversal, maybeData) ~> [...values]`](#L-collect "L.collect: PTraversal s a -> Maybe s -> [a]") <small><sup>v3.6.0</sup></small>

`L.collect` returns an array of the non-`undefined` elements focused on by the
given traversal or lens from a data structure.

For example:

```js
L.collect(["xs", L.elems, "x"], {xs: [{x: 1}, {x: 2}]})
// [ 1, 2 ]
```

Note that `L.collect` is equivalent to [`L.collectAs(x => x)`](#L-collectAs).

##### <a id="L-collectAs"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-collectAs) [`L.collectAs((maybeValue, index) => maybeValue, traversal, maybeData) ~> [...values]`](#L-collectAs "L.collectAs: ((Maybe a, Index) -> Maybe b) -> PTraversal s a -> Maybe s -> [b]") <small><sup>v7.2.0</sup></small>

`L.collectAs` returns an array of the elements focused on by the given traversal
or lens from a data structure and mapped by the given function to a
non-`undefined` value.

For example:

```js
L.collectAs(R.negate, ["xs", L.elems, "x"], {xs: [{x: 1}, {x: 2}]})
// [ -1, -2 ]
```

`L.collectAs(toMaybe, traversal, maybeData)` is equivalent to
[`L.concatAs(toCollect, Collect, [traversal, toMaybe], maybeData)`](#L-concatAs)
where `Collect` and `toCollect` are defined as follows:

```js
const Collect = {empty: R.always([]), concat: R.concat}
const toCollect = x => x !== undefined ? [x] : []
```

So:

```js
L.concatAs(toCollect,
           Collect,
           ["xs", L.elems, "x", R.negate],
           {xs: [{x: 1}, {x: 2}]})
// [ -1, -2 ]
```

The internal implementation of `L.collectAs` is optimized and faster than the
above naïve implementation.

##### <a id="L-concat"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-concat) [`L.concat(monoid, traversal, maybeData) ~> value`](#L-concat "L.concat: Monoid a -> (PTraversal s a -> Maybe s -> a)") <small><sup>v7.2.0</sup></small>

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

##### <a id="L-concatAs"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-concatAs) [`L.concatAs((maybeValue, index) => value, monoid, traversal, maybeData) ~> value`](#L-concatAs "L.concatAs: ((Maybe a, Index) -> r) -> Monoid r -> (PTraversal s a -> Maybe s -> r)") <small><sup>v7.2.0</sup></small>

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

##### <a id="L-count"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-count) [`L.count(traversal, maybeData) ~> number`](#L-count "L.count: PTraversal s a -> Number") <small><sup>v9.7.0</sup></small>

`L.count` goes through all the elements focused on by the traversal and counts
the number of non-`undefined` elements.

For example:

```js
L.count([L.elems, "x"], [{x: 11}, {y: 12}])
// 1
```

##### <a id="L-countIf"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-countIf) [`L.countIf((maybeValue, index) => testable, traversal, maybeData) ~> number`](#L-countIf "L.countIf: ((Maybe a, Index) -> Boolean) -> PTraversal s a -> Number") <small><sup>v11.2.0</sup></small>

`L.countIf` goes through all the elements focused on by the traversal and counts
the number of elements for which the given predicate returns a truthy value.

For example:

```js
L.countIf(L.isDefined("x"), [L.elems], [{x: 11}, {y: 12}])
// 1
```

##### <a id="L-foldl"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-foldl) [`L.foldl((value, maybeValue, index) => value, value, traversal, maybeData) ~> value`](#L-foldl "L.foldl: ((r, Maybe a, Index) -> r) -> r -> PTraversal s a -> Maybe s -> r") <small><sup>v7.2.0</sup></small>

`L.foldl` performs a fold from left over the elements focused on by the given
traversal.

For example:

```js
L.foldl((x, y) => x + y, 0, L.elems, [1,2,3])
// 6
```

##### <a id="L-foldr"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-foldr) [`L.foldr((value, maybeValue, index) => value, value, traversal, maybeData) ~> value`](#L-foldr "L.foldr: ((r, Maybe a, Index) -> r) -> r -> PTraversal s a -> Maybe s -> r") <small><sup>v7.2.0</sup></small>

`L.foldr` performs a fold from right over the elements focused on by the given
traversal.

For example:

```js
L.foldr((x, y) => x * y, 1, L.elems, [1,2,3])
// 6
```

##### <a id="L-isDefined"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-isDefined) [`L.isDefined(traversal, maybeData) ~> boolean`](#L-isDefined "L.isDefined: PTraversal s a -> Maybe s -> Boolean") <small><sup>v11.8.0</sup></small>

`L.isDefined` determines whether or not the given traversal focuses on any
non-`undefined` element on the given data structure.  When used with a lens,
`L.isDefined` basically allows you to check whether the target of the lens
exists or, in other words, whether the data structure has the targeted element.
See also [`L.isEmpty`](#L-isEmpty).

For example:

```js
L.isDefined("x", {y: 1})
// false
```

##### <a id="L-isEmpty"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-isEmpty) [`L.isEmpty(traversal, maybeData) ~> boolean`](#L-isEmpty "L.isEmpty: PTraversal s a -> Maybe s -> Boolean") <small><sup>v11.5.0</sup></small>

`L.isEmpty` determines whether or not the given traversal focuses on any
elements, `undefined` or otherwise, on the given data structure.  Note that when
used with a lens, `L.isEmpty` always returns `false`, because lenses always have
a single focus.  See also [`L.isDefined`](#L-isDefined).

For example:

```js
L.isEmpty(L.flatten, [[],[[[],[]],[]]])
// true
```

##### <a id="L-join"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-join) [`L.join(string, traversal, maybeData) ~> string`](#L-join "L.join: String -> PTraversal s a -> Maybe s -> String") <small><sup>v11.2.0</sup></small>

`L.join` creates a string by joining the optional elements targeted by the given
traversal with the given delimiter.

```js
L.join(",", [L.elems, "x"], [{x: 1}, {y: 2}, {x: 3}])
// "1,3"
```

##### <a id="L-joinAs"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-joinAs) [`L.joinAs((maybeValue, index) => maybeString, string, traversal, maybeData) ~> string`](#L-joinAs "L.joinAs: ((Maybe a, Index) -> Maybe String) -> String -> PTraversal s a -> Maybe s -> String") <small><sup>v11.2.0</sup></small>

`L.joinAs` creates a string by converting the elements targeted by the given
traversal to optional strings with the given function and then joining those
strings with the given delimiter.

For example:

```js
L.joinAs(JSON.stringify, ",", L.elems, [{x: 1}, {y: 2}])
// '{"x":1},{"y":2}'
```

##### <a id="L-maximum"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-maximum) [`L.maximum(traversal, maybeData) ~> maybeValue`](#L-maximum "L.maximum: Ord a => PTraversal s a -> Maybe s -> Maybe a") <small><sup>v7.2.0</sup></small>

`L.maximum` computes a maximum of the optional elements targeted by the
traversal.

For example:

```js
L.maximum(L.elems, [1,2,3])
// 3
```

Note that elements are ordered according to the `>` operator.

##### <a id="L-maximumBy"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-maximumBy) [`L.maximumBy((maybeValue, index) => maybeKey, traversal, maybeData) ~> maybeValue`](#L-maximumBy "L.maximumBy: Ord k => ((Maybe a, Index) -> Maybe k) -> PTraversal s a -> Maybe s -> Maybe a") <small><sup>v11.2.0</sup></small>

`L.maximumBy` computes a maximum of the elements targeted by the traversal based
on the optional keys returned by the given function.  Elements for which the
returned key is `undefined` are skipped.

For example:

```js
L.maximumBy(R.length, L.elems, ["first", "second", "--||--", "third"])
// "second"
```

Note that keys are ordered according to the `>` operator.

##### <a id="L-mean"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-mean) [`L.mean(traversal, maybeData) ~> number`](#L-mean "L.mean: PTraversal s Number -> Maybe s -> Number") <small><sup>v11.17.0</sup></small>

`L.mean` computes the arithmetic mean of the optional numbers targeted by the
traversal.

For example:

```js
L.mean([L.elems, "x"], [{x: 1}, {ignored: 3}, {x: 2}])
// 1.5
```

##### <a id="L-meanAs"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-meanAs) [`L.meanAs((maybeValue, index) => maybeNumber, traversal, maybeData) ~> number`](#L-meanAs "L.meanAs: ((Maybe a, Index) -> Maybe Number) -> PTraversal s a -> Maybe s -> Number") <small><sup>v11.17.0</sup></small>

`L.meanAs` computes the arithmetic mean of the optional numbers returned by the
given function for the elements targeted by the traversal.

```js
L.meanAs((x, i) => x <= i ? undefined : x, L.elems, [3,1,4,1])
// 3.5
```

##### <a id="L-minimum"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-minimum) [`L.minimum(traversal, maybeData) ~> maybeValue`](#L-minimum "L.minimum: Ord a => PTraversal s a -> Maybe s -> Maybe a") <small><sup>v7.2.0</sup></small>

`L.minimum` computes a minimum of the optional elements targeted by the
traversal.

For example:

```js
L.minimum(L.elems, [1,2,3])
// 1
```

Note that elements are ordered according to the `<` operator.

##### <a id="L-minimumBy"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-minimumBy) [`L.minimumBy((maybeValue, index) => maybeKey, traversal, maybeData) ~> maybeValue`](#L-minimumBy "L.minimumBy: Ord k => ((Maybe a, Index) -> Maybe k) -> PTraversal s a -> Maybe s -> Maybe a") <small><sup>v11.2.0</sup></small>

`L.minimumBy` computes a minimum of the elements targeted by the traversal based
on the optional keys returned by the given function.  Elements for which the
returned key is `undefined` are skipped.

For example:

```js
L.minimumBy(L.get("x"), L.elems, [{x: 1}, {x: -3}, {x: 2}])
// {x: -3}
```

Note that keys are ordered according to the `<` operator.

##### <a id="L-none"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-none) [`L.none((maybeValue, index) => testable, traversal, maybeData) ~> boolean`](#L-none "L.none: ((Maybe a, Index) -> Boolean) -> PTraversal s a -> Boolean") <small><sup>v11.6.0</sup></small>

`L.none` determines whether none of the elements focused on by the given
traversal satisfy the given predicate.

For example:

```js
L.none(x => x > 5,
       primitives,
       [[[1], 2], {y: 3}, [{l: 4, r: [5]}, {x: 6}]])
// false
```

See also: [`L.all`](#L-all), [`L.any`](#L-any), and [`L.selectAs`](#L-selectAs).

##### <a id="L-or"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-or) [`L.or(traversal, maybeData) ~> boolean`](#L-or "L.or: PTraversal s Boolean -> Boolean") <small><sup>v9.6.0</sup></small>

`L.or` determines whether any of the elements focused on by the given traversal
is truthy.

For example:

```js
L.or(L.elems, [])
// false
```

Note that `L.or` is equivalent to [`L.any(x => x)`](#L-any).  See
also: [`L.and`](#L-and).

##### <a id="L-product"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#-product) [`L.product(traversal, maybeData) ~> number`](#L-product "L.product: PTraversal s Number -> Maybe s -> Number") <small><sup>v7.2.0</sup></small>

`L.product` computes the product of the optional numbers targeted by the
traversal.

For example:

```js
L.product(L.elems, [1,2,3])
// 6
```

##### <a id="L-productAs"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#-productAs) [`L.productAs((maybeValue, index) => number, traversal, maybeData) ~> number`](#L-productAs "L.productAs: ((Maybe a, Index) -> Number) -> PTraversal s a -> Maybe s -> Number") <small><sup>v11.2.0</sup></small>

`L.productAs` computes the product of the numbers returned by the given function
for the elements targeted by the traversal.

For example:

```js
L.productAs((x, i) => x + i, L.elems, [3,2,1])
// 27
```

Note that unlike many other folds, `L.productAs` expects the function to only
return numbers and `undefined` is not treated in a special way.  If you need to
skip elements, you can return the number `1`.

##### <a id="L-select"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-select) [`L.select(traversal, maybeData) ~> maybeValue`](#L-select "L.select: PTraversal s a -> Maybe s -> Maybe a") <small><sup>v9.8.0</sup></small>

`L.select` goes lazily over the elements focused on by the given traversal and
returns the first non-`undefined` element.

```js
L.select([L.elems, "y"], [{x:1},{y:2},{z:3}])
// 2
```

Note that `L.select` is equivalent to [`L.selectAs(x => x)`](#L-selectAs).

##### <a id="L-selectAs"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-selectAs) [`L.selectAs((maybeValue, index) => maybeValue, traversal, maybeData) ~> maybeValue`](#L-selectAs "L.selectAs: ((Maybe a, Index) -> Maybe b) -> PTraversal s a -> Maybe s -> Maybe b") <small><sup>v9.8.0</sup></small>

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
const all = (p, t, s) => !L.selectAs(x => p(x) ? undefined : true, t, s)
```

Now:

```js
all(x => x < 9,
    primitives,
    [[[1], 2], {y: 3}, [{l: 4, r: [5]}, {x: 6}]])
// true
```

##### <a id="L-sum"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-sum) [`L.sum(traversal, maybeData) ~> number`](#L-sum "L.sum: PTraversal s Number -> Maybe s -> Number") <small><sup>v7.2.0</sup></small>

`L.sum` computes the sum of the optional numbers targeted by the traversal.

For example:

```js
L.sum(L.elems, [1,2,3])
// 6
```

##### <a id="L-sumAs"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-sumAs) [`L.sumAs((maybeValue, index) => number, traversal, maybeData) ~> number`](#L-sumAs "L.sumAs: ((Maybe a, Index) -> Number) -> PTraversal s a -> Maybe s -> Number") <small><sup>v11.2.0</sup></small>

`L.sumAs` computes the sum of the numbers returned by the given function for the
elements targeted by the traversal.

For example:

```js
L.sumAs((x, i) => x + i, L.elems, [3,2,1])
// 9
```

Note that unlike many other folds, `L.sumAs` expects the function to only return
numbers and `undefined` is not treated in a special way.  If you need to skip
elements, you can return the number `0`.

### Lenses

Lenses always have a single focus which can be [viewed](#L-get) directly.  Put
in another way, a lens specifies a path to a single element in a data structure.

#### Operations on lenses

##### <a id="L-get"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-get) [`L.get(lens, maybeData) ~> maybeValue`](#L-get "L.get: PLens s a -> Maybe s -> Maybe a") <small><sup>v2.2.0</sup></small>

`L.get` returns the element focused on by a [lens](#lenses) from a data
structure.

For example:

```js
L.get("y", {x: 112, y: 101})
// 101
```

Note that `L.get` does not work on [traversals](#traversals).

#### Creating new lenses

##### <a id="L-lens"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-lens) [`L.lens((maybeData, index) => maybeValue, (maybeValue, maybeData, index) => maybeData) ~> lens`](#L-lens "L.lens: ((Maybe s, Index) -> Maybe a) -> ((Maybe a, Maybe s, Index) -> Maybe s) -> PLens s a") <small><sup>v1.0.0</sup></small>

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

##### <a id="L-setter"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-setter) [`L.setter((maybeValue, maybeData, index) => maybeData) ~> lens`](#L-setter "L.setter: ((Maybe a, Maybe s, Index) -> Maybe s) -> PLens s a") <small><sup>v10.3.0</sup></small>

`L.setter(set)` is shorthand for [`L.lens(x => x, set)`](#L-lens).

##### <a id="L-foldTraversalLens"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-foldTraversalLens) [`L.foldTraversalLens((traversal, maybeData) ~> maybeValue, traversal) ~> lens`](#L-foldTraversalLens "L.foldTraversalLens: (PTraversal s a -> Maybe s -> Maybe a) -> PTraversal s a -> PLens s a") <small><sup>v11.5.0</sup></small>

`L.foldTraversalLens` creates a lens from a fold and a traversal.  To make
sense, the fold should compute or pick a representative from the elements
focused on by the traversal such that when all the elements are equal then so is
the representative.

For example:

```js
L.get(L.foldTraversalLens(L.minimum, L.elems), [3,1,4])
// 1
```

```js
L.set(L.foldTraversalLens(L.minimum, L.elems), 2, [3,1,4])
// [ 2, 2, 2 ]
```

See the [Collection toggle](#collection-toggle) section for a more interesting
example.

#### Computing derived props

##### <a id="L-augment"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-augment) [`L.augment({prop: object => value, ...props}) ~> lens`](#L-augment "L.augment: {p1: o -> a1, ...ps} -> PLens {...o} {...o, p1: a1, ...ps}") <small><sup>v1.1.0</sup></small>

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

##### <a id="L-defaults"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-defaults) [`L.defaults(valueIn) ~> lens`](#L-defaults "L.defaults: s -> PLens s s") <small><sup>v2.0.0</sup></small>

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

##### <a id="L-define"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-define) [`L.define(value) ~> lens`](#L-define "L.define: s -> PLens s s") <small><sup>v1.0.0</sup></small>

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

##### <a id="L-normalize"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-normalize) [`L.normalize((value, index) => maybeValue) ~> lens`](#L-normalize "L.normalize: ((s, Index) -> Maybe s) -> PLens s s") <small><sup>v1.0.0</sup></small>

`L.normalize` maps the value with same given transform when viewed and set and
implicitly maps `undefined` to `undefined`.

One use case for `normalize` is to make it easy to determine whether, after a
change, the data has actually changed.  By keeping the data normalized, a
simple [`R.equals`](http://ramdajs.com/docs/#equals) comparison will do.

Note that the difference between `L.normalize` and [`L.rewrite`](#L-rewrite) is
that `L.normalize` applies the transform in both directions
while [`L.rewrite`](#L-rewrite) only applies the transform when writing.

##### <a id="L-required"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-required) [`L.required(valueOut) ~> lens`](#L-required "L.required: s -> PLens s s") <small><sup>v1.0.0</sup></small>

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

##### <a id="L-rewrite"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-rewrite) [`L.rewrite((valueOut, index) => maybeValueOut) ~> lens`](#L-rewrite "L.rewrite: ((s, Index) -> Maybe s) -> PLens s s") <small><sup>v5.1.0</sup></small>

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

##### <a id="L-append"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-append) [`L.append ~> lens`](#L-append "L.append: PLens [a] a") <small><sup>v1.0.0</sup></small>

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

##### <a id="L-filter"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-filter) [`L.filter((maybeValue, index) => testable) ~> lens`](#L-filter "L.filter: ((Maybe a, Index) -> Boolean) -> PLens [a] [a]") <small><sup>v1.0.0</sup></small>

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

##### <a id="L-find"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-find) [`L.find((maybeValue, index) => testable) ~> lens`](#L-find "L.find: ((Maybe a, Index) -> Boolean) -> PLens [a] a") <small><sup>v1.0.0</sup></small>

`L.find` operates on [array-like](#array-like) objects
like [`L.index`](#L-index), but the index to be viewed is determined by finding
the first element from the focus that matches the given predicate.  When no
matching element is found the effect is same as with [`L.append`](#L-append).

```js
L.remove(L.find(x => x <= 2), [3,1,4,1,5,9,2])
// [ 3, 4, 1, 5, 9, 2 ]
```

##### <a id="L-findHint"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-findHint) [`L.findHint((maybeValue, {hint: index}) => testable, {hint: index}) ~> lens`](#L-findHint "L.findHint: ((Maybe a, {hint: Index}) -> Boolean, {hint: Index}) -> PLens [a] a") <small><sup>v10.1.0</sup></small>

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

##### <a id="L-findWith"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-findWith) [`L.findWith(...optics) ~> optic`](#L-findWith "L.findWith: (POptic s s1, ...POptic sN a) -> POptic [s] a") <small><sup>v1.0.0</sup></small>

`L.findWith(...optics)` chooses an index from an [array-like](#array-like)
object through which the given optic, [`[...optics]`](#L-compose), has a
non-`undefined` view and then returns an optic that focuses on that.

For example:

```js
L.get(L.findWith("x"), [{z: 6}, {x: 9}, {y: 6}])
// 9
```
```js
L.set(L.findWith("x"), 3, [{z: 6}, {x: 9}, {y: 6}])
// [ { z: 6 }, { x: 3 }, { y: 6 } ]
```

##### <a id="L-index"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-index) [`L.index(elemIndex) ~> lens`](#L-index "L.index: Integer -> PLens [a] a") or `elemIndex` <small><sup>v1.0.0</sup></small>

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

##### <a id="L-last"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-last) [`L.last ~> lens`](#L-last "L.last: PLens [a] a") <small><sup>v9.8.0</sup></small>

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

##### <a id="L-prefix"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-prefix) [`L.prefix(maybeBegin) ~> lens`](#L-prefix "L.prefix: Maybe Number -> PLens [a] [a]") <small><sup>v11.12.0</sup></small>

`L.prefix` focuses on a range of elements of an [array-like](#array-like) object
starting from the beginning of the object.  `L.prefix` is a special case of
[`L.slice`](#L-slice).

The end of the range is determined as follows:

- non-negative values are relative to the beginning of the array-like object,
- `Infinity` is the end of the array-like object,
- negative values are relative to the end of the array-like object,
- `-Infinity` is the beginning of the array-like object, and
- `undefined` is the end of the array-like object.

For example:

```js
L.set(L.prefix(0), [1], [2, 3])
// [ 1, 2, 3 ]
```

##### <a id="L-slice"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-slice) [`L.slice(maybeBegin, maybeEnd) ~> lens`](#L-slice "L.slice: Maybe Number -> Maybe Number -> PLens [a] [a]") <small><sup>v8.1.0</sup></small>

`L.slice` focuses on a specified range of elements of
an [array-like](#array-like) object.  See also [`L.prefix`](#L-prefix)
and [`L.suffix`](#L-suffix).

The range is determined like with the
standard
[`slice`](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/slice) method
of arrays:

- non-negative values are relative to the beginning of the array-like object,
- `Infinity` is the end of the array-like object,
- negative values are relative to the end of the array-like object,
- `-Infinity` is the beginning of the array-like object, and
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

##### <a id="L-suffix"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-suffix) [`L.suffix(maybeEnd) ~> lens`](#L-prefix "L.prefix: Maybe Number -> PLens [a] [a]") <small><sup>v11.12.0</sup></small>

`L.suffix` focuses on a range of elements of an [array-like](#array-like) object
starting from the end of the object.  `L.suffix` is a special case
of [`L.slice`](#L-slice).

The beginning of the range is determined as follows:

- non-negative values are relative to the end of the array-like object,
- `Infinity` is the beginning of the array-like object,
- negative values are relative to the beginning of the array-like object,
- `-Infinity` is the end of the array-like object, and
- `undefined` is the beginning of the array-like object.

Note that the rules above are different from the rules for determining the
beginning of [`L.slice`](#L-slice).

For example:

```js
L.set(L.suffix(1), [4, 1], [3, 1, 3])
// [ 3, 1, 4, 1 ]
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

##### <a id="L-pickIn"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-pickIn) [`L.pickIn({prop: lens, ...props}) ~> lens`](#L-pickIn "L.pickIn: {p1: PLens s1 a1, ...pls} -> PLens {p1: s1, ...pls} {p1: a1, ...pls}") <small><sup>v11.11.0</sup></small>

`L.pickIn` creates a lens from the given possibly nested object template of
lenses similar to [`L.pick`](#L-pick) except that the lenses in the template are
relative to their path in the template.  This means that using `L.pickIn` you
can effectively create a kind of filter for a nested object structure.  See
also [`L.props`](#L-props).

For example:

```js
L.get(L.pickIn({meta: {file: [], ext: []}}),
      {meta: {file: "./foo.txt", base: "foo", ext: "txt"}})
// { meta: { file: './foo.txt', ext: 'txt' } }
```

##### <a id="L-prop"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-prop) [`L.prop(propName) ~> lens`](#L-prop "L.prop: (p: a) -> PLens {p: a, ...ps} a") or `propName` <small><sup>v1.0.0</sup></small>

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

##### <a id="L-props"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-props) [`L.props(...propNames) ~> lens`](#L-props "L.props: (p1: a1, ...ps) -> PLens {p1: a1, ...ps, ...o} {p1: a1, ...ps}") <small><sup>v1.4.0</sup></small>

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
kN})`](#L-pick) and [`L.pickIn({[k1]: [], ..., [kN]: []})`](#L-pickIn).

##### <a id="L-propsOf"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-propsOf) [`L.propsOf(object) ~> lens`](#L-propsOf "L.propsOf: {p1: a1, ...ps} -> PLens {p1: a1, ...ps, ...o} {p1: a1, ...ps}") <small><sup>v11.13.0</sup></small>

`L.propsOf(o)` is shorthand for [`L.props(...Object.keys(o))`](#L-props)
allowing one to focus on the properties specified via the given sample object.

##### <a id="L-removable"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-removable) [`L.removable(...propNames) ~> lens`](#L-removable "L.removable: (p1: a1, ...ps) -> PLens {p1: a1, ...ps, ...o} {p1: a1, ...ps, ...o}") <small><sup>v9.2.0</sup></small>

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
[`rewrite(y => y instanceof Object && !L.get(L.props(...ps), y) ? undefined : y)`](#L-rewrite).

Also note that, in a composition, `L.removable` is likely preceded
by [`L.valueOr`](#L-valueOr) (or [`L.defaults`](#L-defaults)) like in
the [tutorial](#tutorial) example.  In such a pair, the preceding lens gives a
default value when reading through the lens, allowing one to use such a lens to
insert new objects.  The following lens then specifies that removing the then
focused property (or properties) should remove the whole object.  In cases where
the shape of the incoming object is know, [`L.defaults`](#L-defaults) can
replace such a pair.

#### Lensing strings

##### <a id="L-matches"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-matches) [`L.matches(/.../) ~> lens`](#L-matches "L.matches: RegExp -> PLens String String") <small><sup>v10.4.0</sup></small>

`L.matches`, when given a regular expression without
the
[`global`](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/RegExp/global) flags,
`/.../`, is a partial lens over the match.  When there is no match, or the
target is not a string, then `L.matches` will be read-only.  See
also [`L.matches`](#L-matches-g).

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

##### <a id="L-valueOr"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-valueOr) [`L.valueOr(valueOut) ~> lens`](#L-valueOr "L.valueOr: s -> PLens s s") <small><sup>v3.5.0</sup></small>

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

#### Transforming data

##### <a id="L-pick"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-pick) [`L.pick({prop: lens, ...props}) ~> lens`](#L-pick "L.pick: {p1: PLens s a1, ...pls} -> PLens s {p1: a1, ...pls}") <small><sup>v1.2.0</sup></small>

`L.pick` creates a lens out of the given possibly nested object template of
lenses and allows one to pick apart a data structure and then put it back
together.  When viewed, an object is created, whose properties are obtained by
viewing through the lenses of the template.  When set with an object, the
properties of the object are set to the context via the lenses of the template.
`undefined` is treated as the equivalent of empty or non-existent in both
directions.

For example, let's say we need to deal with data and schema in need of some
semantic restructuring:

```js
const sampleFlat = {px: 1, py: 2, vx: 1, vy: 0}
```

We can use `L.pick` to create a lens to pick apart the data and put it back
together into a more meaningful structure:

```js
const sanitize = L.pick({pos: {x: "px", y: "py"},
                         vel: {x: "vx", y: "vy"}})
```

Note that in the template object the lenses are relative to the root focus of
`L.pick`.

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

Note that the `sanitize` lens defined above can also been seen as an
[isomorphism](#isomorphisms) between the "flat" and "nested" forms of the data.
It can even be inverted using [`L.inverse`](#L-inverse):

```js
L.get(L.inverse(sanitize), {pos: {x: 1, y: 2}, vel: {x: 1, y: 0}})
// { px: 1, py: 2, vx: 1, vy: 0 }
```

##### <a id="L-replace"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-replace) [`L.replace(maybeValueIn, maybeValueOut) ~> lens`](#L-replace "L.replace: Maybe s -> Maybe s -> PLens s s") <small><sup>v1.0.0</sup></small>

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

In this library there is no type distinction between partial lenses and partial
isomorphisms.  Among other things this means that some lens combinators, such as
[`L.pick`](#L-pick), can also be used to create isomorphisms.  On the other
hand, some forms of optic composition, particularly [adapting](#adapting) and
[querying](#querying), do not work properly on (inverted) isomorphisms.

#### Operations on isomorphisms

##### <a id="L-getInverse"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-getInverse) [`L.getInverse(isomorphism, maybeData) ~> maybeData`](#L-getInverse "L.getInverse: PIso a b -> Maybe b -> Maybe a") <small><sup>v5.0.0</sup></small>

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

##### <a id="L-iso"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-iso) [`L.iso(maybeData => maybeValue, maybeValue => maybeData) ~> isomorphism`](#L-iso "L.iso: (Maybe s -> Maybe a) -> (Maybe a -> Maybe s) -> PIso s a") <small><sup>v5.3.0</sup></small>

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

##### <a id="L-inverse"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-inverse) [`L.inverse(isomorphism) ~> isomorphism`](#L-inverse "L.inverse: PIso a b -> PIso b a") <small><sup>v4.1.0</sup></small>

`L.inverse` returns the inverse of the given isomorphism.  Note that this
operation only makes sense on isomorphisms.

For example:

```js
L.get(L.inverse(offBy1), 1)
// 0
```

#### Basic isomorphisms

##### <a id="L-identity"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-identity) [`L.identity ~> isomorphism`](#L-identity "L.identity: PIso s s") <small><sup>v1.3.0</sup></small>

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

##### <a id="L-complement"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-complement) [`L.complement ~> isomorphism`](#L-complement "L.complement: PIso Boolean Boolean") <small><sup>v9.7.0</sup></small>

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

##### <a id="L-is"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-is) [`L.is(value) ~> isomorphism`](#L-is "L.is: v -> PIso v Boolean") <small><sup>v11.1.0</sup></small>

`L.is` reads the given value as `true` and everything else as `false` and writes
`true` as the given value and everything else as `undefined`.
See [here](#an-array-of-ids-as-boolean-flags) for an example.

#### Standard isomorphisms

##### <a id="L-uri"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-uri) [`L.uri ~> isomorphism`](#L-uri "L.uri: PIso String String") <small><sup>v11.3.0</sup></small>

`L.uri` is an isomorphism based on the
standard
[`decodeURI`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/decodeURI) and
[`encodeURI`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURI) functions.

##### <a id="L-uriComponent"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-uriComponent) [`L.uriComponent ~> isomorphism`](#L-uriComponent "L.uriComponent: PIso String String") <small><sup>v11.3.0</sup></small>

`L.uriComponent` is an isomorphism based on the
standard
[`decodeURIComponent`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/decodeURIComponent) and
[`encodeURIComponent`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent) functions.

##### <a id="L-json"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-json) [`L.json({reviver, replacer, space}) ~> isomorphism`](#L-json "L.json: {reviver, replacer, space} -> PIso String JSON") <small><sup>v11.3.0</sup></small>

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

####  <a id="L-seemsArrayLike"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/#L-seemsArrayLike) [`L.seemsArrayLike(anything) ~> boolean`](#L-seemsArrayLike "L.seemsArrayLike: any -> Boolean") <small><sup>v11.4.0</sup></small>

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
traversals using [`L.foldTraversalLens`](#L-foldTraversalLens):

```js
const selectAll = L.foldTraversalLens(L.and)
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

We can.  The [`L.iftes`](#L-iftes) combinator allows for dynamic selection of
lenses based on examining the data structure being manipulated.
Using [`L.iftes`](#L-iftes) we can write the ordinary BST logic to pick the
correct branch based on the key in the currently examined node and the key that
we are looking for.  So, here is our first attempt at a BST lens:

```js
const searchAttempt = key => L.lazy(rec => [
  L.iftes(n => !n || key === n.key, L.defaults({key}),
          n => key < n.key,         ["smaller", rec],
          ["greater", rec])])

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
const search = key => L.lazy(rec => [
  naiveBST,
  L.iftes(n => !n || key === n.key, L.defaults({key}),
          n => key < n.key,         ["smaller", rec],
          ["greater", rec])])

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

What about [traversals](#traversals) over BSTs?  We can use
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

## Advanced topics

### Performance tips

#### Nesting traversals does not create intermediate aggregates

Consider the following naïve use of [Ramda](http://ramdajs.com/):

```js
const sumPositiveXs = R.pipe(R.flatten,
                             R.map(R.prop("x")),
                             R.filter(R.lt(0)),
                             R.sum)

const sampleXs = [[{x: 1}], [{x: -2}, {x: 2}]]

sumPositiveXs(sampleXs)
// 3
```

A performance problem in the above naïve `sumPositiveXs` function is that aside
from the last step, `R.sum`, every step of the computation, `R.flatten`,
`R.map(R.prop("x"))`, and `R.filter(R.lt(0))`, creates an intermediate array
that is only used by the next step of the computation and is then thrown away.
When dealing with large amounts of data this kind of composition can cause
performance issues.

Please note that the above example is *intentionally naïve*.  In Ramda [one can
use transducers to avoid building such intermediate
results](http://simplectic.com/blog/2015/ramda-transducers-logs/) although in
this particular case the use of [`R.flatten`](http://ramdajs.com/docs/#flatten)
makes things a bit more interesting, because it doesn't (at the time of writing)
act as a transducer in Ramda (version 0.24.1).

Using traversals one could perform the same summations as

```js
L.sum([L.flatten, "x", L.when(R.lt(0))], sampleXs)
// 3
```

and, thankfully, it doesn't create intermediate arrays.  This is the case with
traversals in general.  Traversals do not materialize intermediate aggregates
and it is useful to understand this performance characteristic.

#### Avoid reallocating optics in [`L.choose`](#L-choose)

Consider the following example:

```jsx
L.choose(x => Array.isArray(x) ? [L.elems, "data"] : "data")
```

A performance issue with the above is that each time it is used on an array, a
new composition, `[L.elems, "data"]`, is allocated.  Performance may be improved
by moving the allocation outside of [`L.choose`](#L-choose):

```jsx
const onArray = [L.elems, "data"]
L.choose(x => Array.isArray(x) ? onArray : "data")
```

In cases like above you can also use the more restricted [`L.iftes`](#L-iftes)
combinator:

```jsx
L.iftes(Array.isArray, [L.elems, "data"], "data")
```

This has the advantage that the optics are constructed only once.

### On bundle size and minification

The distribution of this library includes
a
[prebuilt and minified browser bundle](https://unpkg.com/partial.lenses/dist/partial.lenses.min.js).
However, this library is not designed to be primarily used via that bundle.
Rather, this library is bundled with [Rollup](https://rollupjs.org/), uses
`/*#__PURE__*/` annotations to
help [UglifyJS](https://github.com/mishoo/UglifyJS2) do better dead code
elimination, and uses `process.env.NODE_ENV` to detect `"production"` mode to
discard some warnings and error checks.  This means that when using Rollup
with [replace](https://github.com/rollup/rollup-plugin-replace)
and [uglify](https://github.com/TrySound/rollup-plugin-uglify) plugins to build
browser bundles, the generated bundles will basically only include what you use
from this library.

For best results, increasing the number of compression passes may allow UglifyJS
to eliminate more dead code.  Here is a sample snippet from a Rollup config:

```jsx
import replace from "rollup-plugin-replace"
import uglify  from "rollup-plugin-uglify"
// ...

export default {
  plugins: [
    replace({
      "process.env.NODE_ENV": JSON.stringify("production")
    }),
    // ...
    uglify({
      compress: {
        passes: 3
      }
    })
  ]
}
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

### Benchmarks

Here are a few benchmark results on partial lenses (as `L` version 11.7.1) and
some roughly equivalent operations using [Ramda](http://ramdajs.com/) (as `R`
version 0.23.0), [Ramda Lens](https://github.com/ramda/ramda-lens) (as `P`
version 0.1.1), [Flunc Optics](https://github.com/flunc/optics) (as `O` version
0.0.2), [Optika](https://github.com/phadej/optika) (as `K` version 0.0.2),
and [lodash.get](https://www.npmjs.com/package/lodash.get) (as `_get` version
4.4.2).  As always with benchmarks, you should take these numbers with a pinch
of salt and preferably try and measure your actual use cases!

```jsx
  22,340,825/s     1.00x   L.get(L_findHint_id_5000, ids)

   6,810,637/s     1.00x   R.reduceRight(add, 0, xs100)
     423,028/s    16.10x   L.foldr(add, 0, L.elems, xs100)
       4,105/s  1659.26x   O.Fold.foldrOf(O.Traversal.traversed, addC, 0, xs100)

      11,245/s     1.00x   R.reduceRight(add, 0, xs100000)
          55/s   203.84x   L.foldr(add, 0, L.elems, xs100000)
           0/s Infinityx   O.Fold.foldrOf(O.Traversal.traversed, addC, 0, xs100000) -- STACK OVERFLOW

     693,671/s     1.00x   L.foldl(add, 0, L.elems, xs100)
     210,310/s     3.30x   R.reduce(add, 0, xs100)
       2,846/s   243.70x   O.Fold.foldlOf(O.Traversal.traversed, addC, 0, xs100)

   3,408,795/s     1.00x   L.sum(L.elems, xs100)
   2,751,043/s     1.24x   K.traversed().sumOf(xs100)
     498,397/s     6.84x   L.concat(Sum, L.elems, xs100)
     189,138/s    18.02x   xs100.reduce((a, b) => a + b, 0)
     126,016/s    27.05x   R.sum(xs100)
      22,786/s   149.60x   P.sumOf(P.traversed, xs100)
       4,354/s   782.85x   O.Fold.sumOf(O.Traversal.traversed, xs100)

     566,456/s     1.00x   L.maximum(L.elems, xs100)
       3,268/s   173.35x   O.Fold.maximumOf(O.Traversal.traversed, xs100)

     137,786/s     1.00x   L.sum([L.elems, L.elems, L.elems], xsss100)
     134,226/s     1.03x   L.concat(Sum, [L.elems, L.elems, L.elems], xsss100)
       4,470/s    30.83x   P.sumOf(R.compose(P.traversed, P.traversed, P.traversed), xsss100)
         855/s   161.08x   O.Fold.sumOf(R.compose(O.Traversal.traversed, O.Traversal.traversed, O.Traversal.traversed), xsss100)

   3,063,115/s     1.00x   K.traversed().arrayOf(xs100)
     264,515/s    11.58x   L.collect(L.elems, xs100)
      28,117/s   108.94x   xs100.map(I.id)
       3,431/s   892.89x   O.Fold.toListOf(O.Traversal.traversed, xs100)

     111,515/s     1.00x   L.collect([L.elems, L.elems, L.elems], xsss100)
      27,156/s     4.11x   K.traversed().traversed().traversed().arrayOf(xsss100)
      26,489/s     4.21x   (() => { let acc = []; xsss100.forEach(x0 => { x0.forEach(x1 => { acc = acc.concat(x1); })}); return acc; })()
       9,809/s    11.37x   R.chain(R.chain(R.identity), xsss100)
         811/s   137.48x   O.Fold.toListOf(R.compose(O.Traversal.traversed, O.Traversal.traversed, O.Traversal.traversed), xsss100)

      65,860/s     1.00x   R.flatten(xsss100)
      32,578/s     2.02x   L.collect(flatten, xsss100)

  15,178,735/s     1.00x   L.modify(L.elems, inc, xs)
   1,908,401/s     7.95x   R.map(inc, xs)
     866,990/s    17.51x   xs.map(inc)
     419,944/s    36.14x   P.over(P.traversed, inc, xs)
     414,330/s    36.63x   K.traversed().over(xs, inc)
     386,661/s    39.26x   O.Setter.over(O.Traversal.traversed, inc, xs)

     421,617/s     1.00x   L.modify(L.elems, inc, xs1000)
     118,199/s     3.57x   R.map(inc, xs1000)
       2,821/s   149.48x   xs1000.map(inc)
       2,804/s   150.35x   K.traversed().over(xs1000, inc)
         381/s  1105.29x   O.Setter.over(O.Traversal.traversed, inc, xs1000) -- QUADRATIC
         364/s  1157.54x   P.over(P.traversed, inc, xs1000) -- QUADRATIC

     154,255/s     1.00x   L.modify([L.elems, L.elems, L.elems], inc, xsss100)
      10,075/s    15.31x   R.map(R.map(R.map(inc)), xsss100)
       8,021/s    19.23x   xsss100.map(x0 => x0.map(x1 => x1.map(inc)))
       7,930/s    19.45x   K.traversed().traversed().traversed().over(xsss100, inc)
       3,521/s    43.82x   P.over(R.compose(P.traversed, P.traversed, P.traversed), inc, xsss100)
       2,901/s    53.18x   O.Setter.over(R.compose(O.Traversal.traversed, O.Traversal.traversed, O.Traversal.traversed), inc, xsss100)

  35,926,652/s     1.00x   L.get(1, xs)
  26,450,788/s     1.36x   _get(xs, 1)
   3,911,048/s     9.19x   R.nth(1, xs)
   1,598,498/s    22.48x   R.view(l_1, xs)
     775,451/s    46.33x   K.idx(1).get(xs)

  55,427,847/s     1.00x   L_get_1(xs)
  20,448,553/s     2.71x   L.get(1)(xs)
   3,845,738/s    14.41x   R_nth_1(xs)
   2,713,357/s    20.43x   R.nth(1)(xs)

  23,951,414/s     1.00x   L.set(1, 0, xs)
   6,806,441/s     3.52x   R.update(1, 0, xs)
   5,872,301/s     4.08x   (() => { let ys = xs.slice(); ys[1] = 0; return ys; })()
     983,695/s    24.35x   R.set(l_1, 0, xs)
     820,935/s    29.18x   xs.map((x, i) => i === 1 ? 0 : x)
     536,599/s    44.64x   K.idx(1).set(xs, 0)

  39,659,146/s     1.00x   L.get("y", xyz)
  26,664,449/s     1.49x   R.prop("y", xyz)
  10,143,058/s     3.91x   _get(xyz, "y")
   2,549,710/s    15.55x   R.view(l_y, xyz)
     703,362/s    56.39x   K.key("y").get(xyz)

  68,949,308/s     1.00x   L_get_y(xyz)
  22,483,723/s     3.07x   R_prop_y(xyz)
  19,751,691/s     3.49x   L.get("y")(xyz)
   9,009,383/s     7.65x   R.prop("y")(xyz)

  11,569,677/s     1.00x   R.assoc("y", 0, xyz)
  11,093,933/s     1.04x   L.set("y", 0, xyz)
   1,344,722/s     8.60x   R.set(l_y, 0, xyz)
     557,467/s    20.75x   K.key("y").set(xyz, 0)

  15,262,027/s     1.00x   L.get([0,"x",0,"y"], axay)
  14,907,248/s     1.02x   R.path([0,"x",0,"y"], axay)
  12,702,608/s     1.20x   _get(axay, [0,"x",0,"y"])
   2,381,364/s     6.41x   R.view(l_0x0y, axay)
     486,335/s    31.38x   R.view(l_0_x_0_y, axay)
     208,374/s    73.24x   K.idx(0).key("x").idx(0).key("y").get(axay)

   3,976,228/s     1.00x   L.set([0,"x",0,"y"], 0, axay)
     963,482/s     4.13x   R.assocPath([0,"x",0,"y"], 0, axay)
     539,717/s     7.37x   R.set(l_0x0y, 0, axay)
     336,600/s    11.81x   R.set(l_0_x_0_y, 0, axay)
     166,457/s    23.89x   K.idx(0).key("x").idx(0).key("y").set(axay, 0)

   3,940,376/s     1.00x   L.modify([0,"x",0,"y"], inc, axay)
     608,097/s     6.48x   R.over(l_0x0y, inc, axay)
     354,775/s    11.11x   R.over(l_0_x_0_y, inc, axay)
     170,534/s    23.11x   K.idx(0).key("x").idx(0).key("y").over(axay, inc)

  24,865,101/s     1.00x   L.remove(1, xs)
   3,236,318/s     7.68x   R.remove(1, 1, xs)

  10,992,174/s     1.00x   L.remove("y", xyz)
   2,699,520/s     4.07x   R.dissoc("y", xyz)

  17,152,581/s     1.00x   L.get(["x","y","z"], xyzn)
  15,482,471/s     1.11x   _get(xyzn, ["x", "y", "z"])
  14,970,587/s     1.15x   R.path(["x","y","z"], xyzn)
   2,385,382/s     7.19x   R.view(l_xyz, xyzn)
     849,966/s    20.18x   R.view(l_x_y_z, xyzn)
     268,601/s    63.86x   K.key("x").key("y").key("z").get(xyzn)
     164,899/s   104.02x   O.Getter.view(o_x_y_z, xyzn)

   4,684,524/s     1.00x   L.set(["x","y","z"], 0, xyzn)
   1,901,101/s     2.46x   R.assocPath(["x","y","z"], 0, xyzn)
     855,120/s     5.48x   R.set(l_xyz, 0, xyzn)
     585,778/s     8.00x   R.set(l_x_y_z, 0, xyzn)
     225,883/s    20.74x   K.key("x").key("y").key("z").set(xyzn, 0)
     212,988/s    21.99x   O.Setter.set(o_x_y_z, 0, xyzn)

   1,040,171/s     1.00x   R.find(x => x > 3, xs100)
     586,345/s     1.77x   L.selectAs(x => x > 3 ? x : undefined, L.elems, xs100)
       2,768/s   375.80x   O.Fold.findOf(O.Traversal.traversed, x => x > 3, xs100)

   7,296,500/s     1.00x   L.selectAs(x => x < 3 ? x : undefined, L.elems, xs100)
   3,802,052/s     1.92x   R.find(x => x < 3, xs100)
       2,723/s  2679.70x   O.Fold.findOf(O.Traversal.traversed, x => x < 3, xs100) -- NO SHORTCUT EVALUATION

   3,934,177/s     1.00x   L.remove(50, xs100)
   1,828,554/s     2.15x   R.remove(50, 1, xs100)

   4,290,425/s     1.00x   L.set(50, 2, xs100)
   1,686,594/s     2.54x   R.update(50, 2, xs100)
     681,526/s     6.30x   R.set(l_50, 2, xs100)
     473,739/s     9.06x   K.idx(50).set(xs100, 2)
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

* [A Little Lens Starter Tutorial](https://www.schoolofhaskell.com/school/to-infinity-and-beyond/pick-of-the-week/a-little-lens-starter-tutorial)
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
* [ochafik/es6-lenses](https://github.com/ochafik/es6-lenses)
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
