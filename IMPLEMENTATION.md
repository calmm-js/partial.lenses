# [▶](https://calmm-js.github.io/partial.lenses/implementation.html#) Partial Lenses Implementation &middot; [![Gitter](https://img.shields.io/gitter/room/calmm-js/chat.js.svg)](https://gitter.im/calmm-js/chat) [![GitHub stars](https://img.shields.io/github/stars/calmm-js/partial.lenses.svg?style=social)](https://github.com/calmm-js/partial.lenses) [![npm](https://img.shields.io/npm/dm/partial.lenses.svg)](https://www.npmjs.com/package/partial.lenses)

This document describes a simplified implementation of lenses and traversals
using a similar approach as [Partial Lenses](README.md).  The implementation of
Partial Lenses is far from simplified.  It lifts strings, numbers, and arrays to
optics for notational convenience, it has been manually tweaked for size,
optimized for performance, and it also tries to handle a lot of corner cases
induced by JavaScript.  All of this makes the implementation difficult to
understand on its own.  The intention behind this document is to describe a
simple implementation based on which it should be easier to look at the Partial
Lenses source code and understand what is going on.

There are many approaches to optics.  Partial Lenses is based on the ideas
described by Twan van Laarhoven in [CPS based functional
references](https://www.twanvl.nl/blog/haskell/cps-functional-references) and
further by Russell O'Connor in [Polymorphic Update with van Laarhoven
Lenses](http://r6.ca/blog/20120623T104901Z.html).

One way to think of lenses and traversals is as being an application of a single
generalized `traverse` function.  The
[`traverse`](http://hackage.haskell.org/package/base-4.10.1.0/docs/Data-Traversable.html#v:traverse)
function of the `Traversable` constructor class

```haskell
traverse :: (Traversable t, Applicative f) => (x -> f y) -> t x -> f (t y)
```

is a kind of mapping function.  Indeed, if you specialize the `t` type
constructor to list, `[]`, and `f` to identity, you get list map:

```haskell
traverse :: {-  t = []  and  f = identity  -} (x ->   y) -> [x] ->    [y]
```

`traverse` takes some kind of traversable data structure of type `t x`
containing values type `x`.  It maps those values to operations of type `f y` in
some [applicative
functor](https://en.wikibooks.org/wiki/Haskell/Applicative_functors) using the
given mapping function of type `x -> f y`.  Finally it returns an operation of
type `f (t y)` that constructs a new data structure of type `t y`.

The optical version of `traverse` replaces the second class `Traversable`
constructor class with a first class traversal function

```haskell
type Traversal s t x y = forall f. Applicative f => (x -> f y) -> s -> f t
```

and `traverse` using an optic merely calls the given traversal function

```haskell
traverse :: Applicative f => (x -> f y) -> Traversal s t x y -> s -> f t
traverse x2yF traversal = traversal x2yF
```

A traversal function of type `Traversal s t x y` is simply a function that knows
how to locate elements of type `x` within a data structure of type `s` and then
knows how to build a new data structure of type `t` where values of type `x`
have been replaced with values of type `y`.  In other words, the traversal
function knows how to both take apart a data structure in a particular way to
extract some values out of it and also how to put the data structure back
together substituting some new values for the extracted values.  Of course, it
is often the case that the type `y` is the same type `x` and type `t` is the
same as `s`.

We can translate the above `traverse` function to JavaScript in [Static
Land](https://github.com/rpominov/static-land/blob/master/docs/spec.md) style by
passing the method dictionary corresponding to the `Applicative` constraint as
an explicit argument `F`:

```js
const traverse = F => x2yF => traversal => traversal(F)(x2yF)
```

Innocent as it may seem, *every* operation in Partial Lenses is basically an
application of a traversal function like that.  The Partial Lenses version of
[`traverse`](README.md#L-traverse) is only slightly different due to features
such as currying, built-in indexing, and the lifting of strings, numbers, and
arrays to optics.

Here is an example of an `elems` traversal over the elements of an array:

```js
const elems = F => x2yF => xs => xs.reduce(
  (ysF, x) => F.ap(F.map(ys => y => [...ys, y], ysF), x2yF(x)),
  F.of([])
)
```

Above, `F` is a Static Land [applicative
functor](https://github.com/rpominov/static-land/blob/master/docs/spec.md#applicative),
`x2yF` is the function mapping array elements to applicative operations, and
`xs` is an array.  `elems` maps each element of the array `xs` to an applicative
operation using the mapping function `x2yF` and then combines those operations
using the applicative combinators `F.of`, `F.ap` and `F.map` into a computation
that builds an array of the results.

To actually use `elems` with `traverse` we need an applicative functor.  Perhaps
the most straightforward example is using the identity applicative:

```js
const Identity = {map: (x2y, x) => x2y(x), ap: (x2y, x) => x2y(x), of: x => x}
```

The identity applicative performs no interesting computation by itself.  Any
value is taken as such by `of` and both `map` and `ap` simply apply their first
argument to their second argument.

By supplying the `Identity` applicative to `traverse` we get a mapping function
over a given traversal:

```js
const map = traverse(Identity)
```

In Partial Lenses the above function is called [`modify`](README.md#L-modify)
and it takes its arguments in a different order, but otherwise it is the same.

Using `map` and `elems` we can now map over an array of elements:

```js
map(x => x + 1)(elems)([3, 1, 4])
// [4, 2, 5]
```

At this point we basically have a horribly complex version of the map function
for arrays.  Notice, however, that `map` takes the optic, `elems` in the above
case, as an argument.  We can compose optics and get different behavior.

The following `o` function composes two optics `outer` and `inner`:

```js
const o = (outer, inner) => F => x2yF => outer(F)(inner(F)(x2yF))
```

If you look closely, you'll notice that the above function really is just a
variation of ordinary function composition.  Consider what we get if we drop the
`F` argument:

```jsx
const o = (outer, inner) =>      x2yF => outer   (inner   (x2yF))
```

That is exactly the same as ordinary single argument function composition.

We can also define an identity optic function:

```js
const identity = F => x2yF => x => x2yF(x)
```

And a function to compose any number of optics:

```js
const compose = optics => optics.reduce(o, identity)
```

Using `compose` we can now conveniently map over nested arrays:

```js
map(x => x + 1)(compose([elems, elems, elems]))([[[1]], [[2, 3], [4]]])
// [[[2]], [[3, 4], [5]]]
```

Let's then divert our attention to lenses for a moment.  One could say that
lenses are just traversals that focus on exactly one element.  Let's build
lenses for accessing array elements and object properties.  We can do so in a
generalized manner by introducing `Ix` modules with `get` and `set` functions
for both arrays and objects:

```js
const ArrayIx = {
  set: (i, v, a) => [...a.slice(0, i), v, ...a.slice(i+1)],
  get: (i, a) => a[i]
}

const ObjectIx = {
  set: (n, v, o) => ({...o, [n]: v}),
  get: (n, o) => o[n]
}
```

The `atOf` function then takes an `Ix` module and a key and returns a lens:

```js
const atOf = Ix => k => F => x2yF => x => F.map(
  y => Ix.set(k, y, x),
  x2yF(Ix.get(k, x))
)
```

Notice that we only use the `map` function from the functor argument `F`.  In
other words, lenses do not require an applicative functor.  Lenses only require
a functor.  Otherwise lens functions are just like traversal functions.

As a convenience the `at` function dispatches to `atOf` so that when the key is
a number it uses array indexing and otherwise object indexing:

```js
const at = k => atOf(typeof k === 'number' ? ArrayIx : ObjectIx)(k)
```

We can now map over e.g. an object property:

```js
map(x => -x)(at('b'))({a: 1, b: 2, c: 3})
// {a: 1, b: -2, c: 3}
```

We can also compose lens and traversal functions.  For example:

```js
map(x => -x)(compose([elems, at('x')]))([{x: 1}, {x: 2}])
// [{x: -1}, {x: -2}]
```

```js
map(x => x.toUpperCase())(compose([at('xs'), elems]))({xs: ['a', 'b']})
// {xs: ['A', 'B']}
```

Composing two lenses gives a lens.  Composing a lens and a traversal gives a
traversal.  And composing two traversals gives a traversal.

We have so far only used the identity applicative.  By using other algebras we
get different operations.  One suitable algebra is the constant functor:

```js
const Constant = {map: (x2y, c) => c}
```

The constant functor is a somewhat strange beast.  The `map` function of the
constant functor simply ignores the first argument and returns the second
argument as is.  This basically means that after a value is injected into the
constant functor it never changes.  We can use that to create a `get` function

```js
const get = traverse(Constant)(x => x)
```

that extracts the element targeted by a lens without building a new data
structure during the traversal.  Recall that the `map` function of the
`Constant` functor actually does not use the given mapping function at all.

For example:

```js
get(compose([at(1), at('x')]))([{x: 1}, {x: 2}, {x: 3}])
// 2
```

The same lens, e.g. `compose([at(1), at('x')])`, can now be used to both `get`
and `map` over the targeted element.

The constant functor cannot be used with traversal functions, because traversal
functions like `elems` require an applicative functor with not just the `map`
function, but also the `ap` and `of` functions.  We can build applicatives
similar to the constant functor from
[monoids](https://github.com/rpominov/static-land/blob/master/docs/spec.md#monoid)
and use those to fold over the elements targeted by a traversal:

```js
const foldWith = M => traverse({...Constant, ap: M.concat, of: _ => M.empty()})
```

The above `foldWith` function takes a Static Land
[monoid](https://github.com/rpominov/static-land/blob/master/docs/spec.md#monoid)
and creates an applicative whose `ap` and `of` methods essentially ignore their
arguments and use the monoid.

Using different monoids we get different operations.  For example, we can define
an operation to collect all the elements targeted by a traversal:

```js
const collect = foldWith({empty: () => [], concat: (l, r) => [...l, ...r]})(x => [x])
```

```js
collect(compose([at('xs'), elems, at('x')]))({xs: [{x: 3}, {x: 1}, {x: 4}]})
// [3, 1, 4]
```

And we can define an operation to sum all the elements targeted by a traversal:

```js
const sum = foldWith({empty: () => 0, concat: (x, y) => x + y})(x => x)
```

```js
sum(compose([at('xs'), elems, at('x')]))({xs: [{x: 3}, {x: 1}, {x: 4}]})
// 8
```

This pretty much covers the basics of lenses and traversals.  The Partial Lenses
library simply provides you with a large number of predefined lens and traversal
functions and operations, such as folds, over optics.

Here is a [playground with all of the code from this
document](https://calmm-js.github.io/partial.lenses/playground.html#MYewdgzgLgBFBOBDAbgU3hVMC8MBiOAfDIgEwBGB2xIRMIAFHgJQNmXMBQnoksqAG1QBbCDnx0AHqQCeVYpLHUYigHTxUAEwCuwVA04MZEPABoVzOnlWIADk1XC7RpcRl0A2qu-HzMgLp+Jszm0nIMkswhnNYgAGYMHv5cXDzg0DAAkpqoYFAAllDuuADeTrYAXDARsqGWymERISSV1WF1UrJN5vFVklIAvty8GeXiCCjomAzZuQVFqQIgAOYMMOURUjAA1DAAjKyCIhCsHgDM5nvmACzJMKkjsLS4DCDaUOjm+WBg6PXE8hUskBbw+8CYrG+v3BLBqciiw3SsHyOTyhWKEgawK2WPCkURfBgoGEthAmHEIFsBWArnoVPyNPUWl0+hAX1R8xkixWaw2-QaO32rGJpOmHiOonMEogUqEomSpw8Hj2-kCMCVpHMZzVHluqssDyRMAAgvAkDJMvyYCVOJgoFUGPlzMhzIh-urvDZVBABAz9AAGL7NF0wT2Ib2+vSO7YHQKcZaoe3VJ0kd2IDz5fycIZpQkAeXIACtUMAoJbxDa7Q6wM6eu6GCVPWz1WB-FVkANogmkwwa-R3SAPK3swSMogoHm4uJy8oANZWTpyHEAxzOTjFYiW72Jhizvx1UycMJ4GaSVTd3d1FKj2Dj8Tz5TjycMIq2VDxGAP7C4ADkYG0wjkOgP4wAA-CaZqIBa-RVAWxalparCztyqzrM4-LEAAtJEbBQAwP7kD+UQNogVRXDA5BVJqRJVGcnb3JwSyoXydDYcKIAkmS+jinKMokHhP6SERCqJCUkhkQM5hiVRAx3FwTG8uhUiqFAIAAKq2G+8AAMKINMxEilxiTjvhihEbKxwiWJEBVB4P6ID+5gET+-j0YahLaUiiB5BW5QOu0RLusAOaPDA3bjEgaAYPonl8N5UCsBhFjcApYU7oZYomQcroCUJzAiR40n7JJ1riTApAlUVdFyTeMBxCAAiaAA6oUAAW4gALJ0BMUXTI23ixdA8Wuq0HWqLwwDjj0cRVAA+nQY0iFSMgMMwna1aAAhCKW4j1Y1LVQK1DZLUUDrukk5gTeODoCOY8DnZ6t2ht48CuYlniSMkKU8kSDXbXhGXcSZgkQOZMDSjlpnCcR1m2VVlVlXsCNVNcslubVEAAbtDXNW1x0kqd1TuoGv1gJNPaSH47r9LsMidpsDQoWsmPCAwgPGbloPNBD-FQ-lMOKHDZV0VJiPIzAqNvfcQA).
