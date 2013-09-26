/*global describe, it, after */
'use strict';

var assert = require('assert');
var execFile = require('child_process').execFile;
var fs = require('fs');
var path = require('path');

describe('gifsicle()', function () {
	after(function () {
		fs.unlinkSync('test/minified.gif');
	});

	it('should return path to gifsicle binary', function (cb) {
		var binPath = require('../lib/gifsicle').path;

		execFile(binPath, ['--version', '-'], function (err, stdout) {
			assert(stdout.toString().indexOf('Gifsicle') !== -1);
			cb();
		});
	});

	it('should successfully proxy gifsicle', function (cb) {
		var binPath = path.join(__dirname, '../bin/gifsicle.js');

		execFile('node', [binPath, '--version', '-'], function (err, stdout) {
			assert(stdout.toString().indexOf('Gifsicle') !== -1);
			cb();
		});
	});

	it('should minify a .gif', function (cb) {
		var binPath = path.join(__dirname, '../bin/gifsicle.js');
		var args = [
			'-o', path.join(__dirname, 'minified.gif'),
			path.join(__dirname, 'fixtures', 'test.gif')
		];

		execFile('node', [binPath].concat(args), function () {
			var actual = fs.statSync('test/minified.gif').size;
			var original = fs.statSync('test/fixtures/test.gif').size;

			assert(actual < original);
			cb();
		});
	});
});
