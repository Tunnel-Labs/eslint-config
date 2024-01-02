const fs = require('node:fs');
const path = require('pathe');
const { defineConfig: defineESLintConfig } = require('eslint-define-config');
const builtinRules = require('./rules/builtin.js');
const eslintPluginUnicornRules = require('./rules/eslint-plugin-unicorn.js');
const typescriptEslintRules = require('./rules/typescript-eslint.js');
// @ts-expect-error: works
const { getMonorepoDirpath } = require('get-monorepo-root');
const { deepmerge } = require('deepmerge-ts');

const monorepoDirpath = getMonorepoDirpath(__dirname);
if (monorepoDirpath === undefined) {
	throw new Error('Could not find monorepo directory');
}

exports.getRootEslintConfig = function getRootEslintConfig() {
	require('@rushstack/eslint-patch/modern-module-resolution');

	const packageSlugpathsToEslintConfig = (() => {
		const pnpmWorkspace = JSON.parse(
			fs.readFileSync(path.join(monorepoDirpath, 'pnpm-workspace.yaml'), 'utf8')
		);
		const packageGlobs = pnpmWorkspace.packages;

		const packageSlugpathsToEslintConfig = {};
		for (const packageGlob of packageGlobs) {
			const packageCategory = packageGlob.replace(/\/\*$/, '');
			const packageCategoryPath = path.join(monorepoDirpath, packageCategory);
			const packageSlugs = fs
				.readdirSync(packageCategoryPath)
				.filter((packageSlug) => !packageSlug.startsWith('.'));

			for (const packageSlug of packageSlugs) {
				const packageSlugpath = `${packageCategory}/${packageSlug}`;
				const packageEslintConfigPath = path.join(
					packageCategoryPath,
					packageSlug,
					'eslint.cjs'
				);
				const packageEslintConfig = fs.existsSync(packageEslintConfigPath)
					? require(packageEslintConfigPath)
					: {};

				packageSlugpathsToEslintConfig[packageSlugpath] = packageEslintConfig;
			}
		}

		return packageSlugpathsToEslintConfig;
	})();

	const ignorePatterns = [
		'*.min.*',
		'*.d.ts',
		'CHANGELOG.md',
		'patch-dirs',
		'dist',
		'dist-*/',
		'build',
		'generated',
		'LICENSE*',
		'output',
		'coverage',
		'public',
		'temp',
		'fixture',
		'package-lock.json',
		'pnpm-lock.yaml',
		'yarn.lock',
		// TODO: fix yaml
		'*.yaml',
		'*.yml',
		'__snapshots__',
		'!.vitepress',
		'!.vscode',
		'!.github',
		...Object.entries(packageSlugpathsToEslintConfig).flatMap(
			([packageSlugpath, packageEslintConfig]) =>
				(packageEslintConfig.ignorePatterns ?? []).map((ignorePattern) =>
					path.join(packageSlugpath, ignorePattern)
				)
		)
	];

	const config = defineESLintConfig({
		/**
			After an .eslintrc.js file is loaded, ESLint will normally continue visiting all parent folders to look for other .eslintrc.js files, and also consult a personal file ~/.eslintrc.js. If any files are found, their options will be merged.  This is difficult for humans to understand, and it will cause nondeterministic behavior if files are loaded from outside the Git working folder.

			Setting `root: true` causes ESLint to stop looking for other config files after the first .eslintrc.js is loaded.
		*/
		root: true,

		reportUnusedDisableDirectives: false,

		parserOptions: {
			project: path.join(monorepoDirpath, 'tsconfig.node16.json'),
			ecmaVersion: 2022,
			sourceType: 'module',
			extraFileExtensions: ['.vue', '.json', '.jsonc', '.md']
		},

		/**
			We deliberately don't inline the ESLint plugins and configuration extensions here because `@rushstack/eslint-patch` only resolves the entries in `extends` and `plugins` correctly when the configuration is referenced via the `extends` property.
		*/
		plugins: undefined,
		extends: [require.resolve('./extends-and-plugins/base')],

		ignorePatterns,
		rules: {
			...builtinRules,
			...eslintPluginUnicornRules,

			'simple-import-sort/imports': 'warn',
			'simple-import-sort/exports': 'warn',

			'import/extensions': [
				'error',
				'ignorePackages',
				{
					js: 'always',
					jsx: 'always',
					ts: 'always',
					tsx: 'always'
				}
			],
			// Copied from https://github.com/xojs/xo/blob/ce76e496fdb80a2a6fb33609afd108ddab230e7f/config/plugins.cjs#L353
			'eslint-comments/no-unused-disable': 'off',
			'eslint-comments/disable-enable-pair': [
				'error',
				{
					allowWholeFile: true
				}
			],
			'eslint-comments/no-aggregating-enable': 'error',
			'eslint-comments/no-duplicate-disable': 'error',
			'eslint-comments/no-unused-enable': 'error',
			'eslint-comments/require-description': 'error'
		},
		overrides: [
			...Object.entries(packageSlugpathsToEslintConfig).flatMap(
				([packageSlugpath, packageEslintConfig]) => [
					...(packageEslintConfig.overrides ?? []).map((override) => ({
						...override,
						files: override.files.map((fileGlob) =>
							path.join(packageSlugpath, fileGlob)
						),
						parser: require.resolve('@typescript-eslint/parser'),
						plugins: undefined,
						extends: require.resolve('./extends-and-plugins/typescript-extras')
					})),
					{
						files: [
							`${packageSlugpath}/**/*.ts`,
							`${packageSlugpath}/**/*.tsx`
						],
						parser: require.resolve('@typescript-eslint/parser'),
						plugins: undefined,
						extends: require.resolve('./extends-and-plugins/typescript-extras'),
						rules: {
							...typescriptEslintRules,
							...packageEslintConfig.rules
						}
					},
					{
						files: [`${packageSlugpath}/**/*.*`],
						rules: {
							...packageEslintConfig.rules
						}
					}
				]
			),
			// Config inspired by https://github.com/antfu/eslint-config/blob/main/packages/basic/index.js
			{
				// Code blocks in markdown file
				files: ['**/*.md/*.*'],
				rules: {
					'@typescript-eslint/no-redeclare': 'off',
					'@typescript-eslint/no-unused-vars': 'off',
					'@typescript-eslint/no-use-before-define': 'off',
					'@typescript-eslint/no-var-requires': 'off',
					'@typescript-eslint/comma-dangle': 'off',
					'import/no-unresolved': 'off',
					'no-alert': 'off',
					'no-console': 'off',
					'no-restricted-imports': 'off',
					'no-undef': 'off',
					'no-unused-expressions': 'off',
					'no-unused-vars': 'off'
				}
			},
			{
				files: ['*.json', '*.json5'],
				parser: require.resolve('jsonc-eslint-parser'),
				rules: {
					'jsonc/array-bracket-spacing': ['error', 'never'],
					'jsonc/comma-dangle': ['error', 'never'],
					'jsonc/comma-style': ['error', 'last'],
					'jsonc/indent': ['error', 'tab'],
					'jsonc/key-spacing': [
						'error',
						{ beforeColon: false, afterColon: true }
					],
					'jsonc/no-octal-escape': 'error',
					'jsonc/object-curly-newline': [
						'error',
						{ multiline: true, consistent: true }
					],
					'jsonc/object-curly-spacing': ['error', 'always'],
					'jsonc/object-property-newline': [
						'error',
						{ allowMultiplePropertiesPerLine: true }
					]
				}
			},
			{
				files: ['package.json'],
				parser: require.resolve('jsonc-eslint-parser'),
				rules: {
					'jsonc/sort-keys': [
						'error',
						{
							pathPattern: '^$',
							order: [
								'publisher',
								'name',
								'displayName',
								'type',
								'version',
								'private',
								'packageManager',
								'description',
								'author',
								'license',
								'funding',
								'homepage',
								'repository',
								'bugs',
								'keywords',
								'categories',
								'sideEffects',
								'exports',
								'main',
								'module',
								'unpkg',
								'jsdelivr',
								'types',
								'typesVersions',
								'bin',
								'icon',
								'files',
								'engines',
								'activationEvents',
								'contributes',
								'scripts',
								'peerDependencies',
								'peerDependenciesMeta',
								'dependencies',
								'optionalDependencies',
								'devDependencies',
								'pnpm',
								'overrides',
								'resolutions',
								'husky',
								'simple-git-hooks',
								'lint-staged',
								'eslintConfig'
							]
						},
						{
							pathPattern: '^(?:dev|peer|optional|bundled)?[Dd]ependencies$',
							order: { type: 'asc' }
						},
						{
							pathPattern: '^exports.*$',
							order: ['types', 'require', 'import']
						}
					]
				}
			}
		]
	});

	return config;
};

/**
	@param {import('eslint-define-config').ESLintConfig} packageConfig
	@returns
*/
exports.defineConfig = function defineConfig(packageConfig = {}) {
	return defineESLintConfig(packageConfig);
};

exports.defineNextAppConfig = function defineNextAppConfig(config = {}) {
	return defineESLintConfig(
		deepmerge(
			{
				extends: [require.resolve('./extends-and-plugins/next.js')],
				env: {
					es6: true,
					node: true,
					browser: true
				},
				globals: { Bun: true },
				plugins: [
					// '@-/tunnel',
					'import'
				],
				rules: {
					'react/jsx-no-undef': ['error', { allowGlobals: true }],
					// We use arrow functions in valtio
					'object-shorthand': 'off',
					'unicorn/no-abusive-eslint-disable': 'off',
					'@typescript-eslint/no-use-before-define': 'off',
					'react/no-unescaped-entities': 'off',
					'react-hooks/exhaustive-deps': ['error'],
					'@typescript-eslint/no-non-null-assertion': 'error',
					'react/no-unknown-property': [
						'error',
						{ ignore: ['css', 'global', 'jsx'] }
					],
					'unicorn/prefer-top-level-await': 'off',
					'import/extensions': 'off'
				},
				settings: {
					react: {
						version: 'detect'
					}
				}
			},
			config
		)
	);
};
