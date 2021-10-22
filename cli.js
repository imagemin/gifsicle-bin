#!/usr/bin/env node
import process from 'node:process';
import execa from 'execa';
import gifsicle from './index.js';

execa(gifsicle, process.argv.slice(2), {stdio: 'inherit'});
