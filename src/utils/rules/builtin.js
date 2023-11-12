/** @type {import('eslint-define-config').ESLintConfig['rules']} */
const builtinRules = {
	/**
		Commenting out code should not capitalize it.
	*/
	'capitalized-comments': 'off',

	/**
		Some third-party libraries use non-camelcase properties.
	*/
	camelcase: 'off',

	/**
		Lonely if statements are sometimes easier to understand
	*/
	'no-lonely-if': 'off',

	/**
		Adding an `else` statement after a return is easier to follow.
	*/
	'no-else-return': 'off',

	/**
		Negated conditions are sometimes easier to follow.
	*/
	'no-negated-condition': 'off',
	'unicorn/no-negated-condition': 'off',

	/**
		We use `void` to indicate that a Promise's return value is deliberately ignored.
	*/
	'no-void': 'off',

	/**
		Accessing constructors on properties like `new webpack.DefinePlugin(...)` should work.
	*/
	'new-cap': 'off',

	/**
		Loop labels makes it easier and more readable to break out of nested loops.
	*/
	'no-labels': 'off',

	/**
		Prefer using @-/logger instead of `console` methods.
	*/
	'no-console': 'error',

	/**
		Adding a function name to inline functions makes code more readable.
	*/
	'func-names': 'off',

	/**
		We sometimes need declaration functions for function overloading, but we also sometimes need arrow functions for TypeScript function types. Unfortunately, there isn't a func-style rule from `@typescript-eslint` that makes an exception for function declarations.
		@see https://github.com/typescript-eslint/typescript-eslint/issues/1236
	*/
	'func-style': 'off',

	/**
		Force unused variables to start with an underscore.
	*/
	'no-unused-vars': 'off',

	'unused-imports/no-unused-imports': 'error',
	'unused-imports/no-unused-vars': [
		'warn',
		{
			vars: 'all',
			varsIgnorePattern: '^_',
			args: 'after-used',
			argsIgnorePattern: '^_'
		}
	],

	'import/no-anonymous-default-export': 'off',
	'prefer-arrow-callback': 'off',

	'no-restricted-imports': [
		'error',
		{
			paths: [
				{
					name: 'node:path',
					message: 'Import from `pathe` instead'
				},
				{
					name: 'path',
					message: 'Import from `pathe` instead'
				}
			]
		}
	],

	'no-restricted-properties': [
		'error',
		// "destru" is more type-safe because it always returns `unknown`
		{
			object: 'JSON',
			property: 'parse',
			message: 'Use `destru` instead'
		}
	],

	'lines-between-class-members': 'off',

	'no-self-assign': 'off',

	'no-warning-comments': 'off',

	// annoying af
	'arrow-body-style': 'off'
};

module.exports = builtinRules;
