const {join} = require('path');
const util = require('util');
const fs = require('fs');
const exec = util.promisify(require('child_process').exec);

const access = util.promisify(fs.access);
const binBuild = require('bin-build');

const sourceUrl = 'https://github.com/kohler/gifsicle/archive/v1.90.tar.gz';

/**
 * Generate a shell command to build gifsicle
 * @param {String} binPath - The path where binary will be located
 * @returns {String} The string representaton of a shell command
 */
const buildConfig = binPath => [
	'./configure --disable-gifview --disable-gifdiff',
	`--prefix="${binPath}" --bindir="${binPath}"`
].join(' ');

/**
 * @description Checks if the path is a file, and is executable
 *
 * @param {String} path - The path of the binary to check
 * @returns {Boolean} Is executable
 */
async function checkIfExecutable(path) {
	try {
		await access(path, fs.constants.F_OK | fs.constants.R_OK | fs.constants.X_OK);
		return true;
	} catch (error) {
		return false;
	}
}

/**
 * @description Script to build the binary according to the platform
 *
 * @param {String} binPath - Where the binary will be located
 * @returns  {Promise} The binBuild instance
 */
function buildBinary(binPath) {
	return binBuild.url(sourceUrl, [
		'autoreconf -ivf',
		buildConfig(binPath),
		'make install'
	]);
}

/**
 * @description Makes the gifsicle executable
 *
 * @param {String} binPath - The base path where gifsicle will be found
 */
async function makeExecutable(binPath) {
	const bin = join(binPath, 'gifsicle');
	if (checkIfExecutable(bin)) {
		return;
	}
	try {
		await exec(`chmod +x ${bin}`);
	} catch (error) {
		console.error({error, binPath});
	}
}

module.exports = {
	sourceUrl,
	buildConfig,
	buildBinary,
	makeExecutable
};
