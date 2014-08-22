'use strict';

var binCheck = require('bin-check');
var BinBuild = require('bin-build');
var execFile = require('child_process').execFile;
var fs = require('fs');
var path = require('path');
var test = require('ava');

test('should rebuild the gifsicle binaries', function (t) {
	t.plan(2);

	var tmp = path.join(__dirname, 'tmp');
	var builder = new BinBuild()
		.src('http://www.lcdf.org/gifsicle/gifsicle-1.83.tar.gz')
		.cmd('./configure --disable-gifview --disable-gifdiff --prefix="' + tmp + '" --bindir="' + tmp + '"')
		.cmd('make install');

	builder.build(function (err) {
		t.assert(!err);

		fs.exists(path.join(tmp, 'gifsicle'), function (exists) {
			t.assert(exists);
		});
	});
});

test('should return path to binary and verify that it is working', function (t) {
	t.plan(2);

	binCheck(require('../').path, ['--version'], function (err, works) {
		t.assert(!err);
		t.assert(works);
	});
});

test('should minify a GIF', function (t) {
	t.plan(5);

	var args = [
		'-o', path.join(__dirname, 'tmp/test.gif'),
		path.join(__dirname, 'fixtures/test.gif')
	];

	fs.mkdir(path.join(__dirname, 'tmp'), function (err) {
		t.assert(!err);

		execFile(require('../').path, args, function (err) {
			t.assert(!err);

			fs.stat(path.join(__dirname, 'fixtures/test.gif'), function (err, a) {
				t.assert(!err);

				fs.stat(path.join(__dirname, 'tmp/test.gif'), function (err, b) {
					t.assert(!err);
					t.assert(b.size < a.size);
				});
			});
		});
	});
});
