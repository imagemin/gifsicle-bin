'use strict';
const BinBuild = require('bin-build');
const log = require('logalot');
const bin = require('.');

bin.run(['--version'], err => {
	if (err) {
		log.warn(err.message);
		log.warn('gifsicle pre-build test failed');
		log.info('compiling from source');

		const cfg = [
			'./configure --disable-gifview --disable-gifdiff',
			`--prefix="${bin.dest()}" --bindir="${bin.dest()}"`
		].join(' ');

		const builder = new BinBuild()
			.src('https://github.com/kohler/gifsicle/archive/v1.88.tar.gz')
			.cmd('autoreconf -ivf')
			.cmd(cfg)
			.cmd('make install');

		return builder.run(err => {
			if (err) {
				log.error(err.stack);
				return;
			}

			log.success('gifsicle built successfully');
		});
	}

	log.success('gifsicle pre-build test passed successfully');
});
