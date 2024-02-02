const clone = require('rfdc')();

/**
	Next.js's ESLint configuration already contains certain plugins, so we exclude them to prevent the `Plugin ${plugin} was conflicted between...` errors.
*/
const extendsAndPluginsNext = clone(require('./base.js'));

extendsAndPluginsNext.extends.push('next/core-web-vitals');

module.exports = extendsAndPluginsNext;
