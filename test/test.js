'use strict';

var bin = require('../lib');
var binCheck = require('bin-check');
var BinBuild = require('bin-build');
var compareSize = require('compare-size');
var execFile = require('child_process').execFile;
var fs = require('fs');
var mkdir = require('mkdirp');
var path = require('path');
var rm = require('rimraf');
var test = require('ava');
var tmp = path.join(__dirname, 'tmp');

test('rebuild the gifsicle binaries', function (t) {
	t.plan(3);

	var cfg = [
		'./configure --disable-gifview --disable-gifdiff',
		'--prefix="' + tmp + '" --bindir="' + tmp + '"'
	].join(' ');

	var builder = new BinBuild()
		.src('http://www.lcdf.org/gifsicle/gifsicle-' + bin.v + '.tar.gz')
		.cmd(cfg)
		.cmd('make install');

	builder.build(function (err) {
		t.assert(!err);

		fs.exists(path.join(tmp, bin.use()), function (exists) {
			t.assert(exists);

			rm(tmp, function (err) {
				t.assert(!err);
			});
		});
	});
});

test('return path to binary and verify that it is working', function (t) {
	t.plan(2);

	binCheck(require('../').path, ['--version'], function (err, works) {
		t.assert(!err);
		t.assert(works);
	});
});

test('minify a GIF', function (t) {
	t.plan(5);

	var src = path.join(__dirname, 'fixtures/test.gif');
	var dest = path.join(tmp, 'test.gif');
	var args = [
		'-o', dest,
		src
	];

	mkdir(tmp, function (err) {
		t.assert(!err);

		execFile(require('../').path, args, function (err) {
			t.assert(!err);

			compareSize(src, dest, function (err, res) {
				t.assert(!err);
				t.assert(res[dest] < res[src]);

				rm(tmp, function (err) {
					t.assert(!err);
				});
			});
		});
	});
});
