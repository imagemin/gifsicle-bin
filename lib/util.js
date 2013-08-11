'use strict';
var fs = require('fs');
var path = require('path');
var colors = require('colors');
var exec = require('child_process').exec;
var which = require('which');
var tar = require('tar');
var zlib = require('zlib');
var request = require('request');
var progress = require('request-progress');

var util = module.exports;

// Check if we're behind some kind of proxy
var proxy = process.env.http_proxy || process.env.HTTP_PROXY ||
			process.env.https_proxy || process.env.HTTPS_PROXY || '';

util.tmpdir = function () {
	return process.env.TMPDIR || process.env.TMP || process.env.TEMP || '/tmp';
}

util.fetch = function (url, dest, cb) {
	cb = cb || function () {};

	return progress(this.request.get(url))
		.on('response', function (resp) {
			var status = resp.statusCode;

			if (status < 200 || status > 300) {
				return cb(new Error('Status code ' + status));
			}
		})
		.on('progress', function (state) {
			console.log('Downloading %s: %s%'.cyan, path.basename(url), state.percent);
		})
		.on('error', cb)
		.pipe(fs.createWriteStream(dest))
		.on('close', cb);
};

util.extract = function (src, dest, cb) {
	cb = cb || function () {};
	var file = path.basename(src);

	if (path.extname(file) !== '.gz') {
		return cb(new Error('File ' + file + ' is not a known archive'));
	}

	return fs.createReadStream(src)
		.on('error', cb)
		.pipe(zlib.Unzip())
		.on('error', cb)
		.pipe(tar.Extract({ path: dest, strip: 1 }))
		.on('error', cb)
		.on('close', function () {
			fs.unlink(src);
			cb();
		});
};

util.build = function (url, dest, cb) {
	if (process.platform === 'darwin' || process.platform === 'linux') {
		cb = cb || function () {};
		var self = this;
		var file = path.join(this.tmpdir(), path.basename(url));
		var tmp = path.join(this.tmpdir(), path.basename(file, '.tar.gz'));
		var buildScript = './configure --disable-gifview --disable-gifdiff' +
						  ' --prefix=' + tmp + ' --bindir=' + dest +
						  ' && ' + 'make install';

		try {
			which.sync('make');
		} catch (err) {
			return cb(new Error('make not found'));
		}

		return this.fetch(url, file, function (err) {
			if (err) return cb(new Error(err.message));

			self.extract(file, tmp, function (err) {
				if (err) return cb(new Error(err.message));

				exec(buildScript, { cwd: tmp }, function (err) {
					if (err) return cb(new Error(err.message));
					cb();
				});
			});
		});
	} else {
		return cb(new Error('Building is not supported on ' + process.platform));
	}
}

util.request = request.defaults({ proxy: proxy });
