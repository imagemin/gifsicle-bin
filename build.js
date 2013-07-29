'use strict';

var path = require('path');
var exec = require('child_process').exec;
var which = require('which');
var tar = require('tar');
var zlib = require('zlib');
var request = require('request');

// Check if we're behind some kind of proxy
var proxy = process.env.http_proxy || process.env.HTTP_PROXY ||
			process.env.https_proxy || process.env.HTTPS_PROXY || '';

function tmpdir() {
	return process.env.TMPDIR || process.env.TMP || process.env.TEMP || '/tmp';
}

function fetch(url, dest, cb) {
	console.log('Fetching %s...'.cyan, url);
	return request.get(url)
		.on('error', cb)
		.pipe(zlib.Gunzip())
		.on('error', cb)
		.pipe(tar.Extract({ path: dest, strip: 1 }))
		.on('error', cb)
		.on('close', cb);
}

module.exports = function (cb) {
	if (process.platform === 'darwin' || process.platform === 'linux') {
		var version = '1.71';
		var binPath = require('./lib/gifsicle-bin').path;
		var binDir = path.dirname(binPath);
		var tmpPath = path.join(tmpdir(), 'gifsicle-' + version);
		var urlPath = 'http://www.lcdf.org/gifsicle/gifsicle-' + version + '.tar.gz';
		var buildScript = './configure --disable-gifview --disable-gifdiff' +
						  ' --prefix=' + tmpPath + ' --bindir=' + binDir +
						  ' && ' + 'make install';

		return fetch(urlPath, tmpPath, cb)
			.on('close', function () {
				try {
					which.sync('make');
				} catch (err) {
					return console.log('make is not installed'.red);
				}
				exec(buildScript, { cwd: tmpPath })
					.on('error', cb)
					.on('close', function () {
						console.log('gifsicle rebuilt successfully'.green);
					});
			});
	}
};

request = request.defaults({ proxy: proxy });
