/*global afterEach, beforeEach, describe, it */
'use strict';

var assert = require('assert');
var binCheck = require('bin-check');
var BinWrapper = require('bin-wrapper');
var fs = require('fs');
var path = require('path');
var spawn = require('child_process').spawn;
var rm = require('rimraf');

describe('gifsicle()', function () {
	afterEach(function (cb) {
		rm(path.join(__dirname, 'tmp'), cb);
	});

	beforeEach(function (cb) {
		fs.mkdir(path.join(__dirname, 'tmp'), cb);
	});

	it('should rebuild the gifsicle binaries', function (cb) {
		var bin = new BinWrapper({ bin: 'gifsicle', dest: path.join(__dirname, 'tmp') });
		var script = './configure --disable-gifview --disable-gifdiff ' +
					 '--prefix="' + bin.dest + '" ' +
					 '--bindir="' + bin.dest + '" && ' +
					 'make install';

		bin
			.addSource('http://www.lcdf.org/gifsicle/gifsicle-1.71.tar.gz')
			.build(script)
			.on('build', function () {
				cb(assert(true));
			});
	});

	it('should return path to binary and verify that it is working', function (cb) {
		var binPath = require('../').path;

		binCheck(binPath, '--version', function (err, works) {
			cb(assert.equal(works, true));
		});
	});

	it('should minify a GIF', function (cb) {
		var binPath = require('../').path;
		var args = [
			'-o', path.join(__dirname, 'tmp/test.gif'),
			path.join(__dirname, 'fixtures/test.gif')
		];

		spawn(binPath, args).on('close', function () {
			var src = fs.statSync(path.join(__dirname, 'fixtures/test.gif')).size;
			var dest = fs.statSync(path.join(__dirname, 'tmp/test.gif')).size;

			cb(assert(dest < src));
		});
	});
});
