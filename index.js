'use strict';

var BinWrapper = require('bin-wrapper');
var chalk = require('chalk');
var fs = require('fs');
var path = require('path');

/**
 * Initialize a new BinWrapper
 */

var bin = new BinWrapper({ bin: 'gifsicle', dest: path.join(__dirname, 'vendor') });
var bs = './configure --disable-gifview --disable-gifdiff ' +
		 '--prefix="' + path.join(__dirname, 'vendor') + '" ' +
		 '--bindir="' + path.join(__dirname, 'vendor') + '" && ' +
		 'make install';

/**
 * Only run check if binary doesn't already exist
 */

fs.exists(bin.path, function (exists) {
	if (!exists) {
		bin
			.addSource('http://www.lcdf.org/gifsicle/gifsicle-1.71.tar.gz')
			.addUrl('https://raw.github.com/yeoman/node-gifsicle/0.1.4/vendor/osx/gifsicle', 'darwin')
			.check()
			.on('error', function (err) {
				console.log(chalk.red('✗ ' + err.message));
			})
			.on('working', function () {
				console.log(chalk.green('✓ pre-build test passed successfully'));
			})
			.on('fail', function () {
				if (process.platform === 'win32') {
					return console.log(chalk.red('✗ building is not supported on ' + process.platform));
				}

				console.log(chalk.red('✗ pre-build test failed, compiling from source...'));

				this.build(bs)
					.on('build', function () {
						console.log(chalk.green('✓ gifsicle rebuilt successfully'));
					})
					.on('error', function (err) {
						console.log(chalk.red('✗ ' + err.message));
					});
			});
	}
});

/**
 * Module exports
 */

module.exports.path = bin.path;
