const { createGlobfileManager } = require('glob-imports');
const { getMonorepoDirpath } = require('get-monorepo-root');

/**
	@type import('eslint-plugin-codegen').Preset<{
		pattern: string,
		type?: 'matches' | 'filepaths' | 'files'
		moduleType?: 'module' | 'commonjs',
	}>
*/
exports.globImport = ({ context, options }) => {
	const monorepoDirpath = getMonorepoDirpath(context.physicalFilename);
	const { getGlobfileContents, getGlobfilePath } = createGlobfileManager({
		monorepoDirpath,
	});
	const globfileType = options.type ?? 'matches';
	return getGlobfileContents({
		globfilePath: getGlobfilePath({
			globfileModuleSpecifier: `glob${
				globfileType === 'matches' ? '' : `[${globfileType}]`
			}:${options.pattern}`,
			importerFilepath: context.physicalFilename,
		}),
		importerFilepath: context.physicalFilename,
		filepathType: 'relative',
		moduleType: options.moduleType ?? 'module',
	});
};
