# <a id="partial-lenses"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#) [Partial Lenses](#partial-lenses) &middot; [![Gitter](https://img.shields.io/gitter/room/calmm-js/chat.js.svg)](https://gitter.im/calmm-js/chat) [![GitHub stars](https://img.shields.io/github/stars/calmm-js/partial.lenses.svg?style=social)](https://github.com/calmm-js/partial.lenses) [![npm](https://img.shields.io/npm/dm/partial.lenses.svg)](https://www.npmjs.com/package/partial.lenses)

Lenses are basically an abstraction for simultaneously specifying operations to
[update](#l-modify) and [query](#l-get) [immutable](#on-immutability) data
structures.  Lenses are [highly composable](#on-composability) and can be
[efficient](#benchmarks).  This library provides a [rich
collection](#on-bundle-size-and-minification) of [partial](#on-partiality)
[isomorphisms](#isomorphisms), [lenses](#lenses), and [traversals](#traversals),
collectively known as [optics](#optics), for manipulating
[JSON](http://json.org/) and users [can](#l-tofunction) [write](#l-iso)
[new](#l-lens) [optics](#l-branch) for manipulating non-JSON objects, such as
[Immutable.js](#interfacing) collections.  A partial lens can *view* optional
data, *insert* new data, *update* existing data and *remove* existing data and
can, for example, provide *defaults* and maintain *required* data structure
parts.  [Try Lenses!](https://calmm-js.github.io/partial.lenses/playground.html)

[![npm version](https://badge.fury.io/js/partial.lenses.svg)](http://badge.fury.io/js/partial.lenses)
[![Bower version](https://badge.fury.io/bo/partial.lenses.svg)](https://badge.fury.io/bo/partial.lenses)
[![Build Status](https://travis-ci.org/calmm-js/partial.lenses.svg?branch=master)](https://travis-ci.org/calmm-js/partial.lenses)
[![Code Coverage](https://img.shields.io/codecov/c/github/calmm-js/partial.lenses/master.svg)](https://codecov.io/github/calmm-js/partial.lenses?branch=master)
[![](https://david-dm.org/calmm-js/partial.lenses.svg)](https://david-dm.org/calmm-js/partial.lenses)
[![](https://david-dm.org/calmm-js/partial.lenses/dev-status.svg)](https://david-dm.org/calmm-js/partial.lenses?type=dev)

## <a id="contents"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#contents) [Contents](#contents)

* [Tutorial](#tutorial)
  * [Getting started](#getting-started)
  * [A partial lens to access title texts](#a-partial-lens-to-access-titles)
    * [Querying data](#querying-data)
      * [Missing data can be expected](#missing-data-can-be-expected)
    * [Updating data](#updating-data)
    * [Inserting data](#inserting-data)
    * [Removing data](#removing-data)
    * [Exercises](#exercises)
  * [Shorthands](#shorthands)
  * [Systematic decomposition](#systematic-decomposition)
  * [Manipulating multiple items](#manipulating-multiple-items)
  * [Next steps](#next-steps)
* [The why of optics](#the-why-of-optics)
* [Reference](#reference)
  * [Stable subset](#stable-subset)
  * [Additional libraries](#additional-libraries)
  * [Optics](#optics)
    * [On partiality](#on-partiality)
    * [On indexing](#on-indexing)
    * [On immutability](#on-immutability)
    * [On composability](#on-composability)
    * [On lens laws](#on-lens-laws)
      * [Myth: Partial Lenses are not lawful](#myth-partial-lenses-are-not-lawful)
    * [Operations on optics](#operations-on-optics)
      * [`L.assign(optic, object, maybeData) ~> maybeData`](#l-assign "L.assign: PLens s {p1: a1, ...ps, ...o} -> {p1: a1, ...ps} -> Maybe s -> Maybe s") <small><sup>v11.13.0</sup></small>
      * [`L.disperse(optic, [...maybeValues], maybeData) ~> maybeData`](#l-disperse "L.disperse: POptic s a -> Maybe [Maybe a] -> Maybe s -> Maybe s") <small><sup>v14.6.0</sup></small>
      * [`L.modify(optic, (maybeValue, index) => maybeValue, maybeData) ~> maybeData`](#l-modify "L.modify: POptic s a -> ((Maybe a, Index) -> Maybe a) -> Maybe s -> Maybe s") <small><sup>v2.2.0</sup></small>
      * [`L.modifyAsync(optic, (maybeValue, index) => maybeValuePromise, maybeData) ~> maybeDataPromise`](#l-modifyasync "L.modifyAsync: POptic s a -> ((Maybe a, Index) -> Promise (Maybe a)) -> Maybe s -> Promise (Maybe s)") <small><sup>v13.12.0</sup></small>
      * [`L.remove(optic, maybeData) ~> maybeData`](#l-remove "L.remove: POptic s a -> Maybe s -> Maybe s") <small><sup>v2.0.0</sup></small>
      * [`L.set(optic, maybeValue, maybeData) ~> maybeData`](#l-set "L.set: POptic s a -> Maybe a -> Maybe s -> Maybe s") <small><sup>v1.0.0</sup></small>
      * [`L.traverse(algebra, (maybeValue, index) => operation, optic, maybeData) ~> operation`](#l-traverse "L.traverse: (Functor|Applicative|Monad) c -> ((Maybe a, Index) -> c b) -> POptic s t a b -> Maybe s -> c t") <small><sup>v10.0.0</sup></small>
    * [Nesting](#nesting)
      * [`L.compose(...optics) ~> optic`](#l-compose "L.compose: (POptic s s1, ...POptic sN a) -> POptic s a") or `[...optics]` <small><sup>v1.0.0</sup></small>
      * [`L.flat(...optics) ~> optic`](#l-flat "L.flat: (POptic s [...s1...], ...POptic sN [...a...]) -> POptic [...s...] a") <small><sup>v13.6.0</sup></small>
    * [Recursing](#recursing)
      * [`L.lazy(optic => optic) ~> optic`](#l-lazy "L.lazy: (POptic s a -> POptic s a) -> POptic s a") <small><sup>v5.1.0</sup></small>
    * [Adapting](#adapting)
      * [`L.choices(optic, ...optics) ~> optic`](#l-choices "L.choices: (POptic s a, ...POptic s a) -> POptic s a") <small><sup>v11.10.0</sup></small>
      * [`L.choose((maybeValue, index) => optic) ~> optic`](#l-choose "L.choose: ((Maybe s, Index) -> POptic s a) -> POptic s a") <small><sup>v1.0.0</sup></small>
      * <a href="#l-cond" title="L.cond: (...[(Maybe s, Index) -&gt; Boolean, POptic s a][, [POptic s a]]) -&gt; POptic s a"><code>L.cond(...[(maybeValue, index) =&gt; testable, consequentOptic][, [alternativeOptic]]) ~&gt; optic</code></a> <small><sup>v13.1.0</sup></small>
      * <a href="#l-condof" title="L.condOf: (PTraversal s c, ...[(Maybe c, Index) -&gt; Boolean, POptic s a][, [POptic s a]]) -&gt; POptic s a"><code>L.condOf(traversal, ...[(maybeValue, index) =&gt; testable, consequentOptic][, [alternativeOptic]]) ~&gt; optic</code></a> <small><sup>v13.5.0</sup></small>
      * [`L.ifElse((maybeValue, index) => testable, optic, optic) ~> optic`](#l-ifelse "L.ifElse: ((Maybe s, Index) -> Boolean) -> POptic s a -> POptic s a -> POptic s a") <small><sup>v13.1.0</sup></small>
      * [`L.orElse(backupOptic, primaryOptic) ~> optic`](#l-orelse "L.orElse: (POptic s a, POptic s a) -> POptic s a") <small><sup>v2.1.0</sup></small>
    * [Indices](#indices)
      * [`L.joinIx(optic) ~> optic`](#l-joinix "L.joinIx: POptic s a -> POptic s a") <small><sup>v13.15.0</sup></small>
      * [`L.mapIx((index, maybeValue) => index) ~> optic`](#l-mapix "L.mapIx: ((Index, Maybe a) -> Index) -> POptic a a") <small><sup>v13.15.0</sup></small>
      * [`L.reIx(optic) ~> optic`](#l-reix "L.reIx: POptic s a -> POptic s a") <small><sup>v14.10.0</sup></small>
      * [`L.setIx(index) ~> optic`](#l-setix "L.setIx: Index -> POptic a a") <small><sup>v13.15.0</sup></small>
      * [`L.skipIx(optic) ~> optic`](#l-skipix "L.skipIx: POptic s a -> POptic s a") <small><sup>v13.15.0</sup></small>
      * [`L.tieIx((innerIndex, outerIndex) => index, optic) ~> optic`](#l-tieix "L.tieIx: ((Index, Index) => Index) -> POptic s a -> POptic s a") <small><sup>v13.15.0</sup></small>
    * [Debugging](#debugging)
      * [`L.getLog(lens, maybeData) ~> maybeValue`](#l-getlog "L.getLog: PLens s a -> Maybe s -> Maybe a") <small><sup>v13.14.0</sup></small>
      * [`L.log(...labels) ~> optic`](#l-log "L.log: (...Any) -> POptic s s") <small><sup>v3.2.0</sup></small>
    * [Internals](#internals)
      * [`L.Identity ~> Monad`](#l-identity-monad "L.Identity: Monad") <small><sup>v13.7.0</sup></small>
      * [`L.IdentityAsync ~> Monadish`](#l-identityasync "L.IdentityAsync: Monadish") <small><sup>v13.12.0</sup></small>
      * [`L.Select ~> Applicative`](#l-select-applicative "L.Select: Applicative") <small><sup>v14.0.0</sup></small>
      * [`L.toFunction(optic) ~> optic`](#l-tofunction "L.toFunction: POptic s t a b -> (Maybe s, Index, (Functor|Applicative|Monad) c, (Maybe a, Index) -> c b) -> c t") <small><sup>v7.0.0</sup></small>
  * [Transforms](#transforms)
    * [Operations on transforms](#operations-on-transforms)
      * [`L.transform(optic, maybeData) ~> maybeData`](#l-transform "L.transform: POptic s a -> Maybe s -> Maybe s") <small><sup>v11.7.0</sup></small>
      * [`L.transformAsync(optic, maybeData) ~> maybeDataPromise`](#l-transformasync "L.transformAsync: POptic s a -> Maybe s -> Promise (Maybe s)") <small><sup>v13.12.0</sup></small>
    * [Sequencing](#sequencing)
      * [`L.seq(...transforms) ~> transform`](#l-seq "L.seq: (...PTransform s a) -> PTransform s a") <small><sup>v9.4.0</sup></small>
    * [Transforming](#transforming)
      * [`L.appendOp(value) ~> traversal`](#l-appendop "L.appendOp: a -> PTraversal [a] a") <small><sup>v14.14.0</sup></small>
      * [`L.assignOp(object) ~> traversal`](#l-assignop "L.assignOp: {p1: a1, ...ps} -> PTraversal {p1: a1, ...ps, ...o} {p1: a1, ...ps}") <small><sup>v11.13.0</sup></small>
      * [`L.modifyOp((maybeValue, index) => maybeValue) ~> traversal`](#l-modifyop "L.modifyOp: ((Maybe a, Index) -> Maybe a) -> PTraversal a a") <small><sup>v11.7.0</sup></small>
      * [`L.prependOp(value) ~> traversal`](#l-prependop "L.prependOp: a -> PTraversal [a] a") <small><sup>v14.14.0</sup></small>
      * [`L.removeOp ~> traversal`](#l-removeop "L.removeOp: PTraversal a a") <small><sup>v11.7.0</sup></small>
      * [`L.setOp(maybeValue) ~> traversal`](#l-setop "L.setOp: Maybe a -> PTraversal a a") <small><sup>v11.7.0</sup></small>
  * [Traversals](#traversals)
    * [Creating new traversals](#creating-new-traversals)
      * [`L.branch({prop: traversal, ...props}) ~> traversal`](#l-branch "L.branch: {p1: PTraversal p1 a, ...pts} -> PTraversal {p1: p1, ...ps} a") <small><sup>v5.1.0</sup></small>
      * [`L.branchOr(traversal, {prop: traversal, ...props}) ~> traversal`](#l-branchor "L.branchOr: PTraversal p a -> {p1: PTraversal p1 a, ...pts} -> PTraversal {p1: p1, ...ps} a") <small><sup>v13.2.0</sup></small>
      * [`L.branches(...propNames) ~> traversal`](#l-branches "L.branches: (p1: PTraversal p1 a, ...pts) -> PTraversal {p1: p1, ...ps} a") <small><sup>v13.5.0</sup></small>
    * [Traversals and combinators](#traversals-and-combinators)
      * [`L.children ~> traversal`](#l-children "L.children: PTraversal ([a] | {p: a, ...ps}) a") <small><sup>v13.3.0</sup></small>
      * [`L.elems ~> traversal`](#l-elems "L.elems: PTraversal [a] a") <small><sup>v7.3.0</sup></small>
      * [`L.elemsTotal ~> traversal`](#l-elemstotal "L.elemsTotal: PTraversal [a] a") <small><sup>v13.11.0</sup></small>
      * [`L.entries ~> traversal`](#l-entries "L.entries: PTraversal {p: a, ...ps} [String, a]") <small><sup>v11.21.0</sup></small>
      * [`L.flatten ~> traversal`](#l-flatten "L.flatten: PTraversal [...[a]...] a") <small><sup>v11.16.0</sup></small>
      * [`L.keys ~> traversal`](#l-keys "L.keys: PTraversal {p: a, ...ps} String") <small><sup>v11.21.0</sup></small>
      * [`L.keysEverywhere ~> traversal`](#l-keyseverywhere "L.keysEverywhere: PTraversal JSON String") <small><sup>v14.12.0</sup></small>
      * [`L.leafs ~> traversal`](#l-leafs "L.leafs: PTraversal JSON (String|Number|Boolean|null|~JSON)") <small><sup>v13.3.0</sup></small>
      * [`L.limit(count, traversal) ~> traversal`](#l-limit "L.limit: Integer -> PTraversal s a -> PTraversal s a") <small><sup>v14.10.0</sup></small>
      * [`L.matches(/.../g) ~> traversal`](#l-matches-g "L.matches: RegExp -> PTraversal String String") <small><sup>v10.4.0</sup></small>
      * [`L.offset(count, traversal) ~> traversal`](#l-offset "L.offset: Integer -> PTraversal s a -> PTraversal s a") <small><sup>v14.10.0</sup></small>
      * [`L.query(...traversals) ~> traversal`](#l-query "L.query: (PTraversal s1 s2, ...PTraversal sN a) ~> PTraversal JSON a") <small><sup>v13.6.0</sup></small>
      * [`L.satisfying((maybeValue, index) => testable) ~> traversal`](#l-satisfying "L.satisfying: ((Maybe s, Index) -> Boolean) -> PTraversal JSON a") <small><sup>v13.3.0</sup></small>
      * [`L.subseq(begin, end, traversal) ~> traversal`](#l-subseq "L.subseq: Integer -> Integer -> PTraversal s a -> PTraversal s a") <small><sup>v14.10.0</sup></small>
      * [`L.values ~> traversal`](#l-values "L.values: PTraversal {p: a, ...ps} a") <small><sup>v7.3.0</sup></small>
      * [`L.whereEq({prop: value, ...props}) ~> traversal`](#l-whereeq "L.whereEq: {p1: p1, ...ps} -> PTraversal JSON {p1: p1, ...ps}") <small><sup>v14.16.0</sup></small>
    * [Querying](#querying)
      * [`L.chain((value, index) => optic, optic) ~> traversal`](#l-chain "L.chain: ((a, Index) -> POptic s b) -> POptic s a -> PTraversal s b") <small><sup>v3.1.0</sup></small>
      * [`L.choice(...optics) ~> traversal`](#l-choice "L.choice: (...POptic s a) -> PTraversal s a") <small><sup>v2.1.0</sup></small>
      * [`L.optional ~> traversal`](#l-optional "L.optional: PTraversal a a") <small><sup>v3.7.0</sup></small>
      * [`L.unless((maybeValue, index) => testable) ~> traversal`](#l-unless "L.unless: ((Maybe a, Index) -> Boolean) -> PTraversal a a") <small><sup>v12.1.0</sup></small>
      * [`L.when((maybeValue, index) => testable) ~> traversal`](#l-when "L.when: ((Maybe a, Index) -> Boolean) -> PTraversal a a") <small><sup>v5.2.0</sup></small>
      * [`L.zero ~> traversal`](#l-zero "L.zero: PTraversal s a") <small><sup>v6.0.0</sup></small>
    * [Folds over traversals](#folds-over-traversals)
      * [`L.all((maybeValue, index) => testable, traversal, maybeData) ~> boolean`](#l-all "L.all: ((Maybe a, Index) -> Boolean) -> PTraversal s a -> Boolean") <small><sup>v9.6.0</sup></small>
      * [`L.all1((maybeValue, index) => testable, traversal, maybeData) ~> boolean`](#l-all1 "L.all1: ((Maybe a, Index) -> Boolean) -> PTraversal s a -> Boolean") <small><sup>v14.4.0</sup></small>
      * [`L.and(traversal, maybeData) ~> boolean`](#l-and "L.and: PTraversal s Boolean -> Boolean") <small><sup>v9.6.0</sup></small>
      * [`L.and1(traversal, maybeData) ~> boolean`](#l-and1 "L.and1: PTraversal s Boolean -> Boolean") <small><sup>v14.4.0</sup></small>
      * [`L.any((maybeValue, index) => testable, traversal, maybeData) ~> boolean`](#l-any "L.any: ((Maybe a, Index) -> Boolean) -> PTraversal s a -> Boolean") <small><sup>v9.6.0</sup></small>
      * [`L.collect(traversal, maybeData) ~> [...values]`](#l-collect "L.collect: PTraversal s a -> Maybe s -> [a]") <small><sup>v3.6.0</sup></small>
      * [`L.collectAs((maybeValue, index) => maybeValue, traversal, maybeData) ~> [...values]`](#l-collectas "L.collectAs: ((Maybe a, Index) -> Maybe b) -> PTraversal s a -> Maybe s -> [b]") <small><sup>v7.2.0</sup></small>
      * [`L.collectTotal(traversal, maybeData) ~> [...maybeValues]`](#l-collecttotal "L.collectTotal: PTraversal s a -> Maybe s -> [Maybe a]") <small><sup>v14.6.0</sup></small>
      * [`L.collectTotalAs((maybeValue, index) => maybeValue, traversal, maybeData) ~> [...maybeValues]`](#l-collecttotalas "L.collectTotalAs: ((Maybe a, Index) -> Maybe b) -> PTraversal s a -> Maybe s -> [Maybe b]") <small><sup>v14.6.0</sup></small>
      * [`L.concat(monoid, traversal, maybeData) ~> value`](#l-concat "L.concat: Monoid a -> (PTraversal s a -> Maybe s -> a)") <small><sup>v7.2.0</sup></small>
      * [`L.concatAs((maybeValue, index) => value, monoid, traversal, maybeData) ~> value`](#l-concatas "L.concatAs: ((Maybe a, Index) -> r) -> Monoid r -> (PTraversal s a -> Maybe s -> r)") <small><sup>v7.2.0</sup></small>
      * [`L.count(traversal, maybeData) ~> number`](#l-count "L.count: PTraversal s a -> Number") <small><sup>v9.7.0</sup></small>
      * [`L.countIf((maybeValue, index) => testable, traversal, maybeData) ~> number`](#l-countif "L.countIf: ((Maybe a, Index) -> Boolean) -> PTraversal s a -> Number") <small><sup>v11.2.0</sup></small>
      * [`L.counts(traversal, maybeData) ~> map`](#l-counts "L.counts: PTraversal s a -> Map Any Number") <small><sup>v11.21.0</sup></small>
      * [`L.countsAs((maybeValue, index) => any, traversal, maybeData) ~> map`](#l-countsas "L.countsAs: ((Maybe a, Index) -> Any) -> PTraversal s a -> Map Any Number") <small><sup>v11.21.0</sup></small>
      * [`L.foldl((value, maybeValue, index) => value, value, traversal, maybeData) ~> value`](#l-foldl "L.foldl: ((r, Maybe a, Index) -> r) -> r -> PTraversal s a -> Maybe s -> r") <small><sup>v7.2.0</sup></small>
      * [`L.foldr((value, maybeValue, index) => value, value, traversal, maybeData) ~> value`](#l-foldr "L.foldr: ((r, Maybe a, Index) -> r) -> r -> PTraversal s a -> Maybe s -> r") <small><sup>v7.2.0</sup></small>
      * [`L.forEach((maybeValue, index) => undefined, traversal, maybeData) ~> undefined`](#l-foreach "L.forEach: ((Maybe a, Index) -> Undefined) -> PTraversal s a -> Maybe s -> Undefined") <small><sup>v11.20.0</sup></small>
      * [`L.forEachWith(() => context, (context, maybeValue, index) => undefined, traversal, maybeData) ~> context`](#l-foreachwith "L.forEachWith: (() -> c) -> ((c, Maybe a, Index) -> Undefined) -> PTraversal s a -> Maybe s -> c") <small><sup>v13.4.0</sup></small>
      * [`L.get(traversal, maybeData) ~> maybeValue`](#l-get "L.get: PTraversal s a -> Maybe s -> Maybe a") <small><sup>v2.2.0</sup></small>
      * [`L.getAs((maybeValue, index) => maybeValue, traversal, maybeData) ~> maybeValue`](#l-getas "L.getAs: ((Maybe a, Index) -> Maybe b) -> PTraversal s a -> Maybe s -> Maybe b") <small><sup>v14.0.0</sup></small>
      * [`L.isDefined(traversal, maybeData) ~> boolean`](#l-isdefined "L.isDefined: PTraversal s a -> Maybe s -> Boolean") <small><sup>v11.8.0</sup></small>
      * [`L.isEmpty(traversal, maybeData) ~> boolean`](#l-isempty "L.isEmpty: PTraversal s a -> Maybe s -> Boolean") <small><sup>v11.5.0</sup></small>
      * [`L.join(string, traversal, maybeData) ~> string`](#l-join "L.join: String -> PTraversal s a -> Maybe s -> String") <small><sup>v11.2.0</sup></small>
      * [`L.joinAs((maybeValue, index) => maybeString, string, traversal, maybeData) ~> string`](#l-joinas "L.joinAs: ((Maybe a, Index) -> Maybe String) -> String -> PTraversal s a -> Maybe s -> String") <small><sup>v11.2.0</sup></small>
      * [`L.maximum(traversal, maybeData) ~> maybeValue`](#l-maximum "L.maximum: Ord a => PTraversal s a -> Maybe s -> Maybe a") <small><sup>v7.2.0</sup></small>
      * [`L.maximumBy(keyLens, traversal, maybeData) ~> maybeValue`](#l-maximumby "L.maximumBy: Ord k => (PLens a k -> PTraversal s a -> Maybe s -> Maybe a") <small><sup>v11.2.0</sup></small>
      * [`L.mean(traversal, maybeData) ~> number`](#l-mean "L.mean: PTraversal s Number -> Maybe s -> Number") <small><sup>v11.17.0</sup></small>
      * [`L.meanAs((maybeValue, index) => maybeNumber, traversal, maybeData) ~> number`](#l-meanas "L.meanAs: ((Maybe a, Index) -> Maybe Number) -> PTraversal s a -> Maybe s -> Number") <small><sup>v11.17.0</sup></small>
      * [`L.minimum(traversal, maybeData) ~> maybeValue`](#l-minimum "L.minimum: Ord a => PTraversal s a -> Maybe s -> Maybe a") <small><sup>v7.2.0</sup></small>
      * [`L.minimumBy(keyLens, traversal, maybeData) ~> maybeValue`](#l-minimumby "L.minimumBy: Ord k => (PLens a k -> PTraversal s a -> Maybe s -> Maybe a") <small><sup>v11.2.0</sup></small>
      * [`L.none((maybeValue, index) => testable, traversal, maybeData) ~> boolean`](#l-none "L.none: ((Maybe a, Index) -> Boolean) -> PTraversal s a -> Boolean") <small><sup>v11.6.0</sup></small>
      * [`L.or(traversal, maybeData) ~> boolean`](#l-or "L.or: PTraversal s Boolean -> Boolean") <small><sup>v9.6.0</sup></small>
      * [`L.product(traversal, maybeData) ~> number`](#l-product "L.product: PTraversal s Number -> Maybe s -> Number") <small><sup>v7.2.0</sup></small>
      * [`L.productAs((maybeValue, index) => number, traversal, maybeData) ~> number`](#l-productas "L.productAs: ((Maybe a, Index) -> Number) -> PTraversal s a -> Maybe s -> Number") <small><sup>v11.2.0</sup></small>
      * ~~[`L.select(traversal, maybeData) ~> maybeValue`](#l-select "L.select: PTraversal s a -> Maybe s -> Maybe a") <small><sup>v9.8.0</sup></small>~~
      * ~~[`L.selectAs((maybeValue, index) => maybeValue, traversal, maybeData) ~> maybeValue`](#l-selectas "L.selectAs: ((Maybe a, Index) -> Maybe b) -> PTraversal s a -> Maybe s -> Maybe b") <small><sup>v9.8.0</sup></small>~~
      * [`L.sum(traversal, maybeData) ~> number`](#l-sum "L.sum: PTraversal s Number -> Maybe s -> Number") <small><sup>v7.2.0</sup></small>
      * [`L.sumAs((maybeValue, index) => number, traversal, maybeData) ~> number`](#l-sumas "L.sumAs: ((Maybe a, Index) -> Number) -> PTraversal s a -> Maybe s -> Number") <small><sup>v11.2.0</sup></small>
  * [Lenses](#lenses)
    * [Creating new lenses](#creating-new-lenses)
      * [`L.foldTraversalLens((traversal, maybeData) => maybeValue, traversal) ~> lens`](#l-foldtraversallens "L.foldTraversalLens: (PTraversal s a -> Maybe s -> Maybe a) -> PTraversal s a -> PLens s a") <small><sup>v11.5.0</sup></small>
      * [`L.getter((maybeData, index) => maybeValue) ~> lens`](#l-getter "L.getter: ((Maybe s, Index) -> Maybe a) -> PLens s a") <small><sup>v13.16.0</sup></small>
      * [`L.lens((maybeData, index) => maybeValue, (maybeValue, maybeData, index) => maybeData) ~> lens`](#l-lens "L.lens: ((Maybe s, Index) -> Maybe a) -> ((Maybe a, Maybe s, Index) -> Maybe s) -> PLens s a") <small><sup>v1.0.0</sup></small>
      * [`L.partsOf(traversal, ...traversals) ~> lens`](#l-partsof "L.partsOf: ((PTraversal s s1, ...PTraversal sN a) -> PLens s [Maybe a]") <small><sup>v14.6.0</sup></small>
      * [`L.setter((maybeValue, maybeData, index) => maybeData) ~> lens`](#l-setter "L.setter: ((Maybe a, Maybe s, Index) -> Maybe s) -> PLens s a") <small><sup>v10.3.0</sup></small>
    * [Enforcing invariants](#enforcing-invariants)
      * [`L.defaults(valueIn) ~> lens`](#l-defaults "L.defaults: s -> PLens s s") <small><sup>v2.0.0</sup></small>
      * [`L.define(value) ~> lens`](#l-define "L.define: s -> PLens s s") <small><sup>v1.0.0</sup></small>
      * [`L.normalize((value, index) => maybeValue) ~> lens`](#l-normalize "L.normalize: ((s, Index) -> Maybe s) -> PLens s s") <small><sup>v1.0.0</sup></small>
      * [`L.required(valueOut) ~> lens`](#l-required "L.required: s -> PLens s s") <small><sup>v1.0.0</sup></small>
      * [`L.reread((valueIn, index) => maybeValueIn) ~> lens`](#l-reread "L.reread: ((s, Index) -> Maybe s) -> PLens s s") <small><sup>v11.21.0</sup></small>
      * [`L.rewrite((valueOut, index) => maybeValueOut) ~> lens`](#l-rewrite "L.rewrite: ((s, Index) -> Maybe s) -> PLens s s") <small><sup>v5.1.0</sup></small>
    * [Lensing array-like objects](#array-like)
      * ~~[`L.append ~> lens`](#l-append "L.append: PLens [a] a") <small><sup>v1.0.0</sup></small>~~
      * [`L.cross([...lenses]) ~> lens`](#l-cross "L.cross: [PLens s1 a1, ...PLens sN aN] -> PLens [s1, ...sN] [a1, ...aN]") <small><sup>v14.3.0</sup></small>
      * [`L.filter((maybeValue, index) => testable) ~> lens`](#l-filter "L.filter: ((Maybe a, Index) -> Boolean) -> PLens [a] [a]") <small><sup>v1.0.0</sup></small>
      * [`L.find((maybeValue, index, {hint: index}) => testable[, {hint: index}]) ~> lens`](#l-find "L.find: ((Maybe a, Index, {hint: Index}) -> Boolean[, {hint: Index}]) -> PLens [a] a") <small><sup>v1.0.0</sup></small>
      * [`L.findWith(optic[, {hint: index}]) ~> optic`](#l-findwith "L.findWith: (POptic s a[, {hint: Index}]) -> POptic [s] a") <small><sup>v1.0.0</sup></small>
      * [`L.first ~> lens`](#l-first "L.first: PLens [a] a") <small><sup>v13.1.0</sup></small>
      * [`L.index(elemIndex) ~> lens`](#l-index "L.index: Integer -> PLens [a] a") or `elemIndex` <small><sup>v1.0.0</sup></small>
      * [`L.last ~> lens`](#l-last "L.last: PLens [a] a") <small><sup>v9.8.0</sup></small>
      * [`L.prefix(maybeEnd) ~> lens`](#l-prefix "L.prefix: Maybe Number -> PLens [a] [a]") <small><sup>v11.12.0</sup></small>
      * [`L.slice(maybeBegin, maybeEnd) ~> lens`](#l-slice "L.slice: Maybe Number -> Maybe Number -> PLens [a] [a]") <small><sup>v8.1.0</sup></small>
      * [`L.suffix(maybeBegin) ~> lens`](#l-suffix "L.suffix: Maybe Number -> PLens [a] [a]") <small><sup>v11.12.0</sup></small>
    * [Lensing objects](#lensing-objects)
      * [`L.pickIn({prop: lens, ...props}) ~> lens`](#l-pickin "L.pickIn: {p1: PLens s1 a1, ...pls} -> PLens {p1: s1, ...pls} {p1: a1, ...pls}") <small><sup>v11.11.0</sup></small>
      * [`L.prop(propName) ~> lens`](#l-prop "L.prop: (p: a) -> PLens {p: a, ...ps} a") or `propName` <small><sup>v1.0.0</sup></small>
      * [`L.props(...propNames) ~> lens`](#l-props "L.props: (p1: a1, ...ps) -> PLens {p1: a1, ...ps, ...o} {p1: a1, ...ps}") <small><sup>v1.4.0</sup></small>
      * [`L.propsExcept(...propNames) ~> lens`](#l-propsexcept "L.propsExcept: (p1: a1, ...ps) -> PLens {p1: a1, ...ps, ...o} {...o}") <small><sup>v14.11.0</sup></small>
      * ~~[`L.propsOf(object) ~> lens`](#l-propsof "L.propsOf: {p1: a1, ...ps} -> PLens {p1: a1, ...ps, ...o} {p1: a1, ...ps}") <small><sup>v11.13.0</sup></small>~~
      * [`L.removable(...propNames) ~> lens`](#l-removable "L.removable: (p1: a1, ...ps) -> PLens {p1: a1, ...ps, ...o} {p1: a1, ...ps, ...o}") <small><sup>v9.2.0</sup></small>
    * [Lensing strings](#lensing-strings)
      * [`L.matches(/.../) ~> lens`](#l-matches "L.matches: RegExp -> PLens String String") <small><sup>v10.4.0</sup></small>
    * [Providing defaults](#providing-defaults)
      * [`L.valueOr(valueOut) ~> lens`](#l-valueor "L.valueOr: s -> PLens s s") <small><sup>v3.5.0</sup></small>
    * [Transforming data](#transforming-data)
      * [`L.pick({prop: lens, ...props}) ~> lens`](#l-pick "L.pick: {p1: PLens s a1, ...pls} -> PLens s {p1: a1, ...pls}") <small><sup>v1.2.0</sup></small>
      * [`L.replace(maybeValueIn, maybeValueOut) ~> lens`](#l-replace "L.replace: Maybe s -> Maybe s -> PLens s s") <small><sup>v1.0.0</sup></small>
    * [Inserters](#inserters)
      * [`L.appendTo ~> lens`](#l-appendto "L.appendTo: PLens [a] a") <small><sup>v14.14.0</sup></small>
      * [`L.assignTo ~> lens`](#l-assignto "L.assignTo: PLens {...} {...}") <small><sup>v14.14.0</sup></small>
      * [`L.prependTo ~> lens`](#l-prependto "L.prependTo: PLens [a] a") <small><sup>v14.14.0</sup></small>
  * [Isomorphisms](#isomorphisms)
    * [Operations on isomorphisms](#operations-on-isomorphisms)
      * [`L.getInverse(isomorphism, maybeData) ~> maybeData`](#l-getinverse "L.getInverse: PIso a b -> Maybe b -> Maybe a") <small><sup>v5.0.0</sup></small>
    * [Creating new isomorphisms](#creating-new-isomorphisms)
      * [`L.iso(maybeData => maybeValue, maybeValue => maybeData) ~> isomorphism`](#l-iso "L.iso: (Maybe s -> Maybe a) -> (Maybe a -> Maybe s) -> PIso s a") <small><sup>v5.3.0</sup></small>
      * [`L.mapping([patternFwd, patternBwd] | (...variables) => [patternFwd, patternBwd]) ~> isomorphism`](#l-mapping "L.mapping: ([Pattern s, Pattern a] | (...Variable) -> [Pattern s, Pattern a]) -> PIso s a") <small><sup>v14.8.0</sup></small>
        * [`L._ ~> pattern`](#l-_ "L._: Pattern a") <small><sup>v14.8.0</sup></small>
      * [`L.mappings([...[patternFwd, patternBwd]] | (...variables) => [...[patternFwd, patternBwd]]) ~> isomorphism`](#l-mappings "L.mappings: ([[Pattern s, Pattern a]] | (...Variable) -> [[Pattern s, Pattern a]]) -> PIso s a") <small><sup>v14.8.0</sup></small>
      * [`L.pattern(pattern | (...variables) => pattern) ~> isomorphism`](#l-pattern "L.pattern: (Pattern s | (...Variable) -> Pattern s) -> PIso s s") <small><sup>v14.13.0</sup></small>
      * [`L.patterns([...patterns] | (...variables) => [...patterns]) ~> isomorphism`](#l-patterns "L.patterns: ([Pattern s] | (...Variable) -> [Pattern s]) -> PIso s s") <small><sup>v14.13.0</sup></small>
    * [Isomorphism combinators](#isomorphism-combinators)
      * [`L.alternatives(isomorphism, ...isomorphisms) ~> isomorphism`](#l-alternatives "L.alternatives: (PIso s a, ...PIso s a) -> PIso s a") <small><sup>v14.7.0</sup></small>
      * [`L.applyAt(elementsOptic, isomorphism) ~> isomorphism`](#l-applyat "L.applyAt: (POptic s a, PIso a a) -> PIso s s") <small><sup>v14.9.0</sup></small>
      * [`L.attemptEveryDown(isomorphism) ~> isomorphism`](#l-attempteverydown "L.attemptEveryDown: (POptic a b) -> PIso s t") <small><sup>v14.13.0</sup></small>
      * [`L.attemptEveryUp(isomorphism) ~> isomorphism`](#l-attempteveryup "L.attemptEveryUp: (POptic a b) -> PIso s t") <small><sup>v14.13.0</sup></small>
      * [`L.attemptSomeDown(isomorphism) ~> isomorphism`](#l-attemptsomedown "L.attemptSomeDoen: (POptic a b) -> PIso s t") <small><sup>v14.13.0</sup></small>
      * [`L.conjugate(contextIsomorphism, isomorphism) ~> isomorphism`](#l-conjugate "L.conjugate: PIso s a -> PIso a a -> PIso s s") <small><sup>v14.9.0</sup></small>
      * [`L.fold(isomorphism) ~> isomorphism`](#l-fold "L.fold: PIso [s, x] s -> PIso [s, xs] s") <small><sup>v14.13.0</sup></small>
      * [`L.inverse(isomorphism) ~> isomorphism`](#l-inverse "L.inverse: PIso a b -> PIso b a") <small><sup>v4.1.0</sup></small>
      * [`L.iterate(isomorphism) ~> isomorphism`](#l-iterate "L.iterate: PIso a a -> PIso a a") <small><sup>v14.3.0</sup></small>
      * [`L.orAlternatively(backupIsomorphism, primaryIsomorphism) ~> isomorphism`](#l-oralternatively "L.orAlternatively: (PIso s a, PIso s a) -> PIso s a") <small><sup>v14.7.0</sup></small>
      * [`L.unfold(isomorphism) ~> isomorphism`](#l-unfold "L.fold: PIso s [s, x] -> PIso s [s, xs]") <small><sup>v14.13.0</sup></small>
    * [Basic isomorphisms](#basic-isomorphisms)
      * [`L.complement ~> isomorphism`](#l-complement "L.complement: PIso Boolean Boolean") <small><sup>v9.7.0</sup></small>
      * [`L.identity ~> isomorphism`](#l-identity "L.identity: PIso s s") <small><sup>v1.3.0</sup></small>
      * [`L.is(value) ~> isomorphism`](#l-is "L.is: v -> PIso v Boolean") <small><sup>v11.1.0</sup></small>
      * [`L.subset(maybeValue => testable) ~> isomorphism`](#l-subset "L.subset: (Maybe a -> Boolean) -> PIso a a") <small><sup>v14.3.0</sup></small>
    * [Array isomorphisms](#array-isomorphisms)
      * [`L.array(isomorphism) ~> isomorphism`](#l-array "L.array: PIso a b -> PIso [a] [b]") <small><sup>v11.19.0</sup></small>
      * [`L.arrays(isomorphism) ~> isomorphism`](#l-arrays "L.arrays: PIso a b -> PIso [a] [b]") <small><sup>v14.13.0</sup></small>
      * [`L.groupBy(keyLens) ~> isomorphism`](#l-groupby "L.groupBy: PLens a k -> PIso [a] [[a]]") <small><sup>v14.13.0</sup></small>
      * [`L.indexed ~> isomorphism`](#l-indexed "L.indexed: PIso [a] [[Integer, a]]") <small><sup>v11.21.0</sup></small>
      * [`L.reverse ~> isomorphism`](#l-reverse "L.reverse: PIso [a] [a]") <small><sup>v11.22.0</sup></small>
      * [`L.singleton ~> isomorphism`](#l-singleton "L.singleton: PIso [a] a") <small><sup>v11.18.0</sup></small>
      * [`L.ungroupBy(keyLens) ~> isomorphism`](#l-ungroupby "L.ungroupBy: PLens a k -> PIso [[a]] [a]") <small><sup>v14.13.0</sup></small>
      * [`L.unzipWith1(isomorphism) ~> isomorphism`](#l-unzipwith1 "L.unzipWith1: PIso c [a, b] -> PIso [c] [a, [b]]") <small><sup>v14.13.0</sup></small>
      * [`L.zipWith1(isomorphism) ~> isomorphism`](#l-zipwith1 "L.zipWith1: PIso [a, b] c -> PIso [a, [b]] [c]") <small><sup>v14.13.0</sup></small>
    * [Object isomorphisms](#object-isomorphisms)
      * [`L.disjoint(propName => propName) ~> isomorphism`](#l-disjoint "L.disjoint: (String k -> String g) -> PIso {[k]: a} {[g]: {[k]: a}}") <small><sup>v13.13.0</sup></small>
      * [`L.keyed ~> isomorphism`](#l-keyed "L.keyed: PIso {p: a, ...ps} [[String, a]]") <small><sup>v11.21.0</sup></small>
      * [`L.multikeyed ~> isomorphism`](#l-multikeyed "L.multikeyed: PIso {p: a|[a], ...ps} [[String, a]]") <small><sup>v14.1.0</sup></small>
    * [Standard isomorphisms](#standard-isomorphisms)
      * [`L.json({reviver, replacer, space}) ~> isomorphism`](#l-json "L.json: {reviver, replacer, space} -> PIso String JSON") <small><sup>v11.3.0</sup></small>
      * [`L.uri ~> isomorphism`](#l-uri "L.uri: PIso String String") <small><sup>v11.3.0</sup></small>
      * [`L.uriComponent ~> isomorphism`](#l-uricomponent "L.uriComponent: PIso String (Boolean|Number|String)") <small><sup>v11.3.0</sup></small>
    * [Standardish isomorphisms](#standardish-isomorphisms)
      * [`L.querystring ~> isomorphism`](#l-querystring "L.querystring: PIso String {p: Boolean|Number|String|[Boolean|Number|String], ...ps}") <small><sup>v14.2.0</sup></small>
    * [String isomorphisms](#string-isomorphisms)
      * [`L.dropPrefix(prefix) ~> isomorphism`](#l-dropprefix "L.dropPrefix: String -> PIso String String") <small><sup>v13.8.0</sup></small>
      * [`L.dropSuffix(suffix) ~> isomorphism`](#l-dropsuffix "L.dropSuffix: String -> PIso String String") <small><sup>v13.8.0</sup></small>
      * [`L.replaces(substringIn, substringOut) ~> isomorphism`](#l-replaces "L.replaces: String -> String -> PIso String String") <small><sup>v13.8.0</sup></small>
      * [`L.split(separator[, separatorRegExp]) ~> isomorphism`](#l-split "L.split: (String[, String | RegExp]) -> PIso String [String]") <small><sup>v13.8.0</sup></small>
      * [`L.uncouple(separator[, separatorRegExp]) ~> isomorphism`](#l-uncouple "L.uncouple: (String[, String | RegExp]) -> PIso String [String, String]") <small><sup>v13.8.0</sup></small>
    * [Arithmetic isomorphisms](#arithmetic-isomorphisms)
      * [`L.add(number) ~> isomorphism`](#l-add "L.add: Number -> PIso Number Number") <small><sup>v13.9.0</sup></small>
      * [`L.divide(number) ~> isomorphism`](#l-divide "L.divide: Number -> PIso Number Number") <small><sup>v13.9.0</sup></small>
      * [`L.multiply(number) ~> isomorphism`](#l-multiply "L.multiply: Number -> PIso Number Number") <small><sup>v13.9.0</sup></small>
      * [`L.negate ~> isomorphism`](#l-negate "L.negate: PIso Number Number") <small><sup>v13.9.0</sup></small>
      * [`L.subtract(number) ~> isomorphism`](#l-subtract "L.subtract: Number -> PIso Number Number") <small><sup>v13.9.0</sup></small>
  * [Interop](#interop)
    * [Fantasy Land](#fantasy-land)
      * [`L.FantasyFunctor ~> Functor`](#l-fantasyfunctor "L.FantasyFunctor: Functor") <small><sup>v14.5.0</sup></small>
      * [`L.fromFantasy(TypeRep) ~> Functor|Applicative|Monad`](#l-fromfantasy "L.fromFantasy: TypeRep -> Functor|Applicative|Monad") <small><sup>v14.5.0</sup></small>
      * [`L.fromFantasyApplicative(TypeRep) ~> Applicative`](#l-fromfantasyapplicative "L.fromFantasy: TypeRep -> Applicative") <small><sup>v14.5.0</sup></small>
      * [`L.fromFantasyMonad(TypeRep) ~> Monad`](#l-fromfantasy "L.fromFantasyMonad: TypeRep -> Monad") <small><sup>v14.5.0</sup></small>
    * [JSON Pointer](#json-pointer)
      * [`L.pointer(jsonPointer) ~> lens`](#l-pointer "L.pointer: JSONPointer s a -> PLens s a") <small><sup>v11.21.0</sup></small>
  * [Auxiliary](#auxiliary)
    * [`L.seemsArrayLike(anything) ~> boolean`](#l-seemsarraylike "L.seemsArrayLike: any -> Boolean") <small><sup>v11.4.0</sup></small>
* [Examples](#examples)
  * [An array of ids as boolean flags](#an-array-of-ids-as-boolean-flags)
  * [Dependent fields](#dependent-fields)
  * [Collection toggle](#collection-toggle)
  * [BST as a lens](#bst-as-a-lens)
    * [BST traversal](#bst-traversal)
  * [Interfacing with Immutable.js](#interfacing)
    * [`List` indexing](#list-indexing)
    * [Interfacing traversals](#interfacing-traversals)
* [Deepening topics](#deepening-topics)
  * [Understanding `L.filter`, `L.find`, `L.get`, and `L.when`](#understanding-filter-find-get-and-when)
* [Advanced topics](#advanced-topics)
  * [Performance tips](#performance-tips)
    * [Nesting traversals does not create intermediate aggregates](#nesting-traversals-does-not-create-intermediate-aggregates)
    * [Avoid reallocating optics in `L.choose`](#avoid-reallocating-optics-in-l-choose)
  * [On bundle size and minification](#on-bundle-size-and-minification)
* [Background](#background)
  * [Motivation](#motivation)
  * [Design choices](#design-choices)
    * [Partiality](#partiality)
    * [Focus on JSON](#focus-on-json)
    * [Use of `undefined`](#use-of-undefined)
    * [Allowing strings and integers as optics](#allowing-strings-and-integers-as-optics)
    * [Treating an array of optics as a composition of optics](#treating-an-array-of-optics-as-a-composition-of-optics)
    * [Applicatives](#applicatives)
    * [Combinators for creating new optics](#combinators-for-creating-new-optics)
    * [Indexing](#indexing)
    * [Static Land](#static-land)
    * [Performance](#performance)
  * [Benchmarks](#benchmarks)
  * [Lenses all the way](#lenses-all-the-way)
  * [Related work](#related-work)
    * [Papers and other introductory material](#papers-and-other-introductory-material)
    * [JavaScript / TypeScript / Flow libraries](#javascript-typescript-flow-libraries)
    * [Libraries for other languages](#libraries-for-other-languages)
* [Contributing](#contributing)
  * [Building](#building)
  * [Testing](#testing)
  * [Documentation](#documentation)

## <a id="tutorial"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#tutorial) [Tutorial](#tutorial)

Let's look at an example that is based on an actual early use case that lead to
the development of this library.  What we have is an external HTTP API that both
produces and consumes JSON objects that include, among many other properties, a
`titles` property:

```js
const sampleTitles = {
  titles: [
    {language: 'en', text: 'Title'},
    {language: 'sv', text: 'Rubrik'}
  ]
}
```

We ultimately want to present the user with a rich enough editor, with features
such as [undo-redo](https://github.com/calmm-js/partial.lenses.history) and
[validation](https://github.com/calmm-js/partial.lenses.validation), for
manipulating the content represented by those JSON objects.  The `titles`
property is really just one tiny part of the data model, but, in this tutorial,
we only look at it, because it is sufficient for introducing most of the basic
ideas.

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
operations, like [`get`](#l-get) and [`set`](#l-set), on the element that the
lens focuses on.

### <a id="getting-started"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#getting-started) [Getting started](#getting-started)

Let's first import the libraries

```jsx
import * as L from 'partial.lenses'
import * as R from 'ramda'
```

and [▶ play](https://calmm-js.github.io/partial.lenses/index.html#getting-started) just a
bit with lenses.

> Note that links with the [▶
> play](https://calmm-js.github.io/partial.lenses/index.html#getting-started) symbol, take
> you to an interactive version of this page where almost all of the code
> snippets are editable and evaluated in the browser.  There is also a separate
> [playground page](https://calmm-js.github.io/partial.lenses/playground.html)
> that allows you to quickly try out lenses.

As mentioned earlier, with lenses we can specify a path to focus on an element.
To specify such a path we use primitive lenses like
[`L.prop(propName)`](#l-prop), to access a named property of an object, and
[`L.index(elemIndex)`](#l-index), to access an element at a given index in an
array, and compose the path using [`L.compose(...lenses)`](#l-compose).

So, to just [get](#l-get) at the `titles` array of the `sampleTitles` we can use
the lens [`L.prop('titles')`](#l-prop):

```js
L.get(L.prop('titles'), sampleTitles)
// [{ language: 'en', text: 'Title' },
//  { language: 'sv', text: 'Rubrik' }]
```

To focus on the first element of the `titles` array, we compose with
the [`L.index(0)`](#l-index) lens:

```js
L.get(L.compose(L.prop('titles'), L.index(0)), sampleTitles)
// { language: 'en', text: 'Title' }
```

Then, to focus on the `text`, we compose with [`L.prop('text')`](#l-prop):

```js
L.get(L.compose(L.prop('titles'), L.index(0), L.prop('text')), sampleTitles)
// 'Title'
```

We can then use the same composed lens to also [set](#l-set) the `text`:

```js
L.set(
  L.compose(L.prop('titles'), L.index(0), L.prop('text')),
  'New title',
  sampleTitles
)
// { titles: [{ language: 'en', text: 'New title' },
//            { language: 'sv', text: 'Rubrik' }] }
```

In practise, specifying ad hoc lenses like this is not very useful.  We'd like
to access a text in a given language, so we want a lens parameterized by a given
language.  To create a parameterized lens, we can write a function that returns
a lens.  Such a lens should then [find](#l-find) the title in the desired
language.

Furthermore, while a simple path lens like above allows one to get and set an
existing text, it doesn't know enough about the data structure to be able to
properly insert new and remove existing texts.  So, we will also need to specify
such details along with the path to focus on.

### <a id="a-partial-lens-to-access-titles"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#a-partial-lens-to-access-titles) [A partial lens to access title texts](#a-partial-lens-to-access-titles)

Let's then just [compose](#l-compose) a parameterized lens for accessing the
`text` of titles:

```js
const textIn = language => L.compose(
  L.prop('titles'),
  L.normalize(R.sortBy(L.get('language'))),
  L.find(R.whereEq({language})),
  L.valueOr({language, text: ''}),
  L.removable('text'),
  L.prop('text')
)
```

Take a moment to read through the above definition line by line.  Each part
either specifies a step in the path to select the desired element or a way in
which the data structure must be treated at that point.  The
[`L.prop(...)`](#l-prop) parts are already familiar.  The other parts we will
mention below.

#### <a id="querying-data"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#querying-data) [Querying data](#querying-data)

Thanks to the parameterized search part,
[`L.find(R.whereEq({language}))`](#l-find), of the lens composition, we can use
it to query titles:

```js
L.get(textIn('sv'), sampleTitles)
// 'Rubrik'
```

The [`L.find`](#l-find) lens is given a predicate that it then uses to find an
element from an array to focus on.  In this case the predicate is specified with
the help of Ramda's [`R.whereEq`](http://ramdajs.com/docs/#whereEq) function
that creates an equality predicate from a given template object.

##### <a id="missing-data-can-be-expected"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#missing-data-can-be-expected) [Missing data can be expected](#missing-data-can-be-expected)

Partial lenses can generally deal with missing data.  In this case, when
[`L.find`](#l-find) doesn't find an element, it instead works like a lens to
[append](#l-appendto) a new element into an array.

So, if we use the partial lens to query a title that does not exist, we get the
default:

```js
L.get(textIn('fi'), sampleTitles)
// ''
```

We get this value, rather than `undefined`, thanks to the [`L.valueOr({language,
text: ''})`](#l-valueor) part of our lens composition, which ensures that we get
the specified value rather than `null` or `undefined`.  We get the default even
if we query from `undefined`:

```js
L.get(textIn('fi'), undefined)
// ''
```

With partial lenses, [`undefined` is the equivalent of
non-existent](#use-of-undefined).

#### <a id="updating-data"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#updating-data) [Updating data](#updating-data)

As with ordinary lenses, we can use the same lens to update titles:

```js
L.set(textIn('en'), 'The title', sampleTitles)
// { titles: [ { language: 'en', text: 'The title' },
//             { language: 'sv', text: 'Rubrik' } ] }
```

#### <a id="inserting-data"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#inserting-data) [Inserting data](#inserting-data)

The same partial lens also allows us to insert new titles:

```js
L.set(textIn('fi'), 'Otsikko', sampleTitles)
// { titles: [ { language: 'en', text: 'Title' },
//             { language: 'fi', text: 'Otsikko' },
//             { language: 'sv', text: 'Rubrik' } ] }
```

There are a couple of things here that require attention.

The reason that the newly inserted object not only has the `text` property, but
also the `language` property is due to the [`L.valueOr({language, text:
''})`](#l-valueor) part that we used to provide a default.

Also note the position into which the new title was inserted.  The array of
titles is kept sorted thanks to the
[`L.normalize(R.sortBy(L.get('language')))`](#l-normalize) part of our lens.
The [`L.normalize`](#l-normalize) lens transforms the data when either read or
written with the given function.  In this case we used Ramda's
[`R.sortBy`](http://ramdajs.com/docs/#sortBy) to specify that we want the titles
to be kept sorted by language.

#### <a id="removing-data"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#removing-data) [Removing data](#removing-data)

Finally, we can use the same partial lens to remove titles:

```js
L.set(textIn('sv'), undefined, sampleTitles)
// { titles: [ { language: 'en', text: 'Title' } ] }
```

Note that a single title `text` is actually a part of an object.  The key to
having the whole object vanish, rather than just the `text` property, is the
[`L.removable('text')`](#l-removable) part of our lens composition.  It makes it
so that when the `text` property is set to `undefined`, the result will be
`undefined` rather than merely an object without the `text` property.

If we remove all of the titles, we get an empty array:

```js
L.set(L.seq(textIn('sv'), textIn('en')), undefined, sampleTitles)
// { titles: [] }
```

Above we use [`L.seq`](#l-seq) to run the [`L.set`](#l-set) operation over both
of the focused titles.

#### <a id="exercises"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#exercises) [Exercises](#exercises)

Take out one (or more) [`L.normalize(...)`](#l-normalize),
[`L.valueOr(...)`](#l-valueor) or [`L.removable(...)`](#l-removable) part(s)
from the lens composition and try to predict what happens when you rerun the
examples with the modified lens composition.  Verify your reasoning by actually
rerunning the examples.

### <a id="shorthands"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#shorthands) [Shorthands](#shorthands)

For clarity, the previous code snippets avoided some of the shorthands that this
library supports.  In particular,
* [`L.compose(...)`](#l-compose) can be abbreviated as an array
  [`[...]`](#l-compose),
* [`L.prop(propName)`](#l-prop) can be abbreviated as [`propName`](#l-prop), and
* [`L.set(l, undefined, s)`](#l-set) can be abbreviated as [`L.remove(l,
  s)`](#l-remove).

### <a id="systematic-decomposition"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#systematic-decomposition) [Systematic decomposition](#systematic-decomposition)

It is also typical to compose lenses out of short paths following the schema of
the JSON data being manipulated.  Recall the lens from the start of the example:

```jsx
L.compose(
  L.prop('titles'),
  L.normalize(R.sortBy(L.get('language'))),
  L.find(R.whereEq({language})),
  L.valueOr({language, text: ''}),
  L.removable('text'),
  L.prop('text')
)
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
  text: [L.removable('text'), 'text']
}

const Titles = {
  titleIn: language => [
    L.find(R.whereEq({language})),
    L.valueOr({language, text: ''})
  ]
}

const Model = {
  titles: ['titles', L.normalize(R.sortBy(L.get('language')))],
  textIn: language => [Model.titles, Titles.titleIn(language), Title.text]
}
```

We can now say:

```js
L.get(Model.textIn('sv'), sampleTitles)
// 'Rubrik'
```

This style of organizing lenses is overkill for our toy example.  In a more
realistic case the `sampleTitles` object would contain many more properties.
Also, rather than composing a lens, like `Model.textIn` above, to access a leaf
property from the root of our object, we might actually compose lenses
incrementally as we inspect the model structure.

### <a id="manipulating-multiple-items"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#manipulating-multiple-items) [Manipulating multiple items](#manipulating-multiple-items)

So far we have used a lens to manipulate individual items.  This library also
supports [traversals](#traversals) that compose with lenses and can target
multiple items.  Continuing on the tutorial example, let's define a traversal
that targets all the texts:

```js
const texts = [Model.titles, L.elems, Title.text]
```

What makes the above a traversal is the [`L.elems`](#l-elems) part.  The result
of composing a traversal with a lens is a traversal.  The other parts of the
above composition should already be familiar from previous examples.  Note how
we were able to use the previously defined `Model.titles` and `Title.text`
lenses.

Now, we can use the above traversal to [`collect`](#l-collect) all the texts:

```js
L.collect(texts, sampleTitles)
// [ 'Title', 'Rubrik' ]
```

More generally, we can [map and fold](#l-concatas) over texts.  For example, we
could use [`L.maximumBy`](#l-maximumby) to find a title with the maximum length:

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
L.remove([texts, L.when(t => t.length > 5)], sampleTitles)
// { titles: [ { language: 'en', text: 'Title' } ] }
```

### <a id="next-steps"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#next-steps) [Next steps](#next-steps)

This concludes the tutorial.  The reference documentation contains lots of tiny
examples and a few [more involved examples](#l-lazy).  The [examples](#examples)
section describes a couple of lens compositions we've found practical as well as
examples that may help to see [possibilities beyond the immediately
obvious](#bst-as-a-lens).  The
[wiki](https://github.com/calmm-js/partial.lenses/wiki) contains further
examples and playground links.  There is also a document that describes [a
simplified implementation of optics](IMPLEMENTATION.md) in a similar style as
the implementation of this library.  Last, but perhaps not least, there is also
a page of [Partial Lenses
Exercises](https://calmm-js.github.io/partial.lenses/exercises.html) to solve.

## <a id="the-why-of-optics"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#the-why-of-optics) [The why of optics](#the-why-of-optics)

Optics provide a way to decouple the operation to perform on an element or
elements of a data structure from the details of selecting the element or
elements and the details of maintaining the integrity of the data structure.  In
other words, a selection algorithm and data structure invariant maintenance can
be expressed as a composition of optics and used with many different operations.

Consider how one might approach the [tutorial](#tutorial) problem without
optics.  One could, for example, write a collection of operations like
`getText`, `setText`, `addText`, and `remText`:

```js
const getEntry = R.curry(
  (language, data) => data.titles.find(R.whereEq({language}))
)
const hasText = R.pipe(getEntry, Boolean)
const getText = R.pipe(getEntry, R.defaultTo({}), R.prop('text'))
const mapProp = R.curry(
  (fn, prop, obj) => R.assoc(prop, fn(R.prop(prop, obj)), obj)
)
const mapText = R.curry(
  (language, fn, data) => mapProp(
    R.map(R.ifElse(R.whereEq({language}), mapProp(fn, 'text'), R.identity)),
    'titles',
    data
  )
)
const remText = R.curry(
  (language, data) => mapProp(
    R.filter(R.complement(R.whereEq({language}))),
    'titles'
  )
)
const addText = R.curry(
  (language, text, data) => mapProp(R.append({language, text}), 'titles', data)
)
const setText = R.curry(
  (language, text, data) => mapText(language, R.always(text), data)
)
```

You can definitely make the above operations both cleaner and more robust.  For
example, consider maintaining the ordering of texts and the handling of cases
such as using `addText` when there already is a text in the specified language
and `setText` when there isn't.  With partial optics, however, you separate the
selection and data structure invariant maintenance from the operations as
illustrated in the [tutorial](#tutorial) and due to the separation of concerns
that tends to give you a lot of robust functionality in [a small amount of
code](#a-partial-lens-to-access-titles).

## <a id="reference"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#reference) [Reference](#reference)

The [combinators](https://wiki.haskell.org/Combinator) provided by this library
are available as named imports.  Typically one just imports the library as:

```jsx
import * as L from 'partial.lenses'
```

### <a id="stable-subset"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#stable-subset) [Stable subset](#stable-subset)

This library has historically been developed in a fairly aggressive manner so
that features have been marked as obsolete and removed in subsequent major
versions.  This can be particularly burdensome for developers of libraries that
depend on partial lenses.  To help the development of such libraries, this
section specifies a tiny subset of this library as *stable*.  While it is
possible that the stable subset is later extended, nothing in the stable subset
will ever be changed in a backwards incompatible manner.

The following operations, with the below mentioned limitations, constitute the
stable subset:

* [`L.compose(...optics) ~> optic`](#l-compose) is stable with the exception
  that one must not depend on being able to compose optics with ordinary
  functions.  Also, the use of arrays to denote composition is not part of the
  stable subset.  Note that [`L.compose()`](#l-compose) is guaranteed to be
  equivalent to the [`L.identity`](#l-identity) optic.

* [`L.get(lens, maybeData) ~> maybeValue`](#l-get) is stable without
  limitations.

* [`L.lens(maybeData => maybeValue, (maybeValue, maybeData) => maybeData) ~>
  lens`](#l-lens) is stable with the exception that one must not depend on the
  user specified getter and setter functions being passed more than 1 and 2
  arguments, respectively, and one must make no assumptions about any extra
  parameters being passed.

* [`L.modify(optic, maybeValue => maybeValue, maybeData) ~>
  maybeData`](#l-modify) is stable with the exception that one must not depend
  on the user specified function being passed more than 1 argument and one must
  make no assumptions about any extra parameters being passed.

* [`L.remove(optic, maybeData) ~> maybeData`](#l-remove) is stable without
  limitations.

* [`L.set(optic, maybeValue, maybeData) ~> maybeData`](#l-set) is stable without
  limitations.

The main intention behind the stable subset is to enable a dependent library to
make basic use of lenses created by client code using the dependent library.

In retrospect, the stable subset has existed since version 2.2.0.

### <a id="additional-libraries"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#additional-libraries) [Additional libraries](#additional-libraries)

The main Partial Lenses library aims to provide robust general purpose
combinators for dealing with plain JavaScript data.  Combinators that are more
experimental or specialized in purpose or would require additional dependencies
aside from the [Infestines](https://github.com/polytypic/infestines) library,
which is mainly used for the currying helpers it provides, are not provided.

Currently the following additional Partial Lenses libraries exist:

* [Partial Lenses History](https://github.com/calmm-js/partial.lenses.history)
* [Partial Lenses Validation](https://github.com/calmm-js/partial.lenses.validation)

### <a id="optics"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#optics) [Optics](#optics)

The abstractions, [traversals](#traversals), [lenses](#lenses), and
[isomorphisms](#isomorphisms), provided by this library are collectively known
as *optics*.  Traversals can target any number of elements.  Lenses are a
restriction of traversals that target a single element.  Isomorphisms are a
restriction of lenses with an [inverse](#l-inverse).

In addition to basic bidirectional optics, this library also supports more
arbitrary [transforms](#transforms) using optics with [sequencing](#l-seq) and
[transform ops](#transforming).  Transforms allow operations, such as modifying
a part of data structure multiple times or even in a loop, that are not possible
with basic optics.

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

#### <a id="on-partiality"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#on-partiality) [On partiality](#on-partiality)

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
expectation of an optic, then the [input is treated as being `undefined`, which
is the equivalent of non-existent](#use-of-undefined): reading through the optic
gives `undefined` and writing through the optic replaces the focus with the
written value.  This makes the optics in this library partial and allows
specific partial optics, such as the simple [`L.prop`](#l-prop) lens, to be used
in a wider range of situations than corresponding total optics.

Making all optics partial has a number of consequences.  For one thing, it can
potentially hide bugs: an incorrectly specified optic treats the input as
`undefined` and may seem to work without raising an error.  We have not found
this to be a major source of bugs in practice.  However, partiality also has a
number of benefits.  In particular, it allows optics to seamlessly support both
insertion and removal.  It also allows to reduce the number of necessary
abstractions and it tends to make compositions of optics more concise with fewer
required parts, which both help to avoid bugs.

#### <a id="on-indexing"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#on-indexing) [On indexing](#on-indexing)

Optics in this library support a simple unnested form of indexing.  When
focusing on an array element or an object property, the index of the array
element or the key of the object property is passed as the index to user defined
functions operating on that focus.

For example:

```js
L.get(
  [L.find(R.equals('bar')), (value, index) => ({value, index})],
  ['foo', 'bar', 'baz']
)
// {value: 'bar', index: 1}
```
```js
L.modify(L.values, (value, key) => ({key, value}), {x: 1, y: 2})
// {x: {key: 'x', value: 1}, y: {key: 'y', value: 2}}
```

Only optics directly operating on array elements and object properties produce
indices.  Most optics do not have an index of their own and they pass the index
given by the preceding optic as their index.  For example, [`L.when`](#l-when)
doesn't have an index by itself, but it passes through the index provided by the
preceding optic:

```js
L.collectAs(
  (value, index) => ({value, index}),
  [L.elems, L.when(x => x > 2)],
  [3, 1, 4, 1]
)
// [{value: 3, index: 0}, {value: 4, index: 2}]
```
```js
L.collectAs(
  (value, key) => ({value, key}),
  [L.values, L.when(x => x > 2)],
  {x: 3, y: 1, z: 4, w: 1}
)
// [{value: 3, key: 'x'}, {value: 4, key: 'z'}]
```

When accessing a focus deep inside a data structure, the indices along the path
to the focus are not collected into a path.  However, it is possible to use
[index manipulating combinators](#indices) to construct paths of indices and
more.  For example:

```js
L.collectAs(
  (value, path) => [L.collect(L.flatten, path), value],
  L.lazy(rec => L.ifElse(R.is(Object), [L.joinIx(L.children), rec], [])),
  {a: {b: {c: 'abc'}}, x: [{y: [{z: 'xyz'}]}]}
)
// [ [ [ "a", "b", "c", ], "abc", ],
//   [ [ "x", 0, "y", 0, "z", ], "xyz", ] ]
```

The reason for not collecting paths by default is that doing so would be
relatively expensive due to the additional allocations.  The
[`L.choose`](#l-choose) combinator can also be useful in cases where there is a
need to access some index or context along the path to a focus.

#### <a id="on-immutability"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#on-immutability) [On immutability](#on-immutability)

Starting with version [10.0.0](./CHANGELOG.md#1000), to strongly guide away from
mutating data structures, optics call
[`Object.freeze`](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze)
on any new objects they create when `NODE_ENV` is not `production`.

Why only non-`production` builds?  Because `Object.freeze` can be quite
expensive and the main benefit is in catching potential bugs early during
development.

Also note that optics do not implicitly "deep freeze" data structures given to
them or freeze data returned by user defined functions.  Only objects newly
created by optic functions themselves are frozen.

Starting with version [13.10.0](./CHANGELOG.md#13100), the possibility that
optics do not unnecessarily clone input data structures is explicitly
acknowledged.  In case all elements of an array or object produced by an optic
operation would be the same, as determined by
[`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is),
then it is allowed, but not guaranteed, for the optic operation to return the
input as is.

#### <a id="on-composability"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#on-composability) [On composability](#on-composability)

A lot of libraries these days claim to be
[composable](https://en.wikipedia.org/wiki/Composability).  Is any collection of
functions composable?  In the opinion of the author of this library, in order
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

| Form                      | Operation(s)                                                                        | Semantics
| ------------------------- | ----------------------------------------------------------------------------------- | -----------------------------------------------------------------------------------------
| [Nesting](#nesting)       | [`L.compose(...optics)`](#l-compose) or `[...optics]`                               | [Monoid](https://en.wikipedia.org/wiki/Monoid) over [unityped](http://cs.stackexchange.com/questions/18847/if-dynamically-typed-languages-are-truly-statically-typed-unityped-languages-w) [optics](#optics)
| [Recursing](#recursing)   | [`L.lazy(optic => optic)`](#l-lazy)                                                 | [Fixed point](https://en.wikipedia.org/wiki/Fixed-point_combinator)
| [Adapting](#adapting)     | [`L.choices(optic, ...optics)`](#l-choices)                                         | [Semigroup](https://en.wikipedia.org/wiki/Semigroup) over [optics](#optics)
| [Querying](#querying)     | [`L.choice(...optics)`](#l-choice) and [`L.chain(value => optic, optic)`](#l-chain) | [MonadPlus](https://en.wikibooks.org/wiki/Haskell/Alternative_and_MonadPlus) over [traversals](#traversals)
| Picking                   | [`L.pick({...prop:lens})`](#l-pick)                                                 | <a href="https://en.wikipedia.org/wiki/Product_(category_theory)">Product</a> of [lenses](#lenses)
| Branching                 | [`L.branch({...prop:traversal})`](#l-branch)                                        | [Coproduct](https://en.wikipedia.org/wiki/Coproduct) of [traversals](#traversals)
| [Sequencing](#sequencing) | [`L.seq(...transforms)`](#l-seq)                                                    | <a href="https://en.wikipedia.org/wiki/Monad_(functional_programming)">Monad</a> over [transforms](#transforms)

The above table and, in particular, the semantics column is by no means
complete.  In particular, the documentation of this library does not generally
spell out proofs of the semantics.

#### <a id="on-lens-laws"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#on-lens-laws) [On lens laws](#on-lens-laws)

Aside from understanding laws on how forms of composition behave, it is useful
to understand laws that are specific to operations on lenses and optics, in
general.  As described in the paper [A clear picture of lens
laws](http://sebfisch.github.io/research/pub/Fischer+MPC15.pdf), many laws have
been formulated for lenses and it can be useful to have lenses that do not
necessarily obey some laws.

Here is a snippet that demonstrates that partial lenses can obey the laws of, so
called, *very well-behaved lenses*:

```js
function test(actual, expected) {
  return R.equals(actual, expected) || {actual, expected}
}

const VeryWellBehavedLens = ({lens, data, elemA, elemB}) => ({
  GetSet: test(L.set(lens, L.get(lens, data), data), data),
  SetGet: test(L.get(lens, L.set(lens, elemA, data)), elemA),
  SetSet: test(
    L.set(lens, elemB, L.set(lens, elemA, data)),
    L.set(lens, elemB, data)
  )
})

VeryWellBehavedLens({elemA: 2, elemB: 3, data: {x: 1}, lens: 'x' })
// { GetSet: true, SetGet: true, SetSet: true }
```

You might want to [▶
play](https://calmm-js.github.io/partial.lenses/index.html#on-lens-laws) with the laws in
your browser.

*Note*, however, that *partial* lenses are not (total) lenses.  `undefined` is
given special meaning and should not appear in the manipulated data.

##### <a id="myth-partial-lenses-are-not-lawful"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#myth-partial-lenses-are-not-lawful) [Myth: Partial Lenses are not lawful](#myth-partial-lenses-are-not-lawful)

For some reason there seems to be a persistent myth that partial lenses cannot
obey [lens laws](http://sebfisch.github.io/research/pub/Fischer+MPC15.pdf).  The
issue a little more interesting than a simple yes or no.  The short answer is
that partial lenses can obey lens laws.  However, for practical reasons there
are many combinators in this library that, alone, do not obey lens laws.
Nevertheless even such combinators can be used in lens compositions that obey
lens laws.

Consider the [`L.find`](#l-find) combinator.  The truth is that it doesn't by
itself obey lens laws.  Here is an example:

```js
L.get(L.find(R.equals(1)), L.set(L.find(R.equals(1)), 2, []))
// undefined
```

As you can see, [`L.find(R.equals(1))`](#l-find) does not obey the `SetGet` aka
`Put-Get` law.  Does this make the [`L.find`](#l-find) combinator useless?  Far
from it.

Consider the following lens:

```js
const valOf = key => [L.find(R.whereEq({key})), L.defaults({key}), 'val']
```

The `valOf` lens constructor is for accessing association arrays that contain
`{key, val}` pairs.  For example:

```js
const sampleAssoc = [{key: 'x', val: 42}, {key: 'y', val: 24}]
L.set(valOf('x'), 101, [])
// [{key: 'x', val: 101}]
```
```js
L.get(valOf('x'), sampleAssoc)
// 42
```
```js
L.get(valOf('z'), sampleAssoc)
// undefined
```
```js
L.set(valOf('x'), undefined, sampleAssoc)
// [{key: 'y', val: 24}]
```
```js
L.set(valOf('x'), 13, sampleAssoc)
// [{key: 'x', val: 13}, {key: 'y', val: 24}]
```

It obeys lens laws:

```js
VeryWellBehavedLens({
  elemA: 2,
  elemB: 3,
  data: [{key: 'x', val: 13}],
  lens: valOf('x')
})
```

Before you try to break it, note that a lens returned by `valOf(key)` is only
supposed to work on valid association arrays.  A valid association array must
not contain duplicate keys, `undefined` is not valid `val`, and the order of
elements is not significant.  (Note that you could also add
[`L.rewrite(R.sortBy(L.get('key')))`](#l-rewrite) to the composition to ensure
that elements stay in the same order.)

The gist of this example is important.  Even if it is the case that not all
parts of a lens composition obey lens laws, it can be that a composition taken
as a whole obeys lens laws.  The reason why this use of [`L.find`](#l-find)
results in a lawful partial lens is that the lenses composed after it restricts
the scope of the lens so that one cannot modify the `key`.

#### <a id="operations-on-optics"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#operations-on-optics) [Operations on optics](#operations-on-optics)

##### <a id="l-assign"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-assign) [`L.assign(optic, object, maybeData) ~> maybeData`](#l-assign "L.assign: PLens s {p1: a1, ...ps, ...o} -> {p1: a1, ...ps} -> Maybe s -> Maybe s") <small><sup>v11.13.0</sup></small>

`L.assign` allows one to merge the given object into the object or objects
focused on by the given optic.

For example:

```js
L.assign(L.elems, {y: 1}, [{x: 3, y: 2}, {x: 4}])
// [ { x: 3, y: 1 }, { x: 4, y: 1 } ]
```

##### <a id="l-disperse"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-disperse) [`L.disperse(optic, [...maybeValues], maybeData) ~> maybeData`](#l-disperse "L.disperse: POptic s a -> Maybe [Maybe a] -> Maybe s -> Maybe s") <small><sup>v14.6.0</sup></small>

`L.disperse` replaces values in focuses targeted by the given optic with
optional values taken from the given [array-like](#l-seemsarraylike) object.
See also [`L.partsOf`](#l-partsof).

For example:

```js
L.disperse(
  L.leafs,
  ['a', undefined, 'b', 'c', 'd'],
  [[[1], 2], {y: 3}, [{l: 4, r: [5]}, {x: 6}]]
)
// [[['a']], {y: 'b'}, [{l: 'c', r: ['d']}, {}]]
```

To understand `L.disperse`, it is perhaps helpful to consider under what
conditions the following equations hold:

```jsx
ColDis:     L.disperse(o, L.collectTotal(o, d), d) = d
DisCol:    L.collectTotal(o, L.disperse(o, vs, d)) = vs
DisDis:   L.disperse(o, vs, L.disperse(o, vs0, d)) = L.disperse(o, vs, d)
```

The point is that `L.disperse` is roughly to [`L.collectTotal`](#l-collecttotal)
as [`L.set`](#l-set) is to [`L.get`](#l-get).  However, just like with
[`L.set`](#l-set) and [`L.get`](#l-get), the [equations](#on-lens-laws) do not
hold for all (combinations of) optics (and arrays of values).

##### <a id="l-modify"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-modify) [`L.modify(optic, (maybeValue, index) => maybeValue, maybeData) ~> maybeData`](#l-modify "L.modify: POptic s a -> ((Maybe a, Index) -> Maybe a) -> Maybe s -> Maybe s") <small><sup>v2.2.0</sup></small>

`L.modify` allows one to map over the elements focused on by the given optic.

For example:

```js
L.modify(['elems', 0, 'x'], R.inc, {elems: [{x: 1, y: 2}, {x: 3, y: 4}]})
// { elems: [ { x: 2, y: 2 }, { x: 3, y: 4 } ] }
```
```js
L.modify(
  ['elems', L.elems, 'x'],
  R.dec,
  {elems: [{x: 1, y: 2}, {x: 3, y: 4}]}
)
// { elems: [ { x: 0, y: 2 }, { x: 2, y: 4 } ] }
```

##### <a id="l-modifyasync"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-modifyasync) [`L.modifyAsync(optic, (maybeValue, index) => maybeValuePromise, maybeData) ~> maybeDataPromise`](#l-modifyasync "L.modifyAsync: POptic s a -> ((Maybe a, Index) -> Promise (Maybe a)) -> Maybe s -> Promise (Maybe s)") <small><sup>v13.12.0</sup></small>

`L.modifyAsync` allows one to map an asynchronous function over the elements
focused on by the given optic.  The result of `L.modifyAsync` is always a
[promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise).

For example:

```js
log(
  L.modifyAsync(
    ['elems', L.elems, 'x'],
    async x => x - 1,
    {elems: [{x: 1, y: 2}, {x: 3, y: 4}]}
  )
)
// Promise { elems: [ { x: 0, y: 2 }, { x: 2, y: 4 } ] }
```

##### <a id="l-remove"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-remove) [`L.remove(optic, maybeData) ~> maybeData`](#l-remove "L.remove: POptic s a -> Maybe s -> Maybe s") <small><sup>v2.0.0</sup></small>

`L.remove` allows one to remove the elements focused on by the given optic.

For example:

```js
L.remove([0, L.defaults({}), 'x'], [{x: 1}, {x: 2}, {x: 3}])
// [ { x: 2 }, { x: 3 } ]
```
```js
L.remove([L.elems, 'x', L.when(x => x > 1)], [{x: 1}, {x: 2, y: 1}, {x: 3}])
// [ { x: 1 }, { y: 1 }, {} ]
```

Note that `L.remove(optic, maybeData)` is equivalent to [`L.set(lens, undefined,
maybeData)`](#l-set).  With partial lenses, setting to `undefined` typically has
the effect of removing the focused element.

##### <a id="l-set"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-set) [`L.set(optic, maybeValue, maybeData) ~> maybeData`](#l-set "L.set: POptic s a -> Maybe a -> Maybe s -> Maybe s") <small><sup>v1.0.0</sup></small>

`L.set` allows one to replace the elements focused on by the given optic with
the specified value.

For example:

```js
L.set(['a', 0, 'x'], 11, {id: 'z'})
// {a: [{x: 11}], id: 'z'}
```
```js
L.set([L.elems, 'x', L.when(x => x > 1)], -1, [{x: 1}, {x: 2, y: 1}, {x: 3}])
// [ { x: 1 }, { x: -1, y: 1 }, { x: -1 } ]
```

Note that `L.set(lens, maybeValue, maybeData)` is equivalent to [`L.modify(lens,
R.always(maybeValue), maybeData)`](#l-modify).

##### <a id="l-traverse"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-traverse) [`L.traverse(algebra, (maybeValue, index) => operation, optic, maybeData) ~> operation`](#l-traverse "L.traverse: (Functor|Applicative|Monad) c -> ((Maybe a, Index) -> c b) -> POptic s t a b -> Maybe s -> c t") <small><sup>v10.0.0</sup></small>

`L.traverse` maps each focus to an operation and returns an operation that runs
those operations in-order and collects the results.  The
[`algebra`](https://github.com/rpominov/static-land/blob/master/docs/spec.md#algebra)
argument must be either a
[`Functor`](https://github.com/rpominov/static-land/blob/master/docs/spec.md#functor),
[`Applicative`](https://github.com/rpominov/static-land/blob/master/docs/spec.md#applicative),
or
[`Monad`](https://github.com/rpominov/static-land/blob/master/docs/spec.md#monad)
depending on the optic as specified in [`L.toFunction`](#l-tofunction).

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

#### <a id="nesting"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#nesting) [Nesting](#nesting)

The [`L.compose`](#l-compose) combinator allows one to build optics that deal
with nested data structures.

##### <a id="l-compose"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-compose) [`L.compose(...optics) ~> optic`](#l-compose "L.compose: (POptic s s1, ...POptic sN a) -> POptic s a") or `[...optics]` <small><sup>v1.0.0</sup></small>

`L.compose` creates a nested composition of the given optics and ordinary
functions such that in `L.compose(bigger, smaller)` the `smaller` optic can only
see and manipulate the part of the whole as seen through the `bigger` optic.
See also [`L.toFunction`](#l-tofunction).

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
L.set(['a', 1], 'a', {a: ['b', 'c']})
// { a: [ 'b', 'a' ] }
```
```js
L.get(['a', 1], {a: ['b', 'c']})
// 'c'
```

You can also directly compose optics with ordinary functions.  The result of
such a composition is a read-only optic.

For example:

```js
L.get(['x', x => x + 1], {x: 1})
// 2
```
```js
L.set(['x', x => x + 1], 3, {x: 1})
// { x: 1 }
```

Note that eligible ordinary functions must have a maximum arity of two: the
first argument will be the data and second will be the index.  Both can, of
course, be `undefined`.  Also starting from version
[11.0.0](./CHANGELOG.md#1100) it is not guaranteed that such ordinary functions
would not be passed other arguments and therefore such functions should not
depend on the number of arguments being passed nor on any arguments beyond the
first two.

Note that [`R.compose`](http://ramdajs.com/docs/#compose) is not the same as
`L.compose` as described in the [implementation document](IMPLEMENTATION.md).

##### <a id="l-flat"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-flat) [`L.flat(...optics) ~> optic`](#l-flat "L.flat: (POptic s [...s1...], ...POptic sN [...a...]) -> POptic [...s...] a") <small><sup>v13.6.0</sup></small>

`L.flat` is like [`L.compose`](#l-compose) except that [`L.flatten`](#l-flatten)
is composed around and between the given optics.  In other words, `L.flat(o1,
..., oN)` is equivalent to `L.compose(L.flatten, o1, L.flatten, ..., L.flatten,
oN, L.flatten)`.

#### <a id="recursing"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#recursing) [Recursing](#recursing)

The [`L.lazy`](#l-lazy) combinator allows one to build optics that deal with
nested or recursive data structures of arbitrary depth.  It also allows one to
build [transforms](#transforms) with loops.

##### <a id="l-lazy"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-lazy) [`L.lazy(optic => optic) ~> optic`](#l-lazy "L.lazy: (POptic s a -> POptic s a) -> POptic s a") <small><sup>v5.1.0</sup></small>

`L.lazy` can be used to construct optics lazily.  The function given to `L.lazy`
is passed a forwarding proxy to its return value and can also make forward
references to other optics and possibly construct a recursive optic.

Note that when using `L.lazy` to construct a recursive optic, it will only work
in a meaningful way when the recursive uses are either [precomposed](#l-compose)
or [presequenced](#l-seq) with some other optic in a way that neither causes
immediate nor unconditional recursion.

For example, here is a traversal that targets all the primitive elements in a
data structure of nested arrays and objects:

```js
const primitives = L.lazy(
  rec => L.ifElse(R.is(Object), [L.children, rec], L.optional)
)
```

Note that the above creates a cyclic representation of the traversal and a
similar traversal named [`L.leafs`](#l-leafs) is provided out-of-the-box.

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
L.remove(
  [primitives, L.when(x => 3 <= x && x <= 4)],
  [[[1], 2], {y: 3}, [{l: 4, r: [5]}, {x: 6}]]
)
// [ [ [ 1 ], 2 ], {}, [ { r: [ 5 ] }, { x: 6 } ] ]
```

#### <a id="adapting"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#adaptning) [Adapting](#adapting)

Adapting combinators allow one to build optics that adapt to their input.

##### <a id="l-choices"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-choices) [`L.choices(optic, ...optics) ~> optic`](#l-choices "L.choices: (POptic s a, ...POptic s a) -> POptic s a") <small><sup>v11.10.0</sup></small>

`L.choices` returns a partial optic that acts like the first of the given optics
whose view is not `undefined` on the given data structure.  When the views of
all of the given optics are `undefined`, the returned optic acts like the last
of the given optics.  See also [`L.orElse`](#l-orelse), [`L.choice`](#l-choice),
and [`L.alternatives`](#l-alternatives).

For example:

```js
L.set([L.elems, L.choices('a', 'd')], 3, [{R: 1}, {a: 1}, {d: 2}])
// [ { R: 1, d: 3 }, { a: 3 }, { d: 3 } ]
```

##### <a id="l-choose"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-choose) [`L.choose((maybeValue, index) => optic) ~> optic`](#l-choose "L.choose: ((Maybe s, Index) -> POptic s a) -> POptic s a") <small><sup>v1.0.0</sup></small>

`L.choose` creates an optic whose operation is determined by the given function
that maps the underlying view, which can be `undefined`, to an optic.  In other
words, the `L.choose` combinator allows an optic to be constructed *after*
examining the data structure being manipulated.  See also [`L.cond`](#l-cond).

For example:

```js
const majorAxis = L.choose(
  ({x, y} = {}) => Math.abs(x) < Math.abs(y) ? 'y' : 'x'
)

L.get(majorAxis, {x: -3, y: 1})
// -3
```
```js
L.modify(majorAxis, R.negate, {x: -3, y: 1})
// { x: 3, y: 1 }
```

##### <a id="l-cond"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-cond) <a href="#l-cond" title="L.cond: (...[(Maybe s, Index) -&gt; Boolean, POptic s a][, [POptic s a]]) -&gt; POptic s a"><code>L.cond(...[(maybeValue, index) =&gt; testable, consequentOptic][, [alternativeOptic]]) ~&gt; optic</code></a> <small><sup>v13.1.0</sup></small>

`L.cond` creates an optic whose operation is selected from the given optics and
predicates on the underlying view.  See also [`L.condOf`](#l-condof),
[`L.choose`](#l-choose) and [`L.ifElse`](#l-ifelse).

```jsx
L.cond( [ predicate, consequent ]
      , ...
    [ , [ alternative ] ] )
```

`L.cond` is not curried unlike most functions in this library.  `L.cond` can be
given any number of `[predicate, consequent]` pairs.  The *predicates* are
functions on the underlying view and are tested sequentially.  The *consequents*
are optics and `L.cond` acts like the consequent corresponding to the first
predicate that returns true.  The last argument to `L.cond` can be an
`[alternative]` singleton, where the *alternative* is an optic to be used in
case none of the predicates return true.  If all predicates return false and
there is no alternative, `L.cond` acts like [`L.zero`](#l-zero).

For example:

```js
const minorAxis = L.cond(
  [({x, y} = {}) => Math.abs(y) < Math.abs(x), 'y'],
  ['x']
)

L.get(minorAxis, {x: -3, y: 1})
// 1
```
```js
L.modify(minorAxis, R.negate, {x: -3, y: 1})
// { x: -3, y: -1 }
```

Note that it is better to omit the predicate from the alternative

```jsx
L.cond(..., [alternative])
```

than to use a catch all predicate like [`R.T`](http://ramdajs.com/docs/#T)

```jsx
L.cond(..., [R.T, alternative])
```

because in the latter case `L.cond` cannot determine that a user defined
predicate will always be true and has to construct a more expensive optic.

Note that when no `[alternative]` is specified, `L.cond` returns a
[traversal](#traversals), because the default [`L.zero`](#l-zero) is a
traversal.

Note that `L.cond` can be implemented using [`L.choose`](#l-choose), but not
vice versa.  [`L.choose`](#l-choose) not only allows the optic to be chosen
dynamically, but also allows the optic to be constructed dynamically and using
the data at the focus.

##### <a id="l-condof"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-condof) <a href="#l-condof" title="L.condOf: (PTraversal s c, ...[(Maybe c, Index) -&gt; Boolean, POptic s a][, [POptic s a]]) -&gt; POptic s a"><code>L.condOf(traversal, ...[(maybeValue, index) =&gt; testable, consequentOptic][, [alternativeOptic]]) ~&gt; optic</code></a> <small><sup>v13.5.0</sup></small>

`L.condOf` is like [`L.cond`](#l-cond) except the first argument to `L.condOf`
is a traversal whose focuses are tested with the predicates.

```jsx
L.condOf(traversal,
         [ predicate, consequent ]
       , ...
     [ , [ alternative ] ] )
```

`L.condOf` acts like the *consequent* optic of first `[predicate, consequent]`
pair whose *predicate* accepts [any](#l-any) focus produced by the traversal.
The last argument to `L.condOf` can be an `[alternative]` singleton, where the
*alternative* is an optic to be used in case none of the predicates accepts
[any](#l-any) focus produced by the traversal.  If there is no `[alternative]`
[`L.zero`](#l-zero) is used.

For example:

```js
L.get(
  L.condOf(
    'type',
    [R.equals('title'), 'text'],
    [R.equals('text'), 'body']
  ),
  {type: 'text', body: 'Try writing this with `L.cond`.'}
)
// 'Try writing this with `L.cond`.'
```

Note that `L.condOf(t, [p1, o1], ..., [pN, oN], [o])` is roughly equivalent to a
combination of [`L.any`](#l-any) and [`L.cond`](#l-cond): `L.cond([L.any(p1, t),
o1], ..., [L.any(pN, t), oN], [o])`.

Note that when no `[alternative]` is specified, `L.condOf` returns a
[traversal](#traversals), because the default [`L.zero`](#l-zero) is a
traversal.

##### <a id="l-ifelse"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-ifelse) [`L.ifElse((maybeValue, index) => testable, optic, optic) ~> optic`](#l-ifelse "L.ifElse: ((Maybe s, Index) -> Boolean) -> POptic s a -> POptic s a -> POptic s a") <small><sup>v13.1.0</sup></small>

`L.ifElse` creates an optic whose operation is selected based on the given
predicate from the two given optics.  If the predicate is truthy on the value at
focus, the first of the given optics is used.  Otherwise the second of the given
optics is used.  See also [`L.cond`](#l-cond).

For example:

```js
L.modify(L.ifElse(Array.isArray, L.elems, L.values), R.inc, [1, 2, 3])
// [ 2, 3, 4 ]
```

```js
L.modify(L.ifElse(Array.isArray, L.elems, L.values), R.inc, {x: 1, y: 2, z: 3})
// { x: 2, y: 3, z: 4 }
```

##### <a id="l-orelse"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-orelse) [`L.orElse(backupOptic, primaryOptic) ~> optic`](#l-orelse "L.orElse: (POptic s a, POptic s a) -> POptic s a") <small><sup>v2.1.0</sup></small>

`L.orElse(backupOptic, primaryOptic)` acts like `primaryOptic` when its view is
not `undefined` and otherwise like `backupOptic`.  See also
[`L.orAlternatively`](#l-oralternatively).

Note that [`L.choice(...optics)`](#l-choice) is equivalent to
`optics.reduceRight(L.orElse, L.zero)` and [`L.choices(...optics)`](#l-choices)
is equivalent to `optics.reduceRight(L.orElse)`.

#### <a id="indices"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#indices) [Indices](#indices)

The indexing combinators allow one to manipulate the indices passed down by
optics.  Although [optics do not construct paths by default](#on-indexing) one
can use the indexing combinators to construct paths.  Because optics do not
generally depend on the index values, it is also possible to use the index to
pass down arbitrary information.  For example, one could collect contexts or a
list of values from the path to the focus and pass that down as the index.

##### <a id="l-joinix"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-joinIx) [`L.joinIx(optic) ~> optic`](#l-joinix "L.joinIx: POptic s a -> POptic s a") <small><sup>v13.15.0</sup></small>

`L.joinIx` pairs the index produced by the inner optic with the incoming outer
index to form a (nested) path.  In case either index is `undefined`, no pair is
constructed and the other index is produced as is.  See also
[`L.skipIx`](#l-skipix) and [`L.mapIx`](#l-mapix).

For example:

```js
L.get(
  [
    L.joinIx('a'),
    L.joinIx('b'),
    L.joinIx('c'),
    R.pair
  ],
  {a: {b: {c: 'abc'}}}
)
// [ 'abc', [ [ 'a', 'b' ], 'c' ] ]
```

##### <a id="l-mapix"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-mapIx) [`L.mapIx((index, maybeValue) => index) ~> optic`](#l-mapix "L.mapIx: ((Index, Maybe a) -> Index) -> POptic a a") <small><sup>v13.15.0</sup></small>

`L.mapIx` passes the value returned by the given function as the index.

For example:

```js
L.get(
  [
    L.joinIx('a'),
    L.joinIx('b'),
    L.joinIx('c'),
    L.mapIx(L.collect(L.flatten)),
    R.pair
  ],
  {a: {b: {c: 'abc'}}}
)
// [ 'abc', [ 'a', 'b', 'c' ] ]
```

##### <a id="l-reix"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-reIx) [`L.reIx(optic) ~> optic`](#l-reix "L.reIx: POptic s a -> POptic s a") <small><sup>v14.10.0</sup></small>

`L.reIx` replaces the indices of the focuses produced by the given optic with
consecutive integers starting with 0.

For example:

```js
L.remove([L.reIx(L.values), L.when((_, i) => i % 2)], {t: 'f', h: 'i', i: 'n', s: 'e'})
// {t: 'f', i: 'n'}
```

##### <a id="l-setix"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-setIx) [`L.setIx(index) ~> optic`](#l-setix "L.setIx: Index -> POptic a a") <small><sup>v13.15.0</sup></small>

`L.setIx` passes the given value as the index.  Note that `L.setIx(v)` is
equivalent to [`L.mapIx(R.always(v))`](#l-mapix).  See also
[`L.tieIx`](#l-tieix) and [`List` indexing](#list-indexing).

##### <a id="l-skipix"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-skipIx) [`L.skipIx(optic) ~> optic`](#l-skipix "L.skipIx: POptic s a -> POptic s a") <small><sup>v13.15.0</sup></small>

`L.skipIx` passes the incoming outer index as the index from the optic.  See
also [`L.joinIx`](#l-joinix).

For example:

```js
L.get(
  [
    L.joinIx('a'),
    L.skipIx('b'),
    L.joinIx('c'),
    R.pair
  ],
  {a: {b: {c: 'abc'}}}
)
// [ 'abc', [ 'a', 'c' ] ]
```

##### <a id="l-tieix"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-tieIx)[`L.tieIx((innerIndex, outerIndex) => index, optic) ~> optic`](#l-tieix "L.tieIx: ((Index, Index) => Index) -> POptic s a -> POptic s a") <small><sup>v13.15.0</sup></small>

`L.tieIx` sets the index to the result of the given function on the index
produced by the wrapped optic and the index passed from the outer context.

For example:

```js
L.get(
  [
    L.setIx([]),
    L.tieIx(R.append, 'a'),
    L.tieIx(R.append, 'b'),
    L.tieIx(R.append, 'c'),
    R.pair
  ],
  {a: {b: {c: 'abc'}}}
)
// [ 'abc', [ 'a', 'b', 'c' ] ]
```

Note that both [`L.skipIx`](#l-skipix) and [`L.joinIx`](#l-joinix) can be
implemented via `L.tieIx`.

#### <a id="debugging"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#debugging) [Debugging](#debugging)

##### <a id="l-getlog"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-getlog) [`L.getLog(lens, maybeData) ~> maybeValue`](#l-getlog "L.getLog: PLens s a -> Maybe s -> Maybe a") <small><sup>v13.14.0</sup></small>

`L.getLog` returns the element focused on by a [lens](#lenses) from a data
structure like [`L.get`](#l-get), but `L.getLog` also
[`console.log`](https://developer.mozilla.org/en-US/docs/Web/API/Console/log)s
the sequence of values that the corresponding [`L.set`](#l-set) operation would
create.  This can be useful for understanding why a particular value was
returned.  `L.getLog`, like [`L.log`](#l-log), is intended for debugging.

For example:

```js
L.getLog(['data', L.elems, 'y'], {data: [{x: 1}, {y: 2}]})
// { data: [ { x: 1 }, { y: 2 } ] } <= [ { x: 1 }, { y: 2 } ] <= { y: 2 } <= 2
// 2
```

(If you are looking at the above snippet in the interactive version of this
page, then note that the
[`console.log`](https://developer.mozilla.org/en-US/docs/Web/API/Console/log)
function is replaced by [Klipse](https://github.com/viebel/klipse/) and the
replacement function unfortunately does not handle substitution strings
correctly.)

##### <a id="l-log"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-log) [`L.log(...labels) ~> optic`](#l-log "L.log: (...Any) -> POptic s s") <small><sup>v3.2.0</sup></small>

`L.log(...labels)` is an identity optic that outputs
[`console.log`](https://developer.mozilla.org/en-US/docs/Web/API/Console/log)
messages with the given labels (or [format in
Node.js](https://nodejs.org/api/console.html#console_console_log_data)) when
data flows in either direction, `get` or `set`, through the lens.  See also
[`L.getLog`](#l-getlog).

For example:

```js
L.set(['x', L.log('x')], '11', {x: 10})
// x get 10
// x set 11
// { x: '11' }
```
```js
L.set(['x', L.log('%s x: %j')], '11', {x: 10})
// get x: 10
// set x: '11'
// { x: '11' }
```

#### <a id="internals"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#internals) [Internals](#internals)

##### <a id="l-identity-monad"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-identity) [`L.Identity ~> Monad`](#l-identity-monad "L.Identity: Monad") <small><sup>v13.7.0</sup></small>

`L.Identity` is the [Static
Land](https://github.com/rpominov/static-land/blob/master/docs/spec.md)
compatible identity
[`Monad`](https://github.com/rpominov/static-land/blob/master/docs/spec.md#monad)
definition used by Partial Lenses.

##### <a id="l-identityasync"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-identityasync) [`L.IdentityAsync ~> Monadish`](#l-identityasync "L.IdentityAsync: Monadish") <small><sup>v13.12.0</sup></small>

`L.IdentityAsync` is like [`L.Identity`](#l-identity), but allows values to be
[thenable](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/resolve).
[JavaScript promises do not form a
monad](https://buzzdecafe.github.io/2018/04/10/no-promises-are-not-monads),
which explains the "monadish".  Fortunately one usually does not want nested
promises in which case the approximation can be close enough.

##### <a id="l-select-applicative"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-Constant) [`L.Select ~> Applicative`](#l-select-applicative "L.Select: Applicative") <small><sup>v14.0.0</sup></small>

`L.Select` is the [Static
Land](https://github.com/rpominov/static-land/blob/master/docs/spec.md)
compatible
[`Applicative`](https://github.com/rpominov/static-land/blob/master/docs/spec.md#applicative)
definition that extends the constant functor to select the first non-`undefined`
element.

The basis for `Select` is the following
[monoid](https://github.com/rpominov/static-land/blob/master/docs/spec.md#monoid)
over JavaScript values:

```js
const Defined = {
  empty: _ => undefined,
  concat: (l, r) => l !== undefined ? l : r
}
```

It is a monoid, because it satisfies the Monoid laws:

```js
const MonoidLaws = (M, x, y, z) => ({
  associativity: test(M.concat(M.concat(x, y), z), M.concat(x, M.concat(y, z))),
  leftIdentity: test(M.concat(M.empty(), x), x) ,
  rightIdentity: test(M.concat(x, M.empty()), x)
})

MonoidLaws(Defined, {Try: 'any'}, 'JavaScript', ['values'])
// {associativity: true, leftIdentity: true, rightIdentity: true}
```

In Partial Lenses [`undefined` is used to represent
nothingness](#use-of-undefined).

##### <a id="l-tofunction"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-tofunction) [`L.toFunction(optic) ~> optic`](#l-tofunction "L.toFunction: POptic s t a b -> (Maybe s, Index, (Functor|Applicative|Monad) c, (Maybe a, Index) -> c b) -> c t") <small><sup>v7.0.0</sup></small>

`L.toFunction` converts a given optic, which can be a [string](#l-prop), an
[integer](#l-index), an [array](#l-compose), or a function to an optic function.

```
optic = string
      | number
      | [ ...optic ]
      | (x, i) => /* ordinary function = read-only optic */
      | (x, i, F, xi2yF) => /* optic function */
```

This can be useful for implementing new combinators that cannot otherwise be
implemented using the combinators provided by this library.  See also
[`L.traverse`](#l-traverse).

For [isomorphisms](#isomorphisms) and [lenses](#lenses), the returned optic
function will have the signature

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
[`Monad`](https://github.com/rpominov/static-land/blob/master/docs/spec.md#monad)
arguments are expected to conform to their [Static
Land](https://github.com/rpominov/static-land/blob/master/docs/spec.md)
specifications.

Note that, in conjunction with partial optics, it may be advantageous to have
the algebras to allow for partiality.  With traversals it is also possible, for
example, to simply post compose optics with [`L.optional`](#l-optional) to skip
`undefined` elements.

Note that if you simply wish to perform an operation that needs roughly the full
expressive power of the underlying lens encoding, you should use
[`L.traverse`](#l-traverse), because it is independent of the underlying
encoding, while `L.toFunction` essentially exposes the underlying encoding and
it is better to avoid depending on that.

### <a id="transforms"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#transforms) [Transforms](#transforms)

Ordinary [optics](#optics) are passive and bidirectional in such a way that the
same optic can be both read and written through.  The underlying
[implementation](IMPLEMENTATION.md) of this library also allows one to implement
active operations that don't quite provide the same kind of passive
bidirectionality, but can be used to flexibly [modify](#l-modifyop) data
structures.  Such operations are called *transforms* in this library.

Unlike ordinary optics, transforms allow for monadic [sequencing](#l-seq), which
makes it possible to operate on a part of data structure multiple times.  This
allows operations that are impossible to implement using ordinary optics, but
also potentially makes it more difficult to reason about the results.  This
ability also makes it impossible to read through transforms in the same sense as
with ordinary optics.

Recall that [lenses](#lenses) have a single focus and [traversals](#traversals)
have multiple focuses that can then be operated upon using various operations
such as [`L.modify`](#l-modify).  Although it is not strictly enforced by this
library, it is perhaps clearest to think that transforms have no focuses.  A
transform using [transform ops](#transforming), that act as traversals of no
elements, can, and perhaps preferably should, be [empty](#l-isempty) and should
be executed using [`L.transform`](#l-transform), which, unlike
[`L.modify`](#l-modify), takes no user defined operation to apply to focuses.

The line between transforms and optics is not entirely clear cut in the sense
that it is technically possible to use various [transform ops](#transforming)
within an ordinary optic definition.  Furthermore, it is also possible to use
[sequencing](#l-seq) to create transforms that have focuses that can then be
operated upon.  The results of such uses don't quite follow the laws of ordinary
optics, but may sometimes be useful.

#### <a id="operations-on-transforms"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#operations-on-transforms) [Operations on transforms](#operations-on-transforms)

##### <a id="l-transform"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-transform) [`L.transform(optic, maybeData) ~> maybeData`](#l-transform "L.transform: POptic s a -> Maybe s -> Maybe s") <small><sup>v11.7.0</sup></small>

`L.transform(o, s)` is shorthand for [`L.modify(o, x => x, s)`](#l-modify) and
is intended for running [transforms](#transforms) defined using [transform
ops](#transforming).

For example:

```js
L.transform(
  [L.elems, L.modifyOp(x => -x)],
  [1, 2, 3]
)
// [-1, -2, -3]
```

Note that

* [`L.assign(o, x, s)`](#l-assign) is equivalent to [`L.transform([o,
  L.assignOp(x)], s)`](#l-assignop),
* [`L.modify(o, f, s)`](#l-modify) is equivalent to [`L.transform([o,
  L.modifyOp(f)], s)`](#l-modifyop),
* [`L.set(o, x, s)`](#l-set) is equivalent to [`L.transform([o, L.setOp(x)],
  s)`](#l-setop), and
* [`L.remove(o, s)`](#l-remove) is equivalent to [`L.transform([o, L.removeOp],
  s)`](#l-removeop).

##### <a id="l-transformasync"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-transformasync) [`L.transformAsync(optic, maybeData) ~> maybeDataPromise`](#l-transformasync "L.transformAsync: POptic s a -> Maybe s -> Promise (Maybe s)") <small><sup>v13.12.0</sup></small>

`L.transformAsync` is like [`L.transform`](#l-transform), but allows
[`L.modifyOp`](#l-modifyop) operations to be asynchronous.  The result of
`L.transformAsync` is always a
[promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise).

For example:

```js
log(
  L.transformAsync(L.leafs, {
    combine: Promise.resolve('a nested template'),
    of: [Promise.resolve('promises')],
    or: 'constants'
  })
)
// Promise { combine: 'a nested template', of: [ 'promises' ], or: 'constants' }
```

```js
log(
  L.transformAsync(
    [L.elems, L.modifyOp(async x => -x)],
    [1, 2, 3]
  )
)
// Promise [-1, -2, -3]
```

#### <a id="sequencing"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#sequencing) [Sequencing](#sequencing)

The [`L.seq`](#l-seq) combinator allows one to build [transforms](#transforms)
that modify their focus more than once.

##### <a id="l-seq"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-seq) [`L.seq(...transforms) ~> transform`](#l-seq "L.seq: (...PTransform s a) -> PTransform s a") <small><sup>v9.4.0</sup></small>

`L.seq` creates a transform that modifies the focus with each of the given
transforms in sequence.

Here is an example of a bottom-up transform over a data structure of nested
objects and arrays:

```js
const everywhere = L.lazy(
  rec => L.ifElse(R.is(Object), L.seq([L.children, rec], []), [])
)
```

The above `everywhere` transform is similar to the
[`F.everywhere`](https://github.com/polytypic/fastener#F-everywhere) transform
of the [`fastener`](https://github.com/polytypic/fastener) zipper-library.  Note
that the above `everywhere` and the [`primitives`](#l-lazy) example differ in
that `primitives` only targets the non-object and non-array elements of the data
structure while `everywhere` also targets those.

```js
L.modify(everywhere, x => [x], {xs: [{x: 1}, {x: 2}]})
// [ { xs: [ [ [ { x: [ 1 ] } ], [ { x: [ 2 ] } ] ] ] } ]
```

Note that `L.seq`, [`L.choose`](#l-choose), and [`L.setOp`](#l-setop) can be
combined together as a
[`Monad`](https://github.com/rpominov/static-land/blob/master/docs/spec.md#monad)

```jsx
chain(x2t, t) = L.seq(t, L.choose(x2t))
        of(x) = L.setOp(x)
```

which is not the same as the [querying monad](#l-chain).

#### <a id="transforming"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#transforming) [Transforming](#transforming)

##### <a id="l-appendop"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-appendop) [`L.appendOp(value) ~> traversal`](#l-appendop "L.appendOp: a -> PTraversal [a] a") <small><sup>v14.14.0</sup></small>

`L.appendOp(x)` is shorthand for `[L.appendTo, L.setOp(x)]` and can be used to
append a value to an array at focus.

##### <a id="l-assignop"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-assignop) [`L.assignOp(object) ~> traversal`](#l-assignop "L.assignOp: {p1: a1, ...ps} -> PTraversal {p1: a1, ...ps, ...o} {p1: a1, ...ps}") <small><sup>v11.13.0</sup></small>

`L.assignOp` creates a transform that merges the given object into the object in
focus.  When used as a traversal, `L.assignOp` acts as a traversal of no
elements.  Usually, however, `L.assignOp` is used within
[transforms](#transforms).

For example:

```js
L.transform([L.elems, L.assignOp({y: 1})], [{x: 3}, {x: 4, y: 5}])
// [ { x: 3, y: 1 }, { x: 4, y: 1 } ]
```

##### <a id="l-modifyop"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-modifyop) [`L.modifyOp((maybeValue, index) => maybeValue) ~> traversal`](#l-modifyop "L.modifyOp: ((Maybe a, Index) -> Maybe a) -> PTraversal a a") <small><sup>v11.7.0</sup></small>

`L.modifyOp` creates a transform that maps the focus with the given function.
When used as a traversal, `L.modifyOp` acts as a traversal of no elements.
Usually, however, `L.modifyOp` is used within [transforms](#transforms).

For example:

```js
L.transform(
  L.branch({
    xs: [L.elems, L.modifyOp(R.inc)],
    z: [L.optional, L.modifyOp(R.negate)],
    ys: [L.elems, L.modifyOp(R.dec)]
  }),
  {xs: [1, 2, 3], ys: [1, 2, 3]}
)
// { xs: [ 2, 3, 4 ],
//   ys: [ 0, 1, 2 ] }
```

##### <a id="l-prependop"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-prependop) [`L.prependOp(value) ~> traversal`](#l-prependop "L.prependOp: a -> PTraversal [a] a") <small><sup>v14.14.0</sup></small>

`L.prependOp(x)` is shorthand for `[L.prependTo, L.setOp(x)]` and can be used to
prepend a value to an array at focus.

##### <a id="l-removeop"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-removeop) [`L.removeOp ~> traversal`](#l-removeop "L.removeOp: PTraversal a a") <small><sup>v11.7.0</sup></small>

`L.removeOp` is shorthand for [`L.setOp(undefined)`](#l-setop).

Here is an example based on a question from a user:

```js
const sampleToFilter = {
  elements: [
    {time: 1, subelements: [1, 2, 3, 4]},
    {time: 2, subelements: [1, 2, 3, 4]},
    {time: 3, subelements: [1, 2, 3, 4]}
  ]
}

L.transform(
  [
    'elements',
    L.elems,
    L.ifElse(
      elem => elem.time < 2,
      L.removeOp,
      ['subelements', L.elems, L.when(i => i < 3), L.removeOp]
    )
  ],
  sampleToFilter
)
// { elements: [ { time: 2, subelements: [ 3, 4 ] },
//               { time: 3, subelements: [ 3, 4 ] } ] }
```

The idea is to filter the data both by `time` and by `subelements`.

##### <a id="l-setop"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-setop) [`L.setOp(maybeValue) ~> traversal`](#l-setop "L.setOp: Maybe a -> PTraversal a a") <small><sup>v11.7.0</sup></small>

`L.setOp(x)` is shorthand for [`L.modifyOp(R.always(x))`](#l-modifyop).

### <a id="traversals"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#traversals) [Traversals](#traversals)

A traversal operates over a collection of non-overlapping focuses that are
visited only once and can, for example, be [collected](#l-collect),
[folded](#l-concatas), [modified](#l-modify), [set](#l-set) and
[removed](#l-remove).  Put in another way, a traversal specifies a set of paths
to elements in a data structure.

#### <a id="creating-new-traversals"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#creating-new-traversals) [Creating new traversals](#creating-new-traversals)

##### <a id="l-branch"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-branch) [`L.branch({prop: traversal, ...props}) ~> traversal`](#l-branch "L.branch: {p1: PTraversal p1 a, ...pts} -> PTraversal {p1: p1, ...ps} a") <small><sup>v5.1.0</sup></small>

`L.branch` creates a new traversal from a given possibly nested template object
that specifies how the new traversal should visit the properties of an object.
If one thinks of traversals as specifying sets of paths, then the template can
be seen as mapping each property to a set of paths to traverse.

For example:

```js
L.collect(
  L.branch({first: L.elems, second: {value: []}}),
  {first: ['x'], second: {value: 'y'}}
)
// [ 'x', 'y' ]
```

The use of [`[]`](#l-identity) above might be puzzling at first.
[`[]`](#l-identity) essentially specifies an empty path.  So, when a property is
mapped to [`[]`](#l-identity) in the template given to `L.branch`, it means that
the element is to be visited by the resulting traversal.

Note that `L.branch` is equivalent to [`L.branchOr(L.zero)`](#l-branchor).

Note that you can also compose `L.branch` with other optics.  For example, you
can compose with [`L.pick`](#l-pick) to create a traversal over specific
elements of an array:

```js
L.modify(
  [L.pick({z: 2, x: 0}), L.branch({x: [], z: []})],
  R.negate,
  [1, 2, 3]
)
// [ -1, 2, -3 ]
```

See the [BST traversal](#bst-traversal) section for a more meaningful example.

##### <a id="l-branchor"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-branchor) [`L.branchOr(traversal, {prop: traversal, ...props}) ~> traversal`](#l-branchor "L.branchOr: PTraversal p a -> {p1: PTraversal p1 a, ...pts} -> PTraversal {p1: p1, ...ps} a") <small><sup>v13.2.0</sup></small>

`L.branchOr` creates a new traversal from a given traversal and a given possibly
nested template object.  The template specifies how the new traversal should
visit the corresponding properties of an object.  The separate traversal is used
for properties not defined in the template.

For example:

```js
L.transform(L.branchOr(L.modifyOp(R.inc), {x: L.modifyOp(R.dec)}), {x: 0, y: 0})
// { x: -1, y: 1 }
```

Note that [`L.branch`](#l-branch) is equivalent to
[`L.branchOr(L.zero)`](#l-zero) and [`L.values`](#l-values) is equivalent to
[`L.branchOr([], {})`](#l-identity).

##### <a id="l-branches"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-branches) [`L.branches(...propNames) ~> traversal`](#l-branches "L.branches: (p1: PTraversal p1 a, ...pts) -> PTraversal {p1: p1, ...ps} a") <small><sup>v13.5.0</sup></small>

`L.branches` creates a new traversal that visits the specified properties of an
object.  `L.branches(p1, ..., pN)` is equivalent to [`L.branch({[p1]: [],
..., [pN]: []})`](#l-branch).

#### <a id="traversals-and-combinators"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#traversals-and-combinators) [Traversals and combinators](#traversals-and-combinators)

##### <a id="l-children"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-children) [`L.children ~> traversal`](#l-children "L.children: PTraversal ([a] | {p: a, ...ps}) a") <small><sup>v13.3.0</sup></small>

`L.children` is a traversal over the immediate children of the ordinary array or
plain object in focus.  Children of objects whose constructor is neither `Array`
nor `Object` are not traversed.  See also [`L.leafs`](#l-leafs).

For example:

```js
L.modify(L.children, R.negate, {x: 3, y: 1})
// {x: -3, y: -1}
```

```js
L.modify(L.children, R.negate, [1, 2, 3])
// [-1, -2, -3]
```

##### <a id="l-elems"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-elems) [`L.elems ~> traversal`](#l-elems "L.elems: PTraversal [a] a") <small><sup>v7.3.0</sup></small>

`L.elems` is a traversal over the elements of an [array-like](#array-like)
object.  When written through, `L.elems` always produces an `Array`.  See also
[`L.values`](#l-values) and [`L.elemsTotal`](#l-elemstotal).

For example:

```js
L.modify(['xs', L.elems, 'x'], R.inc, {xs: [{x: 1}, {x: 2}]})
// { xs: [ { x: 2 }, { x: 3 } ] }
```

Just like with other optics operating on [array-like](#array-like) objects, when
manipulating non-`Array` objects, [`L.rewrite`](#l-rewrite) can be used to
convert the result to the desired type, if necessary:

```js
L.modify(
  [L.rewrite(xs => Int8Array.from(xs)), L.elems],
  R.inc,
  Int8Array.from([-1, 4, 0, 2, 4])
)
// Int8Array [ 0, 5, 1, 3, 5 ]
```

##### <a id="l-elemstotal"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-elemstotal) [`L.elemsTotal ~> traversal`](#l-elemstotal "L.elemsTotal: PTraversal [a] a") <small><sup>v13.11.0</sup></small>

`L.elemsTotal` is a traversal over the elements of an [array-like](#array-like)
object.  When written through, `L.elemsTotal` always produces an `Array`.
Unlike [`L.elems`](#l-elems), `L.elemsTotal` does not remove `undefined`
elements from the resulting array when written through.

For example:

```js
L.modify([L.elemsTotal, L.when(R.is(Number))], R.negate, [1, undefined, 2])
// [-1, undefined, -2]
```

##### <a id="l-entries"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-entries) [`L.entries ~> traversal`](#l-entries "L.entries: PTraversal {p: a, ...ps} [String, a]") <small><sup>v11.21.0</sup></small>

`L.entries` is a traversal over the entries, or `[key, value]` pairs, of an
object.

For example:

```js
L.modify(L.entries, ([k, v]) => [v, k], {x: 'a', y: 'b'})
// { a: 'x', b: 'y' }
```

##### <a id="l-flatten"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-flatten) [`L.flatten ~> traversal`](#l-flatten "L.flatten: PTraversal [...[a]...] a") <small><sup>v11.16.0</sup></small>

`L.flatten` is a traversal over the elements of arbitrarily nested arrays.
Other [array-like](#array-like) objects are treated as elements by `L.flatten`.
In case the immediate target of `L.flatten` is neither `undefined` nor an array,
it is traversed.

For example:

```js
L.join(' ', L.flatten, [[[1]], ['2'], 3])
// '1 2 3'
```

##### <a id="l-keys"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-keys) [`L.keys ~> traversal`](#l-keys "L.keys: PTraversal {p: a, ...ps} String") <small><sup>v11.21.0</sup></small>

`L.keys` is a traversal over the keys of an object.  See also
[`L.keysEverywhere`](#l-keyseverywhere).

For example:

```js
L.modify(L.keys, R.toUpper, {x: 1, y: 2})
// { X: 1, Y: 2 }
```

##### <a id="l-keyseverywhere"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-keyseverywhere) [`L.keysEverywhere ~> traversal`](#l-keyseverywhere "L.keysEverywhere: PTraversal JSON String") <small><sup>v14.12.0</sup></small>

`L.keysEverywhere` is a traversal over the keys of objects inside arbitrarily
nested ordinary arrays and plain objects.  See also [`L.keys`](#l-keys).

One use case for `L.keysEverywhere` is to use it with [`L.applyAt`](#l-applyat)
to convert keys of objects.  For example:

```js
const kebabIcamel = L.iso(_.camelCase, _.kebabCase)
const kebabsIcamels = L.applyAt(L.keysEverywhere, kebabIcamel)

L.get(kebabsIcamels, [{'kebab-case': 'is'}, {'translated-to': 'camelCase'}])
// [{kebabCase': 'is'}, {translatedTo: 'camelCase'}]
```

Note that `L.keysEverywhere` is roughly equivalent to:

```js
const keysEverywhere = L.lazy(rec => L.cond(
  [R.is(Array), [L.elems, rec]],
  [R.is(Object), [L.entries, L.elems, L.ifElse((_, i) => i === 0, [], rec)]]
))
```

The difference is that `L.keysEverywhere` does not traverse objects that have an
interesting prototype.

##### <a id="l-leafs"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-leafs) [`L.leafs ~> traversal`](#l-leafs "L.leafs: PTraversal JSON (String|Number|Boolean|null|~JSON)") <small><sup>v13.3.0</sup></small>

`L.leafs` is a traversal that descends into ordinary arrays and plain objects
and focuses on non-`undefined` elements whose constructor is neither `Array` nor
`Object`.  See also [`L.children`](#l-children).

For example:

```js
L.modify(L.leafs, R.negate, [{x: 1, y: [2]}, 3])
// [{x: -1, y: [-2]}, -3]
```

##### <a id="l-limit"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-limit) [`L.limit(count, traversal) ~> traversal`](#l-limit "L.limit: Integer -> PTraversal s a -> PTraversal s a") <small><sup>v14.10.0</sup></small>

`L.limit` limits the number of focuses traversed via the given traversal.  See
also [`L.offset`](#l-offset) and [`L.subseq`](#l-subseq).

For example:

```js
L.modify(L.limit(2, L.elems), R.negate, [3, 1, 4])
// [-3, -1, 4]
```

##### <a id="l-matches-g"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-matches-g) [`L.matches(/.../g) ~> traversal`](#l-matches-g "L.matches: RegExp -> PTraversal String String") <small><sup>v10.4.0</sup></small>

`L.matches`, when given a regular expression with the
[`global`](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/RegExp/global)
flag, `/.../g`, is a partial traversal over the matches that the regular
expression gives over the focused string.  See also [`L.matches`](#l-matches).

For example:

```js
L.collect(
  [
    L.matches(/[^&=?]+=[^&=]+/g),
    L.pick({name: L.matches(/^[^=]+/), value: L.matches(/[^=]+$/)})
  ],
  '?first=foo&second=bar'
)
// [ { name: 'first', value: 'foo' },
//   { name: 'second', value: 'bar' } ]
```

Note that an empty match terminates the traversal.  It is possible to make use
of that feature, but it is also possible that an empty match is due to an
incorrect regular expression that can match the empty string.

##### <a id="l-offset"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-offset) [`L.offset(count, traversal) ~> traversal`](#l-offset "L.offset: Integer -> PTraversal s a -> PTraversal s a") <small><sup>v14.10.0</sup></small>

`L.offset` offsets skips the given number of focuses from the beginning of the
given traversal.  See also [`L.limit`](#l-limit) and [`L.subseq`](#l-subseq).

For example:

```js
L.modify(L.offset(1, L.elems), R.negate, [3, 1, 4])
// [3, -1, -4]
```

##### <a id="l-query"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-query) [`L.query(...traversals) ~> traversal`](#l-query "L.query: (PTraversal s1 s2, ...PTraversal sN a) ~> PTraversal JSON a") <small><sup>v13.6.0</sup></small>

`L.query` is a [traversal](#traversals) that searches for
[defined](#l-isdefined) elements within a nested data structure of ordinary
arrays and plain objects that are focused on by the given sequence of
traversals.  `L.query` gives similar power as the [descendant
combinator](https://developer.mozilla.org/en-US/docs/Web/CSS/Descendant_selectors)
of CSS selectors.

Recall the [tutorial](#tutorial) example.  Perhaps the easiest way to focus on
all the texts is to just query for them:

```js
L.collect(L.query('text'), sampleTitles)
// [ 'Title', 'Rubrik' ]
```

So, to convert all the texts to upper case, one could write:

```js
L.modify(L.query('text'), R.toUpper, sampleTitles)
// { titles: [
//     { language: 'en', text: 'TITLE' },
//     { language: 'sv', text: 'RUBRIK' } ] }
```

To only modify the text of a specific language, one could write:

```js
L.modify(
  L.query(L.when(R.propEq('language', 'en')), 'text'),
  R.toUpper,
  sampleTitles
)
// { titles: [
//     { language: 'en', text: 'TITLE' },
//     { language: 'sv', text: 'Rubrik' } ] }
```

And one can also view the text of a specific language:

```js
L.get(L.query(L.when(R.propEq('language', 'sv')), 'text'), sampleTitles)
// 'Rubrik'
```

Like CSS selectors, `L.query` can be quite convenient, but should be used with
care.  The search for matching elements can be expensive and specifying a query
that matches precisely the desired elements can be difficult.

Note that `L.query(...ts)` is roughly equivalent to [`ts.map(t =>
[L.satisfying(L.isDefined(t)), t])`](#l-satisfying) and
[`L.query(L.when(predicate))`](#l-when) is roughly equivalent to
[`L.satisfying(predicate)`](#l-satisfying).

##### <a id="l-satisfying"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-satisfying) [`L.satisfying((maybeValue, index) => testable) ~> traversal`](#l-satisfying "L.satisfying: ((Maybe s, Index) -> Boolean) -> PTraversal JSON a") <small><sup>v13.3.0</sup></small>

`L.satisfying` is a traversal that focuses on elements that satisfy the given
predicate within a nested data structure of ordinary arrays and plain objects.
Children of objects whose constructor is neither `Array` nor `Object` are not
traversed.  See also [`L.query`](#l-query) and [`L.whereEq`](#l-whereeq).

##### <a id="l-subseq"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-subseq) [`L.subseq(begin, end, traversal) ~> traversal`](#l-subseq "L.subseq: Integer -> Integer -> PTraversal s a -> PTraversal s a") <small><sup>v14.10.0</sup></small>

`L.subseq` only traverses the focuses between the `begin`:th (inclusive) and the
`end`:th (exclusive) from the given traversal.  See also [`L.offset`](#l-offset)
and [`L.limit`](#l-limit).

For example:

```js
L.modify(L.subseq(1, 2, L.elems), R.negate, [3, 1, 4])
// [3, -1, 4]
```

Note that `L.subseq` works in linear time with respect to the number of focuses
produced by the traversal given to `L.subseq`.

##### <a id="l-values"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-values) [`L.values ~> traversal`](#l-values "L.values: PTraversal {p: a, ...ps} a") <small><sup>v7.3.0</sup></small>

`L.values` is a traversal over the values of an `instanceof Object`.  When
written through, `L.values` always produces an `Object`.  See also
[`L.elems`](#l-elems).

For example:

```js
L.modify(L.values, R.negate, {a: 1, b: 2, c: 3})
// { a: -1, b: -2, c: -3 }
```

When manipulating objects with a non-`Object` constructor

```js
const XYZ = class {
  constructor(x, y, z) {
    Object.assign(this, {x, y, z})
  }
  norm() {
    const {x, y, z} = this
    return x * x + y * y + z * z
  }
}
```

[`L.rewrite`](#l-rewrite) can be used to convert the result to the desired type,
if necessary:

```js
const objectTo = C => o => Object.assign(Object.create(C.prototype), o)

L.modify([L.rewrite(objectTo(XYZ)), L.values], R.negate, new XYZ(1, 2, 3))
// XYZ { x: -1, y: -2, z: -3 }
```

Note that `L.values` is equivalent to [`L.branchOr([], {})`](#l-branchor).

##### <a id="l-whereeq"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-whereeq) [`L.whereEq({prop: value, ...props}) ~> traversal`](#l-whereeq "L.whereEq: {p1: p1, ...ps} -> PTraversal JSON {p1: p1, ...ps}") <small><sup>v14.16.0</sup></small>

`L.whereEq` looks for objects that match the given possibly nested object
template of values within an arbitrarily nested data structure of plain arrays
and objects.  See also [`L.satisfying`](#l-satisfying).

For example:

```js
L.get(
  L.whereEq({key: 2}),
  {key: 3, value: 'a', lhs: {key: 1, value: 'r'}, rhs: {key: 2, value: 'd'}}
)
// { key: 2, value: 'd' }
```

Note that `L.whereEq` can be implemented as follows:

```js
const whereEq = template =>
  L.satisfying(L.and(L.branch(L.modify(L.leafs, L.is, template))))
```

#### <a id="querying"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#querying) [Querying](#querying)

Querying combinators allow one to use optics to query data structures.  Querying
is distinguished from [adapting](#adapting) in that querying defaults to an
empty or read-only [zero](#l-zero).

##### <a id="l-chain"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-chain) [`L.chain((value, index) => optic, optic) ~> traversal`](#l-chain "L.chain: ((a, Index) -> POptic s b) -> POptic s a -> PTraversal s b") <small><sup>v3.1.0</sup></small>

`L.chain` provides a monadic
[chain](https://github.com/rpominov/static-land/blob/master/docs/spec.md#chain)
combinator for querying with optics.  `L.chain(toOptic, optic)` is equivalent to

```jsx
L.compose(
  optic,
  L.choose(
    (value, index) => value === undefined ? L.zero : toOptic(value, index)
  )
)
```

Note that with the [`R.always`](http://ramdajs.com/docs/#always), `L.chain`,
[`L.choice`](#l-choice) and [`L.zero`](#l-zero) combinators, one can consider
optics as subsuming the maybe monad.

##### <a id="l-choice"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-choice) [`L.choice(...optics) ~> traversal`](#l-choice "L.choice: (...POptic s a) -> PTraversal s a") <small><sup>v2.1.0</sup></small>

`L.choice` returns a partial optic that acts like the first of the given optics
whose view is not `undefined` on the given data structure.  When the views of
all of the given optics are `undefined`, the returned optic acts like
[`L.zero`](#l-zero), which is the identity element of `L.choice`.  See also
[`L.choices`](#l-choices).

For example:

```js
L.modify([L.elems, L.choice('a', 'd')], R.inc, [{R: 1}, {a: 1}, {d: 2}])
// [ { R: 1 }, { a: 2 }, { d: 3 } ]
```

##### <a id="l-optional"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-optional) [`L.optional ~> traversal`](#l-optional "L.optional: PTraversal a a") <small><sup>v3.7.0</sup></small>

`L.optional` is an optic over an optional element.  When used as a traversal,
and the focus is `undefined`, the traversal is empty.  When used as a lens, and
the focus is `undefined`, the lens will be read-only.

As an example, consider the difference between:

```js
L.set([L.elems, 'x'], 3, [{x: 1}, {y: 2}])
// [ { x: 3 }, { y: 2, x: 3 } ]
```

and:

```js
L.set([L.elems, 'x', L.optional], 3, [{x: 1}, {y: 2}])
// [ { x: 3 }, { y: 2 } ]
```

Note that `L.optional` is equivalent to [`L.when(x => x !==
undefined)`](#l-when).

##### <a id="l-unless"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-unless) [`L.unless((maybeValue, index) => testable) ~> traversal`](#l-unless "L.unless: ((Maybe a, Index) -> Boolean) -> PTraversal a a") <small><sup>v12.1.0</sup></small>

`L.unless` allows one to selectively skip elements within a traversal.  See also
[`L.when`](#l-when).

For example:

```js
L.modify([L.elems, L.unless(x => x < 0)], R.negate, [0, -1, 2, -3, 4])
// [ -0, -1, -2, -3, -4 ]
```

##### <a id="l-when"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-when) [`L.when((maybeValue, index) => testable) ~> traversal`](#l-when "L.when: ((Maybe a, Index) -> Boolean) -> PTraversal a a") <small><sup>v5.2.0</sup></small>

`L.when` allows one to selectively skip elements within a traversal.  See also
[`L.unless`](#l-unless).

For example:

```js
L.modify([L.elems, L.when(x => x > 0)], R.negate, [0, -1, 2, -3, 4])
// [ 0, -1, -2, -3, -4 ]
```

Note that `L.when(p)` is equivalent to [`L.choose((x, i) => p(x, i) ?
L.identity : L.zero)`](#l-choose).

##### <a id="l-zero"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-zero) [`L.zero ~> traversal`](#l-zero "L.zero: PTraversal s a") <small><sup>v6.0.0</sup></small>

`L.zero` is a traversal of no elements and is the identity element of
[`L.choice`](#l-choice) and [`L.chain`](#l-chain).

For example:

```js
L.collect(
  [L.elems, L.cond([R.is(Array),  L.elems], [R.is(Object), 'x'], [L.zero])],
  [1, {x: 2}, [3, 4]]
)
// [ 2, 3, 4 ]
```

#### <a id="folds-over-traversals"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#folds-over-traversals) [Folds over traversals](#folds-over-traversals)

##### <a id="l-all"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-all) [`L.all((maybeValue, index) => testable, traversal, maybeData) ~> boolean`](#l-all "L.all: ((Maybe a, Index) -> Boolean) -> PTraversal s a -> Boolean") <small><sup>v9.6.0</sup></small>

`L.all` determines whether all of the elements focused on by the given traversal
satisfy the given predicate.

For example:

```js
L.all(
  x => 1 <= x && x <= 6,
  primitives,
  [[[1], 2], {y: 3}, [{l: 4, r: [5]}, {x: 6}]]
)
// true
```

See also: [`L.any`](#l-any), [`L.none`](#l-none), and
[`L.getAs`](#l-getas).

##### <a id="l-all1"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-all1) [`L.all1((maybeValue, index) => testable, traversal, maybeData) ~> boolean`](#l-all1 "L.all1: ((Maybe a, Index) -> Boolean) -> PTraversal s a -> Boolean") <small><sup>v14.4.0</sup></small>

`L.all1` determines whether all and at least one of the elements focused on by
the given traversal satisfy the given predicate.

##### <a id="l-and"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-and) [`L.and(traversal, maybeData) ~> boolean`](#l-and "L.and: PTraversal s Boolean -> Boolean") <small><sup>v9.6.0</sup></small>

`L.and` determines whether all of the elements focused on by the given traversal
are truthy.

For example:

```js
L.and(L.elems, [])
// true
```

Note that `L.and` is equivalent to [`L.all(x => x)`](#l-all).  See also:
[`L.or`](#l-or).

##### <a id="l-and1"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-and1) [`L.and1(traversal, maybeData) ~> boolean`](#l-and1 "L.and1: PTraversal s Boolean -> Boolean") <small><sup>v14.4.0</sup></small>

`L.and1` determines whether all and at least one of the elements focused on by
the given traversal are truthy.

##### <a id="l-any"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-any) [`L.any((maybeValue, index) => testable, traversal, maybeData) ~> boolean`](#l-any "L.any: ((Maybe a, Index) -> Boolean) -> PTraversal s a -> Boolean") <small><sup>v9.6.0</sup></small>

`L.any` determines whether any of the elements focused on by the given traversal
satisfy the given predicate.

For example:

```js
L.any(x => x > 5, primitives, [[[1], 2], {y: 3}, [{l: 4, r: [5]}, {x: 6}]])
// true
```

See also: [`L.all`](#l-all), [`L.none`](#l-none), and
[`L.getAs`](#l-getas).

##### <a id="l-collect"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-collect) [`L.collect(traversal, maybeData) ~> [...values]`](#l-collect "L.collect: PTraversal s a -> Maybe s -> [a]") <small><sup>v3.6.0</sup></small>

`L.collect` returns an array of the non-`undefined` elements focused on by the
given traversal or lens from a data structure.  See also
[`L.collectTotal`](#l-collecttotal).

For example:

```js
L.collect(['xs', L.elems, 'x'], {xs: [{x: 1}, {x: 2}]})
// [ 1, 2 ]
```

Note that `L.collect` is equivalent to [`L.collectAs(x => x)`](#l-collectas).

##### <a id="l-collectas"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-collectas) [`L.collectAs((maybeValue, index) => maybeValue, traversal, maybeData) ~> [...values]`](#l-collectas "L.collectAs: ((Maybe a, Index) -> Maybe b) -> PTraversal s a -> Maybe s -> [b]") <small><sup>v7.2.0</sup></small>

`L.collectAs` returns an array of the non-`undefined` values returned by the
given function from the elements focused on by the given traversal.  See also
[`L.collectTotalAs`](#l-collecttotalas).

For example:

```js
L.collectAs(R.negate, ['xs', L.elems, 'x'], {xs: [{x: 1}, {x: 2}]})
// [ -1, -2 ]
```

`L.collectAs(toMaybe, traversal, maybeData)` is equivalent to
[`L.concatAs(toCollect, Collect, [traversal, toMaybe], maybeData)`](#l-concatas)
where `Collect` and `toCollect` are defined as follows:

```js
const Collect = {empty: R.always([]), concat: R.concat}
const toCollect = x => x !== undefined ? [x] : []
```

So:

```js
L.concatAs(
  toCollect,
  Collect,
  ['xs', L.elems, 'x', R.negate],
  {xs: [{x: 1}, {x: 2}]}
)
// [ -1, -2 ]
```

The internal implementation of `L.collectAs` is optimized and faster than the
above [naïve implementation](IMPLEMENTATION.md).

##### <a id="l-collecttotal"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-collecttotal) [`L.collectTotal(traversal, maybeData) ~> [...maybeValues]`](#l-collecttotal "L.collectTotal: PTraversal s a -> Maybe s -> [Maybe a]") <small><sup>v14.6.0</sup></small>

`L.collectTotal` returns an array of the elements focused on by the given
traversal or lens from a data structure.  See also [`L.collect`](#l-collect).

```js
L.collectTotal([L.elems, 'x'], [{x: 'a'}, {y: 'b'}])
// ['a', undefined]
```

##### <a id="l-collecttotalas"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-collecttotalas) [`L.collectTotalAs((maybeValue, index) => maybeValue, traversal, maybeData) ~> [...maybeValues]`](#l-collecttotalas "L.collectTotalAs: ((Maybe a, Index) -> Maybe b) -> PTraversal s a -> Maybe s -> [Maybe b]") <small><sup>v14.6.0</sup></small>

`L.collectTotalAs` returns an array of the values returned by the given function
from the elements focused on by the given traversal.  See also
[`L.collectAs`](#l-collectas).

##### <a id="l-concat"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-concat) [`L.concat(monoid, traversal, maybeData) ~> value`](#l-concat "L.concat: Monoid a -> (PTraversal s a -> Maybe s -> a)") <small><sup>v7.2.0</sup></small>

`L.concat({empty, concat}, t, s)` performs a fold, using the given `concat` and
`empty` operations, over the elements focused on by the given traversal or lens
`t` from the given data structure `s`.  The `concat` operation and the constant
returned by `empty()` should form a
[monoid](https://github.com/rpominov/static-land/blob/master/docs/spec.md#monoid)
over the values focused on by `t`.

For example:

```js
const Sum = {empty: () => 0, concat: (x, y) => x + y}
L.concat(Sum, L.elems, [1, 2, 3])
// 6
```

Note that `L.concat` is staged so that after given the first argument,
`L.concat(m)`, a computation step is performed.

##### <a id="l-concatas"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-concatas) [`L.concatAs((maybeValue, index) => value, monoid, traversal, maybeData) ~> value`](#l-concatas "L.concatAs: ((Maybe a, Index) -> r) -> Monoid r -> (PTraversal s a -> Maybe s -> r)") <small><sup>v7.2.0</sup></small>

`L.concatAs(xMi2r, {empty, concat}, t, s)` performs a map, using given function
`xMi2r`, and fold, using the given `concat` and `empty` operations, over the
elements focused on by the given traversal or lens `t` from the given data
structure `s`.  The `concat` operation and the constant returned by `empty()`
should form a
[monoid](https://github.com/rpominov/static-land/blob/master/docs/spec.md#monoid)
over the values returned by `xMi2r`.

For example:

```js
L.concatAs(x => x, Sum, L.elems, [1, 2, 3])
// 6
```

Note that `L.concatAs` is staged so that after given the first two arguments,
`L.concatAs(f, m)`, a computation step is performed.

##### <a id="l-count"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-count) [`L.count(traversal, maybeData) ~> number`](#l-count "L.count: PTraversal s a -> Number") <small><sup>v9.7.0</sup></small>

`L.count` goes through all the elements focused on by the traversal and counts
the number of non-`undefined` elements.

For example:

```js
L.count([L.elems, 'x'], [{x: 11}, {y: 12}])
// 1
```

##### <a id="l-countif"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-countif) [`L.countIf((maybeValue, index) => testable, traversal, maybeData) ~> number`](#l-countif "L.countIf: ((Maybe a, Index) -> Boolean) -> PTraversal s a -> Number") <small><sup>v11.2.0</sup></small>

`L.countIf` goes through all the elements focused on by the traversal and counts
the number of elements for which the given predicate returns a truthy value.

For example:

```js
L.countIf(L.isDefined('x'), L.elems, [{x: 11}, {y: 12}])
// 1
```

##### <a id="l-counts"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-counts) [`L.counts(traversal, maybeData) ~> map`](#l-counts "L.counts: PTraversal s a -> Map Any Number") <small><sup>v11.21.0</sup></small>

`L.counts` returns a
[map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)
of the counts of distinct values, including `undefined`, focused on by the given
traversal.

For example:

```js
Array.from(L.counts(L.elems, [3, 1, 4, 1]).entries())
// [[3, 1], [1, 2], [4, 1]]
```

##### <a id="l-countsas"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-countsas) [`L.countsAs((maybeValue, index) => any, traversal, maybeData) ~> map`](#l-countsas "L.countsAs: ((Maybe a, Index) -> Any) -> PTraversal s a -> Map Any Number") <small><sup>v11.21.0</sup></small>

`L.countsAs` returns a
[map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)
of the counts of distinct values, including `undefined`, returned by the given
function from the values focused on by the given traversal.

For example:

```js
Array.from(L.countsAs(Math.abs, L.elems, [3, -1, 4, 1]).entries())
// [[3, 1], [1, 2], [4, 1]]
```

##### <a id="l-foldl"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-foldl) [`L.foldl((value, maybeValue, index) => value, value, traversal, maybeData) ~> value`](#l-foldl "L.foldl: ((r, Maybe a, Index) -> r) -> r -> PTraversal s a -> Maybe s -> r") <small><sup>v7.2.0</sup></small>

`L.foldl` performs a fold from left over the elements focused on by the given
traversal.  This is much like the
[`reduce`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce)
method of JavaScript arrays.

For example:

```js
L.foldl((x, y) => x + y, 0, L.elems, [1, 2, 3])
// 6
```

Note that [`L.forEachWith`](#l-foreachwith) is much like an imperative version
of `L.foldl`.  Consider using it instead of using `L.foldl` with an imperative
accumulator procedure.

##### <a id="l-foldr"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-foldr) [`L.foldr((value, maybeValue, index) => value, value, traversal, maybeData) ~> value`](#l-foldr "L.foldr: ((r, Maybe a, Index) -> r) -> r -> PTraversal s a -> Maybe s -> r") <small><sup>v7.2.0</sup></small>

`L.foldr` performs a fold from right over the elements focused on by the given
traversal.  This is much like the
[`reduceRight`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/ReduceRight)
method of JavaScript arrays.

For example:

```js
L.foldr((x, y) => x * y, 1, L.elems, [1, 2, 3])
// 6
```

##### <a id="l-foreach"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-foreach) [`L.forEach((maybeValue, index) => undefined, traversal, maybeData) ~> undefined`](#l-foreach "L.forEach: ((Maybe a, Index) -> Undefined) -> PTraversal s a -> Maybe s -> Undefined") <small><sup>v11.20.0</sup></small>

`L.forEach` calls the given function for each focus of the traversal.

For example:

```js
L.forEach(console.log, [L.elems, 'x', L.elems], [{x: [3]}, {x: [1, 4]}, {x: [1]}])
// 3 0
// 1 0
// 4 1
// 1 0
```

##### <a id="l-foreachwith"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-foreachwith) [`L.forEachWith(() => context, (context, maybeValue, index) => undefined, traversal, maybeData) ~> context`](#l-foreachwith "L.forEachWith: (() -> c) -> ((c, Maybe a, Index) -> Undefined) -> PTraversal s a -> Maybe s -> c") <small><sup>v13.4.0</sup></small>

`L.forEachWith` first calls the given thunk to get or create a context.  Then it
calls the given function, with context as the first argument, for each focus of
the traversal.  Finally the context is returned.  This is much like an
imperative version of [`L.foldl`](#l-foldl).

For example:

```js
L.forEachWith(() => new Map(), (m, v, k) => m.set(k, v), L.values, {x: 2, y: 1})
// Map { 'x' => 2, 'y' => 1 }
```

Note that a new `Map` is returned each time the above expression is evaluated.

##### <a id="l-get"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-get) [`L.get(traversal, maybeData) ~> maybeValue`](#l-get "L.get: PTraversal s a -> Maybe s -> Maybe a") <small><sup>v9.8.0</sup></small>

`L.get` returns the element focused on by a [lens](#lenses) from a data
structure or goes lazily over the elements focused on by the given
[traversal](#traversals) and returns the first non-`undefined` element.  See
also [`L.getLog`](#l-getlog).

For example:

```js
L.get('y', {x: 112, y: 101})
// 101
```

```js
L.get([L.elems, 'y'], [{x:1}, {y:2}, {z:3}])
// 2
```

Note that `L.get` is equivalent to [`L.getAs(x => x)`](#l-getas).

##### <a id="l-getas"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-getas) [`L.getAs((maybeValue, index) => maybeValue, traversal, maybeData) ~> maybeValue`](#l-getas "L.getAs: ((Maybe a, Index) -> Maybe b) -> PTraversal s a -> Maybe s -> Maybe b") <small><sup>v14.0.0</sup></small>

`L.getAs` goes lazily over the elements focused on by the given traversal,
applying the given function to each element, and returns the first
non-`undefined` value returned by the function.

```js
L.getAs(x => x > 3 ? -x : undefined, L.elems, [3, 1, 4, 1, 5])
// -4
```

`L.getAs` operates lazily.  The user specified function is only applied to
elements until the first non-`undefined` value is returned and after that
`L.getAs` returns without examining more elements.

Note that `L.getAs` can be used to implement many other operations over
traversals such as finding an element matching a predicate and checking whether
all/any elements match a predicate.  For example, here is how you could
implement a for all predicate over traversals:

```js
const all = (p, t, s) => !L.getAs(x => p(x) ? undefined : true, t, s)
```

Now:

```js
all(x => x < 9, primitives, [[[1], 2], {y: 3}, [{l: 4, r: [5]}, {x: 6}]])
// true
```

##### <a id="l-isdefined"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-isdefined) [`L.isDefined(traversal, maybeData) ~> boolean`](#l-isdefined "L.isDefined: PTraversal s a -> Maybe s -> Boolean") <small><sup>v11.8.0</sup></small>

`L.isDefined` determines whether or not the given traversal focuses on any
non-`undefined` element on the given data structure.  When used with a lens,
`L.isDefined` basically allows you to check whether the target of the lens
exists or, in other words, whether the data structure has the targeted element.
See also [`L.isEmpty`](#l-isempty).

For example:

```js
L.isDefined('x', {y: 1})
// false
```

##### <a id="l-isempty"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-isempty) [`L.isEmpty(traversal, maybeData) ~> boolean`](#l-isempty "L.isEmpty: PTraversal s a -> Maybe s -> Boolean") <small><sup>v11.5.0</sup></small>

`L.isEmpty` determines whether or not the given traversal focuses on any
elements, `undefined` or otherwise, on the given data structure.  Note that when
used with a lens, `L.isEmpty` always returns `false`, because lenses always have
a single focus.  See also [`L.isDefined`](#l-isdefined).

For example:

```js
L.isEmpty(L.flatten, [[], [[[], []], []]])
// true
```

##### <a id="l-join"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-join) [`L.join(string, traversal, maybeData) ~> string`](#l-join "L.join: String -> PTraversal s a -> Maybe s -> String") <small><sup>v11.2.0</sup></small>

`L.join` creates a string by joining the optional elements targeted by the given
traversal with the given delimiter.

For example:

```js
L.join(', ', [L.elems, 'x'], [{x: 1}, {y: 2}, {x: 3}])
// '1, 3'
```

##### <a id="l-joinas"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-joinas) [`L.joinAs((maybeValue, index) => maybeString, string, traversal, maybeData) ~> string`](#l-joinas "L.joinAs: ((Maybe a, Index) -> Maybe String) -> String -> PTraversal s a -> Maybe s -> String") <small><sup>v11.2.0</sup></small>

`L.joinAs` creates a string by converting the elements targeted by the given
traversal to optional strings with the given function and then joining those
strings with the given delimiter.

For example:

```js
L.joinAs(JSON.stringify, ', ', L.elems, [{x: 1}, {y: 2}])
// '{'x':1}, {'y':2}'
```

##### <a id="l-maximum"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-maximum) [`L.maximum(traversal, maybeData) ~> maybeValue`](#l-maximum "L.maximum: Ord a => PTraversal s a -> Maybe s -> Maybe a") <small><sup>v7.2.0</sup></small>

`L.maximum` computes a maximum of the optional elements targeted by the
traversal.

For example:

```js
L.maximum(L.elems, [1, 2, 3])
// 3
```

Note that elements are ordered according to the `>` operator.

##### <a id="l-maximumby"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-maximumby) [`L.maximumBy(keyLens, traversal, maybeData) ~> maybeValue`](#l-maximumby "L.maximumBy: Ord k => (PLens a k -> PTraversal s a -> Maybe s -> Maybe a") <small><sup>v11.2.0</sup></small>

`L.maximumBy` computes a maximum of the elements targeted by the traversal based
on the optional keys returned by the given lens or function.  Elements for which
the returned key is `undefined` are skipped.

For example:

```js
L.maximumBy(R.length, L.elems, ['first', 'second', '--||--', 'third'])
// 'second'
```

Note that keys are ordered according to the `>` operator.

##### <a id="l-mean"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-mean) [`L.mean(traversal, maybeData) ~> number`](#l-mean "L.mean: PTraversal s Number -> Maybe s -> Number") <small><sup>v11.17.0</sup></small>

`L.mean` computes the arithmetic mean of the optional numbers targeted by the
traversal.

For example:

```js
L.mean([L.elems, 'x'], [{x: 1}, {ignored: 3}, {x: 2}])
// 1.5
```

##### <a id="l-meanas"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-meanas) [`L.meanAs((maybeValue, index) => maybeNumber, traversal, maybeData) ~> number`](#l-meanas "L.meanAs: ((Maybe a, Index) -> Maybe Number) -> PTraversal s a -> Maybe s -> Number") <small><sup>v11.17.0</sup></small>

`L.meanAs` computes the arithmetic mean of the optional numbers returned by the
given function for the elements targeted by the traversal.

For example:

```js
L.meanAs((x, i) => x <= i ? undefined : x, L.elems, [3, 1, 4, 1])
// 3.5
```

##### <a id="l-minimum"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-minimum) [`L.minimum(traversal, maybeData) ~> maybeValue`](#l-minimum "L.minimum: Ord a => PTraversal s a -> Maybe s -> Maybe a") <small><sup>v7.2.0</sup></small>

`L.minimum` computes a minimum of the optional elements targeted by the
traversal.

For example:

```js
L.minimum(L.elems, [1, 2, 3])
// 1
```

Note that elements are ordered according to the `<` operator.

##### <a id="l-minimumby"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-minimumby) [`L.minimumBy(keyLens, traversal, maybeData) ~> maybeValue`](#l-minimumby "L.minimumBy: Ord k => (PLens a k -> PTraversal s a -> Maybe s -> Maybe a") <small><sup>v11.2.0</sup></small>

`L.minimumBy` computes a minimum of the elements targeted by the traversal based
on the optional keys returned by the given lens or function.  Elements for which
the returned key is `undefined` are skipped.

For example:

```js
L.minimumBy(L.get('x'), L.elems, [{x: 1}, {x: -3}, {x: 2}])
// {x: -3}
```

Note that keys are ordered according to the `<` operator.

##### <a id="l-none"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-none) [`L.none((maybeValue, index) => testable, traversal, maybeData) ~> boolean`](#l-none "L.none: ((Maybe a, Index) -> Boolean) -> PTraversal s a -> Boolean") <small><sup>v11.6.0</sup></small>

`L.none` determines whether none of the elements focused on by the given
traversal satisfy the given predicate.

For example:

```js
L.none(x => x > 5, primitives, [[[1], 2], {y: 3}, [{l: 4, r: [5]}, {x: 6}]])
// false
```

See also: [`L.all`](#l-all), [`L.any`](#l-any), and [`L.getAs`](#l-getas).

##### <a id="l-or"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-or) [`L.or(traversal, maybeData) ~> boolean`](#l-or "L.or: PTraversal s Boolean -> Boolean") <small><sup>v9.6.0</sup></small>

`L.or` determines whether any of the elements focused on by the given traversal
is truthy.

For example:

```js
L.or(L.elems, [])
// false
```

Note that `L.or` is equivalent to [`L.any(x => x)`](#l-any).  See also:
[`L.and`](#l-and).

##### <a id="l-product"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-product) [`L.product(traversal, maybeData) ~> number`](#l-product "L.product: PTraversal s Number -> Maybe s -> Number") <small><sup>v7.2.0</sup></small>

`L.product` computes the product of the optional numbers targeted by the
traversal.

For example:

```js
L.product(L.elems, [1, 2, 3])
// 6
```

##### <a id="l-productas"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-productas) [`L.productAs((maybeValue, index) => number, traversal, maybeData) ~> number`](#l-productas "L.productAs: ((Maybe a, Index) -> Number) -> PTraversal s a -> Maybe s -> Number") <small><sup>v11.2.0</sup></small>

`L.productAs` computes the product of the numbers returned by the given function
for the elements targeted by the traversal.

For example:

```js
L.productAs((x, i) => x + i, L.elems, [3, 2, 1])
// 27
```

Note that unlike many other folds, `L.productAs` expects the function to only
return numbers and `undefined` is not treated in a special way.  If you need to
skip elements, you can return the number `1`.

##### <a id="l-select"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-select) ~~[`L.select(traversal, maybeData) ~> maybeValue`](#l-select "L.select: PTraversal s a -> Maybe s -> Maybe a") <small><sup>v9.8.0</sup></small>~~

**WARNING: `L.select` has been obsoleted.  Just use [`L.get`](#l-get).  See
[CHANGELOG](./CHANGELOG.md#1400) for details.**

`L.select` goes lazily over the elements focused on by the given traversal and
returns the first non-`undefined` element.

```js
L.select([L.elems, 'y'], [{x:1}, {y:2}, {z:3}])
// 2
```

Note that `L.select` is equivalent to [`L.selectAs(x => x)`](#l-selectas).

##### <a id="l-selectas"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-selectas) ~~[`L.selectAs((maybeValue, index) => maybeValue, traversal, maybeData) ~> maybeValue`](#l-selectas "L.selectAs: ((Maybe a, Index) -> Maybe b) -> PTraversal s a -> Maybe s -> Maybe b") <small><sup>v9.8.0</sup></small>~~

**WARNING: `L.selectAs` has been obsoleted.  Just use [`L.getAs`](#l-getas).
See [CHANGELOG](./CHANGELOG.md#1400) for details.**

`L.selectAs` goes lazily over the elements focused on by the given traversal,
applying the given function to each element, and returns the first
non-`undefined` value returned by the function.

```js
L.selectAs(x => x > 3 ? -x : undefined, L.elems, [3, 1, 4, 1, 5])
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
all(x => x < 9, primitives, [[[1], 2], {y: 3}, [{l: 4, r: [5]}, {x: 6}]])
// true
```

##### <a id="l-sum"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-sum) [`L.sum(traversal, maybeData) ~> number`](#l-sum "L.sum: PTraversal s Number -> Maybe s -> Number") <small><sup>v7.2.0</sup></small>

`L.sum` computes the sum of the optional numbers targeted by the traversal.

For example:

```js
L.sum(L.elems, [1, 2, 3])
// 6
```

##### <a id="l-sumas"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-sumas) [`L.sumAs((maybeValue, index) => number, traversal, maybeData) ~> number`](#l-sumas "L.sumAs: ((Maybe a, Index) -> Number) -> PTraversal s a -> Maybe s -> Number") <small><sup>v11.2.0</sup></small>

`L.sumAs` computes the sum of the numbers returned by the given function for the
elements targeted by the traversal.

For example:

```js
L.sumAs((x, i) => x + i, L.elems, [3, 2, 1])
// 9
```

Note that unlike many other folds, `L.sumAs` expects the function to only return
numbers and `undefined` is not treated in a special way.  If you need to skip
elements, you can return the number `0`.

### <a id="lenses"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#lenses) [Lenses](#lenses)

Lenses always have a single focus which can be [viewed](#l-get) directly.  Put
in another way, a lens specifies a path to a single element in a data structure.

#### <a id="creating-new-lenses"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#creating-new-lenses) [Creating new lenses](#creating-new-lenses)

##### <a id="l-foldtraversallens"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-foldtraversallens) [`L.foldTraversalLens((traversal, maybeData) => maybeValue, traversal) ~> lens`](#l-foldtraversallens "L.foldTraversalLens: (PTraversal s a -> Maybe s -> Maybe a) -> PTraversal s a -> PLens s a") <small><sup>v11.5.0</sup></small>

`L.foldTraversalLens` creates a lens from a fold and a traversal.  To make
sense, the fold should compute or pick a representative from the elements
focused on by the traversal such that when all the elements are equal then so is
the representative.  See also [`L.partsOf`](#l-partsof).

For example:

```js
L.get(L.foldTraversalLens(L.minimum, L.elems), [3, 1, 4])
// 1
```

```js
L.set(L.foldTraversalLens(L.minimum, L.elems), 2, [3, 1, 4])
// [ 2, 2, 2 ]
```

See the [Collection toggle](#collection-toggle) section for a more interesting
example.

##### <a id="l-getter"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-setter) [`L.getter((maybeData, index) => maybeValue) ~> lens`](#l-getter "L.getter: ((Maybe s, Index) -> Maybe a) -> PLens s a") <small><sup>v13.16.0</sup></small>

`L.getter(get)` is shorthand for [`L.lens(get, x => x)`](#l-lens).  See also
[`L.reread`](#l-reread).

##### <a id="l-lens"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-lens) [`L.lens((maybeData, index) => maybeValue, (maybeValue, maybeData, index) => maybeData) ~> lens`](#l-lens "L.lens: ((Maybe s, Index) -> Maybe a) -> ((Maybe a, Maybe s, Index) -> Maybe s) -> PLens s a") <small><sup>v1.0.0</sup></small>

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
      return 'Infinity'
    return moment.duration(moment(end).diff(moment(start))).toJSON()
  },
  (duration, {start = moment().toJSON()} = {}) => {
    if (undefined === duration || 'Infinity' === duration) {
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
L.get(
  timesAsDuration,
  {
    start: '2016-12-07T09:39:02.451Z',
    end: moment('2016-12-07T09:39:02.451Z').add(10, 'hours').toISOString()
  }
)
// 'PT10H'
```

```js
L.set(
  timesAsDuration,
  'PT10H',
  {start: '2016-12-07T09:39:02.451Z', end: '2016-12-07T09:39:02.451Z'}
)
// { end: '2016-12-07T19:39:02.451Z',
//   start: '2016-12-07T09:39:02.451Z' }
```

When composed with [`L.pick`](#l-pick), to flexibly pick the `start` and `end`
times, the above can be adapted to work in a wide variety of cases.  However,
the above lens will never be added to this library, because it would require
adding dependency to [Moment.js](http://momentjs.com/).

See the [Interfacing with Immutable.js](#interfacing) section for another
example of using `L.lens`.

##### <a id="l-partsof"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-partsof) [`L.partsOf(traversal, ...traversals) ~> lens`](#l-partsof "L.partsOf: ((PTraversal s s1, ...PTraversal sN a) -> PLens s [Maybe a]") <small><sup>v14.6.0</sup></small>

`L.partsOf` creates a lens from a given traversal [composed](#l-compose) from
the arguments.  When read through, the result is always an array of elements
targeted by the traversal as if produced by [`L.collectTotal`](#l-collecttotal).
When written through, the elements of the written
[array-like](#l-seemsarraylike) object are used to replace the focuses of the
traversal as if done by [`L.disperse`](#l-disperse).  See also
[`L.foldTraversalLens`](#l-foldtraversallens).

For example:

```js
L.set(
  L.partsOf(L.elems, 'x'),
  [3, 4],
  [{x: 1}, {y: 2}]
)
// [{x: 3}, {y: 2, x: 4}]
```

##### <a id="l-setter"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-setter) [`L.setter((maybeValue, maybeData, index) => maybeData) ~> lens`](#l-setter "L.setter: ((Maybe a, Maybe s, Index) -> Maybe s) -> PLens s a") <small><sup>v10.3.0</sup></small>

`L.setter(set)` is shorthand for [`L.lens(x => x, set)`](#l-lens).  See also
[`L.rewrite`](#l-rewrite).

#### <a id="enforcing-invariants"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#enforcing-invariants) [Enforcing invariants](#enforcing-invariants)

##### <a id="l-defaults"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-defaults) [`L.defaults(valueIn) ~> lens`](#l-defaults "L.defaults: s -> PLens s s") <small><sup>v2.0.0</sup></small>

`L.defaults` is used to specify a default context or value for an element in
case it is missing.  When set with the default value, the effect is to remove
the element.  This can be useful for both making partial lenses with propagating
removal and for avoiding having to check for and provide default values
elsewhere.  See also [`L.valueOr`](#l-valueor).

For example:

```js
L.get(['items', L.defaults([])], {})
// []
```
```js
L.get(['items', L.defaults([])], {items: [1, 2, 3]})
// [ 1, 2, 3 ]
```
```js
L.set(['items', L.defaults([])], [], {items: [1, 2, 3]})
// {}
```

Note that `L.defaults(valueIn)` is equivalent to [`L.replace(undefined,
valueIn)`](#l-replace).

##### <a id="l-define"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-define) [`L.define(value) ~> lens`](#l-define "L.define: s -> PLens s s") <small><sup>v1.0.0</sup></small>

`L.define` is used to specify a value to act as both the default value and the
required value for an element.

```js
L.get(['x', L.define(null)], {y: 10})
// null
```
```js
L.set(['x', L.define(null)], undefined, {y: 10})
// { y: 10, x: null }
```

Note that `L.define(value)` is equivalent to `[L.required(value),
L.defaults(value)]`.

##### <a id="l-normalize"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-normalize) [`L.normalize((value, index) => maybeValue) ~> lens`](#l-normalize "L.normalize: ((s, Index) -> Maybe s) -> PLens s s") <small><sup>v1.0.0</sup></small>

`L.normalize` maps the value with same given transform when read and written and
implicitly maps `undefined` to `undefined`.  `L.normalize(fn)` is equivalent to
composing [`L.reread(fn)`](#l-reread) and [`L.rewrite(fn)`](#l-rewrite).

One use case for `normalize` is to make it easy to determine whether, after a
change, the data has actually changed.  By keeping the data normalized, a simple
[`R.equals`](http://ramdajs.com/docs/#equals) comparison will do.

##### <a id="l-required"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-required) [`L.required(valueOut) ~> lens`](#l-required "L.required: s -> PLens s s") <small><sup>v1.0.0</sup></small>

`L.required` is used to specify that an element is not to be removed; in case it
is removed, the given value will be substituted instead.

For example:

```js
L.remove(['item'], {item: 1})
// {}
```
```js
L.remove(['item', L.required(null)], {item: 1})
// { item: null }
```

Note that `L.required(valueOut)` is equivalent to [`L.replace(valueOut,
undefined)`](#l-replace).

##### <a id="l-reread"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-reread) [`L.reread((valueIn, index) => maybeValueIn) ~> lens`](#l-reread "L.reread: ((s, Index) -> Maybe s) -> PLens s s") <small><sup>v11.21.0</sup></small>

`L.reread` maps the value with the given transform on read and implicitly maps
`undefined` to `undefined`.  See also [`L.normalize`](#l-normalize) and
[`L.getter`](#l-getter).

##### <a id="l-rewrite"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-rewrite) [`L.rewrite((valueOut, index) => maybeValueOut) ~> lens`](#l-rewrite "L.rewrite: ((s, Index) -> Maybe s) -> PLens s s") <small><sup>v5.1.0</sup></small>

`L.rewrite` maps the value with the given transform when written and implicitly
maps `undefined` to `undefined`.  See also [`L.normalize`](#l-normalize) and
[`L.setter`](#l-setter).

One use case for `rewrite` is to re-establish data structure invariants after
changes.

See the [BST as a lens](#bst-as-a-lens) section for a meaningful example.

#### <a id="array-like"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#array-like) [Lensing array-like objects](#array-like)

Objects that have a non-negative integer `length` and strings, which are not
considered `Object` instances in JavaScript, are considered *array-like* objects
by partial optics.  See also [`L.seemsArrayLike`](#l-seemsarraylike).

When writing through a lens or traversal that operates on array-like objects,
the result is always a plain `Array`.  For example:

```js
L.set(1, 'a', 'LoLa')
// [ 'L', 'a', 'L', 'a' ]
```

It may seem like the result should be of the same type as the object being
manipulated, but that is problematic, because

* the focus of a *partial* optic is always optional, so there might not be
  an original array-like object whose type to use, and
* manipulation of the elements can change their types, so they may no longer be
  compatible with the type of the original array-like object.

Therefore, instead, when manipulating strings or array-like non-`Array` objects,
[`L.rewrite`](#l-rewrite) can be used to explicitly convert the result to the
desired type, if necessary.  For example:

```js
L.set([L.rewrite(R.join('')), 1], 'a', 'LoLa')
// 'LaLa'
```

Also, when manipulating array-like objects, partial lenses generally ignore
everything but the `length` property and the integer properties from `0` to
`length-1`.

##### <a id="l-append"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-append) [`L.append ~> lens`](#l-append "L.append: PLens [a] a") <small><sup>v1.0.0</sup></small>

**WARNING: `L.append` has been renamed to [`L.appendTo`](#l-appendto).  See
[CHANGELOG](./CHANGELOG.md#14140) for details.**

##### <a id="l-cross"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-cross) [`L.cross([...lenses]) ~> lens`](#l-cross "L.cross: [PLens s1 a1, ...PLens sN aN] -> PLens [s1, ...sN] [a1, ...aN]") <small><sup>v14.3.0</sup></small>

`L.cross` constructs a lens or isomorphism between fixed length arrays or tuples
from the given array of lenses or isomorphisms.  The optic returned by `L.cross`
is strict such that in case any elements of the resulting array in either
direction would be `undefined` then the whole result will be `undefined`.

For example

```js
L.get(L.cross(['x', [], 'y']), [{x: 1, y: 2}, 2, {x: 3, y: 4}])
// [ 1, 2, 4 ]
```
```js
L.set(L.cross(['x', [], 'y']), [-1, -2, -4], [{x: 1, y: 2}, 2, {x: 3, y: 4}])
// [ { x: -1, y: 2 }, -2, { x: 3, y: -4 } ]
```

##### <a id="l-filter"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-filter) [`L.filter((maybeValue, index) => testable) ~> lens`](#l-filter "L.filter: ((Maybe a, Index) -> Boolean) -> PLens [a] [a]") <small><sup>v1.0.0</sup></small>

`L.filter` operates on [array-like](#array-like) objects.  When not viewing an
array-like object, the result is `undefined`.  When viewing an array-like
object, only elements matching the given predicate will be returned.  When set,
the resulting array will be formed by concatenating the elements of the set
array-like object and the elements of the complement of the filtered focus.

For example:

```js
L.set(L.filter(x => x <= '2'), 'abcd', '3141592')
// [ 'a', 'b', 'c', 'd', '3', '4', '5', '9' ]
```

**NOTE**: If you are merely modifying a data structure, and don't need to limit
yourself to lenses, consider using the [`L.elems`](#l-elems) traversal composed
with [`L.when`](#l-when).

An alternative design for filter could implement a smarter algorithm to combine
arrays when set.  For example, an algorithm based on [edit
distance](https://en.wikipedia.org/wiki/Edit_distance) could be used to maintain
relative order of elements.  While this would not be difficult to implement, it
doesn't seem to make sense, because in most cases use of
[`L.normalize`](#l-normalize) or [`L.rewrite`](#l-rewrite) would be preferable.
Also, the [`L.elems`](#l-elems) traversal composed with [`L.when`](#l-when) will
retain order of elements.

##### <a id="l-find"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-find) [`L.find((maybeValue, index, {hint: index}) => testable[, {hint: index}]) ~> lens`](#l-find "L.find: ((Maybe a, Index, {hint: Index}) -> Boolean[, {hint: Index}]) -> PLens [a] a") <small><sup>v1.0.0</sup></small>

`L.find` operates on [array-like](#array-like) objects like
[`L.index`](#l-index), but the index to be viewed is determined by finding the
first element from the focus that matches the given predicate.  When no matching
element is found the effect is same as with [`L.appendTo`](#l-appendto).

```js
L.remove(L.find(x => x <= 2), [3, 1, 4, 1, 5, 9, 2])
// [ 3, 4, 1, 5, 9, 2 ]
```

`L.find` is designed to operate efficiently when used repeatedly.  To this end,
`L.find` can be given an object with a `hint` property and when no hint object
is passed, a new object will be allocated internally.  Repeated searches are
started from the closest existing index to the `hint` and then by increasing
distance from that index.  The `hint` is updated after each search and the
`hint` can also be mutated from the outside.  The `hint` object is also passed
to the predicate as the third argument.  This makes it possible to both
practically eliminate the linear search and to implement the predicate without
allocating extra memory for it.

For example:

```js
L.modify(
  [L.find(R.whereEq({id: 2}), {hint: 2}), 'value'],
  R.toUpper,
  [
    {id: 3, value: 'a'},
    {id: 2, value: 'b'},
    {id: 1, value: 'c'},
    {id: 4, value: 'd'},
    {id: 5, value: 'e'}
  ]
)
// [{id: 3, value: 'a'},
//  {id: 2, value: 'B'},
//  {id: 1, value: 'c'},
//  {id: 4, value: 'd'},
//  {id: 5, value: 'e'}]
```

Note that `L.find` by itself does not satisfy all lens laws.  To fix this, you
can e.g. post compose `L.find` with lenses that ensure that the property being
tested by the predicate given to `L.find` cannot be written to.  See
[here](#myth-partial-lenses-are-not-lawful) for discussion and an example.

##### <a id="l-findwith"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-findwith) [`L.findWith(optic[, {hint: index}]) ~> optic`](#l-findwith "L.findWith: (POptic s a[, {hint: Index}]) -> POptic [s] a") <small><sup>v1.0.0</sup></small>

`L.findWith` chooses an index from an [array-like](#array-like) object through
which the given optic has a non-`undefined` view and then returns an optic that
focuses on that.

For example:

```js
L.get(L.findWith('x'), [{z: 6}, {x: 9}, {y: 6}])
// 9
```
```js
L.set(L.findWith('x'), 3, [{z: 6}, {x: 9}, {y: 6}])
// [ { z: 6 }, { x: 3 }, { y: 6 } ]
```

##### <a id="l-first"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-first) [`L.first ~> lens`](#l-first "L.first: PLens [a] a") <small><sup>v13.1.0</sup></small>

`L.first` is a synonym for [`L.index(0)`](#l-index) or [`0`](#l-index) and
focuses on the first element of an [array-like](#array-like) object or works
like [`L.appendTo`](#l-appendto) in case no such element exists.  See also
[`L.last`](#l-last).

For example:

```js
L.get(L.first, ['a', 'b'])
// 'a'
```

##### <a id="l-index"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-index) [`L.index(elemIndex) ~> lens`](#l-index "L.index: Integer -> PLens [a] a") or `elemIndex` <small><sup>v1.0.0</sup></small>

`L.index(elemIndex)` or just `elemIndex` focuses on the element at specified
index of an [array-like](#array-like) object.

* When not viewing an index with a defined element, the result is `undefined`.
* When setting to `undefined`, the element is removed from the resulting array,
  shifting all higher indices down by one.
* When setting a defined value to an index that is higher than the length of the
  array-like object, the missing elements will be filled with `undefined`.

For example:

```js
L.set(2, 'z', ['x', 'y', 'c'])
// [ 'x', 'y', 'z' ]
```
```js
L.remove(0, ['x'])
// [ ]
```

##### <a id="l-last"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-last) [`L.last ~> lens`](#l-last "L.last: PLens [a] a") <small><sup>v9.8.0</sup></small>

`L.last` focuses on the last element of an [array-like](#array-like) object or
works like [`L.appendTo`](#l-appendto) in case no such element exists.  See also
[`L.first`](#l-first).

Focusing on an empty array or `undefined` results in returning `undefined`.  For
example:

```js
L.get(L.last, [1, 2, 3])
// 3
```
```js
L.get(L.last, [])
// undefined
```

Setting value with `L.last` sets the last element of the object or appends the
value if the focused object is empty or `undefined`.  For example:

```js
L.set(L.last, 5, [1, 2, 3])
// [1, 2, 5]
```
```js
L.set(L.last, 1, [])
// [1]
```

##### <a id="l-prefix"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-prefix) [`L.prefix(maybeEnd) ~> lens`](#l-prefix "L.prefix: Maybe Number -> PLens [a] [a]") <small><sup>v11.12.0</sup></small>

`L.prefix` focuses on a range of elements of an [array-like](#array-like) object
starting from the beginning of the object.  `L.prefix` is a special case of
[`L.slice`](#l-slice).

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

##### <a id="l-slice"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-slice) [`L.slice(maybeBegin, maybeEnd) ~> lens`](#l-slice "L.slice: Maybe Number -> Maybe Number -> PLens [a] [a]") <small><sup>v8.1.0</sup></small>

`L.slice` focuses on a specified range of elements of an
[array-like](#array-like) object.  See also [`L.prefix`](#l-prefix) and
[`L.suffix`](#l-suffix).

The range is determined like with the standard
[`slice`](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/slice)
method of arrays:

- non-negative values are relative to the beginning of the array-like object,
- `Infinity` is the end of the array-like object,
- negative values are relative to the end of the array-like object,
- `-Infinity` is the beginning of the array-like object, and
- `undefined` gives the defaults: 0 for the begin and length for the end.

For example:

```js
L.get(L.slice(1, -1), [1, 2, 3, 4])
// [ 2, 3 ]
```
```js
L.set(L.slice(-2, undefined), [0], [1, 2, 3, 4])
// [ 1, 2, 0 ]
```

##### <a id="l-suffix"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-suffix) [`L.suffix(maybeEnd) ~> lens`](#l-prefix "L.prefix: Maybe Number -> PLens [a] [a]") <small><sup>v11.12.0</sup></small>

`L.suffix` focuses on a range of elements of an [array-like](#array-like) object
starting from the end of the object.  `L.suffix` is a special case of
[`L.slice`](#l-slice).

The beginning of the range is determined as follows:

- non-negative values are relative to the end of the array-like object,
- `Infinity` is the beginning of the array-like object,
- negative values are relative to the beginning of the array-like object,
- `-Infinity` is the end of the array-like object, and
- `undefined` is the beginning of the array-like object.

Note that the rules above are different from the rules for determining the
beginning of [`L.slice`](#l-slice).

For example:

```js
L.set(L.suffix(1), [4, 1], [3, 1, 3])
// [ 3, 1, 4, 1 ]
```

#### <a id="lensing-objects"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#lensing-objects) [Lensing objects](#lensing-objects)

Anything that is an `instanceof Object` is considered an object by partial
lenses.

When writing through an optic that operates on objects, the result is always a
plain `Object`.  For example:

```js
function Custom(gold, silver, bronze) {
  this.gold = gold
  this.silver = silver
  this.bronze = bronze
}

L.set('silver', -2, new Custom(1, 2, 3))
// { gold: 1, silver: -2, bronze: 3 }
```

When manipulating objects whose constructor is not `Object`,
[`L.rewrite`](#l-rewrite) can be used to convert the result to the desired type,
if necessary:

```js
L.set([L.rewrite(objectTo(Custom)), 'silver'], -2, new Custom(1, 2, 3))
// Custom { gold: 1, silver: -2, bronze: 3 }
```

Partial lenses also generally guarantees that the creation order of keys is
preserved (even though the library used to print out evaluation results from
code snippets might not preserve the creation order).  For example:

```js
for (const k in L.set('silver', -2, new Custom(1, 2, 3)))
  console.log(k)
// gold
// silver
// bronze
```

When creating new objects, partial lenses generally ignore everything but own
string keys.  In particular, properties from the prototype chain are not copied
and neither are properties with symbol keys.

##### <a id="l-pickin"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-pickin) [`L.pickIn({prop: lens, ...props}) ~> lens`](#l-pickin "L.pickIn: {p1: PLens s1 a1, ...pls} -> PLens {p1: s1, ...pls} {p1: a1, ...pls}") <small><sup>v11.11.0</sup></small>

`L.pickIn` creates a lens from the given possibly nested object template of
lenses similar to [`L.pick`](#l-pick) except that the lenses in the template are
relative to their path in the template.  This means that using `L.pickIn` you
can effectively create a kind of filter for a nested object structure.  See also
[`L.props`](#l-props).

For example:

```js
L.get(
  L.pickIn({meta: {file: [], ext: []}}),
  {meta: {file: './foo.txt', base: 'foo', ext: 'txt'}}
)
// { meta: { file: './foo.txt', ext: 'txt' } }
```

##### <a id="l-prop"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-prop) [`L.prop(propName) ~> lens`](#l-prop "L.prop: (p: a) -> PLens {p: a, ...ps} a") or `propName` <small><sup>v1.0.0</sup></small>

`L.prop(propName)` or just `propName` focuses on the specified object property.

* When not viewing a defined object property, the result is `undefined`.
* When writing to a property, the result is always an `Object`.
* When setting property to `undefined`, the property is removed from the result.

When setting or removing properties, the order of keys is preserved.

For example:

```js
L.get('y', {x: 1, y: 2, z: 3})
// 2
```
```js
L.set('y', -2, {x: 1, y: 2, z: 3})
// { x: 1, y: -2, z: 3 }
```

When manipulating objects whose constructor is not `Object`,
[`L.rewrite`](#l-rewrite) can be used to convert the result to the desired type,
if necessary:

```js
L.set([L.rewrite(objectTo(XYZ)), 'z'], 3, new XYZ(3, 1, 4))
// XYZ { x: 3, y: 1, z: 3 }
```

##### <a id="l-props"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-props) [`L.props(...propNames) ~> lens`](#l-props "L.props: (p1: a1, ...ps) -> PLens {p1: a1, ...ps, ...o} {p1: a1, ...ps}") <small><sup>v1.4.0</sup></small>

`L.props` focuses on a subset of properties of an object, allowing one to treat
the subset of properties as a unit.  The view of `L.props` is `undefined` when
none of the properties is defined.  This allows `L.props` to be used with
e.g. [`L.choices`](#l-choices).  Otherwise the view is an object containing a
subset of the properties.  Setting through `L.props` updates the whole subset of
properties, which means that any missing properties are removed if they did
exists previously.  When set, any extra properties are ignored.  See also
[`L.propsExcept`](#l-propsexcept).

```js
L.set(L.props('x', 'y'), {x: 4}, {x: 1, y: 2, z: 3})
// { x: 4, z: 3 }
```

Note that `L.props(k1, ..., kN)` is equivalent to [`L.pick({[k1]: k1, ..., [kN]:
kN})`](#l-pick) and [`L.pickIn({[k1]: [], ..., [kN]: []})`](#l-pickin).

##### <a id="l-propsexcept"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-propsexcept) [`L.propsExcept(...propNames) ~> lens`](#l-propsexcept "L.propsExcept: (p1: a1, ...ps) -> PLens {p1: a1, ...ps, ...o} {...o}") <small><sup>v14.11.0</sup></small>

`L.propsExcept` focuses on all the properties of an object except the specified
properties.  See also [`L.props`](#l-props).

```js
L.modify(
  L.partsOf(L.flat(L.propsExcept('id'))),
  R.reverse,
  [{id: 1, x: 1, y: 2}, {id: 2, x: 2}, {id: 3, x: 3, z: 4}]
)
// [{id: 1, x: 3, z: 4}, {id: 2, x: 2}, {id: 3, x: 1, y: 2}]
```

##### <a id="l-propsof"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-propsof) ~~[`L.propsOf(object) ~> lens`](#l-propsof "L.propsOf: {p1: a1, ...ps} -> PLens {p1: a1, ...ps, ...o} {p1: a1, ...ps}") <small><sup>v11.13.0</sup></small>~~

**WARNING: `propsOf` has been deprecated and there is no replacement.  See
[CHANGELOG](./CHANGELOG.md#14140) for details.**

`L.propsOf(o)` is shorthand for [`L.props(...Object.keys(o))`](#l-props)
allowing one to focus on the properties specified via the given sample object.

##### <a id="l-removable"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-removable) [`L.removable(...propNames) ~> lens`](#l-removable "L.removable: (p1: a1, ...ps) -> PLens {p1: a1, ...ps, ...o} {p1: a1, ...ps, ...o}") <small><sup>v9.2.0</sup></small>

`L.removable` creates a lens that, when written through, replaces the whole
result with `undefined` if none of the given properties is defined in the
written object.  `L.removable` is designed for making removal propagate through
objects.

Contrast the following examples:

```js
L.remove('x', {x: 1, y: 2})
// { y: 2 }
```

```js
L.remove([L.removable('x'), 'x'], {x: 1, y: 2})
// undefined
```

Also note that, in a composition, `L.removable` is likely preceded by
[`L.valueOr`](#l-valueor) (or [`L.defaults`](#l-defaults)) like in the
[tutorial](#tutorial) example.  In such a pair, the preceding lens gives a
default value when reading through the lens, allowing one to use such a lens to
insert new objects.  The following lens then specifies that removing the then
focused property (or properties) should remove the whole object.  In cases where
the shape of the incoming object is know, [`L.defaults`](#l-defaults) can
replace such a pair.

#### <a id="lensing-strings"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#lensing-strings) [Lensing strings](#lensing-strings)

##### <a id="l-matches"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-matches) [`L.matches(/.../) ~> lens`](#l-matches "L.matches: RegExp -> PLens String String") <small><sup>v10.4.0</sup></small>

`L.matches`, when given a regular expression without the
[`global`](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/RegExp/global)
flags, `/.../`, is a partial lens over the match.  When there is no match, or
the target is not a string, then `L.matches` will be read-only.  See also
[`L.matches`](#l-matches-g).

For example:

```js
L.set(L.matches(/\.[^./]+$/), '.txt', '/dir/file.ext')
// '/dir/file.txt'
```

#### <a id="providing-defaults"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#providing-defaults) [Providing defaults](#providing-defaults)

##### <a id="l-valueor"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-valueor) [`L.valueOr(valueOut) ~> lens`](#l-valueor "L.valueOr: s -> PLens s s") <small><sup>v3.5.0</sup></small>

`L.valueOr` is an asymmetric lens used to specify a default value in case the
focus is `undefined` or `null`.  When set, `L.valueOr` behaves like the identity
lens.  See also [`L.defaults`](#l-defaults).

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

Note that `L.valueOr(otherwise)` is equivalent to [`L.getter(x => x != null ?
x : otherwise)`](#l-getter).

#### <a id="transforming-data"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#transforming-data) [Transforming data](#transforming-data)

##### <a id="l-pick"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-pick) [`L.pick({prop: lens, ...props}) ~> lens`](#l-pick "L.pick: {p1: PLens s a1, ...pls} -> PLens s {p1: a1, ...pls}") <small><sup>v1.2.0</sup></small>

`L.pick` creates a lens out of the given possibly nested object template of
lenses and allows one to pick apart a data structure and then put it back
together.  When viewed, `undefined` properties are not added to the result and
if the result would be an empty object, the result will be `undefined`.  This
allows `L.pick` to be used with e.g. [`L.choices`](#l-choices).  Otherwise an
object is created, whose properties are obtained by viewing through the lenses
of the template.  When set with an object, the properties of the object are set
to the context via the lenses of the template.

For example, let's say we need to deal with data and schema in need of some
semantic restructuring:

```js
const sampleFlat = {px: 1, py: 2, vx: 1, vy: 0}
```

We can use `L.pick` to create a lens to pick apart the data and put it back
together into a more meaningful structure:

```js
const sanitize = L.pick({pos: {x: 'px', y: 'py'}, vel: {x: 'vx', y: 'vy'}})
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
L.modify([sanitize, 'pos', 'x'], R.add(5), sampleFlat)
// { px: 6, py: 2, vx: 1, vy: 0 }
```

**NOTE:** In order for a lens created with `L.pick` to work in a predictable
manner, the given lenses must operate on independent parts of the data
structure.  As a trivial example, in `L.pick({x: 'same', y: 'same'})` both of
the resulting object properties, `x` and `y`, address the same property of the
underlying object, so writing through the lens will give unpredictable results.

Note that, when set, `L.pick` simply ignores any properties that the given
template doesn't mention.  Also note that the underlying data structure need not
be an object.

Note that the `sanitize` lens defined above can also been seen as an
[isomorphism](#isomorphisms) between the "flat" and "nested" forms of the data.
It can even be inverted using [`L.inverse`](#l-inverse):

```js
L.get(L.inverse(sanitize), {pos: {x: 1, y: 2}, vel: {x: 1, y: 0}})
// { px: 1, py: 2, vx: 1, vy: 0 }
```

##### <a id="l-replace"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-replace) [`L.replace(maybeValueIn, maybeValueOut) ~> lens`](#l-replace "L.replace: Maybe s -> Maybe s -> PLens s s") <small><sup>v1.0.0</sup></small>

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
selective use of [`defaults`](#l-defaults), [`required`](#l-required) and
[`define`](#l-define).

#### <a id="inserters"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#inserters) [Inserters](#inserters)

The term "inserter" here is used to refer to write-only lenses that focus on a
location where a new value can be inserted.  Aside from the inserters listed in
this section, other inserters can be obtained as special cases of other optics.

Here are a few examples of inserters obtained as special cases:

```js
L.set(L.matches(/^/), 'pre', 'fix')
// 'prefix'
```

```js
L.set(L.matches(/$/), 'fix', 'suf')
// 'suffix'
```

```js
L.set([L.slice(2, 0), 0], 4, [3, 1, 1])
// [ 3, 1, 4, 1 ]
```

##### <a id="l-appendto"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-appendto) [`L.appendTo ~> lens`](#l-appendto "L.appendTo: PLens [a] a") <small><sup>v14.14.0</sup></small>

`L.appendTo` is a write-only lens that can be used to append values to an
[array-like](#array-like) object.  The view of `L.appendTo` is always
`undefined`.  See also [`L.prependTo`](#l-prependto) and
[`L.assignTo`](#l-assignto).

For example:

```js
L.get(L.appendTo, ['x'])
// undefined
```
```js
L.set(L.appendTo, 'x', undefined)
// [ 'x' ]
```
```js
L.set(L.appendTo, 'x', ['z', 'y'])
// [ 'z', 'y', 'x' ]
```

Note that `L.appendTo` is equivalent to [`L.index(i)`](#l-index) with the index
`i` set to the length of the focused array or 0 in case the focus is not a
defined array.

##### <a id="l-assignto"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-assignto) [`L.assignTo ~> lens`](#l-assignto "L.assignTo: PLens {...} {...}") <small><sup>v14.14.0</sup></small>

`L.assignTo` is a write-only lens that can be used to assign properties to an
object.  The view of `L.assignTo` is always `undefined`.  See also
[`L.appendTo`](#l-appendto) and [`L.prependTo`](#l-prependto).

For example:

```js
L.set(L.assignTo, {y: 1, z: 4}, {x: 3, y: 2, z: 1})
// { x: 3, y: 1, z: 4 }
```

One use case for `L.assignTo` is when assigning properties to multiple focuses
through [`L.disperse`](#l-disperse) or [`L.partsOf`](#l-partsof):

```js
L.disperse([L.elems, L.assignTo], [{x: 3}, {y: 1}], [{y: 1}, {x: 4}])
// [ { x: 3, y: 1}, { x: 4, y: 1 } ]
```

##### <a id="l-prependto"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-prependto) [`L.prependTo ~> lens`](#l-prependto "L.prependTo: PLens [a] a") <small><sup>v14.14.0</sup></small>

`L.prependTo` is a write-only lens that can be used to prepend values to an
[array-like](#array-like) object.  The view of `L.prependTo` is always
`undefined`.  See also [`L.appendTo`](#l-appendto) and
[`L.assignTo`](#l-assignto).

For example:

```js
L.set(L.prependTo, 3, [1, 4])
// [ 3, 1, 4 ]
```

### <a id="isomorphisms"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#isomorphisms) [Isomorphisms](#isomorphisms)

[Isomorphisms](https://en.wikipedia.org/wiki/Isomorphism) are [lenses](#lenses)
with a kind of [inverse](#l-inverse).  The focus of an isomorphism is the whole
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
[`L.pick`](#l-pick), can also be used to create isomorphisms.  On the other
hand, some forms of optic composition, particularly [adapting](#adapting) and
[querying](#querying), do not work properly on (inverted) isomorphisms.

#### <a id="operations-on-isomorphisms"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#operations-on-isomorphisms) [Operations on isomorphisms](#operations-on-isomorphisms)

##### <a id="l-getinverse"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-getinverse) [`L.getInverse(isomorphism, maybeData) ~> maybeData`](#l-getinverse "L.getInverse: PIso a b -> Maybe b -> Maybe a") <small><sup>v5.0.0</sup></small>

`L.getInverse` views through an isomorphism in the inverse direction.

For example:

```js
const expect = (p, f) => x => p(x) ? f(x) : undefined

const offBy1 = L.iso(expect(R.is(Number), R.inc), expect(R.is(Number), R.dec))

L.getInverse(offBy1, 1)
// 0
```

Note that `L.getInverse(iso, data)` is equivalent to [`L.set(iso, data,
undefined)`](#l-set).

Also note that, while `L.getInverse` makes most sense when used with an
isomorphism, it is valid to use `L.getInverse` with *partial* lenses in general.
Doing so essentially constructs a minimal data structure that contains the given
value.  For example:

```js
L.getInverse('meaning', 42)
// { meaning: 42 }
```

#### <a id="creating-new-isomorphisms"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#creating-new-isomorphisms) [Creating new isomorphisms](#creating-new-isomorphisms)

##### <a id="l-iso"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-iso) [`L.iso(maybeData => maybeValue, maybeValue => maybeData) ~> isomorphism`](#l-iso "L.iso: (Maybe s -> Maybe a) -> (Maybe a -> Maybe s) -> PIso s a") <small><sup>v5.3.0</sup></small>

`L.iso` creates a new primitive isomorphism from the given pair of functions.
Usually the given functions should be inverses of each other, but that isn't
strictly necessary.  The functions should also be partial so that when the input
doesn't match their expectation, the output is mapped to `undefined`.

For example:

```js
const reverseString = L.iso(
  expect(R.is(String), R.reverse),
  expect(R.is(String), R.reverse)
)

L.modify(
  [
    L.uriComponent,
    L.json(),
    'bottle',
    0,
    reverseString,
    L.rewrite(R.join('')),
    0
  ],
  R.toUpper,
  '%7B%22bottle%22%3A%5B%22egassem%22%5D%7D'
)
// '%7B%22bottle%22%3A%22egasseM%22%7D'
```

##### <a id="l-mapping"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-mapping) [`L.mapping([patternFwd, patternBwd] | (...variables) => [patternFwd, patternBwd]) ~> isomorphism`](#l-mapping "L.mapping: ([Pattern s, Pattern a] | (...Variable) -> [Pattern s, Pattern a]) -> PIso s a") <small><sup>v14.8.0</sup></small>

`L.mapping` creates an isomorphism based on the given pair of patterns.  A
pattern can be an arbitrarily nested structure of plain arrays and plain objects
containing variables or constant values.  Variables other than [`L._`](#l-_) are
obtained using a function that returns the pair of patterns when given variables
by `L.mapping`.  When reading, all properties and elements of the input data
structure must be explicitly matched by the pattern and each variable must match
a non-`undefined` value.  When a variable appears multiple times in a pattern,
the matches must be structurally equal.  Variables can further be used with the
`...variable` rest-spread notation within objects and arrays and will match or
substitute to zero or more object properties or array elements.  Only a single
rest-spread match can be used within a single object or array pattern.  See also
[`L.mappings`](#l-mappings).

For example:

```js
L.get(
  L.mapping((x, y) => [[x, L._, ...y], {x, y}]),
  ['a', 'b', 'c', 'd']
)
// { x: 'a', y: ['c', 'd'] }
```

```js
L.getInverse(
  L.array(
    L.alternatives(
      L.mapping(['foo', 'bar']),
      L.mapping(['you', 'me'])
    )
  ),
  ['me', 'bar']
)
// ['you', 'foo']
```

As an aside, the way variables are introduced into the patterns in `L.mapping`
by using a function could be described as a simple use of
[HOAS](https://en.wikipedia.org/wiki/Higher-order_abstract_syntax).

###### <a id="l-_"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-_) [`L._ ~> pattern`](#l-_ "L._: Pattern a") <small><sup>v14.8.0</sup></small>

`L._` is a don't care or ignore pattern for use with [`L.mapping`](#l-mapping)
and [`L.mappings`](#l-mappings).  When reading, a `L._` pattern matches any
non-`undefined` value and each use of `L._` is considered as a new variable so
the values matched by them do not need to be equal.  When writing, uses of `L._`
translate to `undefined` and `undefined` values are not written to objects nor
arrays by [`L.mapping`](#l-mapping).

##### <a id="l-mappings"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-mappings) [`L.mappings([...[patternFwd, patternBwd]] | (...variables) => [...[patternFwd, patternBwd]]) ~> isomorphism`](#l-mappings "L.mappings: ([[Pattern s, Pattern a]] | (...Variable) -> [[Pattern s, Pattern a]]) -> PIso s a") <small><sup>v14.8.0</sup></small>

`L.mappings` is a shorthand for multiple [`L.mapping`](#l-mapping)
[`L.alternatives`](#l-alternatives).

Basically

```jsx
L.mappings((...variables) => [patternPair1, ..., patternPairN])
```

is equivalent to

```jsx
L.alternatives(
  L.mappings((...variables) => patternPair1),
  ...,
  L.mappings((...variables) => patternPairN)
)
```

For example:

```js
L.getInverse(
  L.array(L.mappings((x, y) => [[[x, y], {x, y}], [{x, y}, [x, y]]])),
  [['a', 'b'], {x: 1, y: 2}]
)
// [{x: 'a', y: 'b'}, [1, 2]]
```

##### <a id="l-pattern"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-pattern) [`L.pattern(pattern | (...variables) => pattern) ~> isomorphism`](#l-pattern "L.pattern: (Pattern s | (...Variable) -> Pattern s) -> PIso s s") <small><sup>v14.13.0</sup></small>

`L.pattern` tries to match the value in focus to the pattern.  If the pattern
matches, the focus is not modified.  Otherwise the focus is mapped to
`undefined`.  See also [`L.subset`](#l-subset) and [`L.patterns`](#l-patterns).

##### <a id="l-patterns"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-patterns) [`L.patterns([...patterns] | (...variables) => [...patterns]) ~> isomorphism`](#l-patterns "L.patterns: ([Pattern s] | (...Variable) -> [Pattern s]) -> PIso s s") <small><sup>v14.13.0</sup></small>

`L.patterns` tries to match the value in focus to any of the pattern.  If any
pattern matches, the focus is not modified.  Otherwise the focus is mapped to
`undefined`.  See also [`L.pattern`](#l-pattern).

#### <a id="isomorphism-combinators"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#isomorphism-combinators) [Isomorphism combinators](#isomorphism-combinators)

##### <a id="l-alternatives"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-alternatives) [`L.alternatives(isomorphism, ...isomorphisms) ~> isomorphism`](#l-alternatives "L.alternatives: (PIso s a, ...PIso s a) -> PIso s a") <small><sup>v14.7.0</sup></small>

`L.alternatives` returns a partial isomorphism that, in both read and write
directions, acts like the first of the given partial isomorphisms whose view is
not `undefined` on the given data structure.  See also
[`L.orAlternatively`](#l-oralternatively) and [`L.choices`](#l-choices).

For example:

```js
L.modify(
  L.alternatives(
    L.negate,
    L.dropPrefix('-')
  ),
  R.toString,
  -1
)
// '-1'
```

##### <a id="l-applyat"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-applyat) [`L.applyAt(elementsOptic, isomorphism) ~> isomorphism`](#l-applyat "L.applyAt: (POptic s a, PIso a a) -> PIso s s") <small><sup>v14.9.0</sup></small>

`L.applyAt` creates an isomorphism by applying the given isomorphism at each
focus of the given optic.  See also [`L.conjugate`](#l-conjugate).

For example:

```js
L.get(L.applyAt(L.entries, L.reverse), {bar: 'foo', value: 'key'})
// { foo: 'bar', key: 'value' }
```

##### <a id="l-attempteverydown"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-attempteverydown) [`L.attemptEveryDown(isomorphism) ~> isomorphism`](#l-attempteverydown "L.attemptEveryDown: (POptic a b) -> PIso s t") <small><sup>v14.13.0</sup></small>

`L.attemptEveryDown` descends into plain arrays and objects down towards the
leafs and tries to apply the given isomorphism to every position in the data
structure.  In case the isomorphism produces a non-`undefined` result for any
focus, the focus is replaced with the result.  Otherwise the focus is kept as
is.  See also [`L.attemptEveryUp`](#l-attempteveryup).

##### <a id="l-attempteveryup"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-attempteveryup) [`L.attemptEveryUp(isomorphism) ~> isomorphism`](#l-attempteveryup "L.attemptEveryUp: (POptic a b) -> PIso s t") <small><sup>v14.13.0</sup></small>

`L.attemptEveryUp` descends into plain arrays and objects and starting from the
leafs up towards the root tries to apply the given isomorphism to every position
in the data structure.  In case the isomorphism produces a non-`undefined`
result for any focus, the focus is replaced with the result.  Otherwise the
focus is kept as is.  See also [`L.attemptEveryDown`](#l-attempteverydown).

##### <a id="l-attemptsomedown"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-attemptsomedown) [`L.attemptSomeDown(isomorphism) ~> isomorphism`](#l-attemptsomedown "L.attemptSomeDoen: (POptic a b) -> PIso s t") <small><sup>v14.13.0</sup></small>

`L.attemptSomeDown` descends into plain arrays and objects down towards the
leafs and tries to apply the given isomorphism to every position.  In case the
isomorphism produces a non-`undefined` result, the focus is replaced with the
result and the result will not be traversed further.  Otherwise the focus is
kept as is and the downward traversal is continued.  See also
[`L.attemptEveryDown`](#l-attempteverydown).

##### <a id="l-conjugate"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-conjugate) [`L.conjugate(contextIsomorphism, isomorphism) ~> isomorphism`](#l-conjugate "L.conjugate: PIso s a -> PIso a a -> PIso s s") <small><sup>v14.9.0</sup></small>

`L.conjugate(context, iso)` is shorthand for `[context, iso,
L.inverse(context)]` and allows one to apply an isomorphism, or transform data
with an isomorphism, within the codomain of another isomorphism.  `L.conjugate`
can be seen as an optimized version of [`L.applyAt`](#l-applyat) for cases where
the elements optic is an isomorphism.

For example:

```js
L.get(L.conjugate(L.uncouple('='), L.reverse), 'key=value')
// 'value=key'
```

##### <a id="l-fold"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-fold) [`L.fold(isomorphism) ~> isomorphism`](#l-fold "L.fold: PIso [s, x] s -> PIso [s, xs] s") <small><sup>v14.13.0</sup></small>

`L.fold` folds a pair `[s, xs]` of an initial state and an array using the given
isomorphism, that will be passed pairs `[s, x]` with current state and an
element of the array and must produce the next state, into the final state
produced by the isomorphism.  See also [`L.unfold`](#l-unfold).

##### <a id="l-inverse"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-inverse) [`L.inverse(isomorphism) ~> isomorphism`](#l-inverse "L.inverse: PIso a b -> PIso b a") <small><sup>v4.1.0</sup></small>

`L.inverse` returns the inverse of the given isomorphism.  Note that this
operation only makes sense on isomorphisms.

For example:

```js
L.get(L.inverse(offBy1), 1)
// 0
```

##### <a id="l-iterate"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-iterate) [`L.iterate(isomorphism) ~> isomorphism`](#l-iterate "L.iterate: PIso a a -> PIso a a") <small><sup>v14.3.0</sup></small>

`L.iterate` returns a partial isomorphism that applies the given partial
isomorphism repeatedly until it produces `undefined` at which point the previous
result is produced.

For example:

```js
const reverseStep = L.mapping((xs, y, ys) => [
  [ys, [y, ...xs]],
  [[y, ...ys], xs]
])

L.get(L.iterate(reverseStep), [[], [3, 1, 4, 1]])
// [ [ 1, 4, 1, 3 ], [] ]
```
```js
L.getInverse(L.iterate(reverseStep), [[1, 4, 1, 3], []])
// [ [], [ 3, 1, 4, 1 ] ]
```

##### <a id="l-oralternatively"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-oralternatively) [`L.orAlternatively(backupIsomorphism, primaryIsomorphism) ~> isomorphism`](#l-oralternatively "L.orAlternatively: (PIso s a, PIso s a) -> PIso s a") <small><sup>v14.7.0</sup></small>

`L.orAlternatively(backupIsomorphism, primaryIsomorphism)`, in both read and
write direction, acts like `primaryIsomorphism` when its view is not `undefined`
and otherwise like `backupIsomorphism`.  See also [`L.orElse`](#l-orelse).

Note that [`L.alternatives(...isomorphisms)`](#l-alternatives) is equivalent to
`isomorphisms.reduceRight(L.orAlternatively)`.

##### <a id="l-unfold"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-unfold) [`L.unfold(isomorphism) ~> isomorphism`](#l-unfold "L.fold: PIso s [s, x] -> PIso s [s, xs]") <small><sup>v14.13.0</sup></small>

`L.unfold` unfolds from a given initial state a pair `[s, xs]` of the final
state and an array of elements produced by the given isomorphism which will be
passed a state and must produce a pair `[s, x]` of the next state and an element
or `undefined` to indicate that the state was the final state.  See also
[`L.fold`](#l-fold).

#### <a id="basic-isomorphisms"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#basic-isomorphisms) [Basic isomorphisms](#basic-isomorphisms)

##### <a id="l-complement"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-complement) [`L.complement ~> isomorphism`](#l-complement "L.complement: PIso Boolean Boolean") <small><sup>v9.7.0</sup></small>

`L.complement` is an isomorphism that performs logical negation of any
non-`undefined` value when either read or written through.

For example:

```js
L.set(
  [L.complement, L.log()],
  'Could be anything truthy',
  'Also converted to bool'
)
// get false
// set 'Could be anything truthy'
// false
```

##### <a id="l-identity"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-identity) [`L.identity ~> isomorphism`](#l-identity "L.identity: PIso s s") <small><sup>v1.3.0</sup></small>

`L.identity` is the identity element of lens composition and also the identity
isomorphism.  `L.identity` can also been seen as specifying an empty path.
Indeed, in this library, when used as an optic, `L.identity` is equivalent to
[`[]`](#l-compose).  The following equations characterize `L.identity`:

```jsx
      L.get(L.identity, x) = x
L.modify(L.identity, f, x) = f(x)
  L.compose(L.identity, l) = l
  L.compose(l, L.identity) = l
```

##### <a id="l-is"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-is) [`L.is(value) ~> isomorphism`](#l-is "L.is: v -> PIso v Boolean") <small><sup>v11.1.0</sup></small>

`L.is` reads the given value as `true` and everything else as `false` and writes
`true` as the given value and everything else as `undefined`.  See
[here](#an-array-of-ids-as-boolean-flags) for an example.

##### <a id="l-subset"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-subset) [`L.subset(maybeValue => testable) ~> isomorphism`](#l-subset "L.subset: (Maybe a -> Boolean) -> PIso a a") <small><sup>v14.3.0</sup></small>

`L.subset` returns an isomorphism that acts like the identity when the data
passes the given predicate and otherwise maps the data to `undefined`.  The
predicate is not called unnecessarily in case the focus is `undefined`.  See
also [`L.pattern`](#l-pattern).

#### <a id="array-isomorphisms"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#array-isomorphisms) [Array isomorphisms](#array-isomorphisms)

##### <a id="l-array"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-array) [`L.array(isomorphism) ~> isomorphism`](#l-array "L.array: PIso a b -> PIso [a] [b]") <small><sup>v11.19.0</sup></small>

`L.array` lifts an isomorphism between elements, `a ≅ b`, to an isomorphism
between an [array-like](#array-like) object and an array of elements, `[a] ≅
[b]`.

For example:

```js
L.getInverse(L.array(L.pick({x: 'y', z: 'x'})), [{x:2, z:1}, {x:4, z:3}])
// [{x:1, y:2}, {x:3, y:4}]
```

Elements mapped to `undefined` by the isomorphism on elements are removed from
the resulting array in both directions.

##### <a id="l-arrays"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-arrays) [`L.arrays(isomorphism) ~> isomorphism`](#l-arrays "L.arrays: PIso a b -> PIso [a] [b]") <small><sup>v14.13.0</sup></small>

`L.arrays` is a strict version of [`L.array`](#l-array) such that if any element
is mapped to `undefined` then so will the whole result.

##### <a id="l-groupby"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-groupby) [`L.groupBy(keyLens) ~> isomorphism`](#l-groupby "L.groupBy: PLens a k -> PIso [a] [[a]]") <small><sup>v14.13.0</sup></small>

`L.groupBy` groups elements in an array into arrays such that each array has the
same key as returned by the given lens or function.  See also
[`L.ungroupBy`](#l-ungroupby).

##### <a id="l-indexed"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-indexed) [`L.indexed ~> isomorphism`](#l-indexed "L.indexed: PIso [a] [[Integer, a]]") <small><sup>v11.21.0</sup></small>

`L.indexed` is an isomorphism between an [array-like](#array-like) object and an
array of `[index, value]` pairs.

For example:

```js
L.modify(
  [
    L.rewrite(R.join('')),
    L.indexed,
    L.normalize(R.sortBy(L.get(1))),
    0,
    1
  ],
  R.toUpper,
  'optics'
)
// 'optiCs'
```

##### <a id="l-reverse"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-reverse) [`L.reverse ~> isomorphism`](#l-reverse "L.reverse: PIso [a] [a]") <small><sup>v11.22.0</sup></small>

`L.reverse` is an isomorphism between an [array-like](#array-like) object
and its reverse.

For example:

```js
L.join(', ', [L.reverse, L.elems], 'abc')
// 'c, b, a'
```

##### <a id="l-singleton"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-singleton) [`L.singleton ~> isomorphism`](#l-singleton "L.singleton: PIso [a] a") <small><sup>v11.18.0</sup></small>

`L.singleton` is a partial isomorphism between an [array-like](#array-like)
object, `[x]`, that contains a single element and that element `x`.  When
written through with a non-`undefined` value, the result is an array containing
the value.

For example:

```js
L.modify(L.singleton, R.negate, [1]) // [-1]
```

Note that in case the target of `L.singleton` is an array-like object that does
not contain exactly one element, then the view will be `undefined`.  The reason
for this behaviour is that it allows `L.singleton` to not only be used to access
the first element of an array-like object, but to also check that the object is
of the expected form.

##### <a id="l-ungroupby"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-ungroupby) [`L.ungroupBy(keyLens) ~> isomorphism`](#l-ungroupby "L.ungroupBy: PLens a k -> PIso [[a]] [a]") <small><sup>v14.13.0</sup></small>

`L.ungroupBy` unnests arrays of elements that have the same key as returned by
the given lens or function to an array of the elements from all the arrays.  See
also [`L.groupBy`](#l-groupby).

##### <a id="l-unzipwith1"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-unzipwith1) [`L.unzipWith1(isomorphism) ~> isomorphism`](#l-unzipwith1 "L.unzipWith1: PIso c [a, b] -> PIso [c] [a, [b]]") <small><sup>v14.13.0</sup></small>

`L.unzipWith1` unzips elements from a non-empty array (hence the `1`) into a
pair of a constant value and an array of elements, as extracted from the pairs
produced by the given isomorphism from the elements of the source array such
that the first element of each pair is the same for all elements of the original
array.  See also [`L.zipWith1`](#l-zipwith1).

##### <a id="l-zipwith1"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-zipwith1) [`L.zipWith1(isomorphism) ~> isomorphism`](#l-zipwith1 "L.zipWith1: PIso [a, b] c -> PIso [a, [b]] [c]") <small><sup>v14.13.0</sup></small>

`L.zipWith1` zips elements from a pair of a constant value and a non-empty array
(hence the `1`) into an array of elements as produced by the given isomorphism
that will be given pairs of the constant value and an element from the array.
See also [`L.unzipWith1`](#l-unzipwith1).

#### <a id="object-isomorphisms"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#object-isomorphisms) [Object isomorphisms](#object-isomorphisms)

##### <a id="l-disjoint"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-disjoint) [`L.disjoint(propName => propName) ~> isomorphism`](#l-disjoint "L.disjoint: (String k -> String g) -> PIso {[k]: a} {[g]: {[k]: a}}") <small><sup>v13.13.0</sup></small>

`L.disjoint` divides an object into disjoint subsets based on the given function
that maps keys to group keys.

For example:

```js
L.collect(
  L.lazy(rec => L.cond(
    [R.is(Array), [L.elems, rec]],
    [R.is(Object), [
      L.disjoint(key => key === 'children' ? 'nest' : 'rest'),
      L.branch({rest: [], nest: ['children', rec]})
    ]]
  )),
  {
    id: 1,
    value: 'root',
    children: [
      {id: 2, value: 'a', children: []},
      {id: 3, value: 'b', extra: 1}
    ]
  }
)
// [{id: 1, value: 'root'}, {id: 2, value: 'a'}, {id: 3, value: 'b', extra: 1}]
```

##### <a id="l-keyed"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-keyed) [`L.keyed ~> isomorphism`](#l-keyed "L.keyed: PIso {p: a, ...ps} [[String, a]]") <small><sup>v11.21.0</sup></small>

`L.keyed` is an isomorphism between an object and an array of `[key, value]`
pairs.

For example:

```js
L.get(L.keyed, {a: 1, b: 2})
// [ ['a', 1], ['b', 2] ]
```

##### <a id="l-multikeyed"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-multikeyed) [`L.multikeyed ~> isomorphism`](#l-multikeyed "L.multikeyed: PIso {p: a|[a], ...ps} [[String, a]]") <small><sup>v14.1.0</sup></small>

`L.multikeyed` is an isomorphism between an object and an array of `[key,
value]` pairs where a `key` may appear multiple times and in which case the
corresponding object property value is an array.  See also
[`L.querystring`](#l-querystring).

An application of `L.multikeyed` is manipulating URL query strings.  For
example:

```js
const querystring = [
  L.dropPrefix('?'),
  L.replaces('+', '%20'),
  L.split('&'),
  L.array([
    L.uncouple('='),
    L.array(L.uriComponent)
  ]),
  L.inverse(L.multikeyed)
]
```
```js
L.get(querystring, '?foo=bar&abc=xyz&abc=123')
// { foo: 'bar', abc: ['xyz', '123'] }
```
```js
L.set(
  [querystring, 'foo'],
  'baz',
  '?foo=bar&abc=xyz&abc=123'
)
// '?foo=baz&abc=xyz&abc=123'
```

#### <a id="standard-isomorphisms"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#standard-isomorphisms) [Standard isomorphisms](#standard-isomorphisms)

Several pairs of standard functions, such as the
[`decodeURIComponent`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/decodeURIComponent)
and
[`encodeURIComponent`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent)
functions, form partial isomorphisms.  Some of those pairs of functions are
wrapped for direct use as isomorphisms in this library, such as the
[`L.uriComponent`](#l-uricomponent) isomorphism.

Invalid inputs are sometimes reported by standard functions by throwing
[`Error`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
objects.  As a general principle, performing an otherwise valid read or write
through an optic in this library should not throw on invalid inputs to support
optimistic queries and updates.  On the other hand, discarding the information
provided by a thrown
[`Error`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
object is undesirable.  Therefore standard isomorphisms based on throwing
standard functions catch and pass the error as the result.  For example:

```js
L.get(L.uriComponent, '%') instanceof Error // Does not throw!
// true
```

Such errors can be, for example, filtered out via composition to obtain the
ordinary partial behavior of producing `undefined` for unexpected inputs:

```js
L.get(
  [
    L.uriComponent,
    L.unless(R.is(Error))
  ],
  '%'
)
// undefined
```

##### <a id="l-json"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-json) [`L.json({reviver, replacer, space}) ~> isomorphism`](#l-json "L.json: {reviver, replacer, space} -> PIso String JSON") <small><sup>v11.3.0</sup></small>

`L.json({reviver, replacer, space})` returns an isomorphism based on the
standard
[`JSON.parse`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse)
and
[`JSON.stringify`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify)
functions.  Parsing [errors are caught](#standard-isomorphisms) and passed as
results.  The optional `reviver` is passed to
[`JSON.parse`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse)
and the optional `replacer` and `space` are passed to
[`JSON.stringify`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify).

For example:

```js
L.transform(
  [L.json(), 'foo', L.elems, L.modifyOp(R.negate)],
  '{"foo":[3,1,4]}'
)
// '{"foo":[-3,-1,-4]}'
```

##### <a id="l-uri"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-uri) [`L.uri ~> isomorphism`](#l-uri "L.uri: PIso String String") <small><sup>v11.3.0</sup></small>

`L.uri` is an isomorphism based on the standard
[`decodeURI`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/decodeURI)
and
[`encodeURI`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURI)
functions.  Decoding [errors are caught](#standard-isomorphisms) and passed as
results.

##### <a id="l-uricomponent"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-uricomponent) [`L.uriComponent ~> isomorphism`](#l-uricomponent "L.uriComponent: PIso String (Boolean|Number|String)") <small><sup>v11.3.0</sup></small>

`L.uriComponent` is an isomorphism based on the standard
[`decodeURIComponent`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/decodeURIComponent)
and
[`encodeURIComponent`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent)
functions.  Decoding [errors are caught](#standard-isomorphisms) and passed as
results.

#### <a id="standardish-isomorphisms"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#standardish-isomorphisms) [Standardish isomorphisms](#standardish-isomorphisms)

##### <a id="l-querystring"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-querystring) [`L.querystring ~> isomorphism`](#l-querystring "L.querystring: PIso String {p: Boolean|Number|String|[Boolean|Number|String], ...ps}") <small><sup>v14.2.0</sup></small>

`L.querystring` is an isomorphism between URL query strings and parameter
objects.  `L.querystring` approximates Node's [Query
String](https://nodejs.org/api/querystring.html) functionality, but does not
produce identical results.  See also [`L.dropPrefix`](#l-dropprefix).

For example:

```js
L.getInverse(L.querystring, { foo: 'bar', abc: ['xyz', 123], corge: '' })
// 'foo=bar&abc=xyz&abc=123&corge'
```

#### <a id="string-isomorphisms"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#string-isomorphisms) [String isomorphisms](#string-isomorphisms)

##### <a id="l-dropprefix"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-dropPrefix) [`L.dropPrefix(prefix) ~> isomorphism`](#l-dropprefix "L.dropPrefix: String -> PIso String String") <small><sup>v13.8.0</sup></small>

`L.dropPrefix` drops the given prefix from the beginning of the string when read
through and adds it when written through.  In case the input does not contain
the prefix, the result is `undefined`, which allows `L.dropPrefix` to be used as
a predicate.  See also [`L.dropSuffix`](#l-dropsuffix).

For example:

```js
L.get(L.dropPrefix('?'), '?foo=bar')
// 'foo=bar'
```

```js
L.getInverse(L.dropPrefix('?'), 'foo=bar')
// '?foo=bar'
```

##### <a id="l-dropsuffix"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-dropSuffix) [`L.dropSuffix(suffix) ~> isomorphism`](#l-dropsuffix "L.dropSuffix: String -> PIso String String") <small><sup>v13.8.0</sup></small>

`L.dropSuffix` drops the given suffix from the end of the string when read
through and adds it when written through.  In case the input does not contain
the suffix, the result is `undefined`, which allows `L.dropSuffix` to be used as
a predicate.  See also [`L.dropPrefix`](#l-dropprefix).

For example:

```js
L.get(L.dropSuffix('.bar'), 'foo.bar')
// 'foo'
```

```js
L.getInverse(L.dropSuffix('.bar'), 'foo')
// 'foo.bar'
```

##### <a id="l-replaces"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-replaces) [`L.replaces(substringIn, substringOut) ~> isomorphism`](#l-replaces "L.replaces: String -> String -> PIso String String") <small><sup>v13.8.0</sup></small>

`L.replaces` replaces substrings in the string passing through both when read
and written.

For example:

```js
L.get(L.replaces('+', ' '), 'Is+this too+much?')
// 'Is this too much?'
```

```js
L.getInverse(L.replaces('+', ' '), 'Is URL+encoding fun?')
// 'Is+URL+encoding+fun?'
```

##### <a id="l-split"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-split) [`L.split(separator[, separatorRegExp]) ~> isomorphism`](#l-split "L.split: (String[, String | RegExp]) -> PIso String [String]") <small><sup>v13.8.0</sup></small>

`L.split` splits a string with given separator into an array when read through
and joins an array of strings into a string with the separator when written
through.  The second argument to `L.split` is optional and specifies the pattern
to be used for splitting instead of the default separator string.  See also
[`L.uncouple`](#l-uncouple).

For example:

```js
L.get(L.split(',', /\s*,\s*/), 'comma, separated, items')
// ['comma', 'separated', 'items']
```

```js
L.getInverse(L.split('&'), ['roses=red', 'violets=blue', 'sugar=sweet'])
// 'roses=red&violets=blue&sugar=sweet'
```

##### <a id="l-uncouple"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-uncouple) [`L.uncouple(separator[, separatorRegExp]) ~> isomorphism`](#l-uncouple "L.uncouple: (String[, String | RegExp]) -> PIso String [String, String]") <small><sup>v13.8.0</sup></small>

`L.uncouple` splits a string with the given separator into a pair when read
through and joins a pair of strings into a string with the separator when
written through.  In case the input string does not contain the separator, the
second element of the pair will be an empty string.  Likewise, if the second
element of the pair is an empty string, no separator is written to the resulting
string.  The second argument to `L.uncouple` is optional and specifies the
pattern to be used for splitting instead of the default separator string.  See
also [`L.split`](#l-split).

For example:

```js
L.get(L.uncouple('=', /\s*=\s*/), 'foo = bar')
// [ 'foo', 'bar' ]
```

```js
L.getInverse(L.uncouple('='), ['key', ''])
// 'key'
```

#### <a id="arithmetic-isomorphisms"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#arithmetic-isomorphisms) [Arithmetic isomorphisms](#arithmetic-isomorphisms)

##### <a id="l-add"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-add) [`L.add(number) ~> isomorphism`](#l-add "L.add: Number -> PIso Number Number") <small><sup>v13.9.0</sup></small>

`L.add` adds the given constant to the number in focus when read through and
subtracts when written through.

For example:

```js
L.get(L.add(1), 2)
// 3
```

##### <a id="l-divide"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-divide) [`L.divide(number) ~> isomorphism`](#l-divide "L.divide: Number -> PIso Number Number") <small><sup>v13.9.0</sup></small>

`L.divide` divides the number in focus by the given constant when read through
and multiplies when written through.

For example:

```js
L.get(L.divide(2), 6)
// 3
```

##### <a id="l-multiply"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-multiply) [`L.multiply(number) ~> isomorphism`](#l-multiply "L.multiply: Number -> PIso Number Number") <small><sup>v13.9.0</sup></small>

`L.multiply` multiplies the number in focus by the given constant when read
through and divides when written through.

For example:

```js
L.get(L.multiply(2), 3)
// 6
```

##### <a id="l-negate"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-negate) [`L.negate ~> isomorphism`](#l-negate "L.negate: PIso Number Number") <small><sup>v13.9.0</sup></small>

`L.negate` negates the number in focus when either read or written through.

For example:

```js
L.get(L.negate, 2)
// -2
```

##### <a id="l-subtract"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-subtract) [`L.subtract(number) ~> isomorphism`](#l-subtract "L.subtract: Number -> PIso Number Number") <small><sup>v13.9.0</sup></small>

`L.subtract` subtracts the given constant from the number in focus when read
through and adds when written through.

For example:

```js
L.get(L.subtract(1), 3)
// 2
```

### <a id="interop"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#interop) [Interop](#interop)

#### <a id="fantasy-land"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#fantasy-land) [Fantasy Land](#fantasy-land)

Partial Lenses directly supports only the [Static
Land](https://github.com/rpominov/static-land) specification, but it is possible
to also use [Fantasy Land](https://github.com/fantasyland/fantasy-land)
compatible types with Partial Lenses.  Note that many Fantasy Land compatible
libraries are also directly Static Land compatible and can be used directly with
Partial Lenses without using the below conversion functions.

##### <a id="l-fantasyfunctor"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-fantasyFunctor) [`L.FantasyFunctor ~> Functor`](#l-fantasyfunctor "L.FantasyFunctor: Functor") <small><sup>v14.5.0</sup></small>

`L.FantasyFunctor` is a Static Land compatible functor that dispatches to the
`fantasy-land/map` method.

##### <a id="l-fromfantasy"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-fromfantasy) [`L.fromFantasy(TypeRep) ~> Functor|Applicative|Monad`](#l-fromfantasy "L.fromFantasy: TypeRep -> Functor|Applicative|Monad") <small><sup>v14.5.0</sup></small>

`L.fromFantasy` attempts to convert a given Fantasy Land compatible type
representative to a Static Land compatible functor, applicative, or monad based
on which dynamic and static methods the type representative provides.  See also
[`L.fromFantasyApplicative`](#l-fromfantasyapplicative) and
[`L.fromFantasyMonad`](#l-fromfantasymonad).

##### <a id="l-fromfantasyapplicative"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-fromfantasyApplicative) [`L.fromFantasyApplicative(TypeRep) ~> Applicative`](#l-fromfantasyapplicative "L.fromFantasy: TypeRep -> Applicative") <small><sup>v14.5.0</sup></small>

`L.fromFantasyApplicative` converts a given Fantasy Land compatible type
representative of an applicative to a Static Land compatible applicative.  The
type must provide a static `fantasy-land/of` method and dynamic
`fantasy-land/map` and `fantasy-land/ap` methods.  See also
[`L.fromFantasy`](#l-fromfantasy).

##### <a id="l-fromfantasymonad"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-fromfantasyMonad) [`L.fromFantasyMonad(TypeRep) ~> Monad`](#l-fromfantasy "L.fromFantasyMonad: TypeRep -> Monad") <small><sup>v14.5.0</sup></small>

`L.fromFantasyMonad` converts a given Fantasy Land compatible type
representative of a monad to a Static Land compatible monad.  The type must
provide a static `fantasy-land/of` method and dynamic `fantasy-land/map`,
`fantasy-land/ap`, and `fantasy-land/chain` methods.  See also
[`L.fromFantasy`](#l-fromfantasy).

#### <a id="json-pointer"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#json-pointer) [JSON Pointer](#json-pointer)

##### <a id="l-pointer"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-pointer) [`L.pointer(jsonPointer) ~> lens`](#l-pointer "L.pointer: JSONPointer s a -> PLens s a") <small><sup>v11.21.0</sup></small>

`L.pointer` converts a valid [JSON Pointer](https://tools.ietf.org/html/rfc6901)
(string) into a bidirectional lens. Works with [JSON
String](https://tools.ietf.org/html/rfc6901#section-5) and [URI Fragment
Identifier](https://tools.ietf.org/html/rfc6901#section-6) representations.

For Example:

```js
L.get(L.pointer('/foo/0'), {foo: [1, 2]})
// 1
```
```js
L.modify(L.pointer('#/foo/1'), x => x + 1, {foo: [1, 2]})
// {foo: [1, 3]}
```

### <a id="auxiliary"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#auxiliary) [Auxiliary](#auxiliary)

#### <a id="l-seemsarraylike"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#l-seemsarraylike) [`L.seemsArrayLike(anything) ~> boolean`](#l-seemsarraylike "L.seemsArrayLike: any -> Boolean") <small><sup>v11.4.0</sup></small>

`L.seemsArrayLike` determines whether the given value is an `instanceof Object`
that has a non-negative integer `length` property or a string, which are not
Objects in JavaScript.  In this library, such values are considered
[array-like](#array-like) objects that can be manipulated with various optics.

Note that this function is intentionally loose, which is also intentionally
apparent from the name of this function.  JavaScript includes many array-like
values, including normal
[arrays](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array),
[typed
arrays](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Typed_arrays),
and
[strings](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/String).
Unfortunately there seems to be no simple way to directly and precisely test for
all of those.  Testing explicitly for every standard variation would be costly
and might not cover user defined types.  Fortunately, optics are targeting
specific paths inside data-structures, rather than completely arbitrary values,
which means that even a loose test can be accurate enough.

## <a id="examples"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#examples) [Examples](#examples)

Note that if you are new to lenses, then you probably want to start with the
[tutorial](#tutorial).

### <a id="an-array-of-ids-as-boolean-flags"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#an-array-of-ids-as-boolean-flags) [An array of ids as boolean flags](#an-array-of-ids-as-boolean-flags)

A case that we have run into multiple times is where we have an array of
constant strings that we wish to manipulate as if it was a collection of boolean
flags:

```js
const sampleFlags = ['id-19', 'id-76']
```

Here is a parameterized lens that does just that:

```js
const flag = id => [
  L.normalize(R.sortBy(R.identity)),
  L.find(R.equals(id)),
  L.is(id)
]
```

Now we can treat individual constants as boolean flags:

```js
L.get(flag('id-69'), sampleFlags)
// false
```
```js
L.get(flag('id-76'), sampleFlags)
// true
```

In both directions:

```js
L.set(flag('id-69'), true, sampleFlags)
// ['id-19', 'id-69', 'id-76']
```
```js
L.set(flag('id-76'), false, sampleFlags)
// ['id-19']
```

### <a id="dependent-fields"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#dependent-fields) [Dependent fields](#dependent-fields)

It is not atypical to have UIs where one selection has an effect on other
selections.  For example, you could have an UI where you can specify `maximum`
and `initial` values for some measure and the idea is that the `initial` value
cannot be greater than the `maximum` value.  One way to deal with this
requirement is to implement it in the lenses that are used to access the
`maximum` and `initial` values.  This way the UI components that allows the user
to edit those values can be dumb and do not need to know about the restrictions.

One way to build such a lens is to use a combination of [`L.props`](#l-props)
(or, in more complex cases, [`L.pick`](#l-pick)) to limit the set of properties
to deal with, and [`L.rewrite`](#l-rewrite) to insert the desired restriction
logic.  Here is how it could look like for the `maximum`:

```js
const maximum = [
  L.props('maximum', 'initial'),
  L.rewrite(props => {
    const {maximum, initial} = props
    if (maximum < initial)
      return {maximum, initial: maximum}
    else
      return props
  }),
  'maximum'
]
```

Now:

```js
L.set(maximum, 5, {maximum: 10, initial: 8, something: 'else'})
// {maximum: 5, initial: 5, something: 'else'}
```

### <a id="collection-toggle"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#collection-toggle) [Collection toggle](#collection-toggle)

A typical element of UIs that display a list of selectable items is a checkbox
to select or unselect all items.  For example, the
[TodoMVC](http://todomvc.com/) spec includes [such a
checkbox](https://github.com/tastejs/todomvc/blob/master/app-spec.md#mark-all-as-complete).
The state of a checkbox is a single boolean.  How do we create a lens that
transforms a collection of booleans into a single boolean?

The state of a todo list contains a boolean `completed` flag per item:

```js
const sampleTodos = [{completed: true}, {completed: false}, {completed: true}]
```

We can address those flags with a traversal:

```js
const completedFlags = [L.elems, 'completed']
```

To compute a single boolean out of a traversal over booleans we can use the
[`L.and`](#l-and) fold and use that to define a lens parameterized over flag
traversals using [`L.foldTraversalLens`](#l-foldtraversallens):

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

As an exercise define `unselectAll` using the [`L.or`](#l-or) fold.  How does it
differ from `selectAll`?

### <a id="bst-as-a-lens"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#bst-as-a-lens) [BST as a lens](#bst-as-a-lens)

Binary search trees might initially seem to be outside the scope of definable
lenses.  However, given basic BST operations, one could easily wrap them as a
primitive partial lens.  But could we leverage lens combinators to build a BST
lens more compositionally?

We can.  The [`L.cond`](#l-cond) combinator allows for dynamic selection of
lenses based on examining the data structure being manipulated.  Using
[`L.cond`](#l-cond) we can write the ordinary BST logic to pick the correct
branch based on the key in the currently examined node and the key that we are
looking for.  So, here is our first attempt at a BST lens:

```js
const searchAttempt = key => L.lazy(rec => [
  L.cond(
    [n => !n || key === n.key, L.defaults({key})],
    [n => key < n.key, ['smaller', rec]],
    [['greater', rec]]
  )
])

const valueOfAttempt = key => [searchAttempt(key), 'value']
```

Note that we also make use of the [`L.lazy`](#l-lazy) combinator to create a
recursive lens with a cyclic representation.

This actually works to a degree.  We can use the `valueOfAttempt` lens
constructor to build a binary tree.  Here is a little helper to build a tree
from pairs:

```js
const fromPairs = R.reduce(
  (t, [k, v]) => L.set(valueOfAttempt(k), v, t),
  undefined
)
```

Now:

```js
const sampleBST = fromPairs([[3, 'g'], [2, 'a'], [1, 'm'], [4, 'i'], [5, 'c']])
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
after changes.  The [`L.rewrite`](#l-rewrite) combinator can be used for that
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
  L.cond(
    [n => !n || key === n.key, L.defaults({key})],
    [n => key < n.key, ['smaller', rec]],
    [['greater', rec]]
  )
])

const valueOf = key => [search(key), 'value']
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
Perhaps you might even enhance it to maintain a balance condition such as
[AVL](https://en.wikipedia.org/wiki/AVL_tree) or
[Red-Black](https://en.wikipedia.org/wiki/Red%E2%80%93black_tree).  Another
worthy exercise would be to make it so that the empty binary tree is `null`
rather than `undefined`.

#### <a id="bst-traversal"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#bst-traversal) [BST traversal](#bst-traversal)

What about [traversals](#traversals) over BSTs?  We can use the
[`L.branch`](#l-branch) combinator to define an in-order traversal over the
values of a BST:

```js
const values = L.lazy(rec => [
  L.optional,
  naiveBST,
  L.branch({smaller: rec, value: [], greater: rec})
])
```

Given a binary tree `sampleBST` we can now manipulate it as a whole.  For
example:

```js
L.join('-', values, sampleBST)
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
L.remove([values, L.when(x => x > 'e')], sampleBST)
// { key: 5, value: 'c', smaller: { key: 2, value: 'a' } }
```

### <a id="interfacing"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#interfacing) [Interfacing with Immutable.js](#interfacing)

[Immutable.js](http://facebook.github.io/immutable-js/) is a popular library
providing immutable data structures.  As argued in [Lenses with
Immutable.js](https://medium.com/@drboolean/lenses-with-immutable-js-9bda85674780#.kzq41xgw3)
it can be useful to be able to manipulate Immutable.js data structures using
[optics](#optics).

When interfacing external libraries with partial lenses one does need to
consider whether and how to support partiality.  Partial lenses allow one to
insert new and remove existing elements rather than just view and update
existing elements.

#### <a id="list-indexing"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#list-indexing) [`List` indexing](#list-indexing)

Here is a primitive partial lens for indexing
[`List`](http://facebook.github.io/immutable-js/docs/#/List) written using
[`L.lens`](#l-lens):

```js
const getList = i => xs => Immutable.List.isList(xs) ? xs.get(i) : undefined

const setList = i => (x, xs) => {
  if (!Immutable.List.isList(xs))
    xs = Immutable.List()
  if (x !== undefined)
    return xs.set(i, x)
  return xs.delete(i)
}

const idxList = i => [L.lens(getList(i), setList(i)), L.setIx(i)]
```

Note how the above uses `isList` to check the input.  When viewing, in case the
input is not a `List`, the proper result is `undefined`.  When updating the
proper way to handle a non-`List` is to treat it as empty.  Also, when updating,
we treat `undefined` as a request to `delete` rather than `set`.  `idxList` also
uses [`L.setIx`](#l-setix) to set the index to the given index `i`.

We can now view existing elements:

```js
const sampleList = Immutable.List(['a', 'l', 'i', 's', 't'])
L.get(idxList(2), sampleList)
// 'i'
```

Update existing elements:

```js
L.modify(idxList(1), R.toUpper, sampleList)
// List [ 'a', 'L', 'i', 's', 't' ]
```

And remove existing elements:

```js
L.remove(idxList(0), sampleList)
// List [ 'l', 'i', 's', 't' ]
```

We can also create lists from non-lists:

```js
L.set(idxList(0), 'x', undefined)
// List [ 'x' ]
```

And we can also append new elements:

```js
L.set(idxList(5), '!', sampleList)
// List [ 'a', 'l', 'i', 's', 't', '!' ]
```

Consider what happens when the index given to `idxList` points further beyond
the last element.  Both the [`L.index`](#l-index) lens and the above lens add
`undefined` values, which is not ideal with partial lenses, because of the
special treatment of `undefined`.  In practise, however, it is not typical to
`set` elements except to append just after the last element.

#### <a id="interfacing-traversals"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#interfacing-traversals) [Interfacing traversals](#interfacing-traversals)

Fortunately we do not need Immutable.js data structures to provide a compatible
*partial*
[`traverse`](https://github.com/rpominov/static-land/blob/master/docs/spec.md#traversable)
function to support [traversals](#traversals), because it is also possible to
implement traversals simply by providing suitable isomorphisms between
Immutable.js data structures and JSON.  Here is a partial
[isomorphism](#isomorphisms) between `List` and arrays:

```js
const fromList = xs => Immutable.List.isList(xs) ? xs.toArray() : undefined
const toList = xs => R.is(Array, xs) && xs.length ? Immutable.List(xs) : undefined
const isoList = L.iso(fromList, toList)
```

So, now we can [compose](#l-compose) a traversal over `List` as:

```js
const seqList = [isoList, L.elems]
```

And all the usual operations work as one would expect, for example:

```js
L.remove([seqList, L.when(c => c < 'i')], sampleList)
// List [ 'l', 's', 't' ]
```

And:

```js
L.joinAs(
  R.toUpper,
  '',
  [seqList, L.when(c => c <= 'i')],
  sampleList
)
// 'AI'
```

## <a id="deepening-topics"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#deepening-topics) [Deepening topics](#deepening-topics)

### <a id="understanding-filter-find-get-and-when"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#understanding-filter-find-select-and-when) [Understanding `L.filter`, `L.find`, `L.get`, and `L.when`](#understanding-filter-find-get-and-when)

[`L.filter`](#l-filter), [`L.find`](#l-find), [`L.get`](#l-get), and
[`L.when`](#l-when) serve related, but different, purposes and it is important
to understand their differences in order to make best use of them.

Here is a table of their call patterns and type signatures:

| Call pattern                               | Type signature
| ------------------------------------------ | ----------------------------------------------------------
| `L.filter((value, index) => bool) ~> lens` | `L.filter: ((Maybe a, Index) -> Boolean) -> PLens [a] [a]`
| `L.find((value, index) => bool) ~> lens`   | `L.find: ((Maybe a, Index) -> Boolean) -> PLens [a] a`
| `L.get(traversal, data) ~> value`          | `L.get: PTraversal s a -> Maybe s -> Maybe a`
| `L.when((value, index) => bool) ~> optic`  | `L.when: ((Maybe a, Index) -> Boolean) -> POptic a a`

As can be read from above, both [`L.filter`](#l-filter) and [`L.find`](#l-find)
introduce lenses, [`L.get`](#l-get) eliminates a traversal, and
[`L.when`](#l-when) introduces an optic, which will always be a traversal in
this section.  We can also read that [`L.filter`](#l-filter) and
[`L.find`](#l-find) operate on arrays, while [`L.get`](#l-get) and
[`L.when`](#l-when) operate on arbitrary traversals.  Yet another thing to make
note of is that both [`L.find`](#l-find) and [`L.get`](#l-get) are many-to-one
while both [`L.filter`](#l-filter) and [`L.when`](#l-when) retain cardinality.

The following equations relate the operations in the read direction:

```jsx
        L.get([L.filter(p), 0]) = L.get(L.find(p))
    L.get([L.elems, L.when(p)]) = L.get(L.find(p))
L.collect([L.elems, L.when(p)]) = L.get(L.filter(p))
```

In the write direction there are no such simple equations.

[`L.find`](#l-find) can be used to create a bidirectional view of an element in
an array identified by a given predicate.  Despite the name, [`L.find`](#l-find)
is probably not what one should use to generally search for something in a data
structure.

[`L.get`](#l-get) (and [`L.getAs`](#l-getas)) can be used to search
for an element in a data structure following an arbitrary traversal.  That
traversal can, of course, also make use of [`L.when`](#l-when) to filter elements
or to limit the traversal.

[`L.filter`](#l-filter) can be used to create a bidirectional view of a subset
of elements of an array matching a given predicate.  [`L.filter`](#l-filter)
should probably be the least most commonly used of the bunch.  If the end goal
is simply to manipulate multiple elements, it is preferable to use a combination
of [`L.elems`](#l-elems) and [`L.when`](#l-when), because then [no intermediate
array of the elements is
computed](#nesting-traversals-does-not-create-intermediate-aggregates).

## <a id="advanced-topics"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#advanced-topics) [Advanced topics](#advanced-topics)

### <a id="performance-tips"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#performance-tips) [Performance tips](#performance-tips)

#### <a id="nesting-traversals-does-not-create-intermediate-aggregates"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#nesting-traversals-does-not-create-intermediate-aggregates) [Nesting traversals does not create intermediate aggregates](#nesting-traversals-does-not-create-intermediate-aggregates)

Traversals do not materialize intermediate aggregates and it is useful to
understand this performance characteristic.

Consider the following naïve use of [Ramda](http://ramdajs.com/):

```js
const sumPositiveXs = R.pipe(
  R.flatten,
  R.map(R.prop('x')),
  R.filter(R.lt(0)),
  R.sum
)

const sampleXs = [[{x: 1}], [{x: -2}, {x: 2}]]

sumPositiveXs(sampleXs)
// 3
```

A performance problem in the above naïve `sumPositiveXs` function is that aside
from the last step, `R.sum`, every step of the computation, `R.flatten`,
`R.map(R.prop('x'))`, and `R.filter(R.lt(0))`, creates an intermediate array
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
L.sum([L.flatten, 'x', L.when(R.lt(0))], sampleXs)
// 3
```

and, thankfully, it doesn't create intermediate arrays.  This is the case with
traversals in general.

#### <a id="avoid-reallocating-optics-in-l-choose"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#avoid-reallocating-optics-in-l-choose) [Avoid reallocating optics in `L.choose`](#avoid-reallocating-optics-in-l-choose)

The function given to [`L.choose`](#l-choose) is called each time the optic is
used and any allocations done by the function are consequently repeated.

Consider the following example:

```jsx
L.choose(x => Array.isArray(x) ? [L.elems, 'data'] : 'data')
```

A performance issue with the above is that each time it is used on an array, a
new composition, `[L.elems, 'data']`, is allocated.  Performance may be improved
by moving the allocation outside of [`L.choose`](#l-choose):

```jsx
const onArray = [L.elems, 'data']
L.choose(x => Array.isArray(x) ? onArray : 'data')
```

In cases like above you can also use the more restricted [`L.cond`](#l-cond)
combinator:

```jsx
L.cond([Array.isArray, [L.elems, 'data']], ['data'])
```

This has the advantage that the optics are constructed only once.

### <a id="on-bundle-size-and-minification"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#on-bundle-size-and-minification) [On bundle size and minification](#on-bundle-size-and-minification)

The distribution of this library includes a [prebuilt and minified browser
bundle](https://unpkg.com/partial.lenses/dist/partial.lenses.min.js).  However,
this library is not designed to be primarily used via that bundle.  Rather, this
library is bundled with [Rollup](https://rollupjs.org/), uses `/*#__PURE__*/`
annotations to help [UglifyJS](https://github.com/mishoo/UglifyJS2) do better
dead code elimination, and uses `process.env.NODE_ENV` to detect `'production'`
mode to discard some warnings and error checks.  This means that when using
Rollup with [replace](https://github.com/rollup/rollup-plugin-replace) and
[uglify](https://github.com/TrySound/rollup-plugin-uglify) plugins to build
browser bundles, the generated bundles will basically only include what you use
from this library.

For best results, increasing the number of compression passes may allow UglifyJS
to eliminate more dead code.  Here is a sample snippet from a Rollup config:

```jsx
import replace from 'rollup-plugin-replace'
import {uglify} from 'rollup-plugin-uglify'
// ...

export default {
  plugins: [
    replace({
      'process.env.NODE_ENV': JSON.stringify('production')
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

## <a id="background"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#background) [Background](#background)

### <a id="motivation"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#motivation) [Motivation](#motivation)

In late 2015, while implementing UIs for manipulating fairly complex JSON
objects, we wrote a module of additional lens combinators on top of
[Ramda](http://ramdajs.com)'s lenses.  Lenses allowed us to operate on nested
objects in a [compositional](#on-composability) manner and, thanks to treating
data as [immutable](#on-immutability), also made it easy to provide undo-redo.
Pretty quickly, however, it became evident that Ramda's support for lenses left
room for improvement.

First of all, upto and including Ramda version 0.24.1, Ramda's lenses didn't
deal with non-existent focuses consistently:

```jsx
R.view(R.lensPath(['x', 'y']), {})
// undefined
R.view(R.compose(R.lensProp('x'), R.lensProp('y')), {})
// TypeError: Cannot read property 'y' of undefined
```

<small>(In Ramda version 0.25.0, roughly two years later, both of the above now
return `undefined`.)</small>

In addition to using lenses to [view](#l-get) and [set](#l-set), we also wanted
to have the ability to [insert](#l-appendto) and [remove](#l-remove).  In other
words, we wanted full [CRUD](https://en.wikipedia.org/wiki/CRUD) semantics,
because that is what our UIs also had to provide.

We also wanted lenses to have the ability to [search](#l-find) for things,
because we often had to deal with e.g. arrays containing objects with unique IDs
aka [association lists](#myth-partial-lenses-are-not-lawful).

All of these considerations give rise to a notion of
[partiality](#on-partiality), which is what the Partial Lenses library set out
to explore in early 2016.  Since then the library has grown to a comprehensive,
[high-performance](#benchmarks), [optics](#optics) library, supporting not only
partial [lenses](#lenses), but also [isomorphisms](#isomorphisms),
[traversals](#traversals), and also a notion of [transforms](#transforms).

### <a id="design-choices"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#design-choices) [Design choices](#design-choices)

There are several lens and optics libraries for JavaScript.  In this section I'd
like to very briefly elaborate on a number design choices made during the course
of developing this library.

#### <a id="partiality"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#partiality) [Partiality](#partiality)

Making all optics partial allows optics to not only view and update existing
elements, but also to insert, replace (as in replace with data of different
type) and remove elements and to do so in a seamless and efficient way.  In a
library based on total lenses, one needs to e.g. explicitly compose lenses with
prisms to deal with partiality.  This not only makes the optic compositions more
complex, but can also have a significant negative effect on performance.

The downside of implicit partiality is the potential to create incorrect optics
that signal errors later than when using total optics.

#### <a id="focus-on-json"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#focus-on-json) [Focus on JSON](#focus-on-json)

JSON is the data-interchange format of choice today.  By being able to
effectively and efficiently manipulate JSON data structures directly, one can
avoid using special internal representations of data and make things simpler
(e.g. no need to convert from JSON to efficient [immutable](#on-immutability)
collections and back).

#### <a id="use-of-undefined"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#use-of-undefined) [Use of `undefined`](#use-of-undefined)

`undefined` is arguably a natural choice in JavaScript to represent nothingness:

* `undefined` is the result of an attempt to access non-existent properties of
  objects.
* `undefined` is the result of functions that do not explicitly return another
  value.
* `undefined` is not a valid JSON value and does not get mixed up with valid
  JSON values.
* We can form a [monoid over JavaScript values by treating `undefined` as
  zero](#l-select).

Some libraries use `null`, but that is arguably a poor choice, because `null` is
a valid JSON value, which means that when accessing JSON data a result of `null`
is ambiguous.

One downside of using `undefined` is that it can sometimes be a valid value.
Fortunately this is fairly rarely the case so inventing a new value to represent
nothingness doesn't seem to add much.

Some libraries implement special `Maybe` types, but the benefits do not seem
worth the trouble nor the disadvantages in this context.  The main disadvantage
is that wrapping values with `Just` objects introduces a significant performance
overhead due to extra allocations, because operations with optics do not
otherwise necessarily require large numbers of allocations and [can be made
highly efficient](#benchmarks).  Also, a `Maybe`
[monad](https://github.com/rpominov/static-land/blob/master/docs/spec.md#monad)
is not necessary for optics.  A
[monoid](https://github.com/rpominov/static-land/blob/master/docs/spec.md#monoid)
is sufficient for optics based on
[applicatives](https://github.com/rpominov/static-land/blob/master/docs/spec.md#applicative),
because applicatives do not have a join operation and are not nested like
monads.

Not having an explicit `Just` object means that dealing with values such as
`Just Nothing` requires special consideration.

#### <a id="allowing-strings-and-integers-as-optics"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#allowing-strings-and-integers-as-optics) [Allowing strings and integers as optics](#allowing-strings-and-integers-as-optics)

Aside from the brevity, allowing [strings](#l-prop) and non-negative
[integers](#l-index) to be directly used as optics allows one to avoid
allocating closures for such optics.  This can provide significant time and,
more importantly, space savings in applications that create large numbers of
lenses to address elements in data structures.

The downside of allowing such special values as optics is that the internal
[implementation](IMPLEMENTATION.md) needs to be careful to deal with them at any
point a user given value needs to be interpreted as an optic.

#### <a id="treating-an-array-of-optics-as-a-composition-of-optics"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#treating-an-array-of-optics-as-a-composition-of-optics) [Treating an array of optics as a composition of optics](#treating-an-array-of-optics-as-a-composition-of-optics)

Aside from the brevity, treating [an array of optics as a
composition](#l-compose) allows the library to be optimized to deal with simple
paths highly efficiently and eliminate the need for separate primitives like
[`assocPath`](http://ramdajs.com/docs/#assocPath) and
[`dissocPath`](http://ramdajs.com/docs/#dissocPath) for performance reasons.
Client code can also manipulate such simple paths as data.

#### <a id="applicatives"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#applicatives) [Applicatives](#applicatives)

One interesting consequence of partiality is that it becomes possible to [invert
isomorphisms](#isomorphisms) without explicitly making it possible to extract
the forward and backward functions from an isomorphism.  A simple internal
[implementation](IMPLEMENTATION.md) based on functors and applicatives seems to
be expressive enough for a wide variety of operations.

#### <a id="combinators-for-creating-new-optics"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#combinators-for-creating-new-optics) [Combinators for creating new optics](#combinators-for-creating-new-optics)

By providing combinators for creating new [traversals](#l-branch),
[lenses](#l-lens) and [isomorphisms](#l-iso), client code need not depend on the
internal implementation of optics.  The current version of this library exposes
the internal implementation via [`L.toFunction`](#l-tofunction), but it would
not be unreasonable to not provide such an operation.  Only very few
applications need to know the internal representation of optics.

#### <a id="indexing"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#indexing) [Indexing](#indexing)

[Indexing](#on-indexing) in partial lenses is unnested, very simple and based on
the indices and keys of the underlying data structures.  When indexing was
added, it essentially introduced no performance degradation, but since then a
few operations have been added that do require extra allocations to support
indexing.  It is also possible to compose optics so as to create nested indices
or paths, but currently no combinator is directly provided for that.

#### <a id="static-land"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#static-land) [Static Land](#static-land)

The algebraic structures used in partial lenses follow the [Static
Land](https://github.com/rpominov/static-land) specification rather than the
[Fantasy Land](https://github.com/fantasyland/fantasy-land) specification.
Static Land does not require wrapping values in objects, which translates to a
significant performance advantage throughout the library, because fewer
allocations are required.

However, the [original
reason](https://github.com/rpominov/static-land/issues/36#issuecomment-285938602)
for switching to use Static Land was that correct
[implementation](IMPLEMENTATION.md) of [`traverse`](#l-traverse) requires the
ability to construct a value of a given applicative type without having any
instance of said applicative type.  This means that one has to explicitly pass
something, e.g. a function `of`, through optics to make that possible.  This
eliminates a major notational advantage of Fantasy Land.  In Static Land, which
can basically be seen as using the dictionary translation of type classes, one
already passes the algebra module to combinators.

#### <a id="performance"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#performance) [Performance](#performance)

Concern for performance has been a part of the work on partial lenses for some
time.  The basic principles can be summarized in order of importance:

* Minimize overheads
* Micro-optimize for common cases
* Avoid stack overflows
* Avoid [quadratic algorithms](http://accidentallyquadratic.tumblr.com/)
* Avoid optimizations that require large amounts of code
* Run [benchmarks](#benchmarks) continuously to detect performance regressions

### <a id="benchmarks"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#benchmarks) [Benchmarks](#benchmarks)

Here are a few benchmark results on partial lenses (as `L` version 13.1.1) with
Node.js v8.9.3 and some roughly equivalent operations using
[Ramda](http://ramdajs.com/) (as `R` version 0.25.0), [Ramda
Lens](https://github.com/ramda/ramda-lens) (as `P` version 0.1.2), [Flunc
Optics](https://github.com/flunc/optics) (as `O` version 0.0.2),
[Optika](https://github.com/phadej/optika) (as `K` version 0.0.2),
[lodash.get](https://www.npmjs.com/package/lodash.get) (as `_get` version
4.4.2), and [unchanged](https://github.com/planttheidea/unchanged) (as `U`
version 1.0.4).  As always with benchmarks, you should take these numbers with a
pinch of salt and preferably try and measure your actual use cases!

```jsx
  29,261,559/s     1.00   L.get(L_find_id_5000, ids)

   6,263,306/s     1.00   R.reduceRight(add, 0, xs100)
     702,855/s     8.91   L.foldr(add, 0, L.elems, xs100)
     223,260/s    28.05   xs100.reduceRight(add, 0)
       3,516/s  1781.23   O.Fold.foldrOf(O.Traversal.traversed, addC, 0, xs100)

      11,221/s     1.00   R.reduceRight(add, 0, xs100000)
         242/s    46.28   L.foldr(add, 0, L.elems, xs100000)
          61/s   183.44   xs100000.reduceRight(add, 0)
           0/s Infinity   O.Fold.foldrOf(O.Traversal.traversed, addC, 0, xs100000) -- STACK OVERFLOW

   5,768,818/s     1.00   {let s=0; for (let i=0; i<xs100.length; ++i) s+=xs100[i]; return s}
   3,966,543/s     1.45   L.sum(L.elems, xs100)
   1,761,821/s     3.27   K.traversed().sumOf(xs100)
   1,088,094/s     5.30   L.foldl(add, 0, L.elems, xs100)
   1,028,546/s     5.61   xs100.reduce(add, 0)
     559,221/s    10.32   L.concat(Sum, L.elems, xs100)
      43,679/s   132.07   R.reduce(add, 0, xs100)
      39,374/s   146.51   R.sum(xs100)
      19,643/s   293.68   P.sumOf(P.traversed, xs100)
       3,972/s  1452.40   O.Fold.sumOf(O.Traversal.traversed, xs100)
       2,502/s  2305.79   O.Fold.foldlOf(O.Traversal.traversed, addC, 0, xs100)

   1,191,166/s     1.00   L.maximum(L.elems, xs100)
       2,880/s   413.63   O.Fold.maximumOf(O.Traversal.traversed, xs100)

     637,283/s     1.00   {let s=0; for (let i=0; i<xsss100.length; ++i) for (let j=0, xss=xsss100[i]; j<xss.length; ++j) for (let k=0, xs=xss[j]; k<xs.length; ++k) s+=xs[i]; return s}
     322,280/s     1.98   K_t_t_t.sumOf(xsss100)
     266,188/s     2.39   L.foldl(add, 0, L_e_e_e, xsss100)
     251,599/s     2.53   L.foldl(add, 0, [L.elems, L.elems, L.elems], xsss100)
     182,952/s     3.48   K.traversed().traversed().traversed().sumOf(xsss100)
     164,781/s     3.87   L.sum(L_e_e_e, xsss100)
     159,784/s     3.99   L.sum([L.elems, L.elems, L.elems], xsss100)
     157,992/s     4.03   L.concat(Sum, [L.elems, L.elems, L.elems], xsss100)
       4,281/s   148.86   P.sumOf(R.compose(P.traversed, P.traversed, P.traversed), xsss100)
         804/s   792.17   O.Fold.sumOf(R.compose(O.Traversal.traversed, O.Traversal.traversed, O.Traversal.traversed), xsss100)

   2,493,770/s     1.00   K.traversed().arrayOf(xs100)
     973,139/s     2.56   L.collect(L.elems, xs100)
     784,513/s     3.18   xs100.map(I.id)
       3,034/s   821.88   O.Fold.toListOf(O.Traversal.traversed, xs100)

     250,527/s     1.00   L.collect(L_e_e_e, xsss100)
     237,554/s     1.05   L.collect([L.elems, L.elems, L.elems], xsss100)
      44,751/s     5.60   {let acc=[]; xsss100.forEach(x0 => {x0.forEach(x1 => {acc = acc.concat(x1)})}); return acc}
      38,308/s     6.54   K_t_t_t.arrayOf(xsss100)
      35,206/s     7.12   K.traversed().traversed().traversed().arrayOf(xsss100)
       9,223/s    27.16   R.chain(R.chain(R.identity), xsss100)
         735/s   341.03   O.Fold.toListOf(R.compose(O.Traversal.traversed, O.Traversal.traversed, O.Traversal.traversed), xsss100)

      61,367/s     1.00   L.collect(L.flatten, xsss100)
      21,566/s     2.85   R.flatten(xsss100)

  15,709,764/s     1.00   xs.map(inc)
  14,296,101/s     1.10   L.modify(L.elems, inc, xs)
   2,992,297/s     5.25   R.map(inc, xs)
   1,470,281/s    10.68   K.traversed().over(xs, inc)
     508,177/s    30.91   O.Setter.over(O.Traversal.traversed, inc, xs)
     323,509/s    48.56   P.over(P.traversed, inc, xs)

     531,273/s     1.00   L.modify(L.elems, inc, xs1000)
      91,098/s     5.83   xs1000.map(inc)
      85,445/s     6.22   R.map(inc, xs1000)
      84,705/s     6.27   K.traversed().over(xs1000, inc)
         379/s  1400.14   O.Setter.over(O.Traversal.traversed, inc, xs1000) -- QUADRATIC
         350/s  1518.84   P.over(P.traversed, inc, xs1000) -- QUADRATIC

     193,914/s     1.00   L.modify(L_e_e_e, inc, xsss100)
     178,651/s     1.09   L.modify([L.elems, L.elems, L.elems], inc, xsss100)
     100,368/s     1.93   K_t_t_t.over(xsss100, inc)
      88,725/s     2.19   K.traversed().traversed().traversed().over(xsss100, inc)
      86,297/s     2.25   xsss100.map(x0 => x0.map(x1 => x1.map(inc)))
      11,834/s    16.39   R.map(R.map(R.map(inc)), xsss100)
       3,583/s    54.12   O.Setter.over(R.compose(O.Traversal.traversed, O.Traversal.traversed, O.Traversal.traversed), inc, xsss100)
       2,859/s    67.82   P.over(R.compose(P.traversed, P.traversed, P.traversed), inc, xsss100)

  51,874,299/s     1.00   L.get(1, xs)
  35,680,586/s     1.45   _get(xs, 1)
  19,954,170/s     2.60   U.get(1, xs)
  13,182,372/s     3.94   R.nth(1, xs)
   1,956,697/s    26.51   R.view(l_1, xs)
   1,419,735/s    36.54   K.idx(1).get(xs)

 154,267,077/s     1.00   L_get_1(xs)
  18,509,602/s     8.33   L.get(1)(xs)
   5,174,261/s    29.81   R_nth_1(xs)
   3,140,154/s    49.13   R.nth(1)(xs)
   2,969,585/s    51.95   U_get_1(xs)
   2,415,058/s    63.88   U.get(1)(xs)

  31,500,628/s     1.00   L.set(1, 0, xs)
   9,391,877/s     3.35   xs.map((x, i) => i === 1 ? 0 : x)
   7,110,172/s     4.43   {let ys = xs.slice(); ys[1] = 0; return ys}
   5,074,836/s     6.21   U.set(1, 0, xs)
   3,072,405/s    10.25   R.update(1, 0, xs)
     947,676/s    33.24   K.idx(1).set(xs, 0)
     815,287/s    38.64   R.set(l_1, 0, xs)

  38,524,625/s     1.00   L.get('y', xyz)
  17,349,278/s     2.22   _get(xyz, 'y')
  16,429,516/s     2.34   U.get('y', xyz)
   9,193,603/s     4.19   R.prop('y', xyz)
   1,770,509/s    21.76   R.view(l_y, xyz)
   1,434,326/s    26.86   K.key('y').get(xyz)

  68,577,224/s     1.00   L_get_y(xyz)
  15,435,254/s     4.44   L.get('y')(xyz)
   4,702,316/s    14.58   R_prop_y(xyz)
   2,821,439/s    24.31   U_get_y(xyz)
   2,774,587/s    24.72   R.prop('y')(xyz)
   2,304,145/s    29.76   U.get('y')(xyz)

   7,450,898/s     1.00   R.assoc('y', 0, xyz)
   7,322,941/s     1.02   L.set('y', 0, xyz)
   1,895,793/s     3.93   U.set('y', 0, xyz)
     995,035/s     7.49   K.key('y').set(xyz, 0)
     875,025/s     8.52   R.set(l_y, 0, xyz)

  12,154,904/s     1.00   _get(axay, [0, 'x', 0, 'y'])
  11,297,478/s     1.08   L.get([0, 'x', 0, 'y'], axay)
  10,140,829/s     1.20   R.path([0, 'x', 0, 'y'], axay)
   4,275,282/s     2.84   U.get([0, 'x', 0, 'y'], axay)
   1,706,187/s     7.12   R.view(l_0x0y, axay)
     767,316/s    15.84   K_0_x_0_y.get(axay)
     492,426/s    24.68   R.view(l_0_x_0_y, axay)

   3,635,072/s     1.00   L.set([0, 'x', 0, 'y'], 0, axay)
     931,074/s     3.90   U.set([0, 'x', 0, 'y'], 0, axay)
     741,621/s     4.90   R.assocPath([0, 'x', 0, 'y'], 0, axay)
     573,987/s     6.33   K_0_x_0_y.set(axay, 0)
     398,742/s     9.12   R.set(l_0x0y, 0, axay)
     266,083/s    13.66   R.set(l_0_x_0_y, 0, axay)

   3,571,529/s     1.00   L.modify([0, 'x', 0, 'y'], inc, axay)
     578,551/s     6.17   K_0_x_0_y.over(axay, inc)
     453,113/s     7.88   R.over(l_0x0y, inc, axay)
     285,952/s    12.49   R.over(l_0_x_0_y, inc, axay)

  31,022,872/s     1.00   L.remove(1, xs)
   3,430,687/s     9.04   R.remove(1, 1, xs)
   3,029,069/s    10.24   U.remove(1, xs)

   7,992,802/s     1.00   L.remove('y', xyz)
   2,435,349/s     3.28   R.dissoc('y', xyz)
   1,196,219/s     6.68   U.remove('y', xyz)

  19,206,167/s     1.00   _get(xyzn, ['x', 'y', 'z'])
  12,018,401/s     1.60   L.get(['x', 'y', 'z'], xyzn)
  10,435,414/s     1.84   R.path(['x', 'y', 'z'], xyzn)
   4,598,735/s     4.18   U.get(['x', 'y', 'z'], xyzn)
   1,881,768/s    10.21   R.view(l_xyz, xyzn)
     848,943/s    22.62   K_xyz.get(xyzn)
     683,515/s    28.10   R.view(l_x_y_z, xyzn)
     154,207/s   124.55   O.Getter.view(o_x_y_z, xyzn)

   3,864,421/s     1.00   L.set(['x', 'y', 'z'], 0, xyzn)
   1,068,844/s     3.62   U.set(['x', 'y', 'z'], 0, xyzn)
   1,066,246/s     3.62   R.assocPath(['x', 'y', 'z'], 0, xyzn)
     672,562/s     5.75   K_xyz.set(xyzn, 0)
     499,486/s     7.74   R.set(l_xyz, 0, xyzn)
     398,131/s     9.71   R.set(l_x_y_z, 0, xyzn)
     200,548/s    19.27   O.Setter.set(o_x_y_z, 0, xyzn)

   1,280,471/s     1.00   R.find(x => x > 3, xs100)
   1,066,129/s     1.20   L.getAs(x => x > 3 ? x : undefined, L.elems, xs100)
       2,529/s   506.25   O.Fold.findOf(O.Traversal.traversed, x => x > 3, xs100)

   9,325,674/s     1.00   L.getAs(x => x < 3 ? x : undefined, L.elems, xs100)
   4,411,876/s     2.11   R.find(x => x < 3, xs100)
       2,473/s  3770.86   O.Fold.findOf(O.Traversal.traversed, x => x < 3, xs100) -- NO SHORTCUT EVALUATION

      10,090/s     1.00   L.sum([L.elems, x => x+1, x => x*2, L.when(x => x%2 === 0)], xs1000)
       3,838/s     2.63   R.transduce(R.compose(R.map(x => x+1), R.map(x => x*2), R.filter(x => x%2 === 0)), (x, y) => x+y, 0, xs1000)
       3,166/s     3.19   R.pipe(R.map(x => x+1), R.map(x => x*2), R.filter(x => x%2 === 0), R.sum)(xs1000)

     216,761/s     1.00   R.forEach(I.id, xs1000)
     190,861/s     1.14   L.forEach(I.id, L.elems, xs1000)
     115,582/s     1.88   xs1000.forEach(I.id)

     252,911/s     1.00   L.forEach(I.id, L_e_e_e, xsss100)
     237,600/s     1.06   L.forEach(I.id, [L.elems, L.elems, L.elems], xsss100)
      99,597/s     2.54   xsss100.forEach(xss100 => xss100.forEach(xs100 => xs100.forEach(I.id)))
      29,031/s     8.71   R.forEach(R.forEach(R.forEach(I.id)), xsss100)

       5,717/s     1.00   L.minimum(L.elems, xs10000)
       5,670/s     1.01   L.minimumBy(x => -x, L.elems, xs10000)
       3,464/s     1.65   R.reduceRight(R.min, -Infinity, xs10000)
       2,330/s     2.45   R.reduce(R.min, -Infinity, xs10000)
       2,319/s     2.47   R.reduceRight(R.minBy(x => -x), Infinity, xs10000)
       1,761/s     3.25   R.reduce(R.minBy(x => -x), Infinity, xs10000)

     149,352/s     1.00   L.mean(L.elems, xs1000)
       3,882/s    38.48   R.mean(xs1000)

   5,768,842/s     1.00   L.remove(50, xs100)
   1,766,663/s     3.27   R.remove(50, 1, xs100)

   5,097,235/s     1.00   L.set(50, 2, xs100)
   1,468,277/s     3.47   R.update(50, 2, xs100)
     761,548/s     6.69   K.idx(50).set(xs100, 2)
     583,231/s     8.74   R.set(l_50, 2, xs100)

      75,197/s     1.00   L.remove(5000, xs10000)
      38,157/s     1.97   R.remove(5000, 1, xs10000)

      62,694/s     1.00   L.set(5000, 2, xs10000)
      25,116/s     2.50   R.update(5000, 2, xs10000)

   6,126,231/s     1.00   L.modify(L.values, inc, xyz)

     382,949/s     1.00   L.modify(L.values, inc, xs10o)
      46,114/s     8.30   L.modify(L.values, inc, xs100o)
       4,858/s    78.83   L.modify(L.values, inc, xs1000o)
         464/s   825.35   L.modify(L.values, inc, xs10000o)

     645,308/s     1.00   L.modify(flatten, inc, nested)
     373,998/s     1.73   L.modify(everywhere, incNum, nested)

     937,120/s     1.00   L.modify(flatten, inc, xs10)
     804,249/s     1.17   L.modify(everywhere, incNum, xs10)

     156,861/s     1.00   L.modify(flatten, inc, xs100)
     151,030/s     1.04   L.modify(everywhere, incNum, xs100)

      17,261/s     1.00   L.modify(flatten, inc, xs1000)
      16,558/s     1.04   L.modify(everywhere, incNum, xs1000)

   1,618,143/s     1.00   L.set(xyzs, 1, undefined)
   1,179,525/s     1.37   L.set(L.seq('x', 'y', 'z'), 1, undefined)

     284,950/s     1.00   L.modify(values, x => x + x, bst)

     443,036/s     1.00   L.collect(values, bst)

      97,632/s     1.00   fromPairs(bstPairs)

      56,276/s     1.00   L.get(L.slice(100, -100), xs10000)
      40,472/s     1.39   R.slice(100, -100, xs10000)

   5,911,415/s     1.00   L.get(L.slice(1, -1), xs)
   5,544,989/s     1.07   R.slice(1, -1, xs)

   3,188,865/s     1.00   L.get(L.slice(10, -10), xs100)
   2,672,422/s     1.19   R.slice(10, -10, xs100)

   9,386,623/s     1.00   L.get(L.defaults(1), 2)
   8,851,162/s     1.06   L.get(L.defaults(1), undefined)

  30,073,738/s     1.00   L.get(defaults1, undefined)
  28,660,806/s     1.05   L.get(defaults1, 2)

  10,012,353/s     1.00   L.get(L.define(1), 2)
   9,817,035/s     1.02   L.get(L.define(1), undefined)

  46,427,067/s     1.00   L.get(define1, undefined)
  45,966,952/s     1.01   L.get(define1, 2)

  15,312,111/s     1.00   L.get(L.valueOr(1), null)
  15,106,079/s     1.01   L.get(L.valueOr(1), undefined)
  14,284,098/s     1.07   L.get(L.valueOr(1), 2)

  46,380,800/s     1.00   L.get(valueOr1, 2)
  46,052,173/s     1.01   L.get(valueOr1, undefined)
  45,749,521/s     1.01   L.get(valueOr1, null)

      49,394/s     1.00   L.concatAs(toList, List, L.elems, xs100)

      49,965/s     1.00   L.modify(L.flatten, inc, xsss100)

   7,833,540/s     1.00   L.getAs(x => x > 3 ? x : undefined, L.elems, pi)
   4,448,086/s     1.76   R.find(x => x > 3, pi)
      32,770/s   239.05   O.Fold.findOf(O.Traversal.traversed, x => x > 3, pi)

   6,140,005/s     1.00   L.get(L.find(x => x !== 1, {hint: 0}), xs)
   5,933,954/s     1.03   L.get(L.find(x => x !== 1), xs)
   4,608,258/s     1.33   R.find(x => x !== 1, xs)

   1,320,062/s     1.00   R.find(x => x !== 1, xs100)
     902,106/s     1.46   L.get(L.find(x => x !== 1), xs100)
     900,911/s     1.47   L.get(L.find(x => x !== 1, {hint: 0}), xs100)

     186,687/s     1.00   R.find(x => x !== 1, xs1000)
     109,054/s     1.71   L.get(L.find(x => x !== 1, {hint: 0}), xs1000)
     108,286/s     1.72   L.get(L.find(x => x !== 1), xs1000)

   4,331,759/s     1.00   L.get(valueOr0x0y, axay)
   4,233,734/s     1.02   L.get(define0x0y, axay)
   3,894,676/s     1.11   L.get(defaults0x0y, axay)

     865,866/s     1.00   L.set(valueOr0x0y, 1, undefined)
     856,274/s     1.01   L.set(define0x0y, 1, undefined)
     770,947/s     1.12   L.set(defaults0x0y, 1, undefined)

   1,150,943/s     1.00   L.set(L.findWith('x'), 2, axay)

   6,793,006/s     1.00   L.get(aEb, {x: 1})
   6,290,285/s     1.08   L.get(abS, {x: 1})
   4,201,828/s     1.62   L.get(abM, {x: 1})
   3,072,564/s     2.21   L.get(L.orElse('a', 'b'), {x: 1})
   2,295,497/s     2.96   L.get(L.choices('a', 'b'), {x: 1})

   4,075,886/s     1.00   L.get(abcS, {x: 1})
   4,019,108/s     1.01   L.get(aEbEc, {x: 1})
   3,267,810/s     1.25   L.get(abcM, {x: 1})
   1,401,479/s     2.91   L.get(L.choices('a', 'b', 'c'), {x: 1})
   1,122,000/s     3.63   L.get(L.choice('a', 'b', 'c'), {x: 1})

   1,309,555/s     1.00   L.set(L.props('x', 'y'), {x: 2, y: 3}, {x: 1, y: 2, z: 4})
```

Various operations on *partial lenses have been optimized for common cases*, but
there is definitely a lot of room for improvement.  The goal is to make partial
lenses fast enough that performance isn't the reason why you might not want to
use them.

See [bench.js](./bench/bench.js) for details.

### <a id="lenses-all-the-way"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#lenses-all-the-way) [Lenses all the way](#lenses-all-the-way)

As said in the first sentence of this document, lenses are convenient for
performing updates on individual elements of [immutable](#on-immutability) data
structures.  Having abilities such as [nesting](#l-compose),
[adapting](#l-choose), [recursing](#l-lazy) and [restructuring](#l-pick) using
lenses makes the notion of an individual element quite flexible and, even
further, [traversals](#traversals) make it possible to [selectively](#l-when)
target zero or more elements of [non-trivial](#l-branch) data structures in a
single operation.  It can be tempting to try to do everything with lenses, but
that will likely only lead to misery.  It is important to understand that lenses
are just one of many functional abstractions for working with data structures
and sometimes other approaches can lead to simpler or easier solutions.
[Zippers](https://github.com/polytypic/fastener), for example, are, in some
ways, less principled and can implement queries and transforms that are outside
the scope of lenses and traversals.

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
  just: 'some',
  extra: 'crap',
  that: [
    'we',
    {
      want: 'to',
      filter: ['out'],
      including: {the: 'following', extra: true, fields: 1}
    }
  ]
}
```

We can now remove the `extra` `fields` like this:

``` js
transform(
  R.ifElse(
    R.allPass([R.is(Object), R.complement(R.is(Array))]),
    L.remove(L.props('extra', 'fields')),
    R.identity
  ),
  sampleBloated
)
// { just: 'some',
//   that: [ 'we', { want: 'to',
//                   filter: ['out'],
//                   including: {the: 'following'} } ] }
```

### <a id="related-work"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#related-work) [Related work](#related-work)

Lenses are an old concept and there are dozens of academic papers on lenses and
dozens of lens libraries for various languages.  Below are just a few
links&mdash;feel free to suggest more!

#### <a id="papers-and-other-introductory-material"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#papers-and-other-introductory-material) [Papers and other introductory material](#papers-and-other-introductory-material)

* [A Little Lens Starter Tutorial](https://www.schoolofhaskell.com/school/to-infinity-and-beyond/pick-of-the-week/a-little-lens-starter-tutorial)
* [A clear picture of lens laws](http://sebfisch.github.io/research/pub/Fischer+MPC15.pdf)
* [An Introduction Into Lenses In JavaScript](https://medium.com/javascript-inside/an-introduction-into-lenses-in-javascript-e494948d1ea5#.777juzfcw)
* [Functional Lenses, How Do They Work](https://medium.com/@dtipson/functional-lenses-d1aba9e52254#.qja55h7uh)
* [Lenses with Immutable.js](https://medium.com/@drboolean/lenses-with-immutable-js-9bda85674780#.4irzg5u1q)
* [Polymorphic Update with van Laarhoven Lenses](http://r6.ca/blog/20120623T104901Z.html)
* [Profunctor Optics: Modular Data Accessors](https://arxiv.org/abs/1703.10857)

#### <a id="javascript-typescript-flow-libraries"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#javascript-typescript-flow-libraries) [JavaScript / TypeScript / Flow libraries](#javascript-typescript-flow-libraries)

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

#### <a id="libraries-for-other-languages"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#libraries-for-other-languages) [Libraries for other languages](#libraries-for-other-languages)

* [ekmett/lens](https://github.com/ekmett/lens)
* [julien-truffaut/Monocle](https://github.com/julien-truffaut/Monocle)
* [purescript-contrib/purescript-profunctor-lenses](https://github.com/purescript-contrib/purescript-profunctor-lenses)
* [xyncro/aether](https://github.com/xyncro/aether)

## <a id="contributing"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#contributing) [Contributing](#contributing)

Contributions in the form of pull requests are welcome!

Before starting work on a major PR, it is a good idea to open an issue or maybe
ask on [gitter](https://gitter.im/calmm-js/chat) whether the contribution sounds
like something that should be added to this library.

If you allow us to make changes to your PR, it can make the process smoother:
[Allowing changes to a pull request branch created from a
fork](https://help.github.com/articles/allowing-changes-to-a-pull-request-branch-created-from-a-fork/).
We also welcome starting the PR sooner, before it is ready to be merged, rather
than later so we know what is going on and can help.

Aside from the code changes, a PR should also include tests, and documentation.

When implementing partial optics it is important to consider the behavior of the
optics when the focus doesn't match the expectation of the optic and also
whether the optic should propagate removal.  Such behavior should also be
tested.

It is best not to commit changes to generated files in PRs.  Some of the files
in `docs`, and `dist` directories are generated.

### <a id="building"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#building) [Building](#building)

The `prepare` script is the usual way to build after changes:

```bash
npm run prepare
```

It builds the `dist` and `docs` files and runs the lint rules and tests.  You
can also run the scripts for those subtasks separately.

There is also a watch mode for development:

```bash
npm run watch
```

It starts watching the source files and runs dist and docs builds and tests
after changes.

### <a id="testing"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#testing) [Testing](#testing)

The [tests](./test/tests.js) in this library are written in a slightly atypical
manner using thunks that are also used as the test descriptions.  This way one
doesn't need to invent names or write prose for tests.

There is also a special test that checks the arity of the exports.  You'll
notice it immediately if you add an export.

The [`test/types.js`](./test/types.js) file contains contract or type predicates
for the library primitives.  Those are also used when running tests to check
that the implementation matches the contracts.  When you implement a new
combinator, you will also need to add a contract for the combinator.

When testing a partial optics, you should generally test both read and, usually
more importantly, write behaviour including attempts to read `undefined` or
unexpected data (both of these should be handled as `undefined`) and writing
`undefined`.

### <a id="documentation"></a> [≡](#contents) [▶](https://calmm-js.github.io/partial.lenses/index.html#documentation) [Documentation](#documentation)

The `docs` folder contains the generated documentation.  You can open the file
locally:

```bash
open docs/index.html
```

To actually build the docs (translate the markdown to html), you can run

```bash
npm run docs
```

or you can use the watch

```bash
npm run watch
```

which builds the docs if you save a `.md` file.  The watch also runs
[LiveReload](http://livereload.com/) so if you have the plugin, your browser
will refresh automatically after changes.
