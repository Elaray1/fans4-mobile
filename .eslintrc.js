module.exports = {
  extends: [
    '@paralect/eslint-config',
    'plugin:react-hooks/recommended',
  ],
  parser: 'babel-eslint',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    sourceType: 'module',
    allowImportExportEverywhere: true,
  },
  plugins: ['react', 'react-native'],
  rules: {
    'react/jsx-indent': ['error', 2, { indentLogicalExpressions: true }],
    'react/forbid-prop-types': 'off',
    semi: ['error', 'always'],
    'class-methods-use-this': 'off',
    'object-curly-newline': 'off',
    'react/jsx-one-expression-per-line': 'off',
    'max-len': ['error', {
      code: 120,
    }],
    'consistent-return': 'off',
    'no-console': 'off',
    'no-param-reassign': 'off',
    'import/extensions': [
      2,
      {
        json: 'never',
        jsx: 'never',
        js: 'never',
        svg: 'always',
      },
    ],

    // https://github.com/Intellicode/eslint-plugin-react-native
    'react-native/no-unused-styles': 2,
    'react-native/split-platform-components': 2,
    'react-native/no-raw-text': 2,
    'react-native/no-single-element-style-arrays': 2,
    // uncomment if needed
    // https://github.com/Intellicode/eslint-plugin-react-native/blob/master/docs/rules/no-inline-styles.md
    // "react-native/no-inline-styles": 2,
    // https://github.com/Intellicode/eslint-plugin-react-native/blob/master/docs/rules/no-color-literals.md
    // "react-native/no-color-literals": 2,
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx'],
        moduleDirectory: ['./', 'src', 'node_modules'],
        paths: ['src'],
      },
    },
  },
};
