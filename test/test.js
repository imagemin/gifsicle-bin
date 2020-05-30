'use strict';
const fs = require('fs');
const path = require('path');
const test = require('ava');
const execa = require('execa');
const tempy = require('tempy');
const binCheck = require('bin-check');
const binBuild = require('bin-build');
const compareSize = require('compare-size');
const m = require('..');

test.serial('rebuild the gifsicle binaries', async t => {
	// Skip the test on Windows
	if (process.platform === 'win32') {
		t.pass();
		return;
	}

	const temporary = tempy.directory();
	const cfg = [
		'./configure --disable-gifview --disable-gifdiff',
		`--prefix="${temporary}" --bindir="${temporary}"`
	].join(' ');

	await binBuild.url('https://github.com/kohler/gifsicle/archive/v1.92.tar.gz', [
		'autoreconf -ivf',
		cfg,
		'make install'
	]);

	t.true(fs.existsSync(path.join(temporary, 'gifsicle')));
});

test.serial('verify binary', async t => {
	t.true(await binCheck(m, ['--version']));
});

test.serial('minify a gif', async t => {
	const temporary = tempy.directory();
	const src = path.join(__dirname, 'fixtures/test.gif');
	const dest = path.join(temporary, 'test.gif');
	const args = [
		'-o',
		dest,
		src
	];

	await execa(m, args);
	const result = await compareSize(src, dest);

	t.true(result[dest] < result[src]);
});
