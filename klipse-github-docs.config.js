;() => {
  const targetDefaults = {
    user: 'calmm-js',
    project: 'partial.lenses',
    icon: 'https://avatars1.githubusercontent.com/u/17234211',
    ga: 'UA-52808982-2',
    scripts: [
      'https://unpkg.com/babel-polyfill/dist/polyfill.min.js',
      'infestines.js',
      'partial.lenses.js',
      'https://unpkg.com/ramda/dist/ramda.min.js',
      'https://unpkg.com/immutable/dist/immutable.min.js',
      'https://unpkg.com/moment/min/moment.min.js',
      'https://unpkg.com/lodash',
      'setup.js'
    ]
  }

  return [
    Object.assign({}, targetDefaults, {
      source: 'README.md',
      target: 'index.html',
      title: 'Partial Lenses',
      stripComments: true,
      constToVar: true,
      menu: true,
      tooltips: true
    }),
    Object.assign({}, targetDefaults, {
      source: 'EXERCISES.md',
      target: 'exercises.html',
      title: 'Partial Lenses Exercises',
      menu: true
    }),
    Object.assign({}, targetDefaults, {
      source: 'IMPLEMENTATION.md',
      target: 'implementation.html',
      title: 'Partial Lenses Implementation',
      stripComments: true,
      constToVar: true,
      menu: true
    })
  ]
}
