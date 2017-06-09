# optical-properties [![unstable](http://badges.github.io/stability-badges/dist/unstable.svg)](http://github.com/badges/stability-badges)

Get optical params for a character, such as center of mass and area. Useful to do kerning, to normalize character size or to align vertically/horizontally.

See [demo](https://dfcreative.github.io/optical-properties).

[![npm install optical-properties](https://nodei.co/npm/optical-properties.png?mini=true)](https://npmjs.org/package/optical-properties/)

```js
const optics = require('optical-properties')

//get optical params
let props = optics('▲')

//draw normalized character
ctx.fontSize = size * props.scale
ctx.fillText('▲', x + props.x, y + props.y)

```

### let props = optics(character|canvas|imageData, options?)

Measures optical properties of a character, canvas or imageData based on the options.

Options:

* `size` − size of canvas to use, bigger is slower but more precise and vice-versa.
* `fontFamily` − font family to use for the character, defaults to `sans-serif`.
* `fontSize` − size of glyph.

Returns:

* `center` − coordinates of optical center as `[cx, cy]`
* `bounds` − character bounding box `[left, top, right, bottom]`
* `radius` − distance from the optical center to the outmost point
