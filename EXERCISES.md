# Partial Lenses Exercises

This page contains exercises for the [Partial Lenses](/#) library.  Each
exercise asks you to implement an [optic](/#optics) or [transform](/#transforms)
using Partial lenses.  An acceptable solution will then make all the `test(
... )` cases to log `Ok`.  In case a `test( ... )` doesn't pass it logs `Error`
and the (wrong) result.

Most of the exercises include hints that you can reveal by placing the pointer
over them.  The hints are written with a particular solution in mind, but it is
often possible to solve a particular exercise in more than one way.


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
* Make it so that the array does not become `undefined` once empty.
  * <span class="hint">Use [`L.define`](/#L-define).</span>
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
  * <span class="hint">Use [`L.iftes`](/#L-lens) or [`L.choices`](/#L-choices)
    to select between `'end'` and the custom lens.</span>
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

## Isomorphisms

<!--
* `L.indexed` + sorting + filtering
* `L.keyed`
-->

## Transforms
