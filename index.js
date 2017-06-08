/**
 * @module optical-properties
 */
'use strict'

module.exports = measure

var cache = {},
	canvas = document.createElement('canvas'),
	ctx = canvas.getContext('2d')

canvas.width = 200, canvas.height = 200

measure.canvas = canvas

//returns character [x, y, scale] optical params
function measure (char, options) {
	var data, w, h, params

	//figure out argument imageData
	if (typeof char === 'string') {
		if (cache[char]) return cache[char]
		data = getCharImageData(char, options)
		w = data.width, h = data.height
	}
	else if (char instanceof Canvas) {
		w = char.width, h = char.height
		data = char.getImageData(0, 0, char.width, char.height)
	}
	else if (char instanceof ImageData) {
		w = char.width, h = char.height
		data = char
	}

	var params = getOpticalParams(data)
	// var hullParams = getOpticalParams(toConvexHull(data))

	return params
}

//draw character in canvas and get it's imagedata
function getCharImageData (char, options) {
	if (!options) options = {}
	var family = options.family || 'sans-serif'
	var w = canvas.width, h = canvas.height

	ctx.fillStyle = '#000'
	ctx.fillRect(0, 0, w, h)

	ctx.font = w/2 + 'px ' + family
	ctx.textBaseline = 'middle'
	ctx.textAlign = 'center'
	ctx.fillStyle = 'white'
	ctx.fillText(char, w/2, h/2)

	return ctx.getImageData(0, 0, w, h)
}


//walks over imagedata, returns params
function getOpticalParams (data) {
	var buf = data.data, w = data.width, h = data.height

	var x, y, r, i, j, sum, area, hullArea, xSum, ySum, rowAvg = Array(h), rowAvgX = Array(h), cx, cy, bounds, rowAvgArea = Array(h), top = 0, bottom = 0, left = w, right = 0

	for (y = 0; y < h; y++) {
		sum = 0, area = 0, hullArea = 0, xSum = 0, j = y*4*w

		bounds = getBounds(buf.subarray(j, j + 4*w), 4)

		if (bounds[0] === bounds[1]) {
			continue
		}
		else {
			if (!top) top = y
			bottom = y
		}

		for (x = bounds[0]; x < bounds[1]; x++) {
			i = x*4
			r = buf[j + i]
			sum += r
			xSum += x*r
			area += r*r
		}

		rowAvgArea[y] = area === 0 ? 0 : area/w
		rowAvg[y] = sum === 0 ? 0 : sum/w
		rowAvgX[y] = sum === 0 ? 0 : xSum/sum

		if (bounds[0] < left) left = bounds[0]
		if (bounds[1] > right) right = bounds[1]
	}

	sum = 0, ySum = 0, xSum = 0
	for (y = 0; y < h; y++) {
		if (!rowAvg[y]) continue;

		ySum += rowAvg[y]*y
		sum += rowAvg[y]
		xSum += rowAvgX[y]*rowAvg[y]
	}

	cy = ySum/sum
	cx = xSum/sum

	return {
		center: [cx, cy],
		box: [left, top, right, bottom],
		area: 0
	}
}

//get [leftId, rightId] pair of bounding values for an array
function getBounds (arr, stride) {
	var left = 0, right = arr.length, i = 0

	if (!stride) stride = 4

	//find left non-zero value
	while (!arr[i] && i < right) {
		i+=stride
	}
	left = i

	//find right non-zero value
	i = arr.length
	while (!arr[i] && i > left) {
		i-=stride
	}
	right = i

	return [left/stride, right/stride]
}

//convert image data to convex hull
function toConvexHull (data) {
	for (y = 0; y < h; y++) {
		j = y*4*w

		bounds = getBounds(buf.subarray(j, j + 4*w), 4)

		if (bounds[0] === bounds[1]) continue

		//find left/right extremums
		leftMax = 0, rightMax = 0, left = bounds[0], right = bounds[1]
		for (x = left; x < right; x++) {
			i = x*4
			r = data[j + i]
			if (r > leftMax) {
				leftMax = r
				left = x
			}
			else {
				break
			}
		}
		for (x = right; x > left; x--) {
			i = x*4
			r = data[j + i]
			if (r > rightMax) {
				rightMax = r
				right = x
			}
			else {
				break
			}
		}
	}
}
