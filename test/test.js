import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import {fileURLToPath} from 'node:url';
import test from 'ava';
import {execa} from 'execa';
import {temporaryDirectory} from 'tempy';
import binCheck from 'bin-check';
import binBuild from 'bin-build';
import compareSize from 'compare-size';
import gifsicle from '../index.js';

test.serial('rebuild the gifsicle binaries', async t => {
	// Skip the test on Windows
	if (process.platform === 'win32') {
		t.pass();
		return;
	}

	const temporary = temporaryDirectory();
	const cfg = [
		'./configure --disable-gifview --disable-gifdiff',
		`--prefix="${temporary}" --bindir="${temporary}"`,
	].join(' ');

	const source = fileURLToPath(new URL('../vendor/source/gifsicle-1.93.tar.gz', import.meta.url));
	await binBuild.file(source, [
		'autoreconf -ivf',
		cfg,
		'make install',
	]);

	t.true(fs.existsSync(path.join(temporary, 'gifsicle')));
});

test.serial('verify binary', async t => {
	t.true(await binCheck(gifsicle, ['--version']));
});

test.serial('minify a gif', async t => {
	const temporary = temporaryDirectory();
	const src = fileURLToPath(new URL('fixtures/test.gif', import.meta.url));
	const dest = path.join(temporary, 'test.gif');
	const args = [
		'-o',
		dest,
		src,
	];

	await execa(gifsicle, args);
	const result = await compareSize(src, dest);

	t.true(result[dest] < result[src]);
});
