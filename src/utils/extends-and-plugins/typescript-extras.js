const { defineConfig } = require('eslint-define-config');

const extendsAndPluginsTypescriptExtras = defineConfig({
	plugins: ['@typescript-eslint', '@tunnel/neverthrow'],
	extends: [
		'plugin:@typescript-eslint/recommended',
		'plugin:@typescript-eslint/recommended-requiring-type-checking',
		'plugin:@typescript-eslint/strict',
		'prettier'
	]
});

module.exports = extendsAndPluginsTypescriptExtras;
