# @tunnel/eslint-config

## Installation

```shell
npm install --save-dev @tunnel/eslint-config
```

## Usage

```javascript
// .eslintrc.cjs

const { defineConfig } = require('@tunnel/eslint-config');

module.exports = defineConfig({
  ignorePatterns: ['imports'],
  rules: {
    'no-new': 'off',
    'unicorn/template-indent': [
      'error',
      {
        tags: ['yaml', 'outdent']
      }
    ]
  },
  overrides: [
    {
      files: ['src/kubernetes/**/*.ts'],
      rules: {
        'import/prefer-default-export': 'error'
      }
    }
  ]
});
```
