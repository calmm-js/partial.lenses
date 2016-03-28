# Changelog

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
