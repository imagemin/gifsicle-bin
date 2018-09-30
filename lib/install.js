'use strict';
const path = require('path');
const binBuild = require('bin-build');
const log = require('logalot');
const bin = require('.');

bin.run(['--version']).catch(err => {
	if (err) {
		log.warn(err.message);
		log.warn('gifsicle pre-build test failed');
		log.info('compiling from source');

		const cfg = [
			'./configure --disable-gifview --disable-gifdiff',
			`--prefix="${bin.dest()}" --bindir="${bin.dest()}"`
		].join(' ');

		binBuild.file(path.resolve(__dirname, '../vendor/source/gifsicle.tar.gz'), [
			'autoreconf -ivf',
			cfg,
			'make install'
		])
			.then(() => {
				log.success('gifsicle built successfully');
			})
			.catch(err => {
				log.error(err.stack);

				// eslint-disable-next-line unicorn/no-process-exit
				process.exit(1);
			});
	}

	log.success('gifsicle pre-build test passed successfully');
});
