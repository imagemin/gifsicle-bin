/*global describe, it */
'use strict';

var assert = require('assert');
var Bin = require('bin-wrapper');
var fs = require('fs');
var options = require('../lib/gifsicle').options;
var path = require('path');

describe('gifsicle.build()', function () {
	it('should rebuild the gifsicle binaries', function (cb) {
		this.timeout(false);
		var bin = new Bin(options);

		bin.path = path.join(__dirname, '../tmp', bin.bin);
		bin.buildScript = './configure --disable-gifview --disable-gifdiff ' +
				 		  '--bindir="' + path.join(__dirname, '../tmp') + '" && ' +
				 		  'make install';

		bin.build(function () {
			var origCTime = fs.statSync(bin.path).ctime;
			var actualCTime = fs.statSync(bin.path).ctime;

			assert(actualCTime !== origCTime);
			cb();
		});
	});
});
