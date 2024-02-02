const { defineConfig } = require('eslint-define-config');

const extendsAndPluginsYmlExtras = defineConfig({
	extends: ['plugin:yml/prettier'],
});

module.exports = extendsAndPluginsYmlExtras;
