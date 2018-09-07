'use strict';
const fs = require('fs');
const path = require('path');
const test = require('ava');
const execa = require('execa');
const tempy = require('tempy');
const binCheck = require('bin-check');
const binBuild = require('bin-build');
const compareSize = require('compare-size');
const m = require('.');

async function makeExecutable() {
	try {
		await execa('chmod', ['+x', m]);
	} catch (_) {
		console.log('not executable');
	}
}

test('rebuild the gifsicle binaries', async t => {
	const tmp = tempy.directory();
	const cfg = [
		'./configure --disable-gifview --disable-gifdiff',
		`--prefix="${tmp}" --bindir="${tmp}"`
	].join(' ');

	await binBuild.url('https://github.com/kohler/gifsicle/archive/v1.90.tar.gz', [
		'autoreconf -ivf',
		cfg,
		'make install'
	]);

	t.true(fs.existsSync(path.join(tmp, 'gifsicle')));
});

test('verify binary', async t => {
	makeExecutable();
	t.true(await binCheck(m, ['--version']));
});

test('minify a gif', async t => {
	makeExecutable();
	const tmp = tempy.directory();
	const src = path.join(__dirname, 'fixtures/test.gif');
	const dest = path.join(tmp, 'test.gif');
	const args = [
		'-o',
		dest,
		src
	];

	await execa(m, args);
	const res = await compareSize(src, dest);

	t.true(res[dest] < res[src]);
});
