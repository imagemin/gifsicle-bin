'use strict';

var fs = require('fs');
var colors = require('colors');
var request = require('request');
var Mocha = require('mocha');
var mocha = new Mocha({ui: 'bdd', reporter: 'min'});
var build = require('./build.js');

var binPath = require('./lib/gifsicle-bin').path;
var binUrl = require('./lib/gifsicle-bin').url;

// Check if we're behind some kind of proxy
var proxy = process.env.http_proxy || process.env.HTTP_PROXY ||
			process.env.https_proxy || process.env.HTTPS_PROXY || '';

function runTest() {
	mocha.addFile('test/test-gifsicle-path.js');
	mocha.run(function (failures) {
		if (failures > 0) {
			console.log('pre-build test failed, compiling from source...'.red);
			build(function (err) {
				if (err) throw err;
			});
		} else {
			console.log('pre-build test passed successfully, skipping build...'.green);
		}
	});
}

fs.exists(binPath, function (exists) {
	if (exists) {
		runTest();
	} else {
		request.get(binUrl)
			.pipe(fs.createWriteStream(binPath))
			.on('close', function () {
				fs.chmod(binPath, '0755');
				runTest();
			});
	}
});

request = request.defaults({ proxy: proxy });
