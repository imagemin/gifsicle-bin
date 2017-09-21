'use strict';
const fs = require('fs');
const path = require('path');
const test = require('ava');
const execa = require('execa');
const tempy = require('tempy');
const binCheck = require('bin-check');
const BinBuild = require('bin-build');
const compareSize = require('compare-size');
const m = require('.');

test.cb('rebuild the gifsicle binaries', t => {
	const tmp = tempy.directory();
	const cfg = [
		'./configure --disable-gifview --disable-gifdiff',
		`--prefix="${tmp}" --bindir="${tmp}"`
	].join(' ');

	new BinBuild()
		.src('https://github.com/kohler/gifsicle/archive/v1.88.tar.gz')
		.cmd('autoreconf -ivf')
		.cmd(cfg)
		.cmd('make install')
		.run(err => {
			t.ifError(err);
			t.true(fs.existsSync(path.join(tmp, 'gifsicle')));
			t.end();
		});
});

test('verify binary', async t => {
	t.true(await binCheck(m, ['--version']));
});

test('minify a gif', async t => {
	const tmp = tempy.directory();
	const src = path.join(__dirname, 'fixtures/test.gif');
	const dest = path.join(tmp, 'test.gif');
	const args = [
		'-o', dest,
		src
	];

	await execa(m, args);
	const res = await compareSize(src, dest);

	t.true(res[dest] < res[src]);
});
