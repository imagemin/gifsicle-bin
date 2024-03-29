# gifsicle-bin ![GitHub Actions Status](https://github.com/imagemin/gifsicle-bin/workflows/test/badge.svg?branch=main)

> gifsicle manipulates GIF image files in many different ways. Depending on command line options, it can merge several GIFs into a GIF animation; explode an animation into its component frames; change individual frames in an animation; turn interlacing on and off; add transparency and much more.

You probably want [`imagemin-gifsicle`](https://github.com/imagemin/imagemin-gifsicle) instead.

## Install

```
$ npm install gifsicle
```

## Usage

```js
import {execFile} from 'node:child_process';
import gifsicle from 'gifsicle';

execFile(gifsicle, ['-o', 'output.gif', 'input.gif'], error => {
	console.log('Image minified!');
});
```

## CLI

```
$ npm install --global gifsicle
```

```
$ gifsicle --help
```
