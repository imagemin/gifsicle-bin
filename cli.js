#!/usr/bin/env node
'use strict';
const spawn = require('child_process').spawn;
const gifsicle = require('.');

const input = process.argv.slice(2);

spawn(gifsicle, input, {stdio: 'inherit'})
	.on('exit', process.exit);
