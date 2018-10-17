'use strict';
const log = require('logalot');
const {buildBinary, makeExecutable} = require('./utils');
const bin = require('.');

const binPath = bin.dest();

(async () => {
	try {
		await bin.download();
		await makeExecutable(binPath);
		await bin.run(['--version']);
		log.success('gifsicle pre-build test passed successfully');
	} catch (error) {
		log.warn(error.message);
		log.warn('gifsicle pre-build test failed');
		log.info('compiling from source');
		try {
			await buildBinary(binPath);
			log.success('gifsicle built successfully');
		} catch (error) {
			log.error(error.stack);
			// eslint-disable-next-line unicorn/no-process-exit
			process.exit(1);
		}
	}
})();
