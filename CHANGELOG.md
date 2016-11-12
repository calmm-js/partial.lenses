# Changelog

## 4.0.0

* Removed previously deprecated functionality: `removeAll`.

## 3.9.2

Although never explicitly specified in documentation, many of the operations and
combinators were curried using Ramda's `curry`.  Unfortunately Ramda's `curry`
is very slow.  From this version forward partial lenses no longer supports the
special features of Ramda's `curry` like placeholders.

## 3.4.1

Fixed bugs when removing a non-existing property from an object or a
non-existent index from an array.  Previously `L.remove("x", {})` returned `{}`.
Now it returns `undefined` as it was previously documented.  Similarly
`L.remove(index, [])` now returns `undefined` as was documented.

Tightened the semantics of combinators, including `L.index`, `L.filter`,
`L.prop` and `L.augment` (and other combinators whose semantics are defined in
terms of those), that specifically work on objects or arrays.  Previously such
combinators worked asymmetrically when operating on values not in their domain.
Now they consistently treat values that are not in their domain as `undefined`.
For example, `L.get("x", null)` now returns `undefined` (previously `null`) and,
consistently, `L.set("x", 1, null)` now returns `{x: 1}` (previously error).

## 3.4.0

Added minimalistic *experimental* traversal support in the form of the
`sequence` traversal.

## 3.0.0

Dropped *implicit* Ramda compatibility.  To interop with Ramda, one must now
explicitly convert lenses using `L.toRamda` and `L.fromRamda`.  In particular,
`L.compose` no longer necessarily returns a Ramda compatible lens and, in the
future, the implementation may be changed more drastically.  This change was
made, because now a lens returned by `L.compose` can take less memory and it
will also be possible to further optimize the implementation in the future.

Removed deprecated functions `L.view`, `L.over` and `L.firstOf`.

## 2.2.0

Renamed `L.view` and `L.over`:

```diff
-L.view
+L.get
```

```diff
-L.over
+L.modify
```

Calling deprecated functions now results in `console.warn` messages.

## 2.1.0

Deprecated `L.firstOf` and added `L.choice`, `L.nothing` and `L.orElse` that
allows the same (and more) functionality to be expressed more compositionally.

## 2.0.0

Changed from using a single default export to named exports to support dead-code
elimination, aka tree shaking.  A number of combinators were renamed in the
process and the default import is now an alias for `compose` that may help to
keep notation concise.

### Upgrade guide

Now using named exports and default that aliases `compose`:

```diff
-import L from "partial.lenses"
+import P, * as L from "partial.lenses"
```

Module prefix no longer works as `compose`:

```diff
-L(...)
+P(...) or L.compose(...)
```

`default` is a keyword and had to be renamed:

```diff
-L.default
+L.defaults
```

`delete` is a keyword and had to be renamed:

```diff
-L.delete
+L.remove
```

```diff
-L.deleteAll
+L.removeAll
```
