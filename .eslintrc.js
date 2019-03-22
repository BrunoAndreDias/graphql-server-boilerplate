module.exports = {
  env: {
    node: true,
    mocha: true
  },
  extends: 'eslint:recommended',
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module'
  },
  rules: {
    'no-process-exit': 'error',
    'no-multiple-empty-lines': 'error',
    'prefer-template': 'error',
    'no-lonely-if': 'error',
    'no-inline-comments': 'error',
    'no-console': 'error',
    'max-len': ['error', 100],
    'no-duplicate-imports': [
      'error',
      {
        includeExports: true
      }
    ],
    'prefer-const': [
      'error',
      {
        destructuring: 'any',
        ignoreReadBeforeAssign: false
      }
    ],
    'arrow-body-style': ['error', 'as-needed'],
    'arrow-parens': ['error', 'as-needed'],
    'arrow-spacing': 'error',
    'no-var': 'error',
    indent: [
      'error',
      2,
      {
        SwitchCase: 1
      }
    ],
    'no-trailing-spaces': 'error',
    quotes: ['error', 'single'],
    semi: ['error', 'always']
  }
};
