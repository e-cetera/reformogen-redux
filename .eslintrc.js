const ERROR_ON_PRODUCTION = process.env.NODE_ENV === 'production' ? 2 : 1;

module.exports = {
  'globals': {
    'process': true,
    'React': true,
    'mount': true,
    'shallow': true,
    'render': true,
  },
  'env': {
    'browser': true,
    'jest/globals': true,
    'jest': true,
    'commonjs': true,
    'es6': true,
  },
  'extends': [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:jest/recommended',
    'plugin:flowtype/recommended',
    'plugin:import/recommended',
  ],
  'parser': 'babel-eslint',
  'parserOptions': {
    'ecmaFeatures': {
      'experimentalObjectRestSpread': true,
      'jsx': true
    },
    'sourceType': 'module'
  },
  'plugins': [
    'react',
    'jest',
    'flowtype',
    'import',
  ],
  'settings': {
    'import/parser': 'babel-eslint',
    'import/resolver': {
      'babel-module': {
        alias: {
          '~': './src'
        }
      }
    },
    'react': {
      'createClass': 'createReactClass', // Regex for Component Factory to use,
                                         // default to 'createReactClass'
      'pragma': 'React',  // Pragma to use, default to 'React'
      'version': '16.5.2', // React version, default to the latest React stable release
      'flowVersion': '0.53' // Flow version
    },
  },
  'rules': {
    'no-unused-vars': ERROR_ON_PRODUCTION,
    'react/display-name': ERROR_ON_PRODUCTION,
    'react/prop-types': ERROR_ON_PRODUCTION,

    'react/jsx-pascal-case': [ 2, { 'allowAllCaps': true, 'ignore': [] } ],
    'react/jsx-curly-spacing': [ 2, { 'when': 'always', 'allowMultiline': true } ],
    'react/jsx-boolean-value': [ 2, 'always' ],
    'react/jsx-indent-props': [ 1, 2 ],
    'react/jsx-indent': [ 1, 2 ],
    'react/jsx-handler-names': [ 1, {
      'eventHandlerPrefix': 'handle',
      'eventHandlerPropPrefix': 'on'
    } ],
    'react/jsx-closing-tag-location': 1,
    'react/no-set-state': 1,
    'react/prefer-es6-class': [ 2, 'always' ],

    'react/jsx-tag-spacing': [ 1, { beforeSelfClosing: 'always', 'beforeClosing': 'allow' } ],

    'no-console': ERROR_ON_PRODUCTION,
    'no-debugger': ERROR_ON_PRODUCTION,

    'indent': [ 'error', 2, { SwitchCase: 1 } ],
    'linebreak-style': [
      'error',
      'unix'
    ],
    'quotes': [
      'error',
      'single'
    ],
    'semi': [
      'error',
      'always'
    ],

    'import/order': ['error', {
      'groups': ['builtin', 'external', 'index', 'internal', 'parent', 'sibling'],
      'newlines-between': 'always'
    }],
  }
};
