# Partial Lenses Exercises

## Lenses

### Lens

* Write getter and setter to access `part` field.
* Then try the [`L.prop`](index.html#L-prop) shorthand.

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
```

### Nesting

* Create a lens to access `inside.part`.
  * <span class="hint">Use the [`L.compose`](index.html#L-compose) shorthand
    notation.</span>
* Make it so that when `part` is removed then so is the whole object.
  * <span class="hint">Use [`L.removable`](index.html#L-removable).</span>

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
  * <span class="hint">Compose a lens that uses [`L.find`](index.html#L-find) to
    search for an object with the given key.</span>
* Support removal.
  * <span class="hint">Use [`L.removable`](index.html#L-valueOr).</span>
* Make it so that the array does not become `undefined` once empty.
  * <span class="hint">Use [`L.define`](index.html#L-define).</span>
* Support insertion and make it so that keys remain ordered.
  * <span class="hint">Use [`L.valueOr`](index.html#L-valueOr) to add the `key`
    property in case there is no matching object.</span>
  * <span class="hint">Use [`L.rewrite`](index.html#L-rewrite) to sort by
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

### Adapting

* Write a lens to access the end of a range object.
  * <span class="hint">Using [`L.lens`](index.html#L-lens), write a custom lens
    to access the end of `{start, num}` pair.</span>
  * <span class="hint">Use [`L.iftes`](index.html#L-lens) to select between
    `'end'` and the custom lens.</span>

```js
const end = '???'

test('get_num', L.get(end, {start: 1, num: 2}), 3)
test('get_end', L.get(end, {start: 1, end: 3} ), 3)

test('set_num', L.set(end, 4, {start: 1, num: 2}), {start: 1, num: 3})
test('set_end', L.set(end, 4, {start: 1, end: 3}), {start: 1, end: 4})
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
