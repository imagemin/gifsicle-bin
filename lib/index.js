import fs from 'node:fs';
import process from 'node:process';
import {fileURLToPath} from 'node:url';
import BinWrapper from 'bin-wrapper';

const pkg = JSON.parse(fs.readFileSync(new URL('../package.json', import.meta.url)));

const baseUrl = process.env.npm_config_gifsicle_bin_host_mirror || 'https://raw.githubusercontent.com/imagemin/gifsicle-bin';

const url =  `${baseUrl}/v${pkg.version}/vendor/`;

const binWrapper = new BinWrapper()
	.src(`${url}macos/gifsicle`, 'darwin')
	.src(`${url}linux/x86/gifsicle`, 'linux', 'x86')
	.src(`${url}linux/x64/gifsicle`, 'linux', 'x64')
	.src(`${url}freebsd/x86/gifsicle`, 'freebsd', 'x86')
	.src(`${url}freebsd/x64/gifsicle`, 'freebsd', 'x64')
	.src(`${url}win/x86/gifsicle.exe`, 'win32', 'x86')
	.src(`${url}win/x64/gifsicle.exe`, 'win32', 'x64')
	.dest(fileURLToPath(new URL('../vendor', import.meta.url)))
	.use(process.platform === 'win32' ? 'gifsicle.exe' : 'gifsicle');

export default binWrapper;
