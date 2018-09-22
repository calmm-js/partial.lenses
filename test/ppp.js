import * as L from '../dist/partial.lenses.cjs'
import * as R from 'ramda'

// Combinators for Parsing and Pretty-Printing with partial isomorphisms -------

const sourceOf = R.ifElse(
  R.is(String),
  R.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&'),
  L.get('source')
)

const join = (lhs, rhs) => {
  if (lhs.length && rhs.length) {
    const t = lhs[lhs.length - 1] + rhs[0]
    if (/\w\w|[^(]\(|→/.test(t)) return lhs + ' ' + rhs
  }
  return lhs + rhs
}

export const token = pattern => {
  const re = RegExp(`^(${sourceOf(pattern)})\\s*((?:.|\n)*)$`)
  return L.iso(
    s => (R.is(String, s) && (s = re.exec(s)) ? [s[2], s[1]] : undefined),
    p => (R.is(Array, p) ? join(p[1], p[0]) : undefined)
  )
}

export const of = value => L.mapping(input => [input, [input, value]])

export const isomap = R.curry((iso, ppp) => [ppp, L.cross([[], iso])])

const empty = of([])

const append = piso => [
  L.cross([piso, []]),
  L.mapping((xs, y, s) => [[[s, y], xs], [s, [...xs, y]]])
]

export const sequence = (...pisos) => [empty, pisos.map(append)]

export const many = L.unfold

export const alternatives = L.alternatives

export const trim = piso => [
  L.reread(R.replace(/^\s*/, '')),
  piso,
  L.mapping(r => [['', r], r])
]
