/*global describe, it */
'use strict';

var fs = require('fs');
var exec = require('child_process').exec;
var assert = require('assert');
var binPath = require('../lib/gifsicle-bin').path;

describe('Gifsicle rebuild', function () {
	it('it should rebuild the gifsicle binaries', function (cb) {
		// Give this test time to build
		this.timeout(false);

		var origCTime = fs.statSync(binPath).ctime;
		exec('node lib/check.js', {}, function (err) {
			var actualCTime = fs.statSync(binPath).ctime;
			assert(actualCTime !== origCTime);
			cb(err);
		}).path;
	});
});
