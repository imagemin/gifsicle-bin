/*global describe, it */
'use strict';

var fs = require('fs');
var path = require('path');
var exec = require('child_process').exec;
var assert = require('assert');
var binPath = require('../lib/gifsicle-bin').path;
var srcUrl = require('../lib/gifsicle-bin').src;
var util = require('../lib/util');

describe('Gifsicle rebuild', function () {
	it('it should rebuild the gifsicle binaries', function (cb) {
		// Give this test time to build
		this.timeout(false);

		var origCTime = fs.statSync(binPath).ctime;
		util.build(srcUrl, path.dirname(binPath), function (err) {
			var actualCTime = fs.statSync(binPath).ctime;
			assert(actualCTime !== origCTime);
			cb(err);
		}).path;
	});
});
