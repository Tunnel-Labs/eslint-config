const { defineConfig } = require('eslint-define-config');

/**
	We deliberately keep the `extends` and `plugins` property in a separate file because `@rushstack/eslint-patch` only works (i.e. correctly resolves the entries in `extends` and `plugins`) when the configuration is externally referenced via the `extends` property.
*/
const extendsAndPlugins = defineConfig({
	extends: [
		'xo',
		'plugin:unicorn/recommended',
		'plugin:yml/standard',
		'plugin:jsonc/recommended-with-jsonc',
		// TODO: fix linting markdown with TypeScript
		// 'plugin:markdown/recommended',
		// Make sure rules don't conflict with Prettier formatting
		'prettier'
	],
	plugins: [
		'eslint-plugin-unicorn',
		'eslint-comments',
		'html',
		'n',
		'neverthrow',
		'import',
		// '@-/tunnel',
		// Automatically sorts the imports so you don't have to worry about it
		'simple-import-sort',
		'react',
		'react-hooks',
		'unused-imports',
		'eslint-plugin-deprecation'
	]
});

module.exports = extendsAndPlugins;
