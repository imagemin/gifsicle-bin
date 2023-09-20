import process from 'node:process';
import {fileURLToPath} from 'node:url';
import binBuild from 'bin-build';
import bin from './index.js';

// Can stop ignoring this rule once no longer needing to support
// Node versions that *don't* support top-level await
// See https://github.com/imagemin/gifsicle-bin/issues/149
// eslint-disable-next-line unicorn/prefer-top-level-await
(async () => {
	try {
		await bin.run(['--version']);
		console.log('gifsicle pre-build test passed successfully');
	} catch (error) {
		console.warn(error.message);
		console.warn('gifsicle pre-build test failed');
		console.info('compiling from source');

		const config = [
			'./configure --disable-gifview --disable-gifdiff',
			`--prefix="${bin.dest()}" --bindir="${bin.dest()}"`,
		].join(' ');

		try {
			const source = fileURLToPath(new URL('../vendor/source/gifsicle-1.93.tar.gz', import.meta.url));
			await binBuild.file(source, [
				'autoreconf -ivf',
				config,
				'make install',
			]);

			console.log('gifsicle built successfully');
		} catch (error) {
			console.error(error.stack);

			// eslint-disable-next-line unicorn/no-process-exit
			process.exit(1);
		}
	}
})();
