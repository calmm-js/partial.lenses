# Changelog

## 2.0.0

Changed from using a single default export to multiple exports to support
dead-code elimination, aka tree shaking.  In order to make this change possible,
a number of combinators had to be renamed and the default import is now an alias
for `compose` that may help to keep notation concise.
