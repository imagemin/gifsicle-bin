'use strict';
const path = require('path');
const binBuild = require('bin-build');
const log = require('logalot');
const bin = require('.');

const buildFromSource = () => {
	log.info('compiling from source');

	const cfg = [
		'./configure --disable-gifview --disable-gifdiff',
		`--prefix="${bin.dest()}" --bindir="${bin.dest()}"`
	].join(' ');

	binBuild.file(path.resolve(__dirname, '../vendor/source/gifsicle.tar.gz'), [
		'autoreconf -ivf',
		cfg,
		'make install'
	]).then(() => {
		log.success('gifsicle built successfully');
	}).catch(error => {
		log.error(error.stack);

		// eslint-disable-next-line unicorn/no-process-exit
		process.exit(1);
	});
};

(function () {
	if (process.env.GIFSICLE_SKIP_PREBUILD_DOWNLOAD) {
		return buildFromSource();
	}

	bin.run(['--version']).then(() => {
		log.success('gifsicle pre-build test passed successfully');
	}).catch(error => {
		log.warn(error.message);
		log.warn('gifsicle pre-build test failed');
		buildFromSource();
	});
})();
