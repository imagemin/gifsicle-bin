'use strict';
var fs = require('fs');
var path = require('path');
var colors = require('colors');
var Mocha = require('mocha');
var mocha = new Mocha({ui: 'bdd', reporter: 'min'});
var util = require('./util');
var bin = require('./gifsicle-bin');

function runBuild() {
	return util.build(bin.src, path.dirname(bin.path), function (err) {
		if (err) return console.log('✗ %s'.red, err.message);
		console.log('✓ gifsicle rebuilt successfully'.green);
	});
}

function runTest() {
	mocha.addFile('test/test-gifsicle-path.js');
	mocha.run(function (failures) {
		if (failures > 0) {
			console.log('✗ pre-build test failed, compiling from source...'.red);
			runBuild();
		} else {
			console.log('✓ pre-build test passed successfully, skipping build...'.green);
		}
	});
}

fs.exists(bin.path, function (exists) {
	if (exists) {
		runTest();
	} else {
		util.fetch(bin.url, bin.path, function (err) {
			if (err) {
				return console.log('✗ %s'.red, err.message);
			}

			fs.chmod(bin.path, '0755');
			runTest();
		});
	}
});
