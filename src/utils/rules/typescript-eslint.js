/** @type {import('eslint-define-config').ESLintConfig['rules']} */
const typescriptEslintRules = {
	/**
		We force unused variables to start with an underscore so we can avoid some bugs where we meant to use one variable instead of another (e.g. from a typo).
	*/
	'@typescript-eslint/no-unused-vars': 'off',

	/**
		While unsafe, the `any` type is useful in many scenarios where the exact type is too verbose/complicated to specify.
	*/
	'@typescript-eslint/no-explicit-any': 'off',

	'@typescript-eslint/prefer-nullish-coalescing': 'error',

	/**
		Using this rule allows ESLint to automatically use `import type` whenever appropriate.
	*/
	'@typescript-eslint/consistent-type-imports': [
		'error',
		{
			disallowTypeAnnotations: false
		}
	],

	'@typescript-eslint/unbound-method': 'off',

	'@typescript-eslint/no-misused-promises': 'off',

	/**
		We force all promise-returning functions to be declared as `async` functions for consistency
	*/
	'@typescript-eslint/promise-function-async': 'error',

	'@typescript-eslint/no-unnecessary-condition': 'error',

	/**
		A non-null assertion is unsafe and leads to hard-to-debug bugs.
	*/
	'@typescript-eslint/no-non-null-assertion': 'error',

	/**
		We disable these rules because without complete support for project references, many ESLint types are incorrectly inferred to be `any`, causing many false positives for these rules.
	*/
	'@typescript-eslint/no-unsafe-member-access': 'off',
	'@typescript-eslint/no-unsafe-call': 'off',
	'@typescript-eslint/no-unsafe-return': 'off',
	'@typescript-eslint/no-unsafe-argument': 'off',
	'@typescript-eslint/no-unsafe-assignment': 'off',

	/**
		We allow declaring a type with the same name as the variable for proper typing of ES6 classes with methods defined outside of the class declaration.
	*/
	'@typescript-eslint/no-redeclare': 'off',

	'@typescript-eslint/consistent-type-definitions': ['error', 'interface'],

	'@typescript-eslint/require-await': 'off',

	// Static classes manage logic better than ES6 modules
	'@typescript-eslint/no-extraneous-class': 'off',

	// We have legit uses for empty interfaces
	'@typescript-eslint/no-empty-interface': 'off',

	// empty constructor pattern is too common
	'@typescript-eslint/no-empty-function': 'off',
	
	// needed for typegeese
	'@typescript-eslint/ban-ts-comment': 'off',

	// empty object is useful
	'@typescript-eslint/ban-types': 'off',

	// needed in react
	'@typescript-eslint/no-dynamic-delete': 'off'
};

module.exports = typescriptEslintRules;
