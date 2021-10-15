# gifsicle-bin

> gifsicle manipulates GIF image files in many different ways. Depending on command line options, it can merge several GIFs into a GIF animation; explode an animation into its component frames; change individual frames in an animation; turn interlacing on and off; add transparency and much more.

You probably want [`imagemin-gifsicle`](https://github.com/imagemin/imagemin-gifsicle) instead.

## Install

```
$ npm install gifsicle
```

If you are pulling through your own proxy, you can get `GITHUB_RAW_URL` during install
to ensure that the prebuilt binary is also pulled through your mirror.

## Usage

```js
const {execFile} = require('child_process');
const gifsicle = require('gifsicle');

execFile(gifsicle, ['-o', 'output.gif', 'input.gif'], err => {
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
