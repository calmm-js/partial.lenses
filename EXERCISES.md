# [▶](https://calmm-js.github.io/partial.lenses/exercises.html#) Partial Lenses Exercises &middot; [![Gitter](https://img.shields.io/gitter/room/calmm-js/chat.js.svg)](https://gitter.im/calmm-js/chat) [![GitHub stars](https://img.shields.io/github/stars/calmm-js/partial.lenses.svg?style=social)](https://github.com/calmm-js/partial.lenses) [![npm](https://img.shields.io/npm/dm/partial.lenses.svg)](https://www.npmjs.com/package/partial.lenses)

This page contains exercises for the [Partial Lenses](/#) library.  Each
exercise asks you to implement an [optic](/#optics) or [transform](/#transforms)
using Partial lenses.  An acceptable solution will then make all the `test(
... )` cases to log `Ok`.  In case a `test( ... )` doesn't pass it logs `Error`
and the (wrong) result.

Most of the exercises include hints that you can reveal by placing the pointer
over them.  The hints are written with a particular solution in mind, but it is
often possible to solve a particular exercise in more than one way.

Suggestions for additional exercises are welcome!

## Contents

* [Lenses](#lenses)
  * [Getter and Setter](#getter-and-setter)
  * [Nested objects](#nested-objects)
  * [Association list](#association-list)
  * [Dimorphic ranges](#dimorphic-ranges)
* [Traversals](#traversals)
  * [Xces](#xces)
  * [Nested properties](#nested-properties)
* [Isomorphisms](#isomorphisms)
  * [Inverse puzzle](#inverse-puzzle)
* [Transforms](#transforms)
  * [Increment and Decrement](#increment-and-decrement)

## Lenses

### Getter and Setter

* Complete the getter and setter for `L.lens` to access the `part` field of an
  object.
  * <span class="hint">Use `Object.assign` in the setter.</span>
* Then replace the whole thing using the [`L.prop`](/#L-prop) shorthand, which
  also supports [removal](/#L-remove).
  * <span class="hint">`const lens = 'part'`</span>

```js
const lens = L.lens(
  /* getter: */whole => '???',
  /* setter: */(part, whole) => '???'
)

const whole = {
  part: 101
}

test('get',    L.get(lens,           whole), 101)
test('set',    L.set(lens,       42, whole), {part: 42})
test('mod', L.modify(lens, R.negate, whole), {part: -101})

test('no-mutate', whole, {part: 101})
```

### Nested objects

* Create a lens to access `inside.part`.
  * <span class="hint">Use the [`L.compose`](/#L-compose) shorthand
    notation.</span>
* Make it so that when `part` is removed then so is the whole object.
  * <span class="hint">Use [`L.removable`](/#L-removable).</span>

```js
const lens = '???'

const nested = {
  inside: {
    part: 101,
    more: 'stuff'
  }
}

test('get',    L.get(lens,           nested), 101)
test('set',    L.set(lens,       42, nested), {inside: {part: 42, more: 'stuff'}})
test('mod', L.modify(lens, R.negate, nested), {inside: {part: -101, more: 'stuff'}})
test('rem', L.remove(lens,           nested), undefined)
```

### Association list

* Write a function `valOf` to return a lens to access value with given key.
  * <span class="hint">Compose a lens that uses [`L.find`](/#L-find) to
    search for an object with the given key.</span>
* Support removal.
  * <span class="hint">Use [`L.removable`](/#L-valueOr).</span>
* Support insertion and make it so that keys remain ordered.
  * <span class="hint">Use [`L.valueOr`](/#L-valueOr) to add the `key`
    property in case there is no matching object.</span>
  * <span class="hint">Use [`L.rewrite`](/#L-rewrite) to sort by
    `key`.</span>

```js
const valOf = key => '???'

const data = [{key: 'en', val: 'Title'},
              {key: 'sv', val: 'Rubrik'}]

test('get',    L.get(valOf('en'),              data), 'Title')
test('set',    L.set(valOf('en'), 'The title', data), [{key: 'en', val: 'The title'}, {key: 'sv', val: 'Rubrik'}])
test('rem', L.remove(valOf('en'),              data), [{key: 'sv', val: 'Rubrik'}])

test('emp', L.remove(valOf('sv'), L.remove(valOf('en'), data)), [])

test('ins',    L.set(valOf('fi'), 'Otsikko',   data), [{key: 'en', val: 'Title'}, {key: 'fi', val: 'Otsikko'}, {key: 'sv', val: 'Rubrik'}])
```

### Dimorphic ranges

* Implement the `end` lens to access the end of range objects that may take one
  of two different forms.
  * <span class="hint">Using [`L.lens`](/#L-lens), write a custom lens
    to access the end of `{start, num}` pair.</span>
  * <span class="hint">Use [`L.ifElse`](/#L-ifElse) or
    [`L.choices`](/#L-choices) to select between `'end'` and the custom
    lens.</span>
* Enhance the lens to allow additional fields beyond `start`, `end` / `num` in a
  range object.
  * <span class="hint">Use [`L.props`](/#L-props) to limit the fields that the
    lens deals with.</span>

```js
const end = '???'

test('get_num', L.get(end, {start: 1, num: 2}), 3)
test('get_end', L.get(end, {start: 1, end: 3}), 3)

test('set_num', L.set(end, 4, {start: 1, num: 2}), {start: 1, num: 3})
test('set_end', L.set(end, 4, {start: 1, end: 3}), {start: 1, end: 4})

test('set_ext', L.set(end, 4, {start: 1, num: 2, xtra: 'field'}), {start: 1, num: 3, xtra: 'field'})
```

<!--
* `L.lazy`
* `L.pick`
* `L.slice`
* `L.matches`
-->

## Traversals

### Xces

* Define a traversal that targets the `x` properties of the coordinate pairs.
  * <span class="hint">Compose [`L.elems`](/#L-elems) and
    [`'x'`](/#L-prop).</span>
* Support removal so that the whole coordinate pair is removed.
  * <span class="hint">Use [`L.removable`](/#L-removable).</span>

```js
const xs = '???'

const coords = [
  {x: 3, y: 9},
  {x: 1, y: 2},
  {x: 4, y: 6},
  {x: 1, y: 5},
  {x: 5, y: 3}
]

test('max', L.maximum(xs, coords), 5)

test('neg', L.modify([xs, L.when(x => 3 < x)], R.negate, coords), [
  {x:  3, y: 9},
  {x:  1, y: 2},
  {x: -4, y: 6},
  {x:  1, y: 5},
  {x: -5, y: 3}
])

test('rem', L.remove([xs, L.when(x => x < 3)], coords), [
  {x: 3, y: 9},
  {x: 4, y: 6},
  {x: 5, y: 3}
])

test('emp', L.remove([xs, L.when(x => 0 < x)], coords), [])
```

### Nested properties

* Implement a `nonObject` traversal that targets all non-object or primitive
  properties of arbitrarily nested objects.
  * <span class="hint">Use [`L.ifElse`](/#L-ifElse) to select whether to treat
    target as an object or primitive.</span>
  * <span class="hint">Use [`L.values`](/#L-values) to traverse through all
    properties of an object.</span>
  * <span class="hint">You will need a recursive lens.</span>
  * <span class="hint">Use [`L.lazy`](/#L-lazy) to allow recursion.</span>

```js
const nonObjects = '???'

test('max', L.maximum(nonObjects, {a: 1, b: {c: 2, d: {e: 5}}, e: 3}), 5)
test('mod', L.modify(nonObjects, R.of, {x: {y: {z: {w: 1}}}}), {x: {y: {z: {w: [1]}}}})
```

## Isomorphisms

### Inverse puzzle

* Solve for `iso`.
  * <span class="hint">Use [`L.complement`](/#L-complement) on the booleans.</span>
  * <span class="hint">Lift with [`L.array`](/#L-array) to complement them.</span>
  * <span class="hint">Use [`L.pick`](/#L-pick) to convert object shapes.</span>
  * <span class="hint">Use [`L.json`](/#L-json) to convert between JSON and objects.</span>

```js
const iso = '???'

test('inv', L.getInverse(L.inverse(iso), '{"foo":[true,false,true]}'), '{"bar":[false,true,false]}')
test('get', L.get(L.inverse(iso), '{"bar":[true]}'), '{"foo":[false]}')
```

## Transforms

### Increment and Decrement

* Implement transform `trn` that increments primitives under `xs` and decrements
  under `ys`.
  * <span class="hint">Use [`L.modifyOp`](/#L-modifyOp) on the leafs.</span>
  * <span class="hint">Use [`L.branch`](/#L-branch) to do different things to
    `xs` and `ys`.</span>
  * <span class="hint">Use [`L.elems`](/#L-elems) and [`L.values`](/#L-values)
    to get to the leafs.</span>

```js
const trn = '???'

test('sol', L.transform(trn, {xs: {a:3, b:1, c:4}, ys: [1, 5, 9]}),
     /**/                    {xs: {a:4, b:2, c:5}, ys: [0, 4, 8]})
```
