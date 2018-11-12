import * as L from '../dist/partial.lenses.cjs'

import * as P from './ppp'

// λ-calculus Parser & Pretty-Printer ------------------------------------------

const variable = P.token(/\w+/)

const atomicExpression = L.lazy(() =>
  P.alternatives(
    P.isomap(L.mapping(name => [name, {type: 'ref', name}]), variable),
    P.isomap(
      L.mapping(e => [['(', e, ')'], e]),
      P.sequence(P.token('('), compoundExpression, P.token(')'))
    )
  )
)

const compoundExpression = L.lazy(() =>
  P.alternatives(
    P.isomap(
      L.mapping((param, body) => [
        ['λ', param, '→', body],
        {type: 'lam', param, body}
      ]),
      P.sequence(P.token('λ'), variable, P.token('→'), compoundExpression)
    ),
    P.isomap(
      [
        L.mapping((expr, exprs) => [[expr, ...exprs], [expr, exprs]]),
        L.cross([[], L.reverse]),
        L.fold(L.mapping((fun, arg) => [[fun, arg], {type: 'app', fun, arg}]))
      ],
      P.many(atomicExpression)
    )
  )
)

export const ppp = P.trim(compoundExpression)

// Evaluator for λ-calculus ----------------------------------------------------

export const interpret = (env, expr) => {
  switch (expr.type) {
    case 'lam':
      return value => interpret(L.set(expr.param, value, env), expr.body)
    case 'app':
      return interpret(env, expr.fun)(interpret(env, expr.arg))
    case 'ref':
      return env[expr.name]
  }
}
