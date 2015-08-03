/*global afterEach,beforeEach,it*/
'use strict';

var assert = require('assert');
var binCheck = require('bin-check');
var BinBuild = require('bin-build');
var compareSize = require('compare-size');
var execFile = require('child_process').execFile;
var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');
var rimraf = require('rimraf');
var tmp = path.join(__dirname, 'tmp');

beforeEach(function () {
	mkdirp.sync(tmp);
});

afterEach(function () {
	rimraf.sync(tmp);
});

it('rebuild the gifsicle binaries', function (cb) {
	var cfg = [
		'./configure --disable-gifview --disable-gifdiff',
		'--prefix="' + tmp + '" --bindir="' + tmp + '"'
	].join(' ');

	new BinBuild()
		.src('http://www.lcdf.org/gifsicle/gifsicle-1.88.tar.gz')
		.cmd('autoreconf -ivf')
		.cmd(cfg)
		.cmd('make install')
		.run(function (err) {
			assert(!err);
			assert(fs.statSync(path.join(tmp, 'gifsicle')).isFile());
			cb();
		});
});

it('return path to binary and verify that it is working', function (cb) {
	binCheck(require('../'), ['--version'], function (err, works) {
		assert(!err);
		assert(works);
		cb();
	});
});

it('minify a GIF', function (cb) {
	var src = path.join(__dirname, 'fixtures/test.gif');
	var dest = path.join(tmp, 'test.gif');
	var args = [
		'-o', dest,
		src
	];

	execFile(require('../'), args, function (err) {
		assert(!err);

		compareSize(src, dest, function (err, res) {
			assert(!err);
			assert(res[dest] < res[src]);
			cb();
		});
	});
});
